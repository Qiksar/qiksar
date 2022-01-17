export default interface ITableColumn {
  name: string;
  label: string;
  field: string;
  sortable: boolean;
  align: 'right' | 'left';
}
