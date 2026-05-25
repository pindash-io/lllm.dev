---
icon: lucide/wrench
---

# Tools & Ecosystem

The essential tools for local LLM development — categorized and compared.

## :material-magnify: Model Discovery

| Tool | Platform | Description | GPU support |
|------|----------|-------------|-------------|
| [llmfit](https://github.com/AlexsJones/llmfit) | All (Rust) | Hardware-aware model finder, TUI | Any |

## :material-download: Model Runners

| Tool | Platform | Best for | GPU support |
|------|----------|----------|-------------|
| [Ollama](https://ollama.com) | macOS, Linux, Windows | Beginners, quick setup | CUDA, Metal, ROCm |
| [llama.cpp](https://github.com/ggerganov/llama.cpp) | All (C/C++) | Servers, custom pipelines | CUDA, Metal, Vulkan, ROCm, SYCL |
| [DwarfStar 4](https://github.com/antirez/ds4) | macOS, Linux | DeepSeek V4 Flash optimized | Metal, CUDA |
| [LM Studio](https://lmstudio.ai) | macOS, Windows, Linux | GUI users | CUDA, Metal |
| [vLLM](https://github.com/vllm-project/vllm) | Linux | Production serving | CUDA, ROCm |
| [MLX](https://github.com/ml-explore/mlx) | macOS (Apple Silicon) | Mac-native dev | Apple Silicon GPU |
| [llama.rn](https://github.com/mybigday/llama.rn) | iOS, Android | Mobile inference | Metal, Vulkan |

## :material-chat: Frontends & UIs

| Tool | Description | Key feature |
|------|-------------|-------------|
| [Open WebUI](https://github.com/open-webui/open-webui) | Self-hosted ChatGPT clone | RAG, tools, multi-user |
| [SillyTavern](https://github.com/SillyTavern/SillyTavern) | Character chat frontend | Roleplay, character cards |
| [Anything LLM](https://github.com/Mintplex-Labs/anything-llm) | All-in-one desktop app | RAG, agents, multi-model |
| [Jan](https://jan.ai) | Open-source ChatGPT alternative | Offline-first, extensions |
| [GPT4All](https://www.npt4all.io) | Desktop local AI | No GPU required |

## :material-database: Model Sources

| Source | Description |
|--------|-------------|
| [Hugging Face](https://huggingface.co) | The largest model repository — GGUF, safetensors, everything |
| [Ollama Library](https://ollama.com/library) | Curated, ready-to-run models |
| [LM Studio Search](https://lmstudio.ai/models) | In-app model discovery |

## :material-hammer-wrench: Development Tools

| Tool | Description |
|------|-------------|
| [LangChain](https://www.langchain.com) | Framework for LLM applications |
| [LlamaIndex](https://www.llamaindex.ai) | Data framework for LLM apps |
| [Ollama Python/JS SDK](https://github.com/ollama/ollama-js) | Programmatic model access |
| [outlines](https://github.com/dottxt-ai/outlines) | Structured generation (JSON, regex) |
| [Guidance](https://github.com/guidance-ai/guidance) | Controlled generation from Microsoft |
| [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) | Python bindings for llama.cpp |

## :material-scale-balance: Quantization Tools

| Tool | Description |
|------|-------------|
| [llama.cpp quantize](https://github.com/ggerganov/llama.cpp) | Built-in quantization (GGUF formats) |
| [AutoGPTQ](https://github.com/AutoGPTQ/AutoGPTQ) | GPTQ quantization for GPU inference |
| [bitsandbytes](https://github.com/TimDettmers/bitsandbytes) | 4-bit and 8-bit quantization |
| [AWQ](https://github.com/mit-han-lab/llm-awq) | Activation-aware weight quantization |

## :material-monitor-dashboard: Monitoring & Observability

| Tool | Description |
|------|-------------|
| [Weights & Biases](https://wandb.ai) | Experiment tracking |
| [Langfuse](https://langfuse.com) | LLM observability (open source) |
| [Phoenix](https://github.com/Arize-AI/phoenix) | AI observability & evaluation |
