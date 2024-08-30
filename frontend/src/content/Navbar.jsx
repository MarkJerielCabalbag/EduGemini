import {
  BrainCircuit,
  BrainCircuitIcon,
  GraduationCap,
  Home,
  House,
  Menu,
  School2Icon,
  SchoolIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Navbar() {
  return (
    <>
      <Sheet>
        <SheetTrigger className="fixed bottom-5 right-5 bg-primary rounded p-5 ">
          <Menu size={24} className="text-white" />
        </SheetTrigger>
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle>
              <h1 className="flex items-center gap-2 border-b-2 border-primary pb-1">
                <BrainCircuitIcon />
                EduGemini
              </h1>
            </SheetTitle>
            <SheetDescription>
              <div className="flex flex-col gap-3">
                <Link
                  to="/home"
                  className="flex items-center gap-2 text-lg text-slate-900"
                >
                  <Home />
                  Home
                </Link>

                <Link
                  to="/class"
                  className="flex items-center gap-2 text-lg text-slate-900"
                >
                  <SchoolIcon />
                  Class
                </Link>
                <Link
                  to="/enrolled"
                  className="flex items-center gap-2 text-lg text-slate-900"
                >
                  <School2Icon />
                  Enrolled
                </Link>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Navbar;
