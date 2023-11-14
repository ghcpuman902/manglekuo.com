export async function GET() {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait

  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}