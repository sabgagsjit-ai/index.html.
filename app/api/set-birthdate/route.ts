import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { cookie, year } = await request.json();

    if (!cookie || !year) {
      return NextResponse.json(
        { success: false, error: 'Cookie and year are required' },
        { status: 400 }
      );
    }

    if (year < 1950 || year > new Date().getFullYear()) {
      return NextResponse.json(
        { success: false, error: 'Year must be between 1950 and current year' },
        { status: 400 }
      );
    }

    // Simulate successful birthdate change
    return NextResponse.json({
      success: true,
      message: `Birthdate set to January 1, ${year}`,
      year,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
