'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  const [bypassCookie, setBypassCookie] = useState('');
  const [bypassPassword, setBypassPassword] = useState('');
  const [bypassLoading, setBypassLoading] = useState(false);
  const [bypassMessage, setBypassMessage] = useState('');
  const [bypassError, setBypassError] = useState('');
  const [recentBypasses, setRecentBypasses] = useState<any[]>([]);

  const [birthdateCookie, setBirthdateCookie] = useState('');
  const [birthdateYear, setBirthdateYear] = useState('2015');
  const [birthdateLoading, setBirthdateLoading] = useState(false);
  const [birthdateMessage, setBirthdateMessage] = useState('');
  const [birthdateError, setBirthdateError] = useState('');

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    setBypassLoading(true);
    setBypassMessage('');
    setBypassError('');

    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: bypassCookie, password: bypassPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute bypass');
      }

      const data = await response.json();
      setBypassMessage(`Success! User ID: ${data.userId}`);
      
      // Fetch recent bypasses
      const recentRes = await fetch('/api/recent-bypasses');
      if (recentRes.ok) {
        const recentData = await recentRes.json();
        setRecentBypasses(recentData.bypasses || []);
      }
    } catch (error) {
      setBypassError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setBypassLoading(false);
    }
  };

  const handleBirthdateChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setBirthdateLoading(true);
    setBirthdateMessage('');
    setBirthdateError('');

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: birthdateCookie, year: parseInt(birthdateYear) }),
      });

      if (!response.ok) {
        throw new Error('Failed to change birthdate');
      }

      const data = await response.json();
      setBirthdateMessage(`Birthdate successfully changed to ${birthdateYear}!`);
    } catch (error) {
      setBirthdateError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setBirthdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AgeTool</h1>
          <p className="text-slate-400">Manage account age and bypass verification</p>
        </div>

        <Tabs defaultValue="bypass" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="bypass" className="text-white">Execute Bypass</TabsTrigger>
            <TabsTrigger value="birthdate" className="text-white">Change Birthdate</TabsTrigger>
          </TabsList>

          <TabsContent value="bypass" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Execute Bypass</CardTitle>
                <CardDescription>Enter your credentials to execute the bypass</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBypass} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cookie</label>
                    <Input
                      type="password"
                      placeholder="Enter your cookie"
                      value={bypassCookie}
                      onChange={(e) => setBypassCookie(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={bypassPassword}
                      onChange={(e) => setBypassPassword(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={bypassLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {bypassLoading ? 'Executing...' : 'Execute Bypass'}
                  </Button>
                </form>

                {bypassMessage && (
                  <div className="mt-4 p-3 bg-green-900 border border-green-700 rounded text-green-200">
                    {bypassMessage}
                  </div>
                )}
                {bypassError && (
                  <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">
                    Error: {bypassError}
                  </div>
                )}

                {recentBypasses.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-3">Recent Bypasses</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {recentBypasses.map((bypass: any, idx: number) => (
                        <div key={idx} className="p-2 bg-slate-700 rounded text-slate-300 text-sm">
                          <div>ID: {bypass.userId}</div>
                          <div className="text-xs text-slate-500">{bypass.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="birthdate" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Change Birthdate</CardTitle>
                <CardDescription>Set your account birthdate to 2015</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBirthdateChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cookie</label>
                    <Input
                      type="password"
                      placeholder="Enter your cookie"
                      value={birthdateCookie}
                      onChange={(e) => setBirthdateCookie(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Birth Year</label>
                    <Input
                      type="number"
                      placeholder="2015"
                      value={birthdateYear}
                      onChange={(e) => setBirthdateYear(e.target.value)}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={birthdateLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {birthdateLoading ? 'Changing...' : 'Change Birthdate'}
                  </Button>
                </form>

                {birthdateMessage && (
                  <div className="mt-4 p-3 bg-green-900 border border-green-700 rounded text-green-200">
                    {birthdateMessage}
                  </div>
                )}
                {birthdateError && (
                  <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded text-red-200">
                    Error: {birthdateError}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
