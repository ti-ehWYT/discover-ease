"use server";

import { getMostUsedTags, getTagsForMonth } from "../../../data/posts";
import { getSearchRanking } from "../../../data/trend";


export async function fetchMostUsedTagAllTime() {
  const data = await getMostUsedTags();
  return data;
}

export async function fetchMostUsedTagByMonth(yearMonth?: string) {
  const data = await getTagsForMonth(yearMonth);
  return data;
}

export async function fetchSearchRanking() {
  const data = await getSearchRanking();
  return data;
}