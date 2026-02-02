---
name: claw-job-sniper
description: Universal autonomous job discovery and semantic portfolio matching. Scans configured feeds, ranks them against your history via memory_search, and drafts personalized outreach.
---

# Claw Job Sniper 🎯

A universal OpenClaw skill for autonomous job hunting. It uses your `USER.md` and `MEMORY.md` to find the perfect "Vibe Match".

## Configuration

Modify `config.json` to add RSS feeds, keywords, and automation thresholds.

## Commands

- `!sniper run`: Scans configured sources, calculates match scores, and updates the local dashboard.
- `!sniper draft <id>`: Manually generates an outreach pitch for a specific job.
- `!sniper serve`: Launches the visual dashboard at `localhost:3000`.

## Universal Features
- **RSS Engine:** Add any job board feed (Berlin Startup Jobs, LinkedIn RSS, etc.).
- **Memory Matching:** Uses OpenClaw native `memory_search` to find alignment with your projects.
- **Auto-Outreach:** Automatically drafts and sends high-fidelity pitches to Telegram for matches >85%.
- **Zero Absolute Paths:** Works on any machine with OpenClaw.
