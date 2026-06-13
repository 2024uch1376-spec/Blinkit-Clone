import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function CartPage({ 
  cart, 
  onIncrement, 
  onDecrement,
  onCheckout
}) {
  // Convert cart state object to lists
  const cartItems = Object.entries(cart).map(([idStr, qty]) => {
    const id = parseInt(idStr);
    const product = products.find(p => p.id === id);
    return product ? { ...product, qty } : null;
  }).filter(Boolean);

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = totalPrice > 0 ? 15 : 0;
  const handlingCharge = totalPrice > 0 ? 4 : 0;
  const grandTotal = totalPrice > 0 ? totalPrice + deliveryFee + handlingCharge : 0;

  if (totalQty === 0) {
    return (
      <div class="max-w-2xl mx-auto py-16 px-4 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-cart-shopping text-gray-400 text-3xl"></i>
        </div>
        <h2 class="font-outfit font-extrabold text-2xl mb-2">Your cart is empty</h2>
        <p class="text-sm text-blinkit-gray mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          class="inline-block bg-blinkit-green hover:bg-blinkit-greenHover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div class="max-w-5xl mx-auto py-6">
      <h2 class="font-outfit font-extrabold text-3xl mb-8 tracking-tight">Shopping Cart</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Items list */}
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
            <h3 class="font-bold text-lg mb-4 text-blinkit-dark">Items Summary</h3>
            <div class="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} class="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={item.image} alt={item.name} class="w-16 h-16 object-contain rounded-lg border border-gray-50 p-1 shrink-0" />
                  
                  <div class="flex-grow">
                    <h4 class="text-sm font-bold text-blinkit-dark leading-snug">{item.name}</h4>
                    <p class="text-xs text-blinkit-gray font-medium mt-0.5">{item.weight}</p>
                    <span class="text-xs font-semibold text-blinkit-gray block mt-1">₹{item.price} / unit</span>
                  </div>

                  <div class="flex flex-col items-end gap-2 shrink-0">
                    <span class="text-sm font-extrabold text-black">₹{item.price * item.qty}</span>
                    <div class="flex items-center justify-between w-20 bg-blinkit-green text-white font-bold text-xs rounded-lg overflow-hidden select-none shadow-xs">
                      <button 
                        onClick={() => onDecrement(item.id)} 
                        class="px-2.5 py-1.5 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"
                      >
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <span>{item.qty}</span>
                      <button 
                        onClick={() => onIncrement(item.id)} 
                        class="px-2.5 py-1.5 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Checkout billing */}
        <div class="space-y-4">
          <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
            <h3 class="font-bold text-lg mb-4 text-blinkit-dark">Bill Details</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-blinkit-gray">
                <span>Subtotal ({totalQty} item{totalQty !== 1 ? 's' : ''})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div class="flex justify-between text-blinkit-gray">
                <span>Delivery Partner Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div class="flex justify-between text-blinkit-gray">
                <span>Handling Charge</span>
                <span>₹{handlingCharge}</span>
              </div>
              <hr class="border-gray-100 my-1" />
              <div class="flex justify-between font-extrabold text-base text-blinkit-dark pt-1">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout} 
              class="w-full mt-6 bg-blinkit-green hover:bg-blinkit-greenHover text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:shadow-green-200 active:scale-95 transition-all cursor-pointer"
            >
              <span>Place Order</span>
              <span class="bg-white/20 px-2 py-0.5 rounded text-sm">₹{grandTotal}</span>
            </button>
          </div>

          <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center text-xs text-blinkit-gray">
            <i class="fa-solid fa-shield-halved text-blinkit-green mr-1.5"></i>
            <span>Safe and secure payments. 100% authentic items.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
