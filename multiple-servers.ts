import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  const agent = new MCPAgent({
    mcpServers: {
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      },
      memory: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
      },
    },
  });

  try {
    await agent.initialize();
    const response = await agent.generateResponse(
      "First solve this problem: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?. Then store the result in your Knowledge Graph memory.",
      openai("gpt-4o")
    );
    console.log("Response:", response);

    const response2 = await agent.generateResponse(
      "From your Knowledge Graph memory, retrieve the result of the problem If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet?",
      openai("gpt-4o")
    );
    console.log("Response:", response2);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await agent.close();
  }
}

main().catch(console.error);
