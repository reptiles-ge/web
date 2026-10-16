import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.3897/caucasiana.5.e188959";

const PHOTO_DIR = "/images/news/armenia-power-line-bird-electrocution";
const PAPER_CREDIT = "Harutyunyan et al. 2026";

const PHOTO_POLES: NewsPhoto = {
  alt: {
    en: "Pole types on the surveyed 10 kV lines in Armenia: concrete and wooden intermediate poles (a, b), anchor poles (c, d) and poles with switches (e, f). Caucasiana, CC BY 4.0.",
    ka: "სომხეთში შემოწმებული 10 kV ხაზების ბოძები: ბეტონისა და ხის შუალედური ბოძები (a, b), ანკერული ბოძები (c, d) და ამომრთველიანი ბოძები (e, f). Caucasiana, CC BY 4.0.",
    ru: "Типы опор на обследованных линиях 10 кВ в Армении: бетонные и деревянные промежуточные (a, b), анкерные (c, d) и опоры с разъединителями (e, f). Caucasiana, CC BY 4.0.",
    tr: "Ermenistan’da incelenen 10 kV hatlardaki direk tipleri: beton ve ahşap ara direkler (a, b), gergi direkleri (c, d) ve şalterli direkler (e, f). Caucasiana, CC BY 4.0.",
  },
  credit: {
    location: "Armenia",
    photographer: PAPER_CREDIT,
    url: PAPER_URL,
  },
  height: 1300,
  plate: true,
  src: `${PHOTO_DIR}/figure-2.jpg`,
  width: 1975,
};

const PHOTO_STUDY_AREA: NewsPhoto = {
  alt: {
    en: "Study area and surveyed power lines: Ararat, Armavir and Kotayk provinces (1) and Shirak province (2). Caucasiana, CC BY 4.0.",
    ka: "კვლევის არეალი და შემოწმებული ხაზები: არარატის, არმავირისა და კოტაიკის მარზები (1) და შირაკის მარზი (2). Caucasiana, CC BY 4.0.",
    ru: "Район исследования и обследованные линии: области Арарат, Армавир и Котайк (1) и Ширак (2). Caucasiana, CC BY 4.0.",
    tr: "Çalışma alanı ve incelenen hatlar: Ararat, Armavir ve Kotayk illeri (1) ile Şirak ili (2). Caucasiana, CC BY 4.0.",
  },
  credit: {
    photographer: PAPER_CREDIT,
    url: PAPER_URL,
  },
  height: 924,
  plate: true,
  src: `${PHOTO_DIR}/figure-1.jpg`,
  width: 1974,
};

const PHOTO_SPECIES: NewsPhoto = {
  alt: {
    en: "Number of electrocuted birds by species; species in the Red Book of Armenia are shown in red. Caucasiana, CC BY 4.0.",
    ka: "დენით დაღუპული ფრინველები სახეობების მიხედვით; სომხეთის წითელი წიგნის სახეობები წითლადაა აღნიშნული. Caucasiana, CC BY 4.0.",
    ru: "Число погибших от тока птиц по видам; виды Красной книги Армении выделены красным. Caucasiana, CC BY 4.0.",
    tr: "Elektrik çarpmasıyla ölen kuşların türlere göre sayısı; Ermenistan Kırmızı Kitabı’ndaki türler kırmızıyla gösterildi. Caucasiana, CC BY 4.0.",
  },
  credit: {
    photographer: PAPER_CREDIT,
    url: PAPER_URL,
  },
  height: 1306,
  plate: true,
  src: `${PHOTO_DIR}/figure-3.jpg`,
  width: 1960,
};

const FIGURE_STUDY_AREA = {
  src: PHOTO_STUDY_AREA.src,
  type: "figure" as const,
};
const FIGURE_SPECIES = { src: PHOTO_SPECIES.src, type: "figure" as const };

export const ARMENIA_POWER_LINE_BIRD_ELECTROCUTION: NewsArticle = {
  copy: {
    en: {
      dek: "A pilot survey along about 114 km of medium-voltage lines in Armenia found 252 electrocuted birds. Most were corvids and small to medium-sized raptors; 228 were found in Shirak, next to Georgia, during autumn migration.",
      lead: "In 2024, a team led by Harutyunyan walked about 114 km of 10 kV power lines (2,071 poles) in four provinces of Armenia and found 252 birds killed by electrocution. The paper, published in Caucasiana on 24 June 2026, is the first systematic field survey of the problem in Armenia. The authors stress that 252 is a minimum: carcasses taken by scavengers or missed by the team are not counted.",
      metaDescription:
        "A 2024 pilot survey of 114 km of 10 kV lines in Armenia found 252 electrocuted birds, 228 of them in Shirak during autumn migration. Caucasiana, 2026.",
      metaTitle: "252 birds electrocuted on power lines in Armenia",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Electrocution happens mostly on low- and medium-voltage lines. A bird perching on a pole or taking off can touch two live wires, or a wire and earthed metal, and close the circuit. The risk is highest where poles are the only tall perches in open country.",
              ],
              type: "p",
            },
            {
              parts: [
                "The survey had two parts. From 30 May to 30 July 2024, in the breeding season, two surveyors checked about 60 km of line (1,090 poles) in Armavir, Ararat and Kotayk provinces, mainly near the Khosrov Forest State Reserve. From 12 September to 7 November, during autumn migration, they checked about 54 km (981 poles) in Shirak province. They walked a 40 m belt along each line and recorded every carcass.",
              ],
              type: "p",
            },
            FIGURE_STUDY_AREA,
          ],
          heading: "What was surveyed?",
        },
        {
          blocks: [
            {
              parts: [
                "Of the 252 birds, 228 were found in Shirak in autumn and 24 in the other provinces during the breeding season. The authors note that this gap may reflect both the season and the different landscapes.",
              ],
              type: "p",
            },
            {
              parts: [
                "Fifteen species were identified, with a few more birds named only to genus. The most frequent victims were the ",
                { id: "pica-pica", label: "Eurasian magpie", type: "species" },
                " (49), ",
                {
                  id: "falco-tinnunculus",
                  label: "common kestrel",
                  type: "species",
                },
                " (34), rook (34), western jackdaw (33) and ",
                { id: "buteo-buteo", label: "common buzzard", type: "species" },
                " (31) — together 71.8% of all records. Raptors made up 97 birds (38.5%). Where the age of a raptor could be told, 31 of 34 were young birds.",
              ],
              type: "p",
            },
            FIGURE_SPECIES,
            {
              parts: [
                "Three species from the Red Book of Armenia were among the dead: a juvenile ",
                { id: "aquila-chrysaetos", label: "golden eagle", type: "species" },
                ", a ",
                {
                  id: "bubo-bubo",
                  label: "Eurasian eagle-owl",
                  type: "species",
                },
                " and three lesser kestrels. Only nine carcasses had visible burns, so the authors warn that the lack of burns does not rule out electrocution.",
              ],
              type: "p",
            },
          ],
          heading: "Which birds died?",
        },
        {
          blocks: [
            {
              parts: [
                "The worst hotspot was Lake Arpi National Park in Shirak, where two parallel, uninsulated 10 kV lines run about 20 m apart along the lakeshore through grassland used by raptors and wetland birds. Other clusters lay between Zorakert and Paghakn, from Paghakn to Ardenis, and along the Bavra–Tavshut road. On 18 July 2024, 12 dead birds were found along a single 3.5 km line near Hatsavan in Kotayk.",
              ],
              type: "p",
            },
            {
              parts: [
                "Most birds (94.8%) lay under concrete poles. The authors point out that the survey deliberately favoured concrete-pole lines, so it does not show how risky wooden poles are by comparison. On about 7 km of new line with covered cables in Ararat province, no dead birds were found.",
              ],
              type: "p",
            },
          ],
          heading: "Where is it most dangerous?",
        },
        {
          blocks: [
            {
              parts: [
                "Shirak borders Georgia’s ",
                {
                  id: "samtskhe-javakheti",
                  label: "Samtskhe-Javakheti",
                  type: "region",
                },
                ". The paper does not survey Georgian lines. For the rest of the South Caucasus, the authors found systematic data only from Nakhchivan; for Georgia they cite general raptor research, not a power-line survey.",
              ],
              type: "p",
            },
            {
              parts: [
                "The authors recommend insulating live parts on dangerous concrete poles, fitting perch deterrents and other bird-safe designs, and writing bird-safe standards into energy planning. They give priority to open landscapes with few natural perches, Lake Arpi and the migration corridors of Shirak. More birds are on the ",
                { id: "birds", label: "birds hub", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "What does it mean for Georgia?",
        },
      ],
      title:
        "252 birds electrocuted on power lines in Armenia, most of them in Shirak",
    },
    ka: {
      dek: "სომხეთში საშუალო ძაბვის ხაზების დაახლოებით 114 კმ-ის შემოწმებისას დენით დაღუპული 252 ფრინველი იპოვეს. უმეტესობა ყვავისებრები და მცირე და საშუალო ზომის მტაცებლები იყვნენ; 228 შემთხვევა შირაკზე მოდის, საქართველოს მეზობლად, შემოდგომის მიგრაციისას.",
      lead: "2024 წელს არუთიუნიანის ხელმძღვანელობით მკვლევრებმა სომხეთის ოთხ მარზში 10 kV ხაზების დაახლოებით 114 კმ (2 071 ბოძი) ფეხით შეამოწმეს და დენით დაღუპული 252 ფრინველი იპოვეს. Caucasiana-ში 2026 წლის 24 ივნისს გამოქვეყნებული ნაშრომი ამ პრობლემის პირველი სისტემური საველე კვლევაა სომხეთში. ავტორები ხაზს უსვამენ, რომ 252 მინიმუმია: მტაცებლების მიერ წაღებული ან გამოტოვებული ლეშები არ ჩათვლილა.",
      metaDescription:
        "2024 წელს სომხეთში 10 kV ხაზების 114 კმ-ზე დენით დაღუპული 252 ფრინველი იპოვეს, მათგან 228 შირაკში, შემოდგომის მიგრაციისას. Caucasiana, 2026.",
      metaTitle: "სომხეთში ელექტროხაზებზე 252 ფრინველი დაიღუპა",
      sections: [
        {
          blocks: [
            {
              parts: [
                "დენის დარტყმა ძირითადად დაბალი და საშუალო ძაბვის ხაზებზე ხდება. ბოძზე დამჯდარი ან აფრენისას ფრინველი შეიძლება ერთდროულად ორ სადენს, ან სადენსა და დამიწებულ ლითონს შეეხოს და წრედი შეკრას. რისკი ყველაზე მაღალია ღია ადგილებში, სადაც ბოძი ერთადერთი მაღალი საჯდომია.",
              ],
              type: "p",
            },
            {
              parts: [
                "კვლევა ორი ნაწილისგან შედგებოდა. 2024 წლის 30 მაისიდან 30 ივლისამდე, გამრავლების სეზონში, ორმა მკვლევარმა არმავირის, არარატისა და კოტაიკის მარზებში, ძირითადად ხოსროვის ტყის სახელმწიფო ნაკრძალის მიდამოებში, დაახლოებით 60 კმ ხაზი (1 090 ბოძი) შეამოწმა. 12 სექტემბრიდან 7 ნოემბრამდე, შემოდგომის მიგრაციისას, შირაკის მარზში დაახლოებით 54 კმ (981 ბოძი) მოიარეს. თითოეულ ხაზს 40 მ სიგანის ზოლში მიუყვებოდნენ და ყველა ლეშს აღრიცხავდნენ.",
              ],
              type: "p",
            },
            FIGURE_STUDY_AREA,
          ],
          heading: "რა შეამოწმეს?",
        },
        {
          blocks: [
            {
              parts: [
                "252 ფრინველიდან 228 შირაკში იპოვეს შემოდგომაზე, 24 კი დანარჩენ მარზებში გამრავლების სეზონში. ავტორების თქმით, ეს სხვაობა შეიძლება როგორც სეზონს, ისე განსხვავებულ ლანდშაფტს ასახავდეს.",
              ],
              type: "p",
            },
            {
              parts: [
                "15 სახეობა გაირკვა, რამდენიმე ფრინველი კი მხოლოდ გვარამდე. ყველაზე ხშირად დაიღუპნენ ",
                { id: "pica-pica", label: "კაჭკაჭი", type: "species" },
                " (49), ",
                { id: "falco-tinnunculus", label: "კირკიტა", type: "species" },
                " (34), ჭილყვავი (34), ჭკა (33) და ",
                {
                  id: "buteo-buteo",
                  label: "ჩვეულებრივი კაკაჩა",
                  type: "species",
                },
                " (31) — ერთად ყველა ჩანაწერის 71,8%. მტაცებელი ფრინველი 97 იყო (38,5%). სადაც მტაცებლის ასაკის დადგენა მოხერხდა, 34-დან 31 ახალგაზრდა იყო.",
              ],
              type: "p",
            },
            FIGURE_SPECIES,
            {
              parts: [
                "დაღუპულებს შორის სომხეთის წითელი წიგნის სამი სახეობა იყო: ახალგაზრდა ",
                { id: "aquila-chrysaetos", label: "მთის არწივი", type: "species" },
                ", ",
                { id: "bubo-bubo", label: "ზარნაშო", type: "species" },
                " და სამი მცირე კირკიტა. დამწვრობის კვალი მხოლოდ ცხრა ლეშს ჰქონდა, ამიტომ ავტორები აფრთხილებენ: დამწვრობის არარსებობა დენის დარტყმას არ გამორიცხავს.",
              ],
              type: "p",
            },
          ],
          heading: "რომელი ფრინველები დაიღუპნენ?",
        },
        {
          blocks: [
            {
              parts: [
                "ყველაზე სახიფათო ადგილი შირაკში, არფის ტბის ეროვნული პარკი აღმოჩნდა. იქ ორი პარალელური, არაიზოლირებული 10 kV ხაზი ერთმანეთისგან დაახლოებით 20 მ-ში მიუყვება ტბის სანაპიროს და კვეთს მდელოებს, რომლებსაც მტაცებლები და წყლის ფრინველები იყენებენ. სხვა კონცენტრაციები იყო ზორაკერტსა და ფაღაკნს შორის, ფაღაკნიდან არდენისამდე და ბავრა–თავშუტის გზის გასწვრივ. 2024 წლის 18 ივლისს კოტაიკში, ჰაცავანთან, 3,5 კმ სიგრძის ერთ ხაზზე 12 მკვდარი ფრინველი იპოვეს.",
              ],
              type: "p",
            },
            {
              parts: [
                "ფრინველების უმეტესობა (94,8%) ბეტონის ბოძების ქვეშ იპოვეს. ავტორები მიუთითებენ, რომ კვლევა განზრახ ბეტონის ბოძებიან ხაზებს ანიჭებდა უპირატესობას, ამიტომ ის ვერ აჩვენებს, რამდენად სახიფათოა ხის ბოძები შედარებით. არარატის მარზში იზოლირებული კაბელით აშენებულ დაახლოებით 7 კმ ახალ ხაზზე მკვდარი ფრინველი არ აღმოჩენილა.",
              ],
              type: "p",
            },
          ],
          heading: "სად არის ყველაზე სახიფათო?",
        },
        {
          blocks: [
            {
              parts: [
                "შირაკი საქართველოს ",
                {
                  id: "samtskhe-javakheti",
                  label: "სამცხე-ჯავახეთს",
                  type: "region",
                },
                " ესაზღვრება. ნაშრომი ქართულ ხაზებს არ იკვლევს. სამხრეთ კავკასიის დანარჩენი ნაწილიდან ავტორებმა სისტემური მონაცემები მხოლოდ ნახჭევანზე იპოვეს; საქართველოსთვის ისინი მტაცებელი ფრინველების ზოგად კვლევებს ასახელებენ და არა ელექტროხაზების აღრიცხვას.",
              ],
              type: "p",
            },
            {
              parts: [
                "ავტორები გვირჩევენ სახიფათო ბეტონის ბოძებზე დენის გამტარი ნაწილების იზოლირებას, საჯდომის შემზღუდველებისა და ფრინველისთვის უსაფრთხო სხვა კონსტრუქციების დაყენებას და ასეთი სტანდარტების ენერგეტიკულ დაგეგმვაში ჩადებას. პრიორიტეტად ასახელებენ ღია ლანდშაფტებს, სადაც ბუნებრივი საჯდომი ცოტაა, არფის ტბას და შირაკის მიგრაციულ დერეფნებს. სხვა ფრინველები ",
                { id: "birds", label: "ფრინველების ჰაბზეა", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს ეს საქართველოსთვის?",
        },
      ],
      title: "სომხეთში ელექტროხაზებზე 252 ფრინველი დაიღუპა, უმეტესი შირაკში",
    },
    ru: {
      dek: "При обследовании около 114 км линий среднего напряжения в Армении найдено 252 погибших от тока птицы. Большинство — врановые и мелкие и средние хищные птицы; 228 случаев пришлись на Ширак, соседний с Грузией, во время осенней миграции.",
      lead: "В 2024 году группа под руководством Арутюняна пешком обследовала около 114 км линий 10 кВ (2 071 опору) в четырёх областях Армении и нашла 252 птицы, погибшие от удара током. Статья, опубликованная в Caucasiana 24 июня 2026 года, — первое систематическое полевое исследование этой проблемы в Армении. Авторы подчёркивают, что 252 — это минимум: тушки, унесённые падальщиками или пропущенные, не учтены.",
      metaDescription:
        "В 2024 году на 114 км линий 10 кВ в Армении найдено 252 погибших от тока птицы, из них 228 в Шираке во время осенней миграции. Caucasiana, 2026.",
      metaTitle: "252 птицы погибли на ЛЭП в Армении",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Птицы гибнут от тока в основном на линиях низкого и среднего напряжения. Сидя на опоре или взлетая, птица может одновременно коснуться двух проводов или провода и заземлённого металла и замкнуть цепь. Риск выше всего на открытых местах, где опора — единственная высокая присада.",
              ],
              type: "p",
            },
            {
              parts: [
                "Исследование состояло из двух частей. С 30 мая по 30 июля 2024 года, в сезон размножения, два учётчика обследовали около 60 км линий (1 090 опор) в областях Армавир, Арарат и Котайк, в основном у Хосровского лесного заповедника. С 12 сентября по 7 ноября, во время осенней миграции, — около 54 км (981 опора) в Ширакской области. Они шли вдоль линии полосой шириной 40 м и учитывали каждую тушку.",
              ],
              type: "p",
            },
            FIGURE_STUDY_AREA,
          ],
          heading: "Что обследовали?",
        },
        {
          blocks: [
            {
              parts: [
                "Из 252 птиц 228 найдены осенью в Шираке и 24 — в остальных областях в сезон размножения. По словам авторов, эта разница может отражать как сезон, так и различие ландшафтов.",
              ],
              type: "p",
            },
            {
              parts: [
                "Определено 15 видов, ещё несколько птиц — только до рода. Чаще всего погибали ",
                { id: "pica-pica", label: "сорока", type: "species" },
                " (49), ",
                {
                  id: "falco-tinnunculus",
                  label: "обыкновенная пустельга",
                  type: "species",
                },
                " (34), грач (34), галка (33) и ",
                {
                  id: "buteo-buteo",
                  label: "обыкновенный канюк",
                  type: "species",
                },
                " (31) — вместе 71,8% всех записей. Хищных птиц было 97 (38,5%). Там, где возраст хищника удалось определить, 31 из 34 были молодыми.",
              ],
              type: "p",
            },
            FIGURE_SPECIES,
            {
              parts: [
                "Среди погибших — три вида из Красной книги Армении: молодой ",
                { id: "aquila-chrysaetos", label: "беркут", type: "species" },
                ", ",
                { id: "bubo-bubo", label: "филин", type: "species" },
                " и три степные пустельги. Видимые ожоги были лишь у девяти тушек, поэтому авторы предупреждают: отсутствие ожогов не исключает гибели от тока.",
              ],
              type: "p",
            },
          ],
          heading: "Какие птицы погибли?",
        },
        {
          blocks: [
            {
              parts: [
                "Самым опасным местом оказался национальный парк «Озеро Арпи» в Шираке. Там две параллельные неизолированные линии 10 кВ идут примерно в 20 м друг от друга вдоль берега озера через луга, которые используют хищные и водоплавающие птицы. Другие скопления — между Зоракертом и Пагакном, от Пагакна до Ардениса и вдоль дороги Бавра–Ташут. 18 июля 2024 года в Котайке, у Ацавана, на одной линии длиной 3,5 км нашли 12 мёртвых птиц.",
              ],
              type: "p",
            },
            {
              parts: [
                "Большинство птиц (94,8%) лежали под бетонными опорами. Авторы указывают, что исследование намеренно отдавало предпочтение линиям с бетонными опорами, поэтому оно не показывает, насколько опасны деревянные опоры в сравнении. На примерно 7 км новой линии с изолированным кабелем в Араратской области мёртвых птиц не нашли.",
              ],
              type: "p",
            },
          ],
          heading: "Где опаснее всего?",
        },
        {
          blocks: [
            {
              parts: [
                "Ширак граничит с грузинским краем ",
                {
                  id: "samtskhe-javakheti",
                  label: "Самцхе-Джавахети",
                  type: "region",
                },
                ". Грузинские линии в статье не изучены. Для остальной части Южного Кавказа авторы нашли систематические данные только по Нахичевани; для Грузии они ссылаются на общие исследования хищных птиц, а не на учёт на ЛЭП.",
              ],
              type: "p",
            },
            {
              parts: [
                "Авторы рекомендуют изолировать токоведущие части на опасных бетонных опорах, ставить противоприсадные устройства и другие безопасные для птиц конструкции и закрепить такие стандарты в энергетическом планировании. В приоритете — открытые ландшафты с малым числом естественных присад, озеро Арпи и миграционные коридоры Ширака. Другие птицы — на ",
                { id: "birds", label: "странице птиц", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Что это значит для Грузии?",
        },
      ],
      title: "252 птицы погибли на ЛЭП в Армении, большинство — в Шираке",
    },
    tr: {
      dek: "Ermenistan’da yaklaşık 114 km orta gerilim hattı boyunca yapılan pilot araştırmada elektrik çarpmasıyla ölmüş 252 kuş bulundu. Çoğu kargagiller ile küçük ve orta boy yırtıcılardı; 228’i sonbahar göçünde, Gürcistan’a komşu Şirak’ta bulundu.",
      lead: "2024’te Harutyunyan liderliğindeki ekip, Ermenistan’ın dört ilinde yaklaşık 114 km 10 kV hattı (2.071 direk) yürüyerek taradı ve elektrik çarpmasıyla ölmüş 252 kuş buldu. 24 Haziran 2026’da Caucasiana’da yayımlanan makale, Ermenistan’da bu sorunla ilgili ilk sistematik saha araştırması. Yazarlar 252’nin bir alt sınır olduğunu vurguluyor: leşçillerin götürdüğü ya da gözden kaçan leşler sayılmadı.",
      metaDescription:
        "2024’te Ermenistan’da 114 km’lik 10 kV hatta elektrik çarpmasıyla ölmüş 252 kuş bulundu; 228’i sonbahar göçünde Şirak’ta. Caucasiana, 2026.",
      metaTitle: "Ermenistan’da elektrik hatlarında 252 kuş öldü",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Elektrik çarpması çoğunlukla alçak ve orta gerilim hatlarında olur. Direğe konan ya da havalanan bir kuş aynı anda iki tele veya bir tel ile topraklı metale dokunup devreyi tamamlayabilir. Risk, direğin tek yüksek tünek olduğu açık arazide en yüksektir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Araştırma iki bölümden oluştu. 30 Mayıs–30 Temmuz 2024 arasında, üreme mevsiminde, iki araştırmacı Armavir, Ararat ve Kotayk illerinde, çoğunlukla Hosrov Ormanı Devlet Koruma Alanı çevresinde yaklaşık 60 km hattı (1.090 direk) inceledi. 12 Eylül–7 Kasım arasında, sonbahar göçünde, Şirak ilinde yaklaşık 54 km (981 direk) tarandı. Her hat boyunca 40 m genişliğinde bir şerit yürünerek her leş kaydedildi.",
              ],
              type: "p",
            },
            FIGURE_STUDY_AREA,
          ],
          heading: "Ne incelendi?",
        },
        {
          blocks: [
            {
              parts: [
                "252 kuşun 228’i sonbaharda Şirak’ta, 24’ü ise üreme mevsiminde diğer illerde bulundu. Yazarlara göre bu fark hem mevsimi hem de farklı peyzajları yansıtıyor olabilir.",
              ],
              type: "p",
            },
            {
              parts: [
                "15 tür tanımlandı, birkaç kuş ise yalnızca cins düzeyinde. En sık ölenler ",
                { id: "pica-pica", label: "saksağan", type: "species" },
                " (49), ",
                { id: "falco-tinnunculus", label: "kerkenez", type: "species" },
                " (34), ekin kargası (34), küçük karga (33) ve ",
                { id: "buteo-buteo", label: "şahin", type: "species" },
                " (31) oldu — birlikte tüm kayıtların %71,8’i. Yırtıcı kuş sayısı 97’ydi (%38,5). Yaşı belirlenebilen 34 yırtıcının 31’i gençti.",
              ],
              type: "p",
            },
            FIGURE_SPECIES,
            {
              parts: [
                "Ölenler arasında Ermenistan Kırmızı Kitabı’ndan üç tür vardı: genç bir ",
                { id: "aquila-chrysaetos", label: "kaya kartalı", type: "species" },
                ", bir ",
                { id: "bubo-bubo", label: "puhu", type: "species" },
                " ve üç küçük kerkenez. Yalnızca dokuz leşte görünür yanık vardı; bu yüzden yazarlar, yanık olmamasının elektrik çarpmasını dışlamadığı konusunda uyarıyor.",
              ],
              type: "p",
            },
          ],
          heading: "Hangi kuşlar öldü?",
        },
        {
          blocks: [
            {
              parts: [
                "En tehlikeli nokta Şirak’taki Arpi Gölü Milli Parkı oldu. Orada iki paralel, yalıtımsız 10 kV hat göl kıyısı boyunca yaklaşık 20 m arayla, yırtıcıların ve su kuşlarının kullandığı çayırlardan geçiyor. Diğer yoğunlaşmalar Zorakert ile Pağakn arasında, Pağakn’dan Ardenis’e ve Bavra–Taşut yolu boyuncaydı. 18 Temmuz 2024’te Kotayk’ta Hatsavan yakınındaki 3,5 km’lik tek bir hatta 12 ölü kuş bulundu.",
              ],
              type: "p",
            },
            {
              parts: [
                "Kuşların çoğu (%94,8) beton direklerin altındaydı. Yazarlar, araştırmanın bilerek beton direkli hatlara öncelik verdiğini, bu yüzden ahşap direklerin göreli riskini göstermediğini belirtiyor. Ararat ilinde yalıtımlı kabloyla yapılmış yaklaşık 7 km’lik yeni hatta ölü kuş bulunmadı.",
              ],
              type: "p",
            },
          ],
          heading: "En tehlikeli yerler neresi?",
        },
        {
          blocks: [
            {
              parts: [
                "Şirak, Gürcistan’ın ",
                {
                  id: "samtskhe-javakheti",
                  label: "Samtshe-Cavaheti",
                  type: "region",
                },
                " bölgesiyle sınır komşusu. Makale Gürcistan’daki hatları incelemiyor. Güney Kafkasya’nın geri kalanı için yazarlar yalnızca Nahçıvan’dan sistematik veri buldu; Gürcistan için ise elektrik hattı sayımı değil, genel yırtıcı kuş araştırmalarına atıf yapıyorlar.",
              ],
              type: "p",
            },
            {
              parts: [
                "Yazarlar, tehlikeli beton direklerde akım taşıyan parçaların yalıtılmasını, tünemeyi engelleyen düzenekler ve kuş dostu başka tasarımlar kullanılmasını, bu standartların enerji planlamasına eklenmesini öneriyor. Öncelik, doğal tüneğin az olduğu açık peyzajlar, Arpi Gölü ve Şirak’ın göç koridorları. Diğer kuşlar ",
                { id: "birds", label: "kuşlar sayfasında", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Gürcistan için ne anlama geliyor?",
        },
      ],
      title:
        "Ermenistan’da elektrik hatlarında 252 kuş öldü, çoğu Şirak’ta",
    },
  },
  gallery: [PHOTO_STUDY_AREA, PHOTO_SPECIES],
  id: "armenia-power-line-bird-electrocution",
  image: PHOTO_POLES,
  publishedAt: "2026-10-16",
  relatedHubIds: ["birds"],
  relatedRegionIds: [],
  relatedSpeciesIds: [
    "pica-pica",
    "falco-tinnunculus",
    "buteo-buteo",
    "aquila-chrysaetos",
    "bubo-bubo",
  ],
  slug: "armenia-power-line-bird-electrocution",
  sources: [
    {
      name: "Harutyunyan et al. 2026 — Avian mortality associated with medium-voltage distribution lines in Armenia (Caucasiana)",
      url: PAPER_URL,
    },
    {
      name: "Harutyunyan et al. 2026 — Article page",
      url: "https://caucasiana.pensoft.net/article/188959/",
    },
  ],
  status: "published",
};
