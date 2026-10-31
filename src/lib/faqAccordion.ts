import { useId, useState } from "react";

export type FaqItemIds = {
  panelId: string;
  triggerId: string;
};

export function faqItemIds(baseId: string, index: number): FaqItemIds {
  return {
    panelId: `${baseId}-answer-${index}`,
    triggerId: `${baseId}-question-${index}`,
  };
}

export function useFaqAccordion(onOpen?: (index: number) => void) {
  const [open, setOpen] = useState<null | number>(0);
  const baseId = useId();

  return {
    ids: (index: number) => faqItemIds(baseId, index),
    isOpen: (index: number) => open === index,
    toggle: (index: number) => {
      const next = open === index ? null : index;
      setOpen(next);
      if (next !== null) onOpen?.(next);
    },
  };
}
