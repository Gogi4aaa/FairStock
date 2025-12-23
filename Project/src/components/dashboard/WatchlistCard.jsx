import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WatchlistCard({ 
  watchlist = [], 
  onSelect, 
  onRemove,
  onAdd 
}) {
  // Mock price data for watchlist
  const mockPriceData = {
    AAPL: { price: 178.50, change: 2.4 },
    MSFT: { price: 378.20, change: 1.8 },
    GOOGL: { price: 141.80, change: -0.5 },
    AMZN: { price: 178.25, change: 3.2 },
    NVDA: { price: 875.30, change: 4.1 },
    META: { price: 505.60, change: 1.2 },
    TSLA: { price: 245.80, change: -2.1 },
    JPM: { price: 198.40, change: 0.8 },
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">Watchlist</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            className="text-slate-400 hover:text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {watchlist.length === 0 ? (
          <div className="p-8 text-center">
            <Eye className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">Your watchlist is empty</p>
            <p className="text-sm text-slate-500">Search for companies to add them here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {watchlist.map((ticker) => {
              const data = mockPriceData[ticker] || { price: 100, change: 0 };
              const isPositive = data.change >= 0;
              
              return (
                <div
                  key={ticker}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  onClick={() => onSelect(ticker)}
                >
                  <div>
                    <p className="font-bold text-white">{ticker}</p>
                    <p className="text-sm text-slate-400">${data.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-lg",
                      isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-sm font-medium">
                        {isPositive ? '+' : ''}{data.change}%
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(ticker);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}