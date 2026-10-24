import { builtinEnvironments, type Environment } from "vitest/runtime";

const NODE_NETWORK_GLOBALS = [
  "AbortController",
  "AbortSignal",
  "fetch",
  "Headers",
  "Request",
  "Response",
] as const;

const happyDom = builtinEnvironments["happy-dom"];

export default {
  ...happyDom,
  name: "happy-dom-node-fetch",
  async setup(global, options) {
    const descriptors = NODE_NETWORK_GLOBALS.map(
      (key) => [key, Object.getOwnPropertyDescriptor(global, key)] as const,
    );
    const environment = await happyDom.setup(global, options);
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(global, key, descriptor);
    }
    return environment;
  },
  viteEnvironment: "ssr",
} satisfies Environment;
