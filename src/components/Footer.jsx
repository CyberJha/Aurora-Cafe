import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <a href="#home" className="logo">
                            <i className="fa-solid fa-mug-hot"></i> Aurora Café
                        </a>
                        <p>Crafting perfect moments, one cup at a time. Join us for an unforgettable coffee experience.</p>
                    </div>
                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#library">Library</a></li>
                            <li><a href="#order">Order</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#feedback">Feedback</a></li>
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" aria-label="Tiktok"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; <span>{year}</span> Aurora Café. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
