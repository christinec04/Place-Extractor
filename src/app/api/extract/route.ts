import { MOCK_PLACES } from "@/lib/mock-places";
import { parseLink } from "@/lib/parse-link";
import type { ExtractResponse } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";

  const parsed = parseLink(url);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const response: ExtractResponse = {
    kind: parsed.kind,
    videoCount: parsed.kind === "tiktok_collection" ? MOCK_PLACES.length : 1,
    places: MOCK_PLACES,
  };

  return Response.json(response);
}
