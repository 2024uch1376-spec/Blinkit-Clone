// Product Data Store
const products = [
  {
    id: 1,
    name: "Amul Taaza Toned Fresh Milk",
    category: "dairy",
    categoryLabel: "Dairy & Breakfast",
    weight: "500 ml",
    price: 27,
    time: "12 MINS",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    name: "English Oven Sliced Brown Bread",
    category: "dairy",
    categoryLabel: "Dairy & Breakfast",
    weight: "400 g",
    price: 45,
    time: "10 MINS",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    name: "Amul Butter Pasteurized (Salted)",
    category: "dairy",
    categoryLabel: "Dairy & Breakfast",
    weight: "100 g",
    price: 58,
    time: "9 MINS",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    name: "Farm Fresh Large Brown Eggs",
    category: "dairy",
    categoryLabel: "Dairy & Breakfast",
    weight: "6 units",
    price: 52,
    time: "12 MINS",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    name: "Mother Dairy Ultimate Paneer",
    category: "dairy",
    categoryLabel: "Dairy & Breakfast",
    weight: "200 g",
    price: 85,
    time: "11 MINS",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80"
  },
  // Fruits & Vegetables
  {
    id: 6,
    name: "Fresh Premium Banana (Robusta)",
    category: "fruits",
    categoryLabel: "Vegetables & Fruits",
    weight: "1 kg (approx 6-8 units)",
    price: 60,
    time: "9 MINS",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 7,
    name: "Hybrid Juicy Tomato (Local)",
    category: "fruits",
    categoryLabel: "Vegetables & Fruits",
    weight: "500 g",
    price: 25,
    time: "10 MINS",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80"
  },
  // Munchies
  {
    id: 8,
    name: "Lay's Classic Salted Potato Chips",
    category: "munchies",
    categoryLabel: "Munchies & Snacks",
    weight: "50 g",
    price: 20,
    time: "8 MINS",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d20?auto=format&fit=crop&w=300&q=80"
  },
  // Cold Drinks
  {
    id: 9,
    name: "Coca-Cola Original Taste Can",
    category: "drinks",
    categoryLabel: "Cold Drinks & Juices",
    weight: "330 ml",
    price: 40,
    time: "10 MINS",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80"
  }
];

// Categories List
const categories = [
  { id: "dairy", name: "Dairy & Breakfast", emoji: "🥛", bgColor: "bg-blue-50/50 hover:bg-blue-100/30" },
  { id: "fruits", name: "Vegetables & Fruits", emoji: "🍎", bgColor: "bg-green-50/50 hover:bg-green-100/30" },
  { id: "munchies", name: "Munchies", emoji: "🍿", bgColor: "bg-yellow-50/50 hover:bg-yellow-100/30" },
  { id: "drinks", name: "Cold Drinks", emoji: "🥤", bgColor: "bg-red-50/50 hover:bg-red-100/30" },
];

// Application State
const state = {
  cart: {}, // id -> quantity
  selectedCategory: "dairy", // default shows Dairy & Breakfast
  searchQuery: ""
};

// Initialize Page Content
window.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  updateCartUI();
});

// Render Category Horizontal Scroll Items with modified borders
function renderCategories() {
  const container = document.getElementById("category-row");
  container.innerHTML = categories.map(cat => {
    const isActive = state.selectedCategory === cat.id;
    // Keep border width consistent at border-2 to prevent layout shifts. Scale card only.
    const borderStyle = isActive 
      ? 'border-2 border-blinkit-green scale-105 shadow-sm bg-blinkit-lightGreen' 
      : 'border-2 border-gray-100 hover:border-blinkit-green/40 hover:-translate-y-0.5';
    
    return `
      <div 
        onclick="selectCategory('${cat.id}')" 
        class="flex-shrink-0 snap-start text-center cursor-pointer transition-all duration-200 select-none group"
      >
        <div class="w-24 h-24 ${cat.bgColor} ${borderStyle} rounded-2xl flex items-center justify-center text-4xl shadow-xs transition-all relative overflow-hidden">
          <span class="z-10">${cat.emoji}</span>
          <div class="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </div>
        <p class="text-xs font-bold text-blinkit-dark mt-2.5 max-w-[96px] mx-auto truncate">${cat.name}</p>
      </div>
    `;
  }).join('');
}

// Scroll Category Panel
function scrollCategories(distance) {
  const container = document.getElementById("category-row");
  container.scrollBy({ left: distance, behavior: 'smooth' });
}

// Handle Category Filter Click
function selectCategory(categoryId) {
  state.selectedCategory = categoryId;
  state.searchQuery = ""; // Clear search when category changes
  document.getElementById("search-bar").value = "";
  document.getElementById("search-clear-btn").classList.add("hidden");
  
  const categoryData = categories.find(c => c.id === categoryId);
  document.getElementById("grid-title").innerText = categoryData ? categoryData.name : "Dairy & Breakfast";
  
  document.getElementById("reset-filter-btn").classList.add("hidden");
  
  renderCategories();
  renderProducts();
}

// Filter products and render
function renderProducts() {
  const grid = document.getElementById("product-grid");
  
  // Filter logic
  let filtered = products;
  
  if (state.searchQuery.trim() !== "") {
    const query = state.searchQuery.toLowerCase();
    filtered = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.categoryLabel.toLowerCase().includes(query)
    );
    document.getElementById("grid-title").innerText = `Search results for "${state.searchQuery}"`;
    document.getElementById("reset-filter-btn").classList.remove("hidden");
  } else {
    filtered = products.filter(p => p.category === state.selectedCategory);
  }

  document.getElementById("grid-count").innerText = `${filtered.length} items`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-blinkit-gray">
        <i class="fa-solid fa-magnifying-glass text-4xl opacity-20 mb-3"></i>
        <h3 class="font-bold text-base text-gray-700">No items match your search</h3>
        <p class="text-xs mt-1">Try searching for other products, e.g., 'milk', 'bread', or 'eggs'.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const qty = state.cart[product.id] || 0;
    
    // Dynamic ADD button component
    let buttonHTML = "";
    if (qty === 0) {
      buttonHTML = `
        <button 
          onclick="addToCart(${product.id})" 
          class="w-20 border border-blinkit-green text-blinkit-green hover:bg-blinkit-lightGreen bg-white font-extrabold text-[11px] uppercase py-1.5 rounded-lg shadow-xs hover:shadow active:scale-95 transition-all text-center select-none cursor-pointer"
        >
          ADD
        </button>
      `;
    } else {
      buttonHTML = `
        <div class="flex items-center justify-between w-20 bg-blinkit-green text-white font-bold text-xs rounded-lg shadow-xs overflow-hidden select-none">
          <button onclick="decrementQty(${product.id})" class="px-2.5 py-1.5 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"><i class="fa-solid fa-minus"></i></button>
          <span class="text-xs font-bold">${qty}</span>
          <button onclick="incrementQty(${product.id})" class="px-2.5 py-1.5 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"><i class="fa-solid fa-plus"></i></button>
        </div>
      `;
    }

    return `
      <div class="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
        
        <div>
          <!-- Delivery Time Badge -->
          <span class="bg-gray-100 text-[9px] text-blinkit-dark font-extrabold px-2 py-0.5 rounded flex items-center gap-1 w-max mb-3 select-none">
            <i class="fa-solid fa-clock text-[9px]"></i> ${product.time}
          </span>

          <!-- Product Image Container - Fixed height & width for full consistency -->
          <div class="w-full h-32 flex items-center justify-center bg-gray-50/50 rounded-xl overflow-hidden p-2 mb-3 shrink-0">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            >
          </div>

          <!-- Product Info -->
          <h3 class="text-xs font-bold text-blinkit-dark leading-snug line-clamp-2 h-8 hover:text-black transition-colors" title="${product.name}">
            ${product.name}
          </h3>
          <p class="text-[10px] text-blinkit-gray font-semibold mt-1">${product.weight}</p>
        </div>

        <!-- Price & Button -->
        <div class="flex items-center justify-between mt-4">
          <span class="text-xs font-extrabold text-black">₹${product.price}</span>
          <div id="btn-container-${product.id}">
            ${buttonHTML}
          </div>
        </div>

      </div>
    `;
  }).join('');
}

// Reset Search & Filters to default category
function resetFilters() {
  selectCategory("dairy");
}

// Dynamic Search handler with clear button toggling
function handleSearch(val) {
  state.searchQuery = val;
  const clearBtn = document.getElementById("search-clear-btn");
  if (val.trim() !== "") {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
  renderProducts();
}

// Clear Search Input
function clearSearch() {
  const input = document.getElementById("search-bar");
  input.value = "";
  state.searchQuery = "";
  document.getElementById("search-clear-btn").classList.add("hidden");
  renderProducts();
}

// Cart actions
function addToCart(productId) {
  state.cart[productId] = 1;
  updateCartUI();
  renderProducts(); // Refresh products to show selector
}

// Quantity increment helper
function incrementQty(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  updateCartUI();
  renderProducts();
}

// Quantity decrement helper
function decrementQty(productId) {
  if (state.cart[productId] > 1) {
    state.cart[productId] -= 1;
  } else {
    delete state.cart[productId];
  }
  updateCartUI();
  renderProducts();
}

// Update entire Cart system states without DOM deletion bugs
function updateCartUI() {
  let totalQty = 0;
  let totalPrice = 0;
  
  const cartItemsList = document.getElementById("cart-items-list");
  const emptyState = document.getElementById("cart-empty-state");
  const summarySection = document.getElementById("cart-summary-section");
  
  let itemsHTML = "";

  for (const [idStr, qty] of Object.entries(state.cart)) {
    const id = parseInt(idStr);
    const product = products.find(p => p.id === id);
    if (product) {
      totalQty += qty;
      totalPrice += product.price * qty;

      // Render cart item list line
      itemsHTML += `
        <div class="flex items-center gap-3.5 bg-white border border-gray-100 p-3 rounded-xl shadow-xs">
          <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-contain rounded-md border border-gray-50 p-0.5">
          <div class="flex-grow">
            <h4 class="text-xs font-bold text-blinkit-dark line-clamp-1">${product.name}</h4>
            <p class="text-[10px] text-blinkit-gray font-medium mt-0.5">${product.weight}</p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-extrabold">₹${product.price * qty}</span>
              <span class="text-[10px] text-blinkit-gray font-semibold">₹${product.price} / unit</span>
            </div>
          </div>
          <div class="flex items-center justify-between w-16 bg-blinkit-green text-white font-bold text-[10px] rounded-lg overflow-hidden shrink-0 select-none">
            <button onclick="decrementQty(${product.id})" class="px-1.5 py-1 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"><i class="fa-solid fa-minus"></i></button>
            <span>${qty}</span>
            <button onclick="incrementQty(${product.id})" class="px-1.5 py-1 hover:bg-blinkit-greenHover active:scale-75 transition-all cursor-pointer"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
      `;
    }
  }

  // Check empty state using separate child toggles to prevent node destruction
  if (totalQty === 0) {
    if (cartItemsList) cartItemsList.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    if (summarySection) summarySection.classList.add("hidden");
  } else {
    if (emptyState) emptyState.classList.add("hidden");
    if (summarySection) summarySection.classList.remove("hidden");
    if (cartItemsList) cartItemsList.innerHTML = itemsHTML;
  }

  // Update Header Cart Button Text (Blinkit style: displays items and total price, or "My Cart" when empty)
  const btnText = totalQty === 0 ? "My Cart" : `${totalQty} items | ₹${totalPrice}`;
  
  const cartBtnTextDesktop = document.getElementById("cart-btn-text");
  const cartBtnTextMobile = document.getElementById("cart-btn-text-mobile");
  if (cartBtnTextDesktop) cartBtnTextDesktop.innerText = btnText;
  if (cartBtnTextMobile) cartBtnTextMobile.innerText = btnText;
  
  // Update Drawer summary values
  const drawerQtyBadge = document.getElementById("cart-drawer-qty");
  const billSubtotalText = document.getElementById("bill-subtotal");
  const billGrandTotalText = document.getElementById("bill-grand-total");
  const btnTotalValText = document.getElementById("btn-total-val");

  if (drawerQtyBadge) drawerQtyBadge.innerText = totalQty === 1 ? "1 item" : `${totalQty} items`;
  if (billSubtotalText) billSubtotalText.innerText = `₹${totalPrice}`;
  
  const grandTotal = totalPrice > 0 ? totalPrice + 15 + 4 : 0;
  if (billGrandTotalText) billGrandTotalText.innerText = `₹${grandTotal}`;
  if (btnTotalValText) btnTotalValText.innerText = `₹${grandTotal}`;
}

// Toggle Cart Drawer overlay & panel
function toggleCartDrawer(open) {
  const overlay = document.getElementById("cart-drawer-overlay");
  const drawer = document.getElementById("cart-drawer");
  
  if (open) {
    overlay.classList.remove("pointer-events-none", "opacity-0");
    overlay.classList.add("opacity-100");
    drawer.classList.remove("translate-x-full");
    drawer.classList.add("animate-slide-in");
  } else {
    overlay.classList.add("pointer-events-none", "opacity-0");
    overlay.classList.remove("opacity-100");
    drawer.classList.remove("animate-slide-in");
    drawer.classList.add("translate-x-full");
  }
}

// Mock Location selector change
function toggleLocationSelector() {
  const current = document.getElementById("current-location");
  const locs = [
    "Home - Sector 62, Noida, UP",
    "Office - Block C, Sector 62, Noida",
    "Other - Indirapuram, Ghaziabad",
    "Parents - Sector 15, Vasundhara"
  ];
  const index = locs.indexOf(current.innerText);
  current.innerText = locs[(index + 1) % locs.length];
}

// Proceed checkout (success simulation)
function handleCheckout() {
  // Close Cart Drawer
  toggleCartDrawer(false);
  
  // Clear Cart Data state
  state.cart = {};
  updateCartUI();
  renderProducts();

  // Trigger success checkout modal
  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("pointer-events-none", "opacity-0");
  modal.classList.add("opacity-100");
  modal.firstElementChild.classList.remove("scale-95");
  modal.firstElementChild.classList.add("scale-100");
}

// Close checkout success tracker dialog
function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  modal.classList.add("pointer-events-none", "opacity-0");
  modal.classList.remove("opacity-100");
  modal.firstElementChild.classList.add("scale-95");
  modal.firstElementChild.classList.remove("scale-100");
}
