import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "agent-skills.hub.json");

const raw = JSON.parse(await readFile(catalogPath, "utf8"));

if (raw.version !== 1) {
  console.error("agent-skills.hub.json: unsupported version");
  process.exit(1);
}
if (raw.id !== "vorlaxen-skills-hub") {
  console.error(`agent-skills.hub.json: expected id vorlaxen-skills-hub, got ${raw.id}`);
  process.exit(1);
}
if (!raw.skills || typeof raw.skills !== "object") {
  console.error("agent-skills.hub.json: missing skills");
  process.exit(1);
}

for (const [alias, entry] of Object.entries(raw.skills)) {
  if (!entry?.source) {
    console.error(`Skill "${alias}": missing source`);
    process.exit(1);
  }
  const skillDir = join(root, entry.source.replace(/^\.\//, ""));
  try {
    await readFile(join(skillDir, "SKILL.md"), "utf8");
  } catch {
    console.error(`Skill "${alias}": SKILL.md not found at ${entry.source}`);
    process.exit(1);
  }
}

const aliases = Object.keys(raw.skills).sort();
console.log(`OK: ${aliases.length} skill(s) in ${raw.id}: ${aliases.join(", ")}`);
