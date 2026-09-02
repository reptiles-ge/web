import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.3390/ani16142140";
const CHECKLIST_URL = "https://doi.org/10.3897/caucasiana.5.e189214";

const PHOTO_ARMENIACA: NewsPhoto = {
  src: "https://cdn.reptiles.ge/darevskia-armeniaca.jpg",
  fromAtlas: true,
  alt: {
    ka: "სომხური კლდის ხვლიკი. ატლასის ფოტო; ეს Darevskia uzzelli არ არის.",
    en: "Armenian rock lizard. Photograph from the atlas; this is not Darevskia uzzelli.",
    ru: "Армянская скальная ящерица. Фото из атласа; это не Darevskia uzzelli.",
    tr: "Ermeni kayalık kertenkelesi. Atlas fotoğrafı; bu Darevskia uzzelli değil.",
  },
};

const PHOTO_DAHLI: NewsPhoto = {
  src: "https://cdn.reptiles.ge/darevskia-dahli-2.jpg",
  fromAtlas: true,
  alt: {
    ka: "დალის ხვლიკი. ატლასის ფოტო; ეს Darevskia uzzelli არ არის.",
    en: "Dahl’s rock lizard. Photograph from the atlas; this is not Darevskia uzzelli.",
    ru: "Ящерица Даля. Фото из атласа; это не Darevskia uzzelli.",
    tr: "Dahl kayalık kertenkelesi. Atlas fotoğrafı; bu Darevskia uzzelli değil.",
  },
};

const FIGURE_DAHLI = {
  type: "figure" as const,
  src: PHOTO_DAHLI.src,
};

export const DAREVSKIA_UZZELLI_ARMENIA_2026: NewsArticle = {
  id: "darevskia-uzzelli-armenia-2026",
  slug: "darevskia-uzzelli-armenia-2026",
  status: "published",
  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",
  relatedSpeciesIds: ["darevskia-armeniaca", "darevskia-dahli"],
  relatedRegionIds: [],
  relatedHubIds: ["lizards"],
  image: PHOTO_ARMENIACA,
  gallery: [PHOTO_DAHLI],
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
  copy: {
    ka: {
      title: "სომხეთში უცელის კლდის ხვლიკი პირველად დაადასტურეს",
      metaTitle: "სომხეთში უცელის კლდის ხვლიკი პირველად დაადასტურეს",
      metaDescription:
        "Animals-ში დადასტურდა Darevskia uzzelli სომხეთში. ჯრაძორთან ოთხი პართენოგენეტიკური კლდის ხვლიკი ერთად ცხოვრობს. ამ ატლასში სახეობა არ არის.",
      dek: "ოთხი პართენოგენეტიკური Darevskia uzzelli ერთ ადგილას — სახეობა, რომელიც საქართველოში ამ ეტაპზე დადასტურებული არ არის.",
      lead: "2026 წლის 9 ივლისს ჟურნალ Animals-ში გამოქვეყნდა ნაშრომი, რომელიც უცელის კლდის ხვლიკს (Darevskia uzzelli) სომხეთში პირველად ადასტურებს. აქამდე სახეობა ჩრდილო-აღმოსავლეთ თურქეთის მცირე არეალის ენდემად ითვლებოდა და გადაშენების საფრთხის ქვეშ იყო შეფასებული. ავტორები არიან მარინე არაყელიანი და თანაავტორები. ეს ჩანაწერი საქართველოს არ ეხება.",
      sections: [
        {
          heading: "რა დაადგინეს?",
          blocks: [
            {
              type: "p",
              parts: [
                "მორფოლოგიურმა და გენეტიკურმა ანალიზმა აჩვენა, რომ შირაკის პროვინციაში, ჯრაძორის მახლობლად, ახურიანის ხეობაში ნაპოვნი ხვლიკები თურქეთის ",
                { type: "sci", name: "D. uzzelli" },
                "-ს ემთხვევა და ახლოს მყოფი პართენოგენისგან, ",
                { type: "sci", name: "D. unisexualis" },
                "-სგან, მკაფიოდ განსხვავდება. ნაშრომი 1977 წლიდან მიღებულ არეალს სომხეთში აფართოებს. საქართველოს წერტილი ნაშრომში არ არის.",
              ],
            },
          ],
        },
        {
          heading: "რატომ არის ოთხი სახეობა ერთად?",
          blocks: [
            {
              type: "p",
              parts: [
                "ავტორები წერენ, რომ ეს ადგილი პართენოგენეტიკური კლდის ხვლიკების ყველაზე მდიდარი ცნობილი შეკრებაა: ",
                { type: "sci", name: "D. uzzelli" },
                " აქ ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "სომხურ კლდის ხვლიკთან",
                },
                ", ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "დალის ხვლიკთან",
                },
                " და ",
                { type: "sci", name: "D. unisexualis" },
                "-თან ერთად ცხოვრობს. სქესიანი Darevskia ამ წერტილში ნაშრომში არ არის ჩაწერილი. ფერით ეს სახეობები არ გაირჩევა.",
              ],
            },
            FIGURE_DAHLI,
          ],
        },
        {
          heading: "რა ემუქრება ადგილს?",
          blocks: [
            {
              type: "p",
              parts: [
                "ავტორები მოსახლეობის უწყვეტ შესწავლას და დაცვას ითხოვენ: სამეცნიერო ღირებულება მაღალია. ჰაბიტატი დაცულ ტერიტორიებს გარეთაა და კაპსის წყალსაცავის წნეხის ქვეშაა. ეს საქართველოს რეგიონი არ არის.",
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
                "ამ ატლასში ",
                { type: "sci", name: "D. uzzelli" },
                " არ არის და ამ ნაშრომით არც ემატება. ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "სომხური კლდის ხვლიკი",
                },
                " და ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "დალის ხვლიკი",
                },
                " საქართველოში ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "2026 წლის ჩამონათვალით",
                },
                " არის; ",
                { type: "sci", name: "D. unisexualis" },
                " აქ არ არის. ",
                { type: "hub", id: "lizards", label: "ხვლიკების ჰაბი" },
                " რჩება ძირითად ჩანაწერად; ",
                { type: "news-index", label: "სიახლეები" },
                " მხოლოდ ამ სომხურ ჩანაწერს უმატებს კონტექსტს.",
              ],
            },
          ],
        },
      ],
    },
    en: {
      title: "Uzzell’s lizard confirmed in Armenia for the first time",
      metaTitle: "Uzzell’s lizard confirmed in Armenia for the first time",
      metaDescription:
        "Animals confirms Darevskia uzzelli in Armenia. Near Jradzor four parthenogenetic rock lizards live together. The species is not on this atlas.",
      dek: "Four parthenogenetic Darevskia uzzelli at one site — a species not confirmed in Georgia at this stage.",
      lead: "On 9 July 2026, Animals published the first confirmation of Uzzell’s lizard (Darevskia uzzelli) in Armenia. The species had been treated as an endangered endemic of a small area in northeastern Türkiye. The authors are Marine Arakelyan and colleagues. This record is not from Georgia.",
      sections: [
        {
          heading: "What did they find?",
          blocks: [
            {
              type: "p",
              parts: [
                "Morphological and genetic analyses show that lizards from Shirak Province, near Jradzor in the Akhuryan valley, match Turkish ",
                { type: "sci", name: "D. uzzelli" },
                " and are clearly distinct from the related parthenogen ",
                { type: "sci", name: "D. unisexualis" },
                ". The paper extends the range accepted since 1977 into Armenia. There is no Georgian locality in the paper.",
              ],
            },
          ],
        },
        {
          heading: "Why four species together?",
          blocks: [
            {
              type: "p",
              parts: [
                "The authors call the site the richest known assemblage of parthenogenetic rock lizards: ",
                { type: "sci", name: "D. uzzelli" },
                " lives there with ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "Armenian rock lizard",
                },
                ", ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "Dahl’s rock lizard",
                },
                " and ",
                { type: "sci", name: "D. unisexualis" },
                ". No sexual Darevskia is recorded at this point in the paper. Colour does not separate these species.",
              ],
            },
            FIGURE_DAHLI,
          ],
        },
        {
          heading: "What threatens the site?",
          blocks: [
            {
              type: "p",
              parts: [
                "The authors ask for continuous study and protection: the scientific value is high. The habitat lies outside protected areas and is under pressure from the Kaps reservoir. This is not a Georgian region.",
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
                { type: "sci", name: "D. uzzelli" },
                " is not on this atlas and this paper does not add it. ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "Armenian rock lizard",
                },
                " and ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "Dahl’s rock lizard",
                },
                " occur in Georgia in the ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "2026 checklist",
                },
                "; ",
                { type: "sci", name: "D. unisexualis" },
                " is not here. The ",
                { type: "hub", id: "lizards", label: "lizards hub" },
                " remains the main record; ",
                { type: "news-index", label: "news" },
                " only adds context from this Armenian record.",
              ],
            },
          ],
        },
      ],
    },
    ru: {
      title: "Ящерицу Уззелла впервые подтвердили в Армении",
      metaTitle: "Ящерицу Уззелла впервые подтвердили в Армении",
      metaDescription:
        "Animals подтверждает Darevskia uzzelli в Армении. У Джадзора вместе живут четыре партеногенетические скальные ящерицы. В этом атласе вида нет.",
      dek: "Четыре партеногенетические Darevskia uzzelli в одном месте — вид, который на данном этапе в Грузии не подтверждён.",
      lead: "9 июля 2026 года в Animals вышла работа, впервые подтверждающая ящерицу Уззелла (Darevskia uzzelli) в Армении. До этого вид считали эндемиком небольшого района северо-восточной Турции и оценивали как находящийся под угрозой. Авторы — Марине Аракелян и коллеги. Эта запись Грузии не касается.",
      sections: [
        {
          heading: "Что установили?",
          blocks: [
            {
              type: "p",
              parts: [
                "Морфологический и генетический анализ показал, что ящерицы из провинции Ширак, близ Джадзора в долине Ахуряна, совпадают с турецкой ",
                { type: "sci", name: "D. uzzelli" },
                " и ясно отличаются от близкого партеногенетического ",
                { type: "sci", name: "D. unisexualis" },
                ". Работа расширяет ареал, принятый с 1977 года, на Армению. Грузинской точки в статье нет.",
              ],
            },
          ],
        },
        {
          heading: "Почему четыре вида вместе?",
          blocks: [
            {
              type: "p",
              parts: [
                "Авторы называют это место самым богатым известным скоплением партеногенетических скальных ящериц: ",
                { type: "sci", name: "D. uzzelli" },
                " живёт здесь с ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "армянской скальной ящерицей",
                },
                ", ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "ящерицей Даля",
                },
                " и ",
                { type: "sci", name: "D. unisexualis" },
                ". Половых Darevskia в этой точке статья не записывает. По цвету эти виды не различить.",
              ],
            },
            FIGURE_DAHLI,
          ],
        },
        {
          heading: "Чем место под угрозой?",
          blocks: [
            {
              type: "p",
              parts: [
                "Авторы просят непрерывное изучение и охрану: научная ценность высока. Местообитание вне охраняемых территорий и под давлением водохранилища Капс. Это не регион Грузии.",
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
                { type: "sci", name: "D. uzzelli" },
                " в этом атласе нет, и эта работа его не добавляет. ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "Армянская скальная ящерица",
                },
                " и ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "ящерица Даля",
                },
                " в Грузии есть по ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "чеклисту 2026 года",
                },
                "; ",
                { type: "sci", name: "D. unisexualis" },
                " здесь нет. ",
                { type: "hub", id: "lizards", label: "Страница ящериц" },
                " остаётся основной записью; ",
                { type: "news-index", label: "новости" },
                " лишь добавляют контекст этой армянской записи.",
              ],
            },
          ],
        },
      ],
    },
    tr: {
      title: "Uzzell kertenkelesi Ermenistan’da ilk kez doğrulandı",
      metaTitle: "Uzzell kertenkelesi Ermenistan’da ilk kez doğrulandı",
      metaDescription:
        "Animals, Darevskia uzzelli’yi Ermenistan’da doğruluyor. Jradzor yakınında dört partenogenetik kayalık kertenkele bir arada. Tür bu atlas’ta yok.",
      dek: "Dört partenogenetik Darevskia uzzelli tek yerde — Gürcistan’da bu aşamada doğrulanmamış bir tür.",
      lead: "9 Temmuz 2026’da Animals, Uzzell kertenkelesinin (Darevskia uzzelli) Ermenistan’daki ilk doğrulamasını yayımladı. Tür daha önce kuzeydoğu Türkiye’deki küçük bir alanın tehlikedeki endemiği sayılıyordu. Yazarlar Marine Arakelyan ve meslektaşları. Bu kayıt Gürcistan’a ait değil.",
      sections: [
        {
          heading: "Ne buldular?",
          blocks: [
            {
              type: "p",
              parts: [
                "Morfolojik ve genetik analiz, Şirak ilinde, Jradzor yakınında Ahuryan vadisindeki kertenkelelerin Türkiye’deki ",
                { type: "sci", name: "D. uzzelli" },
                " ile uyduğunu ve yakın partenogen ",
                { type: "sci", name: "D. unisexualis" },
                "ten açıkça ayrıldığını gösteriyor. Makale 1977’den beri kabul edilen yayılışı Ermenistan’a genişletiyor. Makalede Gürcistan noktası yok.",
              ],
            },
          ],
        },
        {
          heading: "Neden dört tür bir arada?",
          blocks: [
            {
              type: "p",
              parts: [
                "Yazarlar burayı partenogenetik kayalık kertenkelelerin bilinen en zengin birlikteliği sayıyor: ",
                { type: "sci", name: "D. uzzelli" },
                " burada ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "Ermeni kayalık kertenkelesi",
                },
                ", ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "Dahl kayalık kertenkelesi",
                },
                " ve ",
                { type: "sci", name: "D. unisexualis" },
                " ile yaşıyor. Bu noktada eşeyli Darevskia makalede yok. Renk bu türleri ayırmaz.",
              ],
            },
            FIGURE_DAHLI,
          ],
        },
        {
          heading: "Yeri ne tehdit ediyor?",
          blocks: [
            {
              type: "p",
              parts: [
                "Yazarlar sürekli çalışma ve koruma istiyor: bilimsel değer yüksek. Habitat korunan alanların dışında ve Kaps baraj gölünün baskısı altında. Burası Gürcistan bölgesi değil.",
              ],
            },
          ],
        },
        {
          heading: "Bu atlas için ne anlama gelir?",
          blocks: [
            {
              type: "p",
              parts: [
                { type: "sci", name: "D. uzzelli" },
                " bu atlas’ta yok ve bu makale onu eklemez. ",
                {
                  type: "species",
                  id: "darevskia-armeniaca",
                  label: "Ermeni kayalık kertenkelesi",
                },
                " ile ",
                {
                  type: "species",
                  id: "darevskia-dahli",
                  label: "Dahl kayalık kertenkelesi",
                },
                " Gürcistan’da ",
                {
                  type: "external",
                  href: CHECKLIST_URL,
                  label: "2026 kontrol listesinde",
                },
                " var; ",
                { type: "sci", name: "D. unisexualis" },
                " burada yok. ",
                { type: "hub", id: "lizards", label: "Kertenkeleler sayfası" },
                " ana kayıt olarak kalır; ",
                { type: "news-index", label: "haberler" },
                " yalnızca bu Ermeni kayda bağlam ekler.",
              ],
            },
          ],
        },
      ],
    },
  },
};
