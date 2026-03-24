import React, { useState, useEffect } from 'react';

const Menu = () => {
    const [filter, setFilter] = useState('all');
    const [visibleItems, setVisibleItems] = useState([]);

    const menuItems = [
        { id: 1, category: 'coffee', name: 'Classic Espresso', desc: 'Rich, bold, and perfectly extracted shot of our signature blend.', price: '₹200', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', alt: 'Espresso' },
        { id: 2, category: 'coffee', name: 'Velvet Cappuccino', desc: 'Equal parts espresso, steamed milk, and silky micro-foam.', price: '₹250', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80', alt: 'Cappuccino' },
        { id: 3, category: 'cold', name: 'Vanilla Iced Latte', desc: 'Chilled espresso with fresh milk and premium vanilla syrup.', price: '₹400', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80', alt: 'Iced Latte' },
        { id: 4, category: 'cold', name: 'Signature Cold Brew', desc: 'Steeped for 24 hours for a smooth, low-acidity finish.', price: '₹350', img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400&q=80', alt: 'Cold Brew' },
        { id: 5, category: 'dessert', name: 'Espresso Tiramisu', desc: 'Classic Italian dessert layered with mascarpone and coffee-soaked ladyfingers.', price: '₹650', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80', alt: 'Tiramisu' },
        { id: 6, category: 'snack', name: 'Butter Croissant', desc: 'Flaky, golden-brown pastry baked fresh every morning.', price: '₹400', img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=400&q=80', alt: 'Croissant' }
    ];

    useEffect(() => {
        if (filter === 'all') {
            setVisibleItems(menuItems);
        } else {
            setVisibleItems(menuItems.filter(item => item.category === filter));
        }
    }, [filter]);

    return (
        <section id="menu" className="menu section-padding bg-alt">
            <div className="container">
                <div className="section-header reveal-up">
                    <h2 className="section-title">Our Menu</h2>
                    <p>Curated selections to delight your palate.</p>
                </div>
                
                <div className="menu-filters reveal-up">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`filter-btn ${filter === 'coffee' ? 'active' : ''}`} onClick={() => setFilter('coffee')}>Coffee</button>
                    <button className={`filter-btn ${filter === 'cold' ? 'active' : ''}`} onClick={() => setFilter('cold')}>Cold Drinks</button>
                    <button className={`filter-btn ${filter === 'dessert' ? 'active' : ''}`} onClick={() => setFilter('dessert')}>Desserts</button>
                    <button className={`filter-btn ${filter === 'snack' ? 'active' : ''}`} onClick={() => setFilter('snack')}>Snacks</button>
                </div>
                
                <div className="menu-grid" id="menu-grid">
                    {visibleItems.map((item, index) => (
                        <div key={item.id} className="menu-item reveal-up active" style={{ transitionDelay: `${(index % 4) * 0.1}s`, display: 'flex', opacity: 1, transform: 'translateY(0)' }}>
                            <div className="menu-img">
                                <img src={item.img} alt={item.alt} loading="lazy" />
                                <span className="price">{item.price}</span>
                            </div>
                            <div className="menu-info">
                                <h3>{item.name}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Menu;
