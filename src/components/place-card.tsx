import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
    <Card
      className={`flex-row items-start gap-4 p-4 transition ${
        selected ? "border-primary ring-1 ring-primary/40" : "border-border ring-0"
      }`}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onToggle}
        aria-label={`Select ${place.name}`}
        className="mt-1 shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span aria-hidden>{CATEGORY_ICONS[place.category]}</span>
          <h3 className="font-semibold">{place.name}</h3>
          <Badge variant="secondary" className="capitalize">
            {place.category}
          </Badge>
          {lowConfidence && (
            <Badge
              variant="outline"
              title="We're not sure this match is right. Check it on Google Maps."
              className="border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
            >
              Check match
            </Badge>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-muted-foreground">{place.address}</p>

        {place.tip && <p className="mt-2 text-sm">“{place.tip}”</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Open in Google Maps ↗
          </a>
          <a
            href={place.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:underline"
          >
            From @{place.source.author} on{" "}
            {place.source.platform === "tiktok" ? "TikTok" : "Instagram"}
          </a>
        </div>
      </div>
    </Card>
  );
}
