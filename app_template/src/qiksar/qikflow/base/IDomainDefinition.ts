import IEnumDefinition from './IEnumDefinition';
import IEntityDefinition from './IEntityDefinition';
import IJoinDefinition from './IJoinDefinition';

/**
 * Define a schema comprising enum types and more complex entity types
 *
 * @interface
 */
export default interface IDomainDefinition {
  get enums(): IEnumDefinition[];
  get entities(): IEntityDefinition[];
  get joins(): IJoinDefinition[];

  GetJoin(name: string): IJoinDefinition;
}
