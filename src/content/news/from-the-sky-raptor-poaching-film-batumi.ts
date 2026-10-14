import type { NewsArticle } from "@/data/newsTypes";

const BRC_FILM_URL = "https://batumiraptorcount.org/news/2026/10/from-the-sky-ffi";
const FFI_PROJECT_URL =
  "https://www.fauna-flora.org/projects/conserving-migrating-raptors-western-georgia/";
const BRC_BIG_DAY_URL =
  "https://batumiraptorcount.org/news/2026/10/second-biggest-day-ever";
const BRC_WORLDS_COLLIDE_URL =
  "https://batumiraptorcount.org/news/2022/2/worlds-collide";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=FP8WVNBIVIE";

export const FROM_THE_SKY_RAPTOR_POACHING_FILM_BATUMI: NewsArticle = {
  copy: {
    en: {
      dek: "A short Fauna & Flora documentary follows the people working to end raptor poaching in the Batumi bottleneck. It is available in English and Georgian.",
      lead: "Fauna & Flora has released From the Sky, a short documentary about the raptor poaching crisis in Georgia and the people trying to change it. Batumi Raptor Count shared the film on 10 October 2026. It is available in English and Georgian.",
      metaDescription:
        "From the Sky, a short Fauna & Flora documentary, follows the conservationists and Georgian falconers working to end raptor poaching in the Batumi bottleneck.",
      metaTitle: "From the Sky: a film on raptor poaching at Batumi",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The film follows local conservationist Gizo Seskuria through the Batumi bottleneck, the narrow migration corridor between the sea and the mountains, and through the communities that share this landscape with the autumn migration.",
              ],
              type: "p",
            },
            {
              parts: [
                "Many scenes were filmed at the Batumi Raptor Count stations, where migrating raptors are counted every autumn.",
              ],
              type: "p",
            },
            {
              parts: [
                "Fauna & Flora made the film with Georgian colleagues and young falconers. The falconers work with the support of the organisation’s ",
                {
                  href: FFI_PROJECT_URL,
                  label: "raptor conservation programme in western Georgia",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "What does the film show?",
        },
        {
          blocks: [
            {
              parts: [
                "A central thread of the film is Georgian falconers, who hunt with birds of prey and also work to stop poaching.",
              ],
              type: "p",
            },
            {
              parts: [
                "The film shows how local knowledge and tradition can become part of protecting birds, while keeping falconry itself safe and sustainable. Falconry is presented as part of the solution, not as the source of the problem.",
              ],
              type: "p",
            },
            {
              parts: [
                "The intended audience reflects that approach: local hunting communities, the Georgian public, and viewers abroad. That is why the film exists in both English and Georgian.",
              ],
              type: "p",
            },
          ],
          heading: "Falconers as allies",
        },
        {
          blocks: [
            {
              parts: [
                "The Batumi bottleneck is one of the key points on the raptor migration route. Each autumn, more than a million raptors pass through it. What happens here, both poaching and the work to stop it, affects birds from a far wider area than ",
                { id: "adjara", label: "Adjara", type: "region" },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "One day this season shows the scale: on 4 October 2026, 239,735 raptors were counted at Batumi, ",
                {
                  href: BRC_BIG_DAY_URL,
                  label: "the second-biggest day in Batumi Raptor Count history",
                  type: "external",
                },
                ". Profiles of the migrants that pass the corridor are on the ",
                { id: "birds", label: "birds hub", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Why Batumi matters",
        },
        {
          blocks: [
            {
              parts: [
                "The film is on YouTube: ",
                {
                  href: YOUTUBE_URL,
                  label: "From the Sky on YouTube",
                  type: "external",
                },
                ". It was released in English and Georgian.",
              ],
              type: "p",
            },
            {
              parts: [
                "For more context, Batumi Raptor Count also points to an earlier film, ",
                {
                  href: BRC_WORLDS_COLLIDE_URL,
                  label: "Worlds Collide",
                  type: "external",
                },
                " (directed by Nicholas Rodd), about the migration, falconers and conservationists. More reports from the corridor are in ",
                { label: "News", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Where to watch",
        },
      ],
      title: "From the Sky: a new film on raptor poaching at Batumi",
    },
    ka: {
      dek: "Fauna & Flora-ს მოკლემეტრაჟიანი დოკუმენტური ფილმი ბათუმის დერეფანში მტაცებელ ფრინველებზე ბრაკონიერობასა და მის აღკვეთაზე მომუშავე ადამიანებზე მოგვითხრობს. ფილმი ქართულ ენაზეც არის ხელმისაწვდომი.",
      lead: "Fauna & Flora-მ მოკლემეტრაჟიანი დოკუმენტური ფილმი „From the Sky“ („ციდან“) გამოუშვა. ფილმი საქართველოში მტაცებელ ფრინველებზე ბრაკონიერობის კრიზისსა და იმ ადამიანებზე მოგვითხრობს, ვინც ამის შეცვლას ცდილობს. Batumi Raptor Count-მა ის 2026 წლის 10 ოქტომბერს გააზიარა. ფილმი ინგლისურ და ქართულ ენებზეა ხელმისაწვდომი.",
      metaDescription:
        "Fauna & Flora-ს ფილმი „ციდან“ ბათუმის დერეფანში მტაცებლებზე ბრაკონიერობასა და მის აღკვეთაზე მომუშავე კონსერვაციონისტებსა და მიმინოსნებზე მოგვითხრობს.",
      metaTitle: "„ციდან“: ფილმი მტაცებლებზე ბრაკონიერობის შესახებ",
      sections: [
        {
          blocks: [
            {
              parts: [
                "ფილმი ადგილობრივ კონსერვაციონისტს, გიზო სესკურიას მიჰყვება. გადაღებები ბათუმის ბოთლის ყელში, ზღვასა და მთებს შორის მოქცეულ ვიწრო მიგრაციულ დერეფანში მიმდინარეობდა. კამერა იმ თემებშიც შედის, რომლებიც ამ ლანდშაფტს შემოდგომის მიგრაციასთან ერთად იზიარებენ.",
              ],
              type: "p",
            },
            {
              parts: [
                "ბევრი სცენა Batumi Raptor Count-ის აღრიცხვის სადგურებზეა გადაღებული, იქ, სადაც ყოველ შემოდგომას მიგრირებად მტაცებლებს ითვლიან.",
              ],
              type: "p",
            },
            {
              parts: [
                "ფილმი Fauna & Flora-მ ქართველ კოლეგებთან და ახალგაზრდა მიმინოსნებთან ერთად გადაიღო. ეს უკანასკნელნი დასავლეთ საქართველოში ორგანიზაციის ",
                {
                  href: FFI_PROJECT_URL,
                  label: "მტაცებელი ფრინველების დაცვის პროგრამის",
                  type: "external",
                },
                " მხარდაჭერით მუშაობენ.",
              ],
              type: "p",
            },
          ],
          heading: "რას გვიჩვენებს ფილმი",
        },
        {
          blocks: [
            {
              parts: [
                "ფილმის ერთ-ერთი მთავარი აქცენტი ქართველი მიმინოსნები არიან: ადამიანები, რომლებიც მტაცებელი ფრინველებით ნადირობის ტრადიციას აგრძელებენ და ამავდროულად ბრაკონიერობის აღკვეთაზე მუშაობენ.",
              ],
              type: "p",
            },
            {
              parts: [
                "ფილმი აჩვენებს, როგორ შეიძლება ადგილობრივი ცოდნა და ტრადიცია ფრინველების დაცვის ნაწილად იქცეს, თან ისე, რომ თავად მიმინოსნობა უსაფრთხო და მდგრადი დარჩეს. მიმინოსნობა აქ პრობლემის წყაროდ კი არ არის წარმოდგენილი, არამედ გადაწყვეტის ნაწილად.",
              ],
              type: "p",
            },
            {
              parts: [
                "ამავე მიდგომას ასახავს ფილმის აუდიტორიაც: ის ადგილობრივ მონადირე თემებს, ქართულ საზოგადოებასა და საერთაშორისო მაყურებელს მიმართავს. ამიტომ ფილმი ორ ენაზე, ინგლისურად და ქართულად, გამოვიდა.",
              ],
              type: "p",
            },
          ],
          heading: "მიმინოსნები, როგორც მოკავშირეები",
        },
        {
          blocks: [
            {
              parts: [
                "ბათუმის ბოთლის ყელი მტაცებელი ფრინველების მიგრაციის ერთ-ერთი მთავარი წერტილია. ყოველ შემოდგომას აქ მილიონზე მეტი მტაცებელი გადის. ამიტომ ის, რაც ამ დერეფანში ხდება, ბრაკონიერობაც და მისი აღკვეთაც, ფრინველებს ",
                { id: "adjara", label: "აჭარაზე", type: "region" },
                " გაცილებით ფართო არეალიდან ეხება.",
              ],
              type: "p",
            },
            {
              parts: [
                "მასშტაბს ამ სეზონის ერთი დღეც აჩვენებს: 2026 წლის 4 ოქტომბერს ბათუმში 239 735 მტაცებელი დაითვალეს. ეს ",
                {
                  href: BRC_BIG_DAY_URL,
                  label: "Batumi Raptor Count-ის ისტორიაში მეორე ყველაზე დიდი დღე",
                  type: "external",
                },
                " იყო. დერეფანში გამავალი მიგრანტების პროფილები ",
                { id: "birds", label: "ფრინველების ჰაბზეა", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რატომ არის ბათუმი გადამწყვეტი",
        },
        {
          blocks: [
            {
              parts: [
                "ფილმი YouTube-ზეა ხელმისაწვდომი: ",
                {
                  href: YOUTUBE_URL,
                  label: "„From the Sky“ YouTube-ზე",
                  type: "external",
                },
                ". ის ინგლისურ და ქართულ ენებზე გამოვიდა, ამიტომ ქართველ მაყურებელს მისი მშობლიურ ენაზე ნახვა შეუძლია.",
              ],
              type: "p",
            },
            {
              parts: [
                "კონტექსტისთვის Batumi Raptor Count ადრინდელ ფილმსაც ასახელებს: ",
                {
                  href: BRC_WORLDS_COLLIDE_URL,
                  label: "„Worlds Collide“",
                  type: "external",
                },
                " (რეჟ. Nicholas Rodd), რომელიც მიგრაციას, მიმინოსნებსა და კონსერვაციონისტებს ეხება. დერეფნის სხვა ამბები ",
                { label: "სიახლეებშია", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "სად ვუყუროთ",
        },
      ],
      title: "„ციდან“: ახალი ფილმი ბათუმში მტაცებლებზე ბრაკონიერობის შესახებ",
    },
    ru: {
      dek: "Короткий документальный фильм Fauna & Flora рассказывает о людях, которые борются с браконьерством на хищных птиц в батумском коридоре. Фильм доступен на английском и грузинском.",
      lead: "Fauna & Flora выпустила короткий документальный фильм «From the Sky» («С неба») о кризисе браконьерства на хищных птиц в Грузии и о людях, которые пытаются это изменить. Batumi Raptor Count поделился фильмом 10 октября 2026 года. Он доступен на английском и грузинском языках.",
      metaDescription:
        "Фильм Fauna & Flora «From the Sky» рассказывает о природоохранниках и грузинских сокольниках, которые борются с браконьерством в батумском коридоре.",
      metaTitle: "«From the Sky»: фильм о браконьерстве в Батуми",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Фильм следует за местным природоохранником Гизо Сескурией по батумскому «бутылочному горлышку», узкому миграционному коридору между морем и горами, и по общинам, которые делят этот ландшафт с осенней миграцией.",
              ],
              type: "p",
            },
            {
              parts: [
                "Многие сцены сняты на станциях Batumi Raptor Count, где каждую осень считают мигрирующих хищных птиц.",
              ],
              type: "p",
            },
            {
              parts: [
                "Fauna & Flora сняла фильм вместе с грузинскими коллегами и молодыми сокольниками. Сокольники работают при поддержке ",
                {
                  href: FFI_PROJECT_URL,
                  label: "программы организации по охране хищных птиц в Западной Грузии",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Что показывает фильм",
        },
        {
          blocks: [
            {
              parts: [
                "Важная линия фильма — грузинские сокольники, которые охотятся с хищными птицами и при этом работают над прекращением браконьерства.",
              ],
              type: "p",
            },
            {
              parts: [
                "Фильм показывает, как местные знания и традиции могут стать частью охраны птиц, а сама соколиная охота при этом остаётся безопасной и устойчивой. Соколиная охота здесь не источник проблемы, а часть решения.",
              ],
              type: "p",
            },
            {
              parts: [
                "Тот же подход отражает аудитория фильма: местные охотничьи общины, грузинское общество и зрители за рубежом. Поэтому фильм вышел на двух языках, английском и грузинском.",
              ],
              type: "p",
            },
          ],
          heading: "Сокольники как союзники",
        },
        {
          blocks: [
            {
              parts: [
                "Батумское «бутылочное горлышко» — одна из ключевых точек миграции хищных птиц. Каждую осень через него проходит больше миллиона хищников. Поэтому то, что происходит в этом коридоре, и браконьерство, и борьба с ним, касается птиц с гораздо более широкой территории, чем ",
                { id: "adjara", label: "Аджария", type: "region" },
                ".",
              ],
              type: "p",
            },
            {
              parts: [
                "Масштаб показывает один день этого сезона: 4 октября 2026 года в Батуми насчитали 239 735 хищных птиц. Это ",
                {
                  href: BRC_BIG_DAY_URL,
                  label: "второй по величине день в истории Batumi Raptor Count",
                  type: "external",
                },
                ". Профили мигрантов, проходящих через коридор, — на ",
                { id: "birds", label: "странице птиц", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Почему Батуми так важен",
        },
        {
          blocks: [
            {
              parts: [
                "Фильм доступен на YouTube: ",
                {
                  href: YOUTUBE_URL,
                  label: "«From the Sky» на YouTube",
                  type: "external",
                },
                ". Он вышел на английском и грузинском языках.",
              ],
              type: "p",
            },
            {
              parts: [
                "Для контекста Batumi Raptor Count также называет более ранний фильм ",
                {
                  href: BRC_WORLDS_COLLIDE_URL,
                  label: "«Worlds Collide»",
                  type: "external",
                },
                " (режиссёр Nicholas Rodd) о миграции, сокольниках и природоохранниках. Другие материалы о коридоре — в разделе ",
                { label: "Новости", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Где смотреть",
        },
      ],
      title: "«From the Sky»: новый фильм о браконьерстве на хищных птиц в Батуми",
    },
    tr: {
      dek: "Fauna & Flora’nın kısa belgeseli, Batum darboğazında yırtıcı kuş kaçak avcılığını durdurmaya çalışan insanları anlatıyor. Film İngilizce ve Gürcüce olarak izlenebiliyor.",
      lead: "Fauna & Flora, Gürcistan’daki yırtıcı kuş kaçak avcılığı krizini ve bunu değiştirmeye çalışan insanları anlatan kısa belgesel From the Sky’ı (Gökyüzünden) yayımladı. Batumi Raptor Count filmi 10 Ekim 2026’da paylaştı. Film İngilizce ve Gürcüce olarak izlenebiliyor.",
      metaDescription:
        "Fauna & Flora’nın kısa belgeseli From the Sky, Batum darboğazında kaçak avcılığı durdurmaya çalışan koruma uzmanlarını ve Gürcü doğancıları anlatıyor.",
      metaTitle: "From the Sky: Batum’da yırtıcı kuş kaçak avcılığı filmi",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Film, yerel doğa koruma uzmanı Gizo Seskuria’yı Batum darboğazında, deniz ile dağlar arasındaki dar göç koridorunda ve bu manzarayı sonbahar göçüyle paylaşan topluluklarda izliyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Sahnelerin çoğu, her sonbahar göçmen yırtıcı kuşların sayıldığı Batumi Raptor Count istasyonlarında çekildi.",
              ],
              type: "p",
            },
            {
              parts: [
                "Fauna & Flora filmi Gürcü meslektaşları ve genç doğancılarla birlikte çekti. Doğancılar, kuruluşun ",
                {
                  href: FFI_PROJECT_URL,
                  label: "Batı Gürcistan’daki yırtıcı kuş koruma programının",
                  type: "external",
                },
                " desteğiyle çalışıyor.",
              ],
              type: "p",
            },
          ],
          heading: "Film neyi gösteriyor?",
        },
        {
          blocks: [
            {
              parts: [
                "Filmin ana eksenlerinden biri, yırtıcı kuşlarla avlanan ve aynı zamanda kaçak avcılığı durdurmak için çalışan Gürcü doğancılar.",
              ],
              type: "p",
            },
            {
              parts: [
                "Film, yerel bilginin ve geleneğin kuşları korumanın bir parçası olabileceğini, doğancılığın ise güvenli ve sürdürülebilir kalabileceğini gösteriyor. Doğancılık burada sorunun kaynağı olarak değil, çözümün parçası olarak ele alınıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Filmin hedef kitlesi de bu yaklaşımı yansıtıyor: yerel avcı toplulukları, Gürcistan kamuoyu ve uluslararası izleyiciler. Bu yüzden film iki dilde, İngilizce ve Gürcüce olarak yayımlandı.",
              ],
              type: "p",
            },
          ],
          heading: "Müttefik olarak doğancılar",
        },
        {
          blocks: [
            {
              parts: [
                "Batum darboğazı, yırtıcı kuş göçünün kilit noktalarından biri. Her sonbahar buradan bir milyondan fazla yırtıcı kuş geçiyor. Bu yüzden koridorda olanlar, hem kaçak avcılık hem de onu durdurma çabası, ",
                { id: "adjara", label: "Acara’dan", type: "region" },
                " çok daha geniş bir alandan gelen kuşları etkiliyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Bu sezonun bir günü ölçeği gösteriyor: 4 Ekim 2026’da Batum’da 239.735 yırtıcı kuş sayıldı. Bu, ",
                {
                  href: BRC_BIG_DAY_URL,
                  label: "Batumi Raptor Count tarihinin en büyük ikinci günüydü",
                  type: "external",
                },
                ". Koridordan geçen göçmenlerin profilleri ",
                { id: "birds", label: "kuşlar sayfasında", type: "hub" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Batum neden bu kadar önemli?",
        },
        {
          blocks: [
            {
              parts: [
                "Film YouTube’da izlenebiliyor: ",
                {
                  href: YOUTUBE_URL,
                  label: "YouTube’da From the Sky",
                  type: "external",
                },
                ". İngilizce ve Gürcüce olarak yayımlandı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Daha fazla bağlam için Batumi Raptor Count, göçü, doğancıları ve doğa koruma uzmanlarını anlatan daha önceki ",
                {
                  href: BRC_WORLDS_COLLIDE_URL,
                  label: "Worlds Collide",
                  type: "external",
                },
                " filmini de (yönetmen Nicholas Rodd) öneriyor. Koridordan diğer haberler ",
                { label: "Haberler", type: "news-index" },
                " bölümünde.",
              ],
              type: "p",
            },
          ],
          heading: "Nerede izlenir?",
        },
      ],
      title: "From the Sky: Batum’da yırtıcı kuş kaçak avcılığına dair yeni film",
    },
  },
  id: "from-the-sky-raptor-poaching-film-batumi",
  publishedAt: "2026-10-14",
  relatedHubIds: ["birds"],
  relatedRegionIds: ["adjara"],
  relatedSpeciesIds: [],
  slug: "from-the-sky-raptor-poaching-film-batumi",
  sources: [
    {
      name: "Batumi Raptor Count — From the Sky: a new film about Georgia’s migrating raptors",
      url: BRC_FILM_URL,
    },
    {
      name: "Fauna & Flora — Conserving migrating raptors in western Georgia",
      url: FFI_PROJECT_URL,
    },
    {
      name: "Batumi Raptor Count — Second biggest day ever",
      url: BRC_BIG_DAY_URL,
    },
  ],
  status: "published",
};
