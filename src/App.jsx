import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Order from './components/Order';
import Feedback from './components/Feedback';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SteamEffect from './components/SteamEffect';
import './index.css';

function App() {
  useEffect(() => {
    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    return () => {
        revealElements.forEach(el => revealObserver.unobserve(el));
    };
  }, []);

  return (
    <>
      <SteamEffect />
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Order />
      <Feedback />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
