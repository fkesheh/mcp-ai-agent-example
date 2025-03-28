# MCP Agent Examples

This directory contains example usage of the MCP Agent library.

## Overview of Examples

| Example              | Description                                                                       | Source File                                      |
| -------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| Basic Usage          | Simple example showing how to initialize an agent and generate a response         | [basic-usage.ts](./src/basic-usage.ts)           |
| Multiple Servers     | Demonstrates using multiple MCP servers (sequential-thinking and memory) together | [multiple-servers.ts](./src/multiple-servers.ts) |
| Custom Configuration | Shows how to configure environment variables and set max steps                    | [custom-config.ts](./src/custom-config.ts)       |
| Claude Model         | Example of using Anthropic's Claude model instead of OpenAI                       | [claude-example.ts](./src/claude-example.ts)     |
| Image Processing     | Demonstrates sending and processing images with MCP Agent                         | [image-example.ts](./src/image-example.ts)       |
| PDF Processing       | Shows how to process PDF documents using MCP Agent                                | [pdf-example.ts](./src/pdf-example.ts)           |

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

### 5. Processing Images

```typescript
import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import fs from "fs";
import path from "path";

const agent = new MCPAgent({
  mcpServers: {
    "sequential-thinking": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
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
import { MCPAgent } from "mcp-ai-agent";
import { openai } from "@ai-sdk/openai";
import fs from "fs";
import path from "path";

const agent = new MCPAgent({
  mcpServers: {
    "sequential-thinking": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
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

3. **Build and run a specific example**:
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

- `basic-usage.ts` - Basic example with sequential thinking and error handling
- `multiple-servers.ts` - Example using sequential thinking and memory servers
- `custom-config.ts` - Example with custom environment variables and max steps
- `claude-example.ts` - Example using Claude model with sequential thinking
- `image-example.ts` - Example demonstrating image processing capabilities
- `pdf-example.ts` - Example demonstrating PDF processing capabilities

## Requirements

- Node.js >= 16.0.0
- npm or yarn
- API keys for the models you want to use
- Environment variables in `.env` file
