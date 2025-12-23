import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Target, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DCFCalculator from '@/components/dcf/DCFCalculator';
import InvestorBadge from '@/components/ui/InvestorBadge';
import AnalysisCard, { generateAnalysisConclusion } from '@/components/dashboard/AnalysisCard';
import { cn } from '@/lib/utils';
import { apiRequest, isAuthenticated } from '@/utils/auth';

export default function FairValueDCF() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!isAuthenticated()) {
          navigate(createPageUrl('Home'));
          return;
        }

        const resp = await apiRequest('/validate');
        const data = await resp.json();
        
        if (!data.authenticated) {
          navigate(createPageUrl('Home'));
          return;
        }
        
        if (!data.user?.questionnaire_completed) {
          navigate(createPageUrl('Questionnaire'));
          return;
        }
        
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate(createPageUrl('Home'));
      }
    };
    loadUser();
  }, [navigate]);

  const handleCalculate = (data) => {
    setResults(data);
    
    if (data.fairValuePerShare && data.currentPrice) {
      const analysisResult = generateAnalysisConclusion({
        ticker: 'CUSTOM',
        fairValue: data.fairValuePerShare,
        currentPrice: parseFloat(data.currentPrice),
        marginOfSafety: ((data.fairValuePerShare - parseFloat(data.currentPrice)) / data.fairValuePerShare) * 100,
        investorProfile: user?.investor_category || 'moderate',
        growthRate: data.growthRate,
        discountRate: data.discountRate
      });
      setAnalysis(analysisResult);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate(createPageUrl('Dashboard'))}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <div className="h-6 w-px bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Fair Value Per Share Calculator</span>
                </div>
              </div>
              <InvestorBadge profile={user?.investor_category} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Description */}
            <div className="mb-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
              <h2 className="text-lg font-semibold text-white mb-2">About Fair Value DCF</h2>
              <p className="text-slate-400 leading-relaxed">
                Calculate the intrinsic fair value per share by dividing the total equity value 
                by shares outstanding. Compare this to the current market price to identify 
                potential investment opportunities with adequate margin of safety.
              </p>
            </div>

            {/* Calculator */}
            <DCFCalculator
              type="fair_value"
              investorProfile={user?.investor_category}
              onCalculate={handleCalculate}
            />

            {/* Additional Info */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Valuation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <p className="text-sm text-slate-300 mb-1">Fair Value Per Share</p>
                    <p className="text-3xl font-bold text-white">
                      ${results.fairValuePerShare?.toFixed(2)}
                    </p>
                  </div>
                  
                  {results.currentPrice > 0 && (
                    <>
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">Current Price</p>
                        <p className="text-2xl font-bold text-white">
                          ${parseFloat(results.currentPrice).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">Upside/Downside</p>
                        <div className="flex items-center gap-2">
                          {results.fairValuePerShare > results.currentPrice ? (
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-red-400" />
                          )}
                          <p className={cn(
                            "text-2xl font-bold",
                            results.fairValuePerShare > results.currentPrice 
                              ? "text-emerald-400" 
                              : "text-red-400"
                          )}>
                            {results.fairValuePerShare > results.currentPrice ? '+' : ''}
                            {((results.fairValuePerShare / results.currentPrice - 1) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">Margin of Safety</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          ((results.fairValuePerShare - results.currentPrice) / results.fairValuePerShare) * 100 > 20
                            ? "text-emerald-400"
                            : ((results.fairValuePerShare - results.currentPrice) / results.fairValuePerShare) * 100 > 10
                              ? "text-amber-400"
                              : "text-red-400"
                        )}>
                          {(((results.fairValuePerShare - results.currentPrice) / results.fairValuePerShare) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                {analysis && (
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                      AI Analysis
                    </h4>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      {analysis.conclusion}
                    </p>
                    <div className={cn(
                      "p-3 rounded-lg border",
                      analysis.meetsCriteria 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    )}>
                      <p className="text-sm">{analysis.recommendation}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}