import type { Place, PlaceCategory } from "@/lib/types";

export const CONFIDENT = 0.75;

const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  bar: "🍸",
  attraction: "🎟️",
  viewpoint: "🌅",
  shop: "🛍️",
};

interface Props {
  place: Place;
  selected: boolean;
  onToggle: () => void;
}

export function PlaceCard({ place, selected, onToggle }: Props) {
  const lowConfidence = place.confidence < CONFIDENT;

  return (
    <article
      className={`flex gap-4 rounded-2xl border bg-card p-4 transition ${
        selected ? "border-accent ring-1 ring-accent/40" : "border-border"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        aria-label={`Select ${place.name}`}
        className="mt-1 size-5 shrink-0 cursor-pointer accent-accent"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span aria-hidden>{CATEGORY_ICONS[place.category]}</span>
          <h3 className="font-semibold">{place.name}</h3>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs capitalize text-accent">
            {place.category}
          </span>
          {lowConfidence && (
            <span
              title="We're not sure this match is right. Check it on Google Maps."
              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            >
              Check match
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-muted">{place.address}</p>

        {place.tip && <p className="mt-2 text-sm">“{place.tip}”</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            Open in Google Maps ↗
          </a>
          <a
            href={place.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:underline"
          >
            From @{place.source.author} on{" "}
            {place.source.platform === "tiktok" ? "TikTok" : "Instagram"}
          </a>
        </div>
      </div>
    </article>
  );
}
