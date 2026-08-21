# Quiz Module — production-readiness audit + tasks

**თარიღი:** 2026-08-21  
**გადაწყვეტილება:** READY WITH MINOR FIXES  
**Overall Production Score: 63 / 100**

Quiz არის კარგი **ერთი** Georgian-intent landing (`რომელი გველია?`). არ არის ჯერ SEO content cluster / traffic engine. Indexable state URL-ები არ იქმნება — ეს სწორია და არ უნდა შეიცვალოს.

```text
ახლა:   Google → /quiz/romeli-gvelia → JS quiz → score overlay → /gvelebi
საჭირო: Google → quiz → question → result recap → species → related → guides → other quizzes
```

| კატეგორია | ქულა |
| --- | ---: |
| Architecture | 6 |
| SEO | 6 |
| Technical SEO | 7 |
| Content Quality | 6 |
| Taxonomy | 9 |
| Internal Linking | 5 |
| UX | 7 |
| Performance | 6 |
| Accessibility | 6 |
| Analytics | 6 |
| Scalability | 4 |
| Growth Potential | 7 |
| SERP Potential | 7 |

**რა გვაქვს კოდში**

| URL | Index | როლი |
| --- | --- | --- |
| `/quiz` · `/en/quiz` | index | Hub. 1 live + 2 vaporware (`soon`) |
| `/quiz/romeli-gvelia` · `/en/quiz/which-snake` | index | ერთადერთი live quiz |
| Result / question / session | არ არსებობს URL | Client state. სწორია — noindex by absence |

შიდა pathname არის `/quiz/gvelis-identifikacia` (`src/app/[locale]/quiz/gvelis-identifikacia/`, `pathnames.ts`). Public slug სხვაა; 301-ები `next.config.ts`-შია.

სახეობები: catalog-ის 22 published გველი შედის difficulty pool-ებში. `dolichophis-caspius` unpublishedა. `vipera-ammodytes` catalog-ში არ არის (redirect → `vipera-transcaucasiana`). Taxonomy SSOT არის `getCatalogSpecies()` + `localizeSpecies` — quiz-ს ცალკე species DB არ აქვს.

---

## P0 — Must fix before treating this as an SEO/product loop

შიპი შეიძლება როგორც feature. ეს სამი რამ ამტვრევს Google → species conversion-ს და title-ის CTR-ს.

### T1. Result overlay-ზე შეხვედრილი სახეობების სია + ბმულები

- [ ] **T1** Result-ზე აჩვენე ამ რაუნდის 10 სახეობა (სწორი/არასწორი), თითოეულზე ლინკი `speciesHref`

**Current:** `ResultOverlay` მხოლოდ `N / 10` + CTA `/snakes`.  
**Problem:** იდეალური flow წყდება. Species click მხოლოდ კითხვის reveal-ზეა; result-ზე სახეობა აღარ ჩანს.  
**Impact:** Internal linking + discovery + quiz_complete → species_click funnel.  
**Fix:** `SnakeQuiz.tsx` `ResultOverlay` — `questions` + `answers` გადაეცი. სია: photo thumb, commonName, scientificName, correct/wrong, `Link` species page. Track `species_page_clicked` `{ source: "quiz_result", species }`.

არ შექმნა `/quiz/.../result` URL.

### T2. Result CTA-ები: species + identify guide + venomous + hub

- [ ] **T2** Result-ზე დაამატე secondary CTA-ები: `/snakes/shxamiani-gvelis-amocnoba`, `/venomous-snakes`, `/snakes` (არსებული)

**Current:** ერთი ღილაკი „აღმოაჩინე საქართველოს გველები“.  
**Problem:** Identify intent (`გველის ამოცნობა`) quiz-ზე რჩება; guide/hub არ იკვებება.  
**Impact:** Topical authority loop.  
**Fix:** 3 ბმული max. Copy: practice ≠ field ID. Identify guide რჩება canonical `შხამიანი თუ უშხამო`.

### T3. Title template აორმაგებს title-ს

- [ ] **T3** Quiz (+ quizzes hub) title აღარ უნდა იჭრებოდეს ` — Reptiles`-ით, ან metaTitle უნდა შემცირდეს

**Current:** `src/app/layout.tsx` `template: %s — Reptiles`. Quiz აბრუნებს `რომელი გველია? — საქართველოს გველების ამოცნობის ქვიზი` → SERP-ში ხდება `…ქვიზი — Reptiles`.  
**Problem:** Truncation, brand repetition, CTR.  
**Impact:** Title CTR on the one query we can win.  
**Fix:** `generateMetadata`-ში `title: { absolute: t("metaTitle") }` ამ ორ გვერდზე. KA title დატოვე `რომელი გველია? — საქართველოს გველების ქვიზი` (brand template-ის გარეშე).

---

## P1 — High priority (SEO cluster + architecture before quiz #2)

### T4. Quiz registry + `[slug]` route — სანამ მეორე quiz აშენდება

- [ ] **T4** `QUIZ_INDEX` გახადე რეალური registry; href აღარ იყოს `Extract<AppPathnames, "/quiz/gvelis-identifikacia">`

**Current:** `QuizMessageKey = "snake" | "lizard" | "turtle"`. მეორე live quiz = ახალი App Router folder + pathname + 4 redirect + type change. Folder სახელი `gvelis-identifikacia` ≠ public slug `romeli-gvelia`.  
**Problem:** 5+ quiz-ზე refactor სავალდებულო გახდება.  
**Impact:** Scalability bottleneck.  
**Fix:**

```text
src/lib/quizzes.ts          id, status, pathnames {ka,en}, group, heroSpeciesId, generator
src/app/[locale]/quiz/page.tsx
src/app/[locale]/quiz/[slug]/page.tsx   resolve slug → definition → notFound()
```

`pathnames.ts`: `/quiz/[slug]` localized map ან per-quiz entries registry-დან. ძველი `/quiz/gvelis-identifikacia` 301 დარჩეს. Generic `QuizPlayer`, არა `SnakeQuiz` copy-paste.

### T5. Quiz გვერდზე crawlable ID content (thin landing-ის გასქელება)

- [ ] **T5** Intro-ს ქვემოთ (FAQ-ის გარეთ) დაამატე 400–700 სიტყვა KA + ცალკე EN: როგორ ამოიცნო ფოტოზე, 4–6 lookalike წყვილი, ბმულები species + identify guide

**Current:** Indexable HTML = H1 + startLead + 3 rules + 4 product FAQ + noscript სახელების სია (ბმულების გარეშე). კითხვები client-only.  
**Problem:** `რომელი გველია` იგებს slug/H1-ით; `გველის ამოცნობა` / informational queries — არა. FAQ არის „როგორ მუშაობს ქვიზი“, არა იდენტიფიკაცია.  
**Impact:** Thin-content risk; cannibalization vs `/gvelebi/shxamiani-gvelis-amocnoba` თუ იგივე intent-ს დააკოპირებ.  
**Fix:** უნიკალური კუთხე: **ფოტოთი ვარჯიში**, არა field-safety. Lookalike წყვილები `SNAKE_LOOKALIKE_PAIRS`-დან + species links. EN ცალკე დაიწეროს, არა KA calque.

- [ ] **T5b** `noscript` სიაში თითო სახეობა იყოს `Link` species page-ზე (crawl path JS-ის გარეშე)

### T6. Intent split — cannibalization map (გააჩერე, სანამ ახალ quiz-ს დაამატებ)

- [ ] **T6** ქვემოთ mapping დაიცავი; ახალი quiz/page არ დაიწყოს იგივე primary keyword-ზე

| Query | არსებული გვერდი | Quiz | Canonical intent |
| --- | --- | --- | --- |
| `რომელი გველია` / `გველების ქვიზი` / `გველების ტესტი` | — | **`/quiz/romeli-gvelia`** | Practice / photo ID game |
| `გველის ამოცნობა` / `შხამიანი გველის ამოცნობა` | **`/gvelebi/shxamiani-gvelis-amocnoba`** | Supporting link only | How-to / safety ID |
| `საქართველოს გველები` | **`/gvelebi`** | Supporting | Hub |
| `შხამიანი გველები საქართველო` | **`/gvelebi/shxamiani-gvelebi`** | მომავალი venomous-practice quiz, არა ეს გვერდი | Species list + risk |
| `რა გველია ეს` | Species (თუ query-ში სახელი/ფოტოა) ან identify guide | Quiz supporting | Identification, not entertainment |
| `გველგესლა` / species name | **Species profile** | Quiz არასდროს | Entity page |
| `ხვლიკების ქვიზი` / `რომელი ხვლიკია` | — | მომავალი lizard quiz | ცარიელი slot |
| `ბაყაყების ქვიზი` / `ამფიბიების ქვიზი` | — | მომავალი amphibian quiz | ცარიელი slot |

არ ააშენო `/quiz/gvelis-amocnoba` ან `/quiz/gvelis-identificireba` — იგივე intent, სხვა slug.

**Live quiz keyword set (დატოვე ასე)**

| ველი | KA | EN |
| --- | --- | --- |
| Primary | რომელი გველია | which snake Georgia |
| Secondary | გველების ქვიზი, გველების ტესტი, საქართველოს გველების ამოცნობა | Georgia snake quiz, snake identification quiz Georgia |
| არა primary | გველის ამოცნობა, შხამიანი გველები | identify venomous snake |
| H1 | რომელი გველია? | Which snake is it? |
| Slug | `/quiz/romeli-gvelia` | `/en/quiz/which-snake` |
| Meta description | Click-oriented, 1 quiz, 10 ფოტო, რეგისტრაციის გარეშე. არა keyword stuffing | იგივე intent, არა KA სიტყვა-სიტყვა |

- [ ] **T6b** KA `metaDescription` გადაამოწმე: ბუნებრივი CTR, „გიურზა/გველგესლა“ `keywords` meta-დან ამოიღე (Google keywords meta-ს იგნორებს; stuffing რჩება title/H1-ში თუ იქ გადაიტან)

### T7. `/quiz` hub: thin + vaporware

- [ ] **T7** Hub copy: 1 live quiz + როდის დაემატება დანარჩენი. „მალე“ ბარათები არ დაჰპირდნენ არარსებულ გვერდს, როგორც თითქმის live-ს

**Current:** CollectionPage indexableა. Lizard/turtle `soon`, href არ აქვთ (კარგი — ცალკე URL არ არის). Meta: „ფოტო-ქვიზები გველებზე, ხვლიკებსა და კუებზე“. ამფიბიები არც index-შია.  
**Problem:** 1 URL, 1 რეალური აქტივი. 100 quiz-ზე hub საჭიროა; ახლა borderline thin.  
**Fix:** H1/subtitle ფოკუსი live quiz-ზე. Upcoming = 1 ხაზი, არა 2 დიდი card თუ კონტენტი არ არის. Amphibian ჩაამატე registry-ში მხოლოდ როცა live იქნება. Hub დარჩეს indexable (cluster parent).

### T8. Related quizzes + identify page loop

- [ ] **T8** Quiz intro/result-ზე „შემდეგ: შხამიანი თუ უშხამო“ + species hub. Identify guide-ზე quiz card უკვე არის (`HUB_CLUSTER_CARDS.snakes`) — შეამოწმე რომ visibleა above-the-fold-თან ახლოს

**Current:** Species → quiz (`getSpeciesGuideLinks`) კარგია. Quiz → species მხოლოდ reveal-ზე. Quiz → other quizzes არ არსებობს.  
**Fix:** Result-ზე related block 2 ბმულით (identify + venomous). მეორე quiz-ის შემდეგ: related quizzes from registry same group.

### T9. Share loop (quiz URL, არა result URL)

- [ ] **T9** Result-ზე Web Share + copy link. Share URL = canonical quiz (`/quiz/romeli-gvelia`). Score მხოლოდ share text-ში

**Current:** Share არ არის. OG ერთია: `/images/guides/snake-quiz-og.jpg` (1024×559).  
**Problem:** Viral loop 0. Dynamic result OG = ახალი URL-ები / thin pages.  
**Fix:** `navigator.share` + clipboard. Text:

- KA: `შეგიძლია გამოიცნო საქართველოს გველი? 10 ფოტო — reptiles.ge/quiz/romeli-gvelia`
- EN: `Can you tell Georgia’s snakes apart? 10 photos — reptiles.ge/en/quiz/which-snake`

არა clickbait (`ყველა აბრკოლებს`). WhatsApp/FB იღებს OG image-ს quiz page-იდან. Score-სთვის ცალკე URL არ შექმნა.

- [ ] **T9b** OG image 1200×630 (ახლა 1024×559)

### T10. Analytics funnel

- [ ] **T10** GA4 events + funnel. არსებული დატოვე; დაამატე ნაკლები

**Current (`trackEvent` → `gtag`):** `quiz_started`, `quiz_restarted`, `quiz_answered`, `quiz_completed`, `quiz_hint_used`, `species_page_clicked`.  
**არ არის:** `quiz_view`, `quiz_abandon`, `share_click`, `related_quiz_click`, `result_view`.

| Event | როდის |
| --- | --- |
| `quiz_view` | Intro mount (page_view-ის გარდა, quiz_id-ით) |
| `quiz_started` | უკვე არის |
| `quiz_answered` | უკვე არის (question, species, correct, difficulty) |
| `quiz_abandoned` | `visibilitychange`/`pagehide` თუ `playing && !complete` |
| `quiz_completed` | უკვე არის |
| `species_page_clicked` | დაამატე `source: quiz_result` |
| `quiz_share_clicked` | share/copy |
| `quiz_retry_clicked` | rename ან alias `quiz_restarted` |

GA4-ში custom funnel: view → start → q1 → … → complete → species_click.  
**საოპერაციო metric-ები:** start rate, completion rate, species CTR from result, question-level miss rate (რომელი სახეობა იშლება). SEO iteration = miss rate + landing query (Search Console), არა მხოლოდ starts.

---

## P2 — Should fix

### Structured data

**ახლა**

| გვერდი | Schema |
| --- | --- |
| `/quiz` | BreadcrumbList, CollectionPage + `hasPart: Quiz` (stub) |
| `/quiz/romeli-gvelia` | BreadcrumbList, Quiz (name/url/about/numberOfQuestions, **არ აქვს `hasPart` Question**), FAQPage (4 product Q) |

- [ ] **T11** FAQPage დატოვე მხოლოდ თუ FAQ visible რჩება. არ ელოდო FAQ rich result (Google-მა FAQ rich result მოხსნა / შეზღუდა). ახალი FAQ მხოლოდ რეალური user კითხვებისთვის.

- [ ] **T12** Education Q&A / Quiz rich result **არ** მიაბა ამ ინტერაქტიულ ქვიზს. Google Quiz markup ითხოვს visible flashcards (`eduQuestionType: Flashcard`, `acceptedAnswer`). დინამიური MCQ + JSON-LD-ში „ფიქსირებული“ კითხვები = policy mismatch. Stub `Quiz` (LearningResource) OK semantic-ად. Flashcard markup მხოლოდ მაშინ, თუ T5-ის lookalike ბლოკი რეალურად flashcard ტექსტია გვერდზე.

- [ ] **T13** არ დაამატო Taxon/Article/ItemList „რადგან შეიძლება“. BreadcrumbList დატოვე. CollectionPage hub-ზე დატოვე.

### Performance / payload

- [ ] **T14** `SnakeQuizPage` გახლიჩე: `SnakeQuiz` client; FAQ + T5 article = Server Component. ახლა მთელი გვერდი `"use client"`.

- [ ] **T15** Cover `Image`: `priority` მხოლოდ intro-ზე. Question change-ზე `priority` მოხსენი. Next question image `preload` (next `questions[index+1].image`) reveal-ის შემდეგ.

- [ ] **T16** Client-ზე გაგზავნე მხოლოდ quiz pool: `{ id, commonName, scientificName, image, imageCredit, hint, explanation, genus, family }`. არა სრული `Species`. 22 გველზე OK; 100 quiz × full catalog — არა.

### UX

- [ ] **T17** Reveal-ის შემდეგ focus გადაიტანე feedback heading-ზე (`tabIndex={-1}` + `focus()`). Radio group-ს გაუკეთე ArrowUp/Down (ახლა `role="radio"` button-ებზე native radio keyboard არ არის).

- [ ] **T18** ამოიღე emoji `სწორია! 🎉` / `Correct! 🎉` — screen reader + tone.

- [ ] **T19** Mobile reveal-ზე `scientificName` ჩანს (`hidden sm:block` მოხსენი).

- [ ] **T20** Retry / refresh: mid-quiz refresh = intro (state URL არ არის — SEO-სთვის სწორი). UX: `sessionStorage` draft optional; არა URL.

### Accessibility

- [ ] **T21** `aria-live` feedback-ში დაამატე explicit `aria-label` სწორი სახეობისთვის. Contrast: white text on photo — შეამოწმე WCAG on real covers (overlay უკვე dark-ია).

- [ ] **T22** Breadcrumb intro-ზე: `ArrowLeft` + „მთავარი“ back-ს ჰგავს. ჩვეულებრივი breadcrumb Home / ქვიზები / რომელი გველია (JSON-LD უკვე ასეა).

### Locale / hreflang

**მდგომარეობა კარგია:** `localeAlternates` ka/en/x-default=ka, `localePrefix: as-needed`, 301 slug mismatch-ებზე, sitemap ორივე URL-ს აგდებს.

- [ ] **T23** KA FAQ/T5 ტექსტი EN-ის კალკი არ უნდა იყოს. EN primary არის `Georgia snake quiz` / `snakes of Georgia` — global `which snake` ვერ მოიგებ.

- [ ] **T24** `/quiz` slug ორივე locale-ზე `/quiz` რჩება (loanword). არ გადააკეთო `/qvizebi` თუ Search Console-ში `ქვიზები` არ დომინირებს — დაამატე მხოლოდ მტკიცებულებით.

### Security / answers

**არ არის P0.** `correctId` client bundle-შია; image URL ≈ species.image. ეს educational quiz-ია, არა exam.

- [ ] **T25** Answer key-ის server-side დამალვა **არ** გაკეთდეს ახლა (latency + complexity, სარგებელი 0). User query params არ გამოიყენო. Invalid `/quiz/unknown` უკვე `[...rest]` → 404 noindex.

- [ ] **T26** `generateSnakeQuiz` unit tests: unique species per round, 4 options, correctId ∈ optionIds, distractor genus/lookalike preference, unpublished ids არასდროს.

### Content quality (generated questions)

კითხვა ყოველთვის ერთია: ფოტო → 4 სახელი. Unambiguous **თუ** ფოტო დიაგნოსტიკურია.

- [ ] **T27** თითო published snake-ის quiz image: ID traits ჩანს? `QUIZ_IMAGE_OVERRIDES` ახლა მხოლოდ `zamenis-longissimus`. Vipera lookalikes (kaznakovi / dinniki / transcaucasiana / darevskii / renardi) — თუ hero არ განასხვავებს, override ან ამოიღე hard pool-იდან სანამ ფოტო არ არის.

- [ ] **T28** `buildQuizHint`: manual review 22 hint-ზე. CRITICAL თუ hint ორ სახეობას ერგება (განსაკუთრებით *Vipera*, *Eirenis*, *Natrix*).

- [ ] **T29** Distractors: `pickSnakeDistractors` genus/family/lookalike ranking კარგია. Glass lizard (`pseudopus-apodus`) snake quiz-ში არ უნდა მოხვდეს როგორც option (ახლა `isSnakeSpecies` filter იცავს — არ დაარღვიო). Identify guide-ში gველხოკერა რჩება.

CRITICAL taxonomy vs species pages: **არ მოიძებნა** (SSOT). ახალი quiz content მხოლოდ catalog fields-იდან.

---

## P3 — Future optimization / programmatic SEO

Programmatic **species-per-quiz URL** (`/quiz/natrix-natrix`) = thin farm. არ ააშენო.

ააშენე მხოლოდ editorial quiz, უნიკალური intro + intent slot (T6).

| იდეა | SEO | Quality | Dup risk | Scale | User | რიგი |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| გააძლიერე არსებული `რომელი გველია` (T5+T1) | 9 | 8 | 3 | 8 | 9 | **1** |
| `რომელი ხვლიკია` photo quiz | 8 | 8 | 2 | 7 | 8 | **2** |
| `რომელი ბაყაყია` / ამფიბიები | 8 | 8 | 2 | 6 | 8 | **3** |
| შხამიანი vs უშხამო **practice** quiz (ყველა option venomous+harmless pair) | 7 | 8 | 7 vs identify guide | 6 | 9 | **4** — მხოლოდ თუ H1/meta არის „ივარჯიშე“, არა „როგორ ამოიცნო“ |
| `რომელი კუა` | 5 | 7 | 2 | 4 | 6 | 5 (3–4 სახეობა = მოკლე) |
| Beginner 5-question (easy pool only) | 4 | 7 | 8 vs main snake quiz | 8 | 8 | ნუ ცალკე URL — `?` არა; mode on same URL noindex, ან skip |
| Region quizzes (`კახეთის გველები`) | 5 | 6 | 8 vs `/regions/[id]` | 7 | 6 | არა, სანამ region pages სუსტია |
| Habitat / tracks / eggs / kids clones | 3–5 | 5–7 | 6–9 | 5–8 | 5–7 | მხოლოდ რეალური editorial + სხვა intent |

- [ ] **T30** Lizard quiz: იგივე engine, pool = lizards with photos, slug `/quiz/romeli-xvlikia` · `/en/quiz/which-lizard`. H1 `რომელი ხვლიკია?`. Darevskia = hard pool; beginner-ში jოჯო / გველხოკერა / Anguis.

- [ ] **T31** Amphibian quiz: `/quiz/romeli-bayayia` ან `/quiz/amfibiebi`. Hub meta ახლა amphibia-ს არ ჰპირდება — დაამატე მხოლოდ live-ისას.

- [ ] **T32** Venomous practice quiz: slug `/quiz/shxamiani-tu-ushxamo` — **არა** `gvelis-amocnoba`. Canonical how-to რჩება identify guide.

- [ ] **T33** Difficulty modes same URL-ზე, query **noindex** თუ როდესმე `?difficulty=` გამოჩნდება (`robots` + canonical to clean quiz URL). უკეთესი: client toggle, URL უცვლელი.

---

## Google Search strategy (Reptiles.ge moat)

Generic quiz sites ვერ აკეთებენ: Georgia-only taxonomy, field photos, bilingual KA-first names, species graph, venomous/identify/range cluster. Moat = quiz **არ არის** ცალკე თამაში, არამედ atlas-ის practice layer.

### Tier 1 — #1 რეალური შანსი (KA)

| Query | Target | რა უნდა | Difficulty |
| --- | --- | --- | --- |
| `რომელი გველია` | Quiz | T3 title, T5 content, T1 links | Low–med |
| `გველების ქვიზი` / `გველების ტესტი` | Quiz | Same page, natural in title/desc | Low |
| `რომელი ხვლიკია` | მომავალი lizard quiz | T30, არა snake quiz | Low (ცარიელი SERP) |

### Tier 2 — Top 3

| Query | Target | შენიშვნა |
| --- | --- | --- |
| `საქართველოს გველები ქვიზი` | Quiz | Long-tail, supporting |
| `გველის ამოცნობა` | Identify guide + quiz as related | Quiz არ უნდა გადაიბაროს |
| `ბაყაყების ქვიზი` | მომავალი amphibian quiz | T31 |

### Tier 3 — authority, არა quiz-first

`საქართველოს გველები`, `შხამიანი გველები საქართველო`, species names, `რა გველია ეს` (visual). Target: hubs + species. Quiz მხოლოდ internal link.

---

## TOP 10 changes (SEO / traffic / CTR / engagement / authority)

| # | ცვლილება | Impact | Effort | Pri |
| ---: | --- | ---: | ---: | --- |
| 1 | T1 Result → species list + links | 9 | 3 | P0 |
| 2 | T5 Crawlable lookalike/ID copy on quiz URL | 9 | 5 | P1 |
| 3 | T3 Absolute title, no ` — Reptiles` doubling | 7 | 1 | P0 |
| 4 | T4 Registry + `[slug]` before quiz #2 | 8 | 6 | P1 |
| 5 | T9 Share canonical quiz + copy | 7 | 3 | P1 |
| 6 | T2 Result → identify + venomous + hub | 7 | 2 | P0 |
| 7 | T30 Lizard quiz (ცარიელი KA intent) | 8 | 6 | P3 after T4 |
| 8 | T10 Funnel + abandon + result species clicks | 6 | 3 | P1 |
| 9 | T6 Strict intent split; no second snake-ID slug | 8 | 2 | P1 |
| 10 | T31 Amphibian/frog quiz | 7 | 5 | P3 after T4 |

---

## რა არ შეცვალო

- [x] Result/question/session **არ** გახდეს indexable URL
- [x] Taxonomy SSOT catalog-იდან
- [x] KA slug `romeli-gvelia` / EN `which-snake`
- [x] `index,follow` მხოლოდ hub + quiz landing
- [x] 301-ები ძველ `gvelis-identifikacia` / cross-locale slugs-ზე
- [x] Species pages → quiz link (snakes)
- [x] `generateStaticParams` SSG quiz pages
- [x] Client-side round generation (no crawlable answer-state)

---

## Release

**READY WITH MINOR FIXES**

Ship live snake quiz. არ ship-ე მეორე quiz T4-მდე.  
P0 (T1–T3) = conversion + title. P1 (T4–T10) = cluster-ად ქცევა.

**#1 Google-ზე საქართველოს გველები/ქვეწარმავლები/ამფიბიები ecosystem-ისთვის ეს მოდული სწორად არის აგებული?**

ნაწილობრივ. სწორია როგორც **ერთი** practice landing `რომელი გველია?`-ზე, უსაფრთხო indexability-ით და catalog SSOT-ით. არ არის სწორი ჯერ როგორც long-tail SEO engine: thin HTML, result არ აგზავნის species graph-ში, registry hardcodedა ერთ quiz-ზე, share/funnel არასრულია, ხვლიკი/ამფიბია intent ცარიელია. გააკეთე T1–T10, შემდეგ T30–T31 — მაშინ quiz atlas-ის moat-ს ამაგრებს და არ ეჯიბრება.
