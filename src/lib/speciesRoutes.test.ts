import { describe, expect, it } from "vitest";

import {
  getSpeciesPublicSlug,
  resolveSpeciesId,
  speciesHref,
} from "@/lib/speciesRoutes";
import { resolveSpeciesIdInHub } from "@/lib/speciesSlugTable";
import { speciesStaticParams } from "@/lib/speciesStaticParams";

import { lookalikesFixture } from "../../tests/fixtures/speciesCatalog";

describe("species routes", () => {
  it("uses KA slug overrides for public URLs", () => {
    expect(getSpeciesPublicSlug("macrovipera-lebetina", "ka")).toBe("giurza");
    expect(getSpeciesPublicSlug("paralaudakia-caucasia", "ka")).toBe("jojo");
    expect(getSpeciesPublicSlug("pseudopus-apodus", "ka")).toBe("gvelxokera");
  });

  it("keeps scientific folder ids for English", () => {
    expect(getSpeciesPublicSlug("macrovipera-lebetina", "en")).toBe(
      "macrovipera-lebetina",
    );
  });

  it("resolves KA aliases and ids to the same taxon", () => {
    expect(resolveSpeciesId("giurza")).toBe("macrovipera-lebetina");
    expect(resolveSpeciesId("macrovipera-lebetina")).toBe(
      "macrovipera-lebetina",
    );
    expect(resolveSpeciesIdInHub("snakes", "giurza")).toBe(
      "macrovipera-lebetina",
    );
  });

  it("does not resolve a reserved hub slug as a species", () => {
    expect(resolveSpeciesIdInHub("snakes", "saxeoebebi")).toBeUndefined();
    expect(resolveSpeciesIdInHub("spiders", "saxeoebebi")).toBeUndefined();
  });

  it("builds hub-scoped hrefs", () => {
    expect(speciesHref("macrovipera-lebetina", "ka")).toEqual({
      params: { slug: "giurza" },
      pathname: "/snakes/[slug]",
    });
    expect(speciesHref("macrovipera-lebetina", "en")).toEqual({
      params: { slug: "macrovipera-lebetina" },
      pathname: "/snakes/[slug]",
    });
  });

  it("pairs lookalikes named in each other's identification text", () => {
    const pairs = [
      ["blatta-orientalis", "cimex-lectularius"],
      ["cimex-lectularius", "halyomorpha-halys"],
      ["cheiracanthium-punctorium", "argiope-bruennichi"],
      ["cheiracanthium-punctorium", "argiope-lobata"],
      ["cheiracanthium-punctorium", "araneus-diadematus"],
      ["lycosa-singoriensis", "argiope-bruennichi"],
    ] as const;
    for (const [a, b] of pairs) {
      expect(lookalikesFixture(a), `${a} -> ${b}`).toContain(b);
      expect(lookalikesFixture(b), `${b} -> ${a}`).toContain(a);
    }
    expect(lookalikesFixture("lycosa-singoriensis")).not.toContain(
      "latrodectus-tredecimguttatus",
    );
    expect(lookalikesFixture("lutra-lutra")).toEqual([]);
  });

  it("keeps giurza lookalikes to supported visual matches", () => {
    expect(lookalikesFixture("macrovipera-lebetina")).toEqual([
      "elaphe-urartica",
      "hemorrhois-ravergieri",
      "vipera-transcaucasiana",
    ]);
    for (const id of ["elaphe-urartica", "hemorrhois-ravergieri"]) {
      expect(lookalikesFixture(id)).toContain("macrovipera-lebetina");
    }
    for (const id of [
      "malpolon-insignitus",
      "dolichophis-schmidti",
      "elaphe-dione",
    ]) {
      expect(lookalikesFixture(id)).not.toContain("macrovipera-lebetina");
    }
  });

  it("keeps red-bellied racer lookalikes to supported visual matches", () => {
    expect(lookalikesFixture("dolichophis-schmidti")).toEqual([
      "malpolon-insignitus",
      "platyceps-najadum",
      "hemorrhois-ravergieri",
      "elaphe-urartica",
    ]);
    expect(lookalikesFixture("elaphe-dione")).not.toContain(
      "dolichophis-schmidti",
    );
  });

  it("keeps Urartian ratsnake lookalikes to supported visual matches", () => {
    expect(lookalikesFixture("elaphe-urartica")).toEqual([
      "elaphe-dione",
      "dolichophis-schmidti",
      "hemorrhois-ravergieri",
      "macrovipera-lebetina",
    ]);
  });

  it("keeps Dahl's whip snake lookalikes to supported visual matches", () => {
    expect(lookalikesFixture("platyceps-najadum")).toEqual([
      "hemorrhois-ravergieri",
      "dolichophis-schmidti",
      "elaphe-dione",
      "telescopus-fallax",
    ]);
  });

  it("keeps smooth snake lookalikes to supported visual comparisons", () => {
    expect(lookalikesFixture("coronella-austriaca")).toEqual([
      "vipera-transcaucasiana",
      "zamenis-hohenackeri",
      "vipera-kaznakovi",
    ]);
  });

  it("keeps dice snake lookalikes to supported water-snake comparisons", () => {
    expect(lookalikesFixture("natrix-tessellata")).toEqual(["natrix-natrix"]);
    expect(lookalikesFixture("vipera-kaznakovi")).not.toContain(
      "natrix-tessellata",
    );
    expect(lookalikesFixture("pseudopus-apodus")).not.toContain(
      "natrix-tessellata",
    );
  });

  it("limits Caspian turtle lookalikes to visually confusable water turtles", () => {
    expect(lookalikesFixture("mauremys-caspica")).toEqual([
      "emys-orbicularis",
      "trachemys-scripta",
    ]);
    for (const id of ["emys-orbicularis", "trachemys-scripta"]) {
      expect(lookalikesFixture(id)).toContain("mauremys-caspica");
    }
    expect(lookalikesFixture("testudo-graeca")).not.toContain(
      "mauremys-caspica",
    );
  });

  it("keeps Darevsky's viper lookalikes to supported visual matches", () => {
    expect(lookalikesFixture("vipera-darevskii")).toEqual([
      "vipera-dinniki",
      "vipera-transcaucasiana",
    ]);
    expect(lookalikesFixture("vipera-dinniki")).toContain("vipera-darevskii");
    expect(lookalikesFixture("vipera-transcaucasiana")).toContain(
      "vipera-darevskii",
    );
  });

  it("limits Transcaucasian ratsnake lookalikes to visual confusion candidates", () => {
    expect(lookalikesFixture("zamenis-hohenackeri")).toEqual([
      "elaphe-dione",
      "coronella-austriaca",
      "hemorrhois-ravergieri",
      "vipera-transcaucasiana",
    ]);
    expect(lookalikesFixture("zamenis-longissimus")).not.toContain(
      "zamenis-hohenackeri",
    );
    expect(lookalikesFixture("elaphe-urartica")).not.toContain(
      "zamenis-hohenackeri",
    );
  });

  it("keeps glass lizard lookalikes to supported visual comparisons", () => {
    expect(lookalikesFixture("pseudopus-apodus")).toEqual(["anguis-colchica"]);
    expect(lookalikesFixture("natrix-natrix")).not.toContain(
      "pseudopus-apodus",
    );
  });

  it("keeps the Caucasian agama comparison to the visually confusable gecko", () => {
    expect(lookalikesFixture("paralaudakia-caucasia")).toEqual([
      "tenuidactylus-caspius",
    ]);
    expect(lookalikesFixture("tenuidactylus-caspius")).toContain(
      "paralaudakia-caucasia",
    );
    for (const id of ["darevskia-portschinskii", "eumeces-schneiderii"]) {
      expect(lookalikesFixture(id)).not.toContain("paralaudakia-caucasia");
    }
  });

  it("keeps grass snake lookalikes to supported field-confusion candidates", () => {
    expect(lookalikesFixture("natrix-natrix")).toEqual([
      "natrix-tessellata",
      "vipera-kaznakovi",
      "zamenis-longissimus",
    ]);
    expect(lookalikesFixture("anguis-colchica")).not.toContain("natrix-natrix");
  });

  it("keeps the mottled scorpion comparison to the visual match", () => {
    expect(lookalikesFixture("mesobuthus-eupeus")).toEqual([
      "olivierus-caucasicus",
    ]);
    expect(lookalikesFixture("olivierus-caucasicus")).toContain(
      "mesobuthus-eupeus",
    );
    for (const id of ["euscorpius-italicus", "euscorpius-mingrelicus"]) {
      expect(lookalikesFixture(id)).not.toContain("mesobuthus-eupeus");
    }
  });

  it("keeps brown bear lookalikes empty without supported visual confusion", () => {
    expect(lookalikesFixture("ursus-arctos")).toEqual([]);
    expect(lookalikesFixture("canis-lupus")).not.toContain("ursus-arctos");
    expect(lookalikesFixture("sus-scrofa")).not.toContain("ursus-arctos");
  });

  it("does not pair least weasel and Caucasian badger as visual lookalikes", () => {
    expect(lookalikesFixture("mustela-nivalis")).toEqual([]);
    expect(lookalikesFixture("meles-canescens")).not.toContain(
      "mustela-nivalis",
    );
  });

  it("keeps Rock Dove paired with woodpigeon but not turtle dove", () => {
    expect(lookalikesFixture("columba-livia")).toEqual(["columba-palumbus"]);
    expect(lookalikesFixture("streptopelia-turtur")).toEqual([
      "columba-palumbus",
    ]);
    expect(lookalikesFixture("columba-palumbus")).toEqual([
      "columba-livia",
      "streptopelia-turtur",
    ]);
  });

  it("does not pair green and great spotted woodpeckers as visual lookalikes", () => {
    expect(lookalikesFixture("picus-viridis")).toEqual([]);
    expect(lookalikesFixture("dendrocopos-major")).not.toContain(
      "picus-viridis",
    );
  });

  it("leaves Eurasian jay lookalikes empty without supported visual confusion", () => {
    expect(lookalikesFixture("garrulus-glandarius")).toEqual([]);
    expect(lookalikesFixture("pica-pica")).not.toContain("garrulus-glandarius");
    expect(lookalikesFixture("corvus-corax")).not.toContain(
      "garrulus-glandarius",
    );
  });

  it("keeps sparrowhawk lookalikes to supported flight comparisons", () => {
    const peers = ["accipiter-gentilis", "falco-peregrinus", "cuculus-canorus"];
    expect(lookalikesFixture("accipiter-nisus")).toEqual(peers);
    for (const id of peers) {
      expect(lookalikesFixture(id)).toContain("accipiter-nisus");
    }
    for (const id of ["buteo-buteo", "pernis-apivorus"]) {
      expect(lookalikesFixture(id)).not.toContain("accipiter-nisus");
    }
  });

  it("keeps golden eagle lookalikes to supported flight comparisons", () => {
    const peers = [
      "aegypius-monachus",
      "buteo-buteo",
      "gypaetus-barbatus",
      "gyps-fulvus",
    ];
    expect(lookalikesFixture("aquila-chrysaetos")).toEqual(peers);
    for (const id of peers) {
      expect(lookalikesFixture(id)).toContain("aquila-chrysaetos");
    }
    for (const id of ["falco-peregrinus", "milvus-migrans"]) {
      expect(lookalikesFixture(id)).not.toContain("aquila-chrysaetos");
    }
  });

  it("limits cinereous vulture lookalikes to visual flight matches", () => {
    expect(lookalikesFixture("aegypius-monachus")).toEqual([
      "aquila-chrysaetos",
      "gyps-fulvus",
    ]);
    expect(lookalikesFixture("buteo-buteo")).not.toContain("aegypius-monachus");
  });

  it("keeps bearded vulture lookalikes to supported flight comparisons", () => {
    const peers = ["gyps-fulvus", "aquila-chrysaetos"];
    expect(lookalikesFixture("gypaetus-barbatus")).toEqual(peers);
    for (const id of peers) {
      expect(lookalikesFixture(id)).toContain("gypaetus-barbatus");
    }
    expect(lookalikesFixture("aegypius-monachus")).not.toContain(
      "gypaetus-barbatus",
    );
  });

  it("limits griffon vulture lookalikes to supported visual comparisons", () => {
    expect(lookalikesFixture("gyps-fulvus")).toEqual([
      "aegypius-monachus",
      "aquila-chrysaetos",
      "gypaetus-barbatus",
    ]);
    expect(lookalikesFixture("buteo-buteo")).not.toContain("gyps-fulvus");
  });

  it("resolves a public slug and lists static hub params", async () => {
    expect(resolveSpeciesId("giurza")).toBe("macrovipera-lebetina");
    expect(resolveSpeciesId("not-a-species")).toBeUndefined();
    const params = await speciesStaticParams("snakes");
    expect(params).toEqual(
      expect.arrayContaining([
        { locale: "ka", slug: "giurza" },
        { locale: "en", slug: "macrovipera-lebetina" },
      ]),
    );
    expect(
      (await speciesStaticParams("turtles")).some(
        (item) => item.slug === "giurza",
      ),
    ).toBe(false);
  });

  it("leaves Caucasian salamander lookalikes empty without supported visual confusion", () => {
    expect(lookalikesFixture("mertensiella-caucasica")).toEqual([]);
    for (const id of [
      "lissotriton-lantzi",
      "ommatotriton-ophryticus",
      "triturus-karelinii",
    ]) {
      expect(lookalikesFixture(id)).not.toContain("mertensiella-caucasica");
    }
  });
});
