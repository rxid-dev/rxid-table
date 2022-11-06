export const resolveRecord = (record, field) => {
  if (!field || !record) return null;
  const fieldSplit = field.split(".");
  let value = { ...record };
  while (fieldSplit.length > 0) {
    const firstField = fieldSplit.shift();
    value = value[firstField];
    if (!value) {
      fieldSplit.splice(0);
    }
  }
  return value;
};
