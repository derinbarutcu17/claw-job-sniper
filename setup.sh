#!/bin/bash

# Claw Job Sniper: Standardized Setup Script
# Description: Installs all dependencies for the Agentic Job Discovery Engine.

set -e

echo "🚀 Starting Claw Job Sniper Setup..."

# 1. Check for Bun
if ! command -v bun &> /dev/null; then
    echo "📦 Bun not found. Installing..."
    curl -fsSL https://bun.sh/install | bash
    # Source bun for the current session
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
else
    echo "✅ Bun is already installed."
fi

# 2. Check for QMD
if ! bun --version &> /dev/null; then
    # Fallback path if just installed
    export PATH="$HOME/.bun/bin:$PATH"
fi

if ! command -v qmd &> /dev/null; then
    echo "🧠 QMD (Quick Markdown Search) not found. Installing..."
    bun install -g https://github.com/tobi/qmd
else
    echo "✅ QMD is already installed."
fi

# 3. Install Project Dependencies
echo "npm dependencies..."
bun install

# 4. Initialize QMD Collection
echo "⚙️ Initializing local knowledge base..."
# Ensure the knowledge directory exists
mkdir -p my-knowledge

# Add the collection to QMD
# Note: Use absolute path if possible, but for a public repo, 
# we'll use a relative path based on the current directory.
qmd collection add ./my-knowledge --name job-sniper-knowledge

echo "----------------------------------------------------"
echo "✅ Setup Complete!"
echo "Next steps:"
echo "1. Drop your CV (Markdown) and Project descriptions into the 'my-knowledge' folder."
echo "2. Run 'qmd embed' to generate semantic vectors."
echo "3. Use OpenClaw to start sniping jobs."
echo "----------------------------------------------------"
