"use client";

import { useState } from "react";
import { Post } from "../../type/post";
import PostDialog from "@/components/post-dialog";
import SearchBar from "@/components/search-bar";
import { incrementCountrySearch } from "../../data/trend";
import Masonry from "react-masonry-css";

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

const breakpointColumnsObj = {
  default: 3, // 3 columns normally
  1024: 2,    // 2 columns at <= 1024px width
  640: 1,     // 1 column at <= 640px width (mobile)
};

  return (
    <>
      <SearchBar onSearch={handleSearch} />
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