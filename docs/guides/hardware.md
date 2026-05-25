---
icon: lucide/cpu
---

# Hardware for Local LLMs

Community hardware data tracked from [Hugging Face Hardware](https://huggingface.co/hardware).

---

## GPU Landscape

<div class="grid cards" markdown>

-   **:material-nvidia: NVIDIA** · 45%

    RTX 30xx 27% · RTX 40xx 27% · RTX 50xx 19% · Datacenter 13%

-   **:material-cpu-64-bit: Apple Silicon** · 35%

    M1–M4 series with unified memory — the local LLM sweet spot.

-   **:material-gpu: AMD** · 5%

    RX 7000 33% · RX 6000/5000 30% · RX 9000 19% · Instinct 5%

</div>

---

## NVIDIA

| GPU | VRAM | Users |
|:----|-----:|------:|
| RTX 3060 | 12 GB | 17k |
| RTX 3090 | 24 GB | 14k |
| RTX 4090 | 24 GB | 14k |
| RTX 5090 | 32 GB | 12k |
| RTX 5070 Ti | 16 GB | 9k |
| RTX 5060 Ti | 16 GB | 8k |
| RTX 4060 Ti | 16 GB | 6k |
| RTX 5080 | 16 GB | 6k |
| RTX 3080 | 12 GB | 6k |
| RTX 4070 Ti Super | 16 GB | 4k |
| RTX 4080 SUPER | 16 GB | 4k |
| H100 | 80 GB | 4k |
| A100 | 80 GB | 3k |
| GB10 (DGX Spark) | 128 GB | 3k |
| T4 | 16 GB | 3k |

## AMD

| GPU | VRAM | Users |
|:----|-----:|------:|
| RX 7900 XTX | 24 GB | 3k |
| RX 7900 XT | 20 GB | 2k |
| RX 7800 XT | 16 GB | 2k |
| RX 6800 XT | 16 GB | 1k |
| MI300X | 192 GB | 1k |

## Apple Silicon

| Chip | Max RAM | Users |
|:-----|--------:|------:|
| M1 | 16 GB | 18k |
| M2 | 24 GB | 15k |
| M3 | 36 GB | 14k |
| M4 | 48 GB | 12k |
| M3 Pro | 36 GB | 10k |
| M4 Pro | 48 GB | 9k |
| M1 Max | 64 GB | 8k |
| M2 Max | 96 GB | 7k |
| M1 Pro | 32 GB | 6k |
| M3 Max | 128 GB | 5k |
| M2 Ultra | 192 GB | 4k |
| M4 Max | 128 GB | 3k |

---

## Model VRAM Guide

| Model Size | Q4_K_M | Q8_0 | FP16 |
|:-----------|:------:|:----:|-----:|
| 7B–8B | 5 GB | 8 GB | 16 GB |
| 13B–14B | 8 GB | 14 GB | 26 GB |
| 34B | 20 GB | 34 GB | 68 GB |
| 70B–72B | 40 GB | 70 GB | 140 GB |
| 405B MoE | 230 GB | — | — |

---

## Recommendations

<div class="grid cards" markdown>

-   **:material-memory: 8 GB VRAM**

    7B–8B models (Llama 4 8B, Mistral 7B, Gemma 3)

-   **:material-memory: 12–16 GB VRAM**

    7B–14B comfortably, 34B with CPU offloading

-   **:material-memory: 24 GB VRAM**

    34B easily, 70B at Q4. The enthusiast sweet spot.

-   **:material-memory: 32 GB+ VRAM**

    70B comfortably, small MoE models. Near-datacenter perf.

-   **:material-apple: Apple Silicon 16 GB+**

    Excellent for 7B–14B via MLX. 20–30% faster than llama.cpp.

-   **:material-apple: Apple Silicon 64 GB+**

    Runs 70B models using unified memory. No GPU offloading needed.

</div>
