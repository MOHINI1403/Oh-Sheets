import DarkMode from "@/buttons/DarkMode";
import { UserButton } from "@clerk/clerk-react";

export default function Nav() {
  return (
    <header className=" dark:bg-black flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <a href="/">
          <img className="w-40 p-0 mx-0 dark:hidden" src="/Logo.png" />
          <img
            className="w-40 p-0 mx-0 hidden dark:block"
            src="/Logo-Dark.png"
          />
        </a>
      </div>
      <DarkMode extraClasses="absolute right-16 top-3 w-6" />
      <div className="right-1">
        <UserButton />
      </div>
    </header>
  );
}
