import { onGrid } from './../qiksar/qikflow/base/fieldOptions';
import ISchemaDefinition from 'src/qiksar/qikflow/base/ISchemaDefinition';

const schema: ISchemaDefinition = {
  enums: [
    {
      name: 'article_status',
      label: 'Publish Status',
      icon: 'task',
    },
    {
      name: 'locales',
      label: 'Locale',
      icon: 'flag',
    },
    {
      name: 'roles',
      label: 'Role',
      icon: 'badge',
    },
    {
      name: 'status',
      label: 'Status',
      icon: 'flaky',
    },
    {
      name: 'tenants',
      label: 'Tenant',
      icon: 'apartment',
    },
  ],
  entities: [
    {
      name: 'articles',
      key: 'article_id',
      label: 'Articles',
      icon: 'feed',
      fields: [
        {
          name: 'block_code',
          type: 'text',
          label: 'Code',
          column: 'block_code',
          options: onGrid,
          editor: 'EntityEditText',
        },
        {
          name: 'topic',
          type: 'text',
          label: 'Topic',
          column: 'subject',
          options: onGrid,
          editor: 'EntityEditText',
        },
        {
          name: 'summary',
          type: 'text',
          label: 'Summary',
          column: 'summary',
          editor: 'EntityEditText',
        },
        {
          name: 'banner',
          type: 'image',
          label: 'Banner',
          column: 'image',
          editor: 'EntityEditImage',
        },
        {
          name: 'article',
          type: 'markdown',
          label: 'Article',
          column: 'article',
          editor: 'EntityEditMarkdown',
        },
        {
          name: 'status',
          type: 'enum',
          schemaName: 'article_status',
          source_id_column: 'status_id',
          preferred_join_name: 'status',
          label: 'Published Status',
        },
        {
          name: 'author',
          type: 'flatten',
          label: 'Author',
          target_schema: 'members',
          source_key: 'created_by',
          source_object: 'member',
          columns: 'member_id firstname lastname',
          options: ['readonly', 'hidden'],
          import: [
            {
              name: 'author',
              field_paths: 'member.firstname member.lastname',
              label: 'Author',
              column_name: 'author',
            },
          ],
        },
      ],
    },
    {
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
          transform: { id: 'group_id', label: 'name' },
        },
      ],
    },
    {
      name: 'members',
      key: 'member_id',
      label: 'Member',
      icon: 'person',
      fields: [
        {
          name: 'firstname',
          label: 'First Name',
          column: 'firstname',
          editor: 'EntityEditText',
          options: onGrid,
        },

        {
          name: 'lastname',
          label: 'Surame',
          column: 'lastname',
          editor: 'EntityEditText',
          options: onGrid,
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          column: 'email',
          editor: 'EntityEditText',
          options: onGrid,
        },
        {
          name: 'mobile',
          type: 'mobile',
          label: 'Mobile Number',
          column: 'mobile',
          editor: 'EntityEditText',
          options: onGrid,
        },
        {
          name: 'photo',
          type: 'image',
          label: 'Profile Photo',
          column: 'photo',
          editor: 'EntityEditImage',
        },
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
          schemaName: 'roles',
          source_id_column: 'role_id',
          preferred_join_name: 'role',
        },
        {
          name: 'status',
          type: 'enum',
          schemaName: 'status',
          source_id_column: 'status_id',
          preferred_join_name: 'status',
        },
        {
          name: 'locale',
          type: 'enum',
          schemaName: 'locales',
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
            id: 'member_id',
            label: 'firstname lastname',
          },
        },
      ],
    },
  ],
};

export default schema;
