import type { SpeciesFaq, SpeciesStat } from "@/data/species";

export type SpeciesTranslation = {
  commonName: string;
  location: string;
  description: string;
  overview: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservation: string;
  stats: SpeciesStat[];
  facts: string[];
  faq?: SpeciesFaq[];
};

export const speciesEn: Record<string, SpeciesTranslation> = {
  "vipera-dinniki": {
    commonName: "Dinnik's viper",
    location: "Greater Caucasus",
    description:
      "A venomous viper endemic to the Greater Caucasus, found in high-mountain forests and the subalpine zone.",
    overview:
      "Dinnik's viper (Vipera dinniki) is a venomous species endemic to the Greater Caucasus. It occurs in the high-mountain regions of Russia, Georgia, and Azerbaijan — in the upper forest zone, subalpine meadows, and rocky terrain, at roughly 1,500–2,800 meters. It is classified as Vulnerable by the IUCN due to its fragmented range and habitat degradation.",
    habitat:
      "Distributed along the Greater Caucasus range — in Russia, Georgia, and Azerbaijan. Its habitat includes forest, scrub, grassy cover, and rocky terrain at roughly 1,500–2,800 m elevation. Populations are spatially fragmented.",
    diet: "Adults feed mainly on lizards and rodents, occasionally birds. Juveniles feed on small lizards and insects. It hunts by ambush and subdues prey with venom.",
    behavior:
      "Active during the warm season; it seeks shade in intense heat. It hibernates from autumn to spring in rock crevices and under stones. It is ovoviviparous: mating occurs in April–May, and young are born in August–September — usually 3–7 individuals.",
    conservation:
      "Classified as Vulnerable on the IUCN Red List: its range is less than 20,000 km² and severely fragmented; a decline in habitat and population is projected. Threats include degradation of subalpine pastures and human pressure. It is listed in the Red Data Books of Georgia and Russia.",
    stats: [
      { label: "Habitat", value: "Greater Caucasus" },
      { label: "Length", value: "approx. 40–50 cm" },
      { label: "Venom", value: "Venomous" },
      { label: "Conservation", value: "Vulnerable (VU)" },
      { label: "Elevation", value: "1,500–2,800 m" },
      { label: "Family", value: "Viperidae" },
    ],
    facts: [
      "Named in honor of Russian herpetologist Nikolai Yakovlevich Dinnik.",
      "Ovoviviparous — young are born in August–September, usually 3–7 individuals.",
      "Its range is severely fragmented; IUCN status — Vulnerable.",
      "Distributed along the Greater Caucasus range — in Russia, Georgia, and Azerbaijan.",
    ],
    faq: [
      {
        question: "Is Dinnik's viper dangerous to humans?",
        answer:
          "It is venomous, though its danger level is rated moderate. Bites are rare — the snake does not attack unless it feels threatened. Still, immediate medical attention is required in the event of a bite.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "In the high-mountain zone of the Greater Caucasus — near the upper forest line, in subalpine meadows and rocky terrain, at roughly 1,500–2,800 meters. Populations are fragmented.",
      },
      {
        question: "How does it differ from the Levantine viper (gyurza)?",
        answer:
          "Dinnik's viper is smaller (approx. 40–50 cm), ovoviviparous, and a native of high-mountain habitat. The Levantine viper is larger, egg-laying, and found in the dry lowlands of eastern Georgia.",
      },
      {
        question: "Why is it considered a vulnerable species?",
        answer:
          "Its range is less than 20,000 km² and severely fragmented. Degradation of subalpine pastures and human pressure are reducing the population; it is listed in the Red Data Books of Georgia and Russia.",
      },
    ],
  },
  "macrovipera-lebetina": {
    commonName: "Levantine viper",
    location: "Eastern Georgia",
    description:
      "Georgia's largest and most dangerous venomous snake — a resident of dry, rocky landscapes.",
    overview:
      "The Levantine viper (Macrovipera lebetina) is a large venomous species of the viper family. In Georgia the subspecies M. l. obtusa occurs — in the lower reaches of the Iori, Mtkvari, and Alazani rivers, in Shiraki, the Gareji desert, and around Tbilisi and Rustavi. It inhabits dry and semi-arid rocky terrain, from sea level up to roughly 1,500 m. It is classified as Least Concern by the IUCN, though its bite can be fatal to humans.",
    habitat:
      "Distributed across southwestern Asia and the Caucasus. In Georgia — in the dry eastern zone: the Iori, Mtkvari, and Alazani basins, Shiraki, Gareji, and as far as Tbilisi and Rustavi. Its habitat includes rocks, stony slopes, rodent colonies, and human structures; it ranges up to roughly 1,500 m elevation.",
    diet: "Adults feed on rodents, small birds, lizards, and other small vertebrates. Juveniles hunt mainly small lizards. It hunts by ambush; it sometimes climbs shrubs and trees to catch birds.",
    behavior:
      "Active from late March to late October. In spring and autumn it moves by day; in summer heat it is active at night. It hibernates in rock crevices and burrows. It is egg-laying: mating occurs in April–May, and it lays roughly 15–20 eggs in late summer; young hatch in 35–45 days, at roughly 23–25 cm in length.",
    conservation:
      "Classified as Least Concern on the IUCN Red List; it also holds LC status in Georgia. Threats include habitat conversion, urbanization, overgrazing, and persecution by humans. It benefits the ecosystem by controlling rodent populations.",
    stats: [
      { label: "Habitat", value: "Eastern Georgia" },
      { label: "Length", value: "approx. 1–1.5 m" },
      { label: "Venom", value: "Highly dangerous" },
      { label: "Conservation", value: "Least Concern (LC)" },
      { label: "Elevation", value: "0–1,500 m" },
      { label: "Family", value: "Viperidae" },
    ],
    facts: [
      "It is Georgia's largest viper and likely the only venomous snake whose bite poses a genuine threat to human life.",
      "It is egg-laying — unlike Dinnik's viper, which is ovoviviparous; it lays roughly 15–20 eggs.",
      "Its venom is hemotoxic: it damages red blood cells and blood vessels; the antivenom \"Anti-Gyurza\" is used in treatment.",
      "The local name \"gyurza\" is used across the Caucasus and Central Asia; in English it is often called the Blunt-nosed or Levantine viper.",
    ],
    faq: [
      {
        question: "How dangerous is a Levantine viper's bite?",
        answer:
          "Very dangerous. In Georgia it is the largest viper and likely the only venomous snake whose bite can pose a genuine threat to human life. Its venom is hemotoxic — it damages blood and blood vessels.",
      },
      {
        question: "What should I do if bitten?",
        answer:
          "Call emergency services immediately or go to a medical facility. The victim should stay calm; the bite site should not be cut, sucked, or bound with a tight tourniquet. The antivenom \"Anti-Gyurza\" is used in treatment.",
      },
      {
        question: "Where is the Levantine viper found in Georgia?",
        answer:
          "In the dry and semi-arid zone of eastern Georgia — in the lower reaches of the Iori, Mtkvari, and Alazani rivers, in Shiraki, the Gareji desert, and around Tbilisi and Rustavi. It inhabits rocky terrain up to roughly 1,500 m.",
      },
      {
        question: "Is it active during the day?",
        answer:
          "In spring and autumn it is often active by day; in summer heat it shifts to a nocturnal lifestyle. Its active season runs from late March to late October.",
      },
      {
        question: "Does it lay eggs or give live birth?",
        answer:
          "It is egg-laying. Mating occurs in April–May; it lays roughly 15–20 eggs in late summer, and young hatch in 35–45 days.",
      },
    ],
  },
  "vipera-kaznakovi": {
    commonName: "Caucasus viper",
    location: "Western Caucasus",
    description:
      "A venomous viper endemic to the Caucasus — a rare inhabitant of Colchic forests and the Black Sea coast.",
    overview:
      "The Caucasus viper (Vipera kaznakovi) is a venomous species of the viper family, endemic to the southwestern Caucasus. It occurs in Georgia (Abkhazia, Adjara, Guria, Imereti; also the Borjomi gorge), northeastern Turkey, and Russia's Black Sea coast. It is distinguished by its red-orange coloration and dark zigzag stripe. It is classified as Endangered by the IUCN.",
    habitat:
      "It inhabits forested mountain slopes, humid ravines, forest clearings, beech and chestnut groves, river terraces, and subalpine meadows. It ranges from the coast up to the lower edge of coniferous forest — roughly 0–1,000 m (rarely higher). It avoids deep coniferous forest and heavily human-altered landscapes.",
    diet: "Adults feed on rodents (wood and field mice, voles), lizards, and small birds. Juveniles feed mainly on small lizards and insects — grasshoppers and crickets. It hunts by ambush and subdues prey with venom.",
    behavior:
      "It has a secretive way of life. On the Black Sea coast it emerges from hibernation in March; at 600–800 m elevation — in the second half of April or early May. Mating runs from late March to mid-May (in Georgia often in May–June). It is ovoviviparous: in autumn, in August–September, it bears 5–10 young. It hibernates on the coast from November, and at higher elevation from late September or early October.",
    conservation:
      "Classified as Endangered on the IUCN Red List; the population is declining. It is listed in Georgia's Red List and Appendix II of the Bern Convention (strictly protected). Major threats include habitat destruction (tourism, urbanization, agriculture, dams in Turkey), illegal collection for the pet trade, and deliberate or accidental killing by humans. Some coastal populations have already disappeared.",
    stats: [
      { label: "Habitat", value: "Western Caucasus" },
      { label: "Length", value: "approx. 45–65 cm" },
      { label: "Venom", value: "Venomous" },
      { label: "Conservation", value: "Endangered (EN)" },
      { label: "Elevation", value: "0–1,000 m" },
      { label: "Family", value: "Viperidae" },
    ],
    facts: [
      "Named in honor of Russian naturalist Alexander Nikolaevich Kaznakov.",
      "Red and orange dominate its coloration; melanism is common, though a red or yellow tint remains around the mouth.",
      "It is ovoviviparous — it bears 5–10 young in autumn; the loss of the mother therefore destroys the entire brood.",
      "IUCN status — Endangered; it is listed in Georgia's Red List.",
    ],
    faq: [
      {
        question: "Is the Caucasus viper dangerous to humans?",
        answer:
          "It is venomous, and its danger level is rated moderate. It is secretive and does not attack unless it feels threatened; bites are rare. Immediate medical attention is required in the event of a bite.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "In western Georgia — in Abkhazia, Adjara, Guria, and Imereti; also in the Borjomi gorge (Banistskali basin). It inhabits humid Colchic forests, ravines, and meadows.",
      },
      {
        question: "How does it differ from Dinnik's viper?",
        answer:
          "The Caucasus viper lives at lower elevations (mainly 0–1,000 m), inhabits humid Colchic forest, and is distinguished by its red-orange coloration. Dinnik's viper is a high-mountain species (approx. 1,500–2,800 m) found in the subalpine zone of the Greater Caucasus.",
      },
      {
        question: "Why is it endangered?",
        answer:
          "Its range is narrow and the population is declining. Habitat is being destroyed by tourism, urbanization, and agriculture; illegal collection and killing by humans are additional threats. Some coastal populations have already disappeared.",
      },
      {
        question: "Does it give live birth or lay eggs?",
        answer:
          "It is ovoviviparous. Mating occurs in spring; in autumn, in August–September, it bears 5–10 young.",
      },
    ],
  },
  "vipera-ammodytes": {
    commonName: "Nose-horned viper",
    location: "Lesser Caucasus",
    description:
      "One of Europe's most dangerous vipers, with a horn-like growth on its snout; rare in Georgia.",
    overview:
      "The nose-horned viper (Vipera ammodytes) is a venomous species of the viper family, known for the horn-like growth on its snout. It is distributed across southern and central Europe, the Balkans, and Asia Minor. In Georgia the Transcaucasian form occurs (often referred to as V. a. transcaucasiana or Vipera transcaucasiana) — in the Meskheti and Trialeti ranges, the upper Mtkvari basin, and around Akhalkalaki, up to roughly 1,700 m. It is classified as Least Concern globally by the IUCN, though it is rare in Georgia and listed in the Red Data Book.",
    habitat:
      "It prefers dry, rocky slopes with sparse vegetation — stony ground, scrub, forest edges, stone walls, and vineyards. In Georgia — in the mountains of the Lesser Caucasus: Meskheti, Trialeti, the upper Mtkvari basin, and the area around Akhalkalaki; vertically up to roughly 1,700 m. In southern Europe it is sometimes found up to 2,000 m.",
    diet: "It feeds on rodents, small birds, and lizards. Juveniles hunt mainly small lizards. It hunts by ambush and subdues prey with venom.",
    behavior:
      "Active during the warm season. In spring and autumn it is often active by day; in summer heat activity shifts to evening and the first half of the night. It hibernates in rock crevices and under stones. It is ovoviviparous: mating usually occurs in March–April; young are born in late summer or early autumn.",
    conservation:
      "Classified as Least Concern on the IUCN Red List. It is a rare species in Georgia and is listed in the Red Data Book; populations are fragmented. Threats include habitat conversion, persecution by humans, and local pressure. It benefits the ecosystem by controlling rodents.",
    stats: [
      { label: "Habitat", value: "Lesser Caucasus" },
      { label: "Length", value: "approx. 60–85 cm" },
      { label: "Venom", value: "Highly dangerous" },
      { label: "Conservation", value: "Least Concern (LC)" },
      { label: "Elevation", value: "0–1,700 m" },
      { label: "Family", value: "Viperidae" },
    ],
    facts: [
      "It has a horn-like growth on its snout made of 9–20 small scales — the source of the name \"nose-horned.\"",
      "It is considered one of Europe's most dangerous vipers, due to its large size, long fangs, and potent venom.",
      "Its venom contains hemotoxic components and presynaptic neurotoxins (ammodytoxins).",
      "It is rare in Georgia and listed in the Red Data Book; found in the Meskheti-Trialeti highlands.",
    ],
    faq: [
      {
        question: "How dangerous is a nose-horned viper's bite?",
        answer:
          "Very dangerous. The species is considered one of Europe's most dangerous vipers — due to its long fangs and potent venom, which combines hemotoxic and neurotoxic effects. Immediate medical attention is required in the event of a bite.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "In the mountains of the Lesser Caucasus — the Meskheti and Trialeti ranges, the upper Mtkvari basin, and the area around Akhalkalaki. Vertically up to roughly 1,700 m. It is a rare species.",
      },
      {
        question: "How does it differ from Dinnik's viper and the Levantine viper?",
        answer:
          "The nose-horned viper has a horn-like growth on its snout. Dinnik's viper is smaller and a high-mountain endemic of the Greater Caucasus. The Levantine viper is larger, egg-laying, and found in the dry lowlands of eastern Georgia.",
      },
      {
        question: "Does it give live birth or lay eggs?",
        answer:
          "It is ovoviviparous — young are born in late summer or early autumn. Mating usually occurs in March–April.",
      },
      {
        question: "Why is it protected in Georgia?",
        answer:
          "Its global IUCN status is Least Concern, but it is rare in Georgia, its populations are fragmented, and it is listed in the Red Data Book. Major threats include habitat conversion and human pressure.",
      },
    ],
  },
  "pseudopus-apodus": {
    commonName: "European glass lizard",
    location: "Georgia — almost everywhere",
    description:
      "A legless lizard often mistaken for a snake — with eyelids, ear openings, and a lateral fold; harmless.",
    overview:
      "The European glass lizard (Pseudopus apodus) is a large legless lizard of the anguid family — not a snake. It is distributed from southeastern Europe to Central Asia; in Georgia it occurs almost everywhere — in fields, open woodland, gardens, and village yards, from sea level up to roughly 2,000 m. The nominate subspecies P. a. apodus inhabits the Caucasus. It is classified as Least Concern by the IUCN.",
    habitat:
      "It prefers open and semi-open terrain — short grassy cover, sparsely wooded slopes, scrub, rocky ground, and river valleys; it often appears in gardens and near settlements. It is widespread in Georgia and ranges up to roughly 2,000 m elevation. Within its microhabitat it seeks places where sun and shade lie close together.",
    diet: "It feeds on invertebrates — especially snails and slugs, as well as insects and other arthropods; occasionally small lizards, eggs, and small mammals. Its powerful jaws make it easy to crack snail shells. It is more active while hunting in wet weather.",
    behavior:
      "It is active by day. It is often mistaken for a snake, though it has movable eyelids, external ear openings, and a deep skin fold along its side (a lateral groove); vestigial hind limbs are sometimes visible near the cloaca. When threatened it hisses, bites, or releases a secretion; tail autotomy is possible but rarer than in other \"glass lizards\" — hence the name glass lizard. It is egg-laying: it lays roughly 8–10 eggs (in Georgia often in June–July); young hatch in roughly 45–55 days.",
    conservation:
      "Classified as Least Concern on the IUCN Red List; the population is assessed as stable. It is not listed in Georgia's Red List. Local threats include habitat conversion and killing due to confusion with snakes. It is beneficial to agriculture — it reduces harmful insects and mollusks.",
    stats: [
      { label: "Habitat", value: "Georgia — widespread" },
      { label: "Length", value: "approx. 1–1.35 m" },
      { label: "Venom", value: "None — harmless" },
      { label: "Conservation", value: "Least Concern (LC)" },
      { label: "Elevation", value: "0–2,000 m" },
      { label: "Family", value: "Anguidae" },
    ],
    facts: [
      "It is not a snake — it is a legless lizard: it has eyelids, ear openings, and a lateral skin fold.",
      "The name Pseudopus apodus comes from Greek and roughly means \"false-footed\" or \"footless\"; the English name sheltopusik comes from the Russian for \"yellow-belly\" (желтопузик).",
      "It occurs almost everywhere in Georgia and sometimes ranges up to 2,000 m elevation.",
      "Its favorite food is snails and slugs — so it is seen more often in wet weather.",
    ],
    faq: [
      {
        question: "Is the European glass lizard a snake or a lizard?",
        answer:
          "It is a lizard. Unlike a snake, it has movable eyelids, external ear openings, and a deep skin fold along its side; vestigial hind limbs are sometimes visible near the cloaca.",
      },
      {
        question: "Is it dangerous to humans?",
        answer:
          "It is harmless — it has no venom. When threatened it may hiss or bite, but it poses no danger to humans. It is beneficial: it reduces harmful insects and mollusks.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "Almost everywhere — in fields, open woodland, gardens, and sometimes village yards. Vertically it ranges up to roughly 2,000 meters.",
      },
      {
        question: "Why is it called a \"glass lizard\"?",
        answer:
          "Because of tail autotomy — the tail can break off and shatter into pieces, which fueled an old myth that the animal shatters like glass. The tail regrows slowly, though it often stays shorter and darker.",
      },
      {
        question: "Does it lay eggs or give live birth?",
        answer:
          "It is egg-laying. It usually lays roughly 8–10 eggs (in Georgia often in June–July); young hatch in roughly 45–55 days.",
      },
    ],
  },
  "coronella-austriaca": {
    commonName: "Smooth snake",
    location: "Georgia — foothills and mountains",
    description:
      "A harmless colubrid snake with copper-toned coloring — secretive, smooth-scaled, and often confused with a viper.",
    overview:
      "The smooth snake (Coronella austriaca) is a harmless snake of the colubrid family. It is distributed from Europe to western Asia — including Turkey, Georgia, Armenia, Azerbaijan, and northern Iran. In Georgia it occurs in the foothills, forest, subalpine, and alpine zones; it prefers relatively dry terrain. Its name comes from its coppery or reddish coloration. It is classified as Least Concern by the IUCN.",
    habitat:
      "It inhabits open woodland, forest edges, scrub, rocky slopes, meadows, and the subalpine-alpine zone. In Georgia — from the foothills to the high mountains. It hides in burrows, under stones and logs, often in sun-warmed rocky spots. It avoids open, damp lowlands and marshes.",
    diet: "It feeds mainly on lizards; also rodents, insects, lizard eggs, and occasionally other small snakes. It pins and constricts larger prey with coils of its body — not a true constrictor, but constriction is an important part of its hunting.",
    behavior:
      "It is a secretive, diurnal snake. Its coloring and head pattern often resemble a viper's, though its scales are smooth (not keeled), its pupil is round, and a crown-like dark pattern is often visible on its head — the source of the genus name Coronella. It is ovoviviparous: young are born live, usually 2–15 individuals. Adult length is roughly 60–80 cm.",
    conservation:
      "Classified as Least Concern on the IUCN Red List. In Europe it is protected under the Bern Convention and the Habitats Directive. Local threats include habitat conversion and killing due to confusion with vipers. It benefits the ecosystem by regulating lizard and rodent numbers.",
    stats: [
      { label: "Habitat", value: "Foothills–alpine zone" },
      { label: "Length", value: "approx. 60–80 cm" },
      { label: "Venom", value: "None — harmless" },
      { label: "Conservation", value: "Least Concern (LC)" },
      { label: "Reproduction", value: "Ovoviviparous" },
      { label: "Family", value: "Colubridae" },
    ],
    facts: [
      "The name \"smooth snake\" refers to its smooth scales; its coppery or reddish coloring gave rise to its Georgian name.",
      "It is not venomous, though its head pattern and coloring often resemble a viper's — so it is sometimes killed without cause.",
      "It is ovoviviparous: young are born live, usually 2–15 individuals.",
      "The genus name Coronella means \"little crown\" in Latin — a crown-like dark pattern is often visible on its head.",
    ],
    faq: [
      {
        question: "Is the smooth snake dangerous to humans?",
        answer:
          "It is harmless — it has no venom. It may bite if caught or threatened, but it poses no danger to humans.",
      },
      {
        question: "How does it differ from a viper?",
        answer:
          "The smooth snake has smooth scales, a round pupil, and often a crown-like pattern on its head. A viper has keeled scales, a vertically slit pupil, and often a zigzag stripe along its back.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "In the foothills, forest, subalpine, and alpine zones — in relatively dry, stony, scrubby terrain. It hides in burrows, under stones and logs.",
      },
      {
        question: "What does it eat?",
        answer:
          "Mainly lizards; also rodents, insects, and occasionally other small snakes. It pins larger prey with coils of its body.",
      },
      {
        question: "Does it lay eggs or give live birth?",
        answer:
          "It is ovoviviparous — young are born live, usually 2–15 individuals.",
      },
    ],
  },
  "elaphe-urartica": {
    commonName: "Urartian ratsnake",
    location: "Eastern Georgia",
    description:
      "A harmless spotted ratsnake — described as a species in 2019; native to Kakheti and the dry landscapes of eastern Georgia.",
    overview:
      "The Urartian ratsnake (Elaphe urartica) is a harmless, non-venomous ratsnake of the family Colubridae. It was split from Elaphe sauromates as a cryptic species in 2019 — its name references the ancient kingdom of Urartu (the Armenian Highland, around Lake Van). It is distributed across eastern Anatolia, Georgia, Armenia, Azerbaijan, northern Iran, and Dagestan; in Georgia — in the east, from the Alazani plain to the southeast (including the Tbilisi area and Kakheti). Its length is usually up to 1.2 m.",
    habitat:
      "It is a eurytopic species: it inhabits mountain and lowland semi-deserts, steppes, semi-tropical forest-steppe, open juniper woodland, mountain broadleaf forest, and alpine meadows. Vertically it occurs from roughly −25 m (Lankaran) up to 2,600 m (Shiraki, Armenia). In Georgia its range covers eastern Transcaucasia — from southeastern Georgia west almost to Trialeti / toward Surami.",
    diet: "It feeds on rodents, small birds, nestlings, and bird eggs; occasionally lizards too. It is a good climber — it often climbs shrubs and trees to raid nests. It kills prey by constriction; it has no venom.",
    behavior:
      "It is active by day. It is calm and cautious — when threatened it prefers to flee. Its head is relatively large, its snout profile often slightly upturned; its back bears 50–65 rounded brown or black blotches on a yellowish or whitish background, with a dark crown. It is egg-laying: mating occurs in spring, and the female lays several eggs (roughly 4–16, depending on her size); young hatch independently.",
    conservation:
      "It was described in 2019 and has not yet been separately assessed on the IUCN Red List. Its range is broad and the species is eurytopic; the similar species E. sauromates is assessed globally as Least Concern. Local threats include habitat conversion, road mortality, and killing due to confusion with venomous snakes. It benefits the ecosystem by reducing rodent numbers.",
    stats: [
      { label: "Habitat", value: "Eastern Georgia" },
      { label: "Length", value: "approx. 0.8–1.2 m" },
      { label: "Venom", value: "None — harmless" },
      { label: "Conservation", value: "Not evaluated" },
      { label: "Elevation", value: "−25–2,600 m" },
      { label: "Family", value: "Colubridae" },
    ],
    facts: [
      "Named in honor of the ancient kingdom of Urartu — the species was described in 2019 (Jablonski et al.).",
      "It was formerly confused with the four-lined/spotted ratsnake (Elaphe sauromates); the Caucasus and eastern Anatolia populations are now recognized as a separate species.",
      "It has no venom — it kills prey by constriction; it is harmless to humans.",
      "In Georgia it has been confirmed in Kakheti, the Dedoplistsqaro municipality, and around Tbilisi.",
    ],
    faq: [
      {
        question: "Is the Urartian ratsnake dangerous to humans?",
        answer:
          "No — it is harmless. It has no venom and kills prey only by constriction. When threatened it prefers to flee; it does not attack humans.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "In eastern Georgia — in Kakheti (the Alazani plain, Dedoplistsqaro, Lagodekhi), around Tbilisi, and in the dry zone of the southeast. Its range is described extending west almost to Trialeti / toward Surami.",
      },
      {
        question: "How does it differ from Elaphe sauromates?",
        answer:
          "It looks very similar — it is a cryptic species. The difference is mainly genetic and geographic: E. urartica occurs in the Caucasus and eastern Anatolia, while E. sauromates occurs farther west (the Balkans, western/central Anatolia, the Pontic-Caspian steppes).",
      },
      {
        question: "What does it eat?",
        answer:
          "Rodents, small birds, nestlings, and eggs; occasionally lizards. It climbs trees and shrubs well to raid nests.",
      },
      {
        question: "Does it lay eggs or give live birth?",
        answer:
          "It is egg-laying. Mating occurs in spring; the female lays several eggs (usually roughly 4–16). Young hatch independently.",
      },
    ],
  },
  "natrix-tessellata": {
    commonName: "Dice snake",
    location: "Georgia — near water",
    description:
      "A non-venomous, semi-aquatic snake with checkered blotches — an inhabitant of rivers, lakes, and shorelines; harmless.",
    overview:
      "The dice snake (Natrix tessellata) is a non-venomous, semi-aquatic snake of the family Colubridae. It is distributed across much of central and eastern Eurasia — from Italy and the Czech Republic to Kyrgyzstan, and from Ukraine to Iran. It is widespread in Georgia and occupies nearly every available water habitat; vertically it occurs from roughly 0–600 m in the west and up to 900 m in the east, rarely to 1,100 m. Its back bears a \"dice-like\" pattern of dark square blotches, and its belly is often yellow or orange with black spots — the source of the English name dice snake. It is classified as Least Concern by the IUCN.",
    habitat:
      "It is closely tied to water: rivers, streams, lakes, ponds, and sometimes coastal and muddy areas, including agricultural and altered landscapes. In Georgia it is more common in semi-arid regions than the grass snake (Natrix natrix), which favors damper habitats. It often basks or swims near the shore, on rocks, and on branches overhanging the water.",
    diet: "It feeds mainly on fish; also amphibians — frogs, toads, and tadpoles. It swallows prey alive. It hunts in the water and along the shore; it is one of the most water-loving snakes in Europe.",
    behavior:
      "Active during the warm season; it hibernates from October to April in dry burrows and crevices near water. Mating usually occurs in March–May — at this time individuals may gather in groups. It is egg-laying: in July it lays roughly 10–30 eggs in a moist spot (soil, decaying vegetation, stone walls); young hatch in early September. When threatened it releases a foul-smelling secretion from the cloaca or feigns death (thanatosis).",
    conservation:
      "Classified as Least Concern on the IUCN Red List. It is widespread in Georgia and locally common. It is assessed as stable globally, though in some regions (e.g., the Czech Republic — critically endangered) habitat destruction, pollution, and invasive predators are reducing local populations.",
    stats: [
      { label: "Habitat", value: "Rivers, lakes" },
      { label: "Length", value: "approx. 1–1.3 m" },
      { label: "Venom", value: "None — harmless" },
      { label: "Conservation", value: "Least Concern (LC)" },
      { label: "Elevation", value: "0–1,100 m" },
      { label: "Family", value: "Colubridae" },
    ],
    facts: [
      "It is non-venomous and harmless to humans; when threatened it releases a foul-smelling secretion or \"plays dead.\"",
      "The black spots on its belly resemble dice pips — the source of the English name dice snake.",
      "It is widespread in Georgia and found in almost every type of water habitat.",
      "Most of its diet is fish; it also catches amphibians — one of the most water-loving snakes in the region.",
    ],
    faq: [
      {
        question: "Is the dice snake dangerous to humans?",
        answer:
          "No — it is non-venomous and harmless to humans. When threatened it may release a foul-smelling secretion or \"play dead,\" but it poses no real danger.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "Almost throughout the country — near rivers, lakes, streams, and other water habitats. In the west typically up to 600 m, in the east up to 900 m; rarely noted up to 1,100 m.",
      },
      {
        question: "How does it differ from the grass snake?",
        answer:
          "The dice snake has checkered, dice-like blotches and is more tightly bound to water; in Georgia it is more common in semi-arid areas. The grass snake (Natrix natrix) often has a yellow \"collar\" behind its head and prefers damper habitats.",
      },
      {
        question: "What does it eat?",
        answer:
          "Mainly fish; also frogs, toads, and tadpoles. It swallows prey alive and often hunts in the water.",
      },
      {
        question: "Does it lay eggs or give live birth?",
        answer:
          "It is egg-laying. Mating occurs in March–May; in July it lays roughly 10–30 eggs, and young hatch in early September.",
      },
    ],
  },
  "dolichophis-schmidti": {
    commonName: "Red-bellied racer",
    location: "Eastern Georgia",
    description:
      "A fast, non-venomous racer with a copper or reddish back and a distinctive red–orange belly — native to the dry landscapes of eastern Georgia.",
    overview:
      "The red-bellied racer (Dolichophis schmidti), also called Schmidt's whip snake, is a non-venomous, fast species of the family Colubridae. It was described in 1909 by A. Nikolsky; the name honors Russian ichthyologist Petr Yulevich Schmidt. It occurs across the Caucasus and the Middle East — from Dagestan to Turkmenistan, and south into Syria, Jordan, and northern Iran; in Georgia mainly in dry, rocky, and grassy habitats of the east. Adults are often a uniform copper or reddish-brown, with a red or orange belly; juveniles have a dark-spotted dorsal pattern. Length is usually up to about 1–1.5 m (roughly 82–158 cm has been recorded in Georgia). It is classified as Least Concern by the IUCN.",
    habitat:
      "It is eurytopic: it inhabits rocky and stony riverbanks, deserts and semi-deserts, rocky outcrops and hillsides, montane steppe, cultivated fields, gardens, and vineyards — from sea level to roughly 2,000 m. It can occur near human habitation and uses anthropogenic structures. In Georgia it depends on a relatively dry climate and is found mainly in the rocky–grassy landscapes of the east.",
    diet: "It is often observed near large rodent colonies, on which it primarily preys; it also feeds on lizards, birds, and other snakes. It is a fast pursuer and actively chases prey; it has no venom.",
    behavior:
      "It is diurnal — a fast, agile racer. When threatened it prefers to flee, though if cornered it may defend itself aggressively; it remains harmless to humans. Adults often have a uniform reddish dorsum, while juveniles are spotted; the distinctive red–orange belly gives the species its name and helps separate it from the Caspian whip snake (Dolichophis caspius). It is egg-laying: females lay roughly 5–11 eggs. In Georgia, large communal wintering in anthropogenic shelters has been documented — more than a hundred individuals in a single hibernaculum.",
    conservation:
      "Classified as Least Concern on the IUCN Red List; it also holds LC status in Georgia. Its range is broad and the species tolerates human-altered landscapes. Local threats include habitat conversion, road mortality, and killing due to confusion with venomous snakes. It benefits the ecosystem by reducing rodent numbers.",
    stats: [
      { label: "Habitat", value: "Eastern Georgia" },
      { label: "Length", value: "approx. 1–1.5 m" },
      { label: "Venom", value: "None — harmless" },
      { label: "Conservation", value: "Least Concern (LC)" },
      { label: "Elevation", value: "0–2,000 m" },
      { label: "Family", value: "Colubridae" },
    ],
    facts: [
      "Named in honor of Russian ichthyologist Petr Yulevich Schmidt; the species was described by A. Nikolsky in 1909.",
      "The red–orange belly is the main identification trait and distinguishes it from the Caspian whip snake.",
      "It is non-venomous and harmless to humans — despite its speed and defensive behavior.",
      "One of the largest winter aggregations in Georgia was recorded for this species — over 100 individuals in a single shelter.",
    ],
    faq: [
      {
        question: "Is the red-bellied racer dangerous to humans?",
        answer:
          "No — it is non-venomous and harmless to humans. It is fast and prefers to flee when threatened; if cornered it may defend itself, but it poses no real danger.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "Mainly in the dry, rocky, and grassy landscapes of eastern Georgia — steppes, rocky slopes, vineyards, and near settlements. Vertically it occurs from sea level to roughly 2,000 m.",
      },
      {
        question: "How does it differ from the Caspian whip snake?",
        answer:
          "The red-bellied racer has a distinctive red or orange belly; adults are often copper/reddish. The Caspian whip snake (Dolichophis caspius) has different belly coloration and is treated as a separate species in Georgia.",
      },
      {
        question: "What does it eat?",
        answer:
          "Mainly rodents — it often hunts near their colonies; also lizards, birds, and other snakes. It has no venom — it catches prey with speed and force.",
      },
      {
        question: "Does it lay eggs or give live birth?",
        answer:
          "It is egg-laying. The female lays roughly 5–11 eggs; young hatch independently.",
      },
    ],
  },
  "hogna-radiata": {
    commonName: "Radiated wolf spider",
    location: "Georgia and the Caucasus",
    description:
      "A large, day-active wolf spider — a hunter of dry grassy and steppe habitats; harmless to humans.",
    overview:
      "The radiated wolf spider (Hogna radiata) is a large species of the family Lycosidae — also called the false tarantula; it was described by Latreille in 1817. It occurs across southern and central Europe, Turkey, the Caucasus, Russia (Europe to southern Siberia), the Middle East, Iran, and Central Asia; it is documented in Georgia (including Mcheidze's catalogues and Caucasian arachnological records). The carapace has a broad pale median band with radiating lines — the source of the name radiata. Females measure roughly 12.5–25 mm in body length, males 9–18 mm. It does not build a hunting web — it actively pursues prey. It is medically insignificant to humans.",
    habitat:
      "It prefers warm, dry habitats: steppes, dry grasslands, open woods, rocky and sandy ground, and parks. Its northern limit reaches the southern edge of the Alps. In Georgia and the Caucasus it occurs in dry and semi-arid landscapes — grassy areas and open spaces.",
    diet: "It is an active pursuer: it hunts small insects and other invertebrates, usually prey less than about 20% of its own size. It does not catch with a web — it moves through grass and on the ground and seizes prey by sight and speed.",
    behavior:
      "It is diurnal. Mating occurs in autumn; the female then digs a shallow retreat where she constructs an egg case. The young leave the egg case in December, spend the winter with their mother, and disperse in April–May — carrying spiderlings on the back is typical of wolf spiders. It does not build a permanent burrow (unlike some Lycosa); it uses temporary shelter for molting and egg-laying. Taxonomically the Hogna radiata complex needs revision — the name has been applied to distinct populations across a wide range.",
    conservation:
      "It is widely distributed globally and common in the Mediterranean and Caucasus; a separate IUCN assessment is not widely applied. Local threats include habitat conversion and needless killing out of fear. It benefits ecosystems as an insect predator.",
    stats: [
      { label: "Habitat", value: "Dry steppe, grass" },
      { label: "Length", value: "approx. 9–25 mm" },
      { label: "Venom", value: "Mild — harmless" },
      { label: "Conservation", value: "Not evaluated" },
      { label: "Activity", value: "Diurnal" },
      { label: "Family", value: "Lycosidae" },
    ],
    facts: [
      "The name radiata refers to the radiating pattern on the carapace — lines extending from a pale median band.",
      "It is a wolf spider: it does not hunt with a web, actively pursues prey; the mother carries spiderlings on her back.",
      "Documented in Georgia and the Caucasus — a resident of dry, warm habitats.",
      "Medically insignificant to humans; bites are rare and usually cause only mild local reaction.",
    ],
    faq: [
      {
        question: "Is the radiated wolf spider dangerous to humans?",
        answer:
          "No — it is harmless to humans. It has venom for hunting insects, but it is not medically significant; bites are rare and usually cause only mild discomfort similar to a bee sting.",
      },
      {
        question: "Where is it found in Georgia?",
        answer:
          "In dry and semi-arid places — steppes, grasslands, and open landscapes. The species is documented for Georgia and the wider Caucasus in arachnological catalogues.",
      },
      {
        question: "Why is it called a \"false tarantula\"?",
        answer:
          "Because of its size and appearance it is sometimes called false tarantula, but it does not belong to true tarantulas (Theraphosidae) — it is a member of the wolf spider family (Lycosidae).",
      },
      {
        question: "What does it eat and how does it hunt?",
        answer:
          "Small insects and other invertebrates. It does not build a hunting web — it moves by day and catches prey with speed and vision.",
      },
      {
        question: "How does it reproduce?",
        answer:
          "Mating is in autumn. The female builds an egg case in a shallow retreat; the young spend winter with the mother (often on her back) and disperse in spring.",
      },
    ],
  },
  komodo: {
    commonName: "Komodo dragon",
    location: "Lesser Sunda Islands",
    description: "The largest living lizard — a solitary hunter in dry savanna.",
    overview:
      "The Komodo dragon is the largest living lizard on Earth. It lives on a handful of Indonesian islands and is known for its strength, patience, and venomous bite.",
    habitat:
      "Distributed on the islands of Komodo, Rinca, Flores, and Gili Motang. It lives in dry forests, savanna, and coastal lowlands.",
    diet: "It feeds on deer, wild boar, birds, and carrion. Juveniles often live in trees and feed on insects.",
    behavior:
      "It is a solitary predator. It hunts by ambush and can wait for prey for hours. It is territorial, especially during the breeding season.",
    conservation:
      "Classified as Vulnerable by the IUCN. Threats include habitat loss, conflict with humans, and climate change.",
    stats: [
      { label: "Habitat", value: "Indonesian islands" },
      { label: "Length", value: "2–3 m" },
      { label: "Venom", value: "High" },
      { label: "Conservation", value: "Vulnerable" },
      { label: "Weight", value: "70–90 kg" },
      { label: "Family", value: "Varanidae" },
    ],
    facts: [
      "It can detect the scent of prey from several kilometers away.",
      "Its bite delivers an anticoagulant venom.",
      "Juveniles live in trees to protect themselves from adults.",
    ],
  },
  anaconda: {
    commonName: "Green anaconda",
    location: "Amazon Basin",
    description: "The heaviest snake on Earth — an ambush predator in slow-moving waters.",
    overview:
      "The green anaconda is a giant snake of South America's tropical swamps and rivers. It is the heaviest snake on Earth and hunts by ambush in water.",
    habitat:
      "Distributed across the Amazon Basin, the Orinoco, and other tropical rivers. It prefers slow, murky waters and swamps.",
    diet: "It preys on fish, birds, caimans, and mammals. It kills prey by constriction and swallows it whole.",
    behavior:
      "It is primarily aquatic. It can remain motionless for hours awaiting prey near the surface, with only its nostrils above the water.",
    conservation:
      "It is currently widespread, though habitat destruction and hunting pose a threat in some regions.",
    stats: [
      { label: "Habitat", value: "Amazon Basin" },
      { label: "Length", value: "5–7 m" },
      { label: "Venom", value: "None" },
      { label: "Conservation", value: "Not evaluated" },
      { label: "Weight", value: "100–200 kg" },
      { label: "Family", value: "Boidae" },
    ],
    facts: [
      "It is the heaviest snake on Earth.",
      "It can stay submerged for several hours.",
      "It gives birth to live young — it does not lay eggs.",
    ],
  },
  chameleon: {
    commonName: "Panther chameleon",
    location: "Madagascar",
    description: "Its color change expresses mood and temperature, not just camouflage.",
    overview:
      "The panther chameleon is one of Madagascar's most colorful reptiles. Its color change reflects social signaling and physiological state.",
    habitat:
      "It lives in the coastal forests of eastern and northern Madagascar. It is often found in scrub and the lower canopy of trees.",
    diet: "It catches insects with its long, sticky tongue. It hunts visually — its eyes move independently.",
    behavior:
      "It is territorial. Males change color and inflate their bodies when facing off against each other. Its slow, swaying gait mimics the movement of a leaf.",
    conservation:
      "Wild populations are under pressure from habitat loss and trade, though it breeds widely in captivity.",
    stats: [
      { label: "Habitat", value: "Madagascar" },
      { label: "Length", value: "40–50 cm" },
      { label: "Venom", value: "None" },
      { label: "Conservation", value: "Not evaluated" },
      { label: "Lifespan", value: "3–6 years" },
      { label: "Family", value: "Chamaeleonidae" },
    ],
    facts: [
      "Its eyes cover a 360° range of vision.",
      "Its tongue is as long as its body.",
      "Its color reflects mood and temperature.",
    ],
  },
  frog: {
    commonName: "Dyeing poison dart frog",
    location: "Southern Suriname",
    description: "Its brightness is a warning: alkaloid toxins from its wild diet.",
    overview:
      "The dyeing poison dart frog is a small but dangerous amphibian of South America's tropical forests. Its bright color signals its toxicity to predators.",
    habitat:
      "It lives in the tropical forests of Suriname, French Guiana, and Brazil — on the moist leaf litter of the forest floor.",
    diet: "It catches ants, termites, and other small invertebrates, from which it derives its toxins.",
    behavior:
      "It is active by day. Males guard territory and keep eggs moist. In captivity its toxicity decreases as its diet changes.",
    conservation:
      "Some populations are threatened by habitat destruction. The wildlife trade is regulated under CITES.",
    stats: [
      { label: "Habitat", value: "Tropical forest" },
      { label: "Length", value: "3–5 cm" },
      { label: "Venom", value: "Moderate" },
      { label: "Conservation", value: "Least Concern" },
      { label: "Toxin", value: "Alkaloids" },
      { label: "Family", value: "Dendrobatidae" },
    ],
    facts: [
      "Its toxin comes from its wild diet, not its own body.",
      "Its bright color is aposematism — a warning signal.",
      "Males keep the eggs moist.",
    ],
  },
  turtle: {
    commonName: "Green sea turtle",
    location: "Tropical oceans",
    description: "It travels thousands of kilometers to return to the beach where it was born.",
    overview:
      "The green sea turtle is a migratory giant of the tropical oceans. It travels thousands of kilometers from feeding grounds to the beach where it was born.",
    habitat:
      "Distributed across the tropical and subtropical waters of the Atlantic, Pacific, and Indian Oceans. It nests on sandy beaches.",
    diet: "Adults feed mainly on seagrass and algae — the source of the name \"green.\"",
    behavior:
      "It navigates using Earth's magnetic field. Females return to the same beach every few years to lay eggs.",
    conservation:
      "Classified as Endangered by the IUCN. Major threats include entanglement in nets, plastic, coastal development, and climate change.",
    stats: [
      { label: "Habitat", value: "Tropical oceans" },
      { label: "Length", value: "1–1.5 m" },
      { label: "Venom", value: "None" },
      { label: "Conservation", value: "Endangered" },
      { label: "Weight", value: "110–190 kg" },
      { label: "Family", value: "Cheloniidae" },
    ],
    facts: [
      "It can migrate thousands of kilometers.",
      "It returns to the same beach where it was born.",
      "Adults are almost entirely herbivorous.",
    ],
  },
};
