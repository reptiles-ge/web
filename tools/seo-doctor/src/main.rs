use chrono::{DateTime, Duration, NaiveDate, Utc};
use futures::stream::{self, StreamExt};
use reqwest::header::HeaderMap;
use reqwest::{Client, StatusCode};
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::{BTreeMap, BTreeSet};
use std::env;
use std::fs;
use std::path::Path;
use std::time::Duration as StdDuration;
use url::Url;

const REPORT_PATH: &str = ".seo/doctor-report.json";
const MAX_PRINTED_DIAGNOSTICS: usize = 50;
const FETCH_CONCURRENCY: usize = 24;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SeoGraph {
    production_origin: String,
    default_locale: String,
    locales: Vec<String>,
    routes: Vec<ExpectedRoute>,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ExpectedRoute {
    allow_orphan: bool,
    alternates: BTreeMap<String, String>,
    canonical_url: String,
    in_sitemap: bool,
    locale: String,
    path: String,
    #[serde(rename = "type")]
    route_type: String,
}

#[derive(Clone, Debug)]
struct FetchResult {
    body: String,
    content_type: String,
    headers: BTreeMap<String, Vec<String>>,
    location: Option<String>,
    path: String,
    status: u16,
}

#[derive(Clone, Debug)]
struct PageModel {
    anchors: Vec<String>,
    canonicals: Vec<String>,
    descriptions: Vec<String>,
    h1s: Vec<String>,
    hreflangs: Vec<HrefLang>,
    html_lang: Option<String>,
    image_alts: Vec<Option<String>>,
    jsonld: Vec<String>,
    og: BTreeMap<String, Vec<String>>,
    path: String,
    robots: Vec<String>,
    title: Vec<String>,
    x_robots: Vec<String>,
}

#[derive(Clone, Debug)]
struct HrefLang {
    href: String,
    lang: String,
}

#[derive(Clone, Debug, Serialize)]
struct Diagnostic {
    code: &'static str,
    locale: Option<String>,
    message: String,
    path: String,
    route_type: Option<String>,
    severity: Severity,
}

#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(rename_all = "lowercase")]
enum Severity {
    Fatal,
    Warning,
}

#[derive(Serialize)]
struct Summary {
    crawled: usize,
    expected_routes: usize,
    fatal: usize,
    warning: usize,
}

#[derive(Serialize)]
struct Report {
    diagnostics: Vec<Diagnostic>,
    summary: Summary,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();
    let graph = match read_graph(&args.graph_path) {
        Ok(graph) => graph,
        Err(error) => exit_with_error(&error),
    };
    let report = match run(&graph, &args.base_url).await {
        Ok(report) => report,
        Err(error) => exit_with_error(&error),
    };

    if let Err(error) = write_report(&report) {
        exit_with_error(&format!("{REPORT_PATH}: {error}"));
    }

    if args.print_json {
        println!("{}", serde_json::to_string_pretty(&report).unwrap());
    } else {
        print_human(&report);
    }

    if report.summary.fatal > 0 {
        std::process::exit(1);
    }
}

struct Args {
    base_url: String,
    graph_path: String,
    print_json: bool,
}

impl Args {
    fn parse() -> Self {
        let mut base_url = "http://127.0.0.1:3000".to_string();
        let mut graph_path = ".seo/graph.json".to_string();
        let mut print_json = false;
        let mut args = env::args().skip(1);

        while let Some(arg) = args.next() {
            if arg == "--json" {
                print_json = true;
            } else if arg == "--base-url" {
                base_url = args.next().unwrap_or_else(|| {
                    exit_with_error("--base-url needs a value");
                });
            } else {
                graph_path = arg;
            }
        }

        Self {
            base_url: trim_origin(&base_url),
            graph_path,
            print_json,
        }
    }
}

async fn run(graph: &SeoGraph, base_url: &str) -> Result<Report, String> {
    let client = Client::builder()
        .redirect(reqwest::redirect::Policy::none())
        .timeout(StdDuration::from_secs(12))
        .user_agent("reptiles-seo-doctor/0.1")
        .build()
        .map_err(|error| error.to_string())?;

    let expected_paths: BTreeSet<String> = graph
        .routes
        .iter()
        .map(|route| normalize_path(&route.path))
        .collect();
    let expected_by_path: BTreeMap<String, ExpectedRoute> = graph
        .routes
        .iter()
        .map(|route| (normalize_path(&route.path), route.clone()))
        .collect();

    let mut fetches = fetch_all(&client, base_url, &expected_paths).await;
    let robots = fetch_one(&client, base_url, "/robots.txt").await;
    let sitemap = fetch_one(&client, base_url, "/sitemap.xml").await;

    let mut models = parse_models(&fetches);
    let sitemap_entries = sitemap_entries(&sitemap.body, graph, base_url);
    let mut discovered = BTreeSet::new();

    for model in models.values() {
        for href in &model.anchors {
            if let Some(link) =
                internal_path_from_href(href, &model.path, &graph.production_origin, base_url)
            {
                discovered.insert(link);
            }
        }
        for href in model
            .canonicals
            .iter()
            .chain(model.hreflangs.iter().map(|item| &item.href))
        {
            if let Some(link) =
                internal_path_from_href(href, &model.path, &graph.production_origin, base_url)
            {
                discovered.insert(normalize_path(&link));
            }
        }
        for value in &model.jsonld {
            if let Ok(json) = serde_json::from_str::<Value>(value) {
                collect_jsonld_internal_urls(
                    &json,
                    &model.path,
                    &graph.production_origin,
                    base_url,
                    &mut discovered,
                );
            }
        }
    }

    for entry in &sitemap_entries.urls {
        if let Some(path) = path_from_absolute_url(&entry.loc, &graph.production_origin) {
            discovered.insert(path);
        }
    }

    let missing: BTreeSet<String> = discovered
        .difference(&fetches.keys().cloned().collect())
        .cloned()
        .collect();
    let extra = fetch_all(&client, base_url, &missing).await;
    fetches.extend(extra);
    models = parse_models(&fetches);

    let mut diagnostics = Vec::new();
    check_routes(
        graph,
        &expected_by_path,
        &fetches,
        &models,
        &mut diagnostics,
    );
    check_sitemap(
        graph,
        &expected_by_path,
        &fetches,
        &models,
        &sitemap,
        &sitemap_entries,
        &mut diagnostics,
    );
    check_robots(graph, &expected_by_path, &robots, &mut diagnostics);
    check_internal_links(
        graph,
        &expected_by_path,
        &fetches,
        &models,
        &mut diagnostics,
    );
    check_orphans(
        graph,
        &expected_by_path,
        &fetches,
        &models,
        &mut diagnostics,
    );
    check_duplicates(&expected_by_path, &models, &mut diagnostics);

    diagnostics.sort_by(|a, b| {
        a.severity
            .cmp(&b.severity)
            .then_with(|| a.path.cmp(&b.path))
            .then_with(|| a.code.cmp(b.code))
            .then_with(|| a.message.cmp(&b.message))
    });
    diagnostics.dedup_by(|a, b| {
        a.severity == b.severity && a.code == b.code && a.path == b.path && a.message == b.message
    });

    let fatal = diagnostics
        .iter()
        .filter(|item| item.severity == Severity::Fatal)
        .count();
    let warning = diagnostics.len() - fatal;

    Ok(Report {
        diagnostics,
        summary: Summary {
            crawled: fetches.len(),
            expected_routes: graph.routes.len(),
            fatal,
            warning,
        },
    })
}

fn check_routes(
    graph: &SeoGraph,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    models: &BTreeMap<String, PageModel>,
    diagnostics: &mut Vec<Diagnostic>,
) {
    for (path, route) in expected_by_path {
        let Some(fetch) = fetches.get(path) else {
            fatal(
                diagnostics,
                "route-not-found",
                path,
                Some(route),
                "expected route was not fetched".to_string(),
            );
            continue;
        };
        if fetch.status == 404 {
            fatal(
                diagnostics,
                "route-not-found",
                path,
                Some(route),
                "expected indexable route returned 404".to_string(),
            );
            continue;
        }
        if fetch.status >= 500 {
            fatal(
                diagnostics,
                "route-http-error",
                path,
                Some(route),
                format!("expected route returned HTTP {}", fetch.status),
            );
            continue;
        }
        if is_local_rewrite_redirect(fetch) {
            continue;
        }
        if is_redirect(fetch.status) {
            fatal(
                diagnostics,
                "unexpected-redirect",
                path,
                Some(route),
                format!(
                    "expected canonical route redirects to {}",
                    fetch.location.as_deref().unwrap_or("<missing Location>")
                ),
            );
            continue;
        }
        if fetch.status != 200 {
            fatal(
                diagnostics,
                "route-http-error",
                path,
                Some(route),
                format!("expected route returned HTTP {}", fetch.status),
            );
            continue;
        }

        let Some(model) = models.get(path) else {
            fatal(
                diagnostics,
                "html-missing",
                path,
                Some(route),
                "expected route returned no parseable HTML".to_string(),
            );
            continue;
        };

        check_title(route, model, diagnostics);
        check_description(route, model, diagnostics);
        check_canonical(graph, route, model, diagnostics);
        check_robots_meta(route, fetch, model, diagnostics);
        check_hreflang(graph, route, expected_by_path, fetches, models, diagnostics);
        check_html_lang(route, model, diagnostics);
        check_jsonld(graph, route, expected_by_path, fetches, model, diagnostics);
        check_open_graph(route, model, diagnostics);
        check_h1(route, model, diagnostics);
        check_images(route, model, diagnostics);
    }
}

fn check_title(route: &ExpectedRoute, model: &PageModel, diagnostics: &mut Vec<Diagnostic>) {
    if model.title.is_empty() {
        fatal(
            diagnostics,
            "title-missing",
            &route.path,
            Some(route),
            "indexable page has no <title>".to_string(),
        );
    } else if model.title.iter().all(|title| title.trim().is_empty()) {
        fatal(
            diagnostics,
            "title-empty",
            &route.path,
            Some(route),
            "indexable page has an empty <title>".to_string(),
        );
    } else if model.title.len() > 1 {
        fatal(
            diagnostics,
            "title-multiple",
            &route.path,
            Some(route),
            "indexable page has multiple <title> elements".to_string(),
        );
    }
}

fn check_description(route: &ExpectedRoute, model: &PageModel, diagnostics: &mut Vec<Diagnostic>) {
    if model.descriptions.is_empty() {
        fatal(
            diagnostics,
            "meta-description-missing",
            &route.path,
            Some(route),
            "indexable page has no meta description".to_string(),
        );
    } else if model
        .descriptions
        .iter()
        .all(|description| description.trim().is_empty())
    {
        fatal(
            diagnostics,
            "meta-description-empty",
            &route.path,
            Some(route),
            "indexable page has an empty meta description".to_string(),
        );
    } else if model.descriptions.len() > 1 {
        fatal(
            diagnostics,
            "meta-description-multiple",
            &route.path,
            Some(route),
            "indexable page has multiple meta descriptions".to_string(),
        );
    }
}

fn check_canonical(
    graph: &SeoGraph,
    route: &ExpectedRoute,
    model: &PageModel,
    diagnostics: &mut Vec<Diagnostic>,
) {
    if model.canonicals.is_empty() {
        fatal(
            diagnostics,
            "canonical-missing",
            &route.path,
            Some(route),
            "indexable page has no canonical link".to_string(),
        );
        return;
    }
    if model.canonicals.len() > 1 {
        fatal(
            diagnostics,
            "canonical-multiple",
            &route.path,
            Some(route),
            "indexable page has multiple canonical links".to_string(),
        );
        return;
    }
    let actual = model.canonicals[0].trim();
    let Ok(url) = Url::parse(actual) else {
        fatal(
            diagnostics,
            "canonical-invalid-url",
            &route.path,
            Some(route),
            format!("canonical is not an absolute URL: {actual}"),
        );
        return;
    };
    if origin(&url) != graph.production_origin {
        fatal(
            diagnostics,
            "canonical-wrong-origin",
            &route.path,
            Some(route),
            format!("canonical origin is `{}`", origin(&url)),
        );
    }
    if actual != route.canonical_url {
        fatal(
            diagnostics,
            "canonical-mismatch",
            &route.path,
            Some(route),
            format!("expected `{}`, got `{actual}`", route.canonical_url),
        );
    }
    if let Some(locale) = locale_from_path(url.path(), &graph.default_locale, &graph.locales) {
        if locale != route.locale {
            fatal(
                diagnostics,
                "canonical-locale-mismatch",
                &route.path,
                Some(route),
                format!(
                    "canonical locale `{locale}` differs from route locale `{}`",
                    route.locale
                ),
            );
        }
    }
}

fn check_robots_meta(
    route: &ExpectedRoute,
    fetch: &FetchResult,
    model: &PageModel,
    diagnostics: &mut Vec<Diagnostic>,
) {
    let meta_noindex = model
        .robots
        .iter()
        .any(|value| has_robot_token(value, "noindex"));
    if meta_noindex {
        fatal(
            diagnostics,
            "unexpected-noindex",
            &route.path,
            Some(route),
            "indexable route renders meta robots noindex".to_string(),
        );
    }
    let header_noindex = model
        .x_robots
        .iter()
        .chain(fetch.headers.get("x-robots-tag").into_iter().flatten())
        .any(|value| has_robot_token(value, "noindex"));
    if header_noindex {
        fatal(
            diagnostics,
            "robots-header-conflict",
            &route.path,
            Some(route),
            "indexable route sends X-Robots-Tag noindex".to_string(),
        );
    }
}

fn check_hreflang(
    graph: &SeoGraph,
    route: &ExpectedRoute,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    models: &BTreeMap<String, PageModel>,
    diagnostics: &mut Vec<Diagnostic>,
) {
    let mut by_lang: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
    let hreflangs = model_hreflangs(route, models);
    for item in &hreflangs {
        by_lang
            .entry(item.lang.as_str())
            .or_default()
            .push(item.href.as_str());
    }

    for item in &hreflangs {
        if item.lang != "x-default" && !graph.locales.iter().any(|locale| locale == &item.lang) {
            fatal(
                diagnostics,
                "hreflang-invalid-code",
                &route.path,
                Some(route),
                format!("unexpected hreflang `{}`", item.lang),
            );
        }
    }

    for (lang, hrefs) in &by_lang {
        if hrefs.len() > 1 {
            fatal(
                diagnostics,
                "hreflang-duplicate",
                &route.path,
                Some(route),
                format!("hreflang `{lang}` appears {} times", hrefs.len()),
            );
        }
    }

    for (lang, expected_url) in &route.alternates {
        let Some(actuals) = by_lang.get(lang.as_str()) else {
            fatal(
                diagnostics,
                if lang == "x-default" {
                    "x-default-missing"
                } else {
                    "hreflang-missing"
                },
                &route.path,
                Some(route),
                format!("missing hreflang `{lang}`"),
            );
            continue;
        };
        let actual = actuals[0];
        if actual != expected_url {
            fatal(
                diagnostics,
                if lang == "x-default" {
                    "x-default-invalid"
                } else {
                    "hreflang-wrong-locale"
                },
                &route.path,
                Some(route),
                format!("hreflang `{lang}` expected `{expected_url}`, got `{actual}`"),
            );
        }
        let Some(target_path) = path_from_absolute_url(expected_url, &graph.production_origin)
        else {
            fatal(
                diagnostics,
                "hreflang-target-missing",
                &route.path,
                Some(route),
                format!("hreflang `{lang}` is not a production URL"),
            );
            continue;
        };
        if expected_route_is_unhealthy(&target_path, expected_by_path, fetches) {
            continue;
        }
        match fetches.get(&target_path) {
            Some(fetch) if fetch_is_healthy_expected_route(fetch) => {}
            Some(fetch) if is_redirect(fetch.status) => fatal(
                diagnostics,
                "hreflang-target-redirect",
                &route.path,
                Some(route),
                format!(
                    "hreflang `{lang}` target redirects with HTTP {}",
                    fetch.status
                ),
            ),
            Some(fetch) if fetch.status == 404 => fatal(
                diagnostics,
                "hreflang-target-404",
                &route.path,
                Some(route),
                format!("hreflang `{lang}` target returned 404"),
            ),
            Some(fetch) if fetch.status >= 500 => fatal(
                diagnostics,
                "hreflang-target-404",
                &route.path,
                Some(route),
                format!("hreflang `{lang}` target returned HTTP {}", fetch.status),
            ),
            _ => fatal(
                diagnostics,
                "hreflang-target-missing",
                &route.path,
                Some(route),
                format!("hreflang `{lang}` target was not crawled"),
            ),
        }
        if lang != "x-default" {
            let Some(target_route) = expected_by_path.get(&target_path) else {
                continue;
            };
            let Some(target_model) = models.get(&target_path) else {
                continue;
            };
            let reciprocal = target_model
                .hreflangs
                .iter()
                .any(|item| item.lang == route.locale && item.href == route.canonical_url);
            if !reciprocal {
                fatal(
                    diagnostics,
                    "hreflang-reciprocal-missing",
                    &route.path,
                    Some(route),
                    format!(
                        "`{}` does not link back to `{}` as hreflang `{}`",
                        target_route.path, route.canonical_url, route.locale
                    ),
                );
            }
        }
    }

    let self_ok = by_lang
        .get(route.locale.as_str())
        .is_some_and(|hrefs| hrefs.iter().any(|href| *href == route.canonical_url));
    if !self_ok {
        fatal(
            diagnostics,
            "hreflang-self-missing",
            &route.path,
            Some(route),
            "route does not include a self hreflang".to_string(),
        );
    }
}

fn check_html_lang(route: &ExpectedRoute, model: &PageModel, diagnostics: &mut Vec<Diagnostic>) {
    let Some(lang) = &model.html_lang else {
        fatal(
            diagnostics,
            "html-lang-missing",
            &route.path,
            Some(route),
            "page has no html lang".to_string(),
        );
        return;
    };
    if lang != &route.locale {
        fatal(
            diagnostics,
            "html-lang-mismatch",
            &route.path,
            Some(route),
            format!("expected html lang `{}`, got `{lang}`", route.locale),
        );
    }
}

fn check_jsonld(
    graph: &SeoGraph,
    route: &ExpectedRoute,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    model: &PageModel,
    diagnostics: &mut Vec<Diagnostic>,
) {
    for block in &model.jsonld {
        if block.trim().is_empty() {
            fatal(
                diagnostics,
                "jsonld-empty",
                &route.path,
                Some(route),
                "JSON-LD block is empty".to_string(),
            );
            continue;
        }
        let json = match serde_json::from_str::<Value>(block) {
            Ok(value) => value,
            Err(error) => {
                fatal(
                    diagnostics,
                    "jsonld-invalid-json",
                    &route.path,
                    Some(route),
                    format!("JSON-LD does not parse: {error}"),
                );
                continue;
            }
        };
        validate_jsonld_urls(graph, route, expected_by_path, fetches, &json, diagnostics);
        validate_breadcrumb(graph, route, expected_by_path, fetches, &json, diagnostics);
    }
}

fn validate_jsonld_urls(
    graph: &SeoGraph,
    route: &ExpectedRoute,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    json: &Value,
    diagnostics: &mut Vec<Diagnostic>,
) {
    validate_jsonld_page_identity(route, json, diagnostics);

    let mut urls = Vec::new();
    collect_url_fields(json, &mut urls);
    for url in urls {
        let Some(path) = internal_path_from_href(&url, &route.path, &graph.production_origin, "")
        else {
            continue;
        };
        let normalized = normalize_path(&path);
        if expected_route_is_unhealthy(&normalized, expected_by_path, fetches) {
            continue;
        }
        if !expected_by_path.contains_key(&normalized) && !fetches.contains_key(&normalized) {
            continue;
        }
        if let Some(fetch) = fetches.get(&normalized) {
            if fetch.status == 404 {
                fatal(
                    diagnostics,
                    "jsonld-internal-url-broken",
                    &route.path,
                    Some(route),
                    format!("JSON-LD internal URL `{url}` returns 404"),
                );
            } else if is_redirect(fetch.status) && !is_local_rewrite_redirect(fetch) {
                fatal(
                    diagnostics,
                    "jsonld-internal-url-broken",
                    &route.path,
                    Some(route),
                    format!("JSON-LD internal URL `{url}` redirects"),
                );
            } else if fetch.status >= 500 {
                fatal(
                    diagnostics,
                    "jsonld-internal-url-broken",
                    &route.path,
                    Some(route),
                    format!("JSON-LD internal URL `{url}` returns HTTP {}", fetch.status),
                );
            }
        }
    }
}

fn validate_breadcrumb(
    graph: &SeoGraph,
    route: &ExpectedRoute,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    json: &Value,
    diagnostics: &mut Vec<Diagnostic>,
) {
    for object in flatten_json_objects(json) {
        if schema_type(object.get("@type")).as_deref() != Some("BreadcrumbList") {
            continue;
        }
        let Some(items) = object.get("itemListElement").and_then(Value::as_array) else {
            continue;
        };
        let mut expected_position = 1_i64;
        for item in items {
            let Some(position) = item.get("position").and_then(Value::as_i64) else {
                fatal(
                    diagnostics,
                    "breadcrumb-position-invalid",
                    &route.path,
                    Some(route),
                    "breadcrumb item is missing numeric position".to_string(),
                );
                continue;
            };
            if position != expected_position {
                fatal(
                    diagnostics,
                    "breadcrumb-position-invalid",
                    &route.path,
                    Some(route),
                    format!("breadcrumb position expected {expected_position}, got {position}"),
                );
            }
            expected_position += 1;
            if let Some(url) = item.get("item").and_then(Value::as_str) {
                let Some(path) =
                    internal_path_from_href(url, &route.path, &graph.production_origin, "")
                else {
                    continue;
                };
                let normalized = normalize_path(&path);
                if expected_route_is_unhealthy(&normalized, expected_by_path, fetches) {
                    continue;
                }
                if let Some(fetch) = fetches.get(&normalized) {
                    if fetch.status == 404 {
                        fatal(
                            diagnostics,
                            "breadcrumb-target-404",
                            &route.path,
                            Some(route),
                            format!("breadcrumb target `{url}` returned 404"),
                        );
                    } else if is_redirect(fetch.status) && !is_local_rewrite_redirect(fetch) {
                        fatal(
                            diagnostics,
                            "breadcrumb-target-redirect",
                            &route.path,
                            Some(route),
                            format!("breadcrumb target `{url}` redirects"),
                        );
                    }
                } else {
                    fatal(
                        diagnostics,
                        "breadcrumb-target-invalid",
                        &route.path,
                        Some(route),
                        format!("breadcrumb target `{url}` was not crawled"),
                    );
                }
            }
        }
    }
}

fn check_open_graph(route: &ExpectedRoute, model: &PageModel, diagnostics: &mut Vec<Diagnostic>) {
    for field in ["og:title", "og:description", "og:image", "og:url"] {
        if !model.og.contains_key(field) {
            warning(
                diagnostics,
                match field {
                    "og:title" => "og-title-missing",
                    "og:description" => "og-description-missing",
                    "og:image" => "og-image-missing",
                    _ => "og-url-missing",
                },
                &route.path,
                Some(route),
                format!("missing {field}"),
            );
        }
    }
    if let Some(urls) = model.og.get("og:url") {
        for url in urls {
            if url != &route.canonical_url {
                warning(
                    diagnostics,
                    "og-url-canonical-mismatch",
                    &route.path,
                    Some(route),
                    format!(
                        "og:url `{url}` differs from canonical `{}`",
                        route.canonical_url
                    ),
                );
            }
        }
    }
}

fn check_h1(route: &ExpectedRoute, model: &PageModel, diagnostics: &mut Vec<Diagnostic>) {
    if model.h1s.is_empty() {
        warning(
            diagnostics,
            "h1-missing",
            &route.path,
            Some(route),
            "important page has no h1".to_string(),
        );
    } else if model.h1s.len() > 1 {
        warning(
            diagnostics,
            "h1-multiple",
            &route.path,
            Some(route),
            format!("page has {} h1 elements", model.h1s.len()),
        );
    }
}

fn check_images(route: &ExpectedRoute, model: &PageModel, diagnostics: &mut Vec<Diagnostic>) {
    if matches!(route.route_type.as_str(), "species" | "news" | "author") {
        let missing = model.image_alts.iter().filter(|alt| alt.is_none()).count();
        if missing > 0 {
            warning(
                diagnostics,
                "important-image-alt-missing",
                &route.path,
                Some(route),
                format!("{missing} rendered images are missing alt attributes"),
            );
        }
    }
}

fn check_sitemap(
    graph: &SeoGraph,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    models: &BTreeMap<String, PageModel>,
    sitemap: &FetchResult,
    entries: &SitemapEntries,
    diagnostics: &mut Vec<Diagnostic>,
) {
    if sitemap.status != 200 {
        fatal(
            diagnostics,
            "sitemap-invalid",
            "/sitemap.xml",
            None,
            format!("sitemap returned HTTP {}", sitemap.status),
        );
        return;
    }
    if let Some(error) = &entries.error {
        fatal(
            diagnostics,
            "sitemap-invalid",
            "/sitemap.xml",
            None,
            error.clone(),
        );
        return;
    }

    let mut seen = BTreeSet::new();
    let now = Utc::now() + Duration::days(1);
    for entry in &entries.urls {
        if !seen.insert(entry.loc.clone()) {
            fatal(
                diagnostics,
                "sitemap-url-duplicate",
                "/sitemap.xml",
                None,
                format!("duplicate sitemap URL `{}`", entry.loc),
            );
        }
        let Some(path) = path_from_absolute_url(&entry.loc, &graph.production_origin) else {
            fatal(
                diagnostics,
                "sitemap-url-wrong-origin",
                "/sitemap.xml",
                None,
                format!("sitemap URL has wrong origin: `{}`", entry.loc),
            );
            continue;
        };
        let Some(fetch) = fetches.get(&path) else {
            fatal(
                diagnostics,
                "sitemap-url-404",
                &path,
                expected_by_path.get(&path),
                "sitemap URL was not crawled".to_string(),
            );
            continue;
        };
        if fetch.status == 404 {
            fatal(
                diagnostics,
                "sitemap-url-404",
                &path,
                expected_by_path.get(&path),
                "sitemap URL returned 404".to_string(),
            );
        } else if fetch.status >= 500 {
            fatal(
                diagnostics,
                "sitemap-url-5xx",
                &path,
                expected_by_path.get(&path),
                format!("sitemap URL returned HTTP {}", fetch.status),
            );
        } else if is_redirect(fetch.status) && !is_local_rewrite_redirect(fetch) {
            fatal(
                diagnostics,
                "sitemap-url-redirect",
                &path,
                expected_by_path.get(&path),
                "sitemap URL redirects".to_string(),
            );
        }
        if let Some(model) = models.get(&path) {
            if page_noindex(fetch, model) {
                fatal(
                    diagnostics,
                    "sitemap-url-noindex",
                    &path,
                    expected_by_path.get(&path),
                    "sitemap URL is noindex".to_string(),
                );
            }
            if model
                .canonicals
                .first()
                .is_some_and(|canonical| canonical != &entry.loc)
            {
                fatal(
                    diagnostics,
                    "sitemap-url-canonicalized-away",
                    &path,
                    expected_by_path.get(&path),
                    format!(
                        "sitemap URL canonicalizes to `{}`",
                        model.canonicals.first().unwrap()
                    ),
                );
            }
        }
        if let Some(lastmod) = &entry.lastmod {
            match parse_seo_date(lastmod) {
                Some(date) if date <= now => {}
                Some(_) => fatal(
                    diagnostics,
                    "sitemap-lastmod-future",
                    &path,
                    expected_by_path.get(&path),
                    format!("sitemap lastmod `{lastmod}` is in the future"),
                ),
                None => fatal(
                    diagnostics,
                    "sitemap-lastmod-invalid",
                    &path,
                    expected_by_path.get(&path),
                    format!("sitemap lastmod `{lastmod}` is invalid"),
                ),
            }
        }
    }

    let sitemap_paths: BTreeSet<String> = entries
        .urls
        .iter()
        .filter_map(|entry| path_from_absolute_url(&entry.loc, &graph.production_origin))
        .collect();
    for (path, route) in expected_by_path {
        if route.in_sitemap && !sitemap_paths.contains(path) {
            fatal(
                diagnostics,
                "indexable-url-not-in-sitemap",
                path,
                Some(route),
                "expected indexable route is missing from sitemap".to_string(),
            );
        }
    }
}

fn check_robots(
    graph: &SeoGraph,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    robots: &FetchResult,
    diagnostics: &mut Vec<Diagnostic>,
) {
    if robots.status != 200 {
        fatal(
            diagnostics,
            "robots-invalid",
            "/robots.txt",
            None,
            format!("robots.txt returned HTTP {}", robots.status),
        );
        return;
    }
    let parsed = RobotsTxt::parse(&robots.body);
    if parsed.blocks_all() {
        fatal(
            diagnostics,
            "robots-blocks-all",
            "/robots.txt",
            None,
            "robots.txt blocks the whole site for User-agent: *".to_string(),
        );
    }
    if parsed.sitemaps.is_empty() {
        fatal(
            diagnostics,
            "robots-sitemap-missing",
            "/robots.txt",
            None,
            "robots.txt has no Sitemap declaration".to_string(),
        );
    }
    for sitemap in &parsed.sitemaps {
        if path_from_absolute_url(sitemap, &graph.production_origin).is_none() {
            fatal(
                diagnostics,
                "robots-sitemap-invalid",
                "/robots.txt",
                None,
                format!("robots sitemap `{sitemap}` is not on production origin"),
            );
        }
    }
    for (path, route) in expected_by_path {
        if parsed.blocks(path) {
            fatal(
                diagnostics,
                "robots-blocks-indexable-route",
                path,
                Some(route),
                "robots.txt blocks an expected indexable route".to_string(),
            );
        }
    }
}

fn check_internal_links(
    graph: &SeoGraph,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    models: &BTreeMap<String, PageModel>,
    diagnostics: &mut Vec<Diagnostic>,
) {
    for (source, model) in models {
        if !expected_by_path.contains_key(source) {
            continue;
        }
        for href in &model.anchors {
            let Some(path) = internal_path_from_href(href, source, &graph.production_origin, "")
            else {
                continue;
            };
            let normalized = normalize_path(&path);
            if expected_route_is_unhealthy(&normalized, expected_by_path, fetches) {
                continue;
            }
            let Some(fetch) = fetches.get(&normalized) else {
                continue;
            };
            if fetch.status == 404 {
                fatal(
                    diagnostics,
                    "internal-link-broken",
                    source,
                    expected_by_path.get(source),
                    format!("internal link `{href}` returns 404"),
                );
            } else if fetch.status >= 500 {
                fatal(
                    diagnostics,
                    "internal-link-5xx",
                    source,
                    expected_by_path.get(source),
                    format!("internal link `{href}` returns HTTP {}", fetch.status),
                );
            } else if is_redirect(fetch.status) && !is_local_rewrite_redirect(fetch) {
                warning(
                    diagnostics,
                    "internal-link-redirect",
                    source,
                    expected_by_path.get(source),
                    format!("internal link `{href}` redirects"),
                );
            }
        }
    }
}

fn check_orphans(
    graph: &SeoGraph,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
    models: &BTreeMap<String, PageModel>,
    diagnostics: &mut Vec<Diagnostic>,
) {
    let expected: BTreeSet<String> = expected_by_path.keys().cloned().collect();
    let mut inbound: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    for (source, model) in models {
        if !expected.contains(source) {
            continue;
        }
        for href in &model.anchors {
            let Some(path) = internal_path_from_href(href, source, &graph.production_origin, "")
            else {
                continue;
            };
            let target = normalize_path(&path);
            if expected.contains(&target) && target != *source {
                inbound.entry(target).or_default().insert(source.clone());
            }
        }
    }
    for (path, route) in expected_by_path {
        if route.allow_orphan || path == "/" {
            continue;
        }
        if expected_route_is_unhealthy(path, expected_by_path, fetches) {
            continue;
        }
        if !models.contains_key(path) {
            continue;
        }
        if inbound.get(path).is_none_or(BTreeSet::is_empty) {
            warning(
                diagnostics,
                "orphan-indexable-page",
                path,
                Some(route),
                "indexable page has no crawlable inbound internal links".to_string(),
            );
        }
    }
}

fn check_duplicates(
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    models: &BTreeMap<String, PageModel>,
    diagnostics: &mut Vec<Diagnostic>,
) {
    let mut titles: BTreeMap<String, Vec<&ExpectedRoute>> = BTreeMap::new();
    let mut descriptions: BTreeMap<String, Vec<&ExpectedRoute>> = BTreeMap::new();
    let mut canonicals: BTreeMap<String, Vec<&ExpectedRoute>> = BTreeMap::new();

    for (path, route) in expected_by_path {
        let Some(model) = models.get(path) else {
            continue;
        };
        if let Some(title) = model.title.first() {
            titles.entry(compact(title)).or_default().push(route);
        }
        if let Some(description) = model.descriptions.first() {
            descriptions
                .entry(compact(description))
                .or_default()
                .push(route);
        }
        if let Some(canonical) = model.canonicals.first() {
            canonicals.entry(canonical.clone()).or_default().push(route);
        }
    }

    for (title, routes) in titles {
        warn_duplicate(diagnostics, "title-duplicate", &title, routes, "title");
    }
    for (description, routes) in descriptions {
        warn_duplicate(
            diagnostics,
            "meta-description-duplicate",
            &description,
            routes,
            "meta description",
        );
    }
    for (canonical, routes) in canonicals {
        let unrelated = unrelated_routes(&routes);
        if unrelated.len() > 1 {
            for route in unrelated {
                fatal(
                    diagnostics,
                    "canonical-target-duplicate",
                    &route.path,
                    Some(route),
                    format!("multiple unrelated routes canonicalize to `{canonical}`"),
                );
            }
        }
    }
}

fn warn_duplicate(
    diagnostics: &mut Vec<Diagnostic>,
    code: &'static str,
    value: &str,
    routes: Vec<&ExpectedRoute>,
    label: &str,
) {
    let unrelated = unrelated_routes(&routes);
    if unrelated.len() <= 1 || value.is_empty() {
        return;
    }
    let paths = unrelated
        .iter()
        .take(6)
        .map(|route| route.path.as_str())
        .collect::<Vec<_>>()
        .join(", ");
    for route in unrelated {
        warning(
            diagnostics,
            code,
            &route.path,
            Some(route),
            format!("duplicate {label} shared with {paths}"),
        );
    }
}

fn unrelated_routes<'a>(routes: &[&'a ExpectedRoute]) -> Vec<&'a ExpectedRoute> {
    let mut seen = BTreeSet::new();
    let mut out = Vec::new();
    for route in routes {
        let key = alternate_group(route);
        if seen.insert(key) {
            out.push(*route);
        }
    }
    out
}

async fn fetch_all(
    client: &Client,
    base_url: &str,
    paths: &BTreeSet<String>,
) -> BTreeMap<String, FetchResult> {
    let mut pending = stream::iter(paths.iter().cloned())
        .map(|path| async move { fetch_one(client, base_url, &path).await })
        .buffer_unordered(FETCH_CONCURRENCY);
    let mut out = BTreeMap::new();
    while let Some(fetch) = pending.next().await {
        out.insert(fetch.path.clone(), fetch);
    }
    out
}

async fn fetch_one(client: &Client, base_url: &str, path: &str) -> FetchResult {
    let path = if path.starts_with('/') {
        path.to_string()
    } else {
        format!("/{path}")
    };
    let url = format!("{base_url}{path}");
    match client.get(&url).send().await {
        Ok(response) => {
            let status = response.status();
            let headers = headers_to_map(response.headers());
            let content_type = response
                .headers()
                .get("content-type")
                .and_then(|value| value.to_str().ok())
                .unwrap_or("")
                .to_string();
            let location = response
                .headers()
                .get("location")
                .and_then(|value| value.to_str().ok())
                .map(str::to_string);
            let body = response.text().await.unwrap_or_default();
            FetchResult {
                body,
                content_type,
                headers,
                location,
                path,
                status: status.as_u16(),
            }
        }
        Err(error) => FetchResult {
            body: String::new(),
            content_type: String::new(),
            headers: BTreeMap::new(),
            location: None,
            path,
            status: if error.is_timeout() {
                StatusCode::GATEWAY_TIMEOUT.as_u16()
            } else {
                StatusCode::BAD_GATEWAY.as_u16()
            },
        },
    }
}

fn headers_to_map(headers: &HeaderMap) -> BTreeMap<String, Vec<String>> {
    let mut out: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for (name, value) in headers {
        out.entry(name.as_str().to_lowercase())
            .or_default()
            .push(value.to_str().unwrap_or("").to_string());
    }
    out
}

fn parse_models(fetches: &BTreeMap<String, FetchResult>) -> BTreeMap<String, PageModel> {
    fetches
        .iter()
        .filter_map(|(path, fetch)| {
            if fetch.status != 200 || !looks_html(fetch) {
                return None;
            }
            Some((path.clone(), parse_page(path, fetch)))
        })
        .collect()
}

fn parse_page(path: &str, fetch: &FetchResult) -> PageModel {
    let document = Html::parse_document(&fetch.body);
    let title = texts(&document, "title");
    let descriptions = meta_values(&document, "name", "description", "content");
    let robots = meta_values(&document, "name", "robots", "content");
    let canonicals = link_values(&document, "canonical", None);
    let hreflangs = hreflang_values(&document);
    let html_lang = attr_first(&document, "html", "lang");
    let anchors = attr_values(&document, "a[href]", "href");
    let h1s = texts(&document, "h1");
    let jsonld = jsonld_blocks(&document);
    let og = open_graph_values(&document);
    let image_alts = image_alts(&document);
    let x_robots = fetch
        .headers
        .get("x-robots-tag")
        .cloned()
        .unwrap_or_default();

    PageModel {
        anchors,
        canonicals,
        descriptions,
        h1s,
        hreflangs,
        html_lang,
        image_alts,
        jsonld,
        og,
        path: path.to_string(),
        robots,
        title,
        x_robots,
    }
}

fn texts(document: &Html, selector: &str) -> Vec<String> {
    let selector = Selector::parse(selector).unwrap();
    document
        .select(&selector)
        .map(|node| compact(&node.text().collect::<Vec<_>>().join(" ")))
        .collect()
}

fn attr_values(document: &Html, selector: &str, attr: &str) -> Vec<String> {
    let selector = Selector::parse(selector).unwrap();
    document
        .select(&selector)
        .filter_map(|node| node.value().attr(attr))
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_string)
        .collect()
}

fn attr_first(document: &Html, selector: &str, attr: &str) -> Option<String> {
    attr_values(document, selector, attr).into_iter().next()
}

fn meta_values(document: &Html, attr: &str, name: &str, value_attr: &str) -> Vec<String> {
    let selector = Selector::parse("meta").unwrap();
    document
        .select(&selector)
        .filter(|node| {
            node.value()
                .attr(attr)
                .is_some_and(|value| value.eq_ignore_ascii_case(name))
        })
        .filter_map(|node| node.value().attr(value_attr))
        .map(str::trim)
        .map(str::to_string)
        .collect()
}

fn link_values(document: &Html, rel: &str, hreflang: Option<&str>) -> Vec<String> {
    let selector = Selector::parse("link[href]").unwrap();
    document
        .select(&selector)
        .filter(|node| {
            node.value().attr("rel").is_some_and(|value| {
                value
                    .split_ascii_whitespace()
                    .any(|token| token.eq_ignore_ascii_case(rel))
            })
        })
        .filter(|node| match hreflang {
            Some(lang) => node
                .value()
                .attr("hreflang")
                .is_some_and(|value| value.eq_ignore_ascii_case(lang)),
            None => true,
        })
        .filter_map(|node| node.value().attr("href"))
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_string)
        .collect()
}

fn hreflang_values(document: &Html) -> Vec<HrefLang> {
    let selector = Selector::parse("link[href][hreflang]").unwrap();
    document
        .select(&selector)
        .filter(|node| {
            node.value().attr("rel").is_some_and(|value| {
                value
                    .split_ascii_whitespace()
                    .any(|token| token.eq_ignore_ascii_case("alternate"))
            })
        })
        .filter_map(|node| {
            Some(HrefLang {
                href: node.value().attr("href")?.trim().to_string(),
                lang: node.value().attr("hreflang")?.trim().to_lowercase(),
            })
        })
        .collect()
}

fn jsonld_blocks(document: &Html) -> Vec<String> {
    let selector = Selector::parse("script[type]").unwrap();
    document
        .select(&selector)
        .filter(|node| {
            node.value()
                .attr("type")
                .is_some_and(|value| value.to_lowercase().contains("application/ld+json"))
        })
        .map(|node| node.text().collect::<Vec<_>>().join(""))
        .collect()
}

fn open_graph_values(document: &Html) -> BTreeMap<String, Vec<String>> {
    let selector = Selector::parse("meta").unwrap();
    let mut out: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for node in document.select(&selector) {
        let name = node
            .value()
            .attr("property")
            .or_else(|| node.value().attr("name"));
        let Some(name) = name else {
            continue;
        };
        if !name.starts_with("og:") {
            continue;
        }
        if let Some(content) = node.value().attr("content") {
            out.entry(name.to_string())
                .or_default()
                .push(content.trim().to_string());
        }
    }
    out
}

fn image_alts(document: &Html) -> Vec<Option<String>> {
    let selector = Selector::parse("main img[src]").unwrap();
    document
        .select(&selector)
        .map(|node| node.value().attr("alt").map(str::to_string))
        .collect()
}

#[derive(Default)]
struct SitemapEntries {
    error: Option<String>,
    urls: Vec<SitemapUrl>,
}

struct SitemapUrl {
    lastmod: Option<String>,
    loc: String,
}

fn sitemap_entries(xml: &str, graph: &SeoGraph, base_url: &str) -> SitemapEntries {
    let doc = match roxmltree::Document::parse(xml) {
        Ok(doc) => doc,
        Err(error) => {
            return SitemapEntries {
                error: Some(error.to_string()),
                urls: Vec::new(),
            };
        }
    };
    let root = doc.root_element().tag_name().name().to_string();
    if root == "urlset" {
        return SitemapEntries {
            error: None,
            urls: parse_urlset(&doc),
        };
    }
    if root == "sitemapindex" {
        let urls = doc
            .descendants()
            .filter(|node| node.tag_name().name() == "loc")
            .filter_map(|node| node.text())
            .filter_map(|loc| path_from_absolute_url(loc.trim(), &graph.production_origin))
            .map(|path| SitemapUrl {
                lastmod: None,
                loc: format!("{}{}", trim_origin(base_url), path),
            })
            .collect();
        return SitemapEntries { error: None, urls };
    }
    SitemapEntries {
        error: Some(format!("unexpected sitemap root `{root}`")),
        urls: Vec::new(),
    }
}

fn parse_urlset(doc: &roxmltree::Document) -> Vec<SitemapUrl> {
    doc.descendants()
        .filter(|node| node.tag_name().name() == "url")
        .filter_map(|url| {
            let loc = url
                .children()
                .find(|child| child.tag_name().name() == "loc")?
                .text()?
                .trim()
                .to_string();
            let lastmod = url
                .children()
                .find(|child| child.tag_name().name() == "lastmod")
                .and_then(|child| child.text())
                .map(|value| value.trim().to_string());
            Some(SitemapUrl { lastmod, loc })
        })
        .collect()
}

#[derive(Default)]
struct RobotsTxt {
    groups: Vec<RobotsGroup>,
    sitemaps: Vec<String>,
}

#[derive(Default)]
struct RobotsGroup {
    agents: Vec<String>,
    rules: Vec<RobotsRule>,
}

struct RobotsRule {
    allow: bool,
    path: String,
}

impl RobotsTxt {
    fn parse(text: &str) -> Self {
        let mut out = RobotsTxt::default();
        let mut current = RobotsGroup::default();
        for raw in text.lines() {
            let line = raw.split('#').next().unwrap_or("").trim();
            if line.is_empty() {
                continue;
            }
            let Some((key, value)) = line.split_once(':') else {
                continue;
            };
            let key = key.trim().to_lowercase();
            let value = value.trim().to_string();
            match key.as_str() {
                "user-agent" => {
                    if !current.agents.is_empty() && !current.rules.is_empty() {
                        out.groups.push(current);
                        current = RobotsGroup::default();
                    }
                    current.agents.push(value.to_lowercase());
                }
                "allow" => current.rules.push(RobotsRule {
                    allow: true,
                    path: value,
                }),
                "disallow" => current.rules.push(RobotsRule {
                    allow: false,
                    path: value,
                }),
                "sitemap" => out.sitemaps.push(value),
                _ => {}
            }
        }
        if !current.agents.is_empty() || !current.rules.is_empty() {
            out.groups.push(current);
        }
        out
    }

    fn blocks_all(&self) -> bool {
        self.groups.iter().any(|group| {
            group.agents.iter().any(|agent| agent == "*")
                && group
                    .rules
                    .iter()
                    .any(|rule| !rule.allow && rule.path.trim() == "/")
        })
    }

    fn blocks(&self, path: &str) -> bool {
        let mut best: Option<&RobotsRule> = None;
        for group in self
            .groups
            .iter()
            .filter(|group| group.agents.iter().any(|agent| agent == "*"))
        {
            for rule in &group.rules {
                if rule.path.is_empty() || !path.starts_with(&rule.path) {
                    continue;
                }
                match best {
                    Some(existing) if existing.path.len() > rule.path.len() => {}
                    Some(existing)
                        if existing.path.len() == rule.path.len()
                            && existing.allow
                            && !rule.allow => {}
                    _ => best = Some(rule),
                }
            }
        }
        best.is_some_and(|rule| !rule.allow)
    }
}

fn collect_jsonld_internal_urls(
    value: &Value,
    current_path: &str,
    production_origin: &str,
    base_url: &str,
    out: &mut BTreeSet<String>,
) {
    let mut urls = Vec::new();
    collect_url_fields(value, &mut urls);
    for url in urls {
        if let Some(path) = internal_path_from_href(&url, current_path, production_origin, base_url)
        {
            out.insert(normalize_path(&path));
        }
    }
}

fn collect_url_fields(value: &Value, out: &mut Vec<String>) {
    match value {
        Value::Array(items) => {
            for item in items {
                collect_url_fields(item, out);
            }
        }
        Value::Object(object) => {
            for (key, value) in object {
                if matches!(
                    key.as_str(),
                    "@id" | "contentUrl" | "item" | "mainEntityOfPage" | "url"
                ) {
                    if let Some(text) = value.as_str() {
                        out.push(text.to_string());
                    }
                }
                collect_url_fields(value, out);
            }
        }
        _ => {}
    }
}

fn validate_jsonld_page_identity(
    route: &ExpectedRoute,
    json: &Value,
    diagnostics: &mut Vec<Diagnostic>,
) {
    match json {
        Value::Array(items) => {
            for item in items {
                validate_jsonld_page_identity(route, item, diagnostics);
            }
        }
        Value::Object(object) => {
            validate_jsonld_page_object(route, object, diagnostics);
            if let Some(items) = object.get("@graph").and_then(Value::as_array) {
                for item in items {
                    if let Some(child) = item.as_object() {
                        validate_jsonld_page_object(route, child, diagnostics);
                    }
                }
            }
        }
        _ => {}
    }
}

fn validate_jsonld_page_object(
    route: &ExpectedRoute,
    object: &serde_json::Map<String, Value>,
    diagnostics: &mut Vec<Diagnostic>,
) {
    let schema_type = schema_type(object.get("@type"));
    if !matches!(
        schema_type.as_deref(),
        Some("WebPage" | "CollectionPage" | "Article" | "NewsArticle")
    ) {
        return;
    }
    let Some(url) = object.get("url").and_then(Value::as_str) else {
        return;
    };
    if url != route.canonical_url {
        fatal(
            diagnostics,
            "jsonld-page-url-mismatch",
            &route.path,
            Some(route),
            format!(
                "JSON-LD page url expected `{}`, got `{url}`",
                route.canonical_url
            ),
        );
    }
}

fn flatten_json_objects(value: &Value) -> Vec<&serde_json::Map<String, Value>> {
    let mut out = Vec::new();
    collect_json_objects(value, &mut out);
    out
}

fn collect_json_objects<'a>(value: &'a Value, out: &mut Vec<&'a serde_json::Map<String, Value>>) {
    match value {
        Value::Array(items) => {
            for item in items {
                collect_json_objects(item, out);
            }
        }
        Value::Object(object) => {
            out.push(object);
            for value in object.values() {
                collect_json_objects(value, out);
            }
        }
        _ => {}
    }
}

fn schema_type(value: Option<&Value>) -> Option<String> {
    match value? {
        Value::String(text) => Some(text.to_string()),
        Value::Array(items) => items
            .iter()
            .find_map(|item| item.as_str().map(str::to_string)),
        _ => None,
    }
}

fn internal_path_from_href(
    href: &str,
    current_path: &str,
    production_origin: &str,
    base_url: &str,
) -> Option<String> {
    let href = href.trim();
    if href.is_empty()
        || href.starts_with('#')
        || href.starts_with("mailto:")
        || href.starts_with("tel:")
        || href.starts_with("javascript:")
    {
        return None;
    }

    let url = if href.starts_with("http://") || href.starts_with("https://") {
        Url::parse(href).ok()?
    } else {
        let base = Url::parse(&format!("{production_origin}{current_path}")).ok()?;
        base.join(href).ok()?
    };
    let url_origin = origin(&url);
    if url_origin != production_origin
        && !base_url.is_empty()
        && url_origin != trim_origin(base_url)
    {
        return None;
    }
    if url_origin != production_origin && base_url.is_empty() {
        return None;
    }
    let path = normalize_path(url.path());
    if should_ignore_path(&path) {
        return None;
    }
    Some(path)
}

fn path_from_absolute_url(url: &str, production_origin: &str) -> Option<String> {
    let parsed = Url::parse(url).ok()?;
    if origin(&parsed) != production_origin {
        return None;
    }
    Some(normalize_path(parsed.path()))
}

fn locale_from_path(path: &str, default_locale: &str, locales: &[String]) -> Option<String> {
    let first = path.trim_start_matches('/').split('/').next().unwrap_or("");
    if locales.iter().any(|locale| locale == first) {
        Some(first.to_string())
    } else {
        Some(default_locale.to_string())
    }
}

fn model_hreflangs(route: &ExpectedRoute, models: &BTreeMap<String, PageModel>) -> Vec<HrefLang> {
    models
        .get(&route.path)
        .map(|model| model.hreflangs.clone())
        .unwrap_or_default()
}

fn expected_route_is_unhealthy(
    path: &str,
    expected_by_path: &BTreeMap<String, ExpectedRoute>,
    fetches: &BTreeMap<String, FetchResult>,
) -> bool {
    let path = normalize_path(path);
    expected_by_path.contains_key(&path)
        && fetches
            .get(&path)
            .is_some_and(|fetch| !fetch_is_healthy_expected_route(fetch))
}

fn page_noindex(fetch: &FetchResult, model: &PageModel) -> bool {
    model
        .robots
        .iter()
        .any(|value| has_robot_token(value, "noindex"))
        || fetch
            .headers
            .get("x-robots-tag")
            .into_iter()
            .flatten()
            .any(|value| has_robot_token(value, "noindex"))
}

fn has_robot_token(value: &str, token: &str) -> bool {
    value
        .split(',')
        .map(|item| item.trim().to_lowercase())
        .any(|item| item == token)
}

fn looks_html(fetch: &FetchResult) -> bool {
    fetch.content_type.contains("text/html")
        || fetch.body.trim_start().starts_with("<!DOCTYPE html")
        || fetch.body.trim_start().starts_with("<html")
}

fn should_ignore_path(path: &str) -> bool {
    if path.starts_with("/api/")
        || path.starts_with("/admin")
        || path.starts_with("/_next/")
        || path.starts_with("/images/")
        || path.starts_with("/fonts/")
    {
        return true;
    }
    let lower = path.to_lowercase();
    [
        ".avif",
        ".css",
        ".gif",
        ".ico",
        ".jpg",
        ".jpeg",
        ".js",
        ".json",
        ".mp3",
        ".pdf",
        ".png",
        ".svg",
        ".webmanifest",
        ".webp",
        ".woff",
        ".woff2",
        ".xml",
    ]
    .iter()
    .any(|suffix| lower.ends_with(suffix))
}

fn parse_seo_date(value: &str) -> Option<DateTime<Utc>> {
    if let Ok(date) = DateTime::parse_from_rfc3339(value) {
        return Some(date.with_timezone(&Utc));
    }
    if let Ok(date) = NaiveDate::parse_from_str(value, "%Y-%m-%d") {
        return Some(date.and_hms_opt(0, 0, 0)?.and_utc());
    }
    None
}

fn is_redirect(status: u16) -> bool {
    (300..400).contains(&status)
}

fn fetch_is_healthy_expected_route(fetch: &FetchResult) -> bool {
    fetch.status == 200 || is_local_rewrite_redirect(fetch)
}

fn is_local_rewrite_redirect(fetch: &FetchResult) -> bool {
    is_redirect(fetch.status)
        && fetch
            .headers
            .get("x-middleware-rewrite")
            .is_some_and(|values| !values.is_empty())
}

fn normalize_path(value: &str) -> String {
    let path = value.split(['?', '#']).next().unwrap_or("").trim();
    let path = if path.starts_with('/') {
        path.to_string()
    } else {
        format!("/{path}")
    };
    path.trim_end_matches('/').to_string().if_empty("/")
}

trait IfEmpty {
    fn if_empty(self, fallback: &str) -> String;
}

impl IfEmpty for String {
    fn if_empty(self, fallback: &str) -> String {
        if self.is_empty() {
            fallback.to_string()
        } else {
            self
        }
    }
}

fn origin(url: &Url) -> String {
    format!("{}://{}", url.scheme(), url.host_str().unwrap_or_default())
        + url
            .port()
            .map(|port| format!(":{port}"))
            .unwrap_or_default()
            .as_str()
}

fn trim_origin(value: &str) -> String {
    value.trim_end_matches('/').to_string()
}

fn compact(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn alternate_group(route: &ExpectedRoute) -> String {
    route
        .alternates
        .get("x-default")
        .cloned()
        .unwrap_or_else(|| route.canonical_url.clone())
}

fn fatal(
    diagnostics: &mut Vec<Diagnostic>,
    code: &'static str,
    path: impl Into<String>,
    route: Option<&ExpectedRoute>,
    message: String,
) {
    diagnostics.push(Diagnostic {
        code,
        locale: route.map(|route| route.locale.clone()),
        message,
        path: path.into(),
        route_type: route.map(|route| route.route_type.clone()),
        severity: Severity::Fatal,
    });
}

fn warning(
    diagnostics: &mut Vec<Diagnostic>,
    code: &'static str,
    path: impl Into<String>,
    route: Option<&ExpectedRoute>,
    message: String,
) {
    diagnostics.push(Diagnostic {
        code,
        locale: route.map(|route| route.locale.clone()),
        message,
        path: path.into(),
        route_type: route.map(|route| route.route_type.clone()),
        severity: Severity::Warning,
    });
}

fn read_graph(path: &str) -> Result<SeoGraph, String> {
    let raw = fs::read_to_string(path).map_err(|error| format!("{path}: {error}"))?;
    serde_json::from_str(&raw).map_err(|error| format!("{path}: {error}"))
}

fn write_report(report: &Report) -> std::io::Result<()> {
    if let Some(parent) = Path::new(REPORT_PATH).parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(
        REPORT_PATH,
        format!("{}\n", serde_json::to_string_pretty(report).unwrap()),
    )
}

fn print_human(report: &Report) {
    println!("SEO Doctor");
    println!(
        "pages: {}  expected: {}",
        report.summary.crawled, report.summary.expected_routes
    );
    println!(
        "fatal: {}  warning: {}",
        report.summary.fatal, report.summary.warning
    );
    println!("report: {REPORT_PATH}");
    if report.diagnostics.is_empty() {
        println!();
        println!("SEO integrity checks passed.");
        return;
    }
    println!();
    for diagnostic in report.diagnostics.iter().take(MAX_PRINTED_DIAGNOSTICS) {
        let severity = match diagnostic.severity {
            Severity::Fatal => "fatal",
            Severity::Warning => "warning",
        };
        println!(
            "{severity} [{}] {}: {}",
            diagnostic.code, diagnostic.path, diagnostic.message
        );
    }
    if report.diagnostics.len() > MAX_PRINTED_DIAGNOSTICS {
        println!(
            "... {} more diagnostics",
            report.diagnostics.len() - MAX_PRINTED_DIAGNOSTICS
        );
    }
}

fn exit_with_error(message: &str) -> ! {
    eprintln!("seo-doctor: {message}");
    std::process::exit(2);
}

#[cfg(test)]
mod tests {
    use super::*;

    fn route(path: &str) -> ExpectedRoute {
        ExpectedRoute {
            allow_orphan: false,
            alternates: BTreeMap::from([
                ("ka".to_string(), format!("https://reptiles.ge{path}")),
                (
                    "x-default".to_string(),
                    format!("https://reptiles.ge{path}"),
                ),
            ]),
            canonical_url: format!("https://reptiles.ge{path}"),
            in_sitemap: true,
            locale: "ka".to_string(),
            path: path.to_string(),
            route_type: "static".to_string(),
        }
    }

    fn graph(routes: Vec<ExpectedRoute>) -> SeoGraph {
        SeoGraph {
            default_locale: "ka".to_string(),
            locales: vec![
                "ka".to_string(),
                "en".to_string(),
                "ru".to_string(),
                "tr".to_string(),
            ],
            production_origin: "https://reptiles.ge".to_string(),
            routes,
        }
    }

    fn page(path: &str, canonical: &str) -> PageModel {
        PageModel {
            anchors: Vec::new(),
            canonicals: vec![canonical.to_string()],
            descriptions: vec!["Description".to_string()],
            h1s: vec!["Heading".to_string()],
            hreflangs: vec![
                HrefLang {
                    href: canonical.to_string(),
                    lang: "ka".to_string(),
                },
                HrefLang {
                    href: canonical.to_string(),
                    lang: "x-default".to_string(),
                },
            ],
            html_lang: Some("ka".to_string()),
            image_alts: Vec::new(),
            jsonld: Vec::new(),
            og: BTreeMap::from([
                ("og:title".to_string(), vec!["Title".to_string()]),
                (
                    "og:description".to_string(),
                    vec!["Description".to_string()],
                ),
                (
                    "og:image".to_string(),
                    vec!["https://cdn.reptiles.ge/a.jpg".to_string()],
                ),
                ("og:url".to_string(), vec![canonical.to_string()]),
            ]),
            path: path.to_string(),
            robots: Vec::new(),
            title: vec!["Title".to_string()],
            x_robots: Vec::new(),
        }
    }

    fn fetch(path: &str, status: u16) -> FetchResult {
        FetchResult {
            body: String::new(),
            content_type: "text/html".to_string(),
            headers: BTreeMap::new(),
            location: None,
            path: path.to_string(),
            status,
        }
    }

    fn local_rewrite_fetch(path: &str) -> FetchResult {
        let mut fetch = fetch(path, 301);
        fetch.location = Some("/amphibians/foo".to_string());
        fetch.headers.insert(
            "x-middleware-rewrite".to_string(),
            vec!["http://localhost:3000/ka/amphibians/foo".to_string()],
        );
        fetch
    }

    #[test]
    fn normalizes_internal_urls() {
        assert_eq!(
            internal_path_from_href(
                "https://reptiles.ge/en/snakes/foo?x=1#top",
                "/",
                "https://reptiles.ge",
                ""
            ),
            Some("/en/snakes/foo".to_string())
        );
        assert_eq!(
            internal_path_from_href("../bar/", "/en/snakes/foo", "https://reptiles.ge", ""),
            Some("/en/bar".to_string())
        );
        assert_eq!(
            internal_path_from_href("https://example.com/a", "/", "https://reptiles.ge", ""),
            None
        );
    }

    #[test]
    fn catches_wrong_canonical() {
        let graph = graph(vec![route("/a")]);
        let route = route("/a");
        let model = page("/a", "https://reptiles.ge/b");
        let mut diagnostics = Vec::new();
        check_canonical(&graph, &route, &model, &mut diagnostics);
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "canonical-mismatch"));
    }

    #[test]
    fn catches_unexpected_noindex() {
        let route = route("/a");
        let mut model = page("/a", "https://reptiles.ge/a");
        model.robots.push("noindex, follow".to_string());
        let fetch = fetch("/a", 200);
        let mut diagnostics = Vec::new();
        check_robots_meta(&route, &fetch, &model, &mut diagnostics);
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "unexpected-noindex"));
    }

    #[test]
    fn ignores_local_next_intl_rewrite_redirect_artifact() {
        let route = route("/amfibiebi/foo");
        let graph = graph(vec![route.clone()]);
        let expected = BTreeMap::from([(route.path.clone(), route.clone())]);
        let fetches = BTreeMap::from([(route.path.clone(), local_rewrite_fetch(&route.path))]);
        let mut diagnostics = Vec::new();
        check_routes(
            &graph,
            &expected,
            &fetches,
            &BTreeMap::new(),
            &mut diagnostics,
        );
        assert!(diagnostics.is_empty());
        assert!(!expected_route_is_unhealthy(
            &route.path,
            &expected,
            &fetches
        ));
    }

    #[test]
    fn catches_broken_hreflang_target() {
        let mut a = route("/a");
        a.alternates
            .insert("en".to_string(), "https://reptiles.ge/en/a".to_string());
        let graph = graph(vec![a.clone()]);
        let expected = BTreeMap::from([("/a".to_string(), a.clone())]);
        let fetches = BTreeMap::from([("/en/a".to_string(), fetch("/en/a", 404))]);
        let mut model = page("/a", "https://reptiles.ge/a");
        model.hreflangs.push(HrefLang {
            href: "https://reptiles.ge/en/a".to_string(),
            lang: "en".to_string(),
        });
        let models = BTreeMap::from([("/a".to_string(), model)]);
        let mut diagnostics = Vec::new();
        check_hreflang(&graph, &a, &expected, &fetches, &models, &mut diagnostics);
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "hreflang-target-404"));
    }

    #[test]
    fn suppresses_hreflang_cascade_for_unhealthy_expected_target() {
        let mut a = route("/a");
        a.alternates
            .insert("en".to_string(), "https://reptiles.ge/en/a".to_string());
        let mut b = route("/en/a");
        b.locale = "en".to_string();
        b.canonical_url = "https://reptiles.ge/en/a".to_string();
        let graph = graph(vec![a.clone(), b.clone()]);
        let expected = BTreeMap::from([("/a".to_string(), a.clone()), ("/en/a".to_string(), b)]);
        let fetches = BTreeMap::from([("/en/a".to_string(), fetch("/en/a", 301))]);
        let mut model = page("/a", "https://reptiles.ge/a");
        model.hreflangs.push(HrefLang {
            href: "https://reptiles.ge/en/a".to_string(),
            lang: "en".to_string(),
        });
        let models = BTreeMap::from([("/a".to_string(), model)]);
        let mut diagnostics = Vec::new();
        check_hreflang(&graph, &a, &expected, &fetches, &models, &mut diagnostics);
        assert!(!diagnostics
            .iter()
            .any(|item| item.code == "hreflang-target-redirect"));
    }

    #[test]
    fn catches_missing_reciprocal_hreflang() {
        let mut a = route("/a");
        a.alternates
            .insert("en".to_string(), "https://reptiles.ge/en/a".to_string());
        let mut b = route("/en/a");
        b.locale = "en".to_string();
        b.canonical_url = "https://reptiles.ge/en/a".to_string();
        let graph = graph(vec![a.clone(), b.clone()]);
        let expected = BTreeMap::from([("/a".to_string(), a.clone()), ("/en/a".to_string(), b)]);
        let fetches = BTreeMap::from([("/en/a".to_string(), fetch("/en/a", 200))]);
        let mut a_model = page("/a", "https://reptiles.ge/a");
        a_model.hreflangs.push(HrefLang {
            href: "https://reptiles.ge/en/a".to_string(),
            lang: "en".to_string(),
        });
        let b_model = page("/en/a", "https://reptiles.ge/en/a");
        let models = BTreeMap::from([("/a".to_string(), a_model), ("/en/a".to_string(), b_model)]);
        let mut diagnostics = Vec::new();
        check_hreflang(&graph, &a, &expected, &fetches, &models, &mut diagnostics);
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "hreflang-reciprocal-missing"));
    }

    #[test]
    fn catches_sitemap_404() {
        let route = route("/a");
        let graph = graph(vec![route.clone()]);
        let expected = BTreeMap::from([("/a".to_string(), route.clone())]);
        let fetches = BTreeMap::from([("/a".to_string(), fetch("/a", 404))]);
        let entries = SitemapEntries {
            error: None,
            urls: vec![SitemapUrl {
                lastmod: Some("2026-01-01".to_string()),
                loc: "https://reptiles.ge/a".to_string(),
            }],
        };
        let sitemap = fetch("/sitemap.xml", 200);
        let mut diagnostics = Vec::new();
        check_sitemap(
            &graph,
            &expected,
            &fetches,
            &BTreeMap::new(),
            &sitemap,
            &entries,
            &mut diagnostics,
        );
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "sitemap-url-404"));
    }

    #[test]
    fn catches_internal_link_404() {
        let route = route("/a");
        let expected = BTreeMap::from([("/a".to_string(), route.clone())]);
        let mut model = page("/a", "https://reptiles.ge/a");
        model.anchors.push("/missing".to_string());
        let models = BTreeMap::from([("/a".to_string(), model)]);
        let fetches = BTreeMap::from([("/missing".to_string(), fetch("/missing", 404))]);
        let graph = graph(vec![route]);
        let mut diagnostics = Vec::new();
        check_internal_links(&graph, &expected, &fetches, &models, &mut diagnostics);
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "internal-link-broken"));
    }

    #[test]
    fn catches_invalid_jsonld() {
        let graph = graph(vec![route("/a")]);
        let expected = BTreeMap::from([("/a".to_string(), route("/a"))]);
        let fetches = BTreeMap::from([("/a".to_string(), fetch("/a", 200))]);
        let mut model = page("/a", "https://reptiles.ge/a");
        model.jsonld.push("{".to_string());
        let mut diagnostics = Vec::new();
        check_jsonld(
            &graph,
            expected.get("/a").unwrap(),
            &expected,
            &fetches,
            &model,
            &mut diagnostics,
        );
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "jsonld-invalid-json"));
    }

    #[test]
    fn ignores_nested_jsonld_page_urls_for_page_identity() {
        let parent = route("/regions");
        let child = route("/regions/racha");
        let graph = graph(vec![parent.clone(), child.clone()]);
        let expected = BTreeMap::from([
            ("/regions".to_string(), parent.clone()),
            ("/regions/racha".to_string(), child),
        ]);
        let fetches = BTreeMap::from([
            ("/regions".to_string(), fetch("/regions", 200)),
            ("/regions/racha".to_string(), fetch("/regions/racha", 200)),
        ]);
        let json = serde_json::json!({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "hasPart": [
                {
                    "@type": "WebPage",
                    "url": "https://reptiles.ge/regions/racha"
                }
            ],
            "url": "https://reptiles.ge/regions"
        });
        let mut diagnostics = Vec::new();
        validate_jsonld_urls(
            &graph,
            &parent,
            &expected,
            &fetches,
            &json,
            &mut diagnostics,
        );
        assert!(!diagnostics
            .iter()
            .any(|item| item.code == "jsonld-page-url-mismatch"));
    }

    #[test]
    fn catches_orphan_indexable_page() {
        let graph = graph(vec![route("/a"), route("/b")]);
        let expected = BTreeMap::from([
            ("/a".to_string(), route("/a")),
            ("/b".to_string(), route("/b")),
        ]);
        let fetches = BTreeMap::from([
            ("/a".to_string(), fetch("/a", 200)),
            ("/b".to_string(), fetch("/b", 200)),
        ]);
        let models = BTreeMap::from([
            ("/a".to_string(), page("/a", "https://reptiles.ge/a")),
            ("/b".to_string(), page("/b", "https://reptiles.ge/b")),
        ]);
        let mut diagnostics = Vec::new();
        check_orphans(&graph, &expected, &fetches, &models, &mut diagnostics);
        assert!(diagnostics
            .iter()
            .any(|item| item.code == "orphan-indexable-page" && item.path == "/b"));
    }
}
