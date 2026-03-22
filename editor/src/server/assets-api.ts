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
 * Parse multipart/form-data from request body
 */
function parseMultipartData(
  body: Buffer,
  boundary: string
): Record<string, { filename?: string; data: Buffer }> {
  const files: Record<string, { filename?: string; data: Buffer }> = {};
  const parts = body.toString("binary").split(`--${boundary}`);

  for (const part of parts) {
    if (!part || part === "--") continue;

    // Extract headers and body
    const [headerSection, ...bodyParts] = part.split("\r\n\r\n");
    if (!headerSection || bodyParts.length === 0) continue;

    const body = bodyParts.join("\r\n\r\n").replace(/\r\n$/, "");
    const filenameMatch = headerSection.match(/filename="([^"]+)"/);
    const nameMatch = headerSection.match(/name="([^"]+)"/);

    if (filenameMatch && nameMatch) {
      const filename = filenameMatch[1];
      const fieldName = nameMatch[1];
      files[fieldName] = {
        filename,
        data: Buffer.from(body, "binary"),
      };
    }
  }

  return files;
}

/**
 * Vite plugin that serves GET /api/assets endpoint and POST /api/upload endpoint
 * GET returns a JSON array of file paths in the public/ directory
 * POST accepts file uploads and saves them to the public/ directory
 */
export function assetsApiPlugin(options: { publicDir: string }): Plugin {
  return {
    name: "assets-api",
    configureServer(server) {
      server.middlewares.use("/api/assets", (req, res) => {
        if (req.method === "GET") {
          const files = walkDir(options.publicDir, options.publicDir);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(files));
        } else if (req.method === "POST") {
          // Handle file upload
          const contentType = req.headers["content-type"] || "";
          const boundaryMatch = contentType.match(/boundary=([^;]+)/);

          if (!boundaryMatch) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing boundary in multipart data" }));
            return;
          }

          const boundary = boundaryMatch[1];
          let body = Buffer.alloc(0);

          req.on("data", (chunk: Buffer) => {
            body = Buffer.concat([body, chunk]);
          });

          req.on("end", () => {
            try {
              const files = parseMultipartData(body, boundary);
              const uploadDir = path.join(options.publicDir, "uploads");

              // Create uploads directory if it doesn't exist
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }

              // Save each file
              for (const [, file] of Object.entries(files)) {
                if (file.filename) {
                  const filepath = path.join(uploadDir, file.filename);
                  fs.writeFileSync(filepath, file.data);
                }
              }

              // Return updated file list
              const updatedFiles = walkDir(options.publicDir, options.publicDir);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, files: updatedFiles }));
            } catch (error) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: `Upload failed: ${error instanceof Error ? error.message : "unknown error"}`,
                })
              );
            }
          });
        } else {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
        }
      });
    },
  };
}
