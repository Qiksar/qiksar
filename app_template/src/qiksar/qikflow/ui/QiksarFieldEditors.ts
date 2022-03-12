/**
 * Maintain a list of the different field editors that can be used in forms.
 *
 * TODO Enumerate the editors and generate this file at build time / or when a new edit component is added
 */

import { Dictionary } from '../base/GqlTypes';

import EntityEditImage from './EntityEditImage.vue';
import EntityEditLichert from './EntityEditLichert.vue';
import EntityEditMultiCheck from './EntityEditMultiCheck.vue';
import EntityEditSelect from './EntityEditSelect.vue';
import EntityEditTags from './EntityEditTags.vue';
import EntityEditText from './EntityEditText.vue';
import EntityEditMarkdown from './EntityEditMarkdown.vue';

const components = {
  EntityEditImage,
  EntityEditLichert,
  EntityEditMultiCheck,
  EntityEditSelect,
  EntityEditTags,
  EntityEditText,
  EntityEditMarkdown,
} as Dictionary;

export default components;
