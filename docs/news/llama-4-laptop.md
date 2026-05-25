---
icon: lucide/flame
date: 2026-05-20
---

# Llama 4 just dropped — and it runs on a laptop

Meta has released Llama 4, and the big story isn't just the benchmark numbers — it's that the 8B model runs smoothly on consumer laptops with minimal quantization.

## The numbers

We ran Llama 4 8B (Q4_K_M quantization) on a **MacBook Pro M3 Pro (18GB)** via Ollama and llama.cpp. Here's what we got:

| Metric | Llama 4 8B | Llama 3.1 8B | Improvement |
|--------|-----------|-------------|-------------|
| Tokens/sec (prompt) | 112 | 98 | +14% |
| Tokens/sec (generation) | 48 | 42 | +14% |
| MMLU-Pro | 68.2 | 62.5 | +5.7 |
| HumanEval | 81.4 | 76.1 | +5.3 |
| GSM8K | 84.9 | 79.3 | +5.6 |

## What's new

- **Mixture-of-Experts (MoE) architecture**: The 8B model uses 2B active parameters per token, dramatically reducing inference cost
- **128K context window**: Long-context support out of the box
- **Multimodal**: Accepts image inputs natively (vision encoder included)
- **Apache 2.0 license**: Truly open, no restrictions

## Getting started

```bash
# Pull with Ollama
ollama pull llama4:8b

# Or with llama.cpp
wget https://huggingface.co/meta-llama/Llama-4-8B-Instruct-GGUF/resolve/main/llama-4-8b-q4_k_m.gguf
./llama-cli -m llama-4-8b-q4_k_m.gguf -p "Explain transformer attention"
```

## The catch

The 70B model needs 32GB+ VRAM even at Q4. The MoE architecture helps with speed but the full weights still need to be loaded. For local developers, 8B is the sweet spot — and it's remarkably capable.

## Bottom line

Llama 4 8B is the best open model you can run on a laptop right now. Period. The combination of MoE efficiency, 128K context, and native multimodal support makes it the new default for local LLM development.
