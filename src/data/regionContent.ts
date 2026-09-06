import type { RegionPathId } from "@/data/georgia-paths";
import type { LocalizedText } from "@/data/mapRegions";

export type RegionContent = {
  biome: LocalizedText;
  faq: RegionFaq[];
  habitats: LocalizedText[];
  overview: LocalizedText;
  relatedIds: RegionPathId[];
};

export type RegionFaq = {
  answer: LocalizedText;
  question: LocalizedText;
};

export const regionContent: Record<RegionPathId, RegionContent> = {
  abkhazia: {
    biome: { en: "Colchic · foothills", ka: "კოლხური · მთისწინეთი" },
    faq: [
      {
        answer: {
          en: "Recorded taxa include Caucasian and Dinnik’s vipers, grass snake and dice snake, smooth snake, and European glass lizard. Exact lists vary by habitat and elevation.",
          ka: "რეგიონში დაფიქსირებულია კავკასიური და დინიკის გველგესლები, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. ზუსტი სია იცვლება ჰაბიტატისა და სიმაღლის მიხედვით.",
        },
        question: {
          en: "Which snakes occur in Abkhazia?",
          ka: "რა გველები გვხვდება აფხაზეთში?",
        },
      },
      {
        answer: {
          en: "Yes — Caucasian viper (Vipera kaznakovi) and Dinnik’s viper (Vipera dinniki) are venomous. Keep distance and never attempt to handle them.",
          ka: "დიახ — კავკასიური გველგესლა (Vipera kaznakovi) და დინიკის გველგესლა (Vipera dinniki) შხამიანია. შეხვედრისას დაიცავით მანძილი და არ სცადოთ დაჭერა.",
        },
        question: {
          en: "Are there venomous snakes in Abkhazia?",
          ka: "არის თუ არა შხამიანი გველი აფხაზეთში?",
        },
      },
    ],
    habitats: [
      {
        en: "Black Sea coast and humid lowlands",
        ka: "შავი ზღვის სანაპირო და ტენიანი დაბლობი",
      },
      { en: "Colchic forests", ka: "კოლხური ტყეები" },
      { en: "Caucasus foothills", ka: "კავკასიონის მთისწინეთი" },
    ],
    overview: {
      en: "Abkhazia joins the Black Sea coast, Colchic forests, and Caucasus foothills. Humid climate and fragmented montane habitats support both lowland and highland taxa — including Caucasian and Dinnik’s vipers.",
      ka: "აფხაზეთი აერთიანებს შავი ზღვის სანაპიროს, კოლხურ ტყეებს და კავკასიონის მთისწინეთს. ნოტიო ჰავა და ფრაგმენტირებული მთის ჰაბიტატები ხელს უწყობს როგორც დაბლობის, ისე მაღალმთის სახეობებს — მათ შორის კავკასიურ და დინიკის გველგესლებს.",
    },
    relatedIds: ["samegrelo", "racha", "guria"],
  },
  adjara: {
    biome: { en: "Colchic · coastal", ka: "კოლხური · სანაპირო" },
    faq: [
      {
        answer: {
          en: "Adjara records include Caucasian viper, grass snake and dice snake, smooth snake, and European glass lizard; in the Lesser Caucasus (toward Shuakhevi) — nose-horned viper. Lists are based on regional records and may grow with new observations.",
          ka: "აჭარაში დაფიქსირებულია კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა; მცირე კავკასიონის მთიანეთში (შუახევის მიმართულებით) — ცხვირრქოსანი გველგესლა. სია ეფუძნება რეგიონულ ჩანაწერებს და შეიძლება განახლდეს ახალი დაკვირვებებით.",
        },
        question: {
          en: "Which snakes live in Adjara?",
          ka: "რა გველები გვხვდება აჭარაში?",
        },
      },
      {
        answer: {
          en: "Yes — Caucasian viper (Vipera kaznakovi) is venomous; in highland Adjara the Transcaucasian long-nosed viper (Vipera transcaucasiana) occurs rarely. Other listed species are harmless to humans, but treat every snake with caution.",
          ka: "დიახ — კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია; მთიან აჭარაში იშვიათად გვხვდება ცხვირრქოსანი გველგესლა (Vipera transcaucasiana). სხვა ჩამოთვლილი სახეობები ადამიანისთვის უვნებელია, თუმცა ყველა გველს სიფრთხილით მოეკიდეთ.",
        },
        question: {
          en: "Are there venomous snakes in Adjara?",
          ka: "არის თუ არა შხამიანი გველი აჭარაში?",
        },
      },
      {
        answer: {
          en: "It is tied mainly to humid forests and foothills. Localities are fragmented — see the full species profile for details.",
          ka: "ის უპირატესად ტენიან ტყეებსა და მთისწინეთს უკავშირდება. ზუსტი ლოკაციები ფრაგმენტირებულია — სრული პროფილი იხილეთ სახეობის გვერდზე.",
        },
        question: {
          en: "Where does the Caucasian viper occur in Adjara?",
          ka: "სად გვხვდება კავკასიური გველგესლა აჭარაში?",
        },
      },
      {
        answer: {
          en: "Activity rises from spring through autumn, especially in warm, humid weather. In winter most individuals shelter or reduce activity.",
          ka: "აქტივობა იზრდება გაზაფხულიდან შემოდგომამდე, განსაკუთრებით თბილ, ნოტიო ამინდში. ზამთარში უმეტესობა იმალება ან ნაკლებად აქტიურია.",
        },
        question: {
          en: "When are snakes most active in Adjara?",
          ka: "როდის არის გველები უფრო აქტიური აჭარაში?",
        },
      },
    ],
    habitats: [
      { en: "Humid subtropical forests", ka: "ნოტიო სუბტროპიკული ტყეები" },
      { en: "Mountain valleys", ka: "მთიანი ხეობები" },
      { en: "Black Sea coast", ka: "შავი ზღვის სანაპირო" },
    ],
    overview: {
      en: "Adjara is one of western Georgia’s most humid herpetological zones. Subtropical forests, mountain valleys, and the Black Sea coast bring together Caucasian viper, grass snake and dice snake, smooth snake, and glass lizard. Eastern arid-zone taxa are largely absent.",
      ka: "აჭარა დასავლეთ საქართველოს ერთ-ერთი ყველაზე ტენიანი ჰერპეტოლოგიური ზონაა. ნოტიო სუბტროპიკული ტყეები, მთიანი ხეობები და შავი ზღვის სანაპირო ქმნის გარემოს, სადაც კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა ერთმანეთს ემთხვევა. აღმოსავლეთის მშრალი ზონის სახეობები აქ თითქმის არ გვხვდება.",
    },
    relatedIds: ["guria", "samtskhe-javakheti", "samegrelo"],
  },
  guria: {
    biome: { en: "Colchic · subtropical", ka: "კოლხური · სუბტროპიკული" },
    faq: [
      {
        answer: {
          en: "Yes — Caucasian viper (Vipera kaznakovi) is venomous. Grass snake, dice snake, and smooth snake are harmless to humans.",
          ka: "დიახ — კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. ჩვეულებრივი და წყლის ანკარა და სპილენძა უვნებელია ადამიანისთვის.",
        },
        question: {
          en: "Are there venomous snakes in Guria?",
          ka: "არის თუ არა შხამიანი გველი გურიაში?",
        },
      },
    ],
    habitats: [
      { en: "Colchic forests", ka: "კოლხური ტყეები" },
      { en: "River valleys", ka: "მდინარის ხეობები" },
    ],
    overview: {
      en: "Guria is defined by humid subtropical Colchic forests and river valleys. Moisture-loving fauna dominates — eastern arid-zone species are largely absent.",
      ka: "გურია ნოტიო სუბტროპიკული კოლხური ტყეებითა და მდინარის ხეობებით გამოირჩევა. აქ დომინირებს ტენიანობის მოყვარული ფაუნა — აღმოსავლეთის მშრალი ზონის სახეობები თითქმის არ გვხვდება.",
    },
    relatedIds: ["adjara", "samegrelo", "imereti"],
  },
  imereti: {
    biome: { en: "Karst · Rioni basin", ka: "კარსტი · რიონის აუზი" },
    faq: [
      {
        answer: {
          en: "Records include Caucasian viper, smooth snake, grass snake and dice snake, and glass lizard.",
          ka: "ჩანაწერებშია კავკასიური გველგესლა, სპილენძა, ჩვეულებრივი და წყლის ანკარა და გველხოკერა.",
        },
        question: {
          en: "Which snakes occur in Imereti?",
          ka: "რა გველები გვხვდება იმერეთში?",
        },
      },
    ],
    habitats: [
      { en: "Karst mountains", ka: "კარსტული მთები" },
      { en: "Wooded valleys", ka: "ტყიანი ხეობები" },
      { en: "Rioni basin", ka: "რიონის აუზი" },
    ],
    overview: {
      en: "Imereti links western Georgian habitats through karst mountains, wooded valleys, and the Rioni basin. Colchic influence remains strong, with more continental elements appearing inland.",
      ka: "იმერეთი კარსტული მთებით, ტყიანი ხეობებითა და რიონის აუზით აკავშირებს დასავლეთ საქართველოს ჰაბიტატებს. აქ კოლხური გავლენა ჯერ კიდევ ძლიერია, მაგრამ უკვე ჩნდება უფრო კონტინენტური ელემენტებიც.",
    },
    relatedIds: ["guria", "samegrelo", "racha", "samtskhe-javakheti"],
  },
  kakheti: {
    biome: { en: "Alazani · semi-arid", ka: "ალაზანი · ნახევრად უდაბნო" },
    faq: [
      {
        answer: {
          en: "Levantine viper (Macrovipera lebetina) and steppe viper (Vipera renardi) are venomous. Most other listed species are harmless, but correct identification still matters.",
          ka: "გიურზა (Macrovipera lebetina) და ველის გველგესლა (Vipera renardi) შხამიანია. სხვა ჩამოთვლილი სახეობების უმეტესობა უვნებელია, თუმცა ამოცნობა მნიშვნელოვანია.",
        },
        question: {
          en: "Which venomous snakes live in Kakheti?",
          ka: "რა შხამიანი გველებია კახეთში?",
        },
      },
      {
        answer: {
          en: "Records include Levantine viper, steppe viper, Urartian and steppe ratsnakes, red-bellied and Dahl’s whip snakes, cat snake, grass snake and dice snake, smooth snake, and glass lizard.",
          ka: "ჩანაწერებშია გიურზა, ველის გველგესლა, ურარტუს და სახეებიანი მცურავი, წითელმუცელა და წენგოსფერი მცურავი, კატისთვალა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა.",
        },
        question: {
          en: "Which snakes occur in Kakheti?",
          ka: "რა გველები გვხვდება კახეთში?",
        },
      },
      {
        answer: {
          en: "Yes — Kakheti belongs to the dry/semi-arid east, Adjara to the humid Colchic west. Species assemblages differ sharply.",
          ka: "დიახ — კახეთი მშრალი/ნახევრად მშრალი აღმოსავლეთის ფაუნას მიეკუთვნება, აჭარა კი ნოტიო კოლხურ ზონას. სახეობების ნაკრები მკვეთრად განსხვავდება.",
        },
        question: {
          en: "Do Kakheti’s snakes differ from Adjara’s?",
          ka: "განსხვავდება თუ არა კახეთის გველები აჭარისგან?",
        },
      },
    ],
    habitats: [
      { en: "Alazani valley", ka: "ალაზნის ველი" },
      { en: "Dry foothills", ka: "მშრალი მთისწინეთი" },
      { en: "Semi-arid zones", ka: "ნახევრად უდაბნო ზონები" },
    ],
    overview: {
      en: "Kakheti’s Alazani valley, dry foothills, and semi-arid belts shape eastern Georgia’s distinctive fauna. Warmth-loving, dry-habitat taxa dominate — Levantine viper, fast racers, and cat snake.",
      ka: "კახეთი ალაზნის ველით, მშრალი მთისწინეთითა და ნახევრად უდაბნო ზონებით ქმნის აღმოსავლეთ საქართველოს განსხვავებულ ფაუნას. აქ დომინირებს თბომოყვარე და მშრალი ჰაბიტატის სახეობები — გიურზა, სწრაფი მცურავები და კატისთვალა.",
    },
    relatedIds: ["kvemo-kartli", "mtskheta-mtianeti", "tbilisi"],
  },
  "kvemo-kartli": {
    biome: { en: "Dry plain · Mtkvari", ka: "მშრალი ვაკე · მტკვარი" },
    faq: [
      {
        answer: {
          en: "Yes — Macrovipera lebetina is venomous and tied to eastern dry and semi-arid habitats; Transcaucasian long-nosed viper (Vipera transcaucasiana) occurs in the Trialeti highlands. Keep your distance.",
          ka: "დიახ — Macrovipera lebetina შხამიანია და აღმოსავლეთის მშრალ/ნახევრად მშრალ ჰაბიტატებს უკავშირდება; თრიალეთის მთიანეთში გვხვდება ცხვირრქოსანი გველგესლა (Vipera transcaucasiana). დაიცავით მანძილი.",
        },
        question: {
          en: "Does Levantine viper occur in Kvemo Kartli?",
          ka: "არის თუ არა გიურზა ქვემო ქართლში?",
        },
      },
    ],
    habitats: [
      { en: "Dry plains", ka: "მშრალი ვაკეები" },
      { en: "Rocky foothills", ka: "კლდოვანი მთისწინეთი" },
      { en: "Mtkvari basin", ka: "მტკვრის აუზი" },
    ],
    overview: {
      en: "Kvemo Kartli’s dry plains, rocky foothills, and Mtkvari basin favor warmth-loving species. Here appears the Levantine viper — one of eastern Georgia’s most significant venomous snakes.",
      ka: "ქვემო ქართლი მშრალი ვაკეებით, კლდოვანი მთისწინეთითა და მტკვრის აუზით ხელს უწყობს თბომოყვარე სახეობებს. აქ ჩნდება გიურზა — აღმოსავლეთ საქართველოს ერთ-ერთი ყველაზე მნიშვნელოვანი შხამიანი გველი.",
    },
    relatedIds: ["tbilisi", "kakheti", "shida-kartli", "samtskhe-javakheti"],
  },
  "mtskheta-mtianeti": {
    biome: { en: "Greater Caucasus", ka: "დიდი კავკასიონი" },
    faq: [
      {
        answer: {
          en: "Yes — Dinnik’s viper (Vipera dinniki) is venomous and associated with high-mountain habitats.",
          ka: "დიახ — დინიკის გველგესლა (Vipera dinniki) შხამიანია და მაღალმთის ჰაბიტატებს უკავშირდება.",
        },
        question: {
          en: "Are there venomous snakes in Mtskheta-Mtianeti?",
          ka: "არის თუ არა შხამიანი გველი მცხეთა-მთიანეთში?",
        },
      },
    ],
    habitats: [
      { en: "High mountains", ka: "მაღალმთა" },
      { en: "Upper forest belt", ka: "ტყის ზედა ზონა" },
      { en: "Subalpine meadows", ka: "სუბალპური მდელოები" },
    ],
    overview: {
      en: "Mtskheta — Mtianeti covers Greater Caucasus peaks, the upper forest belt, and subalpine meadows. It is classic range for montane reptiles, including Dinnik’s viper.",
      ka: "მცხეთა — მთიანეთი დიდი კავკასიონის მთებით, ტყის ზედა ზონითა და სუბალპური მდელოებით გამოირჩევა. ეს არის მთის ქვეწარმავლების — მათ შორის დინიკის გველგესლას — კლასიკური არეალი.",
    },
    relatedIds: ["racha", "shida-kartli", "kakheti", "tbilisi"],
  },
  racha: {
    biome: { en: "High mountain · subalpine", ka: "მაღალმთა · სუბალპური" },
    faq: [
      {
        answer: {
          en: "Yes — Dinnik’s viper (Vipera dinniki) is venomous and tied to high-mountain habitats.",
          ka: "დიახ — დინიკის გველგესლა (Vipera dinniki) შხამიანია და მაღალმთის ჰაბიტატებს უკავშირდება.",
        },
        question: {
          en: "Are there venomous snakes in Racha?",
          ka: "არის თუ არა შხამიანი გველი რაჭაში?",
        },
      },
    ],
    habitats: [
      { en: "High-mountain forests", ka: "მაღალმთიანი ტყეები" },
      { en: "Subalpine meadows", ka: "სუბალპური მდელოები" },
      { en: "Rocky gorges", ka: "კლდოვანი ხეობები" },
    ],
    overview: {
      en: "Racha — Lechkhumi — Kvemo Svaneti is defined by high forests, subalpine meadows, and rocky gorges. Montane taxa such as Dinnik’s viper are more characteristic than lowland fauna.",
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთი მაღალმთიანი ტყეებით, სუბალპური მდელოებითა და კლდოვანი ხეობებით გამოირჩევა. აქ მთის სახეობები — მათ შორის დინიკის გველგესლა — უფრო დამახასიათებელია, ვიდრე დაბლობის ფაუნა.",
    },
    relatedIds: ["samegrelo", "imereti", "mtskheta-mtianeti"],
  },
  samegrelo: {
    biome: { en: "Colchis · Svaneti", ka: "კოლხეთი · სვანეთი" },
    faq: [
      {
        answer: {
          en: "In humid lowlands, Caucasian viper, grass snake and dice snake, smooth snake, and glass lizard are more typical. In high Zemo Svaneti, Dinnik’s viper occurs.",
          ka: "დაბლობსა და ტენიან ზონაში უფრო ხშირია კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. ზემო სვანეთის მაღალმთაში გვხვდება დინიკის გველგესლა.",
        },
        question: {
          en: "Which snakes live in Samegrelo?",
          ka: "რა გველები გვხვდება სამეგრელოში?",
        },
      },
    ],
    habitats: [
      { en: "Colchis lowlands", ka: "კოლხეთის დაბლობი" },
      { en: "River valleys", ka: "მდინარის ხეობები" },
      { en: "High Svaneti", ka: "სვანეთის მაღალმთა" },
    ],
    overview: {
      en: "Samegrelo — Zemo Svaneti stretches from the Colchis lowlands to high Svaneti. Humid forests, river valleys, and alpine belts meet in one region — so fauna shifts with elevation.",
      ka: "სამეგრელო — ზემო სვანეთი გადაჭიმულია კოლხეთის დაბლობიდან სვანეთის მაღალმთამდე. ერთ რეგიონში ხვდება ტენიანი ტყეები, მდინარის ხეობები და ალპური ზონა — ამიტომ ფაუნა ვერტიკალურად იცვლება.",
    },
    relatedIds: ["abkhazia", "guria", "racha", "imereti"],
  },
  "samtskhe-javakheti": {
    biome: { en: "Volcanic plateau", ka: "ვულკანური პლატო" },
    faq: [
      {
        answer: {
          en: "Transcaucasian long-nosed viper (Vipera transcaucasiana), Darevsky’s viper (Vipera darevskii), steppe viper (Vipera renardi), and in the Borjomi gorge Caucasian viper (Vipera kaznakovi) are venomous. Darevsky’s viper is critically endangered and confined to the Javakheti–Erusheti highlands.",
          ka: "ცხვირრქოსანი გველგესლა (Vipera transcaucasiana), დარევსკის გველგესლა (Vipera darevskii), ველის გველგესლა (Vipera renardi) და ბორჯომის ხეობაში კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. დარევსკის გველგესლა კრიტიკულად საფრთხის ქვეშაა და გვხვდება ჯავახეთ–ერუშეთის მაღალმთაში.",
        },
        question: {
          en: "Which venomous snakes occur in Samtskhe-Javakheti?",
          ka: "რა შხამიანი გველებია სამცხე-ჯავახეთში?",
        },
      },
    ],
    habitats: [
      { en: "Volcanic plateaus", ka: "ვულკანური პლატოები" },
      { en: "Highland lakes", ka: "მთის ტბები" },
      { en: "Dry foothills", ka: "მშრალი მთისწინეთი" },
      { en: "Subalpine rocky slopes", ka: "სუბალპური კლდოვანი ფერდობები" },
    ],
    overview: {
      en: "Samtskhe — Javakheti features volcanic plateaus, highland lakes, and dry foothills. Open, often cool habitats differ from Colchic west Georgia — nose-horned, Darevsky’s, and steppe vipers occur here; Caucasian viper is recorded in the Borjomi gorge.",
      ka: "სამცხე — ჯავახეთი ვულკანური პლატოებით, მთის ტბებითა და მშრალი მთისწინეთით გამოირჩევა. ღია, ხშირად ცივი ჰაბიტატები განსხვავდება კოლხური დასავლეთისგან — აქ გვხვდება ცხვირრქოსანი, დარევსკის და ველის გველგესლები; ბორჯომის ხეობაში — კავკასიური გველგესლა.",
    },
    relatedIds: ["adjara", "imereti", "kvemo-kartli", "shida-kartli"],
  },
  "shida-kartli": {
    biome: { en: "Plain · Mtkvari valley", ka: "ვაკე · მტკვრის ხეობა" },
    faq: [
      {
        answer: {
          en: "Records include nose-horned viper, Urartian and steppe ratsnakes, red-bellied and Dahl’s whip snakes, cat snake, grass snake and dice snake, smooth snake, and glass lizard.",
          ka: "ჩანაწერებშია ცხვირრქოსანი გველგესლა, ურარტუს და სახეებიანი მცურავი, წითელმუცელა და წენგოსფერი მცურავი, კატისთვალა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა.",
        },
        question: {
          en: "Which snakes occur in Shida Kartli?",
          ka: "რა გველები გვხვდება შიდა ქართლში?",
        },
      },
    ],
    habitats: [
      { en: "Shida Kartli plain", ka: "შიდა ქართლის ვაკე" },
      { en: "Foothills", ka: "მთისწინეთი" },
      { en: "Mtkvari valley", ka: "მტკვრის ხეობა" },
    ],
    overview: {
      en: "Shida Kartli bridges dry and semi-humid zones via plains, foothills, and the Mtkvari valley. Western and eastern faunal elements meet — from nose-horned viper to fast racers.",
      ka: "შიდა ქართლი ვაკით, მთისწინეთითა და მტკვრის ხეობით აერთიანებს მშრალ და ნახევრად ნოტიო ზონებს. აქ იკვეთება დასავლეთისა და აღმოსავლეთის ფაუნის ელემენტები — ცხვირრქოსანი გველგესლიდან სწრაფ მცურავებამდე.",
    },
    relatedIds: [
      "mtskheta-mtianeti",
      "kvemo-kartli",
      "samtskhe-javakheti",
      "imereti",
    ],
  },
  tbilisi: {
    biome: { en: "Urban · Mtkvari", ka: "ურბანული · მტკვარი" },
    faq: [
      {
        answer: {
          en: "Records include Levantine viper, nose-horned viper, Urartian and steppe ratsnakes, red-bellied and Dahl’s whip snakes, cat snake, grass snake and dice snake, smooth snake, and glass lizard — mainly in suburbs and riverside areas.",
          ka: "ჩანაწერებშია გიურზა, ცხვირრქოსანი გველგესლა, ურარტუს და სახეებიანი მცურავი, წითელმუცელა და წენგოსფერი მცურავი, კატისთვალა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა — ძირითადად გარეუბნებსა და მდინარის პირას.",
        },
        question: {
          en: "Which snakes live in Tbilisi?",
          ka: "რა გველები ბინადრობენ თბილისში?",
        },
      },
      {
        answer: {
          en: "Levantine viper and nose-horned viper are venomous; others are harmless. If you see a snake — do not touch it, step back, and contact appropriate services if needed.",
          ka: "გიურზა და ცხვირრქოსანი გველგესლა შხამიანია. სხვები უვნებელია. თუ გველი ნახეთ — არ შეეხოთ, გადადგით ნაბიჯი უკან და საჭიროების შემთხვევაში დაუკავშირდით შესაბამის სამსახურებს.",
        },
        question: {
          en: "Are snakes in Tbilisi dangerous?",
          ka: "საშიშია თუ არა გველები თბილისში?",
        },
      },
      {
        answer: {
          en: "Along the Mtkvari, rocky slopes, suburban valleys, and less disturbed greenery — not busy central streets.",
          ka: "მტკვრის პირას, კლდოვან ფერდობებზე, გარეუბნის ხეობებსა და ნაკლებად შეწუხებულ გამწვანებაში — არა შუა ქალაქის ქუჩებში.",
        },
        question: {
          en: "Where are snakes more likely around Tbilisi?",
          ka: "სად არის მეტი შანსი გველის ნახვის თბილისში?",
        },
      },
    ],
    habitats: [
      { en: "Suburban valleys", ka: "გარეუბნის ხეობები" },
      { en: "Parks and green belts", ka: "პარკები და გამწვანება" },
      { en: "Riverside habitats", ka: "მდინარის პირას ჰაბიტატები" },
    ],
    overview: {
      en: "In Tbilisi, reptiles occur mainly in suburban valleys, parks, and riverside habitats — not dense city centers. Levantine viper, nose-horned viper, red-bellied racer, glass lizard, and others may appear. Urban encounters are uncommon but real.",
      ka: "თბილისში ქვეწარმავლები ძირითადად ქალაქის მიმდებარე ხეობებში, პარკებსა და მდინარის პირას გვხვდება — არა ცენტრალურ უბნებში. აქ შეიძლება შეხვდეთ გიურზას, ცხვირრქოსან გველგესლას, წითელმუცელა მცურავს, გველხოკერას და სხვა სახეობებს. ურბანული შეხვედრები იშვიათია, მაგრამ რეალურია.",
    },
    relatedIds: [
      "kvemo-kartli",
      "mtskheta-mtianeti",
      "shida-kartli",
      "kakheti",
    ],
  },
};

export function getRegionContent(id: RegionPathId): RegionContent {
  return regionContent[id];
}
