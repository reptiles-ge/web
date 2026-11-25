import { siteDay } from "@/lib/siteTime";

import type { ApiDatabase } from "../db/database";

import { deleteExpiredSessions } from "../db/users";
import { forgetViewVisitorsBefore } from "../db/views";

export async function runDailyCleanup(db: ApiDatabase, now: Date) {
  await deleteExpiredSessions(db, now.toISOString());
  await forgetViewVisitorsBefore(db, siteDay(now));
}
