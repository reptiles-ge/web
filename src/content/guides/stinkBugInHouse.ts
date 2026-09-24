import type { AppLocale } from "@/i18n/routing";

import {
  defineGuideArticle,
  type GuideArticleCopy,
  type GuideArticleSource,
} from "@/data/guideArticleTypes";

type ImageKey = "gap" | "sealing" | "soapy-water";

const COPY: Record<AppLocale, GuideArticleCopy<ImageKey>> = {
  en: {
    description:
      "Stink bugs move indoors in autumn to overwinter. Learn whether they are harmful, how to remove them without crushing, and how to seal entry points.",
    faq: [
      {
        answer:
          "No. According to Georgia's NCDC, the stink bug does not bite people or pets, is not venomous, and does not spread disease.",
        question: "Do stink bugs bite?",
      },
      {
        answer:
          "In buildings: in attics, wall cracks, and behind window and door frames. Outdoors: in tree hollows and under fallen leaves. In winter they are mostly inactive.",
        question: "Where do stink bugs hide in winter?",
      },
      {
        answer:
          "They leave buildings in spring, but the next autumn adults look for shelter again. If the gaps stay open, they can get in again.",
        question: "Will stink bugs come back?",
      },
      {
        answer:
          "In autumn stink bugs gather on the outside of houses while looking for shelter. Check the gaps and screens on balcony doors and windows, and collect single bugs in a container of soapy water.",
        question: "What if stink bugs gather on the balcony or outside walls?",
      },
      {
        answer:
          "No. Stink bugs do not breed in the house. A large number means that many adults found gaps in autumn and are overwintering in the building.",
        question: "Do many stink bugs mean there is a nest in the house?",
      },
    ],
    metaTitle:
      "Stink bugs in the house: why they come in and how to remove them",
    sections: [
      {
        heading: "What should you do if many stink bugs got into the house?",
        paragraphs: [
          "Stink bugs usually turn up indoors in autumn. Adults look for a dry, sheltered place to spend the winter and get into buildings through gaps around windows, doors and walls. This is a seasonal event, not an emergency.",
          "Stink bugs do not bite people or pets, are not venomous, and do not breed in the house. The real nuisance is the smell and the numbers. Do not crush them: collect them in soapy water or with a vacuum, then find and seal the gaps they use to get in.",
          "This guide deals with the household problem. Identification, biology, distribution in Georgia and crop damage are covered on the species profile: [brown marmorated stink bug (Halyomorpha halys)](halyomorpha-halys). Other stink bugs can also look brown at first glance; the profile explains the field marks.",
        ],
      },
      {
        heading: "Why do stink bugs come into the house?",
        image: "gap",
        paragraphs: [
          "The brown marmorated stink bug spends the winter as an adult. In autumn, as days shorten and temperatures drop, adults look for a dry, protected overwintering site. In a laboratory study of the invasive population in the Caucasus, short days induced winter diapause, a pause in reproduction, in all adults.",
          "Outdoors, such shelter is a tree hollow or a thick layer of fallen leaves; in a settlement, it is a building. Stink bugs can get into attics, gaps in window and door frames, cracks in walls and foundations, under the roof edge, around chimneys, and where pipes or cables pass through a wall.",
          "Indoors, a stink bug is only sheltering and does not damage the house. In the cold its activity slows down sharply until spring.",
        ],
      },
      {
        heading: "When do stink bugs appear indoors most often?",
        paragraphs: [
          "According to Georgia's National Food Agency, stink bugs feed on plants from late April or May until late autumn and move into residential buildings as it gets colder. Official sources do not give one exact date for every region: timing depends on the weather and the location.",
          "In winter, overwintering stink bugs are mostly inactive. On warm, sunny days or when the house is heated strongly, some wake up and crawl slowly, often in bathrooms and kitchens, by window and door frames, along baseboards, or around ceiling lights. That is why you may see a stink bug on a window in the middle of winter.",
          "In spring, as it warms up, stink bugs leave houses and abandoned buildings and return outdoors to feed on plants.",
        ],
      },
      {
        heading: "Are stink bugs dangerous to people?",
        paragraphs: [
          "Normally, no. According to guidance from Georgia's National Center for Disease Control and Public Health (NCDC), the stink bug is not venomous, does not bite people or pets, and does not transmit human or animal diseases. It does not sting either.",
          "Indoors it is a nuisance, not a medical threat. Some people may be sensitive or allergic to its defensive secretion, but NCDC does not describe this as life-threatening. If you notice a reaction after contact with the insect, ask a doctor for advice.",
        ],
      },
      {
        heading: "Do stink bugs breed in the house?",
        paragraphs: [
          "No. According to university extension services (Penn State Extension, UMN Extension), stink bugs that come indoors do not lay eggs or reproduce over the winter; they are in a dormant state. Stink bugs seen indoors in spring are usually the same adults that came in during autumn.",
          "Reproduction happens outdoors in the active season. Georgia's National Food Agency describes egg clusters laid on the underside of leaves, with nymphs developing on plants.",
          "So if many stink bugs appear every autumn, that means new arrivals from outside rather than breeding indoors, and the main solution is to seal entry points.",
        ],
      },
      {
        heading: "Why do stink bugs smell?",
        paragraphs: [
          "The smelly substance is the stink bug's defence: it releases it to deter predators, especially when disturbed, handled or crushed.",
          "Crushing one indoors makes the smell stronger, and it can linger on surfaces; a vacuum cleaner may also smell for a while. The odour does not attract other stink bugs, but it is unpleasant, so it is better to remove the insect whole, without crushing it.",
        ],
      },
      {
        heading: "How do you get stink bugs out of the house?",
        image: "soapy-water",
        list: {
          items: [
            "Prepare a container with water and a little liquid soap or detergent at the bottom. A stink bug that falls into soapy water cannot climb out.",
            "Hold the container under a bug on a window, wall or curtain and brush it in with a piece of cardboard or a small brush. You can also pick up a single bug with paper; the key is not to crush it.",
            "For many stink bugs, use a vacuum cleaner. To reduce the smell, some people fit a nylon stocking inside the hose: the bugs stay in the stocking instead of reaching the bag, and are then emptied into soapy water.",
            "After use, empty and clean the vacuum bag or canister. The smell is temporary.",
            "If stink bugs emerge indoors around baseboards, window and door trim, or ceiling lights and exhaust fans, seal those openings as well so they cannot crawl out of the walls into living space.",
          ],
          ordered: true,
        },
        paragraphs: [
          "The safest way to remove stink bugs indoors is mechanical, without chemicals. Georgia's National Food Agency also recommends mechanical methods for stink bugs that have entered homes, such as sweeping them off walls and collecting them with a vacuum cleaner.",
        ],
      },
      {
        heading: "How do you keep stink bugs from getting in?",
        image: "sealing",
        list: {
          items: [
            "Window and door frames: fill gaps and cracks with good-quality silicone or silicone-latex caulk; expanding foam can be used for larger gaps.",
            "Screens: window and door screens should fit the frame tightly; repair or replace damaged ones.",
            "Pipes and cables: seal the openings where pipes, wires and cables enter the wall.",
            "Walls and roof: check cracks in the foundation and walls, siding, the roof edge and the underside of the eaves, as well as chimneys and fireplaces.",
            "Vents: cover vents with screening instead of blocking them, so air can still move.",
            "Cardboard shelters: Georgia's National Food Agency describes a simple shelter made of cardboard egg-tray sheets placed near the house. Stink bugs looking for overwintering sites gather in it and are then destroyed mechanically.",
          ],
        },
        paragraphs: [
          "The most effective and lasting way to protect a home is to seal entry points, known as exclusion. It is best done before autumn, before stink bugs start looking for shelter.",
        ],
      },
      {
        heading: "What should you avoid?",
        list: {
          items: [
            "Do not crush large numbers of stink bugs indoors: the smell gets stronger and stays on surfaces.",
            "Do not make homemade chemical mixtures, and never mix household chemicals together.",
            "Do not use agricultural pesticides indoors. Indoor aerosols or foggers only kill the bugs sitting in the open; those hidden in cracks come out later anyway.",
            "Do not spray insecticide into wall voids or the attic: dead stink bugs can attract carpet beetles, which may then damage woollens and stored dry food.",
            "Do not use any product against its label directions or use an unregistered product.",
            "Do not treat a stink bug sighting as a medical emergency: it does not bite and is not venomous.",
          ],
        },
        paragraphs: [
          "Some quick fixes do not solve the problem or create a new risk.",
        ],
      },
      {
        heading: "When is professional help worth it?",
        paragraphs: [
          "A few stink bugs do not require a professional. Professional help makes sense if very large numbers get in every autumn, if entry points are out of reach, for example high on a wall or near the roof, or if you cannot find where they are getting in.",
          "A pest control service can treat the outside of a building in autumn, before mass entry. However, Penn State Extension notes that such treatment gives only minor relief: sunlight breaks the product down, and the effect may not last beyond several days or about a week. It does not replace sealing entry points.",
        ],
      },
    ],
    summary:
      "Stink bugs come indoors in autumn to overwinter. They do not bite people or pets, are not venomous, and do not breed in the house. Do not crush them: collect them in soapy water or with a vacuum. Then, before next autumn, seal the gaps around windows, doors and pipes and repair screens; that is the most effective protection.",
    title:
      "Stink bugs in the house: why they come in during autumn and how to remove them",
  },
  ka: {
    description:
      "ფაროსანა შემოდგომაზე სახლში გამოსაზამთრებლად შემოდის. გაიგეთ, საშიშია თუ არა, როგორ მოაშოროთ გაჭყლეტის გარეშე და როგორ დახუროთ შემოსასვლელები.",
    faq: [
      {
        answer:
          "არა. NCDC-ის მიხედვით, ფაროსანა არც ადამიანს კბენს და არც შინაურ ცხოველებს, შხამიანი არ არის და დაავადებებს არ ავრცელებს.",
        question: "ფაროსანა კბენს?",
      },
      {
        answer:
          "შენობაში — სხვენში, კედლის ნაპრალებში, ფანჯრისა და კარის ჩარჩოების მიღმა; ბუნებაში — ხის ფუღუროებსა და ჩამოცვენილ ფოთლებში. ზამთარში ის ძირითადად უმოძრაოა.",
        question: "სად იმალება ფაროსანა ზამთარში?",
      },
      {
        answer:
          "გაზაფხულზე ფაროსანები შენობებს ტოვებენ, მაგრამ შემდეგ შემოდგომაზე ზრდასრულები ისევ თავშესაფარს ეძებენ. თუ ღრიჭოები ღია დარჩა, შეიძლება ისევ შემოვიდნენ.",
        question: "შეიძლება ფაროსანა ისევ დაბრუნდეს?",
      },
      {
        answer:
          "შემოდგომაზე ფაროსანები სახლის გარე მხარეს თავშესაფრის საძებნელად გროვდებიან. შეამოწმეთ აივნის კარისა და ფანჯრების ღრიჭოები და ბადეები, ცალკეული მწერები კი ჭურჭლით შეაგროვეთ საპნიან წყალში.",
        question: "რა ვქნა, თუ ფაროსანა აივანზე ან ფასადზე გროვდება?",
      },
      {
        answer:
          "არა. ფაროსანა სახლში არ მრავლდება. დიდი რაოდენობა ნიშნავს, რომ შემოდგომაზე ბევრმა ზრდასრულმა ღრიჭო იპოვა და შენობაში იზამთრებს.",
        question: "ბევრი ფაროსანა ნიშნავს, რომ სახლში ბუდე აქვთ?",
      },
    ],
    metaTitle: "ფაროსანა სახლში — რატომ შემოდის და როგორ მოვიშოროთ?",
    sections: [
      {
        heading: "რა ვქნა, თუ სახლში ბევრი ფაროსანა შემოვიდა?",
        paragraphs: [
          "ფაროსანა სახლში, როგორც წესი, შემოდგომაზე ჩნდება: ზრდასრული მწერები ზამთრის გასატარებლად მშრალ, დაცულ ადგილს ეძებენ და შენობაში ფანჯრის, კარისა თუ კედლის ღრიჭოებიდან შედიან. ეს სეზონური მოვლენაა და გადაუდებელ საფრთხეს არ ნიშნავს.",
          "ფაროსანა ადამიანს და შინაურ ცხოველებს არ კბენს, შხამიანი არ არის და სახლში არ მრავლდება. მთავარი უხერხულობა სუნი და მათი რაოდენობაა. ნუ გაჭყლეტთ: შეაგროვეთ საპნიან წყალში ან მტვერსასრუტით, შემდეგ კი იპოვეთ და დახურეთ ღრიჭოები, საიდანაც შემოდიან.",
          "ეს გიდი სახლის პრობლემას ეხება. სახეობის ამოცნობა, ბიოლოგია, გავრცელება საქართველოში და ზიანი სოფლის მეურნეობისთვის ცალკე პროფილზეა აღწერილი: [აზიური ფაროსანა (Halyomorpha halys)](halyomorpha-halys). სხვა ფაროსანებიც შეიძლება ერთი შეხედვით ყავისფერი ჩანდეს; ამოცნობის ნიშნებს პროფილზე ნახავთ.",
        ],
      },
      {
        heading: "რატომ შემოდის ფაროსანა სახლში?",
        image: "gap",
        paragraphs: [
          "აზიური ფაროსანა ზამთარს ზრდასრული მწერის სახით ატარებს. შემოდგომით, როცა დღე მოკლდება და ცივდება, ზრდასრულები გამოსაზამთრებლად მშრალ, დაცულ თავშესაფარს ეძებენ. კავკასიაში გავრცელებული ინვაზიური პოპულაციის ლაბორატორიულ კვლევაში მოკლე დღე ყველა ზრდასრულში ზამთრის დიაპაუზას — გამრავლების შეჩერებას — იწვევდა.",
          "ბუნებაში ასეთი თავშესაფარია ხის ფუღურო ან ჩამოცვენილი ფოთლების სქელი ფენა, დასახლებაში კი — შენობა. ფაროსანა შეიძლება შეძვრეს სხვენში, კარისა და ფანჯრის ჩარჩოების ღრიჭოებში, კედლისა და საძირკვლის ნაპრალებში, სახურავის კიდის ქვეშ, საკვამურის გარშემო და იქ, სადაც მილები ან კაბელები კედელში გადის.",
          "შენობაში ფაროსანა მხოლოდ თავს აფარებს და სახლს არ აზიანებს. სიცივეში მისი აქტივობა მკვეთრად ნელდება და გაზაფხულამდე ასე რჩება.",
        ],
      },
      {
        heading: "როდის ჩნდება ფაროსანა სახლში ყველაზე ხშირად?",
        paragraphs: [
          "სურსათის ეროვნული სააგენტოს მიხედვით, საქართველოში ფაროსანა მცენარეებზე აპრილის ბოლოდან ან მაისიდან გვიან შემოდგომამდე იკვებება, აგრილებასთან ერთად კი საცხოვრებელ შენობებში გადადის. ოფიციალური წყაროები ყველა რეგიონისთვის ერთ ზუსტ თარიღს არ ასახელებენ: შემოსვლის დრო ამინდსა და ადგილმდებარეობაზეა დამოკიდებული.",
          "ზამთარში გამოზამთრებული ფაროსანები უმეტესად უმოძრაოდ არიან. თბილ, მზიან დღეებში ან როცა სახლი ძლიერ თბება, ზოგი მათგანი ფხიზლდება და ნელა დადის — ხშირად სააბაზანოსა და სამზარეულოში, ფანჯრისა და კარის ჩარჩოებთან, პლინტუსებთან ან ჭერის სანათებთან. ამიტომ ფაროსანა ფანჯარაზე შეიძლება შუა ზამთარშიც დაინახოთ.",
          "გაზაფხულზე, დათბობასთან ერთად, ფაროსანები საცხოვრებელ სახლებსა და მიტოვებულ შენობებს ტოვებენ და გარეთ, მცენარეებზე კვებას უბრუნდებიან.",
        ],
      },
      {
        heading: "საშიშია თუ არა ფაროსანა ადამიანისთვის?",
        paragraphs: [
          "ჩვეულებრივ — არა. დაავადებათა კონტროლისა და საზოგადოებრივი ჯანმრთელობის ეროვნული ცენტრის (NCDC) რეკომენდაციის მიხედვით, ფაროსანა შხამიანი არ არის, ადამიანს და შინაურ ცხოველებს არ კბენს და ადამიანისა თუ ცხოველის დაავადებებს არ გადასცემს. არც ნესტრავს.",
          "სახლში ფაროსანა შემაწუხებელი მწერია და არა სამედიცინო საფრთხე. მისი თავდაცვითი სეკრეტის მიმართ ზოგი ადამიანი შეიძლება მგრძნობიარე ან ალერგიული იყოს, თუმცა NCDC ამას სიცოცხლისთვის საშიშად არ აღწერს. თუ მწერთან შეხების შემდეგ რეაქცია შეგამჩნიათ, რჩევისთვის ექიმს მიმართეთ.",
        ],
      },
      {
        heading: "მრავლდება თუ არა ფაროსანა სახლში?",
        paragraphs: [
          "არა. უნივერსიტეტების საკონსულტაციო სამსახურების (Penn State Extension, UMN Extension) მიხედვით, სახლში შემოსული ფაროსანები ზამთარში კვერცხს არ დებენ და არ მრავლდებიან: ისინი მოსვენების მდგომარეობაში არიან. გაზაფხულზე სახლში დანახული ფაროსანები, როგორც წესი, იგივე ზრდასრულებია, რომლებიც შემოდგომაზე შემოვიდნენ.",
          "გამრავლება გარეთ, აქტიურ სეზონში ხდება. სურსათის ეროვნული სააგენტოს აღწერით, ფაროსანა კვერცხებს ჯგუფებად ფოთლის ქვედა მხარეზე დებს, ნიმფები კი მცენარეებზე ვითარდებიან.",
          "ამიტომ, თუ ყოველ შემოდგომაზე ბევრი ფაროსანა ჩნდება, ეს სახლში გამრავლებას კი არა, გარედან ახალ შემოსვლას ნიშნავს — და მთავარი გამოსავალი შემოსასვლელების დახურვაა.",
        ],
      },
      {
        heading: "რატომ აქვს ფაროსანას უსიამოვნო სუნი?",
        paragraphs: [
          "სუნიანი ნივთიერება ფაროსანას თავდაცვის საშუალებაა: მტაცებლების მოსაგერიებლად მას შეწუხებისას, დაჭერისას ან გაჭყლეტისას გამოყოფს.",
          "ოთახში გაჭყლეტისას სუნი ძლიერდება და შეიძლება ზედაპირზე დარჩეს; მტვერსასრუტსაც შეიძლება ცოტა ხნით დაჰყვეს. ეს სუნი სხვა ფაროსანებს არ იზიდავს, მაგრამ უსიამოვნოა — ამიტომ უმჯობესია, მწერი მთლიანად, გაუჭყლეტავად მოაშოროთ.",
        ],
      },
      {
        heading: "როგორ მოვიშოროთ ფაროსანა სახლიდან?",
        image: "soapy-water",
        list: {
          items: [
            "მოამზადეთ ჭურჭელი, რომლის ძირზეც წყალი და ცოტა თხევადი საპონი ან სარეცხი საშუალებაა. საპნიან წყალში ჩავარდნილი ფაროსანა ვეღარ ამოძვრება.",
            "ფანჯარაზე, კედელზე ან ფარდაზე მსხდომ მწერს ჭურჭელი ქვემოდან მიადეთ და მუყაოს ნაჭრით ან პატარა ცოცხით ჩააგდეთ. ცალკეული მწერის აღება ქაღალდითაც შეიძლება — მთავარია, არ გაჭყლიტოთ.",
            "როცა ფაროსანა ბევრია, გამოიყენეთ მტვერსასრუტი. სუნის შესამცირებლად ზოგი მილში კაპრონის წინდას ამაგრებს: მწერები წინდაში რჩებიან და პარკამდე ვერ აღწევენ, შემდეგ კი შიგთავსს საპნიან წყალში ცლიან.",
            "გამოყენების შემდეგ მტვერსასრუტის პარკი ან კონტეინერი დაცალეთ და გაასუფთავეთ. სუნი დროებითია.",
            "თუ ფაროსანები შიგნიდან პლინტუსის, ფანჯრისა და კარის მოპირკეთების ან ჭერის სანათებისა და გამწოვის ირგვლივ ჩნდებიან, ეს ღიობებიც დახურეთ, რომ კედლიდან საცხოვრებელ ოთახში ვეღარ გამოვიდნენ.",
          ],
          ordered: true,
        },
        paragraphs: [
          "სახლში შემოსული ფაროსანა ყველაზე უსაფრთხოდ მექანიკურად, ქიმიის გარეშე შორდება. სურსათის ეროვნული სააგენტოც სახლში შესულ ფაროსანასთან მექანიკურ მეთოდებს ურჩევს — მაგალითად, კედლიდან ცოცხით ჩამოღებასა და მტვერსასრუტით შეგროვებას.",
        ],
      },
      {
        heading: "როგორ ავიცილოთ თავიდან ფაროსანას სახლში შემოსვლა?",
        image: "sealing",
        list: {
          items: [
            "ფანჯრისა და კარის ჩარჩოები: ღრიჭოები და ნაპრალები ამოავსეთ ხარისხიანი სილიკონის ან სილიკონ-ლატექსის ჰერმეტიკით; უფრო დიდი ღიობებისთვის შეიძლება სამონტაჟო ქაფის გამოყენება.",
            "ბადეები: ფანჯრისა და კარის ბადეები ჩარჩოს მჭიდროდ უნდა ერგებოდეს; დაზიანებული შეაკეთეთ ან შეცვალეთ.",
            "მილები და კაბელები: დახურეთ ღიობები იქ, სადაც მილები, სადენები და კაბელები კედელში შედის.",
            "კედლები და სახურავი: შეამოწმეთ საძირკვლისა და კედლის ნაპრალები, ფასადის მოპირკეთება, სახურავის კიდე და კარნიზის ქვედა მხარე, აგრეთვე საკვამური და ბუხარი.",
            "ვენტილაცია: სავენტილაციო ღიობები არ დახშოთ — დაფარეთ ბადით, რომ ჰაერი კვლავ მოძრაობდეს.",
            "მუყაოს თავშესაფარი: სურსათის ეროვნული სააგენტო აღწერს სახლთან დადგმულ მარტივ თავშესაფარს კვერცხის კოლოფის მუყაოს ფირფიტებით. გამოსაზამთრებლად მოსული ფაროსანები მასში გროვდებიან, შემდეგ კი მათ მექანიკურად ანადგურებენ.",
          ],
        },
        paragraphs: [
          "სახლის დასაცავად ყველაზე ეფექტური და ხანგრძლივი საშუალება შემოსასვლელების დახურვაა. ეს უმჯობესია შემოდგომამდე გააკეთოთ, სანამ ფაროსანები თავშესაფრის ძებნას დაიწყებენ.",
        ],
      },
      {
        heading: "რა არ უნდა გავაკეთოთ?",
        list: {
          items: [
            "ნუ გაჭყლეტთ ბევრ ფაროსანას ოთახში — სუნი ძლიერდება და ზედაპირზე რჩება.",
            "ნუ დაამზადებთ თვითნაკეთ ქიმიურ ნარევებს და ნურასდროს შეურევთ ერთმანეთს საყოფაცხოვრებო ქიმიურ საშუალებებს.",
            "ნუ გამოიყენებთ სახლის შიგნით სოფლის მეურნეობისთვის განკუთვნილ პესტიციდს. ოთახში აეროზოლი ან „ფოგერი“ მხოლოდ ღიად მსხდომ მწერებს კლავს; ნაპრალებში დამალულები მოგვიანებით მაინც გამოდიან.",
            "ნუ შეასხურებთ ინსექტიციდს კედლის ღრუში ან სხვენში: მკვდარმა ფაროსანებმა შეიძლება ტყავიჭამიები მიიზიდონ, რომლებმაც შემდეგ შალის ნივთები და მშრალი საკვები მარაგი შეიძლება დააზიანონ.",
            "ნუ გამოიყენებთ პრეპარატს ეტიკეტის ინსტრუქციის საწინააღმდეგოდ და ნუ გამოიყენებთ დაურეგისტრირებელ საშუალებას.",
            "ნუ ჩათვლით ფაროსანას დანახვას გადაუდებელ სამედიცინო შემთხვევად — ის არ კბენს და შხამიანი არ არის.",
          ],
        },
        paragraphs: [
          "ზოგი „სწრაფი გამოსავალი“ პრობლემას ვერ აგვარებს ან ახალ რისკს ქმნის.",
        ],
      },
      {
        heading: "როდის არის საჭირო პროფესიონალის დახმარება?",
        paragraphs: [
          "რამდენიმე ფაროსანა სპეციალისტის გამოძახებას არ საჭიროებს. პროფესიონალური დახმარება გონივრულია, თუ ყოველ შემოდგომაზე ძალიან ბევრი ფაროსანა შემოდის, შემოსასვლელები მიუწვდომელ ადგილასაა — მაგალითად, მაღალ ფასადზე ან სახურავთან — ან ვერ ადგენთ, საიდან შემოდიან.",
          "დეზინსექციის სამსახურს შეუძლია შენობის გარე მხარე შემოდგომაზე, მასობრივ შემოსვლამდე დაამუშაოს. თუმცა Penn State Extension-ის შეფასებით, ასეთი დამუშავება მხოლოდ მცირე შედეგს იძლევა: მზის სინათლეზე პრეპარატი იშლება და მოქმედება შეიძლება რამდენიმე დღეს ან დაახლოებით ერთ კვირას არ აღემატებოდეს. ის შემოსასვლელების დახურვას ვერ ჩაანაცვლებს.",
        ],
      },
    ],
    summary:
      "ფაროსანა შემოდგომაზე სახლში გამოსაზამთრებლად შემოდის. ის ადამიანს და შინაურ ცხოველებს არ კბენს, შხამიანი არ არის და სახლში არ მრავლდება. ნუ გაჭყლეტთ — შეაგროვეთ საპნიან წყალში ან მტვერსასრუტით. შემდეგ, მომავალ შემოდგომამდე, დახურეთ ფანჯრის, კარისა და მილების ღრიჭოები და შეაკეთეთ ბადეები: ეს ყველაზე ეფექტური დაცვაა.",
    title: "ფაროსანა სახლში — რატომ შემოდის შემოდგომაზე და როგორ მოვიშოროთ?",
  },
  ru: {
    description:
      "Осенью мраморный клоп ищет в доме место для зимовки. Узнайте, опасен ли он, как убрать его, не раздавливая, и как закрыть щели, через которые он попадает внутрь.",
    faq: [
      {
        answer:
          "Нет. По данным NCDC Грузии, клоп не кусает ни людей, ни домашних животных, не ядовит и не переносит болезни.",
        question: "Кусается ли мраморный клоп?",
      },
      {
        answer:
          "В зданиях — на чердаках, в трещинах стен, за оконными и дверными рамами; в природе — в дуплах деревьев и под опавшими листьями. Зимой он почти неподвижен.",
        question: "Где клоп прячется зимой?",
      },
      {
        answer:
          "Весной клопы покидают здания, но следующей осенью взрослые особи снова ищут укрытие. Если щели остались открытыми, они могут вернуться.",
        question: "Может ли клоп вернуться?",
      },
      {
        answer:
          "Осенью клопы собираются на наружных стенах домов в поисках укрытия. Проверьте щели и сетки балконной двери и окон, а отдельных клопов соберите в ёмкость с мыльной водой.",
        question: "Что делать, если клопы собираются на балконе или фасаде?",
      },
      {
        answer:
          "Нет. Клоп не размножается в доме. Большое число означает, что осенью многие взрослые особи нашли щели и зимуют в здании.",
        question: "Если клопов много, значит, в доме гнездо?",
      },
    ],
    metaTitle: "Мраморный клоп в доме: почему появляется и как избавиться",
    sections: [
      {
        heading: "Что делать, если в дом пришло много клопов?",
        paragraphs: [
          "Мраморный клоп обычно появляется в доме осенью: взрослые особи ищут сухое защищённое место для зимовки и проникают в здание через щели окон, дверей и стен. Это сезонное явление, а не чрезвычайная ситуация.",
          "Клоп не кусает людей и домашних животных, не ядовит и не размножается в доме. Главные неудобства — запах и численность. Не давите клопов: соберите их в мыльную воду или пылесосом, затем найдите и закройте щели, через которые они заходят.",
          "Этот гид посвящён бытовой проблеме. Определение вида, биология, распространение в Грузии и вред для сельского хозяйства описаны в профиле вида: [коричнево-мраморный клоп (Halyomorpha halys)](halyomorpha-halys). Другие клопы-щитники тоже могут казаться коричневыми; признаки для определения приведены в профиле.",
        ],
      },
      {
        heading: "Почему клоп заходит в дом?",
        image: "gap",
        paragraphs: [
          "Коричнево-мраморный клоп зимует во взрослой стадии. Осенью, когда день сокращается и холодает, взрослые особи ищут сухое защищённое место для зимовки. В лабораторном исследовании инвазивной популяции Кавказа короткий день вызывал у всех взрослых особей зимнюю диапаузу — приостановку размножения.",
          "В природе такое укрытие — дупло дерева или толстый слой опавших листьев, в населённом пункте — здание. Клопы могут забираться на чердак, в щели оконных и дверных рам, трещины стен и фундамента, под край крыши, вокруг дымохода и туда, где трубы или кабели проходят через стену.",
          "В здании клоп лишь укрывается и не повреждает дом. В холоде его активность резко замедляется до весны.",
        ],
      },
      {
        heading: "Когда клопы чаще всего появляются в доме?",
        paragraphs: [
          "По данным Национального агентства продовольствия Грузии, клоп питается на растениях с конца апреля или мая до поздней осени, а с похолоданием перебирается в жилые здания. Официальные источники не называют одной точной даты для всех регионов: сроки зависят от погоды и местности.",
          "Зимой зимующие клопы в основном неподвижны. В тёплые солнечные дни или когда дом сильно отапливается, некоторые просыпаются и медленно ползают — часто в ванной и на кухне, у оконных и дверных рам, плинтусов или потолочных светильников. Поэтому клопа на окне можно увидеть и посреди зимы.",
          "Весной, с потеплением, клопы покидают жилые дома и заброшенные здания и возвращаются на растения.",
        ],
      },
      {
        heading: "Опасен ли клоп для человека?",
        paragraphs: [
          "Как правило, нет. Согласно рекомендации Национального центра по контролю заболеваний и общественному здоровью Грузии (NCDC), клоп не ядовит, не кусает людей и домашних животных и не передаёт болезни людей и животных. Жала у него тоже нет.",
          "В доме это назойливое насекомое, а не медицинская угроза. У некоторых людей может быть чувствительность или аллергия к его защитному секрету, но NCDC не описывает это как опасное для жизни. Если после контакта с насекомым вы заметили реакцию, обратитесь к врачу за советом.",
        ],
      },
      {
        heading: "Размножается ли клоп в доме?",
        paragraphs: [
          "Нет. По данным университетских консультационных служб (Penn State Extension, UMN Extension), клопы, попавшие в дом, зимой не откладывают яйца и не размножаются: они находятся в состоянии покоя. Клопы, замеченные в доме весной, обычно те же взрослые особи, что пришли осенью.",
          "Размножение происходит снаружи, в активный сезон. По описанию Национального агентства продовольствия Грузии, клоп откладывает яйца группами на нижнюю сторону листьев, а нимфы развиваются на растениях.",
          "Поэтому если клопов много каждую осень, это новые насекомые снаружи, а не размножение в доме, и главное решение — закрыть входы.",
        ],
      },
      {
        heading: "Почему клоп так пахнет?",
        paragraphs: [
          "Пахучее вещество — защита клопа: он выделяет его, чтобы отпугнуть хищников, особенно когда его тревожат, берут в руки или давят.",
          "Если раздавить клопа в комнате, запах усиливается и может остаться на поверхностях; пылесос тоже может какое-то время пахнуть. Запах не привлекает других клопов, но неприятен, поэтому лучше убирать насекомое целиком, не раздавливая.",
        ],
      },
      {
        heading: "Как избавиться от клопов в доме?",
        image: "soapy-water",
        list: {
          items: [
            "Подготовьте ёмкость, на дне которой вода с небольшим количеством жидкого мыла или моющего средства. Упавший в мыльную воду клоп не сможет выбраться.",
            "Подставьте ёмкость снизу под клопа на окне, стене или шторе и смахните его картонкой или небольшой щёткой. Одиночного клопа можно взять и бумагой — главное, не раздавить.",
            "Если клопов много, используйте пылесос. Чтобы уменьшить запах, некоторые вставляют в трубку капроновый чулок: клопы остаются в чулке и не попадают в мешок, затем их вытряхивают в мыльную воду.",
            "После работы опорожните и очистите мешок или контейнер пылесоса. Запах временный.",
            "Если клопы выходят изнутри у плинтусов, наличников окон и дверей или у потолочных светильников и вытяжки, закройте и эти отверстия, чтобы они не выбирались из стен в жилые комнаты.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Безопаснее всего убирать клопов в доме механически, без химии. Национальное агентство продовольствия Грузии тоже рекомендует механические методы для клопов, попавших в дом, — например, сметать их со стен и собирать пылесосом.",
        ],
      },
      {
        heading: "Как не пустить клопов в дом?",
        image: "sealing",
        list: {
          items: [
            "Оконные и дверные рамы: заполните щели и трещины качественным силиконовым или силикон-латексным герметиком; для крупных щелей подойдёт монтажная пена.",
            "Сетки: москитные сетки на окнах и дверях должны плотно прилегать к раме; повреждённые отремонтируйте или замените.",
            "Трубы и кабели: закройте отверстия, где трубы, провода и кабели входят в стену.",
            "Стены и крыша: проверьте трещины фундамента и стен, облицовку фасада, край крыши и нижнюю сторону карниза, а также дымоход и камин.",
            "Вентиляция: не закрывайте вентиляционные отверстия наглухо, а затяните их сеткой, чтобы воздух продолжал проходить.",
            "Картонные укрытия: Национальное агентство продовольствия Грузии описывает простое укрытие из картонных лотков для яиц рядом с домом. Клопы, ищущие место для зимовки, собираются в нём, после чего их уничтожают механически.",
          ],
        },
        paragraphs: [
          "Самый эффективный и долговременный способ защитить дом — закрыть входы. Лучше сделать это до осени, пока клопы не начали искать укрытие.",
        ],
      },
      {
        heading: "Чего делать не стоит?",
        list: {
          items: [
            "Не давите много клопов в комнате: запах усиливается и остаётся на поверхностях.",
            "Не готовьте самодельные химические смеси и никогда не смешивайте бытовую химию.",
            "Не применяйте в доме сельскохозяйственные пестициды. Аэрозоль или «фоггер» в комнате убивает только клопов на открытых местах; спрятавшиеся в щелях всё равно выйдут позже.",
            "Не распыляйте инсектициды в пустоты стен или на чердаке: мёртвые клопы могут привлечь кожеедов, которые затем повреждают шерстяные вещи и сухие продукты.",
            "Не используйте средство вопреки инструкции на этикетке и не применяйте незарегистрированные препараты.",
            "Не считайте появление клопа неотложной медицинской ситуацией: он не кусается и не ядовит.",
          ],
        },
        paragraphs: [
          "Некоторые «быстрые решения» не помогают или создают новый риск.",
        ],
      },
      {
        heading: "Когда нужна помощь специалиста?",
        paragraphs: [
          "Несколько клопов не требуют вызова специалиста. Профессиональная помощь оправдана, если каждую осень заходит очень много клопов, входы недоступны — например, высоко на фасаде или у крыши — или вы не можете найти, откуда они проникают.",
          "Служба дезинсекции может обработать внешнюю сторону здания осенью, до массового заселения. Однако, по оценке Penn State Extension, такая обработка даёт лишь небольшое облегчение: на солнце препарат разрушается, и действие может длиться не дольше нескольких дней или около недели. Закрытие входов она не заменяет.",
        ],
      },
    ],
    summary:
      "Осенью мраморный клоп заходит в дом на зимовку. Он не кусает людей и домашних животных, не ядовит и не размножается в доме. Не давите клопов: соберите их в мыльную воду или пылесосом. Затем, до следующей осени, закройте щели у окон, дверей и труб и почините сетки — это самая действенная защита.",
    title:
      "Мраморный клоп в доме: почему он приходит осенью и как от него избавиться?",
  },
  tr: {
    description:
      "Kahverengi kokarca sonbaharda kışlamak için evlere girer. Zararlı olup olmadığını, ezmeden nasıl uzaklaştırılacağını ve girişlerin nasıl kapatılacağını öğrenin.",
    faq: [
      {
        answer:
          "Hayır. Gürcistan NCDC'sine göre kokarca insanları ve evcil hayvanları ısırmaz, zehirli değildir ve hastalık yaymaz.",
        question: "Kokarca böceği ısırır mı?",
      },
      {
        answer:
          "Binalarda çatı arasında, duvar çatlaklarında, pencere ve kapı çerçevelerinin arkasında; doğada ağaç kovuklarında ve dökülmüş yaprakların altında. Kışın büyük ölçüde hareketsizdir.",
        question: "Kokarca kışın nerede saklanır?",
      },
      {
        answer:
          "İlkbaharda binaları terk ederler, ancak bir sonraki sonbaharda erginler yeniden sığınak arar. Aralıklar açık kalırsa tekrar girebilirler.",
        question: "Kokarca geri gelir mi?",
      },
      {
        answer:
          "Sonbaharda kokarcalar sığınak ararken evlerin dış yüzeyinde toplanır. Balkon kapısı ve pencerelerdeki aralıkları ve sineklikleri kontrol edin; tek tük böcekleri sabunlu su dolu bir kaba toplayın.",
        question:
          "Kokarcalar balkonda veya dış duvarda toplanıyorsa ne yapmalı?",
      },
      {
        answer:
          "Hayır. Kokarca evde üremez. Çok sayıda böcek, sonbaharda birçok erginin aralık bulduğu ve binada kışladığı anlamına gelir.",
        question: "Çok sayıda kokarca evde yuva olduğu anlamına mı gelir?",
      },
    ],
    metaTitle: "Evde kokarca böceği: neden girer, nasıl uzaklaştırılır?",
    sections: [
      {
        heading: "Eve çok sayıda kokarca girdiyse ne yapmalı?",
        paragraphs: [
          "Kokarca böceği genellikle sonbaharda evde görülür: erginler kışı geçirmek için kuru ve korunaklı bir yer arar ve binaya pencere, kapı ve duvar aralıklarından girer. Bu mevsimsel bir durumdur, acil bir tehlike değildir.",
          "Kokarca insanları ve evcil hayvanları ısırmaz, zehirli değildir ve evde üremez. Asıl rahatsızlık koku ve sayılarıdır. Onları ezmeyin: sabunlu suya ya da süpürgeyle toplayın, ardından girdikleri aralıkları bulup kapatın.",
          "Bu rehber evdeki soruna odaklanır. Tür tanımı, biyolojisi, Gürcistan'daki yayılışı ve tarıma verdiği zarar tür profilinde anlatılır: [kahverengi kokarca (Halyomorpha halys)](halyomorpha-halys). Başka kokarca türleri de ilk bakışta kahverengi görünebilir; tanı özellikleri profilde yer alır.",
        ],
      },
      {
        heading: "Kokarca neden eve girer?",
        image: "gap",
        paragraphs: [
          "Kahverengi kokarca kışı ergin olarak geçirir. Sonbaharda günler kısalıp havalar soğudukça erginler kışlamak için kuru ve korunaklı bir sığınak arar. Kafkasya'daki istilacı popülasyon üzerinde yapılan bir laboratuvar çalışmasında kısa gün, tüm erginlerde kış diyapozuna, yani üremenin durmasına yol açtı.",
          "Doğada bu sığınak bir ağaç kovuğu ya da kalın bir dökülmüş yaprak tabakasıdır; yerleşim yerlerinde ise binalardır. Kokarcalar çatı arasına, pencere ve kapı çerçevelerindeki aralıklara, duvar ve temel çatlaklarına, çatı kenarının altına, baca çevresine ve boru ya da kabloların duvardan geçtiği yerlere girebilir.",
          "Binada kokarca yalnızca sığınır ve eve zarar vermez. Soğukta etkinliği belirgin şekilde yavaşlar ve ilkbahara kadar böyle kalır.",
        ],
      },
      {
        heading: "Kokarca evde en çok ne zaman görülür?",
        paragraphs: [
          "Gürcistan Ulusal Gıda Ajansı'na göre kokarca nisan sonundan ya da mayıstan geç sonbahara kadar bitkilerde beslenir, havalar soğudukça konutlara geçer. Resmî kaynaklar her bölge için tek bir kesin tarih vermez: giriş zamanı hava durumuna ve yere bağlıdır.",
          "Kışın kışlayan kokarcalar çoğunlukla hareketsizdir. Ilık ve güneşli günlerde ya da ev çok ısıtıldığında bazıları uyanır ve yavaşça dolaşır; sıklıkla banyo ve mutfakta, pencere ve kapı çerçevelerinin, süpürgeliklerin veya tavan lambalarının yakınında görülür. Bu yüzden kışın ortasında bile pencerede kokarca görebilirsiniz.",
          "İlkbaharda havalar ısındıkça kokarcalar evleri ve terk edilmiş binaları bırakır ve dışarıda bitkilerle beslenmeye döner.",
        ],
      },
      {
        heading: "Kokarca insanlar için tehlikeli mi?",
        paragraphs: [
          "Normalde hayır. Gürcistan Ulusal Hastalık Kontrol ve Halk Sağlığı Merkezi'nin (NCDC) önerisine göre kokarca zehirli değildir, insanları ve evcil hayvanları ısırmaz ve insan ya da hayvan hastalıkları taşımaz. Sokmaz da.",
          "Evde kokarca bir rahatsızlık kaynağıdır, tıbbi bir tehdit değildir. Bazı kişiler savunma salgısına karşı hassas ya da alerjik olabilir, ancak NCDC bunu yaşamı tehdit eden bir durum olarak tanımlamaz. Böcekle temastan sonra bir tepki fark ederseniz tavsiye için doktora danışın.",
        ],
      },
      {
        heading: "Kokarca evde ürer mi?",
        paragraphs: [
          "Hayır. Üniversitelerin yayım (extension) hizmetlerine (Penn State Extension, UMN Extension) göre eve giren kokarcalar kışın yumurta bırakmaz ve üremez; dinlenme hâlindedir. İlkbaharda evde görülen kokarcalar genellikle sonbaharda giren aynı erginlerdir.",
          "Üreme dışarıda, aktif mevsimde olur. Gürcistan Ulusal Gıda Ajansı'nın tanımına göre kokarca yumurtalarını gruplar hâlinde yaprakların alt yüzüne bırakır, nimfler de bitkiler üzerinde gelişir.",
          "Bu nedenle her sonbahar çok sayıda kokarca görülüyorsa bu evde üreme değil, dışarıdan yeni giriş anlamına gelir; asıl çözüm girişleri kapatmaktır.",
        ],
      },
      {
        heading: "Kokarca neden kötü kokar?",
        paragraphs: [
          "Kokulu madde kokarcanın savunma aracıdır: onu yırtıcıları uzaklaştırmak için, özellikle rahatsız edildiğinde, tutulduğunda ya da ezildiğinde salgılar.",
          "Odada ezildiğinde koku güçlenir ve yüzeylerde kalabilir; süpürgeye de bir süre sinebilir. Koku başka kokarcaları çekmez, ama rahatsız edicidir; bu yüzden böceği ezmeden, bütün hâlde uzaklaştırmak daha iyidir.",
        ],
      },
      {
        heading: "Kokarca evden nasıl uzaklaştırılır?",
        image: "soapy-water",
        list: {
          items: [
            "Dibinde su ve biraz sıvı sabun ya da deterjan olan bir kap hazırlayın. Sabunlu suya düşen kokarca dışarı çıkamaz.",
            "Pencere, duvar veya perde üzerindeki böceğin altına kabı tutun ve bir karton parçası ya da küçük bir fırçayla içine düşürün. Tek bir böceği kâğıtla da alabilirsiniz; önemli olan ezmemektir.",
            "Çok sayıda kokarca için elektrikli süpürge kullanın. Kokuyu azaltmak için bazı kişiler hortumun içine naylon çorap yerleştirir: böcekler torbaya ulaşmadan çorapta kalır, sonra sabunlu suya boşaltılır.",
            "Kullandıktan sonra süpürgenin torbasını veya haznesini boşaltıp temizleyin. Koku geçicidir.",
            "Kokarcalar içeride süpürgeliklerin, pencere ve kapı pervazlarının ya da tavan lambaları ve aspiratörlerin çevresinden çıkıyorsa bu açıklıkları da kapatın; böylece duvarlardan yaşam alanına geçemezler.",
          ],
          ordered: true,
        },
        paragraphs: [
          "Eve giren kokarcayı uzaklaştırmanın en güvenli yolu kimyasal kullanmadan, mekanik yöntemlerdir. Gürcistan Ulusal Gıda Ajansı da evlere giren kokarcalar için mekanik yöntemleri önerir; örneğin duvardan süpürgeyle indirmek ve elektrikli süpürgeyle toplamak.",
        ],
      },
      {
        heading: "Kokarcanın eve girmesi nasıl önlenir?",
        image: "sealing",
        list: {
          items: [
            "Pencere ve kapı çerçeveleri: aralıkları ve çatlakları kaliteli silikon ya da silikon-lateks dolgu macunuyla doldurun; büyük boşluklar için poliüretan köpük kullanılabilir.",
            "Sineklikler: pencere ve kapı sineklikleri çerçeveye sıkıca oturmalıdır; hasarlı olanları onarın ya da değiştirin.",
            "Borular ve kablolar: boruların, tellerin ve kabloların duvara girdiği açıklıkları kapatın.",
            "Duvarlar ve çatı: temel ve duvar çatlaklarını, dış cephe kaplamasını, çatı kenarını ve saçak altını, ayrıca bacayı ve şömineyi kontrol edin.",
            "Havalandırma: havalandırma açıklıklarını tamamen kapatmayın, hava akışı sürsün diye tel örgüyle kaplayın.",
            "Karton sığınaklar: Gürcistan Ulusal Gıda Ajansı, evin yakınına konan ve karton yumurta viyollerinden yapılan basit bir sığınak tarif eder. Kışlak arayan kokarcalar burada toplanır ve ardından mekanik olarak yok edilir.",
          ],
        },
        paragraphs: [
          "Evi korumanın en etkili ve kalıcı yolu girişleri kapatmaktır. Bunu kokarcalar sığınak aramaya başlamadan, sonbahardan önce yapmak en iyisidir.",
        ],
      },
      {
        heading: "Nelerden kaçınmalı?",
        list: {
          items: [
            "Odada çok sayıda kokarcayı ezmeyin: koku güçlenir ve yüzeylerde kalır.",
            "Ev yapımı kimyasal karışımlar hazırlamayın ve ev kimyasallarını asla birbirine karıştırmayın.",
            "Ev içinde tarım ilacı kullanmayın. Odada sprey ya da sisleyici yalnızca açıkta duran böcekleri öldürür; çatlaklarda saklananlar sonra yine çıkar.",
            "Duvar boşluklarına veya çatı arasına insektisit püskürtmeyin: ölü kokarcalar halı böceklerini çekebilir, bunlar da daha sonra yünlü eşyalara ve kuru gıdalara zarar verebilir.",
            "Hiçbir ürünü etiket talimatlarına aykırı kullanmayın ve kayıtsız ürün kullanmayın.",
            "Kokarca görmeyi tıbbi acil durum saymayın: ısırmaz ve zehirli değildir.",
          ],
        },
        paragraphs: [
          "Bazı hızlı çözümler sorunu gidermez ya da yeni bir risk yaratır.",
        ],
      },
      {
        heading: "Ne zaman profesyonel yardım gerekir?",
        paragraphs: [
          "Birkaç kokarca için uzman çağırmak gerekmez. Her sonbahar çok sayıda kokarca giriyorsa, girişlere ulaşılamıyorsa (örneğin yüksek bir cephede ya da çatı yakınında) veya nereden girdiklerini bulamıyorsanız profesyonel yardım mantıklıdır.",
          "Bir haşere kontrol hizmeti binanın dış yüzeyini sonbaharda, toplu girişten önce ilaçlayabilir. Ancak Penn State Extension'a göre bu uygulama yalnızca küçük bir rahatlama sağlar: ürün güneş ışığında bozulur ve etkisi birkaç gün ya da yaklaşık bir haftadan uzun sürmeyebilir. Girişleri kapatmanın yerini tutmaz.",
        ],
      },
    ],
    summary:
      "Kokarca böceği sonbaharda kışı geçirmek için eve girer. İnsanları ve evcil hayvanları ısırmaz, zehirli değildir ve evde üremez. Onları ezmeyin: sabunlu suya ya da süpürgeyle toplayın. Ardından, bir sonraki sonbahardan önce pencere, kapı ve boru çevresindeki aralıkları kapatın ve sineklikleri onarın; en etkili koruma budur.",
    title: "Evde kokarca böceği: neden sonbaharda girer, nasıl uzaklaştırılır?",
  },
};

const SOURCES: readonly GuideArticleSource[] = [
  {
    name: "სურსათის ეროვნული სააგენტო — აზიური ფაროსანა",
    supports: {
      en: "Feeding season in Georgia from late April-May to late autumn; overwintering in houses, attics, door and window gaps, cracks, tree hollows and leaf litter; egg clusters on the underside of leaves.",
      ka: "საქართველოში კვების სეზონი აპრილის ბოლოდან-მაისიდან გვიან შემოდგომამდე; გამოზამთრება სახლებში, სხვენებში, კარისა და ფანჯრის ღრიჭოებში, ნაპრალებში, ფუღუროებსა და ფოთლებში; კვერცხების ჯგუფები ფოთლის ქვედა მხარეზე.",
      ru: "Сезон питания в Грузии с конца апреля-мая до поздней осени; зимовка в домах, на чердаках, в щелях дверей и окон, трещинах, дуплах и листве; кладки на нижней стороне листьев.",
      tr: "Gürcistan'da nisan sonu-mayıstan geç sonbahara kadar beslenme; evlerde, çatı aralarında, kapı ve pencere aralıklarında, çatlaklarda, kovuklarda ve yapraklarda kışlama; yaprak altına grup hâlinde yumurta.",
    },
    url: "https://nfa.gov.ge/Ge/Page/Brown%20Marmorated%20Stink%20Bug%20(BMSB)",
  },
  {
    name: "სურსათის ეროვნული სააგენტო — როგორ ვებრძოლოთ აზიურ ფაროსანას მექანიკური მეთოდებით",
    supports: {
      en: "Mechanical control for stink bugs that entered homes: sweeping off walls and collecting with a vacuum; cardboard egg-tray shelters placed near houses.",
      ka: "სახლში შესულ ფაროსანასთან მექანიკური ბრძოლა: კედლიდან ცოცხით ჩამოღება და მტვერსასრუტით შეგროვება; სახლთან დადგმული მუყაოს თავშესაფარი.",
      ru: "Механические методы для клопов в доме: сметание со стен и сбор пылесосом; картонные укрытия из яичных лотков возле домов.",
      tr: "Eve giren kokarcaya mekanik yöntemler: duvardan süpürme ve elektrikli süpürgeyle toplama; ev yakınına konan karton viyol sığınaklar.",
    },
    url: "https://nfa.gov.ge/ge/News/Details/192",
  },
  {
    name: "სურსათის ეროვნული სააგენტო — აზიური ფაროსანა (2024 წლის 30 აპრილის სიახლე)",
    supports: {
      en: "As temperatures rise in spring, stink bugs leave residential houses and abandoned buildings.",
      ka: "გაზაფხულზე, ტემპერატურის მატებასთან ერთად, ფაროსანა საცხოვრებელ სახლებსა და მიტოვებულ შენობებს ტოვებს.",
      ru: "Весной с ростом температуры клопы покидают жилые дома и заброшенные здания.",
      tr: "İlkbaharda sıcaklık arttıkça kokarcalar konutları ve terk edilmiş binaları bırakır.",
    },
    url: "https://nfa.gov.ge/up/News/Details/524",
  },
  {
    name: "NCDC Georgia — აზიური ფაროსანა და რეკომენდაციები შენობების დასაცავად",
    supports: {
      en: "Not venomous; does not bite people or pets; does not transmit human or animal diseases; some people may be sensitive to the secretion, not described as life-threatening.",
      ka: "შხამიანი არ არის; ადამიანს და შინაურ ცხოველებს არ კბენს; დაავადებებს არ გადასცემს; სეკრეტის მიმართ ზოგი ადამიანი მგრძნობიარეა, რაც სიცოცხლისთვის საშიშად არ არის აღწერილი.",
      ru: "Не ядовит; не кусает людей и животных; не передаёт болезни; у части людей возможна чувствительность к секрету, не описанная как опасная для жизни.",
      tr: "Zehirli değildir; insanları ve evcil hayvanları ısırmaz; hastalık taşımaz; bazı kişilerde salgıya hassasiyet olabilir, yaşamı tehdit eden bir durum olarak tanımlanmaz.",
    },
    url: "https://test.ncdc.ge/pages/user/LetterContent.aspx?ID=6f8dffa7-e31f-4b8f-b7f6-f188c761e44b",
  },
  {
    name: "Musolin et al. 2019 — Photoperiodic and temperature control of nymphal growth and adult diapause induction in the invasive Caucasian population of Halyomorpha halys (Journal of Pest Science)",
    supports: {
      en: "The species overwinters as adults; in the invasive Caucasian population, short days induced winter adult diapause in all adults in the laboratory.",
      ka: "სახეობა ზრდასრულის სახით იზამთრებს; კავკასიური ინვაზიური პოპულაციის ლაბორატორიულ ცდაში მოკლე დღე ყველა ზრდასრულში ზამთრის დიაპაუზას იწვევდა.",
      ru: "Вид зимует во взрослой стадии; в лаборатории короткий день вызывал зимнюю диапаузу у всех взрослых особей кавказской инвазивной популяции.",
      tr: "Tür ergin olarak kışlar; Kafkas istilacı popülasyonunda laboratuvarda kısa gün tüm erginlerde kış diyapozuna yol açtı.",
    },
    url: "https://doi.org/10.1007/s10340-019-01080-1",
  },
  {
    name: "Penn State Extension — Brown Marmorated Stink Bug",
    supports: {
      en: "Exclusion with silicone or silicone-latex caulk around windows, doors, siding, utility pipes, chimneys and fascia; screen repair; indoor emergence points; no reproduction or damage indoors; vacuum odour; no insecticide in wall voids (carpet beetles); limited, short-lived exterior treatment by professionals.",
      ka: "ჰერმეტიკით იზოლაცია ფანჯრების, კარების, მოპირკეთების, მილების, საკვამურისა და კარნიზის გარშემო; ბადეების შეკეთება; შიგნით გამოსვლის ადგილები; სახლში არ მრავლდება და არ აზიანებს; მტვერსასრუტის სუნი; ინსექტიციდი არა კედლის ღრუში (ტყავიჭამიები); გარე დამუშავების მცირე და ხანმოკლე ეფექტი.",
      ru: "Герметизация щелей у окон, дверей, облицовки, труб, дымохода и карниза; ремонт сеток; места выхода в доме; не размножается и не вредит в доме; запах пылесоса; не обрабатывать пустоты стен (кожееды); слабый и короткий эффект наружной обработки.",
      tr: "Pencere, kapı, cephe, boru, baca ve saçak çevresinde silikon dolgu; sineklik onarımı; iç mekânda çıkış noktaları; evde üremez ve zarar vermez; süpürge kokusu; duvar boşluğuna ilaç yok (halı böcekleri); dış ilaçlamanın sınırlı ve kısa etkisi.",
    },
    url: "https://extension.psu.edu/brown-marmorated-stink-bug",
  },
  {
    name: "University of Minnesota Extension — Brown marmorated stink bug",
    supports: {
      en: "Pesticides are not recommended indoors; seal gaps around doors, windows, screens, and where cords, pipes and cables enter the home.",
      ka: "სახლის შიგნით პესტიციდი რეკომენდებული არ არის; დახურეთ ღრიჭოები კარების, ფანჯრების, ბადეების გარშემო და იქ, სადაც სადენები, მილები და კაბელები შედის.",
      ru: "Пестициды в доме не рекомендуются; заделывать щели у дверей, окон, сеток и в местах ввода проводов, труб и кабелей.",
      tr: "Ev içinde pestisit önerilmez; kapı, pencere, sineklik çevresindeki ve kablo, boru girişlerindeki aralıkları kapatın.",
    },
    url: "https://extension.umn.edu/yard-and-garden-insects/brown-marmorated-stink-bug",
  },
  {
    name: "University of Minnesota Extension — It's freezing out. Why are there bugs in my house?",
    supports: {
      en: "Entry via eaves, door and window gaps and attics; winter inactivity; waking on warm days or in heated rooms, often in bathrooms and kitchens; no egg-laying, breeding, damage or biting in winter.",
      ka: "შემოსვლა სახურავის კიდიდან, კარისა და ფანჯრის ღრიჭოებიდან და სხვენიდან; ზამთრის უმოძრაობა; თბილ დღეებში ან გათბობისას გამოღვიძება, ხშირად სააბაზანოსა და სამზარეულოში; ზამთარში არ დებს კვერცხს, არ მრავლდება, არ აზიანებს და არ კბენს.",
      ru: "Проникновение через карнизы, щели дверей и окон, чердак; зимняя неподвижность; пробуждение в тёплые дни или при отоплении, часто в ванной и на кухне; зимой не откладывают яйца, не размножаются, не вредят и не кусают.",
      tr: "Saçak, kapı ve pencere aralıkları ve çatı arasından giriş; kış hareketsizliği; ılık günlerde veya ısıtmayla uyanma, sıklıkla banyo ve mutfakta; kışın yumurta bırakmaz, üremez, zarar vermez, ısırmaz.",
    },
    url: "https://extension.umn.edu/yard-and-garden-news/its-freezing-out-why-are-there-bugs-my-house",
  },
  {
    name: "University of Maryland Extension — Tips for Dealing With Brown Marmorated Stink Bugs",
    supports: {
      en: "Soapy-water container method, brushing bugs off walls, windows and drapes; vacuum odour is temporary; stocking inside the vacuum hose.",
      ka: "საპნიანი წყლის ჭურჭლის მეთოდი, კედლიდან, ფანჯრიდან და ფარდიდან ჩამოგდება; მტვერსასრუტის სუნი დროებითია; წინდა მტვერსასრუტის მილში.",
      ru: "Ёмкость с мыльной водой, смахивание со стен, окон и штор; запах пылесоса временный; чулок в трубке пылесоса.",
      tr: "Sabunlu su kabı yöntemi, duvar, pencere ve perdeden düşürme; süpürge kokusu geçicidir; süpürge hortumunda çorap.",
    },
    url: "https://extension.umd.edu/resource/tips-dealing-brown-marmorated-stink-bugs",
  },
  {
    name: "National Pesticide Information Center (NPIC) — Stink Bugs",
    supports: {
      en: "Stink bugs do not bite or sting and cause no structural damage; the odour is a defence against predators and does not attract other stink bugs.",
      ka: "ფაროსანა არ კბენს, არ ნესტრავს და შენობას არ აზიანებს; სუნი მტაცებლებისგან თავდაცვაა და სხვა ფაროსანებს არ იზიდავს.",
      ru: "Клопы не кусают, не жалят и не повреждают конструкции; запах — защита от хищников и не привлекает других клопов.",
      tr: "Kokarcalar ısırmaz, sokmaz ve yapıya zarar vermez; koku yırtıcılara karşı savunmadır ve başka kokarcaları çekmez.",
    },
    url: "https://npic.orst.edu/pest/stinkbug.html",
  },
  {
    name: "US EPA — Brown Marmorated Stink Bug",
    supports: {
      en: "Indoor aerosols and foggers kill exposed bugs but do not stop more emerging from cracks and are not a long-term solution; vacuums may smell for a while.",
      ka: "ოთახის აეროზოლი და ფოგერი ღიად მყოფ მწერებს კლავს, მაგრამ ნაპრალებიდან ახლების გამოსვლას ვერ აჩერებს და გრძელვადიანი გამოსავალი არ არის; მტვერსასრუტს შეიძლება სუნი დაჰყვეს.",
      ru: "Аэрозоли и фоггеры убивают открыто сидящих клопов, но не останавливают выход новых из щелей и не решают проблему надолго; пылесос может пахнуть.",
      tr: "Sprey ve sisleyiciler açıktaki böcekleri öldürür ama çatlaklardan yenilerinin çıkmasını engellemez ve uzun vadeli çözüm değildir; süpürge bir süre kokabilir.",
    },
    url: "https://www.epa.gov/safepestcontrol/brown-marmorated-stink-bug",
  },
  {
    name: "US EPA — Prevent Stink Bugs from Overwintering in Your School and Home",
    supports: {
      en: "Tight-fitting screens, screened vents, gap-free frames, sealing where pipes and wires enter, expanding foam for larger gaps; entry via foundations, soffits, chimneys and fireplaces.",
      ka: "მჭიდრო ბადეები, ბადით დაფარული ვენტილაცია, ღრიჭოების გარეშე ჩარჩოები, მილებისა და სადენების შესასვლელების დახურვა, სამონტაჟო ქაფი დიდი ღიობებისთვის; შემოსვლა საძირკვლიდან, კარნიზიდან, საკვამურიდან და ბუხრიდან.",
      ru: "Плотные сетки, вентиляция под сеткой, рамы без щелей, заделка вводов труб и проводов, монтажная пена для крупных щелей; проникновение через фундамент, карнизы, дымоходы и камины.",
      tr: "Sıkı oturan sineklikler, tel örgülü havalandırma, aralıksız çerçeveler, boru ve tel girişlerinin kapatılması, büyük boşluklar için köpük; temel, saçak, baca ve şömineden giriş.",
    },
    url: "https://www.epa.gov/perspectives/blog/2015/12/prevent-stink-bugs-from-overwintering-in-your-school-and-home",
  },
];

export const STINK_BUG_IN_HOUSE = defineGuideArticle({
  copy: COPY,
  hero: {
    alt: {
      en: "Several brown stink bugs on the inside of a white window frame and glass, with autumn trees outside",
      ka: "რამდენიმე ყავისფერი ფაროსანა თეთრი ფანჯრის ჩარჩოსა და მინაზე, გარეთ შემოდგომის ხეები ჩანს",
      ru: "Несколько коричневых клопов на белой оконной раме и стекле, за окном осенние деревья",
      tr: "Beyaz pencere çerçevesi ve camı üzerinde birkaç kahverengi kokarca, dışarıda sonbahar ağaçları",
    },
    height: 941,
    src: "/images/guides/stink-bug-house-hero.jpg",
    width: 1672,
  },
  id: "stink-bug-in-house",
  images: {
    gap: {
      alt: {
        en: "Two stink bugs at a crack between a window frame and a plastered outside wall",
        ka: "ორი ფაროსანა ფანჯრის ჩარჩოსა და შელესილ გარე კედელს შორის ნაპრალთან",
        ru: "Два клопа у щели между оконной рамой и оштукатуренной наружной стеной",
        tr: "Pencere çerçevesi ile sıvalı dış duvar arasındaki çatlakta iki kokarca",
      },
      height: 941,
      src: "/images/guides/stink-bug-window-gap.jpg",
      width: 1672,
    },
    sealing: {
      alt: {
        en: "Hands sealing the gap between a window frame and wall siding with a caulking gun; the window has a screen and a stink bug sits on the wall",
        ka: "ხელები ჰერმეტიკის პისტოლეტით ავსებენ ღრიჭოს ფანჯრის ჩარჩოსა და კედელს შორის; ფანჯარაზე ბადეა, კედელზე ფაროსანა ზის",
        ru: "Руки заделывают герметиком щель между оконной рамой и обшивкой стены; на окне москитная сетка, на стене сидит клоп",
        tr: "Eller dolgu tabancasıyla pencere çerçevesi ile duvar kaplaması arasındaki aralığı dolduruyor; pencerede sineklik var, duvarda bir kokarca duruyor",
      },
      height: 941,
      src: "/images/guides/stink-bug-sealing-frame.jpg",
      width: 1672,
    },
    "soapy-water": {
      alt: {
        en: "A jar of soapy water held under a stink bug on a window frame, with a piece of cardboard ready to brush it in",
        ka: "საპნიანი წყლიანი ქილა ფანჯრის ჩარჩოზე მსხდომი ფაროსანას ქვეშ და მუყაოს ნაჭერი მის ჩასაგდებად",
        ru: "Банка с мыльной водой под клопом на оконной раме и кусок картона, чтобы смахнуть его внутрь",
        tr: "Pencere çerçevesindeki kokarcanın altında sabunlu su dolu kavanoz ve onu içine düşürmek için karton parçası",
      },
      height: 941,
      src: "/images/guides/stink-bug-soapy-water.jpg",
      width: 1672,
    },
  },
  messageKey: "stinkBugInHouse",
  ogImage: "/og/images/guides/stink-bug-in-house.jpg",
  parentHub: "insects",
  pathname: "/insects/farosana-sakhlshi",
  relatedSpeciesIds: ["halyomorpha-halys"],
  search: {
    icon: "guide",
    keywords: [
      "ფაროსანა",
      "ფაროსანა სახლში",
      "ფაროსანა ზამთარში",
      "ფაროსანა ფანჯარაზე",
      "farosana",
      "parosana",
      "stink bug",
      "stink bugs in house",
      "мраморный клоп",
      "клоп-вонючка",
      "kokarca",
      "kokarca böceği",
      "გამოზამთრება",
      "მტვერსასრუტი",
    ],
    rank: 5,
    subtitle: {
      en: "Why they come in for winter and how to remove them",
      ka: "რატომ შემოდის შემოდგომაზე და როგორ მოვიშოროთ",
      ru: "Почему заходит на зиму и как от него избавиться",
      tr: "Neden kışın girer ve nasıl uzaklaştırılır",
    },
    title: {
      en: "Stink bugs in the house",
      ka: "ფაროსანა სახლში",
      ru: "Мраморный клоп в доме",
      tr: "Evde kokarca böceği",
    },
  },
  sources: SOURCES,
});
