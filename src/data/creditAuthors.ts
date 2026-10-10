import type { AppLocale } from "@/i18n/routing";

import { pickLocalized } from "@/i18n/localeMeta";

export type CreditAffiliationId =
  | "borjomi-kharagauli-national-park"
  | "connecticut-college"
  | "georgian-society-of-nature-friends"
  | "ilia-state-university"
  | "institute-of-zoology"
  | "naturehistorium";

export type CreditAuthor = {
  affiliations?: CreditAffiliationId[];
  aliases: string[];
  bio?: {
    en: string;
    ka: string;
    ru?: string;
    tr?: string;
  };
  id: string;
  jobTitle?: CreditAuthorJobTitle;
  kind?: CreditAuthorKind;
  links?: {
    facebook?: string;
    instagram?: string;
    researchGate?: string;
  };
  metaDescription?: {
    en?: string;
    ru?: string;
    tr?: string;
  };
  name: {
    en: string;
    ka: string;
    ru?: string;
    tr?: string;
  };
  portraitClass?: string;
  portraitSrc: string;
  published: boolean;
  role: CreditAuthorRole;
  slug: string;
};

export type CreditAuthorJobTitle =
  "director" | "professor" | "ranger" | "researcher";

export type CreditAuthorKind = "page" | "person";

export type CreditAuthorRole =
  "herpetologist" | "photographer" | "ranger" | "researcher";

export const CREDIT_AUTHORS: CreditAuthor[] = [
  {
    aliases: [
      "Alexandre Khakhva",
      "Sandro Khakhva",
      "ალექსანდრე ხახვა",
      "სანდრო ხახვა",
    ],
    bio: {
      en: "Sandro (Alexandre) Khakhva is a young Georgian researcher from Adjara — a beginning herpetologist and naturalist.",
      ka: "სანდრო (ალექსანდრე) ხახვა ახალგაზრდა ქართველი მკვლევარია აჭარიდან — დამწყები ჰერპეტოლოგი და ნატურალისტი.",
      ru: "Сандро (Александр) Хахва — молодой грузинский исследователь из Аджарии, начинающий герпетолог и натуралист.",
      tr: "Sandro (Alexandre) Khakhva, Acara’dan genç bir Gürcü araştırmacıdır — yeni başlayan herpetolog ve natüralist.",
    },
    id: "sandro-khakhva",
    name: {
      en: "Sandro Khakhva",
      ka: "სანდრო ხახვა",
      ru: "Сандро Хахва",
      tr: "Sandro Khakhva",
    },
    portraitSrc: "https://cdn.reptiles.ge/authors/sandro-khakhva.jpg",
    published: true,
    role: "herpetologist",
    slug: "sandro-khakhva",
  },
  {
    affiliations: ["borjomi-kharagauli-national-park"],
    aliases: ["Zauri Khachidze", "ზაური ხაჩიძე"],
    bio: {
      en: "Ranger at Borjomi-Kharagauli National Park and wildlife photographer. For years he has worked in the protected area, combining nature protection with documenting the diversity of Georgia’s wildlife.",
      ka: "ბორჯომ-ხარაგაულის ეროვნული პარკის რეინჯერი და ველური ბუნების ფოტოგრაფი. იგი წლების განმავლობაში მუშაობდა დაცულ ტერიტორიაზე, სადაც ბუნების დაცვის საქმიანობასთან ერთად საქართველოს ველური ბუნების მრავალფეროვნებასაც აფიქსირებდა.",
      ru: "Рейнджер Боржомско-Харагаульского национального парка и фотограф дикой природы. Годами работал на охраняемой территории, совмещая охрану природы с фиксацией разнообразия дикой природы Грузии.",
      tr: "Borjomi-Kharagauli Millî Parkı bekçisi ve yaban hayatı fotoğrafçısı. Yıllardır korunan alanda çalışmış; doğa koruma işinin yanında Gürcistan’ın yaban hayatı çeşitliliğini de belgelemiştir.",
    },
    id: "zauri-khachidze",
    jobTitle: "ranger",
    links: {
      facebook: "https://www.facebook.com/zauri.xachidze/",
    },
    name: {
      en: "Zauri Khachidze",
      ka: "ზაური ხაჩიძე",
      ru: "Заури Хачидзе",
      tr: "Zauri Khachidze",
    },
    portraitClass: "object-[50%_32%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/zauri-khachidze.jpg",
    published: true,
    role: "ranger",
    slug: "zauri-khachidze",
  },
  {
    affiliations: ["ilia-state-university"],
    aliases: ["Ioane Rostiashvili", "იოანე როსტიაშვილი"],
    bio: {
      en: "Ioane Rostiashvili is a young researcher and a student at Ilia State University. He works as an amateur herpetologist (studying reptiles), an entomologist, and a wildlife photographer.",
      ka: "იოანე როსტიაშვილი ახალგაზრდა მკვლევარია — ილიას სახელმწიფო უნივერსიტეტის სტუდენტი. საქმიანობს როგორც მოყვარული ჰერპეტოლოგი (ქვეწარმავლების მკვლევარი), ენტომოლოგი და ველური ბუნების ფოტოგრაფი.",
      ru: "Иоане Ростиашвили — молодой исследователь, студент Государственного университета Ильи. Занимается любительской герпетологией (изучение пресмыкающихся), энтомологией и фотографией дикой природы.",
      tr: "Ioane Rostiashvili genç bir araştırmacıdır — Ilia Devlet Üniversitesi öğrencisi. Amatör herpetolog (sürüngen araştırmacısı), entomolog ve yaban hayatı fotoğrafçısı olarak çalışır.",
    },
    id: "ioane-rostiashvili",
    links: {
      facebook: "https://www.facebook.com/ioane.rost.iashvili.2025/",
      instagram: "https://www.instagram.com/ioane_rostiashvili/",
    },
    name: {
      en: "Ioane Rostiashvili",
      ka: "იოანე როსტიაშვილი",
      ru: "Иоане Ростиашвили",
      tr: "Ioane Rostiashvili",
    },
    portraitClass: "object-[50%_24%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/ioane-rostiashvili.jpg",
    published: true,
    role: "herpetologist",
    slug: "ioane-rostiashvili",
  },
  {
    affiliations: ["ilia-state-university"],
    aliases: ["Giorgi Iankoshvili", "გიორგი იანქოშვილი"],
    bio: {
      en: "Giorgi Iankoshvili is a Georgian researcher-ecologist and herpetologist. He is currently a researcher at the Institute of Ecology at Ilia State University and a doctoral student at the same university.",
      ka: "გიორგი იანქოშვილი არის ქართველი მკვლევარი-ეკოლოგი და ჰერპეტოლოგი. ამჟამად ილიას სახელმწიფო უნივერსიტეტის ეკოლოგიის ინსტიტუტის მკვლევარია და ამავე უნივერსიტეტის დოქტორანტი.",
      ru: "Гиорги Ианкошвили — грузинский исследователь-эколог и герпетолог. Сейчас он исследователь Института экологии Государственного университета Ильи и докторант того же университета.",
      tr: "Giorgi Iankoshvili Gürcü araştırmacı-ekolog ve herpetologdur. Şu anda Ilia Devlet Üniversitesi Ekoloji Enstitüsü’nde araştırmacı ve aynı üniversitede doktora öğrencisidir.",
    },
    id: "giorgi-iankoshvili",
    jobTitle: "researcher",
    links: {
      facebook: "https://www.facebook.com/giorgi.iankoshvili/",
    },
    name: {
      en: "Giorgi Iankoshvili",
      ka: "გიორგი იანქოშვილი",
      ru: "Гиорги Ианкошвили",
      tr: "Giorgi Iankoshvili",
    },
    portraitClass: "object-[50%_22%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/giorgi-iankoshvili.jpg",
    published: true,
    role: "herpetologist",
    slug: "giorgi-iankoshvili",
  },
  {
    aliases: ["Zakro Songulashvili", "ზაქრო სონღულაშვილი"],
    bio: {
      en: "Zakro Songulashvili is a Georgian researcher, naturalist, and photographer who is actively engaged in studying and documenting biodiversity in Georgia, especially herpetofauna (amphibians/reptiles) and arthropods.",
      ka: "ზაქრო სონღულაშვილი არის ქართველი მკვლევარი, ნატურალისტი და ფოტოგრაფი, რომელიც აქტიურად არის დაკავებული საქართველოში ბიომრავალფეროვნების, განსაკუთრებით კი ჰერპეტოფაუნის (ამფიბიებისა და ქვეწარმავლების) და ფეხსახსრიანების შესწავლითა და დოკუმენტირებით.",
      ru: "Закро Сонгулашвили — грузинский исследователь, натуралист и фотограф, который активно занимается изучением и документированием биоразнообразия Грузии, особенно герпетофауны (амфибии/рептилии) и членистоногих.",
      tr: "Zakro Songulashvili Gürcü araştırmacı, natüralist ve fotoğrafçıdır; Gürcistan’da biyoçeşitliliği, özellikle herpetofaunayı (amfibiler/sürüngenler) ve eklembacaklıları incelemek ve belgelemekle aktif olarak uğraşır.",
    },
    id: "zakro-songulashvili",
    metaDescription: {
      en: "Zakro Songulashvili is a Georgian researcher, naturalist, and photographer who studies and documents Georgia’s herpetofauna and arthropods.",
      ru: "Закро Сонгулашвили — грузинский исследователь, натуралист и фотограф, изучающий и документирующий герпетофауну и членистоногих Грузии.",
      tr: "Zakro Songulashvili, Gürcistan’ın herpetofaunasını ve eklembacaklılarını inceleyip belgeleyen Gürcü araştırmacı, natüralist ve fotoğrafçıdır.",
    },
    name: {
      en: "Zakro Songulashvili",
      ka: "ზაქრო სონღულაშვილი",
      ru: "Закро Сонгулашвили",
      tr: "Zakro Songulashvili",
    },
    portraitClass: "object-[50%_14%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/zakro-songulashvili.jpg",
    published: true,
    role: "herpetologist",
    slug: "zakro-songulashvili",
  },
  {
    aliases: ["Nika Melikishvili", "ნიკა მელიქიშვილი"],
    bio: {
      en: "Nika Melikishvili is a nature photographer and an active nature conservationist whose work depicts Georgia’s wildlife.",
      ka: "ნიკა მელიქიშვილი ბუნების ფოტოგრაფი და აქტიური ბუნების დამცველია, რომლის ნამუშევრები საქართველოს ველურ ბუნებას ასახავს.",
      ru: "Ника Меликишвили — фотограф природы и активный защитник природы, чьи работы отражают дикую природу Грузии.",
      tr: "Nika Melikishvili, çalışmaları Gürcistan’ın yaban hayatını yansıtan bir doğa fotoğrafçısı ve aktif doğa koruyucusudur.",
    },
    id: "nika-melikishvili",
    links: {
      facebook: "https://www.facebook.com/nika.melikishvili",
    },
    name: {
      en: "Nika Melikishvili",
      ka: "ნიკა მელიქიშვილი",
      ru: "Ника Меликишвили",
      tr: "Nika Melikishvili",
    },
    portraitClass: "object-[32%_42%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/nika-melikishvili.jpg",
    published: true,
    role: "photographer",
    slug: "nika-melikishvili",
  },
  {
    aliases: ["Nika Kerdikoshvili", "ნიკა კერდიკოშვილი", "ნიკა ქერდიკოშვილი"],
    bio: {
      en: "Nika Kerdikoshvili is a Georgian zoologist, wildlife photographer, and experienced guide specializing in birdwatching and ecotours in Georgia. He has a background in biology, knows Georgia’s most remote corners well, and actively collaborates with various environmental and documentary film production organizations.",
      ka: "ნიკა კერდიკოშვილი არის ქართველი ზოოლოგი, ველური ბუნების ფოტოგრაფი და გამოცდილი გიდი, რომელიც სპეციალიზებულია ბერდვოჩინგსა (ფრინველებზე დაკვირვება) და ეკოტურებზე საქართველოში. მას აქვს ბიოლოგიური განათლება, კარგად იცნობს საქართველოს ყველაზე შორეულ კუთხეებს და აქტიურად თანამშრომლობს სხვადასხვა გარემოსდაცვით და დოკუმენტური ფილმების მწარმოებელ ორგანიზაციებთან.",
      ru: "Ника Кердикошвили — грузинский зоолог, фотограф дикой природы и опытный гид, специализирующийся на бердвотчинге и экотурах в Грузии. У него биологическое образование, он хорошо знает самые отдалённые уголки Грузии и активно сотрудничает с различными природоохранными организациями и производителями документальных фильмов.",
      tr: "Nika Kerdikoshvili, Gürcistan’da kuş gözlemciliği ve ekoturlar konusunda uzmanlaşmış Gürcü zoolog, yaban hayatı fotoğrafçısı ve deneyimli bir rehberdir. Biyoloji eğitimi vardır, Gürcistan’ın en uzak köşelerini iyi tanır ve çeşitli çevre koruma ve belgesel film yapım kuruluşlarıyla aktif olarak çalışır.",
    },
    id: "nika-kerdikoshvili",
    links: {
      facebook: "https://www.facebook.com/nika.kerdikoshvili.9",
    },
    name: {
      en: "Nika Kerdikoshvili",
      ka: "ნიკა კერდიკოშვილი",
      ru: "Ника Кердикошвили",
      tr: "Nika Kerdikoshvili",
    },
    portraitClass: "object-[50%_52%]",
    portraitSrc:
      "https://cdn.reptiles.ge/optimized/images/authors/nika-kerdikoshvili-480.webp",
    published: true,
    role: "photographer",
    slug: "nika-kerdikoshvili",
  },
  {
    affiliations: ["ilia-state-university"],
    aliases: ["Saba Todua", "საბა თოდუა"],
    bio: {
      en: "Saba Todua is an ecology student at Ilia State University and an amateur herpetologist.",
      ka: "საბა თოდუა ილიას სახელმწიფო უნივერსიტეტის ეკოლოგიის სტუდენტი და მოყვარული ჰერპეტოლოგია.",
      ru: "Саба Тодуа — студент-эколог Государственного университета Ильи и любитель-герпетолог.",
      tr: "Saba Todua, Ilia Devlet Üniversitesi’nde ekoloji öğrencisi ve amatör herpetologdur.",
    },
    id: "saba-todua",
    links: {
      facebook: "https://www.facebook.com/todua.saba.54438",
    },
    name: {
      en: "Saba Todua",
      ka: "საბა თოდუა",
      ru: "Саба Тодуа",
      tr: "Saba Todua",
    },
    portraitClass: "object-[50%_28%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/saba-todua.jpg",
    published: true,
    role: "herpetologist",
    slug: "saba-todua",
  },
  {
    affiliations: ["ilia-state-university"],
    aliases: ["Armen Seropian", "არმენ სეროფიანი"],
    bio: {
      en: "Armen Seropian is a Georgian researcher, entomologist and arachnologist (spider specialist) who works at the Institute of Ecology at Ilia State University.",
      ka: "არმენ სეროფიანი არის ქართველი მკვლევარი, ენტომოლოგი და არაქნოლოგი (ობობების სპეციალისტი), რომელიც მოღვაწეობს ილიას სახელმწიფო უნივერსიტეტის ეკოლოგიის ინსტიტუტში.",
      ru: "Армен Серопиан — грузинский исследователь, энтомолог и арахнолог (специалист по паукам), работающий в Институте экологии Государственного университета Ильи.",
      tr: "Armen Seropian, Ilia Devlet Üniversitesi Ekoloji Enstitüsü’nde çalışan Gürcü araştırmacı, entomolog ve araknologdur (örümcek uzmanı).",
    },
    id: "armen-seropian",
    jobTitle: "researcher",
    links: {
      facebook: "https://www.facebook.com/armen.seropian",
    },
    name: {
      en: "Armen Seropian",
      ka: "არმენ სეროფიანი",
      ru: "Армен Серопиан",
      tr: "Armen Seropian",
    },
    portraitClass: "object-[50%_28%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/armen-seropian.jpg",
    published: true,
    role: "researcher",
    slug: "armen-seropian",
  },
  {
    aliases: ["Shota Zandukeli", "შოთა ზანდუკელი"],
    bio: {
      en: "Shota Zandukeli is a well-known Georgian herpetologist (reptile specialist) who actively works with the media and shares public guidance on living safely alongside reptiles.",
      ka: "შოთა ზანდუკელი არის ცნობილი ქართველი ჰერპეტოლოგი (ქვეწარმავლების სპეციალისტი), რომელიც აქტიურად თანამშრომლობს მედიასთან და საზოგადოებას ქვეწარმავლებთან უსაფრთხო თანაარსებობის შესახებ საინფორმაციო რეკომენდაციებს აწვდის.",
      ru: "Шота Зандукели — известный грузинский герпетолог (специалист по пресмыкающимся), который активно сотрудничает со СМИ и даёт обществу информационные рекомендации о безопасном сосуществовании с рептилиями.",
      tr: "Shota Zandukeli, medyayla aktif çalışan ve topluma sürüngenlerle güvenli birlikte yaşama hakkında bilgilendirici öneriler sunan tanınmış bir Gürcü herpetologdur (sürüngen uzmanı).",
    },
    id: "shota-zandukeli",
    links: {
      facebook: "https://www.facebook.com/sh.zandukeli",
    },
    metaDescription: {
      en: "Shota Zandukeli is a well-known Georgian herpetologist who works with the media on living safely alongside reptiles.",
      ru: "Шота Зандукели — известный грузинский герпетолог, который сотрудничает со СМИ и рассказывает о безопасном сосуществовании с рептилиями.",
      tr: "Shota Zandukeli, medyayla çalışan ve sürüngenlerle güvenli birlikte yaşama konusunda bilgi veren tanınmış bir Gürcü herpetologdur.",
    },
    name: {
      en: "Shota Zandukeli",
      ka: "შოთა ზანდუკელი",
      ru: "Шота Зандукели",
      tr: "Shota Zandukeli",
    },
    portraitClass: "object-[72%_22%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/shota-zandukeli.jpg",
    published: true,
    role: "herpetologist",
    slug: "shota-zandukeli",
  },
  {
    aliases: ["Close to wildlife", "ველურ ბუნებასთან ახლოს"],
    bio: {
      en: "A wildlife photography page. Its photographs are used on species profiles in this atlas.",
      ka: "ველური ბუნების ფოტოგრაფიის გვერდი. მისი ფოტოები ამ ატლასის სახეობების პროფილებზეა გამოყენებული.",
      ru: "Страница фотографий дикой природы. Её снимки используются в профилях видов этого атласа.",
      tr: "Bir yaban hayatı fotoğrafçılığı sayfası. Fotoğrafları bu atlastaki tür profillerinde kullanılmaktadır.",
    },
    id: "velur-bunebastan-axlos",
    kind: "page",
    links: {
      facebook: "https://www.facebook.com/profile.php?id=61585670878935",
    },
    name: {
      en: "Close to wildlife",
      ka: "ველურ ბუნებასთან ახლოს",
      ru: "Близко к дикой природе",
      tr: "Close to wildlife",
    },
    portraitClass: "object-[52%_42%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/velur-bunebastan-axlos.jpg",
    published: true,
    role: "photographer",
    slug: "velur-bunebastan-axlos",
  },
  {
    affiliations: ["ilia-state-university"],
    aliases: [
      "David Tarkhnishvili",
      "Davit Tarkhnishvili",
      "დავით თარხნიშვილი",
    ],
    bio: {
      en: "David Tarkhnishvili is a well-known Georgian biologist, evolutionary ecologist, and educator who is currently a professor at Ilia State University. His research and scientific work focus mainly on the biodiversity of the Caucasus region, population genetics, and evolutionary biology.",
      ka: "დავით თარხნიშვილი არის ცნობილი ქართველი ბიოლოგი, ევოლუციური ეკოლოგი და პედაგოგი, რომელიც ამჟამად ილიას სახელმწიფო უნივერსიტეტის პროფესორია. მისი კვლევები და სამეცნიერო მოღვაწეობა ძირითადად კავკასიის რეგიონის ბიომრავალფეროვნებას, პოპულაციურ გენეტიკასა და ევოლუციურ ბიოლოგიას უკავშირდება.",
      ru: "Давид Тархнишвили — известный грузинский биолог, эволюционный эколог и педагог, профессор Государственного университета Ильи. Его исследования и научная деятельность связаны в основном с биоразнообразием Кавказского региона, популяционной генетикой и эволюционной биологией.",
      tr: "David Tarkhnishvili, şu anda Ilia Devlet Üniversitesi profesörü olan tanınmış bir Gürcü biyolog, evrimsel ekolog ve eğitimcidir. Araştırma ve bilimsel çalışmaları esas olarak Kafkasya bölgesinin biyoçeşitliliği, popülasyon genetiği ve evrimsel biyoloji ile bağlantılıdır.",
    },
    id: "david-tarkhnishvili",
    jobTitle: "professor",
    links: {
      facebook: "https://www.facebook.com/david.tarkhnishvili",
    },
    name: {
      en: "David Tarkhnishvili",
      ka: "დავით თარხნიშვილი",
      ru: "Давид Тархнишвили",
      tr: "David Tarkhnishvili",
    },
    portraitClass: "object-[50%_28%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/david-tarkhnishvili.jpg",
    published: true,
    role: "researcher",
    slug: "david-tarkhnishvili",
  },
  {
    affiliations: ["ilia-state-university", "institute-of-zoology"],
    aliases: ["Giorgi Sheklashvili", "გიორგი შეყლაშვილი", "გიორგი შეკლაშვილი"],
    bio: {
      en: "Giorgi Sheklashvili is a Georgian researcher in biology, a doctoral student at Ilia State University (ISU), and a researcher at the Institute of Zoology.",
      ka: "გიორგი შეყლაშვილი ბიოლოგიის სფეროს ქართველი მკვლევარია — ილიას სახელმწიფო უნივერსიტეტის (ISU) დოქტორანტი და ზოოლოგიის ინსტიტუტის მეცნიერ-თანამშრომელი.",
      ru: "Гиорги Шеклашвили — грузинский исследователь в области биологии, докторант Государственного университета Ильи (ISU) и научный сотрудник Института зоологии.",
      tr: "Giorgi Sheklashvili, biyoloji alanında çalışan Gürcü bir araştırmacı, Ilia Devlet Üniversitesi (ISU) doktora öğrencisi ve Zooloji Enstitüsü araştırmacısıdır.",
    },
    id: "giorgi-sheklashvili",
    jobTitle: "researcher",
    links: {
      facebook: "https://www.facebook.com/giorgi.sheylashvili.39",
      researchGate:
        "https://www.researchgate.net/profile/Giorgi-Sheklashvili-2",
    },
    name: {
      en: "Giorgi Sheklashvili",
      ka: "გიორგი შეყლაშვილი",
      ru: "Гиорги Шеклашвили",
      tr: "Giorgi Sheklashvili",
    },
    portraitClass: "object-[36%_38%]",
    portraitSrc:
      "https://cdn.reptiles.ge/images/authors/giorgi-sheklashvili.jpg",
    published: true,
    role: "researcher",
    slug: "giorgi-sheklashvili",
  },
  {
    aliases: ["Giorgi Natsvlishvili", "გიორგი ნაცვლიშვილი"],
    bio: {
      en: "Giorgi Natsvlishvili is a nature guide and photographer with a deep interest in Georgia’s wildlife and biodiversity. Since 2017 he has professionally led nature-focused tours across different regions of Georgia. Through photography, Giorgi has spent years documenting Georgia’s fauna and natural environment. His work has appeared in scientific publications and in a field guide to Georgia’s wildlife. He is especially interested in species conservation, raising awareness about nature, and better understanding Georgia’s biodiversity.",
      ka: "გიორგი ნაცვლიშვილი — ბუნების გიდი და ფოტოგრაფი, რომელიც საქართველოს ველური ბუნებისა და ბიომრავალფეროვნების შესწავლით არის დაინტერესებული. 2017 წლიდან პროფესიონალურად უძღვება ბუნებაზე ორიენტირებულ ტურებს საქართველოს სხვადასხვა რეგიონში. ფოტოგრაფიის საშუალებით გიორგი წლების განმავლობაში აფიქსირებს საქართველოს ფაუნასა და ბუნებრივ გარემოს. მისი ნამუშევრები გამოქვეყნებულია სამეცნიერო ნაშრომებსა და საქართველოს ველური ბუნების გზამკვლევში. განსაკუთრებით დაინტერესებულია სახეობების კონსერვაციით, ბუნების შესახებ ცნობიერების ამაღლებითა და საქართველოს ბიომრავალფეროვნების უკეთ შესწავლით.",
      ru: "Гиорги Нацвлишвили — природный гид и фотограф, интересующийся изучением дикой природы и биоразнообразия Грузии. С 2017 года профессионально проводит природные туры в разных регионах Грузии. С помощью фотографии Гиорги годами фиксирует фауну и природную среду Грузии. Его работы опубликованы в научных трудах и в путеводителе по дикой природе Грузии. Особенно интересуется сохранением видов, повышением осведомлённости о природе и более глубоким изучением биоразнообразия Грузии.",
      tr: "Giorgi Natsvlishvili, Gürcistan’ın yaban hayatı ve biyoçeşitliliğini incelemeye ilgi duyan bir doğa rehberi ve fotoğrafçıdır. 2017’den beri Gürcistan’ın farklı bölgelerinde doğa odaklı turlara profesyonel olarak rehberlik etmektedir. Giorgi, fotoğrafçılık aracılığıyla yıllardır Gürcistan’ın faunasını ve doğal çevresini belgelemektedir. Çalışmaları bilimsel yayınlarda ve Gürcistan yaban hayatı rehberinde yer almıştır. Özellikle tür koruma, doğa farkındalığını artırma ve Gürcistan’ın biyoçeşitliliğini daha iyi tanıma konularıyla ilgilenmektedir.",
    },
    id: "giorgi-natsvlishvili",
    links: {
      facebook: "https://www.facebook.com/giorgi.natsvlishvili.308",
    },
    name: {
      en: "Giorgi Natsvlishvili",
      ka: "გიორგი ნაცვლიშვილი",
      ru: "Гиорги Нацвлишвили",
      tr: "Giorgi Natsvlishvili",
    },
    portraitClass: "object-[50%_40%]",
    portraitSrc:
      "https://cdn.reptiles.ge/optimized/images/authors/giorgi-natsvlishvili-480.webp",
    published: true,
    role: "photographer",
    slug: "giorgi-natsvlishvili",
  },
  {
    affiliations: ["connecticut-college"],
    aliases: ["Lasha Gogodze", "ლაშა გოგოძე"],
    bio: {
      en: "Lasha Gogodze is a graduate of the Georgian-American High School who took part in the iFest international conference in Tunisia and currently studies Biochemistry and Molecular Biology at Connecticut College in the United States.",
      ka: "ლაშა გოგოძე ქართულ-ამერიკული უმაღლესი სკოლის კურსდამთავრებულია. მონაწილეობდა ტუნისში გამართულ iFest საერთაშორისო კონფერენციაზე და ამჟამად სწავლობს აშშ-ში, Connecticut College-ში, ბიოქიმიისა და მოლეკულური ბიოლოგიის მიმართულებით.",
      ru: "Лаша Гогодзе — выпускник грузино-американской средней школы, участвовал в международной конференции iFest в Тунисе и сейчас изучает биохимию и молекулярную биологию в Connecticut College в США.",
      tr: "Lasha Gogodze, Gürcü-Amerikan Lisesi mezunudur; Tunus’taki iFest uluslararası konferansına katılmış ve şu anda ABD’de Connecticut College’da biyokimya ve moleküler biyoloji okumaktadır.",
    },
    id: "lasha-gogodze",
    links: {
      facebook: "https://www.facebook.com/lasha.gogodze.2025",
    },
    metaDescription: {
      en: "Lasha Gogodze is a graduate of the Georgian-American High School who studies Biochemistry and Molecular Biology at Connecticut College in the US.",
      ru: "Лаша Гогодзе — выпускник грузино-американской средней школы, изучает биохимию и молекулярную биологию в Connecticut College в США.",
      tr: "Lasha Gogodze, Gürcü-Amerikan Lisesi mezunudur ve ABD’de Connecticut College’da biyokimya ile moleküler biyoloji okumaktadır.",
    },
    name: {
      en: "Lasha Gogodze",
      ka: "ლაშა გოგოძე",
      ru: "Лаша Гогодзе",
      tr: "Lasha Gogodze",
    },
    portraitClass: "object-[48%_12%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/lasha-gogodze.jpg",
    published: true,
    role: "researcher",
    slug: "lasha-gogodze",
  },
  {
    affiliations: ["georgian-society-of-nature-friends", "naturehistorium"],
    aliases: [
      "Kakhaber Sukhitashvili",
      "კახაბერ სუხიტაშვილი",
      "კახაბერ სუხითაშვილი",
    ],
    bio: {
      en: "Kakhaber Sukhitashvili is a Georgian ecologist, botanist, and environmentalist. He has been active in environmental work for more than 25 years. He is currently a representative of NatureHistorium and the director of the Georgian Society of Nature Friends.",
      ka: "კახაბერ სუხიტაშვილი არის ქართველი ეკოლოგი, ბოტანიკოსი და გარემოსდამცველი. იგი უკვე 25 წელზე მეტია აქტიურად მოღვაწეობს გარემოსდაცვით სფეროში. ამჟამად ის არის NatureHistorium-ის წარმომადგენელი და ორგანიზაციის „საქართველოს ბუნების მეგობრები“ (Georgian Society of Nature Friends) დირექტორი.",
      ru: "Кахабер Сухиташвили — грузинский эколог, ботаник и защитник природы. Он активно работает в природоохранной сфере более 25 лет. В настоящее время он является представителем NatureHistorium и директором Georgian Society of Nature Friends.",
      tr: "Kakhaber Sukhitashvili Gürcü bir ekolog, botanikçi ve çevre korumacıdır. 25 yılı aşkın süredir çevre alanında aktif olarak çalışmaktadır. Şu anda NatureHistorium temsilcisi ve Georgian Society of Nature Friends direktörüdür.",
    },
    id: "kakhaber-sukhitashvili",
    jobTitle: "director",
    links: {
      facebook: "https://www.facebook.com/kakha.sukhitashvili",
    },
    name: {
      en: "Kakhaber Sukhitashvili",
      ka: "კახაბერ სუხიტაშვილი",
      ru: "Кахабер Сухиташвили",
      tr: "Kakhaber Sukhitashvili",
    },
    portraitClass: "object-[50%_38%]",
    portraitSrc:
      "https://cdn.reptiles.ge/optimized/images/authors/kakhaber-sukhitashvili-480.webp",
    published: true,
    role: "researcher",
    slug: "kakhaber-sukhitashvili",
  },
];

const bySlug = new Map(CREDIT_AUTHORS.map((author) => [author.slug, author]));
const byAlias = new Map<string, CreditAuthor>();
for (const author of CREDIT_AUTHORS) {
  for (const alias of author.aliases) {
    byAlias.set(alias, author);
  }
}

export const CREDIT_AFFILIATIONS: Record<
  CreditAffiliationId,
  { en: string; ka: string; ru: string; tr: string }
> = {
  "borjomi-kharagauli-national-park": {
    en: "Borjomi-Kharagauli National Park",
    ka: "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    ru: "Боржомско-Харагаульский национальный парк",
    tr: "Borjomi-Kharagauli Millî Parkı",
  },
  "connecticut-college": {
    en: "Connecticut College",
    ka: "Connecticut College",
    ru: "Connecticut College",
    tr: "Connecticut College",
  },
  "georgian-society-of-nature-friends": {
    en: "Georgian Society of Nature Friends",
    ka: "საქართველოს ბუნების მეგობრები",
    ru: "Georgian Society of Nature Friends",
    tr: "Georgian Society of Nature Friends",
  },
  "ilia-state-university": {
    en: "Ilia State University",
    ka: "ილიას სახელმწიფო უნივერსიტეტი",
    ru: "Государственный университет Ильи",
    tr: "Ilia Devlet Üniversitesi",
  },
  "institute-of-zoology": {
    en: "Institute of Zoology",
    ka: "ზოოლოგიის ინსტიტუტი",
    ru: "Институт зоологии",
    tr: "Zooloji Enstitüsü",
  },
  naturehistorium: {
    en: "NatureHistorium",
    ka: "NatureHistorium",
    ru: "NatureHistorium",
    tr: "NatureHistorium",
  },
};

export function creditAuthorAffiliationNames(
  author: CreditAuthor,
  locale: AppLocale,
) {
  return (author.affiliations ?? []).map((id) =>
    pickLocalized(CREDIT_AFFILIATIONS[id], locale),
  );
}

export function creditAuthorBio(author: CreditAuthor, locale: AppLocale) {
  if (!author.bio) return undefined;
  return pickLocalized(author.bio, locale);
}

export function creditAuthorHref(slug: string) {
  return {
    params: { slug },
    pathname: "/authors/[slug]" as const,
  };
}

export function creditAuthorIndexHref() {
  return "/authors" as const;
}

export function creditAuthorKind(author: CreditAuthor): CreditAuthorKind {
  return author.kind ?? "person";
}

export function creditAuthorName(author: CreditAuthor, locale: AppLocale) {
  return pickLocalized(author.name, locale);
}

export function creditAuthorSameAs(author: CreditAuthor) {
  return [
    author.links?.facebook,
    author.links?.instagram,
    author.links?.researchGate,
  ].filter((href): href is string => Boolean(href));
}

export function getCreditAuthorByName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return byAlias.get(trimmed);
}

export function getPublishedCreditAuthorByName(name: string) {
  const author = getCreditAuthorByName(name);
  return author?.published ? author : undefined;
}

export function getPublishedCreditAuthorBySlug(slug: string) {
  const author = getCreditAuthorBySlug(slug);
  return author?.published ? author : undefined;
}

export function getPublishedCreditAuthors() {
  return CREDIT_AUTHORS.filter((author) => author.published);
}

function getCreditAuthorBySlug(slug: string) {
  return bySlug.get(slug);
}
