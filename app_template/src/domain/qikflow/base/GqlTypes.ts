export type Dictionary = Record<string, unknown>;
export type GqlRecord = Record<string, unknown>;
export type GqlRecords = GqlRecord[];
export type TranslateRecord = (row: GqlRecord) => GqlRecord;
