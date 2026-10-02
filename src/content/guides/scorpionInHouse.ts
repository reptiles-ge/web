import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "gap" | "jar";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Found a scorpion in your home? Keep children and pets away, avoid handling it, check possible entry gaps, and learn how to reduce another encounter.",
    faq: [
      {
        answer:
          "No. One sighting cannot tell you how many scorpions are nearby. Check accessible entry points and keep track of any further sightings; ask for help if they recur.",
        question: "Does one scorpion mean there are more indoors?",
      },
      {
        answer:
          "Yes, they can hide in items left outdoors. Check shoes and clothing before use and inspect firewood before bringing it inside, without reaching blindly into a pile.",
        question: "Could one be in shoes or firewood?",
      },
      {
        answer:
          "No. Repair gaps that may let animals enter, such as loose door seals, damaged window screens and openings around pipes. Do not block ventilation, drainage or other essential building openings; ask a qualified tradesperson if unsure.",
        question: "Should every opening in the house be sealed?",
      },
      {
        answer:
          "No. First address entry points and shelter close to the building. Pesticides alone may not control scorpions; if considering a product, follow its label and keep children and pets away from treated areas.",
        question: "Should I spray the whole house?",
      },
      {
        answer:
          "Ask for help with removal if you cannot keep a safe distance or the scorpion is inaccessible. A tradesperson can repair building gaps; for repeated sightings, a pest-control professional can inspect the cause before proposing treatment. Georgia's 112 is for emergencies, not routine removal.",
        question: "Who can help if I cannot remove it safely?",
      },
    ],
    intro:
      "Do not touch the scorpion. Move children and pets away, keep your distance and decide whether you need help before trying to move it.",
    metaTitle: "Scorpion in the house: what to do and how to keep it out",
    notice:
      "Stung by a scorpion? See the [scorpion sting guide](/scorpions/morielis-nakbeni) for first steps and signs that need medical care. In an emergency in Georgia, call 112; do not delay care to catch or identify the animal.",
    sections: [
      {
        heading: "What should you do when you see a scorpion indoors?",
        list: {
          items: [
            "Keep children and pets away from the area. Do not touch the scorpion or try to pick it up.",
            "Keep a safe distance and watch where it is from a position that does not put you at risk.",
            "If you cannot deal with the situation comfortably and safely, ask for help with removal. You do not need to identify the species first.",
          ],
          ordered: true,
        },
        paragraphs: [
          "The first job is to avoid direct contact. A photograph is optional and must not come before keeping people safe. The [scorpion atlas](/scorpions) has profiles if you want to learn about the species recorded in Georgia later.",
        ],
      },
      {
        heading: "Can you move it without touching it?",
        image: "jar",
        paragraphs: [
          "You do not have to catch it yourself. An adult should consider the container method only if the whole scorpion is visible and easily accessible, and the action requires neither reaching into a gap nor moving heavy furniture. If you are afraid, unsure or cannot keep control of the container, get help instead.",
          "If those conditions are met, place a glass jar over the scorpion, slide a firm sheet of paper fully under the opening, hold it securely against the jar, turn the jar upright and fasten a secure lid. Keep hands clear of the opening throughout. This does not remove every risk; seek appropriate help for what to do with the contained animal, especially if its origin is unknown or it may have escaped from a terrarium. Do not release an animal of uncertain origin into nature.",
        ],
      },
      {
        heading: "What if the scorpion disappears into a hiding place?",
        paragraphs: [
          "Keep children and pets away from the area. Do not reach blindly behind furniture or into cracks, move heavy furniture to force it out, or dismantle an electrical appliance. Do not spray a random chemical into the hiding place.",
          "If you cannot locate it without taking these risks, ask for help. An open window or a dark room does not guarantee that it will leave.",
        ],
      },
      {
        heading: "Where might it have entered?",
        image: "gap",
        paragraphs: [
          "Check the gap under doors, loose window fittings, damaged screens and openings around pipes. These are possible routes, not proof of the exact route this scorpion used. There is no reason to assume every scorpion comes through a drain.",
        ],
      },
      {
        heading: "What should you check to reduce another encounter?",
        list: {
          items: [
            "Repair loose door and window seals and damaged screens. Close accessible gaps around pipes and frames without blocking ventilation, drainage or essential building functions; ask a tradesperson if the repair is uncertain.",
            "Check firewood before bringing it indoors, and avoid storing it inside. Reduce piles of boards, wood and other loose items immediately beside the house, without trying to clear the whole natural environment.",
            "Fix leaks and standing moisture. Look over boxes and other items brought indoors, and check shoes or clothing left where a scorpion could hide before using them.",
          ],
        },
        paragraphs: [
          "Focus on the places an animal could enter or hide close to the building. These steps can lower the chance of another encounter; they cannot guarantee that one will never happen.",
        ],
      },
      {
        heading: "Do you need a chemical product?",
        paragraphs: [
          "Prevention and physical repairs come first. Scorpions can shelter in cracks, so pesticide use alone is not a reliable solution. Do not spray an entire room out of frustration or use an outdoor product indoors.",
          "If you are considering a product, check that its label permits the intended use and follow every safety instruction. Do not increase the dose or let children or pets near treated areas. A professional should inspect entry points and shelter before proposing treatment.",
        ],
      },
      {
        heading: "When is it better to ask a specialist?",
        paragraphs: [
          "Ask for removal help if the scorpion is hidden in an inaccessible place or you cannot act safely. Repeated sightings are a reason to investigate entry points and shelter with a pest-control professional; no fixed number of sightings proves an infestation.",
          "A building repair may need a tradesperson, while removal or pest control is a different service. Calling 112 is appropriate for an emergency, not for an ordinary removal request.",
        ],
      },
    ],
    summary:
      "Keep children and pets away, avoid touching the scorpion and maintain a safe distance. Ask for help if it hides or you cannot move it safely. Check door and window gaps, screens, pipe openings and items kept beside the house; repair possible entry points and reduce nearby shelter. If someone has been stung, use the scorpion sting guide; call 112 in Georgia for an emergency.",
    title:
      "Scorpion in the house — what to do and how to reduce another encounter?",
  },
  ka: {
    description:
      "სახლში მორიელი ნახეთ? გაიგეთ, როგორ მოიქცეთ უსაფრთხოდ, სად შეამოწმოთ ღრიჭოები და როგორ შეამციროთ მისი ხელახლა შემოსვლის შანსი.",
    faq: [
      {
        answer:
          "არა. ერთი შემთხვევით ვერ დაადგენთ, კიდევ რამდენი მორიელია ახლოს. შეამოწმეთ ხელმისაწვდომი შემოსასვლელები და დააკვირდით, განმეორდება თუ არა შეხვედრა; განმეორებისას დახმარება ითხოვეთ.",
        question: "ერთი მორიელი ვნახე — ნიშნავს, რომ სახლში სხვებიც არიან?",
      },
      {
        answer:
          "შესაძლებელია, მორიელი გარეთ დატოვებულ ნივთში დაიმალოს. გამოყენებამდე შეამოწმეთ ფეხსაცმელი და ტანსაცმელი, შეშა კი სახლში შემოტანამდე დათვალიერეთ ისე, რომ ხელით ბრმად არ შეეხოთ გროვას.",
        question: "შეიძლება მორიელი ფეხსაცმელში ან შეშაში იყოს?",
      },
      {
        answer:
          "არა. მოაწესრიგეთ კარის ქვედა ნაპრალი, დაზიანებული ბადე და მილების ირგვლივ ისეთი ღრიჭოები, საიდანაც შემოსვლა შეიძლება. არ დახშოთ ვენტილაცია, დრენაჟი ან შენობისთვის აუცილებელი სხვა ღიობები; ეჭვისას ხელოსანს მიმართეთ.",
        question: "სახლის ყველა ღიობი უნდა დავხუროთ?",
      },
      {
        answer:
          "არა. ჯერ შემოსასვლელები და უშუალოდ სახლთან არსებული სამალავები შეამოწმეთ. მხოლოდ პესტიციდი მორიელებზე საიმედო შედეგს არ იძლევა; საშუალების გამოყენებისას დაიცავით ეტიკეტი და ბავშვები და ცხოველები დამუშავებულ ადგილს მოარიდეთ.",
        question: "საჭიროა მთელი სახლის შეწამვლა?",
      },
      {
        answer:
          "თუ დისტანციას ვერ ინარჩუნებთ ან მორიელი მიუდგომელ ადგილასაა, მოცილებაში დახმარება ითხოვეთ. ღრიჭოს შეკეთებაში ხელოსანი დაგეხმარებათ, განმეორებითი შეხვედრებისას კი მავნებლების კონტროლის სპეციალისტს მიზეზის შემოწმება სთხოვეთ. 112 გადაუდებელი შემთხვევებისთვისაა და არა ჩვეულებრივი მოცილებისთვის.",
        question: "ვის მივმართო, თუ უსაფრთხოდ მოცილებას ვერ ვახერხებ?",
      },
    ],
    intro:
      "მორიელს არ შეეხოთ. მოარიდეთ ბავშვები და შინაური ცხოველები, შეინარჩუნეთ დისტანცია და მოცილების მცდელობამდე გადაწყვიტეთ, გჭირდებათ თუ არა დახმარება.",
    metaTitle: "მორიელი სახლში — როგორ მოვიქცეთ და დავიცვათ სახლი?",
    notice:
      "მორიელმა გიჩხვლიტათ? პირველი ნაბიჯები და ექიმთან მიმართვის ნიშნები ნახეთ [მორიელის ნაკბენის გიდში](/scorpions/morielis-nakbeni). გადაუდებელი მდგომარეობისას საქართველოში დარეკეთ 112-ზე; დახმარება არ გადადოთ მორიელის დაჭერის ან ამოცნობის გამო.",
    sections: [
      {
        heading: "მორიელი სახლში ვნახე — რა გავაკეთო ახლა?",
        list: {
          items: [
            "მოარიდეთ ბავშვები და შინაური ცხოველები. მორიელს არ შეეხოთ და ხელში აყვანას ნუ ეცდებით.",
            "შეინარჩუნეთ უსაფრთხო დისტანცია და თვალყური ადევნეთ მხოლოდ იქიდან, სადაც საფრთხე არ გემუქრებათ.",
            "თუ მშვიდად და უსაფრთხოდ ვერ მოქმედებთ, მოცილებაში დახმარება ითხოვეთ. ამისთვის სახეობის წინასწარ დადგენა საჭირო არ არის.",
          ],
          ordered: true,
        },
        paragraphs: [
          "პირველი საქმე პირდაპირი შეხების თავიდან აცილებაა. ფოტოს გადაღება აუცილებელი არ არის და ადამიანების უსაფრთხოებაზე წინ არ უნდა დადგეს. საქართველოში აღწერილი სახეობების შესახებ მოგვიანებით შეგიძლიათ ნახოთ [მორიელების ატლასი](/scorpions).",
        ],
      },
      {
        heading: "შეიძლება თუ არა შეხების გარეშე მოცილება?",
        image: "jar",
        paragraphs: [
          "მორიელის დაჭერა თქვენი ვალდებულება არ არის. კონტეინერის მეთოდი ზრდასრულმა მხოლოდ მაშინ შეიძლება განიხილოს, როცა მორიელი მთლიანად ჩანს, მისადგომ ადგილასაა და მოქმედებას არც ღრიჭოში ხელის შეყოფა სჭირდება, არც მძიმე ავეჯის გადაადგილება. შიშის, გაურკვევლობის ან მოუხერხებელი პირობებისას დახმარება ითხოვეთ.",
          "თუ ეს პირობები სრულდება, მორიელს ზემოდან მინის ქილა დააფარეთ, ქვეშ მყარი ქაღალდი ბოლომდე შეაცურეთ, ქილას მჭიდროდ მიაჭირეთ, ქილა სწორად გადააბრუნეთ და მჭიდრო თავსახური დაახურეთ. ხელი ქილის ღია მხარეს არ მიიტანოთ. ეს სრულ უსაფრთხოებას არ ნიშნავს. კონტეინერში მოქცეული ცხოველის შემდგომ მოპყრობაზე დახმარება ითხოვეთ, განსაკუთრებით თუ მისი წარმოშობა უცნობია ან შეიძლება ტერარიუმიდან იყოს გაქცეული; ასეთ ცხოველს ბუნებაში ნუ გაუშვებთ.",
        ],
      },
      {
        heading: "რა ვქნა, თუ მორიელი დაიმალა?",
        paragraphs: [
          "ბავშვები და შინაური ცხოველები იმ ადგილს მოარიდეთ. ავეჯის უკან ან ღრიჭოში ხელით ბრმად ნუ მოძებნით, მის გამოსადევნად მძიმე ავეჯს ნუ გადაადგილებთ და ელექტრომოწყობილობას ნუ დაშლით. სამალავში შემთხვევით ქიმიურ საშუალებას ნუ შეასხურებთ.",
          "თუ ამგვარი რისკის გარეშე ვერ პოულობთ, დახმარება ითხოვეთ. ღია ფანჯარა ან ჩაბნელებული ოთახი არ იძლევა გარანტიას, რომ მორიელი გავა.",
        ],
      },
      {
        heading: "საიდან შეიძლება შემოსულიყო მორიელი?",
        image: "gap",
        paragraphs: [
          "შეამოწმეთ კარის ქვედა ნაპრალი, ფანჯრის მორყეული ჩარჩო, დაზიანებული ბადე და მილების გარშემო ღიობები. ეს შესაძლო შემოსასვლელებია და არა მტკიცება, რომ სწორედ აქედან შემოვიდა თქვენ მიერ ნანახი მორიელი. არც იმის საფუძველია, რომ ყველა მორიელი კანალიზაციიდან მოდის.",
        ],
      },
      {
        heading: "რა შევამოწმოთ, რომ შეხვედრის შანსი შევამციროთ?",
        list: {
          items: [
            "შეაკეთეთ კარ-ფანჯრის მორყეული დამცავი ზოლები და დაზიანებული ბადეები. ხელმისაწვდომი ღრიჭოები მილებისა და ჩარჩოების ირგვლივ ისე დახურეთ, რომ ვენტილაცია, დრენაჟი და შენობის სხვა აუცილებელი ფუნქციები არ დაირღვეს; ეჭვისას ხელოსანს მიმართეთ.",
            "შეშა სახლში შემოტანამდე დათვალიერეთ და შიგნით ნუ დააწყობთ. უშუალოდ სახლის კედელთან შეამცირეთ ფიცრების, შეშისა და სხვა ნივთების გროვები — ბუნებრივი გარემოს მთლიანად გასუფთავება საჭირო არ არის.",
            "შეაკეთეთ გაჟონვა და მოაშორეთ დაგუბებული წყალი. სახლში შემოტანილი ყუთები და სხვა ნივთები უსაფრთხოდ დაათვალიერეთ; გამოყენებამდე შეამოწმეთ ფეხსაცმელი და ტანსაცმელი, თუ მათში მორიელს დამალვა შეეძლო.",
          ],
        },
        paragraphs: [
          "ყურადღება მიაქციეთ სახლის უშუალო სიახლოვეს შესაძლო შესასვლელებსა და სამალავებს. ეს ნაბიჯები ხელახლა შეხვედრის შანსს ამცირებს, მაგრამ გარანტიას ვერ იძლევა.",
        ],
      },
      {
        heading: "საჭიროა ქიმიური საშუალება?",
        paragraphs: [
          "ჯერ შემოსასვლელები და სამალავები მოაწესრიგეთ. მორიელი ღრიჭოებში იმალება, ამიტომ მხოლოდ პესტიციდზე დაყრდნობა საიმედო გამოსავალი არ არის. გაღიზიანების გამო მთელ ოთახში საშუალება ნუ შეასხურებთ და გარე გამოყენების პროდუქტს სახლში ნუ გამოიყენებთ.",
          "თუ საშუალების გამოყენებას განიხილავთ, გადაამოწმეთ, რომ ეტიკეტი ამ კონკრეტულ გამოყენებას უშვებს, და ყველა უსაფრთხოების მითითება დაიცავით. დოზა თვითნებურად არ გაზარდოთ; ბავშვები და შინაური ცხოველები დამუშავებულ ადგილებს მოარიდეთ. სპეციალისტს დამუშავების შეთავაზებამდე შემოსასვლელებისა და სამალავების შემოწმება სთხოვეთ.",
        ],
      },
      {
        heading: "როდის ჯობს სპეციალისტის დახმარება?",
        paragraphs: [
          "მოცილებაში დახმარება ითხოვეთ, თუ მორიელი მიუდგომელ ადგილას დაიმალა ან უსაფრთხოდ ვერ მოქმედებთ. განმეორებითი შეხვედრები მიზეზია, რომ მავნებლების კონტროლის სპეციალისტთან ერთად შემოსასვლელები და სამალავები შეამოწმოთ; შემთხვევების გარკვეული რაოდენობა თავისთავად „ინფესტაციას“ არ ნიშნავს.",
          "შენობის ღრიჭოს შეკეთებას შეიძლება ხელოსანი სჭირდებოდეს, მოცილება და მავნებლების კონტროლი კი სხვა მომსახურებაა. 112 გადაუდებელი შემთხვევისთვისაა და არა ჩვეულებრივი მოცილების მოთხოვნისთვის.",
        ],
      },
    ],
    summary:
      "მოარიდეთ ბავშვები და შინაური ცხოველები, მორიელს არ შეეხოთ და უსაფრთხო დისტანცია შეინარჩუნეთ. თუ დაიმალა ან მისი მოცილება უსაფრთხოდ არ შეგიძლიათ, დახმარება ითხოვეთ. შეამოწმეთ კარ-ფანჯრის ნაპრალები, ბადეები, მილების ირგვლივ ღიობები და სახლთან დაგროვილი ნივთები; მოაწესრიგეთ შესაძლო შესასვლელები და სამალავები. ჩხვლეტისას იხილეთ მორიელის ნაკბენის გიდი, გადაუდებელი მდგომარეობისას კი საქართველოში დარეკეთ 112-ზე.",
    title:
      "მორიელი სახლში — როგორ მოვიქცეთ და შევამციროთ მისი შემოსვლის შანსი?",
  },
  ru: {
    description:
      "Заметили скорпиона дома? Уведите детей и животных, не трогайте его, проверьте возможные щели и узнайте, как снизить вероятность новой встречи.",
    faq: [
      {
        answer:
          "Нет. По одной встрече нельзя определить, сколько скорпионов поблизости. Проверьте доступные пути проникновения и отмечайте новые встречи; при повторении обратитесь за помощью.",
        question:
          "Если я увидел одного скорпиона, значит ли это, что дома есть другие?",
      },
      {
        answer:
          "Да, скорпион может скрываться в вещах, оставленных снаружи. Проверяйте обувь и одежду перед использованием, а дрова — до внесения в дом, не ощупывая их вслепую.",
        question: "Может ли скорпион оказаться в обуви или дровах?",
      },
      {
        answer:
          "Нет. Устраните зазоры под дверью, повреждения сеток и доступные щели вокруг труб. Не закрывайте вентиляцию, дренаж и другие необходимые отверстия; при сомнении обратитесь к мастеру.",
        question: "Нужно ли закрыть все отверстия в доме?",
      },
      {
        answer:
          "Нет. Сначала проверьте пути проникновения и укрытия непосредственно у дома. Одни пестициды не дают надёжного результата против скорпионов; при применении средства соблюдайте этикетку и не подпускайте детей и животных к обработанным местам.",
        question: "Нужно ли опрыскать весь дом?",
      },
      {
        answer:
          "Если нельзя сохранить дистанцию или скорпион в недоступном месте, попросите помощи с удалением. Мастер поможет устранить щели, а при повторных встречах специалист по борьбе с вредителями может сначала выяснить причину. 112 в Грузии предназначен для экстренных случаев, а не обычного удаления.",
        question: "К кому обратиться, если я не могу безопасно его убрать?",
      },
    ],
    intro:
      "Не трогайте скорпиона. Уведите детей и домашних животных, держитесь на безопасном расстоянии и решите, нужна ли помощь, прежде чем пытаться его убрать.",
    metaTitle: "Скорпион дома: что делать и как снизить риск повторения",
    notice:
      "Скорпион ужалил? Первые действия и признаки, при которых нужна медицинская помощь, описаны в [руководстве об укусе скорпиона](/scorpions/morielis-nakbeni). При экстренной ситуации в Грузии звоните 112; не откладывайте помощь ради поимки или определения вида.",
    sections: [
      {
        heading: "Что делать, если вы увидели скорпиона дома?",
        list: {
          items: [
            "Уведите детей и домашних животных. Не трогайте скорпиона и не пытайтесь взять его в руки.",
            "Держитесь на безопасном расстоянии и следите за ним только с позиции, где вам ничто не угрожает.",
            "Если вы не можете действовать спокойно и безопасно, попросите помощи с удалением. Сначала определять вид не требуется.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Главное — избежать прямого контакта. Фотография необязательна и не должна быть важнее безопасности людей. Позже можно посмотреть [атлас скорпионов Грузии](/scorpions).",
        ],
      },
      {
        heading: "Можно ли убрать скорпиона, не прикасаясь к нему?",
        image: "jar",
        paragraphs: [
          "Вы не обязаны ловить его сами. Взрослый может рассмотреть способ с контейнером, только если скорпион полностью виден и находится в доступном месте, а для этого не нужно засовывать руку в щель или двигать тяжёлую мебель. При страхе, сомнениях или неудобных условиях лучше попросить помощи.",
          "Если условия соблюдены, накройте скорпиона стеклянной банкой, полностью подсуньте под неё плотный лист бумаги, крепко прижмите лист, переверните банку и плотно закройте крышкой. Не подносите руку к открытому краю банки. Риск всё равно остаётся. С дальнейшим обращением с пойманным животным попросите помощи, особенно если его происхождение неизвестно или оно могло сбежать из террариума; такое животное не выпускайте в природу.",
        ],
      },
      {
        heading: "Что делать, если скорпион спрятался?",
        paragraphs: [
          "Не подпускайте детей и животных к этому месту. Не ищите его рукой вслепую за мебелью или в щелях, не двигайте тяжёлую мебель, чтобы выгнать его, и не разбирайте электроприборы. Не распыляйте случайный химикат в укрытие.",
          "Если найти его без такого риска нельзя, попросите помощи. Открытое окно или выключенный свет не гарантируют, что скорпион уйдёт.",
        ],
      },
      {
        heading: "Откуда скорпион мог попасть в дом?",
        image: "gap",
        paragraphs: [
          "Проверьте зазор под дверью, неплотные оконные рамы, повреждённые сетки и отверстия вокруг труб. Это возможные пути проникновения, но не доказательство того, каким воспользовался именно этот скорпион. Нет оснований считать, что все скорпионы приходят из канализации.",
        ],
      },
      {
        heading: "Что проверить, чтобы снизить вероятность новой встречи?",
        list: {
          items: [
            "Почините неплотные уплотнители дверей и окон и повреждённые сетки. Закройте доступные щели у труб и рам, не нарушая вентиляцию, дренаж и работу здания; при сомнении обратитесь к мастеру.",
            "Осматривайте дрова перед внесением в дом и не храните их внутри. Уберите скопления досок, дров и других вещей непосредственно у стены дома; очищать всю природную среду не требуется.",
            "Устраните протечки и стоячую воду. Безопасно осматривайте коробки и другие принесённые вещи; перед использованием проверяйте обувь и одежду, если там мог скрыться скорпион.",
          ],
        },
        paragraphs: [
          "Сосредоточьтесь на возможных входах и укрытиях вблизи дома. Эти меры снижают вероятность новой встречи, но не дают гарантии.",
        ],
      },
      {
        heading: "Нужно ли химическое средство?",
        paragraphs: [
          "Сначала устраните пути проникновения и укрытия. Скорпионы прячутся в щелях, поэтому одни пестициды не являются надёжным решением. Не опрыскивайте всю комнату из раздражения и не применяйте средство для улицы внутри дома.",
          "Если вы рассматриваете средство, проверьте, допускает ли этикетка такое применение, и соблюдайте все меры безопасности. Не увеличивайте дозу; не подпускайте детей и животных к обработанным местам. Попросите специалиста проверить входы и укрытия до предложения обработки.",
        ],
      },
      {
        heading: "Когда лучше обратиться к специалисту?",
        paragraphs: [
          "Попросите помощи с удалением, если скорпион спрятался в недоступном месте или вы не можете действовать безопасно. Повторные встречи — повод проверить пути проникновения и укрытия со специалистом по борьбе с вредителями; определённое число встреч само по себе не доказывает «заражение».",
          "Для ремонта щели может понадобиться мастер, а удаление животного и борьба с вредителями — другие услуги. В Грузии 112 предназначен для экстренных случаев, а не обычной просьбы убрать скорпиона.",
        ],
      },
    ],
    summary:
      "Уведите детей и животных, не трогайте скорпиона и держитесь на безопасном расстоянии. Если он спрятался или вы не можете безопасно его убрать, попросите помощи. Проверьте двери, окна, сетки, отверстия вокруг труб и вещи у стены дома; устраните возможные входы и укрытия. Если кого-то ужалили, откройте руководство об укусе скорпиона, а при экстренной ситуации в Грузии звоните 112.",
    title:
      "Скорпион дома — что делать и как снизить вероятность его возвращения?",
  },
  tr: {
    description:
      "Evde akrep mi gördünüz? Çocukları ve hayvanları uzaklaştırın, dokunmayın; giriş boşluklarını kontrol edip yeniden karşılaşma olasılığını azaltın.",
    faq: [
      {
        answer:
          "Hayır. Tek bir karşılaşma yakında kaç akrep olduğunu göstermez. Ulaşılabilir giriş yerlerini kontrol edin ve yeni karşılaşmaları izleyin; tekrarlanırsa yardım isteyin.",
        question:
          "Bir akrep görmek evde başkaları da olduğu anlamına mı gelir?",
      },
      {
        answer:
          "Evet, dışarıda bırakılan eşyalarda saklanabilir. Ayakkabı ve giysileri kullanmadan önce, odunu da eve almadan önce kontrol edin; yığının içine körlemesine elinizi sokmayın.",
        question: "Akrep ayakkabıda veya odunda olabilir mi?",
      },
      {
        answer:
          "Hayır. Kapı altındaki açıklığı, hasarlı sineklikleri ve boru çevresindeki ulaşılabilir boşlukları onarın. Havalandırmayı, drenajı veya binanın gerekli açıklıklarını kapatmayın; emin değilseniz bir ustaya danışın.",
        question: "Evdeki bütün açıklıkları kapatmalı mıyım?",
      },
      {
        answer:
          "Hayır. Önce girişleri ve evin hemen yanındaki saklanma yerlerini ele alın. Yalnızca pestisit kullanmak akreplere karşı güvenilir sonuç sağlamaz; bir ürün kullanırsanız etiketine uyun ve çocuklarla hayvanları uygulanan yerlerden uzak tutun.",
        question: "Bütün evi ilaçlamak gerekir mi?",
      },
      {
        answer:
          "Güvenli mesafeyi koruyamıyorsanız veya akrep erişilemeyen bir yerdeyse uzaklaştırma için yardım isteyin. Bir usta açıklıkları onarabilir; tekrar eden karşılaşmalarda haşere kontrol uzmanından önce nedeni incelemesini isteyin. Gürcistan'da 112 rutin uzaklaştırma için değil, aciller içindir.",
        question: "Güvenle uzaklaştıramazsam kimden yardım isteyebilirim?",
      },
    ],
    intro:
      "Akrebe dokunmayın. Çocukları ve evcil hayvanları uzaklaştırın, güvenli mesafede kalın ve onu uzaklaştırmayı denemeden önce yardıma ihtiyacınız olup olmadığını değerlendirin.",
    metaTitle: "Evde akrep: ne yapmalı ve yeniden giriş nasıl azaltılır?",
    notice:
      "Akrep soktu mu? İlk adımlar ve tıbbi yardım gerektiren belirtiler için [akrep sokması rehberine](/scorpions/morielis-nakbeni) bakın. Gürcistan'da acil durumda 112'yi arayın; hayvanı yakalamak veya türünü belirlemek için yardımı geciktirmeyin.",
    sections: [
      {
        heading: "Evde akrep gördüğünüzde ne yapmalısınız?",
        list: {
          items: [
            "Çocukları ve evcil hayvanları uzaklaştırın. Akrebe dokunmayın ve elinize almayı denemeyin.",
            "Güvenli mesafede kalın; bulunduğu yeri yalnızca kendinizi tehlikeye atmayan bir noktadan izleyin.",
            "Sakin ve güvenli biçimde hareket edemiyorsanız uzaklaştırma için yardım isteyin. Önce türünü belirlemeniz gerekmez.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Öncelik doğrudan temastan kaçınmaktır. Fotoğraf gerekli değildir ve insanların güvenliğinden önce gelmemelidir. Daha sonra Gürcistan'da kayıtlı türler için [akrep atlasına](/scorpions) bakabilirsiniz.",
        ],
      },
      {
        heading: "Dokunmadan uzaklaştırmak mümkün mü?",
        image: "jar",
        paragraphs: [
          "Akrebi kendiniz yakalamak zorunda değilsiniz. Kap yöntemi yalnızca akrep bütünüyle görünür ve kolay erişilir durumdaysa, ayrıca elinizi aralığa sokmanız veya ağır mobilya taşımanız gerekmiyorsa bir yetişkin tarafından düşünülebilir. Korku, belirsizlik veya elverişsiz koşullarda yardım istemek daha iyidir.",
          "Bu koşullar sağlanıyorsa akrebin üzerine cam kavanoz kapatın, ağzının altına sert bir kâğıdı tamamen kaydırın, kâğıdı sıkıca tutarak kavanozu düz çevirin ve kapağını güvenle kapatın. Elinizi açık ağızdan uzak tutun. Risk tamamen ortadan kalkmaz. Kavanozdaki hayvanla sonra ne yapılacağı için, özellikle kökeni bilinmiyorsa veya teraryumdan kaçmış olabilirse yardım isteyin; kökeni belirsiz hayvanı doğaya bırakmayın.",
        ],
      },
      {
        heading: "Akrep saklanırsa ne yapmalısınız?",
        paragraphs: [
          "Çocukları ve hayvanları o bölgeden uzak tutun. Mobilya arkasına veya aralığa körlemesine el uzatmayın, çıkarmak için ağır mobilya taşımayın ve elektrikli cihazları sökmeyin. Saklandığı yere rastgele kimyasal püskürtmeyin.",
          "Bu risklere girmeden bulamıyorsanız yardım isteyin. Açık pencere veya karanlık oda akrebin gideceğini garanti etmez.",
        ],
      },
      {
        heading: "Akrep eve nereden girmiş olabilir?",
        image: "gap",
        paragraphs: [
          "Kapı altı boşluklarını, gevşek pencere çerçevelerini, hasarlı sineklikleri ve boru çevresindeki açıklıkları kontrol edin. Bunlar olası girişlerdir; gördüğünüz akrebin tam olarak nereden girdiğini kanıtlamaz. Her akrebin giderden geldiğini varsaymayın.",
        ],
      },
      {
        heading:
          "Yeniden karşılaşma olasılığını azaltmak için neyi kontrol etmeli?",
        list: {
          items: [
            "Gevşek kapı ve pencere fitilleriyle hasarlı sineklikleri onarın. Boru ve çerçeve çevresindeki ulaşılabilir boşlukları havalandırmayı, drenajı ve binanın gerekli işlevlerini bozmadan kapatın; emin değilseniz ustaya danışın.",
            "Odunu eve almadan önce kontrol edin ve içeride depolamayın. Evin hemen yanındaki tahta, odun ve eşya yığınlarını azaltın; bütün doğal çevreyi temizlemek gerekmez.",
            "Sızıntıları ve birikmiş suyu giderin. Eve getirilen kutu ve eşyaları güvenle gözden geçirin; akrebin saklanabileceği ayakkabı ve giysileri kullanmadan önce kontrol edin.",
          ],
        },
        paragraphs: [
          "Evin yakınındaki olası giriş ve saklanma yerlerine odaklanın. Bu adımlar yeniden karşılaşma olasılığını azaltır ama garanti vermez.",
        ],
      },
      {
        heading: "Kimyasal ürün gerekli mi?",
        paragraphs: [
          "Önce girişleri ve saklanma yerlerini düzenleyin. Akrepler aralıklarda saklanabildiğinden yalnızca pestisite dayanmak güvenilir çözüm değildir. Bütün odayı gelişigüzel püskürtmeyin ve dış mekân ürünü evin içinde kullanmayın.",
          "Ürün düşünüyorsanız etiketinin amaçlanan kullanıma izin verdiğini kontrol edin ve tüm güvenlik talimatlarına uyun. Dozu artırmayın; çocukları ve evcil hayvanları işlem yapılan yerlerden uzak tutun. Bir uzmandan ilaçlama önermeden önce girişleri ve saklanma yerlerini incelemesini isteyin.",
        ],
      },
      {
        heading: "Ne zaman uzmandan yardım istemeli?",
        paragraphs: [
          "Akrep erişilemeyen bir yere saklandıysa veya güvenle hareket edemiyorsanız uzaklaştırma için yardım isteyin. Tekrarlayan karşılaşmalar, girişleri ve saklanma yerlerini bir haşere kontrol uzmanıyla incelemek için nedendir; belirli bir sayı tek başına istilayı kanıtlamaz.",
          "Bina boşluğunu onarmak için bir usta gerekebilir; hayvanı uzaklaştırmak ve haşere kontrolü farklı hizmetlerdir. Gürcistan'da 112 aciller içindir, sıradan uzaklaştırma talepleri için değil.",
        ],
      },
    ],
    summary:
      "Çocukları ve evcil hayvanları uzaklaştırın, akrebe dokunmayın ve güvenli mesafeyi koruyun. Saklanırsa veya güvenle uzaklaştıramıyorsanız yardım isteyin. Kapı ve pencere boşluklarını, sineklikleri, boru çevresini ve evin yanındaki eşyaları kontrol edin; olası girişleri ve saklanma yerlerini azaltın. Biri sokulduysa akrep sokması rehberine bakın; Gürcistan'da acil durumda 112'yi arayın.",
    title:
      "Evde akrep — ne yapmalı ve yeniden girme olasılığı nasıl azaltılır?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "UC IPM — Scorpions (updated December 2011)",
    supports: {
      en: "Possible entry points, shelter near buildings, inspecting shoes and firewood, the jar-and-paper method, and limits of pesticide-only control; not evidence about Georgian species or medical care.",
      ka: "შესაძლო შემოსასვლელები, სახლთან სამალავები, ფეხსაცმლისა და შეშის შემოწმება, ქილისა და ქაღალდის მეთოდი და მხოლოდ პესტიციდზე დაყრდნობის შეზღუდვა; არა ქართული სახეობების ან სამედიცინო დახმარების წყარო.",
      ru: "Возможные пути проникновения, укрытия у дома, проверка обуви и дров, метод банки и бумаги и ограничения борьбы только пестицидами; не источник по видам Грузии или медпомощи.",
      tr: "Olası girişler, ev yakınındaki saklanma yerleri, ayakkabı ve odun kontrolü, kavanoz-kâğıt yöntemi ve yalnız pestisitin sınırları; Gürcistan türleri veya tıbbi bakım için kaynak değildir.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/scorpions/",
  },
  {
    name: "US EPA — Do's and Don'ts of Pest Control",
    supports: {
      en: "Prevention first, repairing leaks and entry gaps, checking incoming items, following product labels, avoiding whole-room spraying and outdoor products indoors, and keeping children and pets away from treatments.",
      ka: "პრევენციის უპირატესობა, გაჟონვისა და ღრიჭოების შეკეთება, შემოტანილი ნივთების შემოწმება, ეტიკეტის დაცვა, მთელ ოთახში შესხურებისა და გარე პროდუქტის სახლში გამოყენების თავიდან აცილება, ბავშვებისა და ცხოველების დაცვა.",
      ru: "Приоритет профилактики, устранение протечек и щелей, проверка внесённых вещей, соблюдение этикетки, отказ от опрыскивания всей комнаты и уличных средств внутри, защита детей и животных.",
      tr: "Önce önleme, sızıntı ve giriş boşluklarını giderme, eve getirilen eşyaları kontrol etme, etikete uyma, bütün odayı püskürtmeme, dış mekân ürününü içeride kullanmama ve çocuklarla hayvanları koruma.",
    },
    url: "https://www.epa.gov/safepestcontrol/dos-and-donts-pest-control",
  },
  {
    name: "Georgia 112 — When to call 112",
    supports: {
      en: "112 is Georgia's number for emergencies and should not be used for routine animal removal.",
      ka: "112 საქართველოში გადაუდებელი შემთხვევების ნომერია და არა ცხოველის ჩვეულებრივი მოცილების სერვისი.",
      ru: "112 — номер экстренной помощи в Грузии, не служба обычного удаления животных.",
      tr: "112 Gürcistan'da acil durum numarasıdır; rutin hayvan uzaklaştırma hizmeti değildir.",
    },
    url: "https://112.gov.ge/?page_id=274",
  },
];

export const SCORPION_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "A small scorpion on a stone floor, away from a shoe by a closed door",
      ka: "ქვის იატაკზე პატარა მორიელი, დახურულ კართან დადებული ფეხსაცმლისგან მოშორებით",
      ru: "Небольшой скорпион на каменном полу, в стороне от обуви у закрытой двери",
      tr: "Kapalı bir kapının yanındaki ayakkabıdan uzakta, taş zeminde küçük bir akrep",
    },
    height: 576,
    src: "https://cdn.reptiles.ge/images/guides/scorpion-in-house-hero.jpg",
    width: 1024,
  },
  id: "scorpion-in-house",
  images: {
    gap: {
      alt: {
        en: "A gap under a closed door, with a worn seal and daylight outside",
        ka: "დახურული კარის ქვეშ ნაპრალი, გაცვეთილი ზოლი და გარეთ დღის სინათლე",
        ru: "Щель под закрытой дверью: изношенный уплотнитель и дневной свет снаружи",
        tr: "Kapalı bir kapının altında boşluk, yıpranmış fitil ve dışarıda gün ışığı",
      },
      height: 576,
      src: "https://cdn.reptiles.ge/images/guides/scorpion-in-house-gap.jpg",
      width: 1024,
    },
    jar: {
      alt: {
        en: "A glass jar over a small scorpion on a sheet of paper on a tiled floor",
        ka: "მინის ქილა პატარა მორიელზე, ფილის იატაკზე დადებულ ქაღალდზე",
        ru: "Стеклянная банка над небольшим скорпионом на листе бумаги на кафельном полу",
        tr: "Fayans zemindeki kâğıdın üzerinde, küçük bir akrebin üzerine kapatılmış cam kavanoz",
      },
      height: 576,
      src: "https://cdn.reptiles.ge/images/guides/scorpion-in-house-jar.jpg",
      width: 1024,
    },
  },
  messageKey: "scorpionInHouse",
  ogImage: "https://cdn.reptiles.ge/og/images/guides/scorpion-in-house.jpg",
  parentHub: "scorpions",
  pathname: "/scorpions/morieli-sakhlshi",
  relatedGuideIds: ["scorpion-sting"],
  relatedSpeciesIds: [
    "mesobuthus-eupeus",
    "olivierus-caucasicus",
    "euscorpius-italicus",
    "euscorpius-mingrelicus",
  ],
  search: {
    icon: "safety",
    keywords: [
      "მორიელი სახლში",
      "სახლში მორიელი ვნახე",
      "როგორ მოვიშოროთ მორიელი",
      "საიდან შემოდის მორიელი",
      "morieli sakhlshi",
      "scorpion in house",
      "скорпион дома",
      "evde akrep",
    ],
    rank: 5,
    subtitle: {
      en: "Safe steps, entry gaps and prevention",
      ka: "უსაფრთხო მოქმედებები, ღრიჭოების შემოწმება და პრევენცია",
      ru: "Безопасные действия, проверка щелей и профилактика",
      tr: "Güvenli adımlar, giriş boşlukları ve önleme",
    },
    title: {
      en: "Scorpion in the house",
      ka: "მორიელი სახლში",
      ru: "Скорпион дома",
      tr: "Evde akrep",
    },
  },
  sources: SOURCES,
});
