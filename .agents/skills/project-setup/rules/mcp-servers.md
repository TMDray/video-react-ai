---
name: mcp-servers
description: Available MCP servers, configuration format, and troubleshooting guide
metadata:
  category: Setup
---

# MCP Servers

## Configuration format

All MCP servers are declared in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "/path/to/executable",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

Environment variables use `${VAR_NAME}` syntax — they are resolved from the shell environment or `.env` file.

## Available servers

### Stocky (Stock images & videos)

- **Type**: Python MCP server (local)
- **Location**: `.mcp/stocky/stocky_mcp.py`
- **Requires**: Python venv with `mcp`, `pycurl`
- **API keys**: `PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY`
- **Tools**: `search_stock_images`, `search_stock_videos`, `get_image_details`, `get_video_details`, `download_image`, `download_video`

```json
"stocky": {
  "command": "<PROJECT_ROOT>/.mcp/stocky/.venv/bin/python",
  "args": ["<PROJECT_ROOT>/.mcp/stocky/stocky_mcp.py"],
  "env": {
    "PEXELS_API_KEY": "${PEXELS_API_KEY}",
    "UNSPLASH_ACCESS_KEY": "${UNSPLASH_ACCESS_KEY}"
  }
}
```

### Suno (AI music generation)

- **Type**: Python MCP server (local)
- **Location**: `.mcp/suno/server.py`
- **Requires**: Python venv with `mcp`, `httpx`, `python-dotenv`
- **API keys**: `SUNO_API_KEY`, `SUNO_API_BASE_URL`
- **Tools**: `generate_music`, `get_task_status`, `get_music_info`, `get_credits`, `convert_to_wav`
- **Note**: Uses paid API from sunoapi.org. Without a valid key, this server will fail to start — this is normal and does not affect other servers.

```json
"suno": {
  "command": "<PROJECT_ROOT>/.mcp/suno/.venv/bin/python",
  "args": ["<PROJECT_ROOT>/.mcp/suno/server.py"],
  "env": {
    "SUNO_API_KEY": "${SUNO_API_KEY}",
    "SUNO_API_BASE_URL": "${SUNO_API_BASE_URL}"
  }
}
```

### MetMuseum (Metropolitan Museum of Art)

- **Type**: npx package (no local install needed)
- **API keys**: None required (free open API)
- **Tools**: `list_departments`, `search_objects`, `get_museum_object`
- **Note**: Only relevant for art/culture projects. 470,000+ artworks, CC0 license.

```json
"metmuseum-mcp": {
  "command": "npx",
  "args": ["-y", "metmuseum-mcp"]
}
```

### LottieFiles (Motion design library)

- **Type**: npx package (no local install needed)
- **API keys**: None required
- **Tools**: Search and browse Lottie animations

```json
"lottiefiles": {
  "command": "npx",
  "args": ["-y", "mcp-server-lottiefiles"]
}
```

## Troubleshooting

### Server fails to start

1. **Missing venv**: Run `./scripts/setup-mcp.sh` to create virtual environments
2. **Missing API key**: Check `.env` file. A server without its required key will fail — this is expected and doesn't block other servers
3. **Wrong path in settings.json**: Paths must be absolute. Run `setup-mcp.sh` to regenerate

### Server connects but tools fail

1. **Invalid API key**: Verify key is correct in `.env`
2. **Rate limit**: Pexels allows 200 req/month (free), Met Museum 80 req/s
3. **Network**: Ensure internet connection for external APIs

### Adding a new MCP server

1. Add files to `.mcp/<server-name>/`
2. If Python: add `requirements.txt`, update `setup-mcp.sh` to create venv
3. If npx: just add the entry to `.claude/settings.json`
4. Document in this file