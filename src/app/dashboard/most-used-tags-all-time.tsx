"use client";

import { apiFetch } from "@/lib/apiFetch";
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
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
  "#d0ed57", "#a4de6c", "#d88884", "#bfa8ff", "#ffa07a",
];
export default function MostUsedTagAllTime() {
  const [tags, setTags] = useState<MostUseTagType[]>([]);

  useEffect(() => {
    apiFetch("/api/dashboard/most-used-tags-all-time")
      .then((data) => {
        setTags(data);
      })
      .catch((err) => {
        console.error(err);
        setTags([]);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-1 text-center">Top 10 Hashtags Used</h2>
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
              label
            >
              {tags.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
      <div className="text-center text-gray-500 text-sm mt-4">
        Total tags used by users when creating posts all time.
      </div>
      <div className="text-center text-gray-500 text-sm">
        This helps identify tag usage trends.
      </div>
    </div>
  );
}
