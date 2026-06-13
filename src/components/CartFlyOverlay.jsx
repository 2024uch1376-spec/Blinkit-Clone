import React, { useState, useEffect } from 'react';

export default function CartFlyOverlay() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleFly = (e) => {
      const { startX, startY, image } = e.detail;

      // Locate Cart button based on active layout (desktop vs mobile)
      const cartBtn = document.getElementById('desktop-cart-btn') || document.getElementById('mobile-cart-btn');
      let endX = window.innerWidth - 80;
      let endY = 40;

      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
      }

      const id = Date.now() + Math.random();
      const newParticle = {
        id,
        startX,
        startY,
        endX: endX - 22, // subtract half size (44px/2) to center the dot on target
        endY: endY - 22,
        image
      };

      setParticles(prev => [...prev, newParticle]);
    };

    window.addEventListener('cart-item-fly', handleFly);
    return () => window.removeEventListener('cart-item-fly', handleFly);
  }, []);

  const handleAnimationEnd = (id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
    
    // Broadcast bounce event to cart buttons
    window.dispatchEvent(new CustomEvent('cart-bounce'));
  };

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          onAnimationEnd={() => handleAnimationEnd(p.id)}
          className="animate-fly-to-cart"
          style={{
            '--start-x': `${p.startX - 22}px`, // subtract half size to start centered on click coordinate
            '--start-y': `${p.startY - 22}px`,
            '--end-x': `${p.endX}px`,
            '--end-y': `${p.endY}px`
          }}
        >
          <img 
            src={p.image} 
            alt="fly item" 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
      ))}
    </>
  );
}
