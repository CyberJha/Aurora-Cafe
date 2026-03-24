import React from 'react';

const About = () => {
    return (
        <section id="about" className="about section-padding">
            <div className="container">
                <div className="about-grid">
                    <div className="about-text reveal-left">
                        <h2 className="section-title">Our Story</h2>
                        <p>Welcome to Aurora Café, an oasis of warmth and comfort nestled in the heart of the city. We believe that every cup of coffee tells a story, and every sip should be an experience to savor.</p>
                        <p>Founded on the principles of quality, community, and sustainability, we source only the finest beans from ethical growers around the world. Our baristas are artisans, dedicated to crafting the perfect brew for you.</p>
                        
                        <div className="values-container">
                            <div className="value-item">
                                <i className="fa-solid fa-seedling"></i>
                                <h3>Quality Beans</h3>
                                <p>Ethically sourced, freshly roasted.</p>
                            </div>
                            <div className="value-item">
                                <i className="fa-solid fa-couch"></i>
                                <h3>Cozy Vibe</h3>
                                <p>A relaxing sanctuary for everyone.</p>
                            </div>
                            <div className="value-item">
                                <i className="fa-solid fa-users"></i>
                                <h3>Community</h3>
                                <p>Where friends and ideas connect.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="about-gallery reveal-right">
                        <div className="gallery-item img-1">
                            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" alt="Café Interior" loading="lazy" />
                        </div>
                        <div className="gallery-item img-2">
                            <img src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=600&q=80" alt="Barista pouring coffee" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
