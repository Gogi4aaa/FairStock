import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendDirection,
  className,
  valueClassName 
}) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm',
      'hover:border-slate-700 transition-all duration-300',
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-transparent" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-800/50">
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>
        
        <div className={cn('text-3xl font-bold text-white mb-1', valueClassName)}>
          {value}
        </div>
        
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={cn(
                'text-sm font-medium',
                trendDirection === 'up' ? 'text-emerald-400' : 
                trendDirection === 'down' ? 'text-red-400' : 'text-slate-400'
              )}>
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-slate-500">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}