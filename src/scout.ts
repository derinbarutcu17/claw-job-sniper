import { initDB, saveJob } from "./db";
import * as fs from "fs";

async function fetchRSS(source: { name: string, url: string }) {
  console.log(`🔍 Scouting ${source.name}...`);
  try {
    const response = await fetch(source.url);
    const xml = await response.text();
    
    const jobs: any[] = [];
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    for (const item of items) {
      const titleMatch = item.match(/<title>(.*?)<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const descriptionMatch = item.match(/<description>([\s\S]*?)<\/description>/);
      
      if (titleMatch && linkMatch) {
        let fullTitle = titleMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim();
        fullTitle = fullTitle.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        
        let title = fullTitle;
        let company = "Unknown";
        
        if (fullTitle.includes(" // ")) {
          [title, company] = fullTitle.split(" // ");
        } else if (fullTitle.includes(" at ")) {
           [title, company] = fullTitle.split(" at ");
        }

        let description = descriptionMatch ? descriptionMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim() : "";
        description = description.replace(/<[^>]*>?/gm, '');

        jobs.push({
          external_id: linkMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim(),
          title: title.trim(),
          company: company.trim(),
          description: description,
          url: linkMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim(),
          source: source.name,
          location: "Unknown" // Could be parsed from title/description
        });
      }
    }
    return jobs;
  } catch (e) {
    console.error(`❌ Error fetching ${source.name}:`, e);
    return [];
  }
}

export async function runScout() {
  const db = initDB();
  const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
  
  let totalFound = 0;
  let totalNew = 0;

  for (const source of config.sources) {
    if (source.type === "rss") {
      const jobs = await fetchRSS(source);
      totalFound += jobs.length;
      for (const job of jobs) {
        const result = saveJob(db, job);
        if (result.changes > 0) totalNew++;
      }
    }
  }
  
  console.log(`✅ Scout complete. Found ${totalFound} jobs total, ${totalNew} are new.`);
  return { totalFound, totalNew };
}

if (import.meta.main) {
  runScout().catch(console.error);
}
