/** Configuration for type-specific migration behavior */
export interface PerTypeModeConfig {
  /** Whether to enable per-type migration mode */
  enabled: boolean;
  /** The type of documents to process */
  documentTypes: string[];
}

/** Source field mapping configuration */
export interface FieldMapping {
  /** Optional container field that holds the source fields (e.g. "items") */
  container?: string | null;
  /** Array of field names to migrate from the source */
  fields: string[];
}

/** Target field mapping with transformation configuration */
export interface TargetFieldMapping {
  /** Dot notation path to the target container (e.g. "primary.link") */
  container: string;
  /** Optional field transformation rules including spread and rename options */
  transformations?: {
    /** Optional array of fields whose values should be spread into the target */
    spread?: string[];
    /** Optional map of source field names to their new names in the target */
    rename?: Record<string, string>;
  };
  /** Whether to keep the original source fields after migration */
  preserveSource: boolean;
}

/** Slice migration configuration */
export interface SliceToMigrateConfig {
  /** The type of slice to migrate */
  type: string;
  /** Supported variations of the slice */
  variations: string[];
  /** Field mapping configuration containing source and target mappings */
  fieldMapping: {
    from: FieldMapping;
    to: TargetFieldMapping;
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
  /** Array of slice zone names that may exist in document models */
  possibleSliceZones: string[];
}
