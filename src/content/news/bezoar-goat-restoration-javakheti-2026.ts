import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const MEPA_SOURCE = "https://mepa.gov.ge/Ge/News/Details/27600";
const ADJARA_TV_SOURCE =
  "https://www.ajaratv.ge/news/166474-media-turi-javakhetis-datsul-teritoriebze";
const ILIAUNI_SOURCE = "https://biodiversity.iliauni.edu.ge/en/species/2356";
const APA_SOURCE =
  "https://www.apa.gov.ge/ge/protected-areas/cattestone/djavaxetis-daculi-teritoriebis-administracia";
const IUCN_SOURCE = "https://www.iucnredlist.org/species/3786/22145942";

const PHOTO_BEZOAR_GOAT: NewsPhoto = {
  alt: {
    en: "A male bezoar goat photographed in Borjomi-Kharagauli National Park. This is an atlas image, not a Javakheti release photograph.",
    ka: "მამალი ნიამორი ბორჯომ-ხარაგაულის ეროვნულ პარკში. ეს ატლასის ფოტოა და არა ჯავახეთში გაშვების კადრი.",
    ru: "Самец безоарового козла в Боржоми-Харагаульском национальном парке. Это фото из атласа, а не кадр выпуска в Джавахети.",
    tr: "Borjomi-Haragauli Milli Parkı'nda erkek yaban keçisi. Bu atlas fotoğrafıdır, Cavakheti'de salım karesi değildir.",
  },
  credit: {
    date: "2015-05-17",
    location: "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    photoConfidence: "georgia-field",
    photographer: "ვასილ გაბუნია",
  },
  src: "https://cdn.reptiles.ge/species/capra-aegagrus-gabunia-1.jpg",
};

export const BEZOAR_GOAT_RESTORATION_JAVAKHETI_2026: NewsArticle = {
  copy: {
    en: {
      dek: "The ministry says a bezoar goat restoration project is starting in Tetrobis Managed Reserve. It has not reported a release of animals at this stage.",
      lead: "Georgia's Ministry of Environmental Protection and Agriculture reported on 21 September 2026 that a bezoar goat restoration project is starting in Tetrobis Managed Reserve, in the Javakheti protected-area system. The confirmed news is the start of a coordinated project, not that animals have already been released into the wild.",
      metaDescription:
        "Georgia says a bezoar goat restoration project is starting in Tetrobis Managed Reserve. The announcement does not confirm a release.",
      metaTitle: "Bezoar goat restoration project starts in Javakheti",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The ministry says the project will be carried out jointly by the National Wildlife Agency, the Agency of Protected Areas and Tbilisi Zoo. Its stated aim is to restore the bezoar goat population and strengthen the ",
                { id: "samtskhe-javakheti", label: "Javakheti", type: "region" },
                " ecosystem.",
              ],
              type: "p",
            },
            {
              parts: [
                "The announcement does not give a calendar, number of animals, source population or release date. It also does not say that a reintroduction has already happened.",
              ],
              type: "p",
            },
          ],
          heading: "What has been announced?",
        },
        {
          blocks: [
            {
              parts: [
                "The bezoar goat (",
                { name: "Capra aegagrus", type: "sci" },
                "), Georgian ნიამორი, is a native wild goat. The atlas profile is here: ",
                { id: "capra-aegagrus", label: "bezoar goat", type: "species" },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "Reptiles.ge's species page, based on IUCN, Georgian red-list and monitoring sources, treats Georgia's confirmed breeding populations today as limited to Tusheti and northern Khevsureti. The national red list names the species as CR; IUCN assesses ",
                { name: "Capra aegagrus", type: "sci" },
                " globally as Near Threatened.",
              ],
              type: "p",
            },
          ],
          heading: "Which species is this?",
        },
        {
          blocks: [
            {
              parts: [
                "Tetrobis Managed Reserve is part of the Javakheti protected areas. The Agency of Protected Areas says it was established to protect forest massifs and local endemic plants on the Javakheti plateau, and gives its area as 3,089 hectares.",
              ],
              type: "p",
            },
            {
              parts: [
                "The official news does not explain the full site-selection assessment. That distinction matters: a selected project site is not the same thing as proof that a wild population has already been established there.",
              ],
              type: "p",
            },
          ],
          heading: "Why Tetrobis?",
        },
        {
          blocks: [
            {
              parts: [
                "No. The ministry's wording is that the project is starting. It does not report a completed release, a stable new wild population, breeding success or monitoring results from released animals.",
              ],
              type: "p",
            },
            {
              parts: [
                "In conservation practice, restoration can include source selection, veterinary checks, genetic assessment, captive breeding or adaptation, possible later release and long-term monitoring. Those are general stages of such programmes, not confirmed steps or dates for this project unless the responsible agencies publish them.",
              ],
              type: "p",
            },
          ],
          heading: "Have bezoar goats already returned to Javakheti?",
        },
      ],
      title: "Bezoar goat restoration project starts in Javakheti",
    },
    ka: {
      dek: "სამინისტროს ცნობით, თეთრობის აღკვეთილში ნიამორის აღდგენის პროექტი იწყება. ამ ეტაპზე წყაროები ცხოველების ბუნებაში გაშვებას არ ადასტურებს.",
      lead: "საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრომ 2026 წლის 21 სექტემბერს განაცხადა, რომ ჯავახეთში, თეთრობის აღკვეთილში, ნიამორის აღდგენის პროექტი იწყება. დადასტურებული ამბავი ამ ეტაპზე პროექტის დაწყებაა და არა ის, რომ ნიამორები უკვე ბუნებაში გაუშვეს.",
      metaDescription:
        "თეთრობის აღკვეთილში ნიამორის აღდგენის პროექტი იწყება. რა არის ცნობილი და რას არ ნიშნავს პროექტის დაწყება ჯავახეთში.",
      metaTitle: "ჯავახეთში ნიამორის აღდგენის პროექტი იწყება",
      sections: [
        {
          blocks: [
            {
              parts: [
                "სამინისტროს განცხადება ",
                {
                  id: "samtskhe-javakheti",
                  label: "ჯავახეთის დაცულ ტერიტორიებზე",
                  type: "region",
                },
                " გამართულ მედიატურს უკავშირდება. ტექსტში ნათქვამია, რომ ჯავახეთის ბუნებრივი მემკვიდრეობის დაცვის მიმართულებით, თეთრობის აღკვეთილში ნიამორის აღდგენის პროექტი იწყება. პროექტს კოორდინირებულად განახორციელებენ ველური ბუნების ეროვნული სააგენტო, დაცული ტერიტორიების სააგენტო და თბილისის ზოოპარკი.",
              ],
              type: "p",
            },
            {
              parts: [
                "ოფიციალურად დასახელებული მიზანია ნიამორის პოპულაციის აღდგენა და ჯავახეთის ეკოსისტემის გაძლიერება. ეს ფორმულირება მნიშვნელოვანი დასაწყისია, მაგრამ ჯერ არ არის ტექნიკური გეგმა: განცხადებაში არ არის მითითებული ცხოველების რაოდენობა, წარმომავლობა, გადაყვანის თარიღი, ვეტერინარული ან გენეტიკური კრიტერიუმები, გაშვების მეთოდი ან მონიტორინგის კალენდარი.",
              ],
              type: "p",
            },
            {
              parts: [
                "აჭარის საზოგადოებრივი მაუწყებლის მასალაც იმავე მთავარ ფაქტს იმეორებს: თეთრობის აღკვეთილში პროექტი იწყება და მას სამი ინსტიტუცია განახორციელებს. არც ამ წყაროში ჩანს, რომ ნიამორები უკვე გადაყვანილია ან ბუნებაშია გაშვებული.",
              ],
              type: "p",
            },
          ],
          heading: "რა პროექტი იწყება ჯავახეთში?",
        },
        {
          blocks: [
            {
              parts: [
                "ნიამორი (",
                { name: "Capra aegagrus", type: "sci" },
                ") ველური თხაა ძროხისებრთა ოჯახიდან. ინგლისურად მას wild goat-ს ან bezoar goat-ს უწოდებენ. Reptiles.ge-ის ატლასში სახეობის ძირითადი პროფილია ",
                { id: "capra-aegagrus", label: "ნიამორი", type: "species" },
                ", სადაც ცალკეა თავმოყრილი ტაქსონომია, გავრცელება, საფრთხეები და ფოტო-მასალა.",
              ],
              type: "p",
            },
            {
              parts: [
                "ატლასის პროფილისა და გამოყენებული წყაროების მიხედვით, საქართველოში დღეს დადასტურებული გამრავლების პოპულაციები თუშეთსა და ჩრდილოეთ ხევსურეთშია შეზღუდული. IUCN სახეობას გლობალურად Near Threatened-ად აფასებს, ხოლო საქართველოს 2014 წლის წითელ ნუსხაში ნიამორი კრიტიკული საფრთხის ქვეშ მყოფად არის შეტანილი.",
              ],
              type: "p",
            },
            {
              parts: [
                "ნიამორი მთის ციცაბო, კლდოვან და ხშირად ტყიან ფერდობებთანაა დაკავშირებული. მისი კონსერვაცია მხოლოდ ერთი ლამაზი ცხოველის დაბრუნებას არ ნიშნავს: მცირე და იზოლირებული პოპულაციებისთვის მნიშვნელოვანია დაცული ჰაბიტატი, ბრაკონიერობის კონტროლი, შინაური პირუტყვის დაავადებების რისკის მართვა და ხანგრძლივი დაკვირვება.",
              ],
              type: "p",
            },
          ],
          heading: "ვინ არის ნიამორი?",
        },
        {
          blocks: [
            {
              parts: [
                "დაცული ტერიტორიების სააგენტოს აღწერით, თეთრობის აღკვეთილი სამხრეთ საქართველოში, მცირე კავკასიონზე მდებარეობს და ჯავახეთის ზეგანზე არსებული ტყის მასივებისა და ლოკალური ენდემების დაცვის მიზნით შეიქმნა. სააგენტო მის ფართობს 3,089 ჰექტრად ასახელებს და წერს, რომ აღკვეთილს ჯავახეთის დაცული ტერიტორიების ადმინისტრაცია მართავს.",
              ],
              type: "p",
            },
            {
              parts: [
                "თეთრობა ჯავახეთისთვის უჩვეულო ფლორისტული კერაა: სააგენტოს ტექსტში ის ადგილობრივ ენდემურ მცენარეებთან და შემორჩენილ ფიჭვნართან არის დაკავშირებული. სამინისტრო სწორედ ამ ტერიტორიას ასახელებს ნიამორის აღდგენის პროექტის ადგილად, თუმცა განცხადებაში არ ხსნის, რა დეტალური ეკოლოგიური შეფასებით შეირჩა იგი.",
              ],
              type: "p",
            },
            {
              parts: [
                "ამიტომ აქ სიფრთხილეა საჭირო: ოფიციალური წყარო ადასტურებს ტერიტორიის შერჩევას და პროექტის დაწყებას, მაგრამ არ გვაძლევს საფუძველს, დავწეროთ, რომ თეთრობაში უკვე ჩამოყალიბდა ველური ნიამორის ახალი ჯგუფი.",
              ],
              type: "p",
            },
          ],
          heading: "რატომ თეთრობის აღკვეთილი?",
        },
        {
          blocks: [
            {
              parts: [
                "ველური ცხოველის პოპულაციის აღდგენა ერთჯერადი მოქმედება არ არის. ზოგად კონსერვაციულ პრაქტიკაში ასეთი პროგრამა შეიძლება მოიცავდეს შესაფერისი ინდივიდების შერჩევას, ვეტერინარულ შემოწმებას, გენეტიკურ შეფასებას, გამრავლებას ტყვეობაში, ადაპტაციის პერიოდს, შესაძლო ეტაპობრივ გაშვებას და შემდეგ GPS ან სხვა მეთოდებით ხანგრძლივ მონიტორინგს.",
              ],
              type: "p",
            },
            {
              parts: [
                "ეს ჩამონათვალი ამ კონკრეტული პროექტის დამტკიცებული კალენდარი არ არის. სამინისტროს განცხადებაში ეტაპები დეტალურად არ არის აღწერილი. ცნობილი მხოლოდ ისაა, რომ პროექტს სამი ინსტიტუცია კოორდინირებულად განახორციელებს და მისი მიზანი ნიამორის პოპულაციის აღდგენად არის დასახელებული.",
              ],
              type: "p",
            },
            {
              parts: [
                "განსაკუთრებით მნიშვნელოვანია თბილისის ზოოპარკის როლის სწორად წაკითხვა. მისი მონაწილეობა შეიძლება მიუთითებდეს ტყვეობაში მოვლასთან, ვეტერინარიასთან ან გამრავლებასთან დაკავშირებულ კომპეტენციაზე, მაგრამ ოფიციალურ ტექსტში კონკრეტული ინდივიდების წყარო, breeding-ის გეგმა ან soft release-ის მეთოდი არ არის გამოქვეყნებული.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს პოპულაციის აღდგენა?",
        },
        {
          blocks: [
            {
              parts: [
                "არა — პროექტის გამოცხადება ჯერ არ ნიშნავს, რომ ნიამორები უკვე ბუნებაში გაუშვეს. არც სამინისტროს და არც აჭარის საზოგადოებრივი მაუწყებლის ტექსტში არ წერია, რომ ცხოველების გადაყვანა ან რეალური release უკვე მოხდა.",
              ],
              type: "p",
            },
            {
              parts: [
                "ამ ეტაპზე დადასტურებულია პროექტის დაწყება, მონაწილე ორგანიზაციები და ზოგადი მიზანი. არ არის დადასტურებული კონკრეტული რაოდენობა, სქესი, ასაკი, წარმომავლობა, გაშვების თარიღი ან ის, რომ ჯავახეთში უკვე არსებობს სტაბილური, გამრავლების უნარის მქონე ველური პოპულაცია.",
              ],
              type: "p",
            },
            {
              parts: [
                "ეს განსხვავება მხოლოდ სიტყვების თამაში არ არის. რეინტროდუქციის ან აღდგენის პროგრამის წარმატება წლების განმავლობაში ფასდება: გადარჩენით, გამრავლებით, სივრცის გამოყენებით, ადამიანთან კონფლიქტის რისკით და იმით, რჩება თუ არა პოპულაცია ბუნებაში დამატებითი მუდმივი ჩარევის გარეშე.",
              ],
              type: "p",
            },
          ],
          heading: "დაბრუნდნენ უკვე ნიამორები ჯავახეთში?",
        },
        {
          blocks: [
            {
              parts: [
                "შემდეგი ეტაპების ზუსტი კალენდარი ამ ეტაპზე გამოქვეყნებული არ არის. თუ პროექტი კლასიკურ აღდგენის გზას გაჰყვება, საზოგადოებისთვის ყველაზე მნიშვნელოვანი დასაზუსტებელი საკითხები იქნება: საიდან შეირჩევიან ინდივიდები, რა ჯანმრთელობისა და გენეტიკური კრიტერიუმები იმუშავებს, იქნება თუ არა წინასწარი ადაპტაცია, როგორ დაიგეგმება შესაძლო გაშვება და როგორ გამოქვეყნდება მონიტორინგის შედეგები.",
              ],
              type: "p",
            },
            {
              parts: [
                "მანამდე ყველაზე ზუსტი ფორმულირებაა: თეთრობის აღკვეთილში ნიამორის აღდგენის პროექტი იწყება. ეს მნიშვნელოვანი ბუნებისდაცვითი ამბავია, მაგრამ პოპულაციის აღდგენა ჯერ დასაწყისია და არა დასრულებული შედეგი.",
              ],
              type: "p",
            },
          ],
          heading: "რა შეიძლება მოხდეს შემდეგ?",
        },
        {
          blocks: [
            {
              parts: [
                "დადასტურებულია: 2026 წლის 21 სექტემბერს სამინისტრომ პროექტის დაწყება გამოაცხადა; ადგილად დასახელებულია თეთრობის აღკვეთილი; მონაწილეებად დასახელებულია ველური ბუნების ეროვნული სააგენტო, დაცული ტერიტორიების სააგენტო და თბილისის ზოოპარკი; მიზნად დასახელებულია ნიამორის პოპულაციის აღდგენა და ჯავახეთის ეკოსისტემის გაძლიერება.",
              ],
              type: "p",
            },
            {
              parts: [
                "ჯერ არ არის დადასტურებული: ბუნებაში ცხოველების გაშვება; სტაბილური ველური პოპულაციის შექმნა; breeding success; კონკრეტული რაოდენობა; ცხოველების წარმომავლობა; გრძელვადიანი მონიტორინგის გამოქვეყნებული გეგმა.",
              ],
              type: "p",
            },
          ],
          heading: "რა ვიცით და რა ჯერ არა",
        },
      ],
      title: "ჯავახეთში ნიამორის პოპულაციის აღდგენის პროექტი იწყება",
    },
    ru: {
      dek: "Министерство сообщает о начале проекта восстановления безоарового козла в заказнике Тетроби. Выпуск животных пока не подтвержден.",
      lead: "21 сентября 2026 года Министерство охраны окружающей среды и сельского хозяйства Грузии сообщило, что в заказнике Тетроби, в Джавахети, начинается проект восстановления безоарового козла. Подтвержденный факт сейчас — старт проекта, а не выпуск животных в природу.",
      metaDescription:
        "В заказнике Тетроби начинается проект восстановления безоарового козла. Объявление пока не подтверждает выпуск животных.",
      metaTitle: "В Джавахети начинается проект восстановления безоарового козла",
      sections: [
        {
          blocks: [
            {
              parts: [
                "По заявлению министерства, проект координированно будут вести Национальное агентство дикой природы, Агентство охраняемых территорий и Тбилисский зоопарк. Цель названа как восстановление популяции безоарового козла и укрепление экосистемы ",
                { id: "samtskhe-javakheti", label: "Джавахети", type: "region" },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "В сообщении нет числа животных, источника особей, даты перевозки или выпуска. Поэтому корректная формулировка сейчас: проект начинается; реинтродукция как совершившийся факт не описана.",
              ],
              type: "p",
            },
          ],
          heading: "Что объявлено?",
        },
        {
          blocks: [
            {
              parts: [
                "Безоаровый козел (",
                { name: "Capra aegagrus", type: "sci" },
                "), по-грузински ნიამორი, — местный дикий козел. Профиль вида в атласе: ",
                { id: "capra-aegagrus", label: "безоаровый козел", type: "species" },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "Профиль Reptiles.ge на основе IUCN, Красного списка Грузии и мониторинговых источников указывает, что подтвержденные размножающиеся популяции в Грузии сейчас ограничены Тушети и северной Хевсурети. IUCN оценивает ",
                { name: "Capra aegagrus", type: "sci" },
                " как Near Threatened; в национальном списке Грузии вид указан как CR.",
              ],
              type: "p",
            },
          ],
          heading: "Какой это вид?",
        },
        {
          blocks: [
            {
              parts: [
                "Агентство охраняемых территорий описывает заказник Тетроби как территорию Малого Кавказа, созданную для охраны лесных массивов и локальных эндемичных растений на Джавахетском плато. Площадь указана как 3,089 га.",
              ],
              type: "p",
            },
            {
              parts: [
                "Официальное сообщение не публикует детальную оценку выбора участка и не говорит, что в Тетроби уже сформирована новая дикая группа.",
              ],
              type: "p",
            },
          ],
          heading: "Почему Тетроби?",
        },
        {
          blocks: [
            {
              parts: [
                "Нет. Объявление о начале проекта не означает, что животные уже выпущены. В источниках пока подтверждены место, участники и цель проекта; выпуск, стабильная популяция и успех размножения не подтверждены.",
              ],
              type: "p",
            },
          ],
          heading: "Вернулись ли безоаровые козлы в Джавахети?",
        },
      ],
      title: "В Джавахети начинается проект восстановления безоарового козла",
    },
    tr: {
      dek: "Bakanlık, Tetrobis Koruma Alanı'nda yaban keçisi restorasyon projesinin başladığını bildirdi. Hayvan salımı henüz doğrulanmadı.",
      lead: "Gürcistan Çevre Koruma ve Tarım Bakanlığı, 21 Eylül 2026'da Cavakheti'deki Tetrobis Koruma Alanı'nda yaban keçisi restorasyon projesinin başladığını açıkladı. Şu anda doğrulanan haber projenin başlamasıdır; hayvanların doğaya salındığı bildirilmemiştir.",
      metaDescription:
        "Tetrobis Koruma Alanı'nda yaban keçisi restorasyon projesi başlıyor. Duyuru, hayvan salımını henüz doğrulamıyor.",
      metaTitle: "Cavakheti'de yaban keçisi restorasyon projesi başlıyor",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Bakanlığa göre proje Ulusal Yaban Hayatı Ajansı, Korunan Alanlar Ajansı ve Tiflis Hayvanat Bahçesi tarafından koordineli yürütülecek. Amaç, yaban keçisi popülasyonunun restorasyonu ve ",
                { id: "samtskhe-javakheti", label: "Cavakheti", type: "region" },
                " ekosisteminin güçlendirilmesi olarak açıklanıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Açıklamada hayvan sayısı, kaynak popülasyon, taşıma tarihi veya salım tarihi yok. Bu nedenle doğru ifade şudur: proje başlıyor; tamamlanmış bir reintroduksiyon bildirilmiş değildir.",
              ],
              type: "p",
            },
          ],
          heading: "Ne açıklandı?",
        },
        {
          blocks: [
            {
              parts: [
                "Yaban keçisi (",
                { name: "Capra aegagrus", type: "sci" },
                "), Gürcüce ნიამორი, yerli bir dağ keçisidir. Atlas profili: ",
                { id: "capra-aegagrus", label: "yaban keçisi", type: "species" },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "Reptiles.ge profili IUCN, Gürcistan Kırmızı Listesi ve izleme kaynaklarına dayanarak Gürcistan'daki doğrulanmış üreyen popülasyonların bugün Tusheti ve kuzey Khevsureti ile sınırlı olduğunu belirtir. IUCN ",
                { name: "Capra aegagrus", type: "sci" },
                " türünü küresel olarak Near Threatened değerlendirir; Gürcistan ulusal listesinde CR olarak yer alır.",
              ],
              type: "p",
            },
          ],
          heading: "Hangi tür?",
        },
        {
          blocks: [
            {
              parts: [
                "Korunan Alanlar Ajansı, Tetrobis Koruma Alanı'nı Küçük Kafkasya'da, Cavakheti platosundaki orman parçalarını ve yerel endemik bitkileri korumak için kurulmuş bir alan olarak tanımlar. Alanı 3,089 hektardır.",
              ],
              type: "p",
            },
            {
              parts: [
                "Resmi haber, alan seçiminin teknik değerlendirmesini ayrıntılandırmıyor ve Tetrobis'te yeni bir yabani grup oluştuğunu söylemiyor.",
              ],
              type: "p",
            },
          ],
          heading: "Neden Tetrobis?",
        },
        {
          blocks: [
            {
              parts: [
                "Hayır. Projenin duyurulması, hayvanların doğaya salındığı anlamına gelmez. Kaynaklar şu anda yer, kurumlar ve genel amacı doğruluyor; salım, istikrarlı popülasyon ve üreme başarısı doğrulanmış değildir.",
              ],
              type: "p",
            },
          ],
          heading: "Yaban keçileri Cavakheti'ye döndü mü?",
        },
      ],
      title: "Cavakheti'de yaban keçisi restorasyon projesi başlıyor",
    },
  },
  id: "bezoar-goat-restoration-javakheti-2026",
  image: PHOTO_BEZOAR_GOAT,
  publishedAt: "2026-09-23T15:25:26+04:00",
  relatedHubIds: ["mammals"],
  relatedRegionIds: ["samtskhe-javakheti"],
  relatedSpeciesIds: ["capra-aegagrus"],
  slug: "bezoar-goat-restoration-javakheti-2026",
  sources: [
    {
      name: "საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო — 21 სექტემბერი 2026, დავით სონღულაშვილი: „ჩვენი მიზანია, დაცული ტერიტორიების განვითარება ბუნების დაცვის პრინციპებთან სრულ შესაბამისობაში წარიმართოს\"",
      url: MEPA_SOURCE,
    },
    {
      name: "აჭარის საზოგადოებრივი მაუწყებელი — 21 სექტემბერი 2026, ჯავახეთის ბუნებრივი მემკვიდრეობის დაცვის მიმართულებით, თეთრობის აღკვეთილში ნიამორის აღდგენის პროექტი იწყება",
      url: ADJARA_TV_SOURCE,
    },
    {
      name: "ილიას სახელმწიფო უნივერსიტეტის ბიომრავალფეროვნების მონაცემთა ბაზა — Capra aegagrus",
      url: ILIAUNI_SOURCE,
    },
    {
      name: "დაცული ტერიტორიების სააგენტო — ჯავახეთის დაცული ტერიტორიების ადმინისტრაცია",
      url: APA_SOURCE,
    },
    {
      name: "IUCN Red List — Capra aegagrus",
      url: IUCN_SOURCE,
    },
  ],
  status: "published",
  updatedAt: "2026-09-23T15:25:26+04:00",
};
