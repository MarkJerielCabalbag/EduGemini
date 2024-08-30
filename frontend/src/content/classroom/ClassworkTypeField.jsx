import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  getClassworkType,
  useCreateClassworkType,
  useDeleteClassworkType,
  useGetClassworkType,
} from "@/api/useApi";
import { useState } from "react";
import AddClassworkType from "@/components/modals/AddClassworkType";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Info, Loader2, LoaderCircle, MinusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import DeleteClassworkType from "@/components/modals/DeleteClassworkType";

function ClassworkTypeField({ setClassworkDetails, classworkDetails }) {
  const [openAddClassworkTypeModal, setAddClassworkTypeModal] = useState(false);
  const [openDeleteClassworkTypeModal, setDeleteClassworkTypeModal] =
    useState(false);

  const [classwork, setClasswork] = useState("");
  const [classworkId, setClassworkId] = useState(null);
  const [selectedClassworkType, setSelectedClassworkType] = useState(null);

  const roomId = localStorage.getItem("roomId");
  const queryClient = useQueryClient();

  const onSuccess = (data) => {
    toast.success(data.message);
    setAddClassworkTypeModal(false);
    queryClient.invalidateQueries({ queryKey: ["classworkType"] });
    queryClient.invalidateQueries({ queryKey: ["classworkField"] });
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
    mutateAsync: createClassworkType,
    isPending,
    isLoading,
    isError,
  } = useCreateClassworkType({ onError, onSuccess });

  const { data: classworkType, isFetching } = useGetClassworkType({
    queryFn: () => getClassworkType(roomId),
    onError,
    onSuccess,
  });

  const { mutateAsync: deleteClassworkType } = useDeleteClassworkType({
    onError,
    onSuccess,
  });

  return (
    <div className="">
      {openAddClassworkTypeModal && (
        <AddClassworkType
          onOpenChange={setAddClassworkTypeModal}
          open={openAddClassworkTypeModal}
          alertDialogDescription={
            <>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
                debitis dolores illo. Cum itaque illo aliquid eius, labore omnis
                minima?
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mt-5">
                  <Label className="font-bold italic flex items-center gap-2 mb-2">
                    New Classwork type
                  </Label>
                  <Input
                    type="text"
                    name="classwork"
                    className={`${isError ? "border-red-500" : ""}`}
                    value={
                      classwork.charAt(0).toUpperCase() +
                      classwork.slice(1).toLowerCase()
                    }
                    onChange={(e) => setClasswork(e.target.value)}
                    placeholder="What classwork type this might be?"
                  />

                  <p
                    className={`${
                      isError ? "show" : " "
                    }hidden text-red-500 text-xs italic mt-2`}
                  >
                    {isError ? (
                      <div className="flex items-center gap-1">
                        <Info size={13} />
                        Fill out all fields
                      </div>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </form>
            </>
          }
          alertDialogTitle={"Add new classwork type"}
          alertDialogFooter={
            <>
              <Button onClick={() => setAddClassworkTypeModal(false)}>
                Close
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const formData = { classwork, roomId };
                    await createClassworkType(formData);
                    setAddClassworkTypeModal(false);
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
              >
                {isLoading || isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </>
          }
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
          alertDialogTitle={"Delete Classwork"}
          alertDialogDescription={
            <>Are you sure to delete this classwork type?</>
          }
          alertDialogFooter={
            <>
              <Button onClick={() => setDeleteClassworkTypeModal(false)}>
                Close
              </Button>
              <Button
                onClick={async () => {
                  const formData = { roomId, classworkId };
                  await deleteClassworkType(formData);
                  setDeleteClassworkTypeModal(false);
                }}
              >
                Delete
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}

export default ClassworkTypeField;
