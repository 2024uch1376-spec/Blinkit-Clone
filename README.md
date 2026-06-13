# 🛒 Blinkit Clone - React Quick-Commerce App

A premium, fully interactive front-end clone of the popular quick-commerce platform **Blinkit**, built using React, Vite, React Router, and Tailwind CSS. This application mimics the real Blinkit experience with ultra-fast delivery options, live cart actions, geolocation, wallet systems, and dynamic UI animations.

---

## ✨ Key Features

- **📍 Dynamic Geolocation & Address Search:** Fully interactive [LocationSearchModal](file:///src/components/LocationSearchModal.jsx) simulating GPS coordinates detection and recent/popular address selection.
- **🔍 Intelligent Search & Autocomplete:** A smart search bar with autocomplete suggestions, showing filtered products directly as you type.
- **🛍️ Complete Shopping Cart System:** 
  - Dynamic sliding [CartDrawer](file:///src/components/CartDrawer.jsx) showing order summaries.
  - Stacking items, calculating real-time delivery fees, handling charges, and coupons.
  - Floating/flying particles animation on adding items to the cart.
- **🎫 Coupon & Promo System:** Apply promo codes (e.g. `WELCOME50`, `BLINKIT10`, `FREEDEL`) to get discounts.
- **👛 Virtual Wallet System:** Maintain a virtual balance, receive promo sign-up bonuses, get 2% cashback on eligible orders, and view transaction statements.
- **📦 Order Tracking & History:** View past orders, check delivery statuses (Processing ➔ Out for Delivery ➔ Delivered), and review item summaries.
- **📱 Simulated OTP Login:** Log in using mobile OTP simulation to unlock order histories, wallet details, and checkout options.
- **🤝 Customer Support Center:** An interactive support hub to ask questions or resolve issues related to recent orders.

---

## 🚀 Tech Stack

- **Frontend Library:** React (v18+)
- **Build Tool:** Vite (Ultra-fast HMR)
- **Styling:** Tailwind CSS (Modern, utility-first styling) & CSS Custom Animations
- **Routing:** React Router DOM (v6)
- **Icons:** FontAwesome v6

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/2024uch1376-spec/Blinkit-Clone.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Blinkit-Clone
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📁 Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components (Cart, Header, Modals)
│   ├── data/                # Mock products data
│   ├── pages/               # Page layouts (Home, Wallet, OrderHistory, Support)
│   ├── App.jsx              # Main App wrapper & states configuration
│   ├── main.jsx             # Entry point
│   └── index.css            # Custom and Tailwind utility styling
├── package.json             # Build scripts and dependencies list
└── tailwind.config.js       # Custom design system configurations
```

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
