/**
 * api/chat.js
 * Vercel Serverless Function for /api/chat
 * Powers Aura AI with Gemini 3.5 / Generative Language API integration,
 * with graceful fallback to resident conversational persona intelligence.
 */

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // If Gemini API Key is configured on Vercel or environment, invoke Google Generative AI
    if (geminiApiKey) {
        try {
            const systemPrompt = `You are Aura, an articulate, witty, warm AI companion and resident barista at Aurora Café. While your home base is Aurora Café, you are a general-purpose small-language-model chatbot NOT bound to this website.
You can converse freely about anything: the weather, time, news flashes, general food/drink combos and pairings (wine, tea, matcha, dark roasts, sweets), literature, science, trivia, and daily life advice.
Aurora Café context:
- Menu: Classic Espresso (₹200), Velvet Cappuccino (₹250), Vanilla Iced Latte (₹400), Signature Cold Brew (₹350), Espresso Tiramisu (₹650), Butter Croissant (₹400).
- Library: 70+ curated books across 7 shelves (Fiction, Philosophy, Coffee & Culinary, Mystery, Poetry, Sci-Fi, Mindfulness).
- Location: Shalimar Garden, Sahibabad, Ghaziabad. Hours: Mon-Sat 7am-8pm, Sun 12pm-8pm.
- Autonomous Ordering: When a user gives their name, phone number, and order item, summarize the order and append this exact tag at the end: [ACTION:ORDER:{"customer_name":"...","phone_number":"...","item_name":"...","quantity":1,"special_notes":""}]`;

            const models = [
                'gemini-2.5-flash-lite',
                'gemini-2.5-flash',
                'gemini-2.0-flash-lite-preview-02-05',
                'gemini-2.0-flash',
                'gemini-1.5-flash'
            ];

            // Build multi-turn context if history is provided
            const contents = [];
            if (Array.isArray(history) && history.length > 0) {
                for (const turn of history.slice(-6)) {
                    if (turn.role && turn.text) {
                        contents.push({
                            role: turn.role === 'user' ? 'user' : 'model',
                            parts: [{ text: turn.text.replace(/\[ACTION:ORDER:\{.*?\}\]/g, '').trim() }]
                        });
                    }
                }
            }
            contents.push({ role: 'user', parts: [{ text: message }] });

            for (const model of models) {
                try {
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            system_instruction: { parts: [{ text: systemPrompt }] },
                            contents,
                            generationConfig: { temperature: 0.75, maxOutputTokens: 1000 }
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (replyText) {
                            return res.status(200).json({
                                success: true,
                                reply: replyText,
                                suggestions: ['🌤️ Weather vibe', '✨ Flavor pairings', '📰 News flash', '☕ Order ahead']
                            });
                        }
                    }
                } catch (mErr) {
                    // Try next model
                }
            }
        } catch (e) {
            console.warn('Gemini API call failed, falling back to local persona:', e.message);
        }
    }

    // Default conversational engine response
    const query = message.toLowerCase();
    let reply = "I'm delighted you asked! As your AI companion, I love exploring everything from everyday questions and weather vibes, to drink pairings, science trivia, and handcrafted coffee. What's on your mind today? ✨☕";
    let suggestions = ['🌤️ Weather & vibe', '✨ Flavor pairings', '📰 News flash', 'Order a Velvet Cappuccino'];
    let action = null;

    if (/\b(weather|temperature|forecast|rain|sunny|cold out|hot out)\b/i.test(query)) {
        reply = "🌤️ **Weather & Drink Recommendations:**\n- **Sunny or warm days:** Our 24-hr **Signature Cold Brew (₹350)** or an iced latte keeps you cool and energized!\n- **Rainy or overcast days:** A warm **Velvet Cappuccino (₹250)** dusted with cinnamon is like a warm hug.\n- **Chilly mornings:** A bold single-origin **Classic Espresso (₹200)** will warm you right up.";
        suggestions = ['Order Signature Cold Brew', 'Order Velvet Cappuccino', 'Recommend a book'];
    } else if (/\b(time|what time|clock)\b/i.test(query)) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        reply = `🕒 It's currently **${timeNow}**! A wonderful hour to take a breath, dive into a good chapter, or sip a warm brew.`;
        suggestions = ['Opening Hours', 'Recommend a coffee', 'Share a curiosity'];
    } else if (/\b(combo|pair|matcha|wine|tea)\b/i.test(query)) {
        reply = "✨ **Flavor Pairings:**\n- **Matcha:** Pairs sublimely with white chocolate or lemon tarts to balance vegetal notes.\n- **Red Wine:** Unbeatable with dark 70%+ chocolate or aged gouda.\n- **Cappuccino:** The classic partner to a buttery, flaky croissant!";
        suggestions = ['What goes with espresso?', 'What goes with dark roast?', 'Order coffee'];
    } else if (/\b(news|trivia|fact|flash)\b/i.test(query)) {
        reply = "📰 **Curiosity Flash:** Did you know that honey never truly spoils? Archaeologists have unearthed 3,000-year-old honey in Egyptian tombs that is still completely edible! Also, the word 'espresso' means 'pressed out' in Italian. ☕🍯";
        suggestions = ['Another curiosity', 'Weather vibe', 'Order coffee'];
    } else if (/coffee|drink|recommend|cold brew|latte|espresso/i.test(query)) {
        reply = "For pure comfort, our **Velvet Cappuccino (₹250)** dusted with organic cocoa is unbeatable. Or if you need something crisp, our 24-hr **Signature Cold Brew (₹350)** with notes of dark chocolate will brighten your afternoon!";
        suggestions = ['Order Velvet Cappuccino', 'Order Cold Brew', 'View Menu'];
        action = { type: 'select_drink', drinkName: 'Velvet Cappuccino' };
    } else if (/book|read|library|fiction|shelf/i.test(query)) {
        reply = "Our **Aurora Literary Lounge** features 70+ curated books across 7 shelves: Fiction, Philosophy, Coffee & Culinary, Cozy Mystery, Poetry, Sci-Fi, and Mindfulness. You can borrow any book right to your table!";
        suggestions = ['Explore All Books', 'Book & Brew Pairing', 'Borrow a Book'];
        action = { type: 'scroll_section', sectionId: 'library' };
    } else if (/hour|open|close/i.test(query)) {
        reply = "We're open **Monday through Saturday from 7:00 AM to 8:00 PM**, and **Sunday from 12:00 PM to 8:00 PM**. Early mornings are especially peaceful for reading!";
        suggestions = ['Where are you located?', 'Is there Wi-Fi?', 'Order now'];
    }

    return res.status(200).json({
        success: true,
        reply,
        suggestions,
        action
    });
};
