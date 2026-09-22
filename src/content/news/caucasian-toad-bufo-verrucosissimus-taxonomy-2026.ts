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
      en: {
        dek: "A genomic study in Molecular Phylogenetics and Evolution questions the separate-species status of the Caucasian toad, but the taxonomic change is not a settled decision yet.",
        lead: "The Caucasian toad is treated as a separate species in Georgia, but a new 2026 genomic study reopens that status. According to the authors, the Caucasian lineage appears in the nuclear genome as a relatively shallow lineage within Bufo bufo and shows broad genetic mixing with the Balkan lineage in Anatolia. That is important evidence, but it does not mean Bufo verrucosissimus has already been officially 'cancelled'.",
        metaDescription:
          "A new genomic study questions the separate-species status of the Caucasian toad, but Bufo verrucosissimus has not yet been formally removed.",
        metaTitle:
          "Caucasian toad status: what a new genomic study shows",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "Is ",
                  {
                    id: "bufo-verrucosissimus",
                    label: "the Caucasian toad",
                    type: "species",
                  },
                  " really an independent species? The new study makes the question more complicated than a yes-or-no answer. Genomic data suggest that the Caucasian population may not be as deeply separated from ",
                  { name: "Bufo bufo", type: "sci" },
                  " as expected under a clear separate-species interpretation.",
                ],
                type: "p",
              },
              {
                parts: [
                  "This is not a story that the Caucasian toad no longer exists. Taxonomic changes do not happen in one day. A paper can be important while accepted names, checklists, and international databases change only after broader scientific uptake.",
                ],
                type: "p",
              },
            ],
            heading: "Status under review, not closed",
          },
          {
            blocks: [
              {
                parts: [
                  "The paper was published on 10 September 2026 in ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  ". It studies the Western Palearctic common toads, the ",
                  { name: "Bufo bufo", type: "sci" },
                  " complex, using genome-wide ddRAD-seq nuclear data together with a broad mitochondrial dataset.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The analysis clearly recovered three recognized species: ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  ", and ",
                  { name: "Bufo bufo", type: "sci" },
                  ". Within ",
                  { name: "Bufo bufo", type: "sci" },
                  ", the authors discuss Apennine, Balkan, Caucasian, and northern European lineages.",
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
                  "The Caucasian toad, ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", is a forest amphibian directly relevant to Georgia's fauna. On Reptiles.ge it is currently shown as a separate species, while its profile already notes that the 2026 Georgian checklist leaves species rank as a candidate issue relative to ",
                  { name: "Bufo bufo", type: "sci" },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  "Amphibian Species of the World's current record still displays it as a separate species entry and gives a distribution including the western Caucasus, Georgia, northern Azerbaijan, northeastern Turkey, and related areas. The same page's historical comments show that this taxon's status has long been debated.",
                ],
                type: "p",
              },
            ],
            heading: "Who is Bufo verrucosissimus",
          },
          {
            blocks: [
              {
                parts: [
                  "The key point is that nuclear DNA and mitochondrial DNA do not always tell the same story. In this study, the nuclear ddRAD-seq data place the Caucasian lineage as a relatively shallow lineage within ",
                  { name: "Bufo bufo", type: "sci" },
                  ", while mitochondrial signals can preserve older geographic patterns.",
                ],
                type: "p",
              },
              {
                parts: [
                  "The authors also report broad intergradation between Caucasian and Balkan lineages in Anatolia. Gene flow does not automatically make two lineages one species, but in this case the authors combine several lines of evidence and treat the Caucasian lineage's position as an argument against separate-species status.",
                ],
                type: "p",
              },
            ],
            heading: "What the genomic result shows",
          },
          {
            blocks: [
              {
                parts: [
                  "A proposed taxonomic interpretation in a paper and a changed accepted name in databases are not the same thing. On 16 September 2026, Amphibian Species of the World added comments on the Dufresnes et al. paper to ",
                  { name: "Bufo", type: "sci" },
                  ", ",
                  { name: "Bufo bufo", type: "sci" },
                  ", ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  ", and ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  "At the time this article was prepared, the Amphibian Species of the World page for ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  " still reads as a separate species entry. The precise conclusion is therefore not 'removed', but 'status needs review'.",
                ],
                type: "p",
              },
            ],
            heading: "Why the name has not simply disappeared",
          },
          {
            blocks: [
              {
                parts: [
                  "For Georgia, this is first a taxonomy and database question. If the new interpretation becomes widely accepted, names in ",
                  { id: "amphibians", label: "Georgian amphibian", type: "hub" },
                  " lists, atlases, and conservation datasets may need updating later.",
                ],
                type: "p",
              },
              {
                parts: [
                  "It does not mean that Georgia's fauna has already 'lost' a species today. Reptiles.ge should not change the species page on the basis of one paper alone; the site should follow taxonomic developments through international sources and regional checklists.",
                ],
                type: "p",
              },
            ],
            heading: "What it means for Georgia",
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
                  ". Christophe Dufresnes et al. ",
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
                  ", ",
                  {
                    href: PUBMED_URL,
                    label: "PubMed record",
                    type: "external",
                  },
                  ", and ",
                  {
                    href: ASW_UPDATES_URL,
                    label: "Amphibian Species of the World 2026 updates",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ASW_SPECIES_URL,
                    label:
                      "Amphibian Species of the World - Bufo verrucosissimus",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Sources",
          },
        ],
        title:
          "Caucasian toad status is under review - what the new genomic study shows",
      },
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
      ru: {
        dek: "Геномное исследование в Molecular Phylogenetics and Evolution ставит под вопрос статус кавказской жабы как отдельного вида, но таксономическое изменение еще не является окончательным решением.",
        lead: "Кавказская жаба в Грузии рассматривается как отдельный вид, однако новое геномное исследование 2026 года снова обсуждает этот статус. По данным авторов, кавказская линия в ядерном геноме выглядит как относительно неглубокая линия внутри Bufo bufo и образует широкое генетическое смешение с балканской линией в Анатолии. Это важный аргумент, но он не означает, что Bufo verrucosissimus уже официально 'отменена'.",
        metaDescription:
          "Новое геномное исследование ставит под вопрос статус кавказской жабы как отдельного вида, но Bufo verrucosissimus еще не удалена официально.",
        metaTitle:
          "Статус кавказской жабы: что показывает новое геномное исследование",
        sections: [
          {
            blocks: [
              {
                parts: [
                  "Является ли ",
                  {
                    id: "bufo-verrucosissimus",
                    label: "кавказская жаба",
                    type: "species",
                  },
                  " действительно самостоятельным видом? Новое исследование делает вопрос сложнее, чем простой ответ да или нет. Геномные данные показывают, что кавказская популяция может быть не так глубоко отделена от ",
                  { name: "Bufo bufo", type: "sci" },
                  ", как ожидалось бы при уверенном отдельном видовом статусе.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Это не история о том, что кавказская жаба больше не существует. Таксономические изменения не происходят за один день. Одна статья может быть очень важной, но accepted names, чеклисты и международные базы данных меняются только после более широкого научного принятия.",
                ],
                type: "p",
              },
            ],
            heading: "Статус пересматривается, но вопрос не закрыт",
          },
          {
            blocks: [
              {
                parts: [
                  "Статья опубликована 10 сентября 2026 года в ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  ". Она посвящена западнопалеарктическим обыкновенным жабам, комплексу ",
                  { name: "Bufo bufo", type: "sci" },
                  ", и объединяет genome-wide ddRAD-seq ядерные данные с широким митохондриальным набором данных.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Анализ четко выделил три признанных вида: ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  " и ",
                  { name: "Bufo bufo", type: "sci" },
                  ". Внутри ",
                  { name: "Bufo bufo", type: "sci" },
                  " авторы обсуждают апеннинскую, балканскую, кавказскую и североевропейскую линии.",
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
                  "Кавказская жаба, ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", - лесная амфибия, напрямую связанная с фауной Грузии. На Reptiles.ge она сейчас показана как отдельный вид, но профиль уже отмечает, что грузинский чеклист 2026 года оставляет видовой ранг кандидатным вопросом относительно ",
                  { name: "Bufo bufo", type: "sci" },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  "Текущая запись Amphibian Species of the World все еще показывает ее как отдельный species entry и указывает распространение, включающее Западный Кавказ, Грузию, северный Азербайджан, северо-восточную Турцию и связанные районы. Исторические комментарии на той же странице показывают, что статус таксона давно обсуждается.",
                ],
                type: "p",
              },
            ],
            heading: "Кто такая Bufo verrucosissimus",
          },
          {
            blocks: [
              {
                parts: [
                  "Главный момент в том, что ядерная и митохондриальная ДНК не всегда рассказывают одну и ту же историю. В этом исследовании ядерные ddRAD-seq данные помещают кавказскую линию как относительно неглубокую линию внутри ",
                  { name: "Bufo bufo", type: "sci" },
                  ", тогда как митохондриальные сигналы могут сохранять более старые географические паттерны.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Авторы также сообщают о широком intergradation между кавказской и балканской линиями в Анатолии. Gene flow не делает две линии автоматически одним видом, но в этом случае авторы объединяют несколько линий evidence и рассматривают положение кавказской линии как аргумент против отдельного видового статуса.",
                ],
                type: "p",
              },
            ],
            heading: "Что показывает геномный результат",
          },
          {
            blocks: [
              {
                parts: [
                  "Таксономическая интерпретация в статье и изменение accepted name в базах данных - не одно и то же. 16 сентября 2026 года Amphibian Species of the World добавила комментарии о статье Dufresnes et al. к ",
                  { name: "Bufo", type: "sci" },
                  ", ",
                  { name: "Bufo bufo", type: "sci" },
                  ", ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  " и ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  "На момент подготовки этой статьи страница Amphibian Species of the World для ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  " все еще читается как отдельная species entry. Поэтому точный вывод не 'удалена', а 'статус требует пересмотра'.",
                ],
                type: "p",
              },
            ],
            heading: "Почему название не исчезло",
          },
          {
            blocks: [
              {
                parts: [
                  "Для Грузии это прежде всего вопрос таксономии и баз данных. Если новая интерпретация будет широко принята, в будущем могут потребоваться обновления в списках ",
                  { id: "amphibians", label: "амфибий Грузии", type: "hub" },
                  ", атласах и conservation datasets.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Это не означает, что фауна Грузии уже сегодня 'потеряла' один вид. Reptiles.ge не должен менять страницу вида только на основании одной статьи; сайт должен следить за таксономическими изменениями через международные источники и региональные чеклисты.",
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
                  {
                    href: PAPER_URL,
                    label:
                      "Recurrent hybridization shapes the diversification of Western Palearctic common toads (Bufo bufo complex)",
                    type: "external",
                  },
                  ". Christophe Dufresnes et al. ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  ", 226:108738, published online 10 September 2026. DOI: 10.1016/j.ympev.2026.108738.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: SCIENCEDIRECT_URL,
                    label: "запись ScienceDirect",
                    type: "external",
                  },
                  ", ",
                  {
                    href: PUBMED_URL,
                    label: "запись PubMed",
                    type: "external",
                  },
                  " и ",
                  {
                    href: ASW_UPDATES_URL,
                    label: "обновления Amphibian Species of the World 2026",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ASW_SPECIES_URL,
                    label:
                      "Amphibian Species of the World - Bufo verrucosissimus",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
            ],
            heading: "Источники",
          },
        ],
        title:
          "Статус кавказской жабы пересматривается - что показывает новое геномное исследование",
      },
      tr: {
        dek: "Molecular Phylogenetics and Evolution'da yayimlanan genomik calisma Kafkas karakurbagasinin ayri tur statusunu sorguluyor, ancak taksonomik degisiklik henuz kesinlesmis bir karar degil.",
        lead: "Kafkas karakurbagasi Gurcistan'da ayri bir tur olarak ele aliniyor, ancak 2026 tarihli yeni genomik calisma bu statusu yeniden tartisiyor. Yazarlara gore Kafkas soyu nukleer genomda Bufo bufo icinde gorece yuzeysel bir soy olarak gorunuyor ve Anadolu'da Balkan soyu ile genis genetik karisim gosteriyor. Bu onemli bir kanittir, fakat Bufo verrucosissimus'un resmi olarak 'iptal edildigi' anlamina gelmez.",
        metaDescription:
          "Yeni genomik calisma Kafkas karakurbagasinin ayri tur statusunu sorguluyor, ancak Bufo verrucosissimus henuz resmi olarak kaldirilmis degil.",
        metaTitle:
          "Kafkas karakurbagasi statusu: yeni genomik calisma ne gosteriyor",
        sections: [
          {
            blocks: [
              {
                parts: [
                  {
                    id: "bufo-verrucosissimus",
                    label: "Kafkas karakurbagasi",
                    type: "species",
                  },
                  " gercekten bagimsiz bir tur mu? Yeni calisma bu soruyu evet-hayir yanitindan daha karmasik hale getiriyor. Genomik veriler, Kafkas populasyonunun ",
                  { name: "Bufo bufo", type: "sci" },
                  "'dan ayri tur statusu icin beklenecek kadar derin ayrilmamis olabilecegini gosteriyor.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bu, Kafkas karakurbagasi artik yok demek degildir. Taksonomik degisiklikler bir gunde olmaz. Bir makale cok onemli olabilir, ancak accepted name'ler, kontrol listeleri ve uluslararasi veritabanlari daha genis bilimsel kabulden sonra degisir.",
                ],
                type: "p",
              },
            ],
            heading: "Status inceleniyor, konu kapanmadi",
          },
          {
            blocks: [
              {
                parts: [
                  "Makale 10 Eylul 2026'da ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  " dergisinde yayimlandi. Bati Palearktik yaygin karakurbagalari, yani ",
                  { name: "Bufo bufo", type: "sci" },
                  " kompleksi uzerine calisma, genome-wide ddRAD-seq nukleer verileri genis bir mitokondriyal veri setiyle birlestiriyor.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Analiz uc taninan turu acikca ayirdi: ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  " ve ",
                  { name: "Bufo bufo", type: "sci" },
                  ". ",
                  { name: "Bufo bufo", type: "sci" },
                  " icinde yazarlar Apenin, Balkan, Kafkas ve kuzey Avrupa soylarini tartisiyor.",
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
                  "Kafkas karakurbagasi, ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", Gurcistan faunasi ile dogrudan ilgili bir orman amfibisidir. Reptiles.ge'de su anda ayri tur olarak gosteriliyor, ancak profil 2026 Gurcistan kontrol listesinin tur rutbesini ",
                  { name: "Bufo bufo", type: "sci" },
                  " ile iliskili aday bir konu olarak biraktigini zaten belirtiyor.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Amphibian Species of the World'un guncel kaydi onu hala ayri bir species entry olarak gosteriyor ve dagilisinda Bati Kafkasya, Gurcistan, kuzey Azerbaycan, kuzeydogu Turkiye ve ilgili bolgeleri sayiyor. Ayni sayfadaki tarihsel yorumlar bu taksonun statusunun uzun suredir tartisildigini gosteriyor.",
                ],
                type: "p",
              },
            ],
            heading: "Bufo verrucosissimus kimdir",
          },
          {
            blocks: [
              {
                parts: [
                  "Temel nokta sudur: nukleer DNA ve mitokondriyal DNA her zaman ayni hikayeyi anlatmaz. Bu calismada nukleer ddRAD-seq verileri Kafkas soyunu ",
                  { name: "Bufo bufo", type: "sci" },
                  " icinde gorece yuzeysel bir soy olarak yerlestirirken, mitokondriyal sinyaller daha eski cografi desenleri koruyabilir.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Yazarlar Anadolu'da Kafkas ve Balkan soylari arasinda genis intergradation oldugunu da bildiriyor. Gene flow iki soyu otomatik olarak tek tur yapmaz, ancak bu durumda yazarlar birkac kanit cizgisini birlestirerek Kafkas soyunun konumunu ayri tur statusune karsi bir arguman olarak degerlendiriyor.",
                ],
                type: "p",
              },
            ],
            heading: "Genomik sonuc ne gosteriyor",
          },
          {
            blocks: [
              {
                parts: [
                  "Bir makaledeki taksonomik yorum ile veritabanlarinda accepted name'in degismesi ayni sey degildir. Amphibian Species of the World, 16 Eylul 2026'da Dufresnes ve arkadaslarinin makalesine iliskin yorumlari ",
                  { name: "Bufo", type: "sci" },
                  ", ",
                  { name: "Bufo bufo", type: "sci" },
                  ", ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  ", ",
                  { name: "Bufo spinosus", type: "sci" },
                  " ve ",
                  { name: "Bufo eichwaldi", type: "sci" },
                  " kayitlarina ekledi.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bu haber hazirlanirken Amphibian Species of the World'deki ",
                  { name: "Bufo verrucosissimus", type: "sci" },
                  " sayfasi hala ayri bir species entry olarak okunuyordu. Bu yuzden dogru sonuc 'kaldirildi' degil, 'statusu yeniden degerlendirilmeli'dir.",
                ],
                type: "p",
              },
            ],
            heading: "Isim neden kaybolmadi",
          },
          {
            blocks: [
              {
                parts: [
                  "Gurcistan icin bu once taksonomi ve veritabani meselesidir. Yeni yorum genis kabul gorurse, gelecekte ",
                  { id: "amphibians", label: "Gurcistan amfibileri", type: "hub" },
                  " listelerinde, atlaslarda ve conservation datasets icinde ad guncellemeleri gerekebilir.",
                ],
                type: "p",
              },
              {
                parts: [
                  "Bu, Gurcistan faunasinin bugun zaten bir tur 'kaybettigi' anlamina gelmez. Reptiles.ge tek bir makaleye dayanarak tur sayfasini degistirmemeli; taksonomik gelismeleri uluslararasi kaynaklar ve bolgesel kontrol listeleri uzerinden izlemelidir.",
                ],
                type: "p",
              },
            ],
            heading: "Gurcistan icin anlami",
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
                  ". Christophe Dufresnes et al. ",
                  { name: "Molecular Phylogenetics and Evolution", type: "sci" },
                  ", 226:108738, published online 10 September 2026. DOI: 10.1016/j.ympev.2026.108738.",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: SCIENCEDIRECT_URL,
                    label: "ScienceDirect kaydi",
                    type: "external",
                  },
                  ", ",
                  {
                    href: PUBMED_URL,
                    label: "PubMed kaydi",
                    type: "external",
                  },
                  " ve ",
                  {
                    href: ASW_UPDATES_URL,
                    label: "Amphibian Species of the World 2026 guncellemeleri",
                    type: "external",
                  },
                  ".",
                ],
                type: "p",
              },
              {
                parts: [
                  {
                    href: ASW_SPECIES_URL,
                    label:
                      "Amphibian Species of the World - Bufo verrucosissimus",
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
          "Kafkas karakurbagasi statusu yeniden degerlendiriliyor - yeni genomik calisma ne gosteriyor",
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
