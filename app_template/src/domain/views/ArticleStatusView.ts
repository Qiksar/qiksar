import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class ArticleStatusView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.CreateEnum({
      entityName: 'article_status',
      label: 'Publish Status',
      icon: 'record_voice_over',
    });

    super(schema, true);
  }
}

const view = new ArticleStatusView();
export default view;
