import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { SessionExpiredError } from "./adminResponse";

type LoadState<T> =
  { data: T; status: "ready" } | { status: "error" } | { status: "loading" };

export function includesQuery(values: string[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return values.some((value) => value.toLowerCase().includes(needle));
}

export function unique<T>(values: T[]) {
  return [...new Set(values)].sort();
}

export function useAdminData<T>(
  load: () => Promise<T>,
  onSessionExpired: () => void,
) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const expire = useEffectEvent(onSessionExpired);
  const fetchData = useEffectEvent(load);

  useEffect(() => {
    let active = true;
    fetchData().then(
      (data) => {
        if (active) setState({ data, status: "ready" });
      },
      (error: unknown) => {
        if (!active) return;
        if (error instanceof SessionExpiredError) expire();
        else setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  function reload() {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  return {
    data: state.status === "ready" ? state.data : undefined,
    reload,
    status: state.status,
  };
}

export function useAdminList<T>(
  load: () => Promise<T[]>,
  onSessionExpired: () => void,
) {
  const { data, reload, status } = useAdminData(load, onSessionExpired);
  const items = useMemo(() => data ?? [], [data]);
  return { items, reload, status };
}
