import IEnumDefinition from './IEnumDefinition';
import IEntityDefinition from './IEntityDefinition';
import IManyToManyJoin from './IManyToManyJoin';

/**
 * Define a schema comprising enum types and more complex entity types
 *
 * @interface
 */
export default interface IDomainDefinition {
  enums: IEnumDefinition[];
  entities: IEntityDefinition[];
  joins: IManyToManyJoin[];
}
