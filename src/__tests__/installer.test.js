const fs = require("fs");
const path = require("path");
const os = require("os");

let installer;

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "flutter-tsed-test-"));
}

function writeFile(dir, relPath, content = "test content") {
  const full = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return full;
}

describe("installer", () => {
  let pkgRoot, targetBase, cwd;

  beforeEach(() => {
    pkgRoot = makeTmpDir();
    targetBase = makeTmpDir();
    cwd = makeTmpDir();
    installer = require("../installer");
  });

  afterEach(() => {
    fs.rmSync(pkgRoot, { recursive: true, force: true });
    fs.rmSync(targetBase, { recursive: true, force: true });
    fs.rmSync(cwd, { recursive: true, force: true });
    jest.resetModules();
  });

  test("copies internal files directly under targetBase, always overwriting", () => {
    writeFile(pkgRoot, ".claude/agents/orchestrator.md", "agent content");
    writeFile(pkgRoot, ".claude/commands/tdd.md", "command content");

    installer.copyInternalFiles({
      pkgRoot,
      targetBase,
      internalDirs: [".claude/agents", ".claude/commands"],
    });

    const agentDest = path.join(targetBase, "agents", "orchestrator.md");
    const cmdDest = path.join(targetBase, "commands", "tdd.md");
    expect(fs.existsSync(agentDest)).toBe(true);
    expect(fs.readFileSync(agentDest, "utf8")).toBe("agent content");
    expect(fs.existsSync(cmdDest)).toBe(true);
  });

  test("overwrites existing internal files on re-run", () => {
    writeFile(pkgRoot, ".claude/agents/orchestrator.md", "new content");
    const dest = path.join(targetBase, "agents", "orchestrator.md");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, "old content");

    installer.copyInternalFiles({
      pkgRoot,
      targetBase,
      internalDirs: [".claude/agents"],
    });

    expect(fs.readFileSync(dest, "utf8")).toBe("new content");
  });

  test("copies scaffold dirs to cwd as single summary entry, skips if exists", () => {
    writeFile(pkgRoot, "frontend/lib/main.dart", "void main() {}");
    writeFile(pkgRoot, "scripts/setup.sh", "#!/bin/bash");

    const results = installer.copyUserFacingDirs({
      pkgRoot,
      cwd,
      userFacingDirs: ["frontend", "scripts"],
      force: false,
    });

    expect(fs.existsSync(path.join(cwd, "frontend", "lib", "main.dart"))).toBe(true);
    expect(results.find(r => r.file === "frontend/").action).toBe("copied");

    const results2 = installer.copyUserFacingDirs({
      pkgRoot,
      cwd,
      userFacingDirs: ["frontend"],
      force: false,
    });
    expect(results2.find(r => r.file === "frontend/").action).toBe("skipped");
  });

  test("copyUserFacingDirs overwrites on --force", () => {
    writeFile(pkgRoot, "frontend/lib/main.dart", "new content");
    writeFile(cwd, "frontend/lib/main.dart", "old content");

    const results = installer.copyUserFacingDirs({
      pkgRoot,
      cwd,
      userFacingDirs: ["frontend"],
      force: true,
    });

    expect(fs.readFileSync(path.join(cwd, "frontend", "lib", "main.dart"), "utf8")).toBe("new content");
    expect(results.find(r => r.file === "frontend/").action).toBe("updated");
  });

  test("copies user-facing files to cwd, skips if exists", () => {
    writeFile(pkgRoot, "MEMORY.md", "memory content");
    writeFile(pkgRoot, "AGENTS.md", "agents content");

    const results = installer.copyUserFacingFiles({
      pkgRoot,
      cwd,
      userFacingFiles: ["MEMORY.md", "AGENTS.md"],
      force: false,
    });

    expect(fs.existsSync(path.join(cwd, "MEMORY.md"))).toBe(true);
    expect(results.find(r => r.file === "MEMORY.md").action).toBe("copied");

    const results2 = installer.copyUserFacingFiles({
      pkgRoot,
      cwd,
      userFacingFiles: ["MEMORY.md"],
      force: false,
    });
    expect(results2.find(r => r.file === "MEMORY.md").action).toBe("skipped");
  });

  test("overwrites user-facing files when --force", () => {
    writeFile(pkgRoot, "MEMORY.md", "new content");
    fs.writeFileSync(path.join(cwd, "MEMORY.md"), "old content");

    const results = installer.copyUserFacingFiles({
      pkgRoot,
      cwd,
      userFacingFiles: ["MEMORY.md"],
      force: true,
    });

    expect(fs.readFileSync(path.join(cwd, "MEMORY.md"), "utf8")).toBe("new content");
    expect(results.find(r => r.file === "MEMORY.md").action).toBe("updated");
  });

  test("mergeSettings creates settings.json if missing", () => {
    const settingsPath = path.join(cwd, "settings.json");
    installer.mergeSettings(settingsPath, { myKey: "myValue" });
    const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    expect(parsed.myKey).toBe("myValue");
  });

  test("mergeSettings adds keys without removing existing ones", () => {
    const settingsPath = path.join(cwd, "settings.json");
    fs.writeFileSync(settingsPath, JSON.stringify({ existingKey: true }, null, 2));
    installer.mergeSettings(settingsPath, { newKey: "newValue" });
    const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    expect(parsed.existingKey).toBe(true);
    expect(parsed.newKey).toBe("newValue");
  });

  test("mergeSettings throws on malformed JSON", () => {
    const settingsPath = path.join(cwd, "settings.json");
    fs.writeFileSync(settingsPath, "{ bad json }");
    expect(() => installer.mergeSettings(settingsPath, { k: "v" })).toThrow(/malformed/i);
  });
});
