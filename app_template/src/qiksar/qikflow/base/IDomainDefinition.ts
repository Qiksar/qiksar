import IEnumDefinition from './IEnumDefinition';
import IEntityDefinition from './IEntityDefinition';

/**
 * Define a schema comprising enum types and more complex entity types
 *
 * @interface
 */
export default interface IDomainDefinition {
  enums: IEnumDefinition[];
  entities: IEntityDefinition[];
}
