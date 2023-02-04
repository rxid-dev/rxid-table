import { ObjectProps } from "./interfaces/ObjectProps";

export const resolveRecord = (record: ObjectProps, field?: string) => {
  if (!field || !record) return null;
  const fieldSplit: Array<string> = field.split(".");
  let value = { ...record };
  while (fieldSplit.length > 0) {
    const firstField: string = fieldSplit.shift() as string;
    value = value[firstField];
    if (!value) {
      fieldSplit.splice(0);
    }
  }
  return value;
};
