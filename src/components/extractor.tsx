"use client";

import { useState } from "react";
import { LINK_KIND_LABELS, parseLink } from "@/lib/parse-link";
import type { ExtractResponse } from "@/lib/types";
import { Results } from "./results";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; result: ExtractResponse };

export function Extractor() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  const parsed = url.trim() ? parseLink(url) : null;
  const detected = parsed && "kind" in parsed ? LINK_KIND_LABELS[parsed.kind] : null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const check = parseLink(url);
    if ("error" in check) {
      setState({ status: "error", message: check.error });
      return;
    }

    setState({ status: "loading" });
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState({ status: "done", result: data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            inputMode="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@creator/video/…"
            aria-label="TikTok or Instagram link"
            className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-3 outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            disabled={state.status === "loading"}
            className="rounded-xl bg-accent px-5 py-3 font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {state.status === "loading" ? "Extracting…" : "Extract places"}
          </button>
        </div>
        <p className="h-5 text-sm text-muted">
          {detected && state.status !== "loading" && <>Detected: {detected}</>}
        </p>
      </form>

      {state.status === "loading" && <LoadingSkeleton />}

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {state.message}
        </p>
      )}

      {state.status === "done" && <Results result={state.result} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite">
      <p className="text-sm text-muted">Watching the video and looking for places…</p>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl border border-border bg-card"
        />
      ))}
    </div>
  );
}
