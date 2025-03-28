import { openai } from "@ai-sdk/openai";
import fs from "fs";
import { MCPAgent } from "mcp-ai-agent";

// Ensure required environment variables are set
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

async function main() {
  // Initialize the MCPAgent with the sequential-thinking server
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
    await agent.initialize();
    console.log("Agent initialized successfully");

    // Read the PDF file
    const pdfPath = "files/equation.pdf";
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Generate a response using the PDF
    const response = await agent.generateResponse({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Use sequential thinking to solve the equation in this PDF",
            },
            {
              type: "file",
              data: pdfBuffer,
              filename: "equation.pdf",
              mimeType: "application/pdf",
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
