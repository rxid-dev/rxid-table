export interface TableSelectProps<T> {
  compareField?: string;
  onSelect?: (records: T) => void;
  records?: Array<T>;
  isMultiple?: boolean;
}
