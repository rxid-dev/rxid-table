import { ColumnProps } from "./ColumnProps";
import { ObjectProps } from "./ObjectProps";

export interface TableProps<T> {
  columns: Array<ColumnProps>;
  records: Array<T>;
  customData: ObjectProps;
  reloadFlag: boolean;
  setRecords: (records: Array<T>) => void;
  pagination: any;
  setTotalRecord: (totalRecord: number) => void;
  setCustomData: (customData: ObjectProps) => void;
  reload: () => void;
}
