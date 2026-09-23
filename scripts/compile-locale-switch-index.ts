import fs from "node:fs";
import path from "node:path";

import { getLocaleSwitchIndex } from "../src/lib/localeSwitchData";

const outFile = path.join(
  process.cwd(),
  "src/data/localeSwitchIndex.generated.ts",
);
const source = `import type { LocaleSwitchIndex } from "../lib/localeSwitch";

export const localeSwitchIndex: LocaleSwitchIndex = ${JSON.stringify(getLocaleSwitchIndex())};
`;

fs.writeFileSync(outFile, source, "utf8");
console.log(`Compiled locale switch index → ${outFile}`);
