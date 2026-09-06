import type { AppLocale } from "@/i18n/routing";

import { pickLocalized } from "@/i18n/localeMeta";

export type CreditAuthor = {
  aliases: string[];
  bio?: {
    en: string;
    ka: string;
    ru?: string;
    tr?: string;
  };
  id: string;
  links?: {
    facebook?: string;
    instagram?: string;
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

export type CreditAuthorRole = "herpetologist" | "ranger";

export const CREDIT_AUTHORS: CreditAuthor[] = [
  {
    aliases: [
      "Alexandre Khakhva",
      "Sandro Khakhva",
      "ალექსანდრე ხახვა",
      "სანდრო ხახვა",
    ],
    bio: {
      en: "Sandro (Alexandre) Khakhva is a young Georgian researcher from Adjara. He studies reptiles and works with them.",
      ka: "სანდრო (ალექსანდრე) ხახვა ახალგაზრდა ქართველი მკვლევარია აჭარიდან — ქვეწარმავლების მკვლევარი და მომთვინიერებელი.",
      ru: "Сандро (Александр) Хахва — молодой грузинский исследователь из Аджарии. Изучает рептилий и работает с ними.",
      tr: "Sandro (Alexandre) Khakhva, Acara’dan genç bir Gürcü araştırmacıdır. Sürüngenleri inceler ve onlarla çalışır.",
    },
    id: "sandro-khakhva",
    links: {
      facebook: "https://www.facebook.com/sandro.khakhva.9",
      instagram: "https://www.instagram.com/wildtrail.geo",
    },
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
    aliases: ["Zauri Khachidze", "ზაური ხაჩიძე"],
    bio: {
      en: "Ranger at Borjomi-Kharagauli National Park and wildlife photographer. For years he has worked in the protected area, combining nature protection with documenting the diversity of Georgia’s wildlife.",
      ka: "ბორჯომ-ხარაგაულის ეროვნული პარკის რეინჯერი და ველური ბუნების ფოტოგრაფი. იგი წლების განმავლობაში მუშაობდა დაცულ ტერიტორიაზე, სადაც ბუნების დაცვის საქმიანობასთან ერთად საქართველოს ველური ბუნების მრავალფეროვნებასაც აფიქსირებდა.",
      ru: "Рейнджер Боржомско-Харагаульского национального парка и фотограф дикой природы. Годами работал на охраняемой территории, совмещая охрану природы с фиксацией разнообразия дикой природы Грузии.",
      tr: "Borjomi-Kharagauli Millî Parkı bekçisi ve yaban hayatı fotoğrafçısı. Yıllardır korunan alanda çalışmış; doğa koruma işinin yanında Gürcistan’ın yaban hayatı çeşitliliğini de belgelemiştir.",
    },
    id: "zauri-khachidze",
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
    aliases: ["Giorgi Iankoshvili", "გიორგი იანქოშვილი"],
    bio: {
      en: "Giorgi Iankoshvili is a Georgian researcher-ecologist and herpetologist. He is currently a researcher at the Institute of Ecology at Ilia State University and a doctoral student at the same university.",
      ka: "გიორგი იანქოშვილი ქართველი მკვლევარი-ეკოლოგი და ჰერპეტოლოგია. ამჟამად ილიას სახელმწიფო უნივერსიტეტის ეკოლოგიის ინსტიტუტის მკვლევარია და ამავე უნივერსიტეტის დოქტორანტი.",
      ru: "Гиорги Ианкошвили — грузинский исследователь-эколог и герпетолог. Сейчас он исследователь Института экологии Государственного университета Ильи и докторант того же университета.",
      tr: "Giorgi Iankoshvili Gürcü araştırmacı-ekolog ve herpetologdur. Şu anda Ilia Devlet Üniversitesi Ekoloji Enstitüsü’nde araştırmacı ve aynı üniversitede doktora öğrencisidir.",
    },
    id: "giorgi-iankoshvili",
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
    aliases: ["Zakro Songulashvili", "ზაქრო სონგულაშვილი"],
    bio: {
      en: "Zakro Songulashvili is a Georgian researcher, naturalist, and photographer who is actively engaged in studying and documenting biodiversity in Georgia, especially herpetofauna (amphibians/reptiles) and arthropods.",
      ka: "ზაქრო სონგულაშვილი არის ქართველი მკვლევარი, ნატურალისტი და ფოტოგრაფი, რომელიც აქტიურად არის დაკავებული საქართველოში ბიომრავალფეროვნების, განსაკუთრებით კი ქვეწარმავლებისა (ამფიბიები/რეპტილიები) და ფეხსახსრიანების შესწავლითა და დოკუმენტირებით.",
      ru: "Закро Сонгулашвили — грузинский исследователь, натуралист и фотограф, который активно занимается изучением и документированием биоразнообразия Грузии, особенно герпетофауны (амфибии/рептилии) и членистоногих.",
      tr: "Zakro Songulashvili Gürcü araştırmacı, natüralist ve fotoğrafçıdır; Gürcistan’da biyoçeşitliliği, özellikle herpetofaunayı (amfibiler/sürüngenler) ve eklembacaklıları incelemek ve belgelemekle aktif olarak uğraşır.",
    },
    id: "zakro-songulashvili",
    name: {
      en: "Zakro Songulashvili",
      ka: "ზაქრო სონგულაშვილი",
      ru: "Закро Сонгулашвили",
      tr: "Zakro Songulashvili",
    },
    portraitClass: "object-[50%_14%]",
    portraitSrc: "https://cdn.reptiles.ge/authors/zakro-songulashvili.jpg",
    published: true,
    role: "herpetologist",
    slug: "zakro-songulashvili",
  },
];

const bySlug = new Map(CREDIT_AUTHORS.map((author) => [author.slug, author]));
const byAlias = new Map<string, CreditAuthor>();
for (const author of CREDIT_AUTHORS) {
  for (const alias of author.aliases) {
    byAlias.set(alias, author);
  }
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

export function creditAuthorName(author: CreditAuthor, locale: AppLocale) {
  return pickLocalized(author.name, locale);
}

export function creditAuthorSameAs(author: CreditAuthor) {
  return [author.links?.facebook, author.links?.instagram].filter(
    (href): href is string => Boolean(href),
  );
}

export function getCreditAuthorByName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return byAlias.get(trimmed);
}

export function getCreditAuthorBySlug(slug: string) {
  return bySlug.get(slug);
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

export function hasPublishedCreditAuthorPage(photographer?: string) {
  if (!photographer) return false;
  return Boolean(getPublishedCreditAuthorByName(photographer));
}
