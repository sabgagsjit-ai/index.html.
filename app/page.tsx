'use client';

import { useState } from 'react';

export default function Page() {
  const [cookie, setCookie] = useState('');
  const [year, setYear] = useState('2016');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangeBirthdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

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
      setMessage(`✓ Success! Birthdate changed to ${data.birthdate}`);
      setCookie('');
    } catch (err) {
      setError(`✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">AgeTool</h1>
        
        <form onSubmit={handleChangeBirthdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cookie
            </label>
            <input
              type="text"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="Enter your cookie"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Birth Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2016"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded transition"
          >
            {loading ? 'Processing...' : 'Change Birthdate'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 bg-green-900 text-green-200 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900 text-red-200 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
