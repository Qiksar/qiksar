import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IEntityDefinition from 'src/qiksar/qikflow/base/IEntityDefinition';

const article: IEntityDefinition = {
  name: 'articles',
  key: 'article_id',
  label: 'Articles',
  icon: 'feed',
  fields: [
    {
      name: 'block_code',
      type: 'text',
      label: 'Code',
      column: 'block_code',
      options: onGrid,
      editor: 'EntityEditText',
    },
    {
      name: 'topic',
      type: 'text',
      label: 'Topic',
      column: 'subject',
      options: onGrid,
      editor: 'EntityEditText',
    },
    {
      name: 'summary',
      type: 'text',
      label: 'Summary',
      column: 'summary',
      editor: 'EntityEditText',
    },
    {
      name: 'banner',
      type: 'image',
      label: 'Banner',
      column: 'image',
      editor: 'EntityEditImage',
    },
    {
      name: 'article',
      type: 'markdown',
      label: 'Article',
      column: 'article',
      editor: 'EntityEditMarkdown',
    },
    {
      name: 'status',
      type: 'enum',
      schemaName: 'article_status',
      source_id_column: 'status_id',
      preferred_join_name: 'status',
      label: 'Published Status',
    },
    {
      name: 'author',
      type: 'flatten',
      label: 'Author',
      target_schema: 'members',
      source_key: 'created_by',
      source_object: 'member',
      columns: 'member_id firstname lastname',
      options: ['readonly', 'hidden'],
      import: [
        {
          name: 'author',
          field_paths: 'member.firstname member.lastname',
          label: 'Author',
          column_name: 'author',
        },
      ],
    },
  ],
};
export default article;
