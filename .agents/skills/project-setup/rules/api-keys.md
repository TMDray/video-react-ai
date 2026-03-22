---
name: api-keys
description: Required API keys, how to get them, and which are optional
metadata:
  category: Setup
---

# API Keys

## Required keys (in `.env`)

| Variable | Service | Free tier | How to get |
|----------|---------|-----------|------------|
| `PEXELS_API_KEY` | Pexels (stock images & videos) | 200 req/month | https://www.pexels.com/api/ |
| `UNSPLASH_ACCESS_KEY` | Unsplash (stock images) | 50 req/hour | https://unsplash.com/developers |
| `ELEVENLABS_API_KEY` | ElevenLabs (voiceover TTS) | 10,000 chars/month | https://elevenlabs.io/app/settings/api-keys |

## Optional keys

| Variable | Service | Free tier | How to get |
|----------|---------|-----------|------------|
| `SUNO_API_KEY` | Suno (AI music) | Paid only (sunoapi.org) | https://sunoapi.org |
| `SUNO_API_BASE_URL` | Suno API endpoint | — | Default: `https://api.sunoapi.org` |
| `DEEPL_API_KEY` | DeepL (SRT translation) | 500K chars/month | https://www.deepl.com/pro-api |

## No key needed

| Service | Notes |
|---------|-------|
| MetMuseum MCP | Free open API, CC0 license, 80 req/s |
| LottieFiles MCP | Free access to animation library |

## Setup

```bash
cp .env.example .env
# Edit .env with your keys
```

## Important

- Never commit `.env` to git (it's in `.gitignore`)
- Keys using `${VAR}` in `settings.json` are resolved from shell environment
- A missing optional key means that MCP server won't start — other servers still work fine