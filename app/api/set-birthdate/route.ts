import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { cookie, year } = await request.json();

    if (!cookie || !year) {
      return NextResponse.json(
        { error: 'Cookie and year are required' },
        { status: 400 }
      );
    }

    // Simulate changing birthdate through cookie manipulation
    const birthdate = `01/01/${year}`;
    
    return NextResponse.json({
      success: true,
      message: `Birthdate changed to ${birthdate}`,
      birthdate: birthdate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
