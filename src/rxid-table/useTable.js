import { useState } from "react";

export const useTable = ({ columns, records, perPage }) => {
  const [state, setState] = useState({
    columns: columns || [],
    records: records || [],
    perPage: perPage || 10,
  });

  const setRecords = (records) => {
    setState((state) => ({
      ...state,
      records,
    }));
  };

  return { ...state, setRecords };
};
