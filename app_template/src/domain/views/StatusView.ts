import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class StatusView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.CreateEnum({
      entityName: 'status',
      label: 'Status',
      icon: 'flaky',
    });

    super(schema, true);
  }
}

const view = new StatusView();
export default view;
