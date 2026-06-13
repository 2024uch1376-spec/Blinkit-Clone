import React, { useState, useEffect } from 'react';

const MOCK_LOCATIONS = [
  "Home - Sector 62, Noida, UP",
  "Office - Block C, Sector 62, Noida",
  "Parents - Sector 15, Vasundhara",
  "Howrah Railway Station, Howrah, WB",
  "Indirapuram, Ghaziabad, UP",
  "Connaught Place, New Delhi, DL",
  "DLF Phase 3, Gurugram, HR",
  "Salt Lake City, Kolkata, WB",
  "Park Street, Kolkata, WB"
];

const POPULAR_LOCATIONS = [
  "Sector 62, Noida, UP",
  "Howrah Railway Station, Howrah, WB",
  "Connaught Place, New Delhi, DL",
  "DLF Phase 3, Gurugram, HR"
];

export default function LocationSearchModal({ 
  isOpen, 
  onClose, 
  location, 
  setLocation 
}) {
  if (!isOpen) return null;

  const [query, setQuery] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  // Reset states on opening
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setIsDetecting(false);
    }
  }, [isOpen]);

  // Handle GPS mock detection simulation
  const handleDetectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      // Pick a nearby mock location
      const randomLoc = MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
      setLocation(randomLoc);
      setIsDetecting(false);
      onClose();
    }, 1200);
  };

  // Autocomplete filtering matches
  const filteredSuggestions = MOCK_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      onClick={onClose} 
      class="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 pt-[10vh]"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transform transition-all overflow-hidden flex flex-col space-y-5"
      >
        
        {/* Header */}
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="font-outfit font-extrabold text-lg sm:text-xl text-[#1c1c1c]">Change Location</h3>
          <button 
            onClick={onClose} 
            class="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Close location search"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Search Input Bar */}
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search delivery address (e.g. Noida, Kolkata)..."
            class="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl outline-none focus:bg-white focus:border-[#0c831f] transition-all font-medium placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="fa-solid fa-circle-xmark text-sm"></i>
            </button>
          )}
        </div>

        {/* GPS Geolocation simulation trigger */}
        <button
          onClick={handleDetectLocation}
          disabled={isDetecting}
          class="w-full bg-[#0c831f]/5 border border-[#0c831f]/20 hover:bg-[#0c831f]/10 text-[#0c831f] py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
        >
          {isDetecting ? (
            <>
              <i class="fa-solid fa-spinner animate-spin"></i>
              <span>Detecting your coordinates...</span>
            </>
          ) : (
            <>
              <i class="fa-solid fa-location-crosshairs"></i>
              <span>Detect Current Location (via GPS)</span>
            </>
          )}
        </button>

        {/* Suggestion Lists */}
        <div class="flex-grow overflow-y-auto max-h-[40vh] pr-1">
          {query.trim() === "" ? (
            <div class="space-y-4 text-left">
              <div>
                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Recent/Popular Cities</h4>
                <div class="grid grid-cols-2 gap-2">
                  {POPULAR_LOCATIONS.map(city => (
                    <button
                      key={city}
                      onClick={() => { setLocation(city); onClose(); }}
                      class="text-left py-2.5 px-3 border border-gray-100 hover:border-[#0c831f]/30 hover:bg-[#0c831f]/2 text-xs font-semibold rounded-lg text-gray-600 hover:text-blinkit-green cursor-pointer transition-all truncate"
                    >
                      <i class="fa-solid fa-city mr-1.5 opacity-65 text-[10px]"></i>
                      {city.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Available Addresses</h4>
                <div class="space-y-1.5">
                  {MOCK_LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      onClick={() => { setLocation(loc); onClose(); }}
                      class="w-full text-left p-3 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl text-xs font-medium text-gray-700 flex items-center gap-2.5 cursor-pointer transition-all"
                    >
                      <i class="fa-solid fa-location-dot text-gray-400 text-xs shrink-0"></i>
                      <span class="truncate">{loc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div class="text-left space-y-1.5">
              <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Search Results</h4>
              {filteredSuggestions.length === 0 ? (
                <div class="py-6 text-center text-gray-400 text-xs">
                  <i class="fa-solid fa-location-dot opacity-35 mb-1.5 text-lg block"></i>
                  No matching locations found for "{query}"
                </div>
              ) : (
                filteredSuggestions.map(loc => (
                  <button
                    key={loc}
                    onClick={() => { setLocation(loc); onClose(); }}
                    class="w-full text-left p-3 hover:bg-[#0c831f]/2 border border-transparent hover:border-[#0c831f]/10 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2.5 cursor-pointer transition-all hover:text-blinkit-green"
                  >
                    <i class="fa-solid fa-location-dot text-gray-400 text-xs shrink-0"></i>
                    <span class="truncate">{loc}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
