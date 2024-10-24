'use client';

import React from 'react';
import { useState } from 'react';
import Markdown from 'react-markdown';

// Define the Message interface with an ID
interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
}

// Define a ChatState interface to manage the input and messages in one state object
interface ChatState {
    messages: Message[];
    userInput: string;
}

// Function to handle streaming response from the API
const handleResponseStream = async (
    response: Response,
    setChatState: React.Dispatch<React.SetStateAction<ChatState>>
    ,boxRefCurrent:HTMLElement
) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    if (!reader) return;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop()!; // Keep the last line in the buffer for incomplete chunks

        for (const line of lines) {
            if (line === 'data: [DONE]') return; // End of stream

            const jsonLine = line.replace(/^data: /, '');
            try {
                const parsedData = JSON.parse(jsonLine);
                const content = parsedData.choices[0]?.delta?.content || '';
                const id = parsedData.id || '';

                if (content && id) {
                    setChatState((prevState) => {
                        // Check if message with the same ID already exists
                        const existingMessageIndex = prevState.messages.findIndex(msg => msg.id === id);

                        if (existingMessageIndex !== -1) {
                            // Update the existing message with new content
                            const updatedMessages = [...prevState.messages];
                            updatedMessages[existingMessageIndex].content += content;

                            return {
                                ...prevState,
                                messages: updatedMessages,
                            };
                        } else {
                            // Add new message if it doesn't exist
                            return {
                                ...prevState,
                                messages: [
                                    ...prevState.messages,
                                    { id, role: 'assistant', content },
                                ],
                            };
                        }
                    });
                }

                boxRefCurrent.scroll({top:boxRefCurrent.scrollHeight})

            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        }
    }
};

export default function ChatStream() {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        userInput: '',
    });
    const boxRef= React.useRef<HTMLInputElement>(null)
   
    const handleSendMessage = async () => {
        if (chatState.userInput.trim()) {
            setChatState((prevState) => ({
                ...prevState,
                messages: [
                    ...prevState.messages,
                    { id: Math.random().toString(36).substring(7), role: 'user', content: prevState.userInput }, // Temporary ID for user message
                ],
                userInput: '', // Clear input field
            }));

            const response = await fetch('/test/chat_stream/api', {
                method: 'POST',
                body: chatState.userInput,
            });

            // Call the standalone function to process the response stream
            await handleResponseStream(response, setChatState, boxRef?.current!);
        }
    };




    return (
        <div className="max-w-5xl mx-auto p-4 border rounded-lg shadow-lg">
            <h1 className="text-xl font-bold mb-4">Chat with Assistant</h1>
            <div ref={boxRef} className="mb-4 h-80 overflow-y-auto border p-2 rounded-lg">
                {chatState.messages.map((msg) => (
                    <div key={msg.id} className={`mb-2 p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                        <strong>{msg.role}: </strong>
                        <Markdown children={msg.content} />
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={chatState.userInput}
                    onChange={(e) =>
                        setChatState((prevState) => ({
                            ...prevState,
                            userInput: e.target.value,
                        }))
                    }
                    className="flex-grow border rounded-lg p-2 mr-2 text-black"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
