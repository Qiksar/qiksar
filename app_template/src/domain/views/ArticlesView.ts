import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class ArticlesView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create({
      entityName: 'articles',
      keyField: 'article_id',
      label: 'Articles',
      icon: 'record_voice_over',
    })

      .AddField({
        label: 'Topic',
        column: 'subject',
        type: 'text',
        options: ['EntityEditText', 'ongrid'],
      })
      .AddField({
        label: 'Summary',
        column: 'summary',
        type: 'text',
        options: ['EntityEditText'],
      })
      .AddField({
        label: 'Banner',
        column: 'image',
        type: 'image',
        options: ['EntityEditImage'],
      })
      .AddField({
        label: 'Article',
        column: 'article',
        type: 'text',
        options: ['EntityEditMarkdown'],
      })

      .Fetch({
        label: 'Author',
        target_schema: 'members',
        source_key: 'created_by',
        source_object: 'member',
        columns: 'member_id firstname lastname',
        options: ['readonly', 'hidden'],
      })
      .Flatten({
        field_paths: 'member.firstname member.lastname',
        label: 'Author',
        column_name: 'author',
      })
      .UseEnum({
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
