export const revalidate = 20

export async function GET() {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait

  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  });
}