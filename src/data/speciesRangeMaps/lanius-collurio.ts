import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The map shows public, photo-backed observations of the Red-backed Shrike in Georgia. Records whose coordinates are obscured, too approximate or do not match the stated place are left out. A shaded region does not mean the shrike occurs evenly across the whole region. Record counts do not show how many shrikes live in a given place.",
      mapAria:
        "Red-backed Shrike observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the Red-backed Shrike is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "რუკა აჩვენებს ჩვეულებრივი ღაჟოს საჯარო, ფოტოიან დაკვირვებებს საქართველოში. გამოტოვებულია ჩანაწერები, რომელთა კოორდინატები დაფარულია, მეტისმეტად მიახლოებითია ან მითითებულ ადგილს არ ემთხვევა. გამოკვეთილი რეგიონი არ ნიშნავს, რომ ღაჟო მთელ რეგიონში თანაბრად გვხვდება. ჩანაწერების რაოდენობა არ გვიჩვენებს, რამდენი ღაჟო ბინადრობს ამა თუ იმ ადგილას.",
      mapAria:
        "ჩვეულებრივი ღაჟოს დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ჩვეულებრივი ღაჟო დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта показывает публичные наблюдения обыкновенного жулана в Грузии, подтверждённые фотографиями. Записи, у которых координаты скрыты, слишком приблизительны или не совпадают с указанным местом, не показаны. Выделенный регион не значит, что жулан встречается по всему региону равномерно. Число записей не показывает, сколько жуланов обитает в том или ином месте.",
      mapAria:
        "Наблюдения обыкновенного жулана и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где обыкновенный жулан отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Harita, kızılsırtlı örümcekkuşunun Gürcistan'daki herkese açık, fotoğraflı gözlemlerini gösterir. Koordinatları gizlenmiş, fazla yaklaşık olan veya belirtilen yerle uyuşmayan kayıtlar haritaya alınmamıştır. Vurgulanan bölge, türün bölgenin her yerinde eşit biçimde görüldüğü anlamına gelmez. Kayıt sayısı, belirli bir yerde kaç kuş yaşadığını göstermez.",
      mapAria:
        "Kızılsırtlı örümcekkuşu gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kızılsırtlı örümcekkuşu Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 12038,
  rangeSource: "record-summary",
};
