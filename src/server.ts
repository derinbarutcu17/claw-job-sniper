import { serve } from "bun";
import { Database } from "bun:sqlite";
import * as fs from "fs";
import { execSync } from "child_process";

const DB_PATH = "data/sniper.db";
const OPENCLAW_BIN = "openclaw";

export function startServer() {
  console.log("🚀 Launching Claw Job Sniper Dashboard at http://localhost:3000");
  
  const db = new Database(DB_PATH);

  serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/api/jobs") {
        const jobs = db.query("SELECT * FROM jobs ORDER BY match_score DESC").all();
        return Response.json(jobs);
      }

      if (url.pathname.startsWith("/api/jobs/") && url.pathname.endsWith("/request-draft")) {
        const parts = url.pathname.split("/");
        const jobId = parts[3];
        try {
          // Send command to the main OpenClaw session
          execSync(`${OPENCLAW_BIN} sessions send main "!sniper draft ${jobId}"`);
          return Response.json({ success: true, message: "Command sent to OpenClaw." });
        } catch (e) {
          return Response.json({ success: false, error: "OpenClaw session inactive or command failed." }, { status: 500 });
        }
      }

      if (url.pathname === "/") {
        const html = fs.readFileSync("src/dashboard.html", "utf8");
        return new Response(html, {
          headers: { "Content-Type": "text/html" },
        });
      }

      return new Response("Not Found", { status: 404 });
    },
  });
}
