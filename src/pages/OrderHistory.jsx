import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderHistory({ orders = [], setOrders, location }) {
  const navigate = useNavigate();
  const activeOrder = orders.find(order => order.status === "Processing");
  const pastOrders = orders.filter(order => order.status === "Delivered");

  // Local state for tracking simulation
  const pathRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [scooterPos, setScooterPos] = useState({ x: 80, y: 150, angle: 0 });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [showCallAlert, setShowCallAlert] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  
  // Set stage & progress based on active order
  const currentStage = activeOrder ? (activeOrder.stage !== undefined ? activeOrder.stage : 0) : 0;

  // Sync stage to progress range
  useEffect(() => {
    if (!activeOrder) {
      setProgress(0);
      return;
    }

    if (currentStage === 0) {
      setProgress(0);
      setTimeLeft(600);
    } else if (currentStage === 1) {
      setProgress(12);
      setTimeLeft(480);
    } else if (currentStage === 2) {
      // Start of delivery
      setProgress(18);
      setTimeLeft(320);
    } else if (currentStage === 3) {
      setProgress(100);
      setTimeLeft(0);
    }
  }, [currentStage, activeOrder]);

  // Smooth scooter progress increment during Stage 2 (Out for Delivery)
  useEffect(() => {
    if (!activeOrder || currentStage !== 2) return;

    // We want progress to go from 18% to 95% over 15 seconds (15000 ms)
    // 77% / 150 steps = ~0.51% every 100ms
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 0.51;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeOrder, currentStage]);

  // Ticking countdown timer
  useEffect(() => {
    if (!activeOrder || currentStage === 3) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeOrder, currentStage]);

  // Interpolate scooter position on SVG path
  useEffect(() => {
    if (pathRef.current) {
      try {
        const pathLength = pathRef.current.getTotalLength();
        const targetLength = pathLength * (progress / 100);
        const p = pathRef.current.getPointAtLength(targetLength);
        
        // Calculate angle by looking slightly ahead
        const pAhead = pathRef.current.getPointAtLength(Math.min(pathLength, targetLength + 2));
        const dx = pAhead.x - p.x;
        const dy = pAhead.y - p.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        setScooterPos({ x: p.x, y: p.y, angle: angle });
      } catch (e) {
        // Fallback for environment constraints: hardcoded linear interpolation
        const points = [
          { x: 80, y: 150 },
          { x: 220, y: 120 },
          { x: 300, y: 240 },
          { x: 280, y: 400 },
          { x: 420, y: 440 },
          { x: 550, y: 380 },
          { x: 620, y: 240 },
          { x: 720, y: 200 }
        ];
        const idx = Math.min(points.length - 2, Math.floor((progress / 100) * (points.length - 1)));
        const nextIdx = idx + 1;
        const t = ((progress / 100) * (points.length - 1)) - idx;
        const x = points[idx].x + (points[nextIdx].x - points[idx].x) * t;
        const y = points[idx].y + (points[nextIdx].y - points[idx].y) * t;
        setScooterPos({ x, y, angle: 0 });
      }
    }
  }, [progress]);

  // Cycle active order stages automatically in background (15 seconds per stage)
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      const stage = activeOrder.stage !== undefined ? activeOrder.stage : 0;
      
      if (stage < 2) {
        // Confirmed -> Packing -> Out for Delivery
        const updated = orders.map(ord => {
          if (ord.id === activeOrder.id) {
            return { ...ord, stage: stage + 1 };
          }
          return ord;
        });
        setOrders(updated);
      } else if (stage === 2) {
        // Out for Delivery -> Delivered
        clearInterval(interval);
        const updated = orders.map(ord => {
          if (ord.id === activeOrder.id) {
            return { ...ord, status: "Delivered", stage: 3 };
          }
          return ord;
        });
        setOrders(updated);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [activeOrder, orders, setOrders]);

  // Handle Mock Phone Call Timer
  useEffect(() => {
    let interval;
    if (callActive) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  // Simulate Instant Speed Up Delivery
  const simulateInstantDelivery = () => {
    if (!activeOrder) return;
    const updated = orders.map(ord => {
      if (ord.id === activeOrder.id) {
        return { ...ord, status: "Delivered", stage: 3 };
      }
      return ord;
    });
    setOrders(updated);
    setProgress(100);
    setTimeLeft(0);
  };

  const handleCallRider = () => {
    setShowCallAlert(true);
    setCallActive(true);
  };

  const closeCallAlert = () => {
    setCallActive(false);
    setShowCallAlert(false);
  };

  // Format time left helper
  const formatTime = (seconds) => {
    if (seconds <= 0) return "Arrived";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div class="max-w-7xl mx-auto py-6 px-4">
      {/* Page Title */}
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-outfit font-extrabold text-2xl sm:text-3xl text-blinkit-dark tracking-tight">
          Track Your Essentials
        </h2>
        <Link to="/" class="text-sm font-bold text-[#0c831f] hover:underline flex items-center gap-1.5">
          <i class="fa-solid fa-arrow-left text-xs"></i> Back to Shopping
        </Link>
      </div>

      {/* Main Grid: Map & Timeline */}
      {activeOrder ? (
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Side: Visual Map Simulator Container */}
          <div class="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-[450px] sm:h-[520px]">
            {/* Map Header / Live Label */}
            <div class="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-xs shadow-md border border-gray-100 py-1.5 px-3 rounded-full flex items-center gap-2 select-none">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span class="text-[10px] font-black tracking-wider uppercase text-gray-500">LIVE SIMULATOR</span>
            </div>

            {/* Speed Up Pill overlay */}
            <div class="absolute top-6 right-6 z-10">
              <button 
                onClick={simulateInstantDelivery}
                class="bg-[#0c831f] hover:bg-[#0b721b] text-white py-1.5 px-3.5 rounded-full font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-bolt text-[10px]"></i> Speed Up
              </button>
            </div>

            {/* Custom SVG Map Grid Canvas */}
            <div class="w-full h-full">
              <svg 
                viewBox="0 0 800 550" 
                class="w-full h-full bg-[#fcfdfd] select-none rounded-2xl border border-gray-50"
              >
                <defs>
                  {/* Grid Lines Pattern */}
                  <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f4f6f7" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />

                {/* Park Area 1 */}
                <rect x="50" y="240" width="130" height="150" rx="24" fill="#edf7ee" />
                <circle cx="100" cy="300" r="16" fill="#cbe6ce" opacity="0.6" />
                <circle cx="130" cy="330" r="12" fill="#cbe6ce" opacity="0.6" />
                {/* Park Area 2 */}
                <rect x="520" y="60" width="180" height="100" rx="24" fill="#edf7ee" />
                <circle cx="600" cy="110" r="18" fill="#cbe6ce" opacity="0.6" />
                {/* Park Area 3 */}
                <circle cx="400" cy="220" r="80" fill="#edf7ee" />
                <circle cx="390" cy="200" r="24" fill="#cbe6ce" opacity="0.6" />

                {/* Water River Body */}
                <path 
                  d="M -10 520 C 200 490, 350 540, 520 510 C 650 480, 720 530, 810 500" 
                  fill="none" 
                  stroke="#e1f3fd" 
                  strokeWidth="32" 
                  strokeLinecap="round" 
                />

                {/* Grid Streets (Side Roads Background) */}
                <g stroke="#f0f3f5" strokeWidth="10" strokeLinecap="round" strokeDasharray="6,4">
                  <line x1="80" y1="0" x2="80" y2="550" />
                  <line x1="300" y1="0" x2="300" y2="550" />
                  <line x1="620" y1="0" x2="620" y2="550" />
                  <line x1="720" y1="0" x2="720" y2="550" />
                  <line x1="0" y1="120" x2="800" y2="120" />
                  <line x1="0" y1="240" x2="800" y2="240" />
                  <line x1="0" y1="400" x2="800" y2="400" />
                </g>

                {/* Delivery Path Road Outline */}
                <path 
                  d="M 80 150 C 220 120, 300 240, 280 400 C 420 440, 550 380, 620 240 C 620 240, 670 200, 720 200"
                  fill="none" 
                  stroke="#f5f7f8" 
                  strokeWidth="20" 
                  strokeLinecap="round" 
                />
                
                {/* Main active road track line (Light Green Glow) */}
                <path 
                  ref={pathRef}
                  d="M 80 150 C 220 120, 300 240, 280 400 C 420 440, 550 380, 620 240 C 620 240, 670 200, 720 200"
                  fill="none" 
                  stroke="#e2f5e9" 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                />

                {/* Route completed section (Glowing overlay) */}
                <path 
                  d="M 80 150 C 220 120, 300 240, 280 400 C 420 440, 550 380, 620 240 C 620 240, 670 200, 720 200"
                  fill="none" 
                  stroke="#0c831f" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeDasharray="8,6"
                  opacity="0.85"
                />

                {/* Pulsating Dark Store Pin */}
                <g transform="translate(80, 150)">
                  <circle cx="0" cy="0" r="18" fill="#0c831f" opacity="0.25" class="animate-ping" />
                  <circle cx="0" cy="0" r="10" fill="#0c831f" stroke="#ffffff" strokeWidth="2.5" />
                  <text y="-18" textAnchor="middle" font-size="10" font-weight="900" fill="#1c1c1c" class="font-outfit">Dark Store</text>
                  <text y="3" textAnchor="middle" font-size="8" fill="#ffffff" font-weight="black">🏬</text>
                </g>

                {/* Pulsating Home Pin */}
                <g transform="translate(720, 200)">
                  <circle cx="0" cy="0" r="18" fill="#e91e63" opacity="0.25" class="animate-ping" />
                  <circle cx="0" cy="0" r="10" fill="#e91e63" stroke="#ffffff" strokeWidth="2.5" />
                  <text y="-18" textAnchor="middle" font-size="10" font-weight="900" fill="#1c1c1c" class="font-outfit">Home</text>
                  <text y="3" textAnchor="middle" font-size="8" fill="#ffffff" font-weight="black">🏠</text>
                </g>

                {/* Delivery Scooter / Rider Group */}
                <g transform={`translate(${scooterPos.x}, ${scooterPos.y}) rotate(${scooterPos.angle})`}>
                  {/* Ripple pulse wave behind rider */}
                  {currentStage === 2 && (
                    <circle cx="-6" cy="-2" r="12" fill="#ffb300" opacity="0.4" class="animate-ping" />
                  )}
                  
                  {/* Detailed Vector Scooter Shape */}
                  <g transform="translate(-10, -16) scale(1.15)">
                    {/* shadow */}
                    <ellipse cx="9" cy="21" rx="11" ry="3.5" fill="rgba(0, 0, 0, 0.15)" />
                    {/* wheels */}
                    <circle cx="2" cy="18" r="3.5" fill="#37474f" stroke="#ffffff" strokeWidth="1" />
                    <circle cx="16" cy="18" r="3.5" fill="#37474f" stroke="#ffffff" strokeWidth="1" />
                    {/* body */}
                    <path d="M 2 13 L 7 13 L 11 17 L 16 17 L 16 13 L 13 9 L 7 9 Z" fill="#0c831f" />
                    {/* Yellow bag */}
                    <rect x="-1" y="2" width="8" height="8" fill="#ffb300" rx="1.5" />
                    <text x="3" y="8.5" font-size="6.5" font-weight="900" fill="#ffffff" text-anchor="middle" class="font-outfit">b</text>
                    {/* handle */}
                    <line x1="14" y1="9" x2="13" y2="3" stroke="#37474f" strokeWidth="1.5" />
                    <circle cx="13" cy="3" r="1.2" fill="#ff5722" />
                    {/* Rider with helmet */}
                    <circle cx="8" cy="-1.5" r="4" fill="#0c831f" />
                    <rect x="7" y="-1.5" width="4" height="1.8" fill="#212121" />
                  </g>
                </g>
              </svg>
            </div>
            
            {/* Map Footer status label */}
            <div class="bg-gray-50 border-t border-gray-100 -mx-4 -mb-4 p-4 flex items-center justify-between text-xs text-gray-500 font-semibold rounded-b-3xl">
              <span>Rider route: Noida Dark Store Sector 62 ➔ {location.replace('Home - ', '').replace('Office - ', '')}</span>
              <span class="text-[#0c831f] font-bold">Estimated Path Distance: 2.4 km</span>
            </div>

          </div>

          {/* Right Side: Timeline & Delivery Partner details */}
          <div class="lg:col-span-5 flex flex-col gap-6">
            
            {/* Countdown card */}
            <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-blinkit-gray">Estimated Delivery Time</span>
                <div class="font-outfit font-black text-2xl sm:text-3xl text-blinkit-dark mt-1 flex items-baseline gap-2">
                  <span class={currentStage === 3 ? "text-[#0c831f]" : "text-black"}>
                    {formatTime(timeLeft)}
                  </span>
                  {currentStage !== 3 && (
                    <span class="text-xs font-semibold text-gray-400">mins left</span>
                  )}
                </div>
              </div>
              <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-xl shrink-0">
                {currentStage === 3 ? "🎉" : "⚡"}
              </div>
            </div>

            {/* Rider Contact Card */}
            <div class="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div class="flex items-center gap-4">
                {/* Rider Photo placeholder */}
                <div class="w-14 h-14 bg-gradient-to-tr from-[#0c831f] to-green-300 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm border border-green-100 shrink-0">
                  RK
                </div>
                <div class="flex-grow text-left">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-blinkit-dark text-sm sm:text-base">Ramesh Kumar</h4>
                    <span class="bg-blue-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none">
                      <i class="fa-solid fa-shield-halved"></i> Safety Certified
                    </span>
                  </div>
                  <p class="text-xs text-blinkit-gray font-semibold mt-1">4.9 ★ • 1,500+ successful deliveries</p>
                </div>
              </div>

              <div class="flex gap-2.5 pt-1">
                <button 
                  onClick={handleCallRider}
                  disabled={currentStage === 3}
                  class="flex-1 bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-40 text-blinkit-dark py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <i class="fa-solid fa-phone text-xs text-[#0c831f]"></i>
                  <span>Call Delivery Partner</span>
                </button>
                <div class="bg-[#0c831f]/10 text-[#0c831f] text-[10px] font-bold py-2.5 px-3 rounded-xl flex items-center gap-1.5 shrink-0 select-none">
                  <i class="fa-solid fa-temperature-low"></i>
                  <span>97.8°F Temp Ok</span>
                </div>
              </div>
            </div>

            {/* Status Steps Stepper Timeline */}
            <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 text-left">
              <h4 class="font-extrabold text-blinkit-dark text-sm sm:text-base border-b border-gray-100 pb-3">Delivery Status</h4>
              
              <div class="relative pl-8 space-y-6 before:absolute before:inset-y-1 before:left-3 before:w-0.5 before:bg-gray-100">
                
                {/* Step 1: Placed */}
                <div class="relative">
                  <div class={`absolute -left-[27px] top-1 w-5.5 h-5.5 rounded-full text-white flex items-center justify-center text-[10px] border-4 border-white shadow-xs transition-colors duration-300 ${
                    currentStage >= 1 ? 'bg-[#0c831f]' : 'bg-amber-400 animate-pulse'
                  }`}>
                    {currentStage >= 1 ? (
                      <i class="fa-solid fa-check"></i>
                    ) : (
                      <i class="fa-solid fa-spinner animate-spin"></i>
                    )}
                  </div>
                  <div>
                    <h5 class={`text-xs sm:text-sm font-bold ${currentStage === 0 ? 'text-amber-500 font-extrabold' : 'text-blinkit-dark'}`}>
                      Order Confirmed
                    </h5>
                    <p class="text-xs text-blinkit-gray mt-0.5 leading-relaxed">We have received your payment and verified the order at dark store.</p>
                  </div>
                </div>

                {/* Step 2: Packing */}
                <div class={`relative transition-opacity duration-300 ${currentStage >= 1 ? '' : 'opacity-40'}`}>
                  <div class={`absolute -left-[27px] top-1 w-5.5 h-5.5 rounded-full text-white flex items-center justify-center text-[10px] border-4 border-white shadow-xs transition-colors duration-300 ${
                    currentStage >= 2 ? 'bg-[#0c831f]' : currentStage === 1 ? 'bg-amber-400 animate-pulse' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStage >= 2 ? (
                      <i class="fa-solid fa-check"></i>
                    ) : currentStage === 1 ? (
                      <i class="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                      <i class="fa-solid fa-box text-[8px]"></i>
                    )}
                  </div>
                  <div>
                    <h5 class={`text-xs sm:text-sm font-bold ${currentStage === 1 ? 'text-amber-500 font-extrabold' : 'text-blinkit-dark'}`}>
                      Packing Items
                    </h5>
                    <p class="text-xs text-blinkit-gray mt-0.5 leading-relaxed">Store executive is handpicking the freshest groceries for your bag.</p>
                  </div>
                </div>

                {/* Step 3: Out for Delivery */}
                <div class={`relative transition-opacity duration-300 ${currentStage >= 2 ? '' : 'opacity-40'}`}>
                  <div class={`absolute -left-[27px] top-1 w-5.5 h-5.5 rounded-full text-white flex items-center justify-center text-[10px] border-4 border-white shadow-xs transition-colors duration-300 ${
                    currentStage >= 3 ? 'bg-[#0c831f]' : currentStage === 2 ? 'bg-amber-400 animate-pulse' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStage >= 3 ? (
                      <i class="fa-solid fa-check"></i>
                    ) : currentStage === 2 ? (
                      <i class="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                      <i class="fa-solid fa-motorcycle text-[8px]"></i>
                    )}
                  </div>
                  <div>
                    <h5 class={`text-xs sm:text-sm font-bold ${currentStage === 2 ? 'text-amber-500 font-extrabold' : 'text-blinkit-dark'}`}>
                      Rider is En Route
                    </h5>
                    <p class="text-xs text-blinkit-gray mt-0.5 leading-relaxed">Ramesh Kumar is riding towards your address with contactless safety kit.</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div class={`relative transition-opacity duration-300 ${currentStage >= 3 ? '' : 'opacity-40'}`}>
                  <div class={`absolute -left-[27px] top-1 w-5.5 h-5.5 rounded-full text-white flex items-center justify-center text-[10px] border-4 border-white shadow-xs transition-colors duration-300 ${
                    currentStage === 3 ? 'bg-[#0c831f]' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStage === 3 ? (
                      <i class="fa-solid fa-check"></i>
                    ) : (
                      <i class="fa-solid fa-circle text-[6px]"></i>
                    )}
                  </div>
                  <div>
                    <h5 class={`text-xs sm:text-sm font-bold ${currentStage === 3 ? 'text-[#0c831f] font-extrabold' : 'text-blinkit-dark'}`}>
                      Delivered
                    </h5>
                    <p class="text-xs text-blinkit-gray mt-0.5 leading-relaxed">Order arrived safely. Thank you for shopping with Blinkit!</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Empty / No Active Order State */
        <div class="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center py-12 text-blinkit-gray mb-12">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔔
          </div>
          <h3 class="font-outfit font-bold text-gray-800 text-lg">No Active Orders</h3>
          <p class="text-xs mt-2 leading-relaxed max-w-[280px] mx-auto">
            You don't have any orders processing right now. Purchase groceries from our storefront to see real-time updates.
          </p>
          <Link 
            to="/" 
            class="mt-6 inline-block bg-[#0c831f] hover:bg-[#0b721b] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
          >
            Browse Storefront
          </Link>
        </div>
      )}

      {/* Past Orders Section (Always visible below) */}
      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-4xl mx-auto">
        <h3 class="font-outfit font-extrabold text-lg sm:text-xl mb-4 text-blinkit-dark text-left">Past Orders</h3>
        {pastOrders.length === 0 ? (
          <p class="text-xs text-gray-400 py-6 text-center">No past orders in your delivery history.</p>
        ) : (
          <div class="divide-y divide-gray-100">
            {pastOrders.map(order => (
              <div key={order.id} class="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-left">
                <div class="min-w-0 pr-4">
                  <h4 class="text-xs sm:text-sm font-bold text-blinkit-dark truncate" title={order.items}>{order.items}</h4>
                  <div class="flex items-center gap-2 text-[10px] sm:text-xs text-blinkit-gray font-semibold mt-1">
                    <span>{order.date}</span>
                    <span>•</span>
                    <span>ID: {order.id}</span>
                  </div>
                </div>
                <div class="text-right shrink-0 flex flex-col items-end">
                  <span class="text-xs sm:text-sm font-black text-black">₹{order.total}</span>
                  <div class="flex items-center gap-2 mt-1.5">
                    <span class="text-[9px] font-bold text-[#0c831f] bg-green-50 px-2 py-0.5 rounded-md">
                      {order.status}
                    </span>
                    <button
                      onClick={() => navigate('/support', { state: { orderId: order.id } })}
                      class="text-[9px] font-extrabold text-[#0c831f] hover:text-[#0b721b] border border-[#0c831f]/30 hover:bg-emerald-50/50 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                    >
                      Need Help? 💬
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Mock Caller Modal Alert */}
      {showCallAlert && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div class="bg-[#1c1c1c] text-white rounded-3xl max-w-xs w-full p-6 text-center shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Phone Pulse Icon */}
            <div class="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20"></span>
              <i class="fa-solid fa-phone text-2xl text-blinkit-green"></i>
            </div>
            
            {/* Caller Info */}
            <h4 class="font-bold text-base">Ramesh Kumar</h4>
            <p class="text-[11px] text-gray-400 mt-1">Blinkit Delivery Partner</p>
            
            <div class="my-6 space-y-1">
              <p class="text-xs font-semibold text-blinkit-green uppercase tracking-widest animate-pulse">
                {callActive ? "Call Active" : "Connecting..."}
              </p>
              <p class="text-xl font-bold font-mono">
                {formatCallTime(callTimer)}
              </p>
            </div>

            <p class="text-[9px] text-gray-500 mb-6">
              Your number is masked for privacy. Customer support: 1800-BLINKIT.
            </p>

            <button 
              onClick={closeCallAlert}
              class="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              Hang Up Call
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
