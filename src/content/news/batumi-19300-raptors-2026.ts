import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const SOURCE_URL =
  "https://www.batumiraptorcount.org/news/2026/8/first-10000-day-of-the-season/";

const PHOTO_HOEKSTRA: NewsPhoto = {
  src: "https://cdn.reptiles.ge/news-batumi-19300-hoekstra-1.jpg",
  alt: {
    ka: "აღმწერები პირველ სადგურზე კვერნაჭამიას ნაკადს აკვირდებიან. ბათუმის დერეფანი.",
    en: "Counters watching Honey Buzzards pass Station 1 in the Batumi bottleneck.",
    ru: "Наблюдатели на первой станции следят за потоком осоедов. Батумский коридор.",
    tr: "Gözlemciler 1. istasyonda arı şahini akımını izliyor. Batumi koridoru.",
  },
  credit: {
    photographer: "Elien Hoekstra",
    url: SOURCE_URL,
    date: "2026-08-27",
  },
};

const PHOTO_MESKHIDZE: NewsPhoto = {
  src: "https://cdn.reptiles.ge/news-batumi-19300-meskhidze-1.jpg",
  alt: {
    ka: "აისვა პირველ სადგურზე. ბათუმის დერეფანი.",
    en: "Sunrise at Station 1 in the Batumi bottleneck.",
    ru: "Рассвет на первой станции. Батумский коридор.",
    tr: "1. istasyonda gün doğumu. Batumi koridoru.",
  },
  credit: {
    photographer: "Sofia Meskhidze",
    url: SOURCE_URL,
    date: "2026-08-27",
  },
};

const PHOTO_ELDAKAMAWY: NewsPhoto = {
  src: "https://cdn.reptiles.ge/news-batumi-19300-eldakamawy-1.jpg",
  alt: {
    ka: "აღრიცხვა მეორე სადგურზე მძიმე ღრუბლების ქვეშ. ბათუმის დერეფანი.",
    en: "Counting at Station 2 under heavy clouds in the Batumi bottleneck.",
    ru: "Учёт на второй станции под тяжёлыми облаками. Батумский коридор.",
    tr: "Ağır bulutların altında 2. istasyonda sayım. Batumi koridoru.",
  },
  credit: {
    photographer: "Toka Eldakamawy",
    url: SOURCE_URL,
    date: "2026-08-27",
  },
};

const PHOTO_COSENTINO: NewsPhoto = {
  src: "https://cdn.reptiles.ge/news-batumi-19300-cosentino-kite-1.jpg",
  alt: {
    ka: "შავი ძერა სადგურებს გადაუფრინავს. ბათუმის დერეფანი.",
    en: "A Black Kite passing the count stations in the Batumi bottleneck.",
    ru: "Чёрный коршун пролетает мимо станций учёта. Батумский коридор.",
    tr: "Sayım istasyonlarının önünden geçen kara çaylak. Batumi koridoru.",
  },
  credit: {
    photographer: "Jess Cosentino",
    url: SOURCE_URL,
    date: "2026-08-27",
  },
};

const FIGURE_SUNRISE = {
  type: "figure" as const,
  src: PHOTO_MESKHIDZE.src,
};
const FIGURE_STATION_2 = {
  type: "figure" as const,
  src: PHOTO_ELDAKAMAWY.src,
};
const FIGURE_KITE = {
  type: "figure" as const,
  src: PHOTO_COSENTINO.src,
};

export const BATUMI_19300_RAPTORS_2026: NewsArticle = {
  id: "batumi-19300-raptors-2026",
  slug: "batumi-19300-raptors-2026",
  status: "published",
  publishedAt: "2026-08-27",
  updatedAt: "2026-09-01",
  relatedSpeciesIds: ["pernis-apivorus", "milvus-migrans", "buteo-buteo"],
  relatedRegionIds: ["adjara"],
  relatedHubIds: ["birds"],
  image: PHOTO_HOEKSTRA,
  gallery: [PHOTO_MESKHIDZE, PHOTO_ELDAKAMAWY, PHOTO_COSENTINO],
  sources: [
    {
      name: "Batumi Raptor Count — First 10,000+ day of the season",
      url: SOURCE_URL,
    },
    {
      name: "Batumi Raptor Count — Call for counters, autumn 2026",
      url: "https://www.batumiraptorcount.org/news/2026/4/call-for-counters-2026",
    },
  ],
  copy: {
    ka: {
      title: "ბათუმში ერთ დღეში თითქმის 19 300 მტაცებელი ფრინველი დაითვალეს",
      metaTitle:
        "ბათუმში ერთ დღეში თითქმის 19 300 მტაცებელი ფრინველი დაითვალეს",
      metaDescription:
        "2026 წლის 27 აგვისტოს Batumi Raptor Count-მა ბათუმის დერეფანში თითქმის 19 300 ფრინველი დაითვალა — შემოდგომის სეზონის პირველი 10 000-ზე მეტი ფრინველის დღე. ნაკადში კვერნაჭამია იდგა წინა პლანზე.",
      dek: "წვიმისა და ნისლის შემდეგ ბათუმის დერეფანმა სეზონის პირველი 10 000-იანი დღე დააფიქსირა. ჯამი თითქმის 19 300 ფრინველია; რამდენიმე საათიან ნაკადში კვერნაჭამია იდგა წინა პლანზე.",
      lead: "27 აგვისტოს Batumi Raptor Count-ის ორმა სადგურმა ბათუმის მიგრაციულ დერეფანში თითქმის 19 300 ფრინველი დაითვალა. ეს იყო 2026 წლის შემოდგომის სეზონის პირველი დღე, როცა დღიურმა ჯამმა 10 000-ს გადააჭარბა. ორგანიზაცია წერს, რომ ნაკადი რამდენიმე საათს გაგრძელდა და პრაქტიკულად კვერნაჭამიების კედელს ქმნიდა. ციფრები მათი საველე ანგარიშიდანაა — აღრიცხვა Reptiles.ge-ს არ ჩაუტარებია.",
      sections: [
        {
          heading: "რა მოხდა?",
          blocks: [
            {
              type: "p",
              parts: [
                "2026 წლის შემოდგომის აღრიცხვა ბათუმთან 12 აგვისტოს დაიწყო. პირველი ორი კვირა მშვიდი იყო. Batumi Raptor Count წერს, რომ 27 აგვისტომდე წვიმამ და ნისლმა დერეფანში რიცხვები დაბლა დასვა. კვერნაჭამიას პიკი ჯერ წინ იყო და გუნდი უკვე სვამდა კითხვას: სად არიან?",
              ],
            },
            FIGURE_SUNRISE,
            {
              type: "p",
              parts: [
                "იმ დღეს, როგორც ანგარიშში წერია, ისინი მოვიდნენ. ორი სადგურის ჯამი თითქმის 19 300 ფრინველამდე ავიდა. ნაკადი რამდენიმე საათს გაგრძელდა. ეს არის სეზონის პირველი დღე 10 000-ზე მეტი ფრინველით — არა სეზონის მთლიანი რიცხვი და არა ერთი სახეობის ზუსტი აღრიცხვა.",
              ],
            },
          ],
        },
        {
          heading: "რატომ არის ბათუმის დერეფანი მნიშვნელოვანი?",
          blocks: [
            {
              type: "p",
              parts: [
                "შემოდგომით მტაცებელი ფრინველები დასავლეთ პალეარქტიკიდან აფრიკისკენ შავი ზღვის აღმოსავლეთ სანაპიროს გაყოლებით ეშვებიან. ",
                { type: "region", id: "adjara", label: "აჭარაში" },
                ", ბათუმის ჩრდილოეთით, ზღვასა და მთას შორის ეს გზა ვიწროვდება. ამიტომ ჰქვია ადგილს ბათუმის დერეფანი: ბევრი ფრინველი ერთსა და იმავე ცას კვეთს და დღიური ჯამი აქ შეიძლება ათასეულებში აისახოს.",
              ],
            },
            {
              type: "p",
              parts: [
                "Batumi Raptor Count ამ დერეფანს 2008 წლიდან აკვირდება. 2026 წლის სეზონი 12 აგვისტოდან 21 ოქტომბრამდე გრძელდება. ანგარიშში დასახელებულია ორი სადგური; ატლასში ეს წერტილები სახალვაშოდ და შუამთად ჩანს იმ სახეობების პროფილებზე, რომლებსაც შემოდგომის გავლა აქვთ დასახელებული — მათ შორის ",
                {
                  type: "species",
                  id: "pernis-apivorus",
                  label: "ბოლოკარკაზი",
                },
                " და ",
                {
                  type: "species",
                  id: "buteo-buteo",
                  label: "ჩვეულებრივი კაკაჩა",
                },
                ". იგივე კონტექსტი არის ",
                { type: "hub", id: "birds", label: "ფრინველების ჰაბზე" },
                ".",
              ],
            },
          ],
        },
        {
          heading: "რა დაინახეს 27 აგვისტოს?",
          blocks: [
            {
              type: "p",
              parts: [
                "ანგარიშის მიხედვით, ნაკადში კვერნაჭამია (",
                { type: "sci", name: "Pernis apivorus" },
                ") იდგა წინა პლანზე. ატლასში ამ სახეობის გვერდია ",
                {
                  type: "species",
                  id: "pernis-apivorus",
                  label: "ბოლოკარკაზი",
                },
                ".",
              ],
            },
            {
              type: "p",
              parts: [
                "პირველმა სადგურმა დათვლის ძირითადი ტვირთი აიღო; მეორე სადგური იმავე ნაკადიდან ",
                {
                  type: "species",
                  id: "milvus-migrans",
                  label: "შავ ძერას",
                },
                " და ბოლოჭერებს გამოყოფდა. ბოლოჭერის სახეობა ამ ანგარიშში არ არის დასახელებული.",
              ],
            },
            FIGURE_STATION_2,
            {
              type: "p",
              parts: [
                "ორგანიზაციამ სახეობრივი ზუსტი რიცხვები ამ განახლებაში არ გამოაქვეყნა. ამიტომ აქ მხოლოდ მათი შეჯამებაა: თითქმის 19 300 ფრინველი ორ სადგურს შორის, სეზონის პირველი 10 000-იანი დღე, დომინანტი — კვერნაჭამია. შავი ძერა და ბოლოჭერები ნახსენებია, მაგრამ რაოდენობა არა.",
              ],
            },
            FIGURE_KITE,
            {
              type: "p",
              parts: [
                "კვერნაჭამია კაკაჩა არ არის. ახლოს მდგომი, მაგრამ განსხვავებული სახეობაა ",
                {
                  type: "species",
                  id: "buteo-buteo",
                  label: "ჩვეულებრივი კაკაჩა",
                },
                " — ისიც ბათუმის დერეფანში გადის; პროფილზე პირდაპირ წერია, რომ ბოლოკარკაზი სხვა ტაქსონია.",
              ],
            },
          ],
        },
        {
          heading: "რა ხდება შემდეგ?",
          blocks: [
            {
              type: "p",
              parts: [
                "Batumi Raptor Count წერს, რომ კვერნაჭამიას რიცხვების პიკი მომდევნო კვირაშია მოსალოდნელი. სეზონი 21 ოქტომბრამდე გრძელდება. 27 აგვისტო პირველი დიდი დღეა, არა დასასრული: დღიური ჯამები შეიძლება კიდევ გაიზარდოს, სახეობრივი სურათი კი სეზონის განმავლობაში შეიცვალოს.",
              ],
            },
            {
              type: "p",
              parts: [
                "დღიური ციფრების პირველადი წყაროა Batumi Raptor Count. ",
                { type: "news-index", label: "სიახლეებში" },
                " ასეთ ანგარიშებს კონტექსტს ვუმატებთ და ატლასის გვერდებზე ვაბრუნებთ — სახეობის პროფილი რჩება ძირითად ჩანაწერად.",
              ],
            },
          ],
        },
      ],
    },
    en: {
      title: "Nearly 19,300 raptors counted in one day at Batumi",
      metaTitle: "Nearly 19,300 raptors counted in one day at Batumi",
      metaDescription:
        "On 27 August 2026, Batumi Raptor Count recorded nearly 19,300 birds through the Batumi bottleneck — the first 10,000-plus day of the autumn season, led by European Honey Buzzards.",
      dek: "After rain and fog, 27 August brought the season’s first 10,000-plus day in the Batumi bottleneck: nearly 19,300 birds, with Honey Buzzards dominating a stream that lasted several hours.",
      lead: "On 27 August, Batumi Raptor Count’s two stations recorded nearly 19,300 birds through the Batumi migration bottleneck. It was the first day of the 2026 autumn season on which the daily total passed 10,000. The organisation described a passage lasting several hours that practically created a wall of Honey Buzzards. The figures come from their field update — Reptiles.ge did not conduct the count.",
      sections: [
        {
          heading: "What happened?",
          blocks: [
            {
              type: "p",
              parts: [
                "The 2026 autumn count at Batumi began on 12 August. The first fortnight was quiet. Batumi Raptor Count reported that rain and fog before 27 August had kept numbers low. The Honey Buzzard peak still lay ahead, and the team had begun to wonder where the birds were.",
              ],
            },
            FIGURE_SUNRISE,
            {
              type: "p",
              parts: [
                "That day, the report says, they arrived. The two stations together reached nearly 19,300 birds. The stream lasted several hours. That is the season’s first day above 10,000 — not a season total, and not a species-by-species breakdown.",
              ],
            },
          ],
        },
        {
          heading: "Why is the Batumi bottleneck important?",
          blocks: [
            {
              type: "p",
              parts: [
                "In autumn, raptors moving from the western Palearctic toward Africa follow the eastern Black Sea coast. In ",
                { type: "region", id: "adjara", label: "Adjara" },
                ", north of Batumi, sea and mountains pinch that route into a narrow corridor. That is the Batumi bottleneck: many birds cross the same sky, so a single day’s count can run to the thousands.",
              ],
            },
            {
              type: "p",
              parts: [
                "Batumi Raptor Count has watched the corridor since 2008. The 2026 season runs from 12 August to 21 October. The update names two stations; on this atlas those sites appear as Sakhalvasho and Shuamta on profiles that record autumn passage here — including ",
                {
                  type: "species",
                  id: "pernis-apivorus",
                  label: "European honey buzzard",
                },
                " and ",
                {
                  type: "species",
                  id: "buteo-buteo",
                  label: "Common buzzard",
                },
                ". The same context is on the ",
                { type: "hub", id: "birds", label: "birds hub" },
                ".",
              ],
            },
          ],
        },
        {
          heading: "What was observed on 27 August?",
          blocks: [
            {
              type: "p",
              parts: [
                "According to the report, European Honey Buzzards (",
                { type: "sci", name: "Pernis apivorus" },
                ") dominated the stream. This atlas’s profile for the species is ",
                {
                  type: "species",
                  id: "pernis-apivorus",
                  label: "European honey buzzard",
                },
                ".",
              ],
            },
            {
              type: "p",
              parts: [
                "Station 1 took most of the counting; Station 2 worked the same streams for ",
                {
                  type: "species",
                  id: "milvus-migrans",
                  label: "Black kites",
                },
                " and harriers. The update does not name the harriers to species.",
              ],
            },
            FIGURE_STATION_2,
            {
              type: "p",
              parts: [
                "The report does not give species totals. What can be repeated here is only their summary: nearly 19,300 birds across the two stations, the first 10,000-plus day of the season, Honey Buzzards in the lead. Black Kites and harriers are named, without numbers.",
              ],
            },
            FIGURE_KITE,
            {
              type: "p",
              parts: [
                "Honey Buzzard is not a buzzard in the genus Buteo. The closest published lookalike page is ",
                {
                  type: "species",
                  id: "buteo-buteo",
                  label: "Common buzzard",
                },
                " — also a Batumi migrant, and a profile that already states honey buzzard is a different taxon.",
              ],
            },
          ],
        },
        {
          heading: "What happens next?",
          blocks: [
            {
              type: "p",
              parts: [
                "Batumi Raptor Count expects Honey Buzzard numbers to peak in the following week. The season continues through 21 October. 27 August is the first large day, not the last: daily totals may still rise, and the species mix will shift as the autumn count runs on.",
              ],
            },
            {
              type: "p",
              parts: [
                "The primary source for the daily figures remains Batumi Raptor Count. ",
                { type: "news-index", label: "News" },
                " on this site adds context and points back to atlas pages — the species profile stays the main record.",
              ],
            },
          ],
        },
      ],
    },
    ru: {
      title: "В Батуми за один день насчитали почти 19 300 хищных птиц",
      metaTitle: "В Батуми за один день насчитали почти 19 300 хищных птиц",
      metaDescription:
        "27 августа 2026 года Batumi Raptor Count насчитал почти 19 300 птиц в батумском миграционном коридоре — первый день сезона с более чем 10 000 птиц. В потоке преобладал осоед.",
      dek: "После дождя и тумана 27 августа батумский коридор дал первый день сезона выше 10 000: почти 19 300 птиц, несколько часов потока, в котором преобладал осоед.",
      lead: "27 августа две станции Batumi Raptor Count насчитали почти 19 300 птиц в батумском миграционном коридоре. Это был первый день осеннего сезона 2026 года, когда дневная сумма превысила 10 000. Организация описывает пролёт длительностью несколько часов, который практически создавал стену осоедов. Цифры взяты из их полевого отчёта — Reptiles.ge подсчёт не вёл.",
      sections: [
        {
          heading: "Что произошло?",
          paragraphs: [
            [
              "Осенний учёт 2026 года у Батуми начался 12 августа. Первые две недели были спокойными. Batumi Raptor Count пишет, что дождь и туман до 27 августа держали численность низкой. Пик пролёта осоеда ещё был впереди, и команда уже спрашивала: где они?",
            ],
            [
              "В тот день, по отчёту, они появились. Сумма двух станций достигла почти 19 300 птиц. Поток шёл несколько часов. Это первый день сезона выше 10 000 — не итог сезона и не разбивка по видам.",
            ],
          ],
        },
        {
          heading: "Почему важен батумский коридор?",
          paragraphs: [
            [
              "Осенью хищные птицы с запада Палеарктики к Африке идут вдоль восточного берега Чёрного моря. В ",
              { type: "region", id: "adjara", label: "Аджарии" },
              ", к северу от Батуми, море и горы сужают этот путь. Отсюда название — батумский коридор: много птиц пересекает одно и то же небо, и дневная сумма может исчисляться тысячами.",
            ],
            [
              "Batumi Raptor Count ведёт наблюдения здесь с 2008 года. Сезон 2026 года длится с 12 августа по 21 октября. В отчёте названы две станции; в атласе эти точки — Сахалвашо и Шуамта — есть в профилях видов с осенним пролётом, в том числе у ",
              {
                type: "species",
                id: "pernis-apivorus",
                label: "обыкновенного осоеда",
              },
              " и ",
              {
                type: "species",
                id: "buteo-buteo",
                label: "обыкновенного канюка",
              },
              ". Тот же контекст — на ",
              { type: "hub", id: "birds", label: "странице птиц" },
              ".",
            ],
          ],
        },
        {
          heading: "Что наблюдали 27 августа?",
          paragraphs: [
            [
              "По отчёту, в потоке преобладал осоед (",
              { type: "sci", name: "Pernis apivorus" },
              "). Профиль вида в атласе: ",
              {
                type: "species",
                id: "pernis-apivorus",
                label: "обыкновенный осоед",
              },
              ". Первая станция взяла основную нагрузку подсчёта; вторая выделяла из того же потока ",
              {
                type: "species",
                id: "milvus-migrans",
                label: "чёрных коршунов",
              },
              " и луней. Вид луней в этом отчёте не назван.",
            ],
            [
              "В этом обновлении нет точных цифр по видам. Здесь можно повторить только их сводку: почти 19 300 птиц на двух станциях, первый день сезона выше 10 000, доминант — осоед. Чёрный коршун и луни названы, без численности.",
            ],
            [
              "Осоед — не канюк рода Buteo. Ближайшая страница сходного вида — ",
              {
                type: "species",
                id: "buteo-buteo",
                label: "обыкновенный канюк",
              },
              ": тоже идёт через батумский коридор, и в профиле прямо сказано, что осоед — другой таксон.",
            ],
          ],
        },
        {
          heading: "Что дальше?",
          paragraphs: [
            [
              "Batumi Raptor Count ожидает пик численности осоеда на следующей неделе. Сезон длится до 21 октября. 27 августа — первый крупный день, не конец: дневные суммы ещё могут вырасти, а видовой состав к концу учёта изменится.",
            ],
            [
              "Первичный источник дневных цифр — Batumi Raptor Count. В ",
              { type: "news-index", label: "новостях" },
              " мы добавляем контекст и возвращаем к страницам атласа — основной записью остаётся профиль вида.",
            ],
          ],
        },
      ],
    },
    tr: {
      title: "Batumi’de bir günde yaklaşık 19.300 yırtıcı kuş sayıldı",
      metaTitle: "Batumi’de bir günde yaklaşık 19.300 yırtıcı kuş sayıldı",
      metaDescription:
        "27 Ağustos 2026’da Batumi Raptor Count, Batumi göç koridorunda yaklaşık 19.300 kuş saydı — sonbahar sezonunun ilk 10.000 üzeri günü. Akımda arı şahini baskındı.",
      dek: "Yağmur ve sisin ardından 27 Ağustos, Batumi koridorunda sezonun ilk 10.000 üzeri günü oldu: yaklaşık 19.300 kuş; birkaç saat süren akımda arı şahini öndeydi.",
      lead: "27 Ağustos’ta Batumi Raptor Count’un iki istasyonu, Batumi göç koridorundan geçen yaklaşık 19.300 kuş saydı. 2026 sonbahar sezonunda günlük toplamın 10.000’i aştığı ilk gündü. Örgüt, birkaç saat süren ve neredeyse bir arı şahini duvarı oluşturan geçişten söz etti. Sayılar onların saha raporundan — sayımı Reptiles.ge yapmadı.",
      sections: [
        {
          heading: "Ne oldu?",
          paragraphs: [
            [
              "2026 sonbahar sayımı Batumi’de 12 Ağustos’ta başladı. İlk iki hafta sakin geçti. Batumi Raptor Count, 27 Ağustos’tan önceki yağmur ve sisin sayıları düşük tuttuğunu yazdı. Arı şahini zirvesi hâlâ öndeydi ve ekip kuşların nerede olduğunu sormaya başlamıştı.",
            ],
            [
              "O gün, rapora göre, geldiler. İki istasyonun toplamı yaklaşık 19.300 kuşa çıktı. Akım birkaç saat sürdü. Bu, sezonun 10.000’i aşan ilk günü — sezon toplamı değil, türlere göre döküm de değil.",
            ],
          ],
        },
        {
          heading: "Batumi koridoru neden önemli?",
          paragraphs: [
            [
              "Sonbaharda yırtıcı kuşlar batı Palearktik’ten Afrika’ya Karadeniz’in doğu kıyısı boyunca iner. ",
              { type: "region", id: "adjara", label: "Acara’da" },
              ", Batumi’nin kuzeyinde deniz ile dağ bu yolu daraltır. Batumi koridoru bu yüzden böyle anılır: birçok kuş aynı gökyüzünü geçer, günlük toplam binleri bulabilir.",
            ],
            [
              "Batumi Raptor Count koridoru 2008’den beri izliyor. 2026 sezonu 12 Ağustos–21 Ekim arasında. Raporda iki istasyon adı geçer; atlas’ta bu noktalar sonbahar geçişini anan profillerde Sakhalvasho ve Şuamta olarak durur — örneğin ",
              {
                type: "species",
                id: "pernis-apivorus",
                label: "arı şahini",
              },
              " ve ",
              {
                type: "species",
                id: "buteo-buteo",
                label: "şahin",
              },
              ". Aynı bağlam ",
              { type: "hub", id: "birds", label: "kuşlar sayfasında" },
              " da var.",
            ],
          ],
        },
        {
          heading: "27 Ağustos’ta ne görüldü?",
          paragraphs: [
            [
              "Rapora göre akımda arı şahini (",
              { type: "sci", name: "Pernis apivorus" },
              ") baskındı. Atlas’taki profili: ",
              {
                type: "species",
                id: "pernis-apivorus",
                label: "arı şahini",
              },
              ". 1. istasyon sayımın asıl yükünü aldı; 2. istasyon aynı akımdan ",
              {
                type: "species",
                id: "milvus-migrans",
                label: "kara çaylakları",
              },
              " ve deliceleri ayırmaya çalıştı. Raporda delice türü belirtilmiyor.",
            ],
            [
              "Bu güncellemede türe göre kesin sayılar yok. Burada yalnızca özetleri tekrarlanabilir: iki istasyonda yaklaşık 19.300 kuş, sezonun ilk 10.000 üzeri günü, baskın tür arı şahini. Kara çaylak ve deliceler adı geçiyor, sayı yok.",
            ],
            [
              "Arı şahini, Buteo cinsindeki şahin değildir. En yakın benzer sayfa ",
              {
                type: "species",
                id: "buteo-buteo",
                label: "şahin",
              },
              " — o da Batumi’den geçer; profilinde arı şahininin ayrı bir takson olduğu açıkça yazılır.",
            ],
          ],
        },
        {
          heading: "Sırada ne var?",
          paragraphs: [
            [
              "Batumi Raptor Count, arı şahini sayılarının sonraki hafta zirveye yaklaşmasını bekliyor. Sezon 21 Ekim’e kadar sürer. 27 Ağustos ilk büyük gündür, son değil: günlük toplamlar hâlâ artabilir, tür bileşimi sayım ilerledikçe değişir.",
            ],
            [
              "Günlük rakamların birincil kaynağı Batumi Raptor Count’tur. Bu sitedeki ",
              { type: "news-index", label: "haberler" },
              " bağlama ekler ve atlas sayfalarına döner — asıl kayıt tür profilidir.",
            ],
          ],
        },
      ],
    },
  },
};
