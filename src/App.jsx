import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Chat from './components/Chat';
import Analytics from './components/Analytics';
import About from './components/About';
import Features from './components/Features';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Reveal Animations on Scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (entry.target.classList.contains('work-item')) {
            entry.target.classList.add('reveal');
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-text, .work-item, .feature-card, .analytics-container, .about-container, .contact-container').forEach(el => {
      revealObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="bg-blue-line" />
      <Navbar />
      <main>
        <Hero />
        <Chat />
        <Analytics />
        <About />
        <Features />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
