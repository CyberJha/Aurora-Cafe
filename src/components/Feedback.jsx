import React, { useState } from 'react';

const Feedback = () => {
    const [status, setStatus] = useState('idle');
    const [rating, setRating] = useState('5');
    const [name, setName] = useState('');
    const [review, setReview] = useState('');
    const [testimonials, setTestimonials] = useState([
        {
            id: 1,
            stars: 5,
            halfStar: false,
            text: "Absolutely the best cappuccino I've had in the city. The ambiance is relaxing and perfect for getting some work done.",
            reviewer: "- Sarah Jenkins"
        },
        {
            id: 2,
            stars: 4,
            halfStar: true,
            text: "Love their cold brew and croissants. The staff is always welcoming and remembers my order. A true hidden gem!",
            reviewer: "- Michael Chen"
        }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            if (name.trim() && review.trim()) {
                setTestimonials(prev => [
                    {
                        id: Date.now(),
                        stars: Number(rating),
                        halfStar: false,
                        text: review.trim(),
                        reviewer: `- ${name.trim()}`
                    },
                    ...prev
                ]);
            }
            setStatus('success');
        }, 800);
    };

    return (
        <section id="feedback" className="feedback section-padding bg-alt">
            <div className="container">
                <div className="section-header reveal-up">
                    <h2 className="section-title">Customer Voices</h2>
                    <p>Don't just take our word for it.</p>
                </div>
                
                <div className="feedback-grid">
                    <div className="testimonials reveal-left">
                        {testimonials.map((t) => (
                            <div key={t.id} className="testimonial-card">
                                <div className="stars">
                                    {[...Array(t.stars)].map((_, i) => (
                                        <i key={i} className="fa-solid fa-star"></i>
                                    ))}
                                    {t.halfStar && <i className="fa-solid fa-star-half-stroke"></i>}
                                </div>
                                <p className="review-text">"{t.text}"</p>
                                <div className="reviewer">{t.reviewer}</div>
                            </div>
                        ))}
                    </div>

                    <div className="feedback-form-container reveal-right">
                        <h3>Leave Your Feedback</h3>
                        <form id="feedback-form" className={`styled-form ${status === 'success' ? 'hidden' : ''}`} onSubmit={handleSubmit}>
                            <div className="star-rating" id="star-rating">
                                {[5,4,3,2,1].map(num => (
                                    <React.Fragment key={num}>
                                        <input
                                            type="radio"
                                            id={`star${num}`}
                                            name="rating"
                                            value={num}
                                            checked={rating === String(num)}
                                            onChange={(e) => setRating(e.target.value)}
                                        />
                                        <label htmlFor={`star${num}`} title={`${num} stars`}>
                                            <i className="fa-solid fa-star"></i>
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="feedback-name">Name</label>
                                <input
                                    type="text"
                                    id="feedback-name"
                                    required
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="feedback-text">Review</label>
                                <textarea
                                    id="feedback-text"
                                    rows="4"
                                    required
                                    placeholder="Tell us about your experience..."
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-secondary submit-btn dark" disabled={status === 'submitting'}>
                                {status === 'submitting' ? <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</> : 'Submit Review'}
                            </button>
                        </form>
                        <div id="feedback-success" className={`success-message ${status === 'success' ? '' : 'hidden'}`}>
                            <p>Thank you for your valuable feedback!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Feedback;
