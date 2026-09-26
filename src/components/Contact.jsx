import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('SENDING...');

    const { name, email, message } = formData;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon')) {
      // Fallback to mailto link if Supabase is not configured yet
      console.warn('Supabase keys not configured in .env. Falling back to mailto.');
      const subject = `Project Inquiry from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailtoLink = `mailto:aparoxpvtltd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setTimeout(() => {
        window.location.href = mailtoLink;
        setStatus('REDIRECTING TO MAIL CLIENT...');
        setLoading(false);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 3000);
      }, 800);
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        setStatus('MESSAGE SENT SUCCESSFULLY!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      setStatus(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <section className="contact-section" id="contact" style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <div className="contact-container reveal-text" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-card">
          <div className="contact-info">
            <h2 className="serif">Ready to scale your <i>business</i> online?</h2>
            <p className="mono">REQUEST A CUSTOM MARKET AUDIT AND WEB BUILD PROPOSAL.</p>
            
            <div className="contact-methods">
              <div className="method-item">
                <span className="method-label mono">EMAIL</span>
                <a href="mailto:hello@aparox.ai" className="method-link serif">hello@aparox.ai</a>
              </div>
              <div className="method-item">
                <span className="method-label mono">LOCATION</span>
                <p className="method-link serif">Mysore, India</p>
              </div>
            </div>

            <div className="social-pills">
              <a href="#" className="social-pill">INSTAGRAM</a>
              <a href="#" className="social-pill">LINKEDIN</a>
              <a href="#" className="social-pill">TWITTER</a>
            </div>
          </div>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" id="name" placeholder="YOUR NAME" value={formData.name} onChange={handleChange} required autoComplete="off" />
              <label htmlFor="name" className="mono">NAME</label>
            </div>
            <div className="form-group">
              <input type="email" id="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={handleChange} required autoComplete="off" />
              <label htmlFor="email" className="mono">EMAIL</label>
            </div>
            <div className="form-group">
              <textarea id="message" placeholder="TELL US ABOUT YOUR BUSINESS OR PROJECT" value={formData.message} onChange={handleChange} rows="4" required></textarea>
              <label htmlFor="message" className="mono">MESSAGE</label>
            </div>
            <button type="submit" className="submit-btn mono" disabled={loading}>
              <span>{loading ? 'SENDING...' : status === 'MESSAGE SENT SUCCESSFULLY!' || status === 'REDIRECTING TO MAIL CLIENT...' ? 'SENT' : 'SEND MESSAGE'}</span>
              {!loading && status !== 'MESSAGE SENT SUCCESSFULLY!' && status !== 'REDIRECTING TO MAIL CLIENT...' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>}
            </button>
            <div className="form-status" id="form-status" style={{ color: status.startsWith('ERROR') ? '#ef4444' : status.startsWith('MESSAGE') ? '#10b981' : '#818cf8' }}>{status}</div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
