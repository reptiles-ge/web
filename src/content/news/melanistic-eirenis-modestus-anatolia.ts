import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.3897/caucasiana.5.e204607";
const PAPER_PDF_URL =
  "https://caucasiana.pensoft.net/article/204607/download/pdf/1772746";
const CHECKLIST_URL = "https://doi.org/10.3897/caucasiana.5.e189214";

const PHOTO_DIR = "/images/news/melanistic-eirenis-modestus-anatolia";
const PAPER_CREDIT = "Korkmaz et al. 2026";

const PHOTO_SPECIMEN: NewsPhoto = {
  alt: {
    en: "The melanistic Ring-headed Dwarf Snake found between Çağman and Demre, Antalya Province, on 9 May 2024. Caucasiana, CC BY 4.0.",
    ka: "მელანისტი წყნარი ეირენისი, ნაპოვნი ჩაღმანსა და დემრეს შორის, ანტალიის პროვინციაში, 2024 წლის 9 მაისს. Caucasiana, CC BY 4.0.",
    ru: "Меланистический скромный эйренис, найденный между Чагманом и Демре, провинция Анталья, 9 мая 2024 года. Caucasiana, CC BY 4.0.",
    tr: "9 Mayıs 2024’te Antalya’da Çağman ile Demre arasında bulunan melanistik halkalı başlı cüce yılan. Caucasiana, CC BY 4.0.",
  },
  credit: {
    location: "Çağman–Demre, Antalya",
    photographer: PAPER_CREDIT,
    url: PAPER_URL,
  },
  height: 1172,
  src: `${PHOTO_DIR}/figure-3.jpg`,
  width: 1975,
};

const PHOTO_HEAD: NewsPhoto = {
  alt: {
    en: "Head and front of the body of the melanistic snake: black head from above (A) and from the side (B), and the greyish-white belly (C). Caucasiana, CC BY 4.0.",
    ka: "მელანისტი გველის თავი და სხეულის წინა ნაწილი: შავი თავი ზემოდან (A) და გვერდიდან (B), მონაცრისფრო-თეთრი მუცელი (C). Caucasiana, CC BY 4.0.",
    ru: "Голова и передняя часть тела меланистической змеи: чёрная голова сверху (A) и сбоку (B), серовато-белое брюхо (C). Caucasiana, CC BY 4.0.",
    tr: "Melanistik yılanın başı ve gövdesinin ön kısmı: yukarıdan (A) ve yandan (B) siyah baş, grimsi beyaz karın (C). Caucasiana, CC BY 4.0.",
  },
  credit: {
    location: "Çağman–Demre, Antalya",
    photographer: PAPER_CREDIT,
    url: PAPER_URL,
  },
  height: 1268,
  plate: true,
  src: `${PHOTO_DIR}/figure-2.jpg`,
  width: 1955,
};

const PHOTO_MAP: NewsPhoto = {
  alt: {
    en: "Map of south-western Türkiye: earlier melanistic records on Symi, Kastellorizo (Meis) and Yassıca, and the new mainland record at Çağman–Demre. Caucasiana, CC BY 4.0.",
    ka: "სამხრეთ-დასავლეთ თურქეთის რუკა: წინა მელანისტური ჩანაწერები სიმიზე, კასტელორიზოზე (მეისი) და იასიჯაზე და ახალი ჩანაწერი ხმელეთზე, ჩაღმან–დემრეში. Caucasiana, CC BY 4.0.",
    ru: "Карта юго-запада Турции: прежние находки меланистов на Сими, Кастелоризо (Мейс) и Ясыдже и новая находка на материке у Чагмана–Демре. Caucasiana, CC BY 4.0.",
    tr: "Güneybatı Türkiye haritası: Sembe (Symi), Meis ve Yassıca’daki önceki melanistik kayıtlar ve Çağman–Demre’deki yeni anakara kaydı. Caucasiana, CC BY 4.0.",
  },
  credit: {
    photographer: PAPER_CREDIT,
    url: PAPER_URL,
  },
  height: 1303,
  plate: true,
  src: `${PHOTO_DIR}/figure-1.jpg`,
  width: 1975,
};

const FIGURE_HEAD = { src: PHOTO_HEAD.src, type: "figure" as const };
const FIGURE_MAP = { src: PHOTO_MAP.src, type: "figure" as const };

export const MELANISTIC_EIRENIS_MODESTUS_ANATOLIA: NewsArticle = {
  copy: {
    en: {
      dek: "Turkish herpetologists describe an entirely black Ring-headed Dwarf Snake from Antalya Province. Until now, black individuals of this normally pale snake were known only from islands.",
      lead: "On 9 May 2024, herpetologists found an entirely black Ring-headed Dwarf Snake (Eirenis modestus) between Çağman and Demre in Antalya Province, south-western Türkiye. In a paper published in Caucasiana on 16 September 2026, Korkmaz and co-authors call it the first record of melanism in this species from the Anatolian mainland. Every earlier black individual had come from islands. The species also lives in eastern and central Georgia.",
      metaDescription:
        "An entirely black Ring-headed Dwarf Snake (Eirenis modestus) from Antalya is the species’ first melanistic record on the Anatolian mainland, Caucasiana 2026.",
      metaTitle: "Black Eirenis modestus: first mainland melanism record",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The snake was found under a rock at about 17:30 during fieldwork between Çağman and Demre, in Antalya Province. Its back was black from head to tail tip. In this fairly young animal, some greyish-white scales were scattered over the neck. The belly was greyish-white and darkened towards the tail.",
              ],
              type: "p",
            },
            {
              parts: [
                "The body measured 155 mm from snout to vent, and the tail 47.3 mm. Scale counts and the dark cap and collar pattern on the head confirmed the species: it is a ",
                {
                  id: "eirenis-modestus",
                  label: "Ring-headed Dwarf Snake",
                  type: "species",
                },
                " (",
                { name: "Eirenis modestus", type: "sci" },
                "), not another small ",
                { name: "Eirenis", type: "sci" },
                " from southern Anatolia. Searching the area turned up no other individuals of the species, so the paper rests on this single snake. It is now kept in the zoology collection of Dokuz Eylül University.",
              ],
              type: "p",
            },
            FIGURE_HEAD,
          ],
          heading: "What was found?",
        },
        {
          blocks: [
            {
              parts: [
                "Melanism is an excess of dark pigment that turns an animal black. It stands out in this species because it is usually pale: light brown to greyish, often with a darker collar and a dark cap on the head that fades with age.",
              ],
              type: "p",
            },
            {
              parts: [
                "According to the paper, all earlier black individuals came from islands. In 1986 they were described from the Yassıca and Sarıot islands in Muğla Province. In 2018 a juvenile and an adult were reported from the Greek island of Kastellorizo, and in 2025 one adult from Symi. The Antalya snake is the first such record from the mainland.",
              ],
              type: "p",
            },
            FIGURE_MAP,
          ],
          heading: "Why does it matter?",
        },
        {
          blocks: [
            {
              parts: [
                "The authors set out two explanations. Under thermal melanism, dark animals are favoured in cool climates because they warm up faster. Under Gloger’s rule, darker colour is expected in warm, humid places, where vegetation is denser, the ground is darker and a dark animal is better hidden.",
              ],
              type: "p",
            },
            {
              parts: [
                "Çağman–Demre and the earlier island sites all have a fairly humid Mediterranean coastal climate. The authors say this single find fits Gloger’s rule better than thermal melanism. They add that one record cannot test either idea, and that the black colour may just be a rare, non-adaptive mutation: the usual pale form still dominates across southern Anatolia. They call for more sampling on the mainland and nearby islands.",
              ],
              type: "p",
            },
          ],
          heading: "Why black?",
        },
        {
          blocks: [
            {
              parts: [
                "The Ring-headed Dwarf Snake is part of Georgia’s fauna. The 2026 checklist of Georgia’s amphibians and reptiles lists it for eastern and central Georgia; one of the documented sites is Tbilisi. It is a small, harmless snake of dry, stony ground that spends the day under flat stones.",
              ],
              type: "p",
            },
            {
              parts: [
                "The paper does not deal with Georgian populations and reports no black individual from Georgia. More on the species is on its profile and on the ",
                { id: "snakes", label: "snakes hub", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "What about Georgia?",
        },
      ],
      title:
        "Black Ring-headed Dwarf Snake: first melanistic record on the Anatolian mainland",
    },
    ka: {
      dek: "თურქმა ჰერპეტოლოგებმა ანტალიის პროვინციიდან მთლიანად შავი წყნარი ეირენისი აღწერეს. აქამდე ამ ჩვეულებრივ ღია ფერის გველის შავი ინდივიდები მხოლოდ კუნძულებიდან იყო ცნობილი.",
      lead: "2024 წლის 9 მაისს ჰერპეტოლოგებმა თურქეთის სამხრეთ-დასავლეთში, ანტალიის პროვინციაში, ჩაღმანსა და დემრეს შორის მთლიანად შავი წყნარი ეირენისი (Eirenis modestus) იპოვეს. Caucasiana-ში 2026 წლის 16 სექტემბერს გამოქვეყნებულ სტატიაში კორკმაზი და თანაავტორები მას ამ სახეობაში მელანიზმის პირველ ჩანაწერს უწოდებენ ანატოლიის ხმელეთზე. მანამდე ყველა შავი ინდივიდი კუნძულებიდან იყო. ეს სახეობა აღმოსავლეთ და ცენტრალურ საქართველოშიც ბინადრობს.",
      metaDescription:
        "მთლიანად შავი წყნარი ეირენისი (Eirenis modestus) ანტალიიდან სახეობაში მელანიზმის პირველი ჩანაწერია ანატოლიის ხმელეთზე. Caucasiana, 2026.",
      metaTitle: "შავი ეირენისი: მელანიზმი პირველად ანატოლიის ხმელეთზე",
      sections: [
        {
          blocks: [
            {
              parts: [
                "გველი ჩაღმანსა და დემრეს შორის, ანტალიის პროვინციაში, საველე სამუშაოებისას, დაახლოებით 17:30-ზე ქვის ქვეშ იპოვეს. მისი ზურგი თავიდან კუდის წვერამდე შავი იყო. ეს შედარებით ახალგაზრდა ინდივიდი იყო და კისერზე მონაცრისფრო-თეთრი ქერცლები ჰქონდა მიმოფანტული. მუცელი მონაცრისფრო-თეთრი იყო და კუდისკენ მუქდებოდა.",
              ],
              type: "p",
            },
            {
              parts: [
                "სხეულის სიგრძე დრუნჩიდან კლოაკამდე 155 მმ იყო, კუდისა — 47,3 მმ. ქერცლების რაოდენობამ და თავზე მუქი „ქუდისა“ და საყელოს ნახატმა სახეობა დაადასტურა: ეს ",
                {
                  id: "eirenis-modestus",
                  label: "წყნარი ეირენისია",
                  type: "species",
                },
                " (",
                { name: "Eirenis modestus", type: "sci" },
                ") და არა სამხრეთ ანატოლიის სხვა პატარა ",
                { name: "Eirenis", type: "sci" },
                ". იმავე ადგილას ამ სახეობის სხვა ინდივიდი ვერ იპოვეს, ამიტომ სტატია ერთ გველს ეყრდნობა. ნიმუში ახლა დოკუზ ეილულის უნივერსიტეტის ზოოლოგიურ კოლექციაშია.",
              ],
              type: "p",
            },
            FIGURE_HEAD,
          ],
          heading: "რა იპოვეს?",
        },
        {
          blocks: [
            {
              parts: [
                "მელანიზმი მუქი პიგმენტის სიჭარბეა, რომელიც ცხოველს შავად აქცევს. ამ სახეობაში ის განსაკუთრებით შესამჩნევია, რადგან წყნარი ეირენისი ჩვეულებრივ ღია ფერისაა: ღია ყავისფრიდან მონაცრისფრომდე, ხშირად მუქი საყელოთი და თავზე მუქი „ქუდით“, რომელიც ასაკთან ერთად ფერმკრთალდება.",
              ],
              type: "p",
            },
            {
              parts: [
                "სტატიის მიხედვით, ყველა წინა შავი ინდივიდი კუნძულებიდან იყო. 1986 წელს ისინი მუღლის პროვინციის კუნძულებიდან, იასიჯადან და სარიოტიდან აღწერეს. 2018 წელს ბერძნულ კუნძულ კასტელორიზოზე ერთი ახალგაზრდა და ერთი ზრდასრული ინდივიდი დააფიქსირეს, 2025 წელს კი ერთი ზრდასრული — სიმიზე. ანტალიის გველი ხმელეთიდან პირველი ასეთი ჩანაწერია.",
              ],
              type: "p",
            },
            FIGURE_MAP,
          ],
          heading: "რატომაა ეს მნიშვნელოვანი?",
        },
        {
          blocks: [
            {
              parts: [
                "ავტორები ორ ახსნას განიხილავენ. თერმული მელანიზმის მიხედვით, მუქ ცხოველებს გრილ კლიმატში უპირატესობა აქვთ, რადგან უფრო სწრაფად თბებიან. გლოგერის წესის მიხედვით კი მუქი შეფერილობა თბილ და ტენიან ადგილებშია მოსალოდნელი: იქ მცენარეულობა უფრო ხშირია, ნიადაგი უფრო მუქი, ამიტომ მუქი ცხოველი უკეთ იმალება.",
              ],
              type: "p",
            },
            {
              parts: [
                "ჩაღმან–დემრეს და წინა კუნძულოვან ადგილებს შედარებით ტენიანი ხმელთაშუაზღვისპირა კლიმატი აქვთ. ავტორების აზრით, ეს ერთი მონაპოვარი გლოგერის წესს უფრო ეთანხმება, ვიდრე თერმულ მელანიზმს. თუმცა ისინი იქვე წერენ, რომ ერთი ჩანაწერით ვერცერთი ჰიპოთეზა ვერ შემოწმდება და შავი ფერი შეიძლება უბრალოდ იშვიათი, არაადაპტური მუტაცია იყოს: სამხრეთ ანატოლიაში ისევ ჩვეულებრივი ღია ფორმა ჭარბობს. ავტორები ხმელეთსა და მეზობელ კუნძულებზე დამატებით კვლევას ითხოვენ.",
              ],
              type: "p",
            },
          ],
          heading: "რატომ შავი?",
        },
        {
          blocks: [
            {
              parts: [
                "წყნარი ეირენისი საქართველოს ფაუნის ნაწილია. საქართველოს ამფიბიებისა და რეპტილიების 2026 წლის ჩამონათვალი მას აღმოსავლეთ და ცენტრალურ საქართველოში ასახელებს; ერთ-ერთი დოკუმენტირებული ადგილი თბილისია. ეს პატარა, უვნებელი გველია, რომელიც მშრალ, ქვიან ადგილებში ცხოვრობს და დღისით ხშირად ბრტყელი ქვის ქვეშ იმალება.",
              ],
              type: "p",
            },
            {
              parts: [
                "სტატია ქართულ პოპულაციებს არ იკვლევს და საქართველოდან შავ ინდივიდს არ ასახელებს. სახეობაზე მეტი მის პროფილზე და ",
                { id: "snakes", label: "გველების ჰაბზეა", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რა კავშირი აქვს საქართველოსთან?",
        },
      ],
      title: "შავი ეირენისი: მელანისტი გველი პირველად ანატოლიის ხმელეთზე",
    },
    ru: {
      dek: "Турецкие герпетологи описали полностью чёрного скромного эйрениса из провинции Анталья. До сих пор чёрные особи этой обычно светлой змеи были известны только с островов.",
      lead: "9 мая 2024 года герпетологи нашли полностью чёрного скромного эйрениса (Eirenis modestus) между Чагманом и Демре в провинции Анталья на юго-западе Турции. В статье, опубликованной в Caucasiana 16 сентября 2026 года, Коркмаз и соавторы называют его первой находкой меланизма у этого вида на материковой Анатолии. Все прежние чёрные особи были с островов. Этот вид обитает и в восточной и центральной Грузии.",
      metaDescription:
        "Полностью чёрный скромный эйренис (Eirenis modestus) из Антальи — первая находка меланизма у вида на материковой Анатолии. Caucasiana, 2026.",
      metaTitle: "Чёрный эйренис: первый меланист на материковой Анатолии",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Змею нашли под камнем около 17:30 во время полевых работ между Чагманом и Демре в провинции Анталья. Её спина была чёрной от головы до кончика хвоста. У этой довольно молодой особи на шее были разбросаны серовато-белые чешуи. Брюхо было серовато-белым и темнело к хвосту.",
              ],
              type: "p",
            },
            {
              parts: [
                "Длина тела от морды до клоаки — 155 мм, хвоста — 47,3 мм. Число чешуй и тёмный рисунок «шапочки» и воротника на голове подтвердили вид: это ",
                {
                  id: "eirenis-modestus",
                  label: "скромный эйренис",
                  type: "species",
                },
                " (",
                { name: "Eirenis modestus", type: "sci" },
                "), а не другой мелкий ",
                { name: "Eirenis", type: "sci" },
                " южной Анатолии. Других особей вида на месте не нашли, поэтому статья основана на одной змее. Экземпляр хранится в зоологической коллекции Университета Докуз Эйлюль.",
              ],
              type: "p",
            },
            FIGURE_HEAD,
          ],
          heading: "Что нашли?",
        },
        {
          blocks: [
            {
              parts: [
                "Меланизм — избыток тёмного пигмента, из-за которого животное становится чёрным. У этого вида он особенно заметен, потому что обычно скромный эйренис светлый: от светло-коричневого до сероватого, часто с тёмным воротником и тёмной «шапочкой» на голове, которая с возрастом бледнеет.",
              ],
              type: "p",
            },
            {
              parts: [
                "По данным статьи, все прежние чёрные особи были с островов. В 1986 году их описали с островов Ясыджа и Сарыот в провинции Мугла. В 2018 году на греческом острове Кастелоризо отметили одну молодую и одну взрослую особь, в 2025 году — одну взрослую на Сими. Змея из Антальи — первая такая находка на материке.",
              ],
              type: "p",
            },
            FIGURE_MAP,
          ],
          heading: "Почему это важно?",
        },
        {
          blocks: [
            {
              parts: [
                "Авторы рассматривают два объяснения. Согласно гипотезе термического меланизма, тёмные животные получают преимущество в прохладном климате, потому что быстрее нагреваются. По правилу Глогера тёмная окраска ожидается в тёплых и влажных местах: там гуще растительность, темнее почва, и тёмное животное лучше скрыто.",
              ],
              type: "p",
            },
            {
              parts: [
                "У Чагмана–Демре и прежних островных мест довольно влажный средиземноморский прибрежный климат. По мнению авторов, эта единственная находка лучше согласуется с правилом Глогера, чем с термическим меланизмом. Но они оговаривают, что одна находка не может проверить ни одну из гипотез, а чёрная окраска может быть просто редкой неадаптивной мутацией: на юге Анатолии по-прежнему преобладает обычная светлая форма. Авторы призывают продолжить сборы на материке и соседних островах.",
              ],
              type: "p",
            },
          ],
          heading: "Почему чёрный?",
        },
        {
          blocks: [
            {
              parts: [
                "Скромный эйренис входит в фауну Грузии. Чек-лист амфибий и рептилий Грузии 2026 года указывает его для восточной и центральной Грузии; одно из документированных мест — Тбилиси. Это небольшая безвредная змея сухих каменистых мест, которая днём часто прячется под плоскими камнями.",
              ],
              type: "p",
            },
            {
              parts: [
                "Статья не изучает грузинские популяции и не сообщает о чёрных особях из Грузии. Подробнее о виде — в его профиле и на ",
                { id: "snakes", label: "странице змей", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "А что в Грузии?",
        },
      ],
      title:
        "Чёрный эйренис: первая находка меланиста на материковой Анатолии",
    },
    tr: {
      dek: "Türk herpetologlar Antalya’dan tamamen siyah bir halkalı başlı cüce yılan tanımladı. Normalde açık renkli bu yılanın siyah bireyleri şimdiye kadar yalnızca adalardan biliniyordu.",
      lead: "9 Mayıs 2024’te herpetologlar, güneybatı Türkiye’de Antalya’da Çağman ile Demre arasında tamamen siyah bir halkalı başlı cüce yılan (Eirenis modestus) buldu. Korkmaz ve arkadaşları, 16 Eylül 2026’da Caucasiana’da yayımlanan makalede bunu türde Anadolu anakarasından ilk melanizm kaydı olarak tanımlıyor. Önceki tüm siyah bireyler adalardan geliyordu. Tür, doğu ve orta Gürcistan’da da yaşıyor.",
      metaDescription:
        "Antalya’dan tamamen siyah bir halkalı başlı cüce yılan (Eirenis modestus), türün Anadolu anakarasındaki ilk melanizm kaydı. Caucasiana, 2026.",
      metaTitle: "Siyah Eirenis modestus: Anadolu anakarasında ilk melanizm",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Yılan, Antalya’da Çağman ile Demre arasındaki arazi çalışması sırasında saat 17.30 sularında bir taşın altında bulundu. Sırtı başından kuyruk ucuna kadar siyahtı. Oldukça genç olan bu bireyin boynuna grimsi beyaz pullar dağılmıştı. Karnı grimsi beyazdı ve kuyruğa doğru koyulaşıyordu.",
              ],
              type: "p",
            },
            {
              parts: [
                "Burun–kloak uzunluğu 155 mm, kuyruk uzunluğu 47,3 mm idi. Pul sayıları ile başındaki koyu “başlık” ve tasma deseni türü doğruladı: bu bir ",
                {
                  id: "eirenis-modestus",
                  label: "halkalı başlı cüce yılan",
                  type: "species",
                },
                " (",
                { name: "Eirenis modestus", type: "sci" },
                "), güney Anadolu’daki başka küçük bir ",
                { name: "Eirenis", type: "sci" },
                " değil. Bölgede türün başka bireyi bulunamadı; bu yüzden makale tek bir yılana dayanıyor. Örnek, Dokuz Eylül Üniversitesi’nin zooloji koleksiyonunda saklanıyor.",
              ],
              type: "p",
            },
            FIGURE_HEAD,
          ],
          heading: "Ne bulundu?",
        },
        {
          blocks: [
            {
              parts: [
                "Melanizm, hayvanı siyahlaştıran koyu pigment fazlalığıdır. Bu türde özellikle dikkat çeker, çünkü halkalı başlı cüce yılan genellikle açık renklidir: açık kahverengiden grimsiye, çoğu zaman koyu bir tasma ve yaşla soluklaşan koyu bir baş deseniyle.",
              ],
              type: "p",
            },
            {
              parts: [
                "Makaleye göre önceki tüm siyah bireyler adalardan geliyordu. 1986’da Muğla’daki Yassıca ve Sarıot adalarından tanımlandılar. 2018’de Yunan adası Meis’te (Kastellorizo) bir genç ve bir ergin, 2025’te ise Sembe’de (Symi) bir ergin kaydedildi. Antalya yılanı anakaradan ilk böyle kayıt.",
              ],
              type: "p",
            },
            FIGURE_MAP,
          ],
          heading: "Neden önemli?",
        },
        {
          blocks: [
            {
              parts: [
                "Yazarlar iki açıklamayı tartışıyor. Termal melanizme göre koyu hayvanlar serin iklimde daha hızlı ısındıkları için avantajlıdır. Gloger kuralına göre ise koyu renk sıcak ve nemli yerlerde beklenir: orada bitki örtüsü daha sık, toprak daha koyudur ve koyu bir hayvan daha iyi gizlenir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Çağman–Demre ve önceki ada kayıtlarının hepsi görece nemli bir Akdeniz kıyı iklimine sahip. Yazarlara göre bu tek bulgu, termal melanizmden çok Gloger kuralına uyuyor. Ancak tek bir kaydın iki hipotezi de sınayamayacağını ve siyah rengin nadir, uyumsal olmayan bir mutasyon olabileceğini ekliyorlar: güney Anadolu’da hâlâ olağan açık renkli form baskın. Anakarada ve yakın adalarda daha fazla örnekleme yapılmasını öneriyorlar.",
              ],
              type: "p",
            },
          ],
          heading: "Neden siyah?",
        },
        {
          blocks: [
            {
              parts: [
                "Halkalı başlı cüce yılan Gürcistan faunasının bir parçası. Gürcistan amfibi ve sürüngenlerinin 2026 kontrol listesi onu doğu ve orta Gürcistan için veriyor; belgelenmiş yerlerden biri Tiflis. Kuru, taşlık yerlerde yaşayan, gündüzleri çoğu zaman yassı taşların altına saklanan küçük ve zararsız bir yılan.",
              ],
              type: "p",
            },
            {
              parts: [
                "Makale Gürcistan popülasyonlarını incelemiyor ve Gürcistan’dan siyah bir birey bildirmiyor. Tür hakkında daha fazlası profilinde ve ",
                { id: "snakes", label: "yılanlar sayfasında", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Gürcistan’la bağlantısı ne?",
        },
      ],
      title:
        "Siyah halkalı başlı cüce yılan: Anadolu anakarasında ilk melanistik kayıt",
    },
  },
  gallery: [PHOTO_HEAD, PHOTO_MAP],
  id: "melanistic-eirenis-modestus-anatolia",
  image: PHOTO_SPECIMEN,
  publishedAt: "2026-10-16",
  relatedHubIds: ["snakes"],
  relatedRegionIds: [],
  relatedSpeciesIds: ["eirenis-modestus"],
  slug: "melanistic-eirenis-modestus-anatolia",
  sources: [
    {
      name: "Korkmaz et al. 2026 — A melanistic Eirenis modestus from the Anatolian mainland (Caucasiana)",
      url: PAPER_URL,
    },
    {
      name: "Korkmaz et al. 2026 — PDF",
      url: PAPER_PDF_URL,
    },
    {
      name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia’s amphibians and reptiles",
      url: CHECKLIST_URL,
    },
  ],
  status: "published",
};
