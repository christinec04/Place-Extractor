"use client";

import { LINK_KIND_LABELS } from "@/lib/parse-link";
import { ExtractResponse } from "@/lib/types";
import { PlaceCard } from "./place-card";

export function Results({ result }: { result: ExtractResponse }) {
  const { places } = result;

  return (
    <section className="space-y-4 pb-28">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {places.length} places found
          </h2>
          <p className="text-sm text-muted-foreground">
            From {result.videoCount} {result.videoCount === 1 ? "video" : "videos"} ·{" "}
            {LINK_KIND_LABELS[result.kind]}
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {places.map((place) => (
          <li key={place.id}>
            <PlaceCard
              place={place}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}