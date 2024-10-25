import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('query')?.trim() || '';

  // Validate query
  if (!searchQuery) {
    return NextResponse.json({ error: 'No search query provided' }, { status: 400 });
  }

  try {
    // Check if search query results are cached in the database
    const cachedSearch = await prisma.search.findUnique({
      where: { query: searchQuery },
    });

    if (cachedSearch) {
      // Parse the JSON string to return it as an object
      return NextResponse.json({ results: JSON.parse(cachedSearch.results) });
    }

    // If no cached results, fetch from Gutendex
    const response = await fetch(`https://gutendex.com/books/?search=${searchQuery}`);
    const data = await response.json();

    // Cache the new search results in the database as a JSON string
    await prisma.search.create({
      data: {
        query: searchQuery,
        results: JSON.stringify(data.results), // Stringify the results before saving
      },
    });

    // Return the results from Gutendex
    return NextResponse.json({ results: data.results });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
