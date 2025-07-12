import { getLikesOverTimeByCountry, getTopPosts } from "../../../data/posts";
import { getSearchRanking } from "../../../data/trend";

export default async function Dashboard() {
    const searchRanking = await getSearchRanking();
    const topPosts = await getTopPosts();
    const likeOverTimeCountry = await getLikesOverTimeByCountry();
    console.log(topPosts);
    console.log(searchRanking);
    console.log(likeOverTimeCountry);

    return <div> Dashboard </div>;
}