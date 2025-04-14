import { anthropic } from "@ai-sdk/anthropic";
import * as dotenv from "dotenv";
import { AIAgent, Servers } from "mcp-ai-agent";

// Load environment variables
dotenv.config();

// Check for required API keys
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set!");
  console.error("Please create a .env file with your Claude API key.");
  process.exit(1);
}

/**
 * This example demonstrates a more complex research task using the Manus agent,
 * showcasing capabilities similar to what was described in the Manus research:
 * - Breaking down complex problems
 * - Web research
 * - Report generation
 * - Memory and persistence
 * - Code execution
 */
async function main() {
  // =============== SETUP SPECIALIZED AGENTS ===============
  const braveSearchAgent = new AIAgent({
    name: "Research Agent",
    description: "Use this agent to search the web for information",
    systemPrompt:
      "You are a specialized web research agent with expertise in finding accurate and relevant information. When given a search query:\n\n1. Formulate effective search queries that target the most reliable sources\n2. Evaluate search results critically for reliability and relevance\n3. Extract key information, paying attention to dates, authors, and credibility\n4. When possible, verify information across multiple sources\n5. Save important findings with proper citations including URLs and publication dates\n6. Prioritize academic, governmental, and established industry sources \n7. Provide comprehensive information rather than superficial summaries\n8. When searching technical topics, focus on authoritative technical documentation\n9. Identify contradictory information and highlight areas of consensus vs. debate\n10. Clearly separate facts from opinions or speculative content\n\nYour goal is to gather thorough and accurate information to support high-quality research and decision-making.",
    model: anthropic("claude-3-7-sonnet-20250219"),
    toolsConfigs: [Servers.braveSearch, Servers.sequentialThinking],
  });

  // =============== CREATE MASTER AGENT ===============
  // This is the main Manus-like agent that coordinates everything
  const manusAgent = new AIAgent({
    name: "Manus-Like Research Agent",
    description:
      "An autonomous AI agent that performs comprehensive research and generates detailed reports",
    model: anthropic("claude-3-7-sonnet-20250219"),
    toolsConfigs: [
      {
        type: "agent",
        agent: braveSearchAgent,
      },
      Servers.sequentialThinking,
      Servers.fileSystem,
    ],
  });

  try {
    // Initialize the agent
    console.log("Initializing Manus-Like Research Agent...");
    await manusAgent.initialize();
    console.log("Manus-Like Research Agent initialized successfully");

    // =============== DEFINE RESEARCH TASK ===============
    console.log("\nBeginning complex research task...");

    const researchTaskPrompt = `You are an autonomous AI research assistant with advanced capabilities.

I need you to research the topic "Quantum Computing's Impact on Cybersecurity" and produce a comprehensive analysis report. This is a deep research task that requires using multiple tools and capabilities.

Follow these steps to complete the task:

1. PLANNING: Break down this research project into logical steps
   - Create a research plan with specific questions to investigate
   - Save this plan to a file called "research_plan.md" in the "research" directory

2. INFORMATION GATHERING: Research quantum computing and cybersecurity
   - Use web search to find relevant information about quantum computing basics
   - Find information about how quantum computing affects cryptography
   - Find information about post-quantum cryptography efforts
   - Save important findings to files in the "research/sources" directory

3. ANALYSIS: Analyze the potential impacts and timeline
   - Use sequential thinking to analyze when quantum computers might break current encryption
   - Analyze what industries will be most affected
   - Determine what actions organizations should take now to prepare
   - Create a code simulation to demonstrate a key concept (this will be simulated)

4. REPORT GENERATION: Create a detailed research report
   - Write a comprehensive report with proper sections and citations
   - Include executive summary, introduction, analysis, recommendations, and conclusion
   - Save the complete report to "research/final_report.md"
   - Store a summary of key findings in memory for future reference

Throughout this task, demonstrate your autonomous capabilities by using appropriate tools,
breaking down the problem effectively, and producing a well-researched result.

The final report should be detailed (at least 2000 words) and properly structured with citations.`;

    // =============== EXECUTE RESEARCH TASK ===============
    const response = await manusAgent.generateResponse({
      prompt: researchTaskPrompt,
      model: anthropic("claude-3-7-sonnet-20250219"),
      maxSteps: 100, // Allow more steps for this complex task
      onStepFinish: (step) => {
        console.log(`Step completed: ${step.stepType} - ${step.text}`);
        console.log(`Step result`, JSON.stringify(step.toolResults, null, 2));
      },
    });

    console.log(
      "\nTask completed. Final response from Manus-Like Research Agent:"
    );
    console.log(response.text);

    // =============== FOLLOW-UP QUESTION USING STORED KNOWLEDGE ===============
    console.log(
      "\nAsking a follow-up question to demonstrate knowledge utilization..."
    );
    const followUpResponse = await manusAgent.generateResponse({
      prompt:
        "Based on our research stored in files under the 'research' directory, what specific actions should a financial institution take in the next 5 years to prepare for quantum computing threats? Use both your memory and sequential thinking to provide a detailed answer.",
      model: anthropic("claude-3-7-sonnet-20250219"),
      maxSteps: 10,
    });

    console.log("\nFollow-up response:");
    console.log(followUpResponse.text);
  } catch (error) {
    console.error(
      "Error in Manus Research Agent example:",
      error instanceof Error ? error.message : String(error)
    );
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
  } finally {
    // Close all agents when done
    console.log("\nClosing agents...");
    await manusAgent.close();
    console.log("All agents closed");
  }
}

main().catch((error) => {
  console.error(
    "Unhandled error:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
