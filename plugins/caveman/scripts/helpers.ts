import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface Config {
  caveman: boolean;
}

export const DEFAULT_CONFIG: Config = {
  caveman: true,
};

export function getConfigPath(): string {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA;
    if (!appData) throw new Error("APPDATA env var not set");
    return join(appData, "ai-utils", "config.json");
  }
  const home = process.env.HOME;
  if (!home) throw new Error("HOME env var not set");
  return join(home, ".config", "ai-utils", "config.json");
}

export function readOrCreateConfig(configPath: string): Config {
  if (!existsSync(configPath)) {
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
    return DEFAULT_CONFIG;
  }
  return JSON.parse(readFileSync(configPath, "utf8")) as Config;
}

export function writeConfig(configPath: string, config: Config): void {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function stripYamlFrontmatter(content: string): string {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return content;
  return content.slice(end + 4).trimStart();
}
