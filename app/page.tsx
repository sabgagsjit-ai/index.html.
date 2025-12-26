'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('2015');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [recentBypasses, setRecentBypasses] = useState<any[]>([]);

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, password }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setMessage(data.message || 'Bypass executed successfully!');
      fetchRecentBypasses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdateChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setMessage(data.message || `Birthdate set to ${year} successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBypasses = async () => {
    try {
      const response = await fetch('/api/recent-bypasses', { method: 'GET' });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRecentBypasses(data.bypasses || []);
    } catch (err) {
      console.error('Failed to fetch recent bypasses:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">AgeTool</h1>
          <p className="text-slate-300">Account age management tool</p>
        </div>

        <Tabs defaultValue="bypass" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bypass">Execute Bypass</TabsTrigger>
            <TabsTrigger value="birthdate">Change Birthdate</TabsTrigger>
          </TabsList>

          <TabsContent value="bypass">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Execute Age Bypass</CardTitle>
                <CardDescription className="text-slate-400">Enter your credentials to execute the bypass</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBypass} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Cookie</label>
                    <Input
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      placeholder="Enter your cookie"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading || !cookie || !password}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Processing...' : 'Execute Bypass'}
                  </Button>
                </form>

                {message && <div className="mt-4 p-3 bg-green-900 text-green-200 rounded">{message}</div>}
                {error && <div className="mt-4 p-3 bg-red-900 text-red-200 rounded">{error}</div>}

                {recentBypasses.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-3">Recent Bypasses</h3>
                    <div className="space-y-2">
                      {recentBypasses.map((bypass) => (
                        <div key={bypass.id} className="p-2 bg-slate-700 rounded text-slate-200 text-sm">
                          <p>ID: {bypass.userId}</p>
                          <p>Status: {bypass.success ? 'Success' : 'Failed'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="birthdate">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Change Birthdate</CardTitle>
                <CardDescription className="text-slate-400">Set your account birthdate to 2015</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBirthdateChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Cookie</label>
                    <Input
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      placeholder="Enter your cookie"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Birth Year</label>
                    <Input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2015"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading || !cookie}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Processing...' : 'Change Birthdate'}
                  </Button>
                </form>

                {message && <div className="mt-4 p-3 bg-green-900 text-green-200 rounded">{message}</div>}
                {error && <div className="mt-4 p-3 bg-red-900 text-red-200 rounded">{error}</div>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
