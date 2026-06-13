import React from 'react';

export default function ProductCard({ 
  product, 
  cartQty, 
  onAdd, 
  onIncrement, 
  onDecrement,
  onProductClick,
  wishlist = [],
  onToggleWishlist,
  isLoggedIn
}) {
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e, callback) => {
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

  // Dynamic mock discount calculations to match screenshot prices exactly
  let discountPercent = 0;
  if (product.id % 5 === 0) discountPercent = 12;
  else if (product.id % 4 === 0) discountPercent = 15;
  else if (product.id % 2 === 0 || product.id % 3 === 0) discountPercent = 20;

  const originalPrice = discountPercent > 0 
    ? Math.round(product.price / (1 - discountPercent / 100)) 
    : null;

  return (
    <div class="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
      
      <div 
        onClick={() => onProductClick && onProductClick(product)} 
        class="cursor-pointer"
      >
        {/* Delivery Time Badge */}
        <span class="bg-gray-100 text-[9px] text-blinkit-dark font-extrabold px-2 py-0.5 rounded flex items-center gap-1 w-max mb-3 select-none">
          <i class="fa-solid fa-clock text-[9px]"></i> {product.time}
        </span>

        {/* Product Image Container */}
        <div class="w-full h-32 flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden p-2 mb-3 shrink-0 relative">
          {discountPercent > 0 && (
            <div class="absolute top-2 left-2 bg-[#2570e0] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase z-10 select-none">
              {discountPercent}% OFF
            </div>
          )}
          <img 
            src={product.image} 
            alt={product.name} 
            class="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Heart Button Overlay */}
          {isLoggedIn && onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center border border-gray-100/50 text-gray-400 hover:text-red-500 hover:bg-white active:scale-95 shadow-2xs hover:shadow-xs transition-all cursor-pointer z-10"
              aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
            >
              <i class={`${isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-xs`}></i>
            </button>
          )}
        </div>

        {/* Product Info */}
        <h3 class="text-xs font-bold text-blinkit-dark leading-snug line-clamp-2 h-8 hover:text-black transition-colors" title={product.name}>
          {product.name}
        </h3>
        <p class="text-[10px] text-blinkit-gray font-semibold mt-1">{product.weight}</p>
      </div>

      {/* Price & Button */}
      <div class="flex items-center justify-between mt-4">
        <div class="flex flex-col text-left leading-tight">
          <span class="text-xs font-black text-black">₹{product.price}</span>
          {originalPrice && (
            <span class="text-[10px] text-gray-400 line-through font-semibold">₹{originalPrice}</span>
          )}
        </div>
        
        <div class="h-8 flex items-center justify-center">
          {cartQty === 0 ? (
            <button 
              onClick={(e) => handleAddToCart(e, onAdd)} 
              class="w-20 border border-blinkit-green text-blinkit-green hover:bg-blinkit-lightGreen bg-white font-extrabold text-[11px] uppercase py-1.5 rounded-lg shadow-xs hover:shadow active:scale-95 transition-all text-center select-none cursor-pointer"
            >
              ADD
            </button>
          ) : (
            <div class="flex items-center justify-between w-20 bg-blinkit-green text-white font-bold text-xs rounded-lg shadow-xs overflow-hidden select-none">
              <button 
                onClick={() => onDecrement(product.id)} 
                class="px-2.5 py-1.5 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="text-xs font-bold">{cartQty}</span>
              <button 
                onClick={(e) => handleAddToCart(e, onIncrement)} 
                class="px-2.5 py-1.5 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
