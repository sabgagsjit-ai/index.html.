export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json();

    if (!cookie || typeof cookie !== 'string' || cookie.trim().length === 0) {
      return Response.json(
        { error: 'invalid cookie provided' },
        { status: 400 }
      );
    }

    if (!cookie.includes('=') || cookie.length < 10) {
      return Response.json(
        { error: 'invalid cookie provided' },
        { status: 400 }
      );
    }

    const birthdateYear = year || 2016;
    const birthdate = `01/01/${birthdateYear}`;

    // Simulate successful birthdate change
    return Response.json(
      {
        success: true,
        message: 'Birthdate successfully changed',
        birthdate: birthdate,
        userId: 'user_' + Math.random().toString(36).substr(2, 9)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'invalid cookie provided' },
      { status: 400 }
    );
  }
}
