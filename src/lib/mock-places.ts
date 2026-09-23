import type { Place } from "./types";

// Placeholder results until the Python worker exists. Real places, so the
// Google Maps links resolve.

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const tiktok = (author: string, id: string) => ({
  platform: "tiktok" as const,
  author,
  url: `https://www.tiktok.com/@${author}/video/${id}`,
});

const instagram = (author: string, code: string) => ({
  platform: "instagram" as const,
  author,
  url: `https://www.instagram.com/reel/${code}/`,
});

export const MOCK_PLACES: Place[] = [
  {
    id: "pasteis-de-belem",
    name: "Pastéis de Belém",
    address: "R. de Belém 84-92, 1300-085 Lisboa, Portugal",
    category: "cafe",
    tip: "Skip the takeaway line and grab a table inside, it moves faster.",
    confidence: 0.96,
    googleMapsUrl: mapsUrl("Pastéis de Belém, Lisbon"),
    source: tiktok("lisbonbites", "7301234567890123456"),
  },
  {
    id: "time-out-market",
    name: "Time Out Market Lisboa",
    address: "Av. 24 de Julho 49, 1200-479 Lisboa, Portugal",
    category: "restaurant",
    tip: "Go before noon on weekdays to actually find a seat.",
    confidence: 0.93,
    googleMapsUrl: mapsUrl("Time Out Market Lisboa"),
    source: tiktok("lisbonbites", "7301234567890123456"),
  },
  {
    id: "senhora-do-monte",
    name: "Miradouro da Senhora do Monte",
    address: "Largo Monte, 1170-253 Lisboa, Portugal",
    category: "viewpoint",
    tip: "Best sunset view in the city. Take tram 28 up.",
    confidence: 0.9,
    googleMapsUrl: mapsUrl("Miradouro da Senhora do Monte, Lisbon"),
    source: instagram("wander.with.ana", "C8xYz12AbCd"),
  },
  {
    id: "cervejaria-ramiro",
    name: "Cervejaria Ramiro",
    address: "Av. Almirante Reis 1, 1150-007 Lisboa, Portugal",
    category: "restaurant",
    tip: "Order the garlic prawns and finish with a steak sandwich.",
    confidence: 0.88,
    googleMapsUrl: mapsUrl("Cervejaria Ramiro, Lisbon"),
    source: tiktok("eatwithjules", "7309876543210987654"),
  },
  {
    id: "lx-factory",
    name: "LX Factory",
    address: "R. Rodrigues de Faria 103, 1300-501 Lisboa, Portugal",
    category: "shop",
    tip: "Ler Devagar bookshop inside is the highlight.",
    confidence: 0.84,
    googleMapsUrl: mapsUrl("LX Factory, Lisbon"),
    source: instagram("wander.with.ana", "C8xYz12AbCd"),
  },
  {
    id: "park-bar",
    name: "Park Bar",
    address: "Calçada do Combro 58, 1200-123 Lisboa, Portugal",
    category: "bar",
    tip: "Rooftop on top of a parking garage. Take the lift to level 5.",
    confidence: 0.62,
    googleMapsUrl: mapsUrl("Park Bar, Calçada do Combro, Lisbon"),
    source: tiktok("eatwithjules", "7309876543210987654"),
  },
];
