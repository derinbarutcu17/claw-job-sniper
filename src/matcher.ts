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
    
    // 1. Discovery Logic: Keyword Match
    const foundKeywords = includeKeywords.filter((kw: string) => jobText.includes(kw.toLowerCase()));
    const isSenior = excludeKeywords.some((kw: string) => job.title.toLowerCase().includes(kw.toLowerCase()));
    
    let discoveryLogic = `Source: ${job.source}. `;
    if (foundKeywords.length > 0) {
      discoveryLogic += `Keywords found: ${foundKeywords.join(', ')}. `;
    }

    try {
      // 2. Semantic Search (Optimized for local collection)
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
          // Normalizing QMD BM25 scores: 0.2+ is strong for these short project docs
          matchScore = Math.min(100, Math.round(results[0].score * 400));
          relevantProjects = results[0].file.split('/').pop();
          discoveryLogic += `Strong semantic alignment with ${relevantProjects} (${matchScore}% match). `;
        }
      } else {
        discoveryLogic += "Broad fit based on general profile keywords. ";
      }

      // 3. Simple Tiered Categorization
      let category = "Low Match";
      if ((foundKeywords.length >= 2 && !isSenior) || matchScore >= 70) {
        category = "Good Match";
      } else if (foundKeywords.length >= 1 || matchScore >= 30) {
        category = "Mid Match";
      }

      if (isSenior) category = "Mid Match (Senior Role)";

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
