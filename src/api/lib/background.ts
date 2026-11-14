import type { Context } from "hono";

export function inBackground(c: Context, task: Promise<unknown>) {
  try {
    c.executionCtx.waitUntil(task);
  } catch {
    void task;
  }
}
