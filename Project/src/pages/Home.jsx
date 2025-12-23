import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';
import Auth from './Auth';
import { apiRequest, isAuthenticated } from '@/utils/auth';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Checks with backend to validate auth session using JWT
  const checkAuth = async () => {
    try {
      // if (!isAuthenticated()) {
      //   setLoading(false);
      //   return;
      // }

      const resp = await apiRequest('/validate');
      const data = await resp.json();
      console.log("DATA",data);
      setIsAuthenticated(data.authenticated);
      
      if (data.authenticated && data.user) {
        // User is authenticated, check if questionnaire is completed
        const needsQuestionnaire = !data.user.questionnaire_completed;
        if (needsQuestionnaire) {
          navigate(createPageUrl('Questionnaire'));
        } else {
          navigate(createPageUrl('Dashboard'));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (requiresQuestionnaire) => {
    setIsAuthenticated(true);
    if (requiresQuestionnaire) {
      navigate(createPageUrl('Questionnaire'));
    } else {
      checkAuth(); // Re-check to navigate properly
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show in-app auth component
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return null;
}