import fieldOptions from './fieldOptions';
import fieldType from './fieldType';

/**
 * Describe a field to be added to a schema
 * @interface IFieldDefinition
 */
export default interface IFieldDefinition {
  label: string;
  column: string;
  type?: fieldType;
  options?: fieldOptions[];
  key_column_name?: string | undefined;
  object_name?: string | undefined;
  object_columns?: string | undefined;
  object_schema?: string | undefined;
}