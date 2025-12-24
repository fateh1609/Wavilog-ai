
import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('wavilog_cookie_consent');
    if (!consent) {
      // Show after a short delay so it doesn't interrupt the hero reveal immediately
      const timer = setTimeout(() => setIsVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wavilog_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md z-[70] animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="glass p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="text-cyan-400">🍪</span>
          </div>
          <h4 className="font-bold text-white">Optimize Your Experience</h4>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          We use essential cookies to store configuration data and cache assets, ensuring the website loads 
          <span className="text-cyan-400 font-semibold"> faster</span> and runs smoother for your next visit.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={handleAccept}
            className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-sm transition-all"
          >
            Accept & Speed Up
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-400 font-medium rounded-xl text-sm transition-all"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
