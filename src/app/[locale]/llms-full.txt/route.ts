import {
  llmsFileResponse,
  type LlmsRouteContext,
  llmsStaticParams,
} from "@/lib/llmsResponse";

export const dynamic = "force-static";

export const generateStaticParams = llmsStaticParams;

export async function GET(_request: Request, { params }: LlmsRouteContext) {
  return llmsFileResponse("full", (await params).locale);
}
