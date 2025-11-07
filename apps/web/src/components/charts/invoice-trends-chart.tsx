'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { InvoiceTrend } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  data: InvoiceTrend[];
}

export function InvoiceTrendsChart({ data }: Props) {
  const chartData = data.map((item) => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    count: item.count,
    total: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          formatter={(value: any, name: string) => {
            if (name === 'total') return formatCurrency(value);
            return value;
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          name="Invoice Count"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="total"
          stroke="#10b981"
          name="Total Value"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
