import { Badge } from "@/components/ui/badge";

import { createColumnHelper } from "@tanstack/react-table";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

const columnHelper = createColumnHelper();

export const setStudentListCol = [
  columnHelper.display({
    id: "plus",
    header: () => <Plus />,
    cell: ({ row }) => (
      <>
        {row.getCanExpand() ? (
          <button onClick={row.getToggleExpandedHandler()}>
            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
          </button>
        ) : (
          ""
        )}
      </>
    ),
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
        } ${info.getValue().name === "Turned in" ? "bg-green-500" : ""} ${
          info.getValue().name === "Late" ? "bg-yellow-500" : ""
        }`}
      >
        {info.getValue().name}
      </Badge>
    ),
    header: () => "Status",
    enableColumnFilter: true,
    enableSorting: false,
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true;
      const status = row.getValue(columnId);
      return filterStatuses.includes(status?.id);
    },
  }),

  // columnHelper.accessor("gender", {
  //   id: "gender",
  //   header: "Gender",
  //   cell: (row) => <p>{row.getValue().name}</p>,
  // }),
  columnHelper.accessor("chancesResubmition", {
    id: "chances",
    header: "Resubmition Left",
    cell: (row) => <p className="font-bold">{row.getValue()}</p>,
    enableSorting: false,
  }),
  columnHelper.accessor("score", {
    id: "score",
    header: "Score",
    cell: (row) => <p>{row.getValue()}</p>,
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
];

export const studentPendingRequest = [
  columnHelper.accessor("user_firstname", {
    id: "firstname",
    header: () => "Firstname",
    cell: (info) => <p>{info.getValue()}</p>,
  }),
];
