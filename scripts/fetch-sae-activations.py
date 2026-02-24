#!/usr/bin/env python3
"""
Fetch SAE feature activations from Neuronpedia for portfolio text.

Uses GemmaScope (Gemma 2 2B, layer 20, 16k width) to get real sparse
autoencoder feature activations on the intro paragraphs, then writes
a static JSON file that the frontend consumes at build time.

Usage:
    NEURONPEDIA_API_KEY=xxx python3 scripts/fetch-sae-activations.py [--force]
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

MODEL_ID = "gemma-2-2b"
SOURCE = "20-gemmascope-res-16k"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sae-activations.json")
NUM_RESULTS = 5
DENSITY_THRESHOLD = 0.01

PARAGRAPHS = [
    "Howdy! I'm a 2nd year CS student at Northeastern University focused on mechanistic interpretability. I'm currently a research fellow at the Supervised Program for Alignment Research working under Santiago Aranguri (PhD @ NYU, Goodfire) on decreasing model evaluation awareness. I'm also a technical fellow at Harvard's AI Safety Student Team.",
    "I was previously at Northeastern's Research in AI Lab in Silicon Valley working on understanding cross-layer superposition.",
]


def api_request(url, data=None, api_key=None, method="GET"):
    """Make an HTTP request to Neuronpedia API."""
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["X-Api-Key"] = api_key

    if data is not None:
        body = json.dumps(data).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    else:
        req = urllib.request.Request(url, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"  HTTP {e.code}: {body[:200]}", file=sys.stderr)
        raise
    except urllib.error.URLError as e:
        print(f"  URL error: {e.reason}", file=sys.stderr)
        raise


def fetch_topk_tokens(text, api_key):
    """Fetch top-k SAE feature activations per token for a text string."""
    url = "https://www.neuronpedia.org/api/search-topk-by-token"
    payload = {
        "modelId": MODEL_ID,
        "source": SOURCE,
        "text": text,
        "numResults": NUM_RESULTS,
        "ignoreBos": True,
        "densityThreshold": DENSITY_THRESHOLD,
    }
    print(f"  Fetching top-k activations for: {text[:60]}...")
    return api_request(url, data=payload, api_key=api_key)


def fetch_feature_explanation(feature_index, api_key):
    """Fetch the autointerp explanation for a specific feature."""
    url = f"https://www.neuronpedia.org/api/feature/{MODEL_ID}/{SOURCE}/{feature_index}"
    return api_request(url, api_key=api_key, method="GET")


def compute_char_offsets(tokens, original_text):
    """
    Map subword tokens back to character offsets in the original string.
    Neuronpedia returns tokens that may have leading spaces or special chars.
    We greedily match each token's text content against the original.
    """
    result = []
    pos = 0

    for token_str in tokens:
        # Clean the token: remove leading special whitespace marker if present
        clean = token_str
        if clean.startswith("▁"):
            clean = " " + clean[1:]

        # Try to find this token starting from current position
        # Handle BOS token or other special tokens
        if clean == "<bos>" or clean == "<eos>" or clean == "<pad>":
            result.append(None)
            continue

        # Find where this token text appears in the original
        idx = original_text.find(clean, pos)
        if idx == -1:
            # Try stripping leading space
            stripped = clean.lstrip()
            idx = original_text.find(stripped, pos)
            if idx != -1:
                clean = stripped

        if idx == -1:
            # Try case-insensitive or partial match
            # Just advance past whitespace and try again
            while pos < len(original_text) and original_text[pos] == " ":
                pos += 1
            stripped = clean.strip()
            if stripped:
                idx = original_text.find(stripped, pos)
                if idx != -1:
                    clean = stripped

        if idx != -1:
            result.append({"start": idx, "end": idx + len(clean), "text": clean})
            pos = idx + len(clean)
        else:
            # Can't find token in text — skip
            result.append(None)

    return result


def process_paragraph(text, api_key):
    """Process one paragraph: fetch activations, compute offsets, pick top feature per token."""
    resp = fetch_topk_tokens(text, api_key)

    # The API returns a list of results per token
    # Each result has: token, topFeatures (list of {featureIndex, activationValue})
    token_results = resp if isinstance(resp, list) else resp.get("results", resp.get("tokens", []))

    # Extract raw token strings for offset computation
    raw_tokens = []
    for item in token_results:
        if isinstance(item, dict):
            raw_tokens.append(item.get("token", ""))
        else:
            raw_tokens.append(str(item))

    offsets = compute_char_offsets(raw_tokens, text)

    tokens_out = []
    feature_indices = set()

    for i, item in enumerate(token_results):
        if offsets[i] is None:
            continue

        if not isinstance(item, dict):
            continue

        top_features = item.get("topFeatures", [])
        if not top_features:
            continue

        # Pick the highest activation feature
        best = max(top_features, key=lambda f: f.get("activationValue", 0))
        act_value = best.get("activationValue", 0)
        feat_idx = best.get("featureIndex")

        if act_value <= 0 or feat_idx is None:
            continue

        tokens_out.append({
            "start": offsets[i]["start"],
            "end": offsets[i]["end"],
            "token": offsets[i]["text"],
            "featureIndex": feat_idx,
            "activation": round(act_value, 4),
        })
        feature_indices.add(feat_idx)

    return tokens_out, feature_indices


def main():
    force = "--force" in sys.argv
    output = os.path.abspath(OUTPUT_PATH)

    if os.path.exists(output) and not force:
        print(f"SAE data already exists at {output}. Use --force to regenerate.")
        return

    api_key = os.environ.get("NEURONPEDIA_API_KEY", "")
    if not api_key:
        # Try loading from .env.local
        env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("NEURONPEDIA_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip("\"'")
                        break
    if not api_key:
        print("Warning: NEURONPEDIA_API_KEY not set. Will attempt without auth.", file=sys.stderr)

    os.makedirs(os.path.dirname(output), exist_ok=True)

    all_paragraphs = []
    all_feature_indices = set()

    for text in PARAGRAPHS:
        try:
            tokens, feat_ids = process_paragraph(text, api_key)
            all_paragraphs.append({"text": text, "tokens": tokens})
            all_feature_indices.update(feat_ids)
            time.sleep(0.5)  # Rate limiting between paragraphs
        except Exception as e:
            print(f"  Error processing paragraph: {e}", file=sys.stderr)
            all_paragraphs.append({"text": text, "tokens": []})

    # Fetch feature explanations and top activating examples
    features = {}
    print(f"\nFetching explanations + activations for {len(all_feature_indices)} unique features...")
    for feat_idx in sorted(all_feature_indices):
        try:
            info = fetch_feature_explanation(feat_idx, api_key)
            explanation = ""
            if isinstance(info, dict):
                explanation = info.get("explanations", [{}])
                if isinstance(explanation, list) and explanation:
                    explanation = explanation[0].get("description", "")
                elif isinstance(explanation, str):
                    pass
                else:
                    explanation = ""

            # Extract top activating examples
            activations = []
            raw_acts = info.get("activations", []) if isinstance(info, dict) else []
            # Sort by maxValue descending, take top 5
            raw_acts = sorted(raw_acts, key=lambda a: a.get("maxValue", 0), reverse=True)
            for act in raw_acts[:5]:
                tokens = act.get("tokens", [])
                values = act.get("values", [])
                max_idx = act.get("maxValueTokenIndex", 0)
                max_val = act.get("maxValue", 0)

                if not tokens or max_val <= 0:
                    continue

                # Trim to a window of ±12 tokens around the max activating token
                window = 12
                start = max(0, max_idx - window)
                end = min(len(tokens), max_idx + window + 1)
                activations.append({
                    "tokens": tokens[start:end],
                    "values": [round(v, 2) for v in values[start:end]],
                    "maxValue": round(max_val, 2),
                    "maxValueTokenIndex": max_idx - start,
                })

            neuronpedia_url = f"https://neuronpedia.org/{MODEL_ID}/{SOURCE}/{feat_idx}"
            features[str(feat_idx)] = {
                "explanation": explanation,
                "url": neuronpedia_url,
                "activations": activations,
            }
            print(f"  Feature {feat_idx}: {explanation[:50]} ({len(activations)} examples)")
            time.sleep(0.3)  # Rate limiting
        except Exception as e:
            print(f"  Error fetching feature {feat_idx}: {e}", file=sys.stderr)
            features[str(feat_idx)] = {
                "explanation": "",
                "url": f"https://neuronpedia.org/{MODEL_ID}/{SOURCE}/{feat_idx}",
                "activations": [],
            }

    data = {
        "model": MODEL_ID,
        "source": SOURCE,
        "paragraphs": all_paragraphs,
        "features": features,
    }

    with open(output, "w") as f:
        json.dump(data, f, indent=2)

    total_tokens = sum(len(p["tokens"]) for p in all_paragraphs)
    print(f"\nWrote {output}")
    print(f"  {len(all_paragraphs)} paragraphs, {total_tokens} tokens, {len(features)} features")


if __name__ == "__main__":
    main()
