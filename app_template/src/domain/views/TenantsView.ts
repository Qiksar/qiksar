import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class TenantsView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.CreateEnum({
      entityName: 'tenants',
      label: 'Tenant',
    });

    super(schema, true);
  }
}

const view = new TenantsView();
export default view;
