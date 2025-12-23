import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Zap, ArrowRight, Target, Clock, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

const profileData = {
  conservative: {
    icon: Shield,
    title: 'Conservative Investor',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    description: "You prioritize capital preservation and stable income over aggressive growth. Your investment approach focuses on minimizing risk while generating consistent returns.",
    characteristics: [
      "Prefers low-volatility investments",
      "Values dividend income and stability",
      "Long-term, patient approach",
      "Lower risk tolerance"
    ],
    expectedReturn: "4-8%",
    riskLevel: "Low",
    timeHorizon: "5+ years",
    suitableStrategies: [
      "Blue-chip dividend stocks",
      "Investment-grade bonds",
      "Index funds with low volatility",
      "High margin of safety requirements"
    ]
  },
  moderate: {
    icon: TrendingUp,
    title: 'Moderate Investor',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    description: "You seek a balanced approach between growth and stability. You're comfortable with moderate market fluctuations in pursuit of reasonable returns.",
    characteristics: [
      "Balanced risk-reward approach",
      "Diversified portfolio strategy",
      "Comfortable with market cycles",
      "Medium-term outlook"
    ],
    expectedReturn: "8-15%",
    riskLevel: "Medium",
    timeHorizon: "3-7 years",
    suitableStrategies: [
      "Mix of growth and value stocks",
      "Diversified ETF portfolios",
      "Some exposure to emerging markets",
      "Moderate margin of safety"
    ]
  },
  aggressive: {
    icon: Zap,
    title: 'Aggressive Investor',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    description: "You're focused on maximizing returns and are comfortable with significant volatility. You see market downturns as buying opportunities.",
    characteristics: [
      "High risk tolerance",
      "Growth-focused strategy",
      "Active portfolio management",
      "Opportunistic approach"
    ],
    expectedReturn: "15%+",
    riskLevel: "High",
    timeHorizon: "7+ years",
    suitableStrategies: [
      "High-growth technology stocks",
      "Emerging markets exposure",
      "Small-cap opportunities",
      "Lower margin of safety acceptable"
    ]
  }
};

export default function ProfileResult({ category, riskScore, onContinue }) {
  const profile = profileData[category];
  const Icon = profile.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Main Result Card */}
      <div className={cn(
        "rounded-3xl border p-8 md:p-12 mb-8",
        profile.bgColor,
        profile.borderColor
      )}>
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={cn(
              "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
              `bg-gradient-to-r ${profile.color}`
            )}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {profile.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            {profile.description}
          </motion.p>
        </div>

        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700">
            <span className="text-slate-400">Risk Score</span>
            <span className={cn("text-3xl font-bold", profile.textColor)}>{riskScore}</span>
            <span className="text-slate-500">/100</span>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="p-4 rounded-xl bg-slate-800/30 text-center">
            <Percent className={cn("w-6 h-6 mx-auto mb-2", profile.textColor)} />
            <p className="text-sm text-slate-400 mb-1">Expected Return</p>
            <p className="text-lg font-semibold text-white">{profile.expectedReturn}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/30 text-center">
            <Target className={cn("w-6 h-6 mx-auto mb-2", profile.textColor)} />
            <p className="text-sm text-slate-400 mb-1">Risk Level</p>
            <p className="text-lg font-semibold text-white">{profile.riskLevel}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/30 text-center">
            <Clock className={cn("w-6 h-6 mx-auto mb-2", profile.textColor)} />
            <p className="text-sm text-slate-400 mb-1">Time Horizon</p>
            <p className="text-lg font-semibold text-white">{profile.timeHorizon}</p>
          </div>
        </motion.div>
      </div>

      {/* Characteristics & Strategies */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Your Characteristics</h3>
          <ul className="space-y-3">
            {profile.characteristics.map((char, index) => (
              <li key={index} className="flex items-center gap-3 text-slate-300">
                <div className={cn("w-2 h-2 rounded-full", `bg-gradient-to-r ${profile.color}`)} />
                {char}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Suitable Strategies</h3>
          <ul className="space-y-3">
            {profile.suitableStrategies.map((strategy, index) => (
              <li key={index} className="flex items-center gap-3 text-slate-300">
                <div className={cn("w-2 h-2 rounded-full", `bg-gradient-to-r ${profile.color}`)} />
                {strategy}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <Button
          onClick={onContinue}
          size="lg"
          className={cn(
            "px-12 py-6 text-lg font-semibold",
            `bg-gradient-to-r ${profile.color} hover:opacity-90`
          )}
        >
          Continue to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}