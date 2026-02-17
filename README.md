# 🛒 SayShop – AI Voice Grocery Assistant

An intelligent, voice-powered grocery management system built with modern web technologies.

SayShop enables users to manage their shopping basket using natural voice commands, view smart product suggestions, track frequent purchases, and estimate total cost in real-time.

---

## 🚀 Live Demo 
- 🔗 https://say-shop.vercel.app/


## 🚀 Features

### 🎙 Voice-Powered Shopping
- Add items using natural language
- Intelligent parsing of commands
- Fuzzy matching for product names
- Auto-correction support

### 🧠 Smart Intelligence
- AI-powered product categorization
- Frequently purchased tracking
- "People Also Bought" insights
- Seasonal product suggestions

### 💰 Real-Time Basket Management
- Live subtotal per item
- Dynamic total calculation
- Persistent local storage
- Quantity adjustment with instant updates

### 🔍 Smart Search
- Intelligent fuzzy product search
- Auto-suggestion correction
- Instant catalog results

### 🎨 Premium UI/UX
- Dark AI-inspired interface
- Smooth Framer Motion animations
- Glass-style premium cards
- Responsive layout (70/30 grid system)
- Custom animated toast notifications

---

## 🧱 Tech Stack

| Technology | Purpose |
|------------|----------|
| Next.js (App Router) | Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Hot Toast | Custom Premium Toast |
| Lucide Icons | Icon System |

---

## 📁 Project Structure
```
src/
├── components/
│ ├── home/
│ │ ├── VoiceButton.tsx
│ │ ├── ShoppingList.tsx
│ │ ├── CatalogResults.tsx
│ │ ├── SmartInsightsSection.tsx
│ │
│ ├── ui/
│ │ ├── ToastPremium.tsx
│ │
│ ├── Header.tsx
│ ├── Footer.tsx
│
├── utils/
│ ├── commandParser.ts
│ ├── intelligentSearch.ts
│ ├── smartSuggestions.ts
│ ├── purchaseHistory.ts
│ ├── basketIntelligence.ts
│ ├── mockProduct.ts
│
└── app/
└── page.tsx
```

---

## 🧠 How It Works

### 1️⃣ Voice Input Flow
1. User speaks a command
2. `parseCommand()` extracts intent and items
3. `intelligentSearch()` matches products
4. Basket updates in state
5. UI recalculates totals instantly
6. Data stored in localStorage

---

### 2️⃣ Intelligent Matching
- Uses fuzzy scoring
- Suggests closest product match
- Auto-corrects typos
- Assigns price and category dynamically

---

### 3️⃣ Basket Intelligence
- Tracks purchase frequency
- Suggests reorders
- Shows "People Also Bought"
- Learns from basket combinations

---

## 🖥 Installation

```bash
git clone https://github.com/yourusername/sayshop.git
cd frontend
npm install
npm run dev
```
## ⚙️ Environment
> No external APIs required for base functionality.

## Optional:
- AI Categorization endpoint (/api/categorize)
- Can be extended with real product APIs

## 📸 Screenshots
<img width="2880" height="1704" alt="image" src="https://github.com/user-attachments/assets/0d6fba24-109c-4ba9-9fe1-b7a0fac0d808" />
<img width="2880" height="1704" alt="image" src="https://github.com/user-attachments/assets/83760f4c-a77b-4aed-afc3-6d61c086ac95" />




## 🛠 Future Enhancements
- Budget tracking meter
- Checkout simulation
- Real-time market price API integration
- User authentication
- Cloud persistence (MongoDB / Supabase)
- AI purchase prediction
- Stripe checkout integration

## 📊 Performance & Design Philosophy
> SayShop is designed with:
- Clean separation of logic and UI
- Memoized derived state
- Controlled animations
- Scalable component architecture
- Production-level UX principles

## 🧑‍💻 Author
- Sourav
- Built with intelligence and modern UI principles.

## 📄 License
- MIT License
