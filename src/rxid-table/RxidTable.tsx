import React, { useEffect, useImperativeHandle, useState } from "react";
import { RxidPagination, usePagination } from "../rxid-pagination";
import { Table } from "./domain/Table";
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

  const [state, setState] = useState<Table>(Table.create(model));

  const pagination = usePagination({ perPage: props.perPage });

  useImperativeHandle(
    ref,
    () => ({
      reload: () => {
        reloadState();
      },
      setCustomData: (customData: ObjectProps) => {
        state.customData = customData;
        reloadState();
      },
      setRecords: (records: Array<ObjectProps>) => {
        state.model.records = records;
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
          const rows = await successResponse.json();
          setState((state: Table) => ({
            ...state,
            rows,
          }));
        })
        .catch((errorResponse) => {
          console.log(errorResponse);
        });
    } else {
      let records = Array.from(state.model.records || []);
      records = searchRecords(records);
      records = sortRecords(records);
      pagination.setTotalRecord(records.length);
      const rows = records.splice(
        (state.currentPage - 1) * pagination.perPage,
        pagination.perPage
      );
      setState((state: Table) => ({
        ...state,
        rows,
      }));
    }
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
    }));
  };

  const handleChangePerPage = (perPage: number) => {
    setState((state: Table) => ({
      ...state,
      perPage,
    }));
  };

  const handleOnChangePage = (currentPage: number) => {
    setState((state: Table) => ({
      ...state,
      currentPage,
    }));
  };

  const renderTdContent = (
    record: ObjectProps,
    column: ColumnProps
  ): JSX.Element => {
    if (column.component) {
      return column.component(record);
    } else {
      return <>{resolveRecord(record, column.field) || "-"}</>;
    }
  };

  return (
    <div className="rxid-table">
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
          <table className="table table-striped">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <span className="th-text">No</span>
                  </div>
                </th>
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
              {state.rows.map((record: ObjectProps, indexI: number) => {
                return (
                  <tr key={indexI}>
                    <td>
                      {(state.currentPage - 1) * pagination.perPage +
                        indexI +
                        1}
                    </td>
                    {model.columns.map(
                      (column: ColumnProps, indexJ: number) => {
                        return (
                          <td key={indexI + "" + indexJ}>
                            {renderTdContent(record, column)}
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
        <RxidPagination model={pagination} onChangePage={handleOnChangePage} />
      </div>
    </div>
  );
});
