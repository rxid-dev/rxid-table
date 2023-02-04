import { Pagination } from "./domain/pagination";
import { PaginationModel } from "./models/pagination.model";

export const resolvePagination = (props: PaginationModel): Pagination => {
  const { totalRecord, perPage, size, currentPage } = props;
  const firstPage = 1;
  const lastPage = Math.ceil(totalRecord / perPage) || 1;

  const startPage =
    currentPage - Math.floor(size / 2) + (size % 2 === 0 ? 1 : 0);
  const endPage = currentPage + Math.floor(size / 2);

  const pagination: Pagination = {
    firstPage,
    lastPage,
    startPage:
      startPage < firstPage
        ? firstPage
        : startPage > lastPage - size
        ? lastPage - size + 1 < firstPage
          ? firstPage
          : lastPage - size + 1
        : startPage,
    endPage:
      endPage > lastPage
        ? lastPage
        : endPage < size
        ? size > lastPage
          ? lastPage
          : size
        : endPage,
    list: [],
  };

  pagination.list = Array(pagination.endPage - pagination.startPage + 1)
    .fill(0)
    .map((val, index) => val + index + pagination.startPage);

  return pagination;
};
