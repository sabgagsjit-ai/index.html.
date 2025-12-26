'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Page() {
  const [cookie, setCookie] = useState('');
  const [year, setYear] = useState('2016');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangeBirthdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const response = await fetch('/api/set-birthdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, year }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(true);
      setMessage(`✓ Success! Birthdate changed to 01/01/${year}`);
      setCookie('');
    } catch (error) {
      setSuccess(false);
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Failed to change birthdate'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">AgeTool</h1>
          <p className="text-slate-400 text-center mb-8">Change Account Birthdate Automatically</p>

          <form onSubmit={handleChangeBirthdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cookie</label>
              <Input
                type="text"
                placeholder="Enter your cookie"
                value={cookie}
                onChange={(e) => setCookie(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Birthdate Year</label>
              <Input
                type="text"
                placeholder="2016"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Processing...' : 'Change Birthdate to 2016'}
            </Button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
              success 
                ? 'bg-green-900 text-green-200 border border-green-700' 
                : 'bg-red-900 text-red-200 border border-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
