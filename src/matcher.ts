import { execSync } from "child_process";
import { Database } from "bun:sqlite";

export async function calculateMatches(db: Database) {
  console.log("🧠 Calculating Vibe-Match scores...");
  
  const jobs = db.query("SELECT * FROM jobs WHERE status = 'new'").all() as any[];
  
  for (const job of jobs) {
    // Construct a cleaner query
    const jobQuery = `${job.title} ${job.company}`.replace(/"/g, "'");
    
    try {
      // Using 'search' (lexical) for Phase 3 demo to avoid high model loading latency.
      // In Phase 5, we will upgrade this to a persistent MCP connection or batch vector search.
      const cmd = `/Users/derin/.bun/bin/qmd search "${jobQuery}" -c sniper-knowledge --json -n 3`;
      const qmdRaw = execSync(cmd).toString().trim();
      
      if (qmdRaw.startsWith("No results found")) {
        // Fallback search with just the title words
        const fallbackCmd = `/Users/derin/.bun/bin/qmd search "${job.title.split(' ')[0]}" -c sniper-knowledge --json -n 3`;
        const qmdFallback = execSync(fallbackCmd).toString().trim();
        if (qmdFallback.startsWith("No results found")) {
          db.run("UPDATE jobs SET status = 'no_match' WHERE id = ?", [job.id]);
          continue;
        }
        // Use fallback results
        const results = JSON.parse(qmdFallback);
        processResults(db, job, results);
      } else {
        const results = JSON.parse(qmdRaw);
        processResults(db, job, results);
      }
    } catch (e) {
      console.error(`❌ Match error for job ${job.id}:`, e);
      db.run("UPDATE jobs SET status = 'error' WHERE id = ?", [job.id]);
    }
  }
}

function processResults(db: Database, job: any, results: any[]) {
  if (results && results.length > 0) {
    const topResult = results[0];
    const matchScore = Math.min(100, Math.round(topResult.score * 100));
    const relevantProjects = results.map((r: any) => (r.file || "").split('/').pop()).join(", ");
    
    db.run(`
      UPDATE jobs 
      SET match_score = ?, 
          relevant_projects = ?, 
          status = 'analyzed'
      WHERE id = ?
    `, [matchScore, relevantProjects, job.id]);
    
    console.log(`🎯 Match found: ${job.title} at ${job.company} - Score: ${matchScore}%`);
  }
}
