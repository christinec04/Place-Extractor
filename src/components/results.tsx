"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LINK_KIND_LABELS } from "@/lib/parse-link";
import type { ExtractResponse, Place } from "@/lib/types";
import { CONFIDENT, PlaceCard } from "./place-card";

// Confident matches start out selected.
const AUTO_SELECT_CONFIDENCE = CONFIDENT;

export function Results({ result }: { result: ExtractResponse }) {
  const { places } = result;
  const [selected, setSelected] = useState<Set<string>>(
    () =>
      new Set(
        places.filter((p) => p.confidence >= AUTO_SELECT_CONFIDENCE).map((p) => p.id),
      ),
  );

  const allSelected = selected.size === places.length;
  const selectedPlaces = places.filter((p) => selected.has(p.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(places.map((p) => p.id)));
  }

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
        <Button type="button" variant="link" onClick={toggleAll} className="h-auto p-0 text-sm">
          {allSelected ? "Deselect all" : "Select all"}
        </Button>
      </div>

      <ul className="space-y-3">
        {places.map((place) => (
          <li key={place.id}>
            <PlaceCard
              place={place}
              selected={selected.has(place.id)}
              onToggle={() => toggle(place.id)}
            />
          </li>
        ))}
      </ul>

      <ExportBar places={selectedPlaces} />
    </section>
  );
}

function ExportBar({ places }: { places: Place[] }) {
  const count = places.length;

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <p className="text-sm">
          <span className="font-semibold">{count}</span> selected
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={count === 0}
            onClick={() => downloadCsv(places)}
            className="h-9 rounded-xl px-4"
          >
            Download CSV
          </Button>
          <Button
            type="button"
            disabled
            title="Coming soon: sign in with Google to save these to My Maps"
            className="h-9 rounded-xl px-4"
          >
            Save to Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}

// CSV with Name/Address columns imports directly into Google My Maps.
function downloadCsv(places: Place[]) {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = [
    ["Name", "Address", "Category", "Tip", "Google Maps", "Source"],
    ...places.map((p) => [
      p.name,
      p.address,
      p.category,
      p.tip ?? "",
      p.googleMapsUrl,
      p.source.url,
    ]),
  ];
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "places.csv";
  link.click();
  URL.revokeObjectURL(url);
}