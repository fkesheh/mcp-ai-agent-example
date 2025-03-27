import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";

async function main() {
  const agent = new MCPAgent({
    mcpServers: {
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      },
    },
  });

  try {
    await agent.initialize();
    const response = await agent.generateResponse(
      "Solve 23 * 17",
      openai("gpt-4o")
    );
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await agent.close();
  }
}

main().catch(console.error);
