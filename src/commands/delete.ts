/**
 * Delete Tag Command
 * Removes a tag from the system
 */

import chalk from 'chalk';
import { createInterface } from 'readline';
import { TagService } from '../utils/tag-service.js';

interface DeleteOptions {
    force?: boolean;
}

/**
 * Delete a tag from the system
 * @param name Name of the tag to delete
 * @param options Command options
 */
export async function deleteTag(name: string, options: DeleteOptions): Promise<void> {
    try {
        const tagService = new TagService();

        // Validate tag name
        if (!name || name.trim() === '') {
            console.error(chalk.red('Error:'), 'Tag name cannot be empty');
            process.exit(1);
        }

        // Check if tag exists
        const exists = await tagService.tagExists(name);
        if (!exists) {
            console.error(chalk.yellow('Warning:'), `Tag "${name}" does not exist`);
            process.exit(1);
        }

        // If force option not provided, ask for confirmation
        if (!options.force) {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });

            const answer = await new Promise<string>(resolve => {
                rl.question(chalk.yellow(`Are you sure you want to delete the tag "${name}"? (y/n) `), resolve);
            });

            rl.close();

            if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
                console.log(chalk.blue('Operation cancelled'));
                return;
            }
        }

        // Delete the tag
        await tagService.deleteTag(name);

        console.log(chalk.green('Success:'), `Tag "${name}" deleted successfully`);
    } catch (error) {
        console.error(chalk.red('Error deleting tag:'), error.message);
        process.exit(1);
    }
} 