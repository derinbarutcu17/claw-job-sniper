import { Database } from "bun:sqlite";
import { execSync } from "child_process";

export async function draftOutreach(db: Database, jobId: number) {
  const job = db.query("SELECT * FROM jobs WHERE id = ?").get(jobId) as any;
  if (!job) return null;

  console.log(`✍️ Drafting outreach for ${job.company}...`);

  // We use a "SOTA" Ghostwriter prompt inspired by your Vibe Library
  const systemPrompt = `
Act as a Strategic Career Ghostwriter and "Vibe Code" Specialist. 
Your goal is to draft a punchy, high-fidelity LinkedIn DM that connects a user's projects to a specific job role.

**The User's Background:**
Name: Derin Barutçu
Philosophy: "Vibe Code" - Design-first development, high-fidelity UI, and agentic automation.

**The Target Job:**
Role: ${job.title}
Company: ${job.company}
Description: ${job.description.substring(0, 500)}...

**Relevant Projects Found:**
${job.relevant_projects}

**Guidelines:**
1. **NO FLUFF:** Avoid "I am writing to express my interest."
2. **HOOK FIRST:** Start with a specific observation about their company or role.
3. **PROOF OVER PROMISE:** Instead of saying "I am good at X," say "I built [Project Name] which solved [Problem Y] using [Stack Z]."
4. **THE VIBE:** Maintain a calm, professional, but slightly edgy "vibe" (not corporate drone).
5. **LENGTH:** Max 150 words.

Output ONLY the final DM text.
  `;

  // This would normally call sessions_spawn or an LLM tool.
  // For the local script, we'll simulate the output or use a local LLM if available.
  // Given we are in OpenClaw, I'll use a placeholder and let the Agent handle the actual LLM turn.
  
  const draft = `Hey ${job.company} team,\n\nI saw you're looking for a ${job.title}. I've been deep in ${job.relevant_projects.split(',')[0]} lately—an autonomous engine that solves exactly what you're targeting. I'd love to show you how my "Vibe Code" philosophy could accelerate your roadmap.\n\nBest,\nDerin`;

  db.run("UPDATE jobs SET status = 'drafted' WHERE id = ?", [jobId]);
  
  return draft;
}
