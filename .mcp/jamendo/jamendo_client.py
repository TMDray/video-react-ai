import os
import httpx
from typing import Optional, Dict, Any, List


class JamendoAPIError(Exception):
    """Custom exception for Jamendo API errors."""
    pass


class JamendoClient:
    """Async client for Jamendo API (royalty-free music)."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None
    ):
        self.api_key = api_key or os.getenv("JAMENDO_API_KEY")
        self.base_url = base_url or "https://api.jamendo.com/v3.0"

        if not self.api_key:
            raise JamendoAPIError(
                "JAMENDO_API_KEY not found. Set it as an environment variable."
            )

        self.client = httpx.AsyncClient(base_url=self.base_url)

    async def search_music(
        self,
        query: str = "",
        genre: Optional[str] = None,
        tags: Optional[str] = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Search for music tracks on Jamendo.

        Args:
            query: Search keyword (e.g., "ambient", "cinematic")
            genre: Filter by genre (e.g., "electronic", "orchestral")
            tags: Filter by tags (comma-separated)
            limit: Number of results (max 100)

        Returns:
            API response with matching tracks
        """
        params = {
            "client_id": self.api_key,
            "format": "json",
            "limit": min(limit, 100)
        }

        if query:
            params["search"] = query
        if genre:
            params["tags"] = genre
        if tags:
            if params.get("tags"):
                params["tags"] += f",{tags}"
            else:
                params["tags"] = tags

        response = await self.client.get("/tracks", params=params)
        response.raise_for_status()
        result = response.json()

        if result.get("status") == "error":
            raise JamendoAPIError(f"API Error: {result.get('error', 'Unknown error')}")

        return result

    async def get_track_info(self, track_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific track.

        Args:
            track_id: Jamendo track ID

        Returns:
            Track details including download URL
        """
        params = {
            "client_id": self.api_key,
            "format": "json"
        }

        response = await self.client.get(f"/tracks/{track_id}", params=params)
        response.raise_for_status()
        result = response.json()

        if result.get("status") == "error":
            raise JamendoAPIError(f"API Error: {result.get('error', 'Unknown error')}")

        if not result.get("results"):
            raise JamendoAPIError(f"Track {track_id} not found")

        return result["results"][0]

    async def download_track(
        self,
        track_id: str,
        format: str = "mp32"
    ) -> Dict[str, Any]:
        """
        Get download URL for a track.

        Args:
            track_id: Jamendo track ID
            format: Audio format ("mp32" for 320kbps, "mp3" for 128kbps, "ogg" for OGG)

        Returns:
            Track info with download URL
        """
        track_info = await self.get_track_info(track_id)

        # Jamendo provides direct URLs in the response
        if "audio" not in track_info:
            raise JamendoAPIError(f"No audio download available for track {track_id}")

        return {
            "id": track_info.get("id"),
            "name": track_info.get("name"),
            "artist": track_info.get("artist_name"),
            "download_url": track_info.get("audio"),
            "duration": track_info.get("duration"),
            "license": track_info.get("license_ccurl"),  # CC license URL
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
