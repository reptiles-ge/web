export type DangerLevel = "Harmless" | "Moderate" | "High";

export type Species = {
  id: string;
  commonName: string;
  scientificName: string;
  genus: string;
  location: string;
  description: string;
  danger: DangerLevel;
  image: string;
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
    location: "კავკასიონის მთები",
    description:
      "იშვიათი ალპური გველგესლა, რომელიც მხოლოდ იზოლირებულ მაღალმთიან ფერდობებზე გვხვდება.",
    danger: "Moderate",
    image:
      "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "komodo",
    commonName: "კომოდოს ვარანი",
    scientificName: "Varanus komodoensis",
    genus: "Varanus",
    location: "მცირე ზონდის კუნძულები",
    description:
      "ყველაზე დიდი ცოცხალი ხვლიკი — მარტოხელა მონადირე მშრალ სავანაში.",
    danger: "High",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "anaconda",
    commonName: "მწვანე ანაკონდა",
    scientificName: "Eunectes murinus",
    genus: "Eunectes",
    location: "ამაზონის აუზი",
    description:
      "დედამიწის ყველაზე მძიმე გველი — ჩასაფრებული მტაცებელი ნელ წყლებში.",
    danger: "High",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "chameleon",
    commonName: "პანტერის ქამელეონი",
    scientificName: "Furcifer pardalis",
    genus: "Furcifer",
    location: "მადაგასკარი",
    description:
      "ფერის ცვლილება განწყობასა და ტემპერატურას გამოხატავს, არა მხოლოდ შენიღბვას.",
    danger: "Harmless",
    image:
      "https://images.unsplash.com/photo-1504450874802-0ba0bcd9e6b2?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "frog",
    commonName: "ლურჯი შხამიანი ბაყაყი",
    scientificName: "Dendrobates tinctorius",
    genus: "Dendrobates",
    location: "სამხრეთი სურინამი",
    description:
      "მისი სიკაშკაშე გაფრთხილებაა: ალკალოიდური ტოქსინები ველური კვებიდან.",
    danger: "Moderate",
    image:
      "https://images.unsplash.com/photo-1496074732535-1023808c2951?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "turtle",
    commonName: "მწვანე ზღვის კუ",
    scientificName: "Chelonia mydas",
    genus: "Chelonia",
    location: "ტროპიკული ოკეანეები",
    description:
      "ათასობით კილომეტრს გადის, რათა დაბრუნდეს იმ სანაპიროზე, სადაც დაიბადა.",
    danger: "Harmless",
    image:
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1024&q=80",
  },
];

export const images = {
  hero: "/images/hero-img.png",
  detail:
    "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=1200&q=80",
  cta: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
};

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
