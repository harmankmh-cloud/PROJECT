# OpenRouter Free Chat

A small local chat app that uses your [OpenRouter](https://openrouter.ai/) API key with **free models**.

It defaults to the `openrouter/free` router, which automatically picks from OpenRouter's free model pool (Llama, DeepSeek, Qwen, Gemma, and others).

## Quick start

1. Get an API key from [openrouter.ai/keys](https://openrouter.ai/keys).
2. Run setup:

```bash
chmod +x setup.sh
./setup.sh
```

3. If you skipped the key during setup, edit `.env`:

```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

4. Start the web chat:

```bash
source .venv/bin/activate
python run.py web
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

Or use the terminal chat:

```bash
source .venv/bin/activate
python run.py cli
```

## Free tier limits (important)

OpenRouter free models are **free to use**, but they are **not unlimited**:

| Plan | Requests per minute | Requests per day |
| --- | --- | --- |
| Free account | 20 | 50 |
| After $10 lifetime credits | 20 | 1,000 |

If you hit limits, wait for the reset or add credits on OpenRouter. There is no truly unlimited free tier.

## Pick a specific free model

Edit `.env`:

```bash
OPENROUTER_MODEL=deepseek/deepseek-r1:free
```

Browse free models at [openrouter.ai/models](https://openrouter.ai/models) and use any model id ending in `:free`.

## Requirements

- Python 3.9 or newer
- An OpenRouter API key

## Manual install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# add your key to .env
python run.py web
```

## Project layout

- `openrouter_chat/client.py` — OpenRouter API client
- `openrouter_chat/cli.py` — terminal chat
- `openrouter_chat/web.py` — local web server
- `run.py` — loads `.env` and starts cli/web
- `setup.sh` — one-command install

## Check your key and list free models

```bash
source .venv/bin/activate
python run.py check
```

This verifies your API key, lists free models you can use, and runs a small test message.

You can also browse models in the browser: https://openrouter.ai/models — filter for **Free**.

## Troubleshooting

**Missing API key**

```
Missing OPENROUTER_API_KEY. Run ./setup.sh or add it to .env.
```

Add your key to `.env` and restart.

**Rate limit / 429 errors**

You have hit OpenRouter's free-tier limits. Try again later or add credits.

**Model unavailable**

Switch `OPENROUTER_MODEL` to another `:free` model, or keep `openrouter/free` so OpenRouter auto-selects an available one.
