import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calculator, Loader2, Send, CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DCFCalculator from '@/components/dcf/DCFCalculator';
import InvestorBadge from '@/components/ui/InvestorBadge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { apiRequest, isAuthenticated } from '@/utils/auth';

export default function MarketCapDCF() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyRequest, setCompanyRequest] = useState(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);

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
    if (!companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }
    setResults(data);
  };

  const handleRequestCompany = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    setSubmittingRequest(true);
    try {
      const request = await base44.entities.CompanyRequest.create({
        company_name: companyName,
        requested_by: user?.email,
        request_date: new Date().toISOString(),
        status: 'pending'
      });
      setCompanyRequest(request);
      toast.success('Company request submitted successfully');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request');
    } finally {
      setSubmittingRequest(false);
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
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
                  <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Market Cap DCF Calculator</span>
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
              <h2 className="text-lg font-semibold text-white mb-2">About Market Cap DCF</h2>
              <p className="text-slate-400 leading-relaxed">
                The Market Capitalization DCF model estimates a company's total equity value by discounting 
                projected free cash flows to their present value. This method is useful for comparing your 
                calculated market cap against the current market valuation to identify potential investment 
                opportunities.
              </p>
            </div>

            {/* Company Name Input */}
            <div className="mb-6 p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-slate-300 mb-2 block">
                    Company Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Private Tech Corp, Startup XYZ"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter the name of the company you want to analyze
                  </p>
                </div>
                
                {companyRequest ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                    {companyRequest.status === 'approved' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-medium">Approved</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-amber-400" />
                        <span className="text-sm text-amber-400 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleRequestCompany}
                    disabled={submittingRequest || !companyName.trim()}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 whitespace-nowrap"
                  >
                    {submittingRequest ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Request for Database
                  </Button>
                )}
              </div>
              
              {companyRequest && (
                <div className={cn(
                  "mt-4 p-3 rounded-lg border text-sm",
                  companyRequest.status === 'approved'
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                )}>
                  {companyRequest.status === 'approved' ? (
                    <p>Company approved and added to database. You can now add it to your watchlist.</p>
                  ) : (
                    <p>Request submitted. You can continue with your analysis while awaiting approval.</p>
                  )}
                </div>
              )}
            </div>

            {/* Calculator */}
            <DCFCalculator
              type="market_cap"
              investorProfile={user?.investor_category}
              onCalculate={handleCalculate}
              companyName={companyName}
            />

            {/* Additional Info */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Understanding Your Results</h3>
                <div className="space-y-3 text-slate-400 text-sm md:text-base">
                  <p>
                    <span className="text-white font-medium">Enterprise Value:</span> The sum of all 
                    discounted future cash flows, representing the total value of the business operations.
                  </p>
                  <p>
                    <span className="text-white font-medium">Estimated Market Cap:</span> Enterprise value 
                    adjusted for cash and debt, representing the theoretical equity value.
                  </p>
                  <p>
                    <span className="text-white font-medium">Key Assumptions:</span> Your growth rate of 
                    {results.growthRate}% and discount rate of {results.discountRate}% significantly 
                    impact the valuation. Adjust based on company-specific risks and growth potential.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}