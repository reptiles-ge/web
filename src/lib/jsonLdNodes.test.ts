import { describe, expect, it } from "vitest";

import { compactRepeatedNodes } from "@/lib/jsonLdNodes";

const person = {
  "@id": "https://reptiles.ge/#photographer-a",
  "@type": "Person",
  name: "A",
};

describe("compactRepeatedNodes", () => {
  it("keeps the first full node and turns later copies into references", () => {
    const result = compactRepeatedNodes({
      image: [
        { copyrightHolder: person, creator: person },
        { copyrightHolder: person, creator: person },
      ],
    });
    expect(result.image[0]?.copyrightHolder).toEqual(person);
    expect(result.image[0]?.creator).toEqual({ "@id": person["@id"] });
    expect(result.image[1]?.creator).toEqual({ "@id": person["@id"] });
  });

  it("leaves references, nodes without an id and plain values alone", () => {
    const data = {
      author: { "@id": "https://reptiles.ge/#organization" },
      creator: { "@type": "Person", name: "B" },
      other: { "@type": "Person", name: "B" },
      tags: ["a", 1, null],
    };
    expect(compactRepeatedNodes(data)).toEqual(data);
  });
});
