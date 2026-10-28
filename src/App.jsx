/**
 * src/App.jsx
 * Aurora Cafe - Main Application Root
 * Coordinates original page components alongside the Curated Library
 * and the Aura AI Chatbot with autonomous order placement.
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Library from './components/Library';
import Order from './components/Order';
import Feedback from './components/Feedback';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SteamEffect from './components/SteamEffect';
import ChatBot from './components/ChatBot';
import './index.css';

function App() {
    const [selectedDrink, setSelectedDrink] = useState('');

    useEffect(() => {
        // Scroll reveal animations
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        
        const revealCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        };

        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
        revealElements.forEach(el => revealObserver.observe(el));

        return () => {
            revealElements.forEach(el => revealObserver.unobserve(el));
        };
    }, []);

    const handleSelectDrink = (drinkName) => {
        setSelectedDrink(drinkName);
    };

    return (
        <>
            <SteamEffect />
            <Navbar />
            <Hero />
            <About />
            <Menu />
            <Library onSelectDrink={handleSelectDrink} />
            <Order preselectedItem={selectedDrink} />
            <Feedback />
            <Contact />
            <Footer />

            {/* Aura AI Chatbot Assistant */}
            <ChatBot
                onOrderPlaced={(order) => setSelectedDrink(order.item_name)}
                onSelectDrink={handleSelectDrink}
            />
        </>
    );
}

export default App;
