'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, ActionButton, SearchBar } from '@/components/Dashboard';
import { Modal } from '@/components/Modal';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ExpenseForm } from '@/components/ExpenseForm';
import { useExpenseManagement } from '@/hooks/useExpenseManagement';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { expenses, loading, error, addExpense } = useExpenseManagement();

  const handleAddExpense = async (formData: any) => {
    try {
      await addExpense(formData);
      toast.success('Expense added successfully!');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add expense');
    }
  };

  const filteredExpenses = expenses.filter(e =>
    e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

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
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">XAF {totalExpenses.toLocaleString()}</div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <SearchBar
          placeholder="Search expense..."
          onSearch={setSearchTerm}
        />
        <ActionButton
          label="+ new Expense"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'date', label: 'Date' },
          { key: 'description', label: 'Description' },
          { key: 'amount', label: 'Amount (XAF)' },
          { key: 'category', label: 'Category' },
          { key: 'memo', label: 'Memo' }
        ]}
        data={filteredExpenses}
      />

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

