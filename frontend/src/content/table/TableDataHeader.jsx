import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  LucideArrowUpDown,
  LucideArrowUpNarrowWide,
} from "lucide-react";
import React from "react";

function TableDataHeader({ header }) {
  const isSorted = header.column.getIsSorted();
  console.log(isSorted);
  return (
    <>
      <TableHead key={header.id} className="w-auto">
        <div className="flex gap-2 items-center">
          {header.column.getCanSort() ? (
            <LucideArrowUpDown
              onClick={
                header.column.getCanSort()
                  ? header.column.getToggleSortingHandler()
                  : ""
              }
            />
          ) : null}
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          {header.column.getCanSort() && (
            <>
              <>
                {header.column.getIsSorted() === "desc" ? " 🔼" : ""}

                {header.column.getIsSorted() === "asc" ? "  🔽" : ""}
              </>
            </>
          )}
        </div>
      </TableHead>
    </>
  );
}

export default TableDataHeader;
