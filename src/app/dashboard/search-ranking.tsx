"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SearchRankingItem = {
  country: string;
  count: number;
};

export default function SearchedRanking() {
  const [ranking, setRanking] = useState<SearchRankingItem[]>([]);

  useEffect(() => {
    const fetchSearchRanking = async () => {
      try {
        const res = await fetch("/api/dashboard/search-ranking");
        if (!res.ok) {
          throw new Error("Failed to fetch search ranking");
        }
        const data: SearchRankingItem[] = await res.json();
        setRanking(data);
      } catch (error) {
        console.error("Error fetching search ranking:", error);
        setRanking([]);
      }
    };

    fetchSearchRanking();
  }, []);
  const totalSearches = ranking.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-1 text-center">
        Popular Searched Country
      </h2>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        (All Time)
      </p>

      {ranking.length === 0 ? (
        <p className="text-center text-gray-500">No data available.</p>
      ) : (
        <Table>
          <TableCaption>A list of countries users searched the most.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead className="text-center">Country</TableHead>
              <TableHead className="text-center">Search Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((item, index) => (
              <TableRow key={item.country}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-center">{item.country}</TableCell>
                <TableCell className="text-center">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">{totalSearches}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
