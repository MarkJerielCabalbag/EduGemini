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
  return (
    <div>
      {data?.map((info) =>
        info._id === workId ? (
          <>
            {attachments?.map((outputs) => (
              <>
                {outputs.files.map((file) => (
                  <DocViewer
                    documents={[
                      {
                        uri: `http://localhost:3000/${info.classwork_folder_path}/${file.path}/${file.filename}`,
                        fileType: file.filename.split(".").pop(),
                      },
                    ]}
                    pluginRenderers={DocViewerRenderers}
                  />
                ))}
              </>
            ))}
          </>
        ) : null
      )}
    </div>
  );
}

export default Outputs;
