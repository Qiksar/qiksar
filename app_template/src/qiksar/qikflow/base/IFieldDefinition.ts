import fieldOptions from './fieldOptions';
import fieldType from './fieldType';

export default interface IFieldDefinition {
  name: string;
  label: string;
  type: fieldType;
  options: fieldOptions[];
  key_column_name?: string | undefined;
  object_name?: string | undefined;
  object_columns?: string | undefined;
  object_schema?: string | undefined;
}
