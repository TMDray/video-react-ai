# Jamendo MCP Server

A Model Context Protocol (MCP) server for searching and accessing royalty-free music from Jamendo.

## Features

- **Search Music**: Find royalty-free music by genre, mood, or keyword
- **Track Information**: Get detailed metadata about specific tracks
- **Direct Download**: Retrieve download URLs for CC-licensed music
- **CC Licensed**: All tracks are Creative Commons licensed and free to use

## Prerequisites

- Python 3.10+ or Docker
- A Jamendo API key (get free at https://www.jamendo.com/developers)

## Installation

### Option 1: Docker (Recommended)

1. Build the image:
```bash
docker-compose build
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Jamendo API key to `.env`:
```
JAMENDO_API_KEY=your_api_key_here
```

### Option 2: Native Python

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Jamendo API key to `.env`

## Configuration with Claude Code

### Docker Configuration

Add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "jamendo": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--env-file",
        "/absolute/path/to/.env",
        "jamendo-mcp:latest"
      ]
    }
  }
}
```

Replace `/absolute/path/to/.env` with the actual path to your `.env` file.

### Native Python Configuration

Add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "jamendo": {
      "command": "python",
      "args": ["/absolute/path/to/server.py"],
      "env": {
        "JAMENDO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### 1. search_music

Search for royalty-free music on Jamendo.

**Parameters:**
- `query` (string, optional): Search keyword (e.g., "ambient", "cinematic")
- `genre` (string, optional): Filter by genre (e.g., "electronic", "orchestral")
- `tags` (string, optional): Comma-separated tags to filter by
- `limit` (integer, default: 10): Number of results (max: 100)

**Example:**
```
search_music(query="ambient", genre="electronic", limit=5)
```

### 2. get_track_info

Get detailed information about a specific track.

**Parameters:**
- `track_id` (string, required): Jamendo track ID

**Example:**
```
get_track_info(track_id="12345")
```

### 3. download_track

Get the download URL and metadata for a track.

**Parameters:**
- `track_id` (string, required): Jamendo track ID
- `format` (string, default: "mp32"): Audio format ("mp32" for 320kbps, "mp3" for 128kbps, "ogg")

**Example:**
```
download_track(track_id="12345", format="mp32")
```

## Usage in Remotion Videos

In your `audio.config.ts`:

```typescript
export const audioConfig = {
  voiceoverUrl: "voiceover.mp3",
  musicSource: "jamendo", // Use Jamendo for music
  musicTrackId: "12345",  // Jamendo track ID
  sfxCues: [
    { time: 1000, sound: "whoosh.wav" }
  ]
};
```

Then use MCP to search and download:
```
search_music(query="cinematic background", limit=10)
```

Copy the track ID from results and update your `audio.config.ts`.

## License

All music from Jamendo is Creative Commons licensed and free to use with attribution.

## Support

For API key issues or music search questions, visit https://www.jamendo.com/developers
