import { AIAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  const agent = new AIAgent({
    name: "sequentialThinking",
    description: "Sequential thinking server",
    model: openai("gpt-4o"),
    toolsConfigs: [
      {
        mcpServers: {
          "sequential-thinking": {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
            env: {
              DEBUG: "true",
              MAX_STEPS: "10",
            },
          },
        },
      },
    ],
  });

  try {
    await agent.initialize();
    const response = await agent.generateResponse({
      prompt:
        "Solve this complex problem: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?",
      model: openai("gpt-4o"),
      maxSteps: 15,
    });
    console.log("Response:", response.text);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await agent.close();
  }
}

main().catch(console.error);
