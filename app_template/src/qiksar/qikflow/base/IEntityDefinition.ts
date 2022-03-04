import IImportDefinition from './IImportDefinition';
import IFieldDefinition from './IFieldDefinition';
import ITransformDefinition from './ITransformDefinition';
import IUseEnumDefinition from './IUseEnumDefinition';

/**
 * Define an entity which assist in server driven, or at least dynamically created, user interfaces
 *
 * @interface
 */
export default interface IEntityDefinition {
  name: string;
  key: string;
  label: string | undefined;
  icon: string;
  fields: (IFieldDefinition | IUseEnumDefinition | IImportDefinition)[];
  transformations?: ITransformDefinition[];
  joins?: string[];
}
