"use client";
import { downloadCSV } from "../lib/exportToCSV";

export function ExportAllCSVButton({
  allData,
}: {
  allData: {
    searchRanking: any[];
    topLikedPosts: any[];
    mostViewedPosts: any[];
    likesOverTime: any[];
    mostUsedTags: any[];
    mostUsedUserPreference: any[];
    tagsForMonth: any;
    monthlyEngagement: any[];
    totalViewsByCountry: any[];
  };
}) {
  const handleExport = () => {
    downloadCSV(allData.searchRanking, "search-ranking.csv");
    downloadCSV(allData.topLikedPosts, "top-liked-posts.csv");
    downloadCSV(allData.mostViewedPosts, "most-viewed-posts.csv");
    downloadCSV(allData.likesOverTime, "likes-over-time.csv");
    downloadCSV(allData.mostUsedTags, "most-used-tags.csv");
    downloadCSV(allData.mostUsedUserPreference, "most-used-user-preference.csv");

    // Flatten tagsForMonth object
    const tagsForMonthArray = Object.entries(allData.tagsForMonth.tagCount).map(
      ([tag, count]) => ({ tag, count })
    );
    downloadCSV(tagsForMonthArray, `tags-${allData.tagsForMonth.yearMonth}.csv`);

    downloadCSV(allData.monthlyEngagement, "monthly-engagement.csv");
    downloadCSV(allData.totalViewsByCountry, "total-views-by-country.csv");
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Export All CSVs
    </button>
  );
}