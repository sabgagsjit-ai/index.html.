import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, birthdate } = await request.json()

    if (!userId || !birthdate) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or birthdate' },
        { status: 400 }
      )
    }

    // Simulate updating birthdate on Roblox
    // In a real implementation, this would make an API call to Roblox
    console.log(`[v0] Setting birthdate for user ${userId} to ${birthdate}`)

    return NextResponse.json({
      success: true,
      message: 'Birthdate updated successfully',
    })
  } catch (error) {
    console.error('[v0] Set birthdate error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
