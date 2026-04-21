import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDateRange, filterByDateRange } from '../utils/dateUtils';

export default function SalesLineChart({ transactions }) {
  // Get data for last 7 days
  const { start, end } = getDateRange(7);
  const filteredTx = filterByDateRange(transactions, start, end);

  // Group by date
  const dataMap = {};
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dataMap[dateStr] = { date: dateStr, sales: 0, purchases: 0 };
  }

  filteredTx.forEach((tx) => {
    const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
    const dateStr = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (dataMap[dateStr]) {
      if (tx.type === 'sales') {
        dataMap[dateStr].sales += tx.amount || 0;
      } else if (tx.type === 'purchase') {
        dataMap[dateStr].purchases += tx.amount || 0;
      }
    }
  });

  const data = Object.values(dataMap);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="purchases" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
