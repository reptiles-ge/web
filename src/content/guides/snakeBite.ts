import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

const COPY: Record<AppLocale, GuideArticleCopy> = {
  en: {
    description:
      "Snakebite in Georgia: if the snake is venomous or unidentified, call 112. Do not cut, suck venom, or apply a tight tourniquet.",
    faq: [
      {
        answer:
          "If the snake was venomous or you cannot identify it with confidence, call 112 in Georgia without waiting for symptoms. Move away and keep the bitten limb still while help is arranged.",
        question: "What should I do first after a snakebite?",
      },
      {
        answer:
          "No. WHO and CDC advise against cutting the wound or trying to suck out venom. These actions do not replace prompt medical assessment.",
        question: "Can I cut the bite or suck out venom?",
      },
      {
        answer:
          "No. WHO advises against a tight arterial tourniquet. Do not improvise a pressure bandage: the method depends on the type of snake and is not a general first aid measure for Georgian bites.",
        question: "Should I use a tourniquet or pressure bandage?",
      },
      {
        answer:
          "No. Do not handle a snake, even if it appears dead. A photograph from a safe distance may help later, but it must never delay the emergency call or medical care.",
        question: "Must I catch the snake for identification?",
      },
      {
        answer:
          "No. Many snakes in Georgia are not medically venomous, but a bite can still injure the skin. If the species is uncertain, do not use the absence of symptoms to decide that care can wait.",
        question: "Is every snakebite venomous?",
      },
      {
        answer:
          "No. Symptoms vary and may not appear immediately. If a venomous or unidentified snake may have bitten you, call 112 and seek medical assessment without waiting for a symptom checklist.",
        question: "Does no swelling mean the bite is safe?",
      },
    ],
    intro:
      "If a venomous or unidentified snake has bitten you in Georgia, move away from it and call 112 for emergency medical help. Keep movement to a minimum and remove rings or other tight items near the bite. Do not cut the wound, suck out venom, or apply a tight tourniquet.",
    metaTitle: "Snakebite in Georgia — call 112 | what not to do",
    sections: [
      {
        heading: "What should you do immediately after a snakebite?",
        image: "remove-ring",
        list: {
          items: [
            "Move away from the snake to a safe place. Do not approach it again.",
            "If the snake was venomous or you cannot identify it with confidence, call 112 in Georgia and describe what happened and where you are. Do not wait for symptoms.",
            "Sit or lie somewhere safe, limit unnecessary movement, and keep the bitten arm or leg still in a comfortable position.",
            "Remove rings, watches, bracelets, or tight clothing near the bite before swelling develops.",
            "Arrange prompt medical assessment. Do not drive yourself if possible; dizziness or fainting can occur.",
          ],
          ordered: true,
        },
        paragraphs: [
          "WHO recommends rapid transport to a health facility for suspected venomous bites. In Georgia, 112 is the emergency dispatch number, not a general information line. Follow the dispatcher's instructions while help is arranged.",
        ],
      },
      {
        heading: "What should you not do?",
        image: "keep-distance",
        list: {
          items: [
            "Do not cut or excise the wound, and do not try to suck out venom by mouth or device.",
            "Do not apply a tight arterial tourniquet. Pressure immobilization bandaging is not a universal snakebite measure; do not improvise it at the scene.",
            "Do not apply ice or electric shock, drink alcohol as a remedy, or rely on herbs and other folk treatments.",
            "Do not catch, kill, or handle the snake, including a dead one. Do not delay care to identify it.",
          ],
        },
        paragraphs: [
          "These methods can cause harm or waste time needed for medical care. WHO and CDC advise against them in public first aid guidance.",
        ],
      },
      {
        heading: "What symptoms can a snakebite cause?",
        list: {
          items: [
            "Pain, redness, swelling, bruising, blistering, or bleeding near the bite.",
            "Nausea, vomiting, weakness, dizziness, tingling, or changes in vision.",
            "Trouble breathing, fainting, or unusual bleeding can signal a serious problem.",
          ],
        },
        paragraphs: [
          "Signs vary with the species, venom delivered, bite location, and the person affected. This is not a diagnostic checklist. The absence of an early sign does not establish that a bite is harmless.",
        ],
      },
      {
        heading: "When is a bite especially concerning?",
        paragraphs: [
          "Breathing difficulty, fainting, severe weakness, abnormal bleeding, or rapidly increasing swelling need emergency help. Call 112 in Georgia. Children may experience more severe effects of venom because of their smaller body mass.",
          "A bite from an unidentified snake also needs prompt assessment, even if the person initially feels well. Do not use the appearance of the wound or a guessed species to postpone care.",
        ],
      },
      {
        heading: "Is every snakebite venomous?",
        paragraphs: [
          "No. Many snakes in Georgia are not medically venomous, although their bites can still injure the skin. If the species is uncertain or venom is possible, seek emergency assessment first.",
          "The [venomous snakes guide](/venomous-snakes) and [identification guide](/snakes/shxamiani-gvelis-amocnoba) explain species differences.",
        ],
      },
      {
        heading: "What if you did not see the snake?",
        image: "call-112",
        paragraphs: [
          "If you suspect a snakebite but did not see the animal, treat its identity as unknown. Call 112 in Georgia and seek emergency assessment; do not search for the snake before asking for help.",
          "If the animal is still visible, a photograph from a safe distance may help later, but only if it does not delay care. Never approach or handle it for identification.",
        ],
      },
      {
        heading: "Which snakes in Georgia are medically relevant?",
        paragraphs: [
          "The atlas describes Georgia's [venomous snakes](/venomous-snakes), including the [Levantine viper](macrovipera-lebetina). The rear-fanged [Montpellier snake](malpolon-insignitus) has a different atlas risk label. These labels describe species profiles; they cannot grade an individual bite.",
          "After medical help is underway, use the [snake species index](/snakes/saxeoebebi) and [range guide](/snakes/gavrtseleba) for context. The [yard guide](/snakes-in-the-yard) covers prevention and encounters, not bite treatment.",
        ],
      },
      {
        heading: "Who decides whether antivenom is needed?",
        image: "clinical-assessment",
        paragraphs: [
          "Clinicians assess the person and decide whether antivenom or other treatment is indicated. WHO describes antivenom as a treatment for envenoming, but this page cannot determine a need, dose, product, or availability at a Georgian hospital.",
          "Emergency dispatch and medical professionals make decisions about transport, observation, and treatment.",
        ],
      },
    ],
    summary:
      "After a possible venomous or unidentified snakebite in Georgia, move away from the snake and call 112. Keep the person and bitten limb as still as practical, and remove tight items near the bite. Do not cut, suck, apply a tight tourniquet, or delay care to catch the snake. Symptoms may be absent early; medical staff must assess the bite.",
    title: "Snakebite in Georgia — what should you do?",
  },
  ka: {
    description:
      "გველის ნაკბენი საქართველოში: თუ გველი შხამიანია ან უცნობია, დარეკე 112-ზე. ნუ გაჭრი, ნუ ამოიწოვ და ნუ გაიკეთებ მჭიდრო ტურნიკეტს.",
    faq: [
      {
        answer:
          "თუ გველი შხამიანია ან სახეობაში დარწმუნებული არ ხარ, საქართველოში დაუყოვნებლივ დარეკე 112-ზე და ნუ დაელოდები სიმპტომებს. მოშორდი გველს და დახმარების ორგანიზებამდე დაკბენილი კიდური უძრავად შეინარჩუნე.",
        question: "გველის ნაკბენის დროს პირველ რიგში რა უნდა გავაკეთო?",
      },
      {
        answer:
          "არა. WHO და CDC არ გირჩევენ ჭრილობის გაჭრას ან შხამის ამოწოვას. ეს ქმედებები ვერ ჩაანაცვლებს დროულ სამედიცინო შეფასებას.",
        question: "შეიძლება ნაკბენის გაჭრა ან შხამის ამოწოვა?",
      },
      {
        answer:
          "არა. WHO არ გირჩევს მჭიდრო არტერიულ ტურნიკეტს. თვითნებურად არც ზეწოლითი სახვევი გაიკეთო: ეს მეთოდი გველის სახეობაზეა დამოკიდებული და საქართველოში ნებისმიერი ნაკბენის უნივერსალური პირველადი დახმარება არ არის.",
        question: "უნდა გამოვიყენო ტურნიკეტი ან ზეწოლითი სახვევი?",
      },
      {
        answer:
          "არა. გველს ნუ შეეხები, თუნდაც მკვდარი ჩანდეს. უსაფრთხო მანძილიდან გადაღებული ფოტო შეიძლება მოგვიანებით გამოდგეს, მაგრამ მან არ უნდა შეაფერხოს 112-ზე დარეკვა ან სამედიცინო დახმარება.",
        question: "უნდა დავიჭირო გველი სახეობის დასადგენად?",
      },
      {
        answer:
          "არა. საქართველოში ბევრი გველი სამედიცინოდ შხამიანი არ არის, თუმცა ნაკბენმა კანი მაინც შეიძლება დააზიანოს. თუ სახეობა უცნობია, სიმპტომების არარსებობით ნუ გადაწყვეტ, რომ დახმარება შეიძლება გადაიდოს.",
        question: "ყველა გველის ნაკბენი შხამიანია?",
      },
      {
        answer:
          "არა. სიმპტომები განსხვავდება და შეიძლება მაშინვე არ გამოჩნდეს. თუ შესაძლოა შხამიანმა ან უცნობმა გველმა გიკბინა, დარეკე 112-ზე და სიმპტომების სიის შემოწმებას ნუ დაელოდები.",
        question: "შეშუპების არქონა ნიშნავს, რომ ნაკბენი უსაფრთხოა?",
      },
    ],
    intro:
      "თუ საქართველოში შხამიანმა ან უცნობმა გველმა გიკბინა, მოშორდი მას და გადაუდებელი სამედიცინო დახმარებისთვის დარეკე 112-ზე. შეამცირე მოძრაობა და მოიხსენი ბეჭედი ან სხვა მჭიდრო ნივთი ნაკბენთან ახლოს. ნუ გაჭრი ჭრილობას, ნუ ამოიწოვ შხამს და ნუ გაიკეთებ მჭიდრო ტურნიკეტს.",
    metaTitle: "გველის ნაკბენი საქართველოში — დარეკე 112 | რა არ გააკეთო",
    sections: [
      {
        heading: "გველმა მიკბინა — რა გავაკეთო დაუყოვნებლივ?",
        image: "remove-ring",
        list: {
          items: [
            "მოშორდი გველს და გადადი უსაფრთხო ადგილას. მას ხელახლა ნუ მიუახლოვდები.",
            "თუ გველი შხამიანია ან სახეობაში დარწმუნებული არ ხარ, საქართველოში დარეკე 112-ზე და აუხსენი, რა მოხდა და სად იმყოფები. ნუ დაელოდები სიმპტომებს.",
            "უსაფრთხო ადგილას დაჯექი ან დაწექი, შეამცირე ზედმეტი მოძრაობა და დაკბენილი ხელი ან ფეხი კომფორტულ მდგომარეობაში უძრავად შეინარჩუნე.",
            "შეშუპების დაწყებამდე მოიხსენი ბეჭედი, საათი, სამაჯური ან მჭიდრო ტანსაცმელი ნაკბენთან ახლოს.",
            "უზრუნველყავი დროული სამედიცინო შეფასება. თუ შესაძლებელია, მანქანა თავად არ მართო: შეიძლება თავბრუსხვევა ან გონების დაკარგვა განვითარდეს.",
          ],
          ordered: true,
        },
        paragraphs: [
          "WHO შხამიანი ნაკბენის ეჭვისას სამედიცინო დაწესებულებაში სწრაფ გადაყვანას ურჩევს. საქართველოში 112 გადაუდებელი დახმარების ნომერია და არა ზოგადი საინფორმაციო ხაზი. დახმარების მოლოდინში მიჰყევი ოპერატორის მითითებებს.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        image: "keep-distance",
        list: {
          items: [
            "ნუ გაჭრი ან ამოკვეთ ჭრილობას და ნუ ეცდები შხამის პირით ან მოწყობილობით ამოწოვას.",
            "ნუ გამოიყენებ მჭიდრო არტერიულ ტურნიკეტს. ზეწოლითი იმობილიზაციის სახვევი ყველა გველის ნაკბენზე არ გამოიყენება; ადგილზე თვითნებურად ნუ გაიკეთებ.",
            "ნუ გამოიყენებ ყინულს ან ელექტროშოკს, ნუ დალევ ალკოჰოლს სამკურნალოდ და ნუ დაეყრდნობი მცენარეულ თუ სხვა ხალხურ მეთოდებს.",
            "ნუ დაიჭერ, მოკლავ ან შეეხები გველს, მათ შორის მკვდარს. იდენტიფიკაციისთვის დახმარებას ნუ გადადებ.",
          ],
        },
        paragraphs: [
          "ამ მეთოდებმა შეიძლება ზიანი გამოიწვიოს ან სამედიცინო დახმარებისთვის საჭირო დრო დაკარგოს. WHO და CDC საჯარო პირველადი დახმარების რეკომენდაციებში მათ არ გირჩევენ.",
        ],
      },
      {
        heading: "გველის ნაკბენის რა სიმპტომები შეიძლება გამოვლინდეს?",
        list: {
          items: [
            "ტკივილი, სიწითლე, შეშუპება, სისხლჩაქცევა, ბუშტუკები ან სისხლდენა ნაკბენთან.",
            "გულისრევა, ღებინება, სისუსტე, თავბრუსხვევა, ჩხვლეტა ან მხედველობის ცვლილება.",
            "სუნთქვის გაძნელება, გონების დაკარგვა ან უჩვეულო სისხლდენა მძიმე პრობლემაზე შეიძლება მიუთითებდეს.",
          ],
        },
        paragraphs: [
          "ნიშნები დამოკიდებულია სახეობაზე, შეყვანილ შხამზე, ნაკბენის ადგილზე და ადამიანის მდგომარეობაზე. ეს დიაგნოსტიკური სია არ არის. ადრეულ ეტაპზე რომელიმე ნიშნის არქონა ნაკბენის უვნებლობას არ ადასტურებს.",
        ],
      },
      {
        heading: "როდის არის მდგომარეობა განსაკუთრებით საყურადღებო?",
        paragraphs: [
          "სუნთქვის გაძნელება, გონების დაკარგვა, ძლიერი სისუსტე, უჩვეულო სისხლდენა ან სწრაფად მზარდი შეშუპება გადაუდებელ დახმარებას მოითხოვს. საქართველოში დარეკე 112-ზე. პატარა სხეულის მასის გამო ბავშვებში შხამის ეფექტები შეიძლება უფრო მძიმედ განვითარდეს.",
          "უცნობი გველის ნაკბენიც დროულ შეფასებას საჭიროებს, მაშინაც კი, თუ ადამიანი თავიდან თავს კარგად გრძნობს. დახმარებას ნუ გადადებ ჭრილობის გარეგნობის ან ნავარაუდევი სახეობის მიხედვით.",
        ],
      },
      {
        heading: "ყველა გველის ნაკბენი შხამიანია?",
        paragraphs: [
          "არა. საქართველოში ბევრი გველი ადამიანისთვის სამედიცინოდ შხამიანი არ არის, მაგრამ მათმა ნაკბენმა კანი მაინც შეიძლება დააზიანოს. თუ სახეობა უცნობია ან შხამი შესაძლებელია, ჯერ გადაუდებელ შეფასებას მიმართე.",
          "[შხამიანი გველების გიდი](/venomous-snakes) და [ამოცნობის გიდი](/snakes/shxamiani-gvelis-amocnoba) სახეობებს ადარებს.",
        ],
      },
      {
        heading: "რა გავაკეთოთ, თუ გველი ვერ დავინახეთ?",
        image: "call-112",
        paragraphs: [
          "თუ გველის ნაკბენზე ეჭვი გაქვს, მაგრამ ცხოველი ვერ დაინახე, მისი სახეობა უცნობად მიიჩნიე. საქართველოში დარეკე 112-ზე და მოითხოვე გადაუდებელი შეფასება; დახმარების თხოვნამდე გველის ძებნას ნუ დაიწყებ.",
          "თუ ცხოველი ჯერ კიდევ ჩანს, უსაფრთხო მანძილიდან გადაღებული ფოტო შეიძლება მოგვიანებით გამოდგეს, ოღონდ დახმარებას არ უნდა აყოვნებდეს. ამოცნობისთვის გველს არასოდეს მიუახლოვდე და არ შეეხო.",
        ],
      },
      {
        heading: "საქართველოში რომელი გველებია სამედიცინოდ მნიშვნელოვანი?",
        paragraphs: [
          "ატლასი აღწერს საქართველოს [შხამიან გველებს](/venomous-snakes), მათ შორის [გიურზას](macrovipera-lebetina). უკანა შხამკბილა [ხვლიკიჭამია გველს](malpolon-insignitus) ატლასში სხვა რისკის ნიშანი აქვს. ეს ნიშნები სახეობების პროფილებს აღწერს და კონკრეტული ნაკბენის სიმძიმეს ვერ განსაზღვრავს.",
          "სამედიცინო დახმარების ორგანიზების შემდეგ კონტექსტისთვის ნახე [გველების ინდექსი](/snakes/saxeoebebi) და [გავრცელების გიდი](/snakes/gavrtseleba). [ეზოს გიდი](/snakes-in-the-yard) პრევენციასა და შეხვედრას ეხება და არა ნაკბენის მკურნალობას.",
        ],
      },
      {
        heading: "ვინ წყვეტს, საჭიროა თუ არა ანტიშხამი?",
        image: "clinical-assessment",
        paragraphs: [
          "ადამიანის მდგომარეობას სამედიცინო პერსონალი აფასებს და წყვეტს, საჭიროა თუ არა ანტიშხამი ან სხვა მკურნალობა. WHO ანტიშხამს შხამით მოწამვლის სამკურნალო საშუალებად აღწერს, მაგრამ ეს გვერდი ვერ განსაზღვრავს მის საჭიროებას, დოზას, სახეობას ან საქართველოს საავადმყოფოში ხელმისაწვდომობას.",
          "ტრანსპორტის, მეთვალყურეობისა და მკურნალობის გადაწყვეტილებებს გადაუდებელი დახმარების სამსახური და მედიკოსები იღებენ.",
        ],
      },
    ],
    summary:
      "საქართველოში შესაძლო შხამიანი ან უცნობი გველის ნაკბენის შემდეგ მოშორდი გველს და დარეკე 112-ზე. ადამიანი და დაკბენილი კიდური შეძლებისდაგვარად უძრავად შეინარჩუნე, ნაკბენთან მჭიდრო ნივთები მოიხსენი. ნუ გაჭრი, ნუ ამოიწოვ, ნუ გაიკეთებ მჭიდრო ტურნიკეტს და გველის დაჭერისთვის დახმარებას ნუ გადადებ. სიმპტომები შეიძლება თავიდან არ ჩანდეს; ნაკბენი მედიკოსმა უნდა შეაფასოს.",
    title: "გველის ნაკბენი საქართველოში — რა უნდა გავაკეთოთ?",
  },
  ru: {
    description:
      "Укус змеи в Грузии: если змея ядовита или не определена, звоните 112. Не режьте, не отсасывайте яд и не накладывайте тугой жгут.",
    faq: [
      {
        answer:
          "Если змея ядовита или вы не можете уверенно определить её вид, сразу звоните 112 в Грузии, не ожидая симптомов. Отойдите от змеи и держите укушенную конечность неподвижно, пока организуется помощь.",
        question: "Что делать в первую очередь после укуса змеи?",
      },
      {
        answer:
          "Нет. ВОЗ и CDC не советуют разрезать рану или пытаться отсосать яд. Эти действия не заменяют своевременную медицинскую оценку.",
        question: "Можно ли разрезать укус или отсосать яд?",
      },
      {
        answer:
          "Нет. ВОЗ не советует тугой артериальный жгут. Не накладывайте самостоятельно и давящую повязку: этот метод зависит от вида змеи и не является универсальной первой помощью при укусах в Грузии.",
        question: "Нужен ли жгут или давящая повязка?",
      },
      {
        answer:
          "Нет. Не трогайте змею, даже если она кажется мёртвой. Снимок с безопасного расстояния может пригодиться позже, но не должен задерживать вызов 112 или медицинскую помощь.",
        question: "Нужно ли ловить змею для определения вида?",
      },
      {
        answer:
          "Нет. Многие змеи Грузии не являются медицински ядовитыми, но укус всё равно может повредить кожу. Если вид неизвестен, отсутствие симптомов не означает, что помощь можно отложить.",
        question: "Каждый ли укус змеи ядовит?",
      },
      {
        answer:
          "Нет. Симптомы различаются и могут появиться не сразу. Если вас могла укусить ядовитая или неопознанная змея, звоните 112 и не ждите появления признаков из списка.",
        question: "Если нет отёка, значит ли это, что укус безопасен?",
      },
    ],
    intro:
      "Если в Грузии вас укусила ядовитая или неопознанная змея, отойдите от неё и звоните 112 для неотложной медицинской помощи. Старайтесь меньше двигаться и снимите кольца и другие тесные предметы рядом с укусом. Не разрезайте рану, не отсасывайте яд и не накладывайте тугой жгут.",
    metaTitle: "Укус змеи в Грузии — звоните 112 | чего не делать",
    sections: [
      {
        heading: "Что делать сразу после укуса змеи?",
        image: "remove-ring",
        list: {
          items: [
            "Отойдите от змеи в безопасное место. Не приближайтесь к ней снова.",
            "Если змея ядовита или вы не уверены в её виде, звоните 112 в Грузии, сообщите, что произошло и где вы находитесь. Не ждите симптомов.",
            "Сядьте или лягте в безопасном месте, ограничьте лишние движения и держите укушенную руку или ногу неподвижно в удобном положении.",
            "До появления отёка снимите кольца, часы, браслеты или тесную одежду рядом с укусом.",
            "Организуйте быструю медицинскую оценку. По возможности не садитесь за руль сами: возможны головокружение или обморок.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ВОЗ рекомендует быстро доставить человека в медицинское учреждение при подозрении на ядовитый укус. В Грузии 112 — номер экстренной помощи, а не общая справочная линия. Пока помощь организуется, следуйте указаниям оператора.",
        ],
      },
      {
        heading: "Чего нельзя делать?",
        image: "keep-distance",
        list: {
          items: [
            "Не разрезайте и не иссекайте рану, не пытайтесь отсосать яд ртом или устройством.",
            "Не накладывайте тугой артериальный жгут. Давящая иммобилизирующая повязка не подходит для каждого укуса; не применяйте её самостоятельно на месте.",
            "Не прикладывайте лёд и не используйте электрический разряд, не пейте алкоголь как лечебное средство и не полагайтесь на травы и народные методы.",
            "Не ловите, не убивайте и не трогайте змею, в том числе мёртвую. Не откладывайте помощь ради определения вида.",
          ],
        },
        paragraphs: [
          "Такие действия могут навредить или отнять время, нужное для медицинской помощи. ВОЗ и CDC не советуют их в публичных рекомендациях по первой помощи.",
        ],
      },
      {
        heading: "Какие симптомы может вызвать укус змеи?",
        list: {
          items: [
            "Боль, покраснение, отёк, синяки, пузыри или кровотечение рядом с укусом.",
            "Тошнота, рвота, слабость, головокружение, покалывание или изменения зрения.",
            "Затруднённое дыхание, обморок или необычное кровотечение могут указывать на серьёзную проблему.",
          ],
        },
        paragraphs: [
          "Признаки зависят от вида, введённого яда, места укуса и состояния человека. Это не диагностический список. Отсутствие раннего признака не доказывает, что укус безвреден.",
        ],
      },
      {
        heading: "Когда ситуация особенно тревожна?",
        paragraphs: [
          "Затруднённое дыхание, обморок, сильная слабость, необычное кровотечение или быстро нарастающий отёк требуют экстренной помощи. В Грузии звоните 112. Из-за меньшей массы тела у детей последствия действия яда могут быть тяжелее.",
          "Укус неопознанной змеи тоже требует своевременной оценки, даже если сначала человек чувствует себя хорошо. Не откладывайте помощь по виду раны или предположению о виде змеи.",
        ],
      },
      {
        heading: "Каждый ли укус змеи ядовит?",
        paragraphs: [
          "Нет. Многие змеи в Грузии не являются медицински ядовитыми для человека, но их укус может повредить кожу. Если вид неизвестен или яд возможен, сначала обратитесь за экстренной оценкой.",
          "[Гид по ядовитым змеям](/venomous-snakes) и [гид по определению](/snakes/shxamiani-gvelis-amocnoba) сравнивают виды.",
        ],
      },
      {
        heading: "Что делать, если вы не видели змею?",
        image: "call-112",
        paragraphs: [
          "Если вы подозреваете укус змеи, но не видели животное, считайте вид неизвестным. В Грузии звоните 112 и обращайтесь за экстренной оценкой; не ищите змею до обращения за помощью.",
          "Если животное ещё видно, фотография с безопасного расстояния может пригодиться позже, только если она не задержит помощь. Никогда не приближайтесь к змее и не трогайте её ради определения вида.",
        ],
      },
      {
        heading: "Какие змеи Грузии имеют медицинское значение?",
        paragraphs: [
          "Атлас описывает [ядовитых змей Грузии](/venomous-snakes), включая [гюрзу](macrovipera-lebetina). У заднебороздчатой [ящеричной змеи](malpolon-insignitus) другая отметка риска в атласе. Эти отметки описывают виды, а не тяжесть отдельного укуса.",
          "После организации медицинской помощи посмотрите [указатель видов](/snakes/saxeoebebi) и [гид по распространению](/snakes/gavrtseleba). [Гид по змеям во дворе](/snakes-in-the-yard) посвящён профилактике и встречам, а не лечению укуса.",
        ],
      },
      {
        heading: "Кто решает, нужно ли противоядие?",
        image: "clinical-assessment",
        paragraphs: [
          "Медицинские работники оценивают состояние человека и решают, показано ли противоядие или иное лечение. ВОЗ описывает противоядие как средство лечения отравления ядом, но эта страница не может определить необходимость, дозу, препарат или его наличие в больнице Грузии.",
          "Решения о перевозке, наблюдении и лечении принимают служба экстренной помощи и медики.",
        ],
      },
    ],
    summary:
      "После возможного укуса ядовитой или неопознанной змеи в Грузии отойдите от неё и звоните 112. Старайтесь держать человека и укушенную конечность неподвижно и снимите тесные предметы рядом с укусом. Не разрезайте рану, не отсасывайте яд, не накладывайте тугой жгут и не задерживайте помощь ради поимки змеи. Ранних симптомов может не быть; укус должен оценить медик.",
    title: "Укус змеи в Грузии — что делать?",
  },
  tr: {
    description:
      "Gürcistan’da yılan ısırığı: yılan zehirliyse veya tanınmıyorsa 112’yi arayın. Yarayı kesmeyin, zehri emmeyin, sıkı turnike uygulamayın.",
    faq: [
      {
        answer:
          "Yılan zehirliyse veya türünü güvenle tanıyamıyorsanız Gürcistan’da belirtileri beklemeden 112’yi arayın. Yılandan uzaklaşın ve yardım düzenlenirken ısırılan uzvu hareketsiz tutun.",
        question: "Yılan ısırığından sonra ilk ne yapmalıyım?",
      },
      {
        answer:
          "Hayır. WHO ve CDC yarayı kesmeyi veya zehri emmeye çalışmayı önermiyor. Bunlar zamanında tıbbi değerlendirmeye alternatif değildir.",
        question: "Isırığı kesebilir veya zehri emebilir miyim?",
      },
      {
        answer:
          "Hayır. WHO sıkı atardamar turnikesini önermiyor. Basınçlı bandajı da kendi başınıza uygulamayın: yöntem yılan türüne bağlıdır ve Gürcistan’daki her ısırık için genel ilk yardım değildir.",
        question: "Turnike veya basınçlı bandaj kullanmalı mıyım?",
      },
      {
        answer:
          "Hayır. Ölü görünse bile yılana dokunmayın. Güvenli mesafeden fotoğraf daha sonra yardımcı olabilir; ancak 112 aramasını veya tıbbi bakımı geciktirmemelidir.",
        question: "Türünü belirlemek için yılanı yakalamalı mıyım?",
      },
      {
        answer:
          "Hayır. Gürcistan’daki birçok yılan insanlar için tıbben zehirli değildir; yine de ısırık deriyi yaralayabilir. Tür bilinmiyorsa belirtilerin olmamasını yardımı ertelemek için gerekçe saymayın.",
        question: "Her yılan ısırığı zehirli midir?",
      },
      {
        answer:
          "Hayır. Belirtiler değişir ve hemen ortaya çıkmayabilir. Zehirli veya tanınmayan bir yılan ısırmış olabilirse 112’yi arayın; belirti listesini beklemeyin.",
        question: "Şişlik olmaması ısırığın güvenli olduğu anlamına gelir mi?",
      },
    ],
    intro:
      "Gürcistan’da zehirli veya tanınmayan bir yılan sizi ısırdıysa yılandan uzaklaşın ve acil tıbbi yardım için 112’yi arayın. Hareketi azaltın; ısırık yakınındaki yüzük ve diğer sıkı eşyaları çıkarın. Yarayı kesmeyin, zehri emmeyin ve sıkı turnike uygulamayın.",
    metaTitle: "Gürcistan’da yılan ısırığı — 112’yi arayın | ne yapmayın",
    sections: [
      {
        heading: "Yılan ısırığından hemen sonra ne yapmalısınız?",
        image: "remove-ring",
        list: {
          items: [
            "Yılandan uzaklaşıp güvenli bir yere geçin. Tekrar yaklaşmayın.",
            "Yılan zehirliyse veya türünden emin değilseniz Gürcistan’da 112’yi arayın; ne olduğunu ve nerede bulunduğunuzu anlatın. Belirtileri beklemeyin.",
            "Güvenli bir yerde oturun veya uzanın, gereksiz hareketi azaltın ve ısırılan kolu ya da bacağı rahat bir konumda hareketsiz tutun.",
            "Şişlik başlamadan önce ısırık yakınındaki yüzük, saat, bileklik veya sıkı giysileri çıkarın.",
            "Hızlı tıbbi değerlendirme ayarlayın. Mümkünse aracı kendiniz kullanmayın; baş dönmesi veya bayılma olabilir.",
          ],
          ordered: true,
        },
        paragraphs: [
          "WHO, zehirli ısırık şüphesinde sağlık kuruluşuna hızla ulaşılmasını önerir. Gürcistan’da 112 genel bilgi hattı değil, acil yardım numarasıdır. Yardım düzenlenirken operatörün talimatlarını izleyin.",
        ],
      },
      {
        heading: "Neler yapmamalısınız?",
        image: "keep-distance",
        list: {
          items: [
            "Yarayı kesmeyin veya çıkarmaya çalışmayın; zehri ağızla ya da cihazla emmeyin.",
            "Sıkı atardamar turnikesi uygulamayın. Basınçlı hareketsizleştirme bandajı her ısırığa uygun değildir; olay yerinde kendi başınıza uygulamayın.",
            "Buz veya elektrik şoku uygulamayın, tedavi için alkol içmeyin; bitkilere veya diğer halk yöntemlerine güvenmeyin.",
            "Ölü olsa bile yılanı yakalamayın, öldürmeyin veya ona dokunmayın. Türü belirlemek için yardımı geciktirmeyin.",
          ],
        },
        paragraphs: [
          "Bu yöntemler zarar verebilir veya tıbbi bakım için gerekli zamanı kaybettirebilir. WHO ve CDC bunları halka yönelik ilk yardım önerilerinde tavsiye etmez.",
        ],
      },
      {
        heading: "Yılan ısırığı hangi belirtilere yol açabilir?",
        list: {
          items: [
            "Isırık çevresinde ağrı, kızarıklık, şişlik, morarma, kabarcık veya kanama.",
            "Bulantı, kusma, halsizlik, baş dönmesi, karıncalanma veya görme değişiklikleri.",
            "Nefes almada güçlük, bayılma veya olağandışı kanama ciddi bir soruna işaret edebilir.",
          ],
        },
        paragraphs: [
          "Belirtiler türe, verilen zehre, ısırık yerine ve kişiye göre değişir. Bu bir tanı listesi değildir. Başlangıçta bir belirtinin olmaması ısırığın zararsız olduğunu kanıtlamaz.",
        ],
      },
      {
        heading: "Durum ne zaman özellikle endişe vericidir?",
        paragraphs: [
          "Nefes almada güçlük, bayılma, ağır halsizlik, olağandışı kanama veya hızla artan şişlik acil yardım gerektirir. Gürcistan’da 112’yi arayın. Çocuklarda vücut kütlesi daha küçük olduğundan zehrin etkileri daha ağır olabilir.",
          "Tanımlanmamış bir yılanın ısırığı da kişi başlangıçta iyi hissetse bile zamanında değerlendirilmelidir. Yaraya bakarak veya türü tahmin ederek bakımı ertelemeyin.",
        ],
      },
      {
        heading: "Her yılan ısırığı zehirli midir?",
        paragraphs: [
          "Hayır. Gürcistan’daki birçok yılan insanlar için tıbben zehirli değildir, ancak ısırıkları deriyi yaralayabilir. Tür bilinmiyorsa veya zehir olasılığı varsa önce acil değerlendirme isteyin.",
          "[Zehirli yılanlar rehberi](/venomous-snakes) ve [tanıma rehberi](/snakes/shxamiani-gvelis-amocnoba) türleri karşılaştırır.",
        ],
      },
      {
        heading: "Yılanı görmediyseniz ne yapmalısınız?",
        image: "call-112",
        paragraphs: [
          "Yılan ısırığından şüpheleniyor ancak hayvanı görmediyseniz türünü bilinmiyor kabul edin. Gürcistan’da 112’yi arayıp acil değerlendirme isteyin; yardım istemeden önce yılanı aramayın.",
          "Hayvan hâlâ görünüyorsa güvenli mesafeden bir fotoğraf sonra yardımcı olabilir; yalnızca bakımı geciktirmiyorsa çekin. Tanımak için asla yaklaşmayın veya dokunmayın.",
        ],
      },
      {
        heading: "Gürcistan’da hangi yılanlar tıbben önemlidir?",
        paragraphs: [
          "Atlas, [Gürcistan’ın zehirli yılanlarını](/venomous-snakes), bunlar arasında [Levant engereğini](macrovipera-lebetina) anlatır. Arka zehir dişli [Montpellier yılanının](malpolon-insignitus) atlas risk etiketi farklıdır. Bu etiketler tür profillerini tanımlar; tek bir ısırığın ağırlığını belirlemez.",
          "Tıbbi yardım düzenlendikten sonra bağlam için [yılan türleri dizinine](/snakes/saxeoebebi) ve [yayılış rehberine](/snakes/gavrtseleba) bakın. [Bahçe rehberi](/snakes-in-the-yard) önleme ve karşılaşmalarla ilgilidir; ısırık tedavisiyle değil.",
        ],
      },
      {
        heading: "Antivenom gerekip gerekmediğine kim karar verir?",
        image: "clinical-assessment",
        paragraphs: [
          "Sağlık çalışanları kişiyi değerlendirip antivenom veya başka tedavi gerekip gerekmediğine karar verir. WHO antivenomu zehirlenme tedavisi olarak tanımlar; bu sayfa Gürcistan’daki bir hastanede gerekliliğini, dozunu, ürününü veya bulunurluğunu belirleyemez.",
          "Nakil, gözlem ve tedavi kararlarını acil yardım hizmeti ve sağlık çalışanları verir.",
        ],
      },
    ],
    summary:
      "Gürcistan’da olası zehirli veya tanınmayan yılan ısırığından sonra yılandan uzaklaşın ve 112’yi arayın. Kişiyi ve ısırılan uzvu mümkün olduğunca hareketsiz tutun; ısırık yakınındaki sıkı eşyaları çıkarın. Yarayı kesmeyin, zehri emmeyin, sıkı turnike uygulamayın ve yılanı yakalamak için bakımı geciktirmeyin. Belirtiler başlangıçta olmayabilir; ısırığı sağlık çalışanları değerlendirmelidir.",
    title: "Gürcistan’da yılan ısırığı — ne yapmalısınız?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "Georgia 112 — When to call 112",
    supports: {
      en: "Georgia's 24-hour emergency dispatch number and the information to give the operator; it is for emergencies, not general advice.",
      ka: "საქართველოს სადღეღამისო გადაუდებელი დახმარების ნომერი და ოპერატორისთვის მისაწოდებელი ინფორმაცია; 112 ზოგადი რჩევის ხაზი არ არის.",
      ru: "Круглосуточный номер экстренной помощи в Грузии и сведения для оператора; 112 не является общей справочной линией.",
      tr: "Gürcistan'ın 24 saat acil yardım numarası ve operatöre verilecek bilgiler; 112 genel danışma hattı değildir.",
    },
    url: "https://112.gov.ge/?page_id=1686&lang=en",
  },
  {
    name: "WHO — Snakebite envenoming: treatment and first aid",
    supports: {
      en: "Prompt medical care for suspected venomous bites; move away, remove tight items, immobilize, and avoid incision, suction, tight arterial tourniquets and traditional remedies. Pressure bandaging is species dependent.",
      ka: "შხამიანი ნაკბენის ეჭვისას სწრაფი სამედიცინო დახმარება; მოშორება, მჭიდრო ნივთების მოხსნა, უძრაობა და ჭრილობის გაჭრის, ამოწოვის, მჭიდრო ტურნიკეტისა და ხალხური მეთოდების არიდება. ზეწოლითი სახვევი სახეობაზეა დამოკიდებული.",
      ru: "Быстрая медицинская помощь при подозрении на ядовитый укус; удаление от змеи, снятие тесных предметов, обездвиживание и отказ от разрезов, отсасывания, тугого жгута и народных средств. Давящая повязка зависит от вида.",
      tr: "Zehirli ısırık şüphesinde hızlı tıbbi bakım; yılandan uzaklaşma, sıkı eşyaları çıkarma, hareketsiz tutma; kesme, emme, sıkı turnike ve halk yöntemlerinden kaçınma. Basınçlı bandaj türe bağlıdır.",
    },
    url: "https://www.who.int/teams/control-of-neglected-tropical-diseases/snakebite-envenoming/treatment",
  },
  {
    name: "WHO — Snakebite envenoming fact sheet",
    supports: {
      en: "Possible serious effects of venom, including breathing and bleeding problems, and the higher severity children may experience because of smaller body mass.",
      ka: "შხამის შესაძლო მძიმე ეფექტები, მათ შორის სუნთქვისა და სისხლდენის პრობლემები, და ბავშვებში პატარა სხეულის მასასთან დაკავშირებული მეტი სიმძიმე.",
      ru: "Возможные тяжёлые последствия действия яда, включая нарушения дыхания и кровотечения, а также большую тяжесть у детей из-за меньшей массы тела.",
      tr: "Zehirin solunum ve kanama sorunları dahil olası ağır etkileri ve küçük vücut kütlesi nedeniyle çocuklarda daha ağır seyir olasılığı.",
    },
    url: "https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming",
  },
  {
    name: "CDC / NIOSH — Venomous Snakes at Work",
    supports: {
      en: "Possible bite signs; urgent care without waiting for symptoms; removal of rings, avoiding driving alone, safe-distance photos, and avoiding ice, electric shock, alcohol, incision, suction, tourniquets, or handling the snake.",
      ka: "ნაკბენის შესაძლო ნიშნები; დახმარება სიმპტომების მოლოდინის გარეშე; ბეჭდების მოხსნა, მანქანის მარტო არ მართვა, შორიდან ფოტო და ყინულის, ელექტროშოკის, ალკოჰოლის, გაჭრის, ამოწოვის, ტურნიკეტისა და გველთან შეხების არიდება.",
      ru: "Возможные признаки укуса; помощь без ожидания симптомов; снятие колец, отказ от самостоятельного вождения, фото издалека и отказ от льда, электричества, алкоголя, разрезов, отсасывания, жгута и контакта со змеёй.",
      tr: "Olası ısırık belirtileri; belirtileri beklemeden yardım; yüzükleri çıkarma, tek başına araç kullanmama, uzaktan fotoğraf ve buz, elektrik, alkol, kesme, emme, turnike veya yılana dokunmaktan kaçınma.",
    },
    url: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html",
  },
];

export const SNAKE_BITE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Two hikers on a rocky trail, one seated while the other calls for help; a snake is farther away",
      ka: "კლდოვან ბილიკზე ორი მოლაშქრეა: ერთი ზის, მეორე ტელეფონით დახმარებას იძახებს; გველი მოშორებით ჩანს",
      ru: "Двое туристов на каменистой тропе: один сидит, другая звонит за помощью; змея находится вдали",
      tr: "Taşlı patikada iki yürüyüşçü: biri otururken diğeri yardım çağırıyor; yılan uzakta görünüyor",
    },
    height: 909,
    src: "/images/guides/snake-bite-hero.jpg",
    width: 1730,
  },
  id: "snake-bite",
  images: {
    "call-112": {
      alt: {
        en: "Seated hiker calling for help on a phone while a companion waits nearby",
        ka: "მჯდომარე მოლაშქრე ტელეფონით დახმარებას იძახებს, გვერდით თანამგზავრი ელოდება",
        ru: "Сидящий турист звонит за помощью, рядом ждёт спутница",
        tr: "Oturan yürüyüşçü telefonda yardım çağırıyor, yanında bir arkadaşı bekliyor",
      },
      height: 1024,
      src: "/images/guides/snake-bite-call-112.jpg",
      width: 1536,
    },
    "clinical-assessment": {
      alt: {
        en: "Clinician speaking with a seated patient and companion in a consultation room",
        ka: "ექიმი საკონსულტაციო ოთახში მჯდომ პაციენტსა და მის თანამგზავრს ესაუბრება",
        ru: "Врач беседует с пациентом и его спутницей в кабинете",
        tr: "Klinisyen muayene odasında oturan hasta ve yakınıyla konuşuyor",
      },
      height: 1024,
      src: "/images/guides/snake-bite-clinical-assessment.jpg",
      width: 1536,
    },
    "keep-distance": {
      alt: {
        en: "Two hikers stop several metres from a snake on a rocky trail",
        ka: "ორი მოლაშქრე კლდოვან ბილიკზე გველისგან რამდენიმე მეტრის მოშორებით ჩერდება",
        ru: "Двое туристов останавливаются в нескольких метрах от змеи на каменистой тропе",
        tr: "İki yürüyüşçü taşlı patikadaki yılandan birkaç metre uzakta duruyor",
      },
      height: 1024,
      src: "/images/guides/snake-bite-keep-distance.jpg",
      width: 1536,
    },
    "remove-ring": {
      alt: {
        en: "Seated person gently removing a ring from their finger outdoors",
        ka: "გარეთ მჯდომი ადამიანი თითიდან ბეჭედს იხსნის",
        ru: "Сидящий на улице человек осторожно снимает кольцо с пальца",
        tr: "Dışarıda oturan kişi parmağındaki yüzüğü çıkarıyor",
      },
      height: 1024,
      src: "/images/guides/snake-bite-remove-ring.jpg",
      width: 1536,
    },
  },
  messageKey: "bite",
  ogImage: "/og/images/guides/snake-bite.jpg",
  parentHub: "snakes",
  pathname: "/snakes/gvelis-nakbeni",
  relatedGuideIds: ["scorpion-sting"],
  relatedSpeciesIds: [
    "macrovipera-lebetina",
    "vipera-darevskii",
    "vipera-dinniki",
    "vipera-kaznakovi",
    "vipera-renardi",
    "vipera-transcaucasiana",
    "malpolon-insignitus",
  ],
  search: {
    icon: "safety",
    keywords: [
      "გველის ნაკბენი",
      "გველმა მიკბინა",
      "გველის ნაკბენის პირველადი დახმარება",
      "გველის ნაკბენის სიმპტომები",
      "შხამიანი გველის ნაკბენი",
      "112",
      "snakebite Georgia",
      "snake bite first aid",
      "укус змеи Грузия",
      "yılan ısırığı Gürcistan",
    ],
    rank: 3,
    subtitle: {
      en: "112, first steps and what to avoid",
      ka: "112, პირველი ნაბიჯები და რა არ უნდა გააკეთო",
      ru: "112, первые шаги и чего избегать",
      tr: "112, ilk adımlar ve kaçınılması gerekenler",
    },
    title: {
      en: "Snakebite in Georgia — what should you do?",
      ka: "გველის ნაკბენი საქართველოში — რა უნდა გავაკეთოთ?",
      ru: "Укус змеи в Грузии — что делать?",
      tr: "Gürcistan’da yılan ısırığı — ne yapmalısınız?",
    },
  },
  sources: SOURCES,
});
