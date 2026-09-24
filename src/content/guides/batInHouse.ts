import type { AppLocale } from "@/i18n/routing";

type GuideCopy = {
  description: string;
  faq: { answer: string; question: string }[];
  lead: string;
  metaTitle: string;
  sections: {
    heading: string;
    image?: "on-wall" | "roost";
    paragraphs: string[];
  }[];
  title: string;
};

export const BAT_IN_HOUSE_COPY: Record<AppLocale, GuideCopy> = {
  en: {
    description:
      "A bat flew into your home? Stay calm, keep people and pets away, open an exterior exit, and learn when medical advice is needed after contact.",
    faq: [
      {
        answer:
          "Often through an open window or door, or while following insects. Young or inexperienced bats may also enter by mistake. Seeing a bat indoors does not mean it is attacking people.",
        question: "Why did a bat fly into the house?",
      },
      {
        answer:
          "Close internal doors, keep the room calm, open windows or an exterior door widely, clear curtains or blinds that block the exit, and switch off unnecessary lights. Give the bat time and space to leave.",
        question: "How do I get a bat out of a room?",
      },
      {
        answer:
          "No. Avoid bare-hand contact. Bat Conservation Trust and similar wildlife advice recommend thick gloves if handling is unavoidable, and prefer containment methods that avoid direct touch.",
        question: "Can I touch a bat with my hands?",
      },
      {
        answer:
          "Bats do not typically hunt people. Indoor flight often looks frantic because the animal is trying to find a way out in an unfamiliar space.",
        question: "Do bats attack people?",
      },
      {
        answer:
          "Most bats people encounter are not rabid, but appearance cannot rule infection out. WHO treats direct bat contact as a serious exposure category. After a bite, scratch, or uncertain contact, seek medical or public-health advice.",
        question: "Can a bat have rabies?",
      },
      {
        answer:
          "Wash the wound thoroughly with soap and water as soon as possible, then get prompt medical assessment. Do not wait to see whether symptoms appear. In Georgia, call 112 for urgent medical help.",
        question: "What should I do after a bat bite?",
      },
      {
        answer:
          "It may be searching for an exit. Circling alone is not proof of illness. Keep people and pets away and give it a clear path outdoors.",
        question: "Why is the bat flying in circles indoors?",
      },
      {
        answer:
          "A grounded, injured, or repeatedly failing bat needs quiet isolation and professional wildlife or veterinary guidance. Do not invent improvised treatment, and do not handle it bare-handed.",
        question: "What if the bat cannot fly?",
      },
      {
        answer:
          "Move children and pets out of the room first. Close the door behind them, then open an exterior exit for the bat. If anyone may have had direct contact while asleep or unsupervised, seek medical advice even if a bite is not obvious.",
        question: "What if a child or pet is in the house?",
      },
    ],
    lead: "If a bat is indoors: stay calm, keep people and pets away, and avoid bare hands. If there was a bite, a scratch, or possible direct contact and you are not sure it can be ruled out, get medical advice first and do not release the bat on your own. If safe, isolate it to one room and open an exterior window or door so it can leave. Do not chase or strike it. After a bite, scratch, or uncertain direct contact, wash and seek medical advice; in Georgia call 112 for emergencies.",
    metaTitle: "A bat flew into the house — what should you do?",
    sections: [
      {
        heading: "What to do if a bat flies into your home",
        paragraphs: [
          "A bat indoors is usually trying to escape, not to attack. Close doors to other rooms so it cannot move deeper into the building. Keep children and pets out. Open one or more exterior windows or an exterior door as wide as practical, clear curtains, blinds, and furniture that block the opening, and turn off unnecessary indoor lights so the outdoor exit is easier to find.",
          "Then step back. Bat Conservation Trust guidance for a bat flying indoors in the evening is to give it time to orient and leave rather than chasing it around the room. Check later — including curtain folds and behind furniture — to confirm it has gone.",
        ],
      },
      {
        heading: "What not to do",
        image: "on-wall",
        paragraphs: [
          "Do not catch it with bare hands. Do not hit, throw, or kill it. Do not chase it aggressively around the room, and do not let pets interact with it. Avoid improvised traps, sprays, or poisons. Those actions raise the chance of injury to people and to the bat, and they make a calm exit harder.",
        ],
      },
      {
        heading: "Why did the bat come inside?",
        paragraphs: [
          "Common explanations include an open window or door, accidental navigation while hunting insects near lights, and young or inexperienced animals entering by mistake. Buildings can also offer roosting gaps. A single indoor sighting does not by itself prove that a colony lives in the house.",
        ],
      },
      {
        heading: "How to help a bat leave safely",
        paragraphs: [
          "Wildlife guidance prefers passive exit for a bat flying indoors in the evening: one room, open exterior openings, quieter indoor lights, and time. If it is cold or very windy outside, or the bat is flying during the day, do not try to send it outside immediately — wait for it to settle and get professional advice before acting. Do not try to grab a flying bat.",
          "If the bat has landed and will not leave, some wildlife organisations describe covering it with a box and sliding card underneath while wearing thick gloves, then releasing outdoors at an appropriate time. That is a last resort for a calm, grounded bat — not for chasing a flying one — and it is inappropriate if you cannot do it safely. Prefer advice from a wildlife professional when unsure.",
        ],
      },
      {
        heading: "Should you touch a bat?",
        paragraphs: [
          "No — not with bare hands. Even a brief touch can create a bite or scratch risk that is easy to miss. If handling cannot be avoided, wildlife advice emphasises thick gloves and methods that minimise direct contact. After any possible bare-skin contact, treat the situation as medically relevant and seek advice.",
        ],
      },
      {
        heading: "What if the bat will not fly away?",
        paragraphs: [
          "An injured bat, a bat on the floor, one that repeatedly fails to fly, a bat found active by day, or one that remains indoors for a long time may need professional help. Keep people and pets away, reduce disturbance, and contact wildlife rescue, a veterinarian, or another qualified service available where you are. Do not invent feeding or treatment at home.",
          "This page does not list Georgia-specific rescue hotlines, because reliable public contacts change and are not always published in one place. Use local wildlife, veterinary, or municipal channels you trust.",
        ],
      },
      {
        heading: "If a bat bites or scratches you",
        paragraphs: [
          "Bat bites can be small and easy to overlook. CDC guidance is to wash a known bite or scratch with soap and water and get medical help right away. WHO also recommends thorough washing with soap and water for at least 15 minutes after exposure, then clinical assessment for rabies post-exposure care when indicated.",
          "Seek prompt medical or public-health advice after a bite, a scratch, saliva on mucous membranes or broken skin, or situations — including some sleep or unsupervised child contacts — where direct contact cannot be ruled out with confidence. Do not release or discard the animal casually if public-health staff ask that it be assessed. This page cannot diagnose exposure or prescribe a vaccine schedule.",
        ],
      },
      {
        heading: "Bats and rabies",
        paragraphs: [
          "Bats can carry rabies lyssaviruses in some regions, and WHO classifies exposures due to direct contact with bats as a severe exposure category requiring assessment for post-exposure prophylaxis. That does not mean most bats people see are infected, and it does not mean that seeing a bat indoors is automatically a medical emergency.",
          "Infection cannot be ruled out by appearance. Keep risk proportional: avoid contact; after possible direct exposure, get advice. Publicly available, up-to-date figures for bat rabies in Georgia are limited, so do not import another country’s statistics as if they describe Georgia.",
        ],
      },
      {
        heading: "Why bats matter",
        image: "roost",
        paragraphs: [
          "Insectivorous bats eat large numbers of night-flying insects and can help suppress agricultural pests. Globally, some bat species also pollinate plants or disperse seeds; those roles are not equally shared by every species. Killing a bat that wandered indoors solves a short fear and removes an animal that is usually trying to leave.",
        ],
      },
      {
        heading: "Bats in Georgia",
        paragraphs: [
          "An expert-curated occurrence dataset published in 2023 records 30 bat species for Georgia across four families. That is a national fauna overview, not a household checklist, and this guide does not attempt species-level identification from an indoor sighting.",
          "If bats repeatedly appear in living rooms, there may be gaps from a roost space into the interior. Sealing internal gaps is a building issue that should not trap animals inside wall cavities; when in doubt, seek advice before permanent works. Reptiles.ge does not yet publish individual bat species profiles.",
        ],
      },
    ],
    title: "A bat flew into the house — what should you do?",
  },
  ka: {
    description:
      "ღამურა სახლში შემოფრინდა? შეინარჩუნეთ სიმშვიდე, ადამიანები და ცხოველები მოარიდეთ, გახსენით გარე გასასვლელი და გაიგეთ, როდის არის საჭირო სამედიცინო რჩევა.",
    faq: [
      {
        answer:
          "ხშირად ღია ფანჯრით ან კარით, ან მწერების დევნისას. ახალგაზრდა ან გამოუცდელმა ცხოველმა შეიძლება შეცდომით შევიდეს. შიდა ფრენა თავდასხმას არ ნიშნავს.",
        question: "რატომ შემოფრინდა ღამურა სახლში?",
      },
      {
        answer:
          "დახურეთ შიდა კარები, ოთახი მშვიდად დატოვეთ, ფართოდ გახსენით ფანჯრები ან გარე კარი, გაასუფთავეთ ფარდები და ჟალუზები და გამორთეთ ზედმეტი შუქი. მიეცით დრო და სივრცე გასასვლელად.",
        question: "როგორ გავიყვანოთ ღამურა ოთახიდან?",
      },
      {
        answer:
          "არა. შიშველი ხელით ნუ შეეხებით. თუ შეხება გარდაუვალია, ველური ბუნების ორგანიზაციები სქელ ხელთათმანებს გირჩევენ და უპირატესობას ანიჭებენ შეხების გარეშე მოთავსებას.",
        question: "შეიძლება ღამურას ხელით შეხება?",
      },
      {
        answer:
          "ღამურები ადამიანზე ნადირობას, როგორც წესი, არ მიმართავენ. ოთახში ფრენა ხშირად იმიტომ გამოიყურება აჩქარებულად, რომ ცხოველი უცნობ სივრცეში გასასვლელს ეძებს.",
        question: "ღამურა ადამიანზე თავს ესხმის?",
      },
      {
        answer:
          "შეხვედრილი ღამურების უმეტესობა ცოფიანი არ არის, მაგრამ გარეგნობით ინფექცია ვერ გამოირიცხება. ჯანმო პირდაპირ კონტაქტს სერიოზულ ექსპოზიციად განიხილავს. ნაკბენის, ნაკაწრის ან გაურკვეველი კონტაქტის შემდეგ მიმართეთ სამედიცინო რჩევას.",
        question: "შეიძლება ღამურა ცოფიანი იყოს?",
      },
      {
        answer:
          "რაც შეიძლება მალე საფუძვლიანად დაიბანეთ ადგილი საპნითა და წყლით, შემდეგ დროულად მიიღეთ სამედიცინო შეფასება. სიმპტომების მოლოდინი ნუ დაიწყებთ. საქართველოში გადაუდებელ შემთხვევაში დარეკეთ 112-ზე.",
        question: "რა გავაკეთოთ ღამურას ნაკბენის შემდეგ?",
      },
      {
        answer:
          "შეიძლება გასასვლელს ეძებდეს. წრეზე ფრენა თავისთავად ავადმყოფობის მტკიცებულება არ არის. ადამიანები და ცხოველები მოარიდეთ და გარეთ გასვლა გაუმარტივეთ.",
        question: "რატომ დაფრინავს ღამურა ოთახში წრეზე?",
      },
      {
        answer:
          "დაზიანებულ, მიწაზე მყოფ ან განმეორებით ჩამოვარდნილ ცხოველს სჭირდება სიმშვიდე და პროფესიონალური რჩევა. სახლის პირობებში მკურნალობა ნუ გამოიგონოთ და შიშველი ხელით ნუ დაიჭერთ.",
        question: "რა გავაკეთოთ, თუ ღამურა ვერ დაფრინავს?",
      },
      {
        answer:
          "ჯერ ბავშვები და შინაური ცხოველები გამოიყვანეთ ოთახიდან, კარი დახურეთ, შემდეგ ღამურას გარე გასასვლელი გაუხსენით. თუ ძილისას ან ზედამხედველობის გარეშე პირდაპირი კონტაქტი სავარაუდოა, სამედიცინო რჩევა მაინც მიიღეთ.",
        question: "როგორ მოვიქცეთ, თუ სახლში ბავშვი ან შინაური ცხოველია?",
      },
    ],
    lead: "თუ ღამურა სახლშია: შეინარჩუნეთ სიმშვიდე, ადამიანები და ცხოველები მოარიდეთ, შიშველი ხელით ნუ შეეხებით. თუ ნაკბენი, ნაკაწრი ან შესაძლო პირდაპირი კონტაქტი იყო და მის გამორიცხვაში დარწმუნებული არ ხართ, ჯერ სამედიცინო რჩევა მიიღეთ და ღამურა თვითნებურად ნუ გაათავისუფლებთ. უსაფრთხოების შემთხვევაში ერთ ოთახში შემოფარგლეთ და გახსენით გარე ფანჯარა ან კარი. ნუ დაედევნებით და ნუ დაარტყამთ. ნაკბენის, ნაკაწრის ან გაურკვეველი პირდაპირი კონტაქტის შემდეგ დაიბანეთ და მიმართეთ სამედიცინო რჩევას; საქართველოში გადაუდებელ შემთხვევაში — 112.",
    metaTitle: "ღამურა სახლში შემოფრინდა — როგორ მოვიქცეთ?",
    sections: [
      {
        heading: "რა გავაკეთოთ, თუ ღამურა სახლში შემოფრინდა?",
        paragraphs: [
          "სახლში შემოფრენილი ღამურა ჩვეულებრივ გასასვლელს ეძებს და არა თავდასხმას. დახურეთ სხვა ოთახებისკენ მიმავალი კარები, რომ ცხოველი უფრო ღრმად არ გადაინაცვლოს. ბავშვები და შინაური ცხოველები გამოიყვანეთ. ერთი ან რამდენიმე გარე ფანჯარა ან გარე კარი რაც შეიძლება ფართოდ გახსენით, გაასუფთავეთ ფარდები, ჟალუზები და ავეჯი, რომლებიც გასასვლელს ბლოკავს, და გამორთეთ ზედმეტი შიდა შუქი, რომ გარე ღიობი უფრო ადვილად მოინახოს.",
          "შემდეგ უკან დაიხიეთ. Bat Conservation Trust-ის რჩევა საღამოს შიდა ფრენისას არის დროის მიცემა ორიენტაციისა და გასვლისთვის და არა ოთახში დევნა. მოგვიანებით შეამოწმეთ — ფარდების ნაოჭებისა და ავეჯის უკანაც — რომ ცხოველი მართლაც გასულია.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        image: "on-wall",
        paragraphs: [
          "შიშველი ხელით ნუ დაიჭერთ. ნუ დაარტყამთ, ნუ გადააგდებთ და ნუ მოკლავთ. ნუ დაედევნებით აგრესიულად ოთახში და შინაურ ცხოველებს ნუ მისცემთ მასთან კონტაქტს. ნუ გამოიყენებთ თვითნაკეთ მახეებს, აეროზოლებს ან შხამს. ეს ქმედებები ზრდის დაზიანების რისკს ადამიანისთვისაც და ცხოველისთვისაც და ართულებს მშვიდ გასვლას.",
        ],
      },
      {
        heading: "რატომ შემოფრინდა ღამურა სახლში?",
        paragraphs: [
          "ხშირი მიზეზებია ღია ფანჯარა ან კარი, მწერებზე ნადირობისას შემთხვევითი შიგნით შესვლა და ახალგაზრდა ან გამოუცდელი ცხოველის შეცდომა. შენობებში შეიძლება იყოს დასამალ ადგილებთან ხვრელებიც. ერთი შიდა შემთხვევა თავისთავად არ ამტკიცებს, რომ სახლში კოლონია ცხოვრობს.",
        ],
      },
      {
        heading: "როგორ გავიყვანოთ ღამურა სახლიდან უსაფრთხოდ?",
        paragraphs: [
          "ველური ბუნების სახელმძღვანელოებში საღამოს მფრინავი ღამურისთვის სასურველი მიდგომაა პასიური გასვლა: ერთი ოთახი, ღია გარე ღიობები, უფრო მშვიდი შიდა განათება და დრო. თუ გარეთ ცივა, ძლიერი ქარია ან ღამურა დღისით დაფრინავს, მისი დაუყოვნებლივ გარეთ გაშვება ნუ სცადეთ — დაელოდეთ მის დაჯდომას და უსაფრთხო მოქმედებისთვის პროფესიონალური რჩევა მიიღეთ. მფრინავი ცხოველის ხელით დაჭერა ნუ სცადოთ.",
          "თუ ღამურა დაჯდა და არ გადის, ზოგი ორგანიზაცია აღწერს ყუთით გადაფარვას და ქვემოდან მუყაოს შეყვანას სქელი ხელთათმანებით, შემდეგ გარეთ გაშვებას შესაფერის დროს. ეს უკანასკნელი გამოსავალია მშვიდად მყოფი ცხოველისთვის — არა მფრინავის დასაჭერად — და შეუფერებელია, თუ უსაფრთხოდ ვერ ასრულებთ. გაურკვევლობისას პროფესიონალური რჩევა უპირატესია.",
        ],
      },
      {
        heading: "შეიძლება ღამურას ხელით შეხება?",
        paragraphs: [
          "არა — შიშველი ხელით არა. მოკლე შეხებამაც შეიძლება ნაკბენის ან ნაკაწრის რისკი შექმნას, რომელიც ადვილად გამორჩება. თუ შეხება გარდაუვალია, ველური ბუნების რჩევა ხაზს უსვამს სქელ ხელთათმანებს და შეხების მინიმიზაციას. შიშველ კანთან შესაძლო კონტაქტის შემდეგ სიტუაცია სამედიცინოდ მნიშვნელოვნად ჩათვალეთ და რჩევა მიიღეთ.",
        ],
      },
      {
        heading: "რას ვაკეთებთ, თუ ღამურა ვერ გაფრინდა?",
        paragraphs: [
          "დაზიანებულ, იატაკზე მყოფ, განმეორებით ჩამოვარდნილ, დღისით აქტიურ ან დიდხანს შიგნით დარჩენილ ცხოველს შეიძლება პროფესიონალური დახმარება დასჭირდეს. ადამიანები და ცხოველები მოარიდეთ, შეწუხება შეამცირეთ და მიმართეთ ველური ბუნების გადარჩენის, ვეტერინარის ან სხვა ხელმისაწვდომ კვალიფიციურ სერვისს. სახლში კვება ან მკურნალობა ნუ გამოიგონოთ.",
          "ეს გვერდი საქართველოს კონკრეტულ სამაშველო ცხელ ხაზებს არ ასახელებს, რადგან საჯარო კონტაქტები იცვლება და ყოველთვის ერთ ადგილას არ ქვეყნდება. გამოიყენეთ ადგილობრივი ველური ბუნების, ვეტერინარული ან მუნიციპალური არხები, რომლებსაც ენდობით.",
        ],
      },
      {
        heading: "რა ხდება, თუ ღამურამ გვიკბინა ან დაგვკაწრა?",
        paragraphs: [
          "ღამურას ნაკბენი შეიძლება პატარა იყოს და ადვილად გამორჩეს. CDC ურჩევს ცნობილი ნაკბენის ან ნაკაწრის საპნითა და წყლით დაბანას და დაუყოვნებლივ სამედიცინო დახმარებას. ჯანმო ასევე გირჩევთ ექსპოზიციის შემდეგ საპნითა და წყლით მინიმუმ 15 წუთიან საფუძვლიან დაბანას, შემდეგ კლინიკურ შეფასებას ცოფის საწინააღმდეგო პროფილაქტიკისთვის, როცა ეს ნაჩვენებია.",
          "დროული სამედიცინო ან საზოგადოებრივი ჯანდაცვის რჩევა მიიღეთ ნაკბენის, ნაკაწრის, ლორწოვანზე ან ღია ჭრილობაზე ნერწყვის მოხვედრის, ან ისეთი სიტუაციების შემდეგ — მათ შორის ზოგი ძილის ან ზედამხედველობის გარეშე ბავშვის კონტაქტისას — როცა პირდაპირი კონტაქტი თავდაჯერებით ვერ გამოირიცხება. ცხოველი უბრალოდ ნუ გაუშვით ან ნუ გადააგდეთ, თუ საზოგადოებრივი ჯანდაცვის სპეციალისტი შეფასებას ითხოვს. ეს გვერდი ექსპოზიციას ვერ ადგენს და აცრის გრაფიკს ვერ ნიშნავს.",
        ],
      },
      {
        heading: "ღამურა და ცოფი",
        paragraphs: [
          "ზოგ რეგიონში ღამურები შეიძლება ცოფის ლისავირუსების რეზერვუარი იყვნენ და ჯანმო ღამურასთან პირდაპირ კონტაქტს მძიმე ექსპოზიციის კატეგორიად მიიჩნევს, რაც პროფილაქტიკის შეფასებას მოითხოვს. ეს არ ნიშნავს, რომ ადამიანის მიერ ნანახი ღამურების უმეტესობა ინფიცირებულია, და არც იმას, რომ სახლში დანახვა ავტომატურად სამედიცინო გადაუდებელ შემთხვევას ქმნის.",
          "ინფექცია გარეგნობით ვერ გამოირიცხება. რისკი პროპორციულად შეაფასეთ: კონტაქტი აარიდეთ; შესაძლო პირდაპირი ექსპოზიციის შემდეგ რჩევა მიიღეთ. საქართველოში ღამურების ცოფის აქტუალური საჯარო სტატისტიკა შეზღუდულია — სხვა ქვეყნის ციფრები საქართველოს სურათად ნუ ჩათვლით.",
        ],
      },
      {
        heading: "რატომ არის ღამურა მნიშვნელოვანი?",
        image: "roost",
        paragraphs: [
          "მწერიჭამია ღამურები ღამით დიდი რაოდენობით მწერებს ჭამენ და შეიძლება სასოფლო-სამეურნეო მავნებლების შეკავებაშიც დაეხმარონ. გლობალურად ზოგი სახეობა მცენარეებსაც აბინძურებს ან თესლს ავრცელებს; ეს როლი ყველა სახეობას ერთნაირად არ ეკუთვნის. შემთხვევით შემოფრენილი ცხოველის მოკვლა მოკლე შიშს აგვარებს და იმ ცხოველს აშორებს, რომელიც ჩვეულებრივ გასვლას ცდილობს.",
        ],
      },
      {
        heading: "ღამურები საქართველოში",
        paragraphs: [
          "2023 წელს გამოქვეყნებული ექსპერტულად შემოწმებული გავრცელების მონაცემთა ნაკრები საქართველოში 30 სახეობის ღამურას ასახელებს ოთხი ოჯახიდან. ეს ეროვნული ფაუნის მიმოხილვაა და არა საყოფაცხოვრებო სია; ეს გიდი შიდა დანახვით სახეობის იდენტიფიკაციას არ ცდილობს.",
          "თუ საცხოვრებელ ოთახებში განმეორებით ჩნდებიან, შესაძლოა ღრუდან შიგნით ხვრელები იყოს. შიდა ხვრელების დახშობა სამშენებლო საკითხია და ცხოველები კედლის ღრუში არ უნდა ჩაიჭედონ; მუდმივ სამუშაოებამდე გაურკვევლობისას რჩევა მიიღეთ. Reptiles.ge-ზე ღამურების სახეობრივი პროფილები ჯერ არ არის გამოქვეყნებული.",
        ],
      },
    ],
    title: "ღამურა სახლში შემოფრინდა — რა უნდა გავაკეთოთ?",
  },
  ru: {
    description:
      "В дом влетела летучая мышь? Сохраняйте спокойствие, уберите людей и животных, откройте выход наружу и узнайте, когда нужна медицинская консультация.",
    faq: [
      {
        answer:
          "Часто через открытое окно или дверь либо при преследовании насекомых. Молодые или неопытные животные могут зайти по ошибке. Полёт в помещении не означает нападение.",
        question: "Почему летучая мышь залетела в дом?",
      },
      {
        answer:
          "Закройте внутренние двери, сохраняйте тишину, широко откройте окна или наружную дверь, уберите шторы и жалюзи и выключите лишний свет. Дайте время и пространство уйти.",
        question: "Как вывести летучую мышь из комнаты?",
      },
      {
        answer:
          "Нет. Не касайтесь голыми руками. Если контакт неизбежен, организации по охране дикой природы советуют плотные перчатки и способы без прямого касания.",
        question: "Можно ли трогать летучую мышь руками?",
      },
      {
        answer:
          "Летучие мыши обычно не охотятся на людей. В комнате полёт часто выглядит суетливым, потому что животное ищет выход в незнакомом пространстве.",
        question: "Нападают ли летучие мыши на людей?",
      },
      {
        answer:
          "Большинство встреченных людьми летучих мышей не больны бешенством, но по виду инфекцию не исключить. ВОЗ относит прямой контакт с ними к тяжёлой экспозиции. После укуса, царапины или неясного контакта обратитесь за медицинской помощью.",
        question: "Может ли летучая мышь быть бешеной?",
      },
      {
        answer:
          "Как можно скорее тщательно промойте место мылом и водой, затем срочно обратитесь за медицинской оценкой. Не ждите симптомов. В Грузии при неотложной ситуации звоните 112.",
        question: "Что делать после укуса летучей мыши?",
      },
      {
        answer:
          "Возможно, ищет выход. Кружение само по себе не доказывает болезнь. Уберите людей и животных и дайте свободный путь наружу.",
        question: "Почему летучая мышь кружит по комнате?",
      },
      {
        answer:
          "Травмированному, лежащему на полу или повторно не взлетающему животному нужны покой и профессиональная помощь. Не придумывайте лечение дома и не берите голыми руками.",
        question: "Что делать, если летучая мышь не летает?",
      },
      {
        answer:
          "Сначала выведите детей и питомцев, закройте дверь, затем откройте наружный выход для животного. Если возможен прямой контакт во сне или без присмотра, обратитесь за советом даже без явного укуса.",
        question: "Что делать, если в доме ребёнок или питомец?",
      },
    ],
    lead: "Если летучая мышь в доме: сохраняйте спокойствие, уберите людей и животных, не трогайте голыми руками. Если был укус, царапина или возможный прямой контакт и вы не уверены, что его можно исключить, сначала получите медицинскую консультацию и не выпускайте летучую мышь самостоятельно. Если это безопасно, ограничьте её одной комнатой и откройте наружное окно или дверь. Не гоняйте и не бейте. После укуса, царапины или неясного прямого контакта промойте рану и обратитесь за медицинской помощью; в Грузии при неотложке — 112.",
    metaTitle: "В дом влетела летучая мышь — что делать?",
    sections: [
      {
        heading: "Что делать, если летучая мышь влетела в дом",
        paragraphs: [
          "Летучая мышь в помещении обычно ищет выход, а не нападает. Закройте двери в другие комнаты, чтобы она не ушла глубже в здание. Уберите детей и животных. Широко откройте одно или несколько наружных окон или наружную дверь, уберите шторы, жалюзи и мебель, перекрывающие проём, и выключите лишний свет в комнате, чтобы выход наружу было легче найти.",
          "Затем отойдите. Рекомендация Bat Conservation Trust при вечернем полёте в помещении — дать время сориентироваться и уйти, а не гонять животное по комнате. Позже проверьте — в том числе складки штор и пространство за мебелью — что оно действительно ушло.",
        ],
      },
      {
        heading: "Чего делать не следует",
        image: "on-wall",
        paragraphs: [
          "Не ловите голыми руками. Не бейте, не бросайте и не убивайте. Не гоняйте агрессивно по комнате и не допускайте контакта с питомцами. Не используйте самодельные ловушки, аэрозоли или яды. Это повышает риск травмы для людей и животного и мешает спокойному выходу.",
        ],
      },
      {
        heading: "Почему летучая мышь оказалась в доме?",
        paragraphs: [
          "Частые причины — открытое окно или дверь, случайный залёт при охоте на насекомых у света и ошибка молодых или неопытных животных. В зданиях также бывают щели к местам укрытия. Один случай внутри сам по себе не доказывает, что в доме живёт колония.",
        ],
      },
      {
        heading: "Как помочь летучей мыши безопасно уйти",
        paragraphs: [
          "В рекомендациях по дикой природе для летучей мыши, летающей в помещении вечером, предпочтителен пассивный выход: одна комната, открытые наружные проёмы, более спокойный свет и время. Если на улице холодно, сильный ветер или животное летает днём, не пытайтесь сразу выпустить его наружу — дождитесь, пока оно сядет, и получите профессиональный совет, прежде чем действовать. Не пытайтесь схватить летящее животное.",
          "Если оно село и не уходит, некоторые организации описывают накрытие коробкой и подсовывание картона снизу в плотных перчатках с последующим выпуском на улицу в подходящее время. Это крайняя мера для спокойного животного на поверхности — не для ловли на лету — и она неуместна, если вы не можете сделать это безопасно. При сомнениях лучше совет специалиста.",
        ],
      },
      {
        heading: "Можно ли трогать летучую мышь?",
        paragraphs: [
          "Нет — не голыми руками. Даже краткий контакт может дать укус или царапину, которые легко не заметить. Если касания не избежать, советы по дикой природе подчёркивают плотные перчатки и минимизацию прямого контакта. После возможного контакта с голой кожей считайте ситуацию медицински значимой и обратитесь за советом.",
        ],
      },
      {
        heading: "Что делать, если летучая мышь не улетает?",
        paragraphs: [
          "Травмированному животному, лежащему на полу, повторно не взлетающему, активному днём или долго остающемуся внутри может понадобиться профессиональная помощь. Уберите людей и животных, снизьте беспокойство и обратитесь в службу помощи диким животным, к ветеринару или иному доступному квалифицированному сервису. Не придумывайте кормление или лечение дома.",
          "Эта страница не приводит грузинские номера спасательных служб для летучих мышей: публичные контакты меняются и не всегда собраны в одном месте. Используйте местные каналы по дикой природе, ветеринарии или муниципальные службы, которым доверяете.",
        ],
      },
      {
        heading: "Если летучая мышь укусила или оцарапала",
        paragraphs: [
          "Укусы могут быть мелкими и незаметными. CDC советует промыть известный укус или царапину мылом и водой и немедленно обратиться за медицинской помощью. ВОЗ также рекомендует тщательное промывание мылом и водой не менее 15 минут после экспозиции, затем клиническую оценку постэкспозиционной профилактики бешенства при показаниях.",
          "Обратитесь за срочной медицинской или санитарной консультацией после укуса, царапины, попадания слюны на слизистые или повреждённую кожу, либо в ситуациях — включая некоторые контакты во сне или с ребёнком без присмотра — когда прямой контакт нельзя уверенно исключить. Не выпускайте и не выбрасывайте животное бездумно, если специалисты просят его оценить. Страница не ставит диагноз и не назначает схему вакцинации.",
        ],
      },
      {
        heading: "Летучие мыши и бешенство",
        paragraphs: [
          "В некоторых регионах летучие мыши могут быть резервуаром лиссавирусов бешенства, а ВОЗ относит экспозиции из-за прямого контакта с ними к тяжёлой категории, требующей оценки постэкспозиционной профилактики. Это не значит, что большинство увиденных людьми животных заражены, и не значит, что появление в доме автоматически создаёт медицинскую тревогу.",
          "Инфекцию нельзя исключить по внешнему виду. Оценивайте риск пропорционально: избегайте контакта; после возможной прямой экспозиции обратитесь за советом. Актуальная публичная статистика бешенства у летучих мышей Грузии ограничена — не переносите цифры другой страны как описание Грузии.",
        ],
      },
      {
        heading: "Почему летучие мыши важны",
        image: "roost",
        paragraphs: [
          "Насекомоядные летучие мыши поедают множество ночных насекомых и могут помогать сдерживать сельскохозяйственных вредителей. В мире некоторые виды также опыляют растения или разносят семена; эти роли не одинаковы у всех видов. Убийство залётного животного снимает короткий страх и убирает существо, которое обычно пытается уйти.",
        ],
      },
      {
        heading: "Летучие мыши в Грузии",
        paragraphs: [
          "Опубликованный в 2023 году экспертно проверенный набор данных о встречах указывает 30 видов летучих мышей Грузии из четырёх семейств. Это обзор национальной фауны, а не бытовой список; гид не пытается определить вид по комнатному наблюдению.",
          "Если животные повторно появляются в жилых комнатах, возможны щели из укрытия внутрь. Закрытие внутренних щелей — строительный вопрос, и животных не следует запирать в полостях стен; перед постоянными работами при сомнениях обратитесь за советом. На Reptiles.ge пока нет видовых профилей летучих мышей.",
        ],
      },
    ],
    title: "В дом влетела летучая мышь — что делать?",
  },
  tr: {
    description:
      "Eve yarasa mı girdi? Sakin kalın, insanları ve evcil hayvanları uzak tutun, dışa çıkış açın ve temas sonrası ne zaman tıbbi danışmanlık gerektiğini öğrenin.",
    faq: [
      {
        answer:
          "Çoğu zaman açık pencere veya kapıdan, ya da böcekleri izlerken. Genç veya deneyimsiz hayvanlar da yanlışlıkla girebilir. İçeride uçmak saldırı demek değildir.",
        question: "Yarasa neden eve girdi?",
      },
      {
        answer:
          "İç kapıları kapatın, odayı sakin tutun, pencereleri veya dış kapıyı geniş açın, perdeleri ve panjurları temizleyin, gereksiz ışıkları kapatın. Çıkması için zaman ve alan verin.",
        question: "Yarasayı odadan nasıl çıkarırım?",
      },
      {
        answer:
          "Hayır. Çıplak elle dokunmayın. Temas kaçınılmazsa yaban hayatı kuruluşları kalın eldiven ve doğrudan dokunmadan yakalama yöntemlerini önerir.",
        question: "Yarasaya elle dokunabilir miyim?",
      },
      {
        answer:
          "Yarasalar genellikle insan avlamaz. Odadaki uçuş çoğu zaman çıkış arayan hayvanın tanıdık olmayan bir alanda panik gibi görünmesidir.",
        question: "Yarasalar insanlara saldırır mı?",
      },
      {
        answer:
          "Karşılaşılan yarasaların çoğu kuduzlu değildir ama görünüm enfeksiyonu dışlamaz. DSÖ doğrudan teması ciddi maruziyet sayar. Isırık, tırmık veya belirsiz temas sonrası tıbbi danışmanlık alın.",
        question: "Yarasa kuduzlu olabilir mi?",
      },
      {
        answer:
          "Yarayı mümkün olduğunca çabuk sabun ve suyla iyice yıkayın, ardından gecikmeden tıbbi değerlendirme alın. Belirti beklemeyin. Gürcistan’da acil durumda 112’yi arayın.",
        question: "Yarasa ısırığından sonra ne yapmalı?",
      },
      {
        answer:
          "Çıkış arıyor olabilir. Dönmek tek başına hastalık kanıtı değildir. İnsanları ve evcil hayvanları uzak tutun ve dışarı net bir yol verin.",
        question: "Yarasa odada neden daire çizerek uçuyor?",
      },
      {
        answer:
          "Yaralı, yerde kalan veya tekrar tekrar uçamayan hayvana sessizlik ve profesyonel yardım gerekir. Evde tedavi uydurmayın ve çıplak elle tutmayın.",
        question: "Yarasa uçamıyorsa ne yapmalı?",
      },
      {
        answer:
          "Önce çocukları ve evcil hayvanları odadan çıkarın, kapıyı kapatın, sonra yarasa için dış çıkış açın. Uykuda veya gözetimsiz doğrudan temas olasılığı varsa, belirgin ısırık olmasa da tıbbi danışmanlık alın.",
        question: "Evde çocuk veya evcil hayvan varsa ne yapmalı?",
      },
    ],
    lead: "Evde yarasa varsa: sakin kalın, insanları ve evcil hayvanları uzak tutun, çıplak elle dokunmayın. Isırık, tırmık veya olası doğrudan temas olduysa ve bunu dışlayabildiğinizden emin değilseniz, önce tıbbi danışmanlık alın ve yarasayı kendiliğinizden salmayın. Güvenliyse tek odaya sınırlayın ve dış pencere veya kapıyı açın. Kovalamayın ve vurmayın. Isırık, tırmık veya belirsiz doğrudan temas sonrası yıkayın ve tıbbi danışmanlık alın; Gürcistan’da acilde 112.",
    metaTitle: "Eve yarasa girdi — ne yapmalı?",
    sections: [
      {
        heading: "Eve yarasa girerse ne yapmalı",
        paragraphs: [
          "İçerideki yarasa genellikle saldırmaz; çıkış arar. Binaya daha derin gitmesin diye diğer odalara giden kapıları kapatın. Çocukları ve evcil hayvanları çıkarın. Bir veya birkaç dış pencereyi ya da dış kapıyı olabildiğince geniş açın, çıkışı engelleyen perde, panjur ve mobilyayı temizleyin ve gereksiz iç ışıkları kapatın ki dış açıklık daha kolay bulunsun.",
          "Sonra geri çekilin. Bat Conservation Trust’ın akşam iç mekân uçuşu için önerisi, odada kovalamak yerine yönünü bulup çıkması için zaman vermektir. Daha sonra — perde kıvrımları ve mobilya arkası dahil — gerçekten gittiğini kontrol edin.",
        ],
      },
      {
        heading: "Ne yapmamalısınız",
        image: "on-wall",
        paragraphs: [
          "Çıplak elle yakalamayın. Vurmayın, fırlatmayın ve öldürmeyin. Odada agresifçe kovalamayın ve evcil hayvanların temas etmesine izin vermeyin. Doğaçlama tuzak, sprey veya zehir kullanmayın. Bunlar insan ve hayvan için yaralanma riskini artırır ve sakin çıkışı zorlaştırır.",
        ],
      },
      {
        heading: "Yarasa neden içeri girdi?",
        paragraphs: [
          "Sık nedenler açık pencere veya kapı, ışık yakınında böcek avlarken yanlışlıkla girmek ve genç ya da deneyimsiz hayvanların hatasıdır. Binalarda barınma boşlukları da olabilir. Tek bir iç saptama, evde koloni yaşadığını tek başına kanıtlamaz.",
        ],
      },
      {
        heading: "Yarasanın güvenle çıkmasına nasıl yardımcı olunur",
        paragraphs: [
          "Yaban hayatı rehberlerinde akşam içeride uçan yarasa için tercih edilen yaklaşım pasif çıkıştır: tek oda, açık dış açıklıklar, daha sakin iç ışık ve zaman. Dışarısı soğuksa, rüzgâr şiddetliyse veya yarasa gündüz uçuyorsa hemen dışarı salmaya çalışmayın — konmasını bekleyin ve harekete geçmeden profesyonel tavsiye alın. Uçan hayvanı yakalamaya çalışmayın.",
          "Hayvan konduysa ve çıkmıyorsa bazı kuruluşlar kalın eldivenle kutu kapatıp alttan karton kaydırma ve uygun zamanda dışarı bırakmayı anlatır. Bu, sakin ve yere inmiş hayvan için son çaredir — uçanı kovalamak için değil — ve güvenle yapamıyorsanız uygun değildir. Emin değilseniz profesyonel tavsiye tercih edin.",
        ],
      },
      {
        heading: "Yarasaya dokunulmalı mı?",
        paragraphs: [
          "Hayır — çıplak elle değil. Kısa bir dokunuş bile kolayca fark edilmeyen ısırık veya tırmık riski yaratabilir. Temas kaçınılmazsa yaban hayatı tavsiyesi kalın eldiven ve doğrudan teması azaltmayı vurgular. Çıplak ciltle olası temastan sonra durumu tıbben önemli sayın ve danışmanlık alın.",
        ],
      },
      {
        heading: "Yarasa uçamıyorsa ne olur?",
        paragraphs: [
          "Yaralı, yerdeki, tekrar tekrar uçamayan, gündüz aktif veya uzun süre içeride kalan hayvan profesyonel yardım gerektirebilir. İnsanları ve evcil hayvanları uzak tutun, rahatsızlığı azaltın ve yaban hayatı kurtarma, veteriner veya erişilebilir başka nitelikli bir hizmete başvurun. Evde besleme veya tedavi uydurmayın.",
          "Bu sayfa Gürcistan’a özel yarasa kurtarma hatlarını listelemez; kamuya açık iletişimler değişir ve her zaman tek yerde yayımlanmaz. Güvendiğiniz yerel yaban hayatı, veteriner veya belediye kanallarını kullanın.",
        ],
      },
      {
        heading: "Yarasa ısırır veya tırmıklarsa",
        paragraphs: [
          "Yarasa ısırıkları küçük ve gözden kaçabilir. CDC, bilinen ısırık veya tırmığı sabun ve suyla yıkayıp hemen tıbbi yardım almayı önerir. DSÖ de maruziyet sonrası en az 15 dakika sabun ve suyla iyice yıkamayı, ardından gerektiğinde kuduz sonrası profilaksi için klinik değerlendirmeyi önerir.",
          "Isırık, tırmık, tükürüğün mukozaya veya açık yaraya değmesi ya da — uykuda veya gözetimsiz çocuk temasları dahil — doğrudan temasın güvenle dışlanamadığı durumlardan sonra gecikmeden tıbbi veya halk sağlığı danışmanlığı alın. Halk sağlığı personeli değerlendirilmesini isterse hayvanı rastgele salmayın veya atmayın. Bu sayfa maruziyeti teşhis edemez ve aşı takvimi yazamaz.",
        ],
      },
      {
        heading: "Yarasalar ve kuduz",
        paragraphs: [
          "Bazı bölgelerde yarasalar kuduz lisavirüslerinin rezervuarı olabilir ve DSÖ yarasalara doğrudan temastan kaynaklanan maruziyetleri, maruziyet sonrası profilaksi değerlendirmesi gerektiren ağır kategori sayar. Bu, insanların gördüğü yarasaların çoğunun enfekte olduğu anlamına gelmez ve evde görmenin otomatik tıbbi acil olduğu anlamına da gelmez.",
          "Enfeksiyon görünüme bakılarak dışlanamaz. Riski orantılı tutun: temastan kaçının; olası doğrudan maruziyet sonrası danışmanlık alın. Gürcistan’da yarasa kuduzuna dair güncel kamuya açık veriler sınırlıdır — başka ülkenin istatistiklerini Gürcistan tablosu gibi kullanmayın.",
        ],
      },
      {
        heading: "Yarasalar neden önemli",
        image: "roost",
        paragraphs: [
          "Böcekçil yarasalar gece uçan böcekleri büyük miktarda yer ve tarım zararlılarını baskılamaya yardımcı olabilir. Küresel olarak bazı türler bitkileri tozlar veya tohum dağıtır; bu roller her türde aynı değildir. Yanlışlıkla içeri giren bir hayvanı öldürmek kısa bir korkuyu giderir ve genellikle çıkmaya çalışan bir canlıyı ortadan kaldırır.",
        ],
      },
      {
        heading: "Gürcistan’da yarasalar",
        paragraphs: [
          "2023’te yayımlanan uzman denetimli bir gözlem veri seti Gürcistan için dört familyadan 30 yarasa türü kaydeder. Bu ulusal fauna özetidir, ev checklist’i değildir; bu rehber oda gözleminden tür teşhisi yapmaz.",
          "Yarasalar oturma odalarında tekrar tekrar görünüyorsa barınaktan içeri boşluklar olabilir. İç boşlukları kapatmak yapı işidir ve hayvanları duvar boşluklarında hapsetmemelidir; kalıcı işlerden önce emin değilseniz danışın. Reptiles.ge’de henüz yarasa tür profili yayımlanmamıştır.",
        ],
      },
    ],
    title: "Eve yarasa girdi — ne yapmalı?",
  },
};

export const BAT_IN_HOUSE_SOURCES = [
  {
    name: "Bat Conservation Trust — Instructions for release",
    supports: {
      en: "Close internal doors, open windows, clear obstacles, switch off lights, and give a flying bat time to leave; gloves for handling.",
      ka: "შიდა კარების დახურვა, ფანჯრების გახსნა, დაბრკოლებების მოცილება, შუქის გამორთვა და მფრინავი ცხოველისთვის დროის მიცემა; ხელთათმანები შეხებისას.",
      ru: "Закрыть внутренние двери, открыть окна, убрать препятствия, выключить свет и дать летящему животному время уйти; перчатки при контакте.",
      tr: "İç kapıları kapatma, pencereleri açma, engelleri kaldırma, ışıkları kapatma ve uçan hayvana çıkış için zaman; temasta eldiven.",
    },
    url: "https://www.bats.org.uk/advice/help-ive-found-a-bat/bats-in-need-of-rescue/instructions-for-release",
  },
  {
    name: "Bat Conservation Trust — Containing a bat",
    supports: {
      en: "Box-and-card containment without bare hands; gloves because of rabies transmission risk; seek medical advice after a bite or scratch.",
      ka: "ყუთითა და მუყაოთი მოთავსება შიშველი ხელის გარეშე; ხელთათმანები ცოფის გადაცემის რისკის გამო; ნაკბენის ან ნაკაწრის შემდეგ სამედიცინო რჩევა.",
      ru: "Поимка коробкой и картоном без голых рук; перчатки из‑за риска бешенства; медросовет после укуса или царапины.",
      tr: "Çıplak el olmadan kutu ve kartonla yakalama; kuduz riski nedeniyle eldiven; ısırık veya tırmıktan sonra tıbbi danışmanlık.",
    },
    url: "https://www.bats.org.uk/advice/help-ive-found-a-bat/bats-in-need-of-rescue/contain-the-bat",
  },
  {
    name: "RSPCA — Bats",
    supports: {
      en: "Keep the room calm, open windows, dim lights, avoid catching a flying bat, and wear thick gloves if handling is essential.",
      ka: "ოთახის სიმშვიდე, ფანჯრების გახსნა, შუქის შემცირება, მფრინავი ცხოველის დაჭერის არიდება და სქელი ხელთათმანები საჭიროებისას.",
      ru: "Спокойная комната, открытые окна, приглушённый свет, не ловить на лету и плотные перчатки при необходимости.",
      tr: "Odayı sakin tutma, pencereleri açma, ışığı kısma, uçanı yakalamama ve gerekirse kalın eldiven.",
    },
    url: "https://www.rspca.org.uk/adviceandwelfare/wildlife/bats",
  },
  {
    name: "CDC — Preventing Rabies from Bats",
    supports: {
      en: "Most encountered bats are not rabid; avoid touching; wash bites/scratches and seek care; bat bites can be tiny.",
      ka: "შეხვედრილი ღამურების უმეტესობა ცოფიანი არ არის; შეხების არიდება; ნაკბენის/ნაკაწრის დაბანა და დახმარება; ნაკბენი შეიძლება პატარა იყოს.",
      ru: "Большинство встреченных летучих мышей не бешены; не трогать; промыть укус/царапину и обратиться за помощью; укусы могут быть крошечными.",
      tr: "Karşılaşılan yarasaların çoğu kuduzlu değildir; dokunmayın; ısırık/tırmığı yıkayıp yardım alın; ısırıklar çok küçük olabilir.",
    },
    url: "https://www.cdc.gov/rabies/prevention/bats.html",
  },
  {
    name: "WHO — Rabies fact sheet",
    supports: {
      en: "Direct contact with bats is a category III exposure; wash with soap and water for ≥15 minutes; seek post-exposure care when indicated.",
      ka: "ღამურასთან პირდაპირი კონტაქტი III კატეგორიის ექსპოზიციაა; საპნითა და წყლით ≥15 წუთი; ნაჩვენები პროფილაქტიკა.",
      ru: "Прямой контакт с летучими мышами — экспозиция категории III; мытьё мылом и водой ≥15 минут; постэкспозиционная помощь по показаниям.",
      tr: "Yarasalarla doğrudan temas kategori III maruziyettir; ≥15 dakika sabun ve su; gerektiğinde maruziyet sonrası bakım.",
    },
    url: "https://www.who.int/news-room/fact-sheets/detail/rabies",
  },
  {
    name: "Bat Conservation International — Bats 101",
    supports: {
      en: "Ecosystem roles of bats: insect consumption globally; pollination and seed dispersal in some species.",
      ka: "ღამურების ეკოსისტემური როლი: მწერების მოხმარება; ზოგ სახეობაში დამტვერვა და თესლის გავრცელება.",
      ru: "Экосистемные роли: поедание насекомых; у части видов опыление и распространение семян.",
      tr: "Ekosistem rolleri: böcek tüketimi; bazı türlerde tozlaşma ve tohum dağıtımı.",
    },
    url: "https://www.batcon.org/about-bats/bats-101/",
  },
  {
    name: "Natradze et al. 2023 — Bats of Georgia (Biodiversity Data Journal)",
    supports: {
      en: "Expert-curated dataset: 30 bat species recorded in Georgia.",
      ka: "ექსპერტულად შემოწმებული მონაცემები: საქართველოში 30 სახეობის ღამურა.",
      ru: "Экспертный набор данных: в Грузии отмечено 30 видов летучих мышей.",
      tr: "Uzman denetimli veri seti: Gürcistan’da 30 yarasa türü kaydı.",
    },
    url: "https://doi.org/10.3897/bdj.11.e103181",
  },
  {
    name: "112 Georgia — Frequently asked questions",
    supports: {
      en: "Georgia's emergency medical assistance number is 112.",
      ka: "საქართველოში გადაუდებელი სამედიცინო დახმარების ნომერია 112.",
      ru: "Номер экстренной медицинской помощи в Грузии — 112.",
      tr: "Gürcistan’da acil tıbbi yardım numarası 112’dir.",
    },
    url: "https://112.gov.ge/?page_id=599",
  },
] as const;
