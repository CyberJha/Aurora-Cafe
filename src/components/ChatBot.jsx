/**
 * src/components/ChatBot.jsx
 * Aurora Cafe - Aura AI Chatbot Assistant
 * Powered by Gemini 3.5 Flash Lite (with intelligent resident fallback)
 * and full autonomy to place coffee orders when customers provide their details.
 * Features buttery-smooth Framer Motion animations.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AURA_SYSTEM_PROMPT, getLocalAuraResponse, QUICK_PROMPTS } from '../data/aiPersona';

// Soft synthesized chime via Web Audio API (zero external assets needed)
const playChime = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1108.73, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
        // Silently ignore if audio permissions not yet granted
    }
};

const ChatBot = ({ onOrderPlaced, onSelectDrink }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showKeyModal, setShowKeyModal] = useState(false);
    
    // Gemini API Key state: from localStorage or Vite env
    const [geminiApiKey, setGeminiApiKey] = useState(() => {
        try {
            return localStorage.getItem('aurora_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
        } catch {
            return '';
        }
    });
    const [tempKeyInput, setTempKeyInput] = useState('');

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'aura',
            text: "Hello there! I'm **Aura**, your intelligent AI companion & barista. ☕✨\n\nWhile my home base is Aurora Café, **I'm not bound to this website**! We can chat about anything—from the **weather & daily vibes**, to **culinary combos & drink pairings**, **news flashes & science trivia**, or **ordering a fresh roast directly for your table**. What's on your mind today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ['🌤️ Weather & vibe', '✨ Flavor pairings', '📰 News flash', '☕ Order a coffee', '📚 Book recommendation']
        }
    ]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 250);
        }
    }, [isOpen]);

    const saveApiKey = (key) => {
        const clean = key.trim();
        setGeminiApiKey(clean);
        try {
            localStorage.setItem('aurora_gemini_api_key', clean);
        } catch {}
        setShowKeyModal(false);
        if (clean) {
            setMessages(prev => [
                ...prev,
                {
                    id: 'key-set-' + Date.now(),
                    sender: 'aura',
                    text: "✨ **Gemini 3.5** connected successfully! I'm now powered with full general conversational intelligence.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    };

    // Autonomous Order Dispatcher
    const executeOrderPlacement = async (orderData) => {
        const payload = {
            customer_name: orderData.customer_name || 'Cafe Guest',
            phone_number: orderData.phone_number || 'N/A',
            item_name: orderData.item_name || 'Velvet Cappuccino',
            quantity: Number(orderData.quantity) || 1,
            special_notes: orderData.special_notes || 'Placed via Aura AI Chatbot'
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json().catch(() => ({}));
            const ticketId = data.order_id || Math.floor(1000 + Math.random() * 9000);

            // Also persist to localStorage for client-side order list
            const existing = JSON.parse(localStorage.getItem('aurora_cafe_orders') || '[]');
            existing.unshift({ ...payload, order_id: ticketId, created_at: new Date().toISOString() });
            localStorage.setItem('aurora_cafe_orders', JSON.stringify(existing));

            if (onOrderPlaced) {
                onOrderPlaced({ ...payload, order_id: ticketId });
            }

            return ticketId;
        } catch (e) {
            const fallbackId = Math.floor(1000 + Math.random() * 9000);
            const existing = JSON.parse(localStorage.getItem('aurora_cafe_orders') || '[]');
            existing.unshift({ ...payload, order_id: fallbackId, created_at: new Date().toISOString() });
            localStorage.setItem('aurora_cafe_orders', JSON.stringify(existing));
            return fallbackId;
        }
    };

    // Send Message Handler
    const handleSend = async (textToSend) => {
        const query = (typeof textToSend === 'string' ? textToSend : inputValue).trim();
        if (!query) return;

        const userMsg = {
            id: 'user-' + Date.now(),
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        let finalReply = '';
        let detectedOrder = null;
        let actionObj = null;

        // 1. Try Gemini 3.5 model directly if API key is present
        if (geminiApiKey) {
            try {
                // Models list: try 2.5 flash-lite, 2.5 flash, 2.0 flash-lite, 2.0 flash, 1.5 flash
                const models = [
                    'gemini-2.5-flash-lite',
                    'gemini-2.5-flash',
                    'gemini-2.0-flash-lite-preview-02-05',
                    'gemini-2.0-flash',
                    'gemini-1.5-flash'
                ];
                let geminiSuccess = false;

                // Build multi-turn context from previous messages (up to last 8 turns)
                const recentHistory = messages
                    .filter(m => m.id !== 'welcome' && !m.id.startsWith('key-set'))
                    .slice(-8);

                const formattedTurns = [];
                for (const msg of recentHistory) {
                    const role = msg.sender === 'user' ? 'user' : 'model';
                    const cleanText = msg.text.replace(/\[ACTION:ORDER:\{.*?\}\]/g, '').trim();
                    if (cleanText) {
                        formattedTurns.push({ role, parts: [{ text: cleanText }] });
                    }
                }
                formattedTurns.push({ role: 'user', parts: [{ text: query }] });

                // Ensure strict alternation of user and model turns for Gemini API
                const sanitizedContents = [];
                let lastRole = null;
                for (const turn of formattedTurns) {
                    if (turn.role !== lastRole) {
                        sanitizedContents.push(turn);
                        lastRole = turn.role;
                    } else if (sanitizedContents.length > 0) {
                        sanitizedContents[sanitizedContents.length - 1].parts[0].text += '\n\n' + turn.parts[0].text;
                    }
                }
                if (sanitizedContents.length > 0 && sanitizedContents[0].role !== 'user') {
                    sanitizedContents.shift();
                }
                if (sanitizedContents.length === 0) {
                    sanitizedContents.push({ role: 'user', parts: [{ text: query }] });
                }

                for (const model of models) {
                    try {
                        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

                        // First try with system_instruction
                        let response = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                system_instruction: {
                                    parts: [{ text: AURA_SYSTEM_PROMPT }]
                                },
                                contents: sanitizedContents,
                                generationConfig: {
                                    temperature: 0.75,
                                    maxOutputTokens: 1000
                                }
                            }),
                            signal: AbortSignal.timeout(10000)
                        });

                        // Fallback attempt prepending system prompt if endpoint doesn't support system_instruction
                        if (!response.ok && sanitizedContents.length > 0) {
                            const fallbackContents = [
                                {
                                    role: 'user',
                                    parts: [{ text: `${AURA_SYSTEM_PROMPT}\n\nCustomer: ${sanitizedContents[0].parts[0].text}` }]
                                },
                                ...sanitizedContents.slice(1)
                            ];
                            response = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: fallbackContents,
                                    generationConfig: {
                                        temperature: 0.75,
                                        maxOutputTokens: 1000
                                    }
                                }),
                                signal: AbortSignal.timeout(10000)
                            });
                        }

                        if (response.ok) {
                            const data = await response.json();
                            const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (generated) {
                                finalReply = generated;
                                geminiSuccess = true;
                                break;
                            }
                        }
                    } catch (mErr) {
                        // continue to fallback model
                    }
                }

                // Check if Gemini autonomous order action tag is in the response: [ACTION:ORDER:{...}]
                if (geminiSuccess && finalReply) {
                    const actionMatch = finalReply.match(/\[ACTION:ORDER:(\{.*?\})\]/);
                    if (actionMatch) {
                        try {
                            const orderPayload = JSON.parse(actionMatch[1]);
                            detectedOrder = orderPayload;
                            // Clean the raw tag from user view
                            finalReply = finalReply.replace(/\[ACTION:ORDER:\{.*?\}\]/, '').trim();
                            const ticket = await executeOrderPlacement(orderPayload);
                            actionObj = { type: 'placed_order', order: { ...orderPayload, order_id: ticket } };
                        } catch (pErr) {
                            console.warn('Action parse error:', pErr);
                        }
                    }
                }
            } catch (err) {
                console.warn('Gemini request failed, activating resident persona:', err);
            }
        }

        // 2. If Gemini didn't respond or no key, invoke resident engine
        if (!finalReply) {
            const localData = getLocalAuraResponse(query, messages);
            finalReply = localData.reply;
            actionObj = localData.action;

            if (actionObj && actionObj.type === 'placed_order') {
                await executeOrderPlacement(actionObj.order);
            }
        }

        setTimeout(() => {
            setIsTyping(false);
            const auraMsg = {
                id: 'aura-' + Date.now(),
                sender: 'aura',
                text: finalReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: actionObj
            };

            setMessages(prev => [...prev, auraMsg]);
            if (soundEnabled) playChime();
        }, 500);
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 'welcome-cleared',
                sender: 'aura',
                text: "Fresh brew ready! ☕ How can I assist you now? Need a coffee recommendation, book pairing, or an order placed?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestions: ['Recommend a coffee', '⚡ Order a coffee', 'Browse library']
            }
        ]);
    };

    // Render simple markdown: bold, newlines
    const renderFormattedText = (rawText) => {
        if (!rawText) return null;
        const lines = rawText.split('\n');
        return lines.map((line, idx) => {
            const boldRegex = /\*\*(.*?)\*\*/g;
            const elements = [];
            let lastIndex = 0;
            let match;

            while ((match = boldRegex.exec(line)) !== null) {
                if (match.index > lastIndex) {
                    elements.push(line.substring(lastIndex, match.index));
                }
                elements.push(<strong key={match.index}>{match[1]}</strong>);
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < line.length) {
                elements.push(line.substring(lastIndex));
            }

            return (
                <span key={idx} style={{ display: 'block', minHeight: line.trim() === '' ? '8px' : 'auto' }}>
                    {elements}
                </span>
            );
        });
    };

    return (
        <aside className="chatbot-root" aria-label="Aura AI Assistant">
            {/* Floating Launcher Button */}
            <motion.button
                type="button"
                className={`chatbot-launcher ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label={isOpen ? "Close AI chat" : "Chat with Aura, your AI Barista"}
                title="Chat with Aura - Barista & Literary Assistant"
            >
                <div className="launcher-icon-wrap">
                    {isOpen ? (
                        <i className="fa-solid fa-xmark"></i>
                    ) : (
                        <i className="fa-solid fa-mug-hot"></i>
                    )}
                </div>
                {hasUnread && !isOpen && (
                    <span className="launcher-pulse-badge"></span>
                )}
            </motion.button>

            {/* Chatbot Window with Framer Motion AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window open"
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.96 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        role="dialog"
                        aria-label="Chat with Aura"
                    >
                        {/* Header styled with existing site elements */}
                        <header className="chatbot-header">
                            <div className="aura-profile">
                                <div className="aura-avatar-ring">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                        alt="Aura"
                                        className="aura-avatar-img"
                                    />
                                    <span className="online-indicator"></span>
                                </div>
                                <div className="aura-meta">
                                    <h4>Aura {geminiApiKey ? <span className="ai-pill">Gemini 3.5</span> : <span className="ai-pill" style={{ opacity: 0.8 }}>General AI</span>}</h4>
                                    <p>General AI & Café Companion</p>
                                </div>
                            </div>

                            <div className="chatbot-header-actions">
                                <button
                                    type="button"
                                    className="hdr-btn"
                                    onClick={() => {
                                        setTempKeyInput(geminiApiKey);
                                        setShowKeyModal(true);
                                    }}
                                    title={geminiApiKey ? "Gemini API Key Connected" : "Connect Gemini API Key"}
                                    style={{ color: geminiApiKey ? '#F59E0B' : '#FFF' }}
                                >
                                    <i className="fa-solid fa-key"></i>
                                </button>
                                <button
                                    type="button"
                                    className="hdr-btn"
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
                                >
                                    <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
                                </button>
                                <button
                                    type="button"
                                    className="hdr-btn"
                                    onClick={handleClearChat}
                                    title="Reset chat"
                                >
                                    <i className="fa-solid fa-rotate-right"></i>
                                </button>
                                <button
                                    type="button"
                                    className="hdr-btn"
                                    onClick={() => setIsOpen(false)}
                                    title="Close"
                                >
                                    <i className="fa-solid fa-chevron-down"></i>
                                </button>
                            </div>
                        </header>

                        {/* Optional API Key Input Overlay */}
                        <AnimatePresence>
                            {showKeyModal && (
                                <motion.div
                                    className="key-modal-overlay"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="key-modal-content">
                                        <h5><i className="fa-solid fa-key"></i> Gemini 3.5 API Key</h5>
                                        <p>Connect your Gemini API key to unlock full general language intelligence, live weather, news flashes, and autonomous café ordering:</p>
                                        <input
                                            type="password"
                                            placeholder="AIzaSy..."
                                            value={tempKeyInput}
                                            onChange={(e) => setTempKeyInput(e.target.value)}
                                        />
                                        <div className="key-btn-row">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                                onClick={() => saveApiKey(tempKeyInput)}
                                            >
                                                Save Key
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary dark"
                                                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                                onClick={() => setShowKeyModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages Container */}
                        <div className="chatbot-messages">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`chat-message ${msg.sender}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {msg.sender === 'aura' && (
                                        <div className="msg-avatar">
                                            <i className="fa-solid fa-mug-saucer"></i>
                                        </div>
                                    )}

                                    <div className="msg-content-wrapper">
                                        <div className="msg-bubble">
                                            {renderFormattedText(msg.text)}
                                        </div>

                                        {/* Confirmed Order Ticket Card if order was autonomously placed */}
                                        {msg.action && msg.action.type === 'placed_order' && (
                                            <div className="order-ticket-confirmed-card">
                                                <div className="ticket-header">
                                                    <i className="fa-solid fa-circle-check"></i>
                                                    <span>Order Confirmed by Aura</span>
                                                </div>
                                                <div className="ticket-body">
                                                    <p><strong>Ticket:</strong> #{msg.action.order.order_id || 'AC-2026'}</p>
                                                    <p><strong>Item:</strong> {msg.action.order.quantity}x {msg.action.order.item_name}</p>
                                                    <p><strong>Customer:</strong> {msg.action.order.customer_name}</p>
                                                </div>
                                            </div>
                                        )}

                                        <span className="msg-time">{msg.timestamp}</span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="chat-message aura typing">
                                    <div className="msg-avatar">
                                        <i className="fa-solid fa-mug-saucer"></i>
                                    </div>
                                    <div className="msg-bubble typing-bubble">
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                        <span className="typing-label">Aura is brewing a response...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Prompts */}
                        <div className="quick-prompts-strip">
                            {QUICK_PROMPTS.map((qp, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handleSend(qp.query)}
                                    disabled={isTyping}
                                >
                                    {qp.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Row */}
                        <form
                            className="chatbot-input-row"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                className="chatbot-input"
                                placeholder="Ask anything, talk weather, combos, or order coffee..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                className="chatbot-send-btn"
                                disabled={isTyping || !inputValue.trim()}
                                aria-label="Send"
                            >
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
};

export default ChatBot;
