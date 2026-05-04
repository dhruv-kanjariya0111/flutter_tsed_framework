#!/usr/bin/env node

const path = require("path");

const command = process.argv[2];

const commandHandlers = {
  "setup-claude": () => require(path.join(__dirname, "../src/setup-claude"))(),
  "setup-cursor": () => require(path.join(__dirname, "../src/setup-cursor"))(),
  "sync-rules": () => require(path.join(__dirname, "../src/sync-rules"))(),
  init: () => require(path.join(__dirname, "../src/init"))(),
};

if (!command || command === "-h" || command === "--help") {
  console.log("Usage: flutter-tsed <setup-claude|setup-cursor|sync-rules|init>");
  console.log("");
  console.log("Commands:");
  console.log("  setup-claude [--global|--local] [--force]  Install for Claude Code");
  console.log("  setup-cursor [--global|--local] [--force]  Install for Cursor");
  console.log("  sync-rules                                 Sync framework rules");
  console.log("  init                                       Initialize project");
  process.exit(0);
}

const handler = commandHandlers[command];

if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error("Use --help to see available commands.");
  process.exit(1);
}

handler();
