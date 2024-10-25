export async function POST(req:Request) {
    const userMessage = await req.text(); // Get user message from request
    console.log(userMessage)
    try {
        const response = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LLM_API_KEY}`, // Your API key
            },
            body: JSON.stringify({
                stream: true,
                model: process.env.LLM_MODEL,
                messages: [
                    { role: 'system', content: "You are a helpful assistant" },
                    { role: 'user', content: userMessage }
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({ error: 'API Error', details: errorText }), { status: response.status });
        }

        // Pipe the response directly to the client
        return new Response(response.body, {
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
