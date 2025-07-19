"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Post } from "../../type/post";
import PostDialog from "@/components/post-dialog";
import SearchBar from "@/components/search-bar";
import { incrementCountrySearch } from "../../data/trend";
import Masonry from "react-masonry-css";

type SortOption = "latest" | "topLike" | "topView";

export default function HomePage({
  initialPosts,
  searchRanking,
}: {
  initialPosts: Post[];
  searchRanking: { country: string; count: number }[];
}) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const pathname = usePathname();

  useEffect(() => {
    // Reset on route change
    setQuery("");
    setSortOption("latest");
    setFilteredPosts(initialPosts);
  }, [pathname, initialPosts]);

  const applyFilterAndSort = (query: string, sort: SortOption) => {
    let results = [...initialPosts];

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter((post) =>
        post.country.toLowerCase().includes(lowerQuery)
      );
    }

    switch (sort) {
      case "topLike":
        results.sort((a, b) => b.likeCount! - a.likeCount!);
        break;
      case "topView":
        results.sort((a, b) => b.viewCount! - a.viewCount!);
        break;
      case "latest":
      default:
        results.sort((a, b) => new Date(b.created!).getTime() - new Date(a.created!).getTime());
        break;
    }

    setFilteredPosts(results);
  };

  const handleSearch = async (query: string) => {
    setQuery(query);
    if (query.trim()) {
      await incrementCountrySearch(query.trim());
    }
    applyFilterAndSort(query, sortOption);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as SortOption;
    setSortOption(newSort);
    applyFilterAndSort(query, newSort);
  };

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} value={query} setValue={setQuery} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex gap-3 flex-wrap items-center bg-white">
            <h3 className="font-semibold text-gray-700 whitespace-nowrap">People are Searching:</h3>
            {searchRanking.map((item, index) => (
              <div
                key={item.country}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm"
              >
                {index + 1}. {item.country}
              </div>
            ))}
          </div>

          <select
            value={sortOption}
            onChange={handleSortChange}
            className="ml-2 p-1 border border-gray-300 rounded text-sm"
          >
            <option value="latest">Latest</option>
            <option value="topLike">Top Like</option>
            <option value="topView">Top View</option>
          </select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No relevant posts found.</div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredPosts.map((item) => (
            <PostDialog key={item.id} postItem={item} allowEdit={false} />
          ))}
        </Masonry>
      )}
    </>
  );
}