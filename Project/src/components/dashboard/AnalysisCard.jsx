import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ValuationBadge from '@/components/ui/ValuationBadge';
import InvestorBadge from '@/components/ui/InvestorBadge';

export function generateAnalysisConclusion({
  ticker,
  fairValue,
  currentPrice,
  marginOfSafety,
  investorProfile,
  growthRate,
  discountRate
}) {
  const profileExpectations = {
    conservative: { minMoS: 30, expectedReturn: 8, riskTolerance: 'low' },
    moderate: { minMoS: 15, expectedReturn: 12, riskTolerance: 'medium' },
    aggressive: { minMoS: 5, expectedReturn: 18, riskTolerance: 'high' }
  };

  const expectations = profileExpectations[investorProfile] || profileExpectations.moderate;
  const upside = ((fairValue - currentPrice) / currentPrice) * 100;
  
  let status = 'fairly_valued';
  if (upside > 15) status = 'undervalued';
  else if (upside < -10) status = 'overvalued';

  let conclusion = '';
  let recommendation = '';
  let meetsCriteria = false;

  if (status === 'undervalued') {
    if (marginOfSafety >= expectations.minMoS) {
      meetsCriteria = true;
      conclusion = `${ticker} appears undervalued with a ${marginOfSafety.toFixed(1)}% margin of safety. At the current price of $${currentPrice.toFixed(2)}, the stock trades below our fair value estimate of $${fairValue.toFixed(2)}.`;
      recommendation = `This investment opportunity meets the criteria for a ${investorProfile} investor, offering sufficient margin of safety and potential upside.`;
    } else {
      conclusion = `${ticker} shows potential value at current levels, but the ${marginOfSafety.toFixed(1)}% margin of safety is below the ${expectations.minMoS}% threshold preferred by ${investorProfile} investors.`;
      recommendation = `Consider waiting for a better entry point or adjusting position size to account for the lower margin of safety.`;
    }
  } else if (status === 'overvalued') {
    conclusion = `At $${currentPrice.toFixed(2)}, ${ticker} trades above our estimated fair value of $${fairValue.toFixed(2)}, representing a ${Math.abs(upside).toFixed(1)}% premium.`;
    recommendation = `This valuation does not meet the return expectations of a ${investorProfile} investor. Consider monitoring for a better entry opportunity.`;
  } else {
    conclusion = `${ticker} appears fairly valued at current levels. The stock trades near our estimated fair value of $${fairValue.toFixed(2)}.`;
    recommendation = investorProfile === 'aggressive' 
      ? `Aggressive investors may still find opportunity in the growth potential if fundamentals remain strong.`
      : `Consider adding to watchlist and waiting for a more attractive entry point.`;
  }

  return {
    status,
    conclusion,
    recommendation,
    meetsCriteria,
    upside,
    marginOfSafety
  };
}

export default function AnalysisCard({ 
  analysis,
  ticker,
  currentPrice,
  fairValue,
  investorProfile 
}) {
  if (!analysis) return null;

  const { status, conclusion, recommendation, meetsCriteria, upside, marginOfSafety } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-slate-800 bg-slate-900/50 overflow-hidden">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">AI Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <InvestorBadge profile={investorProfile} size="sm" />
              <ValuationBadge status={status} size="sm" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-800/50">
              <p className="text-sm text-slate-400 mb-1">Fair Value</p>
              <p className="text-2xl font-bold text-white">${fairValue?.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50">
              <p className="text-sm text-slate-400 mb-1">Upside/Downside</p>
              <div className="flex items-center gap-2">
                {upside > 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <p className={cn(
                  "text-2xl font-bold",
                  upside > 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {upside > 0 ? '+' : ''}{upside?.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50">
              <p className="text-sm text-slate-400 mb-1">Margin of Safety</p>
              <p className={cn(
                "text-2xl font-bold",
                marginOfSafety > 20 ? "text-emerald-400" : 
                marginOfSafety > 10 ? "text-amber-400" : "text-red-400"
              )}>
                {marginOfSafety?.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700">
              <p className="text-slate-300 leading-relaxed">{conclusion}</p>
            </div>

            {/* Recommendation */}
            <div className={cn(
              "p-4 rounded-xl border flex items-start gap-3",
              meetsCriteria 
                ? "bg-emerald-500/10 border-emerald-500/30" 
                : "bg-amber-500/10 border-amber-500/30"
            )}>
              {meetsCriteria ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              )}
              <p className={cn(
                "text-sm leading-relaxed",
                meetsCriteria ? "text-emerald-300" : "text-amber-300"
              )}>
                {recommendation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}