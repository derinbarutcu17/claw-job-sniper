import { execSync } from "child_process";
import { Database } from "bun:sqlite";

export async function calculateMatches(db: Database) {
  console.log("🧠 Calculating Vibe-Match scores...");
  
  const jobs = db.query("SELECT * FROM jobs WHERE status = 'new' OR status = 'no_match'").all() as any[];
  
  for (const job of jobs) {
    const jobQuery = `${job.title} ${job.company}`.replace(/"/g, "'");
    
    try {
      // Priority 1: Specific Collection Search
      let cmd = `/Users/derin/.bun/bin/qmd search "${jobQuery}" -c sniper-knowledge --json -n 3`;
      let qmdRaw = execSync(cmd).toString().trim();
      
      // Priority 2: Generic Title Keywords
      if (qmdRaw.includes("No results found") || !qmdRaw.startsWith("[")) {
        const keywords = job.title.split(' ').filter((w: string) => w.length > 3).slice(0, 2).join(' ');
        if (keywords) {
          cmd = `/Users/derin/.bun/bin/qmd search "${keywords}" -c sniper-knowledge --json -n 3`;
          qmdRaw = execSync(cmd).toString().trim();
        }
      }

      // Priority 3: Global Workspace Search (Wide casting)
      if (qmdRaw.includes("No results found") || !qmdRaw.startsWith("[")) {
        cmd = `/Users/derin/.bun/bin/qmd search "${job.title.split(' ')[0]}" --json -n 3`;
        qmdRaw = execSync(cmd).toString().trim();
      }

      if (qmdRaw.includes("No results found") || !qmdRaw.startsWith("[")) {
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
