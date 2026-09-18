use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};
use std::env;
use std::fs;
use std::path::Path;

const REPORT_PATH: &str = ".atlas/doctor-report.json";

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Graph {
    locales: Vec<String>,
    species_content: Vec<SpeciesContent>,
    species: SpeciesGraph,
    routing: RoutingGraph,
    regions: Vec<RegionGraph>,
}

#[derive(Debug, Deserialize)]
struct SpeciesContent {
    id: String,
    path: String,
    locales: BTreeMap<String, LocaleContent>,
}

#[derive(Debug, Deserialize)]
struct LocaleContent {
    body: String,
    frontmatter: Map<String, Value>,
    path: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SpeciesGraph {
    published_ids: Vec<String>,
    unpublished_ids: Vec<String>,
    generated_by_id: BTreeMap<String, GeneratedSpecies>,
    atlas_meta_by_id: BTreeMap<String, AtlasMeta>,
    checklist_status_by_id: BTreeMap<String, Option<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GeneratedSpecies {
    common_name: String,
    danger: Option<String>,
    scientific_name: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AtlasMeta {
    group: String,
    hub: String,
    has_venom_concept: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RoutingGraph {
    species_hub_by_id: BTreeMap<String, String>,
    species_slugs_by_locale: BTreeMap<String, BTreeMap<String, String>>,
    ka_slug_by_id: BTreeMap<String, String>,
    id_by_any_slug: BTreeMap<String, String>,
    reserved_slugs_by_hub: BTreeMap<String, Vec<String>>,
    valid_paths: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RegionGraph {
    id: String,
    species_ids: Vec<String>,
}

#[derive(Clone, Debug, Serialize)]
struct Diagnostic {
    severity: Severity,
    code: &'static str,
    path: String,
    message: String,
}

#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(rename_all = "lowercase")]
enum Severity {
    Fatal,
    Warning,
}

#[derive(Serialize)]
struct Report {
    fatal: usize,
    warning: usize,
    diagnostics: Vec<Diagnostic>,
}

fn main() {
    let mut graph_path = ".atlas/graph.json".to_string();
    let mut print_json = false;
    for arg in env::args().skip(1) {
        if arg == "--json" {
            print_json = true;
        } else {
            graph_path = arg;
        }
    }

    let raw = match fs::read_to_string(&graph_path) {
        Ok(raw) => raw,
        Err(error) => exit_with_error(&format!("{graph_path}: {error}")),
    };
    let graph: Graph = match serde_json::from_str(&raw) {
        Ok(graph) => graph,
        Err(error) => exit_with_error(&format!("{graph_path}: {error}")),
    };

    let mut diagnostics = run_checks(&graph);
    diagnostics.sort_by(|a, b| {
        a.severity
            .cmp(&b.severity)
            .then_with(|| a.path.cmp(&b.path))
            .then_with(|| a.code.cmp(b.code))
    });

    let fatal = diagnostics
        .iter()
        .filter(|item| item.severity == Severity::Fatal)
        .count();
    let warning = diagnostics.len() - fatal;
    let report = Report {
        fatal,
        warning,
        diagnostics,
    };

    if let Err(error) = write_report(&report) {
        exit_with_error(&format!("{REPORT_PATH}: {error}"));
    }

    if print_json {
        println!("{}", serde_json::to_string_pretty(&report).unwrap());
    } else {
        print_human(&report);
    }

    if report.fatal > 0 {
        std::process::exit(1);
    }
}

fn run_checks(graph: &Graph) -> Vec<Diagnostic> {
    let mut diagnostics = Vec::new();
    check_species_content(graph, &mut diagnostics);
    check_scientific_name_duplicates(graph, &mut diagnostics);
    check_regions(graph, &mut diagnostics);
    check_routing(graph, &mut diagnostics);
    diagnostics
}

fn check_species_content(graph: &Graph, diagnostics: &mut Vec<Diagnostic>) {
    let published: HashSet<&str> = graph
        .species
        .published_ids
        .iter()
        .map(String::as_str)
        .collect();
    let unpublished: HashSet<&str> = graph
        .species
        .unpublished_ids
        .iter()
        .map(String::as_str)
        .collect();
    let content_by_id: HashMap<&str, &SpeciesContent> = graph
        .species_content
        .iter()
        .map(|item| (item.id.as_str(), item))
        .collect();

    for id in &graph.species.published_ids {
        if !content_by_id.contains_key(id.as_str()) {
            fatal(
                diagnostics,
                "published-content-missing",
                "src/content/species",
                format!("published species `{id}` has no content folder"),
            );
        }
    }

    let valid_paths: HashSet<&str> = graph
        .routing
        .valid_paths
        .iter()
        .map(String::as_str)
        .collect();

    for item in &graph.species_content {
        let is_published = published.contains(item.id.as_str());
        if !item.locales.contains_key("ka") {
            fatal(
                diagnostics,
                "locale-missing",
                &item.path,
                "content folder is missing ka.mdx".to_string(),
            );
            continue;
        }
        if is_published {
            for locale in &graph.locales {
                if !item.locales.contains_key(locale) {
                    fatal(
                        diagnostics,
                        "locale-missing",
                        &item.path,
                        format!("published species is missing {locale}.mdx"),
                    );
                }
            }
        }

        let ka = item.locales.get("ka").unwrap();
        check_taxonomy(graph, diagnostics, item, ka);
        check_required_ka_fields(diagnostics, &item.id, is_published, ka);
        check_generated_freshness(graph, diagnostics, &item.id, ka);
        check_atlas_meta(graph, diagnostics, &item.id, is_published, ka);
        check_checklist_status(graph, diagnostics, &item.id, ka);
        check_gallery_references(diagnostics, item, ka);
        check_internal_links(diagnostics, &valid_paths, ka);
        check_photo_provenance(diagnostics, ka);
        check_candidate_tone(graph, diagnostics, &item.id, ka);

        let ka_gallery = gallery_srcs(&ka.frontmatter);
        for (locale, localized) in &item.locales {
            if locale == "ka" {
                continue;
            }
            check_taxonomy_locale(diagnostics, &item.id, locale, ka, localized);
            check_gallery_overlay(diagnostics, &ka_gallery, locale, localized);
            check_internal_links(diagnostics, &valid_paths, localized);
            check_photo_provenance(diagnostics, localized);
        }

        if unpublished.contains(item.id.as_str()) && is_published {
            fatal(
                diagnostics,
                "publish-state-conflict",
                &item.path,
                format!("`{}` is both published and unpublished", item.id),
            );
        }
    }
}

fn check_taxonomy(
    graph: &Graph,
    diagnostics: &mut Vec<Diagnostic>,
    item: &SpeciesContent,
    ka: &LocaleContent,
) {
    check_taxonomy_locale(diagnostics, &item.id, "ka", ka, ka);

    if let (Some(meta), Some(hub)) = (
        graph.species.atlas_meta_by_id.get(&item.id),
        graph.routing.species_hub_by_id.get(&item.id),
    ) {
        if meta.hub != *hub {
            fatal(
                diagnostics,
                "taxonomy-conflict",
                &ka.path,
                format!(
                    "`{}` atlas group routes to `{}` but slug table says `{hub}`",
                    item.id, meta.hub
                ),
            );
        }
    }

    if let (Some(scientific), Some(genus)) = (
        str_field(&ka.frontmatter, "scientificName"),
        str_field(&ka.frontmatter, "genus"),
    ) {
        let first = scientific.split_whitespace().next().unwrap_or("");
        if first != genus {
            fatal(
                diagnostics,
                "taxonomy-conflict",
                &ka.path,
                format!("scientificName `{scientific}` does not start with genus `{genus}`"),
            );
        }
    }
}

fn check_taxonomy_locale(
    diagnostics: &mut Vec<Diagnostic>,
    folder_id: &str,
    locale: &str,
    canonical: &LocaleContent,
    content: &LocaleContent,
) {
    if let Some(frontmatter_id) = str_field(&content.frontmatter, "id") {
        if frontmatter_id != folder_id {
            fatal(
                diagnostics,
                "taxonomy-conflict",
                &content.path,
                format!("{locale}.mdx has id `{frontmatter_id}` but folder is `{folder_id}`"),
            );
        }
    }

    for field in ["scientificName", "genus", "family"] {
        let canonical_value = str_field(&canonical.frontmatter, field);
        let localized_value = str_field(&content.frontmatter, field);
        if let (Some(canonical_value), Some(localized_value)) = (canonical_value, localized_value) {
            if canonical_value != localized_value {
                fatal(
                    diagnostics,
                    "taxonomy-conflict",
                    &content.path,
                    format!(
                        "{locale}.mdx has {field} `{localized_value}` but KA has `{canonical_value}`"
                    ),
                );
            }
        }
    }
}

fn check_required_ka_fields(
    diagnostics: &mut Vec<Diagnostic>,
    id: &str,
    is_published: bool,
    ka: &LocaleContent,
) {
    if str_field(&ka.frontmatter, "id").is_none() {
        fatal(
            diagnostics,
            "ka-id-missing",
            &ka.path,
            "ka.mdx is missing frontmatter id".to_string(),
        );
    }
    if !date_like(str_field(&ka.frontmatter, "dateModified")) {
        fatal(
            diagnostics,
            "date-modified-invalid",
            &ka.path,
            "ka.mdx needs dateModified as YYYY-MM-DD or ISO date".to_string(),
        );
    }
    if is_published && !sources_are_valid(ka.frontmatter.get("sources")) {
        fatal(
            diagnostics,
            "sources-invalid",
            &ka.path,
            format!("published species `{id}` needs specific sources with a URL"),
        );
    }
}

fn check_generated_freshness(
    graph: &Graph,
    diagnostics: &mut Vec<Diagnostic>,
    id: &str,
    ka: &LocaleContent,
) {
    let Some(generated) = graph.species.generated_by_id.get(id) else {
        fatal(
            diagnostics,
            "generated-species-missing",
            &ka.path,
            format!("`{id}` is missing from species.generated.ts"),
        );
        return;
    };

    for (field, generated_value) in [
        ("commonName", generated.common_name.as_str()),
        ("scientificName", generated.scientific_name.as_str()),
    ] {
        if let Some(raw_value) = str_field(&ka.frontmatter, field) {
            if raw_value != generated_value {
                fatal(
                    diagnostics,
                    if field == "scientificName" {
                        "taxonomy-conflict"
                    } else {
                        "generated-catalog-stale"
                    },
                    &ka.path,
                    format!(
                        "{field} is `{raw_value}` in MDX but `{generated_value}` in species.generated.ts"
                    ),
                );
            }
        }
    }

    if let Some(raw_danger) = str_field(&ka.frontmatter, "danger") {
        if Some(raw_danger) != generated.danger.as_deref() {
            fatal(
                diagnostics,
                "generated-catalog-stale",
                &ka.path,
                format!(
                    "danger is `{raw_danger}` in MDX but `{:?}` in species.generated.ts",
                    generated.danger
                ),
            );
        }
    }
}

fn check_atlas_meta(
    graph: &Graph,
    diagnostics: &mut Vec<Diagnostic>,
    id: &str,
    is_published: bool,
    ka: &LocaleContent,
) {
    let meta = graph.species.atlas_meta_by_id.get(id);
    if is_published && meta.is_none() {
        fatal(
            diagnostics,
            "atlas-meta-missing",
            &ka.path,
            format!("published species `{id}` has no speciesAtlasMeta entry"),
        );
        return;
    }
    if let (Some(danger), Some(meta)) = (str_field(&ka.frontmatter, "danger"), meta) {
        if !meta.has_venom_concept {
            fatal(
                diagnostics,
                "danger-group-invalid",
                &ka.path,
                format!(
                    "danger `{danger}` is not allowed for group `{}`",
                    meta.group
                ),
            );
        }
    }
}

fn check_gallery_overlay(
    diagnostics: &mut Vec<Diagnostic>,
    ka_gallery: &BTreeSet<String>,
    locale: &str,
    localized: &LocaleContent,
) {
    for src in gallery_srcs(&localized.frontmatter) {
        if !ka_gallery.contains(&src) {
            fatal(
                diagnostics,
                "gallery-reference-invalid",
                &localized.path,
                format!("{locale}.mdx overlays unknown gallery src `{src}`"),
            );
        }
    }
}

fn check_gallery_references(
    diagnostics: &mut Vec<Diagnostic>,
    item: &SpeciesContent,
    ka: &LocaleContent,
) {
    let ka_gallery = gallery_srcs(&ka.frontmatter);
    for field in ["image", "mobileImage"] {
        if let Some(src) = str_field(&ka.frontmatter, field) {
            if !src.trim().is_empty() && !ka_gallery.contains(src) {
                fatal(
                    diagnostics,
                    "gallery-reference-invalid",
                    &ka.path,
                    format!("{field} `{src}` is not present in canonical KA gallery"),
                );
            }
        }
    }

    for (locale, localized) in &item.locales {
        if locale == "ka" {
            continue;
        }
        for field in ["image", "mobileImage"] {
            if let Some(src) = str_field(&localized.frontmatter, field) {
                if !src.trim().is_empty() && !ka_gallery.contains(src) {
                    fatal(
                        diagnostics,
                        "gallery-reference-invalid",
                        &localized.path,
                        format!(
                            "{locale}.mdx {field} `{src}` is not present in canonical KA gallery"
                        ),
                    );
                }
            }
        }
    }
}

fn check_checklist_status(
    graph: &Graph,
    diagnostics: &mut Vec<Diagnostic>,
    id: &str,
    ka: &LocaleContent,
) {
    let Some(expected) = graph
        .species
        .checklist_status_by_id
        .get(id)
        .and_then(Option::as_deref)
    else {
        return;
    };
    let Some(actual) = checklist_status_from_frontmatter(&ka.frontmatter) else {
        return;
    };
    if actual != expected {
        fatal(
            diagnostics,
            "checklist-status-conflict",
            &ka.path,
            format!(
                "frontmatter says checklist status `{actual}` but checklist data says `{expected}`"
            ),
        );
    }
}

fn check_internal_links(
    diagnostics: &mut Vec<Diagnostic>,
    valid_paths: &HashSet<&str>,
    content: &LocaleContent,
) {
    let text = format!(
        "{} {}",
        content.body,
        text_values(&Value::Object(content.frontmatter.clone())).join(" ")
    );
    for link in internal_links(&text) {
        if !valid_paths.contains(link.as_str()) {
            fatal(
                diagnostics,
                "internal-link-invalid",
                &content.path,
                format!("internal link `{link}` does not match a published atlas path"),
            );
        }
    }
}

fn check_photo_provenance(diagnostics: &mut Vec<Diagnostic>, content: &LocaleContent) {
    for (label, credit, parent_confidence) in photo_credit_entries(&content.frontmatter) {
        let georgia_field = parent_confidence.as_deref() == Some("georgia-field")
            || str_field(credit, "photoConfidence") == Some("georgia-field");
        if georgia_field {
            if str_field(credit, "location")
                .unwrap_or("")
                .trim()
                .is_empty()
            {
                warning(
                    diagnostics,
                    "georgia-field-location-missing",
                    &content.path,
                    format!("{label} is georgia-field but has no location"),
                );
            }
            if str_field(credit, "photographer")
                .unwrap_or("")
                .trim()
                .is_empty()
            {
                warning(
                    diagnostics,
                    "georgia-field-photographer-missing",
                    &content.path,
                    format!("{label} is georgia-field but has no photographer"),
                );
            }
        }
        if credit.contains_key("lat") != credit.contains_key("lng") {
            fatal(
                diagnostics,
                "photo-coordinate-pair-invalid",
                &content.path,
                format!("{label} must set lat and lng together"),
            );
        }
    }
}

fn check_candidate_tone(
    graph: &Graph,
    diagnostics: &mut Vec<Diagnostic>,
    id: &str,
    ka: &LocaleContent,
) {
    if graph
        .species
        .checklist_status_by_id
        .get(id)
        .and_then(Option::as_deref)
        != Some("candidate")
    {
        return;
    }

    let text = format!(
        "{} {} {}",
        ka.body,
        str_field(&ka.frontmatter, "overview").unwrap_or(""),
        str_field(&ka.frontmatter, "description").unwrap_or("")
    )
    .to_lowercase();
    let has_confirmed_tone = contains_any(
        &text,
        &[
            "დადასტურებულ",
            "confirmed",
            "確",
            "known from georgia",
            "occurs in georgia",
        ],
    );
    let has_candidate_caveat = contains_any(
        &text,
        &[
            "კანდიდატ",
            "საკანდიდატო",
            "შესაძლო",
            "candidate",
            "possible",
            "needs confirmation",
        ],
    );
    if has_confirmed_tone && !has_candidate_caveat {
        warning(
            diagnostics,
            "candidate-confirmed-tone",
            &ka.path,
            format!("candidate taxon `{id}` reads like a confirmed occurrence"),
        );
    }
}

fn check_regions(graph: &Graph, diagnostics: &mut Vec<Diagnostic>) {
    let published: HashSet<&str> = graph
        .species
        .published_ids
        .iter()
        .map(String::as_str)
        .collect();
    let generated: HashSet<&str> = graph
        .species
        .generated_by_id
        .keys()
        .map(String::as_str)
        .collect();

    for region in &graph.regions {
        for id in &region.species_ids {
            if !generated.contains(id.as_str()) {
                fatal(
                    diagnostics,
                    "region-species-unknown",
                    "src/data/regions.ts",
                    format!("region `{}` references unknown species `{id}`", region.id),
                );
            } else if !published.contains(id.as_str()) {
                fatal(
                    diagnostics,
                    "region-species-unpublished",
                    "src/data/regions.ts",
                    format!(
                        "region `{}` references unpublished species `{id}`",
                        region.id
                    ),
                );
            }
            if graph
                .species
                .checklist_status_by_id
                .get(id)
                .and_then(Option::as_deref)
                == Some("candidate")
            {
                fatal(
                    diagnostics,
                    "candidate-region-reference",
                    "src/data/regions.ts",
                    format!(
                        "region `{}` references candidate species `{id}` as mapped fauna",
                        region.id
                    ),
                );
            }
        }
    }
}

fn check_routing(graph: &Graph, diagnostics: &mut Vec<Diagnostic>) {
    let published: HashSet<&str> = graph
        .species
        .published_ids
        .iter()
        .map(String::as_str)
        .collect();
    let mut by_slug: BTreeMap<&str, Vec<&str>> = BTreeMap::new();

    for locale in &graph.locales {
        let Some(slugs) = graph.routing.species_slugs_by_locale.get(locale) else {
            fatal(
                diagnostics,
                "slug-locale-invalid",
                "src/data/speciesSlugs.generated.ts",
                format!("missing species slug table for locale `{locale}`"),
            );
            continue;
        };
        let mut locale_slugs: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
        for id in &graph.species.published_ids {
            let Some(slug) = slugs.get(id) else {
                fatal(
                    diagnostics,
                    "slug-locale-invalid",
                    "src/data/speciesSlugs.generated.ts",
                    format!("published species `{id}` has no `{locale}` slug"),
                );
                continue;
            };
            if slug.trim().is_empty() {
                fatal(
                    diagnostics,
                    "slug-locale-invalid",
                    "src/data/speciesSlugs.generated.ts",
                    format!("published species `{id}` has a blank `{locale}` slug"),
                );
            }
            locale_slugs.entry(slug).or_default().push(id);
        }
        for (slug, ids) in locale_slugs {
            if ids.len() > 1 {
                fatal(
                    diagnostics,
                    "slug-locale-invalid",
                    "src/data/speciesSlugs.generated.ts",
                    format!(
                        "locale `{locale}` slug `{slug}` is shared by {}",
                        ids.join(", ")
                    ),
                );
            }
        }
    }

    for (id, slug) in &graph.routing.ka_slug_by_id {
        by_slug.entry(slug).or_default().push(id);
        if !published.contains(id.as_str()) {
            fatal(
                diagnostics,
                "slug-locale-invalid",
                "src/data/speciesSlugs.generated.ts",
                format!("kaSlugById contains unpublished or unknown species `{id}`"),
            );
        }
        let Some(hub) = graph.routing.species_hub_by_id.get(id) else {
            fatal(
                diagnostics,
                "slug-locale-invalid",
                "src/data/speciesSlugs.generated.ts",
                format!("kaSlugById species `{id}` has no speciesHubById entry"),
            );
            continue;
        };
        if graph
            .routing
            .reserved_slugs_by_hub
            .get(hub)
            .is_some_and(|reserved| reserved.iter().any(|item| item == slug))
        {
            fatal(
                diagnostics,
                "slug-locale-invalid",
                "src/data/speciesSlugs.generated.ts",
                format!("species `{id}` uses reserved `{hub}` slug `{slug}`"),
            );
        }
    }

    for (slug, ids) in by_slug {
        if ids.len() > 1 {
            fatal(
                diagnostics,
                "slug-locale-invalid",
                "src/data/speciesSlugs.generated.ts",
                format!("KA slug `{slug}` is shared by {}", ids.join(", ")),
            );
        }
    }

    for (slug, id) in &graph.routing.id_by_any_slug {
        if !published.contains(id.as_str()) {
            fatal(
                diagnostics,
                "slug-locale-invalid",
                "src/data/speciesSlugs.generated.ts",
                format!("slug `{slug}` resolves to unpublished or unknown species `{id}`"),
            );
        }
    }
}

fn check_scientific_name_duplicates(graph: &Graph, diagnostics: &mut Vec<Diagnostic>) {
    let mut by_name: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
    for (id, item) in &graph.species.generated_by_id {
        by_name
            .entry(item.scientific_name.as_str())
            .or_default()
            .push(id);
    }
    for (name, ids) in by_name {
        if ids.len() > 1 {
            fatal(
                diagnostics,
                "scientific-name-duplicate",
                "src/data/species.generated.ts",
                format!("scientific name `{name}` is used by {}", ids.join(", ")),
            );
        }
    }
}

fn checklist_status_from_frontmatter(frontmatter: &Map<String, Value>) -> Option<&'static str> {
    let stats = frontmatter.get("stats").and_then(Value::as_array)?;
    for stat in stats {
        let Some(object) = stat.as_object() else {
            continue;
        };
        let label = str_field(object, "label").unwrap_or("").to_lowercase();
        if !label.contains("checklist") && !label.contains("ჩამონათვალი") {
            continue;
        }
        if let Some(status) = classify_checklist_status(str_field(object, "value").unwrap_or("")) {
            return Some(status);
        }
    }
    None
}

fn classify_checklist_status(value: &str) -> Option<&'static str> {
    let value = value.to_lowercase();
    if contains_any(&value, &["candidate", "კანდიდატ", "საკანდიდატო"])
    {
        return Some("candidate");
    }
    if contains_any(&value, &["introduced", "ინტროდუც"]) {
        return Some("introduced");
    }
    if contains_any(&value, &["confirmed", "დადასტურ"]) {
        return Some("confirmed");
    }
    None
}

fn internal_links(text: &str) -> BTreeSet<String> {
    Regex::new(r#"(?:\]\(|href=["']|href=\{["'])(/[^\s"'<>)}]+)"#)
        .unwrap()
        .captures_iter(text)
        .filter_map(|captures| captures.get(1))
        .filter_map(|hit| normalize_internal_link(hit.as_str()))
        .collect()
}

fn normalize_internal_link(raw: &str) -> Option<String> {
    if raw.starts_with("//") {
        return None;
    }
    let trimmed = raw.trim_end_matches(|ch| matches!(ch, '.' | ',' | ';' | ':' | ']' | '}'));
    let path = trimmed
        .split(['?', '#'])
        .next()
        .unwrap_or("")
        .trim_end_matches('/');
    let path = if path.is_empty() { "/" } else { path };
    if should_ignore_internal_path(path) {
        return None;
    }
    Some(path.to_string())
}

fn should_ignore_internal_path(path: &str) -> bool {
    if path.starts_with("/api/")
        || path.starts_with("/audio/")
        || path.starts_with("/captions/")
        || path.starts_with("/fonts/")
        || path.starts_with("/images/")
        || path.starts_with("/_next/")
    {
        return true;
    }
    let lower = path.to_lowercase();
    [
        ".avif", ".gif", ".jpg", ".jpeg", ".json", ".mp3", ".pdf", ".png", ".svg", ".webp",
        ".woff", ".woff2",
    ]
    .iter()
    .any(|suffix| lower.ends_with(suffix))
}

fn text_values(value: &Value) -> Vec<String> {
    match value {
        Value::Array(items) => items.iter().flat_map(text_values).collect(),
        Value::Object(object) => object.values().flat_map(text_values).collect(),
        Value::String(text) => vec![text.clone()],
        _ => Vec::new(),
    }
}

fn photo_credit_entries(
    frontmatter: &Map<String, Value>,
) -> Vec<(String, &Map<String, Value>, Option<String>)> {
    let mut out = Vec::new();
    for key in ["imageCredit", "mobileImageCredit"] {
        if let Some(credit) = frontmatter.get(key).and_then(Value::as_object) {
            out.push((key.to_string(), credit, None));
        }
    }
    if let Some(items) = frontmatter.get("gallery").and_then(Value::as_array) {
        for (index, item) in items.iter().enumerate() {
            let Some(object) = item.as_object() else {
                continue;
            };
            let confidence = str_field(object, "photoConfidence").map(str::to_string);
            if let Some(credit) = object.get("credit").and_then(Value::as_object) {
                out.push((format!("gallery[{index}].credit"), credit, confidence));
            }
        }
    }
    out
}

fn gallery_srcs(frontmatter: &Map<String, Value>) -> BTreeSet<String> {
    frontmatter
        .get("gallery")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(Value::as_object)
        .filter_map(|item| str_field(item, "src"))
        .map(str::to_string)
        .collect()
}

fn sources_are_valid(value: Option<&Value>) -> bool {
    let Some(sources) = value.and_then(Value::as_array) else {
        return false;
    };
    let generic = ["scientific publications"];
    let named: Vec<&Map<String, Value>> = sources
        .iter()
        .filter_map(Value::as_object)
        .filter(|source| !str_field(source, "name").unwrap_or("").trim().is_empty())
        .collect();
    if named.is_empty() {
        return false;
    }
    !named.iter().all(|source| {
        let name = str_field(source, "name")
            .unwrap_or("")
            .trim()
            .to_lowercase();
        generic.contains(&name.as_str()) && str_field(source, "url").unwrap_or("").trim().is_empty()
    })
}

fn date_like(value: Option<&str>) -> bool {
    let Some(value) = value else {
        return false;
    };
    Regex::new(r"^\d{4}-\d{2}-\d{2}(T.*)?$")
        .unwrap()
        .is_match(value)
}

fn str_field<'a>(object: &'a Map<String, Value>, key: &str) -> Option<&'a str> {
    object.get(key).and_then(Value::as_str)
}

fn contains_any(text: &str, needles: &[&str]) -> bool {
    needles.iter().any(|needle| text.contains(needle))
}

fn fatal(
    diagnostics: &mut Vec<Diagnostic>,
    code: &'static str,
    path: impl Into<String>,
    message: String,
) {
    diagnostics.push(Diagnostic {
        severity: Severity::Fatal,
        code,
        path: path.into(),
        message,
    });
}

fn warning(
    diagnostics: &mut Vec<Diagnostic>,
    code: &'static str,
    path: impl Into<String>,
    message: String,
) {
    diagnostics.push(Diagnostic {
        severity: Severity::Warning,
        code,
        path: path.into(),
        message,
    });
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
    println!("Atlas Doctor");
    println!("fatal: {}  warning: {}", report.fatal, report.warning);
    println!("report: {REPORT_PATH}");
    if report.diagnostics.is_empty() {
        println!("OK: atlas graph is publish-ready.");
        return;
    }
    println!();
    for diagnostic in report.diagnostics.iter().take(40) {
        let severity = match diagnostic.severity {
            Severity::Fatal => "fatal",
            Severity::Warning => "warning",
        };
        println!(
            "{severity} [{}] {}: {}",
            diagnostic.code, diagnostic.path, diagnostic.message
        );
    }
    if report.diagnostics.len() > 40 {
        println!("... {} more diagnostics", report.diagnostics.len() - 40);
    }
}

fn exit_with_error(message: &str) -> ! {
    eprintln!("atlas-doctor: {message}");
    std::process::exit(2);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_generic_only_sources() {
        let value = serde_json::json!([
            { "name": "Scientific publications" }
        ]);
        assert!(!sources_are_valid(Some(&value)));
    }

    #[test]
    fn accepts_specific_source_url() {
        let value = serde_json::json!([
            { "name": "Tarkhnishvili et al. 2026", "url": "https://doi.org/10.3897/caucasiana.5.e189214" }
        ]);
        assert!(sources_are_valid(Some(&value)));
    }

    #[test]
    fn extracts_gallery_srcs() {
        let value = serde_json::json!({
            "gallery": [
                { "src": "https://cdn.reptiles.ge/a.jpg" },
                { "src": "https://cdn.reptiles.ge/b.jpg" }
            ]
        });
        assert_eq!(
            gallery_srcs(value.as_object().unwrap()),
            BTreeSet::from([
                "https://cdn.reptiles.ge/a.jpg".to_string(),
                "https://cdn.reptiles.ge/b.jpg".to_string()
            ])
        );
    }

    #[test]
    fn extracts_only_explicit_internal_links() {
        let text = "body /not-a-link [ok](/snakes/bite?x=1#top) <A href=\"/regions/tbilisi\">";
        assert_eq!(
            internal_links(text),
            BTreeSet::from(["/regions/tbilisi".to_string(), "/snakes/bite".to_string()])
        );
    }
}
