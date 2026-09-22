import { getTranslations } from "next-intl/server";

import type { GalleryImage, Species, SpeciesStat } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { SpeciesBreadcrumbCrumb } from "@/lib/speciesBreadcrumbs";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyBlock } from "@/components/BiologyBlock";
import { ContentAttribution } from "@/components/ContentAttribution";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideStaticGrid } from "@/components/RelatedGuideStaticGrid";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesIdentification } from "@/components/SpeciesIdentification";
import { SpeciesOverviewText } from "@/components/SpeciesOverviewText";
import { SpeciesProfileFacts } from "@/components/SpeciesProfileFacts";
import { SpeciesProfileRelated } from "@/components/SpeciesProfileRelated";
import { SpeciesSources } from "@/components/SpeciesSources";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import {
  type HubClusterCard,
  isLizardSpecies,
  isSnakeSpecies,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { formatContentDate, formatPhotoDate } from "@/lib/formatDate";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type BiologyBlockItem = {
  body: string;
  id: string;
  title: string;
};

type HalyomorphaAnnotationCopy = {
  alt: string;
  caption: string;
  creditLabel: string;
  intro: string;
  label: string;
  labels: Record<HalyomorphaAnnotationMarkerKey, string>;
  note: string;
  title: string;
};

type HalyomorphaAnnotationMarkerKey =
  "abdomen" | "antenna" | "legs" | "shoulders";

type HalyomorphaPestCopy = {
  damageIntro: string;
  damageNote: string;
  damageRows: Array<{
    crop: string;
    damage: string;
    signs: string;
  }>;
  damageTitle: string;
  headers: {
    crop: string;
    damage: string;
    signs: string;
  };
  indoorsIntro: string;
  indoorsSteps: Array<{
    body: string;
    title: string;
  }>;
  indoorsTitle: string;
  label: string;
};

type SpeciesProfileBodyProps = {
  biologyBlocks: BiologyBlockItem[];
  biologyTitle?: string;
  breadcrumbs: SpeciesBreadcrumbCrumb[];
  dangerValue: null | string;
  displayStats: SpeciesStat[];
  gallery: GalleryImage[];
  guideLinks: HubClusterCard[];
  linkDangerStats: boolean;
  locale: AppLocale;
  lookalikes: Species[];
  related: Species[];
  showIdentification: boolean;
  species: Species;
};

const HALYOMORPHA_ANNOTATED_IMAGE_SRC =
  "https://cdn.reptiles.ge/halyomorpha-halys-mishel-1.jpg";

const HALYOMORPHA_ANNOTATION_MARKERS: Array<{
  key: HalyomorphaAnnotationMarkerKey;
  label: { x: number; y: number };
  line: { x1: number; x2: number; y1: number; y2: number };
  point: { x: number; y: number };
}> = [
  {
    key: "antenna",
    label: { x: 6, y: 8 },
    line: { x1: 22, x2: 27, y1: 21, y2: 35 },
    point: { x: 27, y: 35 },
  },
  {
    key: "abdomen",
    label: { x: 5, y: 78 },
    line: { x1: 29, x2: 39, y1: 80, y2: 64 },
    point: { x: 39, y: 64 },
  },
  {
    key: "shoulders",
    label: { x: 94, y: 10 },
    line: { x1: 73, x2: 43, y1: 24, y2: 40 },
    point: { x: 43, y: 40 },
  },
  {
    key: "legs",
    label: { x: 96, y: 77 },
    line: { x1: 78, x2: 67, y1: 79, y2: 52 },
    point: { x: 67, y: 52 },
  },
];

const HALYOMORPHA_ANNOTATION_COPY: Record<
  AppLocale,
  HalyomorphaAnnotationCopy
> = {
  en: {
    alt: "Annotated field photo of brown marmorated stink bug showing pale antennal bands, the pale-dark abdomen edge, rounded shoulders, and pale leg bands.",
    caption:
      "A single mark is not enough; compare the antennae, abdomen edge, shoulders, and legs together.",
    creditLabel: "Photo",
    intro:
      "Several native and introduced stink bugs can look brown at first glance. For Halyomorpha halys, identification is strongest when the same photo shows the pale-banded antennae, alternating abdominal edge, rounded shoulder corners, and pale-banded legs.",
    label: "Comparison",
    labels: {
      abdomen: "Pale-dark abdomen edge",
      antenna: "Two pale antennal bands",
      legs: "Pale bands on the legs",
      shoulders: "Rounded shoulders",
    },
    note: "Brown colour or an unpleasant smell alone is not enough for identification.",
    title: "How is it different from other stink bugs?",
  },
  ka: {
    alt: "აზიური ფაროსანას ანოტირებული საველე ფოტო: მონიშნულია ულვაშის ღია ზოლები, მუცლის ღია-მუქი კიდე, მომრგვალებული მხრები და ფეხების ღია ზოლები.",
    caption:
      "ერთი ნიშანი საკმარისი არ არის; ერთად შეადარეთ ულვაში, მუცლის კიდე, მხრები და ფეხები.",
    creditLabel: "ფოტო",
    intro:
      "საქართველოში სხვა ფაროსანებიც შეიძლება ერთი შეხედვით ყავისფერი ჩანდეს. Halyomorpha halys-ის ამოცნობა ყველაზე სანდოა მაშინ, როცა ერთ ფოტოში ჩანს ულვაშის ღია ზოლები, მუცლის მონაცვლე ღია-მუქი კიდე, მომრგვალებული მხრები და ფეხების ღია ზოლები.",
    label: "შედარება",
    labels: {
      abdomen: "მუცლის ღია-მუქი კიდე",
      antenna: "ულვაშის ორი ღია ზოლი",
      legs: "ფეხების ღია ზოლები",
      shoulders: "მომრგვალებული „მხრები“",
    },
    note: "მხოლოდ ყავისფერი ფერი ან უსიამოვნო სუნი საკმარისი არ არის ამოსაცნობად.",
    title: "რით განსხვავდება სხვა ფაროსანებისგან?",
  },
  ru: {
    alt: "Аннотированная полевая фотография коричнево-мраморного клопа: отмечены светлые полосы на усиках, светло-тёмный край брюшка, округлые плечи и светлые полосы на ногах.",
    caption:
      "Одного признака недостаточно; сравнивайте усики, край брюшка, плечи и ноги вместе.",
    creditLabel: "Фото",
    intro:
      "Другие клопы тоже могут казаться просто коричневыми. У Halyomorpha halys надёжнее всего искать сочетание признаков: светлые полосы на усиках, чередующийся край брюшка, округлые плечевые углы и светлые полосы на ногах.",
    label: "Сравнение",
    labels: {
      abdomen: "Светло-тёмный край брюшка",
      antenna: "Две светлые полосы на усиках",
      legs: "Светлые полосы на ногах",
      shoulders: "Округлые плечи",
    },
    note: "Только коричневого цвета или неприятного запаха недостаточно для распознавания.",
    title: "Чем он отличается от других клопов?",
  },
  tr: {
    alt: "Kahverengi kokarcanın açıklamalı arazi fotoğrafı: açık anten bantları, açık-koyu karın kenarı, yuvarlak omuzlar ve bacaklardaki açık bantlar işaretlenmiştir.",
    caption:
      "Tek bir işaret yeterli değildir; antenleri, karın kenarını, omuzları ve bacakları birlikte karşılaştırın.",
    creditLabel: "Fotoğraf",
    intro:
      "Diğer kokarcalar da ilk bakışta kahverengi görünebilir. Halyomorpha halys için en güvenilir tanı, aynı fotoğrafta açık bantlı antenler, dönüşümlü açık-koyu karın kenarı, yuvarlak omuz köşeleri ve bacaklardaki açık bantlar görüldüğünde yapılır.",
    label: "Karşılaştırma",
    labels: {
      abdomen: "Açık-koyu karın kenarı",
      antenna: "Antende iki açık bant",
      legs: "Bacaklarda açık bantlar",
      shoulders: "Yuvarlak omuzlar",
    },
    note: "Yalnızca kahverengi renk veya hoş olmayan koku tanı için yeterli değildir.",
    title: "Diğer kokarcalardan nasıl ayrılır?",
  },
};

function insetAnnotationLineEnd(
  line: (typeof HALYOMORPHA_ANNOTATION_MARKERS)[number]["line"],
) {
  const inset = 2.9;
  const dx = line.x1 - line.x2;
  const dy = line.y1 - line.y2;
  const length = Math.hypot(dx, dy);
  if (length === 0) return { x: line.x2, y: line.y2 };
  return {
    x: line.x2 + (dx / length) * inset,
    y: line.y2 + (dy / length) * inset,
  };
}

const HALYOMORPHA_PEST_COPY: Record<AppLocale, HalyomorphaPestCopy> = {
  en: {
    damageIntro:
      "The damage comes from feeding. Adults and nymphs pierce young shoots, leaves, fruit, nuts, or seeds and suck plant sap. NFA lists hazelnut, pome and stone fruit, berries, vegetables, sunflower, and maize among important Georgian host crops.",
    damageNote:
      "NFA notes that in a strong outbreak the loss may reach up to 70% of crop value. That is an outbreak-risk figure, not a prediction for every garden or field.",
    damageRows: [
      {
        crop: "Hazelnut",
        damage:
          "Young shell and kernel contents are pierced and drained during nut development.",
        signs:
          "Thinned or shrivelled kernel contents, corky or rotting spots, lower market quality.",
      },
      {
        crop: "Peach, nectarine, apple, pear",
        damage: "Fruit tissue is pierced while the insect feeds on sap.",
        signs:
          "Depressed, discoloured, or corky feeding marks and reduced fruit quality.",
      },
      {
        crop: "Tomato, pepper, other vegetables",
        damage: "Soft fruit and shoots can be fed on by nymphs and adults.",
        signs:
          "Pale or sunken feeding spots and fruit that loses quality before harvest.",
      },
      {
        crop: "Berries, sunflower, maize",
        damage: "Seeds, fruit, and other soft plant parts may be attacked.",
        signs:
          "Sap-feeding injury, quality loss, and local crop damage when numbers are high.",
      },
    ],
    damageTitle: "What damage does brown marmorated stink bug cause?",
    headers: {
      crop: "Crop",
      damage: "What is damaged",
      signs: "How the damage looks",
    },
    indoorsIntro:
      "Adults often enter buildings in autumn because they are looking for dry overwintering shelters. Indoors, the goal is removal and exclusion: avoid crushing them, remove them mechanically, and close entry points.",
    indoorsSteps: [
      {
        body: "Crushing releases a stronger odour and can leave smell on surfaces.",
        title: "Do not crush it",
      },
      {
        body: "Collect individuals with paper or a container and place them in soapy water.",
        title: "Use soapy water",
      },
      {
        body: "A vacuum can work for many insects if the container or bag can be cleaned afterward.",
        title: "Vacuum carefully",
      },
      {
        body: "Seal window and door gaps, cracks, attic openings, and damaged screens before autumn aggregations begin.",
        title: "Block entry points",
      },
      {
        body: "Use pesticides only according to the label, registration, and official agricultural guidance.",
        title: "Be careful with chemicals",
      },
    ],
    indoorsTitle: "What should you do if it enters the house?",
    label: "Damage and control",
  },
  ka: {
    damageIntro:
      "ზიანი კვებით იწყება. ზრდასრული ფაროსანა და ნიმფა ხორთუმით ხვრეტს ყლორტს, ფოთოლს, ნაყოფს, თესლს ან კაკალს და მცენარის წვენს წოვს. NFA საქართველოსთვის მნიშვნელოვან მასპინძლებად ასახელებს თხილს, თესლოვან და კურკოვან ხეხილს, კენკროვნებს, ბოსტნეულ კულტურებს, მზესუმზირასა და სიმინდს.",
    damageNote:
      "NFA მიუთითებს, რომ ძლიერი აფეთქების დროს ზარალმა შესაძლოა მოსავლის ღირებულების 70%-იც შეადგინოს. ეს არის აფეთქების რისკის კონტექსტი და არა პროგნოზი ყველა ბაღისა თუ ნაკვეთისთვის.",
    damageRows: [
      {
        crop: "თხილი",
        damage:
          "ახალშემოსული ნაჭუჭი და ნაყოფის შიგთავსი იხვრიტება და იწოვება განვითარების დროს.",
        signs:
          "შიგთავსის გათხელება ან დაჩუტვა, კორპისებრი/ლპობადი ლაქები, საბაზრო ხარისხის დაქვეითება.",
      },
      {
        crop: "ატამი, ვაშლატამა, ვაშლი, მსხალი",
        damage: "ზიანდება ნაყოფის ქსოვილი, საიდანაც მწერი წვენს წოვს.",
        signs:
          "ჩაზნექილი, გაუფერულებული ან კორპისებრი კვების კვალი და ნაყოფის ხარისხის დაკარგვა.",
      },
      {
        crop: "პომიდორი, წიწაკა და სხვა ბოსტნეული",
        damage:
          "ნიმფები და ზრდასრულები შეიძლება იკვებონ რბილ ნაყოფზე და ყლორტებზე.",
        signs:
          "ღია ან ჩაზნექილი ლაქები, ნაყოფის დამახინჯება ან მოსავლის ხარისხის შემცირება.",
      },
      {
        crop: "კენკროვნები, მზესუმზირა, სიმინდი",
        damage: "შეიძლება დაზიანდეს თესლი, ნაყოფი და მცენარის რბილი ნაწილები.",
        signs:
          "წვენის წოვით გამოწვეული დაზიანება, ხარისხის დაკარგვა და ლოკალური მოსავლის ზიანი მაღალი რაოდენობისას.",
      },
    ],
    damageTitle: "რა ზიანს აყენებს აზიური ფაროსანა?",
    headers: {
      crop: "კულტურა",
      damage: "რა ზიანდება",
      signs: "როგორ ჩანს დაზიანება",
    },
    indoorsIntro:
      "ზრდასრული ფაროსანა შენობაში ყველაზე ხშირად შემოდგომაზე შედის, რადგან მშრალ და დაცულ გამოსაზამთრებელ ადგილს ეძებს. სახლში მთავარი ამოცანაა მოცილება და შემოსასვლელების დახურვა: არ გაჭყლიტოთ, მოაშორეთ მექანიკურად და შეამცირეთ ღრიჭოები.",
    indoorsSteps: [
      {
        body: "გაჭყლეტისას მძაფრი სუნი ძლიერდება და ზედაპირზე შეიძლება დარჩეს.",
        title: "არ გაჭყლიტოთ",
      },
      {
        body: "შეაგროვეთ ქაღალდით ან ჭურჭლით და ჩაყარეთ საპნიან წყალში.",
        title: "გამოიყენეთ საპნიანი წყალი",
      },
      {
        body: "მრავალი ინდივიდისას შეიძლება მტვერსასრუტიც, თუ კონტეინერის ან პარკის გაწმენდა შეძლებთ.",
        title: "მტვერსასრუტი ფრთხილად",
      },
      {
        body: "შემოდგომამდე დახურეთ ფანჯრისა და კარის ღრიჭოები, ნაპრალები, სხვენის შესასვლელები და დაზიანებული ბადეები.",
        title: "დახურეთ შემოსასვლელები",
      },
      {
        body: "პესტიციდი გამოიყენეთ მხოლოდ ეტიკეტის, რეგისტრაციისა და ოფიციალური აგრონომიული რეკომენდაციის დაცვით.",
        title: "ქიმიასთან ფრთხილად",
      },
    ],
    indoorsTitle: "როგორ მოვიქცეთ, თუ ფაროსანა სახლში შემოვიდა?",
    label: "ზიანი და კონტროლი",
  },
  ru: {
    damageIntro:
      "Вред связан с питанием. Взрослые особи и нимфы прокалывают побеги, листья, плоды, семена или орехи и высасывают сок. NFA называет среди важных культур в Грузии фундук, семечковые и косточковые плодовые, ягоды, овощи, подсолнечник и кукурузу.",
    damageNote:
      "NFA указывает, что при сильной вспышке ущерб может достигать до 70% стоимости урожая. Это показатель риска при вспышке, а не прогноз для каждого сада или поля.",
    damageRows: [
      {
        crop: "Фундук",
        damage:
          "Прокалываются молодая скорлупа и содержимое ореха во время развития.",
        signs:
          "Истончённое или сморщенное содержимое, пробковидные или гниющие пятна, снижение товарного качества.",
      },
      {
        crop: "Персик, нектарин, яблоко, груша",
        damage:
          "Повреждаются ткани плода, из которых насекомое высасывает сок.",
        signs:
          "Вдавленные, обесцвеченные или пробковидные следы питания и потеря качества плода.",
      },
      {
        crop: "Томат, перец и другие овощи",
        damage:
          "Нимфы и взрослые особи могут питаться мягкими плодами и побегами.",
        signs:
          "Светлые или вдавленные пятна и снижение качества до сбора урожая.",
      },
      {
        crop: "Ягоды, подсолнечник, кукуруза",
        damage:
          "Могут повреждаться семена, плоды и другие мягкие части растения.",
        signs:
          "Следы высасывания сока, потеря качества и локальный ущерб при высокой численности.",
      },
    ],
    damageTitle: "Какой вред наносит коричнево-мраморный клоп?",
    headers: {
      crop: "Культура",
      damage: "Что повреждается",
      signs: "Как выглядит повреждение",
    },
    indoorsIntro:
      "Взрослые особи часто заходят в здания осенью, когда ищут сухие защищённые места для зимовки. В доме задача простая: удалить насекомых без раздавливания и закрыть входы.",
    indoorsSteps: [
      {
        body: "При раздавливании запах усиливается и может оставаться на поверхностях.",
        title: "Не раздавливайте",
      },
      {
        body: "Соберите насекомое бумагой или ёмкостью и поместите в мыльную воду.",
        title: "Используйте мыльную воду",
      },
      {
        body: "Пылесос подходит при большом числе насекомых, если контейнер или мешок можно затем очистить.",
        title: "Осторожно с пылесосом",
      },
      {
        body: "До осенних скоплений закройте щели окон и дверей, трещины, входы на чердак и повреждённые сетки.",
        title: "Закройте входы",
      },
      {
        body: "Пестициды применяйте только по этикетке, регистрации и официальным агрономическим рекомендациям.",
        title: "Осторожно с химией",
      },
    ],
    indoorsTitle: "Что делать, если клоп попал в дом?",
    label: "Вред и контроль",
  },
  tr: {
    damageIntro:
      "Zarar beslenmeden kaynaklanır. Erginler ve nimfler sürgün, yaprak, meyve, tohum veya fındığı delerek bitki özsuyunu emer. NFA Gürcistan için önemli konukçular arasında fındık, yumuşak ve sert çekirdekli meyveler, üzümsü meyveler, sebzeler, ayçiçeği ve mısırı sayar.",
    damageNote:
      "NFA, güçlü bir salgında zararın ürün değerinin %70'ine kadar çıkabileceğini belirtir. Bu her bahçe veya tarla için tahmin değil, salgın riski bağlamıdır.",
    damageRows: [
      {
        crop: "Fındık",
        damage:
          "Gelişim sırasında genç kabuk ve iç kısım delinerek özsu emilir.",
        signs:
          "İç kısmın incelmesi veya buruşması, mantarımsı/çürüklük lekeleri, pazar kalitesinde düşüş.",
      },
      {
        crop: "Şeftali, nektarin, elma, armut",
        damage: "Böcek meyve dokusunu deler ve özsuyu emer.",
        signs:
          "Çökük, renksiz veya mantarımsı beslenme izleri ve meyve kalitesinde düşüş.",
      },
      {
        crop: "Domates, biber ve diğer sebzeler",
        damage:
          "Nimfler ve erginler yumuşak meyve ve sürgünlerde beslenebilir.",
        signs: "Açık renkli veya çökük lekeler ve hasattan önce kalite kaybı.",
      },
      {
        crop: "Üzümsü meyveler, ayçiçeği, mısır",
        damage:
          "Tohum, meyve ve diğer yumuşak bitki kısımları zarar görebilir.",
        signs:
          "Özsu emme yaralanması, kalite kaybı ve sayı yüksek olduğunda yerel ürün zararı.",
      },
    ],
    damageTitle: "Kahverengi kokarca ne tür zarar verir?",
    headers: {
      crop: "Ürün",
      damage: "Ne zarar görür",
      signs: "Zarar nasıl görünür",
    },
    indoorsIntro:
      "Erginler sonbaharda kuru ve korunaklı kışlama yeri aradığı için binalara girebilir. Ev içinde amaç ezmeden uzaklaştırmak ve giriş noktalarını kapatmaktır.",
    indoorsSteps: [
      {
        body: "Ezmek kokuyu güçlendirir ve koku yüzeylerde kalabilir.",
        title: "Ezmeyin",
      },
      {
        body: "Bireyleri kâğıt veya kapla toplayıp sabunlu suya bırakın.",
        title: "Sabunlu su kullanın",
      },
      {
        body: "Çok sayıda birey için, haznesi veya torbası sonradan temizlenebilen bir süpürge kullanılabilir.",
        title: "Süpürgeyi dikkatli kullanın",
      },
      {
        body: "Sonbahar kümelenmelerinden önce pencere ve kapı aralıklarını, çatlakları, çatı girişlerini ve hasarlı sineklikleri kapatın.",
        title: "Girişleri kapatın",
      },
      {
        body: "Pestisitleri yalnızca etiket, kayıt ve resmî tarımsal önerilere göre kullanın.",
        title: "Kimyasallarda dikkatli olun",
      },
    ],
    indoorsTitle: "Eve girerse ne yapmalı?",
    label: "Zarar ve kontrol",
  },
};

export async function SpeciesProfileBody({
  biologyBlocks,
  biologyTitle,
  breadcrumbs,
  dangerValue,
  displayStats,
  gallery,
  guideLinks,
  linkDangerStats,
  locale,
  lookalikes,
  related,
  showIdentification,
  species,
}: SpeciesProfileBodyProps) {
  const t = await getTranslations("profile");
  const snake = isSnakeSpecies(species);
  const lizard = isLizardSpecies(species);
  const relatedLabelVariant =
    getSpeciesAtlasMeta(species.id).group === "insect"
      ? "otherInsects"
      : "related";

  return (
    <>
      <SpeciesBreadcrumbTrail
        ariaLabel={t("breadcrumbAria")}
        breadcrumbs={breadcrumbs}
      />

      <SpeciesProfileFacts
        danger={species.danger}
        dangerValue={dangerValue}
        displayStats={displayStats}
        interaction={species.interaction}
        linkDangerStats={linkDangerStats}
      />

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("overview")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-5 max-w-2xl font-display text-display-title leading-[1.14] font-bold"
            id={SPECIES_SECTION_IDS.overview}
            slugSource={t("overviewTitle", { name: species.commonName })}
          >
            {t("overviewTitle", { name: species.commonName })}
          </AnchoredHeading>
          <SpeciesOverviewText
            body={species.overview}
            readLess={t("readLess")}
            readMore={t("readMore")}
          />
          <p className="mt-6 text-[12px] leading-relaxed tracking-wide text-muted-foreground">
            <span>
              {t("publishedOn")}{" "}
              <time dateTime={species.publishedAt}>
                {formatContentDate(species.publishedAt, locale)}
              </time>
            </span>
            {hasMeaningfulUpdate(species.publishedAt, species.updatedAt) ? (
              <span>
                {" "}
                · {t("updatedOn")}{" "}
                <time dateTime={species.updatedAt}>
                  {formatContentDate(species.updatedAt, locale)}
                </time>
              </span>
            ) : null}
          </p>
        </div>
      </section>

      {gallery.length > 0 ? (
        <SpeciesGallery
          images={gallery}
          location={species.location}
          name={species.commonName}
          scientificName={species.scientificName}
          speciesId={species.id}
          tone="background"
        />
      ) : null}

      <SpeciesRangeMap
        fieldRecords={species.fieldRecords}
        gallery={gallery}
        speciesId={species.id}
        speciesName={species.commonName}
      />

      {showIdentification && species.identification ? (
        <SpeciesIdentification
          identification={species.identification}
          name={species.commonName}
        />
      ) : null}

      {species.id === "halyomorpha-halys" ? (
        <HalyomorphaIdentificationFigure
          anchorLabel={t("anchorLink")}
          gallery={gallery}
          locale={locale}
        />
      ) : null}

      {species.id === "halyomorpha-halys" ? (
        <HalyomorphaPestSections
          anchorLabel={t("anchorLink")}
          locale={locale}
        />
      ) : null}

      <SpeciesProfileRelated
        locale={locale}
        related={lookalikes}
        variant="lookalikes"
      />

      {snake ? (
        <QuizPracticeCta
          body={t("quizCtaBody", { name: species.commonName })}
          className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          quizId="snake"
          source="species"
          speciesId={species.id}
          title={t("quizCtaTitle")}
        />
      ) : lizard ? (
        <QuizPracticeCta
          body={t("quizCtaBodyLizard", { name: species.commonName })}
          className="border-t border-border bg-surface pt-8 pb-10 lg:pt-10 lg:pb-14"
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          quizId="lizard"
          source="species"
          speciesId={species.id}
          title={t("quizCtaTitleLizard")}
        />
      ) : null}

      <SpeciesProfileBiology
        blocks={biologyBlocks}
        isSnake={snake}
        title={biologyTitle}
      />

      {species.faq && species.faq.length > 0 ? (
        <SpeciesFaqSection
          entityId={species.id}
          items={species.faq}
          name={species.commonName}
          pageType="species"
        />
      ) : null}

      <ContentAttribution
        publishedAt={species.publishedAt}
        sourcesHref={
          species.sources.length > 0
            ? `#${SPECIES_SECTION_IDS.sources}`
            : undefined
        }
        updatedAt={species.updatedAt}
      />

      <SpeciesSources sources={species.sources} speciesId={species.id} />

      {guideLinks.length > 0 ? (
        <section className="border-t border-border bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {t("guidesEyebrow")}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-display-card font-semibold">
              {t("guidesTitle")}
            </h2>
            <RelatedGuideStaticGrid
              cards={guideLinks}
              className="mt-8"
              locale={locale}
            />
          </div>
        </section>
      ) : null}

      <SpeciesProfileRelated
        labelVariant={relatedLabelVariant}
        locale={locale}
        related={related}
      />
    </>
  );
}

function biologyGridClass(count: number) {
  if (count >= 4 || count === 2) {
    return "md:grid-cols-2";
  }
  if (count >= 3) {
    return "md:grid-cols-3";
  }
  return "md:grid-cols-1";
}

function HalyomorphaIdentificationFigure({
  anchorLabel,
  gallery,
  locale,
}: {
  anchorLabel: string;
  gallery: GalleryImage[];
  locale: AppLocale;
}) {
  const copy = HALYOMORPHA_ANNOTATION_COPY[locale];
  const photo =
    gallery.find((item) => item.src === HALYOMORPHA_ANNOTATED_IMAGE_SRC) ??
    gallery[0];
  const src = photo?.src ?? HALYOMORPHA_ANNOTATED_IMAGE_SRC;
  const credit = photo?.credit;
  const creditParts = [
    credit?.photographer,
    credit?.location,
    credit?.date ? formatPhotoDate(credit.date, locale) : null,
  ].filter((item): item is string => Boolean(item));
  const entry = optimizedEntry(src);
  const arrowId = "halyomorpha-identification-arrow";
  const sizes =
    "(max-width: 1023px) calc(100vw - 3rem), (max-width: 1479px) calc((min(1400px, 100vw - 5rem) - 2.5rem) * 0.58), 800px";

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(420px,1fr)] lg:items-center lg:gap-16 lg:px-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {copy.label}
          </p>
          <AnchoredHeading
            anchorLabel={anchorLabel}
            className="mt-5 max-w-3xl font-display text-display-title font-bold"
            id="stink-bug-comparison"
            slugSource={copy.title}
          >
            {copy.title}
          </AnchoredHeading>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            {copy.intro}
          </p>
          <p className="mt-6 max-w-2xl border-l-2 border-primary/55 pl-5 text-[15px] leading-relaxed font-medium text-foreground">
            {copy.note}
          </p>
        </div>

        <figure className="group">
          <div className="relative aspect-1024/936 overflow-hidden rounded-card bg-ink">
            <picture className="media-placeholder absolute inset-0 block size-full">
              {pictureSources(src, { sizes }).map((source) => (
                <source key={source.key} {...source.props} />
              ))}
              <img
                alt={copy.alt}
                className="absolute inset-0 size-full object-cover text-transparent"
                decoding="async"
                height={entry?.height}
                loading="lazy"
                sizes={sizes}
                src={optimizedImgSrc(src, 800)}
                width={entry?.width}
              />
            </picture>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/25"
            />
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden size-full sm:block"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <marker
                  id={arrowId}
                  markerHeight="5"
                  markerUnits="strokeWidth"
                  markerWidth="5"
                  orient="auto"
                  refX="4"
                  refY="2.5"
                >
                  <path className="fill-white" d="M0,0 L5,2.5 L0,5 Z" />
                </marker>
              </defs>
              {HALYOMORPHA_ANNOTATION_MARKERS.map((marker) => {
                const lineEnd = insetAnnotationLineEnd(marker.line);

                return (
                  <g key={marker.key}>
                    <line
                      className="stroke-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.85)]"
                      markerEnd={`url(#${arrowId})`}
                      strokeLinecap="round"
                      strokeWidth="0.75"
                      x1={marker.line.x1}
                      x2={lineEnd.x}
                      y1={marker.line.y1}
                      y2={lineEnd.y}
                    />
                    <circle
                      className="fill-white stroke-ink"
                      cx={marker.point.x}
                      cy={marker.point.y}
                      r="1.25"
                      strokeWidth="0.3"
                    />
                  </g>
                );
              })}
            </svg>
            {HALYOMORPHA_ANNOTATION_MARKERS.map((marker, index) => (
              <div
                className="absolute z-2 hidden max-w-48 items-center gap-2 border border-white/35 bg-ink/80 px-3 py-2 text-[11px] leading-snug font-medium text-white shadow-lg backdrop-blur-sm sm:flex"
                key={marker.key}
                style={{
                  left: `${marker.label.x}%`,
                  top: `${marker.label.y}%`,
                  transform:
                    marker.label.x > 50 ? "translateX(-100%)" : undefined,
                }}
              >
                <span className="flex size-5 shrink-0 items-center justify-center border border-white/45 text-[10px]">
                  {index + 1}
                </span>
                <span>{copy.labels[marker.key]}</span>
              </div>
            ))}
            {HALYOMORPHA_ANNOTATION_MARKERS.map((marker, index) => (
              <span
                aria-hidden="true"
                className="absolute z-2 flex size-7 -translate-1/2 items-center justify-center border border-white/75 bg-ink/75 text-[12px] font-semibold text-white shadow-lg sm:hidden"
                key={marker.key}
                style={{
                  left: `${marker.point.x}%`,
                  top: `${marker.point.y}%`,
                }}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <figcaption className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            {copy.caption}
            {creditParts.length > 0 ? (
              <span className="mt-1 block text-[12px] text-muted-foreground/80">
                {copy.creditLabel}: {creditParts.join(" · ")}
              </span>
            ) : null}
          </figcaption>
          <ol className="mt-4 grid gap-2 text-[13px] leading-snug text-foreground sm:hidden">
            {HALYOMORPHA_ANNOTATION_MARKERS.map((marker, index) => (
              <li className="grid grid-cols-[auto_1fr] gap-3" key={marker.key}>
                <span className="flex size-6 items-center justify-center border border-border text-[11px] font-semibold">
                  {index + 1}
                </span>
                <span className="self-center">{copy.labels[marker.key]}</span>
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </section>
  );
}

function HalyomorphaPestSections({
  anchorLabel,
  locale,
}: {
  anchorLabel: string;
  locale: AppLocale;
}) {
  const copy = HALYOMORPHA_PEST_COPY[locale];

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {copy.label}
        </p>
        <AnchoredHeading
          anchorLabel={anchorLabel}
          className="mt-5 max-w-3xl font-display text-display-title font-bold"
          id="damage"
          slugSource={copy.damageTitle}
        >
          {copy.damageTitle}
        </AnchoredHeading>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          {copy.damageIntro}
        </p>

        <div className="mt-8 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                <th className="py-4 pr-5 font-medium">{copy.headers.crop}</th>
                <th className="px-5 py-4 font-medium">{copy.headers.damage}</th>
                <th className="py-4 pl-5 font-medium">{copy.headers.signs}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {copy.damageRows.map((row) => (
                <tr key={row.crop}>
                  <th className="py-5 pr-5 align-top text-[15px] font-semibold text-foreground">
                    {row.crop}
                  </th>
                  <td className="p-5 align-top text-[14px] leading-relaxed text-muted-foreground">
                    {row.damage}
                  </td>
                  <td className="py-5 pl-5 align-top text-[14px] leading-relaxed text-muted-foreground">
                    {row.signs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          {copy.damageNote}
        </p>

        <AnchoredHeading
          anchorLabel={anchorLabel}
          className="mt-18 max-w-3xl font-display text-display-title font-bold lg:mt-24"
          id="indoors"
          slugSource={copy.indoorsTitle}
        >
          {copy.indoorsTitle}
        </AnchoredHeading>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          {copy.indoorsIntro}
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {copy.indoorsSteps.map((step) => (
            <article
              className="border-y border-border py-5 md:border-y-0 md:border-l md:py-0 md:pr-4 md:pl-5"
              key={step.title}
            >
              <h3 className="font-display text-[18px] font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpeciesBreadcrumbTrail({
  ariaLabel,
  breadcrumbs,
}: {
  ariaLabel: string;
  breadcrumbs: SpeciesBreadcrumbCrumb[];
}) {
  return (
    <nav aria-label={ariaLabel} className="sr-only">
      <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-2 gap-y-1 px-6 py-4 text-[13px] text-muted-foreground lg:px-10">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <SpeciesBreadcrumbTrailItem
              crumb={crumb}
              index={index}
              isLast={isLast}
              key={crumb.href ? `${crumb.href}:${crumb.name}` : crumb.name}
            />
          );
        })}
      </ol>
    </nav>
  );
}

function SpeciesBreadcrumbTrailItem({
  crumb,
  index,
  isLast,
}: {
  crumb: SpeciesBreadcrumbCrumb;
  index: number;
  isLast: boolean;
}) {
  return (
    <li className="inline-flex items-center gap-2">
      {index > 0 ? (
        <span aria-hidden="true" className="text-border">
          /
        </span>
      ) : null}
      {crumb.href && !isLast ? (
        <Link
          className="transition-colors hover:text-foreground"
          href={crumb.href}
        >
          {crumb.name}
        </Link>
      ) : (
        <span
          aria-current={isLast ? "page" : undefined}
          className={isLast ? "font-medium text-foreground" : undefined}
        >
          {crumb.name}
        </span>
      )}
    </li>
  );
}

async function SpeciesProfileBiology({
  blocks,
  isSnake,
  title,
}: {
  blocks: BiologyBlockItem[];
  isSnake: boolean;
  title?: string;
}) {
  if (blocks.length === 0) {
    return null;
  }

  const t = await getTranslations("profile");

  return (
    <section
      className={cn(
        "bg-surface pb-20 lg:pb-28",
        isSnake ? "pt-12 lg:pt-16" : "pt-20 lg:pt-28",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {t("biology")}
        </p>
        <AnchoredHeading
          anchorLabel={t("anchorLink")}
          className="mt-5 max-w-2xl font-display text-display-title font-bold"
          id={SPECIES_SECTION_IDS.biology}
        >
          {title ?? t("biologyTitle")}
        </AnchoredHeading>
        <div
          className={cn(
            "mt-14 grid gap-12 md:gap-10",
            biologyGridClass(blocks.length),
          )}
        >
          {blocks.map((block) => (
            <BiologyBlock
              body={block.body}
              headingId={block.id}
              key={block.title}
              title={block.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
