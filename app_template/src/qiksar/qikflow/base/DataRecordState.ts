/**
 * Indicates the status of the current record in a store
 */
enum DataRecordState {
  None,
  New,
  Unchanged,
  Changed,
  Deleted,
}

export default DataRecordState;
