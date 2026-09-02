import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const BATUMELEBI_MAY =
  "https://batumelebi.netgazeti.ge/news/614881/";
const BATUMELEBI_JUNE =
  "https://batumelebi.netgazeti.ge/news/618640/";

const PHOTO_COAST: NewsPhoto = {
  src: "https://cdn.reptiles.ge/regions/adjara.jpg",
  fromAtlas: true,
  alt: {
    ka: "აჭარის სანაპირო. ატლასის ფოტო; ეს გამორიყული დელფინი არ არის.",
    en: "The Adjara coast. Photograph from the atlas; this is not a stranded dolphin.",
    ru: "Побережье Аджарии. Фото из атласа; это не выброшенный дельфин.",
    tr: "Acara kıyısı. Atlas fotoğrafı; bu karaya vurmuş yunus değil.",
  },
};

export const GEORGIA_DOLPHIN_STRANDINGS_2026: NewsArticle = {
  id: "georgia-dolphin-strandings-2026",
  slug: "georgia-dolphin-strandings-2026",
  status: "published",
  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",
  relatedSpeciesIds: [],
  relatedRegionIds: ["adjara", "samegrelo"],
  relatedHubIds: ["mammals"],
  image: PHOTO_COAST,
  sources: [
    {
      name: "Batumelebi — 4 May 2026, Archil Guchmanidze interview",
      url: BATUMELEBI_MAY,
    },
    {
      name: "Batumelebi — 1 June 2026, National Environmental Agency reply",
      url: BATUMELEBI_JUNE,
    },
  ],
  copy: {
    ka: {
      title: "სარფიდან ანაკლიამდე ორ თვეში 40-მდე დელფინი გამორიყა",
      metaTitle: "სარფიდან ანაკლიამდე ორ თვეში 40-მდე დელფინი გამორიყა",
      metaDescription:
        "არჩილ გუჩმანიძე: 1 მარტიდან 1 მაისამდე სარფი–ანაკლიის მონაკვეთზე 40-მდე დელფინი გამორიყა — ათ წელში ყველაზე მეტი. გარემოს ეროვნულმა სააგენტომ მიზეზი არ დაასახელა.",
      dek: "გუჩმანიძის 17-წლიანი დაკვირვების მიხედვით, ეს ბოლო ათწლეულის ყველაზე მაღალი მაჩვენებელია. დელფინების გამორიყვის მიზეზი სააგენტოს ამ ეტაპზე არ დაუსახელებია.",
      lead: "იქთიოლოგი, ბიოლოგიის დოქტორი არჩილ გუჩმანიძე „ბათუმელებს“ 4 მაისს უთხრა, რომ 2026 წლის 1 მარტიდან 1 მაისამდე მხოლოდ სარფი–ანაკლიის მონაკვეთზე ზღვამ 40-მდე დელფინი გამორიყა. ეს მისი დაკვირვებით ბოლო ათი წლის ყველაზე მაღალი მაჩვენებელია. სანაპიროზე გამორიყულ დელფინებს 17 წელია ითვლის. სახეობებად ეს 40 არ არის გაყოფილი.",
      sections: [
        {
          heading: "რა არის დათვლილი?",
          blocks: [
            {
              type: "p",
              parts: [
                "ეს რიცხვი მხოლოდ ",
                {
                  type: "region",
                  id: "adjara",
                  label: "სარფიდან",
                },
                " ",
                {
                  type: "region",
                  id: "samegrelo",
                  label: "ანაკლიამდე",
                },
                " მონაკვეთს ეხება და 1 მარტიდან 1 მაისამდე პერიოდს მოიცავს. გუჩმანიძე ამბობს, რომ 17 წლის სერიაში ასეთი მონაცემი არ ჰქონია. 1 ივნისს „ბათუმელები“ კვარიათში კიდევ ერთ გამორიყვას აღწერს; ეს ორმოცში არ არის ჩათვლილი.",
              ],
            },
          ],
        },
        {
          heading: "მიზეზი დასახელებული არ არის",
          blocks: [
            {
              type: "p",
              parts: [
                "გუჩმანიძე ამბობს, რომ გამორიყვის შემთხვევების ზრდას შესწავლა სჭირდება და რომელმა ფაქტორმა იმოქმედა, ამ ეტაპზე დადგენილი არ არის. მაისში გარემოს ეროვნულმა სააგენტომ „ბათუმელებს“ უთხრა, რომ სპეციალისტები სანაპიროზე გავიდნენ, თუმცა საბოლოო ინფორმაცია ჯერ არ ჰქონდათ და სრული კვლევა გადაწყვეტილი არ იყო. ივნისში სააგენტომ დაწერა, რომ კომპლექსური კვლევა ჩაატარა; გამორიყვის მიზეზი მაინც არ დაასახელა. ამ გვერდზე მიზეზს არ ვვარაუდობთ.",
              ],
            },
            {
              type: "p",
              parts: [
                "ატლასში შავი ზღვის კეტაცეები არ არის. ",
                { type: "hub", id: "mammals", label: "ძუძუმწოვრების ჰაბი" },
                " რჩება ძირითად ჩანაწერად; ",
                { type: "news-index", label: "სიახლეები" },
                " მხოლოდ ამ აღრიცხვას უმატებს.",
              ],
            },
          ],
        },
      ],
    },
    en: {
      title: "About 40 dolphins washed ashore from Sarpi to Anaklia in two months",
      metaTitle:
        "About 40 dolphins washed ashore from Sarpi to Anaklia in two months",
      metaDescription:
        "Archil Guchmanidze: about 40 dolphins came ashore on the Sarpi–Anaklia stretch from 1 March to 1 May — the highest in a decade. The National Environmental Agency named no cause.",
      dek: "According to Guchmanidze’s 17-year record, this is the highest figure of the past decade. The agency has not named a cause for the strandings at this stage.",
      lead: "Ichthyologist Archil Guchmanidze told Batumelebi on 4 May that from 1 March to 1 May 2026 about 40 dolphins washed ashore on the Sarpi–Anaklia stretch alone. He called it the highest figure in the last ten years of his counts. He has monitored Georgian strandings for 17 years. The 40 are not split by species.",
      sections: [
        {
          heading: "What was counted?",
          blocks: [
            {
              type: "p",
              parts: [
                "The number is only the stretch from ",
                {
                  type: "region",
                  id: "adjara",
                  label: "Sarpi",
                },
                " to ",
                {
                  type: "region",
                  id: "samegrelo",
                  label: "Anaklia",
                },
                ", over two months. Guchmanidze says his 17-year series had no such figure. On 1 June Batumelebi reports another stranding at Kvariati; that animal is not in the forty.",
              ],
            },
          ],
        },
        {
          heading: "No cause has been named",
          blocks: [
            {
              type: "p",
              parts: [
                "Guchmanidze says the rise needs study and that which factor acted is not established. In May the National Environmental Agency told Batumelebi that specialists had inspected the coast, had no final information, and had not confirmed a full investigation. In June the agency wrote that it had carried out a complex study; it still did not name a cause of the strandings. This page does not guess one.",
              ],
            },
            {
              type: "p",
              parts: [
                "Black Sea cetaceans are not in this atlas. The ",
                { type: "hub", id: "mammals", label: "mammals hub" },
                " remains the main record; ",
                { type: "news-index", label: "news" },
                " only adds this count.",
              ],
            },
          ],
        },
      ],
    },
    ru: {
      title: "От Сарпи до Анаклии за два месяца выбросило около 40 дельфинов",
      metaTitle:
        "От Сарпи до Анаклии за два месяца выбросило около 40 дельфинов",
      metaDescription:
        "Арчил Гучманидзе: с 1 марта по 1 мая на участке Сарпи–Анаклия выбросило около 40 дельфинов — максимум за десять лет. Нацагентство среды причину не назвало.",
      dek: "По 17-летним наблюдениям Гучманидзе это самый высокий показатель последнего десятилетия. Причину выброса дельфинов агентство на данном этапе не назвало.",
      lead: "Ихтиолог, доктор биологических наук Арчил Гучманидзе 4 мая сказал «Батумелеби», что с 1 марта по 1 мая 2026 года только на участке Сарпи–Анаклия море выбросило около 40 дельфинов. По его учёту это самый высокий показатель за последние десять лет. Выбросы на грузинском берегу он считает 17 лет. Эти 40 по видам не разделены.",
      sections: [
        {
          heading: "Что сосчитано?",
          blocks: [
            {
              type: "p",
              parts: [
                "Число относится только к участку от ",
                {
                  type: "region",
                  id: "adjara",
                  label: "Сарпи",
                },
                " до ",
                {
                  type: "region",
                  id: "samegrelo",
                  label: "Анаклии",
                },
                " за два месяца. Гучманидзе говорит, что в 17-летней серии такого не было. 1 июня «Батумелеби» описывает ещё один выброс в Квариати; в сорок он не входит.",
              ],
            },
          ],
        },
        {
          heading: "Причина не названа",
          blocks: [
            {
              type: "p",
              parts: [
                "Гучманидзе говорит, что рост статистики нужно изучать и какой фактор сработал, пока не установлено. В мае Национальное агентство окружающей среды сказало «Батумелеби», что специалисты выехали на берег, окончательной информации нет и полное исследование ещё не решено. В июне агентство написало, что провело комплексное исследование; причину выбросов всё равно не назвало. На этой странице причину не угадываем.",
              ],
            },
            {
              type: "p",
              parts: [
                "Китов черноморских в атласе нет. ",
                { type: "hub", id: "mammals", label: "Страница млекопитающих" },
                " остаётся основной записью; ",
                { type: "news-index", label: "новости" },
                " лишь добавляют этот учёт.",
              ],
            },
          ],
        },
      ],
    },
    tr: {
      title: "Sarpi’den Anaklia’ya iki ayda 40’a yakın yunus karaya vurdu",
      metaTitle:
        "Sarpi’den Anaklia’ya iki ayda 40’a yakın yunus karaya vurdu",
      metaDescription:
        "Arçil Guçmanidze: 1 Mart–1 Mayıs’ta yalnızca Sarpi–Anaklia kesiminde 40’a yakın yunus karaya vurdu — on yılın en yükseği. Çevre Ulusal Ajansı nedeni adlandırmadı.",
      dek: "Guçmanidze’nin 17 yıllık gözlemine göre bu, son on yılın en yüksek rakamı. Ajans yunusların karaya vurma nedenini bu aşamada belirtmedi.",
      lead: "İhtiyolog, biyoloji doktoru Arçil Guçmanidze 4 Mayıs’ta Batumelebi’ye, 1 Mart–1 Mayıs 2026’da yalnızca Sarpi–Anaklia kesiminde denizin 40’a yakın yunus karaya vurduğunu söyledi. Kendi sayımına göre bu, son on yılın en yüksek rakamı. Gürcistan kıyısındaki karaya vurmaları 17 yıldır izliyor. Bu 40, türlere ayrılmamış.",
      sections: [
        {
          heading: "Ne sayıldı?",
          blocks: [
            {
              type: "p",
              parts: [
                "Sayı yalnızca ",
                {
                  type: "region",
                  id: "adjara",
                  label: "Sarpi’den",
                },
                " ",
                {
                  type: "region",
                  id: "samegrelo",
                  label: "Anaklia’ya",
                },
                " kesimi, iki ay. Guçmanidze 17 yıllık dizide böyle bir rakam olmadığını söylüyor. 1 Haziran’da Batumelebi Kvariati’de bir karaya vurma daha yazıyor; bu kırka dahil değil.",
              ],
            },
          ],
        },
        {
          heading: "Neden adlandırılmadı",
          blocks: [
            {
              type: "p",
              parts: [
                "Guçmanidze, istatistiğin artışının incelenmesi gerektiğini ve hangi etkenin işe yaradığının bu aşamada belli olmadığını söylüyor. Mayıs’ta Çevre Ulusal Ajansı Batumelebi’ye uzmanların kıyıya çıktığını, kesin bilgilerinin olmadığını ve tam araştırmanın henüz kararlaştırılmadığını söyledi. Haziran’da ajans karmaşık bir çalışma yaptığını yazdı; karaya vurmanın nedenini yine adlandırmadı. Bu sayfada neden tahmin etmiyoruz.",
              ],
            },
            {
              type: "p",
              parts: [
                "Karadeniz setaseleri bu atlas’ta yok. ",
                { type: "hub", id: "mammals", label: "Memeliler sayfası" },
                " ana kayıt olarak kalır; ",
                { type: "news-index", label: "haberler" },
                " yalnızca bu sayımı ekler.",
              ],
            },
          ],
        },
      ],
    },
  },
};
