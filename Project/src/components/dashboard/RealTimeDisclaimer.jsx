import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Database } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function RealTimeDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-300 mb-1">
                Real-Time Data Enabled
              </h4>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Live stock prices and financial data are fetched from Yahoo Finance and other financial APIs. 
                For enhanced data quality, you can optionally add API keys for Alpha Vantage or Financial Modeling Prep in Settings.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-300">
                <Database className="w-3 h-3" />
                <span>Data updates automatically from financial APIs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}