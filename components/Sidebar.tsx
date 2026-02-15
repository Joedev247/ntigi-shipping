'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  Users,
  Truck,
  MapPin,
  Package,
  UserGear,
  Receipt,
  Car,
  Archive,
  Gear,
  ShoppingCart,
  FileText,
  FolderOpen,
  Bell,
} from 'phosphor-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: SquaresFour },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/fleet', label: 'Fleet', icon: Truck },
    { href: '/branches', label: 'Branches', icon: MapPin },
    { href: '/shipments', label: 'Shipments', icon: Package },
    { href: '/manifests', label: 'Trip Manifests', icon: FolderOpen },
    { href: '/orders', label: 'Orders', icon: ShoppingCart },
    // { href: '/expenses', label: 'Expenses', icon: Receipt },
    { href: '/drivers', label: 'Drivers', icon: Car },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          NTIGI SHIPPING
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3  text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600 pl-3'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <IconComponent size={20} weight={isActive(item.href) ? 'fill' : 'regular'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings at Bottom */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center space-x-3 px-4 py-3  text-sm font-medium transition-all duration-200 ${
            isActive('/settings') && !isActive('/settings/notifications')
              ? 'bg-green-50 text-green-700 border-l-4 border-green-600 pl-3'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Gear size={20} weight={isActive('/settings') && !isActive('/settings/notifications') ? 'fill' : 'regular'} />
          <span>Settings</span>
        </Link>
        <Link
          href="/settings/notifications"
          className={`flex items-center space-x-3 px-4 py-3  text-sm font-medium transition-all duration-200 ${
            isActive('/settings/notifications')
              ? 'bg-green-50 text-green-700 border-l-4 border-green-600 pl-3'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Bell size={20} weight={isActive('/settings/notifications') ? 'fill' : 'regular'} />
          <span>Notifications</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
