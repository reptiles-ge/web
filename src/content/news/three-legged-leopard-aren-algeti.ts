import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const MONGABAY_SOURCE =
  "https://news.mongabay.com/2026/05/endangered-persian-leopards-persist-across-borders-despite-hunters-and-landmines/";
const WWF_CAUCASUS_SOURCE =
  "https://wwfcaucasus.org/?19447441%2FRare-Persian-Leopard-Recorded-in-Georgia=";
const NACRES_SOURCE = "https://www.nacres.org/home/29/_en/";
const ARMENPRESS_SOURCE = "https://armenpress.am/en/article/1256126";
const WLA_SOURCE = "https://wla.gov.ge/En/News/61";
const RED_LIST_SOURCE = "https://matsne.gov.ge/ka/document/view/2256983";
const IUCN_SOURCE =
  "https://dx.doi.org/10.2305/IUCN.UK.2023-1.RLTS.T15961A50660903.en";

const PHOTO_PERSIAN_LEOPARD: NewsPhoto = {
  alt: {
    en: "A Persian leopard from the atlas species profile. This is an illustrative image, not Aren and not the Algeti footage.",
    ka: "სპარსული ლეოპარდი ატლასის სახეობის პროფილიდან. ეს საილუსტრაციო ფოტოა და არა არენი ან ალგეთის კადრი.",
    ru: "Переднеазиатский леопард из профиля вида в атласе. Это иллюстрация, а не Арен и не кадр из Алгети.",
    tr: "Atlastaki tür profilinden bir İran leoparı. Bu temsili bir fotoğraftır; Aren ya da Algeti görüntüsü değildir.",
  },
  credit: {
    photographer: "Tamar Assaf",
    url: "https://commons.wikimedia.org/wiki/File:Persian_Leopard_sitting.jpg",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/panthera-pardus-assaf-1.jpg",
};

const PHOTO_ARENI: NewsPhoto = {
  alt: {
    en: "Areni village and the Arpa river valley in Vayots Dzor, Armenia, November 2021. Aren was first recorded near this village in spring 2019.",
    ka: "სოფელი არენი და მდინარე არფას ხეობა, ვაიოც ძორი, სომხეთი, 2021 წლის ნოემბერი. არენი პირველად ამ სოფლის მახლობლად 2019 წლის გაზაფხულზე დაფიქსირდა.",
    ru: "Село Арени и долина реки Арпа, Вайоц-Дзор, Армения, ноябрь 2021 года. Впервые Арена зафиксировали рядом с этим селом весной 2019 года.",
    tr: "Areni köyü ve Arpa nehri vadisi, Vayots Dzor, Ermenistan, Kasım 2021. Aren ilk kez 2019 baharında bu köyün yakınında kaydedildi.",
  },
  credit: {
    date: "2021-11-03",
    photographer: "Dor Shabashewitz",
    url: "https://commons.wikimedia.org/wiki/File:Areni_view.jpg",
  },
  src: "https://cdn.reptiles.ge/news-aren-areni-shabashewitz-1.jpg",
};

const PHOTO_ALGETI_FOREST: NewsPhoto = {
  alt: {
    en: "Autumn forest in Algeti National Park, October 2007. This is a view of the park, not the site where the camera recorded Aren.",
    ka: "შემოდგომის ტყე ალგეთის ეროვნულ პარკში, 2007 წლის ოქტომბერი. ეს პარკის ხედია და არა ის ადგილი, სადაც კამერამ არენი ჩაწერა.",
    ru: "Осенний лес в Алгетском национальном парке, октябрь 2007 года. Это вид парка, а не место, где камера записала Арена.",
    tr: "Algeti Ulusal Parkı'nda sonbahar ormanı, Ekim 2007. Bu, parktan bir görünümdür; kameranın Aren'i kaydettiği yer değildir.",
  },
  credit: {
    date: "2007-10-14",
    photographer: "Arkaitz1974",
    url: "https://commons.wikimedia.org/wiki/File:Algeti_National_Park_(14_October_2007)._007.jpg",
  },
  src: "https://cdn.reptiles.ge/news-aren-algeti-forest-arkaitz-1.jpg",
};

const PHOTO_ALGETI_RIDGES: NewsPhoto = {
  alt: {
    en: "Open ridges of Algeti National Park, October 2022.",
    ka: "ალგეთის ეროვნული პარკის ღია ქედები, 2022 წლის ოქტომბერი.",
    ru: "Открытые хребты Алгетского национального парка, октябрь 2022 года.",
    tr: "Algeti Ulusal Parkı'nın açık sırtları, Ekim 2022.",
  },
  credit: {
    date: "2022-10-22",
    photographer: "Alexey Komarov",
    url: "https://commons.wikimedia.org/wiki/File:Algeti_National_Park_2022-10-22-20.jpg",
  },
  src: "https://cdn.reptiles.ge/news-aren-algeti-shikhan-komarov-1.jpg",
};

const FIGURE_ARENI = {
  src: PHOTO_ARENI.src,
  type: "figure" as const,
};
const FIGURE_ALGETI_FOREST = {
  src: PHOTO_ALGETI_FOREST.src,
  type: "figure" as const,
};
const FIGURE_ALGETI_RIDGES = {
  src: PHOTO_ALGETI_RIDGES.src,
  type: "figure" as const,
};

export const THREE_LEGGED_LEOPARD_AREN_ALGETI: NewsArticle = {
  copy: {
    en: {
      dek: "A three-legged Persian leopard known from Armenia reached Algeti National Park in September 2025. By late April 2026, the cameras there no longer showed him.",
      lead: "In September 2025, a surveillance camera at the deer breeding enclosure in Algeti National Park, about an hour's drive west of Tbilisi, recorded a leopard. According to Mongabay and WWF Caucasus, the animal was Aren, a Persian leopard first recorded in Armenia in 2019, who had lost the lower part of a front leg.",
      metaDescription:
        "A three-legged Persian leopard named Aren walked at least 250 km from Armenia to Algeti National Park. What is known, and where his trail went cold.",
      metaTitle: "Three-legged leopard Aren: 250 km from Armenia to Algeti",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The footage passed through several people before the animal was identified. According to Mongabay, Tbilisi Zoo director Zurab Gurielidze first sent it to Bezhan Lortkipanidze, co-founder of NACRES. Sergo Tabagari of the National Wildlife Agency was also checking the record, and he called Vazha Kochiashvili, a biologist at WWF Caucasus. Kochiashvili asked whether the leopard had three legs. It did.",
              ],
              type: "p",
            },
            {
              parts: [
                "The question had a reason behind it. Aren was first recorded in spring 2019 near the village of Areni, by Armenia's Arpa Protected Landscape. At the time he had all four legs. Later that year he was recorded without the lower part of his left front leg. Rangers attribute the injury to a landmine, but the exact cause has not been established.",
              ],
              type: "p",
            },
            FIGURE_ARENI,
            {
              parts: [
                "Leopards on camera-trap footage are usually told apart by their individual spot patterns. Aren, however, carries a mark that shows on a frame even without comparing spots: the missing limb. That is why one short question was the first step in linking the Algeti animal to an individual known from Armenia.",
              ],
              type: "p",
            },
            {
              parts: [
                "In 2022 he disappeared from the records. In 2024 he turned up about 130 km to the north, in the Ijevan forest. By September 2025, when he reached Algeti in ",
                { id: "kvemo-kartli", label: "Kvemo Kartli", type: "region" },
                ", he had covered at least 250 km. On a map, the route reads as three points: Arpa in southern Armenia, Ijevan in north-eastern Armenia, and Algeti in Georgia.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_FOREST,
            {
              parts: [
                "“At least” matters here. Only the points where cameras caught him are known. The path between them, and how long he spent on each stretch, are not.",
              ],
              type: "p",
            },
          ],
          heading: "Who is Aren?",
        },
        {
          blocks: [
            {
              parts: [
                "Mongabay and WWF Caucasus describe the Algeti footage as only the third confirmed record of the Persian leopard (",
                { name: "Panthera pardus tulliana", type: "sci" },
                ") in Georgia in the last 20 years.",
              ],
              type: "p",
            },
            {
              parts: [
                "The species ",
                { name: "Panthera pardus", type: "sci" },
                " is Vulnerable on the IUCN Red List, and the subspecies ",
                { name: "P. p. tulliana", type: "sci" },
                " was assessed as Endangered in 2023. Georgia's 2014 Red List lists the leopard as Critically Endangered (CR) because the population is very small.",
              ],
              type: "p",
            },
            {
              parts: [
                "The first story belongs to Vashlovani. In 2003, leopard tracks were found there. They belonged to a male who was named Noe and who was recorded on camera traps until 2009. The second: in 2021 and 2022, camera traps recorded a leopard in Tusheti. The third is Aren.",
              ],
              type: "p",
            },
            {
              parts: [
                "All three are single animals. These records do not mean that a leopard population has recovered in Georgia. They show that individual wandering leopards appear on Georgian territory from time to time. Noe and Aren are both males. IUCN's 2023 assessment also states that the Caucasus population is not yet stable: wide-ranging males turn up, but females and breeding remain insufficient. The species profile is here: ",
                { id: "panthera-pardus", label: "leopard", type: "species" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "The third leopard in 20 years",
        },
        {
          blocks: [
            {
              parts: [
                "At the end of April 2026, the cameras in Algeti were taken down. They had recorded red deer, wild boar, lynx, wildcat and wolf, but there was no sign of Aren.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_RIDGES,
            {
              parts: [
                "No camera record does not prove that an animal has left. It only means it did not pass in front of the cameras during that time. That is why “the trail went cold” is the accurate wording here: neither his departure nor his staying has been confirmed.",
              ],
              type: "p",
            },
            {
              parts: [
                "Bezhan Lortkipanidze suggests the leopard may have headed towards Turkey. That is a hypothesis, not an established fact. The sources this article relies on contain no newer record of Aren after Algeti.",
              ],
              type: "p",
            },
            {
              parts: [
                "His current location, age, weight and health are unknown.",
              ],
              type: "p",
            },
          ],
          heading: "Where is he now?",
        },
        {
          blocks: [
            {
              parts: [
                "Aren is not an exception. Since 2002, WWF has recorded 10 leopards in Armenia, and three of them were missing a limb.",
              ],
              type: "p",
            },
            {
              parts: [
                "Mongabay's reporting names hunters and landmines among the threats Persian leopards face. Landmines and traps are two commonly cited explanations for a lost limb. A camera-trap frame, however, does not show what caused an injury. In Aren's case, the rangers' explanation is a landmine, but the cause has not been confirmed. For the same reason, the three injured animals cannot each be tied to a specific cause.",
              ],
              type: "p",
            },
            {
              parts: [
                "What the records do show is that Aren lived with the injury for years after 2019 and still covered hundreds of kilometres.",
              ],
              type: "p",
            },
          ],
          heading: "Why do leopards lose limbs?",
        },
        {
          blocks: [
            {
              parts: [
                "Aren's route shows why ecological corridors matter. A leopard needs a large area, and in Georgia its records sit in separate protected areas: Vashlovani, Tusheti and Algeti. A journey like Aren's does not fit inside a single protected area and spans two countries.",
              ],
              type: "p",
            },
            {
              parts: [
                "A corridor here means a continuous strip of suitable habitat that lets an animal move from one place to another. Where such strips survive, wandering individuals can arrive from neighbouring populations. Where they are cut, protected areas remain isolated from one another.",
              ],
              type: "p",
            },
            {
              parts: [
                "Following such an animal takes resources. According to Mongabay, NACRES currently works with only three permanent staff. There is no dedicated monitoring programme for Aren; in Lortkipanidze's words, it happens only out of “goodwill”.",
              ],
              type: "p",
            },
            {
              parts: [
                "IUCN's 2023 assessment puts the number of remaining Persian leopards at 750–1,044 individuals, of which 450–626 are mature, with a declining trend. For a subspecies this small, the path of each wandering animal is useful information. More Georgian ",
                { id: "mammals", label: "mammals", type: "hub" },
                " are in the atlas.",
              ],
              type: "p",
            },
          ],
          heading: "What does this mean for Georgia?",
        },
        {
          blocks: [
            {
              parts: [
                "Confirmed: in September 2025, a leopard was recorded in Algeti National Park. Mongabay and WWF Caucasus identify it as Aren, an animal known in Armenia since 2019 and missing part of a front limb. The National Wildlife Agency's notice of 17 September 2025 does not name the animal. On the cameras taken down at the end of April 2026, Aren no longer appeared.",
              ],
              type: "p",
            },
            {
              parts: [
                "Not established: the exact cause of the lost limb; the route Aren took between records; where he is now, and whether he really is heading towards Turkey. The sources also contain no data on whether Aren has any chance of meeting another leopard in Georgia or neighbouring areas.",
              ],
              type: "p",
            },
          ],
          heading: "What we know and what we don't",
        },
        {
          blocks: [
            {
              parts: [
                "On 22 July 2026, Armenia's environment minister shared a video of a leopard recorded by a camera trap in Khosrov Forest State Reserve. The individual was not identified, so this record should not be attributed to Aren. It is one more confirmation of leopards in Armenia, not news of Aren's whereabouts.",
              ],
              type: "p",
            },
          ],
          heading: "Side note: the Khosrov record, 22 July 2026",
        },
      ],
      title: "Three-legged leopard Aren: 250 km from Armenia to Algeti",
    },
    ka: {
      dek: "სამფეხა სპარსული ლეოპარდი, რომელსაც სომხეთიდან იცნობენ, 2025 წლის სექტემბერში ალგეთის ეროვნულ პარკში დაფიქსირდა. 2026 წლის აპრილის ბოლოსთვის იქაურ კამერებზე აღარ ჩანდა.",
      lead: "2025 წლის სექტემბერში ალგეთის ეროვნულ პარკში, თბილისიდან დასავლეთით, დაახლოებით ერთი საათის სავალზე, ირმის სანაშენე ვოლიერის სათვალთვალო კამერამ ლეოპარდი დააფიქსირა. Mongabay-სა და WWF Caucasus-ის ცნობით, ეს არენი იყო — სპარსული ლეოპარდი, რომელიც სომხეთში პირველად 2019 წელს დააფიქსირეს და რომელსაც წინა ფეხის ქვედა ნაწილი აკლია.",
      metaDescription:
        "სამფეხა სპარსულმა ლეოპარდმა არენმა სომხეთიდან ალგეთის ეროვნულ პარკამდე სულ მცირე 250 კმ გაიარა. რა ვიცით მის შესახებ და სად დაიკარგა მისი კვალი.",
      metaTitle: "სამფეხა ლეოპარდი არენი: 250 კმ სომხეთიდან ალგეთამდე",
      sections: [
        {
          blocks: [
            {
              parts: [
                "ჩანაწერმა რამდენიმე ადამიანი გაიარა, სანამ ცხოველის ვინაობა გაირკვეოდა. Mongabay-ის მიხედვით, კადრი ჯერ თბილისის ზოოპარკის დირექტორმა, ზურაბ გურიელიძემ გაუგზავნა NACRES-ის თანადამფუძნებელს, ბეჟან ლორთქიფანიძეს. ჩანაწერს ველური ბუნების ეროვნული სააგენტოს თანამშრომელი, სერგო ტაბაღარიც ამოწმებდა. მან WWF Caucasus-ის ბიოლოგს, ვაჟა კოჭიაშვილს დაურეკა. კოჭიაშვილმა იკითხა, ჰქონდა თუ არა ლეოპარდს სამი ფეხი. ჰქონდა.",
              ],
              type: "p",
            },
            {
              parts: [
                "კითხვას საფუძველი ჰქონდა. არენი პირველად 2019 წლის გაზაფხულზე დააფიქსირეს სომხეთში, სოფელ არენთან, არფის დაცულ ლანდშაფტთან. მაშინ ოთხივე ფეხი ჰქონდა. იმავე წელს ის უკვე მარცხენა წინა ფეხის ქვედა ნაწილის გარეშე გადაიღეს. რეინჯერები ტრავმას ნაღმს მიაწერენ, თუმცა ზუსტი მიზეზი დადგენილი არ არის.",
              ],
              type: "p",
            },
            FIGURE_ARENI,
            {
              parts: [
                "ლეოპარდებს ფოტოხაფანგის კადრებზე, როგორც წესი, ლაქების ინდივიდუალური ნახატით არჩევენ. არენს კი ისეთი ნიშანი აქვს, რომელიც კადრზე ლაქების შედარების გარეშეც ჩანს: დაკარგული კიდური. ამიტომ ერთი მოკლე კითხვა ალგეთის ცხოველის სომხეთში ცნობილ ინდივიდთან დასაკავშირებლად პირველი ნაბიჯი იყო.",
              ],
              type: "p",
            },
            {
              parts: [
                "2022 წელს არენი ჩანაწერებიდან გაქრა. 2024 წელს ის დაახლოებით 130 კილომეტრით ჩრდილოეთით, იჯევანის ტყეში გამოჩნდა. 2025 წლის სექტემბრისთვის, როცა ",
                { id: "kvemo-kartli", label: "ქვემო ქართლში", type: "region" },
                " მდებარე ალგეთს მიაღწია, სულ მცირე 250 კილომეტრი ჰქონდა გავლილი. რუკაზე მისი გზა სამი წერტილით იკითხება: არფა სამხრეთ სომხეთში, იჯევანი ჩრდილო-აღმოსავლეთ სომხეთში და ალგეთი საქართველოში.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_FOREST,
            {
              parts: [
                "სიტყვებს „სულ მცირე“ აქ მნიშვნელობა აქვს. ცნობილია მხოლოდ ის წერტილები, სადაც ცხოველი კამერებმა დააფიქსირა. რა გზით იარა მათ შორის და რამდენი ხანი დაჰყო თითოეულ მონაკვეთზე, უცნობია.",
              ],
              type: "p",
            },
          ],
          heading: "ვინ არის არენი",
        },
        {
          blocks: [
            {
              parts: [
                "Mongabay-ისა და WWF Caucasus-ის მიხედვით, ალგეთის კადრი სპარსული ლეოპარდის (",
                { name: "Panthera pardus tulliana", type: "sci" },
                ") მხოლოდ მესამე დადასტურებული ჩანაწერია საქართველოში ბოლო 20 წლის განმავლობაში.",
              ],
              type: "p",
            },
            {
              parts: [
                "ლეოპარდს ქართულად ჯიქსაც უწოდებენ. სახეობა ",
                { name: "Panthera pardus", type: "sci" },
                " IUCN-ის წითელ ნუსხაში მოწყვლადია (Vulnerable), ქვესახეობა ",
                { name: "P. p. tulliana", type: "sci" },
                " კი 2023 წლის შეფასებით საფრთხის ქვეშ მყოფია (Endangered). საქართველოს 2014 წლის წითელ ნუსხაში ჯიქი კრიტიკული საფრთხის ქვეშ მყოფია (CR) — ძალზე მცირე პოპულაციის გამო.",
              ],
              type: "p",
            },
            {
              parts: [
                "პირველი ამბავი ვაშლოვანს უკავშირდება. 2003 წელს იქ ლეოპარდის ნაკვალევი იპოვეს. ეს იყო მამალი, რომელსაც „ნოე“ დაარქვეს და რომელიც ფოტოხაფანგებზე 2009 წლამდე ფიქსირდებოდა. მეორე: 2021 და 2022 წლებში ფოტოხაფანგებმა ლეოპარდი თუშეთში დააფიქსირეს. მესამე არენია.",
              ],
              type: "p",
            },
            {
              parts: [
                "სამივე შემთხვევა ცალკეული ცხოველია. ეს ჩანაწერები არ ნიშნავს, რომ საქართველოში ლეოპარდის პოპულაცია აღდგა. ისინი აჩვენებს, რომ ცალკეული მოხეტიალე ინდივიდები საქართველოს ტერიტორიაზე დროდადრო ჩნდებიან. ნოე და არენი ორივე მამალია. IUCN-ის 2023 წლის შეფასებაც წერს, რომ კავკასიის პოპულაცია ჯერ სტაბილური არ არის: ფართოდ მოძრავი მამლები ჩნდებიან, მაგრამ დედლები და გამრავლების შემთხვევები არასაკმარისია. სახეობის პროფილი ატლასში: ",
                { id: "panthera-pardus", label: "ჯიქი", type: "species" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "მესამე ლეოპარდი 20 წელში",
        },
        {
          blocks: [
            {
              parts: [
                "2026 წლის აპრილის ბოლოს ალგეთში კამერები მოხსნეს. მათ ირემი, ტახი, ფოცხვერი, ტყის კატა და მგელი დააფიქსირეს, არენის კვალი კი არ ჩანდა.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_RIDGES,
            {
              parts: [
                "კამერაზე ჩანაწერის არარსებობა არ ამტკიცებს, რომ ცხოველი ტერიტორიიდან წავიდა. ის მხოლოდ იმას ნიშნავს, რომ იმ პერიოდში კამერების წინ არ გაუვლია. ამიტომ „კვალი დაიკარგა“ აქ ზუსტი ფორმულირებაა: არც მისი წასვლა და არც დარჩენა დადასტურებული არ არის.",
              ],
              type: "p",
            },
            {
              parts: [
                "ბეჟან ლორთქიფანიძე ვარაუდობს, რომ ლეოპარდი შესაძლოა თურქეთისკენ გაემართა. ეს ვარაუდია და არა დადგენილი ფაქტი. წყაროებში, რომლებსაც ეს სტატია ეყრდნობა, ალგეთის შემდეგ არენის ახალი ჩანაწერი არ არის.",
              ],
              type: "p",
            },
            {
              parts: [
                "მისი ამჟამინდელი ადგილსამყოფელი, ასაკი, წონა და ჯანმრთელობა უცნობია.",
              ],
              type: "p",
            },
          ],
          heading: "სად არის ახლა",
        },
        {
          blocks: [
            {
              parts: [
                "არენი გამონაკლისი არ არის. WWF-მა სომხეთში 2002 წლიდან 10 ლეოპარდი დააფიქსირა და მათგან სამს კიდური ჰქონდა დაკარგული.",
              ],
              type: "p",
            },
            {
              parts: [
                "Mongabay-ის მასალა სპარსული ლეოპარდის საფრთხეებს შორის მონადირეებსა და ნაღმებს ასახელებს. კიდურის დაკარგვის ორი ხშირად დასახელებული ახსნა ნაღმი და ხაფანგია. თუმცა ფოტოხაფანგის კადრი ტრავმის მიზეზს თავისთავად არ აჩვენებს. არენის შემთხვევაში რეინჯერების ვერსია ნაღმია, მაგრამ მიზეზი დადასტურებული არ არის. ამავე მიზეზით, სამ დაზიანებულ ცხოველს კონკრეტულ მიზეზს ცალ-ცალკე ვერ მივაწერთ.",
              ],
              type: "p",
            },
            {
              parts: [
                "ჩანაწერები ის კი აჩვენებს, რომ არენი 2019 წლის შემდეგ წლების განმავლობაში ცხოვრობდა ამ ტრავმით და მაინც ასეულობით კილომეტრი გაიარა.",
              ],
              type: "p",
            },
          ],
          heading: "რატომ კარგავენ ლეოპარდები კიდურებს",
        },
        {
          blocks: [
            {
              parts: [
                "არენის გზა ეკოლოგიური დერეფნების მნიშვნელობას აჩვენებს. ლეოპარდს დიდი ტერიტორია სჭირდება, საქართველოში კი მისი ჩანაწერები ცალკეულ დაცულ ტერიტორიებზეა: ვაშლოვანში, თუშეთსა და ალგეთში. არენის მსგავსი მოგზაურობა ერთ დაცულ ტერიტორიაში არ ეტევა და ორ ქვეყანას მოიცავს.",
              ],
              type: "p",
            },
            {
              parts: [
                "დერეფანი აქ ნიშნავს შესაფერისი ჰაბიტატის უწყვეტ ზოლს, რომლითაც ცხოველი ერთი ადგილიდან მეორეში გადადის. სადაც ასეთი ზოლები შენარჩუნებულია, მოხეტიალე ინდივიდებს მეზობელი პოპულაციებიდან შემოსვლა შეუძლიათ. სადაც ისინი წყდება, დაცული ტერიტორიები ერთმანეთისგან იზოლირებული რჩება.",
              ],
              type: "p",
            },
            {
              parts: [
                "ასეთი ცხოველის თვალყურის დევნა რესურსს მოითხოვს. Mongabay-ის მიხედვით, NACRES ამჟამად მხოლოდ სამი მუდმივი თანამშრომლით მუშაობს. არენის სპეციალური მონიტორინგის პროგრამა არ არსებობს; ლორთქიფანიძის სიტყვით, ეს მხოლოდ „კეთილი ნებით“ ხდება.",
              ],
              type: "p",
            },
            {
              parts: [
                "IUCN-ის 2023 წლის შეფასებით, სპარსული ლეოპარდის 750–1 044 ინდივიდი დარჩა, მათ შორის 450–626 ზრდასრული, და რიცხოვნობა კლებულობს. ასეთი მცირერიცხოვანი ქვესახეობისთვის თითოეული მოხეტიალე ცხოველის გზა ღირებული ინფორმაციაა. საქართველოს სხვა ",
                { id: "mammals", label: "ძუძუმწოვრები", type: "hub" },
                " ატლასში ცალკე გვერდზეა თავმოყრილი.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს ეს საქართველოსთვის",
        },
        {
          blocks: [
            {
              parts: [
                "დადასტურებულია: 2025 წლის სექტემბერში ალგეთის ეროვნულ პარკში ლეოპარდი დაფიქსირდა. Mongabay და WWF Caucasus მას არენად მიიჩნევენ — ცხოველად, რომელსაც სომხეთში 2019 წლიდან იცნობენ და რომელსაც წინა კიდურის ნაწილი აკლია. ველური ბუნების ეროვნული სააგენტოს 2025 წლის 17 სექტემბრის ცნობაში ცხოველი სახელით არ არის დასახელებული. 2026 წლის აპრილის ბოლოს მოხსნილ კამერებზე არენი აღარ ჩანდა.",
              ],
              type: "p",
            },
            {
              parts: [
                "დადგენილი არ არის: კიდურის დაკარგვის ზუსტი მიზეზი; გზა, რომელიც არენმა ჩანაწერებს შორის გაიარა; სად არის ის ახლა და მართლა მიემართება თუ არა თურქეთისკენ. ასევე უცნობია, ჰყავს თუ არა არენს საქართველოში ან მეზობელ ტერიტორიებზე სხვა ლეოპარდთან შეხვედრის შანსი — ამის შესახებ წყაროებში მონაცემი არ არის.",
              ],
              type: "p",
            },
          ],
          heading: "რა ვიცით და რა არა",
        },
        {
          blocks: [
            {
              parts: [
                "2026 წლის 22 ივლისს სომხეთის გარემოს დაცვის მინისტრმა ხოსროვის ნაკრძალში ფოტოხაფანგით დაფიქსირებული ლეოპარდის ვიდეო გაავრცელა. ინდივიდის ვინაობა არ დაკონკრეტებულა, ამიტომ ეს ჩანაწერი არენს არ უნდა მივაწეროთ. ის სომხეთში ლეოპარდის არსებობის კიდევ ერთი დადასტურებაა და არა ცნობა არენის ადგილსამყოფლის შესახებ.",
              ],
              type: "p",
            },
          ],
          heading: "გვერდითი ცნობა: ხოსროვის ჩანაწერი, 2026 წლის 22 ივლისი",
        },
      ],
      title: "სამფეხა ლეოპარდი არენი: 250 კმ სომხეთიდან ალგეთამდე",
    },
    ru: {
      dek: "Трёхлапый переднеазиатский леопард, известный по Армении, в сентябре 2025 года появился в национальном парке Алгети. К концу апреля 2026 года камеры там его уже не фиксировали.",
      lead: "В сентябре 2025 года камера наблюдения у вольера для разведения оленей в национальном парке Алгети, примерно в часе езды к западу от Тбилиси, записала леопарда. По данным Mongabay и WWF Caucasus, это был Арен — переднеазиатский леопард, впервые зафиксированный в Армении в 2019 году, у которого нет нижней части передней лапы.",
      metaDescription:
        "Трёхлапый переднеазиатский леопард Арен прошёл не менее 250 км из Армении до национального парка Алгети. Что о нём известно и где потерялся его след.",
      metaTitle: "Трёхлапый леопард Арен: 250 км из Армении в Алгети",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Запись прошла через нескольких людей, прежде чем животное опознали. По данным Mongabay, директор Тбилисского зоопарка Зураб Гуриелидзе сначала отправил её сооснователю NACRES Бежану Лорткипанидзе. Запись также проверял сотрудник Национального агентства дикой природы Серго Табагари. Он позвонил биологу WWF Caucasus Важе Кочиашвили. Кочиашвили спросил, три ли лапы у леопарда. Их было три.",
              ],
              type: "p",
            },
            {
              parts: [
                "У вопроса была причина. Арена впервые зафиксировали весной 2019 года в Армении, у села Арени, рядом с охраняемым ландшафтом Арпа. Тогда у него были все четыре лапы. В том же году его сняли уже без нижней части левой передней лапы. Рейнджеры связывают травму с миной, но точная причина не установлена.",
              ],
              type: "p",
            },
            FIGURE_ARENI,
            {
              parts: [
                "Леопардов на кадрах фотоловушек обычно различают по индивидуальному рисунку пятен. Но у Арена есть примета, которая видна на кадре и без сравнения пятен: отсутствующая конечность. Поэтому один короткий вопрос стал первым шагом, чтобы связать животное из Алгети с особью, известной по Армении.",
              ],
              type: "p",
            },
            {
              parts: [
                "В 2022 году Арен исчез из записей. В 2024 году он появился примерно в 130 км к северу, в Иджеванском лесу. К сентябрю 2025 года, когда он добрался до Алгети в ",
                { id: "kvemo-kartli", label: "Квемо-Картли", type: "region" },
                ", он прошёл не менее 250 км. На карте его путь читается по трём точкам: Арпа на юге Армении, Иджеван на северо-востоке Армении и Алгети в Грузии.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_FOREST,
            {
              parts: [
                "Слова «не менее» здесь важны. Известны только точки, где животное попало на камеры. Каким путём оно шло между ними и сколько времени провело на каждом отрезке, неизвестно.",
              ],
              type: "p",
            },
          ],
          heading: "Кто такой Арен",
        },
        {
          blocks: [
            {
              parts: [
                "По данным Mongabay и WWF Caucasus, запись из Алгети — лишь третья подтверждённая регистрация переднеазиатского леопарда (",
                { name: "Panthera pardus tulliana", type: "sci" },
                ") в Грузии за последние 20 лет.",
              ],
              type: "p",
            },
            {
              parts: [
                "Вид ",
                { name: "Panthera pardus", type: "sci" },
                " в Красном списке IUCN имеет статус «уязвимый» (Vulnerable), а подвид ",
                { name: "P. p. tulliana", type: "sci" },
                " в оценке 2023 года отнесён к категории «под угрозой» (Endangered). В Красном списке Грузии 2014 года леопард значится как находящийся под критической угрозой (CR) из-за очень малой численности.",
              ],
              type: "p",
            },
            {
              parts: [
                "Первая история связана с Вашлованы. В 2003 году там нашли следы леопарда. Это был самец, которого назвали Ное и который попадал в фотоловушки до 2009 года. Вторая: в 2021 и 2022 годах фотоловушки зафиксировали леопарда в Тушетии. Третья — Арен.",
              ],
              type: "p",
            },
            {
              parts: [
                "Во всех трёх случаях речь об отдельных животных. Эти записи не означают, что популяция леопарда в Грузии восстановилась. Они показывают, что отдельные бродячие особи время от времени появляются на территории Грузии. Ное и Арен — оба самцы. В оценке IUCN 2023 года также сказано, что кавказская популяция пока не стабильна: широко перемещающиеся самцы появляются, но самок и случаев размножения недостаточно. Профиль вида в атласе: ",
                { id: "panthera-pardus", label: "леопард", type: "species" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Третий леопард за 20 лет",
        },
        {
          blocks: [
            {
              parts: [
                "В конце апреля 2026 года камеры в Алгети сняли. Они зафиксировали благородного оленя, кабана, рысь, лесного кота и волка, но следов Арена не было.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_RIDGES,
            {
              parts: [
                "Отсутствие записи на камере не доказывает, что животное ушло. Оно означает лишь, что в этот период оно не прошло перед камерами. Поэтому «след потерялся» — здесь точная формулировка: не подтверждён ни уход Арена, ни то, что он остался.",
              ],
              type: "p",
            },
            {
              parts: [
                "Бежан Лорткипанидзе предполагает, что леопард мог направиться в сторону Турции. Это предположение, а не установленный факт. В источниках, на которые опирается эта статья, более поздних записей Арена после Алгети нет.",
              ],
              type: "p",
            },
            {
              parts: [
                "Его нынешнее местонахождение, возраст, вес и состояние здоровья неизвестны.",
              ],
              type: "p",
            },
          ],
          heading: "Где он сейчас",
        },
        {
          blocks: [
            {
              parts: [
                "Арен — не исключение. С 2002 года WWF зафиксировал в Армении 10 леопардов, и у трёх из них не было одной конечности.",
              ],
              type: "p",
            },
            {
              parts: [
                "В материале Mongabay среди угроз для переднеазиатского леопарда названы охотники и мины. Мины и капканы — два часто называемых объяснения потери конечности. Однако кадр фотоловушки сам по себе не показывает причину травмы. В случае Арена версия рейнджеров — мина, но причина не подтверждена. По той же причине каждое из трёх травмированных животных нельзя связать с конкретной причиной.",
              ],
              type: "p",
            },
            {
              parts: [
                "Записи показывают другое: после 2019 года Арен годами жил с этой травмой и всё равно прошёл сотни километров.",
              ],
              type: "p",
            },
          ],
          heading: "Почему леопарды теряют конечности",
        },
        {
          blocks: [
            {
              parts: [
                "Путь Арена показывает, почему важны экологические коридоры. Леопарду нужна большая территория, а в Грузии его записи приходятся на отдельные охраняемые территории: Вашлованы, Тушетию и Алгети. Путешествие, подобное пути Арена, не умещается в одну охраняемую территорию и охватывает две страны.",
              ],
              type: "p",
            },
            {
              parts: [
                "Коридор здесь — это непрерывная полоса подходящих местообитаний, по которой животное переходит из одного места в другое. Там, где такие полосы сохранились, бродячие особи могут приходить из соседних популяций. Там, где они прерываются, охраняемые территории остаются изолированными друг от друга.",
              ],
              type: "p",
            },
            {
              parts: [
                "Наблюдение за таким животным требует ресурсов. По данным Mongabay, в NACRES сейчас работают лишь три постоянных сотрудника. Специальной программы мониторинга Арена нет; по словам Лорткипанидзе, всё держится только на «доброй воле».",
              ],
              type: "p",
            },
            {
              parts: [
                "По оценке IUCN 2023 года, осталось 750–1044 переднеазиатских леопарда, из них 450–626 взрослых, и численность снижается. Для столь малочисленного подвида путь каждого бродячего животного — ценная информация. Другие ",
                { id: "mammals", label: "млекопитающие", type: "hub" },
                " Грузии собраны в атласе на отдельной странице.",
              ],
              type: "p",
            },
          ],
          heading: "Что это значит для Грузии",
        },
        {
          blocks: [
            {
              parts: [
                "Подтверждено: в сентябре 2025 года в национальном парке Алгети зафиксировали леопарда. Mongabay и WWF Caucasus считают его Ареном — животным, известным в Армении с 2019 года, у которого нет части передней конечности. В сообщении Национального агентства дикой природы от 17 сентября 2025 года животное по имени не названо. На камерах, снятых в конце апреля 2026 года, Арена уже не было.",
              ],
              type: "p",
            },
            {
              parts: [
                "Не установлено: точная причина потери конечности; путь, который Арен прошёл между записями; где он сейчас и действительно ли направляется в сторону Турции. Данных о том, есть ли у Арена шанс встретить другого леопарда в Грузии или на соседних территориях, в источниках тоже нет.",
              ],
              type: "p",
            },
          ],
          heading: "Что известно и что нет",
        },
        {
          blocks: [
            {
              parts: [
                "22 июля 2026 года министр окружающей среды Армении опубликовал видео леопарда, снятого фотоловушкой в Хосровском заповеднике. Особь не была идентифицирована, поэтому эту запись не следует приписывать Арену. Это ещё одно подтверждение присутствия леопарда в Армении, а не сведения о местонахождении Арена.",
              ],
              type: "p",
            },
          ],
          heading: "На полях: запись из Хосрова, 22 июля 2026 года",
        },
      ],
      title: "Трёхлапый леопард Арен: 250 км из Армении в Алгети",
    },
    tr: {
      dek: "Ermenistan'dan bilinen üç bacaklı bir İran leoparı Eylül 2025'te Algeti Milli Parkı'nda görüntülendi. Nisan 2026 sonunda oradaki kameralarda artık görünmüyordu.",
      lead: "Eylül 2025'te, Tiflis'in yaklaşık bir saat batısındaki Algeti Milli Parkı'nda geyik üretim çitinin güvenlik kamerası bir leopar kaydetti. Mongabay ve WWF Caucasus'a göre bu hayvan, Ermenistan'da ilk kez 2019'da kaydedilen ve bir ön bacağının alt kısmı eksik olan İran leoparı Aren'di.",
      metaDescription:
        "Üç bacaklı İran leoparı Aren, Ermenistan'dan Algeti Milli Parkı'na en az 250 km yürüdü. Onun hakkında bilinenler ve izinin kaybolduğu yer.",
      metaTitle: "Üç bacaklı leopar Aren: Ermenistan'dan Algeti'ye 250 km",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Görüntü, hayvanın kimliği anlaşılana kadar birkaç kişinin elinden geçti. Mongabay'e göre Tiflis Hayvanat Bahçesi müdürü Zurab Gurielidze görüntüyü önce NACRES'in kurucu ortağı Bezhan Lortkipanidze'ye gönderdi. Kaydı Ulusal Yaban Hayatı Ajansı'ndan Sergo Tabagari de inceliyordu. Tabagari, WWF Caucasus biyoloğu Vazha Kochiashvili'yi aradı. Kochiashvili leoparın üç bacağı olup olmadığını sordu. Vardı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Sorunun bir nedeni vardı. Aren ilk kez 2019 baharında Ermenistan'da, Arpa Korunan Peyzajı yakınındaki Areni köyünde kaydedildi. O sırada dört bacağı da vardı. Aynı yıl sol ön bacağının alt kısmı olmadan görüntülendi. Korucular yaralanmayı bir kara mayınına bağlıyor, ancak kesin neden belirlenmiş değil.",
              ],
              type: "p",
            },
            FIGURE_ARENI,
            {
              parts: [
                "Fotokapan görüntülerinde leoparlar genellikle bireysel benek desenleriyle ayırt edilir. Aren'in ise benekleri karşılaştırmadan da karede görülen bir işareti var: eksik uzvu. Bu yüzden tek bir kısa soru, Algeti'deki hayvanı Ermenistan'dan bilinen bir bireyle ilişkilendirmenin ilk adımı oldu.",
              ],
              type: "p",
            },
            {
              parts: [
                "2022'de kayıtlardan kayboldu. 2024'te yaklaşık 130 km kuzeyde, İcevan ormanında ortaya çıktı. Eylül 2025'te ",
                { id: "kvemo-kartli", label: "Kvemo Kartli", type: "region" },
                " bölgesindeki Algeti'ye ulaştığında en az 250 km yol almıştı. Haritada güzergâhı üç noktayla okunuyor: güney Ermenistan'da Arpa, kuzeydoğu Ermenistan'da İcevan ve Gürcistan'da Algeti.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_FOREST,
            {
              parts: [
                "Burada “en az” ifadesi önemli. Yalnızca kameraların onu yakaladığı noktalar biliniyor. Bu noktalar arasında hangi yolu izlediği ve her bölümde ne kadar kaldığı bilinmiyor.",
              ],
              type: "p",
            },
          ],
          heading: "Aren kim?",
        },
        {
          blocks: [
            {
              parts: [
                "Mongabay ve WWF Caucasus'a göre Algeti görüntüsü, İran leoparının (",
                { name: "Panthera pardus tulliana", type: "sci" },
                ") son 20 yılda Gürcistan'daki yalnızca üçüncü doğrulanmış kaydı.",
              ],
              type: "p",
            },
            {
              parts: [
                { name: "Panthera pardus", type: "sci" },
                " türü IUCN Kırmızı Listesi'nde Hassas (Vulnerable), ",
                { name: "P. p. tulliana", type: "sci" },
                " alttürü ise 2023 değerlendirmesinde Tehlikede (Endangered) kategorisinde. Gürcistan'ın 2014 Kırmızı Listesi'nde leopar, popülasyonu çok küçük olduğu için Kritik Tehlikede (CR) olarak yer alıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "İlk hikâye Vaşlovani'ye ait. 2003'te orada leopar izleri bulundu. İzler, Noe adı verilen ve 2009'a kadar fotokapanlara yakalanan bir erkeğe aitti. İkincisi: 2021 ve 2022'de fotokapanlar Tuşeti'de bir leopar kaydetti. Üçüncüsü Aren.",
              ],
              type: "p",
            },
            {
              parts: [
                "Üç kayıt da tek tek hayvanlara ait. Bu kayıtlar Gürcistan'da leopar popülasyonunun yeniden kurulduğu anlamına gelmiyor. Gezgin bireylerin zaman zaman Gürcistan topraklarında göründüğünü gösteriyor. Noe ve Aren'in ikisi de erkek. IUCN'nin 2023 değerlendirmesi de Kafkasya popülasyonunun henüz istikrarlı olmadığını belirtiyor: geniş alanda dolaşan erkekler görülüyor, ancak dişiler ve üreme yetersiz. Atlastaki tür profili: ",
                { id: "panthera-pardus", label: "leopar", type: "species" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "20 yılda üçüncü leopar",
        },
        {
          blocks: [
            {
              parts: [
                "Nisan 2026 sonunda Algeti'deki kameralar söküldü. Kızıl geyik, yaban domuzu, vaşak, yaban kedisi ve kurt kaydettiler, ancak Aren'den iz yoktu.",
              ],
              type: "p",
            },
            FIGURE_ALGETI_RIDGES,
            {
              parts: [
                "Kamerada kayıt olmaması hayvanın bölgeden ayrıldığını kanıtlamaz. Yalnızca o dönemde kameraların önünden geçmediği anlamına gelir. Bu yüzden “izi kayboldu” burada doğru ifade: ne ayrıldığı ne de kaldığı doğrulandı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Bezhan Lortkipanidze, leoparın Türkiye yönüne gitmiş olabileceğini düşünüyor. Bu bir tahmin, kanıtlanmış bir olgu değil. Bu yazının dayandığı kaynaklarda Algeti'den sonra Aren'e ait yeni bir kayıt yok.",
              ],
              type: "p",
            },
            {
              parts: [
                "Şu anki yeri, yaşı, ağırlığı ve sağlık durumu bilinmiyor.",
              ],
              type: "p",
            },
          ],
          heading: "Şimdi nerede?",
        },
        {
          blocks: [
            {
              parts: [
                "Aren bir istisna değil. WWF 2002'den bu yana Ermenistan'da 10 leopar kaydetti ve bunların üçünde bir uzuv eksikti.",
              ],
              type: "p",
            },
            {
              parts: [
                "Mongabay'in haberi, İran leoparını tehdit edenler arasında avcıları ve kara mayınlarını sayıyor. Mayınlar ve tuzaklar, uzuv kaybı için sık dile getirilen iki açıklama. Ancak bir fotokapan karesi yaralanmanın nedenini tek başına göstermez. Aren örneğinde korucuların açıklaması mayın, fakat neden doğrulanmış değil. Aynı sebeple üç yaralı hayvanın her biri belirli bir nedene bağlanamaz.",
              ],
              type: "p",
            },
            {
              parts: [
                "Kayıtların gösterdiği şu: Aren 2019'dan sonra yıllarca bu yarayla yaşadı ve yine de yüzlerce kilometre yol aldı.",
              ],
              type: "p",
            },
          ],
          heading: "Leoparlar neden uzuv kaybediyor?",
        },
        {
          blocks: [
            {
              parts: [
                "Aren'in yolu ekolojik koridorların neden önemli olduğunu gösteriyor. Leoparın geniş bir alana ihtiyacı var ve Gürcistan'daki kayıtları ayrı korunan alanlarda: Vaşlovani, Tuşeti ve Algeti. Aren'inki gibi bir yolculuk tek bir korunan alana sığmıyor ve iki ülkeyi kapsıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Koridor burada, hayvanın bir yerden diğerine geçmesini sağlayan kesintisiz bir uygun yaşam alanı şeridi demek. Bu şeritlerin korunduğu yerlerde gezgin bireyler komşu popülasyonlardan gelebiliyor. Kesildikleri yerlerde korunan alanlar birbirinden yalıtılmış kalıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Böyle bir hayvanı izlemek kaynak gerektiriyor. Mongabay'e göre NACRES şu anda yalnızca üç kalıcı çalışanla çalışıyor. Aren için özel bir izleme programı yok; Lortkipanidze'nin sözleriyle bu iş yalnızca “iyi niyetle” yürüyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "IUCN'nin 2023 değerlendirmesine göre geriye 750–1.044 İran leoparı kaldı; bunların 450–626'sı erişkin ve sayı azalıyor. Bu kadar küçük bir alttür için her gezgin hayvanın yolu değerli bir bilgi. Gürcistan'ın diğer ",
                { id: "mammals", label: "memelileri", type: "hub" },
                " atlasta ayrı bir sayfada toplandı.",
              ],
              type: "p",
            },
          ],
          heading: "Bu Gürcistan için ne anlama geliyor?",
        },
        {
          blocks: [
            {
              parts: [
                "Doğrulanan: Eylül 2025'te Algeti Milli Parkı'nda bir leopar kaydedildi. Mongabay ve WWF Caucasus onu Aren olarak tanımlıyor: Ermenistan'da 2019'dan beri bilinen ve bir ön uzvunun bir kısmı eksik olan hayvan. Ulusal Yaban Hayatı Ajansı'nın 17 Eylül 2025 tarihli duyurusu hayvanın adını vermiyor. Nisan 2026 sonunda sökülen kameralarda Aren artık görünmüyordu.",
              ],
              type: "p",
            },
            {
              parts: [
                "Belirlenmemiş olan: uzuv kaybının kesin nedeni; Aren'in kayıtlar arasında izlediği yol; şu an nerede olduğu ve gerçekten Türkiye yönüne gidip gitmediği. Aren'in Gürcistan'da ya da komşu bölgelerde başka bir leoparla karşılaşma şansı olup olmadığına dair de kaynaklarda veri yok.",
              ],
              type: "p",
            },
          ],
          heading: "Bildiklerimiz ve bilmediklerimiz",
        },
        {
          blocks: [
            {
              parts: [
                "22 Temmuz 2026'da Ermenistan Çevre Bakanı, Hosrov Ormanı Devlet Rezervi'nde bir fotokapanla kaydedilen leoparın videosunu paylaştı. Bireyin kimliği belirtilmedi, bu yüzden bu kayıt Aren'e atfedilmemeli. Ermenistan'da leopar varlığının bir başka doğrulaması, Aren'in nerede olduğuna dair bir bilgi değil.",
              ],
              type: "p",
            },
          ],
          heading: "Ek not: Hosrov kaydı, 22 Temmuz 2026",
        },
      ],
      title: "Üç bacaklı leopar Aren: Ermenistan'dan Algeti'ye 250 km",
    },
  },
  gallery: [PHOTO_ARENI, PHOTO_ALGETI_FOREST, PHOTO_ALGETI_RIDGES],
  id: "three-legged-leopard-aren-algeti",
  image: PHOTO_PERSIAN_LEOPARD,
  publishedAt: "2026-10-14T16:53:23+04:00",
  relatedHubIds: ["mammals"],
  relatedRegionIds: ["kvemo-kartli"],
  relatedSpeciesIds: ["panthera-pardus"],
  slug: "three-legged-leopard-aren-algeti",
  sources: [
    {
      name: {
        en: "Mongabay — Endangered Persian leopards persist across borders despite hunters and landmines, May 2026",
        ka: "Mongabay — Endangered Persian leopards persist across borders despite hunters and landmines, 2026 წლის მაისი",
        ru: "Mongabay — Endangered Persian leopards persist across borders despite hunters and landmines, май 2026",
        tr: "Mongabay — Endangered Persian leopards persist across borders despite hunters and landmines, Mayıs 2026",
      },
      url: MONGABAY_SOURCE,
    },
    {
      name: "WWF Caucasus — Rare Persian Leopard Recorded in Georgia",
      url: WWF_CAUCASUS_SOURCE,
    },
    {
      name: {
        en: "National Wildlife Agency of Georgia — Algeti record, 17 September 2025",
        ka: "ველური ბუნების ეროვნული სააგენტო — ალგეთის ჩანაწერი, 2025 წლის 17 სექტემბერი",
        ru: "Национальное агентство дикой природы Грузии — запись из Алгети, 17 сентября 2025",
        tr: "Gürcistan Ulusal Yaban Hayatı Ajansı — Algeti kaydı, 17 Eylül 2025",
      },
      url: WLA_SOURCE,
    },
    {
      name: "NACRES",
      url: NACRES_SOURCE,
    },
    {
      name: {
        en: "Armenpress — Khosrov Forest State Reserve leopard video, 22 July 2026",
        ka: "Armenpress — ხოსროვის ნაკრძალის ლეოპარდის ვიდეო, 2026 წლის 22 ივლისი",
        ru: "Armenpress — видео леопарда из Хосровского заповедника, 22 июля 2026",
        tr: "Armenpress — Hosrov Ormanı Devlet Rezervi leopar videosu, 22 Temmuz 2026",
      },
      url: ARMENPRESS_SOURCE,
    },
    {
      name: "IUCN Red List — Panthera pardus ssp. tulliana (2023)",
      url: IUCN_SOURCE,
    },
    {
      name: {
        en: "Government of Georgia Decree No. 190 (2014) — Red List of Georgia (in Georgian)",
        ka: "საქართველოს მთავრობის დადგენილება №190 (2014) — საქართველოს წითელი ნუსხა",
        ru: "Постановление правительства Грузии № 190 (2014) — Красный список Грузии (на грузинском)",
        tr: "Gürcistan Hükümeti 190 sayılı Kararı (2014) — Gürcistan Kırmızı Listesi (Gürcüce)",
      },
      url: RED_LIST_SOURCE,
    },
  ],
  status: "published",
  updatedAt: "2026-10-14T16:53:23+04:00",
};
