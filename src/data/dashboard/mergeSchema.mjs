import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemasPath = path.join(__dirname, "liveListSchemas.json");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node mergeSchema.mjs <entry.json|entries.json>");
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const entries = Array.isArray(raw) ? raw : raw.path ? [raw] : Object.values(raw);
const all = fs.existsSync(schemasPath)
  ? JSON.parse(fs.readFileSync(schemasPath, "utf8"))
  : {};
for (const entry of entries) {
  if (!entry?.path) continue;
  all[entry.path] = entry;
}
fs.writeFileSync(schemasPath, JSON.stringify(all, null, 2));
console.log(`merged ${entries.length}; total ${Object.keys(all).length}`);
