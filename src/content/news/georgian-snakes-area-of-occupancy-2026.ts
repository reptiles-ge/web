import type { NewsArticle } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.1002/ece3.74292";
const PUBMED_URL = "https://pubmed.ncbi.nlm.nih.gov/42694863/";

export const GEORGIAN_SNAKES_AREA_OF_OCCUPANCY_2026: NewsArticle = {
  copy: {
    en: {
      dek: "A new Ecology and Evolution study shows how incomplete records can change estimates of the Area of Occupancy for snakes in Georgia.",
      lead: "If a snake has not yet been recorded from a place, that does not automatically mean it is absent there. A 2026 study by Giorgi Iankoshvili and David Tarkhnishvili uses records of 13 Georgian snakes to show how incomplete occurrence data can reshape the picture of distribution.",
      metaDescription:
        "A new study of 13 Georgian snakes shows how scientists estimate Area of Occupancy when occurrence records are incomplete.",
      metaTitle:
        "Georgian snake distribution: what a new study shows",
      sections: [
        {
          blocks: [
            {
              parts: [
                "The paper, published on 3 September 2026 in ",
                { name: "Ecology and Evolution", type: "sci" },
                ", asks a simple but difficult question: how accurately do we know where Georgian snakes occur when records are incomplete and unevenly collected?",
              ],
              type: "p",
            },
            {
              parts: [
                "The authors do not claim that existing snake maps are wrong, and they do not replace the IUCN's standard 2 x 2 km Area of Occupancy grid. Their aim is to show how an additional reproducible modelling workflow can help where confirmed records do not fully describe the real occupied area.",
              ],
              type: "p",
            },
          ],
          heading: "When records are not the whole map",
        },
        {
          blocks: [
            {
              parts: [
                "The study is based on occurrence records for 13 colubrid snakes in Georgia. The authors used older bibliographic sources, modern field records, and citizen-science data. Since 2017 they also monitored Facebook, Instagram, iNaturalist, and Twitter, contacting observers when social-media photographs needed more precise locality information.",
              ],
              type: "p",
            },
            {
              parts: [
                "The analysed species include ",
                { id: "dolichophis-schmidti", label: "red-bellied racer", type: "species" },
                ", ",
                { id: "natrix-tessellata", label: "dice snake", type: "species" },
                ", ",
                { id: "coronella-austriaca", label: "smooth snake", type: "species" },
                ", ",
                { id: "natrix-natrix", label: "grass snake", type: "species" },
                ", ",
                { id: "platyceps-najadum", label: "Dahl's whip snake", type: "species" },
                ", ",
                { id: "telescopus-fallax", label: "European cat snake", type: "species" },
                ", and seven other colubrid species recorded from Georgia.",
              ],
              type: "p",
            },
          ],
          heading: "What the scientists studied",
        },
        {
          blocks: [
            {
              parts: [
                "An occurrence record is a confirmed observation: a place where a species was seen, photographed, collected, or reported in a reliable source. Area of Occupancy, or AOO, is different. In official IUCN Red List assessments it is usually counted with 2 x 2 km cells: if a species is confirmed in a cell, that cell is treated as occupied.",
              ],
              type: "p",
            },
            {
              parts: [
                "Incomplete records are a problem for small, hidden, or rarely observed animals. A species may occupy a broader area than the points currently documented. At the same time, a model does not create a new confirmed record. Confirmed observations and modelled estimates need to remain separate.",
              ],
              type: "p",
            },
          ],
          heading: "What AOO means",
        },
        {
          blocks: [
            {
              parts: [
                "The authors placed records into grids ranging from 1 x 1 km to 25 x 25 km and observed how the number of occupied cells changed as the grid size increased. The point where the curve became less sensitive to cell size is called a breakpoint-derived grid-cell size in the paper.",
              ],
              type: "p",
            },
            {
              parts: [
                "For 9 of the 13 species, significant breakpoints appeared at about 4-13 km. This is not a snake movement radius and not a new distribution confirmation. It is an informative spatial scale in the data, useful for thinking about sampling incompleteness.",
              ],
              type: "p",
            },
            {
              parts: [
                "In validation tests on the six best-represented species, accumulation-curve predictions were closer to the full dataset than raw incomplete occupied-cell counts in 97.3%, 97.8%, and 96.3% of comparisons when 25%, 50%, or 75% of the records were retained.",
              ],
              type: "p",
            },
          ],
          heading: "What the breakpoint test showed",
        },
        {
          blocks: [
            {
              parts: [
                "For biodiversity atlases, the lesson is practical: one level is a specific photo record, another is reliable evidence of presence in a region, and a third is a possible or modelled range. ",
                { id: "snakes", label: "Snake pages", type: "hub" },
                " should not mix those levels.",
              ],
              type: "p",
            },
            {
              parts: [
                "Citizen science is central to this picture. A photo with a precise place, date, and verified identification can add knowledge even for species that professional herpetologists rarely encounter. The paper's quiet message is that distribution maps should show what we know, what we do not know, and what uncertainty sits between the records.",
              ],
              type: "p",
            },
          ],
          heading: "Why this matters for Georgia",
        },
        {
          blocks: [
            {
              parts: [
                {
                  href: PAPER_URL,
                  label:
                    "Estimating Area of Occupancy From Incomplete Occurrence Records: Reproducible Workflow Illustrated on a Comprehensive Dataset of Georgian Snakes",
                  type: "external",
                },
                ". Giorgi Iankoshvili and David Tarkhnishvili. ",
                { name: "Ecology and Evolution", type: "sci" },
                ", first published 3 September 2026. DOI: 10.1002/ece3.74292.",
              ],
              type: "p",
            },
            {
              parts: [
                {
                  href: PUBMED_URL,
                  label: "PubMed record",
                  type: "external",
                },
                " for the same article.",
              ],
              type: "p",
            },
          ],
          heading: "Sources",
        },
      ],
      title:
        "New study: how accurately do we know where Georgia's snakes occur?",
    },
    ka: {
      dek: "Ecology and Evolution-ში გამოქვეყნებული ახალი კვლევა აჩვენებს, როგორ შეიძლება არასრულმა ჩანაწერებმა საქართველოს გველების Area of Occupancy-ის შეფასება შეცვალოს.",
      lead: "თუ გველი კონკრეტულ ადგილზე ჯერ არავის დაუფიქსირებია, ეს ავტომატურად არ ნიშნავს, რომ იქ ის არ გვხვდება. გიორგი იანკოშვილისა და დავით თარხნიშვილის 2026 წლის კვლევა საქართველოს 13 გველის ჩანაწერებს იყენებს, რათა აჩვენოს, როგორ შეიძლება არასრული occurrence records გავრცელების სურათს ცვლიდეს.",
      metaDescription:
        "ახალი კვლევა საქართველოს 13 გველის ჩანაწერებით აჩვენებს, როგორ აფასებენ მეცნიერები Area of Occupancy-ს არასრული მონაცემების პირობებში.",
      metaTitle:
        "საქართველოს გველების გავრცელება: რას აჩვენებს ახალი კვლევა",
      sections: [
        {
          blocks: [
            {
              parts: [
                "წარმოიდგინეთ, საქართველოს რომელიმე რეგიონში გველის მხოლოდ სამი დადასტურებული დაკვირვება გვაქვს. ნიშნავს ეს, რომ სახეობა მხოლოდ იმ სამ წერტილში ცხოვრობს? არა აუცილებლად. შეიძლება ის სხვა ადგილებშიც იყოს, მაგრამ იქ არავის უნახავს, არ გადაუღია, ან ჩანაწერი სამეცნიერო მონაცემთა ბაზამდე არ მისულა.",
              ],
              type: "p",
            },
            {
              parts: [
                "სწორედ ამ განსხვავებას ეხება 2026 წლის 3 სექტემბერს ჟურნალ ",
                { name: "Ecology and Evolution", type: "sci" },
                "-ში გამოქვეყნებული ნაშრომი. გიორგი იანკოშვილი და დავით თარხნიშვილი ",
                { id: "snakes", label: "საქართველოს გველების", type: "hub" },
                " მონაცემებით კითხულობენ მარტივ, მაგრამ რთულად გასაზომ კითხვას: რამდენად ზუსტად ვიცით, სად არიან გავრცელებული საქართველოს გველები, თუ ჩვენი ჩანაწერები არასრული და არათანაბრად შეგროვებულია?",
              ],
              type: "p",
            },
            {
              parts: [
                "კვლევა არ ამბობს, რომ საქართველოს გველების რუკები არასწორია. არც იმას ამტკიცებს, რომ IUCN-ის სტანდარტული 2 x 2 კმ ბადე უნდა შეიცვალოს. ავტორების მიზანი უფრო ფრთხილია: აჩვენონ, როგორ შეიძლება დამატებითმა, გამეორებადმა მოდელურმა მიდგომამ მკვლევრებს დაეხმაროს იქ, სადაც დადასტურებული ჩანაწერები სახეობის რეალურ დაკავებულ ტერიტორიას სრულად ვერ აღწერს.",
              ],
              type: "p",
            },
          ],
          heading: "როცა ჩანაწერი რუკას არ უდრის",
        },
        {
          blocks: [
            {
              parts: [
                "ნაშრომი ეფუძნება საქართველოში დაფიქსირებული 13 კოლუბრიდი გველის occurrence records-ს. ავტორებმა გამოიყენეს როგორც ძველი ბიბლიოგრაფიული წყაროები, ისე თანამედროვე საველე და citizen-science მონაცემები. 2017 წლიდან ისინი აკვირდებოდნენ Facebook-ს, Instagram-ს, iNaturalist-სა და Twitter-ს; სოციალურ ქსელებში ნაპოვნი ფოტო ჩანაწერებისთვის კი ავტორები დამკვირვებლებს უკავშირდებოდნენ, რათა ადგილი საკმარისი სიზუსტით დაეზუსტებინათ.",
              ],
              type: "p",
            },
            {
              parts: [
                "გაანალიზებული სახეობებია: ",
                {
                  id: "dolichophis-schmidti",
                  label: "წითელმუცელა მცურავი",
                  type: "species",
                },
                " (",
                { name: "Dolichophis schmidti", type: "sci" },
                "), ",
                {
                  id: "natrix-tessellata",
                  label: "წყლის ანკარა",
                  type: "species",
                },
                " (",
                { name: "Natrix tessellata", type: "sci" },
                "), ",
                {
                  id: "coronella-austriaca",
                  label: "სპილენძა",
                  type: "species",
                },
                " (",
                { name: "Coronella austriaca", type: "sci" },
                "), ",
                {
                  id: "natrix-natrix",
                  label: "ჩვეულებრივი ანკარა",
                  type: "species",
                },
                " (",
                { name: "Natrix natrix", type: "sci" },
                "), ",
                {
                  id: "platyceps-najadum",
                  label: "წენგოსფერი მცურავი",
                  type: "species",
                },
                " (",
                { name: "Platyceps najadum", type: "sci" },
                "), ",
                {
                  id: "telescopus-fallax",
                  label: "კატისთვალა",
                  type: "species",
                },
                " (",
                { name: "Telescopus fallax", type: "sci" },
                "), ",
                {
                  id: "zamenis-hohenackeri",
                  label: "ამიერკავკასიური მცურავი",
                  type: "species",
                },
                " (",
                { name: "Zamenis hohenackeri", type: "sci" },
                "), ",
                {
                  id: "eirenis-modestus",
                  label: "წყნარი ეირენისი",
                  type: "species",
                },
                " (",
                { name: "Eirenis modestus", type: "sci" },
                "), ",
                {
                  id: "elaphe-urartica",
                  label: "ურარტუს მცურავი",
                  type: "species",
                },
                " (",
                { name: "Elaphe urartica", type: "sci" },
                "), ",
                {
                  id: "zamenis-longissimus",
                  label: "ესკულაპის მცურავი",
                  type: "species",
                },
                " (",
                { name: "Zamenis longissimus", type: "sci" },
                "), ",
                {
                  id: "hemorrhois-ravergieri",
                  label: "ნაირფერი მცურავი",
                  type: "species",
                },
                " (",
                { name: "Hemorrhois ravergieri", type: "sci" },
                "), ",
                {
                  id: "eirenis-collaris",
                  label: "საყელოიანი ეირენისი",
                  type: "species",
                },
                " (",
                { name: "Eirenis collaris", type: "sci" },
                ") და ",
                {
                  id: "elaphe-dione",
                  label: "სახეებიანი მცურავი",
                  type: "species",
                },
                " (",
                { name: "Elaphe dione", type: "sci" },
                ").",
              ],
              type: "p",
            },
            {
              parts: [
                "ყველაზე კარგად წარმოდგენილი ექვსი სახეობა იყო ",
                {
                  id: "dolichophis-schmidti",
                  label: "წითელმუცელა მცურავი",
                  type: "species",
                },
                " (",
                { name: "Dolichophis schmidti", type: "sci" },
                ")",
                ", ",
                {
                  id: "natrix-tessellata",
                  label: "წყლის ანკარა",
                  type: "species",
                },
                " (",
                { name: "Natrix tessellata", type: "sci" },
                ")",
                ", ",
                {
                  id: "coronella-austriaca",
                  label: "სპილენძა",
                  type: "species",
                },
                " (",
                { name: "Coronella austriaca", type: "sci" },
                ")",
                ", ",
                {
                  id: "natrix-natrix",
                  label: "ჩვეულებრივი ანკარა",
                  type: "species",
                },
                " (",
                { name: "Natrix natrix", type: "sci" },
                ")",
                ", ",
                {
                  id: "platyceps-najadum",
                  label: "წენგოსფერი მცურავი",
                  type: "species",
                },
                " (",
                { name: "Platyceps najadum", type: "sci" },
                ")",
                " და ",
                {
                  id: "telescopus-fallax",
                  label: "კატისთვალა",
                  type: "species",
                },
                " (",
                { name: "Telescopus fallax", type: "sci" },
                ")",
                ". სწორედ ამ ექვს სახეობაზე შეამოწმეს ავტორებმა, რამდენად კარგად მუშაობდა მათი მიდგომა, როცა მონაცემების ნაწილი ხელოვნურად ამოიღეს.",
              ],
              type: "p",
            },
          ],
          heading: "რა შეისწავლეს მეცნიერებმა",
        },
        {
          blocks: [
            {
              parts: [
                "Occurrence record არის კონკრეტული დადასტურებული დაკვირვება: ადგილი, სადაც სახეობა ნახეს, გადაიღეს, შეაგროვეს ან წყაროში ჩაიწერა. ასეთი ჩანაწერი ძალიან მნიშვნელოვანია, მაგრამ ის მხოლოდ წერტილია.",
              ],
              type: "p",
            },
            {
              parts: [
                "Area of Occupancy, ანუ AOO, სხვა რამეა. ეს არის შეფასება, რამდენ ტერიტორიას იკავებს სახეობა გარკვეული მეთოდოლოგიით. IUCN-ის ოფიციალურ Red List შეფასებებში AOO სტანდარტულად 2 x 2 კმ უჯრედებით ითვლება: თუ სახეობა რომელიმე უჯრედში დადასტურებულია, ეს უჯრედი occupied cell ხდება.",
              ],
              type: "p",
            },
            {
              parts: [
                "გავრცელების არეალი კიდევ უფრო ფართო ცნებაა. ის არ უდრის რუკაზე რამდენიმე წერტილის შეერთებას. სახეობის range-ს განსაზღვრავს გარემო, ისტორიული მონაცემები, სივრცითი კავშირი და ისიც, რამდენად კარგად არის შესწავლილი კონკრეტული ტერიტორია. ამიტომ ერთი ცარიელი ადგილი რუკაზე ყოველთვის ნამდვილ არარსებობას არ ნიშნავს.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს AOO",
        },
        {
          blocks: [
            {
              parts: [
                "არასრული ჩანაწერები განსაკუთრებით პრობლემურია მცირე, დამალული ან იშვიათად დანახული ცხოველებისთვის. თუ სახეობა რეალურად ათეულობით კილომეტრზეა გავრცელებული, მაგრამ მკვლევრებს მხოლოდ რამდენიმე ლოკაციიდან აქვთ მონაცემი, მხოლოდ ამ წერტილების დათვლა დაკავებულ ტერიტორიას შეიძლება ძალიან ამცირებდეს.",
              ],
              type: "p",
            },
            {
              parts: [
                "ამავე დროს, მოდელი ახალ დადასტურებულ ჩანაწერს არ ქმნის. თუ რუკაზე მოდელი ვარაუდობს, რომ დაკავებული ტერიტორია შეიძლება უფრო დიდი იყოს, ეს არ ნიშნავს, რომ იქ ახალი ინდივიდი უკვე დადასტურებულია. დადასტურებული დაკვირვება და მოდელური შეფასება ცალ-ცალკე უნდა დარჩეს.",
              ],
              type: "p",
            },
            {
              parts: [
                "Reptiles.ge-ის მსგავსი biodiversity atlas-ებისთვის ეს განსხვავება პრაქტიკულია: ერთი რამ არის კონკრეტული ფოტოჩანაწერი, მეორე - რეგიონში არსებობის სანდო მტკიცებულება, და მესამე - გავრცელების სავარაუდო ან მოდელირებული არეალი. ",
                { id: "snakes", label: "გველების ჰაბი", type: "hub" },
                " და ",
                { label: "სიახლეები", type: "news-index" },
                " ამ სამ დონეს ერთმანეთში არ უნდა ურევდეს.",
              ],
              type: "p",
            },
          ],
          heading: "რატომ ამახინჯებს არასრული მონაცემი სურათს",
        },
        {
          blocks: [
            {
              parts: [
                "ავტორებმა ჩანაწერები სხვადასხვა ზომის ბადეებში ჩასვეს: 1 x 1 კმ-დან 25 x 25 კმ-მდე. შემდეგ დააკვირდნენ, როგორ იცვლებოდა დაკავებული უჯრედების რაოდენობა, როცა ბადის უჯრედი დიდდებოდა. იდეა ის იყო, რომ გარკვეულ მასშტაბზე მრუდი ნაკლებად მგრძნობიარე ხდება უჯრედის ზომის ცვლილების მიმართ.",
              ],
              type: "p",
            },
            {
              parts: [
                "ამ მასშტაბს ნაშრომში breakpoint-derived grid-cell size ეწოდება. მნიშვნელოვანია: ეს არ არის გველის გადაადგილების რადიუსი, არც სახეობის ბიოლოგიური საზღვარი. ეს არის ინფორმაციული სივრცითი მასშტაბი, სადაც ამ კონკრეტულ მონაცემებში დაკავებული უჯრედების რაოდენობა შედარებით სტაბილურ ქცევას აჩვენებს.",
              ],
              type: "p",
            },
            {
              parts: [
                "აბსტრაქტისა და განხილვის მიხედვით, 13 სახეობიდან 9-ში მნიშვნელოვანი breakpoint დაახლოებით 4-13 კმ დიაპაზონში გამოჩნდა. ეს არ ნიშნავს, რომ 2 კმ ბადე მცდარია. ნაშრომი ამბობს, რომ არასრული მონაცემების პირობებში 2 კმ-იანი დათვლა შეიძლება ძალიან კონსერვატიული იყოს, ხოლო დამატებითი მოდელური ხედვა sampling incompleteness-ის შეფასებაში დაგვეხმაროს.",
              ],
              type: "p",
            },
          ],
          heading: "რა არის spatial breakpoint",
        },
        {
          blocks: [
            {
              parts: [
                "კვლევის ყველაზე ძლიერი ტესტი ხელოვნური შემცირება იყო. ავტორებმა ექვსი ყველაზე კარგად წარმოდგენილი სახეობისთვის მონაცემების მხოლოდ 25%, 50% ან 75% დატოვეს, შემდეგ კი შეამოწმეს, რამდენად ახლოს მივიდოდა მოდელი სრული მონაცემებით ცნობილ დაკავებული უჯრედების რაოდენობასთან.",
              ],
              type: "p",
            },
            {
              parts: [
                "შედეგი ასე უნდა წავიკითხოთ: როცა მონაცემების 25% იყო დატოვებული, მოდელური პროგნოზი raw incomplete count-ზე უკეთესი იყო შედარებების 97.3%-ში; 50%-ზე - 97.8%-ში; 75%-ზე - 96.3%-ში. ეს არ არის განცხადება, რომ 96-98%-იანი სიზუსტით ვიცით, სად ცხოვრობენ გველები. ეს არის კონკრეტული validation შედეგი: შემცირებულ dataset-ზე აგებული accumulation-curve პროგნოზი უფრო ახლოს აღმოჩნდა სრულ dataset-თან, ვიდრე უბრალოდ დარჩენილი occupied cells-ის დათვლა.",
              ],
              type: "p",
            },
            {
              parts: [
                "ავტორებმა ასევე შეამოწმეს, რამდენად მოქმედებდა ჩანაწერების ისტორიული თანმიმდევრობა შედეგზე. ეს აუცილებელი იყო, რადგან ძველი პროფესიული ჩანაწერები ხშირად რამდენიმე კარგად ნასწავლ ადგილზე იყრიდა თავს, ხოლო ბოლო წლებში სოციალურ ქსელებსა და citizen-science პლატფორმებზე გამოქვეყნებულმა ფოტოებმა გეოგრაფიული დაფარვა გააფართოვა.",
              ],
              type: "p",
            },
          ],
          heading: "რა აჩვენა მონაცემების შემცირების ტესტმა",
        },
        {
          blocks: [
            {
              parts: [
                {
                  id: "snakes",
                  label: "საქართველოს გველების გავრცელების",
                  type: "hub",
                },
                " უკეთ გაგება მხოლოდ ახალი რუკის დახატვა არ არის. ეს არის ცოდნის ხარისხის შეფასება: სად გვაქვს ძლიერი მტკიცებულება, სად გვაქვს ბევრი ჩანაწერი, და სად გვჭირდება მეტი დაკვირვება.",
              ],
              type: "p",
            },
            {
              parts: [
                "Citizen science ამ სურათში ცენტრალურ როლს თამაშობს. ფოტო, ზუსტი ადგილი, თარიღი და სწორად გადამოწმებული იდენტიფიკაცია შეიძლება იმ სახეობაზეც დაემატოს ცოდნას, რომელსაც პროფესიონალი ჰერპეტოლოგები იშვიათად ხვდებიან. მაგრამ ასეთი ჩანაწერი კვლევისთვის ფასეული ხდება მაშინ, როცა ის სანდოდ არის დოკუმენტირებული და ბიოლოგიურ დასკვნად ნაადრევად არ გადაიქცევა.",
              ],
              type: "p",
            },
            {
              parts: [
                "ნაშრომის მთავარი გაკვეთილი მშვიდია: გველების გავრცელების რუკა მხოლოდ ცნობილი წერტილების კოლექცია არ არის. ის უნდა გვაჩვენებდეს, რა ვიცით, რა არ ვიცით და რა ტიპის გაურკვევლობა დგას მონაცემებს შორის. სწორედ ამ ზღვრის დანახვაა მნიშვნელოვანი როგორც სამეცნიერო კვლევისთვის, ისე ბუნების დაცვის გადაწყვეტილებებისთვის.",
              ],
              type: "p",
            },
          ],
          heading: "რას ნიშნავს ეს საქართველოს ბიომრავალფეროვნებისთვის",
        },
        {
          blocks: [
            {
              parts: [
                "კვლევა ეფუძნება საქართველოს 13 კოლუბრიდი გველის occurrence records-ს და სწავლობს, როგორ მოქმედებს არასრული sampling AOO-ის შეფასებაზე.",
              ],
              type: "p",
            },
            {
              parts: [
                "ავტორების მიდგომა IUCN-ის ოფიციალური 2 x 2 კმ AOO სტანდარტის შემცვლელი არ არის. ის დამატებითი ინსტრუმენტია sampling incompleteness-ისა და scale dependence-ის შესაფასებლად.",
              ],
              type: "p",
            },
            {
              parts: [
                "ექვს კარგად წარმოდგენილ სახეობაზე, ხელოვნურად შემცირებულ dataset-ებში, accumulation-curve პროგნოზები raw occupied-cell counts-ზე უკეთესი იყო 97.3%, 97.8% და 96.3% შედარებებში.",
              ],
              type: "p",
            },
            {
              parts: [
                "13-დან 9 სახეობისთვის მნიშვნელოვანი breakpoint დაახლოებით 4-13 კმ დიაპაზონში გამოვლინდა, მაგრამ ეს არ არის გველების გადაადგილების რადიუსი ან ახალი გავრცელების დადასტურება.",
              ],
              type: "p",
            },
            {
              parts: [
                "სოციალური ქსელები, iNaturalist და ფოტოდოკუმენტირებული citizen-science ჩანაწერები კვლევაში მნიშვნელოვანი წყაროა, მაგრამ მოდელი დადასტურებულ დაკვირვებას არ ცვლის.",
              ],
              type: "p",
            },
          ],
          heading: "ძირითადი დასკვნები",
        },
        {
          blocks: [
            {
              parts: [
                {
                  href: PAPER_URL,
                  label:
                    "Estimating Area of Occupancy From Incomplete Occurrence Records: Reproducible Workflow Illustrated on a Comprehensive Dataset of Georgian Snakes",
                  type: "external",
                },
                ". Giorgi Iankoshvili and David Tarkhnishvili. ",
                { name: "Ecology and Evolution", type: "sci" },
                ", first published 3 September 2026. DOI: 10.1002/ece3.74292.",
              ],
              type: "p",
            },
            {
              parts: [
                {
                  href: PUBMED_URL,
                  label: "PubMed record",
                  type: "external",
                },
                " for the same article.",
              ],
              type: "p",
            },
          ],
          heading: "წყაროები",
        },
      ],
      title:
        "ახალი კვლევა: რამდენად ზუსტად ვიცით, სად არიან საქართველოს გველები?",
    },
    ru: {
      dek: "Новое исследование в Ecology and Evolution показывает, как неполные записи могут менять оценку Area of Occupancy для змей Грузии.",
      lead: "Если змея пока не зарегистрирована в каком-то месте, это не означает автоматически, что ее там нет. Исследование Георгия Янкошвили и Давида Тархнишвили 2026 года использует записи 13 змей Грузии, чтобы показать, как неполные occurrence records меняют картину распространения.",
      metaDescription:
        "Новое исследование по 13 змеям Грузии показывает, как ученые оценивают Area of Occupancy при неполных данных.",
      metaTitle:
        "Распространение змей Грузии: что показывает новое исследование",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Работа, опубликованная 3 сентября 2026 года в ",
                { name: "Ecology and Evolution", type: "sci" },
                ", задает простой, но трудный для измерения вопрос: насколько точно мы знаем, где распространены змеи Грузии, если данные неполны и собраны неравномерно?",
              ],
              type: "p",
            },
            {
              parts: [
                "Авторы не утверждают, что существующие карты змей неверны, и не заменяют стандартную сетку IUCN 2 x 2 км для Area of Occupancy. Их цель осторожнее: показать, как дополнительный воспроизводимый модельный подход может помочь там, где подтвержденные записи не полностью описывают реально занятую территорию.",
              ],
              type: "p",
            },
          ],
          heading: "Когда запись не равна всей карте",
        },
        {
          blocks: [
            {
              parts: [
                "Исследование основано на occurrence records 13 колубридных змей Грузии. Авторы использовали старые библиографические источники, современные полевые данные и citizen-science записи. С 2017 года они также отслеживали Facebook, Instagram, iNaturalist и Twitter, связываясь с наблюдателями, когда фотографиям из соцсетей требовалось уточнение местности.",
              ],
              type: "p",
            },
            {
              parts: [
                "Среди проанализированных видов: ",
                { id: "dolichophis-schmidti", label: "краснобрюхий полоз", type: "species" },
                ", ",
                { id: "natrix-tessellata", label: "водяной уж", type: "species" },
                ", ",
                { id: "coronella-austriaca", label: "медянка", type: "species" },
                ", ",
                { id: "natrix-natrix", label: "обыкновенный уж", type: "species" },
                ", ",
                { id: "platyceps-najadum", label: "тонкий полоз", type: "species" },
                ", ",
                { id: "telescopus-fallax", label: "кошачья змея", type: "species" },
                " и еще семь колубридных видов, зарегистрированных в Грузии.",
              ],
              type: "p",
            },
          ],
          heading: "Что изучали ученые",
        },
        {
          blocks: [
            {
              parts: [
                "Occurrence record - это конкретное подтвержденное наблюдение: место, где вид увидели, сфотографировали, собрали или надежно указали в источнике. Area of Occupancy, или AOO, - другое понятие. В официальных оценках IUCN оно обычно считается по ячейкам 2 x 2 км: если вид подтвержден в ячейке, ячейка считается занятой.",
              ],
              type: "p",
            },
            {
              parts: [
                "Неполные записи особенно проблемны для мелких, скрытных или редко наблюдаемых животных. Вид может занимать больше территории, чем показывают известные точки. При этом модель не создает новую подтвержденную запись: подтвержденные наблюдения и модельные оценки должны оставаться разными уровнями данных.",
              ],
              type: "p",
            },
          ],
          heading: "Что означает AOO",
        },
        {
          blocks: [
            {
              parts: [
                "Авторы помещали записи в сетки от 1 x 1 км до 25 x 25 км и смотрели, как меняется число занятых ячеек при увеличении размера ячейки. Масштаб, где кривая становится менее чувствительной к размеру ячейки, в статье называется breakpoint-derived grid-cell size.",
              ],
              type: "p",
            },
            {
              parts: [
                "У 9 из 13 видов значимые breakpoints появились примерно в диапазоне 4-13 км. Это не радиус перемещения змеи и не новое подтверждение распространения, а информативный пространственный масштаб в этих данных.",
              ],
              type: "p",
            },
            {
              parts: [
                "В проверке на шести наиболее полно представленных видах прогнозы accumulation-curve были ближе к полному набору данных, чем простое число оставшихся занятых ячеек: в 97.3%, 97.8% и 96.3% сравнений при сохранении 25%, 50% или 75% записей.",
              ],
              type: "p",
            },
          ],
          heading: "Что показал breakpoint-тест",
        },
        {
          blocks: [
            {
              parts: [
                "Для атласов биоразнообразия вывод практический: одно дело - конкретная фотозапись, другое - надежное доказательство присутствия в регионе, третье - предполагаемый или смоделированный ареал. ",
                { id: "snakes", label: "Страницы о змеях", type: "hub" },
                " не должны смешивать эти уровни.",
              ],
              type: "p",
            },
            {
              parts: [
                "Citizen science играет здесь центральную роль. Фото с точным местом, датой и проверенной идентификацией может добавить знания даже о видах, с которыми профессиональные герпетологи встречаются редко. Главный урок статьи: карты распространения должны показывать, что мы знаем, чего не знаем и какая неопределенность стоит между точками.",
              ],
              type: "p",
            },
          ],
          heading: "Почему это важно для Грузии",
        },
        {
          blocks: [
            {
              parts: [
                {
                  href: PAPER_URL,
                  label:
                    "Estimating Area of Occupancy From Incomplete Occurrence Records: Reproducible Workflow Illustrated on a Comprehensive Dataset of Georgian Snakes",
                  type: "external",
                },
                ". Giorgi Iankoshvili and David Tarkhnishvili. ",
                { name: "Ecology and Evolution", type: "sci" },
                ", first published 3 September 2026. DOI: 10.1002/ece3.74292.",
              ],
              type: "p",
            },
            {
              parts: [
                {
                  href: PUBMED_URL,
                  label: "запись PubMed",
                  type: "external",
                },
                " той же статьи.",
              ],
              type: "p",
            },
          ],
          heading: "Источники",
        },
      ],
      title:
        "Новое исследование: насколько точно мы знаем, где живут змеи Грузии?",
    },
    tr: {
      dek: "Ecology and Evolution'da yayimlanan yeni bir calisma, eksik kayitlarin Gurcistan yilanlari icin Area of Occupancy tahminlerini nasil degistirebilecegini gosteriyor.",
      lead: "Bir yilan belirli bir yerde henuz kaydedilmediyse, bu onun orada bulunmadigi anlamina otomatik olarak gelmez. Giorgi Iankoshvili ve David Tarkhnishvili'nin 2026 calismasi, eksik occurrence kayitlarinin dagilis resmini nasil degistirebildigini gostermek icin Gurcistan'daki 13 yilan turunun kayitlarini kullaniyor.",
      metaDescription:
        "Gurcistan'daki 13 yilan turu uzerine yeni calisma, occurrence kayitlari eksik oldugunda Area of Occupancy'nin nasil tahmin edildigini gosteriyor.",
      metaTitle:
        "Gurcistan yilanlarinin dagilisi: yeni calisma ne gosteriyor",
      sections: [
        {
          blocks: [
            {
              parts: [
                "3 Eylul 2026'da ",
                { name: "Ecology and Evolution", type: "sci" },
                " dergisinde yayimlanan makale basit ama olculmesi zor bir soru soruyor: kayitlar eksik ve duzensiz toplanmisken Gurcistan yilanlarinin nerelerde bulundugunu ne kadar dogru biliyoruz?",
              ],
              type: "p",
            },
            {
              parts: [
                "Yazarlar mevcut yilan haritalarinin yanlis oldugunu soylemiyor ve IUCN'in standart 2 x 2 km Area of Occupancy izgara yaklasimini degistirmiyor. Amaclari, dogrulanmis kayitlar gercek isgal edilen alani tam anlatmadiginda ek ve tekrarlanabilir bir modelleme yaklasiminin nasil yardim edebilecegini gostermek.",
              ],
              type: "p",
            },
          ],
          heading: "Kayit haritanin tamami degildir",
        },
        {
          blocks: [
            {
              parts: [
                "Calisma Gurcistan'da kaydedilen 13 kolubrid yilanin occurrence kayitlarina dayaniyor. Yazarlar eski bibliyografik kaynaklari, modern arazi kayitlarini ve citizen-science verilerini kullandi. 2017'den beri Facebook, Instagram, iNaturalist ve Twitter'i da izlediler; sosyal medyadaki fotograf kayitlari icin konumu netlestirmek gerektiginde gozlemcilerle iletisime gectiler.",
              ],
              type: "p",
            },
            {
              parts: [
                "Incelenen turler arasinda ",
                { id: "dolichophis-schmidti", label: "kirmizi karinli kosucu yilan", type: "species" },
                ", ",
                { id: "natrix-tessellata", label: "su yilanı", type: "species" },
                ", ",
                { id: "coronella-austriaca", label: "bakir yilan", type: "species" },
                ", ",
                { id: "natrix-natrix", label: "kupu yilan", type: "species" },
                ", ",
                { id: "platyceps-najadum", label: "Dahl kamci yilani", type: "species" },
                ", ",
                { id: "telescopus-fallax", label: "kedi gozlu yilan", type: "species" },
                " ve Gurcistan'dan bilinen yedi baska kolubrid tur var.",
              ],
              type: "p",
            },
          ],
          heading: "Bilim insanlari neyi inceledi",
        },
        {
          blocks: [
            {
              parts: [
                "Occurrence record belirli bir dogrulanmis gozlemdir: turun goruldugu, fotograflandigi, toplandigi veya guvenilir bir kaynakta kaydedildigi yer. Area of Occupancy, yani AOO, farkli bir kavramdir. Resmi IUCN Red List degerlendirmelerinde genellikle 2 x 2 km hucrelerle hesaplanir: tur bir hucrede dogrulanmissa hucre occupied kabul edilir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Eksik kayitlar kucuk, gizlenen veya nadir gorulen hayvanlar icin ozellikle sorunludur. Bir tur bilinen noktalardan daha genis bir alani kullanabilir. Ayni zamanda model yeni bir dogrulanmis kayit yaratmaz; dogrulanmis gozlemler ve modellenmis tahminler ayri kalmalidir.",
              ],
              type: "p",
            },
          ],
          heading: "AOO ne demektir",
        },
        {
          blocks: [
            {
              parts: [
                "Yazarlar kayitlari 1 x 1 km'den 25 x 25 km'ye kadar farkli izgara boyutlarina yerlestirdi ve hucre boyutu arttikca occupied hucre sayisinin nasil degistigini izledi. Egrinin hucre boyutuna daha az duyarli hale geldigi olcek makalede breakpoint-derived grid-cell size olarak adlandiriliyor.",
              ],
              type: "p",
            },
            {
              parts: [
                "13 turun 9'unda anlamli breakpoints yaklasik 4-13 km araliginda goruldu. Bu yilanin hareket yaricapi veya yeni bir dagilis dogrulamasi degildir; bu veride sampling incompleteness'i dusunmek icin bilgilendirici bir mekansal olcektir.",
              ],
              type: "p",
            },
            {
              parts: [
                "En iyi temsil edilen alti turde yapilan dogrulama testlerinde, kayitlarin %25, %50 veya %75'i birakildiginda accumulation-curve tahminleri, ham eksik occupied-cell sayimlarindan sirasiyla %97.3, %97.8 ve %96.3 karsilastirmada tam veri setine daha yakin cikti.",
              ],
              type: "p",
            },
          ],
          heading: "Breakpoint testi ne gosterdi",
        },
        {
          blocks: [
            {
              parts: [
                "Biyocesitlilik atlaslari icin ders pratiktir: belirli bir fotograf kaydi bir seviyedir, bir bolgede bulunusa dair guvenilir kanit baska bir seviyedir, olasi veya modellenmis dagilis ise ucuncu bir seviyedir. ",
                { id: "snakes", label: "Yilan sayfalari", type: "hub" },
                " bu seviyeleri karistirmamalidir.",
              ],
              type: "p",
            },
            {
              parts: [
                "Citizen science bu resimde merkezi rol oynar. Kesin yer, tarih ve dogrulanmis tanimla birlikte bir fotograf, profesyonel herpetologlarin nadiren karsilastigi turler icin bile bilgi ekleyebilir. Makalenin sakin dersi sudur: dagilis haritalari neyi bildigimizi, neyi bilmedigimizi ve kayitlar arasindaki belirsizligi gostermelidir.",
              ],
              type: "p",
            },
          ],
          heading: "Gurcistan icin neden onemli",
        },
        {
          blocks: [
            {
              parts: [
                {
                  href: PAPER_URL,
                  label:
                    "Estimating Area of Occupancy From Incomplete Occurrence Records: Reproducible Workflow Illustrated on a Comprehensive Dataset of Georgian Snakes",
                  type: "external",
                },
                ". Giorgi Iankoshvili and David Tarkhnishvili. ",
                { name: "Ecology and Evolution", type: "sci" },
                ", first published 3 September 2026. DOI: 10.1002/ece3.74292.",
              ],
              type: "p",
            },
            {
              parts: [
                {
                  href: PUBMED_URL,
                  label: "PubMed kaydi",
                  type: "external",
                },
                ".",
              ],
              type: "p",
            },
          ],
          heading: "Kaynaklar",
        },
      ],
      title:
        "Yeni calisma: Gurcistan yilanlarinin nerede yasadigini ne kadar dogru biliyoruz?",
    },
  },
  id: "georgian-snakes-area-of-occupancy-2026",
  publishedAt: "2026-09-22",
  relatedHubIds: ["snakes"],
  relatedRegionIds: [],
  relatedSpeciesIds: [
    "dolichophis-schmidti",
    "natrix-tessellata",
    "coronella-austriaca",
    "natrix-natrix",
    "platyceps-najadum",
    "telescopus-fallax",
    "zamenis-hohenackeri",
    "eirenis-modestus",
    "elaphe-urartica",
    "zamenis-longissimus",
    "hemorrhois-ravergieri",
    "eirenis-collaris",
    "elaphe-dione",
  ],
  slug: "georgian-snakes-area-of-occupancy-2026",
  sources: [
    {
      name: "Iankoshvili & Tarkhnishvili 2026 - Ecology and Evolution, DOI 10.1002/ece3.74292",
      url: PAPER_URL,
    },
    {
      name: "PubMed - Estimating Area of Occupancy From Incomplete Occurrence Records",
      url: PUBMED_URL,
    },
  ],
  status: "published",
};
