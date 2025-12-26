export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cookie, year } = body;

    if (!cookie || !year) {
      return Response.json({ error: 'Cookie and year required' }, { status: 400 });
    }

    // Calculate birthdate from year
    const birthdate = new Date(year, 0, 1);
    
    return Response.json({
      success: true,
      birthdate: birthdate.toISOString(),
      year: year,
      message: `Birthdate changed to ${year}`,
    });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
