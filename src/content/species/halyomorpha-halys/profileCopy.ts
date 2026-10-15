import type { AppLocale } from "@/i18n/routing";

export type HalyomorphaAnnotationCopy = {
  alt: string;
  caption: string;
  creditLabel: string;
  intro: string;
  label: string;
  labels: Record<HalyomorphaAnnotationMarkerKey, string>;
  note: string;
  title: string;
};

export type HalyomorphaAnnotationMarkerKey =
  "abdomen" | "antenna" | "legs" | "shoulders";

export type HalyomorphaPestCopy = {
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

export const HALYOMORPHA_ANNOTATION_COPY: Record<
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

export const HALYOMORPHA_PEST_COPY: Record<AppLocale, HalyomorphaPestCopy> = {
  en: {
    damageIntro:
      "The damage comes from feeding. Adults and nymphs pierce young shoots, leaves, fruit, nuts, or seeds and suck plant sap. Important host crops in Georgia include hazelnut, pome and stone fruit, berries, vegetables, sunflower, and maize.",
    damageNote:
      "In a strong outbreak, the loss may reach up to 70% of crop value. That is an outbreak-risk figure, not a prediction for every garden or field.",
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
      "ზიანი კვებით იწყება. ზრდასრული ფაროსანა და ნიმფა ხორთუმით ხვრეტს ყლორტს, ფოთოლს, ნაყოფს, თესლს ან კაკალს და მცენარის წვენს წოვს. საქართველოში მისი მნიშვნელოვანი მასპინძლებია თხილი, თესლოვანი და კურკოვანი ხეხილი, კენკროვნები, ბოსტნეული კულტურები, მზესუმზირა და სიმინდი.",
    damageNote:
      "ძლიერი აფეთქების დროს ზარალმა შესაძლოა მოსავლის ღირებულების 70%-იც შეადგინოს. ეს არის აფეთქების რისკის კონტექსტი და არა პროგნოზი ყველა ბაღისა თუ ნაკვეთისთვის.",
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
      "Вред связан с питанием. Взрослые особи и нимфы прокалывают побеги, листья, плоды, семена или орехи и высасывают сок. Среди важных культур-хозяев в Грузии — фундук, семечковые и косточковые плодовые, ягоды, овощи, подсолнечник и кукуруза.",
    damageNote:
      "При сильной вспышке ущерб может достигать 70% стоимости урожая. Это показатель риска при вспышке, а не прогноз для каждого сада или поля.",
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
      "Zarar beslenmeden kaynaklanır. Erginler ve nimfler sürgün, yaprak, meyve, tohum veya fındığı delerek bitki özsuyunu emer. Gürcistan’daki önemli konukçular arasında fındık, yumuşak ve sert çekirdekli meyveler, üzümsü meyveler, sebzeler, ayçiçeği ve mısır yer alır.",
    damageNote:
      "Güçlü bir salgında zarar, ürün değerinin %70'ine kadar çıkabilir. Bu her bahçe veya tarla için tahmin değil, salgın riski bağlamıdır.",
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
