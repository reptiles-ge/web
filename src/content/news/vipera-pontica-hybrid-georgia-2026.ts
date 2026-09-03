import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL =
  "https://herpetologynotes.org/index.php/hn/article/view/341";
const PAPER_PDF_URL =
  "https://herpetologynotes.org/index.php/hn/article/download/341/202";
const CHECKLIST_URL = "https://doi.org/10.3897/caucasiana.5.e189214";

const PHOTO_DIR = "/images/news/vipera-pontica-hybrid-georgia-2026";

const PHOTO_HYBRID: NewsPhoto = {
  alt: {
    en: "Putative hybrid viper in the Borjomi valley, 7 May 2025. Herpetology Notes, CC BY-NC 4.0.",
    ka: "სავარაუდო ჰიბრიდი გველგესლა ბორჯომის ხეობაში, 2025 წლის 7 მაისი. Herpetology Notes, CC BY-NC 4.0.",
    ru: "Предполагаемый гибрид гадюки в Боржомском ущелье, 7 мая 2025. Herpetology Notes, CC BY-NC 4.0.",
    tr: "Borjomi vadisinde olası hibrit engerek, 7 Mayıs 2025. Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    date: "2025-05-07",
    location: "ბორჯომის ხეობა",
    photographer: "Bas Raaijmakers, Sten Gijbels",
    url: PAPER_URL,
  },
  plate: true,
  src: `${PHOTO_DIR}/figure-3.jpg`,
};

const PHOTO_HABITAT: NewsPhoto = {
  alt: {
    en: "Habitats of Caucasus viper (A) and nose-horned viper (B) in the Borjomi valley. Not the exact hybrid site. Herpetology Notes, CC BY-NC 4.0.",
    ka: "კავკასიური გველგესლას (A) და ცხვირრქოსანი გველგესლას (B) ჰაბიტატი ბორჯომის ხეობაში. ეს ზუსტად ჰიბრიდის ადგილი არ არის. Herpetology Notes, CC BY-NC 4.0.",
    ru: "Местообитания кавказской (A) и носатой (B) гадюк в Боржомском ущелье. Это не точная точка гибрида. Herpetology Notes, CC BY-NC 4.0.",
    tr: "Borjomi vadisinde Kafkas engereği (A) ve boynuzlu engerek (B) habitatı. Hibritin tam yeri değil. Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    location: "ბორჯომის ხეობა",
    photographer: "Bas Raaijmakers, Sten Gijbels",
    url: PAPER_URL,
  },
  plate: true,
  src: `${PHOTO_DIR}/figure-2.jpg`,
};

const PHOTO_MAP: NewsPhoto = {
  alt: {
    en: "The paper’s approximate ranges and the 2025 observation site. Herpetology Notes, CC BY-NC 4.0.",
    ka: "ნაშრომის სავარაუდო არეალები და 2025 წლის დაკვირვების ადგილი. Herpetology Notes, CC BY-NC 4.0.",
    ru: "Приблизительные ареалы из статьи и место наблюдения 2025 года. Herpetology Notes, CC BY-NC 4.0.",
    tr: "Makalenin yaklaşık yayılışları ve 2025 gözlem yeri. Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    location: "ბორჯომის ხეობა",
    photographer: "Bas van Blitterswijk",
    url: PAPER_URL,
  },
  plate: true,
  src: `${PHOTO_DIR}/figure-1.jpg`,
};

const PHOTO_COMPARE: NewsPhoto = {
  alt: {
    en: "Borjomi valley: Caucasus viper (A–C), putative hybrid (D–F), nose-horned viper (G–I). Herpetology Notes, CC BY-NC 4.0.",
    ka: "ბორჯომის ხეობა: კავკასიური გველგესლა (A–C), სავარაუდო ჰიბრიდი (D–F), ცხვირრქოსანი გველგესლა (G–I). Herpetology Notes, CC BY-NC 4.0.",
    ru: "Боржомское ущелье: кавказская гадюка (A–C), предполагаемый гибрид (D–F), носатая гадюка (G–I). Herpetology Notes, CC BY-NC 4.0.",
    tr: "Borjomi vadisi: Kafkas engereği (A–C), olası hibrit (D–F), boynuzlu engerek (G–I). Herpetology Notes, CC BY-NC 4.0.",
  },
  credit: {
    location: "ბორჯომის ხეობა",
    photographer: "Sten Gijbels, Bas Raaijmakers",
    url: PAPER_URL,
  },
  plate: true,
  src: `${PHOTO_DIR}/figure-4.jpg`,
};

const FIGURE_HABITAT = {
  src: PHOTO_HABITAT.src,
  type: "figure" as const,
};
const FIGURE_MAP = {
  src: PHOTO_MAP.src,
  type: "figure" as const,
};
const FIGURE_COMPARE = {
  src: PHOTO_COMPARE.src,
  type: "figure" as const,
};

export const VIPERA_PONTICA_HYBRID_GEORGIA_2026: NewsArticle = {
  copy: {
    en: {
      dek: "Herpetology Notes describes an adult viper found in the Borjomi valley with intermediate characters. The authors assess it as a hybrid, not a new, third viper species in Georgia.",
      lead: "On 7 May 2025, in the Borjomi valley on the upper Mtkvari (Kura), observers recorded an adult viper that combined characters of Caucasus viper and nose-horned viper. The account was published in Herpetology Notes on 10 June 2026. The authors call it the first documented adult resembling the old name Vipera pontica, and the first such record from Georgia. They do not treat it as a species of its own. Reptiles.ge did not see the snake; this page follows their paper.",
      metaDescription:
        "This is not a third viper species: a Borjomi valley adult showed mixed Caucasus and nose-horned traits. A 2026 paper treats Vipera pontica as a hybrid.",
      metaTitle: "A rare viper hybrid recorded in the Borjomi valley",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The observation was at 10:45 on 7 May, in the Borjomi valley in ",
                {
                  id: "samtskhe-javakheti",
                  label: "Samtskhe — Javakheti",
                  type: "region",
                },
                ". The authors place the site in the upper Kura valley, above 800 m. That morning they had already found five adult ",
                {
                  id: "vipera-transcaucasiana",
                  label: "nose-horned vipers",
                  type: "species",
                },
                " at the same place. The presumed hybrid was first basking at a forest edge, then again close to a nose-horned viper.",
              ],
              type: "p",
            },
            FIGURE_HABITAT,
            {
              parts: [
                "They describe the animal as a possible adult male. Snout–vent length was 447 mm, tail 61 mm, total 508 mm. No specimen was collected; identification rests on field notes and photographs. The paper has no DNA from this individual.",
              ],
              type: "p",
            },
          ],
          heading: "What happened?",
        },
        {
          blocks: [
            {
              parts: [
                "The name ",
                { name: "Vipera pontica", type: "sci" },
                " was given in 1990 to two juveniles from the Çoruh valley in Artvin, northeastern Türkiye. The taxon has been disputed ever since. Genomic studies cited in this paper treat those snakes as rare hybrids between ",
                {
                  id: "vipera-kaznakovi",
                  label: "Caucasus viper",
                  type: "species",
                },
                " (",
                { name: "Vipera kaznakovi", type: "sci" },
                ") and nose-horned viper (",
                { name: "Vipera ammodytes transcaucasiana", type: "sci" },
                ") — not as a separate lineage.",
              ],
              type: "p",
            },
            FIGURE_MAP,
            {
              parts: [
                "The Borjomi record extends this putative hybrid form about 150 km east of the type locality. An unusual specimen from Gori was described in 1983; the authors leave its status uncertain and do not rest this observation on it.",
              ],
              type: "p",
            },
          ],
          heading: "What is Vipera pontica?",
        },
        {
          blocks: [
            {
              parts: [
                "The snake had an upturned but hornless snout, fragmented head scalation, intermediate ventral and subcaudal counts, a mixed dorsal zigzag, and a bicoloured tail tip. The authors call this a combination of diagnostic traits from both parental species.",
              ],
              type: "p",
            },
            FIGURE_COMPARE,
            {
              parts: [
                "They argue that such a coordinated mix is not explained by a single anomaly or by local variation, and that it fits an F1 hybrid. A later backcross is not excluded without genetic data. They consider involvement of ",
                { name: "Vipera berus barani", type: "sci" },
                " unlikely: the species is not known from Georgia.",
              ],
              type: "p",
            },
          ],
          heading: "What characters did it show?",
        },
        {
          blocks: [
            {
              parts: [
                "This is not a third viper species. The paper leaves ",
                { name: "V. pontica", type: "sci" },
                " in the synonymy of both parents. On this atlas Georgian nose-horned vipers are ",
                { name: "Vipera ammodytes", type: "sci" },
                ", subspecies transcaucasiana; the type locality is Borjomi. The 2026 ",
                {
                  href: CHECKLIST_URL,
                  label: "checklist",
                  type: "external",
                },
                " takes the same line.",
              ],
              type: "p",
            },
            {
              parts: [
                "The authors describe a narrow contact zone in the Borjomi valley: ",
                {
                  id: "vipera-kaznakovi",
                  label: "Caucasus viper",
                  type: "species",
                },
                " in moister meadow and forest-edge habitat, nose-horned viper on rocky slopes. Where those microhabitats meet, rare hybridisation can occur. Both parents are venomous. This page does not assign a separate risk to the hybrid. If you meet a viper, keep your distance and do not pick it up. For a bite, call 112. The ",
                { id: "snakes", label: "snakes hub", type: "hub" },
                " and the species profiles remain the main record; ",
                { label: "news", type: "news-index" },
                " only adds this paper’s context.",
              ],
              type: "p",
            },
          ],
          heading: "What does this mean for the atlas?",
        },
      ],
      title: "A rare viper hybrid recorded in the Borjomi valley",
    },
    ka: {
      dek: "Herpetology Notes-ში აღწერილია ბორჯომის ხეობაში აღმოჩენილი ზრდასრული გველგესლა შუალედური ნიშნებით. ავტორების შეფასებით, ეს ჰიბრიდია და არა საქართველოს გველგესლების ახალი, მესამე სახეობა.",
      lead: "2025 წლის 7 მაისს ბორჯომის ხეობაში, მტკვრის ზემო დინებაში, დააფიქსირეს ზრდასრული გველგესლა, რომელსაც კავკასიური გველგესლასა და ცხვირრქოსანი გველგესლას ნიშნები ერთდროულად ჰქონდა. დაკვირვება 2026 წლის 10 ივნისს Herpetology Notes-ში გამოქვეყნდა. ავტორები წერენ, რომ ეს არის პირველი დოკუმენტირებული ზრდასრული ინდივიდი, რომელიც ძველ სახელს Vipera pontica ჰგავს, და პირველი ასეთი ჩანაწერი საქართველოდან. ისინი მას ცალკე სახეობად არ იღებენ. გველი Reptiles.ge-ს არ უნახავს; აქ მხოლოდ ამ ნაშრომია გადმოტანილი.",
      metaDescription:
        "ეს მესამე გველგესლა არ არის: ბორჯომის ხეობაში დააფიქსირეს ზრდასრული ინდივიდი შუალედური ნიშნებით. 2026 წლის ნაშრომი Vipera pontica-ს ჰიბრიდად იღებს.",
      metaTitle: "ბორჯომის ხეობაში გველგესლას იშვიათი ჰიბრიდი დააფიქსირეს",
      sections: [
        {
          blocks: [
            {
              parts: [
                "დაკვირვება 7 მაისს, დილის 10:45-ზე, ",
                {
                  id: "samtskhe-javakheti",
                  label: "სამცხე — ჯავახეთში",
                  type: "region",
                },
                ", ბორჯომის ხეობაში იყო. ავტორები ადგილს მტკვრის ზემო დინების ხეობას უწოდებენ, სიმაღლეს — 800 მ-ზე მეტს. იმავე დილით იქვე ხუთი ზრდასრული ",
                {
                  id: "vipera-transcaucasiana",
                  label: "ცხვირრქოსანი გველგესლა",
                  type: "species",
                },
                " ნახეს. სავარაუდო ჰიბრიდი ჯერ ტყის პირას ათბობდა, შემდეგ კი ცხვირრქოსან გველგესლასთან ახლოს.",
              ],
              type: "p",
            },
            FIGURE_HABITAT,
            {
              parts: [
                "ნაშრომში გველი შესაძლო ზრდასრულ მამალადაა აღწერილი. სხეულის სიგრძე მუწუკიდან კლოაკამდე 447 მმ იყო, კუდი — 61 მმ, სულ — 508 მმ. ეგზემპლარი არ აუღიათ: იდენტიფიკაცია საველე დაკვირვებასა და ფოტოებს ეყრდნობა. ამ ინდივიდის დნმ ნაშრომში არ არის.",
              ],
              type: "p",
            },
          ],
          heading: "რა მოხდა?",
        },
        {
          blocks: [
            {
              parts: [
                "სახელი ",
                { name: "Vipera pontica", type: "sci" },
                " 1990 წელს ორ ახალგაზრდა ნიმუშზე დაარქვეს ჩრდილო-აღმოსავლეთ თურქეთიდან, ართვინის ჩოროხის ხეობიდან. მას შემდეგ ტაქსონი სადავო იყო. ბოლო გენომური კვლევები, რომლებსაც ეს ნაშრომი ეყრდნობა, ამ გველებს ",
                {
                  id: "vipera-kaznakovi",
                  label: "კავკასიურ გველგესლას",
                  type: "species",
                },
                " (",
                { name: "Vipera kaznakovi", type: "sci" },
                ") და ცხვირრქოსან გველგესლას (",
                { name: "Vipera ammodytes transcaucasiana", type: "sci" },
                ") შორის იშვიათ ჰიბრიდად მიიჩნევს — არა დამოუკიდებელ ხაზად.",
              ],
              type: "p",
            },
            FIGURE_MAP,
            {
              parts: [
                "ბორჯომის ჩანაწერი ამ სავარაუდო ჰიბრიდულ ფორმას ტიპის ადგილიდან დაახლოებით 150 კმ-ით აღმოსავლეთით აგრძელებს. 1983 წელს გორიდან უჩვეულო ნიმუშია აღწერილი; ავტორები მის სტატუსს გაურკვევლად ტოვებენ და ამ დაკვირვებას მასზე არ აფუძნებენ.",
              ],
              type: "p",
            },
          ],
          heading: "რა არის Vipera pontica?",
        },
        {
          blocks: [
            {
              parts: [
                "გველს აწეული, მაგრამ ურქო ცხვირი ჰქონდა, დანაწევრებული თავის ქერცლი, შუალედური მუცლისა და ქვეკუდის ფარების რიცხვი, შერეული ზურგის ზიგზაგი და ორფეროვანი კუდის წვერი. ავტორები ამას ორივე მშობელი სახეობის დიაგნოსტიკურ ნიშანთა ნაზავს უწოდებენ.",
              ],
              type: "p",
            },
            FIGURE_COMPARE,
            {
              parts: [
                "ისინი წერენ, რომ ასეთი კოორდინირებული ნაზავი ერთი ანომალიით ან ადგილობრივი ვარიაციით არ აიხსნება და F1 ჰიბრიდს ემთხვევა. უკუჯვარედინი გენეტიკური მონაცემის გარეშე არ არის გამორიცხული. ",
                { name: "Vipera berus barani", type: "sci" },
                "-ის მონაწილეობას ნაკლებად სავარაუდოდ მიიჩნევენ: სახეობა საქართველოში არ არის ცნობილი.",
              ],
              type: "p",
            },
          ],
          heading: "რა ნიშნები ჰქონდა?",
        },
        {
          blocks: [
            {
              parts: [
                "ეს მესამე გველგესლა არ არის. ნაშრომი ",
                { name: "V. pontica", type: "sci" },
                "-ს ორივე მშობლის სინონიმიაში ტოვებს. ამ ატლასში ქართული ცხვირრქოსანი გველგესლა ",
                { name: "Vipera ammodytes", type: "sci" },
                "-ია, ქვესახეობა transcaucasiana; ტიპის ადგილი ბორჯომია. იგივე ხაზი აქვს 2026 წლის ",
                {
                  href: CHECKLIST_URL,
                  label: "ჩამონათვალს",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "ავტორები ბორჯომის ხეობაში ვიწრო კონტაქტის ზონას აღწერენ: ნოტიო, ბალახოვან ადგილას ",
                {
                  id: "vipera-kaznakovi",
                  label: "კავკასიური გველგესლა",
                  type: "species",
                },
                ", კლდოვან ფერდობზე — ცხვირრქოსანი. იქ, სადაც ეს მიკროჰაბიტატები იკვეთება, იშვიათი შეჯვარება შესაძლებელია. შხამიანია ორივე მშობელი. ჰიბრიდის ცალკე რისკი აქ არ არის გაზომილი. თუ გველგესლას ნახავთ, მანძილი დაიცავით და არ აიყვანოთ. ნაკბენზე დარეკეთ 112-ზე. ",
                { id: "snakes", label: "გველების ჰაბი", type: "hub" },
                " და სახეობის პროფილები რჩება ძირითად ჩანაწერად; ",
                { label: "სიახლეები", type: "news-index" },
                " მხოლოდ ამ ნაშრომს უმატებს კონტექსტს.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს ეს ატლასისთვის?",
        },
      ],
      title: "ბორჯომის ხეობაში გველგესლას იშვიათი ჰიბრიდი დააფიქსირეს",
    },
    ru: {
      dek: "Herpetology Notes описывает найденную в Боржомском ущелье взрослую гадюку с промежуточными признаками. По оценке авторов это гибрид, а не новый, третий вид гадюк Грузии.",
      lead: "7 мая 2025 года в Боржомском ущелье, в верховьях Мтквари (Куры), наблюдали взрослую гадюку с признаками и кавказской, и носатой гадюки. Сообщение вышло в Herpetology Notes 10 июня 2026 года. Авторы называют это первой документированной взрослой особью, похожей на старое имя Vipera pontica, и первой такой записью из Грузии. Отдельным видом они её не считают. Reptiles.ge змею не видел; здесь пересказан только этот труд.",
      metaDescription:
        "Это не третий вид гадюки: в Боржомском ущелье зафиксировали взрослую особь с промежуточными признаками. Статья 2026 года считает Vipera pontica гибридом.",
      metaTitle: "В Боржомском ущелье зафиксировали редкий гибрид гадюки",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Наблюдение было 7 мая в 10:45, в Боржомском ущелье в ",
                {
                  id: "samtskhe-javakheti",
                  label: "Самцхе — Джавахети",
                  type: "region",
                },
                ". Авторы относят точку к долине верхнего течения Куры, выше 800 м. Тем же утром на том же месте нашли пять взрослых ",
                {
                  id: "vipera-transcaucasiana",
                  label: "носатых гадюк",
                  type: "species",
                },
                ". Предполагаемый гибрид сначала грелся на опушке, затем — рядом с носатой гадюкой.",
              ],
              type: "p",
            },
            FIGURE_HABITAT,
            {
              parts: [
                "В статье животное описано как возможный взрослый самец. Длина от морды до клоаки — 447 мм, хвост — 61 мм, всего — 508 мм. Экземпляр не изымали: определение по полевым заметкам и фотографиям. ДНК этой особи в работе нет.",
              ],
              type: "p",
            },
          ],
          heading: "Что произошло?",
        },
        {
          blocks: [
            {
              parts: [
                "Имя ",
                { name: "Vipera pontica", type: "sci" },
                " дали в 1990 году двум молодым экземплярам из долины Чороха в Артвине, северо-восточная Турция. Таксон с тех пор оспаривали. Геномные работы, на которые опирается эта статья, считают этих змей редкими гибридами ",
                {
                  id: "vipera-kaznakovi",
                  label: "кавказской гадюки",
                  type: "species",
                },
                " (",
                { name: "Vipera kaznakovi", type: "sci" },
                ") и носатой гадюки (",
                { name: "Vipera ammodytes transcaucasiana", type: "sci" },
                "), а не отдельной линией.",
              ],
              type: "p",
            },
            FIGURE_MAP,
            {
              parts: [
                "Боржомская запись отодвигает эту предполагаемую гибридную форму примерно на 150 км к востоку от типового местонахождения. Необычный экземпляр из Гори описан в 1983 году; авторы оставляют его статус неясным и на нём это наблюдение не строят.",
              ],
              type: "p",
            },
          ],
          heading: "Что такое Vipera pontica?",
        },
        {
          blocks: [
            {
              parts: [
                "У змеи была загнутая, но безрогая морда, фрагментированная чешуя головы, промежуточное число брюшных и подхвостовых щитков, смешанный спинной зигзаг и двуцветный кончик хвоста. Авторы называют это сочетанием диагностических признаков обоих родительских видов.",
              ],
              type: "p",
            },
            FIGURE_COMPARE,
            {
              parts: [
                "Они пишут, что такая согласованная смесь не объясняется одной аномалией или местной изменчивостью и согласуется с гибридом F1. Поздний возвратный гибрид без генетики не исключён. Участие ",
                { name: "Vipera berus barani", type: "sci" },
                " они считают маловероятным: вид в Грузии не известен.",
              ],
              type: "p",
            },
          ],
          heading: "Какие признаки были у змеи?",
        },
        {
          blocks: [
            {
              parts: [
                "Это не третий вид гадюки. Статья оставляет ",
                { name: "V. pontica", type: "sci" },
                " в синонимии обоих родителей. В этом атласе грузинская носатая гадюка — ",
                { name: "Vipera ammodytes", type: "sci" },
                ", подвид transcaucasiana; типовое место — Боржоми. Та же линия в ",
                {
                  href: CHECKLIST_URL,
                  label: "чеклисте",
                  type: "external",
                },
                " 2026 года.",
              ],
              type: "p",
            },
            {
              parts: [
                "Авторы описывают узкую зону контакта в Боржомском ущелье: ",
                {
                  id: "vipera-kaznakovi",
                  label: "кавказская гадюка",
                  type: "species",
                },
                " во влажном лугово-лесном крае, носатая — на каменистых склонах. Где эти микроместообитания сходятся, редкая гибридизация возможна. Оба родителя ядовиты. Отдельный риск гибрида здесь не измерен. Если встретите гадюку, держите дистанцию и не берите. При укусе звоните 112. ",
                { id: "snakes", label: "Страница змей", type: "hub" },
                " и профили видов остаются основной записью; ",
                { label: "новости", type: "news-index" },
                " лишь добавляют контекст этой статьи.",
              ],
              type: "p",
            },
          ],
          heading: "Что это значит для атласа?",
        },
      ],
      title: "В Боржомском ущелье зафиксировали редкий гибрид гадюки",
    },
    tr: {
      dek: "Herpetology Notes, Borjomi vadisinde bulunan ara karakterli erişkin bir engereği anlatıyor. Yazarların değerlendirmesine göre bu, Gürcistan engereklerinin yeni, üçüncü türü değil, bir hibrittir.",
      lead: "7 Mayıs 2025’te Borjomi vadisinde, Mtkvari’nin (Kura) yukarı çığırında, hem Kafkas engereği hem boynuzlu engerek karakterleri taşıyan erişkin bir engerek kaydedildi. Yazı 10 Haziran 2026’da Herpetology Notes’ta çıktı. Yazarlar bunu eski ad Vipera pontica’ya benzeyen ilk belgelenmiş erişkin ve Gürcistan’dan ilk böyle kayıt sayıyor. Ayrı bir tür kabul etmiyorlar. Reptiles.ge yılanı görmedi; bu sayfa onların makalesini izler.",
      metaDescription:
        "Bu üçüncü bir engerek türü değil: Borjomi vadisinde ara karakterli erişkin bir engerek kaydedildi. 2026 makalesi Vipera pontica’yı hibrit sayar.",
      metaTitle: "Borjomi vadisinde nadir bir engerek hibriti kaydedildi",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Gözlem 7 Mayıs’ta 10:45’te, ",
                {
                  id: "samtskhe-javakheti",
                  label: "Samtshe — Cavaheti",
                  type: "region",
                },
                " içindeki Borjomi vadisindeydi. Yazarlar yeri yukarı Kura vadisine, 800 m’nin üzerine koyuyor. Aynı sabah aynı yerde beş erişkin ",
                {
                  id: "vipera-transcaucasiana",
                  label: "boynuzlu engerek",
                  type: "species",
                },
                " bulunmuştu. Olası hibrit önce orman kenarında ısınıyordu, sonra bir boynuzlu engereğin yanında.",
              ],
              type: "p",
            },
            FIGURE_HABITAT,
            {
              parts: [
                "Makalede hayvan olası erişkin erkek olarak anlatılıyor. Burun–kloak 447 mm, kuyruk 61 mm, toplam 508 mm. Örnek alınmadı; teşhis saha notları ve fotoğraflara dayanıyor. Bu bireyin DNA’sı makalede yok.",
              ],
              type: "p",
            },
          ],
          heading: "Ne oldu?",
        },
        {
          blocks: [
            {
              parts: [
                { name: "Vipera pontica", type: "sci" },
                " adı 1990’da kuzeydoğu Türkiye’de, Artvin’deki Çoruh vadisinden iki yavruya verildi. Takson o zamandan beri tartışmalıdır. Bu makalenin dayandığı genom çalışmaları bu yılanları ",
                {
                  id: "vipera-kaznakovi",
                  label: "Kafkas engereği",
                  type: "species",
                },
                " (",
                { name: "Vipera kaznakovi", type: "sci" },
                ") ile boynuzlu engerek (",
                { name: "Vipera ammodytes transcaucasiana", type: "sci" },
                ") arasında nadir hibrit sayar — ayrı bir soy değil.",
              ],
              type: "p",
            },
            FIGURE_MAP,
            {
              parts: [
                "Borjomi kaydı bu olası hibrit formu tip lokalitesinin yaklaşık 150 km doğusuna uzatır. 1983’te Gori’den alışılmadık bir örnek tanımlanmıştır; yazarlar durumunu belirsiz bırakır ve bu gözlemi ona dayandırmaz.",
              ],
              type: "p",
            },
          ],
          heading: "Vipera pontica nedir?",
        },
        {
          blocks: [
            {
              parts: [
                "Yılanın kalkık ama boynuzsuz burnu, parçalı baş pulları, ara karın ve kuyruk altı pul sayıları, karışık sırt zikzağı ve iki renkli kuyruk ucu vardı. Yazarlar bunu her iki ebeveyn türün tanı karakterlerinin birleşimi sayar.",
              ],
              type: "p",
            },
            FIGURE_COMPARE,
            {
              parts: [
                "Böyle eşgüdümlü bir karışımın tek bir anomali veya yerel varyasyonla açıklanamayacağını, F1 hibrite uyduğunu yazıyorlar. Genetik veri olmadan sonraki geri melez dışlanmaz. ",
                { name: "Vipera berus barani", type: "sci" },
                " katılımını olası görmüyorlar: tür Gürcistan’dan bilinmez.",
              ],
              type: "p",
            },
          ],
          heading: "Hangi karakterler vardı?",
        },
        {
          blocks: [
            {
              parts: [
                "Bu üçüncü bir engerek türü değildir. Makale ",
                { name: "V. pontica", type: "sci" },
                " adını her iki ebeveynin sinoniminde bırakır. Bu atlas’ta Gürcistan’daki boynuzlu engerek ",
                { name: "Vipera ammodytes", type: "sci" },
                ", alttür transcaucasiana’dır; tip lokalitesi Borjomi’dir. 2026 ",
                {
                  href: CHECKLIST_URL,
                  label: "kontrol listesi",
                  type: "external",
                },
                " aynı çizgiyi izler.",
              ],
              type: "p",
            },
            {
              parts: [
                "Yazarlar Borjomi vadisinde dar bir temas kuşağı anlatır: nemli çayır ve orman kenarında ",
                {
                  id: "vipera-kaznakovi",
                  label: "Kafkas engereği",
                  type: "species",
                },
                ", kayalık yamaçlarda boynuzlu engerek. Bu mikrohabitatlar kesişince nadir melezleme olabilir. Her iki ebeveyn zehirlidir. Hibritin ayrı riski burada ölçülmedi. Engerek görürseniz mesafe koyun, ellemeyin. Isırıkta 112’yi arayın. ",
                { id: "snakes", label: "Yılanlar sayfası", type: "hub" },
                " ve tür profilleri asıl kayıttır; ",
                { label: "haberler", type: "news-index" },
                " yalnızca bu makalenin bağlamını ekler.",
              ],
              type: "p",
            },
          ],
          heading: "Bu atlas için ne anlama geliyor?",
        },
      ],
      title: "Borjomi vadisinde nadir bir engerek hibriti kaydedildi",
    },
  },
  gallery: [PHOTO_HABITAT, PHOTO_MAP, PHOTO_COMPARE],
  id: "vipera-pontica-hybrid-georgia-2026",
  image: PHOTO_HYBRID,
  publishedAt: "2026-09-01",
  relatedHubIds: ["snakes"],
  relatedRegionIds: ["samtskhe-javakheti"],
  relatedSpeciesIds: ["vipera-kaznakovi", "vipera-transcaucasiana"],
  slug: "vipera-pontica-hybrid-georgia-2026",
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
  status: "published",
  updatedAt: "2026-09-01",
};
