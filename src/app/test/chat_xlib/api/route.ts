// app/api/chat/route.ts
import { OpenAI } from 'openai';

export async function POST(req: Request) {
    const userMessage = await req.text(); // Get user message from request
    const client = new OpenAI({
        apiKey: process.env.LLM_API_KEY,
        baseURL: process.env.LLM_BASE_URL ,
    });

    try {
        const stream = client.beta.chat.completions.stream({
            model: process.env.LLM_MODEL!,
            messages: [
                { role: 'system', content: 'You are a helpful assistant' },
                { role: 'user', content: userMessage } // Use dynamic user message
            ],
            stream: true,
        });

        const encoder = new TextEncoder();
        const streamResponse = new ReadableStream({
            async start(controller) {
                stream.on('content', (delta) => {
                    const chunk = encoder.encode(delta);
                    controller.enqueue(chunk); // Push data to the stream
                });

                stream.on('end', () => {
                    controller.close(); // Close the stream when complete
                });

                stream.on('error', (error) => {
                    console.error('Stream error:', error);
                    controller.error('Stream failed'); // Handle stream errors
                });
            }
        });

        return new Response(streamResponse, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
