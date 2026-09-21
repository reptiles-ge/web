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
import { Link } from "@/i18n/navigation";
import {
  type HubClusterCard,
  isLizardSpecies,
  isSnakeSpecies,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { formatContentDate } from "@/lib/formatDate";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type BiologyBlockItem = {
  body: string;
  id: string;
  title: string;
};

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
          <p className="mt-6 text-[12px] tracking-wide text-muted-foreground">
            {t("lastUpdated")}{" "}
            <time dateTime={species.updatedAt}>
              {formatContentDate(species.updatedAt, locale)}
            </time>
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

      <SpeciesProfileRelated locale={locale} related={related} />
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
