import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "falseWidow" | "karakurt" | "tarantula";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Found a spider in the house? Learn which spiders live indoors in Georgia, when to be careful about a karakurt, and how to remove a spider without touching it.",
    faq: [
      {
        answer:
          "Almost never. The Burke Museum says spiders have no reason to bite people. If you roll onto a spider in your sleep, it has no chance to bite you: its fangs are underneath, so it would bite the sheet it is standing on. A red spot you find in the morning usually has another cause.",
        question: "Do spiders bite people in their sleep?",
      },
      {
        answer:
          "No. Most spiders eat insects and pose no danger to people. If one is in your way, take it outside with a jar or pick it up with a vacuum cleaner. You can remove even a spider that looks like a karakurt this way, without touching it.",
        question: "Do I need to kill a spider in the house?",
      },
      {
        answer:
          "A cellar is dark and quiet, and the long-bodied cellar spider started out as a cave spider. Today it is common in buildings, cellars included. The more insects a building has, the more spiders stay, so cleaning and clearing clutter help most.",
        question: "Why are there so many spiders in the cellar?",
      },
      {
        answer:
          "No. UC IPM notes that old, dusty webs are often no longer in use. Simply remove such webs with a vacuum cleaner or a broom. Regular cleaning also means fewer new webs.",
        question: "Does every cobweb mean a spider is still there?",
      },
      {
        answer:
          "First look at what kind of spider it is. A pale spider with very long legs in a corner web is the harmless cellar spider, and you can simply remove the web. If it is shiny black with a round abdomen, take the child out of the room and remove the spider with a jar or a vacuum cleaner. If the child is bitten and has strong pain, cramps or sweating, call 112.",
        question: "What should I do about a spider in a child's room?",
      },
    ],
    intro:
      "A spider found in the house is almost never a danger to people. First look at what you are seeing: a long-legged spider in a ceiling corner is harmless, but leave a shiny black spider with a round abdomen alone.",
    metaTitle: "Spider in the house: is it dangerous and how to remove it?",
    sections: [
      {
        heading: "I found a spider in the house: what should I do?",
        paragraphs: [
          "Most spiders found in houses are not dangerous to people and feed on insects. A spider does not try to bite people, so there is no need to kill it. If it is in your way, take it outside with a jar and a sheet of paper, or pick up the spider and its web with a vacuum cleaner.",
          "Remember one exception: a shiny black spider with an almost round abdomen, often with red spots, may be a [karakurt](latrodectus-tredecimguttatus). Do not touch it with your hands. If a spider bites you and you get strong pain, muscle cramps or sweating, call 112.",
        ],
      },
      {
        heading: "What does what you see mean?",
        paragraphs: [
          "The table is a quick guide, not an identification. Spots and colour are not a reliable sign: some karakurts are almost completely black. So do not touch a suspicious spider with your hands.",
        ],
        table: {
          headers: ["What you see", "What it may be", "What to do"],
          rows: [
            [
              "Very long, thin legs, a small body and a messy web in a ceiling corner",
              "Most likely the long-bodied cellar spider",
              "It is harmless: leave it, or vacuum it up with its web",
            ],
            [
              "A shiny black spider with an almost round abdomen and red spots or a stripe",
              "It may be a karakurt or a false black widow",
              "Do not touch it; remove it with a jar or a vacuum cleaner",
            ],
            [
              "A large, darkly patterned spider running across the floor in Kakheti or Kvemo Kartli",
              "It may be a South Russian tarantula",
              "Do not pick it up; take it outside with a jar",
            ],
            [
              "A spider wandering on a wall or the floor in autumn",
              "Often an adult male looking for a female",
              "Leave it, or take it out with a jar",
            ],
            [
              "Red, itchy spots on the skin in the morning",
              "Often not a spider bite at all",
              "Check for bed bugs and fleas; see a doctor if it gets worse",
            ],
          ],
        },
      },
      {
        heading: "Which spider lives in houses?",
        paragraphs: [
          "The best-known spider in houses is the [long-bodied cellar spider](pholcus-phalangioides). Its legs are several times longer than its body, so this small spider looks much larger than it is. It is pale brownish or greyish and hangs upside down in an irregular web in a ceiling corner, a cellar or another quiet, dark place.",
          "It started out as a cave spider, and today it is common in buildings, including houses and cellars. In Georgia it lives in houses, cellars, stairwells, storage rooms and garages. It is not counted among the spiders that are dangerous to people, so if it is not in your way in a corner, you can leave it there.",
        ],
      },
      {
        heading: "Why do you see more spiders in autumn?",
        paragraphs: [
          "According to the Natural History Museum in London, spider sightings in houses peak in autumn. At this time the males of many species become adults and wander around looking for females. In warm weather doors and windows stay open longer, so more of these wandering males get inside.",
          "Spiders do not come in to escape the cold. The Burke Museum at the University of Washington calls this a myth: house spiders are species adapted to living indoors, and generally fewer than 5% of the spiders seen indoors have ever been outdoors. That figure refers to houses in North America.",
          "Spiders get in through cracks and openings, and are sometimes carried in with plants, firewood and boxes. UC IPM notes that the more insects a building has, the more likely spiders are to live there.",
        ],
      },
      {
        heading: "Is a house spider dangerous?",
        paragraphs: [
          "Most are not. UC IPM explains that spiders do not seek out people in order to bite them, and the jaws of most spiders are too small to bite a person. Most bites are no more severe than a bee sting.",
          "According to the Burke Museum, real spider bites are rare. They happen mostly when a spider is trapped in clothing or when someone puts a hand into its hiding place without looking. A spider that is picked up can also bite, so do not catch it with your hands.",
          "In Georgia the most medically significant spider is the karakurt. Read more about it in the guide to [venomous spiders in Georgia](/spiders/shxamiani-obobebi).",
        ],
      },
      {
        heading: "Can a karakurt get into the house?",
        image: "karakurt",
        paragraphs: [
          "The karakurt is not a spider adapted to living in houses. It lives in dry, open places: steppes, semi-desert scrub, and sandy and pebbly ground. It builds its web close to the ground, among stones and low plants. In Georgia it occurs in Kvemo Kartli, Mtskheta-Mtianeti, Tbilisi, Kakheti, Samtskhe-Javakheti and Shida Kartli.",
          "According to UC IPM, its North American relative, the black widow, settles in clutter, garages and woodpiles around homes. So wear gloves when you clear such places, especially in dry areas of eastern Georgia.",
          "The karakurt is a small, shiny black spider with an almost ball-shaped abdomen. Females often have red spots on their backs, but some are almost completely black, so do not rely on the spots alone. Its bite may cause severe pain, muscle cramps, sweating and nausea. If you are bitten, call 112 and read the [spider bite guide](/spiders/obobis-nakbeni).",
        ],
      },
      {
        heading: "How is the false black widow different?",
        image: "falseWidow",
        paragraphs: [
          "The [false black widow](steatoda-paykulliana) is a small, dark spider with a rounded abdomen. A red or yellow stripe often runs along the front of its abdomen, which makes it look like a karakurt. It is not a karakurt, but its bite can also be painful.",
          "It is also a spider of dry places: it lives in dry meadows, on stony slopes and in rock crevices, and only rarely in untended gardens. In Georgia it has been confirmed in Tbilisi, Sighnaghi, Kodiani and Kveda Chkhutuneti. Do not try to tell the two apart up close: treat both the same way and do not touch them with your hands.",
        ],
      },
      {
        heading: "A large spider is running across the floor: what is it?",
        image: "tarantula",
        paragraphs: [
          "In the dry regions of eastern Georgia it may be a [South Russian tarantula](lycosa-singoriensis): a large, darkly patterned wolf spider with strong legs. It does not build a round web and lives on the ground or near the entrance of its burrow. In Georgia it has been confirmed in Kvemo Kartli and Kakheti.",
          "According to UC IPM, adult male wolf spiders and tarantulas wander in search of females. Others leave their burrows because of new construction or because the burrow gets wet in the rainy season. A tarantula bite is usually not life-threatening, but it can cause local pain, redness and swelling. Do not pick it up: take it outside with a jar and a sheet of paper.",
        ],
      },
      {
        heading: "How do you get a spider out of the house?",
        list: {
          items: [
            "Cover the spider with a jar or a glass.",
            "Carefully slide a sheet of stiff paper or card under the jar.",
            "Carry the jar out with the paper and release the spider away from the house, in a natural spot.",
            "If the spider is high up or there are many webs, pick up the spider and its webs with a vacuum cleaner.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM recommends both methods. Neither one needs you to touch the spider, which matters for a spider that looks like a karakurt too. A spider sucked into a vacuum cleaner usually does not survive the trip through the hose.",
        ],
      },
      {
        heading: "How do you keep fewer spiders in the house?",
        list: {
          items: [
            "Regularly vacuum or sweep windows, room corners, storage rooms and the cellar.",
            "Clear clutter in the garage, shed and cellar; keep boxes off the floor, away from walls, and closed.",
            "Seal cracks and gaps around windows and doors.",
            "Fit screens on the windows: they keep out spiders and the insects spiders feed on.",
            "Keep outdoor lights away from windows and doors: light attracts insects, and insects attract spiders.",
            "Clear leaves and rubbish from around the foundation, and keep plants away from the walls.",
            "Wear gloves when you sort through clutter or firewood.",
          ],
        },
        paragraphs: [
          "These tips come from UC IPM. The fewer insects and hiding places a house has, the fewer spiders stay in it.",
        ],
      },
      {
        heading: "Do you need an insecticide?",
        paragraphs: [
          "Usually not. According to UC IPM, insecticides do not reduce spiders for long: spraying works only for a while unless you also clean up and remove hiding places. Without seeing the spider, it is hard to get rid of it with a spray at all.",
          "Removing a spider with a vacuum cleaner or a jar is just as easy and much less toxic. If you use traps, put sticky traps where children and pets cannot reach them.",
        ],
      },
      {
        heading: "Was it a spider bite or something else?",
        paragraphs: [
          "A red spot or sore found in the morning is often not a spider bite. According to the Burke Museum, such bumps and sores are usually caused by other skin conditions, including MRSA bacteria. UC IPM writes that people and their doctors often blame spiders for skin lesions with no proof that a spider was involved.",
          "Ticks, fleas, bed bugs and mosquitoes bite far more often. If the rash keeps coming back, check for [bed bugs](/insects/baghlinjo-sakhlshi) and [fleas](/insects/rtsqilebi-sakhlshi). Keep a bite clean and do not scratch it. If the pain gets stronger, the swelling grows, breathing becomes difficult or you feel worse overall, call 112.",
        ],
      },
    ],
    summary:
      "Most spiders found in houses are not dangerous and eat insects. Do not catch one with your hands: take it outside with a jar and paper or pick it up with a vacuum cleaner. Cleaning, less clutter, sealed gaps and window screens keep spiders down. Leave a shiny black spider with a round abdomen alone: it may be a karakurt. If a bite brings strong pain, cramps or sweating, call 112.",
    title: "Spider in the house: what should I do?",
  },
  ka: {
    description:
      "სახლში ობობა ნახეთ? გაიგეთ, რომელი ობობები ცხოვრობს სახლებში, როდის უნდა იყოთ ფრთხილად ყარაყურთთან და როგორ გაიყვანოთ ობობა ხელის შეხების გარეშე.",
    faq: [
      {
        answer:
          "თითქმის არასდროს. ბერკის მუზეუმის მიხედვით, ობობას ადამიანის კბენის მიზეზი არ აქვს. თუ ძილში ობობაზე გადაბრუნდებით, კბენის შანსი არ ექნება: ყბები სხეულის ქვეშ აქვს, ამიტომ ზეწარს უკბენს, რომელზეც დგას. დილით აღმოჩენილი წითელი წერტილი ჩვეულებრივ სხვა მიზეზით ჩნდება.",
        question: "ობობა ძილში კბენს?",
      },
      {
        answer:
          "არა. ობობების უმეტესობა მწერებით იკვებება და ადამიანს საფრთხეს არ უქმნის. თუ ხელს გიშლით, ქილით გაიყვანეთ გარეთ ან მტვერსასრუტით აიღეთ. ასე ყარაყურთის მსგავს ობობასაც ხელის შეხების გარეშე მოიშორებთ.",
        question: "სახლში ობობის მოკვლა საჭიროა?",
      },
      {
        answer:
          "სარდაფი ბნელი და მშვიდია, გრძელფეხა ფოლკუსი კი თავდაპირველად მღვიმის ობობა იყო. დღეს შენობებში ხშირია, მათ შორის სარდაფებში. რაც მეტი მწერია შენობაში, მით მეტი ობობა რჩება, ამიტომ ყველაზე მეტად დასუფთავება და ხარახურის მოშორება შველის.",
        question: "სარდაფში რატომ არის ამდენი ობობა?",
      },
      {
        answer:
          "არა. UC IPM წერს, რომ ძველი, მტვრიანი ქსელი ხშირად აღარ გამოიყენება. ასეთი ქსელი უბრალოდ მტვერსასრუტით ან ცოცხით მოაშორეთ. რეგულარული დასუფთავება ახალ ქსელებსაც ამცირებს.",
        question: "ყოველი ქსელი ნიშნავს, რომ ობობა ჯერ კიდევ იქაა?",
      },
      {
        answer:
          "ჯერ დახედეთ, როგორი ობობაა. ფერმკრთალი, ძალიან გრძელფეხა ობობა კუთხის ქსელში უვნებელი ფოლკუსია და ქსელის მოშორებაც საკმარისია. თუ პრიალა შავია, მრგვალი მუცლით, ბავშვი ოთახიდან გაიყვანეთ და ობობა ქილით ან მტვერსასრუტით მოაშორეთ. თუ ბავშვს უკბინა და ძლიერი ტკივილი, კრუნჩხვა ან ოფლიანობა აქვს, დარეკეთ 112-ზე.",
        question: "ბავშვის ოთახში ობობა ვიპოვე. რა ვქნა?",
      },
    ],
    intro:
      "სახლში ნაპოვნი ობობა ადამიანისთვის თითქმის არასდროს არის საშიში. ჯერ დააკვირდით, რას ხედავთ: გრძელფეხა ობობა ჭერის კუთხეში უვნებელია, პრიალა შავ ობობას მრგვალი მუცლით კი ხელს ნუ ახლებთ.",
    metaTitle: "ობობა სახლში: საშიშია და როგორ გავიყვანოთ?",
    sections: [
      {
        heading: "სახლში ობობა ვნახე — რა ვქნა?",
        paragraphs: [
          "სახლში ნანახი ობობების უმეტესობა ადამიანისთვის საშიში არ არის და მწერებით იკვებება. ობობა ადამიანის კბენას არ ცდილობს, ამიტომ მისი მოკვლა საჭირო არ არის. თუ ხელს გიშლით, ქილითა და ქაღალდით გაიყვანეთ გარეთ ან მტვერსასრუტით აიღეთ ობობაც და ქსელიც.",
          "ერთი გამონაკლისი დაიმახსოვრეთ: პრიალა შავი ობობა თითქმის მრგვალი მუცლით, ხშირად წითელი ლაქებით, შეიძლება [ყარაყურთი](latrodectus-tredecimguttatus) იყოს. მას ხელით ნუ შეეხებით. თუ ობობამ გიკბინათ და ძლიერი ტკივილი, კუნთების კრუნჩხვა ან ოფლიანობა დაგეწყოთ, დარეკეთ 112-ზე.",
        ],
      },
      {
        heading: "რას ნიშნავს ის, რასაც ხედავთ?",
        paragraphs: [
          "ცხრილი სწრაფი ორიენტირია და არა ამოცნობა. ლაქები და ფერი სანდო ნიშანი არ არის: ზოგი ყარაყურთი თითქმის მთლიანად შავია. ამიტომ საეჭვო ობობას ხელით ნუ შეეხებით.",
        ],
        table: {
          headers: ["რას ხედავთ", "რა შეიძლება იყოს", "რა ვქნათ"],
          rows: [
            [
              "ძალიან გრძელი, თხელი ფეხები, პატარა სხეული და უსწორმასწორო ქსელი ჭერის კუთხეში",
              "სავარაუდოდ, გრძელფეხა ფოლკუსი",
              "უვნებელია: დატოვეთ ან მტვერსასრუტით აიღეთ ქსელიანად",
            ],
            [
              "პრიალა შავი ობობა თითქმის მრგვალი მუცლით და წითელი ლაქებით ან ზოლით",
              "შეიძლება ყარაყურთი ან ცრუ ყარაყურთი იყოს",
              "ხელით ნუ შეეხებით; მოაშორეთ ქილით ან მტვერსასრუტით",
            ],
            [
              "დიდი, მუქად მოხატული ობობა იატაკზე დარბის, კახეთში ან ქვემო ქართლში",
              "შეიძლება ტარანტული იყოს",
              "ხელით ნუ აიყვანთ; ქილით გაიყვანეთ გარეთ",
            ],
            [
              "შემოდგომით კედელზე ან იატაკზე მოხეტიალე ობობა",
              "ხშირად ზრდასრული მამრია, რომელიც მდედრს ეძებს",
              "დატოვეთ ან ქილით გაიყვანეთ",
            ],
            [
              "დილით კანზე წითელი, მქავანა წერტილები",
              "ხშირად ობობის ნაკბენი სულაც არ არის",
              "შეამოწმეთ ბაღლინჯო და რწყილი; გაუარესებისას მიმართეთ ექიმს",
            ],
          ],
        },
      },
      {
        heading: "რომელი ობობა ცხოვრობს სახლში?",
        paragraphs: [
          "სახლებში ყველაზე ცნობილი ობობა [გრძელფეხა ფოლკუსია](pholcus-phalangioides). ფეხები სხეულზე რამდენჯერმე გრძელი აქვს, ამიტომ ეს პატარა ობობა გაცილებით დიდი ჩანს. ფერმკრთალი მოყავისფრო ან მონაცრისფროა და ჭერის კუთხეში, სარდაფში ან სხვა მშვიდ, ბნელ ადგილას უსწორმასწორო ქსელში თავდაყირა ჰკიდია.",
          "თავდაპირველად მღვიმის ობობა იყო, დღეს კი შენობებში ხშირია, მათ შორის სახლებსა და სარდაფებში. საქართველოში სახლებში, სარდაფებში, სადარბაზოებში, საკუჭნაოებსა და ავტოფარეხებში ცხოვრობს. ადამიანისთვის საშიშ ობობად არ ითვლება, ამიტომ თუ კუთხეში ხელს არ გიშლით, შეგიძლიათ დატოვოთ.",
        ],
      },
      {
        heading: "რატომ ჩანს შემოდგომით მეტი ობობა?",
        paragraphs: [
          "ლონდონის ბუნების ისტორიის მუზეუმის მიხედვით, სახლში ობობებს ყველაზე ხშირად შემოდგომით ხედავენ. ამ დროს ბევრი სახეობის მამრი ზრდასრული ხდება და მდედრის საძებნელად დაეხეტება. თბილ ამინდში კარი და ფანჯარა დიდხანს ღიაა, ამიტომ მოხეტიალე მამრები სახლში უფრო ხშირად შედიან.",
          "ობობები სიცივეს არ გაურბიან. ვაშინგტონის უნივერსიტეტის ბერკის მუზეუმი ამას მითს უწოდებს: სახლის ობობები შენობაში ცხოვრებას შეგუებული სახეობებია, და სახლში ნანახი ობობების ჩვეულებრივ 5%-ზე ნაკლები ყოფილა ოდესმე გარეთ. ეს მონაცემი ჩრდილოეთ ამერიკის სახლებს ეხება.",
          "ობობა ბზარებითა და ღიობებით შედის, ზოგჯერ კი მცენარეებთან, შეშასა და ყუთებთან ერთად შემოაქვთ. UC IPM წერს, რომ რაც მეტი მწერია შენობაში, მით უფრო სავარაუდოა, რომ იქ ობობებიც დასახლდებიან.",
        ],
      },
      {
        heading: "საშიშია სახლის ობობა?",
        paragraphs: [
          "უმეტესობა არა. UC IPM განმარტავს, რომ ობობა ადამიანს საკბენად არ ეძებს, ობობების უმეტესობის ყბები კი ადამიანის საკბენად ძალიან პატარაა. ნაკბენების უმეტესობა ფუტკრის ნესტარზე მძიმე არ არის.",
          "ბერკის მუზეუმის მიხედვით, ობობის ნამდვილი ნაკბენი იშვიათია. ძირითადად მაშინ ხდება, როცა ობობა ტანსაცმელში მოიმწყვდევა ან ადამიანი დაუხედავად ჰყოფს ხელს მის თავშესაფარში. ხელში აყვანილმა ობობამაც შეიძლება უკბინოს, ამიტომ ხელით ნუ დაიჭერთ.",
          "საქართველოში სამედიცინოდ ყველაზე მნიშვნელოვანი ობობა ყარაყურთია. მასზე ვრცლად წაიკითხეთ გზამკვლევში [შხამიანი ობობები საქართველოში](/spiders/shxamiani-obobebi).",
        ],
      },
      {
        heading: "შეიძლება სახლში ყარაყურთი შემოვიდეს?",
        image: "karakurt",
        paragraphs: [
          "ყარაყურთი სახლში ცხოვრებას შეგუებული ობობა არ არის. მშრალ, ღია ადგილებში ცხოვრობს: სტეპებში, ნახევრად უდაბნოს ბუჩქნარში, ქვიშიან და ხრეშიან ადგილებში. ქსელს მიწასთან ახლოს, ქვებსა და დაბალ მცენარეებს შორის აბამს. საქართველოში ქვემო ქართლში, მცხეთა-მთიანეთში, თბილისში, კახეთში, სამცხე-ჯავახეთსა და შიდა ქართლში გვხვდება.",
          "UC IPM-ის მიხედვით, მისი ჩრდილოამერიკელი ნათესავი, შავი ქვრივი, სახლების გარშემო ხარახურაში, ავტოფარეხებსა და შეშის გროვებში სახლდება. ამიტომ ასეთი ადგილების დალაგებისას ხელთათმანი ჩაიცვით, განსაკუთრებით აღმოსავლეთ საქართველოს მშრალ რაიონებში.",
          "ყარაყურთი პატარა, პრიალა შავი ობობაა, თითქმის ბურთივით მრგვალი მუცლით. მდედრს ზურგზე ხშირად წითელი ლაქები აქვს, მაგრამ ზოგი თითქმის მთლიანად შავია, ამიტომ მხოლოდ ლაქებს ნუ ენდობით. მისმა ნაკბენმა შეიძლება ძლიერი ტკივილი, კუნთების კრუნჩხვა, ოფლიანობა და გულისრევა გამოიწვიოს. ნაკბენისას დარეკეთ 112-ზე და წაიკითხეთ [ობობის ნაკბენის გზამკვლევი](/spiders/obobis-nakbeni).",
        ],
      },
      {
        heading: "რით განსხვავდება ცრუ ყარაყურთი?",
        image: "falseWidow",
        paragraphs: [
          "[ცრუ ყარაყურთი](steatoda-paykulliana) პატარა, მუქი ობობაა მომრგვალებული მუცლით. მუცლის წინა ნაწილს ხშირად წითელი ან ყვითელი ზოლი მიუყვება, ამიტომ ყარაყურთს ჰგავს. ყარაყურთი არ არის, მაგრამ მისი ნაკბენიც შეიძლება მტკივნეული იყოს.",
          "ისიც მშრალი ადგილების ობობაა: მშრალ მდელოებზე, ქვიან ფერდობებსა და კლდის ნაპრალებში ცხოვრობს, მოუვლელ ბაღებში კი იშვიათად. საქართველოში დადასტურებულია თბილისში, სიღნაღში, კოდიანსა და ქვედა ჩხუტუნეთში. ახლოდან მათ გარჩევას ნუ შეეცდებით: ორივეს ერთნაირად მოეპყარით და ხელით ნუ შეეხებით.",
        ],
      },
      {
        heading: "იატაკზე დიდი ობობა დარბის — რა არის?",
        image: "tarantula",
        paragraphs: [
          "აღმოსავლეთ საქართველოს მშრალ რეგიონებში ეს შეიძლება [ტარანტული](lycosa-singoriensis) იყოს: დიდი, მუქად მოხატული მგლის ობობა ძლიერი ფეხებით. მრგვალ ქსელს არ აბამს და მიწაზე ან სოროს შესასვლელთან ცხოვრობს. საქართველოში ქვემო ქართლსა და კახეთშია დადასტურებული.",
          "UC IPM-ის მიხედვით, მგლის ობობებისა და ტარანტულების ზრდასრული მამრები მდედრის საძებნელად დაეხეტებიან. ზოგი ობობა სოროს ახალი მშენებლობის გამო ტოვებს, ზოგი კი იმიტომ, რომ წვიმიან სეზონში სორო დაუსველდა. ტარანტულის ნაკბენი ჩვეულებრივ სიცოცხლისთვის საშიში არ არის, მაგრამ შეიძლება ადგილობრივი ტკივილი, სიწითლე და შეშუპება გამოიწვიოს. ხელით ნუ აიყვანთ: ქილითა და ქაღალდით გაიყვანეთ გარეთ.",
        ],
      },
      {
        heading: "როგორ გავიყვანოთ ობობა სახლიდან?",
        list: {
          items: [
            "ობობას ზემოდან ქილა ან ჭიქა დააფარეთ.",
            "ქილის ქვეშ ფრთხილად შეაცურეთ სქელი ქაღალდი ან მუყაო.",
            "ქილა ქაღალდთან ერთად გაიტანეთ და ობობა სახლიდან მოშორებით, ბუნებრივ ადგილას გაუშვით.",
            "თუ ობობა მაღლაა ან ბევრი ქსელია, მტვერსასრუტით აიღეთ ობობაც და ქსელიც.",
          ],
          ordered: true,
        },
        paragraphs: [
          "ორივე ხერხს UC IPM გირჩევთ. ორივე შემთხვევაში ობობას ხელით არ ეხებით, რაც ყარაყურთის მსგავსი ობობის შემთხვევაშიც მნიშვნელოვანია. მტვერსასრუტის მილში მოხვედრილი ობობა ჩვეულებრივ ვერ გადარჩება.",
        ],
      },
      {
        heading: "როგორ შევამციროთ ობობები სახლში?",
        list: {
          items: [
            "რეგულარულად გაწმინდეთ მტვერსასრუტით ან ცოცხით ფანჯრები, ოთახის კუთხეები, საკუჭნაო და სარდაფი.",
            "მოაშორეთ ხარახურა ავტოფარეხს, ფარდულსა და სარდაფს; ყუთები იატაკს და კედელს მოაშორეთ და დახურეთ.",
            "ამოავსეთ ბზარები და ღრიჭოები ფანჯრებისა და კარების გარშემო.",
            "ფანჯრებზე ბადეები დააყენეთ: ისინი ობობებსაც აკავებენ და მწერებსაც, რომლებითაც ობობა იკვებება.",
            "გარე განათება ფანჯრებსა და კარს მოაშორეთ: სინათლე მწერებს იზიდავს, მწერები კი ობობებს.",
            "სახლის ძირს მოაშორეთ ფოთლები და ნაგავი, მცენარეები კი კედლებს მოაშორეთ.",
            "ხარახურისა და შეშის დალაგებისას ხელთათმანი ჩაიცვით.",
          ],
        },
        paragraphs: [
          "ეს რჩევები UC IPM-ისაა. რაც ნაკლები მწერი და თავშესაფარია სახლში, მით ნაკლები ობობა რჩება.",
        ],
      },
      {
        heading: "ინსექტიციდი საჭიროა?",
        paragraphs: [
          "როგორც წესი, არა. UC IPM-ის მიხედვით, ინსექტიციდი ობობებს დიდი ხნით ვერ ამცირებს: შესხურება დროებით მოქმედებს, თუ სახლს არ დაალაგებთ და თავშესაფრებს არ მოაშორებთ. ობობის დანახვის გარეშე მისი შესხურებით მოშორება საერთოდ ძნელია.",
          "ობობის მოშორება მტვერსასრუტით ან ქილით ისევე ადვილია და გაცილებით ნაკლებად ტოქსიკური. თუ ხაფანგს იყენებთ, წებოვანი ხაფანგი იქ დადგით, სადაც ბავშვი და შინაური ცხოველი ვერ მისწვდება.",
        ],
      },
      {
        heading: "ობობამ მიკბინა თუ სხვა რამემ?",
        paragraphs: [
          "დილით აღმოჩენილი წითელი წერტილი ან წყლული ხშირად ობობის ნაკბენი არ არის. ბერკის მუზეუმის მიხედვით, ასეთი გამონაყარი და წყლულები ჩვეულებრივ კანის სხვა დაავადებებითაა გამოწვეული, მათ შორის MRSA ბაქტერიით. UC IPM წერს, რომ ადამიანები და ექიმებიც ხშირად ობობას აბრალებენ კანის დაზიანებას, თუმცა ობობის მონაწილეობის მტკიცებულება არ აქვთ.",
          "ტკიპი, რწყილი, ბაღლინჯო და კოღო გაცილებით ხშირად კბენენ. თუ გამონაყარი მეორდება, შეამოწმეთ [ბაღლინჯო](/insects/baghlinjo-sakhlshi) და [რწყილი](/insects/rtsqilebi-sakhlshi). ნაკბენი სუფთად შეინახეთ და ნუ მოიფხანთ. თუ ტკივილი ძლიერდება, შეშუპება იზრდება, სუნთქვა გიძნელდებათ ან თავს უარესად გრძნობთ, დარეკეთ 112-ზე.",
        ],
      },
    ],
    summary:
      "სახლში ნანახი ობობების უმეტესობა საშიში არ არის და მწერებს ჭამს. ხელით ნუ დაიჭერთ: გაიყვანეთ ქილითა და ქაღალდით ან მტვერსასრუტით აიღეთ. ობობებს ამცირებს დასუფთავება, ნაკლები ხარახურა, ამოვსებული ღრიჭოები და ფანჯრის ბადეები. პრიალა შავ ობობას მრგვალი მუცლით ხელს ნუ ახლებთ: შეიძლება ყარაყურთი იყოს. თუ ნაკბენის შემდეგ ძლიერი ტკივილი, კრუნჩხვა ან ოფლიანობა დაგეწყოთ, დარეკეთ 112-ზე.",
    title: "ობობა სახლში: რა ვქნა?",
  },
  ru: {
    description:
      "Нашли паука в доме? Узнайте, какие пауки живут в домах в Грузии, когда стоит опасаться каракурта и как вынести паука, не касаясь его руками.",
    faq: [
      {
        answer:
          "Почти никогда. По данным музея Бёрка, у пауков нет причин кусать людей. Если во сне вы перевернётесь на паука, укусить вас он не сможет: хелицеры у него снизу, поэтому он укусит простыню, на которой стоит. Красная точка, замеченная утром, обычно появляется по другой причине.",
        question: "Кусают ли пауки во сне?",
      },
      {
        answer:
          "Нет. Большинство пауков питается насекомыми и не опасно для людей. Если паук мешает, вынесите его в банке или соберите пылесосом. Так можно убрать даже паука, похожего на каракурта, не касаясь его.",
        question: "Нужно ли убивать паука в доме?",
      },
      {
        answer:
          "Подвал тёмный и тихий, а длинноногий фолкус изначально был пещерным пауком. Сегодня он обычен в зданиях, в том числе в подвалах. Чем больше в здании насекомых, тем больше пауков в нём остаётся, поэтому лучше всего помогают уборка и разбор хлама.",
        question: "Почему в подвале так много пауков?",
      },
      {
        answer:
          "Нет. UC IPM пишет, что старая пыльная паутина часто уже не используется. Такую паутину просто уберите пылесосом или веником. Регулярная уборка уменьшает и количество новой паутины.",
        question: "Значит ли любая паутина, что паук ещё там?",
      },
      {
        answer:
          "Сначала посмотрите, какой это паук. Бледный паук с очень длинными ногами в паутине в углу — безобидный фолкус, и достаточно убрать паутину. Если паук блестящий чёрный с круглым брюшком, выведите ребёнка из комнаты и уберите паука банкой или пылесосом. Если ребёнка укусили и у него сильная боль, судороги или потливость, звоните 112.",
        question: "Что делать с пауком в детской комнате?",
      },
    ],
    intro:
      "Паук, найденный в доме, почти никогда не опасен для людей. Сначала присмотритесь: длинноногий паук в углу потолка безобиден, а блестящего чёрного паука с круглым брюшком не трогайте.",
    metaTitle: "Паук в доме: опасен ли он и как его вынести?",
    sections: [
      {
        heading: "Я нашёл паука в доме — что делать?",
        paragraphs: [
          "Большинство пауков, которых находят в домах, не опасны для людей и питаются насекомыми. Паук не пытается укусить человека, поэтому убивать его не нужно. Если он мешает, вынесите его на улицу в банке с листом бумаги или соберите пылесосом паука вместе с паутиной.",
          "Запомните одно исключение: блестящий чёрный паук с почти круглым брюшком, часто с красными пятнами, может быть [каракуртом](latrodectus-tredecimguttatus). Не трогайте его руками. Если паук укусил и началась сильная боль, мышечные судороги или потливость, звоните 112.",
        ],
      },
      {
        heading: "Что означает то, что вы видите?",
        paragraphs: [
          "Таблица — быстрый ориентир, а не определение вида. Пятна и окраска — ненадёжный признак: некоторые каракурты почти полностью чёрные. Поэтому не трогайте подозрительного паука руками.",
        ],
        table: {
          headers: ["Что вы видите", "Что это может быть", "Что делать"],
          rows: [
            [
              "Очень длинные тонкие ноги, маленькое тело и неровная паутина в углу потолка",
              "Скорее всего, длинноногий фолкус",
              "Он безобиден: оставьте его или соберите пылесосом вместе с паутиной",
            ],
            [
              "Блестящий чёрный паук с почти круглым брюшком и красными пятнами или полосой",
              "Это может быть каракурт или ложный каракурт",
              "Не трогайте руками; уберите банкой или пылесосом",
            ],
            [
              "Крупный тёмно-пёстрый паук бегает по полу в Кахетии или Квемо-Картли",
              "Это может быть южнорусский тарантул",
              "Не берите в руки; вынесите на улицу в банке",
            ],
            [
              "Осенью паук бродит по стене или полу",
              "Часто это взрослый самец, который ищет самку",
              "Оставьте его или вынесите в банке",
            ],
            [
              "Утром на коже красные зудящие точки",
              "Часто это вовсе не укус паука",
              "Проверьте, нет ли клопов и блох; при ухудшении обратитесь к врачу",
            ],
          ],
        },
      },
      {
        heading: "Какой паук живёт в домах?",
        paragraphs: [
          "Самый известный паук в домах — [длинноногий фолкус](pholcus-phalangioides). Ноги у него в несколько раз длиннее тела, поэтому этот небольшой паук кажется намного крупнее. Он бледно-бурый или сероватый и висит вниз спиной в неправильной паутине в углу потолка, в подвале или в другом тихом тёмном месте.",
          "Изначально это был пещерный паук, а сегодня он обычен в зданиях, в том числе в домах и подвалах. В Грузии он живёт в домах, подвалах, подъездах, кладовках и гаражах. Опасным для людей он не считается, поэтому если в углу он вам не мешает, его можно оставить.",
        ],
      },
      {
        heading: "Почему осенью пауков становится больше?",
        paragraphs: [
          "По данным Музея естественной истории в Лондоне, чаще всего пауков в домах замечают осенью. В это время самцы многих видов становятся взрослыми и бродят в поисках самок. В тёплую погоду двери и окна дольше открыты, поэтому бродячие самцы чаще попадают в дом.",
          "Пауки не прячутся в домах от холода. Музей Бёрка Вашингтонского университета называет это мифом: домовые пауки — виды, приспособленные к жизни в помещениях, и обычно меньше 5% пауков, которых видят в доме, когда-либо бывали снаружи. Эта цифра относится к домам Северной Америки.",
          "Пауки попадают в дом через щели и отверстия, а иногда их заносят вместе с растениями, дровами и коробками. UC IPM пишет, что чем больше в здании насекомых, тем вероятнее, что там поселятся и пауки.",
        ],
      },
      {
        heading: "Опасен ли домовый паук?",
        paragraphs: [
          "Большинство — нет. UC IPM объясняет, что пауки не ищут людей, чтобы укусить, а хелицеры у большинства пауков слишком малы, чтобы прокусить кожу человека. Большинство укусов не тяжелее ужаления пчелы.",
          "По данным музея Бёрка, настоящие укусы пауков редки. Чаще всего они случаются, когда паук оказывается зажат в одежде или когда человек, не глядя, суёт руку в его укрытие. Паук, которого взяли в руки, тоже может укусить, поэтому не ловите его руками.",
          "Самый значимый с медицинской точки зрения паук в Грузии — каракурт. Подробнее о нём читайте в руководстве [ядовитые пауки Грузии](/spiders/shxamiani-obobebi).",
        ],
      },
      {
        heading: "Может ли каракурт попасть в дом?",
        image: "karakurt",
        paragraphs: [
          "Каракурт не приспособлен к жизни в домах. Он живёт в сухих открытых местах: в степях, полупустынных кустарниках, на песчаных и галечных участках. Паутину плетёт близко к земле, среди камней и низких растений. В Грузии встречается в Квемо-Картли, Мцхета-Мтианети, Тбилиси, Кахетии, Самцхе-Джавахети и Шида-Картли.",
          "По данным UC IPM, его североамериканский родственник, чёрная вдова, селится вокруг домов в хламе, гаражах и дровяных поленницах. Поэтому разбирайте такие места в перчатках, особенно в сухих районах Восточной Грузии.",
          "Каракурт — небольшой блестящий чёрный паук с почти шарообразным брюшком. У самок на спине часто есть красные пятна, но некоторые почти полностью чёрные, поэтому не полагайтесь только на пятна. Его укус может вызвать сильную боль, мышечные судороги, потливость и тошноту. При укусе звоните 112 и прочитайте [руководство по укусу паука](/spiders/obobis-nakbeni).",
        ],
      },
      {
        heading: "Чем отличается ложный каракурт?",
        image: "falseWidow",
        paragraphs: [
          "[Ложный каракурт](steatoda-paykulliana) — небольшой тёмный паук с округлым брюшком. По передней части брюшка у него часто проходит красная или жёлтая полоса, поэтому он похож на каракурта. Каракуртом он не является, но его укус тоже может быть болезненным.",
          "Это тоже паук сухих мест: он живёт на сухих лугах, каменистых склонах и в скальных трещинах, а в заброшенных садах встречается редко. В Грузии он подтверждён в Тбилиси, Сигнахи, Кодиани и Кведа-Чхутунети. Не пытайтесь различить их вблизи: обращайтесь с обоими одинаково и не трогайте руками.",
        ],
      },
      {
        heading: "По полу бегает крупный паук — кто это?",
        image: "tarantula",
        paragraphs: [
          "В сухих районах Восточной Грузии это может быть [южнорусский тарантул](lycosa-singoriensis): крупный тёмно-пёстрый паук-волк с сильными ногами. Круглую сеть он не плетёт и живёт на земле или у входа в нору. В Грузии он подтверждён в Квемо-Картли и Кахетии.",
          "По данным UC IPM, взрослые самцы пауков-волков и тарантулов бродят в поисках самок. Другие покидают норы из-за новой стройки или потому, что нора намокла в сезон дождей. Укус тарантула обычно не опасен для жизни, но может вызвать местную боль, покраснение и отёк. Не берите его в руки: вынесите на улицу в банке с листом бумаги.",
        ],
      },
      {
        heading: "Как вынести паука из дома?",
        list: {
          items: [
            "Накройте паука банкой или стаканом.",
            "Осторожно подсуньте под банку лист плотной бумаги или картона.",
            "Вынесите банку вместе с бумагой и выпустите паука подальше от дома, в естественном месте.",
            "Если паук высоко или паутины много, соберите пылесосом и паука, и паутину.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM рекомендует оба способа. Ни в одном из них не нужно касаться паука руками, что важно и для паука, похожего на каракурта. Паук, попавший в шланг пылесоса, обычно не выживает.",
        ],
      },
      {
        heading: "Как сделать так, чтобы пауков в доме было меньше?",
        list: {
          items: [
            "Регулярно убирайте пылесосом или веником окна, углы комнат, кладовые и подвал.",
            "Разберите хлам в гараже, сарае и подвале; держите коробки закрытыми, не на полу и не у стен.",
            "Заделайте щели и зазоры вокруг окон и дверей.",
            "Поставьте на окна сетки: они задерживают и пауков, и насекомых, которыми пауки питаются.",
            "Уберите наружное освещение подальше от окон и дверей: свет привлекает насекомых, а насекомые — пауков.",
            "Уберите листья и мусор у фундамента, а растения — подальше от стен.",
            "Разбирая хлам или дрова, надевайте перчатки.",
          ],
        },
        paragraphs: [
          "Эти советы даёт UC IPM. Чем меньше в доме насекомых и укрытий, тем меньше в нём остаётся пауков.",
        ],
      },
      {
        heading: "Нужен ли инсектицид?",
        paragraphs: [
          "Как правило, нет. По данным UC IPM, инсектициды не сокращают число пауков надолго: обработка действует лишь временно, если не навести порядок и не убрать укрытия. Не видя паука, избавиться от него распылением вообще трудно.",
          "Убрать паука пылесосом или банкой так же просто и гораздо менее токсично. Если пользуетесь ловушками, ставьте клеевые ловушки туда, куда не доберутся дети и домашние животные.",
        ],
      },
      {
        heading: "Это укус паука или что-то другое?",
        paragraphs: [
          "Красная точка или язвочка, замеченная утром, часто не укус паука. По данным музея Бёрка, такие бугорки и язвочки обычно вызваны другими заболеваниями кожи, в том числе бактерией MRSA. UC IPM пишет, что люди и даже врачи часто обвиняют пауков в поражениях кожи без доказательств, что паук был причастен.",
          "Клещи, блохи, постельные клопы и комары кусают гораздо чаще. Если сыпь повторяется, проверьте, нет ли [постельных клопов](/insects/baghlinjo-sakhlshi) и [блох](/insects/rtsqilebi-sakhlshi). Держите место укуса в чистоте и не расчёсывайте его. Если боль усиливается, отёк растёт, становится трудно дышать или общее состояние ухудшается, звоните 112.",
        ],
      },
    ],
    summary:
      "Большинство пауков в домах не опасны и едят насекомых. Не ловите паука руками: вынесите его в банке с бумагой или соберите пылесосом. Пауков становится меньше благодаря уборке, меньшему количеству хлама, заделанным щелям и сеткам на окнах. Блестящего чёрного паука с круглым брюшком не трогайте: это может быть каракурт. Если после укуса началась сильная боль, судороги или потливость, звоните 112.",
    title: "Паук в доме: что делать?",
  },
  tr: {
    description:
      "Evde örümcek mi buldunuz? Evlerde hangi örümceklerin yaşadığını, karakurta ne zaman dikkat etmeniz gerektiğini ve örümceği dokunmadan nasıl çıkaracağınızı öğrenin.",
    faq: [
      {
        answer:
          "Neredeyse hiç. Burke Müzesi'ne göre örümceklerin insanı ısırmak için bir nedeni yoktur. Uykunuzda bir örümceğin üzerine dönerseniz sizi ısırma şansı olmaz: dişleri gövdesinin altındadır, bu yüzden üzerinde durduğu çarşafı ısırır. Sabah fark ettiğiniz kırmızı nokta genellikle başka bir nedenle ortaya çıkar.",
        question: "Örümcekler uykuda ısırır mı?",
      },
      {
        answer:
          "Hayır. Örümceklerin çoğu böceklerle beslenir ve insanlar için tehlike oluşturmaz. Size engel oluyorsa bir kavanozla dışarı çıkarın ya da elektrikli süpürgeyle alın. Karakurta benzeyen bir örümceği de böylece ona dokunmadan uzaklaştırabilirsiniz.",
        question: "Evdeki örümceği öldürmek gerekir mi?",
      },
      {
        answer:
          "Bodrum karanlık ve sessizdir, uzun gövdeli mahzen örümceği de aslen bir mağara örümceğidir. Bugün binalarda, bodrumlar dahil, yaygındır. Bir binada ne kadar çok böcek varsa o kadar çok örümcek kalır; bu yüzden en çok temizlik ve dağınıklığı kaldırmak işe yarar.",
        question: "Bodrumda neden bu kadar çok örümcek var?",
      },
      {
        answer:
          "Hayır. UC IPM, eski ve tozlu ağların çoğu zaman artık kullanılmadığını yazar. Böyle ağları elektrikli süpürge ya da süpürgeyle temizleyin. Düzenli temizlik yeni ağları da azaltır.",
        question:
          "Her örümcek ağı örümceğin hâlâ orada olduğu anlamına mı gelir?",
      },
      {
        answer:
          "Önce nasıl bir örümcek olduğuna bakın. Köşedeki ağda duran soluk renkli, çok uzun bacaklı örümcek zararsız mahzen örümceğidir ve ağı kaldırmak yeterlidir. Parlak siyah ve karnı yuvarlaksa çocuğu odadan çıkarın ve örümceği kavanozla ya da elektrikli süpürgeyle uzaklaştırın. Çocuk ısırıldıysa ve şiddetli ağrı, kramp veya terleme varsa 112'yi arayın.",
        question: "Çocuk odasında örümcek buldum, ne yapmalıyım?",
      },
    ],
    intro:
      "Evde bulunan bir örümcek insanlar için neredeyse hiçbir zaman tehlikeli değildir. Önce ne gördüğünüze bakın: tavan köşesindeki uzun bacaklı örümcek zararsızdır, ama karnı yuvarlak, parlak siyah bir örümceğe dokunmayın.",
    metaTitle: "Evde örümcek: tehlikeli mi, nasıl çıkarılır?",
    sections: [
      {
        heading: "Evde örümcek gördüm: ne yapmalıyım?",
        paragraphs: [
          "Evlerde bulunan örümceklerin çoğu insanlar için tehlikeli değildir ve böceklerle beslenir. Örümcek insanı ısırmaya çalışmaz, bu yüzden onu öldürmek gerekmez. Size engel oluyorsa bir kavanoz ve kâğıtla dışarı çıkarın ya da örümceği ağıyla birlikte elektrikli süpürgeyle alın.",
          "Bir istisnayı unutmayın: karnı neredeyse yuvarlak, çoğu zaman kırmızı lekeli parlak siyah bir örümcek [karakurt](latrodectus-tredecimguttatus) olabilir. Ona elinizle dokunmayın. Bir örümcek sizi ısırdıysa ve şiddetli ağrı, kas krampları veya terleme başladıysa 112'yi arayın.",
        ],
      },
      {
        heading: "Gördüğünüz şey ne anlama gelir?",
        paragraphs: [
          "Tablo hızlı bir yol göstericidir, tür tanımı değildir. Lekeler ve renk güvenilir bir işaret değildir: bazı karakurtlar neredeyse tamamen siyahtır. Bu yüzden şüpheli bir örümceğe elinizle dokunmayın.",
        ],
        table: {
          headers: ["Ne görüyorsunuz", "Ne olabilir", "Ne yapmalı"],
          rows: [
            [
              "Çok uzun, ince bacaklar, küçük bir gövde ve tavan köşesinde düzensiz bir ağ",
              "Büyük olasılıkla uzun gövdeli mahzen örümceği",
              "Zararsızdır: bırakın ya da ağıyla birlikte süpürgeyle alın",
            ],
            [
              "Karnı neredeyse yuvarlak, kırmızı lekeli veya çizgili parlak siyah bir örümcek",
              "Karakurt veya yalancı karakurt olabilir",
              "Elinizle dokunmayın; kavanozla ya da süpürgeyle uzaklaştırın",
            ],
            [
              "Kaheti veya Kvemo Kartli'de yerde koşan büyük, koyu desenli bir örümcek",
              "Güney Rusya tarantulası olabilir",
              "Elinize almayın; kavanozla dışarı çıkarın",
            ],
            [
              "Sonbaharda duvarda veya yerde dolaşan bir örümcek",
              "Çoğu zaman dişi arayan ergin bir erkek",
              "Bırakın ya da kavanozla dışarı çıkarın",
            ],
            [
              "Sabah ciltte kırmızı, kaşıntılı noktalar",
              "Çoğu zaman örümcek ısırığı bile değildir",
              "Tahtakurusu ve pire olup olmadığına bakın; kötüleşirse doktora gidin",
            ],
          ],
        },
      },
      {
        heading: "Evlerde hangi örümcek yaşar?",
        paragraphs: [
          "Evlerde en bilinen örümcek [uzun gövdeli mahzen örümceği](pholcus-phalangioides)dir. Bacakları gövdesinden birkaç kat uzundur, bu yüzden bu küçük örümcek olduğundan çok daha büyük görünür. Soluk kahverengimsi veya grimsidir ve tavan köşesinde, bodrumda ya da başka sessiz, karanlık bir yerde düzensiz bir ağda baş aşağı asılı durur.",
          "Aslen bir mağara örümceğiydi; bugün binalarda, evler ve bodrumlar dahil, yaygındır. Gürcistan'da evlerde, bodrumlarda, apartman merdivenlerinde, kilerlerde ve garajlarda yaşar. İnsanlar için tehlikeli örümceklerden sayılmaz; köşede size engel olmuyorsa onu orada bırakabilirsiniz.",
        ],
      },
      {
        heading: "Sonbaharda neden daha çok örümcek görülür?",
        paragraphs: [
          "Londra'daki Doğa Tarihi Müzesi'ne göre evlerde örümcek en çok sonbaharda görülür. Bu dönemde birçok türün erkekleri erginleşir ve dişi aramak için dolaşır. Sıcak havada kapı ve pencereler daha uzun süre açık kalır, bu yüzden dolaşan erkekler eve daha sık girer.",
          "Örümcekler soğuktan kaçmak için içeri girmez. Washington Üniversitesi Burke Müzesi bunu bir efsane olarak görür: ev örümcekleri kapalı alanda yaşamaya uyum sağlamış türlerdir ve evde görülen örümceklerin genellikle %5'inden azı hiç dışarıda bulunmuştur. Bu rakam Kuzey Amerika'daki evlerle ilgilidir.",
          "Örümcekler çatlaklardan ve açıklıklardan girer, bazen de bitkiler, odun ve kutularla birlikte içeri taşınır. UC IPM, bir binada ne kadar çok böcek varsa orada örümceklerin yerleşme olasılığının da o kadar yüksek olduğunu yazar.",
        ],
      },
      {
        heading: "Ev örümceği tehlikeli mi?",
        paragraphs: [
          "Çoğu değildir. UC IPM, örümceklerin ısırmak için insan aramadığını ve çoğu örümceğin çenesinin insanı ısıramayacak kadar küçük olduğunu açıklar. Isırıkların çoğu bir arı sokmasından daha ağır değildir.",
          "Burke Müzesi'ne göre gerçek örümcek ısırıkları nadirdir. Çoğunlukla örümcek giysiye sıkıştığında ya da biri bakmadan elini onun saklandığı yere soktuğunda olur. Ele alınan bir örümcek de ısırabilir, bu yüzden onu elinizle yakalamayın.",
          "Gürcistan'da tıbbi açıdan en önemli örümcek karakurttur. Ayrıntılar için [Gürcistan'daki zehirli örümcekler](/spiders/shxamiani-obobebi) rehberini okuyun.",
        ],
      },
      {
        heading: "Karakurt eve girebilir mi?",
        image: "karakurt",
        paragraphs: [
          "Karakurt evde yaşamaya uyum sağlamış bir örümcek değildir. Kuru, açık yerlerde yaşar: bozkırlarda, yarı çöl çalılıklarında, kumlu ve çakıllı alanlarda. Ağını yere yakın, taşların ve alçak bitkilerin arasına kurar. Gürcistan'da Kvemo Kartli, Mtsheta-Mtianeti, Tiflis, Kaheti, Samtshe-Cavaheti ve Şida Kartli'de görülür.",
          "UC IPM'e göre Kuzey Amerika'daki akrabası kara dul, evlerin çevresinde dağınıklık içinde, garajlarda ve odun yığınlarında yerleşir. Bu yüzden böyle yerleri, özellikle Doğu Gürcistan'ın kurak bölgelerinde, eldivenle toplayın.",
          "Karakurt, karnı neredeyse top gibi yuvarlak, küçük ve parlak siyah bir örümcektir. Dişilerin sırtında sık sık kırmızı lekeler bulunur, ama bazıları neredeyse tamamen siyahtır; bu yüzden yalnızca lekelere güvenmeyin. Isırığı şiddetli ağrıya, kas kramplarına, terlemeye ve bulantıya yol açabilir. Isırılırsanız 112'yi arayın ve [örümcek ısırığı rehberini](/spiders/obobis-nakbeni) okuyun.",
        ],
      },
      {
        heading: "Yalancı karakurt nasıl ayırt edilir?",
        image: "falseWidow",
        paragraphs: [
          "[Yalancı karakurt](steatoda-paykulliana), karnı yuvarlak, küçük ve koyu renkli bir örümcektir. Karnının ön kısmında çoğu zaman kırmızı ya da sarı bir çizgi uzanır, bu yüzden karakurta benzer. Karakurt değildir, ama onun ısırığı da ağrılı olabilir.",
          "O da kuru yerlerin örümceğidir: kuru çayırlarda, taşlı yamaçlarda ve kaya çatlaklarında yaşar, bakımsız bahçelerde ise nadiren görülür. Gürcistan'da Tiflis, Sığnaği, Kodiani ve Kveda Çhutuneti'de doğrulanmıştır. İkisini yakından ayırt etmeye çalışmayın: ikisine de aynı şekilde davranın ve elinizle dokunmayın.",
        ],
      },
      {
        heading: "Yerde büyük bir örümcek koşuyor: nedir?",
        image: "tarantula",
        paragraphs: [
          "Doğu Gürcistan'ın kurak bölgelerinde bu bir [Güney Rusya tarantulası](lycosa-singoriensis) olabilir: güçlü bacaklı, büyük ve koyu desenli bir kurt örümceği. Yuvarlak ağ kurmaz ve yerde ya da yuvasının girişinde yaşar. Gürcistan'da Kvemo Kartli ve Kaheti'de doğrulanmıştır.",
          "UC IPM'e göre kurt örümceklerinin ve tarantulaların ergin erkekleri dişi aramak için dolaşır. Bazıları yuvasını yeni inşaat yüzünden, bazıları da yağmur mevsiminde yuvası ıslandığı için terk eder. Tarantula ısırığı genellikle hayati tehlike oluşturmaz, ama yerel ağrı, kızarıklık ve şişlik yapabilir. Elinize almayın: kavanoz ve kâğıtla dışarı çıkarın.",
        ],
      },
      {
        heading: "Örümcek evden nasıl çıkarılır?",
        list: {
          items: [
            "Örümceğin üzerine bir kavanoz ya da bardak kapatın.",
            "Kavanozun altına dikkatle kalın bir kâğıt veya karton kaydırın.",
            "Kavanozu kâğıtla birlikte dışarı taşıyın ve örümceği evden uzakta, doğal bir yerde bırakın.",
            "Örümcek yüksekteyse ya da çok ağ varsa, örümceği ve ağları elektrikli süpürgeyle alın.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM iki yöntemi de önerir. İkisinde de örümceğe elinizle dokunmazsınız; bu, karakurta benzeyen bir örümcek için de önemlidir. Süpürgenin hortumuna giren örümcek genellikle hayatta kalmaz.",
        ],
      },
      {
        heading: "Evde daha az örümcek olması için ne yapılır?",
        list: {
          items: [
            "Pencereleri, oda köşelerini, kilerleri ve bodrumu düzenli olarak elektrikli süpürgeyle veya süpürgeyle temizleyin.",
            "Garaj, kulübe ve bodrumdaki dağınıklığı kaldırın; kutuları yerden ve duvardan uzak, kapalı tutun.",
            "Pencere ve kapıların çevresindeki çatlak ve boşlukları kapatın.",
            "Pencerelere sineklik takın: hem örümcekleri hem de örümceklerin beslendiği böcekleri dışarıda tutar.",
            "Dış aydınlatmayı pencere ve kapılardan uzak tutun: ışık böcekleri, böcekler de örümcekleri çeker.",
            "Temel çevresindeki yaprakları ve çöpleri kaldırın, bitkileri duvarlardan uzak tutun.",
            "Dağınık eşyaları veya odunları toplarken eldiven giyin.",
          ],
        },
        paragraphs: [
          "Bu öneriler UC IPM'e aittir. Evde ne kadar az böcek ve saklanma yeri varsa orada o kadar az örümcek kalır.",
        ],
      },
      {
        heading: "Böcek ilacı gerekir mi?",
        paragraphs: [
          "Genellikle hayır. UC IPM'e göre böcek ilaçları örümcekleri uzun süre azaltmaz: temizlik yapılmaz ve saklanma yerleri kaldırılmazsa ilaçlama yalnızca geçici etki eder. Örümceği görmeden onu spreyle yok etmek zaten zordur.",
          "Örümceği elektrikli süpürgeyle veya kavanozla uzaklaştırmak aynı derecede kolay ve çok daha az zehirlidir. Tuzak kullanıyorsanız yapışkan tuzakları çocukların ve evcil hayvanların ulaşamayacağı yerlere koyun.",
        ],
      },
      {
        heading: "Örümcek mi ısırdı, başka bir şey mi?",
        paragraphs: [
          "Sabah fark edilen kırmızı nokta veya yara çoğu zaman örümcek ısırığı değildir. Burke Müzesi'ne göre bu tür kabarıklık ve yaralar genellikle MRSA bakterisi dahil başka cilt hastalıklarından kaynaklanır. UC IPM, insanların ve doktorların bile cilt yaralarını, örümceğin rolüne dair hiçbir kanıt olmadan sık sık örümceklere bağladığını yazar.",
          "Kene, pire, tahtakurusu ve sivrisinek çok daha sık ısırır. Döküntü tekrarlıyorsa [tahtakurusu](/insects/baghlinjo-sakhlshi) ve [pire](/insects/rtsqilebi-sakhlshi) olup olmadığına bakın. Isırığı temiz tutun ve kaşımayın. Ağrı artarsa, şişlik büyürse, nefes almak zorlaşırsa ya da genel durumunuz kötüleşirse 112'yi arayın.",
        ],
      },
    ],
    summary:
      "Evlerde görülen örümceklerin çoğu tehlikeli değildir ve böcek yer. Örümceği elinizle yakalamayın: kavanoz ve kâğıtla dışarı çıkarın ya da elektrikli süpürgeyle alın. Temizlik, daha az dağınıklık, kapatılmış boşluklar ve pencere sineklikleri örümcekleri azaltır. Karnı yuvarlak, parlak siyah bir örümceğe dokunmayın: karakurt olabilir. Isırıktan sonra şiddetli ağrı, kramp veya terleme başlarsa 112'yi arayın.",
    title: "Evde örümcek: ne yapmalıyım?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "UC IPM, University of California — Pest Notes: Spiders (Publication 7442, updated 10/2020)",
    supports: {
      en: "Spiders are mostly beneficial and most cannot harm people; spiders do not seek people to bite, the jaws of most are too small to bite humans, and most bites are no worse than a bee sting; people and physicians often blame spiders for skin lesions without proof, while ticks, fleas, bed bugs and mosquitoes are frequent biters; entry through cracks and openings and on plants, firewood and boxes; more insects mean more spiders; wandering adult male wolf spiders and tarantulas, and wolf spiders displaced by construction or wet burrows; removal with a jar and paper or a vacuum cleaner, which spiders usually do not survive; old dusty webs are often unused; cleaning, clutter, boxes off the floor, sealing cracks, screens, outdoor lighting, plants and litter at the foundation, gloves; insecticides give no long-term control and spraying is temporary without housekeeping; sticky traps out of reach of children and pets.",
      ka: "ობობები ძირითადად სასარგებლოა და უმეტესობა ადამიანს ვერ ავნებს; ობობა ადამიანს საკბენად არ ეძებს, უმეტესობის ყბები ადამიანის საკბენად ძალიან პატარაა, ნაკბენების უმეტესობა ფუტკრის ნესტარზე მძიმე არ არის; ადამიანები და ექიმები ხშირად უმტკიცებულებოდ აბრალებენ ობობას კანის დაზიანებას, ხშირად კი ტკიპი, რწყილი, ბაღლინჯო და კოღო კბენენ; შესვლა ბზარებითა და ღიობებით, მცენარეებით, შეშითა და ყუთებით; მეტი მწერი — მეტი ობობა; მგლის ობობებისა და ტარანტულების მოხეტიალე მამრები, მშენებლობისა და დასველებული სოროს გამო გამოსული მგლის ობობები; ქილითა და ქაღალდით ან მტვერსასრუტით მოშორება, რომელშიც ობობა ჩვეულებრივ ვერ გადარჩება; ძველი, მტვრიანი ქსელი ხშირად აღარ გამოიყენება; დასუფთავება, ხარახურა, ყუთები იატაკის გარეშე, ბზარების ამოვსება, ბადეები, გარე განათება, მცენარეები და ნაგავი საძირკველთან, ხელთათმანი; ინსექტიციდი ხანგრძლივ შედეგს არ იძლევა და დალაგების გარეშე დროებითია; წებოვანი ხაფანგები ბავშვებისა და ცხოველებისთვის მიუწვდომელ ადგილას.",
      ru: "Пауки в основном полезны и большинство не может навредить людям; пауки не ищут людей, чтобы укусить, хелицеры большинства слишком малы для укуса человека, большинство укусов не тяжелее ужаления пчелы; люди и врачи часто без доказательств винят пауков в поражениях кожи, а кусают часто клещи, блохи, клопы и комары; проникновение через щели и отверстия, с растениями, дровами и коробками; больше насекомых — больше пауков; бродячие взрослые самцы пауков-волков и тарантулов, пауки-волки, покидающие норы из-за стройки или сырости; удаление банкой с бумагой или пылесосом, в котором пауки обычно не выживают; старая пыльная паутина часто не используется; уборка, хлам, коробки не на полу, заделка щелей, сетки, наружное освещение, растения и мусор у фундамента, перчатки; инсектициды не дают долгого эффекта, а без уборки обработка временна; клеевые ловушки вне доступа детей и животных.",
      tr: "Örümcekler çoğunlukla yararlıdır ve çoğu insana zarar veremez; örümcekler ısırmak için insan aramaz, çoğunun çenesi insanı ısıramayacak kadar küçüktür, ısırıkların çoğu arı sokmasından ağır değildir; insanlar ve doktorlar cilt yaralarını kanıtsız olarak sık sık örümceklere bağlar, sık ısıranlar ise kene, pire, tahtakurusu ve sivrisinektir; çatlak ve açıklıklardan, bitki, odun ve kutularla giriş; daha çok böcek daha çok örümcek demektir; dolaşan ergin erkek kurt örümcekleri ve tarantulalar, inşaat veya ıslanan yuva yüzünden çıkan kurt örümcekleri; kavanoz ve kâğıtla ya da örümceklerin genellikle hayatta kalmadığı elektrikli süpürgeyle uzaklaştırma; eski tozlu ağlar çoğu zaman kullanılmaz; temizlik, dağınıklık, yerden kaldırılmış kutular, çatlakları kapatma, sineklikler, dış aydınlatma, temel çevresindeki bitki ve çöpler, eldiven; böcek ilaçları uzun süreli kontrol sağlamaz ve temizlik olmadan ilaçlama geçicidir; yapışkan tuzaklar çocukların ve evcil hayvanların ulaşamayacağı yerde.",
    },
    url: "https://ipm.ucanr.edu/PMG/PESTNOTES/pn7442.html",
  },
  {
    name: "UC IPM, University of California — Pest Notes: Widow Spiders and Their Relatives (Publication 74149, updated 03/2017)",
    supports: {
      en: "Black widows often live in clutter, garages, outbuildings and woodpiles around homes; wear gloves when cleaning clutter and handling firewood; release a jarred spider well away from the home in a natural area; seek medical attention after a widow bite.",
      ka: "შავი ქვრივი ხშირად სახლების გარშემო ხარახურაში, ავტოფარეხებში, სამეურნეო შენობებსა და შეშის გროვებში ცხოვრობს; ხარახურისა და შეშის დალაგებისას ხელთათმანი; ქილით დაჭერილი ობობა სახლიდან მოშორებით, ბუნებრივ ადგილას გაუშვით; ქვრივის ნაკბენისას სამედიცინო დახმარება.",
      ru: "Чёрная вдова часто живёт вокруг домов в хламе, гаражах, хозяйственных постройках и поленницах; перчатки при разборе хлама и дров; пойманного в банку паука выпускают подальше от дома в естественном месте; после укуса вдовы — медицинская помощь.",
      tr: "Kara dul çoğu zaman evlerin çevresinde dağınıklıkta, garajlarda, müştemilatta ve odun yığınlarında yaşar; dağınıklık ve odun toplarken eldiven; kavanozla yakalanan örümcek evden uzakta, doğal bir yerde bırakılır; dul örümcek ısırığından sonra tıbbi yardım.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/widow-spiders-and-their-relatives/",
  },
  {
    name: "Natural History Museum, London — Invasion of the giant spiders? Not quite",
    supports: {
      en: "Spider sightings in houses peak in autumn, when males of many species become adult and wander looking for females; warm weather keeps doors and windows open, letting more wandering males in; house spiders can bite if picked up, and false widows bite when trapped or squashed; keep a bite clean and avoid scratching.",
      ka: "სახლებში ობობებს ყველაზე ხშირად შემოდგომით ხედავენ, როცა ბევრი სახეობის მამრი ზრდასრული ხდება და მდედრის საძებნელად დაეხეტება; თბილ ამინდში კარ-ფანჯარა ღიაა და მეტი მოხეტიალე მამრი შედის; სახლის ობობამ ხელში აყვანისას შეიძლება უკბინოს, ცრუ ქვრივი კი მოიმწყვდევისას ან დაჭყლეტისას კბენს; ნაკბენი სუფთად შეინახეთ და ნუ მოიფხანთ.",
      ru: "Чаще всего пауков в домах замечают осенью, когда самцы многих видов взрослеют и бродят в поисках самок; в тёплую погоду двери и окна открыты, и бродячих самцов попадает больше; домовый паук может укусить, если взять его в руки, а ложные вдовы кусают, если их зажать или раздавить; место укуса держать в чистоте и не расчёсывать.",
      tr: "Evlerde örümcek en çok sonbaharda görülür; birçok türün erkekleri erginleşir ve dişi aramak için dolaşır; sıcak havada kapı ve pencereler açık kalır ve daha çok dolaşan erkek içeri girer; ev örümceği ele alınınca ısırabilir, yalancı dullar sıkıştırıldığında veya ezildiğinde ısırır; ısırığı temiz tutun ve kaşımayın.",
    },
    url: "https://www.nhm.ac.uk/discover/invasion-giant-spiders.html",
  },
  {
    name: "Burke Museum, University of Washington — Myth: Spiders come indoors in the fall",
    supports: {
      en: "House spiders are species adapted to indoor life and do not come in from the cold; late-summer and autumn sightings are mostly mature males wandering in search of mates; generally fewer than 5% of spiders seen indoors have ever been outdoors (North American houses).",
      ka: "სახლის ობობები შენობაში ცხოვრებას შეგუებული სახეობებია და სიცივეს არ გაურბიან; ზაფხულის ბოლოს და შემოდგომით ძირითადად ზრდასრული მამრები ჩანან, რომლებიც მდედრს ეძებენ; სახლში ნანახი ობობების ჩვეულებრივ 5%-ზე ნაკლები ყოფილა ოდესმე გარეთ (ჩრდილოეთ ამერიკის სახლები).",
      ru: "Домовые пауки — виды, приспособленные к жизни в помещениях, и от холода в дом не приходят; в конце лета и осенью видны в основном взрослые самцы в поисках самок; обычно меньше 5% пауков, которых видят в доме, когда-либо бывали снаружи (дома Северной Америки).",
      tr: "Ev örümcekleri kapalı alanda yaşamaya uyum sağlamış türlerdir ve soğuktan kaçmak için içeri girmez; yaz sonu ve sonbaharda görülenler çoğunlukla eş arayan ergin erkeklerdir; evde görülen örümceklerin genellikle %5'inden azı hiç dışarıda bulunmuştur (Kuzey Amerika evleri).",
    },
    url: "https://www.burkemuseum.org/collections-and-research/biology/arachnology-and-entomology/spider-myths/myth-spiders-come-indoors",
  },
  {
    name: "Burke Museum, University of Washington — Myth: Spiders bite sleeping persons",
    supports: {
      en: "Spiders have no reason to bite people; true bites are rare and happen when a spider is trapped in clothing or a hand is put into its space without looking; a spider rolled on in bed bites the sheet; morning bumps and sores are generally other skin conditions, with MRSA among the leading causes of alleged spider bites.",
      ka: "ობობას ადამიანის კბენის მიზეზი არ აქვს; ნამდვილი ნაკბენი იშვიათია და ხდება, როცა ობობა ტანსაცმელში მოიმწყვდევა ან ადამიანი დაუხედავად ჰყოფს ხელს მის ადგილას; საწოლში ობობაზე გადაბრუნებისას ის ზეწარს კბენს; დილის გამონაყარი და წყლულები ჩვეულებრივ კანის სხვა დაავადებებია, და MRSA „ობობის ნაკბენის“ ერთ-ერთი მთავარი მიზეზია.",
      ru: "У пауков нет причин кусать людей; настоящие укусы редки и случаются, когда паук зажат в одежде или руку не глядя суют в его укрытие; паук, на которого перевернулись в постели, кусает простыню; утренние бугорки и язвочки обычно вызваны другими болезнями кожи, а MRSA — одна из главных причин мнимых «укусов пауков».",
      tr: "Örümceklerin insanı ısırmak için nedeni yoktur; gerçek ısırıklar nadirdir ve örümcek giysiye sıkıştığında veya el bakmadan onun alanına sokulduğunda olur; yatakta üzerine dönülen örümcek çarşafı ısırır; sabah görülen kabarıklık ve yaralar genellikle başka cilt hastalıklarıdır ve MRSA sözde örümcek ısırıklarının başlıca nedenlerindendir.",
    },
    url: "https://www.burkemuseum.org/collections-and-research/biology/arachnology-and-entomology/spider-myths/myth-spiders-bite-sleeping",
  },
  {
    name: "Nentwig et al. — Spiders of Europe: Pholcus phalangioides",
    supports: {
      en: "The long-bodied cellar spider hangs upside down in irregular webs, was originally a cave species and is now frequent in buildings, including houses and cellars; it is recorded from Georgia.",
      ka: "გრძელფეხა ფოლკუსი უსწორმასწორო ქსელში თავდაყირა ჰკიდია, თავდაპირველად მღვიმის სახეობა იყო და დღეს შენობებში ხშირია, მათ შორის სახლებსა და სარდაფებში; საქართველოდან ცნობილია.",
      ru: "Длинноногий фолкус висит вниз спиной в неправильной паутине, изначально был пещерным видом и сегодня обычен в зданиях, в том числе в домах и подвалах; известен из Грузии.",
      tr: "Uzun gövdeli mahzen örümceği düzensiz ağlarda baş aşağı asılı durur, aslen bir mağara türüdür ve bugün evler ve bodrumlar dahil binalarda yaygındır; Gürcistan'dan kaydedilmiştir.",
    },
    url: "https://araneae.nmbe.ch/data/1014",
  },
  {
    name: "Nentwig et al. — Spiders of Europe: Latrodectus tredecimguttatus",
    supports: {
      en: "The karakurt lives in dry habitats, on sandy and shingle ground and on low vegetation; it can bite humans.",
      ka: "ყარაყურთი მშრალ ჰაბიტატებში, ქვიშიან და ხრეშიან ადგილებსა და დაბალ მცენარეულობაზე ცხოვრობს; ადამიანს შეიძლება უკბინოს.",
      ru: "Каракурт живёт в сухих местах, на песчаных и галечных участках и на низкой растительности; может кусать людей.",
      tr: "Karakurt kuru habitatlarda, kumlu ve çakıllı alanlarda ve alçak bitkiler üzerinde yaşar; insanı ısırabilir.",
    },
    url: "https://araneae.nmbe.ch/data/2138/Latrodectus_tredecimguttatus",
  },
  {
    name: "Nentwig et al. — Spiders of Europe: Steatoda paykulliana",
    supports: {
      en: "The false black widow lives in dry or semi-dry habitats, dry grasslands and rock crevices, and only rarely in fallow orchards and meadows.",
      ka: "ცრუ ყარაყურთი მშრალ ან ნახევრად მშრალ ჰაბიტატებში, მშრალ მდელოებსა და კლდის ნაპრალებში ცხოვრობს, მიტოვებულ ბაღებსა და მდელოებში კი იშვიათად.",
      ru: "Ложный каракурт живёт в сухих и полусухих местах, на сухих лугах и в скальных трещинах, а в заброшенных садах и на лугах — редко.",
      tr: "Yalancı karakurt kuru veya yarı kuru habitatlarda, kuru çayırlarda ve kaya çatlaklarında, terk edilmiş meyve bahçeleri ve çayırlarda ise nadiren yaşar.",
    },
    url: "https://araneae.nmbe.ch/data/969/Steatoda_paykulliana",
  },
  {
    name: "Otto 2022 — Caucasian Spiders: Georgia country checklist",
    supports: {
      en: "The long-bodied cellar spider, karakurt, false black widow and South Russian tarantula are recorded in Georgia; regions and localities as given on their profiles.",
      ka: "გრძელფეხა ფოლკუსი, ყარაყურთი, ცრუ ყარაყურთი და ტარანტული საქართველოში დადასტურებულია; რეგიონები და ადგილები — როგორც მათ პროფილებზეა.",
      ru: "Длинноногий фолкус, каракурт, ложный каракурт и южнорусский тарантул отмечены в Грузии; регионы и места — как в их профилях.",
      tr: "Uzun gövdeli mahzen örümceği, karakurt, yalancı karakurt ve Güney Rusya tarantulası Gürcistan'da kaydedilmiştir; bölgeler ve yerler profillerinde verildiği gibidir.",
    },
    url: "https://caucasus-spiders.info/checklist/country-checklists/?country=2",
  },
];

export const SPIDER_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "A long-bodied cellar spider with very long, thin legs on a white wall, casting a sharp shadow",
      ka: "გრძელფეხა ფოლკუსი ძალიან გრძელი, თხელი ფეხებით თეთრ კედელზე, მკვეთრი ჩრდილით",
      ru: "Длинноногий фолкус с очень длинными тонкими ногами на белой стене, с резкой тенью",
      tr: "Beyaz bir duvarda, keskin gölge düşüren çok uzun, ince bacaklı uzun gövdeli mahzen örümceği",
    },
    credit: {
      en: "Photo: Zauri Khachidze. Pholcus phalangioides, Tashiskari, Georgia.",
      ka: "ფოტო: ზაური ხაჩიძე. Pholcus phalangioides, ტაშისკარი.",
      ru: "Фото: Заури Хачидзе. Pholcus phalangioides, Ташискари, Грузия.",
      tr: "Fotoğraf: Zauri Khachidze. Pholcus phalangioides, Taşiskari, Gürcistan.",
    },
    height: 1462,
    src: "https://cdn.reptiles.ge/pholcus-phalangioides-zauri-2.jpg",
    width: 2048,
  },
  id: "spider-in-house",
  images: {
    falseWidow: {
      alt: {
        en: "A false black widow female, black with a round abdomen, on two pale egg sacs on bare ground",
        ka: "ცრუ ყარაყურთის მდედრი, შავი, მრგვალი მუცლით, ორ ღია ფერის კვერცხის პარკზე, შიშველ მიწაზე",
        ru: "Самка ложного каракурта, чёрная, с круглым брюшком, на двух светлых коконах на голой земле",
        tr: "Çıplak toprakta iki açık renkli yumurta kesesinin üzerinde, yuvarlak karınlı siyah bir yalancı karakurt dişisi",
      },
      credit: {
        en: "Photo: Christian Langner. Steatoda paykulliana, Shuakhevi, Georgia, 8 June 2024.",
        ka: "ფოტო: Christian Langner. Steatoda paykulliana, შუახევი, 2024 წლის 8 ივნისი.",
        ru: "Фото: Christian Langner. Steatoda paykulliana, Шуахеви, Грузия, 8 июня 2024 года.",
        tr: "Fotoğraf: Christian Langner. Steatoda paykulliana, Şuahevi, Gürcistan, 8 Haziran 2024.",
      },
      height: 1365,
      src: "https://cdn.reptiles.ge/steatoda-paykulliana-christian-1.jpg",
      width: 2048,
    },
    karakurt: {
      alt: {
        en: "A karakurt with a shiny dark round abdomen among dry grass stems close to the ground",
        ka: "ყარაყურთი პრიალა, მუქი, მრგვალი მუცლით მიწასთან ახლოს, მშრალ ბალახს შორის",
        ru: "Каракурт с блестящим тёмным круглым брюшком среди сухих стеблей травы у самой земли",
        tr: "Yere yakın, kuru ot sapları arasında parlak, koyu, yuvarlak karınlı bir karakurt",
      },
      credit: {
        en: "Photo: Zakro Songulashvili. Latrodectus tredecimguttatus, Marneuli, Georgia, 20 July 2026.",
        ka: "ფოტო: ზაქრო სონღულაშვილი. Latrodectus tredecimguttatus, მარნეული, 2026 წლის 20 ივლისი.",
        ru: "Фото: Закро Сонгулашвили. Latrodectus tredecimguttatus, Марнеули, Грузия, 20 июля 2026 года.",
        tr: "Fotoğraf: Zakro Songulashvili. Latrodectus tredecimguttatus, Marneuli, Gürcistan, 20 Temmuz 2026.",
      },
      height: 1365,
      src: "https://cdn.reptiles.ge/latrodectus-tredecimguttatus-zakro-1.jpg",
      width: 2048,
    },
    tarantula: {
      alt: {
        en: "A large, darkly patterned South Russian tarantula inside a clear plastic cup on dry soil",
        ka: "დიდი, მუქად მოხატული ტარანტული გამჭვირვალე პლასტმასის ჭიქაში, მშრალ მიწაზე",
        ru: "Крупный тёмно-пёстрый южнорусский тарантул в прозрачном пластиковом стакане на сухой земле",
        tr: "Kuru toprak üzerinde, şeffaf plastik bir bardağın içinde büyük, koyu desenli bir Güney Rusya tarantulası",
      },
      credit: {
        en: "Photo: Ka Trin. Lycosa singoriensis, Sagarejo, Georgia, 4 September 2024.",
        ka: "ფოტო: Ka Trin. Lycosa singoriensis, საგარეჯო, 2024 წლის 4 სექტემბერი.",
        ru: "Фото: Ka Trin. Lycosa singoriensis, Сагареджо, Грузия, 4 сентября 2024 года.",
        tr: "Fotoğraf: Ka Trin. Lycosa singoriensis, Sagarejo, Gürcistan, 4 Eylül 2024.",
      },
      height: 683,
      src: "https://cdn.reptiles.ge/lycosa-singoriensis-ka-1.jpg",
      width: 1024,
    },
  },
  messageKey: "spiderInHouse",
  ogImage: "/og/images/guides/spider-in-house.jpg",
  parentHub: "spiders",
  pathname: "/spiders/oboba-sakhlshi",
  relatedGuideIds: ["bed-bugs-at-home", "fleas-in-house", "scorpion-in-house"],
  relatedSpeciesIds: [
    "pholcus-phalangioides",
    "latrodectus-tredecimguttatus",
    "steatoda-paykulliana",
    "lycosa-singoriensis",
  ],
  search: {
    icon: "guide",
    keywords: [
      "ობობა სახლში",
      "ობობა",
      "ობობები სახლში",
      "სახლის ობობა",
      "ეს რა ობობაა",
      "როგორ მოვიშოროთ ობობა",
      "ობობის ქსელი",
      "oboba sakhlshi",
      "oboba",
      "spider in house",
      "spider in the house",
      "house spider",
      "what kind of spider is this",
      "паук в доме",
      "пауки в квартире",
      "что за паук",
      "как избавиться от пауков",
      "evde örümcek",
      "ev örümceği",
    ],
    rank: 5,
    subtitle: {
      en: "Which spiders live indoors and how to remove one safely",
      ka: "რომელი ობობები ცხოვრობს სახლში და როგორ გავიყვანოთ",
      ru: "Какие пауки живут в доме и как безопасно вынести паука",
      tr: "Evde hangi örümcekler yaşar ve nasıl güvenle çıkarılır",
    },
    title: {
      en: "Spider in the house",
      ka: "ობობა სახლში",
      ru: "Паук в доме",
      tr: "Evde örümcek",
    },
  },
  sources: SOURCES,
});
