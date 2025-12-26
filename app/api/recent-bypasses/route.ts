export async function GET() {
  try {
    console.log("[v0] Fetching recent bypasses")
    
    // Return empty bypasses list - in production, this would query a database
    // For now, we'll return a static response
    return Response.json({
      bypasses: [],
      message: "No recent bypasses",
    })
  } catch (error) {
    console.error("[v0] Error fetching bypasses:", error)
    return Response.json(
      {
        bypasses: [],
        error: "Failed to fetch bypasses",
      },
      { status: 500 },
    )
  }
}
