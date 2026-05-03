import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getConfigPath, readOrCreateConfig, stripYamlFrontmatter } from "./helpers";

const configPath = getConfigPath();
const config = readOrCreateConfig(configPath);
const mode = config.caveman?.mode ?? "full";

if (mode === "off") {
  process.exit(0);
}

const skillPath = join(import.meta.dir, "..", "skills", "caveman", "SKILL.md");
const skillRaw = readFileSync(skillPath, "utf8");
const skillContent = stripYamlFrontmatter(skillRaw);

process.stdout.write(JSON.stringify({
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": `[Caveman mode active — level: ${mode}] Apply the following rules to ALL responses this session:\n\n${skillContent}\n`
  }
}));
process.exit(0);
