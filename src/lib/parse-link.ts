import type { LinkKind } from "./types";

export type ParsedLink = { kind: LinkKind; url: string } | { error: string };

export const LINK_KIND_LABELS: Record<LinkKind, string> = {
  tiktok_video: "TikTok video",
  tiktok_collection: "TikTok collection",
  instagram_reel: "Instagram reel",
};

export function parseLink(input: string): ParsedLink {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { error: "That doesn't look like a link." };
  }

  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    if (/^\/@[^/]+\/collection\/[^/]+/.test(path)) {
      return { kind: "tiktok_collection", url: url.toString() };
    }
    // Short links (vm./vt.tiktok.com, tiktok.com/t/...) redirect to a video;
    // the worker resolves the redirect.
    if (
      /^\/@[^/]+\/video\/\d+/.test(path) ||
      host === "vm.tiktok.com" ||
      host === "vt.tiktok.com" ||
      path.startsWith("/t/")
    ) {
      return { kind: "tiktok_video", url: url.toString() };
    }
    return { error: "Paste a TikTok video or collection link." };
  }

  if (host === "instagram.com") {
    if (/^\/(reels?|p)\/[\w-]+/.test(path)) {
      return { kind: "instagram_reel", url: url.toString() };
    }
    return { error: "Paste an Instagram reel link." };
  }

  return { error: "Only TikTok and Instagram links are supported." };
}