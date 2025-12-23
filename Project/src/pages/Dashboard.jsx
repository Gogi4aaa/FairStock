import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  BarChart3,
  Calculator,
  LineChart,
  Loader2,
  Building2
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import StatCard from '@/components/ui/StatCard';
import InvestorBadge from '@/components/ui/InvestorBadge';
import ValuationBadge from '@/components/ui/ValuationBadge';
import CompanySearch from '@/components/dashboard/CompanySearch';
import WatchlistCard from '@/components/dashboard/WatchlistCard';
import AnalysisCard, { generateAnalysisConclusion } from '@/components/dashboard/AnalysisCard';
import DCFCalculator, { calculateDCF } from '@/components/dcf/DCFCalculator';
import RealTimeDisclaimer from '@/components/dashboard/RealTimeDisclaimer';
import PriceChart from '@/components/charts/PriceChart';
import CompanySection from '@/components/dashboard/CompanySection';

// Mock company financial data
const mockFinancialData = {
  AAPL: { 
    fcf: 99000, revenue: 383000, shares: 15500, cash: 61000, debt: 109000, price: 178.50,
    revenueHistory: [
      { year: 2019, value: 260000 }, { year: 2020, value: 274000 }, { year: 2021, value: 365000 },
      { year: 2022, value: 394000 }, { year: 2023, value: 383000 }
    ]
  },
  MSFT: { 
    fcf: 59000, revenue: 211000, shares: 7430, cash: 111000, debt: 41000, price: 378.20,
    revenueHistory: [
      { year: 2019, value: 125000 }, { year: 2020, value: 143000 }, { year: 2021, value: 168000 },
      { year: 2022, value: 198000 }, { year: 2023, value: 211000 }
    ]
  },
  GOOGL: { 
    fcf: 60000, revenue: 307000, shares: 12530, cash: 110000, debt: 14000, price: 141.80,
    revenueHistory: [
      { year: 2019, value: 161000 }, { year: 2020, value: 182000 }, { year: 2021, value: 257000 },
      { year: 2022, value: 282000 }, { year: 2023, value: 307000 }
    ]
  },
  NVDA: { 
    fcf: 27000, revenue: 60000, shares: 24700, cash: 26000, debt: 9700, price: 875.30,
    revenueHistory: [
      { year: 2019, value: 11700 }, { year: 2020, value: 16700 }, { year: 2021, value: 26900 },
      { year: 2022, value: 27000 }, { year: 2023, value: 60000 }
    ]
  },
  AMZN: { 
    fcf: 35000, revenue: 575000, shares: 10380, cash: 73000, debt: 67000, price: 178.25,
    revenueHistory: [
      { year: 2019, value: 280000 }, { year: 2020, value: 386000 }, { year: 2021, value: 470000 },
      { year: 2022, value: 514000 }, { year: 2023, value: 575000 }
    ]
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [dcfResults, setDcfResults] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { apiRequest, isAuthenticated } = await import('@/utils/auth');
        
        if (!isAuthenticated()) {
          navigate(createPageUrl('Home'));
          return;
        }

        // Check authentication via backend
        const resp = await apiRequest('/validate');
        const data = await resp.json();
        
        if (!data.authenticated) {
          navigate(createPageUrl('Home'));
          return;
        }

        // Check questionnaire status
        if (!data.user?.questionnaire_completed) {
          navigate(createPageUrl('Questionnaire'));
          return;
        }
        
        // Set user data from backend
        setUser(data.user);
        setWatchlist(data.user.watchlist || []);
        setRecentlyViewed(data.user.recently_viewed || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate(createPageUrl('Home'));
      }
    };
    loadUser();
  }, [navigate]);

  const handleCompanySelect = async (company) => {
    setLoading(true);
    try {
      // Use mock data for now (you can integrate real API calls later)
      const financials = mockFinancialData[company.ticker] || {
        fcf: 1000, revenue: 10000, shares: 1000, price: 100,
        revenueHistory: []
      };
      
      setSelectedCompany({ 
        ...company, 
        ...financials,
        price: financials.price,
        fcf: financials.fcf,
        revenue: financials.revenue,
        shares: financials.shares,
        revenueHistory: financials.revenueHistory || []
      });
      setDcfResults(null);
      setAnalysis(null);
      
      // Update recently viewed in backend
      const newRecentlyViewed = [company.ticker, ...recentlyViewed.filter(t => t !== company.ticker)].slice(0, 8);
      setRecentlyViewed(newRecentlyViewed);
      
      try {
        const { apiRequest } = await import('@/utils/auth');
        await apiRequest('/me', {
          method: 'PUT',
          body: JSON.stringify({ recently_viewed: newRecentlyViewed })
        });
      } catch (error) {
        console.error('Failed to update recently viewed:', error);
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error);
      const financials = mockFinancialData[company.ticker] || {
        fcf: 1000, revenue: 10000, shares: 1000, price: 100
      };
      setSelectedCompany({ ...company, ...financials });
    } finally {
      setLoading(false);
    }
  };

  const handleDcfCalculate = (results) => {
    setDcfResults(results);
    
    if (selectedCompany && results.fairValuePerShare) {
      const analysisResult = generateAnalysisConclusion({
        ticker: selectedCompany.ticker,
        fairValue: results.fairValuePerShare,
        currentPrice: selectedCompany.price,
        marginOfSafety: ((results.fairValuePerShare - selectedCompany.price) / results.fairValuePerShare) * 100,
        investorProfile: user?.investor_category || 'moderate',
        growthRate: results.growthRate,
        discountRate: results.discountRate
      });
      setAnalysis(analysisResult);
    }
  };

  const handleAddToWatchlist = async () => {
    if (selectedCompany && !watchlist.includes(selectedCompany.ticker)) {
      const newWatchlist = [...watchlist, selectedCompany.ticker];
      setWatchlist(newWatchlist);
      
      try {
        const { apiRequest } = await import('@/utils/auth');
        await apiRequest('/me', {
          method: 'PUT',
          body: JSON.stringify({ watchlist: newWatchlist })
        });
      } catch (error) {
        console.error('Failed to update watchlist:', error);
      }
    }
  };

  const handleRemoveFromWatchlist = async (ticker) => {
    const newWatchlist = watchlist.filter(t => t !== ticker);
    setWatchlist(newWatchlist);
    
    try {
      const { apiRequest } = await import('@/utils/auth');
      await apiRequest('/me', {
        method: 'PUT',
        body: JSON.stringify({ watchlist: newWatchlist })
      });
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const handleWatchlistSelect = (ticker) => {
    const company = { ticker, name: ticker, price: mockFinancialData[ticker]?.price || 100 };
    handleCompanySelect(company);
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">DCF Analyzer</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <InvestorBadge profile={user?.investor_category} />
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(createPageUrl('MarketCapDCF'))}
                    className="text-slate-300 hover:text-white"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Market Cap DCF
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(createPageUrl('FairValueDCF'))}
                    className="text-slate-300 hover:text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Fair Value DCF
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(createPageUrl('Charts'))}
                    className="text-slate-300 hover:text-white"
                  >
                    <LineChart className="w-4 h-4 mr-2" />
                    Charts
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(createPageUrl('Profile'))}
                    className="text-slate-300 hover:text-white"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  {user?.role === 'admin' && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate(createPageUrl('CompanyManagement'))}
                      className="text-slate-300 hover:text-white"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Company Mgmt
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-400">
              Search for a company to begin your DCF valuation analysis.
            </p>
          </motion.div>

          {/* Real-Time Data Notice */}
          <RealTimeDisclaimer />

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <CompanySearch onSelect={handleCompanySelect} />
          </motion.div>

          {/* Company Sections */}
          {!selectedCompany && (
            <>
              <CompanySection 
                title="Recommended" 
                tickers={['AAPL', 'MSFT', 'GOOGL', 'NVDA']}
                onSelect={handleCompanySelect}
              />
              
              {recentlyViewed.length > 0 && (
                <CompanySection 
                  title="Recently Viewed" 
                  tickers={recentlyViewed.slice(0, 8)}
                  onSelect={handleCompanySelect}
                />
              )}
            </>
          )}

          {/* Selected Company Stats */}
          {selectedCompany && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCompany.name}</h2>
                    <p className="text-slate-400">{selectedCompany.ticker} • {selectedCompany.sector}</p>
                  </div>
                </div>
                <Button
                  onClick={handleAddToWatchlist}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  disabled={watchlist.includes(selectedCompany.ticker)}
                >
                  {watchlist.includes(selectedCompany.ticker) ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Current Price"
                  value={`$${selectedCompany.price?.toFixed(2)}`}
                  icon={DollarSign}
                />
                <StatCard
                  title="Free Cash Flow"
                  value={`$${(selectedCompany.fcf / 1000).toFixed(1)}B`}
                  icon={TrendingUp}
                  subtitle="TTM"
                />
                <StatCard
                  title="Est. Fair Value"
                  value={dcfResults?.fairValuePerShare ? `$${dcfResults.fairValuePerShare.toFixed(2)}` : '--'}
                  icon={Target}
                  valueClassName={dcfResults?.fairValuePerShare > selectedCompany.price ? 'text-emerald-400' : 'text-red-400'}
                />
                <StatCard
                  title="Margin of Safety"
                  value={dcfResults?.fairValuePerShare 
                    ? `${(((dcfResults.fairValuePerShare - selectedCompany.price) / dcfResults.fairValuePerShare) * 100).toFixed(1)}%`
                    : '--'}
                  icon={BarChart3}
                />
              </div>

              <PriceChart ticker={selectedCompany.ticker} currentPrice={selectedCompany.price} />
            </motion.div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - DCF Calculator */}
            <div className="xl:col-span-2 space-y-8">
              {selectedCompany ? (
                <>
                  <DCFCalculator
                    type="fair_value"
                    investorProfile={user?.investor_category}
                    initialValues={{
                      freeCashFlow: selectedCompany.recommended || selectedCompany.fcf,
                      netIncome: selectedCompany.netIncome,
                      sharesOutstanding: selectedCompany.shares,
                      currentPrice: selectedCompany.price
                    }}
                    onCalculate={handleDcfCalculate}
                  />
                </>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Company</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Search for a company above to load financial data and perform DCF valuation analysis.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Watchlist & Analysis */}
            <div className="space-y-8">
              <WatchlistCard
                watchlist={watchlist}
                onSelect={handleWatchlistSelect}
                onRemove={handleRemoveFromWatchlist}
                onAdd={() => {}}
              />
              
              {analysis && selectedCompany && (
                <AnalysisCard
                  analysis={analysis}
                  ticker={selectedCompany.ticker}
                  currentPrice={selectedCompany.price}
                  fairValue={dcfResults?.fairValuePerShare}
                  investorProfile={user?.investor_category}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}