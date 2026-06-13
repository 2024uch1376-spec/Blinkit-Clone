import React, { useState, useEffect } from 'react';

// Confetti particle effect component for Phase 3 payment success screen
const Confetti = () => {
  const colors = ['bg-[#0c831f]', 'bg-[#ffc107]', 'bg-[#ff5722]', 'bg-[#00bcd4]', 'bg-[#e91e63]'];
  return (
    <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(450px) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: confetti-fall 2.5s linear infinite;
        }
      `}</style>
      {Array.from({ length: 30 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 1.8 + Math.random() * 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            class={`confetti-piece ${color}`}
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        );
      })}
    </div>
  );
};

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  location, 
  setLocation, 
  totalPrice,
  deliveryFee,
  handlingCharge,
  appliedCoupon,
  discountAmount,
  grandTotal, 
  walletDeduction,
  cashbackEarned,
  onSuccess 
}) {
  if (!isOpen) return null;

  // Wizard Step Tracker (1: Address, 2: Payment, 3: Processing, 4: Success)
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  
  // Payment states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Validation errors
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-redirect to Step 4 after payment loader finishes
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(4);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Reset wizard on opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMsg("");
      setUpiId("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
    }
  }, [isOpen]);

  const addresses = [
    "Home - Sector 62, Noida, UP",
    "Office - Block C, Sector 62, Noida",
    "Parents - Sector 15, Vasundhara",
    "Howrah Railway Station, Howrah, WB"
  ];

  // Card details formatting
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
    setErrorMsg("");
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    let formatted = val;
    if (val.length > 2) {
      formatted = val.substring(0, 2) + '/' + val.substring(2);
    }
    setExpiry(formatted);
    setErrorMsg("");
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.substring(0, 3);
    setCvv(val);
    setErrorMsg("");
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
    setErrorMsg("");
  };

  // Submit payment validation
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "upi") {
      if (!upiId || !upiId.includes("@")) {
        setErrorMsg("Please enter a valid UPI ID (e.g., name@upi)");
        return;
      }
    } else if (paymentMethod === "card") {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length !== 16) {
        setErrorMsg("Card Number must be exactly 16 digits.");
        return;
      }
      if (expiry.length !== 5 || !expiry.includes("/")) {
        setErrorMsg("Please enter expiry date in MM/YY format.");
        return;
      }
      if (cvv.length !== 3) {
        setErrorMsg("CVV must be 3 digits.");
        return;
      }
    }
    setErrorMsg("");
    setStep(3); // Start loader step
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative transform transition-all overflow-hidden">
        
        {/* Close Button (disabled during processing step) */}
        {step !== 3 && (
          <button 
            onClick={onClose} 
            class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        )}

        {/* Step 1: Confirm Address Selection */}
        {step === 1 && (
          <div class="text-left space-y-4">
            <div>
              <span class="text-[10px] font-bold text-blinkit-green uppercase tracking-widest">Step 1 of 2</span>
              <h3 class="font-outfit font-extrabold text-xl text-[#1c1c1c] mt-0.5">Delivery Address</h3>
            </div>
            
            <p class="text-xs text-gray-500">Confirm where you want your order to be delivered:</p>

            <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
              {addresses.map(addr => {
                const isActive = location === addr;
                return (
                  <button
                    key={addr}
                    onClick={() => setLocation(addr)}
                    class={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? "border-[#0c831f] bg-[#0c831f]/5 font-bold text-blinkit-green" 
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <i class={`fa-solid ${addr.startsWith('Home') ? 'fa-house' : addr.startsWith('Office') ? 'fa-briefcase' : 'fa-location-dot'} text-sm shrink-0 opacity-80`}></i>
                      <span class="text-xs truncate">{addr}</span>
                    </div>
                    {isActive && <i class="fa-solid fa-circle-check text-[#0c831f] shrink-0"></i>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              class="w-full bg-[#0c831f] hover:bg-[#0b721b] text-white py-3 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <span>Confirm & Proceed to Payment</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        )}

        {/* Step 2: Select Payment Method */}
        {step === 2 && (
          <div class="text-left space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[10px] font-bold text-blinkit-green uppercase tracking-widest">Step 2 of 2</span>
                <h3 class="font-outfit font-extrabold text-xl text-[#1c1c1c] mt-0.5">Select Payment</h3>
              </div>
              <div class="text-right leading-none">
                <span class="text-[9px] text-gray-400 font-bold uppercase block mb-0.5">Payable Amount</span>
                <span class="text-lg font-black text-[#1c1c1c]">₹{grandTotal}</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div class="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 text-xs text-red-600 flex items-center gap-2 font-medium">
                <i class="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Payment Options Accordion */}
            <div class="space-y-2.5">
              
              {/* UPI Option */}
              <div class={`border rounded-xl transition-all ${paymentMethod === 'upi' ? 'border-[#0c831f] bg-[#0c831f]/2' : 'border-gray-200'}`}>
                <button
                  onClick={() => { setPaymentMethod('upi'); setErrorMsg(''); }}
                  class="w-full flex items-center gap-3 p-3.5 cursor-pointer text-left"
                >
                  <input type="radio" checked={paymentMethod === 'upi'} readOnly class="accent-[#0c831f] pointer-events-none" />
                  <i class="fa-solid fa-mobile-screen-button text-[#0c831f]"></i>
                  <span class="text-xs sm:text-sm font-bold text-[#1c1c1c]">UPI (GPay, PhonePe, Paytm)</span>
                </button>
                
                {paymentMethod === 'upi' && (
                  <div class="px-3.5 pb-4 pt-1.5 border-t border-gray-100/50">
                    <input
                      type="text"
                      value={upiId}
                      onChange={handleUpiChange}
                      placeholder="Enter UPI ID (e.g. name@upi)"
                      class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:bg-white focus:border-[#0c831f] transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Credit/Debit Card Option */}
              <div class={`border rounded-xl transition-all ${paymentMethod === 'card' ? 'border-[#0c831f] bg-[#0c831f]/2' : 'border-gray-200'}`}>
                <button
                  onClick={() => { setPaymentMethod('card'); setErrorMsg(''); }}
                  class="w-full flex items-center gap-3 p-3.5 cursor-pointer text-left"
                >
                  <input type="radio" checked={paymentMethod === 'card'} readOnly class="accent-[#0c831f] pointer-events-none" />
                  <i class="fa-solid fa-credit-card text-[#0c831f]"></i>
                  <span class="text-xs sm:text-sm font-bold text-[#1c1c1c]">Credit or Debit Card</span>
                </button>
                
                {paymentMethod === 'card' && (
                  <div class="px-3.5 pb-4 pt-2.5 border-t border-gray-100/50 space-y-2">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="Card Number (16 digits)"
                      class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:bg-white focus:border-[#0c831f] transition-all"
                    />
                    <div class="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:bg-white focus:border-[#0c831f] transition-all text-center"
                      />
                      <input
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="CVV"
                        class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:bg-white focus:border-[#0c831f] transition-all text-center"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cash On Delivery Option */}
              <div class={`border rounded-xl transition-all ${paymentMethod === 'cod' ? 'border-[#0c831f] bg-[#0c831f]/2' : 'border-gray-200'}`}>
                <button
                  onClick={() => { setPaymentMethod('cod'); setErrorMsg(''); }}
                  class="w-full flex items-center gap-3 p-3.5 cursor-pointer text-left"
                >
                  <input type="radio" checked={paymentMethod === 'cod'} readOnly class="accent-[#0c831f] pointer-events-none" />
                  <i class="fa-solid fa-money-bill-wave text-[#0c831f]"></i>
                  <span class="text-xs sm:text-sm font-bold text-[#1c1c1c]">Cash on Delivery (COD)</span>
                </button>
                
                {paymentMethod === 'cod' && (
                  <div class="px-3.5 pb-3 pt-1 border-t border-gray-100/50 text-[11px] text-gray-500 font-medium">
                    Please prepare digital payment or exact change for our delivery partner at your door.
                  </div>
                )}
              </div>

            </div>

            {/* Navigation buttons */}
            <div class="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(1)}
                class="px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-xs sm:text-sm text-gray-600 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handlePaymentSubmit}
                class="flex-1 bg-[#0c831f] hover:bg-[#0b721b] text-white py-3 rounded-xl font-extrabold text-xs sm:text-sm text-center transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Pay & Place Order (₹{grandTotal})
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Transaction Processing Loader */}
        {step === 3 && (
          <div class="py-8 px-4 flex flex-col items-center justify-center space-y-4">
            <div class="w-14 h-14 border-4 border-gray-100 border-t-[#0c831f] rounded-full animate-spin"></div>
            <div class="text-center space-y-1">
              <h4 class="font-bold text-[#1c1c1c] text-base">Securing your payment...</h4>
              <p class="text-xs text-gray-400 max-w-[280px]">Contacting your bank. Please do not close this window or refresh the page.</p>
            </div>
          </div>
        )}

        {/* Step 4: Confetti Success Confirmation */}
        {step === 4 && (
          <div class="text-center py-4 relative">
            <Confetti />
            
            <div class="w-16 h-16 bg-green-50 text-blinkit-green rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blinkit-green/10 scale-110 animate-bounce">
              <i class="fa-solid fa-check text-2xl"></i>
            </div>
            
            <h3 class="font-outfit font-extrabold text-xl text-[#1c1c1c] mb-1">Order Placed Successfully!</h3>
            <p class="text-xs text-blinkit-gray mb-4">Your order will arrive in 10 minutes at {location.replace('Home - ', '').replace('Office - ', '')}.</p>
            
            {/* Cashback Reward Alert Card */}
            {cashbackEarned > 0 && (
              <div class="bg-[#0c831f]/10 border border-[#0c831f]/20 rounded-2xl p-3.5 mb-4 text-center text-xs font-bold text-[#0c831f] flex items-center justify-center gap-2">
                <span>🎉 You earned ₹{cashbackEarned} cashback! Credited to your Blinkit Cash.</span>
              </div>
            )}

            {/* Payment Summary Box */}
            <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs text-gray-500 font-medium">
              <div class="flex justify-between">
                <span>Transaction ID</span>
                <span class="text-[#1c1c1c] font-semibold">TXN{Math.floor(100000000 + Math.random() * 900000000)}</span>
              </div>
              <div class="flex justify-between">
                <span>Payment Mode</span>
                <span class="text-[#1c1c1c] font-semibold uppercase">{paymentMethod}</span>
              </div>
              {appliedCoupon && (
                <div class="flex justify-between text-[#0c831f] font-semibold">
                  <span>Promo Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              {walletDeduction > 0 && (
                <div class="flex justify-between text-blue-600 font-semibold">
                  <span>Blinkit Cash Applied</span>
                  <span>-₹{walletDeduction}</span>
                </div>
              )}
              <div class="flex justify-between">
                <span>Amount Paid</span>
                <span class="text-[#1c1c1c] font-bold text-blinkit-green">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={onSuccess} 
              class="w-full bg-[#1c1c1c] hover:bg-neutral-800 text-white py-3 rounded-xl font-extrabold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Track Order Details
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
