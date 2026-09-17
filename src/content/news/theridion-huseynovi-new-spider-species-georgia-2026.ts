import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const ZOOTAXA_URL = "https://doi.org/10.11646/zootaxa.5866.2.2";
const WSC_URL = "https://wsc.nmbe.ch/spec-data/73992/species";
const CAUCASIANA_URL = "https://doi.org/10.3897/caucasiana.3.e120883";
const PHOTO_DIR =
  "https://cdn.reptiles.ge/images/news/theridion-huseynovi-new-spider-species-georgia-2026";

const PHOTO_THERIDION_HUSEYNOVI: NewsPhoto = {
  alt: {
    en: "Theridion huseynovi on a white background.",
    ka: "Theridion huseynovi თეთრ ფონზე.",
    ru: "Theridion huseynovi на белом фоне.",
    tr: "Beyaz zemin üzerinde Theridion huseynovi.",
  },
  plate: true,
  src: `${PHOTO_DIR}/theridion-huseynovi.png`,
};

export const THERIDION_HUSEYNOVI_NEW_SPIDER_SPECIES_GEORGIA_2026: NewsArticle =
  {
    copy: {
      en: {
        dek: "In August 2026, scientists described Theridion huseynovi as a species new to science. It is known from Georgia, Azerbaijan, and Iran, and the Georgian material had previously been treated as another species.",
        lead:
          "In 2026, work on South Caucasus spiders revealed another species new to science. Theridion huseynovi, a spider in the family Theridiidae, was formally described as a new species and confirmed from Georgia, Azerbaijan, and Iran.",
        metaDescription:
          "Scientists described Theridion huseynovi as a spider species new to science. The species is confirmed from Georgia, Azerbaijan, and Iran.",
        metaTitle:
          "A new spider species also occurs in Georgia — Theridion huseynovi",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "The study was published in Zootaxa on 11 August 2026. The authors are Alireza Zamani, Armen Seropian, and Yuri M. Marusik.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The Georgian part of the story is especially interesting: the specimens had been collected several years earlier, but were then identified as another species, ",
                  { name: "Theridion cinereum", type: "sci" },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "A new species, not a first Georgian find",
          },
          {
            blocks: [
              {
                parts: [
                  "Georgian material was collected at two sites in 2023. One female was found on 3 June in ",
                  { id: "kvemo-kartli", label: "Kvemo Kartli", type: "region" },
                  ", near Shulaveri in Marneuli municipality, at about 479 m above sea level, in Paliurus spina-christi-dominated shrubland, under rocks.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Two more specimens, one male and one female, were collected on 20 May in ",
                  { id: "shida-kartli", label: "Shida Kartli", type: "region" },
                  ", near Gori on the Kvernaki ridge. The habitat was again Paliurus spina-christi-dominated shrubland, and the spiders were found under rocks at about 641 m.",
                ],
                type: "p",
              },
              {
                parts: [
                  "This material was published in a 2024 Caucasiana paper as ",
                  { name: "Theridion cinereum", type: "sci" },
                  " and was then treated as the first record of that species for Georgia and the South Caucasus. Later taxonomic work changed the picture.",
                ],
                type: "p",
              },
              {
                parts: [
                  "In the 2026 study, the authors concluded that the Georgian specimens are not ",
                  { name: "T. cinereum", type: "sci" },
                  ", but a separate species. The new species was named ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "The Georgian spiders had been treated as another species",
          },
          {
            blocks: [
              {
                parts: [
                  "The currently confirmed distribution covers three countries: Georgia, Azerbaijan, and Iran. In Georgia, confirmed material is known from Kvemo Kartli and Shida Kartli.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The World Spider Catalog lists three Georgian specimens kept at the Institute of Zoology, Ilia State University, as paratypes of ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ": one male and two females.",
                ],
                type: "p",
              },
              {
                parts: [
                  "That means material collected in Georgia is part of the scientific material on which the new species was formally described.",
                ],
                type: "p",
              },
            ],
            heading: "Where is Theridion huseynovi known from?",
          },
          {
            blocks: [
              {
                parts: [
                  "The new study did not rely only on external characters. The authors also provided DNA barcodes for ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ". Such genetic data help researchers compare closely related species and assess taxonomic differences more securely.",
                ],
                type: "p",
              },
              {
                parts: [
                  "In spiders, similar-looking species can be difficult to separate at a glance. Identification often needs detailed morphological work, and sometimes genetic evidence too. That is why already collected and published material can later be reassessed as a different species.",
                ],
                type: "p",
              },
            ],
            heading: "DNA also added important information",
          },
          {
            blocks: [
              {
                parts: [
                  "The paper described four ",
                  { name: "Theridion", type: "sci" },
                  " species new to science: ",
                  { name: "Theridion absheronicum", type: "sci" },
                  " from Azerbaijan; ",
                  { name: "Theridion araratense", type: "sci" },
                  " from Armenia; ",
                  { name: "Theridion caucasicum", type: "sci" },
                  " from Armenia and Azerbaijan; and ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " from Georgia, Azerbaijan, and Iran.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The study brings together new taxonomic and faunistic data on Theridiidae from the South Caucasus, including new distribution records and taxonomic changes for other species.",
                ],
                type: "p",
              },
            ],
            heading: "The study described four new species",
          },
          {
            blocks: [
              {
                parts: [
                  { id: "spiders", label: "Georgia's spider diversity", type: "hub" },
                  " is still being actively studied. The case of ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " shows that discovering a new species does not always mean finding an animal in a completely unknown place for the first time.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Sometimes a specimen is already in a museum or scientific collection, and later work shows that it belongs to a previously undescribed species. Here, Georgian material directly contributed to the description, and one of the authors, Armen Seropian, is connected with Ilia State University.",
                ],
                type: "p",
              },
            ],
            heading: "Why this matters for Georgia",
          },
        ],
        title:
          "Scientists described a spider species new to science — Theridion huseynovi also occurs in Georgia",
      },
      ka: {
        dek: "2026 წლის აგვისტოში მეცნიერებმა Theridion huseynovi მეცნიერებისთვის ახალ სახეობად აღწერეს. სახეობა საქართველოდან, აზერბაიჯანიდან და ირანიდანაა ცნობილი, ხოლო ქართული მასალა მანამდე სხვა სახეობად იყო მიჩნეული.",
        lead:
          "2026 წელს სამხრეთ კავკასიის ობობების შესწავლამ მეცნიერებისთვის კიდევ ერთი ახალი სახეობა გამოავლინა. Theridion huseynovi — Theridiidae-ს ოჯახის ობობა — ოფიციალურად ახალ სახეობად აღწერეს და მისი გავრცელება საქართველოში, აზერბაიჯანსა და ირანში დადასტურდა.",
        metaDescription:
          "მეცნიერებმა Theridion huseynovi მეცნიერებისთვის ახალ ობობის სახეობად აღწერეს. სახეობა დადასტურებულია საქართველოში, აზერბაიჯანსა და ირანში.",
        metaTitle:
          "ახალი ობობის სახეობა საქართველოშიც გვხვდება — Theridion huseynovi",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "კვლევა 2026 წლის 11 აგვისტოს სამეცნიერო ჟურნალ Zootaxa-ში გამოქვეყნდა. ნაშრომის ავტორები არიან ალირეზა ზამანი (Alireza Zamani), არმენ სეროპიანი (Armen Seropian) და იური მარუსიკი (Yuri M. Marusik).",
                ],
                type: "p",
              },
              {
                parts: [
                  "აღმოჩენის ისტორია განსაკუთრებით საინტერესოა საქართველოსთვის: ქართული ეგზემპლარები მეცნიერებს უკვე რამდენიმე წლის წინ ჰქონდათ შეგროვებული, თუმცა მაშინ ისინი სხვა სახეობად — ",
                  { name: "Theridion cinereum", type: "sci" },
                  "-ად — მიიჩნიეს.",
                ],
                type: "p",
              },
            ],
            heading: "ახალი სახეობა და არა პირველი ქართული აღმოჩენა",
          },
          {
            blocks: [
              {
                parts: [
                  "ქართული მასალა 2023 წელს ორ ადგილას შეგროვდა. ერთი მდედრი ეგზემპლარი 3 ივნისს ",
                  { id: "kvemo-kartli", label: "ქვემო ქართლში", type: "region" },
                  ", მარნეულის მუნიციპალიტეტში, შულავერთან იპოვეს. ჩანაწერის მიხედვით, ობობა დაახლოებით 479 მეტრ სიმაღლეზე, ძეძვით (",
                  { name: "Paliurus spina-christi", type: "sci" },
                  ") დომინირებულ ბუჩქნარში, ქვის ქვეშ იყო აღმოჩენილი.",
                ],
                type: "p",
              },
              {
                parts: [
                  "კიდევ ორი ეგზემპლარი — ერთი მამრი და ერთი მდედრი — 20 მაისს ",
                  { id: "shida-kartli", label: "შიდა ქართლში", type: "region" },
                  ", გორის მახლობლად, კვერნაქის ქედზე შეგროვდა. აქაც ჰაბიტატი ძეძვით დომინირებული ბუჩქნარი იყო და ობობები ქვების ქვეშ იპოვეს. ჩანაწერის სიმაღლე დაახლოებით 641 მეტრია.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ეს მასალა 2024 წელს ჟურნალ Caucasiana-ში გამოქვეყნებულ კვლევაში ",
                  { name: "Theridion cinereum", type: "sci" },
                  "-ად განისაზღვრა და იმ დროისთვის ამ სახეობის საქართველოსა და მთლიანად სამხრეთ კავკასიაში პირველ ჩანაწერად ითვლებოდა.",
                ],
                type: "p",
              },
              {
                parts: [
                  "შემდგომმა ტაქსონომიურმა შესწავლამ სურათი შეცვალა. 2026 წლის კვლევაში მეცნიერებმა დაასკვნეს, რომ საქართველოს ეს ეგზემპლარები ",
                  { name: "T. cinereum", type: "sci" },
                  " კი არა, ცალკე სახეობას წარმოადგენენ. ახალ სახეობას ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " ეწოდა.",
                ],
                type: "p",
              },
            ],
            heading: "საქართველოში შეგროვებული ობობები სხვა სახეობად იყო მიჩნეული",
          },
          {
            blocks: [
              {
                parts: [
                  "ამჟამად დადასტურებული გავრცელება სამ ქვეყანას მოიცავს: საქართველო, აზერბაიჯანი და ირანი. საქართველოში დადასტურებული მასალა ქვემო და შიდა ქართლიდანაა ცნობილი.",
                ],
                type: "p",
              },
              {
                parts: [
                  "World Spider Catalog-ში ილიას სახელმწიფო უნივერსიტეტის ზოოლოგიის ინსტიტუტში დაცული სამი ქართული ეგზემპლარი — ერთი მამრი და ორი მდედრი — ",
                  { name: "Theridion huseynovi", type: "sci" },
                  "-ს პარატიპებად არის მითითებული.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ეს ნიშნავს, რომ საქართველოში შეგროვებული მასალა უშუალოდ მონაწილეობს იმ სამეცნიერო მასალაში, რომლის საფუძველზეც ახალი სახეობა ოფიციალურად აღიწერა.",
                ],
                type: "p",
              },
            ],
            heading: "სად გვხვდება Theridion huseynovi?",
          },
          {
            blocks: [
              {
                parts: [
                  "ახალი კვლევა მხოლოდ გარეგნული ნიშნების შედარებით არ შემოიფარგლა. ავტორებმა ",
                  { name: "Theridion huseynovi", type: "sci" },
                  "-სთვის DNA barcode-ებიც წარმოადგინეს. ასეთი გენეტიკური მონაცემები მეცნიერებს ერთმანეთთან ახლოს მდგომი სახეობების შედარებასა და მათი ტაქსონომიური განსხვავებების უკეთ შეფასებაში ეხმარება.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ობობების შემთხვევაში ერთი შეხედვით მსგავსი სახეობების ერთმანეთისგან გარჩევა ხშირად რთულია და დეტალურ მორფოლოგიურ, ზოგჯერ კი გენეტიკურ კვლევასაც საჭიროებს. სწორედ ამიტომ შეიძლება ადრე შეგროვებული და უკვე სამეცნიერო ლიტერატურაში მოხვედრილი მასალა მოგვიანებით სხვა სახეობად გადაიხედოს.",
                ],
                type: "p",
              },
            ],
            heading: "DNA-მაც მნიშვნელოვანი ინფორმაცია მოგვცა",
          },
          {
            blocks: [
              {
                parts: [
                  "Zootaxa-ში გამოქვეყნებულ ნაშრომში მეცნიერებისთვის ახალი ოთხი ",
                  { name: "Theridion", type: "sci" },
                  " აღწერეს: ",
                  { name: "Theridion absheronicum", type: "sci" },
                  " — აზერბაიჯანი; ",
                  { name: "Theridion araratense", type: "sci" },
                  " — სომხეთი; ",
                  { name: "Theridion caucasicum", type: "sci" },
                  " — სომხეთი და აზერბაიჯანი; ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " — საქართველო, აზერბაიჯანი და ირანი.",
                ],
                type: "p",
              },
              {
                parts: [
                  "კვლევა სამხრეთ კავკასიაში Theridiidae-ს ოჯახის წარმომადგენლების შესახებ ახალ ტაქსონომიურ და ფაუნისტურ მონაცემებს აერთიანებს. ავტორებმა ასევე სხვა სახეობების გავრცელების ახალი ჩანაწერები და ტაქსონომიური ცვლილებები წარმოადგინეს.",
                ],
                type: "p",
              },
            ],
            heading: "კვლევაში ოთხი ახალი სახეობა აღწერეს",
          },
          {
            blocks: [
              {
                parts: [
                  { id: "spiders", label: "საქართველოს ობობების მრავალფეროვნება", type: "hub" },
                  " ჯერ კიდევ აქტიურად იკვლევა. ",
                  { name: "Theridion huseynovi", type: "sci" },
                  "-ს ისტორია კარგად აჩვენებს, რომ ახალი სახეობის აღმოჩენა ყოველთვის სრულიად უცნობ ადგილზე პირველად ნაპოვნ ცხოველს არ ნიშნავს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ზოგჯერ ეგზემპლარი უკვე მუზეუმში ან სამეცნიერო კოლექციაშია დაცული, მაგრამ დამატებითი კვლევა აჩვენებს, რომ იგი სინამდვილეში სხვა, მანამდე აღუწერელ სახეობას ეკუთვნის. ამ შემთხვევაში განსაკუთრებით საინტერესოა ისიც, რომ ახალი სახეობის აღწერაში საქართველოს მასალა პირდაპირ მონაწილეობს, ხოლო ერთ-ერთი კვლევის ავტორი — არმენ სეროპიანი — ილიას სახელმწიფო უნივერსიტეტთან არის დაკავშირებული.",
                ],
                type: "p",
              },
            ],
            heading: "რატომ არის ეს მნიშვნელოვანი საქართველოსთვის?",
          },
        ],
        title:
          "მეცნიერებმა ობობის ახალი სახეობა აღწერეს — ის საქართველოშიც გვხვდება",
      },
      ru: {
        dek: "В августе 2026 года учёные описали Theridion huseynovi как новый для науки вид. Он известен из Грузии, Азербайджана и Ирана, а грузинский материал раньше относили к другому виду.",
        lead:
          "В 2026 году изучение пауков Южного Кавказа выявило ещё один новый для науки вид. Theridion huseynovi, паук семейства Theridiidae, официально описан как новый вид и подтверждён в Грузии, Азербайджане и Иране.",
        metaDescription:
          "Учёные описали Theridion huseynovi как новый для науки вид пауков. Вид подтверждён в Грузии, Азербайджане и Иране.",
        metaTitle:
          "Новый вид пауков встречается и в Грузии — Theridion huseynovi",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "Работа опубликована в Zootaxa 11 августа 2026 года. Авторы статьи — Алиреза Замани, Армен Серопян и Юрий М. Марусик.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Для Грузии история особенно интересна: эти экземпляры были собраны несколькими годами раньше, но тогда их определили как другой вид — ",
                  { name: "Theridion cinereum", type: "sci" },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Новый вид, а не первая находка в Грузии",
          },
          {
            blocks: [
              {
                parts: [
                  "Грузинский материал был собран в 2023 году в двух местах. Одну самку нашли 3 июня в ",
                  { id: "kvemo-kartli", label: "Квемо-Картли", type: "region" },
                  ", у Шулавери в муниципалитете Марнеули, примерно на 479 м над уровнем моря, в кустарнике с доминированием Paliurus spina-christi, под камнями.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Ещё два экземпляра, самца и самку, собрали 20 мая в ",
                  { id: "shida-kartli", label: "Шида-Картли", type: "region" },
                  ", у Гори на Квернакском хребте. Местообитание также было кустарником с Paliurus spina-christi; пауки находились под камнями, около 641 м.",
                ],
                type: "p",
              },
              {
                parts: [
                  "В статье Caucasiana 2024 года этот материал был опубликован как ",
                  { name: "Theridion cinereum", type: "sci" },
                  " и тогда считался первой записью этого вида для Грузии и Южного Кавказа. Последующее таксономическое изучение изменило картину.",
                ],
                type: "p",
              },
              {
                parts: [
                  "В исследовании 2026 года авторы пришли к выводу, что грузинские экземпляры представляют не ",
                  { name: "T. cinereum", type: "sci" },
                  ", а отдельный вид. Новый вид получил название ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Грузинские пауки раньше считались другим видом",
          },
          {
            blocks: [
              {
                parts: [
                  "Сейчас подтверждённое распространение охватывает три страны: Грузию, Азербайджан и Иран. В Грузии подтверждённый материал известен из Квемо-Картли и Шида-Картли.",
                ],
                type: "p",
              },
              {
                parts: [
                  "World Spider Catalog указывает три грузинских экземпляра, хранящиеся в Институте зоологии Университета Ильи, как паратипы ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ": одного самца и двух самок.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Это значит, что материал из Грузии входит в научную серию, на основании которой вид был официально описан.",
                ],
                type: "p",
              },
            ],
            heading: "Где встречается Theridion huseynovi?",
          },
          {
            blocks: [
              {
                parts: [
                  "Новое исследование не ограничилось сравнением внешних признаков. Авторы также представили DNA barcode для ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ". Такие генетические данные помогают сравнивать близкие виды и точнее оценивать таксономические различия.",
                ],
                type: "p",
              },
              {
                parts: [
                  "У пауков внешне похожие виды часто трудно различить сразу. Поэтому уже собранный и опубликованный материал иногда позднее пересматривают как другой вид.",
                ],
                type: "p",
              },
            ],
            heading: "DNA тоже дала важные данные",
          },
          {
            blocks: [
              {
                parts: [
                  "В статье описаны четыре новых для науки вида ",
                  { name: "Theridion", type: "sci" },
                  ": ",
                  { name: "Theridion absheronicum", type: "sci" },
                  " из Азербайджана; ",
                  { name: "Theridion araratense", type: "sci" },
                  " из Армении; ",
                  { name: "Theridion caucasicum", type: "sci" },
                  " из Армении и Азербайджана; и ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " из Грузии, Азербайджана и Ирана.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Работа объединяет новые таксономические и фаунистические данные по Theridiidae Южного Кавказа, включая новые записи распространения и таксономические изменения.",
                ],
                type: "p",
              },
            ],
            heading: "В работе описаны четыре новых вида",
          },
          {
            blocks: [
              {
                parts: [
                  { id: "spiders", label: "Разнообразие пауков Грузии", type: "hub" },
                  " всё ещё активно изучается. История ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " показывает, что открытие нового вида не всегда означает первую находку животного в совершенно неизвестном месте.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Иногда экземпляр уже хранится в музее или научной коллекции, а дополнительное исследование показывает, что он относится к ранее неописанному виду. В этом случае грузинский материал прямо участвовал в описании вида, а один из авторов, Армен Серопян, связан с Университетом Ильи.",
                ],
                type: "p",
              },
            ],
            heading: "Почему это важно для Грузии?",
          },
        ],
        title:
          "Учёные описали новый для науки вид пауков — Theridion huseynovi встречается и в Грузии",
      },
      tr: {
        dek: "Ağustos 2026’da bilim insanları Theridion huseynovi’yi bilim için yeni bir tür olarak tanımladı. Tür Gürcistan, Azerbaycan ve İran’dan biliniyor; Gürcistan materyali daha önce başka bir tür sanılmıştı.",
        lead:
          "2026’da Güney Kafkasya örümcekleri üzerine çalışma bilim için yeni bir tür daha ortaya çıkardı. Theridion huseynovi, Theridiidae familyasından bir örümcek, yeni tür olarak resmen tanımlandı ve Gürcistan, Azerbaycan ve İran’dan doğrulandı.",
        metaDescription:
          "Bilim insanları Theridion huseynovi’yi bilim için yeni bir örümcek türü olarak tanımladı. Tür Gürcistan, Azerbaycan ve İran’da doğrulandı.",
        metaTitle:
          "Yeni bir örümcek türü Gürcistan’da da bulunuyor — Theridion huseynovi",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "Çalışma 11 Ağustos 2026’da Zootaxa’da yayımlandı. Yazarlar Alireza Zamani, Armen Seropian ve Yuri M. Marusik.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Gürcistan açısından hikaye özellikle ilginç: örnekler birkaç yıl önce toplanmıştı, ancak o zaman başka bir tür, ",
                  { name: "Theridion cinereum", type: "sci" },
                  ", olarak değerlendirilmişti.",
                ],
                type: "p",
              },
            ],
            heading: "Yeni tür, Gürcistan’da ilk keşif değil",
          },
          {
            blocks: [
              {
                parts: [
                  "Gürcistan materyali 2023’te iki yerde toplandı. Bir dişi 3 Haziran’da ",
                  { id: "kvemo-kartli", label: "Kvemo Kartli", type: "region" },
                  " bölgesinde, Marneuli belediyesinde Shulaveri yakınında, yaklaşık 479 m yükseklikte, Paliurus spina-christi baskın çalılıkta, taşların altında bulundu.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bir erkek ve bir dişi olmak üzere iki örnek daha 20 Mayıs’ta ",
                  { id: "shida-kartli", label: "Shida Kartli", type: "region" },
                  " bölgesinde, Gori yakınındaki Kvernaki sırtında toplandı. Habitat yine Paliurus spina-christi baskın çalılıktı ve örümcekler taşların altında, yaklaşık 641 m’de bulundu.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bu materyal 2024’te Caucasiana’da ",
                  { name: "Theridion cinereum", type: "sci" },
                  " olarak yayımlandı ve o sırada türün Gürcistan ve Güney Kafkasya için ilk kaydı sayıldı. Sonraki taksonomik çalışma tabloyu değiştirdi.",
                ],
                type: "p",
              },
              {
                parts: [
                  "2026 çalışmasında yazarlar, Gürcistan örneklerinin ",
                  { name: "T. cinereum", type: "sci" },
                  " değil, ayrı bir tür olduğu sonucuna vardı. Yeni türe ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " adı verildi.",
                ],
                type: "p",
              },
            ],
            heading: "Gürcistan örnekleri başka bir tür sanılmıştı",
          },
          {
            blocks: [
              {
                parts: [
                  "Şu anda doğrulanmış dağılım üç ülkeyi kapsıyor: Gürcistan, Azerbaycan ve İran. Gürcistan’da doğrulanmış materyal Kvemo Kartli ve Shida Kartli’den biliniyor.",
                ],
                type: "p",
              },
              {
                parts: [
                  "World Spider Catalog, Ilia Devlet Üniversitesi Zooloji Enstitüsü’nde korunan üç Gürcistan örneğini ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " paratipleri olarak listeliyor: bir erkek ve iki dişi.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bu, Gürcistan’da toplanan materyalin yeni türün resmi tanımına temel oluşturan bilimsel materyalin parçası olduğu anlamına gelir.",
                ],
                type: "p",
              },
            ],
            heading: "Theridion huseynovi nerede biliniyor?",
          },
          {
            blocks: [
              {
                parts: [
                  "Yeni çalışma yalnızca dış karakterlerin karşılaştırılmasıyla sınırlı kalmadı. Yazarlar ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " için DNA barcode verileri de sundu. Bu genetik veriler yakın türleri karşılaştırmaya ve taksonomik farkları daha iyi değerlendirmeye yardımcı olur.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Örümceklerde birbirine benzeyen türleri ilk bakışta ayırmak çoğu zaman zordur. Bu yüzden daha önce toplanmış ve yayımlanmış materyal daha sonra başka bir tür olarak yeniden değerlendirilebilir.",
                ],
                type: "p",
              },
            ],
            heading: "DNA da önemli bilgi verdi",
          },
          {
            blocks: [
              {
                parts: [
                  "Makalede bilim için yeni dört ",
                  { name: "Theridion", type: "sci" },
                  " türü tanımlandı: Azerbaycan’dan ",
                  { name: "Theridion absheronicum", type: "sci" },
                  "; Ermenistan’dan ",
                  { name: "Theridion araratense", type: "sci" },
                  "; Ermenistan ve Azerbaycan’dan ",
                  { name: "Theridion caucasicum", type: "sci" },
                  "; ve Gürcistan, Azerbaycan ve İran’dan ",
                  { name: "Theridion huseynovi", type: "sci" },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  "Çalışma, Güney Kafkasya Theridiidae’si için yeni taksonomik ve faunistik verileri, dağılım kayıtlarını ve taksonomik değişiklikleri bir araya getiriyor.",
                ],
                type: "p",
              },
            ],
            heading: "Çalışmada dört yeni tür tanımlandı",
          },
          {
            blocks: [
              {
                parts: [
                  { id: "spiders", label: "Gürcistan’ın örümcek çeşitliliği", type: "hub" },
                  " hâlâ etkin biçimde araştırılıyor. ",
                  { name: "Theridion huseynovi", type: "sci" },
                  " örneği, yeni tür keşfinin her zaman tamamen bilinmeyen bir yerde ilk kez hayvan bulmak anlamına gelmediğini gösteriyor.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bazen örnek zaten bir müzede veya bilimsel koleksiyondadır; ek çalışma onun daha önce tanımlanmamış bir türe ait olduğunu gösterir. Bu olayda Gürcistan materyali tür tanımına doğrudan katıldı ve yazarlardan Armen Seropian Ilia Devlet Üniversitesi ile bağlantılıdır.",
                ],
                type: "p",
              },
            ],
            heading: "Bu Gürcistan için neden önemli?",
          },
        ],
        title:
          "Bilim insanları yeni bir örümcek türü tanımladı — Theridion huseynovi Gürcistan’da da bulunuyor",
      },
    },
    id: "theridion-huseynovi-new-spider-species-georgia-2026",
    image: PHOTO_THERIDION_HUSEYNOVI,
    publishedAt: "2026-09-17",
    relatedHubIds: ["spiders"],
    relatedRegionIds: ["kvemo-kartli", "shida-kartli"],
    relatedSpeciesIds: [],
    slug: "theridion-huseynovi-new-spider-species-georgia-2026",
    sources: [
      {
        name: "Zootaxa — original description",
        url: ZOOTAXA_URL,
      },
      {
        name: "World Spider Catalog — taxonomy and current distribution",
        url: WSC_URL,
      },
      {
        name: "Caucasiana — earlier Georgian material",
        url: CAUCASIANA_URL,
      },
    ],
    status: "published",
    updatedAt: "2026-09-17",
  };
