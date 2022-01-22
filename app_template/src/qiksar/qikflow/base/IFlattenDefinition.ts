import fieldOptions from './fieldOptions';

export default interface IFlattenDefinition {
  field_paths: string;
  label: string;
  options?: fieldOptions[];
  column_name: string;
}
