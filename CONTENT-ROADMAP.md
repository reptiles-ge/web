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
| `/gvelebi/gveli-ezoshi` | ეზოს პრაქტიკული გიდი | ნაკბენის გვერდთან დაკავშირებულია |
| `/gvelebi/saxeoebebi` | გველების ინდექს-ცხრილი | EN: `/en/snakes/species`; `#2` 301 აქ |
| `/gvelebi/shxamiani-gvelis-amocnoba` | შხამიანი vs უშხამო | EN: `/en/snakes/identify-venomous` |
| `/gvelebi/gvelis-nakbeni` | ნაკბენი (საგანმანათლებლო) | EN: `/en/snakes/bite`; 112; არა medical schema |
| `/gvelebi/gavrtseleba` | გველების გავრცელება | EN: `/en/snakes/range` |
| `/xvlikebi/saxeoebebi` | ხვლიკების ინდექსი | EN: `/en/lizards/species` |
| `/xvlikebi/identifikacia` | ხვლიკების ამოცნობა | EN: `/en/lizards/identify` |
| `/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba` | გველხოკერა vs გველი | EN: `/en/lizards/lizard-or-glass-lizard` |
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
- [x] კლასტერის child ლინკები: ინდექსი, შხამიანი, ამოცნობა, ნაკბენი, გავრცელება, დიდი გველები, ეზო, გიურზა
- [x] ყველა snake species card → პროფილი
- [x] შხამიანი vs უშხამო განცალკევება
- [x] FAQ მხოლოდ რეალურ intent-ზე (რამდენია, რომელი შხამიანია, სად გვხვდება)

### 2. `/gvelebi/sakartvelos-gvelebi` — საქართველოს გველების სახეობები (Guide)

**სტატუსი:** არ იქმნება ცალკე — იგივეა რაც `#11`. 301 → `/gvelebi/saxeoebebi`.

- [x] გადაწყვეტა: გაერთიანება `#11`-ში (`/gvelebi/saxeoebebi`); `#2` 301 → `/gvelebi/saxeoebebi`
- [x] `#11` ცხრილი live

### 3. `/gvelebi/shxamiani-gvelebi` — საქართველოს შხამიანი გველები (Guide)

**სტატუსი:** `/gvelebi/shxamiani-gvelebi` live.

- [x] URL გადაყვანა + 301
- [x] შიდა ბმულები: გიურზა featured + ყველა შხამიანი პროფილი; გველგესლები vs Malpolon გამოყოფილია
- [x] ბმული იდენტიფიკაციისა (`#12`) და ნაკბენის (`#13`) გვერდებზე; 112 disclaimer დამატებულია
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
- [x] child: ჯოჯო, გველხოკერა, ინდექსი, ამოცნობა, გველხოკერა vs გველი
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

**სტატუსი:** live (11–15).

### 11. `/gvelebi/saxeoebebi` — გველის სახეობები საქართველოში

**სტატუსი:** `/gvelebi/saxeoebebi` live; EN `/en/snakes/species`. `#2` 301 აქ.

- [x] ცხრილი/ბარათები ყველა გველზე:
  - ფოტო
  - ქართული სახელი
  - სამეცნიერო სახელი
  - შხამიანია / არა
  - გავრცელება
  - ზომა
  - ჰაბიტატი
  - აქტიურობის პერიოდი (მხოლოდ თუ სტატშია; თორემ —)
- [x] ფილტრები: შხამიანი / უშხამო / ოჯახი
- [x] ყოველი რიგი → species page
- [x] `#2` 301 აქ (`/gvelebi/sakartvelos-gvelebi`)

### 12. `/gvelebi/shxamiani-gvelis-amocnoba` — როგორ განვასხვავოთ შხამიანი და არაშხამიანი გველი

**სტატუსი:** live; EN `/en/snakes/identify-venomous`.

- [x] informational intent გვერდი
- [x] ვიზუალური ნიშნები + გაფრთხილება, რომ წესი არ არის უნივერსალური
- [x] ლინკები: გიურზა → კავკასიური გველგესლა → სხვა შხამიანი
- [x] lookalike წყვილები (მცურავი vs გველგესლა, გველხოკერა vs გველი)

### 13. `/gvelebi/gvelis-nakbeni` — გველის ნაკბენი — რა უნდა გავაკეთოთ?

**სტატუსი:** live; EN `/en/snakes/bite`. საგანმანათლებლო; არა MedicalWebPage.

- [x] წყაროების სია: 112; ამ საიტის შხამიანი და ეზოს გიდები (იგივე ნაბიჯები). ჯანდაცვის/ტოქსიკოლოგიის პროტოკოლი არ დამატებულა — არ გამოგონილა
- [x] რა ქნა / რა არ ქნა (112, სიმშვიდე, უძრავი კიდური; არ გააჭრა / არ წოვო / არ გაიკეთო ტურნიკეტი / არა ალკოჰოლი)
- [x] როდის არის სასწრაფო — ნაკბენი ყოველთვის 112-ისთვის
- [x] ბმულები შხამიან სახეობებზე + `/gvelebi/gveli-ezoshi`
- [x] Educational disclaimer + FAQ schema მხოლოდ არსებულ Q&A-ზე; WebPage, არა medical advice schema
- [x] EN თარგმანი იგივე სიფრთხილით

### 14. `/gvelebi/gavrtseleba` — სად გვხვდება გველები საქართველოში?

**სტატუსი:** live; EN `/en/snakes/range`.

- [x] 12 რეგიონის სია + რუკა (გველებზე ფოკუსირებული ხედი)
- [x] თითო რეგიონში მხოლოდ დადასტურებული snake speciesIds (გველხოკერა ამოღებულია)
- [x] ბმული `/regions/[id]` და species pages
- [x] ხარვეზი ნაჩვენებია: ახალი გველები რეგიონებში ჯერ არ არის — არ გამოგონილა

### 15. `/gvelebi/didi-gvelebi` — საქართველოში გავრცელებული ყველაზე დიდი გველები

**სტატუსი:** live; EN `/en/snakes/largest`.

- [x] long-tail გიდი
- [x] გიურზა, მცურავები, ხვლიკიჭამია; გველხოკერა შედარებაშია — მითითებულია რომ ხვლიკია
- [x] ზომები მხოლოდ პროფილის სტატიდან

---

## ფაზა 3 — Lizard cluster (16–18)

**სტატუსი:** live (16–18).

### 16. `/xvlikebi/saxeoebebi` — საქართველოს ხვლიკების სახეობები

**სტატუსი:** `/xvlikebi/saxeoebebi` live; EN `/en/lizards/species`.

- [x] child of `/xvlikebi`
- [x] იგივე ცხრილის ველები, რაც snake index-ს
- [x] Darevskia გამოყოფილი ბლოკით (16 სახეობა)

### 17. `/xvlikebi/identifikacia` — როგორ განვასხვავოთ ხვლიკები საქართველოში

**სტატუსი:** live; EN `/en/lizards/identify`.

- [x] „ეს რა ხვლიკია?“ flow: ფოტო → ზომა → შეფერილობა → გავრცელება → მსგავსი სახეობები
- [x] Darevskia-სთვის გაფრთხილება: ფერი საკმარისი არ არის
- [x] ბმულები species pages-ზე

### 18. `/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba` — ხვლიკი თუ გველხოკერა

**სტატუსი:** live; EN `/en/lizards/lizard-or-glass-lizard`.

- [x] niche comparison გვერდი
- [x] გველხოკერა vs გველი vs ბოხმეჭა (`Anguis colchica`)
- [x] ორმხრივი ბმულები species pages-დან (გველხოკერა, ბოხმეჭა, მცურავები)

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
- [x] Species index კომპონენტი (ცხრილი #11; #16/#19/#23 იგივე UI-ს გამოიყენებს)
- [ ] Visual ID კომპონენტი (#12/#17/#22/#18)
- [ ] Lookalike ველი species frontmatter-ში
- [ ] Activity / reproduction / human-risk ველები (ან არსებული biology-ს მკაფიო სექციები)
- [ ] `getRelatedSpecies` — lookalikes + venom counterparts, არა მხოლოდ genus
- [ ] Breadcrumb schema + UI ყველა ახალ გვერდზე
- [x] sitemap-ში ახალი URL-ები; ძველები მხოლოდ 301, არა duplicate
- [x] Home / Nav / Footer / `HomeKnowledge` განახლება კლასტერებზე — Footer + hub cards + LanguageSwitcher
- [x] `#13` ნაკბენის გვერდზე **არ** მიეცეს medical advice schema — WebPage + FAQ მხოლოდ არსებულ Q&A-ზე; წყაროები: 112 და საიტის არსებული გიდები

---

## 30 გვერდის ინვენტარი (სწრაფი ხედი)

| # | გვერდი | სამიზნე URL | ტიპი | სტატუსი |
| --- | --- | --- | --- | --- |
| 1 | გველები საქართველოში | `/gvelebi` | Pillar | არის |
| 2 | საქართველოს გველების სახეობები | `/gvelebi/sakartvelos-gvelebi` | Guide | 301 → #11 |
| 3 | საქართველოს შხამიანი გველები | `/gvelebi/shxamiani-gvelebi` | Guide | არის |
| 4 | გიურზა | `/gvelebi/giurza` | Species | არის |
| 5 | ხვლიკები საქართველოში | `/xvlikebi` | Pillar | არის |
| 6 | ჯოჯო | `/xvlikebi/jojo` | Species | არის (thin აღარაა) |
| 7 | გველხოკერა | `/xvlikebi/gvelxokera` | Species | არის |
| 8 | კუები საქართველოში | `/kuebi` | Pillar | არის |
| 9 | ბაყაყები საქართველოში | `/amfibiebi/bayayi` | Guide | არის |
| 10 | ამფიბიები საქართველოში | `/amfibiebi` | Pillar | არის |
| 11 | გველის სახეობები | `/gvelebi/saxeoebebi` | Index | არის |
| 12 | შხამიანის ამოცნობა | `/gvelebi/shxamiani-gvelis-amocnoba` | Guide | არის |
| 13 | გველის ნაკბენი | `/gvelebi/gvelis-nakbeni` | Guide | არის |
| 14 | გავრცელება | `/gvelebi/gavrtseleba` | Guide | არის |
| 15 | დიდი გველები | `/gvelebi/didi-gvelebi` | Guide | არის |
| 16 | ხვლიკების სახეობები | `/xvlikebi/saxeoebebi` | Index | არის |
| 17 | ხვლიკების იდენტიფიკაცია | `/xvlikebi/identifikacia` | Guide | არის |
| 18 | ხვლიკი vs გველხოკერა | `/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba` | Guide | არის |
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
