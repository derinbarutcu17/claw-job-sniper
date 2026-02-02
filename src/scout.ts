import { initDB, saveJob } from "./db";

async function fetchBSJ() {
  console.log("🔍 Scouting Berlin Startup Jobs...");
  const feedUrl = "https://berlinstartupjobs.com/feed/";
  const response = await fetch(feedUrl);
  const xml = await response.text();
  
  const jobs: any[] = [];
  // Simple XML parsing using regex for the items (to keep it zero-dep)
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  
  for (const item of items) {
    const titleMatch = item.match(/<title>(.*?)<\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const descriptionMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
    
    if (titleMatch && linkMatch) {
      // Format is usually "Role // Company"
      const fullTitle = titleMatch[1].replace("&#8211;", "-").replace("&#8217;", "'");
      const [title, company] = fullTitle.split(" // ");
      
      jobs.push({
        external_id: linkMatch[1],
        title: title || fullTitle,
        company: company || "Unknown",
        description: descriptionMatch ? descriptionMatch[1].replace(/<[^>]*>?/gm, '').trim() : "",
        url: linkMatch[1],
        source: "Berlin Startup Jobs",
        location: "Berlin"
      });
    }
  }
  
  return jobs;
}

async function runScout() {
  const db = initDB();
  const bsjJobs = await fetchBSJ();
  
  let newCount = 0;
  for (const job of bsjJobs) {
    const result = saveJob(db, job);
    if (result.changes > 0) newCount++;
  }
  
  console.log(`✅ Scout complete. Found ${bsjJobs.length} jobs, ${newCount} are new.`);
}

runScout().catch(console.error);
