import { sortingFns } from "@tanstack/react-table";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta(itemRank);

  return itemRank.passed;
};

export const statusFilter = (rows, columnId, filterValue) => {
  return rows.filter((row) => {
    const status = row.original.workStatus.name;
    return filterValue.includes(status);
  });
};
