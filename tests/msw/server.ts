import { setupServer } from "msw/node";

export const server = setupServer();

export function recordRequests() {
  const urls: string[] = [];
  const listener = ({ request }: { request: Request }) => {
    urls.push(request.url);
  };
  server.events.on("request:start", listener);
  return {
    stop: () => server.events.removeListener("request:start", listener),
    urls,
  };
}
