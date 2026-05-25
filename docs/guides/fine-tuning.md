---
icon: lucide/wrench
---

# Fine-Tuning Local LLMs

How to customize open models for your specific use case — entirely on your own hardware.

## Should you fine-tune?

Before fine-tuning, consider:

- **Prompt engineering** — often sufficient for simple tasks
- **RAG (Retrieval Augmented Generation)** — inject knowledge without training
- **Few-shot prompting** — provide examples in the prompt

Fine-tune when you need a model to learn a **new skill**, **new style**, or **domain-specific knowledge** that prompting can't solve.

## Methods compared

| Method | VRAM needed | Time | Best for |
|--------|------------|------|----------|
| **LoRA** | 8 GB (7B) | ~1 hour | Adding skills, style transfer |
| **QLoRA** | 6 GB (7B) | ~1.5 hours | Same as LoRA, less VRAM |
| **Full fine-tune** | 60 GB (7B) | ~8 hours | Maximum quality |
| **DPO** | 8 GB (7B) | ~30 min | Preference alignment |

## LoRA fine-tuning with Unsloth

[Unsloth](https://github.com/unslothai/unsloth) is the fastest way to fine-tune locally:

```bash
pip install unsloth
```

```python
from unsloth import FastLanguageModel
from datasets import load_dataset
import torch

# Load model in 4-bit
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.2-3B",
    max_seq_length=2048,
    load_in_4bit=True,
)

# Add LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16,  # LoRA rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
)

# Prepare your dataset
dataset = load_dataset("json", data_files="my_training_data.jsonl")

def format_chat(examples):
    texts = []
    for msgs in examples["messages"]:
        text = tokenizer.apply_chat_template(msgs, tokenize=False)
        texts.append(text)
    return {"text": texts}

dataset = dataset.map(format_chat, batched=True)

# Train
from trl import SFTTrainer

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset["train"],
    dataset_text_field="text",
    max_seq_length=2048,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=100,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        output_dir="outputs",
    ),
)

trainer.train()

# Save your LoRA
model.save_pretrained("my-fine-tuned-lora")
```

## Preparing training data

Your data should be in chat format:

```jsonl
{"messages": [{"role": "system", "content": "You are a helpful coding assistant."}, {"role": "user", "content": "Write a Python function to reverse a linked list."}, {"role": "assistant", "content": "def reverse_list(head): ..."}]}
{"messages": [{"role": "system", "content": "You are a helpful coding assistant."}, {"role": "user", "content": "How do I read a file in Python?"}, {"role": "assistant", "content": "Use `with open('file.txt', 'r') as f: content = f.read()`"}]}
```

!!! tip "Data quality matters"
    50 high-quality examples > 5000 mediocre ones. Curate carefully.

## Merging and exporting

```python
# Merge LoRA weights back into the base model
model.save_pretrained_merged("my-merged-model", tokenizer, save_method="merged_16bit")

# Convert to GGUF for use with Ollama/llama.cpp
# Use llama.cpp's convert-hf-to-gguf.py
```

## Testing your fine-tune

```bash
# With llama.cpp
./llama-cli -m my-model-q4_k_m.gguf -p "Write a Python function to sort a list"

# With Ollama (create a Modelfile)
echo 'FROM ./my-model-q4_k_m.gguf' > Modelfile
ollama create my-custom-model -f Modelfile
ollama run my-custom-model
```

## See also

- [:material-play: Running Models](running-models.md)
- [:material-rocket: Getting Started](getting-started.md)
