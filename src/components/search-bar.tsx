"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/countries";
import { analytics } from "../../firebase/client";
import { logEvent } from "firebase/analytics";

export default function SearchBar({
  onSearch,
  value,
  setValue,
}: {
  onSearch: (query: string) => void;
  value: string;
  setValue: (value: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const lowerQuery = value?.trim() ? value.toLowerCase() : "";

  const suggestions = useMemo(() => {
    if (!value) return [];
    return countries
      .filter((c) => c.toLowerCase().includes(lowerQuery))
      .slice(0, 5);
  }, [value, lowerQuery]);

  const isValidCountry = useMemo(() => {
    return countries.some((c) => c.toLowerCase() === lowerQuery);
  }, [lowerQuery]);

  const handleSelect = (country: string) => {
    setValue(country);
    setShowSuggestions(false);
    onSearch(country);
    if (analytics) {
      logEvent(analytics, "searched_country", { country });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidCountry) {
      onSearch(value.trim());
      setShowSuggestions(false);
      if (analytics) {
        logEvent(analytics, "searched_country", {
          country: value.trim(),
        });
      }
    }
  };

  const handleResetSearch = () => {
    setShowSuggestions(false);
    onSearch("");
  };

  useEffect(() => {
    if (value.trim() === "") {
      handleResetSearch();
    }
  }, [value]);

  return (
    <div className="relative flex mt-4 mb-6">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search country..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
              {suggestions.map((country) => (
                <li
                  key={country}
                  className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur before selection
                    handleSelect(country);
                  }}
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