import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { ArrowLeft, LineChart, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import InvestorBadge from '@/components/ui/InvestorBadge';
import RevenueChart from '@/components/charts/RevenueChart';
import ValuationHistogram from '@/components/charts/ValuationHistogram';
import RiskGauge from '@/components/charts/RiskGauge';

// Mock data
const companyData = {
  AAPL: {
    name: 'Apple Inc.',
    revenueHistory: [
      { year: '2019', value: 260000 },
      { year: '2020', value: 274000 },
      { year: '2021', value: 365000 },
      { year: '2022', value: 394000 },
      { year: '2023', value: 383000 },
      { year: '2024E', value: 400000 }
    ],
    fcfHistory: [
      { year: '2019', value: 58000 },
      { year: '2020', value: 73000 },
      { year: '2021', value: 93000 },
      { year: '2022', value: 111000 },
      { year: '2023', value: 99000 },
      { year: '2024E', value: 105000 }
    ],
    currentPrice: 178.50,
    fairValue: 195
  },
  MSFT: {
    name: 'Microsoft Corporation',
    revenueHistory: [
      { year: '2019', value: 125000 },
      { year: '2020', value: 143000 },
      { year: '2021', value: 168000 },
      { year: '2022', value: 198000 },
      { year: '2023', value: 211000 },
      { year: '2024E', value: 240000 }
    ],
    fcfHistory: [
      { year: '2019', value: 38000 },
      { year: '2020', value: 45000 },
      { year: '2021', value: 56000 },
      { year: '2022', value: 65000 },
      { year: '2023', value: 59000 },
      { year: '2024E', value: 70000 }
    ],
    currentPrice: 378.20,
    fairValue: 420
  },
  NVDA: {
    name: 'NVIDIA Corporation',
    revenueHistory: [
      { year: '2019', value: 11700 },
      { year: '2020', value: 16700 },
      { year: '2021', value: 26900 },
      { year: '2022', value: 27000 },
      { year: '2023', value: 60000 },
      { year: '2024E', value: 120000 }
    ],
    fcfHistory: [
      { year: '2019', value: 2800 },
      { year: '2020', value: 4400 },
      { year: '2021', value: 8100 },
      { year: '2022', value: 3800 },
      { year: '2023', value: 27000 },
      { year: '2024E', value: 55000 }
    ],
    currentPrice: 875.30,
    fairValue: 750
  }
};

// Generate valuation distribution data
const generateDistribution = (fairValue, currentPrice, profile) => {
  const spread = profile === 'conservative' ? 0.15 : profile === 'aggressive' ? 0.35 : 0.25;
  const points = [];
  
  for (let i = -50; i <= 50; i += 5) {
    const price = Math.round(fairValue + (fairValue * (i / 100)));
    const distance = Math.abs(i) / 50;
    let probability = Math.exp(-3 * distance * distance);
    
    // Adjust based on investor profile
    if (profile === 'aggressive') {
      probability *= (i > 0 ? 1.2 : 0.8);
    } else if (profile === 'conservative') {
      probability *= (i < 0 ? 1.2 : 0.8);
    }
    
    points.push({ price, probability: probability * 0.3 });
  }
  
  return points;
};

export default function Charts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('AAPL');

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
        setLoading(false);
      } catch (error) {
        console.error(error);
        navigate(createPageUrl('Home'));
      }
    };
    loadUser();
  }, [navigate]);

  const company = companyData[selectedCompany];
  const investorProfile = user?.investor_category || 'moderate';
  const distributionData = generateDistribution(company.fairValue, company.currentPrice, investorProfile);

  const profileColors = {
    conservative: '#10b981',
    moderate: '#3b82f6',
    aggressive: '#f97316'
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
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
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                    <LineChart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Data Visualization</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="AAPL" className="text-white hover:bg-slate-700">Apple Inc.</SelectItem>
                    <SelectItem value="MSFT" className="text-white hover:bg-slate-700">Microsoft</SelectItem>
                    <SelectItem value="NVDA" className="text-white hover:bg-slate-700">NVIDIA</SelectItem>
                  </SelectContent>
                </Select>
                <InvestorBadge profile={investorProfile} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
            <p className="text-slate-400">
              Interactive charts showing financial trends and valuation distributions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <RevenueChart 
                data={company.revenueHistory} 
                title="Revenue Growth ($ millions)"
                color={profileColors[investorProfile]}
              />
            </motion.div>

            {/* FCF Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RevenueChart 
                data={company.fcfHistory} 
                title="Free Cash Flow Growth ($ millions)"
                color="#a855f7"
              />
            </motion.div>

            {/* Valuation Histogram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ValuationHistogram
                data={distributionData}
                currentPrice={company.currentPrice}
                fairValue={company.fairValue}
                investorProfile={investorProfile}
              />
            </motion.div>

            {/* Risk Gauge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RiskGauge 
                score={user?.risk_score || 50} 
                label="Your Risk Score"
              />
            </motion.div>
          </div>

          {/* Legend / Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Understanding the Charts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-400">
              <div>
                <h4 className="text-white font-medium mb-2">Revenue & FCF Growth</h4>
                <p className="text-sm leading-relaxed">
                  Historical growth trends show the company's financial trajectory. 
                  Strong, consistent growth typically supports higher valuations. 
                  Look for acceleration or deceleration patterns.
                </p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Valuation Distribution</h4>
                <p className="text-sm leading-relaxed">
                  The histogram shows the probability distribution of fair values based on 
                  various scenarios. The vertical lines indicate current price (amber) and 
                  estimated fair value (profile color).
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}