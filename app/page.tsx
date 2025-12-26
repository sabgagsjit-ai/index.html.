'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Page() {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [year, setYear] = useState('2015');
  const [birthdateLoading, setBirthdateLoading] = useState(false);
  const [birthdateMessage, setBirthdateMessage] = useState('');
  const [birthdatMessageType, setBirthdateMessageType] = useState<'success' | 'error'>('success');
  const [recentBypasses, setRecentBypasses] = useState<any[]>([]);

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookie || !password) {
      setMessageType('error');
      setMessage('Please fill in both fields');
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
      setMessageType('success');
      setMessage(`Bypass successful! User ID: ${data.userId}`);
      setCookie('');
      setPassword('');
    } catch (error) {
      setMessageType('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBirthdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookie) {
      setBirthdateMessageType('error');
      setBirthdateMessage('Please enter your cookie');
      return;
    }

    setBirthdateLoading(true);
    setBirthdateMessage('');
    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year: parseInt(year) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBirthdateMessageType('success');
      setBirthdateMessage(`Birthdate set to ${year}!`);
    } catch (error) {
      setBirthdateMessageType('error');
      setBirthdateMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setBirthdateLoading(false);
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
      console.error('Error fetching recent bypasses:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">AgeTool</CardTitle>
            <CardDescription>Age verification management system</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bypass" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bypass">Execute Bypass</TabsTrigger>
                <TabsTrigger value="birthdate">Change Birthdate</TabsTrigger>
              </TabsList>

              <TabsContent value="bypass" className="space-y-4">
                <form onSubmit={handleBypass} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-200">Cookie</label>
                    <Input
                      type="text"
                      placeholder="Enter your cookie"
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Processing...' : 'Execute Bypass'}
                  </Button>
                </form>

                {message && (
                  <Alert
                    className={
                      messageType === 'success'
                        ? 'bg-green-900 border-green-700'
                        : 'bg-red-900 border-red-700'
                    }
                  >
                    <AlertDescription
                      className={messageType === 'success' ? 'text-green-200' : 'text-red-200'}
                    >
                      {message}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="birthdate" className="space-y-4">
                <form onSubmit={handleSetBirthdate} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-200">Cookie</label>
                    <Input
                      type="text"
                      placeholder="Enter your cookie"
                      value={cookie}
                      onChange={(e) => setCookie(e.target.value)}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      disabled={birthdateLoading}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-200">Birth Year</label>
                    <Input
                      type="number"
                      placeholder="2015"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      disabled={birthdateLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={birthdateLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {birthdateLoading ? 'Processing...' : 'Set Birthdate to 2015'}
                  </Button>
                </form>

                {birthdateMessage && (
                  <Alert
                    className={
                      birthdatMessageType === 'success'
                        ? 'bg-green-900 border-green-700'
                        : 'bg-red-900 border-red-700'
                    }
                  >
                    <AlertDescription
                      className={birthdatMessageType === 'success' ? 'text-green-200' : 'text-red-200'}
                    >
                      {birthdateMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
