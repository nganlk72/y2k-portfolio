import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StartScreen({ onStart }) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const i = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden" onClick={onStart}>
      {/* Glitchy background grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(100px)', animation: 'scroll 2s linear infinite' }} />
      
      <style>{`
        @keyframes scroll { from { background-position: 0 0; } to { background-position: 0 40px; } }
        .text-glow { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; }
      `}</style>

      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-pixel text-5xl md:text-7xl text-y2k-pink mb-4 text-glow text-center cursor-pointer"
      >
        LOVE<br/>GAME
      </motion.h1>
      
      <h2 className="font-pixel text-xl text-white mb-20 tracking-widest text-center">
        PORTFOLIO EDITION
      </h2>

      <button 
        className={`font-pixel text-2xl text-y2k-green transition-opacity ${blink ? 'opacity-100' : 'opacity-0'} hover:text-white drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]`}
        onClick={onStart}
      >
        &gt; PRESS START &lt;
      </button>

      <div className="absolute bottom-4 font-pixel text-xs text-gray-500">
        © 2000s DIGITAL NOSTALGIA
      </div>
    </div>
  );
}
