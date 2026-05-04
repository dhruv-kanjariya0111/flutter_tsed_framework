const fs = require("fs");
const path = require("path");

function copyInternalFiles({ pkgRoot, targetBase, internalDirs }) {
  const results = [];
  for (const srcDir of internalDirs) {
    const srcPath = path.join(pkgRoot, srcDir);
    if (!fs.existsSync(srcPath)) {
      results.push({ file: srcDir, action: "missing-source" });
      continue;
    }
    const subDir = path.basename(srcDir);
    const destDir = path.join(targetBase, subDir);
    copyDir(srcPath, destDir, results);
  }
  return results;
}

function copyDir(src, dest, results) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const srcEntry = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcEntry, destEntry, results);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
      results.push({ file: destEntry, action: "installed" });
    }
  }
}

function copyUserFacingDirs({ pkgRoot, cwd, userFacingDirs, force }) {
  const results = [];
  for (const dir of userFacingDirs) {
    const src = path.join(pkgRoot, dir);
    const dest = path.join(cwd, dir);
    if (!fs.existsSync(src)) {
      results.push({ file: dir + "/", action: "missing-source" });
      continue;
    }
    const alreadyExists = fs.existsSync(dest);
    if (alreadyExists && !force) {
      results.push({ file: dir + "/", action: "skipped" });
      continue;
    }
    copyDir(src, dest, []);
    results.push({ file: dir + "/", action: alreadyExists ? "updated" : "copied" });
  }
  return results;
}

function copyUserFacingFiles({ pkgRoot, cwd, userFacingFiles, force }) {
  const results = [];
  for (const fileName of userFacingFiles) {
    const src = path.join(pkgRoot, fileName);
    const dest = path.join(cwd, fileName);
    if (!fs.existsSync(src)) {
      results.push({ file: fileName, action: "missing-source" });
      continue;
    }
    const alreadyExists = fs.existsSync(dest);
    if (alreadyExists && !force) {
      results.push({ file: fileName, action: "skipped" });
      continue;
    }
    fs.copyFileSync(src, dest);
    results.push({ file: fileName, action: alreadyExists ? "updated" : "copied" });
  }
  return results;
}

function mergeHooks(existing, incoming) {
  const result = Object.assign({}, existing);
  for (const [event, entries] of Object.entries(incoming)) {
    if (!result[event]) {
      result[event] = entries;
      continue;
    }
    const seen = new Set(
      result[event].flatMap(e => (e.hooks || [e]).map(h => h.command))
    );
    const novel = entries.filter(e =>
      (e.hooks || [e]).every(h => !seen.has(h.command))
    );
    result[event] = [...result[event], ...novel];
  }
  return result;
}

function mergeSettings(settingsPath, keysToMerge) {
  let existing = {};
  if (fs.existsSync(settingsPath)) {
    const raw = fs.readFileSync(settingsPath, "utf8").trim();
    try {
      existing = JSON.parse(raw);
    } catch {
      throw new Error(
        `Malformed JSON in ${settingsPath} — fix or delete it and re-run.`
      );
    }
  }
  const merged = Object.assign({}, existing, keysToMerge);
  if (existing.hooks && keysToMerge.hooks) {
    merged.hooks = mergeHooks(existing.hooks, keysToMerge.hooks);
  }
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2) + "\n");
}

function printSummary({ label, internalResults, userResults, settingsPath }) {
  console.log(`\nflutter-tsed ${label}`);
  console.log("─".repeat(40));
  for (const r of internalResults) {
    const tag = r.action === "missing-source" ? "[missing]" : "[installed]";
    console.log(`${tag.padEnd(12)} ${r.file}`);
  }
  for (const r of userResults) {
    const tag =
      r.action === "copied" ? "[copied]" :
      r.action === "updated" ? "[updated]" :
      r.action === "skipped" ? "[skipped]" : "[missing]";
    const note = r.action === "skipped" ? " (already exists — use --force to overwrite)" : "";
    console.log(`${tag.padEnd(12)} ${r.file}${note}`);
  }
  console.log(`${"[updated]".padEnd(12)} ${settingsPath}`);
}

module.exports = { copyInternalFiles, copyUserFacingDirs, copyUserFacingFiles, mergeSettings, mergeHooks, printSummary };
