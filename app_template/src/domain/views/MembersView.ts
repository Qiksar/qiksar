import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class MembersView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create({
      entityName: 'members',
      keyField: 'member_id',
      label: 'Member',
      icon: 'person',
    })

      .AddField({ name:'firstname', label: 'First Name', column: 'firstname', type: 'text' })
      .AddField({ name:'lastname', label: 'Surame', column: 'lastname' })
      .AddField({ name:'email', label: 'Email Address', column: 'email', type: 'email' })
      .AddField({ name:'mobile', label: 'Mobile Number', column: 'mobile', type: 'mobile' })
      .AddField({
        name:'photo', 
        label: 'Profile Photo',
        column: 'photo',
        type: 'image',
        options: ['heavy', 'EntityEditImage'],
      })
      .AddField({
        name:'rating', 
        label: 'Member Rating',
        column: 'rating',
        type: 'number',
        options: ['EntityEditLichert'],
      })
      .Fetch({
        name: 'group',
        label: 'Group',
        target_schema: 'groups',
        source_key: 'group_id',
        source_object: 'group',
        columns: 'group_id name state',
      })
      .Flatten({
        name:'group', 
        field_paths: 'group.name',
        label: 'Group',
        column_name: 'group_name',
      })
      .Flatten({
        name:'state', 
        field_paths: 'group.state',
        label: 'State',
        column_name: 'group_state',
      })
      .UseEnum({
        name:'role', 
        schemaName: 'roles',
        source_id_column: 'role_id',
        preferred_join_name: 'role',
      })
      .UseEnum({
        name:'status', 
        schemaName: 'status',
        source_id_column: 'status_id',
        preferred_join_name: 'status',
      })
      .UseEnum({
        name:'locale', 
        schemaName: 'locales',
        source_id_column: 'locale_id',
        preferred_join_name: 'locale',
      })
      .CreateTransform('selector', {
        id: 'member_id',
        label: 'firstname lastname',
      });

    super(schema);
  }
}

const view = new MembersView();
export default view;
