import MonthlyEngagement from "./monthly-engagement";
import MostUsedTagAllTime from "./most-used-tags-all-time";
import MostUsedTagByMonth from "./most-used-tags-by-month";
import SearchedRanking from "./search-ranking";
import TopLikedPosts from "./top-liked-posts";
import LikesOverTimeByCountry from "./likes-over-time-by-country";
import MonthlyEngagementSummary from "./monthly-engagement-summary";
import HashtagPieChart from "./most-used-user-preference";
import TotalView from "./total-view";

import {
  getSearchRanking,
  getTopLikedPosts,
  getMostViewPosts,
  getLikesOverTimeByCountry,
  getMostUsedTags,
  getMostUsedUserPreference,
  getTagsForMonth,
  getMonthlyEngagement,
  getTotalViewsByCountry,
} from "../../../data/dashboard";
import { ExportAllCSVButton } from "../../components/export-csv-button";

export default async function Dashboard() {
  const [
    searchRanking,
    { data: topLikedPosts },
    { data: mostViewedPosts },
    likesOverTime,
    mostUsedTags,
    mostUsedUserPreference,
    tagsForMonth,
    monthlyEngagement,
    totalViewsByCountry,
  ] = await Promise.all([
    getSearchRanking(),
    getTopLikedPosts(10),
    getMostViewPosts(10),
    getLikesOverTimeByCountry(),
    getMostUsedTags(),
    getMostUsedUserPreference(),
    getTagsForMonth(), // optionally pass a yearMonth
    getMonthlyEngagement(),
    getTotalViewsByCountry(),
  ]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ExportAllCSVButton
          allData={{
            searchRanking,
            topLikedPosts,
            mostViewedPosts,
            likesOverTime,
            mostUsedTags,
            mostUsedUserPreference,
            tagsForMonth,
            monthlyEngagement: Array.isArray(monthlyEngagement)
              ? monthlyEngagement
              : [monthlyEngagement],
            totalViewsByCountry,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 bg-white dark:bg-muted rounded-xl shadow p-4">
          <SearchedRanking />
        </div>
        <div className="col-span-2 bg-white dark:bg-muted rounded-xl shadow p-4">
          <TopLikedPosts />
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-muted rounded-xl shadow p-4">
          <div className="col-span-1 md:col-span-2">
            <p className="text-2xl font-semibold mt-2 ml-2">Engagement Rate</p>
          </div>
          <MonthlyEngagement />
          <MonthlyEngagementSummary />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <MostUsedTagAllTime />
        </div>
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <MostUsedTagByMonth />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <HashtagPieChart />
        </div>
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <TotalView />
        </div>
      </div>

      <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
        <LikesOverTimeByCountry />
      </div>
    </div>
  );
}
