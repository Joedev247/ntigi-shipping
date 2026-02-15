'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ExpenseForm } from '@/components/ExpenseForm';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';
import toast from 'react-hot-toast';

const EXPENSE_CATEGORIES = ['FUEL', 'MAINTENANCE', 'TOLLS', 'OTHER'];

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { expenses, loading, error, addExpense, fetchExpenses } = useExpenseManagement();

  const handleAddExpense = async (formData: any) => {
    try {
      await addExpense(formData);
      toast.success('Expense added successfully!');
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add expense');
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch =
      e.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || e.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: expenses.length,
    totalAmount: expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0),
    byCategory: EXPENSE_CATEGORIES.map(cat => ({
      category: cat,
      amount: expenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    }))
  };

  if (loading) {
    return (
      <DashboardLayout title="Expenses">
        <SkeletonLoader rows={5} columns={5} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Expenses">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Total Amount Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded">
        <p className="text-sm text-gray-600">Total Expenses</p>
        <p className="text-3xl font-bold text-red-900">XAF {stats.totalAmount.toLocaleString()}</p>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.byCategory.map(cat => (
          <div key={cat.category} className="bg-purple-50 border border-purple-200 p-4 rounded">
            <p className="text-xs text-gray-600">{cat.category}</p>
            <p className="text-lg font-bold text-purple-900">XAF {cat.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by description..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <ActionButton
          label="+ new Expense"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'expense_id', label: 'ID', render: (v) => v?.substring(0, 8) || 'N/A' },
          { key: 'expense_date', label: 'Date' },
          { key: 'description', label: 'Description' },
          { key: 'amount', label: 'Amount (XAF)', render: (v) => parseFloat(v).toLocaleString() || 0 },
          { key: 'category', label: 'Category', render: (v) => (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
              {v}
            </span>
          )}
        ]}
        data={filteredExpenses}
      />

      {filteredExpenses.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No expenses found. Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Expense"
        width="lg"
      >
        <ExpenseForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddExpense}
        />
      </Modal>
    </DashboardLayout>
  );
}
