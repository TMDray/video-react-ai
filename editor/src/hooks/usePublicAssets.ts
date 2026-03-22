import { useState, useEffect } from "react";

/**
 * Hook to fetch list of assets from public/ directory via /api/assets endpoint
 */
export function usePublicAssets() {
  const [assets, setAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/assets");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as string[];
        setAssets(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return { assets, loading, error };
}
