import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The 2026 checklist names sites in Adjara, Guria, Samtskhe–Javakheti and Shida Kartli. These named localities, not observation counts, support the confirmed regions. iNaturalist lists M. djanaschvilii separately, so these records cover only iNaturalist's M. caucasica taxon. Public coordinates are obscured by roughly 27 km; plotted points and their region counts are approximate and may cross borders. Counts reflect observations, not population density or a range across each whole region.",
      mapAria:
        "Caucasian salamander source-confirmed regions and approximate observations on a map of Georgia",
      officialRegionLabel: "Source-confirmed distribution region",
      rangeTitle: "Where Caucasian salamander is documented in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "2026 წლის ჩამონათვალში დასახელებული ლოკალიტეტები ადასტურებს ჩანაწერებს აჭარაში, გურიაში, სამცხე–ჯავახეთსა და შიდა ქართლში. დადასტურებული სტატუსის საფუძველი ეს წყაროა და არა დაკვირვებების რაოდენობა. iNaturalist M. djanaschvilii-ს ცალკე ტაქსონად აჩვენებს, ამიტომ აქ მხოლოდ iNaturalist-ის M. caucasica ტაქსონის ჩანაწერებია. საჯარო კოორდინატები დაახლოებით 27 კმ-ითაა დაფარული; წერტილები და მათი რეგიონული დათვლა მიახლოებითია და საზღვარს შეიძლება გადასცდეს. რაოდენობა არც პოპულაციის სიმჭიდროვეს ზომავს და არც მთელი რეგიონის უწყვეტ გავრცელებას ნიშნავს.",
      mapAria:
        "კავკასიური სალამანდრას წყაროთი დადასტურებული რეგიონები და მიახლოებითი დაკვირვებები საქართველოს რუკაზე",
      officialRegionLabel: "წყაროთი დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის კავკასიური სალამანდრა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "В чек-листе 2026 года названы местонахождения в Аджарии, Гурии, Самцхе–Джавахети и Шида-Картли. Статус подтверждённых регионов основан на этих местонахождениях, а не на числе наблюдений. iNaturalist учитывает M. djanaschvilii отдельно, поэтому здесь показаны записи только таксона M. caucasica по iNaturalist. Публичные координаты скрыты примерно на 27 км; точки и их распределение по регионам приблизительны и могут пересекать границы. Число записей не измеряет плотность популяции и не означает сплошное распространение по всему региону.",
      mapAria:
        "Подтверждённые источником регионы и приблизительные наблюдения кавказской саламандры на карте Грузии",
      officialRegionLabel: "Регион распространения, подтверждённый источником",
      rangeTitle: "Где кавказская саламандра отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "2026 kontrol listesi Acara, Guria, Samtshe–Cavaheti ve Şida Kartli'de belirli lokaliteler bildirir. Doğrulanmış bölge durumu gözlem sayısına değil, bu lokalitelere dayanır. iNaturalist M. djanaschvilii'yi ayrı listeler; burada yalnızca M. caucasica taksonunun kayıtları vardır. Herkese açık koordinatlar yaklaşık 27 km gizlenmiştir; noktalar ve bölgesel sayımları yaklaşıktır ve sınırları aşabilir. Kayıt sayısı popülasyon yoğunluğunu ya da bütün bölgeye yayılışı göstermez.",
      mapAria:
        "Kafkas semenderinin kaynakla doğrulanmış bölgeleri ve yaklaşık gözlemleri Gürcistan haritasında",
      officialRegionLabel: "Kaynakla doğrulanmış yayılış bölgesi",
      rangeTitle: "Kafkas semenderi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 27853,
  rangeSource: "record-summary",
};
