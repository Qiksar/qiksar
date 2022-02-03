import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class ArticlesView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create({
      entityName: 'articles',
      keyField: 'article_id',
      label: 'Articles',
      icon: 'feed',
      fields: [
        {
          type: 'text',
          name: 'topic',
          label: 'Topic',
          column: 'subject',
          options: ['EntityEditText', 'ongrid'],
        },
        {
          type: 'text',
          name: 'summary',
          label: 'Summary',
          column: 'summary',
          options: ['EntityEditText'],
        },
        {
          type: 'image',
          name: 'banner',
          label: 'Banner',
          column: 'image',
          options: ['EntityEditImage'],
        },
        {
          type: 'text',
          name: 'article',
          label: 'Article',
          column: 'article',
          options: ['EntityEditMarkdown'],
        },
        {
          type: 'enum',
          name: 'status',
          schemaName: 'article_status',
          source_id_column: 'status_id',
          preferred_join_name: 'status',
          label: 'Published Status',
        },
        {
          type: 'flatten',
          name: 'author',
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
    });

    super(schema, true);
  }
}

const view = new ArticlesView();
export default view;
