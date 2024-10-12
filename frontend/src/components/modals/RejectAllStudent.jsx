import React from "react";
import ReusableModal from "./ReusableModal";
import { Button } from "../ui/button";

const RejectAllStudent = ({ open, onOpenChange, checkedList }) => {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      alertDialogTitle={`Decline ${checkedList.length} Students`}
      alertDialogDescription={<></>}
      alertDialogFooter={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button>Decline</Button>
        </>
      }
    />
  );
};

export default RejectAllStudent;
