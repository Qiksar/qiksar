import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IEntityDefinition from 'src/qiksar/qikflow/base/IEntityDefinition';
import person from './person';

const member: IEntityDefinition = {
  name: 'members',
  key: 'member_id',
  label: 'Member',
  icon: 'person',
  fields: [
    ...person,
    {
      name: 'rating',
      type: 'number',
      label: 'Member Rating',
      column: 'rating',
      editor: 'EntityEditLichert',
    },
    {
      name: 'role',
      type: 'enum',
      entity: 'roles',
      source_id_column: 'role_id',
      preferred_join_name: 'role',
    },
    {
      name: 'status',
      type: 'enum',
      entity: 'status',
      source_id_column: 'status_id',
      preferred_join_name: 'status',
    },
    {
      name: 'locale',
      type: 'enum',
      entity: 'locales',
      source_id_column: 'locale_id',
      preferred_join_name: 'locale',
    },
    {
      name: 'group',
      type: 'flatten',
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
          options: onGrid,
        },
        {
          name: 'state',
          field_paths: 'group.state',
          label: 'State',
          column_name: 'group_state',
          options: onGrid,
        },
      ],
    },
  ],
  transformations: [
    {
      name: 'selector',
      transform: {
        label: 'firstname lastname',
      },
    },
  ],
};

export default member;
