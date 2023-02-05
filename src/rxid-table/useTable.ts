import { useRef } from "react";
import { ColumnProps } from "./interfaces/ColumnProps";
import { ObjectProps } from "./interfaces/ObjectProps";
import { TableOptionsProps } from "./interfaces/TableOptionsProps";
import { TableProps } from "./interfaces/TableProps";

interface Props<T> {
  columns: Array<ColumnProps>;
  records?: Array<T>;
  perPage?: number;
  totalRecord?: number;
  options?: TableOptionsProps<T>;
}

export const useTable = <T>(props: Props<T>): TableProps<T> => {
  const ref: React.MutableRefObject<any> = useRef();

  const setRecords = (records: Array<T>) => {
    if (!ref.current) return;
    ref.current.setRecords(records);
  };

  const setCustomData = (customData: ObjectProps) => {
    if (!ref.current) return;
    ref.current.setCustomData(customData);
  };

  const reload = () => {
    if (!ref.current) return;
    ref.current.reload();
  };

  return {
    ...props,
    setRecords,
    setCustomData,
    reload,
    ref,
  };
};
