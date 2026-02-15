'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, footer, onClick }) => {
  const clickableProps = onClick ? { onClick, role: 'button', tabIndex: 0 } : {};

  return (
    <div {...clickableProps} className={`bg-white  shadow ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">{footer}</div>}
    </div>
  );
};

interface GridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, columns = 3, gap = 'md', className = '' }) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

interface StatBlockProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
}

export const StatBlock: React.FC<StatBlockProps> = ({ label, value, unit, trend }) => {
  return (
    <Card>
      <div className="text-center">
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {value} {unit}
        </p>
        {trend !== undefined && (
          <p className={`text-sm font-medium mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </Card>
  );
};
