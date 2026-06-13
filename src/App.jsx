import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CategoryDetail from './pages/CategoryDetail';
import Favorites from './pages/Favorites';
import CartPage from './pages/CartPage';
import OrderHistory from './pages/OrderHistory';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import LocationSearchModal from './components/LocationSearchModal';
import Footer from './components/Footer';
import { products } from './data/products';
import LoginModal from './components/LoginModal';
import Wallet from './pages/Wallet';
import Support from './pages/Support';
import CartFlyOverlay from './components/CartFlyOverlay';

export default function App() {
  const navigate = useNavigate();

  // App States
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('blinkit_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('blinkit_cart') || '{}');
  });
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('blinkit_location') || "Home - Sector 62, Noida, UP";
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('blinkit_orders');
    if (saved) return JSON.parse(saved);
    const seed = [
      {
        id: "ORD-948194",
        date: "12 Jun 2026",
        items: "Taaza Toned Fresh Milk x2, Sliced Brown Bread x1",
        total: 99,
        status: "Delivered"
      },
      {
        id: "ORD-928185",
        date: "10 Jun 2026",
        items: "Premium Banana x1, Salted Butter x1",
        total: 118,
        status: "Delivered"
      }
    ];
    localStorage.setItem('blinkit_orders', JSON.stringify(seed));
    return seed;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('blinkit_wishlist') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('blinkit_wallet_balance');
    return saved !== null ? Number(saved) : 150;
  });
  const [useWallet, setUseWallet] = useState(false);

  // Sync state modifications to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('blinkit_cart', JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    localStorage.setItem('blinkit_location', location);
  }, [location]);

  React.useEffect(() => {
    localStorage.setItem('blinkit_orders', JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    localStorage.setItem('blinkit_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  React.useEffect(() => {
    localStorage.setItem('blinkit_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem('blinkit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('blinkit_user');
    }
  }, [user]);

  // Reset coupon and wallet toggle if cart becomes empty or user logs out
  React.useEffect(() => {
    if (Object.keys(cart).length === 0 || !user) {
      setAppliedCoupon(null);
      setUseWallet(false);
    }
  }, [cart, user]);

  // Compute Grand Total for cart checkout
  const cartItems = Object.entries(cart).map(([idStr, qty]) => {
    const id = parseInt(idStr);
    const product = products.find(p => p.id === id);
    return product ? { ...product, qty } : null;
  }).filter(Boolean);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = totalPrice > 0 ? 25 : 0;
  const handlingCharge = totalPrice > 0 ? 2 : 0;

  // Calculate discount based on active promo coupon rules
  let discountAmount = 0;
  if (appliedCoupon && totalPrice > 0) {
    if (appliedCoupon.code === "WELCOME50") {
      if (totalPrice >= 199) discountAmount = 50;
    } else if (appliedCoupon.code === "BLINKIT10") {
      discountAmount = Math.round(totalPrice * 0.1);
    } else if (appliedCoupon.code === "FREEDEL") {
      if (totalPrice >= 99) discountAmount = deliveryFee;
    }
  }

  const preWalletTotal = totalPrice > 0 ? (totalPrice + deliveryFee + handlingCharge - discountAmount) : 0;
  const walletDeduction = (useWallet && totalPrice > 0) ? Math.min(walletBalance, preWalletTotal) : 0;
  const grandTotal = totalPrice > 0 ? Math.max(0, preWalletTotal - walletDeduction) : 0;
  const cashbackEarned = totalPrice > 0 ? Math.round((totalPrice - discountAmount) * 0.02) : 0;

  // Toggle wishlist item
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Cart actions callbacks
  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: 1 }));
  };

  const incrementQty = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const decrementQty = (productId) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[productId] > 1) {
        copy[productId] -= 1;
      } else {
        delete copy[productId];
      }
      return copy;
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      setIsLoginOpen(true);
    } else {
      setIsCheckoutOpen(true); // Open payment wizard dialog overlay
    }
  };

  const handleOrderSuccess = () => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    let nextBalance = walletBalance;
    let transactionsList = [];
    try {
      const savedTx = localStorage.getItem('blinkit_wallet_transactions');
      transactionsList = savedTx ? JSON.parse(savedTx) : [
        {
          id: "TXN-829104",
          title: "Sign-up Promo Bonus",
          date: "10 Jun 2026",
          type: "credit",
          amount: 150,
          status: "Success"
        }
      ];
    } catch(err) {
      // ignore
    }

    if (useWallet && walletDeduction > 0) {
      nextBalance -= walletDeduction;
      transactionsList.unshift({
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `Payment for Order ${orderId}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: "debit",
        amount: walletDeduction,
        status: "Success"
      });
    }

    const cashback = Math.round((totalPrice - discountAmount) * 0.02);
    if (cashback > 0) {
      nextBalance += cashback;
      transactionsList.unshift({
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `Cashback Earned on Order ${orderId}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: "credit",
        amount: cashback,
        status: "Success"
      });
    }

    setWalletBalance(nextBalance);
    localStorage.setItem('blinkit_wallet_transactions', JSON.stringify(transactionsList));
    setUseWallet(false);

    const itemsSummary = cartItems.map(item => {
      return `${item.name.replace('Amul ', '').replace('Fresh ', '').replace('Mother Dairy ', '')} x${item.qty}`;
    }).join(', ');

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: itemsSummary || "Blinkit items",
      total: grandTotal,
      status: "Processing" // Processing state will advance in tracking screen
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart({}); // Reset Cart
    setIsCheckoutOpen(false); // Close wizard
    navigate('/orders'); // Redirect to tracking log timeline
  };

  return (
    <div class="min-h-screen flex flex-col bg-white text-blinkit-dark">
      
      {/* Sticky Navigation Header */}
      <Header 
        cart={cart}
        location={location}
        setLocation={setLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
        onLocationClick={() => setIsLocationOpen(true)}
        onAdd={addToCart}
        onIncrement={incrementQty}
        onDecrement={decrementQty}
        onProductClick={setSelectedProduct}
        wishlist={wishlist}
        walletBalance={walletBalance}
        user={user}
        setUser={setUser}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* Dynamic Page Container Views */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                cart={cart}
                onAdd={addToCart}
                onIncrement={incrementQty}
                onDecrement={decrementQty}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onProductClick={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                isLoggedIn={!!user}
              />
            } 
          />
          <Route 
            path="/category/:id" 
            element={
              <CategoryDetail 
                cart={cart}
                onAdd={addToCart}
                onIncrement={incrementQty}
                onDecrement={decrementQty}
                onProductClick={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                isLoggedIn={!!user}
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                cart={cart}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onAdd={addToCart}
                onIncrement={incrementQty}
                onDecrement={decrementQty}
                onProductClick={setSelectedProduct}
                user={user}
                onLoginClick={() => setIsLoginOpen(true)}
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <CartPage 
                cart={cart}
                onIncrement={incrementQty}
                onDecrement={decrementQty}
                onCheckout={handleCheckout}
              />
            } 
          />
          <Route 
            path="/orders" 
            element={<OrderHistory orders={orders} setOrders={setOrders} location={location} />} 
          />
          <Route 
            path="/wallet" 
            element={
              <Wallet 
                walletBalance={walletBalance} 
                setWalletBalance={setWalletBalance} 
                user={user} 
                onLoginClick={() => setIsLoginOpen(true)} 
              />
            } 
          />
          <Route 
            path="/support" 
            element={
              <Support 
                orders={orders} 
                walletBalance={walletBalance} 
                setWalletBalance={setWalletBalance} 
                user={user} 
                onLoginClick={() => setIsLoginOpen(true)} 
              />
            } 
          />
        </Routes>
      </main>

      {/* Cart Side Drawer Overlay */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onIncrement={incrementQty}
        onDecrement={decrementQty}
        onCheckout={handleCheckout}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        discountAmount={discountAmount}
        totalPrice={totalPrice}
        deliveryFee={deliveryFee}
        handlingCharge={handlingCharge}
        grandTotal={grandTotal}
        walletBalance={walletBalance}
        useWallet={useWallet}
        setUseWallet={setUseWallet}
        walletDeduction={walletDeduction}
        user={user}
        onLoginClick={() => {
          setIsCartOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {/* Checkout Success Modal Tracker Dialog Overlay */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        location={location}
        setLocation={setLocation}
        totalPrice={totalPrice}
        deliveryFee={deliveryFee}
        handlingCharge={handlingCharge}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        grandTotal={grandTotal}
        walletDeduction={walletDeduction}
        cashbackEarned={cashbackEarned}
        onSuccess={handleOrderSuccess}
      />

      {/* Product Details overlay sheet modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        cart={cart}
        onAdd={addToCart}
        onIncrement={incrementQty}
        onDecrement={decrementQty}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        isLoggedIn={!!user}
      />

      {/* Location Search Dialog Overlay */}
      <LocationSearchModal 
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        location={location}
        setLocation={setLocation}
      />

      {/* Interactive OTP Login Modal Overlay */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        setUser={setUser}
      />

      {/* Global flying particles animation layer */}
      <CartFlyOverlay />

      {/* Global Store Footer */}
      <Footer />

    </div>
  );
}
