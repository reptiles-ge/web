import type { ReactNode } from "react";

export type NewsMonthItem = {
  card: ReactNode;
  id: string;
  monthKey: string;
};

export function groupNewsByMonth<T extends NewsMonthItem>(items: readonly T[]) {
  const groups: Array<{ items: T[]; key: string }> = [];
  for (const item of items) {
    const group = groups.find((entry) => entry.key === item.monthKey);
    if (group) group.items.push(item);
    else groups.push({ items: [item], key: item.monthKey });
  }
  return groups;
}
