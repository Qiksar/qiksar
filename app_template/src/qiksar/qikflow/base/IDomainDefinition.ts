import IEnumDefinition from './IEnumDefinition';
import IEntityDefinition from './IEntityDefinition';
import IManyToManyJoin from './IManyToManyJoin';

/**
 * Define a schema comprising enum types and more complex entity types
 *
 * @interface
 */
export default interface IDomainDefinition {
  get enums(): IEnumDefinition[];
  get entities(): IEntityDefinition[];
  get joins(): IManyToManyJoin[];

  GetJoin(name: string): IManyToManyJoin;
}
