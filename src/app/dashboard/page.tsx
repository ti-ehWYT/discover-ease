import { getLikesOverTimeByCountry, getTopLikedPosts, getMostViewPosts } from "../../../data/posts";
import { getSearchRanking } from "../../../data/trend";

export default async function Dashboard() {
    const searchRanking = await getSearchRanking();
    const topLikedPosts = await getTopLikedPosts();
    const likeOverTimeCountry = await getLikesOverTimeByCountry();
    const mostViewedPost = await getMostViewPosts();
    console.log(mostViewedPost)
    console.log(topLikedPosts);
    console.log(searchRanking);
    console.log(likeOverTimeCountry);

    return <div> Dashboard </div>;
}