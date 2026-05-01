const fs = require("fs");
const path = require("path");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const COMMANDS_DIR = path.join(__dirname, "../.cursor/commands");

function listCommandNames() {
  if (!fs.existsSync(COMMANDS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(COMMANDS_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();
}

function makeCommandDocPath(commandName) {
  return path.join(COMMANDS_DIR, `${commandName}.md`);
}

function readCommandDoc(commandName) {
  const docPath = makeCommandDocPath(commandName);
  if (!fs.existsSync(docPath)) {
    return `No command documentation found for '${commandName}'.`;
  }
  return fs.readFileSync(docPath, "utf8");
}

function registerCommandTool(server, commandName) {
  server.tool(
    commandName,
    {
      feature: { type: "string", optional: true },
    },
    async ({ feature } = {}) => {
      const docs = readCommandDoc(commandName);
      const featureSuffix = feature ? `\n\nRequested feature: ${feature}` : "";
      return {
        content: [
          {
            type: "text",
            text: `Command: /${commandName}\n\n${docs}${featureSuffix}`,
          },
        ],
      };
    }
  );
}

async function startMcpServer() {
  const server = new McpServer({
    name: "flutter-tsed",
    version: "1.0.0",
  });

  const commandNames = listCommandNames();
  if (commandNames.length === 0) {
    throw new Error("No command docs found in .cursor/commands.");
  }

  for (const commandName of commandNames) {
    registerCommandTool(server, commandName);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

module.exports = startMcpServer;
