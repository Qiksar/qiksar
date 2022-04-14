import { Dictionary } from '../base/GqlTypes';

// TODO Enumerate the edit components rather than having to do a hardcoded list

import EntityEditImage from './EntityEditImage.vue';
import EntityEditLichert from './EntityEditLichert.vue';
import EntityEditSelect from './EntityEditSelect.vue';
import EntityEditTags from './EntityEditTags.vue';
import EntityEditText from './EntityEditText.vue';
import EntityEditMarkdown from './EntityEditMarkdown.vue';
import EditFlowchart from './EditFlowchart.vue';

const components: Dictionary = {
  EntityEditImage,
  EntityEditLichert,
  EntityEditSelect,
  EntityEditTags,
  EntityEditText,
  EntityEditMarkdown,
  EditFlowchart,
};

export default components;
