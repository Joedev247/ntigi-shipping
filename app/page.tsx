'use client';

import { Container } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, Grid } from '@/components/Card';
import { Package, MapPin, Truck, Phone, Printer, Globe, Play, ArrowRight, CheckCircle } from 'phosphor-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Smart Package Management',
      desc: 'Dynamic pricing, package classification, and automatic cost calculation'
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      desc: 'Real-time GPS tracking and milestone-based status updates'
    },
    {
      icon: Truck,
      title: 'Fleet Management',
      desc: 'Track vehicles, manage drivers, and optimize routes'
    },
    {
      icon: Phone,
      title: 'Mobile-First',
      desc: 'SMS & WhatsApp notifications, offline support for low-connectivity areas'
    },
    {
      icon: Printer,
      title: 'Thermal Printing',
      desc: 'Optimized for 58mm & 80mm thermal receipts with QR codes'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      desc: 'Support for English, French, Swahili and local currencies'
    }
  ];

  const steps = [
    { number: 1, title: 'Create', desc: 'Register your agency & configure branches' },
    { number: 2, title: 'Manage', desc: 'Accept shipments & assign vehicles' },
    { number: 3, title: 'Track', desc: 'Monitor deliveries with live GPS' },
    { number: 4, title: 'Report', desc: 'Generate reports & analytics' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm bg-opacity-95">
        <nav className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Ntigi Shipping</h1>
          <div className="flex gap-4">
            <Link href="/tracking">
              <Button variant="secondary">Track Shipment</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section with Video Background */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/38590-418590043_medium.mp4" type="video/mp4" />
            <source src="/videos/22208-326032536_medium.mp4" type="video/webm" />
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/85 to-gray-800/85"></div>
          
         
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-6 inline-block">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Play size={16} weight="fill" />
              <span className="text-sm font-medium">Shipping Management System</span>
            </div>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Professional Shipping Made Simple
          </h2>
          
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Complete shipping management system designed for African markets. Track, manage, and scale your shipping operations with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button className="text-lg px-8 py-2 flex items-center gap-2 bg-green-500 text-white hover:bg-green-600">
                Get Started Free <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/tracking">
              <Button variant="secondary" className="text-lg px-8 py- ">
                Track Package
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-300" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-300" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-300" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 text-white animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <Container className="py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Powerful Features</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to manage your shipping operations efficiently and scale your business</p>
        </div>
        
        <Grid columns={3} gap="lg">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600">
                      <IconComponent size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </Grid>
      </Container>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <Container>
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl text-gray-700 font-bold mb-4">How It Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get up and running in just four simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">{step.title}</h4>
                  <p className="text-gray-600 text-center text-sm">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-gradient-to-r from-green-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">10K+</div>
            <p className="text-gray-600 text-lg">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">1M+</div>
            <p className="text-gray-600 text-lg">Shipments Tracked</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">50K+</div>
            <p className="text-gray-600 text-lg">Deliveries Daily</p>
          </div>
        </div>
      </Container>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <Container className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Join hundreds of shipping agencies managing their operations efficiently with Ntigi
          </p>
          <Link href="/auth/signup">
            <Button className="text-lg px-8 py- bg-green-600 text-white hover:bg-green-700">
              Create Your Account Free
            </Button>
          </Link>
        </Container>
      </div>

      {/* Footer */}
      <div className="bg-gray-600 text-gray-300 py-12">
        <Container>
         
          <div className="border-t border-gray-700 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; 2026 Ntigi Shipping. All rights reserved. | Built for African markets</p>
          </div>
        </Container>
      </div>
    </div>
  );
}
