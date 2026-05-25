---
icon: lucide/zap
---

# Running Models

A practical guide to running models of any size on your hardware.

## Understanding model sizes

The "B" in model names (7B, 13B, 70B) means **billions of parameters**. More parameters = smarter model, but more RAM needed.

### Quantization explained

Raw models use 16-bit floats (2 bytes per parameter). Quantization reduces precision to save space:

| Format | Bits/param | 7B model size | Quality loss |
|--------|-----------|---------------|--------------|
| FP16 | 16 | 14 GB | None (reference) |
| Q8_0 | 8 | 7 GB | Negligible |
| Q6_K | 6 | 5.3 GB | Barely perceptible |
| Q5_K_M | 5 | 4.5 GB | Minor |
| Q4_K_M | 4 | 4.1 GB | Small (sweet spot) |
| Q3_K_M | 3 | 3.3 GB | Noticeable |
| Q2_K | 2 | 2.8 GB | Significant |

!!! tip "The sweet spot"
    **Q4_K_M** is the recommended quantization for most users. It halves the size with minimal quality loss.

## GPU offloading

### Ollama

```bash
# Ollama auto-detects GPU — just run
ollama run mistral:7b
```

### llama.cpp

```bash
# Offload N layers to GPU (33 layers for Mistral 7B)
./llama-cli -m model.gguf -ngl 33

# Offload everything
./llama-cli -m model.gguf -ngl 99

# Check how many layers your model has
./llama-cli -m model.gguf --verbose-prompt 2>&1 | grep "n_layer"
```

## Running 70B+ models locally

Yes, it's possible. Here's how:

=== "Multi-GPU (Ollama)"

    ```bash
    # Ollama 1.0+ auto-splits across GPUs
    ollama run llama4:70b
    ```

=== "CPU-only (llama.cpp)"

    ```bash
    # With 64GB+ RAM, 70B Q4 works on CPU
    ./llama-cli \
      -m llama-4-70b-q4_k_m.gguf \
      -t 16 \          # 16 threads
      -c 4096 \        # 4K context
      -n -1            # Unlimited output
    ```

=== "Quantize further"

    ```bash
    # Use IQ3_XXS for 70B on 32GB RAM
    ./llama-quantize \
      llama-4-70b-f16.gguf \
      llama-4-70b-iq3_xxs.gguf \
      IQ3_XXS
    ```

## Performance tuning

```bash
# llama.cpp flags that matter
./llama-cli \
  -m model.gguf \
  -t 8 \              # Thread count (match physical cores)
  -ngl 99 \           # GPU layers
  -c 8192 \           # Context size (bigger = more RAM)
  -n 512 \            # Max output tokens
  --mlock \           # Pin memory (prevents swapping)
  --no-mmap \         # Disable mmap if having issues
  --temp 0.7          # Temperature (0 = deterministic, 1 = creative)
```

## Troubleshooting

| Problem | Likely fix |
|---------|-----------|
| Out of memory | Reduce context (`-c 2048`), use lower quant, or smaller model |
| Slow on GPU | Check `-ngl` is set, update GPU drivers |
| Garbled output | Wrong prompt format — check the model card for chat template |
| Model won't load | Verify GGUF format, check file isn't corrupted (`md5sum`) |
