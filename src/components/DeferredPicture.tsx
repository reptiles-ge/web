"use client";

import {
  type ComponentProps,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const ENGAGEMENT_EVENTS = [
  "keydown",
  "pointerdown",
  "scroll",
  "touchstart",
  "wheel",
] as const;

const listeners = new Set<() => void>();
let engaged = false;

type SourceProps = ComponentProps<"source"> & { key: string };

export function DeferredPicture({
  className,
  img,
  sources,
}: {
  className: string;
  img: ComponentProps<"img"> & { src: string };
  sources: SourceProps[];
}) {
  const ref = useRef<HTMLPictureElement>(null);
  const userEngaged = useUserEngaged();
  const [near, setNear] = useState(false);
  const show = userEngaged || near;

  useEffect(() => {
    const element = ref.current;
    if (show || !element || typeof IntersectionObserver === "undefined") {
      return;
    }
    const target = element.closest("[data-defer-images]") ?? element;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setNear(true);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [show]);

  return (
    <>
      <picture className={className} ref={ref}>
        {show
          ? sources.map(({ key, ...source }) => (
              <source key={key} {...source} />
            ))
          : null}
        <img {...img} alt={img.alt} src={show ? img.src : BLANK_IMAGE} />
      </picture>
      <noscript>
        <picture className={className}>
          <img {...img} alt={img.alt} />
        </picture>
      </noscript>
    </>
  );
}

function engage() {
  if (engaged) return;
  engaged = true;
  toggleEngagementListeners(false);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (!engaged && listeners.size === 0) toggleEngagementListeners(true);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!engaged && listeners.size === 0) toggleEngagementListeners(false);
  };
}

function toggleEngagementListeners(on: boolean) {
  for (const type of ENGAGEMENT_EVENTS) {
    if (on) {
      window.addEventListener(type, engage, { capture: true, passive: true });
    } else {
      window.removeEventListener(type, engage, { capture: true });
    }
  }
}

function useUserEngaged() {
  return useSyncExternalStore(
    subscribe,
    () => engaged,
    () => false,
  );
}
