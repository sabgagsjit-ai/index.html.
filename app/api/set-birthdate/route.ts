export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json();

    if (!cookie || !year) {
      return Response.json(
        { error: 'Cookie and year are required' },
        { status: 400 }
      );
    }

    // Simulate birthdate change
    return Response.json({
      success: true,
      message: `Birthdate changed to January 1, ${year}`,
      birthdate: `01/01/${year}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to change birthdate' },
      { status: 500 }
    );
  }
}
