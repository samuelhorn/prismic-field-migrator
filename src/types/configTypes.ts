/** Configuration for type-specific migration behavior */
export interface PerTypeModeConfig {
  /** Whether to enable per-type migration mode */
  enabled: boolean;
  /** The type of documents to process */
  documentTypes: string[];
}

/** Field mapping configuration */
export interface FieldMapping {
  /** Location pattern for data traversal
   * Supports the following syntax:
   * - path.to.field - Nested object access
   * - items[*] - Array iteration (wildcard)
   * - items[0] - Specific array index
   * Example: "items[*].link" traverses all items array elements' link property
   */
  location: string;
  /** Field mapping definitions using path patterns
   * Supports the following syntax:
   * - "." - References current node value
   * - "^" - Moves up one level (parent)
   * - "^.property" - Access parent's property
   * - "^^.property" - Move up two levels and access property
   * Example: {
   *   link: ".",           // Current node value
   *   label: "^.label",    // Parent node's label property
   *   style: "^^.style"    // Grandparent node's style property
   * }
   */
  fields: Record<string, string>;
}

interface SourceFieldMapping extends FieldMapping {
  /** Whether to remove the source fields content after successful migration */
  removeAfterMigration?: boolean;
}

/** Slice migration configuration */
export interface SliceToMigrateConfig {
  /** The type of slice to migrate */
  type: string;
  /** Supported variations of the slice */
  variations: string[];
  /** Field mapping configuration */
  fieldMapping: {
    /** Source field mappings */
    source: SourceFieldMapping[];
    /** Target field mapping */
    target: FieldMapping;
  };
}

/** Main configuration interface */
export interface Config {
  /** Per-type mode configuration for when you only want to target specific document types */
  perTypeMode: PerTypeModeConfig;
  /** Repository identifier */
  repository: string | undefined;
  /** Migration authentication token */
  migrationToken: string | undefined;
  /** API authentication key */
  apiKey: string | undefined;
  /** Slice migration configuration */
  sliceToMigrate: SliceToMigrateConfig;
  /** Sometimes a document model can contain multiple slice zones, if that's the case for any of your documents, add them to this array */
  possibleSliceZones: string[];
}
