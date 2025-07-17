"use client";

import React from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Post } from "../../../type/post";
import PostDialog from "@/components/post-dialog";

export default function TopLikedPostsCarousel() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/top-liked-posts", {
      successMessage: "Top liked posts loaded successfully!",
      errorMessage: "Failed to load posts",
    })
      .then((data) => setPosts(data.slice(0, 3)))
      .catch((error) => {
        console.error(error);
        setPosts([]);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Top 3 Liked Posts This Week
      </h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="flex justify-center gap-4 items-end">
          {/* Left Post */}
          <div className="w-1/4 opacity-80">
            <PostDialog postItem={posts[1]} allowEdit={false} />
          </div>  

          {/* Center (Highlighted) Post */}
          <div className="w-1/3 scale-105">
            <PostDialog postItem={posts[0]} allowEdit={false} />
          </div>

          {/* Right Post */}
          <div className="w-1/4 opacity-80">
            <PostDialog postItem={posts[2]} allowEdit={false} />
          </div>
        </div>
      )}
    </div>
  );
}
