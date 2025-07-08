"use client";

import { useState } from "react";
import { Post } from "../../type/post";
import PostDialog from "@/components/post-dialog";
import SearchBar from "@/components/ui/searchBar";

export default function Search({ initialPosts }: { initialPosts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPosts(initialPosts);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const results = initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description?.toLowerCase().includes(lowerQuery) ||
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
          <div className="text-center w-full col-span-3 text-muted-foreground py-10">
            No revelant posts found.
          </div>
        )}
      </div>
    </>
  );
}
