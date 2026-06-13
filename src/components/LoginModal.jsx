import React, { useState, useEffect, useRef } from 'react';

export default function LoginModal({ isOpen, onClose, setUser }) {
  if (!isOpen) return null;

  // Wizard steps (1: Phone Input, 2: OTP Verification)
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showToast, setShowToast] = useState(false);

  const otpInputsRef = useRef([]);

  // Focus helper for OTP boxes
  useEffect(() => {
    if (step === 2 && otpInputsRef.current[0]) {
      setTimeout(() => otpInputsRef.current[0].focus(), 100);
    }
  }, [step]);

  // Resend Timer countdown ticking
  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle phone change (digits only, limit to 10)
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setPhone(val);
      setErrorMsg("");
    }
  };

  // Submit phone -> Generate Test OTP & Send
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Generate random 4-digit code
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockCode);
    setResendTimer(30);
    setErrorMsg("");
    setStep(2);
    
    // Trigger visual notification toast at the top
    setShowToast(true);
  };

  // Handle OTP value inputs
  const handleOtpChange = (val, index) => {
    const cleanVal = val.replace(/\D/g, '');
    const copy = [...otp];
    copy[index] = cleanVal;
    setOtp(copy);
    setErrorMsg("");

    // Auto-focus next input field
    if (cleanVal && index < 3) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace focus redirect
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  // Auto-fill test OTP button
  const handleAutoFill = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split("");
    setOtp(digits);
    setShowToast(false);
    // Focus last input box
    setTimeout(() => otpInputsRef.current[3].focus(), 50);
  };

  // Verify OTP submit
  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setErrorMsg("Please enter the full 4-digit code.");
      return;
    }

    if (enteredOtp === generatedOtp) {
      // Success! Log the user in
      setUser({
        phone: phone,
        name: `Premium Guest ${phone.substring(6)}`
      });
      // Cleanup states & dismiss
      setPhone("");
      setOtp(["", "", "", ""]);
      setStep(1);
      setErrorMsg("");
      setShowToast(false);
      onClose();
    } else {
      setErrorMsg("Invalid verification code. Please check the code and try again.");
    }
  };

  // Resend OTP helper
  const handleResend = () => {
    if (resendTimer > 0) return;
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockCode);
    setOtp(["", "", "", ""]);
    setResendTimer(30);
    setErrorMsg("");
    setShowToast(true);
  };

  const handleDismiss = () => {
    // Reset wizard
    setPhone("");
    setOtp(["", "", "", ""]);
    setStep(1);
    setErrorMsg("");
    setShowToast(false);
    onClose();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      
      {/* Floating Verification Notification Code Toast */}
      {showToast && (
        <div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full bg-white border border-[#0c831f]/20 rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div class="flex items-start gap-3 text-left">
            <span class="text-xl">🔑</span>
            <div>
              <h5 class="text-xs font-black text-blinkit-dark">Blinkit Verification</h5>
              <p class="text-[11px] text-gray-500 mt-0.5">
                Use verification code <strong class="text-[#0c831f] text-xs font-black">{generatedOtp}</strong> to login.
              </p>
            </div>
          </div>
          <button 
            onClick={handleAutoFill}
            class="bg-[#0c831f]/10 hover:bg-[#0c831f] text-[#0c831f] hover:text-white px-3 py-1.5 rounded-lg font-black text-[10px] uppercase transition-all shrink-0 cursor-pointer"
          >
            Auto Fill
          </button>
        </div>
      )}

      {/* Login Dialog Box */}
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative transform transition-all overflow-hidden flex flex-col text-center">
        
        {/* Dismiss Button */}
        <button 
          onClick={handleDismiss}
          class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Brand/Logo header */}
        <div class="mb-6 flex flex-col items-center">
          <div class="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center border border-yellow-100/50 mb-3 select-none text-2xl">
            ⚡
          </div>
          <h3 class="font-outfit font-black text-xl sm:text-2xl text-blinkit-dark">
            India's last minute app
          </h3>
          <p class="text-xs text-blinkit-gray font-medium mt-1">
            Log in to access your cart, address, and orders.
          </p>
        </div>

        {/* Validation Alert */}
        {errorMsg && (
          <div class="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 text-xs text-red-600 flex items-center gap-2 font-medium mb-4 text-left">
            <i class="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Mobile Phone input */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} class="space-y-4 text-left">
            <div>
              <label htmlFor="phoneInput" class="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                Enter Phone Number
              </label>
              <div class="flex border border-gray-200 focus-within:border-[#0c831f] focus-within:ring-1 focus-within:ring-[#0c831f]/20 rounded-xl bg-gray-50/50 overflow-hidden transition-all">
                <span class="px-3 py-3 border-r border-gray-200 text-sm font-extrabold text-blinkit-dark bg-gray-50 select-none">
                  +91
                </span>
                <input 
                  id="phoneInput"
                  type="text" 
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10 digit mobile number"
                  class="flex-1 px-4 py-3 text-sm font-bold bg-transparent outline-none placeholder-gray-400 text-blinkit-dark"
                  autoFocus
                  maxLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length !== 10}
              class="w-full bg-[#0c831f] hover:bg-[#0b721b] disabled:bg-gray-100 disabled:text-gray-300 text-white py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <span>Continue</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
            
            <p class="text-[10px] text-gray-400 font-semibold text-center leading-relaxed max-w-[280px] mx-auto pt-2">
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </p>
          </form>
        )}

        {/* Step 2: OTP boxes */}
        {step === 2 && (
          <form onSubmit={handleVerify} class="space-y-6 text-left">
            <div>
              <span class="block text-[10px] font-extrabold text-[#0c831f] uppercase tracking-widest mb-1">
                OTP Verification
              </span>
              <h4 class="font-bold text-[#1c1c1c] text-sm sm:text-base">
                We sent a 4-digit code to <strong class="text-blinkit-dark font-black">+91 {phone.replace(/(\d{5})(\d{5})/, '$1-$2')}</strong>
              </h4>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(["", "", "", ""]); setErrorMsg(""); setShowToast(false); }}
                class="text-xs font-bold text-[#0c831f] hover:underline mt-1 cursor-pointer"
              >
                Change Number?
              </button>
            </div>

            {/* OTP Input Grid */}
            <div class="flex justify-between gap-3 max-w-[260px] mx-auto">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpInputsRef.current[idx] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  maxLength={1}
                  class="w-12 h-12 sm:w-14 sm:h-14 border border-gray-200 focus:border-[#0c831f] focus:ring-1 focus:ring-[#0c831f]/20 rounded-xl text-center text-lg sm:text-xl font-black bg-gray-50/50 outline-none transition-all text-blinkit-dark"
                />
              ))}
            </div>

            <div class="space-y-4">
              <button
                type="submit"
                disabled={otp.join("").length !== 4}
                class="w-full bg-[#0c831f] hover:bg-[#0b721b] disabled:bg-gray-100 disabled:text-gray-300 text-white py-3.5 rounded-xl font-extrabold text-sm sm:text-base text-center transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Verify & Proceed
              </button>

              <div class="text-center text-xs">
                {resendTimer > 0 ? (
                  <span class="text-gray-400 font-semibold">Resend OTP in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    class="text-[#0c831f] font-black hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
