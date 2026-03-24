import React, { useEffect, useRef } from 'react';

const SteamEffect = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let intervalId;
        const timeouts = [];

        function createSteam() {
            if (!containerRef.current) return;
            
            const steam = document.createElement('div');
            steam.classList.add('steam');
            
            // Random properties
            const size = Math.random() * 40 + 20; // 20px to 60px
            const left = Math.random() * 100; // 0% to 100%
            const animationDuration = Math.random() * 5 + 5; // 5s to 10s
            const animationDelay = Math.random() * 5; // 0s to 5s
            
            steam.style.width = `${size}px`;
            steam.style.height = `${size}px`;
            steam.style.left = `${left}%`;
            steam.style.animationDuration = `${animationDuration}s`;
            steam.style.animationDelay = `${animationDelay}s`;
            
            containerRef.current.appendChild(steam);
            
            const timeoutId = setTimeout(() => {
                steam.remove();
            }, (animationDuration + animationDelay) * 1000);
            timeouts.push(timeoutId);
        }

        intervalId = setInterval(createSteam, 1500);
        
        for (let i = 0; i < 5; i++) {
            const timeoutId = setTimeout(createSteam, i * 300);
            timeouts.push(timeoutId);
        }

        return () => {
            clearInterval(intervalId);
            timeouts.forEach(clearTimeout);
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return <div id="steam-container" ref={containerRef}></div>;
};

export default SteamEffect;
