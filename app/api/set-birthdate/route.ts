export async function POST(request: Request) {
  try {
    const { cookie, year } = await request.json()

    // Validate input
    if (!cookie || !cookie.trim()) {
      return Response.json(
        { error: 'Cookie is required' },
        { status: 400 }
      )
    }

    if (!year || year < 1900 || year > new Date().getFullYear()) {
      return Response.json(
        { error: 'Invalid year' },
        { status: 400 }
      )
    }

    // Simulate Roblox API call to change birthdate
    // In a real implementation, this would make an actual API call to Roblox
    const randomMonth = Math.floor(Math.random() * 12) + 1
    const randomDay = Math.floor(Math.random() * 28) + 1
    const newBirthdate = `${year}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`

    return Response.json(
      {
        success: true,
        message: `Birthdate changed successfully to ${year}`,
        newBirthdate: newBirthdate
      },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
