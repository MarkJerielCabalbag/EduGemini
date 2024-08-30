import { ArrowLeft, Info, Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateClassroom } from "@/api/useApi";
import toast from "react-hot-toast";
function CreateClass() {
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState({
    classname: "",
    section: "",
    subject: "",
    room: "",
  });

  const { classname, section, subject, room } = classroom;

  const handleChange = (e) =>
    setClassroom({ ...classroom, [e.target.name]: e.target.value });

  const onSuccess = (data) => {
    toast.success(data.message);
    console.log(data.mesage);
    navigate(`/class/${data._id}`);
  };
  const onError = (error) => {
    toast.error(error.message);
    console.log(error.message);
  };

  const { mutate, isLoading, isPending, isError } = useCreateClassroom({
    onSuccess,
    onError,
  });
  return (
    <div className="container sm:container md:container">
      <div className="my-5">
        <ArrowLeft onClick={() => navigate("/home")} />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create Class</CardTitle>
          <CardDescription className="py-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            maiores necessitatibus, placeat libero harum inventore. Ullam
            obcaecati, adipisci numquam labore asperiores maxime, perferendis
            praesentium, consequatur quod ex magni sequi natus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="border-l-4 border-slate-500 shadow-md p-5 rounded"
          >
            <div className="flex gap-3 my-2">
              <div className="w-2/4">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Classname
                </Label>
                <Input
                  type="text"
                  value={classname}
                  name="classname"
                  onChange={handleChange}
                  placeholder="Enter Classname"
                  className={`${isError ? "border-red-500" : ""}`}
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
              <div className="w-2/4">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Section
                </Label>
                <Input
                  type="text"
                  value={section}
                  name="section"
                  onChange={handleChange}
                  placeholder="Enter Section"
                  className={`${isError ? "border-red-500" : ""}`}
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
            </div>

            <div className="flex gap-3 my-3">
              <div className="w-2/4">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Subject
                </Label>
                <Input
                  type="text"
                  value={subject}
                  name="subject"
                  onChange={handleChange}
                  placeholder="Enter Subject"
                  className={`${isError ? "border-red-500" : ""}`}
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
              <div className="w-2/4">
                <Label className="font-bold italic flex items-center gap-2 mb-2">
                  Room
                </Label>
                <Input
                  type="text"
                  value={room}
                  name="room"
                  onChange={handleChange}
                  placeholder="Enter Room"
                  className={`${isError ? "border-red-500" : ""}`}
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
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <Button
                className="w-full"
                onClick={() => {
                  try {
                    const formData = {
                      classname,
                      section,
                      subject,
                      room,
                    };

                    mutate(formData);
                  } catch (err) {
                    console.log("Error", err);
                    toast.error(err);
                  }
                }}
              >
                {isLoading || isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Create Class"
                )}
              </Button>
              <Button className="w-full bg-slate-500">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateClass;
