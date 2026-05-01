const fs = require("fs");
const path = require("path");

function resolveRulesSource() {
  const candidates = [
    path.join(__dirname, "../rules"),
    path.join(__dirname, "../.cursor/rules"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "No rules directory found. Expected ./rules or ./.cursor/rules in the package."
  );
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
  } catch (error) {
    // Symlinks can fail on some environments (e.g. Windows without privileges).
    // Fall back to copy so command remains usable.
    fs.copyFileSync(sourcePath, destinationPath);
    return "copied";
  }
}

function syncRules() {
  const sourceDir = resolveRulesSource();
  const destinationDir = path.join(process.cwd(), ".cursor/rules");
  fs.mkdirSync(destinationDir, { recursive: true });

  const ruleFiles = fs
    .readdirSync(sourceDir)
    .filter((entry) => entry.endsWith(".mdc"))
    .sort();

  if (ruleFiles.length === 0) {
    throw new Error(`No .mdc rules found in ${sourceDir}`);
  }

  let linked = 0;
  let copied = 0;
  let unchanged = 0;
  let skipped = 0;

  for (const fileName of ruleFiles) {
    const sourcePath = path.resolve(sourceDir, fileName);
    const destinationPath = path.resolve(destinationDir, fileName);
    const result = safeSymlink(sourcePath, destinationPath);

    if (result === "linked") linked += 1;
    if (result === "copied") copied += 1;
    if (result === "unchanged") unchanged += 1;
    if (result === "skipped-existing-file") skipped += 1;
  }

  console.log(
    `Rules sync complete: linked=${linked}, copied=${copied}, unchanged=${unchanged}, skipped=${skipped}`
  );
}

module.exports = syncRules;
