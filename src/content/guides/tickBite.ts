import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "after" | "grass" | "removal";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "How to remove an attached tick correctly, what to avoid, what to watch after a bite, and when to contact a doctor.",
    faq: [
      {
        answer:
          "Use clean fine-tipped tweezers, grasp the tick close to the skin, and pull with steady, even pressure. Clean the bite area and your hands afterwards.",
        question: "How do I remove a tick correctly?",
      },
      {
        answer:
          "No. Do not use oil, petroleum jelly, nail polish, heat, or other substances to make the tick detach. Remove it mechanically and promptly.",
        question: "Can I put oil on the tick?",
      },
      {
        answer:
          "If you cannot easily remove small mouthparts with tweezers, leave them alone and let the skin heal. Do not dig deeply or cut the skin.",
        question: "What if part of the tick stays in the skin?",
      },
      {
        answer:
          "No. Many bites do not cause illness, but you should watch for fever, rash, an expanding rash, or other worsening symptoms and contact a doctor if they appear.",
        question: "Is every tick bite dangerous?",
      },
      {
        answer:
          "No. Lyme borreliosis is transmitted through infected ticks, and not every tick is infected. A doctor should assess symptoms; do not diagnose Lyme disease from a photo.",
        question: "Does a tick bite mean Lyme disease?",
      },
      {
        answer:
          "A routine attached tick is not automatically an emergency. Call 112 in Georgia if the situation involves serious acute symptoms or another real emergency requiring ambulance care.",
        question: "Should I call 112 after a tick bite?",
      },
    ],
    metaTitle: "Tick bite — how to remove a tick correctly",
    sections: [
      {
        heading: "What should you do right now?",
        paragraphs: [
          "If a tick is attached to your skin, remove it as soon as you can. Use clean fine-tipped tweezers if available, grip it close to the skin, pull with steady pressure, then clean the bite area and your hands.",
          "Do not wait for a clinic visit just to remove the tick. After removal, check the rest of your body and watch your health over the next days and weeks.",
        ],
      },
      {
        heading: "How do you remove a tick correctly?",
        image: "removal",
        list: {
          items: [
            "Use clean fine-tipped tweezers if you have them.",
            "Grasp the tick as close to the skin's surface as possible, avoiding the swollen body.",
            "Pull away from the skin with steady, even pressure. Do not twist or jerk.",
            "Put the tick in alcohol, wrap it tightly in tape, place it in a sealed container, or flush it. Do not crush it with bare fingers.",
            "Clean the bite area and your hands with soap and water, rubbing alcohol, or hand sanitizer.",
          ],
          ordered: true,
        },
        paragraphs: [
          "The goal is simple: remove the tick promptly without squeezing its body and without tearing at the skin.",
        ],
      },
      {
        heading: "What should you avoid during removal?",
        list: {
          items: [
            "Do not cover the tick with petroleum jelly, oil, nail polish, or other substances.",
            "Do not use heat, a flame, or burning.",
            "Do not twist, jerk, or crush the tick's body with your fingers.",
            "Do not cut the skin or dig aggressively for small parts.",
            "Do not start antibiotics or other medicine on your own because of a tick bite.",
          ],
        },
        paragraphs: [
          "Folk methods can delay removal or irritate the tick. The supported first step is prompt mechanical removal.",
        ],
      },
      {
        heading: "What should you do after removing it?",
        image: "after",
        list: {
          items: [
            "Clean the bite area and your hands.",
            "Check the rest of your body for more ticks, especially after time in grass, brush, or wooded places.",
            "Note roughly when and where the bite may have happened in case you later need medical advice.",
            "Watch for rash, fever, or symptoms that worsen over the next several days to weeks.",
          ],
        },
        paragraphs: [
          "A photo of the removed tick may help discussion later, but commercial tick testing should not be used to decide treatment. If you feel ill, do not wait for a tick test result.",
        ],
      },
      {
        heading: "What if a small part remains in the skin?",
        paragraphs: [
          "Sometimes mouthparts break off. If they can be removed easily with tweezers, you may remove them. If not, leave them alone and let the skin heal.",
          "Do not cut, burn, or dig deeply into the skin. Contact a doctor if the area becomes increasingly painful, swollen, infected-looking, or otherwise concerning.",
        ],
      },
      {
        heading: "When should you contact a doctor?",
        paragraphs: [
          "Contact a doctor if you develop a rash, an expanding rash, fever, headache, fatigue, or other symptoms after a tick bite. Tell the doctor about the bite, when it happened, and where exposure likely occurred.",
          "A routine tick bite is not automatically a 112 emergency. In Georgia, call 112 for a genuine emergency, such as severe acute symptoms, loss of consciousness, major bleeding, or a situation that needs immediate ambulance care.",
        ],
      },
      {
        heading: "Tick bites and Lyme disease",
        paragraphs: [
          "Lyme borreliosis is a bacterial illness transmitted through the bite of an infected tick. Not every tick is infected, and not every tick bite causes Lyme disease.",
          "Early removal matters because prompt removal of attached ticks reduces risk. Watch for fever, fatigue, headache, or an expanding rash and seek medical advice if symptoms appear. Do not diagnose Lyme disease from a bite photo alone.",
        ],
      },
      {
        heading: "Other tick-borne infections in Georgia",
        paragraphs: [
          "Georgia's NCDC materials describe Crimean-Congo haemorrhagic fever as a tick-associated disease in Georgia and advise prompt tick removal with tweezers, avoiding crushing the tick, and seeking medical care when illness is suspected.",
          "This does not mean every tick carries disease. It means symptoms after tick exposure deserve timely medical assessment, especially fever, bleeding signs, severe weakness, or rapidly worsening illness.",
        ],
      },
      {
        heading: "How can you reduce tick bites?",
        image: "grass",
        list: {
          items: [
            "Wear long sleeves and long trousers in grassy, brushy, or wooded areas.",
            "Use repellents according to the product label.",
            "Check your body after outdoor activity; ticks often attach in soft or hairy areas.",
            "Remove attached ticks promptly.",
          ],
        },
        paragraphs: [
          "Hiking, camping, field work, and moving through tall grass are common situations where a tick check is useful. The point is awareness, not avoiding nature altogether.",
        ],
      },
    ],
    summary:
      "Remove an attached tick promptly with clean fine-tipped tweezers: grip close to the skin and pull with steady, even pressure. Do not use oil, petroleum jelly, nail polish, heat, cutting, or crushing. Clean the area and your hands, check for more ticks, and contact a doctor if fever, rash, an expanding rash, or worsening symptoms appear. Call 112 in Georgia only for a real emergency.",
    title:
      "Found a tick on your skin? How to remove it and when to see a doctor",
  },
  ka: {
    description:
      "ტკიპას ნაკბენი: ტკიპას ამოღება და ტკიპას მოშორება პინცეტით. რა არ უნდა გააკეთოთ და როდის მივმართოთ ექიმს. ტკიპას ნაკბენი ფოტო დიაგნოზს არ ცვლის.",
    faq: [
      {
        answer:
          "გამოიყენეთ სუფთა, წვრილწვერიანი პინცეტი, ტკიპა კანთან ახლოს ჩაავლეთ და თანაბარი, მშვიდი მოძრაობით ამოიყვანეთ. შემდეგ დაიბანეთ ნაკბენის ადგილი და ხელები.",
        question: "როგორ ხდება ტკიპას ამოღება?",
      },
      {
        answer:
          "არა. ტკიპაზე ზეთი, ვაზელინი, ლაქი, ცხელი საგანი ან სხვა ნივთიერება არ გამოიყენოთ. ტკიპა სწრაფად და მექანიკურად მოაცილეთ.",
        question: "შეიძლება ტკიპაზე ზეთის დასხმა?",
      },
      {
        answer:
          "თუ პატარა პირის ნაწილს პინცეტით იოლად ვერ იღებთ, დატოვეთ და კანს შეხორცების საშუალება მიეცით. კანი ღრმად არ დაჩიჩქნოთ და არ გაჭრათ.",
        question: "თუ ტკიპის ნაწილი კანში დარჩა, რა ვქნა?",
      },
      {
        answer:
          "არა. ბევრი ნაკბენი ავადობას არ იწვევს, მაგრამ სიცხეს, გამონაყარს, გაფართოებულ წითელ ლაქას ან სხვა გაუარესებულ სიმპტომს დააკვირდით და ასეთ დროს ექიმს მიმართეთ.",
        question: "ყველა ტკიპის ნაკბენი საშიშია?",
      },
      {
        answer:
          "არა. ლაიმის ბორელიოზი ინფიცირებული ტკიპით გადადის და ყველა ტკიპა ინფიცირებული არ არის. სიმპტომები ექიმმა უნდა შეაფასოს; ფოტოთი ლაიმის დიაგნოზი არ დაისმება.",
        question: "ტკიპას ნაკბენი ფოტო ნიშნავს ლაიმის დაავადებას?",
      },
      {
        answer:
          "ჩვეულებრივი მიმაგრებული ტკიპა თავისთავად გადაუდებელი შემთხვევა არ არის. საქართველოში 112-ზე დარეკეთ მძიმე მწვავე სიმპტომების ან სხვა რეალური გადაუდებელი მდგომარეობისას.",
        question: "ტკიპის ნაკბენის შემდეგ 112-ზე უნდა დავრეკო?",
      },
    ],
    metaTitle: "ტკიპას ნაკბენი — ამოღება და მოშორება",
    sections: [
      {
        heading: "ახლავე რა გავაკეთოთ?",
        paragraphs: [
          "თუ ტკიპა კანზეა მიმაგრებული, რაც შეიძლება მალე მოიცილეთ. თუ გაქვთ, გამოიყენეთ სუფთა, წვრილწვერიანი პინცეტი, ჩაავლეთ კანთან ახლოს, თანაბარი მოძრაობით ამოიყვანეთ და შემდეგ ნაკბენის ადგილი და ხელები გაიწმინდეთ.",
          "ტკიპის მოსაცილებლად კლინიკაში მისვლას ნუ დაელოდებით. მოცილების შემდეგ სხეულის დანარჩენი ადგილებიც შეამოწმეთ და მომდევნო დღეებსა და კვირებში ჯანმრთელობას დააკვირდით.",
        ],
      },
      {
        heading: "ტკიპას ამოღება და ტკიპას მოშორება",
        image: "removal",
        list: {
          items: [
            "თუ გაქვთ, გამოიყენეთ სუფთა, წვრილწვერიანი პინცეტი.",
            "ტკიპა ჩაავლეთ რაც შეიძლება კანთან ახლოს და ეცადეთ გაბერილ სხეულს არ მოუჭიროთ.",
            "ამოიყვანეთ თანაბარი, მშვიდი მოძრაობით. არ დაატრიალოთ და არ მოქაჩოთ მკვეთრად.",
            "ტკიპა ჩადეთ სპირტში, მჭიდროდ გადაახვიეთ ლენტში, მოათავსეთ დახურულ ჭურჭელში ან ჩარეცხეთ. თითებით არ გასრისოთ.",
            "ნაკბენის ადგილი და ხელები დაიბანეთ საპნითა და წყლით, ან გამოიყენეთ სპირტი/ხელის სადეზინფექციო საშუალება.",
          ],
          ordered: true,
        },
        paragraphs: [
          "მიზანი მარტივია: ტკიპა სწრაფად მოიცილოთ ისე, რომ მისი სხეული არ გაჭყლიტოთ და კანი ზედმეტად არ დააზიანოთ.",
        ],
      },
      {
        heading: "რა არ უნდა გააკეთოთ ტკიპის მოცილებისას",
        list: {
          items: [
            "ტკიპას ვაზელინი, ზეთი, ლაქი ან სხვა ნივთიერება არ წაუსვათ.",
            "არ გამოიყენოთ სიცხე, ცეცხლი ან მოწვა.",
            "ტკიპა არ დაატრიალოთ, მკვეთრად არ მოქაჩოთ და თითებით სხეული არ გაუჭყლიტოთ.",
            "კანი არ გაჭრათ და პატარა ნაწილის ამოსაღებად აგრესიულად არ დაჩიჩქნოთ.",
            "ტკიპის ნაკბენის გამო ანტიბიოტიკი ან სხვა წამალი თვითნებურად არ დაიწყოთ.",
          ],
        },
        paragraphs: [
          "ხალხურმა მეთოდებმა შეიძლება მოცილება დააყოვნოს ან ტკიპა გააღიზიანოს. სანდო პირველი ნაბიჯი სწრაფი მექანიკური მოცილებაა.",
        ],
      },
      {
        heading: "ტკიპის მოცილების შემდეგ რა გავაკეთოთ?",
        image: "after",
        list: {
          items: [
            "ნაკბენის ადგილი და ხელები გაიწმინდეთ.",
            "განსაკუთრებით ბალახში, ბუჩქნარში ან ტყეში ყოფნის შემდეგ სხეული სხვა ტკიპებისთვისაც შეამოწმეთ.",
            "დაიმახსოვრეთ დაახლოებით როდის და სად შეიძლებოდა მიმაგრება, თუ მოგვიანებით ექიმთან საუბარი დაგჭირდებათ.",
            "მომდევნო დღეებსა და კვირებში დააკვირდით გამონაყარს, სიცხეს ან გაუარესებულ სიმპტომებს.",
          ],
        },
        paragraphs: [
          "მოცილებული ტკიპის ფოტო შეიძლება მოგვიანებით საუბარში გამოგადგეთ, მაგრამ ტკიპის კომერციული ტესტი მკურნალობის გადაწყვეტილებისთვის არ გამოიყენოთ. თუ ავად გახდით, ტესტის პასუხს ნუ დაელოდებით.",
        ],
      },
      {
        heading: "თუ პატარა ნაწილი კანში დარჩა?",
        paragraphs: [
          "ზოგჯერ პირის ნაწილი წყდება. თუ პინცეტით იოლად ამოდის, შეგიძლიათ მოიცილოთ. თუ მარტივად ვერ იღებთ, დატოვეთ და კანს შეხორცების საშუალება მიეცით.",
          "კანი არ გაჭრათ, არ მოწვათ და ღრმად არ დაჩიჩქნოთ. ექიმს მიმართეთ, თუ ადგილი უფრო მტკივნეული, შეშუპებული, ინფექციის მსგავსად შეცვლილი ან სხვაგვარად შემაშფოთებელი ხდება.",
        ],
      },
      {
        heading: "როდის უნდა მივმართოთ ექიმს?",
        paragraphs: [
          "ექიმს მიმართეთ, თუ ტკიპის შემდეგ გაჩნდა გამონაყარი, გაფართოებული წითელი ლაქა, სიცხე, თავის ტკივილი, დაღლა ან სხვა სიმპტომები. ექიმს უთხარით ნაკბენის შესახებ, როდის მოხდა და სავარაუდოდ სად მოხდა კონტაქტი.",
          "ჩვეულებრივი ტკიპის ნაკბენი ავტომატურად 112-ის შემთხვევა არ არის. საქართველოში 112-ზე დარეკეთ რეალური გადაუდებელი მდგომარეობისას: მძიმე მწვავე სიმპტომების, გონების დაკარგვის, ძლიერი სისხლდენის ან ისეთი ვითარების დროს, როცა სასწრაფო დახმარება დაუყოვნებლივ საჭიროა.",
        ],
      },
      {
        heading: "ტკიპის ნაკბენი და ლაიმის დაავადება",
        paragraphs: [
          "ლაიმის ბორელიოზი ბაქტერიული დაავადებაა, რომელიც ინფიცირებული ტკიპის ნაკბენით გადადის. ყველა ტკიპა ინფიცირებული არ არის და ყველა ნაკბენი ლაიმის დაავადებას არ იწვევს.",
          "ადრეული მოცილება მნიშვნელოვანია, რადგან მიმაგრებული ტკიპის სწრაფად მოცილება რისკს ამცირებს. დააკვირდით სიცხეს, დაღლას, თავის ტკივილს ან გაფართოებულ გამონაყარს და სიმპტომების შემთხვევაში ექიმს მიმართეთ. მხოლოდ ნაკბენის ფოტოთი ლაიმის დიაგნოზი არ დაისმება.",
        ],
      },
      {
        heading: "სხვა ტკიპებით გადამდები ინფექციები საქართველოში",
        paragraphs: [
          "საქართველოს NCDC-ის მასალებში ყირიმ-კონგოს ჰემორაგიული ცხელება ტკიპებთან დაკავშირებულ დაავადებად არის აღწერილი. იქვე რეკომენდებულია ტკიპის დაუყოვნებლივ მოცილება პინცეტით, გაჭყლეტის თავიდან არიდება და ავადობის ეჭვისას სამედიცინო დაწესებულებასთან დროული დაკავშირება.",
          "ეს არ ნიშნავს, რომ ყველა ტკიპა დაავადებას ატარებს. ეს ნიშნავს, რომ ტკიპასთან კონტაქტის შემდეგ განვითარებული სიმპტომები დროულ სამედიცინო შეფასებას იმსახურებს, განსაკუთრებით სიცხე, სისხლდენის ნიშნები, ძლიერი სისუსტე ან სწრაფად გაუარესებული მდგომარეობა.",
        ],
      },
      {
        heading: "როგორ ავიცილოთ ტკიპის ნაკბენი",
        image: "grass",
        list: {
          items: [
            "ბალახიან, ბუჩქნარიან ან ტყიან ადგილებში ჩაიცვით გრძელსახელოიანი ზედა და გრძელი შარვალი.",
            "რეპელენტი გამოიყენეთ ეტიკეტის მიხედვით.",
            "გარეთ ყოფნის შემდეგ სხეული შეამოწმეთ; ტკიპა ხშირად რბილ ან თმიან ადგილებს ეჭიდება.",
            "მიმაგრებული ტკიპა დროულად მოიცილეთ.",
          ],
        },
        paragraphs: [
          "ლაშქრობა, კემპინგი, საველე სამუშაო და მაღალ ბალახში მოძრაობა ის სიტუაციებია, როცა ტკიპის შემოწმება სასარგებლოა. მიზანი ბუნებისგან თავის არიდება კი არა, ყურადღებაა.",
        ],
      },
    ],
    summary:
      "კანზე მიმაგრებული ტკიპა სწრაფად მოიცილეთ სუფთა, წვრილწვერიანი პინცეტით: ჩაავლეთ კანთან ახლოს და თანაბარი მოძრაობით ამოიყვანეთ. არ გამოიყენოთ ზეთი, ვაზელინი, ლაქი, სიცხე, გაჭრა ან გაჭყლეტა. გაიწმინდეთ ადგილი და ხელები, შეამოწმეთ სხეულზე სხვა ტკიპებიც და სიცხის, გამონაყარის, გაფართოებული ლაქის ან გაუარესებული სიმპტომებისას ექიმს მიმართეთ. საქართველოში 112 მხოლოდ რეალური გადაუდებელი მდგომარეობისას გამოიყენეთ.",
    title: "ტკიპის ნაკბენი — როგორ მოვიშოროთ სწორად და როდის მივმართოთ ექიმს",
  },
  ru: {
    description:
      "Как правильно удалить присосавшегося клеща, чего не делать, за чем наблюдать после укуса и когда обращаться к врачу.",
    faq: [
      {
        answer:
          "Используйте чистый пинцет с тонкими концами, захватите клеща как можно ближе к коже и тяните ровно и спокойно. После этого очистите место укуса и руки.",
        question: "Как правильно удалить клеща?",
      },
      {
        answer:
          "Нет. Не используйте масло, вазелин, лак, тепло или другие вещества, чтобы клещ отпал. Удалите его механически и как можно скорее.",
        question: "Можно ли капнуть масло на клеща?",
      },
      {
        answer:
          "Если мелкие ротовые части не удаётся легко убрать пинцетом, оставьте их и дайте коже зажить. Не ковыряйте глубоко и не разрезайте кожу.",
        question: "Что делать, если часть клеща осталась в коже?",
      },
      {
        answer:
          "Нет. Многие укусы не приводят к болезни, но при температуре, сыпи, расширяющемся пятне или ухудшении самочувствия нужно обратиться к врачу.",
        question: "Опасен ли каждый укус клеща?",
      },
      {
        answer:
          "Нет. Лайм-боррелиоз передаётся через инфицированных клещей, а инфицирован не каждый клещ. Симптомы должен оценивать врач; по фото укус не диагностируют.",
        question: "Укус клеща означает болезнь Лайма?",
      },
      {
        answer:
          "Обычный присосавшийся клещ сам по себе не является экстренной ситуацией. В Грузии звоните 112 при тяжёлых острых симптомах или другой настоящей необходимости скорой помощи.",
        question: "Нужно ли звонить 112 после укуса клеща?",
      },
    ],
    metaTitle: "Укус клеща — как правильно удалить клеща",
    sections: [
      {
        heading: "Что сделать прямо сейчас?",
        paragraphs: [
          "Если клещ присосался к коже, удалите его как можно скорее. По возможности используйте чистый пинцет с тонкими концами, захватите клеща у самой кожи, тяните ровно и затем очистите место укуса и руки.",
          "Не ждите визита в клинику только ради удаления клеща. После удаления проверьте остальное тело и наблюдайте за самочувствием в следующие дни и недели.",
        ],
      },
      {
        heading: "Как правильно удалить клеща?",
        image: "removal",
        list: {
          items: [
            "Используйте чистый пинцет с тонкими концами, если он есть.",
            "Захватите клеща как можно ближе к поверхности кожи, не сдавливая тело.",
            "Тяните от кожи ровным, постоянным движением. Не выкручивайте и не дёргайте.",
            "Поместите клеща в спирт, плотно заверните в ленту, положите в закрытую ёмкость или смойте. Не давите его голыми пальцами.",
            "Очистите место укуса и руки водой с мылом, спиртом или антисептиком для рук.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Цель проста: быстро удалить клеща, не сдавливая его тело и не травмируя кожу.",
        ],
      },
      {
        heading: "Чего не делать при удалении клеща",
        list: {
          items: [
            "Не покрывайте клеща вазелином, маслом, лаком или другими веществами.",
            "Не используйте тепло, огонь или прижигание.",
            "Не выкручивайте, не дёргайте и не раздавливайте тело клеща пальцами.",
            "Не разрезайте кожу и не ковыряйте агрессивно ради мелких частей.",
            "Не начинайте антибиотики или другие лекарства самостоятельно из-за укуса клеща.",
          ],
        },
        paragraphs: [
          "Народные методы могут задержать удаление или раздражать клеща. Поддержанный первый шаг — быстрое механическое удаление.",
        ],
      },
      {
        heading: "Что делать после удаления?",
        image: "after",
        list: {
          items: [
            "Очистите место укуса и руки.",
            "Проверьте всё тело на других клещей, особенно после травы, кустарника или леса.",
            "Запомните примерно когда и где мог произойти контакт, если позже понадобится консультация врача.",
            "В следующие дни и недели следите за сыпью, температурой или ухудшением симптомов.",
          ],
        },
        paragraphs: [
          "Фото снятого клеща может помочь разговору позже, но коммерческий тест клеща не должен определять лечение. Если вы заболели, не ждите результата теста клеща.",
        ],
      },
      {
        heading: "Что если маленькая часть осталась в коже?",
        paragraphs: [
          "Иногда ротовые части отрываются. Если их легко убрать пинцетом, можно это сделать. Если нет, оставьте их и дайте коже зажить.",
          "Не разрезайте, не прижигайте и не ковыряйте глубоко. Обратитесь к врачу, если место становится более болезненным, опухшим, похожим на инфекцию или вызывает беспокойство.",
        ],
      },
      {
        heading: "Когда обращаться к врачу?",
        paragraphs: [
          "Обратитесь к врачу, если после укуса клеща появились сыпь, расширяющееся пятно, температура, головная боль, усталость или другие симптомы. Скажите врачу об укусе, времени и предполагаемом месте контакта.",
          "Обычный укус клеща не означает автоматический звонок 112. В Грузии звоните 112 при настоящей экстренной ситуации: тяжёлых острых симптомах, потере сознания, сильном кровотечении или ситуации, когда скорая нужна немедленно.",
        ],
      },
      {
        heading: "Укус клеща и болезнь Лайма",
        paragraphs: [
          "Лайм-боррелиоз — бактериальное заболевание, которое передаётся через укус инфицированного клеща. Не каждый клещ инфицирован, и не каждый укус вызывает болезнь Лайма.",
          "Раннее удаление важно, потому что быстрое удаление присосавшегося клеща снижает риск. Следите за температурой, усталостью, головной болью или расширяющейся сыпью и обратитесь за медицинским советом при симптомах. По одной фотографии укуса болезнь Лайма не диагностируют.",
        ],
      },
      {
        heading: "Другие клещевые инфекции в Грузии",
        paragraphs: [
          "Материалы NCDC Грузии описывают крымско-конго геморрагическую лихорадку как заболевание, связанное с клещами в Грузии, и советуют быстро удалять клеща пинцетом, не раздавливать его и обращаться за медицинской помощью при подозрении на болезнь.",
          "Это не значит, что каждый клещ переносит болезнь. Это значит, что симптомы после контакта с клещом требуют своевременной медицинской оценки, особенно температура, признаки кровотечения, сильная слабость или быстрое ухудшение состояния.",
        ],
      },
      {
        heading: "Как снизить риск укуса клеща",
        image: "grass",
        list: {
          items: [
            "Носите длинные рукава и длинные брюки в травянистых, кустарниковых или лесных местах.",
            "Используйте репелленты по инструкции на этикетке.",
            "Проверяйте тело после активности на природе; клещи часто присасываются на мягкой или волосистой коже.",
            "Удаляйте присосавшихся клещей как можно скорее.",
          ],
        },
        paragraphs: [
          "Походы, кемпинг, полевые работы и высокая трава — ситуации, когда осмотр на клещей особенно полезен. Речь об осознанности, а не об отказе от природы.",
        ],
      },
    ],
    summary:
      "Удалите присосавшегося клеща быстро чистым пинцетом с тонкими концами: захватите близко к коже и тяните ровно. Не используйте масло, вазелин, лак, тепло, разрезы или раздавливание. Очистите место и руки, проверьте тело на других клещей и обратитесь к врачу при температуре, сыпи, расширяющемся пятне или ухудшении симптомов. В Грузии 112 используйте только при настоящей экстренной ситуации.",
    title: "Нашли клеща на коже? Как удалить его и когда обращаться к врачу",
  },
  tr: {
    description:
      "Deride tutunan keneyi doğru çıkarma, nelerden kaçınma, ısırıktan sonra neyi izleme ve ne zaman doktora başvurma rehberi.",
    faq: [
      {
        answer:
          "Temiz, ince uçlu cımbız kullanın, keneyi deriye en yakın yerden tutun ve sabit, düzgün basınçla çekin. Sonra ısırık yerini ve ellerinizi temizleyin.",
        question: "Kene doğru nasıl çıkarılır?",
      },
      {
        answer:
          "Hayır. Kenenin ayrılması için yağ, vazelin, oje, ısı veya başka maddeler kullanmayın. Keneyi mekanik olarak ve gecikmeden çıkarın.",
        question: "Kenenin üzerine yağ dökülebilir mi?",
      },
      {
        answer:
          "Küçük ağız parçalarını cımbızla kolayca alamıyorsanız bırakın ve derinin iyileşmesine izin verin. Deriyi derinden kurcalamayın veya kesmeyin.",
        question: "Kenenin bir parçası deride kalırsa ne yapmalıyım?",
      },
      {
        answer:
          "Hayır. Birçok ısırık hastalığa yol açmaz, ancak ateş, döküntü, genişleyen kızarıklık veya kötüleşen belirtiler varsa doktora başvurun.",
        question: "Her kene ısırığı tehlikeli midir?",
      },
      {
        answer:
          "Hayır. Lyme borreliyozu enfekte kenelerle bulaşır ve her kene enfekte değildir. Belirtileri doktor değerlendirmelidir; fotoğraftan Lyme tanısı konmaz.",
        question: "Kene ısırığı Lyme hastalığı demek midir?",
      },
      {
        answer:
          "Sıradan bir tutunmuş kene tek başına acil durum değildir. Gürcistan'da ciddi akut belirtiler veya ambulans gerektiren gerçek bir acil durumda 112'yi arayın.",
        question: "Kene ısırığından sonra 112 aranmalı mı?",
      },
    ],
    metaTitle: "Kene ısırığı — kene doğru nasıl çıkarılır?",
    sections: [
      {
        heading: "Şimdi ne yapmalısınız?",
        paragraphs: [
          "Kene derinize tutunmuşsa mümkün olduğunca çabuk çıkarın. Varsa temiz, ince uçlu cımbız kullanın, deriye yakın yerden tutun, sabit basınçla çekin ve sonra ısırık yerini ve ellerinizi temizleyin.",
          "Keneyi çıkarmak için kliniğe gitmeyi beklemeyin. Çıkardıktan sonra vücudun geri kalanını kontrol edin ve sonraki günler ile haftalarda sağlığınızı izleyin.",
        ],
      },
      {
        heading: "Kene doğru nasıl çıkarılır?",
        image: "removal",
        list: {
          items: [
            "Varsa temiz, ince uçlu cımbız kullanın.",
            "Keneyi derinin yüzeyine mümkün olduğunca yakın yerden, gövdesini sıkmadan tutun.",
            "Deriden sabit ve düzgün basınçla çekin. Döndürmeyin veya ani çekmeyin.",
            "Keneyi alkole koyun, sıkıca bantla sarın, kapalı bir kaba koyun veya tuvalete atın. Çıplak parmakla ezmeyin.",
            "Isırık yerini ve ellerinizi sabunlu su, alkol veya el antiseptiğiyle temizleyin.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Amaç basit: kenenin gövdesini sıkmadan ve deriyi gereksiz yere zedelemeden hızlıca çıkarmak.",
        ],
      },
      {
        heading: "Çıkarma sırasında ne yapmamalısınız?",
        list: {
          items: [
            "Kenenin üzerine vazelin, yağ, oje veya başka maddeler sürmeyin.",
            "Isı, alev veya yakma kullanmayın.",
            "Keneyi döndürmeyin, ani çekmeyin veya gövdesini parmaklarınızla ezmeyin.",
            "Deriyi kesmeyin ve küçük parçalar için agresifçe kurcalamayın.",
            "Kene ısırığı nedeniyle kendi başınıza antibiyotik veya başka ilaç başlamayın.",
          ],
        },
        paragraphs: [
          "Halk yöntemleri çıkarmayı geciktirebilir veya keneyi irrite edebilir. Desteklenen ilk adım hızlı mekanik çıkarmadır.",
        ],
      },
      {
        heading: "Çıkardıktan sonra ne yapmalısınız?",
        image: "after",
        list: {
          items: [
            "Isırık yerini ve ellerinizi temizleyin.",
            "Özellikle otluk, çalılık veya ormanlık alandan sonra vücudunuzda başka kene olup olmadığını kontrol edin.",
            "Daha sonra tıbbi danışma gerekirse ısırığın yaklaşık ne zaman ve nerede olduğunu not edin.",
            "Sonraki günler ve haftalarda döküntü, ateş veya kötüleşen belirtileri izleyin.",
          ],
        },
        paragraphs: [
          "Çıkarılan kenenin fotoğrafı daha sonra konuşmaya yardımcı olabilir, ancak ticari kene testi tedavi kararını belirlememelidir. Hastalanırsanız test sonucunu beklemeyin.",
        ],
      },
      {
        heading: "Küçük bir parça deride kalırsa?",
        paragraphs: [
          "Bazen ağız parçaları kopabilir. Cımbızla kolayca çıkarılabiliyorsa çıkarabilirsiniz. Kolay çıkmıyorsa bırakın ve derinin iyileşmesine izin verin.",
          "Deriyi kesmeyin, yakmayın veya derinden kurcalamayın. Bölge giderek daha ağrılı, şiş, enfeksiyon gibi veya endişe verici hale gelirse doktora başvurun.",
        ],
      },
      {
        heading: "Ne zaman doktora başvurmalısınız?",
        paragraphs: [
          "Kene ısırığından sonra döküntü, genişleyen kızarıklık, ateş, baş ağrısı, yorgunluk veya başka belirtiler gelişirse doktora başvurun. Doktora ısırığı, zamanını ve muhtemel temas yerini anlatın.",
          "Sıradan bir kene ısırığı otomatik olarak 112 acili değildir. Gürcistan'da ağır akut belirtiler, bilinç kaybı, ciddi kanama veya hemen ambulans gerektiren durumlarda 112'yi arayın.",
        ],
      },
      {
        heading: "Kene ısırığı ve Lyme hastalığı",
        paragraphs: [
          "Lyme borreliyozu, enfekte kenenin ısırığıyla bulaşan bakteriyel bir hastalıktır. Her kene enfekte değildir ve her kene ısırığı Lyme hastalığına yol açmaz.",
          "Erken çıkarma önemlidir çünkü tutunmuş kenelerin hızlı çıkarılması riski azaltır. Ateş, yorgunluk, baş ağrısı veya genişleyen döküntüyü izleyin ve belirtiler çıkarsa tıbbi görüş alın. Yalnızca ısırık fotoğrafıyla Lyme tanısı konmaz.",
        ],
      },
      {
        heading: "Gürcistan'da diğer kene kaynaklı enfeksiyonlar",
        paragraphs: [
          "Gürcistan NCDC materyalleri, Kırım-Kongo kanamalı ateşini Gürcistan'da kenelerle ilişkili bir hastalık olarak tanımlar; keneyi cımbızla hemen çıkarmayı, ezmemeyi ve hastalık şüphesinde tıbbi kuruma başvurmayı önerir.",
          "Bu, her kenenin hastalık taşıdığı anlamına gelmez. Kene temasından sonra gelişen belirtilerin, özellikle ateş, kanama bulguları, ağır halsizlik veya hızla kötüleşme varsa, zamanında tıbbi değerlendirme gerektirdiği anlamına gelir.",
        ],
      },
      {
        heading: "Kene ısırığını nasıl azaltabilirsiniz?",
        image: "grass",
        list: {
          items: [
            "Otluk, çalılık veya ormanlık alanlarda uzun kollu üst ve uzun pantolon giyin.",
            "Kovucuları ürün etiketine göre kullanın.",
            "Açık hava etkinliğinden sonra vücudunuzu kontrol edin; keneler yumuşak veya kıllı bölgelere tutunabilir.",
            "Tutunan keneleri gecikmeden çıkarın.",
          ],
        },
        paragraphs: [
          "Yürüyüş, kamp, arazi çalışması ve uzun otlarda hareket etmek kene kontrolünün yararlı olduğu durumlardır. Amaç doğadan kaçmak değil, dikkatli olmaktır.",
        ],
      },
    ],
    summary:
      "Tutunmuş keneyi temiz, ince uçlu cımbızla hızlıca çıkarın: deriye yakın tutun ve sabit, düzgün basınçla çekin. Yağ, vazelin, oje, ısı, kesme veya ezme kullanmayın. Bölgeyi ve ellerinizi temizleyin, başka kene var mı kontrol edin; ateş, döküntü, genişleyen kızarıklık veya kötüleşen belirtilerde doktora başvurun. Gürcistan'da 112 yalnızca gerçek acil durumlar içindir.",
    title: "Deride kene mi var? Nasıl çıkarılır ve ne zaman doktora gidilir?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "CDC — What to Do After a Tick Bite",
    supports: {
      en: "Prompt removal, clean fine-tipped tweezers, close-to-skin grip, steady pressure, avoiding heat/petroleum jelly/nail polish, mouthpart guidance, cleaning, disposal, tick checks, follow-up rash or fever, and limits of tick testing.",
      ka: "ტკიპის სწრაფად მოცილება, სუფთა წვრილწვერიანი პინცეტი, კანთან ახლოს ჩავლება, თანაბარი მოძრაობა, სიცხის/ვაზელინის/ლაქის არ გამოყენება, დარჩენილი პირის ნაწილის მართვა, გაწმენდა, მოცილებული ტკიპის განკარგვა, სხეულის შემოწმება, გამონაყარის ან სიცხისას ექიმთან მიმართვა და ტკიპის ტესტის შეზღუდვები.",
      ru: "Быстрое удаление, чистый тонкий пинцет, захват у кожи, ровное вытягивание, отказ от тепла/вазелина/лака, действия при оставшихся ротовых частях, очищение, утилизация клеща, проверка тела, обращение при сыпи или температуре и ограничения тестирования клеща.",
      tr: "Hızlı çıkarma, temiz ince uçlu cımbız, deriye yakın tutma, sabit çekme, ısı/vazelin/oje kullanmama, ağız parçası önerisi, temizlik, kene imhası, vücut kontrolü, döküntü veya ateşte doktora başvurma ve kene testinin sınırlılıkları.",
    },
    url: "https://www.cdc.gov/ticks/after-a-tick-bite/index.html",
  },
  {
    name: "ECDC — Borreliosis (Lyme disease)",
    supports: {
      en: "Lyme borreliosis transmission through infected ticks, common early symptoms, early removal, prevention, and not presenting every tick bite as Lyme disease.",
      ka: "ლაიმის ბორელიოზის ინფიცირებული ტკიპით გადაცემა, ადრეული სიმპტომები, ადრეული მოცილების მნიშვნელობა, პრევენცია და ის, რომ ყველა ტკიპის ნაკბენი ლაიმის დაავადებას არ ნიშნავს.",
      ru: "Передача лайм-боррелиоза через инфицированных клещей, ранние симптомы, значение раннего удаления, профилактика и то, что не каждый укус означает болезнь Лайма.",
      tr: "Lyme borreliyozunun enfekte kenelerle bulaşması, erken belirtiler, erken çıkarmanın önemi, korunma ve her kene ısırığının Lyme hastalığı anlamına gelmemesi.",
    },
    url: "https://www.ecdc.europa.eu/en/borreliosis-lyme-disease",
  },
  {
    name: "ECDC — Personal protective measures against tick bites",
    supports: {
      en: "Avoiding tick bites, protective clothing, repellents, body checks after outdoor activity, and prompt removal.",
      ka: "ტკიპის ნაკბენის თავიდან არიდება, დამცავი ტანსაცმელი, რეპელენტები, გარეთ ყოფნის შემდეგ სხეულის შემოწმება და სწრაფი მოცილება.",
      ru: "Профилактика укусов клещей, защитная одежда, репелленты, осмотр тела после активности на природе и быстрое удаление.",
      tr: "Kene ısırıklarından kaçınma, koruyucu giysi, kovucular, açık hava sonrası vücut kontrolü ve hızlı çıkarma.",
    },
    url: "https://www.ecdc.europa.eu/en/disease-vectors/prevention-and-control/protective-measures-ticks",
  },
  {
    name: "Georgia NCDC — Crimean-Congo haemorrhagic fever",
    supports: {
      en: "Georgia-relevant tick-borne disease context, avoiding bare-hand tick contact/crushing, prompt tweezer removal, and seeking medical care when illness is suspected.",
      ka: "საქართველოსთვის რელევანტური ტკიპებით გადამდები დაავადების კონტექსტი, ტკიპასთან დაუცველი ხელით შეხებისა და გაჭყლეტის თავიდან არიდება, პინცეტით სწრაფი მოცილება და ავადობის ეჭვისას სამედიცინო დაწესებულებასთან დროული დაკავშირება.",
      ru: "Контекст клещевой инфекции, актуальный для Грузии, отказ от контакта голыми руками и раздавливания, быстрое удаление пинцетом и обращение за медицинской помощью при подозрении на болезнь.",
      tr: "Gürcistan'a ilgili kene kaynaklı hastalık bağlamı, çıplak elle temas/ezmeden kaçınma, cımbızla hızlı çıkarma ve hastalık şüphesinde tıbbi yardıma başvurma.",
    },
    url: "https://test.ncdc.ge/Handlers/GetFile.ashx?ID=11eb4bdd-19fb-4f4a-9307-c775b0e4b64f",
  },
  {
    name: "112 Georgia — When to call 112",
    supports: {
      en: "112 is Georgia's emergency number and should be used for emergencies requiring police, fire/rescue, or emergency medical service.",
      ka: "112 საქართველოს გადაუდებელი დახმარების ნომერია და გამოიყენება იმ შემთხვევებში, როცა საჭიროა პოლიცია, სახანძრო-სამაშველო ან სასწრაფო სამედიცინო დახმარება.",
      ru: "112 — номер экстренной помощи в Грузии, который используется при ситуациях, требующих полиции, пожарно-спасательной службы или скорой медицинской помощи.",
      tr: "112, Gürcistan'ın acil numarasıdır ve polis, itfaiye/kurtarma veya acil tıbbi hizmet gerektiren acil durumlar için kullanılır.",
    },
    url: "https://112.gov.ge/?lang=en&page_id=1686",
  },
];

export const TICK_BITE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Fine-tipped metal tweezers gripping an attached brown tick close to the skin on a hairy forearm",
      ka: "წვრილწვერიანი ლითონის პინცეტი თმიანი წინამხრის კანზე მიმაგრებულ ყავისფერ ტკიპას კანთან ახლოს ჩასჭერია",
      ru: "Тонкий металлический пинцет захватывает присосавшегося коричневого клеща у самой кожи на волосистом предплечье",
      tr: "İnce uçlu metal cımbız, kıllı bir önkoldaki deriye tutunmuş kahverengi keneyi deriye yakın yerden tutuyor",
    },
    height: 768,
    src: "https://cdn.reptiles.ge/images/guides/tick-bite-hero.jpg",
    width: 1024,
  },
  id: "tick-bite",
  images: {
    after: {
      alt: {
        en: "A small brown tick inside a closed glass jar on a bathroom counter, next to a bar of soap and a plain bottle of clear liquid",
        ka: "პატარა ყავისფერი ტკიპა დახურულ შუშის ქილაში აბაზანის ზედაპირზე, გვერდით საპონი და უწარწერო გამჭვირვალე ბოთლი",
        ru: "Небольшой коричневый клещ в закрытой стеклянной банке на столешнице, рядом мыло и бутылка без этикетки с прозрачной жидкостью",
        tr: "Banyo tezgahında kapalı bir cam kavanozun içindeki küçük kahverengi kene, yanında sabun ve etiketsiz şeffaf bir şişe",
      },
      height: 768,
      src: "https://cdn.reptiles.ge/images/guides/tick-bite-after.jpg",
      width: 1024,
    },
    grass: {
      alt: {
        en: "A brown tick at the tip of a grass blade, with its front legs raised",
        ka: "ყავისფერი ტკიპა ბალახის წვერზე, წინა ფეხები აწეული",
        ru: "Коричневый клещ на кончике травинки, передние ноги подняты",
        tr: "Bir çimen yaprağının ucunda, ön bacakları kalkık kahverengi bir kene",
      },
      height: 935,
      src: "https://cdn.reptiles.ge/images/guides/tick-bite-grass.jpg",
      width: 1024,
    },
    removal: {
      alt: {
        en: "A hand pulling an attached tick straight off a forearm with fine-tipped tweezers",
        ka: "ხელი წვრილწვერიანი პინცეტით წინამხრის კანზე მიმაგრებულ ტკიპას პირდაპირ ზევით იწევს",
        ru: "Рука тонким пинцетом тянет присосавшегося клеща прямо от кожи предплечья",
        tr: "Bir el, ince uçlu cımbızla önkola tutunmuş keneyi deriden düz yukarı çekiyor",
      },
      height: 768,
      src: "https://cdn.reptiles.ge/images/guides/tick-bite-removal.jpg",
      width: 1024,
    },
  },
  messageKey: "tickBite",
  ogImage: "https://cdn.reptiles.ge/og/images/guides/tick-bite.jpg",
  parentHub: "insects",
  pathname: "/insects/tkipis-nakbeni",
  relatedGuideIds: ["wasp-nest", "scorpion-sting", "snake-bite"],
  search: {
    icon: "safety",
    keywords: [
      "ტკიპის ნაკბენი",
      "ტკიპას ნაკბენი",
      "ტკიპას ამოღება",
      "ტკიპას მოშორება",
      "ტკიპას ნაკბენი ფოტო",
      "როგორ მოვიშოროთ ტკიპა",
      "ტკიპის ამოღება",
      "ტკიპა სხეულზე",
      "ტკიპა კანზე",
      "ტკიპის ნაკბენის სიმპტომები",
      "ლაიმის დაავადება",
      "ბორელიოზი",
      "tkipis nakbeni",
      "tick bite",
      "remove tick",
      "Lyme disease",
      "borreliosis",
      "укус клеща",
      "как удалить клеща",
      "kene ısırığı",
      "kene çıkarma",
    ],
    rank: 5,
    subtitle: {
      en: "Correct removal, aftercare, warning signs, and prevention",
      ka: "სწორი მოცილება, შემდეგი ნაბიჯები, საყურადღებო ნიშნები და პრევენცია",
      ru: "Правильное удаление, дальнейшие действия, тревожные признаки и профилактика",
      tr: "Doğru çıkarma, sonrası bakım, uyarı belirtileri ve korunma",
    },
    title: {
      en: "Tick bite",
      ka: "ტკიპის ნაკბენი",
      ru: "Укус клеща",
      tr: "Kene ısırığı",
    },
  },
  sources: SOURCES,
});
