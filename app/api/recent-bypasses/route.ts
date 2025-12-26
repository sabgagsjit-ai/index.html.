export async function GET() {
  try {
    return Response.json({
      success: true,
      bypasses: [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          status: 'success',
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching bypasses:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch bypasses' },
      { status: 500 }
    );
  }
}
