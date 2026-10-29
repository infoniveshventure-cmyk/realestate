'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-ivory">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Nivesh Ventures" width={120} height={50} className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-text-dark">Admin Panel</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-text-dark font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-ivory rounded-lg focus:outline-none focus:border-accent"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-text-grey text-sm mt-6">
          Contact your administrator for login credentials.
        </p>
      </div>
    </div>
  );
}
