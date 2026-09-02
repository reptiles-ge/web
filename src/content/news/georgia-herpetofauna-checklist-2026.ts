import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.3897/caucasiana.5.e189214";
const PAPER_PDF_URL =
  "https://caucasiana.pensoft.net/article/189214/download/pdf/";
const CABOL_URL = "https://ggbc.eu/";

const PHOTO_SALAMANDER: NewsPhoto = {
  src: "https://cdn.reptiles.ge/mertensiella-caucasica-armen-3.jpg",
  fromAtlas: true,
  alt: {
    ka: "კავკასიური სალამანდრა. ატლასის ფოტო.",
    en: "Caucasian salamander. Photograph from the atlas.",
    ru: "Кавказская саламандра. Фото из атласа.",
    tr: "Kafkas semenderi. Atlas fotoğrafı.",
  },
  credit: {
    photographer: "Armen Seropian",
    date: "2019-02-17",
  },
};

const PHOTO_LIZARD: NewsPhoto = {
  src: "https://cdn.reptiles.ge/darevskia-derjugini-zauri-1.jpg",
  fromAtlas: true,
  alt: {
    ka: "ართვინის ხვლიკი. ატლასის ფოტო.",
    en: "Derjugin’s lizard. Photograph from the atlas.",
    ru: "Ящерица Дерюгина. Фото из атласа.",
    tr: "Derjugin kertenkelesi. Atlas fotoğrafı.",
  },
  credit: {
    photographer: "ზაური ხაჩიძე",
    location: "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    date: "2015-05-26",
  },
};

const PHOTO_TORTOISE: NewsPhoto = {
  src: "https://cdn.reptiles.ge/testudo-graeca-3.jpg",
  fromAtlas: true,
  alt: {
    ka: "ხმელთაშუაზღვეთის კუ. ატლასის ფოტო.",
    en: "Mediterranean tortoise. Photograph from the atlas.",
    ru: "Средиземноморская черепаха. Фото из атласа.",
    tr: "Akdeniz tosbağası. Atlas fotoğrafı.",
  },
  credit: {
    photographer: "Cuora",
    url: "https://www.inaturalist.org/observations/96663399",
  },
};

const PHOTO_SLIDER: NewsPhoto = {
  src: "https://cdn.reptiles.ge/trachemys-scripta.jpg",
  fromAtlas: true,
  alt: {
    ka: "წითელყურა კუ. ატლასის ფოტო.",
    en: "Pond slider. Photograph from the atlas.",
    ru: "Красноухая черепаха. Фото из атласа.",
    tr: "Kırmızı yanaklı su kaplumbağası. Atlas fotoğrafı.",
  },
  credit: {
    photographer: "Nelson Wisnik",
    url: "https://www.inaturalist.org/observations/18808638",
  },
};

const FIGURE_LIZARD = {
  type: "figure" as const,
  src: PHOTO_LIZARD.src,
};
const FIGURE_TORTOISE = {
  type: "figure" as const,
  src: PHOTO_TORTOISE.src,
};
const FIGURE_SLIDER = {
  type: "figure" as const,
  src: PHOTO_SLIDER.src,
};

export const GEORGIA_HERPETOFAUNA_CHECKLIST_2026: NewsArticle = {
  id: "georgia-herpetofauna-checklist-2026",
  slug: "georgia-herpetofauna-checklist-2026",
  status: "published",
  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",
  relatedSpeciesIds: [
    "mertensiella-caucasica",
    "darevskia-derjugini",
    "vipera-transcaucasiana",
    "trachemys-scripta",
  ],
  relatedRegionIds: [],
  relatedHubIds: ["lizards", "snakes", "turtles", "amphibians"],
  image: PHOTO_SALAMANDER,
  gallery: [PHOTO_LIZARD, PHOTO_TORTOISE, PHOTO_SLIDER],
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
  copy: {
    ka: {
      title: "საქართველოში 56 ქვეწარმავალი და 12 ამფიბიაა — ახალი ჩამონათვალი",
      metaTitle:
        "საქართველოში 56 ქვეწარმავალი და 12 ამფიბიაა — ახალი ჩამონათვალი",
      metaDescription:
        "ილიას უნივერსიტეტის 2026 წლის ჩამონათვალი საქართველოს ჰერპეტოფაუნას 12 ამფიბიითა და 56 ქვეწარმავლით იღებს. კანდიდატი სახეობა დადასტურებული არ არის.",
      dek: "ილიას უნივერსიტეტის ნაშრომი სახეობებს ბიოლოგიურად დადასტურებულად და კანდიდატად ჰყოფს. ეს ახალი აღმოჩენების სია არ არის.",
      lead: "2026 წლის 8 ივლისს ჟურნალ Caucasiana-ში გამოქვეყნდა საქართველოს ამფიბიებისა და ქვეწარმავლების ანოტირებული ჩამონათვალი. ავტორები არიან დავით თარხნიშვილი, გიორგი იანქოშვილი, არმენ სეროპიანი, ნინო ქაჩლიშვილი და მარიამი თოდუა — ილიას სახელმწიფო უნივერსიტეტისა და კავკასიის ლაიბნიცის ბიომრავალფეროვნების კვლევის ცენტრიდან. ნაშრომი საქართველოდან 12 ამფიბიასა და 56 ქვეწარმავალს იღებს. ეს ამ ატლასის ჰერპეტოფაუნის ფენის საყრდენია.",
      sections: [
        {
          heading: "რა არის ნაშრომი?",
          blocks: [
            {
              type: "p",
              parts: [
                "ჩამონათვალი სახეობებს ტაქსონომიური შენიშვნებით, ნიმუშების ფოტოებითა და განზოგადებული გავრცელების რუკებით წარმოადგენს. სახეობების უმეტესობა COI დნმ-ბარკოდებითაა წარმოდგენილი — კავკასიის სიცოცხლის ბარკოდირების პროექტიდან (",
                {
                  type: "external",
                  href: CABOL_URL,
                  label: "CaBOL",
                },
                "); თანმიმდევრობები ინსტიტუციურ კოლექციებსა და საერთაშორისო ბაზებშია შეტანილი. რამდენი ბარკოდია ზუსტად, აბსტრაქტი არ ამბობს.",
              ],
            },
            FIGURE_LIZARD,
            {
              type: "p",
              parts: [
                "ავტორები პირდაპირ ჰყოფენ ბიოლოგიურად დადასტურებულ სახეობებს — რომლებიც უახლოესი ნათესავებისგან ეფექტურად იზოლირებულია — და კანდიდატებს, რომელთა სტატუსს დამატებითი შემოწმება სჭირდება, განსაკუთრებით იქ, სადაც კონტაქტის ზონები და კლინალური ვარიაცია საკმარისად არ არის შესწავლილი. ნაშრომი CC BY 4.0-ითაა ღია.",
              ],
            },
          ],
        },
        {
          heading: "რას ნიშნავს კანდიდატი?",
          blocks: [
            {
              type: "p",
              parts: [
                "კანდიდატი აქ „თითქმის დადასტურებული“ არ ნიშნავს. მაგალითად, ",
                {
                  type: "species",
                  id: "lissotriton-lantzi",
                  label: "კავკასიური ჩვეულებრივი ტრიტონი",
                },
                " (",
                { type: "sci", name: "Lissotriton lantzi" },
                ") ჩამონათვალში კანდიდატია: გეოგრაფიულად იზოლირებული ხაზი, რომლის სახეობრივი სტატუსი ჯერ სრულად არ არის დამტკიცებული. ",
                {
                  type: "species",
                  id: "mertensiella-caucasica",
                  label: "კავკასიური სალამანდრა",
                },
                " (",
                { type: "sci", name: "Mertensiella caucasica" },
                ") ბიოლოგიურად დადასტურებულია; ავტორები ",
                { type: "sci", name: "Mertensiella djanaschvilii" },
                "-ს ცალკე სახეობად არ იღებენ.",
              ],
            },
            {
              type: "p",
              parts: [
                "კლდის ხვლიკების გვარი ",
                { type: "sci", name: "Darevskia" },
                " ფერით არ იკეცება. ჩამონათვალში, მაგალითად, ",
                {
                  type: "species",
                  id: "darevskia-derjugini",
                  label: "ართვინის ხვლიკი",
                },
                " და ",
                {
                  type: "species",
                  id: "darevskia-mixta",
                  label: "კოლხური კლდის ხვლიკი",
                },
                " ბიოლოგიურად დადასტურებულია; ",
                {
                  type: "species",
                  id: "darevskia-adjarica",
                  label: "აჭარული კლდის ხვლიკი",
                },
                " და ",
                {
                  type: "species",
                  id: "darevskia-brauneri",
                  label: "ბრაუნერის კლდის ხვლიკი",
                },
                " კანდიდატებია. ამ ატლასში კანდიდატი კანდიდატად რჩება.",
              ],
            },
          ],
        },
        {
          heading: "რა შეიცვალა სახელებში?",
          blocks: [
            {
              type: "p",
              parts: [
                "ზოგი ფორმალურად აღწერილი ტაქსონი ჩამონათვალში ცალკე სახეობად აღარ არის. ქართული ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "ცხვირრქოსანი გველგესლა",
                },
                " ნაშრომში ",
                { type: "sci", name: "Vipera ammodytes" },
                "-ია, ქვესახეობა transcaucasiana; იგივე ხაზი აქვს ამ ატლასს. ",
                { type: "sci", name: "Darevskia dryada" },
                " ავტორებს ",
                {
                  type: "species",
                  id: "darevskia-clarkorum",
                  label: "თურქული ხვლიკის",
                },
                " გეოგრაფიულ ქვესახეობად მიაჩნიათ.",
              ],
            },
            FIGURE_TORTOISE,
            {
              type: "p",
              parts: [
                {
                  type: "species",
                  id: "trachemys-scripta",
                  label: "წითელყურა კუ",
                },
                " (",
                { type: "sci", name: "Trachemys scripta" },
                ") ბოლო ათწლეულში უნებლიედ შემოტანილი შინაური სახეობაა; ნაშრომი ამბობს, რომ თბილისისა და ბათუმის მიდამოებში მრავლდება. ",
                {
                  type: "species",
                  id: "phoenicolacerta-laevis",
                  label: "ლიბანური ხვლიკი",
                },
                " უნებლიედ შემოტანილია და საქართველოში ერთ ადგილასაა ცნობილი. 12 და 56 ამ სახელებსაც მოიცავს; ანეკდოტური ან უარყოფილი სახელები ამ რიცხვებში არ შედის.",
              ],
            },
            FIGURE_SLIDER,
          ],
        },
        {
          heading: "რას ნიშნავს ეს ატლასისთვის?",
          blocks: [
            {
              type: "p",
              parts: [
                "ეს ",
                {
                  type: "external",
                  href: PAPER_URL,
                  label: "ნაშრომი",
                },
                " ამ ატლასის ამფიბიებისა და ქვეწარმავლების ჩამონათვალის საყრდენია. ფრინველები და ძუძუმწოვრები აქ არ არის; მათი რიცხვი 12-სა და 56-ს ნუ აურევთ. ადგილის, ზომის ან წითელი ნუსხის ველი ცარიელი ჯობს, ვიდრე გამოგონილი. ",
                { type: "hub", id: "lizards", label: "ხვლიკების ჰაბი" },
                ", ",
                { type: "hub", id: "snakes", label: "გველების ჰაბი" },
                ", ",
                { type: "hub", id: "turtles", label: "კუების ჰაბი" },
                " და ",
                { type: "hub", id: "amphibians", label: "ამფიბიების ჰაბი" },
                " რჩება ძირითად ჩანაწერად; ",
                { type: "news-index", label: "სიახლეები" },
                " მხოლოდ ამ ნაშრომს უმატებს კონტექსტს.",
              ],
            },
          ],
        },
      ],
    },
    en: {
      title: "Georgia has 56 reptiles and 12 amphibians — the 2026 checklist",
      metaTitle:
        "Georgia has 56 reptiles and 12 amphibians — the 2026 checklist",
      metaDescription:
        "A 2026 Ilia State University checklist treats Georgia’s herpetofauna as 12 amphibians and 56 reptiles. Candidate species are not confirmed.",
      dek: "The Ilia State University paper splits species into biologically confirmed and candidate. This is not a list of new discoveries.",
      lead: "On 8 July 2026, Caucasiana published an annotated checklist of the amphibians and reptiles of Georgia. The authors are David Tarkhnishvili, Giorgi Iankoshvili, Armen Seropian, Nino Kachlishvili and Mariami Todua, at Ilia State University and the Caucasus Leibniz Biodiversity Research Center. The paper treats 12 amphibian and 56 reptile species as recorded from Georgia. That list is the backbone of this atlas’s herpetofauna layer.",
      sections: [
        {
          heading: "What is the paper?",
          blocks: [
            {
              type: "p",
              parts: [
                "The checklist gives taxonomic remarks, specimen photographs and generalised distribution maps. Most taxa are represented by COI DNA barcodes from the Caucasus Barcoding of Life project (",
                {
                  type: "external",
                  href: CABOL_URL,
                  label: "CaBOL",
                },
                "), deposited in institutional collections and international databases. The abstract does not give an exact barcode total.",
              ],
            },
            FIGURE_LIZARD,
            {
              type: "p",
              parts: [
                "The authors explicitly distinguish biologically confirmed species — effectively isolated from their closest relatives — from candidate species whose status still needs validation, especially where contact zones and clinal variation remain poorly studied. The paper is open access under CC BY 4.0.",
              ],
            },
          ],
        },
        {
          heading: "What does candidate mean?",
          blocks: [
            {
              type: "p",
              parts: [
                "Candidate here does not mean “almost confirmed”. ",
                {
                  type: "species",
                  id: "lissotriton-lantzi",
                  label: "Caucasian smooth newt",
                },
                " (",
                { type: "sci", name: "Lissotriton lantzi" },
                ") is listed as a candidate: a geographically isolated lineage whose species status is not fully validated. ",
                {
                  type: "species",
                  id: "mertensiella-caucasica",
                  label: "Caucasian salamander",
                },
                " (",
                { type: "sci", name: "Mertensiella caucasica" },
                ") is biologically confirmed; the authors do not treat ",
                { type: "sci", name: "Mertensiella djanaschvilii" },
                " as a separate species.",
              ],
            },
            {
              type: "p",
              parts: [
                "Rock lizards in the genus ",
                { type: "sci", name: "Darevskia" },
                " are not identified by colour. In the checklist, ",
                {
                  type: "species",
                  id: "darevskia-derjugini",
                  label: "Derjugin’s lizard",
                },
                " and ",
                {
                  type: "species",
                  id: "darevskia-mixta",
                  label: "mixed rock lizard",
                },
                " are biologically confirmed; ",
                {
                  type: "species",
                  id: "darevskia-adjarica",
                  label: "Ajarian rock lizard",
                },
                " and ",
                {
                  type: "species",
                  id: "darevskia-brauneri",
                  label: "Brauner’s rock lizard",
                },
                " are candidates. On this atlas a candidate stays a candidate.",
              ],
            },
          ],
        },
        {
          heading: "What changed in the names?",
          blocks: [
            {
              type: "p",
              parts: [
                "Some formally described taxa are no longer listed as separate species. The Georgian ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "nose-horned viper",
                },
                " is ",
                { type: "sci", name: "Vipera ammodytes" },
                " in the paper, subspecies transcaucasiana; this atlas follows the same line. The authors treat ",
                { type: "sci", name: "Darevskia dryada" },
                " as a geographic subspecies of ",
                {
                  type: "species",
                  id: "darevskia-clarkorum",
                  label: "Clark’s rock lizard",
                },
                ".",
              ],
            },
            FIGURE_TORTOISE,
            {
              type: "p",
              parts: [
                {
                  type: "species",
                  id: "trachemys-scripta",
                  label: "Pond slider",
                },
                " (",
                { type: "sci", name: "Trachemys scripta" },
                ") is an unintentionally introduced pet species of the last decade; the paper says reproducing populations exist near Tbilisi and Batumi. ",
                {
                  type: "species",
                  id: "phoenicolacerta-laevis",
                  label: "Lebanon lizard",
                },
                " is also unintentionally introduced and known from a single location in Georgia. The 12 and 56 include these names; anecdotal or rejected names are not in those totals.",
              ],
            },
            FIGURE_SLIDER,
          ],
        },
        {
          heading: "What does this mean for the atlas?",
          blocks: [
            {
              type: "p",
              parts: [
                "This ",
                {
                  type: "external",
                  href: PAPER_URL,
                  label: "paper",
                },
                " is the checklist this atlas follows for amphibians and reptiles. Birds and mammals are not in it; do not mix those counts with 12 and 56. An empty locality, measurement or Red List field is better than an invented one. The ",
                { type: "hub", id: "lizards", label: "lizards hub" },
                ", ",
                { type: "hub", id: "snakes", label: "snakes hub" },
                ", ",
                { type: "hub", id: "turtles", label: "turtles hub" },
                " and ",
                { type: "hub", id: "amphibians", label: "amphibians hub" },
                " remain the main record; ",
                { type: "news-index", label: "news" },
                " only adds context from this paper.",
              ],
            },
          ],
        },
      ],
    },
    ru: {
      title: "В Грузии 56 видов рептилий и 12 амфибий — новый список",
      metaTitle: "В Грузии 56 видов рептилий и 12 амфибий — новый список",
      metaDescription:
        "Чеклист 2026 года Университета Илии принимает герпетофауну Грузии как 12 амфибий и 56 рептилий. Виды-кандидаты не подтверждены.",
      dek: "Работа Университета Илии разделяет виды на биологически подтверждённые и кандидаты. Это не список новых находок.",
      lead: "8 июля 2026 года в журнале Caucasiana вышел аннотированный список амфибий и рептилий Грузии. Авторы — Давид Тархнишвили, Гиорги Янкошвили, Армен Серопин, Нино Качлишвили и Мариами Тодуа из Государственного университета Илии и Кавказского лейбницевского центра исследований биоразнообразия. В работе для Грузии приняты 12 видов амфибий и 56 видов рептилий. Этот список — опора герпетофаунистического слоя атласа.",
      sections: [
        {
          heading: "Что это за работа?",
          blocks: [
            {
              type: "p",
              parts: [
                "Список даёт таксономические замечания, фотографии экземпляров и обобщённые карты распространения. Большинство таксонов представлены ДНК-баркодами COI проекта Caucasus Barcoding of Life (",
                {
                  type: "external",
                  href: CABOL_URL,
                  label: "CaBOL",
                },
                "); последовательности сданы в институтские коллекции и международные базы. Точное число баркодов абстракт не называет.",
              ],
            },
            FIGURE_LIZARD,
            {
              type: "p",
              parts: [
                "Авторы прямо отделяют биологически подтверждённые виды — эффективно изолированные от ближайших родственников — от кандидатов, чей статус ещё нужно проверить, особенно там, где контактные зоны и клинальная изменчивость изучены недостаточно. Работа открыта по лицензии CC BY 4.0.",
              ],
            },
          ],
        },
        {
          heading: "Что значит кандидат?",
          blocks: [
            {
              type: "p",
              parts: [
                "Кандидат здесь не значит «почти подтверждён». Например, ",
                {
                  type: "species",
                  id: "lissotriton-lantzi",
                  label: "кавказский обыкновенный тритон",
                },
                " (",
                { type: "sci", name: "Lissotriton lantzi" },
                ") в списке кандидат: географически изолированная линия, видовой статус которой ещё не полностью доказан. ",
                {
                  type: "species",
                  id: "mertensiella-caucasica",
                  label: "Кавказская саламандра",
                },
                " (",
                { type: "sci", name: "Mertensiella caucasica" },
                ") биологически подтверждена; ",
                { type: "sci", name: "Mertensiella djanaschvilii" },
                " авторы отдельным видом не принимают.",
              ],
            },
            {
              type: "p",
              parts: [
                "Скальных ящериц рода ",
                { type: "sci", name: "Darevskia" },
                " по цвету не отождествляют. В списке, например, ",
                {
                  type: "species",
                  id: "darevskia-derjugini",
                  label: "ящерица Дерюгина",
                },
                " и ",
                {
                  type: "species",
                  id: "darevskia-mixta",
                  label: "смешанная скальная ящерица",
                },
                " биологически подтверждены; ",
                {
                  type: "species",
                  id: "darevskia-adjarica",
                  label: "аджарская скальная ящерица",
                },
                " и ",
                {
                  type: "species",
                  id: "darevskia-brauneri",
                  label: "ящерица Браунера",
                },
                " — кандидаты. В этом атласе кандидат остаётся кандидатом.",
              ],
            },
          ],
        },
        {
          heading: "Что изменилось в названиях?",
          blocks: [
            {
              type: "p",
              parts: [
                "Некоторые формально описанные таксоны в списке больше не отдельные виды. Грузинская ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "носатая гадюка",
                },
                " в работе — ",
                { type: "sci", name: "Vipera ammodytes" },
                ", подвид transcaucasiana; та же линия в этом атласе. ",
                { type: "sci", name: "Darevskia dryada" },
                " авторы считают географическим подвидом ",
                {
                  type: "species",
                  id: "darevskia-clarkorum",
                  label: "ящерицы Кларка",
                },
                ".",
              ],
            },
            FIGURE_TORTOISE,
            {
              type: "p",
              parts: [
                {
                  type: "species",
                  id: "trachemys-scripta",
                  label: "Красноухая черепаха",
                },
                " (",
                { type: "sci", name: "Trachemys scripta" },
                ") — непреднамеренно завезённый за последнее десятилетие домашний вид; в работе сказано, что размножающиеся популяции есть в окрестностях Тбилиси и Батуми. ",
                {
                  type: "species",
                  id: "phoenicolacerta-laevis",
                  label: "Ливанская ящерица",
                },
                " тоже завезена непреднамеренно и в Грузии известна из одного места. 12 и 56 включают и эти имена; анекдотические или отвергнутые названия в эти числа не входят.",
              ],
            },
            FIGURE_SLIDER,
          ],
        },
        {
          heading: "Что это значит для атласа?",
          blocks: [
            {
              type: "p",
              parts: [
                "Эта ",
                {
                  type: "external",
                  href: PAPER_URL,
                  label: "работа",
                },
                " — опора списка амфибий и рептилий атласа. Птиц и млекопитающих в ней нет; их числа с 12 и 56 не смешивайте. Пустое поле локалитета, размера или Красного списка лучше выдуманного. ",
                { type: "hub", id: "lizards", label: "Страница ящериц" },
                ", ",
                { type: "hub", id: "snakes", label: "страница змей" },
                ", ",
                { type: "hub", id: "turtles", label: "страница черепах" },
                " и ",
                { type: "hub", id: "amphibians", label: "страница амфибий" },
                " остаются основной записью; ",
                { type: "news-index", label: "новости" },
                " лишь добавляют контекст этой работы.",
              ],
            },
          ],
        },
      ],
    },
    tr: {
      title: "Gürcistan’da 56 sürüngen ve 12 amfibi var — 2026 kontrol listesi",
      metaTitle:
        "Gürcistan’da 56 sürüngen ve 12 amfibi var — 2026 kontrol listesi",
      metaDescription:
        "Ilia Devlet Üniversitesi’nin 2026 kontrol listesi Gürcistan herpetofaunasını 12 amfibi ve 56 sürüngen olarak alır. Aday türler doğrulanmış değildir.",
      dek: "Ilia Devlet Üniversitesi makalesi türleri biyolojik olarak doğrulanmış ve aday diye ayırır. Bu yeni keşif listesi değildir.",
      lead: "8 Temmuz 2026’da Caucasiana, Gürcistan amfibi ve sürüngenlerinin açıklamalı kontrol listesini yayımladı. Yazarlar David Tarkhnishvili, Giorgi Iankoshvili, Armen Seropian, Nino Kachlishvili ve Mariami Todua; Ilia Devlet Üniversitesi ve Kafkasya Leibniz Biyoçeşitlilik Araştırma Merkezi’nden. Makale Gürcistan’dan 12 amfibi ve 56 sürüngen türünü kayıtlara alır. Bu liste atlasın herpetofauna katmanının dayanağıdır.",
      sections: [
        {
          heading: "Makale nedir?",
          blocks: [
            {
              type: "p",
              parts: [
                "Liste taksonomik notlar, örnek fotoğrafları ve genelleştirilmiş yayılış haritaları verir. Çoğu takson, Kafkasya Yaşam Barkodlama projesinden (",
                {
                  type: "external",
                  href: CABOL_URL,
                  label: "CaBOL",
                },
                ") COI DNA barkodlarıyla temsil edilir; diziler kurumsal koleksiyonlara ve uluslararası veri tabanlarına yatırılmıştır. Özet tam barkod sayısı vermez.",
              ],
            },
            FIGURE_LIZARD,
            {
              type: "p",
              parts: [
                "Yazarlar, en yakın akrabalarından etkin biçimde yalıtılmış biyolojik olarak doğrulanmış türleri, statüsü hâlâ doğrulama isteyen aday türlerden açıkça ayırır — özellikle temas kuşakları ve klinal varyasyon yeterince çalışılmamışsa. Makale CC BY 4.0 ile açıktır.",
              ],
            },
          ],
        },
        {
          heading: "Aday ne demek?",
          blocks: [
            {
              type: "p",
              parts: [
                "Aday burada «neredeyse doğrulanmış» demek değildir. Örneğin ",
                {
                  type: "species",
                  id: "lissotriton-lantzi",
                  label: "Kafkas küçük semenderi",
                },
                " (",
                { type: "sci", name: "Lissotriton lantzi" },
                ") listede adaydır: tür statüsü henüz tam doğrulanmamış, coğrafi olarak yalıtılmış bir soy. ",
                {
                  type: "species",
                  id: "mertensiella-caucasica",
                  label: "Kafkas semenderi",
                },
                " (",
                { type: "sci", name: "Mertensiella caucasica" },
                ") biyolojik olarak doğrulanmıştır; yazarlar ",
                { type: "sci", name: "Mertensiella djanaschvilii" },
                " adlı formu ayrı tür olarak almaz.",
              ],
            },
            {
              type: "p",
              parts: [
                {
                  type: "sci",
                  name: "Darevskia",
                },
                " cinsindeki kayalık kertenkeleler renkle ayırt edilmez. Listede örneğin ",
                {
                  type: "species",
                  id: "darevskia-derjugini",
                  label: "Derjugin kertenkelesi",
                },
                " ve ",
                {
                  type: "species",
                  id: "darevskia-mixta",
                  label: "karışık kayalık kertenkele",
                },
                " biyolojik olarak doğrulanmıştır; ",
                {
                  type: "species",
                  id: "darevskia-adjarica",
                  label: "Acar kayalık kertenkelesi",
                },
                " ile ",
                {
                  type: "species",
                  id: "darevskia-brauneri",
                  label: "Brauner kayalık kertenkelesi",
                },
                " adaydır. Bu atlas’ta aday aday kalır.",
              ],
            },
          ],
        },
        {
          heading: "İsimlerde ne değişti?",
          blocks: [
            {
              type: "p",
              parts: [
                "Bazı resmi betimlenmiş taksonlar artık ayrı tür olarak listelenmez. Gürcü ",
                {
                  type: "species",
                  id: "vipera-transcaucasiana",
                  label: "boynuzlu engerek",
                },
                " makalede ",
                { type: "sci", name: "Vipera ammodytes" },
                "tir, transcaucasiana alttürü; bu atlas aynı çizgiyi izler. Yazarlar ",
                { type: "sci", name: "Darevskia dryada" },
                " formunu ",
                {
                  type: "species",
                  id: "darevskia-clarkorum",
                  label: "Clark kayalık kertenkelesinin",
                },
                " coğrafi alttürü sayar.",
              ],
            },
            FIGURE_TORTOISE,
            {
              type: "p",
              parts: [
                {
                  type: "species",
                  id: "trachemys-scripta",
                  label: "Kırmızı yanaklı su kaplumbağası",
                },
                " (",
                { type: "sci", name: "Trachemys scripta" },
                ") son on yılda istemeden sokulmuş bir evcil türdür; makale üreyen popülasyonların Tiflis ve Batum civarında olduğunu yazar. ",
                {
                  type: "species",
                  id: "phoenicolacerta-laevis",
                  label: "Lübnan kertenkelesi",
                },
                " de istemeden sokulmuştur ve Gürcistan’da tek bir yerden bilinir. 12 ve 56 bu adları da kapsar; anekdotik veya reddedilmiş adlar bu sayılara girmez.",
              ],
            },
            FIGURE_SLIDER,
          ],
        },
        {
          heading: "Bu atlas için ne anlama gelir?",
          blocks: [
            {
              type: "p",
              parts: [
                "Bu ",
                {
                  type: "external",
                  href: PAPER_URL,
                  label: "makale",
                },
                " atlasın amfibi ve sürüngen listesinin dayanağıdır. Kuşlar ve memeliler burada yoktur; onların sayılarını 12 ve 56 ile karıştırmayın. Boş lokalite, ölçü veya Kırmızı Liste alanı uydurulmuş olandan iyidir. ",
                { type: "hub", id: "lizards", label: "Kertenkeleler sayfası" },
                ", ",
                { type: "hub", id: "snakes", label: "yılanlar sayfası" },
                ", ",
                { type: "hub", id: "turtles", label: "kaplumbağalar sayfası" },
                " ve ",
                { type: "hub", id: "amphibians", label: "amfibiler sayfası" },
                " ana kayıt olarak kalır; ",
                { type: "news-index", label: "haberler" },
                " yalnızca bu makaleye bağlam ekler.",
              ],
            },
          ],
        },
      ],
    },
  },
};
