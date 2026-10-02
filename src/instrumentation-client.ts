type SentryModule = typeof import("@/lib/sentryClient");

const SENTRY_DSN =
  "https://6db3fcbf0eebe4b852d9498135a5678f@o4510170297073664.ingest.us.sentry.io/4512117330608128";
const IDLE_TIMEOUT_MS = 4000;

let sentry: SentryModule | undefined;
let sentryPromise: Promise<SentryModule> | undefined;
const pendingErrors: unknown[] = [];

function loadSentry() {
  sentryPromise ??= import("@/lib/sentryClient").then((module) => {
    module.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
    });
    sentry = module;
    window.removeEventListener("error", onEarlyError);
    window.removeEventListener("unhandledrejection", onEarlyRejection);
    for (const error of pendingErrors.splice(0)) module.captureException(error);
    return module;
  });
  return sentryPromise;
}

function onEarlyError(event: ErrorEvent) {
  queueEarlyError(event.error ?? event.message);
}

function onEarlyRejection(event: PromiseRejectionEvent) {
  queueEarlyError(event.reason);
}

function queueEarlyError(error: unknown) {
  pendingErrors.push(error);
  void loadSentry();
}

if (typeof window !== "undefined") {
  window.addEventListener("error", onEarlyError);
  window.addEventListener("unhandledrejection", onEarlyRejection);
  const start = () => void loadSentry();
  const scheduleWhenIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: IDLE_TIMEOUT_MS });
    } else {
      setTimeout(start, IDLE_TIMEOUT_MS);
    }
  };
  if (document.readyState === "complete") {
    scheduleWhenIdle();
  } else {
    window.addEventListener("load", scheduleWhenIdle, { once: true });
  }
}

export function onRouterTransitionStart(
  ...args: Parameters<SentryModule["captureRouterTransitionStart"]>
) {
  sentry?.captureRouterTransitionStart(...args);
}
