/**
 * File Utilities
 * Helper functions for file operations with cross-platform compatibility
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Check if a file exists
 * @param filePath Path to the file
 * @returns True if the file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

/**
 * Check if a directory exists
 * @param dirPath Path to the directory
 * @returns True if the directory exists, false otherwise
 */
export async function dirExists(dirPath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

/**
 * Ensure a directory exists, creating it if necessary
 * @param dirPath Path to the directory
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
    try {
        await fs.ensureDir(dirPath);
    } catch (error) {
        throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
    }
}

/**
 * Create a backup of a file
 * @param filePath Path to the file
 * @returns Path to the backup file
 */
export async function backupFile(filePath: string): Promise<string> {
    try {
        // Make sure the file exists
        if (!(await fileExists(filePath))) {
            throw new Error(`File ${filePath} does not exist`);
        }

        // Create backup path with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${filePath}.${timestamp}.backup`;

        // Copy the file to backup path
        await fs.copy(filePath, backupPath);

        return backupPath;
    } catch (error) {
        throw new Error(`Failed to backup file ${filePath}: ${error.message}`);
    }
}

/**
 * Get a safe path that works across platforms
 * @param pathSegments Path segments to join
 * @returns A normalized path
 */
export function safePath(...pathSegments: string[]): string {
    return path.normalize(path.join(...pathSegments));
}

/**
 * Read a JSON file and parse its contents
 * @param filePath Path to the JSON file
 * @returns Parsed JSON object
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data) as T;
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`File ${filePath} does not exist`);
        }
        throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
    }
}

/**
 * Write data to a JSON file
 * @param filePath Path to the JSON file
 * @param data Data to write
 */
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    try {
        // Ensure parent directory exists
        await ensureDirectory(path.dirname(filePath));

        // Write data to file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
    }
} 