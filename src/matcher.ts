import { execSync } from "child_process";
import { Database } from "bun:sqlite";
import * as fs from "fs";

export async function calculateMatches(db: Database) {
  console.log("🧠 Calculating Vibe-Match scores...");
  
  const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
  const includeKeywords = config.search.include_keywords;
  const excludeKeywords = config.search.exclude_keywords;

  const jobs = db.query("SELECT * FROM jobs WHERE status = 'new' OR status = 'no_match'").all() as any[];
  
  for (const job of jobs) {
    const jobText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    
    const hits = includeKeywords.filter((kw: string) => jobText.includes(kw.toLowerCase()));
    const isSenior = excludeKeywords.some((kw: string) => job.title.toLowerCase().includes(kw.toLowerCase()));
    
    let discoveryLogic = `Scanned via ${job.source}. `;
    if (hits.length > 0) {
      discoveryLogic += `Found relevant keywords: ${hits.join(', ')}. `;
    }
    if (isSenior) {
      discoveryLogic += `Note: Marked as Senior/Lead level. `;
    }

    try {
      // Semantic Search via QMD in the job-sniper-knowledge collection
      let cmd = `/Users/derin/.bun/bin/qmd search "${job.title.replace(/"/g, "'")}" -c job-sniper-knowledge --json -n 2`;
      let qmdRaw = "";
      try {
        qmdRaw = execSync(cmd).toString().trim();
      } catch (e) {
        qmdRaw = "No results found";
      }
      
      let matchScore = 0;
      let relevantProjects = "None found in local base.";
      
      if (!qmdRaw.includes("No results found") && qmdRaw.startsWith("[")) {
        const results = JSON.parse(qmdRaw);
        if (results.length > 0) {
          matchScore = Math.min(100, Math.round(results[0].score * 100));
          relevantProjects = results.map((r: any) => (r.file || "").split('/').pop()).join(", ");
          discoveryLogic += `Semantic match with ${relevantProjects} (Quality: ${matchScore}%). `;
        }
      }

      let category = "Low Match";
      if (matchScore >= 60 || (hits.length >= 3 && !isSenior)) {
        category = "Good Match";
      } else if (matchScore >= 30 || hits.length >= 1) {
        category = "Mid Match";
      }

      db.run(`
        UPDATE jobs 
        SET match_score = ?, 
            relevant_projects = ?, 
            category = ?,
            discovery_logic = ?,
            status = 'analyzed'
        WHERE id = ?
      `, [matchScore, relevantProjects, category, discoveryLogic, job.id]);
      
      console.log(`🎯 [${category}] ${job.title} at ${job.company}`);
      
    } catch (e) {
      console.error(`❌ Match error for job ${job.id}:`, e);
      db.run("UPDATE jobs SET status = 'error' WHERE id = ?", [job.id]);
    }
  }
}
