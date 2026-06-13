import React from 'react';

export default function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  cart, 
  onAdd, 
  onIncrement, 
  onDecrement,
  wishlist = [],
  onToggleWishlist,
  isLoggedIn
}) {
  if (!isOpen || !product) return null;

  const qty = cart[product.id] || 0;
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

  return (
    <div 
      onClick={onClose} 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative transform transition-all overflow-hidden flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
      >
        
        {/* Heart/Favorite Button */}
        {isLoggedIn && onToggleWishlist && (
          <button 
            onClick={() => onToggleWishlist(product.id)} 
            class="absolute top-4 right-12 p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer z-10"
            aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
          >
            <i class={`${isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-lg`}></i>
          </button>
        )}

        {/* Close Button */}
        <button 
          onClick={onClose} 
          class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Left Section: Image Display */}
        <div class="w-full md:w-1/2 flex items-center justify-center bg-gray-50/50 rounded-2xl border border-gray-100 p-6 shrink-0 h-64 md:h-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            class="max-h-full max-w-full object-contain mix-blend-multiply" 
          />
        </div>

        {/* Right Section: Details Panel */}
        <div class="w-full md:w-1/2 flex flex-col justify-between text-left space-y-4">
          
          <div class="space-y-2">
            {/* Delivery speed badge */}
            <span class="bg-gray-100 text-[10px] text-blinkit-dark font-extrabold px-2 py-0.5 rounded flex items-center gap-1 w-max select-none">
              <i class="fa-solid fa-clock"></i> {product.time}
            </span>
            
            {/* Title & Weight */}
            <h3 class="font-outfit font-extrabold text-xl sm:text-2xl text-[#1c1c1c] leading-tight">
              {product.name}
            </h3>
            <span class="text-xs sm:text-sm text-blinkit-gray font-semibold block">{product.weight}</span>
          </div>

          {/* Pricing & Add to Cart row */}
          <div class="flex items-center justify-between bg-gray-50/50 border border-gray-100 p-3.5 rounded-2xl">
            <div class="flex flex-col">
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
              <span class="text-xl font-black text-black">₹{product.price}</span>
            </div>

            <div class="h-9 flex items-center shrink-0">
              {qty === 0 ? (
                <button 
                  onClick={(e) => handleAddToCart(e, onAdd)} 
                  class="w-24 bg-white border border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f]/5 font-extrabold text-xs uppercase py-2 rounded-lg transition-all text-center select-none cursor-pointer shadow-2xs"
                >
                  ADD
                </button>
              ) : (
                <div class="flex items-center justify-between w-24 h-9 bg-[#0c831f] hover:bg-[#0b721b] text-white font-extrabold rounded-lg overflow-hidden select-none shadow-2xs">
                  <button 
                    onClick={() => onDecrement(product.id)} 
                    class="w-8 h-full flex items-center justify-center hover:bg-[#095b16] transition-all cursor-pointer text-xs"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="flex-1 text-center text-xs sm:text-sm font-extrabold">{qty}</span>
                  <button 
                    onClick={(e) => handleAddToCart(e, onIncrement)} 
                    class="w-8 h-full flex items-center justify-center hover:bg-[#095b16] transition-all cursor-pointer text-xs"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div class="space-y-1">
              <h4 class="text-xs font-bold text-[#1c1c1c] uppercase tracking-wider">Product Details</h4>
              <p class="text-xs text-gray-500 font-medium leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div class="space-y-1">
              <h4 class="text-xs font-bold text-[#1c1c1c] uppercase tracking-wider">Ingredients</h4>
              <p class="text-xs text-gray-500 font-medium leading-relaxed">{product.ingredients}</p>
            </div>
          )}

          {/* Nutrition Grid */}
          {product.nutrition && (
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-[#1c1c1c] uppercase tracking-wider">Nutritional Information</h4>
              <div class="grid grid-cols-4 gap-2">
                <div class="bg-gray-50/50 rounded-xl p-2 text-center border border-gray-100">
                  <span class="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Energy</span>
                  <span class="text-xs font-black text-[#1c1c1c] mt-0.5 block">{product.nutrition.calories}</span>
                </div>
                <div class="bg-gray-50/50 rounded-xl p-2 text-center border border-gray-100">
                  <span class="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Protein</span>
                  <span class="text-xs font-black text-[#1c1c1c] mt-0.5 block">{product.nutrition.protein}</span>
                </div>
                <div class="bg-gray-50/50 rounded-xl p-2 text-center border border-gray-100">
                  <span class="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Carbs</span>
                  <span class="text-xs font-black text-[#1c1c1c] mt-0.5 block">{product.nutrition.carbs}</span>
                </div>
                <div class="bg-gray-50/50 rounded-xl p-2 text-center border border-gray-100">
                  <span class="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Fat</span>
                  <span class="text-xs font-black text-[#1c1c1c] mt-0.5 block">{product.nutrition.fat}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
