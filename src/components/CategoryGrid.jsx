import React from 'react';
import { useNavigate } from 'react-router-dom';

const GRID_CATEGORIES = [
  { id: "dairy", name: "Dairy, Bread & Eggs", img: "/images/milk.png" },
  { id: "fruits", name: "Fruits & Vegetables", img: "/images/banana.png" },
  { id: "drinks", name: "Cold Drinks & Juices", img: "/images/cocacola.png" },
  { id: "munchies", name: "Snacks & Munchies", img: "/images/lays.png" },
  { id: "instant", name: "Breakfast & Instant Food", img: "/images/maggie 2.png" },
  { id: "sweet", name: "Sweet Tooth", img: "/images/cadbury silk.png" },
  { id: "bakery", name: "Bakery & Biscuits", img: "/images/gooday.png" },
  { id: "tea", name: "Tea, Coffee & Milk Drinks", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "atta", name: "Atta, Rice & Dal", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "masala", name: "Masala, Oil & More", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "sauces", name: "Sauces & Spreads", img: "/images/tomato sause.png" },
  { id: "chicken", name: "Chicken, Meat & Fish", img: "/images/meat.png" },
  { id: "organic", name: "Organic & Healthy Living", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "baby", name: "Baby Care", img: "/images/baby care.png" },
  { id: "pharma", name: "Pharma & Wellness", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "cleaning", name: "Cleaning Essentials", img: "/images/cleaning.png" },
  { id: "office", name: "Home & Office", img: "/images/home.png" },
  { id: "personal", name: "Personal Care", img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "pet", name: "Pet Care", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "clothes", name: "Clothes & Fashion", img: "/images/clothes.png" }
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      {/* 20 Categories Grid (desktop: 10 columns, tablet: 5 columns, mobile: 3 columns) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-6">
        {GRID_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="flex flex-col items-center group cursor-pointer border border-transparent select-none bg-transparent"
          >
            {/* Rounded square card frame with light blue-grey background */}
            <div className="w-full aspect-square bg-[#F2F7FD] hover:bg-[#e4effd] rounded-2xl p-2.5 flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-xs group-hover:scale-[1.03]">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover rounded-xl border border-[#F2F7FD] group-hover:rotate-1 transition-transform"
              />
            </div>
            {/* Category text label centered below */}
            <span className="text-[10px] sm:text-xs text-[#1c1c1c] font-extrabold text-center mt-2.5 leading-snug group-hover:text-blinkit-green transition-colors px-1 line-clamp-2">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
