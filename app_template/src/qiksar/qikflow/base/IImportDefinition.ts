import fieldOptions from './fieldOptions';
import IImportFieldDefinition from './IImportFieldDefinition';

export type flattenType = 'flatten';

/**
 * Define an import whereby data can be pulled in and merged from a source entity into a target entity, as though the source entities columns were native to the target entity.
 * This is particularly useful building objects to be presented on lists, where it is useful to include details on the listed entity which are sourced from related entities.
 * 
 * @interface
 */
export default interface IImportDefinition {
  type: flattenType,
  name: string;
  label: string;
  target_schema: string;
  source_key: string;
  source_object: string;
  columns: string;
  options?: fieldOptions[];
  import: IImportFieldDefinition[];
}
