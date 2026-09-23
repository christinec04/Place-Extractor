export type LinkKind = "tiktok_video" | "tiktok_collection" | "instagram_reel";

export type PlaceCategory =
  | "restaurant"
  | "cafe"
  | "bar"
  | "attraction"
  | "viewpoint"
  | "shop";

export interface SourceVideo {
  platform: "tiktok" | "instagram";
  url: string;
  author: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  category: PlaceCategory;
  tip?: string;
  confidence: number;
  googleMapsUrl: string;
  source: SourceVideo;
}

export interface ExtractResponse {
  kind: LinkKind;
  videoCount: number;
  places: Place[];
}
