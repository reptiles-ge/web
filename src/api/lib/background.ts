import type { Context } from "hono";

export function defer(c: Context) {
  return (task: Promise<unknown>) => inBackground(c, task);
}

export function inBackground(c: Context, task: Promise<unknown>) {
  try {
    c.executionCtx.waitUntil(task);
  } catch {
    void task;
  }
}
