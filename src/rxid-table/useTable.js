import { useState } from "react";

export const useTable = ({ columns, records }) => {
  const [state, setState] = useState({
    columns: columns || [],
    records: records || [],
  });

  const setRecords = (records) => {
    setState((state) => ({
      ...state,
      records,
    }));
  };

  return { ...state, setRecords };
};
