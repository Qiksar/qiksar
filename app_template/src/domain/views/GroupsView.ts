import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class GroupsView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create(
      'groups',
      'group_id',
      'Membership Groups'
    )

      .Field('name', 'Group Name')
      .Field('state', 'State')

      .Fetch('members', 'leader_id', 'leader', 'member_id firstname lastname')
      .Flatten('leader.firstname leader.lastname', 'Leader Name')

      .CreateTransform('selector', { id: 'group_id', label: 'name' });

    super(schema, true);
  }
}

const view = new GroupsView();
export default view;
