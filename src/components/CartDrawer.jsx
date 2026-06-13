import React from 'react';
import { products } from '../data/products';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onIncrement, 
  onDecrement,
  onCheckout,
  appliedCoupon,
  setAppliedCoupon,
  discountAmount,
  totalPrice,
  deliveryFee,
  handlingCharge,
  grandTotal,
  walletBalance,
  useWallet,
  setUseWallet,
  walletDeduction,
  user,
  onLoginClick
}) {
  // Convert cart state object to lists
  const cartItems = Object.entries(cart).map(([idStr, qty]) => {
    const id = parseInt(idStr);
    const product = products.find(p => p.id === id);
    return product ? { ...product, qty } : null;
  }).filter(Boolean);

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Toggle drawer CSS animations classes
  const overlayClass = isOpen 
    ? "opacity-100 pointer-events-auto" 
    : "opacity-0 pointer-events-none";

  const drawerClass = isOpen 
    ? "translate-x-0 animate-slide-in" 
    : "translate-x-full";

  return (
    <div 
      onClick={onClose} 
      class={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${overlayClass}`}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        class={`fixed inset-y-0 right-0 max-w-md w-full bg-[#f4f6fb] shadow-2xl flex flex-col transition-transform duration-300 z-50 ${drawerClass}`}
      >
        {/* Drawer Header */}
        <div class="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button onClick={onClose} class="p-1 -ml-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer" aria-label="Close cart">
              <i class="fa-solid fa-arrow-left text-[#1c1c1c] text-lg"></i>
            </button>
            <h3 class="font-bold text-[#1c1c1c] text-base sm:text-lg">My Cart</h3>
          </div>
          <button class="text-xs sm:text-sm font-bold text-[#0c831f] flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
            <i class="fa-solid fa-share-nodes text-xs"></i>
            Share
          </button>
        </div>

        {/* Drawer Body */}
        <div 
          id="cart-drawer-body" 
          class={`flex-grow overflow-y-auto p-4 relative ${totalQty === 0 ? 'flex items-center justify-center text-center' : ''}`}
        >
          {totalQty === 0 ? (
            <div class="opacity-70 py-20 flex flex-col items-center justify-center bg-[#f4f6fb] w-full h-full rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" 
                alt="Empty Cart" 
                class="w-24 h-24 object-cover opacity-50 rounded-full mb-4 grayscale" 
              />
              <h4 class="font-bold text-gray-800">Your cart is empty</h4>
              <p class="text-xs text-gray-500 mt-1 max-w-[200px]">Add items from the store to see them here</p>
            </div>
          ) : (
            <div class="space-y-3">
              {/* Delivery and Items Container Card */}
              <div class="bg-white rounded-2xl p-4 border border-gray-100/50 shadow-xs">
                {/* Delivery Info row */}
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-stopwatch text-lg text-gray-800"></i>
                  </div>
                  <div class="flex-grow leading-tight">
                    <h4 class="font-extrabold text-sm text-[#1c1c1c]">Delivery in 8 minutes</h4>
                    <p class="text-[11px] text-gray-400 font-medium mt-0.5">Shipment of {totalQty} item{totalQty !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Divider */}
                <div class="border-t border-gray-100 my-4"></div>

                {/* Cart Items List */}
                <div id="cart-items-list" class="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} class="flex items-start gap-3.5">
                      <div class="w-14 h-14 rounded-xl border border-gray-100 p-1 flex items-center justify-center shrink-0 bg-white">
                        <img src={item.image} alt={item.name} class="w-full h-full object-contain" />
                      </div>
                      <div class="flex-grow min-w-0">
                        <h4 class="text-xs sm:text-sm font-semibold text-[#1c1c1c] leading-tight line-clamp-2">{item.name}</h4>
                        <p class="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">{item.weight}</p>
                        <span class="text-xs sm:text-sm font-extrabold text-[#1c1c1c] block mt-1">₹{item.price}</span>
                      </div>
                      <div class="flex items-center justify-between w-24 h-9 bg-[#0c831f] hover:bg-[#0b721b] text-white font-extrabold rounded-lg overflow-hidden shrink-0 select-none">
                        <button 
                          onClick={() => onDecrement(item.id)} 
                          class="w-8 h-full flex items-center justify-center hover:bg-[#095b16] transition-all cursor-pointer text-xs"
                        >
                          <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="flex-1 text-center text-xs sm:text-sm font-extrabold">{item.qty}</span>
                        <button 
                          onClick={() => onIncrement(item.id)} 
                          class="w-8 h-full flex items-center justify-center hover:bg-[#095b16] transition-all cursor-pointer text-xs"
                        >
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupons & Promo Code Card */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100/50 shadow-xs text-left space-y-3">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-ticket text-[#0c831f] text-sm"></i>
                  <h4 className="font-extrabold text-sm sm:text-base text-[#1c1c1c]">Avail Promo & Coupons</h4>
                </div>

                {/* Show Active Coupon Tag if applied */}
                {appliedCoupon ? (
                  <div className="bg-[#0c831f]/5 border border-[#0c831f]/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="bg-[#0c831f] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-xs font-bold text-[#0c831f] ml-2">
                        Applied! Saved ₹{discountAmount}
                      </span>
                    </div>
                    <button 
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs font-extrabold text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  /* List Available Coupon Options */
                  <div className="space-y-2.5">
                    {/* Coupon 1: WELCOME50 */}
                    <div className="border border-gray-100 rounded-xl p-3 flex justify-between items-center bg-gray-50/50 hover:bg-white transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="border border-dashed border-[#0c831f] text-[#0c831f] text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0c831f]/2">
                            WELCOME50
                          </span>
                          <span className="text-xs font-bold text-gray-700">₹50 OFF</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-semibold">Get flat ₹50 off on orders of ₹199 or more</p>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon({ code: "WELCOME50", discount: 50 })}
                        disabled={totalPrice < 199}
                        className={`text-xs font-black px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          totalPrice >= 199 
                            ? "bg-white border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f] hover:text-white" 
                            : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {totalPrice >= 199 ? "Apply" : "Locked"}
                      </button>
                    </div>

                    {/* Coupon 2: BLINKIT10 */}
                    <div className="border border-gray-100 rounded-xl p-3 flex justify-between items-center bg-gray-50/50 hover:bg-white transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="border border-dashed border-[#0c831f] text-[#0c831f] text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0c831f]/2">
                            BLINKIT10
                          </span>
                          <span className="text-xs font-bold text-gray-700">10% OFF</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-semibold">Save 10% on your total order value</p>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon({ code: "BLINKIT10", type: "percent" })}
                        className="text-xs font-black px-3.5 py-1.5 rounded-lg border bg-white border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f] hover:text-white transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Coupon 3: FREEDEL */}
                    <div className="border border-gray-100 rounded-xl p-3 flex justify-between items-center bg-gray-50/50 hover:bg-white transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="border border-dashed border-[#0c831f] text-[#0c831f] text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0c831f]/2">
                            FREEDEL
                          </span>
                          <span className="text-xs font-bold text-gray-700">FREE DELIVERY</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-semibold">Waive off standard ₹25 delivery charge (Min order ₹99)</p>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon({ code: "FREEDEL", type: "free_del" })}
                        disabled={totalPrice < 99}
                        className={`text-xs font-black px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          totalPrice >= 99 
                            ? "bg-white border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f] hover:text-white" 
                            : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {totalPrice >= 99 ? "Apply" : "Locked"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Blinkit Cash Wallet Card */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100/50 shadow-xs text-left flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-xl">👛</span>
                  </div>
                  <div className="leading-tight">
                    <h4 className="font-extrabold text-sm sm:text-base text-[#1c1c1c]">Blinkit Cash</h4>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">Available Balance: ₹{walletBalance}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setUseWallet(!useWallet)}
                    disabled={walletBalance <= 0 || totalPrice === 0}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      useWallet ? 'bg-blue-600' : 'bg-gray-200'
                    } ${ (walletBalance <= 0 || totalPrice === 0) ? 'opacity-50 cursor-not-allowed' : '' }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        useWallet ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Bill Details Card */}
              <div class="bg-white rounded-2xl p-4 border border-gray-100/50 shadow-xs">
                <h4 class="font-extrabold text-sm sm:text-base text-[#1c1c1c] mb-3">Bill details</h4>
                <div class="space-y-2.5 text-xs sm:text-sm font-medium">
                  <div class="flex justify-between items-center text-[#4a4a4a]">
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-file-invoice text-gray-400 text-xs w-4"></i>
                      Items total
                    </span>
                    <span class="text-[#1c1c1c] font-semibold">₹{totalPrice}</span>
                  </div>
                  <div class="flex justify-between items-center text-[#4a4a4a]">
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-motorcycle text-gray-400 text-xs w-4"></i>
                      Delivery charge
                      <i class="fa-solid fa-circle-info text-gray-300 text-[10px]"></i>
                    </span>
                    <span class="text-[#1c1c1c] font-semibold">₹{deliveryFee}</span>
                  </div>
                  <div class="flex justify-between items-center text-[#4a4a4a]">
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-bag-shopping text-gray-400 text-xs w-4"></i>
                      Handling charge
                      <i class="fa-solid fa-circle-info text-gray-300 text-[10px]"></i>
                    </span>
                    <span class="text-[#1c1c1c] font-semibold">₹{handlingCharge}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-[#0c831f]">
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-tags text-[#0c831f] text-xs w-4"></i>
                        Promo Discount
                      </span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}

                  {walletDeduction > 0 && (
                    <div className="flex justify-between items-center text-blue-600 font-semibold">
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-wallet text-blue-600 text-xs w-4"></i>
                        Blinkit Cash Applied
                      </span>
                      <span className="font-bold">-₹{walletDeduction}</span>
                    </div>
                  )}
                  
                  <div class="border-t border-gray-100 my-2"></div>
                  
                  <div class="flex justify-between items-center text-sm sm:text-base font-extrabold text-[#1c1c1c] pt-1.5">
                    <span class="flex items-center gap-1.5">
                      Grand total
                      <i class="fa-solid fa-circle-info text-gray-400 text-[10px]"></i>
                    </span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy Card */}
              <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                <h4 class="font-extrabold text-sm text-[#1c1c1c] mb-1.5">Cancellation Policy</h4>
                <p class="text-[10px] sm:text-xs text-gray-400 font-medium leading-relaxed">
                  Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {totalQty > 0 && (
          <div class="p-4 border-t border-gray-100 bg-white" id="cart-summary-section">
            <button 
              onClick={onCheckout} 
              class="w-full bg-[#0c831f] hover:bg-[#0b721b] text-white py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <div class="flex flex-col text-left leading-tight">
                <span class="text-base sm:text-lg font-black text-white">₹{grandTotal}</span>
                <span class="text-[9px] font-bold text-white/90 tracking-wider">TOTAL</span>
              </div>
              <div class="flex items-center gap-1 font-extrabold text-base sm:text-lg text-white">
                <span>{user ? 'Proceed to Checkout' : 'Login to Proceed'}</span>
                <i class="fa-solid fa-chevron-right text-sm"></i>
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
