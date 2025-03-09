/**
 * List Tags Command
 * Displays all tags in the system with optional filtering
 */

import chalk from 'chalk';
import { TagService } from '../utils/tag-service.js';

interface ListOptions {
    category?: string;
    format?: 'table' | 'json';
}

/**
 * List all tags with optional filtering by category
 * @param options Command options
 */
export async function listTags(options: ListOptions): Promise<void> {
    try {
        const tagService = new TagService();
        const tags = await tagService.getAllTags(options.category);

        if (tags.length === 0) {
            console.log(chalk.yellow('No tags found'));
            if (options.category) {
                console.log(chalk.dim(`No tags found in category "${options.category}"`));
            } else {
                console.log(chalk.dim('No tags found in the system'));
            }
            return;
        }

        // Display tags based on format option
        if (options.format === 'json') {
            console.log(JSON.stringify(tags, null, 2));
        } else {
            console.log(chalk.bold('Tags:'));

            tags.forEach(tag => {
                const category = tag.category ? chalk.blue(`[${tag.category}]`) : '';
                console.log(`${chalk.green('•')} ${chalk.white(tag.name)} ${category}`);

                if (tag.description) {
                    console.log(`  ${chalk.dim(tag.description)}`);
                }
            });

            console.log(chalk.dim(`\nTotal: ${tags.length} tags`));
        }
    } catch (error) {
        console.error(chalk.red('Error listing tags:'), error.message);
        process.exit(1);
    }
} 