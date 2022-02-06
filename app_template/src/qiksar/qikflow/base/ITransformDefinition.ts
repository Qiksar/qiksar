/**
 * Defines the transformation of one object schema to another
 *
 * @interface
 */
export default interface ITransformDefinition {
  name: string;
  transform: Record<string, string>;
}
