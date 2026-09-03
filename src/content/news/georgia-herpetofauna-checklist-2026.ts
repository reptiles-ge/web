import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.3897/caucasiana.5.e189214";
const PAPER_PDF_URL =
  "https://caucasiana.pensoft.net/article/189214/download/pdf/";
const CABOL_URL = "https://ggbc.eu/";

const PHOTO_SALAMANDER: NewsPhoto = {
  alt: {
    en: "Caucasian salamander. Photograph from the atlas.",
    ka: "კავკასიური სალამანდრა. ატლასის ფოტო.",
    ru: "Кавказская саламандра. Фото из атласа.",
    tr: "Kafkas semenderi. Atlas fotoğrafı.",
  },
  credit: {
    date: "2019-02-17",
    photographer: "Armen Seropian",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/mertensiella-caucasica-armen-3.jpg",
};

const PHOTO_LIZARD: NewsPhoto = {
  alt: {
    en: "Derjugin’s lizard. Photograph from the atlas.",
    ka: "ართვინის ხვლიკი. ატლასის ფოტო.",
    ru: "Ящерица Дерюгина. Фото из атласа.",
    tr: "Derjugin kertenkelesi. Atlas fotoğrafı.",
  },
  credit: {
    date: "2015-05-26",
    location: "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    photographer: "ზაური ხაჩიძე",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/darevskia-derjugini-zauri-1.jpg",
};

const PHOTO_TORTOISE: NewsPhoto = {
  alt: {
    en: "Mediterranean tortoise. Photograph from the atlas.",
    ka: "ხმელთაშუაზღვეთის კუ. ატლასის ფოტო.",
    ru: "Средиземноморская черепаха. Фото из атласа.",
    tr: "Akdeniz tosbağası. Atlas fotoğrafı.",
  },
  credit: {
    photographer: "Cuora",
    url: "https://www.inaturalist.org/observations/96663399",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/testudo-graeca-3.jpg",
};

const PHOTO_SLIDER: NewsPhoto = {
  alt: {
    en: "Pond slider. Photograph from the atlas.",
    ka: "წითელყურა კუ. ატლასის ფოტო.",
    ru: "Красноухая черепаха. Фото из атласа.",
    tr: "Kırmızı yanaklı su kaplumbağası. Atlas fotoğrafı.",
  },
  credit: {
    photographer: "Nelson Wisnik",
    url: "https://www.inaturalist.org/observations/18808638",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/trachemys-scripta.jpg",
};

const FIGURE_LIZARD = {
  src: PHOTO_LIZARD.src,
  type: "figure" as const,
};
const FIGURE_TORTOISE = {
  src: PHOTO_TORTOISE.src,
  type: "figure" as const,
};
const FIGURE_SLIDER = {
  src: PHOTO_SLIDER.src,
  type: "figure" as const,
};

export const GEORGIA_HERPETOFAUNA_CHECKLIST_2026: NewsArticle = {
  copy: {
    en: {
      dek: "The paper divides species recorded in Georgia into confirmed and candidate taxa — this is not a list of new discoveries.",
      lead: "On 8 July 2026, Caucasiana published an annotated checklist of the amphibians and reptiles of Georgia. The authors are David Tarkhnishvili, Giorgi Iankoshvili, Armen Seropian, Nino Kachlishvili and Mariami Todua, at Ilia State University and the Caucasus Leibniz Biodiversity Research Center. The paper treats 12 amphibian and 56 reptile species as recorded from Georgia. That list is the backbone of this atlas’s herpetofauna layer.",
      metaDescription:
        "A 2026 Ilia State University checklist treats Georgia’s herpetofauna as 12 amphibians and 56 reptiles. Candidate species are not confirmed.",
      metaTitle:
        "Georgia has 56 reptiles and 12 amphibians — the 2026 checklist",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The checklist gives taxonomic remarks, specimen photographs and generalised distribution maps. Most taxa are represented by COI DNA barcodes from the Caucasus Barcoding of Life project (",
                {
                  href: CABOL_URL,
                  label: "CaBOL",
                  type: "external",
                },
                "), deposited in institutional collections and international databases. The abstract does not give an exact barcode total.",
              ],
              type: "p",
            },
            FIGURE_LIZARD,
            {
              parts: [
                "The authors explicitly distinguish biologically confirmed species — effectively isolated from their closest relatives — from candidate species whose status still needs validation, especially where contact zones and clinal variation remain poorly studied. The paper is open access under CC BY 4.0.",
              ],
              type: "p",
            },
          ],
          heading: "What is the paper?",
        },
        {
          blocks: [
            {
              parts: [
                "Candidate here does not mean “almost confirmed”. ",
                {
                  id: "lissotriton-lantzi",
                  label: "Caucasian smooth newt",
                  type: "species",
                },
                " (",
                { name: "Lissotriton lantzi", type: "sci" },
                ") is listed as a candidate: a geographically isolated lineage whose species status is not fully validated. ",
                {
                  id: "mertensiella-caucasica",
                  label: "Caucasian salamander",
                  type: "species",
                },
                " (",
                { name: "Mertensiella caucasica", type: "sci" },
                ") is biologically confirmed; the authors do not treat ",
                { name: "Mertensiella djanaschvilii", type: "sci" },
                " as a separate species.",
              ],
              type: "p",
            },
            {
              parts: [
                "Rock lizards in the genus ",
                { name: "Darevskia", type: "sci" },
                " are not identified by colour. In the checklist, ",
                {
                  id: "darevskia-derjugini",
                  label: "Derjugin’s lizard",
                  type: "species",
                },
                " and ",
                {
                  id: "darevskia-mixta",
                  label: "mixed rock lizard",
                  type: "species",
                },
                " are biologically confirmed; ",
                {
                  id: "darevskia-adjarica",
                  label: "Ajarian rock lizard",
                  type: "species",
                },
                " and ",
                {
                  id: "darevskia-brauneri",
                  label: "Brauner’s rock lizard",
                  type: "species",
                },
                " are candidates. On this atlas a candidate stays a candidate.",
              ],
              type: "p",
            },
          ],
          heading: "What does candidate mean?",
        },
        {
          blocks: [
            {
              parts: [
                "Some formally described taxa are no longer listed as separate species. The Georgian ",
                {
                  id: "vipera-transcaucasiana",
                  label: "nose-horned viper",
                  type: "species",
                },
                " is ",
                { name: "Vipera ammodytes", type: "sci" },
                " in the paper, subspecies transcaucasiana; this atlas follows the same line. The authors treat ",
                { name: "Darevskia dryada", type: "sci" },
                " as a geographic subspecies of ",
                {
                  id: "darevskia-clarkorum",
                  label: "Clark’s rock lizard",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            FIGURE_TORTOISE,
            {
              parts: [
                {
                  id: "trachemys-scripta",
                  label: "Pond slider",
                  type: "species",
                },
                " (",
                { name: "Trachemys scripta", type: "sci" },
                ") is an unintentionally introduced pet species of the last decade; the paper says reproducing populations exist near Tbilisi and Batumi. ",
                {
                  id: "phoenicolacerta-laevis",
                  label: "Lebanon lizard",
                  type: "species",
                },
                " is also unintentionally introduced and known from a single location in Georgia. The 12 and 56 include these names; anecdotal or rejected names are not in those totals.",
              ],
              type: "p",
            },
            FIGURE_SLIDER,
          ],
          heading: "What changed in the names?",
        },
        {
          blocks: [
            {
              parts: [
                "This ",
                {
                  href: PAPER_URL,
                  label: "paper",
                  type: "external",
                },
                " is the checklist this atlas follows for amphibians and reptiles. Birds and mammals are not in it; do not mix those counts with 12 and 56. An empty locality, measurement or Red List field is better than an invented one. The ",
                { id: "lizards", label: "lizards hub", type: "hub" },
                ", ",
                { id: "snakes", label: "snakes hub", type: "hub" },
                ", ",
                { id: "turtles", label: "turtles hub", type: "hub" },
                " and ",
                { id: "amphibians", label: "amphibians hub", type: "hub" },
                " remain the main record; ",
                { label: "news", type: "news-index" },
                " only adds context from this paper.",
              ],
              type: "p",
            },
          ],
          heading: "What does this mean for the atlas?",
        },
      ],
      title: "Georgia has 56 reptiles and 12 amphibians — the 2026 checklist",
    },
    ka: {
      dek: "ნაშრომი საქართველოში დაფიქსირებულ სახეობებს დადასტურებულ და კანდიდატ ტაქსონებად ყოფს — ეს ახალი აღმოჩენების სია არ არის.",
      lead: "2026 წლის 8 ივლისს ჟურნალ Caucasiana-ში გამოქვეყნდა საქართველოს ამფიბიებისა და ქვეწარმავლების ანოტირებული ჩამონათვალი. ავტორები არიან დავით თარხნიშვილი, გიორგი იანქოშვილი, არმენ სეროპიანი, ნინო ქაჩლიშვილი და მარიამი თოდუა — ილიას სახელმწიფო უნივერსიტეტისა და კავკასიის ლაიბნიცის ბიომრავალფეროვნების კვლევის ცენტრიდან. ნაშრომში საქართველოდან 12 ამფიბია და 56 ქვეწარმავალია ჩამოთვლილი. ეს ამ ატლასის ჰერპეტოფაუნის ჩამონათვალის მთავარი საფუძველია.",
      metaDescription:
        "ილიას უნივერსიტეტის 2026 წლის ჩამონათვალში საქართველოდან 12 ამფიბია და 56 ქვეწარმავალია ჩამოთვლილი. კანდიდატი სახეობა დადასტურებული არ არის.",
      metaTitle:
        "საქართველოში 56 ქვეწარმავალი და 12 ამფიბიაა — ახალი ჩამონათვალი",
      sections: [
        {
          blocks: [
            {
              parts: [
                "ჩამონათვალში სახეობებთან ერთად მოცემულია ტაქსონომიური შენიშვნები, ნიმუშების ფოტოები და გავრცელების განზოგადებული რუკები. სახეობების უმეტესობა COI დნმ-ბარკოდებითაა წარმოდგენილი — კავკასიის სიცოცხლის ბარკოდირების პროექტიდან (",
                {
                  href: CABOL_URL,
                  label: "CaBOL",
                  type: "external",
                },
                "); თანმიმდევრობები ინსტიტუციურ კოლექციებსა და საერთაშორისო ბაზებშია შეტანილი. ბარკოდების ზუსტი რაოდენობა აბსტრაქტში მითითებული არ არის.",
              ],
              type: "p",
            },
            FIGURE_LIZARD,
            {
              parts: [
                "ავტორები პირდაპირ ჰყოფენ ბიოლოგიურად დადასტურებულ სახეობებს — რომლებიც უახლოესი ნათესავებისგან გამიჯნულია — და კანდიდატებს, რომელთა სტატუსს დამატებითი შემოწმება სჭირდება, განსაკუთრებით იქ, სადაც კონტაქტის ზონები და კლინალური ვარიაცია საკმარისად არ არის შესწავლილი. ნაშრომი CC BY 4.0-ითაა ღია.",
              ],
              type: "p",
            },
          ],
          heading: "რა არის ნაშრომი?",
        },
        {
          blocks: [
            {
              parts: [
                "კანდიდატი აქ „თითქმის დადასტურებული“ არ ნიშნავს. მაგალითად, ",
                {
                  id: "lissotriton-lantzi",
                  label: "კავკასიური ჩვეულებრივი ტრიტონი",
                  type: "species",
                },
                " (",
                { name: "Lissotriton lantzi", type: "sci" },
                ") ჩამონათვალში კანდიდატია: გეოგრაფიულად იზოლირებული ხაზი, რომლის სახეობრივი სტატუსი ჯერ სრულად არ არის დამტკიცებული. ",
                {
                  id: "mertensiella-caucasica",
                  label: "კავკასიური სალამანდრა",
                  type: "species",
                },
                " (",
                { name: "Mertensiella caucasica", type: "sci" },
                ") ბიოლოგიურად დადასტურებულია; ავტორები ",
                { name: "Mertensiella djanaschvilii", type: "sci" },
                "-ს ცალკე სახეობად არ იღებენ.",
              ],
              type: "p",
            },
            {
              parts: [
                "კლდის ხვლიკების გვარში ",
                { name: "Darevskia", type: "sci" },
                " მხოლოდ შეფერილობა სახეობების გასარჩევად საკმარისი არ არის. ჩამონათვალში, მაგალითად, ",
                {
                  id: "darevskia-derjugini",
                  label: "ართვინის ხვლიკი",
                  type: "species",
                },
                " და ",
                {
                  id: "darevskia-mixta",
                  label: "კოლხური კლდის ხვლიკი",
                  type: "species",
                },
                " ბიოლოგიურად დადასტურებულია; ",
                {
                  id: "darevskia-adjarica",
                  label: "აჭარული კლდის ხვლიკი",
                  type: "species",
                },
                " და ",
                {
                  id: "darevskia-brauneri",
                  label: "ბრაუნერის კლდის ხვლიკი",
                  type: "species",
                },
                " კანდიდატებია. ამ ატლასში კანდიდატი კანდიდატად რჩება.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს კანდიდატი?",
        },
        {
          blocks: [
            {
              parts: [
                "ზოგი ფორმალურად აღწერილი ტაქსონი ჩამონათვალში ცალკე სახეობად აღარ არის. ქართული ",
                {
                  id: "vipera-transcaucasiana",
                  label: "ცხვირრქოსანი გველგესლა",
                  type: "species",
                },
                " ნაშრომში ",
                { name: "Vipera ammodytes", type: "sci" },
                "-ია, ქვესახეობა transcaucasiana; იგივე ხაზი აქვს ამ ატლასს. ",
                { name: "Darevskia dryada", type: "sci" },
                " ავტორებს ",
                {
                  id: "darevskia-clarkorum",
                  label: "თურქული ხვლიკის",
                  type: "species",
                },
                " გეოგრაფიულ ქვესახეობად მიაჩნიათ.",
              ],
              type: "p",
            },
            FIGURE_TORTOISE,
            {
              parts: [
                {
                  id: "trachemys-scripta",
                  label: "წითელყურა კუ",
                  type: "species",
                },
                " (",
                { name: "Trachemys scripta", type: "sci" },
                ") ბოლო ათწლეულში უნებლიედ შემოტანილი შინაური სახეობაა; ნაშრომი ამბობს, რომ თბილისისა და ბათუმის მიდამოებში მრავლდება. ",
                {
                  id: "phoenicolacerta-laevis",
                  label: "ლიბანური ხვლიკი",
                  type: "species",
                },
                " უნებლიედ შემოტანილია და საქართველოში ერთ ადგილასაა ცნობილი. 12 და 56 სახეობის ეს საერთო რაოდენობა შემოტანილ სახეობებსაც მოიცავს; ანეკდოტური ან უარყოფილი სახელები ამ რიცხვებში არ შედის.",
              ],
              type: "p",
            },
            FIGURE_SLIDER,
          ],
          heading: "რა შეიცვალა სახელებში?",
        },
        {
          blocks: [
            {
              parts: [
                "ეს ",
                {
                  href: PAPER_URL,
                  label: "ნაშრომი",
                  type: "external",
                },
                " ამ ატლასის ამფიბიებისა და ქვეწარმავლების ჩამონათვალის მთავარი საფუძველია. ფრინველები და ძუძუმწოვრები აქ არ არის; მათი რიცხვი 12-სა და 56-ს ნუ აურევთ. თუ სახეობის გავრცელების, ზომის ან წითელ ნუსხაში სტატუსის შესახებ სანდო ინფორმაცია არ გვაქვს, ცარიელი ველი სჯობს გამოგონილ მონაცემს. ",
                { id: "lizards", label: "ხვლიკების ჰაბი", type: "hub" },
                ", ",
                { id: "snakes", label: "გველების ჰაბი", type: "hub" },
                ", ",
                { id: "turtles", label: "კუების ჰაბი", type: "hub" },
                " და ",
                { id: "amphibians", label: "ამფიბიების ჰაბი", type: "hub" },
                " რჩება ძირითად ჩანაწერად; ",
                { label: "სიახლეები", type: "news-index" },
                " მხოლოდ ამ ნაშრომს უმატებს კონტექსტს.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს ეს ატლასისთვის?",
        },
      ],
      title: "საქართველოში 56 ქვეწარმავალი და 12 ამფიბიაა — ახალი ჩამონათვალი",
    },
    ru: {
      dek: "Работа разделяет отмеченные в Грузии виды на подтверждённые и кандидат-таксоны — это не список новых находок.",
      lead: "8 июля 2026 года в журнале Caucasiana вышел аннотированный список амфибий и рептилий Грузии. Авторы — Давид Тархнишвили, Гиорги Янкошвили, Армен Серопин, Нино Качлишвили и Мариами Тодуа из Государственного университета Илии и Кавказского лейбницевского центра исследований биоразнообразия. В работе для Грузии приняты 12 видов амфибий и 56 видов рептилий. Этот список — опора герпетофаунистического слоя атласа.",
      metaDescription:
        "Чеклист 2026 года Университета Илии принимает герпетофауну Грузии как 12 амфибий и 56 рептилий. Виды-кандидаты не подтверждены.",
      metaTitle: "В Грузии 56 видов рептилий и 12 амфибий — новый список",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Список даёт таксономические замечания, фотографии экземпляров и обобщённые карты распространения. Большинство таксонов представлены ДНК-баркодами COI проекта Caucasus Barcoding of Life (",
                {
                  href: CABOL_URL,
                  label: "CaBOL",
                  type: "external",
                },
                "); последовательности сданы в институтские коллекции и международные базы. Точное число баркодов абстракт не называет.",
              ],
              type: "p",
            },
            FIGURE_LIZARD,
            {
              parts: [
                "Авторы прямо отделяют биологически подтверждённые виды — эффективно изолированные от ближайших родственников — от кандидатов, чей статус ещё нужно проверить, особенно там, где контактные зоны и клинальная изменчивость изучены недостаточно. Работа открыта по лицензии CC BY 4.0.",
              ],
              type: "p",
            },
          ],
          heading: "Что это за работа?",
        },
        {
          blocks: [
            {
              parts: [
                "Кандидат здесь не значит «почти подтверждён». Например, ",
                {
                  id: "lissotriton-lantzi",
                  label: "кавказский обыкновенный тритон",
                  type: "species",
                },
                " (",
                { name: "Lissotriton lantzi", type: "sci" },
                ") в списке кандидат: географически изолированная линия, видовой статус которой ещё не полностью доказан. ",
                {
                  id: "mertensiella-caucasica",
                  label: "Кавказская саламандра",
                  type: "species",
                },
                " (",
                { name: "Mertensiella caucasica", type: "sci" },
                ") биологически подтверждена; ",
                { name: "Mertensiella djanaschvilii", type: "sci" },
                " авторы отдельным видом не принимают.",
              ],
              type: "p",
            },
            {
              parts: [
                "Скальных ящериц рода ",
                { name: "Darevskia", type: "sci" },
                " по цвету не отождествляют. В списке, например, ",
                {
                  id: "darevskia-derjugini",
                  label: "ящерица Дерюгина",
                  type: "species",
                },
                " и ",
                {
                  id: "darevskia-mixta",
                  label: "смешанная скальная ящерица",
                  type: "species",
                },
                " биологически подтверждены; ",
                {
                  id: "darevskia-adjarica",
                  label: "аджарская скальная ящерица",
                  type: "species",
                },
                " и ",
                {
                  id: "darevskia-brauneri",
                  label: "ящерица Браунера",
                  type: "species",
                },
                " — кандидаты. В этом атласе кандидат остаётся кандидатом.",
              ],
              type: "p",
            },
          ],
          heading: "Что значит кандидат?",
        },
        {
          blocks: [
            {
              parts: [
                "Некоторые формально описанные таксоны в списке больше не отдельные виды. Грузинская ",
                {
                  id: "vipera-transcaucasiana",
                  label: "носатая гадюка",
                  type: "species",
                },
                " в работе — ",
                { name: "Vipera ammodytes", type: "sci" },
                ", подвид transcaucasiana; та же линия в этом атласе. ",
                { name: "Darevskia dryada", type: "sci" },
                " авторы считают географическим подвидом ",
                {
                  id: "darevskia-clarkorum",
                  label: "ящерицы Кларка",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            FIGURE_TORTOISE,
            {
              parts: [
                {
                  id: "trachemys-scripta",
                  label: "Красноухая черепаха",
                  type: "species",
                },
                " (",
                { name: "Trachemys scripta", type: "sci" },
                ") — непреднамеренно завезённый за последнее десятилетие домашний вид; в работе сказано, что размножающиеся популяции есть в окрестностях Тбилиси и Батуми. ",
                {
                  id: "phoenicolacerta-laevis",
                  label: "Ливанская ящерица",
                  type: "species",
                },
                " тоже завезена непреднамеренно и в Грузии известна из одного места. 12 и 56 включают и эти имена; анекдотические или отвергнутые названия в эти числа не входят.",
              ],
              type: "p",
            },
            FIGURE_SLIDER,
          ],
          heading: "Что изменилось в названиях?",
        },
        {
          blocks: [
            {
              parts: [
                "Эта ",
                {
                  href: PAPER_URL,
                  label: "работа",
                  type: "external",
                },
                " — опора списка амфибий и рептилий атласа. Птиц и млекопитающих в ней нет; их числа с 12 и 56 не смешивайте. Пустое поле локалитета, размера или Красного списка лучше выдуманного. ",
                { id: "lizards", label: "Страница ящериц", type: "hub" },
                ", ",
                { id: "snakes", label: "страница змей", type: "hub" },
                ", ",
                { id: "turtles", label: "страница черепах", type: "hub" },
                " и ",
                { id: "amphibians", label: "страница амфибий", type: "hub" },
                " остаются основной записью; ",
                { label: "новости", type: "news-index" },
                " лишь добавляют контекст этой работы.",
              ],
              type: "p",
            },
          ],
          heading: "Что это значит для атласа?",
        },
      ],
      title: "В Грузии 56 видов рептилий и 12 амфибий — новый список",
    },
    tr: {
      dek: "Makale Gürcistan’da kaydedilen türleri doğrulanmış ve aday taksonlar olarak ayırır — bu yeni keşif listesi değildir.",
      lead: "8 Temmuz 2026’da Caucasiana, Gürcistan amfibi ve sürüngenlerinin açıklamalı kontrol listesini yayımladı. Yazarlar David Tarkhnishvili, Giorgi Iankoshvili, Armen Seropian, Nino Kachlishvili ve Mariami Todua; Ilia Devlet Üniversitesi ve Kafkasya Leibniz Biyoçeşitlilik Araştırma Merkezi’nden. Makale Gürcistan’dan 12 amfibi ve 56 sürüngen türünü kayıtlara alır. Bu liste atlasın herpetofauna katmanının dayanağıdır.",
      metaDescription:
        "Ilia Devlet Üniversitesi’nin 2026 kontrol listesi Gürcistan herpetofaunasını 12 amfibi ve 56 sürüngen olarak alır. Aday türler doğrulanmış değildir.",
      metaTitle:
        "Gürcistan’da 56 sürüngen ve 12 amfibi var — 2026 kontrol listesi",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Liste taksonomik notlar, örnek fotoğrafları ve genelleştirilmiş yayılış haritaları verir. Çoğu takson, Kafkasya Yaşam Barkodlama projesinden (",
                {
                  href: CABOL_URL,
                  label: "CaBOL",
                  type: "external",
                },
                ") COI DNA barkodlarıyla temsil edilir; diziler kurumsal koleksiyonlara ve uluslararası veri tabanlarına yatırılmıştır. Özet tam barkod sayısı vermez.",
              ],
              type: "p",
            },
            FIGURE_LIZARD,
            {
              parts: [
                "Yazarlar, en yakın akrabalarından etkin biçimde yalıtılmış biyolojik olarak doğrulanmış türleri, statüsü hâlâ doğrulama isteyen aday türlerden açıkça ayırır — özellikle temas kuşakları ve klinal varyasyon yeterince çalışılmamışsa. Makale CC BY 4.0 ile açıktır.",
              ],
              type: "p",
            },
          ],
          heading: "Makale nedir?",
        },
        {
          blocks: [
            {
              parts: [
                "Aday burada «neredeyse doğrulanmış» demek değildir. Örneğin ",
                {
                  id: "lissotriton-lantzi",
                  label: "Kafkas küçük semenderi",
                  type: "species",
                },
                " (",
                { name: "Lissotriton lantzi", type: "sci" },
                ") listede adaydır: tür statüsü henüz tam doğrulanmamış, coğrafi olarak yalıtılmış bir soy. ",
                {
                  id: "mertensiella-caucasica",
                  label: "Kafkas semenderi",
                  type: "species",
                },
                " (",
                { name: "Mertensiella caucasica", type: "sci" },
                ") biyolojik olarak doğrulanmıştır; yazarlar ",
                { name: "Mertensiella djanaschvilii", type: "sci" },
                " adlı formu ayrı tür olarak almaz.",
              ],
              type: "p",
            },
            {
              parts: [
                {
                  name: "Darevskia",
                  type: "sci",
                },
                " cinsindeki kayalık kertenkeleler renkle ayırt edilmez. Listede örneğin ",
                {
                  id: "darevskia-derjugini",
                  label: "Derjugin kertenkelesi",
                  type: "species",
                },
                " ve ",
                {
                  id: "darevskia-mixta",
                  label: "karışık kayalık kertenkele",
                  type: "species",
                },
                " biyolojik olarak doğrulanmıştır; ",
                {
                  id: "darevskia-adjarica",
                  label: "Acar kayalık kertenkelesi",
                  type: "species",
                },
                " ile ",
                {
                  id: "darevskia-brauneri",
                  label: "Brauner kayalık kertenkelesi",
                  type: "species",
                },
                " adaydır. Bu atlas’ta aday aday kalır.",
              ],
              type: "p",
            },
          ],
          heading: "Aday ne demek?",
        },
        {
          blocks: [
            {
              parts: [
                "Bazı resmi betimlenmiş taksonlar artık ayrı tür olarak listelenmez. Gürcü ",
                {
                  id: "vipera-transcaucasiana",
                  label: "boynuzlu engerek",
                  type: "species",
                },
                " makalede ",
                { name: "Vipera ammodytes", type: "sci" },
                "tir, transcaucasiana alttürü; bu atlas aynı çizgiyi izler. Yazarlar ",
                { name: "Darevskia dryada", type: "sci" },
                " formunu ",
                {
                  id: "darevskia-clarkorum",
                  label: "Clark kayalık kertenkelesinin",
                  type: "species",
                },
                " coğrafi alttürü sayar.",
              ],
              type: "p",
            },
            FIGURE_TORTOISE,
            {
              parts: [
                {
                  id: "trachemys-scripta",
                  label: "Kırmızı yanaklı su kaplumbağası",
                  type: "species",
                },
                " (",
                { name: "Trachemys scripta", type: "sci" },
                ") son on yılda istemeden sokulmuş bir evcil türdür; makale üreyen popülasyonların Tiflis ve Batum civarında olduğunu yazar. ",
                {
                  id: "phoenicolacerta-laevis",
                  label: "Lübnan kertenkelesi",
                  type: "species",
                },
                " de istemeden sokulmuştur ve Gürcistan’da tek bir yerden bilinir. 12 ve 56 bu adları da kapsar; anekdotik veya reddedilmiş adlar bu sayılara girmez.",
              ],
              type: "p",
            },
            FIGURE_SLIDER,
          ],
          heading: "İsimlerde ne değişti?",
        },
        {
          blocks: [
            {
              parts: [
                "Bu ",
                {
                  href: PAPER_URL,
                  label: "makale",
                  type: "external",
                },
                " atlasın amfibi ve sürüngen listesinin dayanağıdır. Kuşlar ve memeliler burada yoktur; onların sayılarını 12 ve 56 ile karıştırmayın. Boş lokalite, ölçü veya Kırmızı Liste alanı uydurulmuş olandan iyidir. ",
                { id: "lizards", label: "Kertenkeleler sayfası", type: "hub" },
                ", ",
                { id: "snakes", label: "yılanlar sayfası", type: "hub" },
                ", ",
                { id: "turtles", label: "kaplumbağalar sayfası", type: "hub" },
                " ve ",
                { id: "amphibians", label: "amfibiler sayfası", type: "hub" },
                " ana kayıt olarak kalır; ",
                { label: "haberler", type: "news-index" },
                " yalnızca bu makaleye bağlam ekler.",
              ],
              type: "p",
            },
          ],
          heading: "Bu atlas için ne anlama gelir?",
        },
      ],
      title: "Gürcistan’da 56 sürüngen ve 12 amfibi var — 2026 kontrol listesi",
    },
  },
  gallery: [PHOTO_LIZARD, PHOTO_TORTOISE, PHOTO_SLIDER],
  id: "georgia-herpetofauna-checklist-2026",
  image: PHOTO_SALAMANDER,
  publishedAt: "2026-09-02",
  relatedHubIds: ["lizards", "snakes", "turtles", "amphibians"],
  relatedRegionIds: [],
  relatedSpeciesIds: [
    "mertensiella-caucasica",
    "darevskia-derjugini",
    "vipera-transcaucasiana",
    "trachemys-scripta",
  ],
  slug: "georgia-herpetofauna-checklist-2026",
  sources: [
    {
      name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia’s amphibians and reptiles",
      url: PAPER_URL,
    },
    {
      name: "Tarkhnishvili et al. 2026 — PDF",
      url: PAPER_PDF_URL,
    },
    {
      name: "Caucasus Barcoding of Life (CaBOL)",
      url: CABOL_URL,
    },
  ],
  status: "published",
  updatedAt: "2026-09-02",
};
