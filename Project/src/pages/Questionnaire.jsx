import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InvestorQuestionnaire from '@/components/questionnaire/InvestorQuestionnaire';
import ProfileResult from '@/components/questionnaire/ProfileResult';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';
import { apiRequest, isAuthenticated } from '@/utils/auth';
import { toast } from 'sonner';

export default function Questionnaire() {
  const navigate = useNavigate();
  const [stage, setStage] = useState('questionnaire'); // questionnaire | result
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
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

        // Check if questionnaire already completed
        if (data.user?.questionnaire_completed) {
          navigate(createPageUrl('Dashboard'));
          return;
        }
        
        // Set user data
        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        navigate(createPageUrl('Home'));
      }
    };
    checkUser();
  }, [navigate]);

  const handleComplete = async (data) => {
    setResult(data);
    setStage('result');
    
    try {
      // Save to backend database
      const resp = await apiRequest('/me', {
        method: 'PUT',
        body: JSON.stringify({
          investor_category: data.category,
          questionnaire_completed: true,
          questionnaire_answers: data.answers,
          risk_score: data.riskScore
        })
      });

      if (resp.ok) {
        toast.success('Profile saved successfully!');
      } else {
        toast.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Failed to save questionnaire:', error);
      toast.error('Failed to save profile');
    }
  };

  const handleContinue = () => {
    navigate(createPageUrl('Dashboard'));
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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {stage === 'questionnaire' ? 'Investor Profile Assessment' : 'Your Investment Profile'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {stage === 'questionnaire' 
              ? 'Answer these questions to help us personalize your investment analysis experience.'
              : 'Based on your responses, here is your personalized investor profile.'
            }
          </p>
        </motion.div>

        {/* Content */}
        {stage === 'questionnaire' ? (
          <InvestorQuestionnaire onComplete={handleComplete} />
        ) : (
          <ProfileResult 
            category={result.category}
            riskScore={result.riskScore}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}