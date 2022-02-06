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
  entityName: string;
  keyField: string;
  label: string | undefined;
  icon: string;
  fields: (IFieldDefinition | IUseEnumDefinition | IImportDefinition)[];
  transformations?: ITransformDefinition[];
}
