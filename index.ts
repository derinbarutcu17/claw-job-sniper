import { initDB, saveJob } from "./src/db";
import { calculateMatches } from "./src/matcher";
import { draftOutreach } from "./src/writer";
import { renderPitchPDF } from "./src/pdf";
import { startServer } from "./src/server";
import { execSync } from "child_process";
import * as fs from "fs";

if (!fs.existsSync("data")) fs.mkdirSync("data");

async function fetchBSJ() {
  console.log("🔍 Scouting Berlin Startup Jobs...");
  const feedUrl = "https://berlinstartupjobs.com/feed/";
  const response = await fetch(feedUrl);
  const xml = await response.text();
  
  const jobs: any[] = [];
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  
  for (const item of items) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const descriptionMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    
    if (titleMatch && linkMatch) {
      const fullTitle = titleMatch[1].replace("&#8211;", "-").replace("&#8217;", "'").replace("&#038;", "&");
      const [title, company] = fullTitle.split(" // ");
      
      jobs.push({
        external_id: linkMatch[1],
        title: title ? title.trim() : fullTitle.trim(),
        company: company ? company.trim() : "Unknown",
        description: descriptionMatch ? descriptionMatch[1].replace(/<[^>]*>?/gm, '').trim() : "",
        url: linkMatch[1],
        source: "Berlin Startup Jobs",
        location: "Berlin"
      });
    }
  }
  return jobs;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const db = initDB();

  if (command === "run") {
    const bsjJobs = await fetchBSJ();
    
    let newCount = 0;
    for (const job of bsjJobs) {
      const result = saveJob(db, job);
      if (result.changes > 0) newCount++;
    }
    
    console.log(`✅ Scout complete. Found ${bsjJobs.length} jobs, ${newCount} are new.`);
    await calculateMatches(db);
    console.log("🏁 Run complete.");
    
  } else if (command === "serve") {
    startServer();
  } else if (command === "draft") {
    const jobId = parseInt(args[1]);
    const draft = await draftOutreach(db, jobId);
    console.log("\n--- OUTREACH DRAFT ---\n");
    console.log(draft);
  } else {
    console.log("Usage: bun index.ts run | serve | draft <id>");
  }
}

main().catch(console.error);
