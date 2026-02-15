'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, Container } from '@/components/Layout';
import { Card, Grid, StatBlock } from '@/components/Card';
import { Alert, LoadingSpinner } from '@/components/Alert';
import { FormInput } from '@/components/Form';
import { paymentService } from '@/services/trackingService';
import { Table } from '@/components/Table';
import { formatCurrency, formatDateTime } from '@/utils/formatUtils';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');

      // Calculate revenue
      const revenueData = await paymentService.calculateRevenue('', `${startDate}T00:00:00Z`, `${endDate}T23:59:59Z`);
      setStats(revenueData);

      // Get transactions
      const transData = await paymentService.getTransactionsByDateRange('', `${startDate}T00:00:00Z`, `${endDate}T23:59:59Z`);
      setTransactions(transData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Reports & Analytics">
      <Container>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Date Filter */}
        <Card className="mb-6">
          <div className="flex gap-4 items-end">
            <FormInput
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FormInput label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button
              onClick={loadReport}
              className="px-4 py-2 bg-green-600 text-white  hover:bg-green-700"
            >
              Load Report
            </button>
          </div>
        </Card>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading report..." />
          </div>
        ) : stats ? (
          <>
            <Grid columns={3} gap="md" className="mb-8">
              <StatBlock label="Total Revenue" value={formatCurrency(stats.totalRevenue, 'XAF')} />
              <StatBlock label="Total Tax" value={formatCurrency(stats.totalTax, 'XAF')} />
              <StatBlock label="Transactions" value={stats.transactionCount} />
            </Grid>

            {/* Transactions */}
            <Card title="Transaction Details">
              {transactions.length === 0 ? (
                <p className="text-center py-8 text-gray-600">No transactions found</p>
              ) : (
                <Table
                  headers={['Tracking', 'Amount', 'Tax', 'Method', 'Date']}
                  rows={(transactions as any[]).map((t) => [
                    t.shipment?.tracking_no || 'N/A',
                    formatCurrency(t.amount, 'XAF'),
                    formatCurrency(t.tax_amount, 'XAF'),
                    t.method,
                    formatDateTime(t.created_at),
                  ])}
                />
              )}
            </Card>
          </>
        ) : null}
      </Container>
    </PageLayout>
  );
}
