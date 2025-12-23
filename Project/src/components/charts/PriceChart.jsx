import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

const timeRanges = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'MAX'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const date = new Date(payload[0].payload.time);
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-sm mb-1">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </p>
        <p className="text-white font-bold text-lg">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function PriceChart({ ticker, currentPrice }) {
  const [selectedRange, setSelectedRange] = useState('1M');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!ticker) return;
      
      setLoading(true);
      try {
        const { data: response } = await base44.functions.invoke('getHistoricalPrices', { 
          ticker, 
          range: selectedRange 
        });
        
        const formattedData = response.data.map(item => ({
          time: item.time,
          price: item.price
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [ticker, selectedRange]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  const priceChange = data.length > 0 ? data[data.length - 1].price - data[0].price : 0;
  const priceChangePercent = data.length > 0 ? (priceChange / data[0].price) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <Card className="border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{ticker} Price Chart</h3>
          {data.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">
                ${data[data.length - 1]?.price.toFixed(2)}
              </span>
              <span className={cn(
                "text-sm font-medium",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-800">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              onClick={() => handleRangeChange(range)}
              disabled={loading}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                selectedRange === range
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedRange === '1D' ? date.toLocaleTimeString() : date.toLocaleDateString();
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No data available
          </div>
        )}
      </div>
    </Card>
  );
}