import { MOCK_PLACES } from "@/lib/mock-places";
import { parseLink } from "@/lib/parse-link";
import type { ExtractResponse } from "@/lib/types";

// Mock endpoint: validates the link, then returns a fixed set of places.
// Later this will enqueue a job for the Python worker instead.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseLink(typeof body?.url === "string" ? body.url : "");

  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const response: ExtractResponse = {
    kind: parsed.kind,
    videoCount: parsed.kind === "tiktok_collection" ? 3 : 1,
    places: MOCK_PLACES,
  };
  return Response.json(response);
}
