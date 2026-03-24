import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Active link logic
            const sections = document.querySelectorAll('section');
            let current = 'home';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id') || 'home';
                }
            });
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const navStyle = (!scrolled && menuOpen) ? { backgroundColor: 'rgba(251, 248, 241, 0.98)' } : {};
    const barStyle = (!scrolled && menuOpen) ? { backgroundColor: 'var(--color-primary)' } : {};

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar" style={navStyle}>
            <div className="nav-container">
                <a href="#home" className="logo" onClick={closeMenu}>
                    <i className="fa-solid fa-mug-hot"></i> Aurora Café
                </a>
                
                <div className={`hamburger ${menuOpen ? 'active' : ''}`} id="hamburger" onClick={toggleMenu}>
                    <span className="bar" style={barStyle}></span>
                    <span className="bar" style={barStyle}></span>
                    <span className="bar" style={barStyle}></span>
                </div>

                <ul className={`nav-menu ${menuOpen ? 'active' : ''}`} id="nav-menu">
                    <li className="nav-item">
                        <a href="#home" className={`nav-link ${activeSection === 'home' || activeSection === '' ? 'active' : ''}`} onClick={closeMenu}>Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={closeMenu}>About</a>
                    </li>
                    <li className="nav-item">
                        <a href="#menu" className={`nav-link ${activeSection === 'menu' ? 'active' : ''}`} onClick={closeMenu}>Menu</a>
                    </li>
                    <li className="nav-item">
                        <a href="#order" className={`nav-link ${activeSection === 'order' ? 'active' : ''}`} onClick={closeMenu}>Order</a>
                    </li>
                    <li className="nav-item">
                        <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={closeMenu}>Contact</a>
                    </li>
                    <li className="nav-item">
                        <a href="#feedback" className={`nav-link ${activeSection === 'feedback' ? 'active' : ''}`} onClick={closeMenu}>Feedback</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
