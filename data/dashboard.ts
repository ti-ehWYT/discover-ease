import "server-only";
import { firestore } from "../firebase/server";
import { Timestamp } from "firebase/firestore";
import { Post } from "../type/post";


type LikesByCountryDate = {
  [date: string]: {
    [country: string]: number;
  };
};


function toValidDate(input: any): Date | null {
  if (input instanceof Timestamp) {
    return input.toDate();
  }
  if (input?._seconds) {
    return new Date(input._seconds * 1000);
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

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
      avatar: data.avatar ?? "",
      user_preference: Array.isArray(data.user_preference)
        ? data.user_preference
        : [],
      created: data.created?.toDate().toISOString() ?? null,
      authorName: data.authorName ?? "",
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
    .slice(0, 10); // ✅ Top 10 by frequency
}

export async function getMostUsedUserPreference(): Promise<
  { tag: string; count: number }[]
> {
  const postQuery = firestore.collection("posts").orderBy("created", "desc");
  const snap = await postQuery.get();

  const tagFrequency: Record<string, number> = {};

  const posts: Post[] = snap.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
      tags: Array.isArray(data.tags)
        ? data.tags
        : [],
    } as Post;
  });

  posts.forEach((post) => {
    const preferences = post.user_preference ?? [];

    preferences.forEach((tag) => {
      const normalized = tag.trim().toLowerCase();
      if (normalized) {
        tagFrequency[normalized] = (tagFrequency[normalized] || 0) + 1;
      }
    });
  });

  return Object.entries(tagFrequency)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 10 tags
};

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

export async function getMonthlyEngagement(yearMonth?: string) {
  const result: Record<
    string,
    { createdPost: number; createdItinerary: number; likes: number; comments: number; favorites: number; }
  > = {};

  function getYM(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function isInFilter(date: Date): boolean {
    return !yearMonth || getYM(date) === yearMonth;
  }

  // Posts
  const postSnap = await firestore.collection("posts").get();
  for (const postDoc of postSnap.docs) {
    const postData = postDoc.data();
    const postId = postDoc.id;

    const createdAt = toValidDate(postData.created);
    const ym = createdAt ? getYM(createdAt) : null;

    if (createdAt && isInFilter(createdAt)) {
      if (!result[ym!]) result[ym!] = { createdPost: 0, createdItinerary: 0, likes: 0, comments: 0, favorites: 0 };
      result[ym!].createdPost++;
    }

    const likeSnap = await firestore.collection("posts").doc(postId).collection("likes").get();
    likeSnap.forEach((likeDoc) => {
      const likedAt = toValidDate(likeDoc.data().likedAt);
      const ym = likedAt ? getYM(likedAt) : null;
      if (likedAt && isInFilter(likedAt)) {
        if (!result[ym!]) result[ym!] = { createdPost: 0, createdItinerary: 0, likes: 0, comments: 0, favorites: 0 };
        result[ym!].likes++;
      }
    });


    const commentSnap = await firestore.collection("posts").doc(postId).collection("comments").get();
    commentSnap.forEach((commentDoc) => {
      const commentAt = toValidDate(commentDoc.data().createdAt);
      const ym = commentAt ? getYM(commentAt) : null;
      if (commentAt && isInFilter(commentAt)) {
        if (!result[ym!]) result[ym!] = { createdPost: 0, createdItinerary: 0, likes: 0, comments: 0, favorites: 0 };
        result[ym!].comments++;
      }
    });
  }

  // Itineraries
  const itinSnap = await firestore.collection("itineraries").get();
  for (const itinDoc of itinSnap.docs) {
    const itinData = itinDoc.data();
    const createdAt = toValidDate(itinData.created);
    const ym = createdAt ? getYM(createdAt) : null;

    if (createdAt && isInFilter(createdAt)) {
      if (!result[ym!]) result[ym!] = { createdPost: 0, createdItinerary: 0, likes: 0, comments: 0, favorites: 0 };
      result[ym!].createdItinerary++;
    }

    const favSnap = await firestore.collection("itineraries").doc(itinDoc.id).collection("favorites").get();
    favSnap.forEach((favDoc) => {
      const favoritedAt = toValidDate(favDoc.data().favoritedAt);
      const ym = favoritedAt ? getYM(favoritedAt) : null;
      if (favoritedAt && isInFilter(favoritedAt)) {
        if (!result[ym!]) result[ym!] = { createdPost: 0, createdItinerary: 0, likes: 0, comments: 0, favorites: 0 };
        result[ym!].favorites++;
      }
    });
  }

  // Format result
  const formatted = Object.entries(result).map(([month, stats]) => {
    const totalEngagement =
      stats.createdPost + stats.createdItinerary + stats.likes + stats.comments + stats.favorites;
    return { month, ...stats, totalEngagement };
  });

  if (yearMonth) {
    const found = formatted.find((item) => item.month === yearMonth);
    return (
      found ?? {
        month: yearMonth,
        createdPost: 0,
        createdItinerary: 0,
        likes: 0,
        comments: 0,
        favorites: 0,
        totalEngagement: 0,
      }
    );
  } else {
    return formatted.sort((a, b) => a.month.localeCompare(b.month)); // ascending by month
  }
}