# reptiles.ge — Content & SEO Roadmap

სამუშაო ფაილი: topical authority + species knowledge graph, არა 30 SEO სტატია.

**წესები**

- აუდიტის Volume-ები ფარდობითია — არ მივიჩნიოთ Google search volume-ად.
- reptiles.ge-ს ამჟამად პრაქტიკულად არ აქვს ორგანული ხილვადობა; მიზანი არის კლასტერები, შიდა ბმულები და სრული სახეობების პროფილები.
- რეგიონული გავრცელება არ გამოიგონოს. მხოლოდ დადასტურებული ჩანაწერები (Tarkhnishvili et al. 2026 + არსებული `regions.ts`).
- სამედიცინო გვერდები მხოლოდ სანდო/ოფიციალური წყაროებით.

**სტრატეგია:** `Georgia Reptile Knowledge Graph` — სახეობა ↔ ჯგუფი ↔ რეგიონი ↔ ჰაბიტატი ↔ მსგავსი სახეობა.

```text
                    reptiles.ge
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     გველები          ხვლიკები           კუები / ამფიბიები
        │                │                │
   ┌────┼────┐       ┌───┼───┐        ┌───┼───┐
 გიურზა  ...       ჯოჯო  ...       სახეობა ...
        │
   შხამიანი / იდენტიფიკაცია / გავრცელება / ნაკბენი
```

---

## ახლა რა გვაქვს

| არსებული URL | როლი | შენიშვნა |
| --- | --- | --- |
| `/gvelebi` `/xvlikebi` `/kuebi` `/amfibiebi` | group hub / pillar | KA canonical; EN რჩება `/en/snakes` და ა.შ. |
| `/gvelebi/shxamiani-gvelebi` | შხამიანი გველების გიდი | EN: `/en/venomous-snakes` |
| `/gvelebi/gveli-ezoshi` | ეზოს პრაქტიკული გიდი | ნაკბენის გვერდთან უნდა დაიკავშიროს |
| `/species` | ატლასი / კატალოგი | |
| `/gvelebi/giurza` (და ანალოგიურად) | 68 სახეობის პროფილი | KA ქართული slug; EN სამეცნიერო; ძველი `/species/[id]` 301 |
| `/regions` `/regions/[id]` | 12 რეგიონი | თითქმის მხოლოდ გველები + გველხოკერა |
| `/about` `/contact` | საიტი | |

**68 სახეობა ჩეკლისტით დაბლოკილია** (12 ამფიბია + 56 ქვეწარმავალი). პროფილები არსებობს, მაგრამ ბევრი thin/genericა (განსაკუთრებით ახალი taxa: Darevskia, ამფიბიები, კუები). რეგიონული რუკა ახალ სახეობებზე ხშირად ცარიელია — ეს განზრახაა, სანამ წყარო არ ადასტურებს.

**URL (გადაწყვეტილია)**

KA cluster URL არის canonical; EN ინარჩუნებს ინგლისურ/სამეცნიერო slug-ს. ძველი `/species/{id}` და ინგლისური KA path-ები 301-ით მიდის ახალ მისამართზე.

**დუბლი გვერდები**

- `#2` `/gvelebi/sakartvelos-gvelebi` vs `#11` `/gvelebi/saxeoebebi` — გაერთიანდება `#11`-ში. ახლა კატალოგი `/gvelebi`-ზეა; `#2` ცალკე არ იქმნება.
- `#9` `/amfibiebi/bayayi` vs `#24` `/amfibiebi/bayayi/saxeoebebi` — `#9` live როგორც Anura გიდი; `#24` ინდექს-ცხრილი მოგვიანებით, overlap-ის შემთხვევაში 301.

---

## ფაზა 0 — ინფრასტრუქტურა (პარალელურად ყველა ფაზასთან)

ეს აუდიტის „და პარალელურად“ ბლოკია. pillar-ების გარეშეც იწყება.

- [x] **KA URL რუკა** — ინგლისური path → ქართული path + 301 + sitemap + canonical/hreflang
  - `/snakes` → `/gvelebi`
  - `/lizards` → `/xvlikebi`
  - `/turtles` → `/kuebi`
  - `/amphibians` → `/amfibiebi`
  - `/venomous-snakes` → `/gvelebi/shxamiani-gvelebi`
  - `/snakes-in-the-yard` → `/gvelebi/gveli-ezoshi`
  - species: `/species/macrovipera-lebetina` → `/gvelebi/giurza` (და ანალოგიურად ყველა)
- [x] **Breadcrumbs** კლასტერ გვერდებზე: Home → ჯგუფი → (შხამიანი, თუ არის) → სახეობა
- [x] **Internal linking წესები**
  - pillar → child გიდები + სახეობები (შემდეგი cluster child-ები ფაზა 1+)
  - species → parent hub + venomous (თუ შხამიანია) + მსგავსი სახეობები + რეგიონები
  - region → სახეობები → cluster hubs
  - lookalike წყვილები ორმხრივად (გველხოკერა ↔ ანკარა/ბოხმეჭა, გიურზა ↔ მალპოლონი, …)
- [x] **Unique title / H1 / meta** — H1 = ქართული სახელი; title = `{name} ({sci}) — {ჯგუფი საქართველოში}`; description overview-იდან. ბესპოკ copy ფაზა 1+ სახეობის შევსებაზე.
- [x] **FAQ + schema** მხოლოდ იქ, სადაც რეალური Q&A არის; არა ცარიელი FAQPage
- [x] **Species related** — lookalikes + genus/family + region overlap + venomous counterparts
- [x] Nav / Footer / Home — pathnames ავტომატურად ლოკალიზდება; Footer-ში ყველა hub + შხამიანი სახეობები cluster URL-ით

---

## ფაზა 1 — პირველი 10 სამუშაო

თუ მხოლოდ 10 რამის გაკეთება შეიძლება, ეს არის რიგი.

### 1. `/gvelebi` — გველები საქართველოში (Pillar)

**სტატუსი:** `/gvelebi` live; EN `/en/snakes`.

- [x] URL `/gvelebi` + 301 `/snakes`-დან
- [x] H1/title: გველები საქართველოში
- [x] კლასტერის child ლინკები, რომლებიც არსებობს: შხამიანი, ეზო, გიურზა (იდენტიფიკაცია / გავრცელება / ნაკბენი / დიდი გველები — ფაზა 2)
- [x] ყველა snake species card → პროფილი
- [x] შხამიანი vs უშხამო განცალკევება
- [x] FAQ მხოლოდ რეალურ intent-ზე (რამდენია, რომელი შხამიანია, სად გვხვდება)

### 2. `/gvelebi/sakartvelos-gvelebi` — საქართველოს გველების სახეობები (Guide)

**სტატუსი:** არ იქმნება ცალკე — იგივეა რაც `#11`. კატალოგი ახლა `/gvelebi`-ზეა; სრული ინდექს-ცხრილი ფაზა 2.

- [x] გადაწყვეტა: გაერთიანება `#11`-ში (`/gvelebi/saxeoebebi`); `#2` 301 მოგვიანებით
- [ ] `#11` ცხრილი ჯერ არ არის

### 3. `/gvelebi/shxamiani-gvelebi` — საქართველოს შხამიანი გველები (Guide)

**სტატუსი:** `/gvelebi/shxamiani-gvelebi` live.

- [x] URL გადაყვანა + 301
- [x] შიდა ბმულები: გიურზა featured + ყველა შხამიანი პროფილი; გველგესლები vs Malpolon გამოყოფილია
- [ ] ბმული იდენტიფიკაციისა (`#12`) და ნაკბენის (`#13`) გვერდებზე — გვერდები ჯერ არ არსებობს; 112 disclaimer დამატებულია
- [x] სამედიცინო disclaimer: ეს არ არის სასწრაფო დახმარების ინსტრუქცია

### 4. `/gvelebi/giurza` — გიურზა (Species)

**სტატუსი:** `/gvelebi/giurza` live.

- [x] ქართული URL + 301
- [x] template-ის სრული ველი — reference; დამატებულია lebetinus vs lebetina და Malpolon lookalike
- [x] lookalikes + რეგიონები (მხოლოდ არსებული data)
- [x] წყაროები: Tarkhnishvili 2026, IUCN, ანტიგიურზა უკვე პროფილშია

### 5. `/xvlikebi` — ხვლიკები საქართველოში (Pillar)

**სტატუსი:** `/xvlikebi` live.

- [x] URL `/xvlikebi` + 301
- [x] child: ჯოჯო, გველხოკერა (იდენტიფიკაცია / vs გველხოკერა გვერდები — ფაზა 3)
- [x] Darevskia-ს სიმდიდრის მოკლე ახსნა + ბმული სახეობებზე

### 6. `/xvlikebi/jojo` — ჯოჯო (Species)

**სტატუსი:** `/xvlikebi/jojo` live. Generic ტექსტი ჩანაცვლებულია; ზომა/რეგიონი არ გამოგონილა.

- [x] ქართული URL
- [x] template წყაროს ფარგლებში: ფოტოები, ჰაბიტატი, lookalikes; ზომა გამოტოვებულია
- [x] რეგიონები არ არის — `regions.ts`-ში ჯოჯო არაა

### 7. `/xvlikebi/gvelxokera` — გველხოკერა (Species)

**სტატუსი:** `/xvlikebi/gvelxokera` live.

- [x] ქართული URL
- [ ] ძლიერი ბმული `#18`-ზე — გვერდი ჯერ არ არსებობს; FAQ-ში ბოხმეჭასთან შედარება დამატებულია
- [x] იდენტიფიკაცია: ქუთუთოები, ყურის ხვრელი, არა გველი

### 8. `/kuebi` — კუები საქართველოში (Pillar)

**სტატუსი:** `/kuebi` live.

- [x] URL `/kuebi` + 301
- [x] child: ადგილობრივი vs ინტროდუცირებული (ხმელეთის/წყლის ინდექსები — ფაზა 4)
- [x] ინტროდუცირებული *Trachemys scripta* ცალკე აღინიშნოს

### 9. `/amfibiebi/bayayi` — ბაყაყები საქართველოში (Guide)

**სტატუსი:** `/amfibiebi/bayayi` live (EN `/en/amphibians/frogs`).

- [x] გიდი ბაყაყებზე (Anura), არა მთელ ამფიბიებზე
- [x] ბმულები სახეობებზე: ტბორის ბაყაყი, მცირეაზიური ბაყაყი, ვასაკები, გომბეშოები
- [ ] ბმული `#24` სახეობების ინდექსზე — ჯერ არ არსებობს

### 10. `/amfibiebi` — ამფიბიები საქართველოში (Pillar)

**სტატუსი:** `/amfibiebi` live.

- [x] URL `/amfibiebi` + 301
- [x] child: ბაყაყები გიდი + Anura / Caudata სექციები
- [x] 12 სახეობის ჩარჩო (Tarkhnishvili et al. 2026)

### 10b. 68-ვე species page-ის სრული შევსება

ცალკე დიდი სამუშაო — იხ. **Species template** და **Species backlog**. ფაზა 1-ში მინიმუმი:

- [x] გიურზა, ჯოჯო, გველხოკერა — reference (ჯოჯო წყაროს ფარგლებში; რეგიონი/ზომა არ გამოგონილა)
- [ ] ყველა შხამიანი გველი — სრული (გიდი გაძლიერდა; პროფილები ჯერ არ გადაწერილა ყველა)
- [ ] დანარჩენ 65-ზე: placeholder/generic ტექსტის ამოცნობა და რიგით შევსება

---

## ფაზა 2 — Snake cluster (11–15)

### 11. `/gvelebi/saxeoebebi` — გველის სახეობები საქართველოში

**ერთ-ერთი ყველაზე მნიშვნელოვანი გვერდი.** Parent/index ყველა snake species-ისთვის.

- [ ] ცხრილი/ბარათები ყველა გველზე:
  - ფოტო
  - ქართული სახელი
  - სამეცნიერო სახელი
  - შხამიანია / არა
  - გავრცელება
  - ზომა
  - ჰაბიტატი
  - აქტიურობის პერიოდი
- [ ] ფილტრები: შხამიანი / უშხამო / ოჯახი
- [ ] ყოველი რიგი → species page
- [ ] თუ `#2` გაერთიანდება აქ, `#2` 301-ით აქ მოვიდეს

### 12. `/gvelebi/shxamiani-gvelis-amocnoba` — როგორ განვასხვავოთ შხამიანი და არაშხამიანი გველი

- [ ] informational intent გვერდი
- [ ] ვიზუალური ნიშნები + გაფრთხილება, რომ წესი არ არის უნივერსალური
- [ ] ლინკები: გიურზა → კავკასიური გველგესლა → სხვა შხამიანი
- [ ] lookalike წყვილები (მცურავი vs გველგესლა, გველხოკერა vs გველი)

### 13. `/gvelebi/gvelis-nakbeni` — გველის ნაკბენი — რა უნდა გავაკეთოთ?

**სიფრთხილე:** მხოლოდ სანდო სამედიცინო/ოფიციალური წყაროები. არა ფოლკლორი, არა „გადაწოვა“, არა ალკოჰოლი.

- [ ] წყაროების სია დაფიქსირდეს გვერდის დაწერამდე (112, ჯანდაცვა, ტოქსიკოლოგია, peer-reviewed)
- [ ] რა ქნა / რა არ ქნა
- [ ] როდის არის სასწრაფო
- [ ] ბმულები შხამიან სახეობებზე + `/snakes-in-the-yard`
- [ ] Medical/educational disclaimer + FAQ schema მხოლოდ თუ Q&A ზუსტია
- [ ] EN თარგმანი იგივე სიფრთხილით

### 14. `/gvelebi/gavrtseleba` — სად გვხვდება გველები საქართველოში?

რეალური data moat: რეგიონი → სახეობები → ფოტოები → რუკა.

- [ ] 12 რეგიონის სია + რუკა (`/regions` უკვე არსებობს — ეს გველებზე ფოკუსირებული ხედია)
- [ ] თითო რეგიონში მხოლოდ დადასტურებული speciesIds
- [ ] ბმული `/regions/[id]` და species pages
- [ ] ხარვეზი: ახალი გველები (`xerotyphlops`, `eryx`, `eirenis`, …) რეგიონებში ჯერ არ არის — არ გამოიგონოს; ცალკე data-task

### 15. `/gvelebi/didi-gvelebi` — საქართველოში გავრცელებული ყველაზე დიდი გველები

- [ ] long-tail გიდი
- [ ] გიურზა, ყვითელმუცელა/წითელმუცელა მცურავები, გველხოკერა (თუ შედარებაშია — მიუთითე რომ ხვლიკია)
- [ ] ზომები მხოლოდ წყაროთი

---

## ფაზა 3 — Lizard cluster (16–18)

### 16. `/xvlikebi/saxeoebebi` — საქართველოს ხვლიკების სახეობები

- [ ] child of `/xvlikebi`
- [ ] იგივე ცხრილის ველები, რაც snake index-ს
- [ ] Darevskia გამოყოფილი ბლოკით (16 სახეობა)

### 17. `/xvlikebi/identifikacia` — როგორ განვასხვავოთ ხვლიკები საქართველოში

- [ ] „ეს რა ხვლიკია?“ flow: ფოტო → ზომა → შეფერილობა → გავრცელება → მსგავსი სახეობები
- [ ] Darevskia-სთვის გაფრთხილება: ფერი საკმარისი არ არის
- [ ] ბმულები species pages-ზე

### 18. `/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba` — ხვლიკი თუ გველხოკერა

- [ ] niche comparison გვერდი
- [ ] გველხოკერა vs გველი vs ბოხმეჭა (`Anguis colchica`)
- [ ] ორმხრივი ბმულები species pages-დან

---

## ფაზა 4 — Turtle cluster (19–22)

### 19. `/kuebi/saxeoebebi` — საქართველოს კუების სახეობები

- [ ] 4 სახეობის ინდექსი: *Testudo graeca*, *Emys orbicularis*, *Mauremys caspica*, *Trachemys scripta*

### 20. `/kuebi/xmelis-kuebi` — ხმელეთის კუები საქართველოში

- [ ] ძირითადად ხმელთაშუაზღვის კუ
- [ ] ჰაბიტატი, რეგიონები (როცა data იქნება), კონსერვაცია

### 21. `/kuebi/tsqlis-kuebi` — წყლის კუები საქართველოში

- [ ] ჭაობის კუ, კასპიური კუ, წითელყურა (ინტროდუცირებული)

### 22. `/kuebi/identifikacia` — როგორ განვასხვავოთ საქართველოს კუების სახეობები

- [ ] visual ID: ხმელეთის vs წყლის, მშობლიური vs ინტროდუცირებული

---

## ფაზა 5 — Amphibian cluster (23–25)

### 23. `/amfibiebi/saxeoebebi` — საქართველოს ამფიბიების სახეობები

- [ ] 12 სახეობის ინდექსი (Anura + Caudata)

### 24. `/amfibiebi/bayayi/saxeoebebi` — საქართველოს ბაყაყების სახეობები

- [ ] Anura მხოლოდ
- [ ] თუ `#9` გაერთიანდება, 301 აქ ან პირიქით

### 25. `/amfibiebi/tritoni-salamandra` — ტრიტონები და სალამანდრები საქართველოში

- [ ] *Mertensiella caucasica*, *Lissotriton lantzi*, *Ommatotriton ophryticus*, *Triturus karelinii*
- [ ] niche / authority გვერდი; ენდემური/დაცული სახეობების ხაზგასმა მხოლოდ წყაროთი

---

## ფაზა 6 — Conservation cluster (26–29)

წყაროები: საქართველოს წითელი ნუსხა (ოფიციალური), IUCN, Tarkhnishvili et al. 2026. სტატუსი არ გამოიგონოს.

### 26. `/konservacia/witeli-nusxa-qvewarmavlebi` — საქართველოს წითელი ნუსხის ქვეწარმავლები

- [ ] ოფიციალური ნუსხის სახეობები + ბმული პროფილებზე
- [ ] განსხვავება IUCN vs ეროვნული სტატუსი

### 27. `/konservacia/witeli-nusxa-amfibiebi` — საქართველოს წითელი ნუსხის ამფიბიები

- [ ] იგივე სტრუქტურა ამფიბიებზე

### 28. `/konservacia/ishviati-qvewarmavlebi` — იშვიათი ქვეწარმავლები საქართველოში

- [ ] არ აურიოს წითელ ნუსხასთან, თუ overlap სრული არ არის
- [ ] კრიტერიუმი დაფიქსირდეს (ეროვნული RL, ვიწრო არეალი, candidate taxa)

### 29. `/konservacia/endemuri-qvewarmavlebi` — საქართველოს ენდემური ქვეწარმავლები

- [ ] authority-building
- [ ] მხოლოდ ტაქსონები, რომლებიც წყაროში ენდემურად/სუბენდემურადაა მითითებული
- [ ] Tarkhnishvili et al. 2026: 12 ამფიბია + 56 ქვეწარმავალი, DNA barcoding, რუკები — გამოიყენე ციტირებით, არა გადაწერით

---

## ფაზა 7 — რეგიონები (#30)

### 30. `/regions` — საქართველოს ქვეწარმავლები რეგიონების მიხედვით

**სტატუსი:** ინდექსი და 12 რეგიონის გვერდი არსებობს. შინაარსი თხელია და თითქმის მხოლოდ გველებია.

მაგალითი (მხოლოდ არსებული data, არა სრული ფაუნა):

- კახეთი — გიურზა, … (ხვლიკები/კუები ჯერ არ არის მიბმული)
- აჭარა — კავკასიური გველგესლა, …
- სამეგრელო — …
- მცხეთა-მთიანეთი — …

- [ ] `/regions` გახდეს cluster hub: რეგიონი → სახეობები → ფოტო → რუკა
- [ ] თითო რეგიონის intro / ჰაბიტატები / შხამიანი / FAQ გაძლიერდეს
- [ ] **Data gap:** რეგიონებში არ შედის ამფიბიები, კუები, თითქმის ყველა ხვლიკი (გარდა გველხოკერასი) და ახალი გველები. შევსება მხოლოდ წყაროთი.
- [ ] შემდეგი ეტაპი (არა ახლა, თუ data არაა): რეგიონი → მუნიციპალიტეტი → სახეობა. არ აიგოს ცარიელი მუნიციპალიტეტის გვერდები.

---

## Species template — 68 გვერდის სტანდარტი

ეს არის საიტის მთავარი აქტივი. 1 სრული პროფილი > 1,000-სიტყვიანი generic სტატია.

ახლა პროფილს აქვს: ფოტო, სახელები, overview, stats, gallery, range map, identification, diet/behavior/conservation, FAQ, sources, related (genus/family).

**სავალდებულო ველები (ყველა სახეობაზე)**

| ველი | ახლა | TODO |
| --- | --- | --- |
| ფოტოები / საველე ფოტოები | CDN URL არის; verified Georgia photo ბევრზე საეჭვოა | [ ] რეალური საველე ფოტო ან პლეისჰოლდერის პოლიტიკა |
| ქართული სახელი | არის | [ ] უნიკალური H1 |
| სამეცნიერო სახელი | არის | [ ] ტაქსონომიური შენიშვნა (lebetina vs lebetinus, candidate taxa) |
| შხამიანობა | `danger` + stat | [ ] ადამიანისთვის რისკი ცალკე, არა მხოლოდ Harmless/Moderate/High |
| ზომა | ხშირად generic | [ ] კონკრეტული, წყაროთი |
| გავრცელება საქართველოში | ხშირად მხოლოდ „საქართველო“ | [ ] რეგიონები მხოლოდ დადასტურებისას |
| ჰაბიტატი | არის, ხშირად ზოგადი | [ ] საქართველოს კონტექსტი |
| აქტიურობის პერიოდი | ხშირად behavior-შია ჩაფლული | [ ] ცალკე stat/სექცია |
| გამრავლება | ხშირად behavior-ში | [ ] ცალკე, თუ წყაროა |
| კვება | არის | [ ] generic წინადადებების ჩანაცვლება |
| მსგავსი სახეობები | related = taxonomy | [ ] lookalikes ცალკე |
| რეგიონები | რუკა, თუ `speciesIds`-შია | [ ] უმეტესობა ცარიელია — data task |
| წყაროები | Tarkhnishvili + IUCN generic | [ ] კონკრეტული IUCN URL, სადაც არსებობს |
| unique title / meta | შაბლონი | [ ] სახეობის-სპეციფიკური intent |

**არ შეივსოს გამოგონილი ტექსტით.** თუ წყარო არ არის, ველი გამოტოვდეს (კოდი უკვე მალავს placeholder body/stats-ს).

### Species backlog — შევსების რიგი

**A. Reference (ფაზა 1)**

- [x] `macrovipera-lebetina` — გიურზა
- [x] `paralaudakia-caucasia` — ჯოჯო
- [x] `pseudopus-apodus` — გველხოკერა

**B. შხამიანი გველები**

- [ ] `vipera-kaznakovi` — კავკასიური გველგესლა
- [ ] `vipera-dinniki` — დინიკის გველგესლა
- [ ] `vipera-transcaucasiana` — ცხვირრქოსანი გველგესლა
- [ ] `vipera-darevskii` — დარევსკის გველგესლა
- [ ] `vipera-renardi` — (ნუსხაში: სომხური გველგესლა / steppe — სახელი გადაამოწმე)
- [ ] `malpolon-insignitus` — თუ Moderate/rear-fanged; რისკი ზუსტად

**C. ხშირი/lookalike გველები**

- [ ] `natrix-natrix` `natrix-tessellata`
- [ ] `zamenis-longissimus` `zamenis-hohenackeri`
- [ ] `elaphe-urartica` `elaphe-dione`
- [ ] `dolichophis-schmidti` `dolichophis-caspius`
- [ ] `platyceps-najadum` `telescopus-fallax` `coronella-austriaca`
- [ ] `hemorrhois-ravergieri` `eirenis-modestus` `eirenis-collaris`
- [ ] `xerotyphlops-vermicularis` `eryx-jaculus`

**D. კუები (4)**

- [ ] `testudo-graeca` `emys-orbicularis` `mauremys-caspica` `trachemys-scripta`

**E. ამფიბიები (12)**

- [ ] სალამანდრა/ტრიტონები: `mertensiella-caucasica` `lissotriton-lantzi` `ommatotriton-ophryticus` `triturus-karelinii`
- [ ] ბაყაყები/გომბეშოები/ვასაკები: `pelobates-syriacus` `pelodytes-caucasicus` `bufotes-viridis` `bufo-verrucosissimus` `hyla-orientalis` `hyla-savignyi` `rana-macrocnemis` `pelophylax-ridibundus`

**F. ხვლიკები — არა-Darevskia**

- [ ] `tenuidactylus-caspius` `anguis-colchica` `eumeces-schneiderii` `ablepharus-pannonicus`
- [ ] `eremias-velox` `eremias-arguta` `ophisops-elegans`
- [ ] `lacerta-agilis` `lacerta-strigata` `lacerta-media` `phoenicolacerta-laevis`

**G. Darevskia (16)** — იდენტიფიკაცია + რეგიონი კრიტიკულია; არ აირიოს ერთმანეთში

- [ ] `darevskia-adjarica` `darevskia-alpina` `darevskia-armeniaca` `darevskia-brauneri`
- [ ] `darevskia-caucasica` `darevskia-clarkorum` `darevskia-daghestanica` `darevskia-dahli`
- [ ] `darevskia-derjugini` `darevskia-mixta` `darevskia-portschinskii` `darevskia-praticola`
- [ ] `darevskia-pontica` `darevskia-obscura` `darevskia-raddei` `darevskia-valentini`

**H. Data, არა პროზა**

- [ ] რეგიონული `speciesIds` გაფართოება მხოლოდ წყაროთი
- [ ] generic conservation („საქართველოში დაფიქსირებულია…“) ჩანაცვლება ან წაშლა
- [ ] `photoConfidence` გადაამოწმე — ჩეკლისტში ყველა `verified`-ია, რეალურად ბევრი placeholder/generic CDN შეიძლება იყოს
- [ ] candidate taxa შენიშვნა პროფილზე (Tarkhnishvili 2026)
- [ ] `Macrovipera lebetinus` vs slug `macrovipera-lebetina` — საჯაროდ ახსნილი

---

## არქიტექტურა / კოდი — რაც გასაკეთებელია

ესენი roadmap-ის გვერდების პარალელურად იკვრება.

- [ ] Group hub path-ები `groupHubs.ts`-დან ქართულ slug-ებზე; locale-aware path EN-სთვის
- [ ] `next.config.ts` 301 რუკა ყველა ძველი URL-ისთვის (`/snakes`, `/lizards`, `/venomous-snakes`, …)
- [ ] Species canonical URL helper: cluster + ქართული slug (და სამეცნიერო fallback)
- [x] Cluster child routes: არა ბლოგის `/blog/...`, არამედ `/gvelebi/...`, `/xvlikebi/...`, `/kuebi/...`, `/amfibiebi/...` (პირველი child: `/amfibiebi/bayayi`)
- [ ] Species index კომპონენტი (ცხრილი #11/#16/#19/#23) — ერთი reusable UI
- [ ] Visual ID კომპონენტი (#12/#17/#22/#18)
- [ ] Lookalike ველი species frontmatter-ში
- [ ] Activity / reproduction / human-risk ველები (ან არსებული biology-ს მკაფიო სექციები)
- [ ] `getRelatedSpecies` — lookalikes + venom counterparts, არა მხოლოდ genus
- [ ] Breadcrumb schema + UI ყველა ახალ გვერდზე
- [ ] sitemap-ში ახალი URL-ები; ძველები მხოლოდ 301, არა duplicate
- [ ] Home / Nav / Footer / `HomeKnowledge` განახლება კლასტერებზე
- [ ] `#13` ნაკბენის გვერდზე **არ** მიეცეს medical advice schema, თუ კონტენტი არ არის ოფიციალურ წყაროზე დაყრდნობილი

---

## 30 გვერდის ინვენტარი (სწრაფი ხედი)

| # | გვერდი | სამიზნე URL | ტიპი | სტატუსი |
| --- | --- | --- | --- | --- |
| 1 | გველები საქართველოში | `/gvelebi` | Pillar | არის |
| 2 | საქართველოს გველების სახეობები | `/gvelebi/sakartvelos-gvelebi` | Guide | გაერთიანდება #11-ში |
| 3 | საქართველოს შხამიანი გველები | `/gvelebi/shxamiani-gvelebi` | Guide | არის |
| 4 | გიურზა | `/gvelebi/giurza` | Species | არის |
| 5 | ხვლიკები საქართველოში | `/xvlikebi` | Pillar | არის |
| 6 | ჯოჯო | `/xvlikebi/jojo` | Species | არის (thin აღარაა) |
| 7 | გველხოკერა | `/xvlikebi/gvelxokera` | Species | არის |
| 8 | კუები საქართველოში | `/kuebi` | Pillar | არის |
| 9 | ბაყაყები საქართველოში | `/amfibiebi/bayayi` | Guide | არის |
| 10 | ამფიბიები საქართველოში | `/amfibiebi` | Pillar | არის |
| 11 | გველის სახეობები | `/gvelebi/saxeoebebi` | Index | არ არის |
| 12 | შხამიანის ამოცნობა | `/gvelebi/shxamiani-gvelis-amocnoba` | Guide | არ არის |
| 13 | გველის ნაკბენი | `/gvelebi/gvelis-nakbeni` | Guide | არ არის |
| 14 | გავრცელება | `/gvelebi/gavrtseleba` | Guide | ნაწილობრივ `/regions` |
| 15 | დიდი გველები | `/gvelebi/didi-gvelebi` | Guide | არ არის |
| 16 | ხვლიკების სახეობები | `/xvlikebi/saxeoebebi` | Index | არ არის |
| 17 | ხვლიკების იდენტიფიკაცია | `/xvlikebi/identifikacia` | Guide | არ არის |
| 18 | ხვლიკი vs გველხოკერა | `/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba` | Guide | FAQ-ში მხოლოდ |
| 19 | კუების სახეობები | `/kuebi/saxeoebebi` | Index | არ არის |
| 20 | ხმელეთის კუები | `/kuebi/xmelis-kuebi` | Guide | არ არის |
| 21 | წყლის კუები | `/kuebi/tsqlis-kuebi` | Guide | არ არის |
| 22 | კუების იდენტიფიკაცია | `/kuebi/identifikacia` | Guide | არ არის |
| 23 | ამფიბიების სახეობები | `/amfibiebi/saxeoebebi` | Index | არ არის |
| 24 | ბაყაყების სახეობები | `/amfibiebi/bayayi/saxeoebebi` | Index | არ არის |
| 25 | ტრიტონები და სალამანდრები | `/amfibiebi/tritoni-salamandra` | Guide | არ არის |
| 26 | წითელი ნუსხა — რეპტილიები | `/konservacia/witeli-nusxa-qvewarmavlebi` | Guide | არ არის |
| 27 | წითელი ნუსხა — ამფიბიები | `/konservacia/witeli-nusxa-amfibiebi` | Guide | არ არის |
| 28 | იშვიათი ქვეწარმავლები | `/konservacia/ishviati-qvewarmavlebi` | Guide | არ არის |
| 29 | ენდემური ქვეწარმავლები | `/konservacia/endemuri-qvewarmavlebi` | Guide | არ არის |
| 30 | რეგიონების მიხედვით | `/regions` | Hub | არის, thin / incomplete fauna |

პლუს: **68 species × სრული template** და **ფაზა 0 ინფრასტრუქტურა**.

---

## წყაროები (კონტენტისთვის, არა volume-ისთვის)

- Tarkhnishvili et al. 2026 — annotated checklist, DNA barcoding, taxonomic remarks. DOI: `10.3897/caucasiana.5.e189214`
- Ilia State University Georgian Biodiversity Database — Reptilia catalogue / conservation status
- IUCN Red List — გლობალური სტატუსი, სახეობა-სახეობაზე კონკრეტული URL
- საქართველოს წითელი ნუსხა — ეროვნული სტატუსი (#26–27)
- APA / დაცული ტერიტორიები — მხოლოდ კონკრეტული პარკის კონტექსტში, არა მთელი ქვეყნის ფაუნის განზოგადება

---

## როგორ ვიმუშაოთ ამ ფაილზე

1. ფაზა 0 URL გადაწყვეტილება (canonical + 301) — ამის გარეშე ახალი გვერდები ორმაგდება.
2. ფაზა 1: 4 pillar + შხამიანი გიდი + 3 species reference.
3. `#11` snake index — knowledge graph-ის ხერხემალი.
4. დანარჩენი cluster child-ები პრიორიტეტით: იდენტიფიკაცია / ნაკბენი / რეგიონები / კონსერვაცია.
5. 68 პროფილი რიგით A→G; data gap-ები (რეგიონები, ფოტოები) ცალკე, არა ტექსტის გამოგონებით.

Checkbox-ები ამ ფაილში იცვლება სამუშაოს მიმდინარეობისას.
