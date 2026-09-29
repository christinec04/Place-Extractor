#!/usr/bin/env python3
"""Extract places mentioned in a TikTok/Instagram video and resolve them on Google Places.

Usage:
    python extractor.py <video-url>

Requires the ANTHROPIC_API_KEY and GOOGLE_PLACES_API_KEY environment variables.
Prints a JSON object with the resolved places to stdout.
"""

from __future__ import annotations

import argparse
import json
import os
import sys

import requests
import yt_dlp
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

HAIKU_MODEL = "claude-haiku-4-5-20251001"
PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_FIELD_MASK = "places.id,places.formattedAddress,places.googleMapsUri"

EXTRACTION_SYSTEM_PROMPT = """You read a short travel/food video's caption and metadata and list every \
specific, real-world place (restaurant, cafe, bar, shop, attraction, viewpoint, etc.) it mentions or \
recommends. Ignore places named only in passing with no recommendation intent, and ignore generic \
locations (a whole city or country is not a place).

Respond with ONLY a JSON object, no markdown fences and no commentary, shaped like:
{"places": [{"name": "string", "search_query": "string", "category": "restaurant|cafe|bar|attraction|viewpoint|shop", "tip": "string or null", "confidence": 0.0}]}

- "search_query" is what you'd type into Google Maps to find this exact place (include the city if known).
- "tip" is a short, specific takeaway about the place from the caption, or null if there isn't one.
- "confidence" is your 0-1 confidence that this is a real, correctly identified place.
- If no places are mentioned, respond with {"places": []}.
"""


def fetch_video_info(url: str) -> dict:
    ydl_opts = {"skip_download": True, "quiet": True, "no_warnings": True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    extractor = (info.get("extractor") or "").lower()
    platform = "tiktok" if "tiktok" in extractor else "instagram" if "instagram" in extractor else extractor

    return {
        "title": info.get("title") or "",
        "description": info.get("description") or "",
        "uploader": info.get("uploader") or info.get("channel") or "",
        "platform": platform,
    }


def parse_json_response(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned
    return json.loads(cleaned)


def extract_candidates(video_info: dict) -> list[dict]:
    client = Anthropic()
    user_content = (
        f"Platform: {video_info['platform']}\n"
        f"Uploader: {video_info['uploader']}\n"
        f"Title: {video_info['title']}\n"
        f"Caption/description:\n{video_info['description']}\n"
    )

    message = client.messages.create(
        model=HAIKU_MODEL,
        max_tokens=1024,
        system=EXTRACTION_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}],
    )
    text = "".join(block.text for block in message.content if block.type == "text")
    data = parse_json_response(text)
    return data.get("places", [])


def search_place(query: str, api_key: str) -> dict | None:
    response = requests.post(
        PLACES_SEARCH_URL,
        json={"textQuery": query},
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": PLACES_FIELD_MASK,
        },
        timeout=15,
    )
    response.raise_for_status()
    places = response.json().get("places") or []
    if not places:
        return None

    place = places[0]
    place_id = place.get("id")
    maps_url = place.get("googleMapsUri") or (
        f"https://www.google.com/maps/place/?q=place_id:{place_id}" if place_id else None
    )
    return {"place_id": place_id, "address": place.get("formattedAddress"), "maps_url": maps_url}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="TikTok or Instagram video URL")
    args = parser.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Missing ANTHROPIC_API_KEY environment variable.")
    places_api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not places_api_key:
        sys.exit("Missing GOOGLE_PLACES_API_KEY environment variable.")

    try:
        video_info = fetch_video_info(args.url)
    except yt_dlp.utils.DownloadError as exc:
        sys.exit(f"Could not fetch video info: {exc}")

    candidates = extract_candidates(video_info)

    places = []
    for candidate in candidates:
        query = candidate.get("search_query") or candidate.get("name")
        lookup = search_place(query, places_api_key) if query else None
        places.append(
            {
                "name": candidate.get("name"),
                "category": candidate.get("category"),
                "tip": candidate.get("tip"),
                "confidence": candidate.get("confidence"),
                "place_id": lookup["place_id"] if lookup else None,
                "address": lookup["address"] if lookup else None,
                "maps_url": lookup["maps_url"] if lookup else None,
            }
        )

    print(json.dumps({"source_url": args.url, "platform": video_info["platform"], "places": places}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
