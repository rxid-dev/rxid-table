import { ColumnOptionsProps } from "./ColumnOptionsProps";
import { ObjectProps } from "./ObjectProps";

export interface ColumnProps {
  header: string;
  field?: string;
  component?: (record: ObjectProps) => JSX.Element;
  sortable?: boolean;
  options?: ColumnOptionsProps;
}
