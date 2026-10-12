import { newsFeedResponse } from "@/lib/newsFeedResponse";

export const dynamic = "force-static";

export function GET() {
  return newsFeedResponse("ka");
}
