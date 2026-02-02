import { initDB } from "./src/db";
import { runScout } from "./src/scout";
import { calculateMatches } from "./src/matcher";
import { draftOutreach } from "./src/writer";
import { startServer } from "./src/server";
import * as fs from "fs";

if (!fs.existsSync("data")) fs.mkdirSync("data");

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const db = initDB();

  if (command === "run") {
    await runScout();
    await calculateMatches(db);
    console.log("🏁 Run complete.");
  } else if (command === "serve") {
    startServer();
  } else if (command === "draft") {
    const jobId = parseInt(args[1]);
    const draft = await draftOutreach(db, jobId);
    console.log("\n--- OUTREACH DRAFT ---\n");
    console.log(draft);
  } else if (command === "pending") {
    const jobs = db.query("SELECT id, title, company, description FROM jobs WHERE status = 'new' OR status = 'no_match'").all();
    console.log(JSON.stringify(jobs));
  } else {
    console.log("Usage: bun index.ts run | serve | draft <id> | pending");
  }
}

main().catch(console.error);
