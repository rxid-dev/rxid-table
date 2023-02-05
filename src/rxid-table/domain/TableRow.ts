import { RowProps } from "../interfaces/RowProps";
import { TableColumn } from "./TableColumn";

export class TableRow {
  public columns: Array<TableColumn>;
  public isChecked: boolean;
  private constructor(public props: RowProps) {}

  public static create(props: RowProps): TableRow {
    const row = new TableRow(props);
    row.columns = props.columns.map((column) =>
      TableColumn.create(props.record, column)
    );
    return row;
  }
}
