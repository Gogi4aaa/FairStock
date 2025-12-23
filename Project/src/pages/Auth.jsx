import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, setToken } from '@/utils/auth';

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        // Registration flow - use email as username
        const registerResponse = await apiRequest('/register', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.email,
            password: formData.password,
            email: formData.email,
            fullName: formData.fullName
          })
        });

        const registerData = await registerResponse.json();
        
        if (!registerResponse.ok) {
          throw new Error(registerData.message || 'Registration failed');
        }

        toast.success('Account created! Logging you in...');
        
        // Auto login after registration
        const loginResponse = await apiRequest('/login', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.email,
            password: formData.password
          })
        });

        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'Auto-login failed');
        }

        // Store JWT token
        setToken(loginData.token);
        
        // Check if questionnaire is needed
        const needsQuestionnaire = !loginData.user?.questionnaire_completed;
        onAuthSuccess(needsQuestionnaire);
      } else {
        // Login flow
        const loginResponse = await apiRequest('/login', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.email,
            password: formData.password
          })
        });

        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'Login failed');
        }

        // Store JWT token
        setToken(loginData.token);

        toast.success('Login successful!');
        
        // Check if questionnaire is needed
        const needsQuestionnaire = !loginData.user?.questionnaire_completed;
        onAuthSuccess(needsQuestionnaire);
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">DCF Analyzer</span>
          </div>
          <p className="text-slate-400">Professional DCF Valuation Tools</p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 rounded-lg bg-slate-800/50">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="fullName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Label className="text-slate-300 mb-2 block">Full Name</Label>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label className="text-slate-300 mb-2 block">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-6 mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}