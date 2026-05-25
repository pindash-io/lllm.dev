---
icon: lucide/scan-search
date: 2026-02-15
---

# llmfit: one command to find what model runs on your hardware

[AlexsJones](https://github.com/AlexsJones) shipped **llmfit** — a terminal tool that detects your hardware and tells you exactly which models will run well. 26,000 stars and counting.

## What it does

```bash
# That's it. llmfit detects your GPU, RAM, CPU and scores every model.
llmfit
```

The interactive TUI scores each model across four dimensions:

- **Quality** — benchmark performance (MMLU, HumanEval, etc.)
- **Speed** — estimated tokens/sec on your specific hardware
- **Fit** — whether it fits in your VRAM/RAM at the right quantization
- **Context** — max context window you can realistically use

## Why it matters

Choosing a local model is overwhelming. Hundreds of GGUF files, quant levels, model sizes — and no easy way to know what works on *your* machine. llmfit solves this:

| Feature | Detail |
|---------|--------|
| **Hardware detection** | Auto-detects GPU, VRAM, RAM, CPU cores |
| **Provider support** | Ollama, llama.cpp, MLX, Docker Model Runner, LM Studio |
| **Multi-GPU** | Splits models across GPUs automatically |
| **MoE aware** | Understands active vs total parameters for MoE models |
| **Dynamic quantization** | Picks the optimal quant level for your hardware |
| **Community leaderboard** | Real tok/s, TTFT, VRAM data from actual users (powered by localmaxxing.com) |
| **27+ hardware presets** | Simulate RTX 5090 down to Apple M1 with `S` |

## Key bindings

| Key | Feature |
|-----|---------|
| `b` | Community leaderboard — real-world perf from other users |
| `D` | Download manager — queue, history, delete models |
| `A` | Advanced config — tune scoring weights, TPS efficiency |
| `S` | Simulate different hardware |
| `H` | Compare hardware presets before buying |

## Sister projects

AlexsJones also maintains:

- [**sympozium**](https://github.com/sympozium-ai/sympozium/) — managing AI agents in Kubernetes
- [**llmserve**](https://github.com/AlexsJones/llmserve) — TUI for serving local LLM models
- [**llama-panel**](https://github.com/AlexsJones/llama-panel) — native macOS app for llama-server

## Get it

```bash
cargo install llmfit
# or
brew install llmfit
```

[:fontawesome-brands-github: View on GitHub](https://github.com/AlexsJones/llmfit){ .md-button .md-button--primary }
