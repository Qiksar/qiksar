import fieldOptions from './fieldOptions';
import IFlattenDefinition from './IFlattenDefinition';

export type flattenType = 'flatten';

export default interface IFetchDefinition {
  type: flattenType;
  name: string;
  label: string;
  target_schema: string;
  source_key: string;
  source_object: string;
  columns: string;
  options?: fieldOptions[];
  import: IFlattenDefinition[];
}
