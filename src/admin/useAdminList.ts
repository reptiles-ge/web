import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { SessionExpiredError } from "./species";

type LoadState<T> =
  { items: T[]; status: "ready" } | { status: "error" } | { status: "loading" };

export function includesQuery(values: string[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return values.some((value) => value.toLowerCase().includes(needle));
}

export function unique<T>(values: T[]) {
  return [...new Set(values)].sort();
}

export function useAdminList<T>(
  load: () => Promise<T[]>,
  onSessionExpired: () => void,
) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const expire = useEffectEvent(onSessionExpired);
  const fetchItems = useEffectEvent(load);

  useEffect(() => {
    let active = true;
    fetchItems().then(
      (items) => {
        if (active) setState({ items, status: "ready" });
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

  const items = useMemo(
    () => (state.status === "ready" ? state.items : []),
    [state],
  );

  function reload() {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  return { items, reload, status: state.status };
}
