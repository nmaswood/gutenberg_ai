import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

interface BookPageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  // asynchronous access of `params.id`.
  const { id } = await params;

  const res = await fetch(`https://gutendex.com/books/${id}`);
  const book = await res.json();

  if (!book || book.detail === 'Not found') {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-4">{book.title}</h2>
        <p className="mb-2"><strong>Author:</strong> {book.authors[0]?.name || 'Unknown'}</p>
        <p className="mb-2"><strong>Subjects:</strong> {book.subjects.length > 0 ? book.subjects.join(', ') : 'No subjects listed'}</p>
        <p className="mb-2"><strong>Languages:</strong> {book.languages.join(', ')}</p>
        <p className="mb-4"><strong>Download Count:</strong> {book.download_count}</p>

        <h3 className="text-2xl font-semibold mb-3">Download Links:</h3>
        <ul className="space-y-2">
          {Object.entries(book.formats).map(([format, link]) => (
            <li key={format}>
              <Link href={link as string} target="_blank" className="text-blue-500 hover:text-blue-400 transition-colors">
                {format}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
