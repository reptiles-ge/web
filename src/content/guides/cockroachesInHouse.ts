import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "inspection" | "trap";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Found cockroaches at home? Check hiding places, remove food and moisture, monitor with sticky traps, use baits safely, and know when to call a professional.",
    faq: [
      {
        answer:
          "One sighting does not tell you how many are present. Inspect likely hiding places and compare catches in sticky traps over the next few days.",
        question: "Does one cockroach mean there are many?",
      },
      {
        answer:
          "Even a tidy home can offer water, food or access through a gap. Look for leaks, crumbs behind appliances and openings around doors or pipes without blaming yourself.",
        question: "Why are there cockroaches in a clean home?",
      },
      {
        answer:
          "No. A sticky trap helps locate and monitor activity; it is different from an insecticide bait and rarely solves the underlying problem by itself.",
        question: "Is a sticky trap enough?",
      },
      {
        answer:
          "Baits are not immediate. Follow the product label, keep monitoring and reassess food, water and hiding places if activity continues; there is no universal timetable.",
        question: "How quickly should a bait work?",
      },
      {
        answer:
          "Keep traps and pesticide products out of their reach. Use only products labeled for the intended indoor use, follow every warning, and keep them in their original packaging.",
        question: "What if children or pets live here?",
      },
    ],
    intro:
      "Start by finding where they move, removing easy food and water, then checking whether the activity declines. A spray alone will not fix the cause.",
    metaTitle: "Cockroaches at home: how to get rid of them safely",
    quickSteps: {
      heading: "What should I do now?",
      items: [
        "Look under the sink, inside cabinets and behind appliances without taking them apart.",
        "Seal food, clear crumbs and rubbish, and wipe up spilled water; repair leaks.",
        "Place sticky monitoring traps along walls and check where activity occurs.",
        "If you choose a bait, read its label first and keep it away from children and pets.",
      ],
    },
    sections: [
      {
        heading: "What signs should I look for?",
        paragraphs: [
          "Live or dead cockroaches, dark spots or smears, shed skins and egg cases can point to activity. A single insect does not reveal the size of the problem. Note where and when you saw it, then inspect nearby hiding places.",
          "A cockroach seen at home is not automatically an Oriental cockroach. For identification features of one documented species in Georgia, see the [Oriental cockroach profile](blatta-orientalis). This guide applies more broadly.",
        ],
      },
      {
        heading: "Where should I check?",
        image: "inspection",
        paragraphs: [
          "Use a flashlight to look under the sink, in the back of cabinets, along skirting boards and cracks, and behind accessible appliances. Look for moisture and dark marks. Do not dismantle electrical appliances or put chemicals inside them.",
          "Check boxes or stored items before bringing them inside. If you find a repeated trail, note the location so you can target cleaning and monitoring there.",
        ],
      },
      {
        heading: "What should I change at home?",
        paragraphs: [
          "Store food in well-closed containers, clear crumbs and spills, and use a lidded rubbish bin that you empty regularly. Clean behind accessible kitchen appliances and remove unnecessary cardboard and paper piles that offer shelter.",
          "Repair leaking pipes, wipe up pooled water and address persistent dampness. Keep pets' drinking water available; instead, clear spilled water and leftover food around their bowls. Seal gaps around pipes, cabinets, doors and skirting boards where cockroaches may enter or hide.",
        ],
      },
      {
        heading: "How do I tell whether things are improving?",
        image: "trap",
        paragraphs: [
          "A sticky trap catches insects for detection and monitoring. Place it along a wall near suspected hiding places, away from children and pets. Check traps regularly and compare which locations catch insects before and after your changes.",
          "An insecticide bait contains a pesticide that a cockroach eats. It serves a different purpose. A sticky trap alone does not promise complete removal; persistent catches mean you should look again for food, water, hiding places or entry gaps.",
        ],
      },
      {
        heading: "When do baits or gels help?",
        paragraphs: [
          "A cockroach bait station or gel may help when activity is established, alongside cleaning and sealing. Baits work gradually and may take a week or longer to show a reduction. Results depend on the situation; do not expect an overnight fix.",
          "Choose a product labeled for cockroaches and the intended indoor location. Follow its instructions and warnings for placement and repeat use. Never increase the dose on your own. Keep bait, gel and packaging out of children's and pets' reach; a closed station does not remove every risk. Store products in their original containers. Do not use an outdoor-only product indoors.",
        ],
      },
      {
        heading: "What should I avoid?",
        paragraphs: [
          "Do not spray the whole room at random. Sprays alone do not give lasting control and may scatter cockroaches into other areas. Total-release aerosol foggers, or “bug bombs,” often miss their hiding cracks; their flammable contents and pesticide exposure create additional risks.",
          "Do not mix chemicals or make food-based poison recipes. Do not put pesticides into electrical equipment or spread poisonous powders on surfaces people and pets can touch. A “natural” label is not proof of safety or effectiveness.",
        ],
      },
      {
        heading: "When should I call a professional?",
        paragraphs: [
          "Get help when activity is heavy, hard to locate or keeps returning despite cleaning, sealing and monitoring. Ask the professional to find and correct the sources of food, water and entry, explain the chosen treatment, and identify the product used. There is no single number of sightings that sets a threshold for every home.",
        ],
      },
      {
        heading: "How can I reduce the chance of a return?",
        list: {
          items: [
            "Keep food covered, crumbs cleared and rubbish closed.",
            "Fix leaks and clear spills while keeping pets' drinking water available.",
            "Remove excess cardboard, seal gaps and check incoming boxes.",
            "Recheck sticky traps; if activity rises again, look for a missed source or ask for help.",
          ],
        },
        paragraphs: [
          "These steps reduce the conditions that help cockroaches persist. They cannot guarantee that none will ever return.",
        ],
      },
    ],
    summary:
      "Inspect likely hiding places, remove easy food and excess moisture, and seal entry gaps. Use sticky traps to see where activity continues. If you choose an insecticide bait, follow its label and keep it out of reach of children and pets. Seek professional help for a persistent or complex problem.",
    title: "Cockroaches at home: how to get rid of them and keep them out",
  },
  ka: {
    description:
      "ტარაკნები სახლში? იპოვეთ სამალავები, მოაშორეთ საკვები და ტენი, დააკვირდით წებოვანი დამჭერით, უსაფრთხოდ გამოიყენეთ სატყუარა და საჭიროებისას მიმართეთ სპეციალისტს.",
    faq: [
      {
        answer:
          "ერთი დანახვით ვერ გავიგებთ, რამდენი ტარაკანაა სახლში. შეამოწმეთ შესაძლო სამალავები და რამდენიმე დღის განმავლობაში დააკვირდით წებოვან დამჭერებს.",
        question: "ერთი ტარაკანა ვნახე — სახლში ბევრია?",
      },
      {
        answer:
          "მოწესრიგებულ სახლშიც შეიძლება იყოს წყალი, საკვების ნამცეცი ან შემოსასვლელი ღრიჭო. შეამოწმეთ გაჟონვა, ტექნიკის უკან დარჩენილი ნარჩენები და კარისა თუ მილების ირგვლივ არსებული ღიობები.",
        question: "რატომ ჩნდებიან ტარაკნები სუფთა სახლშიც?",
      },
      {
        answer:
          "არა. წებოვანი დამჭერი გეხმარებათ ტარაკნების აღმოჩენასა და მათი აქტივობის დაკვირვებაში. ის ინსექტიციდიანი სატყუარა არ არის და პრობლემის მიზეზს თავისთავად ვერ აგვარებს.",
        question: "წებოვანი დამჭერი საკმარისია?",
      },
      {
        answer:
          "სატყუარა მყისიერად არ მოქმედებს. მიჰყევით კონკრეტული პროდუქტის ეტიკეტს, განაგრძეთ დაკვირვება და, თუ ტარაკნები ისევ ჩანან, ხელახლა შეამოწმეთ საკვები, წყალი და სამალავები.",
        question: "რამდენ ხანში უნდა ველოდო სატყუარის შედეგს?",
      },
      {
        answer:
          "დამჭერი და ნებისმიერი ქიმიური საშუალება მათთვის მიუწვდომელ ადგილას მოათავსეთ. გამოიყენეთ მხოლოდ სახლისთვის განკუთვნილი პროდუქტი, დაიცავით ეტიკეტის ყველა გაფრთხილება და შეინახეთ თავდაპირველ შეფუთვაში.",
        question: "რა გავაკეთო, თუ სახლში ბავშვი ან შინაური ცხოველია?",
      },
    ],
    intro:
      "ჯერ გაარკვიეთ, სად მოძრაობენ ტარაკნები, მოაშორეთ ადვილად მისაწვდომი საკვები და წყალი, შემდეგ კი შეამოწმეთ, მცირდება თუ არა მათი რაოდენობა. მარტო შეწამვლა მიზეზს ვერ აგვარებს.",
    metaTitle: "ტარაკნები სახლში — როგორ მოვიშოროთ უსაფრთხოდ?",
    quickSteps: {
      heading: "რა გავაკეთო ახლა?",
      items: [
        "შეამოწმეთ ნიჟარის ქვეშ, კარადებში და ტექნიკის უკან; ტექნიკა არ დაშალოთ.",
        "დახურეთ საკვები, მოაშორეთ ნამცეცები და ნარჩენები, გაწმინდეთ დაღვრილი წყალი და შეაკეთეთ გაჟონვა.",
        "კედლის გასწვრივ დადგით წებოვანი დამჭერი და დააკვირდით, სად ჩანს აქტივობა.",
        "თუ სატყუარას იყენებთ, ჯერ წაიკითხეთ ეტიკეტი და მოარიდეთ ბავშვებსა და ცხოველებს.",
      ],
    },
    sections: [
      {
        heading: "როგორ შევამჩნიოთ პრობლემა?",
        paragraphs: [
          "ცოცხალი ან მკვდარი ტარაკნები, მუქი წერტილები ან ლაქები, გამოცვლილი კანი და კვერცხების გარსები მათი აქტივობის კვალი შეიძლება იყოს. ერთი ტარაკნის ნახვით პრობლემის მასშტაბს ვერ განსაზღვრავთ. ჩაინიშნეთ, სად და როდის ნახეთ, შემდეგ კი ახლომდებარე სამალავები შეამოწმეთ.",
          "სახლში ნანახი ტარაკანა ავტომატურად შავი ტარაკანა არ არის. საქართველოში დაფიქსირებული ერთ-ერთი სახეობის ნიშნები იხილეთ [შავი ტარაკნის პროფილზე](blatta-orientalis). ეს გიდი სხვადასხვა ტარაკნის შემთხვევაში დაგეხმარებათ.",
        ],
      },
      {
        heading: "სად შევამოწმოთ?",
        image: "inspection",
        paragraphs: [
          "ფანრით დაათვალიერეთ ნიჟარის ქვეშ, კარადების უკანა ნაწილი, პლინტუსის გასწვრივ არსებული ღრიჭოები და ხელმისაწვდომი ადგილი ტექნიკის უკან. მოძებნეთ ნესტი და მუქი კვალი. ელექტრომოწყობილობა არ დაშალოთ და მასში ქიმიური საშუალება არ ჩაასხათ.",
          "სახლში შემოტანამდე შეამოწმეთ ყუთებიც. თუ ერთ ადგილას კვალი მეორდება, დაიმახსოვრეთ ის ადგილი დასუფთავებისა და შემდგომი დაკვირვებისთვის.",
        ],
      },
      {
        heading: "რა შევცვალოთ სახლში?",
        paragraphs: [
          "საკვები მჭიდროდ დახურულ ჭურჭელში შეინახეთ. მოაშორეთ ნამცეცები და დაღვრილი საკვები, ნარჩენები კი თავდახურულ ურნაში მოათავსეთ და რეგულარულად გაიტანეთ. გაასუფთავეთ ტექნიკის უკან ხელმისაწვდომი ადგილი. მოაშორეთ ზედმეტი მუყაო და ქაღალდის გროვები, რომლებიც სამალავად გამოდგება.",
          "შეაკეთეთ გაჟონილი მილები, გაწმინდეთ დაგუბებული წყალი და მოაწესრიგეთ მუდმივად ნესტიანი ადგილი. შინაურ ცხოველს სასმელი წყალი არ მოაკლოთ; მის ჯამთან დაღვრილი წყალი და დარჩენილი საკვები მოაწესრიგეთ. ამოავსეთ ღრიჭოები მილებთან, კარადებთან, კარებსა და პლინტუსებთან, საიდანაც ტარაკნები შეიძლება შემოვიდნენ ან დაიმალონ.",
        ],
      },
      {
        heading: "როგორ დავაკვირდეთ შედეგს?",
        image: "trap",
        paragraphs: [
          "წებოვანი დამჭერი ტარაკნის აღმოჩენასა და აქტივობის დაკვირვებას ემსახურება. დადგით ის კედლის გასწვრივ, სავარაუდო სამალავთან, ბავშვებისა და ცხოველებისთვის მიუწვდომლად. რეგულარულად შეამოწმეთ და შეადარეთ, სად იჭერება ტარაკანა ცვლილებებამდე და შემდეგ.",
          "ინსექტიციდიანი სატყუარა სხვა საშუალებაა: მასში ქიმიური ნივთიერებაა, რომელსაც ტარაკანა ჭამს. წებოვანი დამჭერი სრულ მოშორებას არ გვპირდება. თუ დამჭერში ტარაკნები კვლავ ჩნდებიან, ხელახლა მოძებნეთ საკვების, წყლის, სამალავის ან შემოსასვლელი ღრიჭოს წყარო.",
        ],
      },
      {
        heading: "როდის გამოგვადგება სატყუარა ან გელი?",
        paragraphs: [
          "ტარაკნების საწინააღმდეგო დახურული სატყუარა ან გელი შეიძლება დაგეხმაროთ, როცა აქტივობა უკვე განმეორებით ჩანს. ისინი დასუფთავებასა და ღრიჭოების დახურვასთან ერთად მუშაობს. შედეგი მყისიერი არ არის; რაოდენობის შემცირებას ზოგჯერ ერთი კვირა ან მეტიც სჭირდება.",
          "აირჩიეთ ტარაკნებისთვის და სახლის შესაბამისი ადგილისთვის განკუთვნილი პროდუქტი. განთავსებისა და ხელახალი გამოყენებისას დაიცავით კონკრეტული ეტიკეტის ინსტრუქცია და გაფრთხილებები. დოზა თვითნებურად არ გაზარდოთ. სატყუარა, გელი და შეფუთვა ბავშვებისა და ცხოველებისთვის მიუწვდომლად შეინახეთ — დახურული კონტეინერიც ყველა რისკს არ აქრობს. საშუალება თავდაპირველ შეფუთვაში დატოვეთ; გარეთ გამოსაყენებელი საშუალება სახლში არ გამოიყენოთ.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        paragraphs: [
          "მთელი ოთახი უსისტემოდ არ შეწამლოთ. სპრეი მარტო ხანგრძლივ შედეგს არ იძლევა და ტარაკნები შეიძლება სხვა ადგილებშიც გაფანტოს. ოთახის აეროზოლური „ბომბები“ ხშირად ვერ აღწევს იმ ღრიჭოებამდე, სადაც ისინი იმალებიან. აალებადმა აეროზოლმა შეიძლება ხანძრის, ხოლო ქიმიურ ნივთიერებასთან შეხებამ — ჯანმრთელობის რისკი შექმნას.",
          "არ აურიოთ ქიმიური საშუალებები და არ მოამზადოთ თვითნაკეთი შხამიანი სატყუარა საკვებით. ნუ ჩაასხამთ პრეპარატს ელექტროტექნიკაში და ნუ მოაყრით შხამიან ფხვნილს ხელმისაწვდომ ზედაპირებზე. „ბუნებრივი“ საშუალების სახელწოდება მის უსაფრთხოებას ან ეფექტიანობას არ ამტკიცებს.",
        ],
      },
      {
        heading: "როდის გვჭირდება სპეციალისტი?",
        paragraphs: [
          "მიმართეთ სპეციალისტს, თუ ტარაკნები ბევრგან ჩნდებიან, მათი სამალავი ძნელად საპოვნელია ან დასუფთავების, ღრიჭოების დახურვისა და დაკვირვების მიუხედავად ისევ ბრუნდებიან. სთხოვეთ, მოძებნოს საკვების, წყლისა და შემოსვლის მიზეზიც, აგიხსნათ არჩეული მეთოდი და გითხრათ გამოყენებული საშუალების სახელი. ყველა სახლისთვის ერთი რაოდენობრივი ზღვარი არ არსებობს.",
        ],
      },
      {
        heading: "როგორ შევამციროთ დაბრუნების შანსი?",
        list: {
          items: [
            "საკვები დახურეთ, ნამცეცები მოაშორეთ, ურნა თავდახურული დატოვეთ.",
            "გაჟონვა შეაკეთეთ და დაღვრილი წყალი გაწმინდეთ; ცხოველს სასმელი წყალი შეუნარჩუნეთ.",
            "ზედმეტი მუყაო მოაშორეთ, ღრიჭოები დახურეთ და შემოტანილი ყუთები შეამოწმეთ.",
            "წებოვანი დამჭერები კვლავ ნახეთ; თუ აქტივობა მოიმატებს, გამორჩენილი მიზეზი მოძებნეთ ან დახმარება ითხოვეთ.",
          ],
        },
        paragraphs: [
          "ეს მოქმედებები ტარაკნებისთვის ხელსაყრელ პირობებს ამცირებს, მაგრამ სამუდამო არდაბრუნების გარანტია არ არის.",
        ],
      },
    ],
    summary:
      "შეამოწმეთ სავარაუდო სამალავები, მოაშორეთ მისაწვდომი საკვები და ზედმეტი ტენი, დახურეთ შემოსასვლელი ღრიჭოები. წებოვანი დამჭერით დააკვირდით, სად გრძელდება აქტივობა. თუ ინსექტიციდიან სატყუარას აირჩევთ, დაიცავით ეტიკეტი და მოარიდეთ ბავშვებსა და შინაურ ცხოველებს. რთული ან განმეორებადი პრობლემისას სპეციალისტს მიმართეთ.",
    title: "ტარაკნები სახლში — როგორ მოვიშოროთ და აღარ დაბრუნდნენ?",
  },
  ru: {
    description:
      "Нашли тараканов дома? Проверьте укрытия, уберите еду и влагу, следите за клеевыми ловушками, безопасно применяйте приманки и знайте, когда звать специалиста.",
    faq: [
      {
        answer:
          "По одной встрече нельзя определить их число. Осмотрите возможные укрытия и несколько дней сравнивайте улов в клеевых ловушках.",
        question: "Один таракан означает, что дома их много?",
      },
      {
        answer:
          "Даже в аккуратном доме могут быть вода, крошки или щель для входа. Проверьте протечки, остатки пищи за техникой и зазоры возле дверей и труб.",
        question: "Почему тараканы бывают в чистом доме?",
      },
      {
        answer:
          "Нет. Она помогает обнаруживать тараканов и наблюдать за их активностью. Это не инсектицидная приманка, и сама по себе ловушка не устраняет причину.",
        question: "Достаточно ли клеевой ловушки?",
      },
      {
        answer:
          "Приманка не действует мгновенно. Следуйте этикетке, продолжайте наблюдение и при повторных находках снова проверьте пищу, воду и укрытия.",
        question: "Когда ждать результата от приманки?",
      },
      {
        answer:
          "Держите ловушки и пестициды вне их доступа. Используйте только средство для нужного применения в помещении, соблюдайте предупреждения и храните его в исходной упаковке.",
        question: "Что делать, если дома дети или животные?",
      },
    ],
    intro:
      "Сначала выясните, где перемещаются тараканы, уберите доступные пищу и воду, затем проверьте, уменьшается ли активность. Одно опрыскивание не решит причину.",
    metaTitle: "Тараканы дома: как избавиться от них безопасно",
    quickSteps: {
      heading: "Что сделать сейчас?",
      items: [
        "Осмотрите место под мойкой, шкафы и пространство за техникой, не разбирая её.",
        "Закройте продукты, уберите крошки, мусор и пролитую воду, устраните протечки.",
        "Поставьте клеевые ловушки вдоль стен и следите, где есть активность.",
        "Если выбираете приманку, сначала прочитайте этикетку и уберите её от детей и животных.",
      ],
    },
    sections: [
      {
        heading: "Какие следы искать?",
        paragraphs: [
          "Живые или мёртвые тараканы, тёмные точки и пятна, сброшенные покровы и оболочки яиц могут указывать на их активность. Одна встреча не показывает масштаб проблемы. Запомните место и время, затем осмотрите ближайшие укрытия.",
          "Найденный дома таракан не обязательно является чёрным. Признаки одного вида, отмеченного в Грузии, описаны в [профиле чёрного таракана](blatta-orientalis). Этот материал применим шире.",
        ],
      },
      {
        heading: "Где осмотреть?",
        image: "inspection",
        paragraphs: [
          "С фонарём осмотрите место под мойкой, заднюю часть шкафов, щели вдоль плинтусов и доступное пространство за техникой. Ищите влагу и тёмные следы. Не разбирайте электроприборы и не заливайте в них химикаты.",
          "Проверяйте коробки перед тем, как занести их домой. Отметьте места, где следы повторяются: там стоит сосредоточить уборку и наблюдение.",
        ],
      },
      {
        heading: "Что изменить дома?",
        paragraphs: [
          "Держите продукты в плотно закрытой таре, убирайте крошки и разлитую пищу. Складывайте отходы в закрытое ведро и регулярно выносите их. Очистите доступное место за кухонной техникой, уберите лишние картонные коробки и стопки бумаги.",
          "Устраните протечки, вытрите лужицы и разберитесь с постоянной сыростью. Не лишайте питомца питьевой воды: убирайте пролитую воду и остатки корма вокруг мисок. Заделайте щели у труб, шкафов, дверей и плинтусов.",
        ],
      },
      {
        heading: "Как следить за результатом?",
        image: "trap",
        paragraphs: [
          "Клеевая ловушка служит для обнаружения тараканов и наблюдения за их активностью. Поставьте её вдоль стены у предполагаемого укрытия вне доступа детей и животных. Регулярно проверяйте и сравнивайте улов до и после изменений.",
          "Инсектицидная приманка действует иначе: в ней содержится вещество, которое таракан поедает. Клеевая ловушка не обещает полного избавления. Если улов сохраняется, снова ищите доступную пищу, воду, укрытия и входные щели.",
        ],
      },
      {
        heading: "Когда помогают приманка и гель?",
        paragraphs: [
          "Готовая приманка или гель от тараканов могут помочь, если активность уже повторяется, вместе с уборкой и заделкой щелей. Эффект не мгновенный: уменьшение числа тараканов иногда заметно через неделю или позже.",
          "Выбирайте средство, предназначенное для тараканов и нужного места в доме. Следуйте этикетке при размещении и повторном применении; не увеличивайте дозу самовольно. Приманка, гель и упаковка должны быть недоступны детям и животным: закрытая станция не устраняет все риски. Храните средство в исходной таре. Не используйте средство для улицы внутри дома.",
        ],
      },
      {
        heading: "Чего не делать?",
        paragraphs: [
          "Не распыляйте инсектицид по всей комнате без плана. Спрей сам по себе не даёт долгого контроля и может разогнать тараканов по другим местам. Аэрозольные «бомбы» часто не достигают укромных щелей; горючий аэрозоль несёт риск пожара, а контакт с пестицидом — риск для здоровья.",
          "Не смешивайте химикаты и не готовьте самодельную отравленную приманку с пищей. Не заливайте препараты в электроприборы и не рассыпайте ядовитый порошок на доступных поверхностях. Слово «натуральный» не доказывает безопасность или эффективность.",
        ],
      },
      {
        heading: "Когда нужен специалист?",
        paragraphs: [
          "Обратитесь за помощью, если тараканы появляются во многих местах, укрытие трудно найти или проблема возвращается после уборки, герметизации щелей и наблюдения. Попросите специалиста найти источник пищи, воды и путь входа, объяснить метод и назвать применённое средство. Универсального числового порога нет.",
        ],
      },
      {
        heading: "Как уменьшить вероятность возвращения?",
        list: {
          items: [
            "Закрывайте продукты, убирайте крошки, держите ведро закрытым.",
            "Чините протечки и вытирайте воду, сохраняя питомцу доступ к питью.",
            "Уберите лишний картон, закройте щели, проверяйте принесённые коробки.",
            "Проверяйте клеевые ловушки; при новой активности ищите пропущенный источник или обращайтесь за помощью.",
          ],
        },
        paragraphs: [
          "Эти меры сокращают благоприятные условия для тараканов, но не дают вечной гарантии.",
        ],
      },
    ],
    summary:
      "Осмотрите возможные укрытия, уберите доступную пищу и лишнюю влагу, заделайте входные щели. Клеевые ловушки покажут, где активность продолжается. Если применяете инсектицидную приманку, следуйте этикетке и держите её вне доступа детей и животных. При сложной или повторяющейся проблеме обратитесь к специалисту.",
    title: "Тараканы дома: как избавиться от них и снизить риск возвращения",
  },
  tr: {
    description:
      "Evde hamam böceği mi var? Saklandıkları yerleri kontrol edin, yiyecek ve nemi azaltın, yapışkan tuzaklarla izleyin, yemi güvenle kullanın; gerekirse uzman çağırın.",
    faq: [
      {
        answer:
          "Tek bir gözlem evde kaç böcek olduğunu göstermez. Olası saklanma yerlerini inceleyin ve birkaç gün boyunca yapışkan tuzaklarda yakalananları karşılaştırın.",
        question: "Bir hamam böceği gördüm; evde çok mu var?",
      },
      {
        answer:
          "Düzenli bir evde bile su, kırıntı veya giriş aralığı bulunabilir. Sızıntıları, cihazların arkasındaki artıkları ve kapı ya da boru çevresindeki boşlukları kontrol edin.",
        question: "Temiz bir evde neden hamam böceği olur?",
      },
      {
        answer:
          "Hayır. Yapışkan tuzak böcekleri bulmaya ve hareketliliği izlemeye yarar; böcek ilacı içeren yem değildir ve sorunun nedenini tek başına gidermez.",
        question: "Yapışkan tuzak yeterli mi?",
      },
      {
        answer:
          "Yem hemen etki göstermez. Ürün etiketine uyun, izlemeyi sürdürün ve böcekler yeniden görülürse yiyecek, su ve saklanma yerlerini tekrar kontrol edin.",
        question: "Yemin etkisini ne zaman görürüm?",
      },
      {
        answer:
          "Tuzakları ve ilaçları ulaşamayacakları yerde tutun. Yalnızca amaçlanan iç mekân kullanımına uygun ürünü seçin, bütün uyarılara uyun ve özgün ambalajında saklayın.",
        question: "Evde çocuk veya evcil hayvan varsa ne yapmalıyım?",
      },
    ],
    intro:
      "Önce hamam böceklerinin nerede dolaştığını bulun, kolay ulaştıkları yiyecek ve suyu azaltın, ardından hareketliliğin azalıp azalmadığını izleyin. Tek başına ilaçlama nedeni çözmez.",
    metaTitle: "Evde hamam böceği: güvenli biçimde nasıl kurtulunur?",
    quickSteps: {
      heading: "Şimdi ne yapmalıyım?",
      items: [
        "Lavabo altına, dolaplara ve cihazların arkasına bakın; cihazları sökmeyin.",
        "Yiyecekleri kapatın, kırıntıları, çöpleri ve dökülen suyu temizleyin; sızıntıları onarın.",
        "Duvar boyunca yapışkan izleme tuzakları koyup hareketliliği kontrol edin.",
        "Yem kullanacaksanız önce etiketi okuyun, çocuklardan ve hayvanlardan uzak tutun.",
      ],
    },
    sections: [
      {
        heading: "Hangi izlere bakmalıyım?",
        paragraphs: [
          "Canlı veya ölü hamam böcekleri, koyu noktalar ve lekeler, dökülmüş dış kabuklar ve yumurta kılıfları hareketliliğe işaret edebilir. Tek bir böcek sorunun boyutunu göstermez. Nerede ve ne zaman gördüğünüzü not edip yakınlardaki saklanma yerlerine bakın.",
          "Evde görülen her hamam böceği kara hamam böceği değildir. Gürcistan'da kaydedilmiş bir türün ayırt edici özellikleri için [kara hamam böceği profiline](blatta-orientalis) bakın. Bu rehber daha geniş kapsamlıdır.",
        ],
      },
      {
        heading: "Nereleri kontrol etmeliyim?",
        image: "inspection",
        paragraphs: [
          "El feneriyle lavabonun altına, dolapların arkasına, süpürgeliklerdeki aralıklara ve cihazların arkasındaki erişilebilir yerlere bakın. Nem ve koyu izler arayın. Elektrikli cihazları sökmeyin veya içlerine kimyasal dökmeyin.",
          "Kutuları eve getirmeden önce inceleyin. İzler aynı yerde yineleniyorsa temizlik ve izleme için orayı not edin.",
        ],
      },
      {
        heading: "Evde neyi değiştirmeliyim?",
        paragraphs: [
          "Yiyecekleri sıkıca kapalı kaplarda saklayın; kırıntıları ve dökülen yiyecekleri temizleyin. Atıkları kapaklı çöp kutusunda tutup düzenli çıkarın. Mutfak cihazlarının arkasındaki erişilebilir yerleri temizleyin, gereksiz karton ve kâğıt yığınlarını kaldırın.",
          "Sızdıran boruları onarın, birikmiş suyu silin ve sürekli nemli yerleri düzeltin. Evcil hayvanın içme suyunu kesmeyin; kabının çevresindeki dökülmüş suyu ve kalan mamayı temizleyin. Boruların, dolapların, kapıların ve süpürgeliklerin çevresindeki giriş ve saklanma aralıklarını kapatın.",
        ],
      },
      {
        heading: "Sonucu nasıl izlerim?",
        image: "trap",
        paragraphs: [
          "Yapışkan tuzak hamam böceklerini bulmak ve hareketliliği izlemek içindir. Duvar dibine, olası saklanma yerine yakın ve çocuklarla hayvanların erişemeyeceği bir yere koyun. Düzenli kontrol edip değişikliklerden önceki ve sonraki yakalamaları karşılaştırın.",
          "Böcek ilacı içeren yem farklıdır: böceğin yediği bir kimyasal içerir. Yapışkan tuzak tek başına tüm böcekleri yok etmez. Yakalamalar sürüyorsa yiyecek, su, saklanma yeri veya giriş aralığı arayın.",
        ],
      },
      {
        heading: "Yem ve jel ne zaman yardımcı olur?",
        paragraphs: [
          "Hamam böceği yemi veya jeli, hareketlilik tekrarlanıyorsa temizlik ve aralıkların kapatılmasıyla birlikte yardımcı olabilir. Etkisi anlık değildir; azalma bazen bir hafta veya daha uzun sürede görülür.",
          "Hamam böcekleri ve evde kullanılacağı yer için etiketlenmiş ürün seçin. Yerleştirme ve yeniden uygulamada ürünün talimatlarına ve uyarılarına uyun; dozu kendiniz artırmayın. Yemi, jeli ve ambalajı çocuklar ve hayvanlardan uzak tutun; kapalı istasyon bütün riskleri ortadan kaldırmaz. Ürünü özgün ambalajında saklayın. Dış mekân ürünü evin içinde kullanmayın.",
        ],
      },
      {
        heading: "Nelerden kaçınmalıyım?",
        paragraphs: [
          "Tüm odaya gelişigüzel ilaç püskürtmeyin. Sprey tek başına kalıcı kontrol sağlamaz ve böcekleri başka alanlara dağıtabilir. Odayı dolduran aerosol 'böcek bombaları' saklandıkları aralıklara çoğu zaman ulaşmaz; yanıcı aerosol yangın, ilaca maruz kalmak ise sağlık riski yaratabilir.",
          "Kimyasalları karıştırmayın veya yiyecekle ev yapımı zehirli yem hazırlamayın. Elektrikli cihazların içine ilaç dökmeyin, erişilebilir yüzeylere zehirli toz serpmeyin. 'Doğal' sözcüğü güvenli ya da etkili olduğunu kanıtlamaz.",
        ],
      },
      {
        heading: "Ne zaman uzman çağırmalıyım?",
        paragraphs: [
          "Böcekler birçok yerde görülüyorsa, saklandıkları yeri bulmak güçse veya temizlik, aralıkları kapatma ve izlemeye rağmen geri dönüyorlarsa yardım alın. Uzmandan yiyecek, su ve giriş kaynaklarını bulmasını, yöntemi açıklamasını ve kullanılan ürünü söylemesini isteyin. Her ev için tek bir sayısal eşik yoktur.",
        ],
      },
      {
        heading: "Geri gelme olasılığını nasıl azaltırım?",
        list: {
          items: [
            "Yiyecekleri kapatın, kırıntıları temizleyin, çöp kutusunun kapağını kapalı tutun.",
            "Sızıntıları onarın ve dökülen suyu silin; hayvanın içme suyunu koruyun.",
            "Fazla kartonu kaldırın, aralıkları kapatın, eve gelen kutuları kontrol edin.",
            "Yapışkan tuzakları izleyin; hareketlilik artarsa kaçan nedeni arayın veya yardım alın.",
          ],
        },
        paragraphs: [
          "Bu adımlar hamam böceklerine uygun koşulları azaltır, fakat bir daha hiç gelmeyeceklerini garanti etmez.",
        ],
      },
    ],
    summary:
      "Olası saklanma yerlerini inceleyin, kolay ulaşılan yiyeceği ve fazla nemi azaltın, giriş aralıklarını kapatın. Yapışkan tuzaklar hareketliliğin nerede sürdüğünü gösterir. Böcek ilacı içeren yem seçerseniz etikete uyun, çocukların ve hayvanların erişemeyeceği yerde tutun. Karmaşık veya yinelenen sorunda uzman çağırın.",
    title:
      "Evde hamam böceği: nasıl kurtulunur ve geri gelmeleri nasıl azaltılır?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "UC IPM — Cockroaches",
    supports: {
      en: "Signs, hiding places, food and moisture control, exclusion, sticky-trap monitoring, bait timing and limitations of sprays and foggers.",
      ka: "ნიშნები, სამალავები, საკვებისა და ტენის შემცირება, ღრიჭოების დახურვა, წებოვანი დამჭერით დაკვირვება, სატყუარის მოქმედება და სპრეისა თუ ფოგერის შეზღუდვები.",
      ru: "Следы, укрытия, ограничение пищи и влаги, закрытие щелей, наблюдение ловушками, действие приманок и ограничения аэрозолей.",
      tr: "İzler, saklanma yerleri, yiyecek ve nemi azaltma, aralıkları kapatma, yapışkan tuzakla izleme, yemlerin etkisi ve spreylerin sınırları.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/cockroaches/",
  },
  {
    name: "US EPA — Do's and Don'ts of Pest Control",
    supports: {
      en: "Prevention and safe pesticide use: follow labels, keep products from children and pets, retain original packaging, avoid excess dose and outdoor-only products indoors.",
      ka: "პრევენცია და საშუალების უსაფრთხო გამოყენება: ეტიკეტის დაცვა, ბავშვებისა და ცხოველებისთვის მიუწვდომლობა, თავდაპირველი შეფუთვა, ზედმეტი დოზისა და გარე საშუალების სახლში გამოყენების თავიდან აცილება.",
      ru: "Профилактика и безопасное применение: соблюдать этикетку, беречь детей и животных, хранить в исходной таре, избегать избыточной дозы и уличных средств дома.",
      tr: "Önleme ve güvenli kullanım: etikete uyma, çocuklar ve hayvanlardan uzak tutma, özgün ambalaj, fazla doz ve dış mekân ürününü içeride kullanmama.",
    },
    url: "https://www.epa.gov/safepestcontrol/dos-and-donts-pest-control",
  },
  {
    name: "US EPA — Safety Precautions for Total Release Foggers",
    supports: {
      en: "The fire and pesticide-exposure hazards of total-release aerosol foggers.",
      ka: "ოთახის აეროზოლური „ბომბების“ ხანძრისა და ქიმიურ ნივთიერებასთან შეხების რისკი.",
      ru: "Риски пожара и контакта с пестицидом при использовании аэрозольных «бомб».",
      tr: "Odayı dolduran aerosol cihazlarının yangın ve ilaca maruz kalma riskleri.",
    },
    url: "https://www.epa.gov/safepestcontrol/safety-precautions-total-release-foggers",
  },
];

const ILLUSTRATION_CREDIT = {
  en: "Synthetic illustration",
  ka: "სინთეზური ილუსტრაცია",
  ru: "Синтетическая иллюстрация",
  tr: "Yapay görsel",
};

export const COCKROACHES_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Illustration of a cockroach beside a skirting board in a home kitchen",
      ka: "ტარაკნის ილუსტრაცია სახლის სამზარეულოში, პლინტუსთან",
      ru: "Иллюстрация таракана у плинтуса на домашней кухне",
      tr: "Ev mutfağında süpürgelik yanındaki hamam böceği çizimi",
    },
    credit: ILLUSTRATION_CREDIT,
    height: 941,
    src: "/images/guides/cockroaches-at-home-hero.jpg",
    width: 1672,
  },
  id: "cockroaches-at-home",
  images: {
    inspection: {
      alt: {
        en: "Illustration of a person inspecting beneath a kitchen sink with a flashlight",
        ka: "ილუსტრაცია: ადამიანი ფანრით ათვალიერებს ნიჟარის ქვეშ სივრცეს",
        ru: "Иллюстрация осмотра места под кухонной мойкой с фонарём",
        tr: "Mutfak lavabosunun altını el feneriyle inceleyen kişinin görseli",
      },
      credit: ILLUSTRATION_CREDIT,
      height: 941,
      src: "/images/guides/cockroaches-at-home-inspection.jpg",
      width: 1672,
    },
    trap: {
      alt: {
        en: "Illustration of a cardboard sticky monitoring trap beside a kitchen skirting board",
        ka: "ილუსტრაცია: მუყაოს წებოვანი დამჭერი სამზარეულოს პლინტუსთან",
        ru: "Иллюстрация картонной клеевой ловушки у кухонного плинтуса",
        tr: "Mutfak süpürgeliği yanındaki karton yapışkan izleme tuzağı görseli",
      },
      credit: ILLUSTRATION_CREDIT,
      height: 941,
      src: "/images/guides/cockroaches-at-home-trap.jpg",
      width: 1672,
    },
  },
  messageKey: "cockroachesInHouse",
  ogImage: "/og/images/guides/cockroaches-at-home.jpg",
  parentHub: "insects",
  pathname: "/insects/taraknebi-sakhlshi",
  relatedGuideIds: ["ants-in-house"],
  relatedSpeciesIds: ["blatta-orientalis"],
  search: {
    icon: "guide",
    keywords: [
      "ტარაკნები სახლში",
      "ტარაკანა",
      "შავი ტარაკანა",
      "taraknebi sakhlshi",
      "cockroaches at home",
      "cockroach control",
      "тараканы дома",
      "как избавиться от тараканов",
      "evde hamam böceği",
      "hamam böceği nasıl yok edilir",
    ],
    rank: 5,
    subtitle: {
      en: "Inspect, remove food and moisture, monitor and use bait safely",
      ka: "შემოწმება, საკვებისა და ტენის შემცირება, დაკვირვება და უსაფრთხო სატყუარა",
      ru: "Осмотр, уменьшение пищи и влаги, наблюдение и безопасная приманка",
      tr: "İnceleme, yiyecek ve nemi azaltma, izleme ve güvenli yem kullanımı",
    },
    title: {
      en: "Cockroaches at home",
      ka: "ტარაკნები სახლში",
      ru: "Тараканы дома",
      tr: "Evde hamam böceği",
    },
  },
  sources: SOURCES,
});
