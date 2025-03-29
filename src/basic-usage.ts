import { MCPAgent, Servers } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set!");
  console.error("Please create a .env file with your OpenAI API key.");
  process.exit(1);
}

async function runExample() {
  // Create an MCPAgent with inline JSON configuration
  const agent = new MCPAgent(Servers.sequentialThinking);

  try {
    // Initialize the agent (connects to all servers)
    console.log("Initializing MCPAgent...");
    await agent.initialize();
    console.log("MCPAgent initialized successfully");

    // Example: Using sequential thinking
    console.log("\nUsing sequential thinking to answer a question...");
    const response = await agent.generateResponse({
      prompt: "Solve 23 * 17",
      model: openai("gpt-4o"),
      maxSteps: 25,
    });

    console.log("\nResponse:", response.text);
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
