---
icon: lucide/star
date: 2026-05-06
---

# DwarfStar 4

<div class="hero-subtitle" markdown>
**antirez's DeepSeek V4 Flash inference engine. 11,000 stars in 16 days.** A dedicated local inference engine for Metal and CUDA.
</div>

[:fontawesome-brands-github: View on GitHub](https://github.com/antirez/ds4){ .md-button .md-button--primary }

---

## What is it?

Salvatore Sanfilippo (antirez), the creator of Redis, released **DwarfStar 4** (`ds4`) — a dedicated local inference engine for DeepSeek V4 Flash. Unlike general-purpose runners, ds4 is laser-focused on one model and one goal: make a 284B MoE model feel **finished end-to-end** on local hardware.

```bash
git clone https://github.com/antirez/ds4
cd ds4 && make        # Metal (macOS)
# or
make cuda             # CUDA (Linux)
./ds4 --model ds4-flash-q4_k_m.gguf --prompt "Explain MoE attention"
```

## Why DeepSeek V4 Flash?

| | |
|---|---|
| :material-lightning-bolt: **Speed** | Fewer active parameters per token via Mixture of Experts. Sub-second generation on consumer GPUs. |
| :material-brain: **Smart thinking** | Thinking length scales with problem complexity — often 1/5 of comparable models. |
| :material-expand-all: **1M context** | Native million-token context. No hacks, no sliding window approximations. |
| :material-harddisk: **KV cache on disk** | KV cache lives on SSD, not RAM. Modern NVMe is fast enough for real-time inference. |
| :material-laptop: **Runs on 96GB** | A 284B MoE model on a MacBook. 2-bit quantized, Metal-accelerated. |
| :material-translate: **Frontier quality** | Superior English and Italian generation. Quasi-frontier quality without the cloud. |

## KV cache on disk

The most radical idea: **KV cache lives on disk, not RAM**. Modern MacBook SSDs are fast enough that persisting KV state to NVMe is practical. This changes what "long context" means for local inference.

## Built on llama.cpp

> *"This project would not exist without llama.cpp and GGML. We are thankful and indebted."* — antirez

ds4 doesn't link against GGML but inherits the GGUF quant formats, kernel designs, and ecosystem.
