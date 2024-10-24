export async function POST(req: Request) {
   // const userMessage = "Hello world"; // Define a default prompt
    const userMessage =await req.text(); // Define a default prompt
    try {
        const response  = await fetch('https://api.sambanova.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LLM_API_KEY}`, // Replace with your actual API key
            },
            body: JSON.stringify({
                stream: false,
                model: "Meta-Llama-3.1-8B-Instruct", // Model is defined here
                messages: [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant"
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

