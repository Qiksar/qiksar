import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IEntityDefinition from 'src/qiksar/qikflow/base/IEntityDefinition';
import IEnumDefinition from 'src/qiksar/qikflow/base/IEnumDefinition';

const tag: IEntityDefinition = {
  name: 'tags',
  key: 'tag_id',
  label: 'Tags',
  icon: 'tag',
  fields: [
    {
      name: 'tag',
      type: 'text',
      label: 'Tag',
      column: 'tag',
      options: onGrid,
      editor: 'EntityEditText',
    },
  ],
  joins: ['article_tags'],
};

export default tag;
