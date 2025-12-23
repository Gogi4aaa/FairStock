import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, Percent, Calendar, DollarSign } from 'lucide-react';

export function calculateDCF({
  freeCashFlow,
  growthRate,
  discountRate,
  terminalGrowthRate,
  projectionYears,
  sharesOutstandingPercent = null,
  expectedPE = null
}) {
  const fcf = parseFloat(freeCashFlow) || 0;
  const growth = parseFloat(growthRate) / 100 || 0.1;
  const discount = parseFloat(discountRate) / 100 || 0.1;
  const terminalGrowth = parseFloat(terminalGrowthRate) / 100 || 0.02;
  const years = parseInt(projectionYears) || 5;
  
  // Project future FCFs
  let projectedFCFs = [];
  let currentFCF = fcf;
  
  for (let i = 1; i <= years; i++) {
    currentFCF = currentFCF * (1 + growth);
    projectedFCFs.push({
      year: i,
      fcf: currentFCF,
      discountedFCF: currentFCF / Math.pow(1 + discount, i)
    });
  }
  
  // Calculate terminal value (Gordon Growth Model)
  const terminalFCF = currentFCF * (1 + terminalGrowth);
  const terminalValue = terminalFCF / (discount - terminalGrowth);
  const discountedTerminalValue = terminalValue / Math.pow(1 + discount, years);
  
  // Sum of discounted FCFs
  const sumDiscountedFCFs = projectedFCFs.reduce((sum, item) => sum + item.discountedFCF, 0);
  
  // Enterprise Value
  const enterpriseValue = sumDiscountedFCFs + discountedTerminalValue;
  
  // Fair value per share (DCF method)
  let fairValuePerShare = null;
  if (sharesOutstandingPercent && parseFloat(sharesOutstandingPercent) > 0) {
    const sharesInMillions = (enterpriseValue * (parseFloat(sharesOutstandingPercent) / 100));
    fairValuePerShare = enterpriseValue / sharesInMillions;
  }
  
  // P/E-based fair value
  let peFairValue = null;
  if (expectedPE && sharesOutstandingPercent && parseFloat(sharesOutstandingPercent) > 0) {
    const finalYearFCF = projectedFCFs[projectedFCFs.length - 1].fcf;
    const estimatedEarnings = finalYearFCF * 1.3;
    const sharesInMillions = (enterpriseValue * (parseFloat(sharesOutstandingPercent) / 100));
    peFairValue = (estimatedEarnings * parseFloat(expectedPE)) / sharesInMillions;
  }
  
  return {
    projectedFCFs,
    terminalValue,
    discountedTerminalValue,
    sumDiscountedFCFs,
    enterpriseValue,
    equityValue: enterpriseValue,
    fairValuePerShare,
    peFairValue,
    estimatedMarketCap: enterpriseValue
  };
}

export default function DCFCalculator({ 
  type = 'market_cap', 
  initialValues = {},
  onCalculate,
  investorProfile = 'moderate',
  companyName = ''
}) {
  const [values, setValues] = useState({
    manualValue: '',
    growthRate: initialValues.growthRate || 15,
    discountRate: initialValues.discountRate || 10,
    terminalGrowthRate: initialValues.terminalGrowthRate || 2.5,
    projectionYears: initialValues.projectionYears || 5,
    sharesOutstandingPercent: initialValues.sharesOutstandingPercent || 10,
    expectedPE: initialValues.expectedPE || '',
    currentPrice: initialValues.currentPrice || ''
  });
  
  const [results, setResults] = useState(null);
  
  // Adjust default rates based on investor profile
  useEffect(() => {
    const profileDefaults = {
      conservative: { discountRate: 12, growthRate: 10 },
      moderate: { discountRate: 10, growthRate: 15 },
      aggressive: { discountRate: 8, growthRate: 20 }
    };
    const defaults = profileDefaults[investorProfile] || profileDefaults.moderate;
    setValues(prev => ({
      ...prev,
      discountRate: defaults.discountRate,
      growthRate: defaults.growthRate
    }));
  }, [investorProfile]);

  const handleCalculate = () => {
    const inputValue = parseFloat(values.manualValue) || 0;
    
    const dcfResults = calculateDCF({
      freeCashFlow: inputValue,
      growthRate: values.growthRate,
      discountRate: values.discountRate,
      terminalGrowthRate: values.terminalGrowthRate,
      projectionYears: values.projectionYears,
      sharesOutstandingPercent: type === 'fair_value' ? values.sharesOutstandingPercent : null,
      expectedPE: values.expectedPE
    });
    
    setResults(dcfResults);
    
    if (onCalculate) {
      onCalculate({
        ...values,
        ...dcfResults,
        type,
        currentPrice: values.currentPrice
      });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          {type === 'market_cap' ? 'Market Cap DCF Calculator' : 'Fair Value Per Share Calculator'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* FCF/Earnings Input */}
        <div className="space-y-3">
          <Label className="text-slate-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Free Cash Flow/Earnings ($ billions)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={values.manualValue}
            onChange={(e) => setValues({ ...values, manualValue: e.target.value })}
            placeholder="Enter value in billions (e.g., 99.5)"
            className="bg-slate-800 border-slate-700 text-white"
            required
          />
          <p className="text-xs text-slate-500">
            Enter the company's free cash flow or net income in billions
          </p>
        </div>

        {type === 'fair_value' && (
          <div className="space-y-3">
            <Label className="text-slate-300">Current Stock Price (Optional)</Label>
            <Input
              type="number"
              step="0.01"
              value={values.currentPrice}
              onChange={(e) => setValues({ ...values, currentPrice: e.target.value })}
              placeholder="e.g., 178.50"
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-500">
              Enter current price to calculate margin of safety
            </p>
          </div>
        )}

        {/* Growth Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Growth Rate
            </Label>
            <span className="text-lg font-bold text-indigo-400">{values.growthRate}%</span>
          </div>
          <Slider
            value={[values.growthRate]}
            onValueChange={(val) => setValues({ ...values, growthRate: val[0] })}
            min={0}
            max={40}
            step={0.5}
            className="py-2"
          />
        </div>

        {/* Discount Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Discount Rate (WACC)</Label>
            <span className="text-lg font-bold text-amber-400">{values.discountRate}%</span>
          </div>
          <Slider
            value={[values.discountRate]}
            onValueChange={(val) => setValues({ ...values, discountRate: val[0] })}
            min={5}
            max={20}
            step={0.5}
            className="py-2"
          />
        </div>

        {/* Terminal Growth */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Terminal Growth Rate</Label>
            <span className="text-lg font-bold text-emerald-400">{values.terminalGrowthRate}%</span>
          </div>
          <Slider
            value={[values.terminalGrowthRate]}
            onValueChange={(val) => setValues({ ...values, terminalGrowthRate: val[0] })}
            min={0}
            max={5}
            step={0.1}
            className="py-2"
          />
        </div>

        {/* Projection Years */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Projection Years
            </Label>
            <span className="text-lg font-bold text-white">{values.projectionYears} years</span>
          </div>
          <Slider
            value={[values.projectionYears]}
            onValueChange={(val) => setValues({ ...values, projectionYears: val[0] })}
            min={3}
            max={10}
            step={1}
            className="py-2"
          />
        </div>

        {/* Fair Value specific inputs */}
        {type === 'fair_value' && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Shares Outstanding (% of EV)
                </Label>
                <span className="text-lg font-bold text-purple-400">{values.sharesOutstandingPercent}%</span>
              </div>
              <Slider
                value={[values.sharesOutstandingPercent]}
                onValueChange={(val) => setValues({ ...values, sharesOutstandingPercent: val[0] })}
                min={0}
                max={50}
                step={0.5}
                className="py-2"
              />
              <p className="text-xs text-slate-500">Set to 0% to skip per-share calculation</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Expected P/E Ratio (Optional)</Label>
              <Input
                type="number"
                value={values.expectedPE}
                onChange={(e) => setValues({ ...values, expectedPE: e.target.value })}
                placeholder="e.g., 15, 25, 30"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </>
        )}

        <Button 
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-6"
        >
          Calculate Valuation
        </Button>

        {/* Results */}
        {results && (
          <div className="mt-6 p-6 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Valuation Results</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/50">
                <p className="text-sm text-slate-400 mb-1">Enterprise Value</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(results.enterpriseValue * 1e6)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50">
                <p className="text-sm text-slate-400 mb-1">
                  {type === 'market_cap' ? 'Est. Market Cap' : 'Equity Value'}
                </p>
                <p className="text-xl font-bold text-indigo-400">
                  {formatNumber(results.equityValue * 1e6)}
                </p>
              </div>
            </div>
            
            {type === 'fair_value' && results.fairValuePerShare && (
              <>
                <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                  <p className="text-sm text-slate-300 mb-1">DCF Fair Value Per Share</p>
                  <p className="text-3xl font-bold text-white">
                    ${results.fairValuePerShare.toFixed(2)}
                  </p>
                </div>
                
                {results.peFairValue && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <p className="text-sm text-slate-300 mb-1">P/E-Based Fair Value Per Share</p>
                    <p className="text-3xl font-bold text-white">
                      ${results.peFairValue.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Alternative valuation based on expected P/E multiple
                    </p>
                  </div>
                )}
              </>
            )}
            
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-sm text-slate-400 mb-1">Terminal Value (PV)</p>
              <p className="text-lg font-semibold text-white">
                {formatNumber(results.discountedTerminalValue * 1e6)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}