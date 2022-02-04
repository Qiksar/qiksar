import ISchemaDefinition from 'src/qiksar/qikflow/base/ISchemaDefinition';

const schema: ISchemaDefinition = {
  enums: [
    {
      entityName: 'article_status',
      label: 'Publish Status',
      icon: 'task',
    },
    {
      entityName: 'locales',
      label: 'Locale',
      icon: 'flag',
    },
    {
      entityName: 'roles',
      label: 'Role',
      icon: 'badge',
    },
    {
      entityName: 'status',
      label: 'Status',
      icon: 'flaky',
    },
    {
      entityName: 'tenants',
      label: 'Tenant',
      icon: 'apartment',
    },
  ],
  entities: [
    {
      entityName: 'articles',
      keyField: 'article_id',
      label: 'Articles',
      icon: 'feed',
      fields: [
        {
          type: 'text',
          name: 'topic',
          label: 'Topic',
          column: 'subject',
          options: ['EntityEditText', 'ongrid'],
        },
        {
          type: 'text',
          name: 'summary',
          label: 'Summary',
          column: 'summary',
          options: ['EntityEditText'],
        },
        {
          type: 'image',
          name: 'banner',
          label: 'Banner',
          column: 'image',
          options: ['EntityEditImage'],
        },
        {
          type: 'text',
          name: 'article',
          label: 'Article',
          column: 'article',
          options: ['EntityEditMarkdown'],
        },
        {
          type: 'enum',
          name: 'status',
          schemaName: 'article_status',
          source_id_column: 'status_id',
          preferred_join_name: 'status',
          label: 'Published Status',
        },
        {
          type: 'flatten',
          name: 'author',
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
      entityName: 'groups',
      keyField: 'group_id',
      label: 'Membership Groups',
      icon: 'people',
      fields: [
        { name: 'name', column: 'name', label: 'Group Name' },
        { name: 'state', column: 'state', label: 'State' },
        {
          type: 'flatten',
          name: 'leader',
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
    },
  ],
};

export default schema;
