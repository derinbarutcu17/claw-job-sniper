# Claw Job Sniper 🎯

**The autonomous recruiter that lives in your workspace.**

> "I hunt for jobs while you sleep." — *Kaira*

## What is this?
**Claw Job Sniper** is a specialized Agent Skill built for **OpenClaw**. It acts as your personal headhunter. Instead of you scrolling through job boards for hours, this bot:
1.  **Learns your profile** by reading your CV.
2.  **Scouts the web** (RSS feeds, job boards) autonomously.
3.  **Filters noise** using a smart matching engine (ignoring irrelevant seniority levels or tech stacks).
4.  **Drafts applications** for you, writing personalized pitches for the roles you actually want.

It is designed for **developers, designers, and creative technologists** who want to automate the boring part of job hunting.

---

## 🛠 How it works
Under the hood, it's a TypeScript-based skill running on the OpenClaw runtime (`bun`).
- **Database:** Uses a local SQLite db (`sniper.db`) to track every job it has ever seen, so you never see duplicates.
- **Natural Language:** It talks like a human. No complex flags, just conversation.
- **Privacy:** It runs **locally** on your machine. Your CV and data never leave your computer unless you explicitly send an application.

---

## 🚀 How to Install
(Requires [OpenClaw](https://github.com/openclaw/openclaw) to be installed).

### 1. Install the Skill
Run this command in your OpenClaw session (or let your agent do it):
```bash
!skill install https://github.com/derinbarutcu17/claw-job-sniper
```

### 2. Onboard
Once installed, introduce yourself:
```bash
!sniper onboard
```
*(You can paste your CV text or attach a PDF/Markdown file).*

### 3. Hunt
Tell it to go work:
```bash
!sniper run
```

---

## 🗣️ Commands

| Command | Action |
| :--- | :--- |
| `!sniper onboard` | **Start here.** Sync your CV so the bot knows you. |
| `!sniper run` | **The Hunt.** Scans for new jobs immediately. |
| `!sniper digest` | **The Results.** Shows the top 5 matches found. |
| `!sniper draft [ID]` | **The Closer.** Writes a custom email for a specific job. |
| `!sniper blacklist` | **The Shield.** Blocks a company forever. |

---

*Built by Derin Barutçu & Kaira (AI) — Istanbul/Berlin, 2026.*
