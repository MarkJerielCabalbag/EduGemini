import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import excel from "../../assets/office365.png";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RowExpandView from "./studentListRow/RowExpandView";
import TableDataHeader from "./TableDataHeader";
import Pagination from "./Pagination";
import Filters from "./Filters";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

const DataTable = ({
  dataTable,
  columns,
  statuses,
  paginationVisibility,
  dataSheet,
  excelFilename,
  filterLateTurnedIn,
}) => {
  const [columnVisibility, setColumnVisibility] = useState({
    files: false,
    path: false,
    time: false,
    feedback: false,
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const memoizedColumns = useMemo(() => columns || [], [columns]);
  const memorizedData = useMemo(() => dataTable || [], [dataTable]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rowCount, setRowCount] = useState(memorizedData.length);

  const table = useReactTable({
    data: memorizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: memorizedData.length,
  });

  const handleOnExport = () => {
    const workBook = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(dataSheet);

    XLSX.utils.book_append_sheet(workBook, ws, "Sheet1");

    XLSX.writeFile(workBook, excelFilename);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row items-center gap-2 ">
        <Filters
          table={table}
          setColumnFilters={setColumnFilters}
          columnFilters={columnFilters}
          statuses={statuses}
        />

        <Button
          className="bg-green-800 flex gap-3 items-center shadow-lg w-full md:w-auto"
          onClick={handleOnExport}
        >
          <img className="h-5 w-5" src={excel} />
          Export Excel
        </Button>
      </div>
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
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <>
              <TableRow>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>

              {row.getIsExpanded() && (
                <RowExpandView
                  user={row.original}
                  filterLateTurnedIn={filterLateTurnedIn}
                />
              )}
            </>
          ))}
        </TableBody>
      </Table>
      <div className={`${paginationVisibility}`}>
        <Pagination
          table={table}
          setPagination={setPagination}
          rowCount={rowCount}
        />
      </div>
    </div>
  );
};

export default DataTable;
