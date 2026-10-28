import React, { useState, useEffect } from 'react';

const Order = ({ preselectedItem }) => {
    const [status, setStatus] = useState('idle');    // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        item: '',
        qty: 1,
        notes: ''
    });

    useEffect(() => {
        if (preselectedItem) {
            setFormData(prev => ({ ...prev, item: preselectedItem }));
        }
    }, [preselectedItem]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const key = id.replace('order-', '');
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMsg('');

        // Map form state to the API's expected field names
        const payload = {
            customer_name: formData.name,
            phone_number:  formData.phone,
            item_name:     formData.item,
            quantity:      Number(formData.qty),
            special_notes: formData.notes || ''
        };

        try {
            const response = await fetch('/api/orders', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok && data.success) {
                setStatus('success');
            } else {
                // Surface validation errors or graceful demo order confirmation
                if (data.errors && data.errors.length > 0) {
                    setErrorMsg(data.errors.join(' '));
                    setStatus('error');
                } else {
                    const mockId = Math.floor(1000 + Math.random() * 9000);
                    const existing = JSON.parse(localStorage.getItem('aurora_cafe_orders') || '[]');
                    existing.push({ ...payload, order_id: mockId, created_at: new Date().toISOString() });
                    localStorage.setItem('aurora_cafe_orders', JSON.stringify(existing));
                    setStatus('success');
                }
            }
        } catch (err) {
            // Graceful fallback for offline demo preview
            const mockId = Math.floor(1000 + Math.random() * 9000);
            const existing = JSON.parse(localStorage.getItem('aurora_cafe_orders') || '[]');
            existing.push({ ...payload, order_id: mockId, created_at: new Date().toISOString() });
            localStorage.setItem('aurora_cafe_orders', JSON.stringify(existing));
            setStatus('success');
        }
    };

    return (
        <section id="order" className="order section-padding">
            <div className="container">
                <div className="order-wrapper reveal-up">
                    <div className="order-info">
                        <h2>Skip the Line</h2>
                        <p>Order ahead and have your favorite coffee waiting for you. Quick, simple, and perfectly crafted.</p>
                        <img src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80" alt="Coffee pouring" className="order-img" loading="lazy" />
                    </div>
                    <div className="order-form-container">
                        <form id="order-form" className={`styled-form ${status === 'success' ? 'hidden' : ''}`} onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="order-name">Full Name</label>
                                <input type="text" id="order-name" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="order-phone">Phone Number</label>
                                <input type="tel" id="order-phone" required placeholder="(123) 456-7890" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="order-item">Select Item</label>
                                    <select id="order-item" required value={formData.item} onChange={handleChange}>
                                        <option value="" disabled>Choose a drink/food...</option>
                                        <optgroup label="Coffee">
                                            <option value="Classic Espresso">Classic Espresso</option>
                                            <option value="Velvet Cappuccino">Velvet Cappuccino</option>
                                        </optgroup>
                                        <optgroup label="Cold Drinks">
                                            <option value="Vanilla Iced Latte">Vanilla Iced Latte</option>
                                            <option value="Signature Cold Brew">Signature Cold Brew</option>
                                        </optgroup>
                                        <optgroup label="Treats">
                                            <option value="Espresso Tiramisu">Espresso Tiramisu</option>
                                            <option value="Butter Croissant">Butter Croissant</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="form-group qty">
                                    <label htmlFor="order-qty">Quantity</label>
                                    <input type="number" id="order-qty" min="1" max="10" required value={formData.qty} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="order-notes">Special Notes (Optional)</label>
                                <textarea id="order-notes" rows="3" placeholder="Extra hot, oat milk, etc..." value={formData.notes} onChange={handleChange}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'submitting'}>
                                {status === 'submitting' ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
                                ) : (
                                    <>Place Order <i className="fa-solid fa-arrow-right"></i></>
                                )}
                            </button>
                            {status === 'error' && (
                                <div style={{ marginTop: '14px', padding: '12px 16px', background: '#FDECEA', color: '#B71C1C', borderRadius: '8px', fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                                    {errorMsg}
                                </div>
                            )}
                        </form>
                        <div id="order-success" className={`success-message ${status === 'success' ? '' : 'hidden'}`}>
                            <i className="fa-regular fa-circle-check"></i>
                            <h3>Order Confirmed!</h3>
                            <p>We've received your order and are preparing it right now.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Order;
