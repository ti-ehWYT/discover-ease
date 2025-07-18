"use client";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";
import React, { useEffect, useState } from "react";

type MonthlyEngagementType = {
  month: string;
  createdPost: number;
  createdItinerary: number;
  likes: number;
  comments: number;
  favorites: number;
  totalEngagement: number;
  views: number;
};

export default function MonthlyEngagementSummary() {
  const [data, setData] = useState<
    MonthlyEngagementType[] | MonthlyEngagementType | null
  >(null);
  const [yearMonth, setYearMonth] = useState<string>(""); // empty = all time
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const query = yearMonth ? `?yearMonth=${yearMonth}` : "";
    apiFetch(`/api/dashboard/monthly-engagement-summary${query}`)
      .then((res) => {
        if (!yearMonth && Array.isArray(res)) {
          // Combine all months into one object
          const combined: MonthlyEngagementType = res.reduce(
            (acc, curr) => ({
              month: "All Time",
              createdPost: acc.createdPost + curr.createdPost,
              createdItinerary: acc.createdItinerary + curr.createdItinerary,
              likes: acc.likes + curr.likes,
              comments: acc.comments + curr.comments,
              favorites: acc.favorites + curr.favorites,
              views: acc.views + curr.views,
              totalEngagement: acc.totalEngagement + curr.totalEngagement,
            }),
            {
              month: "All Time",
              createdPost: 0,
              createdItinerary: 0,
              likes: 0,
              comments: 0,
              favorites: 0,
              views: 0,
              totalEngagement: 0,
            }
          );
          setData(combined);
        } else {
          setData(res);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data.");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [yearMonth]);
  const renderSkeleton = () => (
    <div className="border p-3 rounded-md bg-gray-100 animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 rounded w-1/2" /> {/* Month */}
      <div className="h-4 bg-gray-300 rounded w-1/3" /> {/* Posts */}
      <div className="h-4 bg-gray-300 rounded w-1/3" /> {/* Itineraries */}
      <div className="h-4 bg-gray-300 rounded w-1/4" /> {/* Likes */}
      <div className="h-4 bg-gray-300 rounded w-1/4" /> {/* Comments */}
      <div className="h-4 bg-gray-300 rounded w-1/4" /> {/* Favorites */}
      <div className="h-4 bg-gray-400 rounded w-1/2" /> {/* Total */}
    </div>
  );
  const renderItem = (item: MonthlyEngagementType) => (
    <div key={item.month} className="border p-3 rounded-md bg-white shadow-sm">
      <p>
        <strong>Month:</strong> {item.month}
      </p>
      <p>📄 Posts: {item.createdPost}</p>
      <p>🧭 Itineraries: {item.createdItinerary}</p>
      <p>❤️ Likes: {item.likes}</p>
      <p>💬 Comments: {item.comments}</p>
      <p>⭐ Favorites: {item.favorites}</p>
      <p className="font-bold">📊 Total: {item.totalEngagement}</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Engagement Summary</h2>

      {/* Month Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="month" className="text-sm font-medium">
          Filter by Month:
        </label>
        <input
          id="month"
          type="month"
          value={yearMonth}
          onChange={(e) => setYearMonth(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <Button onClick={() => setYearMonth("")} className="text-sm">
          All Time
        </Button>
      </div>

      {loading && <div className="space-y-4">{renderSkeleton()}</div>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Render engagement */}
      {!loading && data && (
        <div className="space-y-4">
          {Array.isArray(data) ? data.map(renderItem) : renderItem(data)}
        </div>
      )}
    </div>
  );
}
