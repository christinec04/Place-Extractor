import { Extractor } from "@/components/extractor";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-20">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Place Extractor</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Turn travel videos into a map
        </h1>
        <p className="mt-3 text-muted-foreground">
          Paste a TikTok video, TikTok collection or Instagram reel. We&apos;ll
          find the places mentioned and you choose which to save to Google Maps.
        </p>
      </header>
      <Extractor />
    </main>
  );
}