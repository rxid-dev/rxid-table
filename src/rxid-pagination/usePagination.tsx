import { useState } from "react";
import { PaginationProps } from "./interfaces/PaginationProps";

interface Props {
  perPage?: number;
  currentPage?: number;
  size?: number;
  totalRecord?: number;
}

export const usePagination = (props: Props): PaginationProps => {
  const [state, setState] = useState({
    perPage: props.perPage || 10,
    currentPage: props.currentPage || 1,
    size: props.size || 5,
    totalRecord: props.totalRecord || 0,
  });

  const setTotalRecord = (totalRecord: number): void => {
    state.totalRecord = totalRecord;
  };

  const setPerPage = (perPage: number): void => {
    const totalPage = Math.ceil(state.totalRecord / perPage);
    const currentPage =
      state.currentPage > totalPage ? totalPage : state.currentPage;
    setState((state) => ({
      ...state,
      perPage,
      currentPage,
    }));
  };

  const setCurrentPage = (currentPage: number): void => {
    setState((state) => ({
      ...state,
      currentPage,
    }));
  };

  return { ...state, setTotalRecord, setPerPage, setCurrentPage };
};
