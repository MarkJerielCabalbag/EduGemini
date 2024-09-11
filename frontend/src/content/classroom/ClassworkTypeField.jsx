import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { getClassworkType, useGetClassworkType } from "@/api/useApi";
import { useState } from "react";
import AddClassworkType from "@/components/modals/AddClassworkType";
import toast from "react-hot-toast";
import { LoaderCircle, MinusCircle } from "lucide-react";
import DeleteClassworkType from "@/components/modals/DeleteClassworkType";

function ClassworkTypeField({ setClassworkDetails, classworkDetails }) {
  const [openAddClassworkTypeModal, setAddClassworkTypeModal] = useState(false);
  const [openDeleteClassworkTypeModal, setDeleteClassworkTypeModal] =
    useState(false);
  const [selectedClassworkType, setSelectedClassworkType] = useState(null);

  const [classwork, setClasswork] = useState("");
  const [classworkId, setClassworkId] = useState(null);

  const roomId = localStorage.getItem("roomId");

  const onSuccess = (data) => {
    toast.success(data.message);
    setAddClassworkTypeModal(false);
    setClasswork("");
  };

  const onError = (error) => {
    setClasswork("");
  };

  const handleChangeClassworkType = (selectedClassworkType) => {
    setClassworkDetails({
      ...classworkDetails,
      classworkType: selectedClassworkType,
    });
    setSelectedClassworkType(selectedClassworkType);
  };

  const {
    data: classworkType,
    isFetching,
    isLoading,
    isPending,
  } = useGetClassworkType({
    queryFn: () => getClassworkType(roomId),
    onError,
    onSuccess,
  });

  return (
    <div className="">
      {openAddClassworkTypeModal && (
        <AddClassworkType
          onOpenChange={setAddClassworkTypeModal}
          open={openAddClassworkTypeModal}
          setClassworkDetails={setClassworkDetails}
          classworkDetails={classworkDetails}
        />
      )}
      <div className="w-full">
        <Label className="font-bold italic flex items-center gap-2 mb-2">
          Classwork Type
        </Label>
        <Select
          onValueChange={handleChangeClassworkType}
          placeholder="Select what classwork this might be"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select classwork type"></SelectValue>
          </SelectTrigger>
          <SelectContent className="relative">
            {isFetching || isLoading || isPending ? (
              <SelectItem value="null">
                <p className="flex opacity-70 text-sm gap-4">
                  <LoaderCircle className="animate-spin" /> loading....
                </p>
              </SelectItem>
            ) : (
              <>
                {classworkType?.length === 0 ? (
                  <p className="text-center opacity-75 text-sm my-5">
                    No added yet
                  </p>
                ) : (
                  classworkType?.map((classType) => (
                    <div
                      className="h-full flex justify-between align-end z-0 relative"
                      key={classType._id}
                    >
                      <SelectItem
                        id={classType._id}
                        value={classType.classwork}
                      >
                        {classType.classwork}
                      </SelectItem>
                      <div className="">
                        <MinusCircle
                          size={12}
                          onClick={() => {
                            setDeleteClassworkTypeModal(true);
                            setClassworkId(classType._id);
                          }}
                          className="text-red-600 h-full flex align-center z-50 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
            <Button
              className="w-full"
              onClick={() => setAddClassworkTypeModal(true)}
            >
              Add
            </Button>
          </SelectContent>
        </Select>
      </div>
      {openDeleteClassworkTypeModal && (
        <DeleteClassworkType
          onOpenChange={setDeleteClassworkTypeModal}
          open={openDeleteClassworkTypeModal}
          classworkId={classworkId}
        />
      )}
    </div>
  );
}

export default ClassworkTypeField;
