import type { NewsArticle } from "@/data/newsTypes";

const PAPER_URL = "https://doi.org/10.1016/j.ympev.2026.108738";
const SCIENCEDIRECT_URL =
  "https://www.sciencedirect.com/science/article/pii/S1055790326002083";
const PUBMED_URL = "https://pubmed.ncbi.nlm.nih.gov/42722318/";
const ASW_UPDATES_URL =
  "https://amphibiansoftheworld.amnh.org/Newly-described-species-changes-and-additions-2026";
const ASW_SPECIES_URL =
  "https://amphibiansoftheworld.amnh.org/Amphibia/Anura/Bufonidae/Bufo/Bufo-verrucosissimus";

export const CAUCASIAN_TOAD_BUFO_VERRUCOSISSIMUS_TAXONOMY_2026: NewsArticle =
  {
    copy: {
      ka: {
        dek: "Molecular Phylogenetics and Evolution-ში გამოქვეყნებული გენომური კვლევა კავკასიური გომბეშოს ცალკე სახეობის სტატუსს ეჭვქვეშ აყენებს, მაგრამ ტაქსონომიური ცვლილება ჯერ დასრულებული გადაწყვეტილება არ არის.",
        lead: "კავკასიური გომბეშო საქართველოში ცალკე სახეობად არის ცნობილი, თუმცა 2026 წლის ახალი გენომური კვლევა მის სტატუსს თავიდან განიხილავს. ავტორების მონაცემებით, კავკასიური ხაზი ბირთვულ გენომში Bufo bufo-ს შიგნით შედარებით ზედაპირულ ხაზად ჩანს და ანატოლიაში ბალკანურ ხაზთან ფართო გენეტიკურ შერევას ქმნის. ეს მნიშვნელოვანი არგუმენტია, მაგრამ ჯერ არ ნიშნავს, რომ Bufo verrucosissimus ოფიციალურად „გაუქმდა“.",
        metaDescription:
          "ახალი გენომური კვლევა კავკასიური გომბეშოს ცალკე სახეობის სტატუსს ეჭვქვეშ აყენებს, თუმცა Bufo verrucosissimus ჯერ არ გაუქმებულა.",
        metaTitle:
          "კავკასიური გომბეშოს სტატუსი: ახალი გენომური კვლევა",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "არის თუ არა ",
                  {
                    id: "bufo-verrucosissimus",
                    label: "კავკასიური გომბეშო",
                    type: "species",
                  },
                  " ნამდვილად დამოუკიდებელი სახეობა? ახალი კვლევა ამ კითხვას უფრო რთულს ხდის, ვიდრე ერთი სიტყვით პასუხია. გენომური მონაცემები აჩვენებს, რომ კავკასიური პოპულაცია შეიძლება ",
                  { name: "Bufo bufo", type: "sci" },
                  "-სგან იმდენად ღრმად არ იყოს გამოყოფილი, როგორც ცალკე სახეობის სტატუსის შემთხვევაში მოველოდით.",
                ],
                type: "p",
              },
              {
                parts: [
                  "მაგრამ ეს არ არის ამბავი იმის შესახებ, რომ „კავკასიური გომბეშო აღარ არსებობს“. ტაქსონომიაში ასეთი ცვლილება ერთ დღეში არ ხდება. ერთი ნაშრომი შეიძლება ძალიან მნიშვნელოვანი იყოს, მაგრამ სახეობის accepted name-ს, checklist-ებსა და საერთაშორისო მონაცემთა ბაზებს ცვლილება მხოლოდ ფართო სამეცნიერო მიღების შემდეგ ედება.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ამიტომ უფრო ზუსტი ფორმულირება ასეთია: 2026 წლის გენომური კვლევა ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  "-ის ცალკე სახეობად აღიარებას ეჭვქვეშ აყენებს და ტაქსონომიური სტატუსის გადახედვის საფუძველს ქმნის. საბოლოო პრაქტიკული ცვლილება კი ჯერ ყველა ავტორიტეტულ წყაროში ასახული არ არის.",
                ],
                type: "p",
              },
            ],
            heading: "სტატუსი კითხვის ნიშნის ქვეშაა, არა დახურული",
          },
          {
            blocks: [
              {
                parts: [
                  "ნაშრომი 2026 წლის 10 სექტემბერს ჟურნალ ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  "-ში გამოქვეყნდა. ავტორები არიან Christophe Dufresnes, Sven Gippner, Sylvia Hofmann, Ilias Strachinis, Johanna Ambu, Dmitriy V. Skorinov, Artem A. Kidov, Pierre-André Crochet, Daniel Jablonski და Spartak N. Litvinchuk.",
                ],
                type: "p",
              },
              {
                parts: [
                  "კვლევა დასავლეთ პალეარქტიკის ჩვეულებრივი გომბეშოების, ანუ ",
                  { name: "Bufo bufo", type: "sci" },
                  " კომპლექსს ეხება. ავტორებმა genome-wide ddRAD-seq ბირთვული მონაცემები ფართო მიტოქონდრიულ dataset-ს შეუთავსეს და შეამოწმეს, როგორ არის მოწყობილი გენეტიკური ხაზები ევროპის, კავკასიისა და ახლო აღმოსავლეთის მასშტაბით.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ანალიზმა მკაფიოდ გამოყო სამი აღიარებული სახეობა: ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  " და ",
                  { name: "Bufo bufo", type: "sci" },
                  ". ამ უკანასკნელის შიგნით ავტორები ოთხ მთავარ ხაზს ასახელებენ: აპენინურს, ბალკანურს, კავკასიურს და ჩრდილოეთ ევროპულს.",
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
                  "კავკასიური გომბეშო, ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", გომბეშოსებრთა ოჯახის ტყის ამფიბიაა და საქართველოს ფაუნასთან პირდაპირ არის დაკავშირებული. ",
                  {
                    id: "bufo-verrucosissimus",
                    label: "Reptiles.ge-ის პროფილში",
                    type: "species",
                  },
                  " ის ამჟამად ცალკე სახეობად არის მოცემული, თუმცა უკვე მითითებულია, რომ 2026 წლის ქართული ჩამონათვალი სახეობრივ რანგს კანდიდატად ტოვებს ",
                  { name: "Bufo bufo", type: "sci" },
                  "-სთან მიმართებით.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Amphibian Species of the World-ის მიმდინარე ჩანაწერი მას კვლავ ცალკე species entry-ად აჩვენებს და გავრცელებაში ასახელებს დასავლეთ კავკასიას, საქართველოს, ჩრდილოეთ აზერბაიჯანს, ჩრდილო-აღმოსავლეთ თურქეთს და სხვა დაკავშირებულ რეგიონებს. იგივე გვერდი ისტორიულ კომენტარებში აჩვენებს, რომ ამ ტაქსონის სტატუსი დიდი ხანია განხილვის საგანია.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ტრადიციულად კავკასიური გომბეშო ჩვეულებრივი გომბეშოსგან გეოგრაფიული, მორფოლოგიური და გენეტიკური არგუმენტებით იყო გამიჯნული. ახალი კვლევა ამ სურათს მთლიან გენომურ დონეზე ამოწმებს და აჩვენებს, რომ მიტოქონდრიული სიგნალი და ბირთვული გენომი ერთსა და იმავე ამბავს არ ყვება.",
                ],
                type: "p",
              },
            ],
            heading: "ვინ არის Bufo verrucosissimus",
          },
          {
            blocks: [
              {
                parts: [
                  "ბირთვული გენომი ორგანიზმის ორივე მშობლისგან მიღებულ ბევრ გენეტიკურ სიგნალს აერთიანებს. ამიტომ ის ხშირად უკეთ აჩვენებს პოპულაციების საერთო ევოლუციურ ისტორიას, განსაკუთრებით მაშინ, როცა წარსულში ხაზები ერთმანეთს ხელახლა შეხვდნენ და გენების გაცვლა მოხდა.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ამ კვლევაში სწორედ ბირთვული ddRAD-seq მონაცემებია ის ნაწილი, რომელმაც კავკასიური ხაზი ",
                  { name: "Bufo bufo", type: "sci" },
                  "-ს შიგნით შედარებით ზედაპირულ nuclear lineage-ად აჩვენა. ეს განსხვავდება იმ სურათისგან, რომელსაც მხოლოდ მიტოქონდრიული დნმ შეიძლება ქმნიდეს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "მიტოქონდრიული დნმ დედის ხაზით გადადის და ხშირად ძალიან სასარგებლოა ძველი გეოგრაფიული ხაზების სანახავად. მაგრამ ის ყოველთვის მთლიანი გენომის ისტორიას არ ასახავს. თუ მიტოქონდრიული ხაზი ღრმად განსხვავებულია, ეს შეიძლება რეალურ ძველ იზოლაციას მიუთითებდეს, მაგრამ ცალკე სახეობის სტატუსს ავტომატურად არ ამტკიცებს.",
                ],
                type: "p",
              },
            ],
            heading: "რას აჩვენებს ბირთვული და მიტოქონდრიული დნმ",
          },
          {
            blocks: [
              {
                parts: [
                  "ავტორების მთავარი დასკვნა კავკასიურ პოპულაციაზე ასეთია: ადრე ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  "-ად მიჩნეული კავკასიური პოპულაცია, რომელიც ღრმა მიტოქონდრიული განსხვავებით იყო გამოკვეთილი, ბირთვულ გენომში ",
                  { name: "Bufo bufo", type: "sci" },
                  "-ს შიგნით შედარებით ზედაპირულ ხაზად ჩანს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "მეორე მნიშვნელოვანი დეტალია ანატოლია. კვლევის მიხედვით, კავკასიური და ბალკანური ხაზები ანატოლიაში ფართო intergradation zone-ს ქმნიან: ანუ იქ მათი გენეტიკური ნიშნები შერეულია. ასეთი gene flow შეიძლება ნიშნავდეს, რომ ხაზებს შორის reproductive isolation ბოლომდე არ ჩამოყალიბებულა.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ეს არ ნიშნავს მარტივ წესს: „ჰიბრიდიზაცია ხდება, მაშასადამე ერთი სახეობაა“. ბუნებაში ახლო სახეობებს შორის გენების გაცვლა ზოგჯერ მაინც ხდება. მაგრამ ამ შემთხვევაში ავტორები რამდენიმე ხაზის evidence-ს აერთიანებენ და წერენ, რომ კავკასიური ხაზის ასეთი პოზიცია და ანატოლიაში შერევა ცალკე species status-ის წინააღმდეგ ლაპარაკობს.",
                ],
                type: "p",
              },
            ],
            heading: "რა აღმოაჩინეს კავკასიურ ხაზში",
          },
          {
            blocks: [
              {
                parts: [
                  "სახეობის განსაზღვრა მხოლოდ ერთი გენეტიკური პროცენტით არ წყდება. ტაქსონომისტები შეიძლება ითვალისწინებდნენ გენეტიკურ განსხვავებას, გეოგრაფიულ იზოლაციას, მორფოლოგიას, gene flow-ს, reproductive isolation-ს და იმ ევოლუციურ ისტორიას, რომელმაც კონკრეტული პოპულაციები შექმნა.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ამიტომ არ არსებობს უნივერსალური „დნმ-ის ზღვარი“, რომლის შემდეგაც პოპულაცია ავტომატურად სახეობაა ან აღარ არის სახეობა. განსაკუთრებით რთულია შემთხვევები, სადაც გამყინვარების პერიოდებმა პოპულაციები დროებით გაჰყო, ხოლო თბილ პერიოდებში ისინი ისევ დაუკავშირდა ერთმანეთს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "სწორედ ამას აღწერს ახალი კვლევა: რეფუგიებში გაყოფილი ხაზები ყოველთვის მკაცრ იზოლაციაში არ ვითარდებოდა. განმეორებითმა შეხვედრამ და გენების გაცვლამ მათი საზღვრები გააბუნდოვანა და ხის მსგავსი, მკაფიო ტაქსონომიური სურათი უფრო რთული გახადა.",
                ],
                type: "p",
              },
            ],
            heading: "რას ნიშნავს საერთოდ ცალკე სახეობა",
          },
          {
            blocks: [
              {
                parts: [
                  "სამეცნიერო ნაშრომში შემოთავაზებული ტაქსონომიური ინტერპრეტაცია და მონაცემთა ბაზაში accepted name-ის შეცვლა ერთი და იგივე არ არის. ავტორიტეტული ბაზები, checklist-ები და ატლასები ცვლილებას ხშირად მხოლოდ დამატებითი განხილვის შემდეგ იღებენ.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Amphibian Species of the World-ის 2026 წლის update log-ში 16 სექტემბერს დაემატა კომენტარი Dufresnes და თანაავტორების ნაშრომზე. log პირდაპირ ამბობს, რომ კომენტარები დაემატა ",
                  { name: "Bufo", type: "sci" },
                  "-ს, ",
                  { name: "Bufo bufo", type: "sci" },
                  "-ს, ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  "-ს, ",
                  { name: "Bufo spinosus", type: "sci" },
                  "-ს და ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  "-ს ჩანაწერებთან.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ამ სტატიის მომზადებისას Amphibian Species of the World-ის ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  " გვერდი კვლავ ცალკე Species entry-ად იკითხება. ეს ნიშნავს, რომ კვლევა უკვე გათვალისწინებულია კომენტარებში, მაგრამ accepted taxonomy ამ მონაცემთა ბაზაში ჯერ სრულად არ გადაკეთებულა. ამიტომ სწორი დასკვნა არის არა „გაუქმდა“, არამედ „სტატუსი გადასახედია“.",
                ],
                type: "p",
              },
            ],
            heading: "რატომ არ გაუქმებულა ჯერ კავკასიური გომბეშო",
          },
          {
            blocks: [
              {
                parts: [
                  "საქართველოსთვის ეს ამბავი პირველ რიგში ტაქსონომიური და მონაცემთა ბაზების საკითხია. თუ ახალი ინტერპრეტაცია ფართოდ იქნება მიღებული, მომავალში ",
                  { id: "amphibians", label: "საქართველოს ამფიბიების", type: "hub" },
                  " სიებში, ატლასებში და conservation datasets-ში სახელების განახლება შეიძლება გახდეს საჭირო.",
                ],
                type: "p",
              },
              {
                parts: [
                  "მაგრამ ეს არ ნიშნავს, რომ ქვეყნის ფაუნას დღეს უკვე ერთი სახეობა „მოაკლდა“. ასეთი ფორმულირება მხოლოდ მაშინ იქნება სწორი, თუ მთავარი taxonomic authorities და რეგიონული checklist-ები შესაბამის ცვლილებას მიიღებენ. ამ ეტაპზე Reptiles.ge სახეობის გვერდს მხოლოდ ერთი კვლევის საფუძველზე არ ცვლის და ტაქსონომიურ განვითარებას საერთაშორისო წყაროებით ადევნებს თვალს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ველში ამოცნობაც არ იცვლება. ყავისფერი, მეჭეჭებიანი ტყის გომბეშო, რომელიც საქართველოში კავკასიურ გომბეშოდ არის ცნობილი, ისევ იგივე ცხოველია. იცვლება კითხვა მისი სახელისა და ტაქსონომიური რანგის შესახებ.",
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
                  "კვლევამ genome-wide ddRAD-seq მონაცემები და ფართო მიტოქონდრიული dataset-ი გააერთიანა დასავლეთ პალეარქტიკის ",
                  { name: "Bufo bufo", type: "sci" },
                  " კომპლექსისთვის.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ბირთვულ გენომში კავკასიური ხაზი ",
                  { name: "Bufo bufo", type: "sci" },
                  "-ს შიგნით შედარებით ზედაპირულ lineage-ად ჩანს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ანატოლიაში კავკასიურ და ბალკანურ ხაზებს შორის ფართო გენეტიკური შერევა გამოვლინდა.",
                ],
                type: "p",
              },
              {
                parts: [
                  "ავტორები ამ შედეგებს ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  "-ის ცალკე სახეობის სტატუსის წინააღმდეგ არსებულ არგუმენტად განიხილავენ.",
                ],
                type: "p",
              },
            ],
            heading: "რა ვიცით",
          },
          {
            blocks: [
              {
                parts: [
                  "ჯერ არ არის გადაწყვეტილი, მიიღებს თუ არა ფართო ტაქსონომიური consensus ამ ინტერპრეტაციას accepted taxonomy-ის დონეზე.",
                ],
                type: "p",
              },
              {
                parts: [
                  "არ ვიცით, როდის და როგორ აისახება ცვლილება Amphibian Species of the World-ში, IUCN-ში ან რეგიონულ checklist-ებში, თუ ასეთი ცვლილება საერთოდ ფართოდ მიიღეს.",
                ],
                type: "p",
              },
              {
                parts: [
                  "საქართველოს ფაუნის ოფიციალურ ჩამონათვალებზე გავლენა დამოკიდებულია არა მხოლოდ ამ ერთ კვლევაზე, არამედ მომდევნო ტაქსონომიურ გადაწყვეტილებებზე.",
                ],
                type: "p",
              },
            ],
            heading: "რა არ ვიცით ჯერ",
          },
          {
            blocks: [
              {
                parts: [
                  "ახალი გენომური კვლევის მთავარი მნიშვნელობა ისაა, რომ კავკასიური გომბეშოს ცალკე სახეობის სტატუსი სერიოზულად გადასახედი გახდა. მაგრამ სანამ მთავარი მონაცემთა ბაზები და checklist-ები accepted taxonomy-ს შეცვლიან, ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  " უნდა აღვწეროთ როგორც განხილვის პროცესში მყოფი ტაქსონი და არა უკვე გაუქმებული სახელი.",
                ],
                type: "p",
              },
            ],
            heading: "მთავარი დასკვნა",
          },
          {
            blocks: [
              {
                parts: [
                  {
                    href: PAPER_URL,
                    label:
                      "Recurrent hybridization shapes the diversification of Western Palearctic common toads (Bufo bufo complex)",
                    type: "external",
                  },
                  ". Christophe Dufresnes, Sven Gippner, Sylvia Hofmann, Ilias Strachinis, Johanna Ambu, Dmitriy V. Skorinov, Artem A. Kidov, Pierre-André Crochet, Daniel Jablonski and Spartak N. Litvinchuk. ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  ", 226:108738, published online 10 September 2026. DOI: 10.1016/j.ympev.2026.108738.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: SCIENCEDIRECT_URL,
                    label: "ScienceDirect record",
                    type: "external",
                  },
                  " and ",
                  {
                    href: PUBMED_URL,
                    label: "PubMed record",
                    type: "external",
                  },
                  " for the same article.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ASW_UPDATES_URL,
                    label:
                      "Amphibian Species of the World — Newly described species, changes, and additions, 2026",
                    type: "external",
                  },
                  "; 16 September 2026 update noting comments added for ",
                  { name: "Bufo", type: "sci" },
                  " and related species.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ASW_SPECIES_URL,
                    label:
                      "Amphibian Species of the World — Bufo verrucosissimus",
                    type: "external",
                  },
                  ", species entry consulted for current taxonomic presentation and distribution.",
                ],
                type: "p",
              },
            ],
            heading: "წყაროები",
          },
        ],
        title:
          "კავკასიური გომბეშოს სტატუსი გადასახედია — რას აჩვენებს ახალი გენომური კვლევა",
      },
    },
    id: "caucasian-toad-bufo-verrucosissimus-taxonomy-2026",
    publishedAt: "2026-09-22",
    relatedHubIds: ["amphibians"],
    relatedRegionIds: [],
    relatedSpeciesIds: ["bufo-verrucosissimus"],
    slug: "caucasian-toad-bufo-verrucosissimus-taxonomy-2026",
    sources: [
      {
        name: "Dufresnes et al. 2026 - Molecular Phylogenetics and Evolution, DOI 10.1016/j.ympev.2026.108738",
        url: PAPER_URL,
      },
      {
        name: "PubMed - Recurrent hybridization shapes the diversification of Western Palearctic common toads",
        url: PUBMED_URL,
      },
      {
        name: "Amphibian Species of the World - 2026 changes and additions",
        url: ASW_UPDATES_URL,
      },
      {
        name: "Amphibian Species of the World - Bufo verrucosissimus",
        url: ASW_SPECIES_URL,
      },
    ],
    status: "published",
  };
