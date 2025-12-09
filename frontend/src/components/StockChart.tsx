import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: '2023-12-01', price: 135 },
  { date: '2023-12-02', price: 142 },
  { date: '2023-12-03', price: 140 },
  { date: '2023-12-04', price: 147 },
  { date: '2023-12-05', price: 150 },
  { date: '2023-12-06', price: 159 },
  { date: '2023-12-07', price: 153 },
];

const StockChart: React.FC = () => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" name="Stock Price" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default StockChart;
