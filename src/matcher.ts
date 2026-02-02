import { Database } from "bun:sqlite";
import * as fs from "fs";

export async function calculateMatches(db: Database) {
  console.log("🧠 Analyzing jobs against profile/cv.md...");
  
  const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
  const cvContent = fs.existsSync("profile/cv.md") ? fs.readFileSync("profile/cv.md", "utf8") : "";
  
  const blacklistCompanies = config.blacklist?.companies || [];
  const blacklistKeywords = config.blacklist?.keywords || [];
  const includeKeywords = config.search.include_keywords;

  const jobs = db.query("SELECT * FROM jobs WHERE status = 'new'").all() as any[];
  
  for (const job of jobs) {
    const jobText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    
    // 1. Blacklist Check
    const inBlacklistedCompany = blacklistCompanies.some((c: string) => job.company.toLowerCase().includes(c.toLowerCase()));
    const hasBlacklistedKeyword = blacklistKeywords.some((kw: string) => jobText.includes(kw.toLowerCase()));

    if (inBlacklistedCompany || hasBlacklistedKeyword) {
      db.run("UPDATE jobs SET status = 'excluded', category = 'Excluded' WHERE id = ?", [job.id]);
      console.log(`🚫 [Excluded] ${job.title} at ${job.company}`);
      continue;
    }

    // 2. Profile-Based Matching (Keyword density for now)
    const foundKeywords = includeKeywords.filter((kw: string) => jobText.includes(kw.toLowerCase()));
    const keywordScore = Math.min(100, Math.round((foundKeywords.length / Math.max(1, includeKeywords.length)) * 100 * 1.5));

    db.run(`
      UPDATE jobs 
      SET match_score = ?, 
          status = 'analyzed',
          discovery_logic = ?
      WHERE id = ?
    `, [keywordScore, `Keywords found: ${foundKeywords.join(', ')}`, job.id]);
    
    console.log(`🎯 [Analyzed] ${job.title} at ${job.company} (Match: ${keywordScore}%)`);
  }
}
