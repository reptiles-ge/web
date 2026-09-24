import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "bait" | "cleaning" | "gap" | "sealing";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Ants in the house? Learn how to find where they get in, remove food and moisture, use bait safely, and when to call a pest management professional.",
    faq: [
      {
        answer:
          "Not necessarily. A few worker ants often come in from outside to look for food. An indoor nest is more likely if they keep appearing in the same place every day after food is removed and the entry point is sealed, or if winged ants repeatedly emerge indoors.",
        question: "If I only saw a few ants, is the nest in the house?",
      },
      {
        answer:
          "A bathroom is a source of moisture, and ants look for water as well as food; some species also nest in moisture-damaged wood. Dry wet spots, fix leaks, and seal accessible gaps around pipe openings. Do not block vents or drains.",
        question: "Why do ants appear in the bathroom?",
      },
      {
        answer:
          "Often, yes, especially when ants come in from outside. According to UC IPM, removing food and water and sealing entry points come first, and a weather-driven invasion sometimes ends within a few days to a week if the ants find no food. If the nest is indoors or out of reach, this may not be enough.",
        question: "Can you get rid of ants without chemicals?",
      },
      {
        answer:
          "Cleaning the trail removes visible ants right away, but only temporarily. With bait, activity often drops within a few days, while full control can take several weeks or longer, depending on the species and the product. If activity does not decrease even though you follow the label, contact a professional.",
        question: "How long should it take to see results?",
      },
    ],
    metaTitle: "Ants in the house: how to get rid of them?",
    sections: [
      {
        heading: "How do you get rid of ants in the house?",
        image: "cleaning",
        list: {
          items: [
            "Watch before you wipe. Follow the ant trail for a few minutes and see where the ants come in and where they are heading. Once the trail is cleaned, this is much harder to work out.",
            "Check the places you can reach: the food cupboard, around the sink, skirting boards, door and window frames, and where pipes pass through the wall. Do not open electrical equipment or take walls apart: if the trail disappears somewhere out of reach, that is useful information for a professional.",
            "Remove food. Pick up crumbs and spills, especially sweet ones. Store food in tightly closed glass or hard plastic containers rather than cardboard boxes or paper wrapping, and use a bin with a tight lid. Keep pet food stored closed too and keep the area around the bowl clean; your pet should always have drinking water.",
            "Deal with moisture. Fix dripping taps and leaking pipes, dry areas under the sink or in the bathroom that stay wet, and do not leave standing water.",
            "Clean the trail. Wipe surfaces where the ants were walking, especially near the entry point, with soapy water or an ordinary mild detergent; you can also pick the ants up with a vacuum cleaner. This removes visible ants and their scent trail for a while, but it does not deal with the nest. If you are already using bait, do not wipe the trail around it (see below).",
            "Choose the next step. If the entry point is a gap you can reach, seal it with caulk. If the ants keep coming back after food is removed and surfaces are cleaned, or you cannot find where they get in, consider bait or professional help. If you use bait, decide in advance when to seal the gap the ants use to reach it: that is the route along which they carry the bait to the nest. Follow the label or the professional's advice.",
          ],
          ordered: true,
        },
        paragraphs: [
          "First find out where the ants come in and where they are heading. Then remove accessible food and moisture, clean the surfaces, and seal the gaps you can reach. If the ants still come back, the next step is a targeted approach, such as bait, or advice from a professional.",
          "The ants you see in a room are usually a small part of the colony (the family of ants living in one nest): workers look for food, while the nest and the egg-laying queen, or several queens, stay elsewhere. So removing the visible ants does not yet mean the problem is solved.",
        ],
      },
      {
        heading: "Why do ants come into the house?",
        image: "gap",
        paragraphs: [
          "Ants mostly come indoors looking for food and water, and sometimes for shelter. According to the University of California Statewide Integrated Pest Management Program (UC IPM), a sudden appearance often follows a change in the weather, such as heat, drought or heavy rain, or a drop in food outdoors.",
          "When a worker ant finds food, it leaves a scent trail (a pheromone) back to the nest, and others follow it. That is why ants often move in a single line along the same route.",
          "Seeing ants does not mean the home is dirty, and it does not mean the nest is necessarily inside. Often they come in from outside through gaps, around doors and windows, or through pipe openings. Some species do nest in buildings: behind skirting boards and trim, under kitchen countertops, in wall voids, or in moisture-damaged wood.",
          "If ants keep appearing in the same place every day even though food has been removed and the known entry point is sealed, it is worth finding out whether the nest is inside the house or in a wall.",
        ],
      },
      {
        heading: "Bait or spray: what is the difference?",
        image: "bait",
        list: {
          items: [
            "Choose a product whose label lists ants and the place where you want to use it, for example indoor living areas. The label sets the rules for placement, replacement and safety.",
            "Place it beside the ant trail, where the ants actually walk, not somewhere random.",
            "Do not use sprays or cleaning products around the bait or on the trail leading to it: they put ants off the bait. Normal kitchen cleaning carries on everywhere else.",
            "Place it out of reach of children and pets, and not next to food or on food-preparation surfaces. Bait contains food ingredients and attracts many animals.",
            "Check within the first day whether the ants are feeding. If they ignore the bait, remove it and try another product whose label fits, or contact a professional. Do not use more than the label says.",
            "Results take time. In the first days, more ants at the bait may mean they are feeding and carrying it to the nest; on its own, that is neither a sign of failure nor a guarantee of success. According to the University of Kentucky, activity often drops within a few days, while according to UC IPM and the University of Minnesota, full control can take several weeks or longer. The time depends on the species, the product, the size of the colony and how well the bait is accepted.",
          ],
        },
        paragraphs: [
          "A spray kills only the ants it hits directly. According to the University of Kentucky Department of Entomology, the ants walking over open surfaces are a small part of the colony, so spraying only the ones you see usually fails. UC IPM notes that sprays are usually not needed indoors and give only temporary control.",
          "Bait works differently: it combines food that attracts ants with a slow-acting insecticide. Workers carry the food to the nest and share it with others, including the queen. The slow action is essential: the ant has to get the food back to the nest.",
          "An enclosed bait station does not trap ants: the ant goes in, feeds, and carries the food back to the nest. The station reduces direct contact with the bait, but it does not make it completely safe.",
          "Bait does not work the same way on every species. Ants prefer different foods, some sweet, some protein or fat, and according to UC IPM, a bait that does not attract the species present gives no control. UC IPM also advises placing bait outdoors, by the trail or the entry point, where possible, and indoors only when the problem is serious and you cannot find where the ants get in, because bait placed indoors can draw ants inside.",
          "If you use bait:",
        ],
      },
      {
        heading:
          "Why do ants keep coming back, and when do you need a professional?",
        list: {
          items: [
            "Activity continues even after food, moisture and entry points have been dealt with and the product label has been followed.",
            "You suspect the nest is somewhere out of reach, for example in a wall or under the floor.",
            "The problem involves several rooms or neighbouring apartments.",
            "Winged ants repeatedly emerge indoors.",
            "You see activity around damp or damaged wooden structures.",
          ],
        },
        paragraphs: [
          "Ants often come back because food or moisture is still available (a bin, a pet bowl, a leak under the sink), because the entry point is somewhere else or there are several, or because the nest is out of reach, for example in a wall void. With bait, common reasons are that it does not attract this species or that a spray or cleaner was used around it. These are observations, not a diagnosis: often only identifying the species and an on-site inspection show the exact cause.",
          "One exception matters in particular. According to the University of Minnesota, using an insecticide on Pharaoh ants (Monomorium pharaonis) can make the colony split and form new colonies; they are hard to eliminate, and an experienced professional is recommended. This does not apply to every ant or every product, and you cannot recognise a Pharaoh ant by small size and colour alone. So if small ants keep appearing in large numbers in different parts of the home, have a professional identify the species before you reach for a spray.",
          "In an apartment building, if ants appear in several apartments or in shared areas, raise it with your neighbours or the building manager, such as the homeowners' association: an ant trail can cross the boundaries of a single apartment.",
          "According to the University of Kentucky, professionals have more experience with ants and a wider range of tools. Contact an experienced pest management professional and ask them to explain which species they are dealing with, what they will use, and where. This is especially sensible if:",
        ],
      },
      {
        heading: "Small, black, red or winged: what does appearance tell you?",
        paragraphs: [
          "Colour and size are not enough to identify an ant species. The University of Minnesota Extension notes that ants are often hard to identify even from a photo, and different species may need different treatment. So “black”, “red” or “small” is a description, not a species name: a black ant is not automatically one particular species, a small reddish ant is not automatically a Pharaoh ant, and a red ant is not automatically dangerous.",
          "Behaviour often tells you more than appearance: where they show up, where they are heading, and whether they keep returning to the same spot. If you contact a professional, these observations will help.",
          "Winged ants are the colony's reproductive females and males, so not every winged ant is a queen. One or two winged ants may have flown in from outside through an open window or door. If they appear in a room repeatedly and in numbers, according to the University of Minnesota, that is a sign of a nest inside the building.",
          "A winged ant is sometimes mistaken for a winged termite. An ant has a narrow, pinched “waist” and elbowed antennae, and in winged ants the hind wings are shorter than the front wings. If the insect does not match these features, leave the identification to a specialist.",
          "Some large ants, for example species of the genus Camponotus (carpenter ants), nest in damp or decayed wood and dig galleries in it, but they do not eat the wood. If you repeatedly see ants by a wet wooden structure, fix the source of moisture and ask a professional to assess it.",
        ],
      },
      {
        heading:
          "Vinegar, baking soda and other home remedies: what to expect?",
        list: {
          items: [
            "Soapy water or a mild detergent. Useful for wiping away the trail and its scent and removing visible ants for a while. Limitation: it does not deal with the nest and is not used around bait.",
            "Vinegar diluted with water. According to the University of Minnesota, wiping the trail with it temporarily disrupts ant activity. Limitation: the effect is temporary, and it does not destroy the colony.",
            "Baking soda, salt, cinnamon, essential oils and similar. They are often presented as a “barrier” or a “poison”. Limitation: the sources this guide relies on give no basis for recommending them as reliable colony control. That does not mean any effect has been proven impossible.",
            "Homemade boric acid or borax mixed with food. Limitation: this is a homemade pesticide with no label, no dosing and no safety warnings, and a sweet mixture also attracts pets. A manufactured bait that may contain boron compounds is a different thing: it has a label and rules of use, and a homemade mixture is not its equivalent.",
          ],
        },
        paragraphs: [
          "Home tips often mix up two different things: ordinary surface cleaning and homemade poison. The first is a useful step; the second is in effect a homemade pesticide.",
          "“Natural” or “homemade” does not automatically mean safe. According to the US National Pesticide Information Center (NPIC), home recipes are often untested, do not say how much to use, where or how often, and carry no safety warnings; even a low-toxicity ingredient can be harmful in excess. For each remedy below: what it may be useful for and its main limitation.",
        ],
      },
      {
        heading: "How do you use products safely?",
        list: {
          items: [
            "Use only a product whose label lists ants and the place of use. Do not use a product meant for outdoors inside the home: according to the EPA, it stays toxic longer indoors.",
            "Do not use more than the label says. According to the EPA, using too much pesticide can endanger your family's health.",
            "Prefer a ready-to-use product that needs no mixing, and do not mix household chemicals together.",
            "Do not spray a whole room. Apart from baits and traps, a pesticide is applied only to targeted spots.",
            "Place bait and other products out of reach of children and pets. An enclosed station reduces the risk but does not make the bait completely harmless.",
            "Protect food, dishes and food-contact surfaces as the label instructs.",
            "Keep pesticides in their original packaging, out of children's reach. Never reuse an empty container for anything else, least of all food or drink.",
          ],
        },
        paragraphs: [
          "Ants in the house are usually not an emergency, although some species can bite or sting, and misusing chemical products adds risk of its own. The US Environmental Protection Agency (EPA) recommends prevention before chemicals: removing sources of food, water and shelter.",
          "If an ant bites or stings you, according to the NHS, it is usually not serious: there may be pain, itching or swelling that passes within a few hours or days. Call 112 immediately if the lips, mouth, throat or tongue suddenly swell, breathing or swallowing becomes difficult, the skin or lips turn blue, grey or pale, or the person suddenly becomes very confused, drowsy or dizzy. Seeing ants is not in itself a reason to call 112: call 112 when the immediate arrival of emergency services is vital.",
          "If you use a chemical product:",
        ],
      },
      {
        heading: "How do you keep ants from coming back?",
        image: "sealing",
        list: {
          items: [
            "Wipe up sweet spills and crumbs straight away, and keep open food in closed containers.",
            "Use a bin with a tight lid, and keep the area around the pet bowl clean.",
            "Fix leaks promptly and replace moisture-damaged wood.",
            "Seal accessible cracks by skirting boards, frames and pipe openings with caulk; this also keeps out other insects, such as [stink bugs](/insects/farosana-sakhlshi). Do not block vents or drains, and do not work on wiring or sockets yourself.",
            "Outside, trim plants and branches so they do not touch the walls or roof: ants use them as bridges.",
          ],
        },
        paragraphs: [
          "According to UC IPM, keeping ants out of the building and removing their food and water sources is the main approach. Once the ants are gone, a few routine habits help keep them away:",
        ],
      },
    ],
    summary:
      "Ants usually come in for food and water. Find where they enter, remove food and moisture, clean the trail with soapy water, and seal the gaps you can reach. Removing visible ants does not deal with the nest: if they return, use a bait whose label fits, with no sprays or cleaners around it, or contact a professional. Seeing ants is no reason to call 112; call if a bite brings signs of a severe allergic reaction.",
    title: "Ants in the house: how to get rid of them and keep them out",
  },
  ka: {
    description:
      "ჭიანჭველები სახლში გაჩნდა? გაიგეთ, როგორ იპოვოთ შემოსასვლელი, მოაშოროთ საკვები, გამოიყენოთ სატყუარა უსაფრთხოდ და როდის მიმართოთ სპეციალისტს.",
    faq: [
      {
        answer:
          "აუცილებლად არა. რამდენიმე მუშა ჭიანჭველა ხშირად გარედან, საკვების საძებნელად შემოდის. ბუდე შიგნით უფრო სავარაუდოა, თუ საკვების მოშორებისა და შემოსასვლელის დახურვის შემდეგაც ყოველდღე ერთსა და იმავე ადგილას ჩნდებიან, ან თუ ოთახში განმეორებით გამოდიან ფრთიანი ჭიანჭველები.",
        question: "თუ მხოლოდ რამდენიმე ჭიანჭველა დავინახე, ბუდე სახლშია?",
      },
      {
        answer:
          "სააბაზანო ტენის წყაროა, ჭიანჭველები კი საკვებთან ერთად წყალსაც ეძებენ; ზოგი სახეობა დანესტიანებულ ხეშიც ბუდობს. გააშრეთ სველი ადგილები, შეაკეთეთ ჟონვა და მილების გასასვლელების ირგვლივ ხელმისაწვდომი ღრიჭოები დახურეთ. სავენტილაციო და სადრენაჟო ღიობები არ დახშოთ.",
        question: "რატომ ჩნდებიან ჭიანჭველები სააბაზანოში?",
      },
      {
        answer:
          "ხშირად, დიახ, განსაკუთრებით თუ ჭიანჭველები გარედან მოდიან. UC IPM-ის მიხედვით, პირველი ნაბიჯი საკვებისა და წყლის მოშორება და შემოსასვლელების დახურვაა, ამინდით გამოწვეული შემოსვლა კი, თუ ჭიანჭველები საკვებს ვერ პოულობენ, ზოგჯერ რამდენიმე დღეში ან ერთ კვირაში წყდება. თუ ბუდე სახლშია ან მიუწვდომელია, ეს შეიძლება საკმარისი არ იყოს.",
        question: "შეიძლება ჭიანჭველების მოშორება ქიმიის გარეშე?",
      },
      {
        answer:
          "ბილიკის გაწმენდა ხილულ ჭიანჭველებს მაშინვე, მაგრამ დროებით აშორებს. სატყუარის შემთხვევაში აქტივობა ხშირად რამდენიმე დღეში იკლებს, სრულ შედეგს კი შეიძლება რამდენიმე კვირა ან მეტი დასჭირდეს, სახეობისა და პროდუქტის მიხედვით. თუ ეტიკეტის დაცვის მიუხედავად აქტივობა არ მცირდება, მიმართეთ სპეციალისტს.",
        question: "რამდენ ხანში უნდა გამოჩნდეს შედეგი?",
      },
    ],
    metaTitle: "ჭიანჭველები სახლში - როგორ მოვიშოროთ?",
    sections: [
      {
        heading: "როგორ მოვიშოროთ ჭიანჭველები სახლიდან?",
        image: "cleaning",
        list: {
          items: [
            "დააკვირდით, სანამ ბილიკს წაშლით. რამდენიმე წუთით გაჰყევით ჭიანჭველების ბილიკს და ნახეთ, სად შემოდიან და რისკენ მიდიან. გაწმენდის შემდეგ ამის გარკვევა გაცილებით რთულია.",
            "შეამოწმეთ ხელმისაწვდომი ადგილები: საკვების კარადა, ნიჟარის ირგვლივ, პლინტუსები, კარისა და ფანჯრის ჩარჩოები და ის ადგილები, სადაც მილები კედელში შედის. ნუ გახსნით ელექტრომოწყობილობას და ნუ დაშლით კედელს: თუ ბილიკი მიუწვდომელ ადგილას ქრება, ესეც სასარგებლო ინფორმაციაა სპეციალისტისთვის.",
            "მოაშორეთ საკვები. აიღეთ ნამცეცები და დაღვრილი სითხე, განსაკუთრებით ტკბილი. საკვები შეინახეთ მჭიდროდ დახურულ მინის ან მყარი პლასტმასის ჭურჭელში და არა მუყაოს ყუთში ან ქაღალდის შეფუთვაში, ნაგვის ურნას კი მჭიდრო სახურავი ჰქონდეს. შინაური ცხოველის საკვების მარაგიც დახურულად შეინახეთ და ჯამის ირგვლივ სისუფთავე შეინარჩუნეთ; სასმელი წყალი ცხოველს ყოველთვის უნდა ჰქონდეს.",
            "მოაგვარეთ ტენი. შეაკეთეთ წვეთავი ონკანი და ჟონვადი მილი, გააშრეთ ნიჟარის ქვეშ ან სააბაზანოში მუდმივად სველი ადგილები და ნუ დატოვებთ დამდგარ წყალს.",
            "გაწმინდეთ ბილიკი. ზედაპირი, სადაც ჭიანჭველები დადიოდნენ, განსაკუთრებით შემოსასვლელთან, გაწმინდეთ საპნიანი წყლით ან ჩვეულებრივი რბილი სარეცხი საშუალებით; ჭიანჭველების აღება მტვერსასრუტითაც შეიძლება. ეს ხილულ ჭიანჭველებსა და მათ სუნის კვალს დროებით აშორებს, მაგრამ ბუდეს ვერ მოაგვარებს. თუ სატყუარას უკვე იყენებთ, მის ირგვლივ ბილიკს ნუ წაშლით (იხ. ქვემოთ).",
            "აირჩიეთ შემდეგი ნაბიჯი. თუ შემოსასვლელი ხელმისაწვდომი ღრიჭოა, დახურეთ ჰერმეტიკით. თუ ჭიანჭველები საკვების მოშორებისა და გაწმენდის შემდეგაც ბრუნდებიან ან შემოსასვლელს ვერ პოულობთ, განიხილეთ სატყუარა ან სპეციალისტის დახმარება. თუ სატყუარას იყენებთ, წინასწარ გადაწყვიტეთ, როდის დახურავთ ღრიჭოს, რომლითაც ჭიანჭველები სატყუარამდე მოდიან: სწორედ ამ გზით მიაქვთ მათ სატყუარა ბუდეში. მიჰყევით ეტიკეტის ან სპეციალისტის მითითებას.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ჯერ გაარკვიეთ, საიდან შემოდიან და რისკენ მიდიან ჭიანჭველები. შემდეგ მოაშორეთ ხელმისაწვდომი საკვები და ტენი, გაწმინდეთ ზედაპირები და დახურეთ ღრიჭოები, რომლებსაც მიწვდებით. თუ ამის შემდეგაც ბრუნდებიან, შემდეგი ნაბიჯი მიზნობრივი საშუალებაა, მაგალითად, სატყუარა, ან სპეციალისტის რჩევა.",
          "ოთახში დანახული ჭიანჭველები, როგორც წესი, კოლონიის (ერთ ბუდეში მცხოვრები ჭიანჭველების ოჯახის) მცირე ნაწილია: საკვებს მუშა ჭიანჭველები ეძებენ, ბუდე და კვერცხის მდებელი დედოფალი (ზოგ სახეობაში რამდენიმე დედოფალი) კი სხვაგან რჩება. ამიტომ ხილული ჭიანჭველების მოცილება ჯერ კიდევ არ ნიშნავს, რომ პრობლემა მოგვარებულია.",
        ],
      },
      {
        heading: "რატომ ჩნდებიან ჭიანჭველები სახლში?",
        image: "gap",
        paragraphs: [
          "ჭიანჭველები შენობაში ძირითადად საკვებისა და წყლის საძებნელად შემოდიან, ზოგჯერ კი თავშესაფრისთვის. კალიფორნიის უნივერსიტეტის მავნებლების ინტეგრირებული მართვის პროგრამის (UC IPM) მიხედვით, მათი უეცარი გამოჩენა ხშირად ამინდის ცვლილებას, მაგალითად, სიცხეს, გვალვას ან ძლიერ წვიმას, ან გარეთ საკვების შემცირებას მოჰყვება.",
          "როცა მუშა ჭიანჭველა საკვებს იპოვის, ბუდემდე სუნის კვალს (ფერომონს) ტოვებს, სხვები კი ამ კვალს მიჰყვებიან. ამიტომ ჭიანჭველები ხშირად ერთ ხაზად, ერთი და იმავე გზით მოძრაობენ.",
          "ჭიანჭველების დანახვა არ ნიშნავს, რომ სახლი უსუფთაოა, და არც იმას, რომ ბუდე აუცილებლად შიგნითაა. ხშირად ისინი გარედან შემოდიან: ღრიჭოებიდან, კარისა და ფანჯრის ირგვლივ ან მილების გასასვლელებიდან. ზოგი სახეობა კი შენობაშიც ბუდობს: პლინტუსებისა და მოპირკეთების მიღმა, სამზარეულოს დახლის ქვეშ, კედლის ღრუში ან დანესტიანებულ ხეში.",
          "თუ ჭიანჭველები ყოველდღე ერთსა და იმავე ადგილას ჩნდებიან, მიუხედავად იმისა, რომ საკვები მოშორებულია და ცნობილი შემოსასვლელი დახურულია, ღირს იმის გარკვევა, ხომ არ არის ბუდე სახლში ან კედელში.",
        ],
      },
      {
        heading: "სატყუარა თუ სპრეი: რა განსხვავებაა?",
        image: "bait",
        list: {
          items: [
            "აირჩიეთ პროდუქტი, რომლის ეტიკეტზეც ჭიანჭველები და გამოყენების ადგილი, მაგალითად, საცხოვრებელი სივრცე, არის მითითებული. დადების, შეცვლისა და უსაფრთხოების წესებს ეტიკეტი განსაზღვრავს.",
            "დადეთ ჭიანჭველების ბილიკის გვერდით, იქ, სადაც ისინი რეალურად დადიან, და არა შემთხვევით ადგილას.",
            "სატყუარის ირგვლივ და მისკენ მიმავალ ბილიკზე ნუ გამოიყენებთ სპრეის ან სარეცხ საშუალებას: ეს ჭიანჭველებს სატყუარასგან აფრთხობს. სამზარეულოს ჩვეულებრივი დასუფთავება დანარჩენ ადგილებში გრძელდება.",
            "დადეთ ბავშვებისა და შინაური ცხოველებისთვის მიუწვდომელ ადგილას და არა საკვებთან ან საკვების მოსამზადებელ ზედაპირზე. სატყუარა საკვებ ინგრედიენტებს შეიცავს და ბევრ ცხოველს იზიდავს.",
            "პირველი დღის განმავლობაში შეამოწმეთ, იკვებებიან თუ არა. თუ სატყუარას ყურადღებას არ აქცევენ, აიღეთ და სცადეთ სხვა პროდუქტი, რომელიც ეტიკეტით შეესაბამება, ან მიმართეთ სპეციალისტს. ნუ გადააჭარბებთ ეტიკეტზე მითითებულ რაოდენობას.",
            "შედეგს დრო სჭირდება. პირველ დღეებში სატყუარასთან ჭიანჭველების მომატება შეიძლება ნიშნავდეს, რომ ისინი იკვებებიან და საკვები ბუდეში მიაქვთ; ეს თავისთავად არც წარუმატებლობის ნიშანია და არც წარმატების გარანტია. კენტუკის უნივერსიტეტის მიხედვით, აქტივობა ხშირად რამდენიმე დღეში იკლებს, UC IPM-ისა და მინესოტას უნივერსიტეტის მიხედვით კი სრულ შედეგს შეიძლება რამდენიმე კვირა ან მეტი დასჭირდეს. ვადა დამოკიდებულია სახეობაზე, პროდუქტზე, კოლონიის ზომასა და იმაზე, რამდენად კარგად იღებენ ჭიანჭველები სატყუარას.",
          ],
        },
        paragraphs: [
          "სპრეი მხოლოდ იმ ჭიანჭველებს კლავს, რომლებსაც პირდაპირ მოხვდება. კენტუკის უნივერსიტეტის ენტომოლოგიის დეპარტამენტის მიხედვით, ღია ზედაპირზე მოსიარულე ჭიანჭველები კოლონიის მცირე ნაწილია, ამიტომ მხოლოდ დანახულის შესხურება, როგორც წესი, შედეგს არ იძლევა. UC IPM აღნიშნავს, რომ სახლის შიგნით სპრეი, როგორც წესი, საჭირო არ არის და მხოლოდ დროებით ეფექტს იძლევა.",
          "სატყუარა სხვაგვარად მოქმედებს: ის ჭიანჭველისთვის მიმზიდველ საკვებსა და ნელა მოქმედ ინსექტიციდს აერთიანებს. მუშა ჭიანჭველებს საკვები ბუდეში მიაქვთ და სხვებს, მათ შორის დედოფალს, უნაწილებენ. ნელი მოქმედება აუცილებელია: ჭიანჭველამ საკვები ბუდემდე უნდა მიიტანოს.",
          "დახურული სატყუარა-კონტეინერი ჭიანჭველას არ იჭერს: ჭიანჭველა შიგნით შედის, იკვებება და საკვები ბუდეში მიაქვს. კონტეინერი სატყუარასთან პირდაპირ შეხებას ამცირებს, მაგრამ მას სრულიად უსაფრთხოს არ ხდის.",
          "სატყუარა ყველა სახეობაზე ერთნაირად არ მოქმედებს. ჭიანჭველები სხვადასხვა საკვებს ანიჭებენ უპირატესობას, ზოგი ტკბილს, ზოგი ცილოვანს ან ცხიმიანს, და UC IPM-ის მიხედვით, სატყუარა, რომელიც არსებულ სახეობას არ იზიდავს, შედეგს არ იძლევა. UC IPM ასევე ურჩევს, სატყუარა შეძლებისდაგვარად გარეთ, ბილიკთან ან შემოსასვლელთან დაიდოს, სახლის შიგნით კი მხოლოდ მაშინ, როცა პრობლემა სერიოზულია და შემოსასვლელს ვერ პოულობთ, რადგან შიგნით დადებულმა სატყუარამ შეიძლება ჭიანჭველები სახლში შემოიტყუოს.",
          "თუ სატყუარას იყენებთ:",
        ],
      },
      {
        heading: "რატომ ბრუნდებიან ჭიანჭველები და როდის გვჭირდება სპეციალისტი?",
        list: {
          items: [
            "აქტივობა გრძელდება, მიუხედავად იმისა, რომ საკვები, ტენი და შემოსასვლელები მოგვარებულია და პროდუქტის ეტიკეტი დაცულია.",
            "ფიქრობთ, რომ ბუდე მიუწვდომელ ადგილასაა, მაგალითად, კედელში ან იატაკის ქვეშ.",
            "პრობლემა რამდენიმე ოთახს ან მეზობელ ბინებს მოიცავს.",
            "ფრთიანი ჭიანჭველები შიგნიდან განმეორებით გამოდიან.",
            "აქტივობას ნესტიან ან დაზიანებულ ხის კონსტრუქციასთან ხედავთ.",
          ],
        },
        paragraphs: [
          "ჭიანჭველები ხშირად იმიტომ ბრუნდებიან, რომ საკვები ან ტენი ისევ ხელმისაწვდომია (ნაგავი, ცხოველის ჯამი, ჟონვა ნიჟარის ქვეშ), შემოსასვლელი სხვაგანაა ან რამდენიმეა, ან ბუდე მიუწვდომელ ადგილას, მაგალითად, კედლის ღრუშია. სატყუარის შემთხვევაში ხშირი მიზეზია ისიც, რომ ის ამ სახეობას არ იზიდავს ან მის ირგვლივ სპრეი ან სარეცხი საშუალება გამოიყენეს. ეს დაკვირვებებია და არა დიაგნოზი: ზუსტ მიზეზს ხშირად მხოლოდ სახეობის დადგენა და ადგილზე შემოწმება აჩვენებს.",
          "ერთი გამონაკლისი განსაკუთრებით მნიშვნელოვანია. მინესოტას უნივერსიტეტის მიხედვით, ფარაონის ჭიანჭველაზე (Monomorium pharaonis) ინსექტიციდის გამოყენებამ შეიძლება კოლონია დაყოს და ახალი კოლონიები წარმოქმნას; მისი მოშორება რთულია და გამოცდილი სპეციალისტის ჩართვა რეკომენდებულია. ეს ყველა ჭიანჭველასა და ყველა საშუალებაზე არ ვრცელდება, ფარაონის ჭიანჭველას კი მხოლოდ პატარა ზომითა და ფერით ვერ ამოიცნობთ. ამიტომ, თუ პატარა ჭიანჭველები მრავლად და მუდმივად ჩნდებიან სახლის სხვადასხვა ნაწილში, სპრეის გამოყენებამდე სახეობა ჯერ სპეციალისტმა დაადგინოს.",
          "მრავალბინიან სახლში, თუ ჭიანჭველები რამდენიმე ბინაში ან საერთო სივრცეში ჩნდებიან, საკითხი მეზობლებს ან შენობის მმართველს, მაგალითად, ბინათმესაკუთრეთა ამხანაგობას, გაუზიარეთ: ჭიანჭველების ბილიკი შეიძლება ერთი ბინის საზღვრებს სცდებოდეს.",
          "კენტუკის უნივერსიტეტის მიხედვით, სპეციალისტებს ჭიანჭველებთან მეტი გამოცდილება და უფრო ფართო საშუალებები აქვთ. მიმართეთ მავნებლების მართვის (დეზინსექციის) გამოცდილ სპეციალისტს და სთხოვეთ, აგიხსნათ, რომელ სახეობასთან აქვს საქმე, რას გამოიყენებს და სად. ეს განსაკუთრებით გონივრულია, თუ:",
        ],
      },
      {
        heading: "პატარა, შავი, წითელი თუ ფრთიანი: რას გვეუბნება გარეგნობა?",
        paragraphs: [
          "ფერი და ზომა ჭიანჭველის სახეობის დასადგენად არ კმარა. მინესოტას უნივერსიტეტის საკონსულტაციო სამსახური (UMN Extension) აღნიშნავს, რომ ჭიანჭველის ამოცნობა ფოტოთიც კი ხშირად რთულია, სხვადასხვა სახეობას კი შეიძლება განსხვავებული მიდგომა სჭირდებოდეს. ამიტომ „შავი“, „წითელი“ თუ „პატარა“ აღწერაა და არა სახეობის სახელი: შავი ჭიანჭველა ავტომატურად ერთი კონკრეტული სახეობა არ არის, პატარა მოწითალო ჭიანჭველა ავტომატურად ფარაონის ჭიანჭველა არ არის, წითელი კი ავტომატურად საშიში არ არის.",
          "გარეგნობაზე მეტს ხშირად ქცევა გეტყვით: სად ჩნდებიან, რისკენ მიდიან და ბრუნდებიან თუ არა ერთსა და იმავე ადგილას. თუ სპეციალისტს მიმართავთ, ეს დაკვირვებები გამოადგება.",
          "ფრთიანი ჭიანჭველები კოლონიის გამრავლებისუნარიანი მდედრები და მამრები არიან, ამიტომ ყველა ფრთიანი ჭიანჭველა დედოფალი არ არის. ერთი-ორი ფრთიანი ჭიანჭველა შეიძლება გარედან, ღია ფანჯრიდან ან კარიდან შემოფრენილი იყოს. თუ ისინი ოთახში განმეორებით და ბევრნი ჩნდებიან, მინესოტას უნივერსიტეტის მიხედვით, ეს შენობის შიგნით ბუდის ნიშანია.",
          "ფრთიან ჭიანჭველას ზოგჯერ ფრთიან ტერმიტში ერევათ. ჭიანჭველას ვიწრო, გამოკვეთილი „წელი“ და მუხლივით მოხრილი ულვაშები (ანტენები) აქვს, ფრთიან ჭიანჭველას კი უკანა ფრთები წინაზე მოკლე აქვს. თუ მწერი ამ ნიშნებს არ ემთხვევა, ამოცნობა სპეციალისტს მიანდეთ.",
          "ზოგი მსხვილი ჭიანჭველა, მაგალითად, Camponotus-ის გვარის სახეობები (ინგლისურად carpenter ants), ნესტიან ან დამპალ ხეში ბუდობს და მასში გალერეებს თხრის, თუმცა ხეს არ ჭამს. თუ ჭიანჭველებს განმეორებით ხედავთ დასველებულ ხის კონსტრუქციასთან, მოაგვარეთ ტენის წყარო და შეფასება სპეციალისტს სთხოვეთ.",
        ],
      },
      {
        heading: "ძმარი, სოდა და სხვა ხალხური საშუალებები: რას უნდა ველოდოთ?",
        list: {
          items: [
            "საპნიანი წყალი ან რბილი სარეცხი საშუალება. გამოდგება ბილიკისა და სუნის კვალის წასაშლელად და ხილული ჭიანჭველების დროებით მოსაშორებლად. შეზღუდვა: ბუდეს ვერ მოაგვარებს და სატყუარის ირგვლივ არ გამოიყენება.",
            "წყლით განზავებული ძმარი. მინესოტას უნივერსიტეტის მიხედვით, მისით ბილიკის გაწმენდა ჭიანჭველების აქტივობას დროებით არღვევს. შეზღუდვა: ეფექტი დროებითია და კოლონიას ვერ ანადგურებს.",
            "სოდა, მარილი, დარიჩინი, ეთერზეთები და მსგავსი. მათ ხშირად „ბარიერად“ ან „შხამად“ წარმოაჩენენ. შეზღუდვა: წყაროები, რომლებსაც ეს გიდი ეყრდნობა, არ იძლევა საფუძველს, რომ ისინი კოლონიის საიმედო კონტროლის საშუალებად გირჩიოთ. ეს არ ნიშნავს, რომ რაიმე ეფექტი დამტკიცებულად შეუძლებელია.",
            "სახლში დამზადებული ბორის მჟავას ან ბორაქსის ნარევი საკვებთან. შეზღუდვა: ეს თვითნაკეთი პესტიციდია ეტიკეტის, დოზირებისა და უსაფრთხოების გაფრთხილებების გარეშე, ტკბილი ნარევი კი შინაურ ცხოველებსაც იზიდავს. ქარხნული სატყუარა, რომელიც შეიძლება ბორის ნაერთებს შეიცავდეს, სხვა რამეა: მას ეტიკეტი და გამოყენების წესები აქვს, და თვითნაკეთი ნარევი მისი ტოლფასი არ არის.",
          ],
        },
        paragraphs: [
          "ხალხური რჩევები ხშირად ორ სხვადასხვა რამეს ურევს ერთმანეთში: ზედაპირის ჩვეულებრივ გაწმენდასა და სახლში დამზადებულ შხამს. პირველი სასარგებლო ნაბიჯია, მეორე კი ფაქტობრივად თვითნაკეთი პესტიციდია.",
          "„ბუნებრივი“ ან „სახლში დამზადებული“ ავტომატურად უსაფრთხოს არ ნიშნავს. აშშ-ის პესტიციდების ეროვნული საინფორმაციო ცენტრის (NPIC) მიხედვით, სახლის რეცეპტები ხშირად გამოცდილი არ არის, არ მიუთითებს, რამდენი, სად და რა სიხშირით გამოიყენოთ, და უსაფრთხოების გაფრთხილებებს არ შეიცავს; ზედმეტი რაოდენობით დაბალი ტოქსიკურობის ნივთიერებაც შეიძლება საზიანო იყოს. ქვემოთ თითოეული საშუალებისთვის: რისთვის შეიძლება გამოდგეს და რა არის მთავარი შეზღუდვა.",
        ],
      },
      {
        heading: "როგორ გამოვიყენოთ საშუალებები უსაფრთხოდ?",
        list: {
          items: [
            "გამოიყენეთ მხოლოდ ის პროდუქტი, რომლის ეტიკეტზეც ჭიანჭველები და გამოყენების ადგილია მითითებული. გარე გამოყენებისთვის განკუთვნილი საშუალება სახლში ნუ გამოიყენებთ: EPA-ის მიხედვით, შენობაში ის უფრო დიდხანს რჩება ტოქსიკური.",
            "ნუ გადააჭარბებთ ეტიკეტზე მითითებულ რაოდენობას. EPA-ის მიხედვით, ზედმეტი პესტიციდი ოჯახის ჯანმრთელობას საფრთხეს უქმნის.",
            "უპირატესობა მიანიჭეთ მზა პროდუქტს, რომელსაც შერევა არ სჭირდება, და ნუ შეურევთ ერთმანეთს საყოფაცხოვრებო ქიმიურ საშუალებებს.",
            "ნუ შეასხურებთ მთელ ოთახს. სატყუარისა და ხაფანგის გარდა, პესტიციდი მხოლოდ მიზნობრივად, კონკრეტულ ადგილას გამოიყენება.",
            "სატყუარა და სხვა საშუალება ბავშვებისა და შინაური ცხოველებისთვის მიუწვდომელ ადგილას განათავსეთ. დახურული კონტეინერი რისკს ამცირებს, მაგრამ სატყუარას სრულიად უვნებელს არ ხდის.",
            "საკვები, ჭურჭელი და საკვებთან შეხებაში მყოფი ზედაპირები ისე დაიცავით, როგორც ეტიკეტი მიუთითებს.",
            "პესტიციდი ორიგინალ შეფუთვაში, ბავშვებისთვის მიუწვდომელ ადგილას შეინახეთ. ცარიელი ტარა სხვა რამის, მით უმეტეს საკვებისა და სასმელის, შესანახად ნუ გამოიყენებთ.",
          ],
        },
        paragraphs: [
          "ჭიანჭველების გამოჩენა სახლში, როგორც წესი, გადაუდებელ საფრთხეს არ ნიშნავს, თუმცა ზოგ სახეობას კბენა ან ნესტრვა შეუძლია, ქიმიური საშუალების არასწორი გამოყენება კი დამატებით რისკს ქმნის. აშშ-ის გარემოს დაცვის სააგენტო (EPA) ქიმიურ საშუალებამდე პრევენციას გირჩევთ: საკვების, წყლისა და თავშესაფრის მოშორებას.",
          "თუ ჭიანჭველამ გიკბინათ ან გინესტრათ, ბრიტანეთის ჯანდაცვის სამსახურის (NHS) მიხედვით, ეს, როგორც წესი, სერიოზული არ არის: შეიძლება იყოს ტკივილი, ქავილი ან შეშუპება, რაც რამდენიმე საათში ან დღეში გადის. დაუყოვნებლივ დარეკეთ 112-ზე, თუ უეცრად შეშუპდა ტუჩები, პირი, ყელი ან ენა, სუნთქვა ან ყლაპვა გაძნელდა, კანი ან ტუჩები გალურჯდა, გაინაცრისფრდა ან გაფითრდა, ან ადამიანი უეცრად ძალიან დაიბნა, ძილიანობა ან თავბრუსხვევა დაეწყო. თავად ჭიანჭველების დანახვა 112-ზე დარეკვის მიზეზი არ არის: 112-ზე დარეკვა მაშინაა საჭირო, როცა გადაუდებელი სამსახურების დაუყოვნებლივ მოსვლა სასიცოცხლოდ აუცილებელია.",
          "თუ ქიმიურ საშუალებას იყენებთ:",
        ],
      },
      {
        heading: "როგორ ავიცილოთ თავიდან ჭიანჭველების დაბრუნება?",
        image: "sealing",
        list: {
          items: [
            "ტკბილი სითხე და ნამცეცი მაშინვე აიღეთ, ღია საკვები კი დახურულ ჭურჭელში შეინახეთ.",
            "ნაგვის ურნას მჭიდრო სახურავი ჰქონდეს; შინაური ცხოველის ჯამის ირგვლივ სისუფთავე შეინარჩუნეთ.",
            "ჟონვა დროულად შეაკეთეთ და დანესტიანებული ხე შეცვალეთ.",
            "ხელმისაწვდომი ნაპრალები პლინტუსთან, ჩარჩოებთან და მილების გასასვლელებთან ჰერმეტიკით დახურეთ; ეს სხვა მწერების, მაგალითად, [ფაროსანას](/insects/farosana-sakhlshi) შემოსვლასაც აფერხებს. სავენტილაციო და სადრენაჟო ღიობები არ დახშოთ, ელექტროგაყვანილობასა და როზეტებთან კი თავად ნუ იმუშავებთ.",
            "სახლის გარეთ მცენარეები და ტოტები ისე გაკრიჭეთ, რომ კედელს ან სახურავს არ ეხებოდეს: ჭიანჭველები მათ ხიდად იყენებენ.",
          ],
        },
        paragraphs: [
          "UC IPM-ის მიხედვით, მთავარი მიდგომაა, ჭიანჭველებს შენობაში შემოსვლა გაურთულოთ და საკვებისა და წყლის წყაროები მოაშოროთ. როცა ჭიანჭველები წავლენ, მათ დაბრუნებას რამდენიმე ყოველდღიური ჩვევა აფერხებს:",
        ],
      },
    ],
    summary:
      "ჭიანჭველები სახლში, როგორც წესი, საკვებისა და წყლის საძებნელად შემოდიან. ჯერ ნახეთ, საიდან მოდიან, მოაშორეთ საკვები და ტენი, ბილიკი საპნიანი წყლით გაწმინდეთ და დახურეთ ღრიჭოები, რომლებსაც მიწვდებით. ხილული ჭიანჭველების მოცილება ბუდეს ვერ აგვარებს: თუ ისინი ბრუნდებიან, გამოიყენეთ ეტიკეტით შესაბამისი სატყუარა, მის ირგვლივ სპრეისა და საწმენდის გარეშე, ან მიმართეთ სპეციალისტს. ჭიანჭველების დანახვა 112-ზე დარეკვის მიზეზი არ არის; დარეკეთ, თუ ნაკბენს მძიმე ალერგიული რეაქციის ნიშნები მოჰყვა.",
    title: "ჭიანჭველები სახლში - როგორ მოვიშოროთ და ავიცილოთ თავიდან",
  },
  ru: {
    description:
      "Муравьи в доме? Узнайте, как найти, откуда они заходят, убрать еду и влагу, безопасно использовать приманку и когда обращаться к специалисту.",
    faq: [
      {
        answer:
          "Не обязательно. Несколько рабочих муравьёв часто заходят снаружи в поисках еды. Гнездо внутри вероятнее, если после того как еда убрана и вход заделан, они каждый день появляются в одном и том же месте или если в комнате снова и снова появляются крылатые муравьи.",
        question: "Если я увидел всего несколько муравьёв, гнездо в доме?",
      },
      {
        answer:
          "В ванной много влаги, а муравьи ищут не только еду, но и воду; некоторые виды гнездятся и в отсыревшей древесине. Просушите мокрые места, устраните протечки и заделайте доступные щели вокруг вводов труб. Не закрывайте вентиляционные и дренажные отверстия.",
        question: "Почему муравьи появляются в ванной?",
      },
      {
        answer:
          "Часто да, особенно если муравьи приходят снаружи. По данным UC IPM, сначала нужно убрать еду и воду и заделать входы, а вторжение из-за погоды, если муравьи не находят еды, иногда прекращается за несколько дней или неделю. Если гнездо в доме или в недоступном месте, этого может не хватить.",
        question: "Можно ли избавиться от муравьёв без химии?",
      },
      {
        answer:
          "Уборка дорожки убирает видимых муравьёв сразу, но временно. С приманкой активность часто снижается за несколько дней, а полный результат может занять несколько недель или больше в зависимости от вида и средства. Если при соблюдении инструкции на этикетке активность не снижается, обратитесь к специалисту.",
        question: "Через какое время должен быть результат?",
      },
    ],
    metaTitle: "Муравьи в доме: как от них избавиться?",
    sections: [
      {
        heading: "Как избавиться от муравьёв в доме?",
        image: "cleaning",
        list: {
          items: [
            "Сначала понаблюдайте, потом убирайте. Несколько минут проследите за муравьиной дорожкой: откуда муравьи заходят и куда направляются. После уборки это выяснить гораздо сложнее.",
            "Проверьте доступные места: шкаф с продуктами, пространство вокруг раковины, плинтусы, дверные и оконные рамы и места, где трубы проходят через стену. Не вскрывайте электроприборы и не разбирайте стены: если дорожка уходит в недоступное место, это тоже полезная информация для специалиста.",
            "Уберите еду. Соберите крошки и пролитые жидкости, особенно сладкие. Храните продукты в плотно закрытых стеклянных или твёрдых пластиковых контейнерах, а не в картонных коробках или бумажной упаковке; у мусорного ведра должна быть плотная крышка. Корм для питомца тоже храните закрытым и следите за чистотой вокруг миски; питьевая вода у животного должна быть всегда.",
            "Устраните влагу. Почините капающий кран и протекающие трубы, просушите постоянно мокрые места под раковиной или в ванной и не оставляйте стоячую воду.",
            "Уберите дорожку. Протрите поверхность, по которой ходили муравьи, особенно у входа, мыльной водой или обычным мягким моющим средством; муравьёв можно собрать и пылесосом. Это временно убирает видимых муравьёв и их пахучий след, но не решает проблему гнезда. Если вы уже используете приманку, не стирайте дорожку вокруг неё (см. ниже).",
            "Выберите следующий шаг. Если муравьи заходят через доступную щель, заделайте её герметиком. Если муравьи возвращаются и после того, как еда убрана и поверхности очищены, или вы не можете найти вход, рассмотрите приманку или помощь специалиста. Если вы используете приманку, заранее решите, когда заделывать щель, через которую муравьи приходят к ней: именно этим путём они несут приманку в гнездо. Следуйте этикетке или указаниям специалиста.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Сначала выясните, откуда муравьи заходят и куда направляются. Затем уберите доступную еду и влагу, очистите поверхности и заделайте щели, до которых можете добраться. Если муравьи всё равно возвращаются, следующим шагом станет целевое средство, например приманка, или совет специалиста.",
          "Муравьи, которых вы видите в комнате, обычно лишь малая часть колонии (муравьиной семьи, живущей в одном гнезде): еду ищут рабочие муравьи, а гнездо и откладывающая яйца матка, или несколько маток, остаются в другом месте. Поэтому, убрав видимых муравьёв, вы ещё не решили проблему.",
        ],
      },
      {
        heading: "Почему муравьи появляются в доме?",
        image: "gap",
        paragraphs: [
          "Муравьи заходят в здания в основном в поисках еды и воды, иногда в поисках укрытия. По данным Программы интегрированной защиты от вредителей Калифорнийского университета (UC IPM), их внезапное появление часто следует за сменой погоды, например жарой, засухой или сильным дождём, или за сокращением пищи снаружи.",
          "Найдя еду, рабочий муравей оставляет по пути к гнезду пахучий след (феромон), и другие муравьи идут по нему. Поэтому муравьи часто движутся цепочкой по одному и тому же маршруту.",
          "Муравьи в доме не означают, что в доме грязно, и не означают, что гнездо обязательно внутри. Часто они заходят снаружи: через щели, вокруг дверей и окон или через вводы труб. Но некоторые виды гнездятся и в здании: за плинтусами и обшивкой, под кухонной столешницей, в полостях стен или в отсыревшей древесине.",
          "Если муравьи каждый день появляются в одном и том же месте, хотя еда убрана, а известный вход заделан, стоит выяснить, нет ли гнезда в доме или в стене.",
        ],
      },
      {
        heading: "Приманка или спрей: в чём разница?",
        image: "bait",
        list: {
          items: [
            "Выберите средство, на этикетке которого указаны муравьи и место применения, например жилые помещения. Правила размещения, замены и безопасности задаёт этикетка.",
            "Размещайте приманку рядом с муравьиной дорожкой, там, где муравьи действительно ходят, а не где попало.",
            "Не используйте спреи и моющие средства вокруг приманки и на ведущей к ней дорожке: это отпугивает муравьёв от приманки. Обычная уборка кухни в остальных местах продолжается.",
            "Размещайте её в недоступном для детей и домашних животных месте, не рядом с едой и не на поверхностях для приготовления пищи. Приманка содержит пищевые компоненты и привлекает многих животных.",
            "В течение первых суток проверьте, едят ли её муравьи. Если они её игнорируют, уберите приманку и попробуйте другое средство, подходящее по этикетке, или обратитесь к специалисту. Не превышайте указанное на этикетке количество.",
            "Результату нужно время. В первые дни больше муравьёв у приманки может означать, что они едят её и несут в гнездо; само по себе это не признак неудачи и не гарантия успеха. По данным Университета Кентукки, активность часто снижается за несколько дней, а по данным UC IPM и Университета Миннесоты полный результат может занять несколько недель или больше. Срок зависит от вида, средства, размера колонии и того, насколько охотно муравьи берут приманку.",
          ],
        },
        paragraphs: [
          "Спрей убивает только тех муравьёв, на которых попадает напрямую. По данным кафедры энтомологии Университета Кентукки, муравьи на открытых поверхностях составляют лишь малую часть колонии, поэтому опрыскивание только видимых муравьёв обычно не помогает. UC IPM отмечает, что внутри дома спреи обычно не нужны и дают лишь временный эффект.",
          "Приманка действует иначе: она сочетает привлекательную для муравьёв пищу и медленно действующий инсектицид. Рабочие муравьи несут пищу в гнездо и делятся ею с другими, в том числе с маткой. Медленное действие обязательно: муравей должен успеть донести пищу до гнезда.",
          "Закрытая приманочная станция муравьёв не ловит: муравей заходит внутрь, питается и уносит пищу в гнездо. Станция уменьшает прямой контакт с приманкой, но не делает её полностью безопасной.",
          "Приманка действует не на все виды одинаково. Муравьи предпочитают разную пищу: одни сладкую, другие белковую или жирную, и, по данным UC IPM, приманка, которая не привлекает имеющийся вид, результата не даёт. UC IPM также советует по возможности размещать приманку снаружи, у дорожки или входа, а в доме только тогда, когда проблема серьёзная и вход найти не удаётся, потому что приманка внутри может заманить муравьёв в дом.",
          "Если вы используете приманку:",
        ],
      },
      {
        heading: "Почему муравьи возвращаются и когда нужен специалист?",
        list: {
          items: [
            "Активность продолжается, хотя еда, влага и входы уже под контролем, а инструкция на этикетке соблюдена.",
            "Вы подозреваете, что гнездо в недоступном месте, например в стене или под полом.",
            "Проблема охватывает несколько комнат или соседние квартиры.",
            "Крылатые муравьи снова и снова появляются изнутри.",
            "Вы видите активность у сырых или повреждённых деревянных конструкций.",
          ],
        },
        paragraphs: [
          "Муравьи часто возвращаются потому, что еда или влага по-прежнему доступны (мусор, миска питомца, протечка под раковиной), вход находится в другом месте или их несколько, либо гнездо в недоступном месте, например в полости стены. Если используется приманка, частая причина в том, что она не привлекает этот вид или вокруг неё применяли спрей или моющее средство. Это наблюдения, а не диагноз: точную причину часто показывают только определение вида и осмотр на месте.",
          "Одно исключение особенно важно. По данным Университета Миннесоты, применение инсектицида против фараонова муравья (Monomorium pharaonis) может привести к делению колонии и появлению новых колоний; избавиться от него сложно, и рекомендуется опытный специалист. Это относится не ко всем муравьям и не ко всем средствам, а фараонова муравья нельзя узнать только по маленькому размеру и цвету. Поэтому, если мелкие муравьи постоянно и в большом количестве появляются в разных частях дома, прежде чем браться за спрей, пусть вид определит специалист.",
          "В многоквартирном доме, если муравьи появляются в нескольких квартирах или в общих помещениях, сообщите об этом соседям или управляющему зданием, например товариществу собственников жилья: муравьиная дорожка может выходить за пределы одной квартиры.",
          "По данным Университета Кентукки, у специалистов больше опыта борьбы с муравьями и шире выбор средств. Обратитесь к опытному специалисту по борьбе с вредителями (дезинсекции) и попросите объяснить, с каким видом он имеет дело, что и где будет применять. Это особенно разумно, если:",
        ],
      },
      {
        heading: "Мелкие, чёрные, рыжие или крылатые: что говорит внешний вид?",
        paragraphs: [
          "Цвета и размера недостаточно, чтобы определить вид муравья. Служба распространения знаний Университета Миннесоты (UMN Extension) отмечает, что муравья часто сложно определить даже по фотографии, а разным видам может требоваться разный подход. Поэтому «чёрный», «рыжий» или «мелкий» описывает муравья, но не называет вид: чёрный муравей не обязательно какой-то один вид, мелкий рыжеватый муравей не обязательно фараонов муравей, а рыжий не обязательно опасен.",
          "Поведение часто говорит больше, чем внешний вид: где муравьи появляются, куда направляются и возвращаются ли на одно и то же место. Если вы обратитесь к специалисту, эти наблюдения пригодятся.",
          "Крылатые муравьи представляют собой способных к размножению самок и самцов колонии, поэтому не каждый крылатый муравей является маткой. Один-два крылатых муравья могли залететь снаружи через открытое окно или дверь. Если же они снова и снова и во множестве появляются в комнате, по данным Университета Миннесоты, это признак гнезда внутри здания.",
          "Крылатого муравья иногда путают с крылатым термитом. У муравья узкая, выраженная «талия» и коленчато изогнутые усики (антенны), а у крылатых особей задние крылья короче передних. Если насекомое не соответствует этим признакам, доверьте определение специалисту.",
          "Некоторые крупные муравьи, например виды рода Camponotus (муравьи-древоточцы), гнездятся в сырой или гнилой древесине и прокладывают в ней ходы, но древесину не едят. Если вы постоянно видите муравьёв у намокшей деревянной конструкции, устраните источник влаги и попросите специалиста оценить ситуацию.",
        ],
      },
      {
        heading: "Уксус, сода и другие народные средства: чего ожидать?",
        list: {
          items: [
            "Мыльная вода или мягкое моющее средство. Подходит, чтобы стереть дорожку и пахучий след и временно убрать видимых муравьёв. Ограничение: не решает проблему гнезда и не применяется вокруг приманки.",
            "Уксус, разведённый водой. По данным Университета Миннесоты, протирание им дорожки временно нарушает активность муравьёв. Ограничение: эффект временный, колонию он не уничтожает.",
            "Сода, соль, корица, эфирные масла и подобное. Их часто подают как «барьер» или «яд». Ограничение: источники, на которые опирается этот гид, не дают оснований рекомендовать их как надёжный способ контроля колонии. Это не значит, что какой-либо эффект доказанно невозможен.",
            "Домашняя смесь борной кислоты или буры с едой. Ограничение: это самодельный пестицид без этикетки, дозировки и предупреждений о безопасности, а сладкая смесь привлекает и домашних животных. Заводская приманка, которая может содержать соединения бора, устроена иначе: у неё есть этикетка и правила применения, и самодельная смесь ей не равноценна.",
          ],
        },
        paragraphs: [
          "Народные советы часто смешивают две разные вещи: обычную уборку поверхностей и самодельный яд. Первое полезно, а второе по сути является самодельным пестицидом.",
          "«Натуральное» или «домашнее» не означает автоматически безопасное. По данным Национального информационного центра по пестицидам США (NPIC), домашние рецепты часто не проверены, не указывают, сколько, где и как часто применять, и не содержат предупреждений о безопасности; даже вещество низкой токсичности в избытке может навредить. Ниже для каждого средства: для чего оно может пригодиться и в чём главное ограничение.",
        ],
      },
      {
        heading: "Как безопасно использовать средства?",
        list: {
          items: [
            "Используйте только средство, на этикетке которого указаны муравьи и место применения. Не применяйте в доме средства для наружного использования: по данным EPA, в помещении они дольше остаются токсичными.",
            "Не превышайте количество, указанное на этикетке. По данным EPA, избыток пестицида угрожает здоровью семьи.",
            "Отдавайте предпочтение готовым средствам, которые не нужно смешивать, и не смешивайте бытовую химию между собой.",
            "Не опрыскивайте всю комнату. Кроме приманок и ловушек, пестицид применяют только точечно, в конкретном месте.",
            "Размещайте приманки и другие средства в недоступном для детей и домашних животных месте. Закрытая станция снижает риск, но не делает приманку полностью безвредной.",
            "Защищайте продукты, посуду и поверхности, контактирующие с пищей, так, как указано на этикетке.",
            "Храните пестициды в оригинальной упаковке, в недоступном для детей месте. Никогда не используйте пустую тару для хранения чего-либо ещё, тем более еды и напитков.",
          ],
        },
        paragraphs: [
          "Муравьи в доме обычно не означают экстренной угрозы, хотя некоторые виды могут кусать или жалить, а неправильное применение химических средств создаёт дополнительный риск. Агентство по охране окружающей среды США (EPA) советует начинать с профилактики, а не с химии: убрать источники еды, воды и укрытия.",
          "Если муравей укусил или ужалил, по данным NHS (Национальной службы здравоохранения Великобритании), это обычно не опасно: возможны боль, зуд или отёк, которые проходят за несколько часов или дней. Немедленно звоните 112, если внезапно отекли губы, рот, горло или язык, стало трудно дышать или глотать, кожа или губы посинели, посерели или побледнели, или человек внезапно сильно растерян, сонлив или у него кружится голова. Сами по себе муравьи в доме не являются поводом звонить 112: звонить нужно тогда, когда немедленный приезд экстренных служб жизненно необходим.",
          "Если вы используете химическое средство:",
        ],
      },
      {
        heading: "Как не допустить возвращения муравьёв?",
        image: "sealing",
        list: {
          items: [
            "Сразу вытирайте сладкие пролитые жидкости и крошки, а открытые продукты храните в закрытых контейнерах.",
            "Мусорное ведро должно быть с плотной крышкой; поддерживайте чистоту вокруг миски питомца.",
            "Своевременно устраняйте протечки и заменяйте отсыревшую древесину.",
            "Заделайте герметиком доступные щели у плинтусов, рам и вводов труб; это мешает проникновению и других насекомых, например [мраморного клопа](/insects/farosana-sakhlshi). Не закрывайте вентиляционные и дренажные отверстия и не работайте с проводкой и розетками самостоятельно.",
            "Снаружи подрежьте растения и ветки так, чтобы они не касались стен и крыши: муравьи используют их как мостики.",
          ],
        },
        paragraphs: [
          "По данным UC IPM, главное: не пускать муравьёв в здание и убирать источники еды и воды. Когда муравьи уйдут, их возвращению мешают несколько повседневных привычек:",
        ],
      },
    ],
    summary:
      "Муравьи обычно заходят в дом в поисках еды и воды. Сначала посмотрите, откуда они идут, уберите еду и влагу, очистите дорожку мыльной водой и заделайте доступные щели. Удаление видимых муравьёв не решает проблему гнезда: если они возвращаются, используйте приманку, подходящую по этикетке, без спреев и моющих средств вокруг неё, или обратитесь к специалисту. Сами муравьи не являются поводом звонить 112; звоните, если после укуса появились признаки тяжёлой аллергической реакции.",
    title: "Муравьи в доме: как избавиться и не допустить их возвращения",
  },
  tr: {
    description:
      "Evde karınca mı var? Nereden girdiklerini bulmayı, yiyecek ve nemi kaldırmayı, yemi güvenle kullanmayı ve ne zaman uzmana başvurmanız gerektiğini öğrenin.",
    faq: [
      {
        answer:
          "Şart değil. Birkaç işçi karınca çoğu zaman yiyecek aramak için dışarıdan gelir. Yiyecek kaldırılıp giriş yeri kapatıldıktan sonra da her gün aynı yerde görünüyorlarsa veya odada tekrar tekrar kanatlı karıncalar çıkıyorsa yuvanın içeride olması daha olasıdır.",
        question: "Sadece birkaç karınca gördüysem yuva evin içinde mi?",
      },
      {
        answer:
          "Banyo bir nem kaynağıdır; karıncalar yiyeceğin yanı sıra su da arar ve bazı türler nemden zarar görmüş ahşapta yuva yapar. Islak yerleri kurutun, sızıntıları giderin ve boru geçişleri çevresindeki erişilebilir aralıkları kapatın. Havalandırma ve gider açıklıklarını kapatmayın.",
        question: "Karıncalar neden banyoda görünür?",
      },
      {
        answer:
          "Çoğu zaman evet, özellikle karıncalar dışarıdan geliyorsa. UC IPM'e göre ilk adım yiyecek ve suyu kaldırmak ve giriş yerlerini kapatmaktır; hava koşullarından kaynaklanan bir istila, karıncalar yiyecek bulamazsa bazen birkaç gün ile bir hafta içinde sona erer. Yuva evin içindeyse veya erişilemiyorsa bu yeterli olmayabilir.",
        question: "Karıncalardan kimyasal kullanmadan kurtulmak mümkün mü?",
      },
      {
        answer:
          "Yolu temizlemek görünen karıncaları hemen ama geçici olarak uzaklaştırır. Yemle, aktivite çoğu zaman birkaç gün içinde azalır; tam sonuç ise türe ve ürüne bağlı olarak birkaç hafta veya daha uzun sürebilir. Etikete uyduğunuz hâlde aktivite azalmıyorsa bir uzmana başvurun.",
        question: "Sonuç ne kadar sürede görülmeli?",
      },
    ],
    metaTitle: "Evde karınca: karıncalardan nasıl kurtulunur?",
    sections: [
      {
        heading: "Evdeki karıncalardan nasıl kurtulunur?",
        image: "cleaning",
        list: {
          items: [
            "Silmeden önce gözlemleyin. Karınca yolunu birkaç dakika izleyin ve karıncaların nereden girip nereye gittiğine bakın. Yol temizlendikten sonra bunu anlamak çok daha zordur.",
            "Ulaşabildiğiniz yerleri kontrol edin: yiyecek dolabı, lavabonun çevresi, süpürgelikler, kapı ve pencere çerçeveleri ve boruların duvardan geçtiği yerler. Elektrikli cihazları açmayın ve duvarları sökmeyin: yol ulaşılamayan bir yerde kayboluyorsa bu da uzman için yararlı bir bilgidir.",
            "Yiyeceği kaldırın. Kırıntıları ve dökülen sıvıları, özellikle tatlı olanları temizleyin. Yiyecekleri karton kutu veya kâğıt ambalaj yerine sıkıca kapanan cam ya da sert plastik kaplarda saklayın; çöp kovasının sıkı bir kapağı olsun. Evcil hayvan mamasını da kapalı saklayın ve kabın çevresini temiz tutun; hayvanın içme suyu her zaman olmalıdır.",
            "Nemi giderin. Damlayan musluğu ve sızdıran boruları onarın, lavabo altında veya banyoda sürekli ıslak kalan yerleri kurutun ve durgun su bırakmayın.",
            "Yolu temizleyin. Karıncaların yürüdüğü yüzeyi, özellikle giriş yerinin yakınını, sabunlu su veya sıradan hafif bir deterjanla silin; karıncaları elektrikli süpürgeyle de toplayabilirsiniz. Bu, görünen karıncaları ve koku izlerini bir süreliğine giderir ama yuva sorununu çözmez. Zaten yem kullanıyorsanız yemin çevresindeki yolu silmeyin (aşağıya bakın).",
            "Sonraki adımı seçin. Giriş yeri ulaşabildiğiniz bir aralıksa dolgu macunuyla kapatın. Yiyecek kaldırılıp yüzeyler temizlendikten sonra da karıncalar geri geliyorsa veya nereden girdiklerini bulamıyorsanız yemi ya da uzman yardımını düşünün. Yem kullanıyorsanız, karıncaların yeme ulaşmak için kullandığı aralığı ne zaman kapatacağınıza önceden karar verin: yemi yuvaya bu yoldan taşırlar. Etikete veya uzmanın talimatına uyun.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Önce karıncaların nereden girdiğini ve nereye gittiğini bulun. Ardından erişilebilir yiyecek ve nemi kaldırın, yüzeyleri temizleyin ve ulaşabildiğiniz aralıkları kapatın. Karıncalar yine de geri geliyorsa sonraki adım yem gibi hedefli bir yöntem veya bir uzmanın tavsiyesidir.",
          "Odada gördüğünüz karıncalar genellikle koloninin (tek bir yuvada yaşayan karınca ailesinin) küçük bir kısmıdır: yiyeceği işçi karıncalar arar, yuva ve yumurtlayan kraliçe ya da kraliçeler ise başka yerde kalır. Bu yüzden görünen karıncaları uzaklaştırmak, sorunun çözüldüğü anlamına gelmez.",
        ],
      },
      {
        heading: "Karıncalar neden eve girer?",
        image: "gap",
        paragraphs: [
          "Karıncalar binalara çoğunlukla yiyecek ve su aramak için, bazen de barınak için girer. Kaliforniya Üniversitesi Entegre Zararlı Yönetimi Programı'na (UC IPM) göre ani ortaya çıkışlar çoğu zaman sıcak, kuraklık veya şiddetli yağmur gibi bir hava değişikliğini ya da dışarıdaki yiyeceğin azalmasını izler.",
          "Bir işçi karınca yiyecek bulduğunda yuvaya kadar bir koku izi (feromon) bırakır ve diğerleri bu izi takip eder. Bu yüzden karıncalar çoğu zaman aynı yol üzerinde tek sıra hâlinde ilerler.",
          "Karınca görmek evin kirli olduğu anlamına gelmez; yuvanın mutlaka içeride olduğu anlamına da gelmez. Çoğu zaman dışarıdan girerler: aralıklardan, kapı ve pencere çevresinden veya boru geçişlerinden. Bazı türler ise binanın içinde de yuva yapar: süpürgelik ve kaplamaların arkasında, mutfak tezgâhının altında, duvar boşluklarında veya nemden zarar görmüş ahşapta.",
          "Yiyecek kaldırılmış ve bilinen giriş yeri kapatılmış olmasına rağmen karıncalar her gün aynı yerde görünüyorsa yuvanın evin veya duvarın içinde olup olmadığını araştırmaya değer.",
        ],
      },
      {
        heading: "Yem mi, sprey mi: fark nedir?",
        image: "bait",
        list: {
          items: [
            "Etiketinde karıncaların ve kullanmak istediğiniz yerin, örneğin yaşam alanlarının, yazdığı bir ürün seçin. Yerleştirme, değiştirme ve güvenlik kurallarını etiket belirler.",
            "Yemi karınca yolunun yanına, karıncaların gerçekten yürüdüğü yere koyun; rastgele bir yere değil.",
            "Yemin çevresinde ve ona giden yolda sprey veya temizlik ürünü kullanmayın: bunlar karıncaları yemden uzaklaştırır. Mutfağın geri kalanında olağan temizlik sürer.",
            "Yemi çocukların ve evcil hayvanların ulaşamayacağı bir yere koyun; yiyeceğin yanına veya yemek hazırlanan yüzeylere değil. Yem, gıda içerikleri barındırır ve birçok hayvanı çeker.",
            "İlk gün içinde karıncaların yemi yiyip yemediğini kontrol edin. Yemi görmezden geliyorlarsa kaldırın ve etiketi uygun başka bir ürün deneyin ya da bir uzmana başvurun. Etikette yazandan fazlasını kullanmayın.",
            "Sonuç zaman alır. İlk günlerde yemin çevresinde karıncaların artması, beslendiklerini ve yemi yuvaya taşıdıklarını gösterebilir; bu tek başına ne başarısızlık işaretidir ne de başarı garantisi. Kentucky Üniversitesi'ne göre aktivite çoğu zaman birkaç gün içinde azalır; UC IPM ve Minnesota Üniversitesi'ne göre ise tam sonuç birkaç hafta veya daha uzun sürebilir. Süre; türe, ürüne, koloninin büyüklüğüne ve yemin ne kadar kabul edildiğine bağlıdır.",
          ],
        },
        paragraphs: [
          "Sprey yalnızca doğrudan isabet ettiği karıncaları öldürür. Kentucky Üniversitesi Entomoloji Bölümü'ne göre açık yüzeylerde dolaşan karıncalar koloninin küçük bir kısmıdır; bu yüzden yalnızca görünenleri ilaçlamak genellikle işe yaramaz. UC IPM, ev içinde spreyin genellikle gerekli olmadığını ve yalnızca geçici etki sağladığını belirtir.",
          "Yem farklı çalışır: karıncaları çeken bir besini yavaş etkili bir insektisitle birleştirir. İşçi karıncalar besini yuvaya taşır ve kraliçe dâhil diğerleriyle paylaşır. Yavaş etki şarttır: karıncanın besini yuvaya ulaştırabilmesi gerekir.",
          "Kapalı yem istasyonu karıncaları yakalamaz: karınca içeri girer, beslenir ve besini yuvaya taşır. İstasyon yemle doğrudan teması azaltır ama onu tamamen güvenli yapmaz.",
          "Yem her türde aynı şekilde etki etmez. Karıncalar farklı besinleri tercih eder; bazıları tatlıyı, bazıları proteinli veya yağlı besini. UC IPM'e göre mevcut türü çekmeyen bir yem sonuç vermez. UC IPM ayrıca yemin mümkünse dışarıda, yolun veya giriş yerinin yanına konmasını; ev içinde ise yalnızca sorun ciddiyse ve giriş yeri bulunamıyorsa kullanılmasını önerir, çünkü içeri konan yem karıncaları eve çekebilir.",
          "Yem kullanıyorsanız:",
        ],
      },
      {
        heading: "Karıncalar neden geri gelir ve ne zaman uzman gerekir?",
        list: {
          items: [
            "Yiyecek, nem ve giriş yerleri ele alınmış ve ürün etiketine uyulmuş olmasına rağmen aktivite sürüyor.",
            "Yuvanın ulaşılamayan bir yerde, örneğin duvarda veya zeminin altında olduğundan şüpheleniyorsunuz.",
            "Sorun birkaç odayı veya komşu daireleri kapsıyor.",
            "Kanatlı karıncalar içeriden tekrar tekrar çıkıyor.",
            "Nemli veya hasarlı ahşap yapıların çevresinde aktivite görüyorsunuz.",
          ],
        },
        paragraphs: [
          "Karıncalar çoğu zaman yiyecek veya nem hâlâ erişilebilir olduğu için (çöp, evcil hayvan kabı, lavabo altındaki sızıntı), giriş yeri başka bir yerde olduğu ya da birden fazla olduğu için veya yuva, örneğin bir duvar boşluğu gibi ulaşılamayan bir yerde olduğu için geri gelir. Yem kullanılıyorsa sık görülen nedenler, yemin bu türü çekmemesi veya çevresinde sprey ya da temizlik ürünü kullanılmış olmasıdır. Bunlar gözlemdir, teşhis değildir: kesin nedeni çoğu zaman ancak türün belirlenmesi ve yerinde inceleme gösterir.",
          "Bir istisna özellikle önemlidir. Minnesota Üniversitesi'ne göre firavun karıncasına (Monomorium pharaonis) karşı insektisit kullanmak koloninin bölünmesine ve yeni koloniler oluşmasına yol açabilir; bu karıncadan kurtulmak zordur ve deneyimli bir uzman önerilir. Bu her karınca ve her ürün için geçerli değildir ve firavun karıncası yalnızca küçük boyutundan ve renginden tanınamaz. Bu yüzden küçük karıncalar evin farklı yerlerinde sürekli ve çok sayıda görünüyorsa, spreye başvurmadan önce türü bir uzmana belirletin.",
          "Apartmanda karıncalar birkaç dairede veya ortak alanlarda görünüyorsa durumu komşularınıza veya bina yönetimine bildirin: bir karınca yolu tek bir dairenin sınırlarını aşabilir.",
          "Kentucky Üniversitesi'ne göre uzmanların karıncalarla ilgili daha fazla deneyimi ve daha geniş bir araç yelpazesi vardır. Deneyimli bir zararlı yönetimi (haşere kontrolü) uzmanına başvurun ve hangi türle uğraştığını, ne kullanacağını ve nereye uygulayacağını açıklamasını isteyin. Bu özellikle şu durumlarda mantıklıdır:",
        ],
      },
      {
        heading: "Küçük, siyah, kırmızı veya kanatlı: görünüş ne söyler?",
        paragraphs: [
          "Renk ve boyut, bir karınca türünü belirlemek için yeterli değildir. Minnesota Üniversitesi Yayım Hizmeti (UMN Extension), karıncaları fotoğraftan bile tanımanın çoğu zaman zor olduğunu ve farklı türlerin farklı yaklaşım gerektirebileceğini belirtir. Bu yüzden “siyah”, “kırmızı” veya “küçük” bir tür adı değil, bir tanımdır: siyah karınca otomatik olarak belirli bir tür değildir, küçük kırmızımsı karınca otomatik olarak firavun karıncası değildir, kırmızı karınca da otomatik olarak tehlikeli değildir.",
          "Davranış çoğu zaman görünüşten fazlasını söyler: nerede göründükleri, nereye gittikleri ve aynı yere dönüp dönmedikleri. Bir uzmana başvurursanız bu gözlemler işe yarar.",
          "Kanatlı karıncalar koloninin üreyebilen dişileri ve erkekleridir; bu yüzden her kanatlı karınca kraliçe değildir. Bir iki kanatlı karınca açık bir pencere veya kapıdan dışarıdan uçarak gelmiş olabilir. Bir odada tekrar tekrar ve çok sayıda görünüyorlarsa, Minnesota Üniversitesi'ne göre bu, binanın içinde bir yuva olduğunun işaretidir.",
          "Kanatlı karınca bazen kanatlı termitle karıştırılır. Karıncanın dar, belirgin bir “beli” ve dirsek gibi kırık antenleri vardır; kanatlı olanlarda arka kanatlar ön kanatlardan kısadır. Böcek bu özelliklere uymuyorsa tanımlamayı bir uzmana bırakın.",
          "Bazı büyük karıncalar, örneğin Camponotus cinsinin türleri (marangoz karıncalar), nemli veya çürümüş ahşapta yuva yapar ve içinde galeriler açar ama ahşabı yemez. Islak bir ahşap yapının yanında sürekli karınca görüyorsanız nem kaynağını giderin ve durumu bir uzmana değerlendirtin.",
        ],
      },
      {
        heading: "Sirke, karbonat ve diğer ev çareleri: ne beklemeli?",
        list: {
          items: [
            "Sabunlu su veya hafif deterjan. Yolu ve koku izini silmek, görünen karıncaları bir süreliğine uzaklaştırmak için işe yarar. Sınırlama: yuva sorununu çözmez ve yemin çevresinde kullanılmaz.",
            "Suyla seyreltilmiş sirke. Minnesota Üniversitesi'ne göre yolu bununla silmek karınca aktivitesini geçici olarak bozar. Sınırlama: etki geçicidir ve koloniyi yok etmez.",
            "Karbonat, tuz, tarçın, uçucu yağlar ve benzerleri. Çoğu zaman “bariyer” veya “zehir” olarak sunulur. Sınırlama: bu rehberin dayandığı kaynaklar, bunları güvenilir bir koloni kontrol yöntemi olarak önermek için dayanak sunmaz. Bu, herhangi bir etkinin kanıtlanmış biçimde imkânsız olduğu anlamına gelmez.",
            "Evde yapılan borik asit veya boraks ile yiyecek karışımı. Sınırlama: bu, etiketi, dozajı ve güvenlik uyarıları olmayan ev yapımı bir pestisittir; tatlı karışım evcil hayvanları da çeker. Bor bileşikleri içerebilen fabrika yapımı yem ise başka bir şeydir: etiketi ve kullanım kuralları vardır ve ev yapımı karışım onun eşdeğeri değildir.",
          ],
        },
        paragraphs: [
          "Ev çareleri çoğu zaman iki farklı şeyi karıştırır: sıradan yüzey temizliğini ve evde hazırlanan zehri. Birincisi yararlı bir adımdır; ikincisi ise aslında ev yapımı bir pestisittir.",
          "“Doğal” veya “ev yapımı” otomatik olarak güvenli demek değildir. ABD Ulusal Pestisit Bilgi Merkezi'ne (NPIC) göre ev tarifleri çoğu zaman test edilmemiştir, ne kadar, nerede ve ne sıklıkla kullanılacağını söylemez ve güvenlik uyarısı içermez; düşük toksisiteli bir madde bile fazlası kullanılırsa zararlı olabilir. Aşağıda her yöntem için: neye yarayabileceği ve temel sınırlaması.",
        ],
      },
      {
        heading: "Ürünler güvenle nasıl kullanılır?",
        list: {
          items: [
            "Yalnızca etiketinde karıncaların ve kullanım yerinin yazdığı ürünü kullanın. Dış mekân için üretilmiş bir ürünü evin içinde kullanmayın: EPA'ya göre kapalı alanda daha uzun süre zehirli kalır.",
            "Etikette yazan miktarı aşmayın. EPA'ya göre fazla pestisit ailenizin sağlığını tehlikeye atar.",
            "Karıştırma gerektirmeyen, kullanıma hazır ürünleri tercih edin ve ev kimyasallarını birbirine karıştırmayın.",
            "Bütün odayı ilaçlamayın. Yem ve tuzaklar dışında pestisit yalnızca hedefli olarak, belirli bir noktaya uygulanır.",
            "Yemi ve diğer ürünleri çocukların ve evcil hayvanların ulaşamayacağı yerlere koyun. Kapalı istasyon riski azaltır ama yemi tamamen zararsız yapmaz.",
            "Yiyecekleri, bulaşıkları ve gıdayla temas eden yüzeyleri etiketin belirttiği şekilde koruyun.",
            "Pestisitleri orijinal ambalajında, çocukların ulaşamayacağı bir yerde saklayın. Boş kabı başka bir şeyi, hele yiyecek veya içeceği saklamak için asla kullanmayın.",
          ],
        },
        paragraphs: [
          "Evdeki karıncalar genellikle acil bir tehlike değildir; ancak bazı türler ısırabilir veya sokabilir ve kimyasal ürünlerin yanlış kullanımı ek risk yaratır. ABD Çevre Koruma Ajansı (EPA), kimyasaldan önce önlemeyi önerir: yiyecek, su ve barınak kaynaklarını ortadan kaldırmak.",
          "Bir karınca sizi ısırdıysa veya soktuysa, NHS'e (Birleşik Krallık Ulusal Sağlık Hizmeti) göre bu genellikle ciddi değildir: birkaç saat veya gün içinde geçen ağrı, kaşıntı veya şişlik olabilir. Dudaklar, ağız, boğaz veya dil aniden şişerse, nefes almak veya yutkunmak zorlaşırsa, cilt veya dudaklar morarır, grileşir veya solarsa ya da kişi aniden çok şaşkın, uykulu veya baş dönmesi içinde olursa hemen 112'yi arayın. Karınca görmek tek başına 112'yi aramak için bir neden değildir: 112, acil servislerin hemen gelmesi hayati önem taşıdığında aranır.",
          "Kimyasal bir ürün kullanıyorsanız:",
        ],
      },
      {
        heading: "Karıncaların geri gelmesi nasıl önlenir?",
        image: "sealing",
        list: {
          items: [
            "Dökülen tatlı sıvıları ve kırıntıları hemen silin, açık yiyecekleri kapalı kaplarda saklayın.",
            "Çöp kovasının sıkı bir kapağı olsun; evcil hayvan kabının çevresini temiz tutun.",
            "Sızıntıları zamanında onarın ve nemden zarar görmüş ahşabı değiştirin.",
            "Süpürgelik, çerçeve ve boru geçişlerindeki erişilebilir çatlakları dolgu macunuyla kapatın; bu, [kokarca böceği](/insects/farosana-sakhlshi) gibi başka böceklerin girişini de zorlaştırır. Havalandırma ve gider açıklıklarını kapatmayın, elektrik tesisatı ve prizlerle kendiniz uğraşmayın.",
            "Dışarıda bitkileri ve dalları duvara veya çatıya değmeyecek şekilde budayın: karıncalar onları köprü olarak kullanır.",
          ],
        },
        paragraphs: [
          "UC IPM'e göre temel yaklaşım, karıncaların binaya girmesini zorlaştırmak ve yiyecek ile su kaynaklarını ortadan kaldırmaktır. Karıncalar gittikten sonra birkaç gündelik alışkanlık geri dönmelerini zorlaştırır:",
        ],
      },
    ],
    summary:
      "Karıncalar eve genellikle yiyecek ve su aramak için girer. Önce nereden geldiklerine bakın, yiyecek ve nemi kaldırın, yolu sabunlu suyla temizleyin ve ulaşabildiğiniz aralıkları kapatın. Görünen karıncaları uzaklaştırmak yuva sorununu çözmez: geri geliyorlarsa etiketi uygun bir yemi, çevresinde sprey ve temizlik ürünü olmadan kullanın veya bir uzmana başvurun. Karınca görmek 112'yi aramak için bir neden değildir; bir ısırıktan sonra ağır alerjik reaksiyon belirtileri olursa arayın.",
    title: "Evde karınca: nasıl kurtulunur ve geri gelmesi nasıl önlenir?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "University of California Statewide IPM Program (UC IPM): Ants",
    supports: {
      en: "Ants enter buildings for food, water and shelter, often after weather changes; following trails to entry points; soapy water or vacuuming temporarily removes foragers and their scent trail; caulking entry points; sprays kill only foragers and are usually not needed indoors; slow-acting baits shared through the colony; baits mainly outdoors, indoors when the infestation is serious and the entry point unknown; a bait that does not attract the species gives no control; results may take several weeks or more; exclusion and removing food and water as the main approach.",
      ka: "ჭიანჭველები შენობაში საკვების, წყლისა და თავშესაფრის საძებნელად შემოდიან, ხშირად ამინდის ცვლილების შემდეგ; ბილიკის გაყოლა შემოსასვლელამდე; საპნიანი წყალი ან მტვერსასრუტი ჭიანჭველებსა და სუნის კვალს დროებით აშორებს; შემოსასვლელების ჰერმეტიკით დახურვა; სპრეი მხოლოდ მუშებს კლავს და შიგნით, როგორც წესი, საჭირო არ არის; ნელა მოქმედი სატყუარა კოლონიაში ნაწილდება; სატყუარა ძირითადად გარეთ, შიგნით სერიოზული პრობლემისა და უცნობი შემოსასვლელის დროს; სახეობისთვის არამიმზიდველი სატყუარა შედეგს არ იძლევა; შედეგს შეიძლება რამდენიმე კვირა ან მეტი დასჭირდეს; შემოსვლის შეზღუდვა და საკვებისა და წყლის მოშორება მთავარი მიდგომაა.",
      ru: "Муравьи заходят в здания за едой, водой и укрытием, часто после смены погоды; отслеживание дорожки до входа; мыльная вода или пылесос временно убирают муравьёв и пахучий след; заделка входов герметиком; спреи убивают только фуражиров и обычно не нужны в доме; медленно действующие приманки распространяются по колонии; приманки в основном снаружи, в доме при серьёзной проблеме и неизвестном входе; приманка, не привлекающая вид, не даёт результата; результат может занять несколько недель или больше; основной подход: не пускать муравьёв и убирать еду и воду.",
      tr: "Karıncalar binalara yiyecek, su ve barınak için, çoğu zaman hava değişikliklerinden sonra girer; yolu giriş yerine kadar izlemek; sabunlu su veya süpürge işçileri ve koku izini geçici olarak giderir; giriş yerlerini dolgu macunuyla kapatmak; sprey yalnızca işçileri öldürür ve ev içinde genellikle gerekmez; yavaş etkili yem koloniye yayılır; yem esas olarak dışarıda, ciddi sorun ve bilinmeyen giriş yerinde içeride; türü çekmeyen yem sonuç vermez; sonuç birkaç hafta veya daha uzun sürebilir; temel yaklaşım girişi engellemek ve yiyecek ile suyu kaldırmaktır.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/ants/",
  },
  {
    name: "University of Minnesota Extension: Ants",
    supports: {
      en: "Pheromone trails; indoor nesting sites behind trim, baseboards, countertops, in wall voids and moisture-damaged wood; ants are hard to identify even from pictures and species may need different treatment; a mild vinegar and water solution temporarily disrupts trails; monitor bait for 24 hours and replace ignored bait; baits can take weeks or months; do not spray insecticide when using bait; winged ants swarming indoors indicate an indoor nest; ant and termite features; insecticides can make Pharaoh ant colonies bud, and an experienced professional is recommended.",
      ka: "ფერომონის ბილიკები; ბუდე შენობაში მოპირკეთების, პლინტუსებისა და დახლის მიღმა, კედლის ღრუსა და დანესტიანებულ ხეში; ჭიანჭველის ამოცნობა ფოტოთიც რთულია და სახეობებს განსხვავებული მიდგომა სჭირდება; ძმრისა და წყლის სუსტი ხსნარი ბილიკს დროებით არღვევს; სატყუარაზე 24-საათიანი დაკვირვება და იგნორირებულის შეცვლა; სატყუარას კვირები ან თვეები სჭირდება; სატყუარასთან ერთად ინსექტიციდის შესხურება არ შეიძლება; შიგნით ფრთიანი ჭიანჭველების გამოფრენა შიდა ბუდის ნიშანია; ჭიანჭველისა და ტერმიტის ნიშნები; ინსექტიციდმა შეიძლება ფარაონის ჭიანჭველის კოლონია დაყოს, რეკომენდებულია გამოცდილი სპეციალისტი.",
      ru: "Феромонные дорожки; гнёзда в здании за обшивкой, плинтусами, столешницами, в полостях стен и отсыревшей древесине; муравьёв сложно определить даже по фото, разным видам нужен разный подход; слабый раствор уксуса и воды временно нарушает дорожки; наблюдение за приманкой 24 часа и замена игнорируемой; приманкам нужны недели или месяцы; нельзя опрыскивать инсектицидом при использовании приманки; вылет крылатых муравьёв в доме указывает на гнездо внутри; признаки муравья и термита; инсектициды могут вызвать деление колоний фараонова муравья, рекомендуется опытный специалист.",
      tr: "Feromon izleri; binada kaplama, süpürgelik ve tezgâh arkasında, duvar boşluklarında ve nemli ahşapta yuvalar; karıncaları fotoğraftan bile tanımak zordur ve türler farklı yaklaşım gerektirebilir; hafif sirke-su çözeltisi yolları geçici olarak bozar; yemi 24 saat izleyip görmezden gelineni değiştirmek; yem haftalar veya aylar sürebilir; yem kullanırken insektisit püskürtülmez; içeride kanatlı karınca uçuşu iç yuvanın işaretidir; karınca ve termit özellikleri; insektisitler firavun karıncası kolonilerinin bölünmesine yol açabilir, deneyimli uzman önerilir.",
    },
    url: "https://extension.umn.edu/garden-and-home/home-maintenance/household-insects/ants",
  },
  {
    name: "University of Kentucky Entomology: Ant Control for Householders (ENTFACT-619)",
    supports: {
      en: "Foragers on exposed surfaces are a small part of the colony, so spraying only visible ants usually fails; baits combine a food attractant with a slow-acting insecticide carried to the queens; place baits beside ant trails; do not spray insecticides or cleaning agents around baits; more ants at the bait at first, with activity usually subsiding in a few days; wiping trails with a kitchen cleanser or mild detergent gives temporary relief; reduce access to food and moisture; professionals have more experience and tools for persistent problems.",
      ka: "ღია ზედაპირზე მოსიარულე ჭიანჭველები კოლონიის მცირე ნაწილია, ამიტომ მხოლოდ დანახულის შესხურება, როგორც წესი, შედეგს არ იძლევა; სატყუარა მიმზიდველ საკვებსა და ნელა მოქმედ ინსექტიციდს აერთიანებს, რომელიც დედოფლამდე აღწევს; სატყუარა ბილიკის გვერდით; სატყუარის ირგვლივ ინსექტიციდისა და საწმენდის გამოყენება არ შეიძლება; თავიდან სატყუარასთან ჭიანჭველები მატულობს, აქტივობა კი, როგორც წესი, რამდენიმე დღეში იკლებს; ბილიკის სარეცხი საშუალებით გაწმენდა დროებით შვებას იძლევა; საკვებსა და ტენზე წვდომის შეზღუდვა; მუდმივი პრობლემისას სპეციალისტებს მეტი გამოცდილება და საშუალებები აქვთ.",
      ru: "Муравьи на открытых поверхностях составляют малую часть колонии, поэтому опрыскивание только видимых обычно не помогает; приманка сочетает пищевую приманку и медленно действующий инсектицид, который доходит до маток; приманки рядом с дорожкой; нельзя применять инсектициды и моющие средства вокруг приманок; сначала муравьёв у приманки больше, затем активность обычно снижается за несколько дней; протирание дорожки моющим средством даёт временное облегчение; ограничение доступа к еде и влаге; при стойкой проблеме у специалистов больше опыта и средств.",
      tr: "Açık yüzeylerdeki karıncalar koloninin küçük bir kısmıdır, bu yüzden yalnızca görüneni ilaçlamak genellikle başarısız olur; yem, kraliçelere ulaşan yavaş etkili bir insektisitle çekici bir besini birleştirir; yemi yolun yanına koymak; yem çevresinde insektisit veya temizlik ürünü kullanılmaz; başta yemde karınca artar, aktivite genellikle birkaç günde azalır; yolu deterjanla silmek geçici rahatlama sağlar; yiyecek ve neme erişimi azaltmak; kalıcı sorunlarda uzmanların daha fazla deneyimi ve aracı vardır.",
    },
    url: "https://entomology.mgcafe.uky.edu/ef619",
  },
  {
    name: "National Pesticide Information Center (NPIC): Ants",
    supports: {
      en: "Store food in hard, sealed containers rather than cardboard or paper; clean up crumbs and sweet spills; keep pet food inaccessible and garbage covered; fix leaks and replace moist wood; caulk or seal cracks; trim plants that touch the house; read the label before using a pesticide.",
      ka: "საკვები მყარ, დახურულ ჭურჭელში და არა მუყაოსა თუ ქაღალდში; ნამცეცებისა და ტკბილი სითხის აღება; ცხოველის საკვები მიუწვდომლად და ნაგავი დახურულად; ჟონვის შეკეთება და დანესტიანებული ხის შეცვლა; ნაპრალების დახურვა; სახლს მიკრული მცენარეების გაკრეჭა; პესტიციდის გამოყენებამდე ეტიკეტის წაკითხვა.",
      ru: "Хранить продукты в твёрдых закрытых контейнерах, а не в картоне или бумаге; убирать крошки и сладкие пролитые жидкости; держать корм питомцев недоступным, а мусор закрытым; устранять протечки и заменять сырую древесину; заделывать щели; подрезать растения, касающиеся дома; читать этикетку перед применением пестицида.",
      tr: "Yiyecekleri karton veya kâğıt yerine sert, kapalı kaplarda saklamak; kırıntıları ve tatlı dökülmeleri temizlemek; evcil hayvan mamasını erişilemez, çöpü kapalı tutmak; sızıntıları onarmak ve nemli ahşabı değiştirmek; çatlakları kapatmak; eve değen bitkileri budamak; pestisit kullanmadan önce etiketi okumak.",
    },
    url: "https://npic.orst.edu/pest/ant.html",
  },
  {
    name: "US EPA: Do's and Don'ts of Pest Control",
    supports: {
      en: "Prevention before chemicals: remove food, water and shelter, store food in sealed containers, fix leaky plumbing; follow the label; do not use products for pests not on the label or more than directed; use ready-to-use products; apply pesticides other than baits and traps only to targeted spots, not the whole room; outdoor chemicals stay toxic longer indoors; store pesticides in original containers and never reuse empty containers; keep baits out of reach of children and pets.",
      ka: "ქიმიამდე პრევენცია: საკვების, წყლისა და თავშესაფრის მოშორება, საკვები დახურულ ჭურჭელში, ჟონვის შეკეთება; ეტიკეტის დაცვა; ეტიკეტზე არმითითებული მავნებლისთვის ან მითითებულზე მეტი რაოდენობით გამოყენების აკრძალვა; მზა პროდუქტები; სატყუარისა და ხაფანგის გარდა პესტიციდი მხოლოდ მიზნობრივად და არა მთელ ოთახში; გარე გამოყენების ქიმია შენობაში უფრო დიდხანს რჩება ტოქსიკური; პესტიციდი ორიგინალ ტარაში, ცარიელი ტარის ხელახლა გამოყენების აკრძალვა; სატყუარა ბავშვებისა და ცხოველებისთვის მიუწვდომლად.",
      ru: "Профилактика до химии: убрать еду, воду и укрытие, хранить продукты в закрытых контейнерах, устранять протечки; соблюдать этикетку; не применять против вредителей, не указанных на этикетке, и не превышать дозу; готовые к применению средства; кроме приманок и ловушек, пестициды только точечно, не на всю комнату; уличная химия дольше остаётся токсичной в помещении; хранить пестициды в оригинальной таре и не использовать пустую тару повторно; приманки вне досягаемости детей и животных.",
      tr: "Kimyasaldan önce önleme: yiyecek, su ve barınağı kaldırmak, yiyeceği kapalı kaplarda saklamak, sızıntıları onarmak; etikete uymak; etikette olmayan zararlılar için veya belirtilenden fazla kullanmamak; kullanıma hazır ürünler; yem ve tuzak dışındaki pestisitleri bütün odaya değil yalnızca hedefli uygulamak; dış mekân kimyasalları kapalı alanda daha uzun süre zehirli kalır; pestisitleri orijinal kabında saklamak ve boş kabı yeniden kullanmamak; yemleri çocuk ve hayvanlardan uzak tutmak.",
    },
    url: "https://www.epa.gov/safepestcontrol/dos-and-donts-pest-control",
  },
  {
    name: "National Pesticide Information Center (NPIC): Pesticide Home Remedies",
    supports: {
      en: "Home remedies may be untested, lack directions on how much, where and how often to use them, and lack safety warnings; even too much of a low-toxicity ingredient can be harmful; natural products still need care.",
      ka: "სახლის საშუალებები შეიძლება გამოუცდელი იყოს, არ მიუთითებდეს, რამდენი, სად და რა სიხშირით გამოიყენოთ, და არ შეიცავდეს უსაფრთხოების გაფრთხილებებს; დაბალი ტოქსიკურობის ნივთიერებაც ზედმეტი რაოდენობით შეიძლება საზიანო იყოს; ბუნებრივ საშუალებასაც სიფრთხილე სჭირდება.",
      ru: "Домашние средства могут быть не проверены, не содержать указаний, сколько, где и как часто применять, и предупреждений о безопасности; даже вещество низкой токсичности в избытке может навредить; натуральные средства тоже требуют осторожности.",
      tr: "Ev çareleri test edilmemiş olabilir, ne kadar, nerede ve ne sıklıkla kullanılacağına dair talimat ve güvenlik uyarısı içermeyebilir; düşük toksisiteli bir maddenin fazlası bile zararlı olabilir; doğal ürünler de dikkat gerektirir.",
    },
    url: "https://npic.orst.edu/pest/home-remedies.html",
  },
  {
    name: "National Pesticide Information Center (NPIC): Pets and Pesticide Use",
    supports: {
      en: "Insect baits contain ingredients many pets find appetising; place baits in secure stations or where pets cannot reach them.",
      ka: "მწერების სატყუარა შეიცავს ინგრედიენტებს, რომლებიც ბევრ შინაურ ცხოველს იზიდავს; სატყუარა დახურულ კონტეინერში ან ცხოველისთვის მიუწვდომელ ადგილას.",
      ru: "Приманки для насекомых содержат компоненты, привлекательные для многих домашних животных; размещать приманки в закрытых станциях или вне досягаемости животных.",
      tr: "Böcek yemleri birçok evcil hayvanın iştah açıcı bulduğu içerikler barındırır; yemleri güvenli istasyonlara veya hayvanların ulaşamayacağı yerlere koymak.",
    },
    url: "https://npic.orst.edu/factsheets/petspest.html",
  },
  {
    name: "University of Minnesota Extension: Carpenter ants",
    supports: {
      en: "Carpenter ants nest in moist or decayed wood and excavate galleries but do not eat wood; eliminating moisture and replacing damaged wood.",
      ka: "Camponotus-ის (carpenter ants) ჭიანჭველები ნესტიან ან დამპალ ხეში ბუდობენ და გალერეებს თხრიან, მაგრამ ხეს არ ჭამენ; ტენის აღმოფხვრა და დაზიანებული ხის შეცვლა.",
      ru: "Муравьи-древоточцы гнездятся в сырой или гнилой древесине и прокладывают ходы, но не едят древесину; устранение влаги и замена повреждённой древесины.",
      tr: "Marangoz karıncalar nemli veya çürük ahşapta yuva yapar ve galeri açar ama ahşabı yemez; nemi gidermek ve hasarlı ahşabı değiştirmek.",
    },
    url: "https://extension.umn.edu/garden-and-home/home-maintenance/household-insects/carpenter-ants",
  },
  {
    name: "NHS: Insect bites and stings",
    supports: {
      en: "Ant bites and stings are usually not serious, with pain, itching or swelling that passes within hours or days; signs of a severe allergic reaction that need emergency help.",
      ka: "ჭიანჭველის ნაკბენი და ნესტარი, როგორც წესი, სერიოზული არ არის: ტკივილი, ქავილი ან შეშუპება რამდენიმე საათში ან დღეში გადის; მძიმე ალერგიული რეაქციის ნიშნები, რომლებიც გადაუდებელ დახმარებას საჭიროებს.",
      ru: "Укусы и ужаления муравьёв обычно не опасны: боль, зуд или отёк проходят за часы или дни; признаки тяжёлой аллергической реакции, требующие экстренной помощи.",
      tr: "Karınca ısırıkları ve sokmaları genellikle ciddi değildir; ağrı, kaşıntı veya şişlik saatler ya da günler içinde geçer; acil yardım gerektiren ağır alerjik reaksiyon belirtileri.",
    },
    url: "https://www.nhs.uk/conditions/insect-bites-and-stings/",
  },
  {
    name: "112 Georgia: When to call 112",
    supports: {
      en: "In Georgia, call 112 when the immediate arrival of emergency services (police, fire and rescue, ambulance) is vital.",
      ka: "საქართველოში 112-ზე დარეკვა საჭიროა, როცა გადაუდებელი სამსახურების (პოლიცია, სახანძრო-სამაშველო, სასწრაფო დახმარება) დაუყოვნებლივ მოსვლა სასიცოცხლოდ აუცილებელია.",
      ru: "В Грузии звонить 112 нужно, когда немедленный приезд экстренных служб (полиции, пожарно-спасательной службы, скорой помощи) жизненно необходим.",
      tr: "Gürcistan'da acil servislerin (polis, itfaiye ve kurtarma, ambulans) hemen gelmesi hayati önem taşıdığında 112 aranır.",
    },
    url: "https://112.gov.ge/?lang=en&page_id=1686",
  },
];

export const ANTS_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "A thin trail of small dark ants along a white skirting board in a kitchen, heading from a gap at the floor towards crumbs and a drop of spilled juice by a cabinet",
      ka: "წვრილი მუქი ჭიანჭველების ბილიკი სამზარეულოში, თეთრი პლინტუსის გასწვრივ: იატაკთან ღრიჭოდან კარადასთან დაყრილი ნამცეცებისა და დაღვრილი წვენის წვეთისკენ",
      ru: "Тонкая дорожка мелких тёмных муравьёв вдоль белого плинтуса на кухне: от щели у пола к крошкам и капле пролитого сока у шкафа",
      tr: "Mutfakta beyaz süpürgelik boyunca ilerleyen ince bir küçük koyu karınca yolu: zemindeki aralıktan dolabın yanındaki kırıntılara ve dökülmüş meyve suyu damlasına",
    },
    height: 941,
    src: "https://cdn.reptiles.ge/external/ants-kitchen-trail-crumbs-spilled-juice.jpg",
    width: 1672,
  },
  id: "ants-in-house",
  images: {
    bait: {
      alt: {
        en: "A closed, unbranded round bait station on the floor beside a trail of small ants along a skirting board, with ants going into its entry holes",
        ka: "დახურული, მარკის გარეშე მრგვალი სატყუარა-კონტეინერი იატაკზე, პლინტუსის გასწვრივ მიმავალი ჭიანჭველების ბილიკის გვერდით; ჭიანჭველები მის ხვრელებში შედიან",
        ru: "Закрытая круглая приманочная станция без маркировки на полу рядом с дорожкой мелких муравьёв вдоль плинтуса; муравьи заходят в её отверстия",
        tr: "Süpürgelik boyunca uzanan küçük karınca yolunun yanında, zeminde duran markasız, kapalı yuvarlak bir yem istasyonu; karıncalar giriş deliklerine giriyor",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/ant-bait-station-along-skirting-board.jpg",
      width: 1672,
    },
    cleaning: {
      alt: {
        en: "Hands wiping the edge of a kitchen countertop with a damp cloth next to a bowl of soapy water, with a few small ants further along the edge",
        ka: "ხელები სველი ტილოთი წმენდს სამზარეულოს დახლის კიდეს, გვერდით საპნიანი წყლის ჯამია, კიდეზე მოშორებით რამდენიმე პატარა ჭიანჭველაა",
        ru: "Руки протирают край кухонной столешницы влажной тряпкой рядом с миской мыльной воды; дальше по краю видны несколько мелких муравьёв",
        tr: "Eller, yanında sabunlu su kasesi olan mutfak tezgâhının kenarını nemli bir bezle siliyor; kenarın ilerisinde birkaç küçük karınca var",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/ants-countertop-cleaning-soapy-water.jpg",
      width: 1672,
    },
    gap: {
      alt: {
        en: "Close-up of small ants walking in and out of a narrow gap where a pipe passes through the wall under a kitchen sink",
        ka: "ახლო ხედი: პატარა ჭიანჭველები შედიან და გამოდიან ვიწრო ღრიჭოდან, სადაც სამზარეულოს ნიჟარის ქვეშ მილი კედელში გადის",
        ru: "Крупный план: мелкие муравьи заходят в узкую щель и выходят из неё там, где труба под кухонной раковиной проходит через стену",
        tr: "Yakın plan: küçük karıncalar, mutfak lavabosunun altında borunun duvardan geçtiği dar aralığa girip çıkıyor",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/ants-entering-through-pipe-gap-kitchen.jpg",
      width: 1672,
    },
    sealing: {
      alt: {
        en: "Hands using a caulking gun to seal a thin crack along the bottom of a white skirting board with a bead of white sealant",
        ka: "ხელები ჰერმეტიკის პისტოლეტით თეთრი ჰერმეტიკით ავსებენ წვრილ ნაპრალს თეთრი პლინტუსის ქვედა კიდის გასწვრივ",
        ru: "Руки с пистолетом для герметика заделывают белым герметиком тонкую щель вдоль нижнего края белого плинтуса",
        tr: "Eller, dolgu tabancasıyla beyaz süpürgeliğin alt kenarı boyunca uzanan ince çatlağı beyaz dolgu macunuyla kapatıyor",
      },
      height: 941,
      src: "https://cdn.reptiles.ge/external/ants-home-sealing-skirting-board-crack.jpg",
      width: 1672,
    },
  },
  messageKey: "antsInHouse",
  ogImage: "/og/images/guides/ants-in-house.jpg",
  parentHub: "insects",
  pathname: "/insects/chianchvelebi-sakhlshi",
  search: {
    icon: "guide",
    keywords: [
      "ჭიანჭველა",
      "ჭიანჭველები",
      "ჭიანჭველები სახლში",
      "ჭიანჭველები ბინაში",
      "ჭიანჭველები სამზარეულოში",
      "ჭიანჭველები სააბაზანოში",
      "ჭიანჭველების მოშორება",
      "ჭიანჭველების სატყუარა",
      "ფრთიანი ჭიანჭველები",
      "chianchvela",
      "chianchvelebi",
      "chiantchvelebi",
      "ants",
      "ants in house",
      "ant bait",
      "муравьи",
      "муравьи в доме",
      "karınca",
      "evde karınca",
    ],
    rank: 5,
    subtitle: {
      en: "Where they get in, how to remove them, and safe baiting",
      ka: "საიდან შემოდიან, როგორ მოვიშოროთ და როგორ გამოვიყენოთ სატყუარა უსაფრთხოდ",
      ru: "Откуда заходят, как избавиться и как безопасно использовать приманку",
      tr: "Nereden girerler, nasıl uzaklaştırılır ve yem güvenle nasıl kullanılır",
    },
    title: {
      en: "Ants in the house",
      ka: "ჭიანჭველები სახლში",
      ru: "Муравьи в доме",
      tr: "Evde karınca",
    },
  },
  sources: SOURCES,
});
