/**
 * Search Tags Command
 * Searches for tags based on query with optional filtering
 */

import chalk from 'chalk';
import { TagService } from '../utils/tag-service.js';

interface SearchOptions {
    category?: string;
    format?: 'table' | 'json';
}

/**
 * Search for tags based on a query string
 * @param query Search query string
 * @param options Command options
 */
export async function searchTags(query: string, options: SearchOptions): Promise<void> {
    try {
        const tagService = new TagService();

        // Validate query string
        if (!query || query.trim() === '') {
            console.error(chalk.red('Error:'), 'Search query cannot be empty');
            process.exit(1);
        }

        // Perform search
        const tags = await tagService.searchTags(query, options.category);

        if (tags.length === 0) {
            console.log(chalk.yellow('No tags found matching your search'));
            console.log(chalk.dim(`Search query: "${query}"`));
            if (options.category) {
                console.log(chalk.dim(`Category filter: "${options.category}"`));
            }
            return;
        }

        // Display search results based on format option
        if (options.format === 'json') {
            console.log(JSON.stringify(tags, null, 2));
        } else {
            console.log(chalk.bold(`Search results for "${query}":`));

            tags.forEach(tag => {
                const category = tag.category ? chalk.blue(`[${tag.category}]`) : '';
                console.log(`${chalk.green('•')} ${chalk.white(tag.name)} ${category}`);

                if (tag.description) {
                    console.log(`  ${chalk.dim(tag.description)}`);
                }
            });

            console.log(chalk.dim(`\nFound ${tags.length} matching tags`));
        }
    } catch (error) {
        console.error(chalk.red('Error searching tags:'), error.message);
        process.exit(1);
    }
} 