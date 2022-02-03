import Query from '../../qiksar/qikflow/base/Query';
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class MembersView extends Query {
  constructor() {
    const schema: EntitySchema = EntitySchema.Create({
      entityName: 'members',
      keyField: 'member_id',
      label: 'Member',
      icon: 'person',
      fields: [
        {
          type: 'text',
          name: 'firstname',
          label: 'First Name',
          column: 'firstname',
        },
        { name: 'lastname', label: 'Surame', column: 'lastname' },
        {
          type: 'email',
          name: 'email',
          label: 'Email Address',
          column: 'email',
        },
        {
          type: 'mobile',
          name: 'mobile',
          label: 'Mobile Number',
          column: 'mobile',
        },
        {
          type: 'image',
          name: 'photo',
          label: 'Profile Photo',
          column: 'photo',
          options: ['heavy', 'EntityEditImage'],
        },
        {
          type: 'number',
          name: 'rating',
          label: 'Member Rating',
          column: 'rating',
          options: ['EntityEditLichert'],
        },
        {
          type: 'enum',
          name: 'role',
          schemaName: 'roles',
          source_id_column: 'role_id',
          preferred_join_name: 'role',
        },
        {
          type: 'enum',
          name: 'status',
          schemaName: 'status',
          source_id_column: 'status_id',
          preferred_join_name: 'status',
        },
        {
          type: 'enum',
          name: 'locale',
          schemaName: 'locales',
          source_id_column: 'locale_id',
          preferred_join_name: 'locale',
        },
        {
          type: 'flatten',
          name: 'group',
          label: 'Group',
          target_schema: 'groups',
          source_key: 'group_id',
          source_object: 'group',
          columns: 'group_id name state',
          import: [
            {
              name: 'group_name',
              field_paths: 'group.name',
              label: 'Group',
              column_name: 'group_name',
            },
            {
              name: 'state',
              field_paths: 'group.state',
              label: 'State',
              column_name: 'group_state',
            },
          ],
        },
      ],
      transformations: [
        {
          name: 'selector',
          transform: {
            id: 'member_id',
            label: 'firstname lastname',
          },
        },
      ],
    });

    super(schema);
  }
}

const view = new MembersView();
export default view;
