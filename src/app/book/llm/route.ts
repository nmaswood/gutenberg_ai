export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const bookTitle: string | null = searchParams.get('bookTitle');
    const userPrompt: string | null = searchParams.get('userMessage');
    const userMessage = `${userPrompt} ${bookTitle}`; // Define a default prompt

    try {
        const response = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LLM_API_KEY}`, // Replace with your actual API key
            },
            body: JSON.stringify({
                stream: false,
                model: process.env.LLM_MODEL, // Model is defined here
                messages: [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant, you will summarize the title given by user, you will have start with Sarj.ai service: "
                    },
                    { role: 'user', content: userMessage }], // Send the default prompt
            }),
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorText = await response.text(); // Read the error response
            console.error('Error response from API:', errorText);
            return new Response(JSON.stringify({ error: 'API Error', details: errorText }), { status: response.status });
        }

        // Read the response body as JSON
        const responeJson = await response.json();
        console.log(JSON.stringify(responeJson))

        // Return the response data
        return new Response(JSON.stringify(responeJson), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

