import { execSync } from "child_process";
import { Database } from "bun:sqlite";

export async function calculateMatches(db: Database) {
  console.log("🧠 Calculating Vibe-Match scores...");
  
  const jobs = db.query("SELECT * FROM jobs WHERE status = 'new'").all() as any[];
  
  for (const job of jobs) {
    // Construct a cleaner query
    const jobQuery = `${job.title} ${job.company}`.replace(/"/g, "'");
    
    try {
      // Use lexical search for core project matching
      const cmd = `/Users/derin/.bun/bin/qmd search "${jobQuery}" -c sniper-knowledge --json -n 3`;
      const qmdRaw = execSync(cmd).toString().trim();
      
      if (qmdRaw.includes("No results found") || !qmdRaw.startsWith("[")) {
        // Fallback: search with just job title keywords
        const keywords = job.title.split(' ').filter((w: string) => w.length > 3).join(' ');
        if (keywords) {
          const fallbackCmd = `/Users/derin/.bun/bin/qmd search "${keywords}" -c sniper-knowledge --json -n 3`;
          const fallbackRaw = execSync(fallbackCmd).toString().trim();
          if (!fallbackRaw.includes("No results found") && fallbackRaw.startsWith("[")) {
            const results = JSON.parse(fallbackRaw);
            updateJobMatch(db, job, results);
            continue;
          }
        }
        db.run("UPDATE jobs SET status = 'no_match' WHERE id = ?", [job.id]);
        continue;
      }

      const results = JSON.parse(qmdRaw);
      updateJobMatch(db, job, results);
      
    } catch (e) {
      console.error(`❌ Match error for job ${job.id}:`, e);
      db.run("UPDATE jobs SET status = 'error' WHERE id = ?", [job.id]);
    }
  }
}

function updateJobMatch(db: Database, job: any, results: any[]) {
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
