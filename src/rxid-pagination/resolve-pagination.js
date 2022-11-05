export const resolvePagination = ({
  perPage,
  totalRecord,
  currentPage,
  size,
}) => {
  const firstPage = 1;
  const lastPage = Math.ceil(totalRecord / perPage) || 1;

  const startPage =
    currentPage - Math.floor(size / 2) + (size % 2 === 0 ? 1 : 0);
  const endPage = currentPage + Math.floor(size / 2);

  return {
    firstPage,
    lastPage,
    startPage:
      startPage < firstPage
        ? firstPage
        : startPage > lastPage - size
        ? lastPage - size + 1
        : startPage,
    endPage:
      endPage > lastPage
        ? lastPage
        : endPage < size
        ? size > lastPage
          ? lastPage
          : size
        : endPage,
  };
};
