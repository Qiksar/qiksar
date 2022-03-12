export default interface IJoinDefinition {
  source: string; // blog_tags
  master_entity: string; // blog post
  master_key: string; // blog post
  secondary_entity: string; // tags
  secondary_key: string; // tags
}
