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

export type StockChartProps = {
  name: string;
  symbol: string;
  logoUrl: string;
  peRatio: number;
  data: { date: string; price: number }[];
};

const chartColors = {
  background: '#191919',
  text: '#e5eaf5',
  grid: '#1f6feb',
  line: '#1f6feb',
};

const StockChart: React.FC<StockChartProps> = ({ name, symbol, logoUrl, peRatio, data }) => (
  <div className="chartCard">
    <div className="chartMeta">
      <img src={logoUrl} alt={name+" logo"} className="chartLogo" />
      <div className="chartMetaText">
        <span className="chartName">{name} <b>({symbol})</b></span>
        <span className="chartPE">P/E: <b>{peRatio}</b></span>
      </div>
    </div>
    <div className="chartContainer">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="6 6" stroke={chartColors.grid} />
          <XAxis dataKey="date" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
          <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
          <Tooltip wrapperStyle={{ background: chartColors.background, color: chartColors.text, borderRadius: 8, border: `1.5px solid ${chartColors.grid}` }} contentStyle={{ background: chartColors.background, color: chartColors.text, border: `1.5px solid ${chartColors.grid}`, borderRadius: 8 }} labelStyle={{ color: chartColors.text }} itemStyle={{ color: chartColors.text }} />
          <Legend wrapperStyle={{ color: chartColors.text }} />
          <Line type="monotone" dataKey="price" name="Stock Price" stroke={chartColors.line} strokeWidth={2} dot={{ r: 4, stroke: chartColors.line, fill: chartColors.background }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default StockChart;
