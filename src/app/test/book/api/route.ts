// app/api/book/route.ts

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const bookId: string | null = searchParams.get('bookId');

  if (!bookId) {
      return new Response('Book ID is required', { status: 400 });
  }

  try {
      // Fetch metadata from Gutendex
      const metadataResponse: Response = await fetch(`https://gutendex.com/books/?ids=${bookId}`);
      const metadataData: MetadataResponse = await metadataResponse.json();

      if (metadataData.count === 0) {
          return new Response('No book found with the given ID', { status: 404 });
      }

      const book: Book = metadataData.results[0];

      // Get the URL for the plain text format
      const textUrl: string = book.formats['text/plain; charset=us-ascii'];

      // Fetch the book content
      const contentResponse: Response = await fetch(textUrl);
      const contentData: string = await contentResponse.text();

      // Return both content and metadata as a JSON response
      return new Response(JSON.stringify({
          content: contentData,
          metadata: {
              id: book.id,
              title: book.title,
              authors: book.authors,
              subjects: book.subjects,
              bookshelves: book.bookshelves,
              languages: book.languages,
              media_type: book.media_type,
              download_count: book.download_count,
          },
      }), {
          status: 200,
          headers: {
              'Content-Type': 'application/json',
          },
      });
  } catch (error) {
      return new Response('Error fetching book data', { status: 500 });
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
