import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ 
  products, 
  cart, 
  onAdd, 
  onIncrement, 
  onDecrement,
  title,
  showAllBtn = false,
  onResetFilters,
  onProductClick,
  wishlist = [],
  onToggleWishlist,
  isLoggedIn
}) {
  return (
    <section class="mb-16">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-baseline gap-3">
          <h2 id="grid-title" class="font-outfit font-extrabold text-2xl tracking-tight">
            {title}
          </h2>
          <span class="text-sm font-semibold text-blinkit-gray">
            {products.length} item{products.length !== 1 ? 's' : ''}
          </span>
        </div>
        {showAllBtn && (
          <button 
            onClick={onResetFilters} 
            class="text-sm font-bold text-blinkit-green hover:underline cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div class="py-16 text-center text-blinkit-gray">
          <i class="fa-solid fa-magnifying-glass text-4xl opacity-20 mb-3"></i>
          <h3 class="font-bold text-base text-gray-700">No items found</h3>
          <p class="text-xs mt-1">Try searching for other products, e.g., 'milk', 'bread', or 'eggs'.</p>
        </div>
      ) : (
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map(product => (
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
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </section>
  );
}
