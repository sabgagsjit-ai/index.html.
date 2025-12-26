export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cookie, year } = body;

    if (!cookie || !year) {
      return Response.json(
        { error: 'Cookie and year are required' },
        { status: 400 }
      );
    }

    // Simulate birthdate change through cookie
    const birthdate = `01/01/${year}`;
    
    return Response.json({
      success: true,
      birthdate,
      year,
      message: `Birthdate successfully changed to ${birthdate}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to change birthdate' },
      { status: 500 }
    );
  }
}
