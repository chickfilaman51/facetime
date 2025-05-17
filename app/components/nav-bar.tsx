import { ModeToggle } from "@/app/dark-mode";
import { Button } from "@/components/ui/button";
// @ts-ignore
import { LayoutDashboard } from "lucide-react";

export default function Navbar() {
  function AppLogo() {
    return (
      <div className="flex items-center justify-between space-x-2 mt-1">
        <div className="flex gap-2 items-center">
          <div className="w-11 h-11 bg-primary rounded-md flex items-center justify-center">
            <LayoutDashboard className="text-primary-foreground" />
          </div>
          <h1 className={"text-[20px] flex gap-1 max-md:hidden"}>
            <span className="font-bold">FaceTIME </span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-3 flex m-5 mx-8 items-center justify-between flex-wrap">
      <AppLogo />
      <div className="flex gap-4 items-center flex-wrap justify-center md:justify-start text-2xl">
        <a href="#" className="hover:underline">
          Home
        </a>
        <a href="#" className="hover:underline">
          About
        </a>
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-end">
        <ModeToggle />
        <Button className="whitespace-nowrap h-11 text-2xl px-3">Get Started</Button>
      </div>
    </div>
  );
}
