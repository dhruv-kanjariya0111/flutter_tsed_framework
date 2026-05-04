const path = require("path");
const os = require("os");
const readline = require("readline");
const { copyInternalFiles, copyUserFacingFiles, mergeSettings, printSummary } = require("./installer");

const PKG_ROOT = path.join(__dirname, "..");

function parseScope(argv) {
  if (argv.includes("--global")) return "global";
  if (argv.includes("--local")) return "local";
  return null;
}

function parseForce(argv) {
  return argv.includes("--force");
}

function promptScope() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let attempts = 0;

    function ask() {
      rl.question(
        "? Install flutter-tsed framework globally (~/.claude) or locally (this project)? [global/local]: ",
        (answer) => {
          const a = answer.trim().toLowerCase();
          if (a === "global" || a === "g") { rl.close(); resolve("global"); }
          else if (a === "local" || a === "l") { rl.close(); resolve("local"); }
          else if (attempts === 0) { attempts++; ask(); }
          else { rl.close(); reject(new Error("Invalid scope. Use 'global' or 'local'.")); }
        }
      );
    }
    ask();
  });
}

async function setupClaude() {
  const argv = process.argv.slice(3);
  const force = parseForce(argv);
  let scope = parseScope(argv);

  if (!scope) {
    try {
      scope = await promptScope();
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  const isGlobal = scope === "global";
  const targetBase = isGlobal
    ? path.join(os.homedir(), ".claude")
    : path.join(process.cwd(), ".claude");

  const settingsPath = path.join(targetBase, "settings.json");
  const namespacedDir = "flutter-tsed";

  const internalDirs = [".claude/agents", ".claude/commands", ".claude/skills"];
  let internalResults;
  try {
    internalResults = copyInternalFiles({ pkgRoot: PKG_ROOT, targetBase, internalDirs, namespacedDir });
  } catch (err) {
    console.error(`[error] Failed to copy internal files: ${err.message}`);
    if (err.code === "EACCES") {
      console.error(`       No write permission to ${targetBase}`);
      if (isGlobal) console.error("       Try: sudo flutter-tsed setup-claude --global");
    }
    process.exit(1);
  }

  const missingSource = internalResults.filter(r => r.action === "missing-source");
  if (missingSource.length > 0) {
    console.error("[error] Source files missing from package:");
    missingSource.forEach(r => console.error(`       ${r.file}`));
    console.error("       Try: npm install -g @boscdev/flutter-tsed-framework");
    process.exit(1);
  }

  const userFacingFiles = ["CLAUDE.md", "PROJECT_CONFIG.md", "MEMORY.md", "BUG_PATTERNS.md", "TEST_SPEC.md", "AGENTS.md"];
  const userResults = copyUserFacingFiles({
    pkgRoot: PKG_ROOT,
    cwd: process.cwd(),
    userFacingFiles,
    force,
  });

  const settingsKeys = isGlobal
    ? {
        customAgentsDirectory: path.join(os.homedir(), ".claude", namespacedDir, "agents"),
        customCommandsDirectory: path.join(os.homedir(), ".claude", namespacedDir, "commands"),
      }
    : {
        customAgentsDirectory: path.join(".claude", namespacedDir, "agents"),
        customCommandsDirectory: path.join(".claude", namespacedDir, "commands"),
      };

  try {
    mergeSettings(settingsPath, settingsKeys);
  } catch (err) {
    console.error(`[error] ${err.message}`);
    process.exit(1);
  }

  printSummary({
    label: `setup-claude (${scope})`,
    internalResults,
    userResults,
    settingsPath,
  });

  console.log("\nDone. Restart Claude Code to pick up the new agents and commands.");
}

module.exports = setupClaude;
