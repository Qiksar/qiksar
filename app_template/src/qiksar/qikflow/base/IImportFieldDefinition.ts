import fieldOptions from './fieldOptions';

/**
 * Define the fields of a source entity which are to be imported to a target entity
 *
 * @interface
 */
export default interface IImportFieldDefinition {
  name: string;
  field_paths: string;
  label: string;
  options?: fieldOptions[];
  column_name: string;
}
