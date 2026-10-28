/**
 * src/components/Library.jsx
 * Aurora Cafe - Curated Literary Lounge
 * Seamlessly styled to match the existing Aurora Cafe design language.
 * Enhanced with Framer Motion for buttery-smooth category transitions and modals.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKS, BOOK_CATEGORIES } from '../data/booksData';

const Library = ({ onSelectDrink }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeBook, setActiveBook] = useState(null);

    // Filter books based on category and search query
    const filteredBooks = useMemo(() => {
        return BOOKS.filter((book) => {
            if (selectedCategory !== 'all' && book.category !== selectedCategory) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const inTitle = book.title.toLowerCase().includes(q);
                const inAuthor = book.author.toLowerCase().includes(q);
                const inDesc = book.description.toLowerCase().includes(q);
                const inPairing = book.coffeePairing.toLowerCase().includes(q);
                return inTitle || inAuthor || inDesc || inPairing;
            }
            return true;
        });
    }, [selectedCategory, searchQuery]);

    const handleOrderDrink = (drinkName) => {
        if (onSelectDrink) {
            onSelectDrink(drinkName);
        }
        setActiveBook(null);
        const orderEl = document.getElementById('order');
        if (orderEl) orderEl.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="library" className="library section-padding bg-alt">
            <div className="container">
                {/* Section Header matching exact site design */}
                <div className="section-header reveal-up">
                    <h2 className="section-title">Our Library</h2>
                    <p>Curated literature to accompany your perfect brew.</p>
                </div>

                {/* Filter buttons matching the exact .menu-filters and .filter-btn styling */}
                <div className="menu-filters reveal-up" style={{ flexWrap: 'wrap', gap: '10px' }}>
                    {BOOK_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Search Bar styled with site tokens */}
                <div className="library-search-container reveal-up">
                    <div className="library-search-box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search by title, author, or flavor pairing..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-btn"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Animated Books Grid with Framer Motion */}
                <motion.div
                    className="library-book-grid"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredBooks.map((book) => (
                            <motion.article
                                key={book.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.3 }}
                                className="library-book-card"
                                onClick={() => setActiveBook(book)}
                            >
                                <div className="book-card-media">
                                    <img
                                        src={book.coverImg}
                                        alt={book.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                                        }}
                                    />
                                    <span className="book-rating-tag">
                                        <i className="fa-solid fa-star"></i> {book.rating}
                                    </span>
                                </div>

                                <div className="book-card-details">
                                    <h3 title={book.title}>{book.title}</h3>
                                    <p className="author">by {book.author}</p>
                                    <p className="desc">{book.description}</p>
                                    
                                    <div className="book-pairing-note">
                                        <i className="fa-solid fa-mug-hot"></i>
                                        <span>Pairs with: {book.pairDrinkName}</span>
                                    </div>

                                    <div className="book-card-cta">
                                        <button
                                            type="button"
                                            className="btn-read-preview"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveBook(book);
                                            }}
                                        >
                                            View Details <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredBooks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-light)' }}>
                        <i className="fa-solid fa-book" style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.6 }}></i>
                        <p>No books found matching "{searchQuery}". Try another keyword or select "All".</p>
                    </div>
                )}
            </div>

            {/* Book Detail Modal with Framer Motion AnimatePresence */}
            <AnimatePresence>
                {activeBook && (
                    <motion.div
                        className="modal-backdrop-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveBook(null)}
                    >
                        <motion.div
                            className="book-preview-modal-box"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="modal-exit-button"
                                onClick={() => setActiveBook(null)}
                                aria-label="Close modal"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            <div className="modal-content-grid">
                                <div className="modal-media-col">
                                    <img
                                        src={activeBook.coverImg}
                                        alt={activeBook.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                                        }}
                                    />
                                    <div className="modal-meta-row">
                                        <span><i className="fa-solid fa-star"></i> {activeBook.rating}</span>
                                        <span><i className="fa-regular fa-clock"></i> {activeBook.pages} pages</span>
                                        <span><i className="fa-regular fa-calendar"></i> {activeBook.year}</span>
                                    </div>
                                </div>

                                <div className="modal-text-col">
                                    <span className="category-label">{activeBook.category.toUpperCase()}</span>
                                    <h2>{activeBook.title}</h2>
                                    <p className="author-name">by {activeBook.author}</p>

                                    <blockquote className="modal-quote">
                                        "{activeBook.quote}"
                                    </blockquote>

                                    <div className="synopsis-box">
                                        <h4>Synopsis</h4>
                                        <p>{activeBook.description}</p>
                                    </div>

                                    <div className="pairing-callout">
                                        <div className="pairing-callout-header">
                                            <i className="fa-solid fa-mug-saucer"></i>
                                            <span>Barista Coffee Pairing</span>
                                        </div>
                                        <p className="pairing-text">{activeBook.coffeePairing}</p>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{ padding: '10px 24px', fontSize: '0.9rem', width: 'auto' }}
                                            onClick={() => handleOrderDrink(activeBook.pairDrinkName)}
                                        >
                                            Order {activeBook.pairDrinkName}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Library;
