export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json();

    if (!cookie || !year) {
      return Response.json(
        { success: false, error: 'Cookie and year are required' },
        { status: 400 }
      );
    }

    // Simulate birthdate change
    return Response.json({
      success: true,
      year: year,
      message: `Birthdate successfully changed to ${year}`,
    });
  } catch (error) {
    console.error('Birthdate error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
