import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import ClassworkUpdate from "@/content/classroom/ClassworkUpdate";
import { Label } from "@radix-ui/react-label";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import DeleteClassworkModal from "./DeleteClassworkModal";

function OpenClassworkSettings({
  open,
  onOpenChange,
  classwork_title,
  isPending,
}) {
  const [openDeleteClassworkModal, setOpenDeleteClassworkModal] =
    useState(false);

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={"Classwork Settings"}
      alertDialogDescription={
        <>
          <div className="border-l-4 border-slate-500 p-5 shadow-md rounded mt-5 h-[330px] overflow-y-scroll">
            <ClassworkUpdate setOpenSettingModal={onOpenChange} />

            <div>
              <Label className="font-bold italic flex items-center gap-2 mb-2">
                <Trash2 size={20} />
                Delete this classwork?
              </Label>
              {openDeleteClassworkModal && (
                <DeleteClassworkModal
                  onOpenChange={setOpenDeleteClassworkModal}
                  open={openDeleteClassworkModal}
                />
              )}
              <p className="my-2">
                Are you sure you want to delete this classwork? This action
                cannot be undone
              </p>
              <Button
                className={"w-full hover:bg-red-700"}
                onClick={() => setOpenDeleteClassworkModal(true)}
              >
                Delete {classwork_title}
              </Button>
            </div>
          </div>
        </>
      }
      alertDialogFooter={
        <>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </>
      }
    />
  );
}

export default OpenClassworkSettings;
