import { getConfigPath, readOrCreateConfig, writeConfig } from "./helpers";

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  const data = JSON.parse(input);
  const prompt = (data.prompt || '').trim().toLowerCase();

  // /caveman help
  if (/^\/caveman\s+help$/i.test(prompt)) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: `
          Help command:
          - /caveman on|off Enable or disable caveman.
          - /caveman help: Show this message
         `
      }
    }));
    process.exit(0);
  }

  // /caveman <mode>
  const setModeMatch = prompt.match(/^\/caveman\s+(on|off)$/i);
  if (setModeMatch) {
    const mode = setModeMatch[1]!.toLowerCase();

    const configPath = getConfigPath();
    const config = readOrCreateConfig(configPath);
    config.caveman = mode === "on";
    writeConfig(configPath, config);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: "CAVEMAN " + (mode === "on" ? "ENABLED" : "DISABLED") + "."
      }
    }));
    process.exit(0);
  }

  // Not a caveman command — pass through silently
  process.exit(0);
});