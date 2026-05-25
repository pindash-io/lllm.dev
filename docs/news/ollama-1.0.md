---
icon: simple/ollama
date: 2026-05-15
---

# Ollama 1.0 is here

After two years of rapid iteration, Ollama has reached 1.0. The milestone release brings stability guarantees and a handful of long-requested features.

## What's new in 1.0

### Multi-GPU support

Ollama can now split models across multiple GPUs automatically:

```bash
# No config needed — Ollama detects and uses all GPUs
ollama run llama4:70b  # Splits across 2x 24GB GPUs
```

### Model caching

Frequently used models are now kept warm in VRAM, cutting cold-start latency from seconds to milliseconds:

```bash
ollama cache warm llama4:8b  # Pre-load into VRAM
ollama cache list             # View cached models
ollama cache drop llama4:8b   # Free VRAM
```

### Streaming API improvements

The REST API now supports Server-Sent Events (SSE) with per-token metadata:

```json
{"token": "Hello", "prob": 0.98, "speed": 48.2, "index": 0}
{"token": " world", "prob": 0.95, "speed": 48.5, "index": 1}
```

### Breaking changes (minimal!)

- The `Modelfile` syntax is versioned (`FROM llama4:8b` is now `FROM ollama://llama4:8b`)
- Deprecated `ollama create --from`; use `ollama pull` instead

## Migration guide

```bash
# Upgrade
curl -fsSL https://ollama.com/install.sh | sh

# Check version
ollama --version  # 1.0.0

# Migrate Modelfiles (automatic for most cases)
ollama migrate
```

## What's next

The roadmap for 1.x includes built-in function calling, speculative decoding, and a web dashboard. But 1.0 is already the most polished local LLM experience available — and it's still free.
