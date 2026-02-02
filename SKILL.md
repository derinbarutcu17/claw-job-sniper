---
name: claw-job-sniper
description: CV-based job discovery tool. Scans feeds, ranks them against profile/cv.md, and manages a blacklist of companies.
---

# Claw Job Sniper 🎯

A utility for autonomous job hunting based on a local CV.

## Commands

- `!sniper run`: Scans configured sources and ranks jobs against `profile/cv.md`.
- `!sniper digest`: Shows a list of the top 5 job matches.
- `!sniper draft <id>`: Generates a personalized outreach pitch for a specific job.
- `!sniper blacklist <company>`: Adds a company to the exclusion list.
- `!sniper serve`: Launches the dashboard at `localhost:3000`.

## Configuration

Modify `config.json` to manage:
- RSS feeds (`sources`)
- Keywords (`search`)
- Blacklisted companies (`blacklist`)
- Automation thresholds
