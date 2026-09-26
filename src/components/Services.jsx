import { useState } from 'react';

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const servicesData = [
    {
      title: "Data & Market Analysis",
      content: "We deploy advanced algorithms to uncover your local addressable market and predict online profitability.",
      tag: "[Market Intelligence]"
    },
    {
      title: "Full-Stack Development",
      content: "Exquisite, high-performance web applications built from the ground up for maximum speed and scale.",
      tag: "[Custom Web Apps]"
    },
    {
      title: "E-Commerce & Funnels",
      content: "End-to-end digital storefronts and sales funnels designed to maximize conversion rates and revenue.",
      tag: "[Conversion Optimization]"
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="services-left">
        <h2 className="serif">Core<br /><i>Capabilities</i></h2>
        <a href="#" className="cta-link">
          <span>Explore Solutions</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>
      <div className="services-right">
        {servicesData.map((service, index) => (
          <div key={index} className={`accordion-item ${activeIndex === index ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
              <h3 className="serif">{service.title}</h3>
              <span className="mono">{activeIndex === index ? '-' : '+'}</span>
            </div>
            <div className="accordion-content">
              <div className="accordion-inner">
                <p>{service.content}</p>
                <span className="tag-mono">{service.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
