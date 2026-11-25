import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

import type { ApiBindings } from "./env";

import { app } from "./app";
import { runBackup } from "./lib/backups";

export class BackupWorkflow extends WorkflowEntrypoint<ApiBindings> {
  async run(event: Readonly<WorkflowEvent<unknown>>, step: WorkflowStep) {
    return runBackup(this.env, step, event.timestamp);
  }
}

const worker = { fetch: app.fetch };

export default worker;
