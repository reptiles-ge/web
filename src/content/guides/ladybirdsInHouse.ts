import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "black-form" | "marking" | "seven-spot";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Ladybirds gathering at windows in autumn are often the introduced harlequin ladybird. Learn how to recognise it, whether it bites, and how to remove it cleanly.",
    faq: [
      {
        answer:
          "Sometimes. A ladybird that lands on skin may bite or pinch. University of Kentucky entomologists say it feels like a pinprick and is seldom serious.",
        question: "Do ladybirds bite?",
      },
      {
        answer:
          "No. They do not attack wood, food or clothing. The only damage is the yellow stains and smell left when a beetle is crushed or disturbed.",
        question: "Do ladybirds damage the house or food?",
      },
      {
        answer:
          "Not for the garden: the RHS describes it as largely a predator of aphids. As a non-native species, though, it competes with native ladybirds for food, and in Britain there is some evidence that it has caused declines in some of them.",
        question: "Is the harlequin ladybird a pest?",
      },
      {
        answer:
          "In the 1980s, more than 107,000 beetles brought from the Far East were released in Georgia for biological pest control, but the species did not establish then. The first established population in the region was recorded in Sochi in 2012, and by 2018 it had been recorded in Georgia, Armenia and south Russia.",
        question: "When did the harlequin ladybird appear in Georgia?",
      },
      {
        answer:
          "Until late winter or early spring. As it warms up they become active and try to get outside. Seal the gaps before the next autumn, or new beetles can get in again.",
        question: "How long do ladybirds stay in the house?",
      },
    ],
    intro:
      "In autumn, ladybirds look for a place to spend the winter and can gather in large numbers in window frames and gaps. The best-known indoor overwinterer is the harlequin ladybird, a species introduced to Georgia. It does not damage the house: vacuum the beetles, do not crush them, and seal the gaps.",
    metaTitle: "Ladybirds in the house: why they gather, how to remove them",
    sections: [
      {
        heading: "What should you do if many ladybirds got into the house?",
        paragraphs: [
          "A cluster of ladybirds in a window frame, by a door gap or in the attic usually appears in autumn: the beetles are looking for a sheltered place to spend the winter. This is a seasonal event, not a danger.",
          "Ladybirds do not breed in the house and do not damage wood, food or clothing. The real nuisance is their numbers, yellow stains and an unpleasant smell. Do not crush them: collect them with a vacuum cleaner, then find and seal the gaps they get in through.",
          "The ladybird best known for overwintering inside buildings in large numbers is the harlequin ladybird (Harmonia axyridis), a species introduced to Georgia. If the insect is flat and brown rather than round, it may be a stink bug: see [stink bugs in the house](/insects/farosana-sakhlshi).",
        ],
      },
      {
        heading: "Why do ladybirds gather on houses in autumn?",
        paragraphs: [
          "In autumn, harlequin ladybirds leave their summer feeding sites and look for winter shelter, and a building is one such place.",
          "According to University of Kentucky entomologists, flights are heaviest on sunny afternoons when it warms up after cooler weather. The beetles favour the sunny southwest side of a house. Contrasting light and dark features attract them more than the colour or material of the house, and homes shaded from the afternoon sun are less likely to be infested.",
          "Once on a building, they crawl into cracks around window and door frames, behind fascia boards and siding, and into attics and wall voids. Poorly maintained buildings with many openings are the most vulnerable.",
        ],
      },
      {
        heading: "What does what you see in the house mean?",
        paragraphs: [
          "The table lists the most common situations. Each one is explained in more detail below.",
        ],
        table: {
          headers: ["What you see", "What it means", "What to do"],
          rows: [
            [
              "A cluster of ladybirds in a window frame or corner",
              "The beetles are gathering to overwinter",
              "Vacuum them, then seal the gap",
            ],
            [
              "Yellow stains on a wall, curtain or windowsill",
              "Defensive fluid from a disturbed beetle",
              "Do not crush them or sweep them with a broom",
            ],
            [
              "Ladybirds at a window or lamp in late winter",
              "They wake up as it warms and try to get outside",
              "Collect them and let them out",
            ],
            [
              "A ladybird landed on your hand and pinched",
              "The bite feels like a pinprick and is seldom serious",
              "Do not touch your eyes before washing your hands",
            ],
          ],
        },
      },
      {
        heading: "How do you recognise the harlequin ladybird?",
        image: "marking",
        paragraphs: [
          "The harlequin ladybird (Harmonia axyridis) is native to East Asia and was introduced to Georgia. According to the RHS, it is 8–10 mm long and very variable in colour and markings.",
          "The most useful feature is the pale, whitish area behind the head (the pronotum). University of Kentucky entomologists describe a small dark mark shaped like an M or W on it in most harlequin ladybirds. The wing cases range from tan to red, and the number of spots varies.",
          "Do not rely on a single feature: colour and spot count do not identify a ladybird. The RHS warns that the harlequin ladybird is easily confused with some native species.",
        ],
      },
      {
        heading: "Is a black ladybird with red spots a harlequin too?",
        image: "black-form",
        paragraphs: [
          "It can be. According to the RHS, the two common forms of the harlequin ladybird are black with two red spots and orange with many black spots.",
          "A black beetle with red spots can also be a different species, so colour alone is not enough. For a reliable identification, take a close photo from above that shows the head and the area behind it.",
        ],
      },
      {
        heading: "How is it different from the seven-spot ladybird?",
        image: "seven-spot",
        paragraphs: [
          "The seven-spot ladybird (Coccinella septempunctata) is, according to the RHS, almost always red with seven black spots.",
          "The harlequin ladybird is far more variable: orange or red with many spots, or black with red spots. If a ladybird has more or fewer than seven spots, or a black back, check the area behind the head for the pale colour and the M or W mark.",
          "The ladybird known for overwintering in buildings in large groups is the harlequin ladybird, so a cluster on your window may not be a native ladybird at all. You can only be sure after a close look.",
        ],
      },
      {
        heading: "Are ladybirds dangerous to people?",
        paragraphs: [
          "Usually not. According to University of Kentucky entomologists, a ladybird that lands on skin may bite or pinch; it feels like a pinprick and is seldom serious. The beetles do not attack wood, food or clothing.",
          "In some people, large numbers of beetles can cause allergies, ranging from eye irritation to asthma. After handling the beetles, do not touch your eyes before washing your hands. If you notice an allergic reaction, see a doctor; if you have trouble breathing, call 112.",
        ],
      },
      {
        heading: "What are the yellow stains and the unpleasant smell?",
        paragraphs: [
          "When disturbed, a ladybird releases a yellowish defensive fluid from its leg joints. It has an acrid, unpleasant smell and stains surfaces.",
          "So do not crush the beetles or sweep them off light-coloured fabric or walls with a broom: University of Kentucky entomologists note that a broom is more likely to cause staining. A vacuum cleaner is better.",
        ],
      },
      {
        heading: "Do ladybirds breed in the house?",
        paragraphs: [
          "No. Ladybirds do not reproduce indoors. The beetles seen in spring are usually the same ones that came in the previous autumn.",
          "In late winter or early spring, as it warms up, they become active again, first on the sunny side of the house. Some wander indoors while trying to get outside, which is why they are often seen near windows and lights.",
        ],
      },
      {
        heading: "How do you get ladybirds out of the house?",
        list: {
          items: [
            "Use a vacuum cleaner. University of Kentucky entomologists call it the easiest way to remove them.",
            "If you want to release the beetles, put a handkerchief between the hose and the collection bag so they stay in it.",
            "Release the collected beetles outdoors, away from the house.",
            "Pick up a single beetle carefully with a piece of paper or a jar, without crushing it.",
            "If ladybirds keep appearing in the same place, there is a gap there that needs sealing.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Ladybirds that got indoors are easiest and safest to remove mechanically, without chemicals. The RHS considers it neither desirable nor necessary to control this beetle, which feeds largely on aphids; it is enough to remove it from living rooms.",
        ],
      },
      {
        heading: "How do you keep ladybirds from getting in?",
        list: {
          items: [
            "Windows and doors: seal cracks around the frames with caulk or sealant.",
            "Eaves, siding and utility lines: seal cracks around fascia boards, siding, and where pipes and cables enter the wall.",
            "Larger holes: plug them with cement, expanding foam or copper mesh.",
            "Screens: repair window and door screens, and fit screening behind attic vents.",
            "Doors: fit a tight door sweep or threshold. A gap of about 3 mm is enough for a ladybird to get in.",
            "If very many beetles get in every autumn, ask a professional about an outdoor treatment: according to University of Kentucky entomologists, it must be done in autumn before the mass entry and does not work in late winter.",
          ],
        },
        paragraphs: [
          "The longest-lasting solution is sealing the entry points. University of Kentucky entomologists recommend doing it in late spring or summer, before the beetles start looking for shelter in autumn.",
        ],
      },
      {
        heading: "What should you not do?",
        list: {
          items: [
            "Do not crush ladybirds: the fluid leaves a smell and a stain.",
            "Do not use aerosols or foggers indoors: according to University of Kentucky entomologists, they are often ineffective and can stain surfaces.",
            "Do not spray insecticide into wall voids: killing beetles hidden there is seldom effective.",
            "Do not touch your eyes after handling the beetles.",
          ],
        },
        paragraphs: [
          "Some quick fixes do not solve the problem or create a new one.",
        ],
      },
    ],
    summary:
      "In autumn, ladybirds come indoors to overwinter; the one best known for this is the harlequin ladybird, introduced to Georgia. They do not breed in the house and do not damage wood, food or clothing. Do not crush them: vacuum them and release them outdoors. In late spring or summer, seal the gaps around windows, doors and pipes. If you have an allergic reaction, see a doctor; if you have trouble breathing, call 112.",
    title:
      "Ladybirds in the house: why do they gather in autumn, and what to do?",
  },
  ka: {
    description:
      "შემოდგომით ფანჯრებთან შეკრებილი ჭიამაიები ხშირად შემოტანილი აზიური ჭიამაიაა. გაიგეთ, როგორ ამოიცნოთ, კბენს თუ არა და როგორ მოაშოროთ ლაქების გარეშე.",
    faq: [
      {
        answer:
          "ზოგჯერ. კანზე დამჯდარმა ჭიამაიამ შეიძლება იკბინოს ან ჩაგიჩქმიტოთ. University of Kentucky-ის ენტომოლოგების მიხედვით, ეს ქინძისთავის ჩხვლეტას ჰგავს და იშვიათად არის სერიოზული.",
        question: "ჭიამაია კბენს?",
      },
      {
        answer:
          "არა. ჭიამაიები ხეს, საკვებსა და ტანსაცმელს არ აზიანებენ. ერთადერთი ზიანი ყვითელი ლაქები და სუნია, რომელიც ხოჭოს გაჭყლეტის ან შეწუხების შემდეგ რჩება.",
        question: "ჭიამაიები სახლს ან საკვებს აზიანებენ?",
      },
      {
        answer:
          "ბაღისთვის — არა: RHS-ის აღწერით, ის ძირითადად ბუგრებით იკვებება. თუმცა, როგორც უცხო სახეობა, ის საკვებისთვის ადგილობრივ ჭიამაიებს ეჯიბრება და ბრიტანეთში არსებობს მონაცემები, რომ ზოგი მათგანის რიცხოვნობა შეამცირა.",
        question: "აზიური ჭიამაია მავნებელია?",
      },
      {
        answer:
          "1980-იან წლებში მავნებლებთან ბიოლოგიური ბრძოლისთვის საქართველოში შორეული აღმოსავლეთიდან ჩამოტანილი 107 ათასზე მეტი ხოჭო გამოუშვეს, თუმცა სახეობა მაშინ არ დამკვიდრდა. რეგიონში პირველი დამკვიდრებული პოპულაცია 2012 წელს სოჭში დაფიქსირდა, 2018 წლისთვის კი ის საქართველოში, სომხეთსა და სამხრეთ რუსეთში იყო აღრიცხული.",
        question: "როდის გაჩნდა აზიური ჭიამაია საქართველოში?",
      },
      {
        answer:
          "ზამთრის ბოლომდე ან ადრე გაზაფხულამდე. დათბობისას ისინი აქტიურდებიან და გარეთ გასვლას ცდილობენ. ღრიჭოები შემდეგ შემოდგომამდე დახურეთ, თორემ ახალი ხოჭოები შეიძლება ისევ შემოვიდნენ.",
        question: "რამდენ ხანს რჩებიან ჭიამაიები სახლში?",
      },
    ],
    intro:
      "შემოდგომით ჭიამაიები ზამთრის გასატარებელ ადგილს ეძებენ და ზოგჯერ დიდი რაოდენობით იკრიბებიან ფანჯრის ჩარჩოებსა და ღრიჭოებში. სახლში გამოზამთრებით ყველაზე ცნობილია აზიური ჭიამაია — საქართველოში შემოტანილი სახეობა. ის სახლს არ აზიანებს: შეაგროვეთ მტვერსასრუტით, ნუ გაჭყლეტთ და დახურეთ ღრიჭოები.",
    metaTitle: "ჭიამაიები სახლში: რატომ იკრიბებიან და როგორ მოვიშოროთ",
    sections: [
      {
        heading: "რა ვქნა, თუ სახლში ბევრი ჭიამაია შემოვიდა?",
        paragraphs: [
          "ჭიამაიების გროვა ფანჯრის ჩარჩოში, კარის ღრიჭოსთან ან სხვენში, როგორც წესი, შემოდგომით ჩნდება: ხოჭოები ზამთრის გასატარებლად დაცულ ადგილს ეძებენ. ეს სეზონური მოვლენაა და საფრთხეს არ ნიშნავს.",
          "ჭიამაიები სახლში არ მრავლდებიან და არც ხეს, საკვებს ან ტანსაცმელს აზიანებენ. მთავარი უხერხულობა მათი რაოდენობა, ყვითელი ლაქები და უსიამოვნო სუნია. ნუ გაჭყლეტთ: შეაგროვეთ მტვერსასრუტით, შემდეგ კი იპოვეთ და დახურეთ ღრიჭოები, საიდანაც შემოდიან.",
          "შენობებში დიდი რაოდენობით გამოზამთრებით ყველაზე ცნობილია აზიური ჭიამაია (Harmonia axyridis) — საქართველოში შემოტანილი სახეობა. თუ მწერი მრგვალი კი არა, ბრტყელი და ყავისფერია, ეს შეიძლება ფაროსანა იყოს: იხილეთ [ფაროსანა სახლში](/insects/farosana-sakhlshi).",
        ],
      },
      {
        heading: "რატომ იკრიბებიან ჭიამაიები შემოდგომით სახლზე?",
        paragraphs: [
          "შემოდგომით აზიური ჭიამაიები ზაფხულის საკვებ ადგილებს ტოვებენ და ზამთრის თავშესაფარს ეძებენ. შენობა ერთ-ერთი ასეთი ადგილია.",
          "University of Kentucky-ის ენტომოლოგების აღწერით, ხოჭოები ყველაზე აქტიურად მზიან შუადღეებზე დაფრინავენ, როცა აგრილების შემდეგ ისევ თბება. ისინი სახლის მზიან, სამხრეთ-დასავლეთ მხარეს ირჩევენ. მათ სახლის ფერზე ან მასალაზე მეტად ღია და მუქი ფერების კონტრასტი იზიდავს, შუადღის მზისგან დაჩრდილულ სახლებში კი ნაკლებად შედიან.",
          "შენობაზე დაჯდომის შემდეგ ისინი ფანჯრისა და კარის ჩარჩოების ნაპრალებში, კარნიზისა და ფასადის მოპირკეთების მიღმა, სხვენსა და კედლის ღრუებში ძვრებიან. ყველაზე მოწყვლადია მოუვლელი შენობა, რომელსაც ბევრი ღიობი აქვს.",
        ],
      },
      {
        heading: "რას ნიშნავს ის, რასაც სახლში ხედავთ?",
        paragraphs: [
          "ცხრილში ყველაზე ხშირი სიტუაციებია. თითოეული დეტალურად ქვემოთაა ახსნილი.",
        ],
        table: {
          headers: ["რას ხედავთ", "რას ნიშნავს", "რა ვქნათ"],
          rows: [
            [
              "ჭიამაიების გროვა ფანჯრის ჩარჩოში ან კუთხეში",
              "ხოჭოები გამოსაზამთრებლად იკრიბებიან",
              "შეაგროვეთ მტვერსასრუტით, შემდეგ დახურეთ ღრიჭო",
            ],
            [
              "ყვითელი ლაქა კედელზე, ფარდაზე ან ფანჯრის რაფაზე",
              "შეწუხებული ხოჭოს თავდაცვითი სითხე",
              "ნუ გაჭყლეტთ და ცოცხით ნუ ჩამოხვეტავთ",
            ],
            [
              "ჭიამაიები ფანჯარასთან ან სანათთან ზამთრის ბოლოს",
              "დათბობისას ფხიზლდებიან და გარეთ გასვლას ცდილობენ",
              "შეაგროვეთ და გაუშვით გარეთ",
            ],
            [
              "ჭიამაია ხელზე დაჯდა და ჩაგიჩქმიტათ",
              "ნაკბენი ქინძისთავის ჩხვლეტას ჰგავს და იშვიათად არის სერიოზული",
              "ხელის დაბანამდე თვალებს ნუ შეეხებით",
            ],
          ],
        },
      },
      {
        heading: "როგორ ვიცნოთ აზიური ჭიამაია?",
        image: "marking",
        paragraphs: [
          "აზიური ჭიამაია (Harmonia axyridis) აღმოსავლეთ აზიის სახეობაა და საქართველოში შემოტანილია. RHS-ის მიხედვით, მისი სიგრძე 8–10 მმ-ია, ფერი და ლაქები კი ძალიან ცვალებადი.",
          "ამოცნობის ყველაზე სასარგებლო ნიშანი თავის უკან მდებარე ღია, მოთეთრო ფარია (წინაზურგი). University of Kentucky-ის ენტომოლოგების აღწერით, აზიური ჭიამაიების უმრავლესობას მასზე M ან W ასოს მსგავსი პატარა მუქი ნიშანი აქვს. ფრთისფარები ღია ყავისფრიდან წითლამდე მერყეობს, ლაქების რაოდენობა კი სხვადასხვაა.",
          "ერთ ნიშანს ნუ დაეყრდნობით: ფერი და ლაქების რაოდენობა ჭიამაიას ვერ ამოგაცნობინებთ. RHS აფრთხილებს, რომ აზიური ჭიამაია ადვილად ერევა ზოგ ადგილობრივ სახეობაში.",
        ],
      },
      {
        heading: "შავი ჭიამაია წითელი ლაქებით — ესეც აზიურია?",
        image: "black-form",
        paragraphs: [
          "შეიძლება. RHS-ის მიხედვით, აზიური ჭიამაიის ორი ყველაზე გავრცელებული ფორმაა შავი ორი წითელი ლაქით და ნარინჯისფერი ბევრი შავი ლაქით.",
          "შავი ხოჭო წითელი ლაქებით სხვა სახეობაც შეიძლება იყოს, ამიტომ მხოლოდ ფერი საკმარისი არ არის. სანდო ამოცნობისთვის გადაუღეთ ახლო ფოტო ზემოდან, რომ თავი და მის უკან მდებარე ფარი ჩანდეს.",
        ],
      },
      {
        heading: "რით განსხვავდება შვიდწერტილა ჭიამაიისგან?",
        image: "seven-spot",
        paragraphs: [
          "შვიდწერტილა ჭიამაია (Coccinella septempunctata) RHS-ის აღწერით თითქმის ყოველთვის წითელია შვიდი შავი ლაქით.",
          "აზიური ჭიამაია გაცილებით ცვალებადია: ნარინჯისფერი ან წითელი ბევრი ლაქით, ან შავი წითელი ლაქებით. თუ ჭიამაიას შვიდზე მეტი ან ნაკლები ლაქა აქვს, ან ზურგი შავი აქვს, შეამოწმეთ თავის უკან ღია ფერი და M ან W ნიშანი.",
          "შენობებში დიდი ჯგუფებით გამოზამთრებით აზიური ჭიამაიაა ცნობილი, ამიტომ ფანჯარაზე შეკრებილი ჭიამაიები შეიძლება ჩვენებური სულაც არ იყოს. დარწმუნებით ამის თქმა მხოლოდ ახლოდან შემოწმების შემდეგ შეიძლება.",
        ],
      },
      {
        heading: "საშიშია თუ არა ჭიამაია ადამიანისთვის?",
        paragraphs: [
          "ჩვეულებრივ — არა. University of Kentucky-ის ენტომოლოგების მიხედვით, კანზე დამჯდარმა ჭიამაიამ შეიძლება იკბინოს ან ჩაგიჩქმიტოთ; ეს ქინძისთავის ჩხვლეტას ჰგავს და იშვიათად არის სერიოზული. ხოჭოები ხეს, საკვებსა და ტანსაცმელს არ აზიანებენ.",
          "ზოგ ადამიანს ხოჭოების დიდი რაოდენობა ალერგიას იწვევს — თვალის გაღიზიანებიდან ასთმამდე. ხოჭოებთან შეხების შემდეგ ხელის დაბანამდე თვალებს ნუ შეეხებით. თუ ალერგიულ რეაქციას შეამჩნევთ, მიმართეთ ექიმს; თუ სუნთქვა გაგიძნელდათ, დარეკეთ 112-ზე.",
        ],
      },
      {
        heading: "რა არის ყვითელი ლაქები და უსიამოვნო სუნი?",
        paragraphs: [
          "შეწუხებისას ჭიამაია ფეხის სახსრებიდან მოყვითალო თავდაცვით სითხეს გამოყოფს. მას მკვეთრი, უსიამოვნო სუნი აქვს და ზედაპირზე ლაქას ტოვებს.",
          "ამიტომ ხოჭოებს ნუ გაჭყლეტთ და ღია ფერის ქსოვილიდან ან კედლიდან ცოცხით ნუ ჩამოხვეტავთ: University of Kentucky-ის ენტომოლოგების მიხედვით, ცოცხი ლაქის დატოვების ალბათობას ზრდის. უმჯობესია მტვერსასრუტი.",
        ],
      },
      {
        heading: "მრავლდება თუ არა ჭიამაია სახლში?",
        paragraphs: [
          "არა. ჭიამაიები სახლში არ მრავლდებიან. გაზაფხულზე დანახული ხოჭოები, როგორც წესი, იგივეა, რომლებიც წინა შემოდგომით შემოვიდნენ.",
          "ზამთრის ბოლოს ან ადრე გაზაფხულზე, დათბობისას, ისინი ისევ აქტიურდებიან, ჯერ სახლის მზიან მხარეს. ზოგი მათგანი გარეთ გასასვლელს ეძებს და ოთახში ხვდება, ამიტომ მათ ხშირად ფანჯრებთან და სანათებთან ხედავთ.",
        ],
      },
      {
        heading: "როგორ მოვიშოროთ ჭიამაიები სახლიდან?",
        list: {
          items: [
            "გამოიყენეთ მტვერსასრუტი. University of Kentucky-ის ენტომოლოგები მას ყველაზე მარტივ გზას უწოდებენ.",
            "თუ ხოჭოების გარეთ გაშვება გინდათ, მილსა და მტვრის პარკს შორის ცხვირსახოცი ჩადეთ, რომ ხოჭოები მასში დარჩნენ.",
            "შეგროვებული ხოჭოები გარეთ, სახლიდან მოშორებით გაუშვით.",
            "ცალკეული ხოჭო ფრთხილად აიღეთ ქაღალდის ფურცლით ან ქილით, ისე რომ არ გაჭყლიტოთ.",
            "თუ ჭიამაიები სულ ერთსა და იმავე ადგილას ჩნდებიან, იქ ღრიჭოა, რომელიც უნდა დაიხუროს.",
          ],
          ordered: true,
        },
        paragraphs: [
          "სახლში შემოსული ჭიამაიები ყველაზე მარტივად და უსაფრთხოდ მექანიკურად, ქიმიის გარეშე შორდება. RHS-ის შეფასებით, ამ ხოჭოს კონტროლი არც სასურველია და არც საჭირო — ის ძირითადად ბუგრებით იკვებება. საკმარისია, საცხოვრებელი ოთახებიდან მოაშოროთ.",
        ],
      },
      {
        heading: "როგორ ავიცილოთ თავიდან ჭიამაიების შემოსვლა?",
        list: {
          items: [
            "ფანჯრები და კარები: ჩარჩოების გარშემო ნაპრალები ჰერმეტიკით ამოავსეთ.",
            "კარნიზი, ფასადი და კომუნიკაციები: დახურეთ ნაპრალები კარნიზისა და ფასადის მოპირკეთების გარშემო და იქ, სადაც მილები და კაბელები კედელში შედის.",
            "დიდი ხვრელები: ამოავსეთ ცემენტით, სამონტაჟო ქაფით ან სპილენძის ბადით.",
            "ბადეები: შეაკეთეთ ფანჯრისა და კარის ბადეები, სხვენის სავენტილაციო ღიობებს კი შიგნიდან ბადე გაუკეთეთ.",
            "კარები: დაამონტაჟეთ მჭიდრო ზღურბლი ან კარის ქვედა შუასადები. დაახლოებით 3 მმ ღრიჭოც საკმარისია, რომ ჭიამაია შემოძვრეს.",
            "თუ ყოველ შემოდგომით ძალიან ბევრი ხოჭო შემოდის, გარე დამუშავებაზე სპეციალისტს მიმართეთ: University of Kentucky-ის ენტომოლოგების მიხედვით, ის შემოდგომით, მასობრივ შემოსვლამდე უნდა ჩატარდეს, ზამთრის ბოლოს კი შედეგს აღარ იძლევა.",
          ],
        },
        paragraphs: [
          "ყველაზე ხანგრძლივი გამოსავალი შემოსასვლელების დახურვაა. University of Kentucky-ის ენტომოლოგები ამას გვიან გაზაფხულზე ან ზაფხულში გირჩევენ, სანამ ხოჭოები შემოდგომით თავშესაფრის ძებნას დაიწყებენ.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        list: {
          items: [
            "ნუ გაჭყლეტთ ჭიამაიებს: სითხე სუნს და ლაქას ტოვებს.",
            "ნუ გამოიყენებთ ოთახში აეროზოლს ან „ფოგერს“: University of Kentucky-ის ენტომოლოგების მიხედვით, ისინი ხშირად არაეფექტურია და ზედაპირზე ლაქას ტოვებს.",
            "ნუ შეასხურებთ ინსექტიციდს კედლის ღრუში: იქ დამალული ხოჭოების მოკვლა იშვიათად არის ეფექტური.",
            "ხოჭოებთან შეხების შემდეგ თვალებს ნუ შეეხებით.",
          ],
        },
        paragraphs: [
          "ზოგი „სწრაფი გამოსავალი“ პრობლემას ვერ აგვარებს ან ახალს ქმნის.",
        ],
      },
    ],
    summary:
      "შემოდგომით ჭიამაიები სახლში გამოსაზამთრებლად შემოდიან; ამით ყველაზე ცნობილია საქართველოში შემოტანილი აზიური ჭიამაია. ისინი სახლში არ მრავლდებიან და ხეს, საკვებსა თუ ტანსაცმელს არ აზიანებენ. ნუ გაჭყლეტთ: შეაგროვეთ მტვერსასრუტით და გაუშვით გარეთ. გვიან გაზაფხულზე ან ზაფხულში დახურეთ ფანჯრების, კარებისა და მილების ღრიჭოები. ალერგიული რეაქციისას მიმართეთ ექიმს; სუნთქვის გაძნელებისას დარეკეთ 112-ზე.",
    title: "ჭიამაიები სახლში: რატომ იკრიბებიან შემოდგომით და რა ვქნათ?",
  },
  ru: {
    description:
      "Божьи коровки, которые осенью собираются у окон, часто — завезённая азиатская коровка. Как её узнать, кусается ли она и как убрать её без пятен.",
    faq: [
      {
        answer:
          "Иногда. Божья коровка, севшая на кожу, может укусить или ущипнуть. По данным энтомологов Университета Кентукки, это похоже на укол булавкой и редко бывает серьёзным.",
        question: "Кусаются ли божьи коровки?",
      },
      {
        answer:
          "Нет. Они не портят дерево, продукты и одежду. Весь вред — жёлтые пятна и запах, которые остаются, если жука раздавить или потревожить.",
        question: "Портят ли божьи коровки дом или продукты?",
      },
      {
        answer:
          "Для сада — нет: по описанию RHS, она питается в основном тлёй. Но как чужеродный вид она конкурирует за пищу с местными божьими коровками, и в Британии есть данные, что она сократила численность некоторых из них.",
        question: "Азиатская божья коровка — вредитель?",
      },
      {
        answer:
          "В 1980-х годах для биологической борьбы с вредителями в Грузии выпустили более 107 000 жуков, привезённых с Дальнего Востока, но тогда вид не прижился. Первая устойчивая популяция в регионе была отмечена в Сочи в 2012 году, а к 2018 году вид зарегистрировали в Грузии, Армении и на юге России.",
        question: "Когда азиатская божья коровка появилась в Грузии?",
      },
      {
        answer:
          "До конца зимы или ранней весны. С потеплением они становятся активными и пытаются выбраться наружу. Заделайте щели до следующей осени, иначе новые жуки могут снова забраться в дом.",
        question: "Сколько божьи коровки остаются в доме?",
      },
    ],
    intro:
      "Осенью божьи коровки ищут место для зимовки и порой в большом количестве собираются в оконных рамах и щелях. Больше всего известна зимовкой в домах азиатская божья коровка — вид, завезённый в Грузию. Дому она не вредит: соберите жуков пылесосом, не давите их и заделайте щели.",
    metaTitle: "Божьи коровки в доме: почему собираются и как избавиться",
    sections: [
      {
        heading: "Что делать, если в доме много божьих коровок?",
        paragraphs: [
          "Скопление божьих коровок в оконной раме, у щели в двери или на чердаке обычно появляется осенью: жуки ищут защищённое место для зимовки. Это сезонное явление, а не опасность.",
          "Божьи коровки не размножаются в доме и не портят дерево, продукты и одежду. Главные неудобства — их количество, жёлтые пятна и неприятный запах. Не давите их: соберите пылесосом, а затем найдите и заделайте щели, через которые они заходят.",
          "Больше всего известна массовой зимовкой в зданиях азиатская божья коровка (Harmonia axyridis) — вид, завезённый в Грузию. Если насекомое не круглое, а плоское и коричневое, это может быть клоп: см. [мраморный клоп в доме](/insects/farosana-sakhlshi).",
        ],
      },
      {
        heading: "Почему божьи коровки осенью собираются на домах?",
        paragraphs: [
          "Осенью азиатские божьи коровки покидают летние места питания и ищут укрытие на зиму. Здание — одно из таких мест.",
          "По описанию энтомологов Университета Кентукки, активнее всего жуки летают в солнечные послеобеденные часы, когда после похолодания снова теплеет. Они выбирают солнечную юго-западную сторону дома. Контраст светлых и тёмных деталей привлекает их сильнее, чем цвет или материал дома, а в дома, затенённые от послеобеденного солнца, они заходят реже.",
          "Сев на здание, они забираются в щели вокруг оконных и дверных рам, за карнизные доски и обшивку, на чердак и в пустоты стен. Уязвимее всего запущенные здания с множеством отверстий.",
        ],
      },
      {
        heading: "Что значит то, что вы видите в доме?",
        paragraphs: [
          "В таблице — самые частые ситуации. Каждая подробно разобрана ниже.",
        ],
        table: {
          headers: ["Что вы видите", "Что это значит", "Что делать"],
          rows: [
            [
              "Скопление божьих коровок в оконной раме или углу",
              "Жуки собираются на зимовку",
              "Соберите пылесосом, затем заделайте щель",
            ],
            [
              "Жёлтые пятна на стене, шторе или подоконнике",
              "Защитная жидкость потревоженного жука",
              "Не давите жуков и не сметайте их веником",
            ],
            [
              "Божьи коровки у окна или лампы в конце зимы",
              "С потеплением они просыпаются и пытаются выбраться наружу",
              "Соберите их и выпустите на улицу",
            ],
            [
              "Божья коровка села на руку и ущипнула",
              "Укус похож на укол булавкой и редко бывает серьёзным",
              "Не трогайте глаза, пока не вымоете руки",
            ],
          ],
        },
      },
      {
        heading: "Как узнать азиатскую божью коровку?",
        image: "marking",
        paragraphs: [
          "Азиатская божья коровка (Harmonia axyridis) родом из Восточной Азии и завезена в Грузию. По данным RHS, её длина 8–10 мм, а окраска и пятна очень изменчивы.",
          "Самый полезный признак — светлый, беловатый щиток за головой (переднеспинка). Энтомологи Университета Кентукки описывают на нём у большинства азиатских коровок маленький тёмный рисунок в форме буквы M или W. Надкрылья бывают от светло-коричневых до красных, а число пятен различается.",
          "Не полагайтесь на один признак: цвет и число пятен не определяют вид. RHS предупреждает, что азиатскую божью коровку легко спутать с некоторыми местными видами.",
        ],
      },
      {
        heading: "Чёрная божья коровка с красными пятнами — тоже азиатская?",
        image: "black-form",
        paragraphs: [
          "Может быть. По данным RHS, две самые распространённые формы азиатской божьей коровки — чёрная с двумя красными пятнами и оранжевая со множеством чёрных пятен.",
          "Чёрный жук с красными пятнами может оказаться и другим видом, поэтому одного цвета недостаточно. Для надёжного определения сделайте близкий снимок сверху, на котором видны голова и щиток за ней.",
        ],
      },
      {
        heading: "Чем она отличается от семиточечной божьей коровки?",
        image: "seven-spot",
        paragraphs: [
          "Семиточечная божья коровка (Coccinella septempunctata), по описанию RHS, почти всегда красная с семью чёрными пятнами.",
          "Азиатская божья коровка гораздо изменчивее: оранжевая или красная со множеством пятен либо чёрная с красными пятнами. Если у божьей коровки больше или меньше семи пятен или чёрная спина, проверьте светлый щиток за головой и рисунок M или W.",
          "Зимовкой большими группами в зданиях известна именно азиатская божья коровка, поэтому скопление на вашем окне может оказаться совсем не местным видом. Уверенно сказать это можно только после осмотра вблизи.",
        ],
      },
      {
        heading: "Опасны ли божьи коровки для человека?",
        paragraphs: [
          "Обычно нет. По данным энтомологов Университета Кентукки, божья коровка, севшая на кожу, может укусить или ущипнуть; это похоже на укол булавкой и редко бывает серьёзным. Жуки не портят дерево, продукты и одежду.",
          "У некоторых людей большое количество жуков вызывает аллергию — от раздражения глаз до астмы. После контакта с жуками не трогайте глаза, пока не вымоете руки. Если заметите аллергическую реакцию, обратитесь к врачу; если стало трудно дышать, звоните 112.",
        ],
      },
      {
        heading: "Откуда жёлтые пятна и неприятный запах?",
        paragraphs: [
          "Потревоженная божья коровка выделяет из суставов ног желтоватую защитную жидкость. У неё резкий неприятный запах, и она оставляет пятна.",
          "Поэтому не давите жуков и не сметайте их веником со светлой ткани или стены: энтомологи Университета Кентукки отмечают, что веник чаще оставляет пятна. Лучше использовать пылесос.",
        ],
      },
      {
        heading: "Размножаются ли божьи коровки в доме?",
        paragraphs: [
          "Нет. Божьи коровки в доме не размножаются. Жуки, которых видно весной, — обычно те же, что зашли прошлой осенью.",
          "В конце зимы или ранней весной, с потеплением, они снова становятся активными, сначала на солнечной стороне дома. Некоторые, пытаясь выбраться наружу, попадают в комнаты, поэтому их часто видно у окон и светильников.",
        ],
      },
      {
        heading: "Как убрать божьих коровок из дома?",
        list: {
          items: [
            "Используйте пылесос. Энтомологи Университета Кентукки называют его самым простым способом.",
            "Если хотите выпустить жуков, положите носовой платок между шлангом и мешком для пыли, чтобы они остались в нём.",
            "Выпустите собранных жуков на улице, подальше от дома.",
            "Одиночного жука осторожно возьмите листом бумаги или банкой, не раздавив его.",
            "Если божьи коровки всё время появляются в одном месте, там есть щель, которую нужно заделать.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Божьих коровок, попавших в дом, проще и безопаснее всего убрать механически, без химии. По оценке RHS, бороться с этим жуком нежелательно и не нужно — он питается в основном тлёй. Достаточно убрать его из жилых комнат.",
        ],
      },
      {
        heading: "Как не пустить божьих коровок в дом?",
        list: {
          items: [
            "Окна и двери: заделайте щели вокруг рам герметиком.",
            "Карнизы, фасад и коммуникации: заделайте щели вокруг карнизных досок и обшивки и там, где трубы и кабели входят в стену.",
            "Крупные отверстия: заполните цементом, монтажной пеной или медной сеткой.",
            "Сетки: почините сетки на окнах и дверях, а за вентиляционными отверстиями чердака установите сетку.",
            "Двери: установите плотный порог или уплотнитель на низ двери. Щели около 3 мм достаточно, чтобы божья коровка пролезла.",
            "Если каждую осень заходит очень много жуков, обратитесь к специалисту по наружной обработке: по данным энтомологов Университета Кентукки, её нужно проводить осенью до массового заселения, а в конце зимы она уже не действует.",
          ],
        },
        paragraphs: [
          "Самое долговременное решение — заделать входы. Энтомологи Университета Кентукки советуют делать это поздней весной или летом, до того как жуки осенью начнут искать укрытие.",
        ],
      },
      {
        heading: "Чего не стоит делать?",
        list: {
          items: [
            "Не давите божьих коровок: жидкость оставляет запах и пятно.",
            "Не используйте в комнатах аэрозоли и фоггеры: по данным энтомологов Университета Кентукки, они часто неэффективны и могут оставлять пятна.",
            "Не распыляйте инсектициды в пустоты стен: убивать спрятавшихся там жуков редко бывает эффективно.",
            "Не трогайте глаза после контакта с жуками.",
          ],
        },
        paragraphs: [
          "Некоторые быстрые решения не помогают или создают новую проблему.",
        ],
      },
    ],
    summary:
      "Осенью божьи коровки заходят в дом на зимовку; больше всего этим известна азиатская божья коровка, завезённая в Грузию. В доме они не размножаются и не портят дерево, продукты и одежду. Не давите их: соберите пылесосом и выпустите на улицу. Поздней весной или летом заделайте щели вокруг окон, дверей и труб. При аллергической реакции обратитесь к врачу; если стало трудно дышать, звоните 112.",
    title: "Божьи коровки в доме: почему они собираются осенью и что делать?",
  },
  tr: {
    description:
      "Sonbaharda pencerelerde toplanan uğur böcekleri çoğu zaman sonradan gelen Asya uğur böceğidir. Nasıl tanınır, ısırır mı ve leke bırakmadan nasıl uzaklaştırılır?",
    faq: [
      {
        answer:
          "Bazen. Cilde konan bir uğur böceği ısırabilir veya çimdikleyebilir. Kentucky Üniversitesi entomologlarına göre bu bir iğne batmasına benzer ve nadiren ciddidir.",
        question: "Uğur böcekleri ısırır mı?",
      },
      {
        answer:
          "Hayır. Ahşaba, yiyeceğe ve giysiye zarar vermezler. Tek zarar, böcek ezildiğinde veya rahatsız edildiğinde kalan sarı lekeler ve kokudur.",
        question: "Uğur böcekleri eve veya yiyeceklere zarar verir mi?",
      },
      {
        answer:
          "Bahçe için hayır: RHS'nin tanımına göre büyük ölçüde yaprak bitleriyle beslenir. Ancak yabancı bir tür olarak yerli uğur böcekleriyle besin için rekabet eder ve Britanya'da bazılarının sayısını azalttığına dair veriler vardır.",
        question: "Asya uğur böceği zararlı mıdır?",
      },
      {
        answer:
          "1980'lerde zararlılarla biyolojik mücadele için Uzak Doğu'dan getirilen 107.000'den fazla böcek Gürcistan'da salındı, ancak tür o zaman yerleşmedi. Bölgedeki ilk yerleşik popülasyon 2012'de Soçi'de kaydedildi; 2018'e kadar tür Gürcistan, Ermenistan ve güney Rusya'da kaydedilmişti.",
        question: "Asya uğur böceği Gürcistan'da ne zaman ortaya çıktı?",
      },
      {
        answer:
          "Kış sonuna veya ilkbahar başına kadar. Havalar ısındıkça hareketlenir ve dışarı çıkmaya çalışırlar. Aralıkları bir sonraki sonbahardan önce kapatın, yoksa yeni böcekler yeniden girebilir.",
        question: "Uğur böcekleri evde ne kadar kalır?",
      },
    ],
    intro:
      "Sonbaharda uğur böcekleri kışlayacak yer arar ve bazen pencere çerçevelerinde ve aralıklarda çok sayıda toplanır. Evlerde kışlamasıyla en çok bilinen tür, Gürcistan'a sonradan getirilmiş Asya uğur böceğidir. Eve zarar vermez: böcekleri süpürgeyle toplayın, ezmeyin ve aralıkları kapatın.",
    metaTitle: "Evde uğur böcekleri: neden toplanırlar, nasıl uzaklaştırılır",
    sections: [
      {
        heading: "Eve çok sayıda uğur böceği girdiyse ne yapmalı?",
        paragraphs: [
          "Pencere çerçevesinde, kapı aralığında veya çatı arasında uğur böceği kümesi genellikle sonbaharda görülür: böcekler kışı geçirecek korunaklı bir yer arar. Bu mevsimsel bir olaydır, tehlike değildir.",
          "Uğur böcekleri evde üremez; ahşaba, yiyeceğe ve giysiye zarar vermez. Asıl rahatsızlık sayıları, sarı lekeler ve kötü kokudur. Ezmeyin: elektrikli süpürgeyle toplayın, sonra girdikleri aralıkları bulup kapatın.",
          "Binalarda kalabalık kışlamasıyla en çok bilinen tür, Gürcistan'a sonradan getirilmiş Asya uğur böceğidir (Harmonia axyridis). Böcek yuvarlak değil de yassı ve kahverengiyse kokarca olabilir: bkz. [evde kokarca böceği](/insects/farosana-sakhlshi).",
        ],
      },
      {
        heading: "Uğur böcekleri sonbaharda neden evlerde toplanır?",
        paragraphs: [
          "Sonbaharda Asya uğur böcekleri yaz beslenme alanlarını bırakır ve kışlık sığınak arar. Bina bu yerlerden biridir.",
          "Kentucky Üniversitesi entomologlarının tanımına göre böcekler en çok, serin havaların ardından yeniden ısınan güneşli öğleden sonralarda uçar. Evin güneşli güneybatı cephesini tercih ederler. Açık ve koyu renkli ayrıntıların kontrastı onları evin renginden ya da malzemesinden daha çok çeker; öğleden sonra güneşinden gölgede kalan evlere daha az girerler.",
          "Binaya konduktan sonra pencere ve kapı çerçevelerinin çatlaklarına, saçak tahtalarının ve dış cephe kaplamasının arkasına, çatı arasına ve duvar boşluklarına girerler. En savunmasız olanlar, çok sayıda açıklığı olan bakımsız binalardır.",
        ],
      },
      {
        heading: "Evde gördükleriniz ne anlama gelir?",
        paragraphs: [
          "Tabloda en sık karşılaşılan durumlar var. Her biri aşağıda ayrıntılı olarak açıklanıyor.",
        ],
        table: {
          headers: ["Ne görüyorsunuz", "Ne anlama gelir", "Ne yapmalı"],
          rows: [
            [
              "Pencere çerçevesinde veya köşede uğur böceği kümesi",
              "Böcekler kışlamak için toplanıyor",
              "Süpürgeyle toplayın, sonra aralığı kapatın",
            ],
            [
              "Duvarda, perdede veya pencere pervazında sarı leke",
              "Rahatsız edilen böceğin savunma sıvısı",
              "Böcekleri ezmeyin ve süpürgeyle süpürmeyin",
            ],
            [
              "Kış sonunda pencere veya lamba yanında uğur böcekleri",
              "Havalar ısınınca uyanır ve dışarı çıkmaya çalışırlar",
              "Toplayın ve dışarı bırakın",
            ],
            [
              "Elinize konan uğur böceği çimdikledi",
              "Isırık iğne batmasına benzer ve nadiren ciddidir",
              "Ellerinizi yıkamadan gözlerinize dokunmayın",
            ],
          ],
        },
      },
      {
        heading: "Asya uğur böceği nasıl tanınır?",
        image: "marking",
        paragraphs: [
          "Asya uğur böceği (Harmonia axyridis) Doğu Asya kökenlidir ve Gürcistan'a sonradan getirilmiştir. RHS'ye göre boyu 8–10 mm'dir; rengi ve benekleri çok değişkendir.",
          "En yararlı özellik, başın arkasındaki açık, beyazımsı alandır (ön göğüs). Kentucky Üniversitesi entomologları Asya uğur böceklerinin çoğunda bu alanda M veya W harfine benzeyen küçük koyu bir işaret tanımlar. Kanat örtüleri açık kahverengiden kırmızıya kadar değişir, benek sayısı da farklıdır.",
          "Tek bir özelliğe güvenmeyin: renk ve benek sayısı türü belirlemez. RHS, Asya uğur böceğinin bazı yerli türlerle kolayca karıştırıldığı konusunda uyarır.",
        ],
      },
      {
        heading: "Kırmızı benekli siyah uğur böceği de Asya uğur böceği mi?",
        image: "black-form",
        paragraphs: [
          "Olabilir. RHS'ye göre Asya uğur böceğinin en yaygın iki formu, iki kırmızı benekli siyah ve çok sayıda siyah benekli turuncu formdur.",
          "Kırmızı benekli siyah bir böcek başka bir tür de olabilir; bu yüzden yalnızca renk yeterli değildir. Güvenilir bir tanı için baş ve arkasındaki alan görünecek şekilde yukarıdan yakın bir fotoğraf çekin.",
        ],
      },
      {
        heading: "Yedi noktalı uğur böceğinden farkı nedir?",
        image: "seven-spot",
        paragraphs: [
          "Yedi noktalı uğur böceği (Coccinella septempunctata), RHS'nin tanımına göre neredeyse her zaman yedi siyah benekli kırmızıdır.",
          "Asya uğur böceği çok daha değişkendir: çok benekli turuncu veya kırmızı ya da kırmızı benekli siyah. Bir uğur böceğinin yediden fazla veya az beneği varsa ya da sırtı siyahsa, başın arkasındaki açık rengi ve M veya W işaretini kontrol edin.",
          "Binalarda büyük gruplar hâlinde kışlamasıyla bilinen tür Asya uğur böceğidir; bu yüzden pencerenizde toplananlar yerli bir tür olmayabilir. Bunu kesin söylemek ancak yakından baktıktan sonra mümkündür.",
        ],
      },
      {
        heading: "Uğur böcekleri insanlar için tehlikeli mi?",
        paragraphs: [
          "Genellikle hayır. Kentucky Üniversitesi entomologlarına göre cilde konan bir uğur böceği ısırabilir veya çimdikleyebilir; bu bir iğne batmasına benzer ve nadiren ciddidir. Böcekler ahşaba, yiyeceğe ve giysiye zarar vermez.",
          "Bazı kişilerde çok sayıda böcek göz tahrişinden astıma kadar alerjiye yol açabilir. Böceklere dokunduktan sonra ellerinizi yıkamadan gözlerinize dokunmayın. Alerjik bir tepki fark ederseniz doktora başvurun; nefes almakta zorlanırsanız 112'yi arayın.",
        ],
      },
      {
        heading: "Sarı lekeler ve kötü koku nedir?",
        paragraphs: [
          "Rahatsız edilen uğur böceği bacak eklemlerinden sarımsı bir savunma sıvısı salgılar. Bu sıvının keskin, kötü bir kokusu vardır ve yüzeyde leke bırakır.",
          "Bu yüzden böcekleri ezmeyin ve açık renkli kumaştan ya da duvardan süpürgeyle süpürmeyin: Kentucky Üniversitesi entomologları süpürgenin leke bırakma olasılığının daha yüksek olduğunu belirtir. Elektrikli süpürge daha iyidir.",
        ],
      },
      {
        heading: "Uğur böcekleri evde ürer mi?",
        paragraphs: [
          "Hayır. Uğur böcekleri evde üremez. İlkbaharda görülen böcekler genellikle önceki sonbaharda girenlerin aynısıdır.",
          "Kış sonunda veya ilkbahar başında, havalar ısındıkça yeniden hareketlenirler; önce evin güneşli tarafında. Bazıları dışarı çıkmaya çalışırken odalara girer, bu yüzden sık sık pencere ve lambaların yanında görülürler.",
        ],
      },
      {
        heading: "Uğur böcekleri evden nasıl uzaklaştırılır?",
        list: {
          items: [
            "Elektrikli süpürge kullanın. Kentucky Üniversitesi entomologları bunu en kolay yol olarak tanımlar.",
            "Böcekleri dışarı bırakmak istiyorsanız hortum ile toz torbası arasına bir mendil koyun; böcekler mendilde kalır.",
            "Topladığınız böcekleri dışarıda, evden uzakta bırakın.",
            "Tek bir böceği ezmeden, bir kâğıt parçası veya kavanozla dikkatlice alın.",
            "Uğur böcekleri hep aynı yerde görünüyorsa orada kapatılması gereken bir aralık vardır.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Eve giren uğur böceklerini uzaklaştırmanın en kolay ve güvenli yolu, kimyasal kullanmadan mekanik yöntemdir. RHS'nin değerlendirmesine göre bu böcekle mücadele ne istenir ne de gereklidir; büyük ölçüde yaprak bitleriyle beslenir. Yaşam alanlarından uzaklaştırmak yeterlidir.",
        ],
      },
      {
        heading: "Uğur böceklerinin eve girmesi nasıl önlenir?",
        list: {
          items: [
            "Pencereler ve kapılar: çerçevelerin çevresindeki çatlakları dolgu macunuyla kapatın.",
            "Saçak, cephe ve tesisat: saçak tahtaları ve dış cephe kaplaması çevresindeki çatlakları ve boru ile kabloların duvara girdiği yerleri kapatın.",
            "Büyük delikler: çimento, genleşen köpük veya bakır telle doldurun.",
            "Sineklikler: pencere ve kapı sinekliklerini onarın, çatı arası havalandırma açıklıklarının arkasına sineklik takın.",
            "Kapılar: sıkı bir eşik veya kapı altı fitili takın. Yaklaşık 3 mm'lik bir aralık bile uğur böceğinin girmesine yeter.",
            "Her sonbahar çok sayıda böcek giriyorsa dış ilaçlama için bir uzmana başvurun: Kentucky Üniversitesi entomologlarına göre bu, sonbaharda toplu girişten önce yapılmalıdır; kış sonunda artık etkili olmaz.",
          ],
        },
        paragraphs: [
          "En kalıcı çözüm giriş noktalarını kapatmaktır. Kentucky Üniversitesi entomologları bunu, böcekler sonbaharda sığınak aramaya başlamadan önce, ilkbahar sonunda veya yazın yapmayı önerir.",
        ],
      },
      {
        heading: "Neler yapılmamalı?",
        list: {
          items: [
            "Uğur böceklerini ezmeyin: sıvı koku ve leke bırakır.",
            "Odalarda sprey veya sisleyici kullanmayın: Kentucky Üniversitesi entomologlarına göre bunlar çoğu zaman etkisizdir ve yüzeyleri lekeleyebilir.",
            "Duvar boşluklarına böcek ilacı sıkmayın: orada saklanan böcekleri öldürmek nadiren etkilidir.",
            "Böceklere dokunduktan sonra gözlerinize dokunmayın.",
          ],
        },
        paragraphs: [
          "Bazı hızlı çözümler sorunu çözmez ya da yeni bir sorun yaratır.",
        ],
      },
    ],
    summary:
      "Sonbaharda uğur böcekleri kışlamak için eve girer; bununla en çok bilinen tür, Gürcistan'a sonradan getirilmiş Asya uğur böceğidir. Evde üremezler; ahşaba, yiyeceğe ve giysiye zarar vermezler. Ezmeyin: elektrikli süpürgeyle toplayıp dışarı bırakın. İlkbahar sonunda veya yazın pencere, kapı ve boru çevresindeki aralıkları kapatın. Alerjik tepkide doktora başvurun; nefes almakta zorlanırsanız 112'yi arayın.",
    title: "Evde uğur böcekleri: sonbaharda neden toplanırlar, ne yapmalı?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "University of Kentucky Entomology (ENTFACT-416) — Asian Lady Beetle Infestation of Structures",
    supports: {
      en: "Autumn flights to buildings on sunny afternoons after cool weather; sunny southwest sides and light-dark contrast; hiding in frame cracks, fascia, siding, attics and wall voids; no reproduction indoors and no damage to wood, food or clothing; pinprick bite, seldom serious; yellowish defensive fluid that stains and smells; allergies from eye irritation to asthma; vacuuming with a handkerchief to release; brooms stain; sealing in late spring or summer, 1/8-inch gaps, foam, cement or copper mesh, screens and door sweeps; indoor foggers and sprays not recommended; outdoor treatment timed in autumn; spring activity near windows and lights; M- or W-shaped mark behind the head.",
      ka: "შემოდგომით შენობებისკენ ფრენა მზიან შუადღეებზე აგრილების შემდეგ; მზიანი სამხრეთ-დასავლეთი მხარე და ღია-მუქი ფერების კონტრასტი; ჩარჩოების ნაპრალები, კარნიზი, მოპირკეთება, სხვენი და კედლის ღრუები; სახლში არ მრავლდება და ხეს, საკვებსა და ტანსაცმელს არ აზიანებს; ქინძისთავის ჩხვლეტის მსგავსი, იშვიათად სერიოზული ნაკბენი; მოყვითალო თავდაცვითი სითხე, რომელიც ლაქას და სუნს ტოვებს; ალერგია თვალის გაღიზიანებიდან ასთმამდე; მტვერსასრუტი ცხვირსახოცით გასაშვებად; ცოცხი ლაქას ტოვებს; დახურვა გვიან გაზაფხულზე ან ზაფხულში, დაახლოებით 3 მმ ღრიჭო, ქაფი, ცემენტი ან სპილენძის ბადე, ბადეები და ზღურბლი; ოთახში ფოგერი და აეროზოლი რეკომენდებული არ არის; გარე დამუშავება შემოდგომით; გაზაფხულზე აქტიურობა ფანჯრებთან და სანათებთან; M ან W ნიშანი თავის უკან.",
      ru: "Осенние перелёты к зданиям в солнечные дни после похолодания; солнечная юго-западная сторона и контраст светлого и тёмного; щели рам, карнизы, обшивка, чердаки и пустоты стен; в доме не размножаются и не портят дерево, продукты и одежду; укус как укол булавкой, редко серьёзный; желтоватая защитная жидкость, оставляющая пятна и запах; аллергия от раздражения глаз до астмы; пылесос с платком, чтобы выпустить жуков; веник оставляет пятна; герметизация поздней весной или летом, щели около 3 мм, пена, цемент или медная сетка, сетки и дверные уплотнители; фоггеры и аэрозоли в доме не рекомендуются; наружная обработка осенью; весенняя активность у окон и ламп; рисунок M или W за головой.",
      tr: "Serin havanın ardından güneşli öğleden sonralarda binalara sonbahar uçuşları; güneşli güneybatı cephesi ve açık-koyu kontrastı; çerçeve çatlakları, saçak, kaplama, çatı arası ve duvar boşlukları; evde üremez, ahşap, yiyecek ve giysiye zarar vermez; iğne batmasına benzer, nadiren ciddi ısırık; leke ve koku bırakan sarımsı savunma sıvısı; göz tahrişinden astıma alerji; bırakmak için mendilli elektrikli süpürge; süpürge leke bırakır; ilkbahar sonu veya yaz yalıtımı, yaklaşık 3 mm aralık, köpük, çimento veya bakır tel, sineklik ve kapı fitili; iç mekânda sisleyici ve sprey önerilmez; dış ilaçlama sonbaharda; ilkbaharda pencere ve lamba yanında hareketlilik; başın arkasında M veya W işareti.",
    },
    url: "https://entomology.mgcafe.uky.edu/ef416",
  },
  {
    name: "Royal Horticultural Society (RHS) — Ladybirds",
    supports: {
      en: "Harlequin ladybird: introduced, 8–10 mm, very variable; common forms black with two red spots or orange with many black spots; easily confused with some native species; some evidence of declines in native ladybirds through competition for food; overwinters inside buildings in very large numbers; largely an aphid predator; control neither desirable nor necessary. Seven-spot ladybird almost always red with seven black spots.",
      ka: "აზიური ჭიამაია: შემოტანილი, 8–10 მმ, ძალიან ცვალებადი; გავრცელებული ფორმები — შავი ორი წითელი ლაქით ან ნარინჯისფერი ბევრი შავი ლაქით; ადვილად ერევა ზოგ ადგილობრივ სახეობაში; არსებობს მონაცემები ადგილობრივი ჭიამაიების შემცირებაზე საკვებისთვის კონკურენციის გამო; შენობებში ძალიან დიდი რაოდენობით იზამთრებს; ძირითადად ბუგრებით იკვებება; კონტროლი არც სასურველია და არც საჭირო. შვიდწერტილა ჭიამაია თითქმის ყოველთვის წითელია შვიდი შავი ლაქით.",
      ru: "Азиатская божья коровка: завезённый вид, 8–10 мм, очень изменчива; частые формы — чёрная с двумя красными пятнами или оранжевая со множеством чёрных пятен; легко спутать с некоторыми местными видами; есть данные о сокращении местных божьих коровок из-за конкуренции за пищу; зимует в зданиях в очень большом количестве; питается в основном тлёй; бороться с ней нежелательно и не нужно. Семиточечная почти всегда красная с семью чёрными пятнами.",
      tr: "Asya uğur böceği: sonradan getirilmiş, 8–10 mm, çok değişken; yaygın formlar iki kırmızı benekli siyah veya çok siyah benekli turuncu; bazı yerli türlerle kolayca karışır; besin rekabeti nedeniyle yerli uğur böceklerinin azaldığına dair veriler; binalarda çok sayıda kışlar; büyük ölçüde yaprak biti avcısı; mücadele ne istenir ne de gereklidir. Yedi noktalı uğur böceği neredeyse her zaman yedi siyah benekli kırmızıdır.",
    },
    url: "https://www.rhs.org.uk/biodiversity/ladybirds",
  },
  {
    name: "Orlova-Bienkowskaja et al. 2018 — Coinvasion by the ladybird Harmonia axyridis and its parasites in the Caucasus (PLOS ONE 13: e0202841)",
    supports: {
      en: "Native to East Asia; more than 107,000 specimens from the Far East released in Georgia in the 1980s without establishment; first established population in the region in Sochi in 2012; recorded in Armenia, Georgia and south Russia by 2018.",
      ka: "აღმოსავლეთ აზიის სახეობა; 1980-იან წლებში საქართველოში შორეული აღმოსავლეთიდან ჩამოტანილი 107 ათასზე მეტი ეგზემპლარი გამოუშვეს, მაგრამ არ დამკვიდრდა; რეგიონში პირველი დამკვიდრებული პოპულაცია — სოჭი, 2012; 2018 წლისთვის აღრიცხულია საქართველოში, სომხეთსა და სამხრეთ რუსეთში.",
      ru: "Родом из Восточной Азии; в 1980-х в Грузии выпустили более 107 000 особей с Дальнего Востока, но вид не прижился; первая устойчивая популяция в регионе — Сочи, 2012; к 2018 году отмечен в Грузии, Армении и на юге России.",
      tr: "Doğu Asya kökenli; 1980'lerde Uzak Doğu'dan getirilen 107.000'den fazla birey Gürcistan'da salındı ama yerleşmedi; bölgedeki ilk yerleşik popülasyon 2012'de Soçi'de; 2018'e kadar Gürcistan, Ermenistan ve güney Rusya'da kaydedildi.",
    },
    url: "https://doi.org/10.1371/journal.pone.0202841",
  },
];

export const LADYBIRDS_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Dozens of ladybirds, most of them orange with black spots, packed into the corner of a wooden window frame for the winter",
      ka: "ათობით ჭიამაია, უმეტესად ნარინჯისფერი შავი ლაქებით, ზამთრისთვის ხის ფანჯრის ჩარჩოს კუთხეში შეგროვებული",
      ru: "Десятки божьих коровок, в основном оранжевых с чёрными пятнами, набились на зиму в угол деревянной оконной рамы",
      tr: "Çoğu siyah benekli turuncu onlarca uğur böceği, kışı geçirmek için ahşap pencere çerçevesinin köşesine toplanmış",
    },
    credit: {
      en: "Photo: Gilles San Martin / Wikimedia Commons, CC BY-SA 2.0; resized. Harlequin ladybirds overwintering in a window frame, Belgium.",
      ka: "ფოტო: Gilles San Martin / Wikimedia Commons, CC BY-SA 2.0; ზომა შემცირებულია. აზიური ჭიამაიები ფანჯრის ჩარჩოში იზამთრებენ, ბელგია.",
      ru: "Фото: Gilles San Martin / Wikimedia Commons, CC BY-SA 2.0; размер уменьшен. Азиатские божьи коровки зимуют в оконной раме, Бельгия.",
      tr: "Fotoğraf: Gilles San Martin / Wikimedia Commons, CC BY-SA 2.0; yeniden boyutlandırıldı. Pencere çerçevesinde kışlayan Asya uğur böcekleri, Belçika.",
    },
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Harmonia_axyridis_winter_aggregate_(3014117486).jpg",
    height: 1071,
    license: {
      name: "CC BY-SA 2.0",
      url: "https://creativecommons.org/licenses/by-sa/2.0/",
    },
    src: "https://cdn.reptiles.ge/images/guides/ladybird-house-hero.jpg",
    width: 1600,
  },
  id: "ladybirds-in-house",
  images: {
    "black-form": {
      alt: {
        en: "A shiny black ladybird with red spots on its back and pale patches behind the head, on a green leaf",
        ka: "პრიალა შავი ჭიამაია ზურგზე წითელი ლაქებით და თავის უკან ღია ლაქებით, მწვანე ფოთოლზე",
        ru: "Блестящая чёрная божья коровка с красными пятнами на спине и светлыми пятнами за головой на зелёном листе",
        tr: "Sırtında kırmızı benekler ve başının arkasında açık lekeler olan parlak siyah bir uğur böceği, yeşil bir yaprak üzerinde",
      },
      credit: {
        en: "Photo: Bernard Dupont / Wikimedia Commons, CC BY-SA 2.0; cropped and resized. Harmonia axyridis, black form, France.",
        ka: "ფოტო: Bernard Dupont / Wikimedia Commons, CC BY-SA 2.0; ამოჭრილი და შემცირებული. Harmonia axyridis, შავი ფორმა, საფრანგეთი.",
        ru: "Фото: Bernard Dupont / Wikimedia Commons, CC BY-SA 2.0; кадрировано, размер уменьшен. Harmonia axyridis, чёрная форма, Франция.",
        tr: "Fotoğraf: Bernard Dupont / Wikimedia Commons, CC BY-SA 2.0; kırpıldı ve yeniden boyutlandırıldı. Harmonia axyridis, siyah form, Fransa.",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Harmonia_axyridis_var._spectabilis_(41172172230).jpg",
      height: 1066,
      license: {
        name: "CC BY-SA 2.0",
        url: "https://creativecommons.org/licenses/by-sa/2.0/",
      },
      src: "https://cdn.reptiles.ge/images/guides/ladybird-house-black-form.jpg",
      width: 1600,
    },
    marking: {
      alt: {
        en: "Close-up of a red ladybird with many black spots on a person's skin; the pale area behind its head has a dark M-shaped mark",
        ka: "წითელი, მრავალლაქიანი ჭიამაია ადამიანის კანზე ახლო ხედით; თავის უკან ღია ფარზე მუქი, M ასოს მსგავსი ნიშანია",
        ru: "Крупный план красной божьей коровки со множеством чёрных пятен на коже человека; на светлом щитке за головой тёмный рисунок в форме буквы M",
        tr: "İnsan cildi üzerinde çok sayıda siyah benekli kırmızı bir uğur böceğinin yakın çekimi; başının arkasındaki açık alanda M biçiminde koyu bir işaret var",
      },
      credit: {
        en: "Photo: Rudolphous / Wikimedia Commons, CC BY-SA 4.0; resized. Harmonia axyridis, Noordwijk, Netherlands.",
        ka: "ფოტო: Rudolphous / Wikimedia Commons, CC BY-SA 4.0; ზომა შემცირებულია. Harmonia axyridis, ნორდვეიკი, ნიდერლანდები.",
        ru: "Фото: Rudolphous / Wikimedia Commons, CC BY-SA 4.0; размер уменьшен. Harmonia axyridis, Нордвейк, Нидерланды.",
        tr: "Fotoğraf: Rudolphous / Wikimedia Commons, CC BY-SA 4.0; yeniden boyutlandırıldı. Harmonia axyridis, Noordwijk, Hollanda.",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Noordwijk_-_Veelstippig_Aziatisch_lieveheersbeestje_(Harmonia_axyridis_f._succinea)_v4.jpg",
      height: 1110,
      license: {
        name: "CC BY-SA 4.0",
        url: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
      src: "https://cdn.reptiles.ge/images/guides/ladybird-house-marking.jpg",
      width: 1600,
    },
    "seven-spot": {
      alt: {
        en: "A red ladybird with seven black spots and a black area behind the head with small white patches, on young green leaves",
        ka: "წითელი ჭიამაია შვიდი შავი ლაქით, თავის უკან შავი ფარით და პატარა თეთრი ლაქებით, ახალგაზრდა მწვანე ფოთლებზე",
        ru: "Красная божья коровка с семью чёрными пятнами и чёрным щитком с маленькими белыми пятнами за головой на молодых зелёных листьях",
        tr: "Yedi siyah benekli, başının arkasında küçük beyaz lekeli siyah bir alan bulunan kırmızı uğur böceği, genç yeşil yapraklar üzerinde",
      },
      credit: {
        en: "Photo: Quartl / Wikimedia Commons, CC BY-SA 3.0; cropped and resized. Seven-spot ladybird, Ahlen, Germany.",
        ka: "ფოტო: Quartl / Wikimedia Commons, CC BY-SA 3.0; ამოჭრილი და შემცირებული. შვიდწერტილა ჭიამაია, ალენი, გერმანია.",
        ru: "Фото: Quartl / Wikimedia Commons, CC BY-SA 3.0; кадрировано, размер уменьшен. Семиточечная божья коровка, Ален, Германия.",
        tr: "Fotoğraf: Quartl / Wikimedia Commons, CC BY-SA 3.0; kırpıldı ve yeniden boyutlandırıldı. Yedi noktalı uğur böceği, Ahlen, Almanya.",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Coccinella_septempunctata_qtl1.jpg",
      height: 1066,
      license: {
        name: "CC BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      src: "https://cdn.reptiles.ge/images/guides/ladybird-house-seven-spot.jpg",
      width: 1600,
    },
  },
  messageKey: "ladybirdsInHouse",
  ogImage: "https://cdn.reptiles.ge/og/images/guides/ladybirds-in-house.jpg",
  parentHub: "insects",
  pathname: "/insects/chiamaiebi-sakhlshi",
  relatedGuideIds: ["stink-bug-in-house"],
  search: {
    icon: "guide",
    keywords: [
      "ჭიამაია",
      "ჭიამაიები",
      "ჭიამაია სახლში",
      "ჭიამაიები სახლში",
      "აზიური ჭიამაია",
      "ჭიამაია ფანჯარაზე",
      "chiamaia",
      "chiamaiebi",
      "ladybird",
      "ladybug",
      "ladybugs in house",
      "harlequin ladybird",
      "Asian lady beetle",
      "Harmonia axyridis",
      "божья коровка",
      "божьи коровки в квартире",
      "азиатская божья коровка",
      "uğur böceği",
      "evde uğur böceği",
      "Asya uğur böceği",
    ],
    rank: 5,
    subtitle: {
      en: "Why they gather in autumn and how to remove them",
      ka: "რატომ იკრიბებიან შემოდგომით და როგორ მოვიშოროთ",
      ru: "Почему собираются осенью и как от них избавиться",
      tr: "Sonbaharda neden toplanırlar ve nasıl uzaklaştırılır",
    },
    title: {
      en: "Ladybirds in the house",
      ka: "ჭიამაიები სახლში",
      ru: "Божьи коровки в доме",
      tr: "Evde uğur böcekleri",
    },
  },
  sources: SOURCES,
});
