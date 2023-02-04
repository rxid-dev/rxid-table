import { ObjectProps } from "../interfaces/ObjectProps";
import { TableProps } from "../interfaces/TableProps";
import { SortOrderType } from "../types/SortOrderType";

export class Table {
  public records: Array<ObjectProps>;
  public keywords: string;
  public perPage: number;
  public sortField: string;
  public sortOrder: SortOrderType;
  public currentPage: number;
  private constructor() {}

  public static create(model: TableProps<ObjectProps>): Table {
    const state = new Table();
    state.records = [];
    state.perPage = model.pagination.perPage;
    state.currentPage = 1;
    return state;
  }
}
