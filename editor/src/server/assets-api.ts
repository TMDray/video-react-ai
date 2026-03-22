import { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * Recursively walk a directory and return relative file paths
 */
function walkDir(dir: string, baseDir: string, prefix = ""): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath, baseDir, relativePath));
      } else {
        // Return relative path from baseDir
        files.push(relativePath.replace(/\\/g, "/"));
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files;
}

/**
 * Vite plugin that serves GET /api/assets endpoint
 * Returns a JSON array of file paths in the public/ directory
 */
export function assetsApiPlugin(options: { publicDir: string }): Plugin {
  return {
    name: "assets-api",
    configureServer(server) {
      server.middlewares.use("/api/assets", (_req, res) => {
        const files = walkDir(options.publicDir, options.publicDir);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(files));
      });
    },
  };
}
