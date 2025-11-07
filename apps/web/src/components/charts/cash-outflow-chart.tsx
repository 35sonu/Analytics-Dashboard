'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CashOutflow } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  data: CashOutflow[];
}

export function CashOutflowChart({ data }: Props) {
  const chartData = data.map((item) => ({
    week: new Date(item.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip formatter={(value: any) => formatCurrency(value)} />
        <Bar dataKey="total" fill="#ef4444" name="Expected Outflow" />
      </BarChart>
    </ResponsiveContainer>
  );
}
