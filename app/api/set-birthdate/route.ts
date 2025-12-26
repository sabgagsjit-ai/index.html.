export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json();

    if (!cookie || !year) {
      return new Response(
        JSON.stringify({ error: 'Cookie and year are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simulate birthdate change
    const birthdate = `${year}-01-01`;

    return new Response(
      JSON.stringify({
        success: true,
        birthdate,
        message: `Birthdate successfully set to ${year}`,
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
