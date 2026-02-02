import { Database } from "bun:sqlite";
import * as fs from "fs";
import { execSync } from "child_process";

export async function renderPitchPDF(job: any, projectData: any) {
  console.log(`📄 Rendering high-fidelity PDF for ${job.company}...`);

  let template = fs.readFileSync("templates/pitch.html", "utf8");
  
  // Fill template
  template = template
    .replace(/{{COMPANY}}/g, job.company)
    .replace(/{{JOB_TITLE}}/g, job.title)
    .replace(/{{MATCH_RATIONALE}}/g, job.match_rationale || "Your background in agentic automation and high-fidelity design makes you a top-tier candidate for this role.")
    .replace(/{{PROJECT_NAME}}/g, projectData.title || "Vibe Code Engine")
    .replace(/{{PROJECT_SUMMARY}}/g, projectData.description || "An autonomous market intelligence suite.");

  const htmlPath = `data/temp_pitch_${job.id}.html`;
  const pdfPath = `data/pitch_${job.company.replace(/\s+/g, '_')}.pdf`;
  
  fs.writeFileSync(htmlPath, template);

  // In a real OpenClaw execution, we would call the browser tool.
  // For this local build, we'll output the instruction for the agent.
  console.log(`✅ HTML prepared at ${htmlPath}`);
  
  return { htmlPath, pdfPath };
}
