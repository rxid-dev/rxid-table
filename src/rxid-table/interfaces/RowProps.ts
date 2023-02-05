import { ColumnProps } from "./ColumnProps";
import { ObjectProps } from "./ObjectProps";

export class RowProps {
  record: ObjectProps;
  columns: Array<ColumnProps>;
}
