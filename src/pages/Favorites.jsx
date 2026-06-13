import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Favorites({
  cart,
  wishlist,
  onToggleWishlist,
  onAdd,
  onIncrement,
  onDecrement,
  onProductClick,
  user,
  onLoginClick
}) {
  const navigate = useNavigate();

  // Redirect if logged out
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-extrabold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Please log in to view your favorite items. Redirecting you to the home page...
        </p>
        <button 
          onClick={onLoginClick}
          className="w-full bg-[#0c831f] hover:bg-[#0b721b] text-white font-extrabold py-3 rounded-2xl cursor-pointer transition-colors"
        >
          Login Now
        </button>
      </div>
    );
  }

  // Filter products that exist in the wishlist
  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div class="space-y-6">
      {/* Breadcrumbs */}
      <nav class="text-xs text-blinkit-gray font-medium flex items-center gap-1.5 mb-2 text-left">
        <Link to="/" class="hover:text-black transition-colors">Home</Link>
        <i class="fa-solid fa-chevron-right text-[8px]"></i>
        <span class="text-blinkit-dark font-semibold">Favorites</span>
      </nav>

      {/* Page Title & Count Header */}
      <div class="flex items-baseline justify-between border-b border-gray-100 pb-4 text-left">
        <div class="flex items-baseline gap-3">
          <h1 class="font-outfit font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1c1c1c]">
            My Favorites
          </h1>
          <span class="text-sm font-semibold text-blinkit-gray">
            {favoritedProducts.length} item{favoritedProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {favoritedProducts.length === 0 ? (
        /* Empty Wishlist State */
        <div class="py-20 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-5">
          <div class="relative w-28 h-28 bg-red-50/60 rounded-full flex items-center justify-center border border-red-100/50">
            {/* Heart Pulsing Effect in Background */}
            <div class="absolute inset-0 bg-red-100/35 rounded-full animate-ping scale-75 opacity-70"></div>
            <i class="fa-solid fa-heart text-red-500 text-5xl relative z-10"></i>
          </div>
          
          <div class="space-y-1.5">
            <h3 class="font-outfit font-extrabold text-lg sm:text-xl text-[#1c1c1c]">Your wishlist is empty</h3>
            <p class="text-xs text-blinkit-gray font-medium leading-relaxed px-4">
              Explore our fresh essentials, dairy, cold drinks, and snacks. Tap the heart button on any item to save it here!
            </p>
          </div>

          <Link 
            to="/" 
            class="bg-blinkit-green hover:bg-blinkit-greenHover text-white px-7 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-sm select-none"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Favorites Grid */
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favoritedProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              cartQty={cart[product.id] || 0}
              onAdd={onAdd}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onProductClick={onProductClick}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
              isLoggedIn={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
