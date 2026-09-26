import { useState } from 'react';

const Analytics = () => {
  const [bizName, setBizName] = useState('');
  const [bizLocation, setBizLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bizName || !bizLocation) return;

    setLoading(true);
    setResults(null);

    // Mock Scraper Delay
    setTimeout(() => {
      const mockTAM = Math.floor(Math.random() * (5000000 - 500000 + 1)) + 500000;
      const mockCustomers = Math.floor(Math.random() * (5000 - 300 + 1)) + 300;
      const mockProfit = Math.floor(Math.random() * (150000 - 20000 + 1)) + 20000;

      setResults({
        name: bizName,
        location: bizLocation,
        tam: mockTAM,
        customers: mockCustomers,
        profit: mockProfit
      });
      setLoading(false);
    }, 2500);
  };

  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  return (
    <section id="analytics" className="analytics-section">
      <div className="analytics-container reveal-text">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="serif">Market <i>Intelligence</i></h2>
          <p className="mono">Real-time Business Potential Analysis</p>
        </div>
        
        <div className="analytics-card">
          <form id="analytics-form" className="analytics-form" onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="input-group">
                <label className="mono" htmlFor="biz-name">Business / Shop Name</label>
                <input 
                  type="text" 
                  id="biz-name" 
                  placeholder="e.g. Joe's Coffee Shop" 
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="mono" htmlFor="biz-location">Location</label>
                <input 
                  type="text" 
                  id="biz-location" 
                  placeholder="e.g. Downtown Seattle" 
                  value={bizLocation}
                  onChange={(e) => setBizLocation(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="analyze-btn" disabled={loading}>
              <span className="btn-text" style={{ display: loading ? 'none' : 'block' }}>Analyze Potential</span>
              {loading && <div className="btn-loader"></div>}
            </button>
          </form>

          {results && (
            <div id="analytics-results" className="analytics-results">
              <div className="result-header">
                <h3 className="serif">Intelligence Report</h3>
                <p className="mono">Target: {results.name} ({results.location})</p>
              </div>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-label mono">Total Addressable Market (TAM)</div>
                  <div className="stat-value">{formatCurrency(results.tam)}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label mono">Local Customers / Month</div>
                  <div className="stat-value">{formatNumber(results.customers)}</div>
                </div>
                <div className="stat-box accent-box">
                  <div className="stat-label mono">Online Profit Potential</div>
                  <div className="stat-value">{formatCurrency(results.profit)}</div>
                  <div className="stat-sub">Estimated Annual Increase</div>
                </div>
              </div>
              <div className="result-footer">
                <p className="mono" style={{ opacity: 0.5, fontSize: '10px', textAlign: 'center', marginTop: '2rem' }}>
                  *Mock data active. Live web scraper integration pending.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
