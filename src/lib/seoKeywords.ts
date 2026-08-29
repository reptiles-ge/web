import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

const SPECIES_ALIASES: Record<string, { ka: string[]; en: string[] }> = {
  "eremias-arguta": {
    ka: ["ფსვენი", "სტეპის ფსვენი", "Eremias arguta transcaucasica"],
    en: [
      "steppe runner",
      "steppe racerunner",
      "racerunner",
      "Eremias arguta transcaucasica",
    ],
  },
  "ablepharus-pannonicus": {
    ka: ["აზიური შიშველთვალა", "შიშველთვალა"],
    en: [
      "Asian snake-eyed skink",
      "lidless skink",
      "snake-eyed skink",
    ],
  },
  "vipera-dinniki": {
    ka: ["დინიკის გველგესლა", "Pelias dinniki"],
    en: ["Dinnik's viper", "Caucasus subalpine viper", "Pelias dinniki"],
  },
  "malpolon-insignitus": {
    ka: [
      "ხვლიკიჭამია გველი",
      "ხვლიკიჭამია",
      "Malpolon monspessulanus",
    ],
    en: [
      "Montpellier snake",
      "eastern Montpellier snake",
      "Malpolon monspessulanus",
    ],
  },
  "macrovipera-lebetina": {
    ka: [
      "გიურზა",
      "გიუზა",
      "giurza",
      "Macrovipera lebetina",
      "Vipera lebetina",
    ],
    en: [
      "Levantine viper",
      "blunt-nosed viper",
      "giurza",
      "gyurza",
      "Macrovipera lebetina",
    ],
  },
  "vipera-kaznakovi": {
    ka: [
      "კავკასიური გველგესლა",
      "გველგესლა",
      "შხამიანი გველგესლა",
      "Pelias kaznakovi",
    ],
    en: [
      "Caucasus viper",
      "Caucasian viper",
      "Kaznakov's viper",
      "venomous viper Georgia",
      "Pelias kaznakovi",
    ],
  },
  "vipera-transcaucasiana": {
    ka: [
      "ცხვირრქოსანი გველგესლა",
      "გველგესლა",
      "შხამიანი გველგესლა",
      "Vipera ammodytes",
      "Vipera transcaucasiana",
    ],
    en: [
      "Transcaucasian long-nosed viper",
      "nose-horned viper",
      "Transcaucasian sand viper",
      "venomous viper Georgia",
      "Vipera transcaucasiana",
      "Vipera ammodytes transcaucasiana",
    ],
  },
  "vipera-darevskii": {
    ka: ["დარევსკის გველგესლა", "გველგესლა"],
    en: ["Darevsky's viper"],
  },
  "vipera-renardi": {
    ka: ["ველის გველგესლა", "სტეპის გველგესლა", "გველგესლა"],
    en: ["eastern steppe viper", "steppe viper"],
  },
  "testudo-graeca": {
    ka: [
      "ხმელეთის კუ",
      "ხმელთაშუაზღვის კუ",
      "Testudo graeca ibera",
    ],
    en: [
      "Greek tortoise",
      "spur-thighed tortoise",
      "Mediterranean tortoise",
      "Testudo graeca ibera",
    ],
  },
  "lacerta-strigata": {
    ka: [],
    en: [
      "Caspian green lizard",
      "Caucasus emerald lizard",
      "five-streaked lizard",
      "striated lizard",
    ],
  },
  "lacerta-media": {
    ka: ["Lacerta trilineata media"],
    en: [
      "medium lizard",
      "three-lined lizard",
      "Levant green lizard",
      "Lacerta trilineata media",
    ],
  },
  "darevskia-pontica": {
    ka: [
      "მდელოს ხვლიკი",
      "პონტური მდელოს ხვლიკი",
      "Lacerta praticola pontica",
      "Darevskia praticola pontica",
    ],
    en: [
      "Pontic lizard",
      "meadow lizard",
      "Colchic meadow lizard",
      "Lacerta praticola pontica",
      "Darevskia praticola pontica",
    ],
  },
  "darevskia-derjugini": {
    ka: [
      "კავკასიური ტყის ხვლიკი",
      "ართვინის ხვლიკი",
      "Lacerta derjugini",
    ],
    en: [
      "Artvin lizard",
      "Artwin lizard",
      "Derjugin's lizard",
      "Lacerta derjugini",
    ],
  },
  "paralaudakia-caucasia": {
    ka: ["კავკასიური ჯოჯო", "Laudakia caucasia", "Agama caucasica"],
    en: [
      "Caucasian rock agama",
      "Laudakia caucasia",
      "Agama caucasica",
      "Stellio caucasius",
    ],
  },
  "pseudopus-apodus": {
    ka: ["გველხოკერა"],
    en: ["European glass lizard", "sheltopusik"],
  },
  "darevskia-daghestanica": {
    ka: [
      "დაღესტნური კლდის ხვლიკი",
      "Lacerta daghestanica",
      "Lacerta caucasica daghestanica",
    ],
    en: [
      "Dagestan lizard",
      "Dagestan rock lizard",
      "Lacerta daghestanica",
      "Lacerta caucasica daghestanica",
    ],
  },
  "darevskia-dahli": {
    ka: ["Lacerta dahli", "Lacerta saxicola dahli"],
    en: [
      "Dahl's lizard",
      "Lacerta dahli",
      "Lacerta saxicola dahli",
    ],
  },
  "darevskia-portschinskii": {
    ka: [
      "Lacerta portschinskii",
      "Lacerta saxicola portschinskii",
    ],
    en: [
      "Kura lizard",
      "Portschinsky's lizard",
      "Lacerta portschinskii",
      "Lacerta saxicola portschinskii",
    ],
  },
  "darevskia-clarkorum": {
    ka: [
      "ლაზური ხვლიკი",
      "ჭარნალის ხვლიკი",
      "Lacerta clarkorum",
      "Darevskia dryada",
      "Lacerta dryada",
    ],
    en: [
      "Clark's lizard",
      "Clarks' lizard",
      "Charnali lizard",
      "Laz lizard",
      "Lacerta clarkorum",
      "Darevskia dryada",
      "Lacerta dryada",
    ],
  },
  "darevskia-mixta": {
    ka: [
      "ქართული კლდის ხვლიკი",
      "Lacerta mixta",
      "Lacerta saxicola mixta",
    ],
    en: [
      "Georgian lizard",
      "Ajarian lizard",
      "mixed lizard",
      "bastard rock lizard",
      "Lacerta mixta",
      "Lacerta saxicola mixta",
    ],
  },
  "darevskia-adjarica": {
    ka: [
      "აჭარული ხვლიკი",
      "Lacerta parvula adjarica",
      "Darevskia parvula adjarica",
    ],
    en: [
      "Adjarian rock lizard",
      "red-bellied lizard",
      "Lacerta parvula adjarica",
      "Darevskia parvula adjarica",
    ],
  },
  "darevskia-praticola": {
    ka: [
      "მდელოს ხვლიკი",
      "Lacerta praticola",
      "Darevskia praticola praticola",
    ],
    en: [
      "meadow lizard",
      "Lacerta praticola",
      "Darevskia praticola praticola",
    ],
  },
  "darevskia-valentini": {
    ka: [
      "Lacerta valentini",
      "Lacerta saxicola valentini",
    ],
    en: [
      "Valentin's rock lizard",
      "Caucasian rock lizard",
      "Lacerta valentini",
      "Lacerta saxicola valentini",
    ],
  },
  "dolichophis-schmidti": {
    ka: [
      "წითელმუცელა",
      "Coluber schmidti",
      "Hierophis schmidti",
      "Coluber jugularis schmidti",
    ],
    en: [
      "Schmidt's whip snake",
      "Schmidt's racer",
      "Coluber schmidti",
      "Hierophis schmidti",
    ],
  },
  "platyceps-najadum": {
    ka: [
      "წენგოსფერი მცურავი",
      "უშხამო მცურავი",
      "Coluber najadum",
    ],
    en: [
      "Dahl's whip snake",
      "slender whip snake",
      "non-venomous whip snake",
      "Coluber najadum",
    ],
  },
  "eryx-jaculus": {
    ka: ["ქვიშიანი ბოა", "Eryx jaculus turcicus"],
    en: [
      "javelin boa",
      "sand boa",
      "western sand boa",
      "Eryx jaculus turcicus",
    ],
  },
  "eirenis-collaris": {
    ka: [
      "Coluber collaris",
      "Contia collaris",
      "ჯუჯა გველი",
    ],
    en: [
      "collared dwarf racer",
      "Collared Dwarf Racer",
      "Coluber collaris",
      "Contia collaris",
    ],
  },
  "eirenis-modestus": {
    ka: ["Coronella modesta", "Contia modesta"],
    en: [
      "Asia Minor dwarf snake",
      "ringheaded dwarf snake",
      "Coronella modesta",
      "Contia modesta",
    ],
  },
  "hemorrhois-ravergieri": {
    ka: [
      "Coluber ravergieri",
      "Zamenis ravergieri",
      "ჭრელი მცურავი",
      "ნაირფერი გველი",
    ],
    en: [
      "spotted whipsnake",
      "variegated racer",
      "Coluber ravergieri",
      "Zamenis ravergieri",
      "Ravergier's whip snake",
    ],
  },
  "elaphe-urartica": {
    ka: [
      "ურარტუს ხალებიანი მცურავი",
      "ლაქებიანი მცურავი",
      "Elaphe sauromates",
    ],
    en: [
      "Urartian rat snake",
      "blotched ratsnake",
      "Elaphe sauromates",
    ],
  },
  "elaphe-dione": {
    ka: ["სახეებიანი მცურავი"],
    en: ["steppe ratsnake", "Dione's ratsnake", "steppe rat snake"],
  },
  "telescopus-fallax": {
    ka: ["კატისთვალა", "Tarbophis fallax", "Telescopus fallax iberus"],
    en: [
      "European cat snake",
      "Mediterranean cat snake",
      "Tarbophis fallax",
      "Telescopus fallax iberus",
    ],
  },
  "zamenis-longissimus": {
    ka: ["ესკულაპის მცურავი", "გრძელი მცურავი"],
    en: ["Aesculapian snake"],
  },
  "coronella-austriaca": {
    ka: ["გლუვი გველი", "სპილენძა გველი"],
    en: ["smooth snake", "Coronella"],
  },
  "natrix-natrix": {
    ka: [
      "ანკარა",
      "ანკარა გველი",
      "გველი ანკარა",
      "უშხამო ანკარა",
      "დიდთავა ანკარა",
      "Natrix megalocephala",
    ],
    en: [
      "grass snake",
      "ringed snake",
      "ring snake",
      "eastern grass snake",
      "non-venomous grass snake",
      "Natrix megalocephala",
    ],
  },
  "rana-macrocnemis": {
    ka: [
      "კავკასიური მურა ბაყაყი",
      "მურა ბაყაყი",
      "Rana camerani",
    ],
    en: [
      "long-legged wood frog",
      "Anatolian brown frog",
      "Caucasus frog",
      "Rana camerani",
    ],
  },
  "pelodytes-caucasicus": {
    ka: [
      "კავკასიური ჯვარულა",
      "ჯვრიანა",
      "ჯვარულა",
      "Pelodytes",
    ],
    en: [
      "Caucasian mud-diver",
      "parsley frog",
      "Pelodytes",
    ],
  },
  "hyla-orientalis": {
    ka: [
      "ვასაკა",
      "Hyla arborea",
      "Hyla arborea schelkownikowi",
      "აღმოსავლური ხის ბაყაყი",
    ],
    en: [
      "eastern tree frog",
      "Oriental treefrog",
      "Hyla arborea",
      "Hyla arborea schelkownikowi",
      "European treefrog",
    ],
  },
  "hyla-savignyi": {
    ka: ["Hyla arborea savignyi"],
    en: [
      "Savigny's treefrog",
      "lemon-yellow treefrog",
      "Middle East treefrog",
      "Hyla arborea savignyi",
    ],
  },
  "pelophylax-ridibundus": {
    ka: [
      "ტბის ბაყაყი",
      "Rana ridibunda",
      "Pelophylax bedriagae",
    ],
    en: [
      "lake frog",
      "Eurasian marsh frog",
      "Rana ridibunda",
      "Pelophylax bedriagae",
    ],
  },

  "bufo-verrucosissimus": {
    ka: [
      "კოლხური გომბეშო",
      "Bufo bufo verrucosissimus",
      "Bufo bufo",
    ],
    en: [
      "Colchic toad",
      "Caucasus toad",
      "Caucasian common toad",
      "Bufo bufo verrucosissimus",
      "common toad",
    ],
  },
  "emys-orbicularis": {
    ka: ["ევროპული ჭაობის კუ", "Emys orbicularis persica"],
    en: [
      "European pond terrapin",
      "pond turtle",
      "Emys orbicularis persica",
    ],
  },
  "bufotes-viridis": {
    ka: ["Bufo viridis", "Pseudepidalea viridis", "Bufotes sitibundus"],
    en: [
      "Bufo viridis",
      "Pseudepidalea viridis",
      "Bufotes sitibundus",
      "European green toad",
    ],
  },
  "mertensiella-caucasica": {
    ka: ["Salamandra caucasica"],
    en: ["Caucasian salamander", "Salamandra caucasica"],
  },
  "natrix-tessellata": {
    ka: [
      "წყლის ანკარა",
      "წყლის გველი",
      "უშხამო ანკარა",
      "dice snake",
    ],
    en: [
      "dice snake",
      "tessellated water snake",
      "water snake Georgia",
      "non-venomous water snake",
    ],
  },
  "lissotriton-lantzi": {
    ka: [
      "ჩვეულებრივი ტრიტონი",
      "გლუვი ტრიტონი",
      "Triturus vulgaris lantzi",
      "Lissotriton vulgaris lantzi",
    ],
    en: [
      "Caucasian newt",
      "Lantz's newt",
      "smooth newt",
      "Triturus vulgaris lantzi",
      "Lissotriton vulgaris lantzi",
    ],
  },
  "ommatotriton-ophryticus": {
    ka: [
      "ტრიტონი",
      "ტრიტონი საქართველოში",
      "ტრიტონი წყლის",
      "კავკასიური ტრიტონი",
      "მცირეაზიური ტრიტონი",
      "ზოლებიანი ტრიტონი",
      "Triturus vittatus",
      "Triturus vittatus ophryticus",
    ],
    en: [
      "newt Georgia",
      "Caucasian banded newt",
      "northern banded newt",
      "Asia Minor newt",
      "banded newt",
      "Triturus vittatus",
      "Triturus vittatus ophryticus",
    ],
  },
  "triturus-karelinii": {
    ka: [
      "სავარცხლიანი ტრიტონი",
      "Triturus cristatus karelinii",
      "southern crested newt",
    ],
    en: [
      "southern crested newt",
      "Karelin's crested newt",
      "Triturus cristatus karelinii",
      "crested newt",
    ],
  },
  "emberiza-citrinella": {
    ka: [
      "მოყვითალო გრატა",
      "ქეროზა",
      "რუხი გულწითელა",
      "Emberiza citrinella erythrogenys",
    ],
    en: ["yellow bunting", "Emberiza citrinella erythrogenys"],
  },
  "picus-viridis": {
    ka: [
      "კოდალა",
      "სამხრული მწვანე კოდალა",
      "Picus viridis karelini",
    ],
    en: [
      "green woodpecker",
      "Eurasian green woodpecker",
      "yaffle",
      "Picus viridis karelini",
    ],
  },
  "jynx-torquilla": {
    ka: [
      "ჩვეულებრივი მაქცია",
      "კოდალასებრნი",
      "Jynx torquilla torquilla",
    ],
    en: [
      "wryneck",
      "northern wryneck",
      "European wryneck",
      "Jynx torquilla torquilla",
    ],
  },
  "cuculus-canorus": {
    ka: [
      "ჩვეულებრივი გუგული",
      "გუგულისებრნი",
      "Cuculus canorus canorus",
    ],
    en: [
      "European cuckoo",
      "Eurasian cuckoo",
      "cuckoo",
      "Cuculus canorus canorus",
    ],
  },
  "apus-apus": {
    ka: [
      "ჩვეულებრივი ნამგალა",
      "ნამგალასებრნი",
      "ნამგალასნაირნი",
      "Apus apus apus",
    ],
    en: [
      "Eurasian swift",
      "European swift",
      "swift",
      "Apus apus apus",
    ],
  },
  "streptopelia-turtur": {
    ka: [
      "ჩვეულებრივი გვრიტი",
      "მტრედისებრნი",
      "Streptopelia turtur turtur",
      "Streptopelia turtur arenicola",
    ],
    en: [
      "turtle dove",
      "European turtle-dove",
      "turtle-dove",
      "Streptopelia turtur turtur",
      "Streptopelia turtur arenicola",
    ],
  },
  "buteo-buteo": {
    ka: [
      "კაკაჩა",
      "ჩვეულებრივი არწივი",
      "სტეპის კაკაჩა",
      "ქორისებრნი",
      "Buteo buteo vulpinus",
      "Buteo buteo menetriesi",
      "Falco buteo",
    ],
    en: [
      "Eurasian buzzard",
      "steppe buzzard",
      "common eagle",
      "Buteo buteo vulpinus",
      "Buteo buteo menetriesi",
      "Falco buteo",
    ],
  },
  "strix-aluco": {
    ka: [
      "ტყის ბუ",
      "რუხი ბუ",
      "ჩვეულებრივი ტყის ბუ",
      "ბუსებრნი",
      "Strix aluco willkonskii",
    ],
    en: [
      "brown owl",
      "Eurasian tawny owl",
      "forest owl",
      "Strix aluco willkonskii",
    ],
  },
  "otus-scops": {
    ka: [
      "წყრომი",
      "ბუსებრნი",
      "Strix scops",
      "Otus scops scops",
    ],
    en: [
      "European scops owl",
      "common scops owl",
      "Eurasian Scops-Owl",
      "Strix scops",
      "Otus scops scops",
    ],
  },
  "aegolius-funereus": {
    ka: [
      "მიკიოტი",
      "ომიდი",
      "ბუსებრნი",
      "Strix funerea",
      "Aegolius funereus caucasicus",
      "Nyctala caucasica",
    ],
    en: [
      "Boreal owl",
      "Tengmalm's Owl",
      "Richardson's owl",
      "Strix funerea",
      "Aegolius funereus caucasicus",
      "Nyctala caucasica",
    ],
  },
  "tyto-alba": {
    ka: [
      "ბუხრინწა",
      "ბუსებრნი",
      "Tyto alba guttata",
      "Tyto alba erlangeri",
      "Strix alba",
    ],
    en: [
      "barn owl",
      "Western Barn Owl",
      "Common Barn Owl",
      "Tyto alba guttata",
      "Tyto alba erlangeri",
      "Strix alba",
    ],
  },
  "athene-noctua": {
    ka: [
      "ბუკნაჭო",
      "ბუსებრნი",
      "Athene noctua indigena",
      "Strix noctua",
    ],
    en: [
      "owl of Athena",
      "owl of Minerva",
      "Athene noctua indigena",
      "Strix noctua",
    ],
  },
  "accipiter-nisus": {
    ka: [
      "მიმინო",
      "ქორისებრნი",
      "Accipiter nisus nisus",
    ],
    en: [
      "sparrowhawk",
      "northern sparrowhawk",
      "Accipiter nisus nisus",
    ],
  },
  "falco-peregrinus": {
    ka: [
      "ჩვეულებრივი შავარდენი",
      "შავარდნისებრნი",
      "შავარდნისნაირნი",
      "Falco peregrinus brookei",
      "საპსანი",
    ],
    en: [
      "peregrine",
      "Peregrine Falcon",
      "Falconidae",
      "Falco peregrinus brookei",
      "Falco peregrinus peregrinus",
    ],
  },
  "corvus-corax": {
    ka: [
      "ყორნისებრნი",
      "ჩრდილოეთის ყორანი",
      "Corvus corax corax",
      "ворон",
    ],
    en: [
      "common raven",
      "raven",
      "Northern Raven",
      "Corvus corax corax",
    ],
  },
  "turdus-merula": {
    ka: [
      "შაშვი",
      "შაშვისებრნი",
      "Turdus merula aterrimus",
      "Turdus merula merula",
    ],
    en: [
      "Eurasian blackbird",
      "European blackbird",
      "blackbird",
      "Turdus merula aterrimus",
    ],
  },
  "glareola-pratincola": {
    ka: [
      "მერცხალა",
      "ჟღალფრთიანა მერცხალა",
      "მერცხალასებრნი",
      "Hirundo pratincola",
    ],
    en: [
      "common pratincole",
      "red-winged pratincole",
      "pratincole",
      "Hirundo pratincola",
    ],
  },
  "ficedula-hypoleuca": {
    ka: [
      "ჭრელი ბუზიჭერია",
      "მემატლიასებრნი",
      "Motacilla hypoleuca",
      "Muscicapa hypoleuca",
    ],
    en: [
      "pied flycatcher",
      "western pied flycatcher",
      "Motacilla hypoleuca",
      "Muscicapa hypoleuca",
      "Ficedula hypoleuca hypoleuca",
    ],
  },
  "ficedula-semitorquata": {
    ka: [
      "ნახევართეთრყელა მემატლია",
      "ნახევართეთრყელა ბუზიჭერია",
      "მემატლიასებრნი",
      "Muscicapa semitorquata",
    ],
    en: [
      "semicollared flycatcher",
      "half-collared flycatcher",
      "Muscicapa semitorquata",
    ],
  },
  "ciconia-ciconia": {
    ka: [
      "ლაკლაკი",
      "ყარყატი",
      "თეთრი ლაკლაკი",
      "Ciconia ciconia ciconia",
      "Ardea ciconia",
    ],
    en: [
      "western white stork",
      "European white stork",
      "stork",
      "Ciconia ciconia ciconia",
      "Ardea ciconia",
    ],
  },
  "anas-platyrhynchos": {
    ka: [
      "იხვი",
      "ველური იხვი",
      "იხვისებრნი",
      "Anas boschas",
      "Anas platyrhynchos platyrhynchos",
    ],
    en: [
      "wild duck",
      "common mallard",
      "dabbling duck",
      "Anas boschas",
      "Anas platyrhynchos platyrhynchos",
    ],
  },
  "phasianus-colchicus": {
    ka: [
      "კოლხური ხოხობი",
      "ხოხბისებრნი",
      "Phasianus colchicus colchicus",
      "фазан",
    ],
    en: [
      "Colchic pheasant",
      "black-necked pheasant",
      "ring-necked pheasant",
      "Phasianus colchicus colchicus",
    ],
  },
  "coturnix-coturnix": {
    ka: [
      "ჩვეულებრივი მწყერი",
      "ხოხბისებრნი",
      "ქათმისნაირნი",
      "Coturnix coturnix coturnix",
      "перепел",
    ],
    en: [
      "European quail",
      "Eurasian quail",
      "Coturnix coturnix coturnix",
      "Tetrao coturnix",
    ],
  },
  "aegypius-monachus": {
    ka: [
      "შავი სვავი",
      "ლეშიჭამია",
      "ქორისებრნი",
      "Vultur monachus",
      "Aegipius monachus",
    ],
    en: [
      "Eurasian black vulture",
      "black vulture",
      "monk vulture",
      "Vultur monachus",
      "Aegipius monachus",
    ],
  },
  "gyps-fulvus": {
    ka: [
      "ჩვეულებრივი ორბი",
      "თეთრთავა ორბი",
      "ლეშიჭამია",
      "ქორისებრნი",
      "Gyps fulvus fulvus",
      "Vultur fulvus",
    ],
    en: [
      "Eurasian griffon",
      "Eurasian Griffon Vulture",
      "griffon",
      "Gyps fulvus fulvus",
      "Vultur fulvus",
    ],
  },
  "aquila-chrysaetos": {
    ka: [
      "ოქროსფერი არწივი",
      "არწივი",
      "Aquila chrysaetos homeyeri",
      "Aquila chrysaetus",
      "Falco chrysaetos",
    ],
    en: [
      "Mediterranean Golden Eagle",
      "golden eagle",
      "Aquila chrysaetos homeyeri",
      "Aquila chrysaetus",
      "Falco chrysaetos",
    ],
  },
  "canis-lupus": {
    ka: [
      "მგელი",
      "რუხი მგელი",
      "ნაცრისფერი მგელი",
      "Canis lupus cubanensis",
      "Canis lupus lupus",
    ],
    en: [
      "gray wolf",
      "wolf",
      "timber wolf",
      "Canis lupus cubanensis",
      "Canis lupus lupus",
      "Caucasus wolf",
    ],
  },
  "canis-aureus": {
    ka: [
      "ტურა",
      "ოქროს ტურა",
      "Canis aureus moreoticus",
      "Canis aureus caucasica",
    ],
    en: [
      "common jackal",
      "Asiatic jackal",
      "Eurasian golden jackal",
      "Canis aureus moreoticus",
      "Canis aureus caucasica",
    ],
  },
  "vulpes-vulpes": {
    ka: [
      "ჩვეულებრივი მელა",
      "წითელი მელა",
      "Canis vulpes",
      "Vulpes vulpes caucasica",
      "Vulpes vulpes alpherakyi",
    ],
    en: [
      "common fox",
      "cross fox",
      "silver fox",
      "Canis vulpes",
      "Vulpes vulpes caucasica",
      "Vulpes vulpes alpherakyi",
    ],
  },
  "meles-canescens": {
    ka: [
      "ევროპული მაჩვი",
      "Meles meles",
      "Meles meles minor",
      "Meles canescens",
      "კავკასიური მაჩვი",
    ],
    en: [
      "European badger",
      "Eurasian badger",
      "Southwest Asian badger",
      "Transcaucasian badger",
      "Meles meles",
      "Meles meles minor",
    ],
  },
  "lutra-lutra": {
    ka: [
      "წავი",
      "ევრაზიული წავი",
      "Mustela lutra",
      "Lutra vulgaris",
      "Lutra lutra meridionalis",
    ],
    en: [
      "European otter",
      "common otter",
      "European river otter",
      "Mustela lutra",
      "Lutra vulgaris",
      "Lutra lutra meridionalis",
    ],
  },
  "mustela-nivalis": {
    ka: [
      "სინდიოფალა",
      "Putorius nivalis",
      "Mustela nivalis caucasica",
      "Mustela nivalis dinniki",
    ],
    en: [
      "weasel",
      "common weasel",
      "little weasel",
      "Putorius nivalis",
      "Mustela nivalis caucasica",
      "Mustela nivalis dinniki",
    ],
  },
  "ursus-arctos": {
    ka: [
      "დათვი",
      "მურა",
      "Ursus arctos arctos",
      "Ursus arctos syriacus",
      "Ursus arctos caucasicus",
    ],
    en: [
      "grizzly",
      "Eurasian brown bear",
      "Ursus arctos arctos",
      "Ursus arctos syriacus",
      "Ursus arctos caucasicus",
    ],
  },
  "capreolus-capreolus": {
    ka: [
      "შველი",
      "ევროპული შველი",
      "ნუკრი",
      "Cervus capreolus",
      "Capreolus capreolus caucasicus",
    ],
    en: [
      "roe deer",
      "western roe deer",
      "European roe",
      "Cervus capreolus",
      "Capreolus capreolus caucasicus",
    ],
  },
  "sciurus-anomalus": {
    ka: [
      "სპარსული ციყვი",
      "ციყვი",
      "Sciurus persicus",
      "Sciurus anomalus anomalus",
    ],
    en: [
      "Persian squirrel",
      "golden squirrel",
      "Transcaucasian squirrel",
      "Sciurus persicus",
      "Sciurus anomalus anomalus",
    ],
  },
  "lynx-lynx": {
    ka: [
      "ევრაზიული ფოცხვერი",
      "კავკასიური ფოცხვერი",
      "Lynx lynx dinniki",
      "Felis lynx",
    ],
    en: [
      "European lynx",
      "Caucasian lynx",
      "Caucasus lynx",
      "Lynx lynx dinniki",
      "Felis lynx",
    ],
  },
  "capra-aegagrus": {
    ka: [
      "ველური თხა",
      "ბეზოარული თხა",
      "Capra aegagrus aegagrus",
      "Capra hircus aegagrus",
    ],
    en: [
      "bezoar goat",
      "bezoar ibex",
      "wild goat",
      "Capra aegagrus aegagrus",
      "Capra hircus aegagrus",
    ],
  },
  "panthera-pardus": {
    ka: [
      "ჯიქი",
      "ლეოპარდი",
      "წინააზიური ჯიქი",
      "სპარსული ჯიქი",
      "ვეფხვი",
      "Panthera pardus tulliana",
      "Panthera pardus ciscaucasica",
      "Panthera pardus saxicolor",
    ],
    en: [
      "Persian leopard",
      "Anatolian leopard",
      "leopard",
      "vepkhi",
      "Panthera pardus tulliana",
      "Panthera pardus ciscaucasica",
      "Panthera pardus saxicolor",
    ],
  },
  "sus-scrofa": {
    ka: [
      "ტახი",
      "ნეზვი",
      "გოჭი",
      "Sus scrofa attila",
      "Sus scrofa domesticus",
    ],
    en: [
      "Eurasian wild pig",
      "wild pig",
      "wild swine",
      "Sus scrofa attila",
      "Sus scrofa domesticus",
    ],
  },
  "procyon-lotor": {
    ka: [
      "ჩვეულებრივი ენოტი",
      "ჩრდილოამერიკული ენოტი",
      "Procyon lotor",
    ],
    en: [
      "common raccoon",
      "northern raccoon",
      "North American raccoon",
      "racoon",
    ],
  },
  "erinaceus-concolor": {
    ka: [
      "აღმოსავლეთევროპული ზღარბი",
      "თეთრმკერდა ზღარბი",
      "სამხრეთული თეთრმკერდა ზღარბი",
      "ზღარბი",
      "Erinaceus europaeus",
      "Erinaceus concolor transcaucasicus",
      "Erinaceus europaeus transcaucasicus",
    ],
    en: [
      "European hedgehog",
      "eastern hedgehog",
      "white-breasted hedgehog",
      "white-chested hedgehog",
      "Erinaceus europaeus",
      "Erinaceus concolor transcaucasicus",
      "Erinaceus europaeus transcaucasicus",
    ],
  },
};

export function uniqueKeywords(values: Array<string | undefined | null>) {
  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const value of values) {
    const item = value?.trim();
    if (!item) continue;
    const key = item.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    keywords.push(item);
  }

  return keywords;
}

export function siteKeywords(locale: AppLocale) {
  return locale === "en"
    ? [
        "animals of Georgia",
        "Georgia reptiles",
        "Caucasus reptiles",
        "species atlas",
      ]
    : [
        "საქართველოს ცხოველები",
        "ცხოველთა ატლასი",
        "ქვეწარმავლები",
        "საქართველოს ქვეწარმავლები",
        "კავკასია",
      ];
}

export function speciesSeoAnchor(commonName: string, scientificName: string) {
  return `${commonName} (${scientificName})`;
}

export function speciesAliasKeywords(id: string, locale: AppLocale) {
  const aliases = SPECIES_ALIASES[id];
  if (!aliases) return [];
  return locale === "en" ? aliases.en : aliases.ka;
}

export function speciesSeoKeywords(species: Species, locale: AppLocale) {
  return uniqueKeywords([
    species.commonName,
    species.scientificName,
    species.genus,
    species.family,
    ...speciesAliasKeywords(species.id, locale),
    locale === "en" ? "Georgia" : "საქართველო",
    locale === "en" ? "Caucasus" : "კავკასია",
  ]);
}

export function speciesJsonLdKeywords(species: Species, locale: AppLocale) {
  return speciesSeoKeywords(species, locale).join(", ");
}

export type SeoDefinedTerm = {
  ka: string;
  en: string;
  speciesId: string;
};

export const HOME_DEFINED_TERMS: SeoDefinedTerm[] = [
  {
    ka: "გიურზა",
    en: "Levantine viper",
    speciesId: "macrovipera-lebetina",
  },
  {
    ka: "დინიკის გველგესლა",
    en: "Dinnik's viper",
    speciesId: "vipera-dinniki",
  },
  {
    ka: "კავკასიური გველგესლა",
    en: "Caucasus viper",
    speciesId: "vipera-kaznakovi",
  },
  {
    ka: "ცხვირრქოსანი გველგესლა",
    en: "Nose-horned viper",
    speciesId: "vipera-transcaucasiana",
  },
  {
    ka: "დარევსკის გველგესლა",
    en: "Darevsky's viper",
    speciesId: "vipera-darevskii",
  },
  {
    ka: "ველის გველგესლა",
    en: "eastern steppe viper",
    speciesId: "vipera-renardi",
  },
  {
    ka: "გველხოკერა",
    en: "European glass lizard",
    speciesId: "pseudopus-apodus",
  },
  {
    ka: "წენგოსფერი მცურავი",
    en: "Dahl's whip snake",
    speciesId: "platyceps-najadum",
  },
  {
    ka: "სახეებიანი მცურავი",
    en: "steppe ratsnake",
    speciesId: "elaphe-dione",
  },
  {
    ka: "კატისთვალა",
    en: "European cat snake",
    speciesId: "telescopus-fallax",
  },
  {
    ka: "ესკულაპის მცურავი",
    en: "Aesculapian snake",
    speciesId: "zamenis-longissimus",
  },
];
