'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown'

// Define the Message interface for type safety
interface Message {
    role: 'assistant' | 'user'; // Added 'user' role
    content: string;
}
const markdown = '# Hi, *Pluto*!'

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]); // State to hold chat messages
    const [userInput, setUserInput] = useState<string>(''); // State for user input

    // Function to fetch the assistant's response
    const fetchResponse = async (userMessage: string) => {
        const response = await fetch('/test/chat/api', {
            method: 'POST', // Assuming you need to POST the user message
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }), // Send user message to API
        });

        if (!response.ok) {
            console.error('Error fetching response:', response.statusText);
            return;
        }

        const json = await response.json();
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: userMessage }, // Add user message to messages
            { role: 'assistant', content: json.choices[0].message.content }, // Add assistant response
        ]);
        setUserInput(''); // Clear input field after sending
    };

    const handleSend = () => {
        if (userInput.trim()) {
            fetchResponse(userInput); // Fetch response with user input
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 border rounded-lg shadow-lg">
            <h1 className="text-xl font-bold mb-4">Chat</h1>
            <div className="mb-4 h-80 overflow-y-auto border p-2 rounded-lg">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                        <strong>{msg.role}: </strong> 
                      <Markdown children={msg.content}/> 
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-grow border rounded-lg p-2 mr-2 text-black"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
