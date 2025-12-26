export async function POST(request: Request) {
  try {
    const { cookie } = await request.json()
    console.log("[v0] Received birthdate change request")

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

    const birthdatePayload = {
      birthMonth: 1,
      birthDay: 1,
      birthYear: 2015,
    }

    try {
      console.log("[v0] Attempting to set birthdate to 2015...")
      const setBirthdateResponse = await fetch("https://accountinformation.roblox.com/v1/birthdate", {
        method: "POST",
        headers: {
          Cookie: formattedCookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(birthdatePayload),
      })

      console.log("[v0] Birthdate response status:", setBirthdateResponse.status)

      if (setBirthdateResponse.ok) {
        console.log("[v0] Successfully set birthdate to 2015")
        return Response.json({
          success: true,
          message: "Birthdate successfully changed to January 1, 2015",
        })
      } else {
        const errorData = await setBirthdateResponse.text()
        console.log("[v0] Failed to set birthdate, status:", setBirthdateResponse.status)
        console.log("[v0] Error response:", errorData)
        return Response.json(
          {
            success: false,
            error: `Failed to set birthdate. Status: ${setBirthdateResponse.status}`,
          },
          { status: setBirthdateResponse.status },
        )
      }
    } catch (error) {
      console.error("[v0] Error setting birthdate:", error)
      return Response.json(
        {
          success: false,
          error: "Failed to set birthdate. Please try again.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Birthdate change error:", error)
    return Response.json({ error: "Failed to process request." }, { status: 500 })
  }
}
