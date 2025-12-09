import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockChart from './components/StockChart';
import './CSS/App.css';

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
    <div>
      <StockChart />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="appLayout">
        <aside className="sidebar">
          <h1 className="logo">FairStock</h1>
          <nav className="navLinks">
            <Link to="/" className="navLink">Dashboard</Link>
            <Link to="/companies" className="navLink">Companies</Link>
          </nav>
        </aside>
        <main className="appMain">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
