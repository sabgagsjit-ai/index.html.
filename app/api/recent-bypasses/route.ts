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
    const body = await request.json()
    const { username, displayName, avatarUrl, timestamp, age } = body

    console.log("[v0] POST request received:", { username, age })
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
      username: String(username || "Unknown"),
      display_name: String(displayName || username || "Unknown"),
      avatar_url: String(avatarUrl || ""),
      age: Number(age) || 2014,
      created_at: String(timestamp || new Date().toISOString()),
    }

    console.log("[v0] Attempting to insert:", JSON.stringify(insertData))

    const { data, error } = await supabase.from("recent_bypasses").insert([insertData]).select()

    if (error) {
      console.error("[v0] Supabase error:", error.message)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Full error:", JSON.stringify(error, null, 2))
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[v0] ✅ Successfully inserted bypass record")
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] POST Error:", error?.message || error)
    return NextResponse.json({ success: false, error: error?.message || "Failed to add bypass" }, { status: 500 })
  }
}
