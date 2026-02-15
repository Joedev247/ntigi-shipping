'use client';

import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-green-50 text-green-800 border-green-200',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`border  p-4 ${colors[type]} flex justify-between items-start`}>
      <div className="flex gap-3">
        <span className="text-xl font-bold">{icons[type]}</span>
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-lg font-bold opacity-50 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
};

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-green-100 text-green-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-gray-100 text-gray-800',
  };

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>{text}</span>;
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-green-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};
