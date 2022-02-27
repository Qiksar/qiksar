type fieldOptions =
  | 'heavy'
  | 'sortable'
  | 'required'
  | 'readonly'
  | 'ongrid'
  | 'isenum'
  | 'hidden'
  | 'locale'
  | 'writeonce';

export default fieldOptions;

export const onGrid: fieldOptions[] = ['ongrid', 'sortable'];
export const defaultFieldOptions: fieldOptions[] = [];
export const localize: fieldOptions[] = [...onGrid, 'locale'];
export const defaultEnumOptions: fieldOptions[] = [...onGrid, 'readonly'];
export const hiddenFieldOptions: fieldOptions[] = ['hidden'];