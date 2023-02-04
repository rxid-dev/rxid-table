import { useState } from "react";
import { usePagination } from "../rxid-pagination";

interface Props {
  columns: Array<any>;
  records?: Array<any>;
  perPage?: number;
  totalRecord?: number;
}

export const useTable = (props: Props) => {
  const { columns, records, perPage, totalRecord } = props;
  const [state, setState] = useState({
    columns: columns || [],
    records: records || [],
    customData: {},
    reloadFlag: false,
  });

  const pagination = usePagination({ perPage, totalRecord });

  const setRecords = (records: Array<any>) => {
    setState((state) => ({
      ...state,
      records,
    }));
  };

  const setTotalRecord = (totalRecord: number) => {
    pagination.setTotalRecord(totalRecord);
  };

  const setCustomData = (customData: any) => {
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
