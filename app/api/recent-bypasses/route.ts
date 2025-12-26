import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return mock data for recent bypasses
    const bypasses = [
      {
        username: 'User1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        username: 'User2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      bypasses,
    })
  } catch (error) {
    console.error('[v0] Recent bypasses error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', bypasses: [] },
      { status: 500 }
    )
  }
}
