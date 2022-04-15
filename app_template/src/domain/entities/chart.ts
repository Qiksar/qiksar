import IEntityDefinition from 'src/qiksar/qikflow/base/IEntityDefinition';
import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';

const chart: IEntityDefinition = {
  name: 'charts',
  key: 'chart_id',
  label: 'Flowcharts',
  icon: 'graph',
  fields: [
    {
      name: 'name',
      column: 'name',
      label: 'Chart Name',
      editor: 'EntityEditText',
      options: onGrid,
    },
    {
      name: 'chart',
      column: 'chart',
      label: 'Chart',
      editor: 'EditFlowchart',
    },
  ],
  transformations: [
    {
      name: 'selector',
      transform: { label: 'name' },
    },
  ],
};

export default chart;
