
import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onRevealStart?: () => void;
  triggerExit?: boolean; // New prop to wait for full site load
}

const Loader: React.FC<LoaderProps> = ({ onRevealStart, triggerExit }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [readyToExit, setReadyToExit] = useState(false);

  useEffect(() => {
    // Only proceed with the exit if the safety timer OR the trigger condition is met
    // We add a safety minimum time (2.5s) even if the site loads instantly for aesthetics
    const safetyTimer = setTimeout(() => {
      setReadyToExit(true);
    }, 2500);

    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    // Both full load trigger AND safety timer must be true to start the reveal
    if (triggerExit && readyToExit && !isFadingOut) {
      setIsFadingOut(true);
      if (onRevealStart) onRevealStart();
      setTimeout(() => setIsVisible(false), 1200); 
    }
  }, [triggerExit, readyToExit, onRevealStart, isFadingOut]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Top Half Curtain */}
      <div 
        className={`fixed top-0 left-0 w-full h-[50vh] bg-[#050505] transition-transform duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
          isFadingOut ? '-translate-y-full' : 'translate-y-0'
        }`}
      />
      
      {/* Bottom Half Curtain */}
      <div 
        className={`fixed bottom-0 left-0 w-full h-[50vh] bg-[#050505] transition-transform duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${
          isFadingOut ? 'translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* Central Content */}
      <div className={`relative z-[110] flex flex-col items-center transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
      }`}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="loader-w"
        >
          <defs>
            <linearGradient id="paint0_linear" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <mask id="w-mask">
              <path
                d="M15 25L37 75L50 45L63 75L85 25"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </mask>
          </defs>
          <g mask="url(#w-mask)">
            <rect 
              x="-50" 
              y="-50" 
              width="200" 
              height="200" 
              fill="url(#paint0_linear)" 
              className="loader-gradient-rect"
            />
          </g>
          <path
            d="M15 25L37 75L50 45L63 75L85 25"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-cyan-400 font-bold tracking-[0.3em] text-xs uppercase animate-pulse">
            {!triggerExit ? "Awaiting Network..." : "Initializing Intelligence"}
          </span>
          <div className="w-32 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-[2500ms] ease-out w-full origin-left ${triggerExit && readyToExit ? 'scale-x-100' : 'scale-x-50'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
