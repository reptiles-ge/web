declare module "cloudflare:workers" {
  export type WorkflowEvent<T> = {
    instanceId: string;
    payload: Readonly<T>;
    timestamp: Date;
  };

  export type WorkflowStep = {
    do<T>(name: string, callback: () => Promise<T>): Promise<T>;
    do<T>(
      name: string,
      config: WorkflowStepConfig,
      callback: () => Promise<T>,
    ): Promise<T>;
    sleep(name: string, duration: number | string): Promise<void>;
  };

  export type WorkflowStepConfig = {
    retries?: {
      backoff?: "constant" | "exponential" | "linear";
      delay: number | string;
      limit: number;
    };
    timeout?: number | string;
  };

  export abstract class WorkflowEntrypoint<Env = unknown, T = unknown> {
    protected ctx: unknown;
    protected env: Env;
    constructor(ctx: unknown, env: Env);
    abstract run(
      event: Readonly<WorkflowEvent<T>>,
      step: WorkflowStep,
    ): Promise<unknown>;
  }
}
