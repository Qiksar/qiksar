import fieldOptions from './fieldOptions';

export default interface IFetchDefinition {
  name: string;
  label: string;
  target_schema: string;
  source_key: string;
  source_object: string;
  columns: string;
  options?: fieldOptions[];
}
