# MCP Agent Examples

This directory contains example usage of the MCP Agent library.

## Overview of Examples

| Example                   | Description                                                                       | Source File                                            | NPM Command                |
| ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------- |
| Basic Usage               | Simple example showing how to initialize an agent and generate a response         | [basic-usage.ts](./src/basic-usage.ts)                 | `npm run basic-usage`      |
| Multiple Servers          | Demonstrates using multiple MCP servers (sequential-thinking and memory) together | [multiple-servers.ts](./src/multiple-servers.ts)       | `npm run multiple-servers` |
| Custom Configuration      | Shows how to configure environment variables and set max steps                    | [custom-config.ts](./src/custom-config.ts)             | `npm run custom-config`    |
| Claude Model              | Example of using Anthropic's Claude model instead of OpenAI                       | [claude-example.ts](./src/claude-example.ts)           | `npm run claude-example`   |
| Image Processing          | Demonstrates sending and processing images with MCP Agent                         | [image-example.ts](./src/image-example.ts)             | `npm run image-example`    |
| PDF Processing            | Shows how to process PDF documents using MCP Agent                                | [pdf-example.ts](./src/pdf-example.ts)                 | `npm run pdf-example`      |
| Find MCP Server           | Example of searching for an appropriate MCP server for a specific task            | [find-mcp.ts](./src/find-mcp.ts)                       | `npm run find-mcp`         |
| Crew Example              | Demonstrates using the crew-style agent architecture                              | [crew-example.ts](./src/crew-example.ts)               | `npm run crew-example`     |
| Manus Like Research Agent | Advanced autonomous agent that performs complex research tasks                    | [manus-like-research.ts](./src/manus-research-task.ts) | `npm run manus-research`   |

## Basic Examples

### 1. Basic Usage

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

dotenv.config();

const agent = new AIAgent({
  name: "sequentialThinking",
  description: "Sequential thinking server",
  model: openai("gpt-4o"),
  toolsConfigs: [Servers.sequentialThinking],
});

// Initialize and use the agent
const response = await agent.generateResponse({
  prompt: "What is 25 * 25?",
  model: openai("gpt-4o-mini"),
});
console.log(response.text);
await agent.close();
```

### 2. Multiple MCP Servers

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

dotenv.config();

const agent = new AIAgent({
  name: "Multi-Capability Agent",
  description: "An agent with multiple specialized capabilities",
  model: openai("gpt-4o"),
  toolsConfigs: [
    Servers.sequentialThinking,
    {
      mcpServers: {
        memory: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-memory"],
        },
      },
    },
  ],
});

await agent.initialize();
const response = await agent.generateResponse(
  "First solve this problem: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?. Then store the result in your Knowledge Graph memory.",
  openai("gpt-4o")
);
console.log(response.text);
await agent.close();
```

### 3. Custom Configuration

```typescript
import { AIAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

dotenv.config();

const agent = new AIAgent({
  name: "Custom Config Agent",
  description: "Agent with custom environment variables",
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

await agent.initialize();
const response = await agent.generateResponse({
  prompt:
    "Solve this complex problem: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?",
  model: openai("gpt-4o"),
  maxSteps: 15,
});
console.log(response.text);
await agent.close();
```

### 4. Using Claude Model

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { anthropic } from "@ai-sdk/anthropic";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const agent = new AIAgent({
  name: "Claude Agent",
  description: "Agent using Anthropic's Claude model",
  model: anthropic("claude-3-7-sonnet-20250219"),
  toolsConfigs: [
    Servers.sequentialThinking,
    {
      type: "tool",
      name: "multiplier",
      description: "Multiply two numbers",
      parameters: z.object({
        a: z.number(),
        b: z.number(),
      }),
      execute: async ({ a, b }) => {
        return a * b;
      },
    },
    {
      type: "tool",
      name: "divider",
      description: "Divide two numbers",
      parameters: z.object({
        a: z.number(),
        b: z.number(),
      }),
      execute: async ({ a, b }) => {
        return a / b;
      },
    },
  ],
});

await agent.initialize();
const response = await agent.generateResponse({
  prompt:
    "Solve this complex problem step by step: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?",
  model: anthropic("claude-3-7-sonnet-20250219"),
  maxSteps: 25,
});
console.log(response.text);
await agent.close();
```

### 5. Processing Images

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import fs from "fs";
import path from "path";

const agent = new AIAgent({
  name: "Image Processing Agent",
  description: "Agent capable of processing images",
  model: openai("gpt-4o"),
  toolsConfigs: [Servers.sequentialThinking],
});

await agent.initialize();

// Read the image file
const imagePath = path.join(__dirname, "../files/equation.png");
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

console.log(response.text);
await agent.close();
```

### 6. Processing PDFs

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import fs from "fs";
import path from "path";

const agent = new AIAgent({
  name: "PDF Processing Agent",
  description: "Agent capable of processing PDF documents",
  model: openai("gpt-4o"),
  toolsConfigs: [Servers.sequentialThinking],
});

await agent.initialize();

// Read the PDF file
const pdfPath = path.join(__dirname, "../files/equation.pdf");
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

console.log(response.text);
await agent.close();
```

### 7. Find MCP Server

```typescript
import { openai } from "@ai-sdk/openai";
import { AIAgent, Servers } from "mcp-ai-agent";

// Ensure required environment variables are set
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

async function main() {
  // Initialize the AIAgent with both the braveSearch and sequentialThinking servers
  const agent = new AIAgent({
    name: "Tool Finder",
    description: "Agent for finding appropriate MCP servers",
    model: openai("gpt-4o"),
    toolsConfigs: [Servers.braveSearch, Servers.sequentialThinking],
  });

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

    // Search for an appropriate MCP server
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
```

## Multi-Agent Workflows (Agent Composition)

You can create specialized agents and compose them into a master agent that can delegate tasks:

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";

// Create specialized agents for different tasks
const sequentialThinkingAgent = new AIAgent({
  name: "Sequential Thinker",
  description:
    "Use this agent to think sequentially and resolve complex problems",
  model: openai("gpt-4o"),
  toolsConfigs: [Servers.sequentialThinking],
});

const braveSearchAgent = new AIAgent({
  name: "Brave Search",
  description: "Use this agent to search the web for the latest information",
  model: openai("gpt-4o"),
  toolsConfigs: [Servers.braveSearch],
});

const memoryAgent = new AIAgent({
  name: "Memory Agent",
  description: "Use this agent to store and retrieve memories",
  model: openai("gpt-4o"),
  toolsConfigs: [
    {
      mcpServers: {
        memory: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-memory"],
        },
      },
    },
  ],
});

// Create a master agent that can use all specialized agents
const masterAgent = new AIAgent({
  name: "Master Agent",
  description: "An agent that can manage and delegate to specialized agents",
  model: openai("gpt-4o"),
  toolsConfigs: [
    {
      type: "agent",
      agent: sequentialThinkingAgent,
    },
    {
      type: "agent",
      agent: memoryAgent,
    },
    {
      type: "agent",
      agent: braveSearchAgent,
    },
  ],
});

// Initialize and use the master agent
const response = await masterAgent.generateResponse({
  prompt: "What is the latest Bitcoin price? Store the answer in memory.",
  model: openai("gpt-4o"),
});

console.log(response.text);

// You can ask the memory agent about information stored by the master agent
const memoryResponse = await masterAgent.generateResponse({
  prompt: "What information have we stored about Bitcoin price?",
  model: openai("gpt-4o"),
});

console.log(memoryResponse.text);
```

## Using Different Models

The MCP Agent supports various AI models through the AI SDK. Here are examples of how to use different models:

### OpenAI Models

```typescript
import { openai } from "@ai-sdk/openai";

// Using GPT-4
const model = openai("gpt-4o");

// Using GPT-3.5
const model = openai("gpt-3.5-turbo");
```

### Claude Models

```typescript
import { anthropic } from "@ai-sdk/anthropic";

// Using Claude 3.7 Sonnet
const model = anthropic("claude-3-7-sonnet-20250219");

// Using Claude 3.7 Sonnet with reasoning middleware
const enhancedModel = wrapLanguageModel({
  model: anthropic("claude-3-7-sonnet-20250219"),
  middleware: extractReasoningMiddleware({ tagName: "think" }),
});
```

It also supports any model supported by Vercel AI SDK that support tool usage: https://sdk.vercel.ai/providers/ai-sdk-providers

## Supported MCP Servers

MCP AI Agent comes with preconfigured support for the following servers:

- **Sequential Thinking**: Use to break down complex problems into steps
- **Memory**: Persistent memory for conversation context
- **AWS KB Retrieval**: Retrieve information from AWS Knowledge Bases
- **Brave Search**: Perform web searches using Brave Search API
- **Everart**: Create and manipulate images using AI
- **Fetch**: Retrieve data from URLs
- **Firecrawl MCP**: Web crawling and retrieval capabilities
- **SQLite**: Query and manipulate SQLite databases

## Running Examples

Follow these steps to run any of the examples:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory with your API keys:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   CLAUDE_API_KEY=your_claude_api_key_here  # Only needed for Claude examples
   ```

3. **Run a specific example**:
   Each example has a corresponding npm script that builds and runs it:

   ```bash
   # Basic usage example
   npm run basic-usage

   # Multiple servers example
   npm run multiple-servers

   # Custom configuration example
   npm run custom-config

   # Claude example
   npm run claude-example

   # Image processing example
   npm run image-example

   # PDF processing example
   npm run pdf-example

   # Find MCP server example
   npm run find-mcp

   # Crew example
   npm run crew-example

   # Advanced Manus-inspired research agent
   npm run manus-research
   ```

4. **Alternative: Run manually**:
   You can also build and run manually:

   ```bash
   # First build the TypeScript files
   npm run build

   # Then run a specific example
   node dist/basic-usage.js
   ```

5. **For image and PDF examples**:
   Make sure the required files exist in the `files` directory:
   - `files/equation.png` - An image containing an equation
   - `files/equation.pdf` - A PDF file containing an equation

## Directory Structure

- `src/basic-usage.ts` - Basic example with sequential thinking and error handling
- `src/multiple-servers.ts` - Example using sequential thinking and memory servers
- `src/custom-config.ts` - Example with custom environment variables and max steps
- `src/claude-example.ts` - Example using Claude model with sequential thinking
- `src/image-example.ts` - Example demonstrating image processing capabilities
- `src/pdf-example.ts` - Example demonstrating PDF processing capabilities
- `src/find-mcp.ts` - Example of searching for an appropriate MCP server for a specific task
- `src/manus-research-task.ts` - Advanced example demonstrating a Manus-like autonomous research agent

## Requirements

- Node.js >= 16.0.0
- npm or yarn
- API keys for the models you want to use
- Environment variables in `.env` file

### 8. Advanced Research Agent (Manus-inspired)

```typescript
import { AIAgent, Servers } from "mcp-ai-agent";
import { anthropic } from "@ai-sdk/anthropic";
import * as dotenv from "dotenv";

// Create a specialized web research agent with custom system prompt
const braveSearchAgent = new AIAgent({
  name: "Research Agent",
  description: "Use this agent to search the web for information",
  systemPrompt:
    "You are a specialized web research agent with expertise in finding accurate and relevant information. When given a search query:\n\n1. Formulate effective search queries that target the most reliable sources\n2. Evaluate search results critically for reliability and relevance\n3. Extract key information, paying attention to dates, authors, and credibility\n4. When possible, verify information across multiple sources\n5. Save important findings with proper citations including URLs and publication dates\n6. Prioritize academic, governmental, and established industry sources \n7. Provide comprehensive information rather than superficial summaries\n8. When searching technical topics, focus on authoritative technical documentation\n9. Identify contradictory information and highlight areas of consensus vs. debate\n10. Clearly separate facts from opinions or speculative content\n\nYour goal is to gather thorough and accurate information to support high-quality research and decision-making.",
  model: anthropic("claude-3-7-sonnet-20250219"),
  toolsConfigs: [Servers.braveSearch, Servers.sequentialThinking],
});

// Create the master Manus-like agent
const manusAgent = new AIAgent({
  name: "Manus Research Agent",
  description:
    "An autonomous AI agent that performs comprehensive research and generates detailed reports",
  model: anthropic("claude-3-7-sonnet-20250219"),
  toolsConfigs: [
    { type: "agent", agent: braveSearchAgent },
    Servers.sequentialThinking,
    Servers.fileSystem,
  ],
});

// Example task: Comprehensive research on quantum computing's impact on cybersecurity
// The agent will:
// 1. Plan the research by breaking it into steps
// 2. Conduct web research using the specialized search agent
// 3. Save findings to files using the fileSystem server
// 4. Analyze the data using sequential thinking
// 5. Generate a comprehensive report
// 6. Store key findings in memory

// The example also demonstrates:
// - Following up with memory-based questions
// - Complex multi-step task execution
// - Autonomous decision making
```

This example demonstrates an advanced autonomous agent implementation inspired by Manus. It showcases:

- Using a specialized research agent with a custom system prompt
- Breaking down complex research tasks into steps
- Working with multiple MCP servers (sequential thinking, file system)
- Generating comprehensive research reports
- Persisting information through files
- Handling multi-step workflows autonomously

Documents are created by default under `~/Documents`

This is an excellent example for understanding how to build more powerful agent architectures that can handle complex, open-ended tasks requiring multiple capabilities working together.
