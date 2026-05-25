---
icon: material/vulkan
date: 2026-05-05
---

# llama.cpp gets Vulkan backend

The wait is over. llama.cpp now ships with a production-ready Vulkan backend, bringing GPU-accelerated inference to virtually any GPU on any platform.

## Why this is huge

Until now, GPU inference in llama.cpp meant:

- **CUDA** — NVIDIA only
- **Metal** — Apple only
- **ROCm** — AMD Linux only (and finicky)

Vulkan changes everything. It runs on **NVIDIA, AMD, Intel, and mobile GPUs** across **Windows, Linux, and Android**. One backend, everywhere.

## Quick setup

```bash
# Build with Vulkan (requires Vulkan SDK)
cmake -B build -DGGML_VULKAN=ON
cmake --build build --config Release

# Run any GGUF model on GPU
./build/bin/llama-cli \
  -m mistral-7b-q4_k_m.gguf \
  -ngl 99 \
  -p "Write a haiku about local AI"
```

The `-ngl 99` flag offloads all layers to GPU. Adjust based on VRAM.

## Benchmarks

**AMD RX 7800 XT (16GB)** — Mistral 7B Q4_K_M:

| Backend | Tokens/sec | Notes |
|---------|-----------|-------|
| Vulkan | 98.2 | New default for AMD |
| ROCm | 95.7 | Requires Linux + ROCm SDK |
| CPU (32 threads) | 18.4 | Ryzen 7950X |

**Intel Arc A770 (16GB)**:

| Backend | Tokens/sec |
|---------|-----------|
| Vulkan | 72.1 |
| CPU | 14.8 |

## Limitations

- Vulkan compute shaders can't always match hand-tuned CUDA kernels (NVIDIA cards: ~15% slower than CUDA backend)
- Requires Vulkan 1.2+ capable GPU
- Some exotic quantization types not yet supported

## Bottom line

If you have an AMD or Intel GPU, this is a game-changer. One-line build, no driver drama, and performance that finally makes local LLMs practical outside the NVIDIA ecosystem.
