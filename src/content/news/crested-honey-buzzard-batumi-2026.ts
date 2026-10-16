import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const SOURCE_URL =
  "https://www.batumiraptorcount.org/news/2026/9/crested-honey-buzzards";

const PHOTO_MALE_OVERHEAD: NewsPhoto = {
  alt: {
    en: "A male Crested Honey Buzzard from below, passing overhead at Batumi.",
    ka: "ქოჩორა ბოლოკარკაზის მამალი ქვემოდან, ბათუმის თავზე გადაფრენისას.",
    ru: "Самец хохлатого осоеда снизу, пролетающий над Батуми.",
    tr: "Batumi üzerinden geçen erkek tepeli arı şahini, aşağıdan.",
  },
  credit: {
    photographer: "Valentin Cordes",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-crested-honey-buzzard-cordes-male.jpg",
};

const PHOTO_COMPARISON: NewsPhoto = {
  alt: {
    en: "A Crested Honey Buzzard and a European Honey Buzzard in the same frame at Batumi.",
    ka: "ქოჩორა ბოლოკარკაზი და ბოლოკარკაზი ერთ კადრში, ბათუმი.",
    ru: "Хохлатый и обыкновенный осоеды в одном кадре, Батуми.",
    tr: "Batumi’de aynı karede tepeli arı şahini ve arı şahini.",
  },
  credit: {
    photographer: "Thijmen Stolk",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-crested-honey-buzzard-stolk-comparison.jpg",
};

const PHOTO_DARK_MALE: NewsPhoto = {
  alt: {
    en: "A dark male Crested Honey Buzzard in flight against the sky.",
    ka: "ქოჩორა ბოლოკარკაზის მუქი მამალი ფრენისას.",
    ru: "Тёмный самец хохлатого осоеда в полёте.",
    tr: "Uçan koyu renkli erkek tepeli arı şahini.",
  },
  credit: {
    photographer: "Thijmen Stolk",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-crested-honey-buzzard-stolk-dark-male.jpg",
};

const PHOTO_FEMALE: NewsPhoto = {
  alt: {
    en: "A female Crested Honey Buzzard in flight at Batumi.",
    ka: "ქოჩორა ბოლოკარკაზის დედალი ფრენისას, ბათუმი.",
    ru: "Самка хохлатого осоеда в полёте, Батуми.",
    tr: "Batumi’de uçan dişi tepeli arı şahini.",
  },
  credit: {
    photographer: "Thijmen Stolk",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-crested-honey-buzzard-stolk-female.jpg",
};

const FIGURE_COMPARISON = {
  src: PHOTO_COMPARISON.src,
  type: "figure" as const,
};
const FIGURE_DARK_MALE = { src: PHOTO_DARK_MALE.src, type: "figure" as const };
const FIGURE_FEMALE = { src: PHOTO_FEMALE.src, type: "figure" as const };

export const CRESTED_HONEY_BUZZARD_BATUMI_2026: NewsArticle = {
  copy: {
    en: {
      dek: "Batumi Raptor Count has counted 54 Crested Honey Buzzards this autumn — almost twice its average of 28. Batumi is the only place in the Western Palearctic where this Asian raptor is reliably seen on migration.",
      lead: "By 20 September 2026, Batumi Raptor Count had counted 54 Crested Honey Buzzards in the Batumi bottleneck this autumn. Its average for the species is 28. The figures come from the organisation’s report — Reptiles.ge did not conduct the count.",
      metaDescription:
        "Batumi Raptor Count has counted 54 Crested Honey Buzzards (Pernis ptilorhynchus) in autumn 2026 — almost twice its average of 28 at Batumi.",
      metaTitle: "54 Crested Honey Buzzards at Batumi in 2026",
      sections: [
        {
          blocks: [
            {
              parts: [
                "In a report published on 20 September, Batumi Raptor Count wrote that 54 Crested Honey Buzzards (",
                { name: "Pernis ptilorhynchus", type: "sci" },
                ") had passed its count stations so far this season. That is almost twice its average of 28.",
              ],
              type: "p",
            },
            {
              parts: [
                "They were picked out from a much larger stream. Hundreds of thousands of ",
                {
                  id: "pernis-apivorus",
                  label: "European Honey Buzzards",
                  type: "species",
                },
                " (",
                { name: "Pernis apivorus", type: "sci" },
                ") cross the bottleneck every autumn, and the Crested Honey Buzzards fly among them.",
              ],
              type: "p",
            },
            FIGURE_COMPARISON,
          ],
          heading: "How many were counted?",
        },
        {
          blocks: [
            {
              parts: [
                "According to the report, a Crested Honey Buzzard first stands out as an unusually large bird in the flock. At first glance it can be mistaken for an eagle. A closer look shows the familiar honey buzzard shape, but with a larger hand with six “fingers” — the long, separated primary feathers at the wingtip. The plumage then confirms the identification.",
              ],
              type: "p",
            },
            FIGURE_DARK_MALE,
            {
              parts: [
                "This atlas does not yet have a separate page for the Crested Honey Buzzard. How it differs from its European relative is also covered on the ",
                {
                  id: "pernis-apivorus",
                  label: "European Honey Buzzard profile",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            FIGURE_FEMALE,
          ],
          heading: "How do you tell it apart?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count calls Batumi the only place in the Western Palearctic where Crested Honey Buzzards are reliably seen on migration. Many visiting birders and volunteers come to the count hoping to see one.",
              ],
              type: "p",
            },
            {
              parts: [
                "In ",
                { id: "adjara", label: "Adjara", type: "region" },
                ", north of Batumi, sea and mountains squeeze the autumn migration route into a narrow corridor. According to the report, these birds also show how large the area is from which migrants funnel towards the count stations. The authors ask how many of the common raptors counted at Batumi breed at least as far east. They leave that question open. More species from the corridor are on the ",
                { id: "birds", label: "birds hub", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Why Batumi?",
        },
        {
          blocks: [
            {
              parts: [
                "The figure of 54 is from 20 September. The 2026 autumn count runs until 21 October, so the season total for the species may be higher. Batumi Raptor Count’s 27 September report says a day of 54,406 birds took the season total for all raptors past one million.",
              ],
              type: "p",
            },
            {
              parts: [
                "Earlier reports from the corridor are in ",
                { label: "News", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "The season is not over",
        },
      ],
      title:
        "54 Crested Honey Buzzards at Batumi: almost twice the average",
    },
    ka: {
      dek: "Batumi Raptor Count-მა ამ შემოდგომაზე 54 ქოჩორა ბოლოკარკაზი დაითვალა — საშუალოზე, 28-ზე, თითქმის ორჯერ მეტი. ბათუმი დასავლეთ პალეარქტიკაში ერთადერთი ადგილია, სადაც ეს აზიური მტაცებელი მიგრაციისას რეგულარულად ჩანს.",
      lead: "2026 წლის 20 სექტემბრისთვის Batumi Raptor Count-მა ბათუმის ბოთლის ყელში ამ შემოდგომაზე 54 ქოჩორა ბოლოკარკაზი დაითვალა. ამ სახეობის საშუალო მაჩვენებელი ბათუმში 28-ია. ციფრები ორგანიზაციის ანგარიშიდანაა — აღრიცხვა Reptiles.ge-ს არ ჩაუტარებია.",
      metaDescription:
        "Batumi Raptor Count-მა 2026 წლის შემოდგომაზე 54 ქოჩორა ბოლოკარკაზი (Pernis ptilorhynchus) დაითვალა — ბათუმის საშუალოზე, 28-ზე, თითქმის ორჯერ მეტი.",
      metaTitle: "ბათუმში 54 ქოჩორა ბოლოკარკაზი დაითვალეს",
      sections: [
        {
          blocks: [
            {
              parts: [
                "20 სექტემბერს გამოქვეყნებულ ანგარიშში Batumi Raptor Count-მა დაწერა, რომ ამ სეზონში მის სადგურებს უკვე 54 ქოჩორა ბოლოკარკაზმა (",
                { name: "Pernis ptilorhynchus", type: "sci" },
                ") ჩაუარა. ეს ორგანიზაციის საშუალო მაჩვენებელზე, 28-ზე, თითქმის ორჯერ მეტია.",
              ],
              type: "p",
            },
            {
              parts: [
                "ეს ფრინველები გაცილებით დიდი ნაკადიდან გამოარჩიეს. ყოველ შემოდგომას ბოთლის ყელს ასობით ათასი ",
                { id: "pernis-apivorus", label: "ბოლოკარკაზი", type: "species" },
                " (",
                { name: "Pernis apivorus", type: "sci" },
                ") კვეთს, ქოჩორა ბოლოკარკაზები კი მათ შორის მიფრინავენ.",
              ],
              type: "p",
            },
            FIGURE_COMPARISON,
          ],
          heading: "რამდენი დაითვალეს?",
        },
        {
          blocks: [
            {
              parts: [
                "ანგარიშის მიხედვით, ქოჩორა ბოლოკარკაზი ჯერ ნაკადში უჩვეულოდ დიდი ფრინველით გამოირჩევა. პირველი შეხედვით ის შეიძლება არწივი გეგონოთ. უფრო დაკვირვებით ბოლოკარკაზის ნაცნობი სილუეტი ჩანს, ოღონდ უფრო დიდი, ექვსთითიანი ფრთის ბოლოთი: ფრთის წვერზე ექვსი გრძელი, ერთმანეთისგან დაშორებული ბუმბულია. საბოლოოდ სახეობას ბუმბულის ნახატი ადასტურებს.",
              ],
              type: "p",
            },
            FIGURE_DARK_MALE,
            {
              parts: [
                "ქოჩორა ბოლოკარკაზს ამ ატლასში ცალკე გვერდი ჯერ არ აქვს. რით განსხვავდება ის ევროპული ნათესავისგან, ",
                {
                  id: "pernis-apivorus",
                  label: "ბოლოკარკაზის პროფილზეც",
                  type: "species",
                },
                " წერია.",
              ],
              type: "p",
            },
            FIGURE_FEMALE,
          ],
          heading: "როგორ გამოვარჩიოთ?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count-ის მიხედვით, ბათუმი დასავლეთ პალეარქტიკაში ერთადერთი ადგილია, სადაც ქოჩორა ბოლოკარკაზი მიგრაციისას რეგულარულად ჩანს. ამიტომ ბევრი ჩამოსული ფრინველთმცოდნე და მოხალისე აღრიცხვაზე სწორედ მისი ნახვის იმედით მოდის.",
              ],
              type: "p",
            },
            {
              parts: [
                { id: "adjara", label: "აჭარაში", type: "region" },
                ", ბათუმის ჩრდილოეთით, ზღვა და მთები შემოდგომის მიგრაციის გზას ვიწრო დერეფნად კუმშავენ. ანგარიშის თანახმად, ეს ფრინველები იმასაც აჩვენებს, რა უზარმაზარი ტერიტორიიდან იყრიან თავს მიგრანტები აღრიცხვის სადგურებთან. ავტორები სვამენ კითხვას: ბათუმში დათვლილი ჩვეულებრივი მტაცებლებიდან რამდენი მრავლდება სულ მცირე ისე შორს აღმოსავლეთით, როგორც ქოჩორა ბოლოკარკაზები? პასუხი ჯერ არ არის. დერეფნის სხვა სახეობები ",
                { id: "birds", label: "ფრინველების ჰაბზეა", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რატომ ბათუმი?",
        },
        {
          blocks: [
            {
              parts: [
                "რიცხვი 54 20 სექტემბრის მდგომარეობას ასახავს. 2026 წლის შემოდგომის აღრიცხვა 21 ოქტომბრამდე გრძელდება, ამიტომ სახეობის სეზონური ჯამი შეიძლება მეტი იყოს. Batumi Raptor Count-ის 27 სექტემბრის ანგარიშის მიხედვით, 54 406-ფრინველიანმა დღემ ყველა მტაცებლის სეზონური ჯამი მილიონს გადააცილა.",
              ],
              type: "p",
            },
            {
              parts: [
                "დერეფნის წინა ანგარიშები ",
                { label: "სიახლეებშია", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "სეზონი ჯერ არ დასრულებულა",
        },
      ],
      title: "ბათუმში 54 ქოჩორა ბოლოკარკაზი: საშუალოზე თითქმის ორჯერ მეტი",
    },
    ru: {
      dek: "Batumi Raptor Count насчитал этой осенью 54 хохлатых осоеда — почти вдвое больше среднего, 28. Батуми — единственное место в Западной Палеарктике, где этот азиатский хищник регулярно встречается на пролёте.",
      lead: "К 20 сентября 2026 года Batumi Raptor Count насчитал этой осенью в батумском бутылочном горлышке 54 хохлатых осоеда. Среднее для этого вида в Батуми — 28. Цифры взяты из отчёта организации — Reptiles.ge подсчёт не вёл.",
      metaDescription:
        "Batumi Raptor Count насчитал осенью 2026 года 54 хохлатых осоеда (Pernis ptilorhynchus) — почти вдвое больше среднего для Батуми, 28.",
      metaTitle: "В Батуми насчитали 54 хохлатых осоеда",
      sections: [
        {
          blocks: [
            {
              parts: [
                "В отчёте от 20 сентября Batumi Raptor Count написал, что в этом сезоне мимо его станций уже пролетели 54 хохлатых осоеда (",
                { name: "Pernis ptilorhynchus", type: "sci" },
                "). Это почти вдвое больше среднего показателя организации — 28.",
              ],
              type: "p",
            },
            {
              parts: [
                "Этих птиц выделили из гораздо большего потока. Каждую осень бутылочное горлышко пересекают сотни тысяч ",
                {
                  id: "pernis-apivorus",
                  label: "обыкновенных осоедов",
                  type: "species",
                },
                " (",
                { name: "Pernis apivorus", type: "sci" },
                "), и хохлатые осоеды летят среди них.",
              ],
              type: "p",
            },
            FIGURE_COMPARISON,
          ],
          heading: "Сколько насчитали?",
        },
        {
          blocks: [
            {
              parts: [
                "По отчёту, хохлатый осоед сначала выделяется в потоке как необычно крупная птица. На первый взгляд его можно принять за орла. При внимательном взгляде виден знакомый силуэт осоеда, но с более крупной кистью с шестью «пальцами» — длинными, раздвинутыми маховыми перьями на конце крыла. Окончательно вид подтверждает рисунок оперения.",
              ],
              type: "p",
            },
            FIGURE_DARK_MALE,
            {
              parts: [
                "Отдельной страницы для хохлатого осоеда в атласе пока нет. Чем он отличается от европейского родственника, написано и в ",
                {
                  id: "pernis-apivorus",
                  label: "профиле обыкновенного осоеда",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            FIGURE_FEMALE,
          ],
          heading: "Как его отличить?",
        },
        {
          blocks: [
            {
              parts: [
                "По словам Batumi Raptor Count, Батуми — единственное место в Западной Палеарктике, где хохлатых осоедов регулярно видят на пролёте. Поэтому многие приезжие бёрдвотчеры и волонтёры приходят на учёт в надежде его увидеть.",
              ],
              type: "p",
            },
            {
              parts: [
                "В ",
                { id: "adjara", label: "Аджарии", type: "region" },
                ", к северу от Батуми, море и горы сжимают осенний пролётный путь в узкий коридор. По отчёту, эти птицы показывают и то, с какой огромной территории мигранты стекаются к станциям учёта. Авторы задаются вопросом: сколько обычных хищных птиц, подсчитанных в Батуми, гнездится хотя бы так же далеко на востоке, как хохлатые осоеды? Ответа пока нет. Другие виды коридора — на ",
                { id: "birds", label: "странице птиц", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Почему Батуми?",
        },
        {
          blocks: [
            {
              parts: [
                "Число 54 — на 20 сентября. Осенний учёт 2026 года продлится до 21 октября, так что сезонная сумма по виду может оказаться больше. По отчёту Batumi Raptor Count от 27 сентября, день с 54 406 птицами вывел сезонную сумму всех хищных птиц за миллион.",
              ],
              type: "p",
            },
            {
              parts: [
                "Прежние отчёты из коридора — в ",
                { label: "новостях", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Сезон ещё не закончен",
        },
      ],
      title: "54 хохлатых осоеда в Батуми: почти вдвое больше среднего",
    },
    tr: {
      dek: "Batumi Raptor Count bu sonbahar 54 tepeli arı şahini saydı — ortalama olan 28’in neredeyse iki katı. Batumi, bu Asya yırtıcısının göçte düzenli görüldüğü Batı Palearktik’teki tek yer.",
      lead: "20 Eylül 2026 itibarıyla Batumi Raptor Count, bu sonbahar Batumi darboğazında 54 tepeli arı şahini saydı. Türün Batumi’deki ortalaması 28. Sayılar örgütün raporundan — sayımı Reptiles.ge yapmadı.",
      metaDescription:
        "Batumi Raptor Count 2026 sonbaharında 54 tepeli arı şahini (Pernis ptilorhynchus) saydı — Batumi ortalaması olan 28’in neredeyse iki katı.",
      metaTitle: "Batumi’de 54 tepeli arı şahini sayıldı",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count, 20 Eylül’de yayımladığı raporda bu sezon istasyonlarının önünden şimdiye kadar 54 tepeli arı şahininin (",
                { name: "Pernis ptilorhynchus", type: "sci" },
                ") geçtiğini yazdı. Bu, örgütün ortalaması olan 28’in neredeyse iki katı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Bu kuşlar çok daha büyük bir akımın içinden ayırt edildi. Her sonbahar darboğazdan yüz binlerce ",
                { id: "pernis-apivorus", label: "arı şahini", type: "species" },
                " (",
                { name: "Pernis apivorus", type: "sci" },
                ") geçer; tepeli arı şahinleri de onların arasında uçar.",
              ],
              type: "p",
            },
            FIGURE_COMPARISON,
          ],
          heading: "Kaç tane sayıldı?",
        },
        {
          blocks: [
            {
              parts: [
                "Rapora göre tepeli arı şahini önce akım içinde alışılmadık derecede iri bir kuş olarak dikkat çeker. İlk bakışta kartal sanılabilir. Daha yakından bakınca tanıdık arı şahini silueti görünür, ama daha büyük ve altı “parmaklı” bir kanat ucuyla — kanat ucunda uzun, birbirinden ayrık altı uçuş tüyü. Türü son olarak tüy deseni doğrular.",
              ],
              type: "p",
            },
            FIGURE_DARK_MALE,
            {
              parts: [
                "Bu atlasta tepeli arı şahini için henüz ayrı bir sayfa yok. Avrupalı akrabasından nasıl ayrıldığı ",
                {
                  id: "pernis-apivorus",
                  label: "arı şahini profilinde",
                  type: "species",
                },
                " de anlatılıyor.",
              ],
              type: "p",
            },
            FIGURE_FEMALE,
          ],
          heading: "Nasıl ayırt edilir?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count’a göre Batumi, tepeli arı şahinlerinin göçte düzenli görüldüğü Batı Palearktik’teki tek yer. Bu yüzden birçok ziyaretçi kuş gözlemcisi ve gönüllü, onu görme umuduyla sayıma geliyor.",
              ],
              type: "p",
            },
            {
              parts: [
                { id: "adjara", label: "Acara’da", type: "region" },
                ", Batumi’nin kuzeyinde deniz ile dağlar sonbahar göç yolunu dar bir koridora sıkıştırır. Rapora göre bu kuşlar, göçmenlerin sayım istasyonlarına ne kadar geniş bir alandan toplandığını da gösteriyor. Yazarlar şu soruyu soruyor: Batumi’de sayılan yaygın yırtıcılardan kaçı en az tepeli arı şahinleri kadar doğuda üreyor? Henüz bir yanıt yok. Koridorun diğer türleri ",
                { id: "birds", label: "kuşlar sayfasında", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Neden Batumi?",
        },
        {
          blocks: [
            {
              parts: [
                "54 sayısı 20 Eylül tarihli. 2026 sonbahar sayımı 21 Ekim’e kadar sürüyor, bu yüzden türün sezon toplamı daha yüksek olabilir. Batumi Raptor Count’un 27 Eylül raporuna göre 54.406 kuşluk bir gün, tüm yırtıcıların sezon toplamını bir milyonun üzerine taşıdı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Koridordan önceki raporlar ",
                { label: "haberlerde", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Sezon henüz bitmedi",
        },
      ],
      title: "Batumi’de 54 tepeli arı şahini: ortalamanın neredeyse iki katı",
    },
  },
  gallery: [PHOTO_COMPARISON, PHOTO_DARK_MALE, PHOTO_FEMALE],
  id: "crested-honey-buzzard-batumi-2026",
  image: PHOTO_MALE_OVERHEAD,
  publishedAt: "2026-10-16",
  relatedHubIds: ["birds"],
  relatedRegionIds: ["adjara"],
  relatedSpeciesIds: ["pernis-apivorus"],
  slug: "crested-honey-buzzard-batumi-2026",
  sources: [
    {
      name: "Batumi Raptor Count — Crested Honey Buzzards!",
      url: SOURCE_URL,
    },
    {
      name: "Batumi Raptor Count — One million raptors counted",
      url: "https://www.batumiraptorcount.org/news/2026/9/one-million-raptors-counted",
    },
    {
      name: "Batumi Raptor Count — Call for counters, autumn 2026",
      url: "https://www.batumiraptorcount.org/news/2026/4/call-for-counters-2026",
    },
  ],
  status: "published",
};
