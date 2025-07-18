"use client";

import React, { useEffect, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { apiFetch } from "@/lib/apiFetch";

type MonthlyEngagementType = {
  month: string;
  totalEngagement: number;
};

export default function MonthlyEngagement() {
  const [data, setData] = useState<MonthlyEngagementType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/dashboard/monthly-engagement")
      .then((res) => {
        const formatted = Array.isArray(res) ? res : [res];
        setData(
          formatted.map((d) => ({
            month: d.month,
            totalEngagement: d.totalEngagement,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6">
      <h2 className="text-xl font-semibold">Engagement Radar Chart</h2>
      <RadarChart
        outerRadius={90}
        width={400}
        height={300}
        data={data}
        className="mx-auto"
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <Radar
          name="Engagement"
          dataKey="totalEngagement"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.6}
        />
        <Tooltip />
      </RadarChart>

      <div className="flex gap-2 leading-none font-medium ">
        Engagement by month
      </div>

    </div>
  );
}
