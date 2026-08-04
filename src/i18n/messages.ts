import type { Locale } from "@/i18n/types";

export type Messages = {
  nav: {
    species: string;
    about: string;
    atlas: string;
    discover: string;
  };
  language: {
    switch: string;
    ka: string;
    en: string;
  };
  beta: {
    text: string;
    dismiss: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewSpecies: string;
    moreAboutViper: string;
    imageAlt: string;
  };
  carousel: {
    eyebrow: string;
    title: string;
    subtitle: string;
    prev: string;
    next: string;
  };
  card: {
    dangerLevel: string;
  };
  detail: {
    eyebrow: string;
    lead: string;
    body: string;
    viewProfile: string;
    imageAlt: string;
  };
  features: {
    eyebrow: string;
    title: string;
    items: {
      photography: { title: string; description: string };
      atlas: { title: string; description: string };
      science: { title: string; description: string };
    };
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
    imageAlt: string;
  };
  footer: {
    tagline: string;
    rights: string;
    forCurious: string;
    columns: {
      discover: { title: string; links: string[] };
      science: { title: string; links: string[] };
      company: { title: string; links: string[] };
    };
  };
  profile: {
    back: string;
    overview: string;
    whoIs: string;
    biology: string;
    biologyTitle: string;
    diet: string;
    behavior: string;
    conservation: string;
    facts: string;
    factsTitle: string;
    gallery: string;
    galleryTitle: string;
    photo: string;
    close: string;
    prevPhoto: string;
    nextPhoto: string;
    faq: string;
    faqTitle: string;
    faqIntroBefore: string;
    faqIntroAfter: string;
  };
  danger: {
    Harmless: string;
    Moderate: string;
    High: string;
  };
  site: {
    title: string;
    description: string;
  };
};

export const messages: Record<Locale, Messages> = {
  ka: {
    nav: {
      species: "სახეობები",
      about: "შესახებ",
      atlas: "ატლასი",
      discover: "აღმოაჩინე",
    },
    language: {
      switch: "ენის შეცვლა",
      ka: "ქართული",
      en: "English",
    },
    beta: {
      text: "საიტი ბეტა ტესტირების რეჟიმშია",
      dismiss: "ბანერის დახურვა",
    },
    hero: {
      eyebrow: "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია",
      title: "აღმოაჩინე დედამიწის უძველესი არსებები",
      subtitle:
        "შეისწავლე ქვეწარმავლები მეცნიერებითა და ველში გადაღებული ფოტოგრაფიით.",
      viewSpecies: "სახეობების ნახვა",
      moreAboutViper: "მეტი გველგესლაზე",
      imageAlt: "გველგესლა ხავსიან კლდეზე ნისლიან მთის ხეობაში",
    },
    carousel: {
      eyebrow: "რჩეული",
      title: "სახეობები, რომლებიც უნდა იცოდე",
      subtitle:
        "საქართველოსა და კავკასიის ქვეწარმავლები — ველში გადაღებული და მეცნიერულად დამოწმებული.",
      prev: "წინა სახეობა",
      next: "შემდეგი სახეობა",
    },
    card: {
      dangerLevel: "ადამიანისთვის რისკი",
    },
    detail: {
      eyebrow: "სახეობის მიმოხილვა",
      lead: "დიდი კავკასიონის ენდემური შხამიანი გველგესლა.",
      body: "ცხოვრობს დაახლოებით 1,500–2,800 მეტრზე — ტყის ზედა ზონაში, სუბალპურ მდელოებსა და კლდოვან ადგილებში. არეალი ფრაგმენტირებულია; IUCN-ის მიხედვით სახეობა მოწყვლადია.",
      viewProfile: "სრული პროფილის ნახვა",
      imageAlt: "გველგესლის თავის მსხვილი პორტრეტი",
    },
    features: {
      eyebrow: "რატომ Reptiles",
      title: "ვაკავშირებთ ადამიანებს ქვეწარმავლების ფარულ სამყაროსთან.",
      items: {
        photography: {
          title: "საველე ფოტოგრაფია",
          description: "სახეობები გადაღებულია ბუნებრივ ჰაბიტატში.",
        },
        atlas: {
          title: "გლობალური ატლასი",
          description: "შეისწავლე ქვეწარმავლები მთელ მსოფლიოში.",
        },
        science: {
          title: "სამეცნიერო ცოდნა",
          description: "ისწავლე დამოწმებული ბიოლოგიური მონაცემებით.",
        },
      },
    },
    cta: {
      title: "აღმოაჩინე მსოფლიოს ყველაზე საინტერესო არსებები.",
      subtitle: "ათასობით სახეობა. ერთი მშვიდი და ლამაზი ადგილი მათ შესასწავლად.",
      button: "დაიწყე აღმოჩენა",
      imageAlt: "ნისლიანი კავკასიონის ქედი შებინდებისას",
    },
    footer: {
      tagline: "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია.",
      rights: "ყველა უფლება დაცულია.",
      forCurious: "ცნობისმოყვარეებისთვის.",
      columns: {
        discover: {
          title: "აღმოჩენა",
          links: ["სახეობები", "ატლასი", "კოლექციები", "საველე ჩანაწერები"],
        },
        science: {
          title: "მეცნიერება",
          links: [
            "მეთოდოლოგია",
            "კონტრიბუტორები",
            "მონაცემთა წყაროები",
            "კონსერვაცია",
          ],
        },
        company: {
          title: "კომპანია",
          links: ["შესახებ", "პრესა", "კონტაქტი", "კონფიდენციალობა"],
        },
      },
    },
    profile: {
      back: "ყველა სახეობა",
      overview: "მიმოხილვა",
      whoIs: "ვინ არის",
      biology: "ბიოლოგია",
      biologyTitle: "კვება, ქცევა და გამრავლება",
      diet: "კვება",
      behavior: "ქცევა",
      conservation: "კონსერვაცია",
      facts: "საინტერესო ფაქტები",
      factsTitle: "რა უნდა იცოდე",
      gallery: "გალერეა",
      galleryTitle: "ფოტოებში",
      photo: "ფოტო",
      close: "დახურვა",
      prevPhoto: "წინა ფოტო",
      nextPhoto: "შემდეგი ფოტო",
      faq: "კითხვები",
      faqTitle: "ხშირად დასმული კითხვები",
      faqIntroBefore: "მოკლე პასუხები ",
      faqIntroAfter: "-თან დაკავშირებულ ყველაზე მნიშვნელოვან კითხვებზე.",
    },
    danger: {
      Harmless: "უვნებელი",
      Moderate: "საშუალო რისკი",
      High: "მაღალი რისკი",
    },
    site: {
      title: "Reptiles — აღმოაჩინე დედამიწის უძველესი არსებები",
      description:
        "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია. შეისწავლე სახეობები მეცნიერებითა და ველში გადაღებული ფოტოგრაფიით.",
    },
  },
  en: {
    nav: {
      species: "Species",
      about: "About",
      atlas: "Atlas",
      discover: "Discover",
    },
    language: {
      switch: "Change language",
      ka: "ქართული",
      en: "English",
    },
    beta: {
      text: "This site is in beta testing",
      dismiss: "Dismiss banner",
    },
    hero: {
      eyebrow: "A digital encyclopedia of reptiles and amphibians",
      title: "Discover Earth's oldest living creatures",
      subtitle:
        "Explore reptiles through science and photography captured in the wild.",
      viewSpecies: "Browse species",
      moreAboutViper: "More about vipers",
      imageAlt: "A viper on a mossy rock in a misty mountain valley",
    },
    carousel: {
      eyebrow: "Featured",
      title: "Species you should know",
      subtitle:
        "Reptiles of Georgia and the Caucasus — photographed in the field and scientifically verified.",
      prev: "Previous species",
      next: "Next species",
    },
    card: {
      dangerLevel: "Risk to humans",
    },
    detail: {
      eyebrow: "Species spotlight",
      lead: "An endemic venomous viper of the Greater Caucasus.",
      body: "It lives at roughly 1,500–2,800 meters — in the upper forest zone, subalpine meadows, and rocky terrain. Its range is fragmented; IUCN lists the species as Vulnerable.",
      viewProfile: "View full profile",
      imageAlt: "Close-up portrait of a viper's head",
    },
    features: {
      eyebrow: "Why Reptiles",
      title: "Connecting people to the hidden world of reptiles.",
      items: {
        photography: {
          title: "Field photography",
          description: "Species photographed in their natural habitats.",
        },
        atlas: {
          title: "Global atlas",
          description: "Explore reptiles from around the world.",
        },
        science: {
          title: "Scientific knowledge",
          description: "Learn from verified biological data.",
        },
      },
    },
    cta: {
      title: "Discover the world's most fascinating creatures.",
      subtitle: "Thousands of species. One calm, beautiful place to learn about them.",
      button: "Start exploring",
      imageAlt: "Misty Caucasus ridge at dusk",
    },
    footer: {
      tagline: "A digital encyclopedia of reptiles and amphibians.",
      rights: "All rights reserved.",
      forCurious: "For the curious.",
      columns: {
        discover: {
          title: "Discover",
          links: ["Species", "Atlas", "Collections", "Field notes"],
        },
        science: {
          title: "Science",
          links: ["Methodology", "Contributors", "Data sources", "Conservation"],
        },
        company: {
          title: "Company",
          links: ["About", "Press", "Contact", "Privacy"],
        },
      },
    },
    profile: {
      back: "All species",
      overview: "Overview",
      whoIs: "Who is",
      biology: "Biology",
      biologyTitle: "Diet, behavior, and reproduction",
      diet: "Diet",
      behavior: "Behavior",
      conservation: "Conservation",
      facts: "Interesting facts",
      factsTitle: "What you should know",
      gallery: "Gallery",
      galleryTitle: "in photos",
      photo: "Photo",
      close: "Close",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo",
      faq: "Questions",
      faqTitle: "Frequently asked questions",
      faqIntroBefore: "Short answers to the most important questions about ",
      faqIntroAfter: ".",
    },
    danger: {
      Harmless: "Harmless",
      Moderate: "Moderate risk",
      High: "High risk",
    },
    site: {
      title: "Reptiles — Discover Earth's oldest living creatures",
      description:
        "A digital encyclopedia of reptiles and amphibians. Explore species through science and photography captured in the wild.",
    },
  },
};
