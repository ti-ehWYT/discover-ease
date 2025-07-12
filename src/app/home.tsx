"use client";

import { useState } from "react";
import { Post } from "../../type/post";
import PostDialog from "@/components/post-dialog";
import SearchBar from "@/components/search-bar";
import { incrementCountrySearch } from "../../data/trend";


export default function HomePage({ initialPosts }: { initialPosts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const handleSearch = async (query: string) => {
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

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
        {filteredPosts.map((item) => (
          <div key={item.id} className="mb-4 break-inside-avoid">
            <PostDialog postItem={item} allowEdit={false} />
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
            No revelant posts found.
          </div>
        )}
      </div>
    </>
  );
}
