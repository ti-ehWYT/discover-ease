"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MostUseTagType = {
  tag: string;
  count: number;
};

const COLORS = [
  "#22c55e", "#4ade80", "#16a34a", "#84cc16", "#f59e0b",
  "#f97316", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899",
];

export default function MostUsedTagAllTime() {
  const [tags, setTags] = useState<MostUseTagType[]>([]);

  useEffect(() => {
    const fetchMostUsedTagAllTime = async () => {
      const res = await fetch("/api/dashboard/most-used-tags-all-time");
      try {
        if(!res.ok) {
          throw new Error("Failed to fetch most used tag all time");
        }
        const data: MostUseTagType[] = await res.json();
        setTags(data);
      }catch (error) {
        console.error("Error fetching most used tag all time:", error);
        setTags([]);
      }
    }
    fetchMostUsedTagAllTime();
  }, []);

  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-1 text-center">
        Most Used Tags
      </h2>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        (All Time)
      </p>

      {tags.length === 0 ? (
        <p className="text-center text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={tags}
              dataKey="count"
              nameKey="tag"
              cx="50%"
              cy="45%" // Shift up slightly
              outerRadius={100}
              labelLine={false}
              label={({ tag, percent }) =>
                `${tag}: ${(percent! * 100).toFixed(0)}%`
              }
            >
              {tags.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip formatter={(v: number) => `${v} uses`} />

            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                marginTop: "1rem",
                fontSize: "0.875rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}