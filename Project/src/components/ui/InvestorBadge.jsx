import React from 'react';
import { Shield, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const profileConfig = {
  conservative: {
    icon: Shield,
    label: 'Conservative',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30'
  },
  moderate: {
    icon: TrendingUp,
    label: 'Moderate',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  aggressive: {
    icon: Zap,
    label: 'Aggressive',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30'
  }
};

export default function InvestorBadge({ profile, size = 'default', showLabel = true }) {
  if (!profile) return null;
  
  const config = profileConfig[profile];
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
      'inline-flex items-center rounded-full border backdrop-blur-sm',
      config.bgColor,
      config.borderColor,
      sizeClasses[size]
    )}>
      <div className={cn('rounded-full bg-gradient-to-r p-1', config.color)}>
        <Icon className={cn('text-white', iconSizes[size])} />
      </div>
      {showLabel && (
        <span className={cn('font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
}