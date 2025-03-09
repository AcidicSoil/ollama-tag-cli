/**
 * Tag Service
 * Handles CRUD operations for tags and manages the tag database
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Tag, TagsDatabase } from '../models/tag.js';
import { fileExists, ensureDirectory } from './file-utils.js';

/**
 * Service for managing tags in the Ollama ecosystem
 */
export class TagService {
    private dbPath: string;
    private db: TagsDatabase | null = null;

    /**
     * Creates a new TagService instance
     * @param customDbPath Optional custom path for the tag database
     */
    constructor(customDbPath?: string) {
        // Default to ~/.ollama/tags/tags.json if no custom path provided
        this.dbPath = customDbPath || path.join(os.homedir(), '.ollama', 'tags', 'tags.json');
    }

    /**
     * Load the tags database, creating it if it doesn't exist
     * @returns The tags database
     */
    private async loadDatabase(): Promise<TagsDatabase> {
        if (this.db) {
            return this.db;
        }

        try {
            // Ensure the directory exists
            await ensureDirectory(path.dirname(this.dbPath));

            // Check if database file exists
            if (await fileExists(this.dbPath)) {
                // Read and parse the database file
                const data = await fs.readFile(this.dbPath, 'utf8');
                this.db = JSON.parse(data);
                return this.db;
            } else {
                // Create a new database if it doesn't exist
                this.db = {
                    tags: {},
                    lastUpdated: new Date().toISOString(),
                    meta: {
                        version: '1.0.0',
                        tool: 'ollama-tag-cli'
                    }
                };

                // Write the new database to disk
                await this.saveDatabase();
                return this.db;
            }
        } catch (error) {
            throw new Error(`Failed to load tag database: ${error.message}`);
        }
    }

    /**
     * Save the tags database to disk
     */
    private async saveDatabase(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not loaded');
        }

        try {
            // Update the lastUpdated timestamp
            this.db.lastUpdated = new Date().toISOString();

            // Ensure the directory exists
            await ensureDirectory(path.dirname(this.dbPath));

            // Write the database to disk
            await fs.writeFile(this.dbPath, JSON.stringify(this.db, null, 2), 'utf8');
        } catch (error) {
            throw new Error(`Failed to save tag database: ${error.message}`);
        }
    }

    /**
     * Check if a tag already exists
     * @param name Name of the tag
     * @returns True if the tag exists, false otherwise
     */
    async tagExists(name: string): Promise<boolean> {
        const db = await this.loadDatabase();
        return !!db.tags[name];
    }

    /**
     * Get all tags, optionally filtered by category
     * @param category Optional category to filter by
     * @returns Array of tags
     */
    async getAllTags(category?: string): Promise<Tag[]> {
        const db = await this.loadDatabase();
        const tags = Object.values(db.tags);

        // Filter by category if provided
        if (category) {
            return tags.filter(tag => tag.category === category);
        }

        return tags;
    }

    /**
     * Add a new tag
     * @param tag Tag to add
     */
    async addTag(tag: Tag): Promise<void> {
        const db = await this.loadDatabase();

        // Ensure tag name is unique
        if (db.tags[tag.name]) {
            throw new Error(`Tag "${tag.name}" already exists`);
        }

        // Add the tag
        db.tags[tag.name] = tag;

        // Save the database
        await this.saveDatabase();
    }

    /**
     * Delete a tag
     * @param name Name of the tag to delete
     */
    async deleteTag(name: string): Promise<void> {
        const db = await this.loadDatabase();

        // Check if tag exists
        if (!db.tags[name]) {
            throw new Error(`Tag "${name}" does not exist`);
        }

        // Delete the tag
        delete db.tags[name];

        // Save the database
        await this.saveDatabase();
    }

    /**
     * Update an existing tag
     * @param name Name of the tag to update
     * @param updates Updates to apply
     */
    async updateTag(name: string, updates: Partial<Omit<Tag, 'name' | 'createdAt'>>): Promise<void> {
        const db = await this.loadDatabase();

        // Check if tag exists
        if (!db.tags[name]) {
            throw new Error(`Tag "${name}" does not exist`);
        }

        // Apply updates
        db.tags[name] = {
            ...db.tags[name],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Save the database
        await this.saveDatabase();
    }

    /**
     * Search for tags based on a query string
     * @param query Search query
     * @param category Optional category to filter by
     * @returns Matching tags
     */
    async searchTags(query: string, category?: string): Promise<Tag[]> {
        const db = await this.loadDatabase();
        const tags = Object.values(db.tags);
        const normalizedQuery = query.toLowerCase();

        // Filter tags by query and category
        return tags.filter(tag => {
            // Check if tag matches the query
            const nameMatch = tag.name.toLowerCase().includes(normalizedQuery);
            const descriptionMatch = tag.description?.toLowerCase().includes(normalizedQuery) || false;
            const matchesQuery = nameMatch || descriptionMatch;

            // Check if tag matches the category filter
            const matchesCategory = !category || tag.category === category;

            return matchesQuery && matchesCategory;
        });
    }

    /**
     * Create a backup of the tags database
     * @returns Path to the backup file
     */
    async backupDatabase(): Promise<string> {
        // Ensure database is loaded
        await this.loadDatabase();

        // Create backup path with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${this.dbPath}.${timestamp}.backup`;

        try {
            // Copy database file to backup path
            await fs.copy(this.dbPath, backupPath);
            return backupPath;
        } catch (error) {
            throw new Error(`Failed to backup tag database: ${error.message}`);
        }
    }
} 