/**
 * Define a router link for an entity type to enable navigation to dynamically created user interface lists and entity editing.
 *
 * @interface
 */
export default interface IEntityLink {
  title: string;
  caption: string;
  icon: string;
  link: string;
}
