function looseJsonParse(obj) {
  return eval?.(`"use strict";(${obj})`);
}

function executeUserCode(code) {
  let logs = [];
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    logs.push(args.join(' '));
  };

  try {
    // Wrap code in a function to capture return value
    const wrappedCode = `
      (function() {
        ${code}
      })()
    `;

    const result = looseJsonParse(wrappedCode);
    return { logs, result };
  } catch (error) {
    return { logs, error: error.message };
  } finally {
    console.log = originalConsoleLog; // Restore original console.log
  }
}

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

    const results = codeArray.map(executeUserCode);

    return new Response(JSON.stringify({ results }), {
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