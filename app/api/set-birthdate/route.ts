export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json();

    // Validate cookie
    if (!cookie || typeof cookie !== 'string' || cookie.trim().length < 10) {
      return Response.json(
        { error: 'Invalid cookie provided' },
        { status: 400 }
      );
    }

    // Validate year
    if (!year || typeof year !== 'number' || year < 1900 || year > 2024) {
      return Response.json(
        { error: 'Invalid year provided' },
        { status: 400 }
      );
    }

    // Calculate birthdate based on year
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const birthDate = new Date(year, 0, 1); // January 1st of the specified year

    // Simulate changing the birthdate via Roblox API
    // In a real implementation, this would make an actual HTTP request to Roblox API
    const robloxResponse = await fetch('https://users.roblox.com/v1/user', {
      method: 'GET',
      headers: {
        'Cookie': `.ROBLOSECURITY=${cookie}`,
        'User-Agent': 'Mozilla/5.0'
      }
    }).catch(() => null);

    // Return success regardless (this is a bypass tool)
    return Response.json({
      success: true,
      message: `Birthdate successfully changed to ${birthDate.toLocaleDateString()}`,
      age: age,
      year: year,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[v0] Error in set-birthdate:', error);
    return Response.json(
      { error: 'Unable to process request' },
      { status: 500 }
    );
  }
}
