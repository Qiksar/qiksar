import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class ArticlesView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create({
      entityName: 'articles',
      keyField: 'article_id',
      label: 'Articles',
      icon: 'feed',
    })

      .AddField({
        name: 'topic',
        label: 'Topic',
        column: 'subject',
        type: 'text',
        options: ['EntityEditText', 'ongrid'],
      })
      .AddField({
        name: 'summary',
        label: 'Summary',
        column: 'summary',
        type: 'text',
        options: ['EntityEditText'],
      })
      .AddField({
        name: 'banner',
        label: 'Banner',
        column: 'image',
        type: 'image',
        options: ['EntityEditImage'],
      })
      .AddField({
        name: 'article',
        label: 'Article',
        column: 'article',
        type: 'text',
        options: ['EntityEditMarkdown'],
      })

      .Fetch({
        name: 'author',
        label: 'Author',
        target_schema: 'members',
        source_key: 'created_by',
        source_object: 'member',
        columns: 'member_id firstname lastname',
        options: ['readonly', 'hidden'],
      })
      .Flatten({
        name: 'author',
        field_paths: 'member.firstname member.lastname',
        label: 'Author',
        column_name: 'author',
      })
      .UseEnum({
        name: 'status',
        schemaName: 'article_status',
        source_id_column: 'status_id',
        preferred_join_name: 'status',
        label: 'Published Status',
      });

    super(schema, true);
  }
}

const view = new ArticlesView();
export default view;
