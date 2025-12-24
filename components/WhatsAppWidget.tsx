
import React from 'react';

interface WhatsAppWidgetProps {
  isVisible: boolean;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ isVisible }) => {
  return (
    <a
      href="https://wa.me/447577254566?text=Hey%20Wavilog%20I%20need%20Help!"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-8 right-8 z-[60] group flex items-center gap-3 bg-green-500 text-white p-4 rounded-full shadow-[0_15px_40px_rgba(34,197,94,0.5)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.7,0.64,1)] transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100 rotate-0' : 'translate-y-40 opacity-0 scale-50 rotate-12 pointer-events-none'
      } hover:scale-110 active:scale-95`}
      aria-label="Contact on WhatsApp"
    >
      <div className="absolute -inset-1.5 bg-green-500 rounded-full animate-ping opacity-20 pointer-events-none group-hover:hidden"></div>
      
      <div className="hidden md:block overflow-hidden transition-all duration-700 max-w-0 group-hover:max-w-xs">
        <span className="whitespace-nowrap font-bold text-sm px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Hey Wavilog, I need Help!
        </span>
      </div>
      
      <div className="relative">
        <svg
          className="w-8 h-8 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.05c0 2.123.554 4.197 1.606 6.03L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.637 0 12.046-5.411 12.049-12.05a11.811 11.811 0 00-3.526-8.514" />
        </svg>
      </div>
    </a>
  );
};

export default WhatsAppWidget;