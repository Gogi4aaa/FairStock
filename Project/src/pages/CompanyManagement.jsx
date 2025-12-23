import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Building2, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Search,
  Clock,
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API_BASE_URL = 'http://localhost:3001/api';

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/validate`, { 
        credentials: 'include' 
      });
      const { authenticated, username } = await resp.json();
      
      if (!authenticated) {
        navigate(createPageUrl('Home'));
        return;
      }

      // For now, check admin role from localStorage (you can add this to backend later)
      const isAdmin = localStorage.getItem('role') === 'admin';
      setUser({ username, role: isAdmin ? 'admin' : 'user' });

      if (!isAdmin) {
        toast.error('Access denied: Admin only');
        navigate(createPageUrl('Dashboard'));
        return;
      }

      const [requestsData, companiesData] = await Promise.all([
        base44.entities.CompanyRequest.list(),
        base44.entities.Company.list()
      ]);

      setRequests(requestsData);
      setCompanies(companiesData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    setProcessingId(request.id);
    try {
      // Create company in database
      await base44.entities.Company.create({
        ticker: request.ticker || request.company_name.toUpperCase().replace(/\s+/g, ''),
        name: request.company_name,
        sector: 'General',
        current_price: 0,
        market_cap: 0
      });

      // Update request status
      await base44.entities.CompanyRequest.update(request.id, {
        status: 'approved'
      });

      toast.success(`${request.company_name} approved and added to database`);
      loadData();
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast.error('Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request) => {
    setProcessingId(request.id);
    try {
      await base44.entities.CompanyRequest.update(request.id, {
        status: 'rejected'
      });

      toast.success(`${request.company_name} request rejected`);
      loadData();
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error('Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.status === filterStatus &&
    req.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
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
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Company Management</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Pending Requests</p>
                      <p className="text-3xl font-bold text-amber-400">
                        {requests.filter(r => r.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-10 h-10 text-amber-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Approved</p>
                      <p className="text-3xl font-bold text-emerald-400">
                        {requests.filter(r => r.status === 'approved').length}
                      </p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Total Companies</p>
                      <p className="text-3xl font-bold text-indigo-400">
                        {companies.length}
                      </p>
                    </div>
                    <Building2 className="w-10 h-10 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies or requests..."
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('pending')}
                  className={filterStatus === 'pending' ? 'bg-amber-600' : 'border-slate-700 text-slate-300'}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'approved' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('approved')}
                  className={filterStatus === 'approved' ? 'bg-emerald-600' : 'border-slate-700 text-slate-300'}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('rejected')}
                  className={filterStatus === 'rejected' ? 'bg-red-600' : 'border-slate-700 text-slate-300'}
                >
                  Rejected
                </Button>
              </div>
            </div>

            {/* Requests List */}
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Company Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No {filterStatus} requests found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {request.company_name}
                              </h3>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                request.status === 'approved' && "bg-emerald-500/20 text-emerald-400",
                                request.status === 'pending' && "bg-amber-500/20 text-amber-400",
                                request.status === 'rejected' && "bg-red-500/20 text-red-400"
                              )}>
                                {request.status}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400 space-y-1">
                              <p>Requested by: {request.requested_by}</p>
                              <p>Date: {new Date(request.request_date).toLocaleDateString()}</p>
                              {request.ticker && <p>Ticker: {request.ticker}</p>}
                            </div>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove(request)}
                                disabled={processingId === request.id}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                {processingId === request.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleReject(request)}
                                disabled={processingId === request.id}
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Companies Database */}
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Companies Database</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredCompanies.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No companies found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white">{company.ticker}</h4>
                          <Building2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <p className="text-sm text-slate-400 mb-1">{company.name}</p>
                        <p className="text-xs text-slate-500">{company.sector}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}