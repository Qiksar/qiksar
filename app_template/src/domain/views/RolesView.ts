import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class RolesView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.CreateEnum({
      entityName: 'roles',
      label: 'Role',
      icon: 'record_voice_over',
    });

    super(schema, true);
  }
}

const view = new RolesView();
export default view;
