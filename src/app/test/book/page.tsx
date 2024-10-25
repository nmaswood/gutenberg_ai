// app/page.tsx
'use client'
import { useState } from 'react';

interface Metadata {
  id: string;
  title: string;
  authors: { name: string }[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  download_count: number;
}

interface State {
  bookId: string;
  content: string;
  metadata: Metadata | null;
}

export default function Book() {
  const [state, setState] = useState<State>({
    bookId: '',
    content: '',
    metadata: null,
  });

  const fetchBookData = async () => {
    try {
      // Fetch content and metadata from the combined API route
      const response = await fetch(`/test/book/api?bookId=${state.bookId}`);
      const data = await response.json();

      // Update state with the new values
      setState((prevState) => ({
        ...prevState,
        content: data.content,
        metadata: data.metadata,
      }));
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      bookId: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Gutenberg Book Fetcher</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={state.bookId}
          onChange={handleInputChange}
          placeholder="Enter Book ID"
          className="border border-gray-600 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
        />
        <button
          onClick={fetchBookData}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          Fetch Book
        </button>
      </div>

      {state.metadata && (
        <div className="bg-gray-900 shadow-md rounded-lg p-4 mb-4 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Metadata</h2>
          <p><strong>ID:</strong> {state.metadata.id}</p>
          <p><strong>Title:</strong> {state.metadata.title}</p>
          <p><strong>Authors:</strong> {state.metadata.authors.map(author => author.name).join(', ')}</p>
          <p><strong>Subjects:</strong> {state.metadata.subjects.join(', ')}</p>
          <p><strong>Bookshelves:</strong> {state.metadata.bookshelves.join(', ')}</p>
          <p><strong>Languages:</strong> {state.metadata.languages.join(', ')}</p>
          <p><strong>Download Count:</strong> {state.metadata.download_count}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Content</h2>
      <pre className="bg-gray-900 shadow-md rounded-lg p-4 w-full max-w-md overflow-auto">{state.content}</pre>
    </div>
  );
}
