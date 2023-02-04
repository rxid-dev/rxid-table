import React, { useEffect, useState } from "react";
import { Pagination as RxidPagination } from "../rxid-pagination";
import { resolveRecord } from "./resolveRecord";
import "./RxidTable.css";
export const RxidTable = (props: { model: any; stringUrl?: any }) => {
  const { model, stringUrl } = props;
  const [state, setState] = useState<any>({
    records: [],
    keywords: "",
    perPage: model.pagination.perPage,
    sortField: "",
    sortOrder: "",
    currentPage: 1,
  });

  useEffect(() => {
    if (stringUrl) {
      let queryParams = `?&_start=${
        (state.currentPage - 1) * state.perPage
      }&_limit=${state.perPage}`;

      if (state.keywords) {
        queryParams += `&q=${state.keywords}`;
      }

      // if (state.sortField) {
      queryParams += `&_sort=${state.sortField || "createdAt"}&_order=${
        state.sortOrder || "desc"
      }`;
      // }

      Object.keys(model.customData).forEach((key) => {
        if (model.customData[key]) {
          queryParams += `&${key}=${model.customData[key]}`;
        }
      });

      fetch(stringUrl + queryParams)
        .then(async (successResponse) => {
          const totalRecord = successResponse.headers.get("X-Total-Count");
          model.setTotalRecord(+(totalRecord || 0));
          const records = await successResponse.json();
          setState((state: any) => ({
            ...state,
            records,
          }));
        })
        .catch((errorResponse) => {
          console.log(errorResponse);
        });
    } else {
      let records = Array.from(model.records);
      records = searchRecords(records);
      records = sortRecords(records);
      model.setTotalRecord(records.length);
      records = records.splice(
        (state.currentPage - 1) * state.perPage,
        state.perPage
      );
      setState((state: any) => ({
        ...state,
        records,
      }));
    }
  }, [
    state.keywords,
    state.perPage,
    state.sortField,
    state.sortOrder,
    state.currentPage,
    model.records,
    model.customData,
    model.reloadFlag,
  ]);

  const searchRecords = (records: Array<any>) => {
    if (!state.keywords) return records;
    return records.filter((record) => {
      let isMatch = false;
      model.columns.forEach((column: any) => {
        if (isMatch) return;
        const value = resolveRecord(record, column.field) || "";
        if (value.toLowerCase().includes(state.keywords.toLowerCase())) {
          isMatch = true;
        }
      });
      return isMatch;
    });
  };

  const sortRecords = (records: Array<any>) => {
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
    setState((state: any) => ({
      ...state,
      keywords,
    }));
  };

  const handleSort = (column: any) => {
    if (column.sortable === false) return;
    const { field } = column;
    const sortOrder = state.sortOrder
      ? field === state.sortField
        ? state.sortOrder === "asc"
          ? "desc"
          : ""
        : "asc"
      : "asc";

    const sortField = sortOrder === "" ? "" : column.field;
    setState((state: any) => ({
      ...state,
      sortOrder,
      sortField,
    }));
  };

  const handleChangePerPage = (perPage: number) => {
    setState((state: any) => ({
      ...state,
      perPage,
    }));
  };

  const handleOnChangePage = (currentPage: number) => {
    setState((state: any) => ({
      ...state,
      currentPage,
    }));
  };

  const renderTdContent = (record: any, column: any) => {
    if (column.component) {
      return column.component(record);
    } else {
      return resolveRecord(record, column.field) || "-";
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
                {model.columns.map((column: any, index: number) => {
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
              {state.records.map((record: any, indexI: number) => {
                return (
                  <tr key={indexI}>
                    <td>
                      {(state.currentPage - 1) * model.pagination.perPage +
                        indexI +
                        1}
                    </td>
                    {model.columns.map((column: any, indexJ: number) => {
                      return (
                        <td key={indexI + "" + indexJ}>
                          {renderTdContent(record, column)}
                        </td>
                      );
                    })}
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
            value={state.perPage}
            onChange={(event) => handleChangePerPage(+event.target.value)}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <RxidPagination
          model={model.pagination}
          onChangePage={handleOnChangePage}
        />
      </div>
    </div>
  );
};
