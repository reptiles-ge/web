import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { caucasusPlaceName, georgiaPlaceName } from "@/i18n/localeMeta";

const SPECIES_ALIASES: Record<string, { en: string[]; ka: string[] }> = {
  "ablepharus-pannonicus": {
    en: ["Asian snake-eyed skink", "lidless skink", "snake-eyed skink"],
    ka: ["აზიური შიშველთვალა", "შიშველთვალა"],
  },
  "coronella-austriaca": {
    en: ["smooth snake", "Coronella"],
    ka: ["გლუვი გველი", "სპილენძა გველი"],
  },
  "darevskia-adjarica": {
    en: [
      "Adjarian rock lizard",
      "red-bellied lizard",
      "Lacerta parvula adjarica",
      "Darevskia parvula adjarica",
    ],
    ka: [
      "აჭარული ხვლიკი",
      "Lacerta parvula adjarica",
      "Darevskia parvula adjarica",
    ],
  },
  "darevskia-clarkorum": {
    en: [
      "Clark's lizard",
      "Clarks' lizard",
      "Charnali lizard",
      "Laz lizard",
      "Lacerta clarkorum",
      "Darevskia dryada",
      "Lacerta dryada",
    ],
    ka: [
      "ლაზური ხვლიკი",
      "ჭარნალის ხვლიკი",
      "Lacerta clarkorum",
      "Darevskia dryada",
      "Lacerta dryada",
    ],
  },
  "darevskia-daghestanica": {
    en: [
      "Dagestan lizard",
      "Dagestan rock lizard",
      "Lacerta daghestanica",
      "Lacerta caucasica daghestanica",
    ],
    ka: [
      "დაღესტნური კლდის ხვლიკი",
      "Lacerta daghestanica",
      "Lacerta caucasica daghestanica",
    ],
  },
  "darevskia-dahli": {
    en: ["Dahl's lizard", "Lacerta dahli", "Lacerta saxicola dahli"],
    ka: ["Lacerta dahli", "Lacerta saxicola dahli"],
  },
  "darevskia-derjugini": {
    en: [
      "Artvin lizard",
      "Artwin lizard",
      "Derjugin's lizard",
      "Lacerta derjugini",
    ],
    ka: ["კავკასიური ტყის ხვლიკი", "ართვინის ხვლიკი", "Lacerta derjugini"],
  },
  "darevskia-mixta": {
    en: [
      "Georgian lizard",
      "Ajarian lizard",
      "mixed lizard",
      "bastard rock lizard",
      "Lacerta mixta",
      "Lacerta saxicola mixta",
    ],
    ka: ["ქართული კლდის ხვლიკი", "Lacerta mixta", "Lacerta saxicola mixta"],
  },
  "darevskia-pontica": {
    en: [
      "Pontic lizard",
      "meadow lizard",
      "Colchic meadow lizard",
      "Lacerta praticola pontica",
      "Darevskia praticola pontica",
    ],
    ka: [
      "მდელოს ხვლიკი",
      "პონტური მდელოს ხვლიკი",
      "Lacerta praticola pontica",
      "Darevskia praticola pontica",
    ],
  },
  "darevskia-portschinskii": {
    en: [
      "Kura lizard",
      "Portschinsky's lizard",
      "Lacerta portschinskii",
      "Lacerta saxicola portschinskii",
    ],
    ka: ["Lacerta portschinskii", "Lacerta saxicola portschinskii"],
  },
  "darevskia-praticola": {
    en: ["meadow lizard", "Lacerta praticola", "Darevskia praticola praticola"],
    ka: ["მდელოს ხვლიკი", "Lacerta praticola", "Darevskia praticola praticola"],
  },
  "darevskia-valentini": {
    en: [
      "Valentin's rock lizard",
      "Caucasian rock lizard",
      "Lacerta valentini",
      "Lacerta saxicola valentini",
    ],
    ka: ["Lacerta valentini", "Lacerta saxicola valentini"],
  },
  "dolichophis-schmidti": {
    en: [
      "Schmidt's whip snake",
      "Schmidt's racer",
      "Coluber schmidti",
      "Hierophis schmidti",
    ],
    ka: [
      "წითელმუცელა",
      "Coluber schmidti",
      "Hierophis schmidti",
      "Coluber jugularis schmidti",
    ],
  },
  "eirenis-collaris": {
    en: [
      "collared dwarf racer",
      "Collared Dwarf Racer",
      "Coluber collaris",
      "Contia collaris",
    ],
    ka: ["Coluber collaris", "Contia collaris", "ჯუჯა გველი"],
  },
  "eirenis-modestus": {
    en: [
      "Asia Minor dwarf snake",
      "ringheaded dwarf snake",
      "Coronella modesta",
      "Contia modesta",
    ],
    ka: ["Coronella modesta", "Contia modesta"],
  },
  "elaphe-dione": {
    en: ["steppe ratsnake", "Dione's ratsnake", "steppe rat snake"],
    ka: ["სახეებიანი მცურავი"],
  },
  "elaphe-urartica": {
    en: ["Urartian rat snake", "blotched ratsnake", "Elaphe sauromates"],
    ka: ["ურარტუს ხალებიანი მცურავი", "ლაქებიანი მცურავი", "Elaphe sauromates"],
  },
  "eremias-arguta": {
    en: [
      "steppe runner",
      "steppe racerunner",
      "racerunner",
      "Eremias arguta transcaucasica",
    ],
    ka: ["ფსვენი", "სტეპის ფსვენი", "Eremias arguta transcaucasica"],
  },
  "eryx-jaculus": {
    en: [
      "javelin boa",
      "sand boa",
      "western sand boa",
      "Eryx jaculus turcicus",
    ],
    ka: ["ქვიშიანი ბოა", "Eryx jaculus turcicus"],
  },
  "hemorrhois-ravergieri": {
    en: [
      "spotted whipsnake",
      "variegated racer",
      "Coluber ravergieri",
      "Zamenis ravergieri",
      "Ravergier's whip snake",
    ],
    ka: [
      "Coluber ravergieri",
      "Zamenis ravergieri",
      "ჭრელი მცურავი",
      "ნაირფერი გველი",
    ],
  },
  "hyla-orientalis": {
    en: [
      "eastern tree frog",
      "Oriental treefrog",
      "Hyla arborea",
      "Hyla arborea schelkownikowi",
      "European treefrog",
    ],
    ka: [
      "ვასაკა",
      "Hyla arborea",
      "Hyla arborea schelkownikowi",
      "აღმოსავლური ხის ბაყაყი",
    ],
  },
  "hyla-savignyi": {
    en: [
      "Savigny's treefrog",
      "lemon-yellow treefrog",
      "Middle East treefrog",
      "Hyla arborea savignyi",
    ],
    ka: ["Hyla arborea savignyi"],
  },
  "lacerta-media": {
    en: [
      "medium lizard",
      "three-lined lizard",
      "Levant green lizard",
      "Lacerta trilineata media",
    ],
    ka: ["Lacerta trilineata media"],
  },
  "lacerta-strigata": {
    en: [
      "Caspian green lizard",
      "Caucasus emerald lizard",
      "five-streaked lizard",
      "striated lizard",
    ],
    ka: [],
  },
  "macrovipera-lebetina": {
    en: [
      "Levantine viper",
      "blunt-nosed viper",
      "giurza",
      "gyurza",
      "Macrovipera lebetina",
    ],
    ka: [
      "გიურზა",
      "გიუზა",
      "giurza",
      "Macrovipera lebetina",
      "Vipera lebetina",
    ],
  },
  "malpolon-insignitus": {
    en: [
      "Montpellier snake",
      "eastern Montpellier snake",
      "Malpolon monspessulanus",
    ],
    ka: ["ხვლიკიჭამია გველი", "ხვლიკიჭამია", "Malpolon monspessulanus"],
  },
  "natrix-natrix": {
    en: [
      "grass snake",
      "ringed snake",
      "ring snake",
      "eastern grass snake",
      "non-venomous grass snake",
      "Natrix megalocephala",
    ],
    ka: [
      "ანკარა",
      "ანკარა გველი",
      "გველი ანკარა",
      "უშხამო ანკარა",
      "დიდთავა ანკარა",
      "Natrix megalocephala",
    ],
  },
  "paralaudakia-caucasia": {
    en: [
      "Caucasian rock agama",
      "Laudakia caucasia",
      "Agama caucasica",
      "Stellio caucasius",
    ],
    ka: ["კავკასიური ჯოჯო", "Laudakia caucasia", "Agama caucasica"],
  },
  "pelodytes-caucasicus": {
    en: ["Caucasian mud-diver", "parsley frog", "Pelodytes"],
    ka: ["კავკასიური ჯვარულა", "ჯვრიანა", "ჯვარულა", "Pelodytes"],
  },
  "pelophylax-ridibundus": {
    en: [
      "lake frog",
      "Eurasian marsh frog",
      "Rana ridibunda",
      "Pelophylax bedriagae",
    ],
    ka: ["ტბის ბაყაყი", "Rana ridibunda", "Pelophylax bedriagae"],
  },
  "platyceps-najadum": {
    en: [
      "Dahl's whip snake",
      "slender whip snake",
      "non-venomous whip snake",
      "Coluber najadum",
    ],
    ka: ["წენგოსფერი მცურავი", "უშხამო მცურავი", "Coluber najadum"],
  },
  "pseudopus-apodus": {
    en: ["European glass lizard", "sheltopusik"],
    ka: ["გველხოკერა"],
  },
  "rana-macrocnemis": {
    en: [
      "long-legged wood frog",
      "Anatolian brown frog",
      "Caucasus frog",
      "Rana camerani",
    ],
    ka: ["კავკასიური მურა ბაყაყი", "მურა ბაყაყი", "Rana camerani"],
  },
  "telescopus-fallax": {
    en: [
      "European cat snake",
      "Mediterranean cat snake",
      "Tarbophis fallax",
      "Telescopus fallax iberus",
    ],
    ka: ["კატისთვალა", "Tarbophis fallax", "Telescopus fallax iberus"],
  },
  "testudo-graeca": {
    en: [
      "Greek tortoise",
      "spur-thighed tortoise",
      "Mediterranean tortoise",
      "Testudo graeca ibera",
    ],
    ka: ["ხმელეთის კუ", "ხმელთაშუაზღვის კუ", "Testudo graeca ibera"],
  },
  "vipera-darevskii": {
    en: ["Darevsky's viper"],
    ka: ["დარევსკის გველგესლა", "გველგესლა"],
  },
  "vipera-dinniki": {
    en: ["Dinnik's viper", "Caucasus subalpine viper", "Pelias dinniki"],
    ka: ["დინიკის გველგესლა", "Pelias dinniki"],
  },
  "vipera-kaznakovi": {
    en: [
      "Caucasus viper",
      "Caucasian viper",
      "Kaznakov's viper",
      "venomous viper Georgia",
      "Pelias kaznakovi",
    ],
    ka: [
      "კავკასიური გველგესლა",
      "გველგესლა",
      "შხამიანი გველგესლა",
      "Pelias kaznakovi",
    ],
  },
  "vipera-renardi": {
    en: ["eastern steppe viper", "steppe viper"],
    ka: ["ველის გველგესლა", "სტეპის გველგესლა", "გველგესლა"],
  },
  "vipera-transcaucasiana": {
    en: [
      "Transcaucasian long-nosed viper",
      "nose-horned viper",
      "Transcaucasian sand viper",
      "venomous viper Georgia",
      "Vipera transcaucasiana",
      "Vipera ammodytes transcaucasiana",
    ],
    ka: [
      "ცხვირრქოსანი გველგესლა",
      "გველგესლა",
      "შხამიანი გველგესლა",
      "Vipera ammodytes",
      "Vipera transcaucasiana",
    ],
  },
  "zamenis-longissimus": {
    en: ["Aesculapian snake"],
    ka: ["ესკულაპის მცურავი", "გრძელი მცურავი"],
  },

  "accipiter-gentilis": {
    en: [
      "northern goshawk",
      "Eurasian Northern Goshawk",
      "goshawk",
      "Astur gentilis",
      "Accipiter gentilis caucasicus",
      "Falco gentilis",
    ],
    ka: [
      "დიდი ქორი",
      "ქორისებრნი",
      "Astur gentilis",
      "Accipiter gentilis caucasicus",
      "Falco gentilis",
    ],
  },
  "accipiter-nisus": {
    en: ["sparrowhawk", "northern sparrowhawk", "Accipiter nisus nisus"],
    ka: ["მიმინო", "ქორისებრნი", "Accipiter nisus nisus"],
  },
  "aegolius-funereus": {
    en: [
      "Boreal owl",
      "Tengmalm's Owl",
      "Richardson's owl",
      "Strix funerea",
      "Aegolius funereus caucasicus",
      "Nyctala caucasica",
    ],
    ka: [
      "მიკიოტი",
      "ომიდი",
      "ბუსებრნი",
      "Strix funerea",
      "Aegolius funereus caucasicus",
      "Nyctala caucasica",
    ],
  },
  "aegypius-monachus": {
    en: [
      "Eurasian black vulture",
      "black vulture",
      "monk vulture",
      "Vultur monachus",
      "Aegipius monachus",
    ],
    ka: [
      "შავი სვავი",
      "ლეშიჭამია",
      "ქორისებრნი",
      "Vultur monachus",
      "Aegipius monachus",
    ],
  },
  "anas-platyrhynchos": {
    en: [
      "wild duck",
      "common mallard",
      "dabbling duck",
      "Anas boschas",
      "Anas platyrhynchos platyrhynchos",
    ],
    ka: [
      "იხვი",
      "ველური იხვი",
      "იხვისებრნი",
      "Anas boschas",
      "Anas platyrhynchos platyrhynchos",
    ],
  },
  "apus-apus": {
    en: ["Eurasian swift", "European swift", "swift", "Apus apus apus"],
    ka: [
      "ჩვეულებრივი ნამგალა",
      "ნამგალასებრნი",
      "ნამგალასნაირნი",
      "Apus apus apus",
    ],
  },
  "aquila-chrysaetos": {
    en: [
      "Mediterranean Golden Eagle",
      "golden eagle",
      "Aquila chrysaetos homeyeri",
      "Aquila chrysaetus",
      "Falco chrysaetos",
    ],
    ka: [
      "ოქროსფერი არწივი",
      "არწივი",
      "Aquila chrysaetos homeyeri",
      "Aquila chrysaetus",
      "Falco chrysaetos",
    ],
  },
  "argiope-bruennichi": {
    en: [
      "wasp spider",
      "wasp-spider",
      "Brünnich's argiope",
      "Argiope bruennichi",
    ],
    ka: [
      "არგიოპა",
      "ბრუნიქის არგიოპა",
      "ბზიკისებრი ობობა",
      "Argiope bruennichi",
    ],
  },
  "argiope-lobata": {
    en: [
      "lobed argiope",
      "black-lobed garden orb-web spider",
      "Argiope lobata",
    ],
    ka: ["ლობებიანი არგიოპა", "არგიოპა ლობატა", "Argiope lobata"],
  },
  "athene-noctua": {
    en: [
      "owl of Athena",
      "owl of Minerva",
      "Athene noctua indigena",
      "Strix noctua",
    ],
    ka: ["ბუკნაჭო", "ბუსებრნი", "Athene noctua indigena", "Strix noctua"],
  },
  "bubo-bubo": {
    en: [
      "zarnasho",
      "eagle owl",
      "Eurasian Eagle-Owl",
      "eagle-owl",
      "Bubo bubo interpositus",
      "Strix bubo",
    ],
    ka: [
      "ჩვეულებრივი ზარნაშო",
      "zarnasho",
      "ბუსებრნი",
      "Bubo bubo interpositus",
      "Strix bubo",
    ],
  },
  "bufo-verrucosissimus": {
    en: [
      "Colchic toad",
      "Caucasus toad",
      "Caucasian common toad",
      "Bufo bufo verrucosissimus",
      "common toad",
    ],
    ka: ["კოლხური გომბეშო", "Bufo bufo verrucosissimus", "Bufo bufo"],
  },
  "bufotes-viridis": {
    en: [
      "Bufo viridis",
      "Pseudepidalea viridis",
      "Bufotes sitibundus",
      "European green toad",
    ],
    ka: ["Bufo viridis", "Pseudepidalea viridis", "Bufotes sitibundus"],
  },
  "buteo-buteo": {
    en: [
      "Eurasian buzzard",
      "steppe buzzard",
      "common eagle",
      "Buteo buteo vulpinus",
      "Buteo buteo menetriesi",
      "Falco buteo",
    ],
    ka: [
      "კაკაჩა",
      "ჩვეულებრივი არწივი",
      "სტეპის კაკაჩა",
      "ქორისებრნი",
      "Buteo buteo vulpinus",
      "Buteo buteo menetriesi",
      "Falco buteo",
    ],
  },
  "canis-aureus": {
    en: [
      "common jackal",
      "Asiatic jackal",
      "Eurasian golden jackal",
      "Canis aureus moreoticus",
      "Canis aureus caucasica",
    ],
    ka: [
      "ტურა",
      "ოქროს ტურა",
      "Canis aureus moreoticus",
      "Canis aureus caucasica",
    ],
  },
  "canis-lupus": {
    en: [
      "gray wolf",
      "wolf",
      "timber wolf",
      "Canis lupus cubanensis",
      "Canis lupus lupus",
      "Caucasus wolf",
    ],
    ka: [
      "მგელი",
      "რუხი მგელი",
      "ნაცრისფერი მგელი",
      "Canis lupus cubanensis",
      "Canis lupus lupus",
    ],
  },
  "capra-aegagrus": {
    en: [
      "bezoar goat",
      "bezoar ibex",
      "wild goat",
      "Capra aegagrus aegagrus",
      "Capra hircus aegagrus",
    ],
    ka: [
      "ველური თხა",
      "ბეზოარული თხა",
      "Capra aegagrus aegagrus",
      "Capra hircus aegagrus",
    ],
  },
  "capreolus-capreolus": {
    en: [
      "roe deer",
      "western roe deer",
      "European roe",
      "Cervus capreolus",
      "Capreolus capreolus caucasicus",
    ],
    ka: [
      "შველი",
      "ევროპული შველი",
      "ნუკრი",
      "Cervus capreolus",
      "Capreolus capreolus caucasicus",
    ],
  },
  "ciconia-ciconia": {
    en: [
      "western white stork",
      "European white stork",
      "stork",
      "Ciconia ciconia ciconia",
      "Ardea ciconia",
    ],
    ka: [
      "ლაკლაკი",
      "ყარყატი",
      "თეთრი ლაკლაკი",
      "Ciconia ciconia ciconia",
      "Ardea ciconia",
    ],
  },
  "columba-palumbus": {
    en: [
      "woodpigeon",
      "wood pigeon",
      "common wood pigeon",
      "common wood-pigeon",
      "Columba palumbus palumbus",
    ],
    ka: [
      "ტყის მტრედი",
      "მტრედისებრნი",
      "მტრედისნაირნი",
      "Columba palumbus palumbus",
    ],
  },
  "corvus-corax": {
    en: ["common raven", "raven", "Northern Raven", "Corvus corax corax"],
    ka: ["ყორნისებრნი", "ჩრდილოეთის ყორანი", "Corvus corax corax", "ворон"],
  },
  "coturnix-coturnix": {
    en: [
      "European quail",
      "Eurasian quail",
      "Coturnix coturnix coturnix",
      "Tetrao coturnix",
    ],
    ka: [
      "ჩვეულებრივი მწყერი",
      "ხოხბისებრნი",
      "ქათმისნაირნი",
      "Coturnix coturnix coturnix",
      "перепел",
    ],
  },
  "cuculus-canorus": {
    en: [
      "European cuckoo",
      "Eurasian cuckoo",
      "cuckoo",
      "Cuculus canorus canorus",
    ],
    ka: ["ჩვეულებრივი გუგული", "გუგულისებრნი", "Cuculus canorus canorus"],
  },
  "dendrocopos-major": {
    en: [
      "great spotted woodpecker",
      "Greater Spotted Woodpecker",
      "pied woodpecker",
      "Dendrocopos major tenuirostris",
    ],
    ka: [
      "ჭრელი კოდალა",
      "კოდალა",
      "კავკასიური დიდი ჭრელი კოდალა",
      "Dendrocopos major tenuirostris",
    ],
  },
  "emberiza-citrinella": {
    en: ["yellow bunting", "Emberiza citrinella erythrogenys"],
    ka: [
      "მოყვითალო გრატა",
      "ქეროზა",
      "რუხი გულწითელა",
      "Emberiza citrinella erythrogenys",
    ],
  },
  "emys-orbicularis": {
    en: ["European pond terrapin", "pond turtle", "Emys orbicularis persica"],
    ka: ["ევროპული ჭაობის კუ", "Emys orbicularis persica"],
  },
  "erinaceus-concolor": {
    en: [
      "European hedgehog",
      "eastern hedgehog",
      "white-breasted hedgehog",
      "white-chested hedgehog",
      "Erinaceus europaeus",
      "Erinaceus concolor transcaucasicus",
      "Erinaceus europaeus transcaucasicus",
    ],
    ka: [
      "აღმოსავლეთევროპული ზღარბი",
      "თეთრმკერდა ზღარბი",
      "სამხრეთული თეთრმკერდა ზღარბი",
      "ზღარბი",
      "Erinaceus europaeus",
      "Erinaceus concolor transcaucasicus",
      "Erinaceus europaeus transcaucasicus",
    ],
  },
  "erithacus-rubecula": {
    en: [
      "robin",
      "robin redbreast",
      "Eurasian robin",
      "Motacilla rubecula",
      "Erithacus rubecula caucasicus",
    ],
    ka: [
      "ბულწითელა",
      "მემატლიასებრნი",
      "Motacilla rubecula",
      "Erithacus rubecula caucasicus",
    ],
  },
  "falco-peregrinus": {
    en: [
      "peregrine",
      "Peregrine Falcon",
      "Falconidae",
      "Falco peregrinus brookei",
      "Falco peregrinus peregrinus",
    ],
    ka: [
      "ჩვეულებრივი შავარდენი",
      "შავარდნისებრნი",
      "შავარდნისნაირნი",
      "Falco peregrinus brookei",
      "საპსანი",
    ],
  },
  "ficedula-hypoleuca": {
    en: [
      "pied flycatcher",
      "western pied flycatcher",
      "Motacilla hypoleuca",
      "Muscicapa hypoleuca",
      "Ficedula hypoleuca hypoleuca",
    ],
    ka: [
      "ჭრელი ბუზიჭერია",
      "მემატლიასებრნი",
      "Motacilla hypoleuca",
      "Muscicapa hypoleuca",
    ],
  },
  "ficedula-semitorquata": {
    en: [
      "semicollared flycatcher",
      "half-collared flycatcher",
      "Muscicapa semitorquata",
    ],
    ka: [
      "ნახევართეთრყელა მემატლია",
      "ნახევართეთრყელა ბუზიჭერია",
      "მემატლიასებრნი",
      "Muscicapa semitorquata",
    ],
  },
  "glareola-pratincola": {
    en: [
      "common pratincole",
      "red-winged pratincole",
      "pratincole",
      "Hirundo pratincola",
    ],
    ka: [
      "მერცხალა",
      "ჟღალფრთიანა მერცხალა",
      "მერცხალასებრნი",
      "Hirundo pratincola",
    ],
  },
  "gyps-fulvus": {
    en: [
      "Eurasian griffon",
      "Eurasian Griffon Vulture",
      "griffon",
      "Gyps fulvus fulvus",
      "Vultur fulvus",
    ],
    ka: [
      "ჩვეულებრივი ორბი",
      "თეთრთავა ორბი",
      "ლეშიჭამია",
      "ქორისებრნი",
      "Gyps fulvus fulvus",
      "Vultur fulvus",
    ],
  },
  "jynx-torquilla": {
    en: [
      "wryneck",
      "northern wryneck",
      "European wryneck",
      "Jynx torquilla torquilla",
    ],
    ka: ["ჩვეულებრივი მაქცია", "კოდალასებრნი", "Jynx torquilla torquilla"],
  },
  "larus-fuscus": {
    en: [
      "Baltic Gull",
      "Heuglin's Gull",
      "lesser blackback",
      "Larus fuscus fuscus",
      "Larus heuglini",
    ],
    ka: [
      "შავზურგა თოლია",
      "თოლიასებრნი",
      "Larus fuscus fuscus",
      "Larus heuglini",
    ],
  },
  "latrodectus-tredecimguttatus": {
    en: [
      "Mediterranean black widow",
      "European black widow",
      "black widow Georgia",
      "karakurt",
      "Latrodectus tredecimguttatus",
      "Latrodectus mactans",
    ],
    ka: [
      "ყარაყურთი",
      "შავი ქვრივი",
      "ხმელთაშუაზღვის შავი ქვრივი",
      "ევროპული შავი ქვრივი",
      "Latrodectus tredecimguttatus",
      "Latrodectus mactans",
      "каракурт",
    ],
  },
  "lissotriton-lantzi": {
    en: [
      "Caucasian newt",
      "Lantz's newt",
      "smooth newt",
      "Triturus vulgaris lantzi",
      "Lissotriton vulgaris lantzi",
    ],
    ka: [
      "ჩვეულებრივი ტრიტონი",
      "გლუვი ტრიტონი",
      "Triturus vulgaris lantzi",
      "Lissotriton vulgaris lantzi",
    ],
  },
  "luscinia-megarhynchos": {
    en: [
      "nightingale",
      "rufous nightingale",
      "Caucasian nightingale",
      "Luscinia megarhynchos africana",
    ],
    ka: [
      "სამხრეთული ბულბული",
      "სამხრული ბულბული",
      "იადონი",
      "მემატლიასებრნი",
      "Luscinia megarhynchos africana",
    ],
  },
  "lutra-lutra": {
    en: [
      "European otter",
      "common otter",
      "European river otter",
      "Mustela lutra",
      "Lutra vulgaris",
      "Lutra lutra meridionalis",
    ],
    ka: [
      "წავი",
      "ევრაზიული წავი",
      "Mustela lutra",
      "Lutra vulgaris",
      "Lutra lutra meridionalis",
    ],
  },
  "lynx-lynx": {
    en: [
      "European lynx",
      "Caucasian lynx",
      "Caucasus lynx",
      "Lynx lynx dinniki",
      "Felis lynx",
    ],
    ka: [
      "ევრაზიული ფოცხვერი",
      "კავკასიური ფოცხვერი",
      "Lynx lynx dinniki",
      "Felis lynx",
    ],
  },
  "meles-canescens": {
    en: [
      "European badger",
      "Eurasian badger",
      "Southwest Asian badger",
      "Transcaucasian badger",
      "Meles meles",
      "Meles meles minor",
    ],
    ka: [
      "ევროპული მაჩვი",
      "Meles meles",
      "Meles meles minor",
      "Meles canescens",
      "კავკასიური მაჩვი",
    ],
  },
  "mertensiella-caucasica": {
    en: ["Caucasian salamander", "Salamandra caucasica"],
    ka: ["Salamandra caucasica"],
  },
  "milvus-migrans": {
    en: [
      "Eurasian black kite",
      "black kite Georgia",
      "fork-tailed kite",
      "Milvus korschun",
      "Falco migrans",
      "Milvus migrans migrans",
    ],
    ka: [
      "ძერა",
      "ქორისებრნი",
      "Milvus korschun",
      "Falco migrans",
      "Milvus migrans migrans",
    ],
  },
  "motacilla-alba": {
    en: [
      "pied wagtail",
      "white wagtail",
      "Motacilla alba alba",
      "Motacillidae",
    ],
    ka: ["ბოლოქანქარა", "ბოლოქანქარასებრნი", "Motacilla alba alba"],
  },
  "mustela-nivalis": {
    en: [
      "weasel",
      "common weasel",
      "little weasel",
      "Putorius nivalis",
      "Mustela nivalis caucasica",
      "Mustela nivalis dinniki",
    ],
    ka: [
      "სინდიოფალა",
      "Putorius nivalis",
      "Mustela nivalis caucasica",
      "Mustela nivalis dinniki",
    ],
  },
  "natrix-tessellata": {
    en: [
      "dice snake",
      "tessellated water snake",
      "water snake Georgia",
      "non-venomous water snake",
    ],
    ka: ["წყლის ანკარა", "წყლის გველი", "უშხამო ანკარა", "dice snake"],
  },
  "ommatotriton-ophryticus": {
    en: [
      "newt Georgia",
      "Caucasian banded newt",
      "northern banded newt",
      "Asia Minor newt",
      "banded newt",
      "Triturus vittatus",
      "Triturus vittatus ophryticus",
    ],
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
  },
  "otus-scops": {
    en: [
      "European scops owl",
      "common scops owl",
      "Eurasian Scops-Owl",
      "Strix scops",
      "Otus scops scops",
    ],
    ka: ["წყრომი", "ბუსებრნი", "Strix scops", "Otus scops scops"],
  },
  "panthera-pardus": {
    en: [
      "Persian leopard",
      "Anatolian leopard",
      "leopard",
      "vepkhi",
      "Panthera pardus tulliana",
      "Panthera pardus ciscaucasica",
      "Panthera pardus saxicolor",
    ],
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
  },
  "pernis-apivorus": {
    en: [
      "honey buzzard",
      "European Honey-buzzard",
      "wasp buzzard",
      "pern",
      "Falco apivorus",
    ],
    ka: [
      "კვერნაჭამია",
      "კრაზანაჭამია",
      "ირაო",
      "ჩვეულებრივი ბოლოკარკაზი",
      "ცუდქორა",
      "ქორისებრნი",
      "Falco apivorus",
    ],
  },
  "phasianus-colchicus": {
    en: [
      "Colchic pheasant",
      "black-necked pheasant",
      "ring-necked pheasant",
      "Phasianus colchicus colchicus",
    ],
    ka: [
      "კოლხური ხოხობი",
      "ხოხბისებრნი",
      "Phasianus colchicus colchicus",
      "фазан",
    ],
  },
  "picus-viridis": {
    en: [
      "green woodpecker",
      "Eurasian green woodpecker",
      "yaffle",
      "Picus viridis karelini",
    ],
    ka: ["კოდალა", "სამხრული მწვანე კოდალა", "Picus viridis karelini"],
  },
  "procyon-lotor": {
    en: [
      "common raccoon",
      "northern raccoon",
      "North American raccoon",
      "racoon",
    ],
    ka: ["ჩვეულებრივი ენოტი", "ჩრდილოამერიკული ენოტი", "Procyon lotor"],
  },
  "sciurus-anomalus": {
    en: [
      "Persian squirrel",
      "golden squirrel",
      "Transcaucasian squirrel",
      "Sciurus persicus",
      "Sciurus anomalus anomalus",
    ],
    ka: [
      "სპარსული ციყვი",
      "ციყვი",
      "Sciurus persicus",
      "Sciurus anomalus anomalus",
    ],
  },
  "steatoda-paykulliana": {
    en: ["false black widow", "false widow", "Steatoda paykulliana"],
    ka: ["ცრუ ყარაყურთი", "ცრუ შავი ქვრივი", "Steatoda paykulliana"],
  },
  "streptopelia-turtur": {
    en: [
      "turtle dove",
      "European turtle-dove",
      "turtle-dove",
      "Streptopelia turtur turtur",
      "Streptopelia turtur arenicola",
    ],
    ka: [
      "ჩვეულებრივი გვრიტი",
      "მტრედისებრნი",
      "Streptopelia turtur turtur",
      "Streptopelia turtur arenicola",
    ],
  },
  "strix-aluco": {
    en: [
      "brown owl",
      "Eurasian tawny owl",
      "forest owl",
      "Strix aluco willkonskii",
    ],
    ka: [
      "ტყის ბუ",
      "რუხი ბუ",
      "ჩვეულებრივი ტყის ბუ",
      "ბუსებრნი",
      "Strix aluco willkonskii",
    ],
  },
  "sus-scrofa": {
    en: [
      "Eurasian wild pig",
      "wild pig",
      "wild swine",
      "Sus scrofa attila",
      "Sus scrofa domesticus",
    ],
    ka: ["ტახი", "ნეზვი", "გოჭი", "Sus scrofa attila", "Sus scrofa domesticus"],
  },
  "triturus-karelinii": {
    en: [
      "southern crested newt",
      "Karelin's crested newt",
      "Triturus cristatus karelinii",
      "crested newt",
    ],
    ka: [
      "სავარცხლიანი ტრიტონი",
      "Triturus cristatus karelinii",
      "southern crested newt",
    ],
  },
  "turdus-merula": {
    en: [
      "Eurasian blackbird",
      "European blackbird",
      "blackbird",
      "Turdus merula aterrimus",
    ],
    ka: [
      "შაშვი",
      "შაშვისებრნი",
      "Turdus merula aterrimus",
      "Turdus merula merula",
    ],
  },
  "tyto-alba": {
    en: [
      "barn owl",
      "Western Barn Owl",
      "Common Barn Owl",
      "Tyto alba guttata",
      "Tyto alba erlangeri",
      "Strix alba",
    ],
    ka: [
      "ბუხრინწა",
      "ბუსებრნი",
      "Tyto alba guttata",
      "Tyto alba erlangeri",
      "Strix alba",
    ],
  },
  "upupa-epops": {
    en: ["hoopoe", "common hoopoe", "European hoopoe", "Upupa epops epops"],
    ka: [
      "ჩვეულებრივი ოფოფი",
      "ოფოფისებრნი",
      "ყაპყაპისნაირნი",
      "Upupa epops epops",
    ],
  },
  "ursus-arctos": {
    en: [
      "grizzly",
      "Eurasian brown bear",
      "Ursus arctos arctos",
      "Ursus arctos syriacus",
      "Ursus arctos caucasicus",
    ],
    ka: [
      "დათვი",
      "მურა",
      "Ursus arctos arctos",
      "Ursus arctos syriacus",
      "Ursus arctos caucasicus",
    ],
  },
  "vulpes-vulpes": {
    en: [
      "common fox",
      "cross fox",
      "silver fox",
      "Canis vulpes",
      "Vulpes vulpes caucasica",
      "Vulpes vulpes alpherakyi",
    ],
    ka: [
      "ჩვეულებრივი მელა",
      "წითელი მელა",
      "Canis vulpes",
      "Vulpes vulpes caucasica",
      "Vulpes vulpes alpherakyi",
    ],
  },
};

export type SeoDefinedTerm = {
  en: string;
  ka: string;
  ru?: string;
  speciesId: string;
  tr?: string;
};

export function siteKeywords(locale: AppLocale) {
  if (locale === "en") {
    return [
      "animals of Georgia",
      "Georgia reptiles",
      "Caucasus reptiles",
      "species atlas",
    ];
  }
  if (locale === "ru") {
    return [
      "животные Грузии",
      "рептилии Грузии",
      "рептилии Кавказа",
      "атлас видов",
    ];
  }
  if (locale === "tr") {
    return [
      "Gürcistan hayvanları",
      "Gürcistan sürüngenleri",
      "Kafkasya sürüngenleri",
      "tür atlası",
    ];
  }
  return [
    "საქართველოს ცხოველები",
    "ცხოველთა ატლასი",
    "ქვეწარმავლები",
    "საქართველოს ქვეწარმავლები",
    "კავკასია",
  ];
}

export function speciesAliasKeywords(id: string, locale: AppLocale) {
  const aliases = SPECIES_ALIASES[id];
  if (!aliases) return [];
  return locale === "ka" ? aliases.ka : aliases.en;
}

export function speciesJsonLdKeywords(species: Species, locale: AppLocale) {
  return speciesSeoKeywords(species, locale).join(", ");
}

export function speciesSeoAnchor(commonName: string, scientificName: string) {
  return `${commonName} (${scientificName})`;
}

export function speciesSeoKeywords(species: Species, locale: AppLocale) {
  return uniqueKeywords([
    species.commonName,
    species.scientificName,
    species.genus,
    species.family,
    ...speciesAliasKeywords(species.id, locale),
    georgiaPlaceName(locale),
    caucasusPlaceName(locale),
  ]);
}

export function uniqueKeywords(values: Array<null | string | undefined>) {
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

export const HOME_DEFINED_TERMS: SeoDefinedTerm[] = [
  {
    en: "Levantine viper",
    ka: "გიურზა",
    speciesId: "macrovipera-lebetina",
  },
  {
    en: "Dinnik's viper",
    ka: "დინიკის გველგესლა",
    speciesId: "vipera-dinniki",
  },
  {
    en: "Caucasus viper",
    ka: "კავკასიური გველგესლა",
    speciesId: "vipera-kaznakovi",
  },
  {
    en: "Nose-horned viper",
    ka: "ცხვირრქოსანი გველგესლა",
    speciesId: "vipera-transcaucasiana",
  },
  {
    en: "Darevsky's viper",
    ka: "დარევსკის გველგესლა",
    speciesId: "vipera-darevskii",
  },
  {
    en: "eastern steppe viper",
    ka: "ველის გველგესლა",
    speciesId: "vipera-renardi",
  },
  {
    en: "European glass lizard",
    ka: "გველხოკერა",
    speciesId: "pseudopus-apodus",
  },
  {
    en: "Dahl's whip snake",
    ka: "წენგოსფერი მცურავი",
    speciesId: "platyceps-najadum",
  },
  {
    en: "steppe ratsnake",
    ka: "სახეებიანი მცურავი",
    speciesId: "elaphe-dione",
  },
  {
    en: "European cat snake",
    ka: "კატისთვალა",
    speciesId: "telescopus-fallax",
  },
  {
    en: "Aesculapian snake",
    ka: "ესკულაპის მცურავი",
    speciesId: "zamenis-longissimus",
  },
];
