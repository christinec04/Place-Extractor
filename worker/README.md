# worker

Python script that pulls places out of a TikTok/Instagram video link.

## Setup

```bash
pip install -r requirements.txt
```

Requires two environment variables:

- `ANTHROPIC_API_KEY` — an Anthropic API key (console.anthropic.com).
- `GOOGLE_PLACES_API_KEY` — a Google Cloud API key from a project with **Places API (New)** enabled and billing turned on.

## Run

```bash
python extractor.py <video-url>
```

Prints a JSON object of the form `{"source_url", "platform", "places": [...]}` to stdout,
where each place has `name`, `category`, `tip`, `confidence`, `place_id`, `address`, `maps_url`.
