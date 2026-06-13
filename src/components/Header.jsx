import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import blinkitLogo from '../../images/blinkit main logo.png';
import { products } from '../data/products';
import SearchAutocompleteDropdown from './SearchAutocompleteDropdown';

export default function Header({ 
  cart, 
  location, 
  setLocation, 
  searchQuery, 
  setSearchQuery, 
  onCartClick,
  onLocationClick,
  onAdd,
  onIncrement,
  onDecrement,
  onProductClick,
  wishlist = [],
  walletBalance = 150,
  user,
  setUser,
  onLoginClick
}) {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileBouncing, setIsMobileBouncing] = useState(false);
  const [isDesktopBouncing, setIsDesktopBouncing] = useState(false);
  const desktopDropdownRef = React.useRef(null);
  const mobileDropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleBounce = () => {
      if (window.innerWidth < 1024) {
        setIsMobileBouncing(true);
        setTimeout(() => setIsMobileBouncing(false), 350);
      } else {
        setIsDesktopBouncing(true);
        setTimeout(() => setIsDesktopBouncing(false), 350);
      }
    };
    window.addEventListener('cart-bounce', handleBounce);
    return () => window.removeEventListener('cart-bounce', handleBounce);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktopOutside = !desktopDropdownRef.current || !desktopDropdownRef.current.contains(event.target);
      const isMobileOutside = !mobileDropdownRef.current || !mobileDropdownRef.current.contains(event.target);
      if (isDesktopOutside && isMobileOutside) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute total cart quantity and price
  const totalQty = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(prod => prod.id === parseInt(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmed = searchQuery.trim();
      if (trimmed !== '') {
        try {
          const saved = localStorage.getItem('blinkit_recent_searches');
          let list = saved ? JSON.parse(saved) : [];
          list = [trimmed, ...list.filter(q => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
          localStorage.setItem('blinkit_recent_searches', JSON.stringify(list));
        } catch (err) {
          // ignore storage errors
        }
      }
      setIsSearchFocused(false);
      e.target.blur();
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      e.target.blur();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 lg:py-0 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 lg:gap-6 lg:h-20">
        
        {/* Top Row: Logo, Divider, Location Selector, Mobile Cart */}
        <div class="flex items-center justify-between w-full lg:w-auto gap-4">
          <div class="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Logo Link */}
            <Link to="/" class="flex select-none shrink-0" onClick={() => setSearchQuery('')}>
              <img src={blinkitLogo} alt="Blinkit Logo" class="h-7 sm:h-8 lg:h-9 w-auto object-contain" />
            </Link>

            {/* Vertical Divider */}
            <div class="h-9 w-[1px] bg-gray-200 self-center"></div>

            {/* Location Selector */}
            <button 
              onClick={onLocationClick} 
              class="flex flex-col text-left group transition-all duration-150 py-1 px-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer"
            >
              <span class="text-xs sm:text-sm font-extrabold text-[#1c1c1c] leading-tight">
                Delivery in 12 minutes
              </span>
              <span class="text-[10px] sm:text-xs text-[#666666] font-medium flex items-center gap-1 mt-0.5" id="current-location">
                <span class="truncate max-w-[110px] sm:max-w-[150px] lg:max-w-[200px]">
                  {location}
                </span>
                <i class="fa-solid fa-caret-down text-[10px] text-[#1c1c1c] group-hover:translate-y-0.5 transition-transform"></i>
              </span>
            </button>
          </div>

          {/* Mobile Cart & Favorites Buttons */}
          <div class="flex items-center gap-2 lg:hidden">
            {/* Mobile Account Profile or Login */}
            {user ? (
              <div class="relative flex items-center" ref={mobileDropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  class="p-2 text-[#0c831f] hover:text-[#0b721b] rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-center"
                  aria-label="Profile menu"
                >
                  <i class="fa-solid fa-circle-user text-xl"></i>
                </button>
                {isDropdownOpen && (
                  <div class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                    <div class="px-4 py-2 border-b border-gray-50">
                      <p class="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Logged In As</p>
                      <p class="text-xs font-bold text-blinkit-dark truncate mt-0.5">+91 {user.phone}</p>
                    </div>
                    {/* Wallet Balance inside Mobile Dropdown */}
                    <button 
                      onClick={() => { navigate('/wallet'); setIsDropdownOpen(false); }}
                      class="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center justify-between border-b border-gray-50"
                    >
                      <span class="flex items-center gap-2">
                        <span class="text-sm">👛</span> Wallet Balance
                      </span>
                      <span class="font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                        ₹{walletBalance}
                      </span>
                    </button>
                    <button 
                      onClick={() => { navigate('/orders'); setIsDropdownOpen(false); }}
                      class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <i class="fa-solid fa-clipboard-list w-4 text-gray-400"></i>
                      <span>My Orders</span>
                    </button>
                    <button 
                      onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
                      class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span class="flex items-center gap-2">
                        <i class="fa-solid fa-heart w-4 text-red-400"></i>
                        <span>Favorites</span>
                      </span>
                      {wishlist.length > 0 && (
                        <span class="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => { navigate('/support'); setIsDropdownOpen(false); }}
                      class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <i class="fa-solid fa-headset w-4 text-gray-400"></i>
                      <span>Customer Support</span>
                    </button>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => { setUser(null); setIsDropdownOpen(false); navigate('/'); }}
                      class="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <i class="fa-solid fa-right-from-bracket w-4 text-red-400"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                class="p-2 text-gray-400 hover:text-blinkit-green rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-center"
                aria-label="Login"
              >
                <i class="fa-solid fa-user text-lg"></i>
              </button>
            )}

            <button 
              id="mobile-cart-btn"
              onClick={onCartClick} 
              className={`bg-[#0c831f] hover:bg-[#0b721b] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold shadow-xs active:scale-95 transition-all text-xs cursor-pointer ${isMobileBouncing ? 'animate-cart-bounce' : ''}`}
            >
              <i class="fa-solid fa-cart-shopping text-white text-base"></i>
              {totalQty > 0 ? (
                <div class="flex flex-col text-left leading-none">
                  <span class="text-[10px] font-extrabold text-white">{totalQty} item{totalQty > 1 ? 's' : ''}</span>
                  <span class="text-[10px] font-black text-white">₹{totalPrice}</span>
                </div>
              ) : (
                <span class="text-xs font-extrabold text-white">My Cart</span>
              )}
            </button>
          </div>
        </div>

        {/* Wide Search Bar */}
        <div class="w-full lg:flex-1 lg:max-w-xl xl:max-w-2xl relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-gray-500 text-sm"></i>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder='Search "egg"' 
            class="w-full pl-11 pr-10 py-3 bg-[#f8f8f8] border border-[#eeeeee] text-xs sm:text-sm rounded-xl outline-none transition-all duration-200 focus:bg-white focus:ring-1 focus:ring-[#0c831f]/20 focus:border-[#0c831f] placeholder-[#828282] font-normal"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch} 
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i class="fa-solid fa-circle-xmark text-sm"></i>
            </button>
          )}

          {/* Autocomplete Dropdown Panel */}
          <SearchAutocompleteDropdown 
            isOpen={isSearchFocused}
            onClose={() => setIsSearchFocused(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cart={cart}
            onAdd={onAdd}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onProductClick={onProductClick}
          />
        </div>

        {/* Desktop Actions: Favorites, Login & Cart */}
        <div class="hidden lg:flex items-center gap-6 shrink-0">
          {user ? (
            <div class="relative flex items-center" ref={desktopDropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                class="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
              >
                <span>Hi, {user.name.split(" ")[0]} 👤</span>
                <i class={`fa-solid fa-chevron-down text-[10px] transition-transform duration-205 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isDropdownOpen && (
                <div class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  <div class="px-4 py-2 border-b border-gray-50">
                    <p class="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Logged In As</p>
                    <p class="text-xs font-bold text-blinkit-dark truncate mt-0.5">+91 {user.phone}</p>
                  </div>
                  {/* Wallet Balance inside Dropdown */}
                  <button 
                    onClick={() => { navigate('/wallet'); setIsDropdownOpen(false); }}
                    class="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center justify-between border-b border-gray-50"
                  >
                    <span class="flex items-center gap-2">
                      <span class="text-sm">👛</span> Wallet Balance
                    </span>
                    <span class="font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      ₹{walletBalance}
                    </span>
                  </button>
                  <button 
                    onClick={() => { navigate('/orders'); setIsDropdownOpen(false); }}
                    class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <i class="fa-solid fa-clipboard-list w-4 text-gray-400"></i>
                    <span>My Orders</span>
                  </button>
                  <button 
                    onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
                    class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0c831f] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-heart w-4 text-red-400"></i>
                      <span>Favorites</span>
                    </span>
                    {wishlist.length > 0 && (
                      <span class="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => { navigate('/support'); setIsDropdownOpen(false); }}
                    class="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blinkit-green transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <i class="fa-solid fa-headset w-4 text-gray-400"></i>
                    <span>Customer Support</span>
                  </button>
                  <div class="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={() => { setUser(null); setIsDropdownOpen(false); navigate('/'); }}
                    class="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <i class="fa-solid fa-right-from-bracket w-4 text-red-400"></i>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              class="font-semibold text-[#1c1c1c] hover:text-[#0c831f] transition-colors text-sm sm:text-base cursor-pointer"
            >
              Login
            </button>
          )}
          
          <button 
            id="desktop-cart-btn"
            onClick={onCartClick} 
            className={`bg-[#0c831f] hover:bg-[#0b721b] text-white px-5 py-2.5 rounded-lg flex items-center gap-3 font-extrabold shadow-sm active:scale-98 transition-all duration-200 cursor-pointer min-w-[125px] justify-center ${isDesktopBouncing ? 'animate-cart-bounce' : ''}`}
          >
            <i class="fa-solid fa-cart-shopping text-white text-lg"></i>
            {totalQty > 0 ? (
              <div class="flex flex-col text-left leading-none">
                <span class="text-xs font-extrabold text-white">{totalQty} item{totalQty > 1 ? 's' : ''}</span>
                <span class="text-xs font-black text-white mt-0.5">₹{totalPrice}</span>
              </div>
            ) : (
              <span class="text-sm font-extrabold text-white">My Cart</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
