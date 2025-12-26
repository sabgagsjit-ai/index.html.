import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Simulate fetching birthdate from Roblox
    return NextResponse.json({
      success: true,
      birthdate: '2015-01-01',
      accountAge: 'Young Account',
    })
  } catch (error) {
    console.error('[v0] Get birthdate error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
