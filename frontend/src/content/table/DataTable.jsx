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
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Button } from "@/components/ui/button";
const DataTable = ({ dataTable, columns, statuses, paginationVisibility }) => {
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

  const [rowCount, setRowCount] = useState(memorizedData?.length);

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
    rowCount: memorizedData?.length,
  });
  const tableRef = useRef(null);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center">
        <Filters
          table={table}
          setColumnFilters={setColumnFilters}
          columnFilters={columnFilters}
          statuses={statuses}
        />
        <DownloadTableExcel
          filename="table_data"
          sheet="sheet1"
          currentTableRef={tableRef.current}
        >
          <Button className="bg-green-800 my-5 flex gap-3 items-center">
            <img className="h-5 w-5" src={excel} />
            Export to Excel
          </Button>
        </DownloadTableExcel>
      </div>
      <Table ref={tableRef}>
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
