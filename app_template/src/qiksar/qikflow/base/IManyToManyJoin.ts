export default interface IManyToManyJoin {
  table_name: string; // blog_tags
  master_entity: string; // blog post
  secondary_entity: string; // tags
}
