import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getConfigPath, readOrCreateConfig, stripYamlFrontmatter } from "./helpers";

const configPath = getConfigPath();
const config = readOrCreateConfig(configPath);
const mode = config.caveman;

if (!mode) {
  process.exit(0);
}

const skillPath = join(import.meta.dir, "..", "skills", "caveman", "SKILL.md");
const skillRaw = readFileSync(skillPath, "utf8");
const skillContent = stripYamlFrontmatter(skillRaw);

process.stdout.write(JSON.stringify({
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": `${skillContent}\n\n`
  }
}));
process.exit(0);
