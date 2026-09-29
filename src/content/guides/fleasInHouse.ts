import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "flea";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Fleas in the house with a cat or dog? Check the pet, clean its resting places, plan pet care with a vet, and avoid unsafe product use.",
    faq: [
      {
        answer:
          "Cleaning removes fleas from the places your pet uses, but it does not protect the pet from fleas already on it. Work on the home and the pet together, using a plan suited to each animal.",
        question: "Is cleaning the house alone enough?",
      },
      {
        answer:
          "Fleas at different stages may still be in carpets and bedding. Keep cleaning and observing; ask your vet or a pest professional to review the plan if numbers rise or the pet remains unwell. Do not reapply a pet product on your own schedule.",
        question: "Why are there still fleas after treating my pet?",
      },
      {
        answer:
          "No. A dog flea product must not be used on a cat. Check the label for species, age and weight, and ask the vet which product fits each pet.",
        question: "Can I use the dog's product on my cat?",
      },
      {
        answer:
          "Tell the vet the animal's age, weight and condition before choosing anything. A flea comb can help you look for and remove adult fleas gently, but do not use a product unless its label allows that life stage.",
        question: "What if I have a kitten or puppy?",
      },
      {
        answer:
          "No. Itching and marks on skin can have several causes. Look for an insect on the pet or in its resting places and seek medical advice if the skin problem is unclear or worsening.",
        question: "Can a bite mark identify a flea?",
      },
      {
        answer:
          "Tell the vet about every animal in the home and any products already used. Each pet needs a species-appropriate plan; keep recently treated animals apart for as long as the label or vet directs so they cannot groom one another.",
        question: "What if several pets live together?",
      },
    ],
    intro:
      "If you find fleas at home, care for the pet and its resting places together.",
    metaTitle: "Fleas in the house: cleaning and pet safety",
    quickActions: {
      heading: "What should you do now?",
      items: [
        "Check your cat or dog and its bed.",
        "Vacuum carpets and furniture; wash bedding.",
        "Plan pet protection with your veterinarian.",
        "Do not mix or repeat products on your own.",
      ],
      warning: "Never use a flea product made for dogs on a cat.",
    },
    sections: [
      {
        heading: "How can you tell whether these are fleas?",
        image: "flea",
        paragraphs: [
          "An adult flea is a small, wingless, reddish-brown insect with a body flattened from side to side. The photograph here is magnified; it cannot tell you the flea's species or its size in your home. Look for moving insects on the pet and around its bedding. A flea comb can help you inspect the coat without force.",
          "Scratching or irritated skin on a pet is a reason to look more closely, not proof of fleas. The same applies to a person's itchy marks: a bite photo alone cannot identify the cause. If you find an attached tick instead, use the [tick-bite guide](/insects/tkipis-nakbeni). Ask a veterinarian or doctor to assess a persistent skin problem.",
        ],
      },
      {
        heading: "Why do the pet and the home need attention together?",
        paragraphs: [
          "Some flea stages develop in places where the pet rests, such as bedding and carpet. Removing the adults you see on the animal therefore does not finish the problem in the home. Cleaning, an appropriate plan for each pet, any needed environmental treatment, and follow-up work together.",
          "Start home care and pet care on the same timeline. That does not mean using the same product on every animal or treating the whole room with chemicals.",
        ],
      },
      {
        heading: "Which places should you clean?",
        list: {
          items: [
            "Start with the pet's bed and washable covers. Wash them according to the fabric instructions and keep the resting area clean.",
            "Vacuum carpets and rugs, especially where the pet sleeps. Go over accessible floor edges and beneath furniture as well.",
            "Vacuum upholstered furniture and cushions where the pet rests. Use the appliance as directed; do not damage fabric or furniture to reach a hidden spot.",
            "Empty or seal the vacuum waste and discard it outside, following the appliance instructions. Repeat cleaning and keep checking the same places.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Focus on the places your pet actually uses. A single pass with a mop or vacuum is unlikely to address every flea stage. Regular vacuuming and laundering are the practical starting points; you do not need to throw away furniture or spray every surface by default.",
          "If a pest professional has applied a product, follow that product's instructions and the professional's advice about when to clean or re-enter. Do not let general cleaning advice override those directions.",
        ],
      },
      {
        heading: "What should you prepare for the veterinarian?",
        list: {
          items: [
            "Your pet's species, age and weight; mention if it is a kitten or puppy, pregnant, nursing, elderly or ill.",
            "Its health conditions, other medicines, and any previous sensitivity to flea products.",
            "The name or package of every flea product already used, when and how it was used, and any reaction you noticed.",
            "The other animals in your home, including cats living with a treated dog.",
          ],
        },
        paragraphs: [
          "Ask the veterinarian for a product and plan suited to each animal. Age, weight, health and other treatments change what is appropriate. A flea comb can remove some adults and help monitor the coat; bathing may help in some circumstances, but neither replaces the broader plan. Ask before bathing an animal that has already received a product.",
          "Do not divide a dose, combine products or copy a schedule from another pet. If your pet remains itchy or its skin is damaged, have the veterinarian assess it.",
        ],
      },
      {
        heading: "Which product safety rules matter most?",
        paragraphs: [
          "Products for pets, products for rooms, and products for people are different. Never spray a room insecticide on a pet or put a pet product on human skin. Use a pet product only for the species, life stage and weight on its label. Never use a flea product made for dogs on a cat.",
          "Read the label each time. Keep products away from children and pets when stored, and follow contact restrictions after use. In a home with several animals, a treated pet may be groomed by another; keep them apart for the period the label or veterinarian specifies. Do not assume a ‘natural’ label makes a product safe or try improvised mixtures.",
          "If an animal reacts badly after a product, contact the veterinarian immediately and keep the package at hand. The next steps depend on the product and the animal's condition; do not improvise an antidote or repeat a dose.",
        ],
      },
      {
        heading: "When should you ask for more help?",
        paragraphs: [
          "Contact the veterinarian for a sick pet, persistent scratching or skin damage, product choice or a possible adverse reaction. If fleas are numerous, keep returning, or you cannot find the main resting areas, a pest management professional can assess whether targeted home treatment is needed. A room fogger is not a quick default solution and improper use carries risks.",
          "A doctor can assess a person's skin symptoms or other health concerns; photographs cannot make a diagnosis. Seek urgent help for serious symptoms such as breathing difficulty or sudden swelling of the mouth or throat. In Georgia, call 112 for an emergency.",
        ],
      },
      {
        heading: "How do you check whether the plan is working?",
        paragraphs: [
          "Continue checking the pet and its usual resting places while keeping up cleaning. Fleas may emerge from stages already in the environment, so one later sighting alone does not tell you whether the plan has failed. It also is not a reason to ignore increasing activity or an unwell pet.",
          "If sightings increase or continue, review the home and pet plan with the veterinarian or pest professional. Follow the particular product's label and the vet's instructions for any repeat use; a general follow-up interval for the home is not a dosing calendar for the pet.",
        ],
      },
      {
        heading: "How can you reduce another flea problem?",
        paragraphs: [
          "Check your pet regularly and keep its bedding and favourite soft furnishings clean. Vacuum carpets and upholstered furniture it uses, and empty the vacuum waste outside. Discuss suitable ongoing protection with your veterinarian and follow the chosen product's instructions.",
          "If you are unsure what you found, identify the insect before deciding on chemical treatment. The [insects hub](/insects) brings together other identification pages and practical guides.",
        ],
      },
    ],
    summary:
      "Check the pet and its resting places, clean bedding and the carpets or furniture it uses, and agree on suitable flea care with your veterinarian. Treat the home and each animal as parts of one plan, but never use a dog product on a cat or apply a room product to a pet. Keep cleaning and checking; ask for help if the problem grows or the animal is unwell.",
    title: "Fleas in the house — what if you have a pet?",
  },
  ka: {
    description:
      "რწყილები სახლში? გაიგეთ, როგორ მოუაროთ ცხოველის მოსასვენებელ ადგილებს, რა შეათანხმოთ ვეტერინართან და როგორ აიცილოთ სახიფათო პრეპარატები.",
    faq: [
      {
        answer:
          "დასუფთავება ცხოველის მოსასვენებელ ადგილებს ეხმარება, მაგრამ ცხოველზე არსებულ რწყილებს მარტო ვერ მოაგვარებს. სახლსა და ცხოველს ერთად მიხედეთ, თითოეულისთვის შესაფერისი გეგმით.",
        question: "მარტო სახლის დასუფთავება საკმარისია?",
      },
      {
        answer:
          "ხალიჩასა და საწოლში განვითარების სხვა ეტაპები შეიძლება დარჩეს. გააგრძელეთ დასუფთავება და დაკვირვება; თუ რწყილები იმატებს ან ცხოველი ცუდადაა, გეგმა ვეტერინართან ან მავნებლების კონტროლის სპეციალისტთან გადაამოწმეთ. პრეპარატი თვითნებურად არ გაიმეოროთ.",
        question: "ცხოველს მივხედე და სახლში ისევ რწყილებია — რატომ?",
      },
      {
        answer:
          "არა. ძაღლისთვის განკუთვნილი რწყილის საწინააღმდეგო პრეპარატი კატაზე არ გამოიყენოთ. შეამოწმეთ ეტიკეტზე სახეობა, ასაკი და წონა, ხოლო შესაფერისი საშუალება ვეტერინართან შეათანხმეთ.",
        question: "შეიძლება ძაღლის პრეპარატი კატაზეც გამოვიყენო?",
      },
      {
        answer:
          "საშუალების შერჩევამდე ვეტერინარს უთხარით ცხოველის ასაკი, წონა და მდგომარეობა. სპეციალური სავარცხლით შეგიძლიათ ბეწვი ფრთხილად შეამოწმოთ და ზრდასრული რწყილები მოაშოროთ, მაგრამ პრეპარატი არ გამოიყენოთ, თუ ეტიკეტი ამ ასაკს არ უშვებს.",
        question: "რა ვქნა, თუ კნუტი ან ლეკვი მყავს?",
      },
      {
        answer:
          "არა. ქავილსა და გამონაყარს სხვადასხვა მიზეზი აქვს. მოძებნეთ თავად მწერი ცხოველზე ან მის მოსასვენებელ ადგილას; გაურკვეველი ან გაუარესებული კანის პრობლემის შეფასება შესაბამის სპეციალისტს მიანდეთ.",
        question: "მხოლოდ ნაკბენით შეიძლება რწყილის ამოცნობა?",
      },
      {
        answer:
          "ვეტერინარს უთხარით ყველა ცხოველისა და უკვე გამოყენებული საშუალებების შესახებ. თითოეულს მისი სახეობისთვის შესაფერისი გეგმა სჭირდება; ახლად დამუშავებული ცხოველები ეტიკეტით ან ვეტერინარით განსაზღვრული დროით განცალკევებით იყოლიეთ, რომ ერთმანეთს არ ალოკონ.",
        question: "რა ვქნა, თუ რამდენიმე შინაური ცხოველი მყავს?",
      },
    ],
    intro:
      "თუ სახლში რწყილები შენიშნეთ, ცხოველსა და მის მოსასვენებელ ადგილებს ერთად მიხედეთ.",
    metaTitle: "რწყილები სახლში — მოშორება და შინაური ცხოველის დაცვა",
    quickActions: {
      heading: "რა გავაკეთო ახლა?",
      items: [
        "შეამოწმეთ კატა ან ძაღლი და მისი საწოლი.",
        "გაწმინდეთ ხალიჩა და ავეჯი; გარეცხეთ გადასაფარებლები.",
        "ცხოველის დაცვა ვეტერინარს შეუთანხმეთ.",
        "პრეპარატები არ აურიოთ და თვითნებურად არ გაიმეოროთ.",
      ],
      warning:
        "ძაღლისთვის განკუთვნილი რწყილის საწინააღმდეგო პრეპარატი კატაზე არ გამოიყენოთ.",
    },
    sections: [
      {
        heading: "როგორ მივხვდეთ, რომ რწყილებთან გვაქვს საქმე?",
        image: "flea",
        paragraphs: [
          "ზრდასრული რწყილი პატარა, უფრთო, მოწითალო-მურა მწერია; სხეული გვერდებიდან აქვს გაბრტყელებული. ფოტოზე მწერი გადიდებულია — ამ კადრით მის სახეობას ან თქვენს სახლში ნაპოვნის ნამდვილ ზომას ვერ დავადგენთ. მოძრავი მწერი მოძებნეთ ცხოველზე და მის საწოლთან. სპეციალური სავარცხელი ბეწვის ფრთხილად დათვალიერებაში დაგეხმარებათ.",
          "ცხოველის ქავილი ან გაღიზიანებული კანი დამატებითი შემოწმების მიზეზია და არა რწყილის მტკიცებულება. ადამიანის კანზე ქავილიც ასეა: მხოლოდ ნაკბენის ფოტოთი მიზეზს ვერ დავადგენთ. თუ მიმაგრებული ტკიპა ნახეთ, იხილეთ [ტკიპის ნაკბენის გიდი](/insects/tkipis-nakbeni). გახანგრძლივებული კანის პრობლემა ვეტერინარს ან ექიმს შეაფასებინეთ.",
        ],
      },
      {
        heading: "რატომ უნდა მივხედოთ ცხოველსაც და სახლსაც?",
        paragraphs: [
          "რწყილის განვითარების ზოგი ეტაპი ცხოველის მოსასვენებელ გარემოშია, მაგალითად საწოლსა და ხალიჩაში. ამიტომ ცხოველზე ნანახი ზრდასრული რწყილების მოცილება სახლში პრობლემის დასრულებას არ ნიშნავს. საჭიროა დასუფთავება, თითოეული ცხოველისთვის შესაფერისი გეგმა, საჭიროების შემთხვევაში გარემოს მიზნობრივი დამუშავება და შემდგომი კონტროლი.",
          "სახლსა და ცხოველს ერთდროულად მიხედეთ. ეს არ ნიშნავს ყველა ცხოველისთვის ერთი პრეპარატის გამოყენებას ან მთელი ოთახის ნაგულისხმევ შეწამვლას.",
        ],
      },
      {
        heading: "რომელი ადგილები გავწმინდოთ?",
        list: {
          items: [
            "დაიწყეთ ცხოველის საწოლითა და გასარეცხი გადასაფარებლებით. გარეცხეთ ქსოვილის ინსტრუქციის მიხედვით და მოსასვენებელი ადგილი სუფთად შეინარჩუნეთ.",
            "მტვერსასრუტით გაწმინდეთ ხალიჩები და პატარა ფარდაგები, განსაკუთრებით იქ, სადაც ცხოველი წევს. მიუდექით მისადგომ კედლის კიდეებსა და ავეჯის ქვემოთაც.",
            "გაწმინდეთ რბილი ავეჯი და ბალიშები, სადაც ცხოველი ისვენებს. დაიცავით მოწყობილობის ინსტრუქცია; მიუწვდომელი ადგილის გამო ქსოვილი ან ავეჯი არ დააზიანოთ.",
            "მტვერსასრუტის ნარჩენები დახურეთ ან დაცალეთ და გარეთ გადაყარეთ, მოწყობილობის წესის დაცვით. დასუფთავება გაიმეორეთ და იგივე ადგილები კვლავ შეამოწმეთ.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ყურადღება იმ ადგილებზე გაამახვილეთ, სადაც ცხოველი ნამდვილად დადის და ისვენებს. იატაკის ერთხელ მოწმენდა ან მტვერსასრუტის ერთხელ გავლება ყველა ეტაპს ვერ მოაგვარებს. რეგულარული გაწმენდა და გასარეცხი ქსოვილების რეცხვა საწყისი ნაბიჯებია; ავეჯის გადაყრა ან ყველა ზედაპირის შეწამვლა ნაგულისხმევი გამოსავალი არ არის.",
          "თუ სახლი სპეციალისტმა დაამუშავა, შემდგომი წმენდისა და დაბრუნების დროს გამოყენებული საშუალების ინსტრუქცია და სპეციალისტის მითითება განსაზღვრავს. ზოგად დასუფთავების რჩევას ამ წესებთან ნუ დააპირისპირებთ.",
        ],
      },
      {
        heading: "რა ინფორმაცია მოვამზადოთ ვეტერინართან საუბრამდე?",
        list: {
          items: [
            "ცხოველის სახეობა, ასაკი და წონა; უთხარით, თუ კნუტია ან ლეკვი, მაკეა, მეძუძურია, ხანდაზმულია ან ავადაა.",
            "არსებული დაავადებები, სხვა წამლები და რწყილის საწინააღმდეგო საშუალებაზე ადრე შემჩნეული მგრძნობელობა.",
            "უკვე გამოყენებული ყველა პრეპარატის სახელი ან შეფუთვა, გამოყენების დრო და წესი, შემჩნეული რეაქცია.",
            "სახლში მცხოვრები სხვა ცხოველები, მათ შორის კატა, რომელიც დამუშავებულ ძაღლთან ცხოვრობს.",
          ],
        },
        paragraphs: [
          "ვეტერინარს თითოეული ცხოველისთვის შესაფერისი საშუალება და გეგმა შეუთანხმეთ. ასაკი, წონა, ჯანმრთელობა და სხვა მკურნალობა არჩევანს ცვლის. სპეციალური სავარცხელი ზრდასრული რწყილების მოცილებასა და დაკვირვებაში დაგეხმარებათ; დაბანაც ზოგჯერ დამხმარეა, მაგრამ არც ერთი ცვლის სრულ გეგმას. უკვე გამოყენებული პრეპარატის შემდეგ დაბანა წინასწარ გადაამოწმეთ.",
          "დოზა არ გაყოთ, საშუალებები არ შეუთავსოთ და სხვა ცხოველის გრაფიკი არ გადაიღოთ. თუ ქავილი არ წყდება ან კანი დაზიანებულია, ცხოველი ვეტერინარს შეაფასებინეთ.",
        ],
      },
      {
        heading: "პრეპარატების რომელი უსაფრთხოების წესებია მთავარი?",
        paragraphs: [
          "ცხოველზე, ოთახში და ადამიანზე გამოსაყენებელი საშუალებები ერთმანეთის შემცვლელი არ არის. ოთახის ინსექტიციდი ცხოველს არ შეასხუროთ, ცხოველის საშუალება კი ადამიანის კანზე არ გამოიყენოთ. ცხოველის პრეპარატი მხოლოდ ეტიკეტზე მითითებული სახეობის, ასაკისა და წონისთვის გამოიყენეთ. ძაღლისთვის განკუთვნილი რწყილის საწინააღმდეგო პრეპარატი კატაზე არ გამოიყენოთ.",
          "ყოველი გამოყენების წინ ეტიკეტი წაიკითხეთ. შენახვისას საშუალებები ბავშვებისა და ცხოველებისთვის მიუწვდომლად გქონდეთ და გამოყენების შემდეგ შეხების შეზღუდვებიც დაიცავით. რამდენიმე ცხოველის სახლში ახლად დამუშავებული ცხოველი მეორემ შეიძლება ალოკოს; ისინი ეტიკეტით ან ვეტერინარით განსაზღვრული დროით განცალკევებით იყოლიეთ. წარწერა „ბუნებრივი“ უსაფრთხოების გარანტია არ არის; თვითნაკეთი ნარევები არ გამოიყენოთ.",
          "თუ პრეპარატის შემდეგ ცხოველი ცუდად გახდა, დაუყოვნებლივ დაუკავშირდით ვეტერინარს და შეფუთვა შეინახეთ. შემდეგი ნაბიჯი პროდუქტსა და ცხოველის მდგომარეობაზეა დამოკიდებული; ანტიდოტი არ გამოიგონოთ და დოზა არ გაიმეოროთ.",
        ],
      },
      {
        heading: "როდის გვჭირდება დამატებითი დახმარება?",
        paragraphs: [
          "ვეტერინარს მიმართეთ, თუ ცხოველი ცუდადაა, ქავილი ან კანის დაზიანება არ წყდება, პრეპარატის არჩევა გჭირდებათ ან არასასურველ რეაქციას ეჭვობთ. თუ რწყილები ბევრია, კვლავ ჩნდება ან პრობლემის კერას ვერ პოულობთ, მავნებლების კონტროლის სპეციალისტი შეაფასებს, სჭირდება თუ არა სახლს მიზნობრივი დამუშავება. ოთახის აეროზოლური „ბომბი“ სწრაფი ნაგულისხმევი გამოსავალი არ არის და არასწორი გამოყენება სარისკოა.",
          "ადამიანის კანის ჩივილებსა და სხვა პრობლემას ექიმი შეაფასებს; ფოტოთი დიაგნოზი ვერ დაისმება. სუნთქვის გაძნელების ან პირისა და ყელის უეცარი შეშუპებისას სასწრაფო დახმარება მოითხოვეთ. საქართველოში გადაუდებელ შემთხვევაში დარეკეთ 112-ზე.",
        ],
      },
      {
        heading: "როგორ შევაფასოთ, მუშაობს თუ არა გეგმა?",
        paragraphs: [
          "ცხოველი და მისი მოსასვენებელი ადგილები კვლავ შეამოწმეთ და დასუფთავება გააგრძელეთ. გარემოში დარჩენილი განვითარების ეტაპებიდან რწყილები შეიძლება მოგვიანებით გამოჩნდნენ; ერთი ნანახი მწერი თავისთავად არც გეგმის ჩავარდნას ნიშნავს. მაგრამ რწყილების მატება ან ცუდად მყოფი ცხოველი უყურადღებოდ არ დატოვოთ.",
          "თუ პრობლემა ძლიერდება ან გრძელდება, სახლისა და ცხოველის გეგმა ვეტერინართან ან მავნებლების კონტროლის სპეციალისტთან გადაამოწმეთ. პრეპარატის ხელახალი გამოყენება მის ეტიკეტსა და ვეტერინარის მითითებას უნდა მიჰყვეს; სახლის შემდგომი კონტროლის ზოგადი ვადა ცხოველისთვის დოზირების გრაფიკი არ არის.",
        ],
      },
      {
        heading: "როგორ ავიცილოთ თავიდან განმეორებითი პრობლემა?",
        paragraphs: [
          "ცხოველი რეგულარულად შეამოწმეთ და მისი საწოლი და საყვარელი რბილი ავეჯი სუფთად შეინარჩუნეთ. მტვერსასრუტით გაწმინდეთ ხალიჩები და ავეჯი, რომელსაც ის იყენებს, ნარჩენები კი გარეთ გადაყარეთ. მუდმივი დაცვის შესაფერისი გზა ვეტერინართან შეათანხმეთ და შერჩეული საშუალების ინსტრუქციას მიჰყევით.",
          "თუ არ იცით, რომელი მწერი ნახეთ, ქიმიურ დამუშავებამდე ამოცნობას მიაქციეთ ყურადღება. [მწერების ჰაბში](/insects) სხვა ამოსაცნობი გვერდები და პრაქტიკული გიდებია თავმოყრილი.",
        ],
      },
    ],
    summary:
      "შეამოწმეთ ცხოველი და მისი მოსასვენებელი ადგილები, გარეცხეთ საწოლი და გაწმინდეთ ხალიჩები თუ ავეჯი, რომელსაც ის იყენებს. ცხოველის დაცვა ვეტერინართან შეათანხმეთ: სახლი და თითოეული ცხოველი ერთი გეგმის ნაწილია, მაგრამ ძაღლის პრეპარატი კატაზე და ოთახის საშუალება ცხოველზე არ გამოიყენოთ. დასუფთავება და დაკვირვება გააგრძელეთ; თუ პრობლემა ძლიერდება ან ცხოველი ცუდადაა, დახმარება ითხოვეთ.",
    title: "რწყილები სახლში — როგორ მოვიქცეთ, როცა შინაური ცხოველიც გვყავს?",
  },
  ru: {
    description:
      "Блохи дома, а у вас кошка или собака? Проверьте питомца, уберите места его отдыха, согласуйте защиту с ветеринаром и не смешивайте средства.",
    faq: [
      {
        answer:
          "Уборка помогает очистить места отдыха, но не решает вопрос с блохами на самом животном. Занимайтесь домом и питомцем одновременно, с подходящим планом для каждого животного.",
        question: "Хватит ли одной уборки дома?",
      },
      {
        answer:
          "В коврах и подстилках могут оставаться другие стадии развития блох. Продолжайте уборку и наблюдение; если блох становится больше или питомцу плохо, пересмотрите план с ветеринаром либо специалистом по борьбе с вредителями. Не наносите препарат повторно по собственному графику.",
        question: "Почему после обработки питомца дома ещё есть блохи?",
      },
      {
        answer:
          "Нет. Средство от блох для собак нельзя применять на кошке. Проверьте указанные на этикетке вид, возраст и вес и обсудите выбор для каждого питомца с ветеринаром.",
        question: "Можно ли использовать собачий препарат для кошки?",
      },
      {
        answer:
          "До выбора средства сообщите ветеринару возраст, вес и состояние животного. Специальный гребень поможет бережно проверить шерсть и убрать взрослых блох, но не применяйте препарат, если этикетка не допускает его для такого возраста.",
        question: "Что делать, если дома котёнок или щенок?",
      },
      {
        answer:
          "Нет. Зуд и пятна на коже бывают по разным причинам. Ищите самого насекомого на питомце или возле его лежанки; неясную или ухудшающуюся проблему с кожей должен оценить специалист.",
        question: "Можно ли узнать блоху только по следу укуса?",
      },
      {
        answer:
          "Расскажите ветеринару обо всех животных и уже применённых средствах. Каждому нужен план для его вида; недавно обработанных животных держите раздельно столько, сколько предписывают этикетка или ветеринар, чтобы они не вылизывали друг друга.",
        question: "Что делать, если питомцев несколько?",
      },
    ],
    intro:
      "Если дома появились блохи, займитесь питомцем и местами его отдыха одновременно.",
    metaTitle: "Блохи дома: уборка и безопасность питомца",
    quickActions: {
      heading: "Что сделать прямо сейчас?",
      items: [
        "Осмотрите кошку или собаку и её лежанку.",
        "Пропылесосьте ковры и мебель; постирайте подстилку.",
        "Согласуйте защиту питомца с ветеринаром.",
        "Не смешивайте и не повторяйте препараты самовольно.",
      ],
      warning: "Никогда не применяйте средство от блох для собак на кошке.",
    },
    sections: [
      {
        heading: "Как понять, что это блохи?",
        image: "flea",
        paragraphs: [
          "Взрослая блоха — маленькое бескрылое рыжевато-коричневое насекомое с телом, сжатым с боков. На фотографии насекомое увеличено; по ней нельзя определить вид или реальный размер находки у вас дома. Ищите движущихся насекомых на питомце и возле его лежанки. Специальный гребень поможет осмотреть шерсть без сильного удерживания животного.",
          "Зуд или раздражение кожи у питомца — повод проверить его, а не доказательство наличия блох. То же относится к зудящим следам на коже человека: одна фотография укуса не устанавливает причину. Если вы нашли присосавшегося клеща, откройте [гид по укусу клеща](/insects/tkipis-nakbeni). Длительные кожные жалобы обсудите с ветеринаром или врачом.",
        ],
      },
      {
        heading: "Почему нужно заняться и питомцем, и домом?",
        paragraphs: [
          "Часть стадий развития блох находится там, где отдыхает животное, например в подстилке или ковре. Поэтому удаление взрослых блох, которых видно на питомце, не означает конца проблемы дома. Нужны уборка, подходящий план для каждого животного, при необходимости целевая обработка среды и последующее наблюдение.",
          "Занимайтесь домом и питомцем одновременно. Это не означает одно средство для всех животных или обязательное опрыскивание всей комнаты.",
        ],
      },
      {
        heading: "Какие места убирать?",
        list: {
          items: [
            "Начните с лежанки и съёмных покрывал. Стирайте их по инструкции к ткани и регулярно очищайте место отдыха.",
            "Пропылесосьте ковры и небольшие коврики, особенно там, где спит питомец. Пройдитесь по доступным краям пола и под мебелью.",
            "Очистите мягкую мебель и подушки, на которых отдыхает питомец. Соблюдайте инструкцию к пылесосу; не повреждайте ткань или мебель ради недоступного участка.",
            "Закройте или опорожните контейнер пылесоса и выбросьте отходы снаружи по инструкции к прибору. Повторяйте уборку и проверяйте те же места.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Сосредоточьтесь на местах, которыми питомец действительно пользуется. Одно мытьё пола или однократная уборка пылесосом не решают проблему на всех стадиях. Регулярная уборка и стирка — первые шаги; выбрасывать мебель или опрыскивать всё подряд обычно не нужно.",
          "Если помещение обрабатывал специалист, время последующей уборки и возвращения определяют инструкция к средству и его указания. Общий совет по уборке не должен им противоречить.",
        ],
      },
      {
        heading: "Что подготовить к разговору с ветеринаром?",
        list: {
          items: [
            "Вид, возраст и вес питомца; скажите, если это котёнок или щенок, беременное, кормящее, пожилое или больное животное.",
            "Заболевания, другие лекарства и прежнюю чувствительность к средствам от блох.",
            "Название или упаковку всех уже использованных препаратов, время и способ применения, замеченную реакцию.",
            "Других животных в доме, в том числе кошку рядом с обработанной собакой.",
          ],
        },
        paragraphs: [
          "Согласуйте средство и план для каждого питомца отдельно. Возраст, вес, здоровье и другое лечение влияют на выбор. Гребень помогает убрать часть взрослых блох и наблюдать за шерстью; купание иногда тоже помогает, но ни то ни другое не заменяет общий план. Прежде чем купать уже обработанное животное, проверьте совместимость со средством.",
          "Не делите дозу, не сочетайте средства и не копируйте график для другого питомца. Постоянный зуд или повреждение кожи должен оценить ветеринар.",
        ],
      },
      {
        heading: "Какие правила безопасности средств важнее всего?",
        paragraphs: [
          "Средства для животных, помещений и людей не взаимозаменяемы. Не распыляйте комнатный инсектицид на питомца и не наносите ветеринарное средство на кожу человека. Используйте препарат только для указанного на этикетке вида, возраста и веса. Средство от блох для собак нельзя применять на кошке.",
          "Читайте этикетку перед каждым применением. Храните средства вне доступа детей и животных и соблюдайте ограничения на контакт после использования. Другой питомец может вылизать недавно обработанного; держите их раздельно на срок, указанный этикеткой или ветеринаром. Надпись «натуральный» не гарантирует безопасности; не применяйте самодельные смеси.",
          "Если после препарата животному стало плохо, сразу свяжитесь с ветеринаром и сохраните упаковку. Следующие действия зависят от средства и состояния питомца; не придумывайте противоядие и не повторяйте дозу.",
        ],
      },
      {
        heading: "Когда нужна дополнительная помощь?",
        paragraphs: [
          "Обратитесь к ветеринару, если питомцу плохо, зуд или повреждения кожи не проходят, нужно выбрать препарат либо возникло подозрение на нежелательную реакцию. Если блох много, они возвращаются или очаг трудно найти, специалист по борьбе с вредителями оценит необходимость целевой обработки дома. Аэрозольная «бомба» не является быстрым решением по умолчанию и при неправильном использовании опасна.",
          "Симптомы у человека должен оценивать врач, а не сравнение фотографий. При серьёзных признаках, например затруднении дыхания или внезапном отёке рта или горла, нужна срочная помощь. В Грузии при чрезвычайной ситуации звоните 112.",
        ],
      },
      {
        heading: "Как понять, помогает ли план?",
        paragraphs: [
          "Продолжайте проверять питомца и его привычные места отдыха и поддерживать уборку. Из стадий, оставшихся в среде, блохи могут появиться позже; одна новая находка сама по себе не доказывает неудачу плана. Но рост их числа или плохое самочувствие питомца нельзя игнорировать.",
          "Если проблема усиливается или сохраняется, пересмотрите план с ветеринаром или специалистом по борьбе с вредителями. Повторное применение препарата должно соответствовать именно его этикетке и назначению ветеринара; общий срок повторных мер для дома — не график дозирования для животного.",
        ],
      },
      {
        heading: "Как снизить риск повторения?",
        paragraphs: [
          "Регулярно осматривайте питомца и очищайте его лежанку и любимую мягкую мебель. Пылесосьте ковры и мебель, которыми он пользуется, и выбрасывайте отходы снаружи. Подходящую постоянную защиту обсудите с ветеринаром и следуйте инструкции выбранного средства.",
          "Если вы не уверены, какое насекомое нашли, сначала разберитесь с его определением. В [разделе о насекомых](/insects) собраны другие страницы по распознаванию и практические гиды.",
        ],
      },
    ],
    summary:
      "Проверьте питомца и его места отдыха, постирайте подстилку, пропылесосьте ковры и мебель, которыми он пользуется. Защиту животного согласуйте с ветеринаром: дом и каждый питомец требуют совместного плана, но собачье средство нельзя применять на кошке, а комнатное — на животном. Продолжайте уборку и наблюдение; если проблема растёт или питомцу плохо, обращайтесь за помощью.",
    title: "Блохи в доме — что делать, если есть питомец?",
  },
  tr: {
    description:
      "Evde pire ve kedi ya da köpek mi var? Hayvanı kontrol edin, dinlendiği yerleri temizleyin, uygun korumayı veterinerle planlayın ve ilaçları karıştırmayın.",
    faq: [
      {
        answer:
          "Temizlik evcil hayvanın dinlendiği yerlerdeki pirelerle mücadeleye yardımcı olur ama hayvanın üzerindekileri tek başına çözmez. Evi ve hayvanı birlikte ele alın; her hayvana uygun bir plan kullanın.",
        question: "Evi temizlemek tek başına yeterli mi?",
      },
      {
        answer:
          "Halıda ve yatakta pirelerin başka gelişim evreleri kalmış olabilir. Temizliğe ve gözleme devam edin; pireler artarsa veya hayvan iyi değilse planı veteriner ya da haşere kontrol uzmanıyla gözden geçirin. Hayvan ilacını kendi takviminize göre tekrar uygulamayın.",
        question: "Hayvanı tedavi ettim, evde neden hâlâ pire var?",
      },
      {
        answer:
          "Hayır. Köpekler için üretilmiş bir pire ilacını kediye uygulamayın. Etiketteki tür, yaş ve ağırlık koşullarına bakın ve her hayvan için seçimi veterinerle görüşün.",
        question: "Köpeğin ilacını kedide kullanabilir miyim?",
      },
      {
        answer:
          "Ürün seçmeden önce hayvanın yaşını, ağırlığını ve durumunu veterinere bildirin. Pire tarağıyla tüyleri nazikçe kontrol edip yetişkin pireleri uzaklaştırabilirsiniz; etiket bu yaşam evresine izin vermiyorsa ilaç kullanmayın.",
        question: "Yavru kedi veya köpek varsa ne yapmalıyım?",
      },
      {
        answer:
          "Hayır. Kaşıntı ve cilt izlerinin farklı nedenleri olabilir. Hayvanın üzerinde veya yatağında böceğin kendisini arayın; belirsiz ya da kötüleşen cilt sorununu uzmana değerlendirtin.",
        question: "Pireyi yalnızca ısırık izinden anlayabilir miyim?",
      },
      {
        answer:
          "Veterinere evdeki bütün hayvanları ve kullanılmış ürünleri anlatın. Her hayvan için türüne uygun plan gerekir; yeni ilaçlanmış hayvanları etiketin veya veterinerin belirttiği süre boyunca ayrı tutun ki birbirlerini yalamasınlar.",
        question: "Evde birden fazla hayvan varsa ne yapmalıyım?",
      },
    ],
    intro:
      "Evde pire bulursanız hayvanı ve dinlendiği yerleri birlikte ele alın.",
    metaTitle: "Evde pire: temizlik ve evcil hayvan güvenliği",
    quickActions: {
      heading: "Şimdi ne yapmalı?",
      items: [
        "Kedi veya köpeğinizi ve yatağını kontrol edin.",
        "Halı ve mobilyaları süpürün; örtüleri yıkayın.",
        "Hayvan için planı veterinerle görüşün.",
        "İlaçları kendiniz karıştırmayın veya tekrarlamayın.",
      ],
      warning: "Köpekler için üretilmiş pire ilacını kediye asla uygulamayın.",
    },
    sections: [
      {
        heading: "Bunların pire olduğunu nasıl anlarsınız?",
        image: "flea",
        paragraphs: [
          "Yetişkin pire, kanatsız, kızıl kahverengi ve gövdesi yanlardan basık küçük bir böcektir. Buradaki fotoğraf büyütülmüştür; evde bulduğunuz pirenin türünü veya gerçek boyutunu bu kareden çıkaramazsınız. Hayvanın üzerinde ve yatağının çevresinde hareket eden böcekleri arayın. Pire tarağı, hayvanı zorla tutmadan tüylerini incelemeye yardımcı olur.",
          "Hayvanda kaşıntı veya tahriş, daha yakından bakmak için bir nedendir; tek başına pire kanıtı değildir. İnsanın cildindeki kaşıntılı iz için de durum aynıdır: yalnız ısırık fotoğrafından neden belirlenemez. Yapışmış bir kene bulursanız [kene ısırığı rehberine](/insects/tkipis-nakbeni) bakın. Süren cilt sorununu veterinere veya doktora değerlendirtin.",
        ],
      },
      {
        heading: "Neden hem hayvana hem eve bakılmalı?",
        paragraphs: [
          "Pirenin bazı gelişim evreleri hayvanın dinlendiği yatak veya halı gibi yerlerde bulunur. Bu yüzden hayvanda görülen yetişkin pireleri uzaklaştırmak evdeki sorunu bitirmez. Temizlik, her hayvana uygun plan, gerekirse hedefli ortam uygulaması ve takip birlikte yürütülür.",
          "Ev ve hayvan bakımına aynı dönemde başlayın. Bu, bütün hayvanlara aynı ilacı uygulamak veya her odayı mutlaka ilaçlamak demek değildir.",
        ],
      },
      {
        heading: "Hangi yerleri temizlemeli?",
        list: {
          items: [
            "Hayvanın yatağı ve yıkanabilir örtülerinden başlayın. Kumaş talimatına göre yıkayın ve dinlenme alanını düzenli temizleyin.",
            "Özellikle hayvanın yattığı halı ve kilimleri süpürün. Ulaşılabilen duvar kenarlarını ve mobilya altlarını da temizleyin.",
            "Hayvanın kullandığı döşemeli mobilyaları ve minderleri süpürün. Cihaz talimatına uyun; erişilmez bir yere ulaşmak için kumaşı veya mobilyayı zedelemeyin.",
            "Süpürge haznesini boşaltın veya atıkları kapatıp cihaz talimatına göre dışarıda atın. Temizliği tekrarlayın ve aynı yerleri yeniden kontrol edin.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Hayvanın gerçekten kullandığı yerlere odaklanın. Zemini bir kez silmek veya bir kez süpürmek bütün evreleri ortadan kaldırmaz. Düzenli süpürme ve yıkanabilir eşyaları yıkama ilk adımlardır; mobilyaları atmak veya her yüzeye ilaç püskürtmek varsayılan çözüm değildir.",
          "Eve profesyonel bir uygulama yapıldıysa sonraki temizliğin ve geri dönüşün zamanını kullanılan ürünün etiketi ve uzmanın talimatı belirler. Genel temizlik tavsiyesini bunların önüne koymayın.",
        ],
      },
      {
        heading: "Veterinerle konuşmadan önce hangi bilgileri hazırlamalı?",
        list: {
          items: [
            "Hayvanın türü, yaşı ve ağırlığı; yavru, gebe, emziren, yaşlı veya hasta olduğunu belirtin.",
            "Sağlık sorunları, diğer ilaçlar ve pire ürünlerine önceki hassasiyeti.",
            "Önceden kullanılan tüm ürünlerin adı veya ambalajı, ne zaman ve nasıl kullanıldığı, görülen tepkiler.",
            "Evdeki diğer hayvanlar; özellikle ilaçlanmış bir köpekle yaşayan kedi.",
          ],
        },
        paragraphs: [
          "Her hayvana uygun ürünü ve planı veterinerle belirleyin. Yaş, ağırlık, sağlık ve başka tedaviler seçimi etkiler. Pire tarağı bazı yetişkin pireleri uzaklaştırıp izlemeye yardımcı olur; banyo da kimi durumda yardımcı olabilir, fakat ikisi de bütün planın yerini tutmaz. Önceden ilaç uygulanmış hayvanı yıkamadan önce ürünle uyumunu sorun.",
          "Dozu bölmeyin, ürünleri birleştirmeyin ve başka hayvanın takvimini kopyalamayın. Süren kaşıntıyı veya hasarlı deriyi veteriner değerlendirmelidir.",
        ],
      },
      {
        heading: "Ürün güvenliğinde en önemli kurallar neler?",
        paragraphs: [
          "Hayvan, oda ve insan için üretilmiş ürünler birbirinin yerine geçmez. Oda böcek ilacını hayvana püskürtmeyin, hayvan ilacını insan cildine sürmeyin. Hayvan ürününü yalnız etikette belirtilen tür, yaş ve ağırlık için kullanın. Köpekler için üretilmiş pire ilacını kediye uygulamayın.",
          "Her kullanımdan önce etiketi okuyun. Ürünleri çocukların ve hayvanların erişemeyeceği yerde saklayın ve uygulama sonrası temas kısıtlamalarına uyun. Yeni ilaçlanmış hayvanı başka bir hayvan yalayabilir; etikette veya veterinerce belirtilen süre boyunca onları ayrı tutun. ‘Doğal’ sözü tam güvenlik garantisi değildir; ev yapımı karışımlar kullanmayın.",
          "Ürün sonrası hayvan kötüleşirse hemen veterineri arayın ve ambalajı saklayın. Sonraki adım ürüne ve hayvanın durumuna bağlıdır; kendi başınıza panzehir denemeyin veya dozu tekrarlamayın.",
        ],
      },
      {
        heading: "Ne zaman ek yardım gerekir?",
        paragraphs: [
          "Hayvan hasta görünüyorsa, kaşıntı veya deri hasarı sürüyorsa, ürün seçimi gerekiyorsa ya da kötü bir tepkiden şüpheleniyorsanız veterinere başvurun. Pireler çoksa, tekrar çıkıyorsa veya odak bulunamıyorsa haşere kontrol uzmanı evde hedefli uygulama gerekip gerekmediğini değerlendirebilir. Oda sisleme ‘bombası’ varsayılan hızlı çözüm değildir; yanlış kullanımı risklidir.",
          "İnsandaki cilt yakınmalarını ve diğer sağlık sorunlarını fotoğraf karşılaştırması değil doktor değerlendirmelidir. Solunum güçlüğü ya da ağız veya boğazda ani şişme gibi ağır belirtilerde acil yardım isteyin. Gürcistan'da acil durumda 112'yi arayın.",
        ],
      },
      {
        heading: "Planın işe yaradığını nasıl anlarsınız?",
        paragraphs: [
          "Hayvanı ve dinlendiği yerleri kontrol etmeye, temizliğe devam edin. Ortamda kalmış evrelerden sonra yeni pireler çıkabilir; daha sonra görülen tek bir pire planın başarısız olduğunu tek başına göstermez. Fakat sayıları artıyorsa veya hayvan iyi değilse görmezden gelmeyin.",
          "Sorun artar veya sürerse planı veteriner ya da haşere kontrol uzmanıyla gözden geçirin. Ürünün tekrar uygulanması yalnız o ürünün etiketi ve veterinerin planına uymalıdır; ev için genel takip aralığı hayvanın doz takvimi değildir.",
        ],
      },
      {
        heading: "Tekrarını nasıl azaltabilirsiniz?",
        paragraphs: [
          "Hayvanı düzenli kontrol edin; yatağını ve sık kullandığı döşemeli mobilyaları temiz tutun. Kullandığı halıları ve mobilyaları süpürün, atıkları dışarıda boşaltın. Uygun sürekli korumayı veterinerle görüşün ve seçilen ürünün talimatına uyun.",
          "Hangi böceği bulduğunuzdan emin değilseniz kimyasal uygulama kararı vermeden önce onu tanımlayın. [Böcekler bölümünde](/insects) başka tanıma sayfaları ve pratik rehberler bulunur.",
        ],
      },
    ],
    summary:
      "Hayvanı ve dinlendiği yerleri kontrol edin; yatağını yıkayın, kullandığı halı ve mobilyaları süpürün. Hayvana uygun korumayı veterinerle planlayın: ev ve her hayvan birlikte ele alınmalı, ancak köpek ilacı kediye, oda ürünü hayvana uygulanmamalıdır. Temizliğe ve gözleme devam edin; sorun artarsa veya hayvan iyi değilse yardım isteyin.",
    title: "Evde pire — evcil hayvanınız varsa ne yapmalısınız?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "CDC — Preventing Fleas",
    supports: {
      en: "Regular pet checks, veterinarian-guided prevention, vacuuming carpets and upholstery, cleaning pet bedding, and discarding vacuum waste outside.",
      ka: "ცხოველის რეგულარული შემოწმება, ვეტერინართან შეთანხმებული პრევენცია, ხალიჩისა და ავეჯის გაწმენდა, ცხოველის საწოლის მოვლა და მტვერსასრუტის ნარჩენების გარეთ გადაყრა.",
      ru: "Регулярный осмотр питомца, профилактика с ветеринаром, уборка ковров и мебели, чистка подстилки и удаление отходов пылесоса снаружи.",
      tr: "Hayvanın düzenli kontrolü, veterinerle önleme, halı ve mobilyaların süpürülmesi, yatağın temizliği ve süpürge atığının dışarıda atılması.",
    },
    url: "https://www.cdc.gov/fleas/prevention/index.html",
  },
  {
    name: "CDC — Getting Rid of Fleas",
    supports: {
      en: "The four linked parts of control: sanitation, pet treatment, possible home treatment and follow-up; clean pet bedding, carpets and edges; begin home and pet care together.",
      ka: "ოთხი დაკავშირებული მიმართულება: დასუფთავება, ცხოველის მკურნალობა, საჭიროებისამებრ გარემოს დამუშავება და შემდგომი კონტროლი; საწოლის, ხალიჩისა და კედლის კიდეების მოვლა; სახლისა და ცხოველის ერთდროული მართვა.",
      ru: "Четыре связанные меры: уборка, лечение животных, при необходимости обработка дома и наблюдение; чистка подстилок, ковров и краёв пола; параллельная работа с домом и питомцем.",
      tr: "Dört bağlantılı adım: temizlik, hayvan bakımı, gerekirse ev uygulaması ve takip; yatak, halı ve zemin kenarlarının temizliği; ev ve hayvan bakımının eşzamanlı başlaması.",
    },
    url: "https://www.cdc.gov/fleas/getting-rid/index.html",
  },
  {
    name: "US EPA — Controlling Fleas and Ticks on Your Pet",
    supports: {
      en: "Use only the labeled animal species, age and weight; never apply a dog product to a cat; follow labels, protect children and pets, keep packaging, and seek help for reactions.",
      ka: "პრეპარატი მხოლოდ ეტიკეტით დაშვებულ სახეობაზე, ასაკსა და წონაზე; ძაღლის საშუალების კატაზე გამოუყენებლობა; ეტიკეტის დაცვა, ბავშვებისა და ცხოველების დაცვა, შეფუთვის შენახვა და რეაქციისას დახმარება.",
      ru: "Средство только для указанных на этикетке вида, возраста и веса; запрет собачьего препарата для кошки; соблюдение этикетки, защита детей и животных, сохранение упаковки и помощь при реакции.",
      tr: "Ürünü yalnız etiketteki tür, yaş ve ağırlık için kullanmak; köpek ürününü kediye uygulamamak; etikete uymak, çocukları ve hayvanları korumak, ambalajı saklamak ve tepki durumunda yardım almak.",
    },
    url: "https://www.epa.gov/pets/controlling-fleas-and-ticks-your-pet",
  },
  {
    name: "FDA — Safe Use of Flea and Tick Products in Pets",
    supports: {
      en: "Veterinarian selection for young, ill, pregnant or nursing pets and concurrent medicines; no room product on a pet; separate treated animals to prevent grooming; call the vet for a reaction.",
      ka: "ვეტერინართან შერჩევა ახალგაზრდა, ავადმყოფი, მაკე ან მეძუძური ცხოველებისა და სხვა წამლების გათვალისწინებით; ოთახის საშუალება არა ცხოველზე; დამუშავებული ცხოველების განცალკევება ალოკვის თავიდან ასაცილებლად; რეაქციისას ვეტერინართან კავშირი.",
      ru: "Выбор с ветеринаром для молодых, больных, беременных или кормящих животных и при других лекарствах; комнатное средство не для питомца; разделение обработанных животных во избежание вылизывания; связь с ветеринаром при реакции.",
      tr: "Genç, hasta, gebe veya emziren hayvanlarda ve başka ilaçlar varken veterinerle seçim; oda ürününü hayvana uygulamamak; ilaçlanan hayvanları birbirini yalamasın diye ayırmak; tepkide veterineri aramak.",
    },
    url: "https://www.fda.gov/consumers/consumer-updates/safe-use-flea-and-tick-products-pets",
  },
  {
    name: "UC IPM — Fleas (updated September 2010)",
    supports: {
      en: "Adult appearance and life stages in pet resting areas; gentle flea-comb monitoring and regular cleaning. Its old product tables and schedules are not used as current advice.",
      ka: "ზრდასრული რწყილის გარეგნობა და განვითარების ეტაპები ცხოველის მოსასვენებელ გარემოში; სპეციალური სავარცხლით დაკვირვება და რეგულარული წმენდა. ძველი პრეპარატების ცხრილები და გრაფიკები თანამედროვე რჩევად არ არის გამოყენებული.",
      ru: "Внешний вид взрослых блох и стадии развития в местах отдыха животных; наблюдение с гребнем и регулярная уборка. Старые таблицы препаратов и графики не использованы как современные рекомендации.",
      tr: "Yetişkin pirenin görünümü ve hayvanın dinlendiği yerlerdeki gelişim evreleri; pire tarağıyla izleme ve düzenli temizlik. Eski ürün tabloları ve takvimleri güncel tavsiye olarak kullanılmadı.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/fleas/",
  },
  {
    name: "US EPA — Safety Precautions for Total Release Foggers",
    supports: {
      en: "Improper use of total-release foggers can cause fire, explosion or illness; they are not a default quick fix.",
      ka: "ოთახის აეროზოლური „ბომბის“ არასწორმა გამოყენებამ შეიძლება ხანძარი, აფეთქება ან ავადმყოფობა გამოიწვიოს; ის ნაგულისხმევი სწრაფი გამოსავალი არ არის.",
      ru: "Неправильное использование аэрозольных «бомб» может привести к пожару, взрыву или болезни; это не быстрый способ по умолчанию.",
      tr: "Sisleme bombalarının yanlış kullanımı yangın, patlama veya hastalığa yol açabilir; varsayılan hızlı çözüm değildir.",
    },
    url: "https://www.epa.gov/safepestcontrol/safety-precautions-total-release-foggers",
  },
  {
    name: "National Pesticide Information Center — Pesticide Home Remedies",
    supports: {
      en: "Homemade pesticide recipes may lack testing, use instructions and safety warnings; familiar or natural ingredients are not automatically safe.",
      ka: "თვითნაკეთი საშუალების რეცეპტს შეიძლება არ ჰქონდეს შემოწმება, გამოყენების წესი ან უსაფრთხოების გაფრთხილება; ნაცნობი ან ბუნებრივი ნივთიერება ავტომატურად უსაფრთხო არ არის.",
      ru: "Самодельные смеси могут не иметь проверки, инструкции по применению и предупреждений; привычные или натуральные вещества не становятся автоматически безопасными.",
      tr: "Ev yapımı karışımların testleri, kullanım talimatı ve güvenlik uyarısı olmayabilir; tanıdık veya doğal içerikler kendiliğinden güvenli değildir.",
    },
    url: "https://npic.orst.edu/pest/home-remedies.html",
  },
  {
    name: "NHS — Insect bites and stings",
    supports: {
      en: "Skin marks have several possible causes; breathing difficulty or sudden swelling of the mouth or throat may require emergency care.",
      ka: "კანის ნიშნებს სხვადასხვა მიზეზი შეიძლება ჰქონდეს; სუნთქვის გაძნელებას ან პირისა და ყელის უეცარ შეშუპებას გადაუდებელი დახმარება შეიძლება სჭირდებოდეს.",
      ru: "У кожных следов возможны разные причины; затруднение дыхания или внезапный отёк рта или горла могут требовать экстренной помощи.",
      tr: "Cilt izlerinin farklı nedenleri olabilir; solunum güçlüğü veya ağız ya da boğazda ani şişme acil yardım gerektirebilir.",
    },
    url: "https://www.nhs.uk/conditions/insect-bites-and-stings/",
  },
  {
    name: "112 Georgia — When to call 112",
    supports: {
      en: "112 is Georgia's emergency number for situations needing emergency medical or other emergency services.",
      ka: "112 საქართველოში გადაუდებელი სამედიცინო ან სხვა გადაუდებელი სამსახურის გამოძახების ნომერია.",
      ru: "112 — номер экстренных служб Грузии, в том числе скорой медицинской помощи.",
      tr: "112, Gürcistan'da acil sağlık ve diğer acil hizmetlerin numarasıdır.",
    },
    url: "https://112.gov.ge/?page_id=1686&lang=en",
  },
  {
    name: "Wikimedia Commons — Flea, macro (Fedaro, CC BY-SA 4.0)",
    supports: {
      en: "Source, photographer and CC BY-SA 4.0 reuse terms for the magnified adult flea photograph; resized for this guide.",
      ka: "ზრდასრული რწყილის გადიდებული ფოტოს წყარო, ავტორი და CC BY-SA 4.0 ლიცენზია; გიდისთვის ზომა შემცირებულია.",
      ru: "Источник, автор и лицензия CC BY-SA 4.0 увеличенной фотографии взрослой блохи; для гида размер уменьшен.",
      tr: "Büyütülmüş yetişkin pire fotoğrafının kaynağı, fotoğrafçısı ve CC BY-SA 4.0 lisansı; rehber için yeniden boyutlandırıldı.",
    },
    url: "https://commons.wikimedia.org/wiki/File:Flea,_macro.jpg",
  },
];

export const FLEAS_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Illustrative home scene: an adult gently combs a calm dog beside its bed, with a vacuum in the room",
      ka: "საილუსტრაციო საოჯახო სცენა: ადამიანი მშვიდ ძაღლს ფრთხილად ვარცხნის მის საწოლთან, ოთახში მტვერსასრუტიც ჩანს",
      ru: "Иллюстративная домашняя сцена: человек бережно расчёсывает спокойную собаку рядом с её лежанкой; в комнате виден пылесос",
      tr: "Örnek ev sahnesi: bir yetişkin sakin bir köpeği yatağının yanında nazikçe tarıyor; odada süpürge görülüyor",
    },
    credit: {
      en: "Illustrative image generated with AI; not a field photograph.",
      ka: "AI-ით შექმნილი საილუსტრაციო გამოსახულება; არ არის საველე ფოტო.",
      ru: "Иллюстративное изображение создано ИИ; это не полевая фотография.",
      tr: "Yapay zekâ ile oluşturulmuş örnek görsel; saha fotoğrafı değildir.",
    },
    height: 941,
    src: "/images/guides/fleas-home-pet-care-hero.jpg",
    width: 1672,
  },
  id: "fleas-in-house",
  images: {
    flea: {
      alt: {
        en: "Magnified macro photograph of an adult flea viewed from the side; it does not show actual size",
        ka: "ზრდასრული რწყილის გვერდითი ხედი გადიდებულ მაკროფოტოზე; ნამდვილი ზომა ნაჩვენები არ არის",
        ru: "Увеличенная макрофотография взрослой блохи сбоку; реальный размер не показан",
        tr: "Yandan görülen yetişkin pirenin büyütülmüş makro fotoğrafı; gerçek boyutu göstermez",
      },
      credit: {
        en: "Photo: Fedaro / Wikimedia Commons, CC BY-SA 4.0; resized. Magnified view.",
        ka: "ფოტო: Fedaro / Wikimedia Commons, CC BY-SA 4.0; ზომა შემცირებულია. გადიდებული ხედი.",
        ru: "Фото: Fedaro / Wikimedia Commons, CC BY-SA 4.0; размер уменьшен. Увеличенный вид.",
        tr: "Fotoğraf: Fedaro / Wikimedia Commons, CC BY-SA 4.0; yeniden boyutlandırıldı. Büyütülmüş görünüm.",
      },
      height: 1003,
      src: "/images/guides/flea-adult-macro-fedaro.jpg",
      width: 1400,
    },
  },
  messageKey: "fleasInHouse",
  ogImage: "/og/images/guides/fleas-in-house.jpg",
  parentHub: "insects",
  pathname: "/insects/rtsqilebi-sakhlshi",
  relatedGuideIds: ["tick-bite", "ants-in-house"],
  search: {
    icon: "guide",
    keywords: [
      "რწყილი",
      "რწყილები სახლში",
      "რწყილები კატაზე",
      "რწყილები ძაღლზე",
      "რწყილები ხალიჩაში",
      "რწყილების მოშორება",
      "rtsqilebi sakhlshi",
      "fleas in house",
      "fleas on cat",
      "fleas on dog",
      "блохи дома",
      "блохи у кошки",
      "evde pire",
      "kedide pire",
    ],
    rank: 5,
    subtitle: {
      en: "Clean the home, protect the pet, and plan safe treatment with a vet",
      ka: "გარემოს მოვლა, ცხოველის დაცვა და ვეტერინართან შეთანხმებული მოქმედება",
      ru: "Уборка дома, защита питомца и безопасный план с ветеринаром",
      tr: "Evi temizleme, hayvanı koruma ve veterinerle güvenli plan",
    },
    title: {
      en: "Fleas in the house",
      ka: "რწყილები სახლში",
      ru: "Блохи в доме",
      tr: "Evde pire",
    },
  },
  sources: SOURCES,
});
