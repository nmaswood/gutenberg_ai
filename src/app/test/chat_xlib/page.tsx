// app/chat/page.tsx
'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';

export default function Chat() {
    const [userMessage, setUserMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setChatResponse(''); // Clear previous response
        setIsLoading(true);  // Show loading state
    
        const res = await fetch('/test/chat_xlib/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: userMessage,
        });
    
        if (!res.ok) {
            console.error('Error fetching response');
            setIsLoading(false);
            return;
        }
    
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
    
        if (reader) {
            let done = false;
    
            // Loop to read the streaming response chunk by chunk
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
    
                const chunk = decoder.decode(value, { stream: true });
                setChatResponse((prev) => prev + chunk); // Append the new chunk only
            }
        }
    
        setIsLoading(false); // End loading state
    };

    return (
<div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-6 text-center">AI Chat</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            className="w-full p-4 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
        />

        <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-300 ${
                isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500'
            }`}
            disabled={isLoading}
        >
            {isLoading ? 'Loading...' : 'Send'}
        </button>
    </form>

    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-gray-200">Response:</h2>
        <p className="whitespace-pre-wrap text-gray-300">
            {chatResponse || (isLoading ? 'Waiting for response...' : 'No response yet')}
        </p>
    </div>
</div>

    );
}
