"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();
  
  const handleSearch = async () => {
    const res = await fetch(`https://gutendex.com/books/?search=${query}`);
    const data = await res.json();
    setBooks(data.results);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-10 px-4">
    <h1 className="text-3xl font-bold text-white mb-8">Search for Books</h1>
  
    <div className="w-full max-w-md flex space-x-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter book title or author"
        className="flex-1 px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </div>
  
    {books.length > 0 ? (
      <ul className="w-full max-w-md space-y-4">
        {books.map((book) => (
          <li key={book.id} className="p-4 bg-gray-800 text-white shadow-md rounded-md border border-gray-700">
            <div className="text-lg font-semibold">{book.title}</div>
            <div className="text-sm text-gray-400">
              by {book.authors[0]?.name || "Unknown"} | Language: {book.languages[0]}
            </div>
            <button
              onClick={() => router.push(`/book/${book.id}`)}
              className="mt-2 inline-block px-3 py-1 text-sm bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No books found. Try searching for something else!</p>
    )}
  </div>
  
  );
}
