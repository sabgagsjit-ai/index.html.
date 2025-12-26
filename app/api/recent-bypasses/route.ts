import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return mock recent bypasses data
    const bypasses = [
      { userId: 'user123', timestamp: new Date().toISOString() },
      { userId: 'user456', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];

    return NextResponse.json({
      success: true,
      bypasses,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
