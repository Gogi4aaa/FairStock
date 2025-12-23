import Layout from "./Layout.jsx";

import Charts from "./Charts";

import Dashboard from "./Dashboard";

import FairValueDCF from "./FairValueDCF";

import Home from "./Home";

import MarketCapDCF from "./MarketCapDCF";

import Profile from "./Profile";

import Questionnaire from "./Questionnaire";

import Auth from "./Auth";

import CompanyManagement from "./CompanyManagement";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Charts: Charts,
    
    Dashboard: Dashboard,
    
    FairValueDCF: FairValueDCF,
    
    Home: Home,
    
    MarketCapDCF: MarketCapDCF,
    
    Profile: Profile,
    
    Questionnaire: Questionnaire,
    
    Auth: Auth,
    
    CompanyManagement: CompanyManagement,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Charts />} />
                
                
                <Route path="/Charts" element={<Charts />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/FairValueDCF" element={<FairValueDCF />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/MarketCapDCF" element={<MarketCapDCF />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Questionnaire" element={<Questionnaire />} />
                
                <Route path="/Auth" element={<Auth />} />
                
                <Route path="/CompanyManagement" element={<CompanyManagement />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}