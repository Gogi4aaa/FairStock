import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';

export default function CompanyCard({ ticker, onSelect }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: quoteData } = await base44.functions.invoke('getStockQuote', { ticker });
        setData(quoteData);
      } catch (error) {
        console.error('Failed to fetch company data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticker]);

  if (loading) {
    return (
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-center h-24">
        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const isPositive = data.change >= 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect({ ticker: data.ticker, name: data.name, price: data.price })}
      className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors text-left w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white">{data.ticker}</h4>
            <p className="text-xs text-slate-400 truncate max-w-[150px]">{data.name}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">${data.price.toFixed(2)}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive ? "text-emerald-400" : "text-red-400"
        )}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{isPositive ? '+' : ''}{data.changePercent?.toFixed(2)}%</span>
        </div>
      </div>
    </motion.button>
  );
}