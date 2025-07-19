"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Post } from "../../type/post";
import PostDialog from "@/components/post-dialog";
import SearchBar from "@/components/search-bar";
import { incrementCountrySearch } from "../../data/trend";
import Masonry from "react-masonry-css";

export default function HomePage({
  initialPosts,
  searchRanking,
}: {
  initialPosts: Post[];
  searchRanking: { country: string; count: number }[];
}) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Reset search on route change
    setFilteredPosts(initialPosts);
    setQuery("");
  }, [pathname, initialPosts]);

  const handleSearch = async (query: string) => {
    setQuery(query);
    if (!query) {
      setFilteredPosts(initialPosts);
      return;
    }
    await incrementCountrySearch(query.trim());
    const lowerQuery = query.toLowerCase();

    const results = initialPosts.filter((post) =>
      post.country.toLowerCase().includes(lowerQuery)
    );

    setFilteredPosts(results);
  };

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center px-4 gap-4">
        <div className="flex-1 items-center">
          <SearchBar onSearch={handleSearch} value={query} setValue={setQuery}/>
        </div>

        <div className="flex flex-1 items-center gap-4 bg-white mb-2">
          <h3 className="font-semibold text-gray-700 whitespace-nowrap">
            People are Searching:
          </h3>
          <div className="flex gap-3">
            {searchRanking.map((item, index) => (
              <div
                key={item.country}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm"
              >
                {index + 1}. {item.country}
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No relevant posts found.
        </div>
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