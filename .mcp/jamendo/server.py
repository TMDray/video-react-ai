#!/usr/bin/env python3
"""
Jamendo MCP Server
Exposes royalty-free music search and download via Model Context Protocol
"""

import asyncio
import os
import httpx
from mcp.server.models import InitializationOptions
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from jamendo_client import JamendoClient, JamendoAPIError

# Initialize server
server = Server("jamendo")
jamendo_client: JamendoClient | None = None


@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """List available Jamendo tools."""
    return [
        Tool(
            name="search_music",
            description="Search for royalty-free music on Jamendo by genre, mood, or keyword",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search keyword (e.g., 'ambient', 'cinematic', 'upbeat')"
                    },
                    "genre": {
                        "type": "string",
                        "description": "Filter by genre (e.g., 'electronic', 'orchestral', 'pop')"
                    },
                    "tags": {
                        "type": "string",
                        "description": "Filter by tags, comma-separated (e.g., 'corporate,motivational')"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of results to return (default: 10, max: 100)",
                        "default": 10
                    }
                },
                "required": []
            }
        ),
        Tool(
            name="get_track_info",
            description="Get detailed information about a specific Jamendo track",
            inputSchema={
                "type": "object",
                "properties": {
                    "track_id": {
                        "type": "string",
                        "description": "Jamendo track ID"
                    }
                },
                "required": ["track_id"]
            }
        ),
        Tool(
            name="download_track",
            description="Get the download URL and metadata for a Jamendo track",
            inputSchema={
                "type": "object",
                "properties": {
                    "track_id": {
                        "type": "string",
                        "description": "Jamendo track ID"
                    },
                    "format": {
                        "type": "string",
                        "description": "Audio format: 'mp32' (320kbps), 'mp3' (128kbps), 'ogg'",
                        "default": "mp32"
                    }
                },
                "required": ["track_id"]
            }
        )
    ]


@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Handle tool calls."""
    global jamendo_client

    if jamendo_client is None:
        jamendo_client = JamendoClient()

    try:
        if name == "search_music":
            result = await jamendo_client.search_music(
                query=arguments.get("query", ""),
                genre=arguments.get("genre"),
                tags=arguments.get("tags"),
                limit=arguments.get("limit", 10)
            )

            # Format results for display
            text = "🎵 Jamendo Music Search Results\n\n"
            if result.get("results"):
                for track in result["results"][:5]:  # Show top 5
                    text += f"📌 {track['name']}\n"
                    text += f"   Artist: {track.get('artist_name', 'Unknown')}\n"
                    text += f"   ID: {track['id']}\n"
                    text += f"   Duration: {track.get('duration', 'N/A')}s\n"
                    text += f"   License: {track.get('license_ccurl', 'CC BY')}\n\n"
            else:
                text += "No results found."

            return [TextContent(type="text", text=text)]

        elif name == "get_track_info":
            track_id = arguments.get("track_id")
            result = await jamendo_client.get_track_info(track_id)

            text = f"🎵 Track Information\n\n"
            text += f"Title: {result.get('name', 'Unknown')}\n"
            text += f"Artist: {result.get('artist_name', 'Unknown')}\n"
            text += f"ID: {result.get('id')}\n"
            text += f"Duration: {result.get('duration', 'N/A')}s\n"
            text += f"License: {result.get('license_ccurl', 'CC BY')}\n"
            text += f"Audio URL: {result.get('audio', 'N/A')}\n"

            return [TextContent(type="text", text=text)]

        elif name == "download_track":
            track_id = arguments.get("track_id")
            format_type = arguments.get("format", "mp32")

            result = await jamendo_client.download_track(track_id, format_type)

            text = f"📥 Track Ready for Download\n\n"
            text += f"Title: {result.get('name', 'Unknown')}\n"
            text += f"Artist: {result.get('artist', 'Unknown')}\n"
            text += f"Duration: {result.get('duration', 'N/A')}s\n"
            text += f"Download URL: {result.get('download_url', 'N/A')}\n"
            text += f"License: {result.get('license', 'CC BY')}\n"
            text += f"\n✅ This track is free to use with attribution.\n"

            return [TextContent(type="text", text=text)]

        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]

    except JamendoAPIError as e:
        return [TextContent(type="text", text=f"❌ Jamendo API Error: {str(e)}")]
    except httpx.HTTPError as e:
        return [TextContent(type="text", text=f"❌ Network Error: {str(e)}")]
    except Exception as e:
        return [TextContent(type="text", text=f"❌ Error: {str(e)}")]


async def main():
    """Main entry point for the MCP server."""
    global jamendo_client

    async with stdio_server(server) as streams:
        print("🎵 Jamendo MCP Server running...", flush=True, file=__import__("sys").stderr)

        await server.wait_for_shutdown()

        if jamendo_client:
            await jamendo_client.close()


if __name__ == "__main__":
    asyncio.run(main())
