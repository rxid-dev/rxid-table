import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { RxidPagination, usePagination } from "../rxid-pagination";
import { Table } from "./domain/Table";
import { TableColumn } from "./domain/TableColumn";
import { TableRow } from "./domain/TableRow";
import { ColumnProps } from "./interfaces/ColumnProps";
import { ObjectProps } from "./interfaces/ObjectProps";
import { TableProps } from "./interfaces/TableProps";
import { resolveRecord } from "./resolveRecord";
import "./RxidTable.scss";
import { SortOrderType } from "./types/SortOrderType";

interface Props extends TableProps<any> {
  stringUrl?: string;
}

export const RxidTable = React.forwardRef((props: Props, ref: any) => {
  const { stringUrl, ...model } = props;

  const checkboxAllRef = useRef<any>();

  const [state, setState] = useState<Table>(Table.create(model, stringUrl));

  const pagination = usePagination({ perPage: props.perPage });

  useImperativeHandle(
    ref,
    () => ({
      reload: () => {
        setState((state) => ({
          ...state,
          isProcessing: state.isServerSide,
        }));
        reloadState();
      },
      setCustomData: (customData: ObjectProps) => {
        state.customData = customData;
        setState((state) => ({
          ...state,
          isProcessing: state.isServerSide,
        }));
        reloadState();
      },
      setRecords: (records: Array<ObjectProps>) => {
        state.props.records = records;
        reloadState();
      },
      setTotalRecord: (totalRecord: number) => {
        pagination.setTotalRecord(totalRecord);
        reloadState();
      },
    }),
    []
  );

  useEffect(() => {
    reloadState();
  }, [state.keywords, state.sortField, state.sortOrder, state.currentPage]);

  const reloadState = () => {
    if (stringUrl) {
      let queryParams = `?&_start=${
        (state.currentPage - 1) * pagination.perPage
      }&_limit=${pagination.perPage}`;

      if (state.keywords) {
        queryParams += `&q=${state.keywords}`;
      }

      queryParams += `&_sort=${state.sortField || "createdAt"}&_order=${
        state.sortOrder || "desc"
      }`;

      if (state.customData) {
        Object.keys(state.customData).forEach((key) => {
          if (state.customData[key]) {
            queryParams += `&${key}=${state.customData[key]}`;
          }
        });
      }

      fetch(stringUrl + queryParams)
        .then(async (successResponse) => {
          const totalRecord = successResponse.headers.get("X-Total-Count");
          pagination.setTotalRecord(+(totalRecord || 0));
          const records: Array<ObjectProps> = await successResponse.json();
          const rows = createRows(records);
          setIndeterminate(rows.length);
          setState((state: Table) => ({
            ...state,
            rows,
            isLoading: false,
            isProcessing: false,
          }));
        })
        .catch((errorResponse) => {
          console.log(errorResponse);
        });
    } else {
      let records = Array.from(state.props.records || []);
      records = searchRecords(records);
      records = sortRecords(records);
      pagination.setTotalRecord(records.length);
      records = records.splice(
        (state.currentPage - 1) * pagination.perPage,
        pagination.perPage
      );
      const rows = createRows(records);
      setState((state: Table) => ({
        ...state,
        rows,
        isLoading: false,
        isProcessing: false,
      }));
    }
  };

  const setIndeterminate = (rowsLength: number) => {
    if (state.props.options?.select && checkboxAllRef.current) {
      checkboxAllRef.current.indeterminate =
        state.selectedRecord.records.length !== rowsLength &&
        state.selectedRecord.records.length > 0;
    }
  };

  const createRows = (records: Array<ObjectProps>) => {
    return (records || []).map((record) => {
      const row = TableRow.create({ record, columns: state.props.columns });
      row.isChecked = state.selectedRecord.getIsSelected(record);
      return row;
    });
  };

  const searchRecords = (records: Array<ObjectProps>) => {
    if (!state.keywords) return records;
    return records.filter((record) => {
      let isMatch = false;
      model.columns.forEach((column: ColumnProps) => {
        if (isMatch) return;
        const value = resolveRecord(record, column.field) || "";
        if (value.toLowerCase().includes(state.keywords.toLowerCase())) {
          isMatch = true;
        }
      });
      return isMatch;
    });
  };

  const sortRecords = (records: Array<ObjectProps>) => {
    if (!state.sortField) return records;
    return records.sort((recordA, recordB) => {
      const valueA = resolveRecord(recordA, state.sortField) || "";
      const valueB = resolveRecord(recordB, state.sortField) || "";
      return valueA > valueB
        ? state.sortOrder === "desc"
          ? -1
          : +1
        : state.sortOrder === "desc"
        ? +1
        : -1;
    });
  };

  const handleSearch = (keywords: string) => {
    setState((state: Table) => ({
      ...state,
      keywords,
      isProcessing: true,
    }));
  };

  const handleSort = (column: ColumnProps) => {
    if (column.sortable === false || !column.field) return;
    const { field } = column;
    const sortOrder: SortOrderType = state.sortOrder
      ? field === state.sortField
        ? state.sortOrder === "asc"
          ? "desc"
          : null
        : "asc"
      : "asc";

    const sortField = sortOrder === null ? "" : column.field;
    setState((state: Table) => ({
      ...state,
      sortOrder,
      sortField,
      isProcessing: state.isServerSide,
    }));
  };

  const handleChangePerPage = (perPage: number) => {
    setState((state: Table) => ({
      ...state,
      perPage,
      isProcessing: state.isServerSide,
    }));
  };

  const handleOnChangePage = (currentPage: number) => {
    if (state.isServerSide) {
      state.selectedRecord.reset();
      if (checkboxAllRef.current) {
        checkboxAllRef.current.indeterminate = false;
      }
    }
    setState((state: Table) => ({
      ...state,
      currentPage,
      isProcessing: state.isServerSide,
    }));
  };

  const handleSelectRecord = (isChecked: boolean, row: TableRow) => {
    const table = state;
    if (state.selectedRecord.isMultiple) {
      isChecked
        ? table.selectedRecord.add(row.props.record)
        : table.selectedRecord.remove(row.props.record);
      row.isChecked = isChecked;

      const rowsLength = state.isServerSide
        ? table.rows.length
        : state.props.records?.length || 0;
      setIndeterminate(rowsLength);

      state.selectedRecord.isSelectAll = state.isServerSide
        ? state.rows.length === table.selectedRecord.records.length
        : (state.props.records?.length || 0) ===
          table.selectedRecord.records.length;
    } else {
      table.rows.forEach((row) => (row.isChecked = false));
      row.isChecked = true;

      isChecked
        ? table.selectedRecord.set([row.props.record])
        : table.selectedRecord.reset();
    }

    setState((state) => ({
      ...state,
      ...table,
    }));
  };

  const handleSelectAllRecord = (isChecked: boolean) => {
    const table = state;
    table.selectedRecord.isSelectAll = isChecked;
    const records: Array<ObjectProps> = [];

    if (state.isServerSide) {
      table.rows.forEach((row) => {
        row.isChecked = isChecked;
        if (!isChecked) return;
        records.push(row.props.record);
      });
    } else {
      table.rows.forEach((row) => {
        row.isChecked = isChecked;
      });

      if (isChecked) {
        records.push(...(state.props.records || []));
      }
    }

    isChecked
      ? table.selectedRecord.set(records)
      : table.selectedRecord.reset();

    setState((state) => ({
      ...state,
      ...table,
    }));
  };

  const handleClickRow = (
    row: TableRow,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (state.props.options?.onClick) {
      state.props.options.onClick(row.props.record);
    }

    if (ref.current) {
      ref.current.click();
    }
  };

  const renderInitLoader = (): JSX.Element => {
    return (
      <div className="rxid-table-body">
        <div className="table-responsive">
          <table className="table table-loader">
            <tbody>
              {Array(pagination.perPage || 10)
                .fill(0)
                .map((val, indexI) => (
                  <tr key={val + indexI + 1}>
                    {Array(10)
                      .fill(0)
                      .map((val, indexJ) => (
                        <td key={val + indexJ + 1}>
                          <div className="td-content">
                            <span className="skeleton-loader"></span>
                          </div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTable = (): JSX.Element => {
    return (
      <>
        <div className="rxid-table-header">
          <div className="input-group flex-nowrap mb-2">
            <span className="input-group-text" id="addon-wrapping">
              <em className="fas fa-search"></em>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              aria-label="Search..."
              aria-describedby="addon-wrapping"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="rxid-table-body">
          <div className="table-responsive">
            <table
              className={
                "table " +
                (state.isProcessing ? "table-loader" : "table-striped")
              }
            >
              <thead>
                <tr>
                  {state.props.options?.select ? (
                    <th className="th-select">
                      <div className="th-content">
                        {state.selectedRecord.isMultiple && (
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!!state.selectedRecord.isSelectAll}
                              onChange={(e) =>
                                handleSelectAllRecord(e.target.checked)
                              }
                              ref={checkboxAllRef}
                              disabled={state.isProcessing}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ) : (
                    <th>
                      <div className="th-content">
                        <span className="th-text">No</span>
                      </div>
                    </th>
                  )}

                  {model.columns.map((column: ColumnProps, index: number) => {
                    return (
                      <th
                        className={column.sortable === false ? "" : "sortable"}
                        key={index}
                        onClick={() => handleSort(column)}
                      >
                        <div className="th-content">
                          <span
                            className={
                              "th-text " +
                              (column.options?.header?.className || "")
                            }
                          >
                            {column.header}
                          </span>
                          {column.sortable === false ? (
                            ""
                          ) : (
                            <span
                              className={
                                "sort " +
                                (column.field === state.sortField
                                  ? state.sortOrder
                                  : "")
                              }
                            >
                              <em className="fas fa-sort"></em>
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {state.rows.map((row: TableRow, indexI: number) => {
                  const selectRef = createRef<HTMLInputElement>();
                  return (
                    <tr
                      key={indexI}
                      onClick={() => handleClickRow(row, selectRef)}
                      className={
                        state.props.options?.onClick ||
                        state.props.options?.select
                          ? "clickable"
                          : ""
                      }
                    >
                      {state.props.options?.select ? (
                        <td>
                          {state.isProcessing ? (
                            <span className="skeleton-loader"></span>
                          ) : (
                            <>
                              {state.selectedRecord.isMultiple ? (
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={!!row.isChecked}
                                    onChange={(e) =>
                                      handleSelectRecord(e.target.checked, row)
                                    }
                                    ref={selectRef}
                                  />
                                </div>
                              ) : (
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={state.identifer}
                                    checked={!!row.isChecked}
                                    onChange={(e) =>
                                      handleSelectRecord(e.target.checked, row)
                                    }
                                    ref={selectRef}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      ) : (
                        <td>
                          {state.isProcessing ? (
                            <span className="skeleton-loader"></span>
                          ) : (
                            <>
                              {" "}
                              {(state.currentPage - 1) * pagination.perPage +
                                indexI +
                                1}
                            </>
                          )}
                        </td>
                      )}

                      {row.columns.map(
                        (column: TableColumn, indexJ: number) => {
                          return (
                            <td key={indexI + "" + indexJ}>
                              {state.isProcessing ? (
                                <span className="skeleton-loader"></span>
                              ) : (
                                <>{column.value || "-"}</>
                              )}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rxid-table-footer">
          <div className="select-max-row">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              value={pagination.perPage}
              onChange={(event) => handleChangePerPage(+event.target.value)}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <RxidPagination
            model={pagination}
            onChangePage={handleOnChangePage}
          />
        </div>
      </>
    );
  };

  return (
    <div className="rxid-table">
      {state.isLoading ? renderInitLoader() : renderTable()}
    </div>
  );
});
