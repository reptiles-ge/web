import { cookies, headers } from "next/headers";

import {
  logRequestSnapshot,
  requestInspectorScope,
  snapshotRequest,
} from "@/lib/requestInspector";

export async function inspectServerRequest(label: string) {
  if (process.env.NODE_ENV !== "development") return;
  if (!requestInspectorScope()) return;
  const [headerList, cookieStore] = await Promise.all([headers(), cookies()]);
  logRequestSnapshot(
    snapshotRequest(
      `server:${label}`,
      headerList,
      cookieStore.getAll().map((cookie) => cookie.name),
    ),
  );
}
