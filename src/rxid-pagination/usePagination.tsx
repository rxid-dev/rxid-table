import { useState } from "react";
import { PaginationProps } from "./interfaces/pagination-props";
import { PaginationModel } from "./models/pagination.model";

interface Model extends PaginationModel {
  setTotalRecord: (totalRecord: number) => void;
}

export const usePagination = (props: PaginationProps): Model => {
  const { perPage, currentPage, size, totalRecord } = props;
  const [state, setState] = useState({
    perPage: perPage || 10,
    currentPage: currentPage || 1,
    size: size || 5,
    totalRecord: totalRecord || 0,
  });

  const setTotalRecord = (totalRecord: number) => {
    setState((state) => ({
      ...state,
      totalRecord,
    }));
  };

  return { ...state, setTotalRecord };
};
