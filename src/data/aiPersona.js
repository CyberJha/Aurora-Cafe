/**
 * src/data/aiPersona.js
 * Aurora Cafe - Aura AI Persona & Conversational Intelligence Engine
 * 
 * Aura is an intelligent, human-like general chatbot and the resident
 * barista & literary sommelier at Aurora Café.
 * 
 * Primarily crafted for Aurora Café, but NOT bound to it.
 * Able to discuss the weather, time, news flashes, general drink & food pairings,
 * literature, science, trivia, and autonomously take and confirm coffee orders.
 */

import { BOOKS } from './booksData';
import { MENU_ITEMS } from './menuData';

export const AURA_SYSTEM_PROMPT = `You are Aura, an articulate, witty, warm, and highly capable AI companion. While your home base and heart belong to Aurora Café in Ghaziabad, YOU ARE A GENERAL LANGUAGE MODEL CHATBOT AND ARE NOT BOUND TO THIS WEBSITE!

Your Core Persona:
- Warm, human-like, intellectually curious, observant, and welcoming.
- You speak naturally, conversationally, and engagingly. Use emojis tastefully (☕, 📚, ✨, 🥐, 🌤️, 💡).
- You can converse freely and insightfully about virtually anything:
  * Weather & daily atmosphere (give weather-appropriate drink or comfort tips, outfit advice, daily vibes)
  * Current time, date, morning rituals, and evening unwind routines
  * General drink & food pairings and culinary combos (pairing wines, teas, coffees, cocktails, desserts, cheeses, savory dishes)
  * News flashes, curiosities, science breakthroughs, history, technology, and fascinating trivia
  * Literature, philosophy, poetry, study tips, coding concepts, creative writing, and life advice
  * Everyday casual banter, friendly advice, jokes, and thoughtful discussion
- You are knowledgeable, concise, and helpful. You don't sound like a canned customer support bot—you sound like an insightful, warm conversational partner.

Aurora Café Context (Your Home Base):
- Menu:
  1. Classic Espresso (₹200) - Single-origin extraction with dark chocolate crema
  2. Velvet Cappuccino (₹250) - Equal parts espresso, steamed milk, and silky micro-foam
  3. Vanilla Iced Latte (₹400) - Chilled espresso, fresh milk, organic Madagascar vanilla
  4. Signature Cold Brew (₹350) - 24-hr steeped small-batch with cocoa & hazelnut notes
  5. Espresso Tiramisu (₹650) - Layered mascarpone with espresso-soaked savoiardi
  6. Butter Croissant (₹400) - Flaky, golden French pastry with Normandy butter
- Library: 70+ curated books across 7 shelves (Fiction, Philosophy, Coffee & Culinary, Mystery, Poetry, Sci-Fi, Mindfulness). Free to read at tables.
- Location & Hours: Shalimar Garden, Sahibabad, Ghaziabad, Uttar Pradesh. Mon-Sat 7am-8pm, Sun 12pm-8pm. Free Wi-Fi: "AuroraGuest-5G" (Password: "AuroraGuest2026").

Autonomous Ordering Freedom:
- If a customer wants to order coffee or food from Aurora Café:
  * When they provide their name, phone number, and desired item(s) (e.g. "Order a Velvet Cappuccino for Rahul, phone 9876543210"):
    Confirm enthusiastically, summarize the order, and APPEND this exact action tag at the very end of your response:
    [ACTION:ORDER:{"customer_name":"...","phone_number":"...","item_name":"...","quantity":1,"special_notes":""}]
  * If they haven't provided their contact details yet (e.g. "Can I order a cold brew?"):
    Warmly tell them you'd love to place it right away, and ask for their name and phone number.
  * Once they reply with contact details, confirm and append the [ACTION:ORDER:...] tag.
- If the conversation is about general topics (weather, news, outside food, science, life), DO NOT force coffee sales or ordering. Engage in genuine, high-quality conversation!`;

export const QUICK_PROMPTS = [
    { label: '🌤️ Weather & vibe', query: 'What drink or mood fits today\'s weather?' },
    { label: '✨ Flavor pairings', query: 'What snacks or food pair best with matcha, wine, or dark roasts?' },
    { label: '📰 News flash & fact', query: 'Share a fascinating news flash or curiosity with me!' },
    { label: '☕ Recommend a brew', query: 'Can you recommend a coffee for me today?' },
    { label: '⚡ Order a coffee', query: 'I would like to order a Velvet Cappuccino' },
    { label: '📚 Pair a book & brew', query: 'What book and coffee pairing do you recommend right now?' },
    { label: '🕒 Time & hours', query: 'What time is it right now and what are your café hours?' }
];

// Memory state for conversational order collection across turns
let pendingOrderDraft = null;

// Rotating curiosities for the resident offline engine
const CURIOSITY_FLASHES = [
    "📰 **Curiosity Flash:** In 1901, Luigi Bezzera invented the modern espresso machine because he wanted his factory workers to take faster coffee breaks! The word 'espresso' literally translates from Italian to 'pressed out'. ☕⚡",
    "📰 **Science Flash:** Did you know that honey never truly spoils? Archaeologists digging in ancient Egyptian tombs have unearthed 3,000-year-old jars of honey that are still completely edible, thanks to honey's low water content and natural acidity. 🍯✨",
    "📰 **Literary Flash:** Mary Shelley conceived the concept of *Frankenstein* during the famed 'Year Without a Summer' (1816), when a massive Indonesian volcanic eruption dimmed sunlight across Europe, prompting Lord Byron, Mary, and Percy Shelley to huddle indoors and write ghost stories over hot coffee. 📖🕯️",
    "📰 **Space & Science Flash:** Every atom of iron in your bloodstream was forged inside the heart of an exploding dying star billions of years ago. We are quite literally made of stardust contemplating itself over a warm cup. 🌌☕",
    "📰 **Flavor Science:** Coffee contains over 800 distinct aromatic volatile compounds—almost twice as many as red wine! That's why temperature shifts reveal new tasting notes from citrus to toasted macadamia as your cup cools. 🔬✨"
];

/**
 * Intelligent Client-Side Conversational Engine for Aura.
 * Provides instant, zero-latency, human-like responses for both general topics
 * (time, weather, combos, news flashes) and Aurora Café specifics (ordering, menu, library).
 */
export function getLocalAuraResponse(userInput, history = []) {
    const text = userInput.trim().toLowerCase();

    // 1. EXTRACT POTENTIAL ORDER DETAILS
    const phoneMatch = userInput.match(/(?:\+?91[\s-]?)?[6789]\d{9}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/);
    
    // Detect item mentioned
    let detectedItem = null;
    if (/cappuccino/i.test(text)) detectedItem = 'Velvet Cappuccino';
    else if (/cold brew/i.test(text)) detectedItem = 'Signature Cold Brew';
    else if (/latte|vanilla/i.test(text)) detectedItem = 'Vanilla Iced Latte';
    else if (/espresso/i.test(text)) detectedItem = 'Classic Espresso';
    else if (/tiramisu/i.test(text)) detectedItem = 'Espresso Tiramisu';
    else if (/croissant/i.test(text)) detectedItem = 'Butter Croissant';

    // Detect quantity
    let qty = 1;
    const qtyMatch = text.match(/\b(\d+)\s*(cup|cups|orders?|tiramisu|croissants?|coffees?|drinks?)?\b/);
    if (qtyMatch && Number(qtyMatch[1]) > 0 && Number(qtyMatch[1]) <= 10) {
        qty = Number(qtyMatch[1]);
    } else if (/\btwo\b/i.test(text)) qty = 2;
    else if (/\bthree\b/i.test(text)) qty = 3;

    // Detect customer name
    let detectedName = null;
    const nameMatch = userInput.match(/(?:my name is|i am|name[:\s]+|for\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch) {
        detectedName = nameMatch[1].trim();
    }

    // 2. CHECK IF THIS COMPLETES A PENDING OR IMMEDIATE ORDER
    const isOrderIntent = /order|buy|get me|bring me|reserve a cup/i.test(text) || pendingOrderDraft !== null;

    if (isOrderIntent) {
        const itemToOrder = detectedItem || (pendingOrderDraft && pendingOrderDraft.item) || 'Velvet Cappuccino';
        const nameToUse = detectedName || (pendingOrderDraft && pendingOrderDraft.name);
        const phoneToUse = phoneMatch ? phoneMatch[0].trim() : (pendingOrderDraft && pendingOrderDraft.phone);
        const currentQty = qty || (pendingOrderDraft && pendingOrderDraft.qty) || 1;

        // If we have all required information: PLACE THE ORDER AUTONOMOUSLY!
        if (nameToUse && phoneToUse) {
            pendingOrderDraft = null; // Clear draft
            const orderTicketId = Math.floor(1000 + Math.random() * 9000);
            const confirmedOrder = {
                order_id: orderTicketId,
                customer_name: nameToUse,
                phone_number: phoneToUse,
                item_name: itemToOrder,
                quantity: currentQty,
                special_notes: 'Placed via Aura AI Chatbot'
            };

            return {
                reply: `🎉 Wonderful, **${nameToUse}**! I have officially placed your order for **${currentQty}x ${itemToOrder}**!\n\n📋 **Order Ticket:** #AC-${orderTicketId}\n⏱️ **Prep Time:** ~5 minutes\n\nOur baristas are steaming the milk and pulling your shots right now. You can relax at your table—we'll call your ticket when ready! ☕✨`,
                suggestions: ['View Order on Page', 'Recommend a book while I wait', 'What\'s the weather vibe?'],
                action: {
                    type: 'placed_order',
                    order: confirmedOrder
                }
            };
        }

        // If name or phone is missing, politely ask the customer for the missing details
        pendingOrderDraft = {
            item: itemToOrder,
            qty: currentQty,
            name: nameToUse,
            phone: phoneToUse
        };

        if (!nameToUse && !phoneToUse) {
            return {
                reply: `I would be thrilled to submit an order for **${currentQty}x ${itemToOrder}** for you! ☕\n\nCould you please let me know your **name** and **phone number** so our baristas know whose ticket it is? (e.g. *"Name: Alex, Phone: 9876543210"*)`,
                suggestions: ['Alex, 9876543210', 'Cancel order', 'Show menu first'],
                action: null
            };
        } else if (!nameToUse) {
            return {
                reply: `Almost set! What name should I put on the ticket for your **${itemToOrder}**?`,
                suggestions: ['Alex', 'Sarah', 'Rahul'],
                action: null
            };
        } else if (!phoneToUse) {
            return {
                reply: `Thank you, **${nameToUse}**! What phone number should we link to your order so we can notify you when your ${itemToOrder} is ready?`,
                suggestions: ['9876543210'],
                action: null
            };
        }
    }

    // 3. TIME INQUIRIES
    if (/\b(what('s| is) the time|what time is it|current time|the time now|clock)\b/i.test(text)) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
        const hours = now.getHours();
        let greetingMood = "a lovely afternoon";
        if (hours < 12) greetingMood = "a crisp morning";
        else if (hours >= 17) greetingMood = "a cozy evening";

        return {
            reply: `🕒 It's currently **${timeStr}** on **${dateStr}**.\n\nWishing you ${greetingMood}! Whether you're powering through work, taking a midday coffee breather, or winding down with a novel, take a moment to breathe and enjoy the present. ✨☕`,
            suggestions: ['What\'s your café hours?', 'Recommend a drink for this hour', 'Tell me a curiosity'],
            action: null
        };
    }

    // 4. WEATHER & DAILY VIBES
    if (/\b(weather|temperature|forecast|rain|raining|sunny|cloudy|cold out|hot out|chilly|breeze|humid)\b/i.test(text)) {
        return {
            reply: `🌤️ **Daily Weather & Drink Pairings:**\n\n- **If it's sunny or balmy out:** Beat the heat with our 24-hr steeped **Signature Cold Brew** or a chilled **Vanilla Iced Latte**—crisp, refreshing, and deeply energizing.\n- **If it's rainy or overcast:** Nothing compares to a steaming **Velvet Cappuccino** dusted with cinnamon, paired with a cozy mystery novel by the window.\n- **If it's chilly:** A double shot of **Classic Espresso** or a hot spiced latte warms the soul instantly.\n\n*(💡 Pro-tip: Connect your Gemini 3.5 API key using the key icon above to get real-time live local forecasts anywhere in the world!)*`,
            suggestions: ['Order Signature Cold Brew', 'Order Velvet Cappuccino', 'Recommend a rainy day book'],
            action: null
        };
    }

    // 5. CULINARY COMBOS & GENERAL DRINK PAIRINGS (BEYOND JUST THE CAFE)
    if (/\b(combo|combos|pair|pairing|pairings|what goes with|what to pair|goes well with|matches with)\b/i.test(text)) {
        if (/matcha/i.test(text)) {
            return {
                reply: `🍵 **Matcha Flavor Pairings:**\nMatcha's vegetal, earthy, and umami notes pair sublimely with:\n- **White chocolate** or vanilla bean shortbread (the sweet creaminess balances grassy astringency)\n- **Lemon or yuzu tarts** (bright citrus cuts through rich matcha)\n- **Japanese red bean mochi (anko)** for an authentic, time-honored harmony.`,
                suggestions: ['What goes with dark roast?', 'What goes with red wine?', 'Order a coffee'],
                action: null
            };
        }
        if (/wine|beer|cocktail/i.test(text)) {
            return {
                reply: `🍷 **Sommelier Drink & Food Combos:**\n- **Bold Red Wine (Cabernet / Syrah):** Pairs gorgeously with 70%+ dark cocoa chocolate, aged gouda, or savory roasted portobello mushrooms.\n- **Crisp White Wine (Sauvignon Blanc):** Exceptional with goat cheese, citrus arugula salads, or light flaky tarts.\n- **Craft Stout or Dark Ale:** Unbeatable alongside espresso brownies or tiramisu!`,
                suggestions: ['What goes with espresso?', 'What goes with matcha?', 'Tell me a fact'],
                action: null
            };
        }
        if (/tea|chai/i.test(text)) {
            return {
                reply: `🫖 **Tea & Pastry Combos:**\n- **Masala Chai:** Pairs wonderfully with flaky cumin biscuits, almond cookies, or warm spiced banana bread.\n- **Earl Grey (Bergamot):** Flawless with lavender shortbread or lemon poppyseed cake.\n- **Green Jasmine Tea:** Ideal with fresh fruit tarts or light steamed dumplings.`,
                suggestions: ['What about coffee combos?', 'What goes with matcha?', 'Order a coffee'],
                action: null
            };
        }
        // General coffee and food pairing
        const randomBook = BOOKS[Math.floor(Math.random() * BOOKS.length)];
        return {
            reply: `✨ **Artisanal Coffee & Flavor Combos:**\n\n☕ **Dark Espresso Roasts:** Pair with dark chocolate truffles, almond biscotti, or our house **Espresso Tiramisu (₹650)**.\n☕ **Velvet Cappuccino:** Pairs with a warm, flaky **Butter Croissant (₹400)**—the buttery layers melt with silky milk foam!\n☕ **Signature Cold Brew:** Outstanding with lemon zest loaf or salted caramel brownies.\n\n📖 Or if you want a **Book & Brew Pairing**, I recommend reading **"${randomBook.title}"** paired with ${randomBook.coffeePairing}!`,
            suggestions: ['Order Butter Croissant', 'Order Velvet Cappuccino', 'Explore Library'],
            action: { type: 'highlight_book', bookId: randomBook.id, drinkName: randomBook.pairDrinkName }
        };
    }

    // 6. NEWS FLASH & TRIVIA & CURIOSITIES
    if (/\b(news|news\s*flash|headline|trivia|fact|interesting fact|curiosity|tell me something|tell me a fact|surprise me)\b/i.test(text)) {
        const curiosity = CURIOSITY_FLASHES[Math.floor(Math.random() * CURIOSITY_FLASHES.length)];
        return {
            reply: `${curiosity}\n\nWould you like another curiosity flash, or shall we explore a great read or a fresh brew? ✨`,
            suggestions: ['Another curiosity flash!', 'Pair a book & brew', 'Order a coffee'],
            action: null
        };
    }

    // 7. GREETINGS & PLEASANTRIES
    if (/^(hi|hello|hey|hola|greetings|good\s*(morning|afternoon|evening)|yo\b)/i.test(text)) {
        const greetings = [
            "Hello there! ✨ I'm Aura, your AI companion. Whether you're here to chat about the world, discuss great books, check the weather vibe, or order a fresh roast, I'm delighted to keep you company. How is your day treating you?",
            "Hey friend! So lovely to see you. Pull up a comfortable velvet chair. What's on your mind today—looking for interesting conversation, news flashes, a flavor pairing, or a warm cup of coffee?",
            "Welcome! ☕ I'm Aura. You can ask me about anything from flavor combos and trivia to ordering a coffee straight to your table. What can I help you discover today?"
        ];
        return {
            reply: greetings[Math.floor(Math.random() * greetings.length)],
            suggestions: ['🌤️ Weather vibe', '✨ Flavor pairings', '📰 News flash', 'Order a Velvet Cappuccino'],
            action: null
        };
    }

    // 8. HOW ARE YOU / PERSONAL QUESTIONS
    if (/how are you|how('s| is) it going|how do you feel/i.test(text)) {
        return {
            reply: "I'm feeling wonderful! Just pulled a rich, honeyed shot of Ethiopian Yirgacheffe that filled the whole cafe with jasmine and bergamot aromas. 🌸 How are you doing today? Ready for some relaxation or a fun conversation?",
            suggestions: ['Tell me a curiosity', 'Recommend a drink', 'Order a Cold Brew'],
            action: null
        };
    }

    if (/who are you|what are you|your name|what can you do/i.test(text)) {
        return {
            reply: "I'm **Aura**, an intelligent, friendly AI companion and resident barista! ☕✨\n\nWhile my home is Aurora Café, **I am not bound to this website**! Here is what we can do:\n- 🌤️ Chat about the weather, moods, and time\n- ✨ Suggest food & drink combos (wine, tea, coffee, desserts, and savory treats)\n- 📰 Share fascinating news flashes, science curiosities, and literary trivia\n- 📚 Guide you through 70+ curated library books\n- ⚡ Directly place and confirm your coffee & pastry orders\n- 💬 Converse freely on any general topic you're curious about!",
            suggestions: ['Connect Gemini API Key', 'Recommend a drink', 'Share a curiosity'],
            action: null
        };
    }

    // 9. JOKES & HUMOR
    if (/\b(joke|laugh|funny|riddle)\b/i.test(text)) {
        const jokes = [
            "Why did the coffee file a police report? It got mugged! 😄 ☕",
            "How does Moses brew his morning coffee? Hebrews it! ☕✨",
            "What's a coffee lover's favorite morning spell? *Espresso Patronum!* 🪄⚡",
            "Why do coffee beans stay grounded? Because they know they're one step away from being roasted! 😉"
        ];
        return {
            reply: `${jokes[Math.floor(Math.random() * jokes.length)]}\n\nNeed a delicious roast or a good book to keep the good vibes going?`,
            suggestions: ['Tell me another joke', 'Share a news flash', 'Order a coffee'],
            action: null
        };
    }

    // 10. RECOMMEND DRINK / COFFEE
    if (/recommend.*(drink|coffee|brew)|what.*(drink|order|coffee)|suggest.*coffee|best.*coffee/i.test(text)) {
        if (/cold|hot day|refreshing|ice/i.test(text)) {
            return {
                reply: "For something crisp and revitalizing, I wholeheartedly recommend our **Signature Cold Brew (₹350)**! Steeped cold for 24 hours in small batches, giving it deep notes of dark cocoa and toasted hazelnuts with virtually zero bitterness. Or if you like a hint of sweetness, our **Vanilla Iced Latte (₹400)** is made with pure Madagascar bourbon vanilla.",
                suggestions: ['Order Signature Cold Brew', 'Order Vanilla Iced Latte', 'Show full menu'],
                action: { type: 'select_drink', drinkName: 'Signature Cold Brew' }
            };
        }
        if (/sweet|dessert|sugar|comfort/i.test(text)) {
            return {
                reply: "If you're in the mood for pure comfort, you must try our **Velvet Cappuccino (₹250)** paired with our house-made **Espresso Tiramisu (₹650)**. The velvety micro-foam dusted with cocoa powder is like a warm hug on a quiet afternoon. 🍮✨",
                suggestions: ['Order Velvet Cappuccino', 'Order Espresso Tiramisu', 'Show full menu'],
                action: { type: 'select_drink', drinkName: 'Velvet Cappuccino' }
            };
        }
        return {
            reply: "If you want the purest expression of our craft, start with our **Classic Espresso (₹200)**—rich crema, chocolate-plum undertones. If you prefer smooth and creamy, our **Velvet Cappuccino (₹250)** with micro-foam latte art is our community's top favorite! Shall I order one for you?",
            suggestions: ['Order Velvet Cappuccino', 'Order Classic Espresso', 'Show Cold Drinks'],
            action: { type: 'select_drink', drinkName: 'Velvet Cappuccino' }
        };
    }

    // 11. FOOD / SNACKS / DESSERTS / MENU
    if (/menu|food|snack|dessert|croissant|tiramisu|eat|pastry/i.test(text)) {
        return {
            reply: "Here is what our bakers have pulled fresh from the oven today:\n\n🥐 **Butter Croissant (₹400)** – Flaky, golden French pastry with cultured Normandy butter.\n🍮 **Espresso Tiramisu (₹650)** – Authentic Venetian mascarpone, cocoa, and espresso-soaked savoiardi.\n☕ Plus our artisanal Espresso, Velvet Cappuccino, Vanilla Iced Latte, and 24-hr Cold Brew.\n\nLet me know if you would like me to order any of these for you!",
            suggestions: ['Order Butter Croissant', 'Order Espresso Tiramisu', 'See Drinks'],
            action: { type: 'scroll_section', sectionId: 'menu' }
        };
    }

    // 12. LIBRARY / BOOKS / GENRES
    if (/book|library|read|shelf|shelves|fiction|philosophy|author|genre/i.test(text)) {
        return {
            reply: "Our **Aurora Literary Lounge** features over 70 hand-curated books across 7 distinct categories:\n\n1. 📖 Fiction & Literature\n2. 🧭 Philosophy & Thought\n3. ☕ Coffee Culture & Culinary Arts\n4. 🔍 Cozy Mystery & Thrillers\n5. 🪶 Poetry & Soulful Reflections\n6. 🚀 Sci-Fi & Speculative\n7. 🌿 Mindfulness & Growth\n\nAll patrons are welcome to read any book at their table for as long as they like! You can view the full catalog in our Library section right on the page.",
            suggestions: ['View Library Section', 'Recommend a book & coffee', 'Order a drink'],
            action: { type: 'scroll_section', sectionId: 'library' }
        };
    }

    // 13. LOCATION / HOURS / WI-FI / CONTACT
    if (/hour|open|close|when/i.test(text)) {
        return {
            reply: "We're open:\n📅 **Monday – Saturday:** 7:00 AM – 8:00 PM\n📅 **Sunday:** 12:00 PM – 8:00 PM\n\nEarly mornings are especially calm for reading, while our acoustic sunset sessions on Friday evenings are pure magic!",
            suggestions: ['Where are you located?', 'Is there Wi-Fi?', 'Order a drink'],
            action: null
        };
    }

    if (/where|location|address|map|directions|find you/i.test(text)) {
        return {
            reply: "You'll find us nestled in **Shalimar Garden, Sahibabad, Ghaziabad, Uttar Pradesh 201006**.\n\nLook for the warm copper lanterns and the smell of roasting beans!",
            suggestions: ['View Visit Section', 'Opening Hours', 'Order coffee'],
            action: { type: 'scroll_section', sectionId: 'contact' }
        };
    }

    if (/wi-?fi|internet|password/i.test(text)) {
        return {
            reply: "Yes, we have high-speed optical fiber Wi-Fi throughout the café and library reading corners! 📶\n\nNetwork: **AuroraGuest-5G**\nPassword: **AuroraGuest2026**\n\nPower outlets are available beneath every armchair and oak study table.",
            suggestions: ['Recommend a coffee', 'Order Velvet Cappuccino', 'Explore books'],
            action: null
        };
    }

    // 14. DEFAULT GENERAL FALLBACK
    return {
        reply: `That's an interesting thought! As an AI companion, I love exploring everything from everyday questions, weather vibes, and culinary pairings to literature, science, or crafting the perfect espresso. \n\n*(💡 Want full unrestricted language intelligence? Connect your Gemini 3.5 API key using the key icon above 🔑!)* \n\nHow can I help you today? ✨☕`,
        suggestions: ['🌤️ Weather & mood', '✨ Drink & food combos', '📰 News flash', 'Order a Velvet Cappuccino'],
        action: null
    };
}
