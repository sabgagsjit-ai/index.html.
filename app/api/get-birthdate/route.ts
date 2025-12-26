export async function POST(request: Request) {
  try {
    const { cookie } = await request.json()
    console.log("[v0] Received birthdate fetch request")

    if (!cookie || cookie.trim().length < 50) {
      return Response.json(
        {
          error: "Invalid or incomplete cookie.",
          success: false,
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
      console.log("[v0] Fetching current birthdate...")
      const getBirthdateResponse = await fetch("https://accountinformation.roblox.com/v1/birthdate", {
        method: "GET",
        headers: {
          Cookie: formattedCookie,
        },
      })

      console.log("[v0] Get birthdate response status:", getBirthdateResponse.status)

      if (getBirthdateResponse.ok) {
        const birthdateData = await getBirthdateResponse.json()
        console.log("[v0] Current birthdate fetched:", birthdateData)
        return Response.json({
          success: true,
          birthdate: birthdateData,
        })
      } else {
        console.log("[v0] Failed to fetch birthdate, status:", getBirthdateResponse.status)
        return Response.json(
          {
            success: false,
            error: "Failed to fetch current birthdate",
          },
          { status: getBirthdateResponse.status },
        )
      }
    } catch (error) {
      console.error("[v0] Error fetching birthdate:", error)
      return Response.json(
        {
          success: false,
          error: "Failed to fetch birthdate.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Birthdate fetch error:", error)
    return Response.json({ error: "Failed to process request." }, { status: 500 })
  }
}
