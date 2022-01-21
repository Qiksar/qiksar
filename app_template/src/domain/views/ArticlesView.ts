import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class ArticlesView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create(
      'articles',
      'article_id',
      'Articles'
    )

      .Field('subject', 'Topic')
      .Field('summary', 'Summary')
      .Field('image', 'Banner', 'image', ['EntityEditImage'])
      .Field('article', 'Article')

      .Fetch('members', 'created_by', 'member', 'member_id firstname lastname')
      .Flatten('member.firstname member.lastname', 'Author')
      .UseEnum('article_status', 'status_id', 'status')

    super(schema, true);
  }
}

const view = new ArticlesView();
export default view;
