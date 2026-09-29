import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "adult" | "larva";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Found damage on clothes or a moth in the closet? Check fabrics and hidden corners, choose care by the label, store cleaned items safely, and avoid risky pesticides.",
    faq: [
      {
        answer:
          "The larva eats and damages fabric. The adult moth does not feed on clothing, but finding one near stored textiles is a reason to inspect them.",
        question: "Does the adult moth or the larva damage clothes?",
      },
      {
        answer:
          "No. A hole alone does not identify its cause or prove that damage is still active. Check for larvae, silk, thinning and new changes; other fabric pests can cause similar damage.",
        question: "Does one hole prove it is a clothes moth?",
      },
      {
        answer:
          "No. Pests associated with stored food need a separate check. The room where a moth appears is not enough to identify it, and a pantry moth trap is not a clothes moth trap.",
        question: "Are clothes moths and pantry moths the same?",
      },
      {
        answer:
          "No. A clothes moth pheromone trap mainly catches adult males and helps reveal activity. Inspect and clean the affected textiles and storage area as well.",
        question: "Is a pheromone trap enough?",
      },
      {
        answer:
          "No. Follow each item's care label. A wash that is safe for the fabric does not automatically kill every pest stage, while pest-killing heat may damage wool or other delicate materials. Ask a professional cleaner about valuable or delicate items.",
        question: "Should every item go into a hot wash?",
      },
      {
        answer:
          "Do not rely on them to solve an existing problem. UC IPM says little is known about the effectiveness of herbal oils in storage, and the protection offered by cedar is uncertain.",
        question: "Will lavender or cedar fix the problem?",
      },
    ],
    intro:
      "Start with the affected item and the fabrics beside it. A moth sighting or an old hole is a clue to investigate, not a final diagnosis.",
    metaTitle: "Clothes moths: identify damage and protect your closet",
    quickSteps: {
      heading: "Start here",
      items: [
        "Inspect the damaged item and nearby fabrics.",
        "Keep suspect items apart from clean ones until they have been checked and treated.",
        "Read each fabric's care label before choosing a cleaning method.",
        "Plan to clean the textiles and the closet, then monitor for new signs.",
      ],
    },
    sections: [
      {
        heading: "What should you check first in the closet?",
        paragraphs: [
          "Look closely at seams, folds, pockets, cuffs and under collars. Check long-stored woollens and other vulnerable textiles, then the accessible corners and cracks of the closet where lint gathers. You do not need to move heavy furniture alone or open vents and appliances.",
          "Note or photograph existing holes before cleaning. An old hole will remain after the pest is gone; later, compare it with any new damage. Keep items you suspect separate from clean, checked items while you decide how to care for them. A bag only contains an item; it does not treat it.",
        ],
      },
      {
        heading: "What does an adult clothes moth look like?",
        image: "adult",
        paragraphs: [
          "One example is the webbing clothes moth, Tineola bisselliella: the adult has narrow, golden wings and a tuft of reddish hair on its head. The photograph is a magnified example, not a life-size view or a way to identify every moth in Georgia.",
          "Adults do not eat fabric. They can signal where to look for larvae, which do the damage. UC IPM also describes a different example, Tinea pellionella, whose larva carries a silk case.",
        ],
      },
      {
        heading: "What do larvae and fabric traces tell you?",
        image: "larva",
        paragraphs: [
          "A larva may be pale with a darker head. Depending on the moth, you might see patches or tubes of silk with fibres and debris, or a portable silk case. The enlarged photograph shows a larva on fabric; it does not show its real size.",
          "Look also for grazed, thinned areas or holes, especially in concealed parts of clothing. Not every sign has to be present. A photograph of a hole alone cannot confirm a clothes moth: carpet beetles and other causes can damage similar materials.",
        ],
      },
      {
        heading: "Which fabrics and other pests should you consider?",
        paragraphs: [
          "Pay particular attention to wool, fur, feathers, felt, silk and blends containing animal fibres. Stains and long undisturbed storage can add risk. Do not assume that every damaged cotton or synthetic item has clothes moths.",
          "If you find insects in stored food, inspect that as a separate problem. The room where an adult moth flies is not a reliable identification rule, so do not apply food-storage treatment to clothing or use a pantry moth trap as proof about this closet.",
        ],
      },
      {
        heading: "How do you clean clothing without damaging it?",
        list: {
          items: [
            "Read the care label for every item. Launder washable items only with a cycle the fabric allows; do not assume an ordinary cold wash kills every stage.",
            "For wool, delicate, valuable or mixed-material items, ask a professional cleaner whether dry cleaning is appropriate. Dry cleaning means a professional service, not using solvents or bleach at home.",
            "Keep treated items separate from those still waiting to be checked. Mend holes only after dealing with the suspected pest; sewing is not a treatment.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM describes effective laundering at a particular high temperature, but also notes that many woollens cannot tolerate it. The safe wash setting on a label and a pest-control heat setting are different questions. Do not combine numbers from different sources into one recipe for every fabric.",
        ],
      },
      {
        heading: "How do you clean the closet and store clothes?",
        list: {
          items: [
            "Remove the items and vacuum accessible corners, cracks and places where hair or fibres collect. Dispose of the collected debris promptly according to your vacuum's instructions.",
            "Clean the inside of the closet and let it dry before returning clothes.",
            "Store clean, pest-free vulnerable items in well-closed containers suited to the fabric. Recheck them periodically.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Cleaning the storage space matters as much as caring for the textiles. A sealed bag or box helps protect an already cleaned item; it is not a substitute for cleaning or treating an infested one.",
        ],
      },
      {
        heading: "Can freezing or a pheromone trap solve it?",
        paragraphs: [
          "Freezing can be an option for an item that tolerates it, but it needs a controlled temperature, enough time, protective wrapping and careful thawing. UC IPM and Kentucky describe different regimes. If you cannot verify the freezer temperature and the item's suitability, choose fabric-appropriate cleaning or professional advice instead. A refrigerator or a cold balcony is not a substitute for a controlled freezer.",
          "A pheromone trap made for clothes moths can help detect activity and catch adult males. It does not remove larvae or eggs already on clothing. Traps made for stored-food moths target other insects. Continue inspecting and cleaning even if a trap catches moths.",
        ],
      },
      {
        heading: "Which products and shortcuts should you avoid?",
        paragraphs: [
          "Mothballs, flakes and crystals are pesticides, not harmless scented sachets. NPIC explains that the products it describes are intended for closed, airtight storage under their labels. Do not scatter them in an open closet, near food, or where children or pets can reach them. Check the actual product label rather than assuming all products have the same ingredients or directions.",
          "Follow the product's intended use and amount; keep pesticides in their original containers and never use an outdoor product indoors. Do not spray insecticide on clothing or bedding as a household step in this guide. Scented oils, lavender and cedar are no replacement for inspecting, cleaning and suitable storage.",
        ],
      },
      {
        heading: "How do you tell whether the problem is continuing?",
        paragraphs: [
          "Record the date, what you cleaned and a photograph of existing damage. Recheck vulnerable items and the closet for new larvae, silk or fresh damage. Old holes do not disappear after cleaning, and there is no universal deadline by which every moth must be gone.",
          "A textile-care professional can help with a valuable or delicate garment. A pest-management professional can help identify an uncertain insect or investigate repeated activity or an inaccessible source. Asking for an assessment does not mean the whole room needs spraying.",
        ],
      },
    ],
    summary:
      "Inspect the damaged item, nearby fabrics and accessible closet corners. Keep suspect clothes separate, read each care label, and use fabric-appropriate laundering or professional cleaning. Vacuum and clean the closet before returning dry, cleaned items to well-closed storage. A trap helps monitor adults but does not treat clothing; check for new signs and avoid scattering pesticide mothballs.",
    title: "Clothes moths: how do you identify damage and protect your closet?",
  },
  ka: {
    description:
      "ჩრჩილი ტანსაცმელში? შეამოწმეთ დაზიანება, გაასუფთავეთ ქსოვილები და კარადა მოვლის ეტიკეტის მიხედვით, სწორად შეინახეთ ნივთები და მოერიდეთ სახიფათო საშუალებებს.",
    faq: [
      {
        answer:
          "ქსოვილს მატლი აზიანებს. ზრდასრული ჩრჩილი ტანსაცმლით არ იკვებება, მაგრამ შენახულ ნივთებთან მისი ნახვა შემოწმების საფუძველია.",
        question: "ტანსაცმელს ზრდასრული ჩრჩილი აზიანებს თუ მატლი?",
      },
      {
        answer:
          "არა. მხოლოდ ნახვრეტით მიზეზს ან პრობლემის ამჟამინდელ აქტივობას ვერ დავადგენთ. მოძებნეთ მატლი, აბრეშუმისებრი კვალი, გათხელება და ახალი ცვლილებები; მსგავსი დაზიანება სხვა მავნებელსაც შეუძლია.",
        question: "ერთი ნახვრეტი აუცილებლად ჩრჩილს ნიშნავს?",
      },
      {
        answer:
          "არა. შენახულ საკვებში ნაპოვნი მავნებელი ცალკე უნდა შეამოწმოთ. მარტო ოთახის მდებარეობა ამოცნობისთვის საკმარისი არ არის; საკვების ჩრჩილის ხაფანგი ტანსაცმლის ჩრჩილის ხაფანგი არ არის.",
        question: "კარადისა და საკვების ჩრჩილი ერთი და იგივეა?",
      },
      {
        answer:
          "არა. ტანსაცმლის ჩრჩილის ფერომონიანი ხაფანგი უმეტესად ზრდასრულ მამრებს იჭერს და აქტივობის შემჩნევაში გეხმარებათ. დაზიანებული ნივთები და კარადაც უნდა შეამოწმოთ და გაასუფთავოთ.",
        question: "მხოლოდ ფერომონიანი ხაფანგი საკმარისია?",
      },
      {
        answer:
          "არა. დაიცავით თითოეული ნივთის მოვლის ეტიკეტი. ქსოვილისთვის დასაშვები რეცხვა ყველა სტადიის განადგურებას ავტომატურად არ ნიშნავს, ხოლო მავნებლის საწინააღმდეგო სიცხემ შეიძლება შალი და სხვა ნაზი ქსოვილი დააზიანოს.",
        question: "ყველა ნივთი ცხელ წყალში გავრეცხო?",
      },
      {
        answer:
          "უკვე არსებულ პრობლემას მათზე ნუ დააყრდნობთ. UC IPM-ის მიხედვით, შენახვისას მცენარეული ზეთების ეფექტიანობის შესახებ ცოტა რამ არის ცნობილი, კედრისგან მიღებული დაცვა კი გაურკვეველია.",
        question: "ლავანდა ან კედარი პრობლემას მოაგვარებს?",
      },
    ],
    intro:
      "დაიწყეთ დაზიანებული ნივთით და მის გვერდით შენახული ქსოვილებით. ჩრჩილის დანახვა ან ძველი ნახვრეტი შესამოწმებელი მინიშნებაა და არა საბოლოო დიაგნოზი.",
    metaTitle: "ჩრჩილი ტანსაცმელში — ამოცნობა და კარადის დაცვა",
    quickSteps: {
      heading: "დაიწყეთ აქედან",
      items: [
        "შეამოწმეთ დაზიანებული ნივთი და ახლომდებარე ქსოვილები.",
        "საეჭვო ნივთები შემოწმებამდე და დამუშავებამდე სუფთა ნივთებს არ შეურიოთ.",
        "გასუფთავების მეთოდის არჩევამდე წაიკითხეთ თითოეული ნივთის მოვლის ეტიკეტი.",
        "დაგეგმეთ ქსოვილებისა და კარადის გასუფთავება, შემდეგ კი ახალი კვალის შემოწმება.",
      ],
    },
    sections: [
      {
        heading: "რა შევამოწმოთ კარადაში პირველად?",
        paragraphs: [
          "დააკვირდით ნაკერებს, ნაკეცებს, ჯიბეებს, სახელოების ბოლოებსა და საყელოების ქვეშ. შეამოწმეთ დიდხანს შენახული შალისა და სხვა მოწყვლადი ქსოვილები, შემდეგ — კარადის ხელმისაწვდომი კუთხეები და ნაპრალები, სადაც ბოჭკოები გროვდება. მძიმე ავეჯის მარტო აწევა ან მოწყობილობებისა და ვენტილაციის გახსნა საჭირო არ არის.",
          "გასუფთავებამდე ძველი ნახვრეტები ჩაინიშნეთ ან გადაუღეთ ფოტო. ძველი დაზიანება პრობლემის დასრულების შემდეგაც დარჩება; მოგვიანებით ახალი კვალი მას შეადარეთ. საეჭვო ნივთები სუფთა, შემოწმებული ნივთებისგან განცალკევებით გქონდეთ. პაკეტში მოთავსება დამუშავებას არ ნიშნავს.",
        ],
      },
      {
        heading: "როგორ გამოიყურება ზრდასრული ტანსაცმლის ჩრჩილი?",
        image: "adult",
        paragraphs: [
          "ერთ-ერთი მაგალითია Tineola bisselliella: ზრდასრულ მწერს ვიწრო, ოქროსფერი ფრთები და თავზე მოწითალო ბუსუსები აქვს. ფოტოზე ის გადიდებულია; ეს რეალური ზომა ან საქართველოში ყველა ჩრჩილის ამოცნობის წესი არ არის.",
          "ზრდასრული ჩრჩილი ქსოვილს არ ჭამს. მისი ნახვა გვეხმარება, სად ვეძებოთ მატლი — ქსოვილს სწორედ მატლი აზიანებს. UC IPM სხვა მაგალითსაც აღწერს: Tinea pellionella-ს მატლი აბრეშუმისებრ გარსს თან დაატარებს.",
        ],
      },
      {
        heading: "რას გვაჩვენებს მატლი და ქსოვილზე კვალი?",
        image: "larva",
        paragraphs: [
          "მატლი შეიძლება ღია ფერის იყოს, უფრო მუქი თავით. სახეობის მიხედვით, შეიძლება შეგხვდეთ აბრეშუმისებრი ქსელი ან მილი, რომელშიც ბოჭკოები და ნარჩენებია, ან მატლის თან სატარებელი გარსი. ფოტოზე მატლი გადიდებულია და მისი რეალური ზომა არ ჩანს.",
          "მოძებნეთ ქსოვილის ზედაპირული გათხელება ან ნახვრეტებიც, განსაკუთრებით დაფარულ ადგილებში. ყველა ნიშანი ერთად აუცილებელი არ არის. მხოლოდ ხვრელის ფოტოთი მიზეზს ვერ დაადგენთ: მსგავსი მასალა ხოჭოს მატლმაც შეიძლება დააზიანოს.",
        ],
      },
      {
        heading: "რომელ ქსოვილებს და სხვა მავნებლებს მივაქციოთ ყურადღება?",
        paragraphs: [
          "განსაკუთრებით შეამოწმეთ შალი, ბეწვი, ბუმბული, თექა, აბრეშუმი და ცხოველური ბოჭკოს შემცველი ნარევები. ლაქები და ხანგრძლივი, შეუხებელი შენახვა რისკს ზრდის. ბამბის ან სინთეტიკის ყოველი დაზიანება ჩრჩილს ავტომატურად არ მიაწეროთ.",
          "თუ მწერი შენახულ საკვებში იპოვეთ, ეს ცალკე შესამოწმებელი საკითხია. ზრდასრული ჩრჩილის დანახვის ადგილი საბოლოო ამოცნობას არ წყვეტს; საკვების შენახვის რჩევები ტანსაცმელზე არ გადაიტანოთ და საკვების ჩრჩილის ხაფანგით კარადის მდგომარეობა არ შეაფასოთ.",
        ],
      },
      {
        heading: "როგორ გავასუფთაოთ ტანსაცმელი ისე, რომ არ დავაზიანოთ?",
        list: {
          items: [
            "წაიკითხეთ თითოეული ნივთის მოვლის ეტიკეტი. გასარეცხი ნივთი მხოლოდ ქსოვილისთვის დასაშვები რეჟიმით გარეცხეთ; ჩვეულებრივი ცივი რეცხვა ყველა სტადიას აუცილებლად არ ანადგურებს.",
            "შალის, ნაზი, ძვირფასი ან შერეული მასალის ნივთზე პროფესიულ საწმენდს ჰკითხეთ, შეეფერება თუ არა ქიმწმენდა. ეს სახლში გამხსნელის ან ქლორის გამოყენებას არ ნიშნავს.",
            "დამუშავებული ნივთები ჯერ კიდევ შესამოწმებლებისგან განცალკევებით შეინახეთ. ნახვრეტის შეკერვა მავნებლის მართვა არ არის.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM ეფექტიან რეცხვას კონკრეტულ მაღალ ტემპერატურაზე აღწერს, მაგრამ აღნიშნავს, რომ ბევრი შალის ნივთი ასეთ რეცხვას ვერ იტანს. ეტიკეტზე დაშვებული რეჟიმი და მავნებლის საწინააღმდეგო სიცხე სხვადასხვა საკითხია. სხვადასხვა წყაროს რიცხვებს ერთ უნივერსალურ რეცეპტად ნუ გააერთიანებთ.",
        ],
      },
      {
        heading: "როგორ გავასუფთაოთ კარადა და შევინახოთ ნივთები?",
        list: {
          items: [
            "გამოიღეთ ნივთები და მტვერსასრუტით გაწმინდეთ ხელმისაწვდომი კუთხეები, ნაპრალები და ადგილები, სადაც თმა ან ბოჭკოები გროვდება. შეგროვილი ნარჩენი დროულად მოიცილეთ თქვენი მტვერსასრუტის ინსტრუქციის მიხედვით.",
            "კარადის შიგნით გაასუფთავეთ და ნივთების დაბრუნებამდე გააშრეთ.",
            "სუფთა და მავნებლისგან თავისუფალი მოწყვლადი ნივთები ქსოვილისთვის შესაფერის, კარგად დახურულ სათავსში შეინახეთ და პერიოდულად გადაამოწმეთ.",
          ],
          ordered: true,
        },
        paragraphs: [
          "შენახვის ადგილის მოვლა ქსოვილის მოვლას ავსებს. მჭიდროდ დახურული პაკეტი ან ყუთი უკვე გასუფთავებულ ნივთს იცავს; დაზიანებული ნივთის გასუფთავებასა და დამუშავებას არ ანაცვლებს.",
        ],
      },
      {
        heading: "გაყინვა ან ფერომონიანი ხაფანგი საკმარისია?",
        paragraphs: [
          "გაყინვა შეიძლება გამოდგეს ნივთისთვის, რომელიც სიცივეს იტანს, მაგრამ საჭიროა კონტროლირებადი ტემპერატურა, საკმარისი დრო, შეფუთვა და ფრთხილი გალღობა. UC IPM და კენტუკის უნივერსიტეტი განსხვავებულ რეჟიმებს აღწერენ. თუ საყინულის ტემპერატურასა და ნივთის შესაბამისობას ვერ ამოწმებთ, აირჩიეთ ქსოვილისთვის შესაფერისი გასუფთავება ან პროფესიული რჩევა. მაცივარი ან ცივი აივანი კონტროლირებად საყინულეს ვერ შეცვლის.",
          "ტანსაცმლის ჩრჩილისთვის განკუთვნილი ფერომონიანი ხაფანგი აქტივობის შემჩნევასა და ზრდასრული მამრების დაჭერაში გეხმარებათ. ის ტანსაცმელზე არსებულ მატლებსა და კვერცხებს არ აშორებს. საკვების მავნებლების ხაფანგები სხვა მწერებზეა გათვლილი. დაჭერის შემთხვევაშიც შეამოწმეთ და გაასუფთავეთ ნივთები.",
        ],
      },
      {
        heading: "რომელ საშუალებებსა და სწრაფ ხერხებს მოვერიდოთ?",
        paragraphs: [
          "ჩრჩილის საწინააღმდეგო ბურთულები, ფანტელები და კრისტალები პესტიციდებია და არა უვნებელი სურნელოვანი პაკეტები. NPIC-ის აღწერილი პროდუქტები ეტიკეტის მიხედვით დახურულ, ჰერმეტულ სათავსს უკავშირდება. ნუ მიმოფანტავთ მათ ღია კარადაში, საკვებთან ან ბავშვებისა და ცხოველებისთვის მისაწვდომ ადგილას. ყველა პროდუქტს ერთნაირი შემადგენლობა და წესი არ აქვს — წაიკითხეთ კონკრეტული ეტიკეტი.",
          "დაიცავით პროდუქტის დანიშნულება და რაოდენობა; პესტიციდი პირვანდელ შეფუთვაში შეინახეთ და გარე გამოყენების საშუალება სახლში არ გამოიყენოთ. ამ გიდში ტანსაცმელსა და თეთრეულზე ინსექტიციდის შესხურების საყოფაცხოვრებო ინსტრუქცია არ გვაქვს. სურნელოვანი ზეთები, ლავანდა და კედარი შემოწმებას, გასუფთავებასა და სწორ შენახვას ვერ შეცვლის.",
        ],
      },
      {
        heading: "როგორ დავაკვირდეთ შედეგს და როდის ვითხოვოთ დახმარება?",
        paragraphs: [
          "ჩაინიშნეთ თარიღი, შესრულებული მოქმედებები და ძველი დაზიანება ფოტოთი. პერიოდულად გადაამოწმეთ მოწყვლადი ნივთები და კარადა ახალი მატლის, აბრეშუმისებრი კვალის ან ახალი დაზიანების სანახავად. ძველი ხვრელი გაწმენდით არ ქრება და ყველასთვის ერთი დასრულების ვადა არ არსებობს.",
          "ძვირფასი ან ნაზი ნივთის მოვლაში ქსოვილის პროფესიონალი დაგეხმარებათ. გაურკვეველი მწერის ამოცნობისას, განმეორებითი აქტივობისას ან მიუწვდომელი კერის შემთხვევაში მავნებლების მართვის სპეციალისტს მიმართეთ. შეფასების მოთხოვნა მთელი ოთახის შეწამვლის აუცილებლობას არ ნიშნავს.",
        ],
      },
    ],
    summary:
      "შეამოწმეთ დაზიანებული ნივთი, მის გვერდით შენახული ქსოვილები და კარადის ხელმისაწვდომი კუთხეები. საეჭვო ნივთები განცალკევებით გქონდეთ, წაიკითხეთ მოვლის ეტიკეტი და აირჩიეთ ქსოვილისთვის შესაფერისი რეცხვა ან პროფესიული გაწმენდა. კარადა მტვერსასრუტით გაასუფთავეთ, გააშრეთ და სუფთა ნივთები კარგად დახურულ სათავსში შეინახეთ. ხაფანგი დაკვირვებაში გეხმარებათ, მაგრამ ტანსაცმელს არ ამუშავებს; ახალი კვალი გადაამოწმეთ.",
    title: "ჩრჩილი ტანსაცმელში — როგორ ამოვიცნოთ და დავიცვათ კარადა?",
  },
  ru: {
    description:
      "Нашли повреждение одежды или моль в шкафу? Осмотрите ткани и укромные места, выберите уход по ярлыку, храните очищенные вещи правильно и избегайте опасных средств.",
    faq: [
      {
        answer:
          "Ткань повреждает личинка. Взрослая платяная моль одеждой не питается, но её появление рядом с вещами — повод их осмотреть.",
        question: "Одежду портит взрослая моль или личинка?",
      },
      {
        answer:
          "Нет. По одной дырке нельзя установить причину или доказать, что повреждение продолжается. Ищите личинок, шелковистые следы, истончение и новые изменения; похожие повреждения бывают и от других вредителей.",
        question: "Одна дырка обязательно означает платяную моль?",
      },
      {
        answer:
          "Нет. Вредителей в запасах еды нужно проверять отдельно. Место, где появилась бабочка, не даёт точного определения, а ловушка для пищевой моли не подходит для платяной.",
        question: "Платяная и пищевая моль — одно и то же?",
      },
      {
        answer:
          "Нет. Феромонная ловушка для платяной моли в основном ловит взрослых самцов и помогает заметить активность. Вещи и шкаф тоже нужно осмотреть и очистить.",
        question: "Достаточно ли феромонной ловушки?",
      },
      {
        answer:
          "Нет. Следуйте ярлыку каждой вещи. Допустимая для ткани стирка не обязательно уничтожает все стадии вредителя, а нужный для этого нагрев может испортить шерсть и другие деликатные ткани.",
        question: "Можно ли всё постирать в горячей воде?",
      },
      {
        answer:
          "Не рассчитывайте на них при уже возникшей проблеме. По данным UC IPM, эффективность растительных масел при хранении мало изучена, а защита кедра сомнительна.",
        question: "Лаванда или кедр решат проблему?",
      },
    ],
    intro:
      "Начните с повреждённой вещи и тканей рядом. Увиденная бабочка или старая дырка — повод проверить шкаф, а не окончательный диагноз.",
    metaTitle: "Платяная моль: как распознать и защитить одежду",
    quickSteps: {
      heading: "С чего начать",
      items: [
        "Осмотрите повреждённую вещь и ткани рядом.",
        "Не смешивайте подозрительные вещи с чистыми до проверки и обработки.",
        "Перед очисткой прочитайте ярлык по уходу за каждой вещью.",
        "Запланируйте очистку вещей и шкафа, затем проверяйте новые следы.",
      ],
    },
    sections: [
      {
        heading: "Что сначала проверить в шкафу?",
        paragraphs: [
          "Осмотрите швы, складки, карманы, манжеты и места под воротниками. Проверьте давно хранящиеся шерстяные и другие уязвимые вещи, затем доступные углы и щели шкафа, где скапливается ворс. Не нужно поднимать тяжёлую мебель в одиночку или разбирать приборы и вентиляцию.",
          "Запишите или сфотографируйте старые дырки до очистки. Они останутся и после устранения вредителя; позже сравнивайте их с новым ущербом. Держите подозрительные вещи отдельно от чистых и проверенных. Пакет изолирует вещь, но не обрабатывает её.",
        ],
      },
      {
        heading: "Как выглядит взрослая платяная моль?",
        image: "adult",
        paragraphs: [
          "Один из примеров — Tineola bisselliella: у взрослой бабочки узкие золотистые крылья и рыжеватые волоски на голове. На фото она увеличена; это не реальный размер и не правило определения любой моли в Грузии.",
          "Взрослая моль ткань не ест. Она подсказывает, где искать личинку, которая и повреждает материал. UC IPM описывает и другой пример — Tinea pellionella, личинка которой носит шёлковый чехлик.",
        ],
      },
      {
        heading: "О чём говорят личинка и следы на ткани?",
        image: "larva",
        paragraphs: [
          "Личинка может быть светлой, с более тёмной головой. В зависимости от вида встречаются шелковистые трубки или участки паутины с волокнами и мусором либо переносной чехлик. Личинка на фотографии увеличена и не показана в натуральную величину.",
          "Ищите также истончённые, словно соскобленные участки и дырки, особенно в скрытых местах. Все признаки сразу необязательны. Фото одной дырки не подтверждает платяную моль: похожие материалы повреждают и личинки кожеедов.",
        ],
      },
      {
        heading: "Какие ткани и других вредителей учитывать?",
        paragraphs: [
          "Особенно внимательно проверьте шерсть, мех, перья, войлок, шёлк и смеси с животными волокнами. Пятна и долгое хранение без движения повышают риск. Не всякий повреждённый хлопок или синтетика означает платяную моль.",
          "Насекомые в запасах пищи требуют отдельной проверки. Место, где летала взрослая моль, не даёт окончательного определения; советы по хранению еды не переносите на одежду и не судите о шкафе по ловушке для пищевой моли.",
        ],
      },
      {
        heading: "Как очистить одежду, не повредив её?",
        list: {
          items: [
            "Прочитайте ярлык каждой вещи. Стирайте пригодные для стирки вещи только в допустимом для ткани режиме; обычная холодная стирка не гарантирует гибели всех стадий.",
            "Для шерсти, деликатных, дорогих и смешанных тканей спросите профессиональную химчистку, подходит ли она для вещи. Это не означает применения растворителя или отбеливателя дома.",
            "Отделяйте обработанные вещи от ещё не проверенных. Зашивание дырки не заменяет борьбу с вредителем.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM описывает действенную стирку при конкретной высокой температуре, но отмечает, что многим шерстяным вещам она не подходит. Допустимый режим ухода и нагрев против вредителя — разные вопросы. Не составляйте универсальный рецепт из цифр разных источников.",
        ],
      },
      {
        heading: "Как очистить шкаф и хранить вещи?",
        list: {
          items: [
            "Выньте вещи и пропылесосьте доступные углы, щели и места скопления волос и волокон. Быстро удалите собранный мусор по инструкции к своему пылесосу.",
            "Очистите шкаф изнутри и дайте ему высохнуть, прежде чем вернуть вещи.",
            "Чистые вещи без вредителей храните в подходящих для ткани плотно закрытых контейнерах и периодически осматривайте.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Уход за местом хранения дополняет уход за тканями. Плотный пакет или коробка защищает уже очищенную вещь, но не заменяет обработку заражённой.",
        ],
      },
      {
        heading: "Помогут ли заморозка или феромонная ловушка?",
        paragraphs: [
          "Заморозка может подойти вещи, переносящей холод, но нужны контролируемая температура, достаточное время, упаковка и осторожное оттаивание. UC IPM и Университет Кентукки описывают разные режимы. Если вы не можете проверить температуру морозилки и пригодность вещи, выберите подходящую для ткани очистку или совет специалиста. Холодильник и морозный балкон не заменяют контролируемую морозилку.",
          "Феромонная ловушка именно для платяной моли помогает обнаружить активность и поймать взрослых самцов. Она не убирает с одежды личинок и яйца. Ловушки для вредителей продуктов рассчитаны на других насекомых. Даже при улове продолжайте осмотр и очистку.",
        ],
      },
      {
        heading: "Каких средств и быстрых решений избегать?",
        paragraphs: [
          "Нафталиновые шарики, хлопья и кристаллы против моли — пестициды, а не безобидные ароматические саше. Описанные NPIC средства применяют по этикетке в закрытом герметичном хранении. Не рассыпайте их в открытом шкафу, возле еды или в доступе детей и животных. Состав и правила разных продуктов могут отличаться — читайте конкретную этикетку.",
          "Соблюдайте назначение и дозировку продукта; храните пестициды в исходной упаковке и не применяйте уличное средство в помещении. Этот домашний гид не содержит инструкции по распылению инсектицида на одежду или постельное бельё. Ароматические масла, лаванда и кедр не заменяют осмотр, очистку и правильное хранение.",
        ],
      },
      {
        heading: "Как следить за результатом и когда нужна помощь?",
        paragraphs: [
          "Запишите дату, сделанные шаги и сфотографируйте старые повреждения. Периодически проверяйте вещи и шкаф на новых личинок, шелковистые следы и свежий ущерб. Старые дырки не исчезнут после уборки, а общего срока полного исчезновения моли нет.",
          "Специалист по уходу за тканями поможет с дорогой или деликатной вещью. Специалист по борьбе с вредителями поможет определить неясное насекомое и проверить повторную активность или недоступный очаг. Консультация не означает, что нужно опрыскивать всю комнату.",
        ],
      },
    ],
    summary:
      "Осмотрите повреждённую вещь, соседние ткани и доступные уголки шкафа. Держите подозрительные вещи отдельно, читайте ярлыки и выбирайте подходящую стирку или профессиональную очистку. Пропылесосьте и очистите шкаф, высушите его и уберите чистые вещи в плотно закрытое хранение. Ловушка помогает наблюдать за взрослыми особями, но не обрабатывает одежду; проверяйте новые следы.",
    title: "Платяная моль: как распознать повреждения и защитить шкаф?",
  },
  tr: {
    description:
      "Giysilerde hasar ya da dolapta güve mi gördünüz? Kumaşları inceleyin, etikete uygun bakım seçin, temiz eşyaları koruyun ve riskli ilaçlardan kaçının.",
    faq: [
      {
        answer:
          "Kumaşa zarar veren larvadır. Yetişkin giysi güvesi giysiyle beslenmez; fakat saklanan eşyaların yakınında görülmesi kontrol için bir nedendir.",
        question: "Giysiye yetişkin güve mi, larva mı zarar verir?",
      },
      {
        answer:
          "Hayır. Tek bir delik nedeni veya hasarın hâlâ sürdüğünü göstermez. Larva, ipeksi iz, incelme ve yeni değişiklikleri arayın; benzer hasarı başka kumaş zararlıları da verebilir.",
        question: "Tek bir delik giysi güvesini kanıtlar mı?",
      },
      {
        answer:
          "Hayır. Depolanmış gıdadaki zararlılar ayrı incelenmelidir. Güvenin görüldüğü oda kesin tanı sağlamaz; kiler güvesi tuzağı giysi güvesi tuzağı değildir.",
        question: "Giysi güvesi ile kiler güvesi aynı mı?",
      },
      {
        answer:
          "Hayır. Giysi güvesi feromon tuzağı çoğunlukla yetişkin erkekleri yakalar ve etkinliği izlemeye yardım eder. Eşyaları ve dolabı da inceleyip temizleyin.",
        question: "Yalnızca feromon tuzağı yeterli mi?",
      },
      {
        answer:
          "Hayır. Her eşyanın bakım etiketine uyun. Kumaşa uygun yıkama tüm zararlı evrelerini mutlaka öldürmez; buna yönelik ısı ise yünü ve hassas kumaşları bozabilir.",
        question: "Her şeyi sıcak suda yıkamak gerekir mi?",
      },
      {
        answer:
          "Mevcut sorunu çözmek için bunlara güvenmeyin. UC IPM'ye göre saklamada bitkisel yağların etkisi hakkında az şey biliniyor; sedir ağacının sağladığı koruma da belirsiz.",
        question: "Lavanta veya sedir sorunu çözer mi?",
      },
    ],
    intro:
      "Önce hasarlı eşyaya ve yanındaki kumaşlara bakın. Görülen bir güve ya da eski bir delik inceleme nedenidir; tek başına kesin tanı değildir.",
    metaTitle: "Giysi güvesi: hasarı tanıyın, dolabınızı koruyun",
    quickSteps: {
      heading: "Buradan başlayın",
      items: [
        "Hasarlı eşyayı ve yakınındaki kumaşları inceleyin.",
        "Şüpheli eşyaları kontrol ve işlem bitene kadar temizlerle karıştırmayın.",
        "Temizlik yöntemi seçmeden önce her eşyanın bakım etiketini okuyun.",
        "Kumaşları ve dolabı temizlemeyi planlayın; sonra yeni izleri izleyin.",
      ],
    },
    sections: [
      {
        heading: "Dolapta önce nereye bakmalı?",
        paragraphs: [
          "Dikişleri, kıvrımları, cepleri, manşetleri ve yakaların altını inceleyin. Uzun süredir saklanan yünlü ve diğer hassas eşyaları, ardından liflerin biriktiği erişilebilir dolap köşelerini ve çatlakları kontrol edin. Ağır mobilyayı tek başınıza kaldırmanız veya cihazları ve havalandırmayı sökmeniz gerekmez.",
          "Temizlikten önce mevcut delikleri not edin ya da fotoğraflayın. Eski delik zararlı ortadan kalktıktan sonra da kalır; sonradan yeni hasarla karşılaştırın. Şüpheli eşyaları temiz ve kontrol edilmiş eşyalardan ayrı tutun. Torbaya koymak işlem yapmak değildir.",
        ],
      },
      {
        heading: "Yetişkin giysi güvesi nasıl görünür?",
        image: "adult",
        paragraphs: [
          "Örneklerden biri Tineola bisselliella'dır: yetişkinin dar, altın renkli kanatları ve başında kızılımsı tüyleri vardır. Fotoğraf büyütülmüştür; gerçek boyutu ya da Gürcistan'daki bütün güveler için tanı kuralını göstermez.",
          "Yetişkin kumaşı yemez. Onu görmek, kumaşa zarar veren larvayı nerede arayacağınızı gösterebilir. UC IPM başka bir örnek olan Tinea pellionella'yı da anlatır; bu türün larvası ipeksi bir kılıf taşır.",
        ],
      },
      {
        heading: "Larva ve kumaştaki izler ne anlatır?",
        image: "larva",
        paragraphs: [
          "Larva açık renkli, başı daha koyu olabilir. Türe göre içinde lif ve artıklar bulunan ipeksi ağ veya tüpler ya da larvanın taşıdığı bir kılıf görülebilir. Fotoğraftaki larva büyütülmüştür; gerçek boyutunu göstermez.",
          "Özellikle giysinin gizli bölümlerinde yüzeysel incelme ve deliklere de bakın. Bütün işaretlerin bir arada olması gerekmez. Tek bir delik fotoğrafı giysi güvesini doğrulamaz; halı böceği larvaları da benzer malzemelere zarar verebilir.",
        ],
      },
      {
        heading: "Hangi kumaşlar ve başka zararlılar önemli?",
        paragraphs: [
          "Yün, kürk, tüy, keçe, ipek ve hayvansal lif içeren karışımları özellikle kontrol edin. Lekeler ve uzun süre dokunulmadan saklama riski artırabilir. Hasarlı her pamuklu veya sentetik eşyanın nedenini giysi güvesi saymayın.",
          "Depolanmış gıdada bulunan böcek ayrı incelenmelidir. Yetişkinin uçtuğu oda kesin tanı vermez; gıda saklama önerilerini giysilere uygulamayın ve kiler güvesi tuzağıyla dolabı değerlendirmeyin.",
        ],
      },
      {
        heading: "Giysiyi yıpratmadan nasıl temizlemeli?",
        list: {
          items: [
            "Her eşyanın bakım etiketini okuyun. Yıkanabilir eşyaları yalnızca kumaşın izin verdiği programda yıkayın; sıradan soğuk yıkamanın bütün evreleri öldürdüğünü varsaymayın.",
            "Yünlü, hassas, değerli veya karışık malzemeli eşya için profesyonel temizleyiciye kuru temizlemenin uygunluğunu sorun. Bu, evde çözücü ya da çamaşır suyu kullanmak değildir.",
            "İşlem görmüş eşyaları henüz kontrol edilmemişlerden ayrı tutun. Deliği dikmek zararlıyı ortadan kaldırmaz.",
          ],
          ordered: true,
        },
        paragraphs: [
          "UC IPM belirli yüksek sıcaklıkta etkili bir yıkamayı anlatır, ancak birçok yünlünün buna dayanmadığını da belirtir. Etikette izin verilen program ile zararlıya karşı gereken ısı farklı konulardır. Farklı kaynakların sayılarını bütün kumaşlar için tek tarife dönüştürmeyin.",
        ],
      },
      {
        heading: "Dolap nasıl temizlenir ve eşyalar nasıl saklanır?",
        list: {
          items: [
            "Eşyaları çıkarın; erişilebilir köşeleri, çatlakları ve saç ya da lif biriken yerleri elektrik süpürgesiyle temizleyin. Toplanan atığı süpürgenizin talimatına göre gecikmeden uzaklaştırın.",
            "Dolabın içini temizleyin ve eşyaları geri koymadan önce kurumasını bekleyin.",
            "Temiz ve zararlısız hassas eşyaları kumaşa uygun, iyi kapanan kaplarda saklayın; düzenli olarak kontrol edin.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Saklama alanının temizliği kumaş bakımını tamamlar. Sıkı kapanan torba veya kutu, zaten temizlenmiş eşyayı korur; bulaşmış eşyanın temizliği ya da işlemi yerine geçmez.",
        ],
      },
      {
        heading: "Dondurma veya feromon tuzağı yeterli olur mu?",
        paragraphs: [
          "Dondurma soğuğa dayanıklı bir eşya için seçenek olabilir; fakat denetlenen sıcaklık, yeterli süre, paketleme ve dikkatli çözündürme gerekir. UC IPM ile Kentucky Üniversitesi farklı uygulamalar anlatır. Dondurucunun sıcaklığını ve eşyanın uygunluğunu doğrulayamıyorsanız kumaşa uygun temizlik veya uzman görüşü seçin. Buzdolabı ya da soğuk balkon denetlenen dondurucunun yerini tutmaz.",
          "Giysi güvesine yönelik feromon tuzağı etkinliği saptamaya ve yetişkin erkekleri yakalamaya yardımcı olur. Giysideki larva ve yumurtaları gidermez. Gıda zararlısı tuzakları başka böcekler içindir. Tuzakta güve olsa da inceleme ve temizliğe devam edin.",
        ],
      },
      {
        heading: "Hangi ürün ve kestirme yollardan kaçınmalı?",
        paragraphs: [
          "Güve topları, pulları ve kristalleri zararsız kokulu keseler değil, pestisittir. NPIC'nin anlattığı ürünler, etiketlerine göre kapalı ve hava geçirmez saklama alanları içindir. Açık dolaba, gıdanın yanına veya çocuklarla hayvanların erişeceği yerlere serpmeyin. Her ürünün içeriği ve talimatı aynı değildir; kendi etiketini okuyun.",
          "Ürünün kullanım amacına ve miktarına uyun; pestisitleri orijinal ambalajında tutun ve dış mekân ürünü içerde kullanmayın. Bu ev rehberi giysi ya da yatak takımına böcek ilacı püskürtme talimatı vermez. Kokulu yağlar, lavanta ve sedir inceleme, temizlik ve uygun saklamanın yerini almaz.",
        ],
      },
      {
        heading: "Sonuç nasıl izlenir, ne zaman yardım alınır?",
        paragraphs: [
          "Tarihi ve yapılan işlemleri yazın; eski hasarı fotoğraflayın. Eşyaları ve dolabı yeni larva, ipeksi iz veya yeni hasar için düzenli kontrol edin. Eski delikler temizlikle kaybolmaz ve her durumda geçerli tek bir bitiş süresi yoktur.",
          "Değerli ya da hassas kumaş için profesyonel kumaş bakımı alın. Belirsiz böceğin tanısı, tekrarlanan etkinlik veya erişilemeyen kaynak için zararlı yönetimi uzmanından değerlendirme isteyin. Bu, bütün odanın ilaçlanması gerektiği anlamına gelmez.",
        ],
      },
    ],
    summary:
      "Hasarlı eşyayı, yanındaki kumaşları ve dolabın erişilebilir köşelerini inceleyin. Şüpheli eşyaları ayırın, bakım etiketlerini okuyun ve kumaşa uygun yıkama veya profesyonel temizlik seçin. Dolabı süpürüp temizleyin, kurutun ve temiz eşyaları iyi kapanan kaplarda saklayın. Tuzak yetişkinleri izlemeye yarar, giysiyi işlemez; yeni izleri kontrol edin ve güve toplarını açık dolaba serpmeyin.",
    title: "Giysi güvesi: hasarı nasıl tanır, dolabı nasıl korursunuz?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "UC IPM — Clothes Moths (updated 03/2013)",
    supports: {
      en: "Identification, fabric traces, inspection, laundering and dry cleaning, closet cleaning, storage, monitoring, traps and limits of scented products.",
      ka: "ამოცნობა, ქსოვილზე კვალი, შემოწმება, რეცხვა და ქიმწმენდა, კარადის გასუფთავება, შენახვა, დაკვირვება, ხაფანგები და სურნელოვანი საშუალებების შეზღუდვები.",
      ru: "Определение, следы на ткани, осмотр, стирка и химчистка, уборка шкафа, хранение, наблюдение, ловушки и ограничения ароматических средств.",
      tr: "Tanı, kumaş izleri, inceleme, yıkama ve kuru temizleme, dolap temizliği, saklama, izleme, tuzaklar ve kokulu ürünlerin sınırlamaları.",
    },
    url: "https://ipm.ucanr.edu/home-and-landscape/clothes-moths/",
  },
  {
    name: "University of Kentucky — Clothes Moths, ENTFACT-609 (revised 3/26)",
    supports: {
      en: "Larval damage, other fabric pests, inspection and care; advises against insecticide treatment of infested clothing and bedding.",
      ka: "მატლის მიერ დაზიანება, ქსოვილის სხვა მავნებლები, შემოწმება და მოვლა; დაზიანებული ტანსაცმლისა და თეთრეულის ინსექტიციდით დამუშავებას არ ურჩევს.",
      ru: "Повреждение личинками, другие вредители тканей, осмотр и уход; не советует обработку заражённой одежды и белья инсектицидом.",
      tr: "Larva hasarı, diğer kumaş zararlıları, inceleme ve bakım; bulaşmış giysi ve yatak takımına böcek ilacı uygulanmasını önermiyor.",
    },
    url: "https://entomology.mgcafe.uky.edu/ef609",
  },
  {
    name: "NPIC — Mothballs: Naphthalene and Paradichlorobenzene (2025)",
    supports: {
      en: "Mothballs, flakes and crystals are pesticides; the described products require closed, airtight storage and can expose people and animals if used openly.",
      ka: "ჩრჩილის ბურთულები, ფანტელები და კრისტალები პესტიციდებია; აღწერილი პროდუქტები დახურულ, ჰერმეტულ სათავსს საჭიროებს, ღია გამოყენება კი ადამიანებსა და ცხოველებს აზიანებს.",
      ru: "Шарики, хлопья и кристаллы против моли — пестициды; описанные продукты рассчитаны на закрытое герметичное хранение, открытое применение опасно для людей и животных.",
      tr: "Güve topları, pulları ve kristalleri pestisittir; anlatılan ürünler kapalı, hava geçirmez saklama gerektirir ve açıkta kullanım insanları ve hayvanları etkileyebilir.",
    },
    url: "https://npic.orst.edu/ingred/ptype/mothball/index.html",
  },
  {
    name: "US EPA — Do's and Don'ts of Pest Control (updated 2026)",
    supports: {
      en: "Follow labels, use targeted applications, keep pesticides in original containers and away from children and pets, and never use outdoor chemicals indoors.",
      ka: "ეტიკეტის დაცვა, მიზნობრივი გამოყენება, პირვანდელ შეფუთვაში შენახვა, ბავშვებისა და ცხოველების დაცვა და გარე ქიმიის სახლში გამოუყენებლობა.",
      ru: "Следовать этикетке, применять целенаправленно, хранить в исходной таре вдали от детей и животных и не использовать уличные средства внутри.",
      tr: "Etikete uyma, hedefli kullanım, pestisitleri orijinal ambalajda çocuklardan ve hayvanlardan uzak tutma ve dış mekân ürününü içerde kullanmama.",
    },
    url: "https://www.epa.gov/safepestcontrol/dos-and-donts-pest-control",
  },
];

export const CLOTHES_MOTH = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Clothes hanging close together on hangers inside a closet; no moth is visible",
      ka: "კარადაში საკიდებზე მჭიდროდ ჩამოკიდებული ტანსაცმელი; ჩრჩილი არ ჩანს",
      ru: "Одежда плотно висит на плечиках в шкафу; моли на фото нет",
      tr: "Dolapta askılarda yan yana duran giysiler; fotoğrafta güve görünmüyor",
    },
    credit: {
      en: "Photo: mycurrency.com, Wikimedia Commons",
      ka: "ფოტო: mycurrency.com, Wikimedia Commons",
      ru: "Фото: mycurrency.com, Wikimedia Commons",
      tr: "Fotoğraf: mycurrency.com, Wikimedia Commons",
    },
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Clothes_hanged_inside_a_closet.jpg",
    height: 1800,
    license: {
      name: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    src: "/images/guides/clothes-moth-closet.jpg",
    width: 2400,
  },
  id: "clothes-moth",
  images: {
    adult: {
      alt: {
        en: "Magnified side view of an adult Tineola bisselliella with narrow golden wings and a hairy head",
        ka: "ზრდასრული Tineola bisselliella-ს გადიდებული გვერდითი ხედი, ვიწრო ოქროსფერი ფრთებითა და ბუსუსიანი თავით",
        ru: "Увеличенный вид взрослой Tineola bisselliella сбоку, с узкими золотистыми крыльями и волосистой головой",
        tr: "Dar altın renkli kanatları ve tüylü başıyla yetişkin Tineola bisselliella'nın büyütülmüş yandan görünümü",
      },
      credit: {
        en: "Photo: Olaf Leillinger, Wikimedia Commons",
        ka: "ფოტო: Olaf Leillinger, Wikimedia Commons",
        ru: "Фото: Olaf Leillinger, Wikimedia Commons",
        tr: "Fotoğraf: Olaf Leillinger, Wikimedia Commons",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Tineola.bisselliella.7218.jpg",
      height: 1000,
      license: {
        name: "CC BY-SA 2.5",
        url: "https://creativecommons.org/licenses/by-sa/2.5/",
      },
      src: "/images/guides/clothes-moth-adult.jpg",
      width: 1500,
    },
    larva: {
      alt: {
        en: "Magnified pale clothes moth larva on dark woven fabric in a CSIRO photograph",
        ka: "CSIRO-ს ფოტოზე მუქ ქსოვილზე გამოსახული ღია ფერის ჩრჩილის მატლი, გადიდებული ხედით",
        ru: "Увеличенная светлая личинка платяной моли на тёмной ткани, фото CSIRO",
        tr: "CSIRO fotoğrafında koyu dokuma üzerinde büyütülmüş açık renkli giysi güvesi larvası",
      },
      credit: {
        en: "Photo: CSIRO Textile and Fibre Technology, Wikimedia Commons",
        ka: "ფოტო: CSIRO Textile and Fibre Technology, Wikimedia Commons",
        ru: "Фото: CSIRO Textile and Fibre Technology, Wikimedia Commons",
        tr: "Fotoğraf: CSIRO Textile and Fibre Technology, Wikimedia Commons",
      },
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_1790_Fabric_Pest_The_Clothes_Moth_Larvae.jpg",
      height: 1616,
      license: {
        name: "CC BY 3.0",
        url: "https://creativecommons.org/licenses/by/3.0/",
      },
      src: "/images/guides/clothes-moth-larva.jpg",
      width: 2400,
    },
  },
  messageKey: "clothesMoth",
  ogImage: "/og/images/guides/clothes-moth.jpg",
  parentHub: "insects",
  pathname: "/insects/chrchili-tansatsmelshi",
  search: {
    icon: "guide",
    keywords: [
      "ჩრჩილი ტანსაცმელში",
      "ჩრჩილი კარადაში",
      "ჩრჩილით დაზიანებული ტანსაცმელი",
      "როგორ დავიცვათ შალის ტანსაცმელი",
      "chrchili tansatsmelshi",
      "clothes moths",
      "clothes moth damage",
      "платяная моль",
      "моль в шкафу",
      "giysi güvesi",
      "dolapta güve",
    ],
    rank: 5,
    subtitle: {
      en: "Identify damage, care for fabrics and protect stored clothes",
      ka: "დაზიანების ამოცნობა, ქსოვილების მოვლა და კარადის დაცვა",
      ru: "Как распознать повреждения, очистить вещи и защитить шкаф",
      tr: "Hasarı tanıyın, kumaşları temizleyin ve dolabı koruyun",
    },
    title: {
      en: "Clothes moths",
      ka: "ჩრჩილი ტანსაცმელში",
      ru: "Платяная моль",
      tr: "Giysi güvesi",
    },
  },
  sources: SOURCES,
});
