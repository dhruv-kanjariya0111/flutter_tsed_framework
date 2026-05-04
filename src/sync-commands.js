const fs = require("fs");
const path = require("path");

function resolveCommandsSource() {
  const candidates = [
    path.join(__dirname, "../.cursor/commands"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("No commands directory found. Expected .cursor/commands in the package.");
}

function safeSymlink(sourcePath, destinationPath) {
  if (fs.existsSync(destinationPath)) {
    const stat = fs.lstatSync(destinationPath);
    if (stat.isSymbolicLink()) {
      const linkedTo = fs.readlinkSync(destinationPath);
      const resolvedLinkedTo = path.resolve(path.dirname(destinationPath), linkedTo);
      if (resolvedLinkedTo === sourcePath) {
        return "unchanged";
      }
      fs.unlinkSync(destinationPath);
    } else {
      return "skipped-existing-file";
    }
  }

  try {
    fs.symlinkSync(sourcePath, destinationPath);
    return "linked";
  } catch {
    fs.copyFileSync(sourcePath, destinationPath);
    return "copied";
  }
}

function syncCommands() {
  const sourceDir = resolveCommandsSource();
  const destinationDir = path.join(process.cwd(), ".claude/commands");
  fs.mkdirSync(destinationDir, { recursive: true });

  const commandFiles = fs
    .readdirSync(sourceDir)
    .filter((entry) => entry.endsWith(".md"))
    .sort();

  if (commandFiles.length === 0) {
    throw new Error(`No .md command files found in ${sourceDir}`);
  }

  let linked = 0;
  let copied = 0;
  let unchanged = 0;
  let skipped = 0;

  for (const fileName of commandFiles) {
    const sourcePath = path.resolve(sourceDir, fileName);
    const destinationPath = path.resolve(destinationDir, fileName);
    const result = safeSymlink(sourcePath, destinationPath);

    if (result === "linked") linked += 1;
    if (result === "copied") copied += 1;
    if (result === "unchanged") unchanged += 1;
    if (result === "skipped-existing-file") skipped += 1;
  }

  console.log(
    `Commands sync complete: linked=${linked}, copied=${copied}, unchanged=${unchanged}, skipped=${skipped}`
  );
  console.log(`Slash commands are now available in .claude/commands/`);
  console.log(`Restart Claude Code to pick up the new commands.`);
}

module.exports = syncCommands;
