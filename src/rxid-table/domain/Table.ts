import { ObjectProps } from "../interfaces/ObjectProps";
import { TableProps } from "../interfaces/TableProps";
import { SortOrderType } from "../types/SortOrderType";
import { TableRow } from "./TableRow";

export class Table {
  public rows: Array<TableRow>;
  public keywords: string;
  public sortField: string;
  public sortOrder: SortOrderType;
  public currentPage: number;
  public customData: ObjectProps;
  private constructor(public props: TableProps<ObjectProps>) {}
  public static create(props: TableProps<ObjectProps>): Table {
    const state = new Table(props);
    state.rows = [];
    state.currentPage = 1;
    return state;
  }
}
