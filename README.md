# Claw Job Sniper 🎯

**The autonomous recruiter that lives in your workspace.**

## What is this?
**Claw Job Sniper** is a universal autonomous headhunter for **OpenClaw**. 

It works for **any industry**—not just tech. Whether you are a designer, a marketer, a writer, or an engineer, this bot:
1.  **Learns your profile** by reading your CV.
2.  **Scouts your specific sources** (RSS feeds you configure).
3.  **Filters noise** using your custom keywords.
4.  **Drafts applications** tailored to the roles you want.

It automates the boring part of job hunting, so you can focus on the interviews.

---

## 🛠 How it works
Under the hood, it's a configurable engine running on the OpenClaw runtime (`bun`).
- **Universal Search:** You define the sources (RSS feeds from any job board).
- **Custom Filters:** You define the keywords that matter for *your* career.
- **Privacy:** It runs **locally** on your machine. Your CV and data never leave your computer.

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

*Built by Derin Barutçu — Istanbul/Berlin, 2026.*
