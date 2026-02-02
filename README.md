# Claw Job Sniper 🦞🎯

**The Universal Agentic Job Discovery Engine**

Claw Job Sniper is a high-fidelity, autonomous career engine built on [OpenClaw](https://openclaw.ai). It moves beyond simple job tracking by using local semantic search to find the perfect match between your unique "Proof of Work" and new opportunities.

## 🧠 Why Claw Job Sniper?

1.  **Vibe-Matched Discovery:** It doesn't just search for keywords. It uses **QMD** (Local Semantic Search) to rank your portfolio projects against job descriptions.
2.  **Autonomous Outreach:** Automatically drafts personalized pitches that highlight your specific, relevant experience for every role.
3.  **Local & Private:** No cloud uploads. Your data, your projects, and your CV stay on your machine.
4.  **Modern Aesthetics:** Features a clean, high-fidelity local dashboard to visualize your career funnel.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
git clone https://github.com/DerinBarutcu/claw-job-sniper
cd claw-job-sniper
./setup.sh
```

### 2. Add Your Knowledge
Drop your CV and project descriptions (in Markdown) into the `my-knowledge/` directory.

### 3. Generate Embeddings
```bash
qmd embed
```

### 4. Run the Sniper
```bash
bun index.ts run
```

### 5. Launch the Dashboard
```bash
bun index.ts serve
```
Visit `http://localhost:3000` to view your matches.

## 🏗️ Technical Architecture
*   **Orchestrator:** OpenClaw
*   **Semantic Engine:** QMD (Query Markup Documents)
*   **Runtime:** Bun / TypeScript
*   **Database:** SQLite

---
Built by [Derin Barutçu](https://derinb.vercel.app) with **Vibe Code** principles. 🌌
