import { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleWheel = (e) => {
      e.stopPropagation();
    };

    hero.addEventListener('wheel', handleWheel, { capture: true });
    return () => {
      hero.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <Spline
        scene="https://prod.spline.design/2zYad3evfv4ogiuN/scene.splinecode"
        className="hero-spline"
      />
      
      <div className="hero-bottom-text bottom-left reveal-text">
        <h2>Let's build<br /><i>something.</i></h2>
      </div>
      
      <div className="hero-bottom-text bottom-right reveal-text">
        <div className="scroll-title">Scroll Down</div>
        <div className="about-text">Aparox AI builds premium digital infrastructure driven by organic intelligence and fluid design.</div>
      </div>
    </section>
  );
};

export default Hero;

