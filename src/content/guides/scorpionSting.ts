import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

const COPY: Record<AppLocale, GuideArticleCopy> = {
  en: {
    description:
      "Stung by a scorpion? Learn the first steps, warning signs, when to seek medical advice or call 112 in Georgia, and what is known about local species.",
    faq: [
      {
        answer:
          "Use a cool compress wrapped in cloth for pain. Do not submerge the area in ice water.",
        question: "Can I use ice?",
      },
      {
        answer:
          "No. If safe, photograph it from a distance. Handling it risks another sting and may delay care.",
        question: "Must I catch the scorpion for identification?",
      },
      {
        answer:
          "No. Do not cut the site or try to suck out venom. Wash the skin and seek medical care when needed.",
        question: "Can I suck out the venom at home?",
      },
      {
        answer:
          "Local pain alone does not automatically require an emergency call. Seek medical advice for severe, spreading, or worsening pain; call 112 for breathing difficulty or other serious symptoms beyond the sting site.",
        question: "Does local pain alone mean I should call 112?",
      },
    ],
    intro:
      "A scorpion sting may cause only local pain, but severity depends on the species and the person affected. Move away, wash the site with soap and water, and use a cool compress. Do not cut the site or try to suck out venom. In Georgia, call 112 for breathing difficulty, loss of consciousness, or rapidly worsening symptoms beyond the sting site.",
    metaTitle: "Scorpion sting: danger signs and what to do",
    sections: [
      {
        heading: "How dangerous is a scorpion sting?",
        paragraphs: [
          "Pain or burning, tingling or numbness, slight swelling, or warmth can occur at the sting site. Some scorpions can also cause symptoms elsewhere in the body. Severity is not the same for every species or every person.",
          "Watch for trouble breathing, involuntary muscle movements, unusual eye or head movements, drooling, marked sweating, repeated vomiting, or increasing restlessness. Pain intensity alone cannot identify the species or grade the envenomation.",
        ],
      },
      {
        heading: "When should you call 112?",
        paragraphs: [
          "Trouble breathing, loss of consciousness, confusion, severe muscle spasms, or rapidly worsening symptoms need emergency help: call 112 in Georgia. Swelling of the face or throat is also an emergency sign.",
          "If those signs are absent but pain is severe, spreading, persistent, or other symptoms concern you, seek timely medical advice. 112 is for emergencies, not general information.",
        ],
      },
      {
        heading: "What should you do in the first minutes?",
        list: {
          items: [
            "Gently wash the sting site with soap and water.",
            "Apply a cool compress wrapped in cloth for pain; do not submerge the area in ice water.",
            "If an arm or leg was stung, rest and support it comfortably. Watch for symptoms beyond the sting site.",
            "Photograph the scorpion only from a safe distance, if this does not delay help. Do not handle it.",
          ],
          ordered: true,
        },
        paragraphs: [
          "First move to a safe place. First aid aims to ease pain and help you notice changes; it does not replace clinical assessment when warning signs appear.",
        ],
      },
      {
        heading: "What if a child is stung?",
        paragraphs: [
          "Clinically important scorpion venom can have more serious effects in children. Seek medical advice promptly for a child and watch breathing and general condition closely. Unusual movements, drooling, or marked restlessness are concerning.",
          "Call 112 for emergency signs. This does not mean every Georgian scorpion sting is severe in children; clinical data for local species are limited.",
        ],
      },
      {
        heading: "What should you avoid?",
        paragraphs: [
          "Do not cut or burn the site or try to suck or manually remove venom. Do not apply a tight tourniquet; Poison Control explicitly warns against it for scorpion stings. Do not take sedatives or sleeping medicines on your own.",
          "Do not substitute home mixtures or chemicals for medical care. Authoritative first-aid sources do not recommend these practices, and they may delay help.",
        ],
      },
      {
        heading: "How dangerous are the scorpions found in Georgia?",
        paragraphs: [
          "The [scorpion atlas for Georgia](/scorpions) lists four species: [Mesobuthus eupeus](mesobuthus-eupeus), [Olivierus caucasicus](olivierus-caucasicus), [Euscorpius italicus](euscorpius-italicus), and [Euscorpius mingrelicus](euscorpius-mingrelicus). This records their presence; it is not a Georgian sting-severity dataset.",
          "An older Turkish clinical study and an Iranian species study used the pre-revision Mesobuthus eupeus name; read them cautiously: a 2022 revision restricted the modern, narrow species concept to the Caucasus. Cases reported under the older broad name cannot be applied directly to Georgian populations. Reliable species-linked clinical data from Georgia are also sparse for O. caucasicus, E. italicus, and E. mingrelicus. A few Italian Euscorpius case reports provide genus-level context only. An absence of located severe Georgian cases does not prove a species harmless.",
        ],
      },
      {
        heading: "Does a scorpion bite or sting?",
        paragraphs: [
          "The venom is delivered by the stinger at the end of the tail, not by the pincers. Everyday speech may still call it a scorpion bite. The first-aid decision does not depend on that wording.",
        ],
      },
      {
        heading: "How soon do symptoms appear?",
        paragraphs: [
          "Local pain may be felt promptly, but progression varies with species and person. There is no universal safe waiting period. If symptoms appear beyond the sting site or the person worsens quickly, seek emergency help without waiting for a set number of hours.",
        ],
      },
      {
        heading: "Can a sting cause an allergic reaction?",
        paragraphs: [
          "Systemic venom effects and an allergic reaction are different processes. Hives, swelling of the face or throat, trouble breathing, or fainting after a sting may indicate a severe allergic reaction. Call 112 in Georgia.",
        ],
      },
      {
        heading: "Is antivenom needed?",
        paragraphs: [
          "Not every scorpion sting requires antivenom. In some countries, severe cases may receive antivenom appropriate to the species and region; clinicians make that decision. We have not verified a particular Georgian stock or universal antivenom protocol. Treatment for another Mesobuthus species cannot simply be assigned to M. eupeus.",
        ],
      },
      {
        heading: "What happens in hospital?",
        paragraphs: [
          "Clinicians assess symptoms and may observe the person, treat symptoms, or monitor breathing and heart function as needed. Care depends on the clinical picture and local resources; medicine and antivenom decisions belong to professionals.",
        ],
      },
    ],
    summary:
      "Sting severity depends on the species and symptoms. Move away from the scorpion, wash the site with soap and water, apply a cool compress, and watch the person's general condition. Do not use a tight tourniquet, cut the site, or suck out venom. In Georgia, call 112 for trouble breathing, loss of consciousness, or rapidly worsening symptoms beyond the sting site; seek medical advice for other concerns.",
    title: "Scorpion sting: how dangerous is it and what should you do?",
  },
  ka: {
    description:
      "მორიელის ნაკბენისას რა ნიშნებია საყურადღებო? გაიგეთ, როგორ მოიქცეთ პირველ წუთებში, როდის მიმართოთ ექიმს და როდის დარეკოთ 112-ზე საქართველოში.",
    faq: [
      {
        answer:
          "ტკივილისთვის გამოიყენეთ გრილი, ქსოვილში გახვეული საფენი. ადგილი ყინულოვან წყალში არ ჩაყოთ.",
        question: "შეიძლება ყინულის დადება?",
      },
      {
        answer:
          "არა. მხოლოდ თუ უსაფრთხოა, გადაიღეთ ფოტო შორიდან. მორიელის დაჭერამ შეიძლება მეორე ჩხვლეტა გამოიწვიოს და დახმარება დააყოვნოს.",
        question: "აუცილებელია მორიელის დაჭერა ამოსაცნობად?",
      },
      {
        answer:
          "არა. ადგილი არ გაჭრათ და შხამის ამოწოვას ნუ ეცდებით. დაიბანეთ კანი და საჭიროებისას მიმართეთ სამედიცინო დახმარებას.",
        question: "შეიძლება შხამის სახლში ამოწოვა?",
      },
      {
        answer:
          "მხოლოდ ადგილობრივი ტკივილი თავისთავად 112-ზე დარეკვის მიზეზი არ არის. ძლიერი, გავრცელებული ან გაუარესებული ტკივილისას მიიღეთ ექიმის რჩევა; სუნთქვის გაძნელების ან სხვა მძიმე საერთო ნიშნებისას დარეკეთ 112-ზე.",
        question: "თუ მხოლოდ ტკივილია, მაინც საჭიროა 112?",
      },
    ],
    intro:
      "მორიელის ნაკბენმა შეიძლება მხოლოდ ადგილობრივი ტკივილი გამოიწვიოს, მაგრამ სიმძიმე სახეობასა და ადამიანის მდგომარეობაზეა დამოკიდებული. მოშორდით მორიელს, დაიბანეთ ადგილი საპნითა და წყლით და დაიდეთ გრილი საფენი. ადგილი არ გაჭრათ და შხამის ამოწოვას ნუ ეცდებით. სუნთქვის გაძნელების, გონების დაკარგვის ან სხვა სწრაფად მზარდი საერთო სიმპტომებისას საქართველოში დარეკეთ 112-ზე.",
    metaTitle: "მორიელის ნაკბენი — საშიშია თუ არა და რა ვქნათ?",
    sections: [
      {
        heading: "რამდენად საშიშია მორიელის ნაკბენი?",
        paragraphs: [
          "ნესტრის ადგილას შეიძლება გაჩნდეს ტკივილი ან წვა, ჩხვლეტა-დაბუჟება, მცირე შეშუპება ან სითბო. ზოგ მორიელს შეუძლია საერთო, ანუ ჩხვლეტის ადგილის გარეთ არსებული სიმპტომებიც გამოიწვიოს. სიმძიმე ყველა სახეობასა და ყველა ადამიანში ერთნაირი არ არის.",
          "საყურადღებოა სუნთქვის გაძნელება, კუნთების უნებლიე მოძრაობა, უჩვეულო თვალის ან თავის მოძრაობა, ნერწყვის დენა, ძლიერი ოფლიანობა, განმეორებითი ღებინება ან მზარდი მოუსვენრობა. მხოლოდ ტკივილის ძალით სახეობას ან მოწამვლის სიმძიმეს ვერ განსაზღვრავთ.",
        ],
      },
      {
        heading: "როდის უნდა დავრეკოთ 112-ზე?",
        paragraphs: [
          "თუ ადამიანს უჭირს სუნთქვა, გონება დაკარგა, დაბნეულია, ძლიერი კუნთოვანი სპაზმი აქვს ან მდგომარეობა სწრაფად უარესდება, საჭიროა გადაუდებელი დახმარება — საქართველოში დარეკეთ 112-ზე. სახის ან ყელის შეშუპებაც გადაუდებელი ნიშანია.",
          "თუ ასეთი ნიშნები არ არის, მაგრამ ტკივილი ძლიერია, ვრცელდება, არ სუსტდება ან სხვა სიმპტომები გაწუხებთ, დროულად მიმართეთ სამედიცინო პროფესიონალს. 112 გადაუდებელი დახმარების ნომერია და არა ზოგადი საინფორმაციო ხაზი.",
        ],
      },
      {
        heading: "რა უნდა გავაკეთოთ პირველ წუთებში?",
        list: {
          items: [
            "ჩხვლეტის ადგილი ნაზად დაიბანეთ საპნითა და წყლით.",
            "ტკივილის შესამცირებლად დაიდეთ გრილი, ქსოვილში გახვეული საფენი; ადგილი ყინულოვან წყალში არ ჩაყოთ.",
            "თუ ხელი ან ფეხია დაზიანებული, დაასვენეთ და კომფორტულად დაუჭირეთ. დააკვირდით, ხომ არ ჩნდება საერთო სიმპტომები.",
            "მორიელის ფოტო მხოლოდ უსაფრთხო მანძილიდან გადაიღეთ, თუ ეს დახმარებას არ აყოვნებს. ცხოველს ნუ დაიჭერთ.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ჯერ უსაფრთხო ადგილას გადადით. პირველადი დახმარება ტკივილის შემსუბუქებასა და ცვლილებების შემჩნევას ემსახურება; ის ექიმის შეფასებას ვერ ცვლის, თუ საყურადღებო ნიშნები გაჩნდა.",
        ],
      },
      {
        heading: "ბავშვში მორიელის ნაკბენისას როგორ მოვიქცეთ?",
        paragraphs: [
          "კლინიკურად მნიშვნელოვანი მორიელის შხამი ბავშვზე შეიძლება უფრო მძიმედ აისახოს. თუ ბავშვი დაინესტრა, დროულად მიიღეთ ექიმის რჩევა და ყურადღებით აკვირდით სუნთქვასა და საერთო მდგომარეობას. უჩვეულო მოძრაობა, ნერწყვის დენა ან ძლიერი მოუსვენრობა საყურადღებოა.",
          "გადაუდებელი ნიშნებისას დარეკეთ 112-ზე. ეს რეკომენდაცია არ გულისხმობს, რომ საქართველოში ყველა მორიელის ჩხვლეტა ბავშვისთვის მძიმეა; ადგილობრივი სახეობების კლინიკური მონაცემები შეზღუდულია.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        paragraphs: [
          "არ გაიჭრათ ან დაიწვათ ადგილი და ნუ ეცდებით შხამის ამოწოვას ან ხელით ამოღებას. არ გამოიყენოთ მჭიდრო ტურნიკეტი; Poison Control პირდაპირ აფრთხილებს, რომ მორიელის ჩხვლეტისას ის არ უნდა გამოიყენოთ. ნუ მიიღებთ დამაძინებელ ან დამამშვიდებელ წამალს თვითნებურად.",
          "ნუ წაისვამთ თვითნაკეთ ნარევს ან ქიმიკატს სამედიცინო დახმარების ნაცვლად. ამ ქმედებებს სანდო პირველადი დახმარების წყაროები არ ურჩევენ და შეიძლება დახმარებაც დააყოვნონ.",
        ],
      },
      {
        heading: "საქართველოში გავრცელებული მორიელები რამდენად საშიშია?",
        paragraphs: [
          "[საქართველოს მორიელების ატლასში](/scorpions) აღწერილია ოთხი სახეობა: [ჭრელი მორიელი](mesobuthus-eupeus), [კავკასიური მორიელი](olivierus-caucasicus), [იტალიური მორიელი](euscorpius-italicus) და [მეგრული მორიელი](euscorpius-mingrelicus). ეს სია სახეობების არსებობას ეხება და არ არის საქართველოში დანესტვრების სიმძიმის სტატისტიკა.",
          "ძველი თურქული კლინიკური კვლევა და ირანული სახეობრივი ნაშრომი Mesobuthus eupeus-ის რევიზიამდელ სახელს იყენებდნენ; მათი წაკითხვა სიფრთხილით უნდა მოხდეს: 2022 წლის რევიზიამ სახეობის თანამედროვე, ვიწრო გაგება კავკასიით შემოსაზღვრა. ამიტომ ძველი, ფართო სახელით აღწერილი შემთხვევები საქართველოს პოპულაციის რისკს პირდაპირ ვერ განსაზღვრავს. Olivierus caucasicus-ის, Euscorpius italicus-ისა და E. mingrelicus-ის საქართველოს შემთხვევებისთვისაც სანდო, სახეობაზე მიბმული კლინიკური სურათი მწირია. იტალიაში Euscorpius-ის რამდენიმე ჩხვლეტის აღწერა მხოლოდ გვარის ზოგად კონტექსტს იძლევა. ნუ ჩათვლით რომელიმე სახეობას უვნებლად მხოლოდ იმიტომ, რომ მძიმე ქართული შემთხვევები ვერ მოიძებნა.",
        ],
      },
      {
        heading: "მორიელი კბენს თუ ნესტრით იჩხვლიტება?",
        paragraphs: [
          "„მორიელის ნაკბენი“ გავრცელებული ქართული გამოთქმაა. სინამდვილეში მორიელი შხამს კუდის ბოლოში მდებარე ნესტრით შეჰყავს; მარწუხები ამ საქმეს არ აკეთებს. პირველადი დახმარების გადაწყვეტილება ამ ტერმინზე არ არის დამოკიდებული.",
        ],
      },
      {
        heading: "რამდენ ხანში ჩნდება სიმპტომები?",
        paragraphs: [
          "ადგილობრივი ტკივილი შეიძლება მალევე იგრძნოთ, მაგრამ სიმპტომების მიმდინარეობა სახეობასა და ადამიანზეა დამოკიდებული. ერთი უნივერსალური უსაფრთხო დროის ზღვარი არ არსებობს. თუ საერთო სიმპტომები ჩნდება ან მდგომარეობა სწრაფად უარესდება, ნუ დაელოდებით წინასწარ დათვლილ საათებს — მიიღეთ გადაუდებელი დახმარება.",
        ],
      },
      {
        heading: "შეიძლება თუ არა ალერგიული რეაქცია?",
        paragraphs: [
          "შხამის საერთო მოქმედება და ალერგიული რეაქცია ერთი და იგივე არ არის. ჩხვლეტის შემდეგ ჭინჭრის ციება, სახის ან ყელის შეშუპება, სუნთქვის გაძნელება ან გონების წასვლა შეიძლება მძიმე ალერგიული რეაქციის ნიშანი იყოს. ასეთ დროს დარეკეთ 112-ზე.",
        ],
      },
      {
        heading: "საჭიროა თუ არა ანტიშხამი?",
        paragraphs: [
          "ანტიშხამი ყველა მორიელის ჩხვლეტისას საჭირო არ არის. მძიმე შემთხვევებში ზოგ ქვეყანაში გამოიყენება კონკრეტული სახეობისა და რეგიონისთვის შესაფერისი ანტიშხამი; გადაწყვეტილებას ექიმი იღებს. საქართველოსთვის კონკრეტული მარაგი ან საყოველთაო ანტიშხამის სქემა დადასტურებული არ გვაქვს. სხვა Mesobuthus სახეობის მკურნალობა M. eupeus-ს ავტომატურად არ ერგება.",
        ],
      },
      {
        heading: "როგორ ეხმარებიან საავადმყოფოში?",
        paragraphs: [
          "ექიმი აფასებს ნიშნებს და საჭიროების მიხედვით აკვირდება ადამიანს, უმსუბუქებს სიმპტომებს ან ამოწმებს სუნთქვასა და გულის მუშაობას. მკურნალობა დამოკიდებულია კლინიკურ მდგომარეობასა და ადგილობრივ შესაძლებლობებზე; მედიკამენტებისა და ანტიშხამის არჩევა პროფესიონალების საქმეა.",
        ],
      },
    ],
    summary:
      "მორიელის ნაკბენის სიმძიმე სახეობასა და სიმპტომებზეა დამოკიდებული. მოშორდით ცხოველს, დაიბანეთ ადგილი საპნითა და წყლით, დაიდეთ გრილი საფენი და დააკვირდით საერთო მდგომარეობას. მჭიდრო ტურნიკეტი, გაჭრა და ამოწოვა არ გამოიყენოთ. სუნთქვის გაძნელების, გონების დაკარგვის ან სწრაფად მზარდი საერთო სიმპტომებისას საქართველოში დარეკეთ 112-ზე; სხვა შეშფოთებისას მიმართეთ ექიმს.",
    title: "მორიელის ნაკბენი — საშიშია თუ არა და რა უნდა გავაკეთოთ?",
  },
  ru: {
    description:
      "Что делать после укола скорпиона? Первые безопасные действия, тревожные симптомы, когда обратиться к врачу или позвонить 112 в Грузии и что известно о местных видах.",
    faq: [
      {
        answer:
          "Для облегчения боли приложите прохладный компресс через ткань. Не погружайте место укола в ледяную воду.",
        question: "Можно ли приложить лёд?",
      },
      {
        answer:
          "Нет. Если безопасно, сфотографируйте его издалека. Попытка поймать может привести к повторному уколу и задержать помощь.",
        question: "Нужно ли ловить скорпиона для определения вида?",
      },
      {
        answer:
          "Нет. Не разрезайте место укола и не пытайтесь отсосать яд. Промойте кожу и при необходимости обратитесь за медицинской помощью.",
        question: "Можно ли отсосать яд дома?",
      },
      {
        answer:
          "Местная боль сама по себе не всегда требует экстренного вызова. При сильной, распространяющейся или нарастающей боли обратитесь к врачу; при затруднении дыхания и других серьёзных общих симптомах звоните 112.",
        question: "При одной только местной боли нужно звонить 112?",
      },
    ],
    intro:
      "Укол скорпиона может вызвать только местную боль, но тяжесть зависит от вида и состояния человека. Отойдите, промойте место водой с мылом и приложите прохладный компресс. Не разрезайте место укола и не пытайтесь отсосать яд. При затруднении дыхания, потере сознания или быстром ухудшении состояния в Грузии звоните 112.",
    metaTitle: "Укус скорпиона: тревожные признаки и первая помощь",
    sections: [
      {
        heading: "Насколько опасен укол скорпиона?",
        paragraphs: [
          "В месте укола возможны боль или жжение, покалывание или онемение, небольшая припухлость и ощущение тепла. Некоторые скорпионы вызывают симптомы за пределами места укола. Тяжесть зависит от вида и человека.",
          "Обратите внимание на затруднённое дыхание, непроизвольные движения мышц, необычные движения глаз или головы, слюнотечение, сильную потливость, повторную рвоту или нарастающее беспокойство. По одной силе боли нельзя определить вид или тяжесть отравления.",
        ],
      },
      {
        heading: "Когда звонить 112?",
        paragraphs: [
          "При затруднённом дыхании, потере сознания, спутанности, сильных мышечных спазмах или быстром ухудшении нужна экстренная помощь: в Грузии звоните 112. Отёк лица или горла также требует экстренной помощи.",
          "Если этих признаков нет, но боль сильная, распространяется, не уменьшается или появились другие тревожные симптомы, своевременно обратитесь к врачу. 112 предназначен для экстренных ситуаций, а не для общей консультации.",
        ],
      },
      {
        heading: "Что делать в первые минуты?",
        list: {
          items: [
            "Осторожно промойте место укола водой с мылом.",
            "Для облегчения боли приложите прохладный компресс через ткань; не погружайте место укола в ледяную воду.",
            "Если пострадала рука или нога, дайте ей покой и удобно поддержите. Следите за симптомами вне места укола.",
            "Сфотографируйте скорпиона лишь с безопасного расстояния, если это не задержит помощь. Не берите его в руки.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Сначала отойдите в безопасное место. Первая помощь облегчает боль и помогает заметить изменения, но при тревожных признаках не заменяет осмотр врача.",
        ],
      },
      {
        heading: "Что делать, если пострадал ребёнок?",
        paragraphs: [
          "Яд медицински значимых скорпионов может сильнее воздействовать на детей. Если ужален ребёнок, как можно скорее получите совет врача и внимательно следите за дыханием и общим состоянием. Необычные движения, слюнотечение и выраженное беспокойство настораживают.",
          "При экстренных признаках звоните 112. Это не означает, что каждый укол грузинского скорпиона тяжёл для ребёнка; клинических данных по местным видам мало.",
        ],
      },
      {
        heading: "Чего нельзя делать?",
        paragraphs: [
          "Не разрезайте и не прижигайте место укола, не пытайтесь отсасывать или выдавливать яд. Не накладывайте тугой жгут: Poison Control прямо предупреждает против него при уколе скорпиона. Не принимайте самостоятельно снотворные или успокоительные.",
          "Не заменяйте медицинскую помощь домашними смесями или химическими средствами. Авторитетные рекомендации по первой помощи этого не советуют; такие действия могут задержать помощь.",
        ],
      },
      {
        heading: "Насколько опасны скорпионы Грузии?",
        paragraphs: [
          "В [атласе скорпионов Грузии](/scorpions) представлены четыре вида: [Mesobuthus eupeus](mesobuthus-eupeus), [Olivierus caucasicus](olivierus-caucasicus), [Euscorpius italicus](euscorpius-italicus) и [Euscorpius mingrelicus](euscorpius-mingrelicus). Это сведения о присутствии видов, а не статистика тяжести уколов в Грузии.",
          "Старое турецкое клиническое исследование и иранская работа о виде использовали доревизионное название Mesobuthus eupeus; читать их следует осторожно: ревизия 2022 года ограничила современное узкое понимание вида Кавказом. Старые случаи нельзя напрямую переносить на грузинские популяции. Надёжных клинических данных из Грузии с точным определением O. caucasicus, E. italicus и E. mingrelicus также мало. Несколько итальянских случаев Euscorpius дают лишь контекст на уровне рода. Отсутствие найденных тяжёлых грузинских случаев не доказывает безвредность вида.",
        ],
      },
      {
        heading: "Скорпион кусает или жалит?",
        paragraphs: [
          "Яд вводится жалом на конце хвоста, а не клешнями. В разговорной речи это нередко называют укусом скорпиона. Выбор первой помощи от названия не зависит.",
        ],
      },
      {
        heading: "Когда появляются симптомы?",
        paragraphs: [
          "Местная боль может появиться быстро, но дальнейшее течение зависит от вида и человека. Единого безопасного времени ожидания нет. Если возникают симптомы вне места укола или состояние быстро ухудшается, обращайтесь за экстренной помощью, не дожидаясь определённого часа.",
        ],
      },
      {
        heading: "Возможна ли аллергическая реакция?",
        paragraphs: [
          "Общее действие яда и аллергическая реакция — разные процессы. Крапивница, отёк лица или горла, затруднение дыхания или обморок после укола могут быть признаками тяжёлой аллергии. В Грузии звоните 112.",
        ],
      },
      {
        heading: "Нужно ли противоядие?",
        paragraphs: [
          "Противоядие требуется не при каждом уколе скорпиона. В некоторых странах при тяжёлых случаях используют препарат, подходящий для вида и региона; решение принимает врач. Мы не подтвердили наличие конкретного препарата или универсальной схемы в Грузии. Лечение для другого вида Mesobuthus нельзя автоматически переносить на M. eupeus.",
        ],
      },
      {
        heading: "Как помогают в больнице?",
        paragraphs: [
          "Врачи оценивают симптомы и при необходимости наблюдают пациента, облегчают симптомы или контролируют дыхание и работу сердца. Помощь зависит от состояния и местных возможностей; выбор лекарств и противоядия остаётся за специалистами.",
        ],
      },
    ],
    summary:
      "Тяжесть укола зависит от вида скорпиона и симптомов. Отойдите от животного, промойте место водой с мылом, приложите прохладный компресс и следите за общим состоянием. Не накладывайте тугой жгут, не разрезайте кожу и не отсасывайте яд. При затруднении дыхания, потере сознания или быстром ухудшении в Грузии звоните 112; по другим тревожным вопросам обратитесь к врачу.",
    title: "Укус скорпиона: насколько опасен и что делать?",
  },
  tr: {
    description:
      "Akrep sokmasından sonra ne yapmalı? Güvenli ilk adımları, uyarı belirtilerini, Gürcistan'da doktora ne zaman başvurulacağını ve 112'nin ne zaman aranacağını öğrenin.",
    faq: [
      {
        answer:
          "Ağrı için beze sarılı serin kompres kullanın. Sokulan bölgeyi buzlu suya sokmayın.",
        question: "Buz kullanılabilir mi?",
      },
      {
        answer:
          "Hayır. Güvenliyse uzaktan fotoğraf çekin. Yakalamak ikinci bir sokmaya ve yardımın gecikmesine yol açabilir.",
        question: "Türü belirlemek için akrebi yakalamalı mıyım?",
      },
      {
        answer:
          "Hayır. Bölgeyi kesmeyin ve zehri emmeye çalışmayın. Deriyi yıkayın, gerektiğinde tıbbi yardım alın.",
        question: "Zehri evde emebilir miyim?",
      },
      {
        answer:
          "Tek başına yerel ağrı her zaman acil çağrı gerektirmez. Şiddetli, yayılan veya artan ağrıda tıbbi görüş alın; solunum güçlüğü veya başka ciddi genel belirtilerde 112'yi arayın.",
        question: "Yalnızca yerel ağrı varsa 112 aranmalı mı?",
      },
    ],
    intro:
      "Akrep sokması yalnızca yerel ağrıya yol açabilir, ancak şiddet tür ve kişinin durumuna bağlıdır. Akrepten uzaklaşın, bölgeyi sabun ve suyla yıkayın, serin kompres uygulayın. Bölgeyi kesmeyin veya zehri emmeye çalışmayın. Solunum güçlüğü, bilinç kaybı veya hızla kötüleşen genel belirtilerde Gürcistan'da 112'yi arayın.",
    metaTitle: "Akrep sokması: tehlike belirtileri ve ilk adımlar",
    sections: [
      {
        heading: "Akrep sokması ne kadar tehlikeli?",
        paragraphs: [
          "Sokulan yerde ağrı veya yanma, karıncalanma veya uyuşma, hafif şişlik ya da sıcaklık olabilir. Bazı akrepler sokma yeri dışında da belirtilere neden olabilir. Şiddet her türde ve her kişide aynı değildir.",
          "Solunum güçlüğü, istemsiz kas hareketleri, olağandışı göz veya baş hareketleri, salya artışı, belirgin terleme, tekrarlayan kusma veya artan huzursuzluğa dikkat edin. Yalnızca ağrının şiddetiyle tür ya da zehirlenmenin derecesi belirlenemez.",
        ],
      },
      {
        heading: "112 ne zaman aranmalı?",
        paragraphs: [
          "Solunum güçlüğü, bilinç kaybı, kafa karışıklığı, şiddetli kas spazmları veya hızla kötüleşen belirtilerde acil yardım gerekir: Gürcistan'da 112'yi arayın. Yüz veya boğaz şişmesi de acil bir belirtidir.",
          "Bu belirtiler yoksa ancak ağrı şiddetliyse, yayılıyorsa, geçmiyorsa veya başka belirtiler kaygı veriyorsa zamanında tıbbi görüş alın. 112 genel bilgi hattı değil, acil yardım numarasıdır.",
        ],
      },
      {
        heading: "İlk dakikalarda ne yapmalı?",
        list: {
          items: [
            "Sokulan bölgeyi nazikçe sabun ve suyla yıkayın.",
            "Ağrı için beze sarılı serin kompres uygulayın; bölgeyi buzlu suya sokmayın.",
            "Kol veya bacak sokulduysa uzvu dinlendirip rahatça destekleyin. Sokma yeri dışındaki belirtileri izleyin.",
            "Yardımı geciktirmeyecekse akrebi yalnızca güvenli mesafeden fotoğraflayın. Elle tutmayın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Önce güvenli bir yere geçin. İlk yardım ağrıyı hafifletmeye ve değişiklikleri fark etmeye yöneliktir; uyarı belirtileri varsa tıbbi değerlendirmenin yerini tutmaz.",
        ],
      },
      {
        heading: "Bir çocuk sokulursa ne yapmalı?",
        paragraphs: [
          "Tıbben önemli akrep zehri çocukları daha ağır etkileyebilir. Çocuk sokulduysa gecikmeden tıbbi görüş alın; solunumunu ve genel durumunu dikkatle izleyin. Olağandışı hareketler, salya artışı ve belirgin huzursuzluk kaygı vericidir.",
          "Acil belirtilerde 112'yi arayın. Bu, Gürcistan'daki her akrep sokmasının çocuklarda ağır olduğu anlamına gelmez; yerel türlere ilişkin klinik veriler sınırlıdır.",
        ],
      },
      {
        heading: "Neler yapılmamalı?",
        paragraphs: [
          "Bölgeyi kesmeyin veya yakmayın; zehri emmeye ya da elle çıkarmaya çalışmayın. Sıkı turnike uygulamayın; Poison Control akrep sokmalarında bunu açıkça önermiyor. Kendi kararınızla uyku ilacı veya sakinleştirici almayın.",
          "Tıbbi bakımın yerine ev yapımı karışım veya kimyasal madde sürmeyin. Güvenilir ilk yardım kaynakları bunları önermez; yardım almayı da geciktirebilirler.",
        ],
      },
      {
        heading: "Gürcistan'daki akrepler ne kadar tehlikeli?",
        paragraphs: [
          "[Gürcistan akrep atlasında](/scorpions) dört tür yer alır: [Mesobuthus eupeus](mesobuthus-eupeus), [Olivierus caucasicus](olivierus-caucasicus), [Euscorpius italicus](euscorpius-italicus) ve [Euscorpius mingrelicus](euscorpius-mingrelicus). Bu, türlerin varlığına ilişkin kayıttır; Gürcistan'daki sokma şiddeti istatistiği değildir.",
          "Eski bir Türk klinik çalışması ve İran tür araştırması revizyon öncesi Mesobuthus eupeus adını kullandı; bunlar dikkatle yorumlanmalı: 2022 revizyonu türün güncel dar kapsamını Kafkasya ile sınırladı. Eski geniş ad altındaki olgular doğrudan Gürcistan popülasyonlarına uygulanamaz. O. caucasicus, E. italicus ve E. mingrelicus için de Gürcistan'dan güvenilir, türü belirlenmiş klinik veri azdır. İtalya'daki birkaç Euscorpius olgusu ancak cins düzeyinde bağlam sağlar. Ağır Gürcü olgusu bulunamaması bir türün zararsızlığını kanıtlamaz.",
        ],
      },
      {
        heading: "Akrep ısırır mı, sokar mı?",
        paragraphs: [
          "Zehir, kıskaçlarla değil kuyruğun ucundaki iğneyle verilir. Günlük dilde ısırık da denebilir. İlk yardım kararı kullanılan sözcüğe bağlı değildir.",
        ],
      },
      {
        heading: "Belirtiler ne zaman başlar?",
        paragraphs: [
          "Yerel ağrı çabuk hissedilebilir, ancak ilerleme tür ve kişiye göre değişir. Herkes için geçerli güvenli bir bekleme süresi yoktur. Sokma yeri dışında belirtiler gelişirse veya kişi hızla kötüleşirse belirli bir saati beklemeden acil yardım alın.",
        ],
      },
      {
        heading: "Alerjik reaksiyon olabilir mi?",
        paragraphs: [
          "Zehrin genel etkileri ile alerjik reaksiyon aynı süreç değildir. Sokmadan sonra kurdeşen, yüz veya boğaz şişmesi, solunum güçlüğü ya da bayılma ağır alerjik reaksiyona işaret edebilir. Gürcistan'da 112'yi arayın.",
        ],
      },
      {
        heading: "Antivenom gerekir mi?",
        paragraphs: [
          "Her akrep sokmasında antivenom gerekmez. Bazı ülkelerde ağır olgularda tür ve bölgeye uygun antivenom kullanılabilir; buna hekim karar verir. Gürcistan'da belirli bir stok veya evrensel uygulama doğrulanmış değildir. Başka bir Mesobuthus türüne yönelik tedavi M. eupeus için otomatik olarak geçerli sayılamaz.",
        ],
      },
      {
        heading: "Hastanede nasıl yardım edilir?",
        paragraphs: [
          "Hekimler belirtileri değerlendirir; gerekirse kişiyi gözlemler, belirtileri hafifletir veya solunum ve kalp işlevini izler. Bakım klinik duruma ve yerel olanaklara bağlıdır; ilaç ve antivenom kararları sağlık uzmanlarına aittir.",
        ],
      },
    ],
    summary:
      "Sokmanın şiddeti türe ve belirtilere bağlıdır. Akrepten uzaklaşın, bölgeyi sabun ve suyla yıkayın, serin kompres uygulayın ve genel durumu izleyin. Sıkı turnike uygulamayın, deriyi kesmeyin ve zehri emmeyin. Solunum güçlüğü, bilinç kaybı veya hızla kötüleşen genel belirtilerde Gürcistan'da 112'yi arayın; diğer kaygılarda tıbbi görüş alın.",
    title: "Akrep sokması: ne kadar tehlikeli ve ne yapmalı?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "112 Georgia — When to call",
    supports: {
      en: "112 is Georgia's emergency number, not a general information line.",
      ka: "112 საქართველოში გადაუდებელი სამედიცინო დახმარების ნომერია და ზოგადი ინფორმაციისთვის არ გამოიყენება.",
      ru: "112 — номер экстренной помощи в Грузии, не общая справочная служба.",
      tr: "112, Gürcistan'ın acil yardım numarasıdır; genel bilgi hattı değildir.",
    },
    url: "https://112.gov.ge/?page_id=274",
  },
  {
    name: "Mayo Clinic — Scorpion sting: symptoms and causes",
    supports: {
      en: "Local and systemic symptoms, children's vulnerability, allergy signs, and venom delivery by the tail stinger.",
      ka: "ადგილობრივი და საერთო სიმპტომები, ბავშვების მომატებული მოწყვლადობა, ალერგიის ნიშნები და ნესტრით შხამის შეყვანა.",
      ru: "Местные и общие симптомы, уязвимость детей, признаки аллергии и введение яда жалом на хвосте.",
      tr: "Yerel ve genel belirtiler, çocukların duyarlılığı, alerji belirtileri ve kuyruğun iğnesiyle zehir verilmesi.",
    },
    url: "https://www.mayoclinic.org/diseases-conditions/scorpion-stings/symptoms-causes/syc-20353859",
  },
  {
    name: "Mayo Clinic — Scorpion sting: diagnosis and treatment",
    supports: {
      en: "Soap-and-water cleaning, a cool compress, limb rest, avoiding sedatives, and clinician-led treatment.",
      ka: "საპნითა და წყლით დაბანა, გრილი საფენი, კიდურის დასვენება, დამამშვიდებლებისგან თავის შეკავება და ექიმის მიერ მკურნალობის შერჩევა.",
      ru: "Промывание водой с мылом, прохладный компресс, покой конечности, отказ от седативных и выбор лечения врачом.",
      tr: "Sabun ve suyla yıkama, serin kompres, uzvu dinlendirme, sakinleştiricilerden kaçınma ve hekim kararıyla tedavi.",
    },
    url: "https://www.mayoclinic.org/diseases-conditions/scorpion-stings/diagnosis-treatment/drc-20353865",
  },
  {
    name: "CDC/NIOSH — Insects and scorpions at work",
    supports: {
      en: "Respiratory and neurological warning signs, remaining calm, and avoiding ice-water immersion.",
      ka: "სუნთქვისა და ნერვული სისტემის საყურადღებო ნიშნები, სიმშვიდე და ყინულოვან წყალში ჩაყობისგან თავის შეკავება.",
      ru: "Дыхательные и неврологические тревожные признаки, спокойствие и отказ от погружения в ледяную воду.",
      tr: "Solunum ve nörolojik uyarı belirtileri, sakin kalma ve buzlu suya sokmama.",
    },
    url: "https://www.cdc.gov/niosh/outdoor-workers/about/insects-and-scorpions.html",
  },
  {
    name: "Poison Control — Are scorpions venomous?",
    supports: {
      en: "Soap-and-water cleaning, care for systemic symptoms, and the warning against tourniquets.",
      ka: "საპნითა და წყლით დაბანა, საერთო სიმპტომებისას სამედიცინო დახმარება და მჭიდრო ტურნიკეტის აკრძალვა.",
      ru: "Промывание водой с мылом, помощь при общих симптомах и запрет на тугой жгут.",
      tr: "Sabun ve suyla yıkama, genel belirtilerde tıbbi bakım ve turnikeden kaçınma.",
    },
    url: "https://www.poison.org/articles/scorpions",
  },
  {
    name: "Joint Trauma System — Spider and Scorpion Envenomation (2026)",
    supports: {
      en: "Avoiding incision, cautery, and tight tourniquets; clinical assessment of serious envenomation.",
      ka: "ჩხვლეტის გაჭრის, მოწვისა და მჭიდრო ტურნიკეტის თავიდან აცილება; მძიმე შემთხვევების კლინიკური შეფასება.",
      ru: "Отказ от разреза, прижигания и тугого жгута; клиническая оценка тяжёлых случаев.",
      tr: "Kesme, yakma ve sıkı turnikeden kaçınma; ağır olguların klinik değerlendirmesi.",
    },
    url: "https://jts.health.mil/assets/docs/cpgs/Spider_and_Scorpion_Envenomation_21_Jul_2026_ID84_v1.pdf",
  },
  {
    name: "Mebs 2006 — First aid for venomous animal bites and stings",
    supports: {
      en: "Avoiding wound cutting and venom suction after venomous animal injuries.",
      ka: "შხამიანი ცხოველის დაზიანების ადგილზე გაჭრისა და შხამის ამოწოვისგან თავის შეკავება.",
      ru: "Отказ от разреза раны и отсасывания яда после контакта с ядовитыми животными.",
      tr: "Zehirli hayvan yaralanmalarında yarayı kesmekten ve zehri emmekten kaçınma.",
    },
    url: "https://pubmed.ncbi.nlm.nih.gov/16875375/",
  },
  {
    name: "Joint Trauma System — Aeromedical Evacuation Medical Operating Guidelines (2025)",
    supports: {
      en: "Avoiding cutting, suction, electric shock, cautery, and chemicals at the envenomation site.",
      ka: "ჩხვლეტის ადგილზე გაჭრის, ამოწოვის, ელექტროშოკის, მოწვისა და ქიმიკატების გამოყენების აკრძალვა.",
      ru: "Отказ от разреза, отсасывания, электрического тока, прижигания и химических средств в месте укола.",
      tr: "Sokma yerinde kesme, emme, elektrik, yakma ve kimyasal kullanmama.",
    },
    url: "https://jts.health.mil/assets/docs/cpgs/US_Army_Aeromedical_Evacuation_Standard_Medical_Operating_Guidelines_26NOV2025.pdf",
  },
  {
    name: "MedlinePlus — Scorpions",
    supports: {
      en: "Photographing a scorpion only if safe and avoiding additional injury.",
      ka: "მორიელის მხოლოდ უსაფრთხოდ გადაღება და მეორე ჩხვლეტის რისკის თავიდან აცილება.",
      ru: "Фотографировать скорпиона лишь безопасным способом, не рискуя повторной травмой.",
      tr: "Akrebi yalnızca güvenliyse fotoğraflama ve yeni yaralanmadan kaçınma.",
    },
    url: "https://medlineplus.gov/ency/article/002850.htm",
  },
  {
    name: "American Heart Association and American Red Cross — 2024 First Aid Guidelines",
    supports: {
      en: "Systemic emergency signs, medical-assessment thresholds, and cold for pain; the guideline is scoped to North America.",
      ka: "მორიელის ჩხვლეტისას გადაუდებელი საერთო ნიშნები, სამედიცინო შეფასების ზღვრები და სიცივის გამოყენება ტკივილისთვის; რეკომენდაციები ჩრდილოეთ ამერიკას ეხება.",
      ru: "Общие экстренные признаки, основания для осмотра и холод для боли; рекомендации относятся к Северной Америке.",
      tr: "Genel acil belirtiler, tıbbi değerlendirme eşikleri ve ağrı için soğuk; kılavuz Kuzey Amerika kapsamındadır.",
    },
    url: "https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines",
  },
  {
    name: "Ilia State University — Georgian Biodiversity Database: Scorpiones",
    supports: {
      en: "The four scorpion species recorded in the Georgian biodiversity database; it does not grade clinical severity.",
      ka: "საქართველოში ატლასში წარმოდგენილი ოთხი მორიელის სახეობის სია; კლინიკურ სიმძიმეს არ აფასებს.",
      ru: "Четыре вида скорпионов в грузинской базе биоразнообразия; клиническую тяжесть база не оценивает.",
      tr: "Gürcistan biyoçeşitlilik veritabanındaki dört akrep türü; klinik şiddeti değerlendirmez.",
    },
    url: "https://biodiversity.iliauni.edu.ge/en/order/scorpiones",
  },
  {
    name: "Kovařík et al. 2022 — Revision of Mesobuthus",
    supports: {
      en: "The modern narrow Mesobuthus eupeus concept is restricted to the Caucasus; older broad-name clinical reports cannot simply be transferred.",
      ka: "Mesobuthus eupeus-ის თანამედროვე ვიწრო გაგება კავკასიითაა შემოსაზღვრული; ძველი ფართო სახელით გამოქვეყნებული კლინიკური მონაცემების გადმოტანა სარისკოა.",
      ru: "Современное узкое понимание Mesobuthus eupeus ограничено Кавказом; старые клинические данные под широким названием нельзя переносить напрямую.",
      tr: "Mesobuthus eupeus türünün güncel dar kapsamı Kafkasya ile sınırlıdır; eski geniş ad altındaki klinik raporlar doğrudan aktarılamaz.",
    },
    url: "https://mds.marshall.edu/euscorpius/vol2022/iss348/1/",
  },
  {
    name: "Özkan & Kat 2005 — Mesobuthus eupeus scorpionism in Şanlıurfa",
    supports: {
      en: "An older Turkish clinical report under the pre-revision Mesobuthus eupeus name; it is not a Georgian severity estimate.",
      ka: "ძველი თურქული კლინიკური ანგარიში Mesobuthus eupeus-ის რევიზიამდელი სახელით; საქართველოს სიმძიმის შეფასება არ არის.",
      ru: "Старое турецкое клиническое исследование под доревизионным названием Mesobuthus eupeus; не оценивает тяжесть в Грузии.",
      tr: "Revizyon öncesi Mesobuthus eupeus adıyla Türk klinik raporu; Gürcistan'daki şiddeti göstermez.",
    },
    url: "https://doi.org/10.1590/S1678-91992005000400008",
  },
  {
    name: "Mohammadi Bavani et al. 2021 — Mesobuthus eupeus in northwestern Iran",
    supports: {
      en: "An Iranian paper using the older broad Mesobuthus eupeus concept; it cannot establish severity for Georgian populations.",
      ka: "ირანული ნაშრომი Mesobuthus eupeus-ის ძველი ფართო გაგებით; საქართველოს პოპულაციის სიმძიმეს ვერ ადგენს.",
      ru: "Иранская работа в рамках прежнего широкого понимания Mesobuthus eupeus; не определяет тяжесть для грузинских популяций.",
      tr: "Eski geniş Mesobuthus eupeus kavramını kullanan İran çalışması; Gürcistan popülasyonlarının şiddetini belirlemez.",
    },
    url: "https://pubmed.ncbi.nlm.nih.gov/34824751/",
  },
  {
    name: "Rodrigo & Gnanathasan 2017 — Management of scorpion envenoming",
    supports: {
      en: "Treatment evidence is species- and geography-specific; antivenom findings cannot simply be transferred to another region.",
      ka: "მკურნალობის კვლევების შედეგების სახეობასა და გეოგრაფიაზე დამოკიდებულება; ერთი რეგიონის ანტიშხამის სქემის სხვაგან გადატანა არ შეიძლება.",
      ru: "Данные о лечении зависят от вида и региона; результаты по противоядию нельзя переносить напрямую.",
      tr: "Tedavi kanıtları tür ve bölgeye özgüdür; antivenom sonuçları başka bölgeye doğrudan aktarılamaz.",
    },
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5385045/",
  },
  {
    name: "Dutto et al. — Euscorpius stings in northwestern Italy",
    supports: {
      en: "Three Italian Euscorpius sting cases; they are not evidence of clinical severity for Georgian cases or species.",
      ka: "იტალიური Euscorpius-ის სამი ჩხვლეტის კლინიკური აღწერა; საქართველოს სახეობებისა და შემთხვევების შეფასება არ არის.",
      ru: "Три итальянских случая уколов Euscorpius; не дают оценки тяжести для грузинских видов и случаев.",
      tr: "İtalya'dan üç Euscorpius sokması olgusu; Gürcistan türleri veya olgularının klinik şiddetini göstermez.",
    },
    url: "https://www.scielo.br/j/jvatitd/a/Vf99sG5zvzFWqMfB7LyGsmg/?format=html&lang=en",
  },
];

export const SCORPION_STING = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Scorpion on a stone floor at a distance from a shoe — illustrative image",
      ka: "ქვის იატაკზე მორიელი ფეხსაცმლისგან მოშორებით — ილუსტრაციული გამოსახულება",
      ru: "Скорпион на каменном полу вдали от обуви — иллюстративное изображение",
      tr: "Taş zeminde ayakkabıdan uzakta akrep — temsili görsel",
    },
    height: 1024,
    src: "/images/guides/scorpion-sting-hero.jpg",
    width: 1536,
  },
  id: "scorpion-sting",
  messageKey: "scorpionSting",
  ogImage: "/og/images/guides/scorpion-sting.jpg",
  parentHub: "scorpions",
  pathname: "/scorpions/morielis-nakbeni",
  relatedSpeciesIds: [
    "mesobuthus-eupeus",
    "olivierus-caucasicus",
    "euscorpius-italicus",
    "euscorpius-mingrelicus",
  ],
  search: {
    icon: "safety",
    keywords: [
      "მორიელის ნაკბენი",
      "მორიელის ნესტარი",
      "მორიელის შხამი",
      "ჭრელი მორიელის ნაკბენი",
      "morielis nakbeni",
      "scorpion sting",
      "scorpion bite",
      "укус скорпиона",
      "akrep sokması",
      "112",
    ],
    rank: 5,
    subtitle: {
      en: "Symptoms, first steps, and when emergency help is needed",
      ka: "სიმპტომები, პირველადი ნაბიჯები და როდის არის საჭირო გადაუდებელი დახმარება",
      ru: "Симптомы, первые действия и когда нужна экстренная помощь",
      tr: "Belirtiler, ilk adımlar ve ne zaman acil yardım gerektiği",
    },
    title: {
      en: "Scorpion sting",
      ka: "მორიელის ნაკბენი",
      ru: "Укус скорпиона",
      tr: "Akrep sokması",
    },
  },
  sources: SOURCES,
});
