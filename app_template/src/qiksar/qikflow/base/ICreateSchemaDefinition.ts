import IFetchDefinition from './IFetchDefinition';
import IFieldDefinition from './IFieldDefinition';
import IUseEnumDefinition from './IUseEnumDefinition';

export default interface ICreateSchemaDefinition {
  entityName: string;
  keyField: string;
  label: string | undefined;
  icon: string;
  fields: (IFieldDefinition | IUseEnumDefinition | IFetchDefinition)[];
}
