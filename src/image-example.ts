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
  const agent = new MCPAgent(Servers.sequentialThinking);

  try {
    // Initialize the agent
    await agent.initialize();
    console.log("Agent initialized successfully");

    // Read the image file
    const imagePath = "files/equation.png";
    const imageBuffer = fs.readFileSync(imagePath);

    // Generate a response using the image
    const response = await agent.generateResponse({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Use sequential thinking to solve the equation in this image",
            },
            {
              type: "image",
              image: imageBuffer,
            },
          ],
        },
      ],
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
