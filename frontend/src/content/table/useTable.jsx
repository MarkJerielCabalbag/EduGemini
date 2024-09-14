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
    enableSorting: false,
  }),
  columnHelper.accessor("studentName", {
    id: "name",
    header: "Name",
    cell: (info) => (
      <h1 className="font-bold text-slate-900 italic">{info.getValue()}</h1>
    ),
  }),
  columnHelper.accessor((row) => row.workStatus, {
    id: "status",
    cell: (info) => (
      <Badge
        className={`${info.getValue() === "Missing" ? "bg-red-500" : ""} ${
          info.getValue() === "Missing" ? "bg-red-500" : ""
        } ${info.getValue() === "shelved" ? "bg-sky-500" : ""} ${
          info.getValue() === "cancelled" ? "bg-red-900" : ""
        } ${info.getValue() === "Turned in" ? "bg-green-500" : ""}`}
      >
        {info.getValue()}
      </Badge>
    ),
    header: () => "Status",
    enableSorting: false,
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
