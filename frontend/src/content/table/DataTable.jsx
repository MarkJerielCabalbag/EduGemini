import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { fuzzyFilter, statusFilter } from "./useFilter";
import RowExpandView from "./studentListRow/RowExpandView";
import TableDataHeader from "./TableDataHeader";
import Pagination from "./Pagination";
import Filters from "./Filters";

const DataTable = ({ dataTable, columns, statuses }) => {
  const [columnVisibility, setColumnVisibility] = useState({
    files: false,
    path: false,
    time: false,
    feedback: false,
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const memoizedColumns = useMemo(() => columns || [], [columns]);
  const memorizedData = useMemo(() => dataTable || [], [dataTable]);
  const [data, setData] = useState(dataTable);
  console.log(columnFilters);
  const table = useReactTable({
    data: memorizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full h-full">
      <Filters
        table={table}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
        statuses={statuses}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="w-auto">
              {headerGroup.headers.map((header) => (
                <TableDataHeader key={header.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="w-auto">
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow className="w-auto">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="w-auto">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              <>
                {row.getIsExpanded() && <RowExpandView user={row.original} />}
              </>
            </React.Fragment>
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
