"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

function AppBar() {
  const session = useSession();

  return (
    <div className=" w-full flex items-center justify-between p-4 px-20">
      <Link className="flex items-center justify-center" href="#">
        <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <span className="ml-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
          MusicQueue
        </span>
      </Link>
      <nav className=" flex items-center  gap-4 sm:gap-6">
        {/* <Link
          className="sm:text-base  text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400"
          href="#"
        >
          Features
        </Link>
        <Link
          className="sm:text-base  text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400"
          href="#"
        >
          Pricing
        </Link> */}

        {session.data?.user ? (
          <Button
            onClick={() => signOut()}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Sign out
          </Button>
        ) : (
          <Button
            onClick={() => signIn()}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Sign in
          </Button>
        )}
      </nav>
    </div>
  );
}

export default AppBar;
