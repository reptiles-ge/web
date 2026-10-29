import { describe, expect, it } from "vitest";

import {
  HALYOMORPHA_ANNOTATION_COPY,
  HALYOMORPHA_PEST_COPY,
} from "@/content/halyomorphaProfileCopy";
import { routing } from "@/i18n/routing";
import {
  findSourceNames,
  findSourceNamesInFields,
} from "@/lib/sourceNameProse";

import {
  catalogSpeciesFixture,
  localizedFixture,
} from "../../tests/fixtures/speciesCatalog";

describe("findSourceNames", () => {
  it.each([
    "Tarkhnishvili et al. 2026 პირდაპირ წერს",
    "The source is Bakradze and Darevsky (1973).",
    "Abuladze (2011) and NPLG assign Caucasus birds",
    "SABUKO lists the Georgian name ბუკიოტი",
    "NFA notes that in a strong outbreak",
    "Bukhnikashvili and Kandaurov 2002 give",
    "according to Abuladze lives in Georgia",
    "AmphibiaWeb-ის მიხედვით",
    "NACRES 2022 წერს",
    "Abuladze’ye göre",
    "Tarkhnishvili ve ark. 2026",
    "Банникова и др. показали",
    "Tarkhnishvili და სხვ. 2002",
    "Tarkhnishvili და სხვების 2026 წლის ნაშრომში",
    "Askerov და თანაავტორები",
    "Lovari and co-authors",
    "Тархнишвили и соавторов",
    "Arribas ve ortak yazarları",
    "females are typically heavier than males (Owl Pages).",
    "Wingspan is often about 1.5–1.8 m (Peregrine Fund).",
    "The 2024 annotated checklist of the birds of Georgia codes it YR-R.",
    "2024 წლის საქართველოს ფრინველების ანოტირებული ჩამონათვალი მას კოდავს",
    "Аннотированный чек-лист птиц Грузии 2024 года",
    "Gürcistan kuşlarının 2024 açıklamalı kontrol listesi",
    "It is a confirmed breeding bird and migrant (BB; M).",
    "Seasonality is classed as high-quality (code A).",
    "Occurrence quality is high (H), with photographs.",
    "სეზონურობის მონაცემი მაღალი ხარისხისაა (კოდი A).",
    "Качество встречаемости высокое (H), есть фотографии.",
    "Mevsimsellik yüksek kalite (kod A) olarak sınıflanır.",
    "Shikra (Accipiter badius) is casual (Cas) on the checklist.",
    "IUCN lists it as Least Concern (2021).",
    "IUCN lists the grey wolf as native to Georgia.",
    "IUCN has not assessed the species.",
    "According to the IUCN, the species is of Least Concern.",
    "IUCN-ის მიხედვით სახეობა საფრთხის ქვეშ არ არის.",
    "IUCN-ის 2022 წლის გლობალური შეფასებით წავი საფრთხესთან ახლოსაა.",
    "IUCN სახეობას გლობალურად ნაკლებად საფრთხის ქვეშ აფასებს.",
    "IUCN-ს სახეობა შეფასებული არ აქვს.",
    "МСОП относит вид к Least Concern.",
    "По оценке МСОП вид относится к Least Concern.",
    "МСОП глобально не оценивал этот вид.",
    "IUCN’ye göre tür Least Concern kategorisindedir.",
    "IUCN türü Least Concern olarak listeler.",
    "IUCN türü değerlendirmemiştir.",
    "According to 2024 data, it breeds in Georgia.",
    "2024 წლის მონაცემებით საქართველოში ბუდობს.",
    "По данным на 2026 год, присутствие гюрзы в Грузии подтверждено.",
    "2026 verilerine göre Levant engereğinin Gürcistan'da yaşadığı doğrulanmıştır.",
  ])("flags %s", (text) => {
    expect(findSourceNames(text)).not.toEqual([]);
  });

  it.each([
    "On the IUCN Red List it is Least Concern (2021).",
    "Georgia’s 2014 Red List: VU (2014).",
    "IUCN-ის წითელ ნუსხაში მოწყვლადია (2009).",
    "В Красном списке МСОП оценён как Least Concern.",
    "В Красном списке МСОП вид глобально относится к Least Concern.",
    "IUCN Kırmızı Listesi’nde Least Concern olarak değerlendirilir.",
    "IUCN category: NE; a 2021 national assessment gives LC.",
    "VU (GE) / NT (IUCN)",
    "Argiope bruennichi has not been assessed by the IUCN.",
    "IUCN'un 2016 değerlendirmesinde Avrupa porsuğu Least Concern'dir.",
    "IUCN değerlendirmesi onu ayrı bir tür olarak listeler.",
    "As of 2024, it breeds in Georgia.",
    "2024 data confirm that it breeds in Georgia.",
    "На 2026 год присутствие гюрзы в Грузии подтверждено.",
    "Avrupa verilerine göre erginler yazın görünür.",
    "Vipera ammodytes (Linnaeus, 1758)",
    "Martes foina (Erxleben, 1777)",
    "a single record from Vashlovani (1973)",
    "Bzifi Dağ Sırası (1984)",
    "Başı, kayalarda yaşayan Darevskia’ya göre daha az basıktır.",
    "Georgia’s 2026 checklist treats it as a candidate taxon.",
    "ზომის მიხედვით ძნელი გასარჩევია.",
    "It breeds here and passes through on migration, and it is absent in winter.",
    "In Georgia it is a breeding resident, confirmed by photographs.",
    "In the EU it is listed in Annex II of the Birds Directive (code A376).",
    "The 2024 checklist assigns LC globally and nationally.",
  ])("allows %s", (text) => {
    expect(findSourceNames(text)).toEqual([]);
  });
});

describe("species profile prose names no sources", () => {
  const profiles = catalogSpeciesFixture().flatMap((species) =>
    routing.locales.map(
      (locale) =>
        [`${species.id}/${locale}`, localizedFixture(species, locale)] as const,
    ),
  );

  it("scans every published species in every locale", () => {
    expect(profiles.length).toBeGreaterThanOrEqual(
      145 * routing.locales.length,
    );
  });

  it.each(profiles)("%s", (_, profile) => {
    expect(findSourceNamesInFields(profile)).toEqual([]);
  });

  it("keeps the Halyomorpha profile copy free of source names", () => {
    expect(
      findSourceNamesInFields({
        annotation: HALYOMORPHA_ANNOTATION_COPY,
        pest: HALYOMORPHA_PEST_COPY,
      }),
    ).toEqual([]);
  });
});
