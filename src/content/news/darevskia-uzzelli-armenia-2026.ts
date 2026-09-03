import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.3390/ani16142140";
const CHECKLIST_URL = "https://doi.org/10.3897/caucasiana.5.e189214";

const PHOTO_ARMENIACA: NewsPhoto = {
  alt: {
    en: "Armenian rock lizard. Photograph from the atlas; this is not Darevskia uzzelli.",
    ka: "სომხური კლდის ხვლიკი. ატლასის ფოტო; ეს Darevskia uzzelli არ არის.",
    ru: "Армянская скальная ящерица. Фото из атласа; это не Darevskia uzzelli.",
    tr: "Ermeni kayalık kertenkelesi. Atlas fotoğrafı; bu Darevskia uzzelli değil.",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/darevskia-armeniaca.jpg",
};

const PHOTO_DAHLI: NewsPhoto = {
  alt: {
    en: "Dahl’s rock lizard. Photograph from the atlas; this is not Darevskia uzzelli.",
    ka: "დალის ხვლიკი. ატლასის ფოტო; ეს Darevskia uzzelli არ არის.",
    ru: "Ящерица Даля. Фото из атласа; это не Darevskia uzzelli.",
    tr: "Dahl kayalık kertenkelesi. Atlas fotoğrafı; bu Darevskia uzzelli değil.",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/darevskia-dahli-2.jpg",
};

const FIGURE_DAHLI = {
  src: PHOTO_DAHLI.src,
  type: "figure" as const,
};

export const DAREVSKIA_UZZELLI_ARMENIA_2026: NewsArticle = {
  copy: {
    en: {
      dek: "Four parthenogenetic Darevskia uzzelli at one site — a species not confirmed in Georgia at this stage.",
      lead: "On 9 July 2026, Animals published the first confirmation of Uzzell’s lizard (Darevskia uzzelli) in Armenia. The species had been treated as an endangered endemic of a small area in northeastern Türkiye. The authors are Marine Arakelyan and colleagues. This record is not from Georgia.",
      metaDescription:
        "Animals confirms Darevskia uzzelli in Armenia. Near Jradzor four parthenogenetic rock lizards live together. The species is not on this atlas.",
      metaTitle: "Uzzell’s lizard confirmed in Armenia for the first time",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Morphological and genetic analyses show that lizards from Shirak Province, near Jradzor in the Akhuryan valley, match Turkish ",
                { name: "D. uzzelli", type: "sci" },
                " and are clearly distinct from the related parthenogen ",
                { name: "D. unisexualis", type: "sci" },
                ". The paper extends the range accepted since 1977 into Armenia. There is no Georgian locality in the paper.",
              ],
              type: "p",
            },
          ],
          heading: "What did they find?",
        },
        {
          blocks: [
            {
              parts: [
                "The authors call the site the richest known assemblage of parthenogenetic rock lizards: ",
                { name: "D. uzzelli", type: "sci" },
                " lives there with ",
                {
                  id: "darevskia-armeniaca",
                  label: "Armenian rock lizard",
                  type: "species",
                },
                ", ",
                {
                  id: "darevskia-dahli",
                  label: "Dahl’s rock lizard",
                  type: "species",
                },
                " and ",
                { name: "D. unisexualis", type: "sci" },
                ". No sexual Darevskia is recorded at this point in the paper. Colour does not separate these species.",
              ],
              type: "p",
            },
            FIGURE_DAHLI,
          ],
          heading: "Why four species together?",
        },
        {
          blocks: [
            {
              parts: [
                "The authors ask for continuous study and protection: the scientific value is high. The habitat lies outside protected areas and is under pressure from the Kaps reservoir. This is not a Georgian region.",
              ],
              type: "p",
            },
          ],
          heading: "What threatens the site?",
        },
        {
          blocks: [
            {
              parts: [
                { name: "D. uzzelli", type: "sci" },
                " is not on this atlas and this paper does not add it. ",
                {
                  id: "darevskia-armeniaca",
                  label: "Armenian rock lizard",
                  type: "species",
                },
                " and ",
                {
                  id: "darevskia-dahli",
                  label: "Dahl’s rock lizard",
                  type: "species",
                },
                " occur in Georgia in the ",
                {
                  href: CHECKLIST_URL,
                  label: "2026 checklist",
                  type: "external",
                },
                "; ",
                { name: "D. unisexualis", type: "sci" },
                " is not here. The ",
                { id: "lizards", label: "lizards hub", type: "hub" },
                " remains the main record; ",
                { label: "news", type: "news-index" },
                " only adds context from this Armenian record.",
              ],
              type: "p",
            },
          ],
          heading: "What does this mean for the atlas?",
        },
      ],
      title: "Uzzell’s lizard confirmed in Armenia for the first time",
    },
    ka: {
      dek: "ოთხი პართენოგენეტიკური Darevskia uzzelli ერთ ადგილას — სახეობა, რომელიც საქართველოში ამ ეტაპზე დადასტურებული არ არის.",
      lead: "2026 წლის 9 ივლისს ჟურნალ Animals-ში გამოქვეყნდა ნაშრომი, რომელიც უცელის კლდის ხვლიკს (Darevskia uzzelli) სომხეთში პირველად ადასტურებს. აქამდე სახეობა ჩრდილო-აღმოსავლეთ თურქეთის მცირე არეალის ენდემად ითვლებოდა და გადაშენების საფრთხის ქვეშ იყო შეფასებული. ავტორები არიან მარინე არაყელიანი და თანაავტორები. ეს ჩანაწერი საქართველოს არ ეხება.",
      metaDescription:
        "Animals-ში დადასტურდა Darevskia uzzelli სომხეთში. ჯრაძორთან ოთხი პართენოგენეტიკური კლდის ხვლიკი ერთად ცხოვრობს. ამ ატლასში სახეობა არ არის.",
      metaTitle: "სომხეთში უცელის კლდის ხვლიკი პირველად დაადასტურეს",
      sections: [
        {
          blocks: [
            {
              parts: [
                "მორფოლოგიურმა და გენეტიკურმა ანალიზმა აჩვენა, რომ შირაკის პროვინციაში, ჯრაძორის მახლობლად, ახურიანის ხეობაში ნაპოვნი ხვლიკები თურქეთის ",
                { name: "D. uzzelli", type: "sci" },
                "-ს ემთხვევა და ახლოს მყოფი პართენოგენისგან, ",
                { name: "D. unisexualis", type: "sci" },
                "-სგან, მკაფიოდ განსხვავდება. ნაშრომი 1977 წლიდან მიღებულ არეალს სომხეთში აფართოებს. საქართველოს წერტილი ნაშრომში არ არის.",
              ],
              type: "p",
            },
          ],
          heading: "რა დაადგინეს?",
        },
        {
          blocks: [
            {
              parts: [
                "ავტორები წერენ, რომ ეს ადგილი პართენოგენეტიკური კლდის ხვლიკების ყველაზე მდიდარი ცნობილი შეკრებაა: ",
                { name: "D. uzzelli", type: "sci" },
                " აქ ",
                {
                  id: "darevskia-armeniaca",
                  label: "სომხურ კლდის ხვლიკთან",
                  type: "species",
                },
                ", ",
                {
                  id: "darevskia-dahli",
                  label: "დალის ხვლიკთან",
                  type: "species",
                },
                " და ",
                { name: "D. unisexualis", type: "sci" },
                "-თან ერთად ცხოვრობს. სქესიანი Darevskia ამ წერტილში ნაშრომში არ არის ჩაწერილი. ფერით ეს სახეობები არ გაირჩევა.",
              ],
              type: "p",
            },
            FIGURE_DAHLI,
          ],
          heading: "რატომ არის ოთხი სახეობა ერთად?",
        },
        {
          blocks: [
            {
              parts: [
                "ავტორები მოსახლეობის უწყვეტ შესწავლას და დაცვას ითხოვენ: სამეცნიერო ღირებულება მაღალია. ჰაბიტატი დაცულ ტერიტორიებს გარეთაა და კაპსის წყალსაცავის წნეხის ქვეშაა. ეს საქართველოს რეგიონი არ არის.",
              ],
              type: "p",
            },
          ],
          heading: "რა ემუქრება ადგილს?",
        },
        {
          blocks: [
            {
              parts: [
                "ამ ატლასში ",
                { name: "D. uzzelli", type: "sci" },
                " არ არის და ამ ნაშრომით არც ემატება. ",
                {
                  id: "darevskia-armeniaca",
                  label: "სომხური კლდის ხვლიკი",
                  type: "species",
                },
                " და ",
                {
                  id: "darevskia-dahli",
                  label: "დალის ხვლიკი",
                  type: "species",
                },
                " საქართველოში ",
                {
                  href: CHECKLIST_URL,
                  label: "2026 წლის ჩამონათვალით",
                  type: "external",
                },
                " არის; ",
                { name: "D. unisexualis", type: "sci" },
                " აქ არ არის. ",
                { id: "lizards", label: "ხვლიკების ჰაბი", type: "hub" },
                " რჩება ძირითად ჩანაწერად; ",
                { label: "სიახლეები", type: "news-index" },
                " მხოლოდ ამ სომხურ ჩანაწერს უმატებს კონტექსტს.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს ეს ატლასისთვის?",
        },
      ],
      title: "სომხეთში უცელის კლდის ხვლიკი პირველად დაადასტურეს",
    },
    ru: {
      dek: "Четыре партеногенетические Darevskia uzzelli в одном месте — вид, который на данном этапе в Грузии не подтверждён.",
      lead: "9 июля 2026 года в Animals вышла работа, впервые подтверждающая ящерицу Уззелла (Darevskia uzzelli) в Армении. До этого вид считали эндемиком небольшого района северо-восточной Турции и оценивали как находящийся под угрозой. Авторы — Марине Аракелян и коллеги. Эта запись Грузии не касается.",
      metaDescription:
        "Animals подтверждает Darevskia uzzelli в Армении. У Джадзора вместе живут четыре партеногенетические скальные ящерицы. В этом атласе вида нет.",
      metaTitle: "Ящерицу Уззелла впервые подтвердили в Армении",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Морфологический и генетический анализ показал, что ящерицы из провинции Ширак, близ Джадзора в долине Ахуряна, совпадают с турецкой ",
                { name: "D. uzzelli", type: "sci" },
                " и ясно отличаются от близкого партеногенетического ",
                { name: "D. unisexualis", type: "sci" },
                ". Работа расширяет ареал, принятый с 1977 года, на Армению. Грузинской точки в статье нет.",
              ],
              type: "p",
            },
          ],
          heading: "Что установили?",
        },
        {
          blocks: [
            {
              parts: [
                "Авторы называют это место самым богатым известным скоплением партеногенетических скальных ящериц: ",
                { name: "D. uzzelli", type: "sci" },
                " живёт здесь с ",
                {
                  id: "darevskia-armeniaca",
                  label: "армянской скальной ящерицей",
                  type: "species",
                },
                ", ",
                {
                  id: "darevskia-dahli",
                  label: "ящерицей Даля",
                  type: "species",
                },
                " и ",
                { name: "D. unisexualis", type: "sci" },
                ". Половых Darevskia в этой точке статья не записывает. По цвету эти виды не различить.",
              ],
              type: "p",
            },
            FIGURE_DAHLI,
          ],
          heading: "Почему четыре вида вместе?",
        },
        {
          blocks: [
            {
              parts: [
                "Авторы просят непрерывное изучение и охрану: научная ценность высока. Местообитание вне охраняемых территорий и под давлением водохранилища Капс. Это не регион Грузии.",
              ],
              type: "p",
            },
          ],
          heading: "Чем место под угрозой?",
        },
        {
          blocks: [
            {
              parts: [
                { name: "D. uzzelli", type: "sci" },
                " в этом атласе нет, и эта работа его не добавляет. ",
                {
                  id: "darevskia-armeniaca",
                  label: "Армянская скальная ящерица",
                  type: "species",
                },
                " и ",
                {
                  id: "darevskia-dahli",
                  label: "ящерица Даля",
                  type: "species",
                },
                " в Грузии есть по ",
                {
                  href: CHECKLIST_URL,
                  label: "чеклисту 2026 года",
                  type: "external",
                },
                "; ",
                { name: "D. unisexualis", type: "sci" },
                " здесь нет. ",
                { id: "lizards", label: "Страница ящериц", type: "hub" },
                " остаётся основной записью; ",
                { label: "новости", type: "news-index" },
                " лишь добавляют контекст этой армянской записи.",
              ],
              type: "p",
            },
          ],
          heading: "Что это значит для атласа?",
        },
      ],
      title: "Ящерицу Уззелла впервые подтвердили в Армении",
    },
    tr: {
      dek: "Dört partenogenetik Darevskia uzzelli tek yerde — Gürcistan’da bu aşamada doğrulanmamış bir tür.",
      lead: "9 Temmuz 2026’da Animals, Uzzell kertenkelesinin (Darevskia uzzelli) Ermenistan’daki ilk doğrulamasını yayımladı. Tür daha önce kuzeydoğu Türkiye’deki küçük bir alanın tehlikedeki endemiği sayılıyordu. Yazarlar Marine Arakelyan ve meslektaşları. Bu kayıt Gürcistan’a ait değil.",
      metaDescription:
        "Animals, Darevskia uzzelli’yi Ermenistan’da doğruluyor. Jradzor yakınında dört partenogenetik kayalık kertenkele bir arada. Tür bu atlas’ta yok.",
      metaTitle: "Uzzell kertenkelesi Ermenistan’da ilk kez doğrulandı",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Morfolojik ve genetik analiz, Şirak ilinde, Jradzor yakınında Ahuryan vadisindeki kertenkelelerin Türkiye’deki ",
                { name: "D. uzzelli", type: "sci" },
                " ile uyduğunu ve yakın partenogen ",
                { name: "D. unisexualis", type: "sci" },
                "ten açıkça ayrıldığını gösteriyor. Makale 1977’den beri kabul edilen yayılışı Ermenistan’a genişletiyor. Makalede Gürcistan noktası yok.",
              ],
              type: "p",
            },
          ],
          heading: "Ne buldular?",
        },
        {
          blocks: [
            {
              parts: [
                "Yazarlar burayı partenogenetik kayalık kertenkelelerin bilinen en zengin birlikteliği sayıyor: ",
                { name: "D. uzzelli", type: "sci" },
                " burada ",
                {
                  id: "darevskia-armeniaca",
                  label: "Ermeni kayalık kertenkelesi",
                  type: "species",
                },
                ", ",
                {
                  id: "darevskia-dahli",
                  label: "Dahl kayalık kertenkelesi",
                  type: "species",
                },
                " ve ",
                { name: "D. unisexualis", type: "sci" },
                " ile yaşıyor. Bu noktada eşeyli Darevskia makalede yok. Renk bu türleri ayırmaz.",
              ],
              type: "p",
            },
            FIGURE_DAHLI,
          ],
          heading: "Neden dört tür bir arada?",
        },
        {
          blocks: [
            {
              parts: [
                "Yazarlar sürekli çalışma ve koruma istiyor: bilimsel değer yüksek. Habitat korunan alanların dışında ve Kaps baraj gölünün baskısı altında. Burası Gürcistan bölgesi değil.",
              ],
              type: "p",
            },
          ],
          heading: "Yeri ne tehdit ediyor?",
        },
        {
          blocks: [
            {
              parts: [
                { name: "D. uzzelli", type: "sci" },
                " bu atlas’ta yok ve bu makale onu eklemez. ",
                {
                  id: "darevskia-armeniaca",
                  label: "Ermeni kayalık kertenkelesi",
                  type: "species",
                },
                " ile ",
                {
                  id: "darevskia-dahli",
                  label: "Dahl kayalık kertenkelesi",
                  type: "species",
                },
                " Gürcistan’da ",
                {
                  href: CHECKLIST_URL,
                  label: "2026 kontrol listesinde",
                  type: "external",
                },
                " var; ",
                { name: "D. unisexualis", type: "sci" },
                " burada yok. ",
                { id: "lizards", label: "Kertenkeleler sayfası", type: "hub" },
                " ana kayıt olarak kalır; ",
                { label: "haberler", type: "news-index" },
                " yalnızca bu Ermeni kayda bağlam ekler.",
              ],
              type: "p",
            },
          ],
          heading: "Bu atlas için ne anlama gelir?",
        },
      ],
      title: "Uzzell kertenkelesi Ermenistan’da ilk kez doğrulandı",
    },
  },
  gallery: [PHOTO_DAHLI],
  id: "darevskia-uzzelli-armenia-2026",
  image: PHOTO_ARMENIACA,
  publishedAt: "2026-09-02",
  relatedHubIds: ["lizards"],
  relatedRegionIds: [],
  relatedSpeciesIds: ["darevskia-armeniaca", "darevskia-dahli"],
  slug: "darevskia-uzzelli-armenia-2026",
  sources: [
    {
      name: "Arakelyan et al. 2026 — Unique sympatric population of Darevskia uzzelli",
      url: PAPER_URL,
    },
    {
      name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia’s amphibians and reptiles",
      url: CHECKLIST_URL,
    },
  ],
  status: "published",
  updatedAt: "2026-09-02",
};
