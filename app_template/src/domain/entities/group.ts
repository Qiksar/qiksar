import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IEntityDefinition from 'src/qiksar/qikflow/base/IEntityDefinition';

const group: IEntityDefinition = {
  name: 'groups',
  key: 'group_id',
  label: 'Membership Groups',
  icon: 'people',
  fields: [
    {
      name: 'name',
      column: 'name',
      label: 'Group Name',
      editor: 'EntityEditText',
      options: onGrid,
    },
    {
      name: 'state',
      column: 'state',
      label: 'State',
      editor: 'EntityEditText',
      options: onGrid,
    },
    {
      name: 'leader',
      type: 'flatten',
      label: 'Leader',
      target_schema: 'members',
      source_key: 'leader_id',
      source_object: 'leader',
      columns: 'member_id firstname lastname',
      import: [
        {
          name: 'group_leader',
          field_paths: 'leader.firstname leader.lastname',
          label: 'Leader Name',
          column_name: 'leader',
          options: onGrid,
        },
      ],
    },
  ],
  transformations: [
    {
      name: 'selector',
      transform: { label: 'name' },
    },
  ],
};

export default group;
