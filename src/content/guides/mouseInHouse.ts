import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "cleanup" | "sealing" | "signs" | "trap";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Saw a mouse indoors? Learn why mice get in, how to spot their signs, how to trap them, how to clean droppings safely and how to seal entry points.",
    faq: [
      {
        answer:
          "Not necessarily, but it is possible. Check for droppings, gnaw marks and nests: the more signs you find and the wider they are spread, the more mice there may be.",
        question: "Does seeing one mouse mean there are more?",
      },
      {
        answer:
          "No. CDC advises against sweeping or vacuuming rodent droppings because contaminated particles can get into the air. Wet them with a disinfectant first, then pick them up with a paper towel.",
        question: "Can I vacuum mouse droppings?",
      },
      {
        answer:
          "Set traps along the wall next to the signs and look for where the mouse gets in. Do not put poison into the wall void: a poisoned mouse may die there and leave a smell. If activity continues in a space you cannot reach, call a professional.",
        question: "What if the mouse is inside the wall?",
      },
      {
        answer:
          "Possibly, but sound alone cannot tell you: other animals can also make noises in walls and ceilings. Look for droppings, gnaw marks or chewed packaging.",
        question:
          "I hear noises in the wall or ceiling at night. Is it a mouse?",
      },
      {
        answer:
          "CDC does not recommend them: a trapped mouse can become frightened and urinate, which increases the risk of exposure. A snap trap is the better choice.",
        question: "Should I use a live trap or a glue trap?",
      },
    ],
    metaTitle: "Mouse in the house: how to get rid of mice and keep them out",
    sections: [
      {
        heading: "What should you do if you see a mouse in the house?",
        paragraphs: [
          "Seeing one mouse does not always mean a large infestation, but it is a good reason to look for other signs and for the openings it uses. Food, water, shelter and open gaps draw mice into buildings.",
          "Trapping alone is often not enough: if food stays accessible and holes stay open, new mice can get in. That is why integrated pest management (IPM) starts with prevention, exclusion and non-chemical tools. In practice: confirm the activity, trap the mouse, clean contaminated spots safely, seal entry points and keep watching.",
          'In this guide, "mouse" means a small rodent that has got into a home. The exact species usually cannot be identified from everyday signs, so the advice focuses on practical steps rather than on a particular species.',
        ],
      },
      {
        heading: "Why do mice come into the house?",
        paragraphs: [
          "Mice enter buildings in search of food, water and shelter. In kitchens, pantries and storage boxes they find both food and nesting material. They often choose nest sites near a source of heat, such as a refrigerator compressor or a water heater.",
          "Mice are active all year, but they are most likely to move into buildings in autumn as temperatures drop. So cold is not the only reason: if food and an open hole are available, a mouse can turn up in any season.",
          "A mouse needs only a very small opening: according to CDC, a hole the width of a pencil, about 6 mm across, is enough. Entry points can be under a door, in a window gap, in the foundation, or where pipes and cables pass through a wall.",
        ],
      },
      {
        heading: "How can you tell if there is a mouse in the house?",
        image: "signs",
        list: {
          items: [
            "Droppings: small, pointed, about the size of a grain of rice, often along walls, near food or near shelter. Fresh droppings are shiny and soft; old ones are dry, lighter in colour and crumble easily.",
            "Gnaw marks: chewed food packaging, wood shavings, small holes, shredded fabric or chewed wires.",
            "Nests: made of finely shredded paper or other fibrous material, in sheltered places.",
            "Tracks: small footprints on dusty surfaces.",
            "Smell: a characteristic musky odour, typical of large or long-term infestations.",
            "Sounds: scratching, gnawing or scurrying at night inside walls, above ceilings or under cabinets. Other animals can make similar sounds, so judge noises together with other signs.",
          ],
        },
        paragraphs: [
          "Mice are active mostly at night, so you will often notice their signs before you see the animal itself.",
        ],
      },
      {
        heading: "Where do mice hide in the house?",
        paragraphs: [
          "Mice prefer sheltered, dark and rarely disturbed places: behind the stove and refrigerator, at the back of cabinets and drawers, behind boxes, and in storage rooms and garages. Nests are often close to a heat source.",
          "Mice can also move inside wall voids and in the space between ceilings and floors. They usually stay close to the nest: according to ICWDM, one mouse's daily range averages about 3–9 metres across. So the signs often show where to look for the nest and where to set traps.",
        ],
      },
      {
        heading: "Are mice in the house dangerous?",
        paragraphs: [
          "Seeing a mouse is not a medical emergency, but the risk is real and has two sides. The first is damage: mice spoil food and gnaw electrical wiring, which damages appliances and the building.",
          "The second is health. According to CDC, rodents can spread diseases, including hantavirus, leptospirosis and salmonellosis. People can be infected by breathing in air contaminated with dust from urine, droppings or nesting material, by touching contaminated surfaces and then their eyes, nose or mouth, through a bite, or by eating contaminated food.",
          "Diseases pass from infected rodents, and you cannot tell from a mouse's appearance whether it is infected. A laboratory-confirmed hantavirus infection has been described in Georgia, but the rodent hosts of the virus in the Caucasus are not well studied. That is why safe cleanup matters most. If you develop fever, muscle aches or other symptoms after contact with rodent droppings or nests, see a doctor and mention the rodent contact.",
        ],
      },
      {
        heading: "Found mouse droppings? How to clean up safely",
        image: "cleanup",
        list: {
          items: [
            "Before cleaning, open doors and windows for at least 30 minutes and leave the room while it airs out.",
            "Put on rubber or plastic gloves.",
            "Spray droppings and urine until very wet with a disinfectant or a bleach solution, and leave it for 5 minutes or as long as the product label says. Prepare the solution exactly as the label instructs.",
            "Never mix bleach with ammonia or any other cleaner: this produces a toxic gas.",
            "Pick up the wet material with paper towels and throw it in the rubbish.",
            "Then clean the nearby floor, countertops and other surfaces that may be contaminated with the same product.",
            "After taking off the gloves, wash your hands with soap and water.",
          ],
          ordered: true,
        },
        paragraphs: [
          "The main rule: never sweep or vacuum mouse droppings, urine or nesting material. According to CDC, this can put tiny particles containing viruses into the air. Wet contaminated material first and only then pick it up.",
        ],
      },
      {
        heading: "How do you get rid of a mouse in the house?",
        list: {
          items: [
            "Confirm the activity: find droppings, gnaw marks and nests so you know where the mouse moves.",
            "Cut off food and water: keep food, including pet food, in tightly closed thick plastic, metal or glass containers, clean up spills and crumbs right away, and keep rubbish in a bin with a tight lid.",
            "Trap the mouse: CDC recommends snap traps. A small amount of peanut butter works as bait.",
            "Check traps every day. Remove a caught mouse wearing gloves: spray it and the trap with disinfectant, leave it for 5 minutes, put it in a plastic bag together with the used trap, tie the bag, place it in a second bag, tie that too and put it in a covered bin. Then wash your hands.",
            "Clean contaminated spots safely, as described above.",
            "Seal the entry points and keep watching for new droppings or gnaw marks.",
          ],
          ordered: true,
        },
        paragraphs: [
          "The most reliable result comes from a sequence of steps, not from a single product.",
          "CDC does not recommend glue traps or live traps: a frightened mouse can urinate, which increases the risk of exposure.",
        ],
      },
      {
        heading: "Where should you put a mouse trap?",
        image: "trap",
        list: {
          items: [
            "Put traps where you have seen a mouse, droppings, gnaw marks or nesting material.",
            'Set the trap at a right angle to the wall with the baited end against the wall, so that it forms a "T" with the wall.',
            "Use closed, dark places too: behind the stove and refrigerator, at the back of cabinets and drawers, and behind objects.",
            "If activity is widespread, one trap may not be enough: use enough traps to catch the mice in good time.",
            "Place traps where children and pets cannot reach them.",
          ],
        },
        paragraphs: [
          "Mice prefer to run along walls and objects for safety, so the trap should stand against the wall.",
        ],
      },
      {
        heading: "Is it safe to use rat or mouse poison?",
        paragraphs: [
          "Poison (rodenticide) should not be the first choice indoors. A mouse poisoned inside a building often dies in a wall or another inaccessible place and leaves an unpleasant smell there; with a trap, you can see the catch and remove it.",
          "Poison is also dangerous for children, pets and wildlife: an animal that eats a poisoned rodent can be poisoned too. If poison must be used, use only a registered product, exactly as the label says, in a closed, tamper-resistant bait station out of reach of children and pets, remove dead rodents promptly, and never store poison next to food, including pet food.",
          "Do not make homemade poison, and do not use agricultural or unregistered chemicals. If poison is really needed, it is better to leave it to a professional.",
        ],
      },
      {
        heading: "How do you keep mice from getting back in?",
        image: "sealing",
        list: {
          items: [
            "Fill small holes with steel wool and secure it with caulk around the edges, or use spray foam.",
            "Close larger holes with metal mesh, cement, sheet metal or similar solid material.",
            "Fit door sweeps on exterior doors, and seal gaps around windows, doors, the foundation and pipes.",
            "Keep food and pet food in tightly closed containers, clean up spilled food right away, and keep rubbish outside in a tightly closed bin.",
            "Reduce clutter where mice can shelter, and keep the house clean and dry.",
          ],
        },
        paragraphs: [
          "For a lasting result, seal entry points and limit access to food. Check the house inside and outside, for both large and small openings.",
        ],
      },
      {
        heading: "Why did the mouse come back?",
        paragraphs: [
          "If new signs appear after a mouse has been caught, the usual reasons are that an entry point is still open, food or shelter is still available, there were other mice in the house, or new ones are coming in from nearby buildings or the yard.",
          "Seeing a second mouse does not by itself prove there is a nest in the house, but it does mean the job is not finished: check the openings and food access again and keep monitoring with traps.",
        ],
      },
      {
        heading: "When do you need professional help?",
        list: {
          items: [
            "Mice keep appearing after trapping, cleaning and sealing.",
            "There are many droppings and contamination is widespread.",
            "Activity is inside walls or ceilings you cannot reach.",
            "Entry points on the roof or in the foundation cannot be sealed safely.",
            "Poison is being considered.",
          ],
        },
        paragraphs: [
          "A single mouse sighting does not require a professional; traps, cleanup and sealing holes are often enough. Professional pest control makes sense if:",
        ],
      },
    ],
    summary:
      "If you see a mouse indoors, first check for droppings, gnaw marks and nests. Trap it with a snap trap set against the wall. Never sweep or vacuum droppings: air out the room, wear gloves, soak them with a disinfectant and only then pick them up. Finally, seal the holes and keep food in closed containers.",
    title:
      "Mouse in the house: why it gets in, how to get rid of it and keep it out",
  },
  ka: {
    description:
      "სახლში თაგვი დაინახეთ? გაიგეთ, რატომ შემოდის, როგორ ამოიცნოთ მისი კვალი, როგორ დაიჭიროთ, როგორ გაწმინდოთ ექსკრემენტი უსაფრთხოდ და როგორ დახუროთ ხვრელები.",
    faq: [
      {
        answer:
          "არა აუცილებლად, მაგრამ შესაძლებელია. შეამოწმეთ ექსკრემენტი, ღრღნის კვალი და ბუდე: რაც მეტი ნიშანია და რაც უფრო ფართოდაა გავრცელებული, მით მეტი თაგვი შეიძლება იყოს.",
        question: "ერთი თაგვის ნახვა ნიშნავს, რომ სხვებიც არიან?",
      },
      {
        answer:
          "არა. CDC გირჩევთ, თაგვის ექსკრემენტი არ მოხვეტოთ და მტვერსასრუტით არ აიღოთ, რადგან დაბინძურებული ნაწილაკები ჰაერში ხვდება. ჯერ დაასველეთ სადეზინფექციო საშუალებით, შემდეგ ქაღალდის ხელსახოცით აიღეთ.",
        question: "შეიძლება თაგვის ექსკრემენტის მტვერსასრუტით გაწმენდა?",
      },
      {
        answer:
          "ხაფანგები კედლის გასწვრივ, ნიშნებთან დადგით და მოძებნეთ, საიდან შედის. კედლის ღრუში საწამლავს ნუ ჩადებთ: მოწამლული თაგვი შეიძლება იქვე მოკვდეს და სუნი დატოვოს. თუ აქტივობა მიუწვდომელ სივრცეში გრძელდება, სპეციალისტს მიმართეთ.",
        question: "თაგვი კედელშია — რა გავაკეთო?",
      },
      {
        answer:
          "შესაძლოა, მაგრამ მხოლოდ ხმით ვერ დაადგენთ: კედელსა და ჭერში ხმა სხვა ცხოველმაც შეიძლება გამოიწვიოს. მოძებნეთ ექსკრემენტი, ღრღნის კვალი ან დაღრღნილი შეფუთვა.",
        question: "ღამით კედელში ან ჭერში ხმა მესმის — ეს თაგვია?",
      },
      {
        answer:
          "CDC მათ არ გირჩევთ: დაჭერილი თაგვი შეიძლება შეშინდეს და შარდი გამოყოს, რაც დაინფიცირების რისკს ზრდის. უმჯობესია მარწუხა ხაფანგი.",
        question: "ცოცხალი დამჭერი ხაფანგი ან წებოვანი ხაფანგი გამოვიყენო?",
      },
    ],
    metaTitle: "თაგვი სახლში — როგორ მოვიშოროთ და აღარ შემოვუშვათ?",
    sections: [
      {
        heading: "რა ვქნა, თუ სახლში თაგვი დავინახე?",
        paragraphs: [
          "ერთი თაგვის დანახვა ყოველთვის დიდ პოპულაციას არ ნიშნავს, მაგრამ საკმარისი მიზეზია, რომ სხვა ნიშნები და ის ხვრელები მოძებნოთ, საიდანაც შემოდის. თაგვს შენობაში საკვები, წყალი, თავშესაფარი და ღია ღრიჭოები იზიდავს.",
          "მხოლოდ დაჭერა ხშირად საკმარისი არ არის: თუ საკვები ხელმისაწვდომია და ხვრელები ღიაა, ახალი თაგვები შეიძლება ისევ შემოვიდნენ. ამიტომ მავნებლების ინტეგრირებული მართვა (IPM) პრევენციით, ხვრელების დახურვითა და არაქიმიური საშუალებებით იწყება. პრაქტიკაში: დაადასტურეთ აქტივობა, დაიჭირეთ თაგვი, უსაფრთხოდ გაწმინდეთ დაბინძურებული ადგილები, დახურეთ შემოსასვლელები და განაგრძეთ დაკვირვება.",
          "ამ გიდში „თაგვი“ სახლში მოხვედრილ პატარა მღრღნელს ნიშნავს. სახეობის ზუსტი დადგენა ყოველდღიური ნიშნებით, როგორც წესი, შეუძლებელია, ამიტომ რჩევები პრაქტიკულ ნაბიჯებს ეხება და არა კონკრეტულ სახეობას.",
        ],
      },
      {
        heading: "რატომ შემოდის თაგვი სახლში?",
        paragraphs: [
          "თაგვი შენობაში საკვების, წყლისა და თავშესაფრის საძებნელად შედის. სამზარეულოში, საკუჭნაოსა და შესანახ ყუთებში ის საკვებსაც პოულობს და ბუდის მასალასაც. ბუდისთვის ხშირად სითბოს წყაროსთან ახლო ადგილს ირჩევს — მაგალითად, მაცივრის კომპრესორის ან წყლის გამაცხელებლის სიახლოვეს.",
          "თაგვი მთელი წლის განმავლობაში აქტიურია, თუმცა შენობაში შემოსვლის ალბათობა ყველაზე მაღალია შემოდგომით, როცა ცივდება. ამიტომ მხოლოდ სიცივე მიზეზი არ არის: თუ საკვები და ღია ხვრელი არსებობს, თაგვი ნებისმიერ სეზონში შეიძლება გამოჩნდეს.",
          "თაგვს ძალიან პატარა ღიობიც ყოფნის: CDC-ის მიხედვით, მისთვის საკმარისია ფანქრის სისქის, დაახლოებით 6 მმ დიამეტრის ხვრელი. შემოსასვლელი შეიძლება იყოს კარის ქვეშ, ფანჯრის ღრიჭოში, საძირკველში ან იქ, სადაც მილები და კაბელები კედელში გადის.",
        ],
      },
      {
        heading: "როგორ გავიგოთ, სახლში თაგვია თუ არა?",
        image: "signs",
        list: {
          items: [
            "ექსკრემენტი: პატარა, წაწვეტებული, დაახლოებით ბრინჯის მარცვლის ზომის; ხშირად კედლის გასწვრივ, საკვებთან ან თავშესაფართან. ახალი ექსკრემენტი პრიალა და რბილია, ძველი — მშრალი, უფრო ღია ფერის და ადვილად იფშვნება.",
            "ღრღნის კვალი: დაღრღნილი საკვების შეფუთვა, ხის ნაფოტები, პატარა ხვრელები, დაფლეთილი ქსოვილი ან დაღრღნილი სადენები.",
            "ბუდე: წვრილად დაფლეთილი ქაღალდისა და სხვა ბოჭკოვანი მასალისგან, დაცულ ადგილას.",
            "კვალი: პატარა ნაფეხურები მტვრიან ზედაპირზე.",
            "სუნი: დამახასიათებელი მუშკისებრი სუნი, რომელიც დიდი ან ხანგრძლივი დასახლებისას იგრძნობა.",
            "ხმა: ღამით ფხაკუნი, ღრღნა ან სირბილი კედელში, ჭერში ან კარადების ქვეშ. მსგავს ხმას სხვა ცხოველებიც გამოსცემენ, ამიტომ ხმა სხვა ნიშნებთან ერთად შეაფასეთ.",
          ],
        },
        paragraphs: [
          "თაგვი ძირითადად ღამით არის აქტიური, ამიტომ მის კვალს ხშირად თავად ცხოველზე ადრე შეამჩნევთ.",
        ],
      },
      {
        heading: "სად იმალება თაგვი სახლში?",
        paragraphs: [
          "თაგვი დაცულ, ბნელ და იშვიათად შეხებულ ადგილებს ამჯობინებს: ქურისა და მაცივრის უკან, კარადებისა და უჯრების სიღრმეში, ყუთების მიღმა, სათავსოსა და ავტოფარეხში. ბუდე ხშირად სითბოს წყაროსთან ახლოსაა.",
          "თაგვი კედლის ღრუშიც და ჭერსა და იატაკს შორის სივრცეშიც შეიძლება მოძრაობდეს. როგორც წესი, ის ბუდიდან შორს არ მიდის: ICWDM-ის მიხედვით, ერთი თაგვის ყოველდღიური მოძრაობის არეალი საშუალოდ დაახლოებით 3–9 მეტრი დიამეტრისაა. ამიტომ ნიშნები ხშირად მიუთითებს, სად ეძებოთ ბუდე და სად დადგათ ხაფანგი.",
        ],
      },
      {
        heading: "საშიშია თუ არა თაგვი სახლში?",
        paragraphs: [
          "თაგვის დანახვა გადაუდებელი სამედიცინო შემთხვევა არ არის, მაგრამ რისკი რეალურია და ორი მხარე აქვს. პირველი — ზიანი: თაგვი აფუჭებს საკვებს და ღრღნის ელექტროსადენებს, რაც ტექნიკასა და შენობას აზიანებს.",
          "მეორე — ჯანმრთელობა. CDC-ის მიხედვით, მღრღნელებს შეუძლიათ დაავადებების გავრცელება, მათ შორის ჰანტავირუსის, ლეპტოსპიროზისა და სალმონელოზის. ადამიანი შეიძლება დაინფიცირდეს შარდის, ექსკრემენტის ან ბუდის მასალის მტვრით დაბინძურებული ჰაერის ჩასუნთქვით, დაბინძურებულ ზედაპირზე შეხების შემდეგ თვალზე, ცხვირზე ან პირზე ხელის მოკიდებით, ნაკბენით ან დაბინძურებული საკვებით.",
          "დაავადება ინფიცირებული მღრღნელიდან გადადის, და თაგვის გარეგნობით ვერ დაადგენთ, ინფიცირებულია თუ არა. საქართველოში ჰანტავირუსული ინფექციის ლაბორატორიულად დადასტურებული შემთხვევა აღწერილია, თუმცა კავკასიაში ვირუსის მასპინძელი მღრღნელები საკმარისად შესწავლილი არ არის. ამიტომ მთავარია უსაფრთხო დასუფთავება. თუ მღრღნელის ექსკრემენტთან ან ბუდესთან კონტაქტის შემდეგ ცხელება, კუნთების ტკივილი ან სხვა სიმპტომები გაქვთ, მიმართეთ ექიმს და უთხარით მღრღნელთან კონტაქტის შესახებ.",
        ],
      },
      {
        heading: "თაგვის ექსკრემენტი ვიპოვე — როგორ გავწმინდოთ უსაფრთხოდ?",
        image: "cleanup",
        list: {
          items: [
            "გაწმენდამდე გააღეთ კარები და ფანჯრები მინიმუმ 30 წუთით და განიავების დროს ოთახიდან გადით.",
            "გაიკეთეთ რეზინის ან პლასტმასის ხელთათმანები.",
            "ექსკრემენტი და შარდის კვალი უხვად დაასველეთ სადეზინფექციო საშუალებით ან სათეთრებლის ხსნარით და დატოვეთ 5 წუთით ან იმდენ ხანს, რამდენსაც საშუალების ეტიკეტი მიუთითებს. ხსნარი მოამზადეთ ზუსტად ეტიკეტის ინსტრუქციით.",
            "სათეთრებელი არასოდეს შეურიოთ ამიაკს ან სხვა საწმენდ საშუალებას: ასე მომწამვლელი აირი წარმოიქმნება.",
            "დასველებული მასალა ქაღალდის ხელსახოცით აიღეთ და ნაგავში გადააგდეთ.",
            "შემდეგ იმავე საშუალებით გაწმინდეთ ახლომდებარე იატაკი, მაგიდის ზედაპირები და სხვა ადგილები, რომლებიც შეიძლება დაბინძურდა.",
            "ხელთათმანების მოხსნის შემდეგ ხელები საპნითა და წყლით დაიბანეთ.",
          ],
          ordered: true,
        },
        paragraphs: [
          "მთავარი წესი: თაგვის ექსკრემენტი, შარდი და ბუდის მასალა არასოდეს მოხვეტოთ და მტვერსასრუტით არ აიღოთ. CDC-ის მიხედვით, ასე ვირუსის შემცველი უწვრილესი ნაწილაკები შეიძლება ჰაერში მოხვდეს. დაბინძურებული მასალა ჯერ დაასველეთ და მხოლოდ შემდეგ აიღეთ.",
        ],
      },
      {
        heading: "როგორ მოვიშოროთ თაგვი სახლიდან?",
        list: {
          items: [
            "დაადასტურეთ აქტივობა: მოძებნეთ ექსკრემენტი, ღრღნის კვალი და ბუდე, რომ იცოდეთ, სად მოძრაობს თაგვი.",
            "შეზღუდეთ საკვები და წყალი: საკვები, მათ შორის შინაური ცხოველის საკვები, შეინახეთ მჭიდროდ დახურულ სქელ პლასტმასის, ლითონის ან მინის კონტეინერებში, დაღვრილი საკვები და ნამცეცები მაშინვე მოაშორეთ, ნაგავი კი მჭიდროდ დახურულ ურნაში შეინახეთ.",
            "დაიჭირეთ თაგვი: CDC მარწუხა ხაფანგს გირჩევთ. სატყუარად საკმარისია ცოტა არაქისის კარაქი.",
            "ხაფანგები ყოველდღე შეამოწმეთ. დაჭერილი თაგვი ხელთათმანით მოაშორეთ: თაგვი და ხაფანგი დაასველეთ სადეზინფექციო საშუალებით, დატოვეთ 5 წუთით, ჩადეთ პლასტმასის პარკში გამოყენებულ ხაფანგთან ერთად, შეკარით, ჩადეთ მეორე პარკში, ისიც შეკარით და დახურულ ნაგვის ურნაში გადააგდეთ. შემდეგ ხელები დაიბანეთ.",
            "დაბინძურებული ადგილები უსაფრთხოდ გაწმინდეთ, როგორც ზემოთაა აღწერილი.",
            "დახურეთ შემოსასვლელები და შემდეგაც აკვირდით, ჩნდება თუ არა ახალი ექსკრემენტი ან ღრღნის კვალი.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ყველაზე საიმედო შედეგს ნაბიჯების თანმიმდევრობა იძლევა და არა ერთი საშუალება.",
          "CDC წებოვან და ცოცხალ დამჭერ ხაფანგებს არ გირჩევთ: შეშინებულმა თაგვმა შეიძლება შარდი გამოყოს, რაც დაინფიცირების რისკს ზრდის.",
        ],
      },
      {
        heading: "სად დავდგათ თაგვის ხაფანგი?",
        image: "trap",
        list: {
          items: [
            "დადგით იქ, სადაც თაგვი, ექსკრემენტი, ღრღნის კვალი ან ბუდის მასალა ნახეთ.",
            "ხაფანგი კედლის პერპენდიკულარულად, სატყუარიანი ბოლოთი კედლისკენ დადგით, ისე რომ კედელთან ასო „T“ შექმნას.",
            "გამოიყენეთ დახურული, ბნელი ადგილებიც: ქურისა და მაცივრის უკან, კარადებისა და უჯრების სიღრმე და საგნების მიღმა სივრცე.",
            "თუ აქტივობა ფართოა, ერთი ხაფანგი შეიძლება საკმარისი არ იყოს: დადგით იმდენი, რომ თაგვები დროულად დაიჭიროთ.",
            "ხაფანგი ბავშვებისა და შინაური ცხოველებისთვის მიუწვდომელ ადგილას დადგით.",
          ],
        },
        paragraphs: [
          "თაგვი უსაფრთხოებისთვის კედლისა და საგნების გასწვრივ დარბის, ამიტომ ხაფანგი კედელთან უნდა იდგეს.",
        ],
      },
      {
        heading: "შეიძლება თუ არა საწამლავის გამოყენება?",
        paragraphs: [
          "საწამლავი (როდენტიციდი) სახლში პირველი არჩევანი არ უნდა იყოს. შენობაში მოწამლული თაგვი ხშირად კედელში ან სხვა მიუწვდომელ ადგილას კვდება და იქ უსიამოვნო სუნს ტოვებს; ხაფანგის შემთხვევაში კი დაჭერილ თაგვს ხედავთ და მოაშორებთ.",
          "საწამლავი ბავშვებისთვის, შინაური ცხოველებისა და ველური ბუნებისთვისაც სახიფათოა: მოწამლული მღრღნელის შემჭმელი ცხოველიც შეიძლება მოიწამლოს. თუ საწამლავის გამოყენება აუცილებელია, გამოიყენეთ მხოლოდ რეგისტრირებული პროდუქტი, ზუსტად ეტიკეტის მიხედვით, დახურულ, დაზიანებისადმი მდგრად სატყუარის ყუთში, ბავშვებისა და შინაური ცხოველებისთვის მიუწვდომელ ადგილას. მკვდარი მღრღნელები დროულად მოაშორეთ და საწამლავი საკვების, მათ შორის შინაური ცხოველის საკვების, გვერდით არასოდეს შეინახოთ.",
          "ნუ დაამზადებთ თვითნაკეთ საწამლავს და ნუ გამოიყენებთ სოფლის მეურნეობისთვის განკუთვნილ ან დაურეგისტრირებელ ქიმიკატებს. თუ საწამლავი ნამდვილად საჭიროა, უმჯობესია, ეს სამუშაო პროფესიონალს მიანდოთ.",
        ],
      },
      {
        heading: "როგორ აღარ შემოვუშვათ თაგვი სახლში?",
        image: "sealing",
        list: {
          items: [
            "პატარა ხვრელები ამოავსეთ ფოლადის ბურბუშელით (steel wool) და კიდეებზე ჰერმეტიკით დაამაგრეთ, ან გამოიყენეთ სამონტაჟო ქაფი.",
            "დიდი ხვრელები დახურეთ ლითონის ბადით, ცემენტით, თუნუქით ან სხვა მყარი მასალით.",
            "გარე კარებზე დაამონტაჟეთ კარის ქვედა დამცავი ზოლი და დახურეთ ღრიჭოები ფანჯრების, კარების, საძირკვლისა და მილების გარშემო.",
            "საკვები და შინაური ცხოველის საკვები მჭიდროდ დახურულ კონტეინერებში შეინახეთ, დაღვრილი საკვები მაშინვე მოაშორეთ, ნაგავი კი გარეთ, მჭიდროდ დახურულ ურნაში შეინახეთ.",
            "შეამცირეთ ნივთებით გადატვირთული კუთხეები, სადაც თაგვს დამალვა შეუძლია, და სახლი სუფთა და მშრალი შეინარჩუნეთ.",
          ],
        },
        paragraphs: [
          "ხანგრძლივი შედეგისთვის მთავარია შემოსასვლელების დახურვა და საკვებზე წვდომის შეზღუდვა. სახლი შეამოწმეთ როგორც შიგნიდან, ისე გარედან — დიდი და პატარა ღიობებიც.",
        ],
      },
      {
        heading: "რატომ დაბრუნდა თაგვი ისევ?",
        paragraphs: [
          "თუ თაგვის დაჭერის შემდეგ ახალი ნიშნები ისევ ჩნდება, ჩვეულებრივ ეს ნიშნავს, რომ შემოსასვლელი ჯერ კიდევ ღიაა, სახლში ისევ ხელმისაწვდომია საკვები ან თავშესაფარი, სახლში სხვა თაგვებიც იყო, ან ახლები მეზობელი შენობებიდან და ეზოდან შემოდიან.",
          "მეორე თაგვის დანახვა თავისთავად არ ადასტურებს, რომ სახლში ბუდეა, მაგრამ ნიშნავს, რომ საქმე ჯერ არ დასრულებულა: ხელახლა შეამოწმეთ ხვრელები და საკვებზე წვდომა და ხაფანგებით დაკვირვება განაგრძეთ.",
        ],
      },
      {
        heading: "როდის არის საჭირო პროფესიონალის დახმარება?",
        list: {
          items: [
            "თაგვები ხაფანგების, დასუფთავებისა და ხვრელების დახურვის შემდეგაც ისევ ჩნდება.",
            "ექსკრემენტი ბევრია და დაბინძურება ფართოდაა გავრცელებული.",
            "აქტივობა კედელში ან ჭერში, მიუწვდომელ ადგილასაა.",
            "სახურავზე ან საძირკველში შემოსასვლელებს უსაფრთხოდ ვერ დახურავთ.",
            "საწამლავის გამოყენებას განიხილავთ.",
          ],
        },
        paragraphs: [
          "ერთი თაგვის დანახვისას სპეციალისტის გამოძახება აუცილებელი არ არის: ხშირად საკმარისია ხაფანგი, დასუფთავება და ხვრელების დახურვა. პროფესიონალური დახმარება გონივრულია, თუ:",
        ],
      },
    ],
    summary:
      "სახლში თაგვის დანახვისას ჯერ შეამოწმეთ ექსკრემენტი, ღრღნის კვალი და ბუდე. დაიჭირეთ კედელთან დადგმული მარწუხა ხაფანგით. ექსკრემენტი არასოდეს მოხვეტოთ და მტვერსასრუტით არ აიღოთ: ოთახი გაანიავეთ, გაიკეთეთ ხელთათმანები, დაასველეთ სადეზინფექციო საშუალებით და მხოლოდ შემდეგ აიღეთ. ბოლოს დახურეთ ხვრელები და საკვები დახურულ კონტეინერებში შეინახეთ.",
    title:
      "თაგვი სახლში — რატომ შემოდის, როგორ მოვიშოროთ და როგორ აღარ შემოვუშვათ?",
  },
  ru: {
    description:
      "Увидели мышь в доме? Узнайте, почему мыши заходят, как заметить их следы, как поймать, как безопасно убрать помёт и как закрыть щели и отверстия.",
    faq: [
      {
        answer:
          "Не обязательно, но возможно. Проверьте помёт, следы грызения и гнёзда: чем больше признаков и чем шире они распространены, тем больше мышей может быть.",
        question: "Если я видел одну мышь, значит, есть и другие?",
      },
      {
        answer:
          "Нет. CDC не рекомендует подметать или пылесосить помёт грызунов, потому что загрязнённые частицы попадают в воздух. Сначала смочите его дезинфицирующим средством, затем соберите бумажным полотенцем.",
        question: "Можно ли убрать мышиный помёт пылесосом?",
      },
      {
        answer:
          "Поставьте ловушки вдоль стены рядом с признаками и найдите, где мышь заходит. Не кладите яд в полость стены: отравленная мышь может погибнуть там и оставить запах. Если активность в недоступном месте продолжается, обратитесь к специалисту.",
        question: "Мышь в стене — что делать?",
      },
      {
        answer:
          "Возможно, но только по звуку этого не определить: шуметь в стенах и потолке могут и другие животные. Ищите помёт, следы грызения или погрызенную упаковку.",
        question: "Ночью слышу шорох в стене или потолке — это мышь?",
      },
      {
        answer:
          "CDC их не рекомендует: пойманная мышь может испугаться и выделить мочу, что повышает риск заражения. Лучше использовать пружинную мышеловку.",
        question: "Использовать живоловку или клеевую ловушку?",
      },
    ],
    metaTitle: "Мышь в доме: как избавиться от мышей и не пустить их снова",
    sections: [
      {
        heading: "Что делать, если вы увидели мышь в доме?",
        paragraphs: [
          "Одна замеченная мышь не всегда означает большое заселение, но это повод поискать другие признаки и отверстия, через которые она заходит. Мышей в здание привлекают еда, вода, укрытие и открытые щели.",
          "Одной поимки часто недостаточно: если еда доступна, а отверстия открыты, могут прийти новые мыши. Поэтому комплексная защита от вредителей (IPM) начинается с профилактики, закрытия входов и нехимических средств. На практике: подтвердите активность, поймайте мышь, безопасно очистите загрязнённые места, закройте входы и продолжайте наблюдать.",
          "В этом гиде «мышь» означает небольшого грызуна, попавшего в дом. Точно определить вид по бытовым признакам, как правило, нельзя, поэтому советы касаются практических шагов, а не конкретного вида.",
        ],
      },
      {
        heading: "Почему мыши заходят в дом?",
        paragraphs: [
          "Мыши заходят в здания в поисках еды, воды и укрытия. На кухне, в кладовой и в коробках для хранения они находят и еду, и материал для гнезда. Гнездо они часто устраивают рядом с источником тепла, например у компрессора холодильника или водонагревателя.",
          "Мыши активны круглый год, но чаще всего заходят в здания осенью, когда холодает. Так что холод — не единственная причина: если есть еда и открытое отверстие, мышь может появиться в любое время года.",
          "Мыши хватает очень маленького отверстия: по данным CDC, достаточно дыры толщиной с карандаш, около 6 мм в диаметре. Вход может быть под дверью, в щели окна, в фундаменте или там, где трубы и кабели проходят через стену.",
        ],
      },
      {
        heading: "Как понять, есть ли в доме мышь?",
        image: "signs",
        list: {
          items: [
            "Помёт: мелкий, заострённый, примерно с рисовое зерно; часто вдоль стен, рядом с едой или укрытием. Свежий помёт блестящий и мягкий, старый — сухой, светлее и легко крошится.",
            "Следы грызения: погрызенная упаковка продуктов, древесная стружка, маленькие отверстия, изорванная ткань или погрызенные провода.",
            "Гнездо: из мелко изорванной бумаги или другого волокнистого материала, в защищённом месте.",
            "Следы лап: маленькие отпечатки на пыльных поверхностях.",
            "Запах: характерный мускусный запах, заметный при большом или давнем заселении.",
            "Звуки: царапанье, грызение или беготня ночью в стенах, над потолком или под шкафами. Похожие звуки издают и другие животные, поэтому оценивайте их вместе с другими признаками.",
          ],
        },
        paragraphs: [
          "Мыши активны в основном ночью, поэтому их следы вы часто заметите раньше, чем само животное.",
        ],
      },
      {
        heading: "Где мыши прячутся в доме?",
        paragraphs: [
          "Мыши предпочитают защищённые, тёмные и редко тревожимые места: за плитой и холодильником, в глубине шкафов и ящиков, за коробками, в кладовых и гаражах. Гнездо часто находится рядом с источником тепла.",
          "Мыши могут передвигаться и в полостях стен, и в пространстве между потолком и полом. Обычно они держатся недалеко от гнезда: по данным ICWDM, суточный участок одной мыши в среднем около 3–9 метров в поперечнике. Поэтому признаки часто подсказывают, где искать гнездо и где ставить ловушки.",
        ],
      },
      {
        heading: "Опасны ли мыши в доме?",
        paragraphs: [
          "Увиденная мышь — не неотложная медицинская ситуация, но риск реален, и у него две стороны. Первая — ущерб: мыши портят продукты и грызут электропроводку, что повреждает технику и здание.",
          "Вторая — здоровье. По данным CDC, грызуны могут распространять болезни, в том числе хантавирус, лептоспироз и сальмонеллёз. Человек может заразиться, вдохнув воздух с пылью от мочи, помёта или материала гнезда, прикоснувшись к загрязнённой поверхности, а затем к глазам, носу или рту, через укус или с загрязнённой едой.",
          "Болезни передаются от заражённых грызунов, и по внешнему виду мыши нельзя понять, заражена ли она. В Грузии описан лабораторно подтверждённый случай хантавирусной инфекции, но грызуны-хозяева вируса на Кавказе изучены недостаточно. Поэтому главное — безопасная уборка. Если после контакта с помётом или гнездом грызунов у вас появились температура, боли в мышцах или другие симптомы, обратитесь к врачу и сообщите о контакте с грызунами.",
        ],
      },
      {
        heading: "Нашли мышиный помёт? Как безопасно убрать",
        image: "cleanup",
        list: {
          items: [
            "Перед уборкой откройте двери и окна минимум на 30 минут и на время проветривания выйдите из помещения.",
            "Наденьте резиновые или пластиковые перчатки.",
            "Обильно смочите помёт и следы мочи дезинфицирующим средством или раствором отбеливателя и оставьте на 5 минут или на время, указанное на этикетке средства. Готовьте раствор строго по инструкции на этикетке.",
            "Никогда не смешивайте отбеливатель с нашатырным спиртом или другими чистящими средствами: при этом образуется ядовитый газ.",
            "Соберите смоченный материал бумажными полотенцами и выбросьте в мусор.",
            "Затем тем же средством очистите пол, столешницы и другие поверхности рядом, которые могли быть загрязнены.",
            "Сняв перчатки, вымойте руки водой с мылом.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Главное правило: никогда не подметайте и не пылесосьте мышиный помёт, мочу и материал гнезда. По данным CDC, так мельчайшие частицы с вирусом могут попасть в воздух. Сначала смочите загрязнённый материал и только потом убирайте.",
        ],
      },
      {
        heading: "Как избавиться от мыши в доме?",
        list: {
          items: [
            "Подтвердите активность: найдите помёт, следы грызения и гнёзда, чтобы знать, где передвигается мышь.",
            "Ограничьте доступ к еде и воде: храните продукты, в том числе корм для питомцев, в плотно закрытых контейнерах из толстого пластика, металла или стекла, сразу убирайте просыпанное и крошки, а мусор держите в ведре с плотной крышкой.",
            "Поймайте мышь: CDC рекомендует пружинные мышеловки. В качестве приманки достаточно немного арахисовой пасты.",
            "Проверяйте ловушки каждый день. Пойманную мышь убирайте в перчатках: опрыскайте её и ловушку дезинфицирующим средством, оставьте на 5 минут, положите в пластиковый пакет вместе с использованной ловушкой, завяжите, положите во второй пакет, тоже завяжите и выбросьте в мусорный бак с крышкой. Затем вымойте руки.",
            "Безопасно очистите загрязнённые места, как описано выше.",
            "Закройте входы и продолжайте следить, не появляются ли новый помёт или следы грызения.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Самый надёжный результат даёт последовательность шагов, а не одно средство.",
          "CDC не рекомендует клеевые ловушки и живоловки: испуганная мышь может выделить мочу, что повышает риск заражения.",
        ],
      },
      {
        heading: "Где ставить мышеловку?",
        image: "trap",
        list: {
          items: [
            "Ставьте ловушки там, где видели мышь, помёт, следы грызения или материал гнезда.",
            "Ставьте ловушку перпендикулярно стене, стороной с приманкой к стене, чтобы вместе со стеной она образовала букву «Т».",
            "Используйте и закрытые тёмные места: за плитой и холодильником, в глубине шкафов и ящиков, за предметами.",
            "Если активность широкая, одной ловушки может не хватить: ставьте столько, чтобы поймать мышей вовремя.",
            "Ставьте ловушки там, куда не могут добраться дети и домашние животные.",
          ],
        },
        paragraphs: [
          "Мыши для безопасности бегают вдоль стен и предметов, поэтому ловушка должна стоять у стены.",
        ],
      },
      {
        heading: "Можно ли использовать яд от мышей?",
        paragraphs: [
          "Яд (родентицид) не должен быть первым выбором в доме. Отравленная в здании мышь часто погибает в стене или другом недоступном месте и оставляет там неприятный запах; с ловушкой вы видите пойманную мышь и можете её убрать.",
          "Яд опасен и для детей, домашних животных и дикой природы: животное, съевшее отравленного грызуна, тоже может отравиться. Если яд всё же необходим, используйте только зарегистрированный продукт строго по этикетке, в закрытой защищённой от вскрытия приманочной станции, в месте, недоступном для детей и домашних животных. Своевременно убирайте мёртвых грызунов и никогда не храните яд рядом с едой, в том числе с кормом для питомцев.",
          "Не делайте самодельный яд и не используйте сельскохозяйственные или незарегистрированные химикаты. Если яд действительно нужен, лучше доверить эту работу специалисту.",
        ],
      },
      {
        heading: "Как не пустить мышей в дом снова?",
        image: "sealing",
        list: {
          items: [
            "Маленькие отверстия заполните стальной ватой и закрепите по краям герметиком или используйте монтажную пену.",
            "Крупные отверстия закройте металлической сеткой, цементом, листовым металлом или другим прочным материалом.",
            "Установите на наружные двери нижние уплотнители (щётки) и заделайте щели вокруг окон, дверей, фундамента и труб.",
            "Храните продукты и корм для питомцев в плотно закрытых контейнерах, сразу убирайте просыпанное, а мусор держите на улице в плотно закрытом баке.",
            "Уменьшите захламлённость, где мышь может спрятаться, и держите дом чистым и сухим.",
          ],
        },
        paragraphs: [
          "Для долгого результата главное — закрыть входы и ограничить доступ к еде. Осмотрите дом изнутри и снаружи: и большие, и маленькие отверстия.",
        ],
      },
      {
        heading: "Почему мышь вернулась?",
        paragraphs: [
          "Если после поимки мыши снова появляются признаки, обычно это значит, что вход всё ещё открыт, в доме по-прежнему доступны еда или укрытие, в доме были и другие мыши или новые приходят из соседних зданий и со двора.",
          "Вторая замеченная мышь сама по себе не доказывает, что в доме есть гнездо, но означает, что работа не закончена: снова проверьте отверстия и доступ к еде и продолжайте наблюдение с ловушками.",
        ],
      },
      {
        heading: "Когда нужна помощь специалиста?",
        list: {
          items: [
            "Мыши продолжают появляться после ловушек, уборки и заделки отверстий.",
            "Помёта много, и загрязнение распространено широко.",
            "Активность в стенах или потолке, в недоступном месте.",
            "Входы на крыше или в фундаменте невозможно безопасно закрыть.",
            "Вы рассматриваете применение яда.",
          ],
        },
        paragraphs: [
          "Одна замеченная мышь не требует вызова специалиста: часто достаточно ловушек, уборки и заделки отверстий. Профессиональная помощь оправдана, если:",
        ],
      },
    ],
    summary:
      "Увидев мышь в доме, сначала проверьте помёт, следы грызения и гнёзда. Поймайте её пружинной мышеловкой, поставленной у стены. Никогда не подметайте и не пылесосьте помёт: проветрите помещение, наденьте перчатки, смочите его дезинфицирующим средством и только потом убирайте. Затем закройте отверстия и храните продукты в закрытых контейнерах.",
    title: "Мышь в доме: почему заходит, как избавиться и не пустить снова",
  },
  tr: {
    description:
      "Evde fare mi gördünüz? Neden girdiğini, izlerini nasıl tanıyacağınızı, nasıl yakalayacağınızı, dışkıyı güvenle temizlemeyi ve açıklıkları kapatmayı öğrenin.",
    faq: [
      {
        answer:
          "Mutlaka değil, ama mümkün. Dışkı, kemirme izi ve yuva arayın: iz ne kadar çok ve yaygınsa, o kadar çok fare olabilir.",
        question: "Bir fare görmek başkalarının da olduğu anlamına mı gelir?",
      },
      {
        answer:
          "Hayır. CDC, kemirgen dışkısının süpürülmemesini veya elektrikli süpürgeyle çekilmemesini önerir; kirli parçacıklar havaya karışabilir. Önce dezenfektanla ıslatın, sonra kâğıt havluyla alın.",
        question: "Fare dışkısı elektrikli süpürgeyle temizlenebilir mi?",
      },
      {
        answer:
          "Kapanları duvar boyunca izlerin yakınına kurun ve farenin nereden girdiğini bulun. Duvar boşluğuna zehir koymayın: zehirlenen fare orada ölüp koku bırakabilir. Etkinlik ulaşılamayan bir yerde sürerse bir uzmana başvurun.",
        question: "Fare duvarın içindeyse ne yapmalı?",
      },
      {
        answer:
          "Olabilir, ama yalnızca sesle anlaşılmaz: duvar ve tavanda başka hayvanlar da ses çıkarabilir. Dışkı, kemirme izi veya kemirilmiş ambalaj arayın.",
        question: "Geceleri duvarda veya tavanda ses duyuyorum, fare mi?",
      },
      {
        answer:
          "CDC önermez: yakalanan fare korkup idrar yapabilir, bu da bulaş riskini artırır. Yaylı kapan daha iyi bir seçimdir.",
        question:
          "Canlı yakalama kapanı mı, yapışkanlı kapan mı kullanmalıyım?",
      },
    ],
    metaTitle: "Evde fare: farelerden nasıl kurtulunur, nasıl uzak tutulur?",
    sections: [
      {
        heading: "Evde fare gördüyseniz ne yapmalısınız?",
        paragraphs: [
          "Tek bir fare görmek her zaman büyük bir istila anlamına gelmez, ama başka izleri ve girdiği açıklıkları aramak için yeterli bir nedendir. Fareleri binaya yiyecek, su, barınak ve açık aralıklar çeker.",
          "Yalnızca yakalamak çoğu zaman yetmez: yiyecek erişilebilir ve delikler açık kalırsa yeni fareler girebilir. Bu yüzden entegre zararlı yönetimi (IPM) önleme, girişleri kapatma ve kimyasal olmayan yöntemlerle başlar. Uygulamada: etkinliği doğrulayın, fareyi yakalayın, kirlenen yerleri güvenle temizleyin, girişleri kapatın ve izlemeyi sürdürün.",
          'Bu rehberde "fare", eve girmiş küçük bir kemirgen anlamına gelir. Günlük izlerden türü kesin olarak belirlemek genellikle mümkün değildir; bu yüzden öneriler belirli bir türe değil, pratik adımlara odaklanır.',
        ],
      },
      {
        heading: "Fareler eve neden girer?",
        paragraphs: [
          "Fareler binalara yiyecek, su ve barınak aramak için girer. Mutfakta, kilerde ve saklama kutularında hem yiyecek hem yuva malzemesi bulurlar. Yuvayı sıklıkla bir ısı kaynağının yakınına, örneğin buzdolabı kompresörü veya su ısıtıcısının yanına yaparlar.",
          "Fareler yıl boyunca etkindir, ama binalara en çok sonbaharda, havalar soğurken girerler. Yani tek neden soğuk değildir: yiyecek ve açık bir delik varsa, fare her mevsim görülebilir.",
          "Fareye çok küçük bir açıklık yeter: CDC'ye göre kalem kalınlığında, yaklaşık 6 mm çapında bir delik yeterlidir. Giriş kapının altında, pencere aralığında, temelde ya da boru ve kabloların duvardan geçtiği yerlerde olabilir.",
        ],
      },
      {
        heading: "Evde fare olup olmadığı nasıl anlaşılır?",
        image: "signs",
        list: {
          items: [
            "Dışkı: küçük, sivri, yaklaşık pirinç tanesi büyüklüğünde; sıklıkla duvar boyunca, yiyeceğin veya barınağın yakınında. Taze dışkı parlak ve yumuşaktır; eskisi kuru, daha açık renkli ve kolay ufalanır.",
            "Kemirme izleri: kemirilmiş gıda ambalajı, talaş, küçük delikler, parçalanmış kumaş veya kemirilmiş kablolar.",
            "Yuva: ince parçalanmış kâğıt veya başka lifli malzemeden, korunaklı bir yerde.",
            "İzler: tozlu yüzeylerde küçük ayak izleri.",
            "Koku: büyük veya uzun süreli istilada hissedilen karakteristik misk kokusu.",
            "Sesler: geceleri duvarların içinde, tavanın üstünde veya dolapların altında tırmalama, kemirme ya da koşuşturma. Benzer sesleri başka hayvanlar da çıkarabilir; sesleri diğer izlerle birlikte değerlendirin.",
          ],
        },
        paragraphs: [
          "Fareler çoğunlukla geceleri etkindir; bu yüzden izlerini çoğu zaman hayvanın kendisinden önce fark edersiniz.",
        ],
      },
      {
        heading: "Fareler evde nerede saklanır?",
        paragraphs: [
          "Fareler korunaklı, karanlık ve nadiren rahatsız edilen yerleri tercih eder: ocak ve buzdolabının arkası, dolap ve çekmecelerin dip kısmı, kutuların arkası, depo odaları ve garajlar. Yuva çoğu zaman bir ısı kaynağının yakınındadır.",
          "Fareler duvar boşluklarında ve tavan ile döşeme arasındaki boşlukta da dolaşabilir. Genellikle yuvadan uzaklaşmazlar: ICWDM'ye göre bir farenin günlük dolaşım alanı ortalama yaklaşık 3–9 metre çapındadır. Bu yüzden izler, yuvanın nerede aranacağını ve kapanların nereye kurulacağını çoğu zaman gösterir.",
        ],
      },
      {
        heading: "Evdeki fare tehlikeli mi?",
        paragraphs: [
          "Fare görmek tıbbi bir acil durum değildir, ama risk gerçektir ve iki yönü vardır. Birincisi zarar: fareler yiyecekleri bozar ve elektrik kablolarını kemirir; bu da cihazlara ve binaya zarar verir.",
          "İkincisi sağlık. CDC'ye göre kemirgenler hantavirüs, leptospiroz ve salmonelloz dahil çeşitli hastalıkları yayabilir. İnsan; idrar, dışkı veya yuva malzemesinin tozuyla kirlenmiş havayı soluyarak, kirli bir yüzeye dokunup ardından gözüne, burnuna veya ağzına dokunarak, ısırılarak ya da kirlenmiş yiyecekle enfekte olabilir.",
          "Hastalıklar enfekte kemirgenlerden bulaşır ve farenin görünüşünden enfekte olup olmadığı anlaşılamaz. Gürcistan'da laboratuvarca doğrulanmış bir hantavirüs enfeksiyonu vakası tanımlanmıştır, ancak Kafkasya'da virüsün konakçı kemirgenleri yeterince incelenmemiştir. Bu yüzden en önemlisi güvenli temizliktir. Kemirgen dışkısı veya yuvasıyla temastan sonra ateş, kas ağrısı ya da başka belirtiler olursa doktora gidin ve kemirgenle teması belirtin.",
        ],
      },
      {
        heading: "Fare dışkısı buldunuz mu? Güvenli temizlik",
        image: "cleanup",
        list: {
          items: [
            "Temizlikten önce kapı ve pencereleri en az 30 dakika açın ve havalandırma sırasında odadan çıkın.",
            "Kauçuk veya plastik eldiven takın.",
            "Dışkı ve idrar izlerini dezenfektan veya çamaşır suyu çözeltisiyle iyice ıslatın ve 5 dakika ya da ürün etiketinde yazan süre kadar bekletin. Çözeltiyi tam olarak etiket talimatına göre hazırlayın.",
            "Çamaşır suyunu asla amonyakla veya başka bir temizlik ürünüyle karıştırmayın: zehirli gaz oluşur.",
            "Islatılmış malzemeyi kâğıt havluyla alın ve çöpe atın.",
            "Ardından aynı ürünle yakındaki zemini, tezgâhları ve kirlenmiş olabilecek diğer yüzeyleri temizleyin.",
            "Eldivenleri çıkardıktan sonra ellerinizi sabun ve suyla yıkayın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Temel kural: fare dışkısını, idrarını ve yuva malzemesini asla süpürmeyin veya elektrikli süpürgeyle çekmeyin. CDC'ye göre bu, virüs içeren çok küçük parçacıkları havaya karıştırabilir. Kirli malzemeyi önce ıslatın, ancak sonra toplayın.",
        ],
      },
      {
        heading: "Evdeki fareden nasıl kurtulunur?",
        list: {
          items: [
            "Etkinliği doğrulayın: farenin nerede dolaştığını bilmek için dışkı, kemirme izi ve yuva arayın.",
            "Yiyecek ve suyu kısıtlayın: evcil hayvan maması dahil yiyecekleri sıkı kapaklı kalın plastik, metal veya cam kaplarda saklayın, dökülenleri ve kırıntıları hemen temizleyin, çöpü sıkı kapaklı bir kovada tutun.",
            "Fareyi yakalayın: CDC yaylı kapan önerir. Yem olarak biraz fıstık ezmesi yeterlidir.",
            "Kapanları her gün kontrol edin. Yakalanan fareyi eldivenle alın: fareyi ve kapanı dezenfektanla ıslatın, 5 dakika bekletin, kullanılmış kapanla birlikte plastik bir poşete koyun, ağzını bağlayın, ikinci bir poşete koyup onu da bağlayın ve kapaklı bir çöp kutusuna atın. Ardından ellerinizi yıkayın.",
            "Kirlenen yerleri yukarıda anlatıldığı gibi güvenle temizleyin.",
            "Girişleri kapatın ve yeni dışkı veya kemirme izi çıkıp çıkmadığını izlemeye devam edin.",
          ],
          ordered: true,
        },
        paragraphs: [
          "En güvenilir sonuç tek bir üründen değil, adımların sırasından gelir.",
          "CDC yapışkanlı kapanları ve canlı yakalama kapanlarını önermez: korkan fare idrar yapabilir, bu da bulaş riskini artırır.",
        ],
      },
      {
        heading: "Fare kapanı nereye kurulmalı?",
        image: "trap",
        list: {
          items: [
            "Kapanları fare, dışkı, kemirme izi veya yuva malzemesi gördüğünüz yerlere kurun.",
            'Kapanı duvara dik, yemli ucu duvara bakacak şekilde kurun; duvarla birlikte bir "T" harfi oluşturmalıdır.',
            "Kapalı ve karanlık yerleri de kullanın: ocak ve buzdolabının arkası, dolap ve çekmecelerin dip kısmı, eşyaların arkası.",
            "Etkinlik yaygınsa tek kapan yetmeyebilir: fareleri zamanında yakalayacak kadar kapan kurun.",
            "Kapanları çocukların ve evcil hayvanların ulaşamayacağı yerlere koyun.",
          ],
        },
        paragraphs: [
          "Fareler güvenlik için duvar ve eşyaların kenarından koşar; bu yüzden kapan duvarın dibinde durmalıdır.",
        ],
      },
      {
        heading: "Fare zehri kullanılabilir mi?",
        paragraphs: [
          "Zehir (rodentisit) evde ilk seçenek olmamalıdır. Bina içinde zehirlenen fare sıklıkla duvarın içinde veya ulaşılamayan başka bir yerde ölür ve orada kötü koku bırakır; kapanla ise yakalanan fareyi görür ve atarsınız.",
          "Zehir çocuklar, evcil hayvanlar ve yaban hayatı için de tehlikelidir: zehirlenmiş bir kemirgeni yiyen hayvan da zehirlenebilir. Zehir gerçekten gerekliyse yalnızca kayıtlı bir ürünü, tam olarak etiketine göre, kapalı ve kurcalanmaya dayanıklı bir yem istasyonunda, çocukların ve evcil hayvanların ulaşamayacağı yerde kullanın. Ölü kemirgenleri zamanında kaldırın ve zehri asla yiyeceklerin, evcil hayvan maması dahil, yanında saklamayın.",
          "Ev yapımı zehir hazırlamayın; tarım ilaçlarını veya kayıtsız kimyasalları kullanmayın. Zehir gerçekten gerekiyorsa bu işi bir uzmana bırakmak daha iyidir.",
        ],
      },
      {
        heading: "Farelerin eve yeniden girmesi nasıl önlenir?",
        image: "sealing",
        list: {
          items: [
            "Küçük delikleri çelik yünle doldurun ve kenarlarını dolgu macunuyla sabitleyin ya da poliüretan köpük kullanın.",
            "Büyük delikleri metal tel örgü, çimento, sac levha veya benzeri sağlam malzemeyle kapatın.",
            "Dış kapılara kapı altı fırçası takın; pencere, kapı, temel ve boruların çevresindeki aralıkları kapatın.",
            "Yiyecekleri ve evcil hayvan mamasını sıkı kapaklı kaplarda saklayın, dökülen yiyeceği hemen temizleyin, çöpü dışarıda sıkı kapaklı bir kovada tutun.",
            "Farenin saklanabileceği dağınıklığı azaltın; evi temiz ve kuru tutun.",
          ],
        },
        paragraphs: [
          "Kalıcı sonuç için girişleri kapatmak ve yiyeceğe erişimi kısıtlamak şarttır. Evi hem içeriden hem dışarıdan, büyük ve küçük açıklıklar için kontrol edin.",
        ],
      },
      {
        heading: "Fare neden geri geldi?",
        paragraphs: [
          "Fare yakalandıktan sonra yeni izler çıkıyorsa, genellikle bir giriş hâlâ açıktır, evde yiyecek veya barınak hâlâ erişilebilirdir, evde başka fareler de vardı ya da yakındaki binalardan ve bahçeden yenileri giriyordur.",
          "İkinci bir fare görmek tek başına evde yuva olduğunu kanıtlamaz, ama işin bitmediğini gösterir: açıklıkları ve yiyecek erişimini yeniden kontrol edin ve kapanlarla izlemeyi sürdürün.",
        ],
      },
      {
        heading: "Ne zaman profesyonel yardım gerekir?",
        list: {
          items: [
            "Kapan, temizlik ve açıklıkları kapatmaya rağmen fareler görülmeye devam ediyor.",
            "Çok sayıda dışkı var ve kirlilik yaygın.",
            "Etkinlik duvarın veya tavanın içinde, ulaşılamayan bir yerde.",
            "Çatıdaki veya temeldeki girişler güvenle kapatılamıyor.",
            "Zehir kullanmayı düşünüyorsunuz.",
          ],
        },
        paragraphs: [
          "Tek bir fare görmek uzman çağırmayı gerektirmez: çoğu zaman kapan, temizlik ve delikleri kapatmak yeterlidir. Profesyonel yardım şu durumlarda mantıklıdır:",
        ],
      },
    ],
    summary:
      "Evde fare gördüğünüzde önce dışkı, kemirme izi ve yuva arayın. Fareyi duvar dibine kurulan yaylı bir kapanla yakalayın. Dışkıyı asla süpürmeyin veya elektrikli süpürgeyle çekmeyin: odayı havalandırın, eldiven takın, dezenfektanla ıslatın ve ancak sonra toplayın. Son olarak delikleri kapatın ve yiyecekleri kapalı kaplarda saklayın.",
    title: "Evde fare: neden girer, nasıl kurtulunur ve nasıl uzak tutulur?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "CDC — How to Clean Up After Rodents",
    supports: {
      en: "Do not sweep or vacuum rodent waste; air out for 30 minutes and leave; rubber or plastic gloves; wet with disinfectant or bleach solution for 5 minutes or per label; paper towels; disinfect nearby surfaces; double-bag dead rodents with used traps; wash hands.",
      ka: "მღრღნელის ნარჩენები არ მოხვეტოთ და მტვერსასრუტით არ აიღოთ; 30 წუთით განიავება ოთახის დატოვებით; რეზინის ან პლასტმასის ხელთათმანები; დასველება სადეზინფექციო საშუალებით ან სათეთრებლის ხსნარით 5 წუთით ან ეტიკეტის მიხედვით; ქაღალდის ხელსახოცი; ახლომდებარე ზედაპირების დეზინფექცია; მკვდარი მღრღნელის ორმაგ პარკში ჩადება ხაფანგთან ერთად; ხელების დაბანა.",
      ru: "Не подметать и не пылесосить отходы грызунов; проветривание 30 минут с выходом из помещения; резиновые или пластиковые перчатки; смачивание дезсредством или раствором отбеливателя на 5 минут или по этикетке; бумажные полотенца; дезинфекция поверхностей рядом; двойной пакет для мёртвых грызунов вместе с ловушкой; мытьё рук.",
      tr: "Kemirgen atıkları süpürülmez veya elektrikli süpürgeyle çekilmez; odadan çıkarak 30 dakika havalandırma; kauçuk veya plastik eldiven; dezenfektan veya çamaşır suyu çözeltisiyle 5 dakika ya da etikete göre ıslatma; kâğıt havlu; yakın yüzeylerin dezenfeksiyonu; ölü kemirgenin kapanla birlikte çift poşetlenmesi; el yıkama.",
    },
    url: "https://www.cdc.gov/healthy-pets/rodent-control/clean-up.html",
  },
  {
    name: "CDC — How to Trap Up to Remove Rodents",
    supports: {
      en: "Snap traps recommended; glue and live traps not recommended because frightened rodents urinate; placement where activity is seen and in closed areas behind the stove and refrigerator and in cabinets and drawers; traps against the wall in a T shape with peanut butter bait; check daily and remove rodents wearing gloves.",
      ka: "რეკომენდებულია მარწუხა ხაფანგი; წებოვანი და ცოცხალი დამჭერი ხაფანგები არა, რადგან შეშინებული მღრღნელი შარდს გამოყოფს; ხაფანგი აქტივობის ადგილას და დახურულ სივრცეში, ქურისა და მაცივრის უკან, კარადებსა და უჯრებში; კედელთან „T“-სებრად, არაქისის კარაქის სატყუარით; ყოველდღიური შემოწმება და ხელთათმანით მოშორება.",
      ru: "Рекомендуются пружинные ловушки; клеевые и живоловки не рекомендуются, так как испуганные грызуны выделяют мочу; размещение в местах активности и в закрытых местах за плитой, холодильником, в шкафах и ящиках; у стены буквой «Т» с арахисовой пастой; ежедневная проверка и уборка в перчатках.",
      tr: "Yaylı kapan önerilir; korkan kemirgen idrar yaptığı için yapışkanlı ve canlı kapanlar önerilmez; etkinlik görülen yerlere ve ocak, buzdolabı arkası, dolap ve çekmecelere yerleştirme; duvara T biçiminde, fıstık ezmesi yemle; her gün kontrol ve eldivenle alma.",
    },
    url: "https://www.cdc.gov/healthy-pets/rodent-control/trap-up.html",
  },
  {
    name: "CDC — How to Seal Up to Prevent Rodents",
    supports: {
      en: "Mice can fit through a hole the width of a pencil (6 mm); fill small holes with steel wool and caulk or spray foam; close larger holes with lath screen or metal, cement, hardware cloth or metal sheeting; check inside and outside; store food and pet food in tight containers and clean spills right away.",
      ka: "თაგვი ფანქრის სისქის (6 მმ) ხვრელში ეტევა; პატარა ხვრელები ფოლადის ბურბუშელითა და ჰერმეტიკით ან სამონტაჟო ქაფით; დიდი ხვრელები ლითონის ბადით, ცემენტით ან ლითონის ფურცლით; შემოწმება შიგნით და გარეთ; საკვები და შინაური ცხოველის საკვები მჭიდრო კონტეინერებში, დაღვრილის მაშინვე მოშორება.",
      ru: "Мышь пролезает в отверстие толщиной с карандаш (6 мм); мелкие отверстия заполнять стальной ватой с герметиком или пеной; крупные закрывать металлической сеткой, цементом или листовым металлом; осмотр изнутри и снаружи; продукты и корм в плотных контейнерах, сразу убирать просыпанное.",
      tr: "Fare kalem kalınlığında (6 mm) bir delikten geçebilir; küçük delikler çelik yün ve dolgu macunu veya köpükle; büyük delikler metal örgü, çimento veya sacla; içeride ve dışarıda kontrol; yiyecek ve mama sıkı kaplarda, dökülenler hemen temizlenir.",
    },
    url: "https://www.cdc.gov/healthy-pets/rodent-control/seal-up.html",
  },
  {
    name: "CDC — Controlling Wild Rodent Infestations",
    supports: {
      en: "Rodents can spread diseases including hantavirus, leptospirosis and salmonellosis; routes include breathing contaminated air, touching contaminated surfaces then the eyes, nose or mouth, bites, and contaminated food.",
      ka: "მღრღნელებს შეუძლიათ დაავადებების, მათ შორის ჰანტავირუსის, ლეპტოსპიროზისა და სალმონელოზის გავრცელება; გზები: დაბინძურებული ჰაერის ჩასუნთქვა, დაბინძურებულ ზედაპირზე შეხება და შემდეგ თვალზე, ცხვირზე ან პირზე, ნაკბენი და დაბინძურებული საკვები.",
      ru: "Грызуны могут распространять болезни, включая хантавирус, лептоспироз и сальмонеллёз; пути: вдыхание загрязнённого воздуха, прикосновение к загрязнённым поверхностям и затем к лицу, укусы и загрязнённая еда.",
      tr: "Kemirgenler hantavirüs, leptospiroz ve salmonelloz dahil hastalıklar yayabilir; yollar: kirli havayı solumak, kirli yüzeye dokunup yüze dokunmak, ısırık ve kirlenmiş yiyecek.",
    },
    url: "https://www.cdc.gov/healthy-pets/rodent-control/index.html",
  },
  {
    name: "CDC — About Hantavirus",
    supports: {
      en: "If disease is suspected after rodent contact, see a doctor and mention the potential rodent exposure.",
      ka: "მღრღნელთან კონტაქტის შემდეგ დაავადებაზე ეჭვისას მიმართეთ ექიმს და უთხარით შესაძლო კონტაქტის შესახებ.",
      ru: "При подозрении на болезнь после контакта с грызунами обратиться к врачу и сообщить о возможном контакте.",
      tr: "Kemirgen temasından sonra hastalıktan şüphelenilirse doktora gidip olası teması belirtmek.",
    },
    url: "https://www.cdc.gov/hantavirus/about/index.html",
  },
  {
    name: "CDC — How to Safely Clean and Sanitize with Bleach",
    supports: {
      en: "Never mix bleach with ammonia or any other cleaner; the mixture produces a poisonous gas.",
      ka: "სათეთრებელი არასოდეს შეურიოთ ამიაკს ან სხვა საწმენდ საშუალებას; ნარევი მომწამვლელ აირს წარმოქმნის.",
      ru: "Никогда не смешивать отбеливатель с нашатырём или другими чистящими средствами: образуется ядовитый газ.",
      tr: "Çamaşır suyu asla amonyak veya başka bir temizleyiciyle karıştırılmaz; karışım zehirli gaz oluşturur.",
    },
    url: "https://www.cdc.gov/natural-disasters/safety/how-to-safely-clean-and-sanitize-with-bleach.html",
  },
  {
    name: "Kuchuloria et al. 2009 — Hantavirus Infection in the Republic of Georgia (Emerging Infectious Diseases)",
    supports: {
      en: "A laboratory-confirmed hantavirus infection was described in Georgia; rodent hosts in the Caucasus are poorly known.",
      ka: "საქართველოში აღწერილია ჰანტავირუსული ინფექციის ლაბორატორიულად დადასტურებული შემთხვევა; კავკასიაში მასპინძელი მღრღნელები ცუდადაა შესწავლილი.",
      ru: "В Грузии описан лабораторно подтверждённый случай хантавирусной инфекции; грызуны-хозяева на Кавказе изучены слабо.",
      tr: "Gürcistan'da laboratuvarca doğrulanmış bir hantavirüs vakası tanımlandı; Kafkasya'daki konakçı kemirgenler az bilinir.",
    },
    url: "https://wwwnc.cdc.gov/eid/article/15/9/09-0617_article",
  },
  {
    name: "UC IPM — House Mouse (Pest Notes 7483)",
    supports: {
      en: "Signs (droppings, gnaw marks, tracks), nests of shredded paper in sheltered places, musky odour, mostly nocturnal activity, gnawing of wires; traps close to walls, behind objects and in dark corners where there is activity, with enough traps; key to control is limiting access and removing food, water and shelter.",
      ka: "ნიშნები (ექსკრემენტი, ღრღნის კვალი, ნაფეხურები), დაფლეთილი ქაღალდის ბუდე დაცულ ადგილას, მუშკისებრი სუნი, ძირითადად ღამის აქტივობა, სადენების ღრღნა; ხაფანგები კედელთან, საგნების მიღმა და ბნელ კუთხეებში, საკმარისი რაოდენობით; კონტროლის გასაღები: წვდომის შეზღუდვა და საკვების, წყლისა და თავშესაფრის მოშორება.",
      ru: "Признаки (помёт, следы грызения, следы лап), гнёзда из бумаги в укрытиях, мускусный запах, ночная активность, грызение проводов; ловушки у стен, за предметами и в тёмных углах, в достаточном количестве; ключ к контролю: ограничить доступ, убрать еду, воду и укрытия.",
      tr: "İzler (dışkı, kemirme, ayak izi), korunaklı yerde kâğıt yuva, misk kokusu, çoğunlukla gece etkinliği, kablo kemirme; kapanlar duvar dibine, eşyaların arkasına ve karanlık köşelere, yeterli sayıda; kontrolün anahtarı: erişimi kısıtlamak, yiyecek, su ve barınağı kaldırmak.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/house-mouse/",
  },
  {
    name: "Penn State Extension — Is There a Mouse in the House? Eliminate Mice with IPM",
    supports: {
      en: "IPM starts with prevention, exclusion and non-chemical tools; pointed, rice-grain-sized droppings; food and nesting material in pantries and storage boxes; entry through pencil-sized holes; seal gaps around windows, doors, foundation and pipes; door sweeps; sealed food containers, clean and dry home, less clutter, tightly closed outdoor bins; snap traps set toward the wall with peanut butter.",
      ka: "IPM იწყება პრევენციით, ხვრელების დახურვითა და არაქიმიური საშუალებებით; წაწვეტებული, ბრინჯის მარცვლის ზომის ექსკრემენტი; საკვები და ბუდის მასალა საკუჭნაოსა და ყუთებში; შემოსვლა ფანქრის ზომის ხვრელით; ღრიჭოების დახურვა ფანჯრების, კარების, საძირკვლისა და მილების გარშემო; კარის ქვედა ზოლი; დახურული კონტეინერები, სისუფთავე, სიმშრალე, ნაკლები ნივთები, დახურული ურნა გარეთ; მარწუხა ხაფანგი კედლისკენ, არაქისის კარაქით.",
      ru: "IPM начинается с профилактики, закрытия входов и нехимических средств; заострённый помёт размером с рисовое зерно; еда и материал для гнезда в кладовых и коробках; вход через отверстие размером с карандаш; заделка щелей у окон, дверей, фундамента и труб; дверные уплотнители; закрытые контейнеры, чистота, сухость, меньше хлама, закрытый бак на улице; пружинная ловушка к стене с арахисовой пастой.",
      tr: "IPM önleme, girişleri kapatma ve kimyasal olmayan yöntemlerle başlar; sivri, pirinç tanesi büyüklüğünde dışkı; kiler ve kutularda yiyecek ve yuva malzemesi; kalem büyüklüğünde delikten giriş; pencere, kapı, temel ve boru çevresindeki aralıkları kapatma; kapı altı fırçası; kapalı kaplar, temiz ve kuru ev, az dağınıklık, kapalı dış çöp kutusu; duvara bakan, fıstık ezmeli yaylı kapan.",
    },
    url: "https://extension.psu.edu/is-there-a-mouse-in-the-house-eliminate-mice-with-ipm",
  },
  {
    name: "ICWDM — House Mouse Biology",
    supports: {
      en: "Mice are active year-round and most likely to invade structures as temperatures cool in autumn; they prefer to nest near heat sources such as compressors and water heaters; one mouse's daily range averages 10–30 feet (about 3–9 m) across.",
      ka: "თაგვი მთელი წელი აქტიურია და შენობაში შემოსვლის ალბათობა შემოდგომით, აგრილებისას, ყველაზე მაღალია; ბუდეს სითბოს წყაროსთან, მაგ. კომპრესორთან ან წყლის გამაცხელებელთან, ამჯობინებს; ერთი თაგვის ყოველდღიური არეალი საშუალოდ 10–30 ფუტია (დაახლ. 3–9 მ).",
      ru: "Мыши активны круглый год и чаще всего заходят в здания осенью при похолодании; гнездятся рядом с источниками тепла, например компрессорами и водонагревателями; суточный участок одной мыши в среднем 10–30 футов (около 3–9 м).",
      tr: "Fareler yıl boyunca etkindir ve binalara en çok sonbaharda, havalar soğurken girer; kompresör ve su ısıtıcısı gibi ısı kaynaklarının yakınında yuva yapar; bir farenin günlük alanı ortalama 10–30 fit (yaklaşık 3–9 m) çapındadır.",
    },
    url: "https://icwdm.org/species/rodents/house-mice/house-mouse-biology/",
  },
  {
    name: "ICWDM — House Mouse Damage Identification",
    supports: {
      en: "Where droppings are found; fresh droppings are shiny and soft, old ones dry, lighter and crumbly; gnawing evidence such as wood chips, holes, shredded fabric and frayed wires.",
      ka: "სად გვხვდება ექსკრემენტი; ახალი ექსკრემენტი პრიალა და რბილია, ძველი მშრალი, ღია ფერის და ადვილად იფშვნება; ღრღნის კვალი: ნაფოტები, ხვრელები, დაფლეთილი ქსოვილი და დაზიანებული სადენები.",
      ru: "Где встречается помёт; свежий блестящий и мягкий, старый сухой, светлее и крошится; следы грызения: стружка, отверстия, изорванная ткань, повреждённые провода.",
      tr: "Dışkının bulunduğu yerler; taze dışkı parlak ve yumuşak, eskisi kuru, açık renkli ve ufalanır; kemirme izleri: talaş, delikler, parçalanmış kumaş ve yıpranmış kablolar.",
    },
    url: "https://icwdm.org/species/rodents/house-mice/house-mouse-damage-identification/",
  },
  {
    name: "ICWDM — Inspection",
    supports: {
      en: "Sounds of gnawing, scratching and scurrying inside walls, above ceilings, between floors or under cabinets can come from various animals living indoors.",
      ka: "ღრღნის, ფხაკუნისა და სირბილის ხმა კედლებში, ჭერში, სართულებს შორის ან კარადების ქვეშ შეიძლება სხვადასხვა ცხოველს ეკუთვნოდეს.",
      ru: "Звуки грызения, царапанья и беготни в стенах, над потолком, между этажами или под шкафами могут издавать разные животные.",
      tr: "Duvarlarda, tavan üstünde, katlar arasında veya dolap altında kemirme, tırmalama ve koşuşturma sesleri farklı hayvanlardan gelebilir.",
    },
    url: "https://icwdm.org/identification/inspection/",
  },
  {
    name: "ICWDM — House Mouse Damage Prevention and Control Methods",
    supports: {
      en: "Rodenticide use indoors often leaves mice dying inside the structure; trapping lets you see and dispose of mice and avoids dead-mouse odours from poisoning.",
      ka: "შენობაში როდენტიციდის გამოყენებისას თაგვი ხშირად შენობის შიგნით კვდება; ხაფანგით დაჭერილ თაგვს ხედავთ და მოაშორებთ, რაც მკვდარი თაგვის სუნს გამორიცხავს.",
      ru: "При использовании родентицидов в здании мыши часто гибнут внутри конструкций; ловушка позволяет увидеть и убрать мышь и избежать запаха.",
      tr: "Bina içinde rodentisit kullanıldığında fareler çoğu zaman yapının içinde ölür; kapan fareyi görüp atmayı sağlar ve ölü fare kokusunu önler.",
    },
    url: "https://icwdm.org/species/rodents/house-mice/house-mouse-damage-prevention-and-control-methods/",
  },
  {
    name: "US EPA — Safely Use Rodent Bait Products",
    supports: {
      en: "Read and follow the label; keep baits and traps out of reach of children and pets; use the bait station supplied with consumer products; remove dead rodents promptly to prevent secondary poisoning; never store pesticides next to food, including pet food.",
      ka: "ეტიკეტის წაკითხვა და დაცვა; სატყუარა და ხაფანგი ბავშვებისა და შინაური ცხოველებისთვის მიუწვდომელ ადგილას; სატყუარის ყუთის გამოყენება; მკვდარი მღრღნელის დროული მოშორება მეორადი მოწამვლის თავიდან ასაცილებლად; პესტიციდი არასოდეს საკვების, მათ შორის ცხოველის საკვების, გვერდით.",
      ru: "Читать и соблюдать этикетку; приманки и ловушки вне досягаемости детей и животных; использовать приманочную станцию; своевременно убирать мёртвых грызунов во избежание вторичного отравления; не хранить пестициды рядом с едой и кормом.",
      tr: "Etiketi okuyup uymak; yem ve kapanları çocuk ve evcil hayvanların ulaşamayacağı yere koymak; yem istasyonu kullanmak; ikincil zehirlenmeyi önlemek için ölü kemirgenleri hemen kaldırmak; pestisitleri asla yiyecek ve mamanın yanında saklamamak.",
    },
    url: "https://www.epa.gov/rodenticides/safely-use-rodent-bait-products",
  },
];

export const MOUSE_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "A small grey-brown mouse next to a gap at the base of a white skirting board in a kitchen",
      ka: "პატარა რუხი-მოყავისფრო თაგვი სამზარეულოში, თეთრი პლინტუსის ძირში არსებულ ღრიჭოსთან",
      ru: "Маленькая серо-коричневая мышь у щели в основании белого плинтуса на кухне",
      tr: "Mutfakta beyaz süpürgeliğin dibindeki aralığın yanında küçük gri-kahverengi bir fare",
    },
    height: 941,
    src: "https://cdn.reptiles.ge/external/house-mouse-kitchen-skirting-board-gap.jpg",
    width: 1672,
  },
  id: "mouse-in-house",
  images: {
    cleanup: {
      alt: {
        en: "A hand in a rubber glove spraying disinfectant on the floor by a skirting board, the other holding a paper towel, with an open window behind",
        ka: "რეზინის ხელთათმანიანი ხელი პლინტუსთან იატაკზე სადეზინფექციო საშუალებას აპკურებს, მეორე ხელში ქაღალდის ხელსახოცია, ფონზე ღია ფანჯარაა",
        ru: "Рука в резиновой перчатке распыляет дезинфицирующее средство на пол у плинтуса, в другой руке бумажное полотенце, за ними открытое окно",
        tr: "Lastik eldivenli bir el süpürgelik dibindeki zemine dezenfektan püskürtüyor, diğer elde kâğıt havlu var, arkada açık bir pencere",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/mouse-dropping-disinfectant-cleanup.jpg",
      width: 1672,
    },
    sealing: {
      alt: {
        en: "A gloved hand pushing steel wool into a gap around a pipe under a kitchen sink, with a caulking gun and fresh sealant nearby",
        ka: "ხელთათმანიანი ხელი სამზარეულოს ნიჟარის ქვეშ მილის გარშემო ღრიჭოში ფოლადის ბურბუშელას ტენის, გვერდით ჰერმეტიკის პისტოლეტი და ახალი ჰერმეტიკია",
        ru: "Рука в перчатке заталкивает стальную вату в щель вокруг трубы под кухонной мойкой, рядом пистолет для герметика и свежий герметик",
        tr: "Eldivenli bir el mutfak lavabosunun altında borunun çevresindeki aralığa çelik yün dolduruyor, yanında dolgu tabancası ve taze dolgu macunu var",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/mouse-entry-gap-steel-wool-sealant.jpg",
      width: 1672,
    },
    signs: {
      alt: {
        en: "A food package on a pantry shelf with a chewed hole at the corner, spilled grains and small droppings nearby",
        ka: "საკუჭნაოს თაროზე საკვების შეფუთვა კუთხეში დაღრღნილი ხვრელით, გვერდით მიმოფანტული მარცვლები და პატარა ექსკრემენტი",
        ru: "Упаковка продуктов на полке кладовой с прогрызенной дырой в углу, рядом рассыпанные зёрна и мелкий помёт",
        tr: "Kiler rafında köşesi kemirilmiş bir gıda paketi, yanında dökülmüş taneler ve küçük dışkılar",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/mouse-signs-pantry-chewed-package.jpg",
      width: 1672,
    },
    trap: {
      alt: {
        en: "A snap trap set at a right angle to a white skirting board, with the baited end against the wall",
        ka: "მარწუხა ხაფანგი თეთრი პლინტუსის პერპენდიკულარულად, სატყუარიანი ბოლოთი კედელთან",
        ru: "Пружинная мышеловка перпендикулярно белому плинтусу, стороной с приманкой к стене",
        tr: "Beyaz süpürgeliğe dik kurulmuş, yemli ucu duvara dayalı yaylı kapan",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/mouse-snap-trap-against-skirting-board.jpg",
      width: 1672,
    },
  },
  messageKey: "mouseInHouse",
  ogImage: "/og/images/guides/mouse-in-house.jpg",
  parentHub: "mammals",
  pathname: "/mammals/tagvi-sakhlshi",
  search: {
    icon: "guide",
    keywords: [
      "თაგვი",
      "თაგვი სახლში",
      "თაგვის ხაფანგი",
      "თაგვის ექსკრემენტი",
      "მღრღნელი",
      "tagvi",
      "mouse",
      "mice",
      "mouse trap",
      "мышь",
      "мыши в доме",
      "мышеловка",
      "fare",
      "fare kapanı",
    ],
    rank: 5,
    subtitle: {
      en: "Signs, trapping, safe cleanup and keeping mice out",
      ka: "ნიშნები, ხაფანგი, უსაფრთხო დასუფთავება და პრევენცია",
      ru: "Признаки, ловушки, безопасная уборка и профилактика",
      tr: "İzler, kapan, güvenli temizlik ve önleme",
    },
    title: {
      en: "Mouse in the house",
      ka: "თაგვი სახლში",
      ru: "Мышь в доме",
      tr: "Evde fare",
    },
  },
  sources: SOURCES,
});
