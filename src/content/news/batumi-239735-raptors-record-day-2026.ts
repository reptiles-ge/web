import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const SOURCE_URL =
  "https://www.batumiraptorcount.org/news/2026/10/second-biggest-day-ever";

const PHOTO_TEAM: NewsPhoto = {
  alt: {
    en: "The Station 2 team celebrating at the count station after the second-biggest day in the count’s history.",
    ka: "მეორე სადგურის გუნდი აღრიცხვის ისტორიაში მეორე ყველაზე დიდი დღის შემდეგ.",
    ru: "Команда второй станции после второго по величине дня в истории учёта.",
    tr: "Sayım tarihinin ikinci en büyük gününün ardından 2. istasyon ekibi.",
  },
  credit: {
    date: "2026-10-04",
    photographer: "Bart Hoekstra",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-239735-hoekstra-station-2.jpg",
};

const PHOTO_KITES: NewsPhoto = {
  alt: {
    en: "Black Kites and an airliner with contrails over the Batumi bottleneck on 4 October.",
    ka: "შავი ძერები და თვითმფრინავი ბათუმის ბოთლის ყელის თავზე, 4 ოქტომბერი.",
    ru: "Чёрные коршуны и самолёт над батумским бутылочным горлышком, 4 октября.",
    tr: "4 Ekim’de Batumi darboğazı üzerinde kara çaylaklar ve bir yolcu uçağı.",
  },
  credit: {
    date: "2026-10-04",
    photographer: "Bart Hoekstra",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-239735-hoekstra-black-kites.jpg",
};

const PHOTO_EAGLES: NewsPhoto = {
  alt: {
    en: "Large eagles and Steppe Buzzards filling a clouded sky over the Batumi bottleneck.",
    ka: "დიდი არწივები და სტეპის კაკაჩები ღრუბლიან ცაზე. ბათუმის ბოთლის ყელი.",
    ru: "Крупные орлы и степные канюки в облачном небе над батумским бутылочным горлышком.",
    tr: "Batumi darboğazında bulutlu gökyüzünü dolduran büyük kartallar ve bozkır şahinleri.",
  },
  credit: {
    date: "2026-10-04",
    photographer: "Bart Hoekstra",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-239735-hoekstra-eagles-buzzards.jpg",
};

const PHOTO_STEPPE_EAGLE: NewsPhoto = {
  alt: {
    en: "A Steppe Eagle from below, one of the species with a new daily record. Photographed earlier in the season.",
    ka: "ველის არწივი ქვემოდან — ერთ-ერთი სახეობა ახალი დღიური რეკორდით. ფოტო სეზონის სხვა დღესაა გადაღებული.",
    ru: "Степной орёл снизу — один из видов с новым дневным рекордом. Снимок сделан в другой день сезона.",
    tr: "Aşağıdan bozkır kartalı — yeni günlük rekor kıran türlerden biri. Fotoğraf sezonun başka bir gününde çekildi.",
  },
  credit: {
    date: "2026-09-17",
    photographer: "Thijmen Stolk",
    url: SOURCE_URL,
  },
  src: "https://cdn.reptiles.ge/news-batumi-239735-stolk-steppe-eagle.jpg",
};

const FIGURE_KITES = { src: PHOTO_KITES.src, type: "figure" as const };
const FIGURE_EAGLES = { src: PHOTO_EAGLES.src, type: "figure" as const };
const FIGURE_STEPPE_EAGLE = {
  src: PHOTO_STEPPE_EAGLE.src,
  type: "figure" as const,
};

export const BATUMI_239735_RAPTORS_RECORD_DAY_2026: NewsArticle = {
  copy: {
    en: {
      dek: "After a week of cold rain, the Batumi bottleneck had its second-biggest day on record. Black Kites and large eagles set new records.",
      lead: "On 4 October 2026, the two stations of Batumi Raptor Count counted 239,735 raptors in a single day in the Batumi bottleneck. It is the second-biggest day in the count’s history. Black Kites set new daily and season records, and three eagle categories set new daily records. The figures come from the organisation’s report — Reptiles.ge did not conduct the count.",
      metaDescription:
        "On 4 October 2026, Batumi Raptor Count counted 239,735 raptors in one day — the second-biggest day on record, with new Black Kite and eagle records.",
      metaTitle: "239,735 raptors in one day at Batumi",
      sections: [
        {
          blocks: [
            {
              parts: [
                "For about a week, the Batumi bottleneck had cold, rainy weather. On 4 October the weather cleared and the birds moved. Across both Batumi Raptor Count stations, 239,735 raptors were counted that day.",
              ],
              type: "p",
            },
            FIGURE_KITES,
            {
              parts: [
                "At Station 1, huge streams of ",
                { id: "milvus-migrans", label: "Black Kites", type: "species" },
                " (",
                { name: "Milvus migrans", type: "sci" },
                ") crossed the sky. At Station 2, large and mostly chaotic streams of Steppe Buzzards (",
                { name: "Buteo buteo vulpinus", type: "sci" },
                ") passed — a subspecies of the ",
                { id: "buteo-buteo", label: "Common buzzard", type: "species" },
                ". Large eagles joined later in the morning. According to the report, the counters worked for hours without a break.",
              ],
              type: "p",
            },
            FIGURE_EAGLES,
            {
              parts: [
                "Batumi Raptor Count published the report on 6 October. Full field notes from both stations are on its ",
                {
                  href: "https://www.batumiraptorcount.org/data?date=20261004",
                  label: "count data page for 4 October",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "What happened on 4 October?",
        },
        {
          blocks: [
            {
              parts: [
                "With 239,735 birds, 4 October is the second-biggest day in Batumi Raptor Count’s history. Four records fell the same day. The Black Kite set both a daily and a season record. Large eagles taken together set a new daily record. Separate daily records were set for the Greater Spotted Eagle (",
                { name: "Clanga clanga", type: "sci" },
                ") and the Steppe Eagle (",
                { name: "Aquila nipalensis", type: "sci" },
                ").",
              ],
              type: "p",
            },
            FIGURE_STEPPE_EAGLE,
            {
              parts: [
                "The report gives no species totals. This article repeats only that the records were broken, not by how many birds.",
              ],
              type: "p",
            },
            {
              parts: [
                "The biggest day remains 2 October 2014, with 264,891 raptors. Batumi Raptor Count then described it as the largest passage of raptors ever recorded outside the Pan-American flyway.",
              ],
              type: "p",
            },
          ],
          heading: "Which records were broken?",
        },
        {
          blocks: [
            {
              parts: [
                "In autumn, raptors heading for Africa follow the eastern Black Sea coast. In ",
                { id: "adjara", label: "Adjara", type: "region" },
                ", north of Batumi, sea and mountains squeeze that route into a narrow corridor. This is the Batumi bottleneck: many birds cross the same sky, so they can be counted from two stations.",
              ],
              type: "p",
            },
            {
              parts: [
                "According to Batumi Raptor Count, more than a million migrating raptors pass through the bottleneck every autumn. On this atlas the count sites appear as Sakhalvasho and Shuamta on the profiles of species that pass through in autumn. More species from the corridor are on the ",
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
                "The 2026 autumn count began on 12 August and runs until 21 October. It is Batumi Raptor Count’s 18th autumn count. Its 27 September report says a day of 54,406 birds took the season total past one million.",
              ],
              type: "p",
            },
            {
              parts: [
                "There is no final season total yet. The count is still running, and daily totals and the species mix may still change. Earlier reports from the corridor are in ",
                { label: "News", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "The season is not over",
        },
      ],
      title: "239,735 raptors in one day at Batumi: new Black Kite and eagle records",
    },
    ka: {
      dek: "ერთკვირიანი ცივი წვიმის შემდეგ ბათუმის ბოთლის ყელმა ისტორიაში მეორე ყველაზე დიდი დღე დააფიქსირა. შავმა ძერამ და დიდმა არწივებმა ახალი რეკორდები დაამყარეს.",
      lead: "2026 წლის 4 ოქტომბერს Batumi Raptor Count-ის ორმა სადგურმა ბათუმის ბოთლის ყელში ერთ დღეში 239 735 მტაცებელი ფრინველი დაითვალა. ეს აღრიცხვის ისტორიაში მეორე ყველაზე დიდი დღეა. შავმა ძერამ დღიური და სეზონური რეკორდი განაახლა, არწივების სამ კატეგორიაში კი ახალი დღიური რეკორდი დაფიქსირდა. ციფრები ორგანიზაციის ანგარიშიდანაა — აღრიცხვა Reptiles.ge-ს არ ჩაუტარებია.",
      metaDescription:
        "2026 წლის 4 ოქტომბერს Batumi Raptor Count-მა ერთ დღეში 239 735 მტაცებელი დაითვალა. ეს მეორე ყველაზე დიდი დღეა, შავი ძერისა და არწივების ახალი რეკორდებით.",
      metaTitle: "ბათუმში ერთ დღეში 239 735 მტაცებელი ფრინველი დაითვალეს",
      sections: [
        {
          blocks: [
            {
              parts: [
                "დაახლოებით ერთი კვირა ბათუმის დერეფანში ცივი და წვიმიანი ამინდი იდგა. 4 ოქტომბერს ამინდი გამოსწორდა და ფრინველები დაიძრნენ. Batumi Raptor Count-ის ორივე სადგურზე იმ დღეს ჯამში 239 735 მტაცებელი დაითვალეს.",
              ],
              type: "p",
            },
            FIGURE_KITES,
            {
              parts: [
                "პირველ სადგურზე ცას ",
                { id: "milvus-migrans", label: "შავი ძერის", type: "species" },
                " (",
                { name: "Milvus migrans", type: "sci" },
                ") უზარმაზარი ნაკადები კვეთდა. მეორე სადგურზე სტეპის კაკაჩის (",
                { name: "Buteo buteo vulpinus", type: "sci" },
                ") დიდი და უმეტესად ქაოსური ნაკადები მიდიოდა. ეს ",
                {
                  id: "buteo-buteo",
                  label: "ჩვეულებრივი კაკაჩის",
                  type: "species",
                },
                " ქვესახეობაა. დილის მეორე ნახევარში დიდი არწივებიც გამოჩნდნენ. ანგარიშის მიხედვით, აღმწერები საათობით, შესვენების გარეშე ითვლიდნენ.",
              ],
              type: "p",
            },
            FIGURE_EAGLES,
            {
              parts: [
                "Batumi Raptor Count-მა ანგარიში 6 ოქტომბერს გამოაქვეყნა. ორივე სადგურის საველე ჩანაწერები სრულად დევს ",
                {
                  href: "https://www.batumiraptorcount.org/data?date=20261004",
                  label: "4 ოქტომბრის მონაცემების გვერდზე",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რა მოხდა 4 ოქტომბერს?",
        },
        {
          blocks: [
            {
              parts: [
                "239 735 ფრინველით 4 ოქტომბერი Batumi Raptor Count-ის ისტორიაში მეორე ყველაზე დიდი დღეა. იმავე დღეს ოთხი რეკორდი დაიმხო. შავმა ძერამ ერთდროულად დღიური და სეზონური რეკორდი განაახლა. დიდი არწივების ჯამურმა რიცხვმა ახალი დღიური რეკორდი დაამყარა. ცალკე დღიური რეკორდი დაფიქსირდა დიდ მყივან არწივზე (",
                { name: "Clanga clanga", type: "sci" },
                ") და ველის არწივზე (",
                { name: "Aquila nipalensis", type: "sci" },
                ").",
              ],
              type: "p",
            },
            FIGURE_STEPPE_EAGLE,
            {
              parts: [
                "ანგარიშში სახეობრივი რიცხვები არ არის დასახელებული. ამიტომ აქ მხოლოდ ის მეორდება, რომ რეკორდები დაიმხო — და არა ის, რამდენი ფრინველით.",
              ],
              type: "p",
            },
            {
              parts: [
                "უდიდეს დღედ კვლავ 2014 წლის 2 ოქტომბერი რჩება, 264 891 მტაცებლით. Batumi Raptor Count-მა მაშინ დაწერა, რომ ეს იყო მტაცებლების ყველაზე დიდი გადაფრენა, რაც ოდესმე დაფიქსირებულა პანამერიკული მიგრაციული გზის გარეთ.",
              ],
              type: "p",
            },
          ],
          heading: "რომელი რეკორდები დაიმხო?",
        },
        {
          blocks: [
            {
              parts: [
                "შემოდგომით აფრიკისკენ მიმავალი მტაცებელი ფრინველები შავი ზღვის აღმოსავლეთ სანაპიროს მიუყვებიან. ",
                { id: "adjara", label: "აჭარაში", type: "region" },
                ", ბათუმის ჩრდილოეთით, ზღვა და მთები ამ გზას ვიწრო დერეფნად კუმშავენ. ეს არის ბათუმის ბოთლის ყელი: ბევრი ფრინველი ერთსა და იმავე ცას კვეთს, ამიტომ მათი დათვლა ორი სადგურიდან შეიძლება.",
              ],
              type: "p",
            },
            {
              parts: [
                "Batumi Raptor Count-ის მონაცემებით, ბოთლის ყელში ყოველ შემოდგომას მილიონზე მეტი მიგრირებადი მტაცებელი გადის. ატლასში აღრიცხვის წერტილები სახალვაშოდ და შუამთად ჩანს იმ სახეობების პროფილებზე, რომლებიც აქ შემოდგომით გადიან. დერეფნის სხვა სახეობები ",
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
                "2026 წლის შემოდგომის აღრიცხვა 12 აგვისტოს დაიწყო და 21 ოქტომბრამდე გრძელდება. ეს Batumi Raptor Count-ის მე-18 შემოდგომის აღრიცხვაა. 27 სექტემბრის ანგარიშის მიხედვით, 54 406-ფრინველიანმა დღემ სეზონის ჯამი მილიონს გადააცილა.",
              ],
              type: "p",
            },
            {
              parts: [
                "სეზონის საბოლოო ჯამი ჯერ არ არსებობს. თვლა ისევ მიმდინარეობს, დღიური ჯამები და სახეობრივი სურათი კი შეიძლება შეიცვალოს. დერეფნის წინა ანგარიშები ",
                { label: "სიახლეებშია", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "სეზონი ჯერ არ დასრულებულა",
        },
      ],
      title:
        "ბათუმში დღეში 239 735 მტაცებელი: შავი ძერისა და არწივების რეკორდები",
    },
    ru: {
      dek: "После недели холодных дождей батумское бутылочное горлышко зафиксировало второй по величине день в истории учёта. Чёрный коршун и крупные орлы установили новые рекорды.",
      lead: "4 октября 2026 года две станции Batumi Raptor Count насчитали в батумском бутылочном горлышке 239 735 хищных птиц за один день. Это второй по величине день в истории учёта. Чёрный коршун обновил дневной и сезонный рекорды, ещё в трёх категориях орлов установлены новые дневные рекорды. Цифры взяты из отчёта организации — Reptiles.ge подсчёт не вёл.",
      metaDescription:
        "4 октября 2026 года Batumi Raptor Count насчитал 239 735 хищных птиц за день. Это второй по величине день, с новыми рекордами чёрного коршуна и орлов.",
      metaTitle: "В Батуми за один день насчитали 239 735 хищных птиц",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Около недели в батумском коридоре стояла холодная дождливая погода. 4 октября погода наладилась, и птицы двинулись. На обеих станциях Batumi Raptor Count в тот день насчитали в сумме 239 735 хищных птиц.",
              ],
              type: "p",
            },
            FIGURE_KITES,
            {
              parts: [
                "Над первой станцией шли огромные потоки ",
                {
                  id: "milvus-migrans",
                  label: "чёрного коршуна",
                  type: "species",
                },
                " (",
                { name: "Milvus migrans", type: "sci" },
                "). Над второй — большие, в основном хаотичные потоки степного канюка (",
                { name: "Buteo buteo vulpinus", type: "sci" },
                "), подвида ",
                {
                  id: "buteo-buteo",
                  label: "обыкновенного канюка",
                  type: "species",
                },
                ". Ближе к полудню появились и крупные орлы. По отчёту, учётчики работали часами без перерыва.",
              ],
              type: "p",
            },
            FIGURE_EAGLES,
            {
              parts: [
                "Batumi Raptor Count опубликовал отчёт 6 октября. Полные полевые записи обеих станций — на ",
                {
                  href: "https://www.batumiraptorcount.org/data?date=20261004",
                  label: "странице данных за 4 октября",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Что произошло 4 октября?",
        },
        {
          blocks: [
            {
              parts: [
                "С 239 735 птицами 4 октября стало вторым по величине днём в истории Batumi Raptor Count. В тот же день пали четыре рекорда. Чёрный коршун обновил сразу дневной и сезонный рекорды. Крупные орлы в сумме установили новый дневной рекорд. Отдельные дневные рекорды зафиксированы у большого подорлика (",
                { name: "Clanga clanga", type: "sci" },
                ") и степного орла (",
                { name: "Aquila nipalensis", type: "sci" },
                ").",
              ],
              type: "p",
            },
            FIGURE_STEPPE_EAGLE,
            {
              parts: [
                "Численность по видам в отчёте не приводится. Поэтому здесь сказано только, что рекорды побиты, — но не сколькими птицами.",
              ],
              type: "p",
            },
            {
              parts: [
                "Крупнейшим днём остаётся 2 октября 2014 года: 264 891 хищная птица. Batumi Raptor Count тогда назвал его крупнейшим пролётом хищных птиц, когда-либо зарегистрированным за пределами Панамериканского пролётного пути.",
              ],
              type: "p",
            },
          ],
          heading: "Какие рекорды побиты?",
        },
        {
          blocks: [
            {
              parts: [
                "Осенью хищные птицы на пути в Африку следуют вдоль восточного побережья Чёрного моря. В ",
                { id: "adjara", label: "Аджарии", type: "region" },
                ", к северу от Батуми, море и горы сжимают этот путь в узкий коридор. Это батумское бутылочное горлышко: много птиц пересекает одно и то же небо, поэтому их можно считать с двух станций.",
              ],
              type: "p",
            },
            {
              parts: [
                "По данным Batumi Raptor Count, каждую осень через горлышко проходит более миллиона мигрирующих хищных птиц. В атласе точки учёта — Сахалвашо и Шуамта — указаны в профилях видов, которые проходят здесь осенью. Другие виды коридора — на ",
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
                "Осенний учёт 2026 года начался 12 августа и продлится до 21 октября. Это 18-й осенний учёт Batumi Raptor Count. По отчёту от 27 сентября, день с 54 406 птицами вывел сумму сезона за миллион.",
              ],
              type: "p",
            },
            {
              parts: [
                "Итоговой суммы сезона пока нет. Учёт продолжается, дневные суммы и видовой состав ещё могут измениться. Прежние отчёты из коридора — в ",
                { label: "новостях", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Сезон ещё не закончен",
        },
      ],
      title:
        "239 735 хищных птиц за день в Батуми: рекорды чёрного коршуна и орлов",
    },
    tr: {
      dek: "Bir haftalık soğuk yağmurların ardından Batumi darboğazı, sayım tarihinin ikinci en büyük gününü kaydetti. Kara çaylak ve büyük kartallar yeni rekorlar kırdı.",
      lead: "4 Ekim 2026’da Batumi Raptor Count’un iki istasyonu, Batumi darboğazında tek bir günde 239.735 yırtıcı kuş saydı. Bu, sayım tarihinin ikinci en büyük günü. Kara çaylak günlük ve sezon rekorlarını yeniledi, üç kartal kategorisinde de yeni günlük rekorlar kırıldı. Sayılar örgütün raporundan — sayımı Reptiles.ge yapmadı.",
      metaDescription:
        "4 Ekim 2026’da Batumi Raptor Count bir günde 239.735 yırtıcı kuş saydı. Bu, kara çaylak ve kartal rekorlarıyla tarihin ikinci en büyük günü.",
      metaTitle: "Batumi’de bir günde 239.735 yırtıcı kuş sayıldı",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Batumi koridorunda yaklaşık bir hafta boyunca soğuk ve yağmurlu hava hâkimdi. 4 Ekim’de hava açtı ve kuşlar harekete geçti. O gün Batumi Raptor Count’un iki istasyonunda toplam 239.735 yırtıcı kuş sayıldı.",
              ],
              type: "p",
            },
            FIGURE_KITES,
            {
              parts: [
                "1. istasyonun üzerinden ",
                { id: "milvus-migrans", label: "kara çaylağın", type: "species" },
                " (",
                { name: "Milvus migrans", type: "sci" },
                ") devasa akımları geçti. 2. istasyonda ise ",
                { id: "buteo-buteo", label: "şahinin", type: "species" },
                " bir alt türü olan bozkır şahininin (",
                { name: "Buteo buteo vulpinus", type: "sci" },
                ") büyük ve çoğunlukla düzensiz akımları vardı. Sabahın ilerleyen saatlerinde büyük kartallar da göründü. Rapora göre sayımcılar saatlerce ara vermeden çalıştı.",
              ],
              type: "p",
            },
            FIGURE_EAGLES,
            {
              parts: [
                "Batumi Raptor Count raporu 6 Ekim’de yayımladı. İki istasyonun tüm saha notları ",
                {
                  href: "https://www.batumiraptorcount.org/data?date=20261004",
                  label: "4 Ekim sayım verileri sayfasında",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "4 Ekim’de ne oldu?",
        },
        {
          blocks: [
            {
              parts: [
                "239.735 kuşla 4 Ekim, Batumi Raptor Count tarihinin ikinci en büyük günü oldu. Aynı gün dört rekor kırıldı. Kara çaylak hem günlük hem sezon rekorunu yeniledi. Büyük kartalların toplamı yeni bir günlük rekor kırdı. Büyük orman kartalı (",
                { name: "Clanga clanga", type: "sci" },
                ") ve bozkır kartalı (",
                { name: "Aquila nipalensis", type: "sci" },
                ") için de ayrı günlük rekorlar kaydedildi.",
              ],
              type: "p",
            },
            FIGURE_STEPPE_EAGLE,
            {
              parts: [
                "Raporda türlere göre sayılar yok. Bu yüzden burada yalnızca rekorların kırıldığı yazılıyor — kaç kuşla kırıldığı değil.",
              ],
              type: "p",
            },
            {
              parts: [
                "En büyük gün hâlâ 264.891 yırtıcıyla 2 Ekim 2014. Batumi Raptor Count o günü, Pan-Amerikan göç yolu dışında kaydedilmiş en büyük yırtıcı kuş geçişi olarak tanımlamıştı.",
              ],
              type: "p",
            },
          ],
          heading: "Hangi rekorlar kırıldı?",
        },
        {
          blocks: [
            {
              parts: [
                "Sonbaharda Afrika’ya giden yırtıcı kuşlar Karadeniz’in doğu kıyısını izler. ",
                { id: "adjara", label: "Acara’da", type: "region" },
                ", Batumi’nin kuzeyinde deniz ile dağlar bu yolu dar bir koridora sıkıştırır. Batumi darboğazı budur: birçok kuş aynı gökyüzünü geçer, bu yüzden iki istasyondan sayılabilir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Batumi Raptor Count’a göre darboğazdan her sonbahar bir milyondan fazla göçmen yırtıcı kuş geçer. Atlas’ta sayım noktaları, sonbaharda buradan geçen türlerin profillerinde Sakhalvasho ve Şuamta olarak yer alır. Koridorun diğer türleri ",
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
                "2026 sonbahar sayımı 12 Ağustos’ta başladı ve 21 Ekim’e kadar sürüyor. Bu, Batumi Raptor Count’un 18. sonbahar sayımı. 27 Eylül raporuna göre 54.406 kuşluk bir gün sezon toplamını bir milyonun üzerine taşıdı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Henüz kesin bir sezon toplamı yok. Sayım sürüyor; günlük toplamlar ve tür bileşimi hâlâ değişebilir. Koridordan önceki raporlar ",
                { label: "haberlerde", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Sezon henüz bitmedi",
        },
      ],
      title: "Batumi’de bir günde 239.735 yırtıcı: kara çaylak ve kartal rekorları",
    },
  },
  gallery: [PHOTO_KITES, PHOTO_EAGLES, PHOTO_STEPPE_EAGLE],
  id: "batumi-239735-raptors-record-day-2026",
  image: PHOTO_TEAM,
  publishedAt: "2026-10-14",
  relatedHubIds: ["birds"],
  relatedRegionIds: ["adjara"],
  relatedSpeciesIds: ["milvus-migrans", "buteo-buteo"],
  slug: "batumi-239735-raptors-record-day-2026",
  sources: [
    {
      name: "Batumi Raptor Count — Batumi’s second biggest day ever",
      url: SOURCE_URL,
    },
    {
      name: "Batumi Raptor Count — Count data, 4 October 2026",
      url: "https://www.batumiraptorcount.org/data?date=20261004",
    },
    {
      name: "Batumi Raptor Count — One million raptors counted",
      url: "https://www.batumiraptorcount.org/news/2026/9/one-million-raptors-counted",
    },
    {
      name: "Batumi Raptor Count — African-Eurasian day record from Batumi: 264,891 raptors",
      url: "https://www.batumiraptorcount.org/news/2014/10/african-eurasian-day-record-from-batumi-264891-raptors",
    },
    {
      name: "Batumi Raptor Count — Call for counters, autumn 2026",
      url: "https://www.batumiraptorcount.org/news/2026/4/call-for-counters-2026",
    },
  ],
  status: "published",
};
