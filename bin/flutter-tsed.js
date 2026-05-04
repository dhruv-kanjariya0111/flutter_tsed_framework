#!/usr/bin/env node

const path = require("path");

const command = process.argv[2];

const commandHandlers = {
  "sync-rules": () => require(path.join(__dirname, "../src/sync-rules"))(),
  "sync-commands": () => require(path.join(__dirname, "../src/sync-commands"))(),
  init: () => require(path.join(__dirname, "../src/init"))(),
  "--mcp": () => require(path.join(__dirname, "../src/mcp-server"))(),
};

if (!command || command === "-h" || command === "--help") {
  console.log("Usage: flutter-tsed <sync-rules|sync-commands|init|--mcp>");
  process.exit(0);
}

const handler = commandHandlers[command];

if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error("Use --help to see available commands.");
  process.exit(1);
}

handler();
