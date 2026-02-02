import { serve } from "bun";
import { Database } from "bun:sqlite";
import * as fs from "fs";

const DB_PATH = "data/sniper.db";

export function startServer() {
  console.log("🚀 Launching Claw Job Sniper Dashboard at http://localhost:3000");
  
  const db = new Database(DB_PATH);

  serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);

      // API: Get all jobs
      if (url.pathname === "/api/jobs") {
        const jobs = db.query("SELECT * FROM jobs ORDER BY match_score DESC").all();
        return Response.json(jobs);
      }

      // Serve Dashboard HTML
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
