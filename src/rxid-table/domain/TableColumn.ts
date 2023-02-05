import { ColumnProps } from "../interfaces/ColumnProps";
import { ObjectProps } from "../interfaces/ObjectProps";
import { resolveRecord } from "../resolveRecord";

export class TableColumn {
  public value: any;
  private constructor(public props: ColumnProps) {}
  public static create(record: ObjectProps, props: ColumnProps): TableColumn {
    const column = new TableColumn(props);
    column.value = props.component
      ? props.component(record)
      : resolveRecord(record, props.field);
    return column;
  }
}
