import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { cookie, password } = await request.json();

    if (!cookie || !password) {
      return NextResponse.json(
        { success: false, error: 'Cookie and password are required' },
        { status: 400 }
      );
    }

    // Simulate successful bypass
    const userId = Math.random().toString(36).substring(7);
    
    return NextResponse.json({
      success: true,
      userId,
      message: 'Age verification bypassed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
