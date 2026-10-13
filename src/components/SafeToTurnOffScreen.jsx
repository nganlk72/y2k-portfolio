import React from 'react';

export default function SafeToTurnOffScreen({ onRestart }) {
  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center select-none font-mono z-50 cursor-pointer"
      onClick={onRestart}
    >
      <div className="text-center space-y-6 px-4 max-w-xl">
        <h1 
          className="text-amber-500 text-2xl md:text-3xl font-bold tracking-wider"
          style={{
            textShadow: '0 0 10px rgba(245, 158, 11, 0.7), 0 0 20px rgba(245, 158, 11, 0.4)',
          }}
        >
          It's now safe to turn off
          <br />
          your computer.
        </h1>

        <p className="text-gray-500 text-xs">
          (Click anywhere or press the button below to restart Ngan 98)
        </p>

        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className="px-6 py-2 bg-win-gray border-2 border-white shadow-win-out active:shadow-win-in text-black font-bold text-sm cursor-pointer hover:bg-gray-200"
          >
            🔌 Turn Computer Back On
          </button>
        </div>
      </div>
    </div>
  );
}
