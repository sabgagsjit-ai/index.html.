export async function POST(request: Request) {
  try {
    const { cookie, password } = await request.json();

    if (!cookie || cookie.trim().length === 0) {
      return Response.json(
        { error: 'invalid cookie provided' },
        { status: 400 }
      );
    }

    if (!password || password.trim().length === 0) {
      return Response.json(
        { error: 'password is required' },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Bypass successful',
        userId: 'USER_' + Math.random().toString(36).substr(2, 9),
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
