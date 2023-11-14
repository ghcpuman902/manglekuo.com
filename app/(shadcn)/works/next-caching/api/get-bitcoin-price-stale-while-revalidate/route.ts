export const revalidate = 10

export async function GET() {
  // Wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Randomly generate a Bitcoin price (let's say between 30000 and 60000 for this example)
  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  // Generate the current timestamp as a string
  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  });
}