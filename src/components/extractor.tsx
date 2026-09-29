"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LINK_KIND_LABELS, parseLink } from "@/lib/parse-link";
import type { ExtractResponse } from "@/lib/types";
import { LoadingSkeleton } from "./loading";

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
          <Input
            type="url"
            inputMode="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@creator/video/…"
            aria-label="TikTok or Instagram link"
            className="h-12 min-w-0 flex-1 rounded-xl px-4 text-base"
          />
          <Button
            type="submit"
            disabled={state.status === "loading"}
            className="h-12 rounded-xl px-5 text-base"
          >
            {state.status === "loading" ? "Extracting…" : "Extract places"}
          </Button>
        </div>
        <p className="h-5 text-sm text-muted-foreground">
          {detected && state.status !== "loading" && <>Detected: {detected}</>}
        </p>
      </form>

      {state.status === "loading" && <LoadingSkeleton />}

      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}