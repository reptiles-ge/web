import { describe, expect, it } from "vitest";

import {
  getSpeciesLookalikes,
  getSpeciesPublicSlug,
  resolveSpeciesId,
  resolveSpeciesInHub,
  speciesHref,
} from "@/lib/speciesRoutes";

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
    expect(resolveSpeciesInHub("snakes", "giurza")?.id).toBe(
      "macrovipera-lebetina",
    );
  });

  it("does not resolve a reserved hub slug as a species", () => {
    expect(resolveSpeciesInHub("snakes", "saxeoebebi")).toBeUndefined();
    expect(resolveSpeciesInHub("spiders", "saxeoebebi")).toBeUndefined();
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

  it("keeps giurza lookalikes to supported visual matches", () => {
    expect(getSpeciesLookalikes("macrovipera-lebetina")).toEqual([
      "elaphe-urartica",
      "hemorrhois-ravergieri",
      "vipera-transcaucasiana",
    ]);
    for (const id of ["elaphe-urartica", "hemorrhois-ravergieri"]) {
      expect(getSpeciesLookalikes(id)).toContain("macrovipera-lebetina");
    }
    for (const id of [
      "malpolon-insignitus",
      "dolichophis-schmidti",
      "elaphe-dione",
    ]) {
      expect(getSpeciesLookalikes(id)).not.toContain("macrovipera-lebetina");
    }
  });

  it("keeps red-bellied racer lookalikes to supported visual matches", () => {
    expect(getSpeciesLookalikes("dolichophis-schmidti")).toEqual([
      "malpolon-insignitus",
      "platyceps-najadum",
      "hemorrhois-ravergieri",
      "elaphe-urartica",
    ]);
    expect(getSpeciesLookalikes("elaphe-dione")).not.toContain(
      "dolichophis-schmidti",
    );
  });

  it("keeps Urartian ratsnake lookalikes to supported visual matches", () => {
    expect(getSpeciesLookalikes("elaphe-urartica")).toEqual([
      "elaphe-dione",
      "dolichophis-schmidti",
      "hemorrhois-ravergieri",
      "macrovipera-lebetina",
    ]);
  });

  it("keeps Dahl's whip snake lookalikes to supported visual matches", () => {
    expect(getSpeciesLookalikes("platyceps-najadum")).toEqual([
      "hemorrhois-ravergieri",
      "dolichophis-schmidti",
      "elaphe-dione",
      "telescopus-fallax",
    ]);
  });

  it("keeps smooth snake lookalikes to supported visual comparisons", () => {
    expect(getSpeciesLookalikes("coronella-austriaca")).toEqual([
      "vipera-transcaucasiana",
      "zamenis-hohenackeri",
      "vipera-kaznakovi",
    ]);
  });

  it("keeps dice snake lookalikes to supported water-snake comparisons", () => {
    expect(getSpeciesLookalikes("natrix-tessellata")).toEqual([
      "natrix-natrix",
    ]);
    expect(getSpeciesLookalikes("vipera-kaznakovi")).not.toContain(
      "natrix-tessellata",
    );
    expect(getSpeciesLookalikes("pseudopus-apodus")).not.toContain(
      "natrix-tessellata",
    );
  });

  it("limits Caspian turtle lookalikes to visually confusable water turtles", () => {
    expect(getSpeciesLookalikes("mauremys-caspica")).toEqual([
      "emys-orbicularis",
      "trachemys-scripta",
    ]);
    for (const id of ["emys-orbicularis", "trachemys-scripta"]) {
      expect(getSpeciesLookalikes(id)).toContain("mauremys-caspica");
    }
    expect(getSpeciesLookalikes("testudo-graeca")).not.toContain(
      "mauremys-caspica",
    );
  });

  it("keeps Darevsky's viper lookalikes to supported visual matches", () => {
    expect(getSpeciesLookalikes("vipera-darevskii")).toEqual([
      "vipera-dinniki",
      "vipera-transcaucasiana",
    ]);
    expect(getSpeciesLookalikes("vipera-dinniki")).toContain(
      "vipera-darevskii",
    );
    expect(getSpeciesLookalikes("vipera-transcaucasiana")).toContain(
      "vipera-darevskii",
    );
  });

  it("limits Transcaucasian ratsnake lookalikes to visual confusion candidates", () => {
    expect(getSpeciesLookalikes("zamenis-hohenackeri")).toEqual([
      "elaphe-dione",
      "coronella-austriaca",
      "hemorrhois-ravergieri",
      "vipera-transcaucasiana",
    ]);
    expect(getSpeciesLookalikes("zamenis-longissimus")).not.toContain(
      "zamenis-hohenackeri",
    );
    expect(getSpeciesLookalikes("elaphe-urartica")).not.toContain(
      "zamenis-hohenackeri",
    );
  });

  it("keeps glass lizard lookalikes to supported visual comparisons", () => {
    expect(getSpeciesLookalikes("pseudopus-apodus")).toEqual([
      "anguis-colchica",
    ]);
    expect(getSpeciesLookalikes("natrix-natrix")).not.toContain(
      "pseudopus-apodus",
    );
  });

  it("keeps the Caucasian agama comparison to the visually confusable gecko", () => {
    expect(getSpeciesLookalikes("paralaudakia-caucasia")).toEqual([
      "tenuidactylus-caspius",
    ]);
    expect(getSpeciesLookalikes("tenuidactylus-caspius")).toContain(
      "paralaudakia-caucasia",
    );
    for (const id of ["darevskia-portschinskii", "eumeces-schneiderii"]) {
      expect(getSpeciesLookalikes(id)).not.toContain("paralaudakia-caucasia");
    }
  });

  it("keeps grass snake lookalikes to supported field-confusion candidates", () => {
    expect(getSpeciesLookalikes("natrix-natrix")).toEqual([
      "natrix-tessellata",
      "vipera-kaznakovi",
      "zamenis-longissimus",
    ]);
    expect(getSpeciesLookalikes("anguis-colchica")).not.toContain(
      "natrix-natrix",
    );
  });

  it("keeps the mottled scorpion comparison to the visual match", () => {
    expect(getSpeciesLookalikes("mesobuthus-eupeus")).toEqual([
      "olivierus-caucasicus",
    ]);
    expect(getSpeciesLookalikes("olivierus-caucasicus")).toContain(
      "mesobuthus-eupeus",
    );
    for (const id of ["euscorpius-italicus", "euscorpius-mingrelicus"]) {
      expect(getSpeciesLookalikes(id)).not.toContain("mesobuthus-eupeus");
    }
  });

  it("keeps brown bear lookalikes empty without supported visual confusion", () => {
    expect(getSpeciesLookalikes("ursus-arctos")).toEqual([]);
    expect(getSpeciesLookalikes("canis-lupus")).not.toContain("ursus-arctos");
    expect(getSpeciesLookalikes("sus-scrofa")).not.toContain("ursus-arctos");
  });

  it("does not pair least weasel and Caucasian badger as visual lookalikes", () => {
    expect(getSpeciesLookalikes("mustela-nivalis")).toEqual([]);
    expect(getSpeciesLookalikes("meles-canescens")).not.toContain(
      "mustela-nivalis",
    );
  });

  it("keeps Rock Dove paired with woodpigeon but not turtle dove", () => {
    expect(getSpeciesLookalikes("columba-livia")).toEqual([
      "columba-palumbus",
    ]);
    expect(getSpeciesLookalikes("streptopelia-turtur")).toEqual([
      "columba-palumbus",
    ]);
    expect(getSpeciesLookalikes("columba-palumbus")).toEqual([
      "columba-livia",
      "streptopelia-turtur",
    ]);
  });

  it("does not pair green and great spotted woodpeckers as visual lookalikes", () => {
    expect(getSpeciesLookalikes("picus-viridis")).toEqual([]);
    expect(getSpeciesLookalikes("dendrocopos-major")).not.toContain(
      "picus-viridis",
    );
  });

  it("leaves Eurasian jay lookalikes empty without supported visual confusion", () => {
    expect(getSpeciesLookalikes("garrulus-glandarius")).toEqual([]);
    expect(getSpeciesLookalikes("pica-pica")).not.toContain(
      "garrulus-glandarius",
    );
    expect(getSpeciesLookalikes("corvus-corax")).not.toContain(
      "garrulus-glandarius",
    );
  });

  it("keeps sparrowhawk lookalikes to supported flight comparisons", () => {
    const peers = ["accipiter-gentilis", "falco-peregrinus"];
    expect(getSpeciesLookalikes("accipiter-nisus")).toEqual(peers);
    for (const id of peers) {
      expect(getSpeciesLookalikes(id)).toContain("accipiter-nisus");
    }
    for (const id of ["buteo-buteo", "pernis-apivorus"]) {
      expect(getSpeciesLookalikes(id)).not.toContain("accipiter-nisus");
    }
  });

  it("keeps golden eagle lookalikes to supported flight comparisons", () => {
    const peers = [
      "aegypius-monachus",
      "buteo-buteo",
      "gypaetus-barbatus",
      "gyps-fulvus",
    ];
    expect(getSpeciesLookalikes("aquila-chrysaetos")).toEqual(peers);
    for (const id of peers) {
      expect(getSpeciesLookalikes(id)).toContain("aquila-chrysaetos");
    }
    for (const id of ["falco-peregrinus", "milvus-migrans"]) {
      expect(getSpeciesLookalikes(id)).not.toContain("aquila-chrysaetos");
    }
  });

  it("limits cinereous vulture lookalikes to visual flight matches", () => {
    expect(getSpeciesLookalikes("aegypius-monachus")).toEqual([
      "aquila-chrysaetos",
      "gyps-fulvus",
    ]);
    expect(getSpeciesLookalikes("buteo-buteo")).not.toContain(
      "aegypius-monachus",
    );
  });

  it("keeps bearded vulture lookalikes to supported flight comparisons", () => {
    const peers = ["gyps-fulvus", "aquila-chrysaetos"];
    expect(getSpeciesLookalikes("gypaetus-barbatus")).toEqual(peers);
    for (const id of peers) {
      expect(getSpeciesLookalikes(id)).toContain("gypaetus-barbatus");
    }
    expect(getSpeciesLookalikes("aegypius-monachus")).not.toContain(
      "gypaetus-barbatus",
    );
  });

  it("limits griffon vulture lookalikes to supported visual comparisons", () => {
    expect(getSpeciesLookalikes("gyps-fulvus")).toEqual([
      "aegypius-monachus",
      "aquila-chrysaetos",
      "gypaetus-barbatus",
    ]);
    expect(getSpeciesLookalikes("buteo-buteo")).not.toContain("gyps-fulvus");
  });

  it("leaves Caucasian salamander lookalikes empty without supported visual confusion", () => {
    expect(getSpeciesLookalikes("mertensiella-caucasica")).toEqual([]);
    for (const id of [
      "lissotriton-lantzi",
      "ommatotriton-ophryticus",
      "triturus-karelinii",
    ]) {
      expect(getSpeciesLookalikes(id)).not.toContain("mertensiella-caucasica");
    }
  });
});
