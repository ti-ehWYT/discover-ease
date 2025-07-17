"use server";

import { getTagsForMonth } from "../../../data/dashboard";
export async function fetchMostUsedTagByMonth(yearMonth?: string) {
  const data = await getTagsForMonth(yearMonth);
  return data;
}
