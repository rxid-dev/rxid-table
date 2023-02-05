import { TableSelectProps } from "./TableSelectProps";

export interface TableOptionsProps<T> {
  select?: TableSelectProps<T>;
  onClick?: (record: T) => void;
}
