import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      bypasses: [
        {
          id: '1',
          date: new Date().toISOString(),
          status: 'Success'
        }
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bypasses' },
      { status: 500 }
    );
  }
}
