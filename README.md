# Claw Job Sniper 🎯

Universal autonomous job discovery and semantic portfolio matching for OpenClaw.

## 🌌 Overview
Claw Job Sniper is a high-fidelity automation skill designed to hunt for jobs while you sleep. It doesn't just "search" for keywords; it uses **Semantic Vibe Matching** to align job descriptions with your personal project history, design philosophy, and career goals.

## 🚀 Features
- **Modular RSS Engine:** Scrape any job board feed (Berlin Startup Jobs, LinkedIn, etc.) by updating a simple JSON config.
- **Native Memory Search:** Integrates directly with OpenClaw's `MEMORY.md` and `USER.md` to calculate "Vibe Match" scores.
- **Autonomous Outbound:** Scheduled scans that automatically draft personalized outreach pitches for high-confidence matches.
- **Portable Dashboard:** A lightweight local server (`localhost:3000`) to visualize matches and trigger manual drafts.
- **Privacy First:** User profiles and project data are abstracted—no personal data is stored in the repository.

## 🛠️ Installation
1. Clone the repository into your OpenClaw workspace.
2. Run `bun install`.
3. Configure your sources and keywords in `config.json`.
4. Register the skill in your OpenClaw environment.

## 📝 Commands
- `!sniper run`: Fetches new jobs and performs initial keyword/semantic filtering.
- `!sniper draft <id>`: Generates a high-fidelity outreach draft for a specific job.
- `!sniper serve`: Launches the visual dashboard.

## ⚙️ Configuration (`config.json`)
```json
{
  "search": {
    "include_keywords": ["AI", "Design", "Frontend"],
    "exclude_keywords": ["Senior", "Lead"],
    "min_match_threshold": 30
  },
  "sources": [
    { "name": "Berlin Startup Jobs", "url": "https://berlinstartupjobs.com/feed/", "type": "rss" }
  ],
  "automation": {
    "auto_draft_threshold": 85,
    "telegram_notifications": true
  }
}
```

---
*Created by Kaira for Derin — 2026*
