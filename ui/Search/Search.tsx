"use client";

import React from "react";

interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search Posts"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="block w-full px-4 py-2 mb-5 border border-gray-300 rounded-full outline-none"
    />
  );
};

export default Search;
