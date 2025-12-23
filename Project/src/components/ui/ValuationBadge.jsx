import React from 'react';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  undervalued: {
    icon: TrendingDown,
    label: 'Undervalued',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  fairly_valued: {
    icon: Minus,
    label: 'Fairly Valued',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  overvalued: {
    icon: TrendingUp,
    label: 'Overvalued',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30'
  }
};

export default function ValuationBadge({ status, size = 'default' }) {
  if (!status) return null;
  
  const config = statusConfig[status];
  if (!config) return null;
  
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    default: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn(
      'inline-flex items-center rounded-full border',
      config.bgColor,
      config.borderColor,
      sizeClasses[size]
    )}>
      <Icon className={cn(config.color, iconSizes[size])} />
      <span className={cn('font-medium', config.color)}>
        {config.label}
      </span>
    </div>
  );
}