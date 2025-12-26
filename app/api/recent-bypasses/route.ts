export async function GET(request: Request) {
  try {
    // Return mock recent bypasses data
    const bypasses = [
      { id: 1, userId: 'user123', timestamp: new Date().toISOString(), success: true },
      { id: 2, userId: 'user456', timestamp: new Date().toISOString(), success: true },
      { id: 3, userId: 'user789', timestamp: new Date().toISOString(), success: true },
    ];

    return new Response(
      JSON.stringify({ bypasses }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
