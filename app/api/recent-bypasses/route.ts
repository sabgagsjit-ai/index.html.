export async function GET() {
  try {
    // Return mock recent bypasses data
    return Response.json({
      success: true,
      bypasses: [
        {
          id: 1,
          userId: 'user_abc123',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 2,
          userId: 'user_def456',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 3,
          userId: 'user_ghi789',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
      ],
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch recent bypasses' },
      { status: 500 }
    );
  }
}
