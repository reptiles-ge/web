import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "signs";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Bed bugs at home: where to look, which signs matter, why a bite is not proof, and when to call a specialist. Call 112 for a severe allergic reaction.",
    faq: [
      {
        answer:
          "No. A photo of skin can look like a mosquito bite, a flea bite, or another rash. Confirmation means finding the insect, eggs, shed skins, or dark spots.",
        question: "Does a photo of a bite prove bed bugs?",
      },
      {
        answer:
          "An adult has no wings it can use to fly, and it does not jump the way a flea does. It walks. Size, shape, and the full set of identification features are on the [common bed bug profile](cimex-lectularius).",
        question: "Can a bed bug fly or jump?",
      },
      {
        answer:
          "No. Bed bugs occur in well-kept places, including hotels. Cleanliness does not tell you whether they are present.",
        question: "Does a clean home rule bed bugs out?",
      },
      {
        answer:
          "They are not known to spread diseases to people, and they are not effective vectors. A bite can still itch, disturb sleep, and, rarely, cause an allergic reaction.",
        question: "Do bed bug bites spread disease?",
      },
      {
        answer:
          "In a heavy infestation, check the seams of chairs and couches and the gaps between cushions, as well as the bed. Start with the places where people sleep.",
        question: "Can bed bugs be in a sofa?",
      },
      {
        answer:
          "A 2023 paper describes specimens collected on 30 May 2022 at Gremi church in Kvareli Municipality and at a church near Pichkhovani, in old buildings with bat colonies. Those two sites do not show how common bed bugs are in homes.",
        question: "How common are bed bugs in homes in Georgia?",
      },
      {
        answer:
          "No. Call 112 for a severe allergic reaction or trouble breathing. An ordinary suspected bite is not that call. If you think you are having an allergic reaction, contact a healthcare provider.",
        question: "Should every bed bug bite be a call to 112?",
      },
    ],
    metaTitle: "Bed bugs at home — how to find and remove them",
    sections: [
      {
        heading: "What should you do first?",
        list: {
          items: [
            "Check the mattress seams, the bed frame, the headboard, and nearby cracks for a live insect, eggs, shed skins, or small dark spots.",
            "Do not decide from itching or from a photo of skin. A bite is a poor sign on its own.",
            "If you find an insect, keep it and contact a pest-control specialist who has experience with bed bugs.",
            "Call 112 for a severe allergic reaction or trouble breathing. Do not make that call for an ordinary suspected bite.",
          ],
          ordered: true,
        },
        paragraphs: [
          "If you suspect bed bugs at home, look for the insect or its traces before you buy anything or treat the room. A small infestation is easier to deal with than one that has already spread.",
        ],
      },
      {
        heading: "How can you tell bed bugs may be in the home?",
        image: "signs",
        paragraphs: [
          "Look for the insect itself, pale eggs about 1 mm long, the skins young insects shed, rusty or reddish stains from crushed insects, and dark spots about the size of a marker dot. Those spots are excrement and can bleed into fabric.",
          "Bites on the skin are a poor indicator. They can look like mosquito or flea bites, or like other rashes, and some people do not react at all. Marks may show up one to several days later, sometimes as long as 14 days, and they may be scattered or in a line. None of that confirms the insect. For the species traits, use the [common bed bug profile](cimex-lectularius).",
          "An adult is about 5–7 mm long, wingless, and flat and oval before a blood meal. That is the practical minimum. The profile is the place for a fuller identification.",
          "Published specimens from Georgia were collected on 30 May 2022 at Gremi church in Kvareli Municipality and at a church near the village of Pichkhovani. Both were old buildings associated with bat colonies. Those two sites do not show how bed bugs are spread through homes, and the paper does not establish how often they occur in different regions. A bat in the house is a separate problem: see [a bat in the house](/mammals/ghamura-sakhlshi).",
        ],
      },
      {
        heading: "Where should you look?",
        list: {
          items: [
            "Around the bed: mattress piping, seams and tags, the box spring, and cracks in the frame and headboard.",
            "Any crack a credit card could slip into. That is small enough to hide a bed bug.",
            "If the infestation is already heavy, also check seams of chairs and sofas, the gaps between cushions, folds of curtains, drawer joints, loose wallpaper, and the line where the wall meets the ceiling.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Start where people sleep. Bed bugs usually live within about 8 feet (about 2.4 m) of that place, though they will travel farther to feed. They are mostly active at night and can also come out in daylight if they are hungry.",
          "In a heavy infestation they also use upholstered furniture, so a sofa is part of the search, not a separate kind of insect.",
        ],
      },
      {
        heading: "Bed bug, stink bug, flea, tick, or cockroach?",
        paragraphs: [
          "A [stink bug in the house](/insects/farosana-sakhlshi) is a different insect: the brown marmorated stink bug is larger, shield-shaped, feeds on plants, and does not suck human blood. A bed bug does not jump the way a flea does; if the problem is fleas, use [fleas in the house](/insects/rtsqilebi-sakhlshi). An adult tick has eight legs and a bed bug has six; a tick on the skin is [a tick bite](/insects/tkipis-nakbeni), not this page.",
          "A cockroach is a different household insect. If that is what you found, use [cockroaches at home](/insects/taraknebi-sakhlshi). Other insects, including carpet beetles, are easy to mistake for bed bugs, and a wrong identification gives them time to spread. Closely related bed bug species can look alike, so the exact species sometimes needs a specialist. Other indoor insect problems are collected on the [insects](/insects) pages.",
        ],
      },
      {
        heading: "How do you get rid of bed bugs?",
        paragraphs: [
          "Getting rid of bed bugs starts with finding the insect or its signs, including when the problem is a bed bug in the bed. There is no product name on this page. Using a chemical at random does not replace knowing which insect you have, and removal from a home can be slow and inconvenient.",
          "Keep any specimen you find. Contact a pest-control company with experience treating bed bugs. Those services typically treat the area with insecticide sprays. This guide does not give a mixture, a dose, or a home heat method. Finding the problem early matters: a minor infestation is less costly and easier than the same one after it has spread.",
        ],
      },
      {
        heading: "What should you not do?",
        list: {
          items: [
            "Do not treat a rash, a line of marks, or a photo of skin as proof.",
            "Do not assume a clean home, or a dirty one, tells you whether bed bugs are there.",
            "Do not use a chemical at random before the insect is identified. A wrong identification lets bed bugs spread through the home or travel to another one.",
            "Do not handle this as a stink-bug, flea, tick, or cockroach problem unless that is the animal you actually found.",
          ],
          ordered: false,
        },
        paragraphs: [
          "The useful warning is the one the sources support: confirm the insect, then get experienced help. Do not improvise a pesticide or a heat treatment from this page.",
        ],
      },
      {
        heading: "What does a bed bug bite mean?",
        paragraphs: [
          "A bite can itch and disrupt sleep. Rarely, it causes an allergic reaction, including enlarged marks, painful swelling, or anaphylaxis. Bed bugs are not known to spread diseases to people. The inflammation comes from a reaction to the bite, and that reaction is not specific enough to name the insect.",
          "People differ. There may be no mark, a small red swollen mark like a mosquito or flea bite, or, rarely, a serious allergic reaction. You may not feel the bite when it happens. Intense scratching can lead to a secondary skin infection, so avoid scratching. Ordinary bites usually do not need medical treatment.",
          "If you think you are having an allergic reaction, contact a healthcare provider. Call 112 for a severe allergic reaction or trouble breathing. Do not call 112 for every itch.",
        ],
      },
      {
        heading: "When do you need a pest-control specialist?",
        paragraphs: [
          "Contact a professional who has experience with bed bugs when you find a live insect, eggs, shed skins, or the dark spots and stains described above. Keep the specimen so it can be identified. A specialist's insecticide treatment is the control step these sources describe. This page does not name a company and does not promise that one visit will finish the problem.",
        ],
      },
      {
        heading: "How do you avoid carrying them somewhere else?",
        paragraphs: [
          "Bed bugs spread by hiding in luggage, overnight bags, folded clothes, bedding, and furniture. Most people move them without noticing. When you travel, look for shed skins or insects in the folds of mattresses and sheets where you sleep. At home, keep checking those same signs. Early detection makes an infestation easier to control.",
          "A clean house is not the method, and finding bed bugs does not mean the home was dirty. They live in five-star hotels as well as other buildings. How clean a place is does not determine whether they are present.",
        ],
      },
    ],
    summary:
      "Look in the mattress seams, the bed frame, and nearby cracks for the insect, eggs, shed skins, or dark spots. A bite does not confirm bed bugs. Keep any specimen and contact a pest-control specialist. Call 112 for a severe allergic reaction or trouble breathing.",
    title: "Bed bugs at home — how to find and get rid of them",
  },
  ka: {
    description:
      "ბაღლინჯო სახლში: სად მოძებნოთ მწერი და კვალი, რას არ ადასტურებს ნაკბენი და როდის მიმართოთ სპეციალისტს. მძიმე ალერგიაზე დარეკეთ 112-ზე.",
    faq: [
      {
        answer:
          "არა. კანის ფოტო შეიძლება კოღოს ან რწყილის ნაკბენს, ან სხვა გამონაყარს ჰგავდეს. დასტურია მწერი, კვერცხი, გამოცვლილი კანი ან მუქი ლაქები.",
        question: "ბაღლინჯოს ნაკბენის ფოტო საკმარისი დასტურია?",
      },
      {
        answer:
          "ზრდასრულს ფრენისთვის გამოსადეგი ფრთები არ აქვს და რწყილივით არ ხტება. ის დადის. ზომა და ამოცნობის სრული ნიშნები [საწოლის ბაღლინჯოს პროფილზეა](cimex-lectularius).",
        question: "ბაღლინჯო დაფრინავს ან ხტება?",
      },
      {
        answer:
          "არა. ბაღლინჯო მოვლილ ადგილშიც ხვდება, მათ შორის სასტუმროში. სისუფთავე არ გვეუბნება, არის თუ არა ის იქ.",
        question: "სუფთა სახლი ბაღლინჯოს გამორიცხავს?",
      },
      {
        answer:
          "არ ითვლება, რომ ადამიანს დაავადებას გადასცემს, და ეფექტურ გადამტანადაც არ მიიჩნევა. ნაკბენმა მაინც შეიძლება გამოიწვიოს ქავილი, ძილის დარღვევა და, იშვიათად, ალერგიული რეაქცია.",
        question: "ბაღლინჯოს ნაკბენი დაავადებას გადასცემს?",
      },
      {
        answer:
          "ძლიერი ინვაზიის დროს სავარძლისა და დივნის ნაკერებიც და ბალიშებს შორის სივრცეც შეამოწმეთ, საწოლთან ერთად. ძებნა დაიწყეთ იქ, სადაც ადამიანი იძინებს.",
        question: "დივანშიც შეიძლება იყოს ბაღლინჯო?",
      },
      {
        answer:
          "2023 წლის ნაშრომი აღწერს 2022 წლის 30 მაისს შეგროვებულ ნიმუშებს ყვარლის გრემის ეკლესიიდან და ფიჩხოვანთან მდებარე ეკლესიიდან, ღამურების კოლონიებთან დაკავშირებულ ძველ შენობებში. ეს ორი ადგილი არ გვიჩვენებს, რამდენად ხშირია ბაღლინჯო საცხოვრებელ სახლებში.",
        question: "საქართველოს სახლებში ბაღლინჯო რამდენად ხშირია?",
      },
      {
        answer:
          "არა. 112-ზე დარეკეთ მძიმე ალერგიული რეაქციის ან სუნთქვის გაძნელებისას. ჩვეულებრივი საეჭვო ნაკბენი ეს ზარი არ არის. თუ ალერგიულ რეაქციას ეჭვობთ, მიმართეთ ექიმს.",
        question: "ყველა ნაკბენზე 112-ზე უნდა დავრეკო?",
      },
    ],
    metaTitle: "ბაღლინჯო სახლში — როგორ ვიპოვოთ და მოვიშოროთ",
    sections: [
      {
        heading: "პირველ რიგში რა ვქნათ?",
        list: {
          items: [
            "ლეიბის ნაკერებში, საწოლის ჩარჩოზე, თავსაფარსა და ახლო ნაპრალებში მოძებნეთ ცოცხალი მწერი, კვერცხი, გამოცვლილი კანი ან პატარა მუქი ლაქები.",
            "ქავილით ან კანის ფოტოთი არ გადაწყვიტოთ. ნაკბენი ცალკე სუსტი ნიშანია.",
            "თუ მწერს იპოვით, შეინახეთ და მიმართეთ მავნებლების კონტროლის სპეციალისტს, რომელსაც ბაღლინჯოსთან მუშაობის გამოცდილება აქვს.",
            "მძიმე ალერგიული რეაქციის ან სუნთქვის გაძნელებისას დარეკეთ 112-ზე. ჩვეულებრივ საეჭვო ნაკბენზე ეს ზარი არ დარეკოთ.",
          ],
          ordered: true,
        },
        paragraphs: [
          "თუ სახლში ბაღლინჯოს ეჭვი გაქვთ, ჯერ მწერი ან მისი კვალი მოძებნეთ და მერე იყიდოთ რამე ან დაამუშაოთ ოთახი. მცირე ინვაზიასთან გამკლავება უფრო იოლია, ვიდრე უკვე გავრცელებულთან.",
        ],
      },
      {
        heading: "როგორ გავიგოთ, რომ სახლში ბაღლინჯო შეიძლება იყოს?",
        image: "signs",
        paragraphs: [
          "მოძებნეთ თავად მწერი, დაახლოებით 1 მმ-ის ღია კვერცხები, ახალგაზრდა მწერის გამოცვლილი კანი, გაჭყლეტილი მწერის მოწითალო ლაქები და მარკერის წერტილის ოდენა მუქი ლაქები. ეს ლაქები განავალია და ქსოვილზე შეიძლება გაიშალოს.",
          "კანზე ნაკბენი სუსტი ნიშანია. ის შეიძლება კოღოს ან რწყილის ნაკბენს, ან სხვა გამონაყარს ჰგავდეს, ზოგი ადამიანი კი საერთოდ არ რეაგირებს. კვალი შეიძლება ერთიდან რამდენიმე დღემდე, ზოგჯერ 14 დღემდეც გამოჩნდეს და იყოს მიმოფანტული ან ხაზზე. ეს მწერს არ ადასტურებს. სახეობის ნიშნებისთვის გახსენით [საწოლის ბაღლინჯოს პროფილი](cimex-lectularius).",
          "ზრდასრული დაახლოებით 5–7 მმ-ია, უფრთოა და კვებამდე ბრტყელი და ოვალურია. ეს პრაქტიკული მინიმუმია. სრული ამოცნობა პროფილზეა.",
          "საქართველოში გამოქვეყნებული ნიმუშები 2022 წლის 30 მაისს შეგროვდა ყვარლის მუნიციპალიტეტის გრემის ეკლესიაში და სოფელ ფიჩხოვანთან მდებარე ეკლესიაში. ორივე ძველი შენობა ღამურების კოლონიასთან იყო დაკავშირებული. ამ ორი ადგილით ვერ დავადგენთ, როგორაა ბაღლინჯო გავრცელებული სახლებში, და ნაშრომი არც რეგიონების მიხედვით სიხშირეს ადგენს. ღამურა სახლში ცალკე საკითხია: იხილეთ [ღამურა სახლში](/mammals/ghamura-sakhlshi).",
        ],
      },
      {
        heading: "სად ვეძებოთ ბაღლინჯო სახლში?",
        list: {
          items: [
            "საწოლთან: ლეიბის კიდე, ნაკერები და იარლიყები, ლეიბის ქვედა საყრდენი, ჩარჩოსა და თავსაფრის ნაპრალები.",
            "ნებისმიერი ნაპრალი, რომელშიც საბანკო ბარათი ეტევა. ასეთ სივრცეში ბაღლინჯოც ეტევა.",
            "თუ ინვაზია უკვე ძლიერია, შეამოწმეთ სავარძლისა და დივნის ნაკერები, ბალიშებს შორის სივრცე, ფარდის ნაკეცები, უჯრის შეერთებები, მოშვებული შპალერი და კედლისა და ჭერის შეხების ხაზი.",
          ],
          ordered: true,
        },
        paragraphs: [
          "დაიწყეთ იქ, სადაც ადამიანი იძინებს. ბაღლინჯო ჩვეულებრივ ამ ადგილიდან დაახლოებით 8 ფუტის (დაახლოებით 2,4 მეტრის) მანძილზე ცხოვრობს, თუმცა საჭმელად უფრო შორსაც გადის. უმეტესად ღამითაა აქტიური და მშიერი დღისითაც გამოდის.",
          "ძლიერი ინვაზიის დროს რბილ ავეჯსაც იყენებს, ამიტომ დივანი ძებნის ნაწილია და არა სხვა მწერი.",
        ],
      },
      {
        heading: "ბაღლინჯო, ფაროსანა, რწყილი, ტკიპა თუ ტარაკანა?",
        paragraphs: [
          "[ფაროსანა სახლში](/insects/farosana-sakhlshi) სხვა მწერია: აზიური ფაროსანა უფრო დიდია, ფარის ფორმის სხეული აქვს, მცენარით იკვებება და ადამიანის სისხლს არ წოვს. ბაღლინჯო რწყილივით არ ხტება; თუ საქმე რწყილებია, იხილეთ [რწყილები სახლში](/insects/rtsqilebi-sakhlshi). ზრდასრულ ტკიპას რვა ფეხი აქვს, ბაღლინჯოს — ექვსი; კანზე მიმაგრებული ტკიპა [ტკიპის ნაკბენია](/insects/tkipis-nakbeni) და არა ეს გვერდი.",
          "ტარაკანა სხვა საყოფაცხოვრებო მწერია. თუ ის იპოვეთ, გახსენით [ტარაკნები სახლში](/insects/taraknebi-sakhlshi). სხვა მწერები, მათ შორის ხალიჩის ხოჭოები, ადვილად ეშლება ბაღლინჯოში, არასწორი ამოცნობა კი გავრცელების დროს აძლევს. ახლო სახეობები ერთმანეთს ჰგავს, ამიტომ ზუსტ სახეობას ზოგჯერ სპეციალისტი სჭირდება. სახლის სხვა მწერები თავმოყრილია [მწერების](/insects) გვერდებზე.",
        ],
      },
      {
        heading: "როგორ მოვიშოროთ ბაღლინჯო?",
        paragraphs: [
          "ბაღლინჯოს მოშორება იწყება მწერის ან მისი კვალის პოვნით, მათ შორის მაშინ, როცა საქმე საწოლის ბაღლინჯოს მოშორებას ეხება. ამ გვერდზე პროდუქტის სახელი არ არის. ქიმიური საშუალების შემთხვევით გამოყენება იმის ცოდნას ვერ ცვლის, რომელი მწერი გყავთ, სახლიდან მოშორება კი შეიძლება ნელი და მოუხერხებელი იყოს.",
          "ნაპოვნი ნიმუში შეინახეთ. მიმართეთ კომპანიას, რომელსაც ბაღლინჯოს დამუშავების გამოცდილება აქვს. ასეთი სამსახური, ჩვეულებრივ, ადგილს ინსექტიციდის შესხურებით ამუშავებს. ეს გიდი არ იძლევა ნარევს, დოზას ან სახლის პირობებში გაცხელების წესს. პრობლემის ადრე პოვნას მნიშვნელობა აქვს: მცირე ინვაზია ნაკლებად ძვირი და უფრო იოლია, ვიდრე იგივე უკვე გავრცელებული.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        list: {
          items: [
            "გამონაყარი, კვალის ხაზი ან კანის ფოტო დასტურად არ მიიღოთ.",
            "არც სუფთა სახლი და არც ჭუჭყიანი გეუბნებათ, არის თუ არა იქ ბაღლინჯო.",
            "მწერის ამოცნობამდე ქიმიური საშუალება შემთხვევით არ გამოიყენოთ. არასწორი ამოცნობა ბაღლინჯოს სახლში გავრცელების ან სხვა სახლში წაღების დროს აძლევს.",
            "ეს არ მოექცეთ ფაროსანას, რწყილის, ტკიპის ან ტარაკანას პრობლემად, თუ სინამდვილეში ის ცხოველი არ გიპოვიათ.",
          ],
          ordered: false,
        },
        paragraphs: [
          "სასარგებლო გაფრთხილება ისაა, რასაც წყაროები ამაგრებს: დაადასტურეთ მწერი და მერე მიმართეთ გამოცდილ დახმარებას. ამ გვერდიდან პესტიციდი ან გაცხელება არ მოიგონოთ.",
        ],
      },
      {
        heading: "რას ნიშნავს ბაღლინჯოს ნაკბენი?",
        paragraphs: [
          "ნაკბენმა შეიძლება ქავილი და ძილის დარღვევა გამოიწვიოს. იშვიათად იწვევს ალერგიულ რეაქციას, მათ შორის გადიდებულ კვალს, მტკივნეულ შეშუპებას ან ანაფილაქსიას. არ ითვლება, რომ ბაღლინჯო ადამიანს დაავადებას გადასცემს. ანთება ნაკბენზე რეაქციაა და ეს რეაქცია მწერის დასასახელებლად საკმარისი არ არის.",
          "ადამიანები განსხვავდებიან. კვალი შეიძლება საერთოდ არ იყოს, იყოს პატარა წითელი შეშუპებული ნიშანი, როგორც კოღოს ან რწყილის ნაკბენი, ან, იშვიათად, მძიმე ალერგიული რეაქცია. ნაკბენის მომენტში შეიძლება ვერ იგრძნოთ. ძლიერმა ფხაჭნამ შეიძლება მეორადი კანის ინფექცია გამოიწვიოს, ამიტომ ნუ იფხანთ. ჩვეულებრივ ნაკბენს, როგორც წესი, სამედიცინო მკურნალობა არ სჭირდება.",
          "თუ ალერგიულ რეაქციას ეჭვობთ, მიმართეთ ექიმს. მძიმე ალერგიული რეაქციის ან სუნთქვის გაძნელებისას დარეკეთ 112-ზე. ყოველ ქავილზე 112-ზე ნუ დარეკავთ.",
        ],
      },
      {
        heading: "როდის სჭირდება მავნებლების კონტროლის სპეციალისტი?",
        paragraphs: [
          "მიმართეთ სპეციალისტს, რომელსაც ბაღლინჯოსთან მუშაობის გამოცდილება აქვს, როცა იპოვით ცოცხალ მწერს, კვერცხს, გამოცვლილ კანს ან ზემოთ აღწერილ მუქ ლაქებსა და შეფერილ კვალს. ნიმუში შეინახეთ, რომ ამოცნობა შეძლონ. სპეციალისტის ინსექტიციდით დამუშავება ის საკონტროლო ნაბიჯია, რომელსაც ეს წყაროები აღწერს. ეს გვერდი კომპანიას არ ასახელებს და არ ჰპირდება, რომ ერთი ვიზიტი საქმეს დაასრულებს.",
        ],
      },
      {
        heading: "როგორ არ წავიღოთ ბაღლინჯო სხვაგან?",
        paragraphs: [
          "ბაღლინჯო ვრცელდება ბარგში, ჩანთაში, დაკეცილ ტანსაცმელში, თეთრეულსა და ავეჯში დამალვით. ადამიანების უმეტესობა მას შეუმჩნევლად გადააქვს. მგზავრობისას ძილის ადგილას ლეიბისა და თეთრეულის ნაკეცებში მოძებნეთ გამოცვლილი კანი ან მწერი. სახლშიც იგივე კვალს ადევნეთ თვალი. ადრე შემჩნევა ინვაზიის კონტროლს აიოლებს.",
          "სუფთა სახლი მეთოდი არ არის და ბაღლინჯოს პოვნა არ ნიშნავს, რომ სახლი ჭუჭყიანი იყო. ის ხუთვარსკვლავიან სასტუმროშიც ცხოვრობს. ადგილის სისუფთავე არ წყვეტს, არის თუ არა იქ ბაღლინჯო.",
        ],
      },
    ],
    summary:
      "ლეიბის ნაკერებში, საწოლის ჩარჩოსა და ახლო ნაპრალებში მოძებნეთ მწერი, კვერცხი, გამოცვლილი კანი ან მუქი ლაქები. ნაკბენი ბაღლინჯოს არ ადასტურებს. ნიმუში შეინახეთ და მავნებლების კონტროლის სპეციალისტს მიმართეთ. მძიმე ალერგიული რეაქციის ან სუნთქვის გაძნელებისას დარეკეთ 112-ზე.",
    title: "ბაღლინჯო სახლში — როგორ ვიპოვოთ და მოვიშოროთ",
  },
  ru: {
    description:
      "Клопы в квартире: где искать насекомое и следы, почему укус не доказательство и когда звать специалиста. При тяжёлой аллергии звоните 112.",
    faq: [
      {
        answer:
          "Нет. Фото кожи может быть похоже на укус комара, блохи или другую сыпь. Подтверждение — это насекомое, яйца, сброшенные шкурки или тёмные пятна.",
        question: "Фото укуса доказывает, что это клопы?",
      },
      {
        answer:
          "У взрослого нет крыльев, пригодных для полёта, и он не прыгает, как блоха. Он ходит. Размер и полный набор признаков — в [профиле постельного клопа](cimex-lectularius).",
        question: "Постельный клоп летает или прыгает?",
      },
      {
        answer:
          "Нет. Клопы бывают и в ухоженных местах, включая гостиницы. Чистота не говорит, есть они или нет.",
        question: "Чистая квартира исключает клопов?",
      },
      {
        answer:
          "Не считается, что они передают людям болезни, и эффективными переносчиками их не признают. Укус всё же может вызывать зуд, нарушать сон и редко — аллергию.",
        question: "Укус клопа передаёт болезнь?",
      },
      {
        answer:
          "При сильном заселении проверьте швы кресел и диванов и промежутки между подушками, вместе с кроватью. Начинайте с мест, где спят.",
        question: "Клопы бывают в диване?",
      },
      {
        answer:
          "Работа 2023 года описывает образцы, собранные 30 мая 2022 года в церкви Греми в муниципалитете Кварели и в церкви у села Пичховани, в старых зданиях у колоний летучих мышей. По этим двум местам нельзя судить, насколько клопы часты в жилых домах.",
        question: "Насколько клопы часты в домах Грузии?",
      },
      {
        answer:
          "Нет. Звоните 112 при тяжёлой аллергической реакции или затруднённом дыхании. Обычный подозрительный укус — не этот звонок. Если подозреваете аллергию, обратитесь к врачу.",
        question: "Звонить ли на 112 при каждом укусе?",
      },
    ],
    metaTitle: "Клопы в квартире — как найти и вывести",
    sections: [
      {
        heading: "Что сделать в первую очередь?",
        list: {
          items: [
            "В швах матраса, на каркасе кровати, у изголовья и в ближних щелях ищите живое насекомое, яйца, сброшенные шкурки или мелкие тёмные пятна.",
            "Не решайте по зуду и по фото кожи. Укус сам по себе слабый признак.",
            "Если насекомое найдено, сохраните его и обратитесь к специалисту по борьбе с вредителями, у которого есть опыт с клопами.",
            "При тяжёлой аллергической реакции или затруднённом дыхании звоните 112. Из-за обычного подозрительного укуса этот звонок не нужен.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Если подозреваете клопов дома, сначала ищите насекомое или его следы и только потом что-либо покупайте или обрабатывайте комнату. С небольшим заселением справиться легче, чем с уже разошедшимся.",
        ],
      },
      {
        heading: "Как понять, что в квартире могут быть клопы?",
        image: "signs",
        paragraphs: [
          "Ищите само насекомое, светлые яйца около 1 мм, шкурки после линьки, рыжие или красноватые пятна от раздавленных клопов и тёмные точки размером с точку маркера. Это экскременты, и на ткани они могут расплываться.",
          "Укусы на коже — слабый признак. Они бывают похожи на укусы комара или блохи или на другую сыпь, а некоторые люди вовсе не реагируют. Следы могут появиться через один или несколько дней, иногда до 14 дней, и лежать рассеянно или в линию. Это не подтверждает насекомое. Признаки вида — в [профиле постельного клопа](cimex-lectularius).",
          "Взрослый клоп около 5–7 мм, бескрылый, до кормления плоский и овальный. Это практический минимум. Полное определение — в профиле.",
          "Опубликованные находки в Грузии собраны 30 мая 2022 года в церкви Греми в муниципалитете Кварели и в церкви у села Пичховани. Оба здания старые и связаны с колониями летучих мышей. По этим двум местам нельзя судить, как клопы распространены в квартирах, и работа не устанавливает частоту по регионам. Летучая мышь в доме — отдельная задача: см. [летучая мышь в доме](/mammals/ghamura-sakhlshi).",
        ],
      },
      {
        heading: "Где искать клопов дома?",
        list: {
          items: [
            "У кровати: кант, швы и ярлыки матраса, основание под матрасом, щели каркаса и изголовья.",
            "Любая щель, куда проходит банковская карта. В такую щель помещается и клоп.",
            "Если заселение уже сильное, проверьте также швы кресел и диванов, промежутки между подушками, складки штор, стыки ящиков, отставшие обои и линию стыка стены и потолка.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Начните с места, где спят. Клопы обычно живут в пределах примерно 8 футов (около 2,4 м) от него, хотя за пищей отходят дальше. Чаще они активны ночью, а голодные выходят и днём.",
          "При сильном заселении они используют и мягкую мебель, поэтому диван — часть поиска, а не другой вид.",
        ],
      },
      {
        heading: "Клоп, щитник, блоха, клещ или таракан?",
        paragraphs: [
          "[Мраморный клоп в доме](/insects/farosana-sakhlshi) — другое насекомое: он крупнее, тело щитковидное, питается растениями и не сосёт человеческую кровь. Постельный клоп не прыгает, как блоха; если дело в блохах, откройте [блохи в доме](/insects/rtsqilebi-sakhlshi). У взрослого клеща восемь ног, у клопа — шесть; клещ на коже — это [укус клеща](/insects/tkipis-nakbeni), а не эта страница.",
          "Таракан — другое домашнее насекомое. Если нашли его, откройте [тараканы дома](/insects/taraknebi-sakhlshi). Других насекомых, в том числе ковровых жуков, легко принять за клопов, а ошибка даёт им время разойтись. Близкие виды клопов похожи, поэтому точный вид иногда определяет специалист. Другие насекомые в доме собраны на страницах [насекомых](/insects).",
        ],
      },
      {
        heading: "Как вывести клопов?",
        paragraphs: [
          "Выведение начинается с того, что найдено насекомое или его следы, в том числе когда речь о постельном клопе в кровати. Названия средства на этой странице нет. Случайная химия не заменяет знание, какое насекомое у вас в доме, а удаление из жилья бывает долгим и неудобным.",
          "Сохраните найденный экземпляр. Обратитесь в службу, у которой есть опыт обработки от клопов. Такая служба обычно обрабатывает место распылением инсектицида. Этот гид не даёт смесь, дозу или домашний прогрев. Ранняя находка важна: небольшое заселение дешевле и проще, чем то же самое после распространения.",
        ],
      },
      {
        heading: "Чего делать не стоит?",
        list: {
          items: [
            "Не считайте доказательством сыпь, линию следов или фото кожи.",
            "Ни чистая, ни грязная квартира не говорит, есть ли там клопы.",
            "Не применяйте химию наугад, пока насекомое не определено. Ошибка даёт клопам время разойтись по дому или уехать в другой.",
            "Не ведите это как проблему щитника, блох, клеща или таракана, если нашли не их.",
          ],
          ordered: false,
        },
        paragraphs: [
          "Полезное предупреждение то, которое поддерживают источники: подтвердите насекомое и затем зовите опытных. Не выдумывайте по этой странице пестицид или прогрев.",
        ],
      },
      {
        heading: "Что означает укус клопа?",
        paragraphs: [
          "Укус может вызывать зуд и нарушать сон. Редко он вызывает аллергию, включая увеличенные следы, болезненный отёк или анафилаксию. Не считается, что клопы передают людям болезни. Воспаление — это реакция на укус, и по ней насекомое не называют.",
          "Люди реагируют по-разному. Следа может не быть, может быть небольшая красная припухлость, как от комара или блохи, или, редко, тяжёлая аллергия. В момент укуса его можно не почувствовать. Сильное расчёсывание может привести к вторичной кожной инфекции, поэтому не расчёсывайте. Обычные укусы, как правило, не требуют лечения.",
          "Если подозреваете аллергическую реакцию, обратитесь к врачу. При тяжёлой аллергии или затруднённом дыхании звоните 112. Не звоните 112 из-за каждого зуда.",
        ],
      },
      {
        heading: "Когда нужен специалист по вредителям?",
        paragraphs: [
          "Обратитесь к специалисту с опытом работы с клопами, если нашли живое насекомое, яйца, сброшенные шкурки или описанные выше тёмные пятна и окрашенные следы. Экземпляр сохраните для определения. Обработка инсектицидом силами специалиста — тот шаг контроля, который описывают эти источники. Страница не называет фирму и не обещает, что одного визита хватит.",
        ],
      },
      {
        heading: "Как не увезти клопов в другое место?",
        paragraphs: [
          "Клопы распространяются, прячась в багаже, сумках, сложенной одежде, постельном белье и мебели. Большинство людей перевозит их незаметно. В поездке смотрите шкурки или насекомых в складках матраса и белья там, где спите. Дома следите за теми же следами. Раннее обнаружение облегчает контроль.",
          "Чистая квартира — не метод, и находка клопов не значит, что дома было грязно. Они живут и в пятизвёздочных гостиницах. Чистота места не решает, есть ли они там.",
        ],
      },
    ],
    summary:
      "Ищите в швах матраса, на каркасе кровати и в ближних щелях насекомое, яйца, шкурки или тёмные пятна. Укус клопов не подтверждает. Экземпляр сохраните и обратитесь к специалисту. При тяжёлой аллергии или затруднённом дыхании звоните 112.",
    title: "Клопы в квартире — как найти и вывести",
  },
  tr: {
    description:
      "Evde tahtakurusu: böceği ve izlerini nerede arayacağınız, ısırığın neden kanıt olmadığı ve ne zaman uzman çağıracağınız. Ağır alerjide 112'yi arayın.",
    faq: [
      {
        answer:
          "Hayır. Deri fotoğrafı sivrisinek veya pire ısırığına ya da başka bir dökmeye benzeyebilir. Kanıt; böcek, yumurta, dökülmüş deri ya da koyu lekelerdir.",
        question: "Isırık fotoğrafı tahtakurusunu kanıtlar mı?",
      },
      {
        answer:
          "Erginin uçmaya yarayan kanadı yoktur ve pire gibi zıplamaz. Yürür. Boy ve tanımanın tüm işaretleri [yatak tahtakurusu profilindedir](cimex-lectularius).",
        question: "Tahtakurusu uçar veya zıplar mı?",
      },
      {
        answer:
          "Hayır. Tahtakurusu bakımlı yerlerde de, otellerde de bulunur. Temizlik, orada olup olmadıklarını söylemez.",
        question: "Temiz ev tahtakurusunu dışlar mı?",
      },
      {
        answer:
          "İnsana hastalık bulaştırdığı kabul edilmez ve etkili taşıyıcı sayılmazlar. Isırık yine de kaşıntı, uyku bölünmesi ve nadiren alerji yapabilir.",
        question: "Tahtakurusu ısırığı hastalık bulaştırır mı?",
      },
      {
        answer:
          "Ağır bir yerleşmede koltuk ve kanepe dikişlerine ve minder aralarına da bakın, yatakla birlikte. Aramaya insanların uyuduğu yerden başlayın.",
        question: "Tahtakurusu kanepede de olur mu?",
      },
      {
        answer:
          "2023 tarihli bir çalışma, 30 Mayıs 2022'de Kvareli'deki Gremi kilisesi ve Piçhovani yakınındaki kiliseden, yarasa kolonileriyle ilişkili eski yapılardan toplanan örnekleri anlatır. Bu iki yer, evlerde ne kadar sık olduklarını göstermez.",
        question: "Gürcistan'daki evlerde tahtakurusu ne kadar sık?",
      },
      {
        answer:
          "Hayır. 112'yi ağır alerjik tepki veya solunum güçlüğünde arayın. Sıradan şüpheli bir ısırık bu arama değildir. Alerji düşündüğünüzde bir sağlık kuruluşuna başvurun.",
        question: "Her ısırıkta 112 aranır mı?",
      },
    ],
    metaTitle: "Evde tahtakurusu — nasıl bulunur ve uzaklaştırılır",
    sections: [
      {
        heading: "İlk olarak ne yapmalı?",
        list: {
          items: [
            "Yatak dikişlerinde, karyola çerçevesinde, başlıkta ve yakındaki çatlaklarda canlı böcek, yumurta, dökülmüş deri veya küçük koyu lekeler arayın.",
            "Kaşıntıyla ya da deri fotoğrafıyla karar vermeyin. Isırık tek başına zayıf bir işarettir.",
            "Böcek bulursanız saklayın ve tahtakurusu deneyimi olan bir zararlı kontrol uzmanına başvurun.",
            "Ağır alerjik tepki veya solunum güçlüğünde 112'yi arayın. Sıradan şüpheli bir ısırık için bu aramayı yapmayın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Evde tahtakurusu kuşkunuz varsa, bir şey almadan veya odayı ilaçlamadan önce böceği ya da izlerini arayın. Küçük bir yerleşmeyle uğraşmak, yayılmış olanla uğraşmaktan kolaydır.",
        ],
      },
      {
        heading: "Evde tahtakurusu olabileceğini nasıl anlarsınız?",
        image: "signs",
        paragraphs: [
          "Böceğin kendisini, yaklaşık 1 mm'lik açık renkli yumurtaları, genç böceklerin döktüğü deriyi, ezilen böcekten kalan kızıl lekeleri ve keçeli kalem noktası büyüklüğünde koyu lekeleri arayın. Bu lekeler dışkıdır ve kumaşa yayılabilir.",
          "Derideki ısırık zayıf bir işarettir. Sivrisinek veya pire ısırığına ya da başka bir dökmeye benzeyebilir; bazı insanlar hiç tepki vermez. İzler bir ila birkaç gün, bazen 14 gün sonra çıkabilir ve dağınık ya da bir çizgi halinde olabilir. Bu, böceği kanıtlamaz. Türün işaretleri için [yatak tahtakurusu profiline](cimex-lectularius) bakın.",
          "Ergin yaklaşık 5–7 mm'dir, kanatsızdır ve kan emmeden önce yassı ve ovaldir. Pratik asgari budur. Ayrıntılı tanıma profilde yer alır.",
          "Gürcistan'da yayımlanan örnekler 30 Mayıs 2022'de Kvareli Belediyesi'ndeki Gremi kilisesi ve Piçhovani köyü yakınındaki kilisede toplandı. İkisi de yarasa kolonileriyle ilişkili eski yapılardı. Bu iki yer, tahtakurusunun evlerde nasıl yayıldığını göstermez ve çalışma bölgelere göre sıklığı da koymaz. Evdeki yarasa ayrı bir konudur: [evde yarasa](/mammals/ghamura-sakhlshi).",
        ],
      },
      {
        heading: "Evde nereye bakmalı?",
        list: {
          items: [
            "Yatağın çevresi: yatağın kenarı, dikişleri ve etiketleri, alt destek, çerçeve ve başlıktaki çatlaklar.",
            "Bir banka kartının girebildiği her çatlak. Tahtakurusu da bu aralığa sığar.",
            "Yerleşme zaten ağırsa koltuk ve kanepe dikişlerine, minder aralarına, perde kıvrımlarına, çekmece birleşimlerine, gevşek duvar kâğıdına ve duvarla tavanın birleştiği çizgiye de bakın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "İnsanların uyuduğu yerden başlayın. Tahtakuruları genellikle bu yerin yaklaşık 8 fit (yaklaşık 2,4 metre) yakınında yaşar, fakat beslenmek için daha uzağa da gider. Çoğunlukla gece aktiftir; açsa gündüz de çıkar.",
          "Ağır bir yerleşmede döşemeli mobilyayı da kullanır, bu yüzden kanepe aramanın parçasıdır, başka bir böcek değildir.",
        ],
      },
      {
        heading: "Tahtakurusu, kokarca, pire, kene mi, hamam böceği mi?",
        paragraphs: [
          "[Evde kokarca böceği](/insects/farosana-sakhlshi) başka bir böcektir: kahverengi marmorlu kokarca daha büyüktür, kalkan biçimli gövdesi vardır, bitkiyle beslenir ve insan kanı emmez. Tahtakurusu pire gibi zıplamaz; sorun pireyse [evde pire](/insects/rtsqilebi-sakhlshi) sayfasına bakın. Ergin kenenin sekiz bacağı, tahtakurusunun altı bacağı vardır; derideki kene [kene ısırığıdır](/insects/tkipis-nakbeni), bu sayfa değildir.",
          "Hamam böceği başka bir ev böceğidir. Onu bulduysanız [evde hamam böceği](/insects/taraknebi-sakhlshi) sayfasını açın. Halı böcekleri dahil başka böcekler tahtakurusuyla kolay karışır; yanlış tanıma onlara yayılma zamanı verir. Yakın türler birbirine benzer, bu yüzden tam türü bazen uzman ayırır. Evdeki diğer böcekler [böcekler](/insects) sayfalarında toplanır.",
        ],
      },
      {
        heading: "Tahtakurusu nasıl uzaklaştırılır?",
        paragraphs: [
          "Uzaklaştırmak, böceği veya izlerini bulmakla başlar; bu, yataktaki tahtakurusu için de geçerlidir. Bu sayfada bir ürün adı yoktur. Rastgele kimyasal kullanmak, hangi böcekle karşı karşıya olduğunuzu bilmenin yerini tutmaz; evden uzaklaştırmak yavaş ve zahmetli olabilir.",
          "Bulduğunuz örneği saklayın. Tahtakurusu uygulaması deneyimi olan bir şirkete başvurun. Böyle bir hizmet genellikle alanı böcek ilacı püskürterek işler. Bu rehber karışım, doz veya evde ısıtma yöntemi vermez. Sorunu erken bulmak önemlidir: küçük bir yerleşme, yayılmış olanın aynısından daha ucuz ve daha kolaydır.",
        ],
      },
      {
        heading: "Ne yapmamalı?",
        list: {
          items: [
            "Dökme, iz çizgisi veya deri fotoğrafını kanıt saymayın.",
            "Ne temiz ne de kirli bir ev, tahtakurusu olup olmadığını söylemez.",
            "Böcek tanınmadan rastgele kimyasal kullanmayın. Yanlış tanıma, tahtakurusuna evde yayılma ya da başka bir eve taşınma zamanı verir.",
            "Gerçekten onu bulmadıysanız bunu kokarca, pire, kene veya hamam böceği sorunu gibi ele almayın.",
          ],
          ordered: false,
        },
        paragraphs: [
          "İşe yarayan uyarı, kaynakların desteklediğidir: böceği doğrulayın, sonra deneyimli yardım alın. Bu sayfadan ilaç veya ısıtma uydurmayın.",
        ],
      },
      {
        heading: "Tahtakurusu ısırığı ne anlama gelir?",
        paragraphs: [
          "Isırık kaşıntı ve uyku bölünmesi yapabilir. Nadiren alerjiye yol açar; buna büyümüş izler, ağrılı şişlik veya anafilaksi dahildir. Tahtakurusunun insana hastalık bulaştırdığı kabul edilmez. İltihap ısırığa tepkidir ve bu tepki böceği adlandırmaya yetmez.",
          "İnsanlar farklı tepki verir. İz hiç olmayabilir, sivrisinek veya pire ısırığı gibi küçük kırmızı bir şişlik olabilir ya da nadiren ağır bir alerji olabilir. Isırığın anında hissetmeyebilirsiniz. Şiddetli kaşımak ikincil bir deri enfeksiyonuna yol açabilir, bu yüzden kaşımayın. Sıradan ısırıklar genellikle tıbbi tedavi gerektirmez.",
          "Alerjik bir tepki düşündüğünüzde bir sağlık kuruluşuna başvurun. Ağır alerji veya solunum güçlüğünde 112'yi arayın. Her kaşıntıda 112'yi aramayın.",
        ],
      },
      {
        heading: "Zararlı kontrol uzmanı ne zaman gerekir?",
        paragraphs: [
          "Canlı böcek, yumurta, dökülmüş deri ya da yukarıda anlatılan koyu lekeler ve renkli izler bulduğunuzda tahtakurusu deneyimi olan bir uzmana başvurun. Tanınması için örneği saklayın. Uzmanın böcek ilacıyla uygulaması, bu kaynakların anlattığı kontrol adımıdır. Bu sayfa bir şirket adı vermez ve tek ziyaretin işi bitireceğini vaat etmez.",
        ],
      },
      {
        heading: "Tahtakurusunu başka yere nasıl taşımazsınız?",
        paragraphs: [
          "Tahtakurusu bavul, çanta, katlanmış giysi, yatak takımı ve mobilyanın içinde saklanarak yayılır. Çoğu kişi fark etmeden taşır. Seyahatte uyuduğunuz yerde yatak ve çarşaf kıvrımlarında dökülmüş deri veya böcek arayın. Evde de aynı izlere bakmaya devam edin. Erken fark etmek yerleşmeyi kontrol etmeyi kolaylaştırır.",
          "Temiz ev bir yöntem değildir ve tahtakurusu bulmak evin kirli olduğu anlamına gelmez. Beş yıldızlı otellerde de yaşarlar. Bir yerin temizliği, orada olup olmadıklarını belirlemez.",
        ],
      },
    ],
    summary:
      "Yatak dikişlerinde, karyola çerçevesinde ve yakındaki çatlaklarda böcek, yumurta, dökülmüş deri veya koyu lekeler arayın. Isırık tahtakurusunu kanıtlamaz. Örneği saklayın ve bir zararlı kontrol uzmanına başvurun. Ağır alerji veya solunum güçlüğünde 112'yi arayın.",
    title: "Evde tahtakurusu — nasıl bulunur ve uzaklaştırılır",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "CDC — About Bed Bugs",
    supports: {
      en: "Itching, sleep loss, and rare allergy including anaphylaxis; bites are not diagnostic and can resemble mosquito or flea bites; not known to spread disease; cleanliness does not decide presence; spread in luggage, clothes, bedding, and furniture; contact an experienced pest-control company, which typically sprays insecticide; check sleeping places when traveling.",
      ka: "ქავილი, ძილის დარღვევა და იშვიათი ალერგია, მათ შორის ანაფილაქსია; ნაკბენი დიაგნოსტიკური არ არის და კოღოს ან რწყილის ნაკბენს ჰგავს; დაავადების გადაცემა ცნობილი არ არის; სისუფთავე არსებობას არ წყვეტს; ვრცელდება ბარგით, ტანსაცმლით, თეთრეულითა და ავეჯით; მიმართეთ გამოცდილ სამსახურს, რომელიც ჩვეულებრივ ინსექტიციდს ასხურებს; მგზავრობისას შეამოწმეთ ძილის ადგილი.",
      ru: "Зуд, потеря сна и редкая аллергия, включая анафилаксию; укус не диагностичен и похож на укус комара или блохи; передача болезней не известна; чистота не решает вопрос присутствия; перенос в багаже, одежде, белье и мебели; обратиться в опытную службу, которая обычно распыляет инсектицид; в поездке проверять место сна.",
      tr: "Kaşıntı, uyku bölünmesi ve anafilaksi dahil nadir alerji; ısırık tanı koydurmaz ve sivrisinek ya da pire ısırığına benzeyebilir; hastalık bulaştırdığı bilinmez; temizlik varlığı belirlemez; bavul, giysi, yatak takımı ve mobilyayla yayılır; genellikle böcek ilacı sıkan deneyimli bir hizmete başvurulur; seyahatte uyku yeri kontrol edilir.",
    },
    url: "https://www.cdc.gov/bed-bugs/about/index.html",
  },
  {
    name: "CDC DPDx — Bed Bugs",
    supports: {
      en: "Bed bugs are not effective disease vectors; bite inflammation is not specific; confirmation is by finding the insect near where the person was bitten.",
      ka: "ბაღლინჯო დაავადების ეფექტური გადამტანი არ არის; ნაკბენის ანთება სპეციფიკური არ არის; დასტურია მწერის პოვნა იქ, სადაც ადამიანს უკბინეს.",
      ru: "Клопы не являются эффективными переносчиками болезней; воспаление от укуса неспецифично; подтверждение — находка насекомого там, где человека укусили.",
      tr: "Tahtakuruları etkili hastalık taşıyıcısı değildir; ısırık iltihabı özgül değildir; doğrulama, kişinin ısırıldığı yerin yakınında böceğin bulunmasıdır.",
    },
    url: "https://www.cdc.gov/dpdx/bedbugs/",
  },
  {
    name: "CDC — Tick Life Cycles",
    supports: {
      en: "An adult tick has eight legs, which separates it from a six-legged bed bug.",
      ka: "ზრდასრულ ტკიპას რვა ფეხი აქვს, რაც მას ექვსფეხა ბაღლინჯოსგან არჩევს.",
      ru: "У взрослого клеща восемь ног, что отличает его от шестиногого клопа.",
      tr: "Ergin kenenin sekiz bacağı vardır; bu, onu altı bacaklı tahtakurusundan ayırır.",
    },
    url: "https://www.cdc.gov/ticks/about/tick-lifecycles.html",
  },
  {
    name: "Ghazarayan et al. 2023 — Cimex lectularius records in Georgia",
    supports: {
      en: "Specimens collected on 30 May 2022 at Gremi church in Kvareli Municipality and a church near Pichkhovani, in old buildings with bat colonies. These sites do not show how common bed bugs are in homes.",
      ka: "ნიმუშები შეგროვდა 2022 წლის 30 მაისს ყვარლის გრემის ეკლესიაში და ფიჩხოვანთან მდებარე ეკლესიაში, ღამურების კოლონიებთან დაკავშირებულ ძველ შენობებში. ეს ადგილები სახლებში სიხშირეს არ გვიჩვენებს.",
      ru: "Образцы собраны 30 мая 2022 года в церкви Греми в Кварели и в церкви у Пичховани, в старых зданиях у колоний летучих мышей. Эти места не показывают частоту в квартирах.",
      tr: "Örnekler 30 Mayıs 2022'de Kvareli'deki Gremi kilisesi ve Piçhovani yakınındaki kilisede, yarasa kolonili eski yapılarda toplandı. Bu yerler evlerdeki sıklığı göstermez.",
    },
    url: "https://doi.org/10.3897/caucasiana.2.e104244",
  },
  {
    name: "US EPA — Bed Bugs Appearance and Life Cycle",
    supports: {
      en: "An adult is about 5–7 mm, flat and oval before feeding; the egg is about 1 mm; development passes five stages, each after a blood meal.",
      ka: "ზრდასრული დაახლოებით 5–7 მმ-ია და კვებამდე ბრტყელი და ოვალურია; კვერცხი დაახლოებით 1 მმ-ია; განვითარება ხუთ საფეხურს გადის და ყოველ საფეხურს სისხლით კვება სჭირდება.",
      ru: "Взрослый около 5–7 мм, до кормления плоский и овальный; яйцо около 1 мм; развитие проходит пять стадий, каждой предшествует кровососание.",
      tr: "Ergin yaklaşık 5–7 mm'dir ve beslenmeden önce yassı ve ovaldir; yumurta yaklaşık 1 mm'dir; gelişim beş evre geçer ve her evreden önce kan emmesi gerekir.",
    },
    url: "https://www.epa.gov/bedbugs/bed-bugs-appearance-and-life-cycle",
  },
  {
    name: "US EPA — Brown Marmorated Stink Bug",
    supports: {
      en: "The brown marmorated stink bug has a shield-shaped body, feeds on plants, and does not suck human blood.",
      ka: "აზიურ ფაროსანას ფარის ფორმის სხეული აქვს, მცენარით იკვებება და ადამიანის სისხლს არ წოვს.",
      ru: "У коричнево-мраморного клопа щитковидное тело, он питается растениями и не сосёт человеческую кровь.",
      tr: "Kahverengi marmorlu kokarcanın kalkan biçimli gövdesi vardır, bitkiyle beslenir ve insan kanı emmez.",
    },
    url: "https://www.epa.gov/safepestcontrol/brown-marmorated-stink-bug",
  },
  {
    name: "US EPA — How to Find Bed Bugs",
    supports: {
      en: "Where to look, including sofas when an infestation is heavy; eggs, shed skins, stains, and dark spots; bites are a poor indicator; a credit-card-wide crack can hide one; finding a small infestation early is easier; misidentification lets them spread.",
      ka: "სად ვეძებოთ, მათ შორის დივანში, როცა ინვაზია ძლიერია; კვერცხი, გამოცვლილი კანი, ლაქები და მუქი წერტილები; ნაკბენი სუსტი ნიშანია; საბანკო ბარათის სისქის ნაპრალშიც ეტევა; მცირე ინვაზიის ადრე პოვნა უფრო იოლია; არასწორი ამოცნობა გავრცელების დროს აძლევს.",
      ru: "Где искать, включая диван при сильном заселении; яйца, шкурки, пятна и тёмные точки; укус — слабый признак; прячется в щели толщиной с карту; раннее обнаружение небольшого заселения проще; ошибка определения даёт время разойтись.",
      tr: "Nereye bakılacağı, ağır yerleşmede kanepe dahil; yumurta, dökülmüş deri, lekeler ve koyu noktalar; ısırık zayıf bir işarettir; banka kartı kalınlığındaki çatlağa sığar; küçük yerleşmeyi erken bulmak daha kolaydır; yanlış tanıma yayılma zamanı verir.",
    },
    url: "https://www.epa.gov/bedbugs/how-find-bed-bugs",
  },
];

export const BED_BUGS_AT_HOME = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Oval reddish-brown wingless insect with a banded abdomen on a cream mattress seam",
      ka: "კრემისფერი ლეიბის ნაკერზე მოთავსებული ოვალური, მოწითალო-ყავისფერი, უფრთო მწერი ზოლებიანი მუცლით",
      ru: "Овальное красновато-коричневое бескрылое насекомое с полосатым брюшком на кремовом шве матраса",
      tr: "Krem rengi yatak dikişinde oval, kırmızımsı kahverengi, kanatsız, şeritli karınlı böcek",
    },
    height: 682,
    src: "https://cdn.reptiles.ge/images/guides/bed-bugs-at-home-hero.jpg",
    width: 1024,
  },
  id: "bed-bugs-at-home",
  images: {
    signs: {
      alt: {
        en: "Oval reddish-brown wingless insect on mattress fabric, beside two pale eggs and a few dark specks",
        ka: "ლეიბის ქსოვილზე მოთავსებული ოვალური, მოწითალო-ყავისფერი, უფრთო მწერი, გვერდით ორი ღია კვერცხი და რამდენიმე მუქი წერტილი",
        ru: "Овальное красновато-коричневое бескрылое насекомое на ткани матраса, рядом два светлых яйца и несколько тёмных точек",
        tr: "Yatak kumaşında oval, kırmızımsı kahverengi, kanatsız böcek; yanında iki açık renkli yumurta ve birkaç koyu nokta",
      },
      height: 768,
      src: "https://cdn.reptiles.ge/images/guides/bed-bugs-at-home-signs.jpg",
      width: 1024,
    },
  },
  messageKey: "bedBugsAtHome",
  ogImage: "https://cdn.reptiles.ge/og/images/guides/bed-bugs-at-home.jpg",
  parentHub: "insects",
  pathname: "/insects/baghlinjo-sakhlshi",
  relatedGuideIds: [
    "bat-in-house",
    "cockroaches-at-home",
    "fleas-in-house",
    "stink-bug-in-house",
  ],
  relatedSpeciesIds: ["cimex-lectularius"],
  search: {
    icon: "guide",
    keywords: [
      "ბაღლინჯო სახლში",
      "ბაღლინჯოს მოშორება",
      "საწოლის ბაღლინჯო",
      "საწოლის ბაღლინჯოს მოშორება",
      "ბაღლინჯოს ნაკბენი",
      "ბაღლინჯოს ფოტო",
      "baghlinjo sakhlshi",
      "bed bugs at home",
      "bed bug removal",
      "клопы в квартире",
      "клопы в диване",
      "клопы в грузии",
      "постельный клоп",
      "evde tahtakurusu",
      "tahtakurusu nasıl yok edilir",
    ],
    rank: 5,
    subtitle: {
      en: "Find the insect, do not trust a bite photo, then call a specialist",
      ka: "მოძებნეთ მწერი, ნაკბენის ფოტოს ნუ ენდობით და მიმართეთ სპეციალისტს",
      ru: "Найдите насекомое, не верьте фото укуса и позовите специалиста",
      tr: "Böceği bulun, ısırık fotoğrafına güvenmeyin, sonra uzman çağırın",
    },
    title: {
      en: "Bed bugs at home",
      ka: "ბაღლინჯო სახლში",
      ru: "Клопы в квартире",
      tr: "Evde tahtakurusu",
    },
  },
  sources: SOURCES,
});
