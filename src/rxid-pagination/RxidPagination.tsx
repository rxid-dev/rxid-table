import React, { useEffect, useState } from "react";
import { Pagination } from "./domain/Pagination";
import { PaginationProps } from "./interfaces/PaginationProps";
import { resolvePagination } from "./resolve-pagination";
import "./RxidPagination.scss";
interface Props extends PaginationProps {
  onChangePage?: (page: number) => void;
}

export const RxidPagination = (props: Props) => {
  const { onChangePage, ...model } = props;

  const [state, setState] = useState(Pagination.createEmpty());

  useEffect(() => {
    reloadState();
  }, [model.totalRecord, model.currentPage, model.perPage]);

  const reloadState = () => {
    const pagination = resolvePagination(props);
    setState((state) => ({
      ...state,
      ...pagination,
    }));
  };

  const setCurrentPage = (currentPage: number) => {
    props.setCurrentPage(currentPage);
    if (onChangePage) {
      onChangePage(currentPage);
    }
  };

  const handleChangePage = (currentPage: number) => {
    if (state.currentPage === currentPage) return;
    setCurrentPage(currentPage);
  };

  const handleBackPage = () => {
    const currentPage = state.currentPage - 1;
    if (currentPage < state.firstPage) return;
    setCurrentPage(currentPage);
  };

  const handleNextPage = () => {
    const currentPage = state.currentPage + 1;
    if (currentPage > state.lastPage) return;
    setCurrentPage(currentPage);
  };

  return (
    <ul className="pagination-list">
      <li className="pagination-item">
        <a
          className={
            "pagination-link " + (state.currentPage === 1 ? "disabled" : "")
          }
          onClick={() => handleChangePage(1)}
        >
          <em className="fa-solid fa-angles-left" />
        </a>
      </li>
      <li className="pagination-item">
        <a
          className={
            "pagination-link " + (state.currentPage === 1 ? "disabled" : "")
          }
          onClick={handleBackPage}
        >
          <em className="fas fa-chevron-left" />
        </a>
      </li>
      {state.startPage > 1 ? (
        <li className="pagination-item">
          <a className="pagination-link" onClick={() => handleChangePage(1)}>
            1
          </a>
        </li>
      ) : (
        <></>
      )}
      {state.startPage > 2 ? (
        <li className="pagination-item">
          <a className="pagination-link separator">...</a>
        </li>
      ) : (
        <></>
      )}
      {state.list.map((page) => {
        return (
          <li className="pagination-item" key={page}>
            <a
              className={
                "pagination-link " +
                (state.currentPage === page ? "active" : "")
              }
              onClick={() => handleChangePage(page)}
            >
              {page}
            </a>
          </li>
        );
      })}

      {state.currentPage < state.lastPage - 3 &&
      state.endPage + 1 < state.lastPage ? (
        <li className="pagination-item">
          <a className="pagination-link separator">...</a>
        </li>
      ) : (
        <></>
      )}

      {state.currentPage < state.lastPage - 2 &&
      state.endPage < state.lastPage ? (
        <li className="pagination-item">
          <a
            className="pagination-link"
            onClick={() => handleChangePage(state.lastPage)}
          >
            {state.lastPage}
          </a>
        </li>
      ) : (
        <></>
      )}

      <li className="pagination-item">
        <a
          className={
            "pagination-link " +
            (state.currentPage === state.lastPage ? "disabled" : "")
          }
          onClick={handleNextPage}
        >
          <em className="fas fa-chevron-right" />
        </a>
      </li>

      <li className="pagination-item">
        <a
          className={
            "pagination-link " +
            (state.currentPage === state.lastPage ? "disabled" : "")
          }
          onClick={() => handleChangePage(state.lastPage)}
        >
          <em className="fa-solid fa-angles-right" />
        </a>
      </li>
    </ul>
  );
};
