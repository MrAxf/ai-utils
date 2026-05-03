import { type CavemanMode, getConfigPath, readOrCreateConfig, writeConfig } from "./helpers";

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
          - /caveman lite|full|ultra: Set caveman mode for this session
          - /caveman off: Disable caveman for this session
          - /caveman set-mode <mode>: Persist default mode (off|lite|full|ultra) to config file
          - /caveman help: Show this message
         `
      }
    }));
    process.exit(0);
  }

  // /caveman <mode>
  const setModeMatch = prompt.match(/^\/caveman\s+(off|lite|full|ultra)$/i);
  if (setModeMatch) {
    const mode = setModeMatch[1]!.toLowerCase() as CavemanMode;
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: "CAVEMAN MODE ACTIVE (" + mode + "). "
      }
    }));
    process.exit(0);
  }

  // /caveman set-mode <mode>
  const setDefaultMatch = prompt.match(/^\/caveman\s+set-mode\s+(off|lite|full|ultra)$/i);
  if (setDefaultMatch) {
    const mode = setDefaultMatch[1]!.toLowerCase() as CavemanMode;
    const configPath = getConfigPath();
    const config = readOrCreateConfig(configPath);
    config.caveman = { ...config.caveman, mode };
    writeConfig(configPath, config);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: "CAVEMAN DEFAULT MODE SET TO " + mode + ". DO NOT CHANGE IN THIS SESSION. "
      }
    }));
    process.exit(0);
  }

  // Not a caveman command — pass through silently
  process.exit(0);
});