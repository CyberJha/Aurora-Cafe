# ☕ Aurora Café & Literary Lounge

> *"Fresh Coffee, Warm Moments & Timeless Stories."*

A full-stack web application designed with the aesthetic standards of luxury hospitality and modern software engineering. Aurora Café seamlessly blends artisan third-wave coffee culture with a hand-curated **70+ book Literary Lounge** and **Aura**, an interactive AI barista & literary sommelier assistant.

---

## 🌟 Key Features & Additions

### 1. 🤖 Interactive Aura AI Assistant
- **Human-Like Barista & Sommelier Persona**: Aura is warm, witty, perceptive, and speaks with authentic coffee & literature knowledge.
- **Sensory Book & Brew Pairings**: Recommends personalized coffee and pastry pairings for any mood, genre, or time of day.
- **Interactive Action Triggers**: Aura's messages include direct quick-actions (e.g. *Order Velvet Cappuccino*, *Explore Philosophy Shelf*) that automatically pre-fill order tickets and scroll to relevant sections.
- **Natural Dynamic Pacing**: Realistic typing indicator, audio chime feedback synthesized via Web Audio API, quick conversational starter chips, and conversation reset.
- **Hybrid Zero-Config Architecture**: Operates 100% reliably client-side out of the box with zero external dependencies, with optional plug-and-play support for Gemini / OpenAI via Vercel serverless functions (`/api/chat`).

### 2. 📚 The Aurora Library (7 Shelves • 70+ Curated Books)
Expanded from a concept into a full-scale digital reading lounge containing **7 distinct categories** and **10 detailed books per category** (70 books total):
1. **Fiction & Literature** (*The Midnight Library, Kafka on the Shore, A Gentleman in Moscow, Circe, etc.*)
2. **Philosophy & Thought** (*Meditations, The Daily Stoic, Man's Search for Meaning, The Stranger, etc.*)
3. **Coffee Culture & Culinary Arts** (*The World Atlas of Coffee, Craft Coffee, Salt Fat Acid Heat, etc.*)
4. **Cozy Mystery & Thrillers** (*The Thursday Murder Club, The Maid, The Silent Patient, etc.*)
5. **Poetry & Soulful Reflections** (*Devotions by Mary Oliver, Rumi, The Prophet, Letters to a Young Poet, etc.*)
6. **Sci-Fi & Speculative** (*Dune, Project Hail Mary, The Name of the Wind, Klara and the Sun, etc.*)
7. **Mindfulness & Growth** (*Atomic Habits, The Power of Now, Four Thousand Weeks, Ikigai, etc.*)

**Interactive Library Capabilities**:
- **Live Search**: Instant multi-attribute search across titles, authors, quotes, synopses, and coffee notes.
- **Reading Nook Modal**: Comprehensive view with book statistics, quotes, and barista pairing notes.
- **"My Cafe Table Shelf"**: Borrow books directly to your virtual cafe table, saved across sessions in `localStorage`.
- **Direct Pairing to Order**: One-click pairing button sends the recommended drink straight to the order form.

### 3. 🎨 High-Class Code Architecture & Refinements
- **Modular Data Architecture**: Clean separation into `src/data/booksData.js`, `src/data/menuData.js`, and `src/data/aiPersona.js`.
- **Refined Component Hierarchy**: React 18 functional components leveraging `useMemo`, `useCallback`, and clean prop bridges.
- **Resilient Fallback Design**: Order and feedback submissions operate with relative `/api/orders` endpoints and robust client/server fallbacks, preventing 500 crashes if database instances are provisioning.
- **Elevated Aesthetics**: Glassmorphism (`backdrop-filter`), warm coffee-and-cream palette, 3D card depth, fluid typography, and ambient steam animations.

### 4. 🚀 Zero-Config Vercel Deployment
- Configured with `vercel.json` for seamless Single Page Application (SPA) routing and serverless function delegation.
- Serverless API functions placed in `/api`:
  - `/api/orders.js`: Serverless order submission with MySQL pooling & graceful offline ticket generation.
  - `/api/chat.js`: AI chat handler supporting Gemini API key with persona fallback.
  - `/api/feedback.js`: Community review logging.
  - `/api/health.js`: Health status and feature inspection endpoint.
- Relative API requests with Vite development proxy (`vite.config.js`).

---

## 🛠️ Project Structure

```bash
aurora-cafe/
├── api/                   # Vercel Serverless Functions
│   ├── chat.js            # AI Chatbot endpoint (Gemini / Persona)
│   ├── feedback.js        # Feedback submissions
│   ├── health.js          # Health check endpoint
│   └── orders.js          # Order management & MySQL integration
├── backend/               # Standalone Express Server (Local/Docker)
│   ├── controllers/       # Business logic (orderController.js)
│   ├── routes/            # Express route definitions (orders.js)
│   ├── db.js              # MySQL connection pool with non-blocking error handling
│   ├── schema.sql         # Database schema
│   └── server.js          # Express entrypoint
├── src/
│   ├── components/
│   │   ├── About.jsx      # Story & philosophy with literary values
│   │   ├── ChatBot.jsx    # Aura AI Barista & Literary Assistant widget
│   │   ├── Contact.jsx    # Location, hours, and map
│   │   ├── Feedback.jsx   # Dynamic reviews with persistent local storage
│   │   ├── Footer.jsx     # Navigation, hours, social links, and AI trigger
│   │   ├── Hero.jsx       # Hero banner with menu, library, and Aura CTAs
│   │   ├── Library.jsx    # 7-category, 70-book literary lounge with search & shelf
│   │   ├── Menu.jsx       # Handcrafted food & drink offerings
│   │   ├── Navbar.jsx     # Sticky glassmorphic navbar with active section observer
│   │   ├── Order.jsx      # Order-ahead counter with pre-selection hook
│   │   └── SteamEffect.jsx# Ambient rising steam animation
│   ├── data/
│   │   ├── aiPersona.js   # Aura persona prompts & conversational intelligence
│   │   ├── booksData.js   # 70+ curated books across 7 shelves
│   │   └── menuData.js    # Unified menu items and pairings
│   ├── App.jsx            # Main app orchestrator
│   ├── index.css          # Comprehensive design system & animations
│   └── main.jsx           # React DOM root entry
├── .env.example           # Environment variables template
├── index.html             # HTML5 entry with fonts and metadata
├── package.json           # Frontend dependencies & scripts
├── vercel.json            # Vercel deployment configuration
└── vite.config.js         # Vite configuration with /api proxy
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Run the Local Express Backend
If you want to run the traditional backend with MySQL:
```bash
cd backend
npm install
npm run dev
```

---

## 🚢 Deploying to Vercel

### Option 1: Vercel CLI (Recommended)
1. Install Vercel CLI globally if not already installed:
   ```bash
   npm install -g vercel
   ```
2. Run deployment from the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts. `vercel.json` will automatically configure:
   - Framework: **Vite**
   - Output directory: **`dist`**
   - Serverless Functions: **`api/`**

### Option 2: GitHub Integration
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your repository.
3. Vercel will auto-detect Vite. Click **Deploy**!
4. *(Optional)* In your Vercel Project Settings > Environment Variables, add:
   - `GEMINI_API_KEY`: For live Gemini-powered AI conversations.
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: If connecting a remote MySQL instance (PlanetScale, RDS, Supabase, etc.).

---

## ☕ Technologies Used
- **Frontend**: React 18, Vite 5, Vanilla CSS3 (Custom Design System), FontAwesome 6, Google Fonts (Playfair Display & Inter).
- **Backend / Serverless**: Node.js, Express, Vercel Serverless Functions, MySQL2 connection pooling.
- **Audio & Intelligence**: Web Audio API (ambient synthesized chimes), Client-Side Natural Language Engine + Google Gemini API.

---

Crafted with excellence for Aurora Café.
