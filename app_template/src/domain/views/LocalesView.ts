import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class LocalesView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.CreateEnum({entityName: 'locales', label:'Locale'});

    super(schema, true);
  }
}

const view = new LocalesView();
export default view;
