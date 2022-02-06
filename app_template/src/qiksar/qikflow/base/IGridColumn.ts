/**
 * Define a grid column (table)
 *
 * @interface
 */
export default interface IGridColumn {
  name: string;
  label: string;
  field: string;
  sortable: boolean;
  align: 'right' | 'left';
}
