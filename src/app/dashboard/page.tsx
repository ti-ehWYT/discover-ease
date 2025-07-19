import MonthlyEngagement from "./monthly-engagement";
import MostUsedTagAllTime from "./most-used-tags-all-time";
import MostUsedTagByMonth from "./most-used-tags-by-month";
import SearchedRanking from "./search-ranking";
import TopLikedPosts from "./top-liked-posts";
import LikesOverTimeByCountry from "./likes-over-time-by-country";
import MonthlyEngagementSummary from "./monthly-engagement-summary";
import HashtagPieChart from "./most-used-user-preference";
import TotalView from "./total-view";

export default async function Dashboard() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 bg-white dark:bg-muted rounded-xl shadow p-4">
          <SearchedRanking />
        </div>
        <div className="col-span-2 bg-white dark:bg-muted rounded-xl shadow p-4">
          <TopLikedPosts />
        </div>
      </div>

      {/* You can add more sections like this below */}

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
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4 ">
          <MostUsedTagByMonth />
        </div>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <HashtagPieChart />
        </div>
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4 ">
          <TotalView />
        </div>
      </div>

      <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
        <LikesOverTimeByCountry />
      </div>
    </div>
  );
}
