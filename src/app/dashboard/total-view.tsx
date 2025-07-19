"use client";

import React from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Post } from "../../../type/post";
import { RadialBarChart, RadialBar, Legend } from "recharts";

type TotalView = {
  month: string;
  totalEngagement: number;
};

export default function TotalView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [data] = useState<TotalView[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/total-view",)
      .then((data) => setPosts(data.slice(0, 3)))
      .catch((error) => {
        console.error(error);
        setPosts([]);
      });
  }, []);

  return (
    <div className="w-full flex justify-center">
      <RadialBarChart
        width={300}
        height={300}
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        barSize={20}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          dataKey="views"
          fill="#8884d8"
          background
        />
        <Legend
          content={() => (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <strong>{data.toLocaleString()} views</strong>
            </div>
          )}
          layout="vertical"
          verticalAlign="middle"
          align="center"
        />
      </RadialBarChart>
    </div>
  );
}