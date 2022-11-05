import { useState } from "react";

export const usePagination = ({ perPage, currentPage, size, totalRecord }) => {
  const [state, setState] = useState({
    perPage: perPage || 10,
    currentPage: currentPage || 1,
    size: size || 5,
    totalRecord: totalRecord || 0,
  });

  const setTotalRecord = (totalRecord) => {
    setState((state) => ({
      ...state,
      totalRecord,
    }));
  };

  return { ...state, setTotalRecord };
};
