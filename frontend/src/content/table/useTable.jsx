import { baseUrl } from "@/baseUrl";
import { Badge } from "@/components/ui/badge";
import { createColumnHelper } from "@tanstack/react-table";
import { Divide, Minus, Plus } from "lucide-react";
import { useMemo } from "react";

const columnHelper = createColumnHelper();

export const setStudentListCol = [
  columnHelper.display({
    id: "avatar",
    header: "Avatar",
    cell: (row) => <img src={`${baseUrl}/${row.user_img}`} />,
  }),
  columnHelper.accessor("studentName", {
    id: "name",
    header: "Name",
    cell: (info) => (
      <h1 className="font-bold text-slate-900 italic">{info.getValue()}</h1>
    ),
    enableColumnFilter: true,
    filterFn: "includesString",
  }),
  columnHelper.accessor((row) => row.workStatus, {
    id: "status",
    cell: (info) => (
      <Badge
        className={`${
          info.getValue().name === "Missing" ? "bg-red-500" : ""
        }  ${info.getValue().name === "Shelved" ? "bg-sky-500" : ""} ${
          info.getValue().name === "Cancelled" ? "bg-red-900" : ""
        } ${info.getValue().name === "Turned in" ? "bg-green-500" : ""}`}
      >
        {info.getValue().name}
      </Badge>
    ),
    header: () => "Status",
    enableColumnFilter: true,
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true;
      const status = row.getValue(columnId);
      return filterStatuses.includes(status?.id);
    },
  }),
  columnHelper.accessor((row) => `${row.files.map((file) => file?.filename)}`, {
    id: "files",
  }),
  columnHelper.accessor("timeSubmition", {
    id: "time",
    header: "Time",
  }),
  columnHelper.accessor("path", {
    id: "path",
    header: "Path",
  }),
  columnHelper.accessor("feedback", {
    id: "feedback",
    header: "Feedback",
  }),
  columnHelper.display({
    id: "plus",
    header: () => <Plus />,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        row.getIsExpanded() ? (
          <Minus onClick={row.getToggleExpandedHandler()} />
        ) : (
          <Plus onClick={row.getToggleExpandedHandler()} />
        )
      ) : null,
  }),
];
