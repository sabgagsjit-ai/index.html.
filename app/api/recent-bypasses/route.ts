export async function GET() {
  try {
    // Return mock recent bypasses
    const bypasses = [
      { userId: 'user123', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { userId: 'user456', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { userId: 'user789', timestamp: new Date(Date.now() - 10800000).toISOString() },
    ];

    return Response.json({
      success: true,
      bypasses,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch recent bypasses' },
      { status: 500 }
    );
  }
}
