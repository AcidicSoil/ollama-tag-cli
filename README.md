# Ollama Tag CLI

[![CI](https://github.com/AcidicSoil/ollama-tag-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/AcidicSoil/ollama-tag-cli/actions/workflows/ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/node/v/ollama-tag-cli)](https://nodejs.org/)
[![GitHub issues](https://img.shields.io/github/issues/AcidicSoil/ollama-tag-cli)](https://github.com/AcidicSoil/ollama-tag-cli/issues)

A command-line tool for managing tags in the Ollama ecosystem.

## Features

- **List Tags**: View all tags with optional category filtering
- **Add Tags**: Create new tags with categories and descriptions
- **Delete Tags**: Remove tags from the system
- **Search Tags**: Find tags using keyword search
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Colorful Output**: User-friendly colorized terminal output

## Installation

### Prerequisites

- Node.js v16 or higher
- Yarn or pnpm package manager

### Install from Source

```bash
# Clone the repository
git clone https://github.com/AcidicSoil/ollama-tag-cli.git
cd ollama-tag-cli

# Install dependencies
yarn install

# Build the project
yarn build

# Link globally (optional)
yarn link
```

## Usage

### List Tags

```bash
# List all tags
ollama-tag list

# List tags in a specific category
ollama-tag list --category models

# Output in JSON format
ollama-tag list --format json
```

### Add Tags

```bash
# Add a simple tag
ollama-tag add mytag

# Add a tag with category and description
ollama-tag add mytag --category models --description "My custom model tag"
```

### Delete Tags

```bash
# Delete a tag (with confirmation prompt)
ollama-tag delete mytag

# Force delete without confirmation
ollama-tag delete mytag --force
```

### Search Tags

```bash
# Search for tags matching a query
ollama-tag search "model"

# Search within a specific category
ollama-tag search "language" --category models

# Output search results in JSON format
ollama-tag search "assistant" --format json
```

## Tag Storage

Tags are stored in a JSON file located at:

- **Linux/macOS**: `~/.ollama/tags/tags.json`
- **Windows**: `%USERPROFILE%\.ollama\tags\tags.json`

## Development

```bash
# Install dependencies
yarn install

# Run in development mode with auto-reloading
yarn dev

# Run tests
yarn test
```

## License

ISC

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AcidicSoil/ollama-tag-cli/issues).

## Roadmap

- Tag categories hierarchies
- Batch operations for multiple tags
- Import/export functionality
- Interactive mode for easier management 