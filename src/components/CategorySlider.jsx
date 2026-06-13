import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/products';

export default function CategorySlider({ selectedCategory }) {
  const scrollCategories = (distance) => {
    const container = document.getElementById("category-row");
    if (container) {
      container.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <section class="mb-12">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-outfit font-extrabold text-2xl tracking-tight">Shop by Category</h2>
        <div class="flex gap-2">
          <button 
            onClick={() => scrollCategories(-200)} 
            class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button 
            onClick={() => scrollCategories(200)} 
            class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div 
        id="category-row" 
        class="flex gap-5 overflow-x-auto pt-3 pb-4 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          const borderStyle = isActive 
            ? 'border-2 border-blinkit-green scale-105 shadow-sm bg-blinkit-lightGreen' 
            : 'border-2 border-gray-100 hover:border-blinkit-green/40 hover:-translate-y-0.5';

          return (
            <Link 
              key={cat.id}
              to={`/category/${cat.id}`} 
              class={`flex-shrink-0 snap-start text-center cursor-pointer transition-all duration-200 select-none ${isActive ? 'scale-105' : ''} group`}
            >
              <div class={`w-24 h-24 ${cat.bgColor} ${borderStyle} rounded-2xl flex items-center justify-center text-4xl shadow-xs transition-all relative overflow-hidden`}>
                <span class="z-10">{cat.emoji}</span>
                <div class="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </div>
              <p class="text-xs font-bold text-blinkit-dark mt-2.5 max-w-[96px] mx-auto truncate">
                {cat.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
