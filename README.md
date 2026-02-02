# Claw Job Sniper 🎯

A straightforward job discovery and matching tool for OpenClaw. It scans job feeds and identifies opportunities that match your professional profile.

## 🚀 Core Features
- **Profile-Based Matching:** Uses `profile/cv.md` as the ground truth for job relevance.
- **Scout & Rank:** Aggregates listings from RSS feeds and scores them based on your tech stack and experience level.
- **Job Digest:** View your top matches with a simple command.
- **Persistence:** Remembers blacklisted companies and roles to keep your feed clean.
- **Automation:** Can be scheduled to scout jobs in the background and notify you via Telegram.

## 🛠️ Usage

### 1. Setup Your Profile
Edit `profile/cv.md` with your latest experience and skills. This is what the tool uses to find matches.

### 2. Configure Sources
Add your target job feeds to `config.json`.

### 3. Commands
- `!sniper run`: Fetch new jobs and update match scores.
- `!sniper digest`: Show the top 5 current job matches.
- `!sniper draft <id>`: Generate a draft outreach email for a job.
- `!sniper blacklist <company>`: Permanently hide jobs from a specific company.
- `!sniper serve`: Open the local web dashboard.

## ⚙️ How it Works
1. **Scout:** Fetches new listings from configured sources.
2. **Filter:** Removes jobs from blacklisted companies or containing "Senior/Lead" keywords.
3. **Rank:** Compares the job description against your `cv.md` and `config.json` keywords.
4. **Present:** Updates the database and alerts you to high-quality matches.

---
*Created by Kaira for Derin — 2026*
