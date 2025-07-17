"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { apiFetch } from "@/lib/apiFetch";
import { Post } from "../../../type/post";

export default function TopLikedPostsCarousel() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/top-liked-posts-week", {
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
      <h2 className="text-2xl font-bold mb-4 text-center">Top 3 Liked Posts This Week</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full max-w-3xl mx-auto">
          <CarouselContent>
            {posts.map((post, index) => (
              <CarouselItem key={index} className="md:basis-full lg:basis-1/2">
                <div className="p-2">
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col justify-center">
                      <h3 className="text-xl font-semibold mb-2 text-center">
                        {post.title.length > 40
                          ? post.title.slice(0, 40) + "…"
                          : post.title}
                      </h3>
                      <p className="text-center text-gray-600 text-sm mb-1">
                        {post.likeCount} Likes • {post.viewCount} Views
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        {post.description
                          ? post.description.slice(0, 100)
                          : "No description available."}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}
