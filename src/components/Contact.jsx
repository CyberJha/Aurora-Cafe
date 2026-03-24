import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="contact section-padding">
            <div className="container">
                <div className="section-header reveal-up">
                    <h2 className="section-title">Visit Us</h2>
                    <p>We'd love to see you today.</p>
                </div>

                <div className="contact-grid">
                    <div className="contact-card reveal-up" style={{ transitionDelay: '0.1s' }}>
                        <div className="icon-box"><i className="fa-solid fa-location-dot"></i></div>
                        <h3>Address</h3>
                        <p>Shalimar Garden, Sahibabad, Ghaziabad, Uttar Pradesh 201006t</p>
                        <p>Ghaziabad, Uttar Pradesh 201006</p>
                    </div>

                    <div className="contact-card reveal-up" style={{ transitionDelay: '0.2s' }}>
                        <div className="icon-box"><i className="fa-solid fa-phone"></i></div>
                        <h3>Phone</h3>
                        <p>+91 9311XXXXXX</p>
                        <p>Mon-Sat: 7am - 8pm</p>
                        <p>Sun: 12pm - 8pm</p>
                    </div>

                    <div className="contact-card reveal-up" style={{ transitionDelay: '0.3s' }}>
                        <div className="icon-box"><i className="fa-solid fa-envelope"></i></div>
                        <h3>Email</h3>
                        <p>hello@auroracafe.com</p>
                        <p>events@auroracafe.com</p>
                    </div>
                </div>

                <div className="map-container reveal-up">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13999.587901211731!2d77.34392775!3d28.692728300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773642582732!5m2!1sen!2sin" width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </section>
    );
};

export default Contact;
