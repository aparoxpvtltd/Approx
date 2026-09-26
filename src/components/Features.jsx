const Features = () => (
  <section id="features" className="features-section" style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}>
    <div className="section-header" style={{ position: 'relative', zIndex: 1 }}>
      <h2 className="serif">Our <i>Methodology</i></h2>
      <p className="mono">Engineered for Growth</p>
    </div>
    <div className="features-grid" style={{ position: 'relative', zIndex: 1 }}>
      <div className="feature-card reveal-text">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
        <h4 className="serif">Market Intelligence</h4>
        <p>Real-time data analysis to uncover your exact Total Addressable Market (TAM) before building.</p>
      </div>
      <div className="feature-card reveal-text">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
        </div>
        <h4 className="serif">Bespoke Development</h4>
        <p>High-fidelity, custom-coded web platforms tailored specifically to your brand's DNA.</p>
      </div>
      <div className="feature-card reveal-text">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h4 className="serif">Conversion Focused</h4>
        <p>Data-driven UI/UX design architecture guaranteed to turn your web traffic into profit.</p>
      </div>
      <div className="feature-card reveal-text">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <h4 className="serif">Seamless Integration</h4>
        <p>From robust e-commerce backends to fully automated local lead generation systems.</p>
      </div>
    </div>
  </section>
);

export default Features;
