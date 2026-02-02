import { Database } from "bun:sqlite";
import * as fs from "fs";

export async function calculateMatches(db: Database) {
  console.log("🧠 Performing initial keyword-based filtering...");
  
  const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
  const includeKeywords = config.search.include_keywords;
  const excludeKeywords = config.search.exclude_keywords;

  const jobs = db.query("SELECT * FROM jobs WHERE status = 'new'").all() as any[];
  
  for (const job of jobs) {
    const jobText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    
    // 1. Hard Exclusion
    const isExcluded = excludeKeywords.some((kw: string) => jobText.includes(kw.toLowerCase()));
    if (isExcluded) {
      db.run("UPDATE jobs SET status = 'excluded', category = 'Excluded' WHERE id = ?", [job.id]);
      console.log(`🚫 [Excluded] ${job.title} at ${job.company}`);
      continue;
    }

    // 2. Keyword Match Score
    const foundKeywords = includeKeywords.filter((kw: string) => jobText.includes(kw.toLowerCase()));
    const keywordScore = Math.min(100, Math.round((foundKeywords.length / includeKeywords.length) * 100 * 2)); // Weighted

    db.run(`
      UPDATE jobs 
      SET match_score = ?, 
          status = 'pending_semantic',
          discovery_logic = ?
      WHERE id = ?
    `, [keywordScore, `Keywords found: ${foundKeywords.join(', ')}`, job.id]);
    
    console.log(`📡 [Pending Semantic] ${job.title} at ${job.company} (KW Score: ${keywordScore}%)`);
  }
}
