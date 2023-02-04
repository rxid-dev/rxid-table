import { ColumnProps } from "./ColumnProps";
import { ObjectProps } from "./ObjectProps";

export interface TableProps<T> {
  columns: Array<ColumnProps>;
  records?: Array<T>;
  perPage?: number;
  setRecords: (records: Array<T>) => void;
  setCustomData: (customData: ObjectProps) => void;
  reload: () => void;
  ref: React.MutableRefObject<any>;
}
