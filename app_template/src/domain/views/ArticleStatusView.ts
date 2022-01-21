import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class ArticleStatusView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.CreateEnum('article_status', 'Article Status');

    super(schema, true);
  }
}

const view = new ArticleStatusView();
export default view;
