import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      },
    )

    console.log("[v0] Fetching recent bypasses from database...")

    const { data, error } = await supabase
      .from("recent_bypasses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("[v0] Error fetching recent bypasses:", error)
      return NextResponse.json({ bypasses: [] })
    }

    console.log("[v0] Fetched bypasses from database:", data?.length || 0, "records")

    const bypasses = (data || []).map((bypass) => ({
      username: bypass.username,
      displayName: bypass.display_name || bypass.username,
      avatarUrl: bypass.avatar_url,
      timestamp: bypass.created_at,
    }))

    return NextResponse.json({ bypasses })
  } catch (error) {
    console.error("[v0] Error in GET recent-bypasses:", error)
    return NextResponse.json({ bypasses: [] })
  }
}

export async function POST(request: Request) {
  try {
    const { username, displayName, avatarUrl, timestamp, age } = await request.json()
    console.log("[v0] Inserting bypass for user:", username, "with age:", age)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      },
    )

    const insertData = {
      username,
      display_name: displayName || username,
      avatar_url: avatarUrl,
      age: age || 2014,
      created_at: timestamp || new Date().toISOString(),
    }

    console.log("[v0] Attempting to insert:", insertData)

    const { data, error } = await supabase.from("recent_bypasses").insert(insertData).select()

    if (error) {
      console.error("[v0] Error inserting bypass:", error)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to add bypass", details: error }, { status: 500 })
    }

    console.log("[v0] Successfully inserted bypass:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error adding bypass:", error)
    return NextResponse.json({ error: "Failed to add bypass" }, { status: 500 })
  }
}
