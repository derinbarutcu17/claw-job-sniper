import { Database } from "bun:sqlite";

export async function draftOutreach(db: Database, jobId: number) {
  const job = db.query("SELECT * FROM jobs WHERE id = ?").get(jobId) as any;
  if (!job) return null;

  console.log(`✍️ Drafting outreach for ${job.company}...`);

  // Draft content based on your Vibe Code philosophy
  const draft = `Hey ${job.company} team,\n\nI saw you're looking for a ${job.title}. I've been deep in ${job.relevant_projects.split(',')[0]} lately—an autonomous project that aligns with the specific technical needs of this role. I'd love to show you how my "Vibe Code" philosophy could accelerate your roadmap.\n\nBest,\nDerin`;

  db.run("UPDATE jobs SET outreach_draft = ?, status = 'drafted' WHERE id = ?", [draft, jobId]);
  
  return draft;
}
