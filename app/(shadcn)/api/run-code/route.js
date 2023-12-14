import safeEval from 'safe-eval';

export async function POST(request) {
  if (!request.headers.has('x-api-key')) {
    return new Response(JSON.stringify({ message: 'API Key required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const MY_API_KEY = 'your-randomly-generated-api-key'; // Replace with your API key
  const apiKey = request.headers.get('x-api-key');

  if (apiKey !== MY_API_KEY) {
    return new Response(JSON.stringify({ message: 'Invalid API Key' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { codeArray } = body;

    const results = codeArray.map(code => {
      try {
        // Execute code safely
        return safeEval(code);
      } catch (error) {
        return error.message;
      }
    });
    if(results && results.length > 0){

      return new Response(JSON.stringify({ results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    }

    return new Response(JSON.stringify({results: []}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Bad Request', error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
