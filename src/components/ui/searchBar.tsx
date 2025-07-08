"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <div className="flex justify-center mt-4 mb-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
        <Input
          type="text"
          placeholder="Search any.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>
    </div>
  );
}
