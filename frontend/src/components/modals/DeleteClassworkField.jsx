import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteClassworkField({
  open,
  onOpenChange,
  alertDialogTitle,
  alertDialogDescription,
  alertDialogFooter,
  alertDialogTrigger,
}) {
  return (
    <>
      {open && (
        <AlertDialog
          open={open}
          onOpenChange={onOpenChange}
          className=" sm:container md:container lg:container"
        >
          {alertDialogTrigger}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {alertDialogTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {alertDialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>{alertDialogFooter}</AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default DeleteClassworkField;
