import {
  exportReport,
  fetchClassData,
  getAllActivities,
  useGetAllActivities,
  useGetClass,
  useGetExportOverallReport,
} from "@/api/useApi";
import DataTable from "../table/DataTable";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { studentGender } from "../table/studentListRow/sudentListStatus";
import { SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function Settings() {
  const { roomId } = useParams();
  const [openStudentDeclineModal, setOpenStudentDeclineModal] = useState(false);
  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");
  const columnHelper = createColumnHelper();

  const { data, isLoading, isPending, isFetching } = useGetClass({
    queryFn: () => fetchClassData(roomId),
    onError,
    onSuccess,
  });

  const { data: dataTable } = useGetAllActivities({
    queryFn: () => getAllActivities(roomId),
    onError,
    onSuccess,
  });

  const getClassworkTitles = (data) => {
    const titles = new Set();
    if (data) {
      data.forEach((student) => {
        student.classwork.forEach((cw) => titles.add(cw.title));
      });
    }
    return Array.from(titles);
  };

  const { data: excel } = useGetExportOverallReport({
    queryFn: () => exportReport(roomId),
    onError,
    onSuccess,
  });

  const classworkTitles = dataTable ? getClassworkTitles(dataTable) : [];

  const setGetAllActivities = [
    columnHelper.accessor("studentNames", {
      id: "name",
      header: "Name",
      cell: (info) => (
        <h1 className="font-bold text-slate-900 italic">{info.getValue()}</h1>
      ),
      enableColumnFilter: true,
      filterFn: "includesString",
    }),
    columnHelper.accessor((row) => row.gender, {
      id: "status",
      enableSorting: false,
      header: () => "Gender",
      cell: (info) => <p>{info.getValue().name}</p>,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    }),
    //dynamic columns
    ...classworkTitles.map((title) =>
      columnHelper.accessor(
        (row) => {
          const classwork = row.classwork.find((cw) => cw.title === title);
          return classwork ? classwork.scores : null;
        },
        {
          id: title,
          header: title.charAt(0).toUpperCase() + title.slice(1),
          cell: (info) => <p>{info.getValue()}</p>,
        }
      )
    ),
  ];

  const filename = data
    ?.map((classInfo) => `${classInfo.classname} Overall Report.xlsx`)
    .toString();

  return (
    <div className="h-full container sm:container md:container lg:container">
      <h1 className="text-slate-900 font-bold text-md flex gap-2 items-center">
        <SettingsIcon size={30} />
        Settings
      </h1>
      <p className="opacity-75 italic my-2 text-pretty">
        You can easily access an overview of overall student scores through the
        Data Table, which displays the scores clearly. Additionally, you have
        the option to export this data as an Excel file for convenient
        record-keeping and sharing.
      </p>

      <Separator className="mt-5" />
      <div className="h-screen">
        <DataTable
          dataTable={dataTable}
          columns={setGetAllActivities}
          statuses={studentGender}
          paginationVisibility={"show"}
          excelFilename={filename}
          dataSheet={excel}
        />
      </div>
    </div>
  );
}

export default Settings;
