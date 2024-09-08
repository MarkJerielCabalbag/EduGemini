import { classwork, getAttachments, useGetAttachments } from "@/api/useApi";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

function Outputs() {
  const { workId, roomId, userId } = useParams();
  const { data } = useQuery({
    queryKey: ["classwork"],
    queryFn: () => classwork(workId),
  });

  const onError = () => console.log("error");
  const onSuccess = () => console.log("success");

  const { data: attachments } = useGetAttachments({
    queryFn: () => getAttachments(roomId, workId, userId),
    onError,
    onSuccess,
  });

  const uri = localStorage.getItem("uri");
  const fileType = localStorage.getItem("fileType");
  return (
    <div>
      <DocViewer
        documents={[
          {
            uri: uri,
            fileType: fileType,
          },
        ]}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
}

export default Outputs;
