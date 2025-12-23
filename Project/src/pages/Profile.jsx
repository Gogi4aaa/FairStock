import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  User, 
  Mail, 
  Calendar,
  RefreshCw,
  Loader2,
  ArrowLeft,
  Shield,
  TrendingUp,
  Zap,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvestorBadge from '@/components/ui/InvestorBadge';
import { apiRequest, isAuthenticated, removeToken } from '@/utils/auth';

const profileIcons = {
  conservative: Shield,
  moderate: TrendingUp,
  aggressive: Zap
};

const profileColors = {
  conservative: 'from-emerald-500 to-teal-600',
  moderate: 'from-blue-500 to-indigo-600',
  aggressive: 'from-orange-500 to-red-600'
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!isAuthenticated()) {
          navigate(createPageUrl('Home'));
          return;
        }

        const resp = await apiRequest('/me');
        const data = await resp.json();
        
        if (!data.user) {
          navigate(createPageUrl('Home'));
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

  const handleRetakeQuestionnaire = async () => {
    try {
      await apiRequest('/me', {
        method: 'PUT',
        body: JSON.stringify({
          questionnaire_completed: false,
          investor_category: null,
          questionnaire_answers: null,
          risk_score: null
        })
      });
      navigate(createPageUrl('Questionnaire'));
    } catch (error) {
      console.error('Failed to reset questionnaire:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await apiRequest('/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Remove token and clear local storage
    removeToken();
    localStorage.clear();
    navigate(createPageUrl('Home'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const ProfileIcon = user?.investor_category ? profileIcons[user.investor_category] : User;
  const gradientColor = user?.investor_category ? profileColors[user.investor_category] : 'from-slate-500 to-slate-600';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('Dashboard'))}
          className="text-slate-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Picture */}
                <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                  <ProfileIcon className="w-16 h-16 text-white" />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {user?.full_name || 'User'}
                  </h1>
                  <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {new Date(user?.created_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {user?.investor_category && (
                    <InvestorBadge profile={user.investor_category} size="lg" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Investor Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-indigo-400 mb-2">
                  {user?.investor_category ? user.investor_category.charAt(0).toUpperCase() + user.investor_category.slice(1) : 'Not Set'}
                </p>
                {user?.risk_score && (
                  <p className="text-sm text-slate-400">Risk Score: {user.risk_score}/100</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-indigo-400 mb-2">
                  {user?.watchlist?.length || 0}
                </p>
                <p className="text-sm text-slate-400">Companies tracked</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-400 mb-2">Active</p>
                <p className="text-sm text-slate-400">Role: {user?.role || 'User'}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Questionnaire Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Investor Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Your investor profile determines the default parameters used in DCF calculations and analysis recommendations.
              </p>
              {user?.questionnaire_completed ? (
                <>
                  <p className="text-slate-400 text-sm">
                    You completed the investor assessment on {new Date(user.updated_date).toLocaleDateString()}. 
                    If your investment philosophy has changed or you made a mistake, you can retake the questionnaire.
                  </p>
                  <Button
                    onClick={handleRetakeQuestionnaire}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Questionnaire
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-amber-400 text-sm">
                    You haven't completed the investor assessment yet.
                  </p>
                  <Button
                    onClick={() => navigate(createPageUrl('Questionnaire'))}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    Start Assessment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Out Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}