export interface PaginationProps {
  perPage: number;
  currentPage: number;
  size: number;
  totalRecord: number;
  setTotalRecord: (totalRecord: number) => void;
  setPerPage: (perPage: number) => void;
  setCurrentPage: (currentPage: number) => void;
}
