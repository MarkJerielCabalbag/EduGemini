import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddAnnouncement from "@/components/modals/AddAnnouncement";
import GetAnnouncement from "./GetAnnouncement";
import { useState } from "react";

function Stream({ statusBtn, userStatus }) {
  const [openAddModalAnnouncement, setAddModalAnnouncement] = useState(false);
  return (
    <div className="container sm:container md:container lg:container">
      <Button
        variant={"secondary"}
        className={statusBtn}
        onClick={() => setAddModalAnnouncement(true)}
      >
        <Plus /> Add Announcement
      </Button>

      <div className="h-screen">
        <div>
          <GetAnnouncement
            userStatus={userStatus}
            statusBtn={statusBtn}
            cardStatus={`${
              statusBtn === "hidden"
                ? "grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 h-3/4"
                : "grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-3/4"
            }`}
          />
        </div>
      </div>

      <AddAnnouncement
        open={openAddModalAnnouncement}
        onOpenChange={setAddModalAnnouncement}
      />
    </div>
  );
}

export default Stream;
