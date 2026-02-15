'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { FormInput, FormCheckbox } from '@/components/Form';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await userService.signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ntigi Shipping</h1>
          <p className="text-green-100">Professional Courier Management System</p>
        </div>

        <Card className="shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleLogin}>
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <FormCheckbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <Button variant="primary" type="submit" className="w-full" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="flex gap-2 mt-4 text-sm text-gray-600">
            <a href="/auth/signup" className="text-green-600 hover:underline">
              Create account
            </a>
            <span>•</span>
            <a href="/auth/reset" className="text-green-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </Card>

        <p className="text-center text-green-100 text-sm mt-6">
          Demo credentials: admin@ntigi.com / password123
        </p>
      </div>
    </div>
  );
}
