import type { AppLocale } from "@/i18n/routing";

export type DangerousAnimalsFeature = {
  copy: Record<AppLocale, DangerousAnimalsLocaleCopy>;
  photos: Record<string, FeaturePhoto>;
  sources: readonly { name: string; url: string }[];
};

export type DangerousAnimalsLocaleCopy = {
  dek: string;
  emergency: FeatureMark[];
  keywords: string[];
  kicker: string;
  labels: {
    emergencyHeading: string;
    mapRegions: string;
    mythClaim: string;
    mythReality: string;
    noRisk: string;
    photoCredit: string;
    readNext: string;
    sourcesHeading: string;
    tableAction: string;
    tableAnimal: string;
    tableHeading: string;
    tableRisk: string;
    tableWhere: string;
    updated: string;
  };
  lead: FeatureMark[];
  metaDescription: string;
  metaTitle: string;
  sections: FeatureSection[];
  tableRows: FeatureTableRow[];
  title: string;
};

export type FeatureBlock =
  | {
      body: string;
      eyebrow: string;
      href: string;
      title: string;
      type: "resource";
    }
  | { caption: FeatureMark[]; left: string; right: string; type: "lookalikes" }
  | { caption: FeatureMark[]; photo: string; type: "figure"; wide?: boolean }
  | { caption: FeatureMark[]; speciesId: string; type: "map" }
  | { claim: FeatureMark[]; reality: FeatureMark[]; type: "myth" }
  | {
      heading: string;
      parts: FeatureMark[];
      photo?: string;
      speciesId: string;
      type: "speciesNote";
    }
  | { parts: FeatureMark[]; type: "p" }
  | { parts: FeatureMark[]; type: "pull" };

export type FeatureMark =
  | string
  | { href: string; label: string; type: "external" }
  | { href: string; label: string; type: "guide" }
  | { id: string; label: string; type: "species" };

export type FeaturePhoto = {
  alt: Record<AppLocale, string>;
  speciesId: string;
  src: string;
};

export type FeatureSection = {
  blocks: FeatureBlock[];
  eyebrow: string;
  heading: string;
  id: string;
};

export type FeatureTableRow = {
  action: string;
  href: string;
  id: string;
  speciesId?: string;
  subject: string;
  where: string;
};

const species = (id: string, label: string): FeatureMark => ({
  id,
  label,
  type: "species",
});
const guide = (href: string, label: string): FeatureMark => ({
  href,
  label,
  type: "guide",
});

export const dangerousAnimalsFeature: DangerousAnimalsFeature = {
  copy: {
    en: {
      dek: "A sourced guide to Georgia's venomous wildlife, active nests, tick bites and encounters with large mammals.",
      emergency: [
        "If a bite, sting or animal encounter creates an emergency in Georgia, call ",
        { href: "tel:112", label: "112", type: "external" },
        ". This overview is educational; use the relevant guide or contact a clinician for the specifics of your situation.",
      ],
      keywords: [
        "dangerous animals in Georgia country",
        "venomous animals in Georgia",
        "Levantine viper",
        "black widow Georgia",
        "scorpions Georgia",
        "tick bite Georgia",
      ],
      kicker: "Field guide",
      labels: {
        emergencyHeading: "In an emergency",
        mapRegions: "Regions on the map",
        mythClaim: "People say",
        mythReality: "In fact",
        noRisk: "No level assigned",
        photoCredit: "Photo",
        readNext: "Read next",
        sourcesHeading: "Sources",
        tableAction: "What to do",
        tableAnimal: "Animal or situation",
        tableHeading: "At a glance: the risk and the next step",
        tableRisk: "Risk",
        tableWhere: "Where",
        updated: "Updated",
      },
      lead: [
        "In Georgia (country), keep your distance from the ",
        species("macrovipera-lebetina", "Levantine viper"),
        ", ",
        species("vipera-transcaucasiana", "nose-horned viper"),
        ", ",
        species("latrodectus-tredecimguttatus", "Mediterranean black widow"),
        " and ",
        species("mesobuthus-eupeus", "mottled scorpion"),
        ". An active nest, attached tick or close encounter with a wild mammal calls for a different response. Avoid contact and use the relevant guide. In an emergency, call 112.",
      ],
      metaDescription:
        "Which animals can hurt you in Georgia (country)? Vipers, black widows, scorpions, wasp nests, ticks, bears and jackals, with sourced locations and guides for each encounter.",
      metaTitle: "Dangerous animals in Georgia (country): a field guide",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The ",
                species("macrovipera-lebetina", "Levantine viper"),
                " lives in dry and semi-dry parts of eastern Georgia. The ",
                species("vipera-transcaucasiana", "nose-horned viper"),
                " is associated mainly with dry, rocky places around the Lesser Caucasus. Both carry a High risk label in this atlas, and a bite requires urgent help. Neither seeks people out. Give them space and do not try to catch them. More species are in the ",
                guide("/venomous-snakes", "venomous-snakes guide"),
                ".",
              ],
              type: "p",
            },
            {
              caption: [
                "The map marks only regions where this atlas supports the presence of the ",
                species("macrovipera-lebetina", "Levantine viper"),
                ". Individual Tbilisi records do not mean frequent encounters across the city.",
              ],
              speciesId: "macrovipera-lebetina",
              type: "map",
            },
            {
              parts: [
                "The Levantine viper profile has records in Kakheti and Kvemo Kartli, as well as individual Tbilisi localities. The nose-horned viper profile names Borjomi, Gori and other specific places. These are examples, not assurances that other places are safe. Observe an unidentified snake from a distance; the ",
                guide(
                  "/snakes/shxamiani-gvelis-amocnoba",
                  "venomous-snake identification guide",
                ),
                " explains why colour, back pattern or head shape alone is unreliable.",
              ],
              type: "p",
            },
            {
              caption: [
                "The ",
                species("vipera-transcaucasiana", "nose-horned viper"),
                " and the ",
                species("coronella-austriaca", "smooth snake"),
                ". The first has a High risk label; the second is Harmless on the atlas scale. A photo comparison is no reason to inspect either animal up close.",
              ],
              left: "viper",
              right: "smoothSnake",
              type: "lookalikes",
            },
            {
              parts: [
                "Another source of confusion is the ",
                species("malpolon-insignitus", "eastern Montpellier snake"),
                ". It has rear fangs but is not a viper. Its atlas label is Moderate, separate from the Levantine viper's High category. After a snakebite, do not wait for a positive identification: call 112 and open the ",
                guide("/snakes/gvelis-nakbeni", "snakebite guide"),
                ".",
              ],
              type: "p",
            },
            {
              heading: "Rear-fanged, not a viper",
              parts: [
                "This snake of dry southeastern areas carries a Moderate risk label in the atlas. Colour or size is no reason to approach it.",
              ],
              photo: "montpellier",
              speciesId: "malpolon-insignitus",
              type: "speciesNote",
            },
            {
              body: "A separate, sourced guide for a bite by this species.",
              eyebrow: "Guide",
              href: "/snakes/giurzas-nakbeni",
              title: "If a Levantine viper bites",
              type: "resource",
            },
          ],
          eyebrow: "01 / Snakes",
          heading: "At a snake encounter, distance matters more than a guess",
          id: "snakes",
        },
        {
          blocks: [
            {
              parts: [
                "The ",
                species(
                  "latrodectus-tredecimguttatus",
                  "Mediterranean black widow",
                ),
                " is a High risk spider in this atlas. Its recorded Georgian localities include Tbilisi, Gori, Aspindza, the Shiraki Plain and the Eldari Plain. That list is not a complete range. Females often shelter in irregular webs close to the ground; bites generally follow accidental contact. Do not pick one up or reach blindly beneath objects.",
              ],
              type: "p",
            },
            {
              caption: [
                "A ",
                species(
                  "latrodectus-tredecimguttatus",
                  "Mediterranean black widow",
                ),
                " photographed in Tbilisi and published in its atlas profile.",
              ],
              photo: "karakurt",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                "The ",
                species("steatoda-paykulliana", "false black widow"),
                " may look similar, but belongs to another genus and is marked Harmless in this atlas. Dark colour alone cannot identify a spider. For a bite, open the ",
                guide("/spiders/obobis-nakbeni", "spider-bite guide"),
                "; after a Mediterranean black widow bite, call 112.",
              ],
              type: "p",
            },
            {
              heading: "Mottled scorpion",
              parts: [
                "This species has a Moderate risk label. Touching it or disturbing its shelter is a typical setting for a sting.",
              ],
              photo: "scorpion",
              speciesId: "mesobuthus-eupeus",
              type: "speciesNote",
            },
            {
              parts: [
                "The ",
                species("mesobuthus-eupeus", "mottled scorpion"),
                " and ",
                species("euscorpius-italicus", "Italian scorpion"),
                " do not share a label: the first is Moderate, the second Harmless. That does not mean the latter cannot deliver a painful sting. Clinical evidence tied to Georgian species is limited, so this page does not rank scorpions by sting severity. Do not handle one; use the ",
                guide("/scorpions/morielis-nakbeni", "scorpion-sting guide"),
                " when needed, or browse the ",
                guide("/scorpions", "scorpion atlas"),
                " for species profiles.",
              ],
              type: "p",
            },
            {
              body: "Published species, identification cautions and what their atlas risk labels mean.",
              eyebrow: "Read more",
              href: "/spiders/shxamiani-obobebi",
              title: "Venomous spiders in Georgia",
              type: "resource",
            },
          ],
          eyebrow: "02 / Spiders and scorpions",
          heading: "Venomous does not make every encounter the same",
          id: "arachnids",
        },
        {
          blocks: [
            {
              parts: [
                "The ",
                guide("/insects/krazanis-bude", "wasp-nest guide"),
                " separates a nest someone has merely noticed from an active one where people often pass. Risk depends on how close children, pets or someone with a history of severe allergy must come to it. There is no need to approach a nest simply to decide which insect built it.",
              ],
              type: "p",
            },
            {
              parts: [
                "Finding a nest is not an emergency by itself; its position and activity determine the next step.",
              ],
              type: "pull",
            },
            {
              parts: [
                "Disturbing an active nest can trigger multiple stings. If it is beside a frequently used entrance, keep children and pets away and seek professional assessment. Breathing difficulty or throat swelling after a sting is an emergency: call 112. The ",
                guide("/insects/krazanis-bude", "nest guide"),
                " covers the other circumstances in detail.",
              ],
              type: "p",
            },
            {
              body: "When it can be left undisturbed and when to seek professional assessment.",
              eyebrow: "Read next",
              href: "/insects/krazanis-bude",
              title: "A wasp nest near home",
              type: "resource",
            },
            {
              parts: [
                "A tick bite is another question. An attached tick should be removed promptly, but not every bite causes infection or warrants a call to 112. The ",
                guide("/insects/tkipis-nakbeni", "tick-bite guide"),
                " gives the exact removal steps, what to watch afterwards and when to contact a doctor. This overview does not repeat the procedure.",
              ],
              type: "p",
            },
            {
              body: "A sourced guide to removing an attached tick and watching for symptoms.",
              eyebrow: "Read next",
              href: "/insects/tkipis-nakbeni",
              title: "A tick bite",
              type: "resource",
            },
          ],
          eyebrow: "03 / Insects and ticks",
          heading: "A nest or bite needs context, not just a name",
          id: "insects",
        },
        {
          blocks: [
            {
              parts: [
                "The ",
                species("ursus-arctos", "brown bear"),
                " and ",
                species("canis-aureus", "golden jackal"),
                " both have published atlas profiles, but neither has a human venom-risk level there. Their table cells are blank rather than newly assigned. A close surprise encounter with a bear can be risky, especially around cubs or food. Do not approach or feed one, or send a dog toward it.",
              ],
              type: "p",
            },
            {
              caption: [
                "A ",
                species("ursus-arctos", "brown bear"),
                " in Borjomi-Kharagauli National Park. A photograph from one place is not a national range map.",
              ],
              photo: "bear",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                "Bears in Georgia are found mainly in mountains and forests, though the profile also names Vashlovani's semi-dry landscape. A record in an area does not mean an encounter is equally likely on every path. The ",
                guide("/mammals/datvi-shekhvedra", "bear-encounter guide"),
                " covers distance and different encounter situations.",
              ],
              type: "p",
            },
            {
              heading: "A jackal near a yard",
              parts: [
                "The photo credit names Gardabani. That is one recorded locality, not the species' complete range.",
              ],
              photo: "jackal",
              speciesId: "canis-aureus",
              type: "speciesNote",
            },
            {
              parts: [
                "The ",
                species("canis-aureus", "golden jackal"),
                " occurs in eastern and western Georgia. Its profile describes lowland habitats and the food and shelter it can find near people. Food and waste in a yard can attract it. Keep your distance and open the ",
                guide("/mammals/tura-ezoshi", "jackal-in-the-yard guide"),
                " for that situation.",
              ],
              type: "p",
            },
            {
              body: "Distance, cubs, food and dogs in the dedicated encounter guide.",
              eyebrow: "Read next",
              href: "/mammals/datvi-shekhvedra",
              title: "Meeting a bear",
              type: "resource",
            },
          ],
          eyebrow: "04 / Large mammals",
          heading: "Safety around a large animal does not fit a venom scale",
          id: "mammals",
        },
        {
          blocks: [
            {
              parts: [
                "No single trait settles an identification. The atlas profiles give a more careful answer to these three common assumptions.",
              ],
              type: "p",
            },
            {
              claim: [
                "“I can identify a venomous snake by colour or a triangular head.”",
              ],
              reality: [
                "Colour and head shape alone are unreliable. The ",
                species("coronella-austriaca", "smooth snake"),
                " can flatten its head; confusion with the ",
                species("vipera-transcaucasiana", "nose-horned viper"),
                " is possible at a distance. Keep clear and use the ",
                guide(
                  "/snakes/shxamiani-gvelis-amocnoba",
                  "identification guide",
                ),
                ".",
              ],
              type: "myth",
            },
            {
              parts: [
                "One visible trait or time of day is also a weak test for spiders and mammals.",
              ],
              type: "p",
            },
            {
              claim: ["“Every dark spider is a black widow.”"],
              reality: [
                "The ",
                species("steatoda-paykulliana", "false black widow"),
                " is a different genus. Its bite should not be equated with that of the ",
                species(
                  "latrodectus-tredecimguttatus",
                  "Mediterranean black widow",
                ),
                "; dark colour alone identifies neither.",
              ],
              type: "myth",
            },
            {
              parts: [
                "Context also matters when judging an animal's behaviour.",
              ],
              type: "p",
            },
            {
              claim: ["“A jackal seen in daylight must have rabies.”"],
              reality: [
                "The ",
                species("canis-aureus", "golden jackal"),
                " can appear by day. That alone is not a rabies diagnosis. Do not approach a wild animal; for a yard encounter, see the ",
                guide("/mammals/tura-ezoshi", "jackal guide"),
                ".",
              ],
              type: "myth",
            },
          ],
          eyebrow: "05 / Myths and facts",
          heading: "Three quick conclusions that can mislead",
          id: "myths",
        },
      ],
      tableRows: [
        {
          action: "Keep clear; call 112 after a bite",
          href: "#snakes",
          id: "gyurza",
          speciesId: "macrovipera-lebetina",
          subject: "Levantine viper",
          where: "Kakheti, Kvemo Kartli; individual Tbilisi records",
        },
        {
          action: "Keep clear; call 112 after a bite",
          href: "#snakes",
          id: "nose-horned-viper",
          speciesId: "vipera-transcaucasiana",
          subject: "Nose-horned viper",
          where: "Borjomi and Gori are recorded examples",
        },
        {
          action: "Do not handle; call 112 after a bite",
          href: "#arachnids",
          id: "karakurt",
          speciesId: "latrodectus-tredecimguttatus",
          subject: "Mediterranean black widow",
          where: "Tbilisi, Gori and Aspindza are recorded examples",
        },
        {
          action: "Do not touch; call 112 for severe symptoms",
          href: "#arachnids",
          id: "mottled-scorpion",
          speciesId: "mesobuthus-eupeus",
          subject: "Mottled scorpion",
          where: "Tbilisi; photographed in Didi Dighomi",
        },
        {
          action:
            "Avoid an active nest; seek professional assessment if needed",
          href: "/insects/krazanis-bude",
          id: "wasp-nest",
          subject: "Wasp nest",
          where: "",
        },
        {
          action: "See the guide for removal",
          href: "/insects/tkipis-nakbeni",
          id: "tick-bite",
          subject: "Tick bite",
          where: "",
        },
        {
          action: "Keep away; open the encounter guide",
          href: "#mammals",
          id: "bear",
          speciesId: "ursus-arctos",
          subject: "Brown bear",
          where: "Borjomi-Kharagauli is one recorded area",
        },
        {
          action: "Keep away; open the yard guide",
          href: "#mammals",
          id: "jackal",
          speciesId: "canis-aureus",
          subject: "Golden jackal",
          where: "Gardabani is the photo locality",
        },
      ],
      title: "Dangerous animals in Georgia (country)",
    },
    ka: {
      dek: "შხამიანი სახეობები, აქტიური ბუდე, ტკიპა და დიდი ძუძუმწოვრები — როგორ გავარჩიოთ რისკი და სად წავიკითხოთ მეტი.",
      emergency: [
        "თუ ნაკბენის, დანესტვრის ან ცხოველთან შეხვედრის შემდეგ მდგომარეობა გადაუდებელია, საქართველოში დარეკეთ ",
        { href: "tel:112", label: "112", type: "external" },
        "-ზე. ეს მიმოხილვა საგანმანათლებლოა; კონკრეტული შემთხვევის ნაბიჯებისთვის გახსენით შესაბამისი გიდი ან მიმართეთ ექიმს.",
      ],
      keywords: [
        "საშიში ცხოველები საქართველოში",
        "შხამიანი ცხოველები საქართველოში",
        "გიურზა",
        "ყარაყურთი",
        "მორიელი",
        "ტკიპის ნაკბენი",
      ],
      kicker: "საველე გზამკვლევი",
      labels: {
        emergencyHeading: "გადაუდებელ შემთხვევაში",
        mapRegions: "რეგიონები რუკაზე",
        mythClaim: "ამბობენ",
        mythReality: "სინამდვილეში",
        noRisk: "დონე არ არის მითითებული",
        photoCredit: "ფოტო",
        readNext: "წაიკითხეთ შემდეგ",
        sourcesHeading: "წყაროები",
        tableAction: "რა ვქნათ",
        tableAnimal: "ცხოველი ან შემთხვევა",
        tableHeading: "მოკლედ: სად არის რისკი და რა ვქნათ",
        tableRisk: "რისკი",
        tableWhere: "სად",
        updated: "განახლებულია",
      },
      lead: [
        "საქართველოში საყურადღებოა ",
        species("macrovipera-lebetina", "გიურზა"),
        ", ",
        species("vipera-transcaucasiana", "ცხვირრქოსანი გველგესლა"),
        ", ",
        species("latrodectus-tredecimguttatus", "ყარაყურთი"),
        " და ",
        species("mesobuthus-eupeus", "ჭრელი მორიელი"),
        ". აქტიურ ბუდეს, მიმაგრებულ ტკიპას ან ველურ ძუძუმწოვართან შეხვედრას სხვა გარემოებები ახლავს. ცხოველს ნუ შეეხებით, შეინარჩუნეთ მანძილი და შესაბამისი გიდი გახსენით. გადაუდებელ შემთხვევაში დარეკეთ 112-ზე.",
      ],
      metaDescription:
        "რომელი ცხოველები შეიძლება იყოს საშიში საქართველოში? გიურზა, ყარაყურთი, მორიელი, კრაზანის ბუდე, ტკიპა, დათვი და ტურა — რისკი, დადასტურებული ადგილები და შესაბამისი გიდები.",
      metaTitle: "საშიში ცხოველები საქართველოში: გველები, ობობები და სხვები",
      sections: [
        {
          blocks: [
            {
              parts: [
                species("macrovipera-lebetina", "გიურზა"),
                " აღმოსავლეთ საქართველოს მშრალ და ნახევრად მშრალ ადგილებში გვხვდება. ",
                species("vipera-transcaucasiana", "ცხვირრქოსანი გველგესლა"),
                " უფრო მეტად მცირე კავკასიონის მშრალ, კლდოვან ადგილებს უკავშირდება. ატლასში ორივე მაღალი რისკისაა; მათი ნაკბენისას საჭიროა გადაუდებელი დახმარება. არც ერთი გველი ადამიანს არ ეძებს. მოერიდეთ მიახლოებას და დაჭერის მცდელობას. სხვა სახეობები იხილეთ ",
                guide("/venomous-snakes", "შხამიანი გველების გიდში"),
                ".",
              ],
              type: "p",
            },
            {
              caption: [
                "რუკა აჩვენებს მხოლოდ იმ რეგიონებს, რომლებშიც ",
                species("macrovipera-lebetina", "გიურზას"),
                " გავრცელება ატლასის მონაცემებით დასტურდება. თბილისის ცალკეული ჩანაწერი მთელ ქალაქში ხშირ შეხვედრას არ ნიშნავს.",
              ],
              speciesId: "macrovipera-lebetina",
              type: "map",
            },
            {
              parts: [
                "გიურზას შესახებ ჩანაწერები კახეთსა და ქვემო ქართლში, ასევე თბილისის ცალკეულ ადგილებშია. ცხვირრქოსანი გველგესლას პროფილში დასახელებულია ბორჯომი, გორი და სხვა კონკრეტული ადგილები. ეს მაგალითებია და არა რუკის გარეთ უსაფრთხოების გარანტია. დაუდგენელ გველს შორიდან დააკვირდით; ",
                guide(
                  "/snakes/shxamiani-gvelis-amocnoba",
                  "შხამიანი გველის ამოცნობის გიდი",
                ),
                " განმარტავს, რატომ არ კმარა მხოლოდ ფერი, ზურგის ნახატი ან თავის ფორმა.",
              ],
              type: "p",
            },
            {
              caption: [
                species("vipera-transcaucasiana", "ცხვირრქოსანი გველგესლა"),
                " და ",
                species("coronella-austriaca", "სპილენძა"),
                ". პირველი მაღალი რისკის გველგესლაა, მეორე — ატლასის სკალით უვნებელი. ფოტოების შედარება ახლოდან შემოწმების საბაბი არ არის.",
              ],
              left: "viper",
              right: "smoothSnake",
              type: "lookalikes",
            },
            {
              parts: [
                "დაბნეულობას კიდევ ერთი სახეობა იწვევს: ",
                species("malpolon-insignitus", "ჩვეულებრივი ხვლიკიჭამია გველი"),
                " უკანა შხამკბილებიანია, მაგრამ გველგესლა არ არის. მისი ნიშანი საშუალო რისკია და გიურზას მაღალი რისკის კატეგორიაში არ უნდა გადავიტანოთ. თუ გველმა გიკბინათ, მის ამოცნობას ნუ დაელოდებით — დარეკეთ 112-ზე და გახსენით ",
                guide("/snakes/gvelis-nakbeni", "გველის ნაკბენის გიდი"),
                ".",
              ],
              type: "p",
            },
            {
              heading: "უკანა შხამკბილებიანი, არა გველგესლა",
              parts: [
                "სამხრეთ-აღმოსავლეთის მშრალ ადგილებში მცხოვრები ეს გველი ატლასში საშუალო რისკისაა. ფერი ან ზომა მასთან მიახლოების მიზეზი არ არის.",
              ],
              photo: "montpellier",
              speciesId: "malpolon-insignitus",
              type: "speciesNote",
            },
            {
              body: "ამ სახეობის ნაკბენის შესახებ ცალკე, წყაროებზე დამყარებული გვერდი.",
              eyebrow: "გზამკვლევი",
              href: "/snakes/giurzas-nakbeni",
              title: "თუ გიურზამ გიკბინათ",
              type: "resource",
            },
          ],
          eyebrow: "01 / გველები",
          heading: "გველთან შეხვედრისას გამოცნობაზე მნიშვნელოვანი მანძილია",
          id: "snakes",
        },
        {
          blocks: [
            {
              parts: [
                species("latrodectus-tredecimguttatus", "ყარაყურთი"),
                " ატლასში მაღალი რისკის ობობაა. მისი დადასტურებული ჩანაწერებია თბილისიდან, გორიდან, ასპინძიდან, შირაქისა და ელდარის ველებიდან. ეს ადგილების ჩამონათვალი სრული გავრცელება არ არის. მდედრი ხშირად მიწასთან ახლოს, უსწორმასწორო ქსელის თავშესაფარში იმალება; ნაკბენი ჩვეულებრივ შემთხვევით შეხებას უკავშირდება. არ აიყვანოთ და არ ეძებოთ ხელით საგნების ქვეშ.",
              ],
              type: "p",
            },
            {
              caption: [
                species("latrodectus-tredecimguttatus", "ყარაყურთი"),
                " თბილისში. ეს ფოტო ატლასის სახეობრივ პროფილშია გამოქვეყნებული.",
              ],
              photo: "karakurt",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                species("steatoda-paykulliana", "ცრუ ყარაყურთი"),
                " გარეგნობით შეიძლება ყარაყურთს აგონებდეთ, მაგრამ სხვა გვარს მიეკუთვნება და ატლასში უვნებელი ნიშნითაა. მხოლოდ მუქი ფერით სახეობის დადგენა არ შეიძლება. თუ ობობამ გიკბინათ, გახსენით ",
                guide("/spiders/obobis-nakbeni", "ობობის ნაკბენის გიდი"),
                "; ყარაყურთის ნაკბენისას დარეკეთ 112-ზე.",
              ],
              type: "p",
            },
            {
              heading: "ჭრელი მორიელი",
              parts: [
                "ეს სახეობა ატლასში საშუალო რისკისაა. ხელით შეხება და სამალავში შეწუხება ჩხვლეტის ტიპური გარემოებაა.",
              ],
              photo: "scorpion",
              speciesId: "mesobuthus-eupeus",
              type: "speciesNote",
            },
            {
              parts: [
                species("mesobuthus-eupeus", "ჭრელი მორიელი"),
                " და ",
                species("euscorpius-italicus", "იტალიური მორიელი"),
                " ერთი და იმავე რისკის ნიშნით არ არის მონიშნული: პირველი საშუალოა, მეორე — უვნებელი. ეს არც იმას ნიშნავს, რომ მეორე ჩხვლეტა ვერ ატკენს ადამიანს. საქართველოს სახეობებზე კლინიკური მონაცემები შეზღუდულია, ამიტომ ჩხვლეტის სიმძიმის სახეობრივი რეიტინგი აქ არ არსებობს. მორიელს ხელით ნუ შეეხებით; საჭიროებისას იხილეთ ",
                guide("/scorpions/morielis-nakbeni", "მორიელის ჩხვლეტის გიდი"),
                "; სახეობების გვერდები — ",
                guide("/scorpions", "მორიელების ატლასში"),
                ".",
              ],
              type: "p",
            },
            {
              body: "როგორ განვასხვავოთ გამოქვეყნებული სახეობები და რას ნიშნავს მათი რისკის ნიშანი.",
              eyebrow: "წაიკითხეთ მეტი",
              href: "/spiders/shxamiani-obobebi",
              title: "შხამიანი ობობები საქართველოში",
              type: "resource",
            },
          ],
          eyebrow: "02 / ობობები და მორიელები",
          heading: "შხამიანი არ ნიშნავს, რომ ყოველი შეხვედრა ერთნაირია",
          id: "arachnids",
        },
        {
          blocks: [
            {
              parts: [
                guide("/insects/krazanis-bude", "კრაზანის ბუდის გიდი"),
                " განასხვავებს უბრალოდ ნაპოვნ ბუდეს და აქტიურ ბუდეს იმ ადგილას, სადაც ადამიანები ხშირად გადიან. საფრთხე იმაზეა დამოკიდებული, რამდენად ახლოს უწევთ მასთან გავლა ბავშვებს, შინაურ ცხოველებს ან ადამიანს, რომელსაც მძიმე ალერგიის ისტორია აქვს. ბუდესთან მისვლა მხოლოდ იმის გასაგებად, რა სახეობის მწერია, საჭირო არ არის.",
              ],
              type: "p",
            },
            {
              parts: [
                "ბუდის აღმოჩენა თავისთავად გადაუდებელი შემთხვევა არ არის; მისი მდებარეობა და აქტიურობა განსაზღვრავს შემდეგ ნაბიჯს.",
              ],
              type: "pull",
            },
            {
              parts: [
                "აქტიური ბუდის დარღვევამ შეიძლება მრავლობითი დანესტვრა გამოიწვიოს. თუ ბუდე ხშირად გამოყენებულ შესასვლელთანაა, მოარიდეთ ბავშვები და ცხოველები და შეფასებისთვის სპეციალისტს მიმართეთ. დანესტვრის შემდეგ სუნთქვის გაძნელება ან ყელის შეშუპება გადაუდებელი ნიშანია — დარეკეთ 112-ზე. დანარჩენი გარემოებები ნაბიჯ-ნაბიჯ წერია ",
                guide("/insects/krazanis-bude", "ბუდის გიდში"),
                ".",
              ],
              type: "p",
            },
            {
              body: "როდის დატოვოთ ბუდე მშვიდად და როდის მოითხოვოთ პროფესიული შეფასება.",
              eyebrow: "წაიკითხეთ შემდეგ",
              href: "/insects/krazanis-bude",
              title: "კრაზანის ბუდე სახლთან",
              type: "resource",
            },
            {
              parts: [
                "ტკიპის ნაკბენიც ცალკე საკითხია. კანზე მიმაგრებული ტკიპა სწრაფად უნდა მოიცილოთ, მაგრამ ყოველი ნაკბენი ინფექციას არ ნიშნავს და ავტომატურად 112-ის შემთხვევა არ არის. ",
                guide("/insects/tkipis-nakbeni", "ტკიპის ნაკბენის გიდში"),
                " არის მოცილების ზუსტი წესი, რაზე დააკვირდეთ შემდეგ და როდის მიმართოთ ექიმს. ამ მოკლე მიმოხილვაში პროცედურას არ ვიმეორებთ.",
              ],
              type: "p",
            },
            {
              body: "მიმაგრებული ტკიპის მოცილება და შემდგომი დაკვირვება წყაროიანი გიდით.",
              eyebrow: "წაიკითხეთ შემდეგ",
              href: "/insects/tkipis-nakbeni",
              title: "ტკიპის ნაკბენი",
              type: "resource",
            },
          ],
          eyebrow: "03 / მწერები და ტკიპები",
          heading:
            "ბუდისა და ნაკბენის გარემოება უფრო მეტს ამბობს, ვიდრე ერთი სახელი",
          id: "insects",
        },
        {
          blocks: [
            {
              parts: [
                species("ursus-arctos", "მურა დათვი"),
                " და ",
                species("canis-aureus", "ტურა"),
                " გამოქვეყნებული ატლასის სახეობებია, მაგრამ პროფილებზე ადამიანისთვის შხამის რისკის დონე არ აქვთ. მათი გვერდით აქ ცარიელი უჯრაა და არა ახალი შეფასება. დათვთან სირთულე შეიძლება მოულოდნელი ახლო შეხვედრისას გაჩნდეს, განსაკუთრებით ბელებთან ან საკვებთან. დათვს ნუ მიუახლოვდებით, ნუ აჭმევთ და ძაღლს მისკენ ნუ გაუშვებთ.",
              ],
              type: "p",
            },
            {
              caption: [
                species("ursus-arctos", "მურა დათვი"),
                " ბორჯომ-ხარაგაულის ეროვნულ პარკში. ერთი ადგილის ფოტო მთელი ქვეყნის გავრცელებას არ ასახავს.",
              ],
              photo: "bear",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                "დათვი საქართველოში უმეტესად მთებსა და ტყეებში გვხვდება, თუმცა პროფილი ვაშლოვანის ნახევრად მშრალ მიდამოებსაც ასახელებს. სადმე მისი ყოფნა არ ნიშნავს, რომ იქ ყველა ბილიკზე ერთნაირად მოსალოდნელია შეხვედრა. ",
                guide("/mammals/datvi-shekhvedra", "დათვთან შეხვედრის გიდი"),
                " აღწერს, როგორ შეინარჩუნოთ მანძილი და როგორ მოიქცეთ სხვადასხვა შეხვედრისას.",
              ],
              type: "p",
            },
            {
              heading: "ტურა ეზოსთან",
              parts: [
                "ფოტოს კრედიტში გარდაბანია მითითებული. ეს ერთი დადასტურებული ადგილია და არა სახეობის სრული გავრცელება.",
              ],
              photo: "jackal",
              speciesId: "canis-aureus",
              type: "speciesNote",
            },
            {
              parts: [
                species("canis-aureus", "ტურა"),
                " აღმოსავლეთ და დასავლეთ საქართველოშიც ცხოვრობს; მისი პროფილი დაბლობებსა და ადამიანთან ახლოს საკვებისა და სამალავის პოვნას აღწერს. ეზოში საკვები და ნარჩენები მას შეიძლება იზიდავდეს. შეინარჩუნეთ მანძილი და კონკრეტული ეზოს ვითარებისთვის გახსენით ",
                guide("/mammals/tura-ezoshi", "ტურის ეზოში გამოჩენის გიდი"),
                ".",
              ],
              type: "p",
            },
            {
              body: "გზამკვლევი მანძილის, ბელების, საკვებისა და ძაღლის საკითხებზე.",
              eyebrow: "წაიკითხეთ შემდეგ",
              href: "/mammals/datvi-shekhvedra",
              title: "დათვთან შეხვედრა",
              type: "resource",
            },
          ],
          eyebrow: "04 / დიდი ძუძუმწოვრები",
          heading: "დიდ ცხოველთან უსაფრთხოება შხამის სკალაზე არ ეტევა",
          id: "mammals",
        },
        {
          blocks: [
            {
              parts: [
                "ერთ ნიშანს მთელი სახეობის ამოსაცნობად ვერ გამოვიყენებთ. ატლასის პროფილები ამ სამ გავრცელებულ ვარაუდს უფრო ზუსტად პასუხობს.",
              ],
              type: "p",
            },
            {
              claim: ["„შხამიან გველს ფერით ან სამკუთხა თავით ამოვიცნობ.“"],
              reality: [
                "ფერი და თავის ფორმა ცალკე სანდო არ არის. ",
                species("coronella-austriaca", "სპილენძა"),
                " ზოგჯერ თავს აბრტყელებს; ",
                species("vipera-transcaucasiana", "ცხვირრქოსან გველგესლასთან"),
                " აღრევას შორიდანაც შეუძლია შეცდომაში შეგიყვანოთ. შეინარჩუნეთ მანძილი და იხილეთ ",
                guide("/snakes/shxamiani-gvelis-amocnoba", "ამოცნობის გიდი"),
                ".",
              ],
              type: "myth",
            },
            {
              parts: [
                "ობობებსა და ძუძუმწოვრებზეც ერთი გარეგნული ან დროითი ნიშანი საკმარისი არ არის.",
              ],
              type: "p",
            },
            {
              claim: ["„ყველა მუქი ობობა ყარაყურთია.“"],
              reality: [
                species("steatoda-paykulliana", "ცრუ ყარაყურთი"),
                " სხვა გვარის ობობაა. მისი და ",
                species("latrodectus-tredecimguttatus", "ყარაყურთის"),
                " ნაკბენები ერთნაირად არ უნდა შეფასდეს; მხოლოდ მუქი ფერი არც ერთის დადგენას არ ჰყოფნის.",
              ],
              type: "myth",
            },
            {
              parts: ["ცხოველის ქცევის შეფასებისას გარემოებაც მნიშვნელოვანია."],
              type: "p",
            },
            {
              claim: ["„დღისით ნანახ ტურას აუცილებლად ცოფი აქვს.“"],
              reality: [
                species("canis-aureus", "ტურა"),
                " დღისითაც შეიძლება გამოჩნდეს. ეს თავისთავად ცოფის დიაგნოზი არ არის. გარეულ ცხოველს არ მიუახლოვდეთ; ეზოს შემთხვევისთვის იხილეთ ",
                guide("/mammals/tura-ezoshi", "ტურის გიდი"),
                ".",
              ],
              type: "myth",
            },
          ],
          eyebrow: "05 / ამბობენ და სინამდვილეში",
          heading:
            "სამი სწრაფი დასკვნა, რომლებმაც შეიძლება შეცდომაში შეგვიყვანოს",
          id: "myths",
        },
      ],
      tableRows: [
        {
          action: "მოერიდეთ; ნაკბენისას 112",
          href: "#snakes",
          id: "gyurza",
          speciesId: "macrovipera-lebetina",
          subject: "გიურზა",
          where: "კახეთი, ქვემო ქართლი; თბილისის ცალკეული ჩანაწერები",
        },
        {
          action: "მოერიდეთ; ნაკბენისას 112",
          href: "#snakes",
          id: "nose-horned-viper",
          speciesId: "vipera-transcaucasiana",
          subject: "ცხვირრქოსანი გველგესლა",
          where: "ბორჯომი, გორი — დადასტურებული ადგილების მაგალითები",
        },
        {
          action: "არ აიყვანოთ; ნაკბენისას 112",
          href: "#arachnids",
          id: "karakurt",
          speciesId: "latrodectus-tredecimguttatus",
          subject: "ყარაყურთი",
          where: "თბილისი, გორი, ასპინძა — ჩანაწერების მაგალითები",
        },
        {
          action: "არ შეეხოთ; მძიმე ნიშნებისას 112",
          href: "#arachnids",
          id: "mottled-scorpion",
          speciesId: "mesobuthus-eupeus",
          subject: "ჭრელი მორიელი",
          where: "თბილისი; ფოტო დიდი დიღმიდან",
        },
        {
          action: "აქტიურ ბუდეს მოერიდეთ; საჭიროებისას სპეციალისტი",
          href: "/insects/krazanis-bude",
          id: "wasp-nest",
          subject: "კრაზანის ბუდე",
          where: "",
        },
        {
          action: "მოცილების წესს გიდში გაეცანით",
          href: "/insects/tkipis-nakbeni",
          id: "tick-bite",
          subject: "ტკიპის ნაკბენი",
          where: "",
        },
        {
          action: "არ მიუახლოვდეთ; გახსენით შეხვედრის გიდი",
          href: "#mammals",
          id: "bear",
          speciesId: "ursus-arctos",
          subject: "მურა დათვი",
          where: "ბორჯომ-ხარაგაული — ერთ-ერთი დადასტურებული ადგილი",
        },
        {
          action: "არ მიუახლოვდეთ; გახსენით ეზოს გიდი",
          href: "#mammals",
          id: "jackal",
          speciesId: "canis-aureus",
          subject: "ტურა",
          where: "გარდაბანი — ფოტოს ადგილი",
        },
      ],
      title: "საშიში ცხოველები საქართველოში",
    },
    ru: {
      dek: "Проверенные сведения о ядовитых животных Грузии, активных гнёздах, укусах клещей и встречах с крупными млекопитающими.",
      emergency: [
        "Если после укуса, ужаления или встречи с животным возникла экстренная ситуация, в Грузии звоните ",
        { href: "tel:112", label: "112", type: "external" },
        ". Это образовательный обзор; подробности конкретного случая ищите в соответствующем руководстве или обсудите с врачом.",
      ],
      keywords: [
        "опасные животные в Грузии",
        "ядовитые животные в Грузии",
        "гюрза",
        "каракурт",
        "скорпионы Грузии",
        "укус клеща",
      ],
      kicker: "Полевой путеводитель",
      labels: {
        emergencyHeading: "В экстренной ситуации",
        mapRegions: "Регионы на карте",
        mythClaim: "Говорят",
        mythReality: "На самом деле",
        noRisk: "Уровень не указан",
        photoCredit: "Фото",
        readNext: "Читайте дальше",
        sourcesHeading: "Источники",
        tableAction: "Что делать",
        tableAnimal: "Животное или ситуация",
        tableHeading: "Кратко: риск и следующий шаг",
        tableRisk: "Риск",
        tableWhere: "Где",
        updated: "Обновлено",
      },
      lead: [
        "В Грузии держитесь подальше от таких животных, как ",
        species("macrovipera-lebetina", "гюрза"),
        ", ",
        species("vipera-transcaucasiana", "носатая гадюка"),
        ", ",
        species("latrodectus-tredecimguttatus", "каракурт"),
        " и ",
        species("mesobuthus-eupeus", "пёстрый скорпион"),
        ". Активное гнездо, присосавшийся клещ или близкая встреча с диким млекопитающим требуют другого подхода. Не трогайте животное, сохраняйте дистанцию и откройте нужное руководство. В экстренной ситуации звоните 112.",
      ],
      metaDescription:
        "Какие животные могут быть опасны в Грузии? Гюрза, каракурт, скорпионы, осиные гнёзда, клещи, медведь и шакал: подтверждённые места и руководства по встречам.",
      metaTitle: "Опасные животные в Грузии: полевой путеводитель",
      sections: [
        {
          blocks: [
            {
              parts: [
                species("macrovipera-lebetina", "Гюрза"),
                " встречается в сухих и полусухих районах восточной Грузии. ",
                species("vipera-transcaucasiana", "Носатая гадюка"),
                " связана главным образом с сухими каменистыми местами Малого Кавказа. Обе помечены в атласе как виды высокого риска; после укуса нужна экстренная помощь. Они не ищут встречи с человеком. Оставьте им пространство и не пытайтесь поймать. Другие виды собраны в ",
                guide("/venomous-snakes", "руководстве по ядовитым змеям"),
                ".",
              ],
              type: "p",
            },
            {
              caption: [
                "На карте отмечены только регионы, где атлас подтверждает присутствие ",
                species("macrovipera-lebetina", "гюрзы"),
                ". Отдельные находки в Тбилиси не означают частых встреч по всему городу.",
              ],
              speciesId: "macrovipera-lebetina",
              type: "map",
            },
            {
              parts: [
                "Профиль гюрзы содержит находки в Кахетии и Квемо-Картли, а также в отдельных местах Тбилиси. Профиль носатой гадюки называет Боржоми, Гори и другие конкретные места. Это примеры, а не обещание безопасности за их пределами. Наблюдайте неизвестную змею издалека: ",
                guide(
                  "/snakes/shxamiani-gvelis-amocnoba",
                  "руководство по распознаванию ядовитых змей",
                ),
                " объясняет, почему одного цвета, рисунка спины или формы головы недостаточно.",
              ],
              type: "p",
            },
            {
              caption: [
                species("vipera-transcaucasiana", "Носатая гадюка"),
                " и ",
                species("coronella-austriaca", "медянка"),
                ". Первая имеет в атласе высокий уровень риска, вторая отмечена как безвредная. Сравнение фотографий не повод подходить к ним вплотную.",
              ],
              left: "viper",
              right: "smoothSnake",
              type: "lookalikes",
            },
            {
              parts: [
                "Путаницу вызывает и ",
                species("malpolon-insignitus", "восточная ящеричная змея"),
                ". У неё задние ядовитые зубы, но она не гадюка. В атласе у неё средний уровень риска, отдельный от высокого уровня гюрзы. После укуса змеи не ждите точного определения вида: звоните 112 и откройте ",
                guide("/snakes/gvelis-nakbeni", "руководство по укусу змеи"),
                ".",
              ],
              type: "p",
            },
            {
              heading: "Задние ядовитые зубы, но не гадюка",
              parts: [
                "Этот вид сухих юго-восточных районов имеет в атласе средний уровень риска. Цвет и размер не повод подходить к нему.",
              ],
              photo: "montpellier",
              speciesId: "malpolon-insignitus",
              type: "speciesNote",
            },
            {
              body: "Отдельная страница об укусе этого вида, основанная на источниках.",
              eyebrow: "Руководство",
              href: "/snakes/giurzas-nakbeni",
              title: "Если укусила гюрза",
              type: "resource",
            },
          ],
          eyebrow: "01 / Змеи",
          heading: "При встрече со змеёй дистанция важнее догадки",
          id: "snakes",
        },
        {
          blocks: [
            {
              parts: [
                species("latrodectus-tredecimguttatus", "Каракурт"),
                " — паук высокого риска по шкале атласа. Его подтверждённые находки известны из Тбилиси, Гори, Аспиндзы, Ширакской и Эльдарской равнин. Это не полный ареал. Самка часто скрывается в убежище у неровной паутины близко к земле; укусы обычно связаны со случайным контактом. Не берите паука в руки и не шарьте рукой под предметами.",
              ],
              type: "p",
            },
            {
              caption: [
                species("latrodectus-tredecimguttatus", "Каракурт"),
                " в Тбилиси. Снимок опубликован в профиле вида.",
              ],
              photo: "karakurt",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                species("steatoda-paykulliana", "Ложный каракурт"),
                " может выглядеть похоже, но относится к другому роду и помечен в атласе как безвредный. Один тёмный цвет не определяет вид. После укуса откройте ",
                guide(
                  "/spiders/obobis-nakbeni",
                  "руководство по укусам пауков",
                ),
                "; после укуса каракурта звоните 112.",
              ],
              type: "p",
            },
            {
              heading: "Пёстрый скорпион",
              parts: [
                "У этого вида в атласе средний уровень риска. Типичная ситуация ужаления — прикосновение или беспокойство в укрытии.",
              ],
              photo: "scorpion",
              speciesId: "mesobuthus-eupeus",
              type: "speciesNote",
            },
            {
              parts: [
                species("mesobuthus-eupeus", "Пёстрый скорпион"),
                " и ",
                species("euscorpius-italicus", "итальянский скорпион"),
                " имеют разные метки: первый — средний уровень, второй — безвредный. Это не означает, что ужаление второго не бывает болезненным. Клинических данных по видам из Грузии мало, поэтому ранжировать скорпионов по тяжести ужаления здесь нельзя. Не берите их в руки; при необходимости откройте ",
                guide(
                  "/scorpions/morielis-nakbeni",
                  "руководство по ужалению скорпиона",
                ),
                "; профили видов есть в ",
                guide("/scorpions", "атласе скорпионов"),
                ".",
              ],
              type: "p",
            },
            {
              body: "Опубликованные виды, трудности распознавания и значение меток риска.",
              eyebrow: "Подробнее",
              href: "/spiders/shxamiani-obobebi",
              title: "Ядовитые пауки Грузии",
              type: "resource",
            },
          ],
          eyebrow: "02 / Пауки и скорпионы",
          heading: "Наличие яда не делает все встречи одинаковыми",
          id: "arachnids",
        },
        {
          blocks: [
            {
              parts: [
                guide(
                  "/insects/krazanis-bude",
                  "Руководство по осиным гнёздам",
                ),
                " различает просто обнаруженное гнездо и активное гнездо там, где часто проходят люди. Риск зависит от близости детей, домашних животных и людей с тяжёлой аллергией в анамнезе. Нет необходимости приближаться к гнезду только ради определения вида насекомого.",
              ],
              type: "p",
            },
            {
              parts: [
                "Само обнаружение гнезда не является чрезвычайной ситуацией: следующий шаг зависит от его расположения и активности.",
              ],
              type: "pull",
            },
            {
              parts: [
                "Если потревожить активное гнездо, возможны множественные ужаления. Когда оно находится у часто используемого входа, не подпускайте детей и животных и обратитесь к специалисту для оценки. Затруднённое дыхание или отёк горла после ужаления — повод срочно звонить 112. Другие случаи подробнее разобраны в ",
                guide("/insects/krazanis-bude", "руководстве по гнезду"),
                ".",
              ],
              type: "p",
            },
            {
              body: "Когда оставить его в покое, а когда нужна оценка специалиста.",
              eyebrow: "Читайте дальше",
              href: "/insects/krazanis-bude",
              title: "Осиное гнездо возле дома",
              type: "resource",
            },
            {
              parts: [
                "Укус клеща — отдельный вопрос. Присосавшегося клеща следует удалить как можно скорее, но не каждый укус вызывает инфекцию или требует звонка в 112. ",
                guide("/insects/tkipis-nakbeni", "Руководство по укусу клеща"),
                " описывает точный порядок удаления, признаки для наблюдения и поводы обратиться к врачу. Здесь мы не повторяем эту процедуру.",
              ],
              type: "p",
            },
            {
              body: "Руководство с источниками: удаление клеща и наблюдение за симптомами.",
              eyebrow: "Читайте дальше",
              href: "/insects/tkipis-nakbeni",
              title: "Укус клеща",
              type: "resource",
            },
          ],
          eyebrow: "03 / Насекомые и клещи",
          heading: "Для гнезда и укуса важны обстоятельства",
          id: "insects",
        },
        {
          blocks: [
            {
              parts: [
                species("ursus-arctos", "Бурый медведь"),
                " и ",
                species("canis-aureus", "золотой шакал"),
                " имеют опубликованные профили, но уровень риска от яда для человека там не указан. Ячейки таблицы поэтому пусты: мы не присваиваем им новую оценку. Близкая неожиданная встреча с медведем может быть опасна, особенно рядом с медвежатами или пищей. Не подходите, не кормите и не направляйте к нему собаку.",
              ],
              type: "p",
            },
            {
              caption: [
                species("ursus-arctos", "Бурый медведь"),
                " в национальном парке Боржоми-Харагаули. Фотография из одного места не показывает ареал по всей стране.",
              ],
              photo: "bear",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                "В Грузии медведи встречаются преимущественно в горах и лесах, хотя профиль называет также полусухие районы Вашловани. Запись о присутствии в районе не означает одинаковой вероятности встречи на каждой тропе. ",
                guide(
                  "/mammals/datvi-shekhvedra",
                  "Руководство по встрече с медведем",
                ),
                " посвящено дистанции и разным обстоятельствам встречи.",
              ],
              type: "p",
            },
            {
              heading: "Шакал у двора",
              parts: [
                "В подписи к снимку указано Гардабани. Это одна зарегистрированная точка, а не полный ареал вида.",
              ],
              photo: "jackal",
              speciesId: "canis-aureus",
              type: "speciesNote",
            },
            {
              parts: [
                species("canis-aureus", "Золотой шакал"),
                " обитает и на востоке, и на западе Грузии. В его профиле описаны низменности и возможность находить пищу и укрытие рядом с людьми. Еда и отходы во дворе могут его привлекать. Сохраняйте дистанцию; для этой ситуации откройте ",
                guide("/mammals/tura-ezoshi", "руководство о шакале во дворе"),
                ".",
              ],
              type: "p",
            },
            {
              body: "Дистанция, медвежата, пища и собаки в отдельном руководстве.",
              eyebrow: "Читайте дальше",
              href: "/mammals/datvi-shekhvedra",
              title: "Встреча с медведем",
              type: "resource",
            },
          ],
          eyebrow: "04 / Крупные млекопитающие",
          heading: "Безопасность рядом с крупным зверем не измерить шкалой яда",
          id: "mammals",
        },
        {
          blocks: [
            {
              parts: [
                "Один признак не определяет вид. Профили атласа позволяют точнее ответить на эти три распространённых предположения.",
              ],
              type: "p",
            },
            {
              claim: [
                "«Я узнаю ядовитую змею по цвету или треугольной голове».",
              ],
              reality: [
                "Цвет и форма головы сами по себе ненадёжны. ",
                species("coronella-austriaca", "Медянка"),
                " может уплощать голову; издали её можно спутать с ",
                species("vipera-transcaucasiana", "носатой гадюкой"),
                ". Держитесь подальше и обратитесь к ",
                guide(
                  "/snakes/shxamiani-gvelis-amocnoba",
                  "руководству по распознаванию",
                ),
                ".",
              ],
              type: "myth",
            },
            {
              parts: [
                "Для пауков и млекопитающих одного внешнего признака или времени суток тоже недостаточно.",
              ],
              type: "p",
            },
            {
              claim: ["«Каждый тёмный паук — каракурт»."],
              reality: [
                species("steatoda-paykulliana", "Ложный каракурт"),
                " относится к другому роду. Его укус не следует приравнивать к укусу ",
                species("latrodectus-tredecimguttatus", "каракурта"),
                "; один тёмный цвет не определяет ни один из видов.",
              ],
              type: "myth",
            },
            {
              parts: ["При оценке поведения животного важны и обстоятельства."],
              type: "p",
            },
            {
              claim: ["«Шакал днём обязательно болен бешенством»."],
              reality: [
                species("canis-aureus", "Золотой шакал"),
                " может появиться днём. По одному этому признаку нельзя поставить диагноз. Не подходите к дикому животному; для встречи у дома есть ",
                guide("/mammals/tura-ezoshi", "руководство о шакале"),
                ".",
              ],
              type: "myth",
            },
          ],
          eyebrow: "05 / Мифы и факты",
          heading: "Три быстрых вывода, которые могут обмануть",
          id: "myths",
        },
      ],
      tableRows: [
        {
          action: "Держитесь подальше; при укусе звоните 112",
          href: "#snakes",
          id: "gyurza",
          speciesId: "macrovipera-lebetina",
          subject: "Гюрза",
          where: "Кахетия, Квемо-Картли; отдельные находки в Тбилиси",
        },
        {
          action: "Держитесь подальше; при укусе звоните 112",
          href: "#snakes",
          id: "nose-horned-viper",
          speciesId: "vipera-transcaucasiana",
          subject: "Носатая гадюка",
          where: "Боржоми и Гори — примеры подтверждённых мест",
        },
        {
          action: "Не берите в руки; при укусе звоните 112",
          href: "#arachnids",
          id: "karakurt",
          speciesId: "latrodectus-tredecimguttatus",
          subject: "Каракурт",
          where: "Тбилиси, Гори и Аспиндза — примеры находок",
        },
        {
          action: "Не трогайте; при тяжёлых симптомах звоните 112",
          href: "#arachnids",
          id: "mottled-scorpion",
          speciesId: "mesobuthus-eupeus",
          subject: "Пёстрый скорпион",
          where: "Тбилиси; фото из Диди Дигоми",
        },
        {
          action:
            "Не приближайтесь к активному гнезду; при необходимости пригласите специалиста",
          href: "/insects/krazanis-bude",
          id: "wasp-nest",
          subject: "Осиное гнездо",
          where: "",
        },
        {
          action: "Порядок удаления есть в руководстве",
          href: "/insects/tkipis-nakbeni",
          id: "tick-bite",
          subject: "Укус клеща",
          where: "",
        },
        {
          action: "Не приближайтесь; откройте руководство по встрече",
          href: "#mammals",
          id: "bear",
          speciesId: "ursus-arctos",
          subject: "Бурый медведь",
          where: "Боржоми-Харагаули — один из подтверждённых районов",
        },
        {
          action: "Не приближайтесь; откройте руководство для двора",
          href: "#mammals",
          id: "jackal",
          speciesId: "canis-aureus",
          subject: "Золотой шакал",
          where: "Гардабани — место съёмки",
        },
      ],
      title: "Опасные животные в Грузии",
    },
    tr: {
      dek: "Gürcistan'ın zehirli hayvanları, etkin yuvalar, kene ısırıkları ve büyük memelilerle karşılaşmalar için kaynaklı bir rehber.",
      emergency: [
        "Isırık, sokma veya hayvanla karşılaşma sonrası acil bir durum varsa Gürcistan'da ",
        { href: "tel:112", label: "112", type: "external" },
        "'yi arayın. Bu yazı eğiticidir; durumunuza özgü adımlar için ilgili rehberi açın veya doktora danışın.",
      ],
      keywords: [
        "Gürcistan'daki tehlikeli hayvanlar",
        "Gürcistan zehirli hayvanlar",
        "Levant engereği",
        "karakurt Gürcistan",
        "akrep Gürcistan",
        "kene ısırığı",
      ],
      kicker: "Saha rehberi",
      labels: {
        emergencyHeading: "Acil durumda",
        mapRegions: "Haritadaki bölgeler",
        mythClaim: "Denir ki",
        mythReality: "Aslında",
        noRisk: "Düzey belirtilmemiş",
        photoCredit: "Fotoğraf",
        readNext: "Sıradaki okuma",
        sourcesHeading: "Kaynaklar",
        tableAction: "Ne yapmalı",
        tableAnimal: "Hayvan veya durum",
        tableHeading: "Kısaca: risk ve sonraki adım",
        tableRisk: "Risk",
        tableWhere: "Nerede",
        updated: "Güncellendi",
      },
      lead: [
        "Gürcistan'da ",
        species("macrovipera-lebetina", "Levant engereği"),
        ", ",
        species("vipera-transcaucasiana", "boynuzlu engerek"),
        ", ",
        species("latrodectus-tredecimguttatus", "karakurt"),
        " ve ",
        species("mesobuthus-eupeus", "alacalı akrep"),
        " gibi hayvanlardan uzak durun. Etkin yuva, tutunmuş kene veya yabani memeliyle yakın karşılaşma farklı bir yaklaşım gerektirir. Hayvana dokunmayın, mesafenizi koruyun ve ilgili rehberi açın. Acil durumda 112'yi arayın.",
      ],
      metaDescription:
        "Gürcistan'da hangi hayvanlar zarar verebilir? Engerekler, karakurt, akrepler, yaban arısı yuvaları, keneler, ayılar ve çakallar için kayıtlı yerler ve ilgili rehberler.",
      metaTitle: "Gürcistan'daki tehlikeli hayvanlar: saha rehberi",
      sections: [
        {
          blocks: [
            {
              parts: [
                species("macrovipera-lebetina", "Levant engereği"),
                " doğu Gürcistan'ın kuru ve yarı kurak alanlarında görülür. ",
                species("vipera-transcaucasiana", "Boynuzlu engerek"),
                " daha çok Küçük Kafkasya çevresindeki kuru, kayalık yerlere bağlıdır. Atlas ikisini de Yüksek risk olarak işaretler; ısırıkta acil yardım gerekir. Bu yılanlar insan aramaz. Mesafe bırakın ve yakalamaya çalışmayın. Başka türler ",
                guide("/venomous-snakes", "zehirli yılanlar rehberinde"),
                " yer alır.",
              ],
              type: "p",
            },
            {
              caption: [
                "Harita yalnızca atlasın ",
                species("macrovipera-lebetina", "Levant engereği"),
                " varlığını desteklediği bölgeleri gösterir. Tiflis'teki tekil kayıtlar, bütün şehirde sık karşılaşıldığı anlamına gelmez.",
              ],
              speciesId: "macrovipera-lebetina",
              type: "map",
            },
            {
              parts: [
                "Levant engereği profilinde Kaheti ve Kvemo Kartli ile Tiflis'in belirli noktalarından kayıtlar vardır. Boynuzlu engerek profili Borjomi, Gori ve başka belirli yerleri sayar. Bunlar örnektir; diğer yerlerin güvenli olduğuna dair bir garanti değildir. Tanımadığınız bir yılanı uzaktan gözleyin. ",
                guide(
                  "/snakes/shxamiani-gvelis-amocnoba",
                  "zehirli yılanları tanıma rehberi",
                ),
                " rengin, sırt deseninin veya baş biçiminin tek başına neden güvenilir olmadığını anlatır.",
              ],
              type: "p",
            },
            {
              caption: [
                species("vipera-transcaucasiana", "Boynuzlu engerek"),
                " ve ",
                species("coronella-austriaca", "Avusturya yılanı"),
                ". İlki Yüksek riskli, ikincisi atlas ölçeğinde Zararsızdır. Fotoğrafları karşılaştırmak hayvana yakından bakmak için gerekçe değildir.",
              ],
              left: "viper",
              right: "smoothSnake",
              type: "lookalikes",
            },
            {
              parts: [
                "Bir başka karışıklık kaynağı ",
                species("malpolon-insignitus", "Doğu Montpellier yılanı"),
                "dır. Arka zehir dişlidir fakat engerek değildir. Atlas etiketi Orta düzeydir; Levant engereğinin Yüksek düzeyinden ayrıdır. Yılan ısırığından sonra kesin teşhisi beklemeyin: 112'yi arayın ve ",
                guide("/snakes/gvelis-nakbeni", "yılan ısırığı rehberini"),
                " açın.",
              ],
              type: "p",
            },
            {
              heading: "Arka zehir dişli, engerek değil",
              parts: [
                "Kuru güneydoğu alanlarındaki bu tür atlasın Orta risk grubundadır. Rengi veya boyutu ona yaklaşmak için gerekçe değildir.",
              ],
              photo: "montpellier",
              speciesId: "malpolon-insignitus",
              type: "speciesNote",
            },
            {
              body: "Bu türün ısırığına ilişkin, kaynaklara dayalı ayrı rehber.",
              eyebrow: "Rehber",
              href: "/snakes/giurzas-nakbeni",
              title: "Levant engereği ısırırsa",
              type: "resource",
            },
          ],
          eyebrow: "01 / Yılanlar",
          heading: "Yılanla karşılaşınca tahminden çok mesafe önemlidir",
          id: "snakes",
        },
        {
          blocks: [
            {
              parts: [
                species("latrodectus-tredecimguttatus", "Karakurt"),
                " bu atlastaki Yüksek riskli örümcektir. Gürcistan'da Tiflis, Gori, Aspindza, Şiraki Ovası ve Eldari Ovası'ndan doğrulanmış kayıtları vardır. Bu liste tam dağılım değildir. Dişi genellikle yere yakın düzensiz bir ağın sığınağında saklanır; ısırık çoğunlukla rastlantısal temasla olur. Elle almayın, nesnelerin altına körlemesine el uzatmayın.",
              ],
              type: "p",
            },
            {
              caption: [
                "Tiflis'te fotoğraflanan ",
                species("latrodectus-tredecimguttatus", "karakurt"),
                ". Görsel, türün atlas profilinde yayımlanmıştır.",
              ],
              photo: "karakurt",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                species("steatoda-paykulliana", "Yalancı karakurt"),
                " benzer görünebilir, fakat başka bir cinse aittir ve atlasta Zararsız olarak işaretlidir. Sadece koyu renk örümceği tanımlamaz. Isırıkta ",
                guide("/spiders/obobis-nakbeni", "örümcek ısırığı rehberini"),
                " açın; karakurt ısırığında 112'yi arayın.",
              ],
              type: "p",
            },
            {
              heading: "Alacalı akrep",
              parts: [
                "Bu türün atlas etiketi Orta düzeydir. Akrebe dokunmak veya sığınağında rahatsız etmek tipik sokma durumudur.",
              ],
              photo: "scorpion",
              speciesId: "mesobuthus-eupeus",
              type: "speciesNote",
            },
            {
              parts: [
                species("mesobuthus-eupeus", "Alacalı akrep"),
                " ile ",
                species("euscorpius-italicus", "İtalyan akrebi"),
                " aynı etiketi taşımaz: ilki Orta, ikincisi Zararsızdır. Bu, ikincisinin sokmasının acı vermeyeceği anlamına gelmez. Gürcistan'daki türlere bağlanan klinik kanıt sınırlıdır; bu yüzden burada sokma şiddeti sıralaması yapılmıyor. Elle tutmayın; gerektiğinde ",
                guide("/scorpions/morielis-nakbeni", "akrep sokması rehberini"),
                " kullanın; tür profilleri için ",
                guide("/scorpions", "akrep atlasına"),
                " bakın.",
              ],
              type: "p",
            },
            {
              body: "Yayımlanmış türler, tanıma güçlükleri ve atlas risk etiketleri.",
              eyebrow: "Ayrıntılar",
              href: "/spiders/shxamiani-obobebi",
              title: "Gürcistan'daki zehirli örümcekler",
              type: "resource",
            },
          ],
          eyebrow: "02 / Örümcekler ve akrepler",
          heading: "Zehirli olmak her karşılaşmayı aynı yapmaz",
          id: "arachnids",
        },
        {
          blocks: [
            {
              parts: [
                guide("/insects/krazanis-bude", "Yaban arısı yuvası rehberi"),
                " yalnızca fark edilen bir yuva ile insanların sık geçtiği yerdeki etkin yuvayı ayırır. Risk, çocukların, evcil hayvanların veya ağır alerji geçmişi olan birinin ne kadar yaklaşmak zorunda kaldığına bağlıdır. Böceğin türünü anlamak için yuvaya yaklaşmaya gerek yoktur.",
              ],
              type: "p",
            },
            {
              parts: [
                "Bir yuva bulmak tek başına acil durum değildir; sonraki adımı konumu ve etkinliği belirler.",
              ],
              type: "pull",
            },
            {
              parts: [
                "Etkin bir yuvayı rahatsız etmek çoklu sokmalara yol açabilir. Sık kullanılan bir girişin yanındaysa çocukları ve hayvanları uzak tutun, değerlendirme için uzmana başvurun. Sokmadan sonra nefes darlığı veya boğaz şişmesi acildir: 112'yi arayın. Diğer durumlar ",
                guide("/insects/krazanis-bude", "yuva rehberinde"),
                " ayrıntılıdır.",
              ],
              type: "p",
            },
            {
              body: "Ne zaman rahat bırakılabilir, ne zaman uzman değerlendirmesi gerekir?",
              eyebrow: "Sıradaki okuma",
              href: "/insects/krazanis-bude",
              title: "Evin yakınında yaban arısı yuvası",
              type: "resource",
            },
            {
              parts: [
                "Kene ısırığı ayrı bir konudur. Deriye tutunmuş kene hızla çıkarılmalıdır; ancak her ısırık enfeksiyon demek değildir ve otomatik olarak 112'yi gerektirmez. ",
                guide("/insects/tkipis-nakbeni", "Kene ısırığı rehberi"),
                " çıkarma adımlarını, sonrasında izlenecek belirtileri ve doktora başvurma durumlarını açıklar. Burada bu işlemi tekrarlamıyoruz.",
              ],
              type: "p",
            },
            {
              body: "Tutunmuş keneyi çıkarma ve belirtileri izleme üzerine kaynaklı rehber.",
              eyebrow: "Sıradaki okuma",
              href: "/insects/tkipis-nakbeni",
              title: "Kene ısırığı",
              type: "resource",
            },
          ],
          eyebrow: "03 / Böcekler ve keneler",
          heading: "Yuvada ve ısırıkta bağlam, isimden daha çok şey söyler",
          id: "insects",
        },
        {
          blocks: [
            {
              parts: [
                species("ursus-arctos", "Boz ayı"),
                " ve ",
                species("canis-aureus", "çakal"),
                " için yayımlanmış atlas profilleri vardır, ancak insan açısından zehir riski düzeyi verilmemiştir. Tablodaki hücreleri boş bırakıyoruz; yeni bir düzey atamıyoruz. Ayıyla beklenmedik yakın karşılaşma, özellikle yavruların veya yiyeceğin yakınında, risk yaratabilir. Yaklaşmayın, beslemeyin ve köpeği ona doğru göndermeyin.",
              ],
              type: "p",
            },
            {
              caption: [
                "Borjomi-Haragauli Millî Parkı'nda ",
                species("ursus-arctos", "boz ayı"),
                ". Tek bir yerden fotoğraf, ülke çapındaki dağılım haritası değildir.",
              ],
              photo: "bear",
              type: "figure",
              wide: true,
            },
            {
              parts: [
                "Gürcistan'da ayılar daha çok dağlarda ve ormanlarda görülür; profil Vaşlovani'nin yarı kurak alanlarını da belirtir. Bir bölgede kayıt bulunması, her patikada karşılaşma olasılığının eşit olduğu anlamına gelmez. ",
                guide("/mammals/datvi-shekhvedra", "ayıyla karşılaşma rehberi"),
                " mesafeyi ve farklı karşılaşma durumlarını açıklar.",
              ],
              type: "p",
            },
            {
              heading: "Bahçenin yakınında çakal",
              parts: [
                "Fotoğraf kredisinde Gardabani yazıyor. Bu, türün bütün dağılımı değil, kayıtlı bir yerdir.",
              ],
              photo: "jackal",
              speciesId: "canis-aureus",
              type: "speciesNote",
            },
            {
              parts: [
                species("canis-aureus", "Çakal"),
                " Gürcistan'ın hem doğusunda hem batısında yaşar. Profili alçak alanları ve insan yakınında bulabildiği yiyecek ile sığınakları anlatır. Bahçedeki yiyecek ve atıklar onu çekebilir. Mesafeyi koruyun ve bu durum için ",
                guide("/mammals/tura-ezoshi", "bahçede çakal rehberini"),
                " açın.",
              ],
              type: "p",
            },
            {
              body: "Mesafe, yavrular, yiyecek ve köpekler için ayrı rehber.",
              eyebrow: "Sıradaki okuma",
              href: "/mammals/datvi-shekhvedra",
              title: "Ayıyla karşılaşma",
              type: "resource",
            },
          ],
          eyebrow: "04 / Büyük memeliler",
          heading: "Büyük bir hayvanla güvenlik zehir ölçeğine sığmaz",
          id: "mammals",
        },
        {
          blocks: [
            {
              parts: [
                "Tek bir özellik türü belirlemez. Atlas profilleri, bu üç yaygın varsayıma daha dikkatli yanıt verir.",
              ],
              type: "p",
            },
            {
              claim: [
                "“Zehirli yılanı renginden veya üçgen başından tanırım.”",
              ],
              reality: [
                "Renk ve baş biçimi tek başına güvenilir değildir. ",
                species("coronella-austriaca", "Avusturya yılanı"),
                " başını yassılaştırabilir; uzaktan ",
                species("vipera-transcaucasiana", "boynuzlu engerekle"),
                " karıştırmak mümkündür. Uzak durun ve ",
                guide("/snakes/shxamiani-gvelis-amocnoba", "tanıma rehberine"),
                " bakın.",
              ],
              type: "myth",
            },
            {
              parts: [
                "Örümcekler ve memeliler için de tek bir görünüş veya saat işareti yetmez.",
              ],
              type: "p",
            },
            {
              claim: ["“Her koyu örümcek karakurttur.”"],
              reality: [
                species("steatoda-paykulliana", "Yalancı karakurt"),
                " başka bir cinse aittir. Isırığı ",
                species("latrodectus-tredecimguttatus", "karakurtun"),
                " ısırığıyla bir tutulmamalıdır; yalnızca koyu renk ikisini de tanımlamaz.",
              ],
              type: "myth",
            },
            {
              parts: [
                "Hayvan davranışını değerlendirirken ortam da önemlidir.",
              ],
              type: "p",
            },
            {
              claim: ["“Gündüz görülen çakal mutlaka kuduzdur.”"],
              reality: [
                species("canis-aureus", "Çakal"),
                " gündüz de görülebilir. Bu tek başına kuduz tanısı değildir. Yabani hayvana yaklaşmayın; bahçedeki durum için ",
                guide("/mammals/tura-ezoshi", "çakal rehberine"),
                " bakın.",
              ],
              type: "myth",
            },
          ],
          eyebrow: "05 / Söylenti ve gerçek",
          heading: "Yanıltabilecek üç hızlı çıkarım",
          id: "myths",
        },
      ],
      tableRows: [
        {
          action: "Uzak durun; ısırıkta 112'yi arayın",
          href: "#snakes",
          id: "gyurza",
          speciesId: "macrovipera-lebetina",
          subject: "Levant engereği",
          where: "Kaheti, Kvemo Kartli; Tiflis'te tekil kayıtlar",
        },
        {
          action: "Uzak durun; ısırıkta 112'yi arayın",
          href: "#snakes",
          id: "nose-horned-viper",
          speciesId: "vipera-transcaucasiana",
          subject: "Boynuzlu engerek",
          where: "Borjomi ve Gori kayıtlı yerlere örnek",
        },
        {
          action: "Elle tutmayın; ısırıkta 112'yi arayın",
          href: "#arachnids",
          id: "karakurt",
          speciesId: "latrodectus-tredecimguttatus",
          subject: "Karakurt",
          where: "Tiflis, Gori ve Aspindza kayıt örnekleri",
        },
        {
          action: "Dokunmayın; ağır belirtilerde 112'yi arayın",
          href: "#arachnids",
          id: "mottled-scorpion",
          speciesId: "mesobuthus-eupeus",
          subject: "Alacalı akrep",
          where: "Tiflis; fotoğraf Didi Digomi'den",
        },
        {
          action:
            "Etkin yuvadan uzak durun; gerekirse uzman değerlendirmesi alın",
          href: "/insects/krazanis-bude",
          id: "wasp-nest",
          subject: "Yaban arısı yuvası",
          where: "",
        },
        {
          action: "Çıkarma yöntemi için rehbere bakın",
          href: "/insects/tkipis-nakbeni",
          id: "tick-bite",
          subject: "Kene ısırığı",
          where: "",
        },
        {
          action: "Yaklaşmayın; karşılaşma rehberini açın",
          href: "#mammals",
          id: "bear",
          speciesId: "ursus-arctos",
          subject: "Boz ayı",
          where: "Borjomi-Haragauli kayıtlı alanlardan biri",
        },
        {
          action: "Yaklaşmayın; bahçe rehberini açın",
          href: "#mammals",
          id: "jackal",
          speciesId: "canis-aureus",
          subject: "Çakal",
          where: "Gardabani fotoğrafın çekildiği yer",
        },
      ],
      title: "Gürcistan'daki tehlikeli hayvanlar",
    },
  },
  photos: {
    bear: {
      alt: {
        en: "Brown bear in Borjomi-Kharagauli National Park",
        ka: "მურა დათვი ბორჯომ-ხარაგაულის ეროვნულ პარკში",
        ru: "Бурый медведь в национальном парке Боржоми-Харагаули",
        tr: "Borjomi-Haragauli Millî Parkı'nda bozayı",
      },
      speciesId: "ursus-arctos",
      src: "https://cdn.reptiles.ge/ursus-arctos-zauri-1.jpg",
    },
    hero: {
      alt: {
        en: "Levantine viper in Vashlovani Protected Areas",
        ka: "გიურზა ვაშლოვანის დაცულ ტერიტორიაზე",
        ru: "Гюрза в охраняемых территориях Вашловани",
        tr: "Vaşlovani Koruma Alanları'nda koca engerek",
      },
      speciesId: "macrovipera-lebetina",
      src: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
    },
    jackal: {
      alt: {
        en: "Golden jackal in Gardabani",
        ka: "ტურა გარდაბანში",
        ru: "Шакал в Гардабани",
        tr: "Gardabani'de altın çakal",
      },
      speciesId: "canis-aureus",
      src: "https://cdn.reptiles.ge/canis-aureus-archil-1.jpg",
    },
    karakurt: {
      alt: {
        en: "Mediterranean black widow in Tbilisi",
        ka: "ყარაყურთი თბილისში",
        ru: "Каракурт в Тбилиси",
        tr: "Tiflis'te karadul",
      },
      speciesId: "latrodectus-tredecimguttatus",
      src: "https://cdn.reptiles.ge/latrodectus-tredecimguttatus-armen-2.jpg",
    },
    montpellier: {
      alt: {
        en: "Eastern Montpellier snake",
        ka: "ჩვეულებრივი ხვლიკიჭამია გველი",
        ru: "Восточная ящеричная змея",
        tr: "Doğu çukurbaşlı yılanı",
      },
      speciesId: "malpolon-insignitus",
      src: "https://cdn.reptiles.ge/malpolon-insignitus-ioane-1.jpg",
    },
    scorpion: {
      alt: {
        en: "Mottled scorpion in Didi Dighomi",
        ka: "ჭრელი მორიელი დიდ დიღომში",
        ru: "Пёстрый скорпион в Диди Дигоми",
        tr: "Didi Digomi'de alaca akrep",
      },
      speciesId: "mesobuthus-eupeus",
      src: "https://cdn.reptiles.ge/mesobuthus-eupeus-armen-2.jpg",
    },
    smoothSnake: {
      alt: {
        en: "Smooth snake in Zeda Charnali",
        ka: "სპილენძა ზედა ჭარნალში",
        ru: "Медянка в Зеда Чарнали",
        tr: "Zeda Çarnali'de düz yılan",
      },
      speciesId: "coronella-austriaca",
      src: "https://cdn.reptiles.ge/coronella-austriaca-edouard-1.jpg",
    },
    viper: {
      alt: {
        en: "Nose-horned viper in Borjomi-Kharagauli National Park",
        ka: "ცხვირრქოსანი გველგესლა ბორჯომ-ხარაგაულის ეროვნულ პარკში",
        ru: "Носатая гадюка в национальном парке Боржоми-Харагаули",
        tr: "Borjomi-Haragauli Millî Parkı'nda boynuzlu engerek",
      },
      speciesId: "vipera-transcaucasiana",
      src: "https://cdn.reptiles.ge/vipera-transcaucasiana-zauri-1.jpg",
    },
  },
  sources: [
    {
      name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia's amphibians and reptiles",
      url: "https://doi.org/10.3897/caucasiana.5.e189214",
    },
    {
      name: "Iankoshvili & Tarkhnishvili 2021 — Distribution of snakes in Georgia",
      url: "https://doi.org/10.1080/09397140.2021.1957208",
    },
    {
      name: "Nentwig et al. 2026 — Spiders of Europe, Latrodectus tredecimguttatus",
      url: "https://araneae.nmbe.ch/data/2138/Latrodectus_tredecimguttatus",
    },
    {
      name: "Kovařík et al. 2022 — A revision of the genus Mesobuthus",
      url: "https://mds.marshall.edu/euscorpius/vol2022/iss348/1/",
    },
    {
      name: "Penn State Extension — Getting Rid of Paper Wasps, Yellowjackets, and Other Stinging Insects",
      url: "https://extension.psu.edu/getting-rid-of-paper-wasps-yellowjackets-and-other-stinging-insects",
    },
    {
      name: "CDC — What to Do After a Tick Bite",
      url: "https://www.cdc.gov/ticks/after-a-tick-bite/index.html",
    },
    {
      name: "CNF/NACRES 2022 — Monitoring of brown bear on selected Georgian protected areas",
      url: "https://www.undp.org/sites/g/files/zskgke326/files/2024-12/undp-georgia-monitoring-bear-2022-eng.pdf",
    },
    {
      name: "U.S. National Park Service — Staying Safe Around Bears",
      url: "https://www.nps.gov/subjects/bears/safety.htm",
    },
    {
      name: "Shakarashvili et al. 2020 — Wolf and golden jackal in Georgia",
      url: "https://doi.org/10.1111/jzo.12831",
    },
    {
      name: "Kentucky Department of Fish and Wildlife — Rabies and daytime activity",
      url: "https://fw.ky.gov/Wildlife/Pages/Rabies.aspx",
    },
    {
      name: "112 Georgia — When to call 112",
      url: "https://112.gov.ge/?lang=en&page_id=1686",
    },
  ],
};
