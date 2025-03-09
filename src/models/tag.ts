/**
 * Tag Model
 * Defines the structure of tag data
 */

/**
 * Represents a tag in the Ollama ecosystem
 */
export interface Tag {
    /**
     * Name of the tag (unique identifier)
     */
    name: string;

    /**
     * Optional category for grouping tags
     */
    category?: string;

    /**
     * Optional description of the tag's purpose
     */
    description?: string;

    /**
     * ISO timestamp of when the tag was created
     */
    createdAt: string;

    /**
     * Optional ISO timestamp of when the tag was last updated
     */
    updatedAt?: string;

    /**
     * Optional metadata for additional tag properties
     */
    metadata?: Record<string, any>;
}

/**
 * Tags database structure
 */
export interface TagsDatabase {
    /**
     * Collection of tags indexed by name
     */
    tags: Record<string, Tag>;

    /**
     * ISO timestamp of when the database was last updated
     */
    lastUpdated: string;

    /**
     * Metadata for the tags database
     */
    meta: {
        /**
         * Version of the database schema
         */
        version: string;
        /**
         * Name of the tool that created/updated the database
         */
        tool: string;
    };
} 