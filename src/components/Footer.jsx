import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const usefulLinks1 = ["Blog", "Privacy", "Terms", "FAQs", "Security", "Contact"];
  const usefulLinks2 = ["Partner", "Franchise", "Seller", "Warehouse", "Deliver", "Resources"];
  const usefulLinks3 = ["Recipes", "Bistro", "District", "Blinkit Ambulance"];

  const categories1 = [
    "Vegetables & Fruits", "Cold Drinks & Juices", "Bakery & Biscuits", 
    "Dry Fruits, Masala & Oil", "Paan Corner", "Pharma & Wellness", 
    "Personal Care", "Magazines", "Electronics & Electricals", 
    "Toys & Games", "Rakhi Gifts"
  ];
  
  const categories2 = [
    "Dairy & Breakfast", "Instant & Frozen Food", "Sweet Tooth", 
    "Sauces & Spreads", "Organic & Premium", "Cleaning Essentials", 
    "Pet Care", "Kitchen & Dining", "Stationery Needs", "Print Store"
  ];

  const categories3 = [
    "Munchies", "Tea, Coffee & Milk Drinks", "Atta, Rice & Dal", 
    "Chicken, Meat & Fish", "Baby Care", "Home Furnishing & Decor", 
    "Beauty & Cosmetics", "Fashion & Accessories", "Books", "E-Gift Cards"
  ];

  return (
    <footer class="bg-white border-t border-gray-100 pt-14 pb-8 mt-auto w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sitemap Grid Links Section */}
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 mb-12">
          
          {/* Useful Links Column (Spans 5 cols on desktop) */}
          <div class="md:col-span-5">
            <h4 class="font-outfit font-bold text-gray-950 text-base mb-5">Useful Links</h4>
            <div class="grid grid-cols-3 gap-4 text-sm text-blinkit-gray">
              <ul class="space-y-3 font-medium text-xs">
                {usefulLinks1.map(link => (
                  <li key={link}><a href="#" class="hover:text-black transition-colors">{link}</a></li>
                ))}
              </ul>
              <ul class="space-y-3 font-medium text-xs">
                {usefulLinks2.map(link => (
                  <li key={link}><a href="#" class="hover:text-black transition-colors">{link}</a></li>
                ))}
              </ul>
              <ul class="space-y-3 font-medium text-xs">
                {usefulLinks3.map(link => (
                  <li key={link}><a href="#" class="hover:text-black transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Space filler / separator */}
          <div class="hidden md:block md:col-span-1"></div>

          {/* Categories Columns (Spans 6 cols on desktop) */}
          <div class="md:col-span-6">
            <div class="flex items-baseline gap-2 mb-5">
              <h4 class="font-outfit font-bold text-gray-950 text-base">Categories</h4>
              <Link to="/" class="text-xs font-bold text-blinkit-green hover:underline">see all</Link>
            </div>
            <div class="grid grid-cols-3 gap-4 text-sm text-blinkit-gray">
              <ul class="space-y-3 font-medium text-xs">
                {categories1.map(cat => (
                  <li key={cat}><a href="#" class="hover:text-black transition-colors">{cat}</a></li>
                ))}
              </ul>
              <ul class="space-y-3 font-medium text-xs">
                {categories2.map(cat => (
                  <li key={cat}><a href="#" class="hover:text-black transition-colors">{cat}</a></li>
                ))}
              </ul>
              <ul class="space-y-3 font-medium text-xs">
                {categories3.map(cat => (
                  <li key={cat}><a href="#" class="hover:text-black transition-colors">{cat}</a></li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright / App download / Social row */}
        <div class="border-t border-gray-100 pt-8 pb-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Copyright Info */}
          <div class="text-xs text-blinkit-gray font-medium text-center lg:text-left leading-relaxed">
            © Blink Commerce Private Limited, 2016-2026
          </div>

          {/* Download App badges */}
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-blinkit-gray uppercase tracking-wider">Download App</span>
            <div class="flex gap-2.5">
              {/* App Store Badge (CSS designed) */}
              <a 
                href="#" 
                class="bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-black transition-colors shadow-xs active:scale-95"
              >
                <i class="fa-brands fa-apple text-xl"></i>
                <div class="flex flex-col text-left leading-none">
                  <span class="text-[7px] uppercase font-bold text-gray-400">Download on the</span>
                  <span class="text-[11px] font-extrabold mt-0.5">App Store</span>
                </div>
              </a>
              
              {/* Google Play Store Badge (CSS designed) */}
              <a 
                href="#" 
                class="bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-black transition-colors shadow-xs active:scale-95"
              >
                <i class="fa-brands fa-google-play text-base text-gray-200"></i>
                <div class="flex flex-col text-left leading-none">
                  <span class="text-[7px] uppercase font-bold text-gray-400">GET IT ON</span>
                  <span class="text-[11px] font-extrabold mt-0.5">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Social media icons */}
          <div class="flex items-center gap-3">
            <a 
              href="#" 
              class="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-sm shadow-sm"
              aria-label="Facebook"
            >
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a 
              href="#" 
              class="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-sm shadow-sm"
              aria-label="X (Twitter)"
            >
              <i class="fa-brands fa-x-twitter"></i>
            </a>
            <a 
              href="#" 
              class="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-sm shadow-sm"
              aria-label="Instagram"
            >
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a 
              href="#" 
              class="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-sm shadow-sm"
              aria-label="LinkedIn"
            >
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <a 
              href="#" 
              class="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all text-sm shadow-sm"
              aria-label="Threads"
            >
              <i class="fa-brands fa-threads"></i>
            </a>
          </div>

        </div>

        {/* Disclaimer Text */}
        <div class="text-[10px] text-blinkit-gray font-medium leading-relaxed mt-4 pt-4 border-t border-gray-50 text-left">
          "Blinkit" is owned & managed by "Blink Commerce Private Limited" and is not related, linked or interconnected in whatsoever manner or nature, to "GROFFR.COM" which is a real estate services business operated by "Redstone Consultancy Services Private Limited".
        </div>

      </div>
    </footer>
  );
}
