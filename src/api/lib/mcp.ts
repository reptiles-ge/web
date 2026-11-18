import type { z } from "zod";

import type { ApiDatabase } from "../db/database";
import type { mcpMessage } from "../schemas/mcp";

import { mcpToolCallParams } from "../schemas/mcp";
import { MCP_TOOLS } from "./mcpTools";

export const MCP_PROTOCOL_VERSIONS = [
  "2025-11-25",
  "2025-06-18",
  "2025-03-26",
] as const;

const MCP_SERVER_VERSION = "1.0.0";

const JSON_RPC_METHOD_NOT_FOUND = -32_601;

const JSON_RPC_INVALID_PARAMS = -32_602;

const INSTRUCTIONS = `Reptiles.ge is a bilingual scientific atlas of the animals of Georgia (the country in the Caucasus): reptiles and amphibians in depth (Tarkhnishvili et al. 2026 checklist), plus birds, mammals, spiders, scorpions and insects.

- Find species with search_species, then read one with get_species. Read news with search_news and get_news.
- Answer in the user's language with the matching locale (ka, en, ru, tr). Georgian is the canonical text.
- Lists hold published atlas profiles only, not Georgia's complete fauna. An empty or missing field means the atlas has published nothing there, not "none": do not fill it in.
- Cite the url of the page you used, and the photographer when you show a photo.
- The danger level is an educational label, not medical advice. For a snake bite or any emergency in Georgia, tell the user to call 112.`;

export type McpResponse =
  | {
      error: { code: number; data?: unknown; message: string };
      id: RequestId;
      jsonrpc: "2.0";
    }
  | { id: RequestId; jsonrpc: "2.0"; result: Record<string, unknown> };

type McpMessage = z.output<typeof mcpMessage>;

type RequestId = number | string;

export async function answerMcp(
  db: ApiDatabase,
  message: McpMessage,
): Promise<McpResponse | null> {
  const { id } = message;
  if (id === undefined) return null;
  switch (message.method) {
    case "initialize":
      return result(id, {
        capabilities: { tools: {} },
        instructions: INSTRUCTIONS,
        protocolVersion: negotiatedProtocolVersion(
          message.params?.protocolVersion,
        ),
        serverInfo: {
          name: "reptiles-ge",
          title: "Reptiles.ge: animals of Georgia",
          version: MCP_SERVER_VERSION,
          websiteUrl: "https://reptiles.ge",
        },
      });
    case "ping":
      return result(id, {});
    case "tools/call":
      return callTool(db, id, message.params);
    case "tools/list":
      return result(id, {
        tools: MCP_TOOLS.map(({ description, inputSchema, name, title }) => ({
          annotations: {
            idempotentHint: true,
            openWorldHint: false,
            readOnlyHint: true,
          },
          description,
          inputSchema,
          name,
          title,
        })),
      });
    default:
      return failure(id, JSON_RPC_METHOD_NOT_FOUND, "Method not found");
  }
}

async function callTool(db: ApiDatabase, id: RequestId, params: unknown) {
  const call = mcpToolCallParams.safeParse(params);
  if (!call.success) {
    return failure(id, JSON_RPC_INVALID_PARAMS, "Invalid tool call", {
      issues: call.error.issues,
    });
  }
  const tool = MCP_TOOLS.find((known) => known.name === call.data.name);
  if (!tool) {
    return failure(
      id,
      JSON_RPC_INVALID_PARAMS,
      `Unknown tool: ${call.data.name}`,
    );
  }
  const outcome = await tool.run(db, call.data.arguments);
  if (outcome.kind === "invalid") {
    return failure(id, JSON_RPC_INVALID_PARAMS, "Invalid tool arguments", {
      issues: outcome.issues,
    });
  }
  if (outcome.kind === "missing") {
    return result(id, {
      content: [{ text: outcome.message, type: "text" }],
      isError: true,
    });
  }
  return result(id, {
    content: [{ text: JSON.stringify(outcome.data), type: "text" }],
    structuredContent: outcome.data,
  });
}

function failure(
  id: RequestId,
  code: number,
  message: string,
  data?: unknown,
): McpResponse {
  return {
    error: { code, message, ...(data === undefined ? {} : { data }) },
    id,
    jsonrpc: "2.0",
  };
}

function negotiatedProtocolVersion(requested: unknown) {
  return (
    MCP_PROTOCOL_VERSIONS.find((version) => version === requested) ??
    MCP_PROTOCOL_VERSIONS[0]
  );
}

function result(id: RequestId, value: Record<string, unknown>): McpResponse {
  return { id, jsonrpc: "2.0", result: value };
}
