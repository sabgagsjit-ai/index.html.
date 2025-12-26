export async function GET() {
  try {
    return Response.json({
      bypasses: [
        {
          id: 1,
          status: 'success',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          year: 2016
        },
        {
          id: 2,
          status: 'success',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          year: 2015
        },
        {
          id: 3,
          status: 'success',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          year: 2014
        }
      ]
    });
  } catch (error) {
    console.error('[v0] Error in recent-bypasses:', error);
    return Response.json(
      { error: 'Unable to fetch bypasses' },
      { status: 500 }
    );
  }
}
