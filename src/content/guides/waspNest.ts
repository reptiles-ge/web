import type { AppLocale } from "@/i18n/routing";

type GuideCopy = {
  description: string;
  faq: { answer: string; question: string }[];
  lead: string;
  metaTitle: string;
  sections: { heading: string; image?: "open-comb"; paragraphs: string[] }[];
  title: string;
};

export const WASP_NEST_COPY: Record<AppLocale, GuideCopy> = {
  en: {
    description:
      "Found a wasp or hornet nest? Learn when to leave it alone, when to call a professional, and which sting symptoms need urgent help.",
    faq: [
      {
        answer:
          "Georgian everyday names such as „კრაზანა“ and „ბზიკი“ overlap; a Georgian synonym dictionary links them. The name alone does not establish a species. Use nest location and activity to judge risk.",
        question:
          "Do the Georgian words for wasp and hornet mean different species?",
      },
      {
        answer:
          "Some are, but that does not make approaching a nest safe. Some hornets also fly at night. Night is not a safe time for do-it-yourself removal.",
        question: "Are wasps less active at night?",
      },
      {
        answer:
          "Many seasonal colonies die off in cold weather, but timing varies. Treat a nest with visible traffic as active.",
        question: "Can the nest empty on its own?",
      },
      {
        answer:
          "If using the balcony brings you close to the nest, avoid it for now, keep children and pets away, and seek professional assessment.",
        question: "What if a nest is on my balcony?",
      },
      {
        answer:
          "Do not seal an active nest entrance, especially in a wall or roof cavity. Insects may look for an exit into the building.",
        question: "Can I seal the entrance?",
      },
    ],
    lead: "Finding a nest is not automatically an emergency. Step away, leave it undisturbed, and keep children and pets clear. Have a professional assess a nest by a busy entrance; after a sting, call 112 in Georgia for breathing difficulty or throat swelling.",
    metaTitle: "Wasp nest near your home: what to do safely",
    sections: [
      {
        heading: "What is a wasp nest?",
        paragraphs: [
          "For social wasps, a nest is where the queen lays eggs and the colony raises young. Nesting habits differ by species. Seeing one insect alone does not establish that a nest is nearby.",
        ],
      },
      {
        heading: "What does a wasp nest look like?",
        image: "open-comb",
        paragraphs: [
          "Some nests are exposed, umbrella-like combs; others have a papery outer envelope. A nest may be out of sight inside a wall or underground. Shape and colour alone do not reliably identify the species. If you cannot tell whether the insects are wasps or bees, do not disturb the nest and leave the assessment to a professional.",
        ],
      },
      {
        heading: "Where do wasps build nests?",
        paragraphs: [
          "Depending on the species, nests can occur under eaves, on balconies, in sheds, attics and wall cavities, in trees or shrubs, and in underground spaces. Do not approach a busy entrance to investigate it.",
        ],
      },
      {
        heading: "Is a wasp nest dangerous?",
        paragraphs: [
          "Simply finding a nest is not an emergency. Risk depends on its location and activity: whether people pass close by, children play nearby, pets can reach it, or someone has a history of severe allergy. Disturbing an active colony can provoke defensive behaviour and multiple stings.",
        ],
      },
      {
        heading: "When can a nest be left alone?",
        paragraphs: [
          "A nest away from people can sometimes be left undisturbed. Avoid the area and observe only from a safe location. Wasps prey on other insects, and some visit flowers; a nest does not automatically need removal.",
        ],
      },
      {
        heading: "When might removal be needed?",
        paragraphs: [
          "Seek professional assessment if an active nest is beside a regularly used entrance, balcony or path; children or pets cannot avoid it; insects enter the building; or the nest is inaccessible. A professional can assess whether intervention is needed.",
        ],
      },
      {
        heading: "What should you never do?",
        paragraphs: [
          "Do not hit, shake, burn or break open an active nest. Do not pour fuel or improvised chemicals on it, seal an active entrance, open a wall, climb an unsafe roof or ladder, or spray an inaccessible nest from close range. These actions can disturb the colony and result in multiple stings.",
        ],
      },
      {
        heading: "What if the nest is near your home?",
        paragraphs: [
          "Keep back and route children and pets elsewhere. Observe only where your presence does not disturb the insects. There is no universal safe distance: if activity starts around you, withdraw. Contact a professional if daily access or living space overlaps the nest area.",
        ],
      },
      {
        heading: "What if the nest is in a wall or roof?",
        paragraphs: [
          "A nest inside a wall, roof, chimney or ventilation cavity may not be visible. Sealing an active outside entrance can send insects looking for another way out, potentially into the building. Do not open the structure yourself; ask a professional to assess it.",
        ],
      },
      {
        heading: "What happens in winter, and are old nests reused?",
        paragraphs: [
          "Many social wasp colonies are seasonal: the old colony dies off in cold weather, while fertilised queens overwinter and start new nests. Old nests are generally not reused, but taxa and climates vary. Do not assume a nest is empty from the calendar alone; visible traffic means it is active.",
        ],
      },
      {
        heading: "What should you do after a sting?",
        paragraphs: [
          "Local pain, redness and swelling are common. Move away from the nest, wash the site with soap and water, and apply a cold compress wrapped in cloth. Get timely medical advice after multiple stings, a sting in the mouth or throat, or worsening symptoms.",
          "Breathing difficulty, tongue or throat swelling, fainting, or rapidly spreading rash and weakness may signal a severe allergic reaction. Seek emergency medical help immediately; in Georgia, call 112. If the person has a prescribed adrenaline auto-injector, use it as directed and still call for emergency help. This page cannot diagnose a reaction.",
        ],
      },
      {
        heading: "Why do wasps matter?",
        paragraphs: [
          "Many wasps hunt other insects; some visit flowers and contribute to pollination. They also form part of food webs. Judge a nest by its location and actual risk to people, rather than assuming every nest must be destroyed.",
        ],
      },
    ],
    title: "Wasp nest near your home: how dangerous is it?",
  },
  ka: {
    description:
      "იპოვეთ კრაზანის ბუდე სახლთან ან აივანზე? გაიგეთ, როდის დატოვოთ ის მშვიდად, როდის მიმართოთ სპეციალისტს და როგორ მოიქცეთ დანესტვრისას.",
    faq: [
      {
        answer:
          "ქართულ ყოველდღიურ მეტყველებაში „ბზიკი“ და „კრაზანა“ ხშირად ურთიერთშემცვლელია; სინონიმთა ლექსიკონიც მათ აკავშირებს. ეს სახელები კონკრეტულ სახეობას ზუსტად არ ადგენს. ბუდესთან უსაფრთხო ქცევა მის მდებარეობასა და აქტივობაზეა დამოკიდებული.",
        question: "ბზიკის ბუდე და კრაზანის ბუდე ერთი და იგივეა?",
      },
      {
        answer:
          "ზოგი სახეობა ღამით ნაკლებად მოძრაობს, მაგრამ ეს ბუდეს უსაფრთხოს არ ხდის. ზოგი კრაზანა ღამითაც დაფრინავს. ღამე ბუდესთან მისვლის ან მისი მოშორების უსაფრთხო დრო არ არის.",
        question: "ღამით კრაზანები ნაკლებად აქტიურები არიან?",
      },
      {
        answer:
          "ბევრი სეზონური კოლონია სიცივისას ქრება, მაგრამ დრო სახეობასა და კლიმატზეა დამოკიდებული. სანამ მწერების მოძრაობა ჩანს, ბუდე აქტიურად ჩათვალეთ.",
        question: "შეიძლება ბუდე თავისით დაცარიელდეს?",
      },
      {
        answer:
          "თუ აივნით სარგებლობისას ბუდესთან გავლა გიწევთ, დროებით მოერიდეთ ამ სივრცეს, ბავშვები და ცხოველები არ მიუშვათ და პროფესიონალს შეაფასებინეთ მდგომარეობა.",
        question: "რა ვქნა, თუ ბუდე აივანზეა?",
      },
      {
        answer:
          "აქტიური ბუდის შესასვლელი არ დახშოთ, განსაკუთრებით კედლის ან სახურავის ღრუში: მწერებმა შეიძლება შენობის შიგნით სხვა გზა მოძებნონ.",
        question: "შეიძლება ბუდის შესასვლელის დახშობა?",
      },
    ],
    lead: "ბუდის დანახვა თავისთავად გადაუდებელ საფრთხეს არ ნიშნავს. მოშორდით, ნუ შეეხებით და ბავშვები და ცხოველები მოარიდეთ. თუ ბუდე ყოველდღიურ გასასვლელთანაა, სპეციალისტს შეაფასებინეთ; დანესტვრის შემდეგ სუნთქვის გაძნელების ან ყელის შეშუპებისას დარეკეთ 112-ზე.",
    metaTitle: "კრაზანის ბუდე — რამდენად საშიშია და როგორ მოვიქცეთ?",
    sections: [
      {
        heading: "რა არის კრაზანის ბუდე?",
        paragraphs: [
          "საზოგადოებრივი კრაზანებისთვის ბუდე ადგილია, სადაც დედალი კვერცხებს დებს და კოლონია შთამომავლობას ზრდის. სხვადასხვა სახეობა სხვადასხვა ტიპის ბუდეს აშენებს; ერთი მწერის დანახვა ბუდის არსებობას არ ადასტურებს.",
        ],
      },
      {
        heading: "როგორ გამოიყურება კრაზანის ბუდე?",
        image: "open-comb",
        paragraphs: [
          "ზოგი ბუდე ღია, ქოლგისებრი ფიჭაა; სხვას ქაღალდის მსგავსი გარსი ფარავს. ბუდე შეიძლება მთლიანად ღია იყოს ან საერთოდ არ ჩანდეს — მაგალითად, კედლისა თუ მიწის ღრუში. მხოლოდ ფორმით ან ფერით სახეობის ზუსტად განსაზღვრა არ სცადოთ. თუ ვერ არჩევთ, კრაზანაა თუ ფუტკარი, ბუდეს ნუ შეეხებით და შეფასება სპეციალისტს მიანდეთ.",
        ],
      },
      {
        heading: "სად იკეთებენ კრაზანები ბუდეს?",
        paragraphs: [
          "სახეობის მიხედვით, ბუდე შეიძლება იყოს სახურავის კიდის ქვეშ, აივანზე, ფარდულში, სხვენში, კედლის ღრუში, ხესა თუ ბუჩქზე, ან მიწისქვეშა ღრუში. თუ ერთ შესასვლელთან მწერების მუდმივ მოძრაობას ხედავთ, ნუ მიუახლოვდებით ადგილის შესამოწმებლად.",
        ],
      },
      {
        heading: "რამდენად საშიშია კრაზანის ბუდე?",
        paragraphs: [
          "ბუდის დანახვა თავისთავად გადაუდებელ საფრთხეს არ ნიშნავს. რისკს განსაზღვრავს მდებარეობა და აქტივობა: გადიან თუ არა ადამიანები ბუდესთან, თამაშობენ თუ არა იქ ბავშვები, შეუძლიათ თუ არა შინაურ ცხოველებს მიახლოება და აქვს თუ არა ვინმეს მძიმე ალერგიული რეაქციის ისტორია. აქტიური ბუდის შეწუხებისას კოლონია შეიძლება თავდაცვითი გახდეს და ადამიანმა რამდენიმე ნესტარი მიიღოს.",
        ],
      },
      {
        heading: "როდის არ არის აუცილებელი ბუდის მოშორება?",
        paragraphs: [
          "თუ ბუდე ადამიანებისგან მოშორებითაა და მას არავინ აწუხებს, ზოგჯერ უმჯობესია ხელუხლებლად დატოვოთ. ასეთ დროს საკმარისია ადგილისგან თავის არიდება და შორიდან დაკვირვება. კრაზანები სხვა მწერებსაც იჭერენ და ზოგი ყვავილსაც სტუმრობს — მათი ავტომატური განადგურება საჭირო არ არის.",
        ],
      },
      {
        heading: "როდის შეიძლება საჭირო გახდეს ბუდის მოშორება?",
        paragraphs: [
          "პროფესიონალის შეფასება გონივრულია, თუ აქტიური ბუდე კართან, ხშირად გამოყენებულ აივანთან ან ბილიკთანაა; ბავშვები ან ცხოველები მას ვერ ასცდებიან; სახლში შედის მწერები; ან ბუდე ძნელად მისადგომ ადგილასაა. სპეციალისტს შეუძლია ადგილზე შეაფასოს რისკი და გადაწყვიტოს, საჭიროა თუ არა ჩარევა.",
        ],
      },
      {
        heading: "რა არ უნდა გააკეთოთ კრაზანის ბუდის აღმოჩენისას?",
        paragraphs: [
          "ნუ დაარტყამთ, შეარხევთ ან დაშლით აქტიურ ბუდეს. ნუ დაწვავთ მას და ნუ დაასხამთ საწვავს ან თვითნაკეთ ქიმიურ ნარევს. ნუ დახშობთ მოქმედ შესასვლელს, ნუ გახსნით კედელს ბუდის მისაგნებად და ნუ ახვალთ სახურავზე ან არამდგრად კიბეზე მის მოსაშორებლად. მიუწვდომელ ღრუში ახლო მანძილიდან შესხურებაც სარისკოა. ამ ქმედებებმა შეიძლება კოლონია შეაწუხოს და მრავლობითი დანესტვრა გამოიწვიოს.",
        ],
      },
      {
        heading: "როგორ მოვიქცეთ, თუ ბუდე სახლთან ახლოსაა?",
        paragraphs: [
          "მოშორდით ბუდეს; ბავშვებსა და ცხოველებს სხვა გასავლელი შეურჩიეთ. დაკვირვება მხოლოდ იმ ადგილიდან გააგრძელეთ, სადაც მწერებს არ აწუხებთ. არ არსებობს ერთი უნივერსალური „უსაფრთხო მანძილი“ — თუ მოძრაობა თქვენს სიახლოვეს იწყება, უკან დაიხიეთ. თუ შესასვლელი, საცხოვრებელი სივრცე ან ყოველდღიური საქმიანობა ბუდესთან კვეთს, პროფესიონალს დაუკავშირდით.",
        ],
      },
      {
        heading: "კრაზანის ბუდე კედელში ან სახურავში",
        paragraphs: [
          "კედლის, სახურავის, საკვამურისა თუ სავენტილაციო ღრუს ბუდე გარედან შეიძლება არც ჩანდეს. აქტიური შესასვლელის უბრალოდ ამოქოლვამ მწერები შესაძლოა შენობის შიგნით სხვა გასასვლელის ძებნისკენ უბიძგოს. ასეთ ადგილას კედელი არ გახსნათ და ჩარევის გზა სპეციალისტს შეაფასებინეთ.",
        ],
      },
      {
        heading: "რა ხდება ბუდეს ზამთარში და იყენებენ თუ არა ძველ ბუდეს?",
        paragraphs: [
          "ბევრი საზოგადოებრივი კრაზანის კოლონია სეზონურია: სიცივისას ძველი კოლონია ქრება, ხოლო გამოზამთრებული განაყოფიერებული დედლები ახალ ბუდეებს იწყებენ. ძველი ბუდე, როგორც წესი, არ გამოიყენება, თუმცა სახეობებსა და კლიმატს შორის გამონაკლისებია. მხოლოდ კალენდრით ნუ ჩათვლით ბუდეს ცარიელად; თუ მოძრაობა ჩანს, აქტიურია.",
        ],
      },
      {
        heading: "რა გავაკეთოთ კრაზანის დანესტვრის შემდეგ?",
        paragraphs: [
          "ჩვეულებრივი ადგილობრივი რეაქციაა ტკივილი, სიწითლე ან შეშუპება დანესტვრის ადგილას. მოშორდით ბუდეს, ადგილი საპნითა და წყლით დაიბანეთ და ცივი კომპრესი ქსოვილში გახვეული დაიდეთ. თუ რამდენჯერმე დაგნესტრეს, თუ დანესტვრა პირში ან ყელთანაა, ან სიმპტომები ძლიერდება, დროულად მიიღეთ სამედიცინო რჩევა.",
          "სუნთქვის გაძნელება, ენის ან ყელის შეშუპება, გონების დაკარგვა ან სწრაფად განვითარებული ფართო გამონაყარი და სისუსტე შეიძლება მძიმე ალერგიული რეაქციის ნიშანი იყოს. დაუყოვნებლივ გამოიძახეთ სასწრაფო სამედიცინო დახმარება — საქართველოში 112. თუ ადამიანს ექიმის მიერ დანიშნული ადრენალინის ავტოინჟექტორი აქვს, გამოიყენოს მისი ინსტრუქციის მიხედვით; სასწრაფო დახმარების გამოძახება მაინც აუცილებელია. ეს გვერდი დიაგნოზს ვერ სვამს.",
        ],
      },
      {
        heading: "რატომ არიან კრაზანები ეკოსისტემისთვის მნიშვნელოვანი?",
        paragraphs: [
          "ბევრი კრაზანა სხვა მწერებს ნადირობს; ზოგი ყვავილზე ნექტარს იღებს და დამტვერვაშიც მონაწილეობს. ისინი საკვები ქსელის ნაწილიც არიან. ამიტომ გადაწყვეტილება ბუდის ადგილსა და ადამიანებისთვის რეალურ რისკს უნდა დაეყრდნოს, არა მხოლოდ შიშს.",
        ],
      },
    ],
    title: "კრაზანის ბუდე: რამდენად საშიშია და როგორ მოვიქცეთ?",
  },
  ru: {
    description:
      "Обнаружили осиное гнездо? Узнайте, когда его можно не трогать, когда нужен специалист и при каких симптомах укуса требуется срочная помощь.",
    faq: [
      {
        answer:
          "В разговорной грузинской речи эти названия пересекаются; словарь синонимов связывает их. По бытовому названию нельзя определить вид. Оценивайте расположение и активность гнезда.",
        question:
          "Грузинские названия „кразана“ и „бзики“ обозначают разные виды?",
      },
      {
        answer:
          "Некоторые менее активны, но это не делает гнездо безопасным. Некоторые шершни летают и ночью. Не подходите к гнезду для самостоятельного удаления.",
        question: "Ночью осы менее активны?",
      },
      {
        answer:
          "Многие сезонные колонии исчезают с наступлением холода, но сроки различаются. Если насекомые летают у входа, считайте гнездо активным.",
        question: "Может ли гнездо опустеть само?",
      },
      {
        answer:
          "Если пользование балконом требует проходить возле гнезда, пока избегайте его, не подпускайте детей и животных и обратитесь к специалисту.",
        question: "Что делать с гнездом на балконе?",
      },
      {
        answer:
          "Не закрывайте вход в активное гнездо, особенно в стене или под крышей: насекомые могут искать выход внутрь здания.",
        question: "Можно ли закрыть вход в гнездо?",
      },
    ],
    lead: "Обнаружение гнезда само по себе не означает чрезвычайной ситуации. Отойдите, не тревожьте его и не подпускайте детей и животных. Гнездо у часто используемого входа должен оценить специалист; при затруднении дыхания или отёке горла после ужаления звоните 112 в Грузии.",
    metaTitle: "Осиное гнездо у дома: как действовать безопасно",
    sections: [
      {
        heading: "Что такое осиное гнездо?",
        paragraphs: [
          "У общественных ос гнездо служит местом, где матка откладывает яйца, а колония выращивает потомство. Способы гнездования различаются по видам. Одна замеченная оса ещё не доказывает наличие гнезда.",
        ],
      },
      {
        heading: "Как выглядит осиное гнездо?",
        image: "open-comb",
        paragraphs: [
          "Одни гнёзда выглядят как открытые соты, другие окружены бумагообразной оболочкой. Гнездо может быть скрыто в стене или под землёй. По форме и цвету нельзя надёжно определить вид. Если вы не можете понять, осы это или пчёлы, не трогайте гнездо и доверьте оценку специалисту.",
        ],
      },
      {
        heading: "Где осы строят гнёзда?",
        paragraphs: [
          "В зависимости от вида гнёзда бывают под карнизами, на балконах, в сараях и на чердаках, в полостях стен, на деревьях и кустарниках или под землёй. Не подходите к оживлённому входу, чтобы проверить его.",
        ],
      },
      {
        heading: "Насколько опасно осиное гнездо?",
        paragraphs: [
          "Само обнаружение гнезда не означает чрезвычайную ситуацию. Риск зависит от места и активности: проходят ли рядом люди, играют ли дети, могут ли добраться животные, есть ли у кого-то тяжёлая аллергия в анамнезе. Потревоженная колония может защищаться и нанести несколько ужалений.",
        ],
      },
      {
        heading: "Когда гнездо можно оставить?",
        paragraphs: [
          "Если гнездо вдали от людей, его иногда можно не трогать. Избегайте этого места и наблюдайте лишь из безопасной точки. Осы ловят других насекомых, а некоторые посещают цветки; уничтожать каждое гнездо не нужно.",
        ],
      },
      {
        heading: "Когда может потребоваться удаление?",
        paragraphs: [
          "Обратитесь за оценкой к специалисту, если активное гнездо рядом с используемым входом, балконом или дорожкой; его не могут обойти дети или животные; насекомые попадают в дом; либо гнездо труднодоступно. Специалист определит, нужно ли вмешательство.",
        ],
      },
      {
        heading: "Чего нельзя делать?",
        paragraphs: [
          "Не бейте, не трясите, не поджигайте и не вскрывайте активное гнездо. Не заливайте его горючим или самодельными смесями, не закрывайте вход, не вскрывайте стену и не взбирайтесь на ненадёжную лестницу или крышу. Не распыляйте средства в труднодоступное гнездо с близкого расстояния. Это может вызвать множественные ужаления.",
        ],
      },
      {
        heading: "Как поступить, если гнездо рядом с домом?",
        paragraphs: [
          "Отойдите и направьте детей и животных другим путём. Наблюдайте только с расстояния, на котором насекомых не тревожат. Универсальной безопасной дистанции нет: если осы начали летать возле вас, отступите. При пересечении гнезда с повседневным маршрутом обратитесь к специалисту.",
        ],
      },
      {
        heading: "Гнездо в стене или под крышей",
        paragraphs: [
          "Гнездо в стене, крыше, дымоходе или вентиляции может быть скрыто. Если перекрыть действующий наружный вход, насекомые могут искать другой выход, в том числе внутрь здания. Не вскрывайте конструкции самостоятельно; попросите специалиста оценить ситуацию.",
        ],
      },
      {
        heading: "Что происходит зимой и используют ли старые гнёзда?",
        paragraphs: [
          "Многие колонии общественных ос живут один сезон: с холодами старая колония погибает, а оплодотворённые самки зимуют и строят новые гнёзда. Старые гнёзда обычно не используются повторно, но виды и климат различаются. Не считайте гнездо пустым лишь по календарю: заметное движение означает активность.",
        ],
      },
      {
        heading: "Что делать после ужаления?",
        paragraphs: [
          "Местная боль, покраснение и отёк обычны. Отойдите от гнезда, промойте место водой с мылом и приложите холодный компресс через ткань. После нескольких ужалений, ужаления во рту или горле либо ухудшения симптомов своевременно обратитесь за медицинским советом.",
          "Затруднение дыхания, отёк языка или горла, обморок, быстро распространяющаяся сыпь и слабость могут указывать на тяжёлую аллергическую реакцию. Немедленно вызовите экстренную медицинскую помощь; в Грузии — 112. Если человеку назначен автоинъектор адреналина, используйте его по инструкции и всё равно вызовите помощь. Эта страница не ставит диагноз.",
        ],
      },
      {
        heading: "Зачем нужны осы?",
        paragraphs: [
          "Многие осы охотятся на других насекомых, некоторые посещают цветки и участвуют в опылении. Они входят в пищевые сети. Решение принимайте по месту гнезда и реальному риску для людей, а не исходя из предположения, что любое гнездо надо уничтожить.",
        ],
      },
    ],
    title: "Осиное гнездо у дома: насколько это опасно?",
  },
  tr: {
    description:
      "Eşek arısı yuvası buldunuz mu? Ne zaman dokunmadan bırakılacağını, ne zaman uzman çağrılacağını ve sokmada acil belirtileri öğrenin.",
    faq: [
      {
        answer:
          "Günlük kullanımda bu adlar örtüşür; Gürcüce eş anlamlılar sözlüğü de onları ilişkilendirir. Yaygın addan tek başına tür belirlenemez. Konum ve etkinliğe göre risk değerlendirin.",
        question: "Gürcüce „კრაზანა“ ve „ბზიკი“ farklı türler midir?",
      },
      {
        answer:
          "Bazı türler öyledir, fakat bu yuvayı güvenli yapmaz. Bazı eşek arıları gece de uçar. Gece kendiniz müdahale etmeyin.",
        question: "Gece daha az etkinler mi?",
      },
      {
        answer:
          "Birçok mevsimlik koloni soğukta yok olur, ancak zamanlama değişir. Girişte hareket varsa yuvayı aktif kabul edin.",
        question: "Yuva kendiliğinden boşalır mı?",
      },
      {
        answer:
          "Balkonu kullanırken yuvaya yaklaşmanız gerekiyorsa şimdilik kullanmayın; çocukları ve hayvanları uzak tutup uzman görüşü alın.",
        question: "Yuva balkondaysa ne yapmalı?",
      },
      {
        answer:
          "Aktif yuvanın girişini, özellikle duvar veya çatı boşluğundaysa, kapatmayın. Böcekler binanın içine doğru başka çıkış arayabilir.",
        question: "Yuva girişini kapatabilir miyim?",
      },
    ],
    lead: "Bir yuva görmek tek başına acil durum anlamına gelmez. Uzaklaşın, yuvayı rahatsız etmeyin ve çocuklarla evcil hayvanları yaklaştırmayın. Sık kullanılan girişteki yuvayı bir uzmana değerlendirtin; sokma sonrası solunum güçlüğü veya boğaz şişmesinde Gürcistan'da 112'yi arayın.",
    metaTitle: "Eşek arısı yuvası: ne zaman tehlikeli, ne yapmalı?",
    sections: [
      {
        heading: "Eşek arısı yuvası nedir?",
        paragraphs: [
          "Sosyal eşek arılarında yuva, kraliçenin yumurta bıraktığı ve koloninin yavruları büyüttüğü yerdir. Yuva yapma biçimi türe göre değişir. Tek bir böcek görmek yakında yuva olduğunu kanıtlamaz.",
        ],
      },
      {
        heading: "Yuva nasıl görünür?",
        image: "open-comb",
        paragraphs: [
          "Bazı yuvalar açık, şemsiye benzeri peteklerdir; bazılarının kâğıdı andıran dış kılıfı vardır. Yuva duvarın içinde veya toprağın altında görünmeyebilir. Yalnızca şekil ve renkle tür kesin olarak belirlenemez. Böceklerin eşek arısı mı yoksa arı mı olduğunu ayırt edemiyorsanız yuvaya dokunmayın; değerlendirmeyi bir uzmana bırakın.",
        ],
      },
      {
        heading: "Yuvalar nerelerde bulunur?",
        paragraphs: [
          "Türe bağlı olarak çatı saçaklarında, balkonlarda, kulübelerde, tavan aralarında, duvar boşluklarında, ağaç ve çalılarda ya da yeraltı boşluklarında olabilir. İşlek bir girişe yaklaşarak incelemeyin.",
        ],
      },
      {
        heading: "Yuva ne kadar tehlikelidir?",
        paragraphs: [
          "Yuva görmek tek başına acil durum değildir. Risk konumuna ve etkinliğine bağlıdır: insanlar yakından geçiyor mu, çocuklar orada oynuyor mu, evcil hayvanlar ulaşabiliyor mu, birinin ağır alerji öyküsü var mı? Aktif koloniyi rahatsız etmek savunma davranışına ve çok sayıda sokmaya yol açabilir.",
        ],
      },
      {
        heading: "Yuva ne zaman bırakılabilir?",
        paragraphs: [
          "İnsanlardan uzaktaki bir yuva bazen rahatsız edilmeden bırakılabilir. Bölgeden uzak durun ve yalnızca güvenli bir yerden gözlemleyin. Eşek arıları başka böcekleri avlar; bazıları çiçekleri ziyaret eder. Her yuvanın kaldırılması gerekmez.",
        ],
      },
      {
        heading: "Ne zaman müdahale gerekebilir?",
        paragraphs: [
          "Aktif yuva sık kullanılan giriş, balkon veya yol yanındaysa; çocuklar ve hayvanlar kaçınamıyorsa; böcekler binaya giriyorsa ya da yuva erişilemez yerdeyse uzman değerlendirmesi isteyin. Müdahalenin gerekip gerekmediğini uzman belirleyebilir.",
        ],
      },
      {
        heading: "Neleri yapmamalısınız?",
        paragraphs: [
          "Aktif yuvaya vurmayın, sallamayın, yakmayın veya parçalamayın. Üzerine yakıt ya da ev yapımı kimyasallar dökmeyin; girişini kapatmayın, duvarı açmayın, güvensiz merdivene veya çatıya çıkmayın. Ulaşılması zor bir yuvaya yakından ilaç püskürtmeyin. Bu hareketler çok sayıda sokmaya neden olabilir.",
        ],
      },
      {
        heading: "Yuva evin yakınındaysa ne yapmalı?",
        paragraphs: [
          "Uzaklaşın; çocuklar ve evcil hayvanlar için başka bir geçiş seçin. Yalnızca böcekleri rahatsız etmeyeceğiniz yerden gözlemleyin. Her durum için geçerli güvenli bir mesafe yoktur: çevrenizde hareket başlarsa geri çekilin. Günlük geçiş alanı veya yaşam alanı yuvayla çakışıyorsa uzmana başvurun.",
        ],
      },
      {
        heading: "Duvar veya çatıda yuva",
        paragraphs: [
          "Duvar, çatı, baca veya havalandırma boşluğundaki yuva görünmeyebilir. Aktif dış girişi kapatmak böceklerin bina içine doğru başka çıkış aramasına yol açabilir. Yapıyı kendiniz açmayın; uzman değerlendirmesi isteyin.",
        ],
      },
      {
        heading: "Kışın ne olur, eski yuva yeniden kullanılır mı?",
        paragraphs: [
          "Birçok sosyal eşek arısı kolonisinin ömrü bir mevsimdir: soğukta eski koloni ölür, döllenmiş kraliçeler kışı geçirip yeni yuvalar kurar. Eski yuvalar genellikle yeniden kullanılmaz, ancak tür ve iklime göre istisnalar vardır. Takvime bakarak yuvayı boş saymayın; girişte hareket varsa aktiftir.",
        ],
      },
      {
        heading: "Sokmadan sonra ne yapmalı?",
        paragraphs: [
          "Sokma yerinde ağrı, kızarıklık ve şişlik yaygındır. Yuvadan uzaklaşın, bölgeyi sabunlu suyla yıkayın ve beze sarılmış soğuk kompres uygulayın. Çok sayıda sokma, ağız veya boğazda sokma ya da kötüleşen belirtiler için zamanında tıbbi görüş alın.",
          "Solunum güçlüğü, dil veya boğaz şişmesi, bayılma ya da hızla yayılan döküntü ve güçsüzlük ağır alerjik reaksiyon belirtisi olabilir. Hemen acil tıbbi yardım çağırın; Gürcistan'da 112. Kişinin reçete edilmiş adrenalin otoenjektörü varsa talimatına göre kullanın ve yine de acil yardım çağırın. Bu sayfa tanı koymaz.",
        ],
      },
      {
        heading: "Eşek arıları neden önemlidir?",
        paragraphs: [
          "Birçok eşek arısı başka böcekleri avlar; bazıları çiçekleri ziyaret ederek tozlaşmaya katkı sağlar. Besin ağlarının da parçasıdır. Kararı her yuvanın yok edilmesi gerektiği varsayımına değil, gerçek insan riskine göre verin.",
        ],
      },
    ],
    title: "Evin yakınında eşek arısı yuvası: ne yapmalı?",
  },
};

export const WASP_NEST_SOURCES = [
  {
    name: "Penn State Extension — Getting Rid of Paper Wasps, Yellowjackets, and Other Stinging Insects",
    supports: {
      en: "Risk by nest location, when a nest may be left alone, and seasonal colonies.",
      ka: "ბუდის მდებარეობის მიხედვით რისკის შეფასება, დატოვების შესაძლებლობა და სეზონური კოლონიები.",
      ru: "Оценка риска по месту гнезда, возможность оставить его и сезонность колоний.",
      tr: "Yuvanın konumuna göre risk, dokunmadan bırakma ve mevsimlik koloniler.",
    },
    url: "https://extension.psu.edu/getting-rid-of-paper-wasps-yellowjackets-and-other-stinging-insects",
  },
  {
    name: "University of Minnesota Extension — Wasps and bees",
    supports: {
      en: "Different nest types and sites, seasonal cycle, and exceptions to old-nest non-reuse.",
      ka: "ბუდეების განსხვავებული ტიპები და ადგილები, სეზონური ციკლი და ძველი ბუდის ხელახალი გამოყენების გამონაკლისები.",
      ru: "Разные типы и места гнёзд, сезонный цикл и исключения для повторного использования.",
      tr: "Farklı yuva biçimleri ve yerleri, mevsimlik döngü ve eski yuvanın kullanımıyla ilgili istisnalar.",
    },
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/yard-and-garden-insects/wasps-and-bees",
  },
  {
    name: "Penn State Extension — European Hornet",
    supports: {
      en: "Risk of sealing an active wall-cavity entrance and an example of nocturnal activity.",
      ka: "კედლის ღრუს აქტიური შესასვლელის დახშობის რისკი და ღამით აქტიური სახეობის მაგალითი.",
      ru: "Риск перекрытия входа в активное гнездо в стене и пример ночной активности.",
      tr: "Aktif duvar yuvasının girişini kapatma riski ve gece etkinliğine örnek.",
    },
    url: "https://extension.psu.edu/european-hornet",
  },
  {
    name: "Penn State Extension — Common Social Bees and Wasps",
    supports: {
      en: "Social wasp nests, colony defence, insect predation, and flower visits.",
      ka: "საზოგადოებრივი კრაზანების ბუდეები, თავდაცვა, სხვა მწერებზე ნადირობა და ყვავილების მონახულება.",
      ru: "Гнёзда общественных ос, защита колонии, охота на насекомых и посещение цветков.",
      tr: "Sosyal eşek arısı yuvaları, savunma, böcek avcılığı ve çiçek ziyaretleri.",
    },
    url: "https://extension.psu.edu/common-social-bees-and-wasps-of-pennsylvania-behavior-lifecycle-and-management",
  },
  {
    name: "NHS — Insect bites and stings",
    supports: {
      en: "Care for local reactions, multiple stings, and emergency warning signs.",
      ka: "ადგილობრივი რეაქციის მოვლა, მრავლობითი დანესტვრა და გადაუდებელი სიმპტომები.",
      ru: "Помощь при местной реакции, множественные ужаления и тревожные признаки.",
      tr: "Yerel tepki bakımı, çoklu sokmalar ve acil uyarı belirtileri.",
    },
    url: "https://www.nhs.uk/conditions/insect-bites-and-stings/",
  },
  {
    name: "NHS — Anaphylaxis",
    supports: {
      en: "Severe allergic reaction signs, emergency help, and prescribed auto-injector use.",
      ka: "მძიმე ალერგიული რეაქციის ნიშნები, სასწრაფო დახმარების საჭიროება და დანიშნული ავტოინჟექტორის გამოყენება.",
      ru: "Признаки тяжёлой аллергии, необходимость экстренной помощи и назначенный автоинъектор.",
      tr: "Ağır alerji belirtileri, acil yardım ve reçeteli otoenjektör kullanımı.",
    },
    url: "https://www.nhs.uk/conditions/anaphylaxis/",
  },
  {
    name: "112 Georgia — Frequently asked questions",
    supports: {
      en: "Georgia's emergency medical assistance number is 112.",
      ka: "საქართველოში გადაუდებელი სამედიცინო დახმარების ნომერია 112.",
      ru: "Номер экстренной медицинской помощи в Грузии — 112.",
      tr: "Gürcistan'da acil tıbbi yardım numarası 112'dir.",
    },
    url: "https://112.gov.ge/?page_id=599",
  },
  {
    name: "საქართველოს ეროვნული ბიბლიოთეკა — ქართულ სინონიმთა ლექსიკონი: „კრაზანა“",
    supports: {
      en: "The Georgian synonym dictionary lists „ბზიკი“ under „კრაზანა“; common names alone do not identify a species.",
      ka: "ლექსიკონი „ბზიკს“ „კრაზანის“ სინონიმად ასახელებს; ყოველდღიური სახელები ტაქსონომიურ იდენტიფიკაციას არ იძლევა.",
      ru: "Грузинский словарь синонимов связывает „ბზიკი“ и „კრაზანა“; бытовое название не определяет вид.",
      tr: "Gürcüce eş anlamlılar sözlüğü „ბზიკი“ ve „კრაზანა“ sözcüklerini ilişkilendirir; yaygın ad türü belirlemez.",
    },
    url: "https://www.nplg.gov.ge/gwdict/index.php?a=term&d=17&t=50797",
  },
] as const;
