'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsApi } from '@/lib/api';
import type { Stats, InvoiceTrend, VendorSpend, CategorySpend, CashOutflow } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { InvoiceTrendsChart } from './charts/invoice-trends-chart';
import { VendorSpendChart } from './charts/vendor-spend-chart';
import { CategorySpendChart } from './charts/category-spend-chart';
import { CashOutflowChart } from './charts/cash-outflow-chart';
import { InvoicesTable } from './invoices-table';

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [invoiceTrends, setInvoiceTrends] = useState<InvoiceTrend[]>([]);
  const [topVendors, setTopVendors] = useState<VendorSpend[]>([]);
  const [categorySpend, setCategorySpend] = useState<CategorySpend[]>([]);
  const [cashOutflow, setCashOutflow] = useState<CashOutflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData, vendorsData, categoryData, cashData] = await Promise.all([
        analyticsApi.getStats(),
        analyticsApi.getInvoiceTrends(),
        analyticsApi.getTopVendors(),
        analyticsApi.getCategorySpend(),
        analyticsApi.getCashOutflow(),
      ]);

      setStats(statsData);
      setInvoiceTrends(trendsData);
      setTopVendors(vendorsData);
      setCategorySpend(categoryData);
      setCashOutflow(cashData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <header className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="text-right">
              <p className="text-sm font-semibold">Sonu Kumar</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Total Spend</p>
                  <p className="text-xs text-gray-400 mb-3">(YTD)</p>
                  <div className="text-2xl font-bold text-gray-900">
                    € {formatNumber(stats?.totalSpend || 0)}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-16 h-12">
                  <svg viewBox="0 0 60 40" className="w-full h-full">
                    <path
                      d="M0,20 Q15,10 30,15 T60,10"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">Total Invoices Processed</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats?.totalInvoices || 0)}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-16 h-12">
                  <svg viewBox="0 0 60 40" className="w-full h-full">
                    <path
                      d="M0,25 Q15,15 30,20 T60,12"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Documents Uploaded</p>
                  <p className="text-xs text-gray-400 mb-3">This Month</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(stats?.documentsUploaded || 0)}
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    8 less from last month
                  </p>
                </div>
                <div className="w-16 h-12">
                  <svg viewBox="0 0 60 40" className="w-full h-full">
                    <path
                      d="M0,15 Q15,20 30,18 T60,25"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">Average Invoice Value</p>
                  <div className="text-2xl font-bold text-gray-900">
                    € {formatNumber(stats?.averageInvoiceValue || 0)}
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-16 h-12">
                  <svg viewBox="0 0 60 40" className="w-full h-full">
                    <path
                      d="M0,30 Q15,25 30,22 T60,15"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Invoice Volume + Value Trend</CardTitle>
              <p className="text-sm text-gray-500">Invoice count and total spend over 12 months.</p>
            </CardHeader>
            <CardContent>
              <InvoiceTrendsChart data={invoiceTrends} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Spend by Vendor (Top 10)</CardTitle>
              <p className="text-sm text-gray-500">Vendor spend with cumulative percentage distribution.</p>
            </CardHeader>
            <CardContent>
              <VendorSpendChart data={topVendors} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Spend by Category</CardTitle>
              <p className="text-sm text-gray-500">Distribution of spending across different categories.</p>
            </CardHeader>
            <CardContent>
              <CategorySpendChart data={categorySpend} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cash Outflow Forecast</CardTitle>
              <p className="text-sm text-gray-500">Expected payment obligations grouped by due date ranges.</p>
            </CardHeader>
            <CardContent>
              <CashOutflowChart data={cashOutflow} />
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Invoices by Vendor</CardTitle>
            <p className="text-sm text-gray-500">Top vendors by invoice count and net value.</p>
          </CardHeader>
          <CardContent>
            <InvoicesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
