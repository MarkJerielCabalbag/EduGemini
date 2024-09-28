import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";

const Pagination = ({ table, setPagination, rowCount }) => {
  const [selectSize, setSelectSize] = useState(
    table.getState().pagination.pageSize
  );

  const handlePageSizeChange = (value) => {
    setSelectSize(value);
    setPagination((prev) => ({
      ...prev,
      pageSize: Number(value),
    }));
    table.setPageSize(Number(value));
  };

  return (
    <div className={`flex flex-col gap-2 md:flex-row`}>
      <div className="flex flex-col gap-2 items-center md:flex-row">
        <Button
          className="w-full md:w-auto"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <DoubleArrowLeftIcon size={20} />
        </Button>
        <Button
          className="w-full md:w-auto"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft size={20} />
        </Button>
        <Button
          className="w-full md:w-auto"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight size={20} />
        </Button>
        <Button
          className="w-full md:w-auto"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <DoubleArrowRightIcon size={20} />
        </Button>

        <p>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>
      </div>
      <div>
        <Select value={String(selectSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "30", label: "30" },
              { value: "40", label: "40" },
              { value: rowCount, label: "All" },
            ].map((sizeOption) => (
              <SelectItem key={sizeOption.value} value={sizeOption.value}>
                Show {sizeOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
