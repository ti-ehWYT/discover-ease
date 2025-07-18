"use client";

import { apiFetch } from "@/lib/apiFetch";
import { niceMonthLabel } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type TagData = {
  tag: string;
  count: number;
};

export default function MostUsedTagByMonth() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [yearMonth, setYearMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    apiFetch(`/api/dashboard/most-used-tag-by-month?yearMonth=${yearMonth}`).then((data) => {
      const tagsArray = Object.entries(data.tagCount ?? {}).map(
        ([tag, count]) => ({
          tag,
          count: Number(count),
        })
      );
      setTags(tagsArray)
    })
      .catch((err) => {
        console.error(err);
        setTags([]);
      })

  }, [yearMonth]);

  return (
    <div className="bg-white dark:bg-muted   rounded-xl p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-1 text-center">
        Tags&nbsp;usage&nbsp;by&nbsp;month
      </h2>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        {niceMonthLabel(yearMonth)}
      </p>

      {/* Month picker */}
      <div className="flex justify-center mb-6">
        <input
          type="month"
          value={yearMonth}
          onChange={(e) => setYearMonth(e.target.value)}
          className="border border-gray-300 dark:border-border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-400"
        />
      </div>

      {/* Chart / fallback */}
      {tags.length === 0 ? (
        <p className="text-center text-gray-500">
          No tags found for this period.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={tags}
            margin={{ top: 10, right: 24, left: -30, bottom: 32 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tag"
              angle={-15}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(v: number) => [
                `${v} use${v > 1 ? "s" : ""}`,
                "Count",
              ]}
            />
            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              className="[&>path:hover]:opacity-80"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <p className="text-center text-gray-500 text-sm mt-4">
        Tags used by users when creating posts. This helps identify tag usage trends.
      </p>
    </div>
  );
}
