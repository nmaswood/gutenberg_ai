"use client"
import { Book } from '@prisma/client';
import React, { useState } from 'react'
import Markdown from 'react-markdown';

export const ViewBox = ({ book }:{book:Book}) => {

    // State variables
    const [content, setContent] = useState<string | null>(null);


    // Function to handle reading the book
    const handleReadBook = () => {
        setContent(book.textContent); // Assuming book.textContent contains the text of the book
    }

    // Function to handle summarizing the book
    const handleSummarize = async () => {
        const response = await fetch(`/book/llm?bookTitle=${book.title}?userPrompt="summarize the book"`);
       
        const summaryData = await response.json();
        console.log(summaryData.choices[0].message.content)
        if (summaryData && summaryData.choices[0].message.content) {
            setContent(summaryData.choices[0].message.content); // Assuming the response has a summary field
        }
    };
    // Function to handle summarizing the book
    const handleCharacterAnalysis = async () => {
        const response = await fetch(`/book/llm?bookTitle=${book.title}?userPrompt="analyze characters in this book, only list characters with a short analysis"`);
       
        const summaryData = await response.json();
        console.log(summaryData.choices[0].message.content)
        if (summaryData && summaryData.choices[0].message.content) {
            setContent(summaryData.choices[0].message.content); // Assuming the response has a summary field
        }
    };

    // Function to handle summarizing the book
    const handleBookQuotes = async () => {
        const response = await fetch(`/book/llm?bookTitle=${book.title}?userPrompt="Give some important quotes from this book and the character who says it, don't give summary, only include quotes"`);
       
        const summaryData = await response.json();
        console.log(summaryData.choices[0].message.content)
        if (summaryData && summaryData.choices[0].message.content) {
            setContent(summaryData.choices[0].message.content); // Assuming the response has a summary field
        }
    };
    return (
        <>
            <h3 className="text-2xl font-semibold mb-3">Select option:</h3>
            <div className="space-y-2 mb-4">
                <button   onClick={handleReadBook} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Read Book</button>
                <button  onClick={handleSummarize}  className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Summarize</button>
                <button  onClick={handleCharacterAnalysis}  className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Analyze Characters</button>
                <button  onClick={handleBookQuotes}  className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Interesting Quotes</button>
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Something Else</button>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg max-h-80 overflow-auto">
                {content && <div className="text-lg">
                    <Markdown children={content}/>
                
                    
                    </div>}

            </div>
        </>
    )
}
