import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function serveStatic(app: Express, _server: Server) {
  console.log("[prod] Starting production server setup...");
  
  const distPath = path.resolve(__dirname, "public");
  console.log(`[prod] Looking for dist at: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    console.error(`[prod] ERROR: Build directory not found at ${distPath}`);
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log("[prod] Build directory found, setting up static file serving...");

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  console.log("[prod] Static file serving configured successfully");
}

(async () => {
  try {
    console.log("[prod] Initializing production application...");
    await runApp(serveStatic);
    console.log("[prod] Production application started successfully");
  } catch (error) {
    console.error("[prod] Failed to start production application:", error);
    process.exit(1);
  }
})();
