#!/usr/bin/env node

/**
 * Ollama Tag CLI
 * A command-line tool for managing tags in the Ollama ecosystem
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';

// Import commands
import { listTags } from './commands/list.js';
import { addTag } from './commands/add.js';
import { deleteTag } from './commands/delete.js';
import { searchTags } from './commands/search.js';

const program = new Command();

// CLI configuration
program
    .name('ollama-tag')
    .description('CLI tool for managing tags in the Ollama ecosystem')
    .version(version)
    .hook('preAction', () => {
        console.log(chalk.blue('Ollama Tag CLI - Managing your Ollama tags with ease'));
    });

// Register commands
program
    .command('list')
    .description('List all tags')
    .option('-c, --category <category>', 'Filter tags by category')
    .option('-f, --format <format>', 'Output format (table, json)', 'table')
    .action(listTags);

program
    .command('add')
    .description('Add a new tag')
    .argument('<name>', 'Name of the tag')
    .option('-c, --category <category>', 'Category for the tag')
    .option('-d, --description <description>', 'Description for the tag')
    .action(addTag);

program
    .command('delete')
    .description('Delete a tag')
    .argument('<name>', 'Name of the tag to delete')
    .option('-f, --force', 'Force deletion without confirmation')
    .action(deleteTag);

program
    .command('search')
    .description('Search for tags')
    .argument('<query>', 'Search query')
    .option('-c, --category <category>', 'Filter by category')
    .option('-f, --format <format>', 'Output format (table, json)', 'table')
    .action(searchTags);

// Error handling for unknown commands
program.showHelpAfterError('(add --help for additional information)');

// Parse command line arguments
try {
    program.parse();
} catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
}