import type { AppLocale } from "@/i18n/routing";

import {
  CDC_VENOMOUS_SNAKES_SOURCE,
  GEORGIA_112_SOURCE,
  WHO_SNAKEBITE_TREATMENT_SOURCE,
} from "@/content/guides/snakeBite";
import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";
import { HERPETOFAUNA_CHECKLIST_SOURCE } from "@/data/herpetofauna-checklist";

type ImageKey = "natrix" | "stones" | "why";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Snake in the yard? No repellent works reliably. Keep your distance, leave it a way out, and cut back the shelter and rodents that draw snakes in.",
    faq: [
      {
        answer:
          "No. No spray, powder or device has been shown to keep snakes away reliably. Sulfur, mothballs and odour-based home remedies were tested on snakes, and none of them worked. Fewer hiding places and fewer rodents do far more, although even a tidy yard can get a passing snake.",
        question: "Is there a product that keeps snakes away for good?",
      },
      {
        answer:
          "No. Killing a snake usually solves nothing, because the shelter and food that drew it in are still there. Trying to kill or catch it also raises the risk of a bite. Many snakes eat rodents, so a harmless one near the house is doing you a favour.",
        question: "Should I kill the snake?",
      },
      {
        answer:
          "Sometimes, but only as a last step. A snake-proof fence uses rigid fine mesh or solid sheeting with openings no wider than about 6 mm, buried into the soil. Under a shed or barn, a barrier that reaches about 15 cm below the surface stops snakes crawling underneath.",
        question: "Will a fence keep snakes out?",
      },
      {
        answer:
          "Not before you know what lives in it. A hole can belong to another animal, and filling it blindly can trap that animal or simply move the problem. Watch it from a distance first; if you need help, contact the animal service.",
        question: "Should I fill the hole a snake went into?",
      },
      {
        answer:
          "In Tbilisi, call the animal monitoring service on 032 272 16 00 for safe removal. Call 112 for an emergency, such as a bite, not for routine removal. Do not try to catch the snake yourself while you wait.",
        question: "Who can remove a snake from my yard?",
      },
    ],
    intro:
      "Do not try to catch, kill or move the snake. Keep your distance, move children and pets away, and leave the snake a clear way out. Most snakes in Georgia are harmless, but treat one you cannot identify as venomous.",
    metaTitle: "Snake in the yard: what to do and how to keep snakes away",
    notice:
      "Bitten by a snake? Call 112 straight away and open the [snake bite guide](/snakes/gvelis-nakbeni). Do not cut the bite, suck it or use a tourniquet.",
    sections: [
      {
        heading: "What should you do if a snake is already in the yard?",
        list: {
          items: [
            "Stop and step back slowly.",
            "Move children and pets away from the spot.",
            "Leave the snake a clear exit and do not block its path.",
            "Do not catch it, kill it or move it by hand. If you need it removed safely, call the relevant service.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Trying to catch, kill or move a snake raises the risk of a bite. You do not need to know the species to stay safe: distance is enough. If you want to identify it later, take a photo from a safe distance and compare it with the [snake species index](/snakes/saxeoebebi).",
        ],
      },
      {
        heading: "Why do snakes come into a yard?",
        image: "why",
        paragraphs: [
          "A yard draws snakes for two reasons: safe shelter and food. Tall grass, dense shrubs, logs, piles of stones or building materials and cracks in walls all make good hiding places. Rodents are important food for many snakes, so a yard with mice or rats also has prey.",
          "Where shelter and food meet, a snake has a reason to stay. Take either one away and the yard stops being a good place to live.",
        ],
      },
      {
        heading: "How can you make the yard less attractive to snakes?",
        image: "stones",
        list: {
          items: [
            "Mow tall grass regularly, especially next to the house. Short grass leaves no cover and lets you see what is moving.",
            "Clear piles of stones, bricks, boards, old items and building materials. Cut back dense shrubs along the edges of the yard.",
            "Stack firewood away from the house, on a rack about 30 cm off the ground.",
            "Keep pet food, bird seed and grain in closed containers, and do not leave food waste out. Fewer rodents means less food for snakes.",
          ],
        },
        paragraphs: [
          "The aim is not to catch the snake but to take away the reasons it came. These steps work slowly and over the long term. If mice are already in the house, the [mouse in the house guide](/mammals/tagvi-sakhlshi) covers what to do.",
        ],
      },
      {
        heading: "How do you keep snakes out of the house?",
        paragraphs: [
          "A snake can use an opening wider than about 6 mm. Check the foundation, the basement and crawl spaces, the gaps around pipes and cables, and the space under doors. Seal gaps with mortar, sealant or metal mesh, fit door sweeps, and keep window screens tight.",
          "Cover vents and drains with fine metal mesh instead of closing them off. Before you seal any opening, make sure no animal is inside.",
        ],
      },
      {
        heading: "A snake in the house: what should you do?",
        paragraphs: [
          "The rule is the same as in the yard. Do not catch it or kill it. Keep your distance, move children and pets to another room, and leave the snake a way out.",
          "If you cannot tell what species it is, treat it as venomous and keep away from its head. Photograph it from a distance if you can, and call the relevant service for safe removal. Do not chase it into a corner or poke it out with a stick.",
        ],
      },
      {
        heading: "Which popular methods do not work?",
        list: {
          items: [
            "Burning or scattering sulfur.",
            "Leaving out milk.",
            "Mothballs. They are a toxic pesticide and have little effect on snakes.",
            "Repellent sprays and powders. No snake repellent has been shown to work reliably.",
            "Sound or ultrasonic devices pushed into the ground or plugged in.",
          ],
        },
        paragraphs: [
          "These methods are popular, but tests and reviews have not shown them to work. Worse, they give a false sense of safety, and people stop watching where they step. Spend the time and money on tidying the yard and controlling rodents instead.",
        ],
      },
      {
        heading: "Is every snake in the yard venomous?",
        image: "natrix",
        paragraphs: [
          "No. Most snakes in Georgia are non-venomous, and many harmless species are taken for venomous ones. Colour and pattern are not a safe way to tell them apart, especially from close up.",
          "If you are not sure of the species, keep a safe distance and do not touch the snake. The [venomous snakes guide](/venomous-snakes) and [how to identify a venomous snake](/snakes/shxamiani-gvelis-amocnoba) show which species are dangerous and how to tell them apart.",
        ],
      },
      {
        heading: "What if a snake bites someone?",
        paragraphs: [
          "Call 112 immediately. Stay calm and keep the bitten arm or leg as still as you can. Remove rings, watches and other tight items before swelling starts.",
          "Do not cut the bite, do not try to suck out venom and do not use a tourniquet. The [snake bite guide](/snakes/gvelis-nakbeni) explains the first steps and the warning signs in more detail.",
        ],
      },
    ],
    summary:
      "There is no reliable way to drive a snake out of a yard, and repellents, sulfur and milk do not work. Keep your distance, move children and pets away and leave the snake a way out. Over the long term, mow tall grass, clear piles of stones and wood, control rodents and seal gaps into the house. If someone is bitten, call 112.",
    title: "Snake in the yard: what to do and how to keep snakes away",
  },
  ka: {
    description:
      "გველი ეზოში? დასაფრთხობი საშუალება სანდოდ არ მუშაობს. დაიცავით მანძილი, დაუტოვეთ გასასვლელი და შეამცირეთ სამალავები და მღრღნელები.",
    faq: [
      {
        answer:
          "არა. არც ერთი სპრეი, ფხვნილი ან აპარატი გველს სანდოდ ვერ აფრთხობს. გოგირდი, ნაფთალინი და სუნზე დაფუძნებული სახლის საშუალებები გველებზე გამოსცადეს და არც ერთმა არ იმუშავა. სამალავებისა და მღრღნელების შემცირება ბევრად მეტს აკეთებს, თუმცა მოწესრიგებულ ეზოშიც შეიძლება გველი შემთხვევით გამოჩნდეს.",
        question: "არსებობს საშუალება, რომელიც გველს სამუდამოდ აფრთხობს?",
      },
      {
        answer:
          "არა. გველის მოკვლა პრობლემას ჩვეულებრივ არ წყვეტს, რადგან სამალავი და საკვები, რამაც ის მოიზიდა, ისევ ადგილზეა. გველის მოკვლის ან დაჭერის მცდელობა კი ნაკბენის რისკს ზრდის. ბევრი გველი მღრღნელებით იკვებება, ასე რომ, სახლთან უშხამო გველი თქვენთვის სასარგებლოა.",
        question: "მოვკლა გველი?",
      },
      {
        answer:
          "ზოგჯერ, მაგრამ მხოლოდ ბოლო ნაბიჯად. გველისგან დამცავი ღობე მყარი წვრილი ბადისგან ან მთლიანი ფურცლისგან კეთდება, დაახლოებით 6 მმ-ზე ვიწრო ხვრელებით, და მიწაში ჩაფლული. ფარდულის ან ბოსლის ქვეშ ზღუდე, რომელიც მიწაში დაახლოებით 15 სმ-ით ჩადის, გველს ქვეშ შეძვრომის საშუალებას არ აძლევს.",
        question: "ღობე გველს შემოსვლაში შეუშლის?",
      },
      {
        answer:
          "მანამდე არა, სანამ არ გაიგებთ, ვინ ცხოვრობს შიგნით. ხვრელი შეიძლება სხვა ცხოველს ეკუთვნოდეს და მისი ბრმად ამოვსება ცხოველს ჩაკეტავს ან პრობლემას სხვაგან გადაიტანს. ჯერ მოშორებიდან დააკვირდით; თუ დახმარება გჭირდებათ, მიმართეთ შესაბამის სამსახურს.",
        question: "ამოვავსო ხვრელი, სადაც გველი შევიდა?",
      },
      {
        answer:
          "თბილისში გველის უსაფრთხოდ გაყვანისთვის დაუკავშირდით ცხოველთა მონიტორინგის სამსახურს ნომერზე 032 272 16 00. 112-ზე დარეკეთ გადაუდებელ შემთხვევაში, მაგალითად ნაკბენისას, და არა ჩვეულებრივი გაყვანისთვის. ლოდინისას გველის დაჭერას თავად ნუ ეცდებით.",
        question: "ვინ გაიყვანს გველს ეზოდან?",
      },
    ],
    intro:
      "ნუ ეცდებით გველის დაჭერას, მოკვლას ან გადაყვანას. დაიცავით მანძილი, ბავშვები და შინაური ცხოველები მოარიდეთ და გველს გასასვლელი დაუტოვეთ. საქართველოში გველების უმეტესობა უშხამოა, მაგრამ ის, ვისაც ვერ ამოიცნობთ, შხამიანად ჩათვალეთ.",
    metaTitle: "გველი ეზოში — რა ვქნათ ახლა და როგორ დავიცვათ ეზო",
    notice:
      "გველმა გიკბინათ? მაშინვე დარეკეთ 112-ზე და გახსენით [გველის ნაკბენის გიდი](/snakes/gvelis-nakbeni). ნაკბენი არ გაჭრათ, არ ამოწოვოთ და ტურნიკეტი არ გამოიყენოთ.",
    sections: [
      {
        heading: "რა ვქნა, თუ გველი უკვე ეზოშია?",
        list: {
          items: [
            "გაჩერდით და ნელა დაიხიეთ უკან.",
            "ბავშვები და შინაური ცხოველები ამ ადგილს მოარიდეთ.",
            "გველს გასასვლელი დაუტოვეთ და გზა არ გადაუკეტოთ.",
            "ნუ დაიჭერთ, ნუ მოკლავთ და ხელით ნუ გადაიყვანთ. თუ უსაფრთხოდ გაყვანა გჭირდებათ, დაურეკეთ შესაბამის სამსახურს.",
          ],
          ordered: true,
        },
        paragraphs: [
          "გველის დაჭერის, მოკვლის ან გადაყვანის მცდელობა ნაკბენის რისკს ზრდის. უსაფრთხოებისთვის სახეობის ცოდნა არ გჭირდებათ: მანძილი საკმარისია. თუ მოგვიანებით ამოცნობა გინდათ, უსაფრთხო მანძილიდან გადაუღეთ და შეადარეთ [გველების სახეობებს](/snakes/saxeoebebi).",
        ],
      },
      {
        heading: "რატომ შემოდის გველი ეზოში?",
        image: "why",
        paragraphs: [
          "ეზო გველს ორი რამით იზიდავს: უსაფრთხო სამალავით და საკვებით. მაღალი ბალახი, ხშირი ბუჩქები, მორები, ქვებისა და სამშენებლო მასალის გროვები და კედლის ნაპრალები კარგ სამალავს ქმნის. მღრღნელები ბევრი გველის მნიშვნელოვანი საკვებია, ამიტომ ეზოში, სადაც თაგვები ან ვირთხები ჩნდება, გველს ნადავლიც აქვს.",
          "სადაც სამალავი და საკვები ერთად არის, იქ გველს დარჩენის მიზეზი აქვს. ერთ-ერთი მაინც მოაშორეთ და ეზო მისთვის საცხოვრებლად აღარ გამოდგება.",
        ],
      },
      {
        heading: "როგორ გავხადოთ ეზო გველისთვის ნაკლებად მიმზიდველი?",
        image: "stones",
        list: {
          items: [
            "მაღალი ბალახი რეგულარულად მოთიბეთ, განსაკუთრებით სახლთან. დაბალ ბალახში გველი ვერ იმალება და კარგად ჩანს, რა მოძრაობს.",
            "მოაშორეთ ქვების, აგურის, ფიცრების, ძველი ნივთებისა და სამშენებლო მასალის გროვები. ეზოს კიდეებთან ხშირი ბუჩქები შეათხელეთ.",
            "შეშა სახლიდან მოშორებით დააწყვეთ, მიწიდან დაახლოებით 30 სმ-ით აწეულ თაროზე.",
            "შინაური ცხოველების საკვები, ფრინველის საკვები და მარცვლეული დახურულ ჭურჭელში შეინახეთ, საკვების ნარჩენები კი გარეთ ნუ დატოვებთ. ნაკლები მღრღნელი გველისთვის ნაკლებ საკვებს ნიშნავს.",
          ],
        },
        paragraphs: [
          "მიზანი გველის დაჭერა კი არა, იმ მიზეზების მოშორებაა, რის გამოც მოვიდა. ეს ნაბიჯები ნელა, მაგრამ ხანგრძლივად მუშაობს. თუ თაგვები უკვე სახლშია, ნახეთ [გიდი თაგვზე სახლში](/mammals/tagvi-sakhlshi).",
        ],
      },
      {
        heading: "როგორ არ შემოვუშვათ გველი სახლში?",
        paragraphs: [
          "გველი დაახლოებით 6 მმ-ზე ფართო ხვრელშიც ეტევა. შეამოწმეთ საძირკველი, სარდაფი, მილებისა და კაბელების გარშემო ღრიჭოები და კარის ქვედა ნაწილი. ნაპრალები ხსნარით, ჰერმეტიკით ან ლითონის ბადით დახურეთ, კარს ქვედა ზოლი დაუყენეთ და ფანჯრის ბადეები მჭიდროდ დაამაგრეთ.",
          "სავენტილაციო ხვრელები და სანიაღვრეები წვრილი ლითონის ბადით გადაფარეთ და ნუ ამოაშენებთ. ნებისმიერი ხვრელის დახურვამდე დარწმუნდით, რომ შიგნით ცხოველი არ არის.",
        ],
      },
      {
        heading: "გველი სახლში — რა ვქნა?",
        paragraphs: [
          "წესი იგივეა, რაც ეზოში. ნუ დაიჭერთ და ნუ მოკლავთ. დაიცავით მანძილი, ბავშვები და შინაური ცხოველები სხვა ოთახში გაიყვანეთ და გველს გასასვლელი დაუტოვეთ.",
          "თუ სახეობას ვერ არჩევთ, შხამიანად ჩათვალეთ და მის თავს ახლოს ნუ მიუახლოვდებით. თუ შეგიძლიათ, მოშორებიდან გადაუღეთ და უსაფრთხოდ გაყვანისთვის დაურეკეთ შესაბამის სამსახურს. კუთხეში ნუ მიიმწყვდევთ და ჯოხით ნუ გამოაგდებთ.",
        ],
      },
      {
        heading: "რომელი გავრცელებული მეთოდები არ მუშაობს?",
        list: {
          items: [
            "გოგირდის დაწვა ან მოფანტვა.",
            "რძის დადგმა.",
            "ნაფთალინი. ის ტოქსიკური პესტიციდია და გველზე თითქმის არ მოქმედებს.",
            "დასაფრთხობი სპრეი და ფხვნილი. გველის არც ერთი დასაფრთხობი საშუალება სანდოდ მოქმედი არ აღმოჩნდა.",
            "მიწაში ჩასარჭობი ან როზეტში ჩასართავი ხმოვანი და ულტრაბგერითი აპარატები.",
          ],
        },
        paragraphs: [
          "ეს მეთოდები პოპულარულია, მაგრამ ცდებმა და მიმოხილვებმა მათი ეფექტი ვერ აჩვენა. უარესიც: ისინი უსაფრთხოების მცდარ განცდას ქმნის და ადამიანი ფეხქვეშ ყურებას წყვეტს. დრო და ფული ეზოს მოწესრიგებასა და მღრღნელების კონტროლს მოახმარეთ.",
        ],
      },
      {
        heading: "ეზოში ნანახი ყველა გველი შხამიანია?",
        image: "natrix",
        paragraphs: [
          "არა. საქართველოში გველების უმეტესობა უშხამოა, და ბევრ უწყინარ სახეობას შხამიანში ურევენ. ფერი და ნახატი მათი გარჩევის უსაფრთხო გზა არ არის, მით უმეტეს ახლოდან.",
          "თუ სახეობაში დარწმუნებული არ ხართ, უსაფრთხო მანძილი დაიცავით და გველს ნუ შეეხებით. [შხამიანი გველების გიდი](/venomous-snakes) და [როგორ ვიცნოთ შხამიანი გველი](/snakes/shxamiani-gvelis-amocnoba) აჩვენებს, რომელი სახეობებია საშიში და როგორ განვასხვავოთ ისინი.",
        ],
      },
      {
        heading: "რა ვქნა, თუ გველმა უკბინა?",
        paragraphs: [
          "მაშინვე დარეკეთ 112-ზე. შეინარჩუნეთ სიმშვიდე და დაკბენილი ხელი ან ფეხი რაც შეიძლება ნაკლებად ამოძრავეთ. შეშუპების დაწყებამდე მოიხსენით ბეჭდები, საათი და სხვა მჭიდრო ნივთები.",
          "ნაკბენი არ გაჭრათ, შხამის ამოწოვას ნუ ეცდებით და ტურნიკეტი არ გამოიყენოთ. [გველის ნაკბენის გიდი](/snakes/gvelis-nakbeni) პირველ ნაბიჯებსა და საგანგაშო ნიშნებს დაწვრილებით აღწერს.",
        ],
      },
    ],
    summary:
      "გველის ეზოდან განდევნის სანდო გზა არ არსებობს, ხოლო დასაფრთხობი საშუალებები, გოგირდი და რძე არ მუშაობს. დაიცავით მანძილი, ბავშვები და შინაური ცხოველები მოარიდეთ და გველს გასასვლელი დაუტოვეთ. ხანგრძლივად კი მოთიბეთ მაღალი ბალახი, მოაშორეთ ქვებისა და შეშის გროვები, აკონტროლეთ მღრღნელები და სახლის ღრიჭოები დახურეთ. ნაკბენისას დარეკეთ 112-ზე.",
    title: "გველი ეზოში: რა ვქნათ და როგორ დავიცვათ ეზო?",
  },
  ru: {
    description:
      "Змея во дворе? Отпугиватели надёжно не работают. Держитесь на расстоянии, оставьте ей выход и уберите укрытия и грызунов, которые её привлекают.",
    faq: [
      {
        answer:
          "Нет. Ни один спрей, порошок или прибор не отпугивает змей надёжно. Серу, нафталин и домашние средства с запахом проверяли на змеях, и ни одно не сработало. Гораздо больше даёт сокращение укрытий и грызунов, хотя и в ухоженный двор змея может случайно заползти.",
        question: "Есть ли средство, которое отпугнёт змей навсегда?",
      },
      {
        answer:
          "Нет. Убийство змеи обычно ничего не решает: укрытия и корм, которые её привлекли, остаются на месте. К тому же попытка убить или поймать змею повышает риск укуса. Многие змеи едят грызунов, так что неядовитая змея у дома вам скорее полезна.",
        question: "Нужно ли убить змею?",
      },
      {
        answer:
          "Иногда, но только как последняя мера. Забор от змей делают из жёсткой мелкой сетки или сплошного листа с отверстиями не шире примерно 6 мм и закапывают в землю. Под сараем или хлевом барьер, уходящий в грунт примерно на 15 см, не даёт змее заползти снизу.",
        question: "Поможет ли забор?",
      },
      {
        answer:
          "Не раньше, чем вы узнаете, кто в ней живёт. Нора может принадлежать другому животному, и, засыпав её вслепую, вы запрёте его или просто перенесёте проблему в другое место. Сначала понаблюдайте издалека; если нужна помощь, обратитесь в профильную службу.",
        question: "Засыпать ли нору, куда заползла змея?",
      },
      {
        answer:
          "В Тбилиси для безопасного удаления змеи звоните в службу мониторинга животных по номеру 032 272 16 00. 112 — для экстренных случаев, например укуса, а не для обычного удаления. Пока ждёте, не пытайтесь поймать змею сами.",
        question: "Кто уберёт змею со двора?",
      },
    ],
    intro:
      "Не пытайтесь поймать, убить или переместить змею. Держитесь на расстоянии, уведите детей и домашних животных и оставьте змее свободный выход. Большинство змей в Грузии неядовиты, но ту, которую не можете определить, считайте ядовитой.",
    metaTitle: "Змея во дворе: что делать сейчас и как уберечь двор",
    notice:
      "Укусила змея? Сразу звоните 112 и откройте [гид по укусу змеи](/snakes/gvelis-nakbeni). Не разрезайте место укуса, не отсасывайте яд и не накладывайте жгут.",
    sections: [
      {
        heading: "Что делать, если змея уже во дворе?",
        list: {
          items: [
            "Остановитесь и медленно отойдите назад.",
            "Уведите с этого места детей и домашних животных.",
            "Оставьте змее свободный выход и не перекрывайте ей путь.",
            "Не ловите, не убивайте и не переносите её руками. Если нужно безопасное удаление, позвоните в профильную службу.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Попытка поймать, убить или переместить змею повышает риск укуса. Чтобы остаться в безопасности, знать вид не нужно: достаточно расстояния. Если хотите определить змею позже, сфотографируйте её с безопасного расстояния и сравните с [указателем видов змей](/snakes/saxeoebebi).",
        ],
      },
      {
        heading: "Почему змеи приходят во двор?",
        image: "why",
        paragraphs: [
          "Двор привлекает змей двумя вещами: безопасным укрытием и едой. Высокая трава, густые кусты, брёвна, кучи камней или стройматериалов и трещины в стенах дают хорошие убежища. Грызуны — важный корм для многих змей, поэтому во дворе с мышами или крысами есть и добыча.",
          "Где укрытие и еда рядом, у змеи есть причина остаться. Уберите хотя бы одно из двух, и двор перестанет быть для неё удобным местом.",
        ],
      },
      {
        heading: "Как сделать двор менее привлекательным для змей?",
        image: "stones",
        list: {
          items: [
            "Регулярно косите высокую траву, особенно у дома. В низкой траве негде спрятаться, и видно, что движется.",
            "Уберите кучи камней, кирпича, досок, старых вещей и стройматериалов. Проредите густые кусты по краям двора.",
            "Складывайте дрова подальше от дома, на стеллаже примерно в 30 см над землёй.",
            "Храните корм для животных и птиц и зерно в закрытых ёмкостях, не оставляйте пищевые отходы снаружи. Меньше грызунов — меньше еды для змей.",
          ],
        },
        paragraphs: [
          "Цель не в том, чтобы поймать змею, а в том, чтобы убрать причины, по которым она пришла. Эти шаги действуют медленно, но надолго. Если мыши уже в доме, загляните в [гид о мыши в доме](/mammals/tagvi-sakhlshi).",
        ],
      },
      {
        heading: "Как не пустить змею в дом?",
        paragraphs: [
          "Змее хватает отверстия шире примерно 6 мм. Проверьте фундамент, подвал и подполье, щели вокруг труб и кабелей и зазор под дверью. Заделайте щели раствором, герметиком или металлической сеткой, поставьте на двери уплотнитель снизу и плотно закрепите москитные сетки.",
          "Вентиляционные отверстия и стоки закройте мелкой металлической сеткой, а не замуровывайте. Прежде чем заделать любое отверстие, убедитесь, что внутри нет животного.",
        ],
      },
      {
        heading: "Змея в доме: что делать?",
        paragraphs: [
          "Правило то же, что и во дворе. Не ловите и не убивайте её. Держитесь на расстоянии, уведите детей и домашних животных в другую комнату и оставьте змее выход.",
          "Если не можете определить вид, считайте змею ядовитой и не приближайтесь к её голове. Если получится, сфотографируйте её издалека и позвоните в профильную службу для безопасного удаления. Не загоняйте её в угол и не выгоняйте палкой.",
        ],
      },
      {
        heading: "Какие популярные способы не работают?",
        list: {
          items: [
            "Сжигание или рассыпание серы.",
            "Блюдце с молоком.",
            "Нафталин. Это токсичный пестицид, и на змей он почти не действует.",
            "Отпугивающие спреи и порошки. Ни одно средство от змей не показало надёжного действия.",
            "Звуковые и ультразвуковые приборы, которые втыкают в землю или включают в розетку.",
          ],
        },
        paragraphs: [
          "Эти способы популярны, но испытания и обзоры не подтвердили их действия. Хуже того, они создают ложное чувство безопасности, и человек перестаёт смотреть под ноги. Лучше потратьте время и деньги на порядок во дворе и борьбу с грызунами.",
        ],
      },
      {
        heading: "Все ли змеи во дворе ядовиты?",
        image: "natrix",
        paragraphs: [
          "Нет. Большинство змей в Грузии неядовиты, и многие безобидные виды принимают за ядовитые. Цвет и рисунок — ненадёжный способ их различить, особенно вблизи.",
          "Если не уверены в виде, держитесь на безопасном расстоянии и не трогайте змею. [Гид по ядовитым змеям](/venomous-snakes) и [как распознать ядовитую змею](/snakes/shxamiani-gvelis-amocnoba) показывают, какие виды опасны и как их отличить.",
        ],
      },
      {
        heading: "Что делать, если змея укусила?",
        paragraphs: [
          "Сразу звоните 112. Сохраняйте спокойствие и как можно меньше двигайте укушенной рукой или ногой. Снимите кольца, часы и другие тесные вещи, пока не началась отёчность.",
          "Не разрезайте место укуса, не пытайтесь отсосать яд и не накладывайте жгут. [Гид по укусу змеи](/snakes/gvelis-nakbeni) подробнее описывает первые шаги и тревожные признаки.",
        ],
      },
    ],
    summary:
      "Надёжного способа выгнать змею со двора нет, а отпугиватели, сера и молоко не работают. Держитесь на расстоянии, уведите детей и домашних животных и оставьте змее выход. В долгосрочной перспективе косите высокую траву, убирайте кучи камней и дров, боритесь с грызунами и заделывайте щели в доме. При укусе звоните 112.",
    title: "Змея во дворе: что делать и как уберечь двор?",
  },
  tr: {
    description:
      "Bahçede yılan mı var? Kovucular güvenilir şekilde işe yaramaz. Mesafenizi koruyun, ona çıkış bırakın ve onu çeken saklanma yerlerini ve kemirgenleri azaltın.",
    faq: [
      {
        answer:
          "Hayır. Hiçbir sprey, toz veya cihaz yılanları güvenilir biçimde uzak tutmaz. Kükürt, naftalin ve kokuya dayalı ev yöntemleri yılanlar üzerinde denendi ve hiçbiri işe yaramadı. Saklanma yerlerini ve kemirgenleri azaltmak çok daha etkilidir; yine de düzenli bir bahçeye de bir yılan rastlantıyla girebilir.",
        question: "Yılanları kalıcı olarak uzak tutan bir ürün var mı?",
      },
      {
        answer:
          "Hayır. Yılanı öldürmek genellikle hiçbir şeyi çözmez, çünkü onu çeken saklanma yeri ve yiyecek yerinde durur. Onu öldürmeye ya da yakalamaya çalışmak da ısırılma riskini artırır. Pek çok yılan kemirgenlerle beslenir; evin yanındaki zararsız bir yılan size aslında yarar sağlar.",
        question: "Yılanı öldürmeli miyim?",
      },
      {
        answer:
          "Bazen, ama yalnızca son adım olarak. Yılana karşı çit, delikleri yaklaşık 6 mm'den geniş olmayan sert ince telden veya düz levhadan yapılır ve toprağa gömülür. Bir kulübe veya ahırın altında, toprağa yaklaşık 15 cm inen bir bariyer yılanın alttan girmesini önler.",
        question: "Çit yılanları dışarıda tutar mı?",
      },
      {
        answer:
          "İçinde ne yaşadığını öğrenmeden önce hayır. Delik başka bir hayvana ait olabilir; onu körü körüne doldurmak o hayvanı içeride hapseder ya da sorunu başka yere taşır. Önce uzaktan gözlemleyin; yardıma ihtiyacınız varsa ilgili hizmete başvurun.",
        question: "Yılanın girdiği deliği doldurmalı mıyım?",
      },
      {
        answer:
          "Tiflis'te yılanın güvenle çıkarılması için 032 272 16 00 numarasından hayvan izleme hizmetini arayın. 112'yi ısırık gibi acil durumlarda arayın, olağan çıkarma talepleri için değil. Beklerken yılanı kendiniz yakalamaya çalışmayın.",
        question: "Bahçemdeki yılanı kim çıkarabilir?",
      },
    ],
    intro:
      "Yılanı yakalamaya, öldürmeye veya yerinden oynatmaya çalışmayın. Mesafenizi koruyun, çocukları ve evcil hayvanları uzaklaştırın ve yılana açık bir çıkış bırakın. Gürcistan'daki yılanların çoğu zehirsizdir, ancak tanıyamadığınız bir yılanı zehirli sayın.",
    metaTitle: "Bahçede yılan: şimdi ne yapmalı, yılanlar nasıl uzak tutulur",
    notice:
      "Yılan mı ısırdı? Hemen 112'yi arayın ve [yılan ısırığı rehberini](/snakes/gvelis-nakbeni) açın. Isırığı kesmeyin, emmeyin ve turnike uygulamayın.",
    sections: [
      {
        heading: "Yılan zaten bahçedeyse ne yapmalısınız?",
        list: {
          items: [
            "Durun ve yavaşça geri çekilin.",
            "Çocukları ve evcil hayvanları bu noktadan uzaklaştırın.",
            "Yılana açık bir çıkış bırakın ve yolunu kesmeyin.",
            "Onu yakalamayın, öldürmeyin veya elle taşımayın. Güvenle çıkarılması gerekiyorsa ilgili hizmeti arayın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Yılanı yakalamaya, öldürmeye veya taşımaya çalışmak ısırılma riskini artırır. Güvende kalmak için türü bilmeniz gerekmez: mesafe yeterlidir. Sonradan tanımlamak isterseniz güvenli bir mesafeden fotoğrafını çekin ve [yılan türleri dizini](/snakes/saxeoebebi) ile karşılaştırın.",
        ],
      },
      {
        heading: "Yılanlar bahçeye neden gelir?",
        image: "why",
        paragraphs: [
          "Bahçe yılanları iki şeyle çeker: güvenli saklanma yeri ve yiyecek. Uzun ot, sık çalılar, kütükler, taş veya inşaat malzemesi yığınları ve duvar çatlakları iyi saklanma yerleri oluşturur. Kemirgenler pek çok yılanın önemli besinidir; fare veya sıçan görülen bir bahçede yılanın avı da vardır.",
          "Saklanma yeri ile yiyeceğin bir arada olduğu yerde yılanın kalmak için bir nedeni vardır. Bunlardan en az birini ortadan kaldırın, bahçe onun için yaşanacak bir yer olmaktan çıkar.",
        ],
      },
      {
        heading:
          "Bahçeyi yılanlar için nasıl daha az çekici hale getirirsiniz?",
        image: "stones",
        list: {
          items: [
            "Uzun otları, özellikle evin yanında, düzenli olarak biçin. Kısa otta saklanacak yer kalmaz ve neyin hareket ettiği görünür.",
            "Taş, tuğla, tahta, eski eşya ve inşaat malzemesi yığınlarını kaldırın. Bahçe kenarlarındaki sık çalıları seyreltin.",
            "Odunu evden uzakta, yerden yaklaşık 30 cm yüksek bir rafa istifleyin.",
            "Evcil hayvan yemini, kuş yemini ve tahılı kapalı kaplarda saklayın, yiyecek artıklarını dışarıda bırakmayın. Daha az kemirgen, yılan için daha az yiyecek demektir.",
          ],
        },
        paragraphs: [
          "Amaç yılanı yakalamak değil, onu getiren nedenleri ortadan kaldırmaktır. Bu adımlar yavaş ama uzun vadede işe yarar. Fareler zaten evdeyse [evde fare rehberine](/mammals/tagvi-sakhlshi) bakın.",
        ],
      },
      {
        heading: "Yılanı eve girmekten nasıl alıkoyarsınız?",
        paragraphs: [
          "Bir yılan yaklaşık 6 mm'den geniş bir açıklığı kullanabilir. Temeli, bodrumu ve döşeme altı boşluklarını, boru ve kablo çevresindeki aralıkları ve kapı altını kontrol edin. Boşlukları harç, dolgu macunu veya metal tel ile kapatın, kapılara alt fitil takın ve pencere tellerini sıkıca sabitleyin.",
          "Havalandırma deliklerini ve giderleri kapatmak yerine ince metal telle örtün. Herhangi bir açıklığı kapatmadan önce içeride hayvan olmadığından emin olun.",
        ],
      },
      {
        heading: "Evde yılan: ne yapmalısınız?",
        paragraphs: [
          "Kural bahçedekiyle aynıdır. Onu yakalamayın ve öldürmeyin. Mesafenizi koruyun, çocukları ve evcil hayvanları başka bir odaya alın ve yılana bir çıkış bırakın.",
          "Türü ayırt edemiyorsanız onu zehirli sayın ve başına yaklaşmayın. Mümkünse uzaktan fotoğrafını çekin ve güvenle çıkarılması için ilgili hizmeti arayın. Onu bir köşeye sıkıştırmayın ve sopayla dışarı itmeye çalışmayın.",
        ],
      },
      {
        heading: "Hangi yaygın yöntemler işe yaramaz?",
        list: {
          items: [
            "Kükürt yakmak veya serpmek.",
            "Süt bırakmak.",
            "Naftalin. Zehirli bir pestisittir ve yılanlar üzerinde neredeyse hiç etkisi yoktur.",
            "Kovucu spreyler ve tozlar. Hiçbir yılan kovucunun güvenilir şekilde işe yaradığı gösterilmedi.",
            "Toprağa çakılan veya prize takılan sesli ve ultrasonik cihazlar.",
          ],
        },
        paragraphs: [
          "Bu yöntemler yaygındır, ancak denemeler ve incelemeler etkilerini gösteremedi. Daha da kötüsü, sahte bir güvenlik duygusu yaratırlar ve insanlar ayaklarının altına bakmayı bırakır. Zamanınızı ve paranızı bahçeyi düzenlemeye ve kemirgenleri kontrol etmeye ayırın.",
        ],
      },
      {
        heading: "Bahçedeki her yılan zehirli mi?",
        image: "natrix",
        paragraphs: [
          "Hayır. Gürcistan'daki yılanların çoğu zehirsizdir ve birçok zararsız tür zehirli sanılır. Renk ve desen, özellikle yakından, onları ayırt etmenin güvenli bir yolu değildir.",
          "Türden emin değilseniz güvenli mesafede durun ve yılana dokunmayın. [Zehirli yılanlar rehberi](/venomous-snakes) ve [zehirli yılan nasıl tanınır](/snakes/shxamiani-gvelis-amocnoba) hangi türlerin tehlikeli olduğunu ve nasıl ayırt edileceğini gösterir.",
        ],
      },
      {
        heading: "Yılan birini ısırırsa ne yapmalı?",
        paragraphs: [
          "Hemen 112'yi arayın. Sakin kalın ve ısırılan kolu veya bacağı olabildiğince az hareket ettirin. Şişlik başlamadan yüzükleri, saati ve diğer sıkı eşyaları çıkarın.",
          "Isırığı kesmeyin, zehri emmeye çalışmayın ve turnike uygulamayın. [Yılan ısırığı rehberi](/snakes/gvelis-nakbeni) ilk adımları ve uyarı işaretlerini daha ayrıntılı anlatır.",
        ],
      },
    ],
    summary:
      "Bir yılanı bahçeden kovmanın güvenilir bir yolu yoktur; kovucular, kükürt ve süt işe yaramaz. Mesafenizi koruyun, çocukları ve evcil hayvanları uzaklaştırın ve yılana bir çıkış bırakın. Uzun vadede uzun otları biçin, taş ve odun yığınlarını kaldırın, kemirgenleri kontrol edin ve evdeki boşlukları kapatın. Isırık olursa 112'yi arayın.",
    title: "Bahçede yılan: ne yapmalı ve nasıl uzak tutmalı?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "Mississippi State University Extension — Reducing Snake Problems Around Homes",
    supports: {
      en: "Removing shelter and debris, mowing, firewood stored off the ground, rodent food in closed containers, sealing gaps wider than about 6 mm, buried barriers under sheds, tests showing sulfur, mothballs and odour remedies did not work, and why killing a snake is usually pointless.",
      ka: "სამალავებისა და ნარჩენების მოშორება, თიბვა, მიწიდან აწეული შეშა, მღრღნელების საკვები დახურულ ჭურჭელში, დაახლოებით 6 მმ-ზე ფართო ღრიჭოების დახურვა, ფარდულის ქვეშ ჩაფლული ზღუდე, ცდები, რომლებშიც გოგირდმა, ნაფთალინმა და სუნიანმა საშუალებებმა არ იმუშავა, და რატომ არის გველის მოკვლა ჩვეულებრივ უაზრო.",
      ru: "Удаление укрытий и мусора, покос, дрова на подставке над землёй, корм для грызунов в закрытых ёмкостях, заделка щелей шире примерно 6 мм, закопанный барьер под сараем, испытания, в которых сера, нафталин и пахучие средства не сработали, и почему убивать змею обычно бессмысленно.",
      tr: "Saklanma yerlerinin ve döküntünün kaldırılması, biçme, yerden yüksek istiflenmiş odun, kapalı kaplarda kemirgen yemi, yaklaşık 6 mm'den geniş boşlukların kapatılması, kulübe altına gömülü bariyer, kükürt, naftalin ve kokulu yöntemlerin işe yaramadığı denemeler ve yılanı öldürmenin neden genellikle anlamsız olduğu.",
    },
    url: "https://extension.msstate.edu/publications/reducing-snake-problems-around-homes",
  },
  {
    name: "National Pesticide Information Center — Snakes",
    supports: {
      en: "Removing rodents and spilled feed, sealing openings, door sweeps and screens, covering vents and drains with mesh, snake-proof fencing, mothballs having little effect on snakes, and keeping children and pets away from a snake indoors.",
      ka: "მღრღნელებისა და დაბნეული საკვების მოშორება, ხვრელების დახურვა, კარის ზოლი და ფანჯრის ბადე, სავენტილაციო ხვრელებისა და სანიაღვრეების ბადით გადაფარვა, გველისგან დამცავი ღობე, ნაფთალინის მცირე ეფექტი გველზე და ბავშვებისა და შინაური ცხოველების მორიდება სახლში შემოსული გველისგან.",
      ru: "Удаление грызунов и рассыпанного корма, заделка отверстий, дверные уплотнители и сетки, закрытие вентиляции и стоков сеткой, забор от змей, слабое действие нафталина на змей и удаление детей и домашних животных от змеи в доме.",
      tr: "Kemirgenlerin ve dökülen yemin kaldırılması, açıklıkların kapatılması, kapı fitilleri ve teller, havalandırma ve giderlerin telle örtülmesi, yılana karşı çit, naftalinin yılanlar üzerindeki zayıf etkisi ve evdeki yılandan çocukların ve evcil hayvanların uzak tutulması.",
    },
    url: "https://npic.orst.edu/pest/snake.html",
  },
  {
    name: "University of Georgia Extension — Repellents and Wildlife Damage Control",
    supports: {
      en: "Sulfur sold as a snake deterrent does not work and gives a false sense of security; mothballs should not be used against snakes; plug-in and ultrasonic devices are almost useless.",
      ka: "გველის დასაფრთხობად გაყიდული გოგირდი არ მუშაობს და უსაფრთხოების მცდარ განცდას ქმნის; ნაფთალინი გველის წინააღმდეგ არ უნდა გამოიყენოთ; როზეტში ჩასართავი და ულტრაბგერითი აპარატები თითქმის უსარგებლოა.",
      ru: "Сера, которую продают как средство от змей, не работает и создаёт ложное чувство безопасности; нафталин против змей применять не следует; приборы в розетку и ультразвуковые устройства почти бесполезны.",
      tr: "Yılan kovucu olarak satılan kükürt işe yaramaz ve sahte bir güvenlik duygusu yaratır; naftalin yılanlara karşı kullanılmamalıdır; prize takılan ve ultrasonik cihazlar neredeyse işe yaramaz.",
    },
    url: "https://fieldreport.caes.uga.edu/publications/C1021/repellents-and-wildlife-damage-control/",
  },
  HERPETOFAUNA_CHECKLIST_SOURCE,
  GEORGIA_112_SOURCE,
  WHO_SNAKEBITE_TREATMENT_SOURCE,
  CDC_VENOMOUS_SNAKES_SOURCE,
];

export const SNAKES_IN_YARD = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "A European cat snake (Telescopus fallax) coiled on a stone in Didi Dighomi, Tbilisi",
      ka: "კატისთვალა (Telescopus fallax) ქვაზე დახვეული, დიდი დიღომი, თბილისი",
      ru: "Европейский кошачий уж (Telescopus fallax), свернувшийся на камне в Диди Дигоми, Тбилиси",
      tr: "Tiflis'in Didi Dighomi semtinde bir taşın üzerinde kıvrılmış Avrupa kedi yılanı (Telescopus fallax)",
    },
    credit: {
      en: "Photo: Armen Seropian · Didi Dighomi",
      ka: "ფოტო: Armen Seropian · დიდი დიღომი",
      ru: "Фото: Armen Seropian · Диди Дигоми",
      tr: "Fotoğraf: Armen Seropian · Didi Dighomi",
    },
    height: 1608,
    src: "https://cdn.reptiles.ge/telescopus-fallax-armen-1.jpg",
    width: 2400,
  },
  heroPosition: "40% 30%",
  id: "snakes-in-yard",
  images: {
    natrix: {
      alt: {
        en: "A grass snake (Natrix natrix) with yellow neck patches coiled on the ground in Lagodekhi",
        ka: "ჩვეულებრივი ანკარა (Natrix natrix) კისრის ყვითელი ლაქებით, მიწაზე დახვეული, ლაგოდეხი",
        ru: "Обыкновенный уж (Natrix natrix) с жёлтыми пятнами на шее, свернувшийся на земле в Лагодехи",
        tr: "Lagodekhi'de yerde kıvrılmış, boynunda sarı lekeler olan çim yılanı (Natrix natrix)",
      },
      credit: {
        en: "Photo: Louis Puille · Lagodekhi",
        ka: "ფოტო: Louis Puille · ლაგოდეხი",
        ru: "Фото: Louis Puille · Лагодехи",
        tr: "Fotoğraf: Louis Puille · Lagodekhi",
      },
      height: 683,
      src: "https://cdn.reptiles.ge/natrix-natrix-louis-1.jpg",
      width: 1024,
    },
    stones: {
      alt: {
        en: "A Transcaucasian ratsnake (Zamenis hohenackeri) coiled among loose stones in Mtskheta",
        ka: "ამიერკავკასიური მცურავი (Zamenis hohenackeri) ქვებს შორის დახვეული, მცხეთა",
        ru: "Закавказский полоз (Zamenis hohenackeri), свернувшийся среди камней в Мцхете",
        tr: "Mtsheta'da gevşek taşlar arasında kıvrılmış Transkafkas sıçan yılanı (Zamenis hohenackeri)",
      },
      credit: {
        en: "Photo: Lennart Schmid · Mtskheta",
        ka: "ფოტო: Lennart Schmid · მცხეთა",
        ru: "Фото: Lennart Schmid · Мцхета",
        tr: "Fotoğraf: Lennart Schmid · Mtsheta",
      },
      height: 1367,
      src: "https://cdn.reptiles.ge/zamenis-hohenackeri-lennart-1.jpg",
      width: 2048,
    },
    why: {
      alt: {
        en: "A snake on rocks near rodents and tall grass — shelter and food in one place",
        ka: "გველი ქვებზე, მღრღნელები და მაღალი ბალახი — სამალავი და საკვები ერთ სივრცეში",
        ru: "Змея на камнях рядом с грызунами и высокой травой — укрытие и корм в одном месте",
        tr: "Kemirgenler ve uzun otun yanında kayalarda bir yılan — sığınak ve yiyecek bir arada",
      },
      height: 554,
      src: "/images/guides/snakes-in-yard-shelter-food.jpg",
      width: 851,
    },
  },
  messageKey: "yard",
  ogImage: "/og/images/guides/snakes-in-yard.jpg",
  parentHub: "snakes",
  pathname: "/snakes/gveli-ezoshi",
  relatedGuideIds: ["snake-bite", "mouse-in-house"],
  relatedSpeciesIds: [
    "natrix-natrix",
    "natrix-tessellata",
    "telescopus-fallax",
    "zamenis-hohenackeri",
    "dolichophis-schmidti",
    "macrovipera-lebetina",
  ],
  search: {
    icon: "yard",
    keywords: [
      "როგორ მოვიშოროთ გველი ეზოდან",
      "გველი ეზოში",
      "გველი ეზოში რა ვქნა",
      "გველი სახლში",
      "გველის საწინააღმდეგო საშუალება",
      "გველის საწინააღმდეგო სპრეი",
      "გველის საწინააღმდეგო აპარატი",
      "გველის დასაფრთხობი",
      "გოგირდი გველი",
      "რძე გველი",
      "gveli ezoshi",
      "snakes in the yard",
      "snake repellent",
      "how to get rid of snakes",
      "змея во дворе",
      "как избавиться от змей",
      "bahçede yılan",
      "yılan kovucu",
    ],
    rank: 6,
    subtitle: {
      en: "What works, what doesn’t — a practical guide",
      ka: "რა მუშაობს, რა არა — პრაქტიკული გიდი",
      ru: "Что работает, а что нет — практический гид",
      tr: "Ne işe yarar, ne yaramaz — pratik rehber",
    },
    title: {
      en: "Snake in the yard: what to do",
      ka: "გველი ეზოში: რა ვქნათ?",
      ru: "Змея во дворе: что делать",
      tr: "Bahçede yılan: ne yapmalı",
    },
  },
  sources: SOURCES,
});
