import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "bee" | "hornet" | "wasp";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    comparison: {
      cards: [
        {
          caveat: "This photo cannot establish a breed or subspecies.",
          features: [
            "Dense hair covers the middle of the body.",
            "The abdomen has brownish and dark bands.",
            "A wing lies over the body.",
          ],
          image: "bee",
          label: "Bee",
          taxon: "Apis mellifera — western honey bee",
        },
        {
          caveat: "This is one wasp example; other wasps may look different.",
          features: [
            "The black-and-yellow abdomen joins the middle of the body at a narrow point.",
            "Long, slender legs are clearly visible.",
            "The body looks less densely hairy than the bee in this comparison.",
          ],
          image: "wasp",
          label: "Another wasp",
          taxon: "Polistes dominula — a paper wasp",
        },
        {
          caveat: "These marks describe this species, not every hornet.",
          features: [
            "The head is reddish brown with a yellowish face.",
            "The middle of the body looks dark and reddish brown.",
            "Yellow and dark markings alternate on the abdomen.",
          ],
          image: "hornet",
          label: "Hornet",
          taxon: "Vespa crabro — European hornet",
        },
      ],
      heading: "Quick photo comparison",
      intro:
        "Compare several marks together. A hornet is also a wasp; it is shown separately here so you can compare its appearance with another wasp.",
      scaleNote:
        "The photos are not to scale. Display size does not show the insects' real size ratio.",
    },
    description:
      "Bee, wasp or hornet? Compare real photos and visible features, learn when a species cannot be identified, and see how to observe safely from a distance.",
    faq: [
      {
        answer:
          "Yes. Hornets of the genus Vespa belong to the wasp family Vespidae. We show one separately here to make the visual comparison easier.",
        question: "Is a hornet a wasp?",
      },
      {
        answer:
          "No. Bees and bee-like flies can also show those colours. Compare body shape, hair, head and legs together.",
        question: "Is every black-and-yellow insect a wasp?",
      },
      {
        answer:
          "No. Photo scale may be unknown, and wasps vary in size. In this example, the hornet's head colour and abdominal pattern offer additional clues.",
        question: "Is every large insect a hornet?",
      },
      {
        answer:
          "No. Bees, wasps and bee-like flies all visit flowers. A flower visit is context, not an identification.",
        question: "Is an insect on a flower always a bee?",
      },
      {
        answer:
          "A blurred image or a hidden head or body junction may allow only a group-level identification. Close relatives can remain unresolved even in a clear single shot.",
        question: "Why can't one photo always identify the species?",
      },
      {
        answer:
          "Use camera zoom and keep your distance. Take extra clear views only when safe; never approach a nest for a better picture.",
        question: "How can I photograph one without moving closer?",
      },
    ],
    intro:
      "Colour or size alone will not identify an insect in a photo. Start with these three real examples: compare body shape, hair, head and legs, then notice what the frame leaves out.",
    metaTitle: "Bee, wasp or hornet? Compare real photos and field marks",
    sections: [
      {
        heading: "Which features should you compare?",
        list: {
          items: [
            "Overall shape: in these shots the bee looks rounder, Polistes more elongated, and Vespa crabro has a more substantial head and middle section.",
            "Hair: the bee shows dense hair. Wasps can have hair too, so this mark alone is not decisive.",
            "Colour and junction: compare where colours fall on the head, middle section and abdomen, and whether their narrow connection is visible.",
            "Legs and head: the slim legs of Polistes and the reddish head of Vespa crabro add useful clues in these photos.",
          ],
        },
        paragraphs: [
          "Use each feature together with the others. If a body part is hidden, do not treat its absence from the frame as evidence.",
        ],
      },
      {
        heading: "Why can bees resemble some wasps?",
        paragraphs: [
          "Honey bees and some wasps both have abdominal bands. Black and yellow alone confirms neither group. In these photos, the bee's middle section is more densely hairy; Polistes is more elongated and its legs show clearly.",
          "Being on a flower is not decisive either: bees, wasps and lookalike flies visit flowers. Turning up near sweet food is only behavioural context. A narrow 'waist' on its own is not enough.",
        ],
      },
      {
        heading: "How does this hornet differ from the other wasp?",
        paragraphs: [
          "In this pair, Polistes dominula is an elongated black-and-yellow wasp. The Vespa crabro photo shows a reddish-brown head, dark middle section and yellow-and-dark abdomen. These are comparison clues, not a rule for every hornet.",
          "A hornet may look larger, but these separate images do not establish real size. Framing and magnification change the apparent scale; use size only alongside other marks.",
        ],
      },
      {
        heading: "What other insects can look similar?",
        paragraphs: [
          "Bees of the genus Bombus are another example: many look rounded and very hairy. The honey bee shown here does not represent every bee.",
          "Some flower-visiting hover flies resemble bees or wasps and have black-and-yellow markings. When the head, wings or another needed detail is hidden, avoid a quick group label.",
        ],
      },
      {
        heading: "When is one photo not enough?",
        paragraphs: [
          "Blur, a tiny subject, a hidden head or abdomen, and lighting that shifts colour all limit identification. A feature needed to separate close species may be missing; actual size is often unknown.",
          "Recognising a broad group differs from naming a species. 'Looks more like a bee', 'a wasp, but species uncertain', or 'not enough to tell' can be the right answer.",
        ],
      },
      {
        heading: "How can you photograph one safely?",
        list: {
          items: [
            "Keep your distance and use camera zoom.",
            "Take several sharp angles only when doing so is safe.",
            "Record the place and date, and keep the original file.",
            "Do not touch or catch an unknown insect or provoke it to test its behaviour.",
            "Do not approach a nest or use bait solely to get a closer photo.",
          ],
        },
        paragraphs: [
          "Photo quality never outweighs safety. If the insect or nest is close to you, stop observing and move away.",
        ],
      },
      {
        heading: "Found a nest?",
        paragraphs: [
          "This guide compares the insects themselves. For behaviour and risk around a nest, see [Wasp nest near your home: how dangerous is it?](/insects/krazanis-bude). A nest photo does not always identify its builders.",
        ],
      },
    ],
    summary:
      "Compare several visible features together: body shape, hair, head colour, legs and abdominal pattern. These photos are not to scale, and a single shot cannot always establish a species. Do not touch an unknown insect; photograph it only from a safe distance.",
    title: "Bee, wasp or hornet — how can photos help tell them apart?",
  },
  ka: {
    comparison: {
      cards: [
        {
          caveat: "ამ ფოტოთი ფუტკრის ჯიშს ან ქვესახეობას ვერ ვადგენთ.",
          features: [
            "სხეულის შუა ნაწილი მკვრივი ბუსუსითაა დაფარული.",
            "მუცელზე მოყავისფრო და მუქი ზოლები ჩანს.",
            "ფრთა სხეულის ზემოთაა გადაფარებული.",
          ],
          image: "bee",
          label: "ფუტკარი",
          taxon: "Apis mellifera — თაფლის ფუტკარი",
        },
        {
          caveat:
            "ეს ერთი კრაზანის მაგალითია; ყველა კრაზანა ასე არ გამოიყურება.",
          features: [
            "შავ-ყვითელი მუცელი სხეულის შუა ნაწილს ვიწროდ უკავშირდება.",
            "გრძელი, წვრილი ფეხები კარგად ჩანს.",
            "ტანი ამ ფუტკრის ფოტოსთან შედარებით ნაკლებად ბუსუსიანია.",
          ],
          image: "wasp",
          label: "სხვა კრაზანა",
          taxon: "Polistes dominula — ქაღალდის კრაზანის მაგალითი",
        },
        {
          caveat:
            "ეს ნიშნები ამ სახეობის მაგალითს აღწერს და ყველა ონავარზე არ ვრცელდება.",
          features: [
            "თავი მოყავისფრო-მოწითალოა, სახის ნაწილი კი მოყვითალო.",
            "სხეულის შუა ნაწილი მუქი, მოწითალო-ყავისფერი ჩანს.",
            "მუცელზე ყვითელი და მუქი ნახატი მონაცვლეობს.",
          ],
          image: "hornet",
          label: "ონავარი",
          taxon: "Vespa crabro — ჩვეულებრივი ონავარი",
        },
      ],
      heading: "სწრაფი შედარება ფოტოებით",
      intro:
        "დააკვირდით რამდენიმე ნიშანს ერთად. ონავარიც კრაზანების ჯგუფს მიეკუთვნება; აქ ცალკე ჩანს, რომ მისი გარეგნობა სხვა კრაზანის მაგალითს შეადაროთ.",
      scaleNote:
        "ფოტოები ერთ მასშტაბში არ არის. სურათებზე გამოსახული ზომები მწერების რეალურ ზომათა თანაფარდობას არ აჩვენებს.",
    },
    description:
      "ფუტკარი, კრაზანა თუ ონავარი? შეადარეთ რეალური ფოტოები და ხილული ნიშნები, გაიგეთ, როდის ვერ დგინდება სახეობა და როგორ დააკვირდეთ უსაფრთხოდ.",
    faq: [
      {
        answer:
          "დიახ. ონავარი Vespa-ს გვარს ეკუთვნის, ეს გვარი კი კრაზანასებრთა ოჯახშია. გვერდზე ის ცალკე ჩანს მხოლოდ შედარების გასამარტივებლად.",
        question: "ონავარიც კრაზანაა?",
      },
      {
        answer:
          "არა. ამ ფერებს ფუტკრებიც და მათი მსგავსი ბუზებიც შეიძლება ატარებდნენ. ჯერ სხეულის ფორმა, ბუსუსი, თავი და ფეხები ერთად შეადარეთ.",
        question: "ყველა შავ-ყვითელი მწერი კრაზანაა?",
      },
      {
        answer:
          "არა. ფოტოს მასშტაბი უცნობი შეიძლება იყოს და სხვადასხვა კრაზანის ზომაც იცვლება. ამ მაგალითში ონავარს თავის ფერიც და მუცლის ნახატიც გამოარჩევს.",
        question: "დიდი მწერი აუცილებლად ონავარია?",
      },
      {
        answer:
          "არა. ყვავილებს ფუტკრები, კრაზანები და მათ მსგავსი ბუზებიც სტუმრობენ. ყვავილზე ჯდომა მხოლოდ ქცევის მინიშნებაა.",
        question: "ყვავილზე მჯდომი მწერი აუცილებლად ფუტკარია?",
      },
      {
        answer:
          "თუ თავი ან სხეულის შეერთება დაფარულია, კადრი ბუნდოვანია ან დეტალი ძალიან პატარაა, შეიძლება მხოლოდ ჯგუფის ამოცნობა შევძლოთ. ახლო სახეობებისთვის ერთი მკაფიო კადრიც ზოგჯერ არ კმარა.",
        question: "რატომ ვერ ვადგენთ ყოველთვის სახეობას ერთი ფოტოდან?",
      },
      {
        answer:
          "გამოიყენეთ კამერის ზუმი, შეინარჩუნეთ დისტანცია და რამდენიმე მკაფიო კადრი მხოლოდ უსაფრთხო ადგილიდან გადაიღეთ. ბუდეს უკეთესი კადრისთვის ნუ მიუახლოვდებით.",
        question: "როგორ გადავიღოთ ფოტო მიახლოების გარეშე?",
      },
    ],
    intro:
      "ფოტოზე მწერის გასარჩევად ერთი ფერი ან ზომა არ კმარა. ქვემოთ სამი რეალური მაგალითია — შეადარეთ სხეულის ფორმა, ბუსუსი, თავი და ფეხები, შემდეგ გაითვალისწინეთ, რა არ ჩანს კადრში.",
    metaTitle: "ფუტკარი, კრაზანა თუ ონავარი? განსხვავებები ფოტოებით",
    sections: [
      {
        heading: "რომელ ნიშნებს შევადაროთ?",
        list: {
          items: [
            "საერთო ფორმა: ამ სამ კადრში ფუტკარი უფრო მომრგვალოა, Polistes უფრო წაგრძელებული, ხოლო Vespa crabro-ს თავი და სხეულის შუა ნაწილი უფრო მასიური ჩანს.",
            "ბუსუსი: ამ ფუტკარს მკვრივი ბუსუსი ეტყობა. კრაზანებსაც შეიძლება ჰქონდეთ ბუსუსი, ამიტომ მხოლოდ ამ ნიშნით ნუ გადაწყვეტთ.",
            "ფერი და შეერთება: დააკვირდით, როგორ ნაწილდება ფერი თავზე, სხეულის შუა ნაწილსა და მუცელზე და რამდენად ჩანს მათ შორის ვიწრო ადგილი.",
            "ფეხები და თავი: Polistes-ის წვრილი ფეხები და Vespa crabro-ს მოწითალო თავი ამ ფოტოებზე გამოსადეგი დამატებითი ნიშნებია.",
          ],
        },
        paragraphs: [
          "თითოეული ნიშანი სხვა ნიშნებთან ერთად შეაფასეთ. თუ კადრში რომელიმე ნაწილი დაფარულია, მისი არჩანობა დასკვნად არ აქციოთ.",
        ],
      },
      {
        heading: "რატომ ჰგავს ფუტკარი ზოგ კრაზანას?",
        paragraphs: [
          "თაფლის ფუტკარსა და ზოგი კრაზანის მუცელზე ზოლები აქვს. შავ-ყვითელი შეფერილობა თავისთავად არც ერთ ჯგუფს არ ადასტურებს. ამ ფოტოებზე ფუტკრის შუა ნაწილი უფრო მკვრივადაა ბუსუსიანი, Polistes-ის ტანი კი უფრო წაგრძელებულია და ფეხები უკეთ ჩანს.",
          "ყვავილზე ყოფნაც საბოლოო პასუხს არ იძლევა: იქ ფუტკარიც, კრაზანაც და მათი მსგავსი ბუზიც შეიძლება ნახოთ. ტკბილ საკვებთან გამოჩენაც მხოლოდ ქცევის კონტექსტია. სხეულის ვიწრო „წელიც“ ცალკე საკმარისი არ არის.",
        ],
      },
      {
        heading: "რით განსხვავდება ეს ონავარი სხვა კრაზანისგან?",
        paragraphs: [
          "ამ ორი მაგალითიდან Polistes dominula შავ-ყვითელი, წაგრძელებული კრაზანაა. Vespa crabro-ს კადრში ჩანს მოწითალო-მოყავისფრო თავი, მუქი შუა ნაწილი და ყვითელ-მუქი მუცელი. ეს შესადარებელი ნიშნებია, არა ყველა ონავრის უნივერსალური წესი.",
          "ონავარი ხშირად უფრო დიდად აღიქმება, მაგრამ ამ სურათებით რეალურ ზომას ვერ შეადარებთ. განსხვავებულად მოჭრილი ან გადიდებული კადრი მასშტაბს ცვლის; ზომა მხოლოდ სხვა ნიშნებთან ერთად გამოგადგებათ.",
        ],
      },
      {
        heading: "რომელი სხვა მწერი შეიძლება აგვერიოს?",
        paragraphs: [
          "Bombus-ის გვარის ფუტკრებიც არსებობს: ისინი ხშირად მომრგვალო და ძლიერ ბუსუსიანია. ამიტომ აქ ნაჩვენები თაფლის ფუტკარი ყველა ფუტკრის ნიმუში არ არის.",
          "ზოგი ყვავილზე მჯდომი ბუზი ფუტკარს ან კრაზანას ჰგავს და შავ-ყვითელი ნახატიც აქვს. თუ თავი, ფრთები ან სხვა საჭირო დეტალი კადრში არ ჩანს, „ფუტკარია“ ან „კრაზანაა“ ნაჩქარევად ნუ დაასკვნით.",
        ],
      },
      {
        heading: "როდის არ კმარა ერთი ფოტო?",
        paragraphs: [
          "ბუნდოვანი ფოტო, შორიდან გადაღებული პატარა მწერი, დაფარული თავი ან მუცელი და განათებით შეცვლილი ფერები ამოცნობას ზღუდავს. ახლო სახეობების გასარჩევი დეტალი შეიძლება საერთოდ არ ჩანდეს; ფოტოდან რეალური ზომაც ხშირად უცნობია.",
          "ჯგუფის ამოცნობა და კონკრეტული სახეობის დადგენა სხვადასხვა შედეგია. ზოგჯერ სწორი პასუხია „უფრო ფუტკარს ჰგავს“, „კრაზანაა, მაგრამ სახეობა ვერ დგინდება“ ან „ამ კადრით ვერ გავარჩევთ“.",
        ],
      },
      {
        heading: "როგორ გადავიღოთ გამოსადეგი ფოტო უსაფრთხოდ?",
        list: {
          items: [
            "შეინარჩუნეთ დისტანცია და გამოიყენეთ კამერის ზუმი.",
            "რამდენიმე მკაფიო კადრი სხვადასხვა კუთხით მხოლოდ მაშინ გადაიღეთ, როცა ამის გაკეთება უსაფრთხოა.",
            "ჩაინიშნეთ ადგილი და თარიღი; შეინახეთ ორიგინალი ფოტო.",
            "უცნობ მწერს არ შეეხოთ, არ დაიჭიროთ და მისი ქცევის „შესამოწმებლად“ ნუ გააღიზიანებთ.",
            "ბუდეს უკეთესი ფოტოსთვის ნუ მიუახლოვდებით და სატყუარას მხოლოდ ახლო კადრის მისაღებად ნუ გამოიყენებთ.",
          ],
        },
        paragraphs: [
          "ფოტოს ხარისხი უსაფრთხოებაზე მნიშვნელოვანი არ არის. თუ მწერი ან ბუდე თქვენთან ახლოსაა, დაკვირვება შეწყვიტეთ და მოშორდით.",
        ],
      },
      {
        heading: "ბუდე იპოვეთ?",
        paragraphs: [
          "ეს გვერდი მწერის გარეგნობას ადარებს. ბუდესთან ქცევისა და რისკის შეფასებისთვის იხილეთ [კრაზანის ბუდე: რამდენად საშიშია და როგორ მოვიქცეთ?](/insects/krazanis-bude). ბუდის ფოტოც ყოველთვის ვერ ადგენს სახეობას.",
        ],
      },
    ],
    summary:
      "ფუტკრის, სხვა კრაზანისა და ონავრის გასარჩევად შეადარეთ რამდენიმე ხილული ნიშანი ერთად: სხეულის ფორმა, ბუსუსი, თავის ფერი, ფეხები და მუცლის ნახატი. ფოტოები ერთ მასშტაბში არ არის და ერთი კადრი სახეობას ყოველთვის ვერ ადგენს. უცნობ მწერს არ შეეხოთ; ფოტო მხოლოდ უსაფრთხო მანძილიდან გადაიღეთ.",
    title: "ფუტკარი, კრაზანა თუ ონავარი — როგორ გავარჩიოთ ფოტოებით?",
  },
  ru: {
    comparison: {
      cards: [
        {
          caveat: "По этому снимку нельзя определить породу или подвид пчелы.",
          features: [
            "Средняя часть тела густо покрыта волосками.",
            "На брюшке видны буроватые и тёмные полосы.",
            "Крыло лежит поверх тела.",
          ],
          image: "bee",
          label: "Пчела",
          taxon: "Apis mellifera — медоносная пчела",
        },
        {
          caveat: "Это лишь один пример осы; другие осы могут выглядеть иначе.",
          features: [
            "Чёрно-жёлтое брюшко соединено со средней частью тела узким участком.",
            "Хорошо видны длинные тонкие ноги.",
            "Тело выглядит менее густо опушённым, чем у пчелы на соседнем снимке.",
          ],
          image: "wasp",
          label: "Другая оса",
          taxon: "Polistes dominula — бумажная оса",
        },
        {
          caveat:
            "Эти признаки относятся к данному виду, а не ко всем шершням.",
          features: [
            "Голова рыжевато-коричневая, лицо желтоватое.",
            "Средняя часть тела тёмная с рыжевато-коричневым оттенком.",
            "На брюшке чередуются жёлтые и тёмные участки.",
          ],
          image: "hornet",
          label: "Шершень",
          taxon: "Vespa crabro — шершень обыкновенный",
        },
      ],
      heading: "Быстрое сравнение по фотографиям",
      intro:
        "Сравнивайте несколько признаков сразу. Шершень тоже относится к осам; здесь он показан отдельно, чтобы было проще увидеть отличия от другой осы.",
      scaleNote:
        "Фотографии сняты в разном масштабе. Размер насекомых на экране не показывает их реальные размеры.",
    },
    description:
      "Пчела, оса или шершень? Сравните реальные фотографии и заметные признаки, узнайте, когда вид нельзя определить, и как наблюдать без опасного сближения.",
    faq: [
      {
        answer:
          "Да. Род Vespa относится к семейству настоящих ос Vespidae. Отдельный снимок здесь нужен лишь для наглядного сравнения.",
        question: "Шершень — тоже оса?",
      },
      {
        answer:
          "Нет. Такая окраска бывает и у пчёл, и у похожих на них мух. Смотрите также на форму тела, волоски, голову и ноги.",
        question: "Любое чёрно-жёлтое насекомое — оса?",
      },
      {
        answer:
          "Нет. Масштаб фотографии может быть неизвестен, а размеры ос различаются. У показанного шершня дополнительно заметны окраска головы и рисунок брюшка.",
        question: "Крупное насекомое обязательно шершень?",
      },
      {
        answer:
          "Нет. Цветы посещают пчёлы, осы и похожие на них мухи. Место, где сидит насекомое, не подтверждает его группу.",
        question: "Насекомое на цветке обязательно пчела?",
      },
      {
        answer:
          "Если снимок размыт или голова и соединение частей тела скрыты, порой можно узнать только общую группу. Близкие виды могут остаться неразличимыми и на чётком одиночном кадре.",
        question: "Почему по одному фото не всегда удаётся назвать вид?",
      },
      {
        answer:
          "Пользуйтесь зумом и держитесь на расстоянии. Дополнительные чёткие кадры делайте лишь там, где это безопасно; ради фотографии не приближайтесь к гнезду.",
        question: "Как сфотографировать насекомое издалека?",
      },
    ],
    intro:
      "Одной окраски или размера для определения насекомого недостаточно. Сравните эти три реальных примера: форму тела, волоски, голову и ноги, а затем проверьте, какие детали не попали в кадр.",
    metaTitle: "Пчела, оса или шершень? Сравнение по фотографиям",
    sections: [
      {
        heading: "Какие признаки стоит сравнивать?",
        list: {
          items: [
            "Общая форма: на этих снимках пчела выглядит округлее, Polistes более вытянута, а голова и средняя часть тела Vespa crabro кажутся массивнее.",
            "Волоски: у пчелы заметно густое опушение. У ос тоже бывают волоски, поэтому одного этого признака мало.",
            "Окраска и соединение: сравните рисунок головы, средней части тела и брюшка, а также видимый узкий участок между ними.",
            "Ноги и голова: тонкие ноги Polistes и рыжеватая голова Vespa crabro дают дополнительные подсказки.",
          ],
        },
        paragraphs: [
          "Оценивайте признаки вместе. Если часть тела закрыта, не считайте её отсутствие на снимке доказательством.",
        ],
      },
      {
        heading: "Почему пчёлы похожи на некоторых ос?",
        paragraphs: [
          "И у медоносной пчелы, и у некоторых ос есть полосы на брюшке. Чёрно-жёлтый цвет сам по себе не определяет группу. На этих снимках средняя часть тела пчелы гуще покрыта волосками, а Polistes более вытянута, и её ноги видны лучше.",
          "Цветок тоже не даёт окончательного ответа: его посещают пчёлы, осы и похожие на них мухи. Появление возле сладкой пищи — лишь поведенческая подсказка. Одной узкой «талии» также недостаточно.",
        ],
      },
      {
        heading: "Чем этот шершень отличается от другой осы?",
        paragraphs: [
          "Здесь Polistes dominula — вытянутая чёрно-жёлтая оса. На фото Vespa crabro видны рыжевато-коричневая голова, тёмная средняя часть тела и жёлто-тёмное брюшко. Это признаки для сравнения, а не правило для всех шершней.",
          "Шершень может казаться крупнее, но по этим отдельным снимкам нельзя сравнить реальные размеры. Кадрирование и увеличение меняют масштаб; размер полезен лишь вместе с другими признаками.",
        ],
      },
      {
        heading: "Какие другие насекомые могут быть похожи?",
        paragraphs: [
          "Шмели рода Bombus — ещё один пример пчёл: многие выглядят округлыми и очень пушистыми. Показанная здесь медоносная пчела не представляет всех пчёл.",
          "Некоторые мухи-журчалки на цветках похожи на пчёл или ос и тоже имеют чёрно-жёлтый рисунок. Если голова, крылья или нужная деталь скрыты, не спешите с названием.",
        ],
      },
      {
        heading: "Когда одной фотографии недостаточно?",
        paragraphs: [
          "Размытость, маленькое насекомое вдали, закрытые голова или брюшко и освещение, меняющее цвет, мешают определению. Деталь для различения близких видов может не попасть в кадр; реальный размер часто неизвестен.",
          "Определить общую группу и назвать конкретный вид — разные результаты. Иногда честный ответ: «скорее пчела», «оса, но вид неясен» или «по этому кадру не различить».",
        ],
      },
      {
        heading: "Как сделать полезное фото безопасно?",
        list: {
          items: [
            "Сохраняйте дистанцию и используйте зум камеры.",
            "Снимайте несколько чётких ракурсов только тогда, когда это безопасно.",
            "Запишите место и дату; сохраните исходный файл.",
            "Не трогайте и не ловите незнакомое насекомое, не провоцируйте его ради проверки поведения.",
            "Не приближайтесь к гнезду и не используйте приманку лишь ради крупного плана.",
          ],
        },
        paragraphs: [
          "Качество снимка не важнее безопасности. Если насекомое или гнездо рядом, прекратите наблюдение и отойдите.",
        ],
      },
      {
        heading: "Нашли гнездо?",
        paragraphs: [
          "Здесь мы сравниваем внешность насекомых. О риске и поведении у гнезда читайте в материале [«Осиное гнездо у дома: насколько опасно?»](/insects/krazanis-bude). Даже фотография гнезда не всегда показывает, кто его построил.",
        ],
      },
    ],
    summary:
      "Сравнивайте сразу несколько признаков: форму тела, волоски, цвет головы, ноги и рисунок брюшка. Снимки сделаны в разном масштабе, а по одному кадру не всегда удаётся определить вид. Не трогайте незнакомое насекомое; фотографируйте только с безопасного расстояния.",
    title: "Пчела, оса или шершень — как различить их по фото?",
  },
  tr: {
    comparison: {
      cards: [
        {
          caveat: "Bu fotoğraf arının ırkını veya alt türünü belirlemez.",
          features: [
            "Gövdenin orta bölümü sık tüylerle kaplıdır.",
            "Karında kahverengimsi ve koyu bantlar görünür.",
            "Bir kanat gövdenin üzerine yatmıştır.",
          ],
          image: "bee",
          label: "Arı",
          taxon: "Apis mellifera — bal arısı",
        },
        {
          caveat:
            "Bu yalnızca bir yaban arısı örneğidir; diğerleri farklı görünebilir.",
          features: [
            "Siyah-sarı karın, gövdenin orta bölümüne dar bir yerden bağlanır.",
            "Uzun ve ince bacaklar açıkça görünür.",
            "Gövde, yanındaki arıya göre daha seyrek tüylü görünür.",
          ],
          image: "wasp",
          label: "Başka bir yaban arısı",
          taxon: "Polistes dominula — bir kâğıt yaban arısı",
        },
        {
          caveat:
            "Bu işaretler bu türe aittir; bütün Vespa türleri için kural değildir.",
          features: [
            "Baş kızılımsı kahverengi, yüz kısmı sarımsıdır.",
            "Gövdenin orta bölümü koyu ve kızılımsı kahverengidir.",
            "Karında sarı ve koyu desenler dönüşümlüdür.",
          ],
          image: "hornet",
          label: "Vespa türü",
          taxon: "Vespa crabro — Avrupa eşek arısı",
        },
      ],
      heading: "Fotoğraflarla hızlı karşılaştırma",
      intro:
        "Birkaç özelliği birlikte karşılaştırın. Vespa cinsindeki arılar da yaban arısı grubundadır; burada görünüşlerini başka bir yaban arısıyla karşılaştırmak için ayrı gösteriyoruz.",
      scaleNote:
        "Fotoğraflar aynı ölçekte değildir. Ekrandaki büyüklük böceklerin gerçek boy oranını göstermez.",
    },
    description:
      "Arı, yaban arısı veya Vespa mı? Gerçek fotoğrafları ve görünen işaretleri karşılaştırın; türün ne zaman belirlenemediğini ve güvenli gözlemi öğrenin.",
    faq: [
      {
        answer:
          "Evet. Vespa cinsi, Vespidae yani yaban arıları familyasına girer. Burada yalnızca görsel karşılaştırmayı kolaylaştırmak için ayrı gösterilir.",
        question: "Vespa da bir yaban arısı mı?",
      },
      {
        answer:
          "Hayır. Arılar ve arıya benzeyen bazı sinekler de bu renkleri taşıyabilir. Gövde biçimini, tüyleri, başı ve bacakları birlikte inceleyin.",
        question: "Her siyah-sarı böcek yaban arısı mıdır?",
      },
      {
        answer:
          "Hayır. Fotoğrafın ölçeği bilinmeyebilir ve yaban arılarının boyları değişir. Bu Vespa örneğinde baş rengi ile karın deseni de ipucu verir.",
        question: "Büyük bir böcek mutlaka Vespa mıdır?",
      },
      {
        answer:
          "Hayır. Çiçekleri arılar, yaban arıları ve onlara benzeyen sinekler ziyaret eder. Çiçekte bulunması tek başına tanı koydurmaz.",
        question: "Çiçekteki her böcek arı mıdır?",
      },
      {
        answer:
          "Bulanık bir karede veya baş ve gövde bağlantısı gizliyse yalnızca geniş grup seçilebilir. Yakın türler tek bir net fotoğrafta bile ayırt edilemeyebilir.",
        question: "Tek fotoğrafla tür neden her zaman belirlenemez?",
      },
      {
        answer:
          "Kamera yakınlaştırmasını kullanıp mesafeyi koruyun. Ek kareleri yalnızca güvenliyse çekin; daha iyi fotoğraf için yuvaya yaklaşmayın.",
        question: "Yaklaşmadan nasıl fotoğraf çekebilirim?",
      },
    ],
    intro:
      "Bir böceği fotoğraftan ayırmak için tek başına renk veya boy yeterli değildir. Üç gerçek örnekte gövde biçimini, tüyleri, başı ve bacakları karşılaştırın; sonra kadrajda görünmeyenlere bakın.",
    metaTitle: "Arı, yaban arısı veya Vespa? Fotoğraflarla karşılaştırın",
    sections: [
      {
        heading: "Hangi özellikleri karşılaştırmalıyız?",
        list: {
          items: [
            "Genel biçim: bu karelerde arı daha yuvarlak, Polistes daha uzun; Vespa crabro'nun başı ve orta gövdesi daha iri görünür.",
            "Tüyler: arıda sık tüyler belirgindir. Yaban arılarında da tüy olabilir; bu işaret tek başına yeterli değildir.",
            "Renk ve bağlantı: baş, orta gövde ve karındaki renk dağılımına, aralarındaki dar bağlantının görünmesine bakın.",
            "Bacaklar ve baş: Polistes'in ince bacakları ile Vespa crabro'nun kızılımsı başı bu karelerde ek ipuçlarıdır.",
          ],
        },
        paragraphs: [
          "Her işareti diğerleriyle birlikte değerlendirin. Bir bölüm gizliyse fotoğrafta görünmemesini kanıt saymayın.",
        ],
      },
      {
        heading: "Arılar neden bazı yaban arılarına benzer?",
        paragraphs: [
          "Bal arısının da bazı yaban arılarının da karnında bantlar vardır. Siyah-sarı renk tek başına grubu doğrulamaz. Bu karelerde arının orta gövdesi daha sık tüylü, Polistes ise daha uzun yapılıdır ve bacakları daha açık görünür.",
          "Çiçekte olmak da kesin cevap vermez: arılar, yaban arıları ve benzer sinekler çiçeklere uğrar. Tatlı yiyecek yakınında görülmek yalnızca davranış bağlamıdır. Dar bir 'bel' tek başına yeterli değildir.",
        ],
      },
      {
        heading: "Bu Vespa diğer yaban arısından nasıl ayrılır?",
        paragraphs: [
          "Bu ikilide Polistes dominula uzun yapılı, siyah-sarı bir yaban arısıdır. Vespa crabro fotoğrafında kızılımsı kahverengi baş, koyu orta bölüm ve sarı-koyu karın görünür. Bunlar bütün Vespa türleri için geçerli kurallar değildir.",
          "Vespa daha büyük görünebilir, fakat ayrı fotoğraflar gerçek boyları karşılaştırmaz. Kadraj ve büyütme ölçeği değiştirir; boyu başka işaretlerle birlikte kullanın.",
        ],
      },
      {
        heading: "Başka hangi böcekler benzer görünebilir?",
        paragraphs: [
          "Bombus cinsindeki arılar başka bir örnektir: birçoğu yuvarlak ve çok tüylü görünür. Buradaki bal arısı bütün arıları temsil etmez.",
          "Çiçeğe gelen bazı çiçek sinekleri de arı veya yaban arısına benzer ve siyah-sarı desen taşıyabilir. Baş, kanat veya gerekli başka ayrıntı gizliyse aceleyle ad koymayın.",
        ],
      },
      {
        heading: "Tek fotoğraf ne zaman yetmez?",
        paragraphs: [
          "Bulanıklık, uzakta çok küçük kalan böcek, gizli baş veya karın ve rengi değiştiren ışık tanımayı sınırlar. Yakın türleri ayıran ayrıntı görünmeyebilir; gerçek boy da çoğu kez bilinmez.",
          "Geniş bir grubu tanımak, türü kesin belirlemekten farklıdır. 'Daha çok arıya benziyor', 'yaban arısı ama türü belirsiz' veya 'bu kare yetmiyor' doğru sonuç olabilir.",
        ],
      },
      {
        heading: "Güvenli ve yararlı fotoğraf nasıl çekilir?",
        list: {
          items: [
            "Mesafeyi koruyun ve kamera yakınlaştırmasını kullanın.",
            "Farklı açılardan birkaç net kareyi yalnızca güvenliyse çekin.",
            "Yer ve tarihi not edin; özgün dosyayı saklayın.",
            "Bilinmeyen böceğe dokunmayın, onu yakalamayın veya davranışını sınamak için kışkırtmayın.",
            "Daha yakın kare için yuvaya yaklaşmayın ya da yalnızca fotoğraf amacıyla yem kullanmayın.",
          ],
        },
        paragraphs: [
          "Fotoğraf kalitesi güvenlikten önemli değildir. Böcek veya yuva yakınınızdaysa gözlemi bırakıp uzaklaşın.",
        ],
      },
      {
        heading: "Yuva mı buldunuz?",
        paragraphs: [
          "Bu rehber böceklerin görünüşünü karşılaştırır. Yuva yakınında davranış ve risk için [Evin yakınında eşek arısı yuvası: ne yapmalı?](/insects/krazanis-bude) rehberine bakın. Bir yuva fotoğrafı da onu yapan türü her zaman göstermez.",
        ],
      },
    ],
    summary:
      "Gövde biçimi, tüyler, baş rengi, bacaklar ve karın deseni gibi birkaç görünen işareti birlikte karşılaştırın. Fotoğraflar aynı ölçekte değildir ve tek kare türü her zaman belirleyemez. Bilinmeyen böceğe dokunmayın; yalnızca güvenli mesafeden fotoğraf çekin.",
    title: "Arı, yaban arısı veya Vespa — fotoğraflarla nasıl ayırt edilir?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "University of Minnesota Extension — Wasps and bees",
    supports: {
      en: "Visible differences among honey bees, bumble bees, paper wasps and yellowjackets.",
      ka: "თაფლის ფუტკრის, Bombus-ის, ქაღალდის კრაზანისა და Vespula-ს ხილული ნიშნები.",
      ru: "Видимые признаки медоносных пчёл, шмелей, бумажных ос и Vespula.",
      tr: "Bal arısı, Bombus, kâğıt yaban arısı ve Vespula örneklerinin görünen özellikleri.",
    },
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/yard-and-garden-insects/wasps-and-bees",
  },
  {
    name: "UC IPM — Yellowjackets and Other Social Wasps",
    supports: {
      en: "Wasp diversity, body junctions, behaviour as context, and avoiding nest disturbance.",
      ka: "კრაზანების მრავალფეროვნება, სხეულის შეერთება, ქცევა როგორც დამხმარე ნიშანი და ბუდის არშეწუხება.",
      ru: "Разнообразие ос, соединение частей тела, поведение как подсказка и отказ от приближения к гнезду.",
      tr: "Yaban arısı çeşitliliği, gövde bağlantısı, davranışın yardımcı rolü ve yuvayı rahatsız etmeme.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/yellowjackets-and-other-social-wasps/",
  },
  {
    name: "NC State Extension — European Hornets",
    supports: {
      en: "Vespa crabro head, middle-body and abdominal colours; traits of this species only.",
      ka: "Vespa crabro-ს თავის, სხეულის შუა ნაწილისა და მუცლის შეფერილობა; მხოლოდ ამ სახეობის ნიშნები.",
      ru: "Окраска головы, средней части тела и брюшка Vespa crabro; признаки именно этого вида.",
      tr: "Vespa crabro'nun baş, orta gövde ve karın renkleri; yalnızca bu türün özellikleri.",
    },
    url: "https://content.ces.ncsu.edu/european-hornets",
  },
  {
    name: "University of Wisconsin–Madison Extension — Hover, Flower, or Syrphid Flies",
    supports: {
      en: "Hover flies can resemble bees or wasps and visit flowers.",
      ka: "ზოგი ყვავილის ბუზი ფუტკარს ან კრაზანას ჰგავს და ყვავილებს სტუმრობს.",
      ru: "Мухи-журчалки могут напоминать пчёл или ос и посещают цветы.",
      tr: "Çiçek sinekleri arı veya yaban arısına benzeyebilir ve çiçekleri ziyaret eder.",
    },
    url: "https://hort.extension.wisc.edu/articles/hover-flower-or-syrphid-flies-syrphidae/",
  },
  {
    name: "Updated annotated checklist of insects from Lagodekhi Protected Areas, Sakartvelo (Georgia), 2025",
    supports: {
      en: "Lists Polistes dominula and Vespa crabro for Georgia; places Vespa under Vespidae.",
      ka: "საქართველოსთვის ასახელებს Polistes dominula-სა და Vespa crabro-ს; Vespa კრაზანასებრთა ოჯახშია.",
      ru: "Приводит Polistes dominula и Vespa crabro для Грузии; относит Vespa к Vespidae.",
      tr: "Gürcistan için Polistes dominula ve Vespa crabro kayıtları; Vespa'nın Vespidae içindeki yeri.",
    },
    url: "https://www.researchgate.net/publication/395130281_UPDATED_ANNOTATED_CHECKLIST_OF_INSECTS_FROM_LAGODEKHI_PROTECTED_AREAS_SAKARTVELO_GEORGIA",
  },
  {
    name: "FAO AGRIS — Honeybee populations in Borjomi gorge",
    supports: {
      en: "Documents Apis mellifera populations in Georgia's Borjomi gorge.",
      ka: "ადასტურებს Apis mellifera-ს პოპულაციებს საქართველოს ბორჯომის ხეობაში.",
      ru: "Документирует популяции Apis mellifera в Боржомском ущелье Грузии.",
      tr: "Gürcistan'daki Borjomi vadisinde Apis mellifera popülasyonlarını belgeler.",
    },
    url: "https://agris.fao.org/search/en/providers/122603/records/69020e3fe58bed54baf65bcf",
  },
  {
    name: "Georgian Biodiversity Database — Vespa crabro",
    supports: {
      en: "Georgian common name 'ჩვეულებრივი ონავარი' and placement in genus Vespa and family Vespidae.",
      ka: "ქართული სახელი „ჩვეულებრივი ონავარი“ და Vespa-სა და Vespidae-ს ტაქსონომიური შესაბამისობა.",
      ru: "Грузинское название „ჩვეულებრივი ონავარი“ и принадлежность к Vespa и Vespidae.",
      tr: "Gürcüce „ჩვეულებრივი ონავარი“ adı ile Vespa ve Vespidae sınıflandırması.",
    },
    url: "https://biodiversity.iliauni.edu.ge/ka/species/13797",
  },
];

export const BEE_WASP_HORNET = defineGuideArticle({
  comparison: {
    photos: [
      {
        author: "Jon Sullivan",
        changes: {
          en: "responsive web copies",
          ka: "ვებისთვის შექმნილი ადაპტური ასლები",
          ru: "адаптивные копии для сайта",
          tr: "web için uyarlanmış kopyalar",
        },
        image: "bee",
        license: "Public domain",
        licenseUrl:
          "https://commons.wikimedia.org/wiki/File:Honeybee_apis_mellifera_macro.jpg",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Honeybee_apis_mellifera_macro.jpg",
        taxon: "Apis mellifera",
      },
      {
        author: "Mr. Lvíčátko",
        changes: {
          en: "cropped and resized for web",
          ka: "ვებისთვის მოჭრილია და ზომა შეცვლილია",
          ru: "обрезано и уменьшено для сайта",
          tr: "web için kırpılıp yeniden boyutlandırıldı",
        },
        image: "wasp",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Polistes_dominula_lateral_view.jpg",
        taxon: "Polistes dominula",
      },
      {
        author: "Robert Flogaus-Faust",
        changes: {
          en: "resized for web",
          ka: "ვებისთვის ზომა შეცვლილია",
          ru: "размер изменён для сайта",
          tr: "web için yeniden boyutlandırıldı",
        },
        image: "hornet",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Vespa_crabro_RF.jpg",
        taxon: "Vespa crabro",
      },
    ],
  },
  copy: COPY,
  hero: {
    alt: {
      en: "Hairy honey bee in profile on the rim of a metal container",
      ka: "ბუსუსიანი თაფლის ფუტკარი გვერდიდან, მეტალის ჭურჭლის კიდეზე",
      ru: "Опушённая медоносная пчела сбоку на краю металлической ёмкости",
      tr: "Metal bir kabın kenarında yandan görülen tüylü bal arısı",
    },
    height: 960,
    src: "/images/guides/bee-wasp-hornet-apis.jpg",
    width: 1280,
  },
  id: "bee-wasp-hornet",
  images: {
    bee: {
      alt: {
        en: "Hairy honey bee in profile on the rim of a metal container",
        ka: "ბუსუსიანი თაფლის ფუტკარი გვერდიდან, მეტალის ჭურჭლის კიდეზე",
        ru: "Опушённая медоносная пчела сбоку на краю металлической ёмкости",
        tr: "Metal bir kabın kenarında yandan görülen tüylü bal arısı",
      },
      height: 960,
      src: "/images/guides/bee-wasp-hornet-apis.jpg",
      width: 1280,
    },
    hornet: {
      alt: {
        en: "Reddish-brown hornet in profile on a plant, with a yellow-and-dark abdomen",
        ka: "მოწითალო-მოყავისფრო ონავარი მცენარეზე, ყვითელ-მუქი მუცლით",
        ru: "Рыжевато-коричневый шершень на растении, с жёлто-тёмным брюшком",
        tr: "Bitki üzerinde, sarı-koyu karın desenli kızılımsı kahverengi Vespa",
      },
      height: 1721,
      src: "/images/guides/bee-wasp-hornet-vespa.jpg",
      width: 2398,
    },
    wasp: {
      alt: {
        en: "Black-and-yellow paper wasp in profile on weathered wood, with long slender legs",
        ka: "შავ-ყვითელი ქაღალდის კრაზანა ხეზე, გრძელი წვრილი ფეხებით",
        ru: "Чёрно-жёлтая бумажная оса на древесине, с длинными тонкими ногами",
        tr: "Eski ahşap üzerinde, uzun ince bacaklı siyah-sarı kâğıt yaban arısı",
      },
      height: 1650,
      src: "/images/guides/bee-wasp-hornet-polistes.jpg",
      width: 2200,
    },
  },
  messageKey: "beeWaspHornet",
  ogImage: "/og/images/guides/bee-wasp-hornet.jpg",
  parentHub: "insects",
  pathname: "/insects/futkari-krazana-onavari",
  relatedGuideIds: ["wasp-nest"],
  search: {
    icon: "identify",
    keywords: [
      "ფუტკარი",
      "კრაზანა",
      "ონავარი",
      "ბზიკი",
      "ფუტკრისა და კრაზანის განსხვავება",
      "futkari krazana onavari",
      "bee wasp hornet identification",
      "пчела оса шершень",
      "arı yaban arısı Vespa",
    ],
    rank: 5,
    subtitle: {
      en: "Real photos, visible marks and the limits of identification",
      ka: "რეალური ფოტოები, ხილული ნიშნები და ამოცნობის საზღვრები",
      ru: "Реальные фото, заметные признаки и пределы определения",
      tr: "Gerçek fotoğraflar, görünen işaretler ve tanımlamanın sınırları",
    },
    title: {
      en: "Bee, wasp or hornet?",
      ka: "ფუტკარი, კრაზანა თუ ონავარი?",
      ru: "Пчела, оса или шершень?",
      tr: "Arı, yaban arısı veya Vespa?",
    },
  },
  sources: SOURCES,
});
