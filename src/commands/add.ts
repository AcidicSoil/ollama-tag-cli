/**
 * Add Tag Command
 * Adds a new tag to the system
 */

import chalk from 'chalk';
import { TagService } from '../utils/tag-service.js';

interface AddOptions {
    category?: string;
    description?: string;
}

/**
 * Add a new tag to the system
 * @param name Name of the tag
 * @param options Command options
 */
export async function addTag(name: string, options: AddOptions): Promise<void> {
    try {
        const tagService = new TagService();

        // Validate tag name
        if (!name || name.trim() === '') {
            console.error(chalk.red('Error:'), 'Tag name cannot be empty');
            process.exit(1);
        }

        // Check if tag already exists
        const exists = await tagService.tagExists(name);
        if (exists) {
            console.error(chalk.yellow('Warning:'), `Tag "${name}" already exists`);
            process.exit(1);
        }

        // Add the tag
        await tagService.addTag({
            name,
            category: options.category,
            description: options.description,
            createdAt: new Date().toISOString()
        });

        console.log(chalk.green('Success:'), `Tag "${name}" added successfully`);

        if (options.category) {
            console.log(`Category: ${chalk.blue(options.category)}`);
        }

        if (options.description) {
            console.log(`Description: ${chalk.dim(options.description)}`);
        }
    } catch (error) {
        console.error(chalk.red('Error adding tag:'), error.message);
        process.exit(1);
    }
} 