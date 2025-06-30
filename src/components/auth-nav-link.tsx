"use client";

import Link from "next/link";
import { useAuth } from "../../context/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthNavLink() {
  const auth = useAuth();
  const router = useRouter();
  return (
    <div>
      {!!auth?.currentUser && (
        <>
          {!!auth.customClaims?.admin && (
            <Link className="px-8 uppercase hover:underline" href="/trend">
              Trend
            </Link>
          )}
          <Link className="px-8 uppercase hover:underline" href="/create-post">
            Create Post
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {!!auth.currentUser.photoURL && (
                  <Image
                    src={auth.currentUser.photoURL}
                    alt="avatar"
                    width={70}
                    height={70}
                  />
                )}
                <AvatarFallback>
                  {
                    (auth.currentUser.displayName ||
                      auth.currentUser.email)?.[0]
                  }
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <div>{auth.currentUser.displayName}</div>
                <div className="font-normal text-xs">
                  {auth.currentUser.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await auth.signOut();
                  router.push('/');
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {!auth?.currentUser && (
        <>
          <Link className="px-8 uppercase hover:underline" href="/login">
            Login
          </Link>
          <Link className="px-8 uppercase hover:underline" href="/register">
            Register
          </Link>
        </>
      )}
    </div>
  );
}
