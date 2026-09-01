import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL =
  "https://herpetologynotes.org/index.php/hn/article/view/341";
const PAPER_PDF_URL =
  "https://herpetologynotes.org/index.php/hn/article/download/341/202";
const CHECKLIST_URL = "https://doi.org/10.3897/caucasiana.5.e189214";

const PHOTO_DIR = "/images/news/vipera-pontica-hybrid-georgia-2026";

const PHOTO_HYBRID: NewsPhoto = {
  src: `${PHOTO_DIR}/figure-3.jpg`,
  plate: true,
  alt: {
    ka: "სავარაუდო ჰიბრიდი გველგესლა ბორჯომის ხეობაში, 2025 წლის 7 მაისი. Herpetology Notes, CC BY-NC 4.0.",
    en: "Putative hybrid viper in the Borjomi valley, 7 May 2025. Herpetology Notes, CC BY-NC 4.0.",
    ru: "Предполагаемый гибрид гадюки в Боржомском ущелье, 7 мая 2025. Herpetology Notes, CC BY-NC 4.0.",
    tr: "Borjomi vadisinde olası hibrit engerek, 7 Mayıs 2025. Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    photographer: "Bas Raaijmakers, Sten Gijbels",
    url: PAPER_URL,
    location: "ბორჯომის ხეობა",
    date: "2025-05-07",
  },
};

const PHOTO_HABITAT: NewsPhoto = {
  src: `${PHOTO_DIR}/figure-2.jpg`,
  plate: true,
  alt: {
    ka: "კავკასიური გველგესლას (A) და ცხვირრქოსანი გველგესლას (B) ჰაბიტატი ბორჯომის ხეობაში. ეს ზუსტად ჰიბრიდის ადგილი არ არის. Herpetology Notes, CC BY-NC 4.0.",
    en: "Habitats of Caucasus viper (A) and nose-horned viper (B) in the Borjomi valley. Not the exact hybrid site. Herpetology Notes, CC BY-NC 4.0.",
    ru: "Местообитания кавказской (A) и носатой (B) гадюк в Боржомском ущелье. Это не точная точка гибрида. Herpetology Notes, CC BY-NC 4.0.",
    tr: "Borjomi vadisinde Kafkas engereği (A) ve boynuzlu engerek (B) habitatı. Hibritin tam yeri değil. Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    photographer: "Bas Raaijmakers, Sten Gijbels",
    url: PAPER_URL,
    location: "ბორჯომის ხეობა",
  },
};

const PHOTO_MAP: NewsPhoto = {
  src: `${PHOTO_DIR}/figure-1.jpg`,
  plate: true,
  alt: {
    ka: "ნაშრომის სავარაუდო არეალები და 2025 წლის დაკვირვების ადგილი. Herpetology Notes, CC BY-NC 4.0.",
    en: "The paper’s approximate ranges and the 2025 observation site. Herpetology Notes, CC BY-NC 4.0.",
    ru: "Приблизительные ареалы из статьи и место наблюдения 2025 года. Herpetology Notes, CC BY-NC 4.0.",
    tr: "Makalenin yaklaşık yayılışları ve 2025 gözlem yeri. Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    photographer: "Bas van Blitterswijk",
    url: PAPER_URL,
    location: "ბორჯომის ხეობა",
  },
};

const PHOTO_COMPARE: NewsPhoto = {
  src: `${PHOTO_DIR}/figure-4.jpg`,
  plate: true,
  alt: {
    ka: "ბორჯომის ხეობა: კავკასიური გველგესლა (A–C), სავარაუდო ჰიბრიდი (D–F), ცხვირრქოსანი გველგესლა (G–I). Herpetology Notes, CC BY-NC 4.0.",
    en: "Borjomi valley: Caucasus viper (A–C), putative hybrid (D–F), nose-horned viper (G–I). Herpetology Notes, CC BY-NC 4.0.",
    ru: "Боржомское ущелье: кавказская гадюка (A–C), предполагаемый гибрид (D–F), носатая гадюка (G–I). Herpetology Notes, CC BY-NC 4.0.",
    tr: "Borjomi vadisi: Kafkas engereği (A–C), olası hibrit (D–F), boynuzlu engerek (G–I). Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    photographer: "Sten Gijbels, Bas Raaijmakers",
    url: PAPER_URL,
    location: "ბორჯომის ხეობა",
  },
};

const FIGURE_HABITAT = {
  type: "figure" as const,
  src: PHOTO_HABITAT.src,
};
const FIGURE_MAP = {
  type: "figure" as const,
  src: PHOTO_MAP.src,
};
const FIGURE_COMPARE = {
  type: "figure" as const,
  src: PHOTO_COMPARE.src,
};

export const VIPERA_PONTICA_HYBRID_GEORGIA_2026: NewsArticle = {
  id: "vipera-pontica-hybrid-georgia-2026",
  slug: "vipera-pontica-hybrid-georgia-2026",
  status: "published",
  publishedAt: "2026-09-01",
  updatedAt: "2026-09-01",
  relatedSpeciesIds: ["vipera-kaznakovi", "vipera-transcaucasiana"],
  relatedRegionIds: ["samtskhe-javakheti"],
  relatedHubIds: ["snakes"],
  image: PHOTO_HYBRID,
  gallery: [PHOTO_HABITAT, PHOTO_MAP, PHOTO_COMPARE],
  sources: [
    {
      name: "Raaijmakers et al. 2026 — Finding Vipera pontica (Herpetology Notes)",
      url: PAPER_URL,
    },
    {
      name: "Raaijmakers et al. 2026 — PDF",
      url: PAPER_PDF_URL,
    },
    {
      name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia’s amphibians and reptiles",
      url: CHECKLIST_URL,
    },
  ],
  copy: {
    ka: {
      title:
        "ბორჯომის ხეობაში ზრდასრული „პონტური გველგესლა“ დააფიქსირეს — ეს ჰიბრიდია, არა ახალი სახეობა",
      metaTitle:
        "ბორჯომის ხეობაში ზრდასრული „პონტური გველგესლა“ დააფიქსირეს — ეს ჰიბრიდია, არა ახალი სახეობა",
      metaDescription:
        "2025 წლის 7 მაისს ბორჯომის ხეობაში დააფიქსირეს ზრდასრული გველგესლა, რომელიც კავკასიურ და ცხვირრქოსან გველგესლას შორის შუალედურია. 2026 წლის ნაშრომი Vipera pontica-ს ცალკე სახეობად არ იღებს.",
      dek: "Herpetology Notes-ში გამოქვეყნდა ბორჯომის ხეობის ზრდასრული გველგესლა შუალედური ნიშნებით. ავტორები მას იშვიათ ჰიბრიდად განიხილავენ და არა მესამე სახეობად.",
      lead: "2025 წლის 7 მაისს ბორჯომის ხეობაში, მტკვრის ზემო დინებაში, დააფიქსირეს ზრდასრული გველგესლა, რომელსაც კავკასიური გველგესლასა და ცხვირრქოსანი გველგესლას ნიშნები ერთდროულად ჰქონდა. დაკვირვება 2026 წლის 10 ივნისს Herpetology Notes-ში გამოქვეყნდა. ავტორები წერენ, რომ ეს არის პირველი დოკუმენტირებული ზრდასრული ინდივიდი, რომელიც ძველ სახელს Vipera pontica ჰგავს, და პირველი ასეთი ჩანაწერი საქართველოდან. ისინი მას ცალკე სახეობად არ იღებენ. გველი Reptiles.ge-ს არ უნახავს; აქ მხოლოდ ამ ნაშრომია გადმოტანილი.",
      sections: [
        {
          heading: "რა მოხდა?",
          blocks: [
            {
              type: "p",
              parts: [
                "დაკვირვება 7 მაისს, დილის 10:45-ზე, ",
                {
                  type: "region",
                  id: "samtskhe-javakheti",
                  label: "სამცხე — ჯავახეთში",
                },
                ", ბორჯომის ხეობაში იყო. ავტორები ადგილს მტკვრის ზემო დინების ხეობას უწოდებენ, სიმაღლეს — 800 მ-ზე მეტს. იმავე დილით იქვე ხუთი ზრდასრული ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "ცხვირრქოსანი გველგესლა",
                },
                " ნახეს. სავარაუდო ჰიბრიდი ჯერ ტყის პირას ათბობდა, შემდეგ კი ცხვირრქოსან გველგესლასთან ახლოს.",
              ],
            },
            FIGURE_HABITAT,
            {
              type: "p",
              parts: [
                "ნაშრომში გველი შესაძლო ზრდასრულ მამალადაა აღწერილი. სხეულის სიგრძე მუწუკიდან კლოაკამდე 447 მმ იყო, კუდი — 61 მმ, სულ — 508 მმ. ეგზემპლარი არ აუღიათ: იდენტიფიკაცია საველე დაკვირვებასა და ფოტოებს ეყრდნობა. ამ ინდივიდის დნმ ნაშრომში არ არის.",
              ],
            },
          ],
        },
        {
          heading: "რა არის Vipera pontica?",
          blocks: [
            {
              type: "p",
              parts: [
                "სახელი ",
                { type: "sci", name: "Vipera pontica" },
                " 1990 წელს ორ ახალგაზრდა ნიმუშზე დაარქვეს ჩრდილო-აღმოსავლეთ თურქეთიდან, ართვინის ჩოროხის ხეობიდან. მას შემდეგ ტაქსონი სადავო იყო. ბოლო გენომური კვლევები, რომლებსაც ეს ნაშრომი ეყრდნობა, ამ გველებს ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "კავკასიურ გველგესლას",
                },
                " (",
                { type: "sci", name: "Vipera kaznakovi" },
                ") და ცხვირრქოსან გველგესლას (",
                { type: "sci", name: "Vipera ammodytes transcaucasiana" },
                ") შორის იშვიათ ჰიბრიდად მიიჩნევს — არა დამოუკიდებელ ხაზად.",
              ],
            },
            FIGURE_MAP,
            {
              type: "p",
              parts: [
                "ბორჯომის ჩანაწერი ამ სავარაუდო ჰიბრიდულ ფორმას ტიპის ადგილიდან დაახლოებით 150 კმ-ით აღმოსავლეთით აგრძელებს. 1983 წელს გორიდან უჩვეულო ნიმუშია აღწერილი; ავტორები მის სტატუსს გაურკვევლად ტოვებენ და ამ დაკვირვებას მასზე არ აფუძნებენ.",
              ],
            },
          ],
        },
        {
          heading: "რა ნიშნები ჰქონდა?",
          blocks: [
            {
              type: "p",
              parts: [
                "გველს აწეული, მაგრამ ურქო ცხვირი ჰქონდა, დანაწევრებული თავის ქერცლი, შუალედური მუცლისა და ქვეკუდის ფარების რიცხვი, შერეული ზურგის ზიგზაგი და ორფეროვანი კუდის წვერი. ავტორები ამას ორივე მშობელი სახეობის დიაგნოსტიკურ ნიშანთა ნაზავს უწოდებენ.",
              ],
            },
            FIGURE_COMPARE,
            {
              type: "p",
              parts: [
                "ისინი წერენ, რომ ასეთი კოორდინირებული ნაზავი ერთი ანომალიით ან ადგილობრივი ვარიაციით არ აიხსნება და F1 ჰიბრიდს ემთხვევა. უკუჯვარედინი გენეტიკური მონაცემის გარეშე არ არის გამორიცხული. ",
                { type: "sci", name: "Vipera berus barani" },
                "-ის მონაწილეობას ნაკლებად სავარაუდოდ მიიჩნევენ: სახეობა საქართველოში არ არის ცნობილი.",
              ],
            },
          ],
        },
        {
          heading: "რას ნიშნავს ეს ატლასისთვის?",
          blocks: [
            {
              type: "p",
              parts: [
                "ეს მესამე გველგესლა არ არის. ნაშრომი ",
                { type: "sci", name: "V. pontica" },
                "-ს ორივე მშობლის სინონიმიაში ტოვებს. ამ ატლასში ქართული ცხვირრქოსანი გველგესლა ",
                { type: "sci", name: "Vipera ammodytes" },
                "-ია, ქვესახეობა transcaucasiana; ტიპის ადგილი ბორჯომია. იგივე ხაზი აქვს 2026 წლის ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "ჩამონათვალს",
                },
                ".",
              ],
            },
            {
              type: "p",
              parts: [
                "ავტორები ბორჯომის ხეობაში ვიწრო კონტაქტის ზონას აღწერენ: ნოტიო, ბალახოვან ადგილას ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "კავკასიური გველგესლა",
                },
                ", კლდოვან ფერდობზე — ცხვირრქოსანი. იქ, სადაც ეს მიკროჰაბიტატები იკვეთება, იშვიათი შეჯვარება შესაძლებელია. შხამიანია ორივე მშობელი. ჰიბრიდის ცალკე რისკი აქ არ არის გაზომილი. თუ გველგესლას ნახავთ, მანძილი დაიცავით და არ აიყვანოთ. ნაკბენზე დარეკეთ 112-ზე. ",
                { type: "hub", id: "snakes", label: "გველების ჰაბი" },
                " და სახეობის პროფილები რჩება ძირითად ჩანაწერად; ",
                { type: "news-index", label: "სიახლეები" },
                " მხოლოდ ამ ნაშრომს უმატებს კონტექსტს.",
              ],
            },
          ],
        },
      ],
    },
    en: {
      title:
        "Adult ‘pontica’ viper recorded in the Borjomi valley — a hybrid, not a new species",
      metaTitle:
        "Adult ‘pontica’ viper recorded in the Borjomi valley — a hybrid, not a new species",
      metaDescription:
        "On 7 May 2025 a viper with mixed Caucasus and nose-horned traits was recorded in the Borjomi valley. A 2026 paper treats Vipera pontica as a rare hybrid, not a third species.",
      dek: "Herpetology Notes reports an adult viper from the Borjomi valley with intermediate characters. The authors treat it as a rare hybrid, not a separate species.",
      lead: "On 7 May 2025, in the Borjomi valley on the upper Mtkvari (Kura), observers recorded an adult viper that combined characters of Caucasus viper and nose-horned viper. The account was published in Herpetology Notes on 10 June 2026. The authors call it the first documented adult resembling the old name Vipera pontica, and the first such record from Georgia. They do not treat it as a species of its own. Reptiles.ge did not see the snake; this page follows their paper.",
      sections: [
        {
          heading: "What happened?",
          blocks: [
            {
              type: "p",
              parts: [
                "The observation was at 10:45 on 7 May, in the Borjomi valley in ",
                {
                  type: "region",
                  id: "samtskhe-javakheti",
                  label: "Samtskhe — Javakheti",
                },
                ". The authors place the site in the upper Kura valley, above 800 m. That morning they had already found five adult ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "nose-horned vipers",
                },
                " at the same place. The presumed hybrid was first basking at a forest edge, then again close to a nose-horned viper.",
              ],
            },
            FIGURE_HABITAT,
            {
              type: "p",
              parts: [
                "They describe the animal as a possible adult male. Snout–vent length was 447 mm, tail 61 mm, total 508 mm. No specimen was collected; identification rests on field notes and photographs. The paper has no DNA from this individual.",
              ],
            },
          ],
        },
        {
          heading: "What is Vipera pontica?",
          blocks: [
            {
              type: "p",
              parts: [
                "The name ",
                { type: "sci", name: "Vipera pontica" },
                " was given in 1990 to two juveniles from the Çoruh valley in Artvin, northeastern Türkiye. The taxon has been disputed ever since. Genomic studies cited in this paper treat those snakes as rare hybrids between ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "Caucasus viper",
                },
                " (",
                { type: "sci", name: "Vipera kaznakovi" },
                ") and nose-horned viper (",
                { type: "sci", name: "Vipera ammodytes transcaucasiana" },
                ") — not as a separate lineage.",
              ],
            },
            FIGURE_MAP,
            {
              type: "p",
              parts: [
                "The Borjomi record extends this putative hybrid form about 150 km east of the type locality. An unusual specimen from Gori was described in 1983; the authors leave its status uncertain and do not rest this observation on it.",
              ],
            },
          ],
        },
        {
          heading: "What characters did it show?",
          blocks: [
            {
              type: "p",
              parts: [
                "The snake had an upturned but hornless snout, fragmented head scalation, intermediate ventral and subcaudal counts, a mixed dorsal zigzag, and a bicoloured tail tip. The authors call this a combination of diagnostic traits from both parental species.",
              ],
            },
            FIGURE_COMPARE,
            {
              type: "p",
              parts: [
                "They argue that such a coordinated mix is not explained by a single anomaly or by local variation, and that it fits an F1 hybrid. A later backcross is not excluded without genetic data. They consider involvement of ",
                { type: "sci", name: "Vipera berus barani" },
                " unlikely: the species is not known from Georgia.",
              ],
            },
          ],
        },
        {
          heading: "What does this mean for the atlas?",
          blocks: [
            {
              type: "p",
              parts: [
                "This is not a third viper species. The paper leaves ",
                { type: "sci", name: "V. pontica" },
                " in the synonymy of both parents. On this atlas Georgian nose-horned vipers are ",
                { type: "sci", name: "Vipera ammodytes" },
                ", subspecies transcaucasiana; the type locality is Borjomi. The 2026 ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "checklist",
                },
                " takes the same line.",
              ],
            },
            {
              type: "p",
              parts: [
                "The authors describe a narrow contact zone in the Borjomi valley: ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "Caucasus viper",
                },
                " in moister meadow and forest-edge habitat, nose-horned viper on rocky slopes. Where those microhabitats meet, rare hybridisation can occur. Both parents are venomous. This page does not assign a separate risk to the hybrid. If you meet a viper, keep your distance and do not pick it up. For a bite, call 112. The ",
                { type: "hub", id: "snakes", label: "snakes hub" },
                " and the species profiles remain the main record; ",
                { type: "news-index", label: "news" },
                " only adds this paper’s context.",
              ],
            },
          ],
        },
      ],
    },
    ru: {
      title:
        "В Боржомском ущелье зафиксировали взрослую «понтийскую гадюку» — это гибрид, не новый вид",
      metaTitle:
        "В Боржомском ущелье зафиксировали взрослую «понтийскую гадюку» — это гибрид, не новый вид",
      metaDescription:
        "7 мая 2025 года в Боржомском ущелье зафиксировали взрослую гадюку с промежуточными признаками кавказской и носатой. Статья 2026 года не считает Vipera pontica отдельным видом.",
      dek: "Herpetology Notes описывает взрослую гадюку из Боржомского ущелья с промежуточными признаками. Авторы считают её редким гибридом, а не третьим видом.",
      lead: "7 мая 2025 года в Боржомском ущелье, в верховьях Мтквари (Куры), наблюдали взрослую гадюку с признаками и кавказской, и носатой гадюки. Сообщение вышло в Herpetology Notes 10 июня 2026 года. Авторы называют это первой документированной взрослой особью, похожей на старое имя Vipera pontica, и первой такой записью из Грузии. Отдельным видом они её не считают. Reptiles.ge змею не видел; здесь пересказан только этот труд.",
      sections: [
        {
          heading: "Что произошло?",
          blocks: [
            {
              type: "p",
              parts: [
                "Наблюдение было 7 мая в 10:45, в Боржомском ущелье в ",
                {
                  type: "region",
                  id: "samtskhe-javakheti",
                  label: "Самцхе — Джавахети",
                },
                ". Авторы относят точку к долине верхнего течения Куры, выше 800 м. Тем же утром на том же месте нашли пять взрослых ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "носатых гадюк",
                },
                ". Предполагаемый гибрид сначала грелся на опушке, затем — рядом с носатой гадюкой.",
              ],
            },
            FIGURE_HABITAT,
            {
              type: "p",
              parts: [
                "В статье животное описано как возможный взрослый самец. Длина от морды до клоаки — 447 мм, хвост — 61 мм, всего — 508 мм. Экземпляр не изымали: определение по полевым заметкам и фотографиям. ДНК этой особи в работе нет.",
              ],
            },
          ],
        },
        {
          heading: "Что такое Vipera pontica?",
          blocks: [
            {
              type: "p",
              parts: [
                "Имя ",
                { type: "sci", name: "Vipera pontica" },
                " дали в 1990 году двум молодым экземплярам из долины Чороха в Артвине, северо-восточная Турция. Таксон с тех пор оспаривали. Геномные работы, на которые опирается эта статья, считают этих змей редкими гибридами ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "кавказской гадюки",
                },
                " (",
                { type: "sci", name: "Vipera kaznakovi" },
                ") и носатой гадюки (",
                { type: "sci", name: "Vipera ammodytes transcaucasiana" },
                "), а не отдельной линией.",
              ],
            },
            FIGURE_MAP,
            {
              type: "p",
              parts: [
                "Боржомская запись отодвигает эту предполагаемую гибридную форму примерно на 150 км к востоку от типового местонахождения. Необычный экземпляр из Гори описан в 1983 году; авторы оставляют его статус неясным и на нём это наблюдение не строят.",
              ],
            },
          ],
        },
        {
          heading: "Какие признаки были у змеи?",
          blocks: [
            {
              type: "p",
              parts: [
                "У змеи была загнутая, но безрогая морда, фрагментированная чешуя головы, промежуточное число брюшных и подхвостовых щитков, смешанный спинной зигзаг и двуцветный кончик хвоста. Авторы называют это сочетанием диагностических признаков обоих родительских видов.",
              ],
            },
            FIGURE_COMPARE,
            {
              type: "p",
              parts: [
                "Они пишут, что такая согласованная смесь не объясняется одной аномалией или местной изменчивостью и согласуется с гибридом F1. Поздний возвратный гибрид без генетики не исключён. Участие ",
                { type: "sci", name: "Vipera berus barani" },
                " они считают маловероятным: вид в Грузии не известен.",
              ],
            },
          ],
        },
        {
          heading: "Что это значит для атласа?",
          blocks: [
            {
              type: "p",
              parts: [
                "Это не третий вид гадюки. Статья оставляет ",
                { type: "sci", name: "V. pontica" },
                " в синонимии обоих родителей. В этом атласе грузинская носатая гадюка — ",
                { type: "sci", name: "Vipera ammodytes" },
                ", подвид transcaucasiana; типовое место — Боржоми. Та же линия в ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "чеклисте",
                },
                " 2026 года.",
              ],
            },
            {
              type: "p",
              parts: [
                "Авторы описывают узкую зону контакта в Боржомском ущелье: ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "кавказская гадюка",
                },
                " во влажном лугово-лесном крае, носатая — на каменистых склонах. Где эти микроместообитания сходятся, редкая гибридизация возможна. Оба родителя ядовиты. Отдельный риск гибрида здесь не измерен. Если встретите гадюку, держите дистанцию и не берите. При укусе звоните 112. ",
                { type: "hub", id: "snakes", label: "Страница змей" },
                " и профили видов остаются основной записью; ",
                { type: "news-index", label: "новости" },
                " лишь добавляют контекст этой статьи.",
              ],
            },
          ],
        },
      ],
    },
    tr: {
      title:
        "Borjomi vadisinde erişkin ‘pontica’ engereği kaydedildi — yeni tür değil, hibrit",
      metaTitle:
        "Borjomi vadisinde erişkin ‘pontica’ engereği kaydedildi — yeni tür değil, hibrit",
      metaDescription:
        "7 Mayıs 2025’te Borjomi vadisinde Kafkas ve boynuzlu engerek karakterlerini karıştıran bir engerek kaydedildi. 2026 makalesi Vipera pontica’yı ayrı tür saymaz.",
      dek: "Herpetology Notes, Borjomi vadisinden ara karakterli erişkin bir engerek bildiriyor. Yazarlar bunu ayrı tür değil, nadir hibrit sayıyor.",
      lead: "7 Mayıs 2025’te Borjomi vadisinde, Mtkvari’nin (Kura) yukarı çığırında, hem Kafkas engereği hem boynuzlu engerek karakterleri taşıyan erişkin bir engerek kaydedildi. Yazı 10 Haziran 2026’da Herpetology Notes’ta çıktı. Yazarlar bunu eski ad Vipera pontica’ya benzeyen ilk belgelenmiş erişkin ve Gürcistan’dan ilk böyle kayıt sayıyor. Ayrı bir tür kabul etmiyorlar. Reptiles.ge yılanı görmedi; bu sayfa onların makalesini izler.",
      sections: [
        {
          heading: "Ne oldu?",
          blocks: [
            {
              type: "p",
              parts: [
                "Gözlem 7 Mayıs’ta 10:45’te, ",
                {
                  type: "region",
                  id: "samtskhe-javakheti",
                  label: "Samtshe — Cavaheti",
                },
                " içindeki Borjomi vadisindeydi. Yazarlar yeri yukarı Kura vadisine, 800 m’nin üzerine koyuyor. Aynı sabah aynı yerde beş erişkin ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "boynuzlu engerek",
                },
                " bulunmuştu. Olası hibrit önce orman kenarında ısınıyordu, sonra bir boynuzlu engereğin yanında.",
              ],
            },
            FIGURE_HABITAT,
            {
              type: "p",
              parts: [
                "Makalede hayvan olası erişkin erkek olarak anlatılıyor. Burun–kloak 447 mm, kuyruk 61 mm, toplam 508 mm. Örnek alınmadı; teşhis saha notları ve fotoğraflara dayanıyor. Bu bireyin DNA’sı makalede yok.",
              ],
            },
          ],
        },
        {
          heading: "Vipera pontica nedir?",
          blocks: [
            {
              type: "p",
              parts: [
                { type: "sci", name: "Vipera pontica" },
                " adı 1990’da kuzeydoğu Türkiye’de, Artvin’deki Çoruh vadisinden iki yavruya verildi. Takson o zamandan beri tartışmalıdır. Bu makalenin dayandığı genom çalışmaları bu yılanları ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "Kafkas engereği",
                },
                " (",
                { type: "sci", name: "Vipera kaznakovi" },
                ") ile boynuzlu engerek (",
                { type: "sci", name: "Vipera ammodytes transcaucasiana" },
                ") arasında nadir hibrit sayar — ayrı bir soy değil.",
              ],
            },
            FIGURE_MAP,
            {
              type: "p",
              parts: [
                "Borjomi kaydı bu olası hibrit formu tip lokalitesinin yaklaşık 150 km doğusuna uzatır. 1983’te Gori’den alışılmadık bir örnek tanımlanmıştır; yazarlar durumunu belirsiz bırakır ve bu gözlemi ona dayandırmaz.",
              ],
            },
          ],
        },
        {
          heading: "Hangi karakterler vardı?",
          blocks: [
            {
              type: "p",
              parts: [
                "Yılanın kalkık ama boynuzsuz burnu, parçalı baş pulları, ara karın ve kuyruk altı pul sayıları, karışık sırt zikzağı ve iki renkli kuyruk ucu vardı. Yazarlar bunu her iki ebeveyn türün tanı karakterlerinin birleşimi sayar.",
              ],
            },
            FIGURE_COMPARE,
            {
              type: "p",
              parts: [
                "Böyle eşgüdümlü bir karışımın tek bir anomali veya yerel varyasyonla açıklanamayacağını, F1 hibrite uyduğunu yazıyorlar. Genetik veri olmadan sonraki geri melez dışlanmaz. ",
                { type: "sci", name: "Vipera berus barani" },
                " katılımını olası görmüyorlar: tür Gürcistan’dan bilinmez.",
              ],
            },
          ],
        },
        {
          heading: "Bu atlas için ne anlama geliyor?",
          blocks: [
            {
              type: "p",
              parts: [
                "Bu üçüncü bir engerek türü değildir. Makale ",
                { type: "sci", name: "V. pontica" },
                " adını her iki ebeveynin sinoniminde bırakır. Bu atlas’ta Gürcistan’daki boynuzlu engerek ",
                { type: "sci", name: "Vipera ammodytes" },
                ", alttür transcaucasiana’dır; tip lokalitesi Borjomi’dir. 2026 ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "kontrol listesi",
                },
                " aynı çizgiyi izler.",
              ],
            },
            {
              type: "p",
              parts: [
                "Yazarlar Borjomi vadisinde dar bir temas kuşağı anlatır: nemli çayır ve orman kenarında ",
                {
                  type: "species",
                  id: "vipera-kaznakovi",
                  label: "Kafkas engereği",
                },
                ", kayalık yamaçlarda boynuzlu engerek. Bu mikrohabitatlar kesişince nadir melezleme olabilir. Her iki ebeveyn zehirlidir. Hibritin ayrı riski burada ölçülmedi. Engerek görürseniz mesafe koyun, ellemeyin. Isırıkta 112’yi arayın. ",
                { type: "hub", id: "snakes", label: "Yılanlar sayfası" },
                " ve tür profilleri asıl kayıttır; ",
                { type: "news-index", label: "haberler" },
                " yalnızca bu makalenin bağlamını ekler.",
              ],
            },
          ],
        },
      ],
    },
  },
};
