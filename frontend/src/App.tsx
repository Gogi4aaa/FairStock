import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockChart from './components/StockChart';

function Companies() {
  return (
    <div>
      <h2>Companies</h2>
      <p>List of tracked companies will go here.</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ marginTop: 48 }}>
      <StockChart />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
        <header style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
          <Link to="/" style={{ marginRight: 16, textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/companies" style={{ textDecoration: 'none' }}>Companies</Link>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
