import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';

const TRENDING_KEYWORDS = ["Milk", "Curd", "Banana", "Ice Cream", "Chips", "Chocolate", "Bread", "Eggs"];

export default function SearchAutocompleteDropdown({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  cart,
  onAdd,
  onIncrement,
  onDecrement,
  onProductClick
}) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState([]);

  const handleAddToCart = (e, product, callback) => {
    callback(product.id);

    const rect = e.currentTarget.getBoundingClientRect();
    const event = new CustomEvent('cart-item-fly', {
      detail: {
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        image: product.image
      }
    });
    window.dispatchEvent(event);
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('blinkit_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, [isOpen]);

  // Helper to save recent search query
  const handleSelectQuery = (query) => {
    const trimmed = query.trim();
    if (trimmed === "") return;

    const newList = [
      trimmed,
      ...recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(newList);
    localStorage.setItem('blinkit_recent_searches', JSON.stringify(newList));
    
    setSearchQuery(trimmed);
    onClose();

    // Navigate to homepage to show results if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  // Helper to delete an item from search history
  const handleDeleteRecent = (e, queryToDelete) => {
    e.stopPropagation();
    const newList = recentSearches.filter(q => q !== queryToDelete);
    setRecentSearches(newList);
    localStorage.setItem('blinkit_recent_searches', JSON.stringify(newList));
  };

  // Helper to clear all recent searches
  const handleClearAll = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('blinkit_recent_searches');
  };

  // Autocomplete matching logic
  const normalizedQuery = searchQuery.toLowerCase().trim();
  
  // Filter products matching search
  const matchedProducts = products.filter(p => 
    p.name.toLowerCase().includes(normalizedQuery) ||
    p.categoryLabel.toLowerCase().includes(normalizedQuery) ||
    p.subCategory.toLowerCase().includes(normalizedQuery)
  ).slice(0, 4);

  // Filter categories matching search
  const matchedCategories = categories.filter(c =>
    c.name.toLowerCase().includes(normalizedQuery)
  );

  // Text suggestions (matching product names, distinct values)
  const textSuggestions = Array.from(new Set(
    products
      .filter(p => p.name.toLowerCase().includes(normalizedQuery))
      .map(p => p.name)
  )).slice(0, 4);

  return (
    <>
      {/* Invisible fixed backdrop layer to capture click-outside and dismiss */}
      <div 
        className="fixed inset-0 z-30 bg-black/10 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Dropdown container */}
      <div className="absolute top-full left-0 right-0 z-40 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col text-left max-h-[85vh] overflow-y-auto">
        
        {/* CASE A: Empty Search State */}
        {searchQuery.trim() === "" ? (
          <div className="p-5 space-y-6">
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Recent Searches</h4>
                  <button 
                    onClick={handleClearAll}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map(query => (
                    <div 
                      key={query}
                      onClick={() => handleSelectQuery(query)}
                      className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-xl cursor-pointer group transition-all"
                    >
                      <span className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                        <i className="fa-solid fa-clock-rotate-left text-gray-400 text-[10px]"></i>
                        {query}
                      </span>
                      <button 
                        onClick={(e) => handleDeleteRecent(e, query)}
                        className="p-1 rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        aria-label={`Delete ${query} search history`}
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Keywords */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Trending Searches</h4>
              <div className="flex flex-wrap gap-2">
                {TRENDING_KEYWORDS.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => handleSelectQuery(keyword)}
                    className="py-2 px-3.5 border border-gray-100 hover:border-[#0c831f]/20 bg-gray-50 hover:bg-[#0c831f]/5 text-xs font-semibold rounded-full text-gray-600 hover:text-[#0c831f] cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <i className="fa-solid fa-arrow-trend-up mr-1.5 text-gray-400 text-[9px]"></i>
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Categories Shortcuts */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Quick Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigate(`/category/${cat.id}`);
                      onClose();
                    }}
                    className={`text-left p-3 border border-gray-100/60 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all group ${cat.bgColor || 'hover:bg-gray-50'}`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-blinkit-green truncate">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* CASE B: Active Search State */
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
            
            {/* Left Column: Text Autocomplete Queries & Match Categories */}
            <div className="p-4 md:w-5/12 space-y-4">
              
              {/* Categories Matches */}
              {matchedCategories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Matching Categories</h4>
                  <div className="space-y-1">
                    {matchedCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigate(`/category/${cat.id}`);
                          onClose();
                        }}
                        className="w-full text-left py-2 px-2.5 hover:bg-[#0c831f]/5 rounded-lg text-xs font-bold text-[#0c831f] flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <span className="text-sm">{cat.emoji}</span>
                        <span>In {cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text suggestions */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Search Suggestions</h4>
                <div className="space-y-1">
                  {textSuggestions.length === 0 ? (
                    <div className="text-xs text-gray-400 py-1 px-2.5 font-medium">
                      No matching search phrases
                    </div>
                  ) : (
                    textSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => handleSelectQuery(suggestion)}
                        className="w-full text-left py-2 px-2.5 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <i className="fa-solid fa-magnifying-glass text-gray-400 text-[9px] shrink-0"></i>
                        <span className="truncate">{suggestion}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Matched Products list with inline ADD triggers */}
            <div className="p-4 md:w-7/12 space-y-3 bg-gray-50/50">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-1">Matched Products</h4>
              
              {matchedProducts.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  <i className="fa-solid fa-cart-flatbed-suitcase opacity-35 mb-2 text-lg block"></i>
                  No products found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-2">
                  {matchedProducts.map(product => {
                    const qty = cart[product.id] || 0;
                    return (
                      <div 
                        key={product.id}
                        onClick={() => {
                          onProductClick(product);
                          onClose();
                        }}
                        className="p-2.5 bg-white border border-gray-100 hover:border-gray-200 rounded-xl flex items-center justify-between gap-3 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                      >
                        {/* Product Thumbnail & Details */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-9 h-9 object-cover rounded-lg shrink-0 border border-gray-100"
                          />
                          <div className="min-w-0 text-left">
                            <h5 className="text-[11px] font-extrabold text-gray-700 leading-tight truncate max-w-[150px] md:max-w-[200px]">
                              {product.name}
                            </h5>
                            <span className="text-[9px] font-semibold text-gray-400 block mt-0.5">
                              {product.weight}
                            </span>
                            <span className="text-xs font-black text-gray-800 block mt-0.5">
                              ₹{product.price}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Quantity / ADD controls */}
                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                          {qty > 0 ? (
                            <div className="flex items-center bg-[#0c831f] text-white rounded-lg overflow-hidden border border-[#0c831f] shadow-2xs font-extrabold text-xs h-7">
                              <button 
                                onClick={() => onDecrement(product.id)}
                                className="px-2 py-0.5 hover:bg-[#0b721b] transition-colors cursor-pointer select-none active:scale-95 text-center w-7"
                              >
                                -
                              </button>
                              <span className="px-1 min-w-[14px] text-center">{qty}</span>
                              <button 
                                onClick={(e) => handleAddToCart(e, product, onIncrement)}
                                className="px-2 py-0.5 hover:bg-[#0b721b] transition-colors cursor-pointer select-none active:scale-95 text-center w-7"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleAddToCart(e, product, onAdd)}
                              className="bg-white hover:bg-[#0c831f]/2 text-[#0c831f] hover:text-[#0b721b] border border-[#0c831f]/30 hover:border-[#0c831f] px-3.5 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer shadow-2xs select-none active:scale-95 h-7 flex items-center justify-center min-w-[56px]"
                            >
                              ADD
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </>
  );
}
