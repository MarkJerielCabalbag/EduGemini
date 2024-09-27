import PrivateCommentModal from "@/components/modals/PrivateCommentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const PrivateComment = ({ teacherId }) => {
  const [openPrivateCommentModal, setOpenPrivateModal] = useState(false);
  const { workId, roomId, userId } = useParams();

  return (
    <div>
      {openPrivateCommentModal && (
        <PrivateCommentModal
          open={openPrivateCommentModal}
          onOpenChange={setOpenPrivateModal}
          workId={workId}
          roomId={roomId}
          userId={userId}
          studentId={userId}
        />
      )}
      <Button onClick={() => setOpenPrivateModal(true)}>
        See All Comments
      </Button>
    </div>
  );
};

export default PrivateComment;
