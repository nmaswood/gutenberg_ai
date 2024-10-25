import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bookId: string | null = searchParams.get('bookId');

    if (!bookId) {
        return new Response('Book ID is required', { status: 400 });
    }

    try {
        // Check if the book exists in the database using the bookId
        const existingBook = await prisma.book.findUnique({
            where: { id: parseInt(bookId) },
        });

        // Return existing book data if found
        if (existingBook) {
            return new Response(JSON.stringify(existingBook), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Fetch metadata from Gutendex
        const metadataResponse: Response = await fetch(`https://gutendex.com/books/?ids=${bookId}`);
        const metadataData: MetadataResponse = await metadataResponse.json();

        if (metadataData.count === 0) {
            return new Response('No book found with the given ID', { status: 404 });
        }

        const book: Book = metadataData.results[0];
        const textUrl: string | undefined = book.formats['text/plain; charset=utf-8'] || book.formats['text/plain; charset=us-ascii'];

        if (!textUrl) {
            return new Response('Text format not available', { status: 404 });
        }

        // Fetch the book content
        const contentResponse: Response = await fetch(textUrl);
        const contentData: string = await contentResponse.text();

        // Create a directory to save the text file
    /*     const dirPath = path.join('./.tmp/books/', bookId);
        fs.mkdirSync(dirPath, { recursive: true });

        // Save the content to a file if it doesn't already exist
        const textFilePath = path.join(dirPath, 'text.txt');
        if (!fs.existsSync(textFilePath)) {
            fs.writeFileSync(textFilePath, contentData);
        } */

        // Save the book metadata to the database with the provided ID
        const newBook = await prisma.book.create({
            data: {
                id: parseInt(bookId), // Use the ID provided by the user
                title: book.title,
                authors: book.authors.map((author) => author.name).join(', '),
                subjects: book.subjects.join(', '),
                bookshelves: book.bookshelves.join(', '),
                languages: book.languages.join(', '),
                mediaType: book.media_type,
                downloadCount: book.download_count,
                //textPath: textFilePath,
                textContent: contentData,
            },
        });

        // Return the new book data as a JSON response
        return new Response(JSON.stringify(newBook), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching book data:', error);
        return new Response('Error fetching book data', { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// Define types for the metadata response
interface MetadataResponse {
    count: number;
    results: Book[];
}

interface Book {
    id: number;
    title: string;
    authors: Author[];
    subjects: string[];
    bookshelves: string[];
    languages: string[];
    media_type: string;
    download_count: number;
    formats: {
        [key: string]: string; // This allows for dynamic keys in the formats object
    };
}

interface Author {
    name: string;
    // Add other author properties if needed
}
