import {
  getLikesOverTimeByCountry,
  getTopLikedPosts,
  getMostViewPosts,
} from "../../../data/posts";
import { getSearchRanking } from "../../../data/trend";
import MostUsedTagAllTime from "./most-used-tags-all-time";
import MostUsedTagByMonth from "./most-used-tags-by-month";

export default async function Dashboard() {
  const searchRanking = await getSearchRanking();
  const topLikedPosts = await getTopLikedPosts();
  const likeOverTimeCountry = await getLikesOverTimeByCountry();
  const mostViewedPost = await getMostViewPosts();

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <MostUsedTagAllTime />
        </div>
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <MostUsedTagByMonth />
        </div>
      </div>

      {/* You can add more sections like this below */}
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <YourNextChartComponent />
        </div>
        <div className="bg-white dark:bg-muted rounded-xl shadow p-4">
          <AnotherChartComponent />
        </div>
      </div> 
      */}
    </div>
  );
}