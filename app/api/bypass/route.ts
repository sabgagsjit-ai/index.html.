export async function POST(request: Request) {
  try {
    const { cookie, password } = await request.json();

    if (!cookie || !password) {
      return new Response(
        JSON.stringify({ error: 'Cookie and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simulate bypass process
    const userId = Math.random().toString(36).substring(7);

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        message: 'Age bypass executed successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
