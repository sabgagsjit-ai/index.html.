export async function GET() {
  try {
    return Response.json(
      {
        success: true,
        bypasses: [
          {
            id: 1,
            userId: 'USER_abc123',
            timestamp: new Date().toISOString(),
            status: 'success',
          },
          {
            id: 2,
            userId: 'USER_def456',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'success',
          },
          {
            id: 3,
            userId: 'USER_ghi789',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'success',
          },
        ],
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
