/**
 * A dictionary of objects which uses strings as the key value
 */
export type Dictionary = Record<string, unknown>;

/**
 * A GraphQL record
 */
export type GqlRecord = Record<string, unknown>;

/**
 * A collection of GraphQL records
 */
export type GqlRecords = GqlRecord[];

/**
 * Transform a record from one structure to another.
 * 
 * Transformers can add and remove fields, or otherwise completely alter the structure/
 */
export type TransformRecordFunction = (row: GqlRecord) => GqlRecord;
