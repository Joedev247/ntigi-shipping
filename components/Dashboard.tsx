'use client';

import React, { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<any>;
  trend?: number;
  color?: 'green' | 'purple' | 'orange' | 'indigo';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon: IconComponent,
  trend,
  color = 'green'
}) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-900 border-green-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200',
    orange: 'bg-orange-50 text-orange-900 border-orange-200',
    indigo: 'bg-indigo-50 text-indigo-900 border-indigo-200'
  } as const;

  const iconColorClasses = {
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600'
  } as const;

  return (
    <div className={`${colorClasses[color]} border p-6  shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        {IconComponent && <IconComponent size={32} className={`${iconColorClasses[color]} flex-shrink-0`} />}
      </div>
    </div>
  );
};

interface DataTableProps {
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => ReactNode;
  }>;
  data: any[];
  actions?: (row: any) => ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, actions }) => {
  return (
    <div className="bg-white  overflow-hidden border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {label}
    </button>
  );
};

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch?.(e.target.value)}
      className="px-4 py-2 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
    />
  );
};
