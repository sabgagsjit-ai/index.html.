export async function GET() {
  try {
    return Response.json({
      success: true,
      bypasses: [
        { id: 1, userId: '123456789', timestamp: new Date().toISOString() },
        { id: 2, userId: '987654321', timestamp: new Date().toISOString() },
      ],
    });
  } catch (error) {
    console.error('Recent bypasses error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
