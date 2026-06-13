import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Wallet({ walletBalance, setWalletBalance, user, onLoginClick }) {
  const navigate = useNavigate();
  const [addAmount, setAddAmount] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Load and seed transactions
  useEffect(() => {
    const savedTx = localStorage.getItem('blinkit_wallet_transactions');
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      // Seed initial transactions
      const seed = [
        {
          id: "TXN-829104",
          title: "Sign-up Promo Bonus",
          date: "10 Jun 2026",
          type: "credit",
          amount: 150,
          status: "Success"
        }
      ];
      localStorage.setItem('blinkit_wallet_transactions', JSON.stringify(seed));
      setTransactions(seed);
    }
  }, []);

  // Redirect if logged out
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleAddMoney = (e) => {
    e.preventDefault();
    const parsed = parseFloat(addAmount);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newBalance = walletBalance + parsed;
    setWalletBalance(newBalance);

    const newTx = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      title: "Funds Added to Wallet",
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: "credit",
      amount: parsed,
      status: "Success"
    };

    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    localStorage.setItem('blinkit_wallet_transactions', JSON.stringify(updatedTx));

    setSuccessMsg(`Successfully added ₹${parsed} to your wallet!`);
    setAddAmount('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const selectQuickAmount = (amt) => {
    setAddAmount(amt.toString());
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-extrabold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Please log in to view your wallet balance and manage funds. Redirecting you to the home page...
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors cursor-pointer group"
      >
        <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        <span>Go Back</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Card and Quick Add Form */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Balance Card */}
          <div className="bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 opacity-10 text-9xl translate-x-6 translate-y-6 select-none font-bold">👛</div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="space-y-1 relative">
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-200">Blinkit Express Wallet</span>
              <h3 className="text-lg font-bold">Personal Wallet</h3>
            </div>

            <div className="relative mt-8">
              <p className="text-[10px] text-blue-200 font-extrabold">AVAILABLE BALANCE</p>
              <p className="text-4xl font-black mt-1 font-outfit">₹{walletBalance.toFixed(2)}</p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-blue-100 font-medium">
              <span>Active Account</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Verified Holder</span>
              </span>
            </div>
          </div>

          {/* Add Money Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-gray-800 flex items-center gap-2 text-sm">
              <span>⚡</span> Add Funds
            </h4>
            
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold animate-in zoom-in-95 duration-150">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAddMoney} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold">ENTER AMOUNT</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-extrabold text-lg">₹</span>
                  <input 
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full pl-8 pr-4 py-3 bg-[#f8f8f8] border border-[#eeeeee] rounded-xl font-bold outline-none focus:bg-white focus:ring-1 focus:ring-[#0c831f]/20 focus:border-[#0c831f]"
                  />
                </div>
              </div>

              {/* Quick Select Pills */}
              <div className="grid grid-cols-3 gap-2">
                {[100, 200, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => selectQuickAmount(amt)}
                    className="border border-gray-200 hover:border-blue-500 hover:bg-blue-50/20 text-gray-700 hover:text-blue-700 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#0c831f] hover:bg-[#0b721b] text-white font-extrabold py-3.5 rounded-xl cursor-pointer active:scale-98 transition-all text-xs"
              >
                Add Money to Wallet
              </button>
            </form>
          </div>

        </div>

        {/* Right column: Transaction History list */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 min-h-[380px] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h4 className="font-extrabold text-gray-800 text-base">Transaction Ledger</h4>
              <span className="text-xs text-gray-400 font-extrabold">{transactions.length} Records</span>
            </div>

            {transactions.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3 py-12">
                <span className="text-4xl text-gray-300">📄</span>
                <p className="text-sm font-bold text-gray-400">No transactions recorded yet</p>
                <p className="text-xs text-gray-300 max-w-[250px]">Funds added or cashback earned will show up here.</p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-50 max-h-[450px] overflow-y-auto pr-1">
                {transactions.map((tx, idx) => (
                  <div key={tx.id} className={`flex items-center justify-between py-3.5 ${idx > 0 ? 'border-t border-gray-50' : ''}`}>
                    <div className="space-y-1 text-left">
                      <p className="text-xs font-bold text-gray-900 leading-tight">{tx.title}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{tx.date} • Ref: {tx.id}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <span className={`text-sm font-black font-outfit ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full select-none">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
