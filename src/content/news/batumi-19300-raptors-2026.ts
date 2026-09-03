import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const SOURCE_URL =
  "https://www.batumiraptorcount.org/news/2026/8/first-10000-day-of-the-season/";

const PHOTO_HOEKSTRA: NewsPhoto = {
  alt: {
    en: "Counters watching Honey Buzzards pass Station 1 in the Batumi bottleneck.",
    ka: "აღმწერები პირველ სადგურზე კვერნაჭამიას ნაკადს აკვირდებიან. ბათუმის დერეფანი.",
    ru: "Наблюдатели на первой станции следят за потоком осоедов. Батумский коридор.",
    tr: "Gözlemciler 1. istasyonda arı şahini akımını izliyor. Batumi koridoru.",
  },
  credit: {
    date: "2026-08-27",
    photographer: "Elien Hoekstra",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-19300-hoekstra-1.jpg",
};

const PHOTO_MESKHIDZE: NewsPhoto = {
  alt: {
    en: "Sunrise at Station 1 in the Batumi bottleneck.",
    ka: "აისვა პირველ სადგურზე. ბათუმის დერეფანი.",
    ru: "Рассвет на первой станции. Батумский коридор.",
    tr: "1. istasyonda gün doğumu. Batumi koridoru.",
  },
  credit: {
    date: "2026-08-27",
    photographer: "Sofia Meskhidze",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-19300-meskhidze-1.jpg",
};

const PHOTO_ELDAKAMAWY: NewsPhoto = {
  alt: {
    en: "Counting at Station 2 under heavy clouds in the Batumi bottleneck.",
    ka: "აღრიცხვა მეორე სადგურზე მძიმე ღრუბლების ქვეშ. ბათუმის დერეფანი.",
    ru: "Учёт на второй станции под тяжёлыми облаками. Батумский коридор.",
    tr: "Ağır bulutların altında 2. istasyonda sayım. Batumi koridoru.",
  },
  credit: {
    date: "2026-08-27",
    photographer: "Toka Eldakamawy",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-19300-eldakamawy-1.jpg",
};

const PHOTO_COSENTINO: NewsPhoto = {
  alt: {
    en: "A Black Kite passing the count stations in the Batumi bottleneck.",
    ka: "შავი ძერა სადგურებს გადაუფრინავს. ბათუმის დერეფანი.",
    ru: "Чёрный коршун пролетает мимо станций учёта. Батумский коридор.",
    tr: "Sayım istasyonlarının önünden geçen kara çaylak. Batumi koridoru.",
  },
  credit: {
    date: "2026-08-27",
    photographer: "Jess Cosentino",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-19300-cosentino-kite-1.jpg",
};

const FIGURE_SUNRISE = {
  src: PHOTO_MESKHIDZE.src,
  type: "figure" as const,
};
const FIGURE_STATION_2 = {
  src: PHOTO_ELDAKAMAWY.src,
  type: "figure" as const,
};
const FIGURE_KITE = {
  src: PHOTO_COSENTINO.src,
  type: "figure" as const,
};

export const BATUMI_19300_RAPTORS_2026: NewsArticle = {
  copy: {
    en: {
      dek: "After rain and fog, the Batumi bottleneck recorded the season’s first 10,000-plus day. Nearly 19,300 birds were counted in total.",
      lead: "On 27 August, Batumi Raptor Count’s two stations recorded nearly 19,300 birds through the Batumi migration bottleneck. It was the first day of the 2026 autumn season on which the daily total passed 10,000. The organisation described a passage lasting several hours that practically created a wall of Honey Buzzards. The figures come from their field update — Reptiles.ge did not conduct the count.",
      metaDescription:
        "On 27 August 2026, Batumi Raptor Count recorded nearly 19,300 birds through the Batumi bottleneck — the first 10,000-plus day of the autumn season, led by European Honey Buzzards.",
      metaTitle: "Nearly 19,300 raptors counted in one day at Batumi",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The 2026 autumn count at Batumi began on 12 August. The first fortnight was quiet. Batumi Raptor Count reported that rain and fog before 27 August had kept numbers low. The Honey Buzzard peak still lay ahead, and the team had begun to wonder where the birds were.",
              ],
              type: "p",
            },
            FIGURE_SUNRISE,
            {
              parts: [
                "That day, the report says, they arrived. The two stations together reached nearly 19,300 birds. The stream lasted several hours. That is the season’s first day above 10,000 — not a season total, and not a species-by-species breakdown.",
              ],
              type: "p",
            },
          ],
          heading: "What happened?",
        },
        {
          blocks: [
            {
              parts: [
                "In autumn, raptors moving from the western Palearctic toward Africa follow the eastern Black Sea coast. In ",
                { id: "adjara", label: "Adjara", type: "region" },
                ", north of Batumi, sea and mountains pinch that route into a narrow corridor. That is the Batumi bottleneck: many birds cross the same sky, so a single day’s count can run to the thousands.",
              ],
              type: "p",
            },
            {
              parts: [
                "Batumi Raptor Count has watched the corridor since 2008. The 2026 season runs from 12 August to 21 October. The update names two stations; on this atlas those sites appear as Sakhalvasho and Shuamta on profiles that record autumn passage here — including ",
                {
                  id: "pernis-apivorus",
                  label: "European honey buzzard",
                  type: "species",
                },
                " and ",
                {
                  id: "buteo-buteo",
                  label: "Common buzzard",
                  type: "species",
                },
                ". The same context is on the ",
                { id: "birds", label: "birds hub", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Why is the Batumi bottleneck important?",
        },
        {
          blocks: [
            {
              parts: [
                "According to the report, European Honey Buzzards (",
                { name: "Pernis apivorus", type: "sci" },
                ") dominated the stream. This atlas’s profile for the species is ",
                {
                  id: "pernis-apivorus",
                  label: "European honey buzzard",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "Station 1 took most of the counting; Station 2 worked the same streams for ",
                {
                  id: "milvus-migrans",
                  label: "Black kites",
                  type: "species",
                },
                " and harriers. The update does not name the harriers to species.",
              ],
              type: "p",
            },
            FIGURE_STATION_2,
            {
              parts: [
                "The report does not give species totals. What can be repeated here is only their summary: nearly 19,300 birds across the two stations, the first 10,000-plus day of the season, Honey Buzzards in the lead. Black Kites and harriers are named, without numbers.",
              ],
              type: "p",
            },
            FIGURE_KITE,
            {
              parts: [
                "Honey Buzzard is not a buzzard in the genus Buteo. The closest published lookalike page is ",
                {
                  id: "buteo-buteo",
                  label: "Common buzzard",
                  type: "species",
                },
                " — also a Batumi migrant, and a profile that already states honey buzzard is a different taxon.",
              ],
              type: "p",
            },
          ],
          heading: "What was observed on 27 August?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count expects Honey Buzzard numbers to peak in the following week. The season continues through 21 October. 27 August is the first large day, not the last: daily totals may still rise, and the species mix will shift as the autumn count runs on.",
              ],
              type: "p",
            },
            {
              parts: [
                "The primary source for the daily figures remains Batumi Raptor Count. ",
                { label: "News", type: "news-index" },
                " on this site adds context and points back to atlas pages — the species profile stays the main record.",
              ],
              type: "p",
            },
          ],
          heading: "What happens next?",
        },
      ],
      title: "Nearly 19,300 raptors counted in one day at Batumi",
    },
    ka: {
      dek: "წვიმისა და ნისლის შემდეგ ბათუმის დერეფანმა სეზონის პირველი 10 000-იანი დღე დააფიქსირა. ჯამში თითქმის 19 300 ფრინველი აღირიცხა.",
      lead: "27 აგვისტოს Batumi Raptor Count-ის ორმა სადგურმა ბათუმის მიგრაციულ დერეფანში თითქმის 19 300 ფრინველი დაითვალა. ეს იყო 2026 წლის შემოდგომის სეზონის პირველი დღე, როცა დღიურმა ჯამმა 10 000-ს გადააჭარბა. ორგანიზაცია წერს, რომ ნაკადი რამდენიმე საათს გაგრძელდა და პრაქტიკულად კვერნაჭამიების კედელს ქმნიდა. ციფრები მათი საველე ანგარიშიდანაა — აღრიცხვა Reptiles.ge-ს არ ჩაუტარებია.",
      metaDescription:
        "2026 წლის 27 აგვისტოს Batumi Raptor Count-მა ბათუმის დერეფანში თითქმის 19 300 ფრინველი დაითვალა — შემოდგომის სეზონის პირველი 10 000-ზე მეტი ფრინველის დღე. ნაკადში კვერნაჭამია იდგა წინა პლანზე.",
      metaTitle:
        "ბათუმში ერთ დღეში თითქმის 19 300 მტაცებელი ფრინველი დაითვალეს",
      sections: [
        {
          blocks: [
            {
              parts: [
                "2026 წლის შემოდგომის აღრიცხვა ბათუმთან 12 აგვისტოს დაიწყო. პირველი ორი კვირა მშვიდი იყო. Batumi Raptor Count წერს, რომ 27 აგვისტომდე წვიმამ და ნისლმა დერეფანში რიცხვები დაბლა დასვა. კვერნაჭამიას პიკი ჯერ წინ იყო და გუნდი უკვე სვამდა კითხვას: სად არიან?",
              ],
              type: "p",
            },
            FIGURE_SUNRISE,
            {
              parts: [
                "იმ დღეს, როგორც ანგარიშში წერია, ისინი მოვიდნენ. ორი სადგურის ჯამი თითქმის 19 300 ფრინველამდე ავიდა. ნაკადი რამდენიმე საათს გაგრძელდა. ეს არის სეზონის პირველი დღე 10 000-ზე მეტი ფრინველით — არა სეზონის მთლიანი რიცხვი და არა ერთი სახეობის ზუსტი აღრიცხვა.",
              ],
              type: "p",
            },
          ],
          heading: "რა მოხდა?",
        },
        {
          blocks: [
            {
              parts: [
                "შემოდგომით მტაცებელი ფრინველები დასავლეთ პალეარქტიკიდან აფრიკისკენ შავი ზღვის აღმოსავლეთ სანაპიროს გაყოლებით ეშვებიან. ",
                { id: "adjara", label: "აჭარაში", type: "region" },
                ", ბათუმის ჩრდილოეთით, ზღვასა და მთას შორის ეს გზა ვიწროვდება. ამიტომ ჰქვია ადგილს ბათუმის დერეფანი: ბევრი ფრინველი ერთსა და იმავე ცას კვეთს და დღიური ჯამი აქ შეიძლება ათასეულებში აისახოს.",
              ],
              type: "p",
            },
            {
              parts: [
                "Batumi Raptor Count ამ დერეფანს 2008 წლიდან აკვირდება. 2026 წლის სეზონი 12 აგვისტოდან 21 ოქტომბრამდე გრძელდება. ანგარიშში დასახელებულია ორი სადგური; ატლასში ეს წერტილები სახალვაშოდ და შუამთად ჩანს იმ სახეობების პროფილებზე, რომლებსაც შემოდგომის გავლა აქვთ დასახელებული — მათ შორის ",
                {
                  id: "pernis-apivorus",
                  label: "ბოლოკარკაზი",
                  type: "species",
                },
                " და ",
                {
                  id: "buteo-buteo",
                  label: "ჩვეულებრივი კაკაჩა",
                  type: "species",
                },
                ". იგივე კონტექსტი არის ",
                { id: "birds", label: "ფრინველების ჰაბზე", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რატომ არის ბათუმის დერეფანი მნიშვნელოვანი?",
        },
        {
          blocks: [
            {
              parts: [
                "ანგარიშის მიხედვით, ნაკადში კვერნაჭამია (",
                { name: "Pernis apivorus", type: "sci" },
                ") იდგა წინა პლანზე. ატლასში ამ სახეობის გვერდია ",
                {
                  id: "pernis-apivorus",
                  label: "ბოლოკარკაზი",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "პირველმა სადგურმა დათვლის ძირითადი ტვირთი აიღო; მეორე სადგური იმავე ნაკადიდან ",
                {
                  id: "milvus-migrans",
                  label: "შავ ძერას",
                  type: "species",
                },
                " და ბოლოჭერებს გამოყოფდა. ბოლოჭერის სახეობა ამ ანგარიშში არ არის დასახელებული.",
              ],
              type: "p",
            },
            FIGURE_STATION_2,
            {
              parts: [
                "ორგანიზაციამ სახეობრივი ზუსტი რიცხვები ამ განახლებაში არ გამოაქვეყნა. ამიტომ აქ მხოლოდ მათი შეჯამებაა: თითქმის 19 300 ფრინველი ორ სადგურს შორის, სეზონის პირველი 10 000-იანი დღე, დომინანტი — კვერნაჭამია. შავი ძერა და ბოლოჭერები ნახსენებია, მაგრამ რაოდენობა არა.",
              ],
              type: "p",
            },
            FIGURE_KITE,
            {
              parts: [
                "კვერნაჭამია კაკაჩა არ არის. ახლოს მდგომი, მაგრამ განსხვავებული სახეობაა ",
                {
                  id: "buteo-buteo",
                  label: "ჩვეულებრივი კაკაჩა",
                  type: "species",
                },
                " — ისიც ბათუმის დერეფანში გადის; პროფილზე პირდაპირ წერია, რომ ბოლოკარკაზი სხვა ტაქსონია.",
              ],
              type: "p",
            },
          ],
          heading: "რა დაინახეს 27 აგვისტოს?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count წერს, რომ კვერნაჭამიას რიცხვების პიკი მომდევნო კვირაშია მოსალოდნელი. სეზონი 21 ოქტომბრამდე გრძელდება. 27 აგვისტო პირველი დიდი დღეა, არა დასასრული: დღიური ჯამები შეიძლება კიდევ გაიზარდოს, სახეობრივი სურათი კი სეზონის განმავლობაში შეიცვალოს.",
              ],
              type: "p",
            },
            {
              parts: [
                "დღიური ციფრების პირველადი წყაროა Batumi Raptor Count. ",
                { label: "სიახლეებში", type: "news-index" },
                " ასეთ ანგარიშებს კონტექსტს ვუმატებთ და ატლასის გვერდებზე ვაბრუნებთ — სახეობის პროფილი რჩება ძირითად ჩანაწერად.",
              ],
              type: "p",
            },
          ],
          heading: "რა ხდება შემდეგ?",
        },
      ],
      title: "ბათუმში ერთ დღეში თითქმის 19 300 მტაცებელი ფრინველი დაითვალეს",
    },
    ru: {
      dek: "После дождя и тумана батумский коридор зафиксировал первый 10 000-ный день сезона. Всего учтено почти 19 300 птиц.",
      lead: "27 августа две станции Batumi Raptor Count насчитали почти 19 300 птиц в батумском миграционном коридоре. Это был первый день осеннего сезона 2026 года, когда дневная сумма превысила 10 000. Организация описывает пролёт длительностью несколько часов, который практически создавал стену осоедов. Цифры взяты из их полевого отчёта — Reptiles.ge подсчёт не вёл.",
      metaDescription:
        "27 августа 2026 года Batumi Raptor Count насчитал почти 19 300 птиц в батумском миграционном коридоре — первый день сезона с более чем 10 000 птиц. В потоке преобладал осоед.",
      metaTitle: "В Батуми за один день насчитали почти 19 300 хищных птиц",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Осенний учёт 2026 года у Батуми начался 12 августа. Первые две недели были спокойными. Batumi Raptor Count пишет, что дождь и туман до 27 августа держали численность низкой. Пик пролёта осоеда ещё был впереди, и команда уже спрашивала: где они?",
              ],
              type: "p",
            },
            FIGURE_SUNRISE,
            {
              parts: [
                "В тот день, по отчёту, они появились. Сумма двух станций достигла почти 19 300 птиц. Поток шёл несколько часов. Это первый день сезона выше 10 000 — не итог сезона и не разбивка по видам.",
              ],
              type: "p",
            },
          ],
          heading: "Что произошло?",
        },
        {
          blocks: [
            {
              parts: [
                "Осенью хищные птицы с запада Палеарктики к Африке идут вдоль восточного берега Чёрного моря. В ",
                { id: "adjara", label: "Аджарии", type: "region" },
                ", к северу от Батуми, море и горы сужают этот путь. Отсюда название — батумский коридор: много птиц пересекает одно и то же небо, и дневная сумма может исчисляться тысячами.",
              ],
              type: "p",
            },
            {
              parts: [
                "Batumi Raptor Count ведёт наблюдения здесь с 2008 года. Сезон 2026 года длится с 12 августа по 21 октября. В отчёте названы две станции; в атласе эти точки — Сахалвашо и Шуамта — есть в профилях видов с осенним пролётом, в том числе у ",
                {
                  id: "pernis-apivorus",
                  label: "обыкновенного осоеда",
                  type: "species",
                },
                " и ",
                {
                  id: "buteo-buteo",
                  label: "обыкновенного канюка",
                  type: "species",
                },
                ". Тот же контекст — на ",
                { id: "birds", label: "странице птиц", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Почему важен батумский коридор?",
        },
        {
          blocks: [
            {
              parts: [
                "По отчёту, в потоке преобладал осоед (",
                { name: "Pernis apivorus", type: "sci" },
                "). Профиль вида в атласе: ",
                {
                  id: "pernis-apivorus",
                  label: "обыкновенный осоед",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "Первая станция взяла основную нагрузку подсчёта; вторая выделяла из того же потока ",
                {
                  id: "milvus-migrans",
                  label: "чёрных коршунов",
                  type: "species",
                },
                " и луней. Вид луней в этом отчёте не назван.",
              ],
              type: "p",
            },
            FIGURE_STATION_2,
            {
              parts: [
                "В этом обновлении нет точных цифр по видам. Здесь можно повторить только их сводку: почти 19 300 птиц на двух станциях, первый день сезона выше 10 000, доминант — осоед. Чёрный коршун и луни названы, без численности.",
              ],
              type: "p",
            },
            FIGURE_KITE,
            {
              parts: [
                "Осоед — не канюк рода Buteo. Ближайшая страница сходного вида — ",
                {
                  id: "buteo-buteo",
                  label: "обыкновенный канюк",
                  type: "species",
                },
                ": тоже идёт через батумский коридор, и в профиле прямо сказано, что осоед — другой таксон.",
              ],
              type: "p",
            },
          ],
          heading: "Что наблюдали 27 августа?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count ожидает пик численности осоеда на следующей неделе. Сезон длится до 21 октября. 27 августа — первый крупный день, не конец: дневные суммы ещё могут вырасти, а видовой состав к концу учёта изменится.",
              ],
              type: "p",
            },
            {
              parts: [
                "Первичный источник дневных цифр — Batumi Raptor Count. В ",
                { label: "новостях", type: "news-index" },
                " мы добавляем контекст и возвращаем к страницам атласа — основной записью остаётся профиль вида.",
              ],
              type: "p",
            },
          ],
          heading: "Что дальше?",
        },
      ],
      title: "В Батуми за один день насчитали почти 19 300 хищных птиц",
    },
    tr: {
      dek: "Yağmur ve sisin ardından Batumi koridoru sezonun ilk 10.000’lik gününü kaydetti. Toplamda yaklaşık 19.300 kuş sayıldı.",
      lead: "27 Ağustos’ta Batumi Raptor Count’un iki istasyonu, Batumi göç koridorundan geçen yaklaşık 19.300 kuş saydı. 2026 sonbahar sezonunda günlük toplamın 10.000’i aştığı ilk gündü. Örgüt, birkaç saat süren ve neredeyse bir arı şahini duvarı oluşturan geçişten söz etti. Sayılar onların saha raporundan — sayımı Reptiles.ge yapmadı.",
      metaDescription:
        "27 Ağustos 2026’da Batumi Raptor Count, Batumi göç koridorunda yaklaşık 19.300 kuş saydı — sonbahar sezonunun ilk 10.000 üzeri günü. Akımda arı şahini baskındı.",
      metaTitle: "Batumi’de bir günde yaklaşık 19.300 yırtıcı kuş sayıldı",
      sections: [
        {
          blocks: [
            {
              parts: [
                "2026 sonbahar sayımı Batumi’de 12 Ağustos’ta başladı. İlk iki hafta sakin geçti. Batumi Raptor Count, 27 Ağustos’tan önceki yağmur ve sisin sayıları düşük tuttuğunu yazdı. Arı şahini zirvesi hâlâ öndeydi ve ekip kuşların nerede olduğunu sormaya başlamıştı.",
              ],
              type: "p",
            },
            FIGURE_SUNRISE,
            {
              parts: [
                "O gün, rapora göre, geldiler. İki istasyonun toplamı yaklaşık 19.300 kuşa çıktı. Akım birkaç saat sürdü. Bu, sezonun 10.000’i aşan ilk günü — sezon toplamı değil, türlere göre döküm de değil.",
              ],
              type: "p",
            },
          ],
          heading: "Ne oldu?",
        },
        {
          blocks: [
            {
              parts: [
                "Sonbaharda yırtıcı kuşlar batı Palearktik’ten Afrika’ya Karadeniz’in doğu kıyısı boyunca iner. ",
                { id: "adjara", label: "Acara’da", type: "region" },
                ", Batumi’nin kuzeyinde deniz ile dağ bu yolu daraltır. Batumi koridoru bu yüzden böyle anılır: birçok kuş aynı gökyüzünü geçer, günlük toplam binleri bulabilir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Batumi Raptor Count koridoru 2008’den beri izliyor. 2026 sezonu 12 Ağustos–21 Ekim arasında. Raporda iki istasyon adı geçer; atlas’ta bu noktalar sonbahar geçişini anan profillerde Sakhalvasho ve Şuamta olarak durur — örneğin ",
                {
                  id: "pernis-apivorus",
                  label: "arı şahini",
                  type: "species",
                },
                " ve ",
                {
                  id: "buteo-buteo",
                  label: "şahin",
                  type: "species",
                },
                ". Aynı bağlam ",
                { id: "birds", label: "kuşlar sayfasında", type: "hub" },
                " da var.",
              ],
              type: "p",
            },
          ],
          heading: "Batumi koridoru neden önemli?",
        },
        {
          blocks: [
            {
              parts: [
                "Rapora göre akımda arı şahini (",
                { name: "Pernis apivorus", type: "sci" },
                ") baskındı. Atlas’taki profili: ",
                {
                  id: "pernis-apivorus",
                  label: "arı şahini",
                  type: "species",
                },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "1. istasyon sayımın asıl yükünü aldı; 2. istasyon aynı akımdan ",
                {
                  id: "milvus-migrans",
                  label: "kara çaylakları",
                  type: "species",
                },
                " ve deliceleri ayırmaya çalıştı. Raporda delice türü belirtilmiyor.",
              ],
              type: "p",
            },
            FIGURE_STATION_2,
            {
              parts: [
                "Bu güncellemede türe göre kesin sayılar yok. Burada yalnızca özetleri tekrarlanabilir: iki istasyonda yaklaşık 19.300 kuş, sezonun ilk 10.000 üzeri günü, baskın tür arı şahini. Kara çaylak ve deliceler adı geçiyor, sayı yok.",
              ],
              type: "p",
            },
            FIGURE_KITE,
            {
              parts: [
                "Arı şahini, Buteo cinsindeki şahin değildir. En yakın benzer sayfa ",
                {
                  id: "buteo-buteo",
                  label: "şahin",
                  type: "species",
                },
                " — o da Batumi’den geçer; profilinde arı şahininin ayrı bir takson olduğu açıkça yazılır.",
              ],
              type: "p",
            },
          ],
          heading: "27 Ağustos’ta ne görüldü?",
        },
        {
          blocks: [
            {
              parts: [
                "Batumi Raptor Count, arı şahini sayılarının sonraki hafta zirveye yaklaşmasını bekliyor. Sezon 21 Ekim’e kadar sürer. 27 Ağustos ilk büyük gündür, son değil: günlük toplamlar hâlâ artabilir, tür bileşimi sayım ilerledikçe değişir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Günlük rakamların birincil kaynağı Batumi Raptor Count’tur. Bu sitedeki ",
                { label: "haberler", type: "news-index" },
                " bağlama ekler ve atlas sayfalarına döner — asıl kayıt tür profilidir.",
              ],
              type: "p",
            },
          ],
          heading: "Sırada ne var?",
        },
      ],
      title: "Batumi’de bir günde yaklaşık 19.300 yırtıcı kuş sayıldı",
    },
  },
  gallery: [PHOTO_MESKHIDZE, PHOTO_ELDAKAMAWY, PHOTO_COSENTINO],
  id: "batumi-19300-raptors-2026",
  image: PHOTO_HOEKSTRA,
  publishedAt: "2026-08-27",
  relatedHubIds: ["birds"],
  relatedRegionIds: ["adjara"],
  relatedSpeciesIds: ["pernis-apivorus", "milvus-migrans", "buteo-buteo"],
  slug: "batumi-19300-raptors-2026",
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
  status: "published",
  updatedAt: "2026-09-01",
};
