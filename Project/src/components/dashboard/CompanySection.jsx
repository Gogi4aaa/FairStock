import React from 'react';
import { motion } from 'framer-motion';
import CompanyCard from './CompanyCard';

export default function CompanySection({ title, tickers, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tickers.map((ticker) => (
          <CompanyCard key={ticker} ticker={ticker} onSelect={onSelect} />
        ))}
      </div>
    </motion.div>
  );
}