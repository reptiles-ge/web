import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

const PARLIAMENT_THIRD =
  "https://parliament.ge/en/media/news/parlamentma-kolkhetis-datsuli-teritoriebis-shekmnisa-da-martvis-shesakheb-kanonshi-tsvlilebebi-mesame-mosmenit-miigho";
const PARLIAMENT_FIRST =
  "https://www.parliament.ge/en/media/news/parlamentma-kolkhetis-datsuli-teritoriebis-shekmnisa-da-martvis-shesakheb-kanonshi-tsvlilebebi-pirveli-mosmenit-miigho";
const BERIDZE_THESIS =
  "https://nsm.iliauni.edu.ge/wp-content/uploads/2026/07/thamar-beridze.pdf";
const DIVERSITY_2022 = "https://doi.org/10.3390/d14121102";
const CONSERVATION_GENETICS_2022 = "https://doi.org/10.1007/s10592-021-01413-7";
const FAUNA_FLORA = "https://fauna-flora.org/news/saving-last-sturgeon";
const GEORGIA_TODAY = "https://georgiatoday.ge/?p=104475";

const FAUNA_FLORA_BABY_STURGEONS =
  "https://www.fauna-flora.org/news/little-fish-big-deal-record-haul-of-baby-sturgeons-offers-hope-for-the-future/";

const PHOTO_SPAWNING_GROUND: NewsPhoto = {
  alt: {
    en: "Aerial view of a sturgeon spawning ground on the Rioni.",
    ka: "ზუთხების ქვირითობის ადგილი რიონზე, ხედი ზემოდან.",
    ru: "Место нереста осетров на Риони, вид сверху.",
    tr: "Rioni’de bir mersin balığı yumurtlama alanının havadan görünümü.",
  },
  credit: {
    photographer: "Stephanie Foote / Fauna & Flora",
    url: FAUNA_FLORA_BABY_STURGEONS,
  },
  height: 1437,
  src: "https://cdn.reptiles.ge/news-rioni-sturgeon-foote-spawning-ground-aerial.jpg",
  width: 1920,
};

const PHOTO_SHIP_STURGEON: NewsPhoto = {
  alt: {
    en: "A ship sturgeon found in the Rioni by a local fisher.",
    ka: "ჯარღალა, რომელიც რიონში ადგილობრივმა მეთევზემ იპოვა.",
    ru: "Шип, найденный в Риони местным рыбаком.",
    tr: "Rioni’de yerel bir balıkçının bulduğu bir şip mersini.",
  },
  credit: {
    photographer: "Irakli Tsulaia",
    url: FAUNA_FLORA_BABY_STURGEONS,
  },
  height: 1200,
  src: "https://cdn.reptiles.ge/news-rioni-sturgeon-tsulaia-ship-sturgeon.jpg",
  width: 2000,
};

const PHOTO_JUVENILE: NewsPhoto = {
  alt: {
    en: "A juvenile sturgeon being measured during a survey on the Rioni.",
    ka: "ზუთხის მოზარდის გაზომვა რიონზე აღრიცხვისას.",
    ru: "Измерение молодого осетра во время учёта на Риони.",
    tr: "Rioni’deki bir sayım sırasında ölçülen genç bir mersin balığı.",
  },
  credit: {
    photographer: "Bianca Roberts / Fauna & Flora",
    url: FAUNA_FLORA_BABY_STURGEONS,
  },
  height: 1440,
  src: "https://cdn.reptiles.ge/news-rioni-sturgeon-roberts-juvenile-measured.jpg",
  width: 1920,
};

const FIGURE_JUVENILE = { src: PHOTO_JUVENILE.src, type: "figure" as const };
const FIGURE_SHIP_STURGEON = {
  src: PHOTO_SHIP_STURGEON.src,
  type: "figure" as const,
};

export const RIONI_STRICT_NATURE_RESERVE_STURGEON_2026: NewsArticle = {
  copy: {
    en: {
      dek: "The new area covers the stretch of the Rioni where sturgeon spawn. Researchers consider the river’s ship sturgeon likely the last surviving wild population of the species.",
      lead: "On 28 May 2026 the Parliament of Georgia passed, in the third reading and with 74 votes, amendments to the law “On the Establishment and Management of the Kolkheti Protected Areas”. They create a new 554-hectare protected area on the Rioni in Samtredia Municipality, covering the stretch where sturgeon spawn. Genetic studies show that at least three sturgeon species still spawn in the Rioni.",
      metaDescription:
        "Georgia’s parliament approved a 554 ha protected area on the Rioni where sturgeon spawn. Three species still breed there, including the rare ship sturgeon.",
      metaTitle: "Rioni sturgeon protected area: why the river matters",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The bill is a government initiative. Deputy Minister of Environmental Protection and Agriculture Zurab Ezugbaia presented it to parliament. On 27 May parliament adopted it in the first reading under an expedited procedure; on 28 May it passed the third reading with 74 votes.",
              ],
              type: "p",
            },
            {
              parts: [
                "Parliament’s Georgian-language releases call the new unit “Rioni aghkvetili”. It lies in Samtredia Municipality, ",
                { id: "imereti", label: "Imereti", type: "region" },
                ", covers 554 hectares and includes the section of the Rioni where sturgeon spawn.",
              ],
              type: "p",
            },
            {
              parts: [
                "The amendments do more. They update the boundaries of Kolkheti National Park and its marine area, and set the geographic coordinates of the Rioni area and of the Kolkheti Multiple-Use Area. They list the activities allowed there: scientific research, monitoring, restoration work and restricted transport movement. They also set special rules for fishing and for the use of watercraft. Parliament’s releases do not give the details of those rules.",
              ],
              type: "p",
            },
          ],
          heading: "What did parliament pass?",
        },
        {
          blocks: [
            {
              parts: [
                "The Rioni is the largest river in western Georgia, 327 km long. It is one of the main eastern tributaries of the Black Sea and one of the shortest rivers in which sturgeon spawn. Historically, 5–7 sturgeon species were known from Georgia. Tamar Beridze’s doctoral thesis, defended at Ilia State University in 2023, calls Georgia a global hotspot of sturgeon diversity.",
              ],
              type: "p",
            },
            {
              parts: [
                "Sturgeons are among the most endangered groups of animals. A 2022 paper in Conservation Genetics notes that all sturgeon species of the Rioni and the eastern Black Sea are listed as Critically Endangered, and some are locally extinct. For the Rioni, this matters most for the ship sturgeon (below).",
              ],
              type: "p",
            },
          ],
          heading: "Why the Rioni?",
        },
        {
          blocks: [
            {
              parts: [
                "The status below follows Beridze’s thesis (2023), which identified species with genetic markers. Spawning was shown by finding juveniles.",
              ],
              type: "p",
            },
            {
              parts: [
                "Russian sturgeon (",
                { name: "Acipenser gueldenstaedtii", type: "sci" },
                "): spawns in the Rioni; juveniles were found in the river and at its mouth. It is the most abundant species.",
              ],
              type: "p",
            },
            {
              parts: [
                "Stellate sturgeon (",
                { name: "Acipenser stellatus", type: "sci" },
                "): spawns in the Rioni, juveniles found, but it is much rarer. Natural hybrids with Russian sturgeon were found.",
              ],
              type: "p",
            },
            {
              parts: [
                "Ship sturgeon (",
                { name: "Acipenser nudiventris", type: "sci" },
                "): spawns in the Rioni and was found only in the river. Recorded fish measured 10 to 75 cm.",
              ],
              type: "p",
            },
            {
              parts: [
                "Beluga (",
                { name: "Huso huso", type: "sci" },
                "): persists in Georgia’s Black Sea waters, but only adults were found and no juveniles. Whether it still spawns in Georgian rivers is unknown.",
              ],
              type: "p",
            },
            {
              parts: [
                "Siberian sturgeon (",
                { name: "Acipenser baerii", type: "sci" },
                "): not native. Three fish were found in the Rioni and on the Black Sea coast at Grigoleti.",
              ],
              type: "p",
            },
            {
              parts: [
                "The same markers did not detect ",
                { name: "Acipenser sturio", type: "sci" },
                ", ",
                { name: "Acipenser persicus colchicus", type: "sci" },
                " or ",
                { name: "Acipenser colchicus", type: "sci" },
                ".",
              ],
              type: "p",
            },
            FIGURE_JUVENILE,
          ],
          heading: "Which sturgeons live in Georgia today?",
        },
        {
          blocks: [
            {
              parts: [
                "The ship sturgeon is Critically Endangered on the IUCN Red List. In the 20th century it vanished from the Aral, Azov and Black Seas and almost disappeared from the Caspian. It was considered regionally extinct in the Black Sea basin and had not been recorded in Georgia for three decades.",
              ],
              type: "p",
            },
            {
              parts: [
                "In 2020–2022, 22 ship sturgeon sightings were collected on the Rioni, including 9 genetic samples from fin clips. All nine share one mitochondrial haplotype that differs from every ship sturgeon haplotype in GenBank: by two nucleotides from the Caspian Sea haplotype and by seven from the Ili River (Balkhash basin) haplotype. The samples showed no sign of hybridisation.",
              ],
              type: "p",
            },
            {
              parts: [
                "Beridze’s thesis adds that the Rioni haplotype also differs from known commercial ship sturgeon haplotypes, so the fish did not come from the Krasnodar sturgeon gene-pool centre or from farms. The 2022 paper in Diversity calls them a remnant of an older Black Sea population. The thesis concludes that the Rioni population is likely the last surviving wild ship sturgeon population in the world.",
              ],
              type: "p",
            },
            FIGURE_SHIP_STURGEON,
          ],
          heading: "Ship sturgeon: a “lost” species found again",
        },
        {
          blocks: [
            {
              parts: [
                "Dams. After the Vartsikhe hydropower cascade was built (1968–1987), the stretch of the middle Rioni suitable for sturgeon spawning shrank from an estimated 57 km to 9 km, about 16% of its former length. The thesis also names poaching, gravel mining and pollution as pressures.",
              ],
              type: "p",
            },
            {
              parts: [
                "Hybridisation. Among 94 samples collected in 2018–2020, four juveniles turned out to be hybrids between Russian and stellate sturgeon: the first evidence of natural hybridisation in the Rioni. This cross is not used in aquaculture and there is no stellate sturgeon hatchery in the area, so farm escape was ruled out. The authors suggest that the low density of stellate sturgeon makes it harder to find a mate of its own species. The thesis reports six such hybrids, all with a Russian sturgeon mother.",
              ],
              type: "p",
            },
            {
              parts: [
                "Non-native Siberian sturgeon. Of the three fish (two juveniles and one adult), the adult, a 90 cm male, was found in August 2020 near Samtredia, close to a likely spawning ground. It is a commercial species and may have escaped or been released from aquaculture. The thesis sees it as a possible threat to native sturgeon.",
              ],
              type: "p",
            },
            {
              parts: [
                "Illegal trade. Samples from Georgian fish markets and farms (2016–2020) contained four species: Russian sturgeon, stellate sturgeon, beluga and sterlet (",
                { name: "Acipenser ruthenus", type: "sci" },
                "). Russian sturgeon made up almost 92%. Genetic markers separated wild from farmed Russian sturgeon and showed that wild genotypes were sold in Georgian fish markets, especially in coastal markets of western Georgia. The thesis notes that such sales are illegal.",
              ],
              type: "p",
            },
          ],
          heading: "Threats",
        },
        {
          blocks: [
            {
              parts: [
                "The category. Georgian releases use “aghkvetili”. Parliament’s English releases call the area “Rioni Managed Reserve” at the first reading and “Rioni Strict Nature Reserve” at the third. These are different categories. The final category is set by the official text of the law on matsne.gov.ge, which we have not yet checked.",
              ],
              type: "p",
            },
            {
              parts: [
                "Implementation. We have no information on whether the area is already managed or protected on the ground, or on the details of its fishing and watercraft rules.",
              ],
              type: "p",
            },
            {
              parts: [
                "The science. The sources used here give no estimate of sturgeon numbers in the Rioni. Whether beluga spawn in Georgia is unknown. Estimates of the lost spawning stretch differ: the thesis also cites a reduction from about 90 km to 9 km. “Last wild population” is the thesis authors’ cautious conclusion; an introduced population of Aral origin lives in the Ili River in Kazakhstan. The market study was a manuscript in preparation when the thesis was submitted.",
              ],
              type: "p",
            },
            {
              parts: [
                "Sturgeons are not in this atlas. See other ",
                { label: "news", type: "news-index" },
                " for more records.",
              ],
              type: "p",
            },
          ],
          heading: "What remains unclear?",
        },
      ],
      title: "Parliament approves a 554-hectare Rioni area to protect sturgeon",
    },
    ka: {
      dek: "ახალი ტერიტორია რიონის იმ მონაკვეთს მოიცავს, სადაც ზუთხი ქვირითობს. მკვლევრების დასკვნით, რიონში, სავარაუდოდ, ჯარღალას ბოლო ველური პოპულაცია ცხოვრობს მსოფლიოში.",
      lead: "2026 წლის 28 მაისს საქართველოს პარლამენტმა მესამე მოსმენით, 74 ხმით მიიღო ცვლილებები კანონში „კოლხეთის დაცული ტერიტორიების შექმნისა და მართვის შესახებ“. ცვლილებებით სამტრედიის მუნიციპალიტეტში, მდინარე რიონზე, 554-ჰექტრიანი დაცული ტერიტორია იქმნება. ის მოიცავს მონაკვეთს, სადაც ზუთხისებრები ქვირითობენ. გენეტიკური კვლევებით, რიონში დღესაც ქვირითობს ზუთხის სულ მცირე სამი სახეობა.",
      metaDescription:
        "პარლამენტმა რიონზე, სამტრედიის მუნიციპალიტეტში, 554 ჰა დაცული ტერიტორია დაამტკიცა. აქ ჯერ კიდევ ქვირითობს ზუთხის სამი სახეობა, მათ შორის ჯარღალა.",
      metaTitle: "რიონის აღკვეთილი: რატომ არის რიონის ზუთხი უნიკალური",
      sections: [
        {
          blocks: [
            {
              parts: [
                "კანონპროექტი მთავრობის ინიციატივაა. პარლამენტს ის გარემოს დაცვისა და სოფლის მეურნეობის მინისტრის მოადგილემ ზურაბ ეზუგბაიამ წარუდგინა. 27 მაისს საკითხი კომიტეტმა განიხილა და პარლამენტმა იმავე დღეს, დაჩქარებული წესით, პირველი მოსმენით მიიღო. 28 მაისს კანონი მესამე მოსმენით 74 ხმით დამტკიცდა.",
              ],
              type: "p",
            },
            {
              parts: [
                "პარლამენტის ქართულენოვან ცნობებში ახალ ერთეულს „რიონის აღკვეთილი“ ჰქვია. ის სამტრედიის მუნიციპალიტეტში (",
                { id: "imereti", label: "იმერეთი", type: "region" },
                ") მდებარეობს, 554 ჰექტარს ფარავს და მოიცავს რიონის იმ მონაკვეთს, სადაც ზუთხისებრები ქვირითობენ.",
              ],
              type: "p",
            },
            {
              parts: [
                "ცვლილებები სხვა საკითხებსაც ეხება. ახლდება კოლხეთის ეროვნული პარკისა და მისი საზღვაო ნაწილის საზღვრები, დგინდება რიონის აღკვეთილისა და კოლხეთის მრავალმხრივი გამოყენების ტერიტორიის გეოგრაფიული კოორდინატები. კანონი განსაზღვრავს, რა საქმიანობაა დაშვებული ამ ტერიტორიებზე: სამეცნიერო კვლევა, მონიტორინგი, აღდგენითი ღონისძიებები და შეზღუდული სატრანსპორტო გადაადგილება. ასევე დგინდება თევზჭერისა და წყალმცურავი საშუალებების გამოყენების სპეციალური წესები. ამ წესების დეტალები პარლამენტის ცნობებში მოცემული არ არის.",
              ],
              type: "p",
            },
          ],
          heading: "რა მიიღო პარლამენტმა?",
        },
        {
          blocks: [
            {
              parts: [
                "რიონი დასავლეთ საქართველოს უდიდესი მდინარეა, მისი სიგრძე 327 კილომეტრია. ის შავი ზღვის აღმოსავლეთ ნაწილის ერთ-ერთი მთავარი შენაკადია და ერთ-ერთი ყველაზე მოკლე მდინარე, სადაც ზუთხი ქვირითობს. ისტორიულად საქართველოში ზუთხისებრთა 5–7 სახეობა იყო ცნობილი. თამარ ბერიძის სადოქტორო ნაშრომი, რომელიც ილიას სახელმწიფო უნივერსიტეტში 2023 წელს დაიცვა, საქართველოს ზუთხისებრთა მრავალფეროვნების გლობალურ ცხელ წერტილს უწოდებს.",
              ],
              type: "p",
            },
            {
              parts: [
                "ზუთხისებრები ცხოველთა ერთ-ერთი ყველაზე საფრთხეში მყოფი ჯგუფია. Conservation Genetics-ში 2022 წელს გამოქვეყნებული სტატიის თანახმად, რიონსა და შავი ზღვის აღმოსავლეთ ნაწილში გავრცელებული ზუთხის ყველა სახეობა IUCN-ის წითელ ნუსხაში კრიტიკულად საფრთხეში მყოფად (CR) არის შეფასებული, ზოგი კი ადგილობრივად გადაშენებულია. რიონისთვის ეს განსაკუთრებით მნიშვნელოვანია ჯარღალას გამო (იხ. ქვემოთ).",
              ],
              type: "p",
            },
          ],
          heading: "რატომ რიონი?",
        },
        {
          blocks: [
            {
              parts: [
                "სტატუსი ქვემოთ ბერიძის ნაშრომს (2023) ეყრდნობა, სადაც სახეობები გენეტიკური მარკერებით დადგინდა. ქვირითობის მტკიცებულებაა იუვენილური ინდივიდების აღმოჩენა.",
              ],
              type: "p",
            },
            {
              parts: [
                "რუსული ზუთხი (",
                { name: "Acipenser gueldenstaedtii", type: "sci" },
                "): ქვირითობს რიონში; იუვენილები მდინარეშიც და შესართავთანაც ნაპოვნია. ყველაზე მრავალრიცხოვანი სახეობაა.",
              ],
              type: "p",
            },
            {
              parts: [
                "ტარაღანა (",
                { name: "Acipenser stellatus", type: "sci" },
                "): ქვირითობს რიონში, იუვენილები ნაპოვნია, თუმცა გაცილებით იშვიათია. დაფიქსირდა მისი ბუნებრივი ჰიბრიდები რუსულ ზუთხთან.",
              ],
              type: "p",
            },
            {
              parts: [
                "ჯარღალა (",
                { name: "Acipenser nudiventris", type: "sci" },
                "): ქვირითობს რიონში და მხოლოდ მდინარეში აღმოაჩინეს. დაფიქსირებული ინდივიდების სიგრძე 10-დან 75 სმ-მდე იყო.",
              ],
              type: "p",
            },
            {
              parts: [
                "სვია (",
                { name: "Huso huso", type: "sci" },
                "): შემორჩენილია საქართველოს შავი ზღვის აკვატორიაში, მაგრამ მხოლოდ ზრდასრული ინდივიდები აღმოაჩინეს, იუვენილები კი არ დაფიქსირებულა. ქვირითობს თუ არა ის ჯერ კიდევ საქართველოს მდინარეებში, უცნობია.",
              ],
              type: "p",
            },
            {
              parts: [
                "ციმბირული ზუთხი (",
                { name: "Acipenser baerii", type: "sci" },
                "): არაადგილობრივი სახეობაა. სამი ინდივიდი ნაპოვნია რიონში და შავი ზღვის სანაპიროზე, გრიგოლეთთან.",
              ],
              type: "p",
            },
            {
              parts: [
                "იმავე მარკერებით ვერ გამოვლინდა ",
                { name: "Acipenser sturio", type: "sci" },
                ", ",
                { name: "Acipenser persicus colchicus", type: "sci" },
                " და ",
                { name: "Acipenser colchicus", type: "sci" },
                ".",
              ],
              type: "p",
            },
            FIGURE_JUVENILE,
          ],
          heading: "რომელი ზუთხები ცხოვრობენ დღეს საქართველოში?",
        },
        {
          blocks: [
            {
              parts: [
                "ჯარღალა IUCN-ის წითელ ნუსხაში კრიტიკულად საფრთხეში მყოფი სახეობაა. XX საუკუნეში ის არალის, აზოვისა და შავ ზღვებში გაქრა, კასპიის ზღვაშიც თითქმის აღარ გვხვდება. შავი ზღვის აუზში ის რეგიონულად გადაშენებულად ითვლებოდა, საქართველოში კი სამი ათწლეულის განმავლობაში არ დაფიქსირებულა.",
              ],
              type: "p",
            },
            {
              parts: [
                "2020–2022 წლებში რიონში ჯარღალას 22 დაკვირვება შეგროვდა, მათ შორის 9 გენეტიკური ნიმუში, რომლებიც ფარფლის პატარა ნაჭრიდან აიღეს. ცხრავე ნიმუშს ერთი და იგივე მიტოქონდრიული ჰაპლოტიპი აქვს. ის GenBank-ში არსებული ჯარღალას ყველა ჰაპლოტიპისგან განსხვავდება: კასპიის ზღვის ჰაპლოტიპისგან ორი, მდინარე ილის (ბალხაშის აუზი) ჰაპლოტიპისგან კი შვიდი ნუკლეოტიდით. ჰიბრიდიზაციის ნიშნები ნიმუშებში არ აღმოჩნდა.",
              ],
              type: "p",
            },
            {
              parts: [
                "ბერიძის ნაშრომის მიხედვით, რიონის ჰაპლოტიპი ჯარღალას ცნობილი კომერციული ჰაპლოტიპებისგანაც განსხვავდება. ესე იგი, შესწავლილი თევზები არც კრასნოდარის ზუთხის გენოფონდის კონსერვაციის ცენტრიდან არის და არც ფერმიდან. Diversity-ში 2022 წელს გამოქვეყნებული სტატია მათ შავი ზღვის ძველი პოპულაციის ნაშთად მიიჩნევს. სადოქტორო ნაშრომი კი ასკვნის, რომ რიონის პოპულაცია, სავარაუდოდ, ჯარღალას ბოლო შემორჩენილი ველური პოპულაციაა მსოფლიოში.",
              ],
              type: "p",
            },
            FIGURE_SHIP_STURGEON,
          ],
          heading: "ჯარღალა — „გადაშენებული“ სახეობის აღმოჩენა",
        },
        {
          blocks: [
            {
              parts: [
                "ჰესები. ვარციხის ჰესების კასკადის აშენების შემდეგ (1968–1987) რიონის შუა წელში ზუთხის ქვირითობისთვის ვარგისი მონაკვეთი დაახლოებით 57 კილომეტრიდან 9 კილომეტრამდე შემცირდა. ეს ყოფილი სიგრძის დაახლოებით 16%-ია. ნაშრომი ზეწოლის სხვა ფაქტორებსაც ასახელებს: ბრაკონიერობას, ხრეშის მოპოვებას და დაბინძურებას.",
              ],
              type: "p",
            },
            {
              parts: [
                "ჰიბრიდიზაცია. 2018–2020 წლებში შეგროვებულ 94 ნიმუშს შორის ოთხი იუვენილი რუსული ზუთხისა და ტარაღანას ჰიბრიდი აღმოჩნდა. ეს რიონში ბუნებრივი ჰიბრიდიზაციის პირველი მტკიცებულება იყო. ასეთ ჰიბრიდს აკვაკულტურაში არ იყენებენ და რეგიონში ტარაღანას საშენი მეურნეობა არ არის, ამიტომ ფერმიდან გაქცევა გამოირიცხა. ავტორები ვარაუდობენ, რომ ტარაღანას დაბალი სიმჭიდროვის გამო მას უჭირს საკუთარი სახეობის პარტნიორის პოვნა. სადოქტორო ნაშრომში ასეთი ჰიბრიდი ექვსია და ყველას დედა რუსული ზუთხია.",
              ],
              type: "p",
            },
            {
              parts: [
                "ინვაზიური ციმბირული ზუთხი. სამი ინდივიდიდან (ორი იუვენილი და ერთი ზრდასრული) ზრდასრული, 90 სმ სიგრძის მამალი, 2020 წლის აგვისტოში სამტრედიასთან, ზუთხის სავარაუდო ქვირითობის ადგილის ახლოს აღმოაჩინეს. ეს სამრეწველო სახეობაა და შესაძლოა აკვაკულტურიდან გაქცეული ან გაშვებული იყოს. ნაშრომი მას ადგილობრივი ზუთხისთვის შესაძლო საფრთხედ მიიჩნევს.",
              ],
              type: "p",
            },
            {
              parts: [
                "უკანონო ვაჭრობა. საქართველოს თევზის ბაზრებსა და ფერმებში (2016–2020) აღებულ ნიმუშებში ოთხი სახეობა გამოვლინდა: რუსული ზუთხი, ტარაღანა, სვია და სტერლეტი (",
                { name: "Acipenser ruthenus", type: "sci" },
                "). თითქმის 92% რუსული ზუთხი იყო. გენეტიკურმა მარკერებმა ველური და ფერმის რუსული ზუთხი ერთმანეთისგან განასხვავა და აჩვენა, რომ საქართველოს თევზის ბაზრებზე, განსაკუთრებით დასავლეთ საქართველოს სანაპირო ბაზრებზე, ველური გენოტიპის ზუთხი იყიდებოდა. ნაშრომის თანახმად, ასეთი ვაჭრობა უკანონოა.",
              ],
              type: "p",
            },
          ],
          heading: "საფრთხეები",
        },
        {
          blocks: [
            {
              parts: [
                "კატეგორია. ქართულ ცნობებში ტერიტორია „რიონის აღკვეთილად“ მოიხსენიება. პარლამენტის ინგლისურენოვან ცნობებში კი პირველი მოსმენისას Rioni Managed Reserve-ად, მესამე მოსმენისას კი Rioni Strict Nature Reserve-ად. ეს სხვადასხვა კატეგორიაა. საბოლოო კატეგორიას კანონის ოფიციალური ტექსტი ადგენს matsne.gov.ge-ზე, რომელიც ჯერ არ გადაგვიმოწმებია.",
              ],
              type: "p",
            },
            {
              parts: [
                "განხორციელება. ჩვენ არ გვაქვს ინფორმაცია, იმართება ან დაცულია თუ არა ტერიტორია უკვე ადგილზე. უცნობია თევზჭერისა და წყალმცურავი საშუალებების წესების დეტალებიც.",
              ],
              type: "p",
            },
            {
              parts: [
                "მეცნიერება. აქ გამოყენებულ წყაროებში რიონის ზუთხის რიცხოვნობის შეფასება არ არის. უცნობია, ქვირითობს თუ არა სვია საქართველოში. დაკარგული მონაკვეთის შეფასებები განსხვავდება: ნაშრომი ასევე იმოწმებს შემცირებას დაახლოებით 90-დან 9 კილომეტრამდე. „ბოლო ველური პოპულაცია“ ავტორების ფრთხილი დასკვნაა; ყაზახეთში, მდინარე ილიში, არალის წარმოშობის შეყვანილი პოპულაცია ცხოვრობს. ბაზრების კვლევა ნაშრომის წარდგენისას ჯერ კიდევ მომზადების პროცესში მყოფი ხელნაწერი იყო.",
              ],
              type: "p",
            },
            {
              parts: [
                "ზუთხისებრები ამ ატლასში არ არის. სხვა ჩანაწერები იხილეთ ",
                { label: "სიახლეებში", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "რა რჩება გაურკვეველი?",
        },
      ],
      title: "პარლამენტმა რიონზე ზუთხისთვის 554-ჰექტრიანი ტერიტორია დაამტკიცა",
    },
    ru: {
      dek: "Новая территория охватывает участок Риони, где нерестятся осетры. По выводу исследователей, в Риони, вероятно, живёт последняя дикая популяция шипа в мире.",
      lead: "28 мая 2026 года парламент Грузии в третьем чтении 74 голосами принял поправки в закон «О создании и управлении охраняемыми территориями Колхети». Они создают на реке Риони в Самтредском муниципалитете новую охраняемую территорию площадью 554 гектара, которая охватывает участок нереста осетровых. Генетические исследования показывают, что в Риони до сих пор нерестятся как минимум три вида осетров.",
      metaDescription:
        "Парламент Грузии утвердил охраняемую территорию 554 га на Риони, где нерестятся осетры. Там размножаются три вида, включая редкого шипа.",
      metaTitle: "Риони и осетры: почему река уникальна для мира",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Законопроект — инициатива правительства. Его представил заместитель министра охраны окружающей среды и сельского хозяйства Зураб Эзугбая. 27 мая парламент принял его в первом чтении в ускоренном порядке; 28 мая закон прошёл третье чтение 74 голосами.",
              ],
              type: "p",
            },
            {
              parts: [
                "В грузиноязычных сообщениях парламента новая единица называется «Rioni aghkvetili». Она находится в Самтредском муниципалитете (",
                { id: "imereti", label: "Имерети", type: "region" },
                "), занимает 554 гектара и включает участок Риони, где нерестятся осетровые.",
              ],
              type: "p",
            },
            {
              parts: [
                "Поправки касаются и другого. Они обновляют границы Колхетского национального парка и его морской части, устанавливают координаты Рионской территории и Колхетской территории многоцелевого использования. Закон перечисляет разрешённые виды деятельности: научные исследования, мониторинг, восстановительные работы и ограниченное передвижение транспорта. Также вводятся особые правила рыболовства и использования плавсредств. Подробностей этих правил в сообщениях парламента нет.",
              ],
              type: "p",
            },
          ],
          heading: "Что принял парламент?",
        },
        {
          blocks: [
            {
              parts: [
                "Риони — крупнейшая река Западной Грузии длиной 327 км. Это один из главных восточных притоков Чёрного моря и одна из самых коротких рек, где нерестятся осетры. Исторически в Грузии было известно 5–7 видов осетровых. Диссертация Тамар Беридзе, защищённая в Государственном университете Ильи в 2023 году, называет Грузию глобальной горячей точкой разнообразия осетровых.",
              ],
              type: "p",
            },
            {
              parts: [
                "Осетровые — одна из самых угрожаемых групп животных. Статья 2022 года в Conservation Genetics отмечает, что все виды осетров Риони и восточной части Чёрного моря отнесены к категории «находящиеся на грани исчезновения» (CR), а некоторые там уже исчезли. Для Риони это особенно важно из-за шипа (см. ниже).",
              ],
              type: "p",
            },
          ],
          heading: "Почему Риони?",
        },
        {
          blocks: [
            {
              parts: [
                "Статус ниже приведён по диссертации Беридзе (2023), где виды определены генетическими маркерами. Доказательство нереста — находки молоди.",
              ],
              type: "p",
            },
            {
              parts: [
                "Русский осётр (",
                { name: "Acipenser gueldenstaedtii", type: "sci" },
                "): нерестится в Риони; молодь найдена в реке и в устье. Самый многочисленный вид.",
              ],
              type: "p",
            },
            {
              parts: [
                "Севрюга (",
                { name: "Acipenser stellatus", type: "sci" },
                "): нерестится в Риони, молодь найдена, но вид гораздо реже. Найдены её природные гибриды с русским осетром.",
              ],
              type: "p",
            },
            {
              parts: [
                "Шип (",
                { name: "Acipenser nudiventris", type: "sci" },
                "): нерестится в Риони и найден только в реке. Длина зарегистрированных рыб — от 10 до 75 см.",
              ],
              type: "p",
            },
            {
              parts: [
                "Белуга (",
                { name: "Huso huso", type: "sci" },
                "): сохраняется в грузинских водах Чёрного моря, но найдены только взрослые особи, молодь не зарегистрирована. Нерестится ли она ещё в реках Грузии, неизвестно.",
              ],
              type: "p",
            },
            {
              parts: [
                "Сибирский осётр (",
                { name: "Acipenser baerii", type: "sci" },
                "): чужеродный вид. Три особи найдены в Риони и на побережье Чёрного моря у Григолети.",
              ],
              type: "p",
            },
            {
              parts: [
                "Теми же маркерами не обнаружены ",
                { name: "Acipenser sturio", type: "sci" },
                ", ",
                { name: "Acipenser persicus colchicus", type: "sci" },
                " и ",
                { name: "Acipenser colchicus", type: "sci" },
                ".",
              ],
              type: "p",
            },
            FIGURE_JUVENILE,
          ],
          heading: "Какие осетры живут в Грузии сегодня?",
        },
        {
          blocks: [
            {
              parts: [
                "Шип в Красном списке МСОП — вид на грани исчезновения. В XX веке он исчез из Аральского, Азовского и Чёрного морей и почти пропал из Каспия. В бассейне Чёрного моря его считали регионально исчезнувшим, а в Грузии его не регистрировали три десятилетия.",
              ],
              type: "p",
            },
            {
              parts: [
                "В 2020–2022 годах на Риони собрали 22 наблюдения шипа, в том числе 9 генетических проб из кусочков плавников. У всех девяти один митохондриальный гаплотип, отличный от всех гаплотипов шипа в GenBank: на два нуклеотида от каспийского и на семь от гаплотипа реки Или (бассейн Балхаша). Признаков гибридизации в пробах нет.",
              ],
              type: "p",
            },
            {
              parts: [
                "По диссертации Беридзе, рионский гаплотип отличается и от известных коммерческих гаплотипов шипа, то есть рыбы не из Краснодарского центра сохранения генофонда осетровых и не с ферм. Статья 2022 года в Diversity считает их остатком древней черноморской популяции. Диссертация заключает, что рионская популяция — вероятно, последняя сохранившаяся дикая популяция шипа в мире.",
              ],
              type: "p",
            },
            FIGURE_SHIP_STURGEON,
          ],
          heading: "Шип: «исчезнувший» вид найден снова",
        },
        {
          blocks: [
            {
              parts: [
                "ГЭС. После строительства каскада Варцихских ГЭС (1968–1987) пригодный для нереста участок в среднем течении Риони сократился примерно с 57 до 9 км — около 16% прежней длины. Диссертация называет и другие факторы: браконьерство, добычу гравия и загрязнение.",
              ],
              type: "p",
            },
            {
              parts: [
                "Гибридизация. Среди 94 проб 2018–2020 годов четыре особи молоди оказались гибридами русского осетра и севрюги — первое доказательство природной гибридизации в Риони. Такой гибрид не используют в аквакультуре, а рыбоводного хозяйства севрюги в регионе нет, поэтому побег с фермы исключён. Авторы предполагают, что при низкой плотности севрюге трудно найти партнёра своего вида. В диссертации таких гибридов шесть, и у всех мать — русский осётр.",
              ],
              type: "p",
            },
            {
              parts: [
                "Чужеродный сибирский осётр. Из трёх особей (две молоди и одна взрослая) взрослый самец длиной 90 см найден в августе 2020 года у Самтредиа, рядом с вероятным нерестилищем. Это промысловый вид; он мог сбежать или быть выпущенным из аквакультуры. Диссертация считает его возможной угрозой для местных осетров.",
              ],
              type: "p",
            },
            {
              parts: [
                "Незаконная торговля. В пробах с рыбных рынков и ферм Грузии (2016–2020) выявлено четыре вида: русский осётр, севрюга, белуга и стерлядь (",
                { name: "Acipenser ruthenus", type: "sci" },
                "). Почти 92% составлял русский осётр. Генетические маркеры отличили дикого русского осетра от фермерского и показали, что на рыбных рынках Грузии, особенно в прибрежной Западной Грузии, продавались особи дикого генотипа. Диссертация отмечает, что такая торговля незаконна.",
              ],
              type: "p",
            },
          ],
          heading: "Угрозы",
        },
        {
          blocks: [
            {
              parts: [
                "Категория. Грузинские сообщения используют слово «aghkvetili». Англоязычные сообщения парламента называют территорию «Rioni Managed Reserve» в первом чтении и «Rioni Strict Nature Reserve» в третьем. Это разные категории. Окончательную категорию задаёт официальный текст закона на matsne.gov.ge, который мы ещё не проверили.",
              ],
              type: "p",
            },
            {
              parts: [
                "Исполнение. У нас нет информации, управляется ли и охраняется ли территория уже на месте, и о деталях правил рыболовства и плавсредств.",
              ],
              type: "p",
            },
            {
              parts: [
                "Наука. В использованных здесь источниках нет оценки численности осетров в Риони. Неизвестно, нерестится ли белуга в Грузии. Оценки потерянного участка расходятся: диссертация цитирует и сокращение примерно с 90 до 9 км. «Последняя дикая популяция» — осторожный вывод авторов; в реке Или в Казахстане живёт интродуцированная популяция аральского происхождения. Исследование рынков на момент подачи диссертации было рукописью в подготовке.",
              ],
              type: "p",
            },
            {
              parts: [
                "Осетровых в этом атласе нет. Другие записи — в разделе ",
                { label: "новости", type: "news-index" },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Что остаётся неясным?",
        },
      ],
      title: "Парламент утвердил на Риони 554 гектара для охраны осетров",
    },
    tr: {
      dek: "Yeni alan, Rioni’de mersin balıklarının yumurtladığı kesimi kapsıyor. Araştırmacılara göre Rioni, muhtemelen dünyadaki son yabani şip mersini popülasyonuna ev sahipliği yapıyor.",
      lead: "Gürcistan Parlamentosu 28 Mayıs 2026’da “Kolheti Korunan Alanlarının Kurulması ve Yönetimi Hakkında” kanunda yapılan değişiklikleri üçüncü okumada 74 oyla kabul etti. Değişiklikler, Samtredia Belediyesi’nde Rioni Nehri üzerinde 554 hektarlık yeni bir korunan alan oluşturuyor. Alan, mersin balıklarının yumurtladığı kesimi kapsıyor. Genetik çalışmalar, Rioni’de en az üç mersin türünün hâlâ yumurtladığını gösteriyor.",
      metaDescription:
        "Gürcistan parlamentosu Rioni’de mersin balıklarının yumurtladığı 554 ha’lık alanı onayladı. Nadir şip mersini dahil üç tür orada üremeye devam ediyor.",
      metaTitle: "Rioni ve mersin balıkları: bu nehir neden eşsiz?",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Tasarı bir hükümet girişimi. Parlamentoya Çevre Koruma ve Tarım Bakan Yardımcısı Zurab Ezugbaia sundu. Parlamento 27 Mayıs’ta tasarıyı hızlandırılmış usulle ilk okumada kabul etti; 28 Mayıs’ta kanun üçüncü okumada 74 oyla geçti.",
              ],
              type: "p",
            },
            {
              parts: [
                "Parlamentonun Gürcüce duyurularında yeni birimin adı “Rioni aghkvetili”. Alan Samtredia Belediyesi’nde (",
                { id: "imereti", label: "İmereti", type: "region" },
                ") yer alıyor, 554 hektarı kapsıyor ve Rioni’nin mersin balıklarının yumurtladığı kesimini içeriyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Değişiklikler başka konuları da kapsıyor. Kolheti Milli Parkı’nın ve deniz bölümünün sınırları güncelleniyor, Rioni alanı ile Kolheti Çok Amaçlı Kullanım Alanı’nın koordinatları belirleniyor. Kanun izin verilen faaliyetleri sayıyor: bilimsel araştırma, izleme, restorasyon çalışmaları ve sınırlı ulaşım. Balıkçılık ve deniz araçlarının kullanımı için özel kurallar da getiriliyor. Parlamento duyuruları bu kuralların ayrıntısını vermiyor.",
              ],
              type: "p",
            },
          ],
          heading: "Parlamento neyi kabul etti?",
        },
        {
          blocks: [
            {
              parts: [
                "Rioni, 327 km uzunluğuyla Batı Gürcistan’ın en büyük nehri. Karadeniz’in başlıca doğu kollarından biri ve mersin balıklarının yumurtladığı en kısa nehirlerden biri. Tarihsel olarak Gürcistan’da 5–7 mersin türü biliniyordu. Tamar Beridze’nin 2023’te İlia Devlet Üniversitesi’nde savunduğu doktora tezi, Gürcistan’ı mersin çeşitliliği açısından küresel bir sıcak nokta olarak tanımlıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Mersin balıkları en çok tehdit altındaki hayvan gruplarından biri. Conservation Genetics’te 2022’de yayımlanan bir makaleye göre Rioni’deki ve doğu Karadeniz’deki tüm mersin türleri Kritik Tehlike Altında (CR) olarak listeleniyor; bazıları bölgede yok olmuş. Rioni için bu en çok şip mersini nedeniyle önemli (aşağıya bakın).",
              ],
              type: "p",
            },
          ],
          heading: "Neden Rioni?",
        },
        {
          blocks: [
            {
              parts: [
                "Aşağıdaki durum, türlerin genetik belirteçlerle tanımlandığı Beridze tezine (2023) dayanıyor. Yumurtlamanın kanıtı yavru bireylerin bulunması.",
              ],
              type: "p",
            },
            {
              parts: [
                "Rus mersini (",
                { name: "Acipenser gueldenstaedtii", type: "sci" },
                "): Rioni’de yumurtluyor; yavrular nehirde ve ağızda bulundu. En bol tür.",
              ],
              type: "p",
            },
            {
              parts: [
                "Uzun burunlu mersin (",
                { name: "Acipenser stellatus", type: "sci" },
                "): Rioni’de yumurtluyor, yavrular bulundu, ama çok daha nadir. Rus mersiniyle doğal melezleri saptandı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Şip mersini (",
                { name: "Acipenser nudiventris", type: "sci" },
                "): Rioni’de yumurtluyor ve yalnızca nehirde bulundu. Kaydedilen balıkların boyu 10 ile 75 cm arasındaydı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Mersin morinası (",
                { name: "Huso huso", type: "sci" },
                "): Gürcistan’ın Karadeniz sularında yaşıyor, ancak yalnızca erişkinler bulundu, yavru kaydı yok. Gürcistan nehirlerinde hâlâ yumurtlayıp yumurtlamadığı bilinmiyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Sibirya mersini (",
                { name: "Acipenser baerii", type: "sci" },
                "): yerli değil. Rioni’de ve Grigoleti’de Karadeniz kıyısında üç birey bulundu.",
              ],
              type: "p",
            },
            {
              parts: [
                "Aynı belirteçlerle ",
                { name: "Acipenser sturio", type: "sci" },
                ", ",
                { name: "Acipenser persicus colchicus", type: "sci" },
                " ve ",
                { name: "Acipenser colchicus", type: "sci" },
                " saptanmadı.",
              ],
              type: "p",
            },
            FIGURE_JUVENILE,
          ],
          heading: "Bugün Gürcistan’da hangi mersin balıkları yaşıyor?",
        },
        {
          blocks: [
            {
              parts: [
                "Şip mersini IUCN Kırmızı Listesi’nde Kritik Tehlike Altında. 20. yüzyılda Aral, Azak ve Karadeniz’den kayboldu, Hazar’da da neredeyse yok oldu. Karadeniz havzasında bölgesel olarak tükenmiş sayılıyordu ve Gürcistan’da otuz yıldır kaydedilmemişti.",
              ],
              type: "p",
            },
            {
              parts: [
                "2020–2022’de Rioni’de 22 şip mersini gözlemi toplandı; bunların 9’u yüzgeç parçalarından alınan genetik örnekti. Dokuzunun da GenBank’taki tüm şip mersini haplotiplerinden farklı tek bir mitokondriyal haplotipi var: Hazar haplotipinden iki, İli Nehri (Balkaş havzası) haplotipinden yedi nükleotit farklı. Örneklerde melezleşme izi yok.",
              ],
              type: "p",
            },
            {
              parts: [
                "Beridze’nin tezine göre Rioni haplotipi bilinen ticari şip mersini haplotiplerinden de farklı; yani balıklar Krasnodar mersin gen havuzu koruma merkezinden ya da çiftliklerden gelmiyor. Diversity’de 2022’de yayımlanan makale onları eski bir Karadeniz popülasyonunun kalıntısı sayıyor. Tez ise Rioni popülasyonunun muhtemelen dünyada hayatta kalan son yabani şip mersini popülasyonu olduğu sonucuna varıyor.",
              ],
              type: "p",
            },
            FIGURE_SHIP_STURGEON,
          ],
          heading: "Şip mersini: “tükenmiş” bir türün yeniden bulunması",
        },
        {
          blocks: [
            {
              parts: [
                "Barajlar. Vartsikhe hidroelektrik kaskadının yapımından sonra (1968–1987) orta Rioni’de yumurtlamaya uygun kesim tahminen 57 km’den 9 km’ye indi; bu, eski uzunluğun yaklaşık %16’sı. Tez kaçak avcılık, çakıl çıkarımı ve kirliliği de baskı olarak sayıyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Melezleşme. 2018–2020’de toplanan 94 örnek arasında dört yavru Rus mersini ile uzun burunlu mersin melezi çıktı: Rioni’de doğal melezleşmenin ilk kanıtı. Bu melez akuakültürde kullanılmıyor ve bölgede uzun burunlu mersin kuluçkahanesi yok, bu yüzden çiftlikten kaçış dışlandı. Yazarlar, düşük yoğunluk nedeniyle uzun burunlu mersinin kendi türünden eş bulmakta zorlandığını öne sürüyor. Tezde bu tür melez altı tane ve hepsinin annesi Rus mersini.",
              ],
              type: "p",
            },
            {
              parts: [
                "Yerli olmayan Sibirya mersini. Üç bireyden (iki yavru ve bir erişkin) erişkin olanı, 90 cm’lik bir erkek, Ağustos 2020’de Samtredia yakınında, olası bir yumurtlama alanının yanında bulundu. Ticari bir tür; akuakültürden kaçmış ya da salınmış olabilir. Tez onu yerli mersinler için olası bir tehdit olarak görüyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "Yasa dışı ticaret. Gürcistan balık pazarları ve çiftliklerinden (2016–2020) alınan örneklerde dört tür saptandı: Rus mersini, uzun burunlu mersin, mersin morinası ve çuka (",
                { name: "Acipenser ruthenus", type: "sci" },
                "). Yaklaşık %92’si Rus mersiniydi. Genetik belirteçler yabani ve çiftlik Rus mersinini ayırdı ve Gürcistan balık pazarlarında, özellikle Batı Gürcistan kıyı pazarlarında, yabani genotipli balık satıldığını gösterdi. Tez bu satışın yasa dışı olduğunu belirtiyor.",
              ],
              type: "p",
            },
          ],
          heading: "Tehditler",
        },
        {
          blocks: [
            {
              parts: [
                "Kategori. Gürcüce duyurular “aghkvetili” sözcüğünü kullanıyor. Parlamentonun İngilizce duyuruları alanı ilk okumada “Rioni Managed Reserve”, üçüncü okumada “Rioni Strict Nature Reserve” olarak anıyor. Bunlar farklı kategoriler. Kesin kategoriyi kanunun matsne.gov.ge’deki resmî metni belirler; bu metni henüz kontrol etmedik.",
              ],
              type: "p",
            },
            {
              parts: [
                "Uygulama. Alanın sahada şimdiden yönetilip korunup korunmadığına ve balıkçılık ile deniz aracı kurallarının ayrıntısına dair bilgimiz yok.",
              ],
              type: "p",
            },
            {
              parts: [
                "Bilim. Burada kullanılan kaynaklarda Rioni’deki mersin sayısına dair bir tahmin yok. Mersin morinasının Gürcistan’da yumurtlayıp yumurtlamadığı bilinmiyor. Kaybedilen kesime dair tahminler farklı: tez yaklaşık 90 km’den 9 km’ye bir azalmayı da aktarıyor. “Son yabani popülasyon” yazarların temkinli sonucu; Kazakistan’daki İli Nehri’nde Aral kökenli, oraya aktarılmış bir popülasyon yaşıyor. Pazar çalışması, tez sunulduğunda hazırlık aşamasında bir el yazmasıydı.",
              ],
              type: "p",
            },
            {
              parts: [
                "Mersin balıkları bu atlas’ta yok. Diğer kayıtlar için ",
                { label: "haberler", type: "news-index" },
                " sayfasına bakın.",
              ],
              type: "p",
            },
          ],
          heading: "Neler belirsiz?",
        },
      ],
      title: "Parlamento mersin balıkları için Rioni’de 554 hektarı onayladı",
    },
  },
  gallery: [PHOTO_SHIP_STURGEON, PHOTO_JUVENILE],
  id: "rioni-strict-nature-reserve-sturgeon-2026",
  image: PHOTO_SPAWNING_GROUND,
  publishedAt: "2026-10-14",
  relatedHubIds: [],
  relatedRegionIds: [],
  relatedSpeciesIds: [],
  slug: "rioni-strict-nature-reserve-sturgeon-2026",
  sources: [
    {
      name: {
        en: "Parliament of Georgia — Third reading, 28 May 2026",
        ka: "საქართველოს პარლამენტი — მესამე მოსმენა, 28 მაისი 2026",
        ru: "Парламент Грузии — третье чтение, 28 мая 2026",
        tr: "Gürcistan Parlamentosu — Üçüncü okuma, 28 Mayıs 2026",
      },
      url: PARLIAMENT_THIRD,
    },
    {
      name: {
        en: "Parliament of Georgia — First reading, 27 May 2026",
        ka: "საქართველოს პარლამენტი — პირველი მოსმენა, 27 მაისი 2026",
        ru: "Парламент Грузии — первое чтение, 27 мая 2026",
        tr: "Gürcistan Parlamentosu — İlk okuma, 27 Mayıs 2026",
      },
      url: PARLIAMENT_FIRST,
    },
    {
      name: {
        en: "Tamar Beridze — Doctoral thesis, Ilia State University (2023)",
        ka: "თამარ ბერიძე — სადოქტორო ნაშრომი, ილიას სახელმწიფო უნივერსიტეტი (2023)",
        ru: "Тамар Беридзе — докторская диссертация, Государственный университет Ильи (2023)",
        tr: "Tamar Beridze — Doktora tezi, İlia Devlet Üniversitesi (2023)",
      },
      url: BERIDZE_THESIS,
    },
    {
      name: "Beridze et al. 2022 — Diversity 14: 1102",
      url: DIVERSITY_2022,
    },
    {
      name: "Beridze et al. 2022 — Conservation Genetics 23: 211–216",
      url: CONSERVATION_GENETICS_2022,
    },
    {
      name: "Fauna & Flora — Saving the last sturgeon",
      url: FAUNA_FLORA,
    },
    {
      name: "Georgia Today — 29 May 2026",
      url: GEORGIA_TODAY,
    },
  ],
  status: "published",
};
