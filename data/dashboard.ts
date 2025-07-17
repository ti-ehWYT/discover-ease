import "server-only";
import { firestore } from "../firebase/server";
import { Timestamp } from "firebase/firestore";
import { Post } from "../type/post";


type LikesByCountryDate = {
  [date: string]: {
    [country: string]: number;
  };
};
export const getSearchRanking = async () => {
    const snap = await firestore.collection("searchRanking").orderBy("count", "desc")
    .limit(10)
    .get();

  const data = snap.docs.map((doc) => {
    const docData = doc.data();
    return {
      country: doc.id,
      count: typeof docData.count === "number" ? docData.count : 0,
    };
  });

  return data;
};
export const getTopLikedPosts = async (limitCount: number = 5) => {
  const snap = await firestore
    .collection("posts")
    .orderBy("likeCount", "desc")
    .limit(limitCount)
    .get();

  const posts: Post[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      authorId: data.authorId ?? "",
      likeCount: data.likeCount ?? 0,
      viewCount: data.viewCount ?? 0,
    };
  });

  return { data: posts };
};

export const getMostViewPosts = async (limitCount: number = 5) => {
  const snap = await firestore
    .collection("posts")
    .orderBy("viewCount", "desc")
    .limit(limitCount)
    .get();

  const posts: Post[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      country: data.country ?? "",
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      authorId: data.authorId ?? "",
      likeCount: data.likeCount ?? 0,
      viewCount: data.viewCount ?? 0,
    };
  });

  return { data: posts };
};

export const getLikesOverTimeByCountry = async () => {
  const postsSnap = await firestore.collection("posts").get();

  const grouped: Record<string, Record<string, number>> = {};
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29); // include today

  // Generate all dates in the last 30 days
  const dateList: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const isoDate = d.toISOString().split("T")[0];
    dateList.push(isoDate);
    grouped[isoDate] = {}; // Initialize with empty objects
  }

  const allCountries = new Set<string>();

  for (const postDoc of postsSnap.docs) {
    const postData = postDoc.data();
    const country = postData.country ?? "Unknown";
    const postId = postDoc.id;

    const likesSnap = await firestore
      .collection("posts")
      .doc(postId)
      .collection("likes")
      .get();

    likesSnap.forEach((likeDoc) => {
      const data = likeDoc.data();
      const likedAt = data.likedAt?.toDate?.() ?? new Date(data.likedAt);

      if (!likedAt || likedAt < thirtyDaysAgo || likedAt > now) return;

      const date = likedAt.toISOString().split("T")[0];

      allCountries.add(country);
      if (!grouped[date][country]) grouped[date][country] = 0;
      grouped[date][country]++;
    });
  }

  // Build final chartData with all countries per day
  const chartData = dateList.map((date) => {
    const row: any = { date };
    allCountries.forEach((country) => {
      row[country] = grouped[date][country] ?? 0;
    });
    return row;
  });

  return chartData;
};


export async function getMostUsedTags(): Promise<
  { tag: string; count: number }[]
> {
  const snapshot = await firestore.collection("posts").get();

  const tagFrequency: Record<string, number> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const tags: string[] = data.tags || [];

    tags.forEach((tag) => {
      const trimmed = tag.trim().toLowerCase();
      tagFrequency[trimmed] = (tagFrequency[trimmed] || 0) + 1;
    });
  });

  // Sort and return top 10 tags
  return Object.entries(tagFrequency)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // ✅ Top 10 by frequency
}

export async function getTagsForMonth(
  yearMonth?: string
): Promise<{ yearMonth: string; tagCount: Record<string, number> }> {
  if (!yearMonth) {
    const now = new Date();
    yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  const snapshot = await firestore.collection("posts").get();

  const tagCount: Record<string, number> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const tags: string[] = data.tags || [];

    if (!tags.length) return;

    const createdTimestamp = data.created;

    let date: Date;
    if (createdTimestamp instanceof Timestamp) {
      date = createdTimestamp.toDate();
    } else if (createdTimestamp?._seconds) {
      date = new Date(createdTimestamp._seconds * 1000);
    } else {
      date = new Date(createdTimestamp);
    }

    if (isNaN(date.getTime())) {
      console.warn("Invalid date in post", doc.id, data.created);
      return;
    }

    const postYearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (postYearMonth !== yearMonth) return;

    tags.forEach((tag) => {
      const cleanedTag = tag.trim().toLowerCase();
      tagCount[cleanedTag] = (tagCount[cleanedTag] || 0) + 1;
    });
  });
  const data = { yearMonth: yearMonth, tagCount: tagCount };
  return data;
}