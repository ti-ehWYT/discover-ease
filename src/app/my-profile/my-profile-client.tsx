"use client";

import { useEffect, useState } from "react";
import { fetchUserProfile, fetchUserPosts } from "./action";
import PostDialog from "@/components/post-dialog";
import { useAuth } from "../../../context/auth";
import { Post } from "../../../type/post";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

export default function MyProfileClient() {
  const auth = useAuth();
  const uid = auth?.currentUser?.uid;

  const [userProfile, setUserProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!uid) return;

    (async () => {
      const [profile, userPosts] = await Promise.all([
        fetchUserProfile(uid),
        fetchUserPosts(uid),
      ]);
      setUserProfile(profile);
      setPosts(userPosts);
    })();
  }, [uid]);

  if (!uid) return <div>Loading or not logged in...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center max-w-full">
        Welcome, {userProfile?.displayName || userProfile?.email}
        <Link href={`my-profile/edit/${uid}`}>
                <EllipsisVertical />
        </Link>

      </h2>
      {userProfile?.bio && (
        <p className="text-gray-600 mb-4 whitespace-pre-wrap">
          {userProfile.bio}
        </p>
      )}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {posts.map((post, index) => (
          <PostDialog key={post.id || index} postItem={post} allowEdit />
        ))}
      </div>
    </div>
  );
}
