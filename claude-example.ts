import { MCPAgent } from "mcp-ai-agent";
import { anthropic } from "@ai-sdk/anthropic";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check for Claude API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set!");
  console.error("Please create a .env file with your Claude API key.");
  process.exit(1);
}

async function runExample() {
  // Create an MCPAgent with Claude model
  const agent = new MCPAgent({
    mcpServers: {
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      },
    },
  });

  try {
    // Initialize the agent
    console.log("Initializing MCPAgent with Claude...");
    await agent.initialize();
    console.log("MCPAgent initialized successfully");

    // Example: Using Claude with sequential thinking
    console.log("\nUsing Claude to solve a complex problem...");
    const response = await agent.generateResponse(
      "Solve this complex problem step by step: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?",
      anthropic("claude-3-7-sonnet-20250219"),
      25 // Max steps
    );

    console.log("\nResponse:", response);
  } catch (error) {
    console.error(
      "Error in example:",
      error instanceof Error ? error.message : String(error)
    );
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
  } finally {
    // Always close the agent when done
    try {
      await agent.close();
      console.log("MCPAgent closed");
    } catch (closeError) {
      console.error(
        "Error closing agent:",
        closeError instanceof Error ? closeError.message : String(closeError)
      );
    }
  }
}

runExample().catch((error) => {
  console.error(
    "Unhandled error:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
