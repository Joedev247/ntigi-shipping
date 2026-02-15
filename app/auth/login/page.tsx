'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Envelope, Lock } from 'phosphor-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Email not confirmed')) {
        setError('Invalid email or password');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-teal-500 to-teal-700 flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
          <div className="w-full h-full  bg-white"></div>
        </div>
        <div className="absolute bottom-10 left-10 w-32 h-32 opacity-10">
          <div className="w-full h-full  bg-white"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-4">
            <div className="text-4xl font-bold text-white mb-2">Ntigi Shipping</div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-teal-100 mb-8 text-sm">
            To keep connected with us please login with your personal info
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-2 border-2 border-white text-white  font-semibold hover:bg-white hover:text-teal-600 transition-all"
          >
            SIGN UP
          </Link>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-2/3 bg-white flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="text-2xl font-bold text-gray-900">Ntigi Shipping</div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">Login Account</h1>
          <p className="text-gray-500 text-sm mb-8">or use your email to login:</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 ">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Envelope size={20} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-gray-300 text-teal-500 focus:ring-teal-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold  transition-colors disabled:opacity-50"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 space-y-3">
            <div className="flex flex-col gap-2 items-center text-sm text-gray-600">
              <Link href="/auth/reset" className="text-teal-600 font-semibold hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Mobile Create Account Link */}
            <div className="lg:hidden">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-teal-600 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
