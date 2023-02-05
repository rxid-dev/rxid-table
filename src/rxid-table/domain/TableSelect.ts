import { ObjectProps } from "../interfaces/ObjectProps";
import { resolveRecord } from "../resolveRecord";
export class TableSelect {
  public records: Array<ObjectProps>;
  public isSelectAll: boolean;
  private constructor(public compareField: string = "id") {}

  public set(records: Array<ObjectProps>): void {
    this.records = records;
  }

  public reset(): void {
    console.log("Come from reset");
    this.isSelectAll = false;
    this.records = [];
  }

  public add(record: ObjectProps): void {
    this.records.push(record);
  }

  public remove(record: ObjectProps): void {
    const indexOfRecord = this.getIndexOfRecord(record);
    if (indexOfRecord !== -1) {
      this.records.splice(indexOfRecord, 1);
    }
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

  public static create(compareField?: string): TableSelect {
    const select = new TableSelect(compareField);
    select.records = [];
    return select;
  }
}
