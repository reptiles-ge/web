import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "cover" | "screen" | "yard";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Mosquitoes at home or in the yard? Check standing water and screens, repeat a weekly inspection, and understand when products can be used safely.",
    faq: [
      {
        answer:
          "Check door and window screens and doors left open, then vases and plant saucers. Look outdoors for water-holding items too.",
        question: "There are mosquitoes indoors. What should I check first?",
      },
      {
        answer:
          "No. CDC advises scrubbing as well as emptying; then turn over, cover, or remove the container where appropriate.",
        question: "Is pouring out the water enough?",
      },
      {
        answer:
          "Look for holes, gaps around frames, and doors left open. Check indoor water-holding containers too.",
        question:
          "I have screens but mosquitoes still enter. What should I inspect?",
      },
      {
        answer:
          "Consider covering or repair first. A larvicide may be an option for suitable non-drinking standing water under its label; ask a specialist about unknown or natural water bodies.",
        question: "What can I do with water I cannot empty?",
      },
      {
        answer:
          "No. Reducing standing water and maintaining screens come first. An adulticide is a targeted additional option subject to its label and pollinator precautions.",
        question: "Must I spray the entire yard?",
      },
      {
        answer:
          "Yard care aims to reduce mosquito numbers; clothing, netting, and a suitable repellent protect the person. No step guarantees complete protection.",
        question: "Why protect against bites if I maintain the yard?",
      },
    ],
    intro:
      "Start where water collects, then check door and window screens. These steps aim to reduce mosquito numbers; personal bite protection is a separate need.",
    metaTitle: "Mosquitoes at home: reduce numbers indoors and outside",
    quickActions: {
      heading: "Where should you start?",
      items: [
        "Find water-holding items in the yard and on the balcony; empty and scrub them.",
        "Check screens for holes, gaps at the frame, and doors left open.",
        "Repeat the inspection every week; look again after rain.",
        "When needed, use clothing, netting, or a skin repellent as its label directs.",
      ],
      links: [
        {
          heading: "What should you check in the yard and on the balcony?",
          label: "Yard plan ↓",
        },
        {
          heading: "How can you keep mosquitoes out of the house?",
          label: "Indoor plan ↓",
        },
      ],
      warning:
        "Water care reduces breeding sites; screens limit entry; repellent protects a person from bites. None replaces the others.",
    },
    sections: [
      {
        heading: "What should you check in the yard and on the balcony?",
        image: "yard",
        paragraphs: [
          "Once a week, inspect items that hold water. CDC advises emptying and scrubbing, turning over, covering, or discarding them. Emptying alone does not replace scrubbing.",
          "Use the table for places you actually have. Do not divert water onto a neighbor's property or into broken drainage. This plan does not call for draining natural wetlands or water bodies.",
        ],
        table: {
          headers: ["Place", "What to check", "Suitable action"],
          rows: [
            [
              "Bucket, toy, tire",
              "Is water standing inside?",
              "Empty and scrub; turn over or remove unused items.",
            ],
            [
              "Flowerpot saucer",
              "Does water remain after watering?",
              "Empty and scrub the saucer.",
            ],
            [
              "Small pool",
              "Is water left after use?",
              "Drain and turn it over when unused.",
            ],
            [
              "Water storage container",
              "Does the lid or mesh tightly cover every opening?",
              "Fit a tight lid or suitable mesh; leave no gaps around the edges.",
            ],
          ],
        },
      },
      {
        heading: "What if you cannot empty the water?",
        image: "cover",
        paragraphs: [
          "First see whether the container can be covered or repaired. For standing water that will not be used for drinking and cannot be covered, dumped, or removed, CDC discusses larvicides: products for mosquito larvae and pupae developing in water. They do not kill flying adults.",
          "Check the product label for its purpose and directions; dose and repeat timing depend on the product. This guide does not direct treatment of drinking water, pet water, natural water bodies, or tanks of unknown purpose. Ask a specialist to assess inaccessible or uncertain sites; do not climb onto a roof unprotected or alter shared infrastructure yourself.",
        ],
      },
      {
        heading: "How can you keep mosquitoes out of the house?",
        image: "screen",
        paragraphs: [
          "Install or repair and use door and window screens. Check for holes, gaps at the frame, and doors left open. Air conditioning can help when available; buying it is not a required step. Keep safe ventilation and indoor temperatures in mind.",
          "Once a week, also inspect indoor water-holding containers such as vases and flowerpot saucers: empty and scrub them. A dark, damp spot under a sink or furniture may be a resting place for adult mosquitoes; without water, it is not itself a breeding site.",
          "If mosquitoes remain after screens and standing water are addressed, CDC discusses an indoor product intended for that use or a pest control professional. Indoor spray alone will not keep a home mosquito-free.",
        ],
      },
      {
        heading: "What does each kind of product do?",
        paragraphs: [
          "A skin repellent protects a person from bites. A larvicide acts on immature mosquitoes in water. An adulticide targets adult mosquitoes. These purposes are not interchangeable.",
          "CDC describes outdoor adulticides for areas where adults rest, but spraying an entire yard is not the default plan. If using a suitable product, follow its label: do not exceed the amount or frequency, spray directly on fruit and vegetables or near food, or spray blooming plants and those visited by pollinators. The product label controls when people and pets may return.",
          "EPA advises against using outdoor products indoors, and calls for original packaging and protection of children and pets. Misuse of a total-release aerosol fogger risks fire and pesticide exposure. A fogger, electric vaporizer, and burning coil are distinct products; none replaces ongoing home and yard care.",
        ],
      },
      {
        heading: "How can you protect yourself from bites?",
        paragraphs: [
          "CDC advises loose-fitting, long-sleeved shirts and long pants. Mosquito netting can cover a stroller or baby carrier while preserving safe care of the child.",
          "Choose a skin repellent for its stated purpose and follow the label, including age limits and reapplication. CDC's recommendation for EPA-registered repellents is a US framework; it does not establish registration rules in Georgia the country. Do not apply clothing permethrin products to skin. Personal protection does not replace water checks.",
        ],
      },
      {
        heading: "Do all mosquitoes pose the same risk?",
        paragraphs: [
          "No. CDC distinguishes nuisance mosquitoes from species capable of spreading germs. A bite by itself does not mean infection. You do not need an exact species identification before starting these practical steps.",
          "This is not a species identification page or an assessment of current disease transmission in Georgia the country. Published pages in the [insect atlas](/insects) cover species; this guide covers care around the home.",
        ],
      },
      {
        heading: "What should you repeat, and when should you ask for help?",
        paragraphs: [
          "Recheck water-holding items indoors, in the yard, and on the balcony, along with screens, every week. A further look after rain is a practical choice, not a pesticide schedule. Note where mosquitoes appear, what you checked, what you did, and when.",
          "For shared spaces, inaccessible water, or drainage that needs repair, speak with building management or an appropriate specialist. Do not treat a neighbor's yard or modify shared systems on your own. Remaining mosquitoes alone do not prove pesticide resistance.",
        ],
      },
    ],
    summary:
      "Inspect water-holding items in the yard and on the balcony: empty and scrub, turn over, or tightly cover them. Repair screens and check vases and saucers indoors. Repeat weekly, and use personal bite protection when needed. Use any chemical product only for its stated purpose and according to its label.",
    title: "Mosquitoes at home and in the yard: what reduces their numbers?",
  },
  ka: {
    description:
      "კოღოები სახლში ან ეზოში? შეამოწმეთ წყლის დაგროვება და ბადეები, გაიგეთ რა გაიმეოროთ ყოველ კვირას და როგორ გამოიყენოთ საშუალებები უსაფრთხოდ.",
    faq: [
      {
        answer:
          "შეამოწმეთ კარ-ფანჯრის ბადეები და ღია კარები, შემდეგ ვაზები და ქოთნის ლანგრები. გარეთაც მოძებნეთ წყლის დამგროვებელი ნივთები.",
        question: "სახლში კოღოებია — პირველად რა შევამოწმო?",
      },
      {
        answer:
          "არა. CDC დაცლასთან ერთად გაწმენდასაც ურჩევს, ხოლო ჭურჭელი შემდეგ უნდა გადაბრუნდეს, დაიფაროს ან საჭიროებისას მოცილდეს.",
        question: "მხოლოდ წყლის გადაღვრა საკმარისია?",
      },
      {
        answer:
          "დაათვალიერეთ ნახვრეტები, ჩარჩოს კიდეები და კარები, რომლებიც დიდხანს ღია რჩება. შიგნითაც შეამოწმეთ წყლის დამგროვებელი ჭურჭელი.",
        question: "ბადე მაქვს და მაინც შემოდიან — რას მივაქციო ყურადღება?",
      },
      {
        answer:
          "ჯერ დაფარვა ან შეკეთება განიხილეთ. არასასმელ მდგარ წყალში ლარვიციდი მხოლოდ შესაბამისი ეტიკეტისა და ადგილის შეფასების მიხედვით გამოიყენება; უცნობ ან ბუნებრივ წყალსატევზე სპეციალისტს მიმართეთ.",
        question: "რა ვქნა წყალთან, რომლის დაცლაც არ შემიძლია?",
      },
      {
        answer:
          "არა. წყლის კერების შემცირება და ბადეები ძირითადი ნაბიჯებია. ზრდასრული კოღოების საშუალება მიზნობრივი დამატებითი ვარიანტია, მისი ეტიკეტისა და დამტვერავების დაცვის პირობებით.",
        question: "მთელი ეზოს შეწამვლა აუცილებელია?",
      },
      {
        answer:
          "ეზოს მოვლა კოღოების რაოდენობის შემცირებას ემსახურება, ხოლო ტანსაცმელი, ბადე და შესაბამისი რეპელენტი ადამიანს ნაკბენისგან იცავს. არც ერთი ნაბიჯი აბსოლუტურ დაცვას არ იძლევა.",
        question: "ეზოს მოვლის მიუხედავად პირადი დაცვა რატომ მჭირდება?",
      },
    ],
    intro:
      "დაიწყეთ იქიდან, სადაც წყალი გროვდება, შემდეგ შეამოწმეთ კარ-ფანჯრის ბადეები. ეს ნაბიჯები კოღოების რაოდენობის შემცირებას ემსახურება; ნაკბენისგან პირადი დაცვა ცალკე საჭიროა.",
    metaTitle: "კოღოები სახლში და ეზოში — როგორ შევამციროთ რაოდენობა?",
    quickActions: {
      heading: "რით დავიწყოთ?",
      items: [
        "ეზოსა და აივანზე მოძებნეთ წყლის დამგროვებელი ნივთები; დაცალეთ და გაწმინდეთ.",
        "შეამოწმეთ კარ-ფანჯრის ბადეების ნახვრეტები, კიდეები და ღია კარები.",
        "ყოველ კვირას გაიმეორეთ შემოწმება; წვიმის შემდეგ ხელახლა გადახედეთ ეზოს.",
        "საჭიროებისას გამოიყენეთ ტანსაცმელი, ბადე ან კანზე გამოსაყენებელი რეპელენტი ეტიკეტის მიხედვით.",
      ],
      links: [
        { heading: "რა შევამოწმოთ ეზოსა და აივანზე?", label: "ეზოს გეგმა ↓" },
        {
          heading: "როგორ შევამციროთ სახლში შემოსვლა?",
          label: "სახლის გეგმა ↓",
        },
      ],
      warning:
        "წყლის მოვლა ამცირებს გამრავლების ადგილებს; ბადე ზღუდავს შემოსვლას; რეპელენტი იცავს ადამიანს ნაკბენისგან. ერთი მეორეს ვერ ცვლის.",
    },
    sections: [
      {
        heading: "რა შევამოწმოთ ეზოსა და აივანზე?",
        image: "yard",
        paragraphs: [
          "კვირაში ერთხელ დაათვალიერეთ ნივთები, რომლებშიც წყალი ჩერდება. CDC ურჩევს მათ დაცლას და გაწმენდას, გადაბრუნებას, დაფარვას ან საჭიროებისას მოცილებას. მხოლოდ წყლის გადაღვრა გაწმენდის შემცვლელი არ არის.",
          "ცხრილი შეარჩიეთ თქვენი გარემოს მიხედვით. ნუ გადაამისამართებთ წყალს მეზობლის ტერიტორიაზე ან დაზიანებულ სადრენაჟო სისტემაში. ბუნებრივი ჭაობისა თუ წყალსატევის დაშრობა ამ გეგმის ნაწილი არ არის.",
        ],
        table: {
          headers: ["ადგილი", "რა შევამოწმოთ", "შესაბამისი მოქმედება"],
          rows: [
            [
              "ვედრო, სათამაშო, საბურავი",
              "დგას თუ არა წყალი შიგნით?",
              "დაცალეთ და გაწმინდეთ; გადააბრუნეთ ან მოაცილეთ გამოუყენებელი ნივთი.",
            ],
            [
              "ქოთნის ლანგარი",
              "რჩება თუ არა წყალი მორწყვის შემდეგ?",
              "დაცალეთ და გაწმინდეთ ლანგარი.",
            ],
            [
              "მცირე აუზი",
              "რჩება თუ არა წყალი გამოყენების შემდეგ?",
              "დაცალეთ და გადააბრუნეთ, როცა არ იყენებთ.",
            ],
            [
              "წყლის შესანახი ჭურჭელი",
              "სახურავი ან ბადე მჭიდროდ ფარავს ყველა ღიობს?",
              "დანიშნულების შესაბამისად მჭიდროდ დაახურეთ ან მოარგეთ ბადე; გვერდებზე ნაპრალი არ დატოვოთ.",
            ],
          ],
        },
      },
      {
        heading: "რა ვქნათ წყალთან, რომელსაც ვერ ვცლით?",
        image: "cover",
        paragraphs: [
          "ჯერ გაარკვიეთ, შესაძლებელია თუ არა ჭურჭლის დაფარვა ან პრობლემის შეკეთება. თუ მდგარი წყალი სასმელად არ გამოიყენება და მისი დაფარვა, დაცლა ან მოცილება ვერ ხერხდება, CDC ასეთ შემთხვევებში განიხილავს ლარვიციდს — წყალში განვითარებული კოღოს მატლებისა და ჭუპრების საწინააღმდეგო საშუალებას. ის მფრინავ კოღოებს არ ანადგურებს.",
          "პროდუქტის დანიშნულება და გამოყენება ეტიკეტით უნდა შეამოწმოთ; დოზა და გამეორების დრო პროდუქტზეა დამოკიდებული. ამ გიდით ნუ დაამუშავებთ სასმელ წყალს, ცხოველის წყალს, ბუნებრივ წყალსატევს ან უცნობი დანიშნულების ავზს. გაურკვეველ ან მიუდგომელ ადგილზე სპეციალისტის შეფასება მოითხოვეთ; არ ახვიდეთ დაუცველად სახურავზე და არ შეცვალოთ საერთო სისტემა თვითნებურად.",
        ],
      },
      {
        heading: "როგორ შევამციროთ სახლში შემოსვლა?",
        image: "screen",
        paragraphs: [
          "დააყენეთ ან შეაკეთეთ კარ-ფანჯრის ბადეები და გამოიყენეთ ისინი; შეამოწმეთ ნახვრეტები, ჩარჩოს კიდეები და კარის ხანგრძლივად ღიად დატოვება. კონდიციონერი შეიძლება დაგეხმაროთ, თუ ხელმისაწვდომია, მაგრამ მისი ყიდვა აუცილებელი ნაბიჯი არ არის. განიავებისა და ოთახის ტემპერატურის უსაფრთხო პირობებიც გაითვალისწინეთ.",
          "შიგნითაც კვირაში ერთხელ შეამოწმეთ წყლის დამგროვებელი ჭურჭელი, მაგალითად ვაზა და ქოთნის ლანგარი: დაცალეთ და გაწმინდეთ. ნიჟარის ქვეშ ან ავეჯთან ბნელი, ნესტიანი ადგილი შეიძლება ზრდასრული კოღოს დასვენების ადგილი იყოს; ის თავისთავად წყალში გამრავლების კერა არ არის.",
          "თუ ბადეებისა და წყლის საკითხის მოწესრიგების შემდეგ კოღოები მაინც რჩება, CDC განიხილავს შიდა გამოყენებისთვის განკუთვნილ საშუალებას ან მავნებლებთან ბრძოლის სპეციალისტს. მხოლოდ შიდა სპრეი მუდმივ დაცვას ვერ უზრუნველყოფს.",
        ],
      },
      {
        heading: "რომელი საშუალება რას აკეთებს?",
        paragraphs: [
          "კანზე გამოსაყენებელი რეპელენტი ნაკბენისგან პირად დაცვას ემსახურება. ლარვიციდი წყალში განვითარებულ ადრეულ ეტაპებზე მოქმედებს. ზრდასრული კოღოს საწინააღმდეგო ინსექტიციდი მფრინავ ან დასვენებულ ზრდასრულ კოღოებს ეხება. ეს სამი დანიშნულება ერთმანეთის შემცვლელი არ არის.",
          "CDC აღწერს გარე საშუალებების გამოყენებას ზრდასრული კოღოების დასვენების ადგილებში, მაგრამ მთელი ეზოს ავტომატური შეწამვლა საჭირო არ არის. თუ შესაბამის პროდუქტს იყენებთ, მიჰყევით ეტიკეტს: არ გადააჭარბოთ რაოდენობას ან სიხშირეს, არ შეასხუროთ პირდაპირ ხილსა და ბოსტნეულს ან საკვებთან, არც აყვავებულ და დამტვერავების მიერ მონახულებულ მცენარეებს. ადამიანებისა და ცხოველების დაბრუნების პირობები კონკრეტულ ეტიკეტზეა დამოკიდებული.",
          "EPA ურჩევს გარე გამოყენების საშუალების სახლში არგამოყენებას, ორიგინალ შეფუთვაში შენახვას და ბავშვებისა და ცხოველებისგან დაცვას. ოთახის აეროზოლური ფოგერის არასწორ გამოყენებას ხანძრისა და ქიმიურ ნივთიერებასთან ზემოქმედების რისკი აქვს. ფოგერი, ელექტროაორთქლებადი მოწყობილობა და სპირალი სხვადასხვა პროდუქტია; ნუ ჩათვლით მათ სახლისა და ეზოს მოვლის შემცვლელად.",
        ],
      },
      {
        heading: "როგორ დავიცვათ თავი ნაკბენისგან?",
        paragraphs: [
          "CDC ურჩევს თავისუფალ, გრძელსახელოებიან ტანსაცმელსა და გრძელ შარვალს. ბავშვის ეტლსა და გადამყვანზე შეიძლება კოღოს ბადე ისე გამოიყენოთ, რომ ბავშვის უსაფრთხო მოვლას არ შეუშალოს ხელი.",
          "კანზე გამოსაყენებელი რეპელენტი შეარჩიეთ მისი დანიშნულებისა და ეტიკეტის მიხედვით; დაიცავით ასაკობრივი შეზღუდვა და ხელახალი წასმის ინსტრუქცია. აშშ-ის CDC-ის რეკომენდაცია EPA-ში რეგისტრირებულ პროდუქტებს ეხება და საქართველოს პროდუქტის რეგისტრაციის წესს არ განსაზღვრავს. ტანსაცმელზე გამოსაყენებელი პერმეტრინი კანზე არ წაისვათ. პირადი დაცვა წყლის შემოწმებას არ ანაცვლებს.",
        ],
      },
      {
        heading: "ყველა კოღო ერთნაირ საფრთხეს ნიშნავს?",
        paragraphs: [
          "არა. CDC განასხვავებს კოღოებს, რომლებიც მხოლოდ გვკბენენ, და სახეობებს, რომლებსაც ინფექციის გადაცემა შეუძლიათ. ნაკბენი თავისთავად ინფექციას არ ნიშნავს. ამ პრაქტიკული ნაბიჯების დაწყებას ზუსტი სახეობის დადგენა არ სჭირდება.",
          "ეს გიდი სახეობის ამოცნობის ან საქართველოში დაავადებების გავრცელების შეფასების გვერდი არ არის. [მწერების ატლასში](/insects) გამოქვეყნებული სახეობების გვერდები ამოცნობისთვისაა; აქ ყურადღება სახლისა და ეზოს მოვლაზეა.",
        ],
      },
      {
        heading: "რა გავიმეოროთ და როდის გვჭირდება დახმარება?",
        paragraphs: [
          "ყოველ კვირას კვლავ შეამოწმეთ წყლის დამგროვებელი ნივთები სახლში, ეზოსა და აივანზე და ბადეების მდგომარეობა. წვიმის შემდეგ დამატებითი დათვალიერება პრაქტიკული არჩევანია, არა პრეპარატის გამოყენების გრაფიკი. ჩაინიშნეთ სად ჩნდებიან კოღოები, რა შეამოწმეთ, რა გააკეთეთ და როდის.",
          "თუ პრობლემა საერთო სივრცეს, მიუდგომელ წყალსაცავს ან შესაკეთებელ სადრენაჟო სისტემას ეხება, მიმართეთ შენობის ადმინისტრაციას ან შესაბამის სპეციალისტს. მეზობლის ეზო და საერთო სისტემა თვითნებურად არ დაამუშაოთ. კოღოების დარჩენა თავისთავად პრეპარატის მიმართ გამძლეობას არ ამტკიცებს.",
        ],
      },
    ],
    summary:
      "შეამოწმეთ ეზოსა და აივანზე დაგროვებული წყალი: ჭურჭელი დაცალეთ და გაწმინდეთ, გადააბრუნეთ ან მჭიდროდ დაფარეთ. სახლში შეაკეთეთ ბადეები და შეამოწმეთ ვაზები და ლანგრები. ეს ყოველ კვირას გაიმეორეთ; საჭიროებისას პირადი დაცვაც გამოიყენეთ. ქიმიური საშუალება მხოლოდ თავისი დანიშნულებითა და ეტიკეტით გამოიყენება.",
    title: "კოღოები სახლში და ეზოში — რა ამცირებს მათ რაოდენობას?",
  },
  ru: {
    description:
      "Комары дома или во дворе? Проверьте стоячую воду и сетки, повторяйте осмотр каждую неделю и узнайте, когда безопасно применять средства.",
    faq: [
      {
        answer:
          "Проверьте оконные и дверные сетки и открытые двери, затем вазы и поддоны растений. Снаружи тоже найдите предметы, где стоит вода.",
        question: "В доме комары. Что проверить сначала?",
      },
      {
        answer:
          "Нет. CDC советует также очищать ёмкость, после чего при необходимости перевернуть, накрыть или убрать её.",
        question: "Достаточно ли просто вылить воду?",
      },
      {
        answer:
          "Проверьте отверстия, зазоры вокруг рам и долго открытые двери. Осмотрите и домашние ёмкости с водой.",
        question: "Сетки есть, но комары проникают. На что смотреть?",
      },
      {
        answer:
          "Сначала рассмотрите накрытие или ремонт. Ларвицид может подойти для определённой непитьевой стоячей воды по этикетке; неизвестный или природный водоём должен оценить специалист.",
        question: "Что делать с водой, которую нельзя слить?",
      },
      {
        answer:
          "Нет. Сначала уменьшите стоячую воду и наладьте сетки. Средство против взрослых комаров — дополнительный целевой вариант с соблюдением этикетки и защитой опылителей.",
        question: "Нужно ли опрыскивать весь двор?",
      },
      {
        answer:
          "Уход за двором направлен на уменьшение числа комаров, а одежда, сетка и подходящий репеллент защищают человека. Ни один шаг не гарантирует полной защиты.",
        question: "Зачем защищаться от укусов, если я ухаживаю за двором?",
      },
    ],
    intro:
      "Начните с мест, где скапливается вода, затем проверьте сетки на дверях и окнах. Эти действия помогают уменьшить число комаров; защита от укусов нужна отдельно.",
    metaTitle: "Комары дома и во дворе: как уменьшить их число",
    quickActions: {
      heading: "С чего начать?",
      items: [
        "Найдите ёмкости с водой во дворе и на балконе; опорожните и очистите их.",
        "Проверьте сетки: отверстия, зазоры у рамы и открытые двери.",
        "Повторяйте осмотр каждую неделю; после дождя проверьте снова.",
        "При необходимости используйте закрытую одежду, сетку или кожный репеллент по инструкции.",
      ],
      links: [
        {
          heading: "Что проверить во дворе и на балконе?",
          label: "План для двора ↓",
        },
        {
          heading: "Как ограничить проникновение комаров в дом?",
          label: "План для дома ↓",
        },
      ],
      warning:
        "Уход за водой уменьшает места размножения; сетки ограничивают проникновение; репеллент защищает человека от укусов. Одно не заменяет другое.",
    },
    sections: [
      {
        heading: "Что проверить во дворе и на балконе?",
        image: "yard",
        paragraphs: [
          "Раз в неделю осматривайте предметы, в которых задерживается вода. CDC советует опорожнять и очищать, переворачивать, накрывать или убирать их. Слить воду — не то же самое, что очистить ёмкость.",
          "Выберите из таблицы то, что есть у вас. Не направляйте воду на соседний участок или в повреждённый водоотвод. Осушение природных водоёмов и болот в этот план не входит.",
        ],
        table: {
          headers: ["Место", "Что проверить", "Действие"],
          rows: [
            [
              "Ведро, игрушка, шина",
              "Не стоит ли внутри вода?",
              "Опорожните и очистите; переверните или уберите ненужное.",
            ],
            [
              "Поддон цветочного горшка",
              "Остаётся ли вода после полива?",
              "Опорожните и очистите поддон.",
            ],
            [
              "Небольшой бассейн",
              "Остаётся ли вода после использования?",
              "Слейте воду и переверните, когда не пользуетесь.",
            ],
            [
              "Ёмкость для хранения воды",
              "Крышка или сетка плотно закрывает все отверстия?",
              "Плотно закройте подходящей крышкой или сеткой без зазоров по краям.",
            ],
          ],
        },
      },
      {
        heading: "Что делать с водой, которую нельзя слить?",
        image: "cover",
        paragraphs: [
          "Сначала проверьте, можно ли накрыть ёмкость или устранить неисправность. Для стоячей воды, не предназначенной для питья, которую нельзя закрыть, слить или убрать, CDC рассматривает ларвициды — средства против личинок и куколок комаров в воде. Летающих взрослых комаров они не уничтожают.",
          "Назначение, дозу и повторное применение определяет этикетка конкретного продукта. Эта статья не предлагает обрабатывать питьевую воду, воду животных, природные водоёмы и резервуары неизвестного назначения. Недоступное или неясное место должен оценить специалист; не поднимайтесь на крышу без защиты и не меняйте общие системы самостоятельно.",
        ],
      },
      {
        heading: "Как ограничить проникновение комаров в дом?",
        image: "screen",
        paragraphs: [
          "Установите или почините сетки на окнах и дверях. Проверьте отверстия, края рам и двери, которые остаются открытыми. Кондиционер может помочь, если он есть, но покупать его необязательно. Учитывайте безопасное проветривание и температуру в доме.",
          "Раз в неделю проверяйте и домашние ёмкости с водой, например вазы и поддоны: опорожняйте и очищайте их. Тёмное влажное место под раковиной или мебелью может быть местом отдыха взрослых комаров, но без воды само по себе не является местом размножения.",
          "Если после ремонта сеток и устранения стоячей воды комары остаются, CDC допускает средство для применения внутри помещений или помощь специалиста. Один лишь комнатный спрей не обеспечит постоянной защиты.",
        ],
      },
      {
        heading: "Для чего предназначены разные средства?",
        paragraphs: [
          "Кожный репеллент защищает человека от укусов. Ларвицид действует на ранние стадии комаров в воде. Инсектицид против взрослых комаров действует на взрослых особей. Эти средства не взаимозаменяемы.",
          "CDC описывает применение наружных средств там, где отдыхают взрослые комары, но обработка всего двора не должна быть планом по умолчанию. Если средство подходит, следуйте этикетке: не превышайте количество и частоту, не распыляйте на плоды и овощи или рядом с пищей, на цветущие растения и растения, посещаемые опылителями. Условия возвращения людей и животных зависят от инструкции продукта.",
          "EPA советует не применять наружные средства в помещении, хранить их в исходной упаковке и беречь детей и животных. Неправильное применение аэрозольного фоггера создаёт риск пожара и воздействия пестицида. Фоггер, электрофумигатор и тлеющая спираль — разные изделия; они не заменяют регулярный уход за домом и двором.",
        ],
      },
      {
        heading: "Как защититься от укусов?",
        paragraphs: [
          "CDC рекомендует свободную одежду с длинными рукавами и длинные брюки. Москитную сетку можно использовать на коляске или переноске, не нарушая безопасный уход за ребёнком.",
          "Выбирайте кожный репеллент по назначению и соблюдайте этикетку, включая возрастные ограничения и повторное нанесение. Рекомендация CDC о регистрации в EPA относится к США и не устанавливает правила регистрации в Грузии. Средство с перметрином для одежды не наносите на кожу. Личная защита не заменяет проверку воды.",
        ],
      },
      {
        heading: "Все ли комары несут одинаковый риск?",
        paragraphs: [
          "Нет. CDC различает комаров, которые только кусают, и виды, способные переносить возбудителей болезней. Сам укус не означает заражения. Для начала практических действий точное определение вида не требуется.",
          "Это не страница определения вида и не оценка нынешнего распространения болезней в Грузии. Опубликованные страницы [атласа насекомых](/insects) посвящены видам; эта статья — уходу за домом и двором.",
        ],
      },
      {
        heading: "Что повторять и когда нужна помощь?",
        paragraphs: [
          "Каждую неделю проверяйте предметы с водой дома, во дворе и на балконе, а также сетки. Дополнительный осмотр после дождя — практический выбор, не график применения инсектицидов. Запишите, где появились комары, что проверили, что сделали и когда.",
          "Если проблема касается общего пространства, недоступной воды или водоотвода, требующего ремонта, обратитесь к администрации здания или специалисту. Не обрабатывайте соседний двор и не меняйте общие системы самовольно. Оставшиеся комары сами по себе не доказывают устойчивость к препарату.",
        ],
      },
    ],
    summary:
      "Осмотрите ёмкости с водой во дворе и на балконе: опорожните и очистите, переверните или плотно накройте их. Почините сетки и проверьте вазы и поддоны дома. Повторяйте осмотр еженедельно и при необходимости защищайтесь от укусов. Любое химическое средство используйте только по назначению и этикетке.",
    title: "Комары дома и во дворе: как уменьшить их количество?",
  },
  tr: {
    description:
      "Evde veya bahçede sivrisinek mi var? Biriken suyu ve sineklikleri kontrol edin, haftalık incelemeyi tekrarlayın, ürünleri güvenle kullanmayı öğrenin.",
    faq: [
      {
        answer:
          "Kapı ve pencere sineklikleri ile açık kalan kapıları, ardından vazoları ve saksı tabaklarını kontrol edin. Dışarıdaki su tutan eşyalara da bakın.",
        question: "Evde sivrisinek var; önce neye bakmalıyım?",
      },
      {
        answer:
          "Hayır. CDC boşaltmanın yanı sıra temizlemeyi de önerir; ardından kabı uygun biçimde ters çevirin, örtün veya kaldırın.",
        question: "Suyu dökmek yeterli mi?",
      },
      {
        answer:
          "Deliklere, çerçeve kenarlarındaki açıklıklara ve açık kalan kapılara bakın. Ev içindeki su tutan kapları da inceleyin.",
        question: "Sineklik var ama yine giriyorlar; neyi incelemeliyim?",
      },
      {
        answer:
          "Önce örtme veya onarmayı değerlendirin. Uygun içme dışı durgun suda larvisit, yalnızca ürün etiketine göre bir seçenek olabilir; belirsiz veya doğal suyu uzman değerlendirsin.",
        question: "Boşaltamadığım su için ne yapabilirim?",
      },
      {
        answer:
          "Hayır. Önce durgun suyu azaltıp sineklikleri düzeltin. Erişkin ilacı ancak etiketi ve tozlayıcıları koruma koşullarıyla hedefli bir ek seçenektir.",
        question: "Bütün bahçeyi ilaçlamak gerekir mi?",
      },
      {
        answer:
          "Bahçe bakımı sayıyı azaltmayı, giysi, cibinlik ve uygun kovucu kişiyi korumayı amaçlar. Hiçbir adım tam korumayı garanti etmez.",
        question: "Bahçeye bakarken neden ayrıca ısırıklardan korunmalıyım?",
      },
    ],
    intro:
      "Önce su biriken yerleri, sonra kapı ve pencere sinekliklerini kontrol edin. Bu adımlar sivrisinek sayısını azaltmayı amaçlar; ısırıklardan kişisel korunma ayrıca gerekir.",
    metaTitle: "Evde ve bahçede sivrisinek sayısını azaltma rehberi",
    quickActions: {
      heading: "Nereden başlamalı?",
      items: [
        "Bahçe ve balkonda su tutan eşyaları bulun; boşaltıp temizleyin.",
        "Sinekliklerdeki delikleri, kenar boşluklarını ve açık kalan kapıları kontrol edin.",
        "İncelemeyi her hafta tekrarlayın; yağmurdan sonra yeniden bakın.",
        "Gerektiğinde etikete uygun giysi, cibinlik veya cilt kovucu kullanın.",
      ],
      links: [
        {
          heading: "Bahçede ve balkonda neleri kontrol etmeliyiz?",
          label: "Bahçe planı ↓",
        },
        {
          heading: "Sivrisineklerin eve girmesi nasıl azaltılır?",
          label: "Ev planı ↓",
        },
      ],
      warning:
        "Su bakımı üreme yerlerini azaltır; sineklik girişi sınırlar; kovucu kişiyi ısırıklardan korur. Biri diğerinin yerini tutmaz.",
    },
    sections: [
      {
        heading: "Bahçede ve balkonda neleri kontrol etmeliyiz?",
        image: "yard",
        paragraphs: [
          "Haftada bir su tutan eşyaları inceleyin. CDC bunları boşaltıp fırçalamayı, ters çevirmeyi, örtmeyi veya gereksizse kaldırmayı önerir. Suyu boşaltmak, temizlemenin yerini tutmaz.",
          "Tablodan kendi alanınızdakileri seçin. Suyu komşunun alanına veya bozuk drenaja yönlendirmeyin. Doğal sulak alanları ya da su kütlelerini kurutmak bu planın parçası değildir.",
        ],
        table: {
          headers: ["Yer", "Neyi kontrol etmeli?", "Uygun işlem"],
          rows: [
            [
              "Kova, oyuncak, lastik",
              "İçinde su bekliyor mu?",
              "Boşaltıp temizleyin; ters çevirin veya kullanılmayanı kaldırın.",
            ],
            [
              "Saksı tabağı",
              "Sulamadan sonra su kalıyor mu?",
              "Tabağı boşaltıp temizleyin.",
            ],
            [
              "Küçük havuz",
              "Kullanımdan sonra su kalıyor mu?",
              "Kullanılmadığında boşaltıp ters çevirin.",
            ],
            [
              "Su saklama kabı",
              "Kapak veya ağ tüm açıklıkları sıkıca örtüyor mu?",
              "Uygun kapağı veya ağı kenarlarda boşluk bırakmadan takın.",
            ],
          ],
        },
      },
      {
        heading: "Boşaltılamayan su için ne yapılır?",
        image: "cover",
        paragraphs: [
          "Önce kabın örtülüp örtülemeyeceğine veya sorunun onarılıp onarılamayacağına bakın. İçme için kullanılmayan, örtülemeyen, boşaltılamayan veya kaldırılamayan durgun suda CDC larvisitleri ele alır: bunlar suda gelişen sivrisinek larvaları ve pupalarına yöneliktir. Uçan erişkinleri öldürmezler.",
          "Ürünün amacı ve talimatı etiketinden doğrulanmalıdır; miktar ve tekrar zamanı ürüne bağlıdır. Bu rehber içme suyunu, evcil hayvan suyunu, doğal suları veya amacı bilinmeyen depoları işlemeyi önermez. Ulaşılamayan veya belirsiz alanı uzman değerlendirsin; korunmasız çatıya çıkmayın, ortak sistemi kendiniz değiştirmeyin.",
        ],
      },
      {
        heading: "Sivrisineklerin eve girmesi nasıl azaltılır?",
        image: "screen",
        paragraphs: [
          "Kapı ve pencere sinekliklerini takın veya onarın ve kullanın. Delikleri, çerçeve kenarlarını ve açık bırakılan kapıları kontrol edin. Klima varsa yardımcı olabilir; satın almak zorunlu değildir. Güvenli havalandırma ve iç ortam sıcaklığını da gözetin.",
          "Vazo ve saksı tabakları gibi ev içindeki su tutan kapları da haftada bir boşaltıp temizleyin. Lavabo altında veya mobilya yanında karanlık, nemli bir yer erişkin sivrisineklerin dinlenme yeri olabilir; su yoksa tek başına üreme alanı değildir.",
          "Sineklikler ve durgun su ele alındıktan sonra sivrisinekler kalıyorsa CDC, iç mekâna uygun bir ürün veya haşere kontrol uzmanını değerlendirir. Yalnızca iç mekân spreyi kalıcı koruma sağlamaz.",
        ],
      },
      {
        heading: "Hangi ürün ne işe yarar?",
        paragraphs: [
          "Cilt kovucusu kişiyi ısırıklardan korur. Larvisit sudaki erken evrelere etki eder. Erişkin sivrisinek ilacı erişkinleri hedefler. Bu üç amaç birbirinin yerine geçmez.",
          "CDC dış mekân erişkin ilaçlarını sivrisineklerin dinlendiği alanlar için açıklar, fakat bütün bahçeyi ilaçlamak varsayılan plan değildir. Uygun ürün kullanılıyorsa etikete uyun: miktarı veya sıklığı artırmayın; meyve ve sebzelerin üstüne ya da yiyecek yakınına, çiçek açmış veya tozlayıcıların ziyaret ettiği bitkilere püskürtmeyin. İnsan ve hayvanların dönüş koşulları ürün etiketine bağlıdır.",
          "EPA dış mekân ürününün içeride kullanılmamasını, özgün ambalajında saklanmasını, çocuklardan ve hayvanlardan uzak tutulmasını önerir. Odayı dolduran aerosol foggerın yanlış kullanımı yangın ve pestisite maruz kalma riski taşır. Fogger, elektrikli buharlaştırıcı ve yanan spiral farklı ürünlerdir; hiçbiri düzenli ev ve bahçe bakımının yerini tutmaz.",
        ],
      },
      {
        heading: "Isırıklardan nasıl korunulur?",
        paragraphs: [
          "CDC bol, uzun kollu üst ve uzun pantolon önerir. Bebek arabası veya taşıyıcısında cibinlik, güvenli bebek bakımını engellemeden kullanılabilir.",
          "Cilde sürülen kovucuyu amacına göre seçin; yaş sınırları ve tekrar uygulama dahil etikete uyun. CDC'nin EPA kaydı önerisi ABD çerçevesidir; Gürcistan'daki ürün kayıt kuralını belirlemez. Giysi için üretilmiş permetrini cilde sürmeyin. Kişisel korunma su kontrolünün yerini tutmaz.",
        ],
      },
      {
        heading: "Bütün sivrisinekler aynı riski mi taşır?",
        paragraphs: [
          "Hayır. CDC yalnızca ısıran sivrisineklerle mikrop taşıyabilen türleri ayırır. Isırık tek başına enfeksiyon anlamına gelmez. Bu adımlara başlamak için türü kesin olarak bilmek gerekmez.",
          "Bu sayfa tür tanımlama ya da Gürcistan ülkesindeki güncel hastalık yayılımını değerlendirme sayfası değildir. Yayımlanmış [böcek atlası](/insects) sayfaları türleri ele alır; bu rehber ev ve bahçe bakımına odaklanır.",
        ],
      },
      {
        heading: "Neyi tekrarlamalı ve ne zaman yardım istemeli?",
        paragraphs: [
          "Evde, bahçede ve balkonda su tutan eşyaları ve sineklikleri her hafta yeniden kontrol edin. Yağmur sonrası ek bakış pratik bir tercihtir, ilaçlama takvimi değildir. Sivrisineklerin nerede görüldüğünü, neyi kontrol ettiğinizi, ne yaptığınızı ve zamanını not edin.",
          "Sorun ortak alanı, ulaşılamayan suyu veya onarım isteyen drenajı kapsıyorsa bina yönetimi ya da uygun bir uzmanla görüşün. Komşu bahçesini ilaçlamayın, ortak sistemi kendiniz değiştirmeyin. Sivrisineklerin kalması tek başına ilaca direnç kanıtı değildir.",
        ],
      },
    ],
    summary:
      "Bahçe ve balkondaki su tutan eşyaları inceleyin: boşaltıp temizleyin, ters çevirin veya sıkıca örtün. Sineklikleri onarın; evdeki vazoları ve tabakları kontrol edin. Her hafta tekrarlayın ve gerektiğinde ısırıklardan korunun. Kimyasal ürünü yalnızca belirtilen amacı ve etiketi doğrultusunda kullanın.",
    title: "Evde ve bahçede sivrisinekler: sayıları nasıl azaltılır?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "CDC — Mosquito Control at Home",
    supports: {
      en: "Primary plan: weekly emptying and scrubbing, covering water containers, screens, and the scope of additional outdoor and indoor control.",
      ka: "მთავარი გეგმა: ეზოსა და სახლის წყლის ჭურჭლის ყოველკვირეული დაცლა და გაწმენდა, დაფარვა, ბადეები და დამატებითი კონტროლის ფარგლები.",
      ru: "Основной план: еженедельное опорожнение и очистка, закрытие ёмкостей, сетки и рамки дополнительного контроля внутри и снаружи.",
      tr: "Ana plan: haftalık boşaltma ve temizleme, su kaplarını örtme, sineklikler ve iç/dış ek kontrolün kapsamı.",
    },
    url: "https://www.cdc.gov/mosquitoes/mosquito-control/mosquito-control-at-home.html",
  },
  {
    name: "CDC — Preventing Mosquito Bites",
    supports: {
      en: "Clothing, stroller netting, skin-repellent label instructions, and the distinction from permethrin-treated clothing.",
      ka: "ტანსაცმელი, ეტლის ბადე, კანზე გამოსაყენებელი რეპელენტის ეტიკეტი და ტანსაცმლის პერმეტრინის გამიჯვნა.",
      ru: "Одежда, сетка для коляски, этикетка кожного репеллента и отличие от перметрина для одежды.",
      tr: "Giysi, bebek arabası filesi, cilt kovucusu etiketi ve giysiye uygulanan permetrin ayrımı.",
    },
    url: "https://www.cdc.gov/mosquitoes/prevention/index.html",
  },
  {
    name: "CDC — Larvicides",
    supports: {
      en: "Larvicide purpose and its limited use in non-drinking standing water that cannot be covered, dumped, or removed, subject to the label.",
      ka: "ლარვიციდის დანიშნულება და მისი განხილვა მხოლოდ არასასმელი, დაუცლელი და დაუფარავი მდგარი წყლისთვის, ეტიკეტის დაცვით.",
      ru: "Назначение ларвицидов и ограничение непитьевой стоячей водой, которую нельзя накрыть, слить или убрать, с соблюдением этикетки.",
      tr: "Larvisitin amacı ve yalnızca örtülemeyen, boşaltılamayan, kaldırılamayan içme dışı durgun suda etikete bağlı kullanımı.",
    },
    url: "https://www.cdc.gov/mosquitoes/mosquito-control/larvicides.html",
  },
  {
    name: "CDC — Adulticides",
    supports: {
      en: "Adulticide purpose, label limits, food and pollinator precautions, and product-specific reentry conditions.",
      ka: "ზრდასრული კოღოების საშუალების დანიშნულება, ეტიკეტი, საკვებისა და დამტვერავების დაცვა და დაბრუნების პროდუქტისეული პირობები.",
      ru: "Назначение средств против взрослых комаров, этикетка, защита пищи и опылителей, условия возвращения по продукту.",
      tr: "Erişkin ilacının amacı, etiket sınırları, gıda ve tozlayıcı önlemleri, ürüne bağlı geri dönüş koşulları.",
    },
    url: "https://www.cdc.gov/mosquitoes/mosquito-control/adulticides.html",
  },
  {
    name: "US EPA — Do's and Don'ts of Pest Control",
    supports: {
      en: "Follow labels, avoid excess amount, do not use outdoor products indoors, retain original packaging, and protect children and pets.",
      ka: "ეტიკეტის დაცვა, ზედმეტი რაოდენობის თავიდან აცილება, გარე პროდუქტის სახლში არგამოყენება, ორიგინალი შეფუთვა, ბავშვებისა და ცხოველების დაცვა.",
      ru: "Соблюдать этикетку, избегать избытка, не применять наружное средство внутри, сохранять исходную упаковку, беречь детей и животных.",
      tr: "Etikete uyma, aşırı miktardan kaçınma, dış ürünü içeride kullanmama, özgün ambalaj, çocuk ve hayvanları koruma.",
    },
    url: "https://www.epa.gov/safepestcontrol/dos-and-donts-pest-control",
  },
  {
    name: "US EPA — Safety Precautions for Total Release Foggers",
    supports: {
      en: "Fire and pesticide-exposure risks from misuse of total-release aerosol foggers.",
      ka: "ოთახის აეროზოლური ფოგერის არასწორი გამოყენების ხანძრისა და ქიმიურ ნივთიერებასთან ზემოქმედების რისკები.",
      ru: "Риски пожара и воздействия пестицида при неправильном применении аэрозольных фоггеров.",
      tr: "Odayı dolduran aerosol foggerın yanlış kullanımında yangın ve pestisite maruz kalma riskleri.",
    },
    url: "https://www.epa.gov/safepestcontrol/safety-precautions-total-release-foggers",
  },
  {
    name: "CDC — About Mosquitoes",
    supports: {
      en: "Different mosquito roles in transmitting germs; a bite alone is not evidence of infection.",
      ka: "კოღოების განსხვავებული როლი ინფექციების გადაცემაში; ნაკბენი თავისთავად ინფექციის დასტური არ არის.",
      ru: "Различия комаров в передаче возбудителей; сам укус не подтверждает заражение.",
      tr: "Sivrisineklerin mikrop aktarımındaki farklı rolleri; ısırık tek başına enfeksiyon kanıtı değildir.",
    },
    url: "https://www.cdc.gov/mosquitoes/about/index.html",
  },
];

export const MOSQUITOES_AT_HOME = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Illustration: a person empties and scrubs a plant saucer on a balcony beside a screened window",
      ka: "ილუსტრაცია: ადამიანი აივანზე ცლის და წმენდს ქოთნის ლანგარს; გვერდით ჩანს ბადიანი ფანჯარა",
      ru: "Иллюстрация: человек опорожняет и чистит поддон на балконе рядом с окном с сеткой",
      tr: "Görsel: kişi balkonda saksı tabağını boşaltıp temizliyor; yanında sineklikli pencere var",
    },
    height: 941,
    src: "/images/guides/mosquitoes-at-home-hero.jpg",
    width: 1672,
  },
  id: "mosquitoes-at-home",
  images: {
    cover: {
      alt: {
        en: "Hands press a fitted lid onto a dark green outdoor water barrel beside a downspout",
        ka: "ხელები მჭიდრო სახურავს აჭერს მუქ მწვანე გარე წყლის კასრს, წვიმის მილის გვერდით",
        ru: "Руки прижимают плотную крышку к тёмно-зелёной уличной бочке для воды рядом с водосточной трубой",
        tr: "Eller, yağmur oluğunun yanında duran koyu yeşil dış mekân su varilinin kapağını sıkıca bastırıyor",
      },
      height: 576,
      src: "/images/guides/mosquitoes-at-home-cover.jpg",
      width: 1024,
    },
    screen: {
      alt: {
        en: "A person points to a small tear where a window screen has pulled away from its white frame",
        ka: "ადამიანი თითით უთითებს პატარა ნახეთქს, სადაც ფანჯრის ბადე თეთრ ჩარჩოს მოშორებია",
        ru: "Человек указывает на небольшую прореху, где оконная сетка отошла от белой рамы",
        tr: "Bir kişi, pencere sinekliğinin beyaz kasadan ayrıldığı küçük yırtığı gösteriyor",
      },
      height: 576,
      src: "/images/guides/mosquitoes-at-home-screen.jpg",
      width: 1024,
    },
    yard: {
      alt: {
        en: "A person crouches in a yard and scrubs the inside of a tipped white bucket as water pours out; a toy truck and a tire nearby hold standing water",
        ka: "ადამიანი ეზოში ჩაჯდომილი წმენდს გადაბრუნებული თეთრი ვედროს შიგნით, საიდანაც წყალი იღვრება; ახლოს სათამაშო მანქანასა და საბურავში წყალი დგას",
        ru: "Человек сидит на корточках во дворе и чистит опрокинутое белое ведро, из которого льётся вода; рядом вода стоит в игрушечной машинке и в покрышке",
        tr: "Bir kişi bahçede çömelmiş, içinden su dökülen devrilmiş beyaz kovayı fırçalıyor; yakındaki oyuncak kamyonda ve lastikte su duruyor",
      },
      height: 576,
      src: "/images/guides/mosquitoes-at-home-yard.jpg",
      width: 1024,
    },
  },
  messageKey: "mosquitoesAtHome",
  ogImage: "https://cdn.reptiles.ge/og/images/guides/mosquitoes-at-home.jpg",
  parentHub: "insects",
  pathname: "/insects/koghoebi-sakhlshi-da-ezoshi",
  search: {
    icon: "guide",
    keywords: [
      "კოღოები სახლში",
      "კოღოები ეზოში",
      "კოღოები აივანზე",
      "როგორ მოვიშოროთ კოღოები",
      "koghoebi sakhlshi",
      "mosquitoes at home",
      "mosquitoes in the yard",
      "комары дома",
      "комары во дворе",
      "evde sivrisinek",
      "bahçede sivrisinek",
    ],
    rank: 5,
    subtitle: {
      en: "Standing water, screens, and a practical prevention plan",
      ka: "წყლის დაგროვება, ბადეები და პრევენციის პრაქტიკული გეგმა",
      ru: "Стоячая вода, сетки и практический план профилактики",
      tr: "Durgun su, sineklikler ve uygulanabilir önleme planı",
    },
    title: {
      en: "Mosquitoes at home and in the yard",
      ka: "კოღოები სახლში და ეზოში",
      ru: "Комары дома и во дворе",
      tr: "Evde ve bahçede sivrisinekler",
    },
  },
  sources: SOURCES,
});
