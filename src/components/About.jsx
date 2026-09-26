const About = () => (
  <section id="about" className="about-section reveal-text">
    <div className="about-container">
      <div className="about-visual" style={{ position: 'relative', background: 'transparent' }}>
        <div className="blob-gradient"></div>
        <div className="noise-overlay"></div>
      </div>
      <div className="about-content">
        <h2 className="mono tag">The Agency</h2>
        <h3 className="serif">Bridging Analytics & <i>Experience</i></h3>
        <p>At Aparox, we believe that beautiful design must be backed by hard data. We don't just build stunning web experiences; we analyze real-world market data to prove your ROI before we write a single line of code. From local brick-and-mortars to global enterprises, we engineer scalable online growth.</p>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="serif">500+</span>
            <p className="mono">Businesses Analyzed</p>
          </div>
          <div className="stat-item">
            <span className="serif">$12M+</span>
            <p className="mono">Client Revenue Generated</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
