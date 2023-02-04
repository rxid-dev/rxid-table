import { useState } from "react";
import { usePagination } from "../rxid-pagination";
import { ColumnProps } from "./interfaces/ColumnProps";
import { ObjectProps } from "./interfaces/ObjectProps";
import { TableProps } from "./interfaces/TableProps";

interface Props<T> {
  columns: Array<ColumnProps>;
  records?: Array<T>;
  perPage?: number;
  totalRecord?: number;
}

export const useTable = <T>(props: Props<T>): TableProps<T> => {
  const { columns, records, perPage, totalRecord } = props;
  const [state, setState] = useState({
    columns: columns || [],
    records: records || [],
    customData: {},
    reloadFlag: false,
  });

  const pagination = usePagination({ perPage, totalRecord });

  const setRecords = (records: Array<T>) => {
    setState((state) => ({
      ...state,
      records,
    }));
  };

  const setTotalRecord = (totalRecord: number) => {
    pagination.setTotalRecord(totalRecord);
  };

  const setCustomData = (customData: ObjectProps) => {
    setState((state) => ({
      ...state,
      customData,
    }));
  };

  const reload = () => {
    setState((state) => ({
      ...state,
      reloadFlag: !state.reloadFlag,
    }));
  };

  return {
    ...state,
    setRecords,
    pagination,
    setTotalRecord,
    setCustomData,
    reload,
  };
};
