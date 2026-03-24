import React from 'react';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="hero-overlay"></div>
            <div className="hero-content reveal-up">
                <h1 className="animated-headline">Aurora Café</h1>
                <p className="tagline">Fresh Coffee, Warm Moments</p>
                <div className="hero-buttons">
                    <a href="#menu" className="btn btn-primary">View Menu</a>
                    <a href="#order" className="btn btn-secondary">Order Now</a>
                </div>
            </div>
            <div className="scroll-indicator">
                <a href="#about"><i className="fa-solid fa-chevron-down"></i></a>
            </div>
        </section>
    );
};

export default Hero;
