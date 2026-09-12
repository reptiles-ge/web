# reptiles.ge — პერსონალური მონაცემებისა და სამართლებრივი შესაბამისობის აუდიტი

სამუშაო თარიღი: 2026-09-12  
სტატუსი: სამუშაო დასკვნა და გამოსაქვეყნებელი დოკუმენტების საფუძველი  
რეპოზიტორია: `/Users/asyncfinkd/Desktop/reptiles`

ეს დასკვნა შედგენილია რეპოზიტორიის კოდის, კონფიგურაციისა და საჯაროდ ხელმისაწვდომი სამართლებრივი წყაროების საფუძველზე. სადაც მფლობელის, კონტრაქტების, მესამე მხარის პანელების ან რეალური შენახვის ვადების შესახებ ფაქტი კოდიდან არ დგინდება, გამოყენებულია ჩანაწერი: `[საჭიროა მფლობელისგან დაზუსტება]`.

## სამართლებრივი წყაროები

- საქართველოს კანონი „პერსონალურ მონაცემთა დაცვის შესახებ“, მოქმედი კონსოლიდირებული ტექსტი, Matsne: https://matsne.gov.ge/en/document/view/5827307?publication=8
- GDPR, Regulation (EU) 2016/679, ოფიციალური EUR-Lex ტექსტი: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng

საქართველოს კანონისთვის მნიშვნელოვანი აქცენტებია გამჭვირვალობა, მიზნობრიობა, მონაცემთა მინიმიზაცია, უსაფრთხოება, სუბიექტის უფლებები და უცხო ქვეყანაში/საერთაშორისო ორგანიზაციაში გადაცემის წესები. GDPR-ის ტერიტორიული მოქმედება განსაკუთრებით საყურადღებოა, თუ საიტი ევროკავშირის/EEA ვიზიტორების ქცევას აკვირდება ან მათ მიმართ მიზნობრივ მომსახურებას/კომუნიკაციას ახორციელებს. reptiles.ge არ ყიდის მომსახურებას და არ აქვს ანგარიში/რეგისტრაცია, მაგრამ Google Tag Manager, შესაძლო Google Analytics/Ads ტეგები და ქცევითი ივენთები GDPR/ePrivacy რისკს ქმნის ევროკავშირიდან ვიზიტების შემთხვევაში.

## ტექნიკური სურათი

პროექტი არის Next.js 16 App Router აპლიკაცია, `next-intl` მრავალენოვანობით. საჯარო საიტს არ აქვს ანგარიში, პაროლი, კალათა, გამოწერა, ჩაშენებული საკონტაქტო ფორმა ან მონაცემთა ბაზა. მთავარი პერსონალური მონაცემების ზედაპირებია ტექნიკური მოთხოვნის მონაცემები, ანალიტიკა/ტეგები, ბრაუზერის cookie/localStorage/sessionStorage, ელფოსტით კონტაქტი და ავტორების/ფოტოგრაფების საჯარო კრედიტები.

კოდიდან დადგენილი მთავარი ფაილები:

- `src/app/layout.tsx` — Vercel Speed Insights, Google Tag Manager, `NEXT_LOCALE`, theme init.
- `src/components/GoogleTagManager.tsx` — GTM loader და `dataLayer`.
- `src/lib/analytics.ts` — მომხმარებლის ქცევითი ივენთები `dataLayer`-ში.
- `src/components/SpeciesSearch.tsx`, `src/lib/siteSearch.ts` — ძებნის query ივენთები და recent search storage.
- `src/lib/quizDraft.ts` — quiz draft sessionStorage.
- `src/components/ContactPage.tsx` — მხოლოდ `mailto:` კონტაქტი.
- `src/lib/adminAccess.ts` — admin UI მხოლოდ local/non-Vercel გარემოში.
- `next.config.ts` — CSP/security headers, CDN allowlist, API noindex.

## მონაცემთა ნაკადები

### საიტის მიწოდება და ტექნიკური ლოგები

საიტი მუშაობს Vercel-ზე. საჯარო პასუხებში ჩანს `Server: Vercel` და first-party `NEXT_LOCALE` cookie. Vercel, ქსელური ინფრასტრუქტურა და CDN პროვაიდერები ბუნებრივად ამუშავებენ IP მისამართს, request headers-ს, URL-ს, user-agent-ს და ტექნიკურ ლოგებს საიტის მიწოდებისა და უსაფრთხოებისთვის. Vercel-ის რეალური შენახვის ვადები, რეგიონები და DPA/contractual terms კოდიდან არ დგინდება — `[საჭიროა მფლობელისგან დაზუსტება]`.

### Vercel Speed Insights

`@vercel/speed-insights/next` ჩართულია `src/app/layout.tsx`-ში. ის აგზავნის performance/usage telemetry-ს Vercel-ში. პოლიტიკაში უნდა იყოს აღწერილი როგორც performance analytics/measurement. თუ ის არ არის მკაცრად აუცილებელი, საჭიროა გადაწყდეს, უნდა იყოს თუ არა consent-ზე დამოკიდებული, განსაკუთრებით EU/EEA ვიზიტორებისთვის.

### Google Tag Manager და შესაძლო Google Analytics/Ads

პროდუქციაში იტვირთება GTM container `GTM-NM65ZMML`. კოდი ადასტურებს GTM-ის ჩატვირთვას, მაგრამ GTM container-ის შიდა კონფიგურაცია რეპოზიტორიაში არ ჩანს. ამიტომ ზუსტად ვერ დგინდება, იტვირთება თუ არა Google Analytics 4, Google Ads/DoubleClick, conversion linker ან სხვა ტეგები.

`src/lib/analytics.ts` და UI კომპონენტები აგზავნიან ქცევით ივენთებს, მათ შორის:

- ენის შეცვლა;
- ძებნის გახსნა, query, no-result, result click;
- atlas/index filters;
- species view/click;
- source click;
- gallery open;
- audio/voice play;
- contact click;
- quiz start/answer/complete/share;
- FAQ open;
- region map select;
- species name copy.

განსაკუთრებით საყურადღებოა search query, რადგან მომხმარებელმა ძებნაში შეიძლება შემთხვევით ჩაწეროს პერსონალური ინფორმაცია. მისი `dataLayer`-ში გაგზავნა უნდა შეფასდეს მინიმიზაციის პრინციპით.

### ძებნა და quiz

ძებნა ძირითადად client-side Fuse.js index-ით მუშაობს. ბოლო არჩეული search results ინახება `localStorage`-ში, key: `reptiles.search.recent`, მაქსიმუმ 5 ჩანაწერი. Search query აგზავნება `dataLayer`-ში.

Quiz-ს არ სჭირდება ანგარიში ან სახელი. მიმდინარე სესიის draft ინახება `sessionStorage`-ში `reptiles.quiz.draft.{quizId}` key-ით და შეიცავს quiz progress-ს, არჩეულ პასუხებს და species IDs-ს. Quiz events ასევე იგზავნება `dataLayer`-ში.

### კონტაქტი

საიტზე არ არის საკონტაქტო ფორმა. `ContactPage` იყენებს `mailto:nika@shamiladze.com` ბმულს. თუ მომხმარებელი წერს ელფოსტას, პერსონალური მონაცემები მუშავდება ელფოსტის პროვაიდერისა და მფლობელის საფოსტო ანგარიშის ფარგლებში. ოფიციალური privacy contact და retention — `[საჭიროა მფლობელისგან დაზუსტება]`.

### ფოტოები, ავტორები და contributors

საიტი საჯაროდ აქვეყნებს ავტორების/ფოტოგრაფების სახელებს, credit-ს, ბმულებს, ზოგჯერ მდებარეობას, თარიღს და კოორდინატებს ფოტოებისთვის. ეს შეიძლება იყოს პერსონალური მონაცემი, თუ უკავშირდება იდენტიფიცირებულ ფიზიკურ პირს. საჭიროა უფლებრივი საფუძვლის დადგენა: ავტორის თანხმობა, ლიცენზია, legitimate interest/crediting, ან საჯარო ლიცენზიის პირობები. ყველა ფოტოსთვის explicit license field კოდში არ ჩანს, ამიტომ blanket reuse permission არ უნდა ჩაიწეროს Terms-ში.

### admin workflow

`/admin` პრაქტიკულად local-only არის (`NODE_ENV !== "production" && !process.env.VERCEL`). Admin photo workflow ამუშავებს ფაილებს, ფოტოგრაფს, ლოკაციას, თარიღს, კოორდინატებს, `photoConfidence`-ს და Bunny Storage upload-ს. ეს არ არის საჯარო მომხმარებლის ზედაპირი, მაგრამ არის ოპერატორის/კონტრიბუტორის მონაცემთა შიდა პროცესი და უნდა მოხვდეს შიდა vendor/register-ში.

## Cookie და storage ცხრილი

| სახელი                                              | ტიპი           | პროვაიდერი                        | მიზანი                           | ვადა                                                          | კატეგორია                | შენიშვნა                                                                     |
| --------------------------------------------------- | -------------- | --------------------------------- | -------------------------------- | ------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `NEXT_LOCALE`                                       | cookie         | reptiles.ge / next-intl           | ენის არჩევის დამახსოვრება        | ბრაუზერის/session ან framework-ის კონფიგურაციაზე დამოკიდებული | აუცილებელი/ფუნქციური     | live response-ში ჩანს `SameSite=Lax`; ზუსტი Max-Age არ ჩანს                  |
| `reptiles-theme`                                    | localStorage   | reptiles.ge                       | light/dark theme preference      | სანამ მომხმარებელი/ბრაუზერი არ წაშლის                         | ფუნქციური                | არ იგზავნება სერვერზე                                                        |
| `reptiles.search.recent`                            | localStorage   | reptiles.ge                       | ბოლო არჩეული search results      | fixed expiry არ არის                                          | ფუნქციური                | ინახავს species/content identifiers-ს, არა თავისუფალ ტექსტს                  |
| `reptiles.quiz.draft.{quizId}`                      | sessionStorage | reptiles.ge                       | quiz progress                    | tab/session-ის დასრულებამდე ან quiz დასრულებამდე              | ფუნქციური                | ინახავს quiz answers/species IDs-ს                                           |
| `_ga`, `_ga_*`, `_gid`, `_gat`, `_gcl_*` და მსგავსი | cookie         | Google, GTM container-ის მიხედვით | analytics/conversion/advertising | Google tag/config-ზე დამოკიდებული                             | ანალიტიკური/მარკეტინგული | კოდი ადასტურებს GTM-ს; ზუსტი cookies საჭიროა GTM/GA dashboard-ით გადამოწმდეს |

## მესამე მხარეები

| მესამე მხარე                     | კოდით დადგენილი როლი             | მონაცემები                                         | რისკი/საჭირო მოქმედება                                                      |
| -------------------------------- | -------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| Vercel                           | hosting, headers, Speed Insights | IP, request data, performance telemetry            | DPA, რეგიონი, retention, sub-processors: `[საჭიროა მფლობელისგან დაზუსტება]` |
| Bunny CDN/Storage                | CDN და admin upload tooling      | media files, admin-upload metadata                 | DPA, retention, storage region: `[საჭიროა მფლობელისგან დაზუსტება]`          |
| Google Tag Manager               | tag loading                      | `dataLayer` events, page context, possible cookies | consent gating, GTM export, GA retention აუცილებელია                        |
| Google Analytics/Ads/DoubleClick | შესაძლო GTM tags/CSP allowlist   | analytics/conversion identifiers                   | exact usage `[საჭიროა მფლობელისგან დაზუსტება]`                              |
| Google Maps                      | outbound photo coordinate link   | click takes user to Google                         | only after user click; disclose external link                               |
| External scientific/media sites  | outbound source/credit links     | user leaves site                                   | disclose external sites have own policies                                   |

## საერთაშორისო გადაცემები

Vercel, Google, Bunny და სხვა providers შესაძლოა მონაცემებს ამუშავებდნენ საქართველოს ფარგლებს გარეთ, მათ შორის EU/EEA-სა და აშშ-ში. საქართველოს კანონის მოქმედი ტექსტი უცხო ქვეყანაში/საერთაშორისო ორგანიზაციაში გადაცემისთვის ითხოვს შესაბამის საფუძველს/გარანტიებს. პოლიტიკაში უნდა ჩაიწეროს საერთაშორისო გადაცემების ზოგადი აღწერა, ხოლო მფლობელმა უნდა შეინახოს vendor/DPA/transfer register — `[საჭიროა მფლობელისგან დაზუსტება]`.

## Gap analysis

### Critical

1. GTM და ქცევითი analytics repo-ით დამტკიცებული consent gate-ის გარეშე იტვირთება.
   - სად ჩანს: `src/app/layout.tsx`, `src/components/GoogleTagManager.tsx`, `src/lib/analytics.ts`.
   - რისკი: non-essential analytics/marketing cookies და search/quiz behavioral events შეიძლება ჩაირთოს მანამ, სანამ მომხმარებელი თანხმობას მისცემს. EU/EEA ვიზიტორებისთვის ეს განსაკუთრებით მაღალი რისკია.
   - მოქმედება: GTM/GA/custom analytics გაუშვით მხოლოდ შესაბამის consent-ზე ან დანერგეთ Google Consent Mode default denied before load.

### Important

2. GTM container-ის შიდა ტეგები უცნობია.
   - სად ჩანს: repo-ში მხოლოდ `GTM-NM65ZMML`.
   - რისკი: პოლიტიკა ვერ იქნება ზუსტი, თუ container-ში GA/Ads/Meta/Hotjar ან სხვა tag არსებობს.
   - მოქმედება: გამოიტანეთ GTM export/tag inventory და cookie scan production-ზე. privacy/cookie ცხრილი განაახლეთ რეალური tags/cookies-ის მიხედვით.

3. Search query იგზავნება analytics-ში.
   - სად ჩანს: `src/lib/analytics.ts`, search components.
   - რისკი: user-generated free text შეიძლება შეიცავდეს სახელს, ტელეფონს, ადგილს ან სხვა პერსონალურ ინფორმაციას.
   - მოქმედება: განიხილეთ raw `search_term`-ის საერთოდ ამოღება, client-side aggregation, ან მხოლოდ result/no-result signal-ის გაგზავნა.

4. retention policy არ არის დოკუმენტირებული.
   - ეხება: GA/GTM, Vercel Speed Insights, Bunny და email correspondence.
   - მოქმედება: შექმენით შიდა retention register და policy-ში მიუთითეთ რეალური ვადები.

5. ფოტოებისა და third-party media-ს უფლებები granular metadata-ით არ ჩანს.
   - სად ჩანს: credit fields არის, მაგრამ ერთიანი `license` field ყველა ფოტოსთვის არ არის.
   - რისკი: Terms-ში reuse permissions შეიძლება არაზუსტი გამოვიდეს.
   - მოქმედება: დაამატეთ structured license/rights metadata მომავალში ან Terms-ში მკაფიოდ თქვით, რომ reuse დამოკიდებულია კონკრეტულ credit/source/license-ზე.

### Improvements

6. დაამატეთ საჯარო `/privacy` და `/terms-and-conditions` გვერდები ყველა locale-ზე, footer/header link-ით.

7. privacy contact, controller identity, registered/legal address და dispute venue შეავსეთ მფლობელის დადასტურებით.

8. Google Maps outbound links-ზე შეიძლება დაემატოს მცირე UI cue, რომ ბმული გარე საიტზე გადადის.

9. contributor/photo submission workflow-სთვის შეადგინეთ მოკლე contributor notice: უფლებები, consent, credit, sensitive location handling.

## დადებითი მხარეები

- არ არის ანგარიშები, პაროლები, paid checkout, newsletter ან onsite contact form.
- Contact არის `mailto:` და არა form submission.
- Admin UI production-ზე გამორთულია და noindex headers არსებობს.
- CSP, Referrer-Policy, X-Content-Type-Options და X-Frame-Options კონფიგურირებულია.
- quiz draft ინახება sessionStorage-ში და არ ითხოვს სახელს/ელფოსტას.
- search index client-side-ია; recent search ინახავს არჩეული შედეგების identifiers-ს და არა თავისუფალ ტექსტს.
- region map არის first-party SVG; Google Maps იხსნება მხოლოდ მომხმარებლის click-ით.
- ფოტო credit-ები და source links გამჭვირვალედ ჩანს კონტენტში/JSON-LD-ში.

## რეკომენდებული შემდეგი ნაბიჯები

1. შეავსეთ დოკუმენტებში ყველა `[საჭიროა მფლობელისგან დაზუსტება]`.
2. GTM container export-ით და production cookie scan-ით დაადასტურეთ cookies/tags.
3. დაამატეთ Privacy Policy და Terms საჯარო გვერდებად, შემდეგ კი footer link-ები.
4. შეინახეთ vendor register: Vercel, Bunny, Google და email provider.
5. Georgian counsel-მა გადაამოწმოს მოქმედი ზედამხედველი ორგანო, საერთაშორისო გადაცემის საფუძვლები და Terms-ის პასუხისმგებლობის შეზღუდვის ფორმულირებები გამოქვეყნებამდე.
