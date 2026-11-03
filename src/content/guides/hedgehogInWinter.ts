import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "curled" | "night" | "tbilisi";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Found a hedgehog in your garden in winter? Learn whether it is hibernating or needs help, how to handle it safely, and why milk and bread can harm it.",
    faq: [
      {
        answer:
          "Yes. When it gets cold, hedgehogs hibernate. According to the British Hedgehog Preservation Society, the timing depends on the weather; in Britain it usually starts between November and January. Our sources give no exact months for Georgia.",
        question: "Do hedgehogs hibernate?",
      },
      {
        answer:
          "Take it to a vet or a wildlife rescue straight away: the Wildlife Aid Foundation says a hedgehog hurt in a bonfire needs help immediately. Next time, check leaf and branch piles before burning them.",
        question: "What if a hedgehog was hurt in a bonfire?",
      },
      {
        answer:
          "Only if it needs help. Then the British Hedgehog Preservation Society advises fresh water and meaty cat or dog food in the box until you reach a vet. Leave a healthy hedgehog alone.",
        question: "Should I give a hedgehog water or food?",
      },
      {
        answer:
          "Only when it needs help. Wear gardening gloves or use a folded towel to protect your hands from the spines. Do not pick up a healthy hedgehog.",
        question: "Can I pick up a hedgehog?",
      },
      {
        answer:
          "British organisations treat a small hedgehog in autumn and winter as at risk: the British Hedgehog Preservation Society calls young hedgehogs under 450 g vulnerable, and the Wildlife Aid Foundation says a hedgehog under 600 g must go to a wildlife centre. These figures come from the United Kingdom; ask a vet.",
        question: "What if I find a very small hedgehog in winter?",
      },
    ],
    intro:
      "A hedgehog found in winter is often hibernating and needs nothing from you. Good intentions can harm it: milk, bread, or taking a healthy animal indoors. First work out whether it is asleep in its nest or out in the open and unwell.",
    metaTitle: "Hedgehog found in winter: what should you do?",
    sections: [
      {
        heading: "I found a hedgehog in winter. What should I do?",
        paragraphs: [
          "First, look at where it is and how it behaves. A hedgehog curled up and still in a pile of leaves, under logs or in another sheltered spot is most likely hibernating: cover it back up and leave it alone.",
          "If it is out in the open in daylight, wobbling, injured or has flies around it, it needs help: protect your hands, put it in a box and contact a vet.",
          "Good intentions can harm a hedgehog found in winter. Never give it milk or bread, and do not take a healthy hedgehog indoors. Read more about the species on its profile: [southern white-breasted hedgehog](erinaceus-concolor).",
        ],
      },
      {
        heading: "What does what you see mean?",
        paragraphs: [
          "The table lists the most common situations. Each one is explained in more detail below.",
        ],
        table: {
          headers: ["What you see", "What it means", "What to do"],
          rows: [
            [
              "A curled-up, motionless hedgehog in leaves or under logs",
              "It is most likely hibernating",
              "Gently cover it with leaves again and leave",
            ],
            [
              "A hedgehog out in daylight, in the open",
              "It may be sick or injured",
              "Pick it up with gloves, put it in a box, call a vet",
            ],
            [
              "It wobbles, walks in circles or has flies around it",
              "It needs help urgently",
              "Take it to a vet as soon as possible",
            ],
            [
              "A hedgehog walking at night or on a mild winter day",
              "Hedgehogs sometimes change nests in winter",
              "Watch from a distance and do not touch it",
            ],
          ],
        },
      },
      {
        heading: "Is it hibernating or dead?",
        image: "curled",
        paragraphs: [
          "A hibernating hedgehog can look lifeless. According to the British Hedgehog Preservation Society, during hibernation its breathing almost stops, about one breath every few minutes, and its body temperature can fall to around 10°C or lower. A cold, still hedgehog is therefore not necessarily dead.",
          "Do not prod or dig it out to check. If it lies in a sheltered nest, cover it back up and leave it. If it lies out in the open, injured or in an unusual place, treat it as a hedgehog that needs help.",
        ],
      },
      {
        heading: "Which hedgehog lives in Georgia?",
        image: "tbilisi",
        paragraphs: [
          "Georgia's hedgehog is the southern white-breasted hedgehog (Erinaceus concolor); the 2023 checklist of Georgia's insectivores lists no other hedgehog. In Georgian it is often called the “European hedgehog”, although the western European hedgehog (Erinaceus europaeus) does not live in Georgia.",
          "Most practical advice on hedgehogs in winter comes from British organisations and was written for the western European hedgehog, a close relative. Use it as general guidance: our sources give no exact hibernation months or weights for Georgia.",
        ],
      },
      {
        heading: "Why might you see a hedgehog outside in winter?",
        image: "night",
        paragraphs: [
          "According to the British Hedgehog Preservation Society, hedgehogs wake often during hibernation but rarely leave the nest; if the nest gets too cold, they may build a new one. Disturbance or unexpectedly warm weather can also wake them.",
          "Hedgehog Street notes that each hedgehog is likely to move nest at least once during the winter, so it can sometimes be seen out and about, and that in mild winters hedgehogs can stay active into November and December.",
          "A hedgehog out in daylight is a different matter. According to the Wildlife Aid Foundation, unless it is a warm winter day or the female is pregnant, this almost certainly means something is wrong.",
        ],
      },
      {
        heading: "When does a hedgehog need help?",
        list: {
          items: [
            "It is lethargic or lying out in the open.",
            "It wobbles, staggers or walks in circles.",
            "It is lying asleep in the sun.",
            "It has flies around it, or it is injured.",
            "It is trapped, for example in netting or a hole.",
            "It is out in daylight.",
            "It looks very small for winter: the British Hedgehog Preservation Society calls young hedgehogs under 450 g vulnerable, and the Wildlife Aid Foundation says hedgehogs under 600 g must go to a wildlife centre.",
          ],
        },
        paragraphs: [
          "The British Hedgehog Preservation Society and the Wildlife Aid Foundation name these signs. If you see any of them, the hedgehog needs help.",
        ],
      },
      {
        heading: "What if you disturbed a hibernating hedgehog?",
        list: {
          items: [
            "Stop working in that spot.",
            "Gently put the leaves or nest material back over the hedgehog.",
            "Do not move it to another place.",
            "Do not take it into the house, shed or garage.",
            "Leave the spot alone and keep away from it for the rest of the winter.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Hedgehog Street warns that any disturbance during hibernation can be extremely dangerous. The Wildlife Aid Foundation advises against moving a hedgehog that is hibernating or about to hibernate, and to cover an uncovered nest back up quickly.",
        ],
      },
      {
        heading: "How do you help a sick or injured hedgehog?",
        list: {
          items: [
            "Protect your hands with gardening gloves or a folded towel and pick the hedgehog up.",
            "Put it in a deep-sided box with an old towel or fleece in the bottom so it can hide.",
            "Wrap a hot water bottle in a towel and put it in the box, leaving room for the hedgehog to move off it. Keep the bottle warm: a cooled one makes things worse.",
            "Keep the box in a quiet place.",
            "Offer fresh water and meaty cat or dog food. Never milk or bread.",
            "Contact a vet as soon as possible. If the hedgehog is clearly in pain, take it to a vet straight away.",
          ],
          ordered: true,
        },
        paragraphs: [
          "These steps follow the first aid advice of the British Hedgehog Preservation Society. They are only for the time until a vet sees the hedgehog.",
        ],
      },
      {
        heading: "Why are milk and bread harmful?",
        paragraphs: [
          "According to the RSPCA, hedgehogs are lactose intolerant, so they should never be given milk. Bread is not nutritious for them.",
          "The Wildlife Aid Foundation warns that bread and milk is not a healthy diet for this carnivorous mammal and can be fatal to hedgehogs. It also advises against peanuts and mealworms.",
        ],
      },
      {
        heading: "Why not take a healthy hedgehog indoors?",
        paragraphs: [
          "The British Hedgehog Preservation Society discourages keeping healthy hedgehogs in sheds or garages over winter to protect them from the cold.",
          "Warmth does not help a hibernating hedgehog: according to the same society, at about 10°C it uses up its fat reserves twice as fast as at the optimum of about 4°C. A wild hedgehog is also not a pet; if it is healthy, leave it where it is.",
        ],
      },
      {
        heading:
          "How do you keep hedgehogs safe in the garden in autumn and winter?",
        list: {
          items: [
            "Before burning a pile of leaves or branches, check it: the RSPCA warns that hedgehogs may nest in bonfire piles.",
            "Leave leaf and log piles in place: they are where hedgehogs build their winter nests.",
            "Take care with strimmers, mowers and garden forks: the Wildlife Aid Foundation sees serious injuries from them.",
            "If a hedgehog is caught in netting, cut the netting free around it and take the hedgehog to a vet or wildlife rescue.",
          ],
        },
        paragraphs: [
          "The RSPCA and the Wildlife Aid Foundation name these risks to hedgehogs during autumn and winter garden work.",
        ],
      },
    ],
    summary:
      "First look at the hedgehog you found in winter. If it is curled up asleep in leaves or under logs, cover it back up and leave it. If it is out in daylight, wobbling, injured or has flies around it, pick it up with gloves, put it in a box with a towel and a warm water bottle, give it water and contact a vet. Never give milk or bread, and do not take a healthy hedgehog indoors.",
    title: "Hedgehog found in winter: what should you do?",
  },
  ka: {
    description:
      "ზამთარში ბაღში ზღარბი იპოვეთ? გაიგეთ, ზამთრის ძილშია თუ დახმარება სჭირდება, როგორ აიყვანოთ უსაფრთხოდ და რატომ შეიძლება ავნოს რძემ და პურმა.",
    faq: [
      {
        answer:
          "დიახ. აცივებისას ზღარბი ზამთრის ძილს ეძლევა. British Hedgehog Preservation Society-ის მიხედვით, ვადა ამინდზეა დამოკიდებული; ბრიტანეთში ძილი ჩვეულებრივ ნოემბრიდან იანვრამდე იწყება. საქართველოსთვის ზუსტ თვეებს ჩვენი წყაროები არ ასახელებენ.",
        question: "ზღარბს ზამთარში სძინავს?",
      },
      {
        answer:
          "მაშინვე წაიყვანეთ ვეტერინართან ან ველური ცხოველების დახმარების ცენტრში: Wildlife Aid Foundation-ის მიხედვით, კოცონში დაშავებულ ზღარბს დაუყოვნებლივ სჭირდება დახმარება. შემდეგში ფოთლებისა და ტოტების გროვა დაწვამდე შეამოწმეთ.",
        question: "რა ვქნა, თუ ზღარბი კოცონში დაშავდა?",
      },
      {
        answer:
          "მხოლოდ მაშინ, თუ დახმარება სჭირდება. ამ დროს British Hedgehog Preservation Society გირჩევთ, ყუთში ვეტერინარამდე სუფთა წყალი და კატის ან ძაღლის ხორციანი საკვები ჩადოთ. ჯანმრთელ ზღარბს თავი დაანებეთ.",
        question: "ზღარბს წყალი ან საკვები მივცე?",
      },
      {
        answer:
          "მხოლოდ მაშინ, თუ დახმარება სჭირდება. ეკლებისგან ხელის დასაცავად ჩაიცვით ბაღის ხელთათმანი ან გამოიყენეთ დაკეცილი პირსახოცი. ჯანმრთელ ზღარბს ხელს ნუ ახლებთ.",
        question: "შეიძლება ზღარბის ხელით აყვანა?",
      },
      {
        answer:
          "ბრიტანული ორგანიზაციები შემოდგომასა და ზამთარში პატარა ზღარბს რისკის ქვეშ მყოფად მიიჩნევენ: British Hedgehog Preservation Society 450 გ-ზე მსუბუქ ახალგაზრდა ზღარბს მოწყვლადს უწოდებს, Wildlife Aid Foundation კი ამბობს, რომ 600 გ-ზე მსუბუქი ზღარბი ველური ცხოველების ცენტრში უნდა მოხვდეს. ეს ციფრები გაერთიანებული სამეფოდანაა; ჰკითხეთ ვეტერინარს.",
        question: "რა ვქნა, თუ ზამთარში ძალიან პატარა ზღარბი ვიპოვე?",
      },
    ],
    intro:
      "ზამთარში ნაპოვნ ზღარბს ხშირად ზამთრის ძილი აქვს და თქვენგან არაფერი სჭირდება. მას კარგი განზრახვაც შეიძლება ავნოს: რძე, პური ან ჯანმრთელი ცხოველის სახლში წაყვანა. ჯერ გაარკვიეთ, ბუდეში სძინავს თუ ღია ადგილას, შეუძლოდ არის.",
    metaTitle: "ზამთარში ნაპოვნი ზღარბი: რა ვქნა?",
    sections: [
      {
        heading: "ზამთარში ზღარბი ვიპოვე — რა ვქნა?",
        paragraphs: [
          "ჯერ დააკვირდით, სად არის და როგორ იქცევა. ფოთლების გროვაში, შეშის ქვეშ ან სხვა დაცულ ადგილას შეკრულ, უმოძრაო ზღარბს, დიდი ალბათობით, ზამთრის ძილი აქვს: ისევ დააფარეთ და თავი დაანებეთ.",
          "თუ ის დღისით ღია ადგილასაა, ბარბაცებს, დაშავებულია ან ბუზები ხვევია, დახმარება სჭირდება: ხელი დაიცავით, ჩასვით ყუთში და დაუკავშირდით ვეტერინარს.",
          "ზამთარში ნაპოვნ ზღარბს კარგი განზრახვაც შეიძლება ავნოს. რძე და პური არასდროს მისცეთ და ჯანმრთელ ზღარბს სახლში ნუ წაიყვანთ. სახეობაზე მეტი მის პროფილზეა: [ევროპული ზღარბი](erinaceus-concolor).",
        ],
      },
      {
        heading: "რას ნიშნავს ის, რასაც ხედავთ?",
        paragraphs: [
          "ცხრილში ყველაზე ხშირი სიტუაციებია. თითოეული დეტალურად ქვემოთაა ახსნილი.",
        ],
        table: {
          headers: ["რას ხედავთ", "რას ნიშნავს", "რა ვქნათ"],
          rows: [
            [
              "შეკრული, უმოძრაო ზღარბი ფოთლებში ან შეშის ქვეშ",
              "დიდი ალბათობით, ზამთრის ძილი აქვს",
              "ფრთხილად ისევ დააფარეთ ფოთლები და წადით",
            ],
            [
              "ზღარბი დღისით, ღია ადგილას",
              "შეიძლება ავად ან დაშავებული იყოს",
              "აიყვანეთ ხელთათმანით, ჩასვით ყუთში, დაურეკეთ ვეტერინარს",
            ],
            [
              "ბარბაცებს, წრეზე დადის ან ბუზები ხვევია",
              "სასწრაფოდ სჭირდება დახმარება",
              "რაც შეიძლება მალე მიიყვანეთ ვეტერინართან",
            ],
            [
              "ზღარბი ღამით ან თბილ ზამთრის დღეს დადის",
              "ზამთარში ზღარბი ზოგჯერ ბუდეს იცვლის",
              "შორიდან დააკვირდით და ხელს ნუ ახლებთ",
            ],
          ],
        },
      },
      {
        heading: "ზამთრის ძილშია თუ მკვდარია?",
        image: "curled",
        paragraphs: [
          "ზამთრის ძილში მყოფი ზღარბი შეიძლება უსიცოცხლოდ გამოიყურებოდეს. British Hedgehog Preservation Society-ის მიხედვით, ამ დროს მისი სუნთქვა თითქმის ჩერდება — დაახლოებით ერთი ჩასუნთქვა რამდენიმე წუთში, სხეულის ტემპერატურა კი შეიძლება 10°C-მდე ან უფრო დაბლა დაეცეს. ამიტომ ცივი, უმოძრაო ზღარბი აუცილებლად მკვდარი არ არის.",
          "შესამოწმებლად ნუ ჩხვლეტთ და ნუ ამოთხრით. თუ ის დაცულ ბუდეში წევს, ისევ დააფარეთ და დატოვეთ. თუ ღია ადგილას, დაშავებული ან უჩვეულო ადგილას წევს, მოექეცით როგორც ზღარბს, რომელსაც დახმარება სჭირდება.",
        ],
      },
      {
        heading: "რომელი ზღარბი ცხოვრობს საქართველოში?",
        image: "tbilisi",
        paragraphs: [
          "საქართველოს ზღარბი თეთრმკერდა ზღარბია (Erinaceus concolor); საქართველოს მწერიჭამიების 2023 წლის ჩამონათვალში სხვა ზღარბი არ არის. ქართულად მას ხშირად „ევროპულ ზღარბს“ უწოდებენ, თუმცა დასავლეთევროპული ზღარბი (Erinaceus europaeus) საქართველოში არ ბინადრობს.",
          "ზამთარში ზღარბის მოვლის პრაქტიკული რჩევების უმეტესობა ბრიტანული ორგანიზაციებისაა და დასავლეთევროპული ზღარბისთვის, ახლო მონათესავე სახეობისთვის, დაიწერა. გამოიყენეთ ზოგად სახელმძღვანელოდ: საქართველოსთვის ზამთრის ძილის ზუსტ თვეებსა და წონებს ჩვენი წყაროები არ ასახელებენ.",
        ],
      },
      {
        heading: "რატომ შეიძლება ზამთარში ზღარბი გარეთ ნახოთ?",
        image: "night",
        paragraphs: [
          "British Hedgehog Preservation Society-ის მიხედვით, ზამთრის ძილის დროს ზღარბები ხშირად იღვიძებენ, მაგრამ ბუდეს იშვიათად ტოვებენ; თუ ბუდე ძალიან გაცივდა, შეიძლება ახალი ააშენონ. გაღვიძება შეიძლება შეწუხებამ ან მოულოდნელმა დათბობამაც გამოიწვიოს.",
          "Hedgehog Street აღნიშნავს, რომ ზამთარში თითოეული ზღარბი ბუდეს, სავარაუდოდ, ერთხელ მაინც იცვლის, ამიტომ ზოგჯერ გარეთ ჩანს, ხოლო რბილ ზამთარში ზღარბები ნოემბერ-დეკემბრამდე შეიძლება აქტიურები იყვნენ.",
          "დღისით გარეთ მყოფი ზღარბი სხვა საქმეა. Wildlife Aid Foundation-ის მიხედვით, თუ თბილი ზამთრის დღე არ არის ან მდედრი მაკე არ არის, ეს თითქმის ნამდვილად ნიშნავს, რომ რაღაც ცუდადაა.",
        ],
      },
      {
        heading: "როდის სჭირდება ზღარბს დახმარება?",
        list: {
          items: [
            "მოდუნებულია ან ღია ადგილას წევს.",
            "ბარბაცებს, ტორტმანებს ან წრეზე დადის.",
            "მზეზე წევს და სძინავს.",
            "ბუზები ხვევია ან დაშავებულია.",
            "სადმე გაიჭედა, მაგალითად ბადეში ან ორმოში.",
            "დღისით დადის.",
            "ზამთრისთვის ძალიან პატარაა: British Hedgehog Preservation Society 450 გ-ზე მსუბუქ ახალგაზრდა ზღარბს მოწყვლადს უწოდებს, Wildlife Aid Foundation კი ამბობს, რომ 600 გ-ზე მსუბუქი ზღარბი ველური ცხოველების ცენტრში უნდა მოხვდეს.",
          ],
        },
        paragraphs: [
          "ამ ნიშნებს British Hedgehog Preservation Society და Wildlife Aid Foundation ასახელებენ. თუ ერთ-ერთს მაინც ხედავთ, ზღარბს დახმარება სჭირდება.",
        ],
      },
      {
        heading: "რა ვქნა, თუ ზამთრის ძილში მყოფი ზღარბი შევაწუხე?",
        list: {
          items: [
            "იმ ადგილას მუშაობა შეწყვიტეთ.",
            "ფრთხილად დააბრუნეთ ფოთლები ან ბუდის მასალა ზღარბზე.",
            "ზღარბი სხვა ადგილას ნუ გადაიყვანთ.",
            "სახლში, ფარდულში ან ავტოფარეხში ნუ წაიყვანთ.",
            "ეს ადგილი ზამთრის ბოლომდე დატოვეთ და მას ნუ მიუახლოვდებით.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Hedgehog Street აფრთხილებს, რომ ზამთრის ძილის დროს ნებისმიერი შეწუხება შეიძლება ძალიან საშიში იყოს. Wildlife Aid Foundation არ გირჩევთ ზამთრის ძილში მყოფი ან დაძინებისთვის მზად მყოფი ზღარბის გადაყვანას, ხოლო გახსნილ ბუდეს სწრაფად ისევ დაფარვას გირჩევთ.",
        ],
      },
      {
        heading: "როგორ დავეხმაროთ ავად მყოფ ან დაშავებულ ზღარბს?",
        list: {
          items: [
            "ბაღის ხელთათმანით ან დაკეცილი პირსახოცით დაიცავით ხელი და აიყვანეთ ზღარბი.",
            "ჩასვით მაღალკედლიან ყუთში, რომლის ძირზეც ძველი პირსახოცი ან ფლისია, რომ დაიმალოს.",
            "ცხელი წყლის ბოთლი პირსახოცში გაახვიეთ და ყუთში ჩადეთ ისე, რომ ზღარბს მისგან მოშორების ადგილი ჰქონდეს. ბოთლი თბილი შეინარჩუნეთ: გაცივებული ბოთლი მდგომარეობას აუარესებს.",
            "ყუთი მშვიდ ადგილას დადგით.",
            "ჩაუდეთ სუფთა წყალი და კატის ან ძაღლის ხორციანი საკვები. რძე და პური — არასდროს.",
            "რაც შეიძლება მალე დაუკავშირდით ვეტერინარს. თუ ზღარბს აშკარად ტკივა, მაშინვე წაიყვანეთ ვეტერინართან.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ეს ნაბიჯები British Hedgehog Preservation Society-ის პირველი დახმარების რჩევებს მიჰყვება. ისინი მხოლოდ იმ დრომდეა, სანამ ზღარბს ვეტერინარი ნახავს.",
        ],
      },
      {
        heading: "რატომ არ შეიძლება რძე და პური?",
        paragraphs: [
          "RSPCA-ს მიხედვით, ზღარბს ლაქტოზა არ ითვისება, ამიტომ რძე მას არასდროს უნდა მისცეთ. პური კი მისთვის საკვებად ვარგისი არ არის.",
          "Wildlife Aid Foundation აფრთხილებს, რომ პური და რძე ამ ხორცისმჭამელი ძუძუმწოვრისთვის ჯანსაღი საკვები არ არის და ზღარბისთვის შეიძლება ფატალური აღმოჩნდეს. ის მიწის თხილსა და ფქვილის ჭიებსაც არ გირჩევთ.",
        ],
      },
      {
        heading: "რატომ არ უნდა წავიყვანოთ ჯანმრთელი ზღარბი სახლში?",
        paragraphs: [
          "British Hedgehog Preservation Society არ გირჩევთ ჯანმრთელი ზღარბის ზამთარში ფარდულში ან ავტოფარეხში შენახვას სიცივისგან დასაცავად.",
          "სითბო ზამთრის ძილში მყოფ ზღარბს არ შველის: იმავე ორგანიზაციის მიხედვით, დაახლოებით 10°C-ზე ის ცხიმის მარაგს ორჯერ უფრო სწრაფად ხარჯავს, ვიდრე ოპტიმალურ, დაახლოებით 4°C-ზე. გარდა ამისა, ველური ზღარბი შინაური ცხოველი არ არის; თუ ჯანმრთელია, იქვე დატოვეთ.",
        ],
      },
      {
        heading: "როგორ დავიცვათ ზღარბი ბაღში შემოდგომით და ზამთარში?",
        list: {
          items: [
            "ფოთლების ან ტოტების გროვის დაწვამდე შეამოწმეთ ის: RSPCA აფრთხილებს, რომ ზღარბი შეიძლება კოცონისთვის დაგროვებულ გროვაში დაბუდდეს.",
            "ფოთლებისა და შეშის გროვები დატოვეთ: სწორედ მათში აშენებს ზღარბი ზამთრის ბუდეს.",
            "ფრთხილად იყავით ტრიმერით, გაზონის საკრეჭითა და ფიწალით: Wildlife Aid Foundation მათგან მძიმე დაზიანებებს ხედავს.",
            "თუ ზღარბი ბადეში გაიხლართა, ბადე მის გარშემო ფრთხილად გაჭერით და ზღარბი ვეტერინართან ან ველური ცხოველების დახმარების ცენტრში მიიყვანეთ.",
          ],
        },
        paragraphs: [
          "RSPCA და Wildlife Aid Foundation შემოდგომისა და ზამთრის ბაღის სამუშაოებისას ზღარბისთვის ამ საფრთხეებს ასახელებენ.",
        ],
      },
    ],
    summary:
      "ზამთარში ნაპოვნ ზღარბს ჯერ დააკვირდით. თუ ფოთლებში ან შეშის ქვეშ შეკრული სძინავს, ისევ დააფარეთ და დატოვეთ. თუ დღისით ღია ადგილასაა, ბარბაცებს, დაშავებულია ან ბუზები ხვევია, ხელთათმანით ჩასვით ყუთში პირსახოცსა და თბილ ბოთლთან, მიეცით წყალი და დაუკავშირდით ვეტერინარს. რძე და პური არასდროს მისცეთ და ჯანმრთელ ზღარბს სახლში ნუ წაიყვანთ.",
    title: "ზამთარში ნაპოვნი ზღარბი: რა ვქნა?",
  },
  ru: {
    description:
      "Нашли ежа в саду зимой? Как понять, спит ли он зимним сном или ему нужна помощь, как безопасно его взять и почему молоко и хлеб могут ему навредить.",
    faq: [
      {
        answer:
          "Да. С похолоданием ежи впадают в зимнюю спячку. По данным British Hedgehog Preservation Society, сроки зависят от погоды; в Британии спячка обычно начинается с ноября по январь. Точных месяцев для Грузии наши источники не называют.",
        question: "Ежи впадают в зимнюю спячку?",
      },
      {
        answer:
          "Сразу отвезите его к ветеринару или в центр помощи диким животным: по данным Wildlife Aid Foundation, ежу, пострадавшему в костре, помощь нужна немедленно. В следующий раз проверяйте кучи листьев и веток перед сжиганием.",
        question: "Что делать, если ёж пострадал в костре?",
      },
      {
        answer:
          "Только если ему нужна помощь. Тогда British Hedgehog Preservation Society советует до визита к ветеринару поставить в коробку свежую воду и мясной корм для кошек или собак. Здорового ежа оставьте в покое.",
        question: "Давать ли ежу воду или еду?",
      },
      {
        answer:
          "Только если ему нужна помощь. Защитите руки от иголок садовыми перчатками или сложенным полотенцем. Здорового ежа не трогайте.",
        question: "Можно ли брать ежа в руки?",
      },
      {
        answer:
          "Британские организации считают маленького ежа осенью и зимой в группе риска: British Hedgehog Preservation Society называет уязвимыми молодых ежей легче 450 г, а Wildlife Aid Foundation говорит, что ежа легче 600 г нужно доставить в центр помощи диким животным. Эти цифры из Великобритании; спросите ветеринара.",
        question: "Что делать, если зимой нашли очень маленького ежа?",
      },
    ],
    intro:
      "Ёж, найденный зимой, часто просто спит зимним сном, и ему ничего от вас не нужно. Навредить ему могут и добрые намерения: молоко, хлеб или перенос здорового животного в дом. Сначала поймите, спит ли он в гнезде или ему плохо на открытом месте.",
    metaTitle: "Нашли ежа зимой: что делать?",
    sections: [
      {
        heading: "Зимой я нашёл ежа. Что делать?",
        paragraphs: [
          "Сначала посмотрите, где он и как себя ведёт. Свернувшийся неподвижный ёж в куче листьев, под дровами или в другом укрытии, скорее всего, спит зимним сном: снова укройте его и оставьте в покое.",
          "Если он днём на открытом месте, шатается, ранен или вокруг него вьются мухи, ему нужна помощь: защитите руки, посадите его в коробку и свяжитесь с ветеринаром.",
          "Ежу, найденному зимой, могут навредить и добрые намерения. Никогда не давайте ему молоко или хлеб и не забирайте здорового ежа в дом. Подробнее о виде — в его профиле: [южный белогрудый ёж](erinaceus-concolor).",
        ],
      },
      {
        heading: "Что значит то, что вы видите?",
        paragraphs: [
          "В таблице — самые частые ситуации. Каждая подробно разобрана ниже.",
        ],
        table: {
          headers: ["Что вы видите", "Что это значит", "Что делать"],
          rows: [
            [
              "Свернувшийся неподвижный ёж в листьях или под дровами",
              "Скорее всего, он в зимней спячке",
              "Осторожно снова укройте листьями и уйдите",
            ],
            [
              "Ёж днём на открытом месте",
              "Он может быть болен или ранен",
              "Возьмите в перчатках, посадите в коробку, позвоните ветеринару",
            ],
            [
              "Шатается, ходит кругами или вокруг вьются мухи",
              "Помощь нужна срочно",
              "Как можно скорее отвезите к ветеринару",
            ],
            [
              "Ёж ходит ночью или в тёплый зимний день",
              "Зимой ежи иногда меняют гнездо",
              "Наблюдайте издалека и не трогайте",
            ],
          ],
        },
      },
      {
        heading: "Ёж в спячке или мёртв?",
        image: "curled",
        paragraphs: [
          "Ёж в зимней спячке может выглядеть безжизненным. По данным British Hedgehog Preservation Society, во время спячки дыхание почти останавливается — примерно один вдох за несколько минут, а температура тела может упасть до 10°C и ниже. Поэтому холодный неподвижный ёж не обязательно мёртв.",
          "Не тыкайте его и не выкапывайте, чтобы проверить. Если он лежит в укрытом гнезде, снова укройте его и оставьте. Если он лежит на открытом месте, ранен или находится в необычном месте, считайте, что ему нужна помощь.",
        ],
      },
      {
        heading: "Какой ёж живёт в Грузии?",
        image: "tbilisi",
        paragraphs: [
          "В Грузии живёт южный белогрудый ёж (Erinaceus concolor); в перечне насекомоядных Грузии 2023 года других ежей нет. По-грузински его часто называют «европейским ежом», хотя западноевропейский ёж (Erinaceus europaeus) в Грузии не обитает.",
          "Большая часть практических советов о ежах зимой исходит от британских организаций и написана для западноевропейского ежа — близкого вида. Используйте их как общие рекомендации: точных месяцев спячки и веса для Грузии наши источники не называют.",
        ],
      },
      {
        heading: "Почему зимой ежа можно увидеть снаружи?",
        image: "night",
        paragraphs: [
          "По данным British Hedgehog Preservation Society, во время спячки ежи часто просыпаются, но редко покидают гнездо; если гнездо слишком остыло, они могут построить новое. Разбудить их может и беспокойство или неожиданное потепление.",
          "Hedgehog Street отмечает, что за зиму каждый ёж, скорее всего, хотя бы раз меняет гнездо, поэтому его иногда можно увидеть снаружи, а в мягкие зимы ежи могут оставаться активными до ноября и декабря.",
          "Ёж, гуляющий днём, — другое дело. По данным Wildlife Aid Foundation, если это не тёплый зимний день и не беременная самка, это почти наверняка значит, что что-то не так.",
        ],
      },
      {
        heading: "Когда ежу нужна помощь?",
        list: {
          items: [
            "Он вялый или лежит на открытом месте.",
            "Он шатается, спотыкается или ходит кругами.",
            "Он лежит и спит на солнце.",
            "Вокруг него вьются мухи, или он ранен.",
            "Он застрял, например в сетке или яме.",
            "Он ходит днём.",
            "Он выглядит очень маленьким для зимы: British Hedgehog Preservation Society называет уязвимыми молодых ежей легче 450 г, а Wildlife Aid Foundation говорит, что ежа легче 600 г нужно доставить в центр помощи диким животным.",
          ],
        },
        paragraphs: [
          "Эти признаки называют British Hedgehog Preservation Society и Wildlife Aid Foundation. Если вы видите хотя бы один из них, ежу нужна помощь.",
        ],
      },
      {
        heading: "Что делать, если вы потревожили ежа в спячке?",
        list: {
          items: [
            "Прекратите работать на этом месте.",
            "Осторожно верните листья или материал гнезда на ежа.",
            "Не переносите его в другое место.",
            "Не забирайте его в дом, сарай или гараж.",
            "Оставьте это место и не подходите к нему до конца зимы.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Hedgehog Street предупреждает, что любое беспокойство во время спячки может быть крайне опасным. Wildlife Aid Foundation не советует переносить ежа, который спит или готовится к спячке, а раскрытое гнездо советует как можно быстрее снова укрыть.",
        ],
      },
      {
        heading: "Как помочь больному или раненому ежу?",
        list: {
          items: [
            "Защитите руки садовыми перчатками или сложенным полотенцем и возьмите ежа.",
            "Посадите его в коробку с высокими стенками, на дно положите старое полотенце или флис, чтобы он мог спрятаться.",
            "Заверните грелку в полотенце и положите в коробку так, чтобы ёж мог от неё отойти. Следите, чтобы грелка оставалась тёплой: остывшая только навредит.",
            "Поставьте коробку в тихое место.",
            "Дайте свежую воду и мясной корм для кошек или собак. Молоко и хлеб — никогда.",
            "Как можно скорее свяжитесь с ветеринаром. Если ежу явно больно, сразу везите его к ветеринару.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Эти шаги следуют советам по первой помощи British Hedgehog Preservation Society. Они нужны только до того, как ежа осмотрит ветеринар.",
        ],
      },
      {
        heading: "Почему нельзя молоко и хлеб?",
        paragraphs: [
          "По данным RSPCA, ежи не переносят лактозу, поэтому молоко им давать нельзя никогда. Хлеб же не подходит им как пища.",
          "Wildlife Aid Foundation предупреждает, что хлеб и молоко — нездоровая еда для этого плотоядного млекопитающего и могут быть смертельны для ежа. Не советует она и арахис, и мучных червей.",
        ],
      },
      {
        heading: "Почему не стоит забирать здорового ежа домой?",
        paragraphs: [
          "British Hedgehog Preservation Society не рекомендует держать здоровых ежей зимой в сарае или гараже, чтобы защитить их от холода.",
          "Тепло не помогает ежу в спячке: по данным той же организации, при температуре около 10°C он расходует жировые запасы вдвое быстрее, чем при оптимальных примерно 4°C. Кроме того, дикий ёж — не домашнее животное; если он здоров, оставьте его на месте.",
        ],
      },
      {
        heading: "Как защитить ежа в саду осенью и зимой?",
        list: {
          items: [
            "Перед тем как сжечь кучу листьев или веток, проверьте её: RSPCA предупреждает, что ежи могут устроить гнездо в куче для костра.",
            "Оставляйте кучи листьев и дров: именно в них ёж строит зимнее гнездо.",
            "Будьте осторожны с триммером, газонокосилкой и садовыми вилами: Wildlife Aid Foundation видит от них тяжёлые травмы.",
            "Если ёж запутался в сетке, аккуратно разрежьте сетку вокруг него и отвезите ежа к ветеринару или в центр помощи диким животным.",
          ],
        },
        paragraphs: [
          "RSPCA и Wildlife Aid Foundation называют эти опасности для ежей во время осенних и зимних работ в саду.",
        ],
      },
    ],
    summary:
      "Сначала присмотритесь к ежу, найденному зимой. Если он свернулся и спит в листьях или под дровами, снова укройте его и оставьте. Если он днём на открытом месте, шатается, ранен или вокруг вьются мухи, возьмите его в перчатках, посадите в коробку с полотенцем и тёплой грелкой, дайте воды и свяжитесь с ветеринаром. Никогда не давайте молоко и хлеб и не забирайте здорового ежа домой.",
    title: "Нашли ежа зимой: что делать?",
  },
  tr: {
    description:
      "Kışın bahçede bir kirpi mi buldunuz? Kış uykusunda mı yoksa yardıma mı ihtiyacı var, onu nasıl güvenle alırsınız ve süt ile ekmek neden zarar verebilir?",
    faq: [
      {
        answer:
          "Evet. Havalar soğuyunca kirpiler kış uykusuna yatar. British Hedgehog Preservation Society'ye göre zamanlama havaya bağlıdır; Britanya'da kış uykusu genellikle kasım ile ocak arasında başlar. Kaynaklarımız Gürcistan için kesin aylar vermiyor.",
        question: "Kirpiler kış uykusuna yatar mı?",
      },
      {
        answer:
          "Hemen bir veterinere veya yaban hayatı kurtarma merkezine götürün: Wildlife Aid Foundation'a göre şenlik ateşinde yaralanan bir kirpinin hemen yardıma ihtiyacı vardır. Bir dahaki sefere yaprak ve dal yığınlarını yakmadan önce kontrol edin.",
        question: "Kirpi şenlik ateşinde yaralandıysa ne yapmalı?",
      },
      {
        answer:
          "Yalnızca yardıma ihtiyacı varsa. O zaman British Hedgehog Preservation Society, veterinere ulaşana kadar kutuya taze su ve etli kedi ya da köpek maması koymayı önerir. Sağlıklı bir kirpiyi kendi hâline bırakın.",
        question: "Kirpiye su veya yiyecek vermeli miyim?",
      },
      {
        answer:
          "Yalnızca yardıma ihtiyacı varsa. Ellerinizi dikenlerden korumak için bahçe eldiveni takın veya katlanmış bir havlu kullanın. Sağlıklı bir kirpiye dokunmayın.",
        question: "Kirpiyi elle alabilir miyim?",
      },
      {
        answer:
          "Britanya'daki kuruluşlar sonbahar ve kışta küçük bir kirpiyi risk altında sayar: British Hedgehog Preservation Society 450 g'dan hafif genç kirpileri savunmasız olarak tanımlar, Wildlife Aid Foundation ise 600 g'dan hafif bir kirpinin yaban hayatı merkezine götürülmesi gerektiğini söyler. Bu rakamlar Birleşik Krallık'tan; bir veterinere danışın.",
        question: "Kışın çok küçük bir kirpi bulursam ne yapmalıyım?",
      },
    ],
    intro:
      "Kışın bulunan bir kirpi çoğu zaman kış uykusundadır ve sizden bir şeye ihtiyacı yoktur. İyi niyet bile ona zarar verebilir: süt, ekmek ya da sağlıklı bir hayvanı eve götürmek. Önce yuvasında mı uyuyor, yoksa açıkta mı ve iyi değil mi, bunu anlayın.",
    metaTitle: "Kışın kirpi buldum: ne yapmalıyım?",
    sections: [
      {
        heading: "Kışın bir kirpi buldum. Ne yapmalıyım?",
        paragraphs: [
          "Önce nerede olduğuna ve nasıl davrandığına bakın. Yaprak yığınında, odunların altında veya başka korunaklı bir yerde top olmuş, hareketsiz bir kirpi büyük olasılıkla kış uykusundadır: üzerini yeniden örtün ve onu rahat bırakın.",
          "Gündüz açıktaysa, sendeliyorsa, yaralıysa veya etrafında sinekler varsa yardıma ihtiyacı vardır: ellerinizi koruyun, onu bir kutuya koyun ve bir veterinerle iletişime geçin.",
          "Kışın bulunan bir kirpiye iyi niyet bile zarar verebilir. Ona asla süt veya ekmek vermeyin ve sağlıklı bir kirpiyi eve götürmeyin. Tür hakkında daha fazlası profilinde: [güney beyaz göğüslü kirpi](erinaceus-concolor).",
        ],
      },
      {
        heading: "Gördükleriniz ne anlama gelir?",
        paragraphs: [
          "Tabloda en sık karşılaşılan durumlar var. Her biri aşağıda ayrıntılı olarak açıklanıyor.",
        ],
        table: {
          headers: ["Ne görüyorsunuz", "Ne anlama gelir", "Ne yapmalı"],
          rows: [
            [
              "Yapraklarda veya odun altında top olmuş, hareketsiz kirpi",
              "Büyük olasılıkla kış uykusunda",
              "Üzerini dikkatlice yine yaprakla örtün ve uzaklaşın",
            ],
            [
              "Gündüz, açık alanda bir kirpi",
              "Hasta veya yaralı olabilir",
              "Eldivenle alın, kutuya koyun, veterineri arayın",
            ],
            [
              "Sendeliyor, daireler çiziyor veya etrafında sinekler var",
              "Acil yardıma ihtiyacı var",
              "En kısa sürede veterinere götürün",
            ],
            [
              "Gece veya ılık bir kış gününde dolaşan kirpi",
              "Kirpiler kışın bazen yuva değiştirir",
              "Uzaktan izleyin ve dokunmayın",
            ],
          ],
        },
      },
      {
        heading: "Kış uykusunda mı, ölü mü?",
        image: "curled",
        paragraphs: [
          "Kış uykusundaki bir kirpi cansız görünebilir. British Hedgehog Preservation Society'ye göre kış uykusunda solunumu neredeyse durur, birkaç dakikada yaklaşık bir nefes, vücut sıcaklığı da 10°C'ye veya daha aşağıya düşebilir. Bu yüzden soğuk ve hareketsiz bir kirpi ölü olmayabilir.",
          "Kontrol etmek için dürtmeyin ve kazıp çıkarmayın. Korunaklı bir yuvada yatıyorsa üzerini yeniden örtün ve bırakın. Açıkta, yaralı veya alışılmadık bir yerde yatıyorsa, yardıma ihtiyacı olan bir kirpi gibi davranın.",
        ],
      },
      {
        heading: "Gürcistan'da hangi kirpi yaşar?",
        image: "tbilisi",
        paragraphs: [
          "Gürcistan'ın kirpisi güney beyaz göğüslü kirpidir (Erinaceus concolor); Gürcistan böcekçillerinin 2023 listesinde başka kirpi yoktur. Gürcücede ona sıklıkla “Avrupa kirpisi” denir, ancak Batı Avrupa kirpisi (Erinaceus europaeus) Gürcistan'da yaşamaz.",
          "Kışın kirpilerle ilgili pratik önerilerin çoğu Britanya'daki kuruluşlardan gelir ve yakın akraba bir tür olan Batı Avrupa kirpisi için yazılmıştır. Bunları genel bir rehber olarak kullanın: kaynaklarımız Gürcistan için kesin kış uykusu ayları ve ağırlıklar vermiyor.",
        ],
      },
      {
        heading: "Kışın bir kirpiyi neden dışarıda görebilirsiniz?",
        image: "night",
        paragraphs: [
          "British Hedgehog Preservation Society'ye göre kirpiler kış uykusu sırasında sık sık uyanır ama yuvayı nadiren terk eder; yuva çok soğursa yeni bir tane yapabilirler. Rahatsız edilmek veya beklenmedik bir ısınma da onları uyandırabilir.",
          "Hedgehog Street, her kirpinin kış boyunca muhtemelen en az bir kez yuva değiştirdiğini, bu yüzden bazen dışarıda görülebildiğini ve ılık kışlarda kirpilerin kasım ve aralığa kadar aktif kalabildiğini belirtir.",
          "Gündüz dışarıda dolaşan bir kirpi ise başka bir durumdur. Wildlife Aid Foundation'a göre ılık bir kış günü değilse ya da gebe bir dişi değilse, bu neredeyse kesin bir sorun olduğu anlamına gelir.",
        ],
      },
      {
        heading: "Bir kirpinin ne zaman yardıma ihtiyacı vardır?",
        list: {
          items: [
            "Halsizse veya açıkta yatıyorsa.",
            "Sendeliyor, tökezliyor veya daireler çiziyorsa.",
            "Güneşte yatıp uyuyorsa.",
            "Etrafında sinekler varsa veya yaralıysa.",
            "Bir yere sıkışmışsa, örneğin bir ağa veya çukura.",
            "Gündüz dolaşıyorsa.",
            "Kış için çok küçük görünüyorsa: British Hedgehog Preservation Society 450 g'dan hafif genç kirpileri savunmasız olarak tanımlar, Wildlife Aid Foundation ise 600 g'dan hafif bir kirpinin yaban hayatı merkezine götürülmesi gerektiğini söyler.",
          ],
        },
        paragraphs: [
          "Bu işaretleri British Hedgehog Preservation Society ve Wildlife Aid Foundation sayar. Bunlardan birini bile görürseniz kirpinin yardıma ihtiyacı vardır.",
        ],
      },
      {
        heading: "Kış uykusundaki bir kirpiyi rahatsız ettiyseniz ne yapmalı?",
        list: {
          items: [
            "O noktadaki çalışmayı bırakın.",
            "Yaprakları veya yuva malzemesini dikkatlice kirpinin üzerine geri koyun.",
            "Onu başka bir yere taşımayın.",
            "Eve, kulübeye veya garaja götürmeyin.",
            "O noktayı kış sonuna kadar kendi hâline bırakın ve yaklaşmayın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Hedgehog Street, kış uykusu sırasında her türlü rahatsızlığın son derece tehlikeli olabileceği konusunda uyarır. Wildlife Aid Foundation, kış uykusundaki veya uykuya hazırlanan bir kirpinin taşınmamasını ve açılan bir yuvanın hızla yeniden örtülmesini önerir.",
        ],
      },
      {
        heading: "Hasta veya yaralı bir kirpiye nasıl yardım edilir?",
        list: {
          items: [
            "Ellerinizi bahçe eldiveni veya katlanmış bir havluyla koruyun ve kirpiyi alın.",
            "Saklanabilmesi için tabanına eski bir havlu veya polar konmuş, yüksek kenarlı bir kutuya koyun.",
            "Bir sıcak su torbasını havluya sarıp kutuya koyun; kirpinin ondan uzaklaşabileceği yer kalsın. Torbayı sıcak tutun: soğuyan torba durumu kötüleştirir.",
            "Kutuyu sessiz bir yere koyun.",
            "Taze su ve etli kedi ya da köpek maması verin. Süt ve ekmek asla.",
            "En kısa sürede bir veterinerle iletişime geçin. Kirpinin belirgin şekilde canı yanıyorsa hemen veterinere götürün.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Bu adımlar British Hedgehog Preservation Society'nin ilk yardım önerilerini izler. Yalnızca kirpiyi bir veteriner görene kadar geçerlidir.",
        ],
      },
      {
        heading: "Süt ve ekmek neden zararlıdır?",
        paragraphs: [
          "RSPCA'ya göre kirpiler laktozu sindiremez, bu yüzden onlara asla süt verilmemelidir. Ekmek ise onlar için besleyici değildir.",
          "Wildlife Aid Foundation, ekmek ve sütün bu etçil memeli için sağlıklı bir besin olmadığı ve kirpiler için ölümcül olabileceği konusunda uyarır. Yer fıstığı ve un kurdu da önermez.",
        ],
      },
      {
        heading: "Sağlıklı bir kirpi neden eve götürülmemeli?",
        paragraphs: [
          "British Hedgehog Preservation Society, sağlıklı kirpileri soğuktan korumak için kışın kulübe veya garajda tutmayı önermez.",
          "Sıcaklık kış uykusundaki kirpiye yardım etmez: aynı kuruluşa göre yaklaşık 10°C'de yağ depolarını, yaklaşık 4°C'lik en uygun sıcaklığa göre iki kat hızlı tüketir. Ayrıca yabani bir kirpi evcil hayvan değildir; sağlıklıysa olduğu yerde bırakın.",
        ],
      },
      {
        heading: "Sonbahar ve kışta bahçede kirpiler nasıl korunur?",
        list: {
          items: [
            "Bir yaprak veya dal yığınını yakmadan önce kontrol edin: RSPCA, kirpilerin şenlik ateşi için toplanan yığınlarda yuva yapabileceği konusunda uyarır.",
            "Yaprak ve odun yığınlarını yerinde bırakın: kirpi kış yuvasını tam olarak bunlarda yapar.",
            "Tırpan makinesi, çim biçme makinesi ve bahçe çatalıyla dikkatli olun: Wildlife Aid Foundation bunlardan kaynaklanan ağır yaralanmalar görür.",
            "Bir kirpi ağa takıldıysa ağı çevresinden dikkatlice kesin ve kirpiyi bir veterinere veya yaban hayatı kurtarma merkezine götürün.",
          ],
        },
        paragraphs: [
          "RSPCA ve Wildlife Aid Foundation, sonbahar ve kış bahçe işleri sırasında kirpiler için bu tehlikeleri sayar.",
        ],
      },
    ],
    summary:
      "Kışın bulduğunuz kirpiye önce dikkatle bakın. Yapraklarda veya odun altında top olup uyuyorsa üzerini yeniden örtün ve bırakın. Gündüz açıktaysa, sendeliyorsa, yaralıysa veya etrafında sinekler varsa eldivenle alıp havlu ve sıcak su torbası olan bir kutuya koyun, su verin ve bir veterinerle iletişime geçin. Asla süt veya ekmek vermeyin ve sağlıklı bir kirpiyi eve götürmeyin.",
    title: "Kışın kirpi buldum: ne yapmalıyım?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "British Hedgehog Preservation Society — Hedgehog First Aid Advice",
    supports: {
      en: "Signs a hedgehog needs help (lethargic, lying in the open, flies, wobbly, injured, trapped); gloves or a folded towel; a deep-sided box with a towel or fleece; a wrapped hot water bottle with room to move off it, kept warm; a quiet place; fresh water and meaty cat or dog food; a vet straight away if in obvious pain.",
      ka: "ნიშნები, რომ ზღარბს დახმარება სჭირდება (მოდუნება, ღია ადგილას წოლა, ბუზები, ბარბაცი, დაზიანება, გაჭედვა); ხელთათმანი ან დაკეცილი პირსახოცი; მაღალკედლიანი ყუთი პირსახოცით ან ფლისით; პირსახოცში გახვეული, თბილად შენარჩუნებული ცხელი წყლის ბოთლი, რომლისგანაც ზღარბს მოშორება შეუძლია; მშვიდი ადგილი; სუფთა წყალი და კატის ან ძაღლის ხორციანი საკვები; აშკარა ტკივილისას — მაშინვე ვეტერინართან.",
      ru: "Признаки, что ежу нужна помощь (вялость, лежит на открытом месте, мухи, шатается, ранен, застрял); перчатки или сложенное полотенце; коробка с высокими стенками и полотенцем или флисом; грелка в полотенце, от которой можно отойти, поддерживать тёплой; тихое место; свежая вода и мясной корм для кошек или собак; при явной боли — сразу к ветеринару.",
      tr: "Kirpinin yardıma ihtiyacı olduğunun işaretleri (halsizlik, açıkta yatma, sinekler, sendeleme, yara, sıkışma); eldiven veya katlanmış havlu; havlu veya polar serili yüksek kenarlı kutu; uzaklaşabileceği, sıcak tutulan, havluya sarılı sıcak su torbası; sessiz bir yer; taze su ve etli kedi ya da köpek maması; belirgin acıda hemen veteriner.",
    },
    url: "https://www.britishhedgehogs.org.uk/found-a-hedgehog/",
  },
  {
    name: "British Hedgehog Preservation Society — Hibernation",
    supports: {
      en: "Hibernation timing depends on temperature (usually starting November to January in Britain); hedgehogs wake often but rarely leave the nest and may build a new one; disturbance or warm weather can wake them; breathing about once every few minutes and body temperature down to 10°C or lower; young under 450 g vulnerable; keeping healthy hedgehogs in sheds or garages over winter discouraged; fat used twice as fast at 10°C as at 4°C.",
      ka: "ზამთრის ძილის ვადა ტემპერატურაზეა დამოკიდებული (ბრიტანეთში ჩვეულებრივ ნოემბრიდან იანვრამდე იწყება); ზღარბები ხშირად იღვიძებენ, მაგრამ ბუდეს იშვიათად ტოვებენ და შეიძლება ახალი ააშენონ; გაღვიძება შეიძლება შეწუხებამ ან დათბობამ გამოიწვიოს; ერთი ჩასუნთქვა რამდენიმე წუთში და სხეულის ტემპერატურა 10°C-მდე ან დაბლა; 450 გ-ზე მსუბუქი ახალგაზრდები მოწყვლადია; ჯანმრთელი ზღარბის ზამთარში ფარდულში ან ავტოფარეხში შენახვა რეკომენდებული არ არის; 10°C-ზე ცხიმი ორჯერ სწრაფად იხარჯება, ვიდრე 4°C-ზე.",
      ru: "Сроки спячки зависят от температуры (в Британии обычно начинается с ноября по январь); ежи часто просыпаются, но редко покидают гнездо и могут построить новое; разбудить их может беспокойство или потепление; один вдох за несколько минут и температура тела до 10°C и ниже; молодые легче 450 г уязвимы; держать здоровых ежей зимой в сарае или гараже не рекомендуется; при 10°C жир расходуется вдвое быстрее, чем при 4°C.",
      tr: "Kış uykusu zamanlaması sıcaklığa bağlıdır (Britanya'da genellikle kasım–ocak arasında başlar); kirpiler sık uyanır ama yuvayı nadiren terk eder ve yeni yuva yapabilir; rahatsızlık veya ısınma onları uyandırabilir; birkaç dakikada bir nefes ve 10°C'ye veya altına düşen vücut sıcaklığı; 450 g'dan hafif gençler savunmasızdır; sağlıklı kirpileri kışın kulübe veya garajda tutmak önerilmez; yağ 10°C'de 4°C'ye göre iki kat hızlı harcanır.",
    },
    url: "https://www.britishhedgehogs.org.uk/hibernation/",
  },
  {
    name: "RSPCA — Hedgehogs",
    supports: {
      en: "A hedgehog seen in daytime may be sick or injured; in winter keep an eye in case hibernation was disturbed; never give milk (hedgehogs are lactose intolerant) or bread (not nutritious); hibernation nests in leaf or log piles; check bonfires before lighting.",
      ka: "დღისით დანახული ზღარბი შეიძლება ავად ან დაშავებული იყოს; ზამთარში თვალი ადევნეთ, ხომ არ შეწუხდა ზამთრის ძილი; რძე არასდროს (ზღარბს ლაქტოზა არ ითვისება) და არც პური (არასაკვები); ზამთრის ბუდე ფოთლებისა და შეშის გროვებში; კოცონის დანთებამდე შემოწმება.",
      ru: "Ёж, замеченный днём, может быть болен или ранен; зимой следите, не потревожена ли спячка; никогда молоко (ежи не переносят лактозу) и хлеб (не питателен); зимние гнёзда в кучах листьев и дров; проверять кучи перед костром.",
      tr: "Gündüz görülen kirpi hasta veya yaralı olabilir; kışın kış uykusunun bozulup bozulmadığına dikkat edin; asla süt (kirpiler laktozu sindiremez) ve ekmek (besleyici değil); kış yuvaları yaprak ve odun yığınlarında; şenlik ateşinden önce kontrol.",
    },
    url: "https://www.rspca.org.uk/adviceandwelfare/wildlife/hedgehogs",
  },
  {
    name: "Wildlife Aid Foundation — Helping Hedgehogs",
    supports: {
      en: "A hedgehog out in daylight (unless pregnant or on a warm winter day) almost certainly has a problem; asleep in the sun, staggering or circling needs a rescue centre; under 600 g must go to a wildlife centre; do not move hibernating hedgehogs; cover an uncovered nest back up; bread and milk can be fatal; no peanuts or mealworms; injuries from strimmers, mowers and forks; cut netting free and take the hedgehog to a rescue; a hedgehog hurt in a bonfire must go to a rescue or vet immediately.",
      ka: "დღისით გარეთ მყოფ ზღარბს (თუ მაკე არ არის და თბილი ზამთრის დღე არ არის) თითქმის ნამდვილად აქვს პრობლემა; მზეზე მძინარე, ბარბაცა ან წრეზე მოსიარულე ზღარბს ცენტრი სჭირდება; 600 გ-ზე მსუბუქი ცენტრში უნდა მოხვდეს; ზამთრის ძილში მყოფი ზღარბის გადაყვანა არ შეიძლება; გახსნილი ბუდე ისევ დაფარეთ; პური და რძე შეიძლება ფატალური იყოს; არც მიწის თხილი და ფქვილის ჭია; დაზიანებები ტრიმერით, საკრეჭითა და ფიწალით; ბადის გაჭრა და ცენტრში წაყვანა; კოცონში დაშავებული ზღარბი დაუყოვნებლივ ცენტრში ან ვეტერინართან უნდა მიიყვანოთ.",
      ru: "Ёж днём (если это не беременная самка и не тёплый зимний день) почти наверняка в беде; спящий на солнце, шатающийся или ходящий кругами ёж нуждается в центре помощи; ежа легче 600 г нужно доставить в центр; не переносить ежа в спячке; раскрытое гнездо снова укрыть; хлеб и молоко могут быть смертельны; не давать арахис и мучных червей; травмы от триммеров, косилок и вил; разрезать сетку и отвезти в центр; ежа, пострадавшего в костре, немедленно везти в центр или к ветеринару.",
      tr: "Gündüz dışarıdaki kirpinin (gebe değilse veya ılık bir kış günü değilse) neredeyse kesin bir sorunu vardır; güneşte uyuyan, sendeleyen veya daire çizen kirpi bir merkeze gitmeli; 600 g'dan hafif olan merkeze götürülmeli; kış uykusundaki kirpi taşınmamalı; açılan yuva yeniden örtülmeli; ekmek ve süt ölümcül olabilir; yer fıstığı ve un kurdu yok; tırpan, biçme makinesi ve çatal yaralanmaları; ağı kesip merkeze götürme; şenlik ateşinde yaralanan kirpi hemen bir merkeze veya veterinere götürülmeli.",
    },
    url: "https://wildlifeaid.org.uk/wildlife-advice/helping-hedgehogs/",
  },
  {
    name: "Hedgehog Street (BHPS and PTES) — Hibernation",
    supports: {
      en: "Any disturbance during hibernation can be extremely dangerous; each hedgehog is likely to move nest at least once in winter and may be seen out; in mild winters hedgehogs can stay active into November and December.",
      ka: "ზამთრის ძილის დროს ნებისმიერი შეწუხება შეიძლება ძალიან საშიში იყოს; ზამთარში თითოეული ზღარბი, სავარაუდოდ, ერთხელ მაინც იცვლის ბუდეს და შეიძლება გარეთ გამოჩნდეს; რბილ ზამთარში ზღარბები ნოემბერ-დეკემბრამდე შეიძლება აქტიურები იყვნენ.",
      ru: "Любое беспокойство во время спячки может быть крайне опасным; за зиму каждый ёж, скорее всего, хотя бы раз меняет гнездо и может появиться снаружи; в мягкие зимы ежи могут оставаться активными до ноября и декабря.",
      tr: "Kış uykusu sırasında her türlü rahatsızlık son derece tehlikeli olabilir; her kirpi kışın muhtemelen en az bir kez yuva değiştirir ve dışarıda görülebilir; ılık kışlarda kirpiler kasım ve aralığa kadar aktif kalabilir.",
    },
    url: "https://www.hedgehogstreet.org/help-hedgehogs/hibernation/",
  },
  {
    name: "Kandaurov, Bukhnikashvili, Sheklashvili & Natradze 2023 — Insectivores of Georgia, 1864–2022 (Biodiversity Data Journal)",
    supports: {
      en: "Erinaceus concolor is the only hedgehog in the checklist of Georgia's insectivores.",
      ka: "საქართველოს მწერიჭამიების ჩამონათვალში ზღარბებიდან მხოლოდ Erinaceus concolor-ია.",
      ru: "В перечне насекомоядных Грузии из ежей есть только Erinaceus concolor.",
      tr: "Gürcistan böcekçilleri listesinde kirpilerden yalnızca Erinaceus concolor yer alır.",
    },
    url: "https://doi.org/10.3897/bdj.11.e106256",
  },
];

export const HEDGEHOG_IN_WINTER = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "A southern white-breasted hedgehog with a pale chest and grey-brown spines on a light stone surface",
      ka: "თეთრმკერდა ზღარბი ღია ფერის მკერდითა და ნაცრისფერ-ყავისფერი ეკლებით ღია ფერის ქვის ზედაპირზე",
      ru: "Южный белогрудый ёж со светлой грудью и серо-коричневыми иголками на светлой каменной поверхности",
      tr: "Açık renkli göğsü ve gri-kahverengi dikenleriyle güney beyaz göğüslü kirpi, açık renkli taş bir zeminde",
    },
    credit: {
      en: "Photo: Nevit Dilmen / Wikimedia Commons, CC BY-SA 3.0; resized. Erinaceus concolor, Istanbul, Turkey.",
      ka: "ფოტო: Nevit Dilmen / Wikimedia Commons, CC BY-SA 3.0; ზომა შემცირებულია. Erinaceus concolor, სტამბოლი, თურქეთი.",
      ru: "Фото: Nevit Dilmen / Wikimedia Commons, CC BY-SA 3.0; размер уменьшен. Erinaceus concolor, Стамбул, Турция.",
      tr: "Fotoğraf: Nevit Dilmen / Wikimedia Commons, CC BY-SA 3.0; yeniden boyutlandırıldı. Erinaceus concolor, İstanbul, Türkiye.",
    },
    creditUrl: "https://commons.wikimedia.org/wiki/File:Hedgehog_1210127.jpg",
    height: 1200,
    license: {
      name: "CC BY-SA 3.0",
      url: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
    src: "https://cdn.reptiles.ge/images/guides/hedgehog-winter-hero.jpg",
    width: 1600,
  },
  id: "hedgehog-in-winter",
  images: {
    curled: {
      alt: {
        en: "A hedgehog curled into a tight ball of spines, lying motionless in short grass",
        ka: "ეკლების მჭიდრო ბურთად შეკრული ზღარბი, უმოძრაოდ წევს დაბალ ბალახში",
        ru: "Ёж, свернувшийся в плотный колючий шар, неподвижно лежит в низкой траве",
        tr: "Sıkı bir diken topu hâline gelmiş bir kirpi, kısa çimenlerde hareketsiz yatıyor",
      },
      credit: {
        en: "Photo: Jamain / Wikimedia Commons, CC BY-SA 3.0; resized. Belgium, 13 November 2013; the photographer titled it “Hedgehog, dead or in hibernation?”.",
        ka: "ფოტო: Jamain / Wikimedia Commons, CC BY-SA 3.0; ზომა შემცირებულია. ბელგია, 2013 წლის 13 ნოემბერი; ავტორის წარწერა: „ზღარბი, მკვდარი თუ ზამთრის ძილში?“.",
        ru: "Фото: Jamain / Wikimedia Commons, CC BY-SA 3.0; размер уменьшен. Бельгия, 13 ноября 2013 года; подпись автора: «Ёж, мёртв или в спячке?».",
        tr: "Fotoğraf: Jamain / Wikimedia Commons, CC BY-SA 3.0; yeniden boyutlandırıldı. Belçika, 13 Kasım 2013; fotoğrafçının başlığı: “Kirpi, ölü mü kış uykusunda mı?”.",
      },
      creditUrl: "https://commons.wikimedia.org/wiki/File:Hedgehog_J1a.jpg",
      height: 1101,
      license: {
        name: "CC BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      src: "https://cdn.reptiles.ge/images/guides/hedgehog-winter-curled.jpg",
      width: 1600,
    },
    night: {
      alt: {
        en: "A southern white-breasted hedgehog with a pale belly walking across gravel at night",
        ka: "ღია მუცლიანი თეთრმკერდა ზღარბი ღამით ხრეშზე მიდის",
        ru: "Южный белогрудый ёж со светлым брюхом идёт ночью по гравию",
        tr: "Açık renkli karınlı güney beyaz göğüslü kirpi gece çakılların üzerinde yürüyor",
      },
      credit: {
        en: "Photo: Jan Ebr / Wikimedia Commons, CC BY 4.0; resized. Erinaceus concolor, Turkey.",
        ka: "ფოტო: Jan Ebr / Wikimedia Commons, CC BY 4.0; ზომა შემცირებულია. Erinaceus concolor, თურქეთი.",
        ru: "Фото: Jan Ebr / Wikimedia Commons, CC BY 4.0; размер уменьшен. Erinaceus concolor, Турция.",
        tr: "Fotoğraf: Jan Ebr / Wikimedia Commons, CC BY 4.0; yeniden boyutlandırıldı. Erinaceus concolor, Türkiye.",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Erinaceus_concolor_202738952.jpg",
      height: 815,
      license: {
        name: "CC BY 4.0",
        url: "https://creativecommons.org/licenses/by/4.0/",
      },
      src: "https://cdn.reptiles.ge/images/guides/hedgehog-winter-night.jpg",
      width: 1600,
    },
    tbilisi: {
      alt: {
        en: "A hedgehog among tall green grass and garden plants at night, seen from above",
        ka: "ზღარბი მაღალ მწვანე ბალახსა და ბაღის მცენარეებს შორის ღამით, ზემოდან",
        ru: "Ёж среди высокой зелёной травы и садовых растений ночью, вид сверху",
        tr: "Gece uzun yeşil çimenler ve bahçe bitkileri arasında bir kirpi, yukarıdan görünüm",
      },
      credit: {
        en: "Photo: David Osipov / Wikimedia Commons, CC0; cropped and resized. Erinaceus concolor, Orkhevi, Tbilisi, 5 April 2023.",
        ka: "ფოტო: David Osipov / Wikimedia Commons, CC0; ამოჭრილი და შემცირებული. Erinaceus concolor, ორხევი, თბილისი, 2023 წლის 5 აპრილი.",
        ru: "Фото: David Osipov / Wikimedia Commons, CC0; кадрировано, размер уменьшен. Erinaceus concolor, Орхеви, Тбилиси, 5 апреля 2023 года.",
        tr: "Fotoğraf: David Osipov / Wikimedia Commons, CC0; kırpıldı ve yeniden boyutlandırıldı. Erinaceus concolor, Orhevi, Tiflis, 5 Nisan 2023.",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Southern_White-breasted_Hedgehog_in_Orkhevi.jpg",
      height: 1066,
      license: {
        name: "CC0 1.0",
        url: "https://creativecommons.org/publicdomain/zero/1.0/",
      },
      src: "https://cdn.reptiles.ge/images/guides/hedgehog-winter-tbilisi.jpg",
      width: 1600,
    },
  },
  messageKey: "hedgehogInWinter",
  ogImage: "https://cdn.reptiles.ge/og/images/guides/hedgehog-in-winter.jpg",
  parentHub: "mammals",
  pathname: "/mammals/zgharbi-zamtarshi",
  relatedGuideIds: ["bat-in-house", "mouse-in-house"],
  relatedSpeciesIds: ["erinaceus-concolor"],
  search: {
    icon: "guide",
    keywords: [
      "ზღარბი",
      "ზღარბი ზამთარში",
      "ზღარბი ბაღში",
      "ზღარბის ზამთრის ძილი",
      "ნაპოვნი ზღარბი",
      "zgharbi",
      "zgarbi",
      "hedgehog",
      "hedgehog in winter",
      "hedgehog hibernation",
      "found a hedgehog",
      "ёж",
      "ёж зимой",
      "нашли ежа",
      "ёж спячка",
      "kirpi",
      "kışın kirpi",
      "kirpi kış uykusu",
    ],
    rank: 5,
    subtitle: {
      en: "Hibernating or in trouble, and how to help",
      ka: "ზამთრის ძილშია თუ დახმარება სჭირდება",
      ru: "В спячке или в беде, и как помочь",
      tr: "Kış uykusunda mı, yardıma mı ihtiyacı var",
    },
    title: {
      en: "Hedgehog found in winter",
      ka: "ზამთარში ნაპოვნი ზღარბი",
      ru: "Ёж, найденный зимой",
      tr: "Kışın bulunan kirpi",
    },
  },
  sources: SOURCES,
});
