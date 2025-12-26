export async function GET() {
  try {
    return Response.json(
      {
        bypasses: [
          { id: 1, userId: 123456789, timestamp: new Date().toISOString() },
          { id: 2, userId: 987654321, timestamp: new Date().toISOString() },
          { id: 3, userId: 555555555, timestamp: new Date().toISOString() }
        ]
      },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch bypasses' },
      { status: 500 }
    )
  }
}
