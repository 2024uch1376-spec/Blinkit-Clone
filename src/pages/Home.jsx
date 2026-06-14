import React from 'react';
import { products } from '../data/products';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import bannerImg from '../../Frame-1437256605-2-2.jpg';

export default function Home({ 
  cart, 
  onAdd, 
  onIncrement, 
  onDecrement,
  searchQuery,
  setSearchQuery,
  onProductClick,
  wishlist = [],
  onToggleWishlist,
  isLoggedIn
}) {
  // If there's an active search query
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.categoryLabel.toLowerCase().includes(query)
    );

    return (
      <div class="space-y-6">
        <ProductGrid 
          title={`Search results for "${searchQuery}"`}
          products={filteredProducts}
          cart={cart}
          onAdd={onAdd}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          showAllBtn={true}
          onResetFilters={() => setSearchQuery("")}
          onProductClick={onProductClick}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          isLoggedIn={isLoggedIn}
        />
      </div>
    );
  }

  // Group products by category to show multiple rows on Store Home
  const dairyProducts = products.filter(p => p.category === "dairy");
  const fruitProducts = products.filter(p => p.category === "fruits");
  const snackProducts = products.filter(p => p.category === "munchies");
  const drinksProducts = products.filter(p => p.category === "drinks");
  const instantProducts = products.filter(p => p.category === "instant");

  return (
    <div class="space-y-10">
      
      {/* HERO BANNER SECTION */}
      <section className="space-y-4">
        {/* Main Banner (Stock up on daily essentials) */}
        <button 
          onClick={() => {
            const el = document.getElementById('shop-categories');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative w-full rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer block border-none p-0 focus:outline-none w-full"
        >
          <img 
            src={bannerImg} 
            alt="Stock up on daily essentials" 
            className="w-full h-auto object-cover max-h-[300px] md:max-h-[360px]"
          />
        </button>

        {/* 3 Sub-Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pharmacy Banner */}
          <div className="bg-gradient-to-r from-[#00b0b9] to-[#008f9c] rounded-3xl p-6 flex justify-between items-center min-h-[140px] text-white shadow-xs hover:shadow-sm transition-shadow">
            <div className="text-left space-y-2 max-w-[60%]">
              <h3 className="font-outfit font-extrabold text-lg leading-tight">Pharmacy at your doorstep!</h3>
              <p className="text-[10px] text-white/80 font-semibold leading-snug">Cough syrups, pain relief sprays & more</p>
              <button className="bg-white text-black font-extrabold text-[10px] px-3.5 py-2 rounded-full cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
                Order Now
              </button>
            </div>
            <div className="w-[35%] h-24 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&h=150&q=80" 
                alt="Pharmacy" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>

          {/* Pet Care Banner */}
          <div className="bg-gradient-to-r from-[#fcb316] to-[#eb9d00] rounded-3xl p-6 flex justify-between items-center min-h-[140px] text-white shadow-xs hover:shadow-sm transition-shadow">
            <div className="text-left space-y-2 max-w-[60%]">
              <h3 className="font-outfit font-extrabold text-lg leading-tight text-[#1c1c1c]">Pet care supplies at your door</h3>
              <p className="text-[10px] text-[#1c1c1c]/80 font-semibold leading-snug">Food, treats, toys & more</p>
              <button className="bg-[#1c1c1c] text-white font-extrabold text-[10px] px-3.5 py-2 rounded-full cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
                Order Now
              </button>
            </div>
            <div className="w-[35%] h-24 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&h=150&q=80" 
                alt="Pet Care" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>

          {/* Baby Care Banner */}
          <div className="bg-gradient-to-r from-[#a2b5cd] to-[#899db7] rounded-3xl p-6 flex justify-between items-center min-h-[140px] text-white shadow-xs hover:shadow-sm transition-shadow">
            <div className="text-left space-y-2 max-w-[60%]">
              <h3 className="font-outfit font-extrabold text-lg leading-tight text-[#1c1c1c]">No time for a diaper run?</h3>
              <p className="text-[10px] text-[#1c1c1c]/80 font-semibold leading-snug">Get baby care essentials</p>
              <button className="bg-[#1c1c1c] text-white font-extrabold text-[10px] px-3.5 py-2 rounded-full cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
                Order Now
              </button>
            </div>
            <div className="w-[35%] h-24 flex items-center justify-center">
              <img 
                src="images/baby care.png" 
                alt="Baby Care" 
                className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>

        </div>
      </section>

      <div id="shop-categories" className="scroll-mt-24">
        <CategoryGrid />
      </div>

      {/* PRODUCT SECTIONS (Dairy & Breakfast, Fresh Fruits, Snacks) */}
      <div class="space-y-12">
        {isLoggedIn && wishlist.length > 0 && (
          <ProductGrid 
            title="Your Favorites"
            products={products.filter(p => wishlist.includes(p.id))}
            cart={cart}
            onAdd={onAdd}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onProductClick={onProductClick}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

    </div>
  );
}
