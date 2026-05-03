import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..");
const assetsDir = path.join(pkgRoot, "assets");
const outFile = path.join(pkgRoot, "src", "assets-data.ts");

const monogram = (await readFile(path.join(assetsDir, "monogram.jpeg"))).toString("base64");
const invitation = (await readFile(path.join(assetsDir, "invitation.jpg"))).toString("base64");

const out = `// Auto-generated. Do not edit by hand.
// Run \`pnpm --filter @repo/email assets:generate\` to regenerate.

export const MONOGRAM_JPEG_BASE64 = ${JSON.stringify(monogram)};
export const INVITATION_JPG_BASE64 = ${JSON.stringify(invitation)};
`;

await writeFile(outFile, out);
console.log(`Wrote ${outFile} (${out.length} bytes)`);
