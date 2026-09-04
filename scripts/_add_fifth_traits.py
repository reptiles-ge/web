# -*- coding: utf-8 -*-
from pathlib import Path
from textwrap import fill

root = Path("/Users/asyncfinkd/Desktop/reptiles/src/content/species")


def wrap_trait(text: str) -> str:
    joined = " ".join(text.split())
    wrapped = fill(
        joined, width=72, break_long_words=False, break_on_hyphens=False
    )
    first, *rest = wrapped.split("\n")
    out = "      " + first
    for ln in rest:
        out += "\n      " + ln
    return "    - >-\n" + out + "\n"


TRAITS = {
    "elaphe-dione": {
        "ka": "2026 წლის ჩამონათვალი სახეობას ბიოლოგიურად დადასტურებულად იღებს; გავრცელების სიზუსტე საშუალოდაა შეფასებული. დასახელებული თანამედროვე წერტილები კახეთშია: ყვარელი და კაჭრეთი. ამ ატლასის რუკაზე აღნიშნულია კახეთი, ქვემო ქართლი და თბილისი. მთელ ქვეყანაში არ ეძებოთ.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed; distribution confidence is medium. Named modern localities are in Kakheti: Kvareli and Kachreti. This atlas maps Kakheti, Kvemo Kartli, and Tbilisi. Do not expect it throughout the country.",
        "ru": "Чек-лист Грузии 2026 года считает его биологически подтверждённым; уверенность в распространении средняя. Именованные современные локальности в Кахетии: Кварели и Качрети. Этот атлас отмечает Кахетию, Квемо-Картли и Тбилиси. Не стоит ожидать его по всей стране.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder; yayılış güveni orta. Adı geçen modern lokaliteler Kaheti'dedir: Kvareli ve Kachreti. Bu atlas Kaheti, Kvemo Kartli ve Tiflis'i haritalar. Ülke genelinde beklemeyin.",
    },
    "dolichophis-schmidti": {
        "ka": "2026 წლის ჩამონათვალი სახეობას იღებს, მაგრამ კანდიდატად ტოვებს: ადრე Coluber jugularis-ის ქვესახეობად ითვლებოდა და კასპიურ მცურავთან (Dolichophis caspius) კონტაქტის ზოლში პოპულაციური კვლევა ჯერ საკმარისი არ არის. დასახელებული ბარკოდირებული ნიმუში თბილისიდანაა. მთელ ქვეყანაში არ ეძებოთ.",
        "en": "The 2026 Georgian checklist accepts the name but treats it as a candidate: it was formerly a subspecies of Coluber jugularis, and population-level work is still needed in the contact zone with the Caspian whip snake (Dolichophis caspius). The named barcode specimen is from Tbilisi. Do not expect it throughout the country.",
        "ru": "Чек-лист Грузии 2026 года принимает название, но считает вид кандидатным: ранее это был подвид Coluber jugularis, и на популяционном уровне ещё нужна работа в зоне контакта с каспийским полозом (Dolichophis caspius). Именованный баркодированный экземпляр — из Тбилиси. Не стоит ожидать его по всей стране.",
        "tr": "2026 Gürcistan kontrol listesi adı kabul eder ama türü aday sayar: eskiden Coluber jugularis'in bir alttürüydü ve Hazar kırbaç yılanı (Dolichophis caspius) ile temas bölgesinde hâlâ popülasyon düzeyinde çalışma gerekir. Adı geçen barkodlu örnek Tiflis'tendir. Ülke genelinde beklemeyin.",
    },
    "platyceps-najadum": {
        "ka": "2026 წლის ქართული ჩამონათვალი სახეობას ბიოლოგიურად დადასტურებულად იღებს. თანამედროვე დასახელებული ნიმუში თმოგვიდანაა (ასპინძა, სამცხე — ჯავახეთი). უფრო ხშირია აღმოსავლეთისა და სამხრეთის მშრალ ქვიან ადგილებში. მთელ ქვეყანაში არ ეძებოთ.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed. A named modern specimen comes from Tmogvi (Aspindza, Samtskhe–Javakheti). It is more often found on dry rocky ground in the east and south. Do not look for it across the whole country.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой. Названный современный экземпляр из Тмогви (Аспиндза, Самцхе–Джавахети). Чаще встречается на сухом каменистом грунте на востоке и юге. Не ищите её по всей стране.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder. Adı geçen modern örnek Tmogvi'dendir (Aspindza, Samtskhe–Cavakheti). Daha çok doğu ve güneyde kuru kayalık zeminde bulunur. Ülke genelinde aramayın.",
    },
    "telescopus-fallax": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს. 2021 წლის ქართული გველების კვლევა მას ღამის სახეობად ასახელებს და მშრალი კლიმატის, ქვიანი ან ბალახოვანი ადგილის ჯგუფს მიაკუთვნებს — ძირითადად აღმოსავლეთ საქართველოში. დასავლეთისა და კოლხეთის დასახელებული ჩანაწერი ამ გვერდზე არ არის. კავკასიურ პოპულაციებს ხშირად ქვესახეობად T. f. iberus მოიხსენიებენ; ტიპის ადგილია თბილისი („Tiflis“).",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed. The 2021 Georgian snake study lists it as nocturnal and groups it with dry-climate species of rocky or grassland settings, mostly in eastern Georgia. This page has no named record from the west or Colchis. Caucasian populations are often called subspecies T. f. iberus; the type locality is Tbilisi (“Tiflis”).",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой. Исследование змей Грузии 2021 года указывает её как ночную и группирует с видами сухого климата каменистых или луговых обстановок, в основном в восточной Грузии. На этой странице нет названной записи с запада или из Колхиды. Кавказские популяции часто называют подвидом T. f. iberus; типовая местность — Тбилиси («Тифлис»).",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder. 2021 Gürcistan yılan çalışması onu gececi listeler ve esas olarak doğu Gürcistan'da kayalık veya otlak kuru iklim türleriyle gruplar. Bu sayfada batı veya Kolhis'ten adı geçen kayıt yoktur. Kafkasya popülasyonları çoğu zaman T. f. iberus alttürü olarak adlandırılır; tip lokalitesi Tbilisi'dir («Tiflis»).",
    },
    "pelobates-syriacus": {
        "ka": "საქართველოში ბიოლოგიურად დადასტურებულია (Tarkhnishvili et al. 2026). საქართველოში ერთადერთი Pelobates-ია. დასავლეთის ნოტიო კოლხეთში ნუ ივარაუდებთ. ჩვეულებრივი მყვარი (P. fuscus) საქართველოში არ გვხვდება. კავკასიური ჯვრიანა (Pelodytes caucasicus) უფრო პატარა და წვრილია და ნოტიო დასავლეთ კავკასიურ ტყეს უკავშირდება, არა აღმოსავლეთის მშრალ ველს.",
        "en": "Tarkhnishvili et al. 2026 treat it as biologically confirmed in Georgia. It is Georgia’s only Pelobates. Do not expect it in humid western Colchis. The common spadefoot (P. fuscus) does not occur in Georgia. The Caucasian parsley frog (Pelodytes caucasicus) is smaller and slimmer and is tied to humid western Caucasian forest, not dry eastern steppe.",
        "ru": "Tarkhnishvili et al. 2026 считают её биологически подтверждённой в Грузии. Это единственный Pelobates Грузии. Не следует ждать её во влажной западной Колхиде. Обыкновенная чесночница (P. fuscus) в Грузии не встречается. Кавказская крестовка (Pelodytes caucasicus) мельче и стройнее и связана с влажным западным кавказским лесом, а не с сухой восточной степью.",
        "tr": "Tarkhnishvili et al. 2026 onu Gürcistan'da biyolojik olarak doğrulanmış kabul eder. Gürcistan'ın tek Pelobates'idir. Nemli batı Kolhis'te beklemeyin. Adi kazayak (P. fuscus) Gürcistan'da bulunmaz. Kafkas maydanoz kurbağası (Pelodytes caucasicus) daha küçük ve incedir ve kuru doğu bozkırına değil, nemli batı Kafkas ormanına bağlıdır.",
    },
    "pelodytes-caucasicus": {
        "ka": "Tarkhnishvili et al. 2026 მას ბიოლოგიურად დადასტურებულად იღებს და კავკასიის ეკორეგიონის დასავლეთის ენდემად ასახელებს — არა მხოლოდ საქართველოს პოლიტიკური საზღვრის. ტიპური ლოკალიტეტია ლომისმთა, ბაკურიანის მახლობლად. იგივე ჩამონათვალში COI ბარკოდი გომბორიდანაა, ფიგურის ლოკალიტეტი — ქისტაური. საქართველოში ერთადერთი Pelodytes-ია.",
        "en": "Tarkhnishvili et al. 2026 treat it as biologically confirmed and endemic to the western Caucasus ecoregion — broader than Georgia’s political border. The type locality is Mount Lomis near Bakuriani. In that checklist the COI barcode is from Gombori and the figure locality is Kistauri. It is Georgia’s only Pelodytes.",
        "ru": "Tarkhnishvili et al. 2026 считают её биологически подтверждённой и эндемиком экорегиона западного Кавказа — шире политической границы Грузии. Типовая местность — гора Ломис близ Бакуриани. В том чек-листе баркид COI из Гомбори, локальность рисунка — Кистаури. Это единственный Pelodytes Грузии.",
        "tr": "Tarkhnishvili et al. 2026 onu biyolojik olarak doğrulanmış ve batı Kafkasya ekobölgesine endemik kabul eder — Gürcistan'ın siyasi sınırından daha geniştir. Tip lokalitesi Bakuriani yakınında Lomis Dağı'dır. O kontrol listesinde COI barkodu Gombori'dendir ve figür lokalitesi Kistauri'dir. Gürcistan'ın tek Pelodytes'idir.",
    },
    "rana-macrocnemis": {
        "ka": "Tarkhnishvili et al. 2026 სახეობას ადასტურებს და საქართველოში ორ მეზობელ ფორმას ასახელებს — R. m. macrocnemis და R. m. camerani; camerani-ს ფორმალური რანგი შემდგომ კვლევას საჭიროებს და აქ ცალკე სახეობად არ არის აყვანილი. საქართველოში ერთადერთი Rana-ა. COI ბარკოდებია ტაბაწყურიდან (camerani) და ბჯოლეთიდან, გურია (macrocnemis). ევროპული მოქნილი ბაყაყი (Rana dalmatina) საქართველოში არ გვხვდება.",
        "en": "Tarkhnishvili et al. 2026 confirm the species and name two neighbouring forms in Georgia — R. m. macrocnemis and R. m. camerani; the formal rank of camerani still needs work and is not treated as a separate species here. It is Georgia’s only Rana. COI barcodes are from Tabatskuri (camerani) and Bjolieti, Guria (macrocnemis). The agile frog (Rana dalmatina) does not occur in Georgia.",
        "ru": "Tarkhnishvili et al. 2026 подтверждают вид и называют две соседние формы в Грузии — R. m. macrocnemis и R. m. camerani; формальный ранг camerani всё ещё требует работы и здесь не трактуется как отдельный вид. Это единственная Rana Грузии. Баркиды COI из Табацхури (camerani) и Бджолиети, Гурия (macrocnemis). Прыткая лягушка (Rana dalmatina) в Грузии не встречается.",
        "tr": "Tarkhnishvili et al. 2026 türü doğrular ve Gürcistan'da iki komşu form adlandırır — R. m. macrocnemis ve R. m. camerani; camerani'nin resmi rütbesi hâlâ iş gerektirir ve burada ayrı tür kabul edilmez. Gürcistan'ın tek Rana'sıdır. COI barkodları Tabatskuri (camerani) ve Bjolieti, Guria (macrocnemis)'dandır. Çevik kurbağa (Rana dalmatina) Gürcistan'da bulunmaz.",
    },
    "emys-orbicularis": {
        "ka": "2026 წლის ქართული ჩამონათვალი მას ბიოლოგიურად დადასტურებულ მშობლიურ სახეობად იღებს — არა ხმელეთის კუ და არა შემოტანილი წითელყურა. დასავლეთ საქართველოში ასახელებს E. o. orbicularis-ს, აღმოსავლეთში — E. o. persica-ს. დასავლეთში დასახელებულია ფოთი და კოლხური სანაპიროს ჭაობები. აღმოსავლეთში ჩამონათვალი ქვესახეობას უთითებს, მაგრამ ამ გვერდზე რუკა აღმოსავლეთ რეგიონებს არ ფარავს.",
        "en": "The 2026 Georgian checklist treats it as a biologically confirmed native species — not a land tortoise and not the introduced slider. In western Georgia it lists E. o. orbicularis; in the east, E. o. persica. In the west, named points include Poti and Colchic coastal wetlands. In the east the checklist assigns a subspecies, but this page does not shade eastern regions on the map.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённым нативным видом — не сухопутная черепаха и не интродуцированная красноухая. В западной Грузии указывает E. o. orbicularis; на востоке — E. o. persica. На западе именованные точки включают Поти и колхидские прибрежные водно-болотные угодья. На востоке чек-лист назначает подвид, но эта страница не затеняет восточные регионы на карте.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış yerli tür kabul eder — bir kara kaplumbağası değildir ve getirilmiş kırmızı yanaklı kaplumbağa da değildir. Batı Gürcistan'da E. o. orbicularis; doğuda E. o. persica listeler. Batıda adı geçen noktalar Poti ve Kolhis kıyı sulak alanlarını içerir. Doğuda kontrol listesi bir alttür atar, ama bu sayfa haritada doğu bölgelerini gölgelemez.",
    },
    "ablepharus-pannonicus": {
        "ka": "საქართველოში მხოლოდ ვაშლოვანის 1973 წლის ჩანაწერია და შემდგომი დადასტურება არ არის. 2026 წლის ჩამონათვალი სახეობას ბიოლოგიურად დადასტურებულად იღებს, მაგრამ ბარკოდირებული ნიმუში არ აქვს. ერთადერთი დასახელებული ადგილი ვაშლოვანია (კახეთი). მთელ ქვეყანაში არ ეძებოთ.",
        "en": "In Georgia it is known only from a 1973 Vashlovani record; no later confirmation is available. The 2026 Georgian checklist treats the species as biologically confirmed but has no barcoded specimen. The only named site is Vashlovani (Kakheti). Do not expect it across Georgia.",
        "ru": "В Грузии известен только по находке 1973 года в Вашловани; позднейших подтверждений нет. Чек-лист Грузии 2026 года считает вид биологически подтверждённым, но баркодированного экземпляра нет. Единственная названная точка — Вашловани (Кахетия). Не следует ожидать его по всей Грузии.",
        "tr": "Gürcistan'da yalnızca 1973 Vashlovani kaydından bilinir; sonraki bir doğrulama yoktur. 2026 Gürcistan kontrol listesi türü biyolojik olarak doğrulanmış kabul eder ancak barkodlu örneği yoktur. Tek adı geçen yer Vashlovani'dir (Kaheti). Gürcistan genelinde beklemeyin.",
    },
    "eremias-arguta": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს. საქართველოში სპორადულად გვხვდება, არა მთელ ქვეყანაში. დასახელებული ბარკოდი სამუხის ველიდანაა (დედოფლისწყაროს მუნიციპალიტეტი). მარდი ფსვენი იმავე სამხრეთ-აღმოსავლეთში უფრო ჩვეულებრივია: ჩამონათვალი მას „საკმაოდ ჩვეულებრივს“ უწოდებს, ამ სახეობას — სპორადულს.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed. In Georgia it is sporadic, not nationwide. The named barcode is from Samukhi Valley (Dedoplistskaro Municipality). The rapid racerunner is more usual in the same southeast: the checklist calls that species fairly common and this one sporadic.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой. В Грузии спорадична, не повсеместна. Именованный баркод из долины Самухи (муниципалитет Дедоплисцкаро). Быстрая ящурка в том же юго-востоке обычнее: чек-лист называет её довольно обычной, а этот вид — спорадическим.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder. Gürcistan'da seyrektir, ülke çapında değildir. Adı geçen barkod Samukhi Vadisi'ndendir (Dedoplistskaro Belediyesi). Aynı güneydoğuda çevik koşar kertenkele daha olağandır: kontrol listesi onu oldukça yaygın, bu türü seyrek sayar.",
    },
    "darevskia-adjarica": {
        "ka": "2026 წლის ქართული ჩამონათვალი მას კანდიდატ სახეობად იღებს, არა დადასტურებულად: დიდი ხანი D. parvula-ს გეოგრაფიულ ქვესახეობად ითვლებოდა. ტიპის ადგილი საქართველოშია — აბასთუმანი. დასახელებული თანამედროვე წერტილებია შუახევი და აბასთუმანი. მთელ ქვეყანაში ნუ ივარაუდებთ. ნამდვილი D. parvula საქართველოს ჩამონათვალში არ შედის. კოლხური კლდის ხვლიკი (D. mixta) აჭარაში არ არის.",
        "en": "The 2026 Georgian checklist treats it as a candidate species, not confirmed: it was long a geographic subspecies of D. parvula. The type locality is in Georgia — Abastumani. Named modern points are Shuakhevi and Abastumani. Do not assume it throughout the country. True D. parvula is not on the Georgian checklist. The mixed rock lizard (D. mixta) is absent from Adjara.",
        "ru": "Чек-лист Грузии 2026 года считает её кандидатным видом, не подтверждённым: долгое время это был географический подвид D. parvula. Типовая локальность в Грузии — Абастумани. Названные современные точки — Шуахеви и Абастумани. Не считайте, что она по всей стране. Настоящая D. parvula в чек-лист Грузии не входит. Смешанная скальная ящерица (D. mixta) в Аджарии отсутствует.",
        "tr": "2026 Gürcistan kontrol listesi onu aday tür kabul eder, doğrulanmış değil: uzun süre D. parvula'nın coğrafi alttürüydü. Tip lokalitesi Gürcistan'dadır — Abastumani. Adı geçen modern noktalar Shuakhevi ve Abastumani'dir. Ülke genelinde varsaymayın. Gerçek D. parvula Gürcistan kontrol listesinde yoktur. Karışık kayalık kertenkele (D. mixta) Acara'da yoktur.",
    },
    "darevskia-clarkorum": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს. მთელ საქართველოში ნუ ივარაუდებთ: დასახელებული თანამედროვე ბარკოდები და თავის ქერცლის ფიგურები ჭარნალის ხეობიდანაა (ხელვაჩაურის მუნიციპალიტეტი). ამ ატლასის რუკა აჭარას აჩვენებს ამ ჩანაწერებიდან და არ ნიშნავს, რომ სახეობა რეგიონის ყოველ ხეობაშია. აჭარული კლდის ხვლიკი (D. adjarica) ჩამონათვალში კანდიდატია; დასახელებული ბარკოდები შუახევიდანაა, არა ჭარნალიდან.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed. Do not assume it throughout Georgia: named modern barcodes and head-scale figures are from the Charnali river valley (Khelvachauri Municipality). This atlas map marks Adjara from those records; it does not mean the species occurs in every gorge in the region. The Ajarian rock lizard (D. adjarica) is a candidate on the checklist; named barcodes are from Shuakhevi, not Charnali.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой. Не считайте, что она по всей Грузии: названные современные баркоды и рисунки чешуи головы — из долины реки Чарнали (муниципалитет Хелвачаури). Карта этого атласа отмечает Аджарию по этим находкам; это не значит, что вид есть в каждом ущелье региона. Аджарская скальная ящерица (D. adjarica) в чек-листе кандидат; названные баркоды из Шуахеви, не из Чарнали.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder. Gürcistan genelinde varsaymayın: adlı modern barkodlar ve baş pulu figürleri Charnali nehir vadisindendir (Khelvachauri Belediyesi). Bu atlas haritası o kayıtlardan Acara'yı işaretler; türün bölgedeki her boğazda bulunduğu anlamına gelmez. Acar kayalık kertenkelesi (D. adjarica) kontrol listesinde adaydır; adlı barkodlar Shuakhevi'dendir, Charnali değil.",
    },
    "darevskia-daghestanica": {
        "ka": "2026 წლის ჩამონათვალი სახეობას ბიოლოგიურად დადასტურებულად იღებს. დასახელებული თანამედროვე წერტილებია თუშეთი (შტრიხკოდი) და ახმეტის მუნიციპალიტეტი, თბათანას მთა (ფიგურა). მთელ ქვეყანაში არ ეძებოთ: დასავლეთისა და სამხრეთის ვაკეებზე არ არის მოსალოდნელი. კავკასიონის ხვლიკი (D. caucasica) ფერით ვერ გაირჩევა; საველე პირობებში უსაფრთხო განსხვავება არის ადგილი.",
        "en": "The 2026 Georgian checklist treats the species as biologically confirmed. Named modern points are Tusheti (barcode) and Akhmeta municipality, Tbatana Mountain (figure). Do not look for it across the whole country: it is not expected on western or southern lowlands. Colour does not separate it from the Caucasian rock lizard (D. caucasica); in the field the safer difference is locality.",
        "ru": "Чек-лист Грузии 2026 года считает вид биологически подтверждённым. Названные современные точки — Тушети (баркод) и муниципалитет Ахмета, гора Тбатана (рисунок). Не ищите её по всей стране: на западных или южных низменностях не ожидается. Цвет не отделяет её от кавказской скальной ящерицы (D. caucasica); в поле более надёжное различие — место.",
        "tr": "2026 Gürcistan kontrol listesi türü biyolojik olarak doğrulanmış kabul eder. Adı geçen modern noktalar Tusheti (barkod) ve Akhmeta belediyesi, Tbatana Dağı'dır (figür). Ülke genelinde aramayın: batı veya güney ovalarında beklenmez. Renk onu Kafkas kayalık kertenkelesinden (D. caucasica) ayırmaz; sahada daha güvenli fark lokalitedir.",
    },
    "darevskia-dahli": {
        "ka": "2026 წლის ჩამონათვალი სახეობას ბიოლოგიურად დადასტურებულ ჰიბრიდულ ფორმად იღებს: მშობლები კოლხური კლდის ხვლიკი (D. mixta) და მტკვრის ხვლიკი (D. portschinskii). პართენოგენურია — ველზე თითქმის მხოლოდ მდედრებს ხედავთ. დასახელებული თანამედროვე ნიმუში ქოჯორიდანაა. მთელ საქართველოში არ ეძებოთ.",
        "en": "The 2026 checklist treats it as a biologically confirmed hybrid form whose parents are the Georgian lizard (D. mixta) and the Kura lizard (D. portschinskii). It is parthenogenetic: almost every animal you see is female. The named modern voucher is from Kojori. Do not expect it throughout the country.",
        "ru": "Чек-лист 2026 года считает её биологически подтверждённой гибридной формой, родители которой — грузинская ящерица (D. mixta) и куринская ящерица (D. portschinskii). Партеногенетическая: почти каждое увиденное животное — самка. Названный современный ваучер из Коджори. Не ожидайте её по всей стране.",
        "tr": "2026 kontrol listesi onu ebeveynleri Gürcü kertenkele (D. mixta) ve Kura kertenkelesi (D. portschinskii) olan biyolojik olarak doğrulanmış hibrit form kabul eder. Partenogenetiktir: gördüğünüz hemen her hayvan dişidir. Adı geçen modern voucher Kojori'dendir. Ülke genelinde beklemeyin.",
    },
    "darevskia-derjugini": {
        "ka": "2026 წლის ჩამონათვალი სახეობას ბიოლოგიურად დადასტურებულად იღებს. დასახელებული თანამედროვე წერტილებია ლაგოდეხი, სიონი, მულახი, რაჭა, ბანისხევი და კინტრიში. მთელ ქვეყანაში არ ეძებოთ: მშრალ ვაკეზე და ღია სტეპში არ არის მოსალოდნელი. კლდის Darevskia იმავე ხეობაში შეიძლება იყოს, მაგრამ კლდეზეა, თავი უფრო ბრტყელი.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed. Named modern points include Lagodekhi, Sioni, Mulakhi, Racha, Baniskhevi and Kintrishi. Do not look for it across the whole country: dry plains and open steppe are not expected habitat. Rock Darevskia may occur in the same gorge but are on rock, with a flatter head.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой. Названные современные точки включают Лагодехи, Сиони, Мулахи, Рача, Банисхеви и Кинтриши. Не ищите её по всей стране: сухие равнины и открытая степь не ожидаемое местообитание. Скальные Darevskia могут быть в том же ущелье, но на скале, с более плоской головой.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder. Adı geçen modern noktalar Lagodekhi, Sioni, Mulakhi, Racha, Baniskhevi ve Kintrishi içerir. Ülke genelinde aramayın: kuru ovalar ve açık bozkır beklenen habitat değildir. Kayalık Darevskia aynı boğazda olabilir ama kayadadır, baş daha yassıdır.",
    },
    "darevskia-mixta": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს, არა კანდიდატად. დასავლეთ საქართველოს ენდემია აჭარის გარეშე. დასახელებული თანამედროვე წერტილებია საირმე, ჩხოროწყუ და ბანისხევი. mixta აჭარაში არ არის. თურქული ხვლიკი (D. clarkorum) გეოგრაფიულად იზოლირებულია — სამხრეთ-დასავლეთში, მაგ. ჭარნალის ხეობა.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed, not as a candidate. It is endemic to western Georgia excluding Adjara. Named modern points are Sairme, Tchkhorotskhu and Baniskhevi. mixta is absent from Adjara. Clark's rock lizard (D. clarkorum) is geographically isolated — in the southwest, e.g. the Charnali valley.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой, не кандидатом. Эндемик западной Грузии без Аджарии. Названные современные точки — Саирме, Чхороцку и Банисхеви. mixta в Аджарии нет. Ящерица Кларка (D. clarkorum) географически изолирована — на юго-западе, например долина Чарнали.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder, aday değil. Acara hariç batı Gürcistan'a endemiktir. Adlı modern noktalar Sairme, Tchkhorotskhu ve Baniskhevi'dir. mixta Acara'da yoktur. Clark kayalık kertenkelesi (D. clarkorum) coğrafi olarak yalıtılmıştır — güneybatıda, örneğin Charnali vadisi.",
    },
    "darevskia-portschinskii": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს, არა კანდიდატად. ორსქესიანია — ეს პრაქტიკული განსხვავებაა პართენოგენ დალის ხვლიკისგან (D. dahli). ტიპის ადგილი თბილისია. დასახელებული თანამედროვე წერტილი ქოჯორია. მთელ საქართველოში ნუ ივარაუდებთ. სახეობა მცირე კავკასიონის ცენტრალური ნაწილის ენდემია და სომხეთსა და აზერბაიჯანშიცაა — საქართველოს ენდემი არ არის.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed, not a candidate. It is bisexual — the practical difference from parthenogenetic Dahl’s lizard (D. dahli). The type locality is Tbilisi. The named modern point is Kojori. Do not expect it throughout Georgia. The species is endemic to the central Lesser Caucasus and also occurs in Armenia and Azerbaijan — it is not a Georgia-only endemic.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой, не кандидатом. Она двуполая — практическое отличие от партеногенетической ящерицы Даля (D. dahli). Типовая локальность — Тбилиси. Названная современная точка — Коджори. Не ожидайте её по всей Грузии. Вид эндемичен для центрального Малого Кавказа и также встречается в Армении и Азербайджане — это не эндем только Грузии.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder, aday değil. Biseksüeldir — partenogenetik Dahl kertenkelesinden (D. dahli) pratik fark. Tip lokalitesi Tiflis'tir. Adlı modern nokta Kojori'dir. Gürcistan genelinde beklemeyin. Tür orta Küçük Kafkasya'ya endemiktir ve ayrıca Ermenistan ve Azerbaycan'da bulunur — yalnızca Gürcistan endemi değildir.",
    },
    "darevskia-praticola": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს, არა კანდიდატად. ქართული პოპულაციები აღმოსავლეთ და ცენტრალურ საქართველოს ეკუთვნის. დასავლეთის ნოტიო კოლხეთსა და შავი ზღვის სანაპიროზე ამ ანგარიშში ponticaა, არა ეს სახეობა. კოლხური მდელოს ხვლიკი (D. pontica) ფერით ვერ გაირჩევა; გავრცელება უფრო სანდოა.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed, not as a candidate species. Georgian populations belong to eastern and central Georgia. Humid Colchis and the Black Sea coast are pontica in this account, not this species. Colour does not separate the Pontic meadow lizard (D. pontica); range is more reliable than dorsal pattern.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой, не кандидатным видом. Грузинские популяции относятся к восточной и центральной Грузии. Влажная Колхида и черноморское побережье в этом очерке — pontica, не этот вид. Цвет не отделяет понтийскую луговую ящерицу (D. pontica); распространение надёжнее спинного рисунка.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder, aday tür değil. Gürcistan popülasyonları doğu ve orta Gürcistan'a aittir. Nemli Kolhis ve Karadeniz kıyısı bu hesapta pontica'dır, bu tür değil. Renk Pontik çayır kertenkelesini (D. pontica) ayırmaz; yayılış sırt deseninden daha güvenilirdir.",
    },
    "darevskia-valentini": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს, არა კანდიდატად. დასახელებული ჩანაწერები ნინოწმინდის მუნიციპალიტეტშია — საღამოს ტბა და კირხბულაქის მდინარე. მთელ ქვეყანაში ნუ ივარაუდებთ. სომხური კლდის ხვლიკი (D. armeniaca) პართენოგენია და იგივე საღამოს ტბაზე თანაარსებობენ; ფერი საკმარისი არ არის.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed, not as a candidate species. Named records are in Ninotsminda Municipality — Saghamo Lake and the Kirkhbulaki River. Do not assume it throughout the country. The Armenian rock lizard (D. armeniaca) is parthenogenetic and co-occurs at the same Saghamo Lake; colour is still not enough.",
        "ru": "Чек-лист Грузии 2026 года считает её биологически подтверждённой, не кандидатным видом. Названные находки в муниципалитете Ниноцминда — озеро Сагамо и река Кирхбулаки. Не считайте её по всей стране. Армянская скальная ящерица (D. armeniaca) партеногенетическая и сосуществует на том же озере Сагамо; цвета всё равно недостаточно.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder, aday tür değil. Adlı kayıtlar Ninotsminda Belediyesi'ndedir — Saghamo Gölü ve Kirkhbulaki Nehri. Ülke genelinde varsaymayın. Ermeni kayalık kertenkelesi (D. armeniaca) partenogenetiktir ve aynı Saghamo Gölü'nde birlikte bulunur; renk yine yeterli değildir.",
    },
    "zamenis-hohenackeri": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს; ქვეყანაში გვხვდება ნომინოტიპური ქვესახეობა Z. h. hohenackeri. ხშირად ერევა ესკულაპის მცურავს (Zamenis longissimus), რომელიც ზრდასრულობაში ხშირად უფრო ერთფეროვანია და უფრო ნოტიო, ტყიან ადგილს უკავშირდება. ეს სახეობა ლაქებს ინარჩუნებს.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed; the subspecies in Georgia is Z. h. hohenackeri. It is often confused with the Aesculapian snake (Zamenis longissimus), which is often more uniform as an adult and is tied to more humid, wooded country. This species keeps its blotches.",
        "ru": "Чек-лист Грузии 2026 года считает его биологически подтверждённым; подвид в Грузии — Z. h. hohenackeri. Часто путают с эскулаповым полозом (Zamenis longissimus), который во взрослом состоянии чаще однотоннее и связан с более влажной, лесистой местностью. Этот вид сохраняет пятна.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder; Gürcistan'daki alttür Z. h. hohenackeri'dir. Çoğu zaman Eskülap yılanı (Zamenis longissimus) ile karışır; o erişkinde çoğu zaman daha düz renklidir ve daha nemli, ormanlı ülkeye bağlıdır. Bu tür lekelerini korur.",
    },
    "hemorrhois-ravergieri": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს. დასახელებული ადგილია ასპინძა, თმოგვი — სამცხე — ჯავახეთში. 2021 წლის კვლევა მას მშრალი კლიმატის, ქვიანი ან ბალახოვანი ადგილის სახეობებს მიაკუთვნებს და ძირითადად აღმოსავლეთ საქართველოს უკავშირებს. მთელ ქვეყანაში არ ეძებოთ.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed. The named locality is Aspindza, Tmogvi, in Samtskhe — Javakheti. The 2021 Georgian snake survey places it among dry-climate species of rocky or grassland habitats, mostly in eastern Georgia. Do not expect it throughout the country.",
        "ru": "Чек-лист Грузии 2026 года считает его биологически подтверждённым. Названная точка — Аспиндза, Тмогви, в Самцхе — Джавахети. Обзор змей Грузии 2021 года относит его к видам сухого климата каменистых или травянистых местообитаний, в основном в восточной Грузии. Не ждите его по всей стране.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder. Adlandırılmış yer, Samtshe — Cavaheti’deki Aspindza, Tmogvi’dir. 2021 Gürcistan yılan taraması onu kayalık veya çayır habitatlı kuru iklim türleri arasında, çoğunlukla doğu Gürcistan’da yerleştirir. Ülke genelinde beklemeyin.",
    },
    "eirenis-modestus": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს; ქვესახეობა აქ ნომინოტიპურია — E. m. modestus. დასახელებული ნიმუში თბილისიდანაა. აღმოსავლეთ და ცენტრალურ საქართველოშია. დასავლეთ საქართველოსა და კოლხეთში დასახელებული ჩანაწერი ამ გვერდზე არ არის. ხშირად ერევა საყელოიან ეირენისს (Eirenis collaris), რომელიც ჩამონათვალში სამხრეთ-აღმოსავლეთს უკავშირდება.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed; the subspecies here is nominotypical E. m. modestus. A named specimen is from Tbilisi. It occurs in eastern and central Georgia. This page has no named western or Colchic locality. It is often confused with the collared dwarf snake (Eirenis collaris), which the checklist places in the southeast.",
        "ru": "Чек-лист Грузии 2026 года считает его биологически подтверждённым; подвид здесь номинативный E. m. modestus. Именованный экземпляр из Тбилиси. Встречается в восточной и центральной Грузии. На этой странице нет именованной западной или колхидской локальности. Часто путают с ошейниковым эйренисом (Eirenis collaris), которого чек-лист размещает на юго-востоке.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder; buradaki alttür nominotipik E. m. modestus'tur. Adı geçen örnek Tiflis'tendir. Doğu ve orta Gürcistan'da bulunur. Bu sayfada adı geçen bir batı veya Kolhis lokalitesi yoktur. Çoğu zaman güneydoğuya yerleştirilen yakalı cüce yılan (Eirenis collaris) ile karıştırılır.",
    },
    "eirenis-collaris": {
        "ka": "2026 წლის ჩამონათვალი მას ბიოლოგიურად დადასტურებულ სახეობად იღებს; ქვესახეობა აქ ნომინოტიპურია — E. c. collaris. დასახელებული ნიმუში დედოფლისწყაროს მუნიციპალიტეტიდანაა, თარიბანიდან. სამხრეთ-აღმოსავლეთ საქართველოშია. მთელ ქვეყანაში არ ეძებოთ. ხშირად ერევა წყნარ ეირენისს (Eirenis modestus), რომელიც ჩამონათვალში აღმოსავლეთსა და ცენტრალურ საქართველოს უკავშირდება.",
        "en": "The 2026 Georgian checklist treats it as biologically confirmed; the subspecies here is nominotypical E. c. collaris. A named specimen is from Taribana in Dedoplistskaro municipality. It occurs in southeastern Georgia. Do not look for it across the whole country. It is often confused with the ring-headed dwarf snake (Eirenis modestus), which the checklist places in eastern and central Georgia.",
        "ru": "Чек-лист Грузии 2026 года считает его биологически подтверждённым; подвид здесь номинативный E. c. collaris. Именованный экземпляр из Тарибаны в муниципалитете Дедоплисцкаро. Встречается в юго-восточной Грузии. Не ищите его по всей стране. Часто путают со скромным эйренисом (Eirenis modestus), которого чек-лист размещает в восточной и центральной Грузии.",
        "tr": "2026 Gürcistan kontrol listesi onu biyolojik olarak doğrulanmış kabul eder; buradaki alttür nominotipik E. c. collaris'tir. Adı geçen örnek Dedoplistskaro belediyesindeki Taribana'dandır. Güneydoğu Gürcistan'da bulunur. Ülke genelinde aramayın. Çoğu zaman halkalı başlı cüce yılan (Eirenis modestus) ile karıştırılır; kontrol listesi onu doğu ve orta Gürcistan'a yerleştirir.",
    },
    "malpolon-insignitus": {
        "ka": "2026 წლის ქართული ჩამონათვალი მას ჩამონათვალში იღებს, მაგრამ სახეობრივ რანგს კანდიდატად ტოვებს: შედის M. monspessulanus-ის კომპლექსში. დასახელებული ბარკოდირებული ნიმუში ჩაჩუნას აღკვეთილიდანაა (კახეთი). 2021 წლის კვლევა მას მხოლოდ სამხრეთ-აღმოსავლეთის ნახევრადმშრალ ლანდშაფტში ათავსებს — მთელ ქვეყანაში არ ეძებოთ.",
        "en": "The 2026 Georgian checklist includes it but treats full species rank as a candidate: it belongs to the M. monspessulanus complex. A named barcoded specimen is from Chachuna Managed Reserve (Kakheti). The 2021 Georgian snake survey places it only in south-eastern semi-arid country — do not look for it across the whole country.",
        "ru": "Чек-лист Грузии 2026 года её включает, но полный видовой ранг считает кандидатным: она принадлежит к комплексу M. monspessulanus. Именованный баркодированный экземпляр — из управляемого резервата Чачуна (Кахетия). Обзор змей Грузии 2021 года помещает её только в юго-восточную полузасушливую страну — не ищите её по всей стране.",
        "tr": "2026 Gürcistan kontrol listesi onu içerir ama tam tür rütbesini aday kabul eder: M. monspessulanus kompleksine aittir. Adı geçen barkodlu örnek Chachuna Yönetilen Koruma Alanı'ndandır (Kaheti). 2021 Gürcistan yılan taraması onu yalnızca güneydoğu yarı kurak ülkeye yerleştirir — tüm ülkede aramayın.",
    },
}


def main() -> None:
    updated = []
    skipped = []
    for sid, locs in TRAITS.items():
        for loc, body in locs.items():
            p = root / sid / f"{loc}.mdx"
            text = p.read_text(encoding="utf-8")
            idx = text.find("identification:")
            facts = text.find("\nfacts:", idx)
            faq = text.find("\nfaq:", idx)
            insert_at = facts if facts != -1 and (faq == -1 or facts < faq) else faq
            if insert_at == -1:
                raise SystemExit(f"no insert point {sid} {loc}")
            chunk = text[idx:insert_at]
            n = chunk.count("\n    - >-")
            if n >= 5:
                skipped.append(f"{sid}/{loc} already {n}")
                continue
            if n != 4:
                raise SystemExit(f"unexpected trait count {n} {sid} {loc}")
            text = text[:insert_at] + wrap_trait(body) + text[insert_at:]
            p.write_text(text, encoding="utf-8")
            updated.append(f"{sid}/{loc}")
    print("updated_files", len(updated))
    print("species", len({u.split("/")[0] for u in updated}))
    print("skipped", skipped or "none")
    for sid in TRAITS:
        n = (root / sid / "ka.mdx").read_text(encoding="utf-8")
        idx = n.find("identification:")
        facts = n.find("\nfacts:", idx)
        faq = n.find("\nfaq:", idx)
        insert_at = facts if facts != -1 and (faq == -1 or facts < faq) else faq
        chunk = n[idx:insert_at]
        print(sid, "ka", chunk.count("\n    - >-"), "faq", n.count("\n  - question:"))


if __name__ == "__main__":
    main()
