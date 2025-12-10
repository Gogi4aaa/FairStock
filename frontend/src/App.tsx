import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockChart from './components/StockChart';
import './CSS/App.css';

const metaData = [
  { date: '2023-12-01', price: 135 },
  { date: '2023-12-02', price: 142 },
  { date: '2023-12-03', price: 140 },
  { date: '2023-12-04', price: 147 },
  { date: '2023-12-05', price: 150 },
  { date: '2023-12-06', price: 159 },
  { date: '2023-12-07', price: 153 },
];
const googleData = [
  { date: '2023-12-01', price: 130 },
  { date: '2023-12-02', price: 132 },
  { date: '2023-12-03', price: 137 },
  { date: '2023-12-04', price: 140 },
  { date: '2023-12-05', price: 143 },
  { date: '2023-12-06', price: 145 },
  { date: '2023-12-07', price: 149 },
];
const appleData = [
  { date: '2023-12-01', price: 170 },
  { date: '2023-12-02', price: 172 },
  { date: '2023-12-03', price: 171 },
  { date: '2023-12-04', price: 174 },
  { date: '2023-12-05', price: 178 },
  { date: '2023-12-06', price: 182 },
  { date: '2023-12-07', price: 185 },
];

function Companies() {
  return (
    <div>
      <h2>Companies</h2>
      <p>List of tracked companies will go here.</p>
    </div>
  );
}

const ChartsScroll = () => (
  <div className="charts-scroll">
    <StockChart
      name="Meta"
      symbol="META"
      logoUrl="https://logo.clearbit.com/meta.com"
      peRatio={31.52}
      data={metaData}
    />
    <StockChart
      name="Google"
      symbol="GOOGL"
      logoUrl="https://logo.clearbit.com/abc.xyz"
      peRatio={23.66}
      data={googleData}
    />
    <StockChart
      name="Apple"
      symbol="AAPL"
      logoUrl="https://logo.clearbit.com/apple.com"
      peRatio={30.28}
      data={appleData}
    />
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <span className="nav-logo">FairStock</span>
      <button className="nav-menu-btn" onClick={()=>setOpen(!open)}>
        <span className="nav-menu-icon">&#9776;</span>
      </button>
      <div className={`nav-links ${open ? 'active' : ''}`} onClick={()=>setOpen(false)}>
        <Link to="/" className="navLink">Dashboard</Link>
        <Link to="/companies" className="navLink">Companies</Link>
      </div>
    </nav>
  );
};

function Dashboard() {
  return (
    <div>
      <ChartsScroll />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="appLayout">
        <Navbar />
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
