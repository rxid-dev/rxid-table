import { useState } from "react";
import { usePagination } from "../rxid-pagination";
export const useTable = ({ columns, records, perPage, totalRecord }) => {
  const [state, setState] = useState({
    columns: columns || [],
    records: records || [],
    customData: {},
    reloadFlag: false,
  });

  const pagination = usePagination({ perPage, totalRecord });

  const setRecords = (records) => {
    setState((state) => ({
      ...state,
      records,
    }));
  };

  const setTotalRecord = (totalRecord) => {
    pagination.setTotalRecord(totalRecord);
  };

  const setCustomData = (customData) => {
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
