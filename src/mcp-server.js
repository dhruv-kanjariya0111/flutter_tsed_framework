const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

function resolveCommandsDir() {
  const envDir = process.env.FLUTTER_TSED_COMMANDS_DIR;
  const candidates = [
    envDir,
    path.join(process.cwd(), ".cursor/commands"),
    path.join(__dirname, "../.cursor/commands"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

function getCommandsDir() {
  return resolveCommandsDir();
}

function listCommandNames() {
  const commandsDir = getCommandsDir();
  if (!commandsDir || !fs.existsSync(commandsDir)) {
    return [];
  }

  return fs
    .readdirSync(commandsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();
}

function makeCommandDocPath(commandName) {
  return path.join(getCommandsDir(), `${commandName}.md`);
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
    { feature: z.string().optional() },
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
    throw new Error(
      `No command docs found. Checked FLUTTER_TSED_COMMANDS_DIR, ${path.join(
        process.cwd(),
        ".cursor/commands"
      )}, and package .cursor/commands.`
    );
  }

  for (const commandName of commandNames) {
    registerCommandTool(server, commandName);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

module.exports = startMcpServer;
