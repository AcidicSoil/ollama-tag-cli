#!/bin/bash

# Ollama Tag CLI Backup Script
# This script automates the backup process of the project to GitHub

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configure error handling
set -e
trap 'echo -e "${RED}Error occurred. Exiting...${NC}"; exit 1' ERR

# Function to display messages with timestamp
log_message() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if git is installed
if ! command_exists git; then
    echo -e "${RED}Error: Git is not installed. Please install Git before running this script.${NC}"
    exit 1
fi

# Default values
DEFAULT_COMMIT_MESSAGE="Backup: $(date '+%Y-%m-%d %H:%M:%S') - Ollama Tag CLI development checkpoint"
DEFAULT_BRANCH="main"

# Parse arguments
REMOTE_URL=""
COMMIT_MESSAGE=""
BRANCH=""

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -r|--remote)
            REMOTE_URL="$2"
            shift 2
            ;;
        -m|--message)
            COMMIT_MESSAGE="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: ./backup.sh [options]"
            echo "Options:"
            echo "  -r, --remote URL    Set the remote repository URL"
            echo "  -m, --message MSG   Set commit message"
            echo "  -b, --branch NAME   Set branch name (default: main)"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Set defaults if not provided
COMMIT_MESSAGE=${COMMIT_MESSAGE:-$DEFAULT_COMMIT_MESSAGE}
BRANCH=${BRANCH:-$DEFAULT_BRANCH}

# Start the backup process
log_message "${GREEN}Starting backup process...${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    log_message "${YELLOW}Git repository not found. Initializing...${NC}"
    git init
    log_message "${GREEN}Git repository initialized.${NC}"
else
    log_message "${GREEN}Git repository already exists.${NC}"
fi

# Ensure user info is configured
git_user_name=$(git config user.name)
git_user_email=$(git config user.email)

if [ -z "$git_user_name" ] || [ -z "$git_user_email" ]; then
    log_message "${YELLOW}Git user information not found. Setting temporary values...${NC}"
    git config user.name "Ollama User"
    git config user.email "ollama-user@example.com"
    log_message "${GREEN}Temporary Git user information set.${NC}"
    log_message "${YELLOW}Note: It's recommended to set your proper Git user information with:${NC}"
    log_message "${YELLOW}  git config --global user.name \"Your Name\"${NC}"
    log_message "${YELLOW}  git config --global user.email \"your.email@example.com\"${NC}"
fi

# Stage all files
log_message "${GREEN}Staging all files...${NC}"
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    log_message "${YELLOW}No changes to commit.${NC}"
else
    # Commit changes
    log_message "${GREEN}Committing changes with message: '${COMMIT_MESSAGE}'${NC}"
    git commit -m "$COMMIT_MESSAGE"
fi

# Set up remote if provided
if [ -n "$REMOTE_URL" ]; then
    # Check if remote already exists
    if git remote | grep -q "^origin$"; then
        current_remote=$(git remote get-url origin)
        if [ "$current_remote" != "$REMOTE_URL" ]; then
            log_message "${YELLOW}Remote origin already exists with URL: ${current_remote}${NC}"
            log_message "${YELLOW}Updating to: ${REMOTE_URL}${NC}"
            git remote set-url origin "$REMOTE_URL"
        else
            log_message "${GREEN}Remote origin already set to: ${REMOTE_URL}${NC}"
        fi
    else
        log_message "${GREEN}Adding remote origin: ${REMOTE_URL}${NC}"
        git remote add origin "$REMOTE_URL"
    fi

    # Set the branch name
    log_message "${GREEN}Setting branch to: ${BRANCH}${NC}"
    git branch -M "$BRANCH"

    # Push to remote
    log_message "${GREEN}Pushing to remote repository...${NC}"
    git push -u origin "$BRANCH"
    log_message "${GREEN}Successfully pushed to ${REMOTE_URL}${NC}"
else
    log_message "${YELLOW}No remote URL provided. Skipping push to remote.${NC}"
    log_message "${YELLOW}To push to a remote repository, run:${NC}"
    log_message "${YELLOW}  ./backup.sh -r https://github.com/username/repo.git${NC}"
fi

log_message "${GREEN}Backup completed successfully!${NC}" 