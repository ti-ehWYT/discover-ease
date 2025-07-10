"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/countries";
import { analytics } from "../../firebase/client";
import { logEvent } from "firebase/analytics";
export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lowercase query for easier matching
  const lowerQuery = query.toLowerCase();

  // Suggestions filtered by input
  const suggestions = useMemo(() => {
    if (!query) return [];
    return countries
      .filter((c) => c.toLowerCase().includes(lowerQuery))
      .slice(0, 5);
  }, [query, lowerQuery]);

  // Check if input exactly matches a country (case-insensitive)
  const isValidCountry = useMemo(() => {
    return countries.some((c) => c.toLowerCase() === lowerQuery);
  }, [lowerQuery]);

  const handleSelect = (country: string) => {
    setQuery(country);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidCountry) {
      onSearch(query.trim());
      setShowSuggestions(false);
      if (analytics) {
        logEvent(analytics, "searched_country", {
          country: query.trim(),
        });
      }
    }
  };

  const handleResetSearch = () => {
    setShowSuggestions(false);
    onSearch("");
  };
  useEffect(() => {
    if (query.trim() === "") {
      handleResetSearch();
    }
  }, [query]);
  return (
    <div className="relative flex justify-center mt-4 mb-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md items-center gap-2"
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search country..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
              {suggestions.map((country) => (
                <li
                  key={country}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white"
                  onMouseDown={() => handleSelect(country)}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" variant="outline" disabled={!isValidCountry}>
          Search
        </Button>
      </form>
    </div>
  );
}
