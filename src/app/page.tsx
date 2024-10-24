// app/page.tsx
'use client'
import Link from 'next/link';


export default function Home() {




  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Gutenberg Book Fetcher</h1>
      <div className="flex space-x-2 mb-4">
      <Link href="/book" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">App</Link>
        <Link href="/test/book" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Book</Link>
        <Link href="/test/chat" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Chat</Link>
        <Link href="/test/chat_stream" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Chat Stream</Link>
        <Link href="/test/chat_xlib" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Chat OpenAI Library</Link>
      </div>
    </div>
  );
}
