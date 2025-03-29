import { openai } from "@ai-sdk/openai";
import fs from "fs";
import { MCPAgent, Servers } from "mcp-ai-agent";

// Ensure required environment variables are set
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

async function main() {
  // Initialize the MCPAgent with the sequential-thinking server
  const agent = new MCPAgent(Servers.braveSearch, Servers.sequentialThinking);

  try {
    // Initialize the agent
    await agent.initialize();
    console.log("Agent initialized successfully");

    const jsonConfig = {
      mcpServers: {
        everything: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-everything"],
        },
      },
    };

    // Generate a response using the PDF
    const response = await agent.generateResponse({
      model: openai("gpt-4o"),
      system: `Research a mcp server for the following task. It should be stdio tool installed through npx or uvx. Output only one of the following: either a JSON configuration like this \`\`\`json${JSON.stringify(
        jsonConfig
      )}\`\`\` or the text TOOL_NOT_FOUND. Use sequential-thinking to guide the search.`,
      prompt: "MCP Server for the Slack API",
    });

    // Display the response
    console.log("\nResponse:");
    console.log(response.text);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the agent
    await agent.close();
  }
}

main();
