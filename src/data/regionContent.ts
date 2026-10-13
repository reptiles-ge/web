import type { RegionPathId } from "@/data/georgia-paths";
import type { LocalizedText } from "@/data/mapRegions";

export type RegionContent = {
  biome: LocalizedText;
  faq: RegionFaq[];
  habitats: LocalizedText[];
  metaDescription?: Partial<LocalizedText>;
  overview: LocalizedText;
  relatedIds: RegionPathId[];
};

type RegionFaq = {
  answer: LocalizedText;
  question: LocalizedText;
};

const regionContent: Record<RegionPathId, RegionContent> = {
  abkhazia: {
    biome: { en: "Colchic · foothills", ka: "კოლხური · მთისწინეთი" },
    faq: [
      {
        answer: {
          en: "Abkhazia records include Caucasian and Dinnik’s vipers, grass snake and dice snake, smooth snake, and European glass lizard. The species mix at a specific place changes with habitat and elevation.",
          ka: "აფხაზეთში დაფიქსირებულია კავკასიური და დინიკის გველგესლები, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. კონკრეტულ ადგილზე სახეობების შემადგენლობა ჰაბიტატისა და სიმაღლის მიხედვით იცვლება.",
          ru: "В Абхазии отмечены кавказская и Динникова гадюки, обыкновенный и водяной ужи, медянка и желтопузик. Состав видов в конкретном месте меняется в зависимости от местообитания и высоты.",
          tr: "Abhazya’da Kafkas engereği ve Dinnik engereği, halkalı su yılanı ve su yılanı, düz yılan ve cam kertenkele kaydedilmiştir. Belirli bir yerdeki tür bileşimi habitat ve yükseltiye göre değişir.",
        },
        question: {
          en: "Which snakes occur in Abkhazia?",
          ka: "რა გველები გვხვდება აფხაზეთში?",
          ru: "Какие змеи встречаются в Абхазии?",
          tr: "Abhazya’da hangi yılanlar görülür?",
        },
      },
      {
        answer: {
          en: "Yes. Caucasus viper (Vipera kaznakovi) and Dinnik’s viper (Vipera dinniki) are venomous species. When you meet one, keep a safe distance and do not try to catch it.",
          ka: "დიახ. კავკასიური გველგესლა (Vipera kaznakovi) და დინიკის გველგესლა (Vipera dinniki) შხამიანი სახეობებია. შეხვედრისას დაიცავით უსაფრთხო მანძილი და არ სცადოთ მათი დაჭერა.",
          ru: "Да. Кавказская гадюка (Vipera kaznakovi) и гадюка Динника (Vipera dinniki) — ядовитые виды. При встрече держите безопасную дистанцию и не пытайтесь их ловить.",
          tr: "Evet. Kafkas engereği (Vipera kaznakovi) ve Dinnik engereği (Vipera dinniki) zehirli türlerdir. Karşılaştığınızda güvenli mesafe bırakın ve yakalamaya çalışmayın.",
        },
        question: {
          en: "Are there venomous snakes in Abkhazia?",
          ka: "არის თუ არა შხამიანი გველი აფხაზეთში?",
          ru: "Есть ли в Абхазии ядовитые змеи?",
          tr: "Abhazya’da zehirli yılan var mı?",
        },
      },
    ],
    habitats: [
      {
        en: "Black Sea coast and humid lowlands.",
        ka: "შავი ზღვის სანაპირო და ტენიანი დაბლობი.",
        ru: "Побережье Чёрного моря и влажные низменности.",
        tr: "Karadeniz kıyısı ve nemli alçak alanlar.",
      },
      {
        en: "Colchic forests.",
        ka: "კოლხური ტყეები.",
        ru: "Колхидские леса.",
        tr: "Kolhis ormanları.",
      },
      {
        en: "Caucasus foothills.",
        ka: "კავკასიონის მთისწინეთი.",
        ru: "Предгорья Кавказа.",
        tr: "Kafkas etekleri.",
      },
    ],
    metaDescription: {
      ka: "აფხაზეთის ქვეწარმავლების ატლასი — კავკასიური გველგესლა (Vipera kaznakovi), დინიკის გველგესლა, ანკარები და გველხოკერა: ამოცნობა, გავრცელება, ჰაბიტატები და უსაფრთხოება.",
    },
    overview: {
      en: "Abkhazia combines the Black Sea coast, Colchic forests, and Caucasus foothills. The humid climate and large elevation range create varied habitats for both lowland and mountain reptiles. Recorded species in the region include Caucasian and Dinnik’s vipers.",
      ka: "აფხაზეთი აერთიანებს შავი ზღვის სანაპიროს, კოლხურ ტყეებსა და კავკასიონის მთისწინეთს. ნოტიო კლიმატი და სიმაღლის დიდი სხვაობა მრავალფეროვან ჰაბიტატებს ქმნის როგორც დაბლობის, ისე მთის ქვეწარმავლებისთვის. რეგიონში დაფიქსირებულია მათ შორის კავკასიური და დინიკის გველგესლები.",
      ru: "Абхазия объединяет побережье Чёрного моря, колхидские леса и предгорья Кавказа. Влажный климат и большой перепад высот создают разнообразные местообитания как для низинных, так и для горных рептилий. В регионе зарегистрированы в том числе кавказская и Динникова гадюки.",
      tr: "Abhazya, Karadeniz kıyısını, Kolhis ormanlarını ve Kafkas eteklerini bir araya getirir. Nemli iklim ve büyük yükselti farkı hem alçak alan hem de dağ sürüngenleri için çeşitli habitatlar oluşturur. Bölgede Kafkas engereği ve Dinnik engereği de kaydedilmiştir.",
    },
    relatedIds: ["samegrelo-zemo-svaneti", "racha", "guria"],
  },
  adjara: {
    biome: { en: "Colchic · coastal", ka: "კოლხური · სანაპირო" },
    faq: [
      {
        answer: {
          en: "Adjara records include Caucasus viper, grass snake and dice snake, smooth snake, and European glass lizard. In the mountainous part of the Lesser Caucasus, including toward Shuakhevi, nose-horned viper is also recorded. The list is based on regional records and may be updated when new confirmed data are added.",
          ka: "აჭარაში დაფიქსირებულია კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. მცირე კავკასიონის მთიან ნაწილში, მათ შორის შუახევის მიმართულებით, დაფიქსირებულია ცხვირრქოსანი გველგესლაც. სია ეფუძნება რეგიონულ ჩანაწერებს და ახალი დადასტურებული მონაცემების დამატებისას შეიძლება განახლდეს.",
          ru: "В Аджарии отмечены кавказская гадюка, обыкновенный и водяной ужи, медянка и желтопузик. В горной части Малого Кавказа, в том числе в направлении Шуахеви, также зарегистрирована носатая гадюка. Список основан на региональных записях и может обновляться при добавлении новых подтверждённых данных.",
          tr: "Acara’da Kafkas engereği, halkalı su yılanı, su yılanı, düz yılan ve cam kertenkele kaydedilmiştir. Küçük Kafkasya’nın dağlık kesiminde, Şuahevi yönü dahil, burun boynuzlu engerek de kaydedilmiştir. Liste bölgesel kayıtlara dayanır ve yeni doğrulanmış veriler eklendikçe güncellenebilir.",
        },
        question: {
          en: "Which snakes live in Adjara?",
          ka: "რა გველები გვხვდება აჭარაში?",
          ru: "Какие змеи встречаются в Аджарии?",
          tr: "Acara’da hangi yılanlar görülür?",
        },
      },
      {
        answer: {
          en: "Yes. Caucasus viper (Vipera kaznakovi) is venomous. Nose-horned viper (Vipera ammodytes transcaucasiana) is also recorded in mountainous Adjara. The other species listed here do not pose a venomous danger to people. Still keep a safe distance from any unknown snake.",
          ka: "დიახ. კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. მთიან აჭარაში ასევე დაფიქსირებულია ცხვირრქოსანი გველგესლა (Vipera ammodytes transcaucasiana). სხვა აქ ჩამოთვლილი სახეობები ადამიანისთვის შხამიან საფრთხეს არ წარმოადგენენ. უცნობ გველთან მაინც დაიცავით უსაფრთხო მანძილი.",
          ru: "Да. Кавказская гадюка (Vipera kaznakovi) ядовита. В горной Аджарии также зарегистрирована носатая гадюка (Vipera ammodytes transcaucasiana). Другие перечисленные здесь виды не представляют для человека ядовитой опасности. С любой неизвестной змеёй всё равно держите безопасную дистанцию.",
          tr: "Evet. Kafkas engereği (Vipera kaznakovi) zehirlidir. Dağlık Acara’da burun boynuzlu engerek (Vipera ammodytes transcaucasiana) de kaydedilmiştir. Burada listelenen diğer türler insanlar için zehirli bir tehlike oluşturmaz. Yine de bilinmeyen bir yılandan güvenli mesafe bırakın.",
        },
        question: {
          en: "Are there venomous snakes in Adjara?",
          ka: "არის თუ არა შხამიანი გველი აჭარაში?",
          ru: "Есть ли в Аджарии ядовитые змеи?",
          tr: "Acara’da zehirli yılan var mı?",
        },
      },
      {
        answer: {
          en: "Caucasus viper is mainly tied to humid forests and foothill habitats. Regional records are known from different places; see the full species profile for distribution and identification details.",
          ka: "კავკასიური გველგესლა ძირითადად ტენიან ტყეებსა და მთისწინეთის ჰაბიტატებს უკავშირდება. რეგიონში მისი ჩანაწერები სხვადასხვა ადგილიდანაა ცნობილი; გავრცელებისა და ამოცნობის დეტალები იხილეთ სახეობის სრულ პროფილში.",
          ru: "Кавказская гадюка в основном связана с влажными лесами и предгорными местообитаниями. В регионе её записи известны из разных мест; подробности распространения и определения смотрите в полном профиле вида.",
          tr: "Kafkas engereği çoğunlukla nemli ormanlar ve etek habitatlarıyla ilişkilidir. Bölgedeki kayıtları farklı yerlerden bilinmektedir; yayılış ve tanıma ayrıntıları için türün tam profiline bakın.",
        },
        question: {
          en: "Where does the Caucasus viper occur in Adjara?",
          ka: "სად გვხვდება კავკასიური გველგესლა აჭარაში?",
          ru: "Где в Аджарии встречается кавказская гадюка?",
          tr: "Kafkas engereği Acara’da nerede görülür?",
        },
      },
      {
        answer: {
          en: "Reptile activity mainly increases from spring through autumn. In winter many species are less active and spend much of their time in shelter.",
          ka: "ქვეწარმავლების აქტივობა ძირითადად გაზაფხულიდან შემოდგომამდე იზრდება. ზამთარში ბევრი სახეობა ნაკლებად აქტიურია და დროის დიდ ნაწილს თავშესაფარში ატარებს.",
          ru: "Активность рептилий в основном повышается с весны до осени. Зимой многие виды менее активны и большую часть времени проводят в укрытиях.",
          tr: "Sürüngenlerin etkinliği çoğunlukla ilkbahardan sonbahara kadar artar. Kışın birçok tür daha az aktiftir ve zamanının büyük bölümünü barınakta geçirir.",
        },
        question: {
          en: "When are snakes most active in Adjara?",
          ka: "როდის არის გველები უფრო აქტიური აჭარაში?",
          ru: "Когда змеи в Аджарии наиболее активны?",
          tr: "Acara’da yılanlar ne zaman daha aktiftir?",
        },
      },
    ],
    habitats: [
      {
        en: "Humid subtropical forests.",
        ka: "ნოტიო სუბტროპიკული ტყეები.",
        ru: "Влажные субтропические леса.",
        tr: "Nemli subtropik ormanlar.",
      },
      {
        en: "Mountain valleys.",
        ka: "მთიანი ხეობები.",
        ru: "Горные долины.",
        tr: "Dağ vadileri.",
      },
      {
        en: "Black Sea coast.",
        ka: "შავი ზღვის სანაპირო.",
        ru: "Побережье Чёрного моря.",
        tr: "Karadeniz kıyısı.",
      },
    ],
    metaDescription: {
      ka: "აჭარის ქვეწარმავლების ატლასი — კავკასიური გველგესლა (Vipera kaznakovi), ანკარები, სპილენძა და გველხოკერა: ამოცნობა, გავრცელება, ჰაბიტატები და უსაფრთხოება.",
    },
    overview: {
      en: "Adjara is one of western Georgia’s most humid regions. Humid subtropical forests, mountain valleys, and the Black Sea coast create varied environments for reptiles. The region has Caucasus viper, grass snake and dice snake, smooth snake, European glass lizard, and other species.",
      ka: "აჭარა დასავლეთ საქართველოს ერთ-ერთი ყველაზე ტენიანი რეგიონია. ნოტიო სუბტროპიკული ტყეები, მთიანი ხეობები და შავი ზღვის სანაპირო მრავალფეროვან გარემოს ქმნის ქვეწარმავლებისთვის. რეგიონში გვხვდება კავკასიური გველგესლა, ჩვეულებრივი და წყლის ანკარა, სპილენძა, გველხოკერა და სხვა სახეობები.",
      ru: "Аджария — один из самых влажных регионов западной Грузии. Влажные субтропические леса, горные долины и побережье Чёрного моря создают разнообразные условия для рептилий. В регионе встречаются кавказская гадюка, обыкновенный и водяной ужи, медянка, желтопузик и другие виды.",
      tr: "Acara, batı Gürcistan’ın en nemli bölgelerinden biridir. Nemli subtropik ormanlar, dağ vadileri ve Karadeniz kıyısı sürüngenler için çeşitli ortamlar oluşturur. Bölgede Kafkas engereği, halkalı su yılanı ve su yılanı, düz yılan, cam kertenkele ve başka türler görülür.",
    },
    relatedIds: ["guria", "samtskhe-javakheti", "samegrelo-zemo-svaneti"],
  },
  guria: {
    biome: {
      en: "Colchic · subtropical",
      ka: "კოლხური · სუბტროპიკული",
      ru: "Колхидский · субтропический",
      tr: "Kolhis · subtropik",
    },
    faq: [
      {
        answer: {
          en: "Yes. Caucasus viper (Vipera kaznakovi) is a venomous species. Grass snake, dice snake, and smooth snake do not pose a venomous danger to people. Still keep a safe distance from any unknown snake.",
          ka: "დიახ. კავკასიური გველგესლა (Vipera kaznakovi) შხამიანი სახეობაა. ჩვეულებრივი ანკარა, წყლის ანკარა და სპილენძა ადამიანისთვის შხამიან საფრთხეს არ წარმოადგენენ. უცნობ გველთან მაინც დაიცავით უსაფრთხო მანძილი.",
          ru: "Да. Кавказская гадюка (Vipera kaznakovi) — ядовитый вид. Обыкновенный уж, водяной уж и медянка не представляют для человека ядовитой опасности. С любой неизвестной змеёй всё равно держите безопасную дистанцию.",
          tr: "Evet. Kafkas engereği (Vipera kaznakovi) zehirli bir türdür. Halkalı su yılanı, su yılanı ve düz yılan insanlar için zehirli bir tehlike oluşturmaz. Yine de bilinmeyen bir yılandan güvenli mesafe bırakın.",
        },
        question: {
          en: "Are there venomous snakes in Guria?",
          ka: "არის თუ არა შხამიანი გველი გურიაში?",
          ru: "Есть ли в Гурии ядовитые змеи?",
          tr: "Gurya’da zehirli yılan var mı?",
        },
      },
    ],
    habitats: [
      {
        en: "Colchic forests.",
        ka: "კოლხური ტყეები.",
        ru: "Колхидские леса.",
        tr: "Kolhis ormanları.",
      },
      {
        en: "River valleys.",
        ka: "მდინარის ხეობები.",
        ru: "Речные долины.",
        tr: "Nehir vadileri.",
      },
    ],
    metaDescription: {
      en: "Guria — 18 reptile and amphibian species, range map, Colchic forests, river valleys, habitats, and the venomous snake recorded in the region.",
      ka: "გურია — ქვეწარმავლებისა და ამფიბიების 18 სახეობა, გავრცელების რუკა, კოლხური ტყეები, მდინარის ხეობები, ჰაბიტატები და რეგიონში გავრცელებული შხამიანი გველი.",
      ru: "Гурия — 18 видов рептилий и амфибий, карта распространения, колхидские леса, речные долины, местообитания и ядовитая змея региона.",
      tr: "Gurya — 18 sürüngen ve amfibi türü, yayılış haritası, Kolhis ormanları, nehir vadileri, habitatlar ve bölgede kaydedilen zehirli yılan.",
    },
    overview: {
      en: "Guria is defined by a humid subtropical climate, Colchic forests, and river valleys. This environment is especially suitable for reptiles tied to moist habitats, while species typical of eastern Georgia’s dry zones are less common here.",
      ka: "გურია ნოტიო სუბტროპიკული კლიმატით, კოლხური ტყეებითა და მდინარის ხეობებით გამოირჩევა. ასეთი გარემო განსაკუთრებით ხელსაყრელია ტენიან ჰაბიტატებთან დაკავშირებული ქვეწარმავლებისთვის, ხოლო აღმოსავლეთ საქართველოს მშრალი ზონებისთვის დამახასიათებელი სახეობები აქ ნაკლებად გვხვდება.",
      ru: "Гурия выделяется влажным субтропическим климатом, колхидскими лесами и речными долинами. Такая среда особенно благоприятна для рептилий, связанных с влажными местообитаниями, тогда как виды, характерные для сухих зон восточной Грузии, здесь встречаются реже.",
      tr: "Gurya nemli subtropik iklimi, Kolhis ormanları ve nehir vadileriyle öne çıkar. Bu ortam, nemli habitatlarla ilişkili sürüngenler için özellikle elverişlidir; doğu Gürcistan’ın kuru bölgelerine özgü türler ise burada daha az görülür.",
    },
    relatedIds: ["adjara", "samegrelo-zemo-svaneti", "imereti"],
  },
  imereti: {
    biome: {
      en: "Karst · Rioni basin",
      ka: "კარსტი · რიონის აუზი",
      ru: "Карст · бассейн Риони",
      tr: "Karst · Rioni havzası",
    },
    faq: [
      {
        answer: {
          en: "Imereti records include Caucasus viper (Vipera kaznakovi), smooth snake, grass snake and dice snake, and glass lizard.",
          ka: "იმერეთის ჩანაწერებში წარმოდგენილია კავკასიური გველგესლა (Vipera kaznakovi), სპილენძა, ჩვეულებრივი და წყლის ანკარა და გველხოკერა.",
          ru: "В записях Имеретии представлены кавказская гадюка (Vipera kaznakovi), медянка, обыкновенный и водяной ужи, а также желтопузик.",
          tr: "İmereti kayıtlarında Kafkas engereği (Vipera kaznakovi), düz yılan, halkalı su yılanı ve su yılanı ile cam kertenkele yer alır.",
        },
        question: {
          en: "Which snakes occur in Imereti?",
          ka: "რა გველები გვხვდება იმერეთში?",
          ru: "Какие змеи встречаются в Имеретии?",
          tr: "İmereti’de hangi yılanlar görülür?",
        },
      },
    ],
    habitats: [
      {
        en: "Karst mountains.",
        ka: "კარსტული მთები.",
        ru: "Карстовые горы.",
        tr: "Karst dağları.",
      },
      {
        en: "Wooded valleys.",
        ka: "ტყიანი ხეობები.",
        ru: "Лесистые долины.",
        tr: "Ormanlı vadiler.",
      },
      {
        en: "Rioni basin.",
        ka: "რიონის აუზი.",
        ru: "Бассейн Риони.",
        tr: "Rioni havzası.",
      },
    ],
    metaDescription: {
      ka: "იმერეთი — ქვეწარმავლების დადასტურებული ჩანაწერები, გავრცელების რუკა, კარსტული მთები, ტყიანი ხეობები, რიონის აუზი და რეგიონში გავრცელებული შხამიანი გველები.",
    },
    overview: {
      en: "Imereti is defined by karst mountains, wooded valleys, and the Rioni basin. The region has humid habitats characteristic of western Georgia, while more continental environmental signals appear toward the east.",
      ka: "იმერეთი კარსტული მთებით, ტყიანი ხეობებითა და რიონის აუზით გამოირჩევა. რეგიონში დასავლეთ საქართველოსთვის დამახასიათებელი ნოტიო ჰაბიტატები გვხვდება, თუმცა აღმოსავლეთისკენ უფრო კონტინენტური გარემოს ნიშნებიც ჩნდება.",
      ru: "Имеретия выделяется карстовыми горами, лесистыми долинами и бассейном Риони. В регионе встречаются влажные местообитания, характерные для западной Грузии, но к востоку появляются и признаки более континентальной среды.",
      tr: "İmereti karst dağları, ormanlı vadileri ve Rioni havzasıyla öne çıkar. Bölgede batı Gürcistan’a özgü nemli habitatlar görülür, ancak doğuya doğru daha karasal çevre işaretleri de ortaya çıkar.",
    },
    relatedIds: [
      "guria",
      "samegrelo-zemo-svaneti",
      "racha",
      "samtskhe-javakheti",
    ],
  },
  kakheti: {
    biome: { en: "Alazani · semi-arid", ka: "ალაზანი · ნახევრად უდაბნო" },
    faq: [
      {
        answer: {
          en: "The Levantine viper (Macrovipera lebetinus) and the steppe viper (Vipera renardi) are venomous vipers, and the eastern Montpellier snake (Malpolon insignitus) is a rear-fanged snake rated moderate risk. Most other listed species are harmless, but correct identification still matters.",
          ka: "გიურზა (Macrovipera lebetinus) და ველის გველგესლა (Vipera renardi) შხამიანი გველგესლებია, ჩვეულებრივი ხვლიკიჭამია გველი (Malpolon insignitus) კი უკანა შხამკბილა გველია საშუალო რისკით. სხვა ჩამოთვლილი სახეობების უმეტესობა უვნებელია, თუმცა ამოცნობა მნიშვნელოვანია.",
          ru: "Гюрза (Macrovipera lebetinus) и степная гадюка (Vipera renardi) — ядовитые гадюки, а восточная мальполон (Malpolon insignitus) — заднебороздчатая змея среднего риска. Большинство других перечисленных видов безвредны, но правильное определение всё равно важно.",
          tr: "Levant engereği (Macrovipera lebetinus) ve bozkır engereği (Vipera renardi) zehirli engereklerdir; Doğu Montpellier yılanı (Malpolon insignitus) ise orta riskli, arka dişli bir yılandır. Listelenen diğer türlerin çoğu zararsızdır, ancak doğru tanımlama yine de önemlidir.",
        },
        question: {
          en: "Which venomous snakes live in Kakheti?",
          ka: "რა შხამიანი გველებია კახეთში?",
          ru: "Какие ядовитые змеи живут в Кахетии?",
          tr: "Kakheti’de hangi zehirli yılanlar yaşar?",
        },
      },
      {
        answer: {
          en: "Records include Levantine viper, steppe viper, Urartian and steppe ratsnakes, red-bellied and Dahl’s whip snakes, cat snake, grass snake and dice snake, smooth snake, and glass lizard.",
          ka: "ჩანაწერებშია გიურზა, ველის გველგესლა, ურარტუს და სახეებიანი მცურავი, წითელმუცელა და წენგოსფერი მცურავი, კატისთვალა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა.",
        },
        question: {
          en: "Which snakes occur in Kakheti?",
          ka: "რა გველები გვხვდება კახეთში?",
        },
      },
      {
        answer: {
          en: "Yes — Kakheti belongs to the dry/semi-arid east, Adjara to the humid Colchic west. Species assemblages differ sharply.",
          ka: "დიახ — კახეთი მშრალი/ნახევრად მშრალი აღმოსავლეთის ფაუნას მიეკუთვნება, აჭარა კი ნოტიო კოლხურ ზონას. სახეობების ნაკრები მკვეთრად განსხვავდება.",
        },
        question: {
          en: "Do Kakheti’s snakes differ from Adjara’s?",
          ka: "განსხვავდება თუ არა კახეთის გველები აჭარისგან?",
        },
      },
    ],
    habitats: [
      { en: "Alazani valley", ka: "ალაზნის ველი" },
      { en: "Dry foothills", ka: "მშრალი მთისწინეთი" },
      { en: "Semi-arid zones", ka: "ნახევრად უდაბნო ზონები" },
    ],
    overview: {
      en: "Kakheti’s Alazani valley, dry foothills, and semi-arid belts shape eastern Georgia’s distinctive fauna. Warmth-loving, dry-habitat taxa dominate — Levantine viper, fast racers, and cat snake.",
      ka: "კახეთი ალაზნის ველით, მშრალი მთისწინეთითა და ნახევრად უდაბნო ზონებით ქმნის აღმოსავლეთ საქართველოს განსხვავებულ ფაუნას. აქ დომინირებს თბომოყვარე და მშრალი ჰაბიტატის სახეობები — გიურზა, სწრაფი მცურავები და კატისთვალა.",
    },
    relatedIds: ["kvemo-kartli", "mtskheta-mtianeti", "tbilisi"],
  },
  "kvemo-kartli": {
    biome: { en: "Dry plain · Mtkvari", ka: "მშრალი ვაკე · მტკვარი" },
    faq: [
      {
        answer: {
          en: "Yes — the Levantine viper (Macrovipera lebetinus) is venomous and tied to eastern dry and semi-arid habitats; the nose-horned viper (Vipera ammodytes transcaucasiana) occurs in the Trialeti highlands. Keep your distance.",
          ka: "დიახ — გიურზა (Macrovipera lebetinus) შხამიანია და აღმოსავლეთის მშრალ/ნახევრად მშრალ ჰაბიტატებს უკავშირდება; თრიალეთის მთიანეთში გვხვდება ცხვირრქოსანი გველგესლა (Vipera ammodytes transcaucasiana). დაიცავით მანძილი.",
          ru: "Да — гюрза (Macrovipera lebetinus) ядовита и связана с сухими и полузасушливыми местообитаниями востока; в Триалетском нагорье встречается носатая гадюка (Vipera ammodytes transcaucasiana). Держите дистанцию.",
          tr: "Evet — Levant engereği (Macrovipera lebetinus) zehirlidir ve doğunun kuru ve yarı kurak habitatlarına bağlıdır; Trialeti yaylalarında boynuzlu engerek (Vipera ammodytes transcaucasiana) görülür. Mesafenizi koruyun.",
        },
        question: {
          en: "Does the Levantine viper occur in Kvemo Kartli?",
          ka: "არის თუ არა გიურზა ქვემო ქართლში?",
          ru: "Встречается ли гюрза в Квемо-Картли?",
          tr: "Levant engereği Kvemo Kartli’de görülür mü?",
        },
      },
    ],
    habitats: [
      { en: "Dry plains", ka: "მშრალი ვაკეები" },
      { en: "Rocky foothills", ka: "კლდოვანი მთისწინეთი" },
      { en: "Mtkvari basin", ka: "მტკვრის აუზი" },
    ],
    overview: {
      en: "Kvemo Kartli’s dry plains, rocky foothills, and Mtkvari basin favor warmth-loving species. Here appears the Levantine viper — one of eastern Georgia’s most significant venomous snakes.",
      ka: "ქვემო ქართლი მშრალი ვაკეებით, კლდოვანი მთისწინეთითა და მტკვრის აუზით ხელს უწყობს თბომოყვარე სახეობებს. აქ ჩნდება გიურზა — აღმოსავლეთ საქართველოს ერთ-ერთი ყველაზე მნიშვნელოვანი შხამიანი გველი.",
    },
    relatedIds: ["tbilisi", "kakheti", "shida-kartli", "samtskhe-javakheti"],
  },
  "mtskheta-mtianeti": {
    biome: { en: "Greater Caucasus", ka: "დიდი კავკასიონი" },
    faq: [
      {
        answer: {
          en: "Yes — Dinnik’s viper (Vipera dinniki) and the nose-horned viper (Vipera ammodytes transcaucasiana) are venomous. Dinnik’s viper is associated with high-mountain habitats. Keep a safe distance from any unknown snake.",
          ka: "დიახ — დინიკის გველგესლა (Vipera dinniki) და ცხვირრქოსანი გველგესლა (Vipera ammodytes transcaucasiana) შხამიანია. დინიკის გველგესლა მაღალმთის ჰაბიტატებს უკავშირდება. ნებისმიერ უცნობ გველთან დაიცავით უსაფრთხო მანძილი.",
          ru: "Да — гадюка Динника (Vipera dinniki) и носатая гадюка (Vipera ammodytes transcaucasiana) ядовиты. Гадюка Динника связана с высокогорными местообитаниями. С любой неизвестной змеёй держите безопасную дистанцию.",
          tr: "Evet — Dinnik engereği (Vipera dinniki) ve boynuzlu engerek (Vipera ammodytes transcaucasiana) zehirlidir. Dinnik engereği yüksek dağ habitatlarıyla ilişkilidir. Bilinmeyen her yılandan güvenli mesafe bırakın.",
        },
        question: {
          en: "Are there venomous snakes in Mtskheta-Mtianeti?",
          ka: "არის თუ არა შხამიანი გველი მცხეთა-მთიანეთში?",
          ru: "Есть ли ядовитые змеи в Мцхета-Мтианети?",
          tr: "Mtskheta-Mtianeti’de zehirli yılan var mı?",
        },
      },
    ],
    habitats: [
      { en: "High mountains", ka: "მაღალმთა" },
      { en: "Upper forest belt", ka: "ტყის ზედა ზონა" },
      { en: "Subalpine meadows", ka: "სუბალპური მდელოები" },
    ],
    overview: {
      en: "Mtskheta — Mtianeti covers Greater Caucasus peaks, the upper forest belt, and subalpine meadows. It is classic range for montane reptiles, including Dinnik’s viper.",
      ka: "მცხეთა — მთიანეთი დიდი კავკასიონის მთებით, ტყის ზედა ზონითა და სუბალპური მდელოებით გამოირჩევა. ეს არის მთის ქვეწარმავლების — მათ შორის დინიკის გველგესლას — კლასიკური არეალი.",
    },
    relatedIds: ["racha", "shida-kartli", "kakheti", "tbilisi"],
  },
  racha: {
    biome: { en: "High mountain · subalpine", ka: "მაღალმთა · სუბალპური" },
    faq: [
      {
        answer: {
          en: "Yes — Dinnik’s viper (Vipera dinniki) and the Caucasus viper (Vipera kaznakovi) are venomous. Dinnik’s viper is tied to high-mountain habitats. Keep a safe distance from any unknown snake.",
          ka: "დიახ — დინიკის გველგესლა (Vipera dinniki) და კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. დინიკის გველგესლა მაღალმთის ჰაბიტატებს უკავშირდება. ნებისმიერ უცნობ გველთან დაიცავით უსაფრთხო მანძილი.",
          ru: "Да — гадюка Динника (Vipera dinniki) и кавказская гадюка (Vipera kaznakovi) ядовиты. Гадюка Динника связана с высокогорными местообитаниями. С любой неизвестной змеёй держите безопасную дистанцию.",
          tr: "Evet — Dinnik engereği (Vipera dinniki) ve Kafkas engereği (Vipera kaznakovi) zehirlidir. Dinnik engereği yüksek dağ habitatlarına bağlıdır. Bilinmeyen her yılandan güvenli mesafe bırakın.",
        },
        question: {
          en: "Are there venomous snakes in Racha?",
          ka: "არის თუ არა შხამიანი გველი რაჭაში?",
          ru: "Есть ли ядовитые змеи в Раче?",
          tr: "Raça’da zehirli yılan var mı?",
        },
      },
    ],
    habitats: [
      { en: "High-mountain forests", ka: "მაღალმთიანი ტყეები" },
      { en: "Subalpine meadows", ka: "სუბალპური მდელოები" },
      { en: "Rocky gorges", ka: "კლდოვანი ხეობები" },
    ],
    overview: {
      en: "Racha — Lechkhumi — Kvemo Svaneti is defined by high forests, subalpine meadows, and rocky gorges. Montane taxa such as Dinnik’s viper are more characteristic than lowland fauna.",
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთი მაღალმთიანი ტყეებით, სუბალპური მდელოებითა და კლდოვანი ხეობებით გამოირჩევა. აქ მთის სახეობები — მათ შორის დინიკის გველგესლა — უფრო დამახასიათებელია, ვიდრე დაბლობის ფაუნა.",
    },
    relatedIds: ["samegrelo-zemo-svaneti", "imereti", "mtskheta-mtianeti"],
  },
  "samegrelo-zemo-svaneti": {
    biome: { en: "Colchis · Svaneti", ka: "კოლხეთი · სვანეთი" },
    faq: [
      {
        answer: {
          en: "Caucasus viper (Vipera kaznakovi), grass snake and dice snake, smooth snake, and glass lizard are recorded in Samegrelo’s lowland and humid zones. Dinnik’s viper (Vipera dinniki) occurs in the high-mountain part of Zemo Svaneti. Species composition at a specific place changes with elevation and habitat.",
          ka: "სამეგრელოს დაბლობ და ტენიან ზონებში დაფიქსირებულია კავკასიური გველგესლა (Vipera kaznakovi), ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. ზემო სვანეთის მაღალმთიან ნაწილში გვხვდება დინიკის გველგესლა (Vipera dinniki). კონკრეტულ ადგილზე სახეობების შემადგენლობა სიმაღლისა და ჰაბიტატის მიხედვით იცვლება.",
          ru: "В низинных и влажных зонах Самегрело зарегистрированы кавказская гадюка (Vipera kaznakovi), обыкновенный и водяной ужи, медянка и желтопузик. В высокогорной части Верхней Сванетии встречается гадюка Динника (Vipera dinniki). Состав видов в конкретном месте меняется в зависимости от высоты и местообитания.",
          tr: "Samegrelo’nun alçak ve nemli bölgelerinde Kafkas engereği (Vipera kaznakovi), halkalı su yılanı ve su yılanı, düz yılan ve cam kertenkele kaydedilmiştir. Zemo Svaneti’nin yüksek dağ kesiminde Dinnik engereği (Vipera dinniki) görülür. Belirli bir yerdeki tür bileşimi yükselti ve habitata göre değişir.",
        },
        question: {
          en: "Which snakes live in Samegrelo?",
          ka: "რა გველები გვხვდება სამეგრელოში?",
          ru: "Какие змеи встречаются в Самегрело?",
          tr: "Samegrelo’da hangi yılanlar görülür?",
        },
      },
    ],
    habitats: [
      {
        en: "Colchis lowlands.",
        ka: "კოლხეთის დაბლობი.",
        ru: "Колхидская низменность.",
        tr: "Kolhis ovası.",
      },
      {
        en: "River valleys.",
        ka: "მდინარის ხეობები.",
        ru: "Речные долины.",
        tr: "Nehir vadileri.",
      },
      {
        en: "High-mountain Svaneti.",
        ka: "სვანეთის მაღალმთიანი ზონა.",
        ru: "Высокогорная зона Сванетии.",
        tr: "Svaneti’nin yüksek dağ kuşağı.",
      },
    ],
    metaDescription: {
      ka: "სამეგრელო-ზემო სვანეთი — ქვეწარმავლების დადასტურებული ჩანაწერები, გავრცელების რუკა, კოლხეთის დაბლობი, სვანეთის მაღალმთიანი ზონა და რეგიონში გავრცელებული შხამიანი გველები.",
    },
    overview: {
      en: "Samegrelo — Zemo Svaneti extends from the Colchis lowlands to the high mountains of Svaneti. Humid forests, river valleys, and alpine zones meet within one region, so reptile composition changes markedly with elevation and habitat.",
      ka: "სამეგრელო — ზემო სვანეთი კოლხეთის დაბლობიდან სვანეთის მაღალმთამდე ვრცელდება. ერთ რეგიონში გვხვდება ტენიანი ტყეები, მდინარის ხეობები და ალპური ზონა, ამიტომ ქვეწარმავლების შემადგენლობა სიმაღლისა და ჰაბიტატის მიხედვით მნიშვნელოვნად იცვლება.",
      ru: "Самегрело — Верхняя Сванетия простирается от Колхидской низменности до высокогорий Сванетии. В одном регионе встречаются влажные леса, речные долины и альпийская зона, поэтому состав рептилий заметно меняется в зависимости от высоты и местообитания.",
      tr: "Samegrelo — Zemo Svaneti, Kolhis ovasından Svaneti’nin yüksek dağlarına kadar uzanır. Nemli ormanlar, nehir vadileri ve alpin kuşak tek bir bölgede buluşur; bu yüzden sürüngen bileşimi yükselti ve habitata göre belirgin biçimde değişir.",
    },
    relatedIds: ["abkhazia", "guria", "racha", "imereti"],
  },
  "samtskhe-javakheti": {
    biome: { en: "Volcanic plateau", ka: "ვულკანური პლატო" },
    faq: [
      {
        answer: {
          en: "The nose-horned viper (Vipera ammodytes transcaucasiana), Darevsky’s viper (Vipera darevskii) and, in the Borjomi gorge, the Caucasus viper (Vipera kaznakovi) are venomous. Darevsky’s viper is critically endangered and confined to the Javakheti–Erusheti highlands.",
          ka: "ცხვირრქოსანი გველგესლა (Vipera ammodytes transcaucasiana), დარევსკის გველგესლა (Vipera darevskii) და ბორჯომის ხეობაში კავკასიური გველგესლა (Vipera kaznakovi) შხამიანია. დარევსკის გველგესლა კრიტიკულად საფრთხის ქვეშაა და გვხვდება ჯავახეთ–ერუშეთის მაღალმთაში.",
          ru: "Ядовиты носатая гадюка (Vipera ammodytes transcaucasiana), гадюка Даревского (Vipera darevskii) и, в Боржомском ущелье, кавказская гадюка (Vipera kaznakovi). Гадюка Даревского находится в критическом состоянии и ограничена нагорьем Джавахети–Эрушети.",
          tr: "Boynuzlu engerek (Vipera ammodytes transcaucasiana), Darevski engereği (Vipera darevskii) ve Borjomi vadisinde Kafkas engereği (Vipera kaznakovi) zehirlidir. Darevski engereği kritik tehlike altındadır ve Javakheti–Erusheti yaylalarıyla sınırlıdır.",
        },
        question: {
          en: "Which venomous snakes occur in Samtskhe-Javakheti?",
          ka: "რა შხამიანი გველებია სამცხე-ჯავახეთში?",
          ru: "Какие ядовитые змеи встречаются в Самцхе-Джавахети?",
          tr: "Samtskhe-Javakheti’de hangi zehirli yılanlar görülür?",
        },
      },
    ],
    habitats: [
      { en: "Volcanic plateaus", ka: "ვულკანური პლატოები" },
      { en: "Highland lakes", ka: "მთის ტბები" },
      { en: "Dry foothills", ka: "მშრალი მთისწინეთი" },
      { en: "Subalpine rocky slopes", ka: "სუბალპური კლდოვანი ფერდობები" },
    ],
    overview: {
      en: "Samtskhe — Javakheti features volcanic plateaus, highland lakes, and dry foothills. Open, often cool habitats differ from Colchic west Georgia — the nose-horned viper and Darevsky’s viper occur here; Caucasus viper is recorded in the Borjomi gorge.",
      ka: "სამცხე — ჯავახეთი ვულკანური პლატოებით, მთის ტბებითა და მშრალი მთისწინეთით გამოირჩევა. ღია, ხშირად ცივი ჰაბიტატები განსხვავდება კოლხური დასავლეთისგან — აქ გვხვდება ცხვირრქოსანი და დარევსკის გველგესლები; ბორჯომის ხეობაში — კავკასიური გველგესლა.",
    },
    relatedIds: ["adjara", "imereti", "kvemo-kartli", "shida-kartli"],
  },
  "shida-kartli": {
    biome: { en: "Plain · Mtkvari valley", ka: "ვაკე · მტკვრის ხეობა" },
    faq: [
      {
        answer: {
          en: "Records include three venomous vipers — the nose-horned viper (Vipera ammodytes transcaucasiana), the Caucasus viper (Vipera kaznakovi) and the eastern steppe viper (Vipera renardi) — plus steppe ratsnake, red-bellied and Dahl’s whip snakes, cat snake, grass snake and dice snake, smooth snake, and glass lizard.",
          ka: "ჩანაწერებშია სამი შხამიანი გველგესლა — ცხვირრქოსანი (Vipera ammodytes transcaucasiana), კავკასიური (Vipera kaznakovi) და ველის გველგესლა (Vipera renardi) — ასევე სახეებიანი მცურავი, წითელმუცელა და წენგოსფერი მცურავი, კატისთვალა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა.",
          ru: "В записях — три ядовитые гадюки: носатая (Vipera ammodytes transcaucasiana), кавказская (Vipera kaznakovi) и степная (Vipera renardi), а также узорчатый полоз, краснобрюхий и Далев полозы, кошачья змея, обыкновенный и водяной ужи, медянка и желтопузик.",
          tr: "Kayıtlarda üç zehirli engerek var — boynuzlu engerek (Vipera ammodytes transcaucasiana), Kafkas engereği (Vipera kaznakovi) ve bozkır engereği (Vipera renardi) — ayrıca desenli sıçan yılanı, kırmızı karınlı ve Dahl kamçı yılanları, kedi yılanı, halkalı su yılanı, su yılanı, düz yılan ve cam kertenkele yer alır.",
        },
        question: {
          en: "Which snakes occur in Shida Kartli?",
          ka: "რა გველები გვხვდება შიდა ქართლში?",
          ru: "Какие змеи встречаются в Шида-Картли?",
          tr: "Shida Kartli’de hangi yılanlar görülür?",
        },
      },
    ],
    habitats: [
      { en: "Shida Kartli plain", ka: "შიდა ქართლის ვაკე" },
      { en: "Foothills", ka: "მთისწინეთი" },
      { en: "Mtkvari valley", ka: "მტკვრის ხეობა" },
    ],
    overview: {
      en: "Shida Kartli bridges dry and semi-humid zones via plains, foothills, and the Mtkvari valley. Western and eastern faunal elements meet — from nose-horned viper to fast racers.",
      ka: "შიდა ქართლი ვაკით, მთისწინეთითა და მტკვრის ხეობით აერთიანებს მშრალ და ნახევრად ნოტიო ზონებს. აქ იკვეთება დასავლეთისა და აღმოსავლეთის ფაუნის ელემენტები — ცხვირრქოსანი გველგესლიდან სწრაფ მცურავებამდე.",
    },
    relatedIds: [
      "mtskheta-mtianeti",
      "kvemo-kartli",
      "samtskhe-javakheti",
      "imereti",
    ],
  },
  tbilisi: {
    biome: { en: "Urban · Mtkvari", ka: "ურბანული · მტკვარი" },
    faq: [
      {
        answer: {
          en: "Tbilisi records include Levantine viper (Macrovipera lebetinus), nose-horned viper (Vipera ammodytes transcaucasiana), steppe ratsnake, red-bellied racer, Dahl’s whip snake, cat snake, grass snake, dice snake, smooth snake, and glass lizard. Encounters with these species are more likely in suburbs, valleys, rocky places, and riverside areas.",
          ka: "თბილისის ჩანაწერებში წარმოდგენილია გიურზა (Macrovipera lebetinus), ცხვირრქოსანი გველგესლა (Vipera ammodytes transcaucasiana), სახეებიანი მცურავი, წითელმუცელა და წენგოსფერი მცურავი, კატისთვალა, ჩვეულებრივი და წყლის ანკარა, სპილენძა და გველხოკერა. ასეთი სახეობების შეხვედრა უფრო მოსალოდნელია ქალაქის გარეუბნებში, ხეობებში, კლდოვან ადგილებსა და მდინარის პირას.",
          ru: "В записях по Тбилиси представлены гюрза (Macrovipera lebetinus), носатая гадюка (Vipera ammodytes transcaucasiana), узорчатый полоз, краснобрюхий и Далев полозы, кошачья змея, обыкновенный и водяной ужи, медянка и желтопузик. Встречи с такими видами более вероятны на окраинах, в ущельях, на скальных участках и у реки.",
          tr: "Tiflis kayıtlarında Levant engereği (Macrovipera lebetinus), boynuzlu engerek (Vipera ammodytes transcaucasiana), desenli sıçan yılanı, kırmızı karınlı ve Dahl kamçı yılanları, kedi yılanı, halkalı su yılanı, su yılanı, düz yılan ve cam kertenkele yer alır. Bu türlerle karşılaşma daha çok banliyölerde, vadilerde, kayalık alanlarda ve nehir kıyısında beklenir.",
        },
        question: {
          en: "Which snakes live in Tbilisi?",
          ka: "რა გველები ბინადრობენ თბილისში?",
          ru: "Какие змеи обитают в Тбилиси?",
          tr: "Tiflis’te hangi yılanlar yaşar?",
        },
      },
      {
        answer: {
          en: "The Levantine viper and the nose-horned viper are rated high risk in this atlas. The other listed snakes do not pose a venomous danger to people. Keep distance from any unknown snake.\n\nIf bitten, call 112 immediately. Do not cut the wound, suck out venom, or use a tourniquet.",
          ka: "გიურზა და ცხვირრქოსანი გველგესლა ამ ატლასში მაღალი რისკის სახეობებადაა შეფასებული. სხვა ჩამოთვლილი გველები ადამიანისთვის შხამიან საფრთხეს არ წარმოადგენენ. ნებისმიერ უცნობ გველთან დაიცავით დისტანცია.\n\nნაკბენისას დაუყოვნებლივ დარეკეთ 112-ზე. არ გაჭრათ ჭრილობა, არ ამოიწოვოთ შხამი და არ გამოიყენოთ ტურნიკეტი.",
          ru: "Гюрза и носатая гадюка в этом атласе оценены как виды высокого риска. Другие перечисленные змеи не представляют для человека ядовитой опасности. С любой неизвестной змеёй держите дистанцию.\n\nПри укусе немедленно звоните 112. Не разрезайте рану, не отсасывайте яд и не используйте жгут.",
          tr: "Levant engereği ve boynuzlu engerek bu atlasta yüksek riskli türler olarak değerlendirilir. Listelenen diğer yılanlar insanlar için zehirli bir tehlike oluşturmaz. Bilinmeyen her yılandan uzak durun.\n\nIsırıkta hemen 112’yi arayın. Yarayı kesmeyin, zehri emmeyin ve turnike kullanmayın.",
        },
        question: {
          en: "Are snakes in Tbilisi dangerous?",
          ka: "საშიშია თუ არა გველები თბილისში?",
          ru: "Опасны ли змеи в Тбилиси?",
          tr: "Tiflis’teki yılanlar tehlikeli midir?",
        },
      },
      {
        answer: {
          en: "Reptile encounters are more likely along the Mtkvari, on rocky slopes, in suburban valleys, and in less disturbed green areas than on central city streets. Levantine viper is recorded only rarely around Tbilisi and is more strongly tied to dry habitats of eastern Georgia.",
          ka: "ქვეწარმავლების შეხვედრა უფრო მოსალოდნელია მტკვრის პირას, კლდოვან ფერდობებზე, გარეუბნის ხეობებსა და ნაკლებად შეწუხებულ გამწვანებულ ადგილებში, ვიდრე ქალაქის ცენტრალურ ქუჩებში. თბილისის მიდამოებში გიურზა იშვიათად ფიქსირდება და უფრო მეტად აღმოსავლეთ საქართველოს მშრალ ჰაბიტატებს უკავშირდება.",
          ru: "Встречи с рептилиями более вероятны у Мтквари, на скальных склонах, в пригородных ущельях и в менее нарушенных зелёных местах, чем на центральных улицах города. Гюрза в окрестностях Тбилиси фиксируется редко и сильнее связана с сухими местообитаниями восточной Грузии.",
          tr: "Sürüngenlerle karşılaşma, merkezi şehir sokaklarından çok Mtkvari kıyısında, kayalık yamaçlarda, banliyö vadilerinde ve daha az rahatsız edilen yeşil alanlarda beklenir. Koca engerek Tiflis çevresinde nadiren kaydedilir ve daha çok doğu Gürcistan’ın kuru habitatlarıyla ilişkilidir.",
        },
        question: {
          en: "Where are snakes more likely around Tbilisi?",
          ka: "სად არის მეტი შანსი გველის ნახვის თბილისში?",
          ru: "Где вокруг Тбилиси змей встретить вероятнее?",
          tr: "Tiflis çevresinde yılan görme olasılığı nerede daha yüksektir?",
        },
      },
      {
        answer: {
          en: "If a snake bites someone, call 112 first. Stay calm and try to move the bitten limb as little as possible. Do not cut the wound, suck out venom, or use a tourniquet. Species identification can wait — calling emergency help matters more.",
          ka: "გველის ნაკბენისას პირველ რიგში დარეკეთ 112-ზე. შეინარჩუნეთ სიმშვიდე და ეცადეთ ნაკბენი კიდური ნაკლებად ამოძრაოთ. არ გაჭრათ ჭრილობა, არ ამოიწოვოთ შხამი და არ გამოიყენოთ ტურნიკეტი. სახეობის ამოცნობა შეიძლება მოგვიანებითაც — გადაუდებელი დახმარების გამოძახება უფრო მნიშვნელოვანია.",
          ru: "При укусе змеи сначала звоните 112. Сохраняйте спокойствие и старайтесь как можно меньше двигать укушенной конечностью. Не разрезайте рану, не отсасывайте яд и не используйте жгут. Вид можно определить позже — важнее вызвать экстренную помощь.",
          tr: "Yılan ısırığında önce 112’yi arayın. Sakin kalın ve ısırılan uzvu mümkün olduğunca az hareket ettirmeye çalışın. Yarayı kesmeyin, zehri emmeyin ve turnike kullanmayın. Türü daha sonra tanımak mümkündür; acil yardım çağırmak daha önemlidir.",
        },
        question: {
          en: "What if a snake bites someone in Tbilisi?",
          ka: "რა ვქნა, თუ თბილისში გველმა მიკბინა?",
          ru: "Что делать, если в Тбилиси укусила змея?",
          tr: "Tiflis’te birini yılan ısırırsa ne yapılmalı?",
        },
      },
    ],
    habitats: [
      {
        en: "Suburban valleys.",
        ka: "გარეუბნის ხეობები.",
        ru: "Пригородные ущелья.",
        tr: "Banliyö vadileri.",
      },
      {
        en: "Parks and green areas.",
        ka: "პარკები და გამწვანებული ტერიტორიები.",
        ru: "Парки и зелёные зоны.",
        tr: "Parklar ve yeşil alanlar.",
      },
      {
        en: "Riverside habitats.",
        ka: "მდინარის პირას არსებული ჰაბიტატები.",
        ru: "Местообитания у реки.",
        tr: "Nehir kıyısı habitatları.",
      },
    ],
    metaDescription: {
      ka: "თბილისის ქვეწარმავლების ატლასი — გიურზა, გველგესლები, მცურავები და გველხოკერა: ამოცნობა, გავრცელება, ჰაბიტატები და უსაფრთხოება თბილისსა და მის შემოგარენში.",
    },
    overview: {
      en: "In Tbilisi, reptiles mainly occur in valleys around the city, parks, green areas, and riverside habitats, not in central urban districts. Atlas records from Tbilisi and its surroundings include Levantine viper, nose-horned viper, several ratsnakes and racers, grass and dice snakes, glass lizard, and other species. Encounters inside the city are rare but possible. If a snake bites someone, call 112 immediately.",
      ka: "თბილისში ქვეწარმავლები ძირითადად ქალაქის მიმდებარე ხეობებში, პარკებში, გამწვანებულ ადგილებსა და მდინარის პირას გვხვდება და არა ცენტრალურ ურბანულ უბნებში. ატლასის ჩანაწერებში თბილისის ტერიტორიიდან და შემოგარენიდან წარმოდგენილია გიურზა, ცხვირრქოსანი გველგესლა, სხვადასხვა მცურავი, ანკარები, გველხოკერა და სხვა სახეობები. ქალაქის შიგნით ასეთი შეხვედრები იშვიათია, მაგრამ შესაძლებელია. გველის ნაკბენისას დაუყოვნებლივ დარეკეთ 112-ზე.",
      ru: "В Тбилиси рептилии в основном встречаются в ущельях вокруг города, парках, зелёных местах и у реки, а не в центральных городских районах. В атласных записях с территории Тбилиси и окрестностей представлены гюрза, носатая гадюка, разные полозы, ужи, желтопузик и другие виды. Внутри города такие встречи редки, но возможны. При укусе змеи немедленно звоните 112.",
      tr: "Tiflis’te sürüngenler çoğunlukla kent çevresindeki vadilerde, parklarda, yeşil alanlarda ve nehir kıyısında görülür; merkezi kentsel bölgelerde değil. Atlas kayıtlarında Tiflis ve çevresinden Levant engereği, boynuzlu engerek, çeşitli sıçan ve kamçı yılanları, su yılanları, cam kertenkele ve başka türler yer alır. Şehir içinde böyle karşılaşmalar nadirdir ama mümkündür. Yılan ısırığında hemen 112’yi arayın.",
    },
    relatedIds: [
      "kvemo-kartli",
      "mtskheta-mtianeti",
      "shida-kartli",
      "kakheti",
    ],
  },
};

export function getRegionContent(id: RegionPathId): RegionContent {
  return regionContent[id];
}
