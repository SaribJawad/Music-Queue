"use client";
import { signIn, signOut, useSession } from "next-auth/react";

function AppBar() {
  const session = useSession();
  console.log(session);

  return (
    <div>
      <div className="flex justify-between">
        <div>SoundQueue</div>
        <div>
          {session.data?.user ? (
            <button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <button className="m-2 p-2 bg-blue-400" onClick={() => signIn()}>
              {" "}
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppBar;
