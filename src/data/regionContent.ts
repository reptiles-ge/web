import type { RegionPathId } from "@/data/georgia-paths";
import type { LocalizedText } from "@/data/regions";

export type RegionFaq = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type RegionContent = {
  overview: LocalizedText;
  habitats: LocalizedText[];
  biome: LocalizedText;
  relatedIds: RegionPathId[];
  faq: RegionFaq[];
};

export const regionContent: Record<RegionPathId, RegionContent> = {
  abkhazia: {
    biome: { ka: "კოლხური · მთისწინეთი", en: "Colchic · foothills" },
    overview: {
      ka: "აფხაზეთი აერთიანებს შავი ზღვის სანაპიროს, კოლხურ ტყეებს და კავკასიონის მთისწინეთს. ნოტიო ჰავა და ფრაგმენტირებული მთის ჰაბიტატები ხელს უწყობს როგორც დაბლობის, ისე მაღალმთის სახეობებს — მათ შორის კავკასიურ და დინიკის გველგესლებს.",
      en: "Abkhazia joins the Black Sea coast, Colchic forests, and Caucasus foothills. Humid climate and fragmented montane habitats support both lowland and highland taxa — including Caucasian and Dinnik’s vipers.",
    },
    habitats: [
      { ka: "შავი ზღვის სანაპირო და ტენიანი დაბლობი", en: "Black Sea coast and humid lowlands" },
      { ka: "კოლხური ტყეები", en: "Colchic forests" },
      { ka: "კავკასიონის მთისწინეთი", en: "Caucasus foothills" },
    ],
    relatedIds: ["samegrelo", "racha", "guria"],
    faq: [
      {
        question: {
          ka: "რა გველები გვხვდება აფხაზეთში?",
          en: "Which snakes occur in Abkhazia?",
        },
        answer: {
          ka: "რეგიონში დაფიქსირებულია კავკასიური და დინიკის გველგესლები, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. ზუსტი სია იცვლება ჰაბიტატისა და სიმაღლის მიხედვით.",
          en: "Recorded taxa include Caucasian and Dinnik’s vipers, grass snake and dice snake, smooth snake, and European glass lizard. Exact lists vary by habitat and elevation.",
        },
      },
      {
        question: {
          ka: "არის თუ არა შხამიანი გველი აფხაზეთში?",
          en: "Are there venomous snakes in Abkhazia?",
        },
        answer: {
          ka: "დიახ — კავკასიური გველგესლა (Vipera kaznakovi) და დინიკის გველგესლა (Vipera dinniki) შხამიანია. შეხვედრისას დაიცავით მანძილი და არ სცადოთ დაჭერა.",
          en: "Yes — Caucasian viper (Vipera kaznakovi) and Dinnik’s viper (Vipera dinniki) are venomous. Keep distance and never attempt to handle them.",
        },
      },
    ],
  },
  samegrelo: {
    biome: { ka: "კოლხეთი · სვანეთი", en: "Colchis · Svaneti" },
    overview: {
      ka: "სამეგრელო — ზემო სვანეთი გადაჭიმულია კოლხეთის დაბლობიდან სვანეთის მაღალმთამდე. ერთ რეგიონში ხვდება ტენიანი ტყეები, მდინარის ხეობები და ალპური ზონა — ამიტომ ფაუნა ვერტიკალურად იცვლება.",
      en: "Samegrelo — Zemo Svaneti stretches from the Colchis lowlands to high Svaneti. Humid forests, river valleys, and alpine belts meet in one region — so fauna shifts with elevation.",
    },
    habitats: [
      { ka: "კოლხეთის დაბლობი", en: "Colchis lowlands" },
      { ka: "მდინარის ხეობები", en: "River valleys" },
      { ka: "სვანეთის მაღალმთა", en: "High Svaneti" },
    ],
    relatedIds: ["abkhazia", "guria", "racha", "imereti"],
    faq: [
      {
        question: {
          ka: "რა გველები გვხვდება სამეგრელოში?",
          en: "Which snakes live in Samegrelo?",
        },
        answer: {
          ka: "დაბლობსა და ტენიან ზონაში უფრო ხშირია კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. მაღალმთაში სპექტრი იცვლება.",
          en: "In humid lowlands, Caucasian viper, grass snake and dice snake, smooth snake, and glass lizard are more typical. The suite changes at higher elevations.",
        },
      },
    ],
  },
  guria: {
    biome: { ka: "კოლხური · სუბტროპიკული", en: "Colchic · subtropical" },
    overview: {
      ka: "გურია ნოტიო სუბტროპიკული კოლხური ტყეებითა და მდინარის ხეობებით გამოირჩევა. აქ დომინირებს ტენიანობის მოყვარული ფაუნა — აღმოსავლეთის მშრალი ზონის სახეობები თითქმის არ გვხვდება.",
      en: "Guria is defined by humid subtropical Colchic forests and river valleys. Moisture-loving fauna dominates — eastern arid-zone species are largely absent.",
    },
    habitats: [
      { ka: "კოლხური ტყეები", en: "Colchic forests" },
      { ka: "მდინარის ხეობები", en: "River valleys" },
    ],
    relatedIds: ["adjara", "samegrelo", "imereti"],
    faq: [
      {
        question: {
          ka: "არის თუ არა შხამიანი გველი გურიაში?",
          en: "Are there venomous snakes in Guria?",
        },
        answer: {
          ka: "დიახ — კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. ჩვეულებრივი და წყლის ანკარა და სპილენძა უვნებელია ადამიანისთვის.",
          en: "Yes — Caucasian viper (Vipera kaznakovi) is venomous. Grass snake, dice snake, and smooth snake are harmless to humans.",
        },
      },
    ],
  },
  adjara: {
    biome: { ka: "კოლხური · სანაპირო", en: "Colchic · coastal" },
    overview: {
      ka: "აჭარა დასავლეთ საქართველოს ერთ-ერთი ყველაზე ტენიანი ჰერპეტოლოგიური ზონაა. ნოტიო სუბტროპიკული ტყეები, მთიანი ხეობები და შავი ზღვის სანაპირო ქმნის გარემოს, სადაც კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა ერთმანეთს ემთხვევა. აღმოსავლეთის მშრალი ზონის სახეობები აქ თითქმის არ გვხვდება.",
      en: "Adjara is one of western Georgia’s most humid herpetological zones. Subtropical forests, mountain valleys, and the Black Sea coast bring together Caucasian viper, grass snake and dice snake, smooth snake, and glass lizard. Eastern arid-zone taxa are largely absent.",
    },
    habitats: [
      { ka: "ნოტიო სუბტროპიკული ტყეები", en: "Humid subtropical forests" },
      { ka: "მთიანი ხეობები", en: "Mountain valleys" },
      { ka: "შავი ზღვის სანაპირო", en: "Black Sea coast" },
    ],
    relatedIds: ["guria", "samtskhe-javakheti", "samegrelo"],
    faq: [
      {
        question: {
          ka: "რა გველები გვხვდება აჭარაში?",
          en: "Which snakes live in Adjara?",
        },
        answer: {
          ka: "აჭარაში დაფიქსირებულია კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. სია ეფუძნება რეგიონულ ჩანაწერებს და შეიძლება განახლდეს ახალი დაკვირვებებით.",
          en: "Adjara records include Caucasian viper, grass snake and dice snake, smooth snake, and European glass lizard. Lists are based on regional records and may grow with new observations.",
        },
      },
      {
        question: {
          ka: "არის თუ არა შხამიანი გველი აჭარაში?",
          en: "Are there venomous snakes in Adjara?",
        },
        answer: {
          ka: "დიახ — კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. სხვა ჩამოთვლილი სახეობები ადამიანისთვის უვნებელია, თუმცა ყველა გველს სიფრთხილით მოეკიდეთ.",
          en: "Yes — Caucasian viper (Vipera kaznakovi) is venomous. Other listed species are harmless to humans, but treat every snake with caution.",
        },
      },
      {
        question: {
          ka: "სად გვხვდება კავკასიური გველგესლა აჭარაში?",
          en: "Where does the Caucasian viper occur in Adjara?",
        },
        answer: {
          ka: "ის უპირატესად ტენიან ტყეებსა და მთისწინეთს უკავშირდება. ზუსტი ლოკაციები ფრაგმენტირებულია — სრული პროფილი იხილეთ სახეობის გვერდზე.",
          en: "It is tied mainly to humid forests and foothills. Localities are fragmented — see the full species profile for details.",
        },
      },
      {
        question: {
          ka: "როდის არის გველები უფრო აქტიური აჭარაში?",
          en: "When are snakes most active in Adjara?",
        },
        answer: {
          ka: "აქტივობა იზრდება გაზაფხულიდან შემოდგომამდე, განსაკუთრებით თბილ, ნოტიო ამინდში. ზამთარში უმეტესობა იმალება ან ნაკლებად აქტიურია.",
          en: "Activity rises from spring through autumn, especially in warm, humid weather. In winter most individuals shelter or reduce activity.",
        },
      },
    ],
  },
  imereti: {
    biome: { ka: "კარსტი · რიონის აუზი", en: "Karst · Rioni basin" },
    overview: {
      ka: "იმერეთი კარსტული მთებით, ტყიანი ხეობებითა და რიონის აუზით აკავშირებს დასავლეთ საქართველოს ჰაბიტატებს. აქ კოლხური გავლენა ჯერ კიდევ ძლიერია, მაგრამ უკვე ჩნდება უფრო კონტინენტური ელემენტებიც.",
      en: "Imereti links western Georgian habitats through karst mountains, wooded valleys, and the Rioni basin. Colchic influence remains strong, with more continental elements appearing inland.",
    },
    habitats: [
      { ka: "კარსტული მთები", en: "Karst mountains" },
      { ka: "ტყიანი ხეობები", en: "Wooded valleys" },
      { ka: "რიონის აუზი", en: "Rioni basin" },
    ],
    relatedIds: ["guria", "samegrelo", "racha", "samtskhe-javakheti"],
    faq: [
      {
        question: {
          ka: "რა გველები გვხვდება იმერეთში?",
          en: "Which snakes occur in Imereti?",
        },
        answer: {
          ka: "ჩანაწერებშია კავკასიური გველგესლა, სპილენძა, ჩვეულებრივი და წყლის ანკარა, გველხოკერა და ურარტუს მცურავი.",
          en: "Records include Caucasian viper, smooth snake, grass snake and dice snake, glass lizard, and Urartian ratsnake.",
        },
      },
    ],
  },
  racha: {
    biome: { ka: "მაღალმთა · სუბალპური", en: "High mountain · subalpine" },
    overview: {
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთი მაღალმთიანი ტყეებით, სუბალპური მდელოებითა და კლდოვანი ხეობებით გამოირჩევა. აქ მთის სახეობები — მათ შორის დინიკის გველგესლა — უფრო დამახასიათებელია, ვიდრე დაბლობის ფაუნა.",
      en: "Racha — Lechkhumi — Kvemo Svaneti is defined by high forests, subalpine meadows, and rocky gorges. Montane taxa such as Dinnik’s viper are more characteristic than lowland fauna.",
    },
    habitats: [
      { ka: "მაღალმთიანი ტყეები", en: "High-mountain forests" },
      { ka: "სუბალპური მდელოები", en: "Subalpine meadows" },
      { ka: "კლდოვანი ხეობები", en: "Rocky gorges" },
    ],
    relatedIds: ["samegrelo", "imereti", "mtskheta-mtianeti"],
    faq: [
      {
        question: {
          ka: "არის თუ არა შხამიანი გველი რაჭაში?",
          en: "Are there venomous snakes in Racha?",
        },
        answer: {
          ka: "დიახ — დინიკის გველგესლა (Vipera dinniki) შხამიანია და მაღალმთის ჰაბიტატებს უკავშირდება.",
          en: "Yes — Dinnik’s viper (Vipera dinniki) is venomous and tied to high-mountain habitats.",
        },
      },
    ],
  },
  "samtskhe-javakheti": {
    biome: { ka: "ვულკანური პლატო", en: "Volcanic plateau" },
    overview: {
      ka: "სამცხე — ჯავახეთი ვულკანური პლატოებით, მთის ტბებითა და მშრალი მთისწინეთით გამოირჩევა. ღია, ხშირად ცივი ჰაბიტატები განსხვავდება კოლხური დასავლეთისგან — აქ უფრო ხშირია ცხვირრქოსანი გველგესლა და სწრაფი მცურავები.",
      en: "Samtskhe — Javakheti features volcanic plateaus, highland lakes, and dry foothills. Open, often cool habitats differ from Colchic west Georgia — nose-horned viper and agile racers are more typical.",
    },
    habitats: [
      { ka: "ვულკანური პლატოები", en: "Volcanic plateaus" },
      { ka: "მთის ტბები", en: "Highland lakes" },
      { ka: "მშრალი მთისწინეთი", en: "Dry foothills" },
    ],
    relatedIds: ["adjara", "imereti", "kvemo-kartli", "shida-kartli"],
    faq: [
      {
        question: {
          ka: "რა შხამიანი გველებია სამცხე-ჯავახეთში?",
          en: "Which venomous snakes occur in Samtskhe-Javakheti?",
        },
        answer: {
          ka: "ცხვირრქოსანი გველგესლა (Vipera ammodytes) შხამიანია. სხვა ჩამოთვლილი სახეობების უმეტესობა უვნებელია.",
          en: "Nose-horned viper (Vipera ammodytes) is venomous. Most other listed species are harmless.",
        },
      },
    ],
  },
  "shida-kartli": {
    biome: { ka: "ვაკე · მტკვრის ხეობა", en: "Plain · Mtkvari valley" },
    overview: {
      ka: "შიდა ქართლი ვაკით, მთისწინეთითა და მტკვრის ხეობით აერთიანებს მშრალ და ნახევრად ნოტიო ზონებს. აქ იკვეთება დასავლეთისა და აღმოსავლეთის ფაუნის ელემენტები — ცხვირრქოსანი გველგესლიდან სწრაფ მცურავებამდე.",
      en: "Shida Kartli bridges dry and semi-humid zones via plains, foothills, and the Mtkvari valley. Western and eastern faunal elements meet — from nose-horned viper to fast racers.",
    },
    habitats: [
      { ka: "შიდა ქართლის ვაკე", en: "Shida Kartli plain" },
      { ka: "მთისწინეთი", en: "Foothills" },
      { ka: "მტკვრის ხეობა", en: "Mtkvari valley" },
    ],
    relatedIds: ["mtskheta-mtianeti", "kvemo-kartli", "samtskhe-javakheti", "imereti"],
    faq: [
      {
        question: {
          ka: "რა გველები გვხვდება შიდა ქართლში?",
          en: "Which snakes occur in Shida Kartli?",
        },
        answer: {
          ka: "ჩანაწერებშია ცხვირრქოსანი გველგესლა, ურარტუს მცურავი, წითელმუცელა მცურავი, წყლის ანკარა, გველხოკერა, წენგოსფერი მცურავი და კატისთვალა.",
          en: "Records include nose-horned viper, Urartian ratsnake, red-bellied racer, dice snake, glass lizard, Dahl’s whip snake, and cat snake.",
        },
      },
    ],
  },
  "mtskheta-mtianeti": {
    biome: { ka: "დიდი კავკასიონი", en: "Greater Caucasus" },
    overview: {
      ka: "მცხეთა — მთიანეთი დიდი კავკასიონის მთებით, ტყის ზედა ზონითა და სუბალპური მდელოებით გამოირჩევა. ეს არის მთის რეპტილიების — მათ შორის დინიკის გველგესლას — კლასიკური არეალი.",
      en: "Mtskheta — Mtianeti covers Greater Caucasus peaks, the upper forest belt, and subalpine meadows. It is classic range for montane reptiles, including Dinnik’s viper.",
    },
    habitats: [
      { ka: "მაღალმთა", en: "High mountains" },
      { ka: "ტყის ზედა ზონა", en: "Upper forest belt" },
      { ka: "სუბალპური მდელოები", en: "Subalpine meadows" },
    ],
    relatedIds: ["racha", "shida-kartli", "kakheti", "tbilisi"],
    faq: [
      {
        question: {
          ka: "არის თუ არა შხამიანი გველი მცხეთა-მთიანეთში?",
          en: "Are there venomous snakes in Mtskheta-Mtianeti?",
        },
        answer: {
          ka: "დიახ — დინიკის გველგესლა (Vipera dinniki) შხამიანია და მაღალმთის ჰაბიტატებს უკავშირდება.",
          en: "Yes — Dinnik’s viper (Vipera dinniki) is venomous and associated with high-mountain habitats.",
        },
      },
    ],
  },
  "kvemo-kartli": {
    biome: { ka: "მშრალი ვაკე · მტკვარი", en: "Dry plain · Mtkvari" },
    overview: {
      ka: "ქვემო ქართლი მშრალი ვაკეებით, კლდოვანი მთისწინეთითა და მტკვრის აუზით ხელს უწყობს თბომოყვარე სახეობებს. აქ ჩნდება გიურზა — აღმოსავლეთ საქართველოს ერთ-ერთი ყველაზე მნიშვნელოვანი შხამიანი გველი.",
      en: "Kvemo Kartli’s dry plains, rocky foothills, and Mtkvari basin favor warmth-loving species. Here appears the Levantine viper — one of eastern Georgia’s most significant venomous snakes.",
    },
    habitats: [
      { ka: "მშრალი ვაკეები", en: "Dry plains" },
      { ka: "კლდოვანი მთისწინეთი", en: "Rocky foothills" },
      { ka: "მტკვრის აუზი", en: "Mtkvari basin" },
    ],
    relatedIds: ["tbilisi", "kakheti", "shida-kartli", "samtskhe-javakheti"],
    faq: [
      {
        question: {
          ka: "არის თუ არა გიურზა ქვემო ქართლში?",
          en: "Does Levantine viper occur in Kvemo Kartli?",
        },
        answer: {
          ka: "დიახ — Macrovipera lebetina შხამიანია და აღმოსავლეთის მშრალ/ნახევრად მშრალ ჰაბიტატებს უკავშირდება. დაიცავით მანძილი.",
          en: "Yes — Macrovipera lebetina is venomous and tied to eastern dry and semi-arid habitats. Keep your distance.",
        },
      },
    ],
  },
  kakheti: {
    biome: { ka: "ალაზანი · ნახევრად უდაბნო", en: "Alazani · semi-arid" },
    overview: {
      ka: "კახეთი ალაზნის ველით, მშრალი მთისწინეთითა და ნახევრად უდაბნო ზონებით ქმნის აღმოსავლეთ საქართველოს უნიკალურ ფაუნას. აქ დომინირებს თბომოყვარე და მშრალი ჰაბიტატის სახეობები — გიურზა, სწრაფი მცურავები და კატისთვალა.",
      en: "Kakheti’s Alazani valley, dry foothills, and semi-arid belts shape eastern Georgia’s distinctive fauna. Warmth-loving, dry-habitat taxa dominate — Levantine viper, fast racers, and cat snake.",
    },
    habitats: [
      { ka: "ალაზნის ველი", en: "Alazani valley" },
      { ka: "მშრალი მთისწინეთი", en: "Dry foothills" },
      { ka: "ნახევრად უდაბნო ზონები", en: "Semi-arid zones" },
    ],
    relatedIds: ["kvemo-kartli", "mtskheta-mtianeti", "tbilisi"],
    faq: [
      {
        question: {
          ka: "რა შხამიანი გველებია კახეთში?",
          en: "Which venomous snakes live in Kakheti?",
        },
        answer: {
          ka: "გიურზა (Macrovipera lebetina) შხამიანია. სხვა ჩამოთვლილი სახეობების უმეტესობა უვნებელია, თუმცა ამოცნობა მნიშვნელოვანია.",
          en: "Levantine viper (Macrovipera lebetina) is venomous. Most other listed species are harmless, but correct identification still matters.",
        },
      },
      {
        question: {
          ka: "რა გველები გვხვდება კახეთში?",
          en: "Which snakes occur in Kakheti?",
        },
        answer: {
          ka: "ჩანაწერებშია გიურზა, ურარტუს მცურავი, წითელმუცელა მცურავი, წყლის ანკარა, გველხოკერა, წენგოსფერი მცურავი და კატისთვალა.",
          en: "Records include Levantine viper, Urartian ratsnake, red-bellied racer, dice snake, glass lizard, Dahl’s whip snake, and cat snake.",
        },
      },
      {
        question: {
          ka: "განსხვავდება თუ არა კახეთის გველები აჭარისგან?",
          en: "Do Kakheti’s snakes differ from Adjara’s?",
        },
        answer: {
          ka: "დიახ — კახეთი მშრალი/ნახევრად მშრალი აღმოსავლეთის ფაუნას მიეკუთვნება, აჭარა კი ნოტიო კოლხურ ზონას. სახეობების ნაკრები მკვეთრად განსხვავდება.",
          en: "Yes — Kakheti belongs to the dry/semi-arid east, Adjara to the humid Colchic west. Species assemblages differ sharply.",
        },
      },
    ],
  },
  tbilisi: {
    biome: { ka: "ურბანული · მტკვარი", en: "Urban · Mtkvari" },
    overview: {
      ka: "თბილისში რეპტილიები ძირითადად ქალაქის მიმდებარე ხეობებში, პარკებსა და მდინარის პირას გვხვდება — არა ცენტრალურ უბნებში. აქ შეიძლება შეხვდეთ გიურზას, წითელმუცელა მცურავს, გველხოკერას და სხვა სახეობებს. ურბანული შეხვედრები იშვიათია, მაგრამ რეალურია.",
      en: "In Tbilisi, reptiles occur mainly in suburban valleys, parks, and riverside habitats — not dense city centers. Levantine viper, red-bellied racer, glass lizard, and others may appear. Urban encounters are uncommon but real.",
    },
    habitats: [
      { ka: "გარეუბნის ხეობები", en: "Suburban valleys" },
      { ka: "პარკები და გამწვანება", en: "Parks and green belts" },
      { ka: "მდინარის პირას ჰაბიტატები", en: "Riverside habitats" },
    ],
    relatedIds: ["kvemo-kartli", "mtskheta-mtianeti", "shida-kartli", "kakheti"],
    faq: [
      {
        question: {
          ka: "რა გველები ბინადრობენ თბილისში?",
          en: "Which snakes live in Tbilisi?",
        },
        answer: {
          ka: "ჩანაწერებშია გიურზა, წითელმუცელა მცურავი, გველხოკერა, სპილენძა, წყლის ანკარა და კატისთვალა — ძირითადად გარეუბნებსა და მდინარის პირას.",
          en: "Records include Levantine viper, red-bellied racer, glass lizard, smooth snake, dice snake, and cat snake — mainly in suburbs and riverside areas.",
        },
      },
      {
        question: {
          ka: "საშიშია თუ არა გველები თბილისში?",
          en: "Are snakes in Tbilisi dangerous?",
        },
        answer: {
          ka: "გიურზა შხამიანია. სხვები უვნებელია. თუ გველი ნახეთ — არ შეეხოთ, გადადგით ნაბიჯი უკან და საჭიროების შემთხვევაში დაუკავშირდით შესაბამის სამსახურებს.",
          en: "Levantine viper is venomous; others are harmless. If you see a snake — do not touch it, step back, and contact appropriate services if needed.",
        },
      },
      {
        question: {
          ka: "სად არის მეტი შანსი გველის ნახვის თბილისში?",
          en: "Where are snakes more likely around Tbilisi?",
        },
        answer: {
          ka: "მტკვრის პირას, კლდოვან ფერდობებზე, გარეუბნის ხეობებსა და ნაკლებად შეწუხებულ გამწვანებაში — არა შუა ქალაქის ქუჩებში.",
          en: "Along the Mtkvari, rocky slopes, suburban valleys, and less disturbed greenery — not busy central streets.",
        },
      },
    ],
  },
};

export function getRegionContent(id: RegionPathId): RegionContent {
  return regionContent[id];
}
