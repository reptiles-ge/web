# reptiles.ge — Content & SEO Roadmap

სამუშაო ფაილი: topical authority + species knowledge graph, არა 30 SEO სტატია.

**მიმდინარე სამუშაო:** ფაზა 0–9 შესრულებულია (გვერდები/კლასტერები + პროფილები B–G + `regions.speciesIds` მხოლოდ Tarkhnishvili 2026 ლოკალიტეტით). 9H ფოტოების Georgia-field verification ღიაა.

**წესები**

- აუდიტის Volume-ები ფარდობითია — არ მივიჩნიოთ Google search volume-ად.
- reptiles.ge-ს ამჟამად პრაქტიკულად არ აქვს ორგანული ხილვადობა; მიზანი არის კლასტერები, შიდა ბმულები და სრული სახეობების პროფილები.
- რეგიონული გავრცელება არ გამოიგონოს. მხოლოდ დადასტურებული ჩანაწერები (Tarkhnishvili et al. 2026 + არსებული `regions.ts`).
- სამედიცინო გვერდები მხოლოდ სანდო/ოფიციალური წყაროებით.
- პროფილის ველი არ შეივსოს გამოგონილი ტექსტით. წყარო არ არის → ველი გამოტოვე ან დატოვე placeholder (კოდი მალავს).

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
| `/kuebi/saxeoebebi` | კუების ინდექსი | EN: `/en/turtles/species` |
| `/kuebi/xmelis-kuebi` | ხმელეთის კუები | EN: `/en/turtles/land` |
| `/kuebi/tsqlis-kuebi` | წყლის კუები | EN: `/en/turtles/freshwater` |
| `/kuebi/identifikacia` | კუების ამოცნობა | EN: `/en/turtles/identify` |
| `/amfibiebi/saxeoebebi` | ამფიბიების ინდექსი | EN: `/en/amphibians/species` |
| `/amfibiebi/bayayi/saxeoebebi` | ბაყაყების ინდექსი | EN: `/en/amphibians/frogs/species`; `#9` გიდი რჩება |
| `/amfibiebi/tritoni-salamandra` | ტრიტონები / სალამანდრები | EN: `/en/amphibians/newts` |
| `/konservacia` | კონსერვაციის ჰაბი | EN: `/en/conservation` |
| `/konservacia/witeli-nusxa-qvewarmavlebi` | წითელი ნუსხა — რეპტილიები | პროფილის ციტატები, არა განკარგულება |
| `/konservacia/witeli-nusxa-amfibiebi` | წითელი ნუსხა — ამფიბიები | ხარვეზი ღიად |
| `/konservacia/ishviati-qvewarmavlebi` | იშვიათი ქვეწარმავლები | სამი კალათა |
| `/konservacia/endemuri-qvewarmavlebi` | ენდემური ტაქსონები | მხოლოდ პროფილის ტექსტი |
| `/species` | ატლასი / კატალოგი | |
| `/gvelebi/giurza` (და ანალოგიურად) | 68 სახეობის პროფილი | KA ქართული slug; EN სამეცნიერო; ძველი `/species/[id]` 301 |
| `/regions` `/regions/[id]` | 12 რეგიონი | თითქმის მხოლოდ გველები + გველხოკერა |
| `/about` `/contact` | საიტი | |

**68 სახეობა ჩეკლისტით დაბლოკილია** (12 ამფიბია + 56 ქვეწარმავალი). პროფილები არსებობს, მაგრამ ბევრი thin/genericა (განსაკუთრებით ახალი taxa: Darevskia, ამფიბიები, კუები). რეგიონული რუკა ახალ სახეობებზე ხშირად ცარიელია — ეს განზრახაა, სანამ წყარო არ ადასტურებს.

**URL (გადაწყვეტილია)**

KA cluster URL არის canonical; EN ინარჩუნებს ინგლისურ/სამეცნიერო slug-ს. ძველი `/species/{id}` და ინგლისური KA path-ები 301-ით მიდის ახალ მისამართზე.

**დუბლი გვერდები**

- `#2` `/gvelebi/sakartvelos-gvelebi` vs `#11` `/gvelebi/saxeoebebi` — გაერთიანდება `#11`-ში. ახლა კატალოგი `/gvelebi`-ზეა; `#2` ცალკე არ იქმნება.
- `#9` `/amfibiebi/bayayi` vs `#24` `/amfibiebi/bayayi/saxeoebebi` — `#9` Anura გიდი; `#24` ინდექს-ცხრილი. ორივე live; 301 არა.

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
- [x] ძლიერი ბმული `#18`-ზე — `getSpeciesGuideLinks` პროფილის ბანერზე (გველხოკერა, ბოხმეჭა, მცურავები)
- [x] იდენტიფიკაცია: ქუთუთოები, ყურის ხვრელი, არა გველი

### 8. `/kuebi` — კუები საქართველოში (Pillar)

**სტატუსი:** `/kuebi` live.

- [x] URL `/kuebi` + 301
- [x] child: ადგილობრივი vs ინტროდუცირებული; ხმელეთის/წყლის ინდექსები და ამოცნობა — ფაზა 4 live
- [x] ინტროდუცირებული *Trachemys scripta* ცალკე აღინიშნოს

### 9. `/amfibiebi/bayayi` — ბაყაყები საქართველოში (Guide)

**სტატუსი:** `/amfibiebi/bayayi` live (EN `/en/amphibians/frogs`).

- [x] გიდი ბაყაყებზე (Anura), არა მთელ ამფიბიებზე
- [x] ბმულები სახეობებზე: ტბორის ბაყაყი, მცირეაზიური ბაყაყი, ვასაკები, გომბეშოები
- [x] ბმული `#24` სახეობების ინდექსზე (`/amfibiebi/bayayi/saxeoebebi`); `#9` რჩება გიდად, 301 არა

### 10. `/amfibiebi` — ამფიბიები საქართველოში (Pillar)

**სტატუსი:** `/amfibiebi` live.

- [x] URL `/amfibiebi` + 301
- [x] child: ბაყაყები გიდი + Anura / Caudata სექციები
- [x] 12 სახეობის ჩარჩო (Tarkhnishvili et al. 2026)

### 10b. 68-ვე species page-ის სრული შევსება

ცალკე დიდი სამუშაო — იხ. **Species template** და **Species backlog**. ფაზა 1-ში მინიმუმი:

- [x] გიურზა, ჯოჯო, გველხოკერა — reference (ჯოჯო წყაროს ფარგლებში; რეგიონი/ზომა არ გამოგონილა)
- [x] ყველა შხამიანი გველი — სრული (გიდი + პროფილები 8A)
- [x] დანარჩენ 65-ზე: placeholder/generic ტექსტის ამოცნობა და რიგით შევსება (ფაზა 8A–8F)

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

**სტატუსი:** live; EN `/en/turtles/species`.

- [x] 4 სახეობის ინდექსი: *Testudo graeca*, *Emys orbicularis*, *Mauremys caspica*, *Trachemys scripta*

### 20. `/kuebi/xmelis-kuebi` — ხმელეთის კუები საქართველოში

**სტატუსი:** live; EN `/en/turtles/land`.

- [x] ძირითადად ხმელთაშუაზღვის კუ
- [x] ჰაბიტატი პროფილიდან; რეგიონები არ გამოგონილა (რუკა ცარიელია); კონსერვაცია generic — ეროვნული RL პროფილზე არაა

### 21. `/kuebi/tsqlis-kuebi` — წყლის კუები საქართველოში

**სტატუსი:** live; EN `/en/turtles/freshwater`.

- [x] ჭაობის კუ, კასპიური კუ, წითელყურა (ინტროდუცირებული)

### 22. `/kuebi/identifikacia` — როგორ განვასხვავოთ საქართველოს კუების სახეობები

**სტატუსი:** live; EN `/en/turtles/identify`.

- [x] visual ID: ხმელეთის vs წყლის, მშობლიური vs ინტროდუცირებული

---

## ფაზა 5 — Amphibian cluster (23–25)

### 23. `/amfibiebi/saxeoebebi` — საქართველოს ამფიბიების სახეობები

**სტატუსი:** live; EN `/en/amphibians/species`.

- [x] 12 სახეობის ინდექსი (Anura + Caudata)

### 24. `/amfibiebi/bayayi/saxeoebebi` — საქართველოს ბაყაყების სახეობები

**სტატუსი:** live; EN `/en/amphibians/frogs/species`. `#9` რჩება გიდად; 301 არა.

- [x] Anura მხოლოდ
- [x] `#9` გიდი + `#24` ცხრილი; overlap-ზე 301 არ გაკეთდა

### 25. `/amfibiebi/tritoni-salamandra` — ტრიტონები და სალამანდრები საქართველოში

**სტატუსი:** live; EN `/en/amphibians/newts`.

- [x] *Mertensiella caucasica*, *Lissotriton lantzi*, *Ommatotriton ophryticus*, *Triturus karelinii*
- [x] niche / authority გვერდი; ენდემი მხოლოდ პროფილის location-იდან (Mertensiella); ეროვნული RL არ გამოგონილა

---

## ფაზა 6 — Conservation cluster (26–29)

წყაროები: საქართველოს წითელი ნუსხა (ოფიციალური), IUCN, Tarkhnishvili et al. 2026. სტატუსი არ გამოიგონოს.

**ჰაბი:** `/konservacia` (EN `/en/conservation`) — ოთხი child გიდის კარიბჭე.

### 26. `/konservacia/witeli-nusxa-qvewarmavlebi` — საქართველოს წითელი ნუსხის ქვეწარმავლები

**სტატუსი:** live; EN `/en/conservation/red-list-reptiles`.

- [x] ატლასის პროფილებში ციტირებული სახეობები (kaznakovi, dinniki, transcaucasiana) + ბმული პროფილებზე
- [x] განსხვავება IUCN vs ეროვნული სტატუსი; darevskii CR პროფილზეა, ეროვნული ციტატა არა — სიაში არაა
- [x] გვერდი ოფიციალურ განკარგულებას არ ცვლის

### 27. `/konservacia/witeli-nusxa-amfibiebi` — საქართველოს წითელი ნუსხის ამფიბიები

**სტატუსი:** live; EN `/en/conservation/red-list-amphibians`.

- [x] იგივე სტრუქტურა; ეროვნული ციტატა პროფილებზე არ არის — ხარვეზი ღიადაა
- [x] ნაჩვენებია ენდემი (Mertensiella) და კანდიდატი ამფიბიები პროფილიდან

### 28. `/konservacia/ishviati-qvewarmavlebi` — იშვიათი ქვეწარმავლები საქართველოში

**სტატუსი:** live; EN `/en/conservation/rare-reptiles`.

- [x] არ აურიოს წითელ ნუსხასთან — სამი კალათა
- [x] კრიტერიუმი: ეროვნული RL ციტატა, IUCN საფრთხე პროფილზე, ჩეკლისტის კანდიდატი

### 29. `/konservacia/endemuri-qvewarmavlebi` — საქართველოს ენდემური ქვეწარმავლები

**სტატუსი:** live; EN `/en/conservation/endemic-reptiles`.

- [x] authority-building
- [x] მხოლოდ ტაქსონები, რომლებიც პროფილში ენდემურადაა მითითებული (3 გველგესლა + Mertensiella როგორც ამფიბია)
- [x] Tarkhnishvili et al. 2026 ციტირებულია, არა გადაწერილი

---

## ფაზა 7 — რეგიონები (#30)

### 30. `/regions` — საქართველოს ქვეწარმავლები რეგიონების მიხედვით

**სტატუსი:** ინდექსი და 12 რეგიონის გვერდი არსებობს. ფაუნა ჯერ თითქმის მხოლოდ გველებია — data არ გამოგონილა.

მაგალითი (მხოლოდ არსებული data, არა სრული ფაუნა):

- კახეთი — გიურზა, … (ხვლიკები/კუები ჯერ არ არის მიბმული)
- აჭარა — კავკასიური გველგესლა, …
- სამეგრელო — …
- მცხეთა-მთიანეთი — …

- [x] `/regions` cluster hub: ბმულები გველების გავრცელებაზე, ინდექსებზე, კონსერვაციაზე
- [x] თითო რეგიონის intro / ჰაბიტატები / შხამიანი / FAQ არსებული `regionContent`-ით; data-gap შენიშვნა პროფილზე
- [x] **Data gap:** რეგიონებში არ შედის ამფიბიები, კუები, თითქმის ყველა ხვლიკი (გარდა გველხოკერასი) და ახალი გველები. შევსება მხოლოდ წყაროთი.
- [x] შემდეგი ეტაპი (არა ახლა, თუ data არაა): რეგიონი → მუნიციპალიტეტი → სახეობა. ცარიელი მუნიციპალიტეტის გვერდები არ აიგო.

---

## ფაზა 8 — Species profiles B–G (~65 პროფილი)

**სტატუსი:** შესრულებულია (8A–8F). A reference რჩება. შაბლონი `გვერდი აჯამებს…` ამოღებულია.

**მიზანი:** თითოეული სახეობა იქცეს ატლასის აქტივად (როგორც გიურზა), არა 1,000-სიტყვიან generic სტატიად. კლასტერის გვერდები (#11–29) უკვე ამ პროფილებს ეყრდნობა — ინდექსის ცარიელი უჯრა, კონსერვაციის სია და ID გიდი პროფილის ველებიდან ივსება.

### ფაილები / პაიპლაინი

| რას ვაკეთებთ | სად |
| --- | --- |
| კონტენტი | `src/content/species/{id}/ka.mdx` **და** `en.mdx` ერთად, სინქრონულად |
| კომპილაცია | `npm run species:compile` → `src/data/species.generated.ts` (`predev`/`prebuild`-იც იგივეს აკეთებს) |
| Lookalike რუკა (ახლა) | `src/lib/speciesRoutes.ts` → `LOOKALIKES` (ორმხრივი). Frontmatter ველი ჯერ არ არის — ნუ დაამატებ ახალ YAML გასაღებს compile-ის გარეშე |
| Activity stat | `stats` მასივში label: `აქტიურობა` / `Activity` (იხ. `speciesContent.ts`). წყარო არაა → არ დაამატო |
| რეგიონული რუკა პროფილზე | არ იწერება MDX-ში; ჩანს მხოლოდ თუ ID არის `src/data/regions.ts` `speciesIds`-ში → **ფაზა 9** |
| ეტალონი | `macrovipera-lebetina`, `paralaudakia-caucasia`, `pseudopus-apodus` |

ნუ დაარედაქტირებ `species.generated.ts` ხელით.

### Definition of Done — ერთი პროფილი

KA+EN ორივე. Checkbox მხოლოდ მაშინ, როცა ორივე ენა გაკეთებულია.

- [ ] `overview` სახეობის-სპეციფიკურია; აღარ არის „დაფიქსირებულია ჩეკლისტში… გვერდი აჯამებს…“ შაბლონი
- [ ] `description` უნიკალური ერთი წინადადება (H1/meta-სთვის)
- [ ] `location` საქართველოს კონტექსტი მხოლოდ წყაროთი; წყარო არაა → დატოვე ზოგადი, **ნუ** ჩაწერ 12 რეგიონს
- [ ] `habitat` / `diet` / `behavior` generic წინადადებები ჩანაცვლებულია ან ამოღებულია
- [ ] `conservation`: generic „საქართველოში დაფიქსირებულია…“ ან წაშალე, ან ჩაანაცვლე IUCN/ეროვნული ციტატით. **ნუ** ჩაწერ წითელ ნუსხას, თუ პროფილს/წყაროს არ აქვს
- [ ] `stats.სიგრძე` კონკრეტული რიცხვი წყაროთი, ან ველი გამოტოვებული (placeholder მალულია)
- [ ] `identification.traits` რეალური ნიშნები — არა მხოლოდ „checklist-confirmed“ / ოჯახის სახელი
- [ ] FAQ: 3–5 რეალური კითხვა (გვხვდება? შხამი? რით განსხვავდება lookalike-ისგან?). ცარიელი FAQPage არა
- [ ] `sources`: Tarkhnishvili DOI რჩება; IUCN **species-specific URL** თუ არსებობს (`/details/…` ან species page), არა მხოლოდ `https://www.iucnredlist.org/`
- [ ] candidate taxa: ჩეკლისტის კანდიდატი შენიშვნა რჩება; ნუ „დაამტკიცებ“ სახეობას
- [ ] lookalikes: თუ წყარო/ეტალონი ადასტურებს წყვილს → დაამატე `LOOKALIKES`-ში (ორმხრივად)
- [ ] `danger`: Harmless/Moderate/High უკვე არის; ადამიანისთვის რისკი დაწერე overview/FAQ-ში მხოლოდ წყაროთი (განსაკუთრებით Malpolon rear-fanged)
- [ ] ფოტო: არსებული CDN რჩება; `photoConfidence` / Georgia-field verification — ფაზა 9H, არა ამ ტალღის ბლოკერი

**არ შეივსოს გამოგონილი ტექსტით.** უმჯობესია ცარიელი ველი, ვიდრე გამოგონილი ზომა, რეგიონი ან IUCN კატეგორია.

### ტალღები (იმპლემენტაციის რიგი)

ერთ ტალღაში დაასრულე სახეობები, განაახლე ამ ფაილის checkbox-ები, შემდეგ გადადი შემდეგ ტალღაზე. B-ის ნაწილი (kaznakovi, dinniki, transcaucasiana, darevskii) უკვე უფრო სავსეა ვიდრე Darevskia generic — მაინც გაიარე DoD გიურზასთან შედარებით; ნუ გამოტოვებ აუდიტის გარეშე.

| ტალღა | ჯგუფი | IDs | შენიშვნა |
| --- | --- | --- | --- |
| **8A** | B — შხამიანი გველები | `vipera-kaznakovi` `vipera-dinniki` `vipera-transcaucasiana` `vipera-darevskii` `vipera-renardi` `malpolon-insignitus` | რისკი ზუსტად; renardi სახელი გადაამოწმე; Malpolon = Moderate/rear-fanged, არა გიურზა |
| **8B** | C — lookalike გველები | `natrix-natrix` `natrix-tessellata` `zamenis-longissimus` `zamenis-hohenackeri` `elaphe-urartica` `elaphe-dione` `dolichophis-schmidti` `dolichophis-caspius` `platyceps-najadum` `telescopus-fallax` `coronella-austriaca` `hemorrhois-ravergieri` `eirenis-modestus` `eirenis-collaris` `xerotyphlops-vermicularis` `eryx-jaculus` | ორმხრივი lookalike + `#12`/`#18` ბმულები, სადაც რელევანტურია |
| **8C** | D — კუები (4) | `testudo-graeca` `emys-orbicularis` `mauremys-caspica` `trachemys-scripta` | ხმელეთი vs წყალი; scripta = შემოტანილი. კვებავს `#19–22` |
| **8D** | E — ამფიბიები (12) | Caudata: `mertensiella-caucasica` `lissotriton-lantzi` `ommatotriton-ophryticus` `triturus-karelinii` · Anura: `pelobates-syriacus` `pelodytes-caucasicus` `bufotes-viridis` `bufo-verrucosissimus` `hyla-orientalis` `hyla-savignyi` `rana-macrocnemis` `pelophylax-ridibundus` | Mertensiella ენდემი მხოლოდ თუ პროფილი/წყარო წერს; ნუ გამოიგონებ ეროვნულ RL. კვებავს `#23–25`, `#27` |
| **8E** | F — ხვლიკები, არა-Darevskia | `tenuidactylus-caspius` `anguis-colchica` `eumeces-schneiderii` `ablepharus-pannonicus` `eremias-velox` `eremias-arguta` `ophisops-elegans` `lacerta-agilis` `lacerta-strigata` `lacerta-media` `phoenicolacerta-laevis` | Anguis = კანდიდატი; გველხოკერასთან lookalike უკვე `#18`-ზეა |
| **8F** | G — Darevskia (16) | `darevskia-adjarica` `darevskia-alpina` `darevskia-armeniaca` `darevskia-brauneri` `darevskia-caucasica` `darevskia-clarkorum` `darevskia-daghestanica` `darevskia-dahli` `darevskia-derjugini` `darevskia-mixta` `darevskia-portschinskii` `darevskia-praticola` `darevskia-pontica` `darevskia-obscura` `darevskia-raddei` `darevskia-valentini` | **არ აირიოს.** ფერი საკმარისი არ არის. რეგიონი მხოლოდ წყაროთი. კანდიდატი შენიშვნა რჩება — **გაკეთებულია** |

ტალღის ბოლოს: `npx tsc --noEmit` საჭიროებისამებრ; კონტენტისთვის საკმარისია compile + checkbox ამ ფაილში.

---

## ფაზა 9 — რეგიონული `speciesIds` + data (H)

**სტატუსი:** `speciesIds` გაფართოებულია Tarkhnishvili et al. 2026-ის ექსპლიციტი ლოკალიტეტებით (ბარკოდი, ფიგურის წარწერა, taxonomic remark). ჰაბიტატიდან არ შევსებულა. 9H ფოტოები ღიაა.

**მიზანი:** სახეობის რუკა და რეგიონის გვერდი აჩვენებს რეალურ ჩანაწერს. ახლა თითქმის მხოლოდ გველები + გველხოკერაა. ამფიბიები, კუები, უმეტესი ხვლიკი და ახალი ჩეკლისტური გველები **არ** უნდა დაემატოს ჰაბიტატის გამოცნობით.

### ფაილები

| რას ვაკეთებთ | სად |
| --- | --- |
| სახეობა → რეგიონი | `src/data/regions.ts` → თითო `Region.speciesIds` |
| რეგიონის FAQ/overview | `src/data/regionContent.ts` — **მხოლოდ** თუ ახალი taxa რეალურად დაემატა; ნუ დაწერ „აქ არის ყველა ხვლიკი“ |
| პროფილის `location` | MDX (ფაზა 8) — ტექსტი; რუკა მაინც `speciesIds`-იდანაა |

12 რეგიონის `id`: `abkhazia` `samegrelo` `guria` `adjara` `imereti` `racha` `samtskhe-javakheti` `mtskheta-mtianeti` `shida-kartli` `kvemo-kartli` `kakheti` `tbilisi`.

### როდის შეიძლება ID-ის დამატება

ჩაამატე `speciesIds`-ში **მხოლოდ** თუ ერთ-ერთი პირდაპირ ასახელებს ამ ადმინისტრაციულ ერთეულს (ან 1:1 ექვივალენტს, მაგ. ჯავახეთი → `samtskhe-javakheti`):

1. Tarkhnishvili et al. 2026 (DOI `10.3897/caucasiana.5.e189214`) — locality / region remark
2. Iankoshvili & Tarkhnishvili 2021 — თუ ჩეკლისტი მას ციტირებს კონკრეტულ ჩანაწერზე
3. უკვე დაწერილი პროფილის `location`/`habitat`, თუ იქ უკვე წერია რეგიონი (მაგ. darevskii: სამცხე—ჯავახეთი)

**არ ჩაამატო თუ:**

- მხოლოდ „საქართველო“ / „კავკასია“ / „კოლხეთი“ ზოგადად (კოლხეთი ≠ ყველა დასავლეთის რეგიონი)
- ჰაბიტატის ტიპი („ტენიანი ტყე“ → აჭარა+გურია+…)
- IUCN გლობალური range, GBIF წერტილი საქართველოს გარეთ, ან „ტიპიური“ არეალი ლიტერატურიდან ადმინ-ერთეულის გარეშე
- მეზობელი რეგიონის სია („აფხაზეთშია → სამეგრელოშიც იქნება“)

არაა ჩანაწერი → სია რჩება ცარიელი. ცარიელი მუნიციპალიტეტის გვერდები **არ** აიგოს.

### H — სხვა data (არა პროზა)

- [x] `speciesIds` გაფართოება ზემოთ წესით; პრიორიტეტი: B გველები, შემდეგ კუები/ამფიბიები თუ წყაროა, Darevskia ბოლოს და მხოლოდ მკაფიო locality-ზე
- [x] generic conservation ჩანაცვლება/წაშლა — კეთდება ფაზა 8-ის DoD-ით, აქ მხოლოდ აუდიტი
- [ ] `photoConfidence`: ჩეკლისტში ბევრი `verified`-ია; CDN ხშირად generic/არა-საქართველოა. პოლიტიკა: დატოვე ფოტო + კრედიტი, ან პლეისჰოლდერი — ნუ მონიშნავ Georgia-field-ად მტკიცებულების გარეშე
- [x] candidate taxa შენიშვნა პროფილზე (Tarkhnishvili 2026) — ფაზა 8 DoD
- [x] `Macrovipera lebetinus` vs slug `macrovipera-lebetina` — გიურზას პროფილზე უკვე ახსნილია; სხვა გვერდზე ნუ გააორმაგებ წინააღმდეგობრივად

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

ველების სპეციფიკაცია = ფაზა 8 DoD. ქვემოთ checklist იმპლემენტაციის ტალღებისთვის (8A–8F).

### Species backlog — შევსების რიგი

**A. Reference (ფაზა 1)**

- [x] `macrovipera-lebetina` — გიურზა
- [x] `paralaudakia-caucasia` — ჯოჯო
- [x] `pseudopus-apodus` — გველხოკერა

**B. შხამიანი გველები** — ტალღა **8A**

- [x] `vipera-kaznakovi` — კავკასიური გველგესლა
- [x] `vipera-dinniki` — დინიკის გველგესლა
- [x] `vipera-transcaucasiana` — ცხვირრქოსანი გველგესლა
- [x] `vipera-darevskii` — დარევსკის გველგესლა
- [x] `vipera-renardi` — ველის გველგესლა (პროფილის სახელი; ჩეკლისტი: სომხური გველგესლა)
- [x] `malpolon-insignitus` — Moderate/rear-fanged; კანდიდატი; არა გიურზა

**C. ხშირი/lookalike გველები** — ტალღა **8B**

- [x] `natrix-natrix` `natrix-tessellata`
- [x] `zamenis-longissimus` `zamenis-hohenackeri`
- [x] `elaphe-urartica` `elaphe-dione`
- [x] `dolichophis-schmidti` `dolichophis-caspius`
- [x] `platyceps-najadum` `telescopus-fallax` `coronella-austriaca`
- [x] `hemorrhois-ravergieri` `eirenis-modestus` `eirenis-collaris`
- [x] `xerotyphlops-vermicularis` `eryx-jaculus`

**D. კუები (4)** — ტალღა **8C**

- [x] `testudo-graeca` `emys-orbicularis` `mauremys-caspica` `trachemys-scripta`

**E. ამფიბიები (12)** — ტალღა **8D**

- [x] სალამანდრა/ტრიტონები: `mertensiella-caucasica` `lissotriton-lantzi` `ommatotriton-ophryticus` `triturus-karelinii`
- [x] ბაყაყები/გომბეშოები/ვასაკები: `pelobates-syriacus` `pelodytes-caucasicus` `bufotes-viridis` `bufo-verrucosissimus` `hyla-orientalis` `hyla-savignyi` `rana-macrocnemis` `pelophylax-ridibundus`

**F. ხვლიკები — არა-Darevskia** — ტალღა **8E**

- [x] `tenuidactylus-caspius` `anguis-colchica` `eumeces-schneiderii` `ablepharus-pannonicus`
- [x] `eremias-velox` `eremias-arguta` `ophisops-elegans`
- [x] `lacerta-agilis` `lacerta-strigata` `lacerta-media` `phoenicolacerta-laevis`

**G. Darevskia (16)** — ტალღა **8F** — იდენტიფიკაცია + რეგიონი კრიტიკულია; არ აირიოს ერთმანეთში

- [x] `darevskia-adjarica` `darevskia-alpina` `darevskia-armeniaca` `darevskia-brauneri`
- [x] `darevskia-caucasica` `darevskia-clarkorum` `darevskia-daghestanica` `darevskia-dahli`
- [x] `darevskia-derjugini` `darevskia-mixta` `darevskia-portschinskii` `darevskia-praticola`
- [x] `darevskia-pontica` `darevskia-obscura` `darevskia-raddei` `darevskia-valentini`

**H. Data, არა პროზა** — იხ. **ფაზა 9** (იმპლემენტაციის წესები იქაა).

- [x] რეგიონული `speciesIds` გაფართოება მხოლოდ წყაროთი (Tarkhnishvili 2026 ლოკალიტეტი/ბარკოდი/ფიგურა; არა ჰაბიტატის გამოცნობა)
- [x] generic conservation („საქართველოში დაფიქსირებულია…“) ჩანაცვლება ან წაშლა
- [ ] `photoConfidence` გადაამოწმე — ჩეკლისტში ყველა `verified`-ია, რეალურად ბევრი placeholder/generic CDN შეიძლება იყოს
- [x] candidate taxa შენიშვნა პროფილზე (Tarkhnishvili 2026)
- [x] `Macrovipera lebetinus` vs slug `macrovipera-lebetina` — საჯაროდ ახსნილი (გიურზას პროფილზე არის)

---

## არქიტექტურა / კოდი — რაც გასაკეთებელია

ესენი roadmap-ის გვერდების პარალელურად იკვრება.

- [x] Group hub path-ები `groupHubs.ts`-დან ქართულ slug-ებზე; locale-aware path EN-სთვის
- [x] `next.config.ts` 301 რუკა ყველა ძველი URL-ისთვის (`/snakes`, `/lizards`, `/venomous-snakes`, …)
- [x] Species canonical URL helper: cluster + ქართული slug (და სამეცნიერო fallback)
- [x] Cluster child routes: არა ბლოგის `/blog/...`, არამედ `/gvelebi/...`, `/xvlikebi/...`, `/kuebi/...`, `/amfibiebi/...` (პირველი child: `/amfibiebi/bayayi`)
- [x] Species index კომპონენტი (ცხრილი #11; #16/#19/#23 იგივე UI-ს გამოიყენებს)
- [x] Visual ID კომპონენტი (#12/#17/#22/#18)
- [ ] Lookalike ველი species frontmatter-ში — არ დამატებულა; `LOOKALIKES` `speciesRoutes.ts`-ში გაფართოვდა
- [x] Activity / reproduction / human-risk — ფაზა 8: `stats` + overview/FAQ; ახალი schema არ დამატებულა
- [x] `getRelatedSpecies` — lookalikes + venom counterparts; scoring იყენებს გაფართოებულ `LOOKALIKES`-ს
- [x] Breadcrumb schema + UI ყველა ახალ გვერდზე
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
| 19 | კუების სახეობები | `/kuebi/saxeoebebi` | Index | არის |
| 20 | ხმელეთის კუები | `/kuebi/xmelis-kuebi` | Guide | არის |
| 21 | წყლის კუები | `/kuebi/tsqlis-kuebi` | Guide | არის |
| 22 | კუების იდენტიფიკაცია | `/kuebi/identifikacia` | Guide | არის |
| 23 | ამფიბიების სახეობები | `/amfibiebi/saxeoebebi` | Index | არის |
| 24 | ბაყაყების სახეობები | `/amfibiebi/bayayi/saxeoebebi` | Index | არის |
| 25 | ტრიტონები და სალამანდრები | `/amfibiebi/tritoni-salamandra` | Guide | არის |
| 26 | წითელი ნუსხა — რეპტილიები | `/konservacia/witeli-nusxa-qvewarmavlebi` | Guide | არის |
| 27 | წითელი ნუსხა — ამფიბიები | `/konservacia/witeli-nusxa-amfibiebi` | Guide | არის (ხარვეზი ღიად) |
| 28 | იშვიათი ქვეწარმავლები | `/konservacia/ishviati-qvewarmavlebi` | Guide | არის |
| 29 | ენდემური ქვეწარმავლები | `/konservacia/endemuri-qvewarmavlebi` | Guide | არის |
| 30 | რეგიონების მიხედვით | `/regions` | Hub | არის; ფაუნა incomplete (არ გამოგონილა) |

პლუს: **ფაზა 8** — 65 პროფილი (B–G) შესრულებულია; **ფაზა 9** — `speciesIds` მხოლოდ წყაროთი, შესრულებულია (რუკა კვლავ incomplete იქ, სადაც locality არაა). 9H ფოტოები ღიაა. A + ფაზა 0–7 დასრულებულია.

---

## წყაროები (კონტენტისთვის, არა volume-ისთვის)

- Tarkhnishvili et al. 2026 — annotated checklist, DNA barcoding, taxonomic remarks. DOI: `10.3897/caucasiana.5.e189214`
- Ilia State University Georgian Biodiversity Database — Reptilia catalogue / conservation status
- IUCN Red List — გლობალური სტატუსი, სახეობა-სახეობაზე კონკრეტული URL
- საქართველოს წითელი ნუსხა — ეროვნული სტატუსი (#26–27)
- APA / დაცული ტერიტორიები — მხოლოდ კონკრეტული პარკის კონტექსტში, არა მთელი ქვეყნის ფაუნის განზოგადება

---

## როგორ ვიმუშაოთ ამ ფაილზე

1. ფაზა 0 URL გადაწყვეტილება (canonical + 301) — ამის გარეშე ახალი გვერდები ორმაგდება. **გაკეთებულია.**
2. ფაზა 1: 4 pillar + შხამიანი გიდი + 3 species reference. **გაკეთებულია.**
3. `#11` snake index — knowledge graph-ის ხერხემალი. **გაკეთებულია.**
4. დანარჩენი cluster child-ები: იდენტიფიკაცია / ნაკბენი / რეგიონები / კონსერვაცია. **ფაზა 2–7 გაკეთებულია.**
5. **ფაზა 8** ტალღა 8A → 8F (პროფილები B–G). **გაკეთებულია.**
6. **ფაზა 9** — `regions.ts` `speciesIds` მხოლოდ წყაროთი. **გაკეთებულია** (ექსპლიციტი ლოკალიტეტი; რუკა კვლავ incomplete იქ, სადაც ნაშრომი ადმინ-ერთეულს არ ასახელებს).
7. ფოტოების Georgia-field verification — 9H, ღიაა.

Checkbox-ები ამ ფაილში იცვლება სამუშაოს მიმდინარეობისას.
