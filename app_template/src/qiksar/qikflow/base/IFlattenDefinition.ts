import fieldOptions from './fieldOptions';

export default interface IFlattenDefinition {
  name: string;
  field_paths: string;
  label: string;
  options?: fieldOptions[];
  column_name: string;
}
