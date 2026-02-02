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
    
    // 1. Discovery Logic: How did we find this?
    const foundKeywords = includeKeywords.filter((kw: string) => jobText.includes(kw.toLowerCase()));
    const seniorKeywords = excludeKeywords.filter((kw: string) => job.title.toLowerCase().includes(kw.toLowerCase()));
    
    let discoveryLogic = `Source: ${job.source}. `;
    if (foundKeywords.length > 0) {
      discoveryLogic += `Found match for: ${foundKeywords.join(', ')}. `;
    }

    try {
      // 2. Semantic Search (Broadened)
      // We query your portfolio for the most relevant project
      const cmd = `/Users/derin/.bun/bin/qmd search "${job.title.replace(/"/g, "'")}" -c job-sniper-knowledge --json -n 1`;
      let qmdRaw = "";
      try {
        qmdRaw = execSync(cmd).toString().trim();
      } catch (e) {
        qmdRaw = "No results found";
      }

      let matchScore = 0;
      let relevantProjects = "General Profile";
      
      if (qmdRaw.startsWith("[") && !qmdRaw.includes("No results found")) {
        const results = JSON.parse(qmdRaw);
        if (results.length > 0) {
          matchScore = Math.min(100, Math.round(results[0].score * 100));
          relevantProjects = results[0].file.split('/').pop();
          discoveryLogic += `Aligned with ${relevantProjects} (${matchScore}% semantic fit). `;
        }
      } else {
        discoveryLogic += "Broad fit based on general CV keywords. ";
      }

      // 3. Simple Tiered Categorization
      let category = "Low Match";
      if (foundKeywords.length >= 3 || matchScore >= 40) {
        category = "Good Match";
      } else if (foundKeywords.length >= 1 || matchScore >= 20) {
        category = "Mid Match";
      }

      // Update Database
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
