'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { User, Envelope, Lock } from 'phosphor-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Valid email address is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber
      );

      // Account created successfully
      alert('Account created successfully! You can now sign in.');
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
          <h2 className="text-3xl font-bold text-white mb-4">Already have account?</h2>
          <p className="text-teal-100 mb-8 text-sm">
            To keep connected with us please login with your personal info
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-10 py-2 border-2 border-white text-white  font-semibold hover:bg-white hover:text-teal-600 transition-all"
          >
            SIGN IN
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

          <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-8">or use your email for registration:</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 ">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Envelope size={20} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold  transition-colors disabled:opacity-50"
            >
              {loading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
          </form>

          {/* Mobile Sign In Link */}
          <div className="lg:hidden text-center mt-8">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-teal-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
