import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class GroupsView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create({
      entityName: 'groups',
      keyField: 'group_id',
      label: 'Membership Groups',
      icon: 'people',
    })

      .AddField({ name:'name', column: 'name', label: 'Group Name' })
      .AddField({ name:'state', column: 'state', label: 'State' })
      .Fetch({
        name: 'leader',
        label: 'Leader',
        target_schema: 'members',
        source_key: 'leader_id',
        source_object: 'leader',
        columns: 'member_id firstname lastname',
      })
      .Flatten({
        name:'leader', 
        field_paths: 'leader.firstname leader.lastname',
        label: 'Leader Name',
        column_name: 'leader',
      })

      .CreateTransform('selector', { id: 'group_id', label: 'name' });

    super(schema, true);
  }
}

const view = new GroupsView();
export default view;
