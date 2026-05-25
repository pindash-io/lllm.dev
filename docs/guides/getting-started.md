---
icon: lucide/rocket
---

# Getting Started with Local LLMs

Everything you need to start running LLMs on your own hardware — no cloud required.

## Step 1: Choose your hardware

Local LLMs run best with a **dedicated GPU**, but they work on CPU too.

| Hardware | What you can run | Speed |
|----------|-----------------|-------|
| 8 GB RAM, no GPU | 3B models (Q4) | Slow (2-5 tok/s) |
| 16 GB RAM, integrated GPU | 7-8B models (Q4) | Decent (15-30 tok/s) |
| 8 GB VRAM GPU | 7-8B models (Q4) | Fast (40-80 tok/s) |
| 16 GB VRAM GPU | 13-14B models (Q4) | Fast (30-60 tok/s) |
| 24 GB VRAM GPU | 34B models (Q4) | Fast (20-40 tok/s) |
| Apple M1/M2/M3 16GB+ | 7-14B models | Fast (30-55 tok/s) |

## Step 2: Pick a runner

=== "Ollama (easiest)"

    ```bash
    # Install
    curl -fsSL https://ollama.com/install.sh | sh

    # Pull a model
    ollama pull llama3.2:3b

    # Chat
    ollama run llama3.2:3b
    ```

    **Best for:** Beginners, quick setup, desktop use.

=== "llama.cpp (most flexible)"

    ```bash
    # Clone and build
    git clone https://github.com/ggerganov/llama.cpp
    cd llama.cpp && make -j

    # Download a GGUF model
    wget https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf

    # Run
    ./llama-cli -m Llama-3.2-3B-Instruct-Q4_K_M.gguf -p "Hello!"
    ```

    **Best for:** Developers, custom pipelines, server deployments.

=== "LM Studio (GUI)"

    1. Download from [lmstudio.ai](https://lmstudio.ai)
    2. Search and download models in-app
    3. Click "Start Server" for an OpenAI-compatible API

    **Best for:** GUI users, quick experimentation.

=== "MLX (Mac only)"

    ```bash
    pip install mlx-lm

    python -c "
    from mlx_lm import load, generate
    model, tokenizer = load('mlx-community/Llama-3.2-3B-Instruct-4bit')
    print(generate(model, tokenizer, prompt='Hello!', max_tokens=100))
    "
    ```

    **Best for:** Mac developers, Python workflows.

## Step 3: Choose a model

For beginners, start small:

| Model | Why start here |
|-------|---------------|
| **Llama 3.2 3B** | Small, fast, surprisingly capable |
| **Phi-3 Mini 3.8B** | Great reasoning for its size |
| **Gemma 2 2B** | Google's tiny but mighty model |
| **Qwen 2.5 3B** | Strong multilingual support |

## Step 4: Build something

```python
# OpenAI-compatible API (works with Ollama, LM Studio, llama.cpp server)
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="llama3.2:3b",
    messages=[{"role": "user", "content": "Write a Python function to sort a list"}],
    stream=True,
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="")
```

## Next Steps

- [:material-play: Running larger models](running-models.md)
- [:material-wrench: Fine-tuning your own model](fine-tuning.md)
- [:material-tools: Explore tools](../tools.md)
