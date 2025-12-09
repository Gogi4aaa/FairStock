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
import '../CSS/StockChart.css';

const data = [
  { date: '2023-12-01', price: 135 },
  { date: '2023-12-02', price: 142 },
  { date: '2023-12-03', price: 140 },
  { date: '2023-12-04', price: 147 },
  { date: '2023-12-05', price: 150 },
  { date: '2023-12-06', price: 159 },
  { date: '2023-12-07', price: 153 },
];

const chartColors = {
  background: '#192a4a',
  text: '#e5eaf5',
  grid: '#344a6e',
  line: '#409ffe',
};

const StockChart: React.FC = () => (
  <div className="chartContainer">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="6 6" stroke={chartColors.grid} />
        <XAxis dataKey="date" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
        <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
        <Tooltip wrapperStyle={{ background: '#12254B', color: chartColors.text, borderRadius: 8 }} contentStyle={{ background: '#192a4a', color: chartColors.text, border: 'none', borderRadius: 8 }} labelStyle={{ color: chartColors.text }} itemStyle={{ color: chartColors.text }} />
        <Legend wrapperStyle={{ color: chartColors.text }} />
        <Line type="monotone" dataKey="price" name="Stock Price" stroke={chartColors.line} strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default StockChart;
