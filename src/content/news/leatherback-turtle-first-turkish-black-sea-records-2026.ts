import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const BLACK_SEA_PAPER_URL =
  "https://blackmeditjournal.org/volumes-archive/vol-32-2026/vol-32-2026-no-1/first-records-of-leatherback-turtle-dermochelys-coriacea-in-the-black-sea-turkiye/";
const ISTANBUL_STRAIT_PAPER_URL =
  "https://blackmeditjournal.org/wp-content/uploads/5-2024-2_152-159.pdf";
const NOAA_URL = "https://www.fisheries.noaa.gov/species/leatherback-turtle";
const PHOTO_DIR =
  "/images/news/leatherback-turtle-first-turkish-black-sea-records-2026";

const PHOTO_LEATHERBACK: NewsPhoto = {
  alt: {
    en: "A leatherback sea turtle underwater.",
    ka: "ტყავისებრი ზღვის კუ წყალქვეშ.",
    ru: "Кожистая морская черепаха под водой.",
    tr: "Sualtinda bir deri sirtli deniz kaplumbagasi.",
  },
  src: `${PHOTO_DIR}/leatherback-turtle.png`,
};

export const LEATHERBACK_TURTLE_FIRST_TURKISH_BLACK_SEA_RECORDS_2026: NewsArticle =
  {
    copy: {
      en: {
        dek: "A new paper describes the first confirmed records of the leatherback turtle on Turkey's Black Sea coast. One animal was found dead in Sakarya in 2025, and another was seen alive off Rize in April 2026.",
        lead: "The world's largest living sea turtle has now been officially confirmed from Turkey's Black Sea coast. A 2026 paper in the Journal of the Black Sea / Mediterranean Environment reports two records of the leatherback turtle (Dermochelys coriacea).",
        metaDescription:
          "Leatherback turtle has been confirmed for the first time from Turkey's Black Sea coast, including a live animal seen near Rize in 2026.",
        metaTitle:
          "Leatherback turtle in the Black Sea - first Turkish records",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "According to the authors, these are the first confirmed records of ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  " from Turkey's Black Sea coast.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The second record is especially relevant regionally: a live leatherback was observed on 7 April 2026 off Rize Province, in the eastern Black Sea. That makes the record interesting for the wider context of Georgia's Black Sea coast, although it is not a Georgian record.",
                ],
                type: "p",
              },
            ],
            heading: "What the study confirmed",
          },
          {
            blocks: [
              {
                parts: [
                  "The first case was recorded on 13 April 2025, when a female leatherback turtle was found dead on Karasu Beach in Sakarya Province on Turkey's western Black Sea coast. Researchers performed a necropsy, including external and internal examination, morphometrics, and biological sampling.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The second case followed almost a year later. On 7 April 2026, a live leatherback turtle was observed near the coast of Rize Province. The authors treat the two cases together as the first confirmed leatherback records for Turkey's Black Sea coast and note that they are the northernmost confirmed records of the species in Turkish seas.",
                ],
                type: "p",
              },
            ],
            heading: "Two Black Sea records",
          },
          {
            blocks: [
              {
                parts: [
                  "Leatherbacks are the largest living sea turtles. Unlike hard-shelled sea turtles, they have a dense, rubbery skin over the body surface, which gives the species its English name. They move over very long distances and feed largely on soft-bodied marine animals, including jellyfish.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The Black Sea is not part of the species' usual regular range. Historically, sea turtle records in the region are rare, with occasional records better known for loggerhead turtles (",
                  { name: "Caretta caretta", type: "sci" },
                  ") and green turtles (",
                  { name: "Chelonia mydas", type: "sci" },
                  ").",
                ],
                type: "p",
              },
            ],
            heading: "Why the record is unusual",
          },
          {
            blocks: [
              {
                parts: [
                  "This paper does not confirm ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  " from Georgia. It documents two cases from Turkey's Black Sea coast. The Rize observation matters for Georgia because it comes from the eastern Black Sea, but a confirmed record from Georgia's coast would still be needed before adding the species to Georgia's fauna.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The authors also discuss plastic pollution in the Black Sea as a growing threat. They do not identify plastic as the cause of death for the dead individual, but floating plastic can be important for leatherbacks because some debris can resemble soft-bodied prey.",
                ],
                type: "p",
              },
            ],
            heading: "What it means for Georgia",
          },
          {
            blocks: [
              {
                parts: [
                  {
                    href: BLACK_SEA_PAPER_URL,
                    label:
                      "First records of leatherback turtle Dermochelys coriacea in the Black Sea, Turkiye",
                    type: "external",
                  },
                  ". ",
                  { name: "Journal of the Black Sea / Mediterranean Environment", type: "sci" },
                  ", 2026.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ISTANBUL_STRAIT_PAPER_URL,
                    label: "2024 Istanbul Strait record",
                    type: "external",
                  },
                  " and ",
                  {
                    href: NOAA_URL,
                    label: "NOAA Fisheries species profile",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Sources",
          },
        ],
        title:
          "World's largest sea turtle confirmed for the first time in Turkey's Black Sea",
      },
      ka: {
        dek: "ახალი კვლევა ტყავისებრი ზღვის კუს თურქეთის შავი ზღვის სანაპიროზე პირველ დადასტურებულ ჩანაწერებს აღწერს. ერთი ინდივიდი 2025 წელს საკარიაში მკვდარი იპოვეს, მეორე კი 2026 წლის აპრილში რიზეს სანაპიროსთან ცოცხლად ნახეს.",
        lead: "მსოფლიოში ყველაზე დიდი თანამედროვე ზღვის კუ თურქეთის შავი ზღვის სანაპიროზე პირველად ოფიციალურად დაადასტურეს. 2026 წელს Journal of the Black Sea / Mediterranean Environment-ში გამოქვეყნებული კვლევა ტყავისებრი ზღვის კუს (Dermochelys coriacea) ორ შემთხვევას აღწერს.",
        metaDescription:
          "ტყავისებრი ზღვის კუ თურქეთის შავი ზღვის სანაპიროზე პირველად დაადასტურეს. ერთი ცოცხალი ინდივიდი 2026 წელს რიზესთან დაფიქსირდა.",
        metaTitle: "ტყავისებრი კუ შავ ზღვაში — პირველი ჩანაწერები თურქეთში",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "კვლევის ავტორების მიხედვით, ეს ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  "-ს პირველი დადასტურებული ჩანაწერებია თურქეთის შავი ზღვის სანაპიროდან.",
                ],
                type: "p",
              },
              {
                parts: [
                  "განსაკუთრებით საინტერესოა მეორე შემთხვევა: ცოცხალი ტყავისებრი კუ 2026 წლის 7 აპრილს რიზეს პროვინციის სანაპიროსთან შენიშნეს. რიზე აღმოსავლეთ შავი ზღვის რეგიონში მდებარეობს, რის გამოც ეს ჩანაწერი საქართველოს შავი ზღვის სანაპიროს კონტექსტშიც საინტერესოა.",
                ],
                type: "p",
              },
            ],
            heading: "რა დაადასტურა კვლევამ?",
          },
          {
            blocks: [
              {
                parts: [
                  "პირველი შემთხვევა 2025 წლის 13 აპრილს დაფიქსირდა. მდედრი ტყავისებრი ზღვის კუ საკარიის პროვინციაში, Karasu Beach-ზე, თურქეთის დასავლეთ შავი ზღვის სანაპიროზე მკვდარი იპოვეს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "მკვლევრებმა ცხოველს დეტალური ნეკროპსია ჩაუტარეს. კვლევა მოიცავდა სხეულის გარეგნულ და შინაგან გამოკვლევას, მორფომეტრიულ გაზომვებსა და ბიოლოგიური ნიმუშების აღებას.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ეს შემთხვევა მნიშვნელოვანი გახდა, რადგან ტყავისებრი კუ თურქეთის წყლებში ძალიან იშვიათი და არარეგულარული სტუმარია. სახეობა თურქეთში ძირითადად ხმელთაშუა ზღვიდანაა ცნობილი და უფრო იშვიათად გვხვდება ეგეოსის ზღვაში.",
                ],
                type: "p",
              },
            ],
            heading: "პირველი შემთხვევა — მკვდარი კუ საკარიის სანაპიროზე",
          },
          {
            blocks: [
              {
                parts: [
                  "მეორე და საქართველოსთვის გეოგრაფიულად უფრო საინტერესო შემთხვევა თითქმის ერთი წლის შემდეგ დაფიქსირდა. 2026 წლის 7 აპრილს ცოცხალი ტყავისებრი კუ რიზეს პროვინციის სანაპიროსთან შენიშნეს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ეს უკვე თურქეთის აღმოსავლეთ შავი ზღვის სანაპიროა. კვლევის ავტორები ორივე შემთხვევას ერთად ტყავისებრი ზღვის კუს თურქეთის შავი ზღვის სანაპიროზე პირველ დადასტურებულ ჩანაწერებად განიხილავენ.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ამავე დროს, ისინი აღნიშნავენ, რომ ეს თურქეთის ზღვებში სახეობის ყველაზე ჩრდილოეთით დადასტურებული შემთხვევებია. მანამდე, 2024 წლის ივლისში, ცოცხალი ტყავისებრი კუ სტამბოლის სრუტეში, ბოსფორში, იყო დაფიქსირებული, თუმცა ეს ჩანაწერი მარმარილოს ზღვას უკავშირდებოდა და არა უშუალოდ შავი ზღვის თურქულ სანაპიროს.",
                ],
                type: "p",
              },
            ],
            heading: "მეორე კუ რიზესთან ცოცხლად ნახეს",
          },
          {
            blocks: [
              {
                parts: [
                  "ტყავისებრი ზღვის კუ (",
                  { name: "Dermochelys coriacea", type: "sci" },
                  ") დღეს მცხოვრებ ზღვის კუებს შორის ყველაზე დიდია. მისი აგებულებაც სხვა ზღვის კუებისგან მნიშვნელოვნად განსხვავდება.",
                ],
                type: "p",
              },
              {
                parts: [
                  "სახეობას ჩვეულებრივი მყარი, ფირფიტებიანი ბაკანი არ აქვს. მისი სხეულის ზედაპირი მკვრივი, რეზინისმაგვარი კანითაა დაფარული, რის გამოც ინგლისურად Leatherback turtle ეწოდება.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ტყავისებრი კუები განსაკუთრებით შორ მანძილებზე გადაადგილების უნარითაც გამოირჩევიან და ოკეანეებში ძალიან ფართო გავრცელება აქვთ. მათი საკვების მნიშვნელოვანი ნაწილი რბილსხეულიანი ზღვის ორგანიზმებია, მათ შორის მედუზები.",
                ],
                type: "p",
              },
              {
                parts: [
                  "შავ ზღვაში კი ეს სახეობა ტიპური ან რეგულარული ბინადარი არ არის. სწორედ ამიტომ თურქეთის შავი ზღვის სანაპიროზე ორი დადასტურებული შემთხვევა მეცნიერებისთვის საინტერესო ჩანაწერია.",
                ],
                type: "p",
              },
            ],
            heading: "რა არის ტყავისებრი ზღვის კუ?",
          },
          {
            blocks: [
              {
                parts: [
                  "ტყავისებრი კუები მსოფლიოს ტროპიკულ, სუბტროპიკულ და ზომიერი სარტყლის მრავალ ზღვასა და ოკეანეში გვხვდება და შეუძლიათ შედარებით ცივ წყლებშიც შორ მანძილზე გადაადგილება. თუმცა შავი ზღვა მათი ჩვეულებრივი გავრცელების ძირითად არეალს არ წარმოადგენს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ისტორიულად შავ ზღვაში ზღვის კუების ჩანაწერები იშვიათია. რეგიონში უფრო ცნობილია ჩვეულებრივი ზღვის კუს (",
                  { name: "Caretta caretta", type: "sci" },
                  ") და მწვანე ზღვის კუს (",
                  { name: "Chelonia mydas", type: "sci" },
                  ") შემთხვევითი ჩანაწერები.",
                ],
                type: "p",
              },
              {
                parts: [
                  { name: "Dermochelys coriacea", type: "sci" },
                  "-ს თურქეთის შავი ზღვის სანაპიროზე დადასტურება ამიტომ ამ სახეობის გავრცელების შესახებ არსებულ მონაცემებს მნიშვნელოვან ახალ დეტალს ამატებს. კვლევის ავტორები აღნიშნავენ, რომ ასეთი შემთხვევების გაგრძელებული მონიტორინგი განსაკუთრებით მნიშვნელოვანია იშვიათი და შემთხვევითი სტუმარი ზღვის მეგაფაუნის უკეთ შესასწავლად.",
                ],
                type: "p",
              },
            ],
            heading: "რატომ არის შავი ზღვის ჩანაწერი უჩვეულო?",
          },
          {
            blocks: [
              {
                parts: [
                  "ამ ეტაპზე ამ კვლევის საფუძველზე საქართველოში ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  "-ს არსებობის დადასტურება არ შეიძლება. კვლევა აღწერს მხოლოდ თურქეთის შავი ზღვის სანაპიროზე დაფიქსირებულ ორ შემთხვევას.",
                ],
                type: "p",
              },
              {
                parts: [
                  "რიზეს ჩანაწერი საქართველოსთვის საინტერესოა სწორედ იმიტომ, რომ აღმოსავლეთ შავ ზღვაში მოხდა, თუმცა ერთი ასეთი დაკვირვება არ ნიშნავს, რომ სახეობა საქართველოს ტერიტორიულ წყლებში უკვე გვხვდება ან რეგულარულად შემოდის.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ტყავისებრი კუ ახლა დადასტურებულია თურქეთის აღმოსავლეთ შავი ზღვის სანაპიროზეც, მაგრამ საქართველოში ამ კვლევით ჩანაწერი არ დასტურდება. ასეთი დასკვნისთვის საქართველოს სანაპიროდან დადასტურებული ჩანაწერი იქნება საჭირო.",
                ],
                type: "p",
              },
            ],
            heading: "ნიშნავს ეს, რომ ტყავისებრი კუ საქართველოშიც შეიძლება გამოჩნდეს?",
          },
          {
            blocks: [
              {
                parts: [
                  "კვლევის ავტორები ყურადღებას ამახვილებენ შავ ზღვაში პლასტმასის დაბინძურების პრობლემაზეც. ტყავისებრი კუებისთვის პლასტმასის ნარჩენები განსაკუთრებით მნიშვნელოვანი საფრთხეა, რადგან მათი საკვების მნიშვნელოვან ნაწილს მედუზები და სხვა რბილსხეულიანი ორგანიზმები წარმოადგენს და მცურავი პლასტმასის ზოგი ფორმა შესაძლოა საკვებად აღიქვან.",
                ],
                type: "p",
              },
              {
                parts: [
                  "კვლევა კონკრეტული ინდივიდის სიკვდილის მიზეზად პლასტმასს არ ასახელებს. თუმცა ავტორები აღნიშნავენ, რომ პლასტმასის დაბინძურება შავ ზღვაში მზარდ საფრთხეს წარმოადგენს და შესაძლოა იშვიათ და შემთხვევით შემოსულ ზღვის სახეობებზეც მოქმედებდეს.",
                ],
                type: "p",
              },
            ],
            heading: "პლასტმასის ნარჩენების პრობლემა",
          },
          {
            blocks: [
              {
                parts: [
                  "საქართველოს დასავლეთ საზღვარს შავი ზღვა ქმნის და ქვეყნის სანაპირო იმავე აღმოსავლეთ შავი ზღვის ეკოსისტემის ნაწილია. ამიტომ რიზესთან დაფიქსირებული ცოცხალი ტყავისებრი კუ რეგიონული ბიომრავალფეროვნების თვალსაზრისით საინტერესო შემთხვევაა.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ეს არ ნიშნავს, რომ სახეობა უკვე საქართველოს ფაუნის სიაში უნდა დაემატოს. მაგრამ ასეთი უჩვეულო ჩანაწერები აჩვენებს, რომ შავი ზღვის სანაპიროზე მსხვილი და ფართოდ მოძრავი ზღვის ცხოველების დაკვირვება და სწორად დოკუმენტირება მნიშვნელოვანია.",
                ],
                type: "p",
              },
              {
                parts: [
                  "თუ მომავალში ტყავისებრი ზღვის კუ საქართველოს სანაპიროსთანაც სანდოდ დაფიქსირდება, ასეთი ჩანაწერის დასადასტურებლად განსაკუთრებით მნიშვნელოვანი იქნება ფოტო ან ვიდეო, ზუსტი თარიღი და ადგილი და შესაბამისი სპეციალისტების შეფასება. საქართველოს კუების არსებული გვერდი შეგიძლიათ ნახოთ ",
                  { id: "turtles", label: "კუების ჰაბში", type: "hub" },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "რატომ არის ეს საინტერესო საქართველოსთვის?",
          },
        ],
        title:
          "მსოფლიოს ყველაზე დიდი ზღვის კუ პირველად დაადასტურეს თურქეთის შავ ზღვაში",
      },
      ru: {
        dek: "Новая статья описывает первые подтвержденные находки кожистой черепахи на турецком побережье Черного моря. Одну особь нашли мертвой в Сакарье в 2025 году, другую живой наблюдали у Ризе в апреле 2026 года.",
        lead: "Крупнейшая современная морская черепаха впервые официально подтверждена на турецком побережье Черного моря. Работа 2026 года в Journal of the Black Sea / Mediterranean Environment описывает два случая кожистой черепахи (Dermochelys coriacea).",
        metaDescription:
          "Кожистая черепаха впервые подтверждена на турецком побережье Черного моря, включая живую особь у Ризе в 2026 году.",
        metaTitle:
          "Кожистая черепаха в Черном море - первые записи в Турции",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "По данным авторов, это первые подтвержденные записи ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  " с турецкого побережья Черного моря.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Особенно интересна вторая находка: 7 апреля 2026 года живую кожистую черепаху наблюдали у провинции Ризе в восточной части Черного моря. Для Грузии это важно в региональном контексте, хотя сама запись не является грузинской.",
                ],
                type: "p",
              },
            ],
            heading: "Что подтвердило исследование",
          },
          {
            blocks: [
              {
                parts: [
                  "Первый случай зарегистрирован 13 апреля 2025 года: самку кожистой черепахи нашли мертвой на пляже Карасу в провинции Сакарья, на западном черноморском побережье Турции. Исследователи провели некропсию, морфометрические измерения и отбор биологических образцов.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Второй случай произошел почти через год. 7 апреля 2026 года живую кожистую черепаху наблюдали у побережья провинции Ризе. Авторы рассматривают оба случая как первые подтвержденные записи вида для турецкого побережья Черного моря и отмечают, что это самые северные подтвержденные записи вида в морях Турции.",
                ],
                type: "p",
              },
            ],
            heading: "Две черноморские записи",
          },
          {
            blocks: [
              {
                parts: [
                  "Кожистые черепахи - крупнейшие современные морские черепахи. В отличие от видов с твердым панцирем, поверхность их тела покрыта плотной, кожистой тканью. Они способны к дальним перемещениям и питаются в основном мягкотелыми морскими организмами, включая медуз.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Черное море не является обычной регулярной частью ареала вида. Исторически записи морских черепах здесь редки; чаще упоминаются случайные находки логгерхеда (",
                  { name: "Caretta caretta", type: "sci" },
                  ") и зеленой черепахи (",
                  { name: "Chelonia mydas", type: "sci" },
                  ").",
                ],
                type: "p",
              },
            ],
            heading: "Почему запись необычна",
          },
          {
            blocks: [
              {
                parts: [
                  "Эта статья не подтверждает ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  " для Грузии. Она описывает два случая на турецком побережье Черного моря. Наблюдение у Ризе важно для Грузии потому, что относится к восточной части Черного моря, но для включения вида в фауну Грузии нужна подтвержденная запись с грузинского побережья.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Авторы также обращают внимание на пластиковое загрязнение Черного моря. Они не называют пластик причиной гибели найденной особи, но для кожистых черепах плавающий пластик особенно опасен, поскольку может напоминать мягкотелую добычу.",
                ],
                type: "p",
              },
            ],
            heading: "Что это значит для Грузии",
          },
          {
            blocks: [
              {
                parts: [
                  {
                    href: BLACK_SEA_PAPER_URL,
                    label:
                      "First records of leatherback turtle Dermochelys coriacea in the Black Sea, Turkiye",
                    type: "external",
                  },
                  ". ",
                  { name: "Journal of the Black Sea / Mediterranean Environment", type: "sci" },
                  ", 2026.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ISTANBUL_STRAIT_PAPER_URL,
                    label: "запись из Стамбульского пролива 2024 года",
                    type: "external",
                  },
                  " и ",
                  {
                    href: NOAA_URL,
                    label: "профиль вида NOAA Fisheries",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Источники",
          },
        ],
        title:
          "Крупнейшую морскую черепаху мира впервые подтвердили в турецком Черном море",
      },
      tr: {
        dek: "Yeni bir calisma, deri sirtli deniz kaplumbagasinin Turkiye'nin Karadeniz kiyilarindaki ilk dogrulanmis kayitlarini acikliyor. Bir birey 2025'te Sakarya'da olu bulundu, digeri Nisan 2026'da Rize aciklarinda canli goruldu.",
        lead: "Dunyanin yasayan en buyuk deniz kaplumbagasi Turkiye'nin Karadeniz kiyisindan ilk kez resmi olarak dogrulandi. Journal of the Black Sea / Mediterranean Environment'ta yayimlanan 2026 tarihli calisma, deri sirtli deniz kaplumbagasina (Dermochelys coriacea) ait iki kaydi bildiriyor.",
        metaDescription:
          "Deri sirtli deniz kaplumbagasi Turkiye'nin Karadeniz kiyisindan ilk kez dogrulandi; 2026'da Rize yakininda canli bir birey de goruldu.",
        metaTitle:
          "Karadeniz'de deri sirtli kaplumbaga - Turkiye'deki ilk kayitlar",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "Yazarlara gore bunlar ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  " icin Turkiye'nin Karadeniz kiyisindan ilk dogrulanmis kayitlar.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Ikinci kayit bolgesel acidan ozellikle onemli: 7 Nisan 2026'da Dogu Karadeniz'deki Rize ili aciklarinda canli bir deri sirtli kaplumbaga gozlemlendi. Bu kayit Gurcistan'in Karadeniz kiyisi baglami icin ilginctir, ancak Gurcistan kaydi degildir.",
                ],
                type: "p",
              },
            ],
            heading: "Calisma neyi dogruladi",
          },
          {
            blocks: [
              {
                parts: [
                  "Ilk olay 13 Nisan 2025'te kaydedildi: Turkiye'nin bati Karadeniz kiyisindaki Sakarya ili Karasu Plaji'nda disi bir deri sirtli deniz kaplumbagasi olu bulundu. Arastirmacilar nekropsi, morfometrik olcumler ve biyolojik ornekleme yapti.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Ikinci olay neredeyse bir yil sonra geldi. 7 Nisan 2026'da Rize ili kiyisi yakininda canli bir deri sirtli kaplumbaga gozlemlendi. Yazarlar iki olayi birlikte Turkiye'nin Karadeniz kiyisi icin ilk dogrulanmis kayitlar olarak degerlendiriyor ve bunlarin Turkiye denizlerinde turun en kuzeydeki dogrulanmis kayitlari oldugunu belirtiyor.",
                ],
                type: "p",
              },
            ],
            heading: "Iki Karadeniz kaydi",
          },
          {
            blocks: [
              {
                parts: [
                  "Deri sirtli kaplumbagalar yasayan en buyuk deniz kaplumbagalaridir. Sert kabuklu deniz kaplumbagalarindan farkli olarak vucut yuzeyleri yogun, derimsi bir doku ile kaplidir. Cok uzun mesafeler kat edebilirler ve besinlerinin onemli bir bolumunu meduzeler dahil yumusak vucutlu deniz canlilari olusturur.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Karadeniz bu turun duzenli yayilis alaninin tipik bir parcasi degildir. Bolgede deniz kaplumbagasi kayitlari tarihsel olarak nadirdir; daha cok caretta caretta (",
                  { name: "Caretta caretta", type: "sci" },
                  ") ve yesil deniz kaplumbagasi (",
                  { name: "Chelonia mydas", type: "sci" },
                  ") icin rastlantisal kayitlar bilinir.",
                ],
                type: "p",
              },
            ],
            heading: "Kayit neden olagan disi",
          },
          {
            blocks: [
              {
                parts: [
                  "Bu calisma ",
                  { name: "Dermochelys coriacea", type: "sci" },
                  " turunu Gurcistan icin dogrulamaz. Yalnizca Turkiye'nin Karadeniz kiyisindaki iki olayi belgelemektedir. Rize gozlemi Dogu Karadeniz'de oldugu icin Gurcistan acisindan ilgi cekicidir, ancak turun Gurcistan faunasina eklenmesi icin Gurcistan kiyisindan dogrulanmis bir kayit gerekir.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Yazarlar Karadeniz'deki plastik kirliligine de dikkat cekiyor. Plastigi olu bireyin olum nedeni olarak gostermiyorlar, ancak yuzeydeki plastikler yumusak vucutlu avlara benzeyebildigi icin deri sirtli kaplumbagalar acisindan onemli bir risk olusturabilir.",
                ],
                type: "p",
              },
            ],
            heading: "Gurcistan icin anlami",
          },
          {
            blocks: [
              {
                parts: [
                  {
                    href: BLACK_SEA_PAPER_URL,
                    label:
                      "First records of leatherback turtle Dermochelys coriacea in the Black Sea, Turkiye",
                    type: "external",
                  },
                  ". ",
                  { name: "Journal of the Black Sea / Mediterranean Environment", type: "sci" },
                  ", 2026.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ISTANBUL_STRAIT_PAPER_URL,
                    label: "2024 Istanbul Bogazi kaydi",
                    type: "external",
                  },
                  " ve ",
                  {
                    href: NOAA_URL,
                    label: "NOAA Fisheries tur profili",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Kaynaklar",
          },
        ],
        title:
          "Dunyanin en buyuk deniz kaplumbagasi Turkiye'nin Karadeniz'inde ilk kez dogrulandi",
      },
    },
    id: "leatherback-turtle-first-turkish-black-sea-records-2026",
    image: PHOTO_LEATHERBACK,
    publishedAt: "2026-09-17",
    relatedHubIds: ["turtles"],
    relatedRegionIds: [],
    relatedSpeciesIds: [],
    slug: "leatherback-turtle-first-turkish-black-sea-records-2026",
    sources: [
      {
        name: "Journal of the Black Sea / Mediterranean Environment — original study",
        url: BLACK_SEA_PAPER_URL,
      },
      {
        name: "Journal of the Black Sea / Mediterranean Environment — 2024 İstanbul Strait record",
        url: ISTANBUL_STRAIT_PAPER_URL,
      },
      {
        name: "NOAA Fisheries — species biology",
        url: NOAA_URL,
      },
    ],
    status: "published",
    updatedAt: "2026-09-17",
  };
