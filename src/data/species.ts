export type DangerLevel = "Harmless" | "Moderate" | "High";

export type SpeciesStat = {
  label: string;
  value: string;
};

export type Species = {
  id: string;
  commonName: string;
  scientificName: string;
  genus: string;
  family: string;
  location: string;
  description: string;
  overview: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservation: string;
  danger: DangerLevel;
  image: string;
  gallery: string[];
  stats: SpeciesStat[];
  facts: string[];
};

export const dangerLabels: Record<DangerLevel, string> = {
  Harmless: "უვნებელი",
  Moderate: "საშუალო",
  High: "მაღალი",
};

export const species: Species[] = [
  {
    id: "vipera",
    commonName: "დინიკის გველგესლა",
    scientificName: "Vipera dinniki",
    genus: "Vipera",
    family: "Viperidae",
    location: "კავკასიონის მთები",
    description:
      "იშვიათი ალპური გველგესლა, რომელიც მხოლოდ იზოლირებულ მაღალმთიან ფერდობებზე გვხვდება.",
    overview:
      "დინიკის გველგესლა კავკასიონის ენდემური სახეობაა. ის 1,500–3,000 მეტრის სიმაღლეზე ცხოვრობს — ალპურ მდელოებზე, კლდოვან ფერდობებსა და ქვიან ფერდობებზე. წლის უმეტეს ნაწილს ქვების ქვეშ ატარებს და მხოლოდ მოკლე ზაფხულის სეზონზე გამოდის მზეზე გასათბობად და სანადიროდ.",
    habitat:
      "გავრცელებულია დიდი კავკასიონის ქედზე — საქართველოს, რუსეთისა და აზერბაიჯანის მაღალმთიან რეგიონებში. პოპულაციები ერთმანეთისგან იზოლირებულია ვიწრო ხეობებითა და მყინვარებით, რაც სახეობას განსაკუთრებით მოწყვლადს ხდის კლიმატის ცვლილების მიმართ.",
    diet: "იკვებება ძირითადად მცირე მღრღნელებით, ხვლიკებითა და ზოგჯერ ფრინველების ბარტყებით. ნადირობს ჩასაფრებით — უძრავად ელოდება მსხვერპლს და შხამიანი კბენით ანეიტრალებს.",
    behavior:
      "დღის აქტიური სახეობაა ზაფხულში, თუმცა ძლიერ სიცხეში ჩრდილს ეძებს. შემოდგომაზე იზამთრებს კლდეების ნაპრალებში. შობს ცოცხალ შთამომავლობას — ჩვეულებრივ 3–8 ნაშიერს ზაფხულის ბოლოს.",
    conservation:
      "IUCN-ის მიხედვით სახეობა მოწყვლადია (Vulnerable). მთავარი საფრთხეებია ჰაბიტატის დანაწევრება, კლიმატის დათბობა და ადამიანის ზეწოლა მაღალმთიან ზონებში. საქართველოში დაცული სახეობაა.",
    danger: "Moderate",
    image: "/images/vipera-dinnik.png",
    gallery: [
      "/images/vipera-dinnik.png",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504450874802-0ba0bcd9e6b2?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: [
      { label: "ჰაბიტატი", value: "კავკასიონის მთები" },
      { label: "სიგრძე", value: "40–60 სმ" },
      { label: "შხამი", value: "საშუალო" },
      { label: "კონსერვაცია", value: "მოწყვლადი" },
      { label: "სიმაღლე", value: "1,500–3,000 მ" },
      { label: "ოჯახი", value: "Viperidae" },
    ],
    facts: [
      "სახელი ეწოდა რუსი ზოოლოგის ნიკოლაი დინიკის პატივსაცემად.",
      "კავკასიონის ერთ-ერთი ყველაზე იშვიათი გველგესლაა.",
      "პოპულაციები რამდენიმე იზოლირებულ ქედზეა დანაწევრებული.",
      "შეუძლია რამდენიმე თვე იზამთროს ქვების ქვეშ საკვების გარეშე.",
    ],
  },
  {
    id: "komodo",
    commonName: "კომოდოს ვარანი",
    scientificName: "Varanus komodoensis",
    genus: "Varanus",
    family: "Varanidae",
    location: "მცირე ზონდის კუნძულები",
    description:
      "ყველაზე დიდი ცოცხალი ხვლიკი — მარტოხელა მონადირე მშრალ სავანაში.",
    overview:
      "კომოდოს ვარანი დედამიწის ყველაზე დიდი ცოცხალი ხვლიკია. ის ინდონეზიის რამდენიმე კუნძულზე ცხოვრობს და ცნობილია ძალით, მოთმინებითა და შხამიანი ნაკბენით.",
    habitat:
      "გავრცელებულია კომოდოს, რინკას, ფლორესისა და გილის კუნძულებზე. ცხოვრობს მშრალ ტყეებში, სავანასა და სანაპირო დაბლობებზე.",
    diet: "იკვებება ირმებით, გარეული ღორებით, ფრინველებითა და ლეშით. ახალგაზრდები ხშირად ხეებზე ცხოვრობენ და მწერებით იკვებებიან.",
    behavior:
      "მარტოხელა მტაცებელია. ნადირობს ჩასაფრებით და შეიძლება საათობით ელოდოს მსხვერპლს. ტერიტორიულია, განსაკუთრებით გამრავლების სეზონზე.",
    conservation:
      "IUCN-ის მიხედვით მოწყვლადი სახეობაა. საფრთხეებია ჰაბიტატის დაკარგვა, ადამიანთან კონფლიქტი და კლიმატის ცვლილება.",
    danger: "High",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: [
      { label: "ჰაბიტატი", value: "ინდონეზიის კუნძულები" },
      { label: "სიგრძე", value: "2–3 მ" },
      { label: "შხამი", value: "მაღალი" },
      { label: "კონსერვაცია", value: "მოწყვლადი" },
      { label: "წონა", value: "70–90 კგ" },
      { label: "ოჯახი", value: "Varanidae" },
    ],
    facts: [
      "შეუძლია მსხვერპლის სუნი რამდენიმე კილომეტრის მანძილზე იგრძნოს.",
      "ნაკბენი შეიცავს ანტიკოაგულანტ შხამს.",
      "ახალგაზრდები ხეებზე ცხოვრობენ, რათა უფროსებისგან თავი დაიცვან.",
    ],
  },
  {
    id: "anaconda",
    commonName: "მწვანე ანაკონდა",
    scientificName: "Eunectes murinus",
    genus: "Eunectes",
    family: "Boidae",
    location: "ამაზონის აუზი",
    description:
      "დედამიწის ყველაზე მძიმე გველი — ჩასაფრებული მტაცებელი ნელ წყლებში.",
    overview:
      "მწვანე ანაკონდა სამხრეთ ამერიკის ტროპიკული ჭაობებისა და მდინარეების გიგანტი გველია. ის დედამიწის ყველაზე მძიმე გველია და ნადირობს წყალში ჩასაფრებით.",
    habitat:
      "გავრცელებულია ამაზონის აუზში, ორინოკოსა და სხვა ტროპიკულ მდინარეებში. უპირატესობას ანიჭებს ნელ, მოღრუბლულ წყლებსა და ჭაობებს.",
    diet: "იჭერს თევზებს, ფრინველებს, კაიმანებსა და ძუძუმწოვრებს. მსხვერპლს ახრჩობს და მთლიანად ყლაპავს.",
    behavior:
      "ძირითადად წყლის ცხოველია. შეიძლება საათობით უძრავად ელოდოს ნადირს ზედაპირთან ახლოს, მხოლოდ ცხვირით ჰაერში.",
    conservation:
      "ამჟამად ფართოდ გავრცელებულია, თუმცა ჰაბიტატის განადგურება და ნადირობა ზოგ რეგიონში საფრთხეს ქმნის.",
    danger: "High",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: [
      { label: "ჰაბიტატი", value: "ამაზონის აუზი" },
      { label: "სიგრძე", value: "5–7 მ" },
      { label: "შხამი", value: "არა" },
      { label: "კონსერვაცია", value: "შეფასების გარეშე" },
      { label: "წონა", value: "100–200 კგ" },
      { label: "ოჯახი", value: "Boidae" },
    ],
    facts: [
      "დედამიწის ყველაზე მძიმე გველია.",
      "შეუძლია რამდენიმე საათი წყლის ქვეშ დარჩეს.",
      "შობს ცოცხალ ნაშიერებს — არ დებს კვერცხებს.",
    ],
  },
  {
    id: "chameleon",
    commonName: "პანტერის ქამელეონი",
    scientificName: "Furcifer pardalis",
    genus: "Furcifer",
    family: "Chamaeleonidae",
    location: "მადაგასკარი",
    description:
      "ფერის ცვლილება განწყობასა და ტემპერატურას გამოხატავს, არა მხოლოდ შენიღბვას.",
    overview:
      "პანტერის ქამელეონი მადაგასკარის ერთ-ერთი ყველაზე ფერადი ქვეწარმავალია. მისი ფერის ცვლილება სოციალურ სიგნალსა და ფიზიოლოგიურ მდგომარეობას ასახავს.",
    habitat:
      "ცხოვრობს მადაგასკარის აღმოსავლეთ და ჩრდილოეთ სანაპირო ტყეებში. ხშირად გვხვდება ბუჩქნარებსა და ხეების ქვედა იარუსზე.",
    diet: "იჭერს მწერებს გრძელი, წებოვანი ენით. ნადირობს ვიზუალურად — თვალები დამოუკიდებლად მოძრაობს.",
    behavior:
      "ტერიტორიულია. მამრები ერთმანეთთან კონფლიქტისას ფერს ცვლიან და სხეულს ადიდებენ. ნელი, რხეული სიარულით ბაძავს ფოთლის მოძრაობას.",
    conservation:
      "ველური პოპულაციები ზეწოლის ქვეშაა ჰაბიტატის დაკარგვისა და ვაჭრობის გამო, თუმცა ტყვეობაში ფართოდ მრავლდება.",
    danger: "Harmless",
    image:
      "https://images.unsplash.com/photo-1504450874802-0ba0bcd9e6b2?auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504450874802-0ba0bcd9e6b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496074732535-1023808c2951?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: [
      { label: "ჰაბიტატი", value: "მადაგასკარი" },
      { label: "სიგრძე", value: "40–50 სმ" },
      { label: "შხამი", value: "არა" },
      { label: "კონსერვაცია", value: "შეფასების გარეშე" },
      { label: "სიცოცხლე", value: "3–6 წელი" },
      { label: "ოჯახი", value: "Chamaeleonidae" },
    ],
    facts: [
      "თვალები 360°-იან დიაპაზონს ფარავს.",
      "ენა სხეულის სიგრძეზე გრძელია.",
      "ფერი განწყობასა და ტემპერატურას გამოხატავს.",
    ],
  },
  {
    id: "frog",
    commonName: "ლურჯი შხამიანი ბაყაყი",
    scientificName: "Dendrobates tinctorius",
    genus: "Dendrobates",
    family: "Dendrobatidae",
    location: "სამხრეთი სურინამი",
    description:
      "მისი სიკაშკაშე გაფრთხილებაა: ალკალოიდური ტოქსინები ველური კვებიდან.",
    overview:
      "ლურჯი შხამიანი ბაყაყი სამხრეთ ამერიკის ტროპიკული ტყეების პატარა, მაგრამ საშიში ამფიბიაა. მისი კაშკაშა ფერი მტაცებლებს ტოქსიკურობას უცხადებს.",
    habitat:
      "ცხოვრობს სურინამის, ფრანგული გვიანისა და ბრაზილიის ტროპიკულ ტყეებში — ტენიან ფოთლოვან საფარზე.",
    diet: "იჭერს ჭიანჭველებს, ტერმიტებსა და სხვა მცირე უხერხემლოებს, საიდანაც ტოქსინებს იღებს.",
    behavior:
      "დღის აქტიურია. მამრები ტერიტორიას იცავენ და კვერცხებს ატენიანებენ. ტყვეობაში ტოქსიკურობა მცირდება, რადგან დიეტა იცვლება.",
    conservation:
      "ზოგი პოპულაცია ჰაბიტატის განადგურებითაა საფრთხის ქვეშ. ველური ვაჭრობა რეგულირებულია CITES-ით.",
    danger: "Moderate",
    image:
      "https://images.unsplash.com/photo-1496074732535-1023808c2951?auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1496074732535-1023808c2951?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504450874802-0ba0bcd9e6b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: [
      { label: "ჰაბიტატი", value: "ტროპიკული ტყე" },
      { label: "სიგრძე", value: "3–5 სმ" },
      { label: "შხამი", value: "საშუალო" },
      { label: "კონსერვაცია", value: "ნაკლებად საფრთხის ქვეშ" },
      { label: "ტოქსინი", value: "ალკალოიდები" },
      { label: "ოჯახი", value: "Dendrobatidae" },
    ],
    facts: [
      "ტოქსინი ველური დიეტიდან მოდის, არა ორგანიზმიდან.",
      "კაშკაშა ფერი აფოსემატიზმია — გაფრთხილების სიგნალი.",
      "მამრები კვერცხებს ტენიანობას უზრუნველყოფენ.",
    ],
  },
  {
    id: "turtle",
    commonName: "მწვანე ზღვის კუ",
    scientificName: "Chelonia mydas",
    genus: "Chelonia",
    family: "Cheloniidae",
    location: "ტროპიკული ოკეანეები",
    description:
      "ათასობით კილომეტრს გადის, რათა დაბრუნდეს იმ სანაპიროზე, სადაც დაიბადა.",
    overview:
      "მწვანე ზღვის კუ ტროპიკული ოკეანეების მიგრანტი გიგანტია. ის ათასობით კილომეტრს გადის საკვები ადგილებიდან იმ სანაპირომდე, სადაც დაიბადა.",
    habitat:
      "გავრცელებულია ატლანტის, წყნარი და ინდოეთის ოკეანეების ტროპიკულ და სუბტროპიკულ წყლებში. ბუდობს ქვიშიან სანაპიროებზე.",
    diet: "ზრდასრულები ძირითადად ზღვის ბალახითა და წყალმცენარეებით იკვებებიან — აქედან მოდის სახელი „მწვანე“.",
    behavior:
      "ნავიგაციას იყენებს დედამიწის მაგნიტური ველით. დედალი ყოველ რამდენიმე წელიწადში ბრუნდება იმავე სანაპიროზე კვერცხების დასადებად.",
    conservation:
      "IUCN-ის მიხედვით საფრთხის ქვეშაა. მთავარი საფრთხეებია ბადეებში მოხვედრა, პლასტიკი, სანაპირო განვითარება და კლიმატის ცვლილება.",
    danger: "Harmless",
    image:
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1024&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: [
      { label: "ჰაბიტატი", value: "ტროპიკული ოკეანეები" },
      { label: "სიგრძე", value: "1–1.5 მ" },
      { label: "შხამი", value: "არა" },
      { label: "კონსერვაცია", value: "საფრთხის ქვეშ" },
      { label: "წონა", value: "110–190 კგ" },
      { label: "ოჯახი", value: "Cheloniidae" },
    ],
    facts: [
      "შეუძლია ათასობით კილომეტრის მიგრაცია.",
      "დაბრუნდება იმავე სანაპიროზე, სადაც დაიბადა.",
      "ზრდასრულები თითქმის მთლიანად ბალახისმჭამელები არიან.",
    ],
  },
];

export const images = {
  hero: "/images/hero-img.png",
  detail: "/images/vipera-dinnik.png",
  cta: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
};

export function getSpeciesById(id: string) {
  return species.find((item) => item.id === id);
}

export function dangerClass(danger: DangerLevel) {
  switch (danger) {
    case "High":
      return "bg-destructive/15 text-destructive";
    case "Moderate":
      return "bg-gold/20 text-gold";
    default:
      return "bg-primary/15 text-primary";
  }
}
