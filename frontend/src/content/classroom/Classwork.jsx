import CreateClassworkModal from "@/components/modals/CreateClassworkModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateClasswork from "./CreateClasswork";

function Classwork({ statusBtn }) {
  const [openCreateClassworkModal, setOpenCreateClassworkModal] =
    useState(false);

  return (
    <div className="container sm:container md:container lg:container">
      <Button
        variant={"secondary"}
        className={statusBtn}
        onClick={() => {
          setOpenCreateClassworkModal(true);
        }}
      >
        <Plus /> Create Classwork
      </Button>

      <div className="h-screen">
        <div>
          <CreateClasswork
            statusBtn={statusBtn}
            cardStatus={`${
              statusBtn === "hidden"
                ? "grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 h-3/4"
                : "grid gap-3 mt-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-3/4"
            }`}
          />
        </div>
      </div>
      {openCreateClassworkModal && (
        <CreateClassworkModal
          open={openCreateClassworkModal}
          onOpenChange={setOpenCreateClassworkModal}
        />
      )}
    </div>
  );
}

export default Classwork;
