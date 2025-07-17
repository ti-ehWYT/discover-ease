"use client";

import React, { useEffect, useState } from "react";
import { Post } from "../../../type/post";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "@/lib/apiFetch";

export default function TopLikedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/top-liked-posts", {
      successMessage: "Top liked posts loaded successfully!",
      errorMessage: "Failed to load Top liked posts",
    })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        setPosts([]);
      });;
  }, []);

  const chartData = posts.map((post) => ({
    title: post.title.length > 20 ? post.title.slice(0, 20) + "…" : post.title,
    likeCount: post.likeCount || 0,
    viewCount: post.viewCount || 0,
  }));

  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6 w-full h-[400px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Top Liked Posts</h2>
      {chartData.length === 0 ? (
        <p className="text-center text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likeCount" fill="#8884d8" name="Likes" />
            <Bar dataKey="viewCount" fill="#82ca9d" name="Views" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
