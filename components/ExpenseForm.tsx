'use client';

import React, { useState } from 'react';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Fuel',
    description: '',
    payee: '',
    memo: '',
    receipt: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (XAF)</label>
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
          >
            <option>Fuel</option>
            <option>Maintenance</option>
            <option>Repairs</option>
            <option>Cleaning</option>
            <option>Insurance</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payee</label>
          <input
            type="text"
            name="payee"
            placeholder="Vendor/Payee Name"
            value={formData.payee}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          placeholder="Description of expense"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Memo</label>
        <input
          type="text"
          name="memo"
          placeholder="Reference/Memo"
          value={formData.memo}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Receipt/Attachment</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300  focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-100"
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="px-6 py-2 bg-gray-400 text-gray-700 font-medium  hover:bg-gray-500 transition"
        >
          + Add Expense
        </button>
      </div>
    </form>
  );
};
