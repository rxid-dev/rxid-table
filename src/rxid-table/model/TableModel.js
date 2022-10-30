export default class TableModel {
  constructor(columns = []) {
    this.columns = columns;
  }

  setRecords(records) {
    this.records = records;
  }
}
