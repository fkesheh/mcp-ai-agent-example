# MCP Agent Examples

This directory contains example usage of the MCP Agent library.

## Basic Examples

### 1. Basic Usage

```typescript
import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

dotenv.config();

const agent = new MCPAgent({
  mcpServers: {
    "sequential-thinking": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
});

await agent.initialize();
const response = await agent.generateResponse(
  "Solve 23 * 17",
  openai("gpt-4o")
);
console.log(response);
await agent.close();
```

### 2. Multiple MCP Servers

```typescript
import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

dotenv.config();

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

await agent.initialize();
const response = await agent.generateResponse(
  "First solve this problem: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?. Then store the result in your Knowledge Graph memory.",
  openai("gpt-4o")
);
console.log(response);
await agent.close();
```

### 3. Custom Configuration

```typescript
import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

dotenv.config();

const agent = new MCPAgent({
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
});

await agent.initialize();
const response = await agent.generateResponse(
  "Solve this complex problem: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?",
  openai("gpt-4o"),
  15 // maxSteps
);
console.log(response);
await agent.close();
```

### 4. Using Claude Model

```typescript
import { MCPAgent } from "mcp-ai-agent";
import { claude } from "@ai-sdk/claude";
import * as dotenv from "dotenv";

dotenv.config();

const agent = new MCPAgent({
  mcpServers: {
    "sequential-thinking": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
});

await agent.initialize();
const response = await agent.generateResponse(
  "Solve this complex problem step by step: If a train leaves station A traveling east at 80 km/h, and another train leaves station B (300 km away) traveling west at 65 km/h at the same time, how long will it take for the trains to meet, and how far from station A will they meet?",
  claude("claude-3.7-sonnet"),
  25 // Max steps
);
console.log(response);
await agent.close();
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
import { claude } from "@ai-sdk/claude";

// Using Claude 3.7 Sonnet
const model = claude("claude-3.7-sonnet");

// Using Claude 3.7 Sonnet with reasoning middleware
const enhancedModel = wrapLanguageModel({
  model: claude("claude-3.7-sonnet"),
  middleware: extractReasoningMiddleware({ tagName: "think" }),
});
```

It also supports any model supported by Vercel AI SDK that support tool usage: https://sdk.vercel.ai/providers/ai-sdk-providers

## Running Examples

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your API keys:

```bash
OPENAI_API_KEY=your_openai_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
```

3. Run an example using npm scripts:

```bash
# Basic usage example
npm run basic-usage

# Multiple servers example
npm run multiple-servers

# Custom configuration example
npm run custom-config

# Claude example
npm run claude-example
```

## Directory Structure

- `basic-usage.ts` - Basic example with sequential thinking and error handling
- `multiple-servers.ts` - Example using sequential thinking and memory servers
- `custom-config.ts` - Example with custom environment variables and max steps
- `claude-example.ts` - Example using Claude model with sequential thinking

## Requirements

- Node.js >= 16.0.0
- npm or yarn
- API keys for the models you want to use
- Environment variables in `.env` file
