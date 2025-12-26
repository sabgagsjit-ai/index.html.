export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json();

    // Validate cookie
    if (!cookie || typeof cookie !== 'string' || cookie.trim().length < 10) {
      return Response.json(
        { success: false, error: 'Invalid cookie provided' },
        { status: 400 }
      );
    }

    // Validate year
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      return Response.json(
        { success: false, error: 'Invalid birth year' },
        { status: 400 }
      );
    }

    // Simulate setting birthdate to the specified year
    // In a real implementation, this would make an API call to Roblox
    const birthDate = new Date(`${year}-01-01`);

    return Response.json({
      success: true,
      message: `Birthdate successfully changed to January 1, ${year}`,
      birthDate: birthDate.toISOString(),
      ageGroup: year >= 2008 ? '16-17' : year >= 2006 ? '18+' : '13+',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
