import { ObjectProps } from "../interfaces/ObjectProps";
import { TableProps } from "../interfaces/TableProps";
import { SortOrderType } from "../types/SortOrderType";

export class Table {
  public rows: Array<ObjectProps>;
  public keywords: string;
  public sortField: string;
  public sortOrder: SortOrderType;
  public currentPage: number;
  public customData: ObjectProps;
  private constructor(public model: TableProps<ObjectProps>) {}
  public static create(model: TableProps<ObjectProps>): Table {
    const state = new Table(model);
    state.rows = [];
    state.currentPage = 1;
    return state;
  }
}
