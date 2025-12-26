export async function GET() {
  try {
    return Response.json({
      success: true,
      bypasses: [
        {
          id: 1,
          method: 'parental_controls',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'success'
        },
        {
          id: 2,
          method: 'manual_birthdate',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'success'
        }
      ]
    })
  } catch (error) {
    console.error('Recent bypasses error:', error)
    return Response.json(
      { error: 'Failed to fetch recent bypasses' },
      { status: 500 }
    )
  }
}
