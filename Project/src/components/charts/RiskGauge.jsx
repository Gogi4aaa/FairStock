import React from 'react';
import { cn } from '@/lib/utils';

export default function RiskGauge({ score, maxScore = 100, label = "Risk Score" }) {
  const percentage = (score / maxScore) * 100;
  
  const getColor = () => {
    if (percentage <= 33) return { stroke: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-400' };
    if (percentage <= 66) return { stroke: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-400' };
    return { stroke: '#f97316', bg: 'bg-orange-500', text: 'text-orange-400' };
  };
  
  const colors = getColor();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#334155"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={0}
              transform="rotate(-135 50 50)"
            />
            {/* Foreground arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset + circumference * 0.25}
              transform="rotate(-135 50 50)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-4xl font-bold', colors.text)}>{score}</span>
            <span className="text-sm text-slate-400">/ {maxScore}</span>
          </div>
        </div>
        <div className="flex justify-between w-full mt-4 px-4">
          <span className="text-xs text-emerald-400">Low Risk</span>
          <span className="text-xs text-orange-400">High Risk</span>
        </div>
      </div>
    </div>
  );
}