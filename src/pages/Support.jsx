import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { products } from '../data/products';

export default function Support({ orders = [], walletBalance, setWalletBalance, user, onLoginClick }) {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const chatContainerRef = useRef(null);

  // States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Checklist for missing/damaged items
  const [itemChecklist, setItemChecklist] = useState([]);
  const [refundProcessed, setRefundProcessed] = useState(false);
  const [customInput, setCustomInput] = useState('');

  // Handle initial auto-selection of order from router state
  useEffect(() => {
    if (routerLocation.state?.orderId) {
      const order = orders.find(o => o.id === routerLocation.state.orderId);
      if (order) {
        handleSelectOrder(order);
      }
    }
  }, [routerLocation.state, orders]);

  // Scroll to bottom of chat container internally
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setSelectedIssue('');
    setChatMessages([]);
    setRefundProcessed(false);

    // Parse order items string "Taaza Toned Milk x2, Brown Bread x1"
    const items = order.items.split(', ').map(itemStr => {
      const parts = itemStr.split(' x');
      const name = parts[0];
      const qty = parts[1] ? parseInt(parts[1]) : 1;
      
      // Look up price from catalog
      const match = products.find(p => 
        p.name.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(p.name.toLowerCase().replace('amul ', '').replace('fresh ', '').replace('mother dairy ', ''))
      );
      const price = match ? match.price : 40; // Default price if not matched
      
      return { name, qty, price, checked: false };
    });
    setItemChecklist(items);
  };

  const startChat = (issue) => {
    setSelectedIssue(issue);
    setIsTyping(true);

    const initialGreeting = {
      sender: 'bot',
      text: `Hello! I am your Blinkit Support Assistant. I see you have selected order ${selectedOrder.id} regarding: "${issue}".`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setTimeout(() => {
      setChatMessages([initialGreeting]);
      setIsTyping(false);
      
      // Trigger subsequent prompt based on issue
      triggerBotResponse(issue);
    }, 1000);
  };

  const triggerBotResponse = (issue) => {
    setIsTyping(true);
    setTimeout(() => {
      let followUp = '';
      if (issue === 'Damaged items received' || issue === 'Items missing from my order') {
        followUp = "Please select the items you would like a refund for from the checklist below, and click 'Request Refund'.";
      } else if (issue === 'Delivery delay / Scooter query') {
        // Comfort refund trigger
        followUp = "Checking delivery status... It looks like our delivery partner encountered traffic. As an apology for the delay, we have credited ₹25 comfort refund to your wallet!";
        
        // Execute comfort refund
        const parsedRefund = 25;
        const newBalance = walletBalance + parsedRefund;
        setWalletBalance(newBalance);
        
        // Log transaction
        const savedTx = localStorage.getItem('blinkit_wallet_transactions');
        const transactionsList = savedTx ? JSON.parse(savedTx) : [];
        const newTx = {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          title: `Comfort Refund (Order Delay: ${selectedOrder.id})`,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: "credit",
          amount: parsedRefund,
          status: "Success"
        };
        localStorage.setItem('blinkit_wallet_transactions', JSON.stringify([newTx, ...transactionsList]));
        setRefundProcessed(true);
      } else {
        followUp = "How can I help you today? Please type your query below and our team will get back to you shortly.";
      }

      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: followUp,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCheckboxChange = (index) => {
    setItemChecklist(prev => prev.map((item, idx) => 
      idx === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const processItemRefund = () => {
    const selectedItems = itemChecklist.filter(item => item.checked);
    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const totalRefund = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    setIsTyping(true);

    setTimeout(() => {
      // Execute refund
      const newBalance = walletBalance + totalRefund;
      setWalletBalance(newBalance);

      // Log transaction
      const savedTx = localStorage.getItem('blinkit_wallet_transactions');
      const transactionsList = savedTx ? JSON.parse(savedTx) : [];
      const refundDetails = selectedItems.map(item => `${item.name} (x${item.qty})`).join(', ');
      
      const newTx = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `Refund for: ${refundDetails.length > 28 ? refundDetails.substring(0, 25) + '...' : refundDetails}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: "credit",
        amount: totalRefund,
        status: "Success"
      };

      localStorage.setItem('blinkit_wallet_transactions', JSON.stringify([newTx, ...transactionsList]));
      setRefundProcessed(true);

      setChatMessages(prev => [...prev, 
        {
          sender: 'user',
          text: `Requesting refund for: ${selectedItems.map(item => `${item.name} x${item.qty}`).join(', ')}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        {
          sender: 'bot',
          text: `Refund Processed! We have initiated a credit of ₹${totalRefund.toFixed(2)} to your Blinkit Wallet. Your wallet balance has been updated.`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userText = customInput;
    setChatMessages(prev => [...prev, {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    setCustomInput('');
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: "Thank you for the information. I have opened a support ticket for this issue. A support executive will contact you at your registered mobile number shortly.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-extrabold text-gray-900">Support Access Restricted</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Please log in to contact customer support and manage orders help tickets. Redirecting...
        </p>
        <button 
          onClick={onLoginClick}
          className="w-full bg-[#0c831f] hover:bg-[#0b721b] text-white font-extrabold py-3 rounded-2xl cursor-pointer transition-colors"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="space-y-1 text-left">
          <h2 className="text-2xl font-black text-gray-900 font-outfit">Support & Refund Center 💬</h2>
          <p className="text-xs text-gray-400 font-semibold">Choose an order and get instant assistance</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-xs font-black text-[#0c831f] hover:text-[#0b721b] bg-emerald-50 hover:bg-emerald-100/50 px-4 py-2 rounded-xl cursor-pointer transition-colors"
        >
          Back to Store
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Order selection list */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="font-extrabold text-gray-800 text-sm text-left">Select Order for Support</h4>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-gray-400 text-xs font-semibold">
                No orders placed yet.
              </div>
            ) : (
              orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer block focus:outline-none ${
                    selectedOrder?.id === order.id 
                      ? 'border-[#0c831f] bg-emerald-50/10 shadow-xs' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900">{order.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      order.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold">{order.date}</p>
                  <p className="text-xs text-gray-600 truncate mt-2 font-medium">{order.items}</p>
                  <p className="text-xs font-black text-gray-900 mt-2">₹{order.total}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Chat & interactive options */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
              
              {/* Chat Header */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs font-black text-gray-900">Support Assistant</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Order: {selectedOrder.id}</p>
                </div>
                {selectedIssue && (
                  <button 
                    onClick={() => { setSelectedIssue(''); setChatMessages([]); setRefundProcessed(false); }}
                    className="text-[10px] font-bold text-red-500 hover:text-red-600"
                  >
                    Change Issue
                  </button>
                )}
              </div>

              {/* Chat Body & Messages */}
              {!selectedIssue ? (
                // Issue Selection View
                <div className="flex-grow flex flex-col justify-center p-8 space-y-6 text-center">
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-gray-900 text-base">What's the issue with this order?</h5>
                    <p className="text-xs text-gray-400 font-medium">Select a category below to open support assistant</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'Damaged items received', icon: '🍎', label: 'Damaged items received' },
                      { id: 'Items missing from my order', icon: '📦', label: 'Items missing from my order' },
                      { id: 'Delivery delay / Scooter query', icon: '⏳', label: 'Delivery delay / Scooter query' },
                      { id: 'Other queries', icon: '❓', label: 'Other queries' }
                    ].map(issue => (
                      <button
                        key={issue.id}
                        onClick={() => startChat(issue.id)}
                        className="p-5 border border-gray-100 hover:border-[#0c831f] hover:bg-emerald-50/10 rounded-2xl text-left cursor-pointer transition-all hover:shadow-xs group flex items-start gap-3"
                      >
                        <span className="text-2xl">{issue.icon}</span>
                        <div className="space-y-0.5 mt-0.5">
                          <span className="text-xs font-black text-gray-800 group-hover:text-blinkit-green transition-colors">{issue.label}</span>
                          <p className="text-[9px] text-gray-400 font-medium">Get assistance regarding this query</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Live Chat Feed View
                <div className="flex-grow flex flex-col justify-between">
                  <div ref={chatContainerRef} className="p-6 space-y-4 max-h-[350px] overflow-y-auto flex-grow bg-slate-50/30">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-100`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                          msg.sender === 'user' 
                            ? 'bg-[#0c831f] text-white font-medium rounded-tr-none' 
                            : 'bg-white border border-gray-100 text-gray-800 leading-relaxed font-semibold rounded-tl-none shadow-xs'
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`block text-[8px] text-right mt-1.5 font-medium ${
                            msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                          }`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow-xs flex items-center gap-1 select-none font-bold">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive input/panels depending on issue type */}
                  <div className="p-5 border-t border-gray-100 bg-white">
                    {(selectedIssue === 'Damaged items received' || selectedIssue === 'Items missing from my order') && !refundProcessed ? (
                      // Checklist item refund selector panel
                      <div className="space-y-4 text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Select items to refund</p>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto border border-gray-50 rounded-xl p-3 bg-gray-50/20">
                          {itemChecklist.map((item, idx) => (
                            <label key={idx} className="flex items-center gap-3 py-1 cursor-pointer select-none text-xs font-semibold text-gray-800 hover:text-black">
                              <input 
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(idx)}
                                className="w-4 h-4 accent-[#0c831f] cursor-pointer rounded"
                              />
                              <span className="flex-grow truncate">{item.name}</span>
                              <span className="text-gray-400 text-[10px]">Qty: {item.qty}</span>
                              <span className="font-extrabold text-gray-900">₹{item.price * item.qty}</span>
                            </label>
                          ))}
                        </div>
                        <button
                          onClick={processItemRefund}
                          className="w-full bg-[#0c831f] hover:bg-[#0b721b] text-white font-extrabold py-3 rounded-xl cursor-pointer text-xs active:scale-98 transition-transform"
                        >
                          Request Refund (₹{itemChecklist.filter(item => item.checked).reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)})
                        </button>
                      </div>
                    ) : selectedIssue === 'Other queries' ? (
                      // Custom text input chat box
                      <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          placeholder="Type your message here..."
                          className="flex-grow px-4 py-3 bg-[#f8f8f8] border border-[#eeeeee] rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#0c831f]/20 focus:border-[#0c831f]"
                        />
                        <button 
                          type="submit"
                          className="bg-[#0c831f] hover:bg-[#0b721b] text-white p-3.5 rounded-xl cursor-pointer flex items-center justify-center transition-colors active:scale-95"
                          aria-label="Send"
                        >
                          <i className="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                      </form>
                    ) : (
                      // Ticket summary view when refunded or completed
                      <div className="text-center py-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 select-none">
                          <i className="fa-solid fa-circle-check"></i> Ticket Resolved & Closed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Select order fallback banner
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[500px]">
              <span className="text-5xl animate-bounce duration-1000">💬</span>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800 text-base">Support Chat Simulator</h4>
                <p className="text-xs text-gray-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                  Select an order from the list on the left to start an interactive support session with our bot assistant.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
