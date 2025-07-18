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
import { VscDiffAdded } from "react-icons/vsc";
import { useEffect, useState } from "react";
import LoginRegisterDialog from "./login-register-dialog";
import { apiFetch } from "@/lib/apiFetch";

export default function AuthNavLink() {
  const auth = useAuth();
  const router = useRouter();
  const uid = auth?.currentUser?.uid;
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!uid) return;
    apiFetch(`/api/profile?userId=${uid}`)
      .then((profile) => {
        setUserProfile(profile.data);
      })
      .catch((err) => {
        console.error(err);
        setUserProfile(null);
      })
  }, [uid]);

  return (
    <>
      {!!userProfile && auth?.currentUser && (
        <>
          {!!auth.customClaims?.admin && (
            <Link className="px-8 uppercase hover:underline" href="/dashboard">
              Dashboard
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="mx-4 text-3xl">
              <VscDiffAdded />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/create-post">New Post</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/itinerary/create-itinerary">New itinerary</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {!!userProfile?.photoURL && (
                  <Image
                    src={userProfile?.photoURL}
                    alt="avatar"
                    width={70}
                    height={70}
                  />
                )}
                {!userProfile?.photoURL && (
                  <AvatarFallback>
                    {(userProfile?.nickname || userProfile?.displayName)}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <div>{(userProfile?.nickname || userProfile?.displayName)}</div>
                <div className="font-normal text-xs">{userProfile?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${uid}`}>My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await auth.signOut();
                  router.push("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {!auth?.currentUser && (
        <LoginRegisterDialog
          icon={
            <div className="mx-4 text-3xl">
              <VscDiffAdded />
            </div>
          }
        />
      )}
    </>
  );
}
