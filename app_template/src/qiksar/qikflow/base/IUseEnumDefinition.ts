export type enumType = 'enum';
/**
 * Define a connection between a target entity and a source enumeration type. The enumeration type is referenced by the target entity.
 *
 * @interface
 */
export default interface IUseEnumDefinition {
  type: enumType;
  name: string;
  label?: string;
  entity: string;
  source_id_column: string;
  preferred_join_name: string;
}
