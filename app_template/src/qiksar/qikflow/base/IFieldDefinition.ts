import EditComponentType from './EditComponentType';
import fieldOptions from './fieldOptions';
import fieldType from './fieldType';
import IFieldValidation from './IFieldValidation';

/**
 * Describe a field to be added to a schema
 *
 * @interface
 */
export default interface IFieldDefinition {
  name: string;
  label: string;
  column: string;
  type?: fieldType;
  options?: fieldOptions[];
  editor: EditComponentType;
  helpText?: string;
  autofocus?: boolean;
  clearable?: boolean;
  placeholder?: string;
  validationRules?: IFieldValidation;

  key_column_name?: string | undefined;
  object_name?: string | undefined;
  object_columns?: string | undefined;
  object_schema?: string | undefined;
}
