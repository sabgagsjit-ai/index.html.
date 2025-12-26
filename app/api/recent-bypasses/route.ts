export async function GET() {
  return Response.json(
    {
      success: true,
      bypasses: [
        {
          id: 1,
          userId: 'user_123',
          timestamp: new Date().toISOString(),
          status: 'success'
        },
        {
          id: 2,
          userId: 'user_456',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'success'
        }
      ]
    },
    { status: 200 }
  );
}
