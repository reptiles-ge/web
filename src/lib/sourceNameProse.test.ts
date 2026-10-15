import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  HALYOMORPHA_ANNOTATION_COPY,
  HALYOMORPHA_PEST_COPY,
} from "@/content/species/halyomorpha-halys/profileCopy";
import { routing } from "@/i18n/routing";
import {
  findSourceNames,
  findSourceNamesInFields,
} from "@/lib/sourceNameProse";

const CONTENT_ROOT = path.join(process.cwd(), "src/content/species");

function speciesFiles() {
  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      routing.locales.map((locale) =>
        path.join(CONTENT_ROOT, entry.name, `${locale}.mdx`),
      ),
    )
    .filter((file) => fs.existsSync(file));
}

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
  ])("flags %s", (text) => {
    expect(findSourceNames(text)).not.toEqual([]);
  });

  it.each([
    "IUCN lists it as Least Concern (2021).",
    "Georgia’s 2014 Red List: VU (2014).",
    "IUCN-ის მიხედვით სახეობა საფრთხის ქვეშ არ არის.",
    "Vipera ammodytes (Linnaeus, 1758)",
    "Martes foina (Erxleben, 1777)",
    "a single record from Vashlovani (1973)",
    "Bzifi Dağ Sırası (1984)",
    "Başı, kayalarda yaşayan Darevskia’ya göre daha az basıktır.",
    "Georgia’s 2026 checklist treats it as a candidate taxon.",
    "ზომის მიხედვით ძნელი გასარჩევია.",
  ])("allows %s", (text) => {
    expect(findSourceNames(text)).toEqual([]);
  });
});

describe("species profile prose names no sources", () => {
  const files = speciesFiles();

  it("scans every species locale file", () => {
    expect(files.length).toBeGreaterThanOrEqual(146 * routing.locales.length);
  });

  it.each(files.map((file) => [path.relative(CONTENT_ROOT, file), file]))(
    "%s",
    (_, file) => {
      const { content, data } = matter(fs.readFileSync(file, "utf8"));
      expect(findSourceNamesInFields({ ...data, body: content })).toEqual([]);
    },
  );

  it("keeps the Halyomorpha profile copy free of source names", () => {
    expect(
      findSourceNamesInFields({
        annotation: HALYOMORPHA_ANNOTATION_COPY,
        pest: HALYOMORPHA_PEST_COPY,
      }),
    ).toEqual([]);
  });
});
