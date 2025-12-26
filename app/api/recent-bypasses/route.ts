export async function GET(request: Request) {
  try {
    return Response.json({
      success: true,
      bypasses: [
        {
          id: '1',
          userId: 'user123',
          timestamp: new Date().toISOString(),
          status: 'success',
        },
      ],
    });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
