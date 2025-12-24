
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-full border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-md flex items-center justify-center font-bold text-black text-xl">W</div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">WAVILOG</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
          <a href="#agents" className="hover:text-cyan-400 transition-colors">AI Agents</a>
          <a href="#automation" className="hover:text-cyan-400 transition-colors">Automation</a>
        </div>

        <a 
          href="https://wa.me/447577254566?text=Hey%20Wavilog%20I%20need%20Help!" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
