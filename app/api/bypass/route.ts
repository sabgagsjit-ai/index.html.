export async function POST(request: Request) {
  try {
    const { cookie, password } = await request.json();

    if (!cookie || !password) {
      return Response.json(
        { success: false, error: 'Cookie and password are required' },
        { status: 400 }
      );
    }

    // Simulate bypass success
    return Response.json({
      success: true,
      userId: '123456789',
      message: 'Age verification bypassed successfully',
    });
  } catch (error) {
    console.error('Bypass error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
