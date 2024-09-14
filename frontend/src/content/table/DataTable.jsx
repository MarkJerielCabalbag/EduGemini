import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RowExpandView from "./studentListRow/RowExpandView";
import TableDataHeader from "./TableDataHeader";
import Pagination from "./Pagination";

const DataTable = ({ dataTable, columns }) => {
  const [columnVisibility, setColumnVisibility] = useState({
    files: false,
    path: false,
    time: false,
    feedback: false,
  });
  const memoizedColumns = useMemo(() => columns, []);
  const [data, setData] = useState(dataTable);
  const table = useReactTable({
    data: dataTable,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full h-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="w-auto">
              {headerGroup.headers.map((header) => (
                <TableDataHeader header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="w-auto">
          {table.getRowModel().rows.map((row) => (
            <>
              <TableRow key={row.id} className="w-auto">
                {row.getVisibleCells().map((cell) => (
                  <>
                    <TableCell key={cell.id} className="w-auto">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  </>
                ))}
              </TableRow>
              <TableRow className="col-span-auto">
                {row.getIsExpanded() && <RowExpandView user={row.original} />}
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
      <div>
        <Pagination table={table} />
      </div>
    </div>
  );
};

export default DataTable;
