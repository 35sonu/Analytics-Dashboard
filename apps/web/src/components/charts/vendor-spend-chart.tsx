'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { VendorSpend } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  data: VendorSpend[];
}

export function VendorSpendChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    total: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={120} />
        <Tooltip formatter={(value: any) => formatCurrency(value)} />
        <Bar dataKey="total" fill="#3b82f6" name="Total Spend" />
      </BarChart>
    </ResponsiveContainer>
  );
}
