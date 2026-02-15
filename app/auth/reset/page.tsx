'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { FormInput } from '@/components/Form';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await userService.resetPassword(email);
      setMessage('Password reset link sent to your email. Check your inbox.');
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ntigi Shipping</h1>
          <p className="text-green-100">Reset Your Password</p>
        </div>

        <Card className="shadow-xl">
          {message ? (
            <Alert type="success" message={message} />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>

              {error && <Alert type="error" message={error} onClose={() => setError('')} />}

              <form onSubmit={handleReset}>
                <FormInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />

                <p className="text-sm text-gray-600 mb-4">
                  We'll send you a link to reset your password.
                </p>

                <Button variant="primary" type="submit" className="w-full" isLoading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <p className="text-center text-gray-600 text-sm mt-4">
                <a href="/auth/login" className="text-green-600 hover:underline">
                  Back to Sign In
                </a>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
