import { ObjectProps } from "../interfaces/ObjectProps";
import { TableSelectProps } from "../interfaces/TableSelectProps";
import { resolveRecord } from "../resolveRecord";
export class TableSelect {
  public isSelectAll: boolean;
  public indeterminate: boolean;
  public compareField: string;
  public records: Array<ObjectProps>;
  public isMultiple: boolean;
  private constructor(public props?: TableSelectProps<ObjectProps>) {}

  public set(records: Array<ObjectProps>): void {
    this.records = records;
    this.emitChanges();
  }

  public reset(): void {
    this.isSelectAll = false;
    this.records = [];
    this.emitChanges();
  }

  public add(record: ObjectProps): void {
    this.records.push(record);
    this.emitChanges();
  }

  public remove(record: ObjectProps): void {
    const indexOfRecord = this.getIndexOfRecord(record);
    if (indexOfRecord !== -1) {
      this.records.splice(indexOfRecord, 1);
    }
    this.emitChanges();
  }

  public getIsSelected(record: ObjectProps): boolean {
    return this.getIndexOfRecord(record) !== -1;
  }

  private getIndexOfRecord(record: ObjectProps): number {
    return this.records.findIndex(
      (r) =>
        resolveRecord(r, this.compareField) ===
        resolveRecord(record, this.compareField)
    );
  }

  private emitChanges(): void {
    if (!this.props?.onSelect) return;
    this.props.onSelect(this.records);
  }

  public static create(props?: TableSelectProps<ObjectProps>): TableSelect {
    const select = new TableSelect(props);
    select.compareField = props?.compareField || "id";
    select.records = props?.records || [];
    select.isMultiple = props?.isMultiple !== false;
    return select;
  }
}
