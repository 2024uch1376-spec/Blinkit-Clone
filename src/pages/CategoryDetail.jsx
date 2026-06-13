import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, categories, subCategories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CategoryDetail({ 
  cart, 
  onAdd, 
  onIncrement, 
  onDecrement,
  onProductClick,
  wishlist = [],
  onToggleWishlist,
  isLoggedIn
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSub, setSelectedSub] = useState("All");

  // Reset selected sub-category whenever category ID route changes
  useEffect(() => {
    // Find the first subcategory in the list and set it
    const subList = subCategories[id] || ["All"];
    setSelectedSub(subList[0] || "All");
  }, [id]);

  // Find current category details
  const currentCategory = categories.find(cat => cat.id === id);
  const categoryProducts = products.filter(p => p.category === id);
  
  // Get sub-categories list
  const subList = subCategories[id] || ["All"];

  // Filter products by selected sub-category
  const filteredProducts = selectedSub === "All"
    ? categoryProducts
    : categoryProducts.filter(p => p.subCategory === selectedSub);

  // Dynamic helper to fetch first matching product's image for subcategory icon
  const getSubCategoryThumbnail = (subName) => {
    const matchingProd = products.find(p => p.category === id && (subName === "All" ? true : p.subCategory === subName));
    return matchingProd ? matchingProd.image : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80";
  };

  return (
    <div class="flex flex-col min-h-screen">
      
      {/* 1. Top Sticky Horizontal Category Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-3.5 sticky top-20 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-6 sm:gap-8">
            {categories.map(cat => {
              const isActive = id === cat.id;
              return (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.id}`}
                  className={`text-xs sm:text-sm font-bold pb-1.5 border-b-2 whitespace-nowrap transition-all duration-150 ${
                    isActive 
                      ? 'border-[#0c831f] text-[#0c831f] font-extrabold' 
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
          <button className="text-xs sm:text-sm font-bold text-gray-400 hover:text-black flex items-center gap-1 shrink-0 select-none cursor-pointer">
            <span>More</span>
            <i class="fa-solid fa-chevron-down text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Subcategories Sidebar & Right Product Grid */}
      <div className="flex flex-col md:flex-row gap-6 items-start mt-6 flex-grow">
        
        {/* 2. Left Subcategories Sidebar */}
        <div className="w-full md:w-48 shrink-0 md:sticky md:top-36 z-20">
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-2.5 p-1 no-scrollbar pb-3 md:pb-0 select-none">
            {subList.map(sub => {
              const isActive = selectedSub === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSub(sub)}
                  className={`flex flex-col md:flex-row items-center gap-2 md:gap-3 p-2.5 rounded-2xl border text-center md:text-left transition-all duration-200 cursor-pointer shrink-0 md:w-full select-none ${
                    isActive 
                      ? "border-[#0c831f]/20 bg-[#0c831f]/5 font-black text-[#0c831f] md:border-l-4 md:border-l-[#0c831f]" 
                      : "border-gray-100 bg-white hover:bg-gray-50 text-gray-500 font-semibold hover:text-black"
                  }`}
                >
                  {/* Circular/Square Subcategory Thumbnail Image */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 p-0.5">
                    <img 
                      src={getSubCategoryThumbnail(sub)} 
                      alt={sub} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Subcategory Label */}
                  <span className="text-[10px] sm:text-xs leading-snug tracking-tight font-extrabold max-w-[80px] md:max-w-none md:truncate">
                    {sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Right Product Grid Area */}
        <div className="flex-grow w-full bg-white border border-gray-50/50 rounded-3xl p-5 shadow-2xs">
          
          {/* Header row */}
          <div className="border-b border-gray-100 pb-3 mb-6 flex justify-between items-center text-left">
            <h3 className="font-outfit font-extrabold text-base sm:text-lg text-blinkit-dark">
              {selectedSub === "All" ? currentCategory?.name : selectedSub}
            </h3>
            <span className="text-xs text-gray-400 font-bold">{filteredProducts.length} items</span>
          </div>

          {/* Grid list of cards */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              <i class="fa-solid fa-cart-flatbed-suitcase opacity-35 mb-2.5 text-3xl block"></i>
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => {
                const qty = cart[product.id] || 0;
                return (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    cartQty={qty}
                    onAdd={onAdd}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                    onProductClick={onProductClick}
                    wishlist={wishlist}
                    onToggleWishlist={onToggleWishlist}
                    isLoggedIn={isLoggedIn}
                  />
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
