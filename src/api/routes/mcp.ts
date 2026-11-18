import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { answerMcp, MCP_PROTOCOL_VERSIONS } from "../lib/mcp";
import { validate } from "../lib/validate";
import { rateLimitMcp } from "../middleware/rateLimitMcp";
import { mcpMessage, mcpProtocolHeader } from "../schemas/mcp";

const SUPPORTED_VERSIONS: readonly string[] = MCP_PROTOCOL_VERSIONS;

export const mcp = new Hono<ApiEnv>()
  .post(
    "/",
    rateLimitMcp,
    validate("header", mcpProtocolHeader),
    validate("json", mcpMessage),
    async (c) => {
      const version = c.req.valid("header")["mcp-protocol-version"];
      if (version !== undefined && !SUPPORTED_VERSIONS.includes(version)) {
        throw new ApiError(400, "invalid_request", "Unsupported MCP version", [
          {
            message: `Supported: ${MCP_PROTOCOL_VERSIONS.join(", ")}`,
            path: "MCP-Protocol-Version",
          },
        ]);
      }
      c.header("Cache-Control", NO_STORE);
      const answer = await answerMcp(c.env.DB, c.req.valid("json"));
      return answer ? c.json(answer, 200) : c.body(null, 202);
    },
  )
  .get("/", (c) => {
    c.header("Allow", "POST");
    throw new ApiError(
      405,
      "method_not_allowed",
      "This MCP server answers POST only and opens no event stream",
    );
  });
