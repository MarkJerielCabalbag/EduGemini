import React from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const SetStatus = ({ status, setColumnFilters, isActive }) => {
  return (
    <div className="flex flex-col items-start my-2">
      <Button
        className={`${status.name === "Missing" ? "bg-red-500" : ""}  ${
          status.name === "Shelved" ? "bg-sky-500" : ""
        } ${status.name === "Cancelled" ? "bg-red-900" : ""} ${
          status.name === "Turned in" ? "bg-green-500" : ""
        } ${status.name === "Late" ? "bg-yellow-500" : ""} ${
          isActive ? "bg-slate-400" : ""
        }`}
        // className={`text-white ${isActive ? "bg-slate-900" : "bg-slate-400"} : 'bg' }`}
        onClick={() =>
          setColumnFilters((prev) => {
            const statuses = prev.find(
              (filter) => filter.id === "status"
            )?.value;

            if (!statuses) {
              return prev.concat({
                id: "status",
                value: [status.id],
              });
            }

            return prev.map((f) =>
              f.id === "status"
                ? {
                    ...f,
                    value: isActive
                      ? statuses.filter((s) => s !== status.id)
                      : statuses.concat(status.id),
                  }
                : f
            );
          })
        }
      >
        {status.name}
      </Button>
    </div>
  );
};

const Filters = ({ setColumnFilters, columnFilters, statuses }) => {
  const onFilterChange = (id, value) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );

  const filterStatuses =
    columnFilters.find((f) => f.id === "status")?.value || [];

  return (
    <div className="flex items-center gap-3 my-5">
      <Input
        // value={studentFilter}
        onChange={(e) => onFilterChange("name", e.target.value)}
        placeholder="Search Student"
      />
      <Popover>
        <PopoverTrigger className="bg-slate-900 text-white px-5 py-2 rounded-md flex items-center gap-2">
          <Filter size={19} />
          Filter
        </PopoverTrigger>
        <PopoverContent>
          <h1 className="text-slate-900 font-bold mb-5">Filter By Status:</h1>
          {statuses.map((status) => (
            <SetStatus
              key={status.id}
              status={status}
              isActive={filterStatuses.includes(status.id)}
              setColumnFilters={setColumnFilters}
              columnFilters={columnFilters}
            />
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Filters;
