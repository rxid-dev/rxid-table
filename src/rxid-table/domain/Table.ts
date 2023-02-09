import { ObjectProps } from "../interfaces/ObjectProps";
import { TableProps } from "../interfaces/TableProps";
import { SortOrderType } from "../types/SortOrderType";
import { TableRow } from "./TableRow";
import { TableSelect } from "./TableSelect";

export class Table {
  public rows: Array<TableRow>;
  public keywords: string;
  public sortField: string;
  public sortOrder: SortOrderType;
  public customData: ObjectProps;
  public selectedRecord: TableSelect;
  public isServerSide: boolean;
  public identifer: string;
  public isLoading: boolean;
  public isProcessing: boolean;
  private constructor(public props: TableProps<ObjectProps>) {}
  public static create(
    props: TableProps<ObjectProps>,
    stringUrl?: string
  ): Table {
    const state = new Table(props);
    state.isServerSide = !!stringUrl;
    state.rows = [];
    state.selectedRecord = TableSelect.create(props.options?.select);
    state.identifer = `table-${Math.ceil(Math.random() * 100)}`;
    state.isLoading = true;
    return state;
  }
}
