reptiles.ge · Organic search roadmap · Georgia · prepared 2 Oct 2026

# What to publish, in order: October 2026 to September 2027

Thirty new pages, ranked by real demand, how realistically they can rank, and when Georgians search for them, plus twelve fixes to pages that already exist. Built from the live codebase, 26 days of Search Console data, Georgian, Russian and English Google autocomplete, and five years of Google Trends for Georgia. No search volumes are invented: where a number appears, it was measured.

**12,264** GSC impressions · **250** clicks · 23 Aug – 17 Sep **14** practical guides went live 23–29 Sep (no GSC data yet) **\~140** species profiles **30** new pages · **12** fixes

[What the data says](#findings)[Fix first](#fix)[Top 10](#top10)[Next 20](#next20)[Scorecard](#scores)[Now vs season](#split)[Clusters](#clusters)[Seasonality](#seasonality)[Calendar](#calendar)[Not recommended](#rejected)[Build notes](#notes)[Sources](#sources)

## What the data says

- **Search traffic today comes from species names, not problems.** The top GSC queries are animal names: წავი (1,194 impressions), მაჩვი (529), დედოფალა (439), ენოტი (395), შველი (350). Most rank on page one, but CTR is only 0–2.3%. The 14 practical guides were published after the GSC window, so their performance is still unknown.
- **Most of the brief's examples already exist.** Cockroaches, ants, fleas, mosquitoes, clothes moths, mice, bats, wasp nests, stink bugs, scorpions (house and sting), tick bite, snake bite, giurza bite, spider bite, venomous spiders, snakes in the yard, lizards in the house, jackals and bears are all live. The gaps are the next layer down: bed bugs, rats, spiders in the house, ticks on dogs, stings, flies, pantry pests.
- **Georgian demand is small and sharply seasonal.** Tick searches are near zero from December to March, then jump to 71 in April and 100 in July. Only head terms register in Trends for Georgia, so for long-tail queries a query's presence in autocomplete is the main demand signal. That's why demand is rated qualitatively.
- **Russian-language demand inside Georgia matters for a few summer topics.** On a 5-year average, jellyfish (медузы) searches in Georgia are double tick (клещ) searches, and they peak in July and August. The Russian locale is already live.
- **Georgian results pages are beatable.** Problem queries return news portals re-posting advice (kvirispalitra, ambebi, tabula), health blogs (mkurnali, redmed), pest-control sales pages and translated listicles (rogor.ge, mshoblebi). Sourced, answer-first guides can outrank them.
- **School demand is large and unserved.** Queries ending in სია, ჩამონათვალი or ინფორმაცია cover reptiles, endemic, extinct, migratory and predatory animals. The biggest of them, the Red Book, is blocked by a current owner rule (see Not recommended).
- **Spoken grammar matters.** People type the colloquial genitive: ტკიპას ნაკბენი, ტკიპას ამოღება, ტკიპას მოშორება. The live tick guide is written in the standard ტკიპის form.

Method: a repo audit (routes, guide registry, Georgian titles); the cached Search Console export (\`.seo/reports/gsc-raw.json\`, Georgia only); Google autocomplete for about 250 seeds in KA, RU and EN, including letter-by-letter sweeps of "როგორ მოვიშოროთ …" and "სახლში …"; Google Trends for Georgia over 5 years, averaged by calendar month and scaled so each row's peak = 100; and spot checks of the Georgian results pages for the main opportunities.

## Fix first: twelve changes to pages that already exist

Each takes hours, not days, and avoids building a new page that would compete with an existing one.

1. **Tick-bite guide:** add the colloquial ტკიპას forms (ტკიპას ნაკბენი, ტკიპას ამოღება, ტკიპას მოშორება, ტკიპას ნაკბენი ფოტო) to an H2, the FAQ and the description. The page currently uses ტკიპას only five times.
2. **Snakes-in-the-yard guide:** add a "snake inside the house" section (გველები სახლში autocompletes; the page mentions houses once) and the repellent terms people search for: გველის საწინააღმდეგო საშუალება, აპარატი, სპრეი. It already explains what works and what doesn't.
3. **Venomous-snakes page:** add an explicit H2, "რომელია ყველაზე შხამიანი გველი საქართველოში?". It has three autocomplete variants, and GSC already shows ყველაზე შხამიანი გველები at position 15.
4. **Lizard cannibalization:** "ხვლიკი საქართველოში" has 121 impressions and 0 clicks, split between /xvlikebi (49), /xvlikebi/identifikacia (43), the species index and five profiles. Make the hub's title and H1 own that phrase, and keep the identification page on "ეს რა ხვლიკია".
5. **Mammal profile CTR:** წავი has 1,194 impressions and 6 clicks at about position 8, მაჩვი 529 impressions and 0 clicks at 6.3, and შველი 350 and 8 at 4.8. Page-one positions with CTR this low point to the snippet. Test titles and descriptions that answer "X საქართველოში", and check whether an image pack is taking the clicks.
6. **Raccoon page:** "ენოტისებრი ძაღლი" (raccoon dog, a different animal) lands on the raccoon profile. Add a one-line disambiguation, and create a profile only if a Georgian source records the species.
7. **Stink-bug guide:** add a short section on ladybirds gathering indoors in autumn (ჭიამაიები სახლში). It's a small query: answer it on this page now, and decide on a standalone page next autumn based on GSC.
8. **Mouse guide:** add a "თაგვი თუ ვირთხა?" teaser that links to the new rats page (#3).
9. **Wasp-nest guide:** once the stings page (#7) is live, cut the sting detail down to a summary with a link.
10. **Mammals hub:** add an H2, "მტაცებელი ცხოველები საქართველოში". It autocompletes (RU хищные животные грузии too), and a section is enough.
11. **Scorpions hub:** answer "შხამიანი მორიელი საქართველოში" and "მორიელი დასავლეთ საქართველოში" (both autocomplete) on the page.
12. **Measure the September guides:** run `pnpm seo:audit:gsc` around 1 November. The cached data ends 17 September, before the 14 guides launched. Their indexing and first positions should decide how fast to scale everything below.

## Top 10: build these first

This is publishing order. Pages 1–5 earn traffic now. Pages 6–7 are the two biggest seasonal opportunities, built early so they're indexed and ranking before April and July. Pages 8–10 catch the school year and household problems that run all year.

1

### Bed bugs at home

Traffic now

Page title

ბაღლინჯო სახლში — როგორ ვიპოვოთ და მოვიშოროთ

URL (proposed)

`/mtserebi/baghlinjo-sakhlshi · /en/insects/bed-bugs-at-home`

Primary query

ბაღლინჯოს მოშორება · ბაღლინჯო სახლში

Secondary queries

საწოლის ბაღლინჯოს მოშორება, ბაღლინჯოს ნაკბენი, როგორ გამოიყურება ბაღლინჯოს ნაკბენი, რას იწვევს ბაღლინჯოს ნაკბენი, ბაღლინჯოს ფოტო, ბაღლინჯოების საწინააღმდეგო, ნაკბენი საწოლის ბაღლინჯო; RU клопы в квартире, клопы в диване, клопы в грузии

Page type

Guide article (problem-solving)

Why this page, why now

Autocomplete returns 10+ bed-bug problem variants (removal, bites, photos, products). The site has the საწოლის ბაღლინჯო profile (published 23 Sep), but it is an identification page and does not answer "how do I get rid of it". The demand runs all year: Russian-language Trends in Georgia peak in August, and returning travellers and rental turnover keep it going.

Traffic potential

High

Difficulty

Low–Medium. Current results are pest-control company pages (csmg.ge), a kvirispalitra Q&A, mkurnali and tbiliselebi news posts.

Seasonality

Year-round, with a summer and early-autumn high

Recommended publish

**Oct 2026, weeks 1–2**

Why reptiles.ge can rank

Competing pages are thin news posts or sales pages. reptiles.ge can combine the profile's sourced Georgian records with a step-by-step inspection and treatment plan, lookalikes (stink bug, tick, flea), and bite photos, using the answer-first guide builder that already works for cockroaches and fleas.

Link to it from

საწოლის ბაღლინჯო profile (main link), fleas guide, cockroaches guide, bat-in-house guide (bed bugs at bat colonies), stink-bug guide, /mtserebi hub; the home and footer guide blocks are added automatically by the registry

Cannibalization guard

The profile keeps "საწოლის ბაღლინჯო" (what it is). The guide owns "მოშორება / სახლში / ნაკბენი" and links to the profile for identification instead of repeating it.

2

### Dangerous and venomous animals of Georgia

Traffic now

Page title

საშიში და შხამიანი ცხოველები საქართველოში

URL (proposed)

`/sashishi-tskhovelebi · /en/dangerous-animals`

Primary query

საშიში ცხოველები საქართველოში

Secondary queries

შხამიანი ცხოველები საქართველოში, ყველაზე საშიში ცხოველი, ყველაზე შხამიანი გველი საქართველოში; RU опасные животные грузии, ядовитые животные грузии, самые опасные животные в грузии; EN dangerous animals in georgia country, poisonous animals in georgia

Page type

Cross-group safety hub

Why this page, why now

It autocompletes in Georgian, Russian and English. The current Georgian results are news listicles and a stray-dog article. reptiles.ge already owns every child page (venomous snakes, giurza bite, karakurt, scorpions, ticks, wasps, bear, jackal). The hub turns them into one cluster instead of 20 separate pages.

Traffic potential

High

Difficulty

Medium (broad head term)

Seasonality

Year-round; summer bump May–Aug; school-year curiosity

Recommended publish

**Oct 2026**

Why reptiles.ge can rank

It is the only Georgian source with species-level risk ratings (/riskis-doneebi) and a dedicated page for each animal, and it can rank animals by real medical significance instead of by fear.

Link to it from

Home knowledge block, /riskis-doneebi, venomous snakes, venomous spiders, scorpions hub, bear encounter, jackal in yard, tick bite, wasp nest, snake bite, spider bite, scorpion sting, about page

Cannibalization guard

The hub lists and routes. The venomous-snakes page keeps "შხამიანი გველები". The risk legend stays the methodology page, so retitle it if Google starts swapping the two.

3

### Rats in the house and yard

Traffic now

Page title

ვირთხა სახლში და ეზოში — როგორ მოვიშოროთ და როგორ განვასხვავოთ თაგვისგან

URL (proposed)

`/dzuzumtsovrebi/virtkha-sakhlshi · /en/mammals/rats-in-house`

Primary query

როგორ მოვიშოროთ ვირთხა

Secondary queries

ვირთხა სახლში, როგორ მოვიშოროთ ვირთხები, ვირთხების საწინააღმდეგო საშუალება, ვირთხის წამალი, ვირთხის საწამლავი, ვირთხის ხაფანგი, ვირთხა და თაგვი, ვირთხა და ვირთაგვა

Page type

Guide article

Why this page, why now

Rodents move indoors from October to February. The mouse guide (24 Sep) never mentions rats, yet "როგორ მოვიშოროთ ვირთხა / ვირთხები" shows up in the letter-by-letter "how to get rid of" autocomplete sweep.

Traffic potential

Medium–High

Difficulty

Low–Medium (product and pest-control pages)

Seasonality

Autumn–winter high (Oct–Feb), year-round baseline

Recommended publish

**Oct 2026**

Why reptiles.ge can rank

There are few non-commercial Georgian answers. The site can cover exclusion, safe trap placement, and the risk that poison baits pose to pets, children and owls (secondary poisoning ties back to the atlas), plus a clear rat-vs-mouse table.

Link to it from

Mouse guide (add a "თაგვი თუ ვირთხა?" box), mammals hub, cockroach guide, snakes-in-yard guide (rodents attract snakes), owl profiles (secondary poisoning), jackal in yard

Cannibalization guard

The mouse guide keeps "თაგვი" and the rats page owns "ვირთხა". The comparison table lives only on the rats page.

4

### Reptiles of Georgia

Traffic now

Page title

ქვეწარმავლები საქართველოში — სახეობები, ჯგუფები, ამოცნობა

URL (proposed)

`/kvetsarmavlebi · /en/reptiles`

Primary query

ქვეწარმავლები საქართველოში

Secondary queries

ქვეწარმავლების სახეობები, ქვეწარმავლების სია, ქვეწარმავლების ჩამონათვალი, ქვეწარმავლების სახელები, რეპტილიები საქართველოში, ამფიბიები და ქვეწარმავლები; EN reptiles of georgia

Page type

Class-level hub

Why this page, why now

reptiles.ge has no page for "reptiles": snakes, lizards and turtles each have a hub, but nothing sits above them. Autocomplete shows homework-style demand (სია, ჩამონათვალი, სახელები) during the school year. In GSC, "რეპტილიები საქართველოში" currently lands on the homepage.

Traffic potential

Medium–High

Difficulty

Low (Wikipedia, slideshare, blogs)

Seasonality

School year Sep–May; snake-season bump

Recommended publish

**Oct 2026**

Why reptiles.ge can rank

It's the exact-match domain, the atlas already has 50+ reptile profiles, and the Tarkhnishvili et al. 2026 checklist backs the counts. Few sites can match that.

Link to it from

Home hero and groups block, snakes, lizards and turtles hubs (as parent), species atlas, herpetofauna-checklist news, regions map, amphibians hub (comparison section)

Cannibalization guard

The group hubs keep their own terms; this page owns the class-level query. Take every count from the checklist and add no totals the source doesn't give.

5

### Spiders in the house

Traffic now

Page title

ობობები სახლში — რომელია საშიში და როგორ მოვიშოროთ

URL (proposed)

`/obobebi/obobebi-sakhlshi · /en/spiders/in-the-house`

Primary query

ობობები სახლში

Secondary queries

ობობა სახლში, ობობების საწინააღმდეგო საშუალება, დიდი ობობები საქართველოში, საშიში ობობები საქართველოში, შავი ობობა სახლში; RU пауки в тбилиси

Page type

Guide article

Why this page, why now

Late summer and autumn is when house spiders wander indoors. Both "ობობები სახლში" and "ობობების საწინააღმდეგო" autocomplete. The existing spider pages answer "is it venomous?" and "I was bitten", not "what is this spider in my room and how do I get it out".

Traffic potential

Medium

Difficulty

Low

Seasonality

Aug–Nov high, year-round baseline

Recommended publish

**Oct 2026**

Why reptiles.ge can rank

The house species already have profiles (Pholcus, Steatoda paykulliana, Cheiracanthium, karakurt), and the spider cluster already ranks: "ობობის ნაკბენი" sits around position 7.

Link to it from

Spiders hub, venomous spiders, spider bite, the გრძელფეხა ფოლკუსი / ცრუ ყარაყურთი / Cheiracanthium profiles, house-bug ID (#9), dangerous-animals hub

Cannibalization guard

The venomous-spiders page keeps risk and the species list; this page is practical.

6

### Tick on a dog

Prepare for season

Page title

ტკიპა ძაღლზე — როგორ ამოვიღოთ და როდის მივიყვანოთ ვეტერინართან

URL (proposed)

`/mtserebi/tkipa-dzaghlze · /en/insects/tick-on-dog`

Primary query

როგორ მოვაშოროთ ძაღლს ტკიპა · ტკიპა ძაღლზე

Secondary queries

ძაღლის ტკიპა, ტკიპები ძაღლებში, ტკიპა ძაღლებში, ტკიპების საყელო, ტკიპების წამალი, პიროპლაზმოზი ძაღლებში, ტკიპა სახლში, ტკიპები სახლში

Page type

Guide article

Why this page, why now

Dog owners make up a large share of tick searches: "როგორ მოვაშოროთ ძაღლს ტკიპა", "ტკიპები ძაღლებში" and "პიროპლაზმოზი ძაღლებში" all autocomplete. The tick-bite guide covers people only and never mentions dogs. Build it now so it has five months to age before April.

Traffic potential

High

Difficulty

Medium (vet clinics, pet shops, mshoblebi, mkurnali)

Seasonality

Measured (Trends, Georgia, 5-yr): Apr 71 · May 89 · Jun 91 · Jul 100 · Aug 65 · Sep 14

Recommended publish

**Nov 2026 (hard deadline 15 Feb 2027)**

Why reptiles.ge can rank

Vet pages are commercial. A neutral page covering removal steps, ticks living indoors (brown dog tick), prevention and when to see a vet fills the gap. Keep the educational framing: refer to a vet, don't write a treatment protocol.

Link to it from

Tick-bite guide (add a callout), fleas guide (pets), jackal in yard, ticks hub (#12), dog snake-bite (#22), mosquitoes guide

Cannibalization guard

Tick bite stays human-only, this page is dog-only, and tick seasons and diseases go to #12.

7

### Bee, wasp and hornet stings

Prepare for season

Page title

ფუტკრის, ბზიკის და კრაზანის ნაკბენი — რა ვქნათ და როდის არის საშიში

URL (proposed)

`/mtserebi/futkris-da-krazanis-nakbeni · /en/insects/bee-wasp-stings`

Primary query

ბზიკის ნაკბენი · კრაზანის ნაკბენი · ფუტკრის ნაკბენი

Secondary queries

ბზიკის ნაკბენის დროს, ფუტკარმა უკბინა, ფუტკრის ნაკბენის ალერგია, ფუტკრის ნაკბენის მკურნალობა, კრაზანას ნაკბენი, ბზიკის ნაკბენი ბავშვებში, ბზიკის ნაკბენი ძაღლი, კრაზანის ნაკბენი ძაღლზე

Page type

Safety guide (educational, 112)

Why this page, why now

Three insects with many autocomplete variants each make this the largest sting cluster in Georgian. The wasp-nest guide is about removing nests. Stings need their own answer-first page.

Traffic potential

High

Difficulty

Medium (news re-posts of NCDC advice: tabula, ajaratv, megatv; health sites: redmed, babyboo)

Seasonality

Measured: კრაზანა peaks Aug (Jun 22 · Jul 52 · Aug 100); ბზიკი peaks Aug

Recommended publish

**Nov–Dec 2026 (hard deadline 15 Apr 2027)**

Why reptiles.ge can rank

Competitors are short news re-posts. reptiles.ge can add identification (bee vs wasp vs hornet photos), which insects leave a stinger, multiple-sting risk, and dogs. Cite NCDC, use no MedicalWebPage schema, and keep the 112 call-to-action.

Link to it from

Wasp-nest guide (trim its sting section to a summary and link here), insects hub, dangerous-animals hub, bite identification (#11), scorpion sting

Cannibalization guard

The wasp-nest page covers removal; this page covers stings.

8

### Endemic animals of Georgia

Traffic now

Page title

საქართველოს ენდემური ცხოველები — ვინ ცხოვრობს მხოლოდ აქ და კავკასიაში

URL (proposed)

`/endemuri-tskhovelebi · /en/endemic-animals`

Primary query

ენდემური ცხოველები საქართველოში

Secondary queries

საქართველოს ენდემური ცხოველები, ენდემური სახეობები საქართველოში, საქართველოს ენდემური ფრინველები, კავკასიის ენდემები; EN endemic animals georgia

Page type

Cross-group hub (school and curiosity)

Why this page, why now

It autocompletes from three different seeds and is a school-year topic. The current results are national-park pages, an old kvirispalitra article and a slideshare deck.

Traffic potential

Medium–High

Difficulty

Low

Seasonality

School year (Sep–May)

Recommended publish

**Nov 2026**

Why reptiles.ge can rank

The atlas already holds many Caucasian endemics: 16 Darevskia, the Caucasian vipers (kaznakovi, dinniki, darevskii), Caucasian salamander, Caucasian parsley frog, Caucasian toad and East Caucasian tur. No Georgian page sorts them properly into Georgia-only vs Caucasus endemics.

Link to it from

Home, Darevskia guide, viper profiles, amphibians hub, tur profile, herpetofauna-checklist news, Caucasian-toad taxonomy news, regions

Cannibalization guard

Make only claims the Tarkhnishvili checklist or species-specific IUCN pages support (AGENTS.md integrity rule), and keep "Georgian endemic" separate from "Caucasian endemic".

9

### What bug is this in my house?

Traffic now

Page title

ეს რა მწერია სახლში? — სახლის მწერების ამოცნობა ფოტოებით

URL (proposed)

`/mtserebi/ra-mtseria-sakhlshi · /en/insects/house-bug-id`

Primary query

მწერები სახლში · პატარა მწერები სახლში

Secondary queries

ხოჭო სახლში, თეთრი ჭია სახლში, ქინქლა სახლში, ჭიამაია სახლში, ფაროსანა სახლში, ტკიპები სახლში

Page type

Identification hub (router)

Why this page, why now

The "სახლში …" autocomplete sweep surfaced a long tail (ხოჭო, თეთრი ჭია, ქინქლა, ჭიამაია, პატარა მწერები) that would make thin pages on its own. One photo-led ID page absorbs them and routes to the 10+ household guides.

Traffic potential

Medium

Difficulty

Low

Seasonality

Spring and autumn highs

Recommended publish

**Nov 2026**

Why reptiles.ge can rank

No Georgian page offers photo-based household-insect ID, and the site already has the destination guides and profiles.

Link to it from

Every household guide, insects hub, insect index, the bed-bug and spider pages (#1, #5)

Cannibalization guard

The insect index stays a species list; this page routes by problem. Each card is short and links out.

10

### Weevils and worms in beans, flour and grain

Traffic now

Page title

ჭია ლობიოში, ფქვილსა და ბურღულში — საიდან ჩნდება და როგორ მოვიშოროთ

URL (proposed)

`/mtserebi/chia-lobioshi · /en/insects/pantry-pests`

Primary query

ლობიოს ჭია · როგორ მოვაშოროთ ლობიოს ჭია

Secondary queries

ხმელი ლობიოს ჭია, როგორია ლობიოს ჭია, ფქვილის ჭია, ჭია ბრინჯში, ჩრჩილი სამზარეულოში, თეთრი ჭია სახლში

Page type

Guide article

Why this page, why now

This one is specific to Georgian households, where dried beans are stored for months. Autocomplete gives three bean-weevil variants plus "ფქვილის ჭია". The clothes-moth guide doesn't mention pantry pests at all.

Traffic potential

Medium

Difficulty

Low

Seasonality

Year-round; autumn storage and spring emergence

Recommended publish

**Nov 2026**

Why reptiles.ge can rank

The current answers are recipe-adjacent tips. A page with ID photos (bean weevil, flour beetle, pantry moth) and a freezer/heat/storage protocol has little competition.

Link to it from

Clothes-moth guide (add "the kitchen moth is a different insect" plus a link), ants guide, cockroach guide, house-bug ID (#9)

Cannibalization guard

The clothes-moth guide keeps textile moths.

## Next 20

The order continues. Two entries (#13 and #24) are species-profile batches that run in parallel through the existing species workflow. Each is one roadmap line so the list isn't padded with near-identical pages.

11

### Insect bite identification

Prepare for season

Page title

რამ მიკბინა? მწერების ნაკბენების ამოცნობა ფოტოებით

URL (proposed)

`/mtserebi/mtseris-nakbeni · /en/insects/bite-identification`

Primary query

მწერის ნაკბენი

Secondary queries

მწერის ნაკბენის ფოტოები, როგორ გამოიყურება ბაღლინჯოს ნაკბენი, ობობის ნაკბენი ფოტო, ტკიპას ნაკბენი ფოტო, კოღოს ნაკბენის შეშუპება, მწერის ნაკბენი ბავშვებში, ნაკბენის ალერგია

Page type

Identification hub (router)

Why this page, why now

Every bite guide (tick, spider, scorpion, snake, and soon bed bug and stings) needs a top-of-funnel page. GSC already shows photo intent: "ობობის ნაკბენი ფოტო" and "როგორია ობობის ნაკბენი" both appear.

Traffic potential

Medium–High

Difficulty

Medium (pharmacy and health sites rank for the product variants; licensing the photos is the real cost)

Seasonality

May–Sep high; bed-bug bites year-round

Recommended publish

**Dec 2026 (deadline Mar 2027)**

Why reptiles.ge can rank

No Georgian page compares bites side by side, and the site owns most of the destination pages.

Link to it from

All bite guides, mosquitoes, fleas, bed bugs (#1), stings (#7), dangerous-animals hub

Cannibalization guard

Short cards per bite type that link out; this page should not fully answer each bite.

12

### Ticks in Georgia

Prepare for season

Page title

ტკიპები საქართველოში — სახეობები, სეზონი, ყირიმ-კონგო და ლაიმი

URL (proposed)

`/mtserebi/tkipebi · /en/insects/ticks-in-georgia`

Primary query

ტკიპები საქართველოში

Secondary queries

ტკიპების სახეობები, ტკიპას სახეობები, ტკიპის სეზონი, ყირიმ-კონგოს ცხელება ტკიპა, ტკიპას ანალიზი, ლაიმის დაავადება; RU клещи в грузии, энцефалитные клещи в грузии, опасны ли клещи в грузии; EN ticks in georgia country

Page type

Topic hub

Why this page, why now

Russian and English visitors ask whether ticks in Georgia are dangerous, and neither the bite guide nor any profile answers that. Crimean-Congo fever ("ყირიმ-კონგოს ცხელება / ვირუსი") makes the news every June–July; published Georgian cases cluster June–September and are linked to Hyalomma ticks.

Traffic potential

Medium–High

Difficulty

Medium–High (NCDC and news own the disease terms, so keep it educational)

Seasonality

Apr–Aug; CCHF news Jun–Jul

Recommended publish

**Dec 2026 (deadline 1 Mar 2027)**

Why reptiles.ge can rank

An atlas can cover species, season and geography together, which nobody else does. It pairs with the tick-species profiles (#20).

Link to it from

Tick bite, tick on dog (#6), bite ID (#11), dangerous-animals hub, region pages (only where a source names the region)

Cannibalization guard

No first-aid content here; link to the tick-bite page. CCHF gets a section, not its own page.

13

### Mammal profile batch (parallel track)

Traffic now

Page title

კვერნა · კურდღელი · ტყის კატა · არჩვი · ზოლიანი აფთარი · დასავლეთკავკასიური ჯიხვი · თხუნელა

URL (proposed)

`/dzuzumtsovrebi/{slug} via the existing species workflow`

Primary query

კვერნა საქართველოში · კურდღელი ინფორმაცია · ტყის კატა საქართველოში · არჩვი ინფორმაცია

Secondary queries

კვერნას ხმა, კურდღელი ზამთარში, კავკასიური ტყის კატა, არჩვი ბინადრობს, აფთარი ცხოველი, ჯიხვი საქართველოში, თხუნელა ინფორმაცია

Page type

Species profiles

Why this page, why now

GSC shows that mammal profiles drive the site's search impressions right now. In four weeks: წავი 1,194 · მაჩვი 529 · დედოფალა 439 · ენოტი 395 · შველი 350 · ფოცხვერი 265. These seven missing species autocomplete with the same "X ინფორმაცია / X საქართველოში" pattern.

Traffic potential

Medium–High (combined)

Difficulty

Low

Seasonality

School year; evergreen

Recommended publish

**Start Oct 2026 at 1–2 per week; marten first (it feeds #16)**

Why reptiles.ge can rank

Same template, sourcing and photo pipeline as the existing mammal profiles, several of which already rank on page one.

Link to it from

Mammals hub and index, lookalikes (deer vs roe deer, marten vs weasel), region pages where sourced

Cannibalization guard

Striped hyena status in Georgia must be sourced (rare records only). Skip any species without a Georgian record in a trusted source.

14

### Birds of prey of Georgia

Traffic now

Page title

საქართველოს მტაცებელი ფრინველები — არწივები, ძერები, შევარდნები, ორბები

URL (proposed)

`/prinvelebi/mtatsebeli-prinvelebi · /en/birds/birds-of-prey`

Primary query

მტაცებელი ფრინველები საქართველოში

Secondary queries

მტაცებელი ფრინველების სია, საქართველოს მტაცებელი ფრინველები, მტაცებელი ფრინველები წარმომადგენელი სახეობები, ბათუმის მიგრაცია

Page type

Cluster guide (collection)

Why this page, why now

The atlas already has 11 diurnal raptor profiles (plus 6 owls) and the Batumi raptor-count news story ("batumi raptor count 2026" already gets impressions). Autocomplete shows school-list demand (სია, წარმომადგენელი სახეობები).

Traffic potential

Medium

Difficulty

Low

Seasonality

School year; Batumi migration Sep–Oct

Recommended publish

**Dec 2026**

Why reptiles.ge can rank

It's a collection page built on profiles that already exist, and no Georgian competitor has a list with photos and IDs.

Link to it from

Birds hub, raptor profiles, Batumi raptors news, migratory birds (#19)

Cannibalization guard

The birds index stays the full list; this page groups one guild.

15

### Extinct animals of Georgia

Traffic now

Page title

საქართველოში გადაშენებული ცხოველები — ვინ გაქრა და ვინ ბრუნდება

URL (proposed)

`/gadashenebuli-tskhovelebi · /en/extinct-animals`

Primary query

გადაშენებული ცხოველები საქართველოში

Secondary queries

გადაშენებული ცხოველები და ფრინველები საქართველოში, კასპიური ვეფხვი საქართველოში, ლეოპარდი საქართველოში; RU редкие животные грузии

Page type

Cross-group hub (school)

Why this page, why now

Autocomplete gives three variants, and the results page is one kvirispalitra article. It pairs naturally with the leopard profile and the bezoar-goat restoration news ("who is coming back").

Traffic potential

Medium

Difficulty

Low

Seasonality

School year

Recommended publish

**Dec 2026**

Why reptiles.ge can rank

Low competition, plus an atlas's authority to separate extinct, regionally extinct and reintroduced species.

Link to it from

Mammals hub, leopard profile, bezoar-goat news, endemic hub (#8), dangerous-animals hub

Cannibalization guard

Source every disappearance date; don't drift into Red List statuses, which the owner's rules keep on profiles.

16

### Marten in the house or attic

Traffic now

Page title

კვერნა სახლში და სხვენში — როგორ გავიგოთ, როგორ მოვიშოროთ, როგორ დავიცვათ ქათმები

URL (proposed)

`/dzuzumtsovrebi/kverna-sakhlshi · /en/mammals/marten-in-house`

Primary query

კვერნა სახლში

Secondary queries

კვერნა საქართველოში, კვერნას ხმა, კვერნა სხვენში, კვერნა ქათმებს, კვერნა თუ დედოფალა

Page type

Guide article (+ marten profile from #13)

Why this page, why now

"კვერნა სახლში" is the first autocomplete for "კვერნა". Martens den in roofs through autumn and winter and raid henhouses. The weasel profile (დედოფალა, 439 impressions) shows the same audience is already arriving.

Traffic potential

Medium–Low

Difficulty

Low

Seasonality

Oct–Mar denning; spring kits

Recommended publish

**Dec 2026**

Why reptiles.ge can rank

It's almost uncontested in Georgian, and it reuses the bat-in-house and mouse guide structure.

Link to it from

Marten profile, weasel profile, mouse and rats guides, jackal in yard, bat in house (attics)

Cannibalization guard

The profile covers biology; the guide covers conflict.

17

### Black snake in Georgia

Prepare for season

Page title

შავი გველი საქართველოში — რომელი სახეობაა და შხამიანია თუ არა

URL (proposed)

`/gvelebi/shavi-gveli · /en/snakes/black-snake`

Primary query

შავი გველი საქართველოში

Secondary queries

შავი ფერის გველი, შავი პატარა გველი, შავი წვრილი გველი, შავი გველგესლა, წითელი გველი საქართველოში (as an H2)

Page type

Identification page

Why this page, why now

GSC already shows "შავი გველი საქართველოში" (26 impressions) and "წითელი გველი საქართველოში" (14) with no matching page. A black snake can be a melanistic viper (Vipera kaznakovi), a dark grass snake, or a slow worm ("შავი წვრილი გველი"), so this is a real safety question.

Traffic potential

Medium

Difficulty

Low (dream-interpretation sites own "შავი გველი" alone, but "+ საქართველოში" is clean)

Seasonality

Apr–Jun (Trends: გველი peaks in May)

Recommended publish

**Jan 2027 (deadline 1 Mar)**

Why reptiles.ge can rank

Only an atlas with field photos of every Georgian species can answer this properly.

Link to it from

Snakes hub, venomous-snake identification, snake quiz, kaznakovi profile, grass-snake profile, the lizard/glass-lizard comparison, slow-worm profile

Cannibalization guard

The identification page keeps "შხამიანი თუ უშხამო"; this page owns colour queries. Say plainly that colour alone doesn't identify a snake, then route the reader.

18

### Pigeons on the balcony

Prepare for season

Page title

მტრედები აივანზე — როგორ დავაფრთხოთ ჰუმანურად

URL (proposed)

`/prinvelebi/mtredebi-aivanze · /en/birds/pigeons-on-balcony`

Primary query

მტრედები აივანზე

Secondary queries

როგორ მოვიშოროთ მტრედები, მტრედების საწინააღმდეგო ბადე, მტრედების ბუდე, მტრედების დაფრთხობა

Page type

Guide article

Why this page, why now

It's an apartment problem in Tbilisi and Batumi and shows up in autocomplete. The competing pages (rogor.ge, mshoblebi) are listicles translated from foreign tips.

Traffic potential

Medium

Difficulty

Low

Seasonality

Mar–Jun nesting; year-round

Recommended publish

**Jan 2027**

Why reptiles.ge can rank

An evidence-based deterrent page (what works, what's cruel or illegal) from a wildlife source.

Link to it from

Birds hub, ქედანი profile, feral-pigeon profile (#24), bird in house (#23)

Cannibalization guard

Nothing overlaps.

19

### Migratory birds of Georgia

Prepare for season

Page title

გადამფრენი ფრინველები საქართველოში — ვინ, როდის და სად

URL (proposed)

`/prinvelebi/gadamprleni-prinvelebi · /en/birds/migration`

Primary query

გადამფრენი ფრინველები საქართველოში

Secondary queries

გადამფრენი ფრინველები, საქართველოს გადამფრენი ფრინველები, შავი ზღვის გადამფრენი ფრინველები, ბათუმის ფრინველთა მიგრაცია

Page type

Cluster guide (school and birding)

Why this page, why now

It's a heavy autocomplete school topic. Batumi is a world-class migration bottleneck, and the atlas has the migrants: stork, swift, turtle dove, cuckoo, hoopoe, honey buzzard, black kite.

Traffic potential

Medium

Difficulty

Low

Seasonality

Mar–Apr and Sep–Oct

Recommended publish

**Jan 2027 (it ranks by spring, then catches the autumn school topic)**

Why reptiles.ge can rank

Its profiles and news are already about migration.

Link to it from

Batumi news, raptors (#14), stork, swift and honey-buzzard profiles, Adjara region page

Cannibalization guard

Raptors keeps the guild; this page covers the phenomenon and the calendar.

20

### Tick and household-pest species profiles

Prepare for season

Page title

Hyalomma marginatum · Ixodes ricinus · Rhipicephalus sanguineus · გერმანული ტარაკანი · კრაზანა (Vespa crabro)

URL (proposed)

`/mtserebi/{slug} via the species workflow`

Primary query

ტკიპების სახეობები · ტარაკანის სახეობები · გერმანული ტარაკანი

Secondary queries

წითელი ტარაკანი, შავი ტარაკანი (already a profile), კრაზანის სახეობები, ტკიპას სახეობები

Page type

Species profiles

Why this page, why now

Autocomplete shows "ტკიპების / ტკიპას სახეობები" and a cockroach-types list (გერმანული, წითელი, შავი, ამერიკული). The German cockroach is the usual apartment species, but the atlas only has the oriental (black) cockroach.

Traffic potential

Low–Medium

Difficulty

Low

Seasonality

Ticks: before April; others evergreen

Recommended publish

**Jan 2027**

Why reptiles.ge can rank

They give the ticks hub, the cockroach guide and the stings page species-level depth that competitors lack.

Link to it from

Ticks hub (#12), tick on dog (#6), cockroach guide, wasp nest, stings (#7)

Cannibalization guard

Each needs a Georgian record source before it is published.

21

### Hedgehog in the garden

Prepare for season

Page title

ზღარბი ეზოში — რას ჭამს, როგორ დავეხმაროთ, შეიძლება თუ არა სახლში

URL (proposed)

`/dzuzumtsovrebi/zgharbi-ezoshi · /en/mammals/hedgehog-in-garden`

Primary query

ზღარბი ეზოში · ზღარბი რას ჭამს

Secondary queries

ზღარბი სახლში, ზღარბის საჭმელი, ზღარბის საკვები, ზღარბის მოვლა, ზღარბი ზამთარში

Page type

Guide article

Why this page, why now

Autocomplete breaks into care questions the profile can't fully serve: feeding a hedgehog you found, the milk myth, keeping one at home. Trends for "ზღარბი" is distorted by Sonic the Hedgehog releases, so the size here is an estimate.

Traffic potential

Medium

Difficulty

Low

Seasonality

Apr–Oct activity

Recommended publish

**Feb 2027**

Why reptiles.ge can rank

It follows the same encounter-guide format as bat in house and jackal in yard.

Link to it from

ევროპული ზღარბი profile, mammals hub, snakes-in-yard guide

Cannibalization guard

The profile keeps biology and natural diet; the guide owns "I found one / what do I feed it".

22

### Dog bitten by a snake

Prepare for season

Page title

გველმა ძაღლს უკბინა — რა ვქნათ გზაში ვეტერინარამდე

URL (proposed)

`/gvelebi/gvelma-dzaghls-ukbina · /en/snakes/dog-snake-bite`

Primary query

გველის ნაკბენი ძაღლზე

Secondary queries

გველმა ძაღლს უკბინა, გველგესლამ ძაღლს უკბინა, ძაღლი და გველი

Page type

Safety guide

Why this page, why now

"გველის ნაკბენი ძაღლზე" appears in the snake-bite autocomplete, and the snake-bite guide never mentions dogs. Village dogs meet vipers every summer.

Traffic potential

Low–Medium

Difficulty

Low

Seasonality

May–Aug

Recommended publish

**Feb 2027**

Why reptiles.ge can rank

Nobody covers it in Georgian.

Link to it from

Snake bite, giurza bite, tick on dog (#6), snakes in yard

Cannibalization guard

The human bite page stays human-only.

23

### A bird flew into the house

Prepare for season

Page title

ჩიტი სახლში შემოფრინდა — როგორ გავუშვათ უსაფრთხოდ

URL (proposed)

`/prinvelebi/chiti-sakhlshi · /en/birds/bird-in-house`

Primary query

სახლში ჩიტი შემოფრინდა · ჩიტი სახლში

Secondary queries

ჩიტი სახლში რას ნიშნავს, მერცხალი სახლში, ბეღურა სახლში

Page type

Guide article

Why this page, why now

Both phrasings autocomplete. Part of the demand is superstition, so a calm practical page (the mirror of the bat-in-house guide) can answer the practical question and address the belief briefly without endorsing it.

Traffic potential

Medium–Low

Difficulty

Low

Seasonality

Apr–Sep (open windows)

Recommended publish

**Feb 2027**

Why reptiles.ge can rank

Superstition sites own the omen query, but nobody owns the practical one.

Link to it from

Bat in house, pigeons (#18), birds hub, swallow and sparrow profiles (#24)

Cannibalization guard

Nothing overlaps.

24

### Common-bird profile batch (parallel track)

Prepare for season

Page title

მერცხალი · ბეღურა · გარეული მტრედი · შოშია · რუხი ყვავი · ჭილყვავი · რუხი წერო · კავკასიური შურთხი · კავკასიური როჭო

URL (proposed)

`/prinvelebi/{slug} via the species workflow`

Primary query

მერცხალი ინფორმაცია · ბეღურა ინფორმაცია · კავკასიური შურთხი

Secondary queries

მერცხალი სახლში, ბეღურა ზამთარში, შოშია ფრინველი, ჭილყვავი ფრინველი, კავკასიური შავი როჭო

Page type

Species profiles

Why this page, why now

These show the same school-info pattern that already brings impressions to ხოხობი (280), ყარყატი (265), სვავი (300) and ჭოტი (66). The atlas has many rare birds but is missing the common ones children are asked about.

Traffic potential

Medium (combined)

Difficulty

Low

Seasonality

Evergreen; swallows from late March

Recommended publish

**Feb–Mar 2027**

Why reptiles.ge can rank

The bird pipeline shipped several profiles on 1 October alone.

Link to it from

Birds hub and index, migratory birds (#19), fledgling (#25), bird in house (#23), pigeons (#18)

Cannibalization guard

One profile per species, as usual.

25

### Found a baby bird

Prepare for season

Page title

ჩიტის ბარტყი ვიპოვე — რა ვქნა, რა ვაჭამო და როდის არ უნდა ავიყვანო

URL (proposed)

`/prinvelebi/bartyi-vipove · /en/birds/found-baby-bird`

Primary query

ჩიტის ბარტყი · ბარტყის კვება

Secondary queries

ბარტყის საჭმელი, ბარტყის საკვები, მერცხლის ბარტყი, ბეღურას ბარტყი, შაშვის ბარტყი, ბუს ბარტყი

Page type

Guide article

Why this page, why now

The "ბარტყი" autocomplete lists feeding queries by species. Wrong advice (bread, milk, water by syringe) kills fledglings, so a correct page is genuinely useful. Part of the demand is about pet parrots, so target wild birds explicitly.

Traffic potential

Medium

Difficulty

Low

Seasonality

May–Jul

Recommended publish

**Mar 2027**

Why reptiles.ge can rank

There's no competent Georgian page, and the atlas has the species.

Link to it from

Birds hub, blackbird, owl and swallow profiles, pigeons (#18), bird in house (#23)

Cannibalization guard

Nothing overlaps.

26

### Flies and gnats in the house

Prepare for season

Page title

ბუზები და ქინქლები სახლში — როგორ მოვიშოროთ

URL (proposed)

`/mtserebi/buzebi-sakhlshi · /en/insects/flies-in-house`

Primary query

როგორ მოვიშოროთ ბუზები

Secondary queries

როგორ მოვაშოროთ ბუზები, ბუზების საწინააღმდეგო სახლის პირობებში, ბევრი ბუზი სახლში, ბუზების ხაფანგი, ქინქლები სახლში

Page type

Guide article

Why this page, why now

Both "მოვიშოროთ" and "მოვაშოროთ ბუზები" autocomplete, and so does "ქინქლები სახლში". No fly page exists. Folding gnats into the same page avoids a thin second page.

Traffic potential

Medium

Difficulty

Medium (product listings, paparazzi.ge listicles)

Seasonality

Jun–Sep

Recommended publish

**Mar 2027**

Why reptiles.ge can rank

A source-based alternative to product pages, in the same format as the mosquito guide.

Link to it from

Mosquitoes guide, cockroach guide, house-bug ID (#9), pantry pests (#10)

Cannibalization guard

Nothing overlaps.

27

### Woodworm in furniture and floors

Prepare for season

Page title

ხის ჭია ავეჯში და იატაკში — როგორ ვიცნოთ და რა ვქნათ

URL (proposed)

`/mtserebi/khis-chia · /en/insects/woodworm`

Primary query

ხის ჭია

Secondary queries

ხის ჭია წამალი, ხის ავეჯის ჭია, ხის იატაკის ჭია, როგორია ხის ჭია, ხის ჭია ხმა, როგორ მოვაშოროთ ხეს ჭია

Page type

Guide article

Why this page, why now

Autocomplete has six practical variants. Wooden floors and furniture are common in older Georgian homes.

Traffic potential

Low–Medium

Difficulty

Low

Seasonality

May–Jul beetle emergence (exit holes, ticking sounds)

Recommended publish

**Mar 2027**

Why reptiles.ge can rank

There's no non-commercial Georgian page.

Link to it from

House-bug ID (#9), pantry pests (#10)

Cannibalization guard

Nothing overlaps.

28

### Jellyfish in the Black Sea (Batumi)

Prepare for season

Page title

მედუზები შავ ზღვაში — საშიშია? როდის ჩნდება და რა ვქნათ დაწვისას

URL (proposed)

`/meduzebi-shav-zghvashi · /ru/jellyfish-black-sea (write the RU version first)`

Primary query

медузы в батуми (RU) · მედუზა ზღვაში (KA)

Secondary queries

медузы в батуми опасны или нет, когда медузы в батуми, жалят ли медузы в батуми, медузы в грузии, медузы в черном море батуми, медузы в батуми в августе

Page type

Guide article (Russian-led, 4 locales)

Why this page, why now

Russian-language Trends in Georgia: медузы Jul 92 · Aug 100 · Sep 67, with a 5-year average twice that of "клещ". The current answers are travelask Q&A threads, kp.ru and batuminews. The site's Russian locale is already live.

Traffic potential

Medium–High (RU)

Difficulty

Medium

Seasonality

Measured: Jul–Aug

Recommended publish

**Apr 2027 (deadline 15 May)**

Why reptiles.ge can rank

Species-level, sourced answers (Aurelia, Rhizostoma, harmless comb jellies) beat forum threads.

Link to it from

Dangerous-animals hub, dolphin-strandings news, leatherback news, Adjara region, Black Sea page (#30)

Cannibalization guard

This is new marine territory for the site. Stay strictly with sourced species.

29

### Wild animal sounds of Georgia

Prepare for season

Page title

გარეული ცხოველების ხმები — ვინ ყვირის ღამით ეზოსთან?

URL (proposed)

`/tskhovelebis-khmebi · /en/animal-sounds`

Primary query

გარეული ცხოველების ხმები

Secondary queries

ტურა ხმა, კვერნას ხმა, ფოცხვერის ხმა, შველის ხმა, დათვის ხმა, გარეული ღორის ხმა, ბეღურას ხმა, ღამურას ხმა, ბაყაყის ხმა, ბულბულის გალობა

Page type

Identification page (audio)

Why this page, why now

"X ხმა" autocompletes for more than ten species, which is unusually consistent evidence. The site already ships seven recordings (owls, lynx, nightingale, turtle dove, gull).

Traffic potential

Medium–Low

Difficulty

Medium (YouTube owns many sound queries)

Seasonality

Apr–Jun nights (frogs, nightingales, jackals); evergreen

Recommended publish

**Apr 2027**

Why reptiles.ge can rank

Few sites can offer sourced audio for wild animals in Georgia, so the page stands out.

Link to it from

Jackal in yard, marten (#16), owl, lynx and nightingale profiles

Cannibalization guard

Profiles keep their own audio, and this page links to them. Licence every recording (xeno-canto CC, etc.).

30

### Dangerous creatures of the Black Sea

Prepare for season

Page title

შავი ზღვის საშიში ბინადრები — ზღვის დრაკონი, ზღვის კატა და მედუზები

URL (proposed)

`/shavi-zghvis-sashishi-binadrebi · /ru/black-sea-dangers`

Primary query

опасные животные черного моря (RU) · შავი ზღვის დრაკონი

Secondary queries

морской дракончик черное море, морской дракончик укус, черное море опасные обитатели, черное море опасные рыбы, ზღვის დრაკონი თევზი

Page type

Safety guide (Russian-led)

Why this page, why now

Russian autocomplete has a clear cluster (weever fish stings, "dangerous inhabitants"), and Georgian has "შავი ზღვის დრაკონი". It goes after the jellyfish page, which carries more demand.

Traffic potential

Low–Medium

Difficulty

Medium

Seasonality

Jul–Aug

Recommended publish

**May 2027**

Why reptiles.ge can rank

It's a sourced species list with first-aid basics and a 112 call-to-action, and it links to the jellyfish page.

Link to it from

Jellyfish (#28), dangerous-animals hub, Adjara region

Cannibalization guard

Jellyfish detail stays on #28.

## Scorecard

Demand, current relevance, future seasonal potential, topical fit and traffic potential use the same scale. Difficulty uses its own amber scale, where darker means harder.

| #   | Page                                                | Demand   | Now      | Future season | Difficulty | Fit       | Traffic  | Urgency   | Format        |
| --- | --------------------------------------------------- | -------- | -------- | ------------- | ---------- | --------- | -------- | --------- | ------------- |
| 1   | [Bed bugs at home](#p1)                             | High     | High     | High          | Low–Med    | High      | High     | Now       | Guide         |
| 2   | [Dangerous and venomous animals of Georgia](#p2)    | High     | Med      | High          | Med        | High      | High     | Now       | Hub           |
| 3   | [Rats in the house and yard](#p3)                   | Med–High | High     | Med           | Low–Med    | Med–High  | Med–High | Now       | Guide         |
| 4   | [Reptiles of Georgia](#p4)                          | Med–High | High     | Med           | Low        | Very High | Med–High | Now       | Hub           |
| 5   | [Spiders in the house](#p5)                         | Med      | High     | Med           | Low        | High      | Med      | Now       | Guide         |
| 6   | [Tick on a dog](#p6)                                | High     | Low      | Very High     | Med        | Med–High  | High     | Build now | Guide         |
| 7   | [Bee, wasp and hornet stings](#p7)                  | High     | Low      | Very High     | Med        | Med       | High     | Build now | Safety guide  |
| 8   | [Endemic animals of Georgia](#p8)                   | Med–High | High     | Med           | Low        | High      | Med      | Now       | Hub           |
| 9   | [What bug is this in my house?](#p9)                | Med      | Med      | Med           | Low        | High      | Med      | Now       | ID hub        |
| 10  | [Weevils and worms in beans, flour and grain](#p10) | Med      | Med      | Med           | Low        | Med       | Med      | Now       | Guide         |
| 11  | [Insect bite identification](#p11)                  | Med–High | Low–Med  | High          | Med        | Med–High  | Med–High | Dec       | ID hub        |
| 12  | [Ticks in Georgia](#p12)                            | Med–High | Low      | High          | Med–High   | High      | Med–High | Dec       | Hub           |
| 13  | [Mammal profile batch (parallel track)](#p13)       | Med–High | High     | Med           | Low        | Very High | Med–High | Parallel  | Profiles      |
| 14  | [Birds of prey of Georgia](#p14)                    | Med      | Med–High | Med           | Low        | High      | Med      | Dec       | Collection    |
| 15  | [Extinct animals of Georgia](#p15)                  | Med      | Med      | Med           | Low        | Med–High  | Med      | Dec       | Hub           |
| 16  | [Marten in the house or attic](#p16)                | Med–Low  | Med      | Med           | Low        | High      | Med–Low  | Dec       | Guide         |
| 17  | [Black snake in Georgia](#p17)                      | Med      | Low      | High          | Low        | Very High | Med      | Jan       | ID page       |
| 18  | [Pigeons on the balcony](#p18)                      | Med      | Low–Med  | Med–High      | Low        | Med       | Med      | Jan       | Guide         |
| 19  | [Migratory birds of Georgia](#p19)                  | Med      | Low      | Med           | Low        | High      | Med      | Jan       | Cluster guide |
| 20  | [Tick and household-pest species profiles](#p20)    | Low–Med  | Low      | Med           | Low        | High      | Low–Med  | Jan       | Profiles      |
| 21  | [Hedgehog in the garden](#p21)                      | Med      | Low      | Med           | Low        | High      | Med      | Feb       | Guide         |
| 22  | [Dog bitten by a snake](#p22)                       | Low–Med  | Low      | Med           | Low        | High      | Low–Med  | Feb       | Safety guide  |
| 23  | [A bird flew into the house](#p23)                  | Med–Low  | Low      | Med           | Low        | Med       | Low–Med  | Feb       | Guide         |
| 24  | [Common-bird profile batch (parallel track)](#p24)  | Med      | Med      | Med           | Low        | High      | Med      | Feb–Mar   | Profiles      |
| 25  | [Found a baby bird](#p25)                           | Med      | Low      | High          | Low        | High      | Med      | Mar       | Guide         |
| 26  | [Flies and gnats in the house](#p26)                | Med      | Low      | High          | Med        | Med       | Med      | Mar       | Guide         |
| 27  | [Woodworm in furniture and floors](#p27)            | Low–Med  | Low      | Med           | Low        | Med       | Low–Med  | Mar       | Guide         |
| 28  | [Jellyfish in the Black Sea (Batumi)](#p28)         | Med–High | Low      | Very High     | Med        | Low–Med   | Med–High | Apr       | Guide         |
| 29  | [Wild animal sounds of Georgia](#p29)               | Med–Low  | Low      | Med           | Med        | High      | Low–Med  | Apr       | ID page       |
| 30  | [Dangerous creatures of the Black Sea](#p30)        | Low–Med  | Low      | High          | Med        | Low–Med   | Low–Med  | May       | Safety guide  |

## Traffic now vs. prepare for season

### A. Publish now for current or year-round demand

October–November demand (rodents and spiders moving indoors, the school term, Batumi migration) plus problems that never stop.

- [1 Bed bugs at home](#p1)Oct 2026, weeks 1–2
- [2 Dangerous and venomous animals of Georgia](#p2)Oct 2026
- [3 Rats in the house and yard](#p3)Oct 2026
- [4 Reptiles of Georgia](#p4)Oct 2026
- [5 Spiders in the house](#p5)Oct 2026
- [8 Endemic animals of Georgia](#p8)Nov 2026
- [9 What bug is this in my house?](#p9)Nov 2026
- [10 Weevils and worms in beans, flour and grain](#p10)Nov 2026
- [13 Mammal profile batch (parallel track)](#p13)Start Oct 2026 at 1–2 per week; marten first (it feeds #16)
- [14 Birds of prey of Georgia](#p14)Dec 2026
- [15 Extinct animals of Georgia](#p15)Dec 2026
- [16 Marten in the house or attic](#p16)Dec 2026

### B. Prepare early for the season

On a young domain, a page needs roughly three to five months to be crawled, linked and trusted. Each window below gets it there before the peak.

| #          | Page                                       | Expected peak                     | Publish window                 | Why then                                                                                                              |
| ---------- | ------------------------------------------ | --------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [6](#p6)   | Tick on a dog                              | Apr–Jul (Trends Jul = 100)        | **Nov 2026 – Jan 2027**        | A new domain needs months of crawl and links. Published in November, it has \~5 months to age before the April surge. |
| [7](#p7)   | Bee, wasp and hornet stings                | Jul–Aug (Trends Aug = 100)        | **Nov 2026 – Feb 2027**        | Sting searches spike suddenly. Pages first indexed in June rarely reach page one before August.                       |
| [11](#p11) | Insect bite identification                 | May–Sep                           | **Dec 2026 – Feb 2027**        | It routes to the summer bite pages, so it has to be indexed and linked before they peak.                              |
| [12](#p12) | Ticks in Georgia                           | Apr–Aug; CCHF news Jun–Jul        | **Dec 2026 – Feb 2027**        | It has to rank before the first CCHF headlines. Refresh it with NCDC's season data each June.                         |
| [17](#p17) | Black snake in Georgia                     | Apr–Jun (snake searches peak May) | **Jan – Feb 2027**             | Snake searches climb from April; a February page is crawled and linked from the snake hub by then.                    |
| [18](#p18) | Pigeons on the balcony                     | Mar–Jun nesting                   | **Jan – Feb 2027**             | Pigeons start nesting in early spring, and that's when complaints start.                                              |
| [19](#p19) | Migratory birds of Georgia                 | Mar–Apr and Sep–Oct               | **Jan 2027**                   | It catches spring migration, then is mature for the autumn school topic.                                              |
| [20](#p20) | Tick and household-pest species profiles   | Before April (ticks)              | **Jan 2027**                   | Gives the ticks hub species depth in time for April.                                                                  |
| [21](#p21) | Hedgehog in the garden                     | Apr–Oct                           | **Feb 2027**                   | Hedgehogs leave hibernation in March–April.                                                                           |
| [22](#p22) | Dog bitten by a snake                      | May–Aug                           | **Feb 2027**                   | Joins the snake cluster before the season.                                                                            |
| [23](#p23) | A bird flew into the house                 | Apr–Sep                           | **Feb 2027**                   | Windows open in spring.                                                                                               |
| [24](#p24) | Common-bird profile batch (parallel track) | Swallows arrive late Mar          | **Feb – Mar 2027**             | Profiles should exist before the birds return.                                                                        |
| [25](#p25) | Found a baby bird                          | May–Jul                           | **Mar 2027**                   | Fledglings leave nests from May.                                                                                      |
| [26](#p26) | Flies and gnats in the house               | Jun–Sep                           | **Mar 2027**                   | Product pages dominate in summer, so an earlier start gives the page a chance.                                        |
| [27](#p27) | Woodworm in furniture and floors           | May–Jul emergence                 | **Mar 2027**                   | Exit holes and ticking appear in late spring.                                                                         |
| [28](#p28) | Jellyfish in the Black Sea (Batumi)        | Jul–Aug (RU Trends Aug = 100)     | **Apr 2027 (deadline 15 May)** | Tourists research in June; Russian SERPs move slowly.                                                                 |
| [29](#p29) | Wild animal sounds of Georgia              | Apr–Jun nights                    | **Apr 2027**                   | Frog, nightingale and jackal noise peaks in spring.                                                                   |
| [30](#p30) | Dangerous creatures of the Black Sea       | Jul–Aug                           | **May 2027**                   | Follows the jellyfish page and shares its links.                                                                      |

## Topic clusters

Every new page joins a cluster that already has live pages, marked "live". Links run both ways: hub to child, child to hub, and sideways between siblings.

### Household pests

Hub: [What bug is this in my house?](#p9) + /mtserebi

- [Bed bugs](#p1) · bed-bug profilelive
- [Pantry pests](#p10) · [Flies and gnats](#p26) · [Woodworm](#p27)
- Cockroaches, ants, fleas, clothes moths, stink bugslive
- [Spiders in the house](#p5) · [German cockroach profile](#p20)

### Bites and stings

Hub: [Insect bite identification](#p11), under [Dangerous animals](#p2)

- Tick, spider, scorpion, snake and giurza biteslive
- [Bee, wasp and hornet stings](#p7)
- Mosquitoes, fleaslive · [Bed-bug bites](#p1)

### Ticks

Hub: [Ticks in Georgia](#p12)

- Tick bite (people)live
- [Tick on a dog](#p6)
- [Hyalomma / Ixodes / Rhipicephalus profiles](#p20)

### Snakes (spring)

Hub: /gvelebilive

- [Black snake](#p17) · [Dog bitten by a snake](#p22)
- Identification, yard (plus a house section), bite, giurza bite, venomous, quizlive

### Animals at home and in the yard

Hub: /dzuzumtsovrebilive

- Mouse, bat, jackal, bearlive
- [Rats](#p3) · [Marten](#p16) · [Hedgehog](#p21) · [Animal sounds](#p29)
- [Mammal profile batch](#p13)

### Birds around people

Hub: /prinvelebilive

- [Pigeons on the balcony](#p18) · [Bird in the house](#p23) · [Found a baby bird](#p25)
- [Common-bird profile batch](#p24)

### School and curiosity

Hubs: [Reptiles of Georgia](#p4) · [Dangerous animals](#p2)

- [Endemic](#p8) · [Extinct](#p15)
- [Birds of prey](#p14) · [Migratory birds](#p19)
- Herpetofauna checklist, Batumi raptorslive news

### Black Sea (summer, Russian-led)

Hub: [Jellyfish](#p28)

- [Dangerous creatures of the Black Sea](#p30)
- Dolphin strandings, leatherback turtlelive news

## Measured seasonality

Google Trends for Georgia, 5-year average by calendar month, scaled so each row's highest month = 100. Only these terms had enough volume to measure. Other timing in this roadmap is estimated from the life cycle of the animal involved, and is labelled that way where it's used.

| Term                                      | Oct | Nov | Dec | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep |
| ----------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ტკიპაtick · KA                            | 14  | 12  | 4   | 4   | 0   | 3   | 71  | 89  | 91  | 100 | 65  | 14  |
| клещtick · RU, sparse                     | 0   | 0   | 0   | 0   | 0   | 11  | 0   | 75  | 100 | 56  | 0   | 8   |
| კრაზანაhornet · KA, sparse                | 11  | 0   | 7   | 0   | 21  | 9   | 0   | 4   | 22  | 52  | 100 | 11  |
| медузыjellyfish · RU                      | 10  | 0   | 0   | 0   | 0   | 9   | 0   | 11  | 15  | 92  | 100 | 67  |
| змеяsnake · RU                            | 41  | 48  | 46  | 41  | 44  | 19  | 62  | 72  | 100 | 96  | 86  | 48  |
| გველიsnake · KA, dream queries flatten it | 72  | 60  | 66  | 70  | 73  | 63  | 78  | 100 | 90  | 76  | 74  | 55  |

Read the tick row as the rule for spring and summer topics: almost nothing until March, a cliff edge in April. A page published in April misses the season.

## Publishing calendar, October 2026 to September 2027

This assumes about five pages a month through winter, which is below the pace the team kept in September. New pages are front-loaded so each is ranking before its peak, and summer goes to refreshing, measuring and planning the next autumn.

### Oct 2026

Publish

- [1 Bed bugs at home](#p1)
- [2 Dangerous and venomous animals of Georgia](#p2)
- [3 Rats in the house and yard](#p3)
- [4 Reptiles of Georgia](#p4)
- [5 Spiders in the house](#p5)

Prepare and refresh

- Start #13 (marten profile first)
- Ship quick wins 1–8
- Confirm the 14 September guides are indexed

### Nov 2026

Publish

- [6 Tick on a dog](#p6)
- [7 Bee, wasp and hornet stings](#p7)
- [8 Endemic animals of Georgia](#p8)
- [9 What bug is this in my house?](#p9)
- [10 Weevils and worms in beans, flour and grain](#p10)

Prepare and refresh

- Run the GSC audit around 1 Nov
- Continue #13

### Dec 2026

Publish

- [11 Insect bite identification](#p11)
- [12 Ticks in Georgia](#p12)
- [14 Birds of prey of Georgia](#p14)
- [15 Extinct animals of Georgia](#p15)
- [16 Marten in the house or attic](#p16)

Prepare and refresh

- Trim the wasp-nest sting section once #7 is live

### Jan 2027

Publish

- [17 Black snake in Georgia](#p17)
- [18 Pigeons on the balcony](#p18)
- [19 Migratory birds of Georgia](#p19)
- [20 Tick and household-pest species profiles](#p20)

Prepare and refresh

- Finish #13

### Feb 2027

Publish

- [21 Hedgehog in the garden](#p21)
- [22 Dog bitten by a snake](#p22)
- [23 A bird flew into the house](#p23)
- [24 Common-bird profile batch (parallel track)](#p24)

Prepare and refresh

- Refresh the snake cluster before the season: yard, bite, venomous, identification

### Mar 2027

Publish

- [25 Found a baby bird](#p25)
- [26 Flies and gnats in the house](#p26)
- [27 Woodworm in furniture and floors](#p27)

Prepare and refresh

- Refresh the tick cluster (#6, #12, tick bite) and the mosquito guide

### Apr 2027

Publish

- [28 Jellyfish in the Black Sea (Batumi)](#p28)
- [29 Wild animal sounds of Georgia](#p29)

Prepare and refresh

- Refresh the stings, wasp-nest, scorpion and spider-bite pages

### May 2027

Publish

- [30 Dangerous creatures of the Black Sea](#p30)

Prepare and refresh

- Refresh bat in house (Jul–Sep peak) and the dangerous-animals hub
- Build follow-ups only for pages already getting impressions

### Jun 2027

Publish

- No new pages

Prepare and refresh

- No new pages planned. Mine GSC queries for the new clusters
- Add this season's NCDC data to #12
- Update #28 for the beach season

### Jul 2027

Publish

- No new pages

Prepare and refresh

- Peak month for ticks, stings and jellyfish: watch CTR and rewrite titles where impressions are high and clicks low
- Draft the autumn additions

### Aug 2027

Publish

- No new pages

Prepare and refresh

- Refresh the autumn set: stink bug (decide on a standalone ladybird page), mouse, rats (#3), spiders in house (#5), bed bugs (#1)

### Sep 2027

Publish

- No new pages

Prepare and refresh

- Refresh the school hubs before term: #4, #8, #15, #14, #19, #2
- Batumi raptor news
- Write the 2027–28 roadmap from 12 months of GSC data

## Not recommended, and one decision for the owner

| Topic                                            | Evidence                                                                                                                                                 | Decision                                                                                                                                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| საქართველოს წითელი წიგნი / ნუსხა ცხოველები       | The strongest school query found: more than 10 autocomplete variants (ცხოველები, ფრინველები, შეტანილი ცხოველები, სია), RU животные красной книги грузии. | **Owner decision.** AGENTS.md rules out standalone Red List or conservation guides. If that rule is lifted, this becomes a top-five page, built only from statuses already cited on profiles. |
| გველი სიზმარში                                   | The biggest snake query by far.                                                                                                                          | Wrong intent for a scientific atlas.                                                                                                                                                          |
| ტილი (lice)                                      | Large, but pharmacy-led (ტილის წამალი პსპ / ავერსი).                                                                                                     | Not wildlife, and the results are commercial.                                                                                                                                                 |
| ასფეხა, ფალანგა, сколопендра в грузии            | No autocomplete in Georgian or Russian.                                                                                                                  | No measurable demand.                                                                                                                                                                         |
| როდის იძინებენ გველები / ზამთრის ძილი            | No autocomplete for the snake version. The general version has two weak completions.                                                                     | Skip the snake page. A general hibernation explainer can wait for autumn 2027.                                                                                                                |
| ცხოველების ნაკვალევი, ჩიტების გამოკვება ზამთარში | No autocomplete.                                                                                                                                         | No measurable demand.                                                                                                                                                                         |
| თხუნელა / მახრა as garden pests                  | Autocomplete is informational (ინფორმაცია, ფოტო), not pest control.                                                                                      | A mole profile is in #13; no pest guide.                                                                                                                                                      |
| ცოფი and wild animals                            | Autocomplete is about human vaccination (NCDC territory). ცოფიანი ტურა / მელა return nothing.                                                            | Add short rabies notes to the jackal, bat and fox pages instead.                                                                                                                              |
| ყირიმ-კონგოს ცხელება as its own page             | Strong autocomplete, but medical (YMYL) and owned by NCDC and the news.                                                                                  | A section inside the ticks hub (#12).                                                                                                                                                         |
| ხმელეთის კუს საჭმელი / ყიდვა                     | Real autocomplete, but it's pet-trade intent.                                                                                                            | Conflicts with the conservation messaging, and the turtles hub already answers "რას ჭამს კუ". Consider a "found a tortoise" section on the land-tortoise page.                                |
| ლოკოკინები ბაღში                                 | Farming and cosmetics dominate the autocomplete.                                                                                                         | Weak fit.                                                                                                                                                                                     |
| ირემი და შველი განსხვავება                       | One autocomplete.                                                                                                                                        | Use the lookalikes feature on the two profiles, not a page.                                                                                                                                   |

## Build notes for this codebase

- **Group guides (#1, #3, #5–#7, #9–#12, #16–#18, #21–#23, #25–#27)** fit the existing `defineGuideArticle` registry: four locales, sources, OG image via `pnpm images:og-guides`. The sitemap, search, footer, home links and 301s come from the registry automatically.
- **Cross-group hubs (#2, #4, #8, #15, #28–#30)** need top-level paths. Check whether `createGuideArticleRoute` and `guideArticles.test.ts` accept paths outside a group before you start, or use the cluster-guide factory, as `/riskis-doneebi` does.
- **Russian-first pages (#28, #30)** still need Georgian, English and Turkish copy to pass the locale-parity test. Write the Russian text first because that's where the demand is.
- **Integrity rules apply everywhere:** 112 for emergencies, no FAQPage schema on guides, no MedicalWebPage, no region claims without a source, and Georgian endemism kept separate from Caucasian endemism.
- **English slugs should name the country** where the query does ("dangerous animals in Georgia country", "ticks in Georgia country"). Otherwise US results for the state of Georgia swamp them.

## Sources

1. reptiles.ge repository (staging @ 75e78f76): `src/i18n/pathnames.ts`, `src/data/guideArticlePaths.ts`, `src/content/guides/*`, `messages/ka.json`, AGENTS.md.
2. Google Search Console export, Georgia, 23 Aug – 17 Sep 2026: `.seo/reports/gsc-raw.json`.
3. Google autocomplete (hl=ka/ru/en, gl=ge), queried 2 Oct 2026.
4. Google Trends, Georgia, past 5 years, accessed 2 Oct 2026.
5. Bed-bug results checked: [tbiliselebi.ge](https://tbiliselebi.ge/ka/news/medicine/ra-unda-vitsodet-satsolis-baghlinjoze-da-rogor-unda-movishorot-is), [mkurnali.ge](https://mkurnali.ge/skhvadaskhva/rchevebi/24453-sacolis-baglinjo-ra-unda-vicodet-masze.html), [kvirispalitra.ge](https://kvirispalitra.ge/article/21732-kithkhva-pasukhi/).
6. Dangerous, endemic and extinct animals results checked: [on.ge](https://on.ge/story/38567), [kvirispalitra.ge (extinct)](https://kvirispalitra.ge/article/28846-ckhovelebi-romlebic-saqarthveloshi-gadashendnen/), [nationalparks.ge](https://nationalparks.ge/ka/site/vashlovaninp/natureCulture).
7. Sting results checked (NCDC guidance as reported): [tabula.ge](https://tabula.ge/ge/news/628812-ra-unda-gaaketot-tu-putkari-bziki-krazana-gikbent), [ajaratv.ge](https://ajaratv.ge/article/50099), [redmed.ge](https://redmed.ge/blog-new/rogor-unda-movikcet-bzikis-nakbenis-dros/225).
8. Ticks and CCHF context: [nfa.gov.ge](http://nfa.gov.ge/ge/media-centri/axali-ambebi0/veterinaria/yirim-kongos-hemoragiuli-cxelebis-shemtxvevebi-mnishvnelovnad-shemcirda.page), [pia.ge](https://pia.ge/news/sazogadoeba/sad-aris-gavrtselebuli-kirim-kongos-tskheleba-sakartveloshi-da-ra-itsvevs-mas---marina-endeladzis-ganmarteba), [mcm.ge](https://mcm.ge/24121/).
9. Pigeon results checked: [rogor.ge](https://rogor.ge/article/2337-rogor-movashorot-mtredebi-aivnidan/), [mshoblebi.ge](https://mshoblebi.ge/shin_ge/132-praktikuli-rchevebi/ekologia/6280-rogor-davaprtxot-mtredebi-aivanze-an-terasaze/).
10. Jellyfish (Russian) results checked: [travelask.ru](https://travelask.ru/questions/5304598_ge_bus_rebyat-videl-v-vode-mnogo-meduz-v-batumi-oni-voobsche-opasny), [kp.ru](https://www.kp.ru/russia/pravila-vyzhivaniya/meduzy-v-chernom-more/), [batuminews.online](https://batuminews.online/%D0%BC%D0%B5%D0%B4%D1%83%D0%B7%D1%8B-%D0%B2-%D0%B1%D0%B0%D1%82%D1%83%D0%BC%D0%B8/).

Prepared 2 October 2026 for reptiles.ge. Demand ratings are qualitative and based on the evidence above; re-score after the November GSC audit.
