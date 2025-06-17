#!/usr/bin/env node
import { getParamValue, getAuthValue } from "@chatmcp/sdk/utils/index.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { betterFetch } from "@better-fetch/fetch";
import { RestServerTransport } from "@chatmcp/sdk/server/rest.js";

// support for mcp.so
const ai302ApiKey = getParamValue("302ai_api_key");
const mode = getParamValue("mode") || "stdio";
const port = getParamValue("port") || 9593;
const endpoint = getParamValue("endpoint") || "/rest";

interface ToolCallResponse {
  result: any;
  logs: any;
}

class AI302Api {
  private baseUrl = "https://api.302.ai/mcp";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async listTools(): Promise<Tool[]> {
    const url = new URL(`${this.baseUrl}/v1/tool/list`);
    url.searchParams.append("packId", "sandboxTools");
    url.searchParams.append("user302", "user302");
    const { data, error } = await betterFetch<{
      tools: Tool[];
    }>(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        error.message ?? "Unknown error",
      );
    }

    return data.tools;
  }

  async callTool(name: string, arguments_: any): Promise<ToolCallResponse> {
    const { data, error } = await betterFetch<any>(
      `${this.baseUrl}/v1/tool/call`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "x-api-key": this.apiKey,
        },
        body: {
          nameOrId: name,
          arguments: arguments_,
        },
      },
    );

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        error.message ?? "Unknown error",
      );
    }

    return data;
  }
}

class AI302Server {
  private server: Server;
  private api: AI302Api | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "302ai-sandbox-mcp",
        version: "0.2.1",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.setupToolHandlers();
  }

  private getApiInstance(request?: any): AI302Api {
    const apiKey =
      ai302ApiKey ||
      (request && getAuthValue(request, "302AI_API_KEY")) ||
      process.env["302AI_API_KEY"];
    if (!apiKey) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "API key is required to call the tool",
      );
    }

    if (!this.api || this.api.getApiKey() !== apiKey) {
      this.api = new AI302Api(apiKey);
    }

    return this.api;
  }

  private async setupToolHandlers(): Promise<void> {
    this.server.setRequestHandler(ListToolsRequestSchema, async (request) => {
      // Re-fetch tools with request-specific API key if available
      const api = this.getApiInstance(request);
      const tools = await api.listTools();
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const api = this.getApiInstance(request);
      const content = await api.callTool(
        request.params.name,
        request.params.arguments,
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ content }, null, 2),
          },
        ],
      };
    });
  }

  async run(): Promise<void> {
    // for mcp.so
    if (mode === "rest") {
      const transport = new RestServerTransport({
        port: Number(port),
        endpoint: endpoint,
      });
      await this.server.connect(transport);

      await transport.startServer();

      return;
    }

    // for local mcp server
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new AI302Server();
server.run().catch(console.error);
