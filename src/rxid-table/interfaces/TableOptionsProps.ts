import { TableSelectProps } from "./TableSelectProps";

export interface TableOptionsProps<T> {
  select?: TableSelectProps<T>;
  onClick?: (record: T) => void;
  empty?: {
    init?: () => JSX.Element;
    search?: () => JSX.Element;
    filter?: () => JSX.Element;
  };
}
