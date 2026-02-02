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
  } else if (command === "digest") {
    const limit = parseInt(args[1]) || 5;
    const jobs = db.query("SELECT id, title, company, match_score FROM jobs WHERE status = 'analyzed' AND match_score > 0 ORDER BY match_score DESC LIMIT ?").all(limit) as any[];
    
    if (jobs.length === 0) {
      console.log("No new matches found.");
      return;
    }

    console.log(`\n📬 TOP ${jobs.length} JOB DIGEST:\n`);
    jobs.forEach((j, i) => {
      console.log(`${i+1}. [ID: ${j.id}] ${j.title} at ${j.company} (${j.match_score}%)`);
    });
    console.log("\nUse '!sniper draft <id>' to generate a pitch.");
  } else if (command === "blacklist") {
    const company = args.slice(1).join(" ");
    if (!company) {
      console.log("Usage: bun index.ts blacklist <company name>");
      return;
    }
    const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
    if (!config.blacklist.companies.includes(company)) {
      config.blacklist.companies.push(company);
      fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
      console.log(`✅ ${company} added to blacklist.`);
    }
  } else {
    console.log("Usage: bun index.ts run | serve | draft <id> | digest [limit] | blacklist <company>");
  }
}

main().catch(console.error);
