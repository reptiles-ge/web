import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "clinical-assessment" | "field-gyurza" | "viper-portrait";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "A suspected blunt-nosed viper bite needs urgent care. Learn possible local and systemic effects, what to do now, and why to call 112 in Georgia.",
    faq: [
      {
        answer:
          "No. A venomous snake can bite without injecting a clinically important amount of venom, but you cannot determine that safely at the scene. A credible suspected bite still needs urgent medical assessment.",
        question: "Does every gyurza bite inject venom?",
      },
      {
        answer:
          "No. Macrovipera symptoms can develop after an initially mild presentation. Call 112 in Georgia after a credible suspected bite even if pain or swelling is not yet obvious.",
        question: "Can I wait if the bite barely hurts?",
      },
      {
        answer:
          "No. Do not approach, catch, or handle the snake. An existing photograph taken safely may help clinicians, but taking one must never delay help.",
        question: "Do I need a photograph of the snake?",
      },
      {
        answer:
          "Tell the 112 operator where you are, that a blunt-nosed viper bite is suspected, and how the person is doing. Follow the operator's instructions.",
        question: "What should I tell 112?",
      },
      {
        answer:
          "We have not verified current gyurza antivenom stock in Georgian hospitals. Clinicians decide whether antivenom is indicated and which product is appropriate; do not delay the emergency call to search for it.",
        question: "Is gyurza antivenom available in Georgia?",
      },
    ],
    intro:
      "A suspected gyurza bite can be serious. In Georgia, call 112 now; do not wait for severe symptoms. Move away from the snake, keep movement to a minimum, and do not cut, suck, burn, or tightly tourniquet the bite. Do not try to catch the snake.",
    metaTitle: "Blunt-nosed viper bite — symptoms and what to do",
    sections: [
      {
        heading: "How dangerous is a gyurza bite?",
        image: "viper-portrait",
        paragraphs: [
          "The gyurza, called Macrovipera lebetinus in this atlas, is a medically important viper. A bite may deliver little or no venom, or it may cause significant local and systemic envenoming. Serious cases can be life-threatening; neither the wound's appearance nor the atlas risk label predicts an individual's outcome.",
          "Published Macrovipera cases and the 2025 clinical review describe a range of severity. These reports come from other populations and cannot establish the frequency or outcome of bites in Georgia.",
        ],
      },
      {
        heading: "What can the venom do?",
        paragraphs: [
          "Macrovipera envenoming can damage tissue around the bite and disturb blood clotting and blood vessels, sometimes causing bleeding. The 2025 review brings together clinical reports and venom research; laboratory clotting results explain a possible mechanism but do not predict what will happen to a person bitten in Georgia.",
        ],
      },
      {
        heading: "What symptoms have been reported?",
        list: {
          items: [
            "Near the bite: pain, swelling, bruising, blisters, or, in severe cases, tissue damage.",
            "Beyond the bite: dizziness, weakness, nausea or vomiting, low blood pressure, or abnormal bleeding and clotting tests. Severe cases may involve shock or kidney injury.",
          ],
        },
        paragraphs: [
          "These are possible effects reported in international Macrovipera clinical literature, not a checklist that every patient follows. One published case involved a snake collected in Cyprus; it does not describe a Georgian bite.",
        ],
      },
      {
        heading: "Can the bite look mild at first?",
        paragraphs: [
          "Yes. Macrovipera symptoms may evolve after the initial bite, and a small-looking wound or little early pain cannot rule out envenoming. A credible suspected bite needs urgent assessment without waiting for swelling, bleeding, or weakness to appear.",
        ],
      },
      {
        heading: "What should you do immediately?",
        list: {
          items: [
            "Move to a safe distance from the snake and call 112 in Georgia.",
            "Keep the person calm and as still as practical; keep the bitten limb still and remove rings, a watch, or other tight items nearby.",
            "Arrange prompt medical care and follow the emergency operator's instructions.",
          ],
          ordered: true,
        },
        paragraphs: [
          "For the full first-aid guidance that applies to any suspected snakebite, read [Snakebite in Georgia — what should you do?](/snakes/gvelis-nakbeni).",
        ],
      },
      {
        heading: "What should you avoid?",
        paragraphs: [
          "Do not cut or burn the wound, suck out venom, apply a tight tourniquet, use electric shock, ice, alcohol, or folk remedies. Do not improvise a pressure-immobilization bandage for gyurza: it may worsen injuries where venom causes substantial local tissue damage. Do not catch or kill the snake or delay care to identify it.",
        ],
      },
      {
        heading: "When should you call 112?",
        paragraphs: [
          "Call immediately for a credible suspected gyurza bite in Georgia, even before severe symptoms. Georgia's 112 dispatch service sends urgent medical help. Seeing a gyurza nearby without a bite or another emergency is a different situation and does not by itself require an emergency call.",
        ],
      },
      {
        heading: "What if a child was bitten?",
        paragraphs: [
          "A child needs especially prompt assessment. WHO notes that children can experience more severe effects from venomous snakebites because of their smaller body mass. This is general snakebite guidance, not a measured pediatric risk for Georgian gyurza bites.",
        ],
      },
      {
        heading: "Will antivenom be needed?",
        image: "clinical-assessment",
        paragraphs: [
          "Not every bite requires antivenom. In hospital, clinicians assess symptoms, examine the person, and may check blood clotting and other complications. They decide whether an appropriate antivenom is indicated and monitor treatment because serious reactions are possible.",
          "An antivenom tested against venom from another population cannot simply be assumed effective or available in Georgia. We have not verified Georgian hospital stock or a national gyurza treatment protocol. Do not try to obtain or administer antivenom yourself.",
        ],
      },
      {
        heading: "What is known about gyurza in Georgia?",
        image: "field-gyurza",
        paragraphs: [
          "The atlas documents the species in eastern Georgia. Its [gyurza profile](/snakes/macrovipera-lebetina) covers identification, distribution, and taxonomy; this article focuses on a suspected bite. The atlas uses Macrovipera lebetinus, while much clinical literature uses M. lebetina for the corresponding taxon.",
          "We found no reliable Georgian clinical series establishing local symptom frequencies, mortality, or current antivenom availability. International cases guide cautious wording but do not replace local evidence.",
        ],
      },
      {
        heading: "Should you identify the snake after a bite?",
        paragraphs: [
          "Do not approach or handle it. A photograph already taken from a safe distance can be shared with clinicians if doing so causes no delay. Do not rely on head shape, pupil shape, or a guess to decide whether to call for help. This page is educational and does not replace emergency or clinical advice.",
        ],
      },
    ],
    summary:
      "A credible suspected gyurza bite needs urgent medical assessment, even if the wound looks mild. In Georgia, move away and call 112. Keep movement to a minimum, remove tight items near the bite, and do not cut, suck, burn, tightly tourniquet, or catch the snake. Hospital staff assess envenoming and decide whether antivenom is needed.",
    title:
      "Blunt-nosed viper bite — how dangerous is it and what should you do?",
  },
  ka: {
    description:
      "გიურზას ნაკბენი შეიძლება მძიმე იყოს. გაიგეთ შესაძლო სიმპტომები, რა გააკეთოთ დაუყოვნებლივ და რატომ უნდა დარეკოთ 112-ზე საქართველოში.",
    faq: [
      {
        answer:
          "არა. შხამიანმა გველმა შეიძლება იკბინოს ისე, რომ მნიშვნელოვანი რაოდენობის შხამი არ შეიყვანოს, მაგრამ ამის ადგილზე დადგენა უსაფრთხოდ შეუძლებელია. სარწმუნო ეჭვისას საჭიროა გადაუდებელი სამედიცინო შეფასება.",
        question: "გიურზას ყველა ნაკბენისას შხამი შედის ორგანიზმში?",
      },
      {
        answer:
          "არა. Macrovipera-ს ნაკბენის ნიშნები შეიძლება მოგვიანებით განვითარდეს. თუ გიურზას ნაკბენზე სარწმუნო ეჭვია, საქართველოში დარეკეთ 112-ზე მაშინაც, როცა ტკივილი ან შეშუპება ჯერ არ ჩანს.",
        question: "თუ ნაკბენი თითქმის არ მტკივა, შეიძლება მოცდა?",
      },
      {
        answer:
          "არა. გველს არ მიუახლოვდეთ, არ დაიჭიროთ და არ შეეხოთ. უსაფრთხო მანძილიდან უკვე გადაღებული ფოტო შეიძლება ექიმს გამოადგეს, მაგრამ მისმა გადაღებამ დახმარება არ უნდა შეაფერხოს.",
        question: "გველის ფოტოს გადაღება აუცილებელია?",
      },
      {
        answer:
          "112-ის ოპერატორს უთხარით, სად ხართ, რომ გიურზას ნაკბენზე გაქვთ ეჭვი და როგორია ადამიანის მდგომარეობა. შემდეგ მიჰყევით მის მითითებებს.",
        question: "რა ვუთხრა 112-ის ოპერატორს?",
      },
      {
        answer:
          "საქართველოს საავადმყოფოებში გიურზას შესაბამისი ანტიშხამის მიმდინარე მარაგი ვერ გადავამოწმეთ. მისი საჭიროება და შესაფერისი პრეპარატი ექიმმა უნდა განსაზღვროს; ანტიშხამის ძებნის გამო 112-ზე დარეკვა არ გადადოთ.",
        question: "საქართველოში გიურზას ანტიშხამი არის?",
      },
    ],
    intro:
      "გიურზას სავარაუდო ნაკბენი შეიძლება მძიმე იყოს. საქართველოში ახლავე დარეკეთ 112-ზე — ნუ დაელოდებით ძლიერი სიმპტომების გამოჩენას. მოშორდით გველს, შეამცირეთ მოძრაობა და არ გაჭრათ, ამოწოვოთ ან მოწვათ ჭრილობა; არ დაიდოთ მჭიდრო ტურნიკეტი. გველის დაჭერას ნუ ეცდებით.",
    metaTitle: "გიურზას ნაკბენი — სიმპტომები და რა უნდა გავაკეთოთ",
    sections: [
      {
        heading: "რამდენად საშიშია გიურზას ნაკბენი?",
        image: "viper-portrait",
        paragraphs: [
          "გიურზა, რომელსაც ეს ატლასი Macrovipera lebetinus-ს უწოდებს, სამედიცინო თვალსაზრისით მნიშვნელოვანი გველგესლაა. ნაკბენისას შესაძლოა შხამი საერთოდ არ შევიდეს, ან განვითარდეს ძლიერი ადგილობრივი და საერთო მოწამვლა. მძიმე შემთხვევა სიცოცხლისთვის საშიშიც შეიძლება იყოს; ჭრილობის გარეგნობა და ატლასის რისკის ნიშანი კონკრეტული ადამიანის მდგომარეობას ვერ განსაზღვრავს.",
          "Macrovipera-ს გამოქვეყნებულ შემთხვევებსა და 2025 წლის კლინიკურ მიმოხილვაში სიმძიმე განსხვავდება. ეს მონაცემები სხვა პოპულაციებიდან მოდის და საქართველოში ნაკბენის სიხშირეს ან შედეგს ვერ გვიჩვენებს.",
        ],
      },
      {
        heading: "რას აკეთებს გიურზას შხამი?",
        paragraphs: [
          "Macrovipera-ს შხამმა შეიძლება ნაკბენის მიდამოში ქსოვილი დააზიანოს და სისხლის შედედება და სისხლძარღვები დაარღვიოს, რასაც ზოგჯერ სისხლდენა მოჰყვება. 2025 წლის მიმოხილვა აერთიანებს კლინიკურ შემთხვევებსა და შხამის კვლევას; ლაბორატორიული შედეგები შესაძლო მექანიზმს ხსნის, მაგრამ საქართველოში დაკბენილი ადამიანის მდგომარეობას ვერ წინასწარმეტყველებს.",
        ],
      },
      {
        heading: "რა სიმპტომებია აღწერილი?",
        list: {
          items: [
            "ნაკბენთან: ტკივილი, შეშუპება, სისხლჩაქცევა, ბუშტუკები ან, მძიმე შემთხვევაში, ქსოვილის დაზიანება.",
            "საერთო ნიშნები: თავბრუსხვევა, სისუსტე, გულისრევა ან ღებინება, დაბალი წნევა, სისხლდენა ან სისხლის შედედების დარღვევა. მძიმე შემთხვევებში აღწერილია შოკი და თირკმლის დაზიანებაც.",
          ],
        },
        paragraphs: [
          "ეს საერთაშორისო Macrovipera-ს კლინიკურ ლიტერატურაში აღწერილი შესაძლო ნიშნებია და არა ყველა პაციენტისთვის სავალდებულო ჩამონათვალი. ერთ გამოქვეყნებულ შემთხვევაში გველი კვიპროსიდან იყო ჩამოყვანილი; ეს ქართული ნაკბენის აღწერა არ არის.",
        ],
      },
      {
        heading: "შეიძლება ნაკბენი თავიდან მსუბუქად ჩანდეს?",
        paragraphs: [
          "დიახ. Macrovipera-ს ნაკბენის ნიშნები შესაძლოა მოგვიანებით განვითარდეს. პატარა ჭრილობა ან თავდაპირველად სუსტი ტკივილი მოწამვლას ვერ გამორიცხავს. სარწმუნო ეჭვისას შეშუპების, სისხლდენის ან სისუსტის გამოჩენას ნუ დაელოდებით — საჭიროა გადაუდებელი შეფასება.",
        ],
      },
      {
        heading: "რა გავაკეთოთ დაუყოვნებლივ?",
        list: {
          items: [
            "გველს უსაფრთხო მანძილზე მოშორდით და საქართველოში დარეკეთ 112-ზე.",
            "ადამიანი დაამშვიდეთ და ზედმეტი მოძრაობა შეუმცირეთ; დაკბენილი კიდური უძრავად შეინარჩუნეთ და მოიხსენით ახლოს არსებული ბეჭედი, საათი ან სხვა მჭიდრო ნივთი.",
            "უზრუნველყავით დროული სამედიცინო დახმარება და მიჰყევით ოპერატორის მითითებებს.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ნებისმიერი საეჭვო გველის ნაკბენის სრული პირველადი დახმარებისთვის იხილეთ [გველის ნაკბენი — რა უნდა გავაკეთოთ?](/snakes/gvelis-nakbeni).",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        paragraphs: [
          "არ გაჭრათ ან მოწვათ ჭრილობა, არ ამოწოვოთ შხამი, არ დაიდოთ მჭიდრო ტურნიკეტი, არ გამოიყენოთ ელექტროშოკი, ყინული, ალკოჰოლი ან ხალხური საშუალებები. გიურზას ნაკბენზე თვითნებურად ნუ გაიკეთებთ ზეწოლით სახვევს: ქსოვილის ძლიერი ადგილობრივი დაზიანებისას მას შეუძლია მდგომარეობა გააუარესოს. გველი არ დაიჭიროთ ან მოკლათ და მისი ამოცნობის გამო დახმარება არ გადადოთ.",
        ],
      },
      {
        heading: "როდის უნდა დავრეკოთ 112-ზე?",
        paragraphs: [
          "საქართველოში გიურზას ნაკბენზე სარწმუნო ეჭვისას დაუყოვნებლივ დარეკეთ, მძიმე სიმპტომებამდეც. 112 გადაუდებელი დახმარების სამსახურს, მათ შორის სასწრაფო სამედიცინო დახმარებას, უკავშირდება. გიურზას დანახვა ნაკბენის ან სხვა საგანგებო შემთხვევის გარეშე თავისთავად გადაუდებელი ზარის მიზეზი არ არის.",
        ],
      },
      {
        heading: "რა ხდება, თუ ბავშვი დაკბინეს?",
        paragraphs: [
          "ბავშვს განსაკუთრებით სწრაფი სამედიცინო შეფასება სჭირდება. WHO-ის მიხედვით, მცირე სხეულის მასის გამო შხამიანი გველის ნაკბენის ეფექტები ბავშვებში შეიძლება უფრო მძიმე იყოს. ეს ზოგადი ცოდნაა და არა საქართველოში გიურზას ნაკბენისას ბავშვთა რისკის გაზომილი მაჩვენებელი.",
        ],
      },
      {
        heading: "საჭიროა თუ არა ანტიშხამი?",
        image: "clinical-assessment",
        paragraphs: [
          "ანტიშხამი ყველა ნაკბენისას არ არის საჭირო. საავადმყოფოში ექიმები სიმპტომებს აფასებენ, ადამიანს აკვირდებიან და საჭიროებისას სისხლის შედედებასა და სხვა გართულებებს ამოწმებენ. ისინი წყვეტენ, საჭიროა თუ არა შესაფერისი ანტიშხამი, და მკურნალობას აკონტროლებენ, რადგან მძიმე არასასურველი რეაქციებიც შესაძლებელია.",
          "სხვა პოპულაციის შხამზე გამოცდილი ანტიშხამის ეფექტურობა და საქართველოში ხელმისაწვდომობა თავისთავად არ დასტურდება. საქართველოს საავადმყოფოების მარაგი ან გიურზას მკურნალობის ეროვნული პროტოკოლი ვერ გადავამოწმეთ. ანტიშხამი თვითნებურად არ შეიძინოთ და არ გაიკეთოთ.",
        ],
      },
      {
        heading: "რა ვიცით გიურზაზე საქართველოში?",
        image: "field-gyurza",
        paragraphs: [
          "ატლასი სახეობას აღმოსავლეთ საქართველოში ადასტურებს. [გიურზას პროფილი](/snakes/macrovipera-lebetina) ამოცნობას, გავრცელებასა და ტაქსონომიას ეხება; ეს სტატია სავარაუდო ნაკბენზეა. ატლასი იყენებს სახელს Macrovipera lebetinus, საერთაშორისო კლინიკურ ლიტერატურაში კი შესაბამისი ტაქსონისთვის ხშირად M. lebetina წერია.",
          "საქართველოს კლინიკური შემთხვევების სანდო სერია, ადგილობრივი სიმპტომების სიხშირე, სიკვდილიანობის მაჩვენებელი და ანტიშხამის მიმდინარე ხელმისაწვდომობა ვერ მოვიძიეთ. საერთაშორისო შემთხვევები ფრთხილ ფორმულირებას ეხმარება, მაგრამ ადგილობრივ მონაცემებს ვერ ანაცვლებს.",
        ],
      },
      {
        heading: "ნაკბენის შემდეგ გველის ამოცნობა საჭიროა?",
        paragraphs: [
          "გველს არ მიუახლოვდეთ და არ შეეხოთ. უსაფრთხო მანძილიდან უკვე გადაღებული ფოტო ექიმს შეგიძლიათ აჩვენოთ, თუ ეს დახმარებას არ შეაფერხებს. თავის ან გუგის ფორმით, ან ნავარაუდევი სახეობით, 112-ზე დარეკვის საჭიროებას ნუ შეაფასებთ. ეს გვერდი საგანმანათლებლოა და გადაუდებელი დახმარებისა თუ ექიმის მითითებებს არ ცვლის.",
        ],
      },
    ],
    summary:
      "გიურზას ნაკბენზე სარწმუნო ეჭვი გადაუდებელ სამედიცინო შეფასებას მოითხოვს მაშინაც, როცა ჭრილობა მსუბუქად ჩანს. საქართველოში მოშორდით გველს და დარეკეთ 112-ზე. შეამცირეთ მოძრაობა, მოიხსენით ნაკბენთან მჭიდრო ნივთები; არ გაჭრათ, ამოწოვოთ ან მოწვათ ჭრილობა, არ დაიდოთ მჭიდრო ტურნიკეტი და გველი არ დაიჭიროთ. მოწამვლასა და ანტიშხამის საჭიროებას ექიმი აფასებს.",
    title: "გიურზას ნაკბენი — რამდენად საშიშია და რა უნდა გავაკეთოთ?",
  },
  ru: {
    description:
      "Предполагаемый укус гюрзы требует срочной помощи. Возможные местные и общие симптомы, первые действия и когда звонить 112 в Грузии.",
    faq: [
      {
        answer:
          "Нет. Ядовитая змея может укусить, не введя клинически значимого количества яда, но на месте это нельзя установить безопасно. При обоснованном подозрении нужна срочная медицинская оценка.",
        question: "При каждом укусе гюрза вводит яд?",
      },
      {
        answer:
          "Нет. Симптомы укуса Macrovipera могут развиться позже. При обоснованном подозрении в Грузии звоните 112, даже если боли или отёка пока нет.",
        question: "Можно подождать, если укус почти не болит?",
      },
      {
        answer:
          "Нет. Не приближайтесь к змее, не ловите и не трогайте её. Уже сделанное с безопасного расстояния фото может помочь врачам, но съёмка не должна задерживать помощь.",
        question: "Обязательно фотографировать змею?",
      },
      {
        answer:
          "Сообщите оператору 112, где вы находитесь, что подозреваете укус гюрзы, и каково состояние пострадавшего. Следуйте инструкциям оператора.",
        question: "Что сказать оператору 112?",
      },
      {
        answer:
          "Мы не подтвердили текущие запасы подходящего противоядия в больницах Грузии. Нужность и выбор препарата определяют врачи; не откладывайте вызов 112 ради его поисков.",
        question: "Есть ли в Грузии противоядие от укуса гюрзы?",
      },
    ],
    intro:
      "Предполагаемый укус гюрзы может быть серьёзным. В Грузии сразу звоните 112, не ждите тяжёлых симптомов. Отойдите от змеи, ограничьте движения. Не разрезайте, не отсасывайте и не прижигайте рану, не накладывайте тугой жгут. Не пытайтесь поймать змею.",
    metaTitle: "Укус гюрзы — симптомы и что делать",
    sections: [
      {
        heading: "Насколько опасен укус гюрзы?",
        image: "viper-portrait",
        paragraphs: [
          "Гюрза, которую атлас называет Macrovipera lebetinus, — медицински значимая гадюка. При укусе яд может почти не попасть в организм или вызвать тяжёлое местное и системное отравление. Тяжёлые случаи могут угрожать жизни; по виду раны и отметке риска в атласе нельзя предсказать исход для конкретного человека.",
          "Опубликованные случаи укусов Macrovipera и клинический обзор 2025 года описывают разную тяжесть. Данные получены для других популяций и не определяют частоту или исходы укусов в Грузии.",
        ],
      },
      {
        heading: "Как действует яд гюрзы?",
        paragraphs: [
          "Яд Macrovipera может повреждать ткани возле укуса, нарушать свёртывание крови и работу сосудов, иногда приводя к кровотечению. Обзор 2025 года объединяет клинические случаи и исследования яда; лабораторные результаты объясняют возможный механизм, но не предсказывают состояние человека после укуса в Грузии.",
        ],
      },
      {
        heading: "Какие симптомы описаны?",
        list: {
          items: [
            "У места укуса: боль, отёк, кровоподтёки, пузыри и в тяжёлых случаях повреждение тканей.",
            "Общие проявления: головокружение, слабость, тошнота или рвота, низкое давление, кровотечение или нарушения свёртывания. В тяжёлых случаях описаны шок и поражение почек.",
          ],
        },
        paragraphs: [
          "Это возможные проявления из международной клинической литературы о Macrovipera, а не обязательный набор для каждого пациента. В одном опубликованном случае змея была привезена с Кипра; это не случай из Грузии.",
        ],
      },
      {
        heading: "Может ли укус поначалу казаться лёгким?",
        paragraphs: [
          "Да. Признаки укуса Macrovipera могут развиваться позже. Маленькая рана или слабая боль вначале не исключают отравления. При обоснованном подозрении не ждите отёка, кровотечения или слабости — нужна срочная оценка.",
        ],
      },
      {
        heading: "Что делать сразу?",
        list: {
          items: [
            "Отойдите от змеи на безопасное расстояние и позвоните 112 в Грузии.",
            "Успокойте человека, по возможности ограничьте движения, сохраняйте укушенную конечность неподвижной и снимите рядом с укусом кольцо, часы и другие тесные предметы.",
            "Организуйте скорую медицинскую помощь и следуйте указаниям оператора.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Полная первая помощь при любом подозреваемом укусе описана в [руководстве по укусу змеи](/snakes/gvelis-nakbeni).",
        ],
      },
      {
        heading: "Чего нельзя делать?",
        paragraphs: [
          "Не разрезайте и не прижигайте рану, не отсасывайте яд, не накладывайте тугой жгут; не используйте электрический ток, лёд, алкоголь или народные средства. Не накладывайте самостоятельно давящую повязку при укусе гюрзы: при значительном местном повреждении тканей она может навредить. Не ловите и не убивайте змею и не задерживайте помощь ради определения вида.",
        ],
      },
      {
        heading: "Когда звонить 112?",
        paragraphs: [
          "При обоснованном подозрении на укус гюрзы в Грузии звоните сразу, даже до тяжёлых симптомов. Служба 112 направляет экстренную медицинскую помощь. Просто увидеть гюрзу рядом, без укуса или иной чрезвычайной ситуации, само по себе не повод для экстренного вызова.",
        ],
      },
      {
        heading: "Что если пострадал ребёнок?",
        paragraphs: [
          "Ребёнку особенно важно быстро пройти медицинскую оценку. По данным ВОЗ, из-за меньшей массы тела последствия укуса ядовитой змеи у детей могут быть тяжелее. Это общее правило, а не измеренная оценка детского риска при укусах гюрзы в Грузии.",
        ],
      },
      {
        heading: "Понадобится ли противоядие?",
        image: "clinical-assessment",
        paragraphs: [
          "Противоядие нужно не при каждом укусе. В больнице врачи оценивают симптомы, наблюдают пациента и при необходимости проверяют свёртывание крови и другие осложнения. Они решают, показан ли подходящий препарат, и контролируют лечение, поскольку возможны серьёзные нежелательные реакции.",
          "Эффективность противоядия, проверенного на яде другой популяции, и его доступность в Грузии нельзя считать доказанными. Мы не подтвердили запасы в грузинских больницах или национальный протокол лечения укуса гюрзы. Не покупайте и не вводите противоядие самостоятельно.",
        ],
      },
      {
        heading: "Что известно о гюрзе в Грузии?",
        image: "field-gyurza",
        paragraphs: [
          "Атлас подтверждает вид на востоке Грузии. [Профиль гюрзы](/snakes/macrovipera-lebetina) посвящён определению, распространению и таксономии; эта статья — подозреваемому укусу. В атласе используется имя Macrovipera lebetinus, а в международной клинической литературе для соответствующего таксона часто пишут M. lebetina.",
          "Надёжную грузинскую клиническую серию, местную частоту симптомов, смертность и текущую доступность противоядия мы не нашли. Зарубежные случаи помогают формулировать осторожно, но не заменяют местные данные.",
        ],
      },
      {
        heading: "Нужно ли определять змею после укуса?",
        paragraphs: [
          "Не приближайтесь к ней и не трогайте. Уже сделанное с безопасного расстояния фото можно показать врачам, если это не задержит помощь. Не решайте, звонить ли 112, по форме головы, зрачка или догадке о виде. Эта страница носит образовательный характер и не заменяет указания экстренных служб и врача.",
        ],
      },
    ],
    summary:
      "Обоснованное подозрение на укус гюрзы требует срочной медицинской оценки, даже если рана кажется небольшой. В Грузии отойдите от змеи и звоните 112. Ограничьте движение, снимите тесные предметы возле укуса; не разрезайте, не отсасывайте, не прижигайте рану, не накладывайте тугой жгут и не ловите змею. Отравление и необходимость противоядия оценивают врачи.",
    title: "Укус гюрзы — насколько опасен и что делать?",
  },
  tr: {
    description:
      "Şüpheli Levant engereği ısırığı acil değerlendirme gerektirir. Olası yerel ve genel belirtileri, ilk adımları ve Gürcistan’da 112’yi ne zaman arayacağınızı öğrenin.",
    faq: [
      {
        answer:
          "Hayır. Zehirli bir yılan, klinik açıdan önemli miktarda zehir vermeden de ısırabilir; fakat bunu olay yerinde güvenle belirleyemezsiniz. Güçlü bir ısırık şüphesinde acil tıbbi değerlendirme gerekir.",
        question: "Her gyurza ısırığında zehir verilir mi?",
      },
      {
        answer:
          "Hayır. Macrovipera ısırığının belirtileri daha sonra gelişebilir. Isırık şüphesi güçlüyse ağrı veya şişlik henüz belirgin olmasa da Gürcistan’da 112’yi arayın.",
        question: "Isırık pek ağrımıyorsa bekleyebilir miyim?",
      },
      {
        answer:
          "Hayır. Yılana yaklaşmayın, yakalamayın veya dokunmayın. Güvenli mesafeden zaten çekilmiş bir fotoğraf klinisyenlere yardımcı olabilir, fakat fotoğraf çekmek yardımı geciktirmemelidir.",
        question: "Yılanın fotoğrafını çekmek zorunda mıyım?",
      },
      {
        answer:
          "112 görevlisine nerede olduğunuzu, Levant engereği ısırığından şüphelendiğinizi ve kişinin durumunu söyleyin. Görevlinin talimatlarını izleyin.",
        question: "112 görevlisine ne söylemeliyim?",
      },
      {
        answer:
          "Gürcistan hastanelerinde uygun antivenomun güncel stokunu doğrulayamadık. Gerekliliğine ve uygun ürüne klinisyenler karar verir; antivenom aramak için 112 aramasını geciktirmeyin.",
        question: "Gürcistan’da gyurza antivenomu var mı?",
      },
    ],
    intro:
      "Şüpheli bir Levant engereği ısırığı ciddi olabilir. Gürcistan’da şimdi 112’yi arayın; ağır belirtileri beklemeyin. Yılandan uzaklaşın ve gereksiz hareketi azaltın. Yarayı kesmeyin, emmeyin veya yakmayın; sıkı turnike uygulamayın. Yılanı yakalamaya çalışmayın.",
    metaTitle: "Levant engereği ısırığı — belirtiler ve ne yapmalı?",
    sections: [
      {
        heading: "Gyurza ısırığı ne kadar tehlikelidir?",
        image: "viper-portrait",
        paragraphs: [
          "Bu atlasın Macrovipera lebetinus dediği Levant engereği tıbbi açıdan önemli bir engerektir. Isırık az miktarda veya hiç zehir vermeyebilir; ciddi yerel ve sistemik zehirlenmeye de yol açabilir. Ağır olgular yaşamı tehdit edebilir. Yaranın görünüşü veya atlasın risk etiketi bir kişinin sonucunu öngöremez.",
          "Yayımlanmış Macrovipera vakaları ve 2025 klinik derlemesi farklı ağırlıklar bildirir. Veriler başka popülasyonlardan gelir; Gürcistan’daki ısırıkların sıklığını veya sonuçlarını göstermez.",
        ],
      },
      {
        heading: "Zehir vücutta ne yapabilir?",
        paragraphs: [
          "Macrovipera zehirlenmesi ısırık çevresindeki dokulara zarar verebilir, kanın pıhtılaşmasını ve damarları bozabilir; bazen kanamaya yol açabilir. 2025 derlemesi klinik vakalarla zehir araştırmalarını birleştirir. Laboratuvar pıhtılaşma bulguları olası mekanizmayı açıklar, fakat Gürcistan’da ısırılan bir kişinin sonucunu öngörmez.",
        ],
      },
      {
        heading: "Hangi belirtiler bildirilmiştir?",
        list: {
          items: [
            "Isırık çevresinde ağrı, şişlik, morarma, kabarcıklar ve ağır olgularda doku hasarı.",
            "Genel belirtiler arasında baş dönmesi, güçsüzlük, bulantı veya kusma, düşük tansiyon, kanama ya da pıhtılaşma bozukluğu vardır. Ağır olgularda şok ve böbrek hasarı da bildirilmiştir.",
          ],
        },
        paragraphs: [
          "Bunlar uluslararası Macrovipera klinik yayınlarında bildirilen olası etkilerdir; her hastada görülmez. Yayımlanmış bir vakadaki yılan Kıbrıs’tan getirilmişti; bu Gürcistan vakası değildir.",
        ],
      },
      {
        heading: "Isırık başlangıçta hafif görünebilir mi?",
        paragraphs: [
          "Evet. Macrovipera ısırığı belirtileri daha sonra gelişebilir. Küçük görünen yara veya ilk başta az ağrı zehirlenmeyi dışlamaz. Güçlü bir şüphede şişlik, kanama veya güçsüzlük beklemeyin; acil değerlendirme gerekir.",
        ],
      },
      {
        heading: "Hemen ne yapmalısınız?",
        list: {
          items: [
            "Yılandan güvenli mesafeye uzaklaşın ve Gürcistan’da 112’yi arayın.",
            "Kişiyi sakinleştirin ve gereksiz hareketi azaltın; ısırılan uzvu hareketsiz tutun, yakınındaki yüzük, saat ve diğer sıkı eşyaları çıkarın.",
            "Hızlı tıbbi yardım sağlayın ve acil yardım görevlisinin talimatlarını izleyin.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Her şüpheli yılan ısırığına yönelik tüm ilk yardım bilgileri için [Gürcistan’da yılan ısırığı rehberine](/snakes/gvelis-nakbeni) bakın.",
        ],
      },
      {
        heading: "Nelerden kaçınmalısınız?",
        paragraphs: [
          "Yarayı kesmeyin veya yakmayın, zehri emmeyin, sıkı turnike uygulamayın; elektrik, buz, alkol veya halk ilaçları kullanmayın. Gyurza ısırığında kendi kendinize basınçlı bandaj uygulamayın: belirgin yerel doku hasarında zararlı olabilir. Yılanı yakalamayın veya öldürmeyin; tanımlamak için yardımı geciktirmeyin.",
        ],
      },
      {
        heading: "112 ne zaman aranmalı?",
        paragraphs: [
          "Gürcistan’da güçlü bir gyurza ısırığı şüphesinde ağır belirtiler çıkmadan hemen arayın. 112, acil tıbbi yardımın yönlendirilmesini sağlar. Isırık ya da başka acil durum olmadan yalnızca yakınlarda gyurza görmek tek başına acil çağrı nedeni değildir.",
        ],
      },
      {
        heading: "Isırılan kişi çocuksa ne olur?",
        paragraphs: [
          "Çocuk için özellikle hızlı tıbbi değerlendirme gerekir. DSÖ’ye göre çocuklarda daha küçük vücut kütlesi nedeniyle zehirli yılan ısırıklarının etkileri daha ağır olabilir. Bu genel bir ilkedir; Gürcistan’daki gyurza ısırıkları için ölçülmüş bir çocuk riski değildir.",
        ],
      },
      {
        heading: "Antivenom gerekli midir?",
        image: "clinical-assessment",
        paragraphs: [
          "Her ısırıkta antivenom gerekmez. Hastanede klinisyenler belirtileri değerlendirir, kişiyi izler ve gerektiğinde pıhtılaşmayı ve diğer komplikasyonları kontrol eder. Uygun antivenomun gerekli olup olmadığına onlar karar verir; ciddi yan etkiler olabileceği için tedavi izlenir.",
          "Başka popülasyonun zehrine karşı test edilen antivenomun Gürcistan’da etkili veya mevcut olduğu varsayılamaz. Gürcü hastanelerinin güncel stokunu ya da ulusal gyurza tedavi protokolünü doğrulayamadık. Antivenomu kendiniz satın almayın veya uygulamayın.",
        ],
      },
      {
        heading: "Gürcistan’daki gyurza hakkında ne biliniyor?",
        image: "field-gyurza",
        paragraphs: [
          "Atlas türün doğu Gürcistan’da bulunduğunu belgeliyor. [Levant engereği profili](/snakes/macrovipera-lebetina) tanıma, dağılım ve taksonomiyi anlatır; bu yazı şüpheli ısırığa odaklanır. Atlas Macrovipera lebetinus adını kullanırken uluslararası klinik yayınlar ilgili takson için sıklıkla M. lebetina yazar.",
          "Gürcistan’a ait güvenilir bir klinik vaka serisi, yerel belirti sıklıkları, ölüm oranı veya güncel antivenom erişimi bulamadık. Uluslararası vakalar dikkatli ifade kurmaya yardımcı olur ama yerel verilerin yerini tutmaz.",
        ],
      },
      {
        heading: "Isırıktan sonra yılanı tanımlamak gerekir mi?",
        paragraphs: [
          "Yılana yaklaşmayın veya dokunmayın. Güvenli mesafeden zaten çekilmiş bir fotoğraf, yardımı geciktirmeden klinisyenlere gösterilebilir. Baş veya gözbebeği şekline ya da tür tahminine bakarak 112 aramasına karar vermeyin. Bu sayfa eğitseldir; acil yardım ve hekim talimatlarının yerini almaz.",
        ],
      },
    ],
    summary:
      "Güçlü bir gyurza ısırığı şüphesi, yara hafif görünse bile acil tıbbi değerlendirme gerektirir. Gürcistan’da yılandan uzaklaşın ve 112’yi arayın. Hareketi azaltın, ısırık yakınındaki sıkı eşyaları çıkarın; yarayı kesmeyin, emmeyin, yakmayın, sıkı turnike uygulamayın ve yılanı yakalamayın. Zehirlenmeyi ve antivenom gereğini klinisyenler değerlendirir.",
    title: "Levant engereği ısırığı — ne kadar tehlikeli ve ne yapmalı?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "Georgia 112 — Frequently asked questions",
    supports: {
      en: "Georgia's emergency dispatch number, its medical response role, and when to call for an emergency.",
      ka: "საქართველოს გადაუდებელი ზარის ნომერი, სასწრაფო სამედიცინო დახმარებასთან კავშირი და გადაუდებელი ზარის საფუძველი.",
      ru: "Номер экстренной службы Грузии, направление скорой медицинской помощи и основания для экстренного вызова.",
      tr: "Gürcistan acil çağrı numarası, tıbbi yardım yönlendirmesi ve acil arama koşulları.",
    },
    url: "https://112.gov.ge/?page_id=599",
  },
  {
    name: "WHO — Snakebite envenoming: treatment and first aid",
    supports: {
      en: "Prompt transport, moving away, removing tight items, immobilizing the person, and avoiding harmful first-aid methods.",
      ka: "სწრაფი სამედიცინო გადაყვანა, გველისგან მოშორება, მჭიდრო ნივთების მოხსნა, უძრაობა და საზიანო პირველადი დახმარების არიდება.",
      ru: "Быстрая доставка к медикам, удаление от змеи, снятие тесных предметов, ограничение движений и отказ от вредных методов первой помощи.",
      tr: "Hızlı tıbbi nakil, yılandan uzaklaşma, sıkı eşyaları çıkarma, hareketsiz tutma ve zararlı ilk yardım yöntemlerinden kaçınma.",
    },
    url: "https://www.who.int/health-topics/snakebite",
  },
  {
    name: "WHO — Snakebite envenoming: questions and answers",
    supports: {
      en: "Pressure immobilization is not recommended for venoms causing major local tissue damage; cutting, suction and tight tourniquets can be harmful, and antivenom effectiveness varies by population.",
      ka: "ქსოვილის ძლიერი ადგილობრივი დაზიანებისას ზეწოლითი იმობილიზაცია რეკომენდებული არ არის; გაჭრა, ამოწოვა და მჭიდრო ტურნიკეტი საზიანოა, ანტიშხამის ეფექტურობა კი პოპულაციის მიხედვით იცვლება.",
      ru: "При сильном местном повреждении тканей давящая иммобилизация не рекомендуется; разрезы, отсасывание и тугой жгут вредны, а эффективность противоядия зависит от популяции.",
      tr: "Belirgin yerel doku hasarında basınçla hareketsizleştirme önerilmez; kesme, emme ve sıkı turnike zararlı olabilir, antivenom etkinliği popülasyona göre değişir.",
    },
    url: "https://www.who.int/news-room/questions-and-answers/item/snakebite-envenoming",
  },
  {
    name: "WHO — Snakebite envenoming fact sheet (2026)",
    supports: {
      en: "Potentially serious venom effects and the greater severity children may experience because of smaller body mass.",
      ka: "შხამის შესაძლო მძიმე ეფექტები და მცირე სხეულის მასის გამო ბავშვებში მეტი სიმძიმის შესაძლებლობა.",
      ru: "Возможные тяжёлые последствия яда и более тяжёлое течение у детей из-за меньшей массы тела.",
      tr: "Zehrin olası ağır etkileri ve daha düşük vücut kütlesi nedeniyle çocuklarda daha ağır seyir olasılığı.",
    },
    url: "https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming",
  },
  {
    name: "CDC / NIOSH — Venomous Snakes at Work",
    supports: {
      en: "Seek help without waiting for symptoms; a safe-distance photo may help, while ice, electric shock, alcohol as a remedy, and handling the snake should be avoided.",
      ka: "დახმარება სიმპტომების მოლოდინის გარეშე; უსაფრთხო მანძილიდან ფოტო შეიძლება გამოდგეს, ყინული, ელექტროშოკი, ალკოჰოლი სამკურნალოდ და გველთან შეხება კი არ არის რეკომენდებული.",
      ru: "Помощь без ожидания симптомов; фото с безопасного расстояния может помочь, а льда, электрошока, алкоголя как средства лечения и контакта со змеёй следует избегать.",
      tr: "Belirtileri beklemeden yardım; güvenli mesafeden fotoğraf yararlı olabilir, buz, elektrik şoku, tedavi olarak alkol ve yılana dokunmaktan kaçınılmalıdır.",
    },
    url: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html",
  },
  {
    name: "Avella et al. 2025 — The biology and toxinology of blunt-nosed vipers",
    supports: {
      en: "Macrovipera clinical reports: variable severity, local tissue injury, coagulation and bleeding disorders, possible systemic effects, evolving symptoms, and clinician-led treatment; the evidence is not specific to Georgia.",
      ka: "Macrovipera-ს კლინიკური ცნობები: განსხვავებული სიმძიმე, ქსოვილის ადგილობრივი დაზიანება, შედედებისა და სისხლდენის დარღვევები, შესაძლო საერთო ეფექტები, ნიშნების განვითარება და ექიმის მიერ მკურნალობა; მონაცემები საქართველოსთვის სპეციფიკური არ არის.",
      ru: "Клинические данные по Macrovipera: разная тяжесть, местное повреждение тканей, нарушения свёртывания и кровотечения, возможные общие эффекты, развитие симптомов и лечение врачом; данные не относятся специально к Грузии.",
      tr: "Macrovipera klinik yayınlarında değişken ağırlık, yerel doku hasarı, pıhtılaşma ve kanama bozuklukları, olası genel etkiler, gelişen belirtiler ve klinisyen tedavisi; veriler Gürcistan'a özgü değildir.",
    },
    url: "https://doi.org/10.1038/s44185-025-00090-w",
  },
  {
    name: "Göçmen et al. 2006 — Human Macrovipera lebetina lebetina bite case",
    supports: {
      en: "One patient bitten by a snake collected in Cyprus developed edema, shock, hemorrhage and tissue injury; it cannot establish typical Georgian effects.",
      ka: "კვიპროსიდან ჩამოყვანილი გველის ნაკბენის ერთ შემთხვევაში განვითარდა შეშუპება, შოკი, სისხლდენა და ქსოვილის დაზიანება; ეს საქართველოსთვის ტიპურ ეფექტებს ვერ ადგენს.",
      ru: "У одного пациента после укуса змеи, привезённой с Кипра, возникли отёк, шок, кровотечение и повреждение тканей; случай не определяет типичные последствия в Грузии.",
      tr: "Kıbrıs'tan getirilmiş yılanın ısırdığı tek hastada ödem, şok, kanama ve doku hasarı görüldü; bu Gürcistan için tipik etkileri belirlemez.",
    },
    url: "https://pubmed.ncbi.nlm.nih.gov/17124670/",
  },
  {
    name: "Chowdhury et al. 2021 — Differential Macrovipera procoagulant toxicity",
    supports: {
      en: "Human-plasma laboratory assays show clotting effects and variation among Macrovipera venoms; these assays are not clinical predictions.",
      ka: "ადამიანის პლაზმის ლაბორატორიული ცდები აჩვენებს Macrovipera-ს შხამებს შორის შედედების მოქმედებასა და განსხვავებებს; ეს კლინიკური პროგნოზი არ არის.",
      ru: "Лабораторные опыты на плазме человека показывают действие на свёртывание и различия между ядами Macrovipera; они не являются клиническим прогнозом.",
      tr: "İnsan plazması laboratuvar deneyleri Macrovipera zehirlerinin pıhtılaşma etkilerini ve aralarındaki farkları gösterir; bunlar klinik öngörü değildir.",
    },
    url: "https://doi.org/10.1016/j.toxlet.2020.12.019",
  },
  {
    name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia's amphibians and reptiles",
    supports: {
      en: "Occurrence of the gyurza in Georgia; this checklist does not establish clinical outcomes.",
      ka: "გიურზას საქართველოში არსებობა; ჩამონათვალი კლინიკურ შედეგებს არ ადგენს.",
      ru: "Наличие гюрзы в Грузии; список не определяет клинические исходы.",
      tr: "Gyurza'nın Gürcistan'da bulunması; kontrol listesi klinik sonuçları belirlemez.",
    },
    url: "https://doi.org/10.3897/caucasiana.5.e189214",
  },
  {
    name: "Iankoshvili & Tarkhnishvili 2021 — Distribution of snakes in Georgia",
    supports: {
      en: "Documented distribution of gyurza in eastern Georgia, without clinical bite data.",
      ka: "გიურზას გავრცელება აღმოსავლეთ საქართველოში, კლინიკური ნაკბენის მონაცემების გარეშე.",
      ru: "Распространение гюрзы на востоке Грузии, без клинических данных об укусах.",
      tr: "Gyurza'nın doğu Gürcistan'daki yayılışı; klinik ısırık verisi içermez.",
    },
    url: "https://doi.org/10.1080/09397140.2021.1957208",
  },
];

export const GYURZA_BITE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Illustrative scene: a viper on rocky ground, with two hikers calling for help at a distance",
      ka: "ილუსტრაციული სცენა: გველი ქვიან მიწაზე, მოშორებით ორი მოლაშქრე დახმარებას იძახებს",
      ru: "Иллюстративная сцена: змея на каменистой земле, вдали двое туристов вызывают помощь",
      tr: "Temsili sahne: kayalık zeminde bir engerek, uzakta iki yürüyüşçü yardım çağırıyor",
    },
    credit: {
      en: "AI-generated illustrative scene · not for species identification",
      ka: "AI-ით შექმნილი ილუსტრაციული სცენა · სახეობის ამოცნობისთვის არ გამოიყენოთ",
      ru: "Иллюстративная сцена, созданная ИИ · не для определения вида",
      tr: "Yapay zekâ ile oluşturulmuş temsili sahne · tür tanımlamak için kullanılmamalıdır",
    },
    height: 1024,
    src: "/images/guides/gyurza-bite-hero.jpg",
    width: 1536,
  },
  id: "gyurza-bite",
  images: {
    "clinical-assessment": {
      alt: {
        en: "Illustrative scene of a clinician speaking with a patient and companion in an examination room",
        ka: "ილუსტრაციული სცენა: ექიმი გასინჯვის ოთახში პაციენტსა და მის თანმხლებ პირს ესაუბრება",
        ru: "Иллюстративная сцена: врач беседует с пациентом и сопровождающим в кабинете осмотра",
        tr: "Temsili sahne: hekim muayene odasında hasta ve yakınıyla konuşuyor",
      },
      height: 1024,
      src: "/images/guides/gyurza-bite-clinical-assessment.jpg",
      width: 1536,
    },
    "field-gyurza": {
      alt: {
        en: "Gyurza coiled on stony ground beside rocks and sparse grass",
        ka: "გიურზა დახვეულია ქვიან მიწაზე, კლდის ნატეხებისა და ბალახის გვერდით",
        ru: "Гюрза свернулась на каменистой земле среди камней и редкой травы",
        tr: "Levant engereği taşlar ve seyrek otlar arasında kıvrılmış halde",
      },
      credit: {
        en: "Photo: Laura and Bobby Bok · Vashlovani Protected Areas",
        ka: "ფოტო: Laura and Bobby Bok · ვაშლოვანის დაცული ტერიტორია",
        ru: "Фото: Laura and Bobby Bok · охраняемые территории Вашловани",
        tr: "Fotoğraf: Laura and Bobby Bok · Vaşlovani Koruma Alanları",
      },
      height: 1066,
      src: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
      width: 1600,
    },
    "viper-portrait": {
      alt: {
        en: "Illustrative close view of a broad-bodied viper coiled among rocks",
        ka: "ილუსტრაციული ახლო კადრი: მსხვილტანიანი გველი ქვებს შორისაა დახვეული",
        ru: "Иллюстративный крупный план: массивная змея свернулась среди камней",
        tr: "Temsili yakın görünüm: iri gövdeli bir engerek taşların arasında kıvrılmış",
      },
      credit: {
        en: "AI-generated illustrative image · not for species identification",
        ka: "AI-ით შექმნილი ილუსტრაციული ფოტო · სახეობის ამოცნობისთვის არ გამოიყენოთ",
        ru: "Иллюстративное изображение, созданное ИИ · не для определения вида",
        tr: "Yapay zekâ ile oluşturulmuş temsili görsel · tür tanımlamak için kullanılmamalıdır",
      },
      height: 1024,
      src: "/images/guides/gyurza-bite-viper-portrait.jpg",
      width: 1536,
    },
  },
  messageKey: "gyurzaBite",
  ogImage: "/og/images/guides/gyurza-bite.jpg",
  parentHub: "snakes",
  pathname: "/snakes/giurzas-nakbeni",
  relatedGuideIds: ["snake-bite"],
  relatedSpeciesIds: ["macrovipera-lebetina"],
  search: {
    icon: "safety",
    keywords: [
      "გიურზას ნაკბენი",
      "გიურზამ მიკბინა",
      "გიურზას შხამი",
      "გიურზას ნაკბენის სიმპტომები",
      "გიურზას ნაკბენზე ანტიშხამი",
      "giurzas nakbeni",
      "blunt-nosed viper bite",
      "Macrovipera bite",
      "укус гюрзы",
      "Levant engereği ısırığı",
    ],
    rank: 4,
    subtitle: {
      en: "Gyurza symptoms, urgent care and evidence limits",
      ka: "გიურზას სიმპტომები, გადაუდებელი დახმარება და მტკიცებულების ზღვარი",
      ru: "Симптомы укуса гюрзы, срочная помощь и ограничения данных",
      tr: "Gyurza belirtileri, acil yardım ve kanıt sınırları",
    },
    title: {
      en: "Blunt-nosed viper bite",
      ka: "გიურზას ნაკბენი",
      ru: "Укус гюрзы",
      tr: "Levant engereği ısırığı",
    },
  },
  sources: SOURCES,
});
