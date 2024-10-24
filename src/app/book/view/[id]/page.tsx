
import React from 'react';
import { ViewBox } from './viewbox';

interface BookPageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } =await  params;

  // Make a POST request to fetch book details
  const res = await fetch(`${process.env.NEXT_URL}/book/api?bookId=${id}`);

  const book = await res.json();
  // console.log(book)
 

  return (
    <div className="min-h-screen  bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-4">{book.title}</h2>
        <p className="mb-2"><strong>Author:</strong> {book.authors || 'Unknown'}</p>
        <p className="mb-2"><strong>Languages:</strong> {book.languages}</p>
        <p className="mb-2"><strong>Subjects:</strong> {book.subjects.length > 0 ? book.subjects : 'No subjects listed'}</p>
        <p className="mb-4"><strong>Bookshelves:</strong> {book.bookshelves}</p>
        <p className="mb-4"><strong>Download Count:</strong> {book.downloadCount}</p>

  

        {/* Box to display book content or summary */}
        <ViewBox book={book} />
      </div>
    </div>
  );
}

