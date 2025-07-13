"use client";

import { useEffect, useState } from "react";
import { fetchUserProfile, fetchUserPosts } from "./action";
import PostDialog from "@/components/post-dialog";
import { useAuth } from "../../../context/auth";
import { Post } from "../../../type/post";
import { EllipsisVertical, Mars, Venus } from "lucide-react";
import Link from "next/link";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  640: 1,
};

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
    <div className="p-4 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 mb-8">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src={userProfile?.photoURL || "/default-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 sm:ml-6 w-full relative">
          {/* Edit Button */}
          <div className="absolute top-0 right-0">
            <Link href={`/my-profile/edit/${uid}`}>
              <EllipsisVertical className="text-gray-500 hover:text-gray-800" />
            </Link>
          </div>

          <h2 className="text-2xl font-bold">
            {userProfile?.nickname ||
              userProfile?.displayName ||
              userProfile?.email}
          </h2>

          {userProfile?.bio && (
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">
              {userProfile.bio}
            </p>
          )}

          {/* Gender Icons */}
          {userProfile?.gender && (
            <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm w-fit">
              {userProfile.gender === "male" && (
                <>
                  <Mars className="w-4 h-4 text-blue-500" />
                  <span>Male</span>
                </>
              )}
              {userProfile.gender === "female" && (
                <>
                  <Venus className="w-4 h-4 text-pink-500" />
                  <span>Female</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="my-8 border-t border-gray-300" />

      {/* User Posts with Masonry */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post, index) => (
          <div key={post.id || index}>
            <PostDialog postItem={post} allowEdit />
          </div>
        ))}
      </Masonry>
    </div>
  );
}