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

function extractDescription(commandName) {
  const doc = readCommandDoc(commandName);
  const firstLine = doc.split("\n")[0] || "";
  // Strip leading `#` chars and trim to get the title
  const title = firstLine.replace(/^#+\s*/, "").trim();
  return title || `Run the /${commandName} workflow`;
}

function registerCommandTool(server, commandName) {
  const description = extractDescription(commandName);
  server.tool(
    commandName,
    description,
    { feature: z.string().optional().describe("Feature or module name to target") },
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

function registerCommandPrompt(server, commandName) {
  const description = extractDescription(commandName);
  server.prompt(
    commandName,
    { description, arguments: [{ name: "feature", description: "Feature or module name to target", required: false }] },
    ({ feature } = {}) => {
      const docs = readCommandDoc(commandName);
      const featureSuffix = feature ? `\n\nFeature: ${feature}` : "";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `${docs}${featureSuffix}`,
            },
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
    registerCommandPrompt(server, commandName);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

module.exports = startMcpServer;
